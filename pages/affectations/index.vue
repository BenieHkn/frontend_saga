<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      
      <!-- Header avec bouton nouveau -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Documents</h1>
          <p class="text-gray-600 mt-1">
            Gestion des affectations et suivi des traitements
          </p>
        </div>
        <!-- <UBadge color="purple" variant="soft" size="lg">
          <Icon name="i-heroicons-plus" class="h-4 w-4 mr-1" />
          <UButton
            to="/affectations/create"
            variant="text"
            size="sm"
            class="p-0 m-0 text-purple-600"
          >
            Nouvelle Affectation
          </UButton>
        </UBadge> -->
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
                <label class="block text-xs font-medium text-gray-700 mb-1">Date d'affectation</label>
                <UInput
                  v-model="filters.date_affect"
                  type="date"
                  size="sm"
                  @input="handleFilter"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Date de retour attendue</label>
                <UInput
                  v-model="filters.delai_traitement"
                  type="date"
                  size="sm"
                  @input="handleFilter"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Date de clôture</label>
                <UInput
                  v-model="filters.date_cloture"
                  type="date"
                  size="sm"
                  @input="handleFilter"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Émetteur</label>
                <UInput
                  v-model="filters.emetteur"
                  placeholder="Filtrer par émetteur..."
                  size="sm"
                  icon="i-heroicons-user"
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
                icon="i-heroicons-trash"
                color="red"
              >
                Supprimer la sélection
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
                      'px-2 py-3 text-center border border-gray-400 bg-gray-100',
                      column.width || 'min-w-[150px]'
                    ]"
                  >
                    <div class="space-y-1">
                      <div class="flex items-center justify-center gap-1">
                        <!-- Pas de filtre pour les colonnes badge et document -->
                        <template v-if="column.type === 'badge' || column.type === 'document'">
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
                  <th class="px-2 py-3 text-center border border-gray-400 bg-gray-100 w-16">
                    <UCheckbox
                      v-model="selectAll"
                      :indeterminate="isIndeterminateSelection"
                      @change="toggleSelectAll"
                    />
                  </th>

                  <!-- Colonne d'actions -->
                  <th class="px-6 py-3 text-right border border-gray-400 bg-gray-100 w-32">
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
                      column.width || 'min-w-[150px]'
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
                    
                    <!-- Cellule Badge Statut -->
                    <div v-else-if="column.key === 'statut'" class="flex justify-center">
                      <UBadge
                        :color="getStatutColor(item[column.key]).color"
                        variant="soft"
                        size="xs"
                      >
                        {{ item[column.key] }}
                      </UBadge>
                    </div>
                    
                    <!-- Cellule Badge Priorité -->
                    <div v-else-if="column.key === 'priority'" class="flex justify-center">
                      <UBadge
                        :color="getPriorityColor(item[column.key]).color"
                        variant="soft"
                        size="xs"
                      >
                        <span class="flex items-center gap-1">
                          <span
                            class="w-2 h-2 rounded-full"
                            :class="getPriorityColor(item[column.key]).dot"
                          ></span>
                          {{ item[column.key] }}
                        </span>
                      </UBadge>
                    </div>
                    
                    <!-- Cellule Référence courrier -->
                    <div v-else-if="column.key === 'reference_courrier'" class="flex justify-left">
                      <UBadge color="blue" variant="soft" size="xs">
                        {{ item[column.key] }}
                      </UBadge>
                    </div>
                    
                    <!-- Cellule Instructions (tronquée) -->
                    <div v-else-if="column.key === 'instructions'" class="text-left">
                      <span
                        class="line-clamp-2 text-xs text-gray-700"
                        :title="item[column.key]"
                      >
                        {{ item[column.key] }}
                      </span>
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
                        @click="viewDetails(item)"
                        variant="ghost"
                        size="xs"
                        icon="i-heroicons-eye"
                        color="blue"
                        title="Voir les détails"
                      />
                      <UButton
                        @click="editItem(item)"
                        variant="ghost"
                        size="xs"
                        icon="i-heroicons-pencil"
                        color="yellow"
                        title="Modifier l'affectation"
                      />
                      <UButton
                        @click="deleteItem(item)"
                        variant="ghost"
                        size="xs"
                        icon="i-heroicons-trash"
                        color="red"
                        title="Supprimer l'affectation"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- État vide -->
          <div v-if="paginatedData.length === 0" class="text-center py-12">
            <Icon name="i-heroicons-clipboard-document-list" class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune affectation</h3>
            <p class="mt-1 text-sm text-gray-500">
              Commencez par créer une nouvelle affectation de courrier.
            </p>
            <div class="mt-6">
              <UButton
                to="/affectations/create"
                icon="i-heroicons-plus"
                class="bg-gradient-to-br from-purple-800 to-indigo-800 text-white"
              >
                Créer une affectation
              </UButton>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="paginatedData.length > 0" class="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-700">
                Affichage de {{ startIndex + 1 }} à {{ endIndex }} sur
                {{ filteredData.length }} résultats
                <span v-if="filteredData.length !== affectationData.length" class="ml-2">
                  ({{ affectationData.length }} total)
                </span>
              </div>

              <Pagination
                v-model="currentPage"
                v-model:itemsPerPage="itemsPerPage"
                :total-items="filteredData.length"
                :total-items-without-filter="affectationData.length"
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
import Swal from 'sweetalert2';

