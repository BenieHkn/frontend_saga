<script setup>
import { useTache } from "@/composables/taches/useTaches";
import { useActivite } from "@/composables/activite/useActivite";
definePageMeta({ title: "Rattachement activités", ssr: false });

const router = useRouter();
const toast = useToast();
const tacheApi = useTache();
const activiteApi = useActivite();

const activites = ref([]);
const currentDossier = ref(null);
const tachesLibres = ref([]);
const loading = ref(true);
const saving = ref(false);

const tachesParActivite = ref({});

const tacheDeposeeMap = computed(() => {
  const map = {};
  for (const [activiteId, taches] of Object.entries(tachesParActivite.value)) {
    for (const t of taches) map[t.id] = Number(activiteId);
  }
  return map;
});

const tachesDisponibles = computed(() =>
  tachesLibres.value.filter((t) => !tacheDeposeeMap.value[t.id]),
);

onMounted(async () => {
  currentDossier.value = JSON.parse(localStorage.getItem("currentDossier"));
  activites.value = JSON.parse(localStorage.getItem("rattachement_activites")) ?? [];

  if (!activites.value.length) {
    toast.add({
      title: "Aucune activité disponible",
      color: "orange",
      icon: "i-heroicons-exclamation-triangle",
    });
    router.back();
    return;
  }

  activites.value.forEach((a) => {
    tachesParActivite.value[a.id] = [];
  });

  try {
    const toutes = await tacheApi.getUnlinkedTaches(currentDossier.value?.id);
    // Exclure les tâches déjà liées à une activité
    const dejaIds = new Set(
      activites.value.flatMap((a) => (a.taches ?? []).map((t) => t.id)),
    );
    tachesLibres.value = toutes.filter((t) => !dejaIds.has(t.id));
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});

// ── Drag & Drop natif ──────────────────────────────────────────────────────
const draggingTacheId = ref(null);
const survoleActiviteId = ref(null);

const onDragStart = (tache, event) => {
  draggingTacheId.value = tache.id;
  event.dataTransfer.setData("tacheId", String(tache.id));
  event.dataTransfer.effectAllowed = "move";
};

const onDragEnd = () => {
  draggingTacheId.value = null;
  survoleActiviteId.value = null;
};

const onDragEnter = (activiteId, event) => {
  event.preventDefault();
  survoleActiviteId.value = activiteId;
};

const onDragLeave = (activiteId, event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  const { clientX: x, clientY: y } = event;
  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
    if (survoleActiviteId.value === activiteId) survoleActiviteId.value = null;
  }
};

const onDragOver = (event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
};

const onDrop = (activiteId, event) => {
  event.preventDefault();
  const id = Number(event.dataTransfer.getData("tacheId"));
  survoleActiviteId.value = null;
  draggingTacheId.value = null;

  if (!id) return;
  if (tachesParActivite.value[activiteId]?.find((t) => t.id === id)) return;

  const ancienneActiviteId = tacheDeposeeMap.value[id];
  if (ancienneActiviteId && ancienneActiviteId !== activiteId) {
    tachesParActivite.value[ancienneActiviteId] = tachesParActivite.value[ancienneActiviteId].filter((t) => t.id !== id);
  }

  const tache = tachesLibres.value.find((t) => t.id === id);
  if (tache) {
    tachesParActivite.value[activiteId] = [...tachesParActivite.value[activiteId], tache];
  }
};

const retirerTache = (tache, activiteId) => {
  tachesParActivite.value[activiteId] = tachesParActivite.value[activiteId].filter((t) => t.id !== tache.id);
};

const totalARattacher = computed(() =>
  Object.values(tachesParActivite.value).reduce((sum, arr) => sum + arr.length, 0),
);

