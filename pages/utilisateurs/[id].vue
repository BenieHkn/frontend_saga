<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto p-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-12">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">

            <!-- <PageHeader
              title="Modification d'un Utilisateur"
              subtitle="Gestion des utilisateurs"
              to="/utilisateurs"
              btn-text="Retour à la liste"
            /> -->

            <!-- <UBadge color="green" variant="soft" size="lg" class="ml-auto">
              <Icon name="i-heroicons-arrow-left" class="h-4 w-4 mr-1" />
               <UButton to="/utilisateurs" variant="text" size="sm" class="p-0 m-0 text-green-600">
                 Retour à la liste
               </UButton>
            </UBadge> -->

            <div class="flex justify-end">
               <UButton 
                  to="/utilisateurs" 
                  icon="i-heroicons-arrow-left"
                  color="green"
                  variant="soft"
                >
                Retour à la liste
                </UButton>
            </div>


            <!-- Loading State -->
            <div v-if="loadingInitial" class="flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
              <div class="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <span class="text-sm font-medium">Chargement des données...</span>
            </div>

            <form v-else @submit.prevent="handleSubmit" class="space-y-6 mt-6 max-w-3xl mx-auto">

              <!-- Type d'utilisateur -->
              <div class="flex items-center gap-6 pt-4 border-t">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input :checked="form.estResponsable" type="checkbox" v-model="form.estResponsable"
                    class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                  <span class="text-sm font-medium text-gray-700">Est Responsable</span>
                </label>
                
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Entités <span class="text-red-600">*</span>
                </label>
                <select 
                  v-model="form.entite_id"
                  class="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                >
                  <option value="" disabled>Sélectionner une entité</option>
                  <option 
                    v-for="entite in entites" 
                    :key="entite.id" 
                    :value="entite.id"
                  >
                    {{ entite.libelle }}
                  </option>
                </select>
              </div>

              <!-- Matricule -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Matricule<span class="text-red-600">*</span>
                </label>
                <UInput v-model="form.matricule" placeholder="Ex: MAT001, EMP2024..." class="w-full h-12" />
              </div>

              <!-- Nom et Prénoms -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nom<span class="text-red-600">*</span></label>
                  <UInput v-model="form.nom" placeholder="Ex: DUPONT" class="w-full h-12" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Prénoms<span class="text-red-600">*</span></label>
                  <UInput v-model="form.prenoms" placeholder="Ex: Jean Pierre" class="w-full h-12" />
                </div>
              </div>

              <!-- Email et Téléphone -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Email<span class="text-red-600">*</span></label>
                  <UInput v-model="form.email" type="email" placeholder="Ex: jean.dupont@example.com" class="w-full h-12" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <UInput v-model="form.telephone" placeholder="Ex: +229 XX XX XX XX" class="w-full h-12" />
                </div>
              </div>

              <!-- Modification du mot de passe (optionnel) -->
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <label class="flex items-center gap-2 cursor-pointer mb-3">
                  <input type="checkbox" v-model="changePassword"
                    class="w-4 h-4 text-indigo-600 border-gray-300 rounded" />
                  <span class="text-sm font-medium text-blue-900">Modifier le mot de passe</span>
                </label>
                
                <div v-if="changePassword" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Nouveau mot de passe
                    </label>
                    <UInput v-model="form.password" type="password" placeholder="Minimum 8 caractères" class="w-full h-12" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Confirmer le mot de passe
                    </label>
                    <UInput v-model="form.password_confirmation" type="password" placeholder="Confirmer le mot de passe" class="w-full h-12" />
                  </div>
                </div>
              </div>

              <!-- Date de prise de service -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Date de prise de service</label>
                <UInput v-model="form.datePriseService" type="date" class="w-full md:w-1/2 h-12" />
              </div>

              <!-- ── Fonctions attribuées ─────────────────────────────────── -->
              <div>
                <!-- <div class="flex items-center justify-between mb-3">
                  <label class="block text-sm font-medium text-gray-700">Fonctions attribuées</label>
                  <UButton type="button" color="primary" size="sm" @click="openFonctionModal">
                    + Ajouter une fonction
                  </UButton>
                </div> -->

                <div class="space-y-2">
                  <!-- <div v-if="!currentFonctions.length"
                    class="text-sm italic text-slate-400 bg-slate-50 px-3 py-2 rounded">
                    Aucune fonction attribuée
                  </div> -->

                  <div
                    v-for="(fn, idx) in currentFonctions"
                    :key="`${fn.fonction_user_id ?? fn.id}-${idx}`"
                    class="flex items-start justify-between gap-3 bg-blue-50 border border-blue-200 px-4 py-3 rounded-lg"
                  >
                    <div class="flex-1 space-y-1">
                      <!-- Ligne principale -->
                      <div class="flex items-center gap-3 flex-wrap">
                        <!-- Actif toggle -->
                        <label class="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            v-model="fn.actif"
                            @change="updateFonctionActif(fn)"
                            class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                          <span class="text-xs font-medium text-blue-800">Actif</span>
                        </label>

                        <span class="text-sm font-semibold text-blue-900">{{ fn.libelle }}</span>

                        <span v-if="fn.is_interim"
                          class="text-[11px] px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full font-medium">
                          Intérim
                        </span>

                        <!-- Pièce jointe : badge si déjà en base -->
                        <a
                          v-if="fn.piece_jointe_url"
                          :href="fn.piece_jointe_url"
                          target="_blank"
                          class="text-[11px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium flex items-center gap-1 hover:bg-green-200 transition-colors"
                          title="Voir la pièce jointe"
                        >
                          <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          {{ fn.piece_jointe_nom || 'Voir la pièce jointe' }}
                        </a>

                        <!-- Pièce jointe : badge si uniquement stocké localement (pas encore en base) -->
                        <span
                          v-else-if="fn.piece_jointe_file && !fn.piece_jointe_url"
                          class="text-[11px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium flex items-center gap-1"
                        >
                          <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          {{ fn.piece_jointe_nom || 'Document' }}
                        </span>
                      </div>

                      <!-- Dates -->
                      <div class="text-xs text-slate-500">
                        <span v-if="fn.debut">Début : {{ formatDateShort(fn.debut) }}</span>
                        <span v-if="fn.debut && fn.fin"> • </span>
                        <span v-if="fn.fin">Fin : {{ formatDateShort(fn.fin) }}</span>
                        <span v-if="!fn.debut && !fn.fin" class="italic">Aucune date définie</span>
                      </div>

                      <!-- Indicateur de statut enregistrement -->
                      <div class="flex items-center gap-1 text-[10px]">
                        <span v-if="fn.fonction_user_id"
                          class="flex items-center gap-1 text-green-600 font-medium">
                          <span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          Enregistrée en base
                        </span>
                        <span v-else
                          class="flex items-center gap-1 text-orange-500 font-medium">
                          <span class="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse"></span>
                          En attente de sauvegarde
                        </span>
                      </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center gap-2 flex-shrink-0">
                      <UButton
                        type="button"
                        color="red"
                        variant="soft"
                        size="xs"
                        @click="removeFonction(idx, fn)"
                        :loading="fn.deleting"
                      >
                        Supprimer
                      </UButton>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Points Critiques (affichage uniquement) -->
              <!-- <div v-if="form.points_critiques && form.points_critiques.length > 0">
                <label class="block text-sm font-medium text-gray-700 mb-2">Points Critiques assignés</label>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="point in form.points_critiques"
                    :key="point.id"
                    class="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg bg-green-50 text-green-700 border border-green-200"
                  >
                    {{ point.nom || point.libelle }}
                  </span>
                </div>
                <p class="text-xs text-gray-500 mt-1">Ces points critiques sont assignés à cet utilisateur.</p>
              </div> -->

              <!-- Admin et Statut -->
              <div class="flex items-center gap-6 pt-4 border-t">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" v-model="form.estAdministrateur"
                    class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                  <span class="text-sm font-medium text-gray-700">Est administrateur</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" v-model="form.statut"
                    class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                  <span class="text-sm font-medium text-gray-700">Compte actif</span>
                </label>
              </div>

              <!-- Boutons -->
              <div class="flex justify-center space-x-4 pt-6 border-t border-gray-200">
                <UButton type="button" @click="handleCancel" color="gray" variant="outline">
                  ANNULER
                </UButton>
                <UButton
                  :disabled="!isFormValid || loading"
                  type="submit"
                  class="bg-gradient-to-br from-emerald-800 to-blue-800 text-white dark:text-white"
                  :loading="loading"
                >
                  METTRE À JOUR
                </UButton>
              </div>

              <!-- Erreurs -->
              <div v-if="errors.length > 0" class="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 class="text-sm font-bold text-red-900 mb-2">Erreurs de validation :</h4>
                <ul class="list-disc list-inside text-sm text-red-600">
                  <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
                </ul>
              </div>
              <div v-if="errorRequest" class="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <p class="text-sm font-bold text-red-900">Erreur serveur :</p>
                <p class="text-sm text-red-600 mt-1">
                  {{ errorRequest.message || errorRequest.data?.message || 'Une erreur est survenue' }}
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- ── Modal Ajout Fonction ─────────────────────────────────────────── -->
      <div v-if="showFonctionModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-lg">
          <!-- En-tête modal -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Ajouter une fonction</h3>
            <button @click="closeFonctionModal"
              class="text-gray-400 hover:text-gray-600 transition-colors">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="px-6 py-5 space-y-4">

            <!-- Sélection fonction -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Fonction <span class="text-red-600">*</span>
              </label>
              <USelectMenu
                v-model="modal.fonction_id"
                :options="fonctionsOptions"
                placeholder="Sélectionner une fonction"
                value-attribute="id"
                option-attribute="libelle"
                searchable
                searchable-placeholder="Rechercher..."
                class="w-full"
              >
                <template #option="{ option }">
                  <div class="flex flex-col py-0.5">
                    <span class="font-semibold text-sm">{{ option.libelle }}</span>
                    <span v-if="option.entite_libelle" class="text-xs text-gray-400">
                      {{ option.entite_libelle }}
                    </span>
                  </div>
                </template>
              </USelectMenu>
            </div>

            <!-- Dates -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Date début</label>
                <UInput v-model="modal.debut" type="date" class="w-full h-10" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Date fin</label>
                <UInput v-model="modal.fin" type="date" class="w-full h-10" />
              </div>
            </div>

            <!-- Intérim -->
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="modal.is_interim"
                class="w-4 h-4 text-indigo-600 border-gray-300 rounded" />
              <span class="text-sm font-medium text-gray-700">Fonction en intérim</span>
            </label>

            <!-- Pièce jointe -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Pièce jointe</label>

              <!-- Zone de drop ou clic -->
              <div
                class="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors"
                :class="modal.piece_jointe_file
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50'"
                @click="$refs.fileInput.click()"
                @dragover.prevent
                @drop.prevent="onFileDrop"
              >
                <input
                  ref="fileInput"
                  type="file"
                  @change="handleFileChange"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  class="hidden"
                />

                <!-- Fichier sélectionné -->
                <div v-if="modal.piece_jointe_file" class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2 min-w-0">
                    <svg class="w-8 h-8 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div class="text-left min-w-0">
                      <p class="text-sm font-medium text-gray-800 truncate">{{ modal.piece_jointe_file.name }}</p>
                      <p class="text-xs text-gray-500">{{ formatFileSize(modal.piece_jointe_file.size) }}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    @click.stop="removeFile"
                    class="flex-shrink-0 p-1 rounded-full text-red-400 hover:text-red-600 hover:bg-red-100 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <!-- Aucun fichier -->
                <div v-else class="flex flex-col items-center gap-2 py-2">
                  <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <p class="text-sm text-gray-500">
                    <span class="font-medium text-indigo-600">Cliquez</span> ou glissez un fichier ici
                  </p>
                  <p class="text-xs text-gray-400">PDF, Word, Images — max 5 Mo</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer modal -->
          <div class="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <UButton type="button" color="gray" variant="outline" @click="closeFonctionModal">
              Annuler
            </UButton>
            <UButton
              type="button"
              @click="saveFonctionModal"
              :loading="savingFonction"
              :disabled="!modal.fonction_id"
            >
              <svg v-if="!savingFonction" class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Enregistrer la fonction
            </UButton>
          </div>
        </div>
      </div>

      <!-- ── Modal Succès ────────────────────────────────────────────────── -->
      <div v-if="showSuccessModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl p-8 w-[500px] max-w-[90vw] mx-4 text-center">
          <div class="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-green-100 mb-4">
            <svg class="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-2xl font-semibold mb-2">Succès !</h3>
          <p class="text-gray-600 mb-6">L'utilisateur a été modifié avec succès.</p>
          <UButton @click="navigateTo('/utilisateurs')"
            class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
            Retour à la liste
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({ title: "Modification d'un Utilisateur" })

