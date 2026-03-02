<template>
  <div class="min-h-screen bg-slate-100 p-6 font-sans">

    <UModal v-model="detailsOpen" :ui="{ width: 'sm:max-w-5xl' }">
      <div v-if="selectedCourrier" class="flex flex-col max-h-[90vh] bg-white rounded-xl overflow-hidden">

        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <Icon name="i-heroicons-envelope-open" class="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h2 class="text-base font-bold text-slate-900">Détails du courrier arrivé</h2>
              <p class="text-xs text-slate-500">N° {{ selectedCourrier.numero_enreg }}</p>
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
                  'bg-red-50 text-red-700 border-red-200': selectedCourrier.details?.priority?.toLowerCase() === 'urgent',
                  'bg-amber-50 text-amber-700 border-amber-200': selectedCourrier.details?.priority?.toLowerCase() === 'important',
                  'bg-sky-50 text-sky-700 border-sky-200': !selectedCourrier.details?.priority || selectedCourrier.details?.priority?.toLowerCase() === 'standard',
                }">{{ selectedCourrier.details?.priority || 'Standard' }}</span>
              </div>
            </div>

            <div class="p-4 space-y-3">
              <div class="grid grid-cols-1 gap-2">
                <div class="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                  <div class="w-1 h-full min-h-[2rem] rounded-full bg-indigo-400 shrink-0 self-stretch"></div>
                  <div>
                    <p class="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-0.5">Référence</p>
                    <p class="text-sm font-bold text-indigo-900">{{ selectedCourrier.reference || 'Sans référence' }}</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <div class="w-1 h-full min-h-[2rem] rounded-full bg-amber-400 shrink-0 self-stretch"></div>
                  <div>
                    <p class="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-0.5">Objet</p>
                    <p class="text-sm text-gray-800 leading-relaxed">{{ selectedCourrier.objet || 'Non spécifié' }}</p>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Source</p>
                  <p class="text-xs font-semibold text-slate-800">{{ selectedCourrier.details?.service_enreg || 'N/A' }}</p>
                </div>
                <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Structure / Usager</p>
                  <p class="text-xs text-slate-800">{{ selectedCourrier.details?.structure || selectedCourrier.details?.autre_structure || 'Non spécifié' }}</p>
                </div>
                <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Type d'arrivée</p>
                  <p class="text-xs text-slate-800">{{ selectedCourrier.details?.type_arrivee || 'Non spécifié' }}</p>
                </div>
                <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">N° enregistrement</p>
                  <p class="text-xs font-semibold text-slate-800">{{ selectedCourrier.numero_enreg || '—' }}</p>
                </div>
                <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Date d'enregistrement</p>
                  <p class="text-xs text-slate-800">{{ formatDate(selectedCourrier.date_enreg) || '—' }}</p>
                </div>
                <div v-if="selectedCourrier.date_courrier" class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Date du courrier</p>
                  <p class="text-xs text-slate-800">{{ formatDate(selectedCourrier.date_courrier) }}</p>
                </div>
                <div v-if="selectedCourrier.type_document" class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Type de document</p>
                  <p class="text-xs text-slate-800">{{ selectedCourrier.type_document.libelle }}</p>
                </div>
              </div>

              <div class="pt-1">
                <div v-if="arriveeUrl">
                  <button v-if="!showArriveeDoc" @click="showArriveeDoc = true"
                    class="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-all">
                    <Icon name="i-heroicons-document-arrow-down" class="w-4 h-4" />
                    Charger le document arrivé
                  </button>
                  <div v-else class="mt-2 rounded-lg overflow-hidden border border-slate-200">
                    <DocumentRpreview :file-preview-url="arriveeUrl" height="400px" />
                  </div>
                </div>
                <div v-else
                  class="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-400 bg-slate-50 border border-slate-200 rounded-lg cursor-not-allowed">
                  <Icon name="i-heroicons-document-text" class="w-4 h-4" />
                  Aucun document disponible
                </div>
              </div>
            </div>
          </section>
        </div>

        <div class="px-6 py-4 border-t border-slate-100 shrink-0 flex justify-end">
          <UButton color="gray" variant="outline" @click="closeDetails">Fermer</UButton>
        </div>
      </div>
    </UModal>

    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Tous les documents</h1>
        <p class="text-sm text-slate-500">Gestion et suivi des documents</p>
      </div>
      <UBadge color="blue" variant="soft" size="lg" class="ml-auto" v-if="!isAdmin()">
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

      <template #actions="{ item }">
        <div class="flex gap-1.5 justify-end">
          <button @click="handleView(item)" title="Voir les détails"
            class="inline-flex items-center justify-center w-8 h-8 bg-amber-50 text-amber-700 border-amber-100 rounded-md hover:bg-amber-200 hover:text-amber-900 transition-all group">
            <Icon name="i-heroicons-eye" class="w-4 h-4 group-hover:text-yellow-600" />
          </button>
          <!-- <button v-if="!isAdmin()" @click="handleQuickAssign(item.id)" title="Affecter ce courrier"
            class="inline-flex items-center justify-center w-8 h-8 bg-sky-50 text-sky-700 border-sky-100 rounded-md hover:bg-sky-200 hover:text-sky-900 transition-all group">
            <Icon name="i-heroicons-paper-airplane" class="w-4 h-4 group-hover:text-blue-600" />
          </button> -->
          <!-- <button v-if="!isAdmin()" @click="handleReply(item)" title="Répondre au courrier"
            class="inline-flex items-center justify-center w-8 h-8 bg-emerald-50 text-emerald-700 border-emerald-100 rounded-md hover:bg-emerald-200 hover:text-emerald-900 transition-all group">
            <Icon name="i-heroicons-arrow-uturn-right" class="w-4 h-4 group-hover:text-green-600" />
          </button> -->
          <!-- <button v-if="isAdmin()" @click="onEdit(item)" title="Modifier ce courrier"
            class="inline-flex items-center justify-center w-8 h-8 bg-sky-50 text-sky-700 border-sky-100 rounded-md hover:bg-sky-200 hover:text-sky-900 transition-all group">
            <Icon name="i-heroicons-pencil" class="w-4 h-4 group-hover:text-blue-600" />
          </button> -->
          <!-- <button v-if="isAdmin()" @click="onDelete(item)" title="Supprimer ce courrier"
            class="inline-flex items-center justify-center w-8 h-8 bg-red-50 text-red-700 border-red-100 rounded-md hover:bg-red-200 hover:text-red-900 transition-all group">
            <Icon name="i-heroicons-trash" class="w-4 h-4 group-hover:text-red-600" />
          </button> -->
        </div>
      </template>

      <template #cell-source="{ value }">
        <span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
          {{ value }}
        </span>
      </template>

      <template #cell-type="{ value }">
        <span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border uppercase" :class="{
          'bg-blue-50 text-blue-700 border-blue-100': value === 'arrive',
          'bg-orange-50 text-orange-700 border-orange-100': value === 'depart',
        }">
          {{ value }}
        </span>
      </template>

      <template #cell-reference="{ value, item }">
        <button v-if="item.url" @click="onOpenDocument(item.url)"
          class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-all group"
          :title="`Ouvrir le document ${value}`">
          <Icon name="i-heroicons-document-text" class="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span>{{ value }}</span>
          <Icon name="i-heroicons-arrow-top-right-on-square" class="w-3 h-3 opacity-60 group-hover:opacity-100" />
        </button>
        <span v-else class="inline-flex items-center px-2.5 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md">
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
import { ref, computed, onMounted } from 'vue'
import DataTable from '~/components/DataTable.vue'
import DocumentRpreview from '~/components/DocumentRpreview.vue'
import { useAffectationsStore } from '~/stores/affectations'
import { useCourriersStore } from '~/stores/courriers'
import { useAuth } from '~/composables/auth/useAuth'
import Swal from 'sweetalert2'

