<template>
  <div class="w-full font-sans">
    <UModal v-model="isOpen" :ui="{ width: 'sm:max-w-6xl', height: 'h-[95vh]' }">
      <div class="flex flex-col h-full bg-slate-100 dark:bg-zinc-950 overflow-hidden relative">
        
        <div class="flex justify-between items-center px-6 py-3 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 shrink-0">
          <div class="flex items-center gap-3">
            <UIcon :name="isPDF ? 'i-heroicons-document-text' : 'i-heroicons-photo'" class="text-primary-600 w-5 h-5" />
            <span class="text-sm font-bold truncate max-w-[300px]">{{ props.selectedFile?.name }}</span>
          </div>
          <div class="flex items-center gap-2">
            <UButton icon="i-heroicons-arrow-down-tray" color="gray" variant="ghost" @click="downloadFile" />
            <UButton icon="i-heroicons-x-mark" color="gray" variant="ghost" @click="isOpen = false" class="rounded-full" />
          </div>
        </div>

        <div class="flex-1 overflow-auto p-4 md:p-10 flex justify-center bg-slate-200/50 dark:bg-zinc-900/50">
          <div 
            class="transition-transform duration-200 ease-out origin-top shadow-2xl bg-white"
            :style="{ transform: `scale(${zoomLevel})`, width: isPDF ? '100%' : 'auto' }"
          >
            <iframe
              v-if="isPDF && filePreviewUrl"
              :src="`${filePreviewUrl}#toolbar=0&navpanes=0`"
              class="w-full min-h-[80vh]"
              frameborder="0"
            />
            <img v-else-if="isImage" :src="filePreviewUrl" class="max-w-full" />
          </div>
        </div>

        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-xl border border-slate-200 dark:border-zinc-700">
          <UButton icon="i-heroicons-minus" size="xs" color="gray" variant="ghost" @click="changeZoom(-0.1)" />
          <span class="text-[10px] font-mono font-black w-10 text-center">{{ Math.round(zoomLevel * 100) }}%</span>
          <UButton icon="i-heroicons-plus" size="xs" color="gray" variant="ghost" @click="changeZoom(0.1)" />
          <div class="w-[1px] h-3 bg-slate-300 mx-1" />
          <UButton icon="i-heroicons-arrow-path" size="xs" color="gray" variant="ghost" @click="zoomLevel = 1" />
        </div>
      </div>
    </UModal>

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

      <div class="relative bg-slate-50 dark:bg-zinc-950 h-[500px] overflow-hidden flex flex-col">
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
              class="w-full h-[480px] rounded border border-slate-200 dark:border-zinc-800 bg-white"
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