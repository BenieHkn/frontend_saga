<template>
  <div
    class="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200"
  >
    <!-- Information sur les résultats -->
    <div class="text-sm text-gray-700">
      Affichage de {{ startIndex + 1 }} à {{ endIndex }} sur
      {{ totalItems }} résultats
      <span v-if="totalItems !== totalItemsWithoutFilter" class="ml-2">
        ({{ totalItemsWithoutFilter }} total)
      </span>
    </div>

    <!-- Contrôles de pagination -->
    <div class="flex items-center space-x-2">
      
      <!-- Bouton précédent -->
        <UButton
          :disabled="currentPage === 1"
          @click="goToPreviousPage"
          variant="outline"
          size="sm"
          icon="i-heroicons-chevron-left"
          color="blue"
        >
          Précédent
        </UButton>

      <!-- Numéros de pages -->
      <div class="flex">
        <!-- Première page -->
        <UButton
          v-if="showFirstPage"
          @click="goToPage(1)"
          :variant="currentPage === 1 ? 'solid' : 'outline'"
          size="sm"
          :color="currentPage === 1 ? 'blue' : 'gray'"
        >
          <span class="text-white">1</span>
        </UButton>

        <!-- Points de suspension -->
        <span v-if="showStartDots" class="flex items-center px-2 text-gray-500">
          ...
        </span>

        <!-- Pages visibles -->
        <UButton
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          :variant="currentPage === page ? 'solid' : 'outline'"
          size="sm"
          :color="currentPage === page ? 'blue' : 'gray'"
          :ui="{ base: 'min-w-[2.5rem]' }"
        >
          {{ page }}
        </UButton>

        <!-- Points de suspension -->
        <span v-if="showEndDots" class="flex items-center px-2 text-gray-500">
          ...
        </span>

        <!-- Dernière page -->
        <UButton
          v-if="showLastPage"
          @click="goToPage(totalPages)"
          :variant="currentPage === totalPages ? 'solid' : 'outline'"
          size="sm"
          :color="currentPage === totalPages ? 'blue' : 'gray'"
          :ui="{ base: 'min-w-[2.5rem]' }"
        >
          {{ totalPages }}
        </UButton>
      </div>

      <!-- Bouton suivant -->
      <UButton
        :disabled="currentPage === totalPages"
        @click="goToNextPage"
        variant="outline"
        size="sm"
        icon="i-heroicons-chevron-right"
        trailing
        :ui="{ base: 'px-3' }"
        color="blue"
      >
        Suivant
      </UButton>

      <!-- Sélecteur d'items par page -->
      <div class="flex items-center space-x-2 ml-4">
        <label class="text-sm text-gray-600">Lignes par page:</label>
        <USelect
          :model-value="itemsPerPage"
          :options="itemsPerPageOptions"
          class="w-16"
          size="sm"
          @update:model-value="handleItemsPerPageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
// Props
// Props
const props = defineProps({
  modelValue: {
    type: Number,
    default: 1,
  },
  totalItems: {
    type: Number,
    required: true,
  },
  totalItemsWithoutFilter: {
    type: Number,
    default: 0,
  },
  itemsPerPage: {
    type: Number,
    default: 10,
  },
  maxVisiblePages: {
    type: Number,
    default: 5,
  },
});

// Emits
const emit = defineEmits(["update:modelValue", "update:itemsPerPage"]);

// Options pour le nombre d'items par page
const itemsPerPageOptions = [5, 10, 25, 50, 100];

// Computed properties
const currentPage = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const totalPages = computed(() =>
  Math.ceil(props.totalItems / props.itemsPerPage),
);

const startIndex = computed(() => (currentPage.value - 1) * props.itemsPerPage);

const endIndex = computed(() =>
  Math.min(startIndex.value + props.itemsPerPage, props.totalItems),
);

// Pages visibles avec logique des points de suspension
const visiblePages = computed(() => {
  const delta = Math.floor(props.maxVisiblePages / 2);
  const range = [];

  let start = Math.max(1, currentPage.value - delta);
  let end = Math.min(totalPages.value, currentPage.value + delta);

  // Ajuster pour toujours avoir le bon nombre de pages
  if (end - start + 1 < props.maxVisiblePages) {
    if (start === 1) {
      end = Math.min(totalPages.value, start + props.maxVisiblePages - 1);
    } else if (end === totalPages.value) {
      start = Math.max(1, end - props.maxVisiblePages + 1);
    }
  }

  for (let i = start; i <= end; i++) {
    range.push(i);
  }

  return range;
});

// Affichage conditionnel des éléments
const showFirstPage = computed(() => {
  return props.totalPages > 1 && !visiblePages.value.includes(1);
});

const showLastPage = computed(() => {
  return props.totalPages > 1 && !visiblePages.value.includes(props.totalPages);
});

const showStartDots = computed(() => {
  return showFirstPage.value && visiblePages.value[0] > 2;
});

const showEndDots = computed(() => {
  return (
    showLastPage.value &&
    visiblePages.value[visiblePages.value.length - 1] < props.totalPages - 1
  );
});

// Methods
const goToPage = (page) => {
  if (page !== currentPage.value && page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value = currentPage.value - 1;
  }
};

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value = currentPage.value + 1;
  }
};

const handleItemsPerPageChange = (newValue) => {
  emit("update:itemsPerPage", newValue);
  // Revenir à la première page quand on change le nombre d'items
  currentPage.value = 1;
};
</script>

<style scoped>
/* Animation pour les transitions */
.transition-all {
  transition: all 0.2s ease-in-out;
}

/* Style pour les boutons désactivés */
.u-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
