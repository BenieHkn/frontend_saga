// composables/useCodir.js

// ── Helpers de formatage ──────────────────────────────────────────────────────

export const extractTime      = (iso) => iso ? iso.substring(11, 16) : ''
export const extractDateInput = (iso) => iso ? iso.split('T')[0] : ''
export const extractTimeInput = (iso) => iso ? iso.substring(11, 16) : ''

export const formatDateFR = (iso) =>
  iso ? new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) : ''

export const formatDateShort = (iso) =>
  iso ? new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }) : ''

// ── Config statuts ────────────────────────────────────────────────────────────

export const STATUT_CONFIG = {
  nouveau:   { label: 'Nouveau',  uiColor: 'blue',  dotClass: 'bg-blue-400',  badgeClass: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40' },
  'terminé': { label: 'Terminé',  uiColor: 'green', dotClass: 'bg-green-400', badgeClass: 'text-green-600 bg-green-50 dark:bg-green-950/40' },
  clos:      { label: 'Clos',     uiColor: 'gray',  dotClass: 'bg-gray-400',  badgeClass: 'text-gray-500 bg-gray-100 dark:bg-gray-800/60' },
  en_cours:  { label: 'En cours', uiColor: 'amber', dotClass: 'bg-amber-400', badgeClass: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40' },
  'annulé':  { label: 'Annulé',   uiColor: 'red',   dotClass: 'bg-red-400',   badgeClass: 'text-red-600 bg-red-50 dark:bg-red-950/40' },
}

export const getStatutConfig = (statut) =>
  STATUT_CONFIG[statut] ?? { label: statut, uiColor: 'gray', dotClass: 'bg-gray-400', badgeClass: 'text-gray-500 bg-gray-100' }

export const STATUT_OPTIONS = [
  { label: 'Nouveau',  value: 'nouveau' },
  { label: 'En cours', value: 'en_cours' },
  { label: 'Terminé',  value: 'terminé' },
  { label: 'Clos',     value: 'clos' },
  { label: 'Annulé',   value: 'annulé' },
]

export const TACHE_STATUT_OPTIONS = [
  { label: 'En attente', value: 'en_attente' },
  { label: 'En cours',   value: 'en_cours' },
  { label: 'Terminée',   value: 'terminée' },
  { label: 'Bloquée',    value: 'bloquée' },
]

export const PRIORITE_CONFIG = {
  Haute:   'text-red-600 bg-red-50 dark:bg-red-950/30',
  Moyenne: 'text-amber-600 bg-amber-50 dark:bg-amber-950/30',
  Basse:   'text-green-600 bg-green-50 dark:bg-green-950/30',
}

// ── Composable ────────────────────────────────────────────────────────────────

export function useCodir() {
  // ✅ useRuntimeConfig() lit apiBase depuis nuxt.config.ts
  const { public: { apiBase } } = useRuntimeConfig()

  const loading = ref(false)
  const error = ref(null)

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('auth_token') ?? ''}`,
    'Content-Type': 'application/json',
  })

  async function api(url, opts = {}) {
    loading.value = true
    error.value = null
    try {
      return await $fetch(`${apiBase}${url}`, { headers: getHeaders(), ...opts })
    } catch (e) {
      error.value = e?.data?.message ?? e?.message ?? 'Erreur réseau'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    getCodirs:        ()                    => api('/codirs'),
    getCodir:         (id)                  => api(`/codirs/${id}`),
    createCodir:      (body)                => api('/codirs', { method: 'POST', body }),
    updateCodir:      (id, body)            => api(`/codirs/${id}`, { method: 'PUT', body }),
    deleteCodir:      (id)                  => api(`/codirs/${id}`, { method: 'DELETE' }),
    attachPrev:       (id)                  => api(`/codirs/${id}/attach-previous`, { method: 'POST' }),
    attachODJ:        (codirId, ordreId)    => api(`/codirs/${codirId}/ordres-du-jour`, { method: 'POST', body: { ordre_du_jour_id: ordreId } }),
    detachODJ:        (codirId, ordreId)    => api(`/codirs/${codirId}/ordres-du-jour/${ordreId}`, { method: 'DELETE' }),
    attachTache:      (codirId, body)       => api(`/codirs/${codirId}/taches`, { method: 'POST', body }),
    updateTachePivot: (codirId, tacheId, body) => api(`/codirs/${codirId}/taches/${tacheId}`, { method: 'PUT', body }),
    detachTache:      (codirId, tacheId)    => api(`/codirs/${codirId}/taches/${tacheId}`, { method: 'DELETE' }),
  }
}