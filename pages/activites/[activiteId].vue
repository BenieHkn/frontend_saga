<script setup>
import { useActivite } from '@/composables/activite/useActivite'
import { useMembre } from '@/composables/membres/useMembres'
import { formatDateFR } from '@/composables/codirs/useCodir'
import { useAuth } from '@/composables/auth/useAuth'
import { useTache } from '~/composables/taches/useTaches'

definePageMeta({ title: 'Détail activité' })

const router      = useRouter()
const route       = useRoute()
const toast       = useToast()
const activiteApi = useActivite()
const membreApi   = useMembre()
const tacheApi    = useTache()

const clearCurrents = () => {
  if (!process.client) return
  try {
    localStorage.removeItem('currentActivite')
  } catch (e) {}
}
const handleReturn = () => {
  clearCurrents()
  router.back()
}

const activiteId = Number(route.params.activiteId)

// ── State ─────────────────────────────────────────────────────────────────────
const activite           = ref(null)
const currentDossier     = ref(null)
const currentOrdreDuJour = ref(null)
const currentCodir       = ref(null)
const pageLoading        = ref(false) // chargement initial de la page
const loading            = ref(false) // chargement des opérations CRUD
const membres            = ref([])

const membresOptions = computed(() =>
  membres.value.map((membre) => ({
    label: membre.entite_user?.entite?.code,
    value: membre.id
  }))
)

// ── Auth ──────────────────────────────────────────────────────────────────────
const { peutGererCodir } = useAuth()

// ── Montage ───────────────────────────────────────────────────────────────────
onMounted(async () => {
  pageLoading.value        = true
  currentDossier.value     = JSON.parse(localStorage.getItem('currentDossier'))
  currentOrdreDuJour.value = JSON.parse(localStorage.getItem('currentOrdreDuJour'))
  currentCodir.value       = JSON.parse(localStorage.getItem('currentCodir'))
  membres.value            = JSON.parse(localStorage.getItem('membres'))
  await refreshActivite()
  pageLoading.value = false
})

const taches = computed(() => activite.value?.taches ?? [])

// ── Refresh ───────────────────────────────────────────────────────────────────
const refreshActivite = async () => {
  try {
    activite.value = await activiteApi.getActivite(activiteId)
    if (process.client) {
      localStorage.setItem('currentActivite', JSON.stringify(activite.value))
    }
  } catch (error) {
    console.log(error)
  }
}

// ── Modales Tâche ─────────────────────────────────────────────────────────────
const tacheModal        = ref(false)
const tacheEditModal    = ref(false)
const tacheDeleteModal  = ref(false)
const tacheDetailsModal = ref(false)
const selectedTache     = ref(null)
const isDeletingTache   = ref(false)

const openTacheEdit = (tache) => {
  selectedTache.value  = tache
  tacheEditModal.value = true
}

const openTacheDetails = (tache) => {
  selectedTache.value     = tache
  tacheDetailsModal.value = true
}

const openTacheDelete = (tache) => {
  selectedTache.value    = tache
  tacheDeleteModal.value = true
}

// ── CRUD Tâche ────────────────────────────────────────────────────────────────
const addTacheToActivite = async (form) => {
  loading.value = true
  try {
    await tacheApi.createTache({ ...form, activite_id: activite.value.id, codir_id: currentCodir.value.id})
    await refreshActivite()
    tacheModal.value = false
    toast.add({ title: 'Tâche ajoutée avec succès', color: 'green', icon: 'i-heroicons-check-circle' })
  } catch (error) {
    console.log(error)
    toast.add({ title: "Erreur lors de l'ajout de la tâche", color: 'red' })
  } finally {
    loading.value = false
  }
}

const handleTacheUpdated = async (form) => {
  loading.value = true
  try {
    await tacheApi.updateTache(selectedTache.value.id, form)
    tacheEditModal.value = false
    await refreshActivite()
    toast.add({ title: 'Tâche modifiée', color: 'green', icon: 'i-heroicons-check-circle' })
  } catch {
    toast.add({ title: 'Erreur', description: 'Impossible de modifier la tâche', color: 'red' })
  } finally {
    loading.value = false
  }
}

