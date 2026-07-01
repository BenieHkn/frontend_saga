<script setup>

import { usePaq }            from '~/composables/smq/usePaq'
import { useReferentiels }   from '~/composables/smq/useReferentiels'
import { useSmqPermissions } from '~/composables/smq/useSmqPermissions'
import { useAuth }           from '~/composables/auth/useAuth'
import Swal                  from 'sweetalert2'

const config = useRuntimeConfig()
const base   = computed(() => config.public.apiBase)
const route  = useRoute()
const router = useRouter()

const { fetchAudits, createAudit, updateAudit, deleteAudit, planifierAudit, realiserAudit, AUDIT_STATUTS, badgeAuditStatut, labelAuditStatut } = usePaq()

// ── Permissions ───────────────────────────────────────────────────────────────
const { estRQ, estRQA, estAdminSmq } = useSmqPermissions()
const { isAdmin } = useAuth()
const estPrivilegié = computed(() => estRQ.value || estRQA.value || estAdminSmq.value || isAdmin())

// ── Téléchargement rapport général ────────────────────────────────────────────
const telechargementRapport = ref(null) // auditId en cours de téléchargement

const telechargerRapportGeneral = async (audit) => {
  telechargementRapport.value = audit.id
  try {
    const token = process.client ? localStorage.getItem('auth_token') : ''
    const response = await fetch(`${base.value}/smq/audits/${audit.id}/rapport-general`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) throw new Error(await response.text())
    const blob = await response.blob()
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url
    a.download = `Rapport_${(audit.titre ?? 'audit').replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  } catch {
    alert('Impossible de télécharger le rapport PDF')
  } finally {
    telechargementRapport.value = null
  }
}

// ── Etat liste ────────────────────────────────────────────────────────────────
const loading  = ref(true)
const audits   = ref([])
const erreur   = ref(null)

// ── Exercices ─────────────────────────────────────────────────────────────────
const exercices      = ref([])
const exerciceActif  = ref(null)

const chargerExercices = async () => {
  const token = process.client ? localStorage.getItem('auth_token') : ''
  const h     = { Authorization: `Bearer ${token}`, Accept: 'application/json' }
  const res   = await $fetch(`${base.value}/smq/exercices`, { headers: h })
  exercices.value = res?.data ?? res ?? []
  exerciceActif.value = exercices.value.find(e => e.actif) ?? exercices.value[0] ?? null
}

// ── Referentiels ──────────────────────────────────────────────────────────────
const typesAudit       = ref([])
const observateurs     = ref([])
const sitesAudites     = ref([])
const smqUsers         = ref([])
const entitesDisponibles = ref([])   // entités auditables (processus + entite)

const chargerReferentiels = async () => {
  const token = process.client ? localStorage.getItem('auth_token') : ''
  const h = { Authorization: `Bearer ${token}`, Accept: 'application/json' }
  try {
    const [ta, obs, sa, ent, users] = await Promise.all([
      $fetch(`${base.value}/smq/types-audits`,   { headers: h }),
      $fetch(`${base.value}/smq/observateurs`,   { headers: h }),
      $fetch(`${base.value}/smq/sites-audites`,  { headers: h }),
      $fetch(`${base.value}/smq/entites-auditables`, { headers: h }),
      $fetch(`${base.value}/users`,              { headers: h }),
    ])
    typesAudit.value     = (ta?.data  ?? ta  ?? []).filter(i => i.actif !== false)
    observateurs.value   = (obs?.data ?? obs ?? []).filter(i => i.actif !== false)
    sitesAudites.value   = (sa?.data  ?? sa  ?? []).filter(i => i.actif !== false)
    entitesDisponibles.value = (ent?.data ?? ent ?? [])
    const raw = users?.data?.data ?? users?.data ?? users ?? []
    smqUsers.value = Array.isArray(raw) ? raw : Object.values(raw).filter(v => v?.id)
  } catch (e) {
    console.error('Referentiels:', e)
  }
}

// ── Charger audits ────────────────────────────────────────────────────────────
const charger = async () => {
  if (!exerciceActif.value) return
  loading.value = true
  try {
    audits.value = (await fetchAudits({ exercice_id: exerciceActif.value.id, per_page: 50 })).filter(Boolean)
  } catch (e) {
    erreur.value = e?.data?.message ?? 'Erreur chargement audits'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    await chargerExercices()
    await Promise.all([charger(), chargerReferentiels()])
  } catch (e) {
    console.error('Init activite:', e)
    loading.value = false
  }
})

watch(exerciceActif, charger)

// ── Modal ─────────────────────────────────────────────────────────────────────
const modalOuvert  = ref(false)
const modeEdition  = ref(false)
const auditEdite   = ref(null)
const saving       = ref(false)
const erreurSave   = ref(null)

const DEFAULTS = {
  titre: '', referentiel: 'ISO 9001:2015', type_audit_id: null, objectifs: '',
  observateur_id: null, site_ids: [], superviseurs_ids: [], entite_ids: [],
  date_debut: '', date_fin: '', statut: 'a_planifier', criteres_audit: '',
}

const form = reactive({ ...DEFAULTS })

// Audit en cours = non réalisé sur l'exercice actif
const auditNonRealise = computed(() =>
  audits.value.find(a => a.statut !== 'realise')
)

const ouvrirCreation = () => {
  if (auditNonRealise.value) {
    Swal.fire({
      icon:  'warning',
      title: 'Audit en cours',
      html:  `Un audit est déjà en cours (<strong>${labelAuditStatut(auditNonRealise.value.statut)}</strong>).<br>
              Veuillez le clôturer avant d'en créer un nouveau.`,
      confirmButtonText: 'Compris',
      confirmButtonColor: '#1F8C49',
    })
    return
  }
  Object.assign(form, DEFAULTS)
  if (exerciceActif.value) form.exercice_id = exerciceActif.value.id
  modeEdition.value = false
  auditEdite.value  = null
  erreurSave.value  = null
  modalOuvert.value = true
}

