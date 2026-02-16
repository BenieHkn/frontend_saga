<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto p-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-12">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">

            <PageHeader
              title="Assignation d'un Point Critique"
              subtitle="Gestion des assignations"
              to="/point-critique"
              btn-text="Retour à la liste"
            />

            <!-- Loading initial -->
            <div v-if="loadingInitial" class="flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
              <div class="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <span class="text-sm font-medium">Chargement des données...</span>
            </div>

            <form v-else @submit.prevent="handleSubmit" class="space-y-6 mt-6 max-w-3xl mx-auto">

              <!-- Utilisateur -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Utilisateur <span class="text-red-600">*</span>
                </label>
                <USelectMenu
                  v-model="form.user_id"
                  :options="usersOptions"
                  placeholder="Sélectionner un utilisateur"
                  value-attribute="id"
                  option-attribute="display"
                  :loading="loadingUsers"
                  searchable
                  searchable-placeholder="Rechercher un utilisateur..."
                  class="w-full"
                >
                  <template #label>
                    <span v-if="selectedUser" class="truncate">{{ selectedUser.user_name }}</span>
                    <span v-else class="text-gray-400">Sélectionner un utilisateur</span>
                  </template>
                  <template #option="{ option }">
                    <div class="flex flex-col py-1">
                      <span class="font-semibold text-sm text-gray-900">{{ option.user_name }}</span>
                      <span class="text-xs text-gray-400">{{ option.matricule }} — {{ option.email }}</span>
                      <div v-if="option.entites?.length" class="flex flex-wrap gap-1 mt-0.5">
                        <span v-for="(e, i) in option.entites.slice(0, 2)" :key="i"
                          class="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded">
                          {{ e.libelle }}
                        </span>
                        <span v-if="option.entites.length > 2" class="text-[10px] text-gray-400">
                          +{{ option.entites.length - 2 }}
                        </span>
                      </div>
                    </div>
                  </template>
                </USelectMenu>
                <p class="text-xs text-gray-500 mt-1">Sélectionnez l'utilisateur responsable du point critique</p>
              </div>

              <!-- Point Critique (Entité) -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Point Critique <span class="text-red-600">*</span>
                </label>
                <USelectMenu
                  v-model="form.entite_id"
                  :options="pointsCritiquesOptions"
                  placeholder="Sélectionner un point critique"
                  value-attribute="id"
                  option-attribute="display"
                  :loading="loadingPointsCritiques"
                  searchable
                  searchable-placeholder="Rechercher un point critique..."
                  class="w-full"
                >
                  <template #label>
                    <span v-if="selectedPointCritique" class="truncate">{{ selectedPointCritique.display }}</span>
                    <span v-else class="text-gray-400">Sélectionner un point critique</span>
                  </template>
                  <template #option="{ option }">
                    <div class="flex flex-col py-1">
                      <span class="font-semibold text-sm text-gray-900">{{ option.code }}</span>
                      <span class="text-xs text-gray-500">{{ option.libelle }}</span>
                      <span class="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-red-50 text-red-700 border border-red-200 w-fit">
                        <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                        Critique
                      </span>
                    </div>
                  </template>
                </USelectMenu>
                <p class="text-xs text-gray-500 mt-1">Sélectionnez le point critique à assigner</p>
              </div>

                <!-- Statut et Intérim -->
              <div class="flex items-center gap-6 pt-4 border-t border-gray-100">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" v-model="form.actif"
                    class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                  <span class="text-sm font-medium text-gray-700">Fonction</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" v-model="form.is_interim"
                    class="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500" />
                  <span class="text-sm font-medium text-gray-700">Intérim</span>
                </label>
              </div>

              <!-- Dates -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Date de début</label>
                  <UInput v-model="form.date_debut" type="date" class="w-full h-12" />
                  <p class="text-xs text-gray-500 mt-1">Optionnel</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Date de fin</label>
                  <UInput v-model="form.date_fin" type="date" class="w-full h-12" :min="form.date_debut" />
                  <p class="text-xs text-gray-500 mt-1">Optionnel - Doit être après la date de début</p>
                </div>
              </div>

              <!-- Pièce jointe -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Pièce jointe
                  <span class="text-xs font-normal text-gray-500 ml-2">(Optionnel)</span>
                </label>
                <div
                  class="border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors"
                  :class="selectedFile
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50'"
                  @click="fileInputRef?.click()"
                  @dragover.prevent
                  @drop.prevent="onFileDrop"
                >
                  <input
                    ref="fileInputRef"
                    type="file"
                    @change="handleFileChange"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    class="hidden"
                  />

                  <!-- Fichier sélectionné -->
                  <div v-if="selectedFile" class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3 min-w-0">
                      <div class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg"
                        :class="fileIconBg">
                        <svg class="w-5 h-5" :class="fileIconColor" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div class="text-left min-w-0">
                        <p class="text-sm font-semibold text-gray-800 truncate">{{ selectedFile.name }}</p>
                        <p class="text-xs text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
                      </div>
                    </div>
                    <button type="button" @click.stop="removeFile"
                      class="flex-shrink-0 p-1.5 rounded-full text-red-400 hover:text-red-600 hover:bg-red-100 transition-colors">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <!-- Aucun fichier -->
                  <div v-else class="flex flex-col items-center gap-2 py-2">
                    <svg class="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <p class="text-sm text-gray-500">
                      <span class="font-semibold text-indigo-600">Cliquez</span> ou glissez un fichier ici
                    </p>
                    <p class="text-xs text-gray-400">PDF, Word, Images — max 5 Mo</p>
                  </div>
                </div>
              </div>

              <!-- Boutons -->
              <div class="flex justify-center space-x-4 pt-6 border-t border-gray-200">
                <UButton type="button" @click="handleCancel" color="gray" variant="outline">ANNULER</UButton>
                <UButton
                  :disabled="!isFormValid || loading"
                  type="submit"
                  class="bg-gradient-to-br from-emerald-800 to-blue-800 text-white dark:text-white"
                  :loading="loading"
                >
                  ASSIGNER
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

      <!-- Modal Succès -->
      <div v-if="showSuccessModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl p-8 w-[500px] max-w-[90vw] mx-4 text-center">
          <div class="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-green-100 mb-4">
            <svg class="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-2xl font-semibold mb-2">Succès !</h3>
          <p class="text-gray-600 mb-6">Le point critique a été assigné avec succès.</p>
          <UButton @click="navigateTo('/point-critique')"
            class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
            Retour à la liste
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({ title: "Assignation Point Critique" })

