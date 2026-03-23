<script setup>
import {
  formatDateFR,
  extractTime,
  extractDateInput,
  extractTimeInput,
  getStatutConfig,
  STATUT_OPTIONS,
  useCodir,
} from '@/composables/codirs/useCodir'

import {useMembre} from '@/composables/membres/useMembres'
import { useOrdreDuJour } from '~/composables/ordres-du-jour/useOrdreDuJour'

definePageMeta({ title: 'Détail CODIR' })

const route  = useRoute()
const router = useRouter()
const id     = Number(route.params.id)
const toast  = useNuxtApp().$toast ?? useToast()

const {
  loading,
  error,
  getCodir,
  updateCodir,
  detachODJ,
} = useCodir()

const ordreDuJourApi = useOrdreDuJour()

const membreApi = useMembre()

// ── Data ──────────────────────────────────────────────────────────────────────
const codir = ref(null)
const membres = ref([])

const fetchCodir = async () => {
  const data = await getCodir(id)
  codir.value = data
  if(process.client)
    localStorage.setItem('currentCodir', JSON.stringify(data))
}

// Sync localStorage automatique
watch(codir, (c) => {
  if (c && process.client)
    localStorage.setItem('currentCodir', JSON.stringify(c))
})

// ── Steps ─────────────────────────────────────────────────────────────────────
const currentStep = ref(1)

const STEP_KEY = `codir_step_${id}`

const getMembres = async () => {
  try {
    const data = await membreApi.getMembres();
    membres.value = data;
    console.log(membres.value)
    if (process.client) localStorage.setItem("membres", JSON.stringify(data));
  } catch {
    // Fallback cache
    if (process.client) {
      const cached = localStorage.getItem("membres");
      if (cached) membres.value = JSON.parse(cached);
    }
  }
};

// ── Progression ───────────────────────────────────────────────────────────────
const progressionGlobale = computed(() => {
  const taches = codir.value?.taches ?? []
  if (!taches.length) return 0
  return Math.round(
    taches.reduce((a, t) => a + (t.pivot?.progression ?? 0), 0) / taches.length
  )
})

// ── Edition ───────────────────────────────────────────────────────────────────
const editing  = ref(false)
const editForm = reactive({ date: '', heure_debut: '', heure_fin: '', statut: '' })

watch(codir, (c) => {
  if (!c) return
  editForm.date        = extractDateInput(c.date)
  editForm.heure_debut = extractTimeInput(c.heure_debut)
  editForm.heure_fin   = extractTimeInput(c.heure_fin)
  editForm.statut      = c.statut
}, { immediate: true })

const saveCodir = async () => {
  const updated = await updateCodir(id, editForm)
  codir.value   = updated
  toast.add({
    title: 'CODIR mis à jour',
    description: 'Les informations ont été mises à jour avec succès.',
    color: 'green',
    icon: 'i-heroicons-check-circle',
  })
  editing.value = false
}

// ── Ordres du jour ────────────────────────────────────────────────────────────
const ordreModal = ref(false)
const ordreForm  = reactive({ libelle: '', statut: 'actif', codir_id: id })
const resetOrdreForm = () => Object.assign(ordreForm, { libelle: '', statut: 'actif' })


const addOrdre = async () => {
  if (!ordreForm.libelle) return
  try {
    await ordreDuJourApi.createOrdre(ordreForm)
    await fetchCodir()
    toast.add({
      title: 'Ordre du jour créé',
      description: `"${ordreForm.libelle}" a été ajouté`,
      color: 'green',
      icon: 'i-heroicons-check-circle',
    })
    ordreModal.value = false
    resetOrdreForm()
    fetchCodir()  // refresh pour voir le nouvel ordre du jour
  } catch {
    toast.add({
      title: 'Erreur',
      description: "Impossible de créer l'ordre du jour",
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
    })
  }
}

const handleDetachOrdre = async (ordreId) => {
  try {
    await detachODJ(id, ordreId)
    await fetchCodir()
    toast.add({ title: 'Ordre du jour retiré', color: 'green', icon: 'i-heroicons-check-circle' })
  } catch {
    toast.add({
      title: 'Erreur',
      description: "Impossible de retirer l'ordre du jour",
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
    })
  }
}

// ── Init ──────────────────────────────────────────────────────────────────────
onMounted(async () => {
  codir.value = localStorage.getItem('currentCodir') ? JSON.parse(localStorage.getItem('currentCodir')) : null
  membres.value = localStorage.getItem("membres") ? JSON.parse(localStorage.getItem("membres")) : []
  if (process.client) {
    if(membres.value.length === 0) await getMembres()
    const saved = localStorage.getItem(STEP_KEY)
    if (saved) currentStep.value = Number(saved)
  }
})
</script>

