/**
 * useAuditNavigation
 * ──────────────────
 * Contrôle la visibilité des liens restitution dans le sidebar.
 *
 * État partagé via useState (Nuxt) → toutes les instances lisent/écrivent
 * les mêmes refs. Une mise à jour depuis la page restitution se répercute
 * immédiatement dans le sidebar sans reload.
 *
 * Stratégie stale-while-revalidate :
 *  - Au montage, cache localStorage → affichage immédiat (0 ms)
 *  - Refresh silencieux en arrière-plan pour garder le cache à jour
 *  - chargerAuditNav(true) : ignore le cache (après une clôture, par ex.)
 */

const CACHE_KEY = 'auditNav_v1'
const CACHE_TTL = 10 * 60 * 1000 // 10 min

function lireCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function ecrireCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ...data, ts: Date.now() }))
  } catch {}
}

export function viderCacheAuditNav() {
  try { localStorage.removeItem(CACHE_KEY) } catch {}
}

export const useAuditNavigation = () => {
  const config = useRuntimeConfig()
  const base   = computed(() => config.public.apiBase)

  // ── État PARTAGÉ entre toutes les instances (sidebar + pages) ─────────────
  const auditsChefActifs   = useState('auditNav_chef',   () => [])
  const auditsPiloteActifs = useState('auditNav_pilote', () => [])

  const aAuditsChefActifs   = computed(() => auditsChefActifs.value.length > 0)
  const aAuditsPiloteActifs = computed(() => auditsPiloteActifs.value.length > 0)

  // ── Applique { chef_actif, pilote_actif } dans l'état + cache ────────────
  function _appliquer(data, ecrire = true) {
    auditsChefActifs.value   = data.chef_actif   ? [1] : []
    auditsPiloteActifs.value = data.pilote_actif ? [1] : []
    if (ecrire) ecrireCache(data)
  }

  // ── Fetch réseau ─────────────────────────────────────────────────────────
  async function _fetchNav() {
    const token = localStorage.getItem('auth_token')
    if (!token) return
    const res  = await $fetch(`${base.value}/smq/restitutions/nav`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    })
    _appliquer(res?.data ?? {})
  }

  /**
   * Charge ou rafraîchit l'état de navigation.
   * @param {boolean} force — si true, ignore le cache (ex. après une clôture)
   */
  const chargerAuditNav = (force = false) => {
    if (typeof window === 'undefined') return

    if (!force) {
      // Affichage immédiat depuis le cache
      const cache = lireCache()
      if (cache) {
        _appliquer(cache, false)
        const age = Date.now() - (cache.ts ?? 0)
        // Cache frais → refresh silencieux en arrière-plan
        if (age < CACHE_TTL) {
          _fetchNav().catch(() => {})
          return
        }
      }
    }

    // Pas de cache, cache expiré, ou force=true → fetch direct
    _fetchNav().catch(() => {
      auditsChefActifs.value   = []
      auditsPiloteActifs.value = []
    })
  }

  return {
    auditsChefActifs,
    auditsPiloteActifs,
    aAuditsChefActifs,
    aAuditsPiloteActifs,
    chargerAuditNav,
  }
}
