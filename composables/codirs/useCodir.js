// composables/useCodir.js

// ── Helpers de formatage ──────────────────────────────────────────────────────

export const extractTime = (iso) => iso ? iso.substring(11, 16) : ''
export const extractDateInput = (iso) => iso ? iso.split('T')[0] : ''
export const extractTimeInput = (iso) => iso ? iso.substring(11, 16) : ''

export const formatDateFR = (iso) =>
  iso ? new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) : ''

export const formatDateShort = (iso) =>
  iso ? new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }) : ''

// ── Config statuts ────────────────────────────────────────────────────────────

export const STATUT_CONFIG = {
  soumis: { label: 'Soumis', uiColor: 'blue', dotClass: 'bg-blue-400', badgeClass: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40' },
  clos: { label: 'Clos', uiColor: 'green', dotClass: 'bg-green-400', badgeClass: 'text-green-600 bg-green-50 dark:bg-green-950/40' },
}

export const PRIORITE_OPTIONS = [
  { label: 'urgente', value: 'urgente' },
  { label: 'Standard', value: 'standard' }
]

export const getStatutConfig = (statut) =>
  STATUT_CONFIG[statut] ?? { label: statut, uiColor: 'gray', dotClass: 'bg-gray-400', badgeClass: 'text-gray-500 bg-gray-100' }

export const STATUT_OPTIONS = [
  { label: 'Soumis', value: 'soumis' }, // ✅ FIX 1 — label 'soumis' → 'Soumis' (cohérence avec STATUT_CONFIG)
  { label: 'Clos', value: 'clos' },
]

export const TACHE_STATUT_OPTIONS = [
  { label: 'En attente', value: 'en_attente' },
  { label: 'En cours', value: 'en_cours' },
  { label: 'Réalisé', value: 'realisee' },
]

export const COLOR_TACHE_STATUT = {
  en_cours: 'blue',
  realisee: 'green',
}

export const PRIORITE_CONFIG = {
  haute: 'text-red-600 bg-red-50 dark:bg-red-950/30',
  standard: 'text-amber-600 bg-amber-50 dark:bg-amber-950/30',
}

// ── Composable ────────────────────────────────────────────────────────────────

export function useCodir() {
  const { loading, error, call } = useRequestApi()

  // ✅ FIX 2 — codir doit être un ref accessible dans fetchCodir
  const codir = ref(null)

  return {
    loading,
    error,
    codir,
    getCodirs: () => call('/codirs'),
    getCodir: (id) => call(`/codirs/${id}`),
    createCodir: (body) => call('/codirs', { method: 'POST', body }),
    updateCodir: (id, body) => call(`/codirs/${id}`, { method: 'PUT', body }),
    deleteCodir: (id) => call(`/codirs/${id}`, { method: 'DELETE' }),
    attachPrev: (id) => call(`/codirs/${id}/attach-previous`, { method: 'POST' }),
    attachODJ: (codirId, ordreId) => call(`/codirs/${codirId}/ordres-du-jour`, { method: 'POST', body: { ordre_du_jour_id: ordreId } }),
    detachODJ: (codirId, ordreId) => call(`/codirs/${codirId}/ordres-du-jour/${ordreId}`, { method: 'DELETE' }),
    attachTache: (codirId, body) => call(`/codirs/${codirId}/taches`, { method: 'POST', body }),
    updateTachePivot: (codirId, tacheId, body) => call(`/codirs/${codirId}/taches/${tacheId}`, { method: 'PUT', body }),
    detachTache: (codirId, tacheId, objetType) => call(`/codirs/${codirId}/taches/${tacheId}/${objetType}`, { method: 'DELETE' }),
    savePresences: (id, presences) => call(`/codirs/${id}/presences`, { method: 'POST', body: { presences } }),
    getPresences: (id) => call(`/codirs/${id}/presences`),
    downloadPdf: (id) => call(`/codirs/${id}/downloadPdf`, { method: 'GET', blob: true }),
    generatePdf: (id) => call(`/codirs/${id}/generatePdf`, { method: 'POST' }),
    cloturerCodir: (id) => call(`/codirs/${id}/cloturerCodir`, { method: 'PATCH' }),

    // ✅ FIX 3 — fetchCodir : syntaxe corrigée (async{} → async () => {})
    //            et appel via call() au lieu de getCodir() non défini dans ce scope
    fetchCodir: async (id) => {
      const data = await call(`/codirs/${id}`)
      codir.value = data
      if (process.client) {
        localStorage.setItem('currentCodir', JSON.stringify(data))
      }
      return data
    },
  }
}