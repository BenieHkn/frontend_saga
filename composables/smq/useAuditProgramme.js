/**
 * useAuditProgramme — Programme des audits (items + pauses calculées)
 */
export const useAuditProgramme = () => {
  const config  = useRuntimeConfig()
  const base    = computed(() => config.public.apiBase)

  const headers     = () => {
    const token = process.client ? localStorage.getItem('auth_token') : ''
    return { Authorization: `Bearer ${token}`, Accept: 'application/json' }
  }
  const jsonHeaders = () => ({ ...headers(), 'Content-Type': 'application/json' })

  // ── CRUD ──────────────────────────────────────────────────────────────────

  const fetchProgramme = async (auditId) => {
    const res = await $fetch(`${base.value}/smq/audits/${auditId}/programme`, { headers: headers() })
    return res?.data ?? []
  }

  const createItem = async (auditId, data) => {
    const res = await $fetch(`${base.value}/smq/audits/${auditId}/programme`, {
      method: 'POST', headers: jsonHeaders(), body: data,
    })
    return res?.data ?? res
  }

  const updateItem = async (id, data) => {
    const res = await $fetch(`${base.value}/smq/programme-items/${id}`, {
      method: 'PUT', headers: jsonHeaders(), body: data,
    })
    return res?.data ?? res
  }

  const deleteItem = async (id) =>
    $fetch(`${base.value}/smq/programme-items/${id}`, { method: 'DELETE', headers: headers() })

  // ── Pauses calculées ──────────────────────────────────────────────────────
  /**
   * Fusionne audits_entites (visites de direction) + audit_programme_items (items spéciaux)
   * en une liste unifiée, triée par date+heure_debut, avec pauses auto-insérées entre les gaps.
   *
   * @param {Array} auditsEntites  — audit.audits_entites (visites d'entités)
   * @param {Array} programmeItems — items spéciaux (réunion d'ouverture, clôture, autre)
   */
  const avecPauses = (auditsEntites = [], programmeItems = []) => {
    // Normaliser les visites d'entités
    const visites = auditsEntites
      .filter(ae => ae.date)
      .map(ae => ({
        _source:     'entite',
        _id:         'ae-' + ae.id,
        date:        (ae.date + '').substring(0, 10),
        heure_debut: ae.heure_debut ?? null,
        heure_fin:   ae.heure_fin   ?? null,
        libelle:     ae.entite?.libelle ?? '—',
        sous_libelle: ae.entite?.processus?.libelle ?? null,
        pilotes_text: ae.entite?.libelle ?? null,
        auditeurs:   ae.users ?? [],
      }))

    // Normaliser les items spéciaux
    const specials = programmeItems.map(item => ({
      _source:     'programme',
      _id:         'pi-' + item.id,
      id:          item.id,
      audit_id:    item.audit_id,
      date:        (item.date + '').substring(0, 10),
      heure_debut: item.heure_debut ?? null,
      heure_fin:   item.heure_fin   ?? null,
      type:        item.type,
      libelle:     item.libelle ?? null,
      pilotes_text: item.pilotes_text ?? null,
    }))

    const all = [...visites, ...specials]
    if (!all.length) return []

    // Grouper par date
    const byDate = {}
    for (const item of all) {
      const d = item.date ?? ''
      if (!byDate[d]) byDate[d] = []
      byDate[d].push(item)
    }

    const result = []
    for (const date of Object.keys(byDate).sort()) {
      result.push({ _type: 'date_header', date })

      const dayItems = [...byDate[date]].sort((a, b) => {
        const ta = a.heure_debut ?? '99:99'
        const tb = b.heure_debut ?? '99:99'
        return ta.localeCompare(tb)
      })

      for (let i = 0; i < dayItems.length; i++) {
        result.push(dayItems[i])
        // Pause auto si gap entre fin[i] et debut[i+1]
        if (i < dayItems.length - 1) {
          const fin    = dayItems[i].heure_fin
          const debut  = dayItems[i + 1].heure_debut
          if (fin && debut && fin < debut) {
            result.push({ _type: 'pause', heure_debut: fin, heure_fin: debut })
          }
        }
      }
    }

    return result
  }

  // ── Labels ────────────────────────────────────────────────────────────────

  const TYPES_ITEM = [
    { value: 'reunion_ouverture', label: 'Réunion d\'ouverture' },
    { value: 'seance_cloture',    label: 'Séance de clôture'   },
    { value: 'autre',             label: 'Autre'                },
  ]

  const labelType = (type) =>
    TYPES_ITEM.find(t => t.value === type)?.label ?? type

  return {
    fetchProgramme, createItem, updateItem, deleteItem,
    avecPauses, TYPES_ITEM, labelType,
  }
}
