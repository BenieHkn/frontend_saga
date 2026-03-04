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
  
  // ── Option blob spéciale ──────────────────────────
  const isBlob = opts.blob === true
  const fetchOpts = { ...opts }
  delete fetchOpts.blob  // ne pas passer à $fetch
  // ─────────────────────────────────────────────────

  try {
    if (isBlob) {
      // Pour les fichiers binaires, on utilise fetch natif
      const res = await fetch(`${apiBase}${url}`, {
        method: fetchOpts.method ?? 'GET',
        headers: getHeaders(fetchOpts.body),
      })
      if (!res.ok) throw new Error(`Erreur ${res.status}`)
      return await res.blob()  // <-- retourne un Blob
    }

    return await $fetch(`${apiBase}${url}`, {
      headers: getHeaders(fetchOpts.body),
      ...fetchOpts,
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