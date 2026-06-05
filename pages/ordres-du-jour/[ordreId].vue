<script setup>
import { useOrdreDuJour } from '@/composables/ordres-du-jour/useOrdreDuJour'
import { useDossier } from '@/composables/dossier/useDossier'
import { formatDateFR, useCodir } from '@/composables/codirs/useCodir'
import { useCommentaire } from '@/composables/commentaire/useCommentaire'
import { useTache } from '@/composables/taches/useTaches'
import { useActivite } from '@/composables/activite/useActivite'
import { useAction } from '@/composables/actions/useAction'
import { useMembre } from '@/composables/membres/useMembres'
import CommentaireModal from '@/components/commentaire/CommentaireModal.vue'
import CommentaireListeModal from '@/components/commentaire/CommentaireListeModal.vue'
import DossierDetail from '~/components/dossier/DossierDetail.vue'
import ActionFormModal from '~/components/action/ActionFormModal.vue'
import ActiviteFormModal from '~/components/activite/ActiviteFormModal.vue'
import { useAuth } from '~/composables/auth/useAuth'
import { useStorage } from '@/composables/useStorage'
import { useDocumentService } from '~/service/documents/documentService'

definePageMeta({ title: "Détail ordre du jour" })

const route = useRoute()
const router = useRouter()
const toast = useToast()

// ── État des modales ──────────────────────────────────────────────────────────
const dossierModal = ref(false)
const selectedDossier = ref(null)
const dossierDeleteModal = ref(false)
const dossierToDeleteId = ref(null)
const isDeletingDossier = ref(false)
const isSavingDossier = ref(false)
const dossierDetailModal = ref(false)
const openCommentaireModal = ref(false)
const openListeCommentairesModal = ref(false)

// ── Composables ───────────────────────────────────────────────────────────────
const ordreDuJourApi = useOrdreDuJour()
const dossierApi     = useDossier()
const tacheApi       = useTache()
const activiteApi    = useActivite()
const actionApi      = useAction()
const membreApi      = useMembre()
const { peutGererCodir } = useAuth()

//les fonctions de crud commentaire
const {
  commentaires,
  creerCommentaire,
  fetchCommentaires,
  loading: commentairesLoading,
} = useCommentaire()

// ── State ─────────────────────────────────────────────────────────────────────
const ordreId = Number(route.params.ordreId)
const currentOrdreDuJour = ref(null)
const currentCodir = ref(null)
const currentDossier = ref(null)
const loading = ref(true)
const entiteUser = ref()
const membresForSelect = ref([])
const documents = ref([])

const fetchMembresLocaux = async () => {
  membresForSelect.value = await membreApi.getMembres()
}
const membresOptions = computed(() =>
  membresForSelect.value.map(m => ({ label: m.entite_user?.entite?.code ?? '', value: m.id }))
)

const {getDocumentsFromMonth} = useDocumentService()

// ── Liste des dossiers ──────────────────────────────────────────────────────────────────
const dossiers = computed(() => currentOrdreDuJour.value?.dossiers ?? [])


