/**
 * useApi.js
 * Composable générique pour les appels API avec gestion
 * de l'authentification, des états de chargement et des erreurs.
 * Supporte GET, POST, PUT, DELETE.
 *
 * @example
 * // Utilisation GET
 * const { data, loading, error, execute } = useApi('api/entites', { immediate: true })
 *
 * @example
 * // Utilisation POST
 * const { execute: createEntite } = useApi('api/entites', { 
 *   method: 'POST',
 *   body: { code: 'DIR', libelle: 'Direction' }
 * })
 * await createEntite()
 *
 * @example
 * // Utilisation PUT
 * const { execute: updateEntite } = useApi('api/entites/1', {
 *   method: 'PUT',
 *   body: { libelle: 'Nouveau libellé' }
 * })
 * 
 * @example
 * // Avec transformation des données
 * const { data } = useApi('api/entites', {
 *   transform: (res) => res.data.map(item => ({ ...item, formattedType: formatType(item.type_entite) }))
 * })
 */

import { ref, onMounted } from 'vue'

/**
 * @typedef {Object} UseApiOptions
 * @property {string} [baseUrl=`${config.public.apiBaseUrl}`] - URL de base du serveur
 * @property {function} [transform] - Fonction de transformation appliquée à la réponse brute
 * @property {boolean} [immediate=false] - Si true, lance la requête dès le montage du composant
 * @property {function} [onError] - Callback déclenché en cas d'erreur (reçoit l'erreur)
 * @property {function} [onSuccess] - Callback déclenché en cas de succès (reçoit les données transformées)
 * @property {Object} [headers={}] - Headers additionnels à fusionner à la requête
 * @property {string} [method='GET'] - Méthode HTTP: GET, POST, PUT, DELETE, PATCH
 * @property {Object|FormData} [body=null] - Corps de la requête pour POST/PUT/PATCH
 * @property {boolean} [autoReset=false] - Si true, réinitialise les données après POST/PUT/DELETE
 */

/**
 * @typedef {Object} UseApiReturn
 * @property {import('vue').Ref<Array|Object|null>} data - Données retournées (après transformation)
 * @property {import('vue').Ref<boolean>} loading - État de chargement
 * @property {import('vue').Ref<string|null>} error - Message d'erreur (null si pas d'erreur)
 * @property {function} execute - Lance manuellement la requête
 * @property {function} refresh - Alias de execute pour GET (lisibilité)
 * @property {function} reset - Réinitialise data, loading, error à leurs valeurs initiales
 */

/**
 * Récupère le token d'authentification depuis le localStorage (côté client uniquement)
 * @returns {string} Le token Bearer ou une chaîne vide
 */
const getAuthToken = () => {
  if (typeof window !== 'undefined' && process.client) {
    return localStorage.getItem('auth_token') || ''
  }
  return ''
}

/**
 * Composable générique pour effectuer des requêtes API authentifiées.
 *
 * @param {string} endpoint - Le chemin de l'endpoint API (ex: 'api/entites')
 * @param {UseApiOptions} [options={}] - Options de configuration
 * @returns {UseApiReturn}
 */
