<template>
  <div class="flex flex-col gap-0 rounded-xl border border-slate-200 overflow-hidden bg-white">

    <!-- ── BARRE DE PROGRESSION ──────────────────────────────────────────── -->
    <div class="h-0.5 bg-slate-100 overflow-hidden">
      <div v-if="showLoading || props.tabLoading" class="h-full bg-indigo-500 animate-progress"></div>
    </div>

    <!-- ── TOOLBAR ──────────────────────────────────────────────────────── -->
    <div v-if="showToolbar"
      class="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-white border-b border-slate-200">
      <div class="flex items-center gap-2 flex-wrap">

        <!-- Recherche globale -->
        <UInput v-if="showGlobalSearch && !externalPagination" v-model="globalSearch"
          icon="i-heroicons-magnifying-glass" placeholder="Recherche globale..." size="sm" class="w-56"
          @input="onGlobalSearchInput" />
        <UInput v-if="showGlobalSearch && externalPagination" v-model="globalSearch"
          icon="i-heroicons-magnifying-glass" placeholder="Recherche globale..." size="sm" class="w-56"
          @input="onExternalSearchInput" />

        <!-- ── Slot contenu toolbar supplémentaire (PeriodFilter etc.) ── -->
        <slot name="toolbar-extra" />

        <!-- ── Filtre période ─────────────────────────────────────── -->
        <template v-if="showPeriodFilter">
          <!-- Sélecteur de champ -->
          <select
            v-model="localPeriodField"
            class="h-8 px-2 text-xs text-slate-700 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all cursor-pointer"
            @change="onPeriodChange">
            <option value="date_enreg">Date d'enreg.</option>
            <option value="date_courrier">Date courrier</option>
          </select>

          <!-- Du -->
          <div class="flex items-center gap-1">
            <span class="text-[11px] text-slate-400 font-medium whitespace-nowrap">Du</span>
            <input
              v-model="localPeriodFrom"
              type="text"
              placeholder="jj/mm/aaaa"
              maxlength="10"
              class="h-8 w-28 px-2 text-xs text-slate-700 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              @input="onPeriodInput" />
          </div>

          <!-- Au -->
          <div class="flex items-center gap-1">
            <span class="text-[11px] text-slate-400 font-medium whitespace-nowrap">au</span>
            <input
              v-model="localPeriodTo"
              type="text"
              placeholder="jj/mm/aaaa"
              maxlength="10"
              class="h-8 w-28 px-2 text-xs text-slate-700 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              @input="onPeriodInput" />
          </div>

          <!-- Effacer période -->
          <button
            v-if="localPeriodFrom || localPeriodTo"
            class="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-500 transition-colors"
            title="Effacer la période"
            @click="clearPeriod">
            <Icon name="i-heroicons-x-mark" class="w-3.5 h-3.5" />
          </button>
        </template>
        <!-- ── /Filtre période ─────────────────────────────────────── -->

        <!-- Bouton filtres avancés -->
        <UButton v-if="showAdvancedFiltersToggle" size="sm" :color="showAdvancedFilters ? 'indigo' : 'gray'"
          variant="soft" :icon="showAdvancedFilters ? 'i-heroicons-funnel-solid' : 'i-heroicons-funnel'"
          @click="showAdvancedFilters = !showAdvancedFilters">
          Filtres
          <UBadge v-if="activeFiltersCount > 0" :label="String(activeFiltersCount)" color="red" size="xs" class="ml-1" />
        </UButton>
      </div>

      <div v-if="showPaginationOptions" class="flex items-center gap-2">
        <span class="text-xs text-slate-500">Lignes par page :</span>
        <USelect v-model="localItemsPerPage" :options="itemsPerPageOptions.map(n => ({ label: String(n), value: n }))"
          size="sm" class="w-20" @change="onLocalPerPageChange" />
      </div>
    </div>

    <!-- ── FILTRES AVANCÉS ───────────────────────────────────────────────── -->
    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-1">
      <div v-if="showAdvancedFilters" class="px-4 py-3 bg-slate-50 border-b border-slate-200">
        <slot name="advanced-filters" />
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

      <!-- Overlay loading -->
      <Transition enter-active-class="transition duration-150" enter-from-class="opacity-0" enter-to-class="opacity-100"
        leave-active-class="transition duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
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
                <div class="flex gap-1 items-start">
                  <div class="flex items-center gap-0.5 shrink-0">
                    <span v-if="shouldShowLabel(col)" class="block text-center whitespace-nowrap">
                      {{ col.label }}
                    </span>
                    <button v-if="showSorting && col.sortable !== false"
                      class="flex items-center justify-center w-6 h-6 rounded hover:bg-indigo-100 transition-colors flex-shrink-0"
                      :class="sortColumn === col.key ? 'text-indigo-600' : 'text-slate-400'" @click="sortBy(col.key)">
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
                    <!-- Bouton filtre multi-select colonne -->
                    <button v-if="showMultiSelectFilters && col.multiSelect !== false" ref="filterBtnRefs"
                      :data-col="col.key"
                      class="flex items-center justify-center w-6 h-6 rounded hover:bg-indigo-100 transition-colors flex-shrink-0"
                      :class="hasActiveMultiFilter(col.key) ? 'text-indigo-600 bg-indigo-100' : 'text-slate-400'"
                      @click.stop="openFilterMenu($event, col.key)">
                      <svg class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd"
                          d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L13 10.414V15a1 1 0 01-.447.894l-4 2.5A1 1 0 017 17.5v-7.086L3.293 6.707A1 1 0 013 6V3z"
                          clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  <!-- Input filtre colonne -->
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
              <UCheckbox :model-value="isAllSelected" :indeterminate="isIndeterminate" @change="toggleSelectAll" />
            </th>

            <th v-if="showActions"
              class="sticky top-0 right-0 z-20 px-3 py-2 text-right text-xs font-bold uppercase tracking-wider border border-slate-200 bg-indigo-50 min-w-24"
              style="box-shadow: -3px 0 8px rgba(0,0,0,0.06)">
              {{ actionsLabel }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, index) in paginatedData" :key="item.id" class="group transition-colors duration-100"
            :class="[rowBg(item.id, index), rowClass(item, index)]">

            <td v-if="showRowNumbers"
              class="px-3 py-2 text-center text-xs font-semibold text-indigo-500 border border-slate-100">
              {{ startIndex + index + 1 }}
            </td>

            <td v-for="col in visibleColumns" :key="col.key" class="px-3 py-2 border border-slate-100"
              :class="[col.cellClass, getCellAlignment(col.key)]">
              <slot :name="`cell-${col.key}`" :item="item" :value="item[col.key]" :column="col">
                <template v-if="col.type === 'document'">
                  <UButton v-if="item[col.key]" size="xs" color="blue" variant="ghost" icon="i-heroicons-document-text"
                    @click="$emit('open-document', item[col.key])" />
                  <UIcon v-else name="i-heroicons-document-text" class="w-5 h-5 text-slate-300 mx-auto" />
                </template>
                <template v-else-if="col.type === 'badge'">
                  <UBadge :label="String(item[col.key])" color="indigo" variant="subtle" size="xs" />
                </template>
                <template v-else-if="col.type === 'boolean'">
                  <UBadge :label="item[col.key] ? 'Oui' : 'Non'" :color="item[col.key] ? 'green' : 'red'"
                    variant="subtle" size="xs" />
                </template>
                <template v-else>
                  <span class="text-slate-700 text-xs">{{ item[col.key] ?? '—' }}</span>
                </template>
              </slot>
            </td>

            <td v-if="selectable" class="px-3 py-2 text-center border border-slate-100">
              <UCheckbox :model-value="selectedRows.includes(item.id)" @change="toggleRowSelect(item.id)" />
            </td>

            <td v-if="showActions" class="sticky right-0 px-3 py-2 text-right border border-slate-100"
              :class="[stickyBg(item.id, index), rowClass(item, index)]" style="box-shadow: -3px 0 8px rgba(0,0,0,0.05)">
              <slot name="actions" :item="item">
                <div class="flex items-center justify-end gap-1">
                  <UButton v-if="defaultActions.includes('view')" size="xs" color="blue" variant="ghost"
                    icon="i-heroicons-eye" @click="$emit('view', item)" />
                  <UButton v-if="defaultActions.includes('edit')" size="xs" color="indigo" variant="ghost"
                    icon="i-heroicons-pencil" @click="$emit('edit', item)" />
                  <UButton v-if="defaultActions.includes('download')" size="xs" color="green" variant="ghost"
                    icon="i-heroicons-arrow-down-tray" @click="$emit('download', item)" />
                  <UButton v-if="defaultActions.includes('archive')" size="xs" color="yellow" variant="ghost"
                    icon="i-heroicons-archive-box" @click="$emit('archive', item)" />
                  <UButton v-if="defaultActions.includes('delete')" size="xs" color="red" variant="ghost"
                    icon="i-heroicons-trash" @click="$emit('delete', item)" />
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
          :disabled="currentPage <= 1 || showLoading" @click="onPageClick(currentPage - 1)" />

        <template v-for="(p, i) in visiblePages" :key="i">
          <span v-if="p === '...'"
            class="w-7 h-7 flex items-center justify-center text-xs text-slate-400 select-none">…</span>
          <UButton v-else size="xs" :color="p === currentPage ? 'indigo' : 'gray'"
            :variant="p === currentPage ? 'solid' : 'ghost'" :label="String(p)" :disabled="showLoading"
            @click="onPageClick(p)" />
        </template>

        <UButton size="xs" color="gray" variant="ghost" icon="i-heroicons-chevron-right"
          :disabled="currentPage >= totalPages || showLoading" @click="onPageClick(currentPage + 1)" />
      </div>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════════════════════════ -->
  <!-- MENU FILTRE MULTI-SÉLECTION — Teleport + position fixed viewport      -->
  <!-- ══════════════════════════════════════════════════════════════════════ -->
  <Teleport to="body">
    <!-- Backdrop invisible pour fermer au clic extérieur -->
    <div v-if="filterMenu.show" class="fixed inset-0 z-[9990]" @mousedown.stop="closeFilterMenu" />

    <Transition enter-active-class="transition duration-150 ease-out" enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
      <div v-if="filterMenu.show" ref="dropdownMenuRef"
        class="fixed z-[9999] w-72 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden"
        :style="filterMenu.style" @mousedown.stop>

        <!-- Header -->
        <div class="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-indigo-50">
          <div class="flex items-center gap-2">
            <Icon name="i-heroicons-funnel" class="w-3.5 h-3.5 text-indigo-500" />
            <span class="text-xs font-bold uppercase tracking-wider text-indigo-600">
              {{ getColumnLabel(filterMenu.column) }}
            </span>
            <span v-if="activeMultiFilterCount(filterMenu.column) > 0"
              class="inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold bg-indigo-500 text-white rounded-full">
              {{ activeMultiFilterCount(filterMenu.column) }}
            </span>
          </div>
          <button
            class="w-6 h-6 flex items-center justify-center rounded hover:bg-indigo-100 transition-colors text-slate-400"
            @click="closeFilterMenu">
            <Icon name="i-heroicons-x-mark" class="w-4 h-4" />
          </button>
        </div>

        <!-- Recherche dans le menu -->
        <div class="px-3 py-2 border-b border-slate-100">
          <div
            class="flex items-center gap-2 px-2 py-1.5 bg-slate-50 rounded-lg border border-slate-200 focus-within:border-indigo-400 transition-all">
            <Icon name="i-heroicons-magnifying-glass" class="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input v-model="filterMenuSearch" type="text" placeholder="Rechercher une valeur..."
              class="flex-1 text-xs bg-transparent outline-none text-slate-700 placeholder:text-slate-400" />
            <button v-if="filterMenuSearch" @click="filterMenuSearch = ''" class="text-slate-400 hover:text-slate-600">
              <Icon name="i-heroicons-x-mark" class="w-3 h-3" />
            </button>
          </div>
        </div>

        <!-- Options -->
        <div class="max-h-56 overflow-y-auto py-1">

          <!-- Tout sélectionner -->
          <label class="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 cursor-pointer transition-colors">
            <input type="checkbox" class="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              :checked="isAllMenuOptionsSelected" :indeterminate="isMenuOptionsIndeterminate"
              @change="toggleAllMenuOptions" />
            <span class="text-xs font-semibold text-slate-500">(Tout sélectionner)</span>
          </label>
          <div class="border-t border-slate-100 mx-3 my-0.5" />

          <!-- Chaque option -->
          <label v-for="opt in filteredMenuOptions" :key="opt.value"
            class="flex items-center gap-2.5 px-4 py-1.5 hover:bg-slate-50 cursor-pointer transition-colors">
            <input type="checkbox" class="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              :checked="isOptionChecked(filterMenu.column, opt.value)"
              @change="toggleMenuOption(filterMenu.column, opt.value)" />
            <span class="text-xs text-slate-700 truncate">{{ opt.label }}</span>
          </label>

          <!-- Aucun résultat -->
          <div v-if="filteredMenuOptions.length === 0"
            class="flex flex-col items-center justify-center py-6 gap-2 text-slate-400">
            <Icon name="i-heroicons-magnifying-glass" class="w-5 h-5 text-slate-300" />
            <span class="text-xs">Aucune valeur trouvée</span>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 bg-slate-50">
          <span class="text-[10px] text-slate-400">
            {{ activeMultiFilterCount(filterMenu.column) }} sélectionné(s)
            / {{ currentMenuOptions.length }} valeur(s)
          </span>
          <button v-if="activeMultiFilterCount(filterMenu.column) > 0"
            class="text-[11px] font-semibold text-red-500 hover:text-red-700 transition-colors"
            @click="resetMultiFilter(filterMenu.column)">
            Réinitialiser
          </button>
        </div>

      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps({
  data: { type: Array, default: () => [] },
  columns: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  tabLoading: { type: Boolean, default: false },
  selectable: { type: Boolean, default: true },
  itemsPerPageOptions: { type: Array, default: () => [10, 25, 50, 100] },
  defaultItemsPerPage: { type: Number, default: 10 },
  showToolbar: { type: Boolean, default: true },
  showGlobalSearch: { type: Boolean, default: true },
  showAdvancedFiltersToggle: { type: Boolean, default: true },
  showColumnFilters: { type: Boolean, default: true },
  showSorting: { type: Boolean, default: true },
  showMultiSelectFilters: { type: Boolean, default: true },
  showPaginationOptions: { type: Boolean, default: true },
  showPagination: { type: Boolean, default: true },
  showHeader: { type: Boolean, default: true },
  showActions: { type: Boolean, default: true },
  showRowNumbers: { type: Boolean, default: false },
  showColumnInputs: { type: Boolean, default: true },
  showColumnLabels: { type: Boolean, default: true },
  columnInputSize: { type: String, default: null },
  leftAlignedColumns: { type: Array, default: () => [] },
  hideLabelsWhenInput: { type: Boolean, default: false },
  hideLoadingOnColumnFilter: { type: Boolean, default: false },
  // Options pour le menu multi-select en mode externe
  // format: { colKey: [{ value, label }, ...], ... }
  columnFilterOptions: { type: Object, default: () => ({}) },
  defaultActions: {
    type: Array,
    default: () => ['edit', 'delete'],
    validator: v => v.every(a => ['edit', 'delete', 'view', 'download', 'archive', 'assign'].includes(a)),
  },
  actionsLabel: { type: String, default: 'Actions' },
  emptyStateTitle: { type: String, default: 'Aucun résultat' },
  emptyStateText: { type: String, default: "Essayez d'ajuster vos filtres ou votre recherche." },
  defaultSortColumn: { type: String, default: null },
  defaultSortDirection: { type: String, default: 'asc', validator: v => ['asc', 'desc'].includes(v) },
  externalPagination: { type: Boolean, default: false },
  externalTotal: { type: Number, default: 0 },
  externalPage: { type: Number, default: 1 },
  externalLastPage: { type: Number, default: 1 },
  externalPerPage: { type: Number, default: 20 },
  rowClass: { type: [Function, String], default: null },
  periodeDateField:  { type: String,  default: 'date_enreg' }, // champ actif
  periodeDateFrom:   { type: String,  default: '' },
  periodeDateTo:     { type: String,  default: '' },
  showPeriodFilter:  { type: Boolean, default: false },
  showPeriodLoading: { type: Boolean, default: false },
})

