// composables/affectations/useAffectations.js
import { ref, computed } from 'vue'

export const useAffectations = () => {
  const affectations = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Récupérer le token depuis localStorage
  const getToken = () => {
    return localStorage.getItem('token') || localStorage.getItem('auth_token')
  }

  // Formater les dates
  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Formater la liste des courriers (références séparées par virgule)
  const formatCourriers = (courriers) => {
    if (!courriers || courriers.length === 0) return 'Aucun courrier'
    return courriers.map(c => c.document?.reference || `Courrier #${c.id}`).join(', ')
  }

  // ✅ CORRECTION : Formater avec entité et is_responsable
  const formatDestinataires = (destinataires) => {
    if (!destinataires || destinataires.length === 0) return 'Aucun destinataire'
    
    return destinataires.map(d => {
      const nom = `${d.user?.nom || ''} ${d.user?.prenom || ''}`.trim()
      const code = d.entite?.code || ''
      const roleOuFonction = d.is_responsable 
        ? d.entite?.fonction 
        : 'Agent'
      
      return `${nom} (${code} - ${roleOuFonction})`
    }).join(', ')
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

  // Obtenir le badge de statut
  const getStatutBadge = (statut) => {
    const badges = {
      'en_cours': { label: 'En cours', color: 'blue' },
      'traite': { label: 'Traité', color: 'green' },
      'cloture': { label: 'Clôturé', color: 'purple' },
    }
    return badges[statut?.toLowerCase()] || { label: statut || 'N/A', color: 'gray' }
  }

  // ✅ CORRECTION : Transformer avec entité
  const transformAffectationData = (data) => {
    return data.map(affectation => {
      // ✅ Formater l'émetteur avec code entité et fonction/Agent
      let emetteurFormate = 'N/A'
      if (affectation.emetteur?.user?.nom && affectation.emetteur?.entite?.code) {
        const nom = `${affectation.emetteur.user.nom} ${affectation.emetteur.user.prenom || ''}`.trim()
        const code = affectation.emetteur.entite.code
        const roleOuFonction = affectation.emetteur.is_responsable
          ? affectation.emetteur.entite.fonction
          : 'Agent'
        emetteurFormate = `${nom} (${code} - ${roleOuFonction})`
      }

      return {
        id: affectation.id,
        
        // Informations de base
        instructions: affectation.instructions || 'N/A',
        statut: affectation.statut || 'en_cours',
        priority: affectation.priority || 'standard',
        date_affect: formatDate(affectation.date_affect),
        delai_traitement: formatDate(affectation.delai_traitement),
        date_cloture: formatDate(affectation.date_cloture),
        
        // ✅ Émetteur formaté avec entité
        emetteur: emetteurFormate,
        
        // Courriers (formaté pour affichage)
        courriers_text: formatCourriers(affectation.courriers || [affectation.courrier_arrive]),
        nb_courriers: affectation.courriers?.length || 1,
        
        // Destinataires (formaté pour affichage)
        destinataires_text: formatDestinataires(affectation.destinataires || [affectation.destinataire]),
        nb_destinataires: affectation.destinataires?.length || 1,
        
        // Badges pour l'affichage
        priority_badge: getPriorityBadge(affectation.priority),
        statut_badge: getStatutBadge(affectation.statut),
        
        // Garder les données complètes pour les actions
        _raw: affectation,
        courriers_list: affectation.courriers || [affectation.courrier_arrive],
        destinataires_list: affectation.destinataires || [affectation.destinataire],
        
        // ✅ Pour l'affichage dans la summary bar
        reference: affectation.courrier_arrive?.document?.reference || `#${affectation.id}`,
        name: affectation.courrier_arrive?.document?.objet || `Affectation #${affectation.id}`
      }
    })
  }

  // Récupérer les affectations depuis l'API
  const fetchAffectations = async () => {
    loading.value = true
    error.value = null
    
    try {
      const token = getToken()
      const entite_user = JSON.parse(localStorage.getItem('entite_user'))
      console.log("📥 entite_user:", entite_user)

      if (!token) {
        throw new Error('Token d\'authentification non trouvé')
      }

      if (!entite_user || !entite_user.id) {
        throw new Error('Entité utilisateur non trouvée')
      }

      const response = await fetch(`http://localhost:8000/api/affectations/user/${entite_user.id}/pending`, {
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

      // Adapter selon le format de votre API
      if (result.success && result.data) {
        affectations.value = transformAffectationData(result.data)
      } 
      else if (result.data) {
        affectations.value = transformAffectationData(result.data)
      }
      else if (Array.isArray(result)) {
        affectations.value = transformAffectationData(result)
      }
      else {
        throw new Error('Format de réponse invalide')
      }

      console.log(`✅ ${affectations.value.length} affectations chargées`)
      
      // ✅ Log d'exemple pour vérifier le formatage
      if (affectations.value.length > 0) {
        console.log('📋 Exemple d\'affectation formatée:', {
          id: affectations.value[0].id,
          emetteur: affectations.value[0].emetteur,
          reference: affectations.value[0].reference,
          nb_courriers: affectations.value[0].nb_courriers
        })
      }
    } catch (err) {
      error.value = err.message
      console.error('❌ Erreur lors du chargement des affectations:', err)
    } finally {
      loading.value = false
    }
  }

  // Données formatées pour le store Pinia ou l'affichage direct
  const tableData = computed(() => affectations.value)

  return {
    affectations,
    loading,
    error,
    fetchAffectations,
    tableData
  }
}