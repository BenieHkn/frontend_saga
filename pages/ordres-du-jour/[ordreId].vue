<script setup>
import { useOrdreDuJour } from '@/composables/ordres-du-jour/useOrdreDuJour'
import { useDossier } from '@/composables/dossier/useDossier'
import { formatDateFR, useCodir } from '@/composables/codirs/useCodir'
import { useCommentaire } from '@/composables/commentaire/useCommentaire'
import CommentaireModal from '@/components/commentaire/CommentaireModal.vue'
import CommentaireListeModal from '@/components/commentaire/CommentaireListeModal.vue'
import { useAuth } from '~/composables/auth/useAuth'

definePageMeta({ title: "Détail ordre du jour" })

const route = useRoute()
const router = useRouter()
const toast = useToast()

const clearCurrents = () => {
  if (!process.client) return
  try {
    localStorage.removeItem('currentOrdreDuJour')
  } catch (e) {}
}
const handleReturn = () => {
  clearCurrents()
  router.back()
}

const ordreDuJourApi = useOrdreDuJour()
const dossierApi = useDossier()
const codirApi = useCodir()

const {
  commentaires,
  creerCommentaire,
  fetchCommentaires,
  openCommentaireModal,
  openListeCommentairesModal,
  loading: commentairesLoading,
} = useCommentaire()

const ordreId = Number(route.params.ordreId)
const currentOrdreDuJour = ref(null)
const currentCodir = ref(null)
const currentDossier = ref(null)
const loading = ref(true)
const { peutGererCodir } = useAuth()

// ── Fetch ─────────────────────────────────────────────────────────────────────
const fetchOrdreDuJour = async () => {
  try {
    currentOrdreDuJour.value = await ordreDuJourApi.fetchOrdre(ordreId)
  } catch {
    console.warn("Impossible de rafraîchir l'ordre du jour, utilisation du cache")
  }
}

const entiteUser = ref()



// ── Computed ──────────────────────────────────────────────────────────────────
const dossiers = computed(() => currentOrdreDuJour.value?.dossiers ?? [])

// ── Statut badge ──────────────────────────────────────────────────────────────
const statutClass = (statut) => {
  const map = {
    actif: 'text-green-600 bg-green-50 dark:bg-green-950/40',
    inactif: 'text-gray-500 bg-gray-100 dark:bg-gray-800/60',
    archivé: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40',
  }
  return map[statut] ?? 'text-gray-500 bg-gray-100'
}

// ── Ajout / Modif dossier ─────────────────────────────────────────────────────────────
const dossierModal = ref(false)
const selectedDossier = ref(null)

const openCreateDossier = () => {
  selectedDossier.value = null
  dossierModal.value = true
}

const openEditDossier = (dossier) => {
  selectedDossier.value = dossier
  dossierModal.value = true
}

const handleAddDossier = async (form) => {
  try {
    await ordreDuJourApi.addDossier(ordreId, form)
    currentCodir.value = await codirApi.fetchCodir(currentCodir.value.id)
    currentOrdreDuJour.value = await ordreDuJourApi.fetchOrdre(ordreId)
  
    toast.add({
      title: 'Dossier créé',
      description: `"${form.libelle}" a été ajouté à l'ordre du jour`,
      color: 'green',
      icon: 'i-heroicons-check-circle',
    })
    dossierModal.value = false
  } catch {
    toast.add({
      title: 'Erreur',
      description: 'Impossible de créer le dossier',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
    })
  }
}

const handleUpdateDossier = async (form) => {
  try {
    await dossierApi.updateDossier(selectedDossier.value.id, form)
    currentCodir.value = await codirApi.fetchCodir(currentCodir.value.id)
    currentOrdreDuJour.value = await ordreDuJourApi.fetchOrdre(ordreId)
    toast.add({ title: 'Dossier modifié', color: 'green', icon: 'i-heroicons-check-circle' })
  } catch {
    toast.add({ title: 'Erreur', description: 'Impossible de modifier le dossier', color: 'red' })
  }
}

// ── Suppression dossier ───────────────────────────────────────────────────────
const dossierDeleteModal = ref(false)
const dossierToDeleteId = ref(null)
const isDeletingDossier = ref(false)

const openDeleteDossier = (dossier) => {
  dossierToDeleteId.value = dossier.id
  dossierDeleteModal.value = true
}

const confirmDeleteDossierAction = async () => {
  if (!dossierToDeleteId.value) return
  isDeletingDossier.value = true
  try {
    await ordreDuJourApi.removeDossier(ordreId, dossierToDeleteId.value)
    currentCodir.value = await codirApi.fetchCodir(currentCodir.value.id)
    currentOrdreDuJour.value = await ordreDuJourApi.fetchOrdre(ordreId)
    toast.add({ title: 'Dossier retiré', color: 'green', icon: 'i-heroicons-check-circle' })
    dossierDeleteModal.value = false
    dossierToDeleteId.value = null
  } catch {
    toast.add({ title: 'Erreur', description: 'Impossible de retirer le dossier', color: 'red', icon: 'i-heroicons-exclamation-circle' })
  } finally {
    isDeletingDossier.value = false
  }
}

