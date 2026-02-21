export const usePointsCritiquesUsers = () => {

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



  // Récupérer toutes les relations

  const fetchRelations = async (params?: {

    statut?: boolean

    is_interim?: boolean

    point_critique_id?: number

    user_id?: number

    en_cours?: boolean

  }) => {

    try {

      const queryParams = new URLSearchParams()

      

      if (params?.statut !== undefined) queryParams.append('statut', params.statut.toString())

      if (params?.is_interim !== undefined) queryParams.append('is_interim', params.is_interim.toString())

      if (params?.point_critique_id) queryParams.append('point_critique_id', params.point_critique_id.toString())

      if (params?.user_id) queryParams.append('user_id', params.user_id.toString())

      if (params?.en_cours !== undefined) queryParams.append('en_cours', params.en_cours.toString())



      const url = `${baseURL}/point-critique-user${queryParams.toString() ? `?${queryParams.toString()}` : ''}`



      const response = await $fetch(url, {

        method: 'GET',

        headers: getHeaders()

      })



      return response

    } catch (error) {

      console.error('Erreur lors de la récupération des relations:', error)

      throw error

    }

  }



  // Récupérer une relation spécifique

  const fetchRelation = async (id: number) => {

    try {

      const response = await $fetch(`${baseURL}/point-critique-user/${id}`, {

        method: 'GET',

        headers: getHeaders()

      })



      return response

    } catch (error) {

      console.error('Erreur lors de la récupération de la relation:', error)

      throw error

    }

  }



  // Créer une nouvelle relation

  const createRelation = async (data: {

    point_critique_id: number

    user_id: number

    statut?: boolean

    is_interim?: boolean

    piece_jointe?: File

    date_debut?: string

    date_fin?: string

  }) => {

    try {

      const formData = new FormData()

      formData.append('point_critique_id', data.point_critique_id.toString())

      formData.append('user_id', data.user_id.toString())

      

      // Convertir les booléens en 1 ou 0 pour Laravel

      if (data.statut !== undefined) formData.append('statut', data.statut ? '1' : '0')

      if (data.is_interim !== undefined) formData.append('is_interim', data.is_interim ? '1' : '0')

      if (data.piece_jointe) formData.append('piece_jointe', data.piece_jointe)

      if (data.date_debut) formData.append('date_debut', data.date_debut)

      if (data.date_fin) formData.append('date_fin', data.date_fin)



      const token = getAuthToken()

      const response = await $fetch(`${baseURL}/point-critique-user`, {

        method: 'POST',

        headers: {

          'Accept': 'application/json',

          ...(token && { 'Authorization': `Bearer ${token}` })

        },

        body: formData

      })



      return response

    } catch (error) {

      console.error('Erreur lors de la création de la relation:', error)

      throw error

    }

  }



  // Mettre à jour une relation

  const updateRelation = async (id: number, data: {

    statut?: boolean

    is_interim?: boolean

    piece_jointe?: File

    date_debut?: string

    date_fin?: string

  }) => {

    try {

      // Si on a une pièce jointe, on utilise FormData

      if (data.piece_jointe) {

        const formData = new FormData()

        formData.append('_method', 'PUT')

        

        // Convertir les booléens en 1 ou 0 pour Laravel

        if (data.statut !== undefined) formData.append('statut', data.statut ? '1' : '0')

        if (data.is_interim !== undefined) formData.append('is_interim', data.is_interim ? '1' : '0')

        if (data.piece_jointe) formData.append('piece_jointe', data.piece_jointe)

        if (data.date_debut) formData.append('date_debut', data.date_debut)

        if (data.date_fin) formData.append('date_fin', data.date_fin)



        const token = getAuthToken()

        const response = await $fetch(`${baseURL}/point-critique-user/${id}`, {

          method: 'POST',

          headers: {

            'Accept': 'application/json',

            ...(token && { 'Authorization': `Bearer ${token}` })

          },

          body: formData

        })



        return response

      } else {

        // Sinon, on utilise JSON

        const response = await $fetch(`${baseURL}/point-critique-user/${id}`, {

          method: 'PUT',

          headers: getHeaders(),

          body: JSON.stringify(data)

        })



        return response

      }

    } catch (error) {

      console.error('Erreur lors de la mise à jour de la relation:', error)

      throw error

    }

  }



  // Supprimer une relation

  const deleteRelation = async (id: number) => {

    try {

      const response = await $fetch(`${baseURL}/point-critique-user/${id}`, {

        method: 'DELETE',

        headers: getHeaders()

      })



      return response

    } catch (error) {

      console.error('Erreur lors de la suppression de la relation:', error)

      throw error

    }

  }



  // Télécharger une pièce jointe

  const downloadPieceJointeFile = async (id: number) => {

    try {

      const token = getAuthToken()

      const response = await fetch(`${baseURL}/point-critique-user/${id}/download`, {

        method: 'GET',

        headers: {

          'Authorization': `Bearer ${token}`

        }

      })



      if (!response.ok) {

        throw new Error('Erreur lors du téléchargement')

      }



      const blob = await response.blob()

      const url = window.URL.createObjectURL(blob)

      const a = document.createElement('a')

      a.href = url

      

      // Récupérer le nom du fichier depuis les headers

      const contentDisposition = response.headers.get('content-disposition')

      let filename = 'piece_jointe'

      

      if (contentDisposition) {

        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/)

        if (filenameMatch) {

          filename = filenameMatch[1]

        }

      }

      

      a.download = filename

      document.body.appendChild(a)

      a.click()

      window.URL.revokeObjectURL(url)

      document.body.removeChild(a)



      return { success: true }

    } catch (error) {

      console.error('Erreur lors du téléchargement de la pièce jointe:', error)

      throw error

    }

  }



  // Supprimer uniquement la pièce jointe

  const deletePieceJointe = async (id: number) => {

    try {

      const response = await $fetch(`${baseURL}/point-critique-user/${id}/piece-jointe`, {

        method: 'DELETE',

        headers: getHeaders()

      })



      return response

    } catch (error) {

      console.error('Erreur lors de la suppression de la pièce jointe:', error)

      throw error

    }

  }



  // Récupérer les relations actives

  const fetchActiveRelations = async (params?: {

    point_critique_id?: number

    user_id?: number

    is_interim?: boolean

  }) => {

    try {

      const queryParams = new URLSearchParams()

      

      if (params?.point_critique_id) queryParams.append('point_critique_id', params.point_critique_id.toString())

      if (params?.user_id) queryParams.append('user_id', params.user_id.toString())

      if (params?.is_interim !== undefined) queryParams.append('is_interim', params.is_interim.toString())



      const url = `${baseURL}/point-critique-user/active${queryParams.toString() ? `?${queryParams.toString()}` : ''}`



      const response = await $fetch(url, {

        method: 'GET',

        headers: getHeaders()

      })



      return response

    } catch (error) {

      console.error('Erreur lors de la récupération des relations actives:', error)

      throw error

    }

  }



  // Récupérer les relations permanentes

  const fetchPermanentRelations = async (params?: {

    point_critique_id?: number

    user_id?: number

  }) => {

    try {

      const queryParams = new URLSearchParams()

      

      if (params?.point_critique_id) queryParams.append('point_critique_id', params.point_critique_id.toString())

      if (params?.user_id) queryParams.append('user_id', params.user_id.toString())



      const url = `${baseURL}/point-critique-user/permanent${queryParams.toString() ? `?${queryParams.toString()}` : ''}`



      const response = await $fetch(url, {

        method: 'GET',

        headers: getHeaders()

      })



      return response

    } catch (error) {

      console.error('Erreur lors de la récupération des relations permanentes:', error)

      throw error

    }

  }



  // Récupérer les relations intérimaires

  const fetchInterimRelations = async (params?: {

    point_critique_id?: number

    user_id?: number

  }) => {

    try {

      const queryParams = new URLSearchParams()

      

      if (params?.point_critique_id) queryParams.append('point_critique_id', params.point_critique_id.toString())

      if (params?.user_id) queryParams.append('user_id', params.user_id.toString())



      const url = `${baseURL}/point-critique-user/interim${queryParams.toString() ? `?${queryParams.toString()}` : ''}`



      const response = await $fetch(url, {

        method: 'GET',

        headers: getHeaders()

      })



      return response

    } catch (error) {

      console.error('Erreur lors de la récupération des relations intérimaires:', error)

      throw error

    }

  }



  // Activer/désactiver une relation

  const toggleStatus = async (id: number) => {

    try {

      const response = await $fetch(`${baseURL}/point-critique-user/${id}/toggle-status`, {

        method: 'PUT',

        headers: getHeaders()

      })



      return response

    } catch (error) {

      console.error('Erreur lors du changement de statut:', error)

      throw error

    }

  }



  // Récupérer les statistiques

  const getStatistics = async (params?: {

    point_critique_id?: number

    user_id?: number

  }) => {

    try {

      const queryParams = new URLSearchParams()

      

      if (params?.point_critique_id) queryParams.append('point_critique_id', params.point_critique_id.toString())

      if (params?.user_id) queryParams.append('user_id', params.user_id.toString())



      const url = `${baseURL}/point-critique-user/statistics${queryParams.toString() ? `?${queryParams.toString()}` : ''}`



      const response = await $fetch(url, {

        method: 'GET',

        headers: getHeaders()

      })



      return response

    } catch (error) {

      console.error('Erreur lors de la récupération des statistiques:', error)

      throw error

    }

  }



  return {

    fetchRelations,

    fetchRelation,

    createRelation,

    updateRelation,

    deleteRelation,

    downloadPieceJointeFile,

    deletePieceJointe,

    fetchActiveRelations,

    fetchPermanentRelations,

    fetchInterimRelations,

    toggleStatus,

    getStatistics

  }

}