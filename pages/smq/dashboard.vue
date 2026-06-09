<template>
  <div class="smq-content">
    <!-- En-tête ---------------------------------------------------------------- -->
    <SmqPageHeader
      :overline="`Management Global · Exercice ${exercice}`"
      title="Tableau de bord qualité"
    >
      <!-- Sélecteur de trimestre -->
      <div class="qp-seg">
        <button
          v-for="t in ['T1','T2','T3','T4']"
          :key="t"
          :class="{ active: trimestreCourant === t }"
          @click="trimestreCourant = t"
        >{{ t }}</button>
      </div>
      <button class="btn-secondary flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition-all">
        <Icon name="heroicons:arrow-down-tray" class="h-4 w-4" />
        Exporter
      </button>
    </SmqPageHeader>

    <!-- KPI row ---------------------------------------------------------------- -->
    <div v-if="loading" class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <div v-for="i in 4" :key="i" class="qp-kpi animate-pulse" style="height: 100px" />
    </div>

    <div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <SmqKpiCard
        label="Indicateurs suivis"
        :value="stats.total"
        :delta="stats.nouveaux ? `+${stats.nouveaux} nouveaux` : ''"
        delta-type="up"
      />
      <SmqKpiCard
        label="Taux de conformité"
        :value="formatTaux(stats.taux_conformite)"
        :progress="stats.taux_conformite"
        progress-color="var(--qp-success-500)"
      />
      <SmqKpiCard
        label="Non conformes"
        :value="stats.non_conformes"
        value-color="var(--qp-danger-600)"
        :delta="stats.delta_nc ? `${stats.delta_nc > 0 ? '+' : ''}${stats.delta_nc} vs période préc.` : ''"
        :delta-type="stats.delta_nc > 0 ? 'down' : 'up'"
      />
      <SmqKpiCard
        label="En attente de validation"
        :value="stats.en_attente"
        value-color="var(--qp-warning-600)"
        :subtext="`sur ${stats.nb_directions ?? '—'} directions`"
      />
    </div>

    <!-- Graphiques + répartition ---------------------------------------------- -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
      <!-- Courbe évolution -->
      <div class="qp-card qp-card--pad lg:col-span-2">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="font-semibold text-base" style="color: var(--qp-fg-1); margin: 0 0 4px">Évolution de la conformité</h3>
            <span class="qp-overline">Taux trimestriel · {{ exercice - 1 }} → {{ exercice }}</span>
          </div>
          <div class="flex gap-4 items-center">
            <span class="flex items-center gap-2 text-xs" style="color: var(--qp-fg-3)">
              <span class="inline-block rounded" style="width:18px;height:3px;background:var(--qp-navy-500)"></span>Conformité
            </span>
            <span class="flex items-center gap-2 text-xs" style="color: var(--qp-fg-3)">
              <span class="inline-block rounded" style="width:18px;height:3px;background:var(--qp-n-300)"></span>Cible 85 %
            </span>
          </div>
        </div>
        <!-- Graphique SVG inline simplifié -->
        <svg viewBox="0 0 620 220" width="100%" height="220" preserveAspectRatio="none" font-family="IBM Plex Mono">
          <g stroke="var(--qp-border-2)" stroke-width="1">
            <line x1="44" y1="20"  x2="610" y2="20"></line>
            <line x1="44" y1="70"  x2="610" y2="70"></line>
            <line x1="44" y1="120" x2="610" y2="120"></line>
            <line x1="44" y1="170" x2="610" y2="170"></line>
          </g>
          <g fill="var(--qp-fg-4)" font-size="10" text-anchor="end">
            <text x="38" y="24">100</text>
            <text x="38" y="74">90</text>
            <text x="38" y="124">80</text>
            <text x="38" y="174">70</text>
          </g>
          <!-- Cible 85% -->
          <line x1="44" y1="45" x2="610" y2="45" stroke="var(--qp-n-300)" stroke-width="1.5" stroke-dasharray="5 4"></line>
          <!-- Données dynamiques ou fallback statique -->
          <path
            :d="courbeArea"
            fill="var(--qp-navy-500)" fill-opacity="0.08"
          />
          <path
            :d="courbeLine"
            fill="none" stroke="var(--qp-navy-500)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
          />
          <g fill="var(--qp-fg-4)" font-size="10" text-anchor="middle">
            <text v-for="(pt, i) in courbePoints" :key="i" :x="pt.x" y="208">{{ pt.label }}</text>
          </g>
        </svg>
      </div>

      <!-- Donut répartition -->
      <div class="qp-card qp-card--pad">
        <h3 class="font-semibold text-base mb-4" style="color: var(--qp-fg-1); margin: 0 0 18px">Répartition globale</h3>
        <div class="flex items-center gap-5">
          <!-- Donut CSS -->
          <div class="flex-none" style="
            width: 128px; height: 128px; border-radius: 50%;
            background: conic-gradient(
              var(--qp-success-500) 0 {{ donutConformeStop }}%,
              var(--qp-danger-500) {{ donutConformeStop }}% {{ donutDangerStop }}%,
              var(--qp-warning-500) {{ donutDangerStop }}% 100%
            );
            display: grid; place-items: center; position: relative;
          ">
            <div style="
              position: absolute; inset: 20px;
              background: #fff; border-radius: 50%;
              display: grid; place-items: center; text-align: center;
            ">
              <div>
                <div class="qp-num" style="font-size: 22px; font-weight: 600; color: var(--qp-fg-1)">{{ stats.total ?? '—' }}</div>
                <div style="font-size: 11px; color: var(--qp-fg-3)">indicateurs</div>
              </div>
            </div>
          </div>
          <!-- Légende -->
          <div class="flex flex-col gap-2.5">
            <div class="flex items-center gap-2 text-sm" style="color: var(--qp-fg-2)">
              <span class="rounded-sm flex-none" style="width:11px;height:11px;background:var(--qp-success-500)"></span>
              Conformes <span class="qp-num ml-auto pl-4" style="color:var(--qp-fg-1);font-weight:600">{{ stats.conformes ?? '—' }}</span>
            </div>
            <div class="flex items-center gap-2 text-sm" style="color: var(--qp-fg-2)">
              <span class="rounded-sm flex-none" style="width:11px;height:11px;background:var(--qp-danger-500)"></span>
              Non conformes <span class="qp-num ml-auto pl-4" style="color:var(--qp-fg-1);font-weight:600">{{ stats.non_conformes ?? '—' }}</span>
            </div>
            <div class="flex items-center gap-2 text-sm" style="color: var(--qp-fg-2)">
              <span class="rounded-sm flex-none" style="width:11px;height:11px;background:var(--qp-warning-500)"></span>
              En attente <span class="qp-num ml-auto pl-4" style="color:var(--qp-fg-1);font-weight:600">{{ stats.en_attente ?? '—' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tableau alertes + activité -------------------------------------------- -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- Indicateurs sous la cible -->
      <div class="qp-tablecard">
        <div class="qp-tablecard__head">
          <h3 class="font-semibold text-sm" style="color: var(--qp-fg-1); margin: 0">Indicateurs sous la cible</h3>
          <NuxtLink to="/smq/indicateurs?conformite=non_conforme" class="flex items-center gap-1 text-xs font-medium hover:underline" style="color: var(--qp-primary-600)">
            Tout voir <Icon name="heroicons:arrow-right" class="h-3 w-3" />
          </NuxtLink>
        </div>
        <div v-if="loading" class="p-4 text-center text-sm" style="color: var(--qp-fg-3)">Chargement…</div>
        <template v-else>
          <div
            v-for="ind in indicateursSousCible"
            :key="ind.id"
            class="flex items-center gap-3 px-[18px] py-3 border-b last:border-b-0"
            style="border-color: var(--qp-border-2)"
          >
            <span class="qp-num text-xs flex-none" style="color: var(--qp-fg-3)">{{ ind.code }}</span>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium truncate" style="color: var(--qp-fg-1)">{{ ind.libelle }}</div>
              <div class="text-xs" style="color: var(--qp-fg-3)">{{ ind.direction }}</div>
            </div>
            <SmqStatusBadge :conformite="ind.conformite" />
          </div>
          <div v-if="!indicateursSousCible.length" class="p-5 text-center text-sm" style="color: var(--qp-fg-3)">
            Aucun indicateur sous la cible.
          </div>
        </template>
      </div>

      <!-- Activité récente -->
      <div class="qp-tablecard">
        <div class="qp-tablecard__head">
          <h3 class="font-semibold text-sm" style="color: var(--qp-fg-1); margin: 0">Activité récente</h3>
          <span class="qp-overline">Aujourd'hui</span>
        </div>
        <div v-if="loading" class="p-4 text-center text-sm" style="color: var(--qp-fg-3)">Chargement…</div>
        <template v-else>
          <div
            v-for="evt in activiteRecente"
            :key="evt.id"
            class="flex items-center gap-3 px-[18px] py-3 border-b last:border-b-0"
            style="border-color: var(--qp-border-2)"
          >
            <SmqStatusBadge :status="evt.statut" class="flex-none" />
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium truncate" style="color: var(--qp-fg-1)">
                {{ evt.code ? `${evt.code} · ` : '' }}{{ evt.libelle }}
              </div>
              <div class="text-xs" style="color: var(--qp-fg-3)">{{ evt.detail }}</div>
            </div>
          </div>
          <div v-if="!activiteRecente.length" class="p-5 text-center text-sm" style="color: var(--qp-fg-3)">
            Aucune activité récente.
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useIndicateurs }    from '~/composables/smq/useIndicateurs'
import { useReferentiels }   from '~/composables/smq/useReferentiels'
import { useSmqStore }       from '~/stores/smq'
import { useSmqPermissions } from '~/composables/smq/useSmqPermissions'

useHead({ title: 'Tableau de bord qualité — SAGA' })

const store    = useSmqStore()
const { fetchDashboard, formatResultat } = useIndicateurs()
const { fetchExerciceActif }             = useReferentiels()
const { peutVoirDashboardGlobal, estMG } = useSmqPermissions()

const exerciceActif    = ref(null)
const exercice         = computed(() => exerciceActif.value?.annee ?? store.exerciceCourant)
const trimestreCourant = ref('T2')
const loading          = ref(true)

const stats = ref({
  total: 0, conformes: 0, non_conformes: 0, en_attente: 0,
  taux_conformite: 0, nouveaux: 0, delta_nc: 0, nb_directions: 0,
})

const indicateursSousCible = ref([])
const activiteRecente      = ref([])
const historique           = ref([])

// ── Chargement ────────────────────────────────────────────────────────────────
const charger = async () => {
  loading.value = true
  try {
    const data = await fetchDashboard(exerciceActif.value?.id)
    if (data?.stats)            stats.value              = data.stats
    if (data?.alertes)          indicateursSousCible.value = data.alertes
    if (data?.activiteRecente)  activiteRecente.value    = data.activiteRecente
  } catch (e) {
    console.error('❌ Erreur dashboard SMQ :', e)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  exerciceActif.value = await fetchExerciceActif()
  await charger()
})
watch([trimestreCourant], () => charger())

// ── Helpers affichage ─────────────────────────────────────────────────────────
const formatTaux = (val) => {
  if (val === null || val === undefined) return '—'
  return `${parseFloat(val).toFixed(1).replace('.', ',')} %`
}

// Donut stops (en %)
const donutConformeStop = computed(() => {
  if (!stats.value.total) return 0
  return Math.round((stats.value.conformes / stats.value.total) * 100)
})
const donutDangerStop = computed(() => {
  if (!stats.value.total) return 0
  return Math.round(((stats.value.conformes + stats.value.non_conformes) / stats.value.total) * 100)
})

// Courbe SVG (points fictifs si pas de données historiques)
const courbePoints = computed(() => {
  if (historique.value.length) {
    return historique.value.map((h, i) => ({
      x: 70 + i * 90,
      y: 190 - (h.taux / 100) * 180,
      label: h.label,
    }))
  }
  // Fallback illustratif
  return [
    { x: 70,  y: 150, label: `T1·${exercice.value - 1}` },
    { x: 160, y: 132, label: `T2·${exercice.value - 1}` },
    { x: 250, y: 118, label: `T3·${exercice.value - 1}` },
    { x: 340, y: 96,  label: `T4·${exercice.value - 1}` },
    { x: 430, y: 80,  label: `T1·${exercice.value}` },
    { x: 520, y: 64,  label: `T2·${exercice.value}` },
  ]
})

const courbeLine = computed(() => {
  const pts = courbePoints.value
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join(' ')
})

const courbeArea = computed(() => {
  const pts = courbePoints.value
  if (!pts.length) return ''
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join(' ')
  const last = pts[pts.length - 1]
  return `${line} L${last.x} 190 L${pts[0].x} 190 Z`
})
</script>

<style scoped>
.smq-content { font-family: 'IBM Plex Sans', system-ui, sans-serif; }
</style>