const route  = useRoute()
const userId = route.params.id

// ── États ──────────────────────────────────────────────────────────────────
const loading          = ref(false)
const loadingInitial   = ref(true)
const loadingFonctions = ref(false)
const loadingEntites = ref(false)
const savingFonction   = ref(false)
const changePassword   = ref(false)
const authToken        = ref('')
const errorRequest     = ref(null)
const showSuccessModal  = ref(false)
const showFonctionModal = ref(false)
const config           = useRuntimeConfig()
const fileInput        = ref(null)

const form = ref({
  id:               null,
  matricule:        '',
  nom:              '',
  prenoms:          '',
  email:            '',
  telephone:        '',
  password:         '',
  password_confirmation: '',
  datePriseService: '',
  estAdministrateur: false,
  statut:           true,
  points_critiques: [],
  estResponsable: false,
})

const errors           = ref([])
const fonctions        = ref([])
const entites        = ref([])
const currentFonctions = ref([])

// Données du modal
const modal = ref({
  fonction_id:       null,
  debut:             '',
  fin:               '',
  is_interim:        false,
  piece_jointe_file: null,
  piece_jointe_nom:  '',
})

// ── Computed ───────────────────────────────────────────────────────────────
const isFormValid = computed(() => {
  const baseValid = form.value.matricule.trim() !== '' &&
    form.value.nom.trim()       !== '' &&
    form.value.prenoms.trim()   !== '' &&
    form.value.email.trim()     !== ''
  
  if (changePassword.value) {
    return baseValid && 
      form.value.password.trim() !== '' &&
      form.value.password_confirmation.trim() !== ''
  }
  
  return baseValid
})

