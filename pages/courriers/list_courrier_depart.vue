<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      
      <!-- Header avec bouton nouveau -->
      <div class="flex items-end mb-4">
        <UBadge color="blue" variant="soft" size="lg" class="ml-auto">
          <Icon name="i-heroicons-plus" class="h-4 w-4 mr-1" />
          <UButton
            to="/courriers/form_courrier_depart"
            variant="text"
            size="sm"
            class="p-0 m-0 text-blue-600"
          >
            Nouveau
          </UButton>
        </UBadge>
      </div>

      <!-- Barre d'outils -->
      <div class="bg-white border-b border-gray-200 mb-4">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <!-- Recherche et filtres -->
            <div class="flex items-center space-x-4">
              <div class="relative">
                <UInput
                  v-model="globalSearch"
                  placeholder="Recherche globale..."
                  icon="i-heroicons-magnifying-glass"
                  size="sm"
                  class="w-64"
                  @input="handleGlobalSearch"
                />
              </div>
              
              <UButton
                @click="toggleAdvancedFilters"
                variant="outline"
                size="sm"
                icon="i-heroicons-funnel"
                :color="showAdvancedFilters ? 'primary' : 'gray'"
              >
                Filtres avancés
                <UBadge
                  v-if="activeFiltersCount > 0"
                  color="red"
                  variant="solid"
                  size="xs"
                  class="ml-2"
                >
                  {{ activeFiltersCount }}
                </UBadge>
              </UButton>
            </div>

            <!-- Options d'affichage -->
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-2">
                <label class="text-sm text-gray-600">Lignes par page:</label>
                <USelect
                  v-model="itemsPerPage"
                  :options="[10, 25, 50, 100]"
                  class="w-16"
                  size="sm"
                  @update:model-value="updateItemsPerPage"
                />
              </div>
            </div>
          </div>

          <!-- Panneau de filtres avancés -->
          <div v-if="showAdvancedFilters" class="mt-4 p-4 bg-gray-50 rounded-lg">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Position</label>
                <UInput
                  v-model="filters.position"
                  placeholder="Filtrer par position..."
                  size="sm"
                  icon="i-heroicons-briefcase"
                  @input="handleFilter"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Bureau</label>
                <UInput
                  v-model="filters.office"
                  placeholder="Filtrer par bureau..."
                  size="sm"
                  icon="i-heroicons-building-office"
                  @input="handleFilter"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Tranche d'âge</label>
                <UInput
                  v-model="filters.ageRange"
                  placeholder="ex: 30-39, 50+"
                  size="sm"
                  icon="i-heroicons-calendar-days"
                  @input="handleFilter"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Salaire minimum</label>
                <UInput
                  v-model="filters.minSalary"
                  placeholder="ex: 100000"
                  size="sm"
                  icon="i-heroicons-currency-euro"
                  @input="handleFilter"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Conteneur principal -->
      <div class="max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div class="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          
          <!-- En-tête avec sélection -->
          <div class="border-b border-gray-200 px-6 py-3 bg-gray-50">
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-700">
                {{ selectedRows.length }} sélectionné(s)
              </span>
              <UButton
                v-if="selectedRows.length > 0"
                @click="deleteSelected"
                variant="outline"
                size="sm"
                icon="i-heroicons-arrow-path"
                class="bg-gradient-to-r from-emerald-700 to-blue-700"
                color="white"
              >
                Affecter
              </UButton>
            </div>
          </div>

          <!-- Table de données -->
          <div class="table-auto overflow-x-auto">
            <table class="w-full border-collapse">
              <thead class="bg-gray-50 border border-gray-400">
                <tr>
                  <!-- Colonnes dynamiques -->
                  <th
                    v-for="column in visibleColumns"
                    :key="column.key"
                    :class="[
                      'px-2 py-3 text-center border border-gray-400 bg-gray-100 min-w-[200px]'
                    ]"
                  >
                    <div class="space-y-1">
                      <div class="flex items-center justify-center gap-1">
                        <!-- Pas de filtre pour la colonne document -->
                        <template v-if="column.type === 'document'">
                          <span class="text-xs font-medium text-gray-700 uppercase tracking-wider">
                            {{ column.label }}
                          </span>
                        </template>
                        <template v-else>
                          <UInput
                            v-model="filters[column.key]"
                            :placeholder="column.label"
                            size="xs"
                            class="w-full"
                            @update:model-value="handleFilter"
                          >
                            <template #trailing>
                              <SortIcon
                                :column="column.key"
                                :sort-column="sortColumn"
                                :sort-direction="sortDirection"
                                @sort="sortBy"
                              />
                            </template>
                          </UInput>

                          <UButton
                            @click="openTextFilterMenu($event, column.key)"
                            variant="outline"
                            size="2xs"
                            icon="i-heroicons-funnel"
                            :color="multiSelectFilters[column.key]?.length > 0 ? 'primary' : 'gray'"
                          />
                        </template>
                      </div>
                    </div>
                  </th>

                  <!-- Colonne de sélection -->
                  <th class="px-2 py-3 text-center border border-gray-400 bg-gray-100">
                    <UCheckbox
                      v-model="selectAll"
                      :indeterminate="isIndeterminateSelection"
                      @change="toggleSelectAll"
                    />
                  </th>

                  <!-- Colonne d'actions -->
                  <th class="px-6 py-3 text-right border border-gray-400 bg-gray-100">
                    <span class="text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Actions
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody class="bg-white">
                <tr
                  v-for="(item, index) in paginatedData"
                  :key="item.id"
                  class="transition-colors"
                  :class="getRowClasses(item.id, index)"
                >
                  <!-- Cellules dynamiques -->
                  <td
                    v-for="column in visibleColumns"
                    :key="column.key"
                    :class="[
                      'px-2 py-3 border border-gray-300 text-xs text-gray-900',
                      getCellAlignment(column.key),
                      column.width || 'min-w-[100px]'
                    ]"
                  >
                    <!-- Cellule Document avec icône -->
                    <div v-if="column.type === 'document'" class="flex justify-center">
                      <button
                        v-if="item[column.key]"
                        @click="openDocument(item[column.key])"
                        class="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded hover:bg-blue-50"
                        title="Ouvrir le document"
                      >
                        <Icon name="i-heroicons-document-text" class="h-5 w-5" />
                      </button>
                      <span v-else class="text-gray-300" title="Aucun document">
                        <Icon name="i-heroicons-document-text" class="h-5 w-5" />
                      </span>
                    </div>
                    <!-- Cellule Source avec badge -->
                    <div v-else-if="column.key === 'source'" class="flex justify-left">
                      <UBadge color="blue" variant="soft" size="2xs">
                        {{ item[column.key] }}
                      </UBadge>
                    </div>
                    <!-- Autres cellules -->
                    <div v-else>
                      {{ item[column.key] }}
                    </div>
                  </td>

                  <!-- Cellule de sélection -->
                  <td class="px-2 py-3 border border-gray-300 text-center">
                    <UCheckbox
                      :model-value="selectedRows.includes(item.id)"
                      @change="toggleRowSelection(item.id)"
                    />
                  </td>

                  <!-- Cellule d'actions -->
                  <td class="px-6 py-4 border border-gray-300 text-right text-sm font-medium">
                    <div class="flex justify-end space-x-2">
                      <UButton
                        @click="editItem(item)"
                        variant="ghost"
                        size="xs"
                        icon="i-heroicons-pencil"
                        color="blue"
                      />
                      <UButton
                        @click="deleteItem(item)"
                        variant="ghost"
                        size="xs"
                        icon="i-heroicons-trash"
                        color="red"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- État vide -->
          <div v-if="paginatedData.length === 0" class="text-center py-12">
            <Icon name="i-heroicons-inbox" class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun résultat</h3>
            <p class="mt-1 text-sm text-gray-500">
              Essayez d'ajuster vos filtres ou votre recherche.
            </p>
          </div>

          <!-- Pagination -->
          <div class="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-700">
                Affichage de {{ startIndex + 1 }} à {{ endIndex }} sur
                {{ filteredData.length }} résultats
                <span v-if="filteredData.length !== archiveData.length" class="ml-2">
                  ({{ archiveData.length }} total)
                </span>
              </div>

              <Pagination
                v-model="currentPage"
                v-model:itemsPerPage="itemsPerPage"
                :total-items="filteredData.length"
                :total-items-without-filter="archiveData.length"
                :ui="{
                  wrapper: 'flex items-center gap-1',
                  rounded: '!rounded-full min-w-[32px] justify-center',
                  default: {
                    activeButton: { variant: 'solid' },
                  },
                }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Menu contextuel de filtrage -->
    <div
      v-if="textFilterMenu.show"
      class="fixed z-50 bg-white border border-gray-300 rounded-lg shadow-lg min-w-80 max-h-96"
      :style="{ left: textFilterMenu.x + 'px', top: textFilterMenu.y + 'px' }"
      @click.stop
    >
      <div class="p-4">
        <!-- En-tête -->
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-medium text-gray-900">
            Filtre - {{ getColumnLabel(textFilterMenu.column) }}
          </h3>
          <div class="flex items-center space-x-2">
            <UBadge
              v-if="getSelectedCount(textFilterMenu.column) > 0"
              color="blue"
              variant="solid"
              size="xs"
            >
              {{ getSelectedCount(textFilterMenu.column) }}
            </UBadge>
            <UButton
              @click="closeTextFilterMenu"
              variant="ghost"
              size="xs"
              icon="i-heroicons-x-mark"
            />
          </div>
        </div>

        <!-- Champ de recherche -->
        <UInput
          v-model="filterSearch"
          placeholder="Rechercher..."
          icon="i-heroicons-magnifying-glass"
          size="sm"
          class="mb-3"
        />

        <!-- Liste des options -->
        <div class="max-h-48 overflow-y-auto border border-gray-200 rounded">
          <!-- Option "Sélectionner tous" -->
          <div
            class="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer border-b"
            @click="toggleSelectAllOptions(textFilterMenu.column)"
          >
            <UCheckbox
              :model-value="isAllSelected(textFilterMenu.column)"
              :indeterminate="isIndeterminate(textFilterMenu.column)"
              size="sm"
              class="mr-3"
            />
            <span class="text-sm text-gray-700">(Sélectionner tous)</span>
          </div>

          <!-- Options individuelles -->
          <div
            v-for="option in getFilteredOptions(textFilterMenu.column)"
            :key="option.value"
            class="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
            @click="toggleOption(textFilterMenu.column, option.value)"
          >
            <UCheckbox
              :model-value="isSelected(textFilterMenu.column, option.value)"
              size="sm"
              class="mr-3"
            />
            <div class="flex items-center flex-1">
              <span class="text-sm text-gray-700">{{ option.label }}</span>
            </div>
          </div>
        </div>

        <!-- Pied de page -->
        <div class="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
          <span class="text-xs text-gray-500">
            {{ getSelectedCount(textFilterMenu.column) }} sélectionné(s)
          </span>
          <UButton
            v-if="getSelectedCount(textFilterMenu.column) > 0"
            @click="resetMultiSelectFilter(textFilterMenu.column)"
            variant="outline"
            size="xs"
            icon="i-heroicons-arrow-path"
          >
            Reset
          </UButton>
        </div>
      </div>
    </div>

    <!-- Overlay pour fermer le menu contextuel -->
    <div
      v-if="textFilterMenu.show"
      class="fixed inset-0 z-40"
      @click="closeTextFilterMenu"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import SortIcon from '~/components/SortIcon.vue';
