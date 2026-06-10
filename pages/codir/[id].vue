<script setup>
import {
  formatDateFR,
  extractTime,
  extractDateInput,
  extractTimeInput,
  getStatutConfig,
  STATUT_OPTIONS,
  useCodir,
} from '@/composables/codirs/useCodir'

import { useMembre } from '@/composables/membres/useMembres'
import { useAuth } from '~/composables/auth/useAuth'
import { useOrdreDuJour } from '~/composables/ordres-du-jour/useOrdreDuJour'
import { useCommentaire } from '~/composables/commentaire/useCommentaire'
import { usePresence } from '~/composables/presence/usePresence'

definePageMeta({ title: 'Détail CODIR' })

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)
const toast = useNuxtApp().$toast ?? useToast()
const loading = ref(false)


const {
  getCodir,
  updateCodir,
  detachODJ,
  savePresences,
  getPresences,
} = useCodir()

const ordreDuJourApi = useOrdreDuJour()

const membreApi = useMembre()

const { peutGererCodir } = useAuth()

const {
  commentaires,
  creerCommentaire,
  fetchCommentaires,
  openCommentaireModal,
  openListeCommentairesModal,
  loading: commentairesLoading,
} = useCommentaire()

const commentableTarget = ref(null)

// ── Data ──────────────────────────────────────────────────────────────────────
const codir = ref(null)
const membres = ref([])

// ── Steps ─────────────────────────────────────────────────────────────────────
const currentStep = ref(1)

const STEP_KEY = `codir_step_${id}`

// ── Edition ───────────────────────────────────────────────────────────────────
const editing = ref(false)
const editForm = reactive({ date: '', heure_debut: '', heure_fin: '', statut: '' })

// ── Ordres du jour - gestion de modale
const ordreModal = ref(false)
const selectedOrdre = ref(null) // in case we want to edit later, though currently only add is implemented here
const isSavingOrdre = ref(false)
const detachModal = ref(false)
const ordreToDetachId = ref(null)
const ordreToDetachLibelle = computed(() => {
  return codir.value?.ordres_du_jour?.find((ordre) => ordre.id === ordreToDetachId.value)?.libelle ?? ''
})

const fetchCodir = async () => {
  const data = await getCodir(id)
  codir.value = data
  if (process.client)
    localStorage.setItem('currentCodir', JSON.stringify(data))
}

const getMembres = async () => {
  try {
    const data = await membreApi.getMembres();
    membres.value = data;
    console.log("les membres dans codir", membres.value)
    if (process.client) localStorage.setItem("membres", JSON.stringify(data));
  } catch {
    // Fallback cache
    if (process.client) {
      const cached = localStorage.getItem("membres");
      if (cached) membres.value = JSON.parse(cached);
    }
  }
};

// ── Progression ───────────────────────────────────────────────────────────────
const progressionGlobale = computed(() => {
  const taches = codir.value?.taches ?? []
  if (!taches.length) return 0
  return Math.round(
    taches.reduce((a, t) => a + (t.pivot?.progression ?? 0), 0) / taches.length
  )
})

//sauvegarder les modifications du CODIR
const saveCodir = async () => {
  const updated = await updateCodir(id, editForm)
  codir.value = updated
  toast.add({
    title: 'CODIR mis à jour',
    description: 'Les informations ont été mises à jour avec succès.',
    color: 'green',
    icon: 'i-heroicons-check-circle',
  })
  editing.value = false
}

//pour ouvrir le modal de suppression
const openDetachModal = (ordreId) => {
  ordreToDetachId.value = ordreId
  detachModal.value = true
}
//pour annuler la suppression du point de l'ordre du jour
const cancelDetachOrdre = () => {
  detachModal.value = false
  ordreToDetachId.value = null
}

//confirmer la suppression du point de l'ordre du jour
const confirmDetachOrdre = async () => {
  loading.value = true
  if (!ordreToDetachId.value) return
  await handleDetachOrdre(ordreToDetachId.value)
  loading.value = false
  detachModal.value = false
  ordreToDetachId.value = null
}

