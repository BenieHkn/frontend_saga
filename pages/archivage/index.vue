<template>
  <div class="min-h-screen bg-slate-50 p-10 font-sans">
    <div class="max-w-7xl mx-auto">

      <PageHeader title="Préarchivage" subtitle="Gestion des archives" />

      <!-- ── Toggle filtre ──────────────────────────────────── -->
      <div class="mb-8">
        <ToggleButton v-model="currentFilter" :options="filterOptions" />
      </div>

      <!-- ── Loader premier chargement ──────────────────────── -->
      <div v-if="initialLoading" class="flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
        <div class="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <span class="text-sm font-medium">Chargement des archives...</span>
      </div>

      <!-- ── Erreur ─────────────────────────────────────────── -->
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

      <!-- ── DataTable ──────────────────────────────────────── -->
      <DataTablePaginate
        v-else
        :loading="loading"
        :data="documents"
        :columns="columns"
        :selectable="false"
        :default-sort-column="null"
        :show-row-numbers="true"
        :items-per-page-options="[10, 20, 50, 100]"
        :default-items-per-page="10"
        :left-aligned-columns="['reference', 'objet', 'numero_enreg']"
        :hide-labels-when-input="true"
        :external-pagination="true"
        :external-total="total"
        :external-page="currentPage"
        :external-last-page="totalPages"
        :external-per-page="perPage"
        @page-change="onPageChange"
        @per-page-change="onPerPageChange"
        @open-document="onOpenDocument">

        <template #advanced-filters="{ filters, onFilter }">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div v-for="field in filterFields" :key="field.id">
              <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                {{ field.label }}
              </label>
              <input v-model="filters[field.id]" placeholder="Filtrer..."
                class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                @input="onFilter" />
            </div>
          </div>
        </template>

        <!-- Type arrivé / départ -->
        <template #cell-type="{ value }">
          <span
            class="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-full border uppercase"
            :class="{
              'bg-indigo-50 text-indigo-700 border-indigo-100': value === 'arrive',
              'bg-orange-50 text-orange-700 border-orange-100': value === 'depart',
            }">
            <Icon
              :name="value === 'arrive' ? 'i-heroicons-inbox-arrow-down' : 'i-heroicons-paper-airplane'"
              class="w-3 h-3" />
            {{ value === 'arrive' ? 'Arrivé' : 'Départ' }}
          </span>
        </template>

        <!-- Référence cliquable -->
        <template #cell-reference="{ value, item }">
          <button v-if="item.url" @click="onOpenDocument(item.url)"
            class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-all group max-w-[180px]"
            :title="`Ouvrir ${value}`">
            <Icon name="i-heroicons-document-text"
              class="w-3.5 h-3.5 shrink-0 group-hover:scale-110 transition-transform" />
            <span class="break-words whitespace-normal min-w-0">{{ value }}</span>
            <Icon name="i-heroicons-arrow-top-right-on-square"
              class="w-3 h-3 shrink-0 opacity-60 group-hover:opacity-100" />
          </button>
          <span v-else
            class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md max-w-[180px]">
            <Icon name="i-heroicons-document-text" class="w-3.5 h-3.5 shrink-0 opacity-50" />
            <span class="break-words whitespace-normal min-w-0">{{ value || '—' }}</span>
          </span>
        </template>

        <!-- Objet -->
        <template #cell-objet="{ value }">
          <span class="block text-xs text-slate-800 leading-relaxed whitespace-normal break-words"
            :title="value">
            {{ value || '—' }}
          </span>
        </template>

        <!-- Type document -->
        <template #cell-type_document="{ value }">
          <span v-if="value"
            class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {{ value.libelle || value.nom || value }}
          </span>
          <span v-else class="text-slate-400 text-xs">—</span>
        </template>

        <!-- Durée depuis enregistrement -->
        <template #cell-duree="{ item }">
          <span
            class="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-full border"
            :class="{
              'bg-red-50 text-red-700 border-red-200':       item.duree_annees >= 3,
              'bg-amber-50 text-amber-700 border-amber-200': item.duree_annees >= 1 && item.duree_annees < 3,
            }">
            <Icon name="i-heroicons-clock" class="w-3 h-3" />
            {{ formatDuree(item.duree_mois) }}
          </span>
        </template>

        <!-- Statut archive -->
        <template #cell-statut="{ value }">
          <span
            class="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-full border uppercase"
            :class="{
              'bg-red-50 text-red-700 border-red-200':       value === 'archived',
              'bg-amber-50 text-amber-700 border-amber-200': value === 'pending',
            }">
            <Icon
              :name="value === 'archived' ? 'i-heroicons-archive-box' : 'i-heroicons-archive-box-arrow-down'"
              class="w-3 h-3" />
            {{ value === 'archived' ? 'Archivé' : 'Préarchivage' }}
          </span>
        </template>

      </DataTablePaginate>

    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import DataTablePaginate from '~/components/DataTablePaginate.vue'

