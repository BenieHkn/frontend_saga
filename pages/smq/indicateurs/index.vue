<template>
  <div class="smq-content">
    <SmqPageHeader
      overline="SMQ · Indicateurs"
      title="Indicateurs"
    >
      <button
        class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition-all"
        @click="exporterListe"
      >
        <Icon name="heroicons:arrow-down-tray" class="h-4 w-4" />
        Exporter
      </button>
      <NuxtLink
        v-if="peutParametrer"
        to="/smq/indicateurs/create"
        class="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-white transition-all"
        style="background: var(--qp-primary-500)"
      >
        <Icon name="heroicons:plus" class="h-4 w-4" />
        Nouvel indicateur
      </NuxtLink>
    </SmqPageHeader>

    <!-- Filtres ----------------------------------------------------------------- -->
    <div class="flex flex-wrap gap-2.5 items-center mb-4">
      <div class="qp-seg">
        <button
          v-for="f in filtresActif"
          :key="f.value"
          :class="{ active: filtreActif === f.value }"
          @click="filtreActif = f.value; charger()"
        >{{ f.label }}</button>
      </div>
      <div class="flex-1" />
      <input
        v-model="search"
        class="qp-input"
        style="width: 220px; height: 34px; font-size: 0.8125rem"
        placeholder="Rechercher…"
        @input="charger"
      />
    </div>

    <!-- Tableau ----------------------------------------------------------------- -->
    <div v-if="loading" class="flex justify-center py-16">
      <div class="w-8 h-8 border-4 border-slate-200 rounded-full animate-spin" style="border-top-color: var(--qp-primary-500)" />
    </div>

    <div v-else-if="error" class="qp-card qp-card--pad" style="border-color: var(--qp-danger-100); background: var(--qp-danger-50)">
      <p class="text-sm" style="color: var(--qp-danger-700)">{{ error }}</p>
      <button class="mt-3 text-sm underline" style="color: var(--qp-danger-600)" @click="charger">Réessayer</button>
    </div>

    <div v-else class="qp-tablecard">
      <table class="qp-table">
        <thead>
          <tr>
            <th style="width: 130px">Code</th>
            <th>Indicateur</th>
            <th>Pilote</th>
            <th>Périodicité</th>
            <th>Clé de calcul</th>
            <th class="num">Cible</th>
            <th style="width: 70px">Actif</th>
            <th style="width: 40px" />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="ind in indicateurs"
            :key="ind.id"
            class="cursor-pointer"
            @click="ouvrirIndicateur(ind)"
          >
            <td><span class="qp-num text-xs" style="color: var(--qp-fg-3)">{{ ind.code }}</span></td>
            <td>
              <div class="font-medium text-sm" style="color: var(--qp-fg-1)">{{ ind.libelle }}</div>
            </td>
            <td>
              <div class="flex items-center gap-2">
                <span class="w-[26px] h-[26px] rounded-full flex-none flex items-center justify-center text-white text-[10px] font-semibold" :style="{ background: avatarCouleur(piloteNom(ind)) }">
                  {{ initialesAvatar(piloteNom(ind)) }}
                </span>
                <span class="text-sm" style="color: var(--qp-fg-1)">{{ piloteNom(ind) }}</span>
              </div>
            </td>
            <td class="text-sm" style="color: var(--qp-fg-2)">{{ ind.periodicite?.libelle }}</td>
            <td>
              <span v-if="ind.type === 'suivi'" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" style="background:var(--qp-primary-50);color:var(--qp-primary-700);border:1px solid var(--qp-primary-200)">
                Suivi · {{ ind.label_valeur }}
              </span>
              <span v-else class="text-xs qp-num" style="color: var(--qp-fg-2)">
                {{ ind.label_operande1 }} {{ ind.operateur?.signe }} {{ ind.label_operande2 }} × 100
              </span>
            </td>
            <td class="num">
              <span class="qp-num text-sm">
                {{ ind.type === 'suivi' ? ind.valeur_cible : formatPourcentage(ind.valeur_cible) }}
              </span>
            </td>
            <td>
              <span
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                :style="ind.actif
                  ? 'background:var(--qp-success-50);color:var(--qp-success-700);border:1px solid var(--qp-success-200)'
                  : 'background:var(--qp-n-100);color:var(--qp-fg-3);border:1px solid var(--qp-border-1)'"
              >
                {{ ind.actif ? 'Actif' : 'Inactif' }}
              </span>
            </td>
            <td>
              <button
                class="w-8 h-8 rounded-md flex items-center justify-center"
                style="color: var(--qp-fg-3)"
                @click.stop="ouvrirIndicateur(ind)"
              >
                <Icon name="heroicons:chevron-right" class="h-4 w-4" />
              </button>
            </td>
          </tr>
          <tr v-if="!indicateurs.length">
            <td colspan="8" class="text-center py-10 text-sm" style="color: var(--qp-fg-3)">Aucun indicateur trouvé.</td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-between px-[18px] py-3 border-t" style="border-color: var(--qp-border-2)">
        <span class="qp-overline">{{ totalItems }} indicateur{{ totalItems !== 1 ? 's' : '' }}</span>
        <div class="flex gap-1">
          <button
            v-for="p in totalPages"
            :key="p"
            class="w-8 h-8 border rounded text-xs font-mono transition-all"
            :style="p === page
              ? 'background:var(--qp-primary-500);color:#fff;border-color:var(--qp-primary-500)'
              : 'background:#fff;color:var(--qp-fg-2);border-color:var(--qp-border-1)'"
            @click="page = p; charger()"
          >{{ p }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useIndicateurs } from '~/composables/smq/useIndicateurs'
