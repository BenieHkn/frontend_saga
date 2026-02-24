export function useRequestApi() {
  const { public: { apiBase } } = useRuntimeConfig()
  const loading = ref(false)
  const error = ref(null)

  const getHeaders = (body = null) => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('auth_token') ?? ''}`,
    }
    // Si ce n'est pas un FormData, on force JSON
    // Si c'est un FormData, on laisse le navigateur gérer le Content-Type
    if (!(body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }
    return headers
  }

  async function call(url, opts = {}) {
    loading.value = true
    error.value = null
    try {
      return await $fetch(`${apiBase}${url}`, {
        headers: getHeaders(opts.body),
        ...opts,
      })
    } catch (e) {
      error.value = e?.data?.message ?? e?.message ?? 'Erreur réseau'
      throw e
    } finally {
      loading.value = false
    }
  }

  return { loading, error, call }
}