const emit = defineEmits([
  'edit', 'delete', 'view', 'download', 'archive', 'assign',
  'open-document', 'selection-change',
  'page-change', 'per-page-change',
  'search-change',
  'column-filter-change',
  'multi-filter-change',
  'period-filter-change',
])

// ── Colonnes visibles ─────────────────────────────────────────────────────
const visibleColumns = computed(() => props.columns.filter(c => c.visible !== false))

// ── Source data ───────────────────────────────────────────────────────────
const sourceData = computed(() => props.data)

// ── Recherche globale ─────────────────────────────────────────────────────
const globalSearch = ref('')

// ── Filtre période ────────────────────────────────────────────────────────
const localPeriodField = ref(props.periodeDateField)
const localPeriodFrom  = ref(props.periodeDateFrom)
const localPeriodTo    = ref(props.periodeDateTo)

const isFullDate = (v) => /^\d{2}\/\d{2}\/\d{4}$/.test(v.trim())

let periodDebounce = null
const onPeriodInput = () => {
  // N'envoie que si les dates saisies sont complètes (ou vides)
  const fromOk = !localPeriodFrom.value || isFullDate(localPeriodFrom.value)
  const toOk   = !localPeriodTo.value   || isFullDate(localPeriodTo.value)
  if (!fromOk || !toOk) return
  clearTimeout(periodDebounce)
  periodDebounce = setTimeout(() => emitPeriod(), 500)
}

