<script setup>

// Configuration des types de documents
const documentTypes = [
  {
    id: 0,
    title: 'Tous les documents',
    icon: 'i-heroicons-document-text',
    color: 'green',
    route: '/courriers/form_document_interne',
    description: 'Rapports, PV, notes etc.'
  },
  {
    id: 1,
    title: 'Courriers Arrivés',
    icon: 'i-heroicons-inbox-arrow-down',
    color: 'blue',
    route: '/formulaires/courrier-arrive',
    description: 'Gestion des courriers arrivés'
  },
  {
    id: 2,
    title: 'Courriers Départs',
    icon: 'i-heroicons-paper-airplane',
    color: 'orange',
    route: '/formulaires/courrier-depart',
    description: 'Gestion des courriers départs'
  },
  {
    id: 3,
    title: 'Documents Internes',
    icon: 'i-heroicons-document-text',
    color: 'green',
    route: '/courriers/form_document_interne',
    description: 'Rapports, PV, notes etc.'
  },
];

const selectedType = ref(documentTypes[0]);

const handleClick = (data) => {
  selectedType.value = data
  console.log(selectedType.value)
}

</script>

<template>
  <UContainer class="">

    <PageHeader 
      title="Documents"
      subtitle="Gestion et suivi des documents"
    />

    <div class="flex flex-wrap justify-between">
      <div v-for="(data) in documentTypes" :key="key" @click="handleClick(data)"
        class="bg-transparent transition-all">
        <!-- <div class="flex items-center gap-4">
          <UAvatar :icon="data.icon" :chip-color="data.color" size="lg" />
          <div>
            <h3 class="font-bold">{{ data.title }}</h3>
            <p class="text-sm text-gray-500">{{ data.description }}</p>
          </div>
        </div> -->
        <UBadge color="blue" variant="soft" size="lg" class="ml-auto p-4 cursor-pointer  hover:ring-2 hover:ring-primary-500">
        <Icon :name="data.icon" class="h-8 w-8 mr-1" />
        <NuxtLink :to="data.route">
          <div class="bg-transparent">
            <h3 class="font-bold text-sm text-base">{{ data.title }}</h3>
            <p class="text-xs text-gray-500">{{ data.description }}</p>
          </div>
        </NuxtLink>
      </UBadge>
      </div>
    </div>

    <div v-if="selectedType.id === 0" class="mt-10 space-y-4 border-t pt-8">
      <CourriersArrivesListe />
    </div>

    <div v-else-if="selectedType.id === 1" class="mt-10 space-y-4 border-t pt-8">
      <CourriersArrivesListe />
    </div>

    <div v-else-if="selectedType.id === 2" class="mt-10 space-y-4 border-t pt-8">
      <CourriersDepartsListe />
    </div>

    <div v-else-if="selectedType.id === 3" class="text-center py-20 text-gray-400 italic">
      <CourriersDocumentsInternes />
    </div>
  </UContainer>
</template>