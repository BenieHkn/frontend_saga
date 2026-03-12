<template>
  <div class="min-h-screen bg-slate-100 p-6 font-sans">

    <UModal v-model="detailsOpen" :ui="{ width: 'sm:max-w-5xl' }">
      <div v-if="selectedCourrier" class="flex flex-col max-h-[90vh] bg-white rounded-xl overflow-hidden">

        <div class="relative flex items-center justify-between px-6 py-4 shrink-0 overflow-hidden"
          style="background: linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%);">
          <div class="absolute inset-0 opacity-10"
            style="background-image: radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px); background-size: 32px 32px;"></div>
          <div class="relative flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner border border-white/30">
              <Icon name="i-heroicons-document-text" class="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 class="text-base font-bold text-white leading-tight">Détails du document</h2>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="text-xs text-indigo-200 font-medium">N° {{ selectedCourrier.numero_enreg || '—' }}</span>
                <span class="w-1 h-1 rounded-full bg-indigo-300"></span>
                <span class="inline-flex px-1.5 py-0.5 text-[10px] font-bold rounded-md uppercase border"
                  :class="{
                    'bg-blue-400/30 text-blue-100 border-blue-300/50': selectedCourrier.type === 'arrive',
                    'bg-orange-400/30 text-orange-100 border-orange-300/50': selectedCourrier.type === 'depart',
                  }">
                  {{ selectedCourrier.type || '—' }}
                </span>
              </div>
            </div>
          </div>
          <button @click="closeDetails"
            class="relative w-8 h-8 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 transition-all text-white border border-white/20">
            <Icon name="i-heroicons-x-mark" class="w-4 h-4" />
          </button>
        </div>

        <div class="overflow-y-auto flex-1 p-5 space-y-4 bg-slate-50/50">
          <section class="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
            <div class="flex items-center justify-between px-4 py-3 border-b border-slate-100"
              :class="selectedCourrier.type === 'depart' ? 'bg-gradient-to-r from-orange-50 to-amber-50' : 'bg-gradient-to-r from-indigo-50 to-blue-50'">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-lg flex items-center justify-center"
                  :class="selectedCourrier.type === 'depart' ? 'bg-orange-100' : 'bg-indigo-100'">
                  <Icon :name="selectedCourrier.type === 'depart' ? 'i-heroicons-paper-airplane' : 'i-heroicons-inbox-arrow-down'"
                    class="w-3.5 h-3.5"
                    :class="selectedCourrier.type === 'depart' ? 'text-orange-600' : 'text-indigo-600'" />
                </div>
                <span class="text-[11px] font-bold uppercase tracking-widest"
                  :class="selectedCourrier.type === 'depart' ? 'text-orange-700' : 'text-indigo-700'">
                  Courrier {{ selectedCourrier.type === 'depart' ? 'départ' : 'arrivé' }}
                </span>
              </div>
              <div class="flex items-center gap-1.5">
                <span v-if="selectedCourrier.details?.priority"
                  class="inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full border uppercase"
                  :class="{
                    'bg-red-50 text-red-700 border-red-200': selectedCourrier.details.priority.toLowerCase() === 'urgent',
                    'bg-amber-50 text-amber-700 border-amber-200': selectedCourrier.details.priority.toLowerCase() === 'important',
                    'bg-sky-50 text-sky-700 border-sky-200': selectedCourrier.details.priority.toLowerCase() === 'standard',
                  }">{{ selectedCourrier.details.priority }}</span>
                <span v-if="selectedCourrier.type === 'arrive' && selectedCourrier.reponses?.length"
                  class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Icon name="i-heroicons-check-circle" class="w-3 h-3" /> Répondu
                </span>
                <span v-else-if="selectedCourrier.type === 'arrive'"
                  class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  <Icon name="i-heroicons-clock" class="w-3 h-3" /> En attente
                </span>
              </div>
            </div>

            <div class="p-4 space-y-3">
              <div class="grid grid-cols-1 gap-2">
                <div class="group flex items-stretch gap-0 rounded-xl overflow-hidden border border-indigo-100 hover:border-indigo-200 transition-colors">
                  <div class="w-1 shrink-0 bg-gradient-to-b from-indigo-400 to-indigo-600"></div>
                  <div class="flex-1 p-3 bg-gradient-to-r from-indigo-50 to-transparent">
                    <p class="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-0.5">Référence</p>
                    <p class="text-sm font-bold text-indigo-900">{{ selectedCourrier.reference || 'Sans référence' }}</p>
                  </div>
                </div>
                <div class="group flex items-stretch gap-0 rounded-xl overflow-hidden border border-amber-100 hover:border-amber-200 transition-colors">
                  <div class="w-1 shrink-0 bg-gradient-to-b from-amber-400 to-orange-500"></div>
                  <div class="flex-1 p-3 bg-gradient-to-r from-amber-50 to-transparent">
                    <p class="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-0.5">Objet</p>
                    <p class="text-sm text-gray-800 leading-relaxed">{{ selectedCourrier.objet || 'Non spécifié' }}</p>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                <div class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>Source
                  </p>
                  <p class="text-xs font-semibold text-slate-800">{{ selectedCourrier.details?.service_enreg || selectedCourrier.details?.service_emis || 'N/A' }}</p>
                </div>
                <div class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>Structure / Usager
                  </p>
                  <p class="text-xs text-slate-800">{{ selectedCourrier.details?.structure || selectedCourrier.details?.autre_structure || 'Non spécifié' }}</p>
                </div>
                <div class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>
                    {{ selectedCourrier.type === 'depart' ? "Type de départ" : "Type d'arrivée" }}
                  </p>
                  <p class="text-xs text-slate-800">{{ selectedCourrier.details?.type_arrivee || selectedCourrier.details?.type_depart || 'Non spécifié' }}</p>
                </div>
                <div class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-indigo-300 inline-block"></span>N° enregistrement
                  </p>
                  <p class="text-xs font-semibold text-slate-800">{{ selectedCourrier.numero_enreg || '—' }}</p>
                </div>
                <div class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>Date d'enregistrement
                  </p>
                  <p class="text-xs text-slate-800">{{ formatDate(selectedCourrier.date_enreg) || '—' }}</p>
                </div>
                <div v-if="selectedCourrier.date_courrier" class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>Date du courrier
                  </p>
                  <p class="text-xs text-slate-800">{{ formatDate(selectedCourrier.date_courrier) }}</p>
                </div>
                <div v-if="selectedCourrier.type_document" class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>Type de document
                  </p>
                  <p class="text-xs text-slate-800">{{ selectedCourrier.type_document.libelle }}</p>
                </div>
              </div>

              <div class="pt-1">
                <div v-if="arriveeUrl">
                  <button v-if="!showArriveeDoc" @click="showArriveeDoc = true"
                    class="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-all hover:shadow-sm">
                    <Icon name="i-heroicons-document-arrow-down" class="w-4 h-4" />
                    Charger le document
                  </button>
                  <div v-else class="mt-2 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                    <DocumentRpreview :file-preview-url="arriveeUrl" height="400px" />
                  </div>
                </div>
                <div v-else class="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-400 bg-slate-50 border border-slate-200 rounded-xl cursor-not-allowed">
                  <Icon name="i-heroicons-document-text" class="w-4 h-4" />
                  Aucun document disponible
                </div>
              </div>
            </div>
          </section>

          <section v-if="selectedCourrier.type === 'arrive' && selectedCourrier.reponses?.length"
            class="bg-white rounded-2xl border border-emerald-200/80 overflow-hidden shadow-sm">
            <div class="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Icon name="i-heroicons-arrow-uturn-right" class="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <span class="text-[11px] font-bold text-emerald-700 uppercase tracking-widest">Courrier de réponse</span>
              </div>
              <span v-if="reponseData && !loadingReponse"
                class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                <Icon name="i-heroicons-check-circle" class="w-3 h-3" /> Chargé
              </span>
            </div>

            <div v-if="loadingReponse" class="flex items-center justify-center gap-3 py-8 text-slate-400">
              <div class="w-5 h-5 border-2 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
              <span class="text-xs font-medium">Chargement du courrier de réponse...</span>
            </div>

            <div v-else-if="reponseData" class="p-4 space-y-3">
              <div class="grid grid-cols-1 gap-2">
                <div class="group flex items-stretch gap-0 rounded-xl overflow-hidden border border-emerald-100">
                  <div class="w-1 shrink-0 bg-gradient-to-b from-emerald-400 to-teal-500"></div>
                  <div class="flex-1 p-3 bg-gradient-to-r from-emerald-50 to-transparent">
                    <p class="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-0.5">Référence</p>
                    <p class="text-sm font-bold text-emerald-900">{{ reponseData.reference || 'Sans référence' }}</p>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                <div class="p-2.5 bg-white rounded-xl border border-slate-100">
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Destinataire</p>
                  <p class="text-xs font-semibold text-slate-800">{{ reponseData.destinataire || '—' }}</p>
                </div>
                <div class="p-2.5 bg-white rounded-xl border border-slate-100">
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date de départ</p>
                  <p class="text-xs text-slate-800">{{ formatDate(reponseData.date_depart) || '—' }}</p>
                </div>
                <div v-if="reponseData.service_emis" class="p-2.5 bg-white rounded-xl border border-slate-100">
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Service émetteur</p>
                  <p class="text-xs text-slate-800">{{ reponseData.service_emis }}</p>
                </div>
              </div>
              <div class="pt-1">
                <div v-if="reponseData.url">
                  <button v-if="!showReponseDoc" @click="showReponseDoc = true"
                    class="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all">
                    <Icon name="i-heroicons-document-arrow-down" class="w-4 h-4" />
                    Charger le document de réponse
                  </button>
                  <div v-else class="mt-2 rounded-xl overflow-hidden border border-emerald-200 shadow-sm">
                    <DocumentRpreview :file-preview-url="reponseData.url" height="400px" />
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="flex items-center gap-2 m-4 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600">
              <Icon name="i-heroicons-exclamation-triangle" class="w-4 h-4 shrink-0" />
              Impossible de charger les détails du courrier de réponse.
            </div>
          </section>
        </div>

        <div class="px-6 py-3.5 border-t border-slate-100 shrink-0 flex items-center justify-between bg-white">
          <span class="text-[10px] text-slate-400">{{ selectedCourrier.reference || '' }}</span>
          <UButton color="gray" variant="outline" size="sm" @click="closeDetails">Fermer</UButton>
        </div>
      </div>
    </UModal>

    <PageHeader
      v-if="!isAdmin()"
      title="Tous les documents"
      subtitle="Gestion et suivi des documents — 12 derniers mois"
      btnText="Nouveau"
      to="/courriers/form_courier_arrive" />
    <PageHeader
      v-else
      title="Tous les documents"
      subtitle="Gestion et suivi des documents — 12 derniers mois" />

    <div v-if="initialLoading" class="flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
      <div class="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <span class="text-sm font-medium">Chargement des données...</span>
    </div>

    <div v-else-if="error"
      class="flex items-center gap-4 p-5 bg-red-50 border border-red-200 rounded-xl max-w-2xl">
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

    <DataTablePaginate
      v-else
      :loading="loading"
      :data="courriers"
      :columns="columns"
      :selectable="false"
      :default-sort-column="null"
      :show-row-numbers="true"
      :show-actions="true"
      :default-actions="[]"
      :items-per-page-options="[10, 20, 50, 100]"
      :default-items-per-page="20"
      :left-aligned-columns="['reference', 'structure', 'numero_enreg', 'objet']"
      :hide-labels-when-input="true"
      :external-pagination="true"
      :external-total="total"
      :external-page="currentPage"
      :external-last-page="totalPages"
      :external-per-page="perPage"
      @search-change="onSearchChange"
      @page-change="onPageChange"
      @per-page-change="onPerPageChange"
      @column-filter-change="onColumnFilterChange">

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
              <input v-model="searchFilters.date_enreg" placeholder="ex: 15/03/2024"
                class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                @input="onFiltersChange" />
            </div>
          </div>

          <div class="flex flex-wrap gap-3">
            <div class="flex-1 min-w-[140px]">
              <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Type</label>
              <SearchableSelect
                v-model="searchFilters.type"
                :options="[{ value: 'arrive', label: 'Arrivé' }, { value: 'depart', label: 'Départ' }]"
                placeholder="Tous"
                @change="onFiltersChange" />
            </div>
          </div>

          <div v-if="hasActiveFilters" class="flex justify-end">
            <button @click="resetFilters"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-all">
              <Icon name="i-heroicons-x-mark" class="w-3.5 h-3.5" />
              Réinitialiser les filtres
            </button>
          </div>
        </div>
      </template>

      <template #cell-type="{ value }">
        <span
          class="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-full border uppercase whitespace-nowrap"
          :class="{
            'bg-indigo-50 text-indigo-700 border-indigo-100': value === 'arrive',
            'bg-orange-50 text-orange-700 border-orange-100': value === 'depart',
          }">
          <Icon :name="value === 'arrive' ? 'i-heroicons-inbox-arrow-down' : 'i-heroicons-paper-airplane'" class="w-3 h-3 shrink-0" />
          {{ value === 'arrive' ? 'Arrivé' : 'Départ' }}
        </span>
      </template>

      <template #cell-reference="{ value, item }">
        <button v-if="item.url" @click="onOpenDocument(item.url)"
          class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-all group max-w-[180px]">
          <Icon name="i-heroicons-document-text" class="w-3.5 h-3.5 shrink-0 group-hover:scale-110 transition-transform" />
          <span class="break-words whitespace-normal min-w-0">{{ value }}</span>
          <Icon name="i-heroicons-arrow-top-right-on-square" class="w-3 h-3 shrink-0 opacity-60 group-hover:opacity-100" />
        </button>
        <span v-else
          class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md max-w-[180px]">
          <Icon name="i-heroicons-document-text" class="w-3.5 h-3.5 shrink-0 opacity-50" />
          <span class="break-words whitespace-normal min-w-0">{{ value || '—' }}</span>
        </span>
      </template>

      <template #cell-objet="{ value }">
        <span class="block text-xs text-slate-800 leading-relaxed whitespace-normal break-words min-w-[200px]" :title="value">
          {{ value || '—' }}
        </span>
      </template>

      <template #cell-source="{ value }">
        <span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
          {{ value }}
        </span>
      </template>

      <template #cell-priority="{ value }">
        <span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border uppercase" :class="{
          'bg-red-50 text-red-700 border-red-100':       value?.toLowerCase() === 'urgent',
          'bg-amber-50 text-amber-700 border-amber-100': value?.toLowerCase() === 'important',
          'bg-sky-50 text-sky-700 border-sky-100':       value?.toLowerCase() === 'standard',
        }">
          {{ value || 'STANDARD' }}
        </span>
      </template>

      <template #actions="{ item }">
        <div class="flex gap-1.5 justify-end">
          <button @click="handleView(item)" title="Voir les détails"
            class="inline-flex items-center justify-center w-8 h-8 bg-amber-50 text-amber-700 border border-amber-100 rounded-md hover:bg-amber-200 transition-all group">
            <Icon name="i-heroicons-eye" class="w-4 h-4 group-hover:text-yellow-600" />
          </button>

          <template v-if="item.type === 'arrive'">
            <button v-if="!isAdmin()" @click="handleQuickAssign(item._raw?.details?.id)" title="Affecter ce courrier"
              class="inline-flex items-center justify-center w-8 h-8 bg-sky-50 text-sky-700 border border-sky-100 rounded-md hover:bg-sky-200 transition-all group">
              <Icon name="i-heroicons-paper-airplane" class="w-4 h-4 group-hover:text-blue-600" />
            </button>
            <button
              v-if="!item._raw?.reponses?.length && !isAdmin()"
              @click="handleReply(item)"
              title="Répondre au courrier"
              class="inline-flex items-center justify-center w-8 h-8 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md hover:bg-emerald-200 transition-all group">
              <Icon name="i-heroicons-arrow-uturn-right" class="w-4 h-4 group-hover:text-green-600" />
            </button>
            <div
              v-else-if="item._raw?.reponses?.length && !isAdmin()"
              title="Ce courrier a déjà une réponse"
              class="inline-flex items-center justify-center w-8 h-8 bg-green-50 text-green-500 border border-green-100 rounded-md cursor-default">
              <Icon name="i-heroicons-check-circle" class="w-4 h-4" />
            </div>
          </template>

          <button v-if="isAdmin()" @click="onEdit(item)" title="Modifier"
            class="inline-flex items-center justify-center w-8 h-8 bg-sky-50 text-sky-700 border border-sky-100 rounded-md hover:bg-sky-200 transition-all group">
            <Icon name="i-heroicons-pencil" class="w-4 h-4 group-hover:text-blue-600" />
          </button>
          <button v-if="isAdmin()" @click="onDelete(item)" title="Supprimer"
            class="inline-flex items-center justify-center w-8 h-8 bg-red-50 text-red-700 border border-red-100 rounded-md hover:bg-red-200 transition-all group">
            <Icon name="i-heroicons-trash" class="w-4 h-4 group-hover:text-red-600" />
          </button>
        </div>
      </template>

    </DataTablePaginate>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DataTablePaginate from '~/components/DataTablePaginate.vue'
