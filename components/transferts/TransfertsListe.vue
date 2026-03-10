<template>
  <!-- En-tête -->
  <div class="flex items-center justify-between mb-6">
    <h1 class="flex items-center gap-3 text-2xl font-bold text-slate-800">
      Liste des Transferts
    </h1>
    <div class="flex items-center gap-3">
      <button @click="refreshData"
        class="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all hover:shadow-md">
        <Icon name="i-heroicons-arrow-path" class="w-4 h-4" />
        Actualiser
      </button>
      <UBadge v-if="peutTransferer() && !isAdmin()" color="blue" variant="soft" size="lg" class="ml-auto">
        <Icon name="i-heroicons-plus" class="h-4 w-4 mr-1" />
        <UButton to="/affectations-transferts/form-transfert" variant="text" size="sm" class="p-0 m-0 text-blue-600">
          Nouveau
        </UButton>
      </UBadge>
    </div>
  </div>

  <!-- ── Modal détails ── -->
  <UModal v-model="detailsOpen" :ui="{ width: 'sm:max-w-3xl' }">
    <div v-if="selectedTransfert" class="flex flex-col max-h-[90vh] bg-white rounded-xl overflow-hidden">

      <!-- En-tête gradient teal -->
      <div class="relative flex items-center justify-between px-6 py-4 shrink-0 overflow-hidden"
        style="background: linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%);">
        <div class="absolute inset-0 opacity-10"
          style="background-image: radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px); background-size: 32px 32px;"></div>
        <div class="relative flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner border border-white/30">
            <Icon name="i-heroicons-arrow-path-rounded-square" class="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 class="text-base font-bold text-white leading-tight">Détails du transfert</h2>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-xs text-teal-200 font-medium">#{{ selectedTransfert.id }}</span>
              <span v-if="selectedTransfert.statut"
                class="inline-flex px-1.5 py-0.5 text-[10px] font-bold rounded-md uppercase border bg-white/20 text-white border-white/30">
                {{ selectedTransfert.statut }}
              </span>
              <span v-if="selectedTransfert.priority"
                class="inline-flex px-1.5 py-0.5 text-[10px] font-bold rounded-md uppercase border"
                :class="{
                  'bg-red-400/30 text-red-100 border-red-300/50': selectedTransfert.priority === 'URGENT',
                  'bg-orange-400/30 text-orange-100 border-orange-300/50': selectedTransfert.priority === 'IMPORTANT',
                  'bg-teal-400/30 text-teal-100 border-teal-300/50': selectedTransfert.priority === 'STANDARD',
                }">
                {{ selectedTransfert.priority }}
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

        <!-- Section courrier -->
        <section class="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
          <div class="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-teal-100">
            <div class="w-6 h-6 rounded-lg bg-teal-100 flex items-center justify-center">
              <Icon name="i-heroicons-inbox-arrow-down" class="w-3.5 h-3.5 text-teal-600" />
            </div>
            <span class="text-[11px] font-bold text-teal-700 uppercase tracking-widest">Courrier associé</span>
          </div>

          <div class="p-4 space-y-3">
            <div class="grid grid-cols-1 gap-2">
              <div class="flex items-stretch gap-0 rounded-xl overflow-hidden border border-teal-100 hover:border-teal-200 transition-colors">
                <div class="w-1 shrink-0 bg-gradient-to-b from-teal-400 to-teal-600"></div>
                <div class="flex-1 p-3 bg-gradient-to-r from-teal-50 to-transparent">
                  <p class="text-[10px] font-bold text-teal-400 uppercase tracking-wider mb-0.5">Référence</p>
                  <p class="text-sm font-bold text-teal-900">{{ selectedTransfert.reference || 'Sans référence' }}</p>
                </div>
              </div>
              <div class="flex items-stretch gap-0 rounded-xl overflow-hidden border border-amber-100 hover:border-amber-200 transition-colors">
                <div class="w-1 shrink-0 bg-gradient-to-b from-amber-400 to-orange-500"></div>
                <div class="flex-1 p-3 bg-gradient-to-r from-amber-50 to-transparent">
                  <p class="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-0.5">Objet</p>
                  <p class="text-sm text-gray-800 leading-relaxed">{{ selectedTransfert.objet || 'Non spécifié' }}</p>
                </div>
              </div>
            </div>

            <!-- Bouton document -->
            <div class="pt-1">
              <div v-if="selectedTransfert.url">
                <button v-if="!showDoc" @click="showDoc = true"
                  class="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition-all hover:shadow-sm">
                  <Icon name="i-heroicons-document-arrow-down" class="w-4 h-4" />
                  Charger le document
                </button>
                <div v-else class="mt-2 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                  <DocumentRpreview :file-preview-url="selectedTransfert.url" height="400px" />
                </div>
              </div>
              <div v-else class="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-400 bg-slate-50 border border-slate-200 rounded-xl cursor-not-allowed">
                <Icon name="i-heroicons-document-text" class="w-4 h-4" />
                Aucun document disponible
              </div>
            </div>
          </div>
        </section>

        <!-- Section transfert -->
        <section class="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
          <div class="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-teal-100">
            <div class="w-6 h-6 rounded-lg bg-teal-100 flex items-center justify-center">
              <Icon name="i-heroicons-arrow-path-rounded-square" class="w-3.5 h-3.5 text-teal-600" />
            </div>
            <span class="text-[11px] font-bold text-teal-700 uppercase tracking-widest">Informations du transfert</span>
          </div>

          <div class="p-4 space-y-3">
            <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
              <div class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>Date de transfert
                </p>
                <p class="text-xs text-slate-800">{{ selectedTransfert.date_transfert || '—' }}</p>
              </div>
              <div class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>Type
                </p>
                <p class="text-xs text-slate-800">{{ selectedTransfert.type || '—' }}</p>
              </div>
            </div>

            <!-- Émetteur -->
            <div class="flex items-stretch gap-0 rounded-xl overflow-hidden border border-slate-100 hover:border-slate-200 transition-colors">
              <div class="w-1 shrink-0 bg-gradient-to-b from-slate-300 to-slate-400"></div>
              <div class="flex-1 p-3 bg-gradient-to-r from-slate-50 to-transparent">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Émetteur</p>
                <p class="text-sm font-bold text-slate-800">{{ selectedTransfert._raw?.emetteur?.user ? `${selectedTransfert._raw.emetteur.user.nom} ${selectedTransfert._raw.emetteur.user.prenom || ''}`.trim() : '—' }}</p>
                <p class="text-xs text-slate-500 mt-0.5">{{ selectedTransfert.emetteur }}</p>
              </div>
            </div>

            <!-- Destinataire -->
            <div class="flex items-stretch gap-0 rounded-xl overflow-hidden border border-teal-100 hover:border-teal-200 transition-colors">
              <div class="w-1 shrink-0 bg-gradient-to-b from-teal-400 to-cyan-500"></div>
              <div class="flex-1 p-3 bg-gradient-to-r from-teal-50 to-transparent">
                <p class="text-[10px] font-bold text-teal-500 uppercase tracking-wider mb-1">Destinataire</p>
                <p class="text-sm font-bold text-slate-800">{{ selectedTransfert._raw?.destinataire?.user ? `${selectedTransfert._raw.destinataire.user.nom} ${selectedTransfert._raw.destinataire.user.prenom || ''}`.trim() : '—' }}</p>
                <p class="text-xs text-slate-500 mt-0.5">{{ selectedTransfert.destinataire }}</p>
                <p v-if="selectedTransfert._raw?.destinataire?.entite?.libelle" class="text-xs text-slate-400">{{ selectedTransfert._raw.destinataire.entite.libelle }}</p>
              </div>
            </div>

            <!-- Instructions -->
            <div v-if="selectedTransfert._raw?.instructions"
              class="flex items-stretch gap-0 rounded-xl overflow-hidden border border-amber-100 hover:border-amber-200 transition-colors">
              <div class="w-1 shrink-0 bg-gradient-to-b from-amber-400 to-yellow-500"></div>
              <div class="flex-1 p-3 bg-gradient-to-r from-amber-50 to-transparent">
                <p class="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-1.5">Instructions</p>
                <p class="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{{ selectedTransfert._raw.instructions }}</p>
              </div>
            </div>
            <div v-else class="flex items-stretch gap-0 rounded-xl overflow-hidden border border-slate-100">
              <div class="w-1 shrink-0 bg-slate-200"></div>
              <div class="flex-1 p-3 bg-slate-50">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Instructions</p>
                <p class="text-xs text-slate-400 italic">Aucune instruction</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Pied modal -->
      <div class="px-6 py-3.5 border-t border-slate-100 shrink-0 flex items-center justify-between bg-white">
        <span class="text-[10px] text-slate-400">Transfert #{{ selectedTransfert.id }}</span>
        <UButton color="gray" variant="outline" size="sm" @click="closeDetails">Fermer</UButton>
      </div>
    </div>
  </UModal>

  <!-- Messages d'erreur -->
  <div v-if="error"
    class="flex items-center gap-3 p-4 mb-5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
    <Icon name="i-heroicons-exclamation-triangle" class="w-5 h-5 flex-shrink-0" />
    <span class="flex-1">{{ error }}</span>
    <button @click="error = null" class="text-lg opacity-60 hover:opacity-100 transition-opacity">✕</button>
  </div>

  <!-- Loader -->
  <div v-if="loading" class="flex flex-col items-center justify-center py-16 gap-4">
    <div class="w-12 h-12 border-4 border-gray-200 border-t-teal-600 rounded-full animate-spin"></div>
    <p class="text-sm text-slate-500">Chargement des transferts...</p>
  </div>

  <!-- DataTable -->
  <DataTable v-else :data="tableData" :default-sort-column="null" :show-row-numbers="true" :columns="columns"
    :selectable="false" :default-items-per-page="10" :items-per-page-options="[10, 25, 50, 100]"
    :left-aligned-columns="['objet', 'courrier', 'emetteur', 'destinataire']" @edit="handleEdit"
    @delete="handleDelete" @selection-change="handleSelectionChange">

    <template #cell-priority="{ value }">
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide"
        :class="getPriorityClasses(value)">
        <span class="w-2 h-2 rounded-full mr-1.5" :class="getPriorityDotClass(value)"></span>
        {{ getPriorityLabel(value) }}
      </span>
    </template>

    <template #cell-objet="{ value }">
      <span class="block text-xs text-slate-800 leading-relaxed whitespace-normal break-words min-w-[200px]" :title="value">
        {{ value }}
      </span>
    </template>

    <template #cell-reference="{ value, item }">
      <div class="w-full">
        <button v-if="item.url" @click="onOpenDocument(item.url)"
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

    <template #actions="{ item }">
      <div class="flex gap-1.5 justify-end">
        <button @click="handleView(item)" title="Voir les détails"
          class="inline-flex items-center justify-center w-8 h-8 bg-amber-50 text-amber-700 border border-amber-100 rounded-md hover:bg-amber-200 hover:text-amber-900 transition-all group">
          <Icon name="i-heroicons-eye" class="w-4 h-4 group-hover:text-yellow-600" />
        </button>
        <button v-if="peutTransferer() && !isAdmin()" @click="handleEdit(item)"
          class="inline-flex items-center justify-center w-8 h-8 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md hover:bg-emerald-200 hover:text-emerald-900 transition-all group"
          title="Modifier">
          <Icon name="i-heroicons-pencil" class="w-4 h-4 group-hover:text-green-600" />
        </button>
      </div>
    </template>

    <template #selection-actions="{ selected }">
      <template v-if="peutTransferer()">
        <button @click="handleBulkDelete(selected)"
          class="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 hover:border-red-300 transition-all">
          <Icon name="i-heroicons-trash" class="w-4 h-4" />
          Supprimer ({{ selected.length }})
        </button>
      </template>
      <button @click="handleBulkExport(selected)"
        class="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-all">
        <Icon name="i-heroicons-arrow-down-tray" class="w-4 h-4" />
        Exporter ({{ selected.length }})
      </button>
    </template>
  </DataTable>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTransferts } from '~/composables/transferts/useTransferts'
