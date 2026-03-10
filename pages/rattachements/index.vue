<template>
  <div>
    <!-- ── Modal Détails ── -->
    <UModal v-model="detailsOpen" :ui="{ width: 'sm:max-w-5xl' }">
      <div v-if="selectedItem" class="flex flex-col max-h-[90vh] bg-white rounded-xl overflow-hidden">

        <!-- En-tête modal -->
        <div class="relative flex items-center justify-between px-6 py-4 shrink-0 overflow-hidden"
          style="background: linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%);">
          <div class="absolute inset-0 opacity-10"
            style="background-image: radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px); background-size: 32px 32px;"></div>
          <div class="relative flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner border border-white/30">
              <Icon name="i-heroicons-link" class="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 class="text-base font-bold text-white leading-tight">Détails du rattachement</h2>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="text-xs text-indigo-200 font-medium">{{ selectedItem.ref_arrivee }}</span>
                <span class="w-1 h-1 rounded-full bg-indigo-300"></span>
                <Icon name="i-heroicons-arrow-right" class="w-3 h-3 text-indigo-300" />
                <span class="w-1 h-1 rounded-full bg-indigo-300"></span>
                <span class="text-xs text-indigo-200 font-medium">{{ selectedItem.ref_depart }}</span>
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

          <!-- Section Courrier Arrivée -->
          <section class="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
            <div class="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-slate-100">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Icon name="i-heroicons-inbox-arrow-down" class="w-3.5 h-3.5 text-indigo-600" />
                </div>
                <span class="text-[11px] font-bold text-indigo-700 uppercase tracking-widest">Courrier arrivée</span>
              </div>
            </div>

            <div class="p-4 space-y-3">
              <div class="grid grid-cols-1 gap-2">
                <div class="group flex items-stretch gap-0 rounded-xl overflow-hidden border border-indigo-100 hover:border-indigo-200 transition-colors">
                  <div class="w-1 shrink-0 bg-gradient-to-b from-indigo-400 to-indigo-600"></div>
                  <div class="flex-1 p-3 bg-gradient-to-r from-indigo-50 to-transparent">
                    <p class="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-0.5">Référence</p>
                    <p class="text-sm font-bold text-indigo-900">{{ selectedItem.ref_arrivee || 'Sans référence' }}</p>
                  </div>
                </div>
                <div class="group flex items-stretch gap-0 rounded-xl overflow-hidden border border-amber-100 hover:border-amber-200 transition-colors">
                  <div class="w-1 shrink-0 bg-gradient-to-b from-amber-400 to-orange-500"></div>
                  <div class="flex-1 p-3 bg-gradient-to-r from-amber-50 to-transparent">
                    <p class="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-0.5">Objet</p>
                    <p class="text-sm text-gray-800 leading-relaxed">{{ selectedItem.objet_arrivee || 'Non spécifié' }}</p>
                  </div>
                </div>
              </div>

              <!-- Bouton document arrivée -->
              <div class="pt-1">
                <div v-if="selectedItem.doc_arrivee">
                  <button v-if="!showArriveeDoc" @click="showArriveeDoc = true"
                    class="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-all hover:shadow-sm">
                    <Icon name="i-heroicons-document-arrow-down" class="w-4 h-4" />
                    Charger le document arrivée
                  </button>
                  <div v-else class="mt-2 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                    <DocumentRpreview :file-preview-url="selectedItem.doc_arrivee" height="400px" />
                  </div>
                </div>
                <div v-else class="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-400 bg-slate-50 border border-slate-200 rounded-xl cursor-not-allowed">
                  <Icon name="i-heroicons-document-text" class="w-4 h-4" />
                  Aucun document disponible
                </div>
              </div>
            </div>
          </section>

          <!-- Séparateur de liaison -->
          <div class="flex justify-center">
            <div class="flex items-center gap-2 px-4 py-2 bg-slate-100 border border-slate-200 rounded-full">
              <Icon name="i-heroicons-arrow-down" class="w-4 h-4 text-slate-400" />
              <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Rattachement</span>
              <Icon name="i-heroicons-arrow-down" class="w-4 h-4 text-slate-400" />
            </div>
          </div>

          <!-- Section Courrier Départ -->
          <section class="bg-white rounded-2xl border border-emerald-200/80 overflow-hidden shadow-sm">
            <div class="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Icon name="i-heroicons-paper-airplane" class="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <span class="text-[11px] font-bold text-emerald-700 uppercase tracking-widest">Courrier départ</span>
              </div>
            </div>

            <div class="p-4 space-y-3">
              <div class="grid grid-cols-1 gap-2">
                <div class="group flex items-stretch gap-0 rounded-xl overflow-hidden border border-emerald-100 hover:border-emerald-200 transition-colors">
                  <div class="w-1 shrink-0 bg-gradient-to-b from-emerald-400 to-teal-500"></div>
                  <div class="flex-1 p-3 bg-gradient-to-r from-emerald-50 to-transparent">
                    <p class="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-0.5">Référence</p>
                    <p class="text-sm font-bold text-emerald-900">{{ selectedItem.ref_depart || 'Sans référence' }}</p>
                  </div>
                </div>
                <div class="group flex items-stretch gap-0 rounded-xl overflow-hidden border border-slate-100 hover:border-slate-200 transition-colors">
                  <div class="w-1 shrink-0 bg-gradient-to-b from-slate-300 to-slate-400"></div>
                  <div class="flex-1 p-3 bg-gradient-to-r from-slate-50 to-transparent">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Objet</p>
                    <p class="text-sm text-slate-800 leading-relaxed">{{ selectedItem.objet_depart || 'Non spécifié' }}</p>
                  </div>
                </div>
              </div>

              <!-- Bouton document départ -->
              <div class="pt-1">
                <div v-if="selectedItem.doc_depart">
                  <button v-if="!showDepartDoc" @click="showDepartDoc = true"
                    class="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all hover:shadow-sm">
                    <Icon name="i-heroicons-document-arrow-down" class="w-4 h-4" />
                    Charger le document départ
                  </button>
                  <div v-else class="mt-2 rounded-xl overflow-hidden border border-emerald-200 shadow-sm">
                    <DocumentRpreview :file-preview-url="selectedItem.doc_depart" height="400px" />
                  </div>
                </div>
                <div v-else class="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-400 bg-slate-50 border border-slate-200 rounded-xl cursor-not-allowed">
                  <Icon name="i-heroicons-document-text" class="w-4 h-4" />
                  Aucun document disponible
                </div>
              </div>
            </div>
          </section>

          <!-- Métadonnées -->
          <section class="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
            <div class="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-slate-100">
              <div class="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center">
                <Icon name="i-heroicons-information-circle" class="w-3.5 h-3.5 text-slate-500" />
              </div>
              <span class="text-[11px] font-bold text-slate-600 uppercase tracking-widest">Informations</span>
            </div>
            <div class="p-4">
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                <div class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>Date de création
                  </p>
                  <p class="text-xs text-slate-800">{{ selectedItem.created_at || '—' }}</p>
                </div>
                <div v-if="selectedItem.created_by" class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>Créé par
                  </p>
                  <p class="text-xs text-slate-800">{{ selectedItem.created_by }}</p>
                </div>
              </div>
            </div>
          </section>

        </div>

        <!-- Pied modal -->
        <div class="px-6 py-3.5 border-t border-slate-100 shrink-0 flex items-center justify-between bg-white">
          <span class="text-[10px] text-slate-400">{{ selectedItem.ref_arrivee }} → {{ selectedItem.ref_depart }}</span>
          <UButton color="gray" variant="outline" size="sm" @click="closeDetails">Fermer</UButton>
        </div>
      </div>
    </UModal>

    <!-- En-tête -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="flex items-center gap-3 text-2xl font-bold text-slate-800">
        <Icon name="i-heroicons-link" class="w-7 h-7 text-blue-600" />
        Rattachements de Courriers
      </h1>
      <div class="flex items-center gap-3">
        <button @click="loadData"
          class="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all hover:shadow-md">
          <Icon name="i-heroicons-arrow-path" class="w-4 h-4" />
          Actualiser
        </button>
        <UBadge color="blue" variant="soft" size="lg" class="ml-auto">
          <Icon name="i-heroicons-plus" class="h-4 w-4 mr-1" />
          <UButton to="/rattachements/create" variant="text" size="sm" class="p-0 m-0 text-blue-600">
            Nouveau
          </UButton>
        </UBadge>
      </div>
    </div>

    <!-- Messages d'erreur -->
    <div v-if="error"
      class="flex items-center gap-3 p-4 mb-5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
      <Icon name="i-heroicons-exclamation-triangle" class="w-5 h-5 flex-shrink-0" />
      <span class="flex-1">{{ error }}</span>
      <button @click="error = null" class="text-lg opacity-60 hover:opacity-100 transition-opacity">✕</button>
    </div>

    <!-- Loader -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-16 gap-4">
      <div class="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p class="text-sm text-slate-500">Chargement des rattachements...</p>
    </div>

    <!-- DataTable -->
    <DataTable v-else ref="dataTableRef" :default-sort-column="null" :show-row-numbers="true" :data="rattachementData"
      :columns="columns" :selectable="false" :default-items-per-page="10" :items-per-page-options="[10, 25, 50, 100]"
      :left-aligned-columns="['objet_arrivee', 'objet_depart', 'ref_depart', 'ref_arrivee']" @view="viewDetails"
      @delete="deleteItem" @open-document="openDocument" @selection-change="handleSelectionChange">

      <template #advanced-filters="{ filters, onFilter }">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Date de création</label>
            <input v-model="filters.created_at" type="date"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              @input="onFilter" />
          </div>
        </div>
      </template>

      <template #selection-actions="{ selected }">
        <button @click="deleteSelected(selected)"
          class="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 hover:border-red-300 transition-all">
          <Icon name="i-heroicons-trash" class="w-4 h-4" />
          Supprimer ({{ selected.length }})
        </button>
      </template>

      <template #cell-ref_depart="{ value, item }">
        <div class="w-full">
          <button v-if="item.doc_depart" @click="openDocument(item.doc_depart)"
            class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-all group max-w-[180px]"
            :title="`Ouvrir le document ${value}`">
            <Icon name="i-heroicons-document-text" class="w-3.5 h-3.5 shrink-0 group-hover:scale-110 transition-transform" />
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

      <template #cell-objet_depart="{ value }">
        <span class="block text-xs text-slate-800 leading-relaxed whitespace-normal break-words min-w-[200px]" :title="value">
          {{ value }}
        </span>
      </template>

      <template #cell-ref_arrivee="{ value, item }">
        <div class="w-full">
          <button v-if="item.doc_arrivee" @click="openDocument(item.doc_arrivee)"
            class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-all group max-w-[180px]"
            :title="`Ouvrir le document ${value}`">
            <Icon name="i-heroicons-document-text" class="w-3.5 h-3.5 shrink-0 group-hover:scale-110 transition-transform" />
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

      <template #cell-objet_arrivee="{ value }">
        <span class="block text-xs text-slate-800 leading-relaxed whitespace-normal break-words min-w-[200px]" :title="value">
          {{ value }}
        </span>
      </template>

      <template #cell-link>
        <div class="flex justify-center">
          <Icon name="i-heroicons-arrow-right-circle" class="h-5 w-5 text-blue-500" />
        </div>
      </template>

      <template #actions="{ item }">
        <div class="flex gap-1.5 justify-end">
          <button @click="viewDetails(item)" title="Voir les détails"
            class="inline-flex items-center justify-center w-8 h-8 bg-amber-50 text-amber-700 border border-amber-100 rounded-md hover:bg-amber-200 hover:text-amber-900 transition-all group">
            <Icon name="i-heroicons-eye" class="w-4 h-4 group-hover:text-yellow-600" />
          </button>
          <button @click="deleteItem(item)" title="Supprimer"
            class="inline-flex items-center justify-center w-8 h-8 bg-red-50 text-red-700 border border-red-100 rounded-md hover:bg-red-200 hover:text-red-900 transition-all group">
            <Icon name="i-heroicons-trash" class="w-4 h-4 group-hover:text-red-600" />
          </button>
        </div>
      </template>

      <template #empty-state>
        <div class="text-center py-12">
          <Icon name="i-heroicons-link-slash" class="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun rattachement</h3>
          <p class="text-sm text-gray-500 mb-6">
            Commencez par créer un rattachement entre un courrier arrivée et un courrier départ.
          </p>
          <UBadge color="blue" variant="soft" size="lg">
            <Icon name="i-heroicons-plus" class="h-4 w-4 mr-1" />
            <UButton to="/rattachements/create" variant="text" size="sm" class="p-0 m-0 text-blue-600">
              Créer un rattachement
            </UButton>
          </UBadge>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DocumentRpreview from '~/components/DocumentRpreview.vue'
