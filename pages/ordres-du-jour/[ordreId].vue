<script setup>
import { useOrdreDuJour } from '@/composables/ordres-du-jour/useOrdreDuJour'
import { formatDateFR } from '@/composables/codirs/useCodir'

definePageMeta({ title: "Détail ordre du jour" })

const route  = useRoute()
const router = useRouter()
const toast  = useToast()

const ordreDuJourApi = useOrdreDuJour()

const ordreId            = Number(route.params.ordreId)
const currentOrdreDuJour = ref(null)
const currentCodir       = ref(null)
const loading            = ref(true)

// ── Fetch ─────────────────────────────────────────────────────────────────────
const fetchOrdreDuJour = async () => {
  try {
    currentOrdreDuJour.value = localStorage.getItem("currentOrdreDuJour") ? JSON.parse(localStorage.getItem("currentOrdreDuJour")) : null
  } catch {
    console.warn("Impossible de rafraîchir l'ordre du jour, utilisation du cache")
  }
}

onMounted(async () => {
  currentCodir.value = JSON.parse(localStorage.getItem("currentCodir"))
  await fetchOrdreDuJour()
  loading.value = false
})

// ── Computed ──────────────────────────────────────────────────────────────────
const dossiers = computed(() => currentOrdreDuJour.value?.dossiers ?? [])

// ── Statut badge ──────────────────────────────────────────────────────────────
const statutClass = (statut) => {
  const map = {
    actif:   'text-green-600 bg-green-50 dark:bg-green-950/40',
    inactif: 'text-gray-500 bg-gray-100 dark:bg-gray-800/60',
    archivé: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40',
  }
  return map[statut] ?? 'text-gray-500 bg-gray-100'
}

// ── Ajout dossier ─────────────────────────────────────────────────────────────
const dossierModal = ref(false)
const dossierForm  = reactive({ libelle: '' })
const resetDossierForm = () => Object.assign(dossierForm, { libelle: '' })

const addDossier = async () => {
  if (!dossierForm.libelle.trim()) return
  try {
    await ordreDuJourApi.addDossier(ordreId, { libelle: dossierForm.libelle.trim() })
    await fetchOrdreDuJour()  // refresh pour voir le nouveau dossier
    toast.add({
      title: 'Dossier créé',
      description: `"${dossierForm.libelle}" a été ajouté à l'ordre du jour`,
      color: 'green',
      icon: 'i-heroicons-check-circle',
    })
    dossierModal.value = false
    resetDossierForm()
  } catch {
    toast.add({
      title: 'Erreur',
      description: 'Impossible de créer le dossier',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
    })
  }
}

// ── Suppression dossier ───────────────────────────────────────────────────────
const handleRemoveDossier = async (dossierId) => {
  try {
    await ordreDuJourApi.removeDossier(ordreId, dossierId)
    await fetchOrdreDuJour()  // refresh
    toast.add({
      title: 'Dossier retiré',
      color: 'green',
      icon: 'i-heroicons-check-circle',
    })
  } catch {
    toast.add({
      title: 'Erreur',
      description: 'Impossible de retirer le dossier',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
    })
  }
}

// ── Navigation vers dossier ───────────────────────────────────────────────────
const handleClick = (dossier) => {
  if (process.client)
    localStorage.setItem("currentDossier", JSON.stringify(dossier))
  navigateTo(`/dossiers/${dossier.id}`)
}
</script>

<template>
  <div class="mx-auto py-10 px-6">

    <!-- Retour -->
    <div class="mb-6 flex items-center gap-3">
      <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" @click="router.back()" />
      <span class="text-gray-400 text-sm">Retour</span>
    </div>

    <!-- Chargement -->
    <div v-if="loading" class="flex justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-blue-500" />
    </div>

    <!-- Introuvable -->
    <div v-else-if="!currentOrdreDuJour" class="text-center py-20">
      <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 mx-auto text-amber-400 mb-4" />
      <p class="text-gray-500 text-sm">Ordre du jour introuvable ou non chargé.</p>
      <UButton class="mt-4" color="gray" variant="ghost" @click="router.back()">Retour</UButton>
    </div>

    <template v-else>

      <!-- ── En-tête ─────────────────────────────────────────────────────── -->
      <UCard class="rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 mb-6">
        <div class="p-2">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-md">
              <UIcon name="i-heroicons-clipboard-document-list" class="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">
                {{ currentOrdreDuJour.libelle }}
              </h1>
              <span :class="`text-xs font-semibold px-2.5 py-1 rounded-full capitalize mt-1 inline-block ${statutClass(currentOrdreDuJour.statut)}`">
                {{ currentOrdreDuJour.statut }}
              </span>
            </div>
          </div>

          <div class="flex items-center gap-6 mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <UIcon name="i-heroicons-folder" class="w-4 h-4 text-violet-500" />
              <span>
                <strong class="text-gray-800 dark:text-white">{{ dossiers.length }}</strong> dossier(s)
              </span>
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <UIcon name="i-heroicons-building-office" class="w-4 h-4 text-blue-500" />
              <span class="text-xs text-gray-400">
                CODIR du {{ formatDateFR(currentCodir?.date) }}
              </span>
            </div>
          </div>
        </div>
      </UCard>

      <!-- ── Liste des dossiers ──────────────────────────────────────────── -->
      <section>
        <h2 class="text-base font-semibold flex items-center gap-2 mb-3">
          <UIcon name="i-heroicons-folder-open" class="text-violet-500" />
          Dossiers rattachés
          <UBadge color="violet" variant="soft" size="xs">{{ dossiers.length }}</UBadge>
          <UButton icon="i-heroicons-plus" color="blue" variant="soft" @click="dossierModal = true">
            Ajouter
          </UButton>
        </h2>

        <div v-if="!dossiers.length"
          class="text-center py-8 text-gray-400 text-sm bg-gray-50 dark:bg-slate-800/50 rounded-xl">
          Aucun dossier rattaché à cet ordre du jour
        </div>

        <div v-else class="flex flex-col gap-2">
          <DossierCard
            v-for="dossier in dossiers"
            :key="dossier.id"
            :dossier="dossier"
            @click="handleClick(dossier)"
            @deleted="handleRemoveDossier(dossier.id)"
          />
        </div>
      </section>

    </template>

    <UAlert v-if="ordreDuJourApi.error.value" color="red" icon="i-heroicons-exclamation-circle" :title="ordreDuJourApi.error.value" class="mt-4" />

  </div>

  <!-- ── Modale ajout dossier ───────────────────────────────────────────────── -->
  <UModal v-model="dossierModal">
    <UCard class="rounded-2xl">
      <template #header>
        <h3 class="font-semibold">Ajouter un dossier</h3>
      </template>
      <div class="p-2 flex flex-col gap-4">
        <UFormGroup label="Libellé">
          <UInput v-model="dossierForm.libelle" placeholder="Ex: Budget annuel" size="md" />
        </UFormGroup>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" variant="ghost" @click="dossierModal = false">Annuler</UButton>
          <UButton color="blue" :loading="ordreDuJourApi.loading.value" @click="addDossier">Ajouter</UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>