const config = useRuntimeConfig()

const getToken = () => {
  if (process.client) {
    return useCookie('auth_token').value || localStorage.getItem('auth_token') || ''
  }
  return useCookie('auth_token').value || ''
}

// ── États ──────────────────────────────────────────────────────────────────
const loading                = ref(false)
const loadingInitial         = ref(true)
const loadingUsers           = ref(false)
const loadingPointsCritiques = ref(false)
const errorRequest           = ref(null)
const showSuccessModal       = ref(false)
const fileInputRef           = ref(null)
const selectedFile           = ref(null)
const users                  = ref([])
const pointsCritiques        = ref([])
const errors                 = ref([])

const form = ref({
  user_id:    null,
  entite_id:  null,
  date_debut: '',
  date_fin:   '',
  actif:      true,
  is_interim: false,
})

// ── Computed ───────────────────────────────────────────────────────────────
const isFormValid = computed(() =>
  form.value.user_id !== null && form.value.entite_id !== null
)

const usersOptions = computed(() =>
  users.value.map(u => ({
    id:        u.id,
    display:   `${u.nom} ${u.prenom} — ${u.email}`,
    user_name: `${u.nom} ${u.prenom}`,
    email:     u.email,
    matricule: u.matricule || '',
    entites:   u.entites || [],
  }))
)

const pointsCritiquesOptions = computed(() =>
  pointsCritiques.value.map(pc => ({
    id:      pc.id,
    display: `${pc.code} — ${pc.libelle}`,
    code:    pc.code,
    libelle: pc.libelle,
  }))
)

const selectedUser = computed(() =>
  usersOptions.value.find(o => o.id === form.value.user_id) || null
)

const selectedPointCritique = computed(() =>
  pointsCritiquesOptions.value.find(o => o.id === form.value.entite_id) || null
)

const fileIconBg = computed(() => {
  if (!selectedFile.value) return 'bg-gray-100'
  const t = selectedFile.value.type
  if (t === 'application/pdf') return 'bg-red-100'
  if (t.startsWith('image/'))  return 'bg-purple-100'
  if (t.includes('word'))      return 'bg-blue-100'
  return 'bg-gray-100'
})

