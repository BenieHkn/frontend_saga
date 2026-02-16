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

// ✅ Structure plate telle que retournée par le server handler
export interface EntiteUser {
  id: number              // id de entite
  code: string
  libelle: string
  fonction: string
  is_critique: boolean
  parent_entite_id: number | null
  parent_libelle: string
  entite_user_id: number  // id de la relation entite_user
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
  user: User
  main_entite: EntiteInfo | null
  entites: EntiteUser[]
  entite_user: any | null
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
  // Clés existantes dans l'application — NE PAS RENOMMER
  // - auth_token      → token Bearer pour les requêtes API
  // - user            → infos de base de l'utilisateur connecté
  // - main_entite     → entité principale de l'utilisateur
  // - entite_user     → relation entite_user principale (objet complet du backend)
  // - selected_entite → entité couramment sélectionnée (contexte actif)
  // - entites         → tous les profils aplatis de l'utilisateur
  // =====================

  const persistSession = (response: AuthResponse) => {
    if (!process.client) return

    localStorage.setItem('auth_token', response.token)
    localStorage.setItem('user', JSON.stringify(response.user))

    if (response.main_entite) {
      localStorage.setItem('main_entite', JSON.stringify(response.main_entite))
      localStorage.setItem('selected_entite', JSON.stringify(response.main_entite))
    }

    if (response.entite_user) {
      localStorage.setItem('entite_user', JSON.stringify(response.entite_user))
    }

    localStorage.setItem('entites', JSON.stringify(response.entites ?? []))
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
    ].forEach(key => localStorage.removeItem(key))
  }

  const getStoredToken = (): string | null => {
    if (!process.client) return null
    if(process.client)
        return localStorage.getItem('auth_token')
    return null
  }

  const getUser = (): User | null => {
    if (!process.client) return null
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  }

  // Retourne tous les profils aplatis
  const getEntites = (): EntiteUser[] => {
    if (!process.client) return []
    const raw = localStorage.getItem('entites')
    return raw ? JSON.parse(raw) : []
  }

  // Retourne uniquement les profils actifs
  const getActiveEntiteUsers = (): EntiteUser[] => {
    const today = new Date()
    return getEntites().filter(eu => {
      if (!eu) return false
      if (!eu.actif) return false
      if (eu.date_fin && new Date(eu.date_fin) < today) return false
      return true
    })
  }

  // Retourne l'entité couramment sélectionnée
  const getSelectedEntite = (): EntiteInfo | null => {
    if (!process.client) return null
    const raw = localStorage.getItem('selected_entite')
    return raw ? JSON.parse(raw) : null
  }

  /**
   * Met à jour selected_entite et entite_user depuis un profil plat
   * Appelé depuis la page /choose-profile
   */
  const setSelectedEntiteUser = (entiteUser: EntiteUser) => {
    if (!process.client) return

    // Reconstruire l'objet EntiteInfo pour selected_entite
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

      if (!response.success) {
        authError.value = response.message || 'Erreur lors de la connexion'
        return
      }

      if (!response.token || !response.user) {
        throw new Error('Données de réponse incomplètes')
      }

      persistSession(response)

      const activePostes = getActiveEntiteUsers()

      successMessage.value = 'Connexion réussie, redirection en cours...'
      await new Promise(resolve => setTimeout(resolve, 800))

      if (activePostes.length <= 1) {
        await navigateTo('/')
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
    await navigateTo('/connexion')
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

  return {
    form,
    rememberMe,
    loading,
    authError,
    successMessage,
    login,
    logout,
    loadRememberedEmail,
    getStoredToken,
    getUser,
    getEntites,
    getActiveEntiteUsers,
    getSelectedEntite,
    setSelectedEntiteUser,
    isAuthenticated,
    clearSession,
  }
}