const ouvrirEdition = (audit) => {
  Object.assign(form, {
    exercice_id:      audit.exercice_id ?? exerciceActif.value?.id,
    titre:            audit.titre ?? '',
    referentiel:      'ISO 9001:2015',
    type_audit_id:    audit.type_audit_id ?? audit.type_audit?.id ?? null,
    objectifs:        audit.objectifs ?? '',
    observateur_id:   audit.observateur_id ?? audit.observateur?.id ?? null,
    site_ids:         (audit.sites ?? []).map(s => s.id),
    superviseurs_ids: (audit.superviseurs ?? []).map(u => u.id),
    entite_ids:       (audit.audits_entites ?? []).map(ae => ae.entite_id ?? ae.entite?.id).filter(Boolean),
    date_debut:       audit.date_debut ? audit.date_debut.substring(0, 10) : '',
    date_fin:         audit.date_fin   ? audit.date_fin.substring(0, 10)   : '',
    statut:           audit.statut ?? 'en_cours',
    criteres_audit:   audit.criteres_audit ?? '',
  })
  modeEdition.value = true
  auditEdite.value  = audit
  erreurSave.value  = null
  modalOuvert.value = true
}

const fermerModal = () => {
  modalOuvert.value        = false
  rechercheProcessus.value    = ''
  rechercheSuperviseurs.value = ''
}

const sauvegarder = async (forcerStatut = null) => {
  saving.value     = true
  erreurSave.value = null
  try {
    const payload = { ...form, statut: forcerStatut ?? form.statut }
    if (modeEdition.value) {
      await updateAudit(auditEdite.value.id, payload)
    } else {
      await createAudit(payload)
    }
    fermerModal()
    await charger()
  } catch (e) {
    erreurSave.value = e?.data?.message ?? e?.data?.errors
      ? Object.values(e.data.errors).flat().join(' · ')
      : 'Erreur lors de l\'enregistrement'
  } finally {
    saving.value = false
  }
}

const transitionEnCours = ref(null)

const terminerPlanification = async (audit) => {
  transitionEnCours.value = audit.id
  try {
    await planifierAudit(audit.id)
    await charger()
  } catch (e) {
    alert(e?.data?.message ?? 'Erreur lors de la transition')
  } finally {
    transitionEnCours.value = null
  }
}

const marquerRealise = async (audit) => {
  transitionEnCours.value = audit.id
  try {
    await realiserAudit(audit.id)
    await charger()
  } catch (e) {
    alert(e?.data?.message ?? 'Erreur lors de la transition')
  } finally {
    transitionEnCours.value = null
  }
}

