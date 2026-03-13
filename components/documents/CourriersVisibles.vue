<template>
  <div class="flex items-center justify-between mb-6">
    <h1 class="flex items-center gap-3 text-2xl font-bold text-slate-800">
      <Icon name="i-heroicons-eye" class="w-7 h-7 text-blue-600" />
      Initiés/Paraphés
    </h1>
    <div class="flex items-center gap-3">
      <button @click="refresh(currentPage, perPage, false)"
        class="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all hover:shadow-md">
        <Icon name="i-heroicons-arrow-path" class="w-4 h-4" />
        Actualiser
      </button>
      <UBadge color="blue" variant="soft" size="lg">
        <Icon name="i-heroicons-document-text" class="h-4 w-4 mr-1" />
        <span class="text-sm">{{ total }} courrier{{ total > 1 ? 's' : '' }}</span>
      </UBadge>
    </div>
  </div>

  <!-- ── Modal détails ── -->
  <UModal v-model="detailsOpen" :ui="{ width: 'sm:max-w-3xl' }">
    <div v-if="selectedCourrier" class="flex flex-col max-h-[90vh] bg-white rounded-xl overflow-hidden">

      <!-- En-tête gradient -->
      <div class="relative flex items-center justify-between px-6 py-4 shrink-0 overflow-hidden"
        style="background: linear-gradient(135deg, #ea580c 0%, #f97316 50%, #fb923c 100%);">
        <div class="absolute inset-0 opacity-10"
          style="background-image: radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px); background-size: 32px 32px;"></div>
        <div class="relative flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner border border-white/30">
            <Icon name="i-heroicons-paper-airplane" class="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 class="text-base font-bold text-white leading-tight">Détails du courrier départ</h2>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-xs text-orange-200 font-medium">{{ selectedCourrier.numero_enreg || '—' }}</span>
              <span v-if="selectedCourrier.confidentiel"
                class="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-red-400/30 text-red-100 border border-red-300/50">
                <Icon name="i-heroicons-lock-closed" class="w-3 h-3" /> Confidentiel
              </span>
            </div>
          </div>
        </div>
        <button @click="closeDetails"
          class="relative w-8 h-8 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 transition-all text-white border border-white/20">
          <Icon name="i-heroicons-x-mark" class="w-4 h-4" />
        </button>
      </div>

      <!-- Corps -->
      <div class="overflow-y-auto flex-1 p-5 space-y-4 bg-slate-50/50">
        <section class="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
          <div class="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
            <div class="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center">
              <Icon name="i-heroicons-paper-airplane" class="w-3.5 h-3.5 text-orange-600" />
            </div>
            <span class="text-[11px] font-bold text-orange-700 uppercase tracking-widest">Courrier départ</span>
          </div>

          <div class="p-4 space-y-3">
            <div class="grid grid-cols-1 gap-2">
              <div class="flex items-stretch gap-0 rounded-xl overflow-hidden border border-orange-100 hover:border-orange-200 transition-colors">
                <div class="w-1 shrink-0 bg-gradient-to-b from-orange-400 to-red-500"></div>
                <div class="flex-1 p-3 bg-gradient-to-r from-orange-50 to-transparent">
                  <p class="text-[10px] font-bold text-orange-400 uppercase tracking-wider mb-0.5">Référence</p>
                  <p class="text-sm font-bold text-orange-900">{{ selectedCourrier.reference || 'Sans référence' }}</p>
                </div>
              </div>
              <div class="flex items-stretch gap-0 rounded-xl overflow-hidden border border-amber-100 hover:border-amber-200 transition-colors">
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
                  <span class="w-1.5 h-1.5 rounded-full bg-orange-300 inline-block"></span>Service émetteur
                </p>
                <p class="text-xs font-semibold text-slate-800">{{ selectedCourrier.service_emis || '—' }}</p>
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
                <p class="text-xs text-slate-800">{{ selectedCourrier.type_depart || '—' }}</p>
              </div>
              <div class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>Date de départ
                </p>
                <p class="text-xs text-slate-800">{{ selectedCourrier.date_depart || '—' }}</p>
              </div>
              <div v-if="selectedCourrier.date_enreg" class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>Date d'enregistrement
                </p>
                <p class="text-xs text-slate-800">{{ selectedCourrier.date_enreg }}</p>
              </div>
              <div v-if="selectedCourrier.type_document" class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-green-300 inline-block"></span>Type de document
                </p>
                <p class="text-xs text-slate-800">{{ selectedCourrier.type_document }}</p>
              </div>
            </div>

            <div v-if="selectedCourrier.initiateurs"
              class="flex items-stretch gap-0 rounded-xl overflow-hidden border border-blue-100 hover:border-blue-200 transition-colors">
              <div class="w-1 shrink-0 bg-gradient-to-b from-blue-400 to-violet-600"></div>
              <div class="flex-1 p-3 bg-gradient-to-r from-blue-50 to-transparent">
                <p class="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1.5">Initiateurs</p>
                <p class="text-xs text-slate-800 leading-relaxed">{{ selectedCourrier.initiateurs }}</p>
              </div>
            </div>

            <!-- ── Preview document ── -->
            <div class="pt-1">
              <div v-if="selectedCourrier._raw?.document?.url && selectedCourrier._raw.document.url !== 'Inconnu'">
                <!-- Pas encore chargé -->
                <button
                  v-if="!docFileLoaded && !docFileLoading && !docFileError"
                  @click="loadDocFile"
                  class="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl transition-all hover:shadow-sm">
                  <Icon name="i-heroicons-document-arrow-down" class="w-4 h-4" />
                  Charger le document
                </button>
                <!-- Chargement -->
                <div v-else-if="docFileLoading"
                  class="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-400">
                  <div class="w-4 h-4 border-2 border-slate-200 border-t-orange-500 rounded-full animate-spin"></div>
                  Chargement...
                </div>
                <!-- Erreur -->
                <div v-else-if="docFileError"
                  class="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-500 bg-red-50 border border-red-200 rounded-xl">
                  <Icon name="i-heroicons-exclamation-triangle" class="w-4 h-4 shrink-0" />
                  {{ docFileError }}
                  <button @click="docFileError = ''; loadDocFile()" class="ml-1 underline hover:no-underline">Réessayer</button>
                </div>
                <!-- Preview -->
                <div v-else-if="docFileLoaded" class="mt-2 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                  <DocumentRpreview :file-preview-url="docBlobUrl" height="400px" />
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

      <!-- Pied modal -->
      <div class="px-6 py-3.5 border-t border-slate-100 shrink-0 flex items-center justify-between bg-white">
        <span class="text-[10px] text-slate-400">{{ selectedCourrier.reference || '' }}</span>
        <UButton color="gray" variant="outline" size="sm" @click="closeDetails">Fermer</UButton>
      </div>
    </div>
  </UModal>

  <!-- Erreur -->
  <div v-if="error"
    class="flex items-center gap-4 p-5 mb-5 bg-red-50 border border-red-200 rounded-xl max-w-2xl">
    <Icon name="i-heroicons-exclamation-triangle" class="w-8 h-8 text-red-600 shrink-0" />
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

  <!-- DataTablePaginate -->
  <DataTablePaginate
    :loading="loading"
    :data="courrierData"
    :columns="columns"
    :selectable="false"
    :show-row-numbers="true"
    :default-sort-column="null"
    :show-actions="true"
    :default-actions="[]"
    :items-per-page-options="[10, 25, 50, 100]"
    :default-items-per-page="25"
    :left-aligned-columns="['objet', 'destinataire', 'service_emis']"
    :external-pagination="true"
    :external-total="total"
    :external-page="currentPage"
    :external-last-page="totalPages"
    :external-per-page="perPage"
    @search-change="onSearchChange"
    @page-change="onPageChange"
    @per-page-change="onPerPageChange"
    @column-filter-change="onColumnFilterChange">

    <!-- ── Filtres avancés ── -->
    <template #advanced-filters>
      <div class="space-y-4">
        <div class="flex flex-wrap gap-3">
          <div class="flex-1 min-w-[140px]">
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Référence</label>
            <input v-model="searchFilters.reference" placeholder="Filtrer..."
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
          </div>
          <div class="flex-1 min-w-[200px]">
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Objet</label>
            <input v-model="searchFilters.objet" placeholder="Filtrer..."
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
          </div>
          <div class="flex-1 min-w-[150px]">
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Destinataire</label>
            <input v-model="searchFilters.destinataire" placeholder="Filtrer..."
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
          </div>
          <div class="flex-1 min-w-[150px]">
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Service émetteur</label>
            <input v-model="searchFilters.service_emis" placeholder="Filtrer..."
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
          </div>
        </div>
        <div class="flex flex-wrap gap-3">
          <div class="flex-1 min-w-[150px]">
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Date de départ (début)</label>
            <input v-model="searchFilters.date_depart_from" type="date"
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
          </div>
          <div class="flex-1 min-w-[150px]">
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Date de départ (fin)</label>
            <input v-model="searchFilters.date_depart_to" type="date"
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
          </div>
          <div class="flex-1 min-w-[140px]">
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Type de départ</label>
            <select v-model="searchFilters.type_depart"
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all">
              <option value="">Tous</option>
              <option v-for="t in filterOptions.types_depart" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>
          <div class="flex-1 min-w-[140px]">
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Confidentialité</label>
            <select v-model="searchFilters.confidentiel"
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all">
              <option value="">Tous</option>
              <option value="false">Standard</option>
              <option value="true">Confidentiel</option>
            </select>
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

    <!-- ── Cellule objet ── -->
    <template #cell-objet="{ value }">
      <span class="block text-xs text-slate-800 leading-relaxed whitespace-normal break-words min-w-[200px]" :title="value">
        {{ value }}
      </span>
    </template>

    <!-- ── Référence cliquable → ouvre via Blob ── -->
    <template #cell-reference="{ value, item }">
      <div class="w-full">
        <button
          v-if="item._raw?.document?.url && item._raw.document.url !== 'Inconnu'"
          @click="handleViewDetails(item)"
          :disabled="openingDocumentId === item.id"
          class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-all group max-w-[180px]"
          :title="`Ouvrir le document ${value}`">
          <Icon
            :name="openingDocumentId === item.id ? 'i-heroicons-arrow-path' : 'i-heroicons-document-text'"
            class="w-3.5 h-3.5 shrink-0"
            :class="openingDocumentId === item.id ? 'animate-spin' : 'group-hover:scale-110 transition-transform'" />
          <span class="break-words whitespace-normal min-w-0">{{ value }}</span>
          <Icon name="i-heroicons-arrow-top-right-on-square" class="w-3 h-3 shrink-0 opacity-60 group-hover:opacity-100" />
        </button>
        <span v-else
          class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md max-w-[180px]"
          :title="value">
          <Icon name="i-heroicons-document-text" class="w-3.5 h-3.5 shrink-0 opacity-50" />
          <span class="break-words whitespace-normal min-w-0">{{ value }}</span>
        </span>
      </div>
    </template>

    <!-- ── Cellule confidentialité ── -->
    <template #cell-confidentiel="{ value }">
      <span v-if="value" class="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-red-700 bg-red-50 rounded-full">
        <Icon name="i-heroicons-lock-closed" class="w-3 h-3" /> Confidentiel
      </span>
      <span v-else class="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-green-700 bg-green-50 rounded-full">
        <Icon name="i-heroicons-lock-open" class="w-3 h-3" /> Standard
      </span>
    </template>

    <!-- ── Actions ── -->
    <template #actions="{ item }">
      <div class="flex gap-1.5 justify-end">
        <button @click="handleViewDetails(item)" title="Voir les détails"
          class="inline-flex items-center justify-center w-8 h-8 bg-amber-50 text-amber-700 border border-amber-100 rounded-md hover:bg-amber-200 hover:text-amber-900 transition-all group">
          <Icon name="i-heroicons-eye" class="w-4 h-4 group-hover:text-yellow-600" />
        </button>
      </div>
    </template>

  </DataTablePaginate>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import DataTablePaginate from '~/components/DataTablePaginate.vue'
