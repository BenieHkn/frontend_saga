<template>
  <div class="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 overflow-hidden transition-all hover:shadow-xl hover:shadow-slate-200/80">
    <!-- Panel Header -->
    <div class="px-6 py-5 border-b border-slate-100">
      <div class="flex items-start justify-between mb-4">
        <h3 class="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Icon name="i-heroicons-inbox-arrow-down" class="w-6 h-6 text-blue-600" />
          1. Courrier à Affecter
        </h3>

        <!-- Badge: Mode de sélection -->
        <div v-if="store.selectedCourriers.length > 0" class="flex items-center gap-2">
          <span
            class="px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap"
            :class="store.selectedCourriers.length === 1
              ? 'bg-blue-100 text-blue-800'
              : 'bg-blue-100 text-blue-800'"
          >
            {{ store.selectedCourriers.length }} courrier{{ store.selectedCourriers.length > 1 ? 's' : '' }}
          </span>
        </div>
      </div>

      <!-- Info Message -->
      <div v-if="store.selectedCourriers.length > 0" class="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
        <p class="text-xs text-slate-700 flex items-center gap-2">
          <Icon
            :name="store.selectedCourriers.length === 1
              ? 'i-heroicons-check-circle'
              : 'i-heroicons-inbox-stack'"
            class="w-4 h-4"
          />
          <span v-if="store.selectedCourriers.length === 1">
            <strong>1 courrier</strong> sélectionné → Sélection <strong>multiple destinataires</strong> possible
          </span>
          <span v-else>
            <strong>{{ store.selectedCourriers.length }} courriers</strong> sélectionnés → Sélection <strong>d'UN SEUL destinataire</strong> requis
          </span>
        </p>
      </div>
      
      <!-- Search Bar -->
      <div class="relative">
        <Icon name="i-heroicons-magnifying-glass" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher par référence ou objet..."
          class="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-slate-700 placeholder:text-slate-400"
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <Icon name="i-heroicons-x-mark" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Courriers List avec hauteur fixe -->
    <div class="overflow-auto" style="height: 400px;">
      <div class="p-4 space-y-3">
        <AffectationsCourrierCard
          v-for="courrier in filteredCourriers"
          :key="courrier.id"
          :courrier="courrier"
          :selected="store.selectedCourriers.includes(courrier.id)"
          :disabled="false"
          @toggle="toggleCourrier(courrier.id)"
        />

        <!-- Loading State -->
        <div v-if="loading" class="py-12 text-center">
          <div class="flex flex-col items-center justify-center gap-3">
            <Icon name="svg-spinners:ring-resize" class="w-8 h-8 text-blue-600" />
            <p class="text-slate-500 font-medium">Chargement des courriers...</p>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredCourriers.length === 0" class="py-12 text-center">
          <div class="flex flex-col items-center justify-center gap-3">
            <Icon name="i-heroicons-inbox" class="w-12 h-12 text-slate-300" />
            <p class="text-slate-500 font-medium">Aucun courrier trouvé</p>
            <p class="text-xs text-slate-400">Modifiez votre recherche</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer avec compteur et actions -->
    <div v-if="store.selectedCourriers.length > 0" class="px-6 py-4 bg-blue-50 border-t border-blue-100">
      <div class="flex items-center justify-between">
        <div class="text-sm">
          <span class="font-semibold text-blue-900">{{ store.selectedCourriers.length }}</span>
          <span class="text-slate-700"> / {{ filteredCourriers.length }} sélectionné(s)</span>
        </div>

        <div class="flex items-center gap-2">
          <!-- Bouton Sélectionner tous -->
          <button
            v-if="filteredCourriers.length > store.selectedCourriers.length"
            @click="selectAll"
            class="px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
            title="Sélectionner tous les courriers visibles"
          >
            ✓ Tous
          </button>

          <!-- Bouton Réinitialiser -->
          <button
            @click="clearSelection"
            class="px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
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

const store = useAffectationsStore()

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const searchQuery = ref('')

// Courriers filtrés
const filteredCourriers = computed(() => {
  if (!searchQuery.value) return store.courriers

  const query = searchQuery.value.toLowerCase()
  return store.courriers.filter(courrier =>
    courrier.reference.toLowerCase().includes(query) ||
    courrier.objet.toLowerCase().includes(query) ||
    courrier.structure.toLowerCase().includes(query)
  )
})

// Sélectionner/désélectionner un courrier
const toggleCourrier = (courrierId) => {
  store.toggleCourrier(courrierId)
}

// Sélectionner tous les courriers filtrés
const selectAll = () => {
  store.selectedCourriers = filteredCourriers.value.map(c => c.id)
}

// Tout désélectionner
const clearSelection = () => {
  store.selectedCourriers = []
  searchQuery.value = ''
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>