import { ref } from 'vue'
import { useCommentaireService } from "~/service/commentaireService"

export const useCommentaire = () => {
  const commentaires = ref([])
  const commentaireService = useCommentaireService()
  const openCommentaireModal = ref(false)
  const openListeCommentairesModal = ref(false)
  const loading = ref(false)
  const toast = useToast()

  async function fetchCommentaires(elementType, elementId, codirId) {
    loading.value = true
    try {
      const response = await commentaireService.getCommentairesByGroupeIdAndCodirId(elementType, elementId, codirId)
      commentaires.value = response?.data ?? response ?? []
    } catch (error) {
      console.error('Erreur lors de la recuperation des commentaires:', error)
      commentaires.value = []
    } finally {
      loading.value = false
    }
  }

  const creerCommentaire = async (data) => {
    if (!process.client) return;
    try {
      const entiteUser = JSON.parse(localStorage.getItem("entite_user"))
      const response = await commentaireService.createCommentaire({
        contenu: data.contenu,
        commentable_id: data.commentable_id,
        commentable_type: data.commentable_type,
        entite_user_id: entiteUser?.id,
        codir_id: data.codir_id,
      })

      if (response?.success) {
        toast.add({
          title: "Commentaire créé avec succès",
          color: "success",
          icon: "i-heroicons-check-circle"
        })
        openCommentaireModal.value = false
      }
      return response.data
    } catch (err) {
      console.error("Erreur lors de la création du commentaire", err)
      toast.add({
        title: "Erreur lors de la création du commentaire",
        color: "error",
        icon: "i-heroicons-exclamation-circle"
      })
      throw err
    }
  }

  const modifierCommentaire = async (id, data) => {
    try {
      const response = await commentaireService.updateCommentaire(id, data)
      toast.add({
        title: "Commentaire modifié avec succès",
        color: "success",
        icon: "i-heroicons-check-circle"
      })
      return response
    } catch (err) {
      console.error("Erreur lors de la modification du commentaire", err)
      toast.add({
        title: "Erreur lors de la modification du commentaire",
        color: "error",
        icon: "i-heroicons-exclamation-circle"
      })
      throw err
    }
  }

  const supprimerCommentaire = async (id) => {
    try {
      const response = await commentaireService.deleteCommentaire(id)
      toast.add({
        title: "Commentaire supprimé",
        color: "success",
        icon: "i-heroicons-check-circle"
      })
      return response
    } catch (err) {
      console.error("Erreur lors de la suppression du commentaire", err)
      toast.add({
        title: "Erreur lors de la suppression du commentaire",
        color: "error",
        icon: "i-heroicons-exclamation-circle"
      })
      throw err
    }
  }

  return {
    commentaires,
    creerCommentaire,
    modifierCommentaire,
    supprimerCommentaire,
    openCommentaireModal,
    openListeCommentairesModal,
    fetchCommentaires,
    loading
  }
}