import SearchableSelect from '~/components/SearchableSelect.vue'
import DocumentRpreview from '~/components/DocumentRpreview.vue'
import { useAffectationsStore } from '~/stores/affectations'
import { useCourriersStore } from '~/stores/courriers'
import { useAuth } from '~/composables/auth/useAuth'
import Swal from 'sweetalert2'

const props = defineProps({
  entiteId: { type: Number, default: null }
})

const store          = useAffectationsStore()
const courriersStore = useCourriersStore()
const config         = useRuntimeConfig()
const { isAdmin }    = useAuth()

// ── État table ────────────────────────────────────────────────────────────────
const courriers      = ref([])
const loading        = ref(false)
const initialLoading = ref(false)
const error          = ref(null)
const currentPage    = ref(1)
const totalPages     = ref(1)
const total          = ref(0)
const perPage        = ref(20)

// ── Options filtres avancés ───────────────────────────────────────────────────
const filterOptionsData = ref({
  types_document: [],
  types_arrivee:  [],
  services_enreg: [],
  structures:     [],
  priorities:     [],
  services_emis:  [],
  destinataires:  [],
})

// ── Filtres avancés ───────────────────────────────────────────────────────────
const defaultFilters = () => ({
  search:       '',
  numero_enreg: '',
  reference:    '',
  objet:        '',
  date_enreg:   '',
  date_courrier:'',
  type:         '',
})

