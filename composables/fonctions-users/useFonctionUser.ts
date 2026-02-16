export const useFonctionUser = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase || 'http://localhost:8000/api'
  const toast = useToast()

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

  // Récupérer toutes les associations fonction-user
  const getFonctionUsers = async (params?: {
    user_id?: number
    fonction_id?: number
    entite_id?: number
    actif?: boolean
  }) => {
    try {
      const queryParams = new URLSearchParams()
      
      if (params?.user_id) queryParams.append('user_id', params.user_id.toString())
      if (params?.fonction_id) queryParams.append('fonction_id', params.fonction_id.toString())
      if (params?.entite_id) queryParams.append('entite_id', params.entite_id.toString())
      if (params?.actif !== undefined) queryParams.append('actif', params.actif.toString())

      const url = `${baseURL}/fonction-users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

      const response = await $fetch(url, {
        method: 'GET',
        headers: getHeaders()
      })

      return response
    } catch (err: any) {
      toast.add({
        title: 'Erreur',
        description: err?.data?.message || 'Erreur lors de la récupération des associations',
        color: 'red'
      })
      throw err
    }
  }

  // Créer une nouvelle association fonction-user
  const createFonctionUser = async (payload: {
    fonction_id: number
    user_id: number
    date_debut?: string
    date_fin?: string
    actif?: boolean
    is_interim?: boolean
    piece_jointe?: File
  }) => {
    try {
      const formData = new FormData()
      formData.append('fonction_id', payload.fonction_id.toString())
      formData.append('user_id', payload.user_id.toString())
      
      if (payload.date_debut) formData.append('date_debut', payload.date_debut)
      if (payload.date_fin) formData.append('date_fin', payload.date_fin)
      if (payload.actif !== undefined) formData.append('actif', payload.actif ? '1' : '0')
      if (payload.is_interim !== undefined) formData.append('is_interim', payload.is_interim ? '1' : '0')
      if (payload.piece_jointe) formData.append('piece_jointe', payload.piece_jointe)

      const token = getAuthToken()
      const response = await $fetch(`${baseURL}/fonction-users`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: formData
      })

      toast.add({
        title: 'Succès',
        description: 'Fonction attribuée avec succès',
        color: 'green'
      })

      return response
    } catch (err: any) {
      toast.add({
        title: 'Erreur',
        description: err?.data?.message || 'Erreur lors de l\'attribution de la fonction',
        color: 'red'
      })
      throw err
    }
  }

  // Mettre à jour une association
  const updateFonctionUser = async (id: number, payload: Partial<{
    fonction_id: number
    user_id: number
    date_debut: string
    date_fin: string
    actif: boolean
    is_interim: boolean
    piece_jointe: File
  }>) => {
    try {
      const formData = new FormData()
      
      if (payload.fonction_id) formData.append('fonction_id', payload.fonction_id.toString())
      if (payload.user_id) formData.append('user_id', payload.user_id.toString())
      if (payload.date_debut) formData.append('date_debut', payload.date_debut)
      if (payload.date_fin) formData.append('date_fin', payload.date_fin)
      if (payload.actif !== undefined) formData.append('actif', payload.actif ? '1' : '0')
      if (payload.is_interim !== undefined) formData.append('is_interim', payload.is_interim ? '1' : '0')
      if (payload.piece_jointe) formData.append('piece_jointe', payload.piece_jointe)

      const token = getAuthToken()
      const response = await $fetch(`${baseURL}/fonction-users/${id}`, {
        method: 'POST', // Laravel utilise POST avec _method pour PUT avec fichiers
        headers: {
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: formData
      })

      // Ajouter _method pour Laravel
      formData.append('_method', 'PUT')

      toast.add({
        title: 'Succès',
        description: 'Association mise à jour avec succès',
        color: 'green'
      })

      return response
    } catch (err: any) {
      toast.add({
        title: 'Erreur',
        description: err?.data?.message || 'Erreur lors de la mise à jour',
        color: 'red'
      })
      throw err
    }
  }

  // Supprimer une association
  const deleteFonctionUser = async (id: number) => {
    try {
      const response = await $fetch(`${baseURL}/fonction-users/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      })

      toast.add({
        title: 'Succès',
        description: 'Association supprimée avec succès',
        color: 'green'
      })

      return response
    } catch (err: any) {
      toast.add({
        title: 'Erreur',
        description: err?.data?.message || 'Erreur lors de la suppression',
        color: 'red'
      })
      throw err
    }
  }

  // Récupérer les associations actives
  const getActiveAssociations = async () => {
    try {
      const response = await $fetch(`${baseURL}/fonction-users/active`, {
        method: 'GET',
        headers: getHeaders()
      })

      return response
    } catch (err: any) {
      toast.add({
        title: 'Erreur',
        description: 'Erreur lors de la récupération des associations actives',
        color: 'red'
      })
      throw err
    }
  }

  // Récupérer les fonctions d'un utilisateur
  const getUserFunctions = async (userId: number) => {
    try {
      const response = await $fetch(`${baseURL}/fonction-users/user/${userId}`, {
        method: 'GET',
        headers: getHeaders()
      })

      return response
    } catch (err: any) {
      toast.add({
        title: 'Erreur',
        description: 'Erreur lors de la récupération des fonctions',
        color: 'red'
      })
      throw err
    }
  }

  // Récupérer les utilisateurs d'une fonction
  const getFunctionUsers = async (fonctionId: number) => {
    try {
      const response = await $fetch(`${baseURL}/fonction-users/fonction/${fonctionId}`, {
        method: 'GET',
        headers: getHeaders()
      })

      return response
    } catch (err: any) {
      toast.add({
        title: 'Erreur',
        description: 'Erreur lors de la récupération des utilisateurs',
        color: 'red'
      })
      throw err
    }
  }

  return {
    getFonctionUsers,
    createFonctionUser,
    updateFonctionUser,
    deleteFonctionUser,
    getActiveAssociations,
    getUserFunctions,
    getFunctionUsers
  }
}