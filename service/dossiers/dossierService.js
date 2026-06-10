import { useRequestApi } from "@/composables/useRequestApi";

export function useDossierService() {
    const { call } = useRequestApi();

    const endPoint = ref('dossiers');

    const getDossier = (id) =>
        call(`/${endPoint.value}/${id}`);

    const createDossier = (body) =>
        call(`/${endPoint.value}`, {
            method: 'POST',
            body,
        });

    const updateDossier = (id, body) =>
        call(`/${endPoint.value}/${id}`, {
            method: 'PUT',
            body,
        });

    const deleteDossier = (id) =>
        call(`/${endPoint.value}/${id}`, {
            method: 'DELETE',
        });


    return {
        getDossier,
        updateDossier,
        deleteDossier,
        createDossier
    };
}