const onPeriodChange = () => emitPeriod()

const emitPeriod = () => {
  emit('period-filter-change', {
    field: localPeriodField.value,
    from:  localPeriodFrom.value,
    to:    localPeriodTo.value,
  })
}

const clearPeriod = () => {
  localPeriodFrom.value = ''
  localPeriodTo.value   = ''
  emitPeriod()
}

// Sync si le parent réinitialise les valeurs depuis l'extérieur
watch(() => props.periodeDateFrom, v => { localPeriodFrom.value = v })
watch(() => props.periodeDateTo,   v => { localPeriodTo.value   = v })
watch(() => props.periodeDateField, v => { localPeriodField.value = v })

const showAdvancedFilters = ref(false)

const onGlobalSearchInput = () => { currentPage.value = 1 }

let searchDebounce = null
const onExternalSearchInput = () => {
  clearTimeout(searchDebounce)
  searchDebounce = setTimeout(() => emit('search-change', globalSearch.value), 400)
}

// ── Filtres colonnes input ────────────────────────────────────────────────
const filters = ref(
  props.columns.reduce((acc, col) => ({ ...acc, [col.key]: '' }), {})
)

const activeFiltersCount = computed(() =>
  Object.values(filters.value).filter(v => v !== '').length +
  Object.values(multiSelectFilters.value).filter(v => v.length > 0).length
)

