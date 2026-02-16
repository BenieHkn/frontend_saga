<template>
  <div class="inline-flex bg-slate-100 p-1.5 rounded-full gap-1">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      @click="selectOption(option.value)"
      :class="[
        'px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ease-in-out whitespace-nowrap',
        modelValue === option.value
          ? 'bg-gradient-to-br from-emerald-800 to-blue-800 text-white shadow-sm shadow-blue-500/20'
          : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
      ]"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
// Définition de la structure d'une option
interface ToggleOption {
  label: string
  value: string | number
}

const props = defineProps<{
  // La liste des boutons à afficher
  options: ToggleOption[]
  // La valeur actuellement sélectionnée (v-model)
  modelValue: string | number
}>()

const emit = defineEmits(['update:modelValue'])

// Fonction pour mettre à jour le v-model parent
const selectOption = (value: string | number) => {
  emit('update:modelValue', value)
}
</script>