//pour ajouter un point à l'ordre du  jour
const addOrdreSubmit = async (form) => {
  isSavingOrdre.value = true
  try {
    const payload = { ...form, codir_id: id, statut: 'actif' }
    await ordreDuJourApi.createOrdre(payload)
    await fetchCodir()
    toast.add({
      title: 'Ordre du jour créé',
      description: `"${form.libelle}" a été ajouté`,
      color: 'green',
      icon: 'i-heroicons-check-circle',
    })
    ordreModal.value = false
  } catch {
    toast.add({
      title: 'Erreur',
      description: "Impossible de créer l'ordre du jour",
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
    })
  } finally {
    isSavingOrdre.value = false
  }
}

const handleOrdreUpdate = async (form) => {
  isSavingOrdre.value = true
  try {
    const payload = { ...form, codir_id: id }
    await ordreDuJourApi.updateOrdre(form.id, payload)
    await fetchCodir()
    toast.add({
      title: 'Ordre du jour mis à jour',
      description: `"${form.libelle}" a été mis à jour`,
      color: 'green',
      icon: 'i-heroicons-check-circle',
    })
    ordreModal.value = false
    selectedOrdre.value = null
  } catch {
    toast.add({
      title: 'Erreur',
      description: "Impossible de mettre à jour l'ordre du jour",
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
    })
  } finally {
    isSavingOrdre.value = false
  }
}

//supprimer un poiht de l'ordre du our
const handleDetachOrdre = async (ordreId) => {
  try {
    await detachODJ(id, ordreId)
    await fetchCodir()
    toast.add({ title: 'Ordre du jour retiré', color: 'green', icon: 'i-heroicons-check-circle' })
  } catch {
    toast.add({
      title: 'Erreur',
      description: "Impossible de retirer l'ordre du jour",
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
    })
  }
}

//surveriller les changements de codir
watch(codir, (c) => {
  if (!c) return
  editForm.date = extractDateInput(c.date)
  editForm.heure_debut = extractTimeInput(c.heure_debut)
  editForm.heure_fin = extractTimeInput(c.heure_fin)
  editForm.statut = c.statut
}, { immediate: true })

// Sync localStorage automatique
watch(codir, (c) => {
  if (c && process.client)
    localStorage.setItem('currentCodir', JSON.stringify(c))
})

const clearCurrents = () => {
  if (!process.client) return
  try {
    localStorage.removeItem('currentCodir')
  } catch (e) {}
}
const handleReturn = () => {
  clearCurrents()
  router.push('/codir')
}

const loadData = async () =>{
  loading.value = true
  codir.value = await getCodir(id)
  await getMembres()
  await verifierPresence()
  loading.value = false
}
 
const tabs = ref([
  {
    label: 'Point Global',
    id: 'point',
  },
  {
    label: 'Navigation',
    id: 'navigation',
  },
  
])
const currentTab = ref('point');

const openCommentaireCreation = async (payload) => {
  commentableTarget.value = payload
  openCommentaireModal.value = true
}


const openCommentaireListe = async (payload) => {
  commentableTarget.value = payload
  console.log("Voir les commentaires pour", payload)
  await fetchCommentaires(payload.commentable_type, payload.commentable_id, codir.value?.id)
  openListeCommentairesModal.value = true
}

const handleRecupererCommentaire = async (contenu) => {
  loading.value = true
  if (!commentableTarget.value) return
  try {
    await creerCommentaire({
      commentable_id:   commentableTarget.value.commentable_id,
      commentable_type: commentableTarget.value.commentable_type,
      contenu,
      codir_id:         id,
    })
    await fetchCodir()
  } catch {}finally {
    loading.value = false
  }
}

const getCurrentEntiteUserId = () => {
  if (!process.client) return null

  const raw = localStorage.getItem('entite_user')
  if (!raw) return null

  try {
    const entiteUser = JSON.parse(raw)
    return entiteUser?.entite_user_id ?? entiteUser?.id ?? null
  } catch {
    return null
  }
}

