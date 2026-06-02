<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="mx-auto">

      <!-- ── Chargement initial ────────────────────────────────────────────── -->
      <div v-if="initialLoading" class="flex flex-col items-center justify-center py-32 gap-4 text-slate-500">
        <div class="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <span class="text-sm font-medium">Chargement du courrier…</span>
      </div>

      <!-- ── Erreur chargement ─────────────────────────────────────────────── -->
      <div v-else-if="loadError"
        class="flex items-center gap-4 p-5 bg-red-50 border border-red-200 rounded-xl max-w-2xl mx-auto mt-10">
        <Icon name="i-heroicons-exclamation-triangle" class="w-8 h-8 text-red-500 shrink-0" />
        <div class="flex-1">
          <p class="text-sm font-bold text-red-800">Impossible de charger le courrier</p>
          <p class="text-xs text-red-600 mt-0.5">{{ loadError }}</p>
        </div>
        <UButton color="red" variant="outline" size="sm" @click="loadCourrier">Réessayer</UButton>
      </div>

      <!-- ── Formulaire ────────────────────────────────────────────────────── -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-6">

        <!-- Colonne formulaire -->
        <div class="lg:col-span-5">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">

            <!-- En-tête -->
            <div class="mb-6">
              <div class="flex items-center gap-3 mb-1">
                <div
                  class="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow">
                  <Icon name="i-heroicons-pencil-square" class="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 class="text-xl font-bold text-gray-900 leading-tight">Modifier le courrier départ</h1>
                  <p class="text-xs text-gray-500 mt-0.5">
                    N° <span class="font-semibold text-indigo-600">{{ originalData?.document?.numero_enreg }}</span>
                    <span v-if="originalData?.document?.reference" class="ml-2 text-gray-400">·
                      {{ originalData.document.reference }}</span>
                  </p>
                </div>
              </div>
              <div v-if="isRestrictedEditor" class="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                En tant que SP/SA, vous pouvez modifier uniquement la référence et l'objet du courrier. Le remplacement de fichier est réservé aux administrateurs.
              </div>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4">

              <!-- Type de départ -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Type de départ <span class="text-red-600">*</span>
                </label>
                <USelect v-model="form.type_depart" :options="[
                  { label: 'Interne', value: 'interne' },
                  { label: 'Externe', value: 'externe' },
                  ]" class="w-full h-12" :disabled="isRestrictedEditor" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Pièce jointe</label>

                <!-- Fichier existant -->
                <div v-if="existingFilename && !selectedFile"
                  class="mb-2 flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <Icon name="i-heroicons-document-check" class="w-4 h-4 text-emerald-600 shrink-0" />
                  <span class="text-xs text-emerald-700 font-medium truncate flex-1">{{ existingFilename }}</span>
                  <button type="button" @click="triggerFileInput"
                    class="text-xs text-emerald-700 underline hover:no-underline shrink-0"
                    :class="isRestrictedEditor ? 'opacity-50 cursor-not-allowed' : ''">Remplacer</button>
                </div>

                <!-- Sélecteur fichier -->
                <div class="flex gap-2">
                  <input ref="fileInput" type="file" @change="handleFileChange"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" class="hidden" />
                  <UButton @click="triggerFileInput" type="button" color="yellow" variant="outline"
                    icon="heroicons:arrow-up-tray" class="flex-shrink-0"
                    :class="isRestrictedEditor ? 'opacity-50 cursor-not-allowed' : ''" />
                  <div
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-600 truncate flex items-center">
                    {{ selectedFile ? selectedFile.name : (existingFilename ? 'Cliquer pour remplacer le fichier' : 'Aucun fichier sélectionné') }}
                  </div>
                  <!-- Annuler remplacement -->
                  <button v-if="selectedFile" type="button" @click="cancelFileReplacement"
                    class="w-9 h-9 flex items-center justify-center rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                    title="Annuler le remplacement">
                    <Icon name="i-heroicons-x-mark" class="w-4 h-4" />
                  </button>
                </div>
                <p class="text-[11px] text-gray-400 mt-1">
                  Laissez vide pour conserver le fichier actuel. Formats : pdf, doc, docx, jpg, jpeg, png
                </p>
                <p v-if="isRestrictedEditor" class="text-[11px] text-yellow-700 mt-1">Le remplacement de fichier est réservé aux administrateurs.</p>
              </div>

              <!-- Type de document -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Type de document <span class="text-red-600">*</span>
                </label>
                <USelectMenu v-model="selectedDocumentType" :options="filteredDocumentTypes"
                  option-attribute="libelle" placeholder="Rechercher un type…" searchable
                  searchable-placeholder="Rechercher…" class="w-full" :ui="{ height: 'h-[42px]' }"
                  :loading="loadingTypes" @search="searchQuery = $event" :disabled="isRestrictedEditor" />
              </div>

              <!-- Destinataire + Date départ -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Destinataire <span
                      class="text-red-600">*</span></label>
                  <UInput v-model="form.destinataire" placeholder="Nom du destinataire" class="w-full h-12" :disabled="isRestrictedEditor" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Date de départ <span
                      class="text-red-600">*</span></label>
                  <UInput v-model="form.date_depart" type="date" class="w-full h-12" :disabled="isRestrictedEditor" />
                </div>
              </div>

              <!-- Champs document -->
              <div class="pt-4 border-t border-gray-100 space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Numéro d'enregistrement <span
                        class="text-red-600">*</span></label>
                    <UInput v-model="form.numero_enreg" placeholder="Numéro d'enregistrement" class="w-full h-12" :disabled="isRestrictedEditor" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Date d'enregistrement <span
                        class="text-red-600">*</span></label>
                    <UInput v-model="form.date_enreg" type="date" class="w-full h-12" :disabled="isRestrictedEditor" />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Référence <span
                        class="text-red-600">*</span></label>
                    <UInput v-model="form.reference" placeholder="Référence du document" class="w-full h-12" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Date du courrier <span
                        class="text-red-600">*</span></label>
                    <UInput v-model="form.date_courier" type="date" class="w-full h-12" :disabled="isRestrictedEditor" />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Objet <span
                      class="text-red-600">*</span></label>
                  <UTextarea :rows="3" size="lg" v-model="form.objet" placeholder="Objet du courrier" :disabled="false" />
                </div>

                <!-- Initiateurs -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Initiateurs <span
                      class="text-red-600">*</span></label>
                  <USelectMenu v-model="selectedInitiateurs" :options="utilisateurs" option-attribute="display_name"
                    placeholder="Rechercher un initiateur…" class="w-full" multiple searchable
                    searchable-placeholder="Nom, prénom ou entité…" :loading="loadingUsers"
                    :ui="{ height: 'h-[42px]' }" :disabled="isRestrictedEditor" />
                  <!-- Tags initiateurs sélectionnés -->
                  <div v-if="selectedInitiateurs.length > 0" class="flex flex-wrap gap-1.5 mt-2">
                    <span v-for="init in selectedInitiateurs" :key="init.id"
                      class="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full">
                      {{ init.display_name }}
                      <button v-if="!isRestrictedEditor" type="button"
                        @click="selectedInitiateurs = selectedInitiateurs.filter(i => i.id !== init.id)">
                        <Icon name="i-heroicons-x-mark" class="w-3 h-3 hover:text-indigo-900" />
                      </button>
                    </span>
                  </div>
                  <p v-else class="text-xs text-gray-500 mt-1">Sélectionnez un ou plusieurs initiateurs</p>
                </div>

                <!-- Options -->
                <!-- <div class="flex flex-wrap items-center gap-4 pt-1">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <UToggle v-model="form.confidentiel" />
                    <span class="text-sm text-gray-700 select-none">Confidentiel</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <UToggle v-model="form.large_diffusion" />
                    <span class="text-sm text-gray-700 select-none">Large diffusion</span>
                  </label>
                </div> -->
              </div>

              <!-- Boutons -->
              <div class="flex justify-center space-x-4 pt-6 border-t border-gray-200">
                <UButton type="button" @click="handleCancel" color="gray" variant="outline">ANNULER</UButton>
                <UButton type="submit" :disabled="!isFormValid || loading" :loading="loading"
                  class="bg-gradient-to-br from-emerald-800 to-blue-800 text-white dark:text-white">
                  ENREGISTRER LES MODIFICATIONS
                </UButton>
              </div>

              <!-- Erreurs validation -->
              <div v-if="errors.length > 0" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <ul class="list-disc list-inside text-sm text-red-600 space-y-1">
                  <li v-for="(err, i) in errors" :key="i">{{ err }}</li>
                </ul>
              </div>

              <!-- Erreur requête -->
              <div v-if="errorRequest" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-sm font-medium text-red-700">
                  {{ errorRequest.data?.message || errorRequest.message || 'Erreur inconnue' }}
                </p>
                <ul v-if="errorRequest.data?.errors" class="mt-2 list-disc list-inside text-xs text-red-500">
                  <li v-for="(msgs, field) in errorRequest.data.errors" :key="field">
                    <span class="font-medium">{{ field }}</span> : {{ Array.isArray(msgs) ? msgs.join(', ') : msgs }}
                  </li>
                </ul>
              </div>

            </form>
          </div>
        </div>

        <!-- Colonne aperçu -->
        <div class="lg:col-span-6">

          <!-- Aperçu nouveau fichier sélectionné -->
          <DocumentPreview v-if="selectedFile" :selected-file="selectedFile" :file-preview-url="newFilePreviewUrl" />

          <!-- Aperçu fichier existant -->
          <div v-else-if="existingFilename" class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div
              class="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-100">
              <div class="flex items-center gap-2">
                <Icon name="i-heroicons-document-text" class="w-4 h-4 text-slate-500" />
                <span class="text-xs font-semibold text-slate-600 uppercase tracking-wider">Document actuel</span>
              </div>
              <div class="flex items-center gap-2">
                <!-- Bouton charger -->
                <button v-if="!existingFileLoaded && !existingFileLoading && !existingFileError"
                  @click="loadExistingFile"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-all">
                  <Icon name="i-heroicons-document-arrow-down" class="w-3.5 h-3.5" />Charger l'aperçu
                </button>
                <div v-else-if="existingFileLoading"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400">
                  <div class="w-3.5 h-3.5 border-2 border-slate-200 border-t-emerald-500 rounded-full animate-spin">
                  </div>Chargement…
                </div>
                <div v-else-if="existingFileError"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg">
                  <Icon name="i-heroicons-exclamation-triangle" class="w-3.5 h-3.5" />{{ existingFileError }}
                  <button @click="existingFileError = ''; loadExistingFile()"
                    class="ml-1 underline">Réessayer</button>
                </div>
                <div v-else-if="existingFileLoaded"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <Icon name="i-heroicons-check-circle" class="w-3.5 h-3.5" />Document chargé
                </div>
              </div>
            </div>

            <!-- Placeholder avant chargement -->
            <div v-if="!existingFileLoaded"
              class="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
              <Icon name="i-heroicons-document-magnifying-glass" class="w-12 h-12 opacity-30" />
              <p class="text-sm">Cliquez sur « Charger l'aperçu » pour visualiser le document actuel</p>
            </div>

            <!-- Aperçu chargé -->
            <div v-else class="p-4">
              <DocumentRpreview :file-preview-url="existingBlobUrl" height="600px" />
            </div>
          </div>

          <!-- Aucun document -->
          <div v-else
            class="flex flex-col items-center justify-center py-20 gap-3 text-slate-400 bg-white rounded-lg shadow-sm border border-gray-200">
            <Icon name="i-heroicons-document-plus" class="w-12 h-12 opacity-30" />
            <p class="text-sm">Aucun document — ajoutez une pièce jointe</p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import Swal from 'sweetalert2'
