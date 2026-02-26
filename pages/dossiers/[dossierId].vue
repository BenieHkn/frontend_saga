<script setup>
import { useCodirsStore } from '@/stores/codirs'
import { formatDateFR } from '@/composables/codirs/useCodir'
import { useDossier } from '@/composables/dossier/useDossier'
import { useTache } from '@/composables/taches/useTaches'
import { useMembre } from '@/composables/membres/useMembres'

definePageMeta({ title: 'Détail dossier' })

const router = useRouter()
const store = useCodirsStore()
const toast = useToast()

const dossierApi = useDossier()
const tacheApi = useTache()
const membreApi = useMembre()

// ── State ─────────────────────────────────────────────────────────────────────
const dossier = ref(null)
const currentOrdreDuJour = ref(null)
const currentCodir = ref(null)
const membres = ref([])
const loading = ref(true)

onMounted(async () => {
  const stored = JSON.parse(localStorage.getItem('currentDossier'))
  currentOrdreDuJour.value = JSON.parse(localStorage.getItem('currentOrdreDuJour'))
  currentCodir.value = JSON.parse(localStorage.getItem('currentCodir'))

  // Fetch frais du dossier (inclut taches, actions, documents)
  if (stored?.id) {
    dossier.value = await dossierApi.getDossier(stored.id)
  } else {
    dossier.value = stored
  }

  // Charger les membres pour le formulaire
  membres.value = await membreApi.getMembres()

  loading.value = false
})

// ── Tabs ──────────────────────────────────────────────────────────────────────
const tabs = [
  { id: 'actions', label: 'Actions' },
  { id: 'activites', label: 'Activités' },
  { id: 'taches', label: 'Tâches' },
]

const actions = computed(() => dossier.value?.actions ?? [])
const activites = computed(() => dossier.value?.activites ?? [])
const taches = computed(() => dossier.value?.taches ?? [])

// ── Options membres pour le select ────────────────────────────────────────────
const membreOptions = computed(() =>
  membres.value.map(m => ({
    label: m.entite_user?.user?.nom + ' ' + m.entite_user?.user?.prenom ?? `Membre #${m.id}`,
    value: m.id,
  }))
)

// ── Priorité ──────────────────────────────────────────────────────────────────
const PRIORITE_OPTIONS = [
  { label: 'Haute', value: 'Haute' },
  { label: 'Moyenne', value: 'Moyenne' },
  { label: 'Basse', value: 'Basse' },
]

// ── Création de tâche ─────────────────────────────────────────────────────────
const tacheModal = ref(false)
const tacheForm = reactive({
  intitule: '',
  date_debut: '',
  date_fin: '',
  priorite: 'Moyenne',
  avancement: '',
  membre_ids: [],
})

const resetTacheForm = () => Object.assign(tacheForm, {
  intitule: '', date_debut: '', date_fin: '',
  priorite: 'Moyenne', avancement: '', membre_ids: [],
})

