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
                        {{
                          selectedFile
                            ? selectedFile.name
                            : "Aucun fichier sélectionné"
                        }}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Type de document *
                  </label>
                  <USelectMenu v-model="form.type_document_id" :options="documentTypes" value-attribute="id"
                    option-attribute="libelle" placeholder="Sélectionner le type" class="w-full"
                    :ui="{ height: 'h-[42px]' }" />
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
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Numéro CAB
                  </label>
                  <UInput v-model="form.num_cab" class="w-full h-12" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Date CAB
                  </label>
                  <UInput v-model="form.date_cab" type="date" class="w-full h-12" />
                </div>
              </div>

              <!-- Champs SGM -->
              <div v-if="
                form.type_arrivee === 'cab' || form.type_arrivee === 'sgm'
              " class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Numéro d'Enregistrement SGM
                  </label>
                  <UInput v-model="form.num_sgm" class="w-full h-12" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Date SGM
                  </label>
                  <UInput v-model="form.date_sgm" type="date" class="w-full h-12" />
                </div>
              </div>

              <!-- Champs communs -->
              <div class="pt-4 border-t border-gray-100 space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      N° d'enregistrement *
                    </label>
                    <UInput v-model="form.numero_enreg" placeholder="Numéro d'enregistrement" class="w-full h-12" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Date d'enregistrement *
                    </label>
                    <UInput v-model="form.date_enreg" type="date" class="w-full h-12" />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="flex items-center space-x-2">
                    <UCheckbox @click="sansReference = !sansReference" label="Sans référence" />
                  </div>
                  <div v-if="!sansReference">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Référence
                    </label>
                    <UInput v-model="form.reference" placeholder="Référence du document" class="w-full h-12" />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Date du courrier *
                  </label>
                  <UInput v-model="form.date_courier" type="date" class="w-full h-12" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Objet *
                  </label>
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
                <UButton :disabled="!isFormValid || loading" type="submit"
                  class="bg-gradient-to-br from-emerald-800 to-blue-800 text-white dark:text-white" :loading="loading">
                  SAUVEGARDER
                </UButton>
              </div>

              <!-- Error Messages -->
              <div v-if="errors.length > 0" class="mt-4">
                <ul class="list-disc list-inside text-sm text-red-600">
                  <li v-for="(error, index) in errors" :key="index">
                    {{ error }}
                  </li>
                </ul>
              </div>

              <!-- Error Request Message -->
              <div v-if="errorRequest" class="mt-4">
                <p class="text-sm text-red-600">
                  Une erreur est survenue lors de la requête :
                  {{ errorRequest.message || errorRequest.data?.message }}
                </p>
              </div>
            </form>
          </div>
        </div>

        <!-- Right Column: Document Preview (col-7) using the new component -->
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

// ✅ DÉCLARATION DES ÉTATS
const selectedFile = ref(null);
const fileInput = ref(null);
const loading = ref(false);
const authToken = ref("");
const errorRequest = ref(null);
const config = useRuntimeConfig()
const sansReference = ref(false);

// Form data
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
});

const errors = ref([]);

//le booléen pour la validation, s'assure que tous les champs obligatoires sont remplis
const isFormValid = computed(() => {
  return (
    form.value.numero_enreg !== "" &&
    form.value.date_enreg !== "" &&
    // form.value.reference !== "" &&
    form.value.date_courier !== "" &&
    form.value.objet !== "" &&
    form.value.type_document_id !== null &&
    form.value.fichier !== null &&
    form.value.type_arrivee !== "" &&
    form.value.priorite !== ""
  );
});

const validateForm = () => {
  const newErrors = [];
  const requiredFields = {
    numero_enreg: "Le numéro d'enregistrement est obligatoire.",
    date_enreg: "La date d'enregistrement est obligatoire.",
    // reference: "La référence est obligatoire.",
    date_courier: "La date du courrier est obligatoire.",
    objet: "L'objet est obligatoire.",
    type_document_id: "Le type de document est obligatoire.",
    fichier: "La pièce jointe est obligatoire.",
    type_arrivee: "Le type d'arrivée est obligatoire.",
    priorite: "La priorité est obligatoire.",
  };

  for (const [field, message] of Object.entries(requiredFields)) {
    if (!form.value[field]) {
      newErrors.push(message);
    }
  }
  errors.value = newErrors;
  return newErrors.length === 0;
};

// Mock Data
const documentTypes = ref([]);