import Swal from 'sweetalert2'

useHead({ title: "Rattachements de Courriers - Sagar Revolution" })

const config = useRuntimeConfig()

// ── Colonnes ──────────────────────────────────────────────────────────────────
const columns = [
  { key: "ref_arrivee", label: "Réf. Arrivée", visible: true, width: 'min-w-[150px]', showLabel: false },
  { key: "objet_arrivee", label: "Objet Arrivée", visible: true, width: 'min-w-[250px]', showLabel: false },
  { key: "doc_arrivee", label: "Doc. Arrivée", visible: false, type: 'document', width: 'w-24', showLabel: false },
  { key: "link", label: "→", visible: true, width: 'w-16', sortable: false, filterable: false },
  { key: "ref_depart", label: "Réf. Départ", visible: true, width: 'min-w-[150px]', showLabel: false },
  { key: "objet_depart", label: "Objet Départ", visible: true, width: 'min-w-[250px]', showLabel: false },
  { key: "doc_depart", label: "Doc. Départ", visible: false, type: 'document', width: 'w-24' },
  { key: "created_at", label: "Date de création", visible: true, width: 'min-w-[140px]', showLabel: false },
]

// ── État ──────────────────────────────────────────────────────────────────────
const authToken = ref('')
const rattachementData = ref([])
const loading = ref(false)
const error = ref(null)
const dataTableRef = ref(null)
const toast = useToast()