useHead({
  title: "Liste des Affectations - Sagar Revolution",
});

// ============================================================================
// CONFIGURATION
// ============================================================================

const columns = [
  { key: "id", label: "N°", visible: true, width: "w-16" },
  { key: "reference_courrier", label: "Réf. Courrier", visible: true, width: "min-w-[150px]" },
  { key: "objet_courrier", label: "Objet", visible: true, width: "min-w-[250px]" },
  { key: "doc_courrier", label: "Document", visible: true, type: 'document', width: "w-24" },
  { key: "date_affect", label: "Date d'affectation", visible: true, width: "min-w-[120px]" },
  { key: "instructions", label: "Instructions", visible: true, width: "min-w-[200px]" },
  { key: "statut", label: "Statut", visible: true, type: 'badge', width: "min-w-[120px]" },
  { key: "priority", label: "Priorité", visible: true, type: 'badge', width: "min-w-[120px]" },
  { key: "delai_traitement", label: "Date de retour attendue", visible: true, width: "min-w-[120px]" },
  { key: "date_cloture", label: "Date clôture", visible: false, width: "min-w-[120px]" },
  { key: "emetteur", label: "Émetteur", visible: true, width: "min-w-[150px]" },
  { key: "destinataire", label: "Destinataire", visible: true, width: "min-w-[150px]" },
];

const visibleColumns = computed(() => columns.filter(col => col.visible));

// ============================================================================
// ÉTAT DU COMPOSANT
// ============================================================================

const authToken = ref("");
const affectationData = ref([]);
const loading = ref(false);
const error = ref(null);
const toast = useToast();

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
const sortColumn = ref("id");
const sortDirection = ref("desc");

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Sélection
const selectedRows = ref([]);

// ============================================================================
// DONNÉES API
// ============================================================================

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// ✅ FONCTION CORRIGÉE pour transformer les données API
const transformerDonneesAPI = (reponseAPI) => {
  if (!reponseAPI?.data) {
    throw new Error('Format de réponse API invalide');
  }

  return reponseAPI.data.map(affectation => {
    // ✅ Formater l'émetteur avec code entité et fonction/Agent
    let emetteurFormate = '';
    if (affectation?.emetteur?.user?.nom && affectation?.emetteur?.entite?.code) {
      const nomComplet = `${affectation.emetteur.user.nom} ${affectation.emetteur.user.prenom || ''}`.trim();
      const codeEntite = affectation.emetteur.entite.code;
      const roleOuFonction = affectation.emetteur.is_responsable
        ? affectation.emetteur.entite.fonction
        : 'Agent';
      emetteurFormate = `${nomComplet} (${codeEntite} - ${roleOuFonction})`;
    }

    // ✅ Formater le destinataire avec code entité et fonction/Agent
    let destinataireFormate = '';
    if (affectation?.destinataire?.user?.nom && affectation?.destinataire?.entite?.code) {
      const nomComplet = `${affectation.destinataire.user.nom} ${affectation.destinataire.user.prenom || ''}`.trim();
      const codeEntite = affectation.destinataire.entite.code;
      const roleOuFonction = affectation.destinataire.is_responsable
        ? affectation.destinataire.entite.fonction
        : 'Agent';
      destinataireFormate = `${nomComplet} (${codeEntite} - ${roleOuFonction})`;
    }

    return {
      id: affectation.id,
      reference_courrier: affectation?.courrier_arrive?.document?.reference || '',
      objet_courrier: affectation?.courrier_arrive?.document?.objet || '',
      doc_courrier: affectation?.courrier_arrive?.document?.url 
        ? `http://localhost:8000${affectation.courrier_arrive.document.url}` 
        : '',
      date_affect: formatDate(affectation.date_affect),
      instructions: affectation.instructions || '',
      statut: affectation.statut || '',
      priority: affectation.priority || '',
      delai_traitement: formatDate(affectation.delai_traitement),
      date_cloture: formatDate(affectation.date_cloture),
      emetteur: emetteurFormate,
      destinataire: destinataireFormate,
      // Données complètes pour les actions
      affectation_complete: affectation,
    };
  });
};