let columnDebounce = null
const onColumnFilterInput = (key) => {
  if (props.externalPagination) {
    clearTimeout(columnDebounce)
    columnDebounce = setTimeout(() => emit('column-filter-change', { ...filters.value }), 400)
  } else {
    currentPage.value = 1
  }
}

// ── Filtres multi-select colonnes ─────────────────────────────────────────
const multiSelectFilters = ref(
  props.columns.reduce((acc, col) => ({ ...acc, [col.key]: [] }), {})
)

const hasActiveMultiFilter = (col) => (multiSelectFilters.value[col]?.length ?? 0) > 0
const activeMultiFilterCount = (col) => multiSelectFilters.value[col]?.length ?? 0

const isOptionChecked = (col, val) => multiSelectFilters.value[col]?.includes(val) ?? false

const toggleMenuOption = (col, val) => {
  if (!multiSelectFilters.value[col]) multiSelectFilters.value[col] = []
  const idx = multiSelectFilters.value[col].indexOf(val)
  if (idx > -1) {
    multiSelectFilters.value[col].splice(idx, 1)
  } else {
    multiSelectFilters.value[col].push(val)
  }
  onMultiFilterChange(col)
}

const resetMultiFilter = (col) => {
  multiSelectFilters.value[col] = []
  onMultiFilterChange(col)
}

