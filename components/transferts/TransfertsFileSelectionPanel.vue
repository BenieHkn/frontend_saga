<template>
  <div class="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 overflow-hidden transition-all hover:shadow-xl hover:shadow-slate-200/80">
    <!-- Panel Header -->
    <div class="px-6 py-5 border-b border-slate-100">
      <h3 class="text-xl font-bold text-slate-900 mb-4">1. Courriers</h3>
      
      <!-- Search Bar -->
      <div class="relative">
        <Icon name="heroicons:magnifying-glass" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by filename or project..."
          class="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-slate-700 placeholder:text-slate-400"
        />
      </div>
    </div>

    <!-- Files Table -->
    <div class="overflow-auto max-h-[400px]">
      <table class="w-full">
        <thead class="sticky top-0 bg-slate-50 border-b border-slate-200 z-10">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Select</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Référence</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Priorité</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Délai</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr
            v-for="file in filteredFiles"
            :key="file.id"
            class="group hover:bg-emerald-50/30 transition-colors"
          >
            <!-- Checkbox -->
            <td class="px-6 py-4">
              <label class="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  :value="file.id"
                  v-model="selectedFiles"
                  class="w-5 h-5 rounded-lg border-2 border-slate-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500/50 transition-all cursor-pointer"
                />
              </label>
            </td>

            <!-- File Name -->
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <Icon :name="getFileIcon(file.type)" class="w-5 h-5 text-slate-400" />
                <span class="font-medium text-slate-700">{{ file.name }}</span>
              </div>
            </td>

            <!-- Size -->
            <td class="px-6 py-4">
              <span class="text-slate-600">{{ file.size }} {{ file.unit }}</span>
            </td>

            <!-- Type Badge -->
            <td class="px-6 py-4">
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                :class="getTypeBadgeClass(file.type)"
              >
                {{ file.type }}
              </span>
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-if="loading">
            <td colspan="4" class="px-6 py-12 text-center">
              <div class="flex flex-col items-center justify-center gap-3">
                <Icon name="svg-spinners:ring-resize" class="w-8 h-8 text-emerald-600" />
                <p class="text-slate-500">Loading files...</p>
              </div>
            </td>
          </tr>

          <tr v-else-if="filteredFiles.length === 0">
            <td colspan="4" class="px-6 py-12 text-center">
              <div class="flex flex-col items-center justify-center gap-3">
                <Icon name="heroicons:document-magnifying-glass" class="w-12 h-12 text-slate-300" />
                <p class="text-slate-500">No files found</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTransfertsStore } from '~/stores/transferts'

const store = useTransfertsStore()

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const searchQuery = ref('')

/**
 * v-model compatible avec Pinia
 * → checkbox écrit directement dans store.selectedFiles
 */
const selectedFiles = computed({
  get: () => store.selectedFiles,
  set: (value) => {
    store.selectedFiles = value
  }
})

/**
 * Fichiers filtrés via le store
 */
const filteredFiles = computed(() => {
  if (!searchQuery.value) return store.files

  const query = searchQuery.value.toLowerCase()
  return store.files.filter(file =>
    file.name.toLowerCase().includes(query)
  )
})

const getFileIcon = (type) => {
  const icons = {
    PDF: 'heroicons:document-text',
    ZIP: 'heroicons:archive-box',
    DOC: 'heroicons:document',
    IMG: 'heroicons:photo',
  }
  return icons[type] || 'heroicons:document'
}

const getTypeBadgeClass = (type) => {
  const classes = {
    PDF: 'bg-blue-100 text-blue-700',
    ZIP: 'bg-amber-100 text-amber-700',
    DOC: 'bg-indigo-100 text-indigo-700',
    IMG: 'bg-emerald-100 text-emerald-700',
  }
  return classes[type] || 'bg-slate-100 text-slate-700'
}
</script>
