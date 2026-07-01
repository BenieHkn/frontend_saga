<script setup>

import { useSmqPermissions }                          from '~/composables/smq/useSmqPermissions'
import { useAuth }                                    from '~/composables/auth/useAuth'
import { useReferentiels }                            from '~/composables/smq/useReferentiels'
import { usePaq }                                     from '~/composables/smq/usePaq'
import { useAuditNavigation, viderCacheAuditNav }     from '~/composables/smq/useAuditNavigation'
import Swal                                           from 'sweetalert2'

const config = useRuntimeConfig()
const base   = computed(() => config.public.apiBase)

// ── Rôles ─────────────────────────────────────────────────────────────────
const { estRQ, estRQA, estAdminSmq } = useSmqPermissions()
const { isAdmin } = useAuth()
const { fetchExercices, fetchExerciceActif } = useReferentiels()
const { fetchAudits }                        = usePaq()
const estPrivilegié = computed(() => estRQ.value || estRQA.value || estAdminSmq.value || isAdmin())
const { chargerAuditNav } = useAuditNavigation()

const h     = () => { const t = process.client ? localStorage.getItem('auth_token') : ''; return { Authorization: `Bearer ${t}`, Accept: 'application/json' } }
const hJson = () => ({ ...h(), 'Content-Type': 'application/json' })

// ── Chargement des AuditEntites dont je suis chef ─────────────────────────
const auditEntites = ref([])
const loading      = ref(true)
const erreur       = ref(null)

const charger = async () => {
  loading.value = true
  erreur.value  = null
  try {
    const res = await $fetch(`${base.value}/smq/restitutions/mes-audits`, { headers: h() })
    auditEntites.value = res?.data ?? res ?? []
  } catch (e) {
    erreur.value = e?.data?.message ?? 'Erreur chargement'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  // Charger les données de visite ET les exercices en parallèle
  await Promise.all([
    charger(),
    (async () => {
      try {
        exercices.value = await fetchExercices()
        // Pré-sélectionner l'exercice actif
        const actif = await fetchExerciceActif()
        if (actif?.id && exercices.value.find(e => e.id === actif.id)) {
          exerciceFiltre.value = actif.id  // déclenche le watch → charge les audits
        } else if (exercices.value.length) {
          exerciceFiltre.value = exercices.value[0].id
        }
      } catch { /* silencieux */ }
    })(),
  ])
})

// ── Labels ─────────────────────────────────────────────────────────────────
const processusLabel = (ae) => ae?.entite?.processus?.libelle ?? ae?.entite?.libelle ?? '—'
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' }) : null

// ── Filtres exercice + audit ──────────────────────────────────────────────────
const exercices           = ref([])   // tous les exercices en base
const auditsExercice      = ref([])   // audits du exercice sélectionné
const exerciceFiltre      = ref(null) // id exercice sélectionné
const auditFiltre         = ref(null) // id audit sélectionné
const loadingFiltres      = ref(false)

const labelExercice = (ex) => ex.annee ?? ex.libelle ?? `Exercice #${ex.id}`
const labelAudit    = (a)  =>
  a.titre ?? (a.date_debut ? `Audit du ${new Date(a.date_debut).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' })}` : null) ?? `Audit #${a.id}`

// Charger les audits quand l'exercice change
watch(exerciceFiltre, async (exId) => {
  auditFiltre.value   = null
  auditsExercice.value = []
  if (!exId) return
  loadingFiltres.value = true
  try {
    const list = await fetchAudits({ exercice_id: exId, per_page: 100 })
    auditsExercice.value = list
    // Pré-sélectionner le dernier audit (id le plus grand)
    if (list.length) {
      const dernier = list.reduce((max, a) => a.id > max.id ? a : max, list[0])
      auditFiltre.value = dernier.id
    }
  } finally {
    loadingFiltres.value = false
  }
})

const auditEntitesFiltrees = computed(() => {
  let list = auditEntites.value
  if (exerciceFiltre.value) list = list.filter(ae => ae.audit?.exercice_id === exerciceFiltre.value)
  if (auditFiltre.value)    list = list.filter(ae => ae.audit?.id         === auditFiltre.value)
  return list
})

// ── Sélection d'une AuditEntite ───────────────────────────────────────────
const selected     = ref(null)
const restitution  = ref(null)
const loadingFiche = ref(false)
const modeEdition  = ref(false)

const selectionner = async (ae) => {
  selected.value     = ae
  restitution.value  = null
  modeEdition.value  = false
  loadingFiche.value = true
  try {
    const res = await $fetch(`${base.value}/smq/restitutions/${ae.id}`, { headers: h() })
    restitution.value = res?.data ?? null
  } catch {}
  _initForm()
  await _chargerIndicateurs()
  loadingFiche.value = false
}

// ── Indicateurs de l'entité auditée + leurs saisies ──────────────────────
const indicateursEntite  = ref([])
const loadingIndicateurs = ref(false)

