export function useTache() {
  const { loading, error, call } = useRequestApi()
  return {
    loading,
    error,
    getTaches:                ()                      => call('/taches'),
    getUnlinkedTaches:        (dossierId)            => call(`/taches/unlinked/${dossierId}`),
    getTache:                 (id)                    => call(`/taches/${id}`),
    createTache:              (body)                  => call('/taches', { method: 'POST', body }),
    updateTache:              (id, body)               => call(`/taches/${id}`, { method: 'PUT', body }),
    deleteTache:              (id)                    => call(`/taches/${id}`, { method: 'DELETE' }),
    updateTacheProgression:   (tacheId, codirId, body) => call(`/taches/${tacheId}/codirs/${codirId}/progression`, { method: 'PUT', body }),
  }
}