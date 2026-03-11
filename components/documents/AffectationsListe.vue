<template>
  <!-- En-tête -->
  <div class="flex items-center justify-between mb-6">
    <h1 class="flex items-center gap-3 text-2xl font-bold text-slate-800">
      <Icon name="i-heroicons-inbox" class="w-7 h-7 text-blue-600" />
      Documents reçus
    </h1>
    <div class="flex items-center gap-3">
      <button @click="loadData"
        class="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all hover:shadow-md">
        <Icon name="i-heroicons-arrow-path" class="w-4 h-4" />
        Actualiser
      </button>
      <UBadge color="blue" variant="soft" size="lg" class="ml-auto">
        <Icon name="i-heroicons-document-text" class="h-4 w-4 mr-1" />
        <span class="text-sm">{{ affectationData.length }} document{{ affectationData.length > 1 ? 's' : '' }}</span>
      </UBadge>
    </div>
  </div>

  <!-- ── Modal détails ── -->
  <UModal v-model="detailsOpen" :ui="{ width: 'sm:max-w-3xl' }">
    <div v-if="selectedAffectation" class="flex flex-col max-h-[90vh] bg-white rounded-xl overflow-hidden">

      <!-- En-tête gradient -->
      <div class="relative flex items-center justify-between px-6 py-4 shrink-0 overflow-hidden"
        style="background: linear-gradient(135deg, #2563eb 0%, #8b5cf6 50%, #a78bfa 100%);">
        <div class="absolute inset-0 opacity-10"
          style="background-image: radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px); background-size: 32px 32px;">
        </div>
        <div class="relative flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner border border-white/30">
            <Icon name="i-heroicons-clipboard-document-list" class="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 class="text-base font-bold text-white leading-tight">Détails de l'affectation</h2>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-xs text-blue-200 font-medium">#{{ selectedAffectation.id }}</span>
              <span v-if="selectedAffectation.statut"
                class="inline-flex px-1.5 py-0.5 text-[10px] font-bold rounded-md uppercase border bg-white/20 text-white border-white/30">
                {{ selectedAffectation.statut }}
              </span>
              <span v-if="selectedAffectation.priority"
                class="inline-flex px-1.5 py-0.5 text-[10px] font-bold rounded-md uppercase border" :class="{
                  'bg-red-400/30 text-red-100 border-red-300/50': selectedAffectation.priority === 'URGENT',
                  'bg-orange-400/30 text-orange-100 border-orange-300/50': selectedAffectation.priority === 'IMPORTANT',
                  'bg-blue-400/30 text-blue-100 border-blue-300/50': selectedAffectation.priority === 'STANDARD',
                }">
                {{ selectedAffectation.priority }}
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
          <div
            class="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <div class="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
              <Icon name="i-heroicons-inbox-arrow-down" class="w-3.5 h-3.5 text-blue-600" />
            </div>
            <span class="text-[11px] font-bold text-blue-700 uppercase tracking-widest">Courrier associé</span>
          </div>

          <div class="p-4 space-y-3">
            <!-- Référence + Objet -->
            <div class="grid grid-cols-1 gap-2">
              <div
                class="flex items-stretch gap-0 rounded-xl overflow-hidden border border-indigo-100 hover:border-indigo-200 transition-colors">
                <div class="w-1 shrink-0 bg-gradient-to-b from-indigo-400 to-indigo-600"></div>
                <div class="flex-1 p-3 bg-gradient-to-r from-indigo-50 to-transparent">
                  <p class="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-0.5">Référence</p>
                  <p class="text-sm font-bold text-indigo-900">{{ selectedAffectation.reference_courrier || 'Sans référence' }}</p>
                </div>
              </div>
              <div
                class="flex items-stretch gap-0 rounded-xl overflow-hidden border border-amber-100 hover:border-amber-200 transition-colors">
                <div class="w-1 shrink-0 bg-gradient-to-b from-amber-400 to-orange-500"></div>
                <div class="flex-1 p-3 bg-gradient-to-r from-amber-50 to-transparent">
                  <p class="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-0.5">Objet</p>
                  <p class="text-sm text-gray-800 leading-relaxed">{{ selectedAffectation.objet_courrier || 'Non spécifié' }}</p>
                </div>
              </div>
            </div>

            <!-- Bouton document -->
            <div class="pt-1">
              <div v-if="selectedAffectation.doc_courrier">
                <button v-if="!showDoc" @click="showDoc = true"
                  class="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-all hover:shadow-sm">
                  <Icon name="i-heroicons-document-arrow-down" class="w-4 h-4" />
                  Charger le document
                </button>
                <div v-else class="mt-2 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                  <DocumentRpreview :file-preview-url="selectedAffectation.doc_courrier" height="400px" />
                </div>
              </div>
              <div v-else
                class="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-400 bg-slate-50 border border-slate-200 rounded-xl cursor-not-allowed">
                <Icon name="i-heroicons-document-text" class="w-4 h-4" />
                Aucun document disponible
              </div>
            </div>
          </div>
        </section>

        <!-- Section affectation -->
        <section class="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
          <div
            class="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-50 to-sky-50 border-b border-blue-100">
            <div class="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
              <Icon name="i-heroicons-clipboard-document-check" class="w-3.5 h-3.5 text-blue-600" />
            </div>
            <span class="text-[11px] font-bold text-blue-700 uppercase tracking-widest">Informations
              d'affectation</span>
          </div>

          <div class="p-4 space-y-3">
            <!-- Grille d'infos -->
            <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
              <div
                class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-blue-300 inline-block"></span>Type
                </p>
                <p class="text-xs font-semibold text-slate-800">{{ selectedAffectation.type || '—' }}</p>
              </div>
              <div
                class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>Date d'affectation
                </p>
                <p class="text-xs text-slate-800">{{ selectedAffectation.date_affect || '—' }}</p>
              </div>
              <div
                class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-300 inline-block"></span>Date de retour attendue
                </p>
                <p class="text-xs text-slate-800">{{ selectedAffectation.delai_traitement || '—' }}</p>
              </div>
              <div v-if="selectedAffectation.date_cloture"
                class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-green-300 inline-block"></span>Date de clôture
                </p>
                <p class="text-xs text-slate-800">{{ selectedAffectation.date_cloture }}</p>
              </div>
              <div v-if="selectedAffectation.emetteur"
                class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-indigo-300 inline-block"></span>Émetteur
                </p>
                <p class="text-xs text-slate-800">{{ selectedAffectation.emetteur }}</p>
              </div>
              <div v-if="selectedAffectation.destinataire"
                class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>Destinataire
                </p>
                <p class="text-xs text-slate-800">{{ selectedAffectation.destinataire }}</p>
              </div>
            </div>

            <!-- Instructions -->
            <div v-if="selectedAffectation.instructions"
              class="flex items-stretch gap-0 rounded-xl overflow-hidden border border-amber-100 hover:border-amber-200 transition-colors">
              <div class="w-1 shrink-0 bg-gradient-to-b from-amber-400 to-yellow-500"></div>
              <div class="flex-1 p-3 bg-gradient-to-r from-amber-50 to-transparent">
                <p class="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-1.5">Annotations /
                  Instructions</p>
                <p class="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{{ selectedAffectation.instructions
                  }}</p>
              </div>
            </div>
            <div v-else class="flex items-stretch gap-0 rounded-xl overflow-hidden border border-slate-100">
              <div class="w-1 shrink-0 bg-slate-200"></div>
              <div class="flex-1 p-3 bg-slate-50">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Annotations /
                  Instructions</p>
                <p class="text-xs text-slate-400 italic">Aucune instruction</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Pied modal -->
      <div class="px-6 py-3.5 border-t border-slate-100 shrink-0 flex items-center justify-between bg-white">
        <span class="text-[10px] text-slate-400">Affectation #{{ selectedAffectation.id }}</span>
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
    <div class="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
    <p class="text-sm text-slate-500">Chargement des documents...</p>
  </div>

  <!-- DataTable -->
  <DataTable v-else ref="dataTableRef" :default-sort-column="null" :show-row-numbers="true" :data="affectationData"
    :columns="columns" :selectable="false" :items-per-page-options="[10, 25, 50, 100]" :default-items-per-page="10"
    :left-aligned-columns="['objet_courrier', 'instructions', 'reference_courrier', 'emetteur', 'destinataire']"
    @edit="handleEdit" @delete="handleDelete" @open-document="handleOpenDocument"
    @selection-change="handleSelectionChange">

    <template #advanced-filters="{ filters, onFilter }">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Date d'affectation</label>
          <input v-model="filters.date_affect" type="date"
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            @input="onFilter" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Date de retour attendue</label>
          <input v-model="filters.delai_traitement" type="date"
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            @input="onFilter" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Date de clôture</label>
          <input v-model="filters.date_cloture" type="date"
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            @input="onFilter" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Émetteur</label>
          <input v-model="filters.emetteur" placeholder="Filtrer par émetteur..."
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            @input="onFilter" />
        </div>
      </div>
    </template>

    <template #cell-statut="{ value }">
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide"
        :class="getStatutClasses(value)">
        <span class="w-2 h-2 rounded-full mr-1.5" :class="getStatutDotClass(value)"></span>
        {{ value }}
      </span>
    </template>

    <template #cell-priority="{ value }">
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide"
        :class="getPriorityClasses(value)">
        <span class="w-2 h-2 rounded-full mr-1.5" :class="getPriorityDotClass(value)"></span>
        {{ value }}
      </span>
    </template>

    <template #cell-instructions="{ value }">
      <span class="block max-w-[300px] line-clamp-2 text-xs text-slate-700" :title="value">
        {{ value || 'Aucune instruction' }}
      </span>
    </template>

    <template #actions="{ item }">
      <div class="flex gap-1.5 justify-end">
        <button @click="handleViewDetails(item)" title="Voir les détails"
          class="inline-flex items-center justify-center w-8 h-8 bg-amber-50 text-amber-700 border border-amber-100 rounded-md hover:bg-amber-200 hover:text-amber-900 transition-all group">
          <Icon name="i-heroicons-eye" class="w-4 h-4 group-hover:text-yellow-600" />
        </button>
        <button v-if="isResponsable" @click="handleQuickAssign(item.courrier_id)" :disabled="!item.courrier_id"
          title="Affecter ce courrier"
          class="inline-flex items-center justify-center w-8 h-8 bg-sky-50 text-sky-700 border border-sky-100 rounded-md hover:bg-sky-200 hover:text-sky-900 transition-all group">
          <Icon name="i-heroicons-paper-airplane" class="w-4 h-4 group-hover:text-blue-600" />
        </button>
        <button v-if="isResponsable" @click="handleQuickTransfer(item.courrier_id)" :disabled="!item.courrier_id"
          title="Transférer ce courrier"
          class="inline-flex items-center justify-center w-8 h-8 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md hover:bg-emerald-200 hover:text-emerald-900 transition-all group">
          <Icon name="i-heroicons-arrow-path-rounded-square" class="w-4 h-4 group-hover:text-green-600" />
        </button>
      </div>
    </template>

    <template #cell-reference_courrier="{ value, item }">
      <div class="w-full">
        <button v-if="item.doc_courrier" @click="handleOpenDocument(item.doc_courrier)"
          class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-all group max-w-[180px]"
          :title="`Ouvrir le document ${value}`">
          <Icon name="i-heroicons-document-text"
            class="w-3.5 h-3.5 shrink-0 group-hover:scale-110 transition-transform" />
          <span class="break-words whitespace-normal min-w-0">{{ value }}</span>
          <Icon name="i-heroicons-arrow-top-right-on-square"
            class="w-3 h-3 shrink-0 opacity-60 group-hover:opacity-100" />
        </button>
        <span v-else
          class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md max-w-[180px]"
          :title="value">
          <Icon name="i-heroicons-document-text" class="w-3.5 h-3.5 shrink-0 opacity-50" />
          <span class="break-words whitespace-normal min-w-0">{{ value }}</span>
        </span>
      </div>
    </template>

    <template #cell-objet_courrier="{ value }">
      <span class="block text-xs text-slate-800 leading-relaxed whitespace-normal break-words min-w-[200px]"
        :title="value">
        {{ value }}
      </span>
    </template>

    <template #selection-actions="{ selected }">
      <button @click="handleBulkDelete(selected)"
        class="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 hover:border-red-300 transition-all">
        <Icon name="i-heroicons-trash" class="w-4 h-4" />
        Supprimer ({{ selected.length }})
      </button>
      <button @click="handleBulkExport(selected)"
        class="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-all">
        <Icon name="i-heroicons-arrow-down-tray" class="w-4 h-4" />
        Exporter ({{ selected.length }})
      </button>
    </template>
  </DataTable>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import DocumentRpreview from '~/components/DocumentRpreview.vue'
