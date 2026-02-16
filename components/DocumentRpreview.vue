<template>
  <div class="w-full font-sans">
    <!-- Modal Plein Écran -->
    <UModal v-model="isOpen" :ui="{ width: 'sm:max-w-6xl', height: 'h-[95vh]' }">
      <div class="flex flex-col h-full bg-slate-100 dark:bg-zinc-950 overflow-hidden relative">
        
        <!-- Header Modal -->
        <div class="flex justify-between items-center px-6 py-3 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 shrink-0">
          <div class="flex items-center gap-3">
            <UIcon name="i-heroicons-document-text" class="text-primary-600 w-5 h-5" />
            <span class="text-sm font-bold truncate max-w-[300px]">{{ props.selectedFile?.name || 'Document PDF' }}</span>
          </div>
          <div class="flex items-center gap-2">
            <UButton icon="i-heroicons-x-mark" color="gray" variant="ghost" @click="isOpen = false" class="rounded-full" />
          </div>
        </div>

        <!-- Contenu Modal -->
        <div class="flex-1 overflow-auto p-4 md:p-10 flex justify-center bg-slate-200/50 dark:bg-zinc-900/50">
          <div 
            class="transition-transform duration-200 ease-out origin-top shadow-2xl bg-white w-full"
            :style="{ transform: `scale(${zoomLevel})` }"
          >
            <object
              v-if="filePreviewUrl && !loading"
              :data="`${filePreviewUrl}#toolbar=0&navpanes=0&scrollbar=0`"
              type="application/pdf"
              class="w-full min-h-[80vh]"
            >
              <!-- Fallback -->
              <div class="flex flex-col items-center justify-center h-full p-8">
                <UIcon name="i-heroicons-document-text" class="w-16 h-16 text-slate-400 mb-4" />
                <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">Impossible d'afficher le PDF dans cette fenêtre.</p>
                <a 
                  :href="filePreviewUrl" 
                  target="_blank"
                  class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 flex items-center gap-2"
                >
                  <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-4 h-4" />
                  Ouvrir dans un nouvel onglet
                </a>
              </div>
            </object>
          </div>
        </div>

        <!-- Contrôles Zoom Modal -->
        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-xl border border-slate-200 dark:border-zinc-700">
          <UButton icon="i-heroicons-minus" size="xs" color="gray" variant="ghost" @click="changeZoom(-0.1)" />
          <span class="text-[10px] font-mono font-black w-10 text-center">{{ Math.round(zoomLevel * 100) }}%</span>
          <UButton icon="i-heroicons-plus" size="xs" color="gray" variant="ghost" @click="changeZoom(0.1)" />
          <div class="w-[1px] h-3 bg-slate-300 mx-1" />
          <UButton icon="i-heroicons-arrow-path" size="xs" color="gray" variant="ghost" @click="zoomLevel = 1" />
        </div>
      </div>
    </UModal>

    <!-- Carte Principale -->
    <div class="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-slate-200 dark:border-zinc-800 overflow-hidden sticky top-6">
      
      <!-- Header -->
      <div class="px-3 py-1.5 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-zinc-900">
        <div class="flex items-center gap-2">
          <div class="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" v-if="filePreviewUrl && !loading"></div>
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aperçu</span>
        </div>
        
        <div class="flex items-center gap-1" v-if="filePreviewUrl && !loading">
          <UButton icon="i-heroicons-minus" size="xs" variant="ghost" color="gray" @click="changeZoom(-0.1)" />
          <span class="text-[9px] font-mono font-bold text-slate-500">{{ Math.round(zoomLevel * 100) }}%</span>
          <UButton icon="i-heroicons-plus" size="xs" variant="ghost" color="gray" @click="changeZoom(0.1)" />
          <div class="w-[1px] h-3 bg-slate-200 mx-1"></div>
          <UButton icon="i-heroicons-arrows-pointing-out" size="xs" variant="ghost" color="primary" @click="isOpen = true" />
        </div>
      </div>

      <!-- Zone d'affichage -->
      <div class="relative bg-slate-50 dark:bg-zinc-950 overflow-hidden flex flex-col" :style="{ height: previewHeight }">
        <!-- Chargement -->
        <div v-if="loading" class="h-full flex flex-col items-center justify-center opacity-50">
          <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 mb-2 animate-spin text-primary-500" />
          <span class="text-[10px] uppercase font-bold tracking-widest">Chargement...</span>
          <span class="text-xs text-slate-400 mt-1">Le document devrait apparaître dans 2 secondes</span>
        </div>

        <!-- Erreur -->
        <div v-else-if="error" class="h-full flex flex-col items-center justify-center p-4">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-8 h-8 mb-2 text-red-500" />
          <span class="text-[10px] uppercase font-bold tracking-widest text-red-500 mb-1">Erreur de chargement</span>
          <span class="text-xs text-slate-500 text-center">{{ error }}</span>
        </div>

        <!-- Pas de document -->
        <div v-else-if="!filePreviewUrl" class="h-full flex flex-col items-center justify-center opacity-30">
          <UIcon name="i-heroicons-document" class="w-8 h-8 mb-2" />
          <span class="text-[10px] uppercase font-bold tracking-widest">Aucun document</span>
        </div>

        <!-- Affichage du document -->
        <div v-else class="h-full overflow-auto scrollbar-hide">
          <div 
            class="transition-transform duration-200 origin-top p-2"
            :style="{ transform: `scale(${zoomLevel})` }"
          >
            <object
              :data="`${filePreviewUrl}#toolbar=0&navpanes=0&scrollbar=0`"
              type="application/pdf"
              class="w-full rounded border border-slate-200 dark:border-zinc-800 bg-white"
              :style="{ height: 'calc(' + previewHeight + ' - 1rem)' }"
            >
              <!-- Fallback dans la vue compacte -->
              <div class="flex flex-col items-center justify-center h-full p-8">
                <UIcon name="i-heroicons-document-text" class="w-12 h-12 text-slate-400 mb-4" />
                <p class="text-xs text-slate-600 dark:text-slate-400 mb-4 text-center">Impossible d'afficher le PDF dans cette fenêtre.</p>
                <a 
                  :href="filePreviewUrl" 
                  target="_blank"
                  class="bg-primary-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-primary-700 flex items-center gap-2"
                >
                  <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-3 h-3" />
                  Ouvrir dans un nouvel onglet
                </a>
              </div>
            </object>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