import DocumentRpreview from '~/components/DocumentRpreview.vue'

const config = useRuntimeConfig()
const toast  = useToast()

// ── Colonnes ──────────────────────────────────────────────────────────────────
const columns = [
  { key: 'reference',    label: 'Référence',        visible: true,  inputPlaceholder: 'Réf...' },
  { key: 'objet',        label: 'Objet',             visible: true  },
  { key: 'type_document',label: 'Type document',     visible: true,  filterable: false },
  { key: 'date_depart',  label: 'Date départ',       visible: true,  filterable: false },
  { key: 'service_emis', label: 'Service émetteur',  visible: true,  inputPlaceholder: 'Service...' },
  { key: 'destinataire', label: 'Destinataire',      visible: true,  inputPlaceholder: 'Destinataire...' },
  { key: 'initiateurs',  label: 'Initiateur(s)',     visible: false, filterable: false },
  { key: 'type_depart',  label: 'Type',              visible: false, filterable: false },
  { key: 'confidentiel', label: 'Confidentialité',   visible: false, filterable: false },
]

// ── État table ────────────────────────────────────────────────────────────────
const courrierData   = ref([])
const loading        = ref(false)
const initialLoading = ref(false)
const error          = ref(null)
const currentPage    = ref(1)
const totalPages     = ref(1)
const total          = ref(0)
const perPage        = ref(25)