const confirmDeleteTache = async () => {
  if (!selectedTache.value) return
  isDeletingTache.value = true
  try {
    await tacheApi.deleteTache(selectedTache.value.id)
    tacheDeleteModal.value = false
    selectedTache.value    = null
    await refreshActivite()
    toast.add({ title: 'Tâche supprimée', color: 'green', icon: 'i-heroicons-check-circle' })
  } catch {
    toast.add({ title: 'Erreur', description: 'Impossible de supprimer la tâche', color: 'red' })
  } finally {
    isDeletingTache.value = false
  }
}
</script>

<template>
  <div class="mx-auto py-10 px-6">

    <!-- Retour -->
    <div class="mb-6 flex items-center gap-3">
      <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" @click="handleReturn()" />
      <span class="text-gray-400 text-sm">Retour au dossier</span>
    </div>

    <!-- Loader page initiale -->
    <div v-if="pageLoading" class="flex flex-col items-center justify-center py-32 gap-4">
      <UIcon name="i-heroicons-arrow-path" class="w-10 h-10 animate-spin text-violet-500" />
      <p class="text-sm text-gray-400">Chargement de l'activité...</p>
    </div>

    <!-- Introuvable -->
    <div v-else-if="!pageLoading && !activite" class="text-center py-20">
      <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 mx-auto text-amber-400 mb-4" />
      <p class="text-gray-500 text-sm">Activité introuvable.</p>
      <UButton class="mt-4" color="gray" variant="ghost" @click="handleReturn()">Retour</UButton>
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

          <div v-if="activite.action?.libelle" class="mt-4 bg-violet-50 dark:bg-violet-950/20 rounded-lg p-4 flex items-center gap-3">
            <UIcon name="i-heroicons-link" class="w-4 h-4 text-violet-500 shrink-0" />
            <div>
              <p class="text-xs text-violet-500 dark:text-violet-400">Action associée</p>
              <p class="font-medium text-violet-900 dark:text-violet-200 text-sm">{{ activite.action.libelle }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Tâches ─────────────────────────────────────────────────────── -->
      <section>
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-base font-semibold flex items-center gap-2">
            <UIcon name="i-heroicons-check-circle" class="text-blue-500" />
            Tâches
            <UBadge color="blue" variant="soft" size="xs">{{ taches.length }}</UBadge>
          </h2>
          <UButton v-if="peutGererCodir()" icon="i-heroicons-plus" color="blue" variant="soft" size="sm" @click="tacheModal = true">
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
                :codir-id="currentCodir?.id"
                :peut-gerer-codir="peutGererCodir()"
                @update="refreshActivite"
                @edit="openTacheEdit"
                @delete="openTacheDelete"
                @details="openTacheDetails"
              />
            </div>
          </div>
        </div>
      </section>

    </template>
  </div>

  <!-- Modale création tâche -->
  <TacheFormModal
    v-model="tacheModal"
    :activite-id="activite?.id"
    :loading-create-or-update="loading"
    :membres-options="membresOptions"
    @create="addTacheToActivite"
  />

  <!-- Modale édition tâche -->
  <TacheFormModal
    v-if="selectedTache"
    v-model:open="tacheEditModal"
    :tache="selectedTache"
    :codir-id="currentCodir?.id"
    :loading-create-or-update="loading"
    :membres-options="membresOptions"
    @update="handleTacheUpdated"
  />

  <!-- Modale détails tâche -->
  <TacheDetailModal
    v-if="selectedTache"
    v-model:open-detail-tache-modal="tacheDetailsModal"
    :tache="selectedTache"
    :codir-id="currentCodir?.id"
  />

  <!-- Modale suppression tâche -->
  <ConfirmationSuppressionModal
    v-if="selectedTache"
    v-model:open-confirmation-modal="tacheDeleteModal"
    titre="Supprimer la tâche"
    :message="`Voulez-vous vraiment supprimer la tâche &quot;${selectedTache?.intitule}&quot; ?`"
    confirm-label="Supprimer"
    :loading="isDeletingTache"
    @confirm="confirmDeleteTache"
    @cancel="tacheDeleteModal = false"
  />
</template>
