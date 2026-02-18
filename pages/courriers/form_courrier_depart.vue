<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left Column: Form (col-5) -->
        <div class="lg:col-span-5">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="mb-6">
              <h1 class="text-2xl font-bold text-gray-900">Nouveau Courrier Départ</h1>
              <p class="text-gray-600 mt-1">Enregistrez un nouveau courrier départ</p>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4">
              <!-- Type de départ -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Type de départ *</label>
                <USelect v-model="form.type_depart" :options="[
                  { label: 'Interne', value: 'interne' },
                  { label: 'Externe', value: 'externe' },
                ]" class="w-full h-12" />
              </div>

              <!-- Upload et Type de Document -->
              <div class="grid grid-cols-1 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Pièce jointe *</label>
                  <div class="relative">
                    <input ref="fileInput" type="file" @change="handleFileChange"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" class="hidden" />
                    <div class="flex gap-2">
                      <UButton @click="$refs.fileInput.click()" type="button" color="yellow" variant="outline"
                        icon="heroicons:arrow-up-tray" class="flex-shrink-0" />
                      <div
                        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-600 truncate flex items-center">
                        {{ selectedFile ? selectedFile.name : "Aucun fichier sélectionné" }}
                      </div>
                    </div>
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
                    :loading="loadingTypes"
                    :ui="{ height: 'h-[42px]' }"
                  />
                  <p v-if="documentTypes.length === 0 && !loadingTypes" class="text-xs text-amber-600 mt-1">
                    Aucun type de document disponible
                  </p>
                </div>
              </div>

              <!-- Destinataire + Date départ -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Destinataire</label>
                  <UInput v-model="form.destinataire" placeholder="Nom du destinataire" class="w-full h-12" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Date de départ *</label>
                  <UInput v-model="form.date_depart" type="date" class="w-full h-12" />
                </div>
              </div>

              <!-- Champs communs -->
              <div class="pt-4 border-t border-gray-100 space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Numéro d'enregistrement *</label>
                    <UInput v-model="form.numero_enreg" placeholder="Numéro d'enregistrement" class="w-full h-12" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Date d'enregistrement *</label>
                    <UInput v-model="form.date_enreg" type="date" class="w-full h-12" />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Référence *</label>
                    <UInput v-model="form.reference" placeholder="Référence du document" class="w-full h-12" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Date du courrier *</label>
                    <UInput v-model="form.date_courier" type="date" class="w-full h-12" />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Objet *</label>
                  <UInput v-model="form.objet" placeholder="Objet du courrier" class="w-full h-12" />
                </div>

                <div class="flex items-center space-x-4">
                  <UCheckbox v-model="form.large_diffusion" label="Large diffusion" />
                  <UCheckbox v-model="form.confidentiel" label="Confidentiel" />
                </div>

                <!-- Initiateurs -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Initiateurs *</label>
                  <USelectMenu
                    v-model="form.initiateurs"
                    :options="utilisateurs"
                    value-attribute="id"
                    option-attribute="display_name"
                    placeholder="Sélectionner les initiateurs"
                    class="w-full"
                    multiple
                    :loading="loadingUsers"
                    :ui="{ height: 'h-[42px]' }"
                  />
                  <p v-if="form.initiateurs.length > 0" class="text-xs text-green-600 mt-1">
                    {{ form.initiateurs.length }} initiateur(s) sélectionné(s)
                  </p>
                  <p v-else class="text-xs text-gray-500 mt-1">
                    Sélectionnez un ou plusieurs initiateurs pour ce courrier
                  </p>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-center space-x-4 pt-6 border-t border-gray-200">
                <UButton type="button" @click="handleCancel" color="gray" variant="outline">
                  ANNULER
                </UButton>
                <UButton
                  type="submit"
                  :disabled="!isFormValid || loading"
                  :loading="loading"
                  class="bg-gradient-to-br from-emerald-800 to-blue-800 text-white dark:text-white"
                >
                  SAUVEGARDER
                </UButton>
              </div>

              <!-- Erreurs de validation -->
              <div v-if="errors.length > 0" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <ul class="list-disc list-inside text-sm text-red-600 space-y-1">
                  <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
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
  title: "Nouveau Courrier Départ - Sagar Revolution",
})

const toast = useToast()
const config = useRuntimeConfig()

// ── État ──────────────────────────────────────────────────────────────────────
const selectedFile = ref(null)
const fileInput = ref(null)
const loading = ref(false)
const loadingTypes = ref(false)
const loadingUsers = ref(false)
const authToken = ref("")
const errorRequest = ref(null)
const errors = ref([])

const documentTypes = ref([])
const utilisateurs = ref([])

// ── Formulaire ────────────────────────────────────────────────────────────────
const form = ref({
  type_depart: "externe",
  numero_enreg: "",
  date_enreg: new Date().toISOString().split("T")[0],
  reference: "",
  date_courier: "",
  objet: "",
  large_diffusion: false,
  url: null,
  type_document_id: null,
  date_depart: "",
  destinataire: "",
  confidentiel: false,
  service_emis: "",
  initiateurs: [],
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
    form.value.reference !== "" &&
    form.value.date_courier !== "" &&
    form.value.objet !== "" &&
    form.value.type_document_id !== null &&
    form.value.url !== null &&
    form.value.type_depart !== "" &&
    form.value.date_depart !== "" &&
    form.value.initiateurs.length > 0
  )
})