const loadData = async () => {
  if (!authToken.value) {
    error.value = 'Token d\'authentification manquant';
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const reponse = await $fetch(`${config.public.apiBase}/affectations`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken.value}`,
      },
    });

    affectationData.value = transformerDonneesAPI(reponse);
    console.log(`✅ ${affectationData.value.length} affectations chargées`);
  } catch (err) {
    error.value = err.message || 'Erreur lors du chargement des données';
    console.error('Erreur de chargement:', err);
    toast.add({
      title: "Erreur",
      description: "Impossible de charger les affectations",
      color: "red",
      timeout: 1500,
    });
  } finally {
    loading.value = false;
  }
};

// ============================================================================
// UTILITAIRES COULEURS
// ============================================================================

const getStatutColor = (statut) => {
  const colors = {
    'En attente': { color: 'gray', dot: 'bg-gray-500' },
    'En cours': { color: 'blue', dot: 'bg-blue-500' },
    'Traité': { color: 'green', dot: 'bg-green-500' },
    'Clôturé': { color: 'purple', dot: 'bg-purple-500' },
    'Annulé': { color: 'red', dot: 'bg-red-500' },
  };
  return colors[statut] || { color: 'gray', dot: 'bg-gray-500' };
};

const getPriorityColor = (priority) => {
  const colors = {
    'Urgent': { color: 'red', dot: 'bg-red-500' },
    'Important': { color: 'orange', dot: 'bg-orange-500' },
    'Standard': { color: 'blue', dot: 'bg-blue-500' },
  };
  return colors[priority] || { color: 'gray', dot: 'bg-gray-500' };
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
  const options = [...new Set(affectationData.value.map(item => item[column]))];
  return options
    .filter(value => value !== '') // Exclure les valeurs vides
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
  let filtered = affectationData.value;

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
    'bg-purple-50': isSelectedRow,
    'bg-gray-50': index % 2 === 0 && !isSelectedRow,
    'bg-white': index % 2 === 1 && !isSelectedRow,
    'hover:bg-purple-100': !isSelectedRow,
    'hover:bg-purple-200': isSelectedRow,
  };
};

const getCellAlignment = (columnKey) => {
  const leftAligned = ['objet_courrier', 'instructions', 'reference_courrier', 'emetteur', 'destinataire'];
  return leftAligned.includes(columnKey) ? 'text-left' : 'text-center';
};

const openDocument = (url) => {
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};

// ============================================================================
// ACTIONS
// ============================================================================

const viewDetails = (item) => {
  console.log("Voir détails de l'affectation:", item);
  
  // Créer un contenu HTML formaté pour les détails
  const details = `
    <div class="text-left space-y-3">
      <div class="bg-blue-50 rounded-lg p-3">
        <p class="text-xs text-gray-600 uppercase font-semibold mb-1">Courrier</p>
        <p class="font-bold text-blue-900">${item.reference_courrier}</p>
        <p class="text-sm text-gray-700 mt-1">${item.objet_courrier}</p>
      </div>
      
      <div class="grid grid-cols-2 gap-2">
        <div class="bg-gray-50 rounded p-2">
          <p class="text-xs text-gray-600 font-semibold">Date d'affectation</p>
          <p class="text-sm text-gray-900">${item.date_affect}</p>
        </div>
        <div class="bg-gray-50 rounded p-2">
          <p class="text-xs text-gray-600 font-semibold">Date de retour attendue</p>
          <p class="text-sm text-gray-900">${item.delai_traitement}</p>
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-2">
        <div class="bg-gray-50 rounded p-2">
          <p class="text-xs text-gray-600 font-semibold">Statut</p>
          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-${getStatutColor(item.statut).color}-100 text-${getStatutColor(item.statut).color}-800">
            ${item.statut}
          </span>
        </div>
        <div class="bg-gray-50 rounded p-2">
          <p class="text-xs text-gray-600 font-semibold">Priorité</p>
          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-${getPriorityColor(item.priority).color}-100 text-${getPriorityColor(item.priority).color}-800">
            ${item.priority}
          </span>
        </div>
      </div>
      
      ${item.destinataire ? `
        <div class="bg-gray-50 rounded p-2">
          <p class="text-xs text-gray-600 font-semibold">Destinataire</p>
          <p class="text-sm text-gray-900">${item.destinataire}</p>
        </div>
      ` : ''}
      
      ${item.date_cloture ? `
        <div class="bg-green-50 rounded p-2">
          <p class="text-xs text-gray-600 font-semibold">Date de clôture</p>
          <p class="text-sm text-gray-900">${item.date_cloture}</p>
        </div>
      ` : ''}
      
      <div class="bg-yellow-50 rounded p-3">
        <p class="text-xs text-gray-600 font-semibold mb-1">Instructions</p>
        <p class="text-sm text-gray-700 whitespace-pre-wrap">${item.instructions}</p>
      </div>
    </div>
  `;

  Swal.fire({
    title: 'Détails de l\'affectation',
    html: details,
    icon: 'info',
    confirmButtonColor: '#3b82f6',
    confirmButtonText: 'Fermer',
    width: '600px',
    customClass: {
      popup: 'swal2-popup-custom',
      title: 'text-xl font-semibold',
      htmlContainer: 'text-sm',
    }
  });
};

const editItem = (item) => {
  console.log("Modifier l'affectation:", item);
  // TODO: Rediriger vers la page d'édition
  navigateTo(`/affectations/edit/${item.id}`);
};

const deleteItem = async (item) => {
  const result = await Swal.fire({
    title: 'Confirmer la suppression',
    html: `
      <div class="text-left">
        <p class="mb-3">Êtes-vous sûr de vouloir supprimer cette affectation ?</p>
        <div class="bg-gray-50 rounded-lg p-4 space-y-2">
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
              ${item.reference_courrier}
            </span>
          </div>
          <p class="text-sm text-gray-700">${item.objet_courrier}</p>
          <div class="pt-2 border-t border-gray-200">
            <span class="text-xs text-gray-600">Destinataire: </span>
            <span class="text-sm font-medium">${item.destinataire || 'Non assigné'}</span>
          </div>
        </div>
        <p class="mt-3 text-sm text-gray-500">Cette action est irréversible.</p>
      </div>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler',
    reverseButtons: true,
    customClass: {
      popup: 'swal2-popup-custom',
      title: 'text-xl font-semibold',
      htmlContainer: 'text-sm',
    }
  });

  if (!result.isConfirmed) {
    return;
  }

  try {
    await $fetch(`${config.public.apiBase}/affectations/${item.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authToken.value}`,
      },
    });

    await Swal.fire({
      title: 'Supprimé !',
      text: 'L\'affectation a été supprimée avec succès',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });

    // Recharger les données
    await loadData();
  } catch (err) {
    console.error("Erreur lors de la suppression:", err);
    
    await Swal.fire({
      title: 'Erreur',
      text: 'Impossible de supprimer l\'affectation',
      icon: 'error',
      confirmButtonColor: '#3b82f6',
      confirmButtonText: 'OK'
    });
  }
};

