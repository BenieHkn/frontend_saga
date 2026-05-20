<template>
  <div class="flex items-center gap-2 flex-wrap">
    <!-- Sélecteur champ -->
    <select
      v-model="localField"
      class="h-8 px-2 text-xs text-slate-700 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all cursor-pointer"
      @change="emit()">
      <option value="date_enreg">Date d'enreg.</option>
      <option value="date_courrier">Date courrier</option>
    </select>

    <!-- Du -->
    <span class="text-[11px] text-slate-400 font-medium whitespace-nowrap">Du</span>
    <input
      v-model="localFrom"
      type="text"
      placeholder="jj/mm/aaaa"
      maxlength="10"
      class="h-8 w-28 px-2 text-xs text-slate-700 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
      @input="onInput" />

    <!-- Au -->
    <span class="text-[11px] text-slate-400 font-medium whitespace-nowrap">au</span>
    <input
      v-model="localTo"
      type="text"
      placeholder="jj/mm/aaaa"
      maxlength="10"
      class="h-8 w-28 px-2 text-xs text-slate-700 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
      @input="onInput" />

    <!-- Effacer -->
    <button
      v-if="localFrom || localTo"
      class="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-500 transition-colors"
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

let debounce = null
const onInput = () => {
  const fromOk = !localFrom.value || isFullDate(localFrom.value)
  const toOk   = !localTo.value   || isFullDate(localTo.value)
  if (!fromOk || !toOk) return
  clearTimeout(debounce)
  debounce = setTimeout(() => emit(), 500)
}

const emit = () => {
  emits('change', { field: localField.value, from: localFrom.value, to: localTo.value })
}

const clear = () => {
  localFrom.value = ''
  localTo.value   = ''
  emit()
}

watch(() => props.from,  v => { localFrom.value  = v })
watch(() => props.to,    v => { localTo.value    = v })
watch(() => props.field, v => { localField.value = v })
</script>