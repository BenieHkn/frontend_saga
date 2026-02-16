<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto p-6">
      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left Column: Form (col-6) -->
        <div class="lg:col-span-6">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">

            <PageHeader 
              title="Création d'une Fonction" 
              subtitle="Gestion des fonctions organisationnelles"
              to="/fonctions" 
              btn-text="Retour à la liste" 
            />

            <form @submit.prevent="handleSubmit" class="space-y-4">
              <!-- Entité -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Entité *
                </label>
                <USelectMenu 
                  v-model="selectedEntite" 
                  :options="entitesOptions"
                  placeholder="Sélectionner l'entité"
                  class="w-full"
                  :ui="{ 
                    height: 'h-[42px]',
                    base: 'cursor-pointer'
                  }"
                  @update:model-value="handleEntiteSelect"
                >
                  <template #option="{ option }">
                    <div class="flex flex-col py-1">
                      <span class="font-semibold">{{ option.display }}</span>
                      <span class="text-xs text-gray-500 truncate">{{ option.description || option.libelle }}</span>
                    </div>
                  </template>
                </USelectMenu>
                <p v-if="formErrors.entite_id" class="text-red-600 text-sm font-bold mt-1">
                  {{ formErrors.entite_id }}
                </p>
              </div>

              <!-- Code -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Sigle *
                </label>
                <UInput 
                  v-model="form.code" 
                  placeholder="Entrez le code de la fonction (ex: DG, RH)" 
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
                  placeholder="Entrez le libellé complet" 
                  class="w-full h-12" 
                  :disabled="loading"
                />
                <p v-if="formErrors.libelle" class="text-red-600 text-sm font-bold mt-1">
                  {{ formErrors.libelle }}
                </p>
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

              <!-- Debug Info (à retirer en production) -->
              <div v-if="showDebug" class="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h4 class="text-sm font-semibold text-gray-800 mb-2">Debug Info:</h4>
                <pre class="text-xs text-gray-600 overflow-auto">{{ debugInfo }}</pre>
              </div>
            </form>
          </div>
        </div>

        <!-- Right Column: Information Panel -->
        <div class="lg:col-span-6">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Informations sur les fonctions</h3>
            <div class="space-y-4">
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 class="font-medium text-blue-800 mb-2">À propos des fonctions</h4>
                <p class="text-sm text-blue-700">
                  Les fonctions représentent les différents postes et rôles au sein d'une entité.
                  Chaque fonction est rattachée à une entité spécifique et définit les responsabilités associées.
                </p>
              </div>

              <!-- Affichage des entités disponibles -->
              <div v-if="entites.length > 0" class="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <h4 class="font-medium text-emerald-800 mb-2">Entités disponibles ({{ entites.length }})</h4>
                <div class="space-y-2 max-h-40 overflow-y-auto">
                  <div 
                    v-for="entite in entites.slice(0, 10)" 
                    :key="entite.id" 
                    class="flex items-center justify-between text-sm p-2 hover:bg-emerald-100 rounded"
                  >
                    <div class="flex flex-col flex-1 min-w-0">
                      <div class="flex items-center space-x-2">
                        <span class="font-semibold text-emerald-800">{{ entite.code || entite.sigle }}</span>
                        <span 
                          class="px-1.5 py-0.5 text-xs rounded" 
                          :class="entite.statut === 'inactif' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'"
                        >
                          {{ entite.statut || 'actif' }}
                        </span>
                      </div>
                      <span class="text-xs text-gray-600 truncate">{{ entite.libelle || entite.nom }}</span>
                    </div>
                    <div class="flex items-center space-x-2 ml-2">
                      <span class="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        {{ getTypeLabel(entite.type_entite || entite.type) }}
                      </span>
                    </div>
                  </div>
                  <p v-if="entites.length > 10" class="text-xs text-emerald-600 mt-2 text-center">
                    ... et {{ entites.length - 10 }} autres entités
                  </p>
                </div>
              </div>
              
              <div v-else class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 class="font-medium text-yellow-800 mb-2">Aucune entité disponible</h4>
                <p class="text-sm text-yellow-700">
                  Vous devez créer une entité avant de créer une fonction.
                </p>
              </div>
              
              <!-- Affichage de l'entité sélectionnée -->
              <div v-if="selectedEntite" class="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h4 class="font-medium text-indigo-800 mb-2">Entité sélectionnée</h4>
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span class="text-indigo-600 font-bold">{{ getInitials(selectedEntite.display) }}</span>
                  </div>
                  <div class="flex-1">
                    <p class="font-semibold text-indigo-900">{{ selectedEntite.display }}</p>
                    <p class="text-xs text-indigo-700">
                      {{ getTypeLabel(selectedEntite.type) }} • {{ selectedEntite.statut === 'actif' ? 'Actif' : 'Inactif' }}
                    </p>
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
useHead({
  title: "Nouvelle Fonction - Sagar Revolution",
});

