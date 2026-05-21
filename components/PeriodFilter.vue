<template>
  <div class="flex items-center gap-2 flex-wrap">

    <select
      v-model="localField"
      class="h-8 px-2 text-xs text-slate-700 bg-white border border-slate-300 rounded-lg
             focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none
             transition-all cursor-pointer"
      @change="emitChange">
      <option value="date_enreg">Date d'enreg.</option>
      <option value="date_courrier">Date courrier</option>
    </select>

    <span class="text-[11px] text-slate-400 font-medium whitespace-nowrap">Du</span>
    <input
      v-model="localFrom"
      type="text"
      placeholder="jj/mm/aaaa"
      maxlength="10"
      class="h-8 w-28 px-2 text-xs text-slate-700 bg-white border border-slate-300 rounded-lg
             focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
      @input="onInput" />

    <span class="text-[11px] text-slate-400 font-medium whitespace-nowrap">au</span>
    <input
      v-model="localTo"
      type="text"
      placeholder="jj/mm/aaaa"
      maxlength="10"
      class="h-8 w-28 px-2 text-xs text-slate-700 bg-white border border-slate-300 rounded-lg
             focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
      @input="onInput" />

    <button
      v-if="localFrom || localTo"
      class="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100
             border border-red-200 text-red-500 transition-colors"
      title="Effacer la période"
      @click="clear">
      <Icon name="i-heroicons-x-mark" class="w-3.5 h-3.5" />
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  field: { type: String, default: 'date_enreg' },
  from:  { type: String, default: '' },
  to:    { type: String, default: '' },
})

const emits = defineEmits(['change'])

const localField = ref(props.field)
const localFrom  = ref(props.from)
const localTo    = ref(props.to)

const isFullDate = (v) => /^\d{2}\/\d{2}\/\d{4}$/.test((v || '').trim())

let debounceTimer = null

const onInput = () => {
  clearTimeout(debounceTimer)

  const fromFilled = localFrom.value.length > 0
  const toFilled   = localTo.value.length > 0
  const fromValid  = isFullDate(localFrom.value)
  const toValid    = isFullDate(localTo.value)

  // Les deux remplis → déclencher seulement si les deux sont valides
  if (fromFilled && toFilled) {
    if (!fromValid || !toValid) return
    debounceTimer = setTimeout(() => emitChange(), 500)
    return
  }

  // Un seul rempli et valide → attendre 1.5s au cas où l'utilisateur
  // veut aussi remplir l'autre champ
  if ((fromFilled && fromValid) || (toFilled && toValid)) {
    debounceTimer = setTimeout(() => emitChange(), 1500)
    return
  }

  // Les deux vides → réinitialiser
  if (!fromFilled && !toFilled) {
    debounceTimer = setTimeout(() => emitChange(), 300)
  }
}

const emitChange = () => {
  emits('change', {
    field: localField.value,
    from:  localFrom.value,
    to:    localTo.value,
  })
}

const clear = () => {
  localFrom.value = ''
  localTo.value   = ''
  emitChange()
}

watch(() => props.from,  v => { localFrom.value  = v })
watch(() => props.to,    v => { localTo.value    = v })
watch(() => props.field, v => { localField.value = v })
</script>