<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto p-6">
      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left Column: Form -->
        <div class="lg:col-span-12">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">

            <PageHeader 
              title="Création d'un Utilisateur" 
              subtitle="Gestion des utilisateurs et administrateurs"
              to="/utilisateurs" 
              btn-text="Retour à la liste" 
            />

            <!-- Loading des données initiales -->
            <div v-if="loadingInitialData" class="flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
              <div class="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <span class="text-sm font-medium">Chargement des données...</span>
            </div>

            <form v-else @submit.prevent="handleSubmit" class="space-y-4 mt-6">
              
              <!-- Type d'utilisateur -->
              <div class="flex items-center gap-8 pt-4 border-t border-gray-100">
                <div class="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    v-model="form.estResponsable"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label class="text-sm font-medium text-gray-700">
                    Est un Responsable ?
                  </label>
                </div>
              </div>

              <!-- Entité avec recherche -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Entité <span class="text-red-600">*</span>
                </label>
                <div class="relative">
                  <!-- Champ de recherche -->
                  <div class="relative">
                    <input
                      v-model="searchEntite"
                      @focus="showEntiteDropdown = true"
                      @input="filterEntites"
                      type="text"
                      placeholder="Rechercher une entité..."
                      class="w-full h-12 px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    />
                    <svg 
                      class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>

                  <!-- Dropdown des résultats -->
                  <div
                    v-if="showEntiteDropdown && filteredEntites.length > 0"
                    class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
                  >
                    <div
                      v-for="entite in filteredEntites"
                      :key="entite.id"
                      @click="selectEntite(entite)"
                      class="px-4 py-3 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div class="flex flex-col">
                        <span class="font-semibold text-gray-900">{{ entite.libelle }}</span>
                        <span v-if="entite.code" class="text-xs text-gray-500 mt-0.5">Code: {{ entite.code }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Entité sélectionnée -->
                  <div v-if="selectedEntite" class="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-md">
                    <span class="text-sm font-medium text-blue-900">{{ selectedEntite.libelle }}</span>
                    <button
                      type="button"
                      @click="clearEntite"
                      class="text-blue-600 hover:text-blue-800"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p class="text-xs text-gray-500 mt-1">Tapez pour rechercher et sélectionner une entité</p>
              </div>

              <!-- Matricule seul sur une ligne -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Matricule <span class="text-red-600">*</span>
                </label>
                <input 
                  v-model="form.matricule"
                  type="text"
                  placeholder="Matricule"
                  class="w-full h-12 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <!-- Nom et Prénoms sur la même ligne -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Nom <span class="text-red-600">*</span>
                  </label>
                  <input 
                    v-model="form.nom"
                    type="text"
                    placeholder="Nom"
                    class="w-full h-12 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Prénoms <span class="text-red-600">*</span>
                  </label>
                  <input 
                    v-model="form.prenoms"
                    type="text"
                    placeholder="Prénoms"
                    class="w-full h-12 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <!-- Email et Téléphone -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Email <span class="text-red-600">*</span>
                  </label>
                  <input 
                    v-model="form.email"
                    type="email"
                    placeholder="Email"
                    class="w-full h-12 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone <span class="text-red-600">*</span>
                  </label>
                  <input 
                    v-model="form.telephone"
                    type="text"
                    placeholder="Téléphone"
                    class="w-full h-12 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <!-- Date de Prise de Service -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Date de Prise de Service
                </label>
                <input 
                  v-model="form.datePriseService"
                  type="date"
                  class="w-full h-12 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <!-- Checkbox: Administrateur et Statut -->
              <div class="flex items-center gap-8 pt-4 border-t border-gray-100">
                <div class="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    v-model="form.estAdministrateur"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label class="text-sm font-medium text-gray-700">
                    Est un Administrateur ?
                  </label>
                </div>
                <div class="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    v-model="form.statut"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label class="text-sm font-medium text-gray-700">
                    Compte actif
                  </label>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-center space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button" 
                  @click="handleCancel" 
                  class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
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
                  <span v-else>SAUVEGARDER</span>
                </button>
              </div>

              <!-- Error Messages -->
              <div v-if="errors.length > 0" class="mt-4">
                <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 class="text-sm font-bold text-red-900 mb-2">Erreurs de validation :</h4>
                  <ul class="list-disc list-inside text-sm text-red-600">
                    <li v-for="(error, index) in errors" :key="index">
                      {{ error }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Error Request Message -->
              <div v-if="errorRequest" class="mt-4">
                <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p class="text-sm font-bold text-red-900">
                    Erreur serveur :
                  </p>
                  <p class="text-sm text-red-600 mt-1">
                    {{ errorRequest.message || errorRequest.data?.message || 'Une erreur est survenue' }}
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: "Nouveau Utilisateur - Sagar Revolution",
});

