<script setup>
import { formatDateFR } from "@/composables/codirs/useCodir";
import { useDossier } from "@/composables/dossier/useDossier";
import { useTache } from "@/composables/taches/useTaches";
import { useActivite } from "@/composables/activite/useActivite";
import { useMembre } from "@/composables/membres/useMembres";
import { useAction } from "@/composables/actions/useAction";

definePageMeta({ title: "Détail dossier" });

const router = useRouter();
const toast = useToast();
const route = useRoute();
const dossierApi = useDossier();
const tacheApi = useTache();
const activiteApi = useActivite();
const membreApi = useMembre();
const actionApi = useAction();

// ── State ─────────────────────────────────────────────────────────────────────
const dossier = ref(null);
const currentOrdreDuJour = ref(null);
const currentCodir = ref(null);
const membres = ref([]);
const loading = ref(true);

onMounted(async () => {
  dossier.value = JSON.parse(localStorage.getItem("currentDossier"));
  currentOrdreDuJour.value = JSON.parse(
    localStorage.getItem("currentOrdreDuJour"),
  );
  currentCodir.value = JSON.parse(localStorage.getItem("currentCodir"));

  // Toujours charger depuis l'API pour avoir les données fraîches
  
  membres.value = localStorage.getItem("membres") ? JSON.parse(localStorage.getItem("membres")) : [];
  loading.value = false;
});

// ── Tabs ──────────────────────────────────────────────────────────────────────
const tabs = [
  { id: "actions", label: "Actions" },
  { id: "activites", label: "Activités" },
  { id: "taches", label: "Tâches" },
];

const actions = computed(() => dossier.value?.actions ?? []);
const activites = computed(() => dossier.value?.activites ?? []);
const taches = computed(() => dossier.value?.taches ?? []);

// ── Options membres ───────────────────────────────────────────────────────────
const membreOptions = computed(() =>
  membres.value.map((m) => ({
    label:
      m.entite_user?.user?.nom + " " + m.entite_user?.user?.prenom ??
      `Membre #${m.id}`,
    value: m.id,
  })),
);

// ── Priorité ──────────────────────────────────────────────────────────────────
const PRIORITE_OPTIONS = [
  { label: "Haute", value: "Haute" },
  { label: "Moyenne", value: "Moyenne" },
  { label: "Basse", value: "Basse" },
];

// ── Ouverture modales depuis une action / activité ─────────────────────────────
const openTacheForAction = (action) => {
  tacheForm.action_id = action.id;
  tacheModal.value = true;
};

const openActiviteForAction = (action) => {
  activiteForm.action_id = action.id;
  activiteModal.value = true;
};

const openTacheForActivite = (activite) => {
  tacheForm.action_id = activite.action?.id ?? null;
  tacheForm.activite_id = activite.id;
  tacheModal.value = true;
};

// ── Options actions (pour le select dans la modale activité) ──────────────────
const actionOptions = computed(() =>
  actions.value.map((a) => ({
    label: a.libelle,
    value: a.id,
  })),
);

// ── Refresh ───────────────────────────────────────────────────────────────────
const refreshDossier = async () => {
  loading.value = true;
  dossier.value = await dossierApi.getDossier(dossier.value.id);
  localStorage.setItem("currentDossier", JSON.stringify(dossier.value));
  loading.value = false;
};

// ── Création d'action ─────────────────────────────────────────────────────────
const actionModal = ref(false);
const actionForm = reactive({ libelle: "" });
const resetActionForm = () => Object.assign(actionForm, { libelle: "" });

const createAction = async () => {
  if (!actionForm.libelle.trim()) {
    toast.add({
      title: "Champs requis manquants",
      color: "orange",
      icon: "i-heroicons-exclamation-triangle",
    });
    return;
  }
  try {
    await actionApi.createAction({
      libelle: actionForm.libelle.trim(),
      dossier_id: dossier.value.id,
    });
    actionModal.value = false;
    toast.add({
      title: "Action créée",
      description: `"${actionForm.libelle}" a été créée avec succès`,
      color: "green",
      icon: "i-heroicons-check-circle",
    });
    await refreshDossier();
    resetActionForm();
  } catch {
    toast.add({
      title: "Erreur",
      description: "Impossible de créer l'action",
      color: "red",
      icon: "i-heroicons-exclamation-circle",
    });
  }
};

