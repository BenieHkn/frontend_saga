// =====================
// useAuth.js
// =====================

export const useAuth = () => {

  // =====================
  // STATE
  // =====================
  const authError = ref('')
  const successMessage = ref('')
  const loading = ref(false)

  const form = reactive({
    email: '',
    password: ''
  })

  const rememberMe = ref(false)

  // =====================
  // LOCALSTORAGE
  // =====================

  const persistSession = (response) => {
    if (!process.client) return

    localStorage.setItem('auth_token', response.token)
    const expirationMinutes = 120
    const expiresAt = Date.now() + expirationMinutes * 60 * 1000
    localStorage.setItem('auth_token_expires_at', String(expiresAt))

    localStorage.setItem('user', JSON.stringify(response.user))

    if (response.main_entite) {
      localStorage.setItem('main_entite', JSON.stringify(response.main_entite))
      localStorage.setItem('selected_entite', JSON.stringify(response.main_entite))
    }

    if (response.entite_user) {
      localStorage.setItem('entite_user', JSON.stringify(response.entite_user))
    }

    localStorage.setItem('entites', JSON.stringify(response.entites ?? []))

    if (response.role) {
      localStorage.setItem('role', response.role)
    }

    if (response.roles) {
      localStorage.setItem('roles', JSON.stringify(response.roles))
    }

    if (response.permissions) {
      localStorage.setItem('permissions', JSON.stringify(response.permissions))
    }

    if (response.directeur_entite_user_id) {
      localStorage.setItem('directeur_entite_user_id', String(response.directeur_entite_user_id))
    }
  }

  const clearSession = () => {
    if (!process.client) return
    ;[
      'auth_token',
      'user',
      'main_entite',
      'entite_user',
      'selected_entite',
      'entites',
      'role',
      'roles',
      'permissions',
      'directeur_entite_user_id',
    ].forEach(key => localStorage.removeItem(key))
  }

  const getStoredToken = () => {
    if (!process.client) return null
    return localStorage.getItem('auth_token')
  }

  const getUser = () => {
    if (!process.client) return null
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  }

  const getEntites = () => {
    if (!process.client) return []
    const raw = localStorage.getItem('entites')
    return raw ? JSON.parse(raw) : []
  }

  const getActiveEntiteUsers = () => {
    const today = new Date()
    return getEntites().filter(eu => {
      if (!eu) return false
      if (!eu.actif) return false
      if (eu.date_fin && new Date(eu.date_fin) < today) return false
      return true
    })
  }

  const getSelectedEntite = () => {
    if (!process.client) return null
    const raw = localStorage.getItem('selected_entite')
    return raw ? JSON.parse(raw) : null
  }

  const setSelectedEntiteUser = (entiteUser) => {
    if (!process.client) return

    const selectedEntite = {
      id:               entiteUser.id,
      code:             entiteUser.code,
      libelle:          entiteUser.libelle,
      fonction:         entiteUser.fonction,
      is_critique:      entiteUser.is_critique,
      parent_entite_id: entiteUser.parent_entite_id,
      parent_libelle:   entiteUser.parent_libelle,
    }

    localStorage.setItem('selected_entite', JSON.stringify(selectedEntite))
    localStorage.setItem('entite_user', JSON.stringify(entiteUser))
  }

  const isAuthenticated = () => !!getStoredToken()

  // =====================
  // RÔLES & PERMISSIONS
  // =====================

  const getRole = () => {
    if (!process.client) return 'agent'
    return localStorage.getItem('role') ?? 'agent'
  }

  const getRoles = () => {
    if (!process.client) return ['agent']
    const raw = localStorage.getItem('roles')
    return raw ? JSON.parse(raw) : [getRole()]
  }

  const hasRole = (role) => {
    if (!process.client) return false
    return getRoles().includes(role)
  }

  const getPermissions = () => {
    if (!process.client) return {}
    const raw = localStorage.getItem('permissions')
    return raw ? JSON.parse(raw) : {}
  }

  const hasPermission = (permission) => {
    if (getRole() === 'administrateur') return true
    return getPermissions()[permission] === true
  }

  const getDirecteurEntiteUserId = () => {
    if (!process.client) return null
    const raw = localStorage.getItem('directeur_entite_user_id')
    return raw ? parseInt(raw) : null
  }

  const getEmetteurId = () => {
    if (!process.client) return null

    const raw = localStorage.getItem('entite_user')
    if (!raw) return null

    const entiteUser = JSON.parse(raw)
    if (!entiteUser?.id) return null

    const directeurId = getDirecteurEntiteUserId()

    if (directeurId && (isSP() || isSA() || isSecDir())) {
      return directeurId
    }

    return entiteUser.entite_user_id ?? entiteUser.id ?? null
  }

  // =====================
  // RÔLES (helpers booléens)
  // =====================
  const isAdmin          = () => hasRole('administrateur')
  const isDG             = () => hasRole('directeur_general')
  const isSP             = () => hasRole('secretariat_particulier')
  const isSA             = () => hasRole('secretariat_administratif')
  const isSAP            = () => hasRole('sap')
  const isDT             = () => hasRole('directeur_technique')
  const isDCCIQ          = () => hasRole('directeur_cciq')
  const isSecDir         = () => hasRole('secretariat_direction')
  const isChefService    = () => hasRole('chef_service')
  const isAgent          = () => hasRole('agent')
  const isSecretaireCodir = () => hasRole('secretaire_codir')

  // =====================
  // RÔLES SMQ
  // =====================
  // Note : il n'existe pas de rôle smq_admin.
  // L'administrateur système (isAdmin()) a tous les droits SMQ.
  const isSmqPilote    = () => hasRole('smq_pilote')
  const isSmqCopilote  = () => hasRole('smq_copilote')
  const isSmqRQ        = () => hasRole('smq_rq')
  const isSmqRQA       = () => hasRole('smq_rqa')
  const isSmqMG        = () => isSmqRQ() || isSmqRQA()
  // Alias de compatibilité : l'admin système tient lieu d'admin SMQ
  const isSmqAdmin     = () => isAdmin()

  /** A au moins un rôle SMQ (pour afficher le menu) */
  const peutVoirSmq    = () => isSmqPilote() || isSmqCopilote() || isSmqRQ() || isSmqRQA() || isAdmin()

  // ── Permissions SMQ (lecture depuis le bloc smq des permissions frontend) ──

  const getSmqPerm = (key) => {
    if (typeof window === 'undefined') return false
    try {
      const raw = localStorage.getItem('permissions')
      return JSON.parse(raw)?.smq?.[key] === true
    } catch { return false }
  }

  // Dashboard
  const smqPeutVoirDashboard        = () => getSmqPerm('dashboard')
  const smqPeutVoirDashboardGlobal  = () => getSmqPerm('dashboard_global')

  // Indicateurs
  const smqPeutVoirIndicateurs      = () => getSmqPerm('indicateurs_voir')
  const smqPeutCreerIndicateur      = () => getSmqPerm('indicateurs_creer')
  const smqPeutModifierIndicateur   = () => getSmqPerm('indicateurs_modifier')
  const smqPeutSupprimerIndicateur  = () => getSmqPerm('indicateurs_supprimer')
  const smqPeutAffecterCopilotes    = () => getSmqPerm('indicateurs_affecter')

  // Saisies
  const smqPeutVoirSaisies          = () => getSmqPerm('saisies_voir')
  const smqPeutVoirToutesSaisies    = () => getSmqPerm('saisies_voir_toutes')
  const smqPeutCreerSaisie          = () => getSmqPerm('saisies_creer')
  const smqPeutSoumettreSaisie      = () => getSmqPerm('saisies_soumettre')
  const smqPeutValiderSaisie        = () => getSmqPerm('saisies_valider')
  const smqPeutRetournerSaisie      = () => getSmqPerm('saisies_retourner')
  const smqPeutTransmettreSaisie    = () => getSmqPerm('saisies_transmettre')

  // FAC
  const smqPeutVoirFac              = () => getSmqPerm('fac_voir')
  const smqPeutGererFac             = () => getSmqPerm('fac_gerer')

  // PAQ
  const smqPeutVoirPaq              = () => getSmqPerm('paq_voir')
  const smqPeutGererPaq             = () => getSmqPerm('paq_gerer')
  const smqPeutGererRecommandations = () => getSmqPerm('recommandations_gerer')

  // Supervision
  const smqPeutVoirStats            = () => getSmqPerm('stats_voir')
  const smqPeutVoirRapports         = () => getSmqPerm('rapports_voir')
  const smqPeutVoirHistoriques      = () => getSmqPerm('historiques_voir')

  // Admin
  const smqPeutGererUtilisateurs    = () => getSmqPerm('users_gerer')
  const smqPeutGererReferentiels    = () => getSmqPerm('referentiels_gerer')

  const isChefServiceEtSecretaireCodir = () =>
    hasRole('chef_service') && hasRole('secretaire_codir')

  // =====================
  // PERMISSIONS (helpers booléens)
  // =====================
  const peutVoirConfig   = () => hasPermission('voir_configuration')
  const peutModifier     = () => hasPermission('modifier_courriers')
  const peutSupprimer    = () => hasPermission('supprimer_courriers')
  const peutRattacher    = () => hasPermission('faire_rattachement')
  const peutVoirCodir    = () => hasPermission('voir_codir')
  const peutGererCodir   = () => hasPermission('gerer_codir')
  const voitTousCourriers = () => hasPermission('voir_tous_courriers')
  const voitCourriersSA  = () => hasPermission('voir_courriers_sa')
  const voitStats        = () => hasPermission('voir_stats')
  const voitAgents       = () => hasPermission('voir_agents')
  const peutTransferer   = () => hasPermission('faire_transfert')
  const typeDashboard    = () => getPermissions().dashboard ?? 'agent'
  const champsVisibles   = () => getPermissions().champs_visibles ?? null

  // =====================
  // REMEMBER ME
  // =====================

  const loadRememberedEmail = () => {
    if (!process.client) return
    const savedEmail = localStorage.getItem('rememberedEmail')
    if (savedEmail) {
      form.email = savedEmail
      rememberMe.value = true
    }
  }

  const handleRememberMe = () => {
    if (!process.client) return
    if (rememberMe.value) {
      localStorage.setItem('rememberedEmail', form.email.trim())
    } else {
      localStorage.removeItem('rememberedEmail')
    }
  }

  // =====================
  // VALIDATION
  // =====================

const validateForm = () => {
  authError.value = ''

  // ← Trimmer d'abord avant toute validation
  form.email = form.email.trim()

  if (!form.email) {
    authError.value = 'Veuillez entrer votre adresse email'
    return false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.email)) {
    authError.value = 'Veuillez entrer une adresse email valide'
    return false
  }

  if (!form.password) {
    authError.value = 'Veuillez entrer votre mot de passe'
    return false
  }

  if (form.password.length < 6) {
    authError.value = 'Le mot de passe doit contenir au moins 6 caractères'
    return false
  }

  return true
}
  // =====================
  // ONESIGNAL
  // =====================

  const enregistrerOneSignal = async (token) => {
    if (!process.client) return

    window.OneSignalDeferred = window.OneSignalDeferred || []
    window.OneSignalDeferred.push(async (OneSignal) => {
      try {
        await OneSignal.Notifications.requestPermission()
        const playerId = OneSignal.User.PushSubscription.id

        if (playerId) {
          await $fetch('/api/user/onesignal', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: { player_id: playerId }
          })
          console.log('✅ OneSignal player_id enregistré:', playerId)
        }
      } catch (e) {
        console.error('❌ Erreur OneSignal:', e)
      }
    })
  }

  // =====================
  // FORGOT PASSWORD
  // =====================

  const forgotPassword = async (email) => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, message: 'Email invalide.' }
    }

    const { public: { apiBase } } = useRuntimeConfig()

    try {
      const res = await $fetch(`${apiBase}/forgot-password`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: { email },
      })

      if (res.success || res.status === 'success') {
        return { success: true }
      } else {
        return { success: false, message: res.message || 'Erreur lors de la demande.' }
      }
    } catch (e) {
      return { success: false, message: "Erreur lors de l'envoi de l'email." }
    }
  }

  // =====================