// ✅ DÉCLARATION DES ÉTATS
const loading = ref(false);
const loadingInitialData = ref(true);
const authToken = ref("");
const errorRequest = ref(null);
const config = useRuntimeConfig();

// Form data
const form = ref({
  matricule: '',
  nom: '',
  prenoms: '',
  email: '',
  telephone: '',
  datePriseService: '',
  estAdministrateur: false,
  statut: true,
  estResponsable: false,
  entite_id: '',
});

const errors = ref([]);

// Données pour les selects et recherche
const entites = ref([]);
const searchEntite = ref('');
const filteredEntites = ref([]);
const showEntiteDropdown = ref(false);
const selectedEntite = ref(null);

// ✅ COMPUTED
const isFormValid = computed(() => {
  return (
    form.value.matricule.trim() !== '' &&
    form.value.nom.trim() !== '' &&
    form.value.prenoms.trim() !== '' &&
    form.value.email.trim() !== '' &&
    form.value.telephone.trim() !== '' &&
    form.value.entite_id !== '' && 
    form.value.entite_id !== null
  );
});

// ✅ MÉTHODES DE RECHERCHE D'ENTITÉ
const filterEntites = () => {
  const search = searchEntite.value.toLowerCase().trim();
  
  if (search === '') {
    filteredEntites.value = entites.value;
  } else {
    filteredEntites.value = entites.value.filter(entite => {
      const libelle = (entite.libelle || '').toLowerCase();
      const code = (entite.code || '').toLowerCase();
      return libelle.includes(search) || code.includes(search);
    });
  }
  
  showEntiteDropdown.value = true;
};

const selectEntite = (entite) => {
  form.value.entite_id = entite.id;
  selectedEntite.value = entite;
  searchEntite.value = entite.libelle;
  showEntiteDropdown.value = false;
};

const clearEntite = () => {
  form.value.entite_id = '';
  selectedEntite.value = null;
  searchEntite.value = '';
  filteredEntites.value = entites.value;
};

// Fermer le dropdown si on clique ailleurs
if (process.client) {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
      showEntiteDropdown.value = false;
    }
  });
}

// ✅ WATCHERS
watch(() => form.value.estResponsable, (newValue) => {
  console.log('🔄 Changement de type utilisateur:', newValue);
});

watch(() => form.value.entite_id, (newValue) => {
  console.log('✅ Entité sélectionnée:', newValue);
});

// ✅ VALIDATION
const validateForm = () => {
  const newErrors = [];

  // Champs obligatoires de base
  if (!form.value.matricule.trim()) {
    newErrors.push('Le matricule est obligatoire');
  }
  if (!form.value.nom.trim()) {
    newErrors.push('Le nom est obligatoire');
  }
  if (!form.value.prenoms.trim()) {
    newErrors.push('Les prénoms sont obligatoires');
  }
  if (!form.value.email.trim()) {
    newErrors.push('L\'email est obligatoire');
  }
  if (!form.value.telephone.trim()) {
    newErrors.push('Le téléphone est obligatoire');
  }
 
  if (!form.value.entite_id) {
    newErrors.push('L\'entité est obligatoire');
  }

  // Validation email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (form.value.email && !emailRegex.test(form.value.email)) {
    newErrors.push('L\'email n\'est pas valide');
  }

  errors.value = newErrors;
  return newErrors.length === 0;
};

