<script setup>
import { formatDateFR, useCodir, DOSSIER_STATUT_OPTIONS } from "@/composables/codirs/useCodir";
import { useDossier } from "@/composables/dossier/useDossier";
import { useTache } from "@/composables/taches/useTaches";
import { useActivite } from "@/composables/activite/useActivite";
import { useMembre } from "@/composables/membres/useMembres";
import { useAction } from "@/composables/actions/useAction";
import { useAuth } from "~/composables/auth/useAuth";
import { useCommentaire } from "@/composables/commentaire/useCommentaire";

definePageMeta({ title: "Détail dossier" });

// ── Router / Route ─────────────────────────────────────────────────────────────
const router = useRouter();
const route  = useRoute();
const toast  = useToast();

// ── Auth ───────────────────────────────────────────────────────────────────────
const { peutGererCodir, peutVoirCodir } = useAuth();

// ── Composables ────────────────────────────────────────────────────────────────
const dossierApi  = useDossier();
const tacheApi    = useTache();
const activiteApi = useActivite();
const membreApi   = useMembre();
const actionApi   = useAction();
const codirApi    = useCodir();

const {
  commentaires: commentairesList,
  creerCommentaire,
  modifierCommentaire,
  supprimerCommentaire,
  openCommentaireModal,
  openListeCommentairesModal,
  fetchCommentaires,
  loading: commentairesLoading,
} = useCommentaire();

// ── State global ───────────────────────────────────────────────────────────────
const dossierId          = route.params.dossierId;
const loading            = ref(false);
const dossier            = ref(null);
const currentOrdreDuJour = ref(null);
const currentCodir       = ref(null);
const entiteUser         = ref(null);
const membresForSelect   = ref([]);

// ── State onglets ──────────────────────────────────────────────────────────────
const tabs = [
  { id: "actions",      label: "Actions" },
  { id: "activites",    label: "Activités" },
  { id: "taches",       label: "Tâches" },
  { id: "commentaires", label: "Commentaires" },
];

// ── State dossier ──────────────────────────────────────────────────────────────
const dossierFormModalOpen = ref(false);

// ── State tâches ───────────────────────────────────────────────────────────────
const selectedTache      = ref(null);
const tacheFormModalOpen = ref(false);
const tacheDetailsModal  = ref(false);
const tacheDeleteModal   = ref(false);
const isDeletingTache    = ref(false);

// ── State actions ──────────────────────────────────────────────────────────────
const actionModal = ref(false);

// ── State activités ────────────────────────────────────────────────────────────
const activiteModal = ref(false);
const activiteForm  = reactive({ libelle: "", action_id: null, dossier_id: null });

// ── State commentaires ─────────────────────────────────────────────────────────
const commentaires           = commentairesList;
const commentableTarget      = ref({ id: null, type: 'dossier' });
const deleteCommentaireModal = ref(false);
const commentaireToDeleteId  = ref(null);
const isDeletingCommentaire  = ref(false);
const editCommentaireModal   = ref(false);
const editCommentaireForm    = reactive({ id: null, contenu: '' });

// ── Données dérivées ───────────────────────────────────────────────────────────
const actions   = computed(() => dossier.value?.actions   ?? []);
const activites = computed(() => dossier.value?.activites ?? []);
const taches    = computed(() => dossier.value?.taches    ?? []);

const dossierStatutLabel = computed(() => {
  if (!dossier.value?.statut) return "Non défini";
  const option = DOSSIER_STATUT_OPTIONS.find(o => o.value === dossier.value.statut);
  return option?.label ?? dossier.value.statut;
});

const dossierStatutColor = computed(() => {
  const map = {
    'en_cours':     'blue',
    'realisee':     'green',
    'non_realisee': 'red',
    'reconduit':    'yellow',
    'supprimee':    'gray',
  };
  return map[dossier.value?.statut] ?? 'gray';
});

const actionOptions = computed(() =>
  actions.value.map((a) => ({ label: a.libelle, value: a.id }))
);

