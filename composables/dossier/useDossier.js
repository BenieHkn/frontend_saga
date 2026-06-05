import { useDossierService } from '@/service/dossiers/dossierService'

export function useDossier() {
  const { getDossier, createDossier, updateDossier, deleteDossier, fetchDossier } = useDossierService()

  const handleAddDossier = async (ordreId, form) => {
    return await createDossier({ ...form, ordre_du_jour_id: ordreId })
  }

  const handleUpdateDossier = async (dossierId, form) => {
    return await updateDossier(dossierId, form)
  }

  const handleDeleteDossier = async (dossierId) => {
    return await deleteDossier(dossierId)
  }

  const DOSSIER_STATUT_OPTIONS = [
  { label: 'En cours', value: 'en_cours' },
  { label: 'Réalisé', value: 'realise' },
  { label: 'Reconduit', value: 'reconduit' },
  { label: 'Supprimé', value: 'supprime' },
];

  return {
    handleAddDossier,
    handleUpdateDossier,
    handleDeleteDossier,
    getDossier,
    fetchDossier,

    //les variables globales
    DOSSIER_STATUT_OPTIONS,
  }
}