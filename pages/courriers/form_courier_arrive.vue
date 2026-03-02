<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto p-6">
      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left Column: Form (col-6) -->
        <div class="lg:col-span-6">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">

            <PageHeader title="Formulaire de Courriers Arrivés" subtitle="Gestion et suivi des courriers sortants"
              to="/courriers/form_courrier_depart" btn-text="Nouveau courrier" />

            <form @submit.prevent="handleSubmit" class="space-y-4">
              <!-- Type d'arrivée -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Type d'arrivée *
                  </label>
                  <USelect v-model="form.type_arrivee" :options="[
                    { label: 'Directe', value: 'directe' },
                    { label: 'Par CAB', value: 'cab' },
                    { label: 'Par SGM', value: 'sgm' },
                    { label: 'Par Autres', value: 'autre' },
                  ]" class="w-full h-12" />
                </div>

                <!-- Priorité -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Priorité *
                  </label>
                  <USelect v-model="form.priorite" :options="[
                    { label: 'Standard', value: 'standard' },
                    { label: 'Urgent', value: 'urgent' },
                    { label: 'Important', value: 'important' },
                  ]" class="w-full h-12" />
                </div>
              </div>

              <!-- Upload et Type de Document -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Pièce jointe *
                  </label>
                  <div class="relative">
                    <input ref="fileInput" type="file" @change="handleFileChange"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" class="hidden" />
                    <div class="flex gap-2">
                      <UButton @click="$refs.fileInput.click()" type="button" color="yellow" variant="outline"
                        icon="heroicons:arrow-up-tray" class="flex-shrink-0">
                      </UButton>
                      <div
                        class="flex-1 text-xs px-3 py-1 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-600 truncate flex items-center">
                        {{ selectedFile ? selectedFile.name : "Aucun fichier sélectionné" }}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Type de document *
                  </label>
                  <USelectMenu
                    v-model="form.type_document_id"
                    :options="documentTypes"
                    value-attribute="id"
                    option-attribute="libelle"
                    placeholder="Sélectionner le type"
                    class="w-full"
                    :ui="{ height: 'h-[42px]' }"
                    :loading="loadingTypes"
                  />
                  <p v-if="documentTypes.length === 0 && !loadingTypes" class="text-xs text-amber-600 mt-1">
                    Aucun type de document disponible
                  </p>
                </div>
              </div>

              <!-- Structure conditionnelle -->
              <div v-if="form.type_arrivee !== 'autre'">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Structure
                </label>
                <UInput v-model="form.structure" placeholder="Nom de la structure" class="w-full h-12" />
              </div>

              <div v-if="form.type_arrivee === 'autre'">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Autre Structure
                </label>
                <UInput v-model="form.autre_structure" placeholder="Précisez la structure" class="w-full h-12" />
              </div>

              <!-- Champs CAB -->
              <div v-if="form.type_arrivee === 'cab'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Numéro CAB</label>
                  <UInput v-model="form.num_cab" class="w-full h-12" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Date CAB</label>
                  <UInput v-model="form.date_cab" type="date" class="w-full h-12" />
                </div>
              </div>

              <!-- Champs SGM -->
              <div v-if="form.type_arrivee === 'cab' || form.type_arrivee === 'sgm'"
                class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Numéro d'Enregistrement SGM</label>
                  <UInput v-model="form.num_sgm" class="w-full h-12" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Date SGM</label>
                  <UInput v-model="form.date_sgm" type="date" class="w-full h-12" />
                </div>
              </div>

              <!-- Champs communs -->
              <div class="pt-4 border-t border-gray-100 space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">N° d'enregistrement *</label>
                    <UInput v-model="form.numero_enreg" placeholder="Numéro d'enregistrement" class="w-full h-12" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Date d'enregistrement *</label>
                    <UInput v-model="form.date_enreg" type="date" class="w-full h-12" />
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
                  <UInput v-model="form.date_courier" type="date" class="w-full h-12" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Objet *</label>
                  <UInput v-model="form.objet" placeholder="Objet du courrier" class="w-full h-12" />
                </div>

                <div class="flex items-center space-x-2">
                  <UCheckbox v-model="form.large_diffusion" label="Large diffusion" />
                </div>
              </div>

              <!-- Action Buttons -->
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
                  SAUVEGARDER
                </UButton>
              </div>

              <!-- Error Messages -->
              <div v-if="errors.length > 0" class="mt-4">
                <ul class="list-disc list-inside text-sm text-red-600">
                  <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
                </ul>
              </div>

              <!-- Error Request Message -->
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

        <!-- Right Column: Document Preview -->
        <div class="lg:col-span-6">
          <DocumentPreview :selected-file="selectedFile" :file-preview-url="filePreviewUrl" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: "Nouveau Courrier Arrivée - Sagar Revolution",
});

