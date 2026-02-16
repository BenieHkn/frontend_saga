<template>
  <div class="relative bg-white rounded-2xl shadow-xl shadow-slate-200/80 border border-slate-200 overflow-hidden flex flex-col h-[600px]">
    
    <div class="flex-shrink-0 p-6 border-b border-slate-200 bg-slate-50/50">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-slate-900">2. Sélectionner les destinataires</h3>
        
        <button 
          v-if="store.selectedDestinataires.length > 0"
          @click="clearSelection"
          class="text-xs font-bold text-red-500 hover:text-red-700 uppercase tracking-wider transition-colors"
        >
          Réinitialiser
        </button>
      </div>

      <div class="relative">
        <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher par nom ou email..."
          class="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-slate-900 placeholder-slate-400"
        />
      </div>
    </div>

    <div 
      class="flex-1 overflow-y-auto transition-all duration-300"
      :class="{ 'pb-24': store.selectedDestinataires.length > 0 }"
    >
      <div class="p-6">
        <div v-if="loading" class="flex flex-col items-center justify-center py-12">
          <Icon name="svg-spinners:blocks-shuffle-3" class="w-12 h-12 text-emerald-500 mb-4" />
          <p class="text-slate-500">Chargement...</p>
        </div>

        <div v-else-if="filteredRecipients.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
          <Icon name="heroicons:user-group" class="w-16 h-16 text-slate-200 mb-4" />
          <p class="text-slate-500 font-medium">Aucun destinataire trouvé</p>
        </div>

        <div v-else class="space-y-3">
          <TransfertsDestinatairesCard
            v-for="recipient in filteredRecipients"
            :key="recipient.id"
            :recipient="recipient"
            :selected="store.selectedDestinataires.includes(recipient.id)"
            @toggle="toggleDestinataire(recipient.id)"
          />
        </div>
      </div>
    </div>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-20 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-20 opacity-0"
    >
      <div v-if="store.selectedDestinataires.length > 0" 
        class="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-[90%]"
      >
        <div class="bg-white/70 backdrop-blur-md text-black px-5 py-3 rounded-full shadow-2xl flex items-center justify-between border border-slate-700/50">
          
          <div class="flex items-center gap-3">
            <div class="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
              {{ store.selectedDestinataires.length }}
            </div>
            <span class="text-sm font-medium whitespace-nowrap">Destinataire(s) prêt(s)</span>
          </div>

          <div class="flex items-center gap-2">
            <button 
              @click="clearSelection"
              class="text-xs text-slate-400 hover:text-white px-3 py-2 transition-colors"
            >
              Annuler
            </button>
          </div>

        </div>
      </div>
    </Transition>

    <div v-if="store.selectedDestinataires.length === 0 && !loading && filteredRecipients.length > 0" 
      class="flex-shrink-0 p-3 border-t border-slate-100 bg-slate-50/50 text-center"
    >
      <p class="text-[11px] uppercase tracking-widest font-bold text-slate-400">
        {{ filteredRecipients.length }} contacts disponibles
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTransfertsStore } from '~/stores/transferts'
import TransfertsDestinatairesCard from './TransfertsDestinatairesCard.vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const store = useTransfertsStore()
const searchQuery = ref('')

// Destinataires filtrés
const filteredRecipients = computed(() => {
  const destinataires = store.destinataires
  
  if (!searchQuery.value) return destinataires

  const query = searchQuery.value.toLowerCase()
  return destinataires.filter(r =>
    r.name?.toLowerCase().includes(query) ||
    r.email?.toLowerCase().includes(query) ||
    r.fonction?.toLowerCase().includes(query) ||
    r.entite?.toLowerCase().includes(query)
  )
})

console.log(filteredRecipients.value)
// Toggle destinataire
const toggleDestinataire = (id) => {
  store.toggleDestinataire(id)
}

// Clear selection
const clearSelection = () => {
  store.clearSelections()
}

// Gérer les erreurs du store
const error = computed(() => {
  return null
})
</script>

<style scoped>
/* Personnalisation de la scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>