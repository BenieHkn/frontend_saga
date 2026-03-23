<template>
  <div class="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 overflow-hidden transition-all hover:shadow-xl hover:shadow-slate-200/80 flex flex-col">

    <!-- Header -->
    <div class="px-6 py-5 border-b border-slate-100 shrink-0">
      <div class="flex items-center justify-between">
        <h3 class="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Icon name="i-heroicons-eye" class="w-6 h-6 text-violet-600" />
          Prévisualisation
        </h3>
        <div class="flex items-center gap-2">
          <!-- Navigateur de courriers si plusieurs sélectionnés -->
          <template v-if="selectedCourriers.length > 1">
            <button
              @click="prev"
              :disabled="currentIndex === 0"
              class="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <Icon name="i-heroicons-chevron-left" class="w-4 h-4" />
            </button>
            <span class="text-xs font-semibold text-slate-500 tabular-nums min-w-[40px] text-center">
              {{ currentIndex + 1 }} / {{ selectedCourriers.length }}
            </span>
            <button
              @click="next"
              :disabled="currentIndex === selectedCourriers.length - 1"
              class="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <Icon name="i-heroicons-chevron-right" class="w-4 h-4" />
            </button>
          </template>
          <!-- Badge priorité du courrier courant -->
          <span v-if="currentCourrier"
            class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border uppercase"
            :class="{
              'bg-red-50 text-red-700 border-red-200':   currentCourrier.priority?.toLowerCase() === 'urgent',
              'bg-amber-50 text-amber-700 border-amber-200': currentCourrier.priority?.toLowerCase() === 'important',
              'bg-sky-50 text-sky-700 border-sky-200':   !currentCourrier.priority || currentCourrier.priority?.toLowerCase() === 'standard',
            }">
            {{ currentCourrier.priority || 'STANDARD' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Corps -->
    <div class="flex-1 overflow-y-auto" style="min-height: 0;">

      <!-- État vide -->
      <div v-if="selectedCourriers.length === 0"
        class="flex flex-col items-center justify-center h-full py-16 gap-4 text-slate-400">
        <div class="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
          <Icon name="i-heroicons-document-magnifying-glass" class="w-8 h-8 text-slate-300" />
        </div>
        <div class="text-center">
          <p class="text-sm font-medium text-slate-500">Aucun courrier sélectionné</p>
          <p class="text-xs text-slate-400 mt-1">Sélectionnez un courrier pour le prévisualiser ici</p>
        </div>
      </div>

      <!-- Contenu courrier courant -->
      <div v-else-if="currentCourrier" class="p-5 space-y-4">

        <!-- Méta-infos -->
        <div class="space-y-2">
          <div class="flex items-stretch gap-0 rounded-xl overflow-hidden border border-violet-100">
            <div class="w-1 shrink-0 bg-gradient-to-b from-violet-400 to-indigo-500"></div>
            <div class="flex-1 p-3 bg-gradient-to-r from-violet-50 to-transparent">
              <p class="text-[10px] font-bold text-violet-400 uppercase tracking-wider mb-0.5">Référence</p>
              <p class="text-sm font-bold text-violet-900">{{ currentCourrier.reference || 'Sans référence' }}</p>
            </div>
          </div>
          <div class="flex items-stretch gap-0 rounded-xl overflow-hidden border border-amber-100">
            <div class="w-1 shrink-0 bg-gradient-to-b from-amber-400 to-orange-500"></div>
            <div class="flex-1 p-3 bg-gradient-to-r from-amber-50 to-transparent">
              <p class="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-0.5">Objet</p>
              <p class="text-sm text-gray-800 leading-relaxed">{{ currentCourrier.objet || 'Non spécifié' }}</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div v-if="currentCourrier.structure"
            class="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Structure</p>
            <p class="text-xs text-slate-800">{{ currentCourrier.structure }}</p>
          </div>
          <div v-if="currentCourrier.date_courrier"
            class="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date courrier</p>
            <p class="text-xs text-slate-800">{{ formatDate(currentCourrier.date_courrier) }}</p>
          </div>
        </div>

        <!-- Document PDF/Image -->
        <div class="rounded-xl border border-slate-200 overflow-hidden">

          <!-- Barre de contrôle du document -->
          <div class="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-100">
            <span class="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Icon name="i-heroicons-document-text" class="w-3.5 h-3.5" />
              Document
            </span>
            <div class="flex items-center gap-2">
              <!-- Bouton charger -->
              <button
                v-if="!fileLoaded && !fileLoading && !fileError && hasDocument"
                @click="loadFile"
                class="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-lg transition-all">
                <Icon name="i-heroicons-document-arrow-down" class="w-3 h-3" />
                Charger
              </button>
              <!-- Chargement en cours -->
              <div v-else-if="fileLoading"
                class="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-slate-400">
                <div class="w-3 h-3 border-2 border-slate-200 border-t-violet-500 rounded-full animate-spin"></div>
                Chargement...
              </div>
              <!-- Erreur -->
              <div v-else-if="fileError"
                class="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-red-500 bg-red-50 border border-red-200 rounded-lg">
                <Icon name="i-heroicons-exclamation-triangle" class="w-3 h-3 shrink-0" />
                Erreur
                <button @click="fileError = ''; loadFile()" class="underline hover:no-underline ml-1">Réessayer</button>
              </div>
              <!-- Chargé -->
              <div v-else-if="fileLoaded"
                class="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg">
                <Icon name="i-heroicons-check-circle" class="w-3 h-3" />
                Chargé
              </div>
              <!-- Aucun document -->
              <span v-else-if="!hasDocument"
                class="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-slate-400 bg-slate-50 border border-slate-200 rounded-lg cursor-not-allowed">
                <Icon name="i-heroicons-document-text" class="w-3 h-3" />
                Indisponible
              </span>
            </div>
          </div>

          <!-- Prévisualisation -->
          <div v-if="fileLoaded" class="bg-slate-100">
            <DocumentRpreview :file-preview-url="blobUrl" height="480px" />
          </div>

          <!-- Placeholder quand pas encore chargé -->
          <div v-else class="flex flex-col items-center justify-center py-10 gap-3 bg-slate-50/60 text-slate-400">
            <div class="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
              <Icon name="i-heroicons-document-text" class="w-6 h-6 text-slate-300" />
            </div>
            <p class="text-xs text-slate-400">
              {{ hasDocument ? 'Cliquez sur "Charger" pour afficher le document' : 'Aucun document joint' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Pied : liste miniature des courriers sélectionnés si > 1 -->
    <div v-if="selectedCourriers.length > 1"
      class="px-4 py-3 bg-slate-50 border-t border-slate-100 shrink-0">
      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Courriers sélectionnés</p>
      <div class="flex flex-col gap-1.5 overflow-y-auto" style="max-height: 120px;">
        <button
          v-for="(courrier, idx) in selectedCourriers"
          :key="courrier.id"
          @click="currentIndex = idx"
          class="flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all text-xs"
          :class="idx === currentIndex
            ? 'bg-violet-100 border border-violet-200 text-violet-900'
            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'">
          <span class="font-semibold shrink-0 tabular-nums text-[10px] text-slate-400 w-5">{{ idx + 1 }}.</span>
          <span class="font-medium truncate">{{ courrier.reference || '—' }}</span>
          <span class="text-slate-400 truncate flex-1 text-right hidden sm:block">{{ courrier.objet }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAffectationsStore } from '~/stores/affectations'
import DocumentRpreview from '~/components/DocumentRpreview.vue'

const store  = useAffectationsStore()
const config = useRuntimeConfig()

// ── Index de navigation ───────────────────────────────────────────────────────
const currentIndex = ref(0)

// ── Courriers sélectionnés (objets complets) ──────────────────────────────────
const selectedCourriers = computed(() =>
  store.selectedCourriers
    .map(id => store.courriers.find(c => c.id === id))
    .filter(Boolean)
)

// ── Courrier courant ──────────────────────────────────────────────────────────
const currentCourrier = computed(() => selectedCourriers.value[currentIndex.value] ?? null)

// ── Présence d'un document pour le courrier courant ───────────────────────────
const hasDocument = computed(() => {
  const url = currentCourrier.value?.url
  return !!(url && url !== '' && url !== 'Inconnu')
})

// ── État blob ─────────────────────────────────────────────────────────────────
const fileLoaded  = ref(false)
const fileLoading = ref(false)
const fileError   = ref('')
const blobUrl     = ref('')

// ── Reset blob quand le courrier change ───────────────────────────────────────
watch(currentCourrier, () => {
  revokeBlob()
  fileLoaded.value  = false
  fileLoading.value = false
  fileError.value   = ''
})

// ── Reset index si les sélections changent ────────────────────────────────────
watch(() => store.selectedCourriers, (newVal, oldVal) => {
  // Si le courrier courant n'est plus dans la sélection, revenir à 0
  if (currentIndex.value >= newVal.length) {
    currentIndex.value = Math.max(0, newVal.length - 1)
  }
}, { deep: true })

// ── Utilitaires ───────────────────────────────────────────────────────────────
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
}

const guessMimeType = (filename) => {
  if (!filename) return ''
  const ext = (filename.split('.').pop() || '').toLowerCase()
  return { pdf: 'application/pdf', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml' }[ext] || ''
}

const revokeBlob = () => {
  if (blobUrl.value) { URL.revokeObjectURL(blobUrl.value); blobUrl.value = '' }
}

// ── Charger le document ───────────────────────────────────────────────────────
const loadFile = async () => {
  const rawUrl = currentCourrier.value?.url
  if (!rawUrl || rawUrl === '' || rawUrl === 'Inconnu') return

  fileLoading.value = true
  fileLoaded.value  = false
  fileError.value   = ''
  revokeBlob()

  try {
    const authToken = localStorage.getItem('auth_token') || ''
    const response  = await fetch(rawUrl, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
    if (!response.ok) throw new Error(`Erreur ${response.status}`)
    const blob = await response.blob()
    blobUrl.value   = URL.createObjectURL(blob)
    fileLoaded.value = true
  } catch (err) {
    console.error('❌ Erreur prévisualisation:', err)
    fileError.value = err.message || 'Erreur lors du chargement'
  } finally {
    fileLoading.value = false
  }
}

// ── Navigation ────────────────────────────────────────────────────────────────
const prev = () => { if (currentIndex.value > 0) currentIndex.value-- }
const next = () => { if (currentIndex.value < selectedCourriers.value.length - 1) currentIndex.value++ }
</script>