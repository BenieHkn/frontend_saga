<template>
  <!-- <div class="flex h-screen overflow-hidden bg-white"> -->
  <!-- <main
      class="flex-1 p-4 lg:p-8 transition-all duration-500 overflow-y-auto"
      :class="{ 'lg:ml-64': desktopSidebarOpen }"
    > -->
  <!-- Header -->
  <div class="mb-8 relative">
    <div class="absolute -left-4 top-0 w-1 h-12 bg-emerald-500 shadow-[0_0_15px_#10b981] rounded-full"></div>
    <div class="flex justify-between">
      <h1 class="text-3xl lg:text-4xl font-black text-emerald-500 tracking-tight drop-shadow-xl">
        Tableau de bord
      </h1>

      <div class="flex items-end">
        <!-- Dropdown Nouveau — DG, SA, SP -->
        <div v-if="isDG() || isSA() || isSP()" class="relative" ref="dropdownRef">
          <UBadge color="blue" variant="soft" size="lg" class="ml-auto cursor-pointer"
            @click="dropdownOpen = !dropdownOpen">
            <Icon name="i-heroicons-plus" class="h-4 w-4 mr-1" />
            <span class="text-blue-600 text-sm font-medium">Nouveau</span>
            <Icon name="i-heroicons-chevron-down" class="h-4 w-4 ml-1 text-blue-600 transition-transform duration-200"
              :class="{ 'rotate-180': dropdownOpen }" />
          </UBadge>

          <transition enter-active-class="transition ease-out duration-150" enter-from-class="opacity-0 translate-y-1"
            enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-100"
            leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
            <div v-if="dropdownOpen"
              class="absolute right-0 mt-2 w-52 rounded-xl bg-white shadow-xl border border-gray-100 z-50 overflow-hidden">
              <NuxtLink to="/courriers/form_courier_arrive"
                class="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors duration-150"
                @click="dropdownOpen = false">
                <span
                  class="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex-shrink-0">
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
                <span
                  class="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 text-green-600 flex-shrink-0">
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
      </div>
    </div>
  </div>

  <!-- Stats Cards -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <template v-if="statsLoading">
      <div v-for="i in 4" :key="i" class="liquid-card animate-pulse h-28 rounded-xl bg-white/10" />
    </template>

    <template v-else>
      <StatsCard :title="cardTitles[0]" :value="stats.total_courriers_arrives" changeType="decrease"
        icon="envelope-open-solid" color="blue" class="liquid-card text-white"
        :infos="isGenerales ? formatInfo(stats.arrives_par_service) : ''" />
      <StatsCard :title="cardTitles[1]" :value="stats.courriers_departs" changeType="increase"
        icon="envelope-open-solid" color="green" class="liquid-card text-white"
        :infos="isGenerales ? formatInfo(stats.departs_par_service) : ''" />
      <StatsCard :title="cardTitles[2]" :value="stats.affectations_en_cours" changeType="hold"
        icon="envelope-open-solid" color="yellow" class="liquid-card text-white"
        :infos="isGenerales ? formatInfo(stats.en_attente_par_service) : ''" />
      <StatsCard :title="cardTitles[3]" :value="stats.total_affectations" changeType="increase"
        icon="envelope-open-solid" color="purple" class="liquid-card text-white"
        :infos="isGenerales ? formatInfo(stats.affectes_par_service) : ''" />
    </template>
  </div>

  <!-- Activités récentes -->
  <div class="liquid-container p-1 overflow-hidden">
    <div class="p-1 border-b border-white/10 bg-white/5 flex justify-between items-center">
      <h2 class="text-white -mt-6 font-bold flex items-center gap-2">
        Activités Récentes
      </h2>
    </div>
    <div class="p-2">
      <Liste v-if="isDG() || isSA() || isSP() || isAdmin()" />
      <AffectationsListe v-else />
    </div>
  </div>
  <!-- </main> -->
  <!-- </div> -->
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuth } from '~/composables/auth/useAuth'
import AffectationsListe from '~/components/documents/AffectationsListe.vue'

const props = defineProps({
  entiteId: { type: Number, default: null }
})

const { isSP, isSA, isDG, isAdmin, isSecDir, getEmetteurId } = useAuth()

// ─── Helpers rôle ─────────────────────────────────────────────────────────────
const isGenerales = computed(() => isDG() || isSA() || isSP() || isAdmin())

// ─── Dropdown ─────────────────────────────────────────────────────────────────
const dropdownOpen = ref(false)
const dropdownRef = ref(null)

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    dropdownOpen.value = false
  }
}

// ─── Stats ────────────────────────────────────────────────────────────────────
const statsLoading = ref(true)
const isResponsable = ref(false)

