<script setup>
import { useCodirsStore } from '@/stores/codirs'
import { formatDateFR, extractTime, getStatutConfig, useCodir } from '@/composables/codirs/useCodir'

definePageMeta({ title: 'Listing CODIR' })

const store = useCodirsStore()
const router = useRouter()
const { downloadPdf } = useCodir()
const config = useRuntimeConfig()

const currentView = ref('table')
const currentPage = ref(1)
const PAGE_SIZE = 9


// ── Colonnes pour la DataTable ────────────────────────────────────────────

const columns = [
  { key: 'date', label: 'Date', sortable: true, filterable: true, showLabel: false, inputHidden: false },
  { key: 'horaire', label: 'Horaires', sortable: true, filterable: true, showLabel: false, inputHidden: false },
  { key: 'statut', label: 'Statut', sortable: true, filterable: true, showLabel: false, inputHidden: false },
]

// ── Tri décroissant par date ──────────────────────────────────────────────

const sortedCodirs = computed(() =>
  [...store.codirs].sort((a, b) => new Date(b.date) - new Date(a.date))
)

// ── Données normalisées pour la DataTable ─────────────────────────────────

const tableData = computed(() =>
  sortedCodirs.value.map(codir => ({
    id: codir.id,
    date: formatDateFR(codir.date),
    _dateRaw: codir.date,
    horaire: `${extractTime(codir.heure_debut)} – ${extractTime(codir.heure_fin)}`,
    statut: codir.statut,
    odj: codir.ordres_du_jour?.length ?? 0,
    taches: codir.taches?.length ?? 0,
    _raw: codir,
  }))
)

const paginatedCodirs = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return sortedCodirs.value.slice(start, start + PAGE_SIZE)
})

onMounted(() => store.getCodirs())

// ── Handlers ──────────────────────────────────────────────────────────────

const handleView = (item) => {
  store.setCurrentCodir(item._raw)

  if (process.client) {
    const STEP_KEY = `codir_step_${item.id}`
    // On lit le step AVANT d'écraser avec 1
    const savedStep = localStorage.getItem(STEP_KEY)
    const step = savedStep ? parseInt(savedStep) : 1

    // On ne réinitialise pas à 1 si un step existant est sauvegardé
    localStorage.setItem('currentCodir', JSON.stringify(item))

    if (step === 2) {
      return navigateTo('/codir/infos')
    } else if (step === 3) {
      return navigateTo('/codir/preview')
    }
  }

  navigateTo(`/codir/${item.id}`)
}

const handleDownload = async (item) => {
  try {
    const blob = await downloadPdf(item.id)  // reçoit directement un Blob
    
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `codir_${item.id}.pdf`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (e) {
    console.error('Erreur téléchargement :', e)
  }
}

const handleCreate = () => router.push('/codir/create')
</script>

<template>
  <div class="max-w-6xl mx-auto py-10 px-6">

    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <PageHeader
        title="CODIR"
        description="Consultez et gérez l'historique des réunions de direction"
      />

      <!-- Sélecteur de vue -->
      <div class="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
        <UButton @click="currentView = 'list'" :variant="currentView === 'list' ? 'solid' : 'ghost'"
          color="white" icon="i-heroicons-queue-list" size="sm" class="rounded-lg" aria-label="Vue liste" />
        <UButton @click="currentView = 'grid'" :variant="currentView === 'grid' ? 'solid' : 'ghost'"
          color="white" icon="i-heroicons-squares-2x2" size="sm" class="rounded-lg" aria-label="Vue grille" />
        <UButton @click="currentView = 'table'" :variant="currentView === 'table' ? 'solid' : 'ghost'"
          color="white" icon="i-heroicons-table-cells" size="sm" class="rounded-lg" aria-label="Vue tableau" />
      </div>

      <UButton @click="handleCreate" variant="ghost" color="blue" icon="i-heroicons-plus" label="Nouveau CODIR" size="sm" class="rounded-lg" />
    </div>

    <!-- Loading -->
    <div v-if="store.loading" class="flex justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-blue-500" />
    </div>

    <!-- Erreur -->
    <UAlert v-else-if="store.error" color="red" icon="i-heroicons-exclamation-circle" :title="store.error" class="mb-6" />

    <!-- Vide -->
    <div v-else-if="store.codirs.length === 0" class="text-center py-20">
      <UIcon name="i-heroicons-folder-open" class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
      <h3 class="text-lg font-semibold mb-2">Aucun CODIR</h3>
      <p class="text-gray-500 mb-6">Commencez par créer votre premier CODIR</p>
      <UButton @click="handleCreate" color="blue" icon="i-heroicons-plus">Créer un CODIR</UButton>
    </div>

    <!-- Vues -->
    <Transition v-else name="fade" mode="out-in">

      <!-- Vue tableau -->
      <div v-if="currentView === 'table'" key="table">
        <DataTable
          :data="tableData"
          :columns="columns"
          :default-actions="['view']"
          :show-row-numbers="true"
          :default-items-per-page="10"
          :left-aligned-columns="['date', 'horaire', 'statut']"
          empty-state-title="Aucun CODIR"
          empty-state-text="Créez votre premier CODIR pour commencer."
          @view="handleView"
        >
          <template #cell-date="{ value }">
            <span class="font-medium text-sm text-gray-800">{{ value }}</span>
          </template>

          <template #cell-horaire="{ value }">
            <span class="font-mono text-xs text-gray-500">{{ value }}</span>
          </template>

          <template #cell-statut="{ value }">
            <span :class="`text-[11px] font-semibold px-2.5 py-1 rounded-full ${getStatutConfig(value).badgeClass}`">
              {{ getStatutConfig(value).label }}
            </span>
          </template>

          <!-- Correction : le slot actions reçoit { item }, pas { value } -->
          <template #actions="{ item }">
            <UButton v-if="item.statut === 'soumis'" @click="handleView(item)" color="blue" variant="ghost" icon="i-heroicons-eye" size="xs" class="rounded-lg" />
            <UButton v-else @click="handleDownload(item)" color="blue" variant="ghost" icon="i-heroicons-arrow-down-tray" size="xs" class="rounded-lg" />
          </template>
        </DataTable>
      </div>

      <!-- Vue grille -->
      <div v-else-if="currentView === 'grid'" key="grid"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <CodirGrid
          v-for="codir in paginatedCodirs"
          :key="codir.id"
          :codir="codir"
          @edit="store.setCurrentCodir(codir); router.push(`/codir/${codir.id}/edit`)"
          @view="store.setCurrentCodir(codir); router.push(`/codir/${codir.id}`)"
        />
      </div>

      <!-- Vue liste -->
      <div v-else key="list" class="flex flex-col gap-4">
        <CodirCard
          v-for="codir in paginatedCodirs"
          :key="codir.id"
          :codir="codir"
          @edit="store.setCurrentCodir(codir); router.push(`/codir/${codir.id}/edit`)"
          @view="store.setCurrentCodir(codir); router.push(`/codir/${codir.id}`)"
        />
      </div>

    </Transition>

    <!-- Pagination (grid + liste uniquement) -->
    <UPagination
      v-if="store.codirs.length > PAGE_SIZE && currentView !== 'table'"
      class="mt-6"
      v-model="currentPage"
      color="blue"
      :page-count="PAGE_SIZE"
      :total="store.codirs.length"
    />

  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>