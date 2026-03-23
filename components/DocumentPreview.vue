<template>
  <div class="w-full font-sans">
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

    <div class="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-slate-200 dark:border-zinc-800 overflow-hidden sticky top-6">
      
      <div class="px-3 py-1.5 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-zinc-900">
        <div class="flex items-center gap-2">
          <div class="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" v-if="props.selectedFile"></div>
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aperçu</span>
        </div>
        
        <div class="flex items-center gap-1" v-if="props.selectedFile">
          <UButton icon="i-heroicons-minus" size="xs" variant="ghost" color="gray" @click="changeZoom(-0.1)" />
          <span class="text-[9px] font-mono font-bold text-slate-500">{{ Math.round(zoomLevel * 100) }}%</span>
          <UButton icon="i-heroicons-plus" size="xs" variant="ghost" color="gray" @click="changeZoom(0.1)" />
          <div class="w-[1px] h-3 bg-slate-200 mx-1"></div>
          <UButton icon="i-heroicons-arrows-pointing-out" size="xs" variant="ghost" color="primary" @click="isOpen = true" />
        </div>
      </div>

      <div class="relative bg-slate-50 dark:bg-zinc-950 h-[730px] overflow-hidden flex flex-col">
        <div v-if="!props.selectedFile" class="h-full flex flex-col items-center justify-center opacity-30">
          <UIcon name="i-heroicons-document" class="w-8 h-8 mb-2" />
          <span class="text-[10px] uppercase font-bold tracking-widest">Aucun document</span>
        </div>

        <div v-else class="h-full overflow-auto scrollbar-hide">
          <div 
            class="transition-transform duration-200 origin-top p-2"
            :style="{ transform: `scale(${zoomLevel})` }"
          >
            <iframe
              v-if="isPDF"
              :src="`${filePreviewUrl}#view=FitH&toolbar=0`"
              class="w-full h-[730px] rounded border border-slate-200 dark:border-zinc-800 bg-white"
            />
            <img v-else-if="isImage" :src="filePreviewUrl" class="max-w-full mx-auto rounded shadow-sm" />
          </div>
        </div>
      </div>

      <div v-if="props.selectedFile" class="px-3 py-1.5 bg-slate-50 dark:bg-zinc-800/50 border-t border-slate-100 dark:border-zinc-800 flex justify-between items-center">
        <span class="text-[10px] text-slate-500 truncate italic max-w-[70%]">{{ props.selectedFile.name }}</span>
        <UButton icon="i-heroicons-arrow-down-tray" size="xs" variant="link" color="gray" @click="downloadFile" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  selectedFile: { type: Object, default: null },
  filePreviewUrl: { type: String, default: null },
})

const isOpen = ref(false)
const zoomLevel = ref(1)

const isPDF = computed(() => props.selectedFile?.name?.toLowerCase().endsWith('.pdf'))
const isImage = computed(() => {
  const name = props.selectedFile?.name?.toLowerCase() || ''
  return ['jpg', 'jpeg', 'png', 'webp'].some(ext => name.endsWith(ext))
})

const changeZoom = (delta) => {
  const newZoom = zoomLevel.value + delta
  if (newZoom >= 0.3 && newZoom <= 2) {
    zoomLevel.value = parseFloat(newZoom.toFixed(1))
  }
}

const downloadFile = () => {
  if (!props.filePreviewUrl) return
  const link = document.createElement('a')
  link.href = props.filePreviewUrl
  link.download = props.selectedFile.name
  link.click()
}

watch(() => props.selectedFile, () => {
  zoomLevel.value = 1
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