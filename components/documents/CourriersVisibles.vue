<template>
    <div class="flex items-center justify-between mb-6">
      <h1 class="flex items-center gap-3 text-2xl font-bold text-slate-800">
        <Icon name="i-heroicons-eye" class="w-7 h-7 text-blue-600" />
        Initiés/Paraphés
      </h1>
      <div class="flex items-center gap-3">
        <button @click="loadData"
          class="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all hover:shadow-md">
          <Icon name="i-heroicons-arrow-path" class="w-4 h-4" />
          Actualiser
        </button>
        <UBadge color="blue" variant="soft" size="lg">
          <Icon name="i-heroicons-document-text" class="h-4 w-4 mr-1" />
          <span class="text-sm">{{ courrierData.length }} courrier{{ courrierData.length > 1 ? 's' : '' }}</span>
        </UBadge>
      </div>
    </div>

    <!-- ── Modal détails ── -->
    <UModal v-model="detailsOpen" :ui="{ width: 'sm:max-w-3xl' }">
      <div v-if="selectedCourrier" class="flex flex-col max-h-[90vh] bg-white rounded-xl overflow-hidden">

        <!-- En-tête gradient -->
        <div class="relative flex items-center justify-between px-6 py-4 shrink-0 overflow-hidden"
          style="background: linear-gradient(135deg, #ea580c 0%, #f97316 50%, #fb923c 100%);">
          <div class="absolute inset-0 opacity-10"
            style="background-image: radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px); background-size: 32px 32px;"></div>
          <div class="relative flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner border border-white/30">
              <Icon name="i-heroicons-paper-airplane" class="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 class="text-base font-bold text-white leading-tight">Détails du courrier départ</h2>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="text-xs text-orange-200 font-medium">{{ selectedCourrier.numero_enreg || '—' }}</span>
                <span v-if="selectedCourrier.confidentiel"
                  class="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-red-400/30 text-red-100 border border-red-300/50">
                  <Icon name="i-heroicons-lock-closed" class="w-3 h-3" /> Confidentiel
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

          <!-- Section document -->
          <section class="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
            <div class="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
              <div class="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center">
                <Icon name="i-heroicons-paper-airplane" class="w-3.5 h-3.5 text-orange-600" />
              </div>
              <span class="text-[11px] font-bold text-orange-700 uppercase tracking-widest">Courrier départ</span>
            </div>

            <div class="p-4 space-y-3">
              <!-- Référence + Objet -->
              <div class="grid grid-cols-1 gap-2">
                <div class="flex items-stretch gap-0 rounded-xl overflow-hidden border border-orange-100 hover:border-orange-200 transition-colors">
                  <div class="w-1 shrink-0 bg-gradient-to-b from-orange-400 to-red-500"></div>
                  <div class="flex-1 p-3 bg-gradient-to-r from-orange-50 to-transparent">
                    <p class="text-[10px] font-bold text-orange-400 uppercase tracking-wider mb-0.5">Référence</p>
                    <p class="text-sm font-bold text-orange-900">{{ selectedCourrier.reference || 'Sans référence' }}</p>
                  </div>
                </div>
                <div class="flex items-stretch gap-0 rounded-xl overflow-hidden border border-amber-100 hover:border-amber-200 transition-colors">
                  <div class="w-1 shrink-0 bg-gradient-to-b from-amber-400 to-orange-500"></div>
                  <div class="flex-1 p-3 bg-gradient-to-r from-amber-50 to-transparent">
                    <p class="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-0.5">Objet</p>
                    <p class="text-sm text-gray-800 leading-relaxed">{{ selectedCourrier.objet || 'Non spécifié' }}</p>
                  </div>
                </div>
              </div>

              <!-- Grille d'infos -->
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                <div class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-orange-300 inline-block"></span>Service émetteur
                  </p>
                  <p class="text-xs font-semibold text-slate-800">{{ selectedCourrier.service_emis || '—' }}</p>
                </div>
                <div class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>Destinataire
                  </p>
                  <p class="text-xs font-semibold text-slate-800">{{ selectedCourrier.destinataire || '—' }}</p>
                </div>
                <div class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>Type de départ
                  </p>
                  <p class="text-xs text-slate-800">{{ selectedCourrier.type_depart || '—' }}</p>
                </div>
                <div class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>Date de départ
                  </p>
                  <p class="text-xs text-slate-800">{{ selectedCourrier.date_depart || '—' }}</p>
                </div>
                <div v-if="selectedCourrier.date_enreg" class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>Date d'enregistrement
                  </p>
                  <p class="text-xs text-slate-800">{{ selectedCourrier.date_enreg }}</p>
                </div>
                <div v-if="selectedCourrier.type_document" class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-green-300 inline-block"></span>Type de document
                  </p>
                  <p class="text-xs text-slate-800">{{ selectedCourrier.type_document }}</p>
                </div>
              </div>

              <!-- Initiateurs -->
              <div v-if="selectedCourrier.initiateurs"
                class="flex items-stretch gap-0 rounded-xl overflow-hidden border border-blue-100 hover:border-blue-200 transition-colors">
                <div class="w-1 shrink-0 bg-gradient-to-b from-blue-400 to-violet-600"></div>
                <div class="flex-1 p-3 bg-gradient-to-r from-blue-50 to-transparent">
                  <p class="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1.5">Initiateurs</p>
                  <p class="text-xs text-slate-800 leading-relaxed">{{ selectedCourrier.initiateurs }}</p>
                </div>
              </div>

              <!-- Bouton document -->
              <div class="pt-1">
                <div v-if="selectedCourrier.url">
                  <button v-if="!showDoc" @click="showDoc = true"
                    class="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl transition-all hover:shadow-sm">
                    <Icon name="i-heroicons-document-arrow-down" class="w-4 h-4" />
                    Charger le document
                  </button>
                  <div v-else class="mt-2 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                    <DocumentRpreview :file-preview-url="selectedCourrier.url" height="400px" />
                  </div>
                </div>
                <div v-else class="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-400 bg-slate-50 border border-slate-200 rounded-xl cursor-not-allowed">
                  <Icon name="i-heroicons-document-text" class="w-4 h-4" />
                  Aucun document disponible
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Pied modal -->
        <div class="px-6 py-3.5 border-t border-slate-100 shrink-0 flex items-center justify-between bg-white">
          <span class="text-[10px] text-slate-400">{{ selectedCourrier.reference || '' }}</span>
          <UButton color="gray" variant="outline" size="sm" @click="closeDetails">Fermer</UButton>
        </div>
      </div>
    </UModal>

    <div v-if="error"
      class="flex items-center gap-3 p-4 mb-5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
      <Icon name="i-heroicons-exclamation-triangle" class="w-5 h-5 flex-shrink-0" />
      <span class="flex-1">{{ error }}</span>
      <button @click="error = null" class="text-lg opacity-60 hover:opacity-100">✕</button>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center py-16 gap-4">
      <div class="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p class="text-sm text-slate-500">Chargement des courriers...</p>
    </div>

    <DataTable v-else :data="courrierData" :columns="columns" :selectable="false" :show-row-numbers="true"
      :default-items-per-page="10" :items-per-page-options="[10, 25, 50, 100]"
      :left-aligned-columns="['objet', 'destinataire', 'service_emis']">

      <template #cell-objet="{ value }">
        <span class="block text-xs text-slate-800 leading-relaxed whitespace-normal break-words min-w-[200px]" :title="value">
          {{ value }}
        </span>
      </template>

      <template #cell-reference="{ value, item }">
        <div class="w-full">
          <button v-if="item.url" @click="handleOpenDocument(item.url)"
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

      <template #cell-confidentiel="{ value }">
        <span v-if="value" class="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-red-700 bg-red-50 rounded-full">
          <Icon name="i-heroicons-lock-closed" class="w-3 h-3" /> Confidentiel
        </span>
        <span v-else class="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-green-700 bg-green-50 rounded-full">
          <Icon name="i-heroicons-lock-open" class="w-3 h-3" /> Standard
        </span>
      </template>

      <template #actions="{ item }">
        <div class="flex gap-1.5 justify-end">
          <button @click="handleViewDetails(item)" title="Voir les détails"
            class="inline-flex items-center justify-center w-8 h-8 bg-amber-50 text-amber-700 border border-amber-100 rounded-md hover:bg-amber-200 hover:text-amber-900 transition-all group">
            <Icon name="i-heroicons-eye" class="w-4 h-4 group-hover:text-yellow-600" />
          </button>
        </div>
      </template>
    </DataTable>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DocumentRpreview from '~/components/DocumentRpreview.vue'

