<template>
  <div class="bg-white rounded-2xl shadow-xl shadow-slate-200/80 border border-slate-200 p-6">
    <div class="space-y-6">

      <!-- Résumé des sélections -->
      <div class="flex items-center justify-between">
        <!-- Left: Summary -->
        <div class="flex items-center gap-6">
          <div>
            <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Prêt pour affecter ?
            </p>

            <div class="flex items-center gap-4">
              <span class="text-2xl font-bold text-slate-900">
                {{ store.selectedCourriers.length }} Courrier{{ store.selectedCourriers.length !== 1 ? 's' : '' }}
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
          <button @click="emit('cancel')"
            class="px-6 py-3 rounded-xl font-semibold text-slate-700 bg-white border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all">
            Annuler
          </button>

          <button @click="handleSubmit" :disabled="!canSubmit"
            class="group px-6 py-3 rounded-xl font-semibold bg-gradient-to-br from-emerald-700 to-blue-800 text-white hover:from-emerald-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 flex items-center gap-2">
            Créer {{ store.selectedDestinataires.length > 0 ? store.selectedDestinataires.length : '' }}
            affectation{{ store.selectedDestinataires.length > 1 ? 's' : '' }}
            <Icon name="i-heroicons-check" class="w-5 h-5 transition-transform group-hover:scale-110" />
          </button>
        </div>
      </div>

      <!-- Détails si sélections présentes -->
      <div v-if="store.hasSelections" class="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 border-t border-slate-200">

        <!-- Courriers sélectionnés -->
        <div class="lg:col-span-1">
          <p class="text-xs font-semibold text-slate-600 uppercase mb-3">
            Courrier{{ store.selectedCourriers.length > 1 ? 's' : '' }}
          </p>
          <div class="space-y-2">
            <div
              v-for="courrierId in store.selectedCourriers"
              :key="courrierId"
              class="bg-blue-50 rounded-lg p-3 border border-blue-100"
            >
              <div class="flex items-start gap-2">
                <Icon name="i-heroicons-document-check" class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-bold text-blue-900">
                    {{ getCourrier(courrierId)?.reference }}
                  </p>
                  <p class="text-xs text-slate-700 mt-1 line-clamp-2">
                    {{ getCourrier(courrierId)?.objet }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Destinataires sélectionnés -->
        <div class="lg:col-span-1">
          <p class="text-xs font-semibold text-slate-600 uppercase mb-3">Destinataires</p>
          <div class="flex items-center flex-wrap gap-2">
            <div
              v-for="destinataire in getSelectedDestinataires()"
              :key="destinataire.id"
              class="flex items-center gap-2 bg-slate-100 rounded-full px-3 py-1.5 text-xs"
            >
              <div
                class="w-6 h-6 rounded-full flex items-center justify-center font-bold text-white text-xs"
                :class="getAvatarColor(destinataire.user)"
              >
                {{ getInitials(destinataire.user) }}
              </div>
              <span class="font-medium text-slate-900">
                {{ destinataire.user?.nom }} {{ destinataire.user?.prenom }}
              </span>
            </div>
          </div>
        </div>

        <!-- Détails de l'affectation -->
        <div class="lg:col-span-1">
          <p class="text-xs font-semibold text-slate-600 uppercase mb-3">Détails</p>
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-sm">
              <span class="w-3 h-3 rounded-full" :class="getPriorityColor(store.formData.priority).dot"></span>
              <span class="font-medium">{{ store.formData.priority }}</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <span class="w-3 h-3 rounded-full" :class="getStatutColor(store.formData.statut).dot"></span>
              <span class="font-medium">{{ store.formData.statut }}</span>
            </div>
            
            <!-- Délai de traitement - optionnel -->
            <div v-if="store.formData.delai_traitement" class="flex items-center gap-2 text-sm text-slate-600">
              <Icon name="i-heroicons-clock" class="w-4 h-4" />
              <span>{{ formatDate(store.formData.delai_traitement) }}</span>
            </div>
            <div v-else class="flex items-center gap-2 text-sm text-slate-400">
              <Icon name="i-heroicons-clock" class="w-4 h-4" />
              <span class="italic">Aucun délai défini</span>
            </div>

            <!-- Instructions - optionnel -->
            <div v-if="store.formData.instructions" class="mt-3 pt-3 border-t border-slate-200">
              <div class="flex items-start gap-2 text-sm text-slate-700">
                <Icon name="i-heroicons-document-text" class="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span class="line-clamp-2">{{ store.formData.instructions }}</span>
              </div>
            </div>

            <!-- Dossier d'affectation si créé -->
            <div v-if="store.useFolder && store.folderName" class="mt-3 pt-3 border-t border-slate-200">
              <div class="flex items-center gap-2 text-sm text-indigo-700 bg-indigo-50 px-2 py-1 rounded">
                <Icon name="i-heroicons-folder" class="w-4 h-4" />
                <span class="font-medium truncate">{{ store.folderName }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Message d'information -->
      <div v-if="store.hasSelections"
        class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
        <div class="flex items-start gap-3">
          <Icon name="i-heroicons-information-circle" class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p class="text-sm text-slate-700">
              <span class="font-semibold text-blue-900">
                {{ store.selectedDestinataires.length }} affectation{{ store.selectedDestinataires.length > 1 ? 's' : '' }}
              </span>
              sera/seront créée(s)
              {{ store.selectedCourriers.length > 1 ? `pour les ${store.selectedCourriers.length} courriers` : 'pour le courrier' }}
            </p>
            <p v-if="store.useFolder && store.folderName" class="text-sm text-indigo-700 font-medium mt-1">
              📁 Groupé dans le dossier : <strong>{{ store.folderName }}</strong>
            </p>
            <p v-if="!store.formData.instructions && !store.formData.delai_traitement" class="text-sm text-slate-500 mt-1">
              💡 Instructions et délai de traitement sont optionnels
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modale dossier -->
  <FolderAffectationModal 
    ref="folderModalRef"
    @confirm="handleModalConfirm"
  />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAffectationsStore } from '~/stores/affectations'
import FolderAffectationModal from '~/components/affectations/FolderAffectationModal.vue'

const store = useAffectationsStore()
const folderModalRef = ref(null)

const emit = defineEmits(['cancel', 'submit'])

// ✅ Validation simplifiée : seulement courriers et destinataires requis
const canSubmit = computed(() => {
  return store.selectedCourriers.length > 0 && store.selectedDestinataires.length > 0
})

// Obtenir un courrier par son ID
const getCourrier = (courrierId) => {
  return store.courriers.find(c => c.id === courrierId)
}

// Obtenir les destinataires sélectionnés
const getSelectedDestinataires = () => {
  return store.selectedDestinataires
    .map(destId => store.destinataires.find(d => d.id === destId))
    .filter(Boolean)
}

// Obtenir les initiales
const getInitials = (user) => {
  if (!user) return '??'
  const nom = user.nom || ''
  const prenom = user.prenom || ''
  return `${nom.charAt(0)}${prenom.charAt(0)}`.toUpperCase()
}

// Couleur de l'avatar
const getAvatarColor = (user) => {
  const initials = getInitials(user)
  const hash = initials.charCodeAt(0) + initials.charCodeAt(1)
  const colors = [
    'bg-gradient-to-br from-blue-500 to-blue-600',
    'bg-gradient-to-br from-indigo-500 to-indigo-600',
    'bg-gradient-to-br from-blue-500 to-blue-600',
    'bg-gradient-to-br from-pink-500 to-pink-600',
    'bg-gradient-to-br from-cyan-500 to-blue-600',
  ]
  return colors[hash % colors.length]
}

// Couleurs des priorités
const getPriorityColor = (priority) => {
  const colors = {
    'URGENT': { dot: 'bg-red-500' },
    'IMPORTANT': { dot: 'bg-orange-500' },
    'STANDARD': { dot: 'bg-blue-500' },
  }
  return colors[priority] || { dot: 'bg-gray-500' }
}

// Couleurs des statuts
const getStatutColor = (statut) => {
  const colors = {
    'En attente': { dot: 'bg-gray-500' },
    'En cours': { dot: 'bg-blue-500' },
    'Traité': { dot: 'bg-green-500' },
    'Clôturé': { dot: 'bg-blue-500' },
    'Annulé': { dot: 'bg-red-500' },
  }
  return colors[statut] || { dot: 'bg-gray-500' }
}

// Formater la date
const formatDate = (date) => {
  if (!date) return ''

  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

// Gérer le submit
const handleSubmit = async () => {
  // Si 2+ courriers sélectionnés, afficher la modale du dossier
  if (store.selectedCourriers.length > 1) {
    // Ouvrir la modale et attendre la confirmation
    await folderModalRef.value?.openModal()
    // L'événement submit sera émis via handleModalConfirm quand l'utilisateur confirme
  } else {
    // Sinon, pas de dossier, émettre l'événement submit directement
    store.setFolderInfo(false, null)
    emit('submit')
  }
}

// Nouvelle méthode appelée quand la modale est confirmée
const handleModalConfirm = () => {
  // La modale a déjà mis à jour le store via setFolderInfo
  // Maintenant on peut émettre l'événement submit
  emit('submit')
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