// ── Options filtres dynamiques ────────────────────────────────────────────────
const filterOptions = ref({ types_depart: [] })

// ── Modal ─────────────────────────────────────────────────────────────────────
const detailsOpen      = ref(false)
const selectedCourrier = ref(null)

// États fichier document dans la modal
const docFileLoaded  = ref(false)
const docFileLoading = ref(false)
const docFileError   = ref('')
const docBlobUrl     = ref('')

// Ouverture depuis le tableau
const openingDocumentId = ref(null)

// ── Filtres avancés ───────────────────────────────────────────────────────────
const defaultFilters = () => ({
  search:           '',
  reference:        '',
  objet:            '',
  destinataire:     '',
  service_emis:     '',
  date_depart_from: '',
  date_depart_to:   '',
  type_depart:      '',
  confidentiel:     '',
  type_document_id: '',
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

// ── Watch filtres avancés ─────────────────────────────────────────────────────
let searchTimeout = null
watch(searchFilters, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    refresh(1, perPage.value, false)
  }, 400)
}, { deep: true })

// ── Utilitaires ───────────────────────────────────────────────────────────────
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}

const guessMimeType = (filename) => {
  if (!filename) return ''
  const ext = (filename.split('.').pop() || '').toLowerCase()
  return { pdf: 'application/pdf', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml' }[ext] || ''
}

// ── Construction URL API fichier ──────────────────────────────────────────────
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

// ── Charger le fichier dans la modal ─────────────────────────────────────────
const loadDocFile = async () => {
  const rawDoc    = selectedCourrier.value?._raw?.document
  const rawUrl    = rawDoc?.url
  const dateEnreg = rawDoc?.date_enreg
  if (!rawUrl || rawUrl === 'Inconnu') return

  docFileLoading.value = true
  docFileLoaded.value  = false
  docFileError.value   = ''
  if (docBlobUrl.value) { URL.revokeObjectURL(docBlobUrl.value); docBlobUrl.value = '' }

  try {
    const { blob } = await fetchFileAsBlob(rawUrl, dateEnreg)
    docBlobUrl.value    = URL.createObjectURL(blob)
    docFileLoaded.value = true
  } catch (err) {
    console.error('❌ Erreur chargement document:', err)
    docFileError.value = err.message || 'Erreur lors du chargement'
  } finally {
    docFileLoading.value = false
  }
}

// ── Transform ─────────────────────────────────────────────────────────────────
const transformerDonnees = (reponseAPI) => {
  if (!reponseAPI?.data) throw new Error('Format de réponse API invalide')

  return reponseAPI.data.map(courrier => {
    const initiateurFormate = courrier.initiateurs?.map(init => {
      const nomComplet = `${init.user?.nom} ${init.user?.prenom || ''}`.trim()
      const role       = init.is_responsable ? init.entite?.fonction : 'Agent'
      return `${nomComplet} (${init.entite?.code} - ${role})`
    }).join(', ') || ''

    // Nom brut uniquement — jamais d'URL construite
    const rawUrl = courrier.document?.url?.trim()

    return {
      id:           courrier.id,
      reference:    courrier.document?.reference    || '',
      objet:        courrier.document?.objet        || '',
      numero_enreg: courrier.document?.numero_enreg || '',
      url:          (rawUrl && rawUrl !== 'Inconnu') ? rawUrl : '',  // nom brut
      date_enreg:   formatDate(courrier.document?.date_enreg),
      date_depart:  formatDate(courrier.date_depart),
      type_document: courrier.document?.type_document?.libelle || courrier.document?.typeDocument?.libelle || '',
      service_emis: courrier.service_emis || '',
      destinataire: courrier.destinataire || '',
      type_depart:  courrier.type_depart  || '',
      confidentiel: courrier.confidentiel || false,
      initiateurs:  initiateurFormate,
      _raw:         courrier,  // anciennement _complete
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
    if (response.success) {
      filterOptions.value = { types_depart: response.types_depart || [] }
    }
  } catch (err) {
    console.error('❌ Erreur chargement options filtres:', err)
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

    let entiteUser = null
    const saved = localStorage.getItem('entite_user')
    if (saved) entiteUser = JSON.parse(saved)

    if (!entiteUser?.id) {
      error.value = 'Aucune fonction user sélectionnée'
      return
    }

    const params = new URLSearchParams({
      page:     String(page),
      per_page: String(per_page),
    })

    const f = searchFilters.value
    if (f.search)           params.append('search',           f.search)
    if (f.reference)        params.append('reference',        f.reference)
    if (f.objet)            params.append('objet',            f.objet)
    if (f.destinataire)     params.append('destinataire',     f.destinataire)
    if (f.service_emis)     params.append('service_emis',     f.service_emis)
    if (f.date_depart_from) params.append('date_depart_from', f.date_depart_from)
    if (f.date_depart_to)   params.append('date_depart_to',   f.date_depart_to)
    if (f.type_depart)      params.append('type_depart',      f.type_depart)
    if (f.confidentiel)     params.append('confidentiel',     f.confidentiel)
    if (f.type_document_id) params.append('type_document_id', f.type_document_id)

    const c = columnFilters.value
    if (!f.reference    && c.reference)    params.append('reference',    c.reference)
    if (!f.objet        && c.objet)        params.append('objet',        c.objet)
    if (!f.service_emis && c.service_emis) params.append('service_emis', c.service_emis)
    if (!f.destinataire && c.destinataire) params.append('destinataire', c.destinataire)

    const base    = config.public.apiBase.replace(/\/$/, '')
    const reponse = await $fetch(
      `${base}/courriers-departs/visibles-filtres/${entiteUser.id}?${params.toString()}`,
      { method: 'GET', headers: { Authorization: `Bearer ${authToken}` } }
    )

    courrierData.value = transformerDonnees(reponse)
    currentPage.value  = reponse.meta?.current_page ?? page
    totalPages.value   = reponse.meta?.last_page     ?? 1
    total.value        = reponse.meta?.total         ?? courrierData.value.length

  } catch (err) {
    console.error('❌ Erreur chargement courriers visibles:', err)
    error.value = err.message || 'Erreur lors du chargement'
    toast.add({ title: 'Erreur', description: 'Impossible de charger les courriers', color: 'red', timeout: 1500 })
  } finally {
    initialLoading.value = false
    loading.value        = false
  }
}

// ── Handlers pagination ───────────────────────────────────────────────────────
const onPageChange    = (page) => refresh(page, perPage.value, false)
const onPerPageChange = (val)  => { perPage.value = val; refresh(1, val, false) }
const onSearchChange  = (val)  => {
  searchFilters.value.search = val
  currentPage.value = 1
  refresh(1, perPage.value, false)
}

// ── Handlers actions ──────────────────────────────────────────────────────────
const handleViewDetails = (item) => {
  selectedCourrier.value = item
  docFileLoaded.value    = false
  docFileLoading.value   = false
  docFileError.value     = ''
  if (docBlobUrl.value) { URL.revokeObjectURL(docBlobUrl.value); docBlobUrl.value = '' }
  detailsOpen.value = true
}

const closeDetails = () => {
  detailsOpen.value      = false
  selectedCourrier.value = null
  docFileLoaded.value    = false
  docFileError.value     = ''
  if (docBlobUrl.value) { URL.revokeObjectURL(docBlobUrl.value); docBlobUrl.value = '' }
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(() => {
  Promise.all([
    refresh(1, perPage.value, true),
    loadFilterOptions(),
  ])
})
</script>