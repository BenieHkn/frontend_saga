import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

const useAffectationsStore = defineStore("affectations", () => {
  const courriers = ref([]);
  const destinataires = ref([]);
  const selectedCourrier = ref(null);
  const selectedCourriers = ref([]);
  const selectedDestinataires = ref([]);
  const formData = ref({
    date_affect: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    instructions: "",
    statut: "en cours",
    delai_traitement: "",
    priority: "standard",
    date_cloture: null
  });
  const showDateCloture = ref(false);
  const useFolder = ref(false);
  const folderName = ref(null);
  const autoPriority = computed(() => {
    if (selectedCourriers.value.length === 0) return "standard";
    const priorityOrder = { "urgent": 3, "important": 2, "standard": 1 };
    const selectedCourriersList = courriers.value.filter(
      (c) => selectedCourriers.value.includes(c.id)
    );
    if (selectedCourriersList.length === 0) return "standard";
    const highestPriority = selectedCourriersList.reduce((highest, courrier) => {
      const currentPrio = (courrier.priority || "standard").toLowerCase();
      const highestPrio = highest.toLowerCase();
      return priorityOrder[currentPrio] > priorityOrder[highestPrio] ? currentPrio : highestPrio;
    }, "standard");
    return highestPriority;
  });
  watch(autoPriority, (newPriority) => {
    formData.value.priority = newPriority;
    console.log(`\u{1F3AF} Priorit\xE9 automatiquement d\xE9finie: ${newPriority}`);
  });
  const selectedCourrierData = computed(() => {
    return courriers.value.find((c) => c.id === selectedCourrier.value) || null;
  });
  const selectedCourrierCount = computed(() => {
    return selectedCourriers.value.length;
  });
  const canSelectMultipleDestinataires = computed(() => {
    return selectedCourriers.value.length === 1;
  });
  const maxDestinatairesAllowed = computed(() => {
    return selectedCourriers.value.length > 1 ? 1 : Infinity;
  });
  const canSend = computed(() => {
    return selectedCourriers.value.length > 0 && selectedDestinataires.value.length > 0 && formData.value.date_affect && formData.value.delai_traitement && (!showDateCloture.value || formData.value.date_cloture);
  });
  const setCourriers = (newCourriers) => {
    courriers.value = newCourriers;
  };
  const setDestinataires = (newDestinataires) => {
    destinataires.value = newDestinataires;
  };
  const selectCourrier = (courrierId) => {
    selectedCourrier.value = courrierId;
    if (!selectedCourriers.value.includes(courrierId)) {
      selectedCourriers.value = [courrierId];
    }
  };
  const deselectCourrier = () => {
    selectedCourrier.value = null;
    selectedCourriers.value = [];
  };
  const toggleCourrier = (courrierId) => {
    const index = selectedCourriers.value.indexOf(courrierId);
    if (index > -1) {
      selectedCourriers.value.splice(index, 1);
      if (selectedCourrier.value === courrierId) {
        selectedCourrier.value = null;
      }
    } else {
      selectedCourriers.value.push(courrierId);
      if (!selectedCourrier.value) {
        selectedCourrier.value = courrierId;
      }
    }
    if (selectedCourriers.value.length > 1) {
      if (selectedDestinataires.value.length > 1) {
        selectedDestinataires.value = [selectedDestinataires.value[0]];
      }
    }
  };
  const toggleDestinataire = (destinataireId) => {
    if (!canSelectMultipleDestinataires.value && selectedDestinataires.value.length >= 1) {
      if (selectedDestinataires.value.includes(destinataireId)) {
        const index = selectedDestinataires.value.indexOf(destinataireId);
        selectedDestinataires.value.splice(index, 1);
      } else {
        selectedDestinataires.value = [destinataireId];
      }
    } else {
      const index = selectedDestinataires.value.indexOf(destinataireId);
      if (index > -1) {
        selectedDestinataires.value.splice(index, 1);
      } else {
        selectedDestinataires.value.push(destinataireId);
      }
    }
  };
  const isDestinataireSelected = (destinataireId) => {
    return selectedDestinataires.value.includes(destinataireId);
  };
  const selectCourrierFromQuickAction = (courrierId) => {
    selectedCourrier.value = courrierId;
    selectedCourriers.value = [courrierId];
    selectedDestinataires.value = [];
  };
  const resetForm = () => {
    selectedCourrier.value = null;
    selectedCourriers.value = [];
    selectedDestinataires.value = [];
    formData.value = {
      date_affect: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      instructions: "",
      statut: "en cours",
      delai_traitement: "",
      priority: "standard",
      date_cloture: null
    };
    showDateCloture.value = false;
  };
  const updateFormData = (key, value) => {
    formData.value[key] = value;
  };
  const toggleDateCloture = () => {
    showDateCloture.value = !showDateCloture.value;
  };
  const setFolderInfo = (withFolder, folderNameValue) => {
    useFolder.value = withFolder;
    folderName.value = folderNameValue || null;
  };
  return {
    // État
    courriers,
    destinataires,
    selectedCourrier,
    selectedCourriers,
    selectedDestinataires,
    formData,
    showDateCloture,
    useFolder,
    folderName,
    // Getters
    selectedCourrierData,
    selectedCourrierCount,
    canSelectMultipleDestinataires,
    maxDestinatairesAllowed,
    canSend,
    autoPriority,
    // ✅ Exposer la priorité calculée
    // Actions
    setCourriers,
    setDestinataires,
    selectCourrier,
    deselectCourrier,
    toggleCourrier,
    toggleDestinataire,
    isDestinataireSelected,
    selectCourrierFromQuickAction,
    resetForm,
    updateFormData,
    toggleDateCloture,
    setFolderInfo
  };
});

export { useAffectationsStore as u };
//# sourceMappingURL=affectations-Bp-zzr69.mjs.map
