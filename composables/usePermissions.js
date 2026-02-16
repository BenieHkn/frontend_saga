// Composable pour gérer les permissions selon les fonctions utilisateur
export function usePermissions() {
  // Récupérer l'utilisateur et sa fonction depuis le store d'authentification
  const { user } = useAuth()
  
  // Codes des fonctions spéciales
  const FONCTION_SA = 'SA' // Service Archives - Non confidentiel
  const FONCTION_SP = 'SP' // Service Présidentiel - Confidentiel
  const FONCTION_SECRETARIAT = 'SECRETAIRE_DIR' // Secrétariat de direction
  
  // Types de documents par visibilité
  const DOCUMENT_TYPES = {
    ARRIVEE: 'arrivee',
    DEPART: 'depart',
    INTERNE: 'interne'
  }
  
  // Vérifier si l'utilisateur a une fonction spécifique
  const hasFonction = (codeFonction) => {
    return user.value?.fonction?.code === codeFonction
  }
  
  // Vérifier si l'utilisateur peut voir les documents confidentiels
  const canSeeConfidentiel = () => {
    return hasFonction(FONCTION_SP)
  }
  
  // Vérifier si l'utilisateur peut voir les documents non confidentiels
  const canSeeNonConfidentiel = () => {
    return hasFonction(FONCTION_SA)
  }
  
  // Vérifier si l'utilisateur est un secrétariat
  const isSecretariat = () => {
    return hasFonction(FONCTION_SECRETARIAT)
  }
  
  // Vérifier si l'utilisateur peut accéder aux courriers arrivée/départ
  const canAccessCourriers = () => {
    return hasFonction(FONCTION_SA) || hasFonction(FONCTION_SP)
  }
  
  // Vérifier si l'utilisateur peut accéder aux documents internes
  const canAccessDocumentsInternes = () => {
    return !hasFonction(FONCTION_SA) && !hasFonction(FONCTION_SP)
  }
  
  // Obtenir les types de documents accessibles
  const getAccessibleDocumentTypes = () => {
    if (canAccessCourriers()) {
      return [DOCUMENT_TYPES.ARRIVEE, DOCUMENT_TYPES.DEPART]
    }
    if (canAccessDocumentsInternes()) {
      return [DOCUMENT_TYPES.INTERNE]
    }
    return []
  }
  
  // Filtrer les documents selon les permissions
  const filterDocumentsByPermissions = (documents) => {
    if (!documents || !Array.isArray(documents)) return []
    
    return documents.filter(doc => {
      // Si c'est un courrier arrivée/départ
      if (doc.type === DOCUMENT_TYPES.ARRIVEE || doc.type === DOCUMENT_TYPES.DEPART) {
        if (!canAccessCourriers()) return false
        
        // Vérifier le niveau de confidentialité
        if (doc.confidentiel && !canSeeConfidentiel()) return false
        if (!doc.confidentiel && !canSeeNonConfidentiel()) return false
        
        return true
      }
      
      // Si c'est un document interne
      if (doc.type === DOCUMENT_TYPES.INTERNE) {
        return canAccessDocumentsInternes()
      }
      
      return false
    })
  }
  
  // Obtenir les statistiques accessibles
  const getAccessibleStats = () => {
    const stats = {
      total: 0,
      arrivee: 0,
      depart: 0,
      interne: 0,
      confidentiel: 0,
      nonConfidentiel: 0
    }
    
    if (hasFonction(FONCTION_SA)) {
      // SA ne voit pas les stats SP
      stats.arrivee = 0
      stats.depart = 0
      stats.interne = 0
      stats.confidentiel = 0
      stats.nonConfidentiel = 0
    }
    
    if (hasFonction(FONCTION_SP)) {
      // SP voit tout
      stats.arrivee = 0
      stats.depart = 0
      stats.interne = 0
      stats.confidentiel = 0
      stats.nonConfidentiel = 0
    }
    
    if (canAccessDocumentsInternes()) {
      // Autres fonctions ne voient que les documents internes
      stats.arrivee = 0
      stats.depart = 0
      stats.interne = 0
      stats.confidentiel = 0
      stats.nonConfidentiel = 0
    }
    
    return stats
  }
  
  // Obtenir les libellés des types de documents accessibles
  const getAccessibleDocumentLabels = () => {
    const types = getAccessibleDocumentTypes()
    const labels = {
      [DOCUMENT_TYPES.ARRIVEE]: 'Courrier Arrivée',
      [DOCUMENT_TYPES.DEPART]: 'Courrier Départ', 
      [DOCUMENT_TYPES.INTERNE]: 'Document Interne'
    }
    
    return types.map(type => ({
      value: type,
      label: labels[type]
    }))
  }
  
  return {
    // Fonctions
    hasFonction,
    canSeeConfidentiel,
    canSeeNonConfidentiel,
    isSecretariat,
    canAccessCourriers,
    canAccessDocumentsInternes,
    
    // Données
    FONCTION_SA,
    FONCTION_SP,
    FONCTION_SECRETARIAT,
    DOCUMENT_TYPES,
    
    // Utilitaires
    getAccessibleDocumentTypes,
    filterDocumentsByPermissions,
    getAccessibleStats,
    getAccessibleDocumentLabels
  }
}
