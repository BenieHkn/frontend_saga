<script setup>
import { formatDateFR } from '@/composables/useCodir'

defineProps({
  ordre: { type: Object, required: true },
})

const emit = defineEmits(['click'])

const statutClass = (statut) => {
  const map = {
    actif:    'text-green-600 bg-green-50 dark:bg-green-950/40',
    inactif:  'text-gray-500 bg-gray-100 dark:bg-gray-800/60',
    archivé:  'text-amber-600 bg-amber-50 dark:bg-amber-950/40',
  }
  return map[statut] ?? 'text-gray-500 bg-gray-100'
}
</script>

<template>
  <div
    class="group flex items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-200 cursor-pointer"
    @click="emit('click', ordre)"
  >
    <!-- Icône + libellé -->
    <div class="flex items-center gap-4 min-w-0">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-sm">
        <UIcon name="i-heroicons-clipboard-document-list" class="w-5 h-5 text-white" />
      </div>
      <div class="min-w-0">
        <p class="font-semibold text-sm text-gray-900 dark:text-white truncate">{{ ordre.libelle }}</p>
        <p class="text-xs text-gray-400 mt-0.5">{{ ordre.dossiers?.length ?? 0 }} dossier(s)</p>
      </div>
    </div>

    <!-- Statut + flèche -->
    <div class="flex items-center gap-3 shrink-0">
      <span :class="`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${statutClass(ordre.statut)}`">
        {{ ordre.statut }}
      </span>
      <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors" />
    </div>
  </div>
</template>