// ✅ COMPUTED POUR L'APERÇU
const filePreviewUrl = computed(() => {
  if (!selectedFile.value) return null;
  return URL.createObjectURL(selectedFile.value);
});

// Nettoyer l'URL de l'objet pour éviter les fuites de mémoire
watch(filePreviewUrl, (newUrl, oldUrl) => {
  if (oldUrl) {
    URL.revokeObjectURL(oldUrl);
  }
});
onUnmounted(() => {
  if (filePreviewUrl.value) {
    URL.revokeObjectURL(filePreviewUrl.value);
  }
});

// ✅ METHODS
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    form.value.fichier = file;
    console.log("✅ Fichier sélectionné:", file.name);
  }
};

onMounted(async () => {
  if (process.client) {
    authToken.value = localStorage.getItem("auth_token") || "";
  }

  try {
    const response = await $fetch("/api/type_documents/type_document", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken.value}`,
      },
    });

    documentTypes.value = response || [];
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des types de documents:",
      error,
    );
    errorRequest.value = error;
  }
});

//soumission du formulaire
const handleSubmit = async () => {
  loading.value = true;
  errors.value = [];
  errorRequest.value = null;

  try {
    // Vérifier la validation EN PREMIER
    if (!validateForm()) {
      useToast().add({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        color: "red",
      });
      loading.value = false;
      return;
    }

    // Récupérer la fonction sélectionnée
    let selectedFunction = null;
    if (process.client) {
      const savedFunction = localStorage.getItem("selected_entite");
      if (savedFunction) {
        selectedFunction = JSON.parse(savedFunction);
      }
    }

    if (!selectedFunction) {
      useToast().add({
        title: "Erreur",
        description: "Aucune fonction sélectionnée. Veuillez vous reconnecter.",
        color: "red",
      });
      loading.value = false;
      return;
    }

    // Créer FormData
    const formData = new FormData();

    formData.append("numero_enreg", form.value.numero_enreg);
    formData.append("date_enreg", form.value.date_enreg);
    formData.append("reference", form.value.reference || 'sans reference');
    formData.append("date_courrier", form.value.date_courier);
    formData.append("objet", form.value.objet);
    formData.append("large_diffusion", form.value.large_diffusion ? "1" : "0");
    formData.append("type_document_id", form.value.type_document_id.toString());

    if (form.value.fichier) {
      formData.append("fichier", form.value.fichier);
    }

    formData.append("type_arrivee", form.value.type_arrivee);
    formData.append("confidentiel", form.value.confidentiel ? "1" : "0");

    const serviceEnreg = selectedFunction?.code || "Non défini";
    formData.append("service_enreg", serviceEnreg);
    formData.append("priority", form.value.priorite);

    if (form.value.type_arrivee !== "autre" && form.value.structure) {
      formData.append("structure", form.value.structure);
    }

    if (form.value.type_arrivee === "autre" && form.value.autre_structure) {
      formData.append("autre_structure", form.value.autre_structure);
    }

    if (form.value.type_arrivee === "cab") {
      if (form.value.num_cab) formData.append("num_cab", form.value.num_cab);
      if (form.value.date_cab) formData.append("date_cab", form.value.date_cab);
    }

    if (
      form.value.type_arrivee === "cab" ||
      form.value.type_arrivee === "sgm"
    ) {
      if (form.value.num_sgm) formData.append("num_sgm", form.value.num_sgm);
      if (form.value.date_sgm) formData.append("date_sgm", form.value.date_sgm);
    }

    // Appel API
    // const response = await $fetch(`${config.laravelApiUrl}/courriers-arrives`, {
    const response = await $fetch("http://localhost:8000/api/courriers-arrives", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken.value}`,
      },
      body: formData,
    });

    if (response.success) {
      useToast().add({
        title: "Succès",
        description: "Le courrier arrivé a été enregistré avec succès",
        color: "green",
      });

      // Reset form
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
      };
      selectedFile.value = null;

      setTimeout(() => {
        navigateTo("/documents");
      }, 1500)

    } else {
      useToast().add({
        title: "Erreur",
        description:
          response.message ||
          "Une erreur est survenue lors de l'enregistrement",
        color: "red",
      });
    }
  } catch (error) {
    console.error("Erreur lors de la soumission:", error.data?.errors);
    errorRequest.value = error;
    useToast().add({
      title: "Erreur de soumission",
      description: error.data?.errors || error.message || "Une erreur inattendue est survenue.",
      color: "red",
    });
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  navigateTo("/courriers");
};
</script>