import Pagination from '~/components/Pagination.vue';

// ============================================================================
// CONFIGURATION
// ============================================================================

const columns = [
  { key: "id", label: "N°", visible: true},
  { key: "source", label: "Source", visible: true},
  { key: "reference", label: "Référence", visible: true},
  { key: "structure", label: "Structure / Usager", visible: true},
  { key: "numeroEnregistrement", label: "N° d'enregistrement", visible: true},
  { key: "objet", label: "Objet", visible: true},
  { key: "date_enregistrement", label: "Date d'enregistrement", visible: true},
  { key: "date_courrier", label: "Date du Courrier", visible: true},
  { key: "url", label: "Document", visible: true, type: 'document' },
  { key: "type_depart", label: "Type de départ", visible: true},
  { key: "date_depart", label: "Date de départ", visible: true },
];

const visibleColumns = computed(() => columns.filter(col => col.visible));

// ============================================================================
// ÉTAT DU COMPOSANT
// ============================================================================

const authToken = ref("");
const archiveData = ref([]);
const loading = ref(false);
const error = ref(null);
const config = useRuntimeConfig();

// Recherche et filtres
const globalSearch = ref("");
const showAdvancedFilters = ref(false);
const filterSearch = ref("");

const filters = ref(
  columns.reduce((acc, col) => {
    acc[col.key] = '';
    return acc;
  }, {})
);