const isResponsable = computed(() =>
  currentFonctions.value.some(f => !f.is_interim && f.actif)
)

const displayType = computed(() => isResponsable.value ? 'Responsable' : 'Agent')

const fonctionsOptions = computed(() =>
  fonctions.value.map(f => ({
    id:             f.id,
    libelle:        f.libelle || f.code,
    code:           f.code,
    entite_libelle: f.entite?.libelle || f.entite_libelle || '',
  }))
)

// ── Helpers ────────────────────────────────────────────────────────────────
const formatDateShort = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR')
}

const formatFileSize = (bytes) => {
  if (!bytes) return ''
  if (bytes < 1024)        return bytes + ' o'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' Ko'
  return (bytes / (1024 * 1024)).toFixed(1) + ' Mo'
}

// ── Gestion des fichiers ───────────────────────────────────────────────────
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg', 'image/jpg', 'image/png',
]

const validateFile = (file) => {
  if (!file) return null
  if (file.size > 5 * 1024 * 1024) {
    return 'Le fichier ne doit pas dépasser 5 Mo'
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return 'Format non autorisé (PDF, Word, JPG, PNG uniquement)'
  }
  return null
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (!file) return
  const error = validateFile(file)
  if (error) {
    useToast().add({ title: 'Fichier invalide', description: error, color: 'red' })
    return
  }
  modal.value.piece_jointe_file = file
  modal.value.piece_jointe_nom  = file.name
}

const onFileDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (!file) return
  const error = validateFile(file)
  if (error) {
    useToast().add({ title: 'Fichier invalide', description: error, color: 'red' })
    return
  }
  modal.value.piece_jointe_file = file
  modal.value.piece_jointe_nom  = file.name
}

const removeFile = () => {
  modal.value.piece_jointe_file = null
  modal.value.piece_jointe_nom  = ''
  if (fileInput.value) fileInput.value.value = ''
}

// ── Validation formulaire ──────────────────────────────────────────────────
const validateForm = () => {
  const newErrors = []
  if (!form.value.matricule.trim()) newErrors.push('Le matricule est obligatoire')
  if (!form.value.nom.trim())       newErrors.push('Le nom est obligatoire')
  if (!form.value.prenoms.trim())   newErrors.push('Les prénoms sont obligatoires')
  if (!form.value.email.trim())     newErrors.push('L\'email est obligatoire')
  if (form.value.email && !form.value.email.includes('@')) newErrors.push('L\'email doit être valide')
  
  if (changePassword.value) {
    if (!form.value.password.trim()) newErrors.push('Le mot de passe est obligatoire')
    if (form.value.password && form.value.password.length < 8) newErrors.push('Le mot de passe doit contenir au moins 8 caractères')
    if (form.value.password !== form.value.password_confirmation) newErrors.push('Les mots de passe ne correspondent pas')
  }
  
  errors.value = newErrors
  return newErrors.length === 0
}

