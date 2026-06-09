/**
 * useFac — Actions correctives
 * Endpoint : /smq/actions-correctives
 * Statuts backend : ouvert | en_cours | clos
 */
export const useFac = () => {
  const config = useRuntimeConfig()
  const base   = computed(() => config.public.apiBase)

  const headers = () => {
    const token = process.client ? localStorage.getItem('auth_token') : ''
    return { Authorization: `Bearer ${token}`, Accept: 'application/json' }
  }
  const jsonHeaders = () => ({ ...headers(), 'Content-Type': 'application/json' })

  // ── CRUD ──────────────────────────────────────────────────────────────────

  const fetchFac = async (params = {}) => {
    const q = new URLSearchParams()
    if (params.statut)               q.set('statut',               params.statut)
    if (params.saisie_indicateur_id) q.set('saisie_indicateur_id', params.saisie_indicateur_id)
    if (params.per_page)             q.set('per_page',             params.per_page)
    const res = await $fetch(`${base.value}/smq/actions-correctives?${q}`, { headers: headers() })
    return res?.data ?? res
  }

  const fetchFacItem = async (id) => {
    const res = await $fetch(`${base.value}/smq/actions-correctives/${id}`, { headers: headers() })
    return res?.data ?? res
  }

  const createFac = async (data) => {
    const res = await $fetch(`${base.value}/smq/actions-correctives`, {
      method: 'POST', headers: jsonHeaders(), body: data,
    })
    return res?.data ?? res
  }

  const updateFac = async (id, data) => {
    const res = await $fetch(`${base.value}/smq/actions-correctives/${id}`, {
      method: 'PUT', headers: jsonHeaders(), body: data,
    })
    return res?.data ?? res
  }

  const deleteFac = async (id) =>
    $fetch(`${base.value}/smq/actions-correctives/${id}`, { method: 'DELETE', headers: headers() })

  const generateFacPdf = async (id) => {
    const token = process.client ? localStorage.getItem('auth_token') : ''
    const res = await fetch(`${base.value}/smq/actions-correctives/${id}/generate-pdf`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: `Erreur ${res.status}` }))
      throw new Error(err?.message ?? `Erreur ${res.status}`)
    }
    return res.json()
  }

  const downloadFacPdf = async (id) => {
    const token = process.client ? localStorage.getItem('auth_token') : ''
    const res = await fetch(`${base.value}/smq/actions-correctives/${id}/download-pdf`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: `Erreur ${res.status}` }))
      throw new Error(err?.message ?? `Erreur ${res.status}`)
    }
    return res.blob()
  }

  // ── Stats calculées côté front ────────────────────────────────────────────

  const fetchFacStats = async () => {
    const all = await fetchFac({ per_page: 200 })
    const list = all?.data ?? all ?? []
    return {
      ouvertes:    list.filter(f => f.statut === 'ouvert').length,
      en_cours:    list.filter(f => f.statut === 'en_cours').length,
      clos:        list.filter(f => f.statut === 'clos').length,
      total:       list.length,
    }
  }

  // ── Référentiels UI ───────────────────────────────────────────────────────

  const FAC_STATUTS = [
    { value: '',         label: 'Toutes'    },
    { value: 'ouvert',   label: 'Ouvertes'  },
    { value: 'en_cours', label: 'En cours'  },
    { value: 'clos',     label: 'Clôturées' },
  ]

  const badgeFacStatut = (statut) => ({
    ouvert:   'qp-badge--neutral',
    en_cours: 'qp-badge--info',
    clos:     'qp-badge--success',
  }[statut] ?? 'qp-badge--neutral')

  const labelFacStatut = (statut) => ({
    ouvert:   'Ouverte',
    en_cours: 'En cours',
    clos:     'Clôturée',
  }[statut] ?? statut)

  return {
    fetchFac, fetchFacItem, createFac, updateFac, deleteFac, fetchFacStats,
    generateFacPdf, downloadFacPdf,
    FAC_STATUTS, badgeFacStatut, labelFacStatut,
  }
}