const multiSelectFilters = ref(
  columns.reduce((acc, col) => {
    acc[col.key] = [];
    return acc;
  }, {})
);

// Menu contextuel
const textFilterMenu = ref({
  show: false,
  column: null,
  x: 0,
  y: 0,
});

// Tri
const sortColumn = ref("source");
const sortDirection = ref("asc");

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Sélection
const selectedRows = ref([]);

// ============================================================================
// DONNÉES API
// ============================================================================

/**
 * Transforme les données de l'API au format attendu
 */

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR');
};


const transformerDonneesAPI = (reponseAPI) => {
  if (!reponseAPI?.data) {
    throw new Error('Format de réponse API invalide');
  }

   return reponseAPI.data.map(courrier => ({
    id: courrier.id,
    source: courrier.service_emis || '',
    numeroEnregistrement: courrier.document?.numero_enreg || '',
    reference: courrier.document?.reference || '',
    structure: courrier.destinataire || '',
    date_enregistrement: formatDate(courrier.document?.date_enreg),
    objet: courrier.document?.objet || '',
    date_courrier: formatDate(courrier.document?.date_courrier),
    url: courrier.document?.url 
      ? `${config.public.apiBase}${courrier.document.url}` 
      : '',
    type_depart: courrier.type_depart || '',
    date_depart: formatDate(courrier.date_depart),
  }));
};

