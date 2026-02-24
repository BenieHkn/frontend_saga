export function useTache() {
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
    getTaches:  ()           => api('/taches'),
    getTache:   (id)         => api(`/taches/${id}`),
    createTache: (body)      => api('/taches', { method: 'POST', body }),
    updateTache: (id, body)  => api(`/taches/${id}`, { method: 'PUT', body }),
    deleteTache: (id)        => api(`/taches/${id}`, { method: 'DELETE' }),
  }
}