// ── Chargement des fonctions disponibles ───────────────────────────────────
// const loadFonctions = async () => {
//   loadingFonctions.value = true
//   try {
//     const response = await $fetch(
//       `${config.public.apiBase}/fonctions`,
//       { method: 'GET', headers: { Authorization: `Bearer ${authToken.value}`, Accept: 'application/json' } }
//     )
//     fonctions.value = response?.data ?? (Array.isArray(response) ? response : [])
//   } catch (err) {
//     console.error('❌ Erreur chargement fonctions:', err)
//     useToast().add({ title: 'Erreur', description: 'Impossible de charger les fonctions', color: 'red' })
//   } finally {
//     loadingFonctions.value = false
//   }
// }

// ── Chargement des fonctions disponibles ───────────────────────────────────
const loadEntites = async () => {
  loadingEntites.value = true
  try {
    const response = await $fetch(
      `${config.public.apiBase}/entites`,
      { method: 'GET', headers: { Authorization: `Bearer ${authToken.value}`, Accept: 'application/json' } }
    )
    entites.value = response?.data ?? (Array.isArray(response) ? response : [])
  } catch (err) {
    console.error('❌ Erreur chargement fonctions:', err)
    useToast().add({ title: 'Erreur', description: 'Impossible de charger les fonctions', color: 'red' })
  } finally {
    loadingEntites.value = false
  }
}

