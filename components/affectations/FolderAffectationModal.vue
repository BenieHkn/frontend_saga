<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="backdrop">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        @click="handleCancel"
      />
    </Transition>

    <!-- Modale -->
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          class="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
          @click.stop
        >
          <!-- Header -->
          <div class="bg-gradient-to-r from-sky-600 to-blue-600 px-6 py-6">
            <div class="flex items-start justify-between">
              <div>
                <h2 class="text-2xl font-bold text-white">Créer un dossier d'affectation ?</h2>
                <p class="text-sm text-sky-100 mt-2">
                  Vous avez sélectionné {{ courriersCount }} courrier(s) et {{ destinataireCount }} destinataire(s)
                </p>
              </div>
              <button
                @click="handleCancel"
                class="text-white/70 hover:text-white transition-colors"
              >
                <Icon name="i-heroicons-x-mark" class="w-6 h-6" />
              </button>
            </div>
          </div>

          <!-- Contenu -->
          <div class="p-6 space-y-6">
            <!-- Explication -->
            <div class="bg-sky-50 border border-sky-200 rounded-lg p-4">
              <div class="flex items-start gap-3">
                <Icon name="i-heroicons-light-bulb" class="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p class="text-sm font-semibold text-sky-900">Qu'est-ce qu'un dossier d'affectation ?</p>
                  <p class="text-xs text-sky-700 mt-1">
                    Un dossier d'affectation regroupe plusieurs courriers affectés au(x) même(s) destinataire(s). 
                    Cela facilite le suivi et l'organisation des affectations liées.
                  </p>
                </div>
              </div>
            </div>

            <!-- Résumé de la sélection -->
            <div class="grid grid-cols-2 gap-4">
              <!-- Courriers -->
              <div class="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p class="text-xs font-semibold text-slate-600 uppercase mb-3">Courriers à affecter</p>
                <div class="space-y-2 max-h-40 overflow-y-auto">
                  <div
                    v-for="courrier in courriersList"
                    :key="courrier.id"
                    class="flex items-start gap-2 text-xs"
                  >
                    <Icon name="i-heroicons-document-text" class="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div class="flex-1 min-w-0">
                      <p class="font-medium text-slate-900">{{ courrier.reference }}</p>
                      <p class="text-slate-600 truncate">{{ courrier.objet }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Destinataires -->
              <div class="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p class="text-xs font-semibold text-slate-600 uppercase mb-3">Destinataire(s)</p>
                <div class="space-y-2 max-h-40 overflow-y-auto">
                  <div
                    v-for="dest in destinatairesList"
                    :key="dest.id"
                    class="flex items-start gap-2 text-xs"
                  >
                    <Icon name="i-heroicons-user" class="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div class="flex-1 min-w-0">
                      <p class="font-medium text-slate-900">{{ dest.user?.nom }} {{ dest.user?.prenom }}</p>
                      <p class="text-slate-600 truncate">{{ dest.fonction?.code }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Option 1: Créer un dossier -->
            <div
              class="border-2 rounded-lg p-4 cursor-pointer transition-all"
              :class="withFolder
                ? 'border-sky-500 bg-sky-50/50'
                : 'border-slate-200 bg-white hover:bg-slate-50'"
              @click="withFolder = true"
            >
              <div class="flex items-start gap-3">
                <div
                  class="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5"
                  :class="withFolder
                    ? 'border-sky-600 bg-sky-600'
                    : 'border-slate-300'"
                >
                  <Icon
                    v-if="withFolder"
                    name="i-heroicons-check"
                    class="w-3 h-3 text-white"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-slate-900">Oui, créer un dossier d'affectation</p>
                  <p class="text-sm text-slate-600 mt-1">
                    Regrouper ces {{ courriersCount }} courrier(s) dans un dossier identifié
                  </p>
                </div>
              </div>

              <!-- Champ nom du dossier (visible si option sélectionnée) -->
              <Transition name="slide">
                <div v-if="withFolder" class="mt-4 ml-8">
                  <label class="block text-sm font-medium text-slate-700 mb-2">
                    Nom du dossier
                    <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <Icon
                      name="i-heroicons-folder"
                      class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
                    />
                    <input
                      v-model="folderName"
                      type="text"
                      placeholder="Ex: Courriers direction générale - Février 2026"
                      class="w-full pl-10 pr-4 py-2.5 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-slate-700 placeholder:text-slate-400"
                      @keyup.enter="handleConfirm"
                    />
                  </div>
                  <p class="text-xs text-slate-500 mt-2">
                    {{ folderName?.length || 0 }} / 255 caractères
                  </p>
                </div>
              </Transition>
            </div>

            <!-- Option 2: Sans dossier -->
            <div
              class="border-2 rounded-lg p-4 cursor-pointer transition-all"
              :class="!withFolder
                ? 'border-slate-500 bg-slate-50'
                : 'border-slate-200 bg-white hover:bg-slate-50'"
              @click="withFolder = false"
            >
              <div class="flex items-start gap-3">
                <div
                  class="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5"
                  :class="!withFolder
                    ? 'border-slate-600 bg-slate-600'
                    : 'border-slate-300'"
                >
                  <Icon
                    v-if="!withFolder"
                    name="i-heroicons-check"
                    class="w-3 h-3 text-white"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-slate-900">Non, continuer sans dossier</p>
                  <p class="text-sm text-slate-600 mt-1">
                    Créer les {{ courriersCount }} affectation(s) individuellement
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              @click="handleCancel"
              class="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all"
            >
              Annuler
            </button>
            <button
              @click="handleConfirm"
              :disabled="withFolder && !folderName?.trim()"
              class="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-blue-600 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Icon name="i-heroicons-check" class="w-4 h-4" />
              Continuer
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAffectationsStore } from '~/stores/affectations'

const store = useAffectationsStore()

const emit = defineEmits(['confirm'])

const isOpen = ref(false)
const withFolder = ref(true)
const folderName = ref('')

const courriersCount = computed(() => store.selectedCourriers.length)
const destinataireCount = computed(() => store.selectedDestinataires.length)

// Liste des courriers sélectionnés avec données complètes
const courriersList = computed(() => {
  return store.selectedCourriers.map(courrierId =>
    store.courriers.find(c => c.id === courrierId)
  ).filter(Boolean)
})

// Liste des destinataires sélectionnés avec données complètes
const destinatairesList = computed(() => {
  return store.selectedDestinataires.map(destId =>
    store.destinataires.find(d => d.id === destId)
  ).filter(Boolean)
})

// Ouvrir la modale
const openModal = async (suggestedFolderName = '') => {
  withFolder.value = true
  folderName.value = suggestedFolderName
  isOpen.value = true
}

// Fermer la modale
const handleCancel = () => {
  isOpen.value = false
  folderName.value = ''
  withFolder.value = true
}

// Confirmer la sélection
const handleConfirm = () => {
  if (withFolder.value && !folderName.value?.trim()) {
    return
  }

  // Sauvegarder dans le store
  store.setFolderInfo(
    withFolder.value,
    withFolder.value ? folderName.value : null
  )

  // Fermer la modale
  isOpen.value = false
  
  // Émettre l'événement confirm pour déclencher le submit dans le parent
  emit('confirm')
  
  // Réinitialiser les valeurs
  folderName.value = ''
  withFolder.value = true
}

defineExpose({
  openModal,
  handleCancel,
})
</script>

<style scoped>
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.2s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  transform: scale(0.95);
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>