import { useAuth } from '~/composables/auth/useAuth'

// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated, getSelectedEntite, getActiveEntiteUsers } = useAuth()

  // Pages publiques — pas de vérification
  const publicRoutes = ['/connexion', '/connexion/mot_de_passe_oublie', '/choose-profile']
  if (publicRoutes.includes(to.path)) return

  // Non authentifié → login
  if (!isAuthenticated()) {
    return navigateTo('/connexion')
  }

  // Authentifié mais pas d'entité sélectionnée
  if (!getSelectedEntite()) {
    const actifs = getActiveEntiteUsers()

    // Plusieurs profils → forcer la sélection
    if (actifs.length > 1) {
      return navigateTo('/choose-profile')
    }

    // Un seul profil → sélection auto silencieuse
    if (actifs.length === 1) {
      const { setSelectedEntiteUser } = useAuth()
      setSelectedEntiteUser(actifs[0])
    }
  }
})