const findCurrentMembre = () => {
  const entiteUserId = getCurrentEntiteUserId()
  if (!entiteUserId) return null

  return membres.value.find((membre) => {
    const membreEntiteUserId =
      membre?.entite_user_id ??
      membre?.entite_user?.id ??
      membre?.entiteUser?.id

    return Number(membreEntiteUserId) === Number(entiteUserId)
  }) ?? null
}

const {updatePresence, checkPresence} = usePresence()
const presenceMembre = ref({
  id: null,
  motivation_absence: null,
  codir_id: id,
  membre_id: null,
  has_validate: false,
  is_present: false
})
const canValidate = ref(false)

const verifierPresence = async () => {
  const currentMembre = findCurrentMembre()
  if (!currentMembre) {
    canValidate.value = false
    return
  }

  try {
    const response = await checkPresence(id, currentMembre.id)
    canValidate.value = response.canValidate
    presenceMembre.value = response.presence
    console.log("Vérification de la présence:", response)
  } catch (error) {
    console.error("Erreur lors de la vérification de la présence:", error)
    canValidate.value = false
  }
}


const normalizePresenceValidation = (presence) =>
  presence?.hasValidate ?? presence?.has_validate ?? false



const handleValider = async () => {
  const currentMembre = findCurrentMembre()

  if (!currentMembre) {
    toast.add({
      title: 'Validation impossible',
      description: "Votre profil n'est pas associé à la liste de présence de ce CODIR.",
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
    })
    return
  }

  loading.value = true

  try {

    const presences = ref({
      codir_id: id,
      membre_id: currentMembre.id,
      has_validate: true
    })
    
    presenceMembre.value = await updatePresence(presenceMembre.value.id, {
      has_validate: true
    })
    
    await fetchCodir()

    toast.add({
      title: 'CODIR validé',
      description: 'Votre validation a été enregistrée.',
      color: 'green',
      icon: 'i-heroicons-check-circle',
    })
  } catch (error) {
    console.error('Erreur lors de la validation du CODIR:', error)
    toast.add({
      title: 'Erreur',
      description: 'Impossible de valider le CODIR.',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
    })
  } finally {
    loading.value = false
  }
}

const handleOrdreCreated = async () => {
  await loadData()
}

const handleOrdreUpdated = async () => {
  await loadData()
}



// ── Init ──────────────────────────────────────────────────────────────────────
onMounted(async () => {
    loadData()
})

</script>