import { useAuth } from '~/composables/auth/useAuth'
import DataTable from '~/components/DataTable.vue'
import DocumentRpreview from '~/components/DocumentRpreview.vue'

const { tableData, loading, error, fetchTransferts, config } = useTransferts()
const { peutTransferer, isAdmin } = useAuth()

// ── Modal ─────────────────────────────────────────────────────────────────────
const detailsOpen = ref(false)
const selectedTransfert = ref(null)
const showDoc = ref(false)

// ── Colonnes ──────────────────────────────────────────────────────────────────
const columns = ref([
  { key: 'date_transfert', label: 'Date', visible: true, inputHidden: true },
  { key: 'reference', label: 'Référence', visible: true, showLabel: false, inputHidden: false },
  { key: 'objet', label: 'Objet', visible: true, showLabel: false, inputHidden: false },
  { key: 'destinataire', label: 'Destinataire', visible: true, showLabel: false, inputHidden: false },
  { key: 'priority', label: 'Priorité', visible: true, type: 'badge', width: 'min-w-[120px]', inputHidden: true },
  { key: 'statut', label: 'Statut', visible: true, type: 'badge', inputHidden: true },
])
if (isAdmin()) {
  columns.value.push({ key: 'emetteur', label: 'Émetteur', visible: true, width: 'min-w-[180px]' })
}

