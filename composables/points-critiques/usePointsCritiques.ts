export const usePointsCritiques = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase || 'http://localhost:8000/api'

  // Récupérer le token d'authentification
  const getAuthToken = () => {
    if (process.client) {
      return localStorage.getItem('auth_token')
    }
    return null
  }

  // Headers avec authentification
  const getHeaders = () => {
    const token = getAuthToken()
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  }

  // Récupérer la liste des points critiques
  const fetchPointsCritiques = async (params?: {
    search?: string
    has_users?: boolean
  }) => {
    try {
      const queryParams = new URLSearchParams()
      
      if (params?.search) queryParams.append('search', params.search)
      if (params?.has_users !== undefined) {
        queryParams.append('has_users', params.has_users.toString())
      }

      const url = `${baseURL}/points-critiques${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

      const response = await $fetch(url, {
        method: 'GET',
        headers: getHeaders()
      })

      return response
    } catch (error) {
      console.error('Erreur lors de la récupération des points critiques:', error)
      throw error
    }
  }

  // Récupérer un point critique spécifique
  const fetchPointCritique = async (id: number) => {
    try {
      const response = await $fetch(`${baseURL}/points-critiques/${id}`, {
        method: 'GET',
        headers: getHeaders()
      })

      return response
    } catch (error) {
      console.error('Erreur lors de la récupération du point critique:', error)
      throw error
    }
  }

  // Créer un point critique
  const createPointCritique = async (data: {
    code: string
    libelle: string
  }) => {
    try {
      const response = await $fetch(`${baseURL}/points-critiques`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      })

      return response
    } catch (error) {
      console.error('Erreur lors de la création du point critique:', error)
      throw error
    }
  }

  // Mettre à jour un point critique
  const updatePointCritique = async (id: number, data: {
    code?: string
    libelle?: string
  }) => {
    try {
      const response = await $fetch(`${baseURL}/points-critiques/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      })

      return response
    } catch (error) {
      console.error('Erreur lors de la mise à jour du point critique:', error)
      throw error
    }
  }

  // Supprimer un point critique
  const deletePointCritique = async (id: number) => {
    try {
      const response = await $fetch(`${baseURL}/points-critiques/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      })

      return response
    } catch (error) {
      console.error('Erreur lors de la suppression du point critique:', error)
      throw error
    }
  }

  // Attacher un utilisateur à un point critique
  const attachUser = async (pointCritiqueId: number, data: {
    user_id: number
    statut?: boolean
    is_interim?: boolean
    piece_jointe?: string
    date_debut?: string
    date_fin?: string
  }) => {
    try {
      const response = await $fetch(`${baseURL}/points-critiques/${pointCritiqueId}/users`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      })

      return response
    } catch (error) {
      console.error('Erreur lors de l\'attachement de l\'utilisateur:', error)
      throw error
    }
  }

  // Détacher un utilisateur d'un point critique
  const detachUser = async (pointCritiqueId: number, userId: number) => {
    try {
      const response = await $fetch(`${baseURL}/points-critiques/${pointCritiqueId}/users/${userId}`, {
        method: 'DELETE',
        headers: getHeaders()
      })

      return response
    } catch (error) {
      console.error('Erreur lors du détachement de l\'utilisateur:', error)
      throw error
    }
  }

  // Mettre à jour la relation utilisateur-point critique
  const updateUserRelation = async (
    pointCritiqueId: number,
    userId: number,
    data: {
      statut?: boolean
      is_interim?: boolean
      piece_jointe?: string
      date_debut?: string
      date_fin?: string
    }
  ) => {
    try {
      const response = await $fetch(
        `${baseURL}/points-critiques/${pointCritiqueId}/users/${userId}`,
        {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify(data)
        }
      )

      return response
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la relation:', error)
      throw error
    }
  }

  // Obtenir les utilisateurs actifs
  const fetchActiveUsers = async (pointCritiqueId: number) => {
    try {
      const response = await $fetch(
        `${baseURL}/points-critiques/${pointCritiqueId}/users/active`,
        {
          method: 'GET',
          headers: getHeaders()
        }
      )

      return response
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs actifs:', error)
      throw error
    }
  }

  // Obtenir les utilisateurs permanents
  const fetchPermanentUsers = async (pointCritiqueId: number) => {
    try {
      const response = await $fetch(
        `${baseURL}/points-critiques/${pointCritiqueId}/users/permanent`,
        {
          method: 'GET',
          headers: getHeaders()
        }
      )

      return response
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs permanents:', error)
      throw error
    }
  }

  // Obtenir les utilisateurs intérimaires
  const fetchInterimUsers = async (pointCritiqueId: number) => {
    try {
      const response = await $fetch(
        `${baseURL}/points-critiques/${pointCritiqueId}/users/interim`,
        {
          method: 'GET',
          headers: getHeaders()
        }
      )

      return response
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs intérimaires:', error)
      throw error
    }
  }

  return {
    fetchPointsCritiques,
    fetchPointCritique,
    createPointCritique,
    updatePointCritique,
    deletePointCritique,
    attachUser,
    detachUser,
    updateUserRelation,
    fetchActiveUsers,
    fetchPermanentUsers,
    fetchInterimUsers
  }
}