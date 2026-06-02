<template>
  <div class="space-y-4 w-full min-w-0">
    <PageHeader
      title="Ordres du jour"
      description="Consultez les ordres du jour associés à ce CODIR."
      icon="i-heroicons-document-text-20-solid"
    />
    
    <div class="w-full overflow-x-auto min-w-0 rounded-xl">
      <DataTable
          :data="ordresDuJour"
          :columns="columns"
          :selectable="false"
          :show-row-numbers="true"
          :show-column-filters="false"
          empty-state-title="Aucun ordre du jour"
          empty-state-text="Il n'y a pas d'ordres du jour disponibles pour ce CODIR."
        >
          <!-- Colonne Libellé -->
          <template #cell-libelle="{ item }">
            <div class="max-w-md truncate">
              <span class="font-semibold text-gray-900 dark:text-white">{{ item.libelle }}</span>
            </div>
          </template>

          <!-- Colonne Date Réunion -->
          <template #cell-date_reunion="{ item }">
            <div class="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
              <UIcon name="i-heroicons-calendar-days" />
              <span>{{ item.date_reunion ? new Date(item.date_reunion).toLocaleDateString('fr-FR') : 'Non définie' }}</span>
            </div>
          </template>

          <!-- Badge de statut -->
          <template #cell-statut="{ item }">
            <UBadge
              :color="getStatusColor(item.statut)"
              variant="soft"
              size="xs"
              class="font-medium"
            >
              {{ item.statut || 'Inconnu' }}
            </UBadge>
          </template>

          <!-- Actions personnalisées -->
          <template #actions="{ item }">
            <div class="flex items-center justify-end gap-1">
              <UTooltip text="Détails">
                <UButton
                  icon="i-heroicons-eye"
                  size="xs"
                  color="primary"
                  variant="ghost"
                  @click="openDetailsModal(item)"
                />
              </UTooltip>
              <UTooltip text="Télécharger">
                <UButton
                  icon="i-heroicons-document-arrow-down"
                  size="xs"
                  color="gray"
                  variant="ghost"
                  @click="downloadAgenda(item)"
                />
              </UTooltip>
            </div>
          </template>
        </DataTable>
    </div>

    <!-- Modal de visualisation des détails pour les membres (Lecture seule) -->
    <UModal v-model="openDetailModal" :prevent-close="openCommentaireModal">
      <UCard :ui="{ base: 'h-full flex flex-col', body: { base: 'flex-1 overflow-y-auto bg-gray-50/50 dark:bg-gray-950/50' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                {{ selectedODJ?.libelle }}
              </h3>
              <span class="text-xs text-gray-500 font-medium">Consultation des dossiers, actions et tâches rattachés</span>
            </div>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="openDetailModal = false" />
          </div>
        </template>

        <div v-if="selectedODJ" class="p-4 sm:p-8 space-y-10 max-w-6xl mx-auto">
          <div v-for="dossier in selectedODJ.dossiers" :key="dossier.id" class="space-y-6">
            
            <!-- Dossier -->
            <div class="flex items-center justify-between gap-4 pb-2 border-b-2 border-primary-500/20">
              <div class="flex-1">
                <DossierCard
                  :dossier="dossier"
                  :commentaires="commentairesDossier"
                  :peut-supprimer="false"
                  @click="showDossierDetail(dossier.id)"
                  @commenter="openComments('dossier', dossier.id, dossier.libelle)"
                  @lire-commentaires="ouvrirLectureCommentaires('dossier', dossier.id, dossier.libelle)"
                />
              </div>
            </div>

            <!-- Grille pour les Tâches Directes et Activités du Dossier -->
            <div v-if="getDirectTaches(dossier).length || getDirectActivites(dossier).length" class="grid grid-cols-1 md:grid-cols-2 gap-4 ml-4">
               <!-- Tâches directes -->
               <div v-if="getDirectTaches(dossier).length" class="space-y-3">
                 <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Tâches transversales</p>
                 <TacheCard
                   v-for="tache in getDirectTaches(dossier)"
                   :key="tache.id"
                   :tache="tache"
                   :pivot="getTaskPivot(tache)"
                   @commenter="openComments('tache', tache.id, tache.libelle)"
                   @lire-commentaires="ouvrirLectureCommentaires('tache', tache.id, tache.libelle)"
                 />
               </div>

               <!-- Activités directes -->
               <div v-if="getDirectActivites(dossier).length" class="space-y-3">
                 <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Activités du dossier</p>
                 <ActiviteCard
                   v-for="activite in getDirectActivites(dossier)"
                   :key="activite.id"
                   :activite="activite"
                   @commenter="openComments('Activite', activite.id, activite.libelle)"
                   @lire-commentaires="ouvrirLectureCommentaires('Activite', activite.id, activite.libelle)"
                 />
               </div>
            </div>

            <!-- Section Actions (Contenu principal) -->
            <div v-if="dossier.actions?.length" class="ml-4 space-y-4">
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Actions programmées</p>
              <ActionCard
                v-for="action in dossier.actions"
                :key="action.id"
                :action="action"
                :codir-id="props.codirId"
                :peutSupprimer="false"
                @commenter="openComments('Action', action.id, action.libelle)"
                @lire-commentaires="ouvrirLectureCommentaires('Action', action.id, action.libelle)"
                @commenter-tache="(t) => openComments('tache', t.id, t.libelle)"
                @lire-commentaires-tache="(t) => ouvrirLectureCommentaires('tache', t.id, t.libelle)"
                @commenter-activite="(a) => openComments('Activite', a.id, a.libelle)"
                @lire-commentaires-activite="(a) => ouvrirLectureCommentaires('Activite', a.id, a.libelle)"
              />
            </div>
          </div>
        </div>
      </UCard>
    </UModal>

    <UModal v-model="openCommentaireModal">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex flex-col gap-0.5">
              <div class="flex items-center gap-2">
                <UBadge color="primary" variant="soft" size="xs">{{ commentContext.type }}</UBadge>
                <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                  Commentaire
                </h3>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">{{ commentContext.title }}</p>
            </div>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="openCommentaireModal = false" />
          </div>
        </template>
        
        <UFormGroup label="Commentaire" name="commentaire">
          <UInput ref="commentaireInputRef" v-model="commentaire" placeholder="Saisissez votre commentaire ici..." />
        </UFormGroup>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton label="Fermer" color="gray" variant="ghost" @click="openCommentaireModal = false" />
            <UButton label="Enregistrer" color="primary" @click="handleCommenter" :loading="loading"/>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Modal de lecture des commentaires -->
    <UModal v-model="openLectureCommentairesModal" :prevent-close="openCommentaireModal">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex flex-col gap-0.5">
              <div class="flex items-center gap-2">
                <UBadge color="violet" variant="soft" size="xs">{{ commentContext.type }}</UBadge>
                <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Commentaires</h3>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">{{ commentContext.title }}</p>
            </div>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="openLectureCommentairesModal = false" />
          </div>
        </template>

        <div class="space-y-3 min-h-[100px]">
          <div v-if="lectureCommentairesLoading" class="flex justify-center py-6">
            <UIcon name="i-heroicons-arrow-path" class="animate-spin w-6 h-6 text-primary-500" />
          </div>
          <div v-else-if="!lectureCommentaires.length" class="text-center py-8 text-gray-400 text-sm">
            <UIcon name="i-heroicons-chat-bubble-left-ellipsis" class="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>Aucun commentaire pour le moment.</p>
          </div>
          <div
            v-else
            v-for="c in lectureCommentaires"
            :key="c.id"
            class="flex gap-3 p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-700"
          >
            <UAvatar :alt="c.entite_user?.user?.name" size="sm" class="shrink-0 mt-0.5" />
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-bold text-gray-700 dark:text-gray-200">{{ c.entite_user?.user?.name ?? 'Anonyme' }}</span>
                <span class="text-[10px] text-gray-400">{{ new Date(c.created_at).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }) }}</span>
              </div>
              <p class="text-sm text-gray-700 dark:text-gray-300 break-words">{{ c.contenu }}</p>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end">
            <UButton label="Fermer" color="gray" variant="ghost" @click="openLectureCommentairesModal = false" />
          </div>
        </template>
      </UCard>
    </UModal>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useOrdreDuJour } from '~/composables/ordres-du-jour/useOrdreDuJour'