import { useAffectationsStore } from '~/stores/affectations.js'
import { useTransfertsStore } from '~/stores/transferts.js'
import { useAuth } from '~/composables/auth/useAuth'

const affectationsStore = useAffectationsStore()
const transfertsStore = useTransfertsStore()
const { isSecDir, getDirecteurEntiteUserId, isSP, isSA } = useAuth()

useHead({ title: "Documents reçus - Sagar Revolution" });

// ── Colonnes ──────────────────────────────────────────────────────────────────
const columns = [
  { key: "reference_courrier", label: "Référence du Courrier", visible: true, width: 'min-w-[200px]', showLabel: false, inputHidden: false },
  { key: "objet_courrier", label: "Objet", visible: true, width: 'min-w-[250px]', showLabel: false, inputHidden: false },
  { key: "doc_courrier", label: "Document", visible: false, type: 'document', width: 'w-24', showLabel: false, inputHidden: false },
  { key: "date_affect", label: "Date d'affectation", visible: true, width: 'min-w-[120px]', showLabel: false, inputHidden: false },
  { key: "instructions", label: "Annotations", visible: true, width: 'min-w-[200px]', showLabel: false, inputHidden: false },
  { key: "type", label: "Type", visible: true, width: 'min-w-[120px]', showLabel: false, inputHidden: false },
  { key: "statut", label: "Statut", visible: true, type: 'badge', width: 'min-w-[120px]', showLabel: false, inputHidden: false },
  { key: "priority", label: "Priorité", visible: true, type: 'badge', width: 'min-w-[120px]', showLabel: false, inputHidden: false },
  { key: "delai_traitement", label: "Date de retour attendue", visible: true, width: 'min-w-[120px]', showLabel: false, inputHidden: false },
  { key: "date_cloture", label: "Date clôture", visible: false, width: 'min-w-[120px]', showLabel: false, inputHidden: false },
  { key: "emetteur", label: "Source", visible: true, width: 'min-w-[180px]', showLabel: false, inputHidden: false },
  { key: "destinataire", label: "Destinataire", visible: false, width: 'min-w-[180px]', showLabel: false, inputHidden: false },
]