const config = useRuntimeConfig()
const toast = useToast()

const courrierData = ref([])
const loading = ref(false)
const error = ref(null)
const authToken = ref('')

// ── Modal ─────────────────────────────────────────────────────────────────────
const detailsOpen = ref(false)
const selectedCourrier = ref(null)
const showDoc = ref(false)

// ── Colonnes ──────────────────────────────────────────────────────────────────
const columns = [
  { key: 'reference', label: 'Référence', visible: true, width: 'min-w-[180px]', showLabel: false },
  { key: 'objet', label: 'Objet', visible: true, width: 'min-w-[250px]', showLabel: false },
  { key: 'type_document', label: 'Type document', visible: true, width: 'min-w-[180px]', showLabel: false },
  { key: 'date_depart', label: 'Date départ', visible: true, width: 'min-w-[120px]', showLabel: false },
  { key: 'service_emis', label: 'Service émetteur', visible: true, width: 'min-w-[150px]', showLabel: false },
  { key: 'destinataire', label: 'Destinataire', visible: true, width: 'min-w-[150px]', showLabel: false },
  { key: 'initiateurs', label: 'Initiateur(s)', visible: false, width: 'min-w-[200px]' },
  { key: 'type_depart', label: 'Type', visible: false, width: 'min-w-[100px]' },
  { key: 'confidentiel', label: 'Confidentialité', visible: false, width: 'min-w-[130px]' },
]

