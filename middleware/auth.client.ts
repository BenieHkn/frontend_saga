import { useAuth } from '~/composables/auth/useAuth'

// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated, getSelectedEntite, getActiveEntiteUsers } = useAuth()

  // Routes that must be accessible only to superadmins
  const adminOnlyRoutes = ['/entites', '/utilisateurs', '/point-critique', '/interim']
  const { getUser } = useAuth()

  // Pages publiques — pas de vérification
  const publicRoutes = ['/connexion', '/connexion/mot_de_passe_oublie', '/choose-profile']
  if (publicRoutes.includes(to.path)) return

  // Non authentifié → login
  if (!isAuthenticated()) {
    return navigateTo('/connexion')
  }

  // If route is admin-only, ensure user is superadmin
  const user = getUser()
  const isAdminRoute = adminOnlyRoutes.some(r => to.path === r || to.path.startsWith(r + '/'))
  if (isAdminRoute && !(user && user.is_superadmin)) {
    return navigateTo('/')
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