// ✅ ÉTATS
const loading = ref(false);
const errorRequest = ref(null);
const selectedEntite = ref(null);
const formErrors = ref({});
const showDebug = ref(false); // Mettre à true pour voir les infos de debug
const debugInfo = ref({});

// Form data - EXACTEMENT comme attendu par l'API
const form = ref({
  code: '',        // ⚠️ Champ "code" (pas "sigle")
  libelle: '',     // ⚠️ Champ "libelle"
  entite_id: '',   // ⚠️ Champ "entite_id" (STRING selon votre curl)
  description: ''  // Optionnel
});

// Liste des entités
const entites = ref([]);
const entitesOptions = ref([]);

// MÉTADONNÉES DES ENTITÉS (fallback)
const entitesMetadata = [
  {
    id: 1,
    code: 'DIR',
    sigle: 'DIR',
    libelle: 'Direction Générale',
    nom: 'Direction Générale',
    description: 'Entité de direction générale de l\'organisation',
    type_entite: 'direction',
    type: 'direction',
    statut: 'actif'
  },
  {
    id: 2,
    code: 'DRH',
    sigle: 'DRH',
    libelle: 'Direction des Ressources Humaines',
    nom: 'Direction des Ressources Humaines',
    description: 'Gestion des ressources humaines et du personnel',
    type_entite: 'direction',
    type: 'direction',
    statut: 'actif'
  },
  {
    id: 3,
    code: 'DFIN',
    sigle: 'DFIN',
    libelle: 'Direction Financière',
    nom: 'Direction Financière',
    description: 'Gestion des finances et de la comptabilité',
    type_entite: 'direction',
    type: 'direction',
    statut: 'actif'
  },
  {
    id: 4,
    code: 'DTECH',
    sigle: 'DTECH',
    libelle: 'Direction Technique',
    nom: 'Direction Technique',
    description: 'Gestion des projets techniques et de l\'innovation',
    type_entite: 'direction',
    type: 'direction',
    statut: 'actif'
  },
  {
    id: 5,
    code: 'SCOM',
    sigle: 'SCOM',
    libelle: 'Service Communication',
    nom: 'Service Communication',
    description: 'Communication interne et externe de l\'organisation',
    type_entite: 'service',
    type: 'service',
    statut: 'actif'
  }
];

// Formater les options pour USelectMenu
const formatEntitesOptions = (entitesList) => {
  return entitesList.map(entite => ({
    id: entite.id,
    display: `${entite.code || entite.sigle} - ${entite.libelle || entite.nom}`,
    code: entite.code || entite.sigle,
    libelle: entite.libelle || entite.nom,
    description: entite.description,
    type: entite.type_entite || entite.type,
    statut: entite.statut
  }));
};

