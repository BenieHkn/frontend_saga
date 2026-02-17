<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/40">

    <PageHeader
      title="Transferts"
      description="Gestion des transferts de courriers"
    />

    <div class="max-w-7xl mx-auto px-6 py-8">
      <!-- Two Column Layout avec hauteur fixe -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8" style="height: calc(100vh - 300px); min-height: 600px;">
        
        <!-- Courriers Selection Panel (gauche) -->
        <div class="flex flex-col">
          <AffectationsCheckboxListe :loading="affectationsLoading" />
        </div>

        <!-- Destinataires Selection Panel (droite) -->
        <div class="flex flex-col">
          <TransfertsDestinatairesSelectionPanel :loading="destinatairesLoading" />
        </div>
        
      </div>

      <!-- Summary Bar -->
      <TransfertsSummaryBar 
        @save-draft="handleSaveDraft"
        @send-files="handleSendFiles"
        :loading="formLoading"
      />
    </div>

    <!-- Notification Component -->
    <FormNotification
      :show="notification.show"
      :type="notification.type"
      :title="notification.title"
      :message="notification.message"
      :details="notification.details"
      :stats="notification.stats"
      :auto-close="notification.autoClose"
      :duration="notification.duration"
      @close="closeNotification"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { useTransfertsStore } from '~/stores/transferts'
import { useAffectations } from '@/composables/affectations/useAffectations'
import { useDestinataires } from '~/composables/transferts/useTransfertsDestinataires'
import { useTransfertsForm } from '~/composables/transferts/useTransfertsForm'
import AffectationsCheckboxListe from '~/components/affectations/AffectationsCheckboxListe.vue'
import TransfertsDestinatairesSelectionPanel from '~/components/transferts/TransfertsDestinatairesSelectionPanel.vue'
import TransfertsSummaryBar from '~/components/transferts/TransfertsSummaryBar.vue'
import FormNotification from '~/components/FormNotification.vue'
import PageHeader from '~/components/PageHeader.vue'

const store = useTransfertsStore()
const toast = useToast()
const router = useRouter() // ✅ AJOUT : Pour la redirection

// Composables pour les données
const { 
  tableData: affectationsData, 
  loading: affectationsLoading, 
  error: affectationsError, 
  fetchAffectations 
} = useAffectations()

const { 
  tableData: destinatairesData, 
  loading: destinatairesLoading, 
  error: destinatairesError,
  accessDenied,
  fetchDestinataires 
} = useDestinataires()

// Composable pour le formulaire
const {
  loading: formLoading,
  sendTransferts,
  saveDraft
} = useTransfertsForm()

// Notification state
const notification = reactive({
  show: false,
  type: 'info',
  title: '',
  message: '',
  details: [],
  stats: null,
  autoClose: true,
  duration: 5000
})

// Fonction pour afficher une notification
const showNotification = (data) => {
  notification.show = true
  notification.type = data.type || 'info'
  notification.title = data.title || 'Notification'
  notification.message = data.message || ''
  notification.details = data.details || []
  notification.stats = data.stats || null
  notification.autoClose = data.autoClose !== undefined ? data.autoClose : true
  notification.duration = data.duration || (data.type === 'error' ? 5000 : 2500)
}

// Fonction pour fermer la notification
const closeNotification = () => {
  notification.show = false
  notification.details = []
  notification.stats = null
}

// Afficher SweetAlert pour l'erreur 403
const showAccessDeniedAlert = async () => {
  const result = await Swal.fire({
    icon: 'error',
    title: 'Accès refusé',
    html: `
      <div class="text-left space-y-3">
        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
          <div class="flex items-start gap-3">
            <svg class="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <div class="flex-1">
              <p class="font-semibold text-gray-900 mb-2">Vous ne pouvez pas effectuer de transfert</p>
              <p class="text-sm text-gray-700">
                Seuls les <strong>responsables de service</strong> sont autorisés à effectuer des transferts de courriers.
              </p>
            </div>
          </div>
        </div>
        
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p class="text-xs text-blue-800">
            <strong>💡 Que faire ?</strong><br>
            Si vous pensez que vous devriez avoir accès à cette fonctionnalité, veuillez contacter votre administrateur système.
          </p>
        </div>
      </div>
    `,
    confirmButtonText: '← Retour aux documents',
    confirmButtonColor: '#3b82f6',
    allowOutsideClick: false,
    allowEscapeKey: false,
    customClass: {
      popup: 'swal2-access-denied',
      title: 'text-xl font-semibold text-gray-900',
      htmlContainer: 'text-sm',
      confirmButton: 'px-6 py-3 rounded-lg font-semibold shadow-lg'
    }
  })

  if (result.isConfirmed) {
    navigateTo('/documents')
  }
}

