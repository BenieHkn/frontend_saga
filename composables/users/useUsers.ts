export const useUsers = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase

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

  // Récupérer la liste des utilisateurs
  const fetchUsers = async (params?: {
    search?: string
    statut?: boolean
    per_page?: number
    page?: number
  }) => {
    try {
      const queryParams = new URLSearchParams()
      
      if (params?.search) queryParams.append('search', params.search)
      if (params?.statut !== undefined) queryParams.append('statut', params.statut.toString())
      if (params?.per_page) queryParams.append('per_page', params.per_page.toString())
      if (params?.page) queryParams.append('page', params.page.toString())

      const url = `${baseURL}/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

      const response = await $fetch(url, {
        method: 'GET',
        headers: getHeaders()
      })

      return response
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error)
      throw error
    }
  }

  // Récupérer un utilisateur spécifique
  const fetchUser = async (id: number) => {
    try {
      const response = await $fetch(`${baseURL}/users/${id}`, {
        method: 'GET',
        headers: getHeaders()
      })

      return response
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error)
      throw error
    }
  }

  // Créer un utilisateur
  const createUser = async (data: {
    matricule: string
    nom: string
    prenom: string
    email: string
    password?: string
    telephone?: string
    statut?: boolean
    is_superadmin?: boolean
    prise_service?: string
  }) => {
    try {
      const response = await $fetch(`${baseURL}/users`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      })

      return response
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error)
      throw error
    }
  }

  // Mettre à jour un utilisateur
  const updateUser = async (id: number, data: {
    matricule?: string
    nom?: string
    prenom?: string
    email?: string
    password?: string
    telephone?: string
    statut?: boolean
    is_superadmin?: boolean
    prise_service?: string
  }) => {
    try {
      const response = await $fetch(`${baseURL}/users/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      })

      return response
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error)
      throw error
    }
  }

  // Supprimer un utilisateur
  const deleteUser = async (id: number) => {
    try {
      const response = await $fetch(`${baseURL}/users/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      })

      return response
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error)
      throw error
    }
  }

  // Basculer le statut d'un utilisateur
  const toggleUserStatus = async (id: number) => {
    try {
      const response = await $fetch(`${baseURL}/users/${id}/toggle-status`, {
        method: 'POST',
        headers: getHeaders()
      })

      return response
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error)
      throw error
    }
  }

  // Obtenir les subordonnés d'un utilisateur
  const fetchSubordinates = async (id: number) => {
    try {
      const response = await $fetch(`${baseURL}/users/${id}/subordinates`, {
        method: 'GET',
        headers: getHeaders()
      })

      return response
    } catch (error) {
      console.error('Erreur lors de la récupération des subordonnés:', error)
      throw error
    }
  }

  // Obtenir la fonction principale d'un utilisateur
  const fetchMainFonction = async (id: number) => {
    try {
      const response = await $fetch(`${baseURL}/users/${id}/main-fonction`, {
        method: 'GET',
        headers: getHeaders()
      })

      return response
    } catch (error) {
      console.error('Erreur lors de la récupération de la fonction principale:', error)
      throw error
    }
  }

  return {
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    fetchSubordinates,
    fetchMainFonction
  }
}