// Modal
const detailsOpen = ref(false)
const selectedItem = ref(null)
const showArriveeDoc = ref(false)
const showDepartDoc = ref(false)

// ── Utilitaires ───────────────────────────────────────────────────────────────
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}

const transformerDonneesAPI = (reponseAPI) => {
  if (!reponseAPI?.data) throw new Error('Format de réponse API invalide')
  return reponseAPI.data.map(rattachement => ({
    id: rattachement.id,
    ref_arrivee: rattachement?.document?.reference || '',
    objet_arrivee: rattachement?.document?.objet || '',
    doc_arrivee: rattachement.document?.url && rattachement.document?.url !== 'Inconnu'
      ? (rattachement.document?.url.startsWith('http') ? rattachement.document?.url : `${config.public.baseUrl}${rattachement.document?.url}`)
      : '',
    link: '→',
    ref_depart: rattachement?.reponse?.reference || '',
    objet_depart: rattachement?.reponse?.objet || '',
    doc_depart: rattachement?.reponse?.url && rattachement?.reponse?.url !== 'Inconnu'
      ? (rattachement?.reponse?.url.startsWith('http') ? rattachement?.reponse?.url : `${config.public.baseUrl}${rattachement?.reponse?.url}`)
      : '',
    created_at: formatDate(rattachement.created_at),
    created_by: rattachement.user?.name || 'Système',
    courrier_arrivee: rattachement.document,
    courrier_depart: rattachement.reponse,
  }))
}

