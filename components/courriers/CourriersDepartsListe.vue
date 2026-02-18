<template>
  <div class="min-h-screen bg-slate-100 p-6 font-sans">

    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Courriers Départs</h1>
        <p class="text-sm text-slate-500">Gestion et suivi des courriers sortants</p>
      </div>

      <UBadge color="blue" variant="soft" size="lg" class="ml-auto">
        <Icon name="i-heroicons-plus" class="h-4 w-4 mr-1" />
        <UButton to="/courriers/form_courrier_depart" variant="text" size="sm" class="p-0 m-0 text-blue-600">
          Nouveau
        </UButton>
      </UBadge>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
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
        @click="refresh">
        Réessayer
      </button>
    </div>

    <DataTable v-else :default-sort-column="null" :show-row-numbers="true" :data="courriers" :columns="columns"
      :selectable="false" :left-aligned-columns="['reference', 'structure', 'numeroEnregistrement', 'objet', 'initiateurs']"
      @open-document="onOpenDocument" @selection-change="onSelectionChange">

      <template #advanced-filters="{ filters, onFilter }">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Recherche</label>
            <input v-model="filters.search" placeholder="Référence, N°, Objet..."
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              @input="onFilter" />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Type de document</label>
            <select v-model="filters.type_document_id"
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              @change="onFilter">
              <option value="">Tous les types</option>
              <option v-for="type in documentTypesList" :key="type.id" :value="type.id">{{ type.libelle }}</option>
            </select>
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Type de départ</label>
            <select v-model="filters.type_depart"
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              @change="onFilter">
              <option value="">Tous les types</option>
              <option value="interne">Interne</option>
              <option value="externe">Externe</option>
            </select>
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Date de départ (début)</label>
            <input v-model="filters.date_depart_from" type="date"
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              @input="onFilter" />
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div>
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Date de départ (fin)</label>
            <input v-model="filters.date_depart_to" type="date"
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              @input="onFilter" />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Large diffusion</label>
            <select v-model="filters.large_diffusion"
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              @change="onFilter">
              <option value="">Tous</option>
              <option value="true">Oui</option>
              <option value="false">Non</option>
            </select>
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Confidentiel</label>
            <select v-model="filters.confidentiel"
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              @change="onFilter">
              <option value="">Tous</option>
              <option value="true">Oui</option>
              <option value="false">Non</option>
            </select>
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Date enregistrement (début)</label>
            <input v-model="filters.date_from" type="date"
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              @input="onFilter" />
          </div>
        </div>
      </template>

      <!-- Actions -->
      <template #actions="{ item }">
        <div class="flex gap-1.5 justify-end">
          <button @click="handleView(item)" title="Voir les détails"
            class="inline-flex items-center justify-center w-8 h-8 bg-amber-50 text-amber-700 border-amber-100 rounded-md hover:bg-amber-200 hover:border-amber-900 transition-all group">
            <Icon name="i-heroicons-eye" class="w-4 h-4 group-hover:text-yellow-600" />
          </button>
        </div>
      </template>

      <!-- Badge Source -->
      <template #cell-source="{ value }">
        <span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
          {{ value }}
        </span>
      </template>

      <!-- Badge Type Document -->
      <template #cell-type_document="{ value }">
        <span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-green-50 text-green-700 border border-green-100">
          {{ value || 'N/A' }}
        </span>
      </template>

      <!-- Badge Large Diffusion -->
      <template #cell-large_diffusion="{ value }">
        <span v-if="value" class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-100">Oui</span>
        <span v-else class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-gray-50 text-gray-700 border border-gray-100">Non</span>
      </template>

      <!-- Badge Confidentiel -->
      <template #cell-confidentiel="{ value }">
        <span v-if="value" class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-red-50 text-red-700 border border-red-100">Oui</span>
        <span v-else class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-gray-50 text-gray-700 border border-gray-100">Non</span>
      </template>

      <!-- Référence cliquable -->
      <template #cell-reference="{ value, item }">
        <button v-if="item.url" @click="onOpenDocument(item.url)"
          class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 rounded-md transition-all group"
          :title="`Ouvrir le document ${value}`">
          <Icon name="i-heroicons-document-text" class="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span>{{ value }}</span>
          <Icon name="i-heroicons-arrow-top-right-on-square" class="w-3 h-3 opacity-60 group-hover:opacity-100" />
        </button>
        <span v-else class="inline-flex items-center px-2.5 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md" :title="value">
          <Icon name="i-heroicons-document-text" class="w-3.5 h-3.5 mr-1.5 opacity-50" />
          {{ value }}
        </span>
      </template>

      <!-- ✅ Initiateurs : badges violets empilés -->
      <template #cell-initiateurs="{ value }">
        <div v-if="value && value.length > 0" class="flex flex-col gap-1">
          <span
            v-for="(initiateur, index) in value"
            :key="index"
            class="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-purple-700 bg-purple-50 border border-purple-100 rounded-full whitespace-nowrap"
          >
            <Icon name="i-heroicons-user" class="w-3 h-3 shrink-0" />
            {{ initiateur }}
          </span>
        </div>
        <span v-else class="text-xs text-slate-400 italic">—</span>
      </template>

    </DataTable>
  </div>
