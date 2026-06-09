/**
 * useIndicateurs — CRUD indicateurs
 * Endpoints :
 *   GET    /smq/indicateurs          (exercice_id, actif, search, per_page)
 *   POST   /smq/indicateurs
 *   GET    /smq/indicateurs/:id
 *   PUT    /smq/indicateurs/:id
 *   DELETE /smq/indicateurs/:id
 *   GET    /smq/indicateurs/:id/historiques
 */
export const useIndicateurs = () => {
  const config = useRuntimeConfig()
  const base   = computed(() => config.public.apiBase)

  const headers = () => {
    const token = process.client ? localStorage.getItem('auth_token') : ''
    return { Authorization: `Bearer ${token}`, Accept: 'application/json' }
  }

  const jsonHeaders = () => ({ ...headers(), 'Content-Type': 'application/json' })

  // ── CRUD ──────────────────────────────────────────────────────────────────

  const fetchIndicateurs = async (params = {}) => {
    const q = new URLSearchParams()
    if (params.exercice_id) q.set('exercice_id', params.exercice_id)
    if (params.actif !== undefined) q.set('actif', params.actif ? '1' : '0')
    if (params.search)     q.set('search',     params.search)
    if (params.per_page)   q.set('per_page',   params.per_page)
    if (params.page)       q.set('page',       params.page)
    const url = `${base.value}/smq/indicateurs${q.toString() ? '?' + q : ''}`
    const res = await $fetch(url, { headers: headers() })
    return res?.data ?? res
  }

  const fetchIndicateur = async (id) => {
    const res = await $fetch(`${base.value}/smq/indicateurs/${id}`, { headers: headers() })
    return res?.data ?? res
  }

  const createIndicateur = async (data) => {
    const res = await $fetch(`${base.value}/smq/indicateurs`, {
      method: 'POST', headers: jsonHeaders(), body: data,
    })
    return res?.data ?? res
  }

  const updateIndicateur = async (id, data) => {
    const res = await $fetch(`${base.value}/smq/indicateurs/${id}`, {
      method: 'PUT', headers: jsonHeaders(), body: data,
    })
    return res?.data ?? res
  }

  const deleteIndicateur = async (id) =>
    $fetch(`${base.value}/smq/indicateurs/${id}`, { method: 'DELETE', headers: headers() })

  const fetchServicesCopilotes = async (indicateurId) => {
    const res = await $fetch(`${base.value}/smq/indicateurs/${indicateurId}/services-copilotes`, { headers: headers() })
    return res?.data ?? res ?? []
  }

  const assignerCopilote = async (indicateurId, entiteId) => {
    const res = await $fetch(`${base.value}/smq/indicateurs/${indicateurId}/assigner-copilote`, {
      method: 'POST', headers: jsonHeaders(), body: { entite_id: entiteId },
    })
    return res?.data ?? res
  }

  const fetchHistoriques = async (id) => {
    const res = await $fetch(`${base.value}/smq/indicateurs/${id}/historiques`, { headers: headers() })
    return res?.data ?? res ?? []
  }

  // ── Stats dashboard (calculées côté front depuis /smq/saisies) ────────────

  /**
   * Charge les stats globales pour le dashboard MG :
   *   - indicateurs : depuis GET /smq/indicateurs?exercice_id=X&per_page=200
   *   - saisies récentes : GET /smq/saisies?exercice_id=X&per_page=10
   *   - alertes : GET /smq/saisies?exercice_id=X&conformite=non_conforme&statut=transmis&per_page=10
   */
  const fetchDashboard = async (exerciceId) => {
    const q = exerciceId ? `?exercice_id=${exerciceId}&per_page=200` : '?per_page=200'
    const [indRes, saisiesRes, alertesRes] = await Promise.all([
      $fetch(`${base.value}/smq/indicateurs${q}`, { headers: headers() }).catch(() => null),
      $fetch(`${base.value}/smq/saisies?exercice_id=${exerciceId || ''}&per_page=8`, { headers: headers() }).catch(() => null),
      $fetch(`${base.value}/smq/saisies?exercice_id=${exerciceId || ''}&conformite=non_conforme&per_page=6`, { headers: headers() }).catch(() => null),
    ])

    const indicateurs = indRes?.data?.data ?? indRes?.data ?? []
    const total       = indicateurs.length
    const conformes     = indicateurs.filter(i => i.conformite === 'conforme').length
    const nonConformes  = indicateurs.filter(i => i.conformite === 'non_conforme').length
    const enAttente     = indicateurs.filter(i => i.conformite === 'en_attente').length
    const tauxConformite = total ? Math.round((conformes / total) * 1000) / 10 : 0

    // Répartition par direction
    const directions = {}
    indicateurs.forEach(ind => {
      if (ind.direction) {
        if (!directions[ind.direction]) directions[ind.direction] = { total: 0, conformes: 0 }
        directions[ind.direction].total++
        if (ind.conformite === 'conforme') directions[ind.direction].conformes++
      }
    })

    const saisies = saisiesRes?.data?.data ?? []
    const activiteRecente = saisies.map(s => ({
      id:      s.id,
      statut:  s.statut,
      code:    s.indicateur?.code,
      libelle: s.indicateur?.libelle ?? '—',
      detail:  s.copilote_nom ? `${mapStatutLabel(s.statut)} par ${s.copilote_nom}` : mapStatutLabel(s.statut),
    }))

    const alertes = (alertesRes?.data?.data ?? []).map(s => ({
      id:         s.id,
      code:       s.indicateur?.code,
      libelle:    s.indicateur?.libelle ?? '—',
      direction:  s.indicateur?.direction ?? '—',
      conformite: s.conformite,
      resultat:   s.resultat,
      valeurCible: s.indicateur?.valeur_cible,
      critere:    s.indicateur?.critere,
    }))

    return {
      stats: { total, conformes, non_conformes: nonConformes, en_attente: enAttente, taux_conformite: tauxConformite, nb_directions: Object.keys(directions).length },
      directions,
      activiteRecente,
      alertes,
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  const mapStatutLabel = (s) => ({
    brouillon: 'Brouillon',
    soumis:    'Soumis',
    valide:    'Validé',
    transmis:  'Transmis',
    retourne:  'Retourné',
  })[s] ?? s

  const critereSymbole = (c) => ({ gte: '≥', lte: '≤', eq: '=' })[c] ?? c

  const formatResultat = (val) => {
    if (val === null || val === undefined) return '—'
    return Number(val).toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 3 })
  }

  const formatPourcentage = (val) => {
    if (val === null || val === undefined) return '—'
    return Number(val).toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + ' %'
  }

  const formatDate = (d) => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const initialesAvatar = (nom) => {
    if (!nom) return '?'
    return nom.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
  }

  const calculerConformite = (resultat, valeurCible, critere) => {
    if (resultat === null || resultat === undefined || valeurCible === null) return 'en_attente'
    const r = parseFloat(resultat), c = parseFloat(valeurCible)
    if (critere === 'gte' || critere === '≥') return r >= c ? 'conforme' : 'non_conforme'
    if (critere === 'lte' || critere === '≤') return r <= c ? 'conforme' : 'non_conforme'
    if (critere === 'eq'  || critere === '=') return Math.abs(r - c) < 1e-9 ? 'conforme' : 'non_conforme'
    return 'en_attente'
  }

  return {
    fetchIndicateurs, fetchIndicateur, createIndicateur,
    updateIndicateur, deleteIndicateur, fetchHistoriques,
    fetchServicesCopilotes, assignerCopilote,
    fetchDashboard,
    critereSymbole, formatResultat, formatPourcentage, formatDate,
    initialesAvatar, calculerConformite,
  }
}
