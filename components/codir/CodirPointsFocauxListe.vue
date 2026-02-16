<script setup lang="ts">

// Données simulées
const store = useCodirsStore()

const searchQuery = ref('')

// Filtrage simple
const filteredItems = computed(() => {
  return store.currentCodir?.pointsFocaux?.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesSearch
  })
})

const handleEdit = (item: any) => {
  console.log(item)
  navigateTo(`/codir/points-focaux/${item.id}`)
}
</script>

<template>
  <UContainer class="max-w-screen bg-white p-5 rounded-xxl dark:bg-gray-950">
        <PageHeader class="mt-5" title="Points à l'Ordre du Jour"/>

        <div class="mb-8 flex flex-wrap items-center gap-4">
          <div class="relative min-w-[300px] flex-1">
            <UInput 
              v-model="searchQuery"
              icon="i-heroicons-magnifying-glass"
              placeholder="Rechercher un point, un service ou une action..."
              size="xl"
              :ui="{ rounded: 'rounded-xl', icon: { trailing: { pointer: '' } } }"
              class="bg-white dark:bg-gray-900 shadow-sm"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 gap-6">
          <CodirPointsFocauxCard 
            v-for="item in filteredItems" 
            :key="item.id" 
            :point="item"
            @edit="handleEdit(item)"
          />
          
          <div v-if="filteredItems.length === 0" class="flex flex-col items-center justify-center py-20 text-gray-400">
            <UIcon name="i-heroicons-face-frown" class="text-6xl mb-4" />
            <p class="text-xl font-bold">Aucun point trouvé</p>
          </div>
        </div>

      </UContainer>
</template>