import { useRequestApi } from "@/composables/useRequestApi";

export function useCodirService() {
    const { call } = useRequestApi();

    const getCodirs = () =>
        call('/codirs');

    const getCodir = (id) =>
        call(`/codirs/${id}`);

    const createCodir = (body) =>
        call('/codirs', {
            method: 'POST',
            body,
        });

    const updateCodir = (id, body) =>
        call(`/codirs/${id}`, {
            method: 'PUT',
            body,
        });

    const deleteCodir = (id) =>
        call(`/codirs/${id}`, {
            method: 'DELETE',
        });

    const attachPrev = (id) =>
        call(`/codirs/${id}/attach-previous`, {
            method: 'POST',
        });

    const attachODJ = (codirId, ordreId) =>
        call(`/codirs/${codirId}/ordres-du-jour`, {
            method: 'POST',
            body: {
                ordre_du_jour_id: ordreId,
            },
        });

    const detachODJ = (codirId, ordreId) =>
        call(`/codirs/${codirId}/ordres-du-jour/${ordreId}`, {
            method: 'DELETE',
        });

    const attachTache = (codirId, body) =>
        call(`/codirs/${codirId}/taches`, {
            method: 'POST',
            body,
        });

    const updateTachePivot = (codirId, tacheId, body) =>
        call(`/codirs/${codirId}/taches/${tacheId}`, {
            method: 'PUT',
            body,
        });

    const detachTache = (codirId, tacheId) =>
        call(`/codirs/${codirId}/taches/${tacheId}`, {
            method: 'DELETE',
        });

    const savePresences = (id, presences) =>
        call(`/codirs/${id}/presences`, {
            method: 'POST',
            body: { presences },
        });

    const getPresences = (id) =>
        call(`/codirs/${id}/presences`);

    const downloadPdf = (id) =>
        call(`/codirs/${id}/downloadPdf`, {
            method: 'GET',
            blob: true,
        });

    const generatePdf = (id) =>
        call(`/codirs/${id}/generatePdf`, {
            method: 'POST',
        });

    const cloturerCodir = (id) =>
        call(`/codirs/${id}/cloturerCodir`, {
            method: 'PATCH',
        });

    return {
        getCodirs,
        getCodir,
        createCodir,
        updateCodir,
        deleteCodir,
        attachPrev,
        attachODJ,
        detachODJ,
        attachTache,
        updateTachePivot,
        detachTache,
        savePresences,
        getPresences,
        downloadPdf,
        generatePdf,
        cloturerCodir,
    };
}