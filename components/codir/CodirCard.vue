<script setup lang="ts">
import { formatDateFR, extractTime, formatDateShort, getStatutConfig, type Codir } from '@/composables/codirs/useCodir'

defineProps<{ codir: Codir }>()
const emit = defineEmits<{ edit: []; view: [] }>()

// Progression moyenne des tâches
const progression = (codir: Codir) => {
  const taches = codir.taches ?? []
  if (!taches.length) return null
  return Math.round(taches.reduce((a, t) => a + (t.pivot?.progression ?? 0), 0) / taches.length)
}
</script>

<template>
  <div
    class="group flex items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-200 cursor-pointer"
    @click="emit('view')"
  >
    <!-- Icône + infos -->
    <div class="flex items-center gap-4 min-w-0">
      <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-inner shrink-0">
        <UIcon name="i-heroicons-calendar-days" class="w-5 h-5 text-white" />
      </div>

      <div class="min-w-0">
        <p class="font-semibold text-gray-900 dark:text-white text-sm truncate">
          {{ formatDateFR(codir.date) }}
        </p>
        <!-- Horaire extrait des datetime ISO -->
        <p class="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
          <UIcon name="i-heroicons-clock" class="w-3 h-3" />
          {{ extractTime(codir.heure_debut) }} – {{ extractTime(codir.heure_fin) }}
        </p>
      </div>
    </div>

    <!-- Centre: compteurs + progression -->
    <div class="hidden sm:flex items-center gap-5 text-xs text-gray-400 shrink-0">
      <span class="flex items-center gap-1.5">
        <UIcon name="i-heroicons-clipboard-document-list" class="w-3.5 h-3.5 text-blue-400" />
        {{ codir.ordres_du_jour?.length ?? 0 }} ODJ
      </span>
      <span class="flex items-center gap-1.5">
        <UIcon name="i-heroicons-check-circle" class="w-3.5 h-3.5 text-green-400" />
        {{ codir.taches?.length ?? 0 }} tâches
      </span>
      <!-- Progression moyenne -->
      <span v-if="progression(codir) !== null" class="flex items-center gap-1.5">
        <UIcon name="i-heroicons-chart-bar" class="w-3.5 h-3.5 text-indigo-400" />
        {{ progression(codir) }}% moy.
      </span>
    </div>

    <!-- Droite: statut + actions -->
    <div class="flex items-center gap-3 shrink-0">
      <span :class="`text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${getStatutConfig(codir.statut).badgeClass}`">
        <span :class="`w-1.5 h-1.5 rounded-full ${getStatutConfig(codir.statut).dotClass}`" />
        {{ getStatutConfig(codir.statut).label }}
      </span>

      <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <UButton icon="i-heroicons-pencil-square" color="blue" variant="ghost" size="xs" @click.stop="emit('edit')" />
      </div>
    </div>
  </div>
</template>