const onMultiFilterChange = (col) => {
  if (props.externalPagination) {
    // Émettre vers le serveur
    emit('multi-filter-change', {
      column: col,
      values: [...(multiSelectFilters.value[col] ?? [])],
      all: { ...multiSelectFilters.value },
    })
  } else {
    currentPage.value = 1
  }
}

// ── Options du menu multi-select ──────────────────────────────────────────
// Mode externe : depuis props.columnFilterOptions
// Mode interne : calculé depuis les données
const getColumnOptions = (col) => {
  if (props.externalPagination) {
    return (props.columnFilterOptions[col] || [])
  }
  return [...new Set(sourceData.value.map(i => i[col]))]
    .filter(v => v !== null && v !== undefined && v !== '')
    .map(v => ({ value: v, label: String(v) }))
    .sort((a, b) => a.label.localeCompare(b.label))
}

// ── Menu filtre colonne ───────────────────────────────────────────────────
const filterMenu = ref({ show: false, column: null, style: {} })
const filterMenuSearch = ref('')

const currentMenuOptions = computed(() => {
  if (!filterMenu.value.column) return []
  return getColumnOptions(filterMenu.value.column)
})

const filteredMenuOptions = computed(() => {
  if (!filterMenuSearch.value.trim()) return currentMenuOptions.value
  const q = filterMenuSearch.value.trim().toLowerCase()
  return currentMenuOptions.value.filter(o => String(o.label).toLowerCase().includes(q))
})