// ── État ──────────────────────────────────────────────────────────────────────
const authToken = ref('')
const affectationData = ref([])
const loading = ref(false)
const error = ref(null)
const toast = useToast()
const dataTableRef = ref(null)
const selectedRows = ref([])
const isResponsable = ref(false)
const config = useRuntimeConfig()

// Modal
const detailsOpen = ref(false)
const selectedAffectation = ref(null)
const showDoc = ref(false)

// ── Utilitaires ───────────────────────────────────────────────────────────────
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}

const transformerDonneesAPI = (reponseAPI) => {
  if (!reponseAPI?.data) throw new Error('Format de réponse API invalide')

  return reponseAPI.data.map(affectation => {
    let emetteurFormate = ''
    if (affectation?.emetteur?.user?.nom && affectation?.emetteur?.entite?.code) {
      const nomComplet = `${affectation.emetteur.user.nom} ${affectation.emetteur.user.prenom || ''}`.trim()
      const codeEntite = affectation.emetteur.entite.code
      const isResp = affectation.emetteur.is_responsable
      emetteurFormate = isResp ? `${nomComplet} (${codeEntite})` : `${nomComplet} - Agent / ${codeEntite}`
    }

    let destinataireFormate = ''
    if (affectation?.destinataire?.user?.nom && affectation?.destinataire?.entite?.code) {
      const nomComplet = `${affectation.destinataire.user.nom} ${affectation.destinataire.user.prenom || ''}`.trim()
      const codeEntite = affectation.destinataire.entite.code
      const isResp = affectation.emetteur.is_responsable
      destinataireFormate = isResp ? `${nomComplet} (${codeEntite})` : `${nomComplet} - Agent / ${codeEntite}`
    }

    return {
      id: affectation.id,
      courrier_id: affectation.courrier_arrive_id || null,
      reference_courrier: affectation?.courrier_arrive?.document?.reference || '',
      objet_courrier: affectation?.courrier_arrive?.document?.objet || '',
      doc_courrier: affectation?.courrier_arrive?.document?.url && affectation?.courrier_arrive?.document?.url !== 'Inconnu'
        ? (affectation?.courrier_arrive?.document?.url.startsWith('http')
          ? affectation?.courrier_arrive?.document?.url
          : `${config.public.baseUrl}${affectation?.courrier_arrive?.document?.url}`)
        : '',
      date_affect: formatDate(affectation.date_affect),
      instructions: affectation.instructions || '',
      type: affectation.type_affectation || '',
      statut: affectation.statut || '',
      priority: affectation.priority || '',
      delai_traitement: formatDate(affectation.delai_traitement),
      date_cloture: formatDate(affectation.date_cloture),
      emetteur: emetteurFormate,
      destinataire: destinataireFormate,
      _complete: affectation,
    }
  })
}

