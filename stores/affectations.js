import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useAffectationsStore = defineStore('affectations', () => {
  // État
  const courriers = ref([])
  const destinataires = ref([])
  const selectedCourrier = ref(null)
  const selectedCourriers = ref([]) // Pour affectation multiple
  const selectedDestinataires = ref([])
  
  const formData = ref({
    date_affect: new Date().toISOString().split('T')[0],
    instructions: '',
    statut: 'en cours',
    delai_traitement: '',
    priority: '',
    date_cloture: null,
  })

  const showDateCloture = ref(false)
  
  // Dossier d'affectation
  const useFolder = ref(false)
  const folderName = ref(null)

const autoPriority = computed(() => {
  if (selectedCourriers.value.length === 0) return 'STANDARD'

  const priorityOrder = { 'URGENT': 3, 'IMPORTANT': 2, 'STANDARD': 1 }
  
  const selectedCourriersList = courriers.value.filter(c => 
    selectedCourriers.value.includes(c.id)
  )

  if (selectedCourriersList.length === 0) return 'STANDARD'

  const highestPriority = selectedCourriersList.reduce((highest, courrier) => {
    // ✅ Tout en MAJUSCULES, cohérent avec les clés du dictionnaire
    const currentPrio = (courrier.priority || 'STANDARD').toUpperCase()
    const highestPrio = highest.toUpperCase()
    
    return priorityOrder[currentPrio] > priorityOrder[highestPrio]
      ? currentPrio
      : highestPrio
  }, 'STANDARD')

  return highestPriority // ✅ Retourne 'URGENT' | 'IMPORTANT' | 'STANDARD'
})

// ✅ immediate: true pour initialiser dès le montage
watch(autoPriority, (newPriority) => {
  formData.value.priority = newPriority
}, { immediate: true })

  // Getters
  const selectedCourrierData = computed(() => {
    return courriers.value.find(c => c.id === selectedCourrier.value) || null
  })

  const selectedCourrierCount = computed(() => {
    return selectedCourriers.value.length
  })

  const canSelectMultipleDestinataires = computed(() => {
    // Si un seul courrier est sélectionné, on peut choisir plusieurs destinataires
    return selectedCourriers.value.length === 1
  })

  const maxDestinatairesAllowed = computed(() => {
    // Si 2+ courriers: max 1 destinataire
    // Si 1 courrier: pas de limite
    return selectedCourriers.value.length > 1 ? 1 : Infinity
  })

  const canSend = computed(() => {
    return (
      selectedCourriers.value.length > 0 &&
      selectedDestinataires.value.length > 0 &&
      formData.value.date_affect &&
      formData.value.delai_traitement &&
      (!showDateCloture.value || formData.value.date_cloture)
    )
  })

  // Actions
  const setCourriers = (newCourriers) => {
    courriers.value = newCourriers
  }

  const setDestinataires = (newDestinataires) => {
    destinataires.value = newDestinataires
  }

  // Sélectionner un courrier unique (affectation simple)
  const selectCourrier = (courrierId) => {
    selectedCourrier.value = courrierId
    // Ajouter aussi à la liste des courriers sélectionnés
    if (!selectedCourriers.value.includes(courrierId)) {
      selectedCourriers.value = [courrierId]
    }
  }

  // Désélectionner le courrier
  const deselectCourrier = () => {
    selectedCourrier.value = null
    selectedCourriers.value = []
  }

  // Toggle courrier dans la sélection multiple
  const toggleCourrier = (courrierId) => {
    const index = selectedCourriers.value.indexOf(courrierId)
    
    if (index > -1) {
      selectedCourriers.value.splice(index, 1)
      // Si on retire le seul courrier sélectionné
      if (selectedCourrier.value === courrierId) {
        selectedCourrier.value = null
      }
    } else {
      selectedCourriers.value.push(courrierId)
      // Si c'est le premier courrier sélectionné
      if (!selectedCourrier.value) {
        selectedCourrier.value = courrierId
      }
    }

    // Réinitialiser les destinataires si on passe de 1 à 2+ courriers
    if (selectedCourriers.value.length > 1) {
      // Garder seulement le premier destinataire sélectionné
      if (selectedDestinataires.value.length > 1) {
        selectedDestinataires.value = [selectedDestinataires.value[0]]
      }
    }
  }

  // Toggle destinataire avec validation
  const toggleDestinataire = (destinataireId) => {
    // Si sélection multiple interdite et on a déjà un destinataire
    if (!canSelectMultipleDestinataires.value && selectedDestinataires.value.length >= 1) {
      // Remplacer le destinataire au lieu d'en ajouter un
      if (selectedDestinataires.value.includes(destinataireId)) {
        const index = selectedDestinataires.value.indexOf(destinataireId)
        selectedDestinataires.value.splice(index, 1)
      } else {
        selectedDestinataires.value = [destinataireId]
      }
    } else {
      // Sélection multiple autorisée
      const index = selectedDestinataires.value.indexOf(destinataireId)
      if (index > -1) {
        selectedDestinataires.value.splice(index, 1)
      } else {
        selectedDestinataires.value.push(destinataireId)
      }
    }
  }

  // Vérifier si un destinataire est sélectionné
  const isDestinataireSelected = (destinataireId) => {
    return selectedDestinataires.value.includes(destinataireId)
  }

  // Pré-sélectionner un courrier (venant de la liste rapide)
  const selectCourrierFromQuickAction = (courrierId) => {
    selectedCourrier.value = courrierId
    selectedCourriers.value = [courrierId]
    selectedDestinataires.value = []
  }

  // Réinitialiser le formulaire
  const resetForm = () => {
    selectedCourrier.value = null
    selectedCourriers.value = []
    selectedDestinataires.value = []
    formData.value = {
      date_affect: new Date().toISOString().split('T')[0],
      instructions: '',
      statut: 'en cours',
      delai_traitement: '',
      priority: 'STANDARD',
      date_cloture: null,
    }
    showDateCloture.value = false
  }

  // Mettre à jour les données du formulaire
  const updateFormData = (key, value) => {
    formData.value[key] = value
  }

  // Basculer la date de clôture
  const toggleDateCloture = () => {
    showDateCloture.value = !showDateCloture.value
  }

  // Mettre à jour les infos du dossier
  const setFolderInfo = (withFolder, folderNameValue) => {
    useFolder.value = withFolder
    folderName.value = folderNameValue || null
  }

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
    autoPriority, // ✅ Exposer la priorité calculée
    
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
    setFolderInfo,
  }
})