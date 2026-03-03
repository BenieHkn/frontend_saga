<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">

      <!-- Bandeau mode réponse -->
      <div v-if="isReplyMode" class="mb-6 flex items-start gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl shadow-sm">
        <div class="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
          <Icon name="i-heroicons-arrow-uturn-right" class="w-5 h-5 text-emerald-600" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">En réponse au courrier</p>
          <p class="text-sm font-semibold text-gray-900 truncate">{{ replyDocumentSummary?.reference }}</p>
          <p class="text-xs text-gray-600 mt-0.5 line-clamp-2">{{ replyDocumentSummary?.objet }}</p>
          <div class="flex flex-wrap gap-3 mt-2">
            <span class="text-xs text-gray-500">
              N° {{ replyDocumentSummary?.numero_enreg }}
            </span>
            <span class="text-xs text-gray-400">•</span>
            <span class="text-xs text-gray-500">
              {{ formatDate(replyDocumentSummary?.date_enreg) }}
            </span>
            <span v-if="replyDocumentSummary?.type_document" class="text-xs text-gray-400">•</span>
            <span v-if="replyDocumentSummary?.type_document" class="text-xs text-indigo-600 font-medium">
              {{ replyDocumentSummary.type_document }}
            </span>
          </div>
        </div>
        <button
          @click="cancelReply"
          class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          title="Annuler la réponse"
        >
          <Icon name="i-heroicons-x-mark" class="w-5 h-5" />
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Formulaire -->
        <div class="lg:col-span-5">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="mb-6">
              <h1 class="text-2xl font-bold text-gray-900">
                {{ isReplyMode ? 'Répondre au courrier' : 'Nouveau Courrier Départ' }}
              </h1>
              <p class="text-gray-600 mt-1">
                {{ isReplyMode ? 'Rédiger et envoyer votre réponse' : 'Enregistrez un nouveau courrier départ' }}
              </p>
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
                </div>
              </div>

              <!-- Destinataire -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Destinataire{{ isReplyMode ? ' *' : '' }}
                  </label>

                  <!-- Saisie libre dans les deux modes ; pré-rempli avec la structure émettrice en mode réponse -->
                  <UInput
                    v-model="form.destinataire"
                    :placeholder="isReplyMode ? '' : 'Nom du destinataire'"
                    class="w-full h-12"
                  />
                  <p v-if="isReplyMode" class="text-[11px] text-gray-400 mt-1">
                    Pré-rempli avec la structure émettrice du courrier original
                  </p>
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
                  <!-- <UCheckbox v-model="form.confidentiel" label="Confidentiel" /> -->
                </div>

                <!-- Initiateurs : uniquement en mode création (pas en réponse) -->
                <div v-if="!isReplyMode">
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

              <!-- Affectations du courrier original (mode réponse, informatif) -->
              <div v-if="isReplyMode && courrierToReply?.affectations?.length" class="pt-4 border-t border-gray-100">
                <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  Affectations du courrier original
                </p>
                <div class="space-y-2">
                  <div
                    v-for="affectation in affectesOptionsEnrichis"
                    :key="affectation.affectation.id"
                    class="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div class="flex items-center gap-2">
                      <div class="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Icon name="i-heroicons-user" class="w-3.5 h-3.5 text-indigo-600" />
                      </div>
                      <div>
                        <p class="text-xs font-medium text-gray-800">{{ affectation.label }}</p>
                        <p v-if="affectation.matricule" class="text-[10px] text-gray-400">{{ affectation.matricule }}</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-xs px-2 py-0.5 rounded-full font-medium"
                        :class="{
                          'bg-amber-100 text-amber-700': affectation.affectation.statut === 'en cours',
                          'bg-green-100 text-green-700': affectation.affectation.statut === 'cloturé',
                        }"
                      >
                        {{ affectation.affectation.statut }}
                      </span>
                      <span class="text-[10px] text-gray-400 capitalize">{{ affectation.affectation.type_affectation }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Boutons -->
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
                  {{ isReplyMode ? 'ENVOYER LA RÉPONSE' : 'SAUVEGARDER' }}
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

        <!-- Preview document -->
        <div class="lg:col-span-6">
          <DocumentPreview :selected-file="selectedFile" :file-preview-url="filePreviewUrl" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useCourriersStore } from '~/stores/courriers'

useHead({
  title: "Courrier Départ - Sagar Revolution",
})

const toast = useToast()
const config = useRuntimeConfig()

// ── Store courriers ────────────────────────────────────────────────────────────
const courriersStore = useCourriersStore()
const { isReplyMode, replyDocumentSummary, courrierToReply } = storeToRefs(courriersStore)

