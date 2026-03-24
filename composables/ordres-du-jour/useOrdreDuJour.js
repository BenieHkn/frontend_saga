// composables/useOrdreDuJour.js
import { useRequestApi } from '@/composables/useRequestApi'

export function useOrdreDuJour() {
  // ✅ useRuntimeConfig() lit apiBase depuis nuxt.config.ts
  const { loading, error, call } = useRequestApi()

  return {
    loading,
    error,
    getOrdres: () => call('/ordres-du-jour'),
    getOrdre: (id) => call(`/ordres-du-jour/${id}`),
    createOrdre: (body) => call('/ordres-du-jour', { method: 'POST', body }),
    updateOrdre: (id, body) => call(`/ordres-du-jour/${id}`, { method: 'PUT', body }),
    deleteOrdre: (id) => call(`/ordres-du-jour/${id}`, { method: 'DELETE' }),
    addDossier: (ordreId, body) => call(`/ordres-du-jour/${ordreId}/dossiers`, { method: 'POST', body }),
    removeDossier: (ordreId, dossierId) => call(`/ordres-du-jour/${ordreId}/dossiers/${dossierId}`, { method: 'DELETE' }),
    fetchOrdre: async (id) => {
      if (!process.client) return null

      const raw = localStorage.getItem('currentCodir')
      if (!raw) return null

      const currentCodir = JSON.parse(raw)
      const currentOrdreDuJour = currentCodir?.ordres_du_jour?.find(o => o.id === id) ?? null

      if (currentOrdreDuJour)
        localStorage.setItem('currentOrdreDuJour', JSON.stringify(currentOrdreDuJour)) // ✅ clé cohérente

      return currentOrdreDuJour
    },
  }
}