// ── Suppression ───────────────────────────────────────────────────────────────
const confirmSuppr = ref(null)

const confirmerSuppression = (audit) => { confirmSuppr.value = audit }

const supprimerAudit = async () => {
  if (!confirmSuppr.value) return
  try {
    await deleteAudit(confirmSuppr.value.id)
    await charger()
  } catch (e) {
    alert(e?.data?.message ?? 'Erreur suppression')
  } finally {
    confirmSuppr.value = null
  }
}

// ── Navigation vers le Plan ───────────────────────────────────────────────────
const allerAuPlan = (audit) => router.push(`/smq/audit/plan?audit_id=${audit.id}`)

// ── Référentiels standards ────────────────────────────────────────────────────
const REFERENTIELS_STANDARDS = [
  'ISO 9001:2015',
  'ISO 14001:2015',
  'ISO 45001:2018',
  'ISO 27001:2022',
  'ISO 50001:2018',
  'IATF 16949',
  'ISO 17025:2017',
  'ISO 22000:2018',
  'ISO 31000:2018',
  'Autre',
]

// ── Plier / Déplier cartes (fermé par défaut) ─────────────────────────────────
const cardsOuvertes = reactive({})

const toggleCard = (auditId) => {
  cardsOuvertes[auditId] = !cardsOuvertes[auditId]
}

// Une carte est repliée si elle n'a pas été explicitement ouverte
const estRepliee = (auditId) => !cardsOuvertes[auditId]

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' }) : '—'

const entiteParId = (id) => entitesDisponibles.value.find(e => e.id === id)

const toggleEntite = (id) => {
  const idx = form.entite_ids.indexOf(id)
  if (idx === -1) form.entite_ids.push(id)
  else form.entite_ids.splice(idx, 1)
}

const toggleSuperviseur = (id) => {
  const idx = form.superviseurs_ids.indexOf(id)
  if (idx === -1) form.superviseurs_ids.push(id)
  else form.superviseurs_ids.splice(idx, 1)
}

const nomUser = (u) => {
  if (!u) return '—'
  const n = (u.nom ?? '').toUpperCase()
  const p = u.prenom ? u.prenom.charAt(0).toUpperCase() + u.prenom.slice(1).toLowerCase() : ''
  return [n, p].filter(Boolean).join(' ') || u.name || '—'
}

const nomEntite = (e) => e?.processus?.libelle ?? e?.libelle ?? '—'

// ── Recherche dans les listes ─────────────────────────────────────────────────
const rechercheProcessus    = ref('')
const rechercheSuperviseurs = ref('')

const entitesFiltrees = computed(() => {
  const q = rechercheProcessus.value.toLowerCase().trim()
  if (!q) return entitesDisponibles.value
  return entitesDisponibles.value.filter(e =>
    nomEntite(e).toLowerCase().includes(q) || (e.libelle ?? '').toLowerCase().includes(q)
  )
})

const superviseursFiltres = computed(() => {
  const q = rechercheSuperviseurs.value.toLowerCase().trim()
  if (!q) return smqUsers.value
  return smqUsers.value.filter(u => nomUser(u).toLowerCase().includes(q))
})

const entitesSelectionnees  = computed(() => entitesDisponibles.value.filter(e => form.entite_ids.includes(e.id)))
const superviseursSelectionnes = computed(() => smqUsers.value.filter(u => form.superviseurs_ids.includes(u.id)))
</script>

