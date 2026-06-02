<script setup>
import { useActivite } from '@/composables/activite/useActivite'
import { useMembre } from '@/composables/membres/useMembres'
import { formatDateFR } from '@/composables/codirs/useCodir'
import { useAuth } from '@/composables/auth/useAuth'

definePageMeta({ title: 'Détail activité' })

const router      = useRouter()
const route       = useRoute()
const toast       = useToast()
const activiteApi = useActivite()
const membreApi   = useMembre()

const activiteId = Number(route.params.activiteId)

// ── State ─────────────────────────────────────────────────────────────────────
const activite           = ref(null)
const currentDossier     = ref(null)
const currentOrdreDuJour = ref(null)
const currentCodir       = ref(null)
const loading            = ref(true)

//on appelle la permission qui permet de voir les boutons d'éditions et de suppressions
const { peutGererCodir } = useAuth();

onMounted(async () => {
  currentDossier.value     = JSON.parse(localStorage.getItem('currentDossier'))
  currentOrdreDuJour.value = JSON.parse(localStorage.getItem('currentOrdreDuJour'))
  currentCodir.value       = JSON.parse(localStorage.getItem('currentCodir'))

  await refreshActivite()
})

const taches = computed(() => activite.value?.taches ?? [])

// ── Refresh ───────────────────────────────────────────────────────────────────
const refreshActivite = async () => {
  loading.value = true
  try {
    // ✅ Toujours appeler l'API — données fraîches avec pivot codirs
    activite.value = await activiteApi.getActivite(activiteId)
    if (process.client) {
      localStorage.setItem('currentActivite', JSON.stringify(activite.value))
    }
  } catch {
    // Fallback localStorage si l'API échoue
    activite.value = JSON.parse(localStorage.getItem('currentActivite'))
  } finally {
    loading.value = false
  }
}

// ── Modale tâche ──────────────────────────────────────────────────────────────
const tacheModal = ref(false)
</script>

<template>
  <div class="mx-auto py-10 px-6">

    <!-- Retour -->
    <div class="mb-6 flex items-center gap-3">
      <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" @click="router.back()" />
      <span class="text-gray-400 text-sm">Retour au dossier</span>
    </div>

    <!-- Loader -->
    <div v-if="loading" class="flex justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-violet-500" />
    </div>

    <!-- Introuvable -->
    <div v-else-if="!activite && loading" class="text-center py-20">
      <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 mx-auto text-amber-400 mb-4" />
      <p class="text-gray-500 text-sm">Activité introuvable.</p>
      <UButton class="mt-4" color="gray" variant="ghost" @click="router.back()">Retour</UButton>
    </div>

    <template v-else>

      <!-- ── En-tête ────────────────────────────────────────────────────── -->
      <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 mb-6">
        <div class="p-6 border-b border-gray-100 dark:border-gray-800">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-950/40 flex items-center justify-center shrink-0">
              <UIcon name="i-heroicons-bolt" class="w-6 h-6 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">{{ activite.libelle }}</h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">Activité #{{ activite.id }}</p>
            </div>
          </div>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Dossier</p>
              <p class="font-medium text-gray-900 dark:text-white text-sm">
                {{ currentDossier?.libelle ?? 'Non spécifié' }}
              </p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Ordre du jour</p>
              <p class="font-medium text-gray-900 dark:text-white text-sm">
                {{ currentOrdreDuJour?.libelle ?? 'Non spécifié' }}
              </p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">CODIR</p>
              <p class="font-medium text-gray-900 dark:text-white text-sm">
                {{ currentCodir?.date ? formatDateFR(currentCodir.date) : 'Non spécifié' }}
              </p>
            </div>
          </div>

          <div v-if="activite.action?.libelle" class="mt-4 bg-violet-50 dark:bg-violet-950/20 rounded-lg p-4 flex items-center gap-3">
            <UIcon name="i-heroicons-link" class="w-4 h-4 text-violet-500 shrink-0" />
            <div>
              <p class="text-xs text-violet-500 dark:text-violet-400">Action associée</p>
              <p class="font-medium text-violet-900 dark:text-violet-200 text-sm">{{ activite.action.libelle }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Tâches ─────────────────────────────────────────────────────── -->
      <section>
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-base font-semibold flex items-center gap-2">
            <UIcon name="i-heroicons-check-circle" class="text-blue-500" />
            Tâches
            <UBadge color="blue" variant="soft" size="xs">{{ taches.length }}</UBadge>
          </h2>
          <UButton v-if="peutGererCodir()" icon="i-heroicons-plus" color="blue" variant="soft" size="sm" @click="tacheModal = true">
            Ajouter une tâche
          </UButton>
        </div>

        <div v-if="!taches.length"
          class="text-center py-8 text-gray-400 text-sm bg-gray-50 dark:bg-slate-800/50 rounded-xl">
          Aucune tâche rattachée à cette activité
        </div>

        <div v-else class="flex flex-col gap-3">
          <div v-for="(tache, index) in taches" :key="tache.id" class="flex items-start gap-3">
            <div class="shrink-0 mt-3 w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
              <span class="text-xs font-bold text-blue-600 dark:text-blue-300">{{ index + 1 }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <TacheCard
                :tache="tache"
                :codir-id="currentCodir?.id"
                @updated="refreshActivite"
              />
            </div>
          </div>
        </div>
      </section>

    </template>
  </div>

  <!-- ── Modale création tâche — composant autonome ────────────────────────── -->
  <TacheFormModal
    v-model="tacheModal"
    :activite-id="activite?.id"
    :action-id="activite?.action?.id ?? null"
    @created="refreshActivite"
  />
</template>