<template>
  <div class="mx-auto py-10 px-6">

    <!-- Retour -->
    <div class="mb-6 flex items-center gap-3">
      <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" @click="handleReturn()" />
      <span class="text-gray-400 text-sm">Retour</span>
    </div>

    <div v-if="loading && !codir" class="flex justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-blue-500" />
    </div>

    <template v-else-if="codir && peutGererCodir()">
      <CodirStepper :codirId="id">

        <!-- ── En-tête ─────────────────────────────────────────────────── -->
        <UCard class="rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 mb-6">
          <div class="p-2">
            <div class="flex items-start justify-between gap-4 mb-3">
              <div>
                <div class="flex items-center gap-3 flex-wrap mb-1">
                  <h1 class="text-2xl font-bold">{{ formatDateFR(codir.date) }}</h1>
                  <span
                    :class="`text-xs font-semibold px-3 py-1 rounded-full ${getStatutConfig(codir.statut).badgeClass}`">
                    {{ getStatutConfig(codir.statut).label }}
                  </span>
                </div>
                <p class="text-gray-400 text-sm flex items-center gap-1.5">
                  <UIcon name="i-heroicons-clock" />
                  {{ extractTime(codir.heure_debut) }} – {{ extractTime(codir.heure_fin) }}
                </p>
              </div>
              <UButton v-if="!editing && peutGererCodir()" icon="i-heroicons-pencil-square" color="blue" variant="ghost"
                size="sm" @click="editing = true">
                Modifier
              </UButton>
            </div>

            <div class="flex items-center gap-3 mt-4">
              <UProgress :value="progressionGlobale" color="green" size="sm" class="flex-1" />
              <span class="text-xs font-mono text-gray-400 w-16 text-right">{{ progressionGlobale }}% moy.</span>
            </div>

            <Transition name="slide">
              <div v-if="editing" class="border-t dark:border-gray-700 mt-5 pt-5">
                <div class="grid grid-cols-2 gap-4 mb-4">
                  <UFormGroup label="Date">
                    <UInput v-model="editForm.date" type="date" size="sm" />
                  </UFormGroup>
                  <UFormGroup label="Statut">
                    <USelect v-model="editForm.statut" :options="STATUT_OPTIONS" size="sm" />
                  </UFormGroup>
                  <UFormGroup label="Heure de début">
                    <UInput v-model="editForm.heure_debut" type="time" size="sm" />
                  </UFormGroup>
                  <UFormGroup label="Heure de fin">
                    <UInput v-model="editForm.heure_fin" type="time" size="sm" />
                  </UFormGroup>
                </div>
                <div class="flex justify-end gap-2">
                  <UButton color="gray" variant="ghost" size="sm" @click="editing = false">Annuler</UButton>
                  <UButton color="blue" size="sm" :loading="loading" @click="saveCodir">Enregistrer</UButton>
                </div>
              </div>
            </Transition>
          </div>
        </UCard>


        <!-- ── Contenu step 1 ──────────────────────────────────────────── -->
        <div class="flex flex-col gap-8">
          <OrdreDuJourListe :loading="loading" :ordres="codir.ordres_du_jour"  :peutSupprimer="peutGererCodir()"
            @attach="ordreModal = true" @detach="openDetachModal($event)" @ordre-created="handleOrdreCreated" @ordre-updated="handleOrdreUpdated"/>
        </div>
      </CodirStepper>

    </template>

    <template v-else-if="codir">
      <!-- <CodirOrdreDuJour :loading="loading" :ordres="codir.ordres_du_jour"  :peutSupprimer="false"/> -->
       <div>
          <AppTabs
            :tabs="tabs"
           v-model:current-tab="currentTab"
          >
            <template #navigation>
              <OrdreDuJourListe :loading="loading" :ordres="codir.ordres_du_jour"  :peutSupprimer="false"/>
            </template>
            <template #point>
                <CodirPointGlobal
                  :codirData="codir"
                  @commenter="openCommentaireCreation"
                  @lire-commentaires="openCommentaireListe"
                />
            </template>
          </AppTabs>
       </div>
      
      <div class="flex justify-end mt-8">
        <UButton
            :disabled="!canValidate || presenceMembre.has_validate"
            color="green"
            variant="soft"
            @click="handleValider"
            :loading="loading"
          >
            {{ presenceMembre.has_validate ? 'CODIR validé' : 'Valider le CODIR' }}
          </UButton>
      </div>
   
    </template>
    <!-- <UAlert v-if="error" color="red" icon="i-heroicons-exclamation-circle" :title="error" class="mt-4" /> -->

    <!-- ── Modale ordre du jour ─────────────────────────────────────── -->
    <OrdreDuJourFormModal
      v-model:open="ordreModal"
      :loading="isSavingOrdre"
      @createOrdre="addOrdreSubmit"
    />

    <ConfirmationSuppressionModal
      v-model:openConfirmationModal="detachModal"
      titre="Confirmer le détachement"
      message="Voulez-vous vraiment retirer cet ordre du jour du CODIR ?"
      :details="ordreToDetachLibelle ? `Ordre du jour : ${ordreToDetachLibelle}` : ''"
      confirmLabel="Retirer"
      cancelLabel="Annuler"
      :loading="loading"
      @confirm="confirmDetachOrdre"
      @cancel="cancelDetachOrdre"
    />

    <CommentaireFormModal
      v-model:open="openCommentaireModal"
      :loading="loading"
      @create="handleRecupererCommentaire($event.contenu)"
    />

    <CommentaireListeModal
      v-model:openListeCommentairesModal="openListeCommentairesModal"
      :commentaires="commentaires"
    />
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
