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
  }
}