
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const email = body?.email
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, message: 'Email invalide.' }
  }
  try {
    // Appel à l'API Laravel pour l'envoi du lien de réinitialisation
    const res = await $fetch(`${config.public.laravelApiUrl}/forgot-password`, {
      method: 'POST',
      body: { email },
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    if (res.success || res.status === 'success') {
      return { success: true }
    } else {
      return { success: false, message: res.message || 'Erreur lors de la demande.' }
    }
  } catch (e) {
    return { success: false, message: "Erreur lors de l'envoi de l'email." }
  }
})
