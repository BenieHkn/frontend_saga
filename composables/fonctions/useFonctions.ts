export const useFonctions = () => {
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

  // Récupérer la liste des fonctions
  const fetchFonctions = async (params?: {
    search?: string
    entite_id?: number
    per_page?: number
    page?: number
  }) => {
    try {
      const queryParams = new URLSearchParams()
      
      if (params?.search) queryParams.append('search', params.search)
      if (params?.entite_id) queryParams.append('entite_id', params.entite_id.toString())
      if (params?.per_page) queryParams.append('per_page', params.per_page.toString())
      if (params?.page) queryParams.append('page', params.page.toString())

      const url = `${baseURL}/fonctions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

      const response = await $fetch(url, {
        method: 'GET',
        headers: getHeaders()
      })

      return response
    } catch (error) {
      console.error('Erreur lors de la récupération des fonctions:', error)
      throw error
    }
  }

  // Récupérer une fonction spécifique
  const fetchFonction = async (id: number) => {
    try {
      const response = await $fetch(`${baseURL}/fonctions/${id}`, {
        method: 'GET',
        headers: getHeaders()
      })

      return response
    } catch (error) {
      console.error('Erreur lors de la récupération de la fonction:', error)
      throw error
    }
  }

  // Créer une fonction
  const createFonction = async (data: {
    code: string
    libelle: string
    entite_id: number
  }) => {
    try {
      const response = await $fetch(`${baseURL}/fonctions`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      })

      return response
    } catch (error) {
      console.error('Erreur lors de la création de la fonction:', error)
      throw error
    }
  }

  // Mettre à jour une fonction
  const updateFonction = async (id: number, data: {
    code?: string
    libelle?: string
    entite_id?: number
  }) => {
    try {
      const response = await $fetch(`${baseURL}/fonctions/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      })

      return response
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la fonction:', error)
      throw error
    }
  }

  // Supprimer une fonction
  const deleteFonction = async (id: number) => {
    try {
      const response = await $fetch(`${baseURL}/fonctions/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      })

      return response
    } catch (error) {
      console.error('Erreur lors de la suppression de la fonction:', error)
      throw error
    }
  }

  return {
    fetchFonctions,
    fetchFonction,
    createFonction,
    updateFonction,
    deleteFonction
  }
}