// ── Navigation vers dossier ───────────────────────────────────────────────────
const handleClick = (dossier) => {
  if (process.client)
    localStorage.setItem("currentDossier", JSON.stringify(dossier))
  navigateTo(`/dossiers/${dossier.id}`)
}

const openCommentairePourDossier = async (dossier) => {
  currentDossier.value = dossier
  if (process.client) {
    openCommentaireModal.value = true
  }
}

const openLectureCommentairesPourDossier = async (dossier) => {
  currentDossier.value = dossier
  await fetchCommentaires('dossier', dossier.id)
  if (process.client) {
    openListeCommentairesModal.value = true
  }
}

const handleRecupererCommentaire = async (contenu) => {
  if (!currentDossier.value) return;
  await creerCommentaire({
    commentable_id: currentDossier.value.id,
    commentable_type: 'dossier',
    contenu,
  })

  await fetchOrdreDuJour() // Rafraîchir l'ordre du jour pour mettre à jour le nombre de commentaires
}

onMounted(async () => {
  currentCodir.value = JSON.parse(localStorage.getItem("currentCodir"))
  await fetchOrdreDuJour()
  entiteUser.value = JSON.parse(localStorage.getItem("entite_user"))
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
    <div v-else-if="!currentOrdreDuJour && !loading" class="text-center py-20">
      <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 mx-auto text-amber-400 mb-4" />
      <p class="text-gray-500 text-sm">Point introuvable ou non chargé.</p>
      <UButton class="mt-4" color="gray" variant="ghost" @click="handleReturn()">Retour</UButton>
    </div>

    <template v-else>

      <!-- ── En-tête ─────────────────────────────────────────────────────── -->
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

      <!-- ── Liste des dossiers ──────────────────────────────────────────── -->
      <section>
        <h2 class="text-base font-semibold flex items-center gap-2 mb-3">
          <UIcon name="i-heroicons-folder-open" class="text-violet-500" />
          Dossiers rattachés
          <UBadge color="violet" variant="soft" size="xs">{{ dossiers.length }}</UBadge>
          <UButton v-if="peutGererCodir()" icon="i-heroicons-plus" color="blue" variant="soft" @click="openCreateDossier">
            Ajouter
          </UButton>
        </h2>

        <div v-if="!dossiers.length"
          class="text-center py-8 text-gray-400 text-sm bg-gray-50 dark:bg-slate-800/50 rounded-xl">
          Aucun dossier rattaché à cet ordre du jour
        </div>

        <div v-else class="flex flex-col gap-2">
          <!-- ✅ Empêcher la propagation du clic depuis le bouton supprimer -->
          <DossierCard
            v-for="(dossier, index) in dossiers"
            :key="dossier.id"
            :dossier="dossier"
            :index="index"
            :peut-gerer-codir="peutGererCodir()"
            @click="handleClick(dossier)"
            @delete="openDeleteDossier(dossier)"
            @commenter="openCommentairePourDossier(dossier)"
            @lire-commentaires="openLectureCommentairesPourDossier(dossier)"
            @edit="openEditDossier(dossier)"
          />
        </div>
      </section>

    </template>

    <UAlert v-if="ordreDuJourApi.error.value" color="red" icon="i-heroicons-exclamation-circle"
      :title="ordreDuJourApi.error.value" class="mt-4" />

  </div>

  <CommentaireModal
    v-model:openCommentaireModal="openCommentaireModal"
    :loading="commentairesLoading"
    @commenter="handleRecupererCommentaire"
  />

  <CommentaireListeModal
    v-model:openListeCommentairesModal="openListeCommentairesModal"
    :commentaires="commentaires"
    :entiteUser="entiteUser"
  />

  <!-- ── Modale dossier (Ajout / Modif) ───────────────────────────────────────────────── -->
  <DossierFormModal
    v-model:open="dossierModal"
    :dossier="selectedDossier"
    :ordreId="ordreId"
    @created="handleAddDossier"
    @updated="handleUpdateDossier"
  />

  <!-- ── Modale suppression dossier ───────────────────────────────────────────────── -->
  <ConfirmationSuppressionModal
    v-model:openConfirmationModal="dossierDeleteModal"
    titre="Confirmer la suppression"
    message="Voulez-vous vraiment retirer ce dossier de l'ordre du jour ?"
    :loading="isDeletingDossier"
    @confirm="confirmDeleteDossierAction"
    @cancel="dossierDeleteModal = false"
  />
</template>