// ── État ──────────────────────────────────────────────────────────────────────
const selectedFile = ref(null)
const fileInput = ref(null)
const loading = ref(false)
const loadingTypes = ref(false)
const loadingUsers = ref(false)
const authToken = ref('')
const errorRequest = ref(null)
const errors = ref([])

const documentTypes = ref([])
const utilisateurs = ref([])

// ── Formulaire ────────────────────────────────────────────────────────────────
const form = ref({
  type_depart: 'externe',
  numero_enreg: '',
  date_enreg: new Date().toISOString().split('T')[0],
  reference: '',
  date_courier: '',
  objet: '',
  large_diffusion: false,
  url: null,
  type_document_id: null,
  date_depart: '',
  destinataire: '',
  confidentiel: false,
  service_emis: '',
  initiateurs: [],
})

// ── Computed ──────────────────────────────────────────────────────────────────
const filePreviewUrl = computed(() => {
  if (!selectedFile.value) return null
  return URL.createObjectURL(selectedFile.value)
})

const isFormValid = computed(() => {
  const base =
    form.value.numero_enreg !== '' &&
    form.value.date_enreg !== '' &&
    form.value.reference !== '' &&
    form.value.date_courier !== '' &&
    form.value.objet !== '' &&
    form.value.type_document_id !== null &&
    form.value.url !== null &&
    form.value.type_depart !== '' &&
    form.value.date_depart !== ''

  if (isReplyMode.value) {
    // En mode réponse : destinataire = structure émettrice, pré-rempli, toujours valide si présent
    return base && form.value.destinataire !== ''
  }

  // Mode création : initiateurs obligatoires
  return base && form.value.initiateurs.length > 0
})

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

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
      method: 'GET',
      headers: { Authorization: `Bearer ${authToken.value}` },
    })
    documentTypes.value = response?.data || response || []
  } catch (error) {
    console.error('Erreur types de documents:', error)
    toast.add({ title: 'Erreur', description: 'Impossible de charger les types de documents', color: 'red', timeout: 3000 })
  } finally {
    loadingTypes.value = false
  }
}

// ── Chargement utilisateurs (uniquement en mode création pour les initiateurs) ──
const loadUtilisateurs = async () => {
  if (isReplyMode.value) return  // En mode réponse, les noms viennent directement de affectation.user

  loadingUsers.value = true
  try {
    const response = await $fetch(`${config.public.apiBase}/entite-users`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${authToken.value}` },
    })
    const data = response?.data || response || []
    utilisateurs.value = data.map(user => ({
      id: user.id,
      display_name: `${user.user?.nom || ''} ${user.user?.prenom || ''} — ${user.entite?.code || user.entite?.libelle || ''}`.trim(),
    }))
  } catch (error) {
    console.error('Erreur chargement utilisateurs:', error)
    toast.add({ title: 'Erreur', description: 'Impossible de charger la liste des initiateurs', color: 'red', timeout: 3000 })
  } finally {
    loadingUsers.value = false
  }
}

// ── Destinataires enrichis : noms lus directement depuis affectation.user (fourni par l'API) ──
const affectesOptionsEnrichis = computed(() => {
  if (!courrierToReply.value?.affectations?.length) return []

  return courrierToReply.value.affectations.map((affectation) => {
    const u = affectation.user
    const nomComplet = u
      ? `${u.nom || ''} ${u.prenom || ''}`.trim()
      : `Destinataire #${affectation.destinataire_id}`

    return {
      id: affectation.destinataire_id,
      label: nomComplet,
      matricule: u?.matricule || '',
      affectation,
    }
  })
})

// ── Validation ────────────────────────────────────────────────────────────────
const validateForm = () => {
  const newErrors = []

  if (!form.value.numero_enreg) newErrors.push("Le numéro d'enregistrement est obligatoire.")
  if (!form.value.date_enreg) newErrors.push("La date d'enregistrement est obligatoire.")
  if (!form.value.reference) newErrors.push('La référence est obligatoire.')
  if (!form.value.date_courier) newErrors.push('La date du courrier est obligatoire.')
  if (!form.value.objet) newErrors.push("L'objet est obligatoire.")
  if (!form.value.type_document_id) newErrors.push('Le type de document est obligatoire.')
  if (!form.value.url) newErrors.push('La pièce jointe est obligatoire.')
  if (!form.value.type_depart) newErrors.push('Le type de départ est obligatoire.')
  if (!form.value.date_depart) newErrors.push('La date de départ est obligatoire.')

  if (isReplyMode.value) {
    if (!form.value.destinataire) {
      newErrors.push('Le destinataire est obligatoire.')
    }
  } else {
    if (!form.value.initiateurs.length) {
      newErrors.push('Veuillez sélectionner au moins un initiateur.')
    }
  }

  errors.value = newErrors
  return newErrors.length === 0
}

// ── Handlers ──────────────────────────────────────────────────────────────────
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    form.value.url = file
  }
}