const _chargerIndicateurs = async () => {
  if (!selected.value) return
  const entiteId = selected.value.entite?.id
  if (!entiteId) return

  let exerciceId = selected.value.audit?.exercice_id
  if (!exerciceId) {
    try { const ex = await fetchExerciceActif(); exerciceId = ex?.id ?? null } catch {}
  }

  loadingIndicateurs.value = true
  try {
    const q = new URLSearchParams({ per_page: '100', entite_id: entiteId })
    const indRes = await $fetch(`${base.value}/smq/indicateurs?${q}`, { headers: h() })
    const indicateurs = indRes?.data?.data ?? indRes?.data ?? indRes ?? []
    const liste = Array.isArray(indicateurs) ? indicateurs : Object.values(indicateurs).filter(v => v?.id)

    const enrichis = await Promise.all(liste.map(async (ind) => {
      let derniereSaisie = null
      try {
        const sq = new URLSearchParams({ indicateur_id: ind.id, statut: 'transmis', per_page: '10' })
        if (exerciceId) sq.set('exercice_id', exerciceId)
        const sRes = await $fetch(`${base.value}/smq/saisies?${sq}`, { headers: h() })
        const arr = Array.isArray(sRes?.data?.data ?? sRes?.data ?? sRes ?? []) ? (sRes?.data?.data ?? sRes?.data ?? sRes ?? []) : []
        derniereSaisie = arr[0] ?? null
      } catch {}
      return { ...ind, derniereSaisie }
    }))

    indicateursEntite.value = enrichis.filter(ind => ind.derniereSaisie !== null)
    _initEcartsDepuisIndicateurs()
  } catch (e) {
    console.error('Indicateurs:', e)
    indicateursEntite.value = []
  } finally {
    loadingIndicateurs.value = false
  }
}

// ── Form ──────────────────────────────────────────────────────────────────
const pointsForts     = ref([])
const pointsFaibles   = ref([])
const recommandations = ref([])
const ecartsLignes    = ref([])
const ecartsLibres    = ref([])   // écarts non liés à un indicateur

const _initForm = () => {
  pointsForts.value     = (restitution.value?.points_forts    ?? []).map(item => ({ texte: item.texte ?? '' }))
  pointsFaibles.value   = (restitution.value?.points_faibles  ?? []).map(item => ({ texte: item.texte ?? '' }))
  recommandations.value = (restitution.value?.recommandations ?? []).map(item => ({ texte: item.texte ?? '' }))
}

const _initEcartsDepuisIndicateurs = () => {
  // Écarts libres (non liés à un indicateur) — depuis la relation BDD
  const libres = restitution.value?.ecarts_libres ?? null
  ecartsLibres.value = (libres && Array.isArray(libres))
    ? libres.map(e => ({ libelle: e.libelle ?? '', ecart_constate: e.ecart_constate ?? '', observations: e.observations ?? '' }))
    : []

  const ecartsSauvegardes = restitution.value?.ecarts_json ?? null
  if (ecartsSauvegardes && Array.isArray(ecartsSauvegardes)) {
    ecartsLignes.value = ecartsSauvegardes
    return
  }
  ecartsLignes.value = indicateursEntite.value.map(ind => {
    const s = ind.derniereSaisie
    return {
      indicateur_id:   ind.id,
      code:            ind.code            ?? '',
      libelle:         ind.libelle         ?? '',
      type:            ind.type            ?? 'suivi',
      label_valeur:    ind.label_valeur    ?? 'Valeur',
      label_operande1: ind.label_operande1 ?? 'Numérateur',
      label_operande2: ind.label_operande2 ?? 'Dénominateur',
      valeur_cible:    ind.valeur_cible    ?? null,
      critere:         ind.critere         ?? '',
      operande1:       s?.operande1        ?? null,
      operande2:       s?.operande2        ?? null,
      dernierResultat: s?.resultat         ?? null,
      conformite:      s?.conformite       ?? ind.conformite ?? 'en_attente',
      periode:         s?.date_debut       ?? null,
      observations:    '',
      ecart_constate:  '',
      ras:             false,
    }
  })
}

// ── Formatage résultat ────────────────────────────────────────────────────
const formaterResultat = (e) => {
  if (e.dernierResultat === null || e.dernierResultat === undefined) return '—'
  return e.type === 'calcul'
    ? `${Number(e.dernierResultat).toFixed(1)} %`
    : String(Math.round(Number(e.dernierResultat)))
}

const labelFraction = (e) =>
  (e.type === 'calcul' && e.operande1 !== null && e.operande2 !== null)
    ? `${e.operande1} / ${e.operande2}`
    : null