// ── Utilitaires ───────────────────────────────────────────────────────────────
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}

const transformerDonnees = (reponseAPI) => {
  if (!reponseAPI?.data) throw new Error('Format de réponse API invalide')

  return reponseAPI.data.map(courrier => {
    const initiateurFormate = courrier.initiateurs?.map(init => {
      const nomComplet = `${init.user?.nom} ${init.user?.prenom || ''}`.trim()
      const role = init.is_responsable ? init.entite?.fonction : 'Agent'
      return `${nomComplet} (${init.entite?.code} - ${role})`
    }).join(', ') || ''

    const rawUrl = courrier.document?.url
    const docUrl = rawUrl && rawUrl !== 'Inconnu'
      ? (rawUrl.startsWith('http') ? rawUrl : `${config.public.baseUrl}${rawUrl}`)
      : null

    return {
      id: courrier.id,
      reference: courrier.document?.reference || '',
      objet: courrier.document?.objet || '',
      numero_enreg: courrier.document?.numero_enreg || '',
      url: docUrl,
      date_enreg: formatDate(courrier.document?.date_enreg),
      date_depart: formatDate(courrier.date_depart),
      type_document: courrier.document?.type_document?.libelle || '',
      service_emis: courrier.service_emis || '',
      destinataire: courrier.destinataire || '',
      type_depart: courrier.type_depart || '',
      confidentiel: courrier.confidentiel || false,
      initiateurs: initiateurFormate,
      _complete: courrier,
    }
  })
}

// ── Chargement ────────────────────────────────────────────────────────────────
const loadData = async () => {
  if (!authToken.value) return
  loading.value = true
  error.value = null

  try {
    let entiteUser = null
    if (process.client) {
      const saved = localStorage.getItem('entite_user')
      if (saved) entiteUser = JSON.parse(saved)
    }

    if (!entiteUser?.id) { error.value = 'Aucune fonction user sélectionnée'; return }

    const reponse = await $fetch(
      `${config.public.apiBase}/courriers-departs/visibles/${entiteUser.id}`,
      { method: 'GET', headers: { Authorization: `Bearer ${authToken.value}` }, timeout: 15000 }
    )

    courrierData.value = transformerDonnees(reponse)
  } catch (err) {
    error.value = err.message || 'Erreur lors du chargement'
    toast.add({ title: 'Erreur', description: 'Impossible de charger les courriers', color: 'red', timeout: 1500 })
  } finally {
    loading.value = false
  }
}

// ── Handlers ──────────────────────────────────────────────────────────────────
const handleOpenDocument = (url) => {
  if (url) window.open(url, '_blank', 'noopener,noreferrer')
}

const handleViewDetails = (item) => {
  selectedCourrier.value = item
  showDoc.value = false
  detailsOpen.value = true
}

const closeDetails = () => {
  detailsOpen.value = false
  selectedCourrier.value = null
  showDoc.value = false
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(async () => {
  if (process.client) authToken.value = localStorage.getItem('auth_token') || ''
  await loadData()
})
</script>