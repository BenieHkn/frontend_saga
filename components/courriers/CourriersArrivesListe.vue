<template>
  <div class="min-h-screen bg-slate-100 p-6 font-sans">

    <!-- ══════════════════════════════════════════════════════════════════ -->
    <!-- MODAL DÉTAILS                                                      -->
    <!-- ══════════════════════════════════════════════════════════════════ -->
    <UModal v-model="detailsOpen" :ui="{ width: 'sm:max-w-5xl' }">
      <div v-if="selectedCourrier" class="flex flex-col max-h-[90vh] bg-white rounded-xl overflow-hidden">

        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <Icon name="i-heroicons-envelope-open" class="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h2 class="text-base font-bold text-slate-900">Détails du courrier arrivé</h2>
              <p class="text-xs text-slate-500">N° {{ selectedCourrier.document?.numero_enreg }}</p>
            </div>
          </div>
          <button @click="closeDetails"
            class="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700">
            <Icon name="i-heroicons-x-mark" class="w-4 h-4" />
          </button>
        </div>

        <div class="overflow-y-auto flex-1 p-5 space-y-5">
          <section class="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div class="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-100">
              <div class="flex items-center gap-2">
                <div class="w-5 h-5 rounded bg-indigo-100 flex items-center justify-center">
                  <Icon name="i-heroicons-inbox-arrow-down" class="w-3 h-3 text-indigo-600" />
                </div>
                <span class="text-[11px] font-bold text-slate-600 uppercase tracking-widest">Courrier arrivé</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full border uppercase" :class="{
                  'bg-red-50 text-red-700 border-red-200':       selectedCourrier.priority?.toLowerCase() === 'urgent',
                  'bg-amber-50 text-amber-700 border-amber-200': selectedCourrier.priority?.toLowerCase() === 'important',
                  'bg-sky-50 text-sky-700 border-sky-200':       !selectedCourrier.priority || selectedCourrier.priority?.toLowerCase() === 'standard',
                }">{{ selectedCourrier.priority || 'STANDARD' }}</span>
                <span v-if="selectedCourrier.document?.reponses?.length"
                  class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-green-50 text-green-700 border border-green-200">
                  <Icon name="i-heroicons-check-circle" class="w-3 h-3" /> Répondu
                </span>
                <span v-else
                  class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  <Icon name="i-heroicons-clock" class="w-3 h-3" /> En attente
                </span>
              </div>
            </div>

            <div class="p-4 space-y-3">
              <div class="grid grid-cols-1 gap-2">
                <div class="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                  <div class="w-1 h-full min-h-[2rem] rounded-full bg-indigo-400 shrink-0 self-stretch"></div>
                  <div>
                    <p class="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-0.5">Référence</p>
                    <p class="text-sm font-bold text-indigo-900">{{ selectedCourrier.document?.reference || 'Sans référence' }}</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <div class="w-1 h-full min-h-[2rem] rounded-full bg-amber-400 shrink-0 self-stretch"></div>
                  <div>
                    <p class="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-0.5">Objet</p>
                    <p class="text-sm text-gray-800 leading-relaxed">{{ selectedCourrier.document?.objet || 'Non spécifié' }}</p>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Source</p>
                  <p class="text-xs font-semibold text-slate-800">{{ selectedCourrier.service_enreg || 'N/A' }}</p>
                </div>
                <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Structure / Usager</p>
                  <p class="text-xs text-slate-800">{{ selectedCourrier.structure || selectedCourrier.autre_structure || 'Non spécifié' }}</p>
                </div>
                <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Type d'arrivée</p>
                  <p class="text-xs text-slate-800">{{ selectedCourrier.type_arrivee || 'Non spécifié' }}</p>
                </div>
                <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">N° enregistrement</p>
                  <p class="text-xs font-semibold text-slate-800">{{ selectedCourrier.document?.numero_enreg || '—' }}</p>
                </div>
                <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Date d'enregistrement</p>
                  <p class="text-xs text-slate-800">{{ formatDate(selectedCourrier.document?.date_enreg) || '—' }}</p>
                </div>
                <div v-if="selectedCourrier.document?.date_courrier" class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Date du courrier</p>
                  <p class="text-xs text-slate-800">{{ formatDate(selectedCourrier.document?.date_courrier) }}</p>
                </div>
              </div>

              <!-- ── Preview document arrivé ────────────────────────── -->
              <div class="pt-1">
                <div v-if="selectedCourrier.document?.url && selectedCourrier.document.url !== 'Inconnu'">
                  <button
                    v-if="!arriveeFileLoaded && !arriveeFileLoading && !arriveeFileError"
                    @click="loadArriveeFile"
                    class="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-all">
                    <Icon name="i-heroicons-document-arrow-down" class="w-4 h-4" />
                    Charger le document arrivé
                  </button>
                  <div v-else-if="arriveeFileLoading"
                    class="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-400">
                    <div class="w-4 h-4 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin"></div>
                    Chargement...
                  </div>
                  <div v-else-if="arriveeFileError"
                    class="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-red-500 bg-red-50 border border-red-200 rounded-lg">
                    <Icon name="i-heroicons-exclamation-triangle" class="w-4 h-4 shrink-0" />
                    {{ arriveeFileError }}
                    <button @click="arriveeFileError = ''; loadArriveeFile()"
                      class="ml-1 underline hover:no-underline">Réessayer</button>
                  </div>
                  <div v-else-if="arriveeFileLoaded" class="mt-2 rounded-lg overflow-hidden border border-slate-200">
                    <DocumentRpreview :file-preview-url="ariveeBlobUrl" height="400px" />
                  </div>
                </div>
                <div v-else class="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-400 bg-slate-50 border border-slate-200 rounded-lg cursor-not-allowed">
                  <Icon name="i-heroicons-document-text" class="w-4 h-4" />
                  Aucun document disponible
                </div>
              </div>
            </div>
          </section>

          <!-- ── Section réponse ────────────────────────────────────── -->
          <section v-if="selectedCourrier.document?.reponses?.length"
            class="bg-white rounded-xl border border-emerald-200 overflow-hidden">
            <div class="flex items-center justify-between px-4 py-2.5 bg-emerald-50 border-b border-emerald-100">
              <div class="flex items-center gap-2">
                <div class="w-5 h-5 rounded bg-emerald-100 flex items-center justify-center">
                  <Icon name="i-heroicons-arrow-uturn-right" class="w-3 h-3 text-emerald-600" />
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
                <div class="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                  <div class="w-1 min-h-[2rem] rounded-full bg-emerald-400 shrink-0 self-stretch"></div>
                  <div>
                    <p class="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-0.5">Référence</p>
                    <p class="text-sm font-bold text-emerald-900">{{ reponseData.reference || 'Sans référence' }}</p>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Destinataire</p>
                  <p class="text-xs font-semibold text-slate-800">{{ reponseData.destinataire || '—' }}</p>
                </div>
                <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Date de départ</p>
                  <p class="text-xs text-slate-800">{{ formatDate(reponseData.date_depart) || '—' }}</p>
                </div>
                <div v-if="reponseData.service_emis" class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Service émetteur</p>
                  <p class="text-xs text-slate-800">{{ reponseData.service_emis }}</p>
                </div>
                <div v-if="reponseData.type_depart" class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Type de départ</p>
                  <p class="text-xs text-slate-800">{{ reponseData.type_depart }}</p>
                </div>
              </div>

              <!-- ── Preview document réponse ───────────────────────── -->
              <div class="pt-1" v-if="reponseData.rawUrl">
                <button
                  v-if="!reponseFileLoaded && !reponseFileLoading && !reponseFileError"
                  @click="loadReponseFile"
                  class="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-all">
                  <Icon name="i-heroicons-document-arrow-down" class="w-4 h-4" />
                  Charger le document de réponse
                </button>
                <div v-else-if="reponseFileLoading"
                  class="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-400">
                  <div class="w-4 h-4 border-2 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
                  Chargement...
                </div>
                <div v-else-if="reponseFileError"
                  class="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-red-500 bg-red-50 border border-red-200 rounded-lg">
                  <Icon name="i-heroicons-exclamation-triangle" class="w-4 h-4 shrink-0" />
                  {{ reponseFileError }}
                  <button @click="reponseFileError = ''; loadReponseFile()"
                    class="ml-1 underline hover:no-underline">Réessayer</button>
                </div>
                <div v-else-if="reponseFileLoaded" class="mt-2 rounded-lg overflow-hidden border border-emerald-200">
                  <DocumentRpreview :file-preview-url="reponseBlobUrl" height="400px" />
                </div>
              </div>
              <div v-else class="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-400 bg-slate-50 border border-slate-200 rounded-lg cursor-not-allowed">
                <Icon name="i-heroicons-document-text" class="w-4 h-4" />
                Aucun document disponible pour la réponse
              </div>
            </div>

            <div v-else class="flex items-center gap-2 m-4 p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600">
              <Icon name="i-heroicons-exclamation-triangle" class="w-4 h-4 shrink-0" />
              Impossible de charger les détails du courrier de réponse.
            </div>
          </section>
        </div>

        <div class="px-6 py-4 border-t border-slate-100 shrink-0 flex justify-end">
          <UButton color="gray" variant="outline" @click="closeDetails">Fermer</UButton>
        </div>
      </div>
    </UModal>

    <!-- ══════════════════════════════════════════════════════════════════ -->
    <!-- EN-TÊTE PAGE                                                       -->
    <!-- ══════════════════════════════════════════════════════════════════ -->
    <PageHeader
      v-if="!isAdmin()"
      title="Courriers arrivés"
      subtitle="Gestion des courriers entrants — 12 derniers mois"
      btnText="Nouveau"
      to="/courriers/form_courier_arrive" />
    <PageHeader
      v-else
      title="Courriers arrivés"
      subtitle="Gestion des courriers entrants — 12 derniers mois" />

    <!-- Loader premier chargement -->
    <div v-if="initialLoading" class="flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
      <div class="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <span class="text-sm font-medium">Chargement des données...</span>
    </div>

    <!-- Erreur -->
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

    <!-- DataTable paginée -->
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

      <!-- ── Filtres avancés ──────────────────────────────────────────── -->
      <template #advanced-filters>
        <div class="space-y-4">
          <div class="flex flex-wrap gap-3">
            <div class="flex-1 min-w-[120px]">
              <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">N° d'enreg.</label>
              <input v-model="searchFilters.numero_enreg" placeholder="Filtrer..."
                class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
            </div>
            <div class="flex-1 min-w-[120px]">
              <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Référence</label>
              <input v-model="searchFilters.reference" placeholder="Filtrer..."
                class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
            </div>
            <div class="flex-1 min-w-[160px]">
              <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Objet</label>
              <input v-model="searchFilters.objet" placeholder="Filtrer..."
                class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
            </div>
            <div class="flex-1 min-w-[150px]">
              <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Date d'enreg. (jj/mm/aaaa)</label>
              <input v-model="searchFilters.date_enreg" placeholder="ex: 15/03/2024"
                class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
            </div>
          </div>

          <div class="flex flex-wrap gap-3">
            <div class="flex-1 min-w-[140px]">
              <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Type d'arrivée</label>
              <SearchableSelect
                v-model="searchFilters.type_arrivee"
                :options="filterOptionsData.types_arrivee.map(t => ({ value: t, label: t }))"
                placeholder="Tous" />
            </div>
            <div class="flex-1 min-w-[140px]">
              <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Service enregistrement</label>
              <SearchableSelect
                v-model="searchFilters.service_enreg"
                :options="filterOptionsData.services_enreg.map(s => ({ value: s, label: s }))"
                placeholder="Tous" />
            </div>
            <div class="flex-1 min-w-[160px]">
              <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Structure / Expéditeur</label>
              <SearchableSelect
                v-model="searchFilters.structure"
                :options="filterOptionsData.structures.map(s => ({ value: s, label: s }))"
                placeholder="Tous" />
            </div>
            <div class="flex-1 min-w-[140px]">
              <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Priorité</label>
              <SearchableSelect
                v-model="searchFilters.priority"
                :options="filterOptionsData.priorities.map(p => ({ value: p, label: p }))"
                placeholder="Toutes" />
            </div>
            <div class="flex-1 min-w-[180px]">
              <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Type de document</label>
              <SearchableSelect
                v-model="searchFilters.type_document_id"
                :options="filterOptionsData.types_document.map(t => ({ value: t.id, label: `${t.code} — ${t.libelle}` }))"
                placeholder="Tous" />
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

      <!-- ── Colonne Source ───────────────────────────────────────────── -->
      <template #cell-source="{ value }">
        <span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
          {{ value }}
        </span>
      </template>

      <!-- ── Objet ────────────────────────────────────────────────────── -->
      <template #cell-objet="{ value }">
        <span class="block text-xs text-slate-800 leading-relaxed whitespace-normal break-words" :title="value">
          {{ value || '—' }}
        </span>
      </template>

      <!-- ── Référence cliquable → ouvre via Blob ────────────────────── -->
      <template #cell-reference="{ value, item }">
        <button v-if="item._raw?.document?.url && item._raw.document.url !== 'Inconnu'"
          @click="openDocumentFromTable(item._raw)"
          class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-all group max-w-[180px]"
          :disabled="openingDocumentId === item.id">
          <Icon
            :name="openingDocumentId === item.id ? 'i-heroicons-arrow-path' : 'i-heroicons-document-text'"
            class="w-3.5 h-3.5 shrink-0"
            :class="openingDocumentId === item.id ? 'animate-spin' : 'group-hover:scale-110 transition-transform'" />
          <span class="break-words whitespace-normal min-w-0">{{ value }}</span>
          <Icon name="i-heroicons-arrow-top-right-on-square" class="w-3 h-3 shrink-0 opacity-60 group-hover:opacity-100" />
        </button>
        <span v-else
          class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md max-w-[180px]">
          <Icon name="i-heroicons-document-text" class="w-3.5 h-3.5 shrink-0 opacity-50" />
          <span class="break-words whitespace-normal min-w-0">{{ value || '—' }}</span>
        </span>
      </template>

      <!-- ── Priorité ─────────────────────────────────────────────────── -->
      <template #cell-priority="{ value }">
        <span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border uppercase" :class="{
          'bg-red-50 text-red-700 border-red-100':       value?.toLowerCase() === 'urgent',
          'bg-amber-50 text-amber-700 border-amber-100': value?.toLowerCase() === 'important',
          'bg-sky-50 text-sky-700 border-sky-100':       value?.toLowerCase() === 'standard',
        }">
          {{ value || 'STANDARD' }}
        </span>
      </template>

      <!-- ── Actions ──────────────────────────────────────────────────── -->
      <template #actions="{ item }">
        <div class="flex gap-1.5 justify-end">
          <button @click="handleView(item)" title="Voir les détails"
            class="inline-flex items-center justify-center w-8 h-8 bg-amber-50 text-amber-700 border border-amber-100 rounded-md hover:bg-amber-200 transition-all group">
            <Icon name="i-heroicons-eye" class="w-4 h-4 group-hover:text-yellow-600" />
          </button>
          <button v-if="!isAdmin()" @click="handleQuickAssign(item.id)" title="Affecter ce courrier"
            class="inline-flex items-center justify-center w-8 h-8 bg-sky-50 text-sky-700 border border-sky-100 rounded-md hover:bg-sky-200 transition-all group">
            <Icon name="i-heroicons-paper-airplane" class="w-4 h-4 group-hover:text-blue-600" />
          </button>
          <button
            v-if="!item._raw?.document?.reponses?.length && !isAdmin()"
            @click="handleReply(item)"
            title="Répondre au courrier"
            class="inline-flex items-center justify-center w-8 h-8 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md hover:bg-emerald-200 transition-all group">
            <Icon name="i-heroicons-arrow-uturn-right" class="w-4 h-4 group-hover:text-green-600" />
          </button>
          <div
            v-else-if="!isAdmin()"
            title="Ce courrier a déjà une réponse"
            class="inline-flex items-center justify-center w-8 h-8 bg-green-50 text-green-500 border border-green-100 rounded-md cursor-default">
            <Icon name="i-heroicons-check-circle" class="w-4 h-4" />
          </div>
          <button v-if="isAdmin()" @click="onEdit(item)" title="Modifier ce courrier"
            class="inline-flex items-center justify-center w-8 h-8 bg-sky-50 text-sky-700 border border-sky-100 rounded-md hover:bg-sky-200 transition-all group">
            <Icon name="i-heroicons-pencil" class="w-4 h-4 group-hover:text-blue-600" />
          </button>
          <button v-if="isAdmin()" @click="onDelete(item)" title="Supprimer ce courrier"
            class="inline-flex items-center justify-center w-8 h-8 bg-red-50 text-red-700 border border-red-100 rounded-md hover:bg-red-200 transition-all group">
            <Icon name="i-heroicons-trash" class="w-4 h-4 group-hover:text-red-600" />
          </button>
        </div>
      </template>

    </DataTablePaginate>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
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
const { isAdmin, isSP, isSA } = useAuth()

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
})