const resetForm = () => {
  form.value = {
    type_depart: 'externe',
    numero_enreg: '',
    date_enreg: new Date().toISOString().split('T')[0],
    reference: '',
    date_courier: '',
    objet: '',
    large_diffusion: false,
    url: null,
    type_document_id: null,
    date_depart: '',
    destinataire: '',
    confidentiel: false,
    service_emis: '',
    initiateurs: [],
  }
  selectedFile.value = null
  errors.value = []
  errorRequest.value = null
}

const cancelReply = () => {
  courriersStore.clearReply()
  navigateTo('/documents')
}

// ── Construction du FormData commun aux deux modes ────────────────────────────
const buildBaseFormData = (selectedFunction) => {
  const fd = new FormData()
  fd.append('numero_enreg',     form.value.numero_enreg)
  fd.append('date_enreg',       form.value.date_enreg)
  fd.append('reference',        form.value.reference)
  fd.append('date_courrier',    form.value.date_courier)
  fd.append('date_depart',      form.value.date_depart)
  fd.append('objet',            form.value.objet)
  fd.append('large_diffusion',  form.value.large_diffusion ? '1' : '0')
  fd.append('confidentiel',     form.value.confidentiel ? '1' : '0')
  fd.append('type_document_id', String(form.value.type_document_id))
  fd.append('type_depart',      form.value.type_depart)
  fd.append('service_emis',     selectedFunction?.code || 'Non défini')
  fd.append('destinataire',     form.value.destinataire || '')
  if (form.value.url) fd.append('fichier', form.value.url)
  return fd
}

// ── Soumission mode réponse : POST /courriers-departs/reponse ─────────────────
const submitReponse = async (selectedFunction) => {
  const fd = buildBaseFormData(selectedFunction)

  // Identifiant du document du courrier arrivé auquel on répond
  fd.append('courrier_arrive_document_id', String(courrierToReply.value.document.id))

  const response = await $fetch(`${config.public.apiBase}/courriers-departs/reponse`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${authToken.value}` },
    body: fd,
  })

  if (!response.success) {
    throw new Error(response.message || "Erreur lors de la création de la réponse")
  }

  return response
}

// ── Soumission mode création standard : POST /courriers-departs ───────────────
const submitCreation = async (selectedFunction) => {
  const fd = buildBaseFormData(selectedFunction)

  const initiateurIds = form.value.initiateurs.map(i => typeof i === 'object' ? i.id : i)
  initiateurIds.forEach((id, index) => {
    fd.append(`initiateurs[${index}]`, id)
  })

  const response = await $fetch(`${config.public.apiBase}/courriers-departs`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${authToken.value}` },
    body: fd,
  })

  if (!response.success) {
    throw new Error(response.message || "Erreur lors de la création du courrier")
  }

  return response
}

// ── Handler principal ─────────────────────────────────────────────────────────
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

    let selectedFunction = null
    if (process.client) {
      const saved = localStorage.getItem('selected_entite')
      if (saved) selectedFunction = JSON.parse(saved)
    }

    if (!selectedFunction) {
      toast.add({
        title: 'Erreur',
        description: 'Aucune fonction sélectionnée. Veuillez vous reconnecter.',
        color: 'red',
      })
      return
    }

    // Appel selon le mode
    if (isReplyMode.value) {
      await submitReponse(selectedFunction)
      courriersStore.clearReply()
      toast.add({
        title: 'Réponse envoyée',
        description: 'Le courrier de réponse a été créé et rattaché avec succès',
        color: 'green',
        icon: 'i-heroicons-check-circle',
      })
    } else {
      await submitCreation(selectedFunction)
      toast.add({
        title: 'Courrier créé',
        description: 'Le courrier départ a été enregistré avec succès',
        color: 'green',
        icon: 'i-heroicons-check-circle',
      })
    }

    resetForm()
    navigateTo('/documents')

  } catch (error) {
    console.error('Erreur lors de la soumission:', error)
    errorRequest.value = error

    const description = error.data?.errors
      ? Object.values(error.data.errors).flat().join(' | ')
      : error.data?.message || error.message || 'Une erreur inattendue est survenue.'

    toast.add({ title: 'Erreur de soumission', description, color: 'red' })
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  if (isReplyMode.value) {
    courriersStore.clearReply()
  }
  navigateTo('/documents')
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(async () => {
  if (process.client) {
    authToken.value = localStorage.getItem('auth_token') || ''
  }

  // Pré-remplir le destinataire avec la structure émettrice du courrier original
  if (isReplyMode.value && courrierToReply.value) {
    const c = courrierToReply.value
    form.value.destinataire = c.autre_structure || c.structure || ''
  }

  await Promise.all([
    loadDocumentTypes(),
    loadUtilisateurs(),
  ])
})
</script>