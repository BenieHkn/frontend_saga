import { ref } from 'vue'
import { useTransfertsStore } from '~/stores/transferts'
import { useRuntimeConfig } from '#imports'
import { useAuth } from '~/composables/auth/useAuth'


export const useTransfertsForm = () => {
  const store = useTransfertsStore()
  const config = useRuntimeConfig()
  const { isSecDir, getDirecteurEntiteUserId } = useAuth()


  const loading = ref(false)
  const error = ref(null)
  const success = ref(false)

  // 🔐 Récupérer le token
  const getToken = () => {
    return localStorage.getItem('token') || localStorage.getItem('auth_token')
  }

  // 👤 Récupérer l'ID de l'émetteur depuis selected_entite

  const getEmetteurId = () => {
    if (!process.client) return null

    const saved = localStorage.getItem('entite_user')
    if (!saved) return null

    const entite_user = JSON.parse(saved)
    if (!entite_user?.id) return null

    // Si secrétariat de direction → utiliser l'ID du directeur
    const directeurId = getDirecteurEntiteUserId()
    if (isSecDir() && directeurId) {
      return directeurId
    }

    return entite_user.entite_user_id ?? entite_user.id
  }

  console.log(`... ${getEmetteurId()}`) 
  // 📤 Envoyer les transferts (un par un)
  const sendTransferts = async (additionalData = {}) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      const token = getToken()

      if (!token) {
        throw new Error('Token d\'authentification non trouvé')
      }

      // Récupérer l'émetteur automatiquement
      const emetteurId = getEmetteurId()

      if (!emetteurId) {
        throw new Error('Fonction de l\'émetteur non trouvée. Veuillez sélectionner une fonction.')
      }

      // Validation
      if (store.selectedCourriers.length === 0) {
        throw new Error('Veuillez sélectionner au moins un courrier')
      }

      if (store.selectedDestinataires.length === 0) {
        throw new Error('Veuillez sélectionner au moins un destinataire')
      }

      // Extraire les données des destinataires avec leurs IDs entite_user
      const destinataires = store.selectedDestinatairesData.map(d => {
        let destinataireId = d.id
        // if (typeof d.id === 'string' && d.id.includes('-')) {
        //   destinataireId = parseInt(d.id.split('-')[1])
        // } else if (d.entite_user_id) {
        //   destinataireId = d.entite_user_id
        // } else if (d.entite_user_id) {
        //   destinataireId = d.entite_user_id
        // }

        return {
          id: destinataireId,
          name: d.name || `${d.prenom} ${d.nom}`.trim()
        }
      }).filter(d => d.id)

      const totalTransferts = store.selectedCourriers.length * destinataires.length

      console.log(`📤 Envoi de ${totalTransferts} transfert(s)...`)

      const results = []
      const errors = []
      const details = []
      let successCount = 0

      // Créer un transfert pour chaque combinaison courrier-destinataire
      for (const courrierId of store.selectedCourriers) {
        for (const destinataire of destinataires) {
          try {
            const transferData = {
              courrier_arrive_id: courrierId,
              emetteur_id: emetteurId,
              destinataire_id: destinataire.id,
              date_affect: new Date().toISOString().split('T')[0],
              instructions: additionalData.objet || 'Transfert de courrier',
              type_affectation: 'transfert',
              priority: "standard"
            }

            console.log("les données de transfert", transferData)

            const response = await fetch(`${config.public.apiBase}/transferts`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify(transferData)
            })

            if (!response.ok) {
              const errorData = await response.json()
              throw new Error(errorData.message || `Erreur HTTP: ${response.status}`)
            }

            const result = await response.json()
            results.push(result)
            successCount++

            details.push({
              type: 'success',
              message: `Courrier #${courrierId} → ${destinataire.name}`
            })

            console.log(`✅ Transfert créé: Courrier ${courrierId} → ${destinataire.name}`)

          } catch (err) {
            errors.push({
              courrierId,
              destinataire: destinataire.name,
              error: err.message
            })


            details.push({
              type: 'error',
              message: `Courrier #${courrierId} → ${destinataire.name}: ${err.message}`
            })

            console.error(`❌ Erreur transfert Courrier ${courrierId} → ${destinataire.name}:`, err)
          }
        }
      }

      // Résumé des résultats
      if (successCount > 0) {
        success.value = true
      }

      if (errors.length > 0) {
        error.value = `${errors.length} transfert(s) en échec`
      }

      // Réinitialiser les sélections si tous les transferts ont réussi
      if (errors.length === 0) {
        store.clearSelections()
      }

      console.log(`📊 Résumé: ${successCount} succès, ${errors.length} échecs`)

      // Retourner les données formatées pour la notification
      return {
        success: errors.length === 0,
        type: errors.length === 0 ? 'success' : (successCount > 0 ? 'warning' : 'error'),
        title: errors.length === 0
          ? 'Transferts envoyés'
          : (successCount > 0 ? 'Transferts partiellement envoyés' : 'Échec des transferts'),
        message: errors.length === 0
          ? `${successCount} transfert(s) créé(s) avec succès`
          : `${successCount} réussi(s), ${errors.length} échec(s) sur ${totalTransferts}`,
        details: details.length > 10 ? [] : details, // Ne pas afficher les détails si trop nombreux
        stats: {
          success: successCount,
          error: errors.length
        },
        data: {
          successCount,
          totalCount: totalTransferts,
          results,
          errors
        }
      }

    } catch (err) {
      error.value = err.message
      console.error('❌ Erreur globale envoi transferts:', err)

      return {
        success: false,
        type: 'error',
        title: 'Erreur de transfert',
        message: err.message
      }
    } finally {
      loading.value = false
    }
  }

  // 🗑️ Supprimer un courrier de la sélection
  const removeCourrierFromSelection = (id) => {
    store.removeCourrier(id)
  }

  // 🗑️ Supprimer un destinataire de la sélection
  const removeDestataireFromSelection = (id) => {
    const index = store.selectedDestinataires.indexOf(id)
    if (index > -1) {
      store.selectedDestinataires.splice(index, 1)
    }
  }

  // 🔄 Réinitialiser le formulaire
  const resetForm = () => {
    store.clearSelections()
    error.value = null
    success.value = false
  }

  return {
    // State
    loading,
    error,
    success,

    // Actions
    sendTransferts,
    removeCourrierFromSelection,
    removeDestataireFromSelection,
    resetForm,

    // Helpers
    getEmetteurId
  }
}