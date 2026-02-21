export const useNotifications = () => {
  const notifications = ref([])
  const nonLues = ref(0)
  const config = useRuntimeConfig()
  let pollingInterval = null

  const charger = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const data = await $fetch(`${config.public.apiBase}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      notifications.value = data.notifications
      nonLues.value = data.non_lues
    } catch (e) {
      console.error('Erreur notifications:', e)
    }
  }

  const marquerLu = async (id) => {
    try {
      const token = localStorage.getItem('auth_token')
      await $fetch(`${config.public.apiBase}/notifications/${id}/lire`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
      const notif = notifications.value.find(n => n.id === id)
      if (notif) {
        notif.lu = true
        nonLues.value = Math.max(0, nonLues.value - 1)
      }
    } catch (e) {
      console.error('Erreur marquerLu:', e)
    }
  }

  const toutLire = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      await $fetch(`${config.public.apiBase}/notifications/tout-lire`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
      notifications.value.forEach(n => n.lu = true)
      nonLues.value = 0
    } catch (e) {
      console.error('Erreur toutLire:', e)
    }
  }

  const demarrerPolling = () => {
    charger()
    pollingInterval = setInterval(charger, 30_000)
  }

  const arreterPolling = () => {
    if (pollingInterval) clearInterval(pollingInterval)
  }

  return {
    notifications,
    nonLues,
    charger,
    marquerLu,
    toutLire,
    demarrerPolling,
    arreterPolling,
  }
}