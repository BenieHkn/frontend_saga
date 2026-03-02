<template>
    <div class="bg-white rounded-2xl shadow-xl shadow-slate-200/80 border border-slate-200 overflow-hidden">
        

        <!-- Bottom Section: Détails de la sélection -->
        <div v-if="store.hasSelections" class="p-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                <!-- Courriers sélectionnés -->
                <div>
                    <h4 class="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <Icon name="heroicons:document-text" class="w-4 h-4 text-blue-600" />
                        Courriers sélectionnés
                    </h4>
                    
                    <div class="flex flex-wrap items-center gap-2">
                        <div 
                            v-for="affectation in selectedCourriersWithData" 
                            :key="affectation.id"
                            class="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-200"
                        >
                            <Icon name="heroicons:document-text" class="w-4 h-4 text-blue-600" />
                            <span class="text-sm font-medium text-blue-700 whitespace-nowrap">
                                {{ affectation.reference }}
                            </span>
                        </div>
                    </div>

                    <!-- Empty state pour courriers -->
                    <div v-if="store.selectedCourriers.length === 0" 
                        class="text-sm text-slate-400 italic"
                    >
                        Aucun courrier sélectionné
                    </div>
                </div>

                <!-- Destinataires sélectionnés -->
                <div>
                    <h4 class="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <Icon name="heroicons:user-group" class="w-4 h-4 text-emerald-600" />
                        Destinataires sélectionnés
                    </h4>
                    
                    <div class="flex items-center gap-3">
                        <!-- Avatars -->
                        <div class="flex -space-x-3">
                            <div 
                                v-for="recipient in selectedDestinatairesWithData.slice(0, 5)" 
                                :key="recipient.id"
                                class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-sm border-2 border-white transition-transform hover:scale-110 hover:z-10 relative"
                                :class="getAvatarColor(recipient.initials)" 
                                :title="recipient.name"
                            >
                                {{ recipient.initials }}
                            </div>

                            <div 
                                v-if="store.selectedDestinataires.length > 5"
                                class="z-20 w-10 h-10 rounded-full flex items-center justify-center font-bold bg-slate-200 text-slate-600 text-xs shadow-sm border-2 border-white"
                            >
                                +{{ store.selectedDestinataires.length - 5 }}
                            </div>
                        </div>

                        <!-- Liste des noms -->
                        <div class="flex-1 min-w-0">
                            <p class="text-sm text-slate-600 truncate">
                                {{ selectedDestinatairesWithData.map(r => r.name).join(', ') }}
                            </p>
                        </div>
                    </div>

                    <!-- Empty state pour destinataires -->
                    <div v-if="store.selectedDestinataires.length === 0" 
                        class="text-sm text-slate-400 italic"
                    >
                        Aucun destinataire sélectionné
                    </div>
                </div>

            </div>
        </div>
          <!-- Message quand aucune sélection -->
        <div v-else class="p-6 text-center">
            <Icon name="heroicons:arrow-up" class="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p class="text-slate-400 text-sm">
                Sélectionnez des courriers et des destinataires pour commencer le transfert
            </p>
        </div>

        <!-- Top Section: Actions principales -->
        <div class="p-6 flex items-center justify-between border-b border-slate-200 bg-slate-50/50">
            <!-- Left: Summary -->
            <div class="flex items-center gap-6">
                <div>
                    <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        Prêt pour le transfert ?
                    </p>

                    <div class="flex items-center gap-4">
                        <span class="text-2xl font-bold text-slate-900">
                            {{ store.selectedCourriers.length }}
                            Courrier{{ store.selectedCourriers.length !== 1 ? 's' : '' }}
                        </span>

                        <span class="text-2xl font-bold text-slate-400">•</span>

                        <span class="text-2xl font-bold text-slate-900">
                            {{ store.selectedDestinataires.length }}
                            Destinataire{{ store.selectedDestinataires.length !== 1 ? 's' : '' }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Right: Actions -->
            <div class="flex items-center gap-3">
                <button 
                    @click="handleCancel" 
                    :disabled="!store.hasSelections"
                    class="px-6 py-3 rounded-xl font-semibold text-slate-700 bg-white border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    Annuler
                </button>

                <button 
                    @click="$emit('send-files')" 
                    :disabled="!store.canSend || loading"
                    class="group px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 flex items-center gap-2"
                >
                    {{ loading ? 'Envoi en cours...' : 'Transférer' }}
                    <Icon v-if="!loading"
                        name="heroicons:paper-airplane"
                        class="w-5 h-5 transition-transform group-hover:translate-x-1" 
                    />

                    <div v-else class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </button>
            </div>
        </div>

      
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTransfertsStore } from '@/stores/transferts'

const props = defineProps({
    loading: {
        type: Boolean,
        default: false
    }
})

const store = useTransfertsStore()

const emit = defineEmits(['save-draft', 'send-files'])

// ✅ Computed pour récupérer les affectations sélectionnées avec leurs données
const selectedCourriersWithData = computed(() => {
  return store.selectedCourriersData.map(affectation => ({
    id: affectation.id,
    reference: affectation.reference || affectation.name || `#${affectation.id}`,
    name: affectation.name || affectation.instructions || `Affectation #${affectation.id}`
  }))
})

// ✅ Computed pour récupérer les destinataires sélectionnés avec leurs données
const selectedDestinatairesWithData = computed(() => {
  return store.selectedDestinatairesData.map(dest => {
    const nom = `${dest._raw?.user?.nom || ''} ${dest._raw?.user?.prenom || ''}`.trim()
    const initials = getInitials(dest._raw?.user?.nom, dest._raw?.user?.prenom)
    
    return {
      id: dest.id,
      name: nom || `Destinataire #${dest.id}`,
      initials: initials
    }
  })
})

// Fonction pour obtenir les initiales
const getInitials = (nom, prenom) => {
  const n = (nom || '').charAt(0).toUpperCase()
  const p = (prenom || '').charAt(0).toUpperCase()
  return n + p || '??'
}

// Fonction pour annuler les sélections
const handleCancel = () => {
    store.clearSelections()
}

// Générer une couleur basée sur les initiales
const getAvatarColor = (initials) => {
    if (!initials) return 'bg-gradient-to-br from-slate-500 to-slate-600'
    
    const colors = [
        'bg-gradient-to-br from-blue-500 to-blue-600',
        'bg-gradient-to-br from-purple-500 to-purple-600',
        'bg-gradient-to-br from-pink-500 to-pink-600',
        'bg-gradient-to-br from-indigo-500 to-indigo-600',
        'bg-gradient-to-br from-cyan-500 to-cyan-600',
        'bg-gradient-to-br from-teal-500 to-teal-600',
        'bg-gradient-to-br from-emerald-500 to-emerald-600',
        'bg-gradient-to-br from-orange-500 to-orange-600',
        'bg-gradient-to-br from-red-500 to-red-600',
        'bg-gradient-to-br from-slate-500 to-slate-600',
    ]
    
    // Générer un index basé sur les initiales
    const charCode = initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)
    return colors[charCode % colors.length]
}
</script>

<style scoped>
/* Animation pour l'apparition */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bg-white {
  animation: slideIn 0.3s ease-out;
}
</style>