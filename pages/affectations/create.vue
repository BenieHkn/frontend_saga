<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/40">

    <PageHeader title="Nouvelle Affectation"
      description="Affecter un ou plusieurs courrier(s) à un ou plusieurs destinataire(s)" />

    <!-- Two Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 px-6">
      <!-- Courrier Selection Panel -->
      <AffectationsCourrierSelectionPanel :loading="courrierLoading" />

      <!-- Destinataires Selection Panel -->
      <AffectationsDestinataireSelectionPanel :loading="destinataireLoading" />
    </div>

    <!-- Form Panel (Full Width) -->
    <div class="mb-8 px-6">
      <AffectationsFormPanel />
    </div>

    <!-- Summary Bar -->
    <div class="px-6 mb-8">
      <AffectationsSummaryBar @cancel="handleCancel" @submit="handleSubmit" />
    </div>

    <!-- Loading Overlay -->
    <div v-if="submitting" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4">
        <div class="flex flex-col items-center gap-4">
          <Icon name="svg-spinners:ring-resize" class="w-12 h-12 text-purple-600" />
          <h3 class="text-lg font-bold text-slate-900">Création en cours...</h3>
          <p class="text-sm text-slate-600 text-center">
            Création de {{ store.selectedDestinataires.length }} affectation(s) pour {{ store.selectedCourriers.length
            }} courrier(s)
          </p>
          <div class="w-full bg-slate-200 rounded-full h-2 mt-2 overflow-hidden">
            <div class="bg-purple-600 h-full animate-pulse" style="width: 100%"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAffectationsStore } from '~/stores/affectations'
import { useRoute } from 'vue-router'
import AffectationsCourrierSelectionPanel from '~/components/affectations/AffectationsCourrierSelectionPanel.vue'
import AffectationsDestinataireSelectionPanel from '~/components/affectations/AffectationsDestinataireSelectionPanel.vue'
import AffectationsFormPanel from '~/components/affectations/AffectationsFormPanel.vue'
import AffectationsSummaryBar from '~/components/affectations/AffectationsSummaryBar.vue'
import PageHeader from '~/components/PageHeader.vue'

const config = useRuntimeConfig()

useHead({
  title: 'Nouvelle Affectation',
})

const store = useAffectationsStore()
const toast = useToast()
const router = useRouter()
const route = useRoute()
const authToken = ref('')

const courrierLoading = ref(false)
const destinataireLoading = ref(false)
const submitting = ref(false)

// ✅ Récupérer l'ID du courrier pré-sélectionné depuis les query params
const preSelectedCourrierId = ref(null)

// Charger les courriers
const loadCourriers = async () => {
  courrierLoading.value = true

  try {
    let selectedFunction = null
    if (process.client) {
      const savedFunction = localStorage.getItem('selected_entite')
      if (savedFunction) {
        selectedFunction = JSON.parse(savedFunction)
      }
    }

    if (!selectedFunction || !selectedFunction.id) {
      console.error('❌ Aucune fonction sélectionnée')
      toast.add({
        title: 'Erreur',
        description: 'Aucune fonction sélectionnée. Veuillez vous reconnecter.',
        color: 'red',
        timeout: 1500,
      })
      courrierLoading.value = false
      return
    }

    let entite_user = null

    if (process.client) {
      const savedFunction = localStorage.getItem('entite_user')
      if (savedFunction) {
        entite_user = JSON.parse(savedFunction)
      }
    }

    if (!entite_user || !entite_user.id) {
      console.error('❌ Aucune fonction utilisateur sélectionnée')
      toast.add({
        title: 'Erreur',
        description: 'Aucune fonction utilisateur sélectionnée.',
        color: 'red',
        timeout: 1500,
      })
      courrierLoading.value = false
      return
    }

    console.log(`📝 Chargement des courriers avec entite_user_id: ${entite_user.id}`)

    const response = await $fetch(
      selectedFunction.code === "DGML"
        ? `${config.public.apiBase}/courriers-arrives/non-affectes`
        : `${config.public.apiBase}/courriers-arrives/affectes/entite-user/${entite_user.id}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken.value}`,
        },
      })

    const courriers = response.data.map(courrier => ({
      id: courrier.id,
      reference: courrier.document?.reference || '',
      objet: courrier.document?.objet || '',
      structure: courrier.structure || courrier.autre_structure || '',
      date_courrier: courrier.document?.date_courrier || '',
      priority: courrier.priority || 'STANDARD',
      confidentiel: courrier.document?.confidentiel || false,
      url: courrier.document?.url
        ? `${config.public.apiBase}${courrier.document.url}`
        : '',
    }))

    store.setCourriers(courriers)
    console.log(`✅ ${courriers.length} courriers chargés`)

    // ✅ Appliquer la pré-sélection si un courrier était spécifié
    if (preSelectedCourrierId.value) {
      const courrierExiste = courriers.some(c => c.id === preSelectedCourrierId.value)
      
      if (courrierExiste) {
        console.log('✅ Application de la pré-sélection du courrier:', preSelectedCourrierId.value)
        store.selectCourrierFromQuickAction(preSelectedCourrierId.value)
        
        // Scroll vers le courrier sélectionné après un court délai
        setTimeout(() => {
          const selectedCard = document.querySelector('[data-selected="true"]')
          if (selectedCard) {
            selectedCard.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }, 500)
      } else {
        console.warn('⚠️ Le courrier pré-sélectionné n\'existe pas dans la liste:', preSelectedCourrierId.value)
        toast.add({
          title: 'Avertissement',
          description: 'Le courrier sélectionné n\'est plus disponible',
          color: 'orange',
          timeout: 1500,
        })
      }
      
      // Nettoyer la pré-sélection
      preSelectedCourrierId.value = null
    }
  } catch (error) {
    console.error('❌ Erreur lors du chargement des courriers:', error)
    toast.add({
      title: 'Erreur',
      description: 'Impossible de charger les courriers',
      color: 'red',
      timeout: 1500,
    })
  } finally {
    courrierLoading.value = false
  }
}

