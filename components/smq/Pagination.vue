<template>
  <div v-if="totalPages > 1 || showAlways" class="smq-pagination">
    <!-- Compteur -->
    <span class="smq-pagination__info">
      {{ from }}–{{ to }} sur <strong>{{ total }}</strong>
    </span>

    <div class="smq-pagination__controls">
      <!-- Précédent -->
      <button
        class="smq-pagination__btn"
        :disabled="modelValue === 1"
        aria-label="Page précédente"
        @click="go(modelValue - 1)"
      >
        <Icon name="heroicons:chevron-left-20-solid" class="h-4 w-4" />
      </button>

      <!-- Pages -->
      <template v-for="item in pages" :key="item">
        <span v-if="item === '…'" class="smq-pagination__ellipsis">…</span>
        <button
          v-else
          class="smq-pagination__btn smq-pagination__btn--num"
          :class="{ 'smq-pagination__btn--active': item === modelValue }"
          @click="go(item)"
        >{{ item }}</button>
      </template>

      <!-- Suivant -->
      <button
        class="smq-pagination__btn"
        :disabled="modelValue === totalPages"
        aria-label="Page suivante"
        @click="go(modelValue + 1)"
      >
        <Icon name="heroicons:chevron-right-20-solid" class="h-4 w-4" />
      </button>
    </div>

    <!-- Items par page -->
    <div v-if="showPerPage" class="smq-pagination__perpage">
      <span class="smq-pagination__perpage-label">Lignes :</span>
      <select
        :value="perPage"
        class="smq-pagination__perpage-select"
        @change="$emit('update:perPage', +$event.target.value)"
      >
        <option v-for="n in perPageOptions" :key="n" :value="n">{{ n }}</option>
      </select>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue:    { type: Number, required: true },       // page courante
  total:         { type: Number, required: true },       // nb total d'items
  perPage:       { type: Number, default: 20 },
  showPerPage:   { type: Boolean, default: true },
  showAlways:    { type: Boolean, default: false },
  perPageOptions:{ type: Array,  default: () => [10, 20, 50, 100] },
})

const emit = defineEmits(['update:modelValue', 'update:perPage'])

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.perPage)))
const from = computed(() => Math.min((props.modelValue - 1) * props.perPage + 1, props.total))
const to   = computed(() => Math.min(props.modelValue * props.perPage, props.total))

const go = (p) => {
  if (p < 1 || p > totalPages.value) return
  emit('update:modelValue', p)
}

// Génère la liste des pages avec ellipses : 1 … 4 5 6 … 12
const pages = computed(() => {
  const cur  = props.modelValue
  const last = totalPages.value
  if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1)

  const result = []
  const addPage = (n) => { if (!result.includes(n)) result.push(n) }
  const addDots = () => { result.push('…') }

  addPage(1)
  if (cur > 3) addDots()
  for (let p = Math.max(2, cur - 1); p <= Math.min(last - 1, cur + 1); p++) addPage(p)
  if (cur < last - 2) addDots()
  addPage(last)
  return result
})
</script>

<style scoped>
.smq-pagination {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px;
  background: var(--qp-n-25);
  border-top: 1px solid var(--qp-border-1);
  flex-wrap: wrap;
}

.smq-pagination__info {
  font-size: 0.75rem;
  color: var(--qp-fg-3);
  white-space: nowrap;
  margin-right: auto;
}
.smq-pagination__info strong {
  color: var(--qp-fg-1);
  font-weight: 700;
}

.smq-pagination__controls {
  display: flex;
  align-items: center;
  gap: 3px;
}

.smq-pagination__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  padding: 0 6px;
  border-radius: 8px;
  border: 1px solid var(--qp-border-1);
  background: #fff;
  color: var(--qp-fg-2);
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 140ms ease;
  line-height: 1;
}
.smq-pagination__btn:hover:not(:disabled) {
  background: var(--qp-n-50);
  border-color: var(--qp-n-300);
  color: var(--qp-fg-1);
}
.smq-pagination__btn:disabled {
  opacity: 0.38;
  cursor: not-allowed;
}
.smq-pagination__btn--num {
  font-family: ui-monospace, monospace;
}
.smq-pagination__btn--active {
  background: linear-gradient(135deg, #1E3A5F 0%, #2a4f7a 100%);
  border-color: #1E3A5F;
  color: #fff;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(30,58,95,.30);
}
.smq-pagination__btn--active:hover:not(:disabled) {
  background: linear-gradient(135deg, #11233B 0%, #1E3A5F 100%);
}

.smq-pagination__ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 32px;
  color: var(--qp-fg-4);
  font-size: 0.875rem;
  user-select: none;
}

/* Items par page */
.smq-pagination__perpage {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: 4px;
}
.smq-pagination__perpage-label {
  font-size: 0.75rem;
  color: var(--qp-fg-3);
  white-space: nowrap;
}
.smq-pagination__perpage-select {
  font-family: Montserrat, sans-serif;
  font-size: 0.8125rem;
  color: var(--qp-fg-1);
  background: #fff;
  border: 1px solid var(--qp-border-1);
  border-radius: 7px;
  padding: 4px 24px 4px 8px;
  height: 30px;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 20 20'%3E%3Cpath fill='%238593A8' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 6px center;
  transition: border-color 140ms;
}
.smq-pagination__perpage-select:focus {
  outline: none;
  border-color: var(--qp-primary-500);
  box-shadow: 0 0 0 3px rgba(31,157,82,.18);
}
</style>
