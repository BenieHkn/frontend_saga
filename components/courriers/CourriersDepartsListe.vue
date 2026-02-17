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
      :selectable="false" :left-aligned-columns="['reference', 'structure', 'numeroEnregistrement', 'objet']"
      @edit="onEdit" @delete="onDelete" @open-document="onOpenDocument" @selection-change="onSelectionChange">
      <template #advanced-filters="{ filters, onFilter }">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="field in [
            { id: 'structure', label: 'Structure / Usager' },
            { id: 'objet', label: 'Objet' },
            { id: 'type_depart', label: 'Type de départ' },
            { id: 'source', label: 'Source' }
          ]" :key="field.id">
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              {{ field.label }}
            </label>
            <input v-model="filters[field.id]" placeholder="Filtrer..."
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              @input="onFilter" />
          </div>
        </div>
      </template>

      <template #selection-actions="{ selected }">
        <button v-if="selected.length > 0"
          class="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-blue-600 rounded-lg hover:opacity-90 transition-opacity"
          @click="onAssign(selected)">
          <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
          Affecter ({{ selected.length }})
        </button>
      </template>

      <!-- ✅ Badge Source -->
      <template #cell-source="{ value }">
        <span
          class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
          {{ value }}
        </span>
      </template>

      <!-- ✅ NOUVEAU : Référence cliquable avec lien vers le document -->
      <template #cell-reference="{ value, item }">
        <button
          v-if="item.url"
          @click="onOpenDocument(item.url)"
          class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 rounded-md transition-all group"
          :title="`Ouvrir le document ${value}`"
        >
          <Icon name="i-heroicons-document-text" class="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span>{{ value }}</span>
          <Icon name="i-heroicons-arrow-top-right-on-square" class="w-3 h-3 opacity-60 group-hover:opacity-100" />
        </button>
        <span 
          v-else
          class="inline-flex items-center px-2.5 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md"
          :title="value"
        >
          <Icon name="i-heroicons-document-text" class="w-3.5 h-3.5 mr-1.5 opacity-50" />
          {{ value }}
        </span>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import DataTable from '~/components/DataTable.vue'
import { useApi } from '~/composables/useApi'

// Configuration des colonnes
const columns = [
  { key: 'source', label: 'Source', visible: true, type: 'badge', inputHidden: true, },
  { key: 'reference', label: 'Référence', visible: true },
  { key: 'structure', label: 'Structure / Usager', visible: true, showLabel: false },
  { key: 'numeroEnregistrement', label: "N° d'enregistrement", visible: true, showLabel: false },
  { key: 'objet', label: 'Objet', visible: true, showLabel: false },
  { key: 'date_enregistrement', label: "Date d'enregistrement", visible: false, },
  { key: 'date_courrier', label: 'Date du Courrier', visible: false, showLabel: false },
  { key: 'url', label: 'Document', visible: false, type: 'document' },
  { key: 'type_depart', label: 'Type de départ', visible: false, showLabel: false },
  { key: 'date_depart', label: 'Date de départ', visible: false, showLabel: false },
]

// Transformation des données
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
  return response.data.map((courrier) => ({
    id: courrier.id,
    source: courrier.service_emis || '',
    numeroEnregistrement: courrier.document?.numero_enreg || '',
    reference: courrier.document?.reference || '',
    structure: courrier.destinataire || '',
    date_enregistrement: formatDate(courrier.document?.date_enreg),
    objet: courrier.document?.objet || '',
    date_courrier: formatDate(courrier.document?.date_courrier),
    url: courrier.document?.url ? `http://localhost:8000${courrier.document.url}` : '',
    type_depart: courrier.type_depart || '',
    date_depart: formatDate(courrier.date_depart),
  }))
}

// Appel API
const { data: courriers, loading, error, refresh } = useApi('/courriers-departs', {
  transform: transformCourriers,
  immediate: true,
})

// Handlers
const onEdit = (item) => console.log('Éditer :', item)
const onDelete = (item) => console.log('Supprimer :', item)
const onOpenDocument = (url) => { 
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}
const onSelectionChange = (ids) => console.log('Sélection mise à jour :', ids)
const onAssign = (selectedIds) => console.log('Affecter les courriers :', selectedIds)
</script>