const searchFilters = ref(defaultFilters())

const hasActiveFilters = computed(() =>
  Object.values(searchFilters.value).some(v => v !== '') ||
  Object.values(columnFilters.value).some(v => v !== '')
)

const resetFilters = () => {
  searchFilters.value = defaultFilters()
  columnFilters.value = {}
  currentPage.value   = 1
  refresh(1, perPage.value, false)
}

// ── Filtres colonnes ──────────────────────────────────────────────────────────
const columnFilters = ref({})

let columnFilterTimeout = null
const onColumnFilterChange = (val) => {
  columnFilters.value = { ...val }
  clearTimeout(columnFilterTimeout)
  columnFilterTimeout = setTimeout(() => {
    currentPage.value = 1
    refresh(1, perPage.value, false)
  }, 400)
}

// ── Colonnes ──────────────────────────────────────────────────────────────────
const columns = [
  { key: 'source',              label: 'Source',              visible: true,  type: 'badge',    inputHidden: true },
  { key: 'type',                label: 'Type',                visible: true,  filterable: false },
  { key: 'reference',           label: 'Référence',           visible: true,  inputWidth: '80px', inputPlaceholder: 'Réf...' },
  { key: 'numero_enreg',        label: "N° d'enreg.",         visible: false, filterable: false },
  { key: 'objet',               label: 'Objet',               visible: true,  inputPlaceholder: 'Objet...' },
  { key: 'date_enregistrement', label: "Date d'enregistrement", visible: false, filterable: false },
  { key: 'date_courrier',       label: 'Date du Courrier',    visible: false, filterable: false },
  { key: 'url',                 label: 'Document',            visible: false, type: 'document', filterable: false },
  { key: 'type_arrivee',        label: "Type d'arrivée",      visible: false, filterable: false },
  { key: 'priority',            label: 'Priorité',            visible: false, type: 'badge',    filterable: false },
  { key: 'structure',           label: 'Structure / Usager',  visible: true,  inputPlaceholder: 'Structure...' },
]

