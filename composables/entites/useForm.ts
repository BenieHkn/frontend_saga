import { ref, reactive, computed } from 'vue'
import type { Ref } from 'vue'

export interface FormField {
  name: string
  value: any
  rules?: ValidationRule[]
  error?: string
  touched?: boolean
}

export interface ValidationRule {
  type: 'required' | 'email' | 'min' | 'max' | 'pattern' | 'custom'
  value?: any
  message: string
  validator?: (value: any) => boolean
}

export const useForm = <T extends Record<string, any>>(initialValues: T) => {
  const values = reactive<T>({ ...initialValues })
  const errors = reactive<Record<string, string>>({})
  const touched = reactive<Record<string, boolean>>({})
  const isSubmitting = ref(false)
  const isDirty = ref(false)

  /**
   * Valider un champ
   */
  const validateField = (fieldName: keyof T, rules?: ValidationRule[]): boolean => {
    if (!rules || rules.length === 0) {
      delete errors[fieldName as string]
      return true
    }

    const value = values[fieldName]

    for (const rule of rules) {
      switch (rule.type) {
        case 'required':
          if (!value || (typeof value === 'string' && value.trim() === '')) {
            errors[fieldName as string] = rule.message
            return false
          }
          break

        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (value && !emailRegex.test(value)) {
            errors[fieldName as string] = rule.message
            return false
          }
          break

        case 'min':
          if (typeof value === 'string' && value.length < rule.value) {
            errors[fieldName as string] = rule.message
            return false
          }
          if (typeof value === 'number' && value < rule.value) {
            errors[fieldName as string] = rule.message
            return false
          }
          break

        case 'max':
          if (typeof value === 'string' && value.length > rule.value) {
            errors[fieldName as string] = rule.message
            return false
          }
          if (typeof value === 'number' && value > rule.value) {
            errors[fieldName as string] = rule.message
            return false
          }
          break

        case 'pattern':
          if (value && !rule.value.test(value)) {
            errors[fieldName as string] = rule.message
            return false
          }
          break

        case 'custom':
          if (rule.validator && !rule.validator(value)) {
            errors[fieldName as string] = rule.message
            return false
          }
          break
      }
    }

    delete errors[fieldName as string]
    return true
  }

  /**
   * Valider tous les champs
   */
  const validateForm = (validationRules: Record<keyof T, ValidationRule[]>): boolean => {
    let isValid = true

    for (const fieldName in validationRules) {
      const fieldValid = validateField(fieldName, validationRules[fieldName])
      if (!fieldValid) {
        isValid = false
      }
    }

    return isValid
  }

  /**
   * Définir une valeur de champ
   */
  const setFieldValue = (fieldName: keyof T, value: any) => {
    values[fieldName] = value
    touched[fieldName as string] = true
    isDirty.value = true
  }

  /**
   * Définir une erreur de champ
   */
  const setFieldError = (fieldName: keyof T, error: string) => {
    errors[fieldName as string] = error
  }

  /**
   * Définir plusieurs erreurs (depuis une réponse API)
   */
  const setErrors = (serverErrors: Record<string, string[]>) => {
    for (const field in serverErrors) {
      if (serverErrors[field] && serverErrors[field].length > 0) {
        errors[field] = serverErrors[field][0]
      }
    }
  }

  /**
   * Marquer un champ comme touché
   */
  const setFieldTouched = (fieldName: keyof T, isTouched = true) => {
    touched[fieldName as string] = isTouched
  }

  /**
   * Réinitialiser le formulaire
   */
  const resetForm = (newValues?: Partial<T>) => {
    Object.assign(values, { ...initialValues, ...newValues })
    Object.keys(errors).forEach(key => delete errors[key])
    Object.keys(touched).forEach(key => delete touched[key])
    isDirty.value = false
    isSubmitting.value = false
  }

  /**
   * Réinitialiser les erreurs
   */
  const resetErrors = () => {
    Object.keys(errors).forEach(key => delete errors[key])
  }

  /**
   * Gérer la soumission du formulaire
   */
  const handleSubmit = async <R>(
    onSubmit: (values: T) => Promise<R>,
    validationRules?: Record<keyof T, ValidationRule[]>
  ): Promise<R | null> => {
    if (validationRules && !validateForm(validationRules)) {
      return null
    }

    isSubmitting.value = true
    resetErrors()

    try {
      const result = await onSubmit(values)
      return result
    } catch (error: any) {
      // Gérer les erreurs de validation du serveur
      if (error.data?.errors) {
        setErrors(error.data.errors)
      }
      throw error
    } finally {
      isSubmitting.value = false
    }
  }

  const hasErrors = computed(() => Object.keys(errors).length > 0)
  const isValid = computed(() => !hasErrors.value)

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isDirty,
    isValid,
    hasErrors,
    validateField,
    validateForm,
    setFieldValue,
    setFieldError,
    setErrors,
    setFieldTouched,
    resetForm,
    resetErrors,
    handleSubmit
  }
}