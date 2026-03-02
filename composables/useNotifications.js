// composables/useNotifications.js
// ─────────────────────────────────────────────────────────────────────────────
// Singleton : useState() garantit un état PARTAGÉ entre tous les composants.
// Un seul interval de polling quel que soit le nombre d'appelants.
// ─────────────────────────────────────────────────────────────────────────────

let pollingInterval = null   // hors du composable → unique en mémoire

export const useNotifications = () => {
  const config = useRuntimeConfig()

  // useState = state Nuxt partagé (SSR-safe, un seul exemplaire)
  const notifications = useState('notif_list', () => [])
  const nonLues       = useState('notif_non_lues', () => 0)
  const loading       = useState('notif_loading', () => false)

  // ── helpers ─────────────────────────────────────────────────
  const getHeaders = () => {
    const token = import.meta.client ? localStorage.getItem('auth_token') : null
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  // ── charger ─────────────────────────────────────────────────
  const charger = async () => {
    // Ne pas lancer si pas de token (page login, etc.)
    if (import.meta.client && !localStorage.getItem('auth_token')) return

    loading.value = true
    try {
      const data = await $fetch(`${config.public.apiBase}/notifications`, {
        headers: getHeaders(),
      })

      // Robustesse sur le format de réponse
      if (Array.isArray(data)) {
        notifications.value = data
        nonLues.value = data.filter(n => !n.lu).length
      } else {
        notifications.value = data.notifications  ?? data.data ?? []
        nonLues.value       = data.non_lues       ?? data.unread_count ?? 0
      }
    } catch (e) {
      // 404 = route absente côté backend → ne pas polluer la console en boucle
      if (e?.status === 404 || e?.statusCode === 404) {
        console.warn('⚠️  Route /notifications introuvable (404) — polling stoppé.')
        arreterPolling()
      } else {
        console.error('❌ Erreur notifications:', e?.data?.message ?? e.message ?? e)
      }
    } finally {
      loading.value = false
    }
  }

  // ── marquer une notif comme lue ──────────────────────────────
  const marquerLu = async (id) => {
    try {
      await $fetch(`${config.public.apiBase}/notifications/${id}/lire`, {
        method: 'POST',
        headers: getHeaders(),
      })
      const notif = notifications.value.find(n => n.id === id)
      if (notif && !notif.lu) {
        notif.lu  = true
        nonLues.value = Math.max(0, nonLues.value - 1)
      }
    } catch (e) {
      console.error('❌ Erreur marquerLu:', e?.data?.message ?? e.message ?? e)
    }
  }

  // ── tout marquer comme lu ────────────────────────────────────
  const toutLire = async () => {
    try {
      await $fetch(`${config.public.apiBase}/notifications/tout-lire`, {
        method: 'POST',
        headers: getHeaders(),
      })
      notifications.value.forEach(n => { n.lu = true })
      nonLues.value = 0
    } catch (e) {
      console.error('❌ Erreur toutLire:', e?.data?.message ?? e.message ?? e)
    }
  }

  // ── supprimer une notification ───────────────────────────────
  const supprimer = async (id) => {
    try {
      await $fetch(`${config.public.apiBase}/notifications/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      })
      const idx = notifications.value.findIndex(n => n.id === id)
      if (idx !== -1) {
        if (!notifications.value[idx].lu) nonLues.value = Math.max(0, nonLues.value - 1)
        notifications.value.splice(idx, 1)
      }
    } catch (e) {
      console.error('❌ Erreur supprimer:', e?.data?.message ?? e.message ?? e)
    }
  }

  // ── polling ──────────────────────────────────────────────────
  const demarrerPolling = (intervalMs = 30_000) => {
    // Evite les doublons si demarrerPolling est appelé plusieurs fois
    if (pollingInterval) return

    charger()  // chargement immédiat
    pollingInterval = setInterval(charger, intervalMs)
    console.log(`🔔 Polling notifications démarré (toutes les ${intervalMs / 1000}s)`)
  }

  const arreterPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval)
      pollingInterval = null
      console.log('🔕 Polling notifications stoppé')
    }
  }

  // ── computed helpers ─────────────────────────────────────────
  const notificationsNonLues = computed(() =>
    notifications.value.filter(n => !n.lu)
  )

  const notificationsLues = computed(() =>
    notifications.value.filter(n => n.lu)
  )

  return {
    // state
    notifications,
    nonLues,
    loading,
    // computed
    notificationsNonLues,
    notificationsLues,
    // actions
    charger,
    marquerLu,
    toutLire,
    supprimer,
    demarrerPolling,
    arreterPolling,
  }
}