const isAllMenuOptionsSelected = computed(() => {
  const col = filterMenu.value.column
  if (!col) return false
  const opts = currentMenuOptions.value
  return opts.length > 0 && opts.every(o => multiSelectFilters.value[col]?.includes(o.value))
})

const isMenuOptionsIndeterminate = computed(() => {
  const col = filterMenu.value.column
  if (!col) return false
  const count = activeMultiFilterCount(col)
  return count > 0 && count < currentMenuOptions.value.length
})

const toggleAllMenuOptions = () => {
  const col = filterMenu.value.column
  if (!col) return
  if (isAllMenuOptionsSelected.value) {
    multiSelectFilters.value[col] = []
  } else {
    multiSelectFilters.value[col] = currentMenuOptions.value.map(o => o.value)
  }
  onMultiFilterChange(col)
}

const openFilterMenu = (event, column) => {
  filterMenuSearch.value = ''
  const btn = event.currentTarget
  const rect = btn.getBoundingClientRect()

  const menuWidth = 288 // w-72
  const spaceBelow = window.innerHeight - rect.bottom
  const spaceAbove = rect.top
  const openUp = spaceBelow < 300 && spaceAbove > spaceBelow

  // Ajuster position horizontale pour ne pas dépasser l'écran
  let left = rect.left
  if (left + menuWidth > window.innerWidth) {
    left = window.innerWidth - menuWidth - 8
  }

  filterMenu.value = {
    show: true,
    column,
    style: {
      left: `${left}px`,
      transformOrigin: openUp ? 'bottom left' : 'top left',
      ...(openUp
        ? { bottom: `${window.innerHeight - rect.top + 4}px`, top: 'auto' }
        : { top: `${rect.bottom + 4}px`, bottom: 'auto' }),
    },
  }
}

