<!-- components/OrdreDuJourList.vue -->
<script setup>
import Sortable from "sortablejs";

const props = defineProps({
  ordres: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(["attach", "detach"]);

// ── Ordre local (géré en interne) ─────────────────────────────────────────────
const STORAGE_KEY = computed(() => `ordres-positions-${props.ordres[0]?.codir_id ?? "default"}`);

const ordresLocaux = ref([]);

// Initialise depuis localStorage ou depuis les props
const initOrdres = () => {
  const saved = localStorage.getItem(STORAGE_KEY.value);
  if (saved) {
    const savedIds = JSON.parse(saved);
    const map = Object.fromEntries(props.ordres.map((o) => [o.id, o]));
    // Réordonne selon l'ordre sauvegardé, ajoute les nouveaux à la fin
    const reordered = savedIds.map((id) => map[id]).filter(Boolean);
    const newOnes = props.ordres.filter((o) => !savedIds.includes(o.id));
    ordresLocaux.value = [...reordered, ...newOnes];
  } else {
    ordresLocaux.value = [...props.ordres];
  }
};

watch(() => props.ordres, initOrdres, { immediate: true });

const saveOrder = () => {
  localStorage.setItem(
    STORAGE_KEY.value,
    JSON.stringify(ordresLocaux.value.map((o) => o.id))
  );
};

// ── Drag & drop ───────────────────────────────────────────────────────────────
const listRef = ref(null);

onMounted(() => {
  if (!listRef.value) return;
  Sortable.create(listRef.value, {
    animation: 150,
    handle: ".drag-handle",
    ghostClass: "sortable-ghost",
    chosenClass: "sortable-chosen",
    onEnd({ oldIndex, newIndex }) {
      const items = [...ordresLocaux.value];
      const [moved] = items.splice(oldIndex, 1);
      items.splice(newIndex, 0, moved);
      ordresLocaux.value = items;
      saveOrder();
    },
  });
});

// ── Navigation ────────────────────────────────────────────────────────────────
const goTo = (ordre) => {
  if (process.client) {
    localStorage.setItem("currentOrdreDuJour", JSON.stringify(ordre));
  }
  navigateTo(`/ordres_du_jour/${ordre.id}`);
};

// ── Statut ────────────────────────────────────────────────────────────────────
const statutClass = (statut) => {
  const map = {
    actif: "text-green-600 bg-green-50 dark:bg-green-950/40",
    inactif: "text-gray-500 bg-gray-100 dark:bg-gray-800/60",
    archivé: "text-amber-600 bg-amber-50 dark:bg-amber-950/40",
  };
  return map[statut] ?? "text-gray-500 bg-gray-100";
};
</script>

<template>
  <section>
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-base font-semibold flex items-center gap-2">
        <UIcon name="i-heroicons-clipboard-document-list" class="text-blue-500" />
        Ordres du jour
        <UBadge color="blue" variant="soft" size="xs">{{ ordresLocaux.length }}</UBadge>
      </h2>
      <UButton icon="i-heroicons-plus" color="blue" variant="soft" size="xs" @click="emit('attach')">
        Ajouter
      </UButton>
    </div>

    <div
      v-if="!ordresLocaux.length"
      class="text-center py-6 text-gray-400 text-sm bg-gray-50 dark:bg-slate-800/50 rounded-xl"
    >
      Aucun ordre du jour
    </div>

    <!-- Liste sortable -->
    <div v-else ref="listRef" class="flex flex-col gap-2">
      <div
        v-for="(ordre, index) in ordresLocaux"
        :key="ordre.id"
        class="group flex items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-3 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900 transition-all cursor-pointer"
        @click="goTo(ordre)"
      >
        <div class="flex items-center gap-3 min-w-0">
          <!-- Handle drag -->
          <div
            class="drag-handle shrink-0 cursor-grab active:cursor-grabbing text-gray-300 hover:text-blue-400 transition-colors"
            @click.stop
          >
            <UIcon name="i-heroicons-bars-3" class="w-4 h-4" />
          </div>

          <!-- Numéro -->
          <div class="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
            <span class="text-xs font-bold text-blue-600 dark:text-blue-300">{{ index + 1 }}</span>
          </div>

          <!-- Libellé + statut -->
          <div class="min-w-0">
            <p class="text-sm font-medium truncate">{{ ordre.libelle }}</p>
            <span :class="`text-[10px] font-semibold capitalize ${statutClass(ordre.statut)}`">
              {{ ordre.statut }}
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <UIcon
            name="i-heroicons-chevron-right"
            class="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors"
          />
          <UButton
            icon="i-heroicons-trash"
            color="red"
            variant="ghost"
            size="xs"
            @click.stop="emit('detach', ordre.id)"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sortable-ghost {
  @apply opacity-40 bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700;
}
.sortable-chosen {
  @apply shadow-lg;
}
</style>