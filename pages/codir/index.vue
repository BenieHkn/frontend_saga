<script setup>
import { formatDateFR, extractTime, getStatutConfig, useCodir } from '@/composables/codirs/useCodir'
import { useAuth } from '~/composables/auth/useAuth'

definePageMeta({ title: 'Listing CODIR' })

const router = useRouter()
const { loading, error, getCodirs, createCodir, downloadPdf } = useCodir()
const createModal = ref(false)
const createForm  = reactive({ heure_debut: '', heure_fin: '' })
const resetCreate = () => Object.assign(createForm, { heure_debut: '', heure_fin: '' })
const { peutVoirCodir, peutGererCodir } = useAuth()


// ── State ─────────────────────────────────────────────────────────────────────
const codirs = ref([])

const fetchCodirs = async () => {
  try {
    const data = await getCodirs()
    codirs.value = data
    if (process.client)
      localStorage.setItem('codirs', JSON.stringify(data))
  } catch {
    if (process.client) {
      const cached = localStorage.getItem('codirs')
      if (cached) codirs.value = JSON.parse(cached)
    }
  }
}

onMounted(async () => {
  if (process.client) {
    const cached = localStorage.getItem('codirs')
    if (cached) codirs.value = JSON.parse(cached)
  }
  await fetchCodirs()
})

// ── Vue & Pagination ──────────────────────────────────────────────────────────
const currentView = ref('grid')
const currentPage = ref(1)
const PAGE_SIZE   = 9

// ── Colonnes DataTable ────────────────────────────────────────────────────────
const columns = [
  { key: 'date',    label: 'Date',     sortable: true, filterable: true, showLabel: false, inputHidden: false },
  { key: 'horaire', label: 'Horaires', sortable: true, filterable: true, showLabel: false, inputHidden: false },
  { key: 'statut',  label: 'Statut',   sortable: true, filterable: true, showLabel: false, inputHidden: false },
]

// ── Tri décroissant par date ──────────────────────────────────────────────────
const sortedCodirs = computed(() =>
  [...codirs.value].sort((a, b) => new Date(b.date) - new Date(a.date))
)

// ── Données normalisées pour la DataTable ─────────────────────────────────────
const tableData = computed(() =>
  sortedCodirs.value.map(codir => ({
    id:       codir.id,
    date:     formatDateFR(codir.date),
    _dateRaw: codir.date,
    horaire:  `${extractTime(codir.heure_debut)} – ${extractTime(codir.heure_fin)}`,
    statut:   codir.statut,
    odj:      codir.ordres_du_jour?.length ?? 0,
    taches:   codir.taches?.length ?? 0,
    _raw:     codir,
  }))
)

const paginatedCodirs = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return sortedCodirs.value.slice(start, start + PAGE_SIZE)
})

// ── Handlers navigation ───────────────────────────────────────────────────────
const handleView = (item) => {
    if (process.client) {
    const STEP_KEY  = `codir_step_${item.id}`
    const savedStep = localStorage.getItem(STEP_KEY)
    const step      = savedStep ? parseInt(savedStep) : 1
    localStorage.setItem('currentCodir', JSON.stringify(item._raw ?? item))
    if (step === 2) return navigateTo('/codir/infos')
    if (step === 3) return navigateTo('/codir/preview')
  }
  navigateTo(`/codir/${item.id}`)
}