import { useCommentaireService } from '~/service/commentaireService'

const toast = useToast()
const { createCommentaire, getCommentairesByGroupeId } = useCommentaireService()

const props = defineProps({
  codirId: {
    type: [String, Number],
    required: true
  }
})

const router = useRouter()

const commentairesDossier = ref([])

const config = useRuntimeConfig()

// Définition des colonnes du tableau
const columns = [
  { key: 'libelle', label: 'Libellé', sortable: true },
  { key: 'date_reunion', label: 'Réunion', sortable: true },
  { key: 'statut', label: 'Statut', sortable: true },
  { key: 'dossiers_count', label: 'Dossiers', sortable: true },
  { key: 'actions_count', label: 'Actions', sortable: true },
  { key: 'activites_count', label: 'Activités', sortable: true },
  { key: 'taches_count', label: 'Tâches', sortable: true },
  { key: 'actions', label: 'Actions', class: 'text-right' }
]

// États pour les commentaires
const commentContext = ref({
  type: '',
  id: null,
  title: ''
})

// États de l'interface
const loading = ref(false)
const ordresDuJour = ref([])
const openDetailModal = ref(false)
const selectedODJ = ref(null)

const openCommentaireModal = ref(false)
const commentaire = ref('')

const commentaireInputRef = ref(null)

const openComments = (type, id, title) => {
  commentContext.value = { type, id, title }
  openCommentaireModal.value = true
}

watch(openCommentaireModal, (val) => {
  if (val) {
    setTimeout(() => {
      commentaireInputRef.value?.input?.focus()
    }, 100)
  }
})

// -- Lecture des commentaires --
const openLectureCommentairesModal = ref(false)
const lectureCommentaires = ref([])
const lectureCommentairesLoading = ref(false)