const createTache = async () => {
  if (!tacheForm.intitule.trim() || !tacheForm.date_debut || !tacheForm.date_fin) {
    toast.add({
      title: 'Champs requis manquants',
      color: 'orange',
      icon: 'i-heroicons-exclamation-triangle',
    })
    return
  }

  try {
    await tacheApi.createTache({
      ...tacheForm,
      dossier_id: dossier.value.id,
    })

    // Rafraîchir le dossier pour mettre à jour la liste des tâches
    dossier.value = await dossierApi.getDossier(dossier.value.id)

    toast.add({
      title: 'Tâche créée',
      description: `"${tacheForm.intitule}" a été créée avec succès`,
      color: 'green',
      icon: 'i-heroicons-check-circle',
    })
    tacheModal.value = false
    resetTacheForm()
  } catch {
    toast.add({
      title: 'Erreur',
      description: 'Impossible de créer la tâche',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
    })
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto py-10 px-6">

    <!-- Retour -->
    <div class="mb-6 flex items-center gap-3">
      <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" @click="router.back()" />
      <span class="text-gray-400 text-sm">Retour à l'ordre du jour</span>
    </div>

    <!-- Loader -->
    <div v-if="loading" class="flex justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-blue-500" />
    </div>

    <!-- Introuvable -->
    <div v-else-if="!dossier" class="text-center py-20">
      <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 mx-auto text-amber-400 mb-4" />
      <p class="text-gray-500 text-sm">Dossier introuvable.</p>
      <UButton class="mt-4" color="gray" variant="ghost" @click="router.back()">Retour</UButton>
    </div>

    <template v-else>

      <!-- ── En-tête ────────────────────────────────────────────────────── -->
      <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 mb-6">
        <div class="p-6 border-b border-gray-100 dark:border-gray-800">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-950/40 flex items-center justify-center">
              <UIcon name="i-heroicons-folder" class="w-6 h-6 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">{{ dossier.libelle }}</h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">Dossier #{{ dossier.id }}</p>
            </div>
          </div>
        </div>

        <!-- ── Métadonnées ─────────────────────────────────────────────── -->
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Ordre du jour</p>
              <p class="font-medium text-gray-900 dark:text-white text-sm">
                {{ currentOrdreDuJour?.libelle ?? 'Non spécifié' }}
              </p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">CODIR</p>
              <p class="font-medium text-gray-900 dark:text-white text-sm">
                {{ currentCodir?.date ? formatDateFR(currentCodir.date) : 'Non spécifié' }}
              </p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Identifiant</p>
              <p class="font-medium text-gray-900 dark:text-white text-sm">#{{ dossier.id }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Tabs ───────────────────────────────────────────────────────── -->
      <AppTabs :tabs="tabs">

        <!-- Actions -->
        <template #actions>
          <div v-if="!actions.length"
            class="text-center py-8 text-gray-400 text-sm bg-gray-50 dark:bg-slate-800/50 rounded-xl">
            Aucune action rattachée à ce dossier
          </div>
          <div v-else class="flex flex-col gap-3">
            <div v-for="action in actions" :key="action.id"
              class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
              <div class="flex items-center justify-between mb-1">
                <p class="font-medium text-gray-900 dark:text-white text-sm">{{ action.libelle }}</p>
                <UBadge color="blue" variant="soft" size="xs">
                  {{ action.activites?.length ?? 0 }} activité(s)
                </UBadge>
              </div>
              <p v-if="action.description" class="text-xs text-gray-500">{{ action.description }}</p>
            </div>
          </div>
        </template>

        <!-- Activités -->
        <template #activites>
          <div v-if="!activites.length"
            class="text-center py-8 text-gray-400 text-sm bg-gray-50 dark:bg-slate-800/50 rounded-xl">
            Aucune activité rattachée à ce dossier
          </div>
          <div v-else class="flex flex-col gap-3">
            <div v-for="activite in activites" :key="activite.id"
              class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
              <div class="flex items-center justify-between mb-1">
                <p class="font-medium text-gray-900 dark:text-white text-sm">{{ activite.libelle }}</p>
                <UBadge color="violet" variant="soft" size="xs">
                  {{ activite.taches?.length ?? 0 }} tâche(s)
                </UBadge>
              </div>
              <p v-if="activite.description" class="text-xs text-gray-500">{{ activite.description }}</p>
            </div>
          </div>
        </template>

        <!-- Tâches -->
        <template #taches>
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ taches.length }} tâche(s)
            </span>
            <UButton icon="i-heroicons-plus" color="blue" variant="soft" size="sm" @click="tacheModal = true">
              Ajouter une tâche
            </UButton>
          </div>

          <div v-if="!taches.length"
            class="text-center py-8 text-gray-400 text-sm bg-gray-50 dark:bg-slate-800/50 rounded-xl">
            Aucune tâche rattachée à ce dossier
          </div>
          <div v-else class="flex flex-col gap-3">
            <div v-for="tache in taches" :key="tache.id"
              class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
              <div class="flex items-center justify-between mb-1">
                <p class="font-medium text-gray-900 dark:text-white text-sm">{{ tache.intitule }}</p>
                <UBadge :color="tache.priorite === 'Haute' ? 'red' : tache.priorite === 'Moyenne' ? 'amber' : 'green'"
                  variant="soft" size="xs">
                  {{ tache.priorite ?? 'Normale' }}
                </UBadge>
              </div>
              <div class="flex items-center gap-4 mt-2 text-xs text-gray-400">
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
            </div>
          </div>
        </template>

      </AppTabs>

    </template>

  </div>

  <!-- ── Modale création tâche ──────────────────────────────────────────────── -->
  <UModal v-model="tacheModal">
    <UCard class="rounded-2xl">
      <template #header>
        <h3 class="font-semibold">Nouvelle tâche</h3>
      </template>

      <div class="p-2 flex flex-col gap-4">
        <UFormGroup label="Intitulé" required>
          <UInput v-model="tacheForm.intitule" placeholder="Ex: Préparer le rapport" size="md" />
        </UFormGroup>

        <div class="grid grid-cols-2 gap-4">
          <UFormGroup label="Date de début" required>
            <UInput v-model="tacheForm.date_debut" type="date" size="md" />
          </UFormGroup>
          <UFormGroup label="Date de fin" required>
            <UInput v-model="tacheForm.date_fin" type="date" size="md" />
          </UFormGroup>
        </div>

        <UFormGroup label="Priorité">
          <USelect v-model="tacheForm.priorite" :options="PRIORITE_OPTIONS" size="md" />
        </UFormGroup>

        <AppSelectSearch v-model="tacheForm.membre_ids" :options="membreOptions" :multiple="true"
          :loading="membreApi.loading.value" placeholder="Rechercher des membres..." />
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" variant="ghost" @click="tacheModal = false">Annuler</UButton>
          <UButton color="blue" :loading="tacheApi.loading.value" @click="createTache">Créer</UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>