<script setup>
import {
  formatDateFR,
  useCodir,
  COLOR_TACHE_STATUT,
  TACHE_STATUT_OPTIONS
} from '@/composables/codirs/useCodir'

const props = defineProps({
  tache:      { type: Object,  required: true },
  codirId:    { type: Number,  required: true },
  peutGerer:  { type: Boolean, default: false },
  peutVoir:   { type: Boolean, default: false },
})

const emit = defineEmits(['update', 'commenter', 'lire-commentaires', 'edit', 'delete', 'details'])

const canView = computed(() => props.peutGerer || props.peutVoir)

// ── Pivot du codir courant ────────────────────────────────────────────────────
const pivot = computed(() =>
  props.tache.codirs?.find(c => c.id === props.codirId)?.pivot ?? null
)

const statutColor = computed(() =>
  COLOR_TACHE_STATUT[pivot.value?.statut] ?? 'gray'
)

const progressionColor = computed(() => {
  const p = pivot.value?.progression ?? 0
  if (p >= 100) return 'green'
  if (p >= 50)  return 'blue'
  if (p >= 25)  return 'amber'
  return 'red'
})

// ── Responsables ──────────────────────────────────────────────────────────────
const responsables = computed(() =>
  (props.tache.membres ?? []).map(m => m.entite_user?.entite.code)
)

</script>

<template>
  <div
    class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 transition-all"
    :class="canView
      ? 'cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm'
      : 'cursor-default opacity-95'"
    @click="canView && (peutGerer ? emit('edit', tache) : emit('details', tache))"
  >
    <!-- En-tête : titre + badges + boutons -->
    <div class="flex items-start justify-between gap-2 mb-3">
      <p class="font-medium text-gray-900 dark:text-white text-sm">
        {{ tache.intitule }}
      </p>

      <div class="flex items-center gap-2 shrink-0">
        <!-- Badges statut / priorité -->
        <UBadge
          :color="tache.priorite === 'Haute' ? 'red' : tache.priorite === 'Moyenne' ? 'amber' : 'green'"
          variant="soft" size="xs"
        >
          {{ tache.priorite ?? 'Normale' }}
        </UBadge>

        <UBadge :color="statutColor" variant="soft" size="xs">
          {{ TACHE_STATUT_OPTIONS.find(s => s.value === pivot?.statut)?.label ?? 'En attente' }}
        </UBadge>

        <!-- Voir les détails -->
        <UButton
          v-if="canView"
          icon="i-heroicons-eye"
          color="gray"
          variant="ghost"
          size="xs"
          title="Voir les détails de la tâche"
          @click.stop="emit('details', tache)"
        />

        <!-- Modifier la tâche -->
        <UButton
          v-if="peutGerer"
          icon="i-heroicons-pencil-square"
          color="blue"
          variant="ghost"
          size="xs"
          title="Modifier la tâche"
          @click.stop="emit('edit', tache)"
        />

        <!-- Lire commentaires avec compteur -->
        <div class="relative inline-block">
          <UButton
            icon="i-heroicons-chat-bubble-bottom-center-text"
            color="gray"
            variant="ghost"
            size="xs"
            title="Lire les commentaires"
            @click.stop="emit('lire-commentaires', tache)"
          >
            <span
              v-if="(tache.commentaires?.length ?? 0) > 0"
              class="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-4 px-1 flex items-center justify-center pointer-events-none border border-white dark:border-slate-800"
            >
              {{ tache.commentaires?.length ?? 0 }}
            </span>
          </UButton>
        </div>

        <!-- Ajouter commentaire -->
        <div class="relative inline-block">
          <UButton
            icon="i-heroicons-chat-bubble-left-right"
            color="blue"
            variant="ghost"
            size="xs"
            title="Ajouter un commentaire"
            @click.stop="emit('commenter', tache)"
          />
          <div class="absolute -bottom-0.5 -right-0.5 bg-blue-500 rounded-full p-0.5 flex items-center justify-center border border-white dark:border-slate-800 pointer-events-none">
            <UIcon name="i-heroicons-plus" class="w-2 h-2 text-white" />
          </div>
        </div>

        <!-- Détachement -->
        <UButton
          v-if="peutGerer"
          icon="i-heroicons-trash"
          color="red"
          variant="ghost"
          size="xs"
          title="Détacher la tâche du CODIR"
          @click.stop="emit('delete', tache)"
        />
      </div>
    </div>

    <!-- Responsables -->
    <div v-if="responsables.length" class="flex items-center -space-x-2 mb-3">
      <div
        v-for="r in responsables" :key="r"
        class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-xs ring-2 ring-white dark:ring-gray-900"
        :title="r"
      >
        {{ r }}
      </div>
    </div>

    <!-- Progression -->
    <div class="mb-3">
      <div class="flex items-center justify-between mb-1">
        <span class="text-xs text-gray-400">Progression</span>
        <span class="text-xs font-semibold text-gray-600 dark:text-gray-300">
          {{ pivot?.progression ?? 0 }}%
        </span>
      </div>
      <UProgress :value="pivot?.progression ?? 0" :color="progressionColor" size="sm" />
    </div>

    <!-- Dates -->
    <div class="flex items-center gap-4 text-xs text-gray-400">
      <span class="flex items-center gap-1">
        <UIcon name="i-heroicons-calendar" class="w-3.5 h-3.5" />
        {{ formatDateFR(tache.date_debut) }}
      </span>
      <span>→</span>
      <span class="flex items-center gap-1">
        <UIcon name="i-heroicons-calendar" class="w-3.5 h-3.5" />
        {{ formatDateFR(tache.date_fin) }}
      </span>
    </div>

    <!-- Commentaire pivot -->
    <p v-if="pivot?.commentaire" class="text-xs text-gray-500 mt-2 italic">
      {{ pivot.commentaire }}
    </p>
  </div>
</template>