// ============================================================================
// PROPS
// ============================================================================

const props = defineProps({
  filePreviewUrl: {
    type: String,
    default: null,
    required: false
  },
  selectedFile: {
    type: Object,
    default: null,
    required: false
  },
  height: {
    type: String,
    default: '500px'
  }
})

// ============================================================================
// ÉTAT
// ============================================================================

const isOpen = ref(false)
const zoomLevel = ref(1)
const loading = ref(false)
const error = ref(null)
let loadingTimeout = null

// ============================================================================
// COMPUTED
// ============================================================================

const previewHeight = computed(() => props.height)

// ============================================================================
// MÉTHODES
// ============================================================================

const changeZoom = (delta) => {
  const newZoom = zoomLevel.value + delta
  if (newZoom >= 0.3 && newZoom <= 2) {
    zoomLevel.value = parseFloat(newZoom.toFixed(1))
  }
}

const startLoading = () => {
  console.log('🔄 Début du chargement du document:', props.filePreviewUrl)
  loading.value = true
  error.value = null
  
  // Timeout de sécurité
  if (loadingTimeout) {
    clearTimeout(loadingTimeout)
  }
  
  loadingTimeout = setTimeout(() => {
    console.log('✅ Timeout atteint - affichage du document')
    loading.value = false
  }, 2000) // 2 secondes
}

// ============================================================================
// WATCHERS
// ============================================================================

watch(() => props.filePreviewUrl, (newUrl, oldUrl) => {
  console.log('🔄 URL changée:', { oldUrl, newUrl })
  
  if (newUrl) {
    startLoading()
    zoomLevel.value = 1
  } else {
    loading.value = false
    if (loadingTimeout) {
      clearTimeout(loadingTimeout)
    }
  }
})

// ============================================================================
// LIFECYCLE
// ============================================================================

onMounted(() => {
  console.log('🚀 Composant monté avec URL:', props.filePreviewUrl)
  if (props.filePreviewUrl) {
    startLoading()
  }
})

onBeforeUnmount(() => {
  if (loadingTimeout) {
    clearTimeout(loadingTimeout)
  }
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>