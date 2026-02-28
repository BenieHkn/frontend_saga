// composables/useTransferts.js
import { ref, computed } from 'vue'
import { useRuntimeConfig } from '#imports'
import { useAuth } from '~/composables/auth/useAuth'

export const useTransferts = () => {
  const transferts = ref([])
  const loading = ref(false)
  const error = ref(null)
  const { isSecDir, getDirecteurEntiteUserId, peutVoirConfig } = useAuth()
  const config = useRuntimeConfig()

  const getToken = () => {
    return localStorage.getItem('token') || localStorage.getItem('auth_token')
  }

  const transformTransfertData = (data) => {
    return data.map(item => ({
      id: item.id,
      date_transfert: new Date(item.date_affect).toLocaleDateString('fr-FR'),
      objet: item.courrier_arrive?.document?.objet || 'N/A',
      statut: item.statut,
      type: item.type_affectation,
      reference: item.courrier_arrive?.document?.reference || 'N/A',
      emetteur: item.emetteur?.entite?.fonction || 'N/A',
      destinataire: item.destinataire?.entite?.fonction || 'N/A',
      priority: item.courrier_arrive?.priority || 'N/A',
      _raw: item
    }))
  }

  const fetchTransferts = async () => {
    loading.value = true
    error.value = null

    try {
      const token = getToken()

      if (!token) {
        throw new Error('Token d\'authentification non trouvé')
      }

      // Admin → tous les transferts, sinon filtre par émetteur
      let endpoint

      if (peutVoirConfig()) {
        // Admin : endpoint global
        endpoint = `${config.public.apiBase}/transferts`
      } else {
        const entite_user = JSON.parse(localStorage.getItem('entite_user'))

        if (!entite_user?.id) {
          throw new Error('Aucune fonction utilisateur sélectionnée')
        }

        const emetteurId = isSecDir()
          ? (getDirecteurEntiteUserId() ?? entite_user.id)
          : entite_user.id

        console.log(`📝 Chargement transferts pour emetteur_id: ${emetteurId}`)
        endpoint = `${config.public.apiBase}/transferts/user/${emetteurId}/emitted`
      }

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }

      const result = await response.json()
      console.log('Transferts récupérés:', result.data)

      if (result.data) {
        transferts.value = transformTransfertData(result.data)
      } else {
        throw new Error('Format de réponse invalide')
      }

    } catch (err) {
      error.value = err.message
      console.error('Erreur lors du chargement des transferts:', err)
    } finally {
      loading.value = false
    }
  }

  const tableData = computed(() => transferts.value)

  return {
    transferts,
    loading,
    error,
    fetchTransferts,
    tableData,
    config
  }
}