const props = defineProps({
  entiteId: { type: Number, default: null }
})

const store = useAffectationsStore()
const courriersStore = useCourriersStore()
const config = useRuntimeConfig()
const { isAdmin } = useAuth()

const filterFields = [
  { id: 'source', label: 'Source' },
  { id: 'structure', label: 'Structure' },
  { id: 'objet', label: 'Objet' },
  { id: 'type_arrivee', label: "Type d'arrivée" },
]

// ── État ──────────────────────────────────────────────────────────────────────
const courriers = ref([])
const loading = ref(false)
const error = ref(null)
const detailsOpen = ref(false)
const selectedCourrier = ref(null)
const showArriveeDoc = ref(false)

// ── Computed ──────────────────────────────────────────────────────────────────
const arriveeUrl = computed(() => {
  const raw = selectedCourrier.value?.url
  const url = raw?.trim?.()
  if (!url || url === 'Inconnu' || url === '') return null
  if (url.startsWith('http')) return url
  const base = config.public.baseUrl?.replace(/\/$/, '')
  const path = url.startsWith('/') ? url : `/${url}`
  return `${base}${path}`
})

// ── Colonnes ──────────────────────────────────────────────────────────────────
const columns = [
  { key: 'source', label: 'Source', visible: true, type: 'badge', inputHidden: true },
  { key: 'type', label: 'Type', visible: true, type: 'badge', inputHidden: true },
  { key: 'reference', label: 'Référence', visible: true, inputWidth: '80px', inputPlaceholder: 'Réf...' },
  { key: 'numeroEnregistrement', label: "N° d'enreg.", visible: false, inputHidden: true },
  { key: 'objet', label: 'Objet', visible: true },
  { key: 'date_enregistrement', label: "Date d'enregistrement", visible: false },
  { key: 'date_courrier', label: 'Date du Courrier', visible: false },
  { key: 'url', label: 'Document', visible: false, type: 'document' },
  { key: 'type_arrivee', label: "Type d'arrivée", visible: false },
  { key: 'priority', label: 'Priorité', visible: true, type: 'badge' },
  { key: 'structure', label: 'Structure / Usager', visible: true },
]

