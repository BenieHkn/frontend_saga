export function useEntiteUser() {
  const { loading, error, call } = useRequestApi()

  return {
    loading,
    error,
    getEntiteUsers: (params = {}) => call('/entite-users', { params }),
    getEntiteUser:  (id)          => call(`/entite-users/${id}`),
  }
}