<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left Column: Form (col-6) -->
        <div class="lg:col-span-5">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="mb-6">
              <h1 class="text-2xl font-bold text-gray-900">Nouveau Courrier Départ</h1>
              <p class="text-gray-600 mt-1">Enregistrez un nouveau courrier départ</p>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4">
              <!-- Type d'arrivée -->
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Type de départ *
                  </label>
                  <USelect v-model="form.type_depart" :options="[
                    { label: 'Interne', value: 'interne' },
                    { label: 'Externe', value: 'externe' },
                  ]" class="w-full h-12" />
                </div>
              </div>

              <!-- Upload et Type de Document -->
              <div class="grid grid-cols-1 gap-4 pt-4 border-t border-gray-100">
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
                        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-600 truncate flex items-center">
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
              <div class="grid grid-cols-1 gap-4  md:grid-cols-2">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Destinataire
                  </label>
                  <UInput v-model="form.destinataire" placeholder="Nom du destinataire" class="w-full h-12" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Date de départ *
                  </label>
                  <UInput v-model="form.date_depart" type="date" class="w-full h-12" />
                </div>
              </div>


              <!-- Champs communs -->
              <div class="pt-4 border-t border-gray-100 space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Numéro d'enregistrement *
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
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Référence *
                    </label>
                    <UInput v-model="form.reference" placeholder="Référence du document" class="w-full h-12" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Date du courrier *
                    </label>
                    <UInput v-model="form.date_courier" type="date" class="w-full h-12" />
                  </div>
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
                <UButton type="submit" class="bg-gradient-to-br from-emerald-800 to-blue-800 text-white dark:text-white"
                  :loading="loading">
                  SAUVEGARDER
                </UButton>
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
  title: "Nouveau Courrier Départ - Sagar Revolution",
});

const toast = useToast()

const selectedFile = ref(null);
const fileInput = ref(null);
const loading = ref(false);
const authToken = ref("");

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
});

const documentTypes = ref([]);

const filePreviewUrl = computed(() => {
  if (!selectedFile.value) return null;
  return URL.createObjectURL(selectedFile.value);
});

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    form.value.url = file;
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
    console.error("Erreur lors de la récupération des types de documents:", error);
  }
})

const handleSubmit = async () => {
  loading.value = true;

  try {
    let selectedFunction = null;
    if (process.client) {
      const savedFunction = localStorage.getItem("selected_entite");
      if (savedFunction) {
        selectedFunction = JSON.parse(savedFunction);
      }
    }

    if (!selectedFunction) {
      console.log("Aucune fonction sélectionnée");
      toast.add({
        title: "Erreur",
        description: "Aucune fonction sélectionnée. Veuillez vous reconnecter.",
        color: "red",
        timeout: 1500,
      });
      loading.value = false;
      return;
    }

    if (
      !form.value.numero_enreg ||
      !form.value.date_enreg ||
      !form.value.reference || 
      !form.value.date_courier ||
      !form.value.objet ||
      !form.value.type_document_id ||
      !form.value.url ||
      !form.value.type_depart ||
      !form.value.destinataire ||
      !form.value.date_depart
    ) {
      console.log("Veuillez remplir tous les champs obligatoires");
      toast.add({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        color: "red",
        timeout: 1500,
      });
      loading.value = false;
      return;
    }

    const formData = new FormData();

    formData.append("numero_enreg", form.value.numero_enreg);
    formData.append("date_enreg", form.value.date_enreg);
    formData.append("reference", form.value.reference || 'sans reference');
    formData.append("date_courrier", form.value.date_courier);
    formData.append("date_depart", form.value.date_depart);
    formData.append("destinataire", form.value.destinataire);
    formData.append("objet", form.value.objet);
    formData.append(
      "large_diffusion",
      form.value.large_diffusion ? "1" : "0",
    );
    formData.append(
      "type_document_id",
      form.value.type_document_id.toString(),
    );

    if (form.value.url) {
      formData.append("fichier", form.value.url);
    }

    formData.append("type_depart", form.value.type_depart);
    formData.append("confidentiel", form.value.confidentiel ? "1" : "0");

    let serviceEnreg = selectedFunction.code;

    formData.append("service_emis", serviceEnreg);

    let authToken = "";
    if (process.client) {
      authToken = localStorage.getItem("auth_token") || "";
    }

    const response = await $fetch("http://localhost:8000/api/courriers-departs", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    console.log(response);
    if (response.success) {
      toast.add({
        title: "Succès",
        description: "Le courrier départ a été enregistré avec succès",
        color: "green",
      });


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
      });
      selectedFile.value = null;

      setTimeout(() => {
        navigateTo("/courriers");
      }, 1500);
    } else {
      toast.add({
        title: "Erreur",
        description:
          response.message ||
          "Une erreur est survenue lors de l'enregistrement",
        color: "red",
        timeout: 1500,
      });
    }
  } catch (error) {
    console.error("Erreur lors de la soumission:", error);
    toast.add({
      title: "Erreur",
      description:
        error.data?.message ||
        "Une erreur est survenue lors de l'enregistrement",
      color: "red",
      timeout: 1500,
    });
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  navigateTo("/courriers");
};
</script>