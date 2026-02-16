<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col p-5">
      
    <PageHeader 
      title="Affectations et Transferts" 
      subtitle="Gestion centralisée des affectations et transferts de courriers"
    />

    <AppTabs :tabs="filteredTabList">

      <!-- ==============================
           AFFECTATIONS EFFECTUÉES
      ============================== -->
      <template #sent_assignments>
        <div class="space-y-4">
          <AffectationsEmises />
        </div>
      </template>

      <!-- ==============================
           TRANSFERTS EFFECTUÉS
      ============================== -->
      <template #sent_transfers>
        <div class="space-y-4">
          <TransfertsListe 
            type="sent"
            title="Transferts Effectués"
            empty-message="Aucun transfert effectué"
          />
        </div>
      </template>

    </AppTabs>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TransfertsListe from '~/components/transferts/TransfertsListe.vue'
import PageHeader from '~/components/PageHeader.vue'
import AppTabs from '~/components/AppTabs.vue'

// Configuration du titre de la page
useHead({
  title: 'Affectations et Transferts - Sagar Revolution',
})

// Récupérer le code de la fonction sélectionnée
const selectedFunctionCode = ref(null)

onMounted(() => {
  if (process.client) {
    const savedFunction = localStorage.getItem('selected_entite')
    if (savedFunction) {
      const selectedFunction = JSON.parse(savedFunction)
      selectedFunctionCode.value = selectedFunction.code
      console.log('🔑 Code de la fonction:', selectedFunctionCode.value)
    }
  }
})

// Définition des onglets (tous)
const allTabList = ref([
  { 
    id: 'sent_assignments', 
    label: 'Affectations',
    icon: 'i-heroicons-clipboard-document-check',
    count: null
  },
  { 
    id: 'sent_transfers', 
    label: 'Transferts',
    icon: 'i-heroicons-arrow-up-tray',
    count: null
  }
])

// Filtrer les onglets en fonction du code de la fonction
const filteredTabList = computed(() => {
  // Si la fonction est DGML, on retire l'onglet "Affectations Reçues"
  if (selectedFunctionCode.value === 'DGML') {
    return allTabList.value.filter(tab => tab.id !== 'received_assignments')
  }
  // Sinon, on affiche tous les onglets
  return allTabList.value
})
</script>

<style scoped>
</style>