const closeFilterMenu = () => {
  filterMenu.value = { show: false, column: null, style: {} }
  filterMenuSearch.value = ''
}

const getColumnLabel = (key) => props.columns.find(c => c.key === key)?.label ?? key

// Recalculer position menu au scroll
// const onScrollResize = () => {
//   if (filterMenu.value.show) {
//     // Recalculer la position sans fermer
//     recalcFilterMenuPosition()
//   }
// }

const recalcFilterMenuPosition = () => {
  // Retrouver le bouton de la colonne active via data-col
  const btn = document.querySelector(`[data-col="${filterMenu.value.column}"]`)
  if (!btn) return

  const rect = btn.getBoundingClientRect()
  const menuWidth = 288
  const spaceBelow = window.innerHeight - rect.bottom
  const spaceAbove = rect.top
  const openUp = spaceBelow < 300 && spaceAbove > spaceBelow

  let left = rect.left
  if (left + menuWidth > window.innerWidth) {
    left = window.innerWidth - menuWidth - 8
  }

  filterMenu.value.style = {
    left: `${left}px`,
    transformOrigin: openUp ? 'bottom left' : 'top left',
    ...(openUp
      ? { bottom: `${window.innerHeight - rect.top + 4}px`, top: 'auto' }
      : { top: `${rect.bottom + 4}px`, bottom: 'auto' }),
  }
}

const dropdownMenuRef = ref(null) // à ajouter sur le div du menu : ref="dropdownMenuRef"

const onWindowScroll = (e) => {
  if (!filterMenu.value.show) return
  // Si le scroll vient du menu interne → ne pas recalculer
  if (dropdownMenuRef.value?.contains(e.target)) return
  recalcFilterMenuPosition()
}

onMounted(() => {
  window.addEventListener('scroll', onWindowScroll, true)
  window.addEventListener('resize', recalcFilterMenuPosition)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onWindowScroll, true)
  window.removeEventListener('resize', recalcFilterMenuPosition)
})

// ── Tri ───────────────────────────────────────────────────────────────────
const sortColumn = ref(props.defaultSortColumn)
const sortDirection = ref(props.defaultSortDirection)

const sortBy = (col) => {
  if (sortColumn.value === col) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = col
    sortDirection.value = 'asc'
  }
}

// ── Sélection lignes ──────────────────────────────────────────────────────
const selectedRows = ref([])
const isAllSelected = computed(() => paginatedData.value.length > 0 && selectedRows.value.length === paginatedData.value.length)
const isIndeterminate = computed(() => selectedRows.value.length > 0 && selectedRows.value.length < paginatedData.value.length)

const toggleSelectAll = () => { isAllSelected.value ? selectedRows.value = [] : selectedRows.value = paginatedData.value.map(i => i.id) }
const toggleRowSelect = (id) => { const i = selectedRows.value.indexOf(id); i > -1 ? selectedRows.value.splice(i, 1) : selectedRows.value.push(id) }

watch(selectedRows, val => emit('selection-change', [...val]), { deep: true })

// ── Pagination ────────────────────────────────────────────────────────────
const currentPage = ref(props.externalPagination ? props.externalPage : 1)
const localItemsPerPage = ref(props.defaultItemsPerPage)

watch(() => props.externalPage, (val) => { if (props.externalPagination) currentPage.value = val })

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
  const cur = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = [1]
  if (cur > 3) pages.push('...')
  const start = Math.max(2, cur - 1)
  const end = Math.min(total - 1, cur + 1)
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

