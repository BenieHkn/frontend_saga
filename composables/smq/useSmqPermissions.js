/**
 * useSmqPermissions
 * ─────────────────
 * Composable centralisé pour toutes les vérifications de permissions SMQ.
 *
 * Principe : les permissions SMQ sont renvoyées dans l'objet `permissions.smq`
 * lors du login (via RoleService). Ce composable expose des helpers booléens
 * nommés selon le vocabulaire métier du cahier des charges.
 *
 * Usage :
 *   const { peutCreerIndicateur, estMG, peutValiderSaisie } = useSmqPermissions()
 *   if (peutCreerIndicateur.value) { ... }
 */
export const useSmqPermissions = () => {

  // ── Lecture des permissions depuis localStorage (SSR-safe) ──────────────────

  const getSmqPerms = () => {
    if (typeof window === 'undefined') return {}
    try {
      const raw = localStorage.getItem('permissions')
      const all = raw ? JSON.parse(raw) : {}
      return all?.smq ?? {}
    } catch {
      return {}
    }
  }

  const getRoles = () => {
    if (typeof window === 'undefined') return []
    try {
      const raw = localStorage.getItem('roles')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }

  // ── Helper de base (ref réactif pour usage dans les computed) ─────────────

  /**
   * Retourne un computed réactif basé sur la permission stockée.
   * En SSR (window indisponible), retourne toujours false.
   */
  const perm = (key) => computed(() => getSmqPerms()[key] === true)
  const role = (r)   => computed(() => getRoles().includes(r))

  // ── Rôles ─────────────────────────────────────────────────────────────────

  /**
   * Administrateur du système — hérite de toutes les permissions SMQ.
   * Il n'existe pas de rôle séparé "smq_admin".
   */
  const estAdminSmq  = computed(() => getRoles().includes('administrateur'))

  /** Pilote — paramétrage & validation des indicateurs de sa direction */
  const estPilote    = role('smq_pilote')

  /** Co-pilote — saisie et soumission des données */
  const estCopilote  = role('smq_copilote')

  /** Responsable Qualité — Management Global */
  const estRQ        = role('smq_rq')

  /** Responsable Qualité Adjoint — Management Global */
  const estRQA       = role('smq_rqa')

  /** Management Global = RQ ou RQA */
  const estMG        = computed(() => estRQ.value || estRQA.value)

  /** Appartient au module SMQ (a au moins un rôle SMQ ou est admin système) */
  const estMembreSMQ = computed(() =>
    estAdminSmq.value || estPilote.value || estCopilote.value || estRQ.value || estRQA.value
  )

  // ── Tableau de bord ───────────────────────────────────────────────────────

  /** Peut voir le tableau de bord SMQ de sa direction */
  const peutVoirDashboard       = perm('dashboard')

  /** Peut voir le tableau de bord global (toutes directions) */
  const peutVoirDashboardGlobal = perm('dashboard_global')

  // ── Référentiels (exercices, périodicités, opérateurs) ────────────────────

  const peutVoirReferentiels  = perm('referentiels_voir')
  const peutGererReferentiels = perm('referentiels_gerer')

  // ── Indicateurs ───────────────────────────────────────────────────────────

  /** Peut consulter la liste des indicateurs */
  const peutVoirIndicateurs     = perm('indicateurs_voir')

  /** Peut créer un nouvel indicateur (paramétrage) */
  const peutCreerIndicateur     = perm('indicateurs_creer')

  /** Peut modifier un indicateur existant */
  const peutModifierIndicateur  = perm('indicateurs_modifier')

  /** Peut supprimer un indicateur */
  const peutSupprimerIndicateur = perm('indicateurs_supprimer')

  /** Peut affecter des co-pilotes à un indicateur */
  const peutAffecterCopilotes   = perm('indicateurs_affecter')

  // ── Saisies ───────────────────────────────────────────────────────────────

  /** Peut voir ses propres saisies */
  const peutVoirSaisies      = perm('saisies_voir')

  /** Peut voir toutes les saisies (pilote / MG / admin) */
  const peutVoirToutesSaisies = perm('saisies_voir_toutes')

  /** Peut créer / enregistrer un brouillon */
  const peutCreerSaisie      = perm('saisies_creer')

  /** Peut modifier une saisie en brouillon ou retournée */
  const peutModifierSaisie   = perm('saisies_modifier')

  /** Peut soumettre une saisie au pilote */
  const peutSoumettreSaisie  = perm('saisies_soumettre')

  /** Peut valider une saisie soumise */
  const peutValiderSaisie    = perm('saisies_valider')

  /** Peut retourner une saisie au co-pilote */
  const peutRetournerSaisie  = perm('saisies_retourner')

  /** Peut transmettre une saisie validée au MG */
  const peutTransmettreSaisie = perm('saisies_transmettre')

  // ── FAC ───────────────────────────────────────────────────────────────────

  /** Peut consulter les fiches d'actions correctives */
  const peutVoirFac  = perm('fac_voir')

  /** Peut créer / modifier / clôturer des FAC */
  const peutGererFac = perm('fac_gerer')

  // ── PAQ ───────────────────────────────────────────────────────────────────

  /** Peut consulter le Plan Audit Qualité */
  const peutVoirPaq  = perm('paq_voir')

  /** Peut gérer les audits (créer / modifier) */
  const peutGererPaq = perm('paq_gerer')

  /** Peut gérer les recommandations d'audit */
  const peutGererRecommandations = perm('recommandations_gerer')

  // ── Supervision & rapports ────────────────────────────────────────────────

  /** Peut voir les statistiques de conformité */
  const peutVoirStats      = perm('stats_voir')

  /** Peut consulter les rapports consolidés */
  const peutVoirRapports   = perm('rapports_voir')

  /** Peut voir les historiques */
  const peutVoirHistoriques = perm('historiques_voir')

  // ── Administration ────────────────────────────────────────────────────────

  /** Peut gérer les comptes utilisateurs SMQ */
  const peutGererUtilisateurs = perm('users_gerer')

  // ── Helpers composites ────────────────────────────────────────────────────

  /**
   * Peut accéder à la section SMQ dans la navigation.
   * Vrai dès qu'un utilisateur a au moins le droit de voir le dashboard.
   */
  const peutVoirMenuSMQ = computed(() => peutVoirDashboard.value || peutVoirDashboardGlobal.value)

  /**
   * Retourne le nom lisible du rôle SMQ courant pour l'affichage.
   */
  const labelRoleSMQ = computed(() => {
    if (estAdminSmq.value)  return 'Administrateur'
    if (estRQ.value)        return 'Responsable Qualité (MG)'
    if (estRQA.value)       return 'Responsable Qualité Adjoint (MG)'
    if (estPilote.value)    return 'Pilote'
    if (estCopilote.value)  return 'Co-pilote'
    return null
  })

  /**
   * Couleur du badge pour l'affichage du rôle.
   */
  const couleurRoleSMQ = computed(() => {
    if (estAdminSmq.value)  return { bg: 'var(--qp-n-100)',       text: 'var(--qp-n-700)'       }
    if (estRQ.value)        return { bg: '#EDEAF8',               text: '#6E59C7'                }
    if (estRQA.value)       return { bg: '#EDEAF8',               text: '#6E59C7'                }
    if (estPilote.value)    return { bg: 'var(--qp-primary-50)',  text: 'var(--qp-primary-700)'  }
    if (estCopilote.value)  return { bg: 'var(--qp-teal-50)',     text: 'var(--qp-teal-700)'     }
    return { bg: 'var(--qp-n-50)', text: 'var(--qp-fg-3)' }
  })

  return {
    // Rôles
    estAdminSmq, estPilote, estCopilote, estRQ, estRQA, estMG, estMembreSMQ,
    // Dashboard
    peutVoirDashboard, peutVoirDashboardGlobal,
    // Référentiels
    peutVoirReferentiels, peutGererReferentiels,
    // Indicateurs
    peutVoirIndicateurs, peutCreerIndicateur, peutModifierIndicateur,
    peutSupprimerIndicateur, peutAffecterCopilotes,
    // Saisies
    peutVoirSaisies, peutVoirToutesSaisies,
    peutCreerSaisie, peutModifierSaisie, peutSoumettreSaisie,
    peutValiderSaisie, peutRetournerSaisie, peutTransmettreSaisie,
    // FAC
    peutVoirFac, peutGererFac,
    // PAQ
    peutVoirPaq, peutGererPaq, peutGererRecommandations,
    // Supervision
    peutVoirStats, peutVoirRapports, peutVoirHistoriques,
    // Admin
    peutGererUtilisateurs,
    // Helpers composites
    peutVoirMenuSMQ, labelRoleSMQ, couleurRoleSMQ,
  }
}
