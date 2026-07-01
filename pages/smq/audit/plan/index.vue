<script setup>

import { usePaq } from '~/composables/smq/usePaq'

const config = useRuntimeConfig()
const base   = computed(() => config.public.apiBase)
const route  = useRoute()
const router = useRouter()

const { fetchAudits, fetchAudit, downloadAuditPdf, AUDIT_STATUTS, badgeAuditStatut, labelAuditStatut } = usePaq()

// ── Sélection audit ───────────────────────────────────────────────────────────
const auditsDisponibles = ref([])
const auditId = ref(route.query.audit_id ? Number(route.query.audit_id) : null)
const audit   = ref(null)
const loading = ref(false)
const erreur  = ref(null)

const chargerAudits = async () => {
  try {
    const token = process.client ? localStorage.getItem('auth_token') : ''
    const h = { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    const res = await $fetch(`${base.value}/smq/audits?per_page=100`, { headers: h })
    const raw = res?.data?.data ?? res?.data ?? res ?? []
    auditsDisponibles.value = (Array.isArray(raw) ? raw : Object.values(raw).filter(v => v?.id)).filter(Boolean)
  } catch (e) {
    console.error(e)
  }
}

const chargerAudit = async (id) => {
  if (!id) { audit.value = null; return }
  loading.value = true
  erreur.value  = null
  try {
    const token = process.client ? localStorage.getItem('auth_token') : ''
    const h = { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    const res = await $fetch(`${base.value}/smq/audits/${id}`, { headers: h })
    audit.value = res?.data ?? res
    // charger aussi les programme items
    await chargerProgrammeItems()
  } catch (e) {
    erreur.value = e?.data?.message ?? 'Erreur chargement audit'
  } finally {
    loading.value = false
  }
}

watch(auditId, (id) => {
  router.replace({ query: id ? { audit_id: id } : {} })
  chargerAudit(id)
})

onMounted(async () => {
  await chargerAudits()
  if (auditId.value) await chargerAudit(auditId.value)
})

// ── Programme items ───────────────────────────────────────────────────────────
const programmeItems = ref([])

const chargerProgrammeItems = async () => {
  if (!auditId.value) return
  try {
    const token = process.client ? localStorage.getItem('auth_token') : ''
    const h = { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    const res = await $fetch(`${base.value}/smq/audits/${auditId.value}/programme`, { headers: h })
    programmeItems.value = res?.data ?? res ?? []
  } catch (e) {
    programmeItems.value = []
  }
}

// ── Types et helpers ──────────────────────────────────────────────────────────
const TYPES_PROGRAMME = [
  { value: 'reunion_ouverture',    label: "Réunion d'ouverture", icon: 'heroicons:megaphone-20-solid',       color: '#1E3A5F', bg: '#EAEFF6', border: '#2E4F80' },
  { value: 'seance_cloture',       label: 'Séance de clôture',   icon: 'heroicons:flag-20-solid',            color: '#116A37', bg: '#E8F6EE', border: '#1F9D52' },
  { value: 'autre',                label: 'Autre activité',       icon: 'heroicons:document-text-20-solid',   color: '#0A6E66', bg: '#E2F5F2', border: '#0E9B8E' },
]

const TYPES_PAUSE = [
  { value: 'pause_simple',         label: 'Pause',               icon: 'heroicons:clock-20-solid',           color: '#44546B', bg: '#EFF3F8', border: '#8593A8' },
  { value: 'pause_cafe',           label: 'Pause café',          icon: 'heroicons:beaker-20-solid',          color: '#9C660C', bg: '#FBF1DD', border: '#C07F12' },
  { value: 'pause_petit_dejeuner', label: 'Petit-déjeuner',      icon: 'heroicons:sun-20-solid',             color: '#9C660C', bg: '#FBF1DD', border: '#C07F12' },
  { value: 'pause_dejeuner',       label: 'Déjeuner',            icon: 'heroicons:cake-20-solid',            color: '#AE2F29', bg: '#FBEAE9', border: '#CE3B34' },
]

const ALL_TYPES = [...TYPES_PROGRAMME, ...TYPES_PAUSE]

const typeLabel  = (t) => ALL_TYPES.find(x => x.value === t)?.label  ?? t
const typeColor  = (t) => ALL_TYPES.find(x => x.value === t)?.color  ?? '#44546B'
const typeBg     = (t) => ALL_TYPES.find(x => x.value === t)?.bg     ?? '#EFF3F8'
const typeBorder = (t) => ALL_TYPES.find(x => x.value === t)?.border ?? '#8593A8'
const isPause    = (t) => t?.startsWith('pause_')

const fmtHeure = (h) => h ? h.substring(0, 5).replace(':', 'h') : '--'
const fmtDate  = (d) => {
  if (!d) return '—'
  const date = new Date(String(d).substring(0, 10) + 'T12:00:00')
  if (isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('fr-FR', { weekday:'long', day:'2-digit', month:'long', year:'numeric' })
}

// ── Timeline unifiée ──────────────────────────────────────────────────────────
const timeline = computed(() => {
  if (!audit.value) return []

  const byDate = {}

  // Visites entités
  for (const ae of (audit.value.audits_entites ?? [])) {
    const d = ae.date ? ae.date.substring(0, 10) : '__sans_date__'
    if (!byDate[d]) byDate[d] = []
    byDate[d].push({ _source: 'entite', _ae: ae,
      heure_debut: ae.heure_debut ?? null, heure_fin: ae.heure_fin ?? null })
  }

  // Programme items
  for (const pi of programmeItems.value) {
    const d = pi.date ? pi.date.substring(0, 10) : '__sans_date__'
    if (!byDate[d]) byDate[d] = []
    byDate[d].push({ _source: 'programme', _pi: pi,
      heure_debut: pi.heure_debut ?? null, heure_fin: pi.heure_fin ?? null })
  }

  const result = []
  for (const date of Object.keys(byDate).sort()) {
    const rows = [...byDate[date]].sort((a, b) =>
      (a.heure_debut ?? '99:99').localeCompare(b.heure_debut ?? '99:99'))
    result.push({ _type: 'date', date })
    for (let i = 0; i < rows.length; i++) {
      result.push(rows[i])
    }
  }
  return result
})

// ── SMQ Users (pour auditeurs) ────────────────────────────────────────────────
const smqUsers = ref([])
const chargerUsers = async () => {
  try {
    const token = process.client ? localStorage.getItem('auth_token') : ''
    const h = { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    const res = await $fetch(`${base.value}/users`, { headers: h })
    const raw = res?.data?.data ?? res?.data ?? res ?? []
    const all = Array.isArray(raw) ? raw : Object.values(raw).filter(v => v?.id)
    // Exclure les administrateurs
    smqUsers.value = all.filter(u => {
      const roles = (u.roles ?? []).map(r => r.name ?? r)
      return !roles.includes('administrateur')
    })
  } catch {}
}
onMounted(chargerUsers)

const nomUser = (u) => {
  if (!u) return '—'
  const n = (u.nom ?? '').toUpperCase()
  const p = u.prenom ? u.prenom.charAt(0).toUpperCase() + u.prenom.slice(1).toLowerCase() : ''
  return [n, p].filter(Boolean).join(' ') || u.name || '—'
}

// ── Edition visite entite ─────────────────────────────────────────────────────
const modalVisite = ref(false)
const visiteCourante = ref(null)
const formVisite = reactive({ date: '', heure_debut: '', heure_fin: '', participants: [], chef_id: null })
const savingVisite = ref(false)
const searchAuditeurs = ref('')

const ouvrirVisite = (ae) => {
  visiteCourante.value = ae
  formVisite.date        = ae.date ? ae.date.substring(0, 10) : ''
  formVisite.heure_debut = ae.heure_debut ? ae.heure_debut.substring(0, 5) : ''
  formVisite.heure_fin   = ae.heure_fin   ? ae.heure_fin.substring(0, 5)   : ''
  formVisite.participants = (ae.users ?? []).map(u => u.id)
  // Récupérer le chef d'équipe actuel (pivot is_chef)
  const chefPivot = (ae.users ?? []).find(u => u.pivot?.is_chef)
  formVisite.chef_id = chefPivot?.id ?? null
  searchAuditeurs.value = ''
  modalVisite.value = true
}

// Quand on décoche un participant qui était chef, on réinitialise chef_id
watch(() => formVisite.participants, (ids) => {
  if (formVisite.chef_id && !ids.includes(formVisite.chef_id)) {
    formVisite.chef_id = null
  }
})

const sauvegarderVisite = async () => {
  savingVisite.value = true
  try {
    const token = process.client ? localStorage.getItem('auth_token') : ''
    const h = { Authorization: `Bearer ${token}`, Accept: 'application/json', 'Content-Type': 'application/json' }
    await $fetch(`${base.value}/smq/audit-entites/${visiteCourante.value.id}`, {
      method: 'PUT', headers: h,
      body: { date: formVisite.date || null, heure_debut: formVisite.heure_debut || null, heure_fin: formVisite.heure_fin || null },
    })
    // Toujours envoyer participants + chef_id (même liste vide pour nettoyer)
    await $fetch(`${base.value}/smq/audit-entites/${visiteCourante.value.id}/participants`, {
      method: 'POST', headers: h,
      body: { participants: formVisite.participants, chef_id: formVisite.chef_id ?? null },
    })
    modalVisite.value = false
    await chargerAudit(auditId.value)
  } catch (e) {
    alert(e?.data?.message ?? 'Erreur')
  } finally {
    savingVisite.value = false
  }
}

// ── Ajout programme item / pause ──────────────────────────────────────────────
const modalProgramme = ref(false)
const modeProgramme  = ref('programme')   // 'programme' | 'pause'
const editPi         = ref(null)
const formPi = reactive({
  type: 'reunion_ouverture', date: '', heure_debut: '', heure_fin: '', libelle: '', pilotes_text: '',
})
const savingPi    = ref(false)
const deletingPiId = ref(null)

// Dates ayant au moins une visite ou un programme (non-pause) — seules dates où une pause est permise
const datesAvecActivite = computed(() => {
  const dates = new Set()
  for (const ae of (audit.value?.audits_entites ?? [])) {
    if (ae.date) dates.add(ae.date.substring(0, 10))
  }
  for (const pi of programmeItems.value) {
    if (pi.date && !isPause(pi.type)) dates.add(pi.date.substring(0, 10))
  }
  return dates
})

const pauseJourSansActivite = computed(() =>
  modeProgramme.value === 'pause' && formPi.date && !datesAvecActivite.value.has(formPi.date)
)

const ouvrirAjoutProgramme = (mode = 'programme') => {
  modeProgramme.value = mode
  editPi.value        = null
  const today = new Date().toISOString().substring(0, 10)
  Object.assign(formPi, {
    type: mode === 'pause' ? 'pause_simple' : 'reunion_ouverture',
    date: today, heure_debut: '', heure_fin: '', libelle: '', pilotes_text: '',
  })
  modalProgramme.value = true
}

const ouvrirEditionPi = (pi) => {
  editPi.value = pi
  modeProgramme.value = isPause(pi.type) ? 'pause' : 'programme'
  Object.assign(formPi, {
    type:         pi.type,
    date:         pi.date ? pi.date.substring(0, 10) : '',
    heure_debut:  pi.heure_debut ? pi.heure_debut.substring(0, 5) : '',
    heure_fin:    pi.heure_fin   ? pi.heure_fin.substring(0, 5)   : '',
    libelle:      pi.libelle ?? '',
    pilotes_text: pi.pilotes_text ?? '',
  })
  modalProgramme.value = true
}

const sauvegarderPi = async () => {
  savingPi.value = true
  try {
    const token = process.client ? localStorage.getItem('auth_token') : ''
    const h = { Authorization: `Bearer ${token}`, Accept: 'application/json', 'Content-Type': 'application/json' }
    const body = {
      type:         formPi.type,
      date:         formPi.date,
      heure_debut:  formPi.heure_debut || null,
      heure_fin:    formPi.heure_fin   || null,
      libelle:      formPi.libelle     || null,
      pilotes_text: formPi.pilotes_text || null,
    }
    if (editPi.value) {
      await $fetch(`${base.value}/smq/programme-items/${editPi.value.id}`, { method: 'PUT', headers: h, body })
    } else {
      await $fetch(`${base.value}/smq/audits/${auditId.value}/programme`, { method: 'POST', headers: h, body })
    }
    modalProgramme.value = false
    await chargerProgrammeItems()
  } catch (e) {
    alert(e?.data?.message ?? 'Erreur')
  } finally {
    savingPi.value = false
  }
}

const supprimerPi = async (pi) => {
  if (!confirm(`Supprimer "${typeLabel(pi.type)}" ?`)) return
  deletingPiId.value = pi.id
  try {
    const token = process.client ? localStorage.getItem('auth_token') : ''
    const h = { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    await $fetch(`${base.value}/smq/programme-items/${pi.id}`, { method: 'DELETE', headers: h })
    await chargerProgrammeItems()
  } catch (e) {
    alert(e?.data?.message ?? 'Erreur')
  } finally {
    deletingPiId.value = null
  }
}

// ── PDF ───────────────────────────────────────────────────────────────────────
const telechargerPdf = async () => {
  try {
    const blob = await downloadAuditPdf(auditId.value)
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `Plan_Audit_${audit.value?.titre ?? auditId.value}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  } catch (e) {
    alert('Erreur génération PDF')
  }
}

// ── Style ligne selon type (fond + bordure gauche) ────────────────────────────
const rowStyle = (type) => ({
  background:  typeBg(type),
  boxShadow:   `inset 3px 0 0 ${typeBorder(type)}`,
})

// ── Verrou : planifié = lecture seule ─────────────────────────────────────────
const estPlanifie = computed(() => audit.value?.statut === 'planifie')

// ── Annuler programmation d'une visite ────────────────────────────────────────
const annulationEnCours = ref(false)
const annulerProgrammation = async () => {
  if (!visiteCourante.value) return
  annulationEnCours.value = true
  try {
    const token = process.client ? localStorage.getItem('auth_token') : ''
    const h = { Authorization: `Bearer ${token}`, Accept: 'application/json', 'Content-Type': 'application/json' }
    await $fetch(`${base.value}/smq/audit-entites/${visiteCourante.value.id}`, {
      method: 'PUT', headers: h,
      body: { date: null, heure_debut: null, heure_fin: null },
    })
    await $fetch(`${base.value}/smq/audit-entites/${visiteCourante.value.id}/participants`, {
      method: 'POST', headers: h,
      body: { participants: [], chef_id: null },
    })
    modalVisite.value = false
    await chargerAudit(auditId.value)
  } catch (e) {
    alert(e?.data?.message ?? 'Erreur lors de l\'annulation')
  } finally {
    annulationEnCours.value = false
  }
}
</script>

<template>
  <div class="smq-content">

    <SmqPageHeader
      overline="Audit qualité"
      title="Plan"
    >
      <!-- Sélecteur d'audit -->
      <select v-model="auditId" class="qp-input text-sm" style="min-width:220px">
        <option :value="null">— Choisir un audit —</option>
        <option v-for="a in auditsDisponibles" :key="a.id" :value="a.id">
          {{ a.titre ?? 'Audit #' + a.id }}
        </option>
      </select>
      <button v-if="audit" class="qp-btn qp-btn--ghost" @click="telechargerPdf">
        <Icon name="heroicons:document-arrow-down-20-solid" class="h-4 w-4" />
        PDF
      </button>
    </SmqPageHeader>

    <!-- Aucun audit sélectionné -->
    <div v-if="!auditId" class="text-center py-20" style="color:var(--qp-fg-3)">
      <Icon name="heroicons:calendar-days-20-solid" class="h-14 w-14 mx-auto mb-3 opacity-25" />
      <p class="font-medium">Sélectionnez un audit pour voir son plan</p>
      <button class="qp-btn qp-btn--outline mt-4" @click="router.push('/smq/audit/activite')">
        Aller à Activité
      </button>
    </div>

    <!-- Chargement -->
    <div v-else-if="loading" class="flex justify-center py-16">
      <div class="animate-spin h-8 w-8 rounded-full border-4 border-emerald-500 border-t-transparent"></div>
    </div>

    <!-- Erreur -->
    <div v-else-if="erreur" class="qp-alert qp-alert--danger">{{ erreur }}</div>

    <!-- Contenu plan -->
    <template v-else-if="audit">

      <!-- Info audit -->
      <div class="rounded-2xl border p-4 mb-6 flex items-start justify-between" style="background:#fff;border-color:var(--qp-border-1);box-shadow:0 2px 8px rgba(15,27,45,.07)">
        <div>
          <div class="flex items-center gap-2">
            <span class="font-bold text-lg" style="color:var(--qp-fg-0)">{{ audit.titre ?? 'Audit' }}</span>
            <span class="qp-badge" :class="badgeAuditStatut(audit.statut)">{{ labelAuditStatut(audit.statut) }}</span>
          </div>
          <div class="text-sm mt-1" style="color:var(--qp-fg-3)">
            {{ fmtDate(audit.date_debut) }}
            <span v-if="audit.date_fin"> → {{ fmtDate(audit.date_fin) }}</span>
          </div>
        </div>
        <!-- Boutons ajouter (masqués si planifié) -->
        <div v-if="!estPlanifie" class="flex items-center gap-2 shrink-0 ml-4">
          <button class="qp-btn qp-btn--sm qp-btn--outline flex items-center gap-1" @click="ouvrirAjoutProgramme('programme')">
            <Icon name="heroicons:plus-20-solid" class="h-3.5 w-3.5" />
            Programme
          </button>
          <button class="qp-btn qp-btn--sm qp-btn--outline flex items-center gap-1" @click="ouvrirAjoutProgramme('pause')">
            <Icon name="heroicons:clock-20-solid" class="h-3.5 w-3.5" />
            Pause
          </button>
        </div>
      </div>

      <!-- Bannière verrouillage planifié -->
      <div v-if="estPlanifie" class="qp-alert qp-alert--info mb-4 rounded-xl">
        <Icon name="heroicons:lock-closed-20-solid" class="qp-alert__icon" />
        <div>
          <span class="font-semibold">Plan verrouillé.</span>
          L'audit est passé au statut <strong>Planifié</strong> — aucune modification n'est plus possible sur les visites, pauses et activités du programme.
        </div>
      </div>

      <!-- Timeline unifiée -->
      <div class="rounded-2xl overflow-hidden" style="border:1px solid var(--qp-border-1);box-shadow:0 2px 8px rgba(15,27,45,.07)">

        <!-- En-tête tableau -->
        <div class="grid text-xs font-bold uppercase tracking-wide px-4 py-3" style="grid-template-columns:110px 1fr 180px 100px;background:linear-gradient(180deg,#1E3A5F 0%,#2a4f7a 100%);color:rgba(255,255,255,0.85)">
          <div>Horaire</div>
          <div>Processus / Activité</div>
          <div>Pilotes / Participants</div>
          <div class="text-right">Actions</div>
        </div>

        <!-- Vide -->
        <div v-if="!timeline.length" class="text-center py-10 text-sm" style="color:var(--qp-fg-4)">
          Aucune activité planifiée
        </div>

        <template v-for="(row, i) in timeline" :key="i">

          <!-- Date header -->
          <div
            v-if="row._type === 'date'"
            class="px-4 py-2.5 text-sm font-semibold"
            style="background:linear-gradient(90deg,#EAEFF6,#f0f5fa);border-bottom:2px solid var(--qp-navy-100,#CCD8E8);color:#1E3A5F;letter-spacing:0.01em"
          >
            {{ row.date === '__sans_date__' ? 'Date non définie' : fmtDate(row.date) }}
          </div>

          <!-- Visite entité -->
          <div
            v-else-if="row._source === 'entite'"
            class="grid items-center px-4 py-3 border-b text-sm"
            style="grid-template-columns:110px 1fr 180px 100px;border-color:var(--qp-border-2);background:#fff;box-shadow:inset 3px 0 0 #1F9D52;transition:background 120ms"
            @mouseenter="$event.currentTarget.style.background='#E8F6EE'"
            @mouseleave="$event.currentTarget.style.background='#fff'"
          >
            <div class="font-mono text-xs text-center" style="color:var(--qp-fg-3)">
              <template v-if="row._ae.heure_debut || row._ae.heure_fin">
                {{ fmtHeure(row._ae.heure_debut) }} – {{ fmtHeure(row._ae.heure_fin) }}
              </template>
              <span v-else class="italic opacity-50">—</span>
            </div>
            <div>
              <div class="font-medium" style="color:var(--qp-fg-0)">
                {{ row._ae.entite?.processus?.libelle ?? row._ae.entite?.libelle ?? '—' }}
              </div>
              <div class="text-xs mt-0.5" style="color:var(--qp-fg-3)">{{ row._ae.entite?.libelle }}</div>
            </div>
            <div class="text-xs" style="color:var(--qp-fg-3)">
              <div v-if="row._ae.users?.length">
                <div v-for="u in row._ae.users" :key="u.id">- {{ nomUser(u) }}</div>
              </div>
              <span v-else class="italic opacity-50">—</span>
            </div>
            <div class="flex justify-end">
              <button v-if="!estPlanifie" class="qp-btn qp-btn--sm qp-btn--outline" @click="ouvrirVisite(row._ae)">
                <Icon name="heroicons:pencil-square-20-solid" class="h-3.5 w-3.5" />
              </button>
              <Icon v-else name="heroicons:lock-closed-20-solid" class="h-4 w-4" style="color:var(--qp-fg-4)" />
            </div>
          </div>

          <!-- Programme item ou pause -->
          <div
            v-else-if="row._source === 'programme'"
            class="grid items-center px-4 py-3 border-b text-sm"
            :style="{ ...rowStyle(row._pi.type), borderColor: 'var(--qp-border-2)', gridTemplateColumns: '110px 1fr 180px 100px' }"
          >
            <div class="font-mono text-xs text-center" style="color:var(--qp-fg-3)">
              <template v-if="row._pi.heure_debut || row._pi.heure_fin">
                {{ fmtHeure(row._pi.heure_debut) }} – {{ fmtHeure(row._pi.heure_fin) }}
              </template>
              <span v-else class="italic opacity-50">—</span>
            </div>
            <div>
              <div class="font-semibold" :style="{ color: typeColor(row._pi.type) }">
                {{ typeLabel(row._pi.type) }}
              </div>
              <div v-if="row._pi.libelle" class="text-xs mt-0.5 italic" style="color:var(--qp-fg-3)">
                {{ row._pi.libelle }}
              </div>
            </div>
            <div class="text-xs" style="color:var(--qp-fg-3)">
              {{ row._pi.pilotes_text || (isPause(row._pi.type) ? '' : '—') }}
            </div>
            <div class="flex justify-end gap-1">
              <template v-if="!estPlanifie">
                <button class="qp-btn qp-btn--sm qp-btn--outline" @click="ouvrirEditionPi(row._pi)">
                  <Icon name="heroicons:pencil-square-20-solid" class="h-3.5 w-3.5" />
                </button>
                <button class="qp-btn qp-btn--sm qp-btn--danger-outline" :disabled="deletingPiId === row._pi.id" @click="supprimerPi(row._pi)">
                  <Icon v-if="deletingPiId === row._pi.id" name="heroicons:arrow-path-20-solid" class="h-3.5 w-3.5 animate-spin" />
                  <Icon v-else name="heroicons:trash-20-solid" class="h-3.5 w-3.5" />
                </button>
              </template>
              <Icon v-else name="heroicons:lock-closed-20-solid" class="h-4 w-4" style="color:var(--qp-fg-4)" />
            </div>
          </div>

        </template>
      </div>
    </template>

    <!-- ══ MODAL VISITE ENTITE ════════════════════════════════════════════════ -->
    <Teleport to="body">
      <div v-if="modalVisite" class="fixed inset-0 z-50 flex items-center justify-center px-4" style="background:rgba(0,0,0,.45)">
        <div class="w-full max-w-md rounded-2xl shadow-2xl" style="background:#fff">
          <div class="flex items-center justify-between px-6 py-4 border-b" style="border-color:var(--qp-border-1)">
            <h2 class="text-base font-bold" style="color:var(--qp-fg-0)">
              Programmer la visite — {{ visiteCourante?.entite?.libelle ?? '' }}
            </h2>
            <button @click="modalVisite = false" class="p-1 rounded-lg hover:bg-gray-100">
              <Icon name="heroicons:x-mark-20-solid" class="h-5 w-5" style="color:var(--qp-fg-3)" />
            </button>
          </div>
          <div class="px-6 py-5 space-y-4">
            <div>
              <label class="qp-label">Processus</label>
              <div class="mt-1 text-sm font-medium" style="color:var(--qp-fg-1)">
                {{ visiteCourante?.entite?.processus?.libelle ?? visiteCourante?.entite?.libelle ?? '—' }}
              </div>
            </div>
            <div>
              <label class="qp-label">Date</label>
              <input v-model="formVisite.date" type="date" class="qp-input w-full mt-1" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="qp-label">Heure début</label>
                <input v-model="formVisite.heure_debut" type="time" class="qp-input w-full mt-1" />
              </div>
              <div>
                <label class="qp-label">Heure fin</label>
                <input v-model="formVisite.heure_fin" type="time" class="qp-input w-full mt-1" />
              </div>
            </div>
            <div>
              <label class="qp-label mb-1 block">Auditeurs</label>
              <!-- Badges des auditeurs sélectionnés -->
              <div v-if="formVisite.participants.length" class="flex flex-wrap gap-1.5 mb-2">
                <span
                  v-for="uid in formVisite.participants"
                  :key="uid"
                  class="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
                  style="background:var(--qp-primary-100);color:var(--qp-primary-700)"
                >
                  {{ nomUser(smqUsers.find(u => u.id === uid)) }}
                  <button type="button" @click="formVisite.participants = formVisite.participants.filter(id => id !== uid)" class="ml-0.5 hover:opacity-70">
                    <Icon name="heroicons:x-mark-16-solid" class="h-3 w-3" />
                  </button>
                </span>
              </div>
              <input
                v-model="searchAuditeurs"
                type="text"
                class="qp-input w-full mb-1"
                placeholder="Rechercher…"
                style="font-size:0.8rem;padding:4px 8px"
              />
              <div class="rounded-lg border p-2 space-y-1 max-h-36 overflow-y-auto" style="border-color:var(--qp-border-2);background:#f9fafb">
                <label
                  v-for="u in smqUsers.filter(u => nomUser(u).toLowerCase().includes(searchAuditeurs.toLowerCase()))"
                  :key="u.id"
                  class="flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-white text-sm"
                >
                  <input type="checkbox" :value="u.id" v-model="formVisite.participants"
                    style="accent-color:var(--qp-primary-500);width:13px;height:13px" />
                  {{ nomUser(u) }}
                </label>
                <div v-if="!smqUsers.filter(u => nomUser(u).toLowerCase().includes(searchAuditeurs.toLowerCase())).length"
                     class="text-xs text-center py-2" style="color:var(--qp-fg-4)">
                  Aucun résultat
                </div>
              </div>
            </div>

            <!-- Chef d'équipe -->
            <div v-if="formVisite.participants.length">
              <label class="qp-label mb-1 block">
                <Icon name="heroicons:star-20-solid" class="h-3.5 w-3.5 inline mr-1 text-amber-500" />
                Chef d'équipe
              </label>
              <AppSelectSearch
                :options="smqUsers
                  .filter(u => formVisite.participants.includes(u.id))
                  .map(u => ({ label: nomUser(u), value: u.id }))"
                :model-value="formVisite.chef_id"
                placeholder="Rechercher un auditeur…"
                @update:model-value="formVisite.chef_id = $event"
              />
              <p class="text-xs mt-1" style="color:var(--qp-fg-4)">
                Le chef d'équipe accède à la saisie de la restitution pour ce processus.
              </p>
            </div>
          </div>
          <div class="flex items-center justify-between px-6 py-4 border-t" style="border-color:var(--qp-border-1)">
            <!-- Annuler la programmation (vide la date, l'heure et les participants) -->
            <button
              v-if="visiteCourante && (visiteCourante.date || visiteCourante.heure_debut || visiteCourante.users?.length)"
              class="qp-btn qp-btn--danger-outline qp-btn--sm flex items-center gap-1.5"
              :disabled="annulationEnCours"
              @click="annulerProgrammation"
            >
              <Icon v-if="annulationEnCours" name="heroicons:arrow-path-20-solid" class="h-4 w-4 animate-spin" />
              <Icon v-else name="heroicons:x-circle-20-solid" class="h-4 w-4" />
              {{ annulationEnCours ? 'Annulation…' : 'Annuler la programmation' }}
            </button>
            <div v-else />

            <div class="flex gap-2.5">
              <button class="qp-btn qp-btn--outline qp-btn--sm" @click="modalVisite = false">Fermer</button>
              <button class="qp-btn qp-btn--primary qp-btn--sm flex items-center gap-2" :disabled="savingVisite" @click="sauvegarderVisite">
                <Icon v-if="savingVisite" name="heroicons:arrow-path-20-solid" class="h-4 w-4 animate-spin" />
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ══ MODAL PROGRAMME / PAUSE ════════════════════════════════════════════ -->
    <Teleport to="body">
      <div v-if="modalProgramme" class="fixed inset-0 z-50 flex items-center justify-center px-4" style="background:rgba(0,0,0,.45)">
        <div class="w-full max-w-md rounded-2xl shadow-2xl" style="background:#fff">
          <div class="flex items-center justify-between px-6 py-4 border-b" style="border-color:var(--qp-border-1)">
            <h2 class="text-base font-bold" style="color:var(--qp-fg-0)">
              {{ editPi ? 'Modifier' : (modeProgramme === 'pause' ? 'Ajouter une pause' : 'Ajouter au programme') }}
            </h2>
            <button @click="modalProgramme = false" class="p-1 rounded-lg hover:bg-gray-100">
              <Icon name="heroicons:x-mark-20-solid" class="h-5 w-5" style="color:var(--qp-fg-3)" />
            </button>
          </div>
          <div class="px-6 py-5 space-y-4">

            <!-- Type -->
            <div>
              <label class="qp-label">Type</label>
              <div class="grid grid-cols-2 gap-2 mt-1">
                <template v-if="modeProgramme === 'pause'">
                  <button
                    v-for="t in TYPES_PAUSE" :key="t.value"
                    class="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all"
                    :class="formPi.type === t.value ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 hover:border-gray-300'"
                    @click="formPi.type = t.value"
                  >
                    <Icon :name="t.icon" class="h-4 w-4 shrink-0" :style="{ color: t.color }" />
                    {{ t.label }}
                  </button>
                </template>
                <template v-else>
                  <button
                    v-for="t in TYPES_PROGRAMME" :key="t.value"
                    class="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all"
                    :class="formPi.type === t.value ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 hover:border-gray-300'"
                    @click="formPi.type = t.value"
                  >
                    <Icon :name="t.icon" class="h-4 w-4 shrink-0" :style="{ color: t.color }" />
                    {{ t.label }}
                  </button>
                </template>
              </div>
            </div>

            <!-- Date + Horaires -->
            <div>
              <label class="qp-label">Date</label>
              <input v-model="formPi.date" type="date" class="qp-input w-full mt-1" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="qp-label">Heure début</label>
                <input v-model="formPi.heure_debut" type="time" class="qp-input w-full mt-1" />
              </div>
              <div>
                <label class="qp-label">Heure fin</label>
                <input v-model="formPi.heure_fin" type="time" class="qp-input w-full mt-1" />
              </div>
            </div>

            <!-- Libellé (seulement si non-pause) -->
            <div v-if="modeProgramme !== 'pause'">
              <label class="qp-label">Libellé (optionnel)</label>
              <input v-model="formPi.libelle" class="qp-input w-full mt-1" placeholder="Description…" />
            </div>

            <!-- Pilotes (seulement si non-pause) -->
            <div v-if="modeProgramme !== 'pause'">
              <label class="qp-label">Pilotes / Participants</label>
              <input v-model="formPi.pilotes_text" class="qp-input w-full mt-1"
                placeholder="RQ, CCIQ, Pilotes, auditeurs internes…" />
            </div>

          </div>

          <!-- Avertissement pause sans activité -->
          <div v-if="pauseJourSansActivite" class="mx-6 mb-3 px-3 py-2 rounded-lg text-sm flex items-start gap-2" style="background:#fef3c7;color:#92400e">
            <Icon name="heroicons:exclamation-triangle-20-solid" class="h-4 w-4 shrink-0 mt-0.5" />
            Aucune visite ni programme n'est prévu le {{ formPi.date }}. Planifiez d'abord une visite ou un élément de programme pour ce jour.
          </div>

          <div class="flex justify-end gap-3 px-6 py-4 border-t" style="border-color:var(--qp-border-1)">
            <button class="qp-btn qp-btn--outline" @click="modalProgramme = false">Annuler</button>
            <button
              class="qp-btn qp-btn--primary flex items-center gap-2"
              :disabled="savingPi || pauseJourSansActivite"
              @click="sauvegarderPi"
            >
              <Icon v-if="savingPi" name="heroicons:arrow-path-20-solid" class="h-4 w-4 animate-spin" />
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>