const config = useRuntimeConfig()
const toast = useToast()

// ── État ──────────────────────────────────────────────────────────────────────
const selectedFile = ref(null)
const fileInput = ref(null)
const loading = ref(false)
const loadingTypes = ref(false)
const authToken = ref("")
const errorRequest = ref(null)
const sansReference = ref(false)
const documentTypes = ref([])
const errors = ref([])

// ── Formulaire ────────────────────────────────────────────────────────────────
const form = ref({
  type_arrivee: "directe",
  priorite: "standard",
  numero_enreg: "",
  date_enreg: new Date().toISOString().split("T")[0],
  reference: "",
  date_courier: "",
  objet: "",
  large_diffusion: false,
  fichier: null,
  type_document_id: null,
  structure: "",
  num_cab: "",
  date_cab: "",
  num_sgm: "",
  date_sgm: "",
  autre_structure: "",
  confidentiel: false,
  service_enreg: "",
  statut: "en_attente",
  observation: "",
})

// ── Computed ──────────────────────────────────────────────────────────────────
const filePreviewUrl = computed(() => {
  if (!selectedFile.value) return null
  return URL.createObjectURL(selectedFile.value)
})

const isFormValid = computed(() => {
  return (
    form.value.numero_enreg !== "" &&
    form.value.date_enreg !== "" &&
    form.value.date_courier !== "" &&
    form.value.objet !== "" &&
    form.value.type_document_id !== null &&
    form.value.fichier !== null &&
    form.value.type_arrivee !== "" &&
    form.value.priorite !== ""
  )
})

// ── Watchers ──────────────────────────────────────────────────────────────────
watch(filePreviewUrl, (newUrl, oldUrl) => {
  if (oldUrl) URL.revokeObjectURL(oldUrl)
})

// Vider la référence si "sans référence" coché
watch(sansReference, (val) => {
  if (val) form.value.reference = ""
})

onUnmounted(() => {
  if (filePreviewUrl.value) URL.revokeObjectURL(filePreviewUrl.value)
})