const ouvrirLectureCommentaires = async (type, id, title) => {
  commentContext.value = { type, id, title }
  openLectureCommentairesModal.value = true
  lectureCommentaires.value = []
  lectureCommentairesLoading.value = true
  try {
    const res = await getCommentairesByGroupeId(type, id)
    lectureCommentaires.value = res?.data ?? res ?? []
  } catch (e) {
    console.error('Erreur chargement commentaires', e)
  } finally {
    lectureCommentairesLoading.value = false
  }
}

const handleCommenter = async () => {
  creerCommentaire()
  openCommentaireModal.value = false
  commentaire.value = ''
}

/**
 * Filtre les tâches pour ne garder que celles qui ne sont liées ni à une action ni à une activité.
 */
const getDirectTaches = (dossier) => dossier.taches?.filter(t => !t.action_id && !t.activite_id) || [];

/**
 * Filtre les activités pour ne garder que celles qui ne sont pas liées à une action.
 */
const getDirectActivites = (dossier) => dossier.activites?.filter(a => !a.action_id) || [];

/**
 * Calcule le nombre de dossiers pour un ordre du jour.
 */
const getDossiersCount = (ordreDuJour) => ordreDuJour.dossiers?.length ?? 0;

/**
 * Calcule le nombre total d'actions pour un ordre du jour,
 * en incluant les actions directement sous les dossiers.
 */
const getActionsCount = (ordreDuJour) => {
  let count = 0;
  ordreDuJour.dossiers?.forEach(dossier => {
    count += dossier.actions?.length ?? 0;
  });
  return count;
};

/**
 * Calcule le nombre total d'activités pour un ordre du jour.
 */
const getActivitesCount = (ordreDuJour) => {
  let count = 0;
  ordreDuJour.dossiers?.forEach(dossier => {
    count += dossier.activites?.length ?? 0;
    dossier.actions?.forEach(action => {
      count += action.activites?.length ?? 0;
    });
  });
  return count;
};

/**
 * Calcule le nombre total de tâches pour un ordre du jour,
 * en incluant les tâches sous les dossiers, actions et activités.
 */
const getTachesCount = (ordreDuJour) => {
  let count = 0;
  ordreDuJour.dossiers?.forEach(dossier => {
    count += dossier.taches?.length ?? 0; // Tâches directement sous le dossier
    dossier.actions?.forEach(action => {
      count += action.taches?.length ?? 0; // Tâches sous l'action
      action.activites?.forEach(activite => {
        count += activite.taches?.length ?? 0; // Tâches sous l'activité
      });
    });
  });
  return count;
};

/**
 * Récupère les données de pivot pour une tâche dans le contexte du CODIR actuel.
 */
const getTaskPivot = (tache) => {
  // On cherche le pivot correspondant au CODIR via props.codirId
  return tache.codirs?.find(c => c.id == props.codirId)?.pivot || null
}

/**
 * Récupération de la liste des ordres du jour via l'API
 */
const {getOrdreDuJourByCodir} = useOrdreDuJour()
const fetchOrdresDuJour = async () => {
  loading.value = true
  try {
    const response = await getOrdreDuJourByCodir(props.codirId)
    ordresDuJour.value = response.map(odj => ({
      ...odj,
      date_reunion: odj.codirs?.[0]?.date || null,
      dossiers_count: getDossiersCount(odj),
      actions_count: getActionsCount(odj),
      activites_count: getActivitesCount(odj),
      taches_count: getTachesCount(odj)
    }))
  } catch (error) {
    console.error('Erreur lors de la récupération des ordres du jour :', error)
  } finally {
    loading.value = false
  }
}

const creerCommentaire = async() =>{
  if(!process.client) return;
  loading.value = true
    try {
      
      const entiteUser = JSON.parse(localStorage.getItem("entite_user"))
      const response = await createCommentaire({
      contenu :commentaire.value,
      commentable_id: commentContext.value.id,
      commentable_type: commentContext.value.type,
      entite_user_id: entiteUser?.id,
      codir_id: props.codirId
    })
    if(response){
        toast.success("Commentaire créé avec succès")
        openCommentaireModal.value = false
        commentaire.value = ''
    }
  }catch(err){
      console.error("Erreur lors de la création du commentaire",err)
      toast.error("Erreur lors de la création du commentaire")
  } finally {
      loading.value = false
  }
}

/**
 * Attribution des couleurs selon le statut de l'ordre du jour
 */
const getStatusColor = (statut) => {
  const s = statut?.toLowerCase()
  if (s === 'validé' || s === 'clôturé') return 'green'
  if (s === 'en cours' || s === 'programmé') return 'blue'
  if (s === 'brouillon') return 'gray'
  return 'orange'
}

const openDetailsModal = (item) => {
  selectedODJ.value = item
  openDetailModal.value = true
}

const downloadAgenda = (row) => {
  console.log('Action : Téléchargement du document pour l\'ID', row.id)
}

const showDossierDetail = async (dossierId) => {
  console.log('Afficher les détails du dossier avec ID :', dossierId)

  router.push(`/dossiers/${dossierId}`)
}

onMounted(() => fetchOrdresDuJour())
</script>
