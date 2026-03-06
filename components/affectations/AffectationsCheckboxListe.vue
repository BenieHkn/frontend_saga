<template>
  <div class="relative bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 overflow-hidden h-[600px] flex flex-col">
    
    <div class="px-6 py-5 border-b border-slate-100 shrink-0">
      <h3 class="text-xl font-bold text-slate-900 mb-4">2. Affectations Reçues</h3>
      <div class="relative">
        <Icon name="heroicons:magnifying-glass" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher par instructions, émetteur..."
          class="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all text-slate-700 placeholder:text-slate-400"
        />
      </div>
    </div>

    <div 
      class="overflow-auto flex-1 transition-all duration-300"
      :class="{ 'pb-24': selectedAffectations.length > 0 }"
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
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Instructions</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Émetteur</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Courriers</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Statut</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Priorité</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr 
            v-for="affectation in filteredAffectations" 
            :key="affectation.id" 
            class="group hover:bg-gradient-to-r hover:from-emerald-50/30 hover:via-teal-50/30 hover:to-cyan-50/30 transition-all duration-200" 
            :class="{'bg-gradient-to-r from-emerald-50/50 via-teal-50/50 to-cyan-50/50 shadow-sm': selectedAffectations.includes(affectation.id)}"
          >
            <td class="px-6 py-4">
              <UCheckbox 
                v-model="selectedAffectations" 
                :value="affectation.id"
              />
            </td>
            <td class="px-6 py-4">
              <span class="text-slate-700 text-sm line-clamp-2 font-medium" :title="affectation.instructions">
                {{ affectation.instructions }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-2">
                <Icon name="heroicons:user-circle" class="w-5 h-5 text-slate-400" />
                <span class="text-slate-600 text-sm">{{ affectation.emetteur }}</span>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-2">
                <Icon name="heroicons:document-duplicate" class="w-4 h-4 text-teal-500" />
                <span class="text-xs text-slate-600" :title="affectation.courriers_text">
                  {{ affectation.nb_courriers }} courrier{{ affectation.nb_courriers > 1 ? 's' : '' }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4">
              <span 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border" 
                :class="getStatutBadgeClass(affectation.statut)"
              >
                {{ affectation.statut_badge.label }}
              </span>
            </td>
            <td class="px-6 py-4">
              <span 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border" 
                :class="getPriorityBadgeClass(affectation.priority)"
              >
                {{ affectation.priority_badge.label }}
              </span>
            </td>
          </tr>
          
          <tr v-if="loading">
            <td colspan="6" class="p-12 text-center">
              <Icon name="heroicons:arrow-path" class="w-8 h-8 animate-spin text-teal-500 mx-auto mb-2" />
              <p class="text-slate-500">Chargement des Courriers...</p>
            </td>
          </tr>
          <tr v-else-if="filteredAffectations.length === 0">
            <td colspan="6" class="p-12 text-center text-slate-500">
              {{ searchQuery ? 'Aucun courrier trouvé pour votre recherche' : 'Aucun Courrier trouvé' }}
            </td>
          </tr>
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
      <div v-if="selectedAffectations.length > 0" class="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-auto max-w-[90%]">
        <div class="bg-white/95 backdrop-blur-md text-slate-900 px-6 py-3.5 rounded-full shadow-2xl shadow-teal-500/20 flex items-center gap-5 border border-teal-200/50 ring-1 ring-white/60">
          
          <div class="flex items-center gap-3 pr-5 border-r border-slate-300">
            <div class="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white text-xs font-bold min-w-[24px] h-6 flex items-center justify-center rounded-full shadow-md shadow-teal-500/40">
              {{ selectedAffectations.length }}
            </div>
            <span class="text-sm font-semibold whitespace-nowrap bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Sélectionné{{ selectedAffectations.length > 1 ? 's' : '' }}
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
import { ref, computed, onMounted } from 'vue'
import { useTransfertsStore } from '@/stores/transferts'
import { useAffectations } from '@/composables/affectations/useAffectations'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const store = useTransfertsStore()
const { tableData, loading, error, fetchAffectations } = useAffectations()

const searchQuery = ref('')

// Computed pour les affectations sélectionnées (lié au store)
const selectedAffectations = computed({
  get: () => store.selectedAffectations,
  set: (value) => {
    store.selectedAffectations = value
  }
})

// Affectations filtrées par recherche
const filteredAffectations = computed(() => {
  // ✅ Protection contre undefined/null
  const data = tableData.value || []
  
  if (!searchQuery.value) return data

  const query = searchQuery.value.toLowerCase()
  return data.filter(affectation =>
    affectation.instructions?.toLowerCase().includes(query) ||
    affectation.emetteur?.toLowerCase().includes(query) ||
    affectation.courriers_text?.toLowerCase().includes(query)
  )
})

// Vérifier si tous sont sélectionnés
const isAllSelected = computed(() => {
  return filteredAffectations.value.length > 0 && 
         selectedAffectations.value.length === filteredAffectations.value.length
})

// État indeterminate
const isIndeterminate = computed(() => {
  return selectedAffectations.value.length > 0 && !isAllSelected.value
})

// Toggle sélection de tous
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedAffectations.value = []
  } else {
    selectedAffectations.value = filteredAffectations.value.map(a => a.id)
  }
}

// Désélectionner tous
const clearSelection = () => {
  selectedAffectations.value = []
}

// Classes pour les badges de statut
const getStatutBadgeClass = (statut) => {
  const classes = {
    'en_cours': 'bg-blue-100 text-blue-700 ring-1 ring-blue-200',
    'traite': 'bg-green-100 text-green-700 ring-1 ring-green-200',
    'cloture': 'bg-purple-100 text-purple-700 ring-1 ring-purple-200',
  }
  return classes[statut] || 'bg-slate-100 text-slate-700 ring-1 ring-slate-200'
}

// Classes pour les badges de priorité
const getPriorityBadgeClass = (priority) => {
  const classes = {
    'URGENT': 'bg-red-100 text-red-700 ring-1 ring-red-200',
    'IMPORTANT': 'bg-orange-100 text-orange-700 ring-1 ring-orange-200',
    'STANDARD': 'bg-blue-100 text-blue-700 ring-1 ring-blue-200',
  }
  return classes[priority?.toLowerCase()] || 'bg-slate-100 text-slate-700 ring-1 ring-slate-200'
}

// Charger les affectations au montage
onMounted(async () => {
  console.log('🔄 Chargement des affectations...')
  await fetchAffectations()
  
  // ✅ Protection avant de set dans le store
  if (tableData.value && tableData.value.length > 0) {
    store.setAffectations(tableData.value)
    console.log(`✅ ${tableData.value.length} affectations définies dans le store`)
  } else {
    console.warn('⚠️ Aucune affectation à définir dans le store')
    store.setAffectations([])
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>