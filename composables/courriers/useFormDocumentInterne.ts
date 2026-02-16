/**
 * Composable pour gérer le formulaire de document interne
 * Gère la validation, l'envoi et la gestion d'erreur
 */

interface FormDocumentInterne {
  // Champs du document
  numero_enreg: string
  date_enreg: string
  reference?: string
  date_courrier?: string
  objet: string
  type_document_id: number
  large_diffusion: boolean
  fonction_id: number

  // Champs spécifiques au document interne
  description?: string
}

export function useFormDocumentInterne() {
  const config = useRuntimeConfig()

  // États du formulaire
  const form = ref<FormDocumentInterne>({
    numero_enreg: '',
    date_enreg: new Date().toISOString().split('T')[0],
    reference: '',
    date_courrier: '',
    objet: '',
    large_diffusion: false,
    fonction_id: 0,
    type_document_id: 0,
    description: '',
  })

  // États de soumission
  const loading = ref(false)
  const error = ref<string | null>(null)
  const errors = ref<string[]>([])
  const fichier = ref<File | null>(null)

  /**
   * ✅ Réinitialise le formulaire
   */
  const resetForm = () => {
    form.value = {
      numero_enreg: '',
      date_enreg: new Date().toISOString().split('T')[0],
      reference: '',
      date_courrier: '',
      objet: '',
      large_diffusion: false,
      fonction_id: 0,
      type_document_id: 0,
      description: '',
    }
    fichier.value = null
    errors.value = []
    error.value = null
  }

  /**
   * ✅ Soumet le formulaire
   */
  const handleSubmit = async () => {
    loading.value = true
    error.value = null
    errors.value = []

    try {
      console.log('🔄 Validation du formulaire...')

      // ✅ Validation 1: Champs obligatoires
      if (!form.value.numero_enreg?.trim()) {
        errors.value.push('Le numéro d\'enregistrement est obligatoire')
      }

      if (!form.value.date_enreg) {
        errors.value.push('La date d\'enregistrement est obligatoire')
      }

      if (!form.value.objet?.trim()) {
        errors.value.push('L\'objet est obligatoire')
      }

      if (!form.value.type_document_id || form.value.type_document_id === 0) {
        errors.value.push('Veuillez sélectionner un type de document')
      }

      if (!fichier.value) {
        errors.value.push('Veuillez sélectionner une pièce jointe')
      }

      // ✅ Si erreurs de validation, retourner
      if (errors.value.length > 0) {
        console.warn('⚠️ Erreurs de validation:', errors.value)
        return { successSubmitForm: false, errors: errors.value }
      }

      console.log('✅ Validation réussie')

      // ✅ Créer FormData
      console.log('📦 Préparation des données...')
      const formData = new FormData()

      // Ajouter les champs du formulaire
      formData.append('numero_enreg', form.value.numero_enreg)
      formData.append('date_enreg', form.value.date_enreg)
      formData.append('reference', form.value.reference || '')
      formData.append('date_courrier', form.value.date_courrier || '')
      formData.append('objet', form.value.objet)
      formData.append('type_document_id', String(form.value.type_document_id))
      formData.append('large_diffusion', form.value.large_diffusion ? '1' : '0')
      formData.append('fonction_id', String(form.value.fonction_id))
      formData.append('description', form.value.description || '')

      // Ajouter le fichier
      if (fichier.value) {
        formData.append('fichier', fichier.value)
        console.log(`📄 Fichier ajouté: ${fichier.value.name}`)
      }

      // ✅ Récupérer le token d'authentification
      let authToken = ''
      if (process.client) {
        authToken = localStorage.getItem('auth_token') || ''
      }

      if (!authToken) {
        throw new Error('Token d\'authentification manquant - Veuillez vous reconnecter')
      }

      // ✅ Récupérer la fonction depuis localStorage
      if (process.client) {
        const selectedFunction = localStorage.getItem('selected_entite')
        if (selectedFunction) {
          try {
            const parsedFunction = JSON.parse(selectedFunction)
            formData.set('fonction_id', String(parsedFunction.id))
          } catch (e) {
            console.warn('⚠️ Erreur lors du parsing de selected_entite:', e)
          }
        }
      }

      console.log('📤 Envoi de la requête API...')

      // ✅ Appel API avec $fetch
      const data = await $fetch(
        `${config.public.laravelApiUrl}/documents-internes`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        }
      )

      console.log('✅ Réponse API reçue:', data)


      // ✅ Réinitialiser le formulaire
      resetForm()

      return { successSubmitForm: true, data }

    } catch (err: unknown) {
      console.error('❌ Erreur complète:', err)

      let errorMessage = 'Une erreur est survenue lors de la soumission'

      // ✅ Gestion des erreurs
      if (err instanceof Error) {
        errorMessage = err.message
      } else if (typeof err === 'object' && err !== null) {
        const errorObj = err as Record<string, any>

        // Erreur d'API
        if (errorObj.data?.message) {
          errorMessage = errorObj.data.message
        }
        // Erreur Nuxt/Fetch
        else if (errorObj.statusMessage) {
          errorMessage = errorObj.statusMessage
        }
        // Erreur HTTP
        else if (errorObj.status) {
          const statusCode = errorObj.status
          if (statusCode === 401) {
            errorMessage = 'Authentification requise - Veuillez vous reconnecter'
          } else if (statusCode === 403) {
            errorMessage = 'Accès refusé - Vous n\'avez pas les permissions'
          } else if (statusCode === 404) {
            errorMessage = 'Endpoint non trouvé - Vérifiez l\'URL API'
          } else if (statusCode === 422) {
            errorMessage = 'Les données envoyées sont invalides'
            if (errorObj.data?.errors) {
              const validationErrors = Object.values(errorObj.data.errors)
                .flat() as string[]
              errors.value = validationErrors
              errorMessage = 'Erreurs de validation'
            }
          } else if (statusCode >= 500) {
            errorMessage = 'Erreur serveur - Veuillez réessayer plus tard'
          } else {
            errorMessage = `Erreur ${statusCode}: ${errorObj.statusMessage || 'Erreur inconnue'}`
          }
        }
        // Si le message est un objet, essayer de le convertir
        else if (errorObj.message && typeof errorObj.message === 'string') {
          errorMessage = errorObj.message
        }
      }

      // Ajouter à la liste des erreurs si pas déjà présent
      if (!errors.value.includes(errorMessage)) {
        errors.value.push(errorMessage)
      }

      error.value = errorMessage

      // Afficher un toast d'erreur
      const toast = useToast()
      toast.add({
        title: 'Erreur',
        description: errorMessage,
        color: 'red',
        timeout: 5000,
      })

      return { successSubmitForm: false, errors: errors.value }

    } finally {
      loading.value = false
    }
  }

  return {
    // États
    form,
    fichier,
    loading,
    error,
    errors,

    // Méthodes
    resetForm,
    handleSubmit,
  }
}