const handleDownload = async (item) => {
  try {
    const blob = await downloadPdf(item.id)
    const url  = window.URL.createObjectURL(blob) 
    const link = document.createElement('a')
    link.href  = url
    link.setAttribute('download', `codir_${item.id}.pdf`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (e) {
    const message = ref("Impossible de télécharger le document")
    toast.add({
      title: 'Erreur',
      description: message.value,
      color: 'error'
    })
    console.error('Erreur téléchargement :', e)
  }
} 

// ── Modale création ───────────────────────────────────────────────────────────


// Date du jour au format YYYY-MM-DD
const today = new Date().toISOString().split('T')[0]

const handleCreate = async () => {
  if (!createForm.heure_debut) {
    toast.add({
      title: 'Heure de début requise',
      color: 'orange',
      icon: 'i-heroicons-exclamation-triangle',
    })
    return
  }

  try {
    const payload = {
      date:        today,
      heure_debut: createForm.heure_debut,
      heure_fin:   null,  // nullable
      statut:      'soumis',
    }
    const created = await createCodir(payload)
    console.log('Payload envoyé :', payload)

    // Optimistic update
    codirs.value.unshift(created)
    localStorage.setItem('codirs', JSON.stringify(codirs.value))

    toast.add({
      title: 'CODIR créé',
      description: `CODIR du ${formatDateFR(today)} créé avec succès`,
      color: 'green',
      icon: 'i-heroicons-check-circle',
    })
    createModal.value = false
    resetCreate()

    // Naviguer directement vers le CODIR créé
    handleView({ id: created.id, _raw: created })

  } catch {
    toast.add({
      title: 'Erreur',
      description: 'Impossible de créer le CODIR',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
    })
  }
}
</script>

<template>
  <div class="mx-auto py-10 px-6">

    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <PageHeader
        title="CODIR"
        description="Consultez et gérez l'historique des réunions de direction"
      />

      <!-- Sélecteur de vue -->
      <div class="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
        <UButton @click="currentView = 'grid'" :variant="currentView === 'grid' ? 'solid' : 'ghost'"
          color="white" icon="i-heroicons-squares-2x2" size="sm" class="rounded-lg" aria-label="Vue grille" />
        <UButton @click="currentView = 'table'" :variant="currentView === 'table' ? 'solid' : 'ghost'"
          color="white" icon="i-heroicons-table-cells" size="sm" class="rounded-lg" aria-label="Vue tableau" />
      </div>

      <UButton v-if="peutGererCodir()" @click="createModal = true" variant="ghost" color="blue" icon="i-heroicons-plus" label="Nouveau CODIR" size="sm" class="rounded-lg" />
    </div>

    <!-- Loading -->
    <div v-if="loading && !codirs.length" class="flex justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-blue-500" />
    </div>

    <!-- Erreur -->
    <UAlert v-else-if="error && !codirs.length" color="red" icon="i-heroicons-exclamation-circle" :title="error" class="mb-6" />

    <!-- Vide -->
    <div v-else-if="!codirs.length" class="text-center py-20">
      <UIcon name="i-heroicons-folder-open" class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
      <h3 class="text-lg font-semibold mb-2">Aucun CODIR</h3>
      <p class="text-gray-500 mb-6">Commencez par créer votre premier CODIR</p>
      <UButton v-if="peutGererCodir()" @click="createModal = true" color="blue" icon="i-heroicons-plus">Créer un CODIR</UButton>
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

          <template #actions="{ item }">
            <UButton v-if="item.statut === 'soumis'" @click="handleView(item)" color="blue" variant="ghost" icon="i-heroicons-eye" size="xs" class="rounded-lg" />
            <UButton v-else @click="handleDownload(item)" color="blue" variant="ghost" icon="i-heroicons-arrow-down-tray" size="xs" class="rounded-lg" />
          </template>
        </DataTable>
      </div>

      <!-- Vue grille -->
      <div v-else key="grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <CodirGrid
          v-for="codir in paginatedCodirs"
          :key="codir.id"
          :codir="codir"
          @view="handleView({ ...codir, _raw: codir })"
          @download="handleDownload(codir)"
        />
      </div>

    </Transition>

    <!-- Pagination -->
    <UPagination
      v-if="codirs.length > PAGE_SIZE && currentView !== 'table'"
      class="mt-6"
      v-model="currentPage"
      color="blue"
      :page-count="PAGE_SIZE"
      :total="codirs.length"
    />

  </div>

  <!-- ── Modale création CODIR ──────────────────────────────────────────────── -->
  <UModal v-model="createModal">
    <UCard class="rounded-2xl">
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center">
            <UIcon name="i-heroicons-calendar-days" class="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 class="font-semibold">Nouveau CODIR</h3>
            <p class="text-xs text-gray-400">{{ formatDateFR(today) }}</p>
          </div>
        </div>
      </template>

      <div class="p-2 flex flex-col gap-4">

        <!-- Date auto — affichage uniquement -->
        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg px-4 py-3 flex items-center gap-3">
          <UIcon name="i-heroicons-calendar" class="w-4 h-4 text-gray-400" />
          <div>
            <p class="text-xs text-gray-400">Date</p>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ formatDateFR(today) }}</p>
          </div>
          <UBadge label="Aujourd'hui" color="blue" variant="soft" size="xs" class="ml-auto" />
        </div>

        <!-- Heure de début -->
        <UFormGroup label="Heure de début" required>
          <UInput
            v-model="createForm.heure_debut"
            type="time"
            size="md"
          />
        </UFormGroup>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" variant="ghost" @click="createModal = false; resetCreate()">Annuler</UButton>
          <CustomButton btnText="Créer et ouvrir" @click="handleCreate" :modal="false" icon="i-heroicons-folder-open" :loading="loading"/>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>