<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/40">

    <PageHeader
      title="Transferts"
      description="Gestion des transferts de courriers"
    />

    <div class="max-w-7xl mx-auto px-6 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8" style="height: calc(100vh - 300px); min-height: 600px;">

        <!-- Courriers Selection Panel (gauche) -->
        <div class="flex flex-col">
          <TransfertsCourriersSelectionPanel :loading="courriersLoading" />
        </div>

        <!-- Destinataires Selection Panel (droite) -->
        <div class="flex flex-col">
          <TransfertsDestinatairesSelectionPanel :loading="destinatairesLoading" />
        </div>

      </div>

      <TransfertsSummaryBar
        @save-draft="handleSaveDraft"
        @send-files="handleSendFiles"
        :loading="formLoading"
      />
    </div>

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
import { useDestinataires } from '~/composables/transferts/useTransfertsDestinataires'
import { useTransfertsForm } from '~/composables/transferts/useTransfertsForm'
import { useAuth } from '~/composables/auth/useAuth'
import TransfertsCourriersSelectionPanel from '~/components/transferts/TransfertsCourriersSelectionPanel.vue'
import TransfertsDestinatairesSelectionPanel from '~/components/transferts/TransfertsDestinatairesSelectionPanel.vue'
import TransfertsSummaryBar from '~/components/transferts/TransfertsSummaryBar.vue'
import FormNotification from '~/components/FormNotification.vue'
import PageHeader from '~/components/PageHeader.vue'

const config = useRuntimeConfig()
const store = useTransfertsStore()
const toast = useToast()

const { peutTransferer, getEmetteurId } = useAuth()

// États de chargement
const courriersLoading = ref(false)
const destinatairesLoading = ref(false)

const {
  tableData: destinatairesData,
  loading: destinatairesLoadingComposable,
  error: destinatairesError,
  accessDenied,
  fetchDestinataires
} = useDestinataires()

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

const closeNotification = () => {
  notification.show = false
  notification.details = []
  notification.stats = null
}

// ============================================================================
// CHARGEMENT DES COURRIERS REÇUS — comme dans form-affectation
// ============================================================================
const loadCourriers = async () => {
  courriersLoading.value = true

  try {
    let entite_user = null
    if (process.client) {
      const saved = localStorage.getItem('entite_user')
      if (saved) entite_user = JSON.parse(saved)
    }

    if (!entite_user?.id) {
      toast.add({
        title: 'Erreur',
        description: 'Aucune fonction utilisateur sélectionnée.',
        color: 'red',
        timeout: 1500,
      })
      return
    }

    const authToken = process.client ? localStorage.getItem('auth_token') || '' : ''
    const emetteurId = getEmetteurId() ?? entite_user.id

    console.log(`📝 Chargement des courriers reçus pour entite_user_id: ${emetteurId}`)

    // On récupère les courriers affectés à cet utilisateur (= courriers reçus)
    const response = await $fetch(
      `${config.public.apiBase}/courriers-arrives/affectes/entite-user/${emetteurId}`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${authToken}` },
      }
    )

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
    console.log(`✅ ${courriers.length} courriers reçus chargés`)

    // Présélection depuis sessionStorage
    handlePreselectedCourrier()

  } catch (error) {
    console.error('❌ Erreur lors du chargement des courriers:', error)
    toast.add({
      title: 'Erreur',
      description: 'Impossible de charger les courriers reçus',
      color: 'red',
      timeout: 1500,
    })
  } finally {
    courriersLoading.value = false
  }
}

// ============================================================================
// PRÉSÉLECTION — s'exécute après store.setCourriers()
// ============================================================================
const handlePreselectedCourrier = () => {
  if (!process.client) return

  const preselectedId = sessionStorage.getItem('preselected_courrier_id_transfer')
  if (!preselectedId) return

  const courrierIdNum = parseInt(preselectedId, 10)

  const existe = store.courriers.some(c => c.id === courrierIdNum)

  if (existe) {
    store.selectedCourriers = [courrierIdNum]
    console.log('✅ Courrier présélectionné dans le store:', courrierIdNum)
    toast.add({
      title: 'Courrier présélectionné',
      description: 'Courrier sélectionné automatiquement',
      color: 'green',
      timeout: 2000,
    })
  } else {
    console.warn('⚠️ Courrier non trouvé pour id:', courrierIdNum)
    toast.add({
      title: 'Attention',
      description: "Le courrier présélectionné n'a pas été trouvé",
      color: 'orange',
      timeout: 3000,
    })
  }

  sessionStorage.removeItem('preselected_courrier_id_transfer')
}

// ============================================================================
// ACCÈS REFUSÉ
// ============================================================================
const showAccessDeniedAlert = async () => {
  const result = await Swal.fire({
    icon: 'error',
    title: 'Accès refusé',
    html: `
      <div class="text-left space-y-3">
        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
          <div class="flex items-start gap-3">
            <svg class="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <div class="flex-1">
              <p class="font-semibold text-gray-900 mb-2">Vous ne pouvez pas effectuer de transfert</p>
              <p class="text-sm text-gray-700">
                Seuls les <strong>directeurs techniques</strong>, <strong>chefs de service/division</strong>
                et les <strong>secrétariats des directions techniques</strong> sont autorisés à effectuer
                des transferts de courriers.
              </p>
            </div>
          </div>
        </div>
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p class="text-xs text-blue-800">
            <strong>💡 Que faire ?</strong><br>
            Si vous pensez que vous devriez avoir accès à cette fonctionnalité,
            veuillez contacter votre administrateur système.
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

// ============================================================================
// MONTAGE
// ============================================================================
onMounted(async () => {
  console.log('🚀 Chargement de la page transfert...')

  if (!peutTransferer()) {
    console.warn('🚫 Accès refusé : permission faire_transfert manquante')
    await showAccessDeniedAlert()
    return
  }

  try {
    // Chargement en parallèle
    await Promise.all([
      loadCourriers(),
      fetchDestinataires()
    ])

    if (accessDenied.value) {
      console.error('🚫 Accès refusé détecté côté API (403)')
      await showAccessDeniedAlert()
      return
    }

    store.setDestinataires(destinatairesData.value ?? [])
    console.log('✅ Destinataires chargés:', store.destinataires.length)

    if (destinatairesError.value && !accessDenied.value) {
      showNotification({
        type: 'error',
        title: 'Erreur de chargement',
        message: destinatairesError.value,
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

// ============================================================================
// HANDLERS
// ============================================================================
const handleSaveDraft = async () => {
  const result = await saveDraft()
  showNotification(result)
}

const handleSendFiles = async () => {
  const result = await sendTransferts({ objet: 'Transfert de courrier' })
  showNotification(result)

  if (result.success && result.type === 'success') {
    setTimeout(() => navigateTo('/affectations-transferts'), 2000)
  } else if (result.type === 'warning') {
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
            <p class="text-sm text-gray-600">Voulez-vous consulter la liste des transferts ?</p>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Voir les transferts',
        cancelButtonText: 'Rester ici',
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#6b7280',
      })

      if (confirmResult.isConfirmed) navigateTo('/affectations-transferts')
    }, 2000)
  }
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