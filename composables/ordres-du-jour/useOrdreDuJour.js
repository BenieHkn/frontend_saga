// composables/useOrdreDuJour.js

export function useOrdreDuJour() {
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
    getOrdres:   ()           => api('/ordres-du-jour'),
    getOrdre:    (id)         => api(`/ordres-du-jour/${id}`),
    createOrdre: (body)       => api('/ordres-du-jour', { method: 'POST', body }),
    updateOrdre: (id, body)   => api(`/ordres-du-jour/${id}`, { method: 'PUT', body }),
    deleteOrdre: (id)         => api(`/ordres-du-jour/${id}`, { method: 'DELETE' }),
    addDossier: (ordreId, body) => api(`/ordres-du-jour/${ordreId}/dossiers`, { method: 'POST', body }),
    removeDossier: (ordreId, dossierId) => api(`/ordres-du-jour/${ordreId}/dossiers/${dossierId}`, { method: 'DELETE' }),
  }
}