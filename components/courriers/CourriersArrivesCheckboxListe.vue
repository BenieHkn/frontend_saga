<template>
  <div class="relative bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 overflow-hidden h-[600px] flex flex-col">
    
    <div class="px-6 py-5 border-b border-slate-100 shrink-0">
      <h3 class="text-xl font-bold text-slate-900 mb-4">1. Courriers Arrivés</h3>
      <div class="relative">
        <Icon name="heroicons:magnifying-glass" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher par référence ou objet..."
          class="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-slate-700 placeholder:text-slate-400"
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
              <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll" class="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer" />
            </th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Référence</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Objet</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Priorité</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="courrier in filteredCourriers" :key="courrier.id" class="group hover:bg-slate-50 transition-colors" :class="{'bg-emerald-50/40': selectedCourriers.includes(courrier.id)}">
            <td class="px-6 py-4">
              <input type="checkbox" :value="courrier.id" v-model="selectedCourriers" class="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer" />
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <Icon :name="courrier.confidentiel ? 'heroicons:lock-closed' : 'heroicons:document-text'" class="w-5 h-5" :class="courrier.confidentiel ? 'text-red-500' : 'text-slate-400'" />
                <span class="font-medium text-slate-700">{{ courrier.reference }}</span>
              </div>
            </td>
            <td class="px-6 py-4">
              <span class="text-slate-600 text-sm line-clamp-2" :title="courrier.objet">{{ courrier.objet }}</span>
            </td>
            <td class="px-6 py-4">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border" :class="getPriorityBadgeClass(courrier.priority)">
                {{ getPriorityLabel(courrier.priority) }}
              </span>
            </td>
          </tr>
          
          <tr v-if="loading"><td colspan="4" class="p-12 text-center text-slate-500">Chargement...</td></tr>
          <tr v-else-if="filteredCourriers.length === 0"><td colspan="4" class="p-12 text-center text-slate-500">Aucun courrier trouvé</td></tr>
        </tbody>
      </table>
    </div>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-20 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-20 opacity-0"
    >
      <div v-if="selectedCourriers.length > 0" class="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-auto max-w-[90%]">
        <div class="bg-white/70 backdrop-blur-md text-black px-5 py-3 rounded-full shadow-2xl shadow-slate-400/50 flex items-center gap-5 border border-slate-700/50 ring-1 ring-white/10">
          
          <div class="flex items-center gap-3 pr-5 border-r border-slate-700">
            <div class="bg-emerald-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-sm">
              {{ selectedCourriers.length }}
            </div>
            <span class="text-sm font-medium whitespace-nowrap">Sélectionnés</span>
          </div>

          <div class="flex items-center gap-3">
            <button @click="clearSelection" class="text-xs text-black hover:text-black font-medium px-3 py-1.5 rounded hover:bg-white/10 transition-colors">
              Annuler
            </button>
          </div>

        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCourriersArrives } from '~/composables/courriers/useCourriersArrives'
import { useTransfertsStore } from '~/stores/transferts'

const store = useTransfertsStore()
const { tableData, loading, error, fetchCourriers } = useCourriersArrives()

const searchQuery = ref('')

// v-model compatible avec Pinia
const selectedCourriers = computed({
  get: () => store.selectedCourriers,
  set: (value) => {
    store.selectedCourriers = value
  }
})

// Courriers filtrés
const filteredCourriers = computed(() => {
  if (!searchQuery.value) return tableData.value

  const query = searchQuery.value.toLowerCase()
  return tableData.value.filter(courrier =>
    courrier.reference.toLowerCase().includes(query) ||
    courrier.objet.toLowerCase().includes(query)
  )
})

// Vérifier si tous les courriers sont sélectionnés
const isAllSelected = computed(() => {
  return filteredCourriers.value.length > 0 && 
         selectedCourriers.value.length === filteredCourriers.value.length
})

// Toggle sélection de tous les courriers
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedCourriers.value = []
  } else {
    selectedCourriers.value = filteredCourriers.value.map(c => c.id)
  }
}

// Désélectionner tous
const clearSelection = () => {
  selectedCourriers.value = []
}

// Classes pour les badges de priorité
const getPriorityBadgeClass = (priority) => {
  const classes = {
    'URGENT': 'bg-red-100 text-red-700 ring-1 ring-red-200',
    'IMPORTANT': 'bg-orange-100 text-orange-700 ring-1 ring-orange-200',
    'STANDARD': 'bg-blue-100 text-blue-700 ring-1 ring-blue-200',
  }
  return classes[priority] || 'bg-slate-100 text-slate-700 ring-1 ring-slate-200'
}

// Labels pour les priorités
const getPriorityLabel = (priority) => {
  const labels = {
    'URGENT': 'URGENT',
    'IMPORTANT': 'IMPORTANT',
    'STANDARD': 'STANDARD',
  }
  return labels[priority] || priority
}

// Synchroniser les fichiers avec le store au montage
onMounted(async () => {
  await fetchCourriers()
  store.setCourriers(tableData.value)
})
</script>

<style scoped>
/* Limiter le texte de l'objet à 2 lignes */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>