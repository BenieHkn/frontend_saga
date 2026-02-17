export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  try {
    // Récupérer le token du cookie
    const token = getCookie(event, 'auth_token')
    
    if (!token) {
      return { success: false, message: 'Token manquant' }
    }

    // Appel à l'API Laravel pour récupérer les infos utilisateur
    const response = await $fetch(`${config.public.apiBase}/user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })

    return { success: true, user: response }
  } catch (error: any) {
    console.error('Erreur récupération utilisateur:', error)
    return { success: false, message: error.data?.message || 'Erreur lors de la récupération des infos' }
  }
})