import { useAuth } from '~/composables/auth/useAuth'
import DocumentPreview from '~/components/DocumentPreview.vue'
import DocumentRpreview from '~/components/DocumentRpreview.vue'

useHead({ title: 'Modifier Courrier Départ - SAGAR' })

const route = useRoute()
const toast = useToast()
const config = useRuntimeConfig()

const courrierDepartId = computed(() => route.params.id)

// ── État général ──────────────────────────────────────────────────────────────
const initialLoading = ref(true)
const loadError      = ref(null)
const loading        = ref(false)
const loadingTypes   = ref(false)
const loadingUsers   = ref(false)
const authToken      = ref('')
const errors         = ref([])
const errorRequest   = ref(null)
const originalData   = ref(null)
const { isAdmin, isSP, isSA } = useAuth()
const isRestrictedEditor = computed(() => !isAdmin() && (isSP() || isSA()))

// ── Fichier ───────────────────────────────────────────────────────────────────
const fileInput      = ref(null)
const selectedFile   = ref(null)
const existingFilename = ref('')          // nom du fichier stocké en BDD
const existingDateEnreg = ref('')        // pour reconstruire l'URL du fichier existant

// Aperçu fichier existant (blob)
const existingFileLoaded  = ref(false)
const existingFileLoading = ref(false)
const existingFileError   = ref('')
const existingBlobUrl     = ref('')

