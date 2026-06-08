

import { useRequestApi } from '@/composables/useRequestApi'
export function usePresence() {
  const { loading, error, call } = useRequestApi()
  const ENDPOINT = '/presence'

  return {
    loading,
    error,
    getPresences: () => call(`${ENDPOINT}`),
    getPresence: (id) => call(`${ENDPOINT}/${id}`),
    createPresence: (body) => call(`${ENDPOINT}s`, { method: 'POST', body }),
    updatePresence: (id, body) => call(`${ENDPOINT}/${id}`, { method: 'PUT', body }),
    deletePresence: (id) => call(`${ENDPOINT}/${id}`, { method: 'DELETE' }),
    checkPresence: (codirId, membreId) => call(`${ENDPOINT}/check/codir/${codirId}/membre/${membreId}`)
  }
}