// ── Chargement ────────────────────────────────────────────────────────────────
const loadData = async () => {
  if (!authToken.value) {
    error.value = "Token d'authentification manquant"
    return
  }
  loading.value = true
  error.value = null
  try {
    const reponse = await $fetch(`${config.public.apiBase}/reponses`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${authToken.value}` },
    })
    rattachementData.value = transformerDonneesAPI(reponse)
  } catch (err) {
    console.error('❌ Erreur de chargement:', err)
    error.value = err.message || 'Impossible de charger les rattachements'
    toast.add({ title: "Erreur", description: "Impossible de charger les rattachements", color: "red", timeout: 1500 })
  } finally {
    loading.value = false
  }
}

// ── Modal détails ─────────────────────────────────────────────────────────────
const viewDetails = (item) => {
  selectedItem.value = item
  showArriveeDoc.value = false
  showDepartDoc.value = false
  detailsOpen.value = true
}

const closeDetails = () => {
  detailsOpen.value = false
  selectedItem.value = null
  showArriveeDoc.value = false
  showDepartDoc.value = false
}

// ── Handlers ──────────────────────────────────────────────────────────────────
const openDocument = (url) => {
  if (url) window.open(url, '_blank', 'noopener,noreferrer')
  else toast.add({ title: 'Information', description: 'Aucun document disponible', color: 'amber', timeout: 2000 })
}

const handleSelectionChange = (selected) => console.log(`${selected.length} ligne(s) sélectionnée(s)`, selected)

const deleteItem = async (item) => {
  const result = await Swal.fire({
    title: 'Confirmer la suppression',
    html: `
      <div class="text-left">
        <p class="mb-3">Êtes-vous sûr de vouloir supprimer ce rattachement ?</p>
        <div class="bg-gray-50 rounded-lg p-4 flex items-center justify-center gap-3">
          <span class="px-2.5 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">${item.ref_arrivee}</span>
          <span class="text-slate-500">→</span>
          <span class="px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full">${item.ref_depart}</span>
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
    await $fetch(`${config.public.apiBase}/reponses/${item.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken.value}` },
    })
    await Swal.fire({ title: 'Supprimé !', text: 'Le rattachement a été supprimé avec succès', icon: 'success', timer: 2000, showConfirmButton: false })
    await loadData()
  } catch (err) {
    console.error('❌ Erreur lors de la suppression:', err)
    await Swal.fire({ title: 'Erreur', text: 'Impossible de supprimer le rattachement', icon: 'error', confirmButtonColor: '#2563eb' })
  }
}