const membresOptions = computed(() =>
  membresForSelect.value.map((m) => ({
    label: m.entite_user?.entite?.code ?? '',
    value: m.id,
  }))
);

// ── Fonctions navigation ───────────────────────────────────────────────────────
const clearCurrents = () => {
  if (!process.client) return;
  try { localStorage.removeItem('currentDossier') } catch {}
};

const handleReturn        = () => { clearCurrents(); router.back(); };
const handleReturnToCodir = () => { clearCurrents(); router.push('/codir'); };

const goToRattachement = () => {
  localStorage.setItem("currentDossier",       JSON.stringify(dossier.value));
  localStorage.setItem("rattachement_actions", JSON.stringify(actions.value));
  router.push("/actions/rattachement");
};

const goToRattachementActivite = () => {
  localStorage.setItem("currentDossier",         JSON.stringify(dossier.value));
  localStorage.setItem("rattachement_activites", JSON.stringify(activites.value));
  router.push("/activites/rattachement");
};

// ── Fonctions chargement ───────────────────────────────────────────────────────
const fetchMembres = async () => {
  membresForSelect.value = await membreApi.getMembres();
};

const refreshDossier = async () => {
  dossier.value = await dossierApi.getDossier(dossier.value.id);
  localStorage.setItem("currentDossier", JSON.stringify(dossier.value));
};

// ── Fonctions dossier ──────────────────────────────────────────────────────────
const openDossierEdit = () => {
  dossierFormModalOpen.value = true;
};

const handleDossierUpdated = async (form) => {
  try {
    await dossierApi.updateDossier(dossier.value.id, form);
    dossierFormModalOpen.value = false;
    await refreshDossier();
    toast.add({ title: "Dossier modifié", color: "green", icon: "i-heroicons-check-circle" });
  } catch {
    toast.add({ title: "Erreur", description: "Impossible de modifier le dossier", color: "red" });
  }
};

// ── Fonctions tâches ───────────────────────────────────────────────────────────
const openTacheDetails = (tache) => {
  selectedTache.value     = tache;
  tacheDetailsModal.value = true;
};

const openTacheCreate = () => {
  selectedTache.value      = null;
  tacheFormModalOpen.value = true;
};

const openTacheEdit = (tache) => {
  selectedTache.value      = tache;
  tacheFormModalOpen.value = true;
};

const openTacheDelete = (tache) => {
  selectedTache.value    = tache;
  tacheDeleteModal.value = true;
};

const openTacheForAction   = () => openTacheCreate();
const openTacheForActivite = () => openTacheCreate();

const handleTacheCreated = async (form) => {
  loading.value = true;
  try {
    await tacheApi.createTache({ ...form, dossier_id: dossier.value.id });
    await refreshDossier();
    toast.add({ title: "Tâche créée", color: "green", icon: "i-heroicons-check-circle" });
  } catch {
    toast.add({ title: "Erreur", description: "Impossible de créer la tâche", color: "red" });
  } finally {
    loading.value            = false;
    tacheFormModalOpen.value = false;
  }
};

const handleTacheUpdated = async (form) => {
  try {
    await tacheApi.updateTache(selectedTache.value.id, form);
    tacheFormModalOpen.value = false;
    await refreshDossier();
    toast.add({ title: "Tâche modifiée", color: "green", icon: "i-heroicons-check-circle" });
  } catch {
    toast.add({ title: "Erreur", description: "Impossible de modifier la tâche", color: "red" });
  }
};

const confirmDeleteTacheAction = async () => {
  if (!selectedTache.value || !currentCodir.value) return;
  isDeletingTache.value = true;
  try {
    await codirApi.detachTache(currentCodir.value.id, selectedTache.value.id, "dossier");
    tacheDeleteModal.value = false;
    selectedTache.value    = null;
    await refreshDossier();
    toast.add({ title: 'Tâche détachée', color: 'green', icon: 'i-heroicons-check-circle' });
  } catch {
    toast.add({ title: 'Erreur', description: 'Impossible de détacher la tâche', color: 'red' });
  } finally {
    isDeletingTache.value = false;
  }
};

