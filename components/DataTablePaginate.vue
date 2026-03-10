<template>
  <div class="flex flex-col gap-0 rounded-xl border border-slate-200 overflow-hidden bg-white">

    <!-- ── BARRE DE PROGRESSION ──────────────────────────────────────────── -->
    <div class="h-0.5 bg-slate-100 overflow-hidden">
      <div v-if="showLoading || props.tabLoading" class="h-full bg-indigo-500 animate-progress"></div>
    </div>

    <!-- ── TOOLBAR ──────────────────────────────────────────────────────── -->
    <div v-if="showToolbar"
      class="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-white border-b border-slate-200">
      <div class="flex items-center gap-2">
        <UInput v-if="showGlobalSearch && !externalPagination" v-model="globalSearch"
          icon="i-heroicons-magnifying-glass"
          placeholder="Recherche globale..." size="sm" class="w-56" @input="onGlobalSearchInput" />
        <UInput v-if="showGlobalSearch && externalPagination" v-model="globalSearch"
          icon="i-heroicons-magnifying-glass"
          placeholder="Recherche globale..." size="sm" class="w-56" @input="onExternalSearchInput" />
        <UButton v-if="showAdvancedFiltersToggle" size="sm"
          :color="showAdvancedFilters ? 'indigo' : 'gray'"
          variant="soft"
          :icon="showAdvancedFilters ? 'i-heroicons-funnel-solid' : 'i-heroicons-funnel'"
          @click="showAdvancedFilters = !showAdvancedFilters">
          Filtres
          <UBadge v-if="activeFiltersCount > 0" :label="String(activeFiltersCount)" color="red" size="xs"
            class="ml-1" />
        </UButton>
      </div>
      <div v-if="showPaginationOptions" class="flex items-center gap-2">
        <span class="text-xs text-slate-500">Lignes par page :</span>
        <USelect v-model="localItemsPerPage"
          :options="itemsPerPageOptions.map(n => ({ label: String(n), value: n }))"
          size="sm" class="w-20" @change="onLocalPerPageChange" />
      </div>
    </div>

    <!-- ── FILTRES AVANCÉS ───────────────────────────────────────────────── -->
    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-1">
      <div v-if="showAdvancedFilters" class="px-4 py-3 bg-slate-50 border-b border-slate-200">
        <slot name="advanced-filters" :filters="filters" :on-filter="onGlobalSearchInput" />
      </div>
    </Transition>

    <!-- ── BARRE SÉLECTION ───────────────────────────────────────────────── -->
    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
      enter-to-class="opacity-100">
      <div v-if="selectable && selectedRows.length > 0"
        class="flex items-center gap-3 px-4 py-2 bg-indigo-50 border-b border-indigo-100">
        <UIcon name="i-heroicons-check-circle" class="text-indigo-500 w-4 h-4" />
        <span class="text-sm font-semibold text-indigo-600">{{ selectedRows.length }} sélectionné(s)</span>
        <slot name="selection-actions" :selected="selectedRows" />
      </div>
    </Transition>

    <!-- ── TABLE ─────────────────────────────────────────────────────────── -->
    <div class="relative overflow-x-auto">

      <!-- Overlay -->
      <Transition enter-active-class="transition duration-150" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-150"
        leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="showLoading"
          class="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-10 flex items-center justify-center">
          <div class="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200">
            <div class="w-3.5 h-3.5 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin"></div>
            <span class="text-xs font-medium text-slate-600">Chargement...</span>
          </div>
        </div>
      </Transition>

      <table class="w-full border-collapse text-sm">

        <thead v-if="showHeader">
          <tr class="bg-indigo-50 text-indigo-600">

            <th v-if="showRowNumbers"
              class="sticky top-0 z-10 w-12 px-3 py-2 text-center text-xs font-bold uppercase tracking-wider border border-slate-200 bg-indigo-50">
              N°
            </th>

            <th v-for="col in visibleColumns" :key="col.key"
              class="sticky top-0 z-10 px-3 py-2 text-xs font-bold uppercase tracking-wider border border-slate-200 bg-indigo-50"
              :class="col.headerClass">

              <template v-if="col.type === 'document' || col.filterable === false">
                <span v-if="shouldShowLabel(col)" class="block text-center whitespace-nowrap">
                  {{ col.label }}
                </span>
              </template>

              <template v-else>
                <div class="flex gap-1">
                  <div class="flex items-center gap-0.5">
                    <span v-if="shouldShowLabel(col)" class="block text-center whitespace-nowrap">
                      {{ col.label }}
                    </span>
                    <button v-if="showSorting && col.sortable !== false"
                      class="flex items-center justify-center w-6 h-6 rounded hover:bg-indigo-100 transition-colors flex-shrink-0"
                      :class="sortColumn === col.key ? 'text-indigo-600' : 'text-slate-400'"
                      :title="`Trier par ${col.label}`" @click="sortBy(col.key)">
                      <svg v-if="sortColumn !== col.key" class="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M5 4l3-3 3 3H5zm6 8l-3 3-3-3h6z" />
                      </svg>
                      <svg v-else-if="sortDirection === 'asc'" class="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 2l4 6H4l4-6z" />
                      </svg>
                      <svg v-else class="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 14l-4-6h8l-4 6z" />
                      </svg>
                    </button>
                    <button v-if="showMultiSelectFilters && col.multiSelect !== false"
                      class="flex items-center justify-center w-6 h-6 rounded hover:bg-indigo-100 transition-colors flex-shrink-0"
                      :class="multiSelectFilters[col.key]?.length > 0 ? 'text-indigo-600' : 'text-slate-400'"
                      @click="openFilterMenu($event, col.key)">
                      <svg class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd"
                          d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L13 10.414V15a1 1 0 01-.447.894l-4 2.5A1 1 0 017 17.5v-7.086L3.293 6.707A1 1 0 013 6V3z"
                          clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  <div v-if="showColumnFilters && showColumnInputs && !col.inputHidden"
                    class="overflow-x-auto scrollbar-thin" :style="getInputContainerWidth(col)">
                    <input v-model="filters[col.key]" :type="col.inputType ?? 'text'"
                      :placeholder="col.inputPlaceholder ?? col.label"
                      class="px-2 py-1 text-xs font-normal normal-case tracking-normal text-slate-700 bg-white border border-slate-300 rounded focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 placeholder:text-slate-400"
                      :style="getInputStyle(col)" @input="onColumnFilterInput(col.key)" />
                  </div>
                </div>
              </template>
            </th>

            <th v-if="selectable"
              class="sticky top-0 z-10 w-10 px-3 py-2 text-center border border-slate-200 bg-indigo-50">
              <UCheckbox :model-value="isAllSelected" :indeterminate="isIndeterminate"
                @change="toggleSelectAll" />
            </th>

            <th v-if="showActions"
              class="sticky top-0 right-0 z-20 px-3 py-2 text-right text-xs font-bold uppercase tracking-wider border border-slate-200 bg-indigo-50 min-w-24"
              style="box-shadow: -3px 0 8px rgba(0,0,0,0.06)">
              {{ actionsLabel }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, index) in paginatedData" :key="item.id"
            class="group transition-colors duration-100"
            :class="rowBg(item.id, index)">

            <td v-if="showRowNumbers"
              class="px-3 py-2 text-center text-xs font-semibold text-indigo-500 border border-slate-100">
              {{ startIndex + index + 1 }}
            </td>

            <td v-for="col in visibleColumns" :key="col.key"
              class="px-3 py-2 border border-slate-100"
              :class="[col.cellClass, getCellAlignment(col.key)]">
              <slot :name="`cell-${col.key}`" :item="item" :value="item[col.key]" :column="col">
                <template v-if="col.type === 'document'">
                  <UButton v-if="item[col.key]" size="xs" color="blue" variant="ghost"
                    icon="i-heroicons-document-text" @click="$emit('open-document', item[col.key])" />
                  <UIcon v-else name="i-heroicons-document-text" class="w-5 h-5 text-slate-300 mx-auto" />
                </template>
                <template v-else-if="col.type === 'badge'">
                  <UBadge :label="String(item[col.key])" color="indigo" variant="subtle" size="xs" />
                </template>
                <template v-else-if="col.type === 'boolean'">
                  <UBadge :label="item[col.key] ? 'Oui' : 'Non'"
                    :color="item[col.key] ? 'green' : 'red'" variant="subtle" size="xs" />
                </template>
                <template v-else>
                  <span class="text-slate-700 text-xs">{{ item[col.key] ?? '—' }}</span>
                </template>
              </slot>
            </td>

            <td v-if="selectable" class="px-3 py-2 text-center border border-slate-100">
              <UCheckbox :model-value="selectedRows.includes(item.id)"
                @change="toggleRowSelect(item.id)" />
            </td>

            <td v-if="showActions" class="sticky right-0 px-3 py-2 text-right border border-slate-100"
              :class="stickyBg(item.id, index)" style="box-shadow: -3px 0 8px rgba(0,0,0,0.05)">
              <slot name="actions" :item="item">
                <div class="flex items-center justify-end gap-1">
                  <UButton v-if="defaultActions.includes('view')" size="xs" color="blue" variant="ghost"
                    icon="i-heroicons-eye" title="Voir" @click="$emit('view', item)" />
                  <UButton v-if="defaultActions.includes('edit')" size="xs" color="indigo" variant="ghost"
                    icon="i-heroicons-pencil" title="Éditer" @click="$emit('edit', item)" />
                  <UButton v-if="defaultActions.includes('download')" size="xs" color="green" variant="ghost"
                    icon="i-heroicons-arrow-down-tray" title="Télécharger" @click="$emit('download', item)" />
                  <UButton v-if="defaultActions.includes('archive')" size="xs" color="yellow" variant="ghost"
                    icon="i-heroicons-archive-box" title="Archiver" @click="$emit('archive', item)" />
                  <UButton v-if="defaultActions.includes('delete')" size="xs" color="red" variant="ghost"
                    icon="i-heroicons-trash" title="Supprimer" @click="$emit('delete', item)" />
                </div>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ── ÉTAT VIDE ─────────────────────────────────────────────────────── -->
    <div v-if="!showLoading && paginatedData.length === 0"
      class="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
      <slot name="empty-state">
        <UIcon name="i-heroicons-inbox" class="w-12 h-12 text-slate-300" />
        <p class="text-sm font-semibold text-slate-600">{{ emptyStateTitle }}</p>
        <p class="text-xs text-slate-400">{{ emptyStateText }}</p>
      </slot>
    </div>

    <!-- ── PAGINATION ────────────────────────────────────────────────────── -->
    <div v-if="showPagination && paginatedData.length > 0"
      class="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-50 border-t border-slate-200">

      <span class="text-xs text-slate-500">
        <template v-if="externalPagination">
          {{ startIndex + 1 }}–{{ endIndex }} sur
          <span class="font-semibold text-slate-700">{{ externalTotal }}</span> résultats
        </template>
        <template v-else>
          {{ startIndex + 1 }}–{{ endIndex }} sur {{ filteredData.length }} résultats
          <span v-if="filteredData.length !== sourceData.length" class="text-slate-400">
            ({{ sourceData.length }} total)
          </span>
        </template>
      </span>

      <div class="flex items-center gap-1">
        <UButton size="xs" color="gray" variant="ghost" icon="i-heroicons-chevron-left"
          :disabled="currentPage <= 1 || showLoading"
          @click="onPageClick(currentPage - 1)" />

        <template v-for="(p, i) in visiblePages" :key="i">
          <span v-if="p === '...'"
            class="w-7 h-7 flex items-center justify-center text-xs text-slate-400 select-none">…</span>
          <UButton v-else size="xs"
            :color="p === currentPage ? 'indigo' : 'gray'"
            :variant="p === currentPage ? 'solid' : 'ghost'"
            :label="String(p)"
            :disabled="showLoading"
            @click="onPageClick(p)" />
        </template>

        <UButton size="xs" color="gray" variant="ghost" icon="i-heroicons-chevron-right"
          :disabled="currentPage >= totalPages || showLoading"
          @click="onPageClick(currentPage + 1)" />
      </div>
    </div>
  </div>

  <!-- ── MENU FILTRE MULTI-SÉLECTION ──────────────────────────────────────── -->
  <Teleport to="body">
    <div v-if="filterMenu.show" class="fixed inset-0 z-40" @click="closeFilterMenu" />
    <Transition enter-active-class="transition duration-150 ease-out" enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100">
      <UCard v-if="filterMenu.show" class="fixed z-50 w-72 shadow-xl"
        :style="{ left: filterMenu.x + 'px', top: filterMenu.y + 'px' }"
        :ui="{ body: { padding: 'p-0' }, header: { padding: 'px-4 py-3' }, footer: { padding: 'px-4 py-2' } }"
        @click.stop>
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-indigo-600">
              {{ getColumnLabel(filterMenu.column) }}
            </span>
            <div class="flex items-center gap-2">
              <UBadge v-if="multiSelectFilters[filterMenu.column]?.length"
                :label="String(multiSelectFilters[filterMenu.column].length)" color="indigo" size="xs" />
              <UButton size="xs" color="gray" variant="ghost" icon="i-heroicons-x-mark"
                @click="closeFilterMenu" />
            </div>
          </div>
        </template>
        <div class="px-3 py-2 border-b border-slate-100">
          <UInput v-model="filterMenuSearch" placeholder="Rechercher..." size="xs"
            icon="i-heroicons-magnifying-glass" />
        </div>
        <div class="max-h-52 overflow-y-auto py-1">
          <label class="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 cursor-pointer">
            <UCheckbox :model-value="isAllOptionsSelected(filterMenu.column)"
              :indeterminate="isOptionsIndeterminate(filterMenu.column)"
              @change="toggleAllOptions(filterMenu.column)" />
            <span class="text-xs font-semibold text-slate-500">(Tout sélectionner)</span>
          </label>
          <div class="my-1 border-t border-slate-100" />
          <label v-for="opt in filteredOptions" :key="opt.value"
            class="flex items-center gap-2 px-4 py-1.5 hover:bg-slate-50 cursor-pointer">
            <UCheckbox :model-value="multiSelectFilters[filterMenu.column]?.includes(opt.value)"
              @change="toggleOption(filterMenu.column, opt.value)" />
            <span class="text-xs text-slate-700">{{ opt.label }}</span>
          </label>
        </div>
        <template #footer>
          <div class="flex items-center justify-between">
            <span class="text-xs text-slate-400">
              {{ multiSelectFilters[filterMenu.column]?.length || 0 }} sélectionné(s)
            </span>
            <UButton v-if="multiSelectFilters[filterMenu.column]?.length" size="xs" color="indigo"
              variant="soft" label="Réinitialiser" @click="resetFilter(filterMenu.column)" />
          </div>
        </template>
      </UCard>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  data:                      { type: Array,   default: () => [] },
  columns:                   { type: Array,   required: true },
  loading:                   { type: Boolean, default: false },
  selectable:                { type: Boolean, default: true },
  itemsPerPageOptions:       { type: Array,   default: () => [10, 25, 50, 100] },
  defaultItemsPerPage:       { type: Number,  default: 10 },
  showToolbar:               { type: Boolean, default: true },
  showGlobalSearch:          { type: Boolean, default: true },
  showAdvancedFiltersToggle: { type: Boolean, default: true },
  showColumnFilters:         { type: Boolean, default: true },
  showSorting:               { type: Boolean, default: true },
  showMultiSelectFilters:    { type: Boolean, default: true },
  showPaginationOptions:     { type: Boolean, default: true },
  showPagination:            { type: Boolean, default: true },
  showHeader:                { type: Boolean, default: true },
  showActions:               { type: Boolean, default: true },
  showRowNumbers:            { type: Boolean, default: false },
  showColumnInputs:          { type: Boolean, default: true },
  showColumnLabels:          { type: Boolean, default: true },
  columnInputSize:           { type: String,  default: null },
  leftAlignedColumns:        { type: Array,   default: () => [] },
  hideLabelsWhenInput:       { type: Boolean, default: false },
  hideLoadingOnColumnFilter: { type: Boolean, default: false },
  defaultActions: {
    type: Array,
    default: () => ['edit', 'delete'],
    validator: v => v.every(a => ['edit', 'delete', 'view', 'download', 'archive', 'assign'].includes(a))
  },
  actionsLabel:         { type: String, default: 'Actions' },
  emptyStateTitle:      { type: String, default: 'Aucun résultat' },
  emptyStateText:       { type: String, default: "Essayez d'ajuster vos filtres ou votre recherche." },
  defaultSortColumn:    { type: String, default: null },
  defaultSortDirection: { type: String, default: 'asc', validator: v => ['asc', 'desc'].includes(v) },
  externalPagination:   { type: Boolean, default: false },
  externalTotal:        { type: Number,  default: 0 },
  externalPage:         { type: Number,  default: 1 },
  externalLastPage:     { type: Number,  default: 1 },
  externalPerPage:      { type: Number,  default: 20 },
  tabLoading: { type: Boolean, default: false },
})