// ── Création d'activité ───────────────────────────────────────────────────────
const activiteModal = ref(false);
const activiteForm = reactive({
  libelle: "",
  action_id: null,
  dossier_id: null,
});
const resetActiviteForm = () =>
  Object.assign(activiteForm, { libelle: "", action_id: null });

const createActivite = async () => {
  activiteForm.dossier_id = dossier.value.id;
  if (!activiteForm.libelle.trim()) {
    toast.add({
      title: "Champs requis manquants",
      color: "orange",
      icon: "i-heroicons-exclamation-triangle",
    });
    return;
  }
  try {
    await activiteApi.createActivite({ ...activiteForm });
    toast.add({
      title: "Activité créée",
      description: `"${activiteForm.libelle}" a été créée avec succès`,
      color: "green",
      icon: "i-heroicons-check-circle",
    });
    activiteModal.value = false;
    await refreshDossier();
    resetActiviteForm();
  } catch {
    toast.add({
      title: "Erreur",
      description: "Impossible de créer l'activité",
      color: "red",
      icon: "i-heroicons-exclamation-circle",
    });
  }
};

// ── Création de tâche ─────────────────────────────────────────────────────────
const tacheModal = ref(false);
const tacheForm = reactive({
  intitule: "",
  date_debut: "",
  date_fin: "",
  priorite: "Moyenne",
  action_id: null,
  activite_id: null,
  avancement: "",
  membre_ids: [],
});
const resetTacheForm = () =>
  Object.assign(tacheForm, {
    intitule: "",
    date_debut: "",
    date_fin: "",
    priorite: "Moyenne",
    action_id: null,
    activite_id: null,
    avancement: "",
    membre_ids: [],
  });

const createTache = async () => {
  if (
    !tacheForm.intitule.trim() ||
    !tacheForm.date_debut ||
    !tacheForm.date_fin
  ) {
    toast.add({
      title: "Champs requis manquants",
      color: "orange",
      icon: "i-heroicons-exclamation-triangle",
    });
    return;
  }
  try {
    await tacheApi.createTache({
      ...tacheForm,
      dossier_id: dossier.value.id,
      codir_id: currentCodir.value?.id,
    });
    await refreshDossier();
    toast.add({
      title: "Tâche créée",
      description: `"${tacheForm.intitule}" a été créée avec succès`,
      color: "green",
      icon: "i-heroicons-check-circle",
    });
    tacheModal.value = false;
    resetTacheForm();
  } catch {
    toast.add({
      title: "Erreur",
      description: "Impossible de créer la tâche",
      color: "red",
      icon: "i-heroicons-exclamation-circle",
    });
  }
};

const goToRattachement = () => {
  // On stocke le dossier et ses actions dans le localStorage
  localStorage.setItem("currentDossier", JSON.stringify(dossier.value));
  localStorage.setItem("rattachement_actions", JSON.stringify(actions.value));
  router.push("/actions/rattachement");
};

const goToRattachementActivite = () => {
  localStorage.setItem("currentDossier", JSON.stringify(dossier.value));
  localStorage.setItem(
    "rattachement_activites",
    JSON.stringify(activites.value),
  );
  router.push("/activites/rattachement");
};
</script>