// ── Fonctions actions ──────────────────────────────────────────────────────────
const createAction = async (form) => {
  loading.value = true;
  try {
    await actionApi.createAction({ ...form, dossier_id: dossier.value.id });
    await refreshDossier();
    toast.add({ title: "Action créée", description: `"${form.libelle}" a été créée avec succès`, color: "green", icon: "i-heroicons-check-circle" });
  } catch {
    toast.add({ title: "Erreur", description: "Impossible de créer l'action", color: "red", icon: "i-heroicons-exclamation-circle" });
  } finally {
    actionModal.value = false;
    loading.value     = false;
  }
};

// ── Fonctions activités ────────────────────────────────────────────────────────
const resetActiviteForm = () => Object.assign(activiteForm, { libelle: "", action_id: null });

const openActiviteForAction = (action) => {
  activiteForm.action_id = action.id;
  activiteModal.value    = true;
};

const createActivite = async () => {
  loading.value           = true;
  activiteForm.dossier_id = dossier.value.id;
  try {
    await activiteApi.createActivite({ ...activiteForm });
    activiteModal.value = false;
    await refreshDossier();
    resetActiviteForm();
    toast.add({ title: "Activité créée", description: `"${activiteForm.libelle}" a été créée avec succès`, color: "green", icon: "i-heroicons-check-circle" });
  } catch {
    toast.add({ title: "Erreur", description: "Impossible de créer l'activité", color: "red", icon: "i-heroicons-exclamation-circle" });
  } finally {
    loading.value = false;
  }
};

// ── Fonctions commentaires ─────────────────────────────────────────────────────
const openCommentaireCreation = (target = null, type = 'action') => {
  commentableTarget.value = target
    ? { id: target.id, type }
    : { id: dossier.value.id, type: 'dossier' };
  openCommentaireModal.value = true;
};

const openCommentaireListe = async (target = null, type = 'action') => {
  if (target) {
    commentableTarget.value = { id: target.id, type };
    await fetchCommentaires(type, target.id);
  } else {
    if (!dossier.value) return;
    commentableTarget.value = { id: dossier.value.id, type: 'dossier' };
    await fetchCommentaires('dossier', dossier.value.id);
  }
  openListeCommentairesModal.value = true;
};

const handleRecupererCommentaire = async (contenu) => {
  try {
    await creerCommentaire({
      commentable_id:   commentableTarget.value.id,
      commentable_type: commentableTarget.value.type,
      contenu,
    });
    await fetchCommentaires(commentableTarget.value.type, commentableTarget.value.id);
    await refreshDossier();
  } catch {}
};

const openEditCommentaire = (commentaire) => {
  editCommentaireForm.id      = commentaire.id;
  editCommentaireForm.contenu = commentaire.contenu;
  editCommentaireModal.value  = true;
};

const updateCommentaire = async () => {
  if (!editCommentaireForm.contenu.trim()) return;
  try {
    await modifierCommentaire(editCommentaireForm.id, { contenu: editCommentaireForm.contenu });
    editCommentaireModal.value = false;
    await fetchCommentaires('dossier', dossier.value.id);
  } catch {
    toast.add({ title: "Erreur", description: "Impossible de modifier le commentaire", color: "red" });
  }
};

const deleteCommentaire = (id) => {
  commentaireToDeleteId.value  = id;
  deleteCommentaireModal.value = true;
};

const confirmDeleteCommentaireAction = async () => {
  if (!commentaireToDeleteId.value) return;
  isDeletingCommentaire.value = true;
  try {
    await supprimerCommentaire(commentaireToDeleteId.value);
    deleteCommentaireModal.value = false;
    commentaireToDeleteId.value  = null;
    await fetchCommentaires('dossier', dossier.value.id);
  } catch {
    toast.add({ title: "Erreur", description: "Impossible de supprimer le commentaire", color: "red" });
  } finally {
    isDeletingCommentaire.value = false;
  }
};

