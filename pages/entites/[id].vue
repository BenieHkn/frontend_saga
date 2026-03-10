<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto p-6">
      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left Column: Form (col-6) -->
        <div class="lg:col-span-6">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">

            <!-- <PageHeader 
              title="Modification d'une Entité" 
              subtitle="Mise à jour des informations de l'entité"
              to="/entites" 
              btn-text="Retour à la liste" 
            /> -->
           <div class="flex justify-end">
               <UButton 
                  to="/entites" 
                  icon="i-heroicons-arrow-left"
                  color="green"
                  variant="soft"
                >
                Retour à la liste
                </UButton>
            </div>


            <!-- Loading State -->
            <div v-if="loadingData" class="flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
              <div class="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <span class="text-sm font-medium">Chargement des données...</span>
            </div>

            <!-- Error State -->
            <div v-else-if="loadError" class="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm text-red-600">
                <strong>Erreur de chargement :</strong> {{ loadError }}
              </p>
              <UButton 
                @click="loadEntiteData" 
                color="red" 
                variant="outline" 
                size="sm" 
                class="mt-3"
              >
                Réessayer
              </UButton>
            </div>

            <!-- Form -->
            <form v-else @submit.prevent="handleSubmit" class="space-y-4">
              <!-- Code/Sigle -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Code/Sigle *
                </label>
                <UInput 
                  v-model="form.code" 
                  placeholder="Entrez le code de l'entité (ex: DIR, DRH)" 
                  class="w-full h-12" 
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
                <UInput 
                  v-model="form.libelle" 
                  placeholder="Entrez le libellé complet de l'entité" 
                  class="w-full h-12" 
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
                <UInput 
                  v-model="form.fonction" 
                  placeholder="Entrez la fonction de l'entité (optionnel)" 
                  class="w-full h-12" 
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
                <USelectMenu 
                  v-model="selectedParent" 
                  :options="entitesOptions"
                  placeholder="Sélectionner l'entité parent (optionnel)"
                  class="w-full"
                  :ui="{ 
                    height: 'h-[42px]',
                    base: 'cursor-pointer'
                  }"
                  @update:model-value="handleParentSelect"
                >
                  <template #option="{ option }">
                    <div class="flex flex-col py-1">
                      <span class="font-semibold">{{ option.display }}</span>
                      <span class="text-xs text-gray-500 truncate">{{ option.fonction || option.libelle }}</span>
                    </div>
                  </template>
                </USelectMenu>
                <p v-if="formErrors.parent_entite_id" class="text-red-600 text-sm font-bold mt-1">
                  {{ formErrors.parent_entite_id }}
                </p>
              </div>

              <!-- Statut Critique -->
              <div>
                <label class="flex items-center space-x-3 cursor-pointer">
                  <UToggle 
                    v-model="form.is_critique" 
                    :disabled="loading"
                  />
                  <div>
                    <span class="text-sm font-medium text-gray-700">Entité critique</span>
                    <p class="text-xs text-gray-500">Marquer cette entité comme critique dans l'organisation</p>
                  </div>
                </label>
              </div>

              <!-- Informations de mise à jour -->
              <div v-if="originalData.created_at" class="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <span class="font-semibold">Créé le:</span>
                    {{ formatDate(originalData.created_at) }}
                  </div>
                  <div v-if="originalData.updated_at">
                    <span class="font-semibold">Modifié le:</span>
                    {{ formatDate(originalData.updated_at) }}
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-center space-x-4 pt-6 border-t border-gray-200">
                <UButton 
                  type="button" 
                  @click="handleCancel" 
                  color="gray" 
                  variant="outline"
                  :disabled="loading"
                >
                  ANNULER
                </UButton>
                <UButton 
                  :disabled="!isFormValid || !hasChanges || loading" 
                  type="submit"
                  class="bg-gradient-to-br from-emerald-800 to-blue-800 text-white dark:text-white" 
                  :loading="loading"
                >
                  METTRE À JOUR
                </UButton>
              </div>

              <!-- Change Indicator -->
              <div v-if="hasChanges" class="mt-2 text-center">
                <p class="text-xs text-orange-600 font-semibold">
                  ⚠️ Des modifications ont été effectuées
                </p>
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
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Informations</h3>
            <div class="space-y-4">
              
              <!-- Données originales -->
              <div v-if="!loadingData && originalData.id" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 class="font-medium text-blue-800 mb-3">Données actuelles</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex items-start justify-between">
                    <span class="text-blue-600 font-medium">Code:</span>
                    <span class="text-blue-900 font-semibold">{{ originalData.code }}</span>
                  </div>
                  <div class="flex items-start justify-between">
                    <span class="text-blue-600 font-medium">Libellé:</span>
                    <span class="text-blue-900 text-right">{{ originalData.libelle }}</span>
                  </div>
                  <div v-if="originalData.fonction" class="flex items-start justify-between">
                    <span class="text-blue-600 font-medium">Fonction:</span>
                    <span class="text-blue-900 text-right">{{ originalData.fonction }}</span>
                  </div>
                  <div class="flex items-start justify-between">
                    <span class="text-blue-600 font-medium">Parent:</span>
                    <span class="text-blue-900 text-right">{{ originalData.parent_entite || 'Aucun' }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-blue-600 font-medium">Statut:</span>
                    <span 
                      class="px-2 py-1 text-xs rounded font-semibold"
                      :class="originalData.is_critique ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'"
                    >
                      {{ originalData.is_critique ? '🔴 Critique' : 'Normal' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Guide des champs -->
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 class="font-medium text-blue-800 mb-2">Guide de modification</h4>
                <ul class="space-y-2 text-sm text-blue-700">
                  <li><strong>Code :</strong> Identifiant unique (modifiable avec précaution)</li>
                  <li><strong>Libellé :</strong> Nom complet de l'entité</li>
                  <li><strong>Fonction :</strong> Rôle ou mission (optionnel)</li>
                  <li><strong>Parent :</strong> Hiérarchie organisationnelle</li>
                  <li><strong>Critique :</strong> Importance stratégique</li>
                </ul>
              </div>

              <!-- Autres entités disponibles -->
              <div v-if="entitesList.length > 0" class="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <h4 class="font-medium text-emerald-800 mb-2">
                  Autres entités ({{ entitesList.length - 1 }})
                </h4>
                <div class="space-y-2 max-h-40 overflow-y-auto">
                  <div 
                    v-for="entite in entitesList.filter(e => e.id !== originalData.id).slice(0, 8)" 
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
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Entité parent sélectionnée -->
              <div v-if="selectedParent" class="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h4 class="font-medium text-indigo-800 mb-2">Entité parent sélectionnée</h4>
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span class="text-indigo-600 font-bold">{{ getInitials(selectedParent.display) }}</span>
                  </div>
                  <div class="flex-1">
                    <p class="font-semibold text-indigo-900">{{ selectedParent.display }}</p>
                    <p v-if="selectedParent.fonction" class="text-xs text-indigo-700">
                      {{ selectedParent.fonction }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Aperçu des modifications -->
              <div v-if="hasChanges" class="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 class="font-medium text-orange-800 mb-2">Modifications en cours</h4>
                <div class="space-y-2 text-sm">
                  <div v-if="form.code !== originalData.code" class="flex items-center space-x-2">
                    <span class="text-orange-600">Code:</span>
                    <span class="line-through text-gray-500">{{ originalData.code }}</span>
                    <span class="text-orange-700">→</span>
                    <span class="font-semibold text-orange-900">{{ form.code }}</span>
                  </div>
                  <div v-if="form.libelle !== originalData.libelle" class="flex items-center space-x-2">
                    <span class="text-orange-600">Libellé:</span>
                    <span class="line-through text-gray-500 truncate max-w-[100px]">{{ originalData.libelle }}</span>
                    <span class="text-orange-700">→</span>
                    <span class="font-semibold text-orange-900 truncate max-w-[100px]">{{ form.libelle }}</span>
                  </div>
                  <div v-if="form.fonction !== originalData.fonction" class="flex items-center space-x-2">
                    <span class="text-orange-600">Fonction:</span>
                    <span class="line-through text-gray-500">{{ originalData.fonction || 'Aucune' }}</span>
                    <span class="text-orange-700">→</span>
                    <span class="font-semibold text-orange-900">{{ form.fonction || 'Aucune' }}</span>
                  </div>
                  <div v-if="form.parent_entite_id !== originalData.parent_entite_id" class="flex items-center space-x-2">
                    <span class="text-orange-600">Parent:</span>
                    <span class="font-semibold text-orange-900">Modifié</span>
                  </div>
                  <div v-if="form.is_critique !== originalData.is_critique" class="flex items-center space-x-2">
                    <span class="text-orange-600">Statut:</span>
                    <span class="font-semibold text-orange-900">
                      {{ form.is_critique ? 'Devient critique' : 'N\'est plus critique' }}
                    </span>
                  </div>
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
import { useRoute } from 'vue-router'

const route = useRoute()
const entiteId = route.params.id
const config = useRuntimeConfig()

useHead({
  title: "Modification Entité - Sagar Revolution",
});

// ✅ ÉTATS
const loading = ref(false)
const loadingData = ref(true)
const loadError = ref(null)
const errorRequest = ref(null)
const selectedParent = ref(null)
const formErrors = ref({})

// Données originales (pour comparaison)
const originalData = ref({
  id: null,
  code: '',
  libelle: '',
  fonction: '',
  parent_entite_id: null,
  parent_entite: '',
  is_critique: false,
  created_at: null,
  updated_at: null
})

// Form data
const form = ref({
  code: '',
  libelle: '',
  fonction: '',
  parent_entite_id: null,
  is_critique: false
})

// Liste des entités
const entitesList = ref([])
const entitesOptions = ref([])

// Formater les options pour USelectMenu (exclure l'entité en cours d'édition)
const formatEntitesOptions = (entitesList, currentId) => {
  return entitesList
    .filter(entite => entite.id !== currentId)
    .map(entite => ({
      id: entite.id,
      display: `${entite.code} - ${entite.libelle}`,
      code: entite.code,
      libelle: entite.libelle,
      fonction: entite.fonction,
      is_critique: entite.is_critique
    }))
}

// Gérer la sélection de l'entité parent
const handleParentSelect = (selectedOption) => {
  console.log('Entité parent sélectionnée:', selectedOption)
  
  if (selectedOption && selectedOption.id) {
    form.value.parent_entite_id = selectedOption.id
    selectedParent.value = selectedOption
    delete formErrors.value.parent_entite_id
  } else {
    form.value.parent_entite_id = null
    selectedParent.value = null
  }
}

// Obtenir les initiales
const getInitials = (text) => {
  if (!text) return ''
  return text.split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

// Formater la date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Vérifier si le formulaire a des modifications
const hasChanges = computed(() => {
  return (
    form.value.code !== originalData.value.code ||
    form.value.libelle !== originalData.value.libelle ||
    form.value.fonction !== originalData.value.fonction ||
    form.value.parent_entite_id !== originalData.value.parent_entite_id ||
    form.value.is_critique !== originalData.value.is_critique
  )
})

// Charger les données de l'entité
const loadEntiteData = async () => {
  loadingData.value = true
  loadError.value = null

  try {
    const token = localStorage.getItem('auth_token')
    
    if (!token) {
      throw new Error('Token d\'authentification manquant')
    }

    console.log('🔄 Chargement de l\'entité ID:', entiteId)

    // Charger l'entité spécifique
    const response = await $fetch(`${config.public.apiBase}/entites/${entiteId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })

    console.log('📦 Réponse API:', response)

    // Extraire les données
    const entiteData = response.data || response

    if (!entiteData || !entiteData.id) {
      throw new Error('Données de l\'entité introuvables')
    }

    // Remplir les données originales
    originalData.value = {
      id: entiteData.id,
      code: entiteData.code || '',
      libelle: entiteData.libelle || '',
      fonction: entiteData.fonction || '',
      parent_entite_id: entiteData.parent_entite_id || null,
      parent_entite: entiteData.parent_libelle || entiteData.parentEntite?.libelle || 'Aucune',
      is_critique: entiteData.is_critique || false,
      created_at: entiteData.created_at,
      updated_at: entiteData.updated_at
    }

    // Pré-remplir le formulaire avec les données existantes
    form.value = {
      code: originalData.value.code,
      libelle: originalData.value.libelle,
      fonction: originalData.value.fonction,
      parent_entite_id: originalData.value.parent_entite_id,
      is_critique: originalData.value.is_critique
    }

    console.log('✅ Données chargées:', originalData.value)

    // Charger aussi la liste de toutes les entités pour le sélecteur
    await loadAllEntites()

  } catch (err) {
    console.error('❌ Erreur chargement:', err)
    loadError.value = err.message || 'Erreur lors du chargement de l\'entité'
    
    if (err.status === 401 || err.statusCode === 401) {
      useToast().add({
        title: "Session expirée",
        description: "Veuillez vous reconnecter",
        color: "red",
      })
      setTimeout(() => navigateTo('/login'), 1500)
    } else if (err.status === 404 || err.statusCode === 404) {
      useToast().add({
        title: "Entité introuvable",
        description: "L'entité demandée n'existe pas",
        color: "red",
      })
      setTimeout(() => navigateTo('/entites'), 1500)
    }
  } finally {
    loadingData.value = false
  }
}

// Charger toutes les entités pour le sélecteur
const loadAllEntites = async () => {
  try {
    const token = localStorage.getItem('auth_token')
    
    const response = await $fetch(`${config.public.apiBase}/entites`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })

    let entitesData = []
    
    if (response?.data && Array.isArray(response.data)) {
      entitesData = response.data
    } else if (Array.isArray(response)) {
      entitesData = response
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
      
      // Formater les options (en excluant l'entité en cours d'édition)
      entitesOptions.value = formatEntitesOptions(entitesList.value, originalData.value.id)

      // Pré-sélectionner l'entité parent si elle existe
      if (form.value.parent_entite_id) {
        selectedParent.value = entitesOptions.value.find(
          opt => opt.id === form.value.parent_entite_id
        ) || null
      }
      
      console.log('✅ Entités chargées:', entitesList.value.length)
      console.log('📋 Entité parent pré-sélectionnée:', selectedParent.value)
    }

  } catch (error) {
    console.error('Erreur lors du chargement des entités:', error)
  }
}

// Validation du formulaire
const isFormValid = computed(() => {
  return (
    form.value.code.trim() !== '' &&
    form.value.libelle.trim() !== ''
  )
})

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

// Soumission du formulaire
const handleSubmit = async () => {
  loading.value = true
  formErrors.value = {}
  errorRequest.value = null

  try {
    // Valider le formulaire
    if (!validateForm()) {
      useToast().add({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires",
        color: "red",
      })
      loading.value = false
      return
    }

    // Vérifier s'il y a des modifications
    if (!hasChanges.value) {
      useToast().add({
        title: "Aucune modification",
        description: "Aucun changement n'a été effectué",
        color: "orange",
      })
      loading.value = false
      return
    }

    // Vérifier si le code existe déjà (pour un autre ID)
    const codeExists = entitesList.value.some(entite => 
      entite.id !== originalData.value.id &&
      entite.code.toLowerCase() === form.value.code.trim().toLowerCase()
    )
    
    if (codeExists) {
      useToast().add({
        title: "Erreur",
        description: `Le code "${form.value.code}" est déjà utilisé par une autre entité`,
        color: "red",
      })
      loading.value = false
      return
    }

    // Préparer les données
    const data = {
      code: form.value.code.trim(),
      libelle: form.value.libelle.trim(),
      fonction: form.value.fonction.trim() || null,
      parent_entite_id: form.value.parent_entite_id || null,
      is_critique: form.value.is_critique
    }

    console.log('🚀 Données à envoyer:', data)
    
    const token = localStorage.getItem('auth_token')
    
    if (!token) {
      throw new Error('Token d\'authentification non trouvé')
    }

    // APPEL API PUT/PATCH
    const response = await $fetch(`${config.public.apiBase}/entites/${entiteId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: data
    })

    console.log('✅ Réponse API:', response)

    if (response.success || response.data?.id || response.id) {
      useToast().add({
        title: "Succès",
        description: response.message || "L'entité a été mise à jour avec succès",
        color: "green",
      })

      // Rediriger vers la liste après 1 seconde
      setTimeout(() => {
        navigateTo('/entites')
      }, 1000)

    } else {
      throw new Error(response.message || "Erreur lors de la mise à jour")
    }

  } catch (error) {
    console.error("❌ Erreur lors de la soumission:", error)
    errorRequest.value = error
    
    // Gestion des erreurs de validation (422)
    if (error.status === 422 || error.statusCode === 422) {
      const validationErrors = error.data?.errors || error.response?.data?.errors || {}
      
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
        title: "Erreur de validation",
        description: Object.values(errors)[0] || "Veuillez vérifier les informations saisies",
        color: "red",
      })
    } 
    else if (error.status === 401 || error.statusCode === 401) {
      useToast().add({
        title: "Session expirée",
        description: "Veuillez vous reconnecter",
        color: "red",
      })
      
      setTimeout(() => {
        navigateTo('/login')
      }, 1500)
    }
    else {
      const errorMessage = error.data?.message || error.message || "Une erreur inattendue s'est produite"
      
      useToast().add({
        title: "Erreur",
        description: errorMessage,
        color: "red",
      })
    }
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  if (hasChanges.value) {
    if (confirm('Des modifications non sauvegardées seront perdues. Continuer ?')) {
      navigateTo('/entites')
    }
  } else {
    navigateTo('/entites')
  }
}

// Charger les données au montage
onMounted(async () => {
  await loadEntiteData()
})
</script>