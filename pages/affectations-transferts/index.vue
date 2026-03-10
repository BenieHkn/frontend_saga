<template>
  <main
      class="flex-1 p-4 lg:p-8 transition-all duration-500 overflow-y-auto"
    >
  <!-- <div class="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col p-5"> -->
      
    <!-- SP, SA, DG : affectations uniquement, sans entête -->
    <div v-if="isSP() || isSA() || isDG()">
      <AffectationsEmises />
    </div>

    <!-- Autres : entête + tabs complets -->
    <template v-else>
      <PageHeader 
        title="Affectations et Transferts" 
        subtitle="Gestion centralisée des affectations et transferts de courriers"
      />

      <AppTabs :tabs="allTabList">
        <template #sent_assignments>
          <div class="space-y-4">
            <AffectationsEmises />
          </div>
        </template>

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
    </template>

  <!-- </div> -->
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TransfertsListe from '~/components/transferts/TransfertsListe.vue'
import AffectationsEmises from '~/components/affectations/AffectationsEmises.vue'
import PageHeader from '~/components/PageHeader.vue'
import AppTabs from '~/components/AppTabs.vue'
import { useAuth } from '~/composables/auth/useAuth'

const { isSP, isSA, isDG } = useAuth()

useHead({
  title: 'Affectations et Transferts - Sagar Revolution',
})

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
</script>