// ── Types de documents ────────────────────────────────────────────────────────
const documentTypes       = ref([])
const selectedDocumentType = ref(null)
const searchQuery         = ref('')

const filteredDocumentTypes = computed(() => {
  if (!searchQuery.value) return documentTypes.value
  const q = searchQuery.value.toLowerCase()
  return documentTypes.value.filter(t => t.libelle?.toLowerCase().includes(q))
})

watch(selectedDocumentType, (val) => {
  form.value.type_document_id = val?.id ?? null
})

// ── Utilisateurs ──────────────────────────────────────────────────────────────
const utilisateurs        = ref([])
const selectedInitiateurs = ref([])

// ── Formulaire ────────────────────────────────────────────────────────────────
const form = ref({
  type_depart:      'externe',
  numero_enreg:     '',
  date_enreg:       '',
  reference:        '',
  date_courier:     '',
  objet:            '',
  large_diffusion:  false,
  confidentiel:     false,
  type_document_id: null,
  date_depart:      '',
  destinataire:     '',
  service_emis:     '',
})

// ── Preview nouveau fichier ───────────────────────────────────────────────────
const newFilePreviewUrl = computed(() => {
  if (!selectedFile.value) return null
  return URL.createObjectURL(selectedFile.value)
})

watch(newFilePreviewUrl, (newUrl, oldUrl) => {
  if (oldUrl) URL.revokeObjectURL(oldUrl)
})

