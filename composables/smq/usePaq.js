/**
 * usePaq — Plan Audit Qualité
 *
 * Endpoints :
 *   GET    /smq/audits                         (exercice_id, per_page)
 *   POST   /smq/audits                         ({exercice_id, date_debut, date_fin})
 *   GET    /smq/audits/:id
 *   PUT    /smq/audits/:id
 *   DELETE /smq/audits/:id
 *
 *   POST   /smq/audits/:id/entites             (entite_id, date, heure_debut, heure_fin, observations_generales, participants[])
 *   DELETE /smq/audits/:auditId/entites/:aeId
 *
 *   GET    /smq/audit-entites/:id
 *   PUT    /smq/audit-entites/:id
 *   POST   /smq/audit-entites/:id/participants ({participants: [userId, ...]})
 *
 *   GET    /smq/recommandations                (audit_entite_id, statut, per_page)
 *   POST   /smq/recommandations                ({audit_entite_id, libelle, statut})
 *   PUT    /smq/recommandations/:id
 *   DELETE /smq/recommandations/:id
 */
export const usePaq = () => {
  const config = useRuntimeConfig()
  const base   = computed(() => config.public.apiBase)

  const headers = () => {
    const token = process.client ? localStorage.getItem('auth_token') : ''
    return { Authorization: `Bearer ${token}`, Accept: 'application/json' }
  }
  const jsonHeaders = () => ({ ...headers(), 'Content-Type': 'application/json' })

  // ── Audits ────────────────────────────────────────────────────────────────

  const fetchAudits = async (params = {}) => {
    const q = new URLSearchParams()
    if (params.exercice_id) q.set('exercice_id', params.exercice_id)
    if (params.per_page)    q.set('per_page',    params.per_page ?? 50)
    const res = await $fetch(`${base.value}/smq/audits?${q}`, { headers: headers() })
    const list = res?.data?.data ?? res?.data ?? res ?? []
    return list
  }

  const fetchAudit = async (id) => {
    const res = await $fetch(`${base.value}/smq/audits/${id}`, { headers: headers() })
    return res?.data ?? res
  }

  const createAudit = async (data) => {
    const res = await $fetch(`${base.value}/smq/audits`, {
      method: 'POST', headers: jsonHeaders(), body: data,
    })
    return res?.data ?? res
  }

  const updateAudit = async (id, data) => {
    const res = await $fetch(`${base.value}/smq/audits/${id}`, {
      method: 'PUT', headers: jsonHeaders(), body: data,
    })
    return res?.data ?? res
  }

  const deleteAudit = async (id) =>
    $fetch(`${base.value}/smq/audits/${id}`, { method: 'DELETE', headers: headers() })

  const downloadAuditPdf = async (id) => {
    const token = process.client ? localStorage.getItem('auth_token') : ''
    const res = await fetch(`${base.value}/smq/audits/${id}/pdf`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/pdf' },
    })
    if (!res.ok) throw new Error('Erreur génération PDF')
    return res.blob()
  }

  // ── AuditEntites (visites) ────────────────────────────────────────────────

  const ajouterEntiteAudit = async (auditId, data) => {
    const res = await $fetch(`${base.value}/smq/audits/${auditId}/entites`, {
      method: 'POST', headers: jsonHeaders(), body: data,
    })
    return res?.data ?? res
  }

  const supprimerEntiteAudit = async (auditId, aeId) =>
    $fetch(`${base.value}/smq/audits/${auditId}/entites/${aeId}`, { method: 'DELETE', headers: headers() })

  const fetchAuditEntite = async (id) => {
    const res = await $fetch(`${base.value}/smq/audit-entites/${id}`, { headers: headers() })
    return res?.data ?? res
  }

  const updateAuditEntite = async (id, data) => {
    const res = await $fetch(`${base.value}/smq/audit-entites/${id}`, {
      method: 'PUT', headers: jsonHeaders(), body: data,
    })
    return res?.data ?? res
  }

  const syncParticipants = async (aeId, participantIds) => {
    const res = await $fetch(`${base.value}/smq/audit-entites/${aeId}/participants`, {
      method: 'POST', headers: jsonHeaders(), body: { participants: participantIds },
    })
    return res?.data ?? res
  }

  // ── Recommandations ───────────────────────────────────────────────────────

  const fetchRecommandations = async (params = {}) => {
    const q = new URLSearchParams()
    if (params.audit_entite_id) q.set('audit_entite_id', params.audit_entite_id)
    if (params.statut)          q.set('statut',          params.statut)
    if (params.per_page)        q.set('per_page',        params.per_page ?? 50)
    const res = await $fetch(`${base.value}/smq/recommandations?${q}`, { headers: headers() })
    return res?.data?.data ?? res?.data ?? []
  }

  const createRecommandation = async (data) => {
    const res = await $fetch(`${base.value}/smq/recommandations`, {
      method: 'POST', headers: jsonHeaders(), body: data,
    })
    return res?.data ?? res
  }

  const updateRecommandation = async (id, data) => {
    const res = await $fetch(`${base.value}/smq/recommandations/${id}`, {
      method: 'PUT', headers: jsonHeaders(), body: data,
    })
    return res?.data ?? res
  }

  const deleteRecommandation = async (id) =>
    $fetch(`${base.value}/smq/recommandations/${id}`, { method: 'DELETE', headers: headers() })

  // ── Référentiels (entités, utilisateurs) ─────────────────────────────────

  const fetchEntites = async () => {
    const res = await $fetch(`${base.value}/smq/entites-premieres`, { headers: headers() })
    return res?.data ?? []
  }

  const fetchSmqUsers = async () => {
    const res = await $fetch(`${base.value}/users`, { headers: headers() })
    return res?.data?.data ?? res?.data ?? res ?? []
  }

  // ── Référentiels UI ───────────────────────────────────────────────────────

  const AUDIT_STATUTS = [
    { value: 'a_planifier', label: 'À planifier', badge: 'qp-badge--warning',  icon: 'heroicons:calendar-days' },
    { value: 'planifie',    label: 'Planifié',    badge: 'qp-badge--info',     icon: 'heroicons:compass' },
    { value: 'en_cours',    label: 'En cours',    badge: 'qp-badge--info',     icon: 'heroicons:play-circle' },
    { value: 'realise',     label: 'Réalisé',     badge: 'qp-badge--success',  icon: 'heroicons:clipboard-document-check' },
  ]

  const badgeAuditStatut = (s) => AUDIT_STATUTS.find(a => a.value === s)?.badge ?? 'qp-badge--neutral'
  const labelAuditStatut = (s) => AUDIT_STATUTS.find(a => a.value === s)?.label ?? s

  const RECO_STATUTS = [
    { value: 'ouvert',   label: 'Ouverte',   color: 'var(--qp-danger-500)'  },
    { value: 'en cours', label: 'En cours',  color: 'var(--qp-warning-500)' },
    { value: 'clos',     label: 'Appliquée', color: 'var(--qp-success-500)' },
  ]

  const colorRecoStatut = (s) => RECO_STATUTS.find(r => r.value === s)?.color ?? 'var(--qp-n-300)'

  return {
    fetchAudits, fetchAudit, createAudit, updateAudit, deleteAudit, downloadAuditPdf,
    ajouterEntiteAudit, supprimerEntiteAudit,
    fetchAuditEntite, updateAuditEntite, syncParticipants,
    fetchRecommandations, createRecommandation, updateRecommandation, deleteRecommandation,
    fetchEntites, fetchSmqUsers,
    AUDIT_STATUTS, badgeAuditStatut, labelAuditStatut,
    RECO_STATUTS, colorRecoStatut,
  }
}
