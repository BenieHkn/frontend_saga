<script setup>
import {
  formatDateFR,
  extractTime,
  extractTimeInput,
  getStatutConfig,
} from '@/composables/codirs/useCodir'
import { useCodirsStore } from '@/stores/codirs'
import { useCodir } from '@/composables/codirs/useCodir'
import { getInitials } from '@/utils/formatters'

definePageMeta({ title: 'Informations générales – CODIR' })

const router = useRouter()
const store = useCodirsStore()
const toast = useNuxtApp().$toast ?? useToast()
const { savePresences, getPresences, loading: presenceLoading } = useCodir()

// ── Chargement du CODIR depuis localStorage ───────────────────────────────────
const codir = ref(null)
const codirId = ref(null)
const membres = ref([])

onMounted(() => {
  if(!process.client){
    return
  }
  const raw = localStorage.getItem('currentCodir')
  if (raw) {
    codir.value = JSON.parse(raw)
    codirId.value = codir.value?.id
    membres.value = JSON.parse(localStorage.getItem('membres'))
  }
})

// ── Step courant ──────────────────────────────────────────────────────────────
const steps = [
  { id: 1, label: 'Ordres du jour' },
  { id: 2, label: 'Informations générales' },
  { id: 3, label: 'PV du codir' },
]
const currentStep = 2

const STEP_KEY = computed(()=>"codir_step_" + codirId.value)

const goPrev = () => {
    if(process.client)
    {
        localStorage.setItem(STEP_KEY.value, String(currentStep - 1))
    }
     router.push(`/codir/${codirId.value}`)
}
const goNext = () => {
    if(process.client)
    {
        localStorage.setItem(STEP_KEY.value, String(currentStep + 1))
    }
    router.push(`/codir/preview`)
}

// ── Formulaire heure de fin ───────────────────────────────────────────────────
const heureFin = ref('')
const saving = ref(false)

watchEffect(() => {
  if (codir.value?.heure_fin) heureFin.value = extractTimeInput(codir.value.heure_fin)
})

const saveHeureFin = async () => {
  if (!codirId.value || !heureFin.value) return
  saving.value = true
  try {
    await store.updateCodir(codirId.value, { heure_fin: heureFin.value })
    // Mettre à jour le localStorage
    const updated = { ...codir.value, heure_fin: `${codir.value.date.substring(0, 10)}T${heureFin.value}:00.000000Z` }
    codir.value = updated
    localStorage.setItem('currentCodir', JSON.stringify(updated))
    toast.add({ title: 'Heure de fin enregistrée', color: 'green', icon: 'i-heroicons-check-circle' })
  } catch {
    toast.add({ title: 'Erreur', description: "Impossible d'enregistrer l'heure de fin", color: 'red', icon: 'i-heroicons-exclamation-circle' })
  } finally {
    saving.value = false
  }
}

// ── Collecte des membres uniques du CODIR ─────────────────────────────────────
/**
 * Parcourt récursivement l'objet CODIR et collecte tous les membres uniques.
 * Clé d'unicité : nom + prénom + rôle.
 * Retourne une liste triée : Président → Secrétaire → Rapporteur → Suppléant → Membre
 */
const ROLE_ORDER = ['Président', 'Secrétaire', 'Rapporteur', 'Suppléant', 'Membre']

// const collectMembres = (obj, seen = new Set(), result = []) => {
//   if (!obj || typeof obj !== 'object') return result
//   for (const m of (obj.membres ?? [])) {
//     const u = m.entite_user?.user
//     if (!u) continue
//     const key = `${u.nom}|${u.prenom}|${m.role}`
//     if (!seen.has(key)) {
//       seen.add(key)
//       result.push({
//         key,
//         id: m.id, // Ajout de l'ID du membre pour la validation Laravel
//         nom: u.nom,
//         prenom: u.prenom,
//         role: m.role,
//         name: `${u.prenom} ${u.nom}`,
//         initials: `${(u.prenom?.[0] ?? '').toUpperCase()}${(u.nom?.[0] ?? '').toUpperCase()}`,
//       })
//     }
//   }
//   for (const val of Object.values(obj)) {
//     if (Array.isArray(val)) for (const item of val) collectMembres(item, seen, result)
//   }
//   return result
// }