/**
 * Charge les données depuis l'API
 */
const loadData = async () => {
  if (!authToken.value) {
    error.value = 'Token d\'authentification manquant';
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const reponse = await $fetch(`${config.public.apiBase}/courriers-departs`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken.value}`,
      },
    });

    archiveData.value = transformerDonneesAPI(reponse);
  } catch (err) {
    error.value = err.message || 'Erreur lors du chargement des données';
    console.error('Erreur de chargement:', err);
    alert('Impossible de charger les courriers');
  } finally {
    loading.value = false;
  }
};

// ============================================================================
// FILTRES
// ============================================================================

const activeFiltersCount = computed(() => {
  const simpleFilters = Object.values(filters.value).filter(v => v !== '').length;
  const multiFilters = Object.values(multiSelectFilters.value).filter(v => v.length > 0).length;
  return simpleFilters + multiFilters;
});

const getFilterOptions = (column) => {
  const options = [...new Set(archiveData.value.map(item => item[column]))];
  return options
    .map(value => ({
      value: value,
      label: String(value),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

const getFilteredOptions = (column) => {
  const allOptions = getFilterOptions(column);
  if (!filterSearch.value) return allOptions;

  const searchQuery = filterSearch.value.toLowerCase();
  return allOptions.filter(option =>
    option.label.toLowerCase().includes(searchQuery)
  );
};

const isSelected = (column, value) => {
  return multiSelectFilters.value[column]?.includes(value) || false;
};

const getSelectedCount = (column) => {
  return multiSelectFilters.value[column]?.length || 0;
};

const isAllSelected = (column) => {
  const allOptions = getFilterOptions(column);
  const selected = multiSelectFilters.value[column] || [];
  return allOptions.length > 0 && selected.length === allOptions.length;
};

const isIndeterminate = (column) => {
  const allOptions = getFilterOptions(column);
  const selected = multiSelectFilters.value[column] || [];
  return selected.length > 0 && selected.length < allOptions.length;
};

const toggleOption = (column, value) => {
  if (!multiSelectFilters.value[column]) {
    multiSelectFilters.value[column] = [];
  }

  const index = multiSelectFilters.value[column].indexOf(value);
  if (index > -1) {
    multiSelectFilters.value[column].splice(index, 1);
  } else {
    multiSelectFilters.value[column].push(value);
  }
};

const toggleSelectAllOptions = (column) => {
  const allOptions = getFilterOptions(column);
  const selected = multiSelectFilters.value[column] || [];

  if (selected.length === allOptions.length) {
    multiSelectFilters.value[column] = [];
  } else {
    multiSelectFilters.value[column] = allOptions.map(option => option.value);
  }
};

const resetMultiSelectFilter = (column) => {
  multiSelectFilters.value[column] = [];
};

const openTextFilterMenu = (event, column) => {
  event.stopPropagation();
  filterSearch.value = '';
  const rect = event.target.getBoundingClientRect();
  textFilterMenu.value = {
    show: true,
    column: column,
    x: rect.left,
    y: rect.bottom + 5,
  };
};

const closeTextFilterMenu = () => {
  filterSearch.value = '';
  textFilterMenu.value = {
    show: false,
    column: null,
    x: 0,
    y: 0,
  };
};

const getColumnLabel = (columnKey) => {
  const column = columns.find(col => col.key === columnKey);
  return column ? column.label : columnKey;
};

const toggleAdvancedFilters = () => {
  showAdvancedFilters.value = !showAdvancedFilters.value;
};

const handleGlobalSearch = () => {
  currentPage.value = 1;
};

const handleFilter = () => {
  currentPage.value = 1;
};

// ============================================================================
// TRI
// ============================================================================

const sortBy = (column) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn.value = column;
    sortDirection.value = 'asc';
  }
};

// ============================================================================
// SÉLECTION
// ============================================================================

const selectAll = computed({
  get: () =>
    selectedRows.value.length === paginatedData.value.length &&
    paginatedData.value.length > 0,
  set: (value) => {
    if (value) {
      selectedRows.value = paginatedData.value.map(item => item.id);
    } else {
      selectedRows.value = [];
    }
  },
});

const isIndeterminateSelection = computed(() => {
  return (
    selectedRows.value.length > 0 &&
    selectedRows.value.length < paginatedData.value.length
  );
});

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedRows.value = [];
  } else {
    selectedRows.value = paginatedData.value.map(item => item.id);
  }
};

const toggleRowSelection = (id) => {
  const index = selectedRows.value.indexOf(id);
  if (index > -1) {
    selectedRows.value.splice(index, 1);
  } else {
    selectedRows.value.push(id);
  }
};

// ============================================================================
// PAGINATION
// ============================================================================

const updateItemsPerPage = () => {
  currentPage.value = 1;
};

// ============================================================================
// DONNÉES CALCULÉES
// ============================================================================

const filteredData = computed(() => {
  let filtered = archiveData.value;

  // Recherche globale
  if (globalSearch.value) {
    const query = globalSearch.value.toLowerCase();
    filtered = filtered.filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(query)
      )
    );
  }

  // Filtres multi-sélection
  Object.keys(multiSelectFilters.value).forEach(column => {
    if (multiSelectFilters.value[column]?.length > 0) {
      filtered = filtered.filter(item =>
        multiSelectFilters.value[column].includes(item[column])
      );
    }
  });

  // Filtres texte
  Object.keys(filters.value).forEach(key => {
    if (filters.value[key]) {
      const query = filters.value[key].toLowerCase();
      filtered = filtered.filter(item =>
        String(item[key]).toLowerCase().includes(query)
      );
    }
  });

  return filtered;
});

const sortedData = computed(() => {
  const data = [...filteredData.value];
  return data.sort((a, b) => {
    let aVal = a[sortColumn.value];
    let bVal = b[sortColumn.value];

    if (typeof aVal === "string") {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    return sortDirection.value === "asc"
      ? (aVal > bVal ? 1 : -1)
      : (aVal < bVal ? 1 : -1);
  });
});

const totalPages = computed(() =>
  Math.ceil(sortedData.value.length / itemsPerPage.value)
);

const startIndex = computed(() =>
  (currentPage.value - 1) * itemsPerPage.value
);

const endIndex = computed(() =>
  Math.min(startIndex.value + itemsPerPage.value, sortedData.value.length)
);

const paginatedData = computed(() =>
  sortedData.value.slice(startIndex.value, endIndex.value)
);

// ============================================================================
// UTILITAIRES UI
// ============================================================================

const getRowClasses = (id, index) => {
  const isSelectedRow = selectedRows.value.includes(id);
  return {
    'bg-blue-50': isSelectedRow,
    'bg-gray-50': index % 2 === 0 && !isSelectedRow,
    'bg-white': index % 2 === 1 && !isSelectedRow,
    'hover:bg-blue-100': !isSelectedRow,
    'hover:bg-blue-200': isSelectedRow,
  };
};

const getCellAlignment = (columnKey) => {
  const leftAligned = ['reference', 'structure', 'numeroEnregistrement', 'objet'];
  return leftAligned.includes(columnKey) ? 'text-left' : 'text-center';
};

/**
 * Ouvre un document dans un nouvel onglet
 */
const openDocument = (url) => {
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};

// ============================================================================
// ACTIONS
// ============================================================================

const editItem = (item) => {
  console.log("Éditer l'élément:", item);
  // TODO: Implémenter la logique d'édition
};

const deleteItem = (item) => {
  console.log("Supprimer l'élément:", item);
  // TODO: Implémenter la logique de suppression
};

const deleteSelected = () => {
  console.log("Affecter les éléments sélectionnés:", selectedRows.value);
  // TODO: Implémenter la logique d'affectation
};

// ============================================================================
// WATCHERS
// ============================================================================

watch(filteredData, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = 1;
  }
});

// ============================================================================
// LIFECYCLE
// ============================================================================

onMounted(async () => {
  if (process.client) {
    authToken.value = localStorage.getItem("auth_token") || "";
  }
  await loadData();
});
</script>

<style scoped>
/* Styles personnalisés si nécessaire */
</style>