const fileIconColor = computed(() => {
  if (!selectedFile.value) return 'text-gray-400'
  const t = selectedFile.value.type
  if (t === 'application/pdf') return 'text-red-500'
  if (t.startsWith('image/'))  return 'text-purple-500'
  if (t.includes('word'))      return 'text-blue-500'
  return 'text-gray-400'
})

// ── Helpers ────────────────────────────────────────────────────────────────
const formatFileSize = (bytes) => {
  if (!bytes) return ''
  if (bytes < 1024)        return bytes + ' o'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' Ko'
  return (bytes / (1024 * 1024)).toFixed(1) + ' Mo'
}

// ── Gestion fichier ────────────────────────────────────────────────────────
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg', 'image/jpg', 'image/png',
]

const validateFile = (file) => {
  if (file.size > 5 * 1024 * 1024)           return 'Le fichier ne doit pas dépasser 5 Mo'
  if (!ALLOWED_MIME_TYPES.includes(file.type)) return 'Format non autorisé (PDF, Word, JPG, PNG)'
  return null
}

const handleFileChange = (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  const err = validateFile(file)
  if (err) { 
    useToast().add({ title: 'Fichier invalide', description: err, color: 'red' })
    return 
  }
  selectedFile.value = file
}

const onFileDrop = (event) => {
  const file = event.dataTransfer.files?.[0]
  if (!file) return
  const err = validateFile(file)
  if (err) { 
    useToast().add({ title: 'Fichier invalide', description: err, color: 'red' })
    return 
  }
  selectedFile.value = file
}

const removeFile = () => {
  selectedFile.value = null
  if (fileInputRef.value) fileInputRef.value.value = ''
}

// ── Validation formulaire ──────────────────────────────────────────────────
const validateForm = () => {
  const newErrors = []
  
  if (!form.value.user_id) {
    newErrors.push('Veuillez sélectionner un utilisateur')
  }
  
  if (!form.value.entite_id) {
    newErrors.push('Veuillez sélectionner un point critique')
  }
  
  if (form.value.date_debut && form.value.date_fin) {
    if (new Date(form.value.date_fin) < new Date(form.value.date_debut)) {
      newErrors.push('La date de fin doit être après ou égale à la date de début')
    }
  }
  
  errors.value = newErrors
  return newErrors.length === 0
}

// ── Chargement ─────────────────────────────────────────────────────────────
const loadUsers = async () => {
  loadingUsers.value = true
  try {
    const res = await $fetch(`${config.public.apiBase || 'http://localhost:8000'}/api/users`, {
      method: 'GET',
      headers: { 
        Authorization: `Bearer ${getToken()}`, 
        Accept: 'application/json' 
      },
    })
    
    console.log('📦 Réponse API users complète:', res)
    
    let dataArray = []
    
    if (res?.data?.data && Array.isArray(res.data.data)) {
      dataArray = res.data.data
      console.log('📊 Format paginé détecté, utilisateurs:', dataArray.length)
    } else if (res?.data && Array.isArray(res.data)) {
      dataArray = res.data
      console.log('📊 Format simple détecté, utilisateurs:', dataArray.length)
    } else if (Array.isArray(res)) {
      dataArray = res
      console.log('📊 Format tableau direct détecté, utilisateurs:', dataArray.length)
    } else {
      console.error('❌ Format de réponse inconnu:', res)
      dataArray = []
    }
    
    users.value = dataArray
    console.log('✅ Utilisateurs chargés:', users.value.length)
    if (users.value.length > 0) {
      console.log('📋 Premier utilisateur:', users.value[0])
    }
    
  } catch (err) {
    console.error('❌ Erreur users:', err)
    useToast().add({ 
      title: 'Avertissement', 
      description: 'Impossible de charger les utilisateurs', 
      color: 'orange' 
    })
  } finally {
    loadingUsers.value = false
  }
}

