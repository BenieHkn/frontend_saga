<template>
  <div class="min-h-screen bg-slate-100 p-6 font-sans">

    <UModal v-model="detailsOpen" :ui="{ width: 'sm:max-w-5xl' }">
      <div v-if="selectedCourrier" class="flex flex-col max-h-[90vh] bg-white rounded-xl overflow-hidden">

        <div class="relative flex items-center justify-between px-6 py-4 shrink-0 overflow-hidden"
          style="background: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%);">
          <div class="absolute inset-0 opacity-10"
            style="background-image: radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px); background-size: 32px 32px;"></div>
          <div class="relative flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner border border-white/30">
              <Icon name="i-heroicons-paper-airplane" class="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 class="text-base font-bold text-white leading-tight">Détails du courrier départ</h2>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="text-xs text-emerald-100 font-medium">N° {{ selectedCourrier.document?.numero_enreg || '—' }}</span>
                <span v-if="selectedCourrier.confidentiel"
                  class="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-white/20 text-white border border-white/30">
                  <Icon name="i-heroicons-lock-closed" class="w-3 h-3" /> Confidentiel
                </span>
                <span v-if="selectedCourrier.document?.large_diffusion"
                  class="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-white/20 text-white border border-white/30">
                  <Icon name="i-heroicons-megaphone" class="w-3 h-3" /> Large diffusion
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
            <div class="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Icon name="i-heroicons-paper-airplane" class="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <span class="text-[11px] font-bold text-emerald-700 uppercase tracking-widest">Courrier départ</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span v-if="selectedCourrier.type_depart"
                  class="inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full border uppercase bg-emerald-50 text-emerald-700 border-emerald-200">
                  {{ selectedCourrier.type_depart }}
                </span>
              </div>
            </div>

            <div class="p-4 space-y-3">
              <div class="grid grid-cols-1 gap-2">
                <div class="group flex items-stretch gap-0 rounded-xl overflow-hidden border border-indigo-100 hover:border-indigo-200 transition-colors">
                  <div class="w-1 shrink-0 bg-gradient-to-b from-indigo-400 to-indigo-600"></div>
                  <div class="flex-1 p-3 bg-gradient-to-r from-indigo-50 to-transparent">
                    <p class="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-0.5">Référence</p>
                    <p class="text-sm font-bold text-indigo-900">{{ selectedCourrier.document?.reference || 'Sans référence' }}</p>
                  </div>
                </div>
                <div class="group flex items-stretch gap-0 rounded-xl overflow-hidden border border-amber-100 hover:border-amber-200 transition-colors">
                  <div class="w-1 shrink-0 bg-gradient-to-b from-amber-400 to-amber-500"></div>
                  <div class="flex-1 p-3 bg-gradient-to-r from-amber-50 to-transparent">
                    <p class="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-0.5">Objet</p>
                    <p class="text-sm text-gray-800 leading-relaxed">{{ selectedCourrier.document?.objet || 'Non spécifié' }}</p>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                <div class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-300 inline-block"></span>Source
                  </p>
                  <p class="text-xs font-semibold text-slate-800">{{ selectedCourrier.service_emis || 'N/A' }}</p>
                </div>
                <div class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>Destinataire
                  </p>
                  <p class="text-xs font-semibold text-slate-800">{{ selectedCourrier.destinataire || '—' }}</p>
                </div>
                <div class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>Type de départ
                  </p>
                  <p class="text-xs text-slate-800">{{ selectedCourrier.type_depart || 'Non spécifié' }}</p>
                </div>
                <div class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-indigo-300 inline-block"></span>N° enregistrement
                  </p>
                  <p class="text-xs font-semibold text-slate-800">{{ selectedCourrier.document?.numero_enreg || '—' }}</p>
                </div>
                <div class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>Date d'enregistrement
                  </p>
                  <p class="text-xs text-slate-800">{{ formatDate(selectedCourrier.document?.date_enreg) || '—' }}</p>
                </div>
                <div class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>Date de départ
                  </p>
                  <p class="text-xs text-slate-800">{{ formatDate(selectedCourrier.date_depart) || '—' }}</p>
                </div>
                <div v-if="selectedCourrier.document?.type_document?.libelle"
                  class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-300 inline-block"></span>Type de document
                  </p>
                  <p class="text-xs text-slate-800">{{ selectedCourrier.document.type_document.libelle }}</p>
                </div>
                <div v-if="selectedCourrier.document?.date_courrier"
                  class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>Date du courrier
                  </p>
                  <p class="text-xs text-slate-800">{{ formatDate(selectedCourrier.document.date_courrier) }}</p>
                </div>
              </div>

              <div v-if="selectedCourrier.initiateurs?.length"
                class="flex items-stretch gap-0 rounded-xl overflow-hidden border border-sky-100 hover:border-sky-200 transition-colors">
                <div class="w-1 shrink-0 bg-gradient-to-b from-sky-400 to-blue-500"></div>
                <div class="flex-1 p-3 bg-gradient-to-r from-sky-50 to-transparent">
                  <p class="text-[10px] font-bold text-sky-500 uppercase tracking-wider mb-2">Initiateurs</p>
                  <div class="flex flex-wrap gap-1.5">
                    <span v-for="(initiateur, i) in selectedCourrier.initiateurs" :key="i"
                      class="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-sky-700 bg-white border border-sky-200 rounded-full shadow-sm">
                      <Icon name="i-heroicons-user-circle" class="w-3.5 h-3.5 text-sky-400" />
                      {{ initiateur.user?.nom || '' }} {{ initiateur.user?.prenom || '' }}
                      <span v-if="initiateur.entite?.code || initiateur.entite?.libelle" class="text-sky-400">
                        ({{ initiateur.entite?.code || initiateur.entite?.libelle }})
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div class="pt-1">
                <div v-if="departUrl">
                  <button v-if="!showDepartDoc" @click="showDepartDoc = true"
                    class="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all hover:shadow-sm">
                    <Icon name="i-heroicons-document-arrow-down" class="w-4 h-4" />
                    Charger le document
                  </button>
                  <div v-else class="mt-2 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                    <DocumentRpreview :file-preview-url="departUrl" height="400px" />
                  </div>
                </div>
                <div v-else class="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-400 bg-slate-50 border border-slate-200 rounded-xl cursor-not-allowed">
                  <Icon name="i-heroicons-document-text" class="w-4 h-4" />
                  Aucun document disponible
                </div>
              </div>
            </div>
          </section>
        </div>

        <div class="px-6 py-3.5 border-t border-slate-100 shrink-0 flex items-center justify-between bg-white">
          <span class="text-[10px] text-slate-400">{{ selectedCourrier.document?.reference || '' }}</span>
          <UButton color="gray" variant="outline" size="sm" @click="closeDetails">Fermer</UButton>
        </div>
      </div>
    </UModal>

    <PageHeader
      v-if="!isAdmin()"
      title="Courriers Départs"
      subtitle="Gestion et suivi des courriers sortants — 12 derniers mois"
      btnText="Nouveau"
      to="/courriers/form_courrier_depart" />
    <PageHeader
      v-else
      title="Courriers Départs"
      subtitle="Gestion et suivi des courriers sortants — 12 derniers mois" />

    <div v-if="initialLoading" class="flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
      <div class="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <span class="text-sm font-medium">Chargement des données...</span>
    </div>

    <div v-else-if="error" class="flex items-center gap-4 p-5 bg-red-50 border border-red-200 rounded-xl max-w-2xl">
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
      :left-aligned-columns="['reference', 'structure', 'numero_enreg', 'objet', 'initiateurs']"
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
            <div class="flex-1 min-w-[150px]">
              <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Date de départ (jj/mm/aaaa)</label>
              <input v-model="searchFilters.date_depart" placeholder="ex: 15/03/2024"
                class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                @input="onFiltersChange" />
            </div>
          </div>

          <div class="flex flex-wrap gap-3">
            <div class="flex-1 min-w-[180px]">
              <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Type de document</label>
              <SearchableSelect
                v-model="searchFilters.type_document_id"
                :options="filterOptionsData.types_document.map(t => ({ value: t.id, label: `${t.code} — ${t.libelle}` }))"
                placeholder="Tous"
                @change="onFiltersChange" />
            </div>
            <div class="flex-1 min-w-[140px]">
              <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Service émetteur</label>
              <SearchableSelect
                v-model="searchFilters.service_emis"
                :options="filterOptionsData.services_emis.map(s => ({ value: s, label: s }))"
                placeholder="Tous"
                @change="onFiltersChange" />
            </div>
            <div class="flex-1 min-w-[160px]">
              <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Destinataire</label>
              <SearchableSelect
                v-model="searchFilters.destinataire"
                :options="filterOptionsData.destinataires.map(d => ({ value: d, label: d }))"
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

      <template #cell-source="{ value }">
        <span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
          {{ value }}
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

      <template #cell-type_document="{ value }">
        <span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
          {{ value || 'N/A' }}
        </span>
      </template>

      <template #cell-large_diffusion="{ value }">
        <span v-if="value" class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-100">Oui</span>
        <span v-else class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-gray-50 text-gray-700 border border-gray-100">Non</span>
      </template>

      <template #cell-confidentiel="{ value }">
        <span v-if="value" class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-red-50 text-red-700 border border-red-100">Oui</span>
        <span v-else class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-gray-50 text-gray-700 border border-gray-100">Non</span>
      </template>

      <template #cell-initiateurs="{ value }">
        <div v-if="value && value.length > 0" class="flex flex-col gap-1 max-w-[150px]">
          <span v-for="(initiateur, index) in value" :key="index"
            class="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-sky-700 bg-sky-50 border border-sky-100 rounded-full whitespace-normal break-words min-w-0">
            <Icon name="i-heroicons-user" class="w-3 h-3 shrink-0" />
            {{ initiateur }}
          </span>
        </div>
        <span v-else class="text-xs text-slate-400 italic">—</span>
      </template>

      <template #actions="{ item }">
        <div class="flex gap-1.5 justify-end">
          <button @click="handleView(item)" title="Voir les détails"
            class="inline-flex items-center justify-center w-8 h-8 bg-amber-50 text-amber-700 border border-amber-100 rounded-md hover:bg-amber-200 transition-all group">
            <Icon name="i-heroicons-eye" class="w-4 h-4 group-hover:text-yellow-600" />
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
import { useAuth } from '~/composables/auth/useAuth'