// CHANGE PASSWORD
// =====================

const changePassword = async ({ current_password, password, password_confirmation }) => {
  if (!current_password || !password || !password_confirmation) {
    return { success: false, message: 'Tous les champs sont requis.' }
  }

  if (password !== password_confirmation) {
    return { success: false, message: 'Les mots de passe ne correspondent pas.' }
  }

  if (password.length < 6) {
    return { success: false, message: 'Mot de passe trop court.' }
  }

  const token = getStoredToken()
  if (!token) return { success: false, message: 'Non authentifié.' }

  const { public: { apiBase } } = useRuntimeConfig()

  try {
    const response = await $fetch(`${apiBase}/change-password`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: { current_password, password, password_confirmation },
    })

    if (response.success || response.status === 'success') {
      return { success: true }
    } else {
      return { success: false, message: response.message || 'Erreur lors du changement.' }
    }
  } catch (e) {
    return { success: false, message: e?.data?.message || 'Erreur lors du changement de mot de passe.' }
  }
}

  // =====================
  // LOGIN
  // =====================

  const login = async () => {
    authError.value = ''
    successMessage.value = ''

    if (!validateForm()) return

    handleRememberMe()

    try {
      loading.value = true

      const { public: { apiBase } } = useRuntimeConfig()

      const response = await $fetch(`${apiBase}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: {
          email: form.email.trim(),
          password: form.password,
        },
      })

      if (!response.token || !response.user) {
        authError.value = response.message || 'Erreur lors de la connexion'
        return
      }

      const entitesActives = response.user.entite_users?.filter(eu => eu.actif) ?? []
      const isSuperAdmin = response.user?.is_superadmin === true
      const shouldIncludeRoleAndPermissions = isSuperAdmin || entitesActives.length === 1

      const authData = {
        success:                  true,
        message:                  'Connexion réussie',
        token:                    response.token,
        token_expires_at:         response.token_expires_at,
        user:                     response.user,
        main_entite:              entitesActives.length === 1 ? entitesActives[0]?.entite ?? null : null,
        entite_user:              entitesActives.length === 1 ? entitesActives[0] ?? null : null,
        entites:                  response.user.entite_users?.map(eu => ({
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
        })) ?? [],
        role:                     shouldIncludeRoleAndPermissions ? (response.role ?? null) : null,
        roles:                    response.roles ?? [],
        permissions:              shouldIncludeRoleAndPermissions ? (response.permissions ?? {}) : null,
        directeur_entite_user_id: response.directeur_entite_user_id ?? null,
      }

      persistSession(authData)
      await enregistrerOneSignal(authData.token)

      successMessage.value = 'Connexion réussie, redirection en cours...'
      await new Promise(resolve => setTimeout(resolve, 200))

      const activePostes = getActiveEntiteUsers()
      if (activePostes.length <= 1) {
        await navigateTo('/dashboard')
      } else {
        await navigateTo('/choose-profile')
      }

    } catch (error) {
      console.error('Erreur login:', error)
      if (error.status === 401)      authError.value = 'Email ou mot de passe incorrect'
      else if (error.status === 400) authError.value = 'Données invalides'
      else if (error.status === 500) authError.value = 'Erreur serveur. Veuillez réessayer plus tard'
      else                           authError.value = error.data?.message || 'Erreur de connexion. Veuillez réessayer'
    } finally {
      loading.value = false
    }
  }

  // =====================
  // LOGOUT
  // =====================

  const logout = async () => {
    clearSession()
    await navigateTo('/')
  }

  // =====================
  // WATCHERS
  // =====================

  watch(() => form.email, () => {
    if (authError.value) authError.value = ''
  })

  watch(() => form.password, () => {
    if (authError.value) authError.value = ''
  })

  // =====================
  // RETURN
  // =====================

  return {
    // State
    form,
    rememberMe,
    loading,
    authError,
    successMessage,

    // Actions
    login,
    changePassword,
    forgotPassword,
    logout,
    loadRememberedEmail,

    // Session
    getStoredToken,
    getUser,
    getEntites,
    getActiveEntiteUsers,
    getSelectedEntite,
    setSelectedEntiteUser,
    isAuthenticated,
    clearSession,

    // Rôles
    getRole,
    getRoles,
    hasRole,
    isAdmin,
    isDG,
    isSP,
    isSA,
    isSAP,
    isDT,
    isDCCIQ,
    isSecDir,
    isChefService,
    isSecretaireCodir,
    isChefServiceEtSecretaireCodir,
    isAgent,

    // SMQ — Rôles (isSmqAdmin = alias de isAdmin)
    isSmqAdmin,
    isSmqPilote,
    isSmqCopilote,
    isSmqRQ,
    isSmqRQA,
    isSmqMG,
    peutVoirSmq,

    // SMQ — Permissions granulaires
    smqPeutVoirDashboard,
    smqPeutVoirDashboardGlobal,
    smqPeutVoirIndicateurs,
    smqPeutCreerIndicateur,
    smqPeutModifierIndicateur,
    smqPeutSupprimerIndicateur,
    smqPeutAffecterCopilotes,
    smqPeutVoirSaisies,
    smqPeutVoirToutesSaisies,
    smqPeutCreerSaisie,
    smqPeutSoumettreSaisie,
    smqPeutValiderSaisie,
    smqPeutRetournerSaisie,
    smqPeutTransmettreSaisie,
    smqPeutVoirFac,
    smqPeutGererFac,
    smqPeutVoirPaq,
    smqPeutGererPaq,
    smqPeutGererRecommandations,
    smqPeutVoirStats,
    smqPeutVoirRapports,
    smqPeutVoirHistoriques,
    smqPeutGererUtilisateurs,
    smqPeutGererReferentiels,

    // Permissions
    getPermissions,
    hasPermission,
    peutVoirConfig,
    peutModifier,
    peutSupprimer,
    peutRattacher,
    peutVoirCodir,
    peutGererCodir,
    voitTousCourriers,
    voitCourriersSA,
    voitStats,
    voitAgents,
    typeDashboard,
    champsVisibles,
    peutTransferer,

    // Secrétariat → directeur
    getDirecteurEntiteUserId,
    getEmetteurId,
  }
}