const loadPointsCritiques = async () => {
  loadingPointsCritiques.value = true
  try {
    const res = await $fetch(`${config.public.apiBase || 'http://localhost:8000'}/api/points-critiques`, {
      method: 'GET',
      headers: { 
        Authorization: `Bearer ${getToken()}`, 
        Accept: 'application/json' 
      },
    })
    
    console.log('📦 Réponse API points critiques complète:', res)
    
    let dataArray = []
    
    if (res?.data?.data && Array.isArray(res.data.data)) {
      dataArray = res.data.data
      console.log('📊 Format paginé détecté, points critiques:', dataArray.length)
    } else if (res?.data && Array.isArray(res.data)) {
      dataArray = res.data
      console.log('📊 Format simple détecté, points critiques:', dataArray.length)
    } else if (Array.isArray(res)) {
      dataArray = res
      console.log('📊 Format tableau direct détecté, points critiques:', dataArray.length)
    } else {
      console.error('❌ Format de réponse inconnu:', res)
      dataArray = []
    }
    
    // Filtrer uniquement les entités critiques si ce n'est pas déjà fait côté API
    pointsCritiques.value = dataArray.filter(e => e.is_critique === true || e.is_critique === 1)
    console.log('✅ Points critiques chargés:', pointsCritiques.value.length)
    if (pointsCritiques.value.length > 0) {
      console.log('📋 Premier point critique:', pointsCritiques.value[0])
    }
    
  } catch (err) {
    console.error('❌ Erreur points critiques:', err)
    useToast().add({ 
      title: 'Avertissement', 
      description: 'Impossible de charger les points critiques', 
      color: 'orange' 
    })
  } finally {
    loadingPointsCritiques.value = false
  }
}

onMounted(async () => {
  try {
    await Promise.allSettled([loadUsers(), loadPointsCritiques()])
  } finally {
    loadingInitial.value = false
  }
})

// ── Soumission ─────────────────────────────────────────────────────────────
const handleSubmit = async () => {
  loading.value      = true
  errors.value       = []
  errorRequest.value = null

  try {
    if (!validateForm()) {
      useToast().add({ 
        title: 'Erreur de validation', 
        description: 'Veuillez remplir tous les champs obligatoires', 
        color: 'red' 
      })
      return
    }

    // ── Construire FormData ────────────────────────────────────────────────
    const formData = new FormData()
    
    // Champs obligatoires
    formData.append('user_id',   String(form.value.user_id))
    formData.append('entite_id', String(form.value.entite_id))
    
    // Champs booléens (1 ou 0)
    formData.append('statut',     form.value.actif ? '1' : '0')
    formData.append('is_interim', form.value.is_interim ? '1' : '0')

    // Dates optionnelles
    if (form.value.date_debut) {
      formData.append('date_debut', form.value.date_debut)
    }
    
    if (form.value.date_fin) {
      formData.append('date_fin', form.value.date_fin)
    }

    // Fichier optionnel
    if (selectedFile.value instanceof File) {
      formData.append('piece_jointe', selectedFile.value)
      console.log('📎 Fichier ajouté:', selectedFile.value.name, formatFileSize(selectedFile.value.size))
    }

    console.log('📤 Envoi de l\'assignation...')

    const response = await $fetch(
      `${config.public.apiBase || 'http://localhost:8000'}/api/point-critique-user`,
      {
        method:  'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`,
          Accept:        'application/json',
          // Ne pas définir Content-Type, laissez le navigateur le faire pour FormData
        },
        body: formData,
      }
    )

    console.log('✅ Réponse du serveur:', response)

    // si response sucess false fais un toast du message d'erreur sinon affiche le modal de succès
    if (response.success === false) {
      throw new Error(response.message || 'Erreur lors de la création')
    }


    if (response.success) {
      showSuccessModal.value = true
      useToast().add({ 
        title: 'Succès', 
        description: 'L\'assignation a été créée avec succès', 
        color: 'green' 
      })

      // Reset du formulaire
      form.value = { 
        user_id: null, 
        entite_id: null, 
        date_debut: '', 
        date_fin: '', 
        actif: true, 
        is_interim: false 
      }
      removeFile()
    } else {
      throw new Error(response.message || 'Erreur lors de la création')
    }

  } catch (error) {
    console.error('❌ Erreur assignation:', error)
    errorRequest.value = error

    if (error.data?.errors) {
      // Erreurs de validation Laravel
      errors.value = Object.values(error.data.errors).flat()
      useToast().add({ 
        title: 'Erreur de validation', 
        description: errors.value[0], 
        color: 'red' 
      })
    } else if (error.data?.message) {
      // Message d'erreur du serveur
      useToast().add({
        title: 'Erreur',
        description: error.data.message,
        color: 'red',
      })
    } else {
      // Erreur générique
      useToast().add({
        title: 'Erreur d\'assignation',
        description: error.message || 'Une erreur inattendue est survenue.',
        color: 'red',
      })
    }
  } finally {
    loading.value = false
  }
}

const handleCancel = () => navigateTo('/point-critique')
</script>