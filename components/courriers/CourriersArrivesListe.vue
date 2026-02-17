<template>
  <div class="min-h-screen bg-slate-100 p-6 font-sans">

    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Courriers arrivés</h1>
        <p class="text-sm text-slate-500">Gestion et suivi des courriers entrants</p>
      </div>
      <UBadge color="blue" variant="soft" size="lg" class="ml-auto">
        <Icon name="i-heroicons-plus" class="h-4 w-4 mr-1" />
        <UButton to="/courriers/form_courier_arrive" variant="text" size="sm" class="p-0 m-0 text-blue-600">
          Nouveau
        </UButton>
      </UBadge>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
      <div class="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <span class="text-sm font-medium">Chargement des données...</span>
    </div>

    <div v-else-if="error"
      class="flex items-center gap-4 p-5 bg-red-50 border border-red-200 rounded-xl max-w-2xl mx-auto sm:mx-0">
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

    <DataTable v-else :data="courriers" :columns="columns" :selectable="false" :default-sort-column="null"
      :show-row-numbers="true" :left-aligned-columns="['reference', 'structure', 'numeroEnregistrement', 'objet']"
      @edit="onEdit" @delete="onDelete" @open-document="onOpenDocument" @selection-change="onSelectionChange"
      :hide-labels-when-input="true">
      <template #advanced-filters="{ filters, onFilter }">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="field in [
            { id: 'source', label: 'Source' },
            { id: 'structure', label: 'Structure / Usager' },
            { id: 'objet', label: 'Objet' },
            { id: 'type_arrivee', label: 'Type d\'arrivée' }
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

      <!-- Slot pour les actions personnalisées -->
      <template #actions="{ item }">
        <div class="flex gap-1.5 justify-end">
          <button @click="handleView(item)" title="Voir les détails"
            class="inline-flex items-center justify-center w-8 h-8 rounded-md border border-transparent hover:bg-blue-50 hover:border-blue-200 transition-all group">
            <Icon name="i-heroicons-eye" class="w-4 h-4 text-slate-500 group-hover:text-blue-600" />
          </button>

          <button @click="handleQuickAssign(item.id)" title="Affecter ce courrier"
            class="inline-flex items-center justify-center w-8 h-8 rounded-md border border-transparent hover:bg-purple-50 hover:border-purple-200 transition-all group">
            <svg class="w-4 h-4 text-slate-500 group-hover:text-purple-600" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>
      </template>

      <template #cell-source="{ value }">
        <span
          class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
          {{ value }}
        </span>
      </template>

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

      <template #cell-priority="{ value }">
        <span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border uppercase" :class="{
          'bg-red-50 text-red-700 border-red-100': value?.toLowerCase() === 'urgent',
          'bg-amber-50 text-amber-700 border-amber-100': value?.toLowerCase() === 'important',
          'bg-sky-50 text-sky-700 border-sky-100': value?.toLowerCase() === 'standard',
        }">
          {{ value || 'Standard' }}
        </span>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DataTable from '~/components/DataTable.vue'
import { useApi } from '~/composables/useApi'
import { useAffectationsStore } from '~/stores/affectations'
import Swal from 'sweetalert2'

// Store
const store = useAffectationsStore()
const config = useRuntimeConfig()

// --- Configuration colonnes ---
const columns = [
  {
    key: 'source',
    label: 'Source',
    visible: true,
    type: 'badge',
    inputHidden: true,        // ✅ input masqué, multiSelect reste disponible
  },
  {
    key: 'reference',
    label: 'Référence',
    visible: true,
    inputWidth: '80px',       // ✅ input plus petit
    inputPlaceholder: 'Réf...',
  },
  {
    key: 'structure',
    label: 'Structure / Usager',
    visible: true,
  },
  {
    key: 'numeroEnregistrement',
    label: "N° d'enreg.",
    visible: false,
    inputHidden: true,        // ✅ input masqué
  },
  {
    key: 'objet',
    label: 'Objet',
    visible: true,
  },
  {
    key: 'date_enregistrement',
    label: "Date d'enregistrement",
    visible: false,
  },
  {
    key: 'date_courrier',
    label: 'Date du Courrier',
    visible: false,
  },
  {
    key: 'url',
    label: 'Document',
    visible: false,
    type: 'document',
  },
  {
    key: 'type_arrivee',
    label: "Type d'arrivée",
    visible: false,
  },
  {
    key: 'priority',
    label: 'Priorité',
    visible: true,
    type: 'badge',
  },
]

