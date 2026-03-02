// composables/courriers/useCourriersArrives.js
import { ref, computed } from 'vue'
import { useRuntimeConfig } from '#imports'

export const useCourriersArrives = () => {
  const courriers = ref([])
  const loading = ref(false)
  const error = ref(null)
  const config = useRuntimeConfig()

  // Récupérer le token depuis localStorage
  const getToken = () => {
    return localStorage.getItem('token') || localStorage.getItem('auth_token')
  }

  // ✅ CORRECTION : Transformer pour retourner l'ID du courrier (courrier_arrive_id)
  const transformCourrierData = (data) => {
    return data.map(item => ({
      id: item.id, // ✅ ID du courrier arrivé
      reference: item.document?.reference || 'N/A',
      objet: item.document?.objet || 'N/A',
      priority: item.priority || 'standard',
      type_arrivee: item.type_arrivee,
      confidentiel: item.confidentiel || false,
      structure: item.structure,
      date_sgm: item.date_sgm ? new Date(item.date_sgm).toLocaleDateString('fr-FR') : 'N/A',
      // ✅ Pour la compatibilité avec le store de transferts
      nb_courriers: 1,
      instructions: item.document?.in || '', // Utiliser l'objet comme instruction par défaut
      emetteur: item.structure || 'Externe',
      statut: 'en_cours',
      priority_badge: getPriorityBadge(item.priority),
      statut_badge: { label: 'En cours', color: 'blue' },
      // Garder les données complètes pour les actions
      _raw: item
    }))
  }

  // Obtenir le badge de priorité
  const getPriorityBadge = (priority) => {
    const badges = {
      'urgent': { label: 'Urgent', color: 'red' },
      'important': { label: 'Important', color: 'orange' },
      'standard': { label: 'Standard', color: 'blue' },
    }
    return badges[priority?.toLowerCase()] || { label: priority || 'Standard', color: 'gray' }
  }

  // Récupérer les courriers depuis l'API
  const fetchCourriers = async () => {
    loading.value = true
    error.value = null

    try {
      const token = getToken()
      
      if (!token) {
        throw new Error('Token d\'authentification non trouvé')
      }

      const response = await fetch(`${config.public.apiBase}/courriers-arrives`, {
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

      if (result.success && result.data) {
        courriers.value = transformCourrierData(result.data)
        console.log(`✅ ${courriers.value.length} courriers chargés pour transfert`)
        
        // ✅ DEBUG
        if (courriers.value.length > 0) {
          console.log('📋 Exemple de courrier transformé:', {
            id: courriers.value[0].id,
            reference: courriers.value[0].reference,
            objet: courriers.value[0].objet
          })
        }
      } else {
        throw new Error('Format de réponse invalide')
      }
    } catch (err) {
      error.value = err.message
      console.error('❌ Erreur lors du chargement des courriers:', err)
    } finally {
      loading.value = false
    }
  }

  // Données formatées pour le store Pinia
  const tableData = computed(() => courriers.value)

  return {
    courriers,
    loading,
    error,
    fetchCourriers,
    tableData
  }
}