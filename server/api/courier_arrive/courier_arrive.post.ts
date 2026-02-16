export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const authToken = getHeader(event, 'authorization')

  try {
    const body = await readBody(event)
    
    // 🔍 DEBUG: Vérifier ce qu'on reçoit
    console.log('📨 Type reçu:', body?.constructor?.name);
    console.log('📨 Contenu du body:', body);

    // ⚠️ IMPORTANT: FormData n'est pas sérialisable directement
    // Nuxt le reçoit comme un objet, pas comme FormData
    // On doit le reconstruire comme FormData pour Laravel

    let formDataToSend;

    if (body instanceof FormData) {
      // Si c'est déjà FormData, le passer directement
      formDataToSend = body;
      console.log('✅ FormData reçu directement');
    } else if (typeof body === 'object' && body !== null) {
      // Si c'est un objet, reconstruire FormData
      console.log('🔄 Reconstruction FormData depuis objet');
      formDataToSend = new FormData();

      for (const [key, value] of Object.entries(body)) {
        if (value !== null && value !== undefined) {
          if (value instanceof File || value instanceof Blob) {
            formDataToSend.append(key, value);
            console.log(`  ✅ ${key}: File/Blob`);
          } else if (typeof value === 'object') {
            // Ignorer les objets imbriqués sauf si c'est un File
            console.log(`  ⚠️ ${key}: Objet ignoré`);
          } else {
            formDataToSend.append(key, String(value));
            console.log(`  ✅ ${key}: ${value}`);
          }
        }
      }
    } else {
      formDataToSend = body;
    }

    console.log('📤 Envoi vers Laravel...');

    // ✅ Envoyer FormData à Laravel
    const response = await $fetch(`${config.laravelApiUrl}/courriers-arrives`, {
      method: 'POST',
      headers: {
        Authorization: authToken,
        // ❌ NE PAS ajouter Content-Type - FormData gère ça
      },
      body: formDataToSend,
    });

    console.log('✅ Réponse Laravel:', response);

    return {
      success: true,
      data: response.data || response,
      message: response.message || 'Succès',
    };

  } catch (error) {
    console.error('❌ Erreur complète:');
    console.error('Status:', error.status);
    console.error('Message:', error.message);
    console.error('Erreurs Laravel:', error.data?.errors);

    // Extraire les erreurs de validation
    const validationErrors = error.data?.errors || {};
    const errorMessages = Object.entries(validationErrors)
      .map(([field, messages]) => {
        const msgs = Array.isArray(messages) ? messages : [messages];
        return `${field}: ${msgs.join(', ')}`;
      })
      .join('\n');

    console.error('Erreurs formatées:', errorMessages);

    return {
      success: false,
      message: error.data?.message || 'Erreur lors de l\'enregistrement',
      validationErrors: validationErrors,
      errorMessages: errorMessages,
      statusCode: error.status || 500,
    };
  }
})