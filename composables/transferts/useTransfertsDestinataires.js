// composables/transferts/useTransfertsDestinataires.js
import { ref, computed } from 'vue'

export const useDestinataires = () => {
  const destinataires = ref([])
  const loading = ref(false)
  const error = ref(null)
  const accessDenied = ref(false) // ✅ NOUVEAU : Flag pour 403

  // 🔐 Récupérer le token
  const getToken = () => {
    return localStorage.getItem('auth_token') || localStorage.getItem('token')
  }

  // 🎨 Transformer les données pour l'affichage
  const transformDestinataireData = (entiteUsers) => {
    const transformed = []

    entiteUsers.forEach(item => {
      const { user, entite } = item

      // Vérifier que l'utilisateur et l'affectation sont actifs
      if (item.actif && user) {
        transformed.push({
          // ID composite pour éviter les doublons
          id: item.id,
          
          // IDs séparés pour l'API
          user_id: user.id,
          entite_id: entite.id,
          affectation_id: item.id,
          
          // Informations utilisateur
          name: `${user.prenom} ${user.nom}`,
          email: user.email,
          initials: getInitials(user.prenom, user.nom),
          matricule: user.matricule,
          telephone: user.telephone,
          
          // Informations entité
          entite: entite.libelle,
          entite_code: entite.code,
          entite_id: entite.id,
          parent_entite_id: entite.parent_entite_id,
          parent_libelle: entite.parent_libelle,
          
          // Informations d'affectation
          date_debut: item.date_debut,
          date_fin: item.date_fin,
          is_interim: item.is_interim,
          is_responsable: item.is_responsable,
          
          // Données complètes pour référence
          _raw: {
            entiteUser: item,
            user,
            entite
          }
        })
      }
    })

    return transformed
  }

  // 🔤 Générer les initiales
  const getInitials = (prenom, nom) => {
    const p = prenom?.trim().charAt(0)?.toUpperCase() || ''
    const n = nom?.trim().charAt(0)?.toUpperCase() || ''
    return p + n || '??'
  }

  // 📡 Fetch destinataires depuis l'API
  const fetchDestinataires = async () => {
    loading.value = true
    error.value = null
    accessDenied.value = false // ✅ Réinitialiser le flag

    try {
      const token = getToken()
      
      if (!token) {
        throw new Error("Token d'authentification non trouvé. Veuillez vous reconnecter.")
      }

      let entite_user = null

      if (process.client) {
        const savedFunction = localStorage.getItem('entite_user')
        if (savedFunction) {
          entite_user = JSON.parse(savedFunction)
        }
      }

      if (!entite_user || !entite_user.id) {
        throw new Error('Aucune fonction utilisateur sélectionnée. Veuillez vous reconnecter.')
      }

      console.log(`🎯 Recherche de collègues de même rang pour l'entité: ${entite_user.id}`)

      // 📡 Appel à l'endpoint /entite-users/{id}/same-rank
      const response = await fetch(`http://localhost:8000/api/entite-users/${entite_user.id}/same-rank`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })

      // ✅ GESTION SPÉCIFIQUE DE L'ERREUR 403
      if (response.status === 403) {
        console.warn('🚫 Accès refusé : Vous ne pouvez pas effectuer de transfert')
        accessDenied.value = true // ✅ Marquer comme accès refusé
        error.value = 'Vous ne pouvez pas effectuer de transfert'
        destinataires.value = []
        return
      }

      if (!response.ok) {
        if (response.status === 404) {
          console.warn('⚠️ Aucun collègue trouvé au même niveau hiérarchique')
          destinataires.value = []
          return
        }
        throw new Error(`Erreur HTTP ${response.status}`)
      }

      const result = await response.json()

      if (!result.success || !result.data) {
        throw new Error('Format de réponse invalide')
      }

      console.log(`📊 Collègues de même rang récupérés: ${result.data.length}`)

      // Transformer les données
      destinataires.value = transformDestinataireData(result.data)

      console.log(`👥 Total destinataires disponibles pour le transfert: ${destinataires.value.length}`)

      if (destinataires.value.length === 0) {
        console.warn('⚠️ Aucun destinataire trouvé au même niveau hiérarchique')
      } else {
        console.log('✅ Destinataires:', destinataires.value.map(d => ({
          name: d.name,
          entite: d.entite,
          parent: d.parent_libelle
        })))
      }

    } catch (err) {
      error.value = err.message
      console.error('❌ Erreur lors du chargement des destinataires:', err)
    } finally {
      loading.value = false
    }
  }

  const tableData = computed(() => destinataires.value)

  return {
    destinataires,
    loading,
    error,
    accessDenied, // ✅ NOUVEAU : Exposer le flag
    fetchDestinataires,
    tableData
  }
}