<template>
  <div class="mx-auto py-10 px-6">

    <!-- Retour -->
    <div class="mb-6 flex items-center gap-3">
      <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" @click="router.push('/codir')" />
      <span class="text-gray-400 text-sm">Retour au listing</span>
    </div>

    <div v-if="loading && !codir" class="flex justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-blue-500" />
    </div>

    <template v-else-if="codir">
      <CodirStepper :codirId="id">

      <!-- ── En-tête ─────────────────────────────────────────────────── -->
      <UCard class="rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 mb-6">
        <div class="p-2">
          <div class="flex items-start justify-between gap-4 mb-3">
            <div>
              <div class="flex items-center gap-3 flex-wrap mb-1">
                <h1 class="text-2xl font-bold">{{ formatDateFR(codir.date) }}</h1>
                <span :class="`text-xs font-semibold px-3 py-1 rounded-full ${getStatutConfig(codir.statut).badgeClass}`">
                  {{ getStatutConfig(codir.statut).label }}
                </span>
              </div>
              <p class="text-gray-400 text-sm flex items-center gap-1.5">
                <UIcon name="i-heroicons-clock" />
                {{ extractTime(codir.heure_debut) }} – {{ extractTime(codir.heure_fin) }}
              </p>
            </div>
            <UButton v-if="!editing" icon="i-heroicons-pencil-square" color="blue" variant="ghost" size="sm"
              @click="editing = true">
              Modifier
            </UButton>
          </div>

          <div class="flex items-center gap-3 mt-4">
            <UProgress :value="progressionGlobale" color="green" size="sm" class="flex-1" />
            <span class="text-xs font-mono text-gray-400 w-16 text-right">{{ progressionGlobale }}% moy.</span>
          </div>

          <Transition name="slide">
            <div v-if="editing" class="border-t dark:border-gray-700 mt-5 pt-5">
              <div class="grid grid-cols-2 gap-4 mb-4">
                <UFormGroup label="Date">
                  <UInput v-model="editForm.date" type="date" size="sm" />
                </UFormGroup>
                <UFormGroup label="Statut">
                  <USelect v-model="editForm.statut" :options="STATUT_OPTIONS" size="sm" />
                </UFormGroup>
                <UFormGroup label="Heure de début">
                  <UInput v-model="editForm.heure_debut" type="time" size="sm" />
                </UFormGroup>
                <UFormGroup label="Heure de fin">
                  <UInput v-model="editForm.heure_fin" type="time" size="sm" />
                </UFormGroup>
              </div>
              <div class="flex justify-end gap-2">
                <UButton color="gray" variant="ghost" size="sm" @click="editing = false">Annuler</UButton>
                <UButton color="blue" size="sm" :loading="loading" @click="saveCodir">Enregistrer</UButton>
              </div>
            </div>
          </Transition>
        </div>
      </UCard>

      
        <!-- ── Contenu step 1 ──────────────────────────────────────────── -->
      <div class="flex flex-col gap-8">
        <CodirOrdreDuJour
          :ordres="codir.ordres_du_jour ?? []"
          :loading="loading"
          @attach="ordreModal = true"
          @detach="handleDetachOrdre($event)"
        />
      </div>
      </CodirStepper>

    </template>

    <UAlert v-if="error" color="red" icon="i-heroicons-exclamation-circle" :title="error" class="mt-4" />

    <!-- ── Modale ordre du jour ─────────────────────────────────────── -->
    <UModal v-model="ordreModal">
      <UCard class="rounded-2xl">
        <template #header>
          <h3 class="font-semibold">Créer un ordre du jour</h3>
        </template>
        <div class="p-2 flex flex-col gap-4">
          <UFormGroup label="Libellé">
            <UInput v-model="ordreForm.libelle" placeholder="Ex: Bilan trimestriel" size="md" />
          </UFormGroup>
          <UFormGroup label="Statut">
            <USelect v-model="ordreForm.statut" :options="[
              { label: 'Actif', value: 'actif' },
              { label: 'Inactif', value: 'inactif' },
              { label: 'Archivé', value: 'archivé' },
            ]" size="md" />
          </UFormGroup>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" @click="ordreModal = false">Annuler</UButton>
            <UButton color="blue" :loading="loading" @click="addOrdre">Créer</UButton>
          </div>
        </template>
      </UCard>
    </UModal>

  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>