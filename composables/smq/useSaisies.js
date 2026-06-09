/**
 * useSaisies — saisies indicateurs
 * Endpoints :
 *   GET    /smq/saisies              (indicateur_id, exercice_id, statut, conformite, per_page)
 *   POST   /smq/saisies
 *   GET    /smq/saisies/:id
 *   PUT    /smq/saisies/:id          (brouillon/retourné uniquement)
 *   DELETE /smq/saisies/:id          (brouillon uniquement)
 *   POST   /smq/saisies/:id/soumettre
 *   POST   /smq/saisies/:id/valider
 *   POST   /smq/saisies/:id/retourner  (body: {motif})
 *   POST   /smq/saisies/:id/transmettre
 */
export const useSaisies = () => {
  const config = useRuntimeConfig()
  const base   = computed(() => config.public.apiBase)

  const headers = () => {
    const token = process.client ? localStorage.getItem('auth_token') : ''
    return { Authorization: `Bearer ${token}`, Accept: 'application/json' }
  }
  const jsonHeaders = () => ({ ...headers(), 'Content-Type': 'application/json' })

  // ── Lecture ───────────────────────────────────────────────────────────────

  const fetchSaisies = async (params = {}) => {
    const q = new URLSearchParams()
    if (params.indicateur_id) q.set('indicateur_id', params.indicateur_id)
    if (params.exercice_id)   q.set('exercice_id',   params.exercice_id)
    if (params.statut)        q.set('statut',        params.statut)
    if (params.conformite)    q.set('conformite',    params.conformite)
    if (params.per_page)      q.set('per_page',      params.per_page)
    const res = await $fetch(`${base.value}/smq/saisies?${q}`, { headers: headers() })
    return res?.data ?? res
  }

  /** Saisies à faire par le co-pilote courant (statut brouillon ou retourné) */
  const fetchSaisiesAFaire = async (exerciceId = null) => {
    const params = { statut: 'brouillon', per_page: 50 }
    if (exerciceId) params.exercice_id = exerciceId
    return fetchSaisies(params)
  }

  /** Saisies d'un indicateur donné */
  const fetchSaisiesIndicateur = async (indicateurId) => {
    const res = await fetchSaisies({ indicateur_id: indicateurId, per_page: 20 })
    return res?.data ?? res ?? []
  }

  /** File de validation — saisies au statut soumis (pour le pilote) */
  const fetchFilValidation = async (exerciceId = null) => {
    const params = { statut: 'soumis', per_page: 50 }
    if (exerciceId) params.exercice_id = exerciceId
    const res = await fetchSaisies(params)
    return res?.data ?? res ?? []
  }

  const fetchSaisie = async (id) => {
    const res = await $fetch(`${base.value}/smq/saisies/${id}`, { headers: headers() })
    return res?.data ?? res
  }

  // ── Mutations ─────────────────────────────────────────────────────────────

  const enregistrerBrouillon = async (data) => {
    const res = await $fetch(`${base.value}/smq/saisies`, {
      method: 'POST', headers: jsonHeaders(), body: data,
    })
    return res?.data ?? res
  }

  const mettreAJourSaisie = async (id, data) => {
    const res = await $fetch(`${base.value}/smq/saisies/${id}`, {
      method: 'PUT', headers: jsonHeaders(), body: data,
    })
    return res?.data ?? res
  }

  const supprimerSaisie = async (id) =>
    $fetch(`${base.value}/smq/saisies/${id}`, { method: 'DELETE', headers: headers() })

  // ── Workflow ──────────────────────────────────────────────────────────────

  const soumettre = async (id, body = {}) => {
    const res = await $fetch(`${base.value}/smq/saisies/${id}/soumettre`, {
      method: 'POST', headers: jsonHeaders(), body,
    })
    return res?.data ?? res
  }

  const valider = async (id, body = {}) => {
    const res = await $fetch(`${base.value}/smq/saisies/${id}/valider`, {
      method: 'POST', headers: jsonHeaders(), body,
    })
    return res?.data ?? res
  }

  const retourner = async (id, motif = '') => {
    const res = await $fetch(`${base.value}/smq/saisies/${id}/retourner`, {
      method: 'POST', headers: jsonHeaders(), body: { motif },
    })
    return res?.data ?? res
  }

  const transmettre = async (id) => {
    const res = await $fetch(`${base.value}/smq/saisies/${id}/transmettre`, {
      method: 'POST', headers: jsonHeaders(), body: {},
    })
    return res?.data ?? res
  }

  return {
    fetchSaisies, fetchSaisiesAFaire, fetchSaisiesIndicateur,
    fetchFilValidation, fetchSaisie,
    enregistrerBrouillon, mettreAJourSaisie, supprimerSaisie,
    soumettre, valider, retourner, transmettre,
  }
}
