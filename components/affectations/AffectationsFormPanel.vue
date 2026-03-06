<template>
  <div class="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 overflow-hidden transition-all hover:shadow-xl hover:shadow-slate-200/80">
    <!-- Panel Header -->
    <div class="px-6 py-5 border-b border-slate-100">
      <h3 class="text-xl font-bold text-slate-900">
        <Icon name="i-heroicons-clipboard-document-list" class="inline-block w-6 h-6 text-blue-600 mr-2" />
        3. Détails de l'Affectation
      </h3>
    </div>

    <!-- Form Fields -->
    <div class="p-6 space-y-6">
      
      <!-- Dates et Délai -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Date d'affectation -->
        <!-- <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Date d'affectation
            <span class="text-red-500">*</span>
          </label>
          <UInput 
            :model-value="store.formData.date_affect"
            @update:model-value="store.updateFormData('date_affect', $event)"
            type="date" 
            size="lg" 
            icon="i-heroicons-calendar"
            :max="today"
            required 
          />
        </div> -->

        <!-- Date de retour attendue -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Date de retour attendue
            <span class="text-red-500">*</span>
          </label>
          <UInput 
            :model-value="store.formData.delai_traitement"
            @update:model-value="store.updateFormData('delai_traitement', $event)"
            type="date" 
            size="lg" 
            icon="i-heroicons-clock"
            :min="store.formData.date_affect || today"
            required
          />
        </div>

        <!-- Délai en jours (calculé automatiquement) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Délai (en jours)
          </label>
          <div class="relative">
            <UInput 
              :model-value="calculatedDelai"
              type="text" 
              size="lg" 
              icon="i-heroicons-calculator"
              readonly
              disabled
              class="bg-gray-50"
            />
            <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <span class="text-sm font-medium text-gray-500">jours</span>
            </div>
          </div>
        </div>

        <!-- Priorité -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Priorité
            <span class="text-red-500">*</span>
          </label>
          <USelectMenu 
            :model-value="store.formData.priority"
            @update:model-value="store.updateFormData('priority', $event)"
            :options="priorityOptions" 
            size="lg"
            placeholder="Sélectionner"
            value-attribute="value"
            option-attribute="label"
            required
          >
            <template #label>
              <span v-if="store.formData.priority" class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full" :class="getPriorityColor(store.formData.priority).dot"></span>
                {{ getPriorityLabel(store.formData.priority) }}
              </span>
              <span v-else class="text-gray-500">Sélectionner</span>
            </template>
            <template #option="{ option }">
              <span class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full" :class="getPriorityColor(option.value).dot"></span>
                {{ option.label }}
              </span>
            </template>
          </USelectMenu>
        </div>
      </div>

      <!-- Instructions -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Annotations
          <span class="text-red-500">*</span>
        </label>
        <UTextarea 
          :model-value="store.formData.instructions"
          @update:model-value="store.updateFormData('instructions', $event)"
          :rows="2" 
          size="lg"
          placeholder="Saisir les instructions détaillées pour le traitement..."
          required
        />
        <p class="text-xs text-gray-500 mt-2">
          {{ store.formData.instructions?.length || 0 }} caractères
        </p>
      </div>

      <!-- Statut -->
      <!-- <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Statut
          <span class="text-red-500">*</span>
        </label>
        <USelectMenu 
          :model-value="store.formData.statut"
          @update:model-value="store.updateFormData('statut', $event)"
          :options="statutOptions" 
          size="lg"
          placeholder="Sélectionner"
          value-attribute="value"
          option-attribute="label"
          required
        >
          <template #label>
            <span v-if="store.formData.statut" class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full" :class="getStatutColor(store.formData.statut).dot"></span>
              {{ store.formData.statut }}
            </span>
            <span v-else class="text-gray-500">Sélectionner</span>
          </template>
          <template #option="{ option }">
            <span class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full" :class="getStatutColor(option.value).dot"></span>
              {{ option.label }}
            </span>
          </template>
        </USelectMenu>
      </div> -->

      <!-- Date de clôture (optionnelle) -->
      <!-- <div>
        <label class="flex items-center gap-3 cursor-pointer mb-3">
          <input
            type="checkbox"
            :checked="store.showDateCloture"
            @change="store.toggleDateCloture"
            class="w-4 h-4 text-blue-600 border-gray-300 rounded cursor-pointer"
          />
          <span class="text-sm font-medium text-gray-700">
            Ajouter une date de clôture
          </span>
        </label>

        <Transition name="slide">
          <div v-if="store.showDateCloture">
            <UInput 
              :model-value="store.formData.date_cloture"
              @update:model-value="store.updateFormData('date_cloture', $event)"
              type="date" 
              size="lg" 
              icon="i-heroicons-calendar-days"
              :min="store.formData.delai_traitement || today"
              placeholder="Sélectionner une date"
            />
            <p class="text-xs text-gray-500 mt-2">
              La date de clôture doit être supérieure à la date de retour attendue
            </p>
          </div>
        </Transition>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAffectationsStore } from '~/stores/affectations'

const store = useAffectationsStore()

// Date du jour
const today = new Date().toISOString().split('T')[0]

// ✅ CORRECTION : Options avec valeurs en MINUSCULES pour correspondre à Laravel
const priorityOptions = [
  { label: 'URGENT', value: 'URGENT' },
  { label: 'IMPORTANT', value: 'IMPORTANT' },
  { label: 'STANDARD', value: 'STANDARD' },
]

const statutOptions = [
  { label: 'En attente', value: 'En attente' },
  { label: 'En cours', value: 'En cours' },
  { label: 'Traité', value: 'Traité' },
  { label: 'Clôturé', value: 'Clôturé' },
  { label: 'Annulé', value: 'Annulé' },
]

// Calcul automatique du délai en jours
const calculatedDelai = computed(() => {
  const dateAffect = store.formData.date_affect
  const dateRetour = store.formData.delai_traitement
  
  if (!dateAffect || !dateRetour) {
    return '-'
  }
  
  const dateDebut = new Date(dateAffect)
  const dateFin = new Date(dateRetour)
  
  // Calcul de la différence en jours
  const diffTime = dateFin - dateDebut
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) {
    return '0'
  }
  
  return diffDays.toString()
})



const getPriorityColor = (priority) => {
  const colors = {
    'URGENT':    { dot: 'bg-red-500' },
    'IMPORTANT': { dot: 'bg-orange-500' },
    'STANDARD':  { dot: 'bg-blue-500' },
  }
  return colors[priority] || { dot: 'bg-gray-500' }  // ✅ pas de toLowerCase()
}

const getPriorityLabel = (priority) => {
  const labels = {
    'URGENT':    'URGENT',
    'IMPORTANT': 'IMPORTANT',
    'STANDARD':  'STANDARD',
  }
  return labels[priority] || priority  // ✅ pas de toLowerCase()
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>