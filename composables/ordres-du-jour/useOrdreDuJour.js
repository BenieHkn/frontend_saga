// composables/useOrdreDuJour.js
import { useRequestApi } from '@/composables/useRequestApi'

export function useOrdreDuJour() {
  // ✅ useRuntimeConfig() lit apiBase depuis nuxt.config.ts
  const { loading, error, call } = useRequestApi()

  return {
    loading,
    error,
    getOrdres:   ()           => call('/ordres-du-jour'),
    getOrdre:    (id)         => call(`/ordres-du-jour/${id}`),
    createOrdre: (body)       => call('/ordres-du-jour', { method: 'POST', body }),
    updateOrdre: (id, body)   => call(`/ordres-du-jour/${id}`, { method: 'PUT', body }),
    deleteOrdre: (id)         => call(`/ordres-du-jour/${id}`, { method: 'DELETE' }),
    addDossier: (ordreId, body) => call(`/ordres-du-jour/${ordreId}/dossiers`, { method: 'POST', body }),
    removeDossier: (ordreId, dossierId) => call(`/ordres-du-jour/${ordreId}/dossiers/${dossierId}`, { method: 'DELETE' }),
  }
}