const props = defineProps({
  entiteId: { type: Number, default: null }
})

const config    = useRuntimeConfig()
const { isAdmin } = useAuth()

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
  types_depart:   [],
  services_emis:  [],
  destinataires:  [],
})

// ── Filtres avancés ───────────────────────────────────────────────────────────
const defaultFilters = () => ({
  search:           '',
  numero_enreg:     '',
  reference:        '',
  objet:            '',
  date_enreg:       '',
  date_courrier:    '',
  date_depart:      '',
  type_document_id: '',
  service_emis:     '',
  destinataire:     '',
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
  { key: 'reference',           label: 'Référence',           visible: true,  inputWidth: '80px', inputPlaceholder: 'Réf...' },
  { key: 'objet',               label: 'Objet',               visible: true,  inputPlaceholder: 'Objet...' },
  { key: 'structure',           label: 'Destinataire',        visible: true,  inputPlaceholder: 'Destinataire...' },
  { key: 'numero_enreg',        label: "N° d'enregistrement", visible: true,  inputPlaceholder: 'Enreg...' },
  { key: 'type_document',       label: 'Type de document',    visible: true,  filterable: false },
  { key: 'initiateurs',         label: 'Initiateurs',         visible: true,  inputHidden: true, sortable: false, filterable: false },
  { key: 'date_enregistrement', label: "Date d'enregistrement", visible: false, filterable: false },
  { key: 'date_courrier',       label: 'Date du Courrier',    visible: false, filterable: false },
  { key: 'url',                 label: 'Document',            visible: false, type: 'document', filterable: false },
  { key: 'type_depart',         label: 'Type de départ',      visible: false, filterable: false },
  { key: 'date_depart',         label: 'Date de départ',      visible: false, filterable: false },
  { key: 'large_diffusion',     label: 'Large diffusion',     visible: false, filterable: false },
  { key: 'confidentiel',        label: 'Confidentiel',        visible: false, filterable: false },
]

// ── Modal ─────────────────────────────────────────────────────────────────────
const detailsOpen      = ref(false)
const selectedCourrier = ref(null)
const showDepartDoc    = ref(false)

const departUrl = computed(() => {
  const raw = selectedCourrier.value?.document?.url
  const url = raw?.trim?.()
  if (!url || url === 'Inconnu' || url === '') return null
  if (url.startsWith('http')) return url
  const base = config.public.baseUrl?.replace(/\/$/, '')
  const path = url.startsWith('/') ? url : `/${url}`
  return `${base}${path}`
})

const handleView = (item) => {
  selectedCourrier.value = item._raw || item
  showDepartDoc.value    = false
  detailsOpen.value      = true
}

const closeDetails = () => {
  detailsOpen.value      = false
  selectedCourrier.value = null
  showDepartDoc.value    = false
}

// ── Utilitaires ───────────────────────────────────────────────────────────────
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric'
  })
}