// Charger les destinataires
const loadDestinataires = async () => {
  destinataireLoading.value = true

  try {
    let entite_user = null

    if (process.client) {
      const savedFunction = localStorage.getItem('entite_user')
      if (savedFunction) {
        entite_user = JSON.parse(savedFunction)
      }
    }

    if (!entite_user || !entite_user.id) {
      console.error('❌ Aucune fonction utilisateur sélectionnée')
      toast.add({
        title: 'Erreur',
        description: 'Aucune fonction utilisateur sélectionnée.',
        color: 'red',
        timeout: 1500,
      })
      courrierLoading.value = false
      return
    }
    const response = await $fetch(`${config.public.apiBase}/entite-users/${entite_user.id}/subordinates`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken.value}`,
      },
    })

    // ✅ CORRECTION : Inclure is_responsable dans le mapping
    const destinataires = response.data
      .filter(item => item.user?.statut && item.actif) // Filtrer utilisateurs actifs ET entite_user active
      .map(item => ({
        id: item.id, // ✅ C'est le entite_user.id (11, 12, 20...)
        user: item.user,
        entite: item.entite,
        actif: item.actif,
        is_interim: item.is_interim,
        is_responsable: item.is_responsable, // ✅ AJOUT CRUCIAL
      }))

    store.setDestinataires(destinataires)
    console.log(`✅ ${destinataires.length} destinataires actifs chargés`)
    
    if (destinataires.length > 0) {
      console.log('📋 Exemple de destinataire:', {
        id: destinataires[0].id,
        nom: destinataires[0].user?.nom,
        prenom: destinataires[0].user?.prenom,
        fonction: destinataires[0].entite?.fonction,
        entite: destinataires[0].entite?.libelle,
        is_responsable: destinataires[0].is_responsable // ✅ Vérifier que c'est bien inclus
      })
    }
  } catch (error) {
    console.error('❌ Erreur lors du chargement des utilisateurs:', error)
    toast.add({
      title: 'Erreur',
      description: 'Impossible de charger les utilisateurs',
      color: 'red',
      timeout: 1500,
    })
  } finally {
    destinataireLoading.value = false
  }
}

// Gérer la soumission
const handleSubmit = async () => {
  // Validation
  if (!store.canSend) {
    toast.add({
      title: 'Erreur',
      description: 'Veuillez remplir tous les champs obligatoires',
      color: 'red',
      timeout: 1500,
    })
    return
  }

  if (store.selectedCourriers.length === 0) {
    toast.add({
      title: 'Erreur',
      description: 'Veuillez sélectionner au moins un courrier',
      color: 'red',
      timeout: 1500,
    })
    return
  }

  if (store.selectedDestinataires.length === 0) {
    toast.add({
      title: 'Erreur',
      description: 'Veuillez sélectionner au moins un destinataire',
      color: 'red',
      timeout: 1500,
    })
    return
  }

  submitting.value = true

  try {
    // Récupérer la fonction avec laquelle l'utilisateur s'est connecté
    let entite_user = null
    if (process.client) {
      const savedFunction = localStorage.getItem('entite_user')
      if (savedFunction) {
        entite_user = JSON.parse(savedFunction)
      }
    }

    if (!entite_user || !entite_user.id) {
      throw new Error('Aucune fonction sélectionnée. Veuillez vous reconnecter.')
    }

    console.log(`📝 Création d'affectations avec emetteur_id: ${entite_user.id}`)
    
    // ✅ Log des destinataires sélectionnés
    console.log('📤 IDs des destinataires sélectionnés:', store.selectedDestinataires)
    console.log('📤 Détails des destinataires:', 
      store.selectedDestinataires.map(id => {
        const dest = store.destinataires.find(d => d.id === id)
        return {
          entite_user_id: dest?.id,
          nom: dest?.user?.nom,
          prenom: dest?.user?.prenom,
          fonction: dest?.entite?.fonction,
          entite: dest?.entite?.libelle,
          is_responsable: dest?.is_responsable
        }
      })
    )

    // Créer une affectation pour chaque combinaison courrier × destinataire
    const affectations = []
    const isMultiCourrier = store.selectedCourriers.length > 1

    for (const courrierId of store.selectedCourriers) {
      for (const destinataireId of store.selectedDestinataires) {
        affectations.push({
          courrier_arrive_id: courrierId,
          destinataire_id: destinataireId, // ✅ C'est bien le entite_user.id
          emetteur_id: entite_user.id,
          date_affect: store.formData.date_affect,
          instructions: store.formData.instructions,
          statut: store.formData.statut,
          delai_traitement: store.formData.delai_traitement,
          date_cloture: store.showDateCloture && store.formData.date_cloture
            ? store.formData.date_cloture
            : null,
          dossier: isMultiCourrier && store.folderName
            ? store.folderName
            : null,
        })
      }
    }

    console.log(`📤 Envoi de ${affectations.length} affectation(s)`)
    console.log('📋 Données à envoyer:', affectations)

    // Envoyer toutes les affectations en parallèle
    const responses = await Promise.all(
      affectations.map(payload =>
        $fetch(`${config.public.apiBase}/affectations`, {
          method: 'POST',
          body: payload,
          headers: {
            Authorization: `Bearer ${authToken.value}`,
            'Content-Type': 'application/json',
          },
        })
      )
    )

    // Vérifier si toutes les requêtes ont réussi
    const successCount = responses.filter(r => r.success).length
    const failureCount = responses.length - successCount

    if (failureCount === 0) {
      toast.add({
        title: 'Succès ! 🎉',
        description: `${affectations.length} affectation(s) créée(s) avec succès`,
        color: 'green',
        timeout: 2000,
      })

      // Réinitialiser le store
      store.resetForm()

      // Rediriger vers la liste des affectations
      setTimeout(() => {
        router.push('/affectations-transferts')
      }, 1500)
    } else {
      toast.add({
        title: 'Avertissement',
        description: `${successCount} affectation(s) créée(s), ${failureCount} échec(s)`,
        color: 'orange',
        timeout: 1500,
      })
      submitting.value = false
    }
  } catch (error) {
    console.error('❌ Erreur lors de la création des affectations:', error)
    console.error('❌ Message d\'erreur:', error.data?.message)
    console.error('❌ Erreurs de validation:', error.data?.errors)

    let errorMessage = 'Impossible de créer les affectations'
    if (error.data?.message) {
      errorMessage = error.data.message
    } else if (error.message) {
      errorMessage = error.message
    }

    toast.add({
      title: 'Erreur',
      description: errorMessage,
      color: 'red',
      timeout: 1500,
    })

    submitting.value = false
  }
}

