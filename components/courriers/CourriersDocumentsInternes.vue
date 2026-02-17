<template>
  <div class="min-h-screen bg-slate-100 p-6 font-sans">
    
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Documents internes</h1>
        <p class="text-sm text-slate-500">Gestion et suivi des documents internes</p>
      </div>
      

      <UBadge color="blue" variant="soft" size="lg" class="ml-auto">
        <Icon name="i-heroicons-plus" class="h-4 w-4 mr-1" />
        <UButton to="/courriers/form_document_interne" variant="text" size="sm" class="p-0 m-0 text-blue-600">
          Nouveau
        </UButton>
      </UBadge>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
      <div class="w-8 h-8 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
      <span class="text-sm font-medium">Chargement des données...</span>
    </div>

    <div v-else-if="error" class="flex items-center gap-4 p-5 bg-red-50 border border-red-200 rounded-xl max-w-2xl">
      <UIcon name="i-heroicons-exclamation-circle" class="w-8 h-8 text-red-600 shrink-0" />
      <div class="flex-1">
        <p class="text-sm font-bold text-red-900">Erreur de chargement</p>
        <p class="text-xs text-red-700">{{ error }}</p>
      </div>
      <button 
        class="px-4 py-2 text-xs font-bold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        @click="refresh"
      >
        Réessayer
      </button>
    </div>

    <DataTable
      v-else
      :data="documents"
      :default-sort-column="null" :show-row-numbers="true"
      :columns="columns"
      :selectable="false"
      :left-aligned-columns="['reference', 'numeroEnregistrement', 'objet', 'description']"
      @edit="onEdit"
      @delete="onDelete"
      @open-document="onOpenDocument"
      @selection-change="onSelectionChange"
    >
      <template #advanced-filters="{ filters, onFilter }">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="field in [
            { id: 'type_document', label: 'Type de document' },
            { id: 'numeroEnregistrement', label: 'N° d\'enregistrement' },
            { id: 'objet', label: 'Objet' },
            { id: 'reference', label: 'Référence' }
          ]" :key="field.id">
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              {{ field.label }}
            </label>
            <input
              v-model="filters[field.id]"
              placeholder="Filtrer..."
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              @input="onFilter"
            />
          </div>
        </div>
      </template>

      <template #selection-actions="{ selected }">
        <button
          v-if="selected.length > 0"
          class="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-blue-600 rounded-lg hover:opacity-90 transition-opacity"
          @click="onAssign(selected)"
        >
          <UIcon name="i-heroicons-user-plus" class="w-4 h-4" />
          Affecter ({{ selected.length }})
        </button>
      </template>

      <template #cell-type_document="{ value }">
        <span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-sky-100 text-sky-700 border border-sky-200 uppercase">
          {{ value }}
        </span>
      </template>

      <template #cell-large_diffusion="{ value }">
        <span 
          class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border"
          :class="value 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
            : 'bg-slate-100 text-slate-500 border-slate-200'"
        >
          {{ value ? 'OUI' : 'NON' }}
        </span>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
// ... (Logique JS strictement identique à ton code original)
import DataTable from '~/components/DataTable.vue'
import { useApi } from '~/composables/useApi'
const config = useRuntimeConfig()

const columns = [
  // { key: 'id', label: 'N°', visible: true },
  { key: 'numeroEnregistrement', label: "N° d'enregistrement", visible: true },
  { key: 'date_enreg', label: "Date d'enregistrement", visible: true },
  { key: 'reference', label: 'Référence', visible: true },
  { key: 'date_courrier', label: 'Date du courrier', visible: true },
  { key: 'objet', label: 'Objet', visible: true },
  { key: 'type_document', label: 'Type de document', visible: true, type: 'badge' },
  { key: 'large_diffusion', label: 'Large diffusion', visible: true, type: 'badge' },
  { key: 'url', label: 'Document', visible: true, type: 'document' },
  { key: 'description', label: 'Description', visible: false },
]

const formatDate = (date) => {
  if (!date) return ''

  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}


const transformDocuments = (response) => {
  if (!response?.data) throw new Error('Format de réponse API invalide')
  return response.data.map((document) => ({
    id: document.id,
    numeroEnregistrement: document.numero_enreg || '',
    date_enreg: formatDate(document.date_enreg),
    reference: document.reference || '',
    date_courrier: formatDate(document.date_courrier),
    objet: document.objet || '',
    type_document: document.type_document?.libelle || 'Non défini',
    large_diffusion: document.large_diffusion || false,
    url: document.url ? `${config.public.baseUrl}${document.url}` : '',
    description: document.description || '',
  }))
}

const { data: documents, loading, error, refresh } = useApi('/documents-internes', {
  transform: transformDocuments,
  immediate: true,
})

const onEdit = (item) => console.log('Éditer :', item)
const onDelete = (item) => console.log('Supprimer :', item)
const onOpenDocument = (url) => { if (url) window.open(url, '_blank', 'noopener,noreferrer') }
const onSelectionChange = (ids) => console.log('Sélection mise à jour :', ids)
const onAssign = (selectedIds) => console.log('Affecter les documents :', selectedIds)
</script>