<template>
  <div class="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 overflow-hidden transition-all hover:shadow-xl hover:shadow-slate-200/80">

    <!-- Header -->
    <div class="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
      <h3 class="text-sm font-bold text-slate-700 flex items-center gap-2">
        <Icon name="i-heroicons-eye" class="w-4 h-4 text-violet-600" />
        Prévisualisation du document
      </h3>

      <div class="flex items-center gap-2">
        <!-- Navigation si plusieurs courriers sélectionnés -->
        <template v-if="selectedCourriers.length > 1">
          <button @click="prev" :disabled="currentIndex === 0"
            class="w-6 h-6 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
            <Icon name="i-heroicons-chevron-left" class="w-3.5 h-3.5" />
          </button>
          <span class="text-xs font-semibold text-slate-400 tabular-nums">
            {{ currentIndex + 1 }} / {{ selectedCourriers.length }}
          </span>
          <button @click="next" :disabled="currentIndex === selectedCourriers.length - 1"
            class="w-6 h-6 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
            <Icon name="i-heroicons-chevron-right" class="w-3.5 h-3.5" />
          </button>
          <span class="text-[10px] font-semibold text-slate-500 max-w-[200px] truncate">
            {{ currentCourrier?.reference || '—' }}
          </span>
        </template>

        <!-- Bouton charger -->
        <button v-if="!fileLoaded && !fileLoading && !fileError && hasDocument"
          @click="loadFile"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-lg transition-all">
          <Icon name="i-heroicons-document-arrow-down" class="w-3.5 h-3.5" />
          Charger
        </button>
        <!-- Chargement -->
        <div v-else-if="fileLoading" class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400">
          <div class="w-3.5 h-3.5 border-2 border-slate-200 border-t-violet-500 rounded-full animate-spin"></div>
          Chargement...
        </div>
        <!-- Erreur -->
        <div v-else-if="fileError"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg">
          <Icon name="i-heroicons-exclamation-triangle" class="w-3.5 h-3.5 shrink-0" />
          Erreur
          <button @click="fileError = ''; loadFile()" class="underline hover:no-underline ml-1">Réessayer</button>
        </div>
        <!-- Chargé -->
        <div v-else-if="fileLoaded"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg">
          <Icon name="i-heroicons-check-circle" class="w-3.5 h-3.5" />
          Chargé
        </div>
        <!-- Aucun document -->
        <span v-else-if="!hasDocument && selectedCourriers.length > 0"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 bg-slate-50 border border-slate-200 rounded-lg cursor-not-allowed">
          <Icon name="i-heroicons-document-text" class="w-3.5 h-3.5" />
          Indisponible
        </span>
      </div>
    </div>

    <!-- Corps : aperçu ou placeholder -->
    <div>
      <!-- Document chargé -->
      <div v-if="fileLoaded" class="bg-slate-100">
        <DocumentRpreview :file-preview-url="blobUrl" height="290px" />
      </div>

      <!-- Placeholder -->
      <div v-else class="flex flex-col items-center justify-center py-10 gap-3 text-slate-400">
        <div class="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
          <Icon name="i-heroicons-document-text" class="w-6 h-6 text-slate-300" />
        </div>
        <p class="text-xs text-slate-400">
          <template v-if="selectedCourriers.length === 0">Sélectionnez un courrier pour prévisualiser son document</template>
          <template v-else-if="!hasDocument">Aucun document joint à ce courrier</template>
          <template v-else>Cliquez sur "Charger" pour afficher le document</template>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAffectationsStore } from '~/stores/affectations'
import DocumentRpreview from '~/components/DocumentRpreview.vue'

const store = useAffectationsStore()

const currentIndex = ref(0)

const selectedCourriers = computed(() =>
  store.selectedCourriers
    .map(id => store.courriers.find(c => c.id === id))
    .filter(Boolean)
)

const currentCourrier = computed(() => selectedCourriers.value[currentIndex.value] ?? null)

const hasDocument = computed(() => {
  const url = currentCourrier.value?.url
  return !!(url && url !== '' && url !== 'Inconnu')
})

const fileLoaded  = ref(false)
const fileLoading = ref(false)
const fileError   = ref('')
const blobUrl     = ref('')

const revokeBlob = () => {
  if (blobUrl.value) { URL.revokeObjectURL(blobUrl.value); blobUrl.value = '' }
}

watch(currentCourrier, () => {
  revokeBlob()
  fileLoaded.value  = false
  fileLoading.value = false
  fileError.value   = ''
})

watch(() => store.selectedCourriers, (newVal) => {
  if (currentIndex.value >= newVal.length) {
    currentIndex.value = Math.max(0, newVal.length - 1)
  }
}, { deep: true })

const loadFile = async () => {
  const rawUrl = currentCourrier.value?.url
  if (!rawUrl || rawUrl === '' || rawUrl === 'Inconnu') return

  fileLoading.value = true
  fileLoaded.value  = false
  fileError.value   = ''
  revokeBlob()

  try {
    const authToken = localStorage.getItem('auth_token') || ''
    const response  = await fetch(rawUrl, { headers: { Authorization: `Bearer ${authToken}` } })
    if (!response.ok) throw new Error(`Erreur ${response.status}`)
    const blob      = await response.blob()
    blobUrl.value   = URL.createObjectURL(blob)
    fileLoaded.value = true
  } catch (err) {
    fileError.value = err.message || 'Erreur lors du chargement'
  } finally {
    fileLoading.value = false
  }
}

const prev = () => { if (currentIndex.value > 0) currentIndex.value-- }
const next = () => { if (currentIndex.value < selectedCourriers.value.length - 1) currentIndex.value++ }
</script>