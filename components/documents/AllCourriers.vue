<template>
  <UContainer>
    <PageHeader 
      title="Documents"
      subtitle="Gestion et suivi des documents"
    />

    <!-- Types de documents -->
    <div class="flex flex-wrap gap-4 justify-between">
      <div
        v-for="data in documentTypes"
        :key="data.id"
        @click="handleClick(data)"
        class="cursor-pointer transition-all"
      >
        <UBadge
          variant="soft"
          color="blue"
          size="lg"
          class="p-4 hover:ring-2 hover:ring-secondary-500"
          :class="selectedType.id === data.id ? 'ring-2 ring-secondary-500' : ''"
        >
          <Icon :name="data.icon" class="h-8 w-8 mr-2" />
          <div>
            <h3 class="font-bold text-base">{{ data.title }}</h3>
            <p class="text-xs text-gray-500">{{ data.description }}</p>
          </div>
        </UBadge>
      </div>
    </div>

    <!-- Contenu dynamique avec chargement paresseux -->
    <div class="mt-10 space-y-4 border-t pt-8">
      <!-- État de chargement -->
      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <div class="text-center">
          <Icon name="i-heroicons-arrow-path" class="w-10 h-10 text-blue-500 mx-auto mb-3 animate-spin" />
          <p class="text-sm text-gray-600">Chargement...</p>
        </div>
      </div>

      <!-- Composants chargés dynamiquement -->
      <template v-else>
        <KeepAlive>
          <component :is="currentComponent" />
        </KeepAlive>
      </template>
    </div>
  </UContainer>
</template>

<script setup>
import { ref, computed, watch, shallowRef } from 'vue'

// Chargement paresseux des composants
const CourriersArrivesListe = defineAsyncComponent({
  loader: () => import('~/components/courriers/CourriersArrivesListe.vue'),
  delay: 200,
  timeout: 15000,
  loadingComponent: () => null,
  errorComponent: () => null,
})

const CourriersDepartsListe = defineAsyncComponent({
  loader: () => import('~/components/courriers/CourriersDepartsListe.vue'),
  delay: 200,
  timeout: 15000,
})

const CourriersDocumentsInternes = defineAsyncComponent({
  loader: () => import('~/components/courriers/CourriersDocumentsInternes.vue'),
  delay: 200,
  timeout: 15000,
})

const documentTypes = [
  {
    id: 0,
    title: 'Tous les documents',
    icon: 'i-heroicons-document-text',
    color: 'green',
    description: 'Rapports, PV, notes etc.',
    component: 'CourriersArrivesListe'
  },
  {
    id: 1,
    title: 'Courriers Arrivés',
    icon: 'i-heroicons-inbox-arrow-down',
    color: 'blue',
    description: 'Gestion des courriers arrivés',
    component: 'CourriersArrivesListe'
  },
  {
    id: 2,
    title: 'Courriers Départs',
    icon: 'i-heroicons-paper-airplane',
    color: 'orange',
    description: 'Gestion des courriers départs',
    component: 'CourriersDepartsListe'
  },
  {
    id: 3,
    title: 'Documents Internes',
    icon: 'i-heroicons-document-text',
    color: 'green',
    description: 'Rapports, PV, notes etc.',
    component: 'CourriersDocumentsInternes'
  }
]

const selectedType = ref(documentTypes[0])
const isLoading = ref(false)
const currentComponent = shallowRef(null)

// Composant actuel basé sur la sélection
const componentMap = {
  CourriersArrivesListe,
  CourriersDepartsListe,
  CourriersDocumentsInternes,
}

// Charger le composant initial
onMounted(() => {
  loadComponent(selectedType.value.component)
})

// Fonction pour charger un composant
const loadComponent = async (componentName) => {
  isLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 100)) // Petit délai
    currentComponent.value = componentMap[componentName]
  } catch (error) {
    console.error('Erreur lors du chargement du composant:', error)
  } finally {
    isLoading.value = false
  }
}

// Changer de composant quand on change de type
const handleClick = async (data) => {
  if (selectedType.value.id === data.id) return // Éviter de recharger si déjà sélectionné
  
  selectedType.value = data
  await loadComponent(data.component)
}
</script>