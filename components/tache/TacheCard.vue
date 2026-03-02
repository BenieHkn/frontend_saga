<script setup>
import { useTache } from '@/composables/taches/useTaches'
import { formatDateFR, useCodir } from '@/composables/codirs/useCodir'

const props = defineProps({
  tache:   { type: Object, required: true },
  codirId: { type: Number, required: true },
})

const emit = defineEmits(['updated'])

const toast = useToast()
const tacheApi = useTache()
const codirApi = useCodir()

const progressionModal = ref(false)
const deleteModal      = ref(false)

// ── Pivot du codir courant ────────────────────────────────────────────────────
const pivot = computed(() =>
  props.tache.codirs?.find(c => c.id === props.codirId)?.pivot ?? null
)

const progressionForm = reactive({
  progression: 0,
  statut:      'en_attente',
  commentaire: '',
  est_reprise: false,
})

watch(pivot, (p) => {
  progressionForm.progression = p?.progression ?? 0
  progressionForm.statut      = p?.statut      ?? 'en_attente'
  progressionForm.commentaire = p?.commentaire ?? ''
  progressionForm.est_reprise = p?.est_reprise ?? false
}, { immediate: true, deep: true })

const STATUT_OPTIONS = [
  { label: 'En attente', value: 'en_attente' },
  { label: 'En cours',   value: 'en_cours' },
  { label: 'Terminée',   value: 'terminee' },
  { label: 'Bloquée',    value: 'bloquer' },
  { label: 'Reportée',   value: 'reportee' },
]

const statutColor = computed(() => {
  const map = {
    en_attente: 'gray',
    en_cours:   'blue',
    terminee:   'green',
    bloquer:    'red',
    reportee:   'amber',
  }
  return map[pivot.value?.statut] ?? 'gray'
})

const progressionColor = computed(() => {
  const p = pivot.value?.progression ?? 0
  if (p >= 100) return 'green'
  if (p >= 50)  return 'blue'
  if (p >= 25)  return 'amber'
  return 'red'
})

// ── Responsables ──────────────────────────────────────────────────────────────
const responsables = computed(() => {
  // On remonte les utilisateurs liés via tache.membres.entite_user.user
  return (props.tache.membres ?? [])
    .map((m) => m.entite_user?.user)
    .filter((u) => !!u)
})

const getInitials = (name) => {
  if (!name) return '?'
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2)
}

// ── Mise à jour progression ───────────────────────────────────────────────────
const updateProgression = async () => {
  try {
    await tacheApi.updateTacheProgression(props.tache.id, props.codirId, progressionForm)
    toast.add({
      title: 'Progression mise à jour',
      description: `"${props.tache.intitule}" — ${progressionForm.progression}%`,
      color: 'green',
      icon: 'i-heroicons-check-circle',
    })
    progressionModal.value = false
    emit('updated')
  } catch {
    toast.add({
      title: 'Erreur',
      description: 'Impossible de mettre à jour la progression',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
    })
  }
}

// ── Suppression ───────────────────────────────────────────────────────────────
const deleteTache = async () => {
  try {
    await codirApi.detachTache(props.codirId, props.tache.id)
    toast.add({
      title: 'Tâche supprimée',
      description: `"${props.tache.intitule}" a été supprimée`,
      color: 'green',
      icon: 'i-heroicons-check-circle',
    })
    deleteModal.value = false
    emit('updated')
  } catch {
    toast.add({
      title: 'Erreur',
      description: 'Impossible de supprimer la tâche',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
    })
  }
}
</script>

<template>
  <div
    class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 cursor-pointer hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
    @click="progressionModal = true"
  >
    <!-- En-tête -->
    <div class="flex items-start justify-between gap-2 mb-3">
      <p class="font-medium text-gray-900 dark:text-white text-sm">{{ tache.intitule }}</p>
      <div class="flex items-center gap-2 shrink-0">
        <UBadge
          :color="tache.priorite === 'Haute' ? 'red' : tache.priorite === 'Moyenne' ? 'amber' : 'green'"
          variant="soft" size="xs"
        >
          {{ tache.priorite ?? 'Normale' }}
        </UBadge>
        <UBadge :color="statutColor" variant="soft" size="xs">
          {{ STATUT_OPTIONS.find(s => s.value === pivot?.statut)?.label ?? 'En attente' }}
        </UBadge>
      </div>
    </div>

    <!-- Responsables -->
    <div v-if="responsables.length" class="flex items-center -space-x-2 mb-3">
      <div
        v-for="responsable in responsables"
        :key="responsable.id"
        class="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-xs"
        :title="`${responsable.nom ?? ''} ${responsable.prenom ?? ''}`.trim() || 'Responsable'"
      >
        {{ getInitials(`${responsable.nom ?? ''} ${responsable.prenom ?? ''}`.trim() || 'R') }}
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

    <!-- Commentaire -->
    <p v-if="pivot?.commentaire" class="text-xs text-gray-500 mt-2 italic">
      {{ pivot.commentaire }}
    </p>
  </div>

  <!-- ── Modale progression ─────────────────────────────────────────────────── -->
  <UModal v-model="progressionModal">
    <UCard class="rounded-2xl">
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center">
            <UIcon name="i-heroicons-chart-bar" class="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Mettre à jour la progression</h3>
            <p class="text-xs text-gray-400">{{ tache.intitule }}</p>
          </div>
        </div>
      </template>

      <div class="p-2 flex flex-col gap-4">

        <UFormGroup label="Progression (%)">
          <div class="flex items-center gap-4">
            <input
              v-model="progressionForm.progression"
              type="range" min="0" max="100" step="5"
              class="flex-1 accent-blue-500"
            />
            <span class="text-sm font-semibold text-gray-700 dark:text-gray-300 w-10 text-right">
              {{ progressionForm.progression }}%
            </span>
          </div>
          <UProgress :value="progressionForm.progression" :color="progressionColor" size="sm" class="mt-2" />
        </UFormGroup>

        <UFormGroup label="Statut">
          <USelect v-model="progressionForm.statut" :options="STATUT_OPTIONS" size="md" />
        </UFormGroup>

        <UFormGroup label="Commentaire">
          <UTextarea
            v-model="progressionForm.commentaire"
            placeholder="Ajouter un commentaire..."
            size="md"
            :rows="3"
          />
        </UFormGroup>

        <UCheckbox
          v-model="progressionForm.est_reprise"
          label="Tâche reprise du CODIR précédent"
          color="blue"
        />
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" variant="ghost" @click="progressionModal = false">Annuler</UButton>
          <UButton color="blue" :loading="tacheApi.loading.value" @click="updateProgression">
            Enregistrer
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>

  <!-- ── Modale suppression ───────────────────────────────────────────────────
  <UModal v-model="deleteModal">
    <UCard class="rounded-2xl">
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Confirmer la suppression</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Cette action est irréversible</p>
          </div>
        </div>
      </template> -->

      <!-- <div class="p-2">
        <p class="text-gray-700 dark:text-gray-300">
          Êtes-vous sûr de vouloir supprimer la tâche
          <span class="font-semibold text-red-600 dark:text-red-400">"{{ tache.intitule }}"</span> ?
        </p>
      </div> -->

      <!-- <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" variant="ghost" @click="deleteModal = false">Annuler</UButton>
          <UButton color="red" :loading="tacheApi.loading.value" @click="deleteTache">
            <UIcon name="i-heroicons-trash" class="w-4 h-4 mr-1" />
            Supprimer
          </UButton>
        </div>
      </template> -->
    <!-- </UCard>
  </UModal> -->
</template>