// ── Chargement des types de documents ─────────────────────────────────────────
const loadDocumentTypes = async () => {
  loadingTypes.value = true
  try {
    const response = await $fetch(`${config.public.apiBase}/type_documents`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken.value}`,
      },
    })

    // Gère les deux formats : { data: [...] } ou [...]
    documentTypes.value = response?.data || response || []
    console.log(`✅ ${documentTypes.value.length} types de documents chargés`)
  } catch (error) {
    console.error("Erreur lors de la récupération des types de documents:", error)
    toast.add({
      title: "Erreur",
      description: "Impossible de charger les types de documents",
      color: "red",
      timeout: 3000,
    })
  } finally {
    loadingTypes.value = false
  }
}

// ── Validation ────────────────────────────────────────────────────────────────
const validateForm = () => {
  const newErrors = []

  if (!form.value.numero_enreg) newErrors.push("Le numéro d'enregistrement est obligatoire.")
  if (!form.value.date_enreg) newErrors.push("La date d'enregistrement est obligatoire.")
  if (!form.value.date_courier) newErrors.push("La date du courrier est obligatoire.")
  if (!form.value.objet) newErrors.push("L'objet est obligatoire.")
  if (!form.value.type_document_id) newErrors.push("Le type de document est obligatoire.")
  if (!form.value.fichier) newErrors.push("La pièce jointe est obligatoire.")
  if (!form.value.type_arrivee) newErrors.push("Le type d'arrivée est obligatoire.")
  if (!form.value.priorite) newErrors.push("La priorité est obligatoire.")

  errors.value = newErrors
  return newErrors.length === 0
}

// ── Handlers ──────────────────────────────────────────────────────────────────
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    form.value.fichier = file
    console.log("✅ Fichier sélectionné:", file.name)
  }
}

const resetForm = () => {
  form.value = {
    type_arrivee: "directe",
    priorite: "standard",
    numero_enreg: "",
    date_enreg: new Date().toISOString().split("T")[0],
    reference: "",
    date_courier: "",
    objet: "",
    large_diffusion: false,
    fichier: null,
    type_document_id: null,
    structure: "",
    num_cab: "",
    date_cab: "",
    num_sgm: "",
    date_sgm: "",
    autre_structure: "",
    confidentiel: false,
    service_enreg: "",
    statut: "en_attente",
    observation: "",
  }
  selectedFile.value = null
  sansReference.value = false
  errors.value = []
  errorRequest.value = null
}

const handleSubmit = async () => {
  loading.value = true
  errors.value = []
  errorRequest.value = null

  try {
    if (!validateForm()) {
      toast.add({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires",
        color: "red",
      })
      return
    }

    // Récupérer l'entité sélectionnée
    let selectedFunction = null
    if (process.client) {
      const savedFunction = localStorage.getItem("selected_entite")
      if (savedFunction) {
        selectedFunction = JSON.parse(savedFunction)
      }
    }

    if (!selectedFunction) {
      toast.add({
        title: "Erreur",
        description: "Aucune fonction sélectionnée. Veuillez vous reconnecter.",
        color: "red",
      })
      return
    }

    // Construire le FormData
    const formData = new FormData()

    formData.append("numero_enreg", form.value.numero_enreg)
    formData.append("date_enreg", form.value.date_enreg)
    formData.append("reference", sansReference.value ? "sans reference" : (form.value.reference || "sans reference"))
    formData.append("date_courrier", form.value.date_courier)
    formData.append("objet", form.value.objet)
    formData.append("large_diffusion", form.value.large_diffusion ? "1" : "0")
    formData.append("type_document_id", String(form.value.type_document_id))
    formData.append("type_arrivee", form.value.type_arrivee)
    formData.append("confidentiel", form.value.confidentiel ? "1" : "0")
    formData.append("service_enreg", selectedFunction?.code || "Non défini")
    formData.append("priority", form.value.priorite)
    formData.append("statut", form.value.statut)

    if (form.value.fichier) {
      formData.append("fichier", form.value.fichier)
    }

    if (form.value.type_arrivee !== "autre" && form.value.structure) {
      formData.append("structure", form.value.structure)
    }
    if (form.value.type_arrivee === "autre" && form.value.autre_structure) {
      formData.append("autre_structure", form.value.autre_structure)
    }
    if (form.value.type_arrivee === "cab") {
      if (form.value.num_cab) formData.append("num_cab", form.value.num_cab)
      if (form.value.date_cab) formData.append("date_cab", form.value.date_cab)
    }
    if (form.value.type_arrivee === "cab" || form.value.type_arrivee === "sgm") {
      if (form.value.num_sgm) formData.append("num_sgm", form.value.num_sgm)
      if (form.value.date_sgm) formData.append("date_sgm", form.value.date_sgm)
    }

    const response = await $fetch(`${config.public.apiBase}/courriers-arrives`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken.value}`,
      },
      body: formData,
    })

    if (response.success || response.data) {
      toast.add({
        title: "Succès",
        description: "Le courrier arrivé a été enregistré avec succès",
        color: "green",
      })
      resetForm()
    } else {
      toast.add({
        title: "Erreur",
        description: response.message || "Une erreur est survenue lors de l'enregistrement",
        color: "red",
      })
    }

  } catch (error) {
    console.error("Erreur lors de la soumission:", error)
    errorRequest.value = error

    // Afficher les erreurs de validation Laravel (422)
    const description = error.data?.errors
      ? Object.values(error.data.errors).flat().join(' | ')
      : error.data?.message || error.message || "Une erreur inattendue est survenue."

    toast.add({
      title: "Erreur de soumission",
      description,
      color: "red",
    })
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  navigateTo("/documents")
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(async () => {
  if (process.client) {
    authToken.value = localStorage.getItem("auth_token") || ""
  }
  await loadDocumentTypes()
})
</script>