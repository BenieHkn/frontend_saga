import { useRequestApi } from "@/composables/useRequestApi";

export function useAction() {
  const { loading, error, call } = useRequestApi()

  const getCurrentAction = async (id) => {
    if (!process.client || !id) return null
    try {
      // ✅ Appel API direct — taches avec codirs + pivot
      return await call(`/actions/${id}`)
    } catch (err) {
      console.error('Erreur récupération action:', err)
      return null
    }
  }

  return {
    loading,
    error,
    getActions:       ()               => call('/actions'),
    getAction:        (id)             => call(`/actions/${id}`),
    createAction:     (body)           => call('/actions', { method: 'POST', body }),
    updateAction:     (id, body)       => call(`/actions/${id}`, { method: 'PUT', body }),
    deleteAction:     (id)             => call(`/actions/${id}`, { method: 'DELETE' }),
    attachTache:      (actionId, body) => call(`/actions/${actionId}/attach-tache`, { method: 'POST', body }),
    getCurrentAction,
  }
}