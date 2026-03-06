<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/40">
    
    <PageHeader
      title="Nouvelle Affectation"
      description="Affecter des courriers à des destinataires"
    />

    <!-- Two Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Courriers Selection Panel (Sélection multiple) -->
      <AffectationsCourrierSelectionPanel :loading="courrierLoading" />

      <!-- Destinataires Selection Panel (Sélection multiple) -->
      <AffectationsDestinataireSelectionPanel :loading="destinataireLoading" />
    </div>

    <!-- Form Panel (Full Width) -->
    <div class="mb-8">
      <AffectationsFormPanel />
    </div>

    <!-- Summary Bar -->
    <AffectationsSummaryBar
      @cancel="handleCancel"
      @submit="handleSubmit"
    />

    <!-- Loading Overlay -->
    <div 
      v-if="submitting" 
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4">
        <div class="flex flex-col items-center gap-4">
          <Icon name="svg-spinners:ring-resize" class="w-12 h-12 text-purple-600" />
          <h3 class="text-lg font-bold text-slate-900">Création en cours...</h3>
          <p class="text-sm text-slate-600 text-center">
            Création de l'affectation pour {{ store.selectedDestinataires.length }} destinataire(s)
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAffectationsStore } from '~/stores/affectations'
import AffectationsCourrierSelectionPanel from '~/components/affectations/AffectationsCourrierSelectionPanel.vue'
import AffectationsDestinataireSelectionPanel from '~/components/affectations/AffectationsDestinataireSelectionPanel.vue'
import AffectationsFormPanel from '~/components/affectations/AffectationsFormPanel.vue'
import AffectationsSummaryBar from '~/components/affectations/AffectationsSummaryBar.vue'
import PageHeader from '~/components/PageHeader.vue'

useHead({
  title: 'Nouvelle Affectation - Sagar Revolution',
})

const store = useAffectationsStore()
const toast = useToast()
const authToken = ref('')
const config = useRuntimeConfig()

const courrierLoading = ref(false)
const destinataireLoading = ref(false)
const submitting = ref(false)

// Charger les courriers
const loadCourriers = async () => {
  courrierLoading.value = true
  
  try {
    const response = await $fetch(`${config.public.apiBase}/courriers-arrives`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken.value}`,
      },
    })

    const courriers = response.data.map(courrier => ({
      id: courrier.id, // IMPORTANT: utiliser l'ID du courrier_arrive, pas du document
      reference: courrier.document?.reference || '',
      objet: courrier.document?.objet || '',
      structure: courrier.structure || '',
      date_courrier: courrier.document?.date_courrier || '',
      priority: courrier.document?.priority || 'STANDARD',
      confidentiel: courrier.document?.confidentiel || false,
      url: courrier.document?.url
        ? `${config.public.apiBase}${courrier.document.url}`
        : '',
    }))

    store.setCourriers(courriers)
    console.log(`✅ ${courriers.length} courriers chargés`)
  } catch (error) {
    console.error('Erreur lors du chargement des courriers:', error)
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
    let user = null

    if (process.client) {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        user = JSON.parse(userStr)
      }
    }

    if (!user || !user.id) {
      console.error('❌ Aucun utilisateur récupéré')
      toast.add({
        title: 'Erreur',
        description: 'Aucun utilisateur récupéré. Veuillez vous reconnecter.',
        color: 'red',
        timeout: 1500,
      })
      return
    }

    const response = await $fetch(`${config.public.apiBase}/users/${user.id}/subordinates`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken.value}`,
      },
    })

    const destinataires = response.data
      .filter(item => item.user?.statut) // Filtrer uniquement les utilisateurs actifs
      .map(item => ({
        id: item.entite_user_id,
        user: item.user,
        fonction: item.fonction,
        entite: item.entite,
      }))

    store.setDestinataires(destinataires)
    console.log(`✅ ${destinataires.length} destinataires actifs chargés`)
  } catch (error) {
    console.error('Erreur lors du chargement des utilisateurs:', error)
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
  if (!store.canSend) {
    toast.add({
      title: 'Erreur',
      description: 'Veuillez sélectionner au moins un courrier et un destinataire',
      color: 'red',
      timeout: 1500,
    })
    return
  }

  submitting.value = true

  try {
    // Récupérer la fonction avec laquelle l'utilisateur s'est connecté
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
      submitting.value = false
      return
    }

    console.log(`📝 Création de l'affectation avec emetteur_id: ${selectedFunction.id}`)

    // Préparer le payload selon l'API
    const payload = {
      emetteur_id: selectedFunction.id,
      instructions: store.formData.instructions || null,
      priority: store.formData.priority,
      date_affect: store.formData.date_affect,
      delai_traitement: store.formData.delai_traitement || null,
      courriers: store.selectedCourriers,       // Array d'IDs
      destinataires: store.selectedDestinataires // Array d'IDs
    }

    console.log('📤 Envoi du payload:', payload)

    // Envoyer la requête
    const response = await $fetch(`${config.public.apiBase}/affectations`, {
      method: 'POST',
      body: payload,
      headers: {
        Authorization: `Bearer ${authToken.value}`,
        'Content-Type': 'application/json',
      },
    })

    if (response.success) {
      toast.add({
        title: 'Succès',
        description: 'Affectation créée avec succès',
        color: 'green',
        timeout: 2000,
      })

      // Réinitialiser le store
      store.resetForm()

      // Rediriger vers la liste des affectations
      setTimeout(() => {
        navigateTo('/affectations')
      }, 1500)
    } else {
      toast.add({
        title: 'Erreur',
        description: response.message || 'Impossible de créer l\'affectation',
        color: 'red',
        timeout: 1500,
      })
    }
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'affectation:', error.data?.message)
    
    // Afficher les erreurs de validation s'il y en a
    if (error.data?.errors) {
      const errorMessages = Object.values(error.data.errors).flat().join(', ')
      toast.add({
        title: 'Erreur de validation',
        description: errorMessages,
        color: 'red',
        timeout: 5000,
      })
    } else {
      toast.add({
        title: 'Erreur',
        description: error.data?.message || 'Impossible de créer l\'affectation',
        color: 'red',
        timeout: 1500,
      })
    }
  } finally {
    submitting.value = false
  }
}

// Gérer l'annulation
const handleCancel = () => {
  store.resetForm()
  navigateTo('/affectations')
}

// Chargement initial
onMounted(async () => {
  if (process.client) {
    authToken.value = localStorage.getItem('auth_token') || ''
  }

  // Charger les données en parallèle
  await Promise.all([
    loadCourriers(),
    loadDestinataires()
  ])
})
</script>