const deleteSelected = async (selectedIds) => {
  const result = await Swal.fire({
    title: 'Suppression multiple',
    html: `
      <div class="text-left">
        <p class="mb-3">Êtes-vous sûr de vouloir supprimer <strong class="text-red-600">${selectedIds.length} rattachement(s)</strong> ?</p>
        <p class="text-sm text-red-600 font-semibold">Cette action est irréversible.</p>
      </div>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: `Supprimer ${selectedIds.length}`,
    cancelButtonText: 'Annuler',
    reverseButtons: true,
  })
  if (!result.isConfirmed) return

  try {
    await Promise.all(
      selectedIds.map(id => $fetch(`${config.public.apiBase}/reponses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken.value}` },
      }))
    )
    await Swal.fire({ title: 'Supprimés !', text: `${selectedIds.length} rattachement(s) supprimé(s)`, icon: 'success', timer: 2000, showConfirmButton: false })
    await loadData()
  } catch (err) {
    console.error('❌ Erreur lors de la suppression multiple:', err)
    await Swal.fire({ title: 'Erreur', text: 'Impossible de supprimer les rattachements', icon: 'error', confirmButtonColor: '#2563eb' })
  }
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(async () => {
  if (process.client) authToken.value = localStorage.getItem('auth_token') || ''
  await loadData()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
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