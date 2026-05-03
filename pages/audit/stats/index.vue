<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20 p-6">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-4xl font-black text-slate-900 tracking-tight mb-2">
            Statistiques d'Audit
          </h1>
          <p class="text-slate-500 font-medium">
            Vue d'ensemble des flux de courriers et traitements
          </p>
        </div>

        <UButton
          icon="i-heroicons-arrow-down-tray"
          color="emerald"
          variant="solid"
          size="lg"
          @click="exporterStatistiques"
          :loading="exportLoading"
        >
          Exporter CSV
        </UButton>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <USkeleton v-for="i in 4" :key="i" class="h-32 rounded-2xl" />
      </div>
      <USkeleton class="h-96 rounded-2xl" />
    </div>

    <!-- Content -->
    <div v-else class="space-y-8">

      <!-- Vue Globale - Stats Cards -->
      <div>
        <h2 class="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <span class="w-1.5 h-8 bg-emerald-500 rounded-full"></span>
          Vue Globale
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Courriers Arrivés -->
          <StatCard
            title="Courriers Arrivés"
            :value="statsGlobales.courriers_arrives.total"
            icon="i-heroicons-inbox"
            color="blue"
            :details="formatServiceDetails(statsGlobales.courriers_arrives.par_service)"
          />

          <!-- Courriers Départs -->
          <StatCard
            title="Courriers Départs"
            :value="statsGlobales.courriers_departs.total"
            icon="i-heroicons-paper-airplane"
            color="green"
            :details="formatServiceDetails(statsGlobales.courriers_departs.par_service)"
          />

          <!-- En Attente (sans réponse) -->
          <StatCard
            title="Sans Réponse"
            :value="statsGlobales.affectations_en_attente.total"
            icon="i-heroicons-clock"
            color="amber"
            :details="formatServiceDetails(statsGlobales.affectations_en_attente.par_service)"
          />

          <!-- Traités (avec réponse) -->
          <StatCard
            title="Avec Réponse"
            :value="statsGlobales.affectations_traitees.total"
            icon="i-heroicons-check-badge"
            color="emerald"
            :details="formatServiceDetails(statsGlobales.affectations_traitees.par_service)"
          />
        </div>
      </div>

      <!-- Taux de Traitement -->
      <div>
        <h2 class="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <span class="w-1.5 h-8 bg-indigo-500 rounded-full"></span>
          Taux de Traitement
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Global -->
          <UCard class="bg-white hover:shadow-xl transition-shadow duration-300">
            <div class="text-center">
              <div class="relative w-32 h-32 mx-auto mb-4">
                <svg class="transform -rotate-90 w-32 h-32">
                  <circle cx="64" cy="64" r="56" stroke="currentColor" stroke-width="12"
                    fill="transparent" class="text-slate-100" />
                  <circle cx="64" cy="64" r="56" stroke="currentColor" stroke-width="12"
                    fill="transparent"
                    :stroke-dasharray="circumference"
                    :stroke-dashoffset="calculateOffset(statsGlobales.taux_traitement.global)"
                    class="text-indigo-500 transition-all duration-1000 ease-out"
                    stroke-linecap="round" />
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-3xl font-black text-slate-900">
                    {{ statsGlobales.taux_traitement.global }}%
                  </span>
                </div>
              </div>
              <p class="text-sm font-bold text-slate-500 uppercase tracking-wider">Global</p>
            </div>
          </UCard>

          <!-- SP -->
          <TauxCard
            label="Secrétariat Particulier"
            :taux="statsGlobales.taux_traitement.par_service.SP || 0"
            color="blue"
          />

          <!-- SA -->
          <TauxCard
            label="Secrétariat Administratif"
            :taux="statsGlobales.taux_traitement.par_service.SA || 0"
            color="green"
          />
        </div>
      </div>

      <!-- Statistiques Hebdomadaires -->
      <div>
        <h2 class="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <span class="w-1.5 h-8 bg-purple-500 rounded-full"></span>
          Évolution Hebdomadaire (12 dernières semaines)
        </h2>

        <!-- Graphiques -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartCard
            title="Courriers (Arrivés vs Départs)"
            :data="chartDataCourriers"
            type="courriers"
          />

          <ChartCard
            title="Traitement des courriers (Arrivés vs Répondus)"
            :data="chartDataTraitement"
            type="traitement"
          />
        </div>

        <!-- Tableau détaillé -->
        <UCard class="bg-white">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-slate-200">
                  <th class="text-left py-3 px-4 font-bold text-slate-700">Semaine</th>
                  <th class="text-center py-3 px-2 font-bold text-blue-600">Arrivés<br/>Total</th>
                  <th class="text-center py-3 px-2 font-bold text-blue-500 text-xs">SP</th>
                  <th class="text-center py-3 px-2 font-bold text-blue-400 text-xs">SA</th>
                  <th class="text-center py-3 px-2 font-bold text-green-600">Départs<br/>Total</th>
                  <th class="text-center py-3 px-2 font-bold text-green-500 text-xs">SP</th>
                  <th class="text-center py-3 px-2 font-bold text-green-400 text-xs">SA</th>
                  <th class="text-center py-3 px-2 font-bold text-amber-600">Sans<br/>Réponse</th>
                  <th class="text-center py-3 px-2 font-bold text-emerald-600">Répondus<br/>Total</th>
                  <th class="text-center py-3 px-2 font-bold text-emerald-500 text-xs">SP</th>
                  <th class="text-center py-3 px-2 font-bold text-emerald-400 text-xs">SA</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(semaine, index) in statsHebdomadaires"
                  :key="index"
                  class="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <td class="py-3 px-4 font-medium text-slate-700">{{ semaine.periode }}</td>
                  <td class="text-center py-3 px-2 font-bold text-blue-600">
                    {{ semaine.stats.courriers_arrives.total }}
                  </td>
                  <td class="text-center py-3 px-2 text-slate-600">
                    {{ semaine.stats.courriers_arrives.par_service.SP || 0 }}
                  </td>
                  <td class="text-center py-3 px-2 text-slate-600">
                    {{ semaine.stats.courriers_arrives.par_service.SA || 0 }}
                  </td>
                  <td class="text-center py-3 px-2 font-bold text-green-600">
                    {{ semaine.stats.courriers_departs.total }}
                  </td>
                  <td class="text-center py-3 px-2 text-slate-600">
                    {{ semaine.stats.courriers_departs.par_service.SP || 0 }}
                  </td>
                  <td class="text-center py-3 px-2 text-slate-600">
                    {{ semaine.stats.courriers_departs.par_service.SA || 0 }}
                  </td>
                  <td class="text-center py-3 px-2 font-bold text-amber-600">
                    {{ semaine.stats.affectations_en_attente }}
                  </td>
                  <td class="text-center py-3 px-2 font-bold text-emerald-600">
                    {{ semaine.stats.affectations_traitees.total }}
                  </td>
                  <td class="text-center py-3 px-2 text-slate-600">
                    {{ semaine.stats.affectations_traitees.par_service.SP || 0 }}
                  </td>
                  <td class="text-center py-3 px-2 text-slate-600">
                    {{ semaine.stats.affectations_traitees.par_service.SA || 0 }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

useHead({ title: "Statistiques - SAGA" })

const config = useRuntimeConfig()
const loading = ref(true)
const exportLoading = ref(false)

const statsGlobales = ref({
  courriers_arrives:       { total: 0, par_service: {} },
  courriers_departs:       { total: 0, par_service: {} },
  affectations_en_attente: { total: 0, par_service: {} },
  affectations_traitees:   { total: 0, par_service: {} },
  taux_traitement:         { global: 0, par_service: {} },
})

const statsHebdomadaires = ref([])

const circumference = 2 * Math.PI * 56

const calculateOffset = (percentage) =>
  circumference - (percentage / 100) * circumference

const formatServiceDetails = (parService) => {
  if (!parService || Object.keys(parService).length === 0) return ''
  return Object.entries(parService)
    .map(([service, count]) => `${service}: ${count}`)
    .join(' | ')
}

// Graphique courriers : Arrivés vs Départs
const chartDataCourriers = computed(() =>
  statsHebdomadaires.value.map(s => ({
    semaine:       s.periode.split(' - ')[0],
    arrives_total: s.stats.courriers_arrives.total,
    arrives_sp:    s.stats.courriers_arrives.par_service.SP || 0,
    arrives_sa:    s.stats.courriers_arrives.par_service.SA || 0,
    departs_total: s.stats.courriers_departs.total,
    departs_sp:    s.stats.courriers_departs.par_service.SP || 0,
    departs_sa:    s.stats.courriers_departs.par_service.SA || 0,
  }))
)

// Graphique traitement : Arrivés vs Répondus (remplace "Créées vs Traitées")
const chartDataTraitement = computed(() =>
  statsHebdomadaires.value.map(s => ({
    semaine:        s.periode.split(' - ')[0],
    arrives:        s.stats.courriers_arrives.total,
    en_attente:     s.stats.affectations_en_attente,
    traites_total:  s.stats.affectations_traitees.total,
    traites_sp:     s.stats.affectations_traitees.par_service.SP || 0,
    traites_sa:     s.stats.affectations_traitees.par_service.SA || 0,
  }))
)

const fetchStatistiques = async () => {
  try {
    loading.value = true
    const token = localStorage.getItem('auth_token')

    const response = await $fetch(`${config.public.apiBase}/statistiques/audit`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })

    if (response?.success) {
      statsGlobales.value      = response.data.vue_globale
      statsHebdomadaires.value = response.data.stats_hebdomadaires
    }
  } catch (error) {
    console.error('❌ Erreur chargement stats audit:', error)
  } finally {
    loading.value = false
  }
}

const exporterStatistiques = async () => {
  try {
    exportLoading.value = true
    const token = localStorage.getItem('auth_token')

    const response = await fetch(`${config.public.apiBase}/statistiques/audit/export`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'text/csv',
      },
    })

    if (response.ok) {
      const blob = await response.blob()
      const url  = window.URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `audit_statistiques_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    }
  } catch (error) {
    console.error('❌ Erreur export:', error)
  } finally {
    exportLoading.value = false
  }
}

onMounted(() => {
  fetchStatistiques()
})
</script>