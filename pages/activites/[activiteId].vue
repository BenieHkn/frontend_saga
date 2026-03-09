<script setup>
import { useActivite } from '@/composables/activite/useActivite'
import { useTache } from '@/composables/taches/useTaches'
import { useMembre } from '@/composables/membres/useMembres'
import { formatDateFR } from '@/composables/codirs/useCodir'

definePageMeta({ title: 'Détail activité' })

const router      = useRouter()
const route       = useRoute()
const toast       = useToast()
const activiteApi = useActivite()
const tacheApi    = useTache()
const membreApi   = useMembre()

// ── State ─────────────────────────────────────────────────────────────────────
const activite           = ref(null)
const currentDossier     = ref(null)
const currentOrdreDuJour = ref(null)
const currentCodir       = ref(null)
const membres            = ref([])
const loading            = ref(false)

onMounted(async () => {
  currentDossier.value     = JSON.parse(localStorage.getItem('currentDossier'))
  currentOrdreDuJour.value = JSON.parse(localStorage.getItem('currentOrdreDuJour'))
  currentCodir.value       = JSON.parse(localStorage.getItem('currentCodir'))

  // Toujours appeler l'API pour avoir les tâches à jour
  // Le localStorage sert uniquement à pré-remplir le libellé pendant le chargement
  activite.value = JSON.parse(localStorage.getItem('currentActivite'))
  // affichage immédiat du libellé

  // const [fresh, mems] = await Promise.all([
  //   activiteApi.getActivite(Number(route.params.activiteId)),
  //   membreApi.getMembres(),
  // ])
})

const taches = computed(() => activite.value?.taches ?? [])

// ── Refresh ───────────────────────────────────────────────────────────────────
const refreshActivite = async () => {
  loading.value = true
  const fresh = await activiteApi.getActivite(activite.value.id)
  activite.value = null
  await nextTick()
  activite.value = fresh
  if(process.client) {
    localStorage.setItem('currentActivite', JSON.stringify(activite.value))
  }
  loading.value = false
}

// ── Options membres ───────────────────────────────────────────────────────────
const membreOptions = computed(() =>
  membres.value.map(m => ({
    label: m.entite_user?.user?.nom + ' ' + m.entite_user?.user?.prenom ?? `Membre #${m.id}`,
    value: m.id,
  }))
)

// ── Priorité ──────────────────────────────────────────────────────────────────
const PRIORITE_OPTIONS = [
  { label: 'Haute',   value: 'Haute' },
  { label: 'Moyenne', value: 'Moyenne' },
  { label: 'Basse',   value: 'Basse' },
]

// ── Création de tâche ─────────────────────────────────────────────────────────
const tacheModal = ref(false)
const tacheForm  = reactive({
  intitule:   '',
  date_debut: '',
  date_fin:   '',
  priorite:   'Moyenne',
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
      dossier_id: currentDossier.value?.id,
      activite_id: activite.value.id,
      codir_id: currentCodir.value?.id,
    })
    await refreshActivite()
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
  <div class="mx-auto py-10 px-6">

    <!-- Retour -->
    <div class="mb-6 flex items-center gap-3">
      <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" @click="router.back()" />
      <span class="text-gray-400 text-sm">Retour au dossier</span>
    </div>

    <!-- Loader -->
    <div v-if="loading" class="flex justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-violet-500" />
    </div>

    <!-- Introuvable -->
    <div v-else-if="!activite" class="text-center py-20">
      <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 mx-auto text-amber-400 mb-4" />
      <p class="text-gray-500 text-sm">Activité introuvable.</p>
      <UButton class="mt-4" color="gray" variant="ghost" @click="router.back()">Retour</UButton>
    </div>

    <template v-else>

      <!-- ── En-tête ────────────────────────────────────────────────────── -->
      <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 mb-6">
        <div class="p-6 border-b border-gray-100 dark:border-gray-800">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-950/40 flex items-center justify-center shrink-0">
              <UIcon name="i-heroicons-bolt" class="w-6 h-6 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">{{ activite.libelle }}</h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">Activité #{{ activite.id }}</p>
            </div>
          </div>
        </div>

        <!-- ── Métadonnées ─────────────────────────────────────────────── -->
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Dossier</p>
              <p class="font-medium text-gray-900 dark:text-white text-sm">
                {{ currentDossier?.libelle ?? 'Non spécifié' }}
              </p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Ordre du jour</p>
              <p class="font-medium text-gray-900 dark:text-white text-sm">
                {{ currentOrdreDuJour?.libelle ?? 'Non spécifié' }}
              </p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">CODIR</p>
              <p class="font-medium text-gray-900 dark:text-white text-sm">
                {{ currentCodir?.date ? formatDateFR(currentCodir.date) : 'Non spécifié' }}
              </p>
            </div>
          </div>

          <!-- Action associée -->
          <div v-if="activite.action?.libelle" class="mt-4 bg-violet-50 dark:bg-violet-950/20 rounded-lg p-4 flex items-center gap-3">
            <UIcon name="i-heroicons-link" class="w-4 h-4 text-violet-500 shrink-0" />
            <div>
              <p class="text-xs text-violet-500 dark:text-violet-400">Action associée</p>
              <p class="font-medium text-violet-900 dark:text-violet-200 text-sm">{{ activite.action.libelle }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Tâches ──────────────────────────────────────────────────────── -->
      <section>
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-base font-semibold flex items-center gap-2">
            <UIcon name="i-heroicons-check-circle" class="text-blue-500" />
            Tâches
            <UBadge color="blue" variant="soft" size="xs">{{ taches.length }}</UBadge>
          </h2>
          <UButton icon="i-heroicons-plus" color="blue" variant="soft" size="sm" @click="tacheModal = true">
            Ajouter une tâche
          </UButton>
        </div>

        <div v-if="!taches.length"
          class="text-center py-8 text-gray-400 text-sm bg-gray-50 dark:bg-slate-800/50 rounded-xl">
          Aucune tâche rattachée à cette activité
        </div>

        <div v-else class="flex flex-col gap-3">
          <div v-for="(tache, index) in taches" :key="tache.id" class="flex items-start gap-3">
            <div class="shrink-0 mt-3 w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
              <span class="text-xs font-bold text-blue-600 dark:text-blue-300">{{ index + 1 }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <TacheCard
                :tache="tache"
                :codirId="currentCodir?.id"
                @updated="refreshActivite"
              />
            </div>
          </div>
        </div>
      </section>

    </template>
  </div>

  <!-- ── Modale création tâche ──────────────────────────────────────────────── -->
  <UModal v-model="tacheModal">
    <UCard class="rounded-2xl max-h-[80vh] flex flex-col">
      <template #header>
        <h3 class="font-semibold">Nouvelle tâche</h3>
      </template>

      <div class="p-2 flex flex-col gap-4 overflow-y-auto">
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

        <UFormGroup label="Membres assignés">
          <AppSelectSearch
            v-model="tacheForm.membre_ids"
            :options="membreOptions"
            :multiple="true"
            :loading="membreApi.loading.value"
            placeholder="Rechercher des membres..."
          />
        </UFormGroup>
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