</template>

<script setup>
import DataTable from '~/components/DataTable.vue'
import { useApi } from '~/composables/useApi'
import Swal from 'sweetalert2'
import { ref } from 'vue'

const config = useRuntimeConfig()

const documentTypesList = ref([])

// ── Colonnes ──────────────────────────────────────────────────────────────────
const columns = [
  { key: 'source',               label: 'Source',                visible: true,  type: 'badge', inputHidden: true },
  { key: 'reference',            label: 'Référence',             visible: true },
  { key: 'structure',            label: 'Destinataire',          visible: true,  inputHidden: true },
  { key: 'numeroEnregistrement', label: "N° d'enregistrement",   visible: true,  inputHidden: true },
  { key: 'objet',                label: 'Objet',                 visible: true },
  { key: 'type_document',        label: 'Type de document',      visible: true,  inputHidden: true },
  // ✅ Nouvelle colonne initiateurs
  { key: 'initiateurs',          label: 'Initiateurs',           visible: true,  inputHidden: true, sortable: false, filterable: false },
  { key: 'date_enregistrement',  label: "Date d'enregistrement", visible: false },
  { key: 'date_courrier',        label: 'Date du Courrier',      visible: false },
  { key: 'url',                  label: 'Document',              visible: false, type: 'document' },
  { key: 'type_depart',          label: 'Type de départ',        visible: false },
  { key: 'date_depart',          label: 'Date de départ',        visible: false },
  { key: 'large_diffusion',      label: 'Large diffusion',       visible: false },
  { key: 'confidentiel',         label: 'Confidentiel',          visible: false },
]

// ── Transformation ────────────────────────────────────────────────────────────
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

const transformCourriers = (response) => {
  if (!response?.data) throw new Error('Format de réponse API invalide')

  return response.data.map((courrier) => {
    // ✅ Construire le tableau de labels lisibles pour les initiateurs
    const initiateursList = (courrier.initiateurs || []).map(i => {
      const nom    = i.user?.nom    || ''
      const prenom = i.user?.prenom || ''
      const code   = i.entite?.code || i.entite?.libelle || ''
      return `${nom} ${prenom}${code ? ` (${code})` : ''}`.trim()
    }).filter(Boolean)

    return {
      id:                    courrier.id,
      source:                courrier.service_emis || '',
      numeroEnregistrement:  courrier.document?.numero_enreg || '',
      reference:             courrier.document?.reference || '',
      structure:             courrier.destinataire || '',
      date_enregistrement:   formatDate(courrier.document?.date_enreg),
      objet:                 courrier.document?.objet || '',
      date_courrier:         formatDate(courrier.document?.date_courrier),
      url:                   courrier.document?.url ? `${config.public.baseUrl}${courrier.document.url}` : '',
      type_depart:           courrier.type_depart || '',
      date_depart:           formatDate(courrier.date_depart),
      type_document:         courrier.document?.type_document?.libelle || '',
      large_diffusion:       courrier.document?.large_diffusion || false,
      confidentiel:          courrier.confidentiel || false,
      initiateurs:           initiateursList, // ✅ tableau de strings
      _complete:             courrier,
    }
  })
}

// ── API ───────────────────────────────────────────────────────────────────────
const { data: courriers, loading, error, refresh } = useApi('api/courriers-departs', {
  transform: transformCourriers,
  immediate: true,
})

