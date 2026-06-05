<script setup>
import { useAction } from "@/composables/actions/useAction";
import { useActivite } from "@/composables/activite/useActivite";
import { useAuth } from "~/composables/auth/useAuth";

definePageMeta({ title: "Détail action" });

const router      = useRouter();
const toast       = useToast();
const activiteApi = useActivite();
const actionApi   = useAction();
const route       = useRoute();
const actionId    = Number(route.params.actionId);

const clearCurrents = () => {
  if (!process.client) return
  try {
    localStorage.removeItem('currentAction')
  } catch (e) {}
}
const handleReturn = () => {
  clearCurrents()
  router.back()
}

// ── State ─────────────────────────────────────────────────────────────────────
const action             = ref(null);
const currentDossier     = ref(null);
const currentCodir       = ref(null);
const currentOrdreDuJour = ref(null);
const loading            = ref(true); // ✅ true dès le départ pour couvrir le montage

//on appelle la permission qui permet de voir les boutons d'éditions et de suppressions
const {peutGererCodir} = useAuth()

// ── Montage ───────────────────────────────────────────────────────────────────
onMounted(async () => {
  currentDossier.value     = JSON.parse(localStorage.getItem("currentDossier"));
  currentCodir.value       = JSON.parse(localStorage.getItem("currentCodir"));
  currentOrdreDuJour.value = JSON.parse(localStorage.getItem("currentOrdreDuJour"));

  // ✅ Charger l'action depuis l'API dès le montage
  await refreshAction();
});

// ── Données ───────────────────────────────────────────────────────────────────
const activites = computed(() => action.value?.activites ?? []);
const taches    = computed(() => action.value?.taches ?? []); // ✅ utilisé partout (plus d'actionsTaches)

// ── Refresh ───────────────────────────────────────────────────────────────────
const refreshAction = async () => {
  loading.value = true;
  try {
    // ✅ await + assignation du résultat à action.value
    action.value = await actionApi.getCurrentAction(actionId);
  } catch {
    toast.add({
      title: "Erreur",
      description: "Impossible de charger l'action",
      color: "red",
      icon: "i-heroicons-exclamation-circle",
    });
  } finally {
    loading.value = false; // ✅ toujours libéré, même en cas d'erreur
  }
};

// ── Modale tâche ──────────────────────────────────────────────────────────────
const tacheModal        = ref(false);
const currentActiviteId = ref(null);

const openTacheModal = (activite = null) => {
  currentActiviteId.value = activite?.id ?? null;
  tacheModal.value = true;
};

// ── Création d'activité ───────────────────────────────────────────────────────
const activiteModal     = ref(false);
const activiteForm      = reactive({ libelle: "", action_id: null, dossier_id: null });
const resetActiviteForm = () => Object.assign(activiteForm, { libelle: "", action_id: null, dossier_id: null });

const createActivite = async () => {
  activiteForm.action_id  = action.value.id;
  activiteForm.dossier_id = currentDossier.value?.id;

  if (!activiteForm.libelle.trim()) {
    toast.add({ title: "Champs requis manquants", color: "orange", icon: "i-heroicons-exclamation-triangle" });
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
    resetActiviteForm();
    await refreshAction();
  } catch {
    toast.add({ title: "Erreur", description: "Impossible de créer l'activité", color: "red", icon: "i-heroicons-exclamation-circle" });
  }
};
</script>

