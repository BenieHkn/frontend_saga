import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCourriersStore = defineStore('courriers', () => {
  // Courrier sélectionné pour réponse
  const courrierToReply = ref(null)

  // Setters
  const setCourrierToReply = (courrier) => {
    courrierToReply.value = courrier
  }

  const clearReply = () => {
    courrierToReply.value = null
  }

  // Computed helpers
  const isReplyMode = computed(() => !!courrierToReply.value)

  const replyDocumentSummary = computed(() => {
    if (!courrierToReply.value) return null
    const doc = courrierToReply.value.document
    return {
      id: doc?.id,
      reference: doc?.reference || 'N/A',
      objet: doc?.objet || 'Non spécifié',
      date_enreg: doc?.date_enreg,
      numero_enreg: doc?.numero_enreg,
      type_document: doc?.type_document?.libelle,
    }
  })

  return {
    courrierToReply,
    isReplyMode,
    replyDocumentSummary,
    setCourrierToReply,
    clearReply,
  }
})