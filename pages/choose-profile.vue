<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-dark-900 font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">

    <!-- Toggle dark mode -->
    <div class="fixed top-6 right-6 z-50">
      <UButton
        :icon="isDark ? 'i-heroicons-moon' : 'i-heroicons-sun'"
        color="white"
        variant="solid"
        class="rounded-full shadow-sm glass-panel"
        @click="isDark = !isDark"
      />
    </div>

    <div class="max-w-4xl w-full mx-auto space-y-8 animate-fade-in">

      <!-- Header -->
      <div class="text-center space-y-2">
        <h1 class="text-2xl md:text-3xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white">
          Choisissez votre poste de travail
        </h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm font-medium">
          Bonjour M. /Mme <span class="font-semibold text-slate-700 dark:text-slate-200">{{ fullName }}</span>,
          sélectionnez le poste que vous souhaitez occuper pour cette session.
        </p>
      </div>

      <!-- Postes grid -->
      <div
        class="grid grid-cols-1 gap-4 items-stretch"
        :class="{
          'max-w-xs mx-auto': activePostes.length === 1,
          'sm:grid-cols-2': activePostes.length === 2,
          'sm:grid-cols-2 lg:grid-cols-3': activePostes.length >= 3,
        }"
      >
        <div
          v-for="entiteUser in activePostes"
          :key="entiteUser.entite_user_id"
          class="group relative cursor-pointer"
          @click="handleSelectPoste(entiteUser)"
        >
          <div
            class="glass-panel h-full p-6 rounded-2xl flex flex-col items-center text-center transition-all duration-300 border-2"
            :class="[
              confirming && selectedId === entiteUser.entite_user_id
                ? 'border-brand-400/50 ring-4 ring-brand-400/20 -translate-y-1'
                : 'border-transparent hover:-translate-y-1 hover:shadow-lg'
            ]"
          >
            <!-- Spinner si en cours de redirection -->
            <div
              class="absolute top-4 right-4 transition-all duration-300"
              :class="confirming && selectedId === entiteUser.entite_user_id ? 'opacity-100' : 'opacity-0'"
            >
              <UIcon
                name="i-heroicons-arrow-path"
                class="text-xl text-brand-400 animate-spin"
              />
              
            </div>

            <!-- Avatar avec initiales -->
            <div class="relative mb-4">
              <div class="w-16 h-16 rounded-full circle-badge flex items-center justify-center">
                <span class="text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-br from-emerald-500 to-sky-600">
                  {{ getInitials(entiteUser.libelle) }}
                </span>
              </div>

              <!-- Badge intérim ou responsable -->
              <div
                class="absolute -top-2 left-1/2 -translate-x-1/2 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md whitespace-nowrap"
                :class="entiteUser.is_interim ? 'bg-orange-500' : 'bg-emerald-500'"
              >
                {{ entiteUser.is_interim ? 'Intérim' : 'Responsable' }}
              </div>
            </div>

            <!-- Infos poste -->
            <div class="space-y-2 flex-grow">
              <div class="space-y-0.5">
                <p class="text-xs font-bold text-emerald-500 uppercase tracking-wide">
                  {{ entiteUser.fonction ?? '—' }}
                </p>
                <p class="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                  {{ entiteUser.code }}
                </p>
              </div>

              <!-- Entité parente -->
              <div
                v-if="entiteUser.parent_libelle && entiteUser.parent_libelle !== '-'"
                class="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-700/50 w-full"
              >
                <UIcon name="i-heroicons-building-office" class="text-sm shrink-0" />
                <span class="font-medium leading-tight">{{ entiteUser.parent_libelle }}</span>
              </div>
            </div>

            <!-- Date de début -->
            <div class="mt-4 flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs">
              <UIcon name="i-heroicons-calendar" class="text-sm" />
              <span>Depuis le {{ formatDate(entiteUser.date_debut) }}</span>
            </div>
          </div>
        </div>
      </div>

      <p class="text-center text-slate-400 dark:text-slate-500 text-xs font-medium">
        Vous pourrez changer de poste depuis votre espace personnel
      </p>
    </div>

    <!-- Footer système -->
    <div class="fixed bottom-6 left-1/2 -translate-x-1/2">
      <div class="glass-panel px-4 py-2 rounded-full flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
        <div class="flex items-center gap-1">
          <UIcon name="i-heroicons-chart-bar" class="text-sm" />
          <span>Système OK</span>
        </div>
        <div class="w-px h-3 bg-slate-200 dark:bg-slate-700" />
        <UIcon name="i-heroicons-globe-alt" class="text-sm" />
      </div>
    </div>

    <!-- Bouton déconnexion -->
    <div class="fixed bottom-6 left-6">
      <UButton
        variant="ghost"
        color="gray"
        icon="i-heroicons-arrow-left"
        class="text-slate-400 hover:text-primary transition-colors font-medium text-sm"
        @click="handleLogout"
      >
        Se déconnecter
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EntiteUser } from '~/composables/auth/useAuth'
import { useAuth } from '~/composables/auth/useAuth'

definePageMeta({ layout: false })
useSeoMeta({ title: 'Choix du poste' })

// ─── Dark mode ────────────────────────────────────────────────────────────
const colorMode = useColorMode()
const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: () => colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
})

// ─── Auth ─────────────────────────────────────────────────────────────────
const {
  getUser,
  getActiveEntiteUsers,
  setSelectedEntiteUser,
  logout
} = useAuth()

// ─── Data ─────────────────────────────────────────────────────────────────
const user = getUser()
const activePostes = computed<EntiteUser[]>(() => getActiveEntiteUsers())
const fullName = computed(() => user ? `${user.prenom} ${user.nom}` : '')

// ─── State ────────────────────────────────────────────────────────────────
const selectedId = ref<number | null>(null)
const confirming = ref(false)

// ─── Actions ──────────────────────────────────────────────────────────────
async function handleSelectPoste(entiteUser: EntiteUser) {
  if (confirming.value) return

  selectedId.value = entiteUser.entite_user_id
  confirming.value = true

  setSelectedEntiteUser(entiteUser)

  await new Promise(resolve => setTimeout(resolve, 400))
  await navigateTo('/')
}

async function handleLogout() {
  await logout()
}

// ─── Helpers ──────────────────────────────────────────────────────────────
function getInitials(libelle?: string): string {
  if (!libelle) return '?'
  return libelle
    .split(' ')
    .filter(w => w.length > 2)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('') || '?'
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return 'N/A'
  try {
    return new Date(iso).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return 'N/A'
  }
}
</script>

<style scoped>
.glass-panel {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.dark .glass-panel {
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.circle-badge {
  background: linear-gradient(135deg, rgba(119, 221, 170, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%);
  border: 2px solid rgba(119, 221, 170, 0.5);
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>