const deleteSelected = async () => {
  const result = await Swal.fire({
    title: 'Suppression multiple',
    html: `
      <div class="text-left">
        <p class="mb-3">Êtes-vous sûr de vouloir supprimer <strong>${selectedRows.value.length} affectation(s)</strong> ?</p>
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
          <div class="flex items-start gap-2">
            <svg class="h-5 w-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <p class="text-sm text-yellow-800">Cette action supprimera toutes les affectations sélectionnées de manière permanente.</p>
          </div>
        </div>
        <p class="text-sm text-gray-500">Cette action est irréversible.</p>
      </div>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: `Oui, supprimer ${selectedRows.value.length} élément(s)`,
    cancelButtonText: 'Annuler',
    reverseButtons: true,
    customClass: {
      popup: 'swal2-popup-custom',
      title: 'text-xl font-semibold',
      htmlContainer: 'text-sm',
    }
  });

  if (!result.isConfirmed) {
    return;
  }

  try {
    // Supprimer toutes les affectations sélectionnées
    await Promise.all(
      selectedRows.value.map(id =>
        $fetch(`${config.public.apiBase}/affectations/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${authToken.value}`,
          },
        })
      )
    );

    await Swal.fire({
      title: 'Supprimés !',
      text: `${selectedRows.value.length} affectation(s) supprimée(s) avec succès`,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });

    selectedRows.value = [];
    await loadData();
  } catch (err) {
    console.error("Erreur lors de la suppression multiple:", err);
    
    await Swal.fire({
      title: 'Erreur',
      text: 'Impossible de supprimer les affectations',
      icon: 'error',
      confirmButtonColor: '#3b82f6',
      confirmButtonText: 'OK'
    });
  }
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
/* Truncate text */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Styles pour améliorer l'apparence de SweetAlert2 */
:deep(.swal2-popup-custom) {
  border-radius: 1rem;
  padding: 2rem;
}

:deep(.swal2-html-container) {
  margin: 1rem 0;
}

:deep(.swal2-actions) {
  gap: 0.75rem;
}

:deep(.swal2-confirm),
:deep(.swal2-cancel) {
  padding: 0.625rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s;
}

:deep(.swal2-confirm):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

:deep(.swal2-cancel):hover {
  background-color: #4b5563 !important;
}
</style>