// ── Chargement ────────────────────────────────────────────────────────────────
const loadData = async () => {
  if (!authToken.value) { error.value = 'Token d\'authentification manquant'; return }
  loading.value = true
  error.value = null

  try {
    let entite_user = null
    if (process.client) {
      const savedFunction = localStorage.getItem('entite_user')
      if (savedFunction) {
        entite_user = JSON.parse(savedFunction)
        isResponsable.value = entite_user.is_responsable || false
      }
    }

    if (!entite_user || !entite_user.id) { error.value = 'Aucune fonction user sélectionnée'; return }

    const destinataireId = isSecDir()
      ? (getDirecteurEntiteUserId() ?? entite_user.id)
      : entite_user.id

    const reponse = await $fetch(`${config.public.apiBase}/affectations/destinataire/${destinataireId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${authToken.value}` },
      timeout: 15000,
    })

    affectationData.value = transformerDonneesAPI(reponse)
  } catch (err) {
    error.value = err.message || 'Erreur lors du chargement des données'
    toast.add({ title: 'Erreur', description: 'Impossible de charger les affectations', color: 'red', timeout: 1500 })
  } finally {
    loading.value = false
  }
}

// ── Styles ────────────────────────────────────────────────────────────────────

const getStatutClasses = (statut) => ({ 'en attente': 'bg-gray-100 text-gray-800', 'en cours': 'bg-blue-100 text-blue-800', 'traite': 'bg-green-100 text-green-800', 'cloture': 'bg-emerald-100 text-emerald-800', 'annule': 'bg-red-100 text-red-800' }[statut] || 'bg-gray-100 text-gray-800')
const getStatutDotClass = (statut) => ({ 'en attente': 'bg-gray-500', 'en cours': 'bg-blue-500', 'traite': 'bg-green-500', 'cloture': 'bg-emerald-500', 'annule': 'bg-red-500' }[statut] || 'bg-gray-500')