// ── Filtres avancés ───────────────────────────────────────────────────────────
const defaultFilters = () => ({
  search:           '',
  numero_enreg:     '',
  reference:        '',
  objet:            '',
  date_enreg:       '',
  date_courrier:    '',
  type_arrivee:     '',
  service_enreg:    '',
  structure:        '',
  priority:         '',
  type_document_id: '',
  confidentiel:     '',
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
  { key: 'source',              label: 'Source',                visible: true,  type: 'badge',    inputHidden: true },
  { key: 'reference',           label: 'Référence',             visible: true,  inputWidth: '80px', inputPlaceholder: 'Réf...' },
  { key: 'numero_enreg',        label: "N° d'enreg.",           visible: true,  inputPlaceholder: 'Enreg...' },
  { key: 'objet',               label: 'Objet',                 visible: true  },
  { key: 'date_enregistrement', label: "Date d'enregistrement", visible: false, filterable: false },
  { key: 'date_courrier',       label: 'Date du Courrier',      visible: false, filterable: false },
  { key: 'url',                 label: 'Document',              visible: false, type: 'document', filterable: false },
  { key: 'type_arrivee',        label: "Type d'arrivée",        visible: false, filterable: false },
  { key: 'priority',            label: 'Priorité',              visible: true,  type: 'badge',    filterable: false },
  { key: 'structure',           label: 'Structure / Usager',    visible: true,  inputPlaceholder: 'Structure...' },
]

// ── Modal ─────────────────────────────────────────────────────────────────────
const detailsOpen      = ref(false)
const selectedCourrier = ref(null)
const loadingReponse   = ref(false)
const reponseData      = ref(null)

// État fichier document arrivé
const arriveeFileLoaded  = ref(false)
const arriveeFileLoading = ref(false)
const arriveeFileError   = ref('')
const ariveeBlobUrl      = ref('')

// État fichier document réponse
const reponseFileLoaded  = ref(false)
const reponseFileLoading = ref(false)
const reponseFileError   = ref('')
const reponseBlobUrl     = ref('')

// Ouverture depuis le tableau
const openingDocumentId = ref(null)

// ── Utilitaires ───────────────────────────────────────────────────────────────
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric'
  })
}

