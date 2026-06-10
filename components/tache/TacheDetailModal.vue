<script setup>
import { computed } from 'vue'
import { formatDateFR, COLOR_TACHE_STATUT, TACHE_STATUT_OPTIONS } from '@/composables/codirs/useCodir'

const props = defineProps({
  openDetailTacheModal: { type: Boolean, default: false },
  tache:      { type: Object,  required: true },
  codirId:    { type: Number,  default: null },
})

const emit = defineEmits(['update:openDetailTacheModal'])

const close = () => {
  emit('update:openDetailTacheModal', false)
}

// ── Pivot du codir courant ────────────────────────────────────────────────────
const pivot = computed(() => {
  if (!props.codirId) return props.tache.codirs?.[0]?.pivot ?? null
  return props.tache.codirs?.find(c => c.id === props.codirId)?.pivot ?? null
})

const statutColor = computed(() => COLOR_TACHE_STATUT[pivot.value?.statut] ?? 'gray')

const progressionColor = computed(() => {
  const p = pivot.value?.progression ?? 0
  if (p >= 100) return 'green'
  if (p >= 50)  return 'blue'
  if (p >= 25)  return 'amber'
  return 'red'
})

// ── Responsables ──────────────────────────────────────────────────────────────
const responsables = computed(() =>
  (props.tache.membres ?? []).map(m => m.entite_user?.entite.code).filter(Boolean)
)

const isOpen = computed({
        get: () => props.openDetailTacheModal,
        set: (val) => emit('update:openDetailTacheModal', val)
    })



// const getInitials = (name) =>
//   (name || '?').split(' ').map(w => w[0]?.toUpperCase()).join('').slice(0, 2)
</script>

<template>
  <UModal v-model="isOpen">
    <UCard
      class="rounded-2xl flex flex-col"
      :ui="{ base: 'max-h-[90vh]', body: { base: 'flex-1 overflow-y-auto p-4' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }"
    >
      <template #header>
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center">
              <UIcon name="i-heroicons-document-text" class="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white">
                Détails de la tâche
              </h3>
              <p class="text-xs text-gray-400">Consultation des informations</p>
            </div>
          </div>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" @click="close" />
        </div>
      </template>

      <div class="flex flex-col gap-6">
        <!-- Informations générales -->
        <div>
          <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">{{ tache.intitule }}</h4>
          <div class="flex flex-wrap items-center gap-2">
            <UBadge
              :color="tache.priorite === 'Haute' ? 'red' : tache.priorite === 'Moyenne' ? 'amber' : 'green'"
              variant="soft" size="sm"
            >
              {{ tache.priorite ?? 'Normale' }}
            </UBadge>
            <UBadge :color="statutColor" variant="soft" size="sm">
              {{ TACHE_STATUT_OPTIONS.find(s => s.value === pivot?.statut)?.label ?? 'En attente' }}
            </UBadge>
          </div>
        </div>

        <!-- Dates -->
        <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-calendar" class="w-5 h-5 text-gray-400" />
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400">Date de début</p>
              <p class="font-medium text-gray-900 dark:text-white">{{ formatDateFR(tache.date_debut) }}</p>
            </div>
          </div>
          <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 text-gray-400" />
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-calendar" class="w-5 h-5 text-gray-400" />
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400">Date de fin</p>
              <p class="font-medium text-gray-900 dark:text-white">{{ formatDateFR(tache.date_fin) }}</p>
            </div>
          </div>
        </div>

        <!-- Responsables -->
        <div v-if="responsables.length">
          <h5 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Responsables</h5>
          <div class="flex flex-wrap gap-3">
            <div
              v-for="r in responsables" :key="r"
              class="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm ring-2 ring-white dark:ring-gray-900"
              :title="r"
            >
              {{ r }}
            </div>
          </div>
        </div>

        <!-- Progression -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <h5 class="text-sm font-semibold text-gray-700 dark:text-gray-300">Progression</h5>
            <span class="text-sm font-bold text-gray-900 dark:text-white">
              {{ pivot?.progression ?? 0 }}%
            </span>
          </div>
          <UProgress :value="pivot?.progression ?? 0" :color="progressionColor" size="md" />
        </div>

        <!-- Commentaire de progression -->
        <div v-if="pivot?.commentaire">
          <h5 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Dernier commentaire</h5>
          <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg italic">
            "{{ pivot.commentaire }}"
          </p>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <UButton color="gray" @click="close">Fermer</UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
