export const useStatutUI = () => {
 const couleurStatut = (statut) => {

    const colors = {
      'en_cours': 'yellow',
      'realise': 'green',
      'reconduit': 'gold',
      'supprime': 'red',
    }
    return colors[statut?.toLowerCase()] ?? 'purple'
  }

  const statutLabelFR = (statut) => {
    const labels = {
      'en_cours': 'En cours',
      'realise': 'Réalisé',
      'reconduit': 'Reconduit',
      'supprime': 'Supprimé',
    }
    return labels[statut?.toLowerCase()] ?? statut
  }

  return {
    couleurStatut,
    statutLabelFR
  }
}
