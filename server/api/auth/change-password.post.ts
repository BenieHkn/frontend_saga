export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const token = body?.token as string
  const email = body?.email as string
  const password = body?.password
  const password_confirmation = body?.password_confirmation

  if (!token || !email) {
    return { success: false, message: 'Token ou email manquant.' }
  }

  if (password !== password_confirmation) {
    return { success: false, message: 'Les mots de passe ne correspondent pas.' }
  }
  if (!password || password.length < 6) {
    return { success: false, message: 'Mot de passe trop court.' }
  }
  try {
    // Envoyer le token, email et le nouveau mot de passe à l'API Laravel
    const response = await $fetch(`${config.public.laravelApiUrl}/reset-password`, {
      method: 'POST',
      body: {
        email,
        token,
        password,
        password_confirmation
      }
    })
    
    return { success: true, data: response }
  } catch (e) {
    console.error('Erreur API Laravel:', e)
    return { success: false, message: e.data?.message || "Erreur lors de la modification." }
  }
})