const stats = ref({
  total_courriers_arrives: 0,
  courriers_departs: 0,
  affectations_en_cours: 0,
  total_affectations: 0,
  arrives_par_service: {},
  departs_par_service: {},
  en_attente_par_service: {},
  affectes_par_service: {},
})

// ─── Titres dynamiques selon le profil ───────────────────────────────────────
// const cardTitles = computed(() => {
//   if (isGenerales.value) {
//     return ['Arrivés', 'Départs', 'En attente', 'Affectés']
//   }
//   if (isResponsable.value) {
//     return ['Affectés reçus', 'Départs visibles', 'Affectations émises', 'Transferts']
//   }
//   return ['Affectés reçus', 'Départs visibles', 'En cours', 'Traités']
// })

const cardTitles = computed(() => {
  if (isGenerales.value) return ['Arrivés', 'Départs', 'En attente', 'Affectés']
  if (isResponsable.value || isSecDir()) {  // ← ajouter isSecDir() ici aussi
    return ['Affectés reçus', 'Départs visibles', 'Affectations émises', 'Transferts']
  }
  return ['Affectés reçus', 'Départs visibles', 'En cours', 'Traités']
})

// ─── Helper formatage infos (DG/SA/SP/Admin uniquement) ──────────────────────
const formatInfo = (data) => {
  if (!data || Object.keys(data).length === 0) return ''
  return Object.entries(data)
    .map(([k, v]) => `${k}: ${v}`)
    .join(' | ')
}

// ─── Fetch stats ──────────────────────────────────────────────────────────────
const fetchStats = async () => {
  try {
    statsLoading.value = true
    const token = localStorage.getItem('auth_token')
    const config = useRuntimeConfig()

    console.log('🔍 isGenerales:', isGenerales.value)
    console.log('🔍 isSecDir:', isSecDir())
    console.log('🔍 roles:', localStorage.getItem('roles'))
    console.log('🔍 directeur_entite_user_id:', localStorage.getItem('directeur_entite_user_id'))
    console.log('🔍 entite_user:', localStorage.getItem('entite_user'))

    if (isGenerales.value) {
      const response = await $fetch(`${config.public.apiBase}/statistiques/generales`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
      })
      if (response?.success) stats.value = response.data

    } else {
      const entiteUser = JSON.parse(localStorage.getItem('entite_user') || '{}')
      const entiteUserId = entiteUser?.entite_user_id ?? entiteUser?.id
      const statsId = getEmetteurId() ?? entiteUserId

      console.log('🔍 entiteUserId:', entiteUserId)
      console.log('🔍 getEmetteurId():', getEmetteurId())
      console.log('🔍 statsId final:', statsId)
      console.log('🔍 URL appelée:', `${config.public.apiBase}/statistiques/entite-user/${statsId}`)

      if (!statsId) {
        console.warn('❌ Aucun statsId résolu')
        return
      }

      const response = await $fetch(
        `${config.public.apiBase}/statistiques/entite-user/${statsId}`,
        { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }
      )

      console.log('🔍 response complète:', JSON.stringify(response, null, 2))

      if (response?.success) {
        const d = response.data
        isResponsable.value = d.is_responsable

        console.log('🔍 is_responsable:', d.is_responsable)
        console.log('🔍 d.courriers:', d.courriers)
        console.log('🔍 d.documents:', d.documents)
        console.log('🔍 d.affectations:', d.affectations)
        console.log('🔍 d.transferts:', d.transferts)

        if (d.is_responsable || isSecDir()) {
          stats.value = {
            total_courriers_arrives: d.courriers?.affectes                           ?? 0,
            courriers_departs:       d.documents?.visibles                           ?? 0,
            affectations_en_cours:   d.affectations?.emises                          ?? 0,
            total_affectations:     (d.transferts?.recus ?? 0) + (d.transferts?.emis ?? 0),
            arrives_par_service:    {},
            departs_par_service:    {},
            en_attente_par_service: {},
            affectes_par_service:   {},
          }
        } else {
          stats.value = {
            total_courriers_arrives: d.courriers?.affectes    ?? 0,
            courriers_departs:       d.documents?.visibles    ?? 0,
            affectations_en_cours:   d.affectations?.en_cours ?? 0,
            total_affectations:      d.affectations?.traitees ?? 0,
            arrives_par_service:    {},
            departs_par_service:    {},
            en_attente_par_service: {},
            affectes_par_service:   {},
          }
        }

        console.log('🔍 stats.value final:', JSON.stringify(stats.value, null, 2))
      } else {
        console.warn('❌ response.success est false ou response vide:', response)
      }
    }
  } catch (error) {
    console.error('❌ Erreur fetchStats:', error)
    console.error('❌ Détail:', error?.data ?? error?.message ?? error)
  } finally {
    statsLoading.value = false
  }
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  fetchStats()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>