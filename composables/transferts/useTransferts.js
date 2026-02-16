// composables/useTransferts.js
import { ref, computed } from 'vue'

export const useTransferts = () => {
  const transferts = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Récupérer le token depuis localStorage
  const getToken = () => {
    return localStorage.getItem('token') || localStorage.getItem('auth_token')
  }

  // Transformer les données de l'API pour le DataTable
  const transformTransfertData = (data) => {
    return data.map(item => ({
      id: item.id,
      date_transfert: new Date(item.date_affect).toLocaleDateString('fr-FR'),
      objet: item.instructions,
      statut: item.statut,
      type: item.type_affectation,
      courrier: item.courrier_arrive?.document?.objet || 'N/A',
      emetteur: item.emetteur?.entite?.fonction || 'N/A',
      destinataire: item.destinataire?.entite?.fonction || 'N/A',
      // Garder les données complètes pour les actions
      _raw: item
    }))
  }

  // Récupérer les transferts depuis l'API
  const fetchTransferts = async () => {
    loading.value = true
    error.value = null

    const entite_user = JSON.parse(localStorage.getItem("entite_user"))

    try {
      const token = getToken()

      if (!token) {
        throw new Error('Token d\'authentification non trouvé')
      }

      const response = await fetch(`http://localhost:8000/api/transferts/user/${entite_user.id}/emitted`, {
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
      console.log("Transferts récupérés", result.data)

      if (result.data) {
        transferts.value = transformTransfertData(result.data)
        console.log(transferts.value)
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

  // Données formatées pour le DataTable
  const tableData = computed(() => transferts.value)

  return {
    transferts,
    loading,
    error,
    fetchTransferts,
    tableData
  }
}