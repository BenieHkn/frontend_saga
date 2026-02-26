// composables/useMembre.js
import { useRequestApi } from '@/composables/useRequestApi'

export function useMembre() {
  const { loading, error, call } = useRequestApi()
  return {
    loading, error,
    getMembres:  ()    => call('/membres'),
    getMembre:   (id)  => call(`/membres/${id}`),
    getTaches:   (id)  => call(`/membres/${id}/taches`),
    getPresence: (id)  => call(`/membres/${id}/presence`),
  }
}