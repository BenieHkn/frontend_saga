<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="backdrop">
      <div v-if="isOpen" class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" @click="handleCancel" />
    </Transition>

    <!-- Modale -->
    <Transition name="modal">
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div class="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto" @click.stop>
          <!-- Header -->
          <div class="bg-gradient-to-r from-sky-600 to-blue-600 px-6 py-6">
            <div class="flex items-start justify-between">
              <div>
                <h2 class="text-2xl font-bold text-white">Créer un dossier d'affectation ?</h2>
                <p class="text-sm text-sky-100 mt-2">
                  Vous avez sélectionné {{ courriersCount }} courrier(s) et {{ destinataireCount }} destinataire(s)
                </p>
              </div>
              <button @click="handleCancel" class="text-white/70 hover:text-white transition-colors">
                <Icon name="i-heroicons-x-mark" class="w-6 h-6" />
              </button>
            </div>
          </div>

          <!-- Contenu scrollable -->
          <div class="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
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
                  <div v-for="courrier in courriersList" :key="courrier.id" class="flex items-start gap-2 text-xs">
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
                  <div v-for="dest in destinatairesList" :key="dest.id" class="flex items-start gap-2 text-xs">
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
            <div class="border-2 rounded-lg p-4 cursor-pointer transition-all" :class="withFolder
              ? 'border-sky-500 bg-sky-50/50'
              : 'border-slate-200 bg-white hover:bg-slate-50'" @click="withFolder = true">
              <div class="flex items-start gap-3">
                <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5"
                  :class="withFolder ? 'border-sky-600 bg-sky-600' : 'border-slate-300'">
                  <Icon v-if="withFolder" name="i-heroicons-check" class="w-3 h-3 text-white" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-slate-900">Oui, créer un dossier d'affectation</p>
                  <p class="text-sm text-slate-600 mt-1">
                    Regrouper ces {{ courriersCount }} courrier(s) dans un dossier identifié
                  </p>
                </div>
              </div>

              <!-- Panneau de sélection du dossier -->
              <Transition name="slide">
                <div v-if="withFolder" class="mt-4 ml-8 space-y-4" @click.stop>

                  <!-- Dossiers existants -->
                  <div>
                    <p class="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <Icon name="i-heroicons-folder-open" class="w-4 h-4 text-amber-500" />
                      Dossiers existants
                      <span v-if="foldersLoading" class="ml-1">
                        <Icon name="svg-spinners:ring-resize" class="w-4 h-4 text-sky-500 inline" />
                      </span>
                      <span v-else class="text-xs font-normal text-slate-400">({{ filteredFolders.length }})</span>
                    </p>

                    <!-- Barre de recherche parmi dossiers existants -->
                    <div class="relative mb-2" v-if="existingFolders.length > 0">
                      <Icon name="i-heroicons-magnifying-glass"
                        class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input v-model="folderSearch" type="text" placeholder="Rechercher un dossier existant..."
                        class="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all" />
                    </div>

                    <!-- Liste des dossiers existants -->
                    <div v-if="!foldersLoading && filteredFolders.length > 0"
                      class="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100 max-h-44 overflow-y-auto">
                      <button v-for="folder in filteredFolders" :key="folder" type="button"
                        class="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors" :class="folderName === folder && !isNewFolder
                          ? 'bg-sky-100 text-sky-900'
                          : 'bg-white hover:bg-slate-50 text-slate-700'" @click.stop="selectExistingFolder(folder)">
                        <Icon name="i-heroicons-folder" class="w-4 h-4 flex-shrink-0"
                          :class="folderName === folder && !isNewFolder ? 'text-sky-600' : 'text-amber-400'" />
                        <span class="text-sm font-medium truncate flex-1">{{ folder }}</span>
                        <Icon v-if="folderName === folder && !isNewFolder" name="i-heroicons-check-circle"
                          class="w-4 h-4 text-sky-600 flex-shrink-0" />
                      </button>
                    </div>

                    <!-- État vide / erreur -->
                    <div v-else-if="!foldersLoading && existingFolders.length === 0"
                      class="text-xs text-slate-400 italic py-2 px-1">
                      Aucun dossier existant — saisissez un nouveau nom ci-dessous.
                    </div>

                    <div v-else-if="!foldersLoading && existingFolders.length > 0 && filteredFolders.length === 0"
                      class="text-xs text-slate-400 italic py-2 px-1">
                      Aucun dossier ne correspond à votre recherche.
                    </div>
                  </div>

                  <!-- Séparateur -->
                  <div class="flex items-center gap-3">
                    <div class="flex-1 h-px bg-slate-200"></div>
                    <span class="text-xs text-slate-400 font-medium">ou saisir un nouveau nom</span>
                    <div class="flex-1 h-px bg-slate-200"></div>
                  </div>

                  <!-- Champ nouveau nom -->
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">
                      Nouveau nom de dossier
                    </label>
                    <div class="relative">
                      <Icon name="i-heroicons-folder-plus"
                        class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                        :class="isNewFolder ? 'text-sky-500' : 'text-slate-400'" />
                      <input v-model="newFolderName" type="text"
                        placeholder="Ex: Courriers direction générale - Février 2026"
                        class="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-slate-700 placeholder:text-slate-400"
                        :class="isNewFolder ? 'border-sky-400 bg-sky-50/40' : 'border-slate-300'"
                        @input="onNewFolderInput" @keyup.enter="handleConfirm" />
                    </div>
                    <p class="text-xs text-slate-400 mt-1.5">
                      {{ newFolderName?.length || 0 }} / 255 caractères
                    </p>
                  </div>

                  <!-- Badge de sélection active -->
                  <div v-if="folderName"
                    class="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                    <Icon name="i-heroicons-check-circle" class="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <p class="text-sm text-emerald-800">
                      Dossier sélectionné :
                      <strong class="font-semibold">{{ folderName }}</strong>
                      <span class="ml-2 text-xs text-emerald-600 font-normal">
                        {{ isNewFolder ? '(nouveau)' : '(existant)' }}
                      </span>
                    </p>
                  </div>

                </div>
              </Transition>
            </div>

            <!-- Option 2: Sans dossier -->
            <div class="border-2 rounded-lg p-4 cursor-pointer transition-all" :class="!withFolder
              ? 'border-slate-500 bg-slate-50'
              : 'border-slate-200 bg-white hover:bg-slate-50'" @click="withFolder = false">
              <div class="flex items-start gap-3">
                <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5"
                  :class="!withFolder ? 'border-slate-600 bg-slate-600' : 'border-slate-300'">
                  <Icon v-if="!withFolder" name="i-heroicons-check" class="w-3 h-3 text-white" />
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
            <button @click="handleCancel"
              class="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all">
              Annuler
            </button>
            <button @click="handleConfirm" :disabled="withFolder && !folderName?.trim()"
              class="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-blue-600 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
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
const config = useRuntimeConfig()

