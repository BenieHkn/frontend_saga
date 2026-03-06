<script setup>
import { formatDateFR, extractTime, getStatutConfig } from '@/composables/codirs/useCodir'

const props = defineProps({
  codir: { type: Object, required: true }
})

const emit = defineEmits(['download', 'view'])

const GRADIENT = {
  clos:      'from-green-900 to-blue-900',
  soumis:  'from-yellow-700/80 to-yellow-700/80',
}

const handleClick = ()=>{
  if(props.codir.statut === 'soumis') {
    emit('view')
  } else {
    emit('download')
  }
}

const gradient = (s) => GRADIENT[s] ?? 'from-slate-600 to-gray-700'
</script>

<template>
  <UCard
    :class="`relative rounded-2xl border-none shadow-sm hover:shadow-inner transition-all duration-300 group overflow-hidden bg-gradient-to-br ${gradient(codir.statut)} hover:scale-[0.97] cursor-pointer`"
    @click="handleClick"
  >
    <!-- Blob décoratif -->
    <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />

    <div class="relative z-10">
      <!-- Header statut + action -->
      <div class="flex justify-between items-start mb-5">
        <span class="text-white/90 text-[10px] font-semibold px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm capitalize">
          {{ getStatutConfig(codir.statut).label }}
        </span>
        <UButton
          color="white" variant="solid" :icon="codir.statut!=='clos' ? 'i-heroicons-eye' : 'i-heroicons-arrow-down-tray'" size="xs"
          class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white/20"
          @click="handleClick"
        />
      </div>

      <!-- Date principale -->
      <h4 class="font-bold text-xl text-white mb-1 leading-tight">
        {{ formatDateFR(codir.date) }}
      </h4>

      <!-- Horaire -->
      <p class="text-xs text-white/65 flex items-center gap-1.5 mb-6">
        <UIcon name="i-heroicons-clock" class="w-3.5 h-3.5" />
        {{ extractTime(codir.heure_debut) }} – {{ extractTime(codir.heure_fin) }}
      </p>

      <!-- Footer compteurs + dot statut -->
      <div class="flex items-center justify-between pt-4 border-t border-white/15">
        <div class="flex items-center gap-4 text-white/70 text-xs">
          <span class="flex items-center gap-1.5">
            <UIcon name="i-heroicons-clipboard-document-list" class="w-3.5 h-3.5" />
            {{ codir.ordres_du_jour?.length ?? 0 }} ODJ
          </span>
          <span class="flex items-center gap-1.5">
            <UIcon name="i-heroicons-check-circle" class="w-3.5 h-3.5" />
            {{ codir.taches?.length ?? 0 }} tâches
          </span>
        </div>

        <div class="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full">
          <div :class="`w-1.5 h-1.5 rounded-full animate-pulse ${getStatutConfig(codir.statut).dotClass}`" />
          <span class="text-[10px] text-white/70">
            <template v-if="codir.taches?.length">
              {{ Math.round(codir.taches.reduce((a, t) => a + (t.pivot?.progression ?? 0), 0) / codir.taches.length) }}%
            </template>
            <template v-else>—</template>
          </span>
        </div>
      </div>
    </div>
  </UCard>
</template>