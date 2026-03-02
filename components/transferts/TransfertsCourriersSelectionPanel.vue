<template>
  <div class="relative bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 overflow-hidden h-[600px] flex flex-col">

    <div class="px-6 py-5 border-b border-slate-100 shrink-0">
      <h3 class="text-xl font-bold text-slate-900 mb-4">1. Douments à transférer</h3>
      <div class="relative">
        <Icon name="heroicons:magnifying-glass" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher par référence, objet, structure..."
          class="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all text-slate-700 placeholder:text-slate-400"
        />
      </div>
    </div>

    <div
      class="overflow-auto flex-1 transition-all duration-300"
      :class="{ 'pb-24': selectedCourriers.length > 0 }"
    >
      <table class="w-full">
        <thead class="sticky top-0 bg-slate-50 border-b border-slate-200 z-10">
          <tr>
            <th class="px-6 py-3 text-left w-16">
              <UCheckbox
                :checked="isAllSelected"
                :indeterminate="isIndeterminate"
                @change="toggleSelectAll"
              />
            </th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Référence</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Objet</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Structure</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Priorité</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr
            v-for="courrier in filteredCourriers"
            :key="courrier.id"
            class="group hover:bg-gradient-to-r hover:from-emerald-50/30 hover:via-teal-50/30 hover:to-cyan-50/30 transition-all duration-200"
            :class="{ 'bg-gradient-to-r from-emerald-50/50 via-teal-50/50 to-cyan-50/50 shadow-sm': selectedCourriers.includes(courrier.id) }"
          >
            <td class="px-6 py-4">
              <UCheckbox
                v-model="selectedCourriers"
                :value="courrier.id"
              />
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-2">
                <Icon name="heroicons:document-text" class="w-4 h-4 text-teal-500 shrink-0" />
                <span class="text-slate-700 text-sm font-medium">{{ courrier.reference || '—' }}</span>
              </div>
            </td>
            <td class="px-6 py-4">
              <span class="text-slate-700 text-sm line-clamp-2" :title="courrier.objet">
                {{ courrier.objet || '—' }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-2">
                <Icon name="heroicons:building-office-2" class="w-4 h-4 text-slate-400 shrink-0" />
                <span class="text-slate-600 text-sm">{{ courrier.structure || '—' }}</span>
              </div>
            </td>
            <td class="px-6 py-4">
              <span class="text-slate-500 text-xs">
                {{ courrier.date_courrier ? formatDate(courrier.date_courrier) : '—' }}
              </span>
            </td>
            <td class="px-6 py-4">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                :class="getPriorityBadgeClass(courrier.priority)"
              >
                {{ courrier.priority }}
              </span>
            </td>
          </tr>

          <!-- État chargement -->
          <tr v-if="loading">
            <td colspan="6" class="p-12 text-center">
              <Icon name="heroicons:arrow-path" class="w-8 h-8 animate-spin text-teal-500 mx-auto mb-2" />
              <p class="text-slate-500">Chargement des courriers reçus...</p>
            </td>
          </tr>

          <!-- État vide -->
          <tr v-else-if="filteredCourriers.length === 0">
            <td colspan="6" class="p-12 text-center text-slate-500">
              {{ searchQuery ? 'Aucun courrier trouvé pour votre recherche' : 'Aucun courrier reçu disponible' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Floating selection bar -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-20 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-20 opacity-0"
    >
      <div v-if="selectedCourriers.length > 0" class="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-auto max-w-[90%]">
        <div class="bg-white/95 backdrop-blur-md text-slate-900 px-6 py-3.5 rounded-full shadow-2xl shadow-teal-500/20 flex items-center gap-5 border border-teal-200/50 ring-1 ring-white/60">

          <div class="flex items-center gap-3 pr-5 border-r border-slate-300">
            <div class="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white text-xs font-bold min-w-[24px] h-6 flex items-center justify-center rounded-full shadow-md shadow-teal-500/40">
              {{ selectedCourriers.length }}
            </div>
            <span class="text-sm font-semibold whitespace-nowrap bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Sélectionné{{ selectedCourriers.length > 1 ? 's' : '' }}
            </span>
          </div>

          <div class="flex items-center gap-3">
            <button
              @click="clearSelection"
              class="text-xs text-slate-600 hover:text-slate-900 font-medium px-4 py-2 rounded-full hover:bg-slate-100 transition-all duration-200"
            >
              Annuler
            </button>
          </div>

        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTransfertsStore } from '@/stores/transferts'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const store = useTransfertsStore()
const searchQuery = ref('')

// Sélection liée au store
const selectedCourriers = computed({
  get: () => store.selectedCourriers,
  set: (value) => { store.selectedCourriers = value }
})

// Courriers filtrés par recherche
const filteredCourriers = computed(() => {
  const data = store.courriers || []
  if (!searchQuery.value) return data

  const query = searchQuery.value.toLowerCase()
  return data.filter(c =>
    c.reference?.toLowerCase().includes(query) ||
    c.objet?.toLowerCase().includes(query) ||
    c.structure?.toLowerCase().includes(query)
  )
})

const isAllSelected = computed(() =>
  filteredCourriers.value.length > 0 &&
  selectedCourriers.value.length === filteredCourriers.value.length
)

const isIndeterminate = computed(() =>
  selectedCourriers.value.length > 0 && !isAllSelected.value
)

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedCourriers.value = []
  } else {
    selectedCourriers.value = filteredCourriers.value.map(c => c.id)
  }
}

const clearSelection = () => {
  selectedCourriers.value = []
}

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(dateStr))
}

const getPriorityBadgeClass = (priority) => {
  const classes = {
    'URGENT': 'bg-red-100 text-red-700 ring-1 ring-red-200',
    'IMPORTANT': 'bg-orange-100 text-orange-700 ring-1 ring-orange-200',
    'STANDARD': 'bg-blue-100 text-blue-700 ring-1 ring-blue-200',
  }
  return classes[priority?.toUpperCase()] || 'bg-slate-100 text-slate-700 ring-1 ring-slate-200'
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>