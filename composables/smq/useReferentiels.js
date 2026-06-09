/**
 * useReferentiels — exercices, périodicités, opérateurs, entités
 * Endpoints :
 *   GET /smq/exercices
 *   GET /smq/exercices/actif
 *   GET /smq/periodicites
 *   GET /smq/operateurs
 *   GET /smq/entites-premieres
 */
export const useReferentiels = () => {
  const config = useRuntimeConfig()
  const base   = computed(() => config.public.apiBase)

  const headers = () => {
    const token = process.client ? localStorage.getItem('auth_token') : ''
    return { Authorization: `Bearer ${token}`, Accept: 'application/json' }
  }

  const fetchExercices = async () => {
    const res = await $fetch(`${base.value}/smq/exercices`, { headers: headers() })
    return res?.data ?? res ?? []
  }

  const fetchExerciceActif = async () => {
    const res = await $fetch(`${base.value}/smq/exercices/actif`, { headers: headers() })
    return res?.data ?? null
  }

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

  return { fetchExercices, fetchExerciceActif, fetchPeriodicites, fetchOperateurs, fetchEntitesPremières }
}