onUnmounted(() => {
  if (newFilePreviewUrl.value) URL.revokeObjectURL(newFilePreviewUrl.value)
  if (existingBlobUrl.value)   URL.revokeObjectURL(existingBlobUrl.value)
})

// ── Validation ────────────────────────────────────────────────────────────────
const isFormValid = computed(() =>
  form.value.numero_enreg     !== '' &&
  form.value.date_enreg       !== '' &&
  form.value.reference        !== '' &&
  form.value.date_courier     !== '' &&
  form.value.objet            !== '' &&
  form.value.type_document_id !== null &&
  form.value.type_depart      !== '' &&
  form.value.date_depart      !== '' &&
  form.value.destinataire     !== '' &&
  selectedInitiateurs.value.length > 0
)

const validateForm = () => {
  const newErrors = []
  if (!form.value.numero_enreg)     newErrors.push("Le numéro d'enregistrement est obligatoire.")
  if (!form.value.date_enreg)       newErrors.push("La date d'enregistrement est obligatoire.")
  if (!form.value.reference)        newErrors.push('La référence est obligatoire.')
  if (!form.value.date_courier)     newErrors.push('La date du courrier est obligatoire.')
  if (!form.value.objet)            newErrors.push("L'objet est obligatoire.")
  if (!form.value.type_document_id) newErrors.push('Le type de document est obligatoire.')
  if (!form.value.type_depart)      newErrors.push('Le type de départ est obligatoire.')
  if (!form.value.date_depart)      newErrors.push('La date de départ est obligatoire.')
  if (!form.value.destinataire)     newErrors.push('Le destinataire est obligatoire.')
  if (!selectedInitiateurs.value.length) newErrors.push('Au moins un initiateur est requis.')
  errors.value = newErrors
  return newErrors.length === 0
}

