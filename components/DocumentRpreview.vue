<template>
  <div class="w-full font-sans">

    <!-- Overlay plein écran -->
    <Teleport to="body">
      <Transition enter-active-class="transition-opacity duration-200" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition-opacity duration-200" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center"
          style="background: rgba(0, 0, 0, 0.82); backdrop-filter: blur(4px);" @click.self="isOpen = false">
          <!-- Bouton fermer -->
          <button @click="isOpen = false"
            class="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white border border-white/20">
            <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
          </button>

          <!-- Contrôles zoom -->
          <div
            class="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
            <UButton icon="i-heroicons-minus" size="xs" color="gray" variant="ghost" class="text-white"
              @click="changeZoom(-0.1)" />
            <span class="text-[10px] font-mono font-bold text-white/80 w-10 text-center">{{ Math.round(zoomLevel * 100)
              }}%</span>
            <UButton icon="i-heroicons-plus" size="xs" color="gray" variant="ghost" class="text-white"
              @click="changeZoom(0.1)" />
            <div class="w-[1px] h-3 bg-white/20 mx-1" />
            <UButton icon="i-heroicons-arrow-path" size="xs" color="gray" variant="ghost" class="text-white"
              @click="zoomLevel = 1" />
          </div>

          <!-- Document -->
          <div class="w-[90vw] h-[90vh] overflow-auto rounded-lg"
            style="scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.2) transparent;">
            <div class="transition-transform duration-200 ease-out origin-top"
              :style="{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }">
              <object v-if="filePreviewUrl" :data="`${filePreviewUrl}#toolbar=0&navpanes=0&scrollbar=0`"
                type="application/pdf" class="w-full" style="min-height: 90vh;">
                <div class="flex flex-col items-center justify-center h-full p-8 text-white">
                  <UIcon name="i-heroicons-document-text" class="w-16 h-16 text-white/40 mb-4" />
                  <p class="text-sm text-white/60 mb-4">Impossible d'afficher le PDF dans cette fenêtre.</p>
                  <a :href="filePreviewUrl" target="_blank"
                    class="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                    <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-4 h-4" />
                    Ouvrir dans un nouvel onglet
                  </a>
                </div>
              </object>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Carte Principale -->
    <div
      class="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-slate-200 dark:border-zinc-800 overflow-hidden sticky top-6">

      <!-- Header -->
      <div
        class="px-3 py-1.5 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-zinc-900">
        <div class="flex items-center gap-2">
          <div class="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" v-if="filePreviewUrl && !loading"></div>
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aperçu</span>
        </div>

        <div class="flex items-center gap-1" v-if="filePreviewUrl && !loading">
          <UButton icon="i-heroicons-minus" size="xs" variant="ghost" color="gray" @click="changeZoom(-0.1)" />
          <span class="text-[9px] font-mono font-bold text-slate-500">{{ Math.round(zoomLevel * 100) }}%</span>
          <UButton icon="i-heroicons-plus" size="xs" variant="ghost" color="gray" @click="changeZoom(0.1)" />
          <div class="w-[1px] h-3 bg-slate-200 mx-1"></div>
          <UButton icon="i-heroicons-arrows-pointing-out" size="xs" variant="ghost" color="primary"
            @click="isOpen = true" />
        </div>
      </div>

      <!-- Zone d'affichage -->
      <div class="relative bg-slate-50 dark:bg-zinc-950 overflow-hidden flex flex-col"
        :style="{ height: previewHeight }">
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
          <div class="transition-transform duration-200 origin-top p-2" :style="{ transform: `scale(${zoomLevel})` }">
            <object :data="`${filePreviewUrl}#toolbar=0&navpanes=0&scrollbar=0`" type="application/pdf"
              class="w-full rounded border border-slate-200 dark:border-zinc-800 bg-white"
              :style="{ height: 'calc(' + previewHeight + ' - 1rem)' }">
              <div class="flex flex-col items-center justify-center h-full p-8">
                <UIcon name="i-heroicons-document-text" class="w-12 h-12 text-slate-400 mb-4" />
                <p class="text-xs text-slate-600 dark:text-slate-400 mb-4 text-center">Impossible d'afficher le PDF dans
                  cette fenêtre.</p>
                <a :href="filePreviewUrl" target="_blank"
                  class="bg-primary-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-primary-700 flex items-center gap-2">
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

const isOpen = ref(false)
const zoomLevel = ref(1)
const loading = ref(false)
const error = ref(null)
let loadingTimeout = null

const previewHeight = computed(() => props.height)

const changeZoom = (delta) => {
  const newZoom = zoomLevel.value + delta
  if (newZoom >= 0.3 && newZoom <= 2) {
    zoomLevel.value = parseFloat(newZoom.toFixed(1))
  }
}

const startLoading = () => {
  loading.value = true
  error.value = null
  if (loadingTimeout) clearTimeout(loadingTimeout)
  loadingTimeout = setTimeout(() => {
    loading.value = false
  }, 0)
}

// Bloquer le scroll du body quand l'overlay est ouvert
watch(isOpen, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})

watch(() => props.filePreviewUrl, (newUrl) => {
  if (newUrl) {
    startLoading()
    zoomLevel.value = 1
  } else {
    loading.value = false
    if (loadingTimeout) clearTimeout(loadingTimeout)
  }
})

onMounted(() => {
  if (props.filePreviewUrl) startLoading()
})

onBeforeUnmount(() => {
  if (loadingTimeout) clearTimeout(loadingTimeout)
  document.body.style.overflow = ''
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