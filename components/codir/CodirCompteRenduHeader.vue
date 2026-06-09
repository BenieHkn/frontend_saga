<script setup>
import { formatDateFR, extractTime, getStatutConfig } from '@/composables/codirs/useCodir'

defineProps({
  codir: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
      <div class="flex items-center gap-2 mb-1">
        <span class="text-[10px] font-bold tracking-widest uppercase text-primary-500">Compte rendu</span>
        <UBadge size="xs" variant="subtle" :color="getStatutConfig(codir?.statut).color || 'gray'" class="capitalize">
          {{ getStatutConfig(codir?.statut).label }}
        </UBadge>
      </div>
      <h1 class="text-xl font-bold text-gray-900 dark:text-white">Réunion CODIR</h1>
    </div>
    
    <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
      <div class="flex items-center gap-1.5 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <UIcon name="i-heroicons-calendar" class="w-4 h-4 text-gray-400" />
        <strong class="text-gray-900 dark:text-gray-200 font-medium">{{ formatDateFR(codir?.date) }}</strong>
      </div>
      
      <div class="flex items-center gap-1.5 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <UIcon name="i-heroicons-clock" class="w-4 h-4 text-gray-400" />
        <strong class="text-gray-900 dark:text-gray-200 font-medium">{{ extractTime(codir?.heure_debut) }} – {{ extractTime(codir?.heure_fin) }}</strong>
      </div>
    </div>
  </div>
</template>