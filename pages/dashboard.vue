<template>
  <div class="flex h-screen overflow-hidden bg-white">
    <main class="flex-1 p-4 lg:p-8 transition-all duration-500 overflow-y-auto"
      :class="{ 'lg:ml-64': desktopSidebarOpen }">
      <div class="mb-8 relative">
        <div class="absolute -left-4 top-0 w-1 h-12 bg-emerald-500 shadow-[0_0_15px_#10b981] rounded-full"></div>
        <div class="flex justify-between">
          <h1 class="text-3xl lg:text-4xl font-black text-emerald-500 tracking-tight drop-shadow-xl">
            Tableau de bord
          </h1>

          <div class="flex items-end">
            <!-- Dropdown pour DG, SA, SP -->
            <div v-if="isDG() || isSA() || isSP()" class="relative" ref="dropdownRef">
              <UBadge color="blue" variant="soft" size="lg" class="ml-auto cursor-pointer"
                @click="dropdownOpen = !dropdownOpen">
                <Icon name="i-heroicons-plus" class="h-4 w-4 mr-1" />
                <span class="text-blue-600 text-sm font-medium">Nouveau</span>
                <Icon name="i-heroicons-chevron-down"
                  class="h-4 w-4 ml-1 text-blue-600 transition-transform duration-200"
                  :class="{ 'rotate-180': dropdownOpen }" />
              </UBadge>

              <transition enter-active-class="transition ease-out duration-150"
                enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 translate-y-1">
                <div v-if="dropdownOpen"
                  class="absolute right-0 mt-2 w-52 rounded-xl bg-white shadow-xl border border-gray-100 z-50 overflow-hidden">
                  <NuxtLink to="/courriers/form_courier_arrive"
                    class="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors duration-150"
                    @click="dropdownOpen = false">
                    <span class="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex-shrink-0">
                      <Icon name="i-heroicons-inbox-arrow-down" class="h-4 w-4" />
                    </span>
                    <div>
                      <p class="font-semibold">Courrier Arrivée</p>
                      <p class="text-xs text-gray-400">Nouveau courrier reçu</p>
                    </div>
                  </NuxtLink>

                  <div class="mx-4 border-t border-gray-100"></div>

                  <NuxtLink to="/courriers/form_courrier_depart"
                    class="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors duration-150"
                    @click="dropdownOpen = false">
                    <span class="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 text-green-600 flex-shrink-0">
                      <Icon name="i-heroicons-paper-airplane" class="h-4 w-4" />
                    </span>
                    <div>
                      <p class="font-semibold">Courrier Départ</p>
                      <p class="text-xs text-gray-400">Nouveau courrier envoyé</p>
                    </div>
                  </NuxtLink>
                </div>
              </transition>
            </div>

            <!-- Bouton simple pour les autres rôles -->
            <UBadge v-else-if="!isAdmin()" color="blue" variant="soft" size="lg" class="ml-auto">
              <Icon name="i-heroicons-plus" class="h-4 w-4 mr-1" />
              <UButton to="/courriers/form_document_interne" variant="text" size="sm" class="p-0 m-0 text-blue-600">
                Nouveau
              </UButton>
            </UBadge>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <template v-if="statsLoading">
          <div v-for="i in 4" :key="i"
            class="liquid-card animate-pulse h-28 rounded-xl bg-white/10">
          </div>
        </template>
        <template v-else>
          <StatsCard
            title="Arrivés"
            :value="stats.total_courriers_arrives"
            changeType="decrease"
            icon="envelope-open-solid"
            color="blue"
            class="liquid-card"
            :infos="`Sans réponse: ${stats.courriers_arrives_sans_reponse}`"
          />
          <StatsCard
            title="Départs"
            :value="stats.courriers_departs"
            changeType="increase"
            icon="envelope-open-solid"
            color="green"
            class="liquid-card"
            :infos="`Répondus: ${stats.courriers_repondus}`"
          />
          <StatsCard
            title="En attente"
            :value="stats.affectations_en_cours"
            changeType="hold"
            icon="envelope-open-solid"
            color="yellow"
            class="liquid-card"
            :infos="`Traitement: ${stats.taux_traitement_affectations}%`"
          />
          <StatsCard
            title="Affectés"
            :value="stats.total_affectations"
            changeType="increase"
            icon="envelope-open-solid"
            color="purple"
            class="liquid-card"
            :infos="`Taux réponse: ${stats.taux_reponse}%`"
          />
        </template>
      </div>

      <!-- Activités récentes -->
      <div class="liquid-container p-1 overflow-hidden" v-if="isDG() || isSA() || isSP() || isAdmin()">
        <div class="p-1 border-b border-white/10 bg-white/5 flex justify-between items-center">
          <h2 class="text-white -mt-6 font-bold flex items-center gap-2">
            Activités Récentes
          </h2>
        </div>
        <div class="p-2">
          <Liste />
        </div>
      </div>
      <div class="liquid-container p-1 overflow-hidden" v-else>
        <div class="p-1 border-b border-white/10 bg-white/5 flex justify-between items-center">
          <h2 class="text-white -mt-6 font-bold flex items-center gap-2">
            Activités Récentes
          </h2>
        </div>
        <div class="p-2">
          <AffectationsListe />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useCourriersStore } from '~/stores/courriers'
import { useAuth } from '~/composables/auth/useAuth'
import { useApi } from '~/composables/useApi'
import AffectationsListe from '~/components/documents/AffectationsListe.vue'

const props = defineProps({
  entiteId: { type: Number, default: null }
})

const { isSP, isSA, isDG, isAdmin } = useAuth()
const { apiFetch } = useApi()

// Dropdown state
const dropdownOpen = ref(false)
const dropdownRef = ref(null)

// Stats state
const statsLoading = ref(true)
const stats = ref({
  total_courriers_arrives: 0,
  courriers_arrives_sans_reponse: 0,
  courriers_departs: 0,
  courriers_repondus: 0,
  affectations_en_cours: 0,
  total_affectations: 0,
  taux_reponse: 0,
  taux_traitement_affectations: 0,
})

const fetchStats = async () => {
  try {
    statsLoading.value = true
    const response = await apiFetch('/statistiques/generales')
    if (response?.success) {
      stats.value = response.data
    }
  } catch (error) {
    console.error('Erreur chargement statistiques:', error)
  } finally {
    statsLoading.value = false
  }
}

// Fermer le dropdown si clic extérieur
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    dropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  fetchStats()
})

onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>