import { useAuth }        from '~/composables/auth/useAuth'

useHead({ title: 'Indicateurs — SMQ · SAGA' })

const router = useRouter()
const { fetchIndicateurs, formatResultat, formatPourcentage, initialesAvatar } = useIndicateurs()

// Retourne le responsable smq_pilote de l'entité pilote de l'indicateur
const piloteInfo = (ind) => {
  const entite = ind.entites?.find(e => e.pivot?.is_pilote)
  if (!entite) return null
  return entite.entite_users?.find(eu =>
    eu.is_responsable && eu.actif &&
    eu.user?.roles?.some(r => r.name === 'smq_pilote')
  )?.user ?? null
}
const piloteNom = (ind) => {
  const u = piloteInfo(ind)
  return u ? `${u.prenom ?? ''} ${u.nom ?? ''}`.trim() : '—'
}
const { isSmqAdmin, isSmqPilote } = useAuth()

const peutParametrer = computed(() => isSmqAdmin() || isSmqPilote())

const indicateurs  = ref([])
const loading      = ref(false)
const error        = ref(null)
const page         = ref(1)
const totalPages   = ref(1)
const totalItems   = ref(0)
const search       = ref('')
const filtreActif  = ref('')

const filtresActif = [
  { value: '',     label: 'Tous'     },
  { value: 'true', label: 'Actifs'   },
  { value: 'false', label: 'Inactifs' },
]

const AVATAR_COLORS = ['var(--qp-teal-500)', 'var(--qp-navy-500)', 'var(--qp-primary-500)', '#6E59C7', 'var(--qp-warning-600)']
const avatarCouleur = (nom) => AVATAR_COLORS[(nom?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length]

const charger = async () => {
  loading.value = true; error.value = null
  try {
    const params = { page: page.value, per_page: 20 }
    if (filtreActif.value !== '') params.actif = filtreActif.value
    if (search.value.trim())      params.search = search.value.trim()

    const res = await fetchIndicateurs(params)
    const list = res?.data ?? res ?? []
    indicateurs.value = Array.isArray(list) ? list : []
    totalItems.value  = res?.total    ?? indicateurs.value.length
    totalPages.value  = res?.last_page ?? 1
  } catch (e) {
    error.value = e?.data?.message || 'Erreur lors du chargement.'
  } finally {
    loading.value = false
  }
}

const ouvrirIndicateur = (ind) => router.push(`/smq/indicateurs/${ind.id}/saisie`)

const exporterListe = () => console.log('Export indicateurs')

onMounted(() => charger())
</script>

<style scoped>
.smq-content { font-family: 'IBM Plex Sans', system-ui, sans-serif; }
</style>
