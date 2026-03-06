<script setup>
import { useMembre } from '@/composables/membres/useMembres'

definePageMeta({ title: 'Détail membre' })

const route     = useRoute()
const router    = useRouter()
const toast     = useToast()
const membreApi = useMembre()

const id     = Number(route.params.id)
const membre = ref(null)
const taches = ref([])
const { loading, error } = membreApi

// ── Fetch ─────────────────────────────────────────────────────────────────────
const fetchMembre = async () => {
  const cached = JSON.parse(localStorage.getItem('currentMembre') ?? 'null')
  if (cached?.id === id) membre.value = cached  // affichage immédiat

  try {
    const fresh = await membreApi.getMembre(id)
    membre.value = fresh
    localStorage.setItem('currentMembre', JSON.stringify(fresh))
  } catch {
    console.warn('Fallback sur le cache membre')
  }
}

const fetchTaches = async () => {
  try {
    taches.value = await membreApi.getTaches(id)
  } catch {
    console.warn('Impossible de charger les tâches')
  }
}

onMounted(async () => {
  await Promise.all([fetchMembre(), fetchTaches()])
})

// ── Helpers ───────────────────────────────────────────────────────────────────
const nomComplet = computed(() => {
  const u = membre.value?.entite_user?.user
  return u ? `${u.nom} ${u.prenom}` : `Membre #${id}`
})
</script>

<template>
  <div class="max-w-4xl mx-auto py-10 px-6">

    <!-- Retour -->
    <div class="mb-6 flex items-center gap-3">
      <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" @click="router.push('/membres')" />
      <span class="text-gray-400 text-sm">Retour aux membres</span>
    </div>

    <!-- Loading -->
    <div v-if="loading && !membre" class="flex justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-blue-500" />
    </div>

    <!-- Introuvable -->
    <div v-else-if="!membre" class="text-center py-20">
      <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 mx-auto text-amber-400 mb-4" />
      <p class="text-gray-500 text-sm">Membre introuvable.</p>
      <UButton class="mt-4" color="gray" variant="ghost" @click="router.push('/membres')">Retour</UButton>
    </div>

    <template v-else>

      <!-- ── Fiche membre ────────────────────────────────────────────────── -->
      <UCard class="rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 mb-6">
        <div class="p-4">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shrink-0 shadow-md">
              <UIcon name="i-heroicons-user" class="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">{{ nomComplet }}</h1>
              <p class="text-sm text-gray-500">{{ membre.role }}</p>
            </div>
            <span :class="`ml-auto text-xs font-semibold px-3 py-1 rounded-full ${
              membre.statut
                ? 'text-green-600 bg-green-50 dark:bg-green-950/40'
                : 'text-gray-500 bg-gray-100 dark:bg-gray-800/60'
            }`">
              {{ membre.statut ? 'Actif' : 'Inactif' }}
            </span>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 text-center">
              <p class="text-2xl font-bold text-indigo-600">{{ taches.length }}</p>
              <p class="text-xs text-gray-500 mt-1">Tâche(s) assignée(s)</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 text-center">
              <p class="text-2xl font-bold text-blue-600">{{ membre.codirs?.length ?? 0 }}</p>
              <p class="text-xs text-gray-500 mt-1">CODIR(s) participé(s)</p>
            </div>
          </div>
        </div>
      </UCard>

      <!-- ── Tâches ──────────────────────────────────────────────────────── -->
      <UCard class="rounded-2xl border border-gray-100 dark:border-gray-800">
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-clipboard-document-check" class="text-indigo-500" />
            <h2 class="font-semibold">Tâches assignées</h2>
            <UBadge :label="String(taches.length)" color="indigo" variant="soft" size="xs" />
          </div>
        </template>

        <div v-if="!taches.length" class="text-center py-8 text-gray-400 text-sm">
          Aucune tâche assignée à ce membre
        </div>

        <div v-else class="flex flex-col gap-2 p-2">
          <TacheCard
            v-for="tache in taches"
            :key="tache.id"
            :tache="tache"
            @updated="fetchTaches"
          />
        </div>
      </UCard>

    </template>

    <UAlert v-if="error" color="red" icon="i-heroicons-exclamation-circle" :title="error" class="mt-4" />

  </div>
</template>