const badgeConformite = (val) => {
  if (val === 'conforme')     return { label: 'Conforme',     bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' }
  if (val === 'non_conforme') return { label: 'Non conforme', bg: '#fff1f2', color: '#b91c1c', border: '#fca5a5' }
  return                             { label: 'En attente',   bg: '#fefce8', color: '#a16207', border: '#fde047' }
}


const _compilerEcarts = () => {
  const lignesIndicateurs = ecartsLignes.value.map((e, i) => {
    const label = [e.code, e.libelle].filter(Boolean).join(' – ') || `Indicateur ${i + 1}`
    if (e.ras) return `${label} : RAS — pas d'écart constaté`
    const res = e.dernierResultat !== null
      ? `\n  Résultat : ${formaterResultat(e)}${e.valeur_cible ? ' (cible : ' + e.valeur_cible + (e.type === 'calcul' ? ' %' : '') + ')' : ''}`
      : ''
    const ecart = e.ecart_constate?.trim() ? `\n  Écart constaté : ${e.ecart_constate}` : ''
    const obs   = e.observations?.trim()   ? `\n  Observations : ${e.observations}`     : ''
    return `${label}${res}${ecart}${obs}`
  })

  const lignesLibres = ecartsLibres.value
    .filter(e => e.libelle?.trim() || e.ecart_constate?.trim())
    .map(e => {
      const label = e.libelle?.trim() || 'Écart divers'
      const ecart = e.ecart_constate?.trim() ? `\n  Écart constaté : ${e.ecart_constate}` : ''
      const obs   = e.observations?.trim()   ? `\n  Observations : ${e.observations}`     : ''
      return `${label}${ecart}${obs}`
    })

  const toutes = [...lignesIndicateurs, ...lignesLibres]
  return toutes.length ? toutes.join('\n\n') : 'RAS — Aucun écart constaté.'
}

const ajouterEcartLibre = () => {
  ecartsLibres.value.push({ libelle: '', ecart_constate: '', observations: '' })
}
const supprimerEcartLibre = (idx) => {
  ecartsLibres.value.splice(idx, 1)
}

const ajouterItem   = (liste) => { liste.push({ texte: '' }); modeEdition.value = true }
const supprimerItem = (liste, idx) => liste.splice(idx, 1)

// ── Sauvegarde ────────────────────────────────────────────────────────────
const saving     = ref(false)
const saved      = ref(false)
const erreurSave = ref(null)

const sauvegarder = async () => {
  if (!selected.value) return
  saving.value = true; erreurSave.value = null; saved.value = false
  try {
    const payload = {
      points_forts:    pointsForts.value.filter(p => p.texte?.trim()),
      points_faibles:  pointsFaibles.value.filter(p => p.texte?.trim()),
      recommandations: recommandations.value.filter(p => p.texte?.trim()),
      ecarts:          _compilerEcarts(),
      ecarts_indicateurs: ecartsLignes.value
        .filter(e => !e.ras && (e.ecart_constate?.trim() || e.observations?.trim()))
        .map(e => ({
          indicateur_id:  e.indicateur_id ?? null,
          code:           e.code          ?? '',
          libelle:        e.libelle       ?? '',
          ecart_constate: e.ecart_constate ?? '',
          observations:   e.observations  ?? '',
        })),
      ecarts_libres: ecartsLibres.value,
    }
    const res = await $fetch(`${base.value}/smq/restitutions/${selected.value.id}`, {
      method: 'POST', headers: hJson(), body: payload,
    })
    restitution.value = res?.data ?? restitution.value
    modeEdition.value = false
    saved.value = true
    setTimeout(() => { saved.value = false }, 3000)
    await charger()
  } catch (e) {
    erreurSave.value = e?.data?.message ?? 'Erreur enregistrement'
  } finally {
    saving.value = false
  }
}

// ── Télécharger PDF ───────────────────────────────────────────────────────
const telechargementPdf = ref(false)
const telechargerPdf = async () => {
  if (!selected.value) return
  telechargementPdf.value = true
  try {
    const token = process.client ? localStorage.getItem('auth_token') : ''
    const response = await fetch(`${base.value}/smq/restitutions/${selected.value.id}/pdf`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) throw new Error('Erreur téléchargement')
    const blob = await response.blob()
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `Restitution_${processusLabel(selected.value).replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  } catch (e) {
    alert('Impossible de télécharger le PDF')
  } finally {
    telechargementPdf.value = false
  }
}

// ── Clôturer ──────────────────────────────────────────────────────────────
const cloturant = ref(false)
const cloturerRestitution = async () => {
  if (!selected.value) return
  const { isConfirmed } = await Swal.fire({
    title: 'Clôturer la restitution ?',
    html: `<p style="color:#374151">Cette action est <strong>irréversible</strong>. La restitution ne pourra plus être modifiée.</p>`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, clôturer',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#7c3aed',
    cancelButtonColor: '#6b7280',
    reverseButtons: true,
  })
  if (!isConfirmed) return
  cloturant.value = true
  try {
    const res = await $fetch(`${base.value}/smq/restitutions/${selected.value.id}/cloturer`, { method: 'POST', headers: hJson() })
    restitution.value = res?.data ?? restitution.value
    await charger()
    // Invalider le cache nav et forcer le refresh → sidebar se met à jour
    // immédiatement si c'était la dernière restitution (audit → réalisé)
    viderCacheAuditNav()
    chargerAuditNav(true)
  } catch (e) {
    erreurSave.value = e?.data?.message ?? 'Erreur lors de la clôture'
  } finally {
    cloturant.value = false
  }
}

// ── Valider par l'audité ──────────────────────────────────────────────────
const validant = ref(false)
const validerAuditee = async () => {
  if (!selected.value) return
  const { isConfirmed } = await Swal.fire({
    title: 'Valider la restitution ?',
    html: `<p style="color:#374151">En validant, l'auditeur <strong>ne pourra plus modifier</strong> cette restitution.</p>`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Oui, valider',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#0284c7',
    cancelButtonColor: '#6b7280',
    reverseButtons: true,
  })
  if (!isConfirmed) return
  validant.value = true
  try {
    const res = await $fetch(`${base.value}/smq/restitutions/${selected.value.id}/valider-auditee`, { method: 'POST', headers: hJson() })
    restitution.value = res?.data ?? restitution.value
    await charger()
  } catch (e) {
    erreurSave.value = e?.data?.message ?? 'Erreur lors de la validation'
  } finally {
    validant.value = false
  }
}