const formatForInput = (dateString) => {
  if (!dateString) return ''

  const date = new Date(dateString)

  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

// ── Chargement de l'utilisateur ────────────────────────────────────────────
const loadUser = async () => {
  try {
    const response = await $fetch(
      `${config.public.apiBase}/users/${userId}`,
      { method: 'GET', headers: { Authorization: `Bearer ${authToken.value}`, Accept: 'application/json' } }
    )

    const user = response.success ? response.data : (response.data || response)
    if (!user?.id) throw new Error('Utilisateur non trouvé')

    form.value = {
      id:               user.id,
      matricule:        user.matricule        || '',
      nom:              user.nom              || '',
      prenoms:          user.prenom           || user.prenoms || '',
      email:            user.email            || '',
      telephone:        user.telephone        || '',
      password:         '',
      password_confirmation: '',
      datePriseService: formatForInput(user.prise_service)   || '',
      estAdministrateur: user.is_superadmin   ?? false,
      estResponsable: user.entite_users[0].is_responsable   ?? false,
      statut:           user.statut           ?? true,
      points_critiques: (user.points_critiques || []).map(p => ({
        id:  p.id,
        nom: p.libelle || p.code,
        code: p.code,
      })),
      entite_id: user.entite_users[0]?.entite_id || null,
    }

    // ── Charger les fonctions déjà attribuées ─────────────────────────────
    const rawFonctions = user.fonctions || []
    const rawFonctionUsers = user.fonction_users || []

    if (rawFonctions.length > 0) {
      currentFonctions.value = rawFonctions.map(f => ({
        fonction_user_id: f.pivot?.id     || null,
        id:               f.id,
        libelle:          f.libelle       || f.code,
        actif:            f.pivot?.actif  ?? true,
        debut:            f.pivot?.date_debut || '',
        fin:              f.pivot?.date_fin   || '',
        is_interim:       f.pivot?.is_interim || false,
        piece_jointe:     f.pivot?.piece_jointe || '',
        piece_jointe_nom: f.pivot?.piece_jointe ? f.pivot.piece_jointe.split('/').pop() : '',
        piece_jointe_url: f.pivot?.piece_jointe_url || null,
      }))
    } else if (rawFonctionUsers.length > 0) {
      currentFonctions.value = rawFonctionUsers
        .filter(fu => fu.fonction)
        .map(fu => ({
          fonction_user_id: fu.id,
          id:               fu.fonction.id,
          libelle:          fu.fonction.libelle || fu.fonction.code,
          actif:            fu.actif    ?? true,
          debut:            fu.date_debut || '',
          fin:              fu.date_fin   || '',
          is_interim:       fu.is_interim || false,
          piece_jointe:     fu.piece_jointe     || '',
          piece_jointe_nom: fu.piece_jointe ? fu.piece_jointe.split('/').pop() : '',
          piece_jointe_url: fu.piece_jointe_url || null,
        }))
    }

  } catch (error) {
    console.error('❌ Erreur chargement utilisateur:', error)
    if (error.status === 401) {
      useToast().add({ title: 'Session expirée', description: 'Redirection...', color: 'red' })
      setTimeout(() => navigateTo('/login'), 2000)
    } else {
      useToast().add({ title: 'Erreur', description: 'Impossible de charger l\'utilisateur', color: 'red' })
     // setTimeout(() => navigateTo('/utilisateurs'), 2000)
    }
  }
}

// ── Mounted ────────────────────────────────────────────────────────────────
onMounted(async () => {
  if (!process.client) return
  authToken.value = localStorage.getItem('auth_token') || ''

  if (!authToken.value) {
    useToast().add({ title: 'Non authentifié', description: 'Vous devez être connecté', color: 'red' })
    setTimeout(() => navigateTo('/login'), 1500)
    return
  }

  try {
    await Promise.all([loadUser(),loadEntites()])
  } finally {
    loadingInitial.value = false
  }
})

// ── Gestion du modal Fonction ──────────────────────────────────────────────
const openFonctionModal = () => {
  modal.value = { fonction_id: null, debut: '', fin: '', is_interim: false, piece_jointe_file: null, piece_jointe_nom: '' }
  showFonctionModal.value = true
}

const closeFonctionModal = () => {
  showFonctionModal.value = false
  removeFile()
  modal.value = { fonction_id: null, debut: '', fin: '', is_interim: false, piece_jointe_file: null, piece_jointe_nom: '' }
}

/**
 * Enregistrement direct en base via POST /api/fonction-users
 */
const saveFonctionModal = async () => {
  if (!modal.value.fonction_id) {
    useToast().add({ title: 'Erreur', description: 'Veuillez sélectionner une fonction', color: 'red' })
    return
  }

  const existe = currentFonctions.value.find(cf => cf.id == modal.value.fonction_id)
  if (existe) {
    useToast().add({ title: 'Attention', description: 'Cette fonction est déjà attribuée', color: 'orange' })
    return
  }

  const f = fonctions.value.find(x => x.id == modal.value.fonction_id)
  if (!f) return

  savingFonction.value = true

  try {
    const formData = new FormData()
    formData.append('fonction_id',  modal.value.fonction_id)
    formData.append('user_id',      userId)
    formData.append('actif',        '1')
    formData.append('is_interim',   modal.value.is_interim ? '1' : '0')

    if (modal.value.debut) formData.append('date_debut', modal.value.debut)
    if (modal.value.fin)   formData.append('date_fin',   modal.value.fin)

    if (modal.value.piece_jointe_file) {
      formData.append('piece_jointe', modal.value.piece_jointe_file)
    }

    const response = await $fetch(
      `${config.public.apiBase}/fonction-users`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken.value}`,
          Accept: 'application/json',
        },
        body: formData,
      }
    )

    if (!response.success) {
      throw new Error(response.message || 'Erreur lors de l\'enregistrement')
    }

    const saved = response.data
    currentFonctions.value.push({
      fonction_user_id: saved.id,
      id:               saved.fonction_id,
      libelle:          f.libelle,
      actif:            saved.actif,
      debut:            saved.date_debut || '',
      fin:              saved.date_fin   || '',
      is_interim:       saved.is_interim,
      piece_jointe:     saved.piece_jointe     || '',
      piece_jointe_nom: saved.piece_jointe
        ? saved.piece_jointe.split('/').pop()
        : (modal.value.piece_jointe_nom || ''),
      piece_jointe_url: saved.piece_jointe_url || null,
    })

    useToast().add({
      title:       'Fonction ajoutée',
      description: `"${f.libelle}" a été enregistrée avec succès`,
      color:       'green',
    })

    closeFonctionModal()

  } catch (error) {
    console.error('❌ Erreur enregistrement fonction-user:', error)

    if (error.data?.errors) {
      const msgs = Object.values(error.data.errors).flat()
      useToast().add({ title: 'Erreur de validation', description: msgs[0], color: 'red' })
    } else {
      useToast().add({
        title:       'Erreur',
        description: error.data?.message || error.message || 'Erreur lors de l\'enregistrement',
        color:       'red',
      })
    }
  } finally {
    savingFonction.value = false
  }
}

/**
 * Mise à jour du statut actif d'une fonction
 */
const updateFonctionActif = async (fn) => {
  if (!fn.fonction_user_id) return

  try {
    await $fetch(
      `${config.public.apiBase}/fonction-users/${fn.fonction_user_id}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${authToken.value}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ actif: fn.actif }),
      }
    )
    
    useToast().add({
      title: 'Mis à jour',
      description: `Statut de la fonction "${fn.libelle}" modifié`,
      color: 'green',
    })
  } catch (error) {
    console.error('❌ Erreur mise à jour fonction:', error)
    fn.actif = !fn.actif // Rollback
    useToast().add({
      title: 'Erreur',
      description: 'Impossible de modifier le statut',
      color: 'red',
    })
  }
}