<template>
  <div class="mx-auto py-10 px-6">
    <!-- Retour -->
    <div class="mb-6 flex items-center gap-3">
      <UButton
        icon="i-heroicons-arrow-left"
        color="gray"
        variant="ghost"
        @click="router.back()"
      />
      <span class="text-gray-400 text-sm">Retour à l'ordre du jour</span>
    </div>

    <!-- Loader -->
    <div v-if="loading" class="flex justify-center py-20">
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-8 h-8 animate-spin text-blue-500"
      />
    </div>

    <!-- Introuvable -->
    <div v-else-if="!dossier" class="text-center py-20">
      <UIcon
        name="i-heroicons-exclamation-triangle"
        class="w-12 h-12 mx-auto text-amber-400 mb-4"
      />
      <p class="text-gray-500 text-sm">Dossier introuvable.</p>
      <UButton class="mt-4" color="gray" variant="ghost" @click="router.back()"
        >Retour</UButton
      >
    </div>

    <template v-else>
      <!-- ── En-tête ────────────────────────────────────────────────────── -->
      <div
        class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 mb-6"
      >
        <div class="p-6 border-b border-gray-100 dark:border-gray-800">
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-950/40 flex items-center justify-center"
            >
              <UIcon
                name="i-heroicons-folder"
                class="w-6 h-6 text-violet-600 dark:text-violet-400"
              />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">
                {{ dossier.libelle }}
              </h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Dossier #{{ dossier.id }}
              </p>
            </div>
          </div>
        </div>

        <!-- ── Métadonnées ─────────────────────────────────────────────── -->
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Ordre du jour
              </p>
              <p class="font-medium text-gray-900 dark:text-white text-sm">
                {{ currentOrdreDuJour?.libelle ?? "Non spécifié" }}
              </p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">CODIR</p>
              <p class="font-medium text-gray-900 dark:text-white text-sm">
                {{
                  currentCodir?.date
                    ? formatDateFR(currentCodir.date)
                    : "Non spécifié"
                }}
              </p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Identifiant
              </p>
              <p class="font-medium text-gray-900 dark:text-white text-sm">
                #{{ dossier.id }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Tabs ───────────────────────────────────────────────────────── -->
      <AppTabs :tabs="tabs">
        <!-- Actions -->
        <!-- Actions -->
        <template #actions>
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ actions.length }} action(s)
            </span>
            <div class="flex items-center gap-2">
              <UButton
                icon="i-heroicons-link"
                color="gray"
                variant="soft"
                size="sm"
                @click="goToRattachement"
              >
                Rattacher des tâches
              </UButton>
              <UButton
                icon="i-heroicons-plus"
                color="blue"
                variant="soft"
                size="sm"
                @click="actionModal = true"
              >
                Ajouter une action
              </UButton>
            </div>
          </div>
          <div
            v-if="!actions.length"
            class="text-center py-8 text-gray-400 text-sm bg-gray-50 dark:bg-slate-800/50 rounded-xl"
          >
            Aucune action rattachée à ce dossier
          </div>
          <div v-else class="flex flex-col gap-3">
            <ActionCard
              v-for="(action, index) in actions"
              :key="action.id"
              :action="action"
              :numero="index + 1"
              @add-tache="openTacheForAction(action)"
              @add-activite="openActiviteForAction(action)"
              @deleted="refreshDossier"
            />
          </div>
        </template>

        <!-- Activités -->
        <template #activites>
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ activites.length }} activité(s)
            </span>
            <div class="flex items-center gap-2">
              <UButton
                icon="i-heroicons-link"
                color="gray"
                variant="soft"
                size="sm"
                @click="goToRattachementActivite"
              >
                Rattacher à une activité
              </UButton>
              <UButton
                icon="i-heroicons-plus"
                color="violet"
                variant="soft"
                size="sm"
                @click="activiteModal = true"
              >
                Ajouter une activité
              </UButton>
            </div>
          </div>
          <div
            v-if="!activites.length"
            class="text-center py-8 text-gray-400 text-sm bg-gray-50 dark:bg-slate-800/50 rounded-xl"
          >
            Aucune activité rattachée à ce dossier
          </div>
          <div v-else class="flex flex-col gap-3">
            <ActiviteCard
              v-for="(activite, index) in activites"
              :key="activite.id"
              :activite="activite"
              :numero="index + 1"
              @add-tache="openTacheForActivite(activite)"
              @updated="refreshDossier"
            />
          </div>
        </template>

        <!-- Tâches -->
        <template #taches>
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ taches.length }} tâche(s)
            </span>
            <UButton
              icon="i-heroicons-plus"
              color="blue"
              variant="soft"
              size="sm"
              @click="tacheModal = true"
            >
              Ajouter une tâche
            </UButton>
          </div>
          <div
            v-if="!taches.length"
            class="text-center py-8 text-gray-400 text-sm bg-gray-50 dark:bg-slate-800/50 rounded-xl"
          >
            Aucune tâche rattachée à ce dossier
          </div>
          <div v-else class="flex flex-col gap-3">
            <div
              v-for="(tache, index) in taches"
              :key="tache.id"
              class="flex items-start gap-3"
            >
              <div
                class="shrink-0 mt-3 w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center"
              >
                <span
                  class="text-xs font-bold text-blue-600 dark:text-blue-300"
                  >{{ index + 1 }}</span
                >
              </div>
              <div class="flex-1 min-w-0">
                <TacheCard
                  :tache="tache"
                  :codirId="currentCodir?.id"
                  @updated="refreshDossier"
                />
              </div>
            </div>
          </div>
        </template>
      </AppTabs>
    </template>
  </div>

  <!-- ── Modale création action ─────────────────────────────────────────────── -->
  <UModal v-model="actionModal">
    <UCard class="rounded-2xl max-h-[80vh] flex flex-col">
      <template #header>
        <h3 class="font-semibold">Nouvelle action</h3>
      </template>
      <div class="p-2 flex flex-col gap-4 overflow-y-auto">
        <UFormGroup label="Libellé" required>
          <UInput
            v-model="actionForm.libelle"
            placeholder="Ex: Formation du personnel"
            size="md"
          />
        </UFormGroup>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" variant="ghost" @click="actionModal = false"
            >Annuler</UButton
          >
          <UButton
            color="blue"
            :loading="actionApi.loading.value"
            @click="createAction"
            >Créer</UButton
          >
        </div>
      </template>
    </UCard>
  </UModal>

  <!-- ── Modale création activité ───────────────────────────────────────────── -->
  <UModal v-model="activiteModal">
    <UCard class="rounded-2xl max-h-[80vh] flex flex-col">
      <template #header>
        <h3 class="font-semibold">Nouvelle activité</h3>
      </template>
      <div class="p-2 flex flex-col gap-4 overflow-y-auto">
        <UFormGroup label="Libellé" required>
          <UInput
            v-model="activiteForm.libelle"
            placeholder="Ex: Réaliser l'audit"
            size="md"
          />
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
          <UButton color="gray" variant="ghost" @click="activiteModal = false"
            >Annuler</UButton
          >
          <UButton
            color="violet"
            :loading="activiteApi.loading.value"
            @click="createActivite"
            >Créer</UButton
          >
        </div>
      </template>
    </UCard>
  </UModal>

  <!-- ── Modale création tâche ──────────────────────────────────────────────── -->
  <UModal v-model="tacheModal">
    <UCard class="rounded-2xl max-h-[80vh] flex flex-col">
      <template #header>
        <h3 class="font-semibold">Nouvelle tâche</h3>
      </template>
      <div class="p-2 flex flex-col gap-4 overflow-y-auto">
        <UFormGroup label="Intitulé" required>
          <UInput
            v-model="tacheForm.intitule"
            placeholder="Ex: Préparer le rapport"
            size="md"
          />
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
          <USelect
            v-model="tacheForm.priorite"
            :options="PRIORITE_OPTIONS"
            size="md"
          />
        </UFormGroup>
        <AppSelectSearch
          v-model="tacheForm.membre_ids"
          :options="membreOptions"
          :multiple="true"
          :loading="membreApi.loading.value"
          placeholder="Rechercher des membres..."
        />
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" variant="ghost" @click="tacheModal = false"
            >Annuler</UButton
          >
          <UButton
            color="blue"
            :loading="tacheApi.loading.value"
            @click="createTache"
            >Créer</UButton
          >
        </div>
      </template>
    </UCard>
  </UModal>
</template>
