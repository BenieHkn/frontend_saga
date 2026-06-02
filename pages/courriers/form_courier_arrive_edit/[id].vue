<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto p-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left Column: Form -->
        <div class="lg:col-span-6">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">

            <PageHeader title="Modifier un Courrier Arrivé" subtitle="Modification du courrier enregistré" />

            <div v-if="loadingCourrier" class="flex items-center justify-center py-16">
              <div class="text-center">
                <div class="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
                <p class="text-sm text-slate-500">Chargement du courrier...</p>
              </div>
            </div>

            <form v-else @submit.prevent="handleSubmit" class="space-y-4">
              <!-- Type d'arrivée -->
              <div v-if="isRestrictedEditor" class="mb-4 p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-sm text-yellow-800">
              En tant que secrétaire SP/SA, vous pouvez modifier uniquement la référence et l'objet du courrier. Le remplacement de fichier est réservé aux administrateurs.
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Type d'arrivée *</label>
                  <USelect v-model="form.type_arrivee" :options="[
                    { label: 'Directe', value: 'directe' },
                    { label: 'Par CAB', value: 'cab' },
                    { label: 'Par SGM', value: 'sgm' },
                    { label: 'Par Autres', value: 'autre' },
                  ]" class="w-full h-12" :disabled="isRestrictedEditor" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Priorité *</label>
                  <USelect v-model="form.priorite" :options="[
                    { label: 'URGENT', value: 'URGENT' },
                    { label: 'IMPORTANT', value: 'IMPORTANT' },
                    { label: 'STANDARD', value: 'STANDARD' },
                  ]" class="w-full h-12" :disabled="isRestrictedEditor" />
                </div>
              </div>

              <!-- Upload et Type de Document -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Pièce jointe <span class="text-gray-400 text-xs">(laisser vide pour conserver l'actuelle)</span>
                  </label>
                  <div class="relative">
                    <input ref="fileInput" type="file" @change="handleFileChange"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" class="hidden" />
                    <div class="flex gap-2">
                      <UButton @click="handleFileUploadClick" type="button" color="yellow" variant="outline"
                        icon="heroicons:arrow-up-tray" class="flex-shrink-0"
                        :class="isRestrictedEditor ? 'opacity-50 cursor-not-allowed' : ''" />
                      <div
                        class="flex-1 text-xs px-3 py-1 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-600 truncate flex items-center">
                        {{ selectedFile ? selectedFile.name : fichierActuel ? '📎 Fichier existant' : 'Aucun fichier' }}
                      </div>
                    </div>
                    <p v-if="isRestrictedEditor" class="mt-2 text-xs text-yellow-700">Le remplacement du fichier est réservé aux administrateurs.</p>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Type de document *</label>
                  <USelectMenu
                    v-model="form.type_document_id"
                    :options="documentTypes"
                    value-attribute="id"
                    option-attribute="libelle"
                    placeholder="Sélectionner le type"
                    class="w-full"
                    :ui="{ height: 'h-[42px]' }"
                    :loading="loadingTypes"
                    :disabled="isRestrictedEditor"
                  />
                </div>
              </div>

              <!-- Structure conditionnelle -->
              <div v-if="form.type_arrivee !== 'autre'">
                <label class="block text-sm font-medium text-gray-700 mb-2">Structure</label>
                <UInput v-model="form.structure" placeholder="Nom de la structure" class="w-full h-12" :disabled="isRestrictedEditor" />
              </div>
              <div v-if="form.type_arrivee === 'autre'">
                <label class="block text-sm font-medium text-gray-700 mb-2">Autre Structure</label>
                <UInput v-model="form.autre_structure" placeholder="Précisez la structure" class="w-full h-12" :disabled="isRestrictedEditor" />
              </div>
              <!-- Champs CAB -->
              <div v-if="form.type_arrivee === 'cab'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Numéro CAB</label>
                  <UInput v-model="form.num_cab" class="w-full h-12" :disabled="isRestrictedEditor" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Date CAB</label>
                  <UInput v-model="form.date_cab" type="date" class="w-full h-12" :disabled="isRestrictedEditor" />
                </div>
              </div>

              <!-- Champs SGM -->
              <div v-if="form.type_arrivee === 'cab' || form.type_arrivee === 'sgm'"
                class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Numéro d'Enregistrement SGM</label>
                  <UInput v-model="form.num_sgm" class="w-full h-12" :disabled="isRestrictedEditor" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Date SGM</label>
                  <UInput v-model="form.date_sgm" type="date" class="w-full h-12" :disabled="isRestrictedEditor" />
                </div>
              </div>

              <!-- Champs communs -->
              <div class="pt-4 border-t border-gray-100 space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">N° d'enregistrement *</label>
                    <UInput v-model="form.numero_enreg" placeholder="Numéro d'enregistrement" class="w-full h-12" :disabled="isRestrictedEditor" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Date d'enregistrement *</label>
                    <UInput v-model="form.date_enreg" type="date" class="w-full h-12" :disabled="isRestrictedEditor" />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="flex items-center space-x-2">
                    <UCheckbox v-model="sansReference" label="Sans référence" />
                  </div>
                  <div v-if="!sansReference">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Référence</label>
                    <UInput v-model="form.reference" placeholder="Référence du document" class="w-full h-12" />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Date du courrier *</label>
                  <UInput v-model="form.date_courier" type="date" class="w-full h-12" :disabled="isRestrictedEditor" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Objet *</label>
                  <UInput v-model="form.objet" placeholder="Objet du courrier" class="w-full h-12" />
                </div>

                <div class="flex items-center space-x-2">
                  <UCheckbox v-model="form.large_diffusion" label="Large diffusion" :disabled="isRestrictedEditor" />
                </div>
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
                  ENREGISTRER LES MODIFICATIONS
                </UButton>
              </div>

              <!-- Erreurs -->
              <div v-if="errors.length > 0" class="mt-4">
                <ul class="list-disc list-inside text-sm text-red-600">
                  <li v-for="(err, index) in errors" :key="index">{{ err }}</li>
                </ul>
              </div>

              <div v-if="errorRequest" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-sm text-red-600">
                  Une erreur est survenue :
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

        <!-- Right Column: Preview -->
        <div class="lg:col-span-6">
          <DocumentPreview :selected-file="selectedFile" :file-preview-url="filePreviewUrl" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import { useAuth } from '~/composables/auth/useAuth'

useHead({ title: 'Modifier un Courrier Arrivé - SAGA' })

const config = useRuntimeConfig()
const toast = useToast()
const route = useRoute()

const courrierId = route.params.id

// ── État ──────────────────────────────────────────────────────────────────────
const selectedFile = ref(null)
const fileInput = ref(null)
const loading = ref(false)
const loadingCourrier = ref(false)
const loadingTypes = ref(false)
const authToken = ref('')
const errorRequest = ref(null)
const sansReference = ref(false)
const documentTypes = ref([])
const errors = ref([])
const fichierActuel = ref(null) // URL du fichier existant
const { isAdmin, isSP, isSA } = useAuth()
const isRestrictedEditor = computed(() => !isAdmin() && (isSP() || isSA()))

// ── Formulaire ────────────────────────────────────────────────────────────────
const form = ref({
  type_arrivee: 'directe',
  priorite: 'STANDARD',
  numero_enreg: '',
  date_enreg: new Date().toISOString().split('T')[0],
  reference: '',
  date_courier: '',
  objet: '',
  large_diffusion: false,
  fichier: null,
  type_document_id: null,
  structure: '',
  num_cab: '',
  date_cab: '',
  num_sgm: '',
  date_sgm: '',
  autre_structure: '',
  confidentiel: false,
  service_enreg: '',
  statut: 'en_attente',
  observation: '',
})

// ── Computed ──────────────────────────────────────────────────────────────────
const filePreviewUrl = computed(() => {
  if (selectedFile.value) return URL.createObjectURL(selectedFile.value)
  return fichierActuel.value || null
})

const isFormValid = computed(() => {
  return (
    form.value.numero_enreg !== '' &&
    form.value.date_enreg !== '' &&
    form.value.date_courier !== '' &&
    form.value.objet !== '' &&
    form.value.type_document_id !== null &&
    form.value.type_arrivee !== '' &&
    form.value.priorite !== ''
    // fichier non obligatoire en édition (on garde l'existant)
  )
})

// ── Watchers ──────────────────────────────────────────────────────────────────
watch(sansReference, (val) => {
  if (val) form.value.reference = ''
})

onUnmounted(() => {
  if (selectedFile.value) URL.revokeObjectURL(filePreviewUrl.value)
})

// ── Chargement du courrier existant ──────────────────────────────────────────
const loadCourrier = async () => {
  loadingCourrier.value = true
  try {
    const response = await $fetch(`${config.public.apiBase}/courriers-arrives/${courrierId}`, {
      headers: { Authorization: `Bearer ${authToken.value}` },
    })

    const courrier = response.data || response

    // Pré-remplir le formulaire
    form.value = {
      type_arrivee:    courrier.type_arrivee || 'directe',
      priorite:        courrier.priority || 'STANDARD',
      numero_enreg:    courrier.document?.numero_enreg || '',
      date_enreg:      courrier.document?.date_enreg?.split('T')[0] || '',
      reference:       courrier.document?.reference === 'sans reference' ? '' : (courrier.document?.reference || ''),
      date_courier:    courrier.document?.date_courrier?.split('T')[0] || '',
      objet:           courrier.document?.objet || '',
      large_diffusion: courrier.document?.large_diffusion || false,
      fichier:         null,
      type_document_id: courrier.document?.type_document_id || null,
      structure:       courrier.structure || '',
      num_cab:         courrier.num_cab || '',
      date_cab:        courrier.date_cab?.split('T')[0] || '',
      num_sgm:         courrier.num_sgm || '',
      date_sgm:        courrier.date_sgm?.split('T')[0] || '',
      autre_structure: courrier.autre_structure || '',
      confidentiel:    courrier.document?.confidentiel || false,
      service_enreg:   courrier.service_enreg || '',
      statut:          courrier.statut || 'en_attente',
      observation:     courrier.observation || '',
    }

    // Gérer "sans référence"
    if (!courrier.document?.reference || courrier.document?.reference === 'sans reference') {
      sansReference.value = true
    }

    // Conserver l'URL du fichier actuel pour la prévisualisation
    if (courrier.document?.url) {
      fichierActuel.value = `${config.public.baseUrl}${courrier.document.url}`
    }

    console.log('✅ Courrier chargé:', courrier)

  } catch (err) {
    console.error('❌ Erreur chargement courrier:', err)
    toast.add({
      title: 'Erreur',
      description: 'Impossible de charger le courrier',
      color: 'red',
    })
    navigateTo('/documents')
  } finally {
    loadingCourrier.value = false
  }
}

// ── Chargement des types de documents ────────────────────────────────────────
const loadDocumentTypes = async () => {
  loadingTypes.value = true
  try {
    const response = await $fetch(`${config.public.apiBase}/type_documents`, {
      headers: { Authorization: `Bearer ${authToken.value}` },
    })
    documentTypes.value = response?.data || response || []
  } catch (err) {
    console.error('Erreur types de documents:', err)
    toast.add({ title: 'Erreur', description: 'Impossible de charger les types de documents', color: 'red' })
  } finally {
    loadingTypes.value = false
  }
}

// ── Validation ────────────────────────────────────────────────────────────────
const validateForm = () => {
  const newErrors = []
  if (!form.value.numero_enreg)    newErrors.push("Le numéro d'enregistrement est obligatoire.")
  if (!form.value.date_enreg)      newErrors.push("La date d'enregistrement est obligatoire.")
  if (!form.value.date_courier)    newErrors.push("La date du courrier est obligatoire.")
  if (!form.value.objet)           newErrors.push("L'objet est obligatoire.")
  if (!form.value.type_document_id) newErrors.push("Le type de document est obligatoire.")
  if (!form.value.type_arrivee)    newErrors.push("Le type d'arrivée est obligatoire.")
  if (!form.value.priorite)        newErrors.push("La priorité est obligatoire.")
  errors.value = newErrors
  return newErrors.length === 0
}

// ── Handlers ──────────────────────────────────────────────────────────────────
const handleFileUploadClick = () => {
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
  if (file) {
    selectedFile.value = file
    form.value.fichier = file
  }
}

const handleSubmit = async () => {
  loading.value = true
  errors.value = []
  errorRequest.value = null

  try {
    if (!validateForm()) {
      toast.add({
        title: 'Erreur de validation',
        description: 'Veuillez remplir tous les champs obligatoires',
        color: 'red',
      })
      return
    }

    const formData = new FormData()
    formData.append('_method', 'PUT') // Laravel method spoofing pour FormData

    formData.append('numero_enreg',    form.value.numero_enreg)
    formData.append('date_enreg',      form.value.date_enreg)
    formData.append('reference',       sansReference.value ? 'sans reference' : (form.value.reference || 'sans reference'))
    formData.append('date_courrier',   form.value.date_courier)
    formData.append('objet',           form.value.objet)
    formData.append('large_diffusion', form.value.large_diffusion ? '1' : '0')
    formData.append('type_document_id', String(form.value.type_document_id))
    formData.append('type_arrivee',    form.value.type_arrivee)
    formData.append('confidentiel',    form.value.confidentiel ? '1' : '0')
    formData.append('service_enreg',   form.value.service_enreg)
    formData.append('priority',        form.value.priorite)
    formData.append('statut',          form.value.statut)

    // Fichier uniquement si un nouveau est sélectionné
    if (selectedFile.value) {
      formData.append('fichier', selectedFile.value)
    }

    if (form.value.type_arrivee !== 'autre' && form.value.structure) {
      formData.append('structure', form.value.structure)
    }
    if (form.value.type_arrivee === 'autre' && form.value.autre_structure) {
      formData.append('autre_structure', form.value.autre_structure)
    }
    if (form.value.type_arrivee === 'cab') {
      if (form.value.num_cab)  formData.append('num_cab', form.value.num_cab)
      if (form.value.date_cab) formData.append('date_cab', form.value.date_cab)
    }
    if (form.value.type_arrivee === 'cab' || form.value.type_arrivee === 'sgm') {
      if (form.value.num_sgm)  formData.append('num_sgm', form.value.num_sgm)
      if (form.value.date_sgm) formData.append('date_sgm', form.value.date_sgm)
    }

    const response = await $fetch(`${config.public.apiBase}/courriers-arrives/${courrierId}`, {
      method: 'POST', // POST + _method=PUT pour FormData
      headers: { Authorization: `Bearer ${authToken.value}` },
      body: formData,
    })

    if (response.success || response.data) {
      toast.add({
        title: 'Succès',
        description: 'Le courrier a été modifié avec succès',
        color: 'green',
      })
      navigateTo('/documents')
    }

  } catch (err) {
    console.error('❌ Erreur modification:', err)
    errorRequest.value = err

    const description = err.data?.errors
      ? Object.values(err.data.errors).flat().join(' | ')
      : err.data?.message || err.message || 'Une erreur inattendue est survenue.'

    toast.add({ title: 'Erreur', description, color: 'red' })
  } finally {
    loading.value = false
  }
}

const handleCancel = () => navigateTo('/courriers')

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(async () => {
  if (process.client) {
    authToken.value = localStorage.getItem('auth_token') || ''
  }

  if (!courrierId) {
    toast.add({ title: 'Erreur', description: 'ID du courrier manquant', color: 'red' })
    navigateTo('/documents')
    return
  }

  await Promise.all([
    loadCourrier(),
    loadDocumentTypes(),
  ])
})
</script>