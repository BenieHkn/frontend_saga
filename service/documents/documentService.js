export const useDocumentService = () => {
    const endPoint = "documents";
    const { call } = useRequestApi();

    // get documents by dossier id
    const getDocumentsFromMonth = async () => {
        return await call(`/${endPoint}/lettre_reference`);
    };

    // delete document
    const deleteDocument = async (id) => {
        return await call(`/${endPoint}/${id}`, { method: "DELETE" });
    };

    return {
        getDocumentsFromMonth,
        deleteDocument
    };
}