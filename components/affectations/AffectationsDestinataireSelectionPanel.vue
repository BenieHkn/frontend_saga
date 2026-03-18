<template>
  <div class="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 overflow-hidden transition-all hover:shadow-xl hover:shadow-slate-200/80">
    <!-- Panel Header -->
    <div class="px-6 py-5 border-b border-slate-100">
      <div class="flex items-start justify-between mb-4">
        <h3 class="text-xl font-bold text-slate-900">
          <Icon name="i-heroicons-user-group" class="inline-block w-6 h-6 text-indigo-600 mr-2" />
          2. Destinataires
        </h3>
        
        <!-- Badge: Mode de sélection -->
        <div v-if="store.selectedCourrierCount > 0" class="flex items-center gap-2">
          <span
            class="px-3 py-1 rounded-full text-xs font-bold"
            :class="canSelectMultiple
              ? 'bg-green-100 text-green-800'
              : 'bg-orange-100 text-orange-800'"
          >
            {{ canSelectMultiple ? 'Multi-sélection' : 'Sélection unique' }}
          </span>
        </div>
      </div>
      
      <!-- Info Message -->
      <div v-if="store.selectedCourrierCount > 0" class="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
        <p class="text-xs text-slate-700">
          <Icon
            :name="canSelectMultiple
              ? 'i-heroicons-check-circle'
              : 'i-heroicons-information-circle'"
            class="inline-block w-4 h-4 mr-1"
          />
          <span v-if="canSelectMultiple" class="text-green-700">
            <strong>{{ store.selectedCourrierCount }} courrier</strong> sélectionné(s) → Vous pouvez choisir <strong>plusieurs destinataires</strong>
          </span>
          <span v-else class="text-orange-700">
            <strong>{{ store.selectedCourrierCount }} courriers</strong> sélectionnés → Vous ne pouvez choisir qu'<strong>UN SEUL destinataire</strong>
          </span>
        </p>
      </div>

      <!-- Search Bar -->
      <div class="relative">
        <Icon name="i-heroicons-magnifying-glass" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher par nom, code, fonction ou agent..."
          class="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-slate-700 placeholder:text-slate-400"
        />
      </div>
    </div>

    <!-- Destinataires List avec hauteur fixe -->
    <div class="overflow-auto p-4 space-y-3" style="height: 400px;">
      <AffectationsDestinataireCard
        v-for="destinataire in filteredDestinataires"
        :key="destinataire.id"
        :destinataire="destinataire"
        :selected="store.selectedDestinataires.includes(destinataire.id)"
        :disabled="!canSelectMultiple && store.selectedDestinataires.length > 0 && !store.selectedDestinataires.includes(destinataire.id)"
        @toggle="toggleDestinataire"
      />

      <!-- Loading State -->
      <div v-if="loading" class="py-12 text-center">
        <div class="flex flex-col items-center justify-center gap-3">
          <Icon name="svg-spinners:ring-resize" class="w-8 h-8 text-indigo-600" />
          <p class="text-slate-500">Chargement des destinataires...</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredDestinataires.length === 0" class="py-12 text-center">
        <div class="flex flex-col items-center justify-center gap-3">
          <Icon name="i-heroicons-user-group" class="w-12 h-12 text-slate-300" />
          <p class="text-slate-500">Aucun destinataire trouvé</p>
          <p class="text-xs text-slate-400">Essayez avec un autre terme de recherche</p>
        </div>
      </div>

      <!-- Info: Courrier requis -->
      <div v-if="store.selectedCourrierCount === 0" class="py-12 text-center">
        <div class="flex flex-col items-center justify-center gap-3">
          <Icon name="i-heroicons-exclamation-circle" class="w-12 h-12 text-slate-300" />
          <p class="text-slate-500 font-medium">Veuillez d'abord sélectionner un courrier</p>
          <p class="text-xs text-slate-400">Les destinataires apparaîtront après la sélection</p>
        </div>
      </div>
    </div>

    <!-- Footer avec compteur et actions -->
    <div class="px-6 py-4 bg-slate-50 border-t border-slate-100">
      <div class="flex items-center justify-between">
        <div class="text-sm">
          <span class="font-semibold text-slate-900">{{ store.selectedDestinataires.length }}</span>
          <span class="text-slate-600">
            / {{ filteredDestinataires.length }}
            {{ canSelectMultiple ? 'destinataire(s)' : 'destinataire' }}
          </span>
        </div>

        <div class="flex items-center gap-2">
          <!-- Bouton Sélectionner tous (visible seulement si multi-sélection) -->
          <button
            v-if="canSelectMultiple && filteredDestinataires.length > 0"
            @click="selectAll"
            class="px-3 py-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            Tous
          </button>

          <!-- Bouton Désélectionner -->
          <button
            v-if="store.selectedDestinataires.length > 0"
            @click="clearSelection"
            class="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAffectationsStore } from '~/stores/affectations'
import AffectationsDestinataireCard from './AffectationsDestinataireCard.vue'

const store = useAffectationsStore()

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const searchQuery = ref('')

// Computeds
const canSelectMultiple = computed(() => {
  return store.canSelectMultipleDestinataires
})

const filteredDestinataires = computed(() => {
  if (!searchQuery.value) return store.destinataires

  const query = searchQuery.value.toLowerCase()
  return store.destinataires.filter(dest => {
    const fullName = `${dest.user?.nom || ''} ${dest.user?.prenom || ''}`.toLowerCase()
    const fonction = dest.entite?.fonction?.toLowerCase() || ''
    const entite = dest.entite?.libelle?.toLowerCase() || ''
    const code = dest.entite?.code?.toLowerCase() || ''
    
    // ✅ Pour les non-responsables, ajouter "agent" comme terme de recherche
    const role = dest.is_responsable ? fonction : 'agent'
    
    return fullName.includes(query) || 
           fonction.includes(query) || 
           entite.includes(query) ||
           code.includes(query) ||
           role.includes(query)
  })
})

// Actions
const toggleDestinataire = (destinataireId) => {
  console.log('🔵 Toggle destinataire appelé avec ID:', destinataireId)
  console.log('🔵 Avant toggle:', [...store.selectedDestinataires])
  store.toggleDestinataire(destinataireId)
  console.log('🔵 Après toggle:', [...store.selectedDestinataires])
}

const selectAll = () => {
  // Sélectionner tous les destinataires filtrés
  store.selectedDestinataires = filteredDestinataires.value.map(d => d.id)
  console.log('✅ Tous sélectionnés:', [...store.selectedDestinataires])
}

const clearSelection = () => {
  store.selectedDestinataires = []
  console.log('❌ Sélection réinitialisée')
}
</script>