/**
 * Suppression d'une fonction
 */
const removeFonction = async (idx, fn) => {
  if (fn.fonction_user_id) {
    fn.deleting = true
    try {
      await $fetch(
        `${config.public.apiBase}/fonction-users/${fn.fonction_user_id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${authToken.value}`, Accept: 'application/json' },
        }
      )
      currentFonctions.value.splice(idx, 1)
      useToast().add({ title: 'Supprimé', description: `Fonction "${fn.libelle}" retirée`, color: 'green' })
    } catch (error) {
      fn.deleting = false
      useToast().add({ title: 'Erreur', description: 'Impossible de supprimer la fonction', color: 'red' })
    }
  } else {
    currentFonctions.value.splice(idx, 1)
  }
}

// ── Soumission du formulaire ───────────────────────────────────────────────
const handleSubmit = async () => {
  loading.value      = true
  errors.value       = []
  errorRequest.value = null

  try {
    if (!validateForm()) {
      useToast().add({
        title:       'Erreur de validation',
        description: 'Veuillez remplir tous les champs obligatoires',
        color:       'red',
      })
      return
    }

    const userData = {
      matricule:     form.value.matricule.trim(),
      nom:           form.value.nom.trim(),
      prenom:        form.value.prenoms.trim(),
      email:         form.value.email.trim(),
      telephone:     form.value.telephone?.trim() || null,
      prise_service: form.value.datePriseService  || null,
      is_superadmin: form.value.estAdministrateur,
      statut:        form.value.statut,
      entite_id:     form.value.entite_id,
      is_responsable: form.value.estResponsable,
    }

    // Ajouter le mot de passe seulement si demandé
    if (changePassword.value) {
      userData.password = form.value.password
      userData.password_confirmation = form.value.password_confirmation
    }

    const response = await $fetch(
      `${config.public.apiBase}/users/${userId}`,
      {
        method:  'PUT',
        headers: {
          Authorization:  `Bearer ${authToken.value}`,
          'Content-Type': 'application/json',
          Accept:         'application/json',
        },
        body: JSON.stringify(userData),
      }
    )

    if (response.success || response.data) {
      showSuccessModal.value = true
      useToast().add({ title: 'Succès', description: 'Utilisateur modifié avec succès', color: 'green' })
    } else {
      throw new Error(response.message || 'Erreur lors de la mise à jour')
    }

  } catch (error) {
    errorRequest.value = error
    if (error.data?.errors) {
      errors.value = Object.values(error.data.errors).flat()
      useToast().add({ title: 'Erreur de validation', description: errors.value[0], color: 'red' })
    } else {
      useToast().add({
        title:       'Erreur',
        description: error.data?.message || error.message || 'Une erreur inattendue est survenue.',
        color:       'red',
      })
    }
  } finally {
    loading.value = false
  }
}

const handleCancel = () => navigateTo('/utilisateurs')
</script>