// ── Helpers fichier ───────────────────────────────────────────────────────────
const guessMimeType = (filename) => {
  if (!filename) return ''
  const ext = (filename.split('.').pop() || '').toLowerCase()
  return { pdf: 'application/pdf', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp' }[ext] || ''
}

const buildDocumentUrl = (filename, dateEnreg) => {
  if (!filename || filename === 'Inconnu') return null
  const base = config.public.apiBase.replace(/\/$/, '')
  const f    = filename.startsWith('/') ? filename.slice(1) : filename
  if (!dateEnreg) return `${base}/file/documents/${f}`
  const d = new Date(dateEnreg)
  return `${base}/file/documents/${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${f}`
}

const loadExistingFile = async () => {
  if (!existingFilename.value) return
  existingFileLoading.value = true
  existingFileLoaded.value  = false
  existingFileError.value   = ''
  if (existingBlobUrl.value) { URL.revokeObjectURL(existingBlobUrl.value); existingBlobUrl.value = '' }
  try {
    const url = buildDocumentUrl(existingFilename.value, existingDateEnreg.value)
    if (!url) throw new Error("URL du fichier introuvable")
    const res = await fetch(url, { headers: { Authorization: `Bearer ${authToken.value}` } })
    if (!res.ok) throw new Error(`Erreur ${res.status} — fichier non accessible`)
    const blob = await res.blob()
    existingBlobUrl.value  = URL.createObjectURL(blob)
    existingFileLoaded.value = true
  } catch (err) {
    existingFileError.value = err.message || 'Erreur lors du chargement'
  } finally {
    existingFileLoading.value = false
  }
}

// ── Chargement courrier ───────────────────────────────────────────────────────
const loadCourrier = async () => {
  initialLoading.value = true
  loadError.value      = null
  try {
    const base     = config.public.apiBase.replace(/\/$/, '')
    const response = await $fetch(`${base}/courriers-departs/${courrierDepartId.value}`, {
      headers: { Authorization: `Bearer ${authToken.value}` },
    })

    const courrier = response.data
    originalData.value = courrier

    // Remplissage formulaire
    const doc = courrier.document || {}
    form.value = {
      type_depart:      courrier.type_depart      || 'externe',
      numero_enreg:     doc.numero_enreg          || '',
      date_enreg:       doc.date_enreg            ? doc.date_enreg.split('T')[0] : '',
      reference:        doc.reference             || '',
      date_courier:     doc.date_courrier         ? doc.date_courrier.split('T')[0] : '',
      objet:            doc.objet                 || '',
      large_diffusion:  doc.large_diffusion       || false,
      confidentiel:     courrier.confidentiel     || false,
      type_document_id: doc.type_document?.id     || doc.type_document_id || null,
      date_depart:      courrier.date_depart      ? courrier.date_depart.split('T')[0] : '',
      destinataire:     courrier.destinataire     || '',
      service_emis:     courrier.service_emis     || '',
    }

    // Fichier existant
    existingFilename.value  = (doc.url && doc.url !== 'Inconnu') ? doc.url : ''
    existingDateEnreg.value = doc.date_enreg || ''

    // Type de document pré-sélectionné
    if (doc.type_document) {
      selectedDocumentType.value = doc.type_document
    } else if (form.value.type_document_id) {
      // On le retrouvera dans la liste après loadDocumentTypes
      _pendingTypeDocumentId = form.value.type_document_id
    }

    // Initiateurs pré-sélectionnés (on les reconstruit après loadUtilisateurs)
    _pendingInitiateurIds = (courrier.initiateurs || []).map(i => i.pivot?.entite_user_id || i.id)

  } catch (err) {
    console.error('❌ Erreur chargement courrier:', err)
    loadError.value = err.message || 'Erreur lors du chargement'
  } finally {
    initialLoading.value = false
  }
}

// IDs en attente de réconciliation après chargement des listes
let _pendingTypeDocumentId = null
let _pendingInitiateurIds  = []

// ── Chargement types de documents ────────────────────────────────────────────
const loadDocumentTypes = async () => {
  loadingTypes.value = true
  try {
    const response = await $fetch(`${config.public.apiBase}/type_documents`, {
      headers: { Authorization: `Bearer ${authToken.value}` },
    })
    documentTypes.value = response?.data || response || []

    // Réconcilier le type de document si pas encore résolu
    if (_pendingTypeDocumentId && !selectedDocumentType.value) {
      const found = documentTypes.value.find(t => t.id === _pendingTypeDocumentId)
      if (found) selectedDocumentType.value = found
    }
  } catch (err) {
    console.error('Erreur types de documents:', err)
    toast.add({ title: 'Erreur', description: 'Impossible de charger les types de documents', color: 'red', timeout: 3000 })
  } finally {
    loadingTypes.value = false
  }
}

// ── Chargement utilisateurs ───────────────────────────────────────────────────
const loadUtilisateurs = async () => {
  loadingUsers.value = true
  try {
    const response = await $fetch(`${config.public.apiBase}/entite-users`, {
      headers: { Authorization: `Bearer ${authToken.value}` },
    })
    const data = response?.data || response || []
    utilisateurs.value = data.map(user => ({
      id:           user.id,
      display_name: `${user.user?.nom || ''} ${user.user?.prenom || ''} — ${user.entite?.code || user.entite?.libelle || ''}`.trim(),
    }))

    // Réconcilier les initiateurs pré-sélectionnés
    if (_pendingInitiateurIds.length) {
      selectedInitiateurs.value = utilisateurs.value.filter(u => _pendingInitiateurIds.includes(u.id))
    }
  } catch (err) {
    console.error('Erreur chargement utilisateurs:', err)
    toast.add({ title: 'Erreur', description: 'Impossible de charger la liste des initiateurs', color: 'red', timeout: 3000 })
  } finally {
    loadingUsers.value = false
  }
}

// ── Handlers fichier ──────────────────────────────────────────────────────────
const triggerFileInput = () => {
  if (isRestrictedEditor.value) {
    Swal.fire({
      title: 'Modification réservée',
      text: 'Le remplacement du fichier est réservé aux administrateurs. Contactez l’administrateur système.',
      icon: 'warning',
      confirmButtonText: 'OK',
    })
    return
  }
  fileInput.value?.click()
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) selectedFile.value = file
}