// --- Transformation ---
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
    source: courrier.service_enreg || '',
    numeroEnregistrement: courrier.document?.numero_enreg || '',
    reference: courrier.document?.reference || '',
    structure: courrier.structure || courrier.autre_structure || '',
    date_enregistrement: formatDate(courrier.document?.date_enreg),
    objet: courrier.document?.objet || '',
    date_courrier: formatDate(courrier.document?.date_courrier),
    url: courrier.document?.url ? `${config.public.apiBase}${courrier.document.url}` : '',
    type_arrivee: courrier.type_arrivee || '',
    priority: courrier.priority || '',
    // Garder les données complètes
    _complete: courrier,
  }))
}

// --- API ---
const { data: courriers, loading, error, refresh } = useApi('api/courriers-arrives', {
  transform: transformCourriers,
  immediate: true,
})

// --- Handlers ---

const onOpenDocument = (url) => {
  if (url) window.open(url, '_blank', 'noopener,noreferrer')
}

const onSelectionChange = (ids) => {
  console.log('Sélection mise à jour :', ids)
}

// 🎯 Action Affectation Rapide
const handleQuickAssign = (courrierId) => {
  console.log('Affectation rapide pour le courrier:', courrierId)

  // Sauvegarder le courrier sélectionné dans le store
  store.selectCourrierFromQuickAction(courrierId)

  // Rediriger vers la page de création d'affectation
  navigateTo('/affectations/create')
}

const handleView = async (item) => {
  const courrier = item._complete || item

  const details = `
    <div class="text-left space-y-4">
      <!-- Référence -->
      <div class="bg-blue-50 rounded-lg p-4">
        <p class="text-xs text-gray-600 uppercase font-semibold mb-1">Référence</p>
        <p class="text-lg font-bold text-blue-900">${courrier.document?.reference || 'N/A'}</p>
      </div>

      <!-- Objet -->
      <div class="bg-yellow-50 rounded-lg p-4">
        <p class="text-xs text-gray-600 uppercase font-semibold mb-1">Objet</p>
        <p class="text-sm text-gray-800">${courrier.document?.objet || 'Non spécifié'}</p>
      </div>

      <!-- Informations d'enregistrement -->
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-gray-50 rounded-lg p-3">
          <p class="text-xs text-gray-600 font-semibold mb-1">Source</p>
          <p class="text-sm font-medium text-gray-900">${courrier.service_enreg || 'N/A'}</p>
        </div>
        <div class="bg-gray-50 rounded-lg p-3">
          <p class="text-xs text-gray-600 font-semibold mb-1">Priorité</p>
          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${courrier.priority?.toLowerCase() === 'urgent' ? 'bg-red-100 text-red-800' :
      courrier.priority?.toLowerCase() === 'important' ? 'bg-orange-100 text-orange-800' :
        'bg-blue-100 text-blue-800'
    }">
            ${courrier.priority || 'standard'}
          </span>
        </div>
      </div>

      <!-- Dates -->
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-gray-50 rounded-lg p-3">
          <p class="text-xs text-gray-600 font-semibold mb-1">Date d'enregistrement</p>
          <p class="text-sm text-gray-900">${formatDate(courrier.document?.date_enreg)}</p>
        </div>
        <div class="bg-gray-50 rounded-lg p-3">
          <p class="text-xs text-gray-600 font-semibold mb-1">Date du courrier</p>
          <p class="text-sm text-gray-900">${formatDate(courrier.document?.date_courrier)}</p>
        </div>
      </div>

      <!-- Structure -->
      <div class="bg-indigo-50 rounded-lg p-4">
        <p class="text-xs text-gray-600 uppercase font-semibold mb-1">Structure / Usager</p>
        <p class="text-sm text-gray-900">${courrier.structure || courrier.autre_structure || 'Non spécifié'}</p>
      </div>

      <!-- Type d'arrivée -->
      <div class="bg-purple-50 rounded-lg p-4">
        <p class="text-xs text-gray-600 uppercase font-semibold mb-1">Type d'arrivée</p>
        <p class="text-sm font-medium text-gray-900">${courrier.type_arrivee || 'Non spécifié'}</p>
      </div>
    </div>
  `

  await Swal.fire({
    title: 'Détails du courrier',
    html: details,
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

const onEdit = (item) => {
  console.log('Modifier:', item)
  navigateTo(`/courriers/edit/${item.id}`)
}

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
    reverseButtons: true
  })

  if (!result.isConfirmed) return

  try {
    const authToken = localStorage.getItem('auth_token')
    await $fetch(`${config.public.apiBase}/courriers-arrives/${item.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })

    await Swal.fire({
      title: 'Supprimé !',
      text: 'Le courrier a été supprimé avec succès',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    })

    refresh()
  } catch (err) {
    console.error('Erreur lors de la suppression:', err)

    await Swal.fire({
      title: 'Erreur',
      text: 'Impossible de supprimer le courrier',
      icon: 'error',
      confirmButtonColor: '#7c3aed'
    })
  }
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

:deep(.swal2-cancel):hover {
  background-color: #4b5563 !important;
}
</style>