const transformCourriers = (response) => {
  if (!response?.data) throw new Error('Format de réponse API invalide')
  return response.data.map((courrier) => {
    const initiateursList = (courrier.initiateurs || []).map(i => {
      const nom    = i.user?.nom    || ''
      const prenom = i.user?.prenom || ''
      const code   = i.entite?.code || i.entite?.libelle || ''
      return `${nom} ${prenom}${code ? ` (${code})` : ''}`.trim()
    }).filter(Boolean)

    return {
      id:                   courrier.id,
      source:               courrier.service_emis || '',
      numero_enreg:         courrier.document?.numero_enreg || '',
      reference:            courrier.document?.reference    || '',
      structure:            courrier.destinataire           || '',
      date_enregistrement:  formatDate(courrier.document?.date_enreg),
      objet:                courrier.document?.objet        || '',
      date_courrier:        formatDate(courrier.document?.date_courrier),
      url:                  courrier.document?.url && courrier.document?.url !== 'Inconnu'
                              ? (courrier.document.url.startsWith('http')
                                  ? courrier.document.url
                                  : `${config.public.baseUrl}${courrier.document.url}`)
                              : '',
      type_depart:          courrier.type_depart                           || '',
      date_depart:          formatDate(courrier.date_depart),
      type_document:        courrier.document?.type_document?.libelle      || '',
      large_diffusion:      courrier.document?.large_diffusion             || false,
      confidentiel:         courrier.confidentiel                          || false,
      initiateurs:          initiateursList,
      _raw:                 courrier,
    }
  })
}