const guessMimeType = (filename) => {
  if (!filename) return ''
  const ext = (filename.split('.').pop() || '').toLowerCase()
  return { pdf: 'application/pdf', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml' }[ext] || ''
}

// ── Construction URL sécurisée : {apiBase}/file/documents/{year}/{month}/{day}/{filename} ──
const buildDocumentUrl = (rawUrl, dateEnreg) => {
  if (!rawUrl || rawUrl === 'Inconnu') return null
  const base     = config.public.apiBase.replace(/\/$/, '')
  const filename = rawUrl.startsWith('/') ? rawUrl.slice(1) : rawUrl
  if (!dateEnreg) return `${base}/file/documents/${filename}`
  const d     = new Date(dateEnreg)
  const year  = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day   = String(d.getDate()).padStart(2, '0')
  return `${base}/file/documents/${year}/${month}/${day}/${filename}`
}

// ── Fetch blob avec token Bearer ──────────────────────────────────────────────
const fetchFileAsBlob = async (rawUrl, dateEnreg) => {
  const url = buildDocumentUrl(rawUrl, dateEnreg)
  if (!url) throw new Error('URL du fichier introuvable')
  const authToken = localStorage.getItem('auth_token') || ''
  const response  = await fetch(url, { headers: { Authorization: `Bearer ${authToken}` } })
  if (!response.ok) throw new Error(`Erreur ${response.status} — fichier non accessible`)
  const blob = await response.blob()
  return { blob, mimeType: blob.type || guessMimeType(rawUrl) }
}

// ── Charger le fichier arrivé dans la modal ───────────────────────────────────
const loadArriveeFile = async () => {
  const rawUrl    = selectedCourrier.value?.document?.url
  const dateEnreg = selectedCourrier.value?.document?.date_enreg
  if (!rawUrl || rawUrl === 'Inconnu') return
  arriveeFileLoading.value = true
  arriveeFileLoaded.value  = false
  arriveeFileError.value   = ''
  if (ariveeBlobUrl.value) { URL.revokeObjectURL(ariveeBlobUrl.value); ariveeBlobUrl.value = '' }

  try {
    const { blob } = await fetchFileAsBlob(rawUrl, dateEnreg)
    ariveeBlobUrl.value     = URL.createObjectURL(blob)
    arriveeFileLoaded.value = true
  } catch (err) {
    console.error('❌ Erreur chargement fichier arrivé:', err)
    arriveeFileError.value = err.message || 'Erreur lors du chargement'
  } finally {
    arriveeFileLoading.value = false
  }
}

// ── Charger le fichier de réponse dans la modal ───────────────────────────────
const loadReponseFile = async () => {
  const rawUrl    = reponseData.value?.rawUrl
  const dateEnreg = reponseData.value?.rawDateEnreg
  if (!rawUrl) return
  reponseFileLoading.value = true
  reponseFileLoaded.value  = false
  reponseFileError.value   = ''
  if (reponseBlobUrl.value) { URL.revokeObjectURL(reponseBlobUrl.value); reponseBlobUrl.value = '' }

  try {
    const { blob } = await fetchFileAsBlob(rawUrl, dateEnreg)
    reponseBlobUrl.value    = URL.createObjectURL(blob)
    reponseFileLoaded.value = true
  } catch (err) {
    console.error('❌ Erreur chargement fichier réponse:', err)
    reponseFileError.value = err.message || 'Erreur lors du chargement'
  } finally {
    reponseFileLoading.value = false
  }
}

// ── Libérer tous les blobs de la modal ───────────────────────────────────────
const revokeModalBlobs = () => {
  if (ariveeBlobUrl.value)  { URL.revokeObjectURL(ariveeBlobUrl.value);  ariveeBlobUrl.value  = '' }
  if (reponseBlobUrl.value) { URL.revokeObjectURL(reponseBlobUrl.value); reponseBlobUrl.value = '' }
}

// ── Ouvrir document depuis le tableau (onglet avec loader) ────────────────────
const openDocumentFromTable = async (courrier) => {
  if (openingDocumentId.value) return
  const rawUrl    = courrier?.document?.url
  const dateEnreg = courrier?.document?.date_enreg  // date ISO brute
  if (!rawUrl || rawUrl === 'Inconnu') return

  openingDocumentId.value = courrier.id

  const newTab = window.open('', '_blank')
  if (newTab) {
    newTab.document.write(`
      <html>
        <head><title>Chargement...</title></head>
        <body style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;color:#64748b;background:#f8fafc;">
          <div style="text-align:center;gap:12px;display:flex;flex-direction:column;align-items:center;">
            <div style="width:32px;height:32px;border:3px solid #e2e8f0;border-top-color:#6366f1;border-radius:50%;animation:spin 0.8s linear infinite;"></div>
            <p style="font-size:13px;font-weight:600;">Chargement du fichier...</p>
            <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
          </div>
        </body>
      </html>
    `)
  }

  try {
    const { blob } = await fetchFileAsBlob(rawUrl, dateEnreg)
    const blobUrl  = URL.createObjectURL(blob)
    if (newTab && !newTab.closed) {
      newTab.location.href = blobUrl
    } else {
      window.open(blobUrl, '_blank', 'noopener,noreferrer')
    }
    setTimeout(() => URL.revokeObjectURL(blobUrl), 15000)
  } catch (err) {
    console.error('❌ Erreur ouverture fichier:', err)
    if (newTab && !newTab.closed) {
      newTab.document.body.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;">
          <div style="text-align:center;color:#ef4444;">
            <p style="font-size:14px;font-weight:600;">Erreur de chargement</p>
            <p style="font-size:12px;color:#94a3b8;margin-top:8px;">${err.message}</p>
          </div>
        </div>`
    }
  } finally {
    openingDocumentId.value = null
  }
}

// ── Transform (on garde le nom brut, pas d'URL construite) ───────────────────
const transformCourriers = (response) => {
  if (!response?.data) throw new Error('Format de réponse API invalide')
  return response.data.map((courrier) => ({
    id:                   courrier.id,
    source:               courrier.service_enreg || '',
    numero_enreg:         courrier.document?.numero_enreg || '',
    reference:            courrier.document?.reference    || '',
    structure:            courrier.structure || courrier.autre_structure || '',
    date_enregistrement:  formatDate(courrier.document?.date_enreg),
    objet:                courrier.document?.objet        || '',
    date_courrier:        formatDate(courrier.document?.date_courrier),
    // On ne construit plus d'URL directe — le nom brut suffit pour fetchFileAsBlob
    url:                  (courrier.document?.url && courrier.document.url !== 'Inconnu') ? courrier.document.url : '',
    type_arrivee:         courrier.type_arrivee || '',
    priority:             courrier.priority     || '',
    _raw:                 courrier,
  }))
}

// ── Chargement options filtres ────────────────────────────────────────────────
const loadFilterOptions = async () => {
  try {
    const authToken = localStorage.getItem('auth_token') || ''
    const base      = config.public.apiBase.replace(/\/$/, '')
    const response  = await $fetch(`${base}/courriers-arrives/filters`, {
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

    const f = searchFilters.value
    if (f.search)            params.append('search',           f.search)
    if (f.numero_enreg)      params.append('numero_enreg',     f.numero_enreg)
    if (f.reference)         params.append('reference',        f.reference)
    if (f.objet)             params.append('objet',            f.objet)
    if (f.date_enreg    && f.date_enreg.length    === 10) params.append('date_enreg',    f.date_enreg)
    if (f.date_courrier && f.date_courrier.length === 10) params.append('date_courrier', f.date_courrier)
    if (f.type_arrivee)      params.append('type_arrivee',     f.type_arrivee)
    if (f.service_enreg)     params.append('service_enreg',    f.service_enreg)
    if (f.structure)         params.append('structure',        f.structure)
    if (f.priority)          params.append('priority',         f.priority)
    if (f.type_document_id)  params.append('type_document_id', f.type_document_id)
    if (f.confidentiel)      params.append('confidentiel',     f.confidentiel)

    const c = columnFilters.value
    if (!f.numero_enreg  && c.numero_enreg)  params.append('numero_enreg',  c.numero_enreg)
    if (!f.reference     && c.reference)     params.append('reference',     c.reference)
    if (!f.objet         && c.objet)         params.append('objet',         c.objet)
    if (!f.service_enreg && c.source)        params.append('service_enreg', c.source)
    if (!f.structure     && c.structure)     params.append('structure',     c.structure)

    const response = await $fetch(`${base}/courriers-arrives?${params.toString()}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })

    courriers.value   = transformCourriers(response)
    currentPage.value = response.meta.current_page
    totalPages.value  = response.meta.last_page
    total.value       = response.meta.total

  } catch (err) {
    console.error('❌ Erreur chargement courriers arrivés:', err)
    error.value = err.message || 'Erreur lors du chargement'
  } finally {
    initialLoading.value = false
    loading.value        = false
  }
}