const emit = defineEmits([
  'edit', 'delete', 'view', 'download', 'archive', 'assign',
  'open-document', 'selection-change',
  'page-change', 'per-page-change',
  'search-change',        // recherche globale toolbar → serveur
  'column-filter-change', // filtres colonnes → serveur
])

// ── Colonnes ──────────────────────────────────────────────────────────────
const visibleColumns = computed(() => props.columns.filter(c => c.visible !== false))

// ── Source ────────────────────────────────────────────────────────────────
const sourceData = computed(() => props.data)

// ── Recherche globale ─────────────────────────────────────────────────────
const globalSearch        = ref('')
const showAdvancedFilters = ref(false)

// Mode interne — filtrage local
const onGlobalSearchInput = () => {
  currentPage.value = 1
}

// Mode externe — émettre vers parent avec debounce
let searchDebounce = null
const onExternalSearchInput = () => {
  clearTimeout(searchDebounce)
  searchDebounce = setTimeout(() => {
    emit('search-change', globalSearch.value)
  }, 400)
}

// ── Filtres colonnes ───────────────────────────────────────────────────────
const filters = ref(
  props.columns.reduce((acc, col) => ({ ...acc, [col.key]: '' }), {})
)
const multiSelectFilters = ref(
  props.columns.reduce((acc, col) => ({ ...acc, [col.key]: [] }), {})
)