// ── Chargement options filtres ────────────────────────────────────────────────
const loadFilterOptions = async () => {
  try {
    const authToken = localStorage.getItem('auth_token') || ''
    const base      = config.public.apiBase.replace(/\/$/, '')
    const response  = await $fetch(`${base}/courriers-departs/filters`, {
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
      if (selectedEntite?.code) params.append('service_emis_entite', selectedEntite.code)
    }

    // ── Filtres avancés ──────────────────────────────────────────────────
    const f = searchFilters.value
    if (f.search)            params.append('search',           f.search)
    if (f.numero_enreg)      params.append('numero_enreg',     f.numero_enreg)
    if (f.reference)         params.append('reference',        f.reference)
    if (f.objet)             params.append('objet',            f.objet)
    if (f.date_enreg    && f.date_enreg.length    === 10) params.append('date_enreg',    f.date_enreg)
    if (f.date_courrier && f.date_courrier.length === 10) params.append('date_courrier', f.date_courrier)
    if (f.date_depart   && f.date_depart.length   === 10) params.append('date_depart',   f.date_depart)
    if (f.type_document_id)  params.append('type_document_id', f.type_document_id)
    if (f.service_emis)      params.append('service_emis',     f.service_emis)
    if (f.destinataire)      params.append('destinataire',     f.destinataire)

    // ── Filtres colonnes ─────────────────────────────────────────────────
    const c = columnFilters.value
    if (!f.numero_enreg && c.numero_enreg) params.append('numero_enreg',  c.numero_enreg)
    if (!f.reference    && c.reference)    params.append('reference',     c.reference)
    if (!f.objet        && c.objet)        params.append('objet',         c.objet)
    if (!f.service_emis && c.source)       params.append('service_emis',  c.source)
    if (!f.destinataire && c.structure)    params.append('destinataire',  c.structure)

    const response = await $fetch(`${base}/courriers-departs?${params.toString()}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })

    courriers.value   = transformCourriers(response)
    currentPage.value = response.meta.current_page
    totalPages.value  = response.meta.last_page
    total.value       = response.meta.total

  } catch (err) {
    console.error('❌ Erreur chargement courriers départs:', err)
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
  const dateDepartOk  = !f.date_depart   || f.date_depart.length   === 10
  if (!dateEnregOk || !dateCourierOk || !dateDepartOk) return

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

const onOpenDocument = (url) => {
  if (url) window.open(url, '_blank', 'noopener,noreferrer')
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
:deep(.swal2-confirm) {
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
:deep(td) {
  overflow: visible !important;
  white-space: normal !important;
}
</style>