// ── Badge statut pour chaque item de la liste ────────────────────────────
const statutRestitution = (ae) => {
  const r = ae.restitution
  if (!r)                    return { label: 'Non commencée', color: '#6b7280', bg: '#f3f4f6', icon: 'heroicons:minus-circle-20-solid' }
  if (r.cloturee)            return { label: 'Clôturée',      color: '#059669', bg: '#d1fae5', icon: 'heroicons:lock-closed-20-solid' }
  if (r.validee_par_auditee) return { label: 'Validée pilote',color: '#2563eb', bg: '#dbeafe', icon: 'heroicons:check-badge-20-solid' }
  if (r.rejetee_par_pilote)  return { label: 'Rejetée',       color: '#dc2626', bg: '#fee2e2', icon: 'heroicons:x-circle-20-solid' }
  return                            { label: 'En cours',      color: '#d97706', bg: '#fef3c7', icon: 'heroicons:pencil-square-20-solid' }
}

// ── Computed statuts ──────────────────────────────────────────────────────
const estCloture          = computed(() => !!restitution.value?.cloturee)
const estValideeParPilote = computed(() => !!restitution.value?.validee_par_auditee)
const estRejeteeParPilote = computed(() => !!restitution.value?.rejetee_par_pilote)
const peutValiderAuditee  = computed(() => selected.value && restitution.value?.statut === 'cloture' && restitution.value?.statut_auditee !== 'valide')

/**
 * Détermine quels boutons afficher dans le header selon l'état de la restitution.
 * Un seul point de décision — pas de v-if dispersés.
 *
 *  'modifier'          → chef peut éditer
 *  'cloturer'          → RQ/admin, restitution validée par pilote (clôture prioritaire)
 *  'modifier+cloturer' → RQ/admin, restitution en cours ou rejetée (les deux actions utiles)
 *   null               → rien (clôturée, ou pas de sélection)
 */
const etatAction = computed(() => {
  if (!selected.value || loadingFiche.value) return null
  if (estCloture.value) return null

  if (estPrivilegié.value && restitution.value) {
    // Pilote a validé → clôture uniquement (action logique suivante)
    if (estValideeParPilote.value) return 'cloturer'
    // Pilote n'a pas encore validé → RQ peut modifier mais pas encore clôturer
    return 'modifier'
  }

  // Chef d'équipe : peut modifier sauf si validée par pilote (et non rejetée)
  if (!estValideeParPilote.value || estRejeteeParPilote.value) return 'modifier'

  return null
})

</script>

