<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto p-6">
      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left Column: Form (col-6) -->
        <div class="lg:col-span-6">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">

            <PageHeader 
              title="Modification d'un Point Critique" 
              subtitle="Gestion des points critiques"
              to="/point-critique" 
              btn-text="Retour à la liste" 
            />

            <!-- Loading State -->
            <div v-if="loadingInitial" class="flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
              <div class="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <span class="text-sm font-medium">Chargement des données...</span>
            </div>

            <form v-else @submit.prevent="handleSubmit" class="space-y-4 mt-6">
              <!-- Code/Sigle -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Sigle *
                </label>
                <input 
                  v-model="form.code" 
                  type="text"
                  placeholder="Entrez le code de l'entité (ex: DIR, DRH)" 
                  class="w-full h-12 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :disabled="loading"
                  @input="form.code = form.code.toUpperCase()"
                />
                <p v-if="formErrors.code" class="text-red-600 text-sm font-bold mt-1">
                  {{ formErrors.code }}
                </p>
              </div>

              <!-- Libellé -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Libellé *
                </label>
                <input 
                  v-model="form.libelle" 
                  type="text"
                  placeholder="Entrez le libellé complet de l'entité" 
                  class="w-full h-12 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :disabled="loading"
                />
                <p v-if="formErrors.libelle" class="text-red-600 text-sm font-bold mt-1">
                  {{ formErrors.libelle }}
                </p>
              </div>

              <!-- Fonction -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Fonction
                </label>
                <input 
                  v-model="form.fonction" 
                  type="text"
                  placeholder="Entrez la fonction de l'entité (optionnel)" 
                  class="w-full h-12 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :disabled="loading"
                />
                <p v-if="formErrors.fonction" class="text-red-600 text-sm font-bold mt-1">
                  {{ formErrors.fonction }}
                </p>
              </div>

              <!-- Entité Parent -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Entité Parent
                </label>
                <select 
                  v-model="form.parent_entite_id"
                  class="w-full h-12 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  :disabled="loading"
                >
                  <option :value="null">Sélectionner l'entité parent (optionnel)</option>
                  <option 
                    v-for="entite in entitesList" 
                    :key="entite.id" 
                    :value="entite.id"
                  >
                    {{ entite.code }} - {{ entite.libelle }}
                  </option>
                </select>
                <p v-if="formErrors.parent_entite_id" class="text-red-600 text-sm font-bold mt-1">
                  {{ formErrors.parent_entite_id }}
                </p>
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-center space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button" 
                  @click="handleCancel" 
                  class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  :disabled="loading"
                >
                  ANNULER
                </button>
                <button
                  :disabled="!isFormValid || loading" 
                  type="submit"
                  class="px-6 py-2 bg-gradient-to-br from-emerald-800 to-blue-800 text-white rounded-md hover:from-emerald-900 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  :class="{ 'opacity-50 cursor-not-allowed': !isFormValid || loading }"
                >
                  <span v-if="loading">Chargement...</span>
                  <span v-else>METTRE À JOUR</span>
                </button>
              </div>

              <!-- Error Messages -->
              <div v-if="Object.keys(formErrors).length > 0" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 class="text-sm font-semibold text-red-800 mb-2">Erreurs de validation :</h4>
                <ul class="list-disc list-inside text-sm text-red-600">
                  <li v-for="(error, field) in formErrors" :key="field">
                    {{ error }}
                  </li>
                </ul>
              </div>

              <!-- Error Request Message -->
              <div v-if="errorRequest" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-sm text-red-600">
                  <strong>Erreur serveur :</strong>
                  {{ errorRequest.message || errorRequest.data?.message || 'Une erreur est survenue' }}
                </p>
              </div>
            </form>
          </div>
        </div>

        <!-- Right Column: Information Panel -->
        <div class="lg:col-span-6">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Informations sur les points critiques</h3>
            <div class="space-y-4">
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 class="font-medium text-blue-800 mb-2">À propos des points critiques</h4>
                <p class="text-sm text-blue-700">
                  Les points critiques sont des entités essentielles au fonctionnement de votre organisation.
                  Ils nécessitent une attention particulière et une gestion rigoureuse.
                </p>
              </div>

              <!-- Informations sur les champs -->
              <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 class="font-medium text-purple-800 mb-2">Guide des champs</h4>
                <ul class="space-y-2 text-sm text-purple-700">
                  <li><strong>Sigle :</strong> Identifiant unique court (ex: DIR, DRH)</li>
                  <li><strong>Libellé :</strong> Nom complet du point critique</li>
                  <li><strong>Fonction :</strong> Rôle ou mission du point critique (optionnel)</li>
                  <li><strong>Entité Parent :</strong> Position dans la hiérarchie (optionnel)</li>
                </ul>
              </div>

              <!-- Aperçu des modifications -->
              <div v-if="form.code || form.libelle" class="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <h4 class="font-medium text-slate-800 mb-2">Aperçu des modifications</h4>
                <div class="space-y-2 text-sm">
                  <div v-if="form.code" class="flex items-center space-x-2">
                    <span class="text-slate-600">Sigle:</span>
                    <span class="font-semibold text-slate-900">{{ form.code }}</span>
                  </div>
                  <div v-if="form.libelle" class="flex items-center space-x-2">
                    <span class="text-slate-600">Libellé:</span>
                    <span class="font-semibold text-slate-900">{{ form.libelle }}</span>
                  </div>
                  <div v-if="form.fonction" class="flex items-center space-x-2">
                    <span class="text-slate-600">Fonction:</span>
                    <span class="font-semibold text-slate-900">{{ form.fonction }}</span>
                  </div>
                  <div v-if="selectedParentName" class="flex items-center space-x-2">
                    <span class="text-slate-600">Entité parent:</span>
                    <span class="font-semibold text-slate-900">{{ selectedParentName }}</span>
                  </div>
                </div>
              </div>

              <!-- Affichage des entités disponibles -->
              <div v-if="entitesList.length > 0" class="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <h4 class="font-medium text-emerald-800 mb-2">Entités disponibles ({{ entitesList.length }})</h4>
                <div class="space-y-2 max-h-40 overflow-y-auto">
                  <div 
                    v-for="entite in entitesList.slice(0, 10)" 
                    :key="entite.id" 
                    class="flex items-center justify-between text-sm p-2 hover:bg-emerald-100 rounded"
                  >
                    <div class="flex flex-col flex-1 min-w-0">
                      <div class="flex items-center space-x-2">
                        <span class="font-semibold text-emerald-800">{{ entite.code }}</span>
                        <span 
                          v-if="entite.is_critique"
                          class="px-1.5 py-0.5 text-xs rounded bg-red-100 text-red-800"
                        >
                          Critique
                        </span>
                      </div>
                      <span class="text-xs text-gray-600 truncate">{{ entite.libelle }}</span>
                      <span v-if="entite.fonction" class="text-xs text-gray-500 italic truncate">{{ entite.fonction }}</span>
                    </div>
                  </div>
                  <p v-if="entitesList.length > 10" class="text-xs text-emerald-600 mt-2 text-center">
                    ... et {{ entitesList.length - 10 }} autres entités
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: "Modification d'un Point Critique - Sagar Revolution",
});