// ── Handlers ──────────────────────────────────────────────────────────────────
const onOpenDocument = (url) => {
  if (url) window.open(url, '_blank', 'noopener,noreferrer')
}

const onSelectionChange = (ids) => console.log('Sélection :', ids)

const handleView = async (item) => {
  const courrier = item._complete || item

  // Construire le HTML des initiateurs pour le modal
  const initiateurHtml = courrier.initiateurs?.length > 0
    ? courrier.initiateurs.map(i =>
        `<span style="display:inline-flex;align-items:center;gap:4px;padding:3px 10px;background:#f3e8ff;color:#7e22ce;border:1px solid #e9d5ff;border-radius:9999px;font-size:12px;margin:2px;">
          👤 ${i.user?.nom || ''} ${i.user?.prenom || ''} ${i.entite?.code ? `(${i.entite.code})` : i.entite?.libelle ? `(${i.entite.libelle})` : ''}
        </span>`
      ).join('')
    : '<span style="color:#9ca3af;font-style:italic;font-size:13px;">Aucun initiateur</span>'

  await Swal.fire({
    title: 'Détails du courrier',
    html: `
      <div class="text-left space-y-4">
        <div class="bg-blue-50 rounded-lg p-4">
          <p class="text-xs text-gray-600 uppercase font-semibold mb-1">Référence</p>
          <p class="text-lg font-bold text-blue-900">${courrier.document?.reference || 'N/A'}</p>
        </div>

        <div class="bg-yellow-50 rounded-lg p-4">
          <p class="text-xs text-gray-600 uppercase font-semibold mb-1">Objet</p>
          <p class="text-sm text-gray-800">${courrier.document?.objet || 'Non spécifié'}</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="text-xs text-gray-600 font-semibold mb-1">Source</p>
            <p class="text-sm font-medium text-gray-900">${courrier.service_emis || 'N/A'}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="text-xs text-gray-600 font-semibold mb-1">Type de départ</p>
            <p class="text-sm font-medium text-gray-900">${courrier.type_depart || 'Non spécifié'}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="text-xs text-gray-600 font-semibold mb-1">Date d'enregistrement</p>
            <p class="text-sm text-gray-900">${formatDate(courrier.document?.date_enreg)}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="text-xs text-gray-600 font-semibold mb-1">Date de départ</p>
            <p class="text-sm text-gray-900">${formatDate(courrier.date_depart)}</p>
          </div>
        </div>

        <div class="bg-indigo-50 rounded-lg p-4">
          <p class="text-xs text-gray-600 uppercase font-semibold mb-1">Destinataire</p>
          <p class="text-sm text-gray-900">${courrier.destinataire || 'Non spécifié'}</p>
        </div>

        <!-- ✅ Initiateurs dans le modal -->
        <div class="bg-purple-50 rounded-lg p-4">
          <p class="text-xs text-gray-600 uppercase font-semibold mb-2">Initiateurs</p>
          <div style="display:flex;flex-wrap:wrap;gap:4px;">${initiateurHtml}</div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="bg-green-50 rounded-lg p-3">
            <p class="text-xs text-gray-600 font-semibold mb-1">Type de document</p>
            <p class="text-sm font-medium text-gray-900">${courrier.document?.type_document?.libelle || 'N/A'}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="text-xs text-gray-600 font-semibold mb-1">Large diffusion</p>
            <p class="text-sm font-medium text-gray-900">${courrier.document?.large_diffusion ? 'Oui' : 'Non'}</p>
          </div>
        </div>

        <div class="bg-red-50 rounded-lg p-3">
          <p class="text-xs text-gray-600 font-semibold mb-1">Confidentiel</p>
          <p class="text-sm font-medium text-gray-900">${courrier.confidentiel ? '🔒 Oui' : 'Non'}</p>
        </div>
      </div>
    `,
    icon: 'info',
    confirmButtonColor: '#7c3aed',
    confirmButtonText: 'Fermer',
    width: '600px',
    customClass: {
      popup: 'swal2-popup-custom',
      title: 'text-xl font-semibold',
      htmlContainer: 'text-sm',
    }
  })
}
</script>

<style scoped>
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
</style>