const activeFiltersCount = computed(() =>
  Object.values(filters.value).filter(v => v !== '').length +
  Object.values(multiSelectFilters.value).filter(v => v.length > 0).length
)

// Filtre colonne → local (mode interne) ou serveur (mode externe)
let columnDebounce = null
const onColumnFilterInput = (key) => {
  if (props.externalPagination) {
    // Émettre vers serveur avec debounce
    clearTimeout(columnDebounce)
    columnDebounce = setTimeout(() => {
      emit('column-filter-change', { ...filters.value })
    }, 400)
  } else {
    // Filtrage local
    currentPage.value = 1
  }
}

// ── Tri ───────────────────────────────────────────────────────────────────
const sortColumn    = ref(props.defaultSortColumn)
const sortDirection = ref(props.defaultSortDirection)

const sortBy = (col) => {
  if (sortColumn.value === col) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value    = col
    sortDirection.value = 'asc'
  }
}

// ── Sélection ─────────────────────────────────────────────────────────────
const selectedRows    = ref([])
const isAllSelected   = computed(() => paginatedData.value.length > 0 && selectedRows.value.length === paginatedData.value.length)
const isIndeterminate = computed(() => selectedRows.value.length > 0 && selectedRows.value.length < paginatedData.value.length)

const toggleSelectAll = () => {
  isAllSelected.value
    ? selectedRows.value = []
    : selectedRows.value = paginatedData.value.map(i => i.id)
}
const toggleRowSelect = (id) => {
  const i = selectedRows.value.indexOf(id)
  i > -1 ? selectedRows.value.splice(i, 1) : selectedRows.value.push(id)
}

