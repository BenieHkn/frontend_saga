<script setup>
import { useCodirsStore } from '@/stores/codirs'
import { formatDateFR } from '@/utils/formatters'

const currentView = ref('table')
const store = useCodirsStore()

const columns = [
  { key: 'id', label: 'ID', cellClass: 'font-mono' },
  { key: 'date', label: 'Date', align: 'right' },
  { key: 'time', label: 'Heure', cellClass: 'text-black' }
]

const currentPage = ref(1)

onMounted(() => {
  store.getCodirs()
})

// ✅ Logique simplifiée - tout est dans le store
const handleCreate = () => {
  store.createNewCodir()
  navigateTo('/codir/create')
}

const handleEdit = (item) =>{
  store.editCodir(item)
  navigateTo('/codir/edit')
}
</script>

<template>
  <div class="max-w-6xl mx-auto py-10 px-6">
    <!-- Header avec actions -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <PageHeader title="Listing des codirs" description="Consultez l'historique des codirs" />

      <!-- Sélecteur de vue -->
      <div class="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
        <UButton @click="currentView = 'list'" :variant="currentView === 'list' ? 'solid' : 'ghost'" color="white"
          icon="i-heroicons-queue-list" size="sm" class="rounded-lg" aria-label="Vue liste" />
        <UButton @click="currentView = 'grid'" :variant="currentView === 'grid' ? 'solid' : 'ghost'" color="white"
          icon="i-heroicons-squares-2x2" size="sm" class="rounded-lg" aria-label="Vue grille" />
        <UButton @click="currentView = 'table'" :variant="currentView === 'table' ? 'solid' : 'ghost'" color="white"
          icon="i-heroicons-table-cells" size="sm" class="rounded-lg" aria-label="Vue tableau" />
      </div>

      <!-- Bouton créer -->
      <UButton @click="handleCreate" variant="ghost" color="blue" icon="i-heroicons-plus" label="Nouveau CODIR"
        size="sm" class="rounded-lg" />
    </div>

    <!-- État vide -->
    <div v-if="store.codirs.length === 0" class="text-center py-20">
      <div class="text-gray-400 dark:text-gray-600 mb-4">
        <UIcon name="i-heroicons-folder-open" class="w-16 h-16 mx-auto" />
      </div>
      <h3 class="text-lg font-semibold mb-2">Aucun CODIR</h3>
      <p class="text-gray-500 mb-6">Commencez par créer votre premier CODIR</p>
      <UButton @click="handleCreate" color="blue" icon="i-heroicons-plus">
        Créer un CODIR
      </UButton>
    </div>

    <!-- Vues des données -->
    <Transition v-else name="fade" mode="out-in">
      <!-- Vue tableau -->
      <div v-if="currentView === 'table'" key="table"
        class="bg-white text-black dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800">
        <DataTable2 :left-aligned-columns="['id']" :data="store.codirs" :columns="columns" @edit="handleEdit(item)">

          <template #cell-date="{ item }">
            {{ formatDateFR(item.date) }}
          </template>

        </DataTable2>
      </div>

      <!-- Vue grille -->
      <div v-else-if="currentView === 'grid'" key="grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <CodirTaskGrid v-for="codir in store.codirs" :key="codir.id" :codir="codir" />
      </div>

      <!-- Vue liste -->
      <div v-else key="list" class="flex flex-col gap-4">
        <CodirTaskCard v-for="codir in store.codirs" :key="codir.id" :codir="codir" />
      </div>
    </Transition>

    <!-- Pagination -->
    <UPagination v-if="store.codirs.length > 0 && currentView !== 'table'" class="mt-6" v-model="currentPage" color="blue" :page-count="10"
      :total="store.codirs.length" />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>