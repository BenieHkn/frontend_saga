<template>
  <div class="min-h-screen bg-slate-100 p-6 font-sans">

    <!-- ═══════════════════════════════════════════════════════════
         MODAL DÉTAILS COURRIER
    ════════════════════════════════════════════════════════════ -->
    <UModal v-model="detailsOpen" :ui="{ width: 'sm:max-w-5xl' }">
      <div v-if="selectedCourrier" class="flex flex-col max-h-[90vh] bg-white rounded-xl overflow-hidden">

        <!-- Header modal -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <Icon name="i-heroicons-envelope-open" class="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h2 class="text-base font-bold text-slate-900">Détails du courrier arrivé</h2>
              <p class="text-xs text-slate-500">N° {{ selectedCourrier.document?.numero_enreg }}</p>
            </div>
          </div>
          <button @click="closeDetails"
            class="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700">
            <Icon name="i-heroicons-x-mark" class="w-4 h-4" />
          </button>
        </div>

        <!-- Corps scrollable -->
        <div class="overflow-y-auto flex-1 p-5 space-y-5">

          <!-- ══ SECTION : COURRIER ARRIVÉ ══ -->
          <section class="bg-white rounded-xl border border-slate-200 overflow-hidden">

            <!-- En-tête section -->
            <div class="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-100">
              <div class="flex items-center gap-2">
                <div class="w-5 h-5 rounded bg-indigo-100 flex items-center justify-center">
                  <Icon name="i-heroicons-inbox-arrow-down" class="w-3 h-3 text-indigo-600" />
                </div>
                <span class="text-[11px] font-bold text-slate-600 uppercase tracking-widest">Courrier arrivé</span>
              </div>
              <div class="flex items-center gap-1.5">
                <!-- Badge priorité -->
                <span class="inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full border uppercase" :class="{
                  'bg-red-50 text-red-700 border-red-200': selectedCourrier.priority?.toLowerCase() === 'urgent',
                  'bg-amber-50 text-amber-700 border-amber-200': selectedCourrier.priority?.toLowerCase() === 'important',
                  'bg-sky-50 text-sky-700 border-sky-200': !selectedCourrier.priority || selectedCourrier.priority?.toLowerCase() === 'standard',
                }">{{ selectedCourrier.priority || 'Standard' }}</span>
                <!-- Badge statut -->
                <span v-if="selectedCourrier.document?.reponses?.length"
                  class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-green-50 text-green-700 border border-green-200">
                  <Icon name="i-heroicons-check-circle" class="w-3 h-3" /> Répondu
                </span>
                <span v-else
                  class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  <Icon name="i-heroicons-clock" class="w-3 h-3" /> En attente
                </span>
              </div>
            </div>

            <!-- Contenu -->
            <div class="p-4 space-y-3">

              <!-- Référence + Objet (pleine largeur) -->
              <div class="grid grid-cols-1 gap-2">
                <div class="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                  <div class="w-1 h-full min-h-[2rem] rounded-full bg-indigo-400 shrink-0 self-stretch"></div>
                  <div>
                    <p class="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-0.5">Référence</p>
                    <p class="text-sm font-bold text-indigo-900">{{ selectedCourrier.document?.reference || 'Sans
                      référence' }}</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <div class="w-1 h-full min-h-[2rem] rounded-full bg-amber-400 shrink-0 self-stretch"></div>
                  <div>
                    <p class="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-0.5">Objet</p>
                    <p class="text-sm text-gray-800 leading-relaxed">{{ selectedCourrier.document?.objet || 'Non
                      spécifié' }}</p>
                  </div>
                </div>
              </div>

              <!-- Grille 3 colonnes : infos -->
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Source</p>
                  <p class="text-xs font-semibold text-slate-800">{{ selectedCourrier.service_enreg || 'N/A' }}</p>
                </div>
                <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Structure / Usager</p>
                  <p class="text-xs text-slate-800">{{ selectedCourrier.structure || selectedCourrier.autre_structure ||
                    'Non spécifié' }}</p>
                </div>
                <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Type d'arrivée</p>
                  <p class="text-xs text-slate-800">{{ selectedCourrier.type_arrivee || 'Non spécifié' }}</p>
                </div>
                <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">N° enregistrement</p>
                  <p class="text-xs font-semibold text-slate-800">{{ selectedCourrier.document?.numero_enreg || '—' }}
                  </p>
                </div>
                <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Date d'enregistrement
                  </p>
                  <p class="text-xs text-slate-800">{{ formatDate(selectedCourrier.document?.date_enreg) || '—' }}</p>
                </div>
                <div v-if="selectedCourrier.document?.date_courrier"
                  class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Date du courrier</p>
                  <p class="text-xs text-slate-800">{{ formatDate(selectedCourrier.document?.date_courrier) }}</p>
                </div>
              </div>

              <!-- Document arrivé -->
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

          <!-- ══ SECTION : COURRIER DE RÉPONSE ══ -->
          <section v-if="selectedCourrier.document?.reponses?.length"
            class="bg-white rounded-xl border border-emerald-200 overflow-hidden">

            <!-- En-tête section -->
            <div class="flex items-center justify-between px-4 py-2.5 bg-emerald-50 border-b border-emerald-100">
              <div class="flex items-center gap-2">
                <div class="w-5 h-5 rounded bg-emerald-100 flex items-center justify-center">
                  <Icon name="i-heroicons-arrow-uturn-right" class="w-3 h-3 text-emerald-600" />
                </div>
                <span class="text-[11px] font-bold text-emerald-700 uppercase tracking-widest">Courrier de
                  réponse</span>
              </div>
              <span v-if="reponseData && !loadingReponse"
                class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                <Icon name="i-heroicons-check-circle" class="w-3 h-3" /> Chargé
              </span>
            </div>

            <!-- Chargement -->
            <div v-if="loadingReponse" class="flex items-center justify-center gap-3 py-8 text-slate-400">
              <div class="w-5 h-5 border-2 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
              <span class="text-xs font-medium">Chargement du courrier de réponse...</span>
            </div>

            <!-- Contenu chargé -->
            <div v-else-if="reponseData" class="p-4 space-y-3">

              <!-- Référence + Objet -->
              <div class="grid grid-cols-1 gap-2">
                <div class="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                  <div class="w-1 min-h-[2rem] rounded-full bg-emerald-400 shrink-0 self-stretch"></div>
                  <div>
                    <p class="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-0.5">Référence</p>
                    <p class="text-sm font-bold text-emerald-900">{{ reponseData.reference || 'Sans référence' }}</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div class="w-1 min-h-[2rem] rounded-full bg-slate-300 shrink-0 self-stretch"></div>
                  <div>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Objet</p>
                    <p class="text-sm text-slate-800 leading-relaxed">{{ reponseData.objet || 'Non spécifié' }}</p>
                  </div>
                </div>
              </div>

              <!-- Grille infos départ -->
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Destinataire</p>
                  <p class="text-xs font-semibold text-slate-800">{{ reponseData.destinataire || '—' }}</p>
                </div>
                <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Date de départ</p>
                  <p class="text-xs text-slate-800">{{ formatDate(reponseData.date_depart) || '—' }}</p>
                </div>
                <div v-if="reponseData.service_emis" class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Service émetteur</p>
                  <p class="text-xs text-slate-800">{{ reponseData.service_emis }}</p>
                </div>
                <div v-if="reponseData.type_depart" class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Type de départ</p>
                  <p class="text-xs text-slate-800">{{ reponseData.type_depart }}</p>
                </div>
              </div>

              <!-- Document réponse -->
              <div class="pt-1">
                <div v-if="reponseData.url">
                  <button v-if="!showReponseDoc" @click="showReponseDoc = true"
                    class="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-all">
                    <Icon name="i-heroicons-document-arrow-down" class="w-4 h-4" />
                    Charger le document de réponse
                  </button>
                  <div v-else class="mt-2 rounded-lg overflow-hidden border border-emerald-200">
                    <DocumentRpreview :file-preview-url="reponseData.url" height="400px" />
                  </div>
                </div>
                <div v-else
                  class="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-400 bg-slate-50 border border-slate-200 rounded-lg cursor-not-allowed">
                  <Icon name="i-heroicons-document-text" class="w-4 h-4" />
                  Aucun document disponible pour la réponse
                </div>
              </div>

            </div>

            <!-- Erreur chargement réponse -->
            <div v-else
              class="flex items-center gap-2 m-4 p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600">
              <Icon name="i-heroicons-exclamation-triangle" class="w-4 h-4 shrink-0" />
              Impossible de charger les détails du courrier de réponse.
            </div>

          </section>

        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-slate-100 shrink-0 flex justify-end">
          <UButton color="gray" variant="outline" @click="closeDetails">Fermer</UButton>
        </div>
      </div>
    </UModal>

    <!-- ═══════════════════════════════════════════════════════════
         EN-TÊTE PAGE
    ════════════════════════════════════════════════════════════ -->
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

      <template #actions="{ item }">
        <div class="flex gap-1.5 justify-end">
          <button @click="handleView(item)" title="Voir les détails"
            class="inline-flex items-center justify-center w-8 h-8 bg-amber-50 text-amber-700 border-amber-100 rounded-md hover:bg-amber-200 hover:text-amber-900 transition-all group">
            <Icon name="i-heroicons-eye" class="w-4 h-4 group-hover:text-yellow-600" />
          </button>

          <button @click="handleQuickAssign(item.id)" title="Affecter ce courrier"
            class="inline-flex items-center justify-center w-8 h-8 bg-sky-50 text-sky-700 border-sky-100 rounded-md hover:bg-sky-200 hover:text-sky-900 transition-all group">
            <Icon name="i-heroicons-paper-airplane" class="w-4 h-4 group-hover:text-blue-600" />
          </button>

          <button v-if="!item._complete?.document?.reponses?.length" @click="handleReply(item)"
            title="Répondre au courrier"
            class="inline-flex items-center justify-center w-8 h-8 bg-emerald-50 text-emerald-700 border-emerald-100 rounded-md hover:bg-emerald-200 hover:text-emerald-900 transition-all group">
            <Icon name="i-heroicons-arrow-uturn-right" class="w-4 h-4 group-hover:text-green-600" />
          </button>

          <div v-else title="Ce courrier a déjà une réponse"
            class="inline-flex items-center justify-center w-8 h-8 bg-green-50 text-green-500 border border-green-100 rounded-md cursor-default">
            <Icon name="i-heroicons-check-circle" class="w-4 h-4" />
          </div>
        </div>
      </template>

      <template #cell-source="{ value }">
        <span
          class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
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
        <span v-else
          class="inline-flex items-center px-2.5 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md">
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
import { ref, computed } from 'vue'
import DataTable from '~/components/DataTable.vue'
import DocumentRpreview from '~/components/DocumentRpreview.vue'  // ✅ Un seul composant unifié, nom correct
import { useApi } from '~/composables/useApi'
import { useAffectationsStore } from '~/stores/affectations'
import { useCourriersStore } from '~/stores/courriers'
import Swal from 'sweetalert2'

const store = useAffectationsStore()
const courriersStore = useCourriersStore()
const config = useRuntimeConfig()

// ── État modal détails ────────────────────────────────────────────────────────
const detailsOpen = ref(false)
const selectedCourrier = ref(null)
const showArriveeDoc = ref(false)
const showReponseDoc = ref(false)
const loadingReponse = ref(false)
const reponseData = ref(null)

// ── URL document courrier arrivé ──────────────────────────────────────────────
const arriveeUrl = computed(() => {
  const raw = selectedCourrier.value?.document?.url
  const url = raw?.trim?.() // 🔑 trim pour éliminer espaces/newlines invisibles
  console.log('🔗 [arriveeUrl] url brute:', raw, '| après trim:', url)

  if (!url || url === 'Inconnu' || url === '') {
    console.warn('⚠️ [arriveeUrl] URL absente, vide ou "Inconnu"')
    return null
  }

  // Évite le double préfixage si l'URL contient déjà baseUrl
  if (url.startsWith('http')) {
    console.log('✅ [arriveeUrl] URL absolue directe:', url)
    return url
  }

  const base = config.public.baseUrl?.replace(/\/$/, '') // retire le slash final si présent
  const path = url.startsWith('/') ? url : `/${url}`
  const fullUrl = `${base}${path}`
  console.log('✅ [arriveeUrl] URL construite:', fullUrl)
  return fullUrl
})

// ── Ouvrir la modal détails ───────────────────────────────────────────────────
const handleView = async (item) => {
  const courrier = item._complete || item
  console.log('👁️ [handleView] courrier complet reçu:', JSON.stringify(courrier, null, 2))
  console.log('📄 [handleView] document:', courrier.document)
  console.log('🔗 [handleView] url du document:', courrier.document?.url)

  selectedCourrier.value = courrier
  showArriveeDoc.value = false
  showReponseDoc.value = false
  reponseData.value = null
  detailsOpen.value = true

  const reponses = courrier.document?.reponses || []
  console.log('📨 [handleView] reponses trouvées:', reponses)

  if (reponses.length) {
    // reponse_id = id du courrier-depart dans la table courriers_departs
    const courierDepartId = reponses[0]?.reponse_id
    console.log('🆔 [handleView] reponses[0] complet:', reponses[0])
    console.log('🆔 [handleView] courierDepartId utilisé:', courierDepartId)
    if (courierDepartId) {
      await loadReponseData(courierDepartId)
    } else {
      console.error('❌ [handleView] reponse_id absent dans reponses[0]:', reponses[0])
    }
  }
}

const closeDetails = () => {
  detailsOpen.value = false
  selectedCourrier.value = null
  reponseData.value = null
  showArriveeDoc.value = false
  showReponseDoc.value = false
}

// ── Charger les données du document de réponse ────────────────────────────────
const loadReponseData = async (documentId) => {
  if (!documentId) return
  loadingReponse.value = true
  try {
    const authToken = process.client ? localStorage.getItem('auth_token') : ''
    // reponse_id dans la table reponses = document_id du courrier-départ
    // Stratégie : récupérer tous les courriers-départs et trouver celui dont document_id === reponse_id
    const allDeparts = await $fetch(`${config.public.apiBase}/courriers-departs`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })

    console.log('📦 [loadReponseData] Tous les courriers-départs:', JSON.stringify(allDeparts, null, 2))

    const allData = allDeparts?.data || allDeparts || []
    const list = Array.isArray(allData) ? allData : []

    // Trouver le courrier-départ dont document_id correspond à notre reponse_id
    const doc = list.find(cd => cd.document_id === documentId) || null
    console.log('📄 [loadReponseData] courrier-départ trouvé pour document_id=' + documentId + ':', doc)

    if (!doc) {
      console.error('❌ Aucun courrier-départ trouvé avec document_id:', documentId)
      reponseData.value = null
      return  // finally s'exécutera quand même → loadingReponse = false
    }

    // Cherche la partie "courrier départ" dans toutes les clés possibles
    const depart =
      doc?.courrierDepart ||
      doc?.courrier_depart ||
      doc?.depart ||
      {}

    // Construction URL robuste avec trim + normalisation slash
    // L'URL est dans doc.document.url selon la structure API
    const rawUrl = (doc?.document?.url || '').trim()
    console.log('🔗 [loadReponseData] url brute:', rawUrl)

    const buildUrl = (raw) => {
      if (!raw || raw === 'Inconnu') return null
      if (raw.startsWith('http')) return raw
      const base = config.public.baseUrl?.replace(/\/$/, '')
      const path = raw.startsWith('/') ? raw : `/${raw}`
      return `${base}${path}`
    }

    // Structure API : { id, type_depart, destinataire, date_depart, document: { reference, objet, url, ... } }
    reponseData.value = {
      reference: doc?.document?.reference || 'Sans référence',
      objet: doc?.document?.objet || 'Non spécifié',
      destinataire: doc?.destinataire || '—',
      date_depart: doc?.date_depart || null,
      type_depart: doc?.type_depart || null,
      service_emis: doc?.service_emis || null,
      url: buildUrl(rawUrl),
    }

    console.log('✅ [loadReponseData] reponseData final:', reponseData.value)
  } catch (e) {
    console.error('❌ [loadReponseData] Erreur chargement réponse:', e)
    reponseData.value = null
  } finally {
    loadingReponse.value = false
  }
}

// ── Colonnes ──────────────────────────────────────────────────────────────────
const columns = [
  { key: 'source', label: 'Source', visible: true, type: 'badge', inputHidden: true },
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

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
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
    url: courrier.document?.url ? `${config.public.baseUrl}${courrier.document.url}` : '',
    type_arrivee: courrier.type_arrivee || '',
    priority: courrier.priority || '',
    _complete: courrier,
  }))
}

// ── API ───────────────────────────────────────────────────────────────────────
const { data: courriers, loading, error, refresh } = useApi('/courriers-arrives', {
  transform: transformCourriers,
  immediate: true,
})

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
  if (courrier.document?.reponses?.length) {
    Swal.fire({ title: 'Déjà répondu', text: 'Ce courrier a déjà reçu une réponse.', icon: 'info', confirmButtonColor: '#7c3aed' })
    return
  }
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
    console.error(err)
    await Swal.fire({ title: 'Erreur', text: 'Impossible de supprimer le courrier', icon: 'error', confirmButtonColor: '#7c3aed' })
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