// Gérer l'annulation
const handleCancel = () => {
  const confirmCancel = confirm('Êtes-vous sûr de vouloir annuler ? Les données saisies seront perdues.')

  if (confirmCancel) {
    store.resetForm()
    router.push('/affectations-transferts')
  }
}

// ✅ Chargement initial avec gestion de la pré-sélection
onMounted(async () => {
  if (process.client) {
    authToken.value = localStorage.getItem('auth_token') || ''
    
    // ✅ Récupérer l'ID du courrier depuis sessionStorage (mis par la page précédente)
    const savedCourrierId = sessionStorage.getItem('preselected_courrier_id')
    if (savedCourrierId) {
      preSelectedCourrierId.value = parseInt(savedCourrierId)
      sessionStorage.removeItem('preselected_courrier_id') // Nettoyer après utilisation
      console.log('📌 Courrier pré-sélectionné détecté:', preSelectedCourrierId.value)
    }
  }

  if (!authToken.value) {
    toast.add({
      title: 'Erreur',
      description: 'Token d\'authentification manquant. Veuillez vous reconnecter.',
      color: 'red',
      timeout: 1500,
    })
    router.push('/connexion')
    return
  }

  // Charger les données en parallèle
  await Promise.all([
    loadCourriers(),
    loadDestinataires()
  ])
})
</script>