// ── Loading ───────────────────────────────────────────────────────────────
const showLoading = computed(() => {
  if (props.showPeriodLoading) return true          // période → toujours afficher
  if (props.hideLoadingOnColumnFilter) return false // archives → jamais afficher
  return props.loading
})

// ── Données filtrées (mode interne uniquement) ────────────────────────────
const filteredData = computed(() => {
  if (props.externalPagination) return sourceData.value

  let data = sourceData.value

  if (globalSearch.value) {
    const q = globalSearch.value.toLowerCase()
    data = data.filter(item => Object.values(item).some(v => String(v).toLowerCase().includes(q)))
  }

  Object.entries(multiSelectFilters.value).forEach(([col, vals]) => {
    if (vals.length > 0) data = data.filter(item => vals.includes(item[col]))
  })

  Object.entries(filters.value).forEach(([key, val]) => {
    if (val) data = data.filter(item => String(item[key] ?? '').toLowerCase().includes(val.toLowerCase()))
  })

  return data
})

const sortedData = computed(() => {
  const data = [...filteredData.value]
  if (!sortColumn.value) return data
  return data.sort((a, b) => {
    let aV = a[sortColumn.value], bV = b[sortColumn.value]
    if (typeof aV === 'string') { aV = aV.toLowerCase(); bV = (bV ?? '').toLowerCase() }
    const cmp = aV > bV ? 1 : aV < bV ? -1 : 0
    return sortDirection.value === 'asc' ? cmp : -cmp
  })
})

watch(filteredData, () => {
  if (!props.externalPagination && currentPage.value > totalPages.value) currentPage.value = 1
})

// ── UI helpers ────────────────────────────────────────────────────────────
const rowClass = (item, i) => {
  if (!props.rowClass) return ''
  return typeof props.rowClass === 'function'
    ? props.rowClass(item, i) || ''
    : String(props.rowClass)
}

const rowBg = (id, i) => props.rowClass ? '' : selectedRows.value.includes(id) ? 'bg-indigo-50 hover:bg-indigo-100' : i % 2 === 0 ? 'bg-white hover:bg-indigo-50' : 'bg-slate-50 hover:bg-indigo-50'
const stickyBg = (id, i) => props.rowClass ? '' : selectedRows.value.includes(id) ? 'bg-indigo-50 group-hover:bg-indigo-100' : i % 2 === 0 ? 'bg-white group-hover:bg-indigo-50' : 'bg-slate-50 group-hover:bg-indigo-50'

const getInputContainerWidth = (col) => {
  if (col.inputWidth) return `width: ${col.inputWidth}`
  if (props.columnInputSize) return `width: ${props.columnInputSize}`
  return 'width: 100%'
}
const getInputStyle = (col) => {
  if (col.inputWidth) return `width: ${col.inputWidth}`
  if (props.columnInputSize) return 'width: 100%'
  const text = col.inputPlaceholder ?? col.label ?? ''
  const width = Math.max(60, text.length * 7 + 24)
  return `width: ${width}px`
}
const shouldShowLabel = (col) => {
  if (props.hideLabelsWhenInput) return col.inputHidden === true || col.filterable === false
  return props.showColumnLabels && col.showLabel !== false
}
const getCellAlignment = (key) => props.leftAlignedColumns.includes(key) ? 'text-left' : 'text-center'

defineExpose({ selectedRows, filters, multiSelectFilters, currentPage, showAdvancedFilters })
</script>

<style>
.scrollbar-thin::-webkit-scrollbar {
  height: 2px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #c7d2fe;
  border-radius: 2px;
}

@keyframes progress {
  0% {
    width: 0%;
    margin-left: 0;
  }

  50% {
    width: 60%;
    margin-left: 20%;
  }

  100% {
    width: 0%;
    margin-left: 100%;
  }
}

.animate-progress {
  animation: progress 1s ease-in-out infinite;
}
</style>