<template>
  <div class="smq-content">

    <SmqPageHeader overline="Audit qualité" title="Restitution — Saisie">
      <template v-if="selected && modeEdition">
        <!-- Enregistrer -->
        <button :disabled="saving" @click="sauvegarder" class="qp-btn qp-btn--header-cta">
          <Icon v-if="saving" name="heroicons:arrow-path-20-solid" class="h-4 w-4 animate-spin" />
          <Icon v-else name="heroicons:check-circle-20-solid" class="h-4 w-4" />
          {{ saving ? 'Enregistrement…' : 'Enregistrer' }}
        </button>
        <!-- Annuler -->
        <button :disabled="saving" @click="modeEdition = false; _initForm(); _initEcartsDepuisIndicateurs()" class="qp-btn qp-btn--ghost">
          <Icon name="heroicons:x-mark-20-solid" class="h-4 w-4" />
          Annuler
        </button>
      </template>
      <template v-else-if="etatAction">
        <!-- Modifier -->
        <button
          v-if="etatAction === 'modifier' || etatAction === 'modifier+cloturer'"
          @click="modeEdition = true"
          class="qp-btn qp-btn--ghost"
        >
          <Icon name="heroicons:pencil-square-20-solid" class="h-4 w-4" />
          Modifier
        </button>
        <!-- Clôturer -->
        <button
          v-if="etatAction === 'cloturer' || etatAction === 'modifier+cloturer'"
          :disabled="cloturant"
          @click="cloturerRestitution"
          class="qp-btn qp-btn--header-cta"
        >
          <Icon v-if="cloturant" name="heroicons:arrow-path-20-solid" class="h-4 w-4 animate-spin" />
          <Icon v-else name="heroicons:lock-closed-20-solid" class="h-4 w-4" />
          {{ cloturant ? 'Clôture…' : 'Clôturer' }}
        </button>
        <!-- Valider audité -->
        <button
          v-if="peutValiderAuditee"
          :disabled="validant"
          @click="validerAuditee"
          class="qp-btn qp-btn--ghost"
        >
          <Icon v-if="validant" name="heroicons:arrow-path-20-solid" class="h-4 w-4 animate-spin" />
          <Icon v-else name="heroicons:check-badge-20-solid" class="h-4 w-4" />
          {{ validant ? 'Validation…' : 'Valider (audité)' }}
        </button>
      </template>
      <!-- PDF -->
      <button
        v-if="selected && restitution"
        :disabled="telechargementPdf"
        @click="telechargerPdf"
        class="qp-btn qp-btn--ghost"
      >
        <Icon v-if="telechargementPdf" name="heroicons:arrow-path-20-solid" class="h-4 w-4 animate-spin" />
        <Icon v-else name="heroicons:arrow-down-tray-20-solid" class="h-4 w-4" />
        PDF
      </button>
    </SmqPageHeader>

    <!-- Feedback -->
    <div v-if="erreurSave" class="mb-4 qp-alert qp-alert--danger text-sm">{{ erreurSave }}</div>
    <div v-if="saved" class="mb-4 px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2" style="background:#f0fdf4;color:#15803d;border:1px solid #bbf7d0">
      <Icon name="heroicons:check-circle-20-solid" class="h-4 w-4 shrink-0" />
      Restitution enregistrée avec succès.
    </div>

    <div class="flex gap-6 items-start">

      <!-- ── Liste visites ── -->
      <div class="w-72 shrink-0">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-xs font-black uppercase tracking-widest" style="color:var(--qp-fg-3)">Mes visites assignées</h2>
          <span v-if="estPrivilegié && auditFiltre" class="text-xs font-semibold px-2 py-0.5 rounded-full" style="background:#dbeafe;color:#1d4ed8">
            {{ auditEntitesFiltrees.length }} / {{ auditEntites.length }}
          </span>
        </div>

        <!-- Filtres exercice + audit (RQ / RQA / admin) — même ligne -->
        <template v-if="estPrivilegié">
          <div class="flex gap-2 mb-3 items-end">
            <!-- 1. Exercice -->
            <div class="flex-1 min-w-0">
              <label class="qp-label mb-1 block text-xs">Exercice</label>
              <select v-model="exerciceFiltre" class="qp-input w-full text-xs">
                <option :value="null">— Tous —</option>
                <option v-for="ex in exercices" :key="ex.id" :value="ex.id">
                  {{ labelExercice(ex) }}
                </option>
              </select>
            </div>

            <!-- 2. Audit -->
            <div class="flex-1 min-w-0">
              <label class="qp-label mb-1 block text-xs">Audit</label>
              <div class="relative">
                <select
                  v-model="auditFiltre"
                  class="qp-input w-full text-xs"
                  :disabled="!exerciceFiltre || loadingFiltres"
                >
                  <option :value="null">— Tous —</option>
                  <option v-for="a in auditsExercice" :key="a.id" :value="a.id">
                    {{ labelAudit(a) }}
                  </option>
                </select>
                <span v-if="loadingFiltres" class="absolute right-6 top-1/2 -translate-y-1/2">
                  <span class="block w-3 h-3 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                </span>
              </div>
            </div>
          </div>
        </template>

        <div v-if="loading" class="flex justify-center py-10">
          <div class="animate-spin h-6 w-6 rounded-full border-4 border-emerald-500 border-t-transparent"></div>
        </div>
        <div v-else-if="erreur" class="qp-alert qp-alert--danger text-sm">{{ erreur }}</div>
        <div v-else-if="!auditEntites.length" class="text-sm py-6 text-center" style="color:var(--qp-fg-4)">
          <Icon name="heroicons:magnifying-glass-circle-20-solid" class="h-10 w-10 mx-auto mb-2 opacity-30" />
          Aucune visite assignée
        </div>
        <div v-else-if="!auditEntitesFiltrees.length" class="text-sm py-4 text-center" style="color:var(--qp-fg-4)">
          Aucune restitution pour cet audit.
        </div>

        <div v-else class="space-y-2">
          <button
            v-for="ae in auditEntitesFiltrees" :key="ae.id"
            class="w-full text-left rounded-xl border px-4 py-3 transition-all"
            :class="selected?.id === ae.id ? 'border-emerald-500 bg-emerald-50 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'"
            @click="selectionner(ae)"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="font-semibold text-sm leading-snug" style="color:var(--qp-fg-0)">{{ processusLabel(ae) }}</div>
              <span
                class="shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                :style="{ background: statutRestitution(ae).bg, color: statutRestitution(ae).color }"
              >
                <Icon :name="statutRestitution(ae).icon" class="h-3 w-3" />
                {{ statutRestitution(ae).label }}
              </span>
            </div>
            <div class="text-xs mt-0.5" style="color:var(--qp-fg-3)">{{ ae.entite?.libelle }}</div>
            <div class="text-xs mt-0.5" style="color:var(--qp-fg-3)">{{ ae.audit?.titre }}</div>
            <div v-if="ae.date" class="text-xs mt-0.5 font-mono" style="color:var(--qp-fg-4)">{{ fmtDate(ae.date) }}</div>
          </button>
        </div>
      </div>

      <!-- ── Panneau restitution ── -->
      <div class="flex-1 min-w-0">

        <!-- Vide -->
        <div v-if="!selected" class="flex flex-col items-center justify-center py-24 text-center" style="color:var(--qp-fg-4)">
          <Icon name="heroicons:document-magnifying-glass-20-solid" class="h-14 w-14 mb-3 opacity-25" />
          <p class="font-medium">Sélectionnez une visite pour saisir la restitution</p>
        </div>

        <!-- Chargement -->
        <div v-else-if="loadingFiche" class="flex justify-center py-20">
          <div class="animate-spin h-8 w-8 rounded-full border-4 border-emerald-500 border-t-transparent"></div>
        </div>

        <div v-else class="space-y-5">

          <!-- En-tête entité -->
          <div class="rounded-xl border px-5 py-4 flex items-start justify-between" style="background:#f9fafb;border-color:var(--qp-border-1)">
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-lg font-bold" style="color:var(--qp-fg-0)">{{ processusLabel(selected) }}</span>
                <span v-if="restitution?.statut === 'cloture'"
                  class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full"
                  style="background:#f0fdf4;color:#15803d;border:1px solid #bbf7d0">
                  <Icon name="heroicons:lock-closed-20-solid" class="h-3 w-3" />Clôturée
                </span>
                <span v-else-if="modeEdition"
                  class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full"
                  style="background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe">
                  <Icon name="heroicons:pencil-20-solid" class="h-3 w-3" />Mode édition
                </span>
              </div>
              <div class="text-sm mt-0.5" style="color:var(--qp-fg-3)">
                {{ selected.entite?.libelle }}
                <span v-if="selected.audit?.titre"> · {{ selected.audit.titre }}</span>
                <span v-if="selected.date"> · {{ fmtDate(selected.date) }}</span>
              </div>
            </div>
          </div>

          <!-- Banner validée par pilote -->
          <div v-if="estValideeParPilote && !estRejeteeParPilote" class="rounded-lg px-4 py-3 text-sm font-medium flex items-center gap-2" style="background:#f0fdf4;color:#15803d;border:1px solid #bbf7d0">
            <Icon name="heroicons:check-badge-20-solid" class="h-5 w-5 shrink-0" />
            <span>Le pilote a <strong>validé</strong> cette restitution — lecture seule.</span>
          </div>

          <!-- Banner rejetée par pilote -->
          <div v-if="estRejeteeParPilote" class="rounded-lg px-4 py-3 text-sm font-medium flex items-start gap-2" style="background:#fff1f2;color:#b91c1c;border:1px solid #fca5a5">
            <Icon name="heroicons:x-circle-20-solid" class="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p class="font-semibold">Le pilote a <strong>rejeté</strong> cette restitution — veuillez corriger et réenregistrer.</p>
              <p v-if="restitution?.raison_rejet" class="mt-1 italic opacity-80">« {{ restitution.raison_rejet }} »</p>
            </div>
          </div>

          <!-- Banner clôture -->
          <div v-if="estCloture" class="rounded-lg px-4 py-2.5 text-sm font-medium flex items-center gap-2" style="background:#faf5ff;color:#7c3aed;border:1px solid #e9d5ff">
            <Icon name="heroicons:lock-closed-20-solid" class="h-4 w-4 shrink-0" />
            Restitution clôturée — lecture seule.
          </div>

          <!-- ── Points forts ── -->
          <div class="rounded-xl border overflow-hidden" style="border-color:var(--qp-border-1)">
            <div class="px-5 py-3 flex items-center justify-between" style="background:#f0fdf4;border-bottom:1px solid #bbf7d0">
              <span class="font-semibold text-sm flex items-center gap-1.5" style="color:#15803d">
                <Icon name="heroicons:hand-thumb-up-20-solid" class="h-4 w-4" />Points forts
              </span>
              <button v-if="modeEdition" @click="ajouterItem(pointsForts)"
                class="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all"
                style="background:#dcfce7;color:#15803d;border:1px solid #bbf7d0">
                <Icon name="heroicons:plus-20-solid" class="h-3.5 w-3.5" />Ajouter
              </button>
            </div>
            <div class="px-5 py-4 space-y-1.5" style="background:#fff">
              <div v-if="!pointsForts.length && !modeEdition" class="text-sm italic" style="color:var(--qp-fg-4)">Aucun point fort renseigné.</div>
              <div v-for="(item, idx) in pointsForts" :key="idx" class="flex items-center gap-2">
                <span class="text-emerald-600 shrink-0 mt-0.5">•</span>
                <input v-if="modeEdition" v-model="item.texte" type="text" class="qp-input flex-1 text-sm" placeholder="Point fort…" />
                <span v-else class="text-sm flex-1" style="color:var(--qp-fg-1)">{{ item.texte }}</span>
                <button v-if="modeEdition" class="shrink-0 p-1 rounded hover:bg-red-50 transition-colors" style="color:#ef4444" @click="supprimerItem(pointsForts, idx)">
                  <Icon name="heroicons:x-mark-20-solid" class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- ── Points faibles ── -->
          <div class="rounded-xl border overflow-hidden" style="border-color:var(--qp-border-1)">
            <div class="px-5 py-3 flex items-center justify-between" style="background:#fff7ed;border-bottom:1px solid #fed7aa">
              <span class="font-semibold text-sm flex items-center gap-1.5" style="color:#c2410c">
                <Icon name="heroicons:hand-thumb-down-20-solid" class="h-4 w-4" />Points faibles
              </span>
              <button v-if="modeEdition" @click="ajouterItem(pointsFaibles)"
                class="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all"
                style="background:#ffedd5;color:#c2410c;border:1px solid #fed7aa">
                <Icon name="heroicons:plus-20-solid" class="h-3.5 w-3.5" />Ajouter
              </button>
            </div>
            <div class="px-5 py-4 space-y-1.5" style="background:#fff">
              <div v-if="!pointsFaibles.length && !modeEdition" class="text-sm italic" style="color:var(--qp-fg-4)">Aucun point faible renseigné.</div>
              <div v-for="(item, idx) in pointsFaibles" :key="idx" class="flex items-center gap-2">
                <span class="shrink-0 mt-0.5" style="color:#c2410c">•</span>
                <input v-if="modeEdition" v-model="item.texte" type="text" class="qp-input flex-1 text-sm" placeholder="Point faible…" />
                <span v-else class="text-sm flex-1" style="color:var(--qp-fg-1)">{{ item.texte }}</span>
                <button v-if="modeEdition" class="shrink-0 p-1 rounded hover:bg-red-50 transition-colors" style="color:#ef4444" @click="supprimerItem(pointsFaibles, idx)">
                  <Icon name="heroicons:x-mark-20-solid" class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- ── Écarts par indicateur ── -->
          <div class="rounded-xl border overflow-hidden" style="border-color:var(--qp-border-1)">
            <div class="px-5 py-3" style="background:#fff1f2;border-bottom:1px solid #fca5a5">
              <span class="font-semibold text-sm flex items-center gap-1.5" style="color:#b91c1c">
                <Icon name="heroicons:exclamation-triangle-20-solid" class="h-4 w-4" />Écarts constatés
              </span>
            </div>

            <div class="px-5 py-4 space-y-3" style="background:#fff">
              <div v-if="loadingIndicateurs" class="flex justify-center py-6">
                <div class="animate-spin h-6 w-6 rounded-full border-4 border-rose-400 border-t-transparent"></div>
              </div>
              <div v-else-if="!ecartsLignes.length" class="text-sm italic text-center py-4" style="color:var(--qp-fg-4)">
                Aucun indicateur transmis pour cette visite.
              </div>

              <!-- Carte par indicateur -->
              <div
                v-for="e in ecartsLignes" :key="e.indicateur_id"
                class="rounded-xl border overflow-hidden"
                style="border-color:var(--qp-border-1)"
              >
                <!-- En-tête indicateur -->
                <div class="px-4 py-3 flex items-start justify-between gap-3" style="background:#f9fafb;border-bottom:1px solid var(--qp-border-1)">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="font-semibold text-sm" style="color:var(--qp-fg-0)">
                        {{ e.code ? e.code + ' – ' : '' }}{{ e.libelle }}
                      </span>
                      <!-- Badge type -->
                      <span
                        class="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full"
                        :style="e.type === 'calcul'
                          ? 'background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe'
                          : 'background:#f5f3ff;color:#6d28d9;border:1px solid #ddd6fe'"
                      >
                        <Icon :name="e.type === 'calcul' ? 'heroicons:calculator-20-solid' : 'heroicons:eye-20-solid'" class="h-3 w-3 mr-1" />
                        {{ e.type === 'calcul' ? 'Calcul' : 'Suivi' }}
                      </span>
                    </div>
                    <p class="text-xs mt-0.5" style="color:var(--qp-fg-3)">
                      <template v-if="e.type === 'calcul'">{{ e.label_operande1 }} / {{ e.label_operande2 }} × 100</template>
                      <template v-else>{{ e.label_valeur }}</template>
                    </p>
                  </div>
                  <!-- Résultat + badge conformité -->
                  <div class="flex flex-col items-end gap-1.5 shrink-0">
                    <div class="flex items-baseline gap-1">
                      <span v-if="labelFraction(e)" class="text-xs" style="color:var(--qp-fg-3)">({{ labelFraction(e) }})</span>
                      <span class="font-bold text-base" style="color:var(--qp-fg-0)">{{ formaterResultat(e) }}</span>
                      <span v-if="e.valeur_cible !== null && e.valeur_cible !== undefined" class="text-xs" style="color:var(--qp-fg-3)">
                        / cible {{ e.valeur_cible }}{{ e.type === 'calcul' ? ' %' : '' }}
                      </span>
                    </div>
                    <span
                      class="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full"
                      :style="`background:${badgeConformite(e.conformite).bg};color:${badgeConformite(e.conformite).color};border:1px solid ${badgeConformite(e.conformite).border}`"
                    >
                      {{ badgeConformite(e.conformite).label }}
                    </span>
                  </div>
                </div>

                <!-- Corps saisie chef -->
                <div class="px-4 py-3 space-y-2.5" style="background:#fff">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" v-model="e.ras" :disabled="!modeEdition"
                      style="accent-color:#059669;width:15px;height:15px;cursor:pointer" />
                    <span class="text-sm font-medium" style="color:var(--qp-fg-1)">RAS — pas d'écart constaté</span>
                  </label>

                  <template v-if="!e.ras">
                    <div>
                      <label class="text-xs font-semibold uppercase tracking-wide block mb-1" style="color:var(--qp-fg-3)">Écart constaté</label>
                      <textarea v-if="modeEdition" v-model="e.ecart_constate" rows="2" class="qp-input w-full text-sm"
                        placeholder="Décrire l'écart…" style="resize:vertical" />
                      <p v-else-if="e.ecart_constate" class="text-sm whitespace-pre-wrap" style="color:var(--qp-fg-1)">{{ e.ecart_constate }}</p>
                      <p v-else class="text-sm italic" style="color:var(--qp-fg-4)">—</p>
                    </div>
                    <div>
                      <label class="text-xs font-semibold uppercase tracking-wide block mb-1" style="color:var(--qp-fg-3)">Observations</label>
                      <textarea v-if="modeEdition" v-model="e.observations" rows="2" class="qp-input w-full text-sm"
                        placeholder="Observations complémentaires…" style="resize:vertical" />
                      <p v-else-if="e.observations" class="text-sm whitespace-pre-wrap" style="color:var(--qp-fg-1)">{{ e.observations }}</p>
                      <p v-else class="text-sm italic" style="color:var(--qp-fg-4)">—</p>
                    </div>
                  </template>
                </div>
              </div>

              <!-- ── Écarts libres (hors indicateurs) ── -->
              <div class="mt-4 rounded-xl border overflow-hidden" style="border-color:#fca5a5">
                <div class="px-4 py-2.5 flex items-center justify-between" style="background:#fff5f5;border-bottom:1px solid #fca5a5">
                  <span class="text-sm font-semibold flex items-center gap-1.5" style="color:#b91c1c">
                    <Icon name="heroicons:clipboard-document-list-20-solid" class="h-4 w-4" />
                    Autres écarts (hors indicateurs)
                  </span>
                  <button
                    v-if="modeEdition"
                    class="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all"
                    style="background:#fee2e2;color:#b91c1c;border:1px solid #fca5a5"
                    @click="ajouterEcartLibre"
                  >
                    <Icon name="heroicons:plus-20-solid" class="h-3.5 w-3.5" />Ajouter
                  </button>
                </div>
                <div class="px-4 py-3 space-y-3" style="background:#fff">
                  <div v-if="!ecartsLibres.length" class="text-sm italic text-center py-3" style="color:var(--qp-fg-4)">
                    Aucun autre écart renseigné.
                  </div>
                  <div
                    v-for="(e, idx) in ecartsLibres"
                    :key="idx"
                    class="rounded-xl border p-3 space-y-2.5"
                    style="border-color:var(--qp-border-1);background:#fafafa"
                  >
                    <!-- En-tête + supprimer -->
                    <div class="flex items-center justify-between gap-2">
                      <span class="text-xs font-semibold uppercase tracking-wide" style="color:var(--qp-fg-3)">Écart {{ idx + 1 }}</span>
                      <button
                        v-if="modeEdition"
                        class="p-1 rounded hover:bg-red-50 transition-colors"
                        style="color:#ef4444"
                        @click="supprimerEcartLibre(idx)"
                      >
                        <Icon name="heroicons:x-mark-20-solid" class="h-4 w-4" />
                      </button>
                    </div>
                    <!-- Libellé -->
                    <div>
                      <label class="text-xs font-semibold uppercase tracking-wide block mb-1" style="color:var(--qp-fg-3)">Intitulé / Objet</label>
                      <input
                        v-if="modeEdition"
                        v-model="e.libelle"
                        class="qp-input w-full text-sm"
                        placeholder="Ex : Non-respect de la procédure X, absence de document Y…"
                      />
                      <p v-else-if="e.libelle" class="text-sm font-medium" style="color:var(--qp-fg-1)">{{ e.libelle }}</p>
                      <p v-else class="text-sm italic" style="color:var(--qp-fg-4)">—</p>
                    </div>
                    <!-- Écart constaté -->
                    <div>
                      <label class="text-xs font-semibold uppercase tracking-wide block mb-1" style="color:var(--qp-fg-3)">Écart constaté</label>
                      <textarea
                        v-if="modeEdition"
                        v-model="e.ecart_constate"
                        rows="2"
                        class="qp-input w-full text-sm"
                        placeholder="Décrire l'écart…"
                        style="resize:vertical"
                      />
                      <p v-else-if="e.ecart_constate" class="text-sm whitespace-pre-wrap" style="color:var(--qp-fg-1)">{{ e.ecart_constate }}</p>
                      <p v-else class="text-sm italic" style="color:var(--qp-fg-4)">—</p>
                    </div>
                    <!-- Observations -->
                    <div>
                      <label class="text-xs font-semibold uppercase tracking-wide block mb-1" style="color:var(--qp-fg-3)">Observations</label>
                      <textarea
                        v-if="modeEdition"
                        v-model="e.observations"
                        rows="2"
                        class="qp-input w-full text-sm"
                        placeholder="Observations complémentaires…"
                        style="resize:vertical"
                      />
                      <p v-else-if="e.observations" class="text-sm whitespace-pre-wrap" style="color:var(--qp-fg-1)">{{ e.observations }}</p>
                      <p v-else class="text-sm italic" style="color:var(--qp-fg-4)">—</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- ── Recommandations ── -->
          <div class="rounded-xl border overflow-hidden" style="border-color:var(--qp-border-1)">
            <div class="px-5 py-3 flex items-center justify-between" style="background:#eff6ff;border-bottom:1px solid #bfdbfe">
              <span class="font-semibold text-sm flex items-center gap-1.5" style="color:#1d4ed8">
                <Icon name="heroicons:light-bulb-20-solid" class="h-4 w-4" />Recommandations
              </span>
              <button v-if="modeEdition" @click="ajouterItem(recommandations)"
                class="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all"
                style="background:#dbeafe;color:#1d4ed8;border:1px solid #bfdbfe">
                <Icon name="heroicons:plus-20-solid" class="h-3.5 w-3.5" />Ajouter
              </button>
            </div>
            <div class="px-5 py-4 space-y-1.5" style="background:#fff">
              <div v-if="!recommandations.length && !modeEdition" class="text-sm italic" style="color:var(--qp-fg-4)">Aucune recommandation renseignée.</div>
              <div v-for="(item, idx) in recommandations" :key="idx" class="flex items-center gap-2">
                <span class="shrink-0 mt-0.5" style="color:#1d4ed8">•</span>
                <input v-if="modeEdition" v-model="item.texte" type="text" class="qp-input flex-1 text-sm" placeholder="Recommandation…" />
                <span v-else class="text-sm flex-1" style="color:var(--qp-fg-1)">{{ item.texte }}</span>
                <button v-if="modeEdition" class="shrink-0 p-1 rounded hover:bg-red-50 transition-colors" style="color:#ef4444" @click="supprimerItem(recommandations, idx)">
                  <Icon name="heroicons:x-mark-20-solid" class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
