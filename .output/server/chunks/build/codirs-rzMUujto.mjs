import { defineStore } from 'pinia';
import { ref } from 'vue';

const useCodirsStore = defineStore("codirs", () => {
  const currentCodir = ref(null);
  const codirs = ref([
    {
      id: 1,
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      time: "10:00",
      membres: [
        { id: 1, nom: "Alice" },
        { id: 2, nom: "Bob" },
        { id: 3, nom: "Claire" }
      ],
      // présence = IDs des membres présents
      presence: [1, 3],
      pointsFocaux: [
        {
          id: 10,
          libelle: "Suivi projets",
          statut: "en cours",
          dossiers: [
            {
              id: 100,
              libelle: "Projet A",
              taches: [
                {
                  id: 1e3,
                  intitule: "Pr\xE9parer le rapport",
                  date_debut: "2026-02-01",
                  date_fin: "2026-02-10",
                  responsables: [1, 2]
                  // IDs de membres
                },
                {
                  id: 1001,
                  intitule: "Envoyer le rapport",
                  date_debut: "2026-02-11",
                  date_fin: "2026-02-12",
                  responsables: [3]
                }
              ]
            }
          ]
        }
      ]
    }
  ]);
  const currentStep = ref(1);
  const steps = ref([
    { id: 1, label: "Points Focaux" },
    { id: 2, label: "Informations" },
    { id: 3, label: "R\xE9vision" }
  ]);
  function getCodirs() {
    if (codirs.value.length === 0) {
      codirs.value = [
        {
          id: 1,
          title: "CODIR 1",
          date: "2024-01-01",
          time: "10:00",
          status: "En cours"
        },
        {
          id: 2,
          title: "CODIR 2",
          date: "2024-01-02",
          time: "11:00",
          status: "En cours"
        }
      ];
      console.log("les codirs", codirs.value);
    } else {
      console.log("les codirs", codirs.value);
    }
  }
  function createNewCodir() {
    const now = /* @__PURE__ */ new Date();
    const newCodir = {
      id: codirs.value.length + 1,
      date: now.toISOString().split("T")[0],
      time: now.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit"
      }),
      membres: [],
      presence: [],
      pointsFocaux: []
    };
    for (let i = 0; i < 5; i++) {
      const newPointFocal = {
        id: i + 1,
        libelle: `Point focal ${i + 1}`,
        statut: "en attente",
        dossiers: []
      };
      newCodir.pointsFocaux.push(newPointFocal);
    }
    codirs.value.push(newCodir);
    currentCodir.value = newCodir;
    console.log("CODIR cr\xE9\xE9:", newCodir);
    return newCodir;
  }
  function resetStep() {
    currentStep.value = 1;
  }
  function nextStep() {
    if (currentStep.value < steps.value.length) {
      currentStep.value++;
    }
  }
  function previousStep() {
    if (currentStep.value > 1) {
      currentStep.value--;
    }
  }
  function setCurrentCodir(codirId) {
    currentCodir.value = codirs.value.find((c) => c.id === codirId) || null;
    console.log("Current codir d\xE9fini:", currentCodir.value);
  }
  return {
    // État
    codirs,
    currentCodir,
    currentStep,
    steps,
    // Fonctions
    getCodirs,
    createNewCodir,
    setCurrentCodir,
    resetStep,
    nextStep,
    previousStep
  };
});

export { useCodirsStore as u };
//# sourceMappingURL=codirs-rzMUujto.mjs.map