// ── Watchers ──────────────────────────────────────────────────────────────────
watch(filePreviewUrl, (newUrl, oldUrl) => {
  if (oldUrl) URL.revokeObjectURL(oldUrl)
})

onUnmounted(() => {
  if (filePreviewUrl.value) URL.revokeObjectURL(filePreviewUrl.value)
})

// ── Chargement types de documents ─────────────────────────────────────────────
const loadDocumentTypes = async () => {
  loadingTypes.value = true
  try {
    const response = await $fetch(`${config.public.apiBase}/type_documents`, {
      method: "GET",
      headers: { Authorization: `Bearer ${authToken.value}` },
    })
    documentTypes.value = response?.data || response || []
    console.log(`✅ ${documentTypes.value.length} types de documents chargés`)
  } catch (error) {
    console.error("Erreur types de documents:", error)
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

// ── Chargement utilisateurs (initiateurs) ─────────────────────────────────────
const loadUtilisateurs = async () => {
  loadingUsers.value = true
  try {
    const response = await $fetch(`${config.public.apiBase}/entite-users`, {
      method: "GET",
      headers: { Authorization: `Bearer ${authToken.value}` },
    })

    const data = response?.data || response || []
    utilisateurs.value = data.map(user => ({
      id: user.id,
      display_name: `${user.user?.nom || ''} ${user.user?.prenom || ''} — ${user.entite?.code || user.entite?.libelle || ''}`.trim(),
    }))
    console.log(`✅ ${utilisateurs.value.length} utilisateurs chargés`)
  } catch (error) {
    console.error("Erreur chargement utilisateurs:", error)
    toast.add({
      title: "Erreur",
      description: "Impossible de charger la liste des initiateurs",
      color: "red",
      timeout: 3000,
    })
  } finally {
    loadingUsers.value = false
  }
}

// ── Validation ────────────────────────────────────────────────────────────────
const validateForm = () => {
  const newErrors = []

  if (!form.value.numero_enreg) newErrors.push("Le numéro d'enregistrement est obligatoire.")
  if (!form.value.date_enreg) newErrors.push("La date d'enregistrement est obligatoire.")
  if (!form.value.reference) newErrors.push("La référence est obligatoire.")
  if (!form.value.date_courier) newErrors.push("La date du courrier est obligatoire.")
  if (!form.value.objet) newErrors.push("L'objet est obligatoire.")
  if (!form.value.type_document_id) newErrors.push("Le type de document est obligatoire.")
  if (!form.value.url) newErrors.push("La pièce jointe est obligatoire.")
  if (!form.value.type_depart) newErrors.push("Le type de départ est obligatoire.")
  if (!form.value.date_depart) newErrors.push("La date de départ est obligatoire.")
  if (!form.value.initiateurs.length) newErrors.push("Veuillez sélectionner au moins un initiateur.")

  errors.value = newErrors
  return newErrors.length === 0
}

// ── Handlers ──────────────────────────────────────────────────────────────────
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    form.value.url = file
    console.log("✅ Fichier sélectionné:", file.name)
  }
}

const resetForm = () => {
  form.value = {
    type_depart: "externe",
    numero_enreg: "",
    date_enreg: new Date().toISOString().split("T")[0],
    reference: "",
    date_courier: "",
    objet: "",
    large_diffusion: false,
    url: null,
    type_document_id: null,
    date_depart: "",
    destinataire: "",
    confidentiel: false,
    service_emis: "",
    initiateurs: [],
  }
  selectedFile.value = null
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
    formData.append("reference", form.value.reference)
    formData.append("date_courrier", form.value.date_courier)
    formData.append("date_depart", form.value.date_depart)
    formData.append("destinataire", form.value.destinataire || "")
    formData.append("objet", form.value.objet)
    formData.append("large_diffusion", form.value.large_diffusion ? "1" : "0")
    formData.append("confidentiel", form.value.confidentiel ? "1" : "0")
    formData.append("type_document_id", String(form.value.type_document_id))
    formData.append("type_depart", form.value.type_depart)
    formData.append("service_emis", selectedFunction?.code || "Non défini")

    if (form.value.url) {
      formData.append("fichier", form.value.url)
    }

    // Initiateurs : extraire les IDs proprement selon ce que retourne USelectMenu
    const initiateurIds = form.value.initiateurs.map(i => 
      typeof i === 'object' ? i.id : i
    )

    if (!initiateurIds.length) {
      toast.add({
        title: "Erreur",
        description: "Veuillez sélectionner au moins un initiateur.",
        color: "red",
      })
      return
    }

    // Backend attend : initiateurs[0], initiateurs[1]... (IDs simples)
    initiateurIds.forEach((id, index) => {
      formData.append(`initiateurs[${index}]`, id)
    })

    const response = await $fetch(`${config.public.apiBase}/courriers-departs`, {
      method: "POST",
      headers: { Authorization: `Bearer ${authToken.value}` },
      body: formData,
    })

    if (response.success || response.data) {
      toast.add({
        title: "Succès",
        description: "Le courrier départ a été enregistré avec succès",
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

  // Chargement en parallèle
  await Promise.all([
    loadDocumentTypes(),
    loadUtilisateurs(),
  ])
})
</script>