// Gérer la sélection d'entité
const handleEntiteSelect = (selectedOption) => {
  console.log('Entité sélectionnée:', selectedOption);
  
  if (selectedOption && selectedOption.id) {
    // ⚠️ IMPORTANT: Convertir l'ID en STRING comme attendu par l'API
    form.value.entite_id = String(selectedOption.id);
    selectedEntite.value = selectedOption;
    // Effacer l'erreur sur ce champ
    delete formErrors.value.entite_id;
  } else {
    form.value.entite_id = '';
    selectedEntite.value = null;
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

// Obtenir le label du type d'entité
const getTypeLabel = (typeValue) => {
  const typeLabels = {
    direction: 'Direction',
    service: 'Service',
    bureau: 'Bureau',
    cellule: 'Cellule'
  };
  return typeLabels[typeValue] || typeValue;
};

// Charger les entités existantes
const loadEntites = async () => {
  try {
    console.log('Chargement des entités...');
    
    const token = process.client ? localStorage.getItem('auth_token') : '';
    
    if (!token) {
      console.warn('Token non trouvé, utilisation des métadonnées');
      entites.value = entitesMetadata;
      entitesOptions.value = formatEntitesOptions(entitesMetadata);
      return;
    }

    // Essayer l'API
    const response = await $fetch('http://localhost:8000/api/entites', {
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
      // Formater les données
      entites.value = entitesData.map(entite => ({
        id: entite.id,
        code: entite.code || entite.sigle || '',
        sigle: entite.code || entite.sigle || '',
        libelle: entite.libelle || entite.name || '',
        nom: entite.libelle || entite.name || entite.nom || '',
        description: entite.description || '',
        type_entite: entite.type_entite || entite.type || 'direction',
        statut: entite.statut || 'actif'
      })).filter(entite => entite.code);
      
      console.log('Entités chargées depuis API:', entites.value.length);
    } else {
      console.log('Aucune donnée API, utilisation des métadonnées');
      entites.value = entitesMetadata;
    }

  } catch (error) {
    console.error('Erreur lors du chargement des entités:', error);
    entites.value = entitesMetadata;
  } finally {
    entitesOptions.value = formatEntitesOptions(entites.value);
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
    form.value.entite_id !== '' &&
    form.value.code.trim() !== '' &&
    form.value.libelle.trim() !== ''
  );
});

const validateForm = () => {
  const errors = {};
  
  if (!form.value.entite_id || form.value.entite_id === '') {
    errors.entite_id = "L'entité est obligatoire";
  }
  
  if (!form.value.code || form.value.code.trim().length < 2) {
    errors.code = "Le code est obligatoire (minimum 2 caractères)";
  }
  
  if (!form.value.libelle || form.value.libelle.trim() === '') {
    errors.libelle = "Le libellé est obligatoire";
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

    // ⚠️ IMPORTANT: Préparer les données EXACTEMENT comme dans le curl
    const data = {
      code: form.value.code.trim(),              // STRING
      libelle: form.value.libelle.trim(),        // STRING
      entite_id: form.value.entite_id            // STRING (selon votre curl)
    };

    // Ajouter la description si elle existe
    if (form.value.description && form.value.description.trim()) {
      data.description = form.value.description.trim();
    }

    console.log('🚀 Données à envoyer:', data);
    
    // Stocker pour debug
    debugInfo.value = {
      formData: { ...form.value },
      apiData: data,
      timestamp: new Date().toISOString()
    };

    // Récupérer le token
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('Token d\'authentification non trouvé');
    }

    console.log('🔑 Token:', token.substring(0, 20) + '...');

    // ⚠️ APPEL API EXACT COMME DANS LE CURL
    const response = await $fetch('http://127.0.0.1:8000/api/fonctions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)  // ⚠️ Utiliser JSON.stringify pour être sûr
    });

    console.log('✅ Réponse API:', response);

    // Mettre à jour le debug
    debugInfo.value.response = response;

    // Vérifier le succès
    if (response.success || response.status === 'success' || response.data?.id || response.id) {
      useToast().add({
        title: "Succès",
        description: response.message || "La fonction a été créée avec succès",
        color: "green",
      });

      // Réinitialiser le formulaire
      form.value = {
        code: '',
        libelle: '',
        entite_id: '',
        description: '',
      };
      
      selectedEntite.value = null;
      formErrors.value = {};

      // Rediriger vers la liste après 1.5 secondes
      setTimeout(() => {
        navigateTo('/fonctions');
      }, 1500);

    } else {
      throw new Error(response.message || "Erreur lors de la création");
    }

  } catch (error) {
    console.error("❌ Erreur lors de la soumission:", error);
    errorRequest.value = error;
    
    // Mettre à jour le debug avec l'erreur
    debugInfo.value.error = {
      message: error.message,
      status: error.status || error.statusCode,
      data: error.data,
      response: error.response
    };
    
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
  navigateTo("/fonctions");
};
</script>