const emit = defineEmits(['confirm'])

// ── State ────────────────────────────────────────────────────────────────────
const isOpen = ref(false)
const withFolder = ref(true)
const folderName = ref('')       // Valeur finale envoyée au store (existant OU nouveau)
const newFolderName = ref('')       // Champ "nouveau nom"
const isNewFolder = ref(false)   // true si l'utilisateur a tapé un nouveau nom
const folderSearch = ref('')      // Filtre sur la liste des dossiers existants

const existingFolders = ref([])    // Liste des noms de dossiers depuis l'API
const foldersLoading = ref(false)

// ── Computed ─────────────────────────────────────────────────────────────────
const courriersCount = computed(() => store.selectedCourriers.length)
const destinataireCount = computed(() => store.selectedDestinataires.length)

const courriersList = computed(() =>
  store.selectedCourriers
    .map(id => store.courriers.find(c => c.id === id))
    .filter(Boolean)
)

const destinatairesList = computed(() =>
  store.selectedDestinataires
    .map(id => store.destinataires.find(d => d.id === id))
    .filter(Boolean)
)

const filteredFolders = computed(() => {
  if (!folderSearch.value.trim()) return existingFolders.value
  const q = folderSearch.value.toLowerCase()
  return existingFolders.value.filter(f => f.toLowerCase().includes(q))
})

// ── Méthodes ─────────────────────────────────────────────────────────────────

/** Charger les dossiers existants depuis l'API */
const loadExistingFolders = async () => {
  foldersLoading.value = true
  try {
    const token = process.client ? localStorage.getItem('auth_token') || '' : ''
    const response = await $fetch(`${config.public.apiBase}/affectations/dossiers`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
    // L'API retourne { data: ["Nom dossier 1", "Nom dossier 2", ...] }
    // Adapter selon la structure réelle de votre API :
    existingFolders.value = Array.isArray(response.data)
      ? response.data.filter(Boolean)
      : []
  } catch (error) {
    console.error('❌ Erreur chargement dossiers:', error)
    existingFolders.value = []
  } finally {
    foldersLoading.value = false
  }
}

/** Sélectionner un dossier existant dans la liste */
const selectExistingFolder = (folder) => {
  folderName.value = folder
  newFolderName.value = ''       // Vider le champ nouveau nom
  isNewFolder.value = false
}

/** Réagir à la saisie dans le champ "nouveau nom" */
const onNewFolderInput = () => {
  if (newFolderName.value.trim()) {
    folderName.value = newFolderName.value
    isNewFolder.value = true
  } else {
    // Si on efface, on revient à rien de sélectionné
    folderName.value = ''
    isNewFolder.value = false
  }
}

/** Ouvrir la modale */
const openModal = async (suggestedFolderName = '') => {
  withFolder.value = true
  folderName.value = suggestedFolderName
  newFolderName.value = suggestedFolderName
  isNewFolder.value = !!suggestedFolderName
  folderSearch.value = ''
  isOpen.value = true
  await loadExistingFolders()
}

/** Fermer / annuler */
const handleCancel = () => {
  isOpen.value = false
  folderName.value = ''
  newFolderName.value = ''
  isNewFolder.value = false
  folderSearch.value = ''
  withFolder.value = true
}

/** Confirmer */
const handleConfirm = () => {
  if (withFolder.value && !folderName.value?.trim()) return

  store.setFolderInfo(
    withFolder.value,
    withFolder.value ? folderName.value.trim() : null
  )

  isOpen.value = false
  emit('confirm')

  // Reset
  folderName.value = ''
  newFolderName.value = ''
  isNewFolder.value = false
  folderSearch.value = ''
  withFolder.value = true
}

defineExpose({ openModal, handleCancel })
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