// ── Modal ─────────────────────────────────────────────────────────────────────
const detailsOpen      = ref(false)
const selectedCourrier = ref(null)
const showArriveeDoc   = ref(false)
const showReponseDoc   = ref(false)
const loadingReponse   = ref(false)
const reponseData      = ref(null)

const arriveeUrl = computed(() => {
  const raw = selectedCourrier.value?.url
  const url = raw?.trim?.()
  if (!url || url === 'Inconnu' || url === '') return null
  if (url.startsWith('http')) return url
  const base = config.public.baseUrl?.replace(/\/$/, '')
  const path = url.startsWith('/') ? url : `/${url}`
  return `${base}${path}`
})

// ── Utilitaires ───────────────────────────────────────────────────────────────
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric'
  })
}

const transformCourriers = (response) => {
  if (!response?.data) throw new Error('Format de réponse API invalide')
  return response.data.map((doc) => ({
    id:                   doc.id,
    source:               doc.details?.service_enreg || doc.details?.service_emis || '',
    type:                 doc.type,
    numero_enreg:         doc.numero_enreg  || '',
    reference:            doc.reference     || '',
    structure:            doc.details?.structure || doc.details?.autre_structure || '',
    date_enregistrement:  formatDate(doc.date_enreg),
    objet:                doc.objet         || '',
    date_courrier:        formatDate(doc.date_courrier),
    url:                  doc.url && doc.url !== 'Inconnu'
                            ? (doc.url.startsWith('http') ? doc.url : `${config.public.baseUrl}${doc.url}`)
                            : '',
    type_arrivee:         doc.details?.type_arrivee || '',
    priority:             doc.details?.priority     || '',
    _raw:                 doc,
  }))
}

