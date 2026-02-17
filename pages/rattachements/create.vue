<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header avec indicateur d'étapes -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Rattachement de Courriers</h1>
        <p class="text-gray-600 mt-1">
          Associez un courrier départ (réponse) à un courrier arrivée
        </p>

        <!-- Indicateur d'étapes -->
        <div class="mt-6 flex items-center justify-center">
          <div class="flex items-center w-full max-w-md">
            <!-- Étape 1 -->
            <div class="flex items-center flex-1">
              <div :class="[
                'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all',
                currentStep >= 1
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-gray-300 text-gray-400'
              ]">
                <Icon v-if="currentStep > 1" name="i-heroicons-check" class="h-5 w-5" />
                <span v-else class="font-semibold">1</span>
              </div>
              <div class="ml-3 text-left">
                <p :class="[
                  'text-sm font-medium',
                  currentStep >= 1 ? 'text-gray-900' : 'text-gray-500'
                ]">
                  Sélection
                </p>
              </div>
            </div>

            <!-- Ligne de connexion -->
            <div :class="[
              'flex-1 h-0.5 mx-4 transition-all',
              currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'
            ]"></div>

            <!-- Étape 2 -->
            <div class="flex items-center flex-1">
              <div :class="[
                'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all',
                currentStep >= 2
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-gray-300 text-gray-400'
              ]">
                <span class="font-semibold">2</span>
              </div>
              <div class="ml-3 text-left">
                <p :class="[
                  'text-sm font-medium',
                  currentStep >= 2 ? 'text-gray-900' : 'text-gray-500'
                ]">
                  Prévisualisation
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== ÉTAPE 1 : SÉLECTION ========== -->
      <div v-if="currentStep === 1" class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- COLONNE GAUCHE : COURRIER ARRIVÉE -->
        <div class="space-y-4">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <label class="block text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Icon name="i-heroicons-inbox-arrow-down" class="h-6 w-6 text-blue-600" />
              Courrier Arrivée
            </label>

            <!-- Recherche -->
            <div class="mb-4">
              <UInput v-model="searchArrivee" placeholder="Rechercher par référence ou objet..."
                icon="i-heroicons-magnifying-glass" size="lg" class="w-full" />
            </div>

            <!-- Liste déroulante des références -->
            <div class="border border-gray-200 rounded-lg max-h-96 overflow-y-auto bg-gray-50">
              <div v-for="courrier in filteredCourriersArrivee" :key="courrier.id"
                @click="selectCourrierArrivee(courrier)" :class="[
                  'p-4 cursor-pointer transition-all border-b border-gray-200 last:border-b-0',
                  selectedArrivee?.id === courrier.id
                    ? 'bg-blue-100 border-l-4 border-l-blue-600'
                    : 'hover:bg-white hover:shadow-sm'
                ]">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <p class="font-bold text-blue-900 text-base">
                      {{ courrier.reference }}
                    </p>
                    <p class="text-sm text-gray-700 mt-1 line-clamp-2">
                      {{ courrier.objet }}
                    </p>
                    <div class="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span class="flex items-center gap-1">
                        <Icon name="i-heroicons-building-office-2" class="h-3 w-3" />
                        {{ courrier.structure }}
                      </span>
                      <span class="flex items-center gap-1">
                        <Icon name="i-heroicons-calendar" class="h-3 w-3" />
                        {{ formatDate(courrier.date_courrier) }}
                      </span>
                    </div>
                  </div>
                  <div v-if="selectedArrivee?.id === courrier.id" class="ml-3">
                    <Icon name="i-heroicons-check-circle-solid" class="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <!-- État vide -->
              <div v-if="filteredCourriersArrivee.length === 0" class="p-8 text-center text-gray-500">
                <Icon name="i-heroicons-inbox" class="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p class="text-sm">Aucun courrier arrivée trouvé</p>
              </div>
            </div>

            <!-- Sélection active -->
            <div v-if="selectedArrivee" class="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <Icon name="i-heroicons-check-circle-solid" class="h-5 w-5 text-blue-600" />
                  <span class="text-sm font-semibold text-blue-900">Sélectionné</span>
                </div>
                <span class="text-sm font-bold text-blue-900">{{ selectedArrivee.reference }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- COLONNE DROITE : COURRIER DÉPART -->
        <div class="space-y-4">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <label class="block text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Icon name="i-heroicons-paper-airplane" class="h-6 w-6 text-green-600" />
              Courrier Départ (Réponse)
            </label>

            <!-- Recherche -->
            <div class="mb-4">
              <UInput v-model="searchDepart" placeholder="Rechercher par référence ou objet..."
                icon="i-heroicons-magnifying-glass" size="lg" class="w-full" />
            </div>

            <!-- Liste déroulante des références -->
            <div class="border border-gray-200 rounded-lg max-h-96 overflow-y-auto bg-gray-50">
              <div v-for="courrier in filteredCourriersDepart" :key="courrier.id"
                @click="selectCourrierDepart(courrier)" :class="[
                  'p-4 cursor-pointer transition-all border-b border-gray-200 last:border-b-0',
                  selectedDepart?.id === courrier.id
                    ? 'bg-green-100 border-l-4 border-l-green-600'
                    : 'hover:bg-white hover:shadow-sm'
                ]">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <p class="font-bold text-green-900 text-base">
                      {{ courrier.reference }}
                    </p>
                    <p class="text-sm text-gray-700 mt-1 line-clamp-2">
                      {{ courrier.objet }}
                    </p>
                    <div class="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span class="flex items-center gap-1">
                        <Icon name="i-heroicons-user" class="h-3 w-3" />
                        {{ courrier.destinataire }}
                      </span>
                      <span class="flex items-center gap-1">
                        <Icon name="i-heroicons-calendar" class="h-3 w-3" />
                        {{ formatDate(courrier.date_depart) }}
                      </span>
                    </div>
                  </div>
                  <div v-if="selectedDepart?.id === courrier.id" class="ml-3">
                    <Icon name="i-heroicons-check-circle-solid" class="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <!-- État vide -->
              <div v-if="filteredCourriersDepart.length === 0" class="p-8 text-center text-gray-500">
                <Icon name="i-heroicons-inbox" class="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p class="text-sm">Aucun courrier départ trouvé</p>
              </div>
            </div>

            <!-- Sélection active -->
            <div v-if="selectedDepart" class="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <Icon name="i-heroicons-check-circle-solid" class="h-5 w-5 text-green-600" />
                  <span class="text-sm font-semibold text-green-900">Sélectionné</span>
                </div>
                <span class="text-sm font-bold text-green-900">{{ selectedDepart.reference }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== ÉTAPE 2 : PRÉVISUALISATION ========== -->
      <div v-if="currentStep === 2" class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- Prévisualisation Courrier Arrivée -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon name="i-heroicons-inbox-arrow-down" class="h-6 w-6 text-blue-600" />
            Courrier Arrivée
          </h3>

          <!-- Informations du courrier -->
          <div class="bg-blue-50 rounded-lg p-4 mb-4 space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-700 font-medium">Référence:</span>
              <span class="font-bold text-blue-900">{{ selectedArrivee.reference }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-700 font-medium">Structure:</span>
              <span class="text-gray-900">{{ selectedArrivee.structure }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-700 font-medium">Date:</span>
              <span class="text-gray-900">{{ formatDate(selectedArrivee.date_courrier) }}</span>
            </div>
            <div class="pt-2 border-t border-blue-200">
              <span class="text-gray-700 font-medium">Objet:</span>
              <p class="text-gray-900 mt-1">{{ selectedArrivee.objet }}</p>
            </div>
          </div>

          <!-- Prévisualisation du document -->
          <DocumentRpreview :file-preview-url="selectedArrivee.url" />
        </div>

        <!-- Prévisualisation Courrier Départ -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon name="i-heroicons-paper-airplane" class="h-6 w-6 text-green-600" />
            Courrier Départ
          </h3>

          <!-- Informations du courrier -->
          <div class="bg-green-50 rounded-lg p-4 mb-4 space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-700 font-medium">Référence:</span>
              <span class="font-bold text-green-900">{{ selectedDepart.reference }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-700 font-medium">Destinataire:</span>
              <span class="text-gray-900">{{ selectedDepart.destinataire }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-700 font-medium">Date:</span>
              <span class="text-gray-900">{{ formatDate(selectedDepart.date_depart) }}</span>
            </div>
            <div class="pt-2 border-t border-green-200">
              <span class="text-gray-700 font-medium">Objet:</span>
              <p class="text-gray-900 mt-1">{{ selectedDepart.objet }}</p>
            </div>
          </div>

          <!-- Prévisualisation du document -->
          <DocumentRpreview :file-preview-url="selectedDepart.url" />
        </div>
      </div>

      <!-- Boutons de navigation -->
      <div class="mt-8 flex justify-between">
        <!-- Bouton Retour / Annuler -->
        <UButton v-if="currentStep === 1" @click="handleCancel" color="gray" variant="outline" size="lg"
          icon="i-heroicons-x-mark">
          Annuler
        </UButton>

        <UButton v-if="currentStep === 2" @click="currentStep = 1" color="gray" variant="outline" size="lg"
          icon="i-heroicons-arrow-left">
          Retour
        </UButton>

        <!-- Bouton Suivant / Valider -->
        <UButton v-if="currentStep === 1" @click="goToPreview" :disabled="!selectedArrivee || !selectedDepart" size="lg"
          icon="i-heroicons-arrow-right" trailing class="bg-gradient-to-br from-emerald-700 to-blue-800 text-white dark:text-white ml-auto">
          Suivant
        </UButton>

        <UButton v-if="currentStep === 2" @click="showConfirmModal = true" size="lg" icon="i-heroicons-link"
          class="ml-auto bg-gradient-to-br from-emerald-800 to-blue-800 text-white dark:text-white">
          Rattacher
        </UButton>
      </div>
    </div>

    <!-- ========== MODAL DE CONFIRMATION ========== -->
    <UModal v-model="showConfirmModal" :ui="{ width: 'sm:max-w-4xl' }">
      <div class="p-6">
        <!-- En-tête du modal -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Icon name="i-heroicons-link" class="h-6 w-6 text-purple-600" />
            Confirmation du rattachement
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" @click="showConfirmModal = false" square />
        </div>

        <!-- Récapitulatif visuel -->
        <div class="mb-6">
          <p class="text-sm text-gray-600 mb-4">
            Vous êtes sur le point de rattacher ces deux courriers :
          </p>

          <div class="flex flex-col lg:flex-row items-stretch gap-4">
            <!-- Courrier Arrivée -->
            <div class="flex-1 bg-blue-50 rounded-lg p-4 border-2 border-blue-200 min-w-0">
              <div class="flex items-start gap-3 mb-3">
                <Icon name="i-heroicons-inbox-arrow-down" class="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
                <div class="min-w-0 flex-1">
                  <p class="text-xs text-gray-600 uppercase font-semibold mb-1">Courrier Arrivée</p>
                  <p class="font-bold text-blue-900 text-sm break-words">{{ selectedArrivee?.reference }}</p>
                </div>
              </div>

              <div class="space-y-2">
                <div class="bg-white bg-opacity-50 rounded p-2">
                  <p class="text-xs text-gray-600 font-medium mb-1">Objet:</p>
                  <p class="text-xs text-gray-800 break-words">{{ selectedArrivee?.objet }}</p>
                </div>

                <div class="grid grid-cols-1 gap-2">
                  <div class="bg-white bg-opacity-50 rounded p-2">
                    <p class="text-xs text-gray-600 font-medium">Structure:</p>
                    <p class="text-xs text-gray-800 break-words">{{ selectedArrivee?.structure }}</p>
                  </div>
                  <div class="bg-white bg-opacity-50 rounded p-2">
                    <p class="text-xs text-gray-600 font-medium">Date:</p>
                    <p class="text-xs text-gray-800">{{ formatDate(selectedArrivee?.date_courrier) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Icône de lien -->
            <div class="flex-shrink-0 flex items-center justify-center lg:py-0 py-2">
              <Icon name="i-heroicons-arrow-right-circle" class="h-10 w-10 text-purple-600 lg:rotate-0 rotate-90" />
            </div>

            <!-- Courrier Départ -->
            <div class="flex-1 bg-green-50 rounded-lg p-4 border-2 border-green-200 min-w-0">
              <div class="flex items-start gap-3 mb-3">
                <Icon name="i-heroicons-paper-airplane" class="h-8 w-8 text-green-600 flex-shrink-0 mt-1" />
                <div class="min-w-0 flex-1">
                  <p class="text-xs text-gray-600 uppercase font-semibold mb-1">Courrier Départ</p>
                  <p class="font-bold text-green-900 text-sm break-words">{{ selectedDepart?.reference }}</p>
                </div>
              </div>

              <div class="space-y-2">
                <div class="bg-white bg-opacity-50 rounded p-2">
                  <p class="text-xs text-gray-600 font-medium mb-1">Objet:</p>
                  <p class="text-xs text-gray-800 break-words">{{ selectedDepart?.objet }}</p>
                </div>

                <div class="grid grid-cols-1 gap-2">
                  <div class="bg-white bg-opacity-50 rounded p-2">
                    <p class="text-xs text-gray-600 font-medium">Destinataire:</p>
                    <p class="text-xs text-gray-800 break-words">{{ selectedDepart?.destinataire }}</p>
                  </div>
                  <div class="bg-white bg-opacity-50 rounded p-2">
                    <p class="text-xs text-gray-600 font-medium">Date:</p>
                    <p class="text-xs text-gray-800">{{ formatDate(selectedDepart?.date_depart) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Message d'avertissement -->
        <div class="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div class="flex gap-3">
            <Icon name="i-heroicons-exclamation-triangle" class="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div class="text-sm text-amber-800">
              <p class="font-medium mb-1">Attention</p>
              <p>Cette action créera un lien permanent entre ces deux courriers. Assurez-vous que le courrier départ est
                bien la réponse au courrier arrivée sélectionné.</p>
            </div>
          </div>
        </div>

        <!-- Boutons d'action -->
        <div class="flex justify-end gap-3">
          <UButton @click="showConfirmModal = false" color="gray" variant="outline" size="lg">
            Annuler
          </UButton>

          <UButton @click="handleSave" :loading="loading" size="lg" icon="i-heroicons-check"
            class="bg-gradient-to-br from-emerald-800 to-blue-800 text-white dark:text-white">
            {{ loading ? 'Rattachement en cours...' : 'Confirmer le rattachement' }}
          </UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup>
useHead({
  title: "Rattachement de Courriers - Sagar Revolution",
});

// ============================================================================
// ÉTAT DU COMPOSANT
// ============================================================================

const authToken = ref("");
const toast = useToast();
const loading = ref(false);
const config = useRuntimeConfig();

// Navigation
const currentStep = ref(1);
const showConfirmModal = ref(false);

// Recherche
const searchArrivee = ref("");
const searchDepart = ref("");

// Sélections
const selectedArrivee = ref(null);
const selectedDepart = ref(null);

// Données
const courriersArrivee = ref([]);
const courriersDepart = ref([]);

// ============================================================================
// COMPUTED PROPERTIES - FILTRES
// ============================================================================

const filteredCourriersArrivee = computed(() => {
  if (!searchArrivee.value) return courriersArrivee.value;

  const query = searchArrivee.value.toLowerCase();
  return courriersArrivee.value.filter(courrier =>
    courrier.reference.toLowerCase().includes(query) ||
    courrier.objet.toLowerCase().includes(query) ||
    courrier.structure.toLowerCase().includes(query)
  );
});

const filteredCourriersDepart = computed(() => {
  if (!searchDepart.value) return courriersDepart.value;

  const query = searchDepart.value.toLowerCase();
  return courriersDepart.value.filter(courrier =>
    courrier.reference.toLowerCase().includes(query) ||
    courrier.objet.toLowerCase().includes(query) ||
    courrier.destinataire.toLowerCase().includes(query)
  );
});

// ============================================================================
// MÉTHODES - SÉLECTION
// ============================================================================

const selectCourrierArrivee = (courrier) => {
  selectedArrivee.value = courrier;
  console.log("📥 Courrier arrivée sélectionné:", courrier.reference);
};

const selectCourrierDepart = (courrier) => {
  selectedDepart.value = courrier;
  console.log("📤 Courrier départ sélectionné:", courrier.reference);
};

// ============================================================================
// MÉTHODES - NAVIGATION
// ============================================================================

const goToPreview = () => {
  if (!selectedArrivee.value || !selectedDepart.value) {
    toast.add({
      title: "Sélection incomplète",
      description: "Veuillez sélectionner un courrier arrivée et un courrier départ",
      color: "amber",
      timeout: 1500,
    });
    return;
  }

  currentStep.value = 2;
};

// ============================================================================
// MÉTHODES - UTILITAIRES
// ============================================================================

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// ============================================================================
// MÉTHODES - ACTIONS
// ============================================================================

const handleSave = async () => {
  if (!selectedArrivee.value || !selectedDepart.value) {
    toast.add({
      title: "Erreur",
      description: "Veuillez sélectionner un courrier arrivée et un courrier départ",
      color: "red",
      timeout: 1500,
    });
    return;
  }

  loading.value = true;

  try {
    const response = await $fetch(`${config.public.apiBase}/reponses`, {
      method: "POST",
      body: {
        document_id: selectedArrivee.value.id,
        reponse_id: selectedDepart.value.id,
      },
      headers: {
        Authorization: `Bearer ${authToken.value}`,
        "Content-Type": "application/json",
      },
    });

    if (response.success) {
      showConfirmModal.value = false;

      toast.add({
        title: "Succès",
        description: `Rattachement effectué entre ${selectedArrivee.value.reference} et ${selectedDepart.value.reference}`,
        color: "green",
        timeout: 2000,
      });

      // Réinitialiser après un court délai
      setTimeout(() => {
        selectedArrivee.value = null;
        selectedDepart.value = null;
        searchArrivee.value = "";
        searchDepart.value = "";
        currentStep.value = 1;

        // Optionnel : rediriger vers la liste
        navigateTo("/rattachements");
      }, 1500);
    } else {
      console.log(response.data);
      toast.add({
        title: "Erreur",
        description: response.message || "Une erreur est survenue lors du rattachement",
        color: "red",
        timeout: 1500,
      });
    }
  } catch (error) {
    console.error("Erreur lors du rattachement:", error.data?.errors);
    toast.add({
      title: "Erreur",
      description: error.data?.message || "Impossible de créer le rattachement",
      color: "red",
      timeout: 1500,
    });
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  selectedArrivee.value = null;
  selectedDepart.value = null;
  searchArrivee.value = "";
  searchDepart.value = "";
  currentStep.value = 1;

  // Optionnel : rediriger
  navigateTo("/courriers");
};

// ============================================================================
// CHARGEMENT DES DONNÉES
// ============================================================================

const loadCourriersArrivee = async () => {
  try {
    const response = await $fetch(`${config.public.apiBase}/courriers-arrives/sans-reponses`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken.value}`,
      },
    });

    courriersArrivee.value = response.data.map(courrier => ({
      id: courrier.document.id,
      reference: courrier.document?.reference || '',
      objet: courrier.document?.objet || '',
      structure: courrier.structure_emettrice || '',
      date_courrier: courrier.document?.date_courrier || '',
      url: courrier.document?.url
        ? `${config.public.apiBase}${courrier.document.url}`
        : '',
    }));

    console.log(`✅ ${courriersArrivee.value.length} courriers arrivée chargés`);
  } catch (error) {
    console.error("Erreur lors du chargement des courriers arrivée:", error);
    toast.add({
      title: "Erreur",
      description: "Impossible de charger les courriers arrivée",
      color: "red",
      timeout: 1500,
    });
  }
};

const loadCourriersDepart = async () => {
  try {
    const response = await $fetch(`${config.public.apiBase}/courriers-departs/non-reponses`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken.value}`,
      },
    });

    courriersDepart.value = response.data.map(courrier => ({
      id: courrier.document.id,
      reference: courrier.document?.reference || '',
      objet: courrier.document?.objet || '',
      destinataire: courrier.destinataire || '',
      date_depart: courrier.date_depart || '',
      url: courrier.document?.url
        ? `${config.public.apiBase}${courrier.document.url}`
        : '',
    }));

    console.log(`✅ ${courriersDepart.value.length} courriers départ chargés`);
  } catch (error) {
    console.error("Erreur lors du chargement des courriers départ:", error);
    toast.add({
      title: "Erreur",
      description: "Impossible de charger les courriers départ",
      color: "red",
      timeout: 1500,
    });
  }
};

// ============================================================================
// LIFECYCLE
// ============================================================================

onMounted(async () => {
  if (process.client) {
    authToken.value = localStorage.getItem("auth_token") || "";
  }

  await Promise.all([
    loadCourriersArrivee(),
    loadCourriersDepart()
  ]);
});
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>