/**
 * Composable pour gérer les types de documents
 * Récupère et cache les types de documents depuis l'API
 */

interface TypeDocument {
  id: number
  libelle: string
  visibilite: string
  parent_id: number
  created_at: string
  updated_at: string
}

interface ApiResponse {
  data: TypeDocument[]
  message?: string
  success?: boolean
}

export function useTypeDocuments() {
  const config = useRuntimeConfig()

  // États
  const typeDocuments = ref<TypeDocument[]>([])
  const errorMessage = ref<string | null>(null)
  const loading = ref(false)
  const hasBeenFetched = ref(false) // Cache pour éviter les appels répétés

  /**
   * ✅ Récupère les types de documents depuis l'API
   * Utilise un cache pour éviter les appels répétés
   */
  const getTypeDocuments = async (forceRefresh = false) => {
    // Si déjà chargé et pas de refresh forcé, retourner depuis le cache
    if (hasBeenFetched.value && !forceRefresh && typeDocuments.value.length > 0) {
      console.log('📦 Types de documents depuis cache')
      return typeDocuments.value
    }

    loading.value = true
    errorMessage.value = null

    try {
      // Récupérer le token d'authentification
      const authToken = process.client
        ? localStorage.getItem("auth_token") || ""
        : ""

      if (!authToken) {
        throw new Error("Token d'authentification manquant")
      }

      console.log('🔄 Chargement des types de documents...')

      // ✅ Utiliser $fetch au lieu de useFetch
      const response = await $fetch<ApiResponse>(
        `${config.public.laravelApiUrl}/type_documents`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      )

      // ✅ Vérifier que response et response.data existent
      if (!response || !response.data) {
        throw new Error('Format de réponse invalide')
      }

      // ✅ Vérifier que c'est un array
      if (!Array.isArray(response.data)) {
        throw new Error('Les données reçues ne sont pas un tableau')
      }

      typeDocuments.value = response.data
      hasBeenFetched.value = true

      console.log(`✅ ${response.data.length} types de documents chargés`)
      return response.data

    } catch (error: any) {
      console.error('❌ Erreur getTypeDocuments:', error)

      // ✅ Gestion d'erreur améliorée
      if (error.data?.message) {
        errorMessage.value = error.data.message
      } else if (error.message) {
        errorMessage.value = error.message
      } else if (error.statusCode === 401) {
        errorMessage.value = 'Authentification requise - Veuillez vous reconnecter'
      } else if (error.statusCode === 403) {
        errorMessage.value = 'Accès refusé - Vous n\'avez pas les permissions requises'
      } else if (error.statusCode === 404) {
        errorMessage.value = 'Endpoint non trouvé'
      } else if (error.statusCode >= 500) {
        errorMessage.value = 'Erreur serveur - Veuillez réessayer plus tard'
      } else {
        errorMessage.value = 'Erreur lors de la récupération des types de documents'
      }

      typeDocuments.value = []
      return []

    } finally {
      loading.value = false
    }
  }

  /**
   * ✅ Réinitialise les données
   */
  const reset = () => {
    typeDocuments.value = []
    errorMessage.value = null
    loading.value = false
    hasBeenFetched.value = false
  }

  /**
   * ✅ Trouve un type de document par ID
   */
  const getTypeDocumentById = (id: number): TypeDocument | undefined => {
    return typeDocuments.value.find(doc => doc.id === id)
  }

  /**
   * ✅ Trouve un type de document par libellé
   */
  const getTypeDocumentByLibelle = (libelle: string): TypeDocument | undefined => {
    return typeDocuments.value.find(doc => doc.libelle === libelle)
  }

  return {
    // États
    typeDocuments,
    errorMessage,
    loading,
    hasBeenFetched,

    // Méthodes
    getTypeDocuments,
    reset,
    getTypeDocumentById,
    getTypeDocumentByLibelle,
  }
}