const sauvegarder = async () => {
  if (!totalARattacher.value) {
    toast.add({
      title: "Aucune tâche à rattacher",
      color: "orange",
      icon: "i-heroicons-exclamation-triangle",
    });
    return;
  }
  saving.value = true;
  try {
    const promises = [];
    for (const [activiteId, taches] of Object.entries(tachesParActivite.value)) {
      for (const tache of taches) {
        promises.push(activiteApi.attachTache(activiteId, { tache_id: tache.id }));
      }
    }
    await Promise.all(promises);
    toast.add({
      title: "Tâches rattachées",
      description: `${totalARattacher.value} tâche(s) rattachée(s) avec succès`,
      color: "green",
      icon: "i-heroicons-check-circle",
    });
    router.back();
  } catch {
    toast.add({
      title: "Erreur",
      description: "Impossible de rattacher les tâches",
      color: "red",
      icon: "i-heroicons-exclamation-circle",
    });
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <div class="mx-auto py-10 px-6">
    <div class="mb-6 flex items-center gap-3">
      <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" @click="router.back()" />
      <span class="text-gray-400 text-sm">Retour au dossier</span>
    </div>

    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Rattachement de tâches aux activités
      </h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Glissez des tâches vers les activités du dossier
        <span v-if="currentDossier" class="font-medium text-gray-700 dark:text-gray-300">
          "{{ currentDossier.libelle }}"
        </span>
      </p>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-blue-500" />
    </div>

    <template v-else>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <!-- ── Tâches disponibles ───────────────────────────────────── -->
        <div class="lg:sticky lg:top-6 lg:self-start">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <UIcon name="i-heroicons-queue-list" class="w-4 h-4 text-gray-500" />
            </div>
            <div>
              <h2 class="font-semibold text-gray-900 dark:text-white text-sm">Tâches disponibles</h2>
              <p class="text-xs text-gray-400">
                {{ tachesDisponibles.length }} tâche(s) restante(s) ·
                <span class="text-violet-500 font-medium">{{ totalARattacher }} sélectionnée(s)</span>
              </p>
            </div>
          </div>

          <div class="relative rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 min-h-[120px]">
            <Transition name="fade">
              <div
                v-if="tachesDisponibles.length === 0 && tachesLibres.length > 0"
                class="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400 text-sm bg-gray-50/95 dark:bg-slate-800/95 rounded-xl z-10 pointer-events-none"
              >
                <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-violet-400" />
                Toutes les tâches ont été rattachées
              </div>
            </Transition>

            <div v-if="!tachesLibres.length" class="flex items-center justify-center py-10 text-gray-400 text-sm">
              Aucune tâche disponible
            </div>

            <div class="flex flex-col gap-2 p-3 max-h-[60vh] overflow-y-auto">
              <TransitionGroup name="list">
                <RattachementTacheSourceItem
                  v-for="tache in tachesDisponibles"
                  :key="tache.id"
                  :tache="tache"
                  draggable="true"
                  @dragstart="onDragStart(tache, $event)"
                  @dragend="onDragEnd"
                />
              </TransitionGroup>
            </div>
          </div>
        </div>

        <!-- ── Activités (zones de dépôt) ──────────────────────────── -->
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
              <UIcon name="i-heroicons-rectangle-stack" class="w-4 h-4 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h2 class="font-semibold text-gray-900 dark:text-white text-sm">Activités du dossier</h2>
              <p class="text-xs text-gray-400">{{ activites.length }} activité(s)</p>
            </div>
          </div>

          <RattachementCibleDropZone
            v-for="activite in activites"
            :key="activite.id"
            :cible="activite"
            :taches="tachesParActivite[activite.id] ?? []"
            :survole="survoleActiviteId === activite.id"
            couleur="violet"
            @retirer="(tache) => retirerTache(tache, activite.id)"
            @dragenter="onDragEnter(activite.id, $event)"
            @dragleave="onDragLeave(activite.id, $event)"
            @dragover="onDragOver"
            @drop="onDrop(activite.id, $event)"
          >
            <template #dropzone>
              <div class="min-h-[100px]">
                <Transition name="fade" mode="out-in">
                  <div
                    v-if="!tachesParActivite[activite.id]?.length"
                    key="empty"
                    class="flex flex-col items-center justify-center h-[100px] gap-1 pointer-events-none transition-colors duration-150"
                    :class="survoleActiviteId === activite.id
                      ? 'text-violet-400 dark:text-violet-500'
                      : 'text-gray-300 dark:text-gray-600'"
                  >
                    <UIcon name="i-heroicons-arrow-down-tray" class="w-5 h-5" />
                    <p class="text-xs">Déposez des tâches ici</p>
                  </div>

                  <div v-else key="list" class="flex flex-col gap-2">
                    <div
                      v-for="tache in tachesParActivite[activite.id]"
                      :key="tache.id"
                      class="flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-3"
                    >
                      <div class="shrink-0 w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <UIcon name="i-heroicons-bars-3" class="w-3 h-3 text-gray-400" />
                      </div>
                      <p class="flex-1 text-sm font-medium text-gray-900 dark:text-white truncate">
                        {{ tache.intitule }}
                      </p>
                      <UButton
                        icon="i-heroicons-x-mark"
                        color="gray"
                        variant="ghost"
                        size="xs"
                        @click="retirerTache(tache, activite.id)"
                      />
                    </div>
                  </div>
                </Transition>
              </div>
            </template>
          </RattachementCibleDropZone>
        </div>
      </div>

      <div class="flex justify-end gap-3 mt-8">
        <UButton color="gray" variant="ghost" @click="router.back()">Annuler</UButton>
        <UButton
          color="violet"
          :loading="saving"
          :disabled="!totalARattacher"
          icon="i-heroicons-link"
          @click="sauvegarder"
        >
          Rattacher{{ totalARattacher ? ` (${totalARattacher})` : "" }}
        </UButton>
      </div>
    </template>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.list-enter-active, .list-leave-active { transition: all 0.2s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateX(-10px); }
.list-move { transition: transform 0.2s ease; }
</style>