// const membres = computed(() => {
//   if (!codir.value) return []
//   const list = collectMembres(codir.value)
//   return [...list].sort((a, b) => {
//     const ia = ROLE_ORDER.indexOf(a.role)
//     const ib = ROLE_ORDER.indexOf(b.role)
//     return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib)
//   })
// })

// ── État de présence (local, non persisté en DB pour l'instant) ───────────────
// Stocké dans localStorage pour survivre à une navigation
const PRESENCE_KEY = computed(() => `presence-${codirId.value}`)

const presenceState = ref({}) // { key: { status, reason } }

onMounted(() => {
  const raw = localStorage.getItem(PRESENCE_KEY.value)
  if (raw) presenceState.value = JSON.parse(raw)
})

const savePresence = () => {
  if(process.client)
  localStorage.setItem(PRESENCE_KEY.value, JSON.stringify(presenceState.value))
}

const onPresenceChange = ({ key, status, reason }) => {
  presenceState.value[key] = { status, reason }
  savePresence()
}

// Statistiques de présence
const stats = computed(() => {
  const vals = Object.values(presenceState.value)
  const presents = membres.value.filter(m =>
    !presenceState.value[m.key] || presenceState.value[m.key].status === 'present'
  ).length
  const absents = membres.value.length - presents
  return { presents, absents, total: membres.value.length }
})

// ── Sauvegarde des présences en base de données ───────────────────────────────
const savePresencesToDb = async () => {
  if (!codirId.value || !membres.value.length) return
  
  try {
    // Transformer les données locales pour l'API
    const presences = membres.value.map(membre => {
      console.log("L'id du membre ", membre.id)
      const presence = presenceState.value[membre.key] || { status: 'present', reason: '' }
      return {
        membre_id: membre.id, // Note: il faudra s'assurer que l'ID membre est disponible
        is_present: presence.status === 'present',
        motivation_absence: presence.status === 'absent' ? presence.reason : null,
// Par défaut, à implémenter selon les besoins
      }
    })

    await savePresences(codirId.value, presences)
    
    toast.add({ 
      title: 'Présences enregistrées', 
      description: `${presences.length} présences ont été sauvegardées avec succès`,
      color: 'green', 
      icon: 'i-heroicons-check-circle' 
    })
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des présences:', error)
    toast.add({ 
      title: 'Erreur', 
      description: "Impossible d'enregistrer les présences",
      color: 'red', 
      icon: 'i-heroicons-exclamation-circle' 
    })
  }
}
</script>