const cancelFileReplacement = () => {
  selectedFile.value = null
  if (fileInput.value) fileInput.value.value = ''
}

// ── Construction FormData ─────────────────────────────────────────────────────
const buildFormData = () => {
  const fd = new FormData()
  fd.append('_method',          'PUT')           // pour les serveurs qui ne supportent pas PUT natif
  fd.append('numero_enreg',     form.value.numero_enreg)
  fd.append('date_enreg',       form.value.date_enreg)
  fd.append('reference',        form.value.reference)
  fd.append('date_courrier',    form.value.date_courier)
  fd.append('date_depart',      form.value.date_depart)
  fd.append('objet',            form.value.objet)
  fd.append('large_diffusion',  form.value.large_diffusion  ? '1' : '0')
  fd.append('confidentiel',     form.value.confidentiel     ? '1' : '0')
  fd.append('type_document_id', String(form.value.type_document_id))
  fd.append('type_depart',      form.value.type_depart)
  fd.append('service_emis',     form.value.service_emis || 'Non défini')
  fd.append('destinataire',     form.value.destinataire)

  // Fichier uniquement si remplacé
  if (selectedFile.value) fd.append('fichier', selectedFile.value)

  // Initiateurs
  selectedInitiateurs.value.forEach((init, i) => fd.append(`initiateurs[${i}]`, init.id))

  return fd
}

// ── Soumission ────────────────────────────────────────────────────────────────
const handleSubmit = async () => {
  errors.value       = []
  errorRequest.value = null

  if (!validateForm()) {
    toast.add({ title: 'Erreur de validation', description: 'Veuillez remplir tous les champs obligatoires', color: 'red' })
    return
  }

  loading.value = true
  try {
    const base = config.public.apiBase.replace(/\/$/, '')
    const fd   = buildFormData()

    // Laravel accepte POST + _method=PUT pour les FormData avec fichiers
    const response = await $fetch(`${base}/courriers-departs/${courrierDepartId.value}`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${authToken.value}` },
      body:    fd,
    })

    if (!response.success) throw new Error(response.message || 'Erreur lors de la modification')

    toast.add({
      title:       'Courrier modifié',
      description: 'Le courrier départ a été mis à jour avec succès',
      color:       'green',
      icon:        'i-heroicons-check-circle',
    })

    navigateTo('/documents')

  } catch (err) {
    console.error('❌ Erreur modification:', err)
    errorRequest.value = err

    const description = err.data?.errors
      ? Object.values(err.data.errors).flat().join(' | ')
      : err.data?.message || err.message || 'Une erreur inattendue est survenue.'

    toast.add({ title: 'Erreur de soumission', description, color: 'red' })
  } finally {
    loading.value = false
  }
}

const handleCancel = () => navigateTo('/documents')

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(async () => {
  if (process.client) authToken.value = localStorage.getItem('auth_token') || ''

  // On charge tout en parallèle ; loadCourrier peuple _pendingInitiateurIds
  // et _pendingTypeDocumentId, puis les deux autres les résolvent.
  await Promise.all([loadCourrier(), loadDocumentTypes(), loadUtilisateurs()])
})
</script>