// ── Utilitaires ───────────────────────────────────────────────────────────────
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}

// La nouvelle API /documents/type retourne une structure PLATE :
// - Les champs principaux (reference, objet, date_enreg, url, type) sont directement sur l'objet
// - Les détails spécifiques (service_enreg, structure, priority, type_arrivee...) sont dans `details`
const transformCourriers = (response) => {
  if (!response?.data) throw new Error('Format de réponse API invalide')

  return response.data
    .map((doc) => ({
      id: doc.id,
      source: doc.details?.service_enreg || doc.details?.service_emis ||'',
      type: doc.type,
      numeroEnregistrement: doc.numero_enreg || '',
      reference: doc.reference || '',
      structure: doc.details?.structure || doc.details?.autre_structure || '',
      date_enregistrement: formatDate(doc.date_enreg),
      objet: doc.objet || '',
      date_courrier: formatDate(doc.date_courrier),
      url: doc.url && doc.url !== 'Inconnu'
        ? (doc.url.startsWith('http') ? doc.url : `${config.public.baseUrl}${doc.url}`)
        : '',
      type_arrivee: doc.details?.type_arrivee || '',
      priority: doc.details?.priority || '',
      _complete: doc, // On garde l'objet complet pour la modal
    }))
}

// ── Chargement ────────────────────────────────────────────────────────────────
const refresh = async () => {
  loading.value = true
  error.value = null

  try {
    const authToken = localStorage.getItem('auth_token') || ''

    let endpoint = `${config.public.apiBase}/documents/type`
    if (props.entiteId) {
      const selectedEntite = JSON.parse(localStorage.getItem('selected_entite') || 'null')
      if (selectedEntite?.code) {
        endpoint += `?service_enreg=${selectedEntite.code}`
      }
    }

    console.log(`[CourriersArrivesListe] GET ${endpoint}`)

    const response = await $fetch(endpoint, {
      headers: { Authorization: `Bearer ${authToken}` },
    })

    courriers.value = transformCourriers(response)

  } catch (err) {
    console.error('❌ Erreur chargement courriers arrivés:', err)
    error.value = err.message || 'Erreur lors du chargement'
  } finally {
    loading.value = false
  }
}

// ── Modal détails ─────────────────────────────────────────────────────────────
const handleView = (item) => {
  selectedCourrier.value = item._complete || item
  showArriveeDoc.value = false
  detailsOpen.value = true
}

const closeDetails = () => {
  detailsOpen.value = false
  selectedCourrier.value = null
  showArriveeDoc.value = false
}

// ── Handlers ──────────────────────────────────────────────────────────────────
const onOpenDocument = (url) => {
  if (url) window.open(url, '_blank', 'noopener,noreferrer')
}

const onSelectionChange = (ids) => console.log('Sélection:', ids)

const handleQuickAssign = (courrierId) => {
  store.selectCourrierFromQuickAction(courrierId)
  navigateTo('/affectations/create')
}

const handleReply = (item) => {
  const courrier = item._complete || item
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
    refresh()
  } catch (err) {
    const message = err.data?.message || err.message || 'Impossible de supprimer le courrier'
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
      confirmButtonColor: '#7c3aed',
      confirmButtonText: 'Compris',
    })
  }
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(() => {
  refresh()
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