<template>
  <div class="smq-content">

    <SmqPageHeader
      overline="Audit qualité"
      title="Activité"
    >
      <!-- Sélecteur exercice -->
      <select
        v-model="exerciceActif"
        class="qp-input text-sm"
        style="min-width:160px"
        @change="charger"
      >
        <option v-for="ex in exercices" :key="ex.id" :value="ex">
          {{ ex.libelle ?? ex.annee }}{{ ex.actif ? ' (actif)' : '' }}
        </option>
      </select>
      <button v-if="estPrivilegié" class="qp-btn qp-btn--ghost flex items-center gap-2" @click="ouvrirCreation">
        <Icon name="heroicons:plus-20-solid" class="h-4 w-4" />
        Nouvel audit
      </button>
    </SmqPageHeader>

    <!-- Chargement -->
    <div v-if="loading" class="flex justify-center py-16">
      <div class="animate-spin h-8 w-8 rounded-full border-4 border-emerald-500 border-t-transparent"></div>
    </div>

    <!-- Erreur -->
    <div v-else-if="erreur" class="qp-alert qp-alert--danger">{{ erreur }}</div>

    <!-- Vide -->
    <div v-else-if="!audits.length" class="text-center py-16" style="color:var(--qp-fg-3)">
      <Icon name="heroicons:magnifying-glass-circle-20-solid" class="h-12 w-12 mx-auto mb-3 opacity-30" />
      <p class="font-medium">Aucun audit pour cet exercice</p>
      <button class="qp-btn qp-btn--primary mt-4" @click="ouvrirCreation">Créer le premier audit</button>
    </div>

    <!-- Liste audits -->
    <div v-else class="space-y-4">
      <div
        v-for="audit in audits"
        :key="audit.id"
        class="rounded-2xl overflow-hidden"
        style="background:#fff;border:1px solid var(--qp-border-1);box-shadow:0 2px 8px rgba(15,27,45,.07),0 1px 2px rgba(15,27,45,.04);transition:box-shadow 200ms,transform 200ms;"
      >
        <!-- Bande de statut supérieure -->
        <div
          class="h-1.5 w-full"
          :style="{
            background: audit.statut === 'realise' ? 'linear-gradient(90deg,#059669,#0e9b8e)'
                       : audit.statut === 'planifie' ? 'linear-gradient(90deg,#2575c2,#0e9b8e)'
                       : audit.statut === 'en_cours_de_planification' ? 'linear-gradient(90deg,#c07f12,#d97706)'
                       : 'linear-gradient(90deg,var(--qp-n-200),var(--qp-n-300))'
          }"
        />
        <!-- Entête carte -->
        <div class="flex items-start justify-between px-5 py-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-bold text-base" style="color:var(--qp-fg-1)">
                {{ audit.titre ?? 'Audit sans titre' }}
              </span>
              <span class="qp-badge" :class="badgeAuditStatut(audit.statut)">
                {{ labelAuditStatut(audit.statut) }}
              </span>
            </div>
            <div class="text-sm mt-1" style="color:var(--qp-fg-3)">
              <Icon name="heroicons:calendar-days-20-solid" class="h-3.5 w-3.5 inline -mt-0.5 mr-0.5" />
              {{ fmtDate(audit.date_debut) }} → {{ fmtDate(audit.date_fin) }}
              <span v-if="audit.type_audit?.libelle"> · {{ audit.type_audit.libelle }}</span>
            </div>
            <div v-if="audit.referentiel" class="text-xs mt-0.5" style="color:var(--qp-fg-4)">
              {{ audit.referentiel }}
            </div>
          </div>
          <!-- Actions -->
          <div class="flex items-center gap-2 ml-4 shrink-0 flex-wrap justify-end">
            <!-- Terminer la planification -->
            <button
              v-if="audit.statut === 'en_cours_de_planification'"
              class="qp-btn qp-btn--sm qp-btn--primary flex items-center gap-1"
              :disabled="transitionEnCours === audit.id"
              @click="terminerPlanification(audit)"
            >
              <Icon v-if="transitionEnCours === audit.id" name="heroicons:arrow-path-20-solid" class="h-4 w-4 animate-spin" />
              <Icon v-else name="heroicons:check-circle-20-solid" class="h-4 w-4" />
              Terminer la planification
            </button>
            <!-- Planifier / Voir la planification -->
            <button
              v-if="audit.statut !== 'realise'"
              class="qp-btn qp-btn--sm qp-btn--outline flex items-center gap-1"
              @click="allerAuPlan(audit)"
            >
              <Icon name="heroicons:calendar-days-20-solid" class="h-4 w-4" />
              {{ audit.statut === 'planifie' ? 'Voir la planification' : 'Planifier' }}
            </button>
            <!-- Modifier (masqué si planifié ou réalisé) -->
            <button
              v-if="audit.statut === 'a_planifier' || audit.statut === 'en_cours_de_planification'"
              class="qp-btn qp-btn--sm qp-btn--outline flex items-center gap-1"
              @click="ouvrirEdition(audit)"
            >
              <Icon name="heroicons:pencil-square-20-solid" class="h-4 w-4" />
              Modifier
            </button>
            <!-- Rapport général PDF (RQ/RQA/admin, audit réalisé) -->
            <button
              v-if="estPrivilegié && audit.statut === 'realise'"
              class="qp-btn qp-btn--sm qp-btn--outline flex items-center gap-1"
              :disabled="telechargementRapport === audit.id"
              title="Télécharger le rapport général"
              @click="telechargerRapportGeneral(audit)"
            >
              <Icon
                v-if="telechargementRapport === audit.id"
                name="heroicons:arrow-path-20-solid"
                class="h-4 w-4 animate-spin"
              />
              <Icon v-else name="heroicons:document-arrow-down-20-solid" class="h-4 w-4" />
              Rapport PDF
            </button>
            <!-- Supprimer (masqué si planifié ou réalisé) -->
            <button
              v-if="audit.statut === 'a_planifier' || audit.statut === 'en_cours_de_planification'"
              class="qp-btn qp-btn--sm qp-btn--danger-outline"
              title="Supprimer"
              @click="confirmerSuppression(audit)"
            >
              <Icon name="heroicons:trash-20-solid" class="h-4 w-4" />
            </button>
            <!-- Flèche plier / déplier -->
            <button
              class="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              :title="estRepliee(audit.id) ? 'Déplier' : 'Replier'"
              @click="toggleCard(audit.id)"
            >
              <Icon
                :name="estRepliee(audit.id) ? 'heroicons:chevron-down-20-solid' : 'heroicons:chevron-up-20-solid'"
                class="h-5 w-5 transition-transform"
                style="color:var(--qp-fg-3)"
              />
            </button>
          </div>
        </div>

        <!-- Processus sélectionnés -->
        <div v-if="!estRepliee(audit.id)">
          <div
            v-if="audit.audits_entites?.length"
            class="px-5 pb-4 flex flex-wrap gap-2"
          >
            <div
              v-for="ae in audit.audits_entites"
              :key="ae.id"
              class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm"
              style="background:#f1f5f9;color:var(--qp-n-700);border:1px solid #e2e8f0"
            >
              <span class="font-medium">{{ ae.entite?.processus?.libelle ?? ae.entite?.libelle ?? '—' }}</span>
              <span class="text-xs opacity-60">{{ ae.entite?.libelle }}</span>
            </div>
          </div>
          <div v-else class="px-5 pb-3 text-sm" style="color:var(--qp-fg-4)">
            Aucun processus sélectionné — <button class="underline" @click="ouvrirEdition(audit)">ajouter</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ MODAL CREATION / EDITION ══════════════════════════════════════════ -->
    <Teleport to="body">
      <div v-if="modalOuvert" class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4" style="background:rgba(0,0,0,.45)">
        <div class="w-full max-w-2xl rounded-2xl shadow-2xl" style="background:#fff">

          <!-- Header modal -->
          <div class="flex items-center justify-between px-6 py-4 border-b" style="border-color:var(--qp-border-1)">
            <h2 class="text-lg font-bold" style="color:var(--qp-fg-0)">
              {{ modeEdition ? 'Modifier l\'audit' : 'Nouvel audit' }}
            </h2>
            <button @click="fermerModal" class="p-1 rounded-lg hover:bg-gray-100">
              <Icon name="heroicons:x-mark-20-solid" class="h-5 w-5" style="color:var(--qp-fg-3)" />
            </button>
          </div>

          <!-- Corps modal -->
          <div class="px-6 py-5 space-y-5 max-h-[75vh] overflow-y-auto">

            <!-- Titre -->
            <div>
              <label class="qp-label">Titre de l'audit</label>
              <input v-model="form.titre" class="qp-input w-full mt-1" placeholder="1er Audit qualité interne…" />
            </div>

            <!-- Période -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="qp-label">Date début <span class="text-red-500">*</span></label>
                <input v-model="form.date_debut" type="date" class="qp-input w-full mt-1" />
              </div>
              <div>
                <label class="qp-label">Date fin</label>
                <input v-model="form.date_fin" type="date" class="qp-input w-full mt-1" />
              </div>
            </div>

            <!-- Type audit -->
            <div>
              <label class="qp-label">Type d'audit</label>
              <select v-model="form.type_audit_id" class="qp-input w-full mt-1">
                <option :value="null">— Choisir —</option>
                <option v-for="t in typesAudit" :key="t.id" :value="t.id">{{ t.libelle }}</option>
              </select>
            </div>

            <!-- Objectifs -->
            <div>
              <label class="qp-label">Objectifs d'audit</label>
              <textarea v-model="form.objectifs" class="qp-input w-full mt-1" rows="3" placeholder="Objectif général…"></textarea>
            </div>

            <!-- Processus à auditer -->
            <div>
              <label class="qp-label mb-1 block">Processus à auditer</label>
              <!-- Badges des processus sélectionnés -->
              <div v-if="entitesSelectionnees.length" class="flex flex-wrap gap-1.5 mb-2">
                <span
                  v-for="e in entitesSelectionnees"
                  :key="e.id"
                  class="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm"
                  style="background:#f1f5f9;color:var(--qp-n-700);border:1px solid #e2e8f0"
                >
                  {{ nomEntite(e) }}
                  <button type="button" @click="toggleEntite(e.id)" class="ml-0.5 hover:opacity-70">
                    <Icon name="heroicons:x-mark-16-solid" class="h-3 w-3" />
                  </button>
                </span>
              </div>
              <!-- Recherche -->
              <input
                v-model="rechercheProcessus"
                class="qp-input w-full mb-1"
                placeholder="Rechercher un processus…"
              />
              <div class="rounded-lg border p-2 space-y-1 max-h-40 overflow-y-auto" style="border-color:var(--qp-border-2);background:var(--qp-n-25)">
                <label
                  v-for="entite in entitesFiltrees"
                  :key="entite.id"
                  class="flex items-center gap-3 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-white transition-colors"
                >
                  <input
                    type="checkbox"
                    :checked="form.entite_ids.includes(entite.id)"
                    class="rounded"
                    @change="toggleEntite(entite.id)"
                  />
                  <span class="text-sm" style="color:var(--qp-fg-1)">{{ nomEntite(entite) }}</span>
                  <span v-if="entite.libelle" class="text-xs" style="color:var(--qp-fg-3)">{{ entite.libelle }}</span>
                </label>
                <div v-if="!entitesFiltrees.length" class="text-sm text-center py-2" style="color:var(--qp-fg-3)">
                  Aucun processus trouvé
                </div>
              </div>
            </div>

            <!-- Superviseurs / Auditeurs -->
            <div>
              <label class="qp-label mb-1 block">Auditeurs / Superviseurs</label>
              <div v-if="superviseursSelectionnes.length" class="flex flex-wrap gap-1.5 mb-2">
                <span
                  v-for="u in superviseursSelectionnes"
                  :key="u.id"
                  class="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
                  style="background:var(--qp-n-100);color:var(--qp-fg-2)"
                >
                  {{ nomUser(u) }}
                  <button type="button" @click="toggleSuperviseur(u.id)" class="ml-0.5 hover:opacity-70">
                    <Icon name="heroicons:x-mark-16-solid" class="h-3 w-3" />
                  </button>
                </span>
              </div>
              <input
                v-model="rechercheSuperviseurs"
                class="qp-input w-full mb-1"
                placeholder="Rechercher un auditeur…"
              />
              <div class="rounded-lg border p-2 space-y-1 max-h-32 overflow-y-auto" style="border-color:var(--qp-border-2);background:var(--qp-n-25)">
                <label
                  v-for="u in superviseursFiltres"
                  :key="u.id"
                  class="flex items-center gap-3 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-white transition-colors"
                >
                  <input
                    type="checkbox"
                    :checked="form.superviseurs_ids.includes(u.id)"
                    class="rounded"
                    @change="toggleSuperviseur(u.id)"
                  />
                  <span class="text-sm" style="color:var(--qp-fg-1)">{{ nomUser(u) }}</span>
                </label>
                <div v-if="!superviseursFiltres.length" class="text-sm text-center py-2" style="color:var(--qp-fg-3)">
                  Aucun utilisateur trouvé
                </div>
              </div>
            </div>

            <!-- Observateur -->
            <div>
              <label class="qp-label">Observateur</label>
              <select v-model="form.observateur_id" class="qp-input w-full mt-1">
                <option :value="null">— Aucun —</option>
                <option v-for="o in observateurs" :key="o.id" :value="o.id">{{ o.nom ?? o.libelle }}</option>
              </select>
            </div>

            <!-- Sites -->
            <div>
              <label class="qp-label">Sites audités</label>
              <div class="rounded-lg border p-2 space-y-1 mt-1 max-h-32 overflow-y-auto" style="border-color:var(--qp-border-2);background:var(--qp-n-25)">
                <label
                  v-for="s in sitesAudites"
                  :key="s.id"
                  class="flex items-center gap-3 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-white transition-colors"
                >
                  <input
                    type="checkbox"
                    :checked="form.site_ids.includes(s.id)"
                    class="rounded"
                    @change="form.site_ids.includes(s.id) ? form.site_ids.splice(form.site_ids.indexOf(s.id),1) : form.site_ids.push(s.id)"
                  />
                  <span class="text-sm" style="color:var(--qp-fg-1)">{{ s.libelle }}</span>
                </label>
                <div v-if="!sitesAudites.length" class="text-sm text-center py-2" style="color:var(--qp-fg-3)">
                  Aucun site disponible
                </div>
              </div>
            </div>

            <!-- Référentiel -->
            <div>
              <label class="qp-label">Référentiel</label>
              <input v-model="form.referentiel" class="qp-input w-full mt-1" placeholder="ISO 9001 : 2015" />
            </div>

            <!-- Critères -->
            <div>
              <label class="qp-label">Critères d'audit</label>
              <textarea v-model="form.criteres_audit" class="qp-input w-full mt-1" rows="3" placeholder="Critères applicables…" />
            </div>

            <!-- Erreur save -->
            <div v-if="erreurSave" class="rounded-lg px-4 py-3 text-sm" style="background:var(--qp-danger-50);color:var(--qp-danger-700);border:1px solid var(--qp-danger-100)">
              <Icon name="heroicons:exclamation-circle-20-solid" class="h-4 w-4 inline mr-1" />
              {{ erreurSave }}
            </div>

          </div>

          <!-- Footer modal -->
          <div class="flex justify-end gap-3 px-6 py-4 border-t" style="border-color:var(--qp-border-1)">
            <button class="qp-btn qp-btn--outline" :disabled="saving" @click="fermerModal">Annuler</button>
            <button
              class="qp-btn qp-btn--primary flex items-center gap-2"
              :disabled="saving || !form.titre || !form.date_debut"
              @click="sauvegarder()"
            >
              <Icon v-if="saving" name="heroicons:arrow-path-20-solid" class="h-4 w-4 animate-spin" />
              {{ saving ? 'Enregistrement…' : (modeEdition ? 'Mettre à jour' : 'Créer l’audit') }}
            </button>
          </div>

        </div>
      </div>
    </Teleport>

    <!-- ══ MODAL CONFIRMATION SUPPRESSION ════════════════════════════════════ -->
    <Teleport to="body">
      <div v-if="confirmSuppr" class="fixed inset-0 z-50 flex items-center justify-center px-4" style="background:rgba(0,0,0,.45)">
        <div class="w-full max-w-sm rounded-2xl shadow-2xl p-6" style="background:#fff">
          <div class="flex items-start gap-3 mb-4">
            <div class="flex-none w-10 h-10 rounded-full flex items-center justify-center" style="background:var(--qp-danger-50)">
              <Icon name="heroicons:trash-20-solid" class="h-5 w-5" style="color:var(--qp-danger-600)" />
            </div>
            <div>
              <h3 class="font-bold text-base" style="color:var(--qp-fg-0)">Supprimer cet audit ?</h3>
              <p class="text-sm mt-1" style="color:var(--qp-fg-2)">
                « {{ confirmSuppr.titre }} » sera définitivement supprimé. Cette action est irréversible.
              </p>
            </div>
          </div>
          <div class="flex justify-end gap-3">
            <button class="qp-btn qp-btn--outline qp-btn--sm" @click="confirmSuppr = null">Annuler</button>
            <button class="qp-btn qp-btn--danger qp-btn--sm flex items-center gap-2" @click="supprimerAudit">
              <Icon name="heroicons:trash-20-solid" class="h-4 w-4" />
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<style scoped>
.smq-content { font-family: 'IBM Plex Sans', system-ui, sans-serif; }
</style>
