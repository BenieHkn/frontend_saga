<!-- components/OrdreDuJourList.vue -->
<script setup>
import { useCodirsStore } from '@/stores/codirs'

defineProps({
  ordres: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['attach', 'detach'])

const goTo = (ordre) => {
  if(process.client){
    localStorage.setItem("currentOrdreDuJour", JSON.stringify(ordre))
  }
  navigateTo(`/ordres-du-jour/${ordre.id}`)
}

const statutClass = (statut) => {
  const map = {
    actif:   'text-green-600 bg-green-50 dark:bg-green-950/40',
    inactif: 'text-gray-500 bg-gray-100 dark:bg-gray-800/60',
    archivé: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40',
  }
  return map[statut] ?? 'text-gray-500 bg-gray-100'
}
</script>

<template>
  <section>
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-base font-semibold flex items-center gap-2">
        <UIcon name="i-heroicons-clipboard-document-list" class="text-blue-500" />
        Ordres du jour
        <UBadge color="blue" variant="soft" size="xs">{{ ordres.length }}</UBadge>
      </h2>
      <UButton icon="i-heroicons-plus" color="blue" variant="soft" size="xs" @click="emit('attach')">
        Ajouter
      </UButton>
    </div>

    <div v-if="!ordres.length"
      class="text-center py-6 text-gray-400 text-sm bg-gray-50 dark:bg-slate-800/50 rounded-xl">
      Aucun ordre du jour
    </div>

    <div v-else class="flex flex-col gap-2">
      <div
        v-for="ordre in ordres"
        :key="ordre.id"
        class="group flex items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-3 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900 transition-all cursor-pointer"
        @click="goTo(ordre)"
      >
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center shrink-0">
            <UIcon name="i-heroicons-document-text" class="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div class="min-w-0">
            <p class="text-sm font-medium truncate">{{ ordre.libelle }}</p>
            <span :class="`text-[10px] font-semibold capitalize ${statutClass(ordre.statut)}`">
              {{ ordre.statut }}
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors" />
          <UButton
            icon="i-heroicons-x-mark"
            color="red"
            variant="ghost"
            size="xs"
            @click.stop="emit('detach', ordre.id)"
          />
        </div>
      </div>
    </div>
  </section>
</template>