const route = useRoute()
const pointCritiqueId = route.params.id

// ✅ ÉTATS
const loading = ref(false)
const loadingInitial = ref(true)
const errorRequest = ref(null)
const formErrors = ref({})
const authToken = ref('')
const config = useRuntimeConfig()

// Form data
const form = ref({
  id: null,
  code: '',
  libelle: '',
  fonction: '',
  parent_entite_id: null,
})

// Liste des entités
const entitesList = ref([])

// ✅ COMPUTED
const isFormValid = computed(() => {
  return (
    form.value.code.trim() !== '' &&
    form.value.libelle.trim() !== ''
  )
})

const selectedParentName = computed(() => {
  if (!form.value.parent_entite_id) return null
  const parent = entitesList.value.find(e => e.id === form.value.parent_entite_id)
  return parent ? `${parent.code} - ${parent.libelle}` : null
})

// ✅ VALIDATION
const validateForm = () => {
  const errors = {}
  
  if (!form.value.code || form.value.code.trim().length < 2) {
    errors.code = "Le code est obligatoire (minimum 2 caractères)"
  }
  
  if (!form.value.libelle || form.value.libelle.trim() === '') {
    errors.libelle = "Le libellé est obligatoire"
  }
  
  if (form.value.fonction && form.value.fonction.length > 255) {
    errors.fonction = "La fonction ne peut pas dépasser 255 caractères"
  }
  
  formErrors.value = errors
  return Object.keys(errors).length === 0
}