const config = useRuntimeConfig()

// ── Filtre toggle ─────────────────────────────────────────────
const currentFilter = ref('pending')

const filterOptions = [
  { label: 'En préarchivage',     value: 'pending'  },
  { label: 'Toutes les Archives', value: 'archived' },
]

const filterFields = [
  { id: 'reference',    label: 'Référence' },
  { id: 'objet',        label: 'Objet' },
  { id: 'numero_enreg', label: "N° d'enregistrement" },
  { id: 'type',         label: 'Type (arrive / depart)' },
]

// ── État ──────────────────────────────────────────────────────
const documents      = ref([])
const loading        = ref(false) // overlay discret DataTable
const initialLoading = ref(false) // spinner pleine page (1er chargement)
const error          = ref(null)
const currentPage    = ref(1)
const totalPages     = ref(1)
const total          = ref(0)
const perPage        = ref(10)

// ── Colonnes ──────────────────────────────────────────────────
const columns = [
  { key: 'numero_enreg',  label: "N° d'enreg.",          visible: true,  inputHidden: true },
  { key: 'reference',     label: 'Référence',             visible: true,  inputWidth: '80px', inputPlaceholder: 'Réf...' },
  { key: 'objet',         label: 'Objet',                 visible: true },
  { key: 'date_enreg',    label: "Date d'enregistrement", visible: true,  inputHidden: true },
  { key: 'type',          label: 'Type',                  visible: true,  inputHidden: true },
  { key: 'type_document', label: 'Type document',         visible: true,  inputHidden: true, filterable: false },
  { key: 'duree',         label: 'Durée',                 visible: true,  inputHidden: true, filterable: false },
  { key: 'statut',        label: 'Statut',                visible: true,  inputHidden: true, filterable: false },
  { key: 'url',           label: 'Document',              visible: false, type: 'document' },
]

// ── Utilitaires ───────────────────────────────────────────────
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric'
  })
}

const formatDuree = (mois) => {
  if (!mois && mois !== 0) return '—'
  const annees = Math.floor(mois / 12)
  const reste  = mois % 12
  if (annees === 0) return `${reste} mois`
  if (reste === 0)  return `${annees} an${annees > 1 ? 's' : ''}`
  return `${annees} an${annees > 1 ? 's' : ''} ${reste} mois`
}

const transformDocuments = (response) => {
  if (!response?.data) throw new Error('Format de réponse API invalide')
  return response.data.map((doc) => ({
    id:            doc.id,
    numero_enreg:  doc.numero_enreg  || '—',
    reference:     doc.reference     || '—',
    objet:         doc.objet         || '—',
    date_enreg:    formatDate(doc.date_enreg),
    date_courrier: formatDate(doc.date_courrier),
    type:          doc.type          || '—',
    type_document: doc.type_document || null,
    statut:        doc.statut        || null,
    duree_mois:    doc.duree_mois    || 0,
    duree_annees:  doc.duree_annees  || 0,
    url: doc.url && doc.url !== 'Inconnu'
      ? (doc.url.startsWith('http') ? doc.url : `${config.public.baseUrl}${doc.url}`)
      : '',
    _raw: doc,
  }))
}

// ── Chargement ────────────────────────────────────────────────
const refresh = async (page = 1, per_page = perPage.value, isFirst = false) => {
  // Premier chargement → spinner pleine page
  // Pagination / toggle → overlay discret DataTable
  if (isFirst) {
    initialLoading.value = true
  } else {
    loading.value = true
  }
  error.value = null

  try {
    const authToken = localStorage.getItem('auth_token') || ''
    const base      = config.public.apiBase.replace(/\/$/, '')
    const endpoint  = `${base}/archives?page=${page}&per_page=${per_page}&filter=${currentFilter.value}`

    const response = await $fetch(endpoint, {
      headers: { Authorization: `Bearer ${authToken}` },
    })

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

// Rechargement sur changement du toggle
watch(currentFilter, () => {
  currentPage.value = 1
  refresh(1, perPage.value, false)
})

// ── Handlers ──────────────────────────────────────────────────
const onPageChange    = (page) => refresh(page, perPage.value, false)
const onPerPageChange = (val)  => { perPage.value = val; refresh(1, val, false) }
const onOpenDocument  = (url)  => { if (url) window.open(url, '_blank', 'noopener,noreferrer') }

// ── Lifecycle ─────────────────────────────────────────────────
onMounted(() => refresh(1, perPage.value, true))
</script>