<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto p-6">
      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left Column: Form (col-6) -->
        <div class="lg:col-span-6">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">

            <PageHeader 
              title="Création d'un Point Critique" 
              subtitle="Gestion des points critiques"
              to="/point-critique" 
              btn-text="Retour à la liste" 
            />

            <form @submit.prevent="handleSubmit" class="space-y-4">
              <!-- Code/Sigle -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Sigle *
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
             <!--  <div>
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
              </div> -->

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
                  :disabled="!isFormValid || loading" 
                  type="submit"
                  class="bg-gradient-to-br from-emerald-800 to-blue-800 text-white dark:text-white" 
                  :loading="loading"
                >
                  SAUVEGARDER
                </UButton>
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
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Informations sur les entités</h3>
            <div class="space-y-4">
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 class="font-medium text-blue-800 mb-2">À propos des entités</h4>
                <p class="text-sm text-blue-700">
                  Les entités représentent les différentes unités organisationnelles de votre structure.
                  Chaque entité peut avoir une entité parent pour établir une hiérarchie claire.
                </p>
              </div>

              <!-- Informations sur les champs -->
              <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 class="font-medium text-purple-800 mb-2">Guide des champs</h4>
                <ul class="space-y-2 text-sm text-purple-700">
                  <li><strong>Code :</strong> Identifiant unique court (ex: DIR, DRH)</li>
                  <li><strong>Libellé :</strong> Nom complet de l'entité</li>
                  <li><strong>Fonction :</strong> Rôle ou mission de l'entité (optionnel)</li>
                  <li><strong>Entité Parent :</strong> Position dans la hiérarchie (optionnel)</li>
                  <li><strong>Critique :</strong> Entité essentielle au fonctionnement</li>
                </ul>
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
              
              <div v-else class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 class="font-medium text-yellow-800 mb-2">Aucune entité disponible</h4>
                <p class="text-sm text-yellow-700">
                  Cette entité sera la première de la hiérarchie.
                </p>
              </div>
              
              <!-- Affichage de l'entité parent sélectionnée -->
              <!-- <div v-if="selectedParent" class="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
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
                    <span 
                      v-if="selectedParent.is_critique"
                      class="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-red-100 text-red-800"
                    >
                      Entité critique
                    </span>
                  </div>
                </div>
              </div> -->

              <!-- Aperçu de la nouvelle entité -->
              <div v-if="form.code || form.libelle" class="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <h4 class="font-medium text-slate-800 mb-2">Aperçu</h4>
                <div class="space-y-2 text-sm">
                  <div v-if="form.code" class="flex items-center space-x-2">
                    <span class="text-slate-600">Code:</span>
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
                  <!-- <div v-if="form.is_critique" class="flex items-center space-x-2">
                    <span class="px-2 py-1 text-xs rounded bg-red-100 text-red-800 font-semibold">
                      🔴 Entité critique
                    </span>
                  </div> -->
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
  title: "Nouvelle Entité - Sagar Revolution",
});

// ✅ ÉTATS
const loading = ref(false);
const errorRequest = ref(null);
const selectedParent = ref(null);
const formErrors = ref({});

// Form data avec TOUS les champs de la migration
const form = ref({
  code: '',                    // STRING - obligatoire
  libelle: '',                 // STRING - obligatoire
  fonction: '',                // STRING - optionnel
  parent_entite_id: null,      // UNSIGNEDBIGINTEGER - optionnel
  is_critique: false           // BOOLEAN - par défaut false
});

// Liste des entités
const entitesList = ref([]);
const entitesOptions = ref([]);

// Formater les options pour USelectMenu
const formatEntitesOptions = (entitesList) => {
  return entitesList.map(entite => ({
    id: entite.id,
    display: `${entite.code} - ${entite.libelle}`,
    code: entite.code,
    libelle: entite.libelle,
    fonction: entite.fonction,
    is_critique: entite.is_critique
  }));
};

// Gérer la sélection de l'entité parent
const handleParentSelect = (selectedOption) => {
  console.log('Entité parent sélectionnée:', selectedOption);
  
  if (selectedOption && selectedOption.id) {
    form.value.parent_entite_id = selectedOption.id;
    selectedParent.value = selectedOption;
    // Effacer l'erreur sur ce champ
    delete formErrors.value.parent_entite_id;
  } else {
    form.value.parent_entite_id = null;
    selectedParent.value = null;
  }
};

