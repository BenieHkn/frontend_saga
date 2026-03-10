export default defineNuxtRouteMiddleware((to, from) => {
    // localStorage n'existe que côté client
    if (!process.client) return

    const publicPages = ['/']

    const token = localStorage.getItem('auth_token')

    // Si pas de token et page non publique → redirection
    if (!token && !publicPages.includes(to.path)) {
        return navigateTo('/')
    }

    if (token) {
        try {

            const expiresAt = parseInt(localStorage.getItem('auth_token_expires_at') ?? '0')

            if (!expiresAt || isNaN(expiresAt) || expiresAt < Date.now()) {
                clearLocalStorage()
                return navigateTo('/connexion')
            }
        } catch (error) {
            console.error('Erreur vérification token:', error)
            clearLocalStorage()
            return navigateTo('/')
        }
    }
})

// ✅ Fonction utilitaire pour éviter la répétition
function clearLocalStorage() {
    const keys = [
        'auth_token', 'auth_token_expires_at', 'user',
        'main_entite', 'selected_entite', 'entite_user',
        'entites', 'role', 'roles', 'permissions',
        'directeur_entite_user_id'
    ]
    keys.forEach(key => localStorage.removeItem(key))
}