// ✅ MOUNTED - Charger les données
onMounted(async () => {
  if (process.client) {
    authToken.value = localStorage.getItem("auth_token") || "";
  }

  loadingInitialData.value = true;

  try {
    console.log('🔄 Chargement des entités...');

    // Charger les entités
    const entitesResponse = await $fetch(`${config.public.apiBase}/entites`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken.value}`,
        Accept: 'application/json'
      },
    });
    
    console.log('📦 Réponse entités:', entitesResponse);
    
    if (entitesResponse?.data && Array.isArray(entitesResponse.data)) {
      entites.value = entitesResponse.data;
    } else if (Array.isArray(entitesResponse)) {
      entites.value = entitesResponse;
    } else {
      entites.value = [];
    }
    
    filteredEntites.value = entites.value;
    
    console.log('✅ Entités chargées:', entites.value.length, entites.value);

  } catch (error) {
    console.error("❌ Erreur lors du chargement des entités:", error);
    errorRequest.value = error;
    useToast().add({
      title: "Erreur",
      description: "Impossible de charger les entités",
      color: "red",
    });
  } finally {
    loadingInitialData.value = false;
    console.log('✅ Chargement terminé');
  }
});

// ✅ SOUMISSION DU FORMULAIRE
const handleSubmit = async () => {
  loading.value = true;
  errors.value = [];
  errorRequest.value = null;

  console.log('=== DÉBUT SOUMISSION UTILISATEUR ===');
  console.log('Form data:', form.value);

  try {
    // Validation
    if (!validateForm()) {
      useToast().add({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires",
        color: "red",
      });
      loading.value = false;
      return;
    }

    // Préparer les données
    const userData = {
      matricule: form.value.matricule.trim(),
      nom: form.value.nom.trim(),
      prenoms: form.value.prenoms.trim(),
      email: form.value.email.trim(),
      telephone: form.value.telephone.trim(),
      datePriseService: form.value.datePriseService || null,
      estAdministrateur: form.value.estAdministrateur,
      statut: form.value.statut,
      estResponsable: form.value.estResponsable,
      entite_id: parseInt(form.value.entite_id),
    };

    console.log('Données à envoyer:', userData);

    // Appel API
    const response = await $fetch(`${config.public.apiBase}/users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken.value}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(userData),
    });

    console.log('Réponse API:', response);

    if (response.success || response.data) {
      useToast().add({
        title: "Succès",
        description: "L'utilisateur a été créé avec succès",
        color: "green",
      });

      // Reset form
      form.value = {
        matricule: '',
        nom: '',
        prenoms: '',
        email: '',
        telephone: '',
        datePriseService: '',
        estAdministrateur: false,
        statut: true,
        estResponsable: false,
        entite_id: '',
      };
      
      clearEntite();

      // Redirection après 1.5 secondes
      setTimeout(() => {
        navigateTo('/utilisateurs');
      }, 1500);

    } else {
      throw new Error(response.message || "Erreur lors de la création");
    }

  } catch (error) {
    console.error("=== ERREUR SOUMISSION ===");
    console.error("Error object:", error);
    console.error("Error data:", error.data);
    
    errorRequest.value = error;
    
    // Gestion des erreurs de validation Laravel
    if (error.data?.errors) {
      const validationErrors = [];
      for (const [field, messages] of Object.entries(error.data.errors)) {
        validationErrors.push(...messages);
      }
      errors.value = validationErrors;
      
      useToast().add({
        title: "Erreur de validation",
        description: validationErrors[0] || "Données invalides",
        color: "red",
      });
    } else {
      useToast().add({
        title: "Erreur de soumission",
        description: error.data?.message || error.message || "Une erreur inattendue est survenue.",
        color: "red",
      });
    }
  } finally {
    loading.value = false;
    console.log('=== FIN SOUMISSION ===');
  }
};

const handleCancel = () => {
  navigateTo("/utilisateurs");
};
</script>