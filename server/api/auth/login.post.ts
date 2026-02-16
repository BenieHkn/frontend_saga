export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  try {
    const body = await readBody(event)

    // Validation basique
    if (!body.email || !body.password) {
      return {
        success: false,
        message: 'Email et mot de passe requis'
      }
    }

    // Appel API externe avec gestion d'erreur
    let response: any
    try {
      response = await $fetch(`${config.public.laravelApiUrl}/login`, {
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })

    } catch (apiError: any) {
      console.error('Erreur API Laravel:', apiError.data || apiError.message)

      return {
        success: false,
        message: apiError.data?.message || 'Identifiants invalides'
      }
    }

    // Vérifier que le token existe
    if (!response.token) {
      return {
        success: false,
        message: 'Token non reçu de l\'API'
      }
    }

    // Vérifier que response.user existe
    if (!response.user) {
      return {
        success: false,
        message: 'Données utilisateur non reçues de l\'API'
      }
    }

    // ===== EXTRACTION ET FORMATAGE DES ENTITÉS =====
    
    // Extraire l'entité principale (la première entité active)
    const main_entite = response.user.entite_users?.[0]?.entite || null
    const entite_user = response.user.entite_users?.[0] || null

    // Extraire et formater toutes les entités
    const entites = response.user.entite_users?.map((eu: any) => ({
      id: eu.entite?.id,
      code: eu.entite?.code,
      libelle: eu.entite?.libelle,
      fonction: eu.entite?.fonction,
      is_critique: eu.entite?.is_critique,
      parent_entite_id: eu.entite?.parent_entite_id,
      parent_libelle: eu.entite?.parent_libelle,
      entite_user_id: eu.id,
      actif: eu.actif,
      is_interim: eu.is_interim,
      is_responsable: eu.is_responsable,
      date_debut: eu.date_debut,
      date_fin: eu.date_fin
    })) || []

    console.log('entites:', entites)

    // Formatter l'utilisateur (ne garder que les infos essentielles)
    const formattedUser = {
      id: response.user.id,
      nom: response.user.nom,
      prenom: response.user.prenom,
      email: response.user.email,
      is_superadmin: response.user.is_superadmin,
      matricule: response.user.matricule,
      statut: response.user.statut,
      telephone: response.user.telephone,
      prise_service: response.user.prise_service
    }

    console.log('formattedUser:', formattedUser)
    console.log('main_entite:', main_entite)
    console.log('entites:', entites)
    console.log('entite_user:', entite_user)

    // Retourner une réponse structurée et cohérente
    return {
      success: true,
      message: 'Connexion réussie',
      token: response.token,
      user: formattedUser,
      main_entite: main_entite,
      entites: entites,
      entite_user: entite_user
    }

  } catch (error: any) {
    console.error('Erreur login:', error.message)
    console.error('Erreur login:', error)

    return {
      success: false,
      message: 'Erreur serveur lors de la connexion'
    }
  }
})