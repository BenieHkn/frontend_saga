export interface User {
  id: number
  nom: string
  prenom: string
  email: string
  is_superadmin: boolean
  matricule: string
  statut: boolean
  telephone: string | null
  prise_service: string | null
}

export interface EntiteInfo {
  id: number
  code: string
  libelle: string
  fonction: string
  is_critique: boolean
  parent_entite_id: number | null
  parent_libelle: string
}

export interface EntiteUser {
  id: number
  code: string
  libelle: string
  fonction: string
  is_critique: boolean
  parent_entite_id: number | null
  parent_libelle: string
  entite_user_id: number
  actif: boolean
  is_interim: boolean
  is_responsable: boolean
  date_debut: string | null
  date_fin: string | null
}

export interface AuthResponse {
  success: boolean
  message: string
  token: string
  token_expires_at: string
  user: User
  main_entite: EntiteInfo | null
  entites: EntiteUser[]
  entite_user: any | null
  role?: string
  roles?: string[]   // ✅ nouveau
  permissions?: Record<string, any>
  directeur_entite_user_id?: number | null
}

declare global {
  interface Window {
    OneSignalDeferred: any[]
  }
}

export const useAuth = () => {

  // =====================
  // STATE
  // =====================
  const authError = ref<string>('')
  const successMessage = ref<string>('')
  const loading = ref<boolean>(false)

  const form = reactive({
    email: '',
    password: ''
  })

  const rememberMe = ref<boolean>(false)

  // =====================
  // LOCALSTORAGE
  // =====================

  const persistSession = (response: AuthResponse) => {
    if (!process.client) return

    localStorage.setItem('auth_token', response.token)
    const expirationMinutes = 120 // doit correspondre à config('sanctum.expiration')
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

    // ✅ Stocker tous les rôles
    if (response.roles) {
      localStorage.setItem('roles', JSON.stringify(response.roles))
    }

    if (response.permissions) {
      localStorage.setItem('permissions', JSON.stringify(response.permissions))
    }

    if (response.directeur_entite_user_id) {
      localStorage.setItem(
        'directeur_entite_user_id',
        String(response.directeur_entite_user_id)
      )
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
        'roles',   // ✅ nouveau
        'permissions',
        'directeur_entite_user_id',
      ].forEach(key => localStorage.removeItem(key))
  }

  const getStoredToken = (): string | null => {
    if (!process.client) return null
    return localStorage.getItem('auth_token')
  }

  const getUser = (): User | null => {
    if (!process.client) return null
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  }

  const getEntites = (): EntiteUser[] => {
    if (!process.client) return []
    const raw = localStorage.getItem('entites')
    return raw ? JSON.parse(raw) : []
  }

  const getActiveEntiteUsers = (): EntiteUser[] => {
    const today = new Date()
    return getEntites().filter(eu => {
      if (!eu) return false
      if (!eu.actif) return false
      if (eu.date_fin && new Date(eu.date_fin) < today) return false
      return true
    })
  }

  const getSelectedEntite = (): EntiteInfo | null => {
    if (!process.client) return null
    const raw = localStorage.getItem('selected_entite')
    return raw ? JSON.parse(raw) : null
  }

  const setSelectedEntiteUser = (entiteUser: EntiteUser) => {
    if (!process.client) return

    const selectedEntite: EntiteInfo = {
      id: entiteUser.id,
      code: entiteUser.code,
      libelle: entiteUser.libelle,
      fonction: entiteUser.fonction,
      is_critique: entiteUser.is_critique,
      parent_entite_id: entiteUser.parent_entite_id,
      parent_libelle: entiteUser.parent_libelle,
    }

    localStorage.setItem('selected_entite', JSON.stringify(selectedEntite))
    localStorage.setItem('entite_user', JSON.stringify(entiteUser))
  }

  const isAuthenticated = (): boolean => !!getStoredToken()

  // =====================
  // RÔLES & PERMISSIONS
  // =====================

  const getRole = (): string => {
    if (!process.client) return 'agent'
    return localStorage.getItem('role') ?? 'agent'
  }

  // ✅ Retourne tous les rôles
  const getRoles = (): string[] => {
    if (!process.client) return ['agent']
    const raw = localStorage.getItem('roles')
    return raw ? JSON.parse(raw) : [getRole()]
  }

  // ✅ Vérifie si l'utilisateur a un rôle spécifique
  const hasRole = (role: string): boolean => {
    if (!process.client) return false  // ← une seule ligne
    return getRoles().includes(role)
  }

  const getPermissions = (): Record<string, any> => {
    if (!process.client) return {}
    const raw = localStorage.getItem('permissions')
    return raw ? JSON.parse(raw) : {}
  }

  const hasPermission = (permission: string): boolean => {
    if (getRole() === 'administrateur') return true
    return getPermissions()[permission] === true
  }

  const getDirecteurEntiteUserId = (): number | null => {
    if (!process.client) return null
    const raw = localStorage.getItem('directeur_entite_user_id')
    return raw ? parseInt(raw) : null
  }

  const getEmetteurId = (): number | null => {
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
  const isAdmin = () => hasRole('administrateur')
  const isDG = () => hasRole('directeur_general')
  const isSP = () => hasRole('secretariat_particulier')
  const isSA = () => hasRole('secretariat_administratif')
  const isSAP = () => hasRole('sap')
  const isDT = () => hasRole('directeur_technique')
  const isDCCIQ = () => hasRole('directeur_cciq')
  const isSecDir = () => hasRole('secretariat_direction')
  const isChefService = () => hasRole('chef_service')
  const isAgent = () => hasRole('agent')
  const isSecretaireCodir = () => hasRole('secretaire_codir')  // ✅ remplace isSPCODIR

  // ✅ Cas composite — chef service ET secrétaire codir simultanément
  const isChefServiceEtSecretaireCodir = () =>
    hasRole('chef_service') && hasRole('secretaire_codir')

  // =====================
  // PERMISSIONS (helpers booléens)
  // =====================
  const peutVoirConfig = () => hasPermission('voir_configuration')
  const peutModifier = () => hasPermission('modifier_courriers')
  const peutSupprimer = () => hasPermission('supprimer_courriers')
  const peutRattacher = () => hasPermission('faire_rattachement')
  const peutVoirCodir = () => hasPermission('voir_codir')
  const peutGererCodir = () => hasPermission('gerer_codir')
  const voitTousCourriers = () => hasPermission('voir_tous_courriers')
  const voitCourriersSA = () => hasPermission('voir_courriers_sa')
  const voitStats = () => hasPermission('voir_stats')
  const voitAgents = () => hasPermission('voir_agents')
  const peutTransferer = () => hasPermission('faire_transfert')
  const typeDashboard = () => getPermissions().dashboard ?? 'agent'
  const champsVisibles = () => getPermissions().champs_visibles ?? null

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

  const validateForm = (): boolean => {
    authError.value = ''

    if (!form.email?.trim()) {
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

  const enregistrerOneSignal = async (token: string) => {
    if (!process.client) return

    window.OneSignalDeferred = window.OneSignalDeferred || []
    window.OneSignalDeferred.push(async (OneSignal: any) => {
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
  // LOGIN
  // =====================

  const login = async () => {
    authError.value = ''
    successMessage.value = ''

    if (!validateForm()) return

    handleRememberMe()

    try {
      loading.value = true

      const response = await $fetch<AuthResponse>('api/auth/login', {
        method: 'POST',
        body: {
          email: form.email.trim(),
          password: form.password
        }
      })
      console.log("la réponse à la connexion", response)

      if (!response.success) {
        authError.value = response.message || 'Erreur lors de la connexion'
        return
      }

      if (!response.token || !response.user) {
        throw new Error('Données de réponse incomplètes')
      }

      persistSession(response)
      await enregistrerOneSignal(response.token)

      const activePostes = getActiveEntiteUsers()

      successMessage.value = 'Connexion réussie, redirection en cours...'
      await new Promise(resolve => setTimeout(resolve, 200))

      if (activePostes.length <= 1) {
        await navigateTo('/dashboard')
        return
      }

      await navigateTo('/choose-profile')

    } catch (error: any) {
      console.error('Erreur login:', error)

      if (error.status === 401) {
        authError.value = 'Email ou mot de passe incorrect'
      } else if (error.status === 400) {
        authError.value = 'Données invalides'
      } else if (error.status === 500) {
        authError.value = 'Erreur serveur. Veuillez réessayer plus tard'
      } else {
        authError.value = error.data?.message || 'Erreur de connexion. Veuillez réessayer'
      }
    } finally {
      loading.value = false
    }
  }

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
    getRoles,     // ✅ nouveau
    hasRole,      // ✅ nouveau
    isAdmin,
    isDG,
    isSP,
    isSA,
    isSAP,
    isDT,
    isDCCIQ,
    isSecDir,
    isChefService,
    isSecretaireCodir,              // ✅ remplace isSPCODIR
    isChefServiceEtSecretaireCodir, // ✅ nouveau
    isAgent,

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