// ── Lifecycle ──────────────────────────────────────────────────────────────────
onMounted(async () => {
  loading.value            = true;
  currentOrdreDuJour.value = JSON.parse(localStorage.getItem("currentOrdreDuJour"));
  currentCodir.value       = JSON.parse(localStorage.getItem("currentCodir"));
  fetchMembres();

  try {
    dossier.value = await dossierApi.getDossier(dossierId);
    localStorage.setItem("currentDossier", JSON.stringify(dossier.value));
  } catch {
    dossier.value = JSON.parse(localStorage.getItem("currentDossier"));
  } finally {
    loading.value = false;
  }

  if (process.client) {
    entiteUser.value = JSON.parse(localStorage.getItem("entite_user"));
    await fetchCommentaires('dossier', dossierId);
  }
});
</script>

<template>
  <div class="mx-auto py-10 px-6">
    <!-- Retour -->
    <div class="mb-6 flex items-center gap-3">
      <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" @click="handleReturn()" />
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
      <UButton class="mt-4" color="gray" variant="ghost" @click="handleReturn()">Retour</UButton>
    </div>

    <!-- Accès refusé -->
    <div v-else-if="!peutVoirCodir()" class="text-center py-20">
      <UIcon name="i-heroicons-lock-closed" class="w-12 h-12 mx-auto text-red-500 mb-4" />
      <p class="text-gray-500 text-sm">Vous n'avez pas les droits nécessaires pour consulter ce dossier.</p>
      <UButton class="mt-4" color="gray" variant="ghost" @click="handleReturnToCodir()">Retour aux CODIR</UButton>
    </div>

    <template v-else>
      <!-- En-tête -->
      <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 mb-6">
        <div class="p-6 border-b border-gray-100 dark:border-gray-800 flex items-start justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-950/40 flex items-center justify-center shrink-0">
              <UIcon name="i-heroicons-folder" class="w-6 h-6 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <div class="flex items-center gap-3">
                <h1 class="text-xl font-bold text-gray-900 dark:text-white">{{ dossier.libelle }}</h1>
                <UBadge :color="dossierStatutColor" variant="subtle" size="xs">{{ dossierStatutLabel }}</UBadge>
              </div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Dossier #{{ dossier.id }}</p>
            </div>
          </div>
          <UButton
            v-if="peutGererCodir()"
            icon="i-heroicons-pencil-square"
            color="gray"
            variant="ghost"
            title="Modifier le dossier"
            @click="openDossierEdit"
          />
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Ordre du jour</p>
              <p class="font-medium text-gray-900 dark:text-white text-sm">
                {{ currentOrdreDuJour?.libelle ?? "Non spécifié" }}
              </p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">CODIR</p>
              <p class="font-medium text-gray-900 dark:text-white text-sm">
                {{ currentCodir?.date ? formatDateFR(currentCodir.date) : "Non spécifié" }}
              </p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Identifiant</p>
              <p class="font-medium text-gray-900 dark:text-white text-sm">#{{ dossier.id }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <AppTabs :tabs="tabs" default-tab="taches">

        <!-- Actions -->
        <template #actions>
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ actions.length }} action(s)</span>
            <div v-if="peutGererCodir()" class="flex items-center gap-2">
              <UButton icon="i-heroicons-link" color="gray" variant="soft" size="sm" @click="goToRattachement">
                Rattacher des tâches
              </UButton>
              <UButton icon="i-heroicons-plus" color="blue" variant="soft" size="sm" @click="actionModal = true">
                Ajouter une action
              </UButton>
            </div>
          </div>
          <div v-if="!actions.length" class="text-center py-8 text-gray-400 text-sm bg-gray-50 dark:bg-slate-800/50 rounded-xl">
            Aucune action rattachée à ce dossier
          </div>
          <div v-else class="flex flex-col gap-3">
            <ActionCard
              v-for="(action, index) in actions" :key="action.id"
              :action="action" :numero="index + 1"
              :peutGererCodir="peutGererCodir()"
              @commenter="openCommentaireCreation(action)"
              @lire-commentaires="openCommentaireListe(action)"
              @add-tache="openTacheForAction"
              @add-activite="openActiviteForAction(action)"
              @deleted="refreshDossier"
            />
          </div>
        </template>

        <!-- Activités -->
        <template #activites>
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ activites.length }} activité(s)</span>
            <div v-if="peutGererCodir()" class="flex items-center gap-2">
              <UButton icon="i-heroicons-link" color="gray" variant="soft" size="sm" @click="goToRattachementActivite">
                Rattacher à une activité
              </UButton>
              <UButton icon="i-heroicons-plus" color="violet" variant="soft" size="sm" @click="activiteModal = true">
                Ajouter une activité
              </UButton>
            </div>
          </div>
          <div v-if="!activites.length" class="text-center py-8 text-gray-400 text-sm bg-gray-50 dark:bg-slate-800/50 rounded-xl">
            Aucune activité rattachée à ce dossier
          </div>
          <div v-else class="flex flex-col gap-3">
            <ActiviteCard
              v-for="(activite, index) in activites" :key="activite.id"
              :activite="activite" :numero="index + 1"
              :peut-gerer="peutGererCodir()"
              @add-tache="openTacheForActivite"
              @updated="refreshDossier"
              @commenter="openCommentaireCreation(activite, 'activite')"
              @lire-commentaires="openCommentaireListe(activite, 'activite')"
            />
          </div>
        </template>

        <!-- Tâches -->
        <template #taches>
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ taches.length }} tâche(s)</span>
            <UButton
              v-if="peutGererCodir()"
              icon="i-heroicons-plus" color="blue" variant="soft" size="sm"
              @click="openTacheCreate"
            >
              Ajouter une tâche
            </UButton>
          </div>
          <div v-if="!taches.length" class="text-center py-8 text-gray-400 text-sm bg-gray-50 dark:bg-slate-800/50 rounded-xl">
            Aucune tâche rattachée à ce dossier
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
                  :peutGerer="peutGererCodir()"
                  :peutVoir="peutVoirCodir()"
                  @details="openTacheDetails($event)"
                  @edit="openTacheEdit($event)"
                  @delete="openTacheDelete($event)"
                  @commenter="openCommentaireCreation(tache, 'tache')"
                  @lire-commentaires="openCommentaireListe(tache, 'tache')"
                />
              </div>
            </div>
          </div>
        </template>

        <!-- Commentaires -->
        <template #commentaires>
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ commentaires.length }} commentaire(s)</span>
            <div class="flex items-center gap-2">
              <UButton
                v-if="commentaires.length"
                icon="i-heroicons-chat-bubble-left-right" size="sm" color="gray" variant="soft"
                @click="openCommentaireListe()"
              >
                Voir la liste
              </UButton>
              <UButton icon="i-heroicons-plus" size="sm" color="blue" variant="soft" @click="openCommentaireCreation()">
                Ajouter un commentaire
              </UButton>
            </div>
          </div>
          <div v-if="!commentaires.length" class="text-center py-8 text-gray-400 text-sm bg-gray-50 dark:bg-slate-800/50 rounded-xl">
            Aucun commentaire pour ce dossier
          </div>
          <div v-else class="flex flex-col gap-3">
            <CommentaireCard
              v-for="commentaire in commentaires" :key="commentaire.id"
              :commentaire="commentaire" :entite-user="entiteUser"
              @edit="openEditCommentaire($event)"
              @delete="deleteCommentaire($event)"
            />
          </div>
        </template>

      </AppTabs>
    </template>

    
  <!-- Modale création action -->
  <ActionFormModal
    v-model:open="actionModal"
    :loadingCreateOrUpdate="loading"
    @create="createAction"
  />

  <!-- Modale création activité -->
  <!-- <UModal v-model="activiteModal">
    <UCard class="rounded-2xl max-h-[80vh] flex flex-col">
      <template #header>
        <h3 class="font-semibold">Nouvelle activité</h3>
      </template>
      <div class="p-2 flex flex-col gap-4 overflow-y-auto">
        <UFormGroup label="Libellé" required>
          <UTextarea v-model="activiteForm.libelle" placeholder="Ex: Réaliser l'audit" size="md" />
        </UFormGroup>
        <UFormGroup label="Action associée">
          <AppSelectSearch
            v-model="activiteForm.action_id"
            :options="actionOptions"
            :multiple="false"
            placeholder="Rechercher une action..."
          />
        </UFormGroup>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" variant="ghost" @click="activiteModal = false">Annuler</UButton>
          <UButton color="violet" variant="soft" :loading="activiteApi.loading.value" @click="createActivite">Créer</UButton>
        </div>
      </template>
    </UCard>
  </UModal> -->

  <ActiviteFormModal
    v-model:open="activiteModal"
    :loading-create-or-update="loading.value"
    @create="createActivite"
  />
  <!-- Modales commentaires -->
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

  <!-- Modale édition commentaire -->
  <UModal v-model="editCommentaireModal">
    <UCard class="rounded-2xl max-h-[80vh] flex flex-col">
      <template #header>
        <h3 class="font-semibold">Modifier le commentaire</h3>
      </template>
      <div class="p-2 flex flex-col gap-4 overflow-y-auto">
        <UFormGroup label="Contenu" required>
          <UTextarea v-model="editCommentaireForm.contenu" placeholder="Écrivez votre commentaire..." autoresize size="md" />
        </UFormGroup>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" variant="ghost" @click="editCommentaireModal = false">Annuler</UButton>
          <UButton color="blue" variant="soft" @click="updateCommentaire">Mettre à jour</UButton>
        </div>
      </template>
    </UCard>
  </UModal>

  <!-- Modale suppression commentaire -->
  <ConfirmationSuppressionModal
    v-model:openConfirmationModal="deleteCommentaireModal"
    titre="Confirmer la suppression"
    message="Voulez-vous vraiment supprimer ce commentaire ? Cette action est irréversible."
    :loading="isDeletingCommentaire"
    @confirm="confirmDeleteCommentaireAction"
    @cancel="deleteCommentaireModal = false"
  />

  <!-- ── Modales Tâches ─────────────────────────────────────────────────────── -->

  <!-- ✅ v-if sur selectedTache seulement pour les modales qui en ont besoin -->
  <TacheDetailModal
    v-if="selectedTache"
    v-model:openDetailTacheModal="tacheDetailsModal"
    :tache="selectedTache"
    :codirId="currentCodir?.id"
    @commenter="openCommentaireCreation"
    @lire-commentaires="openCommentaireListe"
    @delete="openTacheDelete($event)"
  />

  <!-- ✅ Pas de v-if : doit exister en DOM même en mode création (selectedTache = null) -->
  <TacheFormModal
    v-model:open="tacheFormModalOpen"
    :tache="selectedTache"
    :codirId="currentCodir?.id"
    :membres-options="membresOptions"
    @created="handleTacheCreated"
    @updated="handleTacheUpdated"
    :loading-create-or-update="loading"
  />

  <ConfirmationSuppressionModal
    v-if="selectedTache"
    v-model:openConfirmationModal="tacheDeleteModal"
    titre="Détacher la tâche"
    message="La tâche ne sera plus liée à ce CODIR."
    :details="`Êtes-vous sûr de vouloir détacher la tâche &quot;${selectedTache.intitule}&quot; ?`"
    confirmLabel="Supprimer"
    :loading="isDeletingTache"
    @confirm="confirmDeleteTacheAction"
    @cancel="tacheDeleteModal = false"
  />

  <!-- Modale d'édition du dossier -->
  <DossierFormModal
    v-model:open="dossierFormModalOpen"
    :dossier="dossier"
    :ordreId="currentOrdreDuJour?.id"
    @updated="handleDossierUpdated"
  />
  </div>
</template>