watch(selectedRows, val => emit('selection-change', [...val]), { deep: true })

// ── Pagination ────────────────────────────────────────────────────────────
const currentPage       = ref(props.externalPagination ? props.externalPage : 1)
const localItemsPerPage = ref(props.defaultItemsPerPage)

watch(() => props.externalPage, (val) => {
  if (props.externalPagination) currentPage.value = val
})

const totalPages = computed(() =>
  props.externalPagination
    ? props.externalLastPage
    : Math.max(1, Math.ceil(filteredData.value.length / localItemsPerPage.value))
)

const startIndex = computed(() =>
  props.externalPagination
    ? (props.externalPage - 1) * props.externalPerPage
    : (currentPage.value - 1) * localItemsPerPage.value
)

const endIndex = computed(() =>
  props.externalPagination
    ? Math.min(startIndex.value + props.externalPerPage, props.externalTotal)
    : Math.min(startIndex.value + localItemsPerPage.value, sortedData.value.length)
)

const paginatedData = computed(() =>
  props.externalPagination
    ? sortedData.value
    : sortedData.value.slice(startIndex.value, endIndex.value)
)

const visiblePages = computed(() => {
  const total = totalPages.value
  const cur   = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = [1]
  if (cur > 3) pages.push('...')
  const start = Math.max(2, cur - 1)
  const end   = Math.min(total - 1, cur + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (cur < total - 2) pages.push('...')
  pages.push(total)
  return pages
})

const onPageClick = (page) => {
  if (page < 1 || page > totalPages.value || props.loading) return
  currentPage.value = page
  if (props.externalPagination) emit('page-change', page)
}

const onLocalPerPageChange = () => {
  currentPage.value = 1
  if (props.externalPagination) emit('per-page-change', localItemsPerPage.value)
}

// ── Loading — masqué si hideLoadingOnColumnFilter ─────────────────────────
const showLoading = computed(() =>
  props.hideLoadingOnColumnFilter ? false : props.loading
)

// ── Données calculées ─────────────────────────────────────────────────────
const filteredData = computed(() => {
  // Mode externe → pas de filtrage local (tout côté serveur)
  if (props.externalPagination) return sourceData.value

  // Mode interne → filtrage local complet
  let data = sourceData.value

  if (globalSearch.value) {
    const q = globalSearch.value.toLowerCase()
    data = data.filter(item =>
      Object.values(item).some(v => String(v).toLowerCase().includes(q))
    )
  }

  Object.entries(multiSelectFilters.value).forEach(([col, vals]) => {
    if (vals.length > 0) data = data.filter(item => vals.includes(item[col]))
  })

  Object.entries(filters.value).forEach(([key, val]) => {
    if (val) data = data.filter(item =>
      String(item[key] ?? '').toLowerCase().includes(val.toLowerCase())
    )
  })

  return data
})

const sortedData = computed(() => {
  const data = [...filteredData.value]
  if (!sortColumn.value) return data
  return data.sort((a, b) => {
    let aV = a[sortColumn.value], bV = b[sortColumn.value]
    if (typeof aV === 'string') { aV = aV.toLowerCase(); bV = bV.toLowerCase() }
    const cmp = aV > bV ? 1 : aV < bV ? -1 : 0
    return sortDirection.value === 'asc' ? cmp : -cmp
  })
})

watch(filteredData, () => {
  if (!props.externalPagination && currentPage.value > totalPages.value) {
    currentPage.value = 1
  }
})

// ── Menu filtre multi-sélection ───────────────────────────────────────────
const filterMenu       = ref({ show: false, column: null, x: 0, y: 0 })
const filterMenuSearch = ref('')

const openFilterMenu = (event, column) => {
  filterMenuSearch.value = ''
  const rect = event.target.getBoundingClientRect()
  filterMenu.value = { show: true, column, x: rect.left, y: rect.bottom + 6 }
}
const closeFilterMenu = () => { filterMenu.value = { show: false, column: null, x: 0, y: 0 } }
const getColumnLabel  = (key) => props.columns.find(c => c.key === key)?.label ?? key

const getOptions = (col) =>
  [...new Set(sourceData.value.map(i => i[col]))]
    .map(v => ({ value: v, label: String(v) }))
    .sort((a, b) => a.label.localeCompare(b.label))

const filteredOptions = computed(() => {
  if (!filterMenu.value.column) return []
  const opts = getOptions(filterMenu.value.column)
  return filterMenuSearch.value
    ? opts.filter(o => o.label.toLowerCase().includes(filterMenuSearch.value.toLowerCase()))
    : opts
})

const isAllOptionsSelected   = (col) => { const all = getOptions(col); return all.length > 0 && (multiSelectFilters.value[col]?.length ?? 0) === all.length }
const isOptionsIndeterminate = (col) => { const all = getOptions(col); const sel = multiSelectFilters.value[col]?.length ?? 0; return sel > 0 && sel < all.length }
const toggleAllOptions       = (col) => { isAllOptionsSelected(col) ? multiSelectFilters.value[col] = [] : multiSelectFilters.value[col] = getOptions(col).map(o => o.value) }
const toggleOption           = (col, val) => {
  if (!multiSelectFilters.value[col]) multiSelectFilters.value[col] = []
  const i = multiSelectFilters.value[col].indexOf(val)
  i > -1 ? multiSelectFilters.value[col].splice(i, 1) : multiSelectFilters.value[col].push(val)
}
const resetFilter = (col) => { multiSelectFilters.value[col] = [] }

// ── UI helpers ────────────────────────────────────────────────────────────
const rowBg = (id, index) => {
  if (selectedRows.value.includes(id)) return 'bg-indigo-50 hover:bg-indigo-100'
  return index % 2 === 0 ? 'bg-white hover:bg-indigo-50' : 'bg-slate-50 hover:bg-indigo-50'
}
const stickyBg = (id, index) => {
  if (selectedRows.value.includes(id)) return 'bg-indigo-50 group-hover:bg-indigo-100'
  return index % 2 === 0 ? 'bg-white group-hover:bg-indigo-50' : 'bg-slate-50 group-hover:bg-indigo-50'
}
const getInputContainerWidth = (col) => {
  if (col.inputWidth) return `width: ${col.inputWidth}`
  if (props.columnInputSize) return `width: ${props.columnInputSize}`
  return 'width: 100%'
}
const getInputStyle = (col) => {
  if (col.inputWidth) return `width: ${col.inputWidth}`
  if (props.columnInputSize) return `width: 100%`
  const text  = col.inputPlaceholder ?? col.label ?? ''
  const width = Math.max(60, text.length * 7 + 24)
  return `width: ${width}px`
}
const shouldShowLabel = (col) => {
  if (props.hideLabelsWhenInput) return col.inputHidden === true || col.filterable === false
  return props.showColumnLabels && col.showLabel !== false
}
const getCellAlignment = (columnKey) => {
  if (props.leftAlignedColumns.includes(columnKey)) return 'text-left'
  return 'text-center'
}

defineExpose({ selectedRows, filters, multiSelectFilters, currentPage, showAdvancedFilters })
</script>

<style>
.scrollbar-thin::-webkit-scrollbar       { height: 2px; }
.scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
.scrollbar-thin::-webkit-scrollbar-thumb { background: #c7d2fe; border-radius: 2px; }

@keyframes progress {
  0%   { width: 0%;  margin-left: 0; }
  50%  { width: 60%; margin-left: 20%; }
  100% { width: 0%;  margin-left: 100%; }
}
.animate-progress { animation: progress 1s ease-in-out infinite; }
</style>