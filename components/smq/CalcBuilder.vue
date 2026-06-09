<template>
  <div class="qp-calc">
    <!-- Opérande 1 -->
    <div class="qp-calc__op qp-field">
      <label class="qp-label">
        {{ labelOp1 }}<span class="req">*</span>
      </label>
      <input
        v-model.number="operande1"
        class="qp-input qp-input--mono"
        :readonly="readonly"
        inputmode="decimal"
        placeholder="0"
        @input="recalculate"
      />
    </div>

    <!-- Opérateur -->
    <div class="qp-field" style="width: 70px; flex: none">
      <label class="qp-label">Opérateur</label>
      <select
        v-model="operateur"
        class="qp-select qp-calc__sign qp-input--mono"
        style="text-align: center"
        :disabled="readonly || fixedOperator"
        @change="recalculate"
      >
        <option>÷</option>
        <option>×</option>
        <option>+</option>
        <option>−</option>
      </select>
    </div>

    <!-- Opérande 2 -->
    <div class="qp-calc__op qp-field">
      <label class="qp-label">
        {{ labelOp2 }}<span class="req">*</span>
      </label>
      <input
        v-model.number="operande2"
        class="qp-input qp-input--mono"
        :readonly="readonly"
        inputmode="decimal"
        placeholder="0"
        @input="recalculate"
      />
    </div>

    <!-- Signe = -->
    <span class="qp-calc__eq">=</span>

    <!-- Résultat -->
    <div
      class="qp-calc__result"
      :class="resultatClass"
    >
      <div class="label">Résultat</div>
      <div class="value">{{ resultatAffiche }}</div>
    </div>

    <!-- Verdict conformité -->
    <div v-if="showVerdict" class="qp-calc__result" style="background: transparent; border: 1px dashed var(--qp-border-1)">
      <div class="label" style="color: var(--qp-fg-3)">Verdict</div>
      <div style="margin-top: 4px">
        <SmqStatusBadge :conformite="conformite" :solid="conformite === 'conforme'" />
      </div>
    </div>
  </div>

  <!-- Erreur division par zéro -->
  <p v-if="divisionParZero" class="qp-hint" style="color: var(--qp-danger-500); margin-top: 8px">
    Division par zéro impossible.
  </p>
</template>

<script setup>
const props = defineProps({
  modelValue:    { type: Object, default: () => ({ operande1: null, operande2: null, operateur: '÷', resultat: null }) },
  labelOp1:      { type: String, default: 'Opérande 1' },
  labelOp2:      { type: String, default: 'Opérande 2' },
  valeurCible:   { type: Number, default: null },
  critere:       { type: String, default: '≥' },  // '≥' | '≤' | '='
  readonly:      { type: Boolean, default: false },
  fixedOperator: { type: Boolean, default: false },
  showVerdict:   { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const operande1  = ref(props.modelValue?.operande1  ?? null)
const operande2  = ref(props.modelValue?.operande2  ?? null)
const operateur  = ref(props.modelValue?.operateur  ?? '÷')
const resultat   = ref(props.modelValue?.resultat   ?? null)

const divisionParZero = ref(false)

const recalculate = () => {
  divisionParZero.value = false
  const a = parseFloat(String(operande1.value).replace(',', '.'))
  const b = parseFloat(String(operande2.value).replace(',', '.'))

  if (isNaN(a) || isNaN(b)) {
    resultat.value = null
  } else if (operateur.value === '÷') {
    if (b === 0) { divisionParZero.value = true; resultat.value = null }
    else resultat.value = parseFloat((a / b).toFixed(6))
  } else if (operateur.value === '×') {
    resultat.value = parseFloat((a * b).toFixed(6))
  } else if (operateur.value === '+') {
    resultat.value = parseFloat((a + b).toFixed(6))
  } else if (operateur.value === '−') {
    resultat.value = parseFloat((a - b).toFixed(6))
  }

  emit('update:modelValue', {
    operande1: operande1.value,
    operande2: operande2.value,
    operateur: operateur.value,
    resultat:  resultat.value,
  })
}

const resultatAffiche = computed(() => {
  if (divisionParZero.value) return '—'
  if (resultat.value === null) return '—'
  return String(resultat.value).replace('.', ',')
})

const conformite = computed(() => {
  if (resultat.value === null || props.valeurCible === null) return 'en_attente'
  const r = resultat.value
  const c = props.valeurCible
  if (props.critere === '≥') return r >= c ? 'conforme' : 'non_conforme'
  if (props.critere === '≤') return r <= c ? 'conforme' : 'non_conforme'
  if (props.critere === '=') return Math.abs(r - c) < 1e-9 ? 'conforme' : 'non_conforme'
  return 'en_attente'
})

const resultatClass = computed(() => {
  if (resultat.value === null) return 'qp-calc__result--neutral'
  if (conformite.value === 'conforme') return 'qp-calc__result--ok'
  if (conformite.value === 'non_conforme') return 'qp-calc__result--err'
  return ''
})

// Sync depuis parent
watch(() => props.modelValue, (v) => {
  if (v) {
    operande1.value = v.operande1
    operande2.value = v.operande2
    operateur.value = v.operateur ?? '÷'
    resultat.value  = v.resultat
  }
}, { deep: true })

onMounted(() => {
  if (operande1.value !== null && operande2.value !== null) recalculate()
})
</script>

<style scoped>
.qp-calc__result--neutral {
  background: var(--qp-n-50);
  border: 1px solid var(--qp-border-1);
}
.qp-calc__result--neutral .label { color: var(--qp-fg-3); }
.qp-calc__result--neutral .value { color: var(--qp-fg-1); }
</style>
