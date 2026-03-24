import { useRequestApi } from '@/composables/useRequestApi'

export function useDossier() {
  const { loading, error, call } = useRequestApi()

  return {
    loading,
    error,
    getDossier:    (id)        => call(`/dossiers/${id}`),
    createDossier: (body)      => call('/dossiers', { method: 'POST', body }),
    updateDossier: (id, body)  => call(`/dossiers/${id}`, { method: 'PUT', body }),
    deleteDossier: (id)        => call(`/dossiers/${id}`, { method: 'DELETE' }),
    fetchDossier: (id) => {
      if (!process.client) return null

      const raw = localStorage.getItem('currentDossier')
      const currentOrdreDuJour = JSON.parse(localStorage.getItem('currentOrdreDuJour'))
      if (!raw) return null

      const currentDossier = JSON.parse(raw)
      const dossier = currentOrdreDuJour?.dossiers?.find(d => d.id === id) ?? null

      if (dossier)
        localStorage.setItem('currentDossier', JSON.stringify(dossier)) // ✅ clé cohérente

      return dossier
    }
  }
}