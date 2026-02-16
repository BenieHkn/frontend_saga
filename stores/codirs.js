import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCodirsStore = defineStore('codirs', () => {
  // État
  const currentCodir = ref(null)

  const codirs = ref([
    {
      id: 1,
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
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
                  id: 1000,
                  intitule: "Préparer le rapport",
                  date_debut: "2026-02-01",
                  date_fin: "2026-02-10",

                  responsables: [1, 2] // IDs de membres
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


  // ✅ Ajouter step et steps
  const currentStep = ref(1)
  const steps = ref([
    { id: 1, label: 'Points Focaux' },
    { id: 2, label: 'Informations' },
    { id: 3, label: 'Révision' }
  ])

  function getCodirs() {
    if (codirs.value.length === 0) {
      codirs.value = [
        {
          id: 1,
          title: 'CODIR 1',
          date: '2024-01-01',
          time: '10:00',
          status: 'En cours',
        },
        {
          id: 2,
          title: 'CODIR 2',
          date: '2024-01-02',
          time: '11:00',
          status: 'En cours',
        },
      ]
      console.log("les codirs", codirs.value)
    } else {
      console.log("les codirs", codirs.value)
    }
  }

  // ✅ Créer un codir avec ses points focaux
  function createNewCodir() {
    const now = new Date()

    const newCodir = {
      id: codirs.value.length + 1,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      }),

      membres: [],
      presence: [],

      pointsFocaux: []
    }

    // Créer 5 points focaux imbriqués dans le codir
    for (let i = 0; i < 5; i++) {
      const newPointFocal = {
        id: i + 1,
        libelle: `Point focal ${i + 1}`,
        statut: "en attente",
        dossiers: []
      }

      newCodir.pointsFocaux.push(newPointFocal)
    }

    // Ajouter le codir dans la liste
    codirs.value.push(newCodir)
    currentCodir.value = newCodir

    console.log('CODIR créé:', newCodir)

    return newCodir
  }


  function resetStep() {
    currentStep.value = 1
  }

  function nextStep() {
    if (currentStep.value < steps.value.length) {
      currentStep.value++
    }
  }

  function previousStep() {
    if (currentStep.value > 1) {
      currentStep.value--
    }
  }


  // Méthode pour définir le codir actuel
  function setCurrentCodir(codirId) {
    currentCodir.value = codirs.value.find(c => c.id === codirId) || null
    console.log('Current codir défini:', currentCodir.value)
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
    previousStep,
  }
})