// ── Chargement options filtres ────────────────────────────────────────────────
const loadFilterOptions = async () => {
  try {
    const authToken = localStorage.getItem('auth_token') || ''
    const base      = config.public.apiBase.replace(/\/$/, '')
    const response  = await $fetch(`${base}/documents/filters`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
    if (response.success) filterOptionsData.value = response
  } catch (err) {
    console.error('❌ Erreur chargement filtres:', err)
  }
}

// ── Chargement données ────────────────────────────────────────────────────────
const refresh = async (page = 1, per_page = perPage.value, isFirst = false) => {
  if (isFirst) {
    initialLoading.value = true
  } else {
    loading.value = true
  }
  error.value = null

  try {
    const authToken = localStorage.getItem('auth_token') || ''
    const base      = config.public.apiBase.replace(/\/$/, '')

    const params = new URLSearchParams({
      page:     String(page),
      per_page: String(per_page),
    })

    if (props.entiteId) {
      const selectedEntite = JSON.parse(localStorage.getItem('selected_entite') || 'null')
      if (selectedEntite?.code) params.append('service_enreg_entite', selectedEntite.code)
    }

    // ── Filtres avancés ──────────────────────────────────────────────────
    const f = searchFilters.value
    if (f.search)            params.append('search',       f.search)
    if (f.numero_enreg)      params.append('numero_enreg', f.numero_enreg)
    if (f.reference)         params.append('reference',    f.reference)
    if (f.objet)             params.append('objet',        f.objet)
    if (f.date_enreg    && f.date_enreg.length    === 10) params.append('date_enreg',    f.date_enreg)
    if (f.date_courrier && f.date_courrier.length === 10) params.append('date_courrier', f.date_courrier)
    if (f.type)              params.append('type',         f.type)

    // ── Filtres colonnes ─────────────────────────────────────────────────
    const c = columnFilters.value
    if (!f.numero_enreg && c.numero_enreg) params.append('numero_enreg', c.numero_enreg)
    if (!f.reference    && c.reference)    params.append('reference',    c.reference)
    if (!f.objet        && c.objet)        params.append('objet',        c.objet)
    if (!f.type         && c.type)         params.append('type',         c.type)
    // source → dépend du type (service_enreg ou service_emis), on envoie les deux
    if (c.source) {
      params.append('service_enreg', c.source)
      params.append('service_emis',  c.source)
    }
    if (c.structure) params.append('structure', c.structure)

    const response = await $fetch(`${base}/documents/type?${params.toString()}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })

    courriers.value   = transformCourriers(response)
    currentPage.value = response.meta.current_page
    totalPages.value  = response.meta.last_page
    total.value       = response.meta.total

  } catch (err) {
    console.error('❌ Erreur chargement documents:', err)
    error.value = err.message || 'Erreur lors du chargement'
  } finally {
    initialLoading.value = false
    loading.value        = false
  }
}

// ── Debounce filtres avancés ──────────────────────────────────────────────────
let searchTimeout = null
const onFiltersChange = () => {
  const f = searchFilters.value
  const dateEnregOk   = !f.date_enreg    || f.date_enreg.length    === 10
  const dateCourierOk = !f.date_courrier || f.date_courrier.length === 10
  if (!dateEnregOk || !dateCourierOk) return

  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    refresh(1, perPage.value, false)
  }, 400)
}

// ── Handlers pagination ───────────────────────────────────────────────────────
const onPageChange    = (page) => refresh(page, perPage.value, false)
const onPerPageChange = (val)  => { perPage.value = val; refresh(1, val, false) }
const onSearchChange  = (val)  => {
  searchFilters.value.search = val
  currentPage.value = 1
  refresh(1, perPage.value, false)
}

// ── Modal ─────────────────────────────────────────────────────────────────────
const handleView = async (item) => {
  const doc = item._raw || item
  selectedCourrier.value = doc
  showArriveeDoc.value   = false
  showReponseDoc.value   = false
  reponseData.value      = null
  detailsOpen.value      = true

  if (doc.type === 'arrive') {
    const reponses = doc.reponses || []
    if (reponses.length) {
      const courierDepartId = reponses[0]?.reponse_id
      if (courierDepartId) await loadReponseData(courierDepartId)
    }
  }
}

const closeDetails = () => {
  detailsOpen.value      = false
  selectedCourrier.value = null
  reponseData.value      = null
  showArriveeDoc.value   = false
  showReponseDoc.value   = false
}

const loadReponseData = async (documentId) => {
  if (!documentId) return
  loadingReponse.value = true
  try {
    const authToken  = localStorage.getItem('auth_token') || ''
    const allDeparts = await $fetch(`${config.public.apiBase}/courriers-departs`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
    const list = Array.isArray(allDeparts?.data) ? allDeparts.data : []
    const doc  = list.find(cd => cd.document_id === documentId) || null
    if (!doc) { reponseData.value = null; return }

    const buildUrl = (raw) => {
      if (!raw || raw === 'Inconnu') return null
      if (raw.startsWith('http')) return raw
      const base = config.public.baseUrl?.replace(/\/$/, '')
      const path = raw.startsWith('/') ? raw : `/${raw}`
      return `${base}${path}`
    }

    reponseData.value = {
      reference:    doc?.document?.reference || 'Sans référence',
      objet:        doc?.document?.objet     || 'Non spécifié',
      destinataire: doc?.destinataire        || '—',
      date_depart:  doc?.date_depart         || null,
      type_depart:  doc?.type_depart         || null,
      service_emis: doc?.service_emis        || null,
      url:          buildUrl((doc?.document?.url || '').trim()),
    }
  } catch (e) {
    console.error('❌ Erreur chargement réponse:', e)
    reponseData.value = null
  } finally {
    loadingReponse.value = false
  }
}

// ── Handlers actions ──────────────────────────────────────────────────────────
const onOpenDocument = (url) => {
  if (url) window.open(url, '_blank', 'noopener,noreferrer')
}

const handleQuickAssign = (courrierId) => {
  if (!courrierId) return
  store.selectCourrierFromQuickAction(courrierId)
  navigateTo('/affectations/create')
}

const handleReply = async (item) => {
  const doc = item._raw || item
  if (doc.reponses?.length) {
    Swal.fire({ title: 'Déjà répondu', text: 'Ce courrier a déjà reçu une réponse.', icon: 'info', confirmButtonColor: '#2563eb' })
    return
  }

  const courrierArriveId = doc.details?.id
  if (!courrierArriveId) {
    Swal.fire({ title: 'Erreur', text: "Impossible d'identifier le courrier arrivé.", icon: 'error', confirmButtonColor: '#2563eb' })
    return
  }

  try {
    const authToken = localStorage.getItem('auth_token') || ''
    const response  = await $fetch(
      `${config.public.apiBase}/courriers-arrives/${courrierArriveId}`,
      { headers: { Authorization: `Bearer ${authToken}` } }
    )
    const courrierArrive = response?.data || response
    if (!courrierArrive) throw new Error('Courrier arrivé introuvable')
    courriersStore.setCourrierToReply(courrierArrive)
    navigateTo('/courriers/form_courrier_depart')
  } catch (e) {
    console.error('❌ Erreur chargement courrier arrivé:', e)
    Swal.fire({ title: 'Erreur', text: 'Impossible de charger les données du courrier. Réessayez.', icon: 'error', confirmButtonColor: '#2563eb' })
  }
}

const onEdit   = (item) => navigateTo(`/courriers/edit/${item.id}`)

const onDelete = async (item) => {
  const result = await Swal.fire({
    title: 'Confirmer la suppression',
    html: `
      <div class="text-left">
        <p class="mb-3">Êtes-vous sûr de vouloir supprimer ce courrier ?</p>
        <div class="bg-gray-50 rounded-lg p-4 space-y-2">
          <p class="text-sm font-medium text-gray-900">${item.reference}</p>
          <p class="text-xs text-gray-600">${item.objet}</p>
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
  })
  if (!result.isConfirmed) return

  try {
    const authToken = localStorage.getItem('auth_token')
    await $fetch(`${config.public.apiBase}/courriers-arrives/${item.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken}` },
    })
    await Swal.fire({ title: 'Supprimé !', text: 'Le courrier a été supprimé avec succès', icon: 'success', timer: 2000, showConfirmButton: false })
    refresh(currentPage.value, perPage.value, false)
  } catch (err) {
    const message           = err.data?.message || err.message || 'Impossible de supprimer le courrier'
    const affectationsCount = err.data?.data?.affectations_count
    await Swal.fire({
      title: 'Suppression impossible',
      html: affectationsCount
        ? `<div class="text-left">
            <p class="mb-3">${message}</p>
            <div class="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p class="text-sm text-orange-800"><strong>${affectationsCount}</strong> affectation(s) associée(s).</p>
              <p class="text-xs text-orange-600 mt-1">Supprimez d'abord les affectations.</p>
            </div>
           </div>`
        : `<p>${message}</p>`,
      icon: 'error',
      confirmButtonColor: '#2563eb',
      confirmButtonText: 'Compris',
    })
  }
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(async () => {
  await Promise.all([
    refresh(1, perPage.value, true),
    loadFilterOptions(),
  ])
})
</script>

<style scoped>
:deep(.swal2-html-container) { margin: 1rem 0; }
:deep(.swal2-actions) { gap: 0.75rem; }
:deep(.swal2-confirm), :deep(.swal2-cancel) {
  padding: 0.625rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s;
}
:deep(.swal2-confirm):hover { transform: translateY(-1px); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
:deep(.swal2-cancel):hover { background-color: #4b5563 !important; }
</style>