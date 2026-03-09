export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  try {
    const body = await readBody(event)

    if (!body.email || !body.password) {
      return {
        success: false,
        message: 'Email et mot de passe requis'
      }
    }

    let response: any
    try {
      response = await $fetch(`${config.public.apiBase}/login`, {
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

    if (!response.token) {
      return {
        success: false,
        message: 'Token non reçu de l\'API'
      }
    }

    if (!response.user) {
      return {
        success: false,
        message: 'Données utilisateur non reçues de l\'API'
      }
    }

    // Filtrer les entités actives
    const entitesActives = response.user.entite_users?.filter((eu: any) => eu.actif) || []

    // ✅ CORRECTION : L'admin (is_superadmin) n'a pas d'entités
    // → toujours transmettre son role et ses permissions sans condition
    const isSuperAdmin = response.user?.is_superadmin === true

    const main_entite = entitesActives.length === 1
      ? entitesActives[0]?.entite || null
      : null

    const entite_user = entitesActives.length === 1
      ? entitesActives[0] || null
      : null

    const entites = response.user.entite_users?.map((eu: any) => ({
      id:               eu.entite?.id,
      code:             eu.entite?.code,
      libelle:          eu.entite?.libelle,
      fonction:         eu.entite?.fonction,
      is_critique:      eu.entite?.is_critique,
      parent_entite_id: eu.entite?.parent_entite_id,
      parent_libelle:   eu.entite?.parent_libelle,
      entite_user_id:   eu.id,
      actif:            eu.actif,
      is_interim:       eu.is_interim,
      is_responsable:   eu.is_responsable,
      date_debut:       eu.date_debut,
      date_fin:         eu.date_fin,
    })) || []

    const formattedUser = {
      id:            response.user.id,
      nom:           response.user.nom,
      prenom:        response.user.prenom,
      email:         response.user.email,
      is_superadmin: response.user.is_superadmin,
      matricule:     response.user.matricule,
      statut:        response.user.statut,
      telephone:     response.user.telephone,
      prise_service: response.user.prise_service,
    }

    // ✅ CORRECTION : role et permissions transmis si :
    //   - superadmin (pas d'entités mais droits complets)
    //   - OU utilisateur avec exactement 1 entité active
    const shouldIncludeRoleAndPermissions = isSuperAdmin || entitesActives.length === 1

    return {
      success:                  true,
      message:                  'Connexion réussie',
      token:                    response.token,
      token_expires_at:         response.token_expires_at,
      user:                     formattedUser,
      main_entite:              main_entite,
      entites:                  entites,
      entite_user:              entite_user,
      role:                     shouldIncludeRoleAndPermissions ? (response.role ?? null) : null,
      permissions:              shouldIncludeRoleAndPermissions ? (response.permissions ?? {}) : null,
      directeur_entite_user_id: response.directeur_entite_user_id ?? null,
    }

  } catch (error: any) {
    console.error('Erreur login:', error.message)
    return {
      success: false,
      message: 'Erreur serveur lors de la connexion'
    }
  }
})