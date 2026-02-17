<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/40">

    <PageHeader
      title="Tranferts"
      description="Gestion des transferts"
    />

      <!-- Two Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Files Selection Panel -->
        <TransfertsDestinatairesSelectionPanel :loading="fileLoading"/>

        <!-- Recipients Selection Panel -->
        <TransfertsRecipientSelectionPanel :loading="recipientLoading" />
      </div>

      <!-- Transfer Summary Bar -->
      <TransfertsSummaryBar
        @save-draft="handleSaveDraft"
        @send-files="handleSendFiles"
      />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTransfertsStore } from '@/stores/transferts'
import { useCourriersArrives } from '~/composables/courriers/useCourriersArrives'
import { useApi } from '~/composables/useApi'
import PageHeader from '~/components/PageHeader.vue'
import TransfertsDestinatairesSelectionPanel from '~/components/transferts/TransfertsDestinatairesSelectionPanel.vue'
import TransfertsRecipientSelectionPanel from '~/components/transferts/TransfertsRecipientSelectionPanel.vue'
import TransfertsSummaryBar from '~/components/transferts/TransfertsSummaryBar.vue'

// Mock data - sera remplacé par les vraies données de l'API
const mockFiles = [
  { id: 1, name: 'Project_Specs_v2.pdf', size: 4.2, unit: 'MB', type: 'PDF' },
  { id: 2, name: 'Design_Assets.zip', size: 128, unit: 'MB', type: 'ZIP' },
  { id: 3, name: 'Meeting_Notes.docx', size: 24, unit: 'KB', type: 'DOC' },
  { id: 4, name: 'Client_Feedback_Logo.png', size: 1.8, unit: 'MB', type: 'IMG' },
]

const mockRecipients = [
  { id: 1, name: 'Jane Doe', email: 'jane.doe@example.com', initials: 'JD' },
  { id: 2, name: 'Bill Smith', email: 'b.smith@corp.com', initials: 'BS' },
  { id: 3, name: 'Robert King', email: 'kingr@design.io', initials: 'RK' },
  { id: 4, name: 'Alice Luna', email: 'a.luna@freelance.com', initials: 'AL' },
]

const store = useTransfertsStore()
const { data: courriers, loading: recipientLoading, error: erroRecipientLoading, refresh: refreshRecipientLoading } = useCourriersArrives('api/courriers-arrives', {
  transform: transformCourriers,
  immediate: true,
})

const { data: users, loading: fileLoading, error: errorFileLoading, refresh: refreshFileLoading } = useApi('api/courriers-arrives', {
  transform: transformCourriers,
  immediate: true,
})

// Simuler le chargement depuis l'API
onMounted(async () => {

 fileLoading.value = true
 recipientLoading.value = true
  
  // Simuler un délai d'API
  await new Promise(resolve => setTimeout(resolve, 500))
  
  store.setFiles(courriers.value)
  store.setRecipients(users.value)

  fileLoading.value = false
  recipientLoading.value = false
})

const handleSaveDraft = () => {
  console.log('Saving draft...', {
    files: store.selectedFiles,
    recipients: store.selectedRecipients
  })
  store.clearSelections()
  navigateTo('/transferts')
}

const handleSendFiles = () => {
  console.log('Sending files...', {
    files: store.selectedFiles,
    recipients: store.selectedRecipients
  })
}
</script>