export function useMembre() {
  const { loading, error, call } = useRequestApi()

  return {
    loading,
    error,
    getMembres:    ()          => call('/membres'),
    getMembre:     (id)        => call(`/membres/${id}`),
    createMembre:  (body)      => call('/membres', { method: 'POST', body }),
    updateMembre:  (id, body)  => call(`/membres/${id}`, { method: 'PUT', body }),
    deleteMembre:  (id)        => call(`/membres/${id}`, { method: 'DELETE' }),
    getPresences:  (id)        => call(`/membres/${id}/presences`),
    getTaches:     (id)        => call(`/membres/${id}/taches`),
  }
}