<template>
  <div class="mx-auto py-10 px-6 max-w-4xl">

    <!-- Retour -->
    <div class="mb-6 flex items-center gap-3">
      <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" @click="goPrev" />
      <span class="text-gray-400 text-sm">Retour aux ordres du jour</span>
    </div>

    <!-- Step Indicator -->
    <div class="mb-8">
      <StepIndicator :currentStep="currentStep" :steps="steps" />
    </div>

    <div v-if="!codir" class="flex justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-blue-500" />
    </div>

    <template v-else>

      <!-- ── Résumé du CODIR ────────────────────────────────────────────────── -->
      <UCard class="rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
        <div class="flex items-center justify-between flex-wrap gap-3 p-1">
          <div>
            <h1 class="text-xl font-bold mb-0.5">{{ formatDateFR(codir.date) }}</h1>
            <p class="text-gray-400 text-sm flex items-center gap-1.5">
              <UIcon name="i-heroicons-clock" class="w-3.5 h-3.5" />
              Début : {{ extractTime(codir.heure_debut) }}
              <span class="mx-1 text-gray-300">·</span>
              Fin :
              <span :class="codir.heure_fin ? 'text-gray-700 dark:text-gray-200 font-medium' : 'text-amber-500 italic'">
                {{ codir.heure_fin ? extractTime(codir.heure_fin) : 'non renseignée' }}
              </span>
            </p>
          </div>
          <span :class="`text-xs font-semibold px-3 py-1 rounded-full ${getStatutConfig(codir.statut).badgeClass}`">
            {{ getStatutConfig(codir.statut).label }}
          </span>
        </div>
      </UCard>

      <!-- ── Heure de fin ───────────────────────────────────────────────────── -->
      <UCard class="rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mb-8">
        <template #header>
          <div class="flex items-center gap-2 px-1">
            <UIcon name="i-heroicons-clock" class="text-blue-500 w-4 h-4" />
            <h2 class="text-base font-semibold">Heure de clôture</h2>
          </div>
        </template>

        <div class="flex items-end gap-4 p-1">
          <UFormGroup label="Heure de fin de séance" class="flex-1">
            <UInput
              v-model="heureFin"
              type="time"
              size="md"
              icon="i-heroicons-clock"
              :placeholder="extractTime(codir.heure_debut) || '10:00'"
            />
          </UFormGroup>
          <UButton
            color="blue"
            size="md"
            icon="i-heroicons-check"
            :loading="saving"
            :disabled="!heureFin"
            @click="saveHeureFin"
          >
            Enregistrer
          </UButton>
        </div>
      </UCard>

      <!-- ── Liste de présence ─────────────────────────────────────────────── -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-users" class="text-violet-500 w-4 h-4" />
            <h2 class="text-base font-semibold">Liste de présence</h2>
            <UBadge color="violet" variant="soft" size="xs">{{ membres.length }} membres</UBadge>
          </div>

          <div class="flex items-center gap-3">
            <!-- Stats rapides -->
            <div class="flex items-center gap-3 text-xs text-gray-500">
              <span class="flex items-center gap-1">
                <span class="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
                {{ stats.presents }} présent{{ stats.presents > 1 ? 's' : '' }}
              </span>
              <span class="flex items-center gap-1">
                <span class="w-2 h-2 rounded-full bg-red-400 inline-block"></span>
                {{ stats.absents }} absent{{ stats.absents > 1 ? 's' : '' }}
              </span>
            </div>

            <!-- Bouton de sauvegarde -->
            <UButton
              v-if="membres.length"
              color="violet"
              variant="soft"
              size="xs"
              icon="i-heroicons-cloud-arrow-up"
              :loading="presenceLoading"
              @click="savePresencesToDb"
            >
              Sauvegarder
            </UButton>
          </div>
        </div>

        <!-- Pas de membres -->
        <div
          v-if="!membres.length"
          class="text-center py-10 text-gray-400 text-sm bg-gray-50 dark:bg-slate-800/50 rounded-2xl"
        >
          <UIcon name="i-heroicons-user-group" class="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p>Aucun membre associé à ce CODIR.</p>
          <p class="text-xs mt-1 opacity-70">Les membres sont associés via les tâches et activités.</p>
        </div>

        <!-- Grille des cartes de présence -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <CodirListePresence
            v-for="membre in membres"
            :key="membre.id"
            :name="membre.name"
            :role="membre.role"
            :initials="getInitials(membre.entite_user.user.nom + ' ' + membre.entite_user.user.prenom)"
            :initial-status="presenceState[membre.key]?.status ?? 'present'"
            :initial-reason="presenceState[membre.key]?.reason ?? ''"
            @change="onPresenceChange({ key: membre.key, ...$event })"
          />
        </div>
      </div>

      <!-- ── Navigation stepper ─────────────────────────────────────────────── -->
      <div class="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
        <UButton
          icon="i-heroicons-arrow-left"
          color="gray"
          variant="ghost"
          @click="goPrev"
        >
          Précédent
        </UButton>

        <span class="text-sm text-gray-400">Étape {{ currentStep }} sur {{ steps.length }}</span>

        <UButton
          trailing-icon="i-heroicons-arrow-right"
          color="blue"
          @click="goNext"
        >
          Suivant
        </UButton>
      </div>
    </template>
  </div>
</template>