// ── Handlers ──────────────────────────────────────────────────────────────────
const handleView = (item) => {
  // Récupère l'URL depuis _raw et la construit si besoin
  const rawUrl = item._raw?.courrier_arrive?.document?.url
  const docUrl = rawUrl && rawUrl !== 'Inconnu'
    ? (rawUrl.startsWith('http') ? rawUrl : `${config.public.baseUrl}${rawUrl}`)
    : null

  selectedTransfert.value = { ...item, url: docUrl }
  showDoc.value = false
  detailsOpen.value = true
}

const closeDetails = () => {
  detailsOpen.value = false
  selectedTransfert.value = null
  showDoc.value = false
}

const onOpenDocument = (url) => {
  if (url) window.open(url, '_blank', 'noopener,noreferrer')
}

const handleEdit = async (item) => {
  if (!peutTransferer()) return
  try {
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token')
    const response = await fetch(`${config.public.apiBase}/transferts/${item.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({}),
    })
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)
    fetchTransferts()
  } catch (err) {
    console.error('Erreur lors de la modification:', err)
  }
}

const handleDelete = async (item) => {
  if (!peutTransferer()) return
  if (confirm(`Voulez-vous vraiment supprimer le transfert "${item.objet}" ?`)) {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token')
      const response = await fetch(`${config.public.apiBase}/transferts/${item.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)
      fetchTransferts()
    } catch (err) {
      console.error('Erreur lors de la suppression:', err)
    }
  }
}

const handleSelectionChange = (selected) => console.log('Sélection:', selected)

const handleBulkDelete = (selected) => {
  if (!peutTransferer()) return
  if (confirm(`Voulez-vous vraiment supprimer ${selected.length} transfert(s) ?`)) {
    console.log('Suppression multiple:', selected)
  }
}

const handleBulkExport = (selected) => console.log('Export multiple:', selected)

const getPriorityLabel = (priority) => ({ 'URGENT': 'URGENT', 'IMPORTANT': 'IMPORTANT', 'STANDARD': 'STANDARD' }[priority] || priority)
const getPriorityClasses = (priority) => ({ 'URGENT': 'bg-red-100 text-red-800', 'IMPORTANT': 'bg-orange-100 text-orange-800', 'STANDARD': 'bg-blue-100 text-blue-800' }[priority] || 'bg-blue-100 text-blue-800')
const getPriorityDotClass = (priority) => ({ 'URGENT': 'bg-red-500', 'IMPORTANT': 'bg-orange-500', 'STANDARD': 'bg-blue-500' }[priority] || 'bg-gray-500')

const refreshData = () => fetchTransferts()

onMounted(() => { fetchTransferts() })
</script>