const getPriorityClasses = (priority) => ({
  'URGENT': 'bg-red-100 text-red-800',
  'IMPORTANT': 'bg-orange-100 text-orange-800',
  'STANDARD': 'bg-blue-100 text-blue-800',
}[priority] || 'bg-gray-100 text-gray-800')

const getPriorityDotClass = (priority) => ({
  'URGENT': 'bg-red-500',
  'IMPORTANT': 'bg-orange-500',
  'STANDARD': 'bg-blue-500',
}[priority] || 'bg-gray-500')

// ── Handlers ──────────────────────────────────────────────────────────────────
const handleOpenDocument = (url) => {
  if (url) window.open(url, '_blank', 'noopener,noreferrer')
  else toast.add({ title: 'Information', description: 'Aucun document disponible', color: 'amber', timeout: 2000 })
}

const handleSelectionChange = (selected) => { selectedRows.value = selected }

const handleViewDetails = (item) => {
  selectedAffectation.value = item
  showDoc.value = false
  detailsOpen.value = true
}

const closeDetails = () => {
  detailsOpen.value = false
  selectedAffectation.value = null
  showDoc.value = false
}

const handleEdit = (item) => console.log("Modifier l'affectation:", item)

const handleDelete = async (item) => {
  const result = await Swal.fire({
    title: 'Confirmer la suppression',
    html: `
      <div class="text-left">
        <p class="mb-3">Êtes-vous sûr de vouloir supprimer ce document ?</p>
        <div class="bg-gray-50 rounded-lg p-4 space-y-2">
          <p class="text-sm font-medium text-gray-900">${item.reference_courrier}</p>
          <p class="text-xs text-gray-600">${item.objet_courrier}</p>
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
    await $fetch(`${config.public.apiBase}/affectations/${item.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken.value}` },
    })
    await Swal.fire({ title: 'Supprimé !', text: 'Le document a été supprimé avec succès', icon: 'success', timer: 2000, showConfirmButton: false })
    await loadData()
  } catch (err) {
    await Swal.fire({ title: 'Erreur', text: 'Impossible de supprimer le document', icon: 'error', confirmButtonColor: '#2563eb' })
  }
}

const handleQuickAssign = (courrierId) => {
  if (!courrierId) { toast.add({ title: 'Erreur', description: 'ID du courrier introuvable', color: 'red', timeout: 1500 }); return }
  if (process.client) sessionStorage.setItem('preselected_courrier_id', courrierId.toString())
  navigateTo('/affectations/create')
}

const handleQuickTransfer = (courrierId) => {
  if (!courrierId) { toast.add({ title: 'Erreur', description: 'ID du courrier introuvable', color: 'red', timeout: 1500 }); return }
  if (process.client) sessionStorage.setItem('preselected_courrier_id_transfer', courrierId.toString())
  navigateTo('/affectations-transferts/form-transfert')
}

const handleProcess = (itemOrId) => {
  const courrierId = typeof itemOrId === 'object'
    ? (itemOrId.courrier_id || itemOrId._complete?.courrier_arrive_id || itemOrId.id)
    : itemOrId
  if (!courrierId) { toast.add({ title: 'Erreur', description: 'ID du courrier introuvable', color: 'red', timeout: 1500 }); return }
  if (process.client) sessionStorage.setItem('preselected_courrier_to_process', courrierId.toString())
  navigateTo('/modele')
}

const handleBulkDelete = async (selected) => {
  const result = await Swal.fire({
    title: 'Suppression multiple',
    html: `<p>Êtes-vous sûr de vouloir supprimer <strong>${selected.length} document(s)</strong> ?</p><p class="text-red-600 text-sm mt-2">Cette action est irréversible.</p>`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: `Supprimer ${selected.length}`,
    cancelButtonText: 'Annuler',
    reverseButtons: true,
  })
  if (!result.isConfirmed) return

  try {
    await Promise.all(selected.map(id => $fetch(`${config.public.apiBase}/affectations/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken.value}` },
    })))
    await Swal.fire({ title: 'Supprimés !', text: `${selected.length} document(s) supprimé(s)`, icon: 'success', timer: 2000, showConfirmButton: false })
    if (dataTableRef.value) dataTableRef.value.selectedRows = []
    await loadData()
  } catch (err) {
    await Swal.fire({ title: 'Erreur', text: 'Impossible de supprimer les documents', icon: 'error', confirmButtonColor: '#2563eb' })
  }
}

const handleBulkExport = (selected) => {
  toast.add({ title: 'Information', description: 'Fonctionnalité d\'export en cours de développement', color: 'amber', timeout: 2000 })
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

:deep(.line-clamp-2) {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>