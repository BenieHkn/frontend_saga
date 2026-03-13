<template>
  <div class="min-h-screen bg-slate-50 p-6 font-sans">
    <div class="mx-auto">

      <PageHeader title="Préarchivage" subtitle="Gestion des archives" />

      <div class="mb-8">
        <ToggleButton v-model="currentFilter" :options="filterOptions" />
      </div>

      <!-- Loader premier chargement -->
      <div v-if="initialLoading" class="flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
        <div class="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <span class="text-sm font-medium">Chargement des archives...</span>
      </div>

      <!-- Erreur -->
      <div v-else-if="error"
        class="flex items-center gap-4 p-5 bg-red-50 border border-red-200 rounded-xl">
        <svg class="w-8 h-8 text-red-600 shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd" />
        </svg>
        <div class="flex-1">
          <p class="text-sm font-bold text-red-900">Erreur de chargement</p>
          <p class="text-xs text-red-700">{{ error }}</p>
        </div>
        <button
          class="px-4 py-2 text-xs font-bold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors shrink-0"
          @click="refresh(currentPage, perPage, false)">
          Réessayer
        </button>
      </div>

      <!-- DataTable -->
      <DataTablePaginate
        v-else
        :loading="loading"
        :tab-loading="tabLoading"
        :hide-loading-on-column-filter="true"
        :data="documents"
        :columns="columns"
        :selectable="false"
        :default-sort-column="null"
        :show-row-numbers="true"
        :show-actions="true"
        :default-actions="[]"
        :items-per-page-options="[10, 20, 50, 100]"
        :default-items-per-page="10"
        :left-aligned-columns="['reference', 'objet', 'numero_enreg']"
        :hide-labels-when-input="true"
        :external-pagination="true"
        :external-total="total"
        :external-page="currentPage"
        :external-last-page="totalPages"
        :external-per-page="perPage"
        :column-filter-options="columnFilterOptions"
        @multi-filter-change="onMultiFilterChange"
        @search-change="onSearchChange"
        @page-change="onPageChange"
        @per-page-change="onPerPageChange"
        @column-filter-change="onColumnFilterChange">

        <!-- ── Filtres avancés ──────────────────────────────── -->
        <template #advanced-filters>
          <div class="space-y-4">
            <div class="flex flex-wrap gap-3">
              <div class="flex-1 min-w-[120px]">
                <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">N° d'enreg.</label>
                <input v-model="searchFilters.numero_enreg" placeholder="Filtrer..."
                  class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  @input="onFiltersChange" />
              </div>
              <div class="flex-1 min-w-[120px]">
                <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Référence</label>
                <input v-model="searchFilters.reference" placeholder="Filtrer..."
                  class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  @input="onFiltersChange" />
              </div>
              <div class="flex-1 min-w-[160px]">
                <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Objet</label>
                <input v-model="searchFilters.objet" placeholder="Filtrer..."
                  class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  @input="onFiltersChange" />
              </div>
              <div class="flex-1 min-w-[150px]">
                <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Date d'enreg. (jj/mm/aaaa)</label>
                <input v-model="searchFilters.date_enreg" placeholder="ex: 15/03/2022"
                  class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  @input="onFiltersChange" />
              </div>
              <div class="flex-1 min-w-[150px]">
                <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Date courrier (jj/mm/aaaa)</label>
                <input v-model="searchFilters.date_courrier" placeholder="ex: 15/03/2022"
                  class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  @input="onFiltersChange" />
              </div>
            </div>
            <div class="flex flex-wrap gap-3">
              <div class="flex-1 min-w-[140px]">
                <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Type</label>
                <SearchableSelect v-model="searchFilters.type"
                  :options="[{ value: 'arrive', label: 'Arrivé' }, { value: 'depart', label: 'Départ' }]"
                  placeholder="Tous" @change="onFiltersChange" />
              </div>
              <div class="flex-1 min-w-[180px]">
                <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Type de document</label>
                <SearchableSelect v-model="searchFilters.type_document_id"
                  :options="filterOptionsData.types_document.map(t => ({ value: t.id, label: `${t.code} — ${t.libelle}` }))"
                  placeholder="Tous" @change="onFiltersChange" />
              </div>
              <div class="flex-1 min-w-[160px]">
                <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Confidentialité</label>
                <SearchableSelect v-model="searchFilters.confidentiel"
                  :options="[{ value: 'false', label: 'Non confidentiel' }, { value: 'true', label: 'Confidentiel' }]"
                  placeholder="Tous" @change="onFiltersChange" />
              </div>
            </div>
            <div v-if="searchFilters.type !== 'depart'" class="flex flex-wrap gap-3">
              <p class="w-full text-[11px] font-bold text-indigo-500 uppercase tracking-wider flex items-center gap-1">
                <Icon name="i-heroicons-inbox-arrow-down" class="w-3 h-3" /> Courrier arrivé
              </p>
              <div class="flex-1 min-w-[140px]">
                <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Type d'arrivée</label>
                <SearchableSelect v-model="searchFilters.type_arrivee"
                  :options="filterOptionsData.types_arrivee.map(t => ({ value: t, label: t }))"
                  placeholder="Tous" @change="onFiltersChange" />
              </div>
              <div class="flex-1 min-w-[140px]">
                <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Service enregistrement</label>
                <SearchableSelect v-model="searchFilters.service_enreg"
                  :options="filterOptionsData.services_enreg.map(s => ({ value: s, label: s }))"
                  placeholder="Tous" @change="onFiltersChange" />
              </div>
              <div class="flex-1 min-w-[160px]">
                <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Structure / Expéditeur</label>
                <SearchableSelect v-model="searchFilters.structure"
                  :options="filterOptionsData.structures.map(s => ({ value: s, label: s }))"
                  placeholder="Tous" @change="onFiltersChange" />
              </div>
              <div class="flex-1 min-w-[140px]">
                <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Priorité</label>
                <SearchableSelect v-model="searchFilters.priority"
                  :options="filterOptionsData.priorities.map(p => ({ value: p, label: p }))"
                  placeholder="Toutes" @change="onFiltersChange" />
              </div>
            </div>
            <div v-if="searchFilters.type !== 'arrive'" class="flex flex-wrap gap-3">
              <p class="w-full text-[11px] font-bold text-orange-500 uppercase tracking-wider flex items-center gap-1">
                <Icon name="i-heroicons-paper-airplane" class="w-3 h-3" /> Courrier départ
              </p>
              <div class="flex-1 min-w-[140px]">
                <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Service émetteur</label>
                <SearchableSelect v-model="searchFilters.service_emis"
                  :options="filterOptionsData.services_emis.map(s => ({ value: s, label: s }))"
                  placeholder="Tous" @change="onFiltersChange" />
              </div>
              <div class="flex-1 min-w-[160px]">
                <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Destinataire</label>
                <SearchableSelect v-model="searchFilters.destinataire"
                  :options="filterOptionsData.destinataires.map(d => ({ value: d, label: d }))"
                  placeholder="Tous" @change="onFiltersChange" />
              </div>
            </div>
            <div v-if="hasActiveFilters" class="flex justify-end">
              <button @click="resetFilters"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-all">
                <Icon name="i-heroicons-x-mark" class="w-3.5 h-3.5" /> Réinitialiser les filtres
              </button>
            </div>
          </div>
        </template>

        <!-- ── Colonne Type ──────────────────────────────────── -->
        <template #cell-type="{ value }">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-full border uppercase whitespace-nowrap"
            :class="{
              'bg-indigo-50 text-indigo-700 border-indigo-100': value === 'arrive',
              'bg-orange-50 text-orange-700 border-orange-100': value === 'depart',
            }">
            <Icon :name="value === 'arrive' ? 'i-heroicons-inbox-arrow-down' : 'i-heroicons-paper-airplane'" class="w-3 h-3 shrink-0" />
            {{ value === 'arrive' ? 'Arrivé' : 'Départ' }}
          </span>
        </template>

        <!-- ── Référence → popup PDF léger ──────────────────── -->
        <template #cell-reference="{ value, item }">
          <button v-if="item.url" @click="onViewItem(item)"
            class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-all group max-w-[180px]"
            :title="`Ouvrir ${value}`">
            <Icon name="i-heroicons-document-text" class="w-3.5 h-3.5 shrink-0 group-hover:scale-110 transition-transform" />
            <span class="break-words whitespace-normal min-w-0">{{ value }}</span>
            <Icon name="i-heroicons-arrow-top-right-on-square" class="w-3 h-3 shrink-0 opacity-60 group-hover:opacity-100" />
          </button>
          <span v-else class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md max-w-[180px]">
            <Icon name="i-heroicons-document-text" class="w-3.5 h-3.5 shrink-0 opacity-50" />
            <span class="break-words whitespace-normal min-w-0">{{ value || '—' }}</span>
          </span>
        </template>

        <!-- ── Objet ─────────────────────────────────────────── -->
        <template #cell-objet="{ value }">
          <span class="block text-xs text-slate-800 leading-relaxed whitespace-normal break-words" :title="value">
            {{ value || '—' }}
          </span>
        </template>

        <!-- ── Durée ─────────────────────────────────────────── -->
        <template #cell-duree="{ item }">
          <span class="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-full border whitespace-nowrap"
            :class="{
              'bg-red-50 text-red-700 border-red-200':       item.duree_annees >= 3,
              'bg-amber-50 text-amber-700 border-amber-200': item.duree_annees >= 1 && item.duree_annees < 3,
            }">
            <Icon name="i-heroicons-clock" class="w-3 h-3 shrink-0" />
            {{ formatDuree(item.duree_annees) }}
          </span>
        </template>

        <!-- ── Actions (icône œil → modal détails) ──────────── -->
        <template #actions="{ item }">
          <div class="flex items-center justify-center gap-1">
            <UButton size="xs" color="blue" variant="ghost"
              icon="i-heroicons-eye" title="Voir les détails"
              @click="onViewItem(item)" />
          </div>
        </template>

      </DataTablePaginate>
    </div>

    <!-- ══════════════════════════════════════════════════════════════════ -->
    <!-- POPUP PDF LÉGER (clic référence)                                   -->
    <!-- ══════════════════════════════════════════════════════════════════ -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="pdfPopupOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        @click.self="closePdfPopup">

        <Transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100">
          <div v-if="pdfPopupOpen"
            class="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style="width: min(860px, 95vw); height: min(90vh, 860px);">

            <!-- Header popup -->
            <div class="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50 shrink-0">
              <div class="flex items-center gap-2 min-w-0">
                <Icon name="i-heroicons-document-text" class="w-4 h-4 text-slate-500 shrink-0" />
                <span class="text-xs font-bold text-slate-700 truncate">{{ pdfPopupItem?.reference || '—' }}</span>
                <span class="text-[11px] text-slate-400 font-mono truncate hidden sm:block">{{ pdfPopupItem?.url }}</span>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <button
                  v-if="pdfPopupBlobUrl"
                  @click="openPdfInTab"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-all">
                  <Icon name="i-heroicons-arrow-top-right-on-square" class="w-3.5 h-3.5" />
                  Ouvrir dans un onglet
                </button>
                <button @click="closePdfPopup"
                  class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-200 transition-colors text-slate-400">
                  <Icon name="i-heroicons-x-mark" class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Corps popup — PDF ou zone vide pendant chargement -->
            <div class="flex-1 min-h-0 bg-slate-100">
              <!-- Zone vide pendant le chargement (pas de spinner) -->
              <div v-if="!pdfPopupLoaded && !pdfPopupError" class="w-full h-full" />

              <!-- Erreur -->
              <div v-else-if="pdfPopupError"
                class="w-full h-full flex flex-col items-center justify-center gap-3 text-slate-400">
                <Icon name="i-heroicons-exclamation-triangle" class="w-12 h-12 text-red-300" />
                <p class="text-xs font-medium text-red-500">{{ pdfPopupError }}</p>
                <button @click="pdfPopupError = ''; loadPdfPopup(pdfPopupItem)"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-all">
                  <Icon name="i-heroicons-arrow-path" class="w-3.5 h-3.5" />
                  Réessayer
                </button>
              </div>

              <!-- PDF -->
              <iframe v-else-if="pdfPopupLoaded"
                :src="pdfPopupUrl"
                class="w-full h-full border-0"
                title="Prévisualisation PDF" />
            </div>

          </div>
        </Transition>
      </div>
    </Transition>

    <!-- ══════════════════════════════════════════════════════════════════ -->
    <!-- MODAL DÉTAILS COMPLÈTE (icône œil)                                 -->
    <!-- ══════════════════════════════════════════════════════════════════ -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="modalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="closeModal">

        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-2"
          enter-to-class="opacity-100 scale-100 translate-y-0">
          <div v-if="modalOpen"
            class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">

            <!-- Header modal -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-indigo-50">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl flex items-center justify-center"
                  :class="selectedItem?.type === 'arrive' ? 'bg-indigo-100' : 'bg-orange-100'">
                  <Icon
                    :name="selectedItem?.type === 'arrive' ? 'i-heroicons-inbox-arrow-down' : 'i-heroicons-paper-airplane'"
                    class="w-5 h-5"
                    :class="selectedItem?.type === 'arrive' ? 'text-indigo-600' : 'text-orange-600'" />
                </div>
                <div>
                  <p class="text-sm font-bold text-slate-800">
                    {{ selectedItem?.type === 'arrive' ? 'Courrier arrivé' : 'Courrier départ' }} — Détails
                  </p>
                  <p class="text-xs text-slate-500 font-mono">{{ selectedItem?.reference || '—' }}</p>
                </div>
              </div>
              <button @click="closeModal"
                class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200 transition-colors text-slate-500">
                <Icon name="i-heroicons-x-mark" class="w-5 h-5" />
              </button>
            </div>

            <!-- Corps modal -->
            <div class="flex-1 overflow-y-auto px-6 py-5 space-y-6">

              <!-- Badges -->
              <div class="flex flex-wrap items-center gap-2">
                <span class="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-full border uppercase whitespace-nowrap"
                  :class="{
                    'bg-red-50 text-red-700 border-red-200':       selectedItem?.statut === 'archived',
                    'bg-amber-50 text-amber-700 border-amber-200': selectedItem?.statut === 'pending',
                  }">
                  <Icon :name="selectedItem?.statut === 'archived' ? 'i-heroicons-archive-box' : 'i-heroicons-archive-box-arrow-down'" class="w-3.5 h-3.5 shrink-0" />
                  {{ selectedItem?.statut === 'archived' ? 'Archivé' : 'Préarchivé' }}
                </span>
                <span class="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-full border whitespace-nowrap"
                  :class="{
                    'bg-red-50 text-red-700 border-red-200':       selectedItem?.duree_annees >= 3,
                    'bg-amber-50 text-amber-700 border-amber-200': selectedItem?.duree_annees >= 1,
                  }">
                  <Icon name="i-heroicons-clock" class="w-3.5 h-3.5 shrink-0" />
                  {{ formatDuree(selectedItem?.duree_annees) }}
                </span>
                <span class="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-full border uppercase whitespace-nowrap"
                  :class="{
                    'bg-indigo-50 text-indigo-700 border-indigo-100': selectedItem?.type === 'arrive',
                    'bg-orange-50 text-orange-700 border-orange-100': selectedItem?.type === 'depart',
                  }">
                  <Icon :name="selectedItem?.type === 'arrive' ? 'i-heroicons-inbox-arrow-down' : 'i-heroicons-paper-airplane'" class="w-3.5 h-3.5 shrink-0" />
                  {{ selectedItem?.type === 'arrive' ? 'Arrivé' : 'Départ' }}
                </span>
              </div>

              <!-- Informations générales -->
              <div>
                <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Informations générales</p>
                <div class="grid grid-cols-2 gap-3">
                  <div class="bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">N° d'enregistrement</p>
                    <p class="text-xs font-semibold text-slate-800">{{ selectedItem?.numero_enreg || '—' }}</p>
                  </div>
                  <div class="bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Référence</p>
                    <p class="text-xs font-semibold text-slate-800 break-words">{{ selectedItem?.reference || '—' }}</p>
                  </div>
                  <div class="bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date d'enregistrement</p>
                    <p class="text-xs font-semibold text-slate-800">{{ selectedItem?.date_enreg || '—' }}</p>
                  </div>
                  <div class="bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date du courrier</p>
                    <p class="text-xs font-semibold text-slate-800">{{ selectedItem?.date_courrier || '—' }}</p>
                  </div>
                  <div class="col-span-2 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Objet</p>
                    <p class="text-xs font-semibold text-slate-800 leading-relaxed">{{ selectedItem?.objet || '—' }}</p>
                  </div>
                  <div class="bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Type de document</p>
                    <p class="text-xs font-semibold text-slate-800">
                      {{ selectedItem?.type_document?.code ? `${selectedItem.type_document.code} — ${selectedItem.type_document.libelle}` : '—' }}
                    </p>
                  </div>
                  <div class="bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Confidentialité</p>
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold rounded-full"
                      :class="selectedItem?._raw?.details?.confidentiel
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-green-50 text-green-700 border border-green-200'">
                      <Icon :name="selectedItem?._raw?.details?.confidentiel ? 'i-heroicons-lock-closed' : 'i-heroicons-lock-open'" class="w-3 h-3" />
                      {{ selectedItem?._raw?.details?.confidentiel ? 'Confidentiel' : 'Non confidentiel' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Détails arrivée -->
              <div v-if="selectedItem?.type === 'arrive' && selectedItem?._raw?.details">
                <p class="text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                  <Icon name="i-heroicons-inbox-arrow-down" class="w-3 h-3" /> Détails — Courrier arrivé
                </p>
                <div class="grid grid-cols-2 gap-3">
                  <div class="bg-indigo-50 rounded-xl px-4 py-3 border border-indigo-100">
                    <p class="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Type d'arrivée</p>
                    <p class="text-xs font-semibold text-indigo-800">{{ selectedItem._raw.details.type_arrivee || '—' }}</p>
                  </div>
                  <div class="bg-indigo-50 rounded-xl px-4 py-3 border border-indigo-100">
                    <p class="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Service enregistrement</p>
                    <p class="text-xs font-semibold text-indigo-800">{{ selectedItem._raw.details.service_enreg || '—' }}</p>
                  </div>
                  <div class="bg-indigo-50 rounded-xl px-4 py-3 border border-indigo-100">
                    <p class="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Structure / Expéditeur</p>
                    <p class="text-xs font-semibold text-indigo-800">{{ selectedItem._raw.details.structure || '—' }}</p>
                  </div>
                  <div class="bg-indigo-50 rounded-xl px-4 py-3 border border-indigo-100">
                    <p class="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Priorité</p>
                    <p class="text-xs font-semibold text-indigo-800">{{ selectedItem._raw.details.priority || '—' }}</p>
                  </div>
                  <div v-if="selectedItem._raw.details.num_cab" class="bg-indigo-50 rounded-xl px-4 py-3 border border-indigo-100">
                    <p class="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">N° Cabinet</p>
                    <p class="text-xs font-semibold text-indigo-800">{{ selectedItem._raw.details.num_cab }}</p>
                  </div>
                  <div v-if="selectedItem._raw.details.date_cab" class="bg-indigo-50 rounded-xl px-4 py-3 border border-indigo-100">
                    <p class="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Date Cabinet</p>
                    <p class="text-xs font-semibold text-indigo-800">{{ formatDate(selectedItem._raw.details.date_cab) }}</p>
                  </div>
                  <div v-if="selectedItem._raw.details.num_sgm" class="bg-indigo-50 rounded-xl px-4 py-3 border border-indigo-100">
                    <p class="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">N° SGM</p>
                    <p class="text-xs font-semibold text-indigo-800">{{ selectedItem._raw.details.num_sgm }}</p>
                  </div>
                  <div v-if="selectedItem._raw.details.autre_structure" class="bg-indigo-50 rounded-xl px-4 py-3 border border-indigo-100">
                    <p class="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Autre structure</p>
                    <p class="text-xs font-semibold text-indigo-800">{{ selectedItem._raw.details.autre_structure }}</p>
                  </div>
                </div>
              </div>

              <!-- Détails départ -->
              <div v-if="selectedItem?.type === 'depart' && selectedItem?._raw?.details">
                <p class="text-[11px] font-bold text-orange-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                  <Icon name="i-heroicons-paper-airplane" class="w-3 h-3" /> Détails — Courrier départ
                </p>
                <div class="grid grid-cols-2 gap-3">
                  <div class="bg-orange-50 rounded-xl px-4 py-3 border border-orange-100">
                    <p class="text-[10px] font-bold text-orange-400 uppercase tracking-wider mb-1">Service émetteur</p>
                    <p class="text-xs font-semibold text-orange-800">{{ selectedItem._raw.details.service_emis || '—' }}</p>
                  </div>
                  <div class="bg-orange-50 rounded-xl px-4 py-3 border border-orange-100">
                    <p class="text-[10px] font-bold text-orange-400 uppercase tracking-wider mb-1">Destinataire</p>
                    <p class="text-xs font-semibold text-orange-800">{{ selectedItem._raw.details.destinataire || '—' }}</p>
                  </div>
                  <div class="bg-orange-50 rounded-xl px-4 py-3 border border-orange-100">
                    <p class="text-[10px] font-bold text-orange-400 uppercase tracking-wider mb-1">Date de départ</p>
                    <p class="text-xs font-semibold text-orange-800">
                      {{ selectedItem._raw.details.date_depart ? formatDate(selectedItem._raw.details.date_depart) : '—' }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- ── Section PDF dans la modal détails ──────── -->
              <div class="border border-slate-200 rounded-xl overflow-hidden">
                <div class="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                  <div class="flex items-center gap-2">
                    <Icon name="i-heroicons-paper-clip" class="w-4 h-4 text-slate-500" />
                    <span class="text-xs font-bold text-slate-600">Fichier joint</span>
                    <span v-if="selectedItem?.url" class="text-[11px] text-slate-400 font-mono truncate max-w-[200px]">
                      {{ selectedItem.url }}
                    </span>
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      v-if="!fileLoaded && !fileLoadingModal && selectedItem?.url"
                      @click="loadFile"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-all">
                      <Icon name="i-heroicons-arrow-down-tray" class="w-3.5 h-3.5" />
                      Charger le fichier
                    </button>
                    <!-- Rien affiché pendant le chargement (fileLoadingModal) -->
                    <button
                      v-if="fileLoaded && currentBlobUrl"
                      @click="openBlobInTab"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-all">
                      <Icon name="i-heroicons-arrow-top-right-on-square" class="w-3.5 h-3.5" />
                      Ouvrir dans un onglet
                    </button>
                  </div>
                </div>
                <div class="bg-slate-50" :class="fileLoaded ? '' : 'min-h-[120px] flex items-center justify-center'">
                  <!-- Pas encore chargé -->
                  <div v-if="!fileLoaded && !fileError && selectedItem?.url"
                    class="flex flex-col items-center gap-2 text-slate-400 py-8">
                    <Icon name="i-heroicons-document-text" class="w-10 h-10 text-slate-300" />
                  </div>
                  <!-- Aucun fichier -->
                  <div v-else-if="!selectedItem?.url"
                    class="flex flex-col items-center gap-2 text-slate-400 py-8">
                    <Icon name="i-heroicons-document-minus" class="w-10 h-10 text-slate-300" />
                    <p class="text-xs font-medium">Aucun fichier disponible</p>
                  </div>
                  <!-- Zone vide pendant chargement silencieux -->
                  <div v-else-if="!fileLoaded && !fileError" class="w-full h-24" />
                  <!-- Erreur -->
                  <div v-else-if="fileError"
                    class="flex flex-col items-center gap-2 text-slate-400 py-8">
                    <Icon name="i-heroicons-exclamation-triangle" class="w-10 h-10 text-red-300" />
                    <p class="text-xs font-medium text-red-500">{{ fileError }}</p>
                    <button @click="fileError = ''; loadFile()"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-all">
                      <Icon name="i-heroicons-arrow-path" class="w-3.5 h-3.5" /> Réessayer
                    </button>
                  </div>
                  <!-- PDF -->
                  <iframe v-else-if="fileLoaded"
                    :src="fileUrl" class="w-full h-[500px] border-0" title="Prévisualisation PDF" />
                </div>
              </div>

            </div>

            <!-- Footer modal -->
            <div class="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button @click="closeModal"
                class="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors">
                Fermer
              </button>
            </div>

          </div>
        </Transition>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import DataTablePaginate from '~/components/DataTablePaginate.vue'
import SearchableSelect from '~/components/SearchableSelect.vue'

const config = useRuntimeConfig()

// ── Toggle pending / archived ─────────────────────────────────────────────
const currentFilter = ref('pending')
const filterOptions = [
  { label: 'En préarchivage',     value: 'pending'  },
  { label: 'Toutes les Archives', value: 'archived' },
]

// ── État table ────────────────────────────────────────────────────────────
const documents      = ref([])
const loading        = ref(false)
const tabLoading     = ref(false)
const initialLoading = ref(false)
const error          = ref(null)
const currentPage    = ref(1)
const totalPages     = ref(1)
const total          = ref(0)
const perPage        = ref(10)

// ── Options menu multi-select colonnes ────────────────────────────────────
const columnFilterOptions = computed(() => ({
  type: [
    { value: 'arrive', label: 'Arrivé' },
    { value: 'depart', label: 'Départ' },
  ],
  numero_enreg: [...new Set(documents.value.map(d => d.numero_enreg).filter(v => v && v !== '—'))].map(v => ({ value: v, label: v })),
  reference:    [...new Set(documents.value.map(d => d.reference).filter(v => v && v !== '—'))].map(v => ({ value: v, label: v })),
  objet:        [...new Set(documents.value.map(d => d.objet).filter(v => v && v !== '—'))].map(v => ({ value: v, label: v })),
}))

const multiFilters = ref({})
const onMultiFilterChange = ({ all }) => {
  multiFilters.value = { ...all }
  currentPage.value  = 1
  refresh(1, perPage.value, false)
}

// ── Options filtres avancés ───────────────────────────────────────────────
const filterOptionsData = ref({
  types_document: [], types_arrivee: [], services_enreg: [],
  structures: [], priorities: [], types_depart: [], services_emis: [], destinataires: [],
})

const defaultFilters = () => ({
  search: '', numero_enreg: '', reference: '', objet: '',
  date_enreg: '', date_courrier: '', type: '', type_document_id: '',
  confidentiel: '', type_arrivee: '', service_enreg: '', structure: '',
  priority: '', type_depart: '', service_emis: '', destinataire: '',
})

const searchFilters    = ref(defaultFilters())
const hasActiveFilters = computed(() => Object.values(searchFilters.value).some(v => v !== ''))

const resetFilters = () => {
  searchFilters.value = defaultFilters()
  columnFilters.value = {}
  multiFilters.value  = {}
  currentPage.value   = 1
  refresh(1, perPage.value, false)
}

const columnFilters = ref({})
let columnFilterTimeout = null
const onColumnFilterChange = (val) => {
  columnFilters.value = { ...val }
  clearTimeout(columnFilterTimeout)
  columnFilterTimeout = setTimeout(() => { currentPage.value = 1; refresh(1, perPage.value, false) }, 400)
}

const columns = [
  { key: 'numero_enreg', label: "N° d'enreg.", visible: true },
  { key: 'reference',    label: 'Référence',    visible: true },
  { key: 'objet',        label: 'Objet',        visible: true },
  { key: 'date_enreg',   label: "Date d'enreg.", visible: true },
  { key: 'type',         label: 'Type',         visible: true,  filterable: false },
  { key: 'duree',        label: 'Durée',        visible: true,  filterable: false },
  { key: 'url',          label: 'Document',     visible: false },
]

// ── État popup PDF léger ──────────────────────────────────────────────────
const pdfPopupOpen    = ref(false)
const pdfPopupItem    = ref(null)
const pdfPopupLoaded  = ref(false)
const pdfPopupError   = ref('')
const pdfPopupUrl     = ref('')
const pdfPopupBlobUrl = ref('')

const loadPdfPopup = async (item) => {
  try {
    const { blob } = await fetchFileAsBlob(item)
    const blobUrl  = URL.createObjectURL(blob)
    pdfPopupBlobUrl.value = blobUrl
    pdfPopupUrl.value     = blobUrl
    pdfPopupLoaded.value  = true
  } catch (err) {
    console.error('❌ Erreur chargement PDF popup:', err)
    pdfPopupError.value = err.message || 'Erreur lors du chargement'
  }
}

const openPdfInTab = () => {
  if (pdfPopupBlobUrl.value) window.open(pdfPopupBlobUrl.value, '_blank', 'noopener,noreferrer')
}

const closePdfPopup = () => {
  pdfPopupOpen.value = false
  if (pdfPopupBlobUrl.value) { URL.revokeObjectURL(pdfPopupBlobUrl.value); pdfPopupBlobUrl.value = '' }
  pdfPopupItem.value   = null
  pdfPopupLoaded.value = false
  pdfPopupError.value  = ''
  pdfPopupUrl.value    = ''
}

// ── État modal détails ────────────────────────────────────────────────────
const modalOpen      = ref(false)
const selectedItem   = ref(null)
const fileLoaded     = ref(false)
const fileError      = ref('')
const fileUrl        = ref('')
const currentBlobUrl = ref('')

const onViewItem = (item) => {
  if (currentBlobUrl.value) { URL.revokeObjectURL(currentBlobUrl.value); currentBlobUrl.value = '' }
  selectedItem.value = item
  fileLoaded.value   = false
  fileError.value    = ''
  fileUrl.value      = ''
  modalOpen.value    = true
  fileLoadingModal.value = false
}

const closeModal = () => {
  if (currentBlobUrl.value) { URL.revokeObjectURL(currentBlobUrl.value); currentBlobUrl.value = '' }
  modalOpen.value    = false
  selectedItem.value = null
  fileLoaded.value   = false
  fileError.value    = ''
  fileUrl.value      = ''
  fileLoadingModal.value = false
}

// Chargement PDF dans la modal détails (bouton manuel)
const fileLoadingModal = ref(false)

const loadFile = async () => {
  if (!selectedItem.value?.url) return
  fileLoadingModal.value = true   // bouton disparaît
  fileLoaded.value  = false
  fileError.value   = ''
  fileUrl.value     = ''
  if (currentBlobUrl.value) { URL.revokeObjectURL(currentBlobUrl.value); currentBlobUrl.value = '' }
  try {
    const { blob } = await fetchFileAsBlob(selectedItem.value)
    const blobUrl  = URL.createObjectURL(blob)
    currentBlobUrl.value = blobUrl
    fileUrl.value        = blobUrl
    fileLoaded.value     = true
  } catch (err) {
    console.error('❌ Erreur chargement fichier:', err)
    fileError.value = err.message || 'Erreur lors du chargement'
  } finally {
    fileLoadingModal.value = false
  }
}

const openBlobInTab = () => {
  if (currentBlobUrl.value) window.open(currentBlobUrl.value, '_blank', 'noopener,noreferrer')
}

// ── Utilitaires ───────────────────────────────────────────────────────────
const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
const formatDuree = (annees) => {
  if (annees === null || annees === undefined) return '—'
  if (annees === 0) return '< 1 an'
  return `${annees} an${annees > 1 ? 's' : ''}`
}

const buildDocumentUrl = (item) => {
  if (!item?.url) return null
  const base = config.public.apiBase.replace(/\/$/, '')
  const raw  = item.date_enreg_raw
  if (!raw) return `${base}/file/documents/${item.url}`
  const d     = new Date(raw)
  const year  = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day   = String(d.getDate()).padStart(2, '0')
  return `${base}/file/documents/${year}/${month}/${day}/${item.url}`
}

const fetchFileAsBlob = async (item) => {
  const url = buildDocumentUrl(item)
  if (!url) throw new Error('URL du fichier introuvable')
  const authToken = localStorage.getItem('auth_token') || ''
  const response  = await fetch(url, { headers: { Authorization: `Bearer ${authToken}` } })
  if (!response.ok) throw new Error(`Erreur ${response.status} — fichier non accessible`)
  const blob = await response.blob()
  return { blob }
}

// ── Transform documents ───────────────────────────────────────────────────
const transformDocuments = (response) => {
  if (!response?.data) throw new Error('Format de réponse API invalide')
  return response.data.map((doc) => ({
    id:             doc.id,
    numero_enreg:   doc.numero_enreg  || '—',
    reference:      doc.reference     || '—',
    objet:          doc.objet         || '—',
    date_enreg:     formatDate(doc.date_enreg),
    date_enreg_raw: doc.date_enreg,
    date_courrier:  formatDate(doc.date_courrier),
    type:           doc.type          || '—',
    type_document:  doc.type_document || null,
    statut:         doc.statut        || null,
    duree_mois:     doc.duree_mois    ?? 0,
    duree_annees:   doc.duree_annees  ?? 0,
    url:            doc.url && doc.url !== 'Inconnu' ? doc.url : '',
    _raw:           doc,
  }))
}

// ── Chargement options filtres ────────────────────────────────────────────
const loadFilterOptions = async () => {
  try {
    const authToken = localStorage.getItem('auth_token') || ''
    const base      = config.public.apiBase.replace(/\/$/, '')
    const response  = await $fetch(`${base}/archives/filters?filter=${currentFilter.value}`,
      { headers: { Authorization: `Bearer ${authToken}` } })
    if (response.success) filterOptionsData.value = response
  } catch (err) {
    console.error('❌ Erreur chargement filtres:', err)
  }
}

// ── Chargement données ────────────────────────────────────────────────────
const refresh = async (page = 1, per_page = perPage.value, isFirst = false, silent = false) => {
  if (isFirst)      { initialLoading.value = true }
  else if (!silent) { loading.value = true }
  error.value = null

  try {
    const authToken = localStorage.getItem('auth_token') || ''
    const base      = config.public.apiBase.replace(/\/$/, '')
    const params    = new URLSearchParams({ page: String(page), per_page: String(per_page), filter: currentFilter.value })

    const f = searchFilters.value
    if (f.search)           params.append('search',           f.search)
    if (f.numero_enreg)     params.append('numero_enreg',     f.numero_enreg)
    if (f.reference)        params.append('reference',        f.reference)
    if (f.objet)            params.append('objet',            f.objet)
    if (f.date_enreg    && f.date_enreg.length    === 10) params.append('date_enreg',    f.date_enreg)
    if (f.date_courrier && f.date_courrier.length === 10) params.append('date_courrier', f.date_courrier)
    if (f.type)             params.append('type',             f.type)
    if (f.type_document_id) params.append('type_document_id', f.type_document_id)
    if (f.confidentiel)     params.append('confidentiel',     f.confidentiel)
    if (f.type_arrivee)     params.append('type_arrivee',     f.type_arrivee)
    if (f.service_enreg)    params.append('service_enreg',    f.service_enreg)
    if (f.structure)        params.append('structure',        f.structure)
    if (f.priority)         params.append('priority',         f.priority)
    if (f.type_depart)      params.append('type_depart',      f.type_depart)
    if (f.service_emis)     params.append('service_emis',     f.service_emis)
    if (f.destinataire)     params.append('destinataire',     f.destinataire)

    const c = columnFilters.value
    if (!f.numero_enreg && c.numero_enreg) params.append('numero_enreg', c.numero_enreg)
    if (!f.reference    && c.reference)    params.append('reference',    c.reference)
    if (!f.objet        && c.objet)        params.append('objet',        c.objet)
    if (!f.date_enreg && c.date_enreg && c.date_enreg.length === 10) params.append('date_enreg', c.date_enreg)
    if (!f.type         && c.type)         params.append('type',         c.type)

    const m = multiFilters.value
    if (!f.type         && m.type?.length)         params.append('type',         m.type.join(','))
    if (!f.numero_enreg && m.numero_enreg?.length) params.append('numero_enreg', m.numero_enreg.join(','))
    if (!f.reference    && m.reference?.length)    params.append('reference',    m.reference.join(','))

    const response = await $fetch(`${base}/archives?${params.toString()}`,
      { headers: { Authorization: `Bearer ${authToken}` } })

    documents.value   = transformDocuments(response)
    currentPage.value = response.meta.current_page
    totalPages.value  = response.meta.last_page
    total.value       = response.meta.total

  } catch (err) {
    console.error('❌ Erreur chargement archives:', err)
    error.value = err.message || 'Erreur lors du chargement'
  } finally {
    initialLoading.value = false
    loading.value        = false
  }
}

let searchTimeout = null
const onFiltersChange = () => {
  const f = searchFilters.value
  if (f.date_enreg    && f.date_enreg.length    !== 10) return
  if (f.date_courrier && f.date_courrier.length !== 10) return
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => { currentPage.value = 1; refresh(1, perPage.value, false) }, 400)
}

watch(currentFilter, () => {
  currentPage.value   = 1
  searchFilters.value = defaultFilters()
  columnFilters.value = {}
  multiFilters.value  = {}
  tabLoading.value    = true
  loadFilterOptions()
  refresh(1, perPage.value, false, true).finally(() => { tabLoading.value = false })
})

const onPageChange    = (page) => refresh(page, perPage.value, false)
const onPerPageChange = (val)  => { perPage.value = val; refresh(1, val, false) }
const onSearchChange  = (val)  => { searchFilters.value.search = val; currentPage.value = 1; refresh(1, perPage.value, false) }

onMounted(async () => {
  await Promise.all([refresh(1, perPage.value, true), loadFilterOptions()])
})
</script>