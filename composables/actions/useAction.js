import { useRequestApi } from "@/composables/useRequestApi";
export function useAction() {
  const { loading, error, call } = useRequestApi()
  return {
    loading,
    error,
    getActions:    ()           => call('/actions'),
    getAction:     (id)         => call(`/actions/${id}`),
    createAction:  (body)       => call('/actions', { method: 'POST', body }),
    updateAction:  (id, body)   => call(`/actions/${id}`, { method: 'PUT', body }),
    deleteAction:  (id)         => call(`/actions/${id}`, { method: 'DELETE' }),
    // Attacher une ou plusieurs tâches à une action
    // body attendu: { tache_ids: [1,2,3] } ou { tache_id: 1 }
    attachTache:   (actionId, body) => call(`/actions/${actionId}/attach-tache`, { method: 'POST', body }),
  }
}