// Obtenir les initiales
const getInitials = (text) => {
  if (!text) return '';
  return text.split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Charger les entités existantes
const loadEntites = async () => {
  try {
    console.log('Chargement des entités...');
    
    const token = process.client ? localStorage.getItem('auth_token') : '';
    
    if (!token) {
      console.warn('Token non trouvé');
      return;
    }

    // Appel API
    const response = await $fetch('http://127.0.0.1:8000/api/entites', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    console.log('Réponse API entités:', response);

    // Traiter la réponse
    let entitesData = [];
    
    if (response && response.data && Array.isArray(response.data)) {
      entitesData = response.data;
    } else if (Array.isArray(response)) {
      entitesData = response;
    } else if (response && response.success && Array.isArray(response.data)) {
      entitesData = response.data;
    }

    if (entitesData.length > 0) {
      // Formater les données avec TOUS les champs
      entitesList.value = entitesData.map(entite => ({
        id: entite.id,
        code: entite.code || '',
        libelle: entite.libelle || '',
        fonction: entite.fonction || '',
        parent_entite_id: entite.parent_entite_id,
        is_critique: entite.is_critique || false
      })).filter(entite => entite.code);
      
      console.log('Entités chargées depuis API:', entitesList.value.length);
    }

  } catch (error) {
    console.error('Erreur lors du chargement des entités:', error);
  } finally {
    entitesOptions.value = formatEntitesOptions(entitesList.value);
    console.log('Options formatées:', entitesOptions.value.length);
  }
};

// Charger les entités au montage
onMounted(async () => {
  await loadEntites();
});

// Validation du formulaire
const isFormValid = computed(() => {
  return (
    form.value.code.trim() !== '' &&
    form.value.libelle.trim() !== ''
  );
});

const validateForm = () => {
  const errors = {};
  
  if (!form.value.code || form.value.code.trim().length < 2) {
    errors.code = "Le code est obligatoire (minimum 2 caractères)";
  }
  
  if (!form.value.libelle || form.value.libelle.trim() === '') {
    errors.libelle = "Le libellé est obligatoire";
  }
  
  if (form.value.fonction && form.value.fonction.length > 255) {
    errors.fonction = "La fonction ne peut pas dépasser 255 caractères";
  }
  
  formErrors.value = errors;
  return Object.keys(errors).length === 0;
};

// Soumission du formulaire
const handleSubmit = async () => {
  loading.value = true;
  formErrors.value = {};
  errorRequest.value = null;

  try {
    // Valider le formulaire
    if (!validateForm()) {
      useToast().add({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires",
        color: "red",
      });
      loading.value = false;
      return;
    }

    // Vérifier si le code existe déjà
    const codeExists = entitesList.value.some(entite => 
      entite.code.toLowerCase() === form.value.code.trim().toLowerCase()
    );
    
    if (codeExists) {
      useToast().add({
        title: "Erreur",
        description: `Le code "${form.value.code}" existe déjà`,
        color: "red",
      });
      loading.value = false;
      return;
    }

    // Préparer les données selon la migration et le contrôleur
    const data = {
      code: form.value.code.trim(),
      libelle: form.value.libelle.trim(),
      fonction: form.value.fonction.trim() || null,
      parent_entite_id: form.value.parent_entite_id || null,
      // is_critique: form.value.is_critique
    };

    console.log('🚀 Données à envoyer:', data);
    
    // Récupérer le token
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('Token d\'authentification non trouvé');
    }

    // APPEL API
    const response = await $fetch('http://127.0.0.1:8000/api/points-critiques', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: data
    });

    console.debug('✅ Réponse API:', response);

    // Vérifier le succès
    if (response.success || response.data?.id || response.id) {
      useToast().add({
        title: "Succès",
        description: response.message || "L'entité a été créée avec succès",
        color: "green",
      });

      // Ajouter la nouvelle entité à la liste locale
      const newEntite = {
        id: response.id || response.data?.id || Date.now(),
        code: form.value.code,
        libelle: form.value.libelle,
        fonction: form.value.fonction,
        parent_entite_id: form.value.parent_entite_id,
        // is_critique: form.value.is_critique
      };
      
      entitesList.value = [newEntite, ...entitesList.value];
      entitesOptions.value = formatEntitesOptions(entitesList.value);

      // Réinitialiser le formulaire
      form.value = {
        code: '',
        libelle: '',
        fonction: '',
        parent_entite_id: null,
        // is_critique: false
      };
      
      selectedParent.value = null;
      formErrors.value = {};
      
      navigateTo('/point-critique');

      // Rediriger vers la liste après 1.5 secondes
      // setTimeout(() => {
      //   navigateTo('/point-critique');
      // }, 1500);

    } else {
      throw new Error(response.message || "Erreur lors de la création");
    }

  } catch (error) {
    console.error("❌ Erreur lors de la soumission:", error);
    errorRequest.value = error;
    
    // Gestion des erreurs de validation (422)
    if (error.status === 422 || error.statusCode === 422) {
      const validationErrors = error.data?.errors || error.response?.data?.errors || {};
      
      console.log('📋 Erreurs de validation reçues:', validationErrors);
      
      const errors = {};
      
      for (const [field, messages] of Object.entries(validationErrors)) {
        if (Array.isArray(messages) && messages.length > 0) {
          errors[field] = messages[0];
        } else if (typeof messages === 'string') {
          errors[field] = messages;
        }
      }
      
      formErrors.value = errors;
      
      useToast().add({
        title: "Erreur de validation",
        description: Object.values(errors)[0] || "Veuillez vérifier les informations saisies",
        color: "red",
      });
    } 
    // Erreur d'authentification (401)
    else if (error.status === 401 || error.statusCode === 401) {
      useToast().add({
        title: "Session expirée",
        description: "Veuillez vous reconnecter",
        color: "red",
      });
      
      setTimeout(() => {
        navigateTo('/login');
      }, 1500);
    }
    // Autres erreurs
    else {
      const errorMessage = error.data?.message || error.message || "Une erreur inattendue s'est produite";
      
      useToast().add({
        title: "Erreur",
        description: errorMessage,
        color: "red",
      });
      
      console.error('Détails de l\'erreur:', {
        status: error.status || error.statusCode,
        message: errorMessage,
        data: error.data,
        response: error.response
      });
    }
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  navigateTo("/entites");
};
</script>