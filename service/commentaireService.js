
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

    const getCommentairesByGroupeId = (groupeType, groupeId)=>{
        return call(`/commentaires/groupe/${groupeType}/${groupeId}`)
    }

    return {
        getCommentaire,
        createCommentaire,
        updateCommentaire,
        deleteCommentaire,
        getCommentairesByGroupeId
    }
}