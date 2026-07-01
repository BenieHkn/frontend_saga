/**
 * useReferentiels — exercices, référentiels SMQ, périodicités, opérateurs, entités
 */
export const useReferentiels = () => {
  const config = useRuntimeConfig()
  const base   = computed(() => config.public.apiBase)

  const headers = (withJson = false) => {
    const token = process.client ? localStorage.getItem('auth_token') : ''
    const h = { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    if (withJson) h['Content-Type'] = 'application/json'
    return h
  }

  // ── Exercices ────────────────────────────────────────────────────────────────

  const fetchExercices = async () => {
    const res = await $fetch(`${base.value}/smq/exercices`, { headers: headers() })
    return res?.data ?? res ?? []
  }

  const fetchExerciceActif = async () => {
    const res = await $fetch(`${base.value}/smq/exercices/actif`, { headers: headers() })
    return res?.data ?? null
  }

  const createExercice = async (payload) => {
    const res = await $fetch(`${base.value}/smq/exercices`, {
      method: 'POST',
      headers: headers(true),
      body: payload,
    })
    return res?.data ?? res
  }

  const updateExercice = async (id, payload) => {
    const res = await $fetch(`${base.value}/smq/exercices/${id}`, {
      method: 'PUT',
      headers: headers(true),
      body: payload,
    })
    return res?.data ?? res
  }

  const deleteExercice = async (id) => {
    await $fetch(`${base.value}/smq/exercices/${id}`, {
      method: 'DELETE',
      headers: headers(),
    })
  }

  const cloturerExercice = async (id) => {
    const res = await $fetch(`${base.value}/smq/exercices/${id}/cloturer`, {
      method: 'POST',
      headers: headers(),
    })
    return res?.data ?? res
  }

  const setExerciceActif = async (id) => {
    const res = await $fetch(`${base.value}/smq/exercices/${id}/actif`, {
      method: 'POST',
      headers: headers(),
    })
    return res?.data ?? res
  }

  // ── Autres référentiels ───────────────────────────────────────────────────────

  const fetchPeriodicites = async () => {
    const res = await $fetch(`${base.value}/smq/periodicites`, { headers: headers() })
    return res?.data ?? res ?? []
  }

  const fetchOperateurs = async () => {
    const res = await $fetch(`${base.value}/smq/operateurs`, { headers: headers() })
    return res?.data ?? res ?? []
  }

  const fetchEntitesPremières = async () => {
    const res = await $fetch(`${base.value}/smq/entites-premieres`, { headers: headers() })
    return res?.data ?? res ?? []
  }

  return {
    fetchExercices, fetchExerciceActif,
    createExercice, updateExercice, deleteExercice, setExerciceActif, cloturerExercice,
    fetchPeriodicites, fetchOperateurs, fetchEntitesPremières,
  }
}