// ── Helpers statut ────────────────────────────────────────────────────────────
const statutClass = (statut) => {
  const classes = {
    'ouvert':    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'fermé':     'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    'en cours':  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'archivé':   'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
  }
  return classes[statut?.toLowerCase()] ?? 'bg-gray-100 text-gray-500'
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const refreshData = async () => {
  currentOrdreDuJour.value = await ordreDuJourApi.getOrdre(ordreId)
  console.log("ordre mis à jour", currentOrdreDuJour.value)
  enregistrerDansLocalStorage("currentOrdreDuJour", currentOrdreDuJour.value)
}

const {enregistrerDansLocalStorage} = useStorage()


const clearCurrents = () => {
  if (!process.client) return
  try { localStorage.removeItem('currentOrdreDuJour') } catch (e) {}
}

const handleReturn = () => {
  clearCurrents()
  router.back()
}

// ── Fetch initial ─────────────────────────────────────────────────────────────
const fetchOrdreDuJour = async () => {
  try {
    currentOrdreDuJour.value = await ordreDuJourApi.fetchOrdre(ordreId)
    console.log("Les dossiers de l'ordre du jour", currentOrdreDuJour.value.dossiers);
    localStorage.setItem("currentOrdreDuJour", JSON.stringify(currentOrdreDuJour.value))
  } catch {
    console.warn("Impossible de rafraîchir l'ordre du jour, utilisation du cache")
  }
}

// ── Actions ouverture modales ─────────────────────────────────────────────────
const openCreateDossier = () => {
  console.log('openCreateDossier called');
  selectedDossier.value = null
  dossierModal.value = true
}

const openDetailDossier = (dossier) => {
  selectedDossier.value = dossier
  dossierDetailModal.value = true
}

const openEditDossier = (dossier) => {
  selectedDossier.value = dossier
  dossierModal.value = true
}

const openDeleteDossier = (dossier) => {
  dossierToDeleteId.value = dossier.id
  dossierDeleteModal.value = true
}

// ── Soumissions dossier ───────────────────────────────────────────────────────
const addDossierSubmit = async (form) => {
  console.log(form)
  isSavingDossier.value = true
  try {
    await dossierApi.handleAddDossier(ordreId, form)
    await refreshData()
    dossierModal.value = false
    toast.add({ title: 'Dossier ajouté', color: 'green', icon: 'i-heroicons-check-circle' })
  } catch {
    toast.add({ title: 'Erreur', description: "Impossible d'ajouter le dossier", color: 'red', icon: 'i-heroicons-exclamation-circle' })
  } finally {
    isSavingDossier.value = false
  }
}

const updateDossierSubmit = async (form) => {
  isSavingDossier.value = true
  try {
    await dossierApi.handleUpdateDossier(selectedDossier.value.id, form)
    await refreshData()
    dossierModal.value = false
    toast.add({ title: 'Dossier mis à jour', color: 'green', icon: 'i-heroicons-check-circle' })
  } catch {
    toast.add({ title: 'Erreur', description: 'Impossible de modifier le dossier', color: 'red', icon: 'i-heroicons-exclamation-circle' })
  } finally {
    isSavingDossier.value = false
  }
}

const confirmDeleteDossierAction = async () => {
  if (!dossierToDeleteId.value) return
  isDeletingDossier.value = true
  try {
    await dossierApi.handleDeleteDossier(dossierToDeleteId.value)
    await refreshData()
    toast.add({ title: 'Dossier retiré', color: 'green', icon: 'i-heroicons-check-circle' })
    dossierDeleteModal.value = false
    dossierToDeleteId.value = null
  } catch {
    toast.add({ title: 'Erreur', description: 'Impossible de retirer le dossier', color: 'red', icon: 'i-heroicons-exclamation-circle' })
  } finally {
    isDeletingDossier.value = false
  }
}

// ── Tâche depuis card dossier ─────────────────────────────────────────────────
const tacheModalOpen   = ref(false)
const activiteModalOpen = ref(false)
const actionModalOpen  = ref(false)
const activiteForm = reactive({ libelle: '', action_id: null, dossier_id: null })
const resetActiviteForm = () => Object.assign(activiteForm, { libelle: '', action_id: null, dossier_id: null })
const isSavingAction  = ref(false)
const isSavingActivite = ref(false)

const openAddTache = (dossier) => {
  selectedDossier.value = dossier
  tacheModalOpen.value  = true
}

const openAddActivite = (dossier) => {
  selectedDossier.value  = dossier
  activiteForm.dossier_id = dossier.id
  activiteModalOpen.value = true
}

const openAddAction = (dossier) => {
  selectedDossier.value = dossier
  actionModalOpen.value = true
}

const handleTacheCreated = async (form) => {
  if (!selectedDossier.value) return
  try {
    await tacheApi.createTache({ ...form, dossier_id: selectedDossier.value.id })
    tacheModalOpen.value = false
    await refreshData()
    toast.add({ title: 'Tâche créée', color: 'green', icon: 'i-heroicons-check-circle' })
  } catch {
    toast.add({ title: 'Erreur', description: 'Impossible de créer la tâche', color: 'red' })
  }
}

const handleActiviteCreated = async (form) => {
  if (!form.libelle?.trim()) {
    toast.add({ title: 'Champ requis', description: 'Le libellé est obligatoire', color: 'orange' })
    return
  }
  isSavingActivite.value = true
  try {
    await activiteApi.createActivite({ ...form, dossier_id: selectedDossier.value?.id ?? form.dossier_id })
    activiteModalOpen.value = false
    await refreshData()
    toast.add({ title: 'Activité créée', color: 'green', icon: 'i-heroicons-check-circle' })
  } catch {
    toast.add({ title: 'Erreur', description: 'Impossible de créer l’activité', color: 'red' })
  } finally {
    isSavingActivite.value = false
  }
}

const handleActionCreated = async (libelle) => {
  if (!libelle?.trim() || !selectedDossier.value) return
  isSavingAction.value = true
  try {
    await actionApi.createAction({ libelle: libelle.trim(), dossier_id: selectedDossier.value.id })
    actionModalOpen.value = false
    await refreshData()
    toast.add({ title: 'Action créée', color: 'green', icon: 'i-heroicons-check-circle' })
  } catch {
    toast.add({ title: 'Erreur', description: 'Impossible de créer l’action', color: 'red' })
  } finally {
    isSavingAction.value = false
  }
}

// ── Navigation et commentaires ────────────────────────────────────────────────
const handleClick = (dossier) => {
  if (process.client)
    localStorage.setItem("currentDossier", JSON.stringify(dossier))
  navigateTo(`/dossiers/${dossier.id}`)
}

const openCommentairePourDossier = (dossier) => {
  currentDossier.value = dossier
  openCommentaireModal.value = true
}

const openLectureCommentairesPourDossier = async (dossier) => {
  currentDossier.value = dossier
  await fetchCommentaires('dossier', dossier.id)
  openListeCommentairesModal.value = true
}

const handleRecupererCommentaire = async (contenu) => {
  if (!currentDossier.value) return
  await creerCommentaire({
    commentable_id: currentDossier.value.id,
    commentable_type: 'dossier',
    contenu,
  })
  await fetchOrdreDuJour()
}


const loadData=async()=>{
   currentCodir.value = JSON.parse(localStorage.getItem("currentCodir"))
  fetchOrdreDuJour()
  chargerDocuments()
}

const chargerDocuments = async()=>{
  documents.value = await getDocumentsFromMonth()
  console.log("Les documents", documents.value)
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(async () => {
  await loadData()
  fetchMembresLocaux()
  loading.value = false
})
</script>

<template>
  <div class="mx-auto py-10 px-6">

    <!-- Retour -->
    <div class="mb-6 flex items-center gap-3">
      <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" @click="handleReturn()" />
      <span class="text-gray-400 text-sm">Retour</span>
    </div>

    <!-- Chargement -->
    <div v-if="loading" class="flex justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-blue-500" />
    </div>

    <!-- Introuvable -->
    <div v-else-if="!currentOrdreDuJour" class="text-center py-20">
      <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 mx-auto text-amber-400 mb-4" />
      <p class="text-gray-500 text-sm">Point introuvable ou non chargé.</p>
      <UButton class="mt-4" color="gray" variant="ghost" @click="handleReturn()">Retour</UButton>
    </div>

    <template v-else>

      <!-- ── En-tête ──────────────────────────────────────────────────────── -->
      <UCard class="rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 mb-6">
        <div class="p-2">
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-md">
              <UIcon name="i-heroicons-clipboard-document-list" class="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">
                {{ currentOrdreDuJour.libelle }}
              </h1>
              <span
                :class="`text-xs font-semibold px-2.5 py-1 rounded-full capitalize mt-1 inline-block ${statutClass(currentOrdreDuJour.statut)}`">
                {{ currentOrdreDuJour.statut }}
              </span>
            </div>
          </div>

          <div class="flex items-center gap-6 mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <UIcon name="i-heroicons-folder" class="w-4 h-4 text-violet-500" />
              <span>
                <strong class="text-gray-800 dark:text-white">{{ dossiers.length }}</strong> dossier(s)
              </span>
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <UIcon name="i-heroicons-building-office" class="w-4 h-4 text-blue-500" />
              <span class="text-xs text-gray-400">
                CODIR du {{ formatDateFR(currentCodir?.date) }}
              </span>
            </div>
          </div>
        </div>
      </UCard>

      <!-- ── Liste des dossiers ───────────────────────────────────────────── -->
      <section>
        <h2 class="text-base font-semibold flex items-center gap-2 mb-3">
          <UIcon name="i-heroicons-folder-open" class="text-violet-500" />
          Dossiers rattachés
          <UBadge color="violet" variant="soft" size="xs">{{ dossiers.length }}</UBadge>
          <UButton
            v-if="peutGererCodir()"
            icon="i-heroicons-plus"
            color="blue"
            variant="soft"
            @click="openCreateDossier"
          >
            Ajouter
          </UButton>
        </h2>

        <div v-if="!dossiers.length"
          class="text-center py-8 text-gray-400 text-sm bg-gray-50 dark:bg-slate-800/50 rounded-xl">
          Aucun dossier rattaché à cet ordre du jour
        </div>

        <div v-else class="flex flex-col gap-2">
          <DossierCard
            v-for="(dossier, index) in dossiers"
            :key="dossier.id"
            :dossier="dossier"
            :index="index"
            :peut-gerer-codir="peutGererCodir()"
            @click="handleClick(dossier)"
            @detail="openDetailDossier(dossier)"
            @delete="openDeleteDossier(dossier)"
            @commenter="openCommentairePourDossier(dossier)"
            @lire-commentaires="openLectureCommentairesPourDossier(dossier)"
            @edit="openEditDossier(dossier)"
            @add-tache="openAddTache(dossier)"
            @add-activite="openAddActivite(dossier)"
            @add-action="openAddAction(dossier)"
          />
        </div>
      </section>

    </template>

    <UAlert
      v-if="ordreDuJourApi.error.value"
      color="red"
      icon="i-heroicons-exclamation-circle"
      :title="ordreDuJourApi.error.value"/>

    <!-- ── Modale ajout action depuis card ────────────────────────────────────── -->
    <ActionFormModal
      v-model:open="actionModalOpen"
      :dossier-id="selectedDossier?.id"
      @create="handleActionCreated"
    />

    <ConfirmationSuppressionModal
      v-model:openConfirmationModal="dossierDeleteModal"
      titre="Confirmer la suppression"
      message="Voulez-vous vraiment retirer ce dossier de l'ordre du jour ?"
      :loading="isDeletingDossier"
      @confirm="confirmDeleteDossierAction"
      @cancel="dossierDeleteModal = false"
    />
    <!-- ── Modale ajout tâche depuis card ───────────────────────────────────── -->
    <TacheFormModal
      v-model:open="tacheModalOpen"
      :dossier-id="selectedDossier?.id"
      :membres-options="membresOptions"
      @create="handleTacheCreated"
    />

    <!-- ── Modale ajout activité depuis card ─────────────────────────────────── -->
    <!-- <UModal v-model="activiteModalOpen">
      <UCard class="rounded-2xl">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold">Nouvelle activité</h3>
            <UButton icon="i-heroicons-x-mark" color="gray" variant="ghost" size="xs" @click="activiteModalOpen = false" />
          </div>
        </template>
        <div class="p-2 flex flex-col gap-4">
          <UFormGroup label="Libellé" required>
            <UTextarea v-model="activiteForm.libelle" placeholder="Ex : Formation du personnel" rows="3" />
          </UFormGroup>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" @click="activiteModalOpen = false; resetActiviteForm()">Annuler</UButton>
            <UButton color="violet" variant="soft" :loading="isSavingActivite" @click="handleActiviteCreated">Créer</UButton>
          </div>
        </template>
      </UCard>
    </UModal> -->

    <ActiviteFormModal
      v-model:open="activiteModalOpen"
      :dossier-id="selectedDossier?.id"
      @create="handleActiviteCreated"
    />
    
    <!-- ── Modale ajout action depuis card ────────────────────────────────────── -->
    <ActionFormModal
      v-model:openActionModal="actionModalOpen"
      :loading="isSavingAction"
      @create-action="handleActionCreated"
    />

  </div>
</template>