export function useApi(endpoint, options = {}) {
  const config = useRuntimeConfig()

  const {
    baseUrl = config.public.apiBaseUrl,
    transform = null,
    immediate = false,
    onError = null,
    onSuccess = null,
    headers: extraHeaders = {},
    method = 'GET',
    body = null,
    autoReset = false,
  } = options

  // ---- État réactif ----
  const data = ref(method === 'GET' ? [] : null)
  const loading = ref(false)
  const error = ref(null)
  const response = ref(null) // Nouveau: stocke la réponse complète

  /**
   * Détermine le Content-Type approprié selon le type de body
   */
  const getContentType = (bodyData) => {
    if (bodyData instanceof FormData) {
      return null // Let fetch set the Content-Type automatically for FormData
    }
    return 'application/json'
  }

  /**
   * Effectue la requête vers l'endpoint.
   * Gère automatiquement le token Bearer, les états loading/error,
   * et applique la fonction de transformation si fournie.
   */
  const execute = async (customBody = null, customMethod = null) => {
    const token = getAuthToken()
    const requestMethod = customMethod || method
    const requestBody = customBody !== undefined ? customBody : body

    if (!token) {
      error.value = 'Token d\'authentification manquant. Veuillez vous connecter.'
      if (typeof onError === 'function') onError(error.value)
      return null
    }

    loading.value = true
    error.value = null

    try {
      const url = `${baseUrl}${endpoint}`

      // Configuration de la requête
      const requestConfig = {
        method: requestMethod,
        headers: {
          Authorization: `Bearer ${token}`,
          ...extraHeaders,
        },
      }

      // Ajouter le Content-Type si nécessaire (sauf pour FormData)
      const contentType = getContentType(requestBody)
      if (contentType && !requestConfig.headers['Content-Type']) {
        requestConfig.headers['Content-Type'] = contentType
      }

      // Ajouter le body pour les méthodes qui le supportent
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(requestMethod) && requestBody) {
        requestConfig.body = requestBody instanceof FormData ? requestBody : JSON.stringify(requestBody)
      }

      console.log(`[useApi] ${requestMethod} ${url}`, requestBody)

      const apiResponse = await $fetch(url, requestConfig)
      response.value = apiResponse

      // Appliquer la transformation si elle est fournie
      const result = typeof transform === 'function' ? transform(apiResponse) : apiResponse

      // Pour les requêtes GET, mettre à jour data.value
      // Pour les autres méthodes, on peut stocker la réponse ou réinitialiser
      if (requestMethod === 'GET') {
        data.value = result
      } else {
        data.value = result
        // Si autoReset est activé, on réinitialise après un certain délai
        if (autoReset) {
          setTimeout(() => {
            data.value = null
          }, 3000)
        }
      }

      if (typeof onSuccess === 'function') onSuccess(result)
      return result

    } catch (err) {
      // Déterminer un message d'erreur lisible
      let message = 'Une erreur inconnue s\'est produite'

      if (err?.response?.status === 422) {
        // Erreurs de validation Laravel
        const errors = err?.response?.data?.errors || {}
        const errorMessages = Object.values(errors).flat()
        message = errorMessages.length > 0 ? errorMessages[0] : 'Erreur de validation'
      } else if (err?.response?.data?.detail) {
        message = err.response.data.detail // Django REST Framework
      } else if (err?.response?.data?.message) {
        message = err.response.data.message // Format générique
      } else if (err?.message) {
        message = err.message
      }

      error.value = message
      console.error(`[useApi] Erreur sur ${endpoint} (${method}):`, err)

      if (typeof onError === 'function') onError(message, err)
      throw err // Propager l'erreur pour la gestion dans le composant

    } finally {
      loading.value = false
    }
  }

  /**
   * Réinitialise tous les états à leur valeur par défaut.
   */
  const reset = () => {
    data.value = method === 'GET' ? [] : null
    loading.value = false
    error.value = null
    response.value = null
  }

  // ---- Chargement automatique si demandé (uniquement pour GET) ----
  if (immediate && method === 'GET') {
    onMounted(() => {
      execute()
    })
  }

  return {
    data,
    loading,
    error,
    response, // Nouveau: la réponse complète
    execute,
    fetchData: method === 'GET' ? execute : undefined, // Alias pour GET
    refresh: method === 'GET' ? execute : undefined,   // Alias pour GET
    reset,

    // Méthodes utilitaires (optionnelles)
    post: (postBody) => execute(postBody, 'POST'),
    put: (putBody) => execute(putBody, 'PUT'),
    patch: (patchBody) => execute(patchBody, 'PATCH'),
    delete: () => execute(null, 'DELETE'),
  }
}

/**
 * Fonction utilitaire pour créer rapidement un appel GET
 */
export function useGet(endpoint, options = {}) {
  return useApi(endpoint, { ...options, method: 'GET' })
}

/**
 * Fonction utilitaire pour créer rapidement un appel POST
 */
export function usePost(endpoint, body, options = {}) {
  return useApi(endpoint, { ...options, method: 'POST', body })
}

/**
 * Fonction utilitaire pour créer rapidement un appel PUT
 */
export function usePut(endpoint, body, options = {}) {
  return useApi(endpoint, { ...options, method: 'PUT', body })
}

/**
 * Fonction utilitaire pour créer rapidement un appel DELETE
 */
export function useDelete(endpoint, options = {}) {
  return useApi(endpoint, { ...options, method: 'DELETE' })
}