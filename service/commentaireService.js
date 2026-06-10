
export function useCommentaireService(){
    const {call} = useRequestApi()

    const getCommentaire = (id)=>{
        return call(`/commentaires/${id}`)
    }
    const createCommentaire = (data) => {
        return call(`/commentaires`,{
            method: 'POST',
            body: data
        })
    }
    const updateCommentaire = (id,data)=>{
        return call(`/commentaires/${id}`,{
            method: 'PUT',
            body: data
        })
    }
    const deleteCommentaire = (id)=>{
        return call(`/commentaires/${id}`,{
            method: 'DELETE'
        })
    }

    const getCommentairesByGroupeIdAndCodirId = (groupeType, groupeId, codirId)=>{
        return call(`/commentaires/groupe/${groupeType}/${groupeId}/codirs/${codirId}`)
    }

    return {
        getCommentaire,
        createCommentaire,
        updateCommentaire,
        deleteCommentaire,
        getCommentairesByGroupeIdAndCodirId
    }
}