<template>
  <div class="mx-auto py-10 px-6">

    <!-- Retour -->
    <div class="mb-6 flex items-center gap-3">
      <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" @click="handleReturn()" />
      <span class="text-gray-400 text-sm">Retour au dossier</span>
    </div>

    <!-- Loader -->
    <div v-if="loading" class="flex justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-blue-500" />
    </div>

    <!-- Introuvable -->
    <div v-else-if="!action" class="text-center py-20">
      <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 mx-auto text-amber-400 mb-4" />
      <p class="text-gray-500 text-sm">Action introuvable.</p>
      <UButton class="mt-4" color="gray" variant="ghost" @click="handleReturn()">Retour</UButton>
    </div>

    <template v-else>

      <!-- ── En-tête ────────────────────────────────────────────────────── -->
      <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 mb-6">
        <div class="p-6 border-b border-gray-100 dark:border-gray-800">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center">
              <UIcon name="i-heroicons-bolt" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">{{ action.libelle }}</h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">Action #{{ action.id }}</p>
            </div>
          </div>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Dossier</p>
              <p class="font-medium text-gray-900 dark:text-white text-sm">
                {{ currentDossier?.libelle ?? "Non spécifié" }}
              </p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Activités</p>
              <p class="font-medium text-gray-900 dark:text-white text-sm">
                {{ activites.length }} activité(s)
              </p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Identifiant</p>
              <p class="font-medium text-gray-900 dark:text-white text-sm">#{{ action.id }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Activités ──────────────────────────────────────────────────── -->
      <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
        <div class="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-violet-100 dark:bg-violet-950/40 flex items-center justify-center">
              <UIcon name="i-heroicons-clipboard-document-list" class="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h2 class="font-semibold text-gray-900 dark:text-white">Activités</h2>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ activites.length }} activité(s) rattachée(s)</p>
            </div>
          </div>
          <UButton v-if="peutGererCodir()" icon="i-heroicons-plus" color="violet" variant="soft" size="sm" @click="activiteModal = true">
            Ajouter une activité
          </UButton>
        </div>

        <div class="p-6">
          <div v-if="!activites.length" class="text-center py-8 text-gray-400 text-sm bg-gray-50 dark:bg-slate-800/50 rounded-xl">
            Aucune activité rattachée à cette action
          </div>
          <div v-else class="flex flex-col gap-3">
            <ActiviteCard
              v-for="(activite, index) in activites"
              :key="activite.id"
              :activite="activite"
              :numero="index + 1"
              @updated="refreshAction"
              @add-tache="openTacheModal"
            />
          </div>
        </div>
      </div>

      <!-- ── Tâches ─────────────────────────────────────────────────────── -->
      <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 mt-6">
        <div class="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-cyan-100 dark:bg-cyan-950/40 flex items-center justify-center">
              <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <h2 class="font-semibold text-gray-900 dark:text-white">Tâches</h2>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ taches.length }} tâche(s) rattachée(s)</p>
            </div>
          </div>
          <UButton v-if="peutGererCodir()" icon="i-heroicons-plus" color="cyan" variant="soft" size="sm" @click="openTacheModal(null)">
            Ajouter une tâche
          </UButton>
        </div>

        <div class="p-6">
          <!-- ✅ taches au lieu de actionsTaches (variable inexistante) -->
          <div v-if="!taches.length" class="text-center py-8 text-gray-400 text-sm bg-gray-50 dark:bg-slate-800/50 rounded-xl">
            Aucune tâche rattachée à cette action
          </div>
          <div v-else class="flex flex-col gap-3">
            <TacheCard
              v-for="tache in taches"
              :key="tache.id"
              :tache="tache"
              :codir-id="currentCodir?.id"
              @updated="refreshAction"
            />
          </div>
        </div>
      </div>

    </template>

      <!-- ── Modale création activité ───────────────────────────────────────────── -->
  <!-- <UModal v-model="activiteModal">
    <UCard class="rounded-2xl">
      <template #header>
        <h3 class="font-semibold">Nouvelle activité</h3>
      </template>
      <div class="p-2 flex flex-col gap-4">
        <UFormGroup label="Libellé" required>
          <UInput v-model="activiteForm.libelle" placeholder="Ex: Réaliser l'audit" size="md" />
        </UFormGroup>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" variant="ghost" @click="activiteModal = false; resetActiviteForm()">Annuler</UButton>
          <UButton color="violet" :loading="activiteApi.loading.value" @click="createActivite">Créer</UButton>
        </div>
      </template>
    </UCard>
  </UModal> -->

  <ActiviteFormModal
    v-model="activiteModal"
    :action-id="action?.id"
    @created="refreshAction"
  />

  <!-- ── Modale création tâche — composant autonome ─────────────────────────── -->
  <TacheFormModal
    v-model="tacheModal"
    :activite-id="currentActiviteId"
    :action-id="action?.id"
    @created="refreshAction"
  />
  </div>
</template>