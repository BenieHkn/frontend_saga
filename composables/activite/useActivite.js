import { useRequestApi } from "@/composables/useRequestApi";

export function useActivite() {
  const { loading, error, call } = useRequestApi()
  return {
    loading,
    error,
    getActivites: ()         => call('/activites'),
    getActivite:  (id)       => call(`/activites/${id}`),
    createActivite: (body)   => call('/activites', { method: 'POST', body }),
    updateActivite: (id, body) => call(`/activites/${id}`, { method: 'PUT', body }),
    deleteActivite: (id)     => call(`/activites/${id}`, { method: 'DELETE' }),
    // Attacher une ou plusieurs tâches à une activité
    // body attendu: { tache_ids: [1,2,3] } ou { tache_id: 1 }
    attachTache: (activiteId, body) => call(`/activites/${activiteId}/attach-tache`, { method: 'POST', body }),
  }
}