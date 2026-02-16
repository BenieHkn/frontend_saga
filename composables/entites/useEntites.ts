import { ref } from 'vue'
import type { Ref } from 'vue'

export interface Entite {
  id?: number
  code: string
  libelle: string
  entite_hierarchique?: number | null
  created_at?: string
  updated_at?: string
}

export interface EntiteResponse {
  success: boolean
  data: Entite | Entite[] | {
    data: Entite[]
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
  message?: string
  errors?: Record<string, string[]>
}

export const useEntites = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase || 'http://localhost:8000/api'

  const entites: Ref<Entite[]> = ref([])
  const entite: Ref<Entite | null> = ref(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    currentPage: 1,
    lastPage: 1,
    perPage: 15,
    total: 0
  })

  /**
   * Helper pour récupérer les headers avec le token d'authentification
   */
  const getAuthHeaders = () => {
    let authToken = ""
    
    if (process.client) {
      authToken = localStorage.getItem('auth_token') || ""
    }

    return {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    }
  }

  /**
   * Récupérer la liste des entités avec pagination et recherche
   */
  const fetchEntites = async (params?: {
    page?: number
    per_page?: number
    search?: string
    loadAll?: boolean // Nouvelle option pour charger toutes les entités
  }) => {
    loading.value = true
    error.value = null

    try {
      const queryParams = new URLSearchParams()
      
      // Si loadAll est activé, on charge toutes les entités en une seule requête
      if (params?.loadAll) {
        queryParams.append('per_page', '1000') // Charger beaucoup d'entités
      } else {
        if (params?.page) queryParams.append('page', params.page.toString())
        if (params?.per_page) queryParams.append('per_page', params.per_page.toString())
      }
      
      if (params?.search) queryParams.append('search', params.search)

      const response = await $fetch<EntiteResponse>(
        `${baseURL}/entites?${queryParams.toString()}`,
        {
          method: 'GET',
          headers: getAuthHeaders()
        }
      )

      if (response.success && response.data) {
        const data = response.data as any
        if (data.data && Array.isArray(data.data)) {
          // Réponse paginée
          entites.value = data.data
          pagination.value = {
            currentPage: data.current_page,
            lastPage: data.last_page,
            perPage: data.per_page,
            total: data.total
          }
        } else if (Array.isArray(response.data)) {
          // Réponse simple
          entites.value = response.data
        }
      }

      return response
    } catch (e: any) {
      error.value = e.message || 'Erreur lors de la récupération des entités'
      console.error('Erreur fetchEntites:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  /**
   * Récupérer TOUTES les entités (sans pagination) pour les sélecteurs
   */
  const fetchAllEntites = async () => {
    loading.value = true
    error.value = null

    try {
      const allEntites: Entite[] = []
      let currentPage = 1
      let lastPage = 1

      // Charger la première page pour connaître le nombre total de pages
      do {
        const queryParams = new URLSearchParams()
        queryParams.append('page', currentPage.toString())
        queryParams.append('per_page', '100') // Charger 100 éléments par page

        const response = await $fetch<EntiteResponse>(
          `${baseURL}/entites?${queryParams.toString()}`,
          {
            method: 'GET',
            headers: getAuthHeaders()
          }
        )

        if (response.success && response.data) {
          const data = response.data as any
          if (data.data && Array.isArray(data.data)) {
            allEntites.push(...data.data)
            lastPage = data.last_page
          }
        }

        currentPage++
      } while (currentPage <= lastPage)

      entites.value = allEntites
      
      return allEntites
    } catch (e: any) {
      error.value = e.message || 'Erreur lors de la récupération des entités'
      console.error('Erreur fetchAllEntites:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  /**
   * Récupérer une entité par son ID
   */
  const fetchEntite = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<EntiteResponse>(`${baseURL}/entites/${id}`, {
        method: 'GET',
        headers: getAuthHeaders()
      })

      if (response.success && response.data) {
        entite.value = response.data as Entite
      }

      return response
    } catch (e: any) {
      error.value = e.message || 'Erreur lors de la récupération de l\'entité'
      console.error('Erreur fetchEntite:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  /**
   * Créer une nouvelle entité
   */
  const createEntite = async (data: Omit<Entite, 'id' | 'created_at' | 'updated_at'>) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<EntiteResponse>(`${baseURL}/entites`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      })

      if (response.success) {
        // Rafraîchir la liste
        await fetchEntites()
      }

      return response
    } catch (e: any) {
      error.value = e.data?.message || e.message || 'Erreur lors de la création de l\'entité'
      console.error('Erreur createEntite:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  /**
   * Mettre à jour une entité
   */
  const updateEntite = async (id: number, data: Partial<Entite>) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<EntiteResponse>(`${baseURL}/entites/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      })

      if (response.success) {
        await fetchEntites()
      }

      return response
    } catch (e: any) {
      error.value = e.data?.message || e.message || 'Erreur lors de la mise à jour de l\'entité'
      console.error('Erreur updateEntite:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  /**
   * Supprimer une entité
   */
  const deleteEntite = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<EntiteResponse>(`${baseURL}/entites/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      if (response.success) {
        await fetchEntites()
      }

      return response
    } catch (e: any) {
      error.value = e.data?.message || e.message || 'Erreur lors de la suppression de l\'entité'
      console.error('Erreur deleteEntite:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  /**
   * Récupérer l'organigramme d'une entité
   */
  const fetchOrganigramme = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<EntiteResponse>(`${baseURL}/entites/${id}/organigramme`, {
        method: 'GET',
        headers: getAuthHeaders()
      })

      return response
    } catch (e: any) {
      error.value = e.message || 'Erreur lors de la récupération de l\'organigramme'
      console.error('Erreur fetchOrganigramme:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    entites,
    entite,
    loading,
    error,
    pagination,
    fetchEntites,
    fetchAllEntites,
    fetchEntite,
    createEntite,
    updateEntite,
    deleteEntite,
    fetchOrganigramme
  }
}