// ✅ CHARGEMENT DES ENTITÉS
const loadEntites = async () => {
  try {
    console.log('🔄 Chargement des entités...')
    
    const response = await $fetch('http://127.0.0.1:8000/api/entites', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken.value}`,
        'Accept': 'application/json'
      }
    })

    console.log('📦 Réponse API entités:', response)

    let entitesData = []
    
    if (response && response.data && Array.isArray(response.data)) {
      entitesData = response.data
    } else if (Array.isArray(response)) {
      entitesData = response
    } else if (response && response.success && Array.isArray(response.data)) {
      entitesData = response.data
    }

    if (entitesData.length > 0) {
      entitesList.value = entitesData.map(entite => ({
        id: entite.id,
        code: entite.code || '',
        libelle: entite.libelle || '',
        fonction: entite.fonction || '',
        parent_entite_id: entite.parent_entite_id,
        is_critique: entite.is_critique || false
      })).filter(entite => entite.code)
      
      console.log('✅ Entités chargées:', entitesList.value.length)
    }

  } catch (error) {
    console.error('❌ Erreur chargement entités:', error)
    useToast().add({
      title: 'Erreur',
      description: 'Impossible de charger les entités',
      color: 'red'
    })
  }
}

// ✅ CHARGEMENT DU POINT CRITIQUE
const loadPointCritique = async () => {
  try {
    console.log('🔄 Chargement du point critique ID:', pointCritiqueId)
    
    const response = await $fetch(
      `http://127.0.0.1:8000/api/points-critiques/${pointCritiqueId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken.value}`,
          Accept: 'application/json'
        }
      }
    )

    console.log('📦 Réponse point critique:', response)

    const pointCritique = response.success ? response.data : (response.data || response)
    
    if (!pointCritique?.id) {
      throw new Error('Point critique non trouvé')
    }

    form.value = {
      id: pointCritique.id,
      code: pointCritique.code || '',
      libelle: pointCritique.libelle || '',
      fonction: pointCritique.fonction || '',
      parent_entite_id: pointCritique.parent_entite_id || null,
    }

    console.log('✅ Point critique chargé:', form.value)

  } catch (error) {
    console.error('❌ Erreur chargement point critique:', error)
    
    if (error.status === 401 || error.statusCode === 401) {
      useToast().add({
        title: 'Session expirée',
        description: 'Veuillez vous reconnecter',
        color: 'red'
      })
      setTimeout(() => navigateTo('/login'), 2000)
    } else {
      useToast().add({
        title: 'Erreur',
        description: 'Impossible de charger le point critique',
        color: 'red'
      })
      setTimeout(() => navigateTo('/point-critique'), 2000)
    }
  }
}

// ✅ MOUNTED
onMounted(async () => {
  if (!process.client) return
  
  authToken.value = localStorage.getItem('auth_token') || ''

  if (!authToken.value) {
    useToast().add({
      title: 'Non authentifié',
      description: 'Vous devez être connecté',
      color: 'red'
    })
    setTimeout(() => navigateTo('/login'), 1500)
    return
  }

  loadingInitial.value = true

  try {
    await Promise.all([
      loadEntites(),
      loadPointCritique()
    ])
  } finally {
    loadingInitial.value = false
  }
})

// ✅ SOUMISSION DU FORMULAIRE
const handleSubmit = async () => {
  loading.value = true
  formErrors.value = {}
  errorRequest.value = null

  console.log('=== DÉBUT MODIFICATION POINT CRITIQUE ===')
  console.log('Form data:', form.value)

  try {
    if (!validateForm()) {
      useToast().add({
        title: 'Erreur de validation',
        description: 'Veuillez remplir tous les champs obligatoires',
        color: 'red',
      })
      return
    }

    const data = {
      code: form.value.code.trim(),
      libelle: form.value.libelle.trim(),
      fonction: form.value.fonction.trim() || null,
      parent_entite_id: form.value.parent_entite_id || null,
    }

    console.log('Données à envoyer:', data)

    const response = await $fetch(
      `http://127.0.0.1:8000/api/points-critiques/${pointCritiqueId}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken.value}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      }
    )

    console.log('Réponse API:', response)

    if (response.success || response.data) {
      useToast().add({
        title: 'Succès',
        description: 'Le point critique a été modifié avec succès',
        color: 'green'
      })

      setTimeout(() => {
        navigateTo('/point-critique')
      }, 1500)
    } else {
      throw new Error(response.message || 'Erreur lors de la mise à jour')
    }

  } catch (error) {
    console.error('=== ERREUR MODIFICATION ===')
    console.error('Error object:', error)
    console.error('Error data:', error.data)
    
    errorRequest.value = error
    
    if (error.status === 422 || error.statusCode === 422) {
      const validationErrors = error.data?.errors || {}
      
      const errors = {}
      for (const [field, messages] of Object.entries(validationErrors)) {
        if (Array.isArray(messages) && messages.length > 0) {
          errors[field] = messages[0]
        } else if (typeof messages === 'string') {
          errors[field] = messages
        }
      }
      
      formErrors.value = errors
      
      useToast().add({
        title: 'Erreur de validation',
        description: Object.values(errors)[0] || 'Veuillez vérifier les informations saisies',
        color: 'red',
      })
    } else if (error.status === 401 || error.statusCode === 401) {
      useToast().add({
        title: 'Session expirée',
        description: 'Veuillez vous reconnecter',
        color: 'red',
      })
      setTimeout(() => navigateTo('/login'), 1500)
    } else {
      const errorMessage = error.data?.message || error.message || 'Une erreur inattendue s\'est produite'
      
      useToast().add({
        title: 'Erreur',
        description: errorMessage,
        color: 'red',
      })
    }
  } finally {
    loading.value = false
    console.log('=== FIN MODIFICATION ===')
  }
}

const handleCancel = () => {
  navigateTo('/point-critique')
}
</script>