// Présélection basée sur courrier_arrive_id
const handlePreselectedCourrier = () => {
  if (!process.client) return

  const preselectedCourrierArrivId = sessionStorage.getItem('preselected_courrier_id_transfer')
  
  if (preselectedCourrierArrivId) {
    console.log('🎯 Courrier présélectionné détecté (courrier_arrive_id):', preselectedCourrierArrivId)
    
    const courrierIdNum = parseInt(preselectedCourrierArrivId, 10)
    
    const affectation = affectationsData.value?.find(a => 
      a._raw?.courrier_arrive_id === courrierIdNum
    )
    
    if (affectation) {
      store.selectedAffectations = [affectation.id]
      
      console.log('✅ Affectation présélectionnée:', {
        affectation_id: affectation.id,
        courrier_arrive_id: courrierIdNum,
        reference: affectation.reference || affectation._raw?.courrier_arrive?.document?.reference,
        instructions: affectation.instructions
      })
      
      toast.add({
        title: 'Courrier présélectionné',
        description: `Affectation sélectionnée automatiquement`,
        color: 'green',
        timeout: 2000,
      })
    } else {
      console.warn('⚠️ Aucune affectation trouvée pour le courrier_arrive_id:', courrierIdNum)
      
      toast.add({
        title: 'Attention',
        description: 'Le courrier présélectionné n\'a pas été trouvé dans vos affectations',
        color: 'orange',
        timeout: 3000,
      })
    }
    
    sessionStorage.removeItem('preselected_courrier_id_transfer')
  }
}

// Charger les données au montage
onMounted(async () => {
  console.log('🚀 Chargement des données...')
  
  try {
    await Promise.all([
      fetchAffectations(),
      fetchDestinataires()
    ])

    if (accessDenied.value) {
      console.error('🚫 Accès refusé détecté')
      await showAccessDeniedAlert()
      return
    }

    if (affectationsData.value) {
      store.setAffectations(affectationsData.value)
      console.log('✅ Affectations chargées:', affectationsData.value.length)
      
      if (affectationsData.value.length > 0) {
        console.log('📋 Exemple d\'affectation:', {
          affectation_id: affectationsData.value[0].id,
          courrier_arrive_id: affectationsData.value[0]._raw?.courrier_arrive_id,
          reference: affectationsData.value[0].reference
        })
      }
    } else {
      console.warn('⚠️ Aucune affectation retournée')
      store.setAffectations([])
    }

    if (destinatairesData.value) {
      store.setDestinataires(destinatairesData.value)
      console.log('✅ Destinataires chargés:', destinatairesData.value.length)
    } else {
      console.warn('⚠️ Aucun destinataire retourné')
      store.setDestinataires([])
    }

    handlePreselectedCourrier()

    if ((affectationsError.value || destinatairesError.value) && !accessDenied.value) {
      showNotification({
        type: 'error',
        title: 'Erreur de chargement',
        message: affectationsError.value || destinatairesError.value,
        autoClose: false
      })
    }

  } catch (err) {
    showNotification({
      type: 'error',
      title: 'Erreur de chargement',
      message: `Impossible de charger les données: ${err.message}`,
      autoClose: false
    })
    console.error('❌ Erreur au montage:', err)
  }
})

// Gestionnaire pour sauvegarder le brouillon
const handleSaveDraft = async () => {
  console.log('💾 Sauvegarde du brouillon...')
  
  const result = await saveDraft()
  showNotification(result)
}

// ✅ MODIFICATION : Gestionnaire avec redirection après succès
const handleSendFiles = async () => {
  console.log('📤 Envoi des transferts...')
  
  const result = await sendTransferts({
    objet: 'Transfert de courrier'
  })
  
  // Afficher la notification
  showNotification(result)

  // ✅ REDIRECTION si succès complet (tous les transferts ont réussi)
  if (result.success && result.type === 'success') {
    console.log('✅ Transferts envoyés avec succès, redirection dans 2 secondes...')
    
    // Attendre 2 secondes pour que l'utilisateur voie la notification
    setTimeout(() => {
      navigateTo('/affectations-transferts')
    }, 2000)
  } else if (result.type === 'warning') {
    // ✅ Succès partiel : demander confirmation avant redirection
    console.log('⚠️ Transferts partiellement envoyés')
    
    setTimeout(async () => {
      const confirmResult = await Swal.fire({
        icon: 'warning',
        title: 'Transferts partiellement envoyés',
        html: `
          <div class="text-left">
            <p class="mb-3">
              <strong>${result.stats.success}</strong> transfert(s) envoyé(s) avec succès<br>
              <strong>${result.stats.error}</strong> transfert(s) en échec
            </p>
            <p class="text-sm text-gray-600">
              Voulez-vous consulter la liste des transferts ?
            </p>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Voir les transferts',
        cancelButtonText: 'Rester ici',
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#6b7280',
      })

      if (confirmResult.isConfirmed) {
        navigateTo('/affectations-transferts')
      }
    }, 2000)
  }
  // ✅ Si erreur totale, pas de redirection
}
</script>

<style scoped>
:deep(.swal2-access-denied) {
  border-radius: 1rem;
  padding: 2rem;
}

:deep(.swal2-access-denied .swal2-icon.swal2-error) {
  border-color: #ef4444;
  color: #ef4444;
}

:deep(.swal2-access-denied .swal2-html-container) {
  margin: 1.5rem 0;
  max-width: 500px;
}
</style>