// ── Watch filtres avancés ─────────────────────────────────────────────────────
let searchTimeout = null
watch(searchFilters, (f) => {
  const dateEnregOk   = !f.date_enreg    || f.date_enreg.length    === 10
  const dateCourierOk = !f.date_courrier || f.date_courrier.length === 10
  if (!dateEnregOk || !dateCourierOk) return
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    refresh(1, perPage.value, false)
  }, 400)
}, { deep: true })

// ── Handlers pagination ───────────────────────────────────────────────────────
const onPageChange    = (page) => refresh(page, perPage.value, false)
const onPerPageChange = (val)  => { perPage.value = val; refresh(1, val, false) }
const onSearchChange  = (val)  => {
  searchFilters.value.search = val
  currentPage.value = 1
  refresh(1, perPage.value, false)
}

// ── Ouvrir la modal détails ───────────────────────────────────────────────────
const handleView = async (item) => {
  const courrier = item._raw || item

  revokeModalBlobs()
  selectedCourrier.value   = courrier
  arriveeFileLoaded.value  = false
  arriveeFileLoading.value = false
  arriveeFileError.value   = ''
  reponseFileLoaded.value  = false
  reponseFileLoading.value = false
  reponseFileError.value   = ''
  reponseData.value        = null
  detailsOpen.value        = true

  const reponses = courrier.document?.reponses || []
  if (reponses.length) {
    const courierDepartId = reponses[0]?.reponse_id
    if (courierDepartId) await loadReponseData(courierDepartId)
  }
}

const closeDetails = () => {
  revokeModalBlobs()
  detailsOpen.value        = false
  selectedCourrier.value   = null
  reponseData.value        = null
  arriveeFileLoaded.value  = false
  arriveeFileError.value   = ''
  reponseFileLoaded.value  = false
  reponseFileError.value   = ''
}

// ── Charger le courrier de réponse ────────────────────────────────────────────
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

    const rawUrl = (doc?.document?.url || '').trim()

    reponseData.value = {
      reference:    doc?.document?.reference || 'Sans référence',
      objet:        doc?.document?.objet     || 'Non spécifié',
      destinataire: doc?.destinataire        || '—',
      date_depart:  doc?.date_depart         || null,
      type_depart:  doc?.type_depart         || null,
      service_emis: doc?.service_emis        || null,
      rawUrl:       (rawUrl && rawUrl !== 'Inconnu') ? rawUrl : null,
      rawDateEnreg: doc?.document?.date_enreg || null,  // date ISO pour buildDocumentUrl
    }
  } catch (e) {
    console.error('❌ Erreur chargement réponse:', e)
    reponseData.value = null
  } finally {
    loadingReponse.value = false
  }
}

// ── Handlers actions ──────────────────────────────────────────────────────────
const handleQuickAssign = (courrierId) => {
  store.selectCourrierFromQuickAction(courrierId)
  navigateTo('/affectations/create')
}

const handleReply = (item) => {
  const courrier = item._raw || item
  if (courrier.document?.reponses?.length) {
    Swal.fire({ title: 'Déjà répondu', text: 'Ce courrier a déjà reçu une réponse.', icon: 'info', confirmButtonColor: '#2563eb' })
    return
  }
  courriersStore.setCourrierToReply(courrier)
  navigateTo('/courriers/form_courrier_depart')
}

const onEdit = (item) => navigateTo(`/courriers/edit/${item.id}`)

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
:deep(.swal2-cancel):hover { background-color: #4b5563 !important; }
:deep(.line-clamp-2) {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>