<template>
  <div class="smq-content">
    <SmqPageHeader
      :overline="`Administration · ${totalActifs} compte${totalActifs !== 1 ? 's' : ''} actif${totalActifs !== 1 ? 's' : ''}`"
      title="Utilisateurs &amp; rôles SMQ"
    />

    <!-- Cartes rôles (3 boxes : RQ groupé + Pilote + Co-pilote) ----------------- -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

      <!-- Box RQ (RQ + RQA regroupés) -->
      <div
        class="role-stat-card role-stat-card--navy"
        :class="{ 'role-stat-card--active': filtreRole === 'rq_group' }"
        @click="filtreRole = filtreRole === 'rq_group' ? '' : 'rq_group'"
      >
        <div class="role-stat-card__banner">
          <div class="role-stat-card__icon-wrap">
            <Icon name="heroicons:shield-check-20-solid" class="h-6 w-6" />
          </div>
          <div class="role-stat-card__count qp-num">
            {{ countRole('smq_rq') + countRole('smq_rqa') }}
          </div>
          <div class="role-stat-card__deco" aria-hidden="true" />
        </div>
        <div class="role-stat-card__body">
          <div class="role-stat-card__title">Responsables Qualité</div>
          <div class="role-stat-card__meta">RQ · RQ Adjoint</div>
          <div class="role-stat-card__filter-hint">
            {{ filtreRole === 'rq_group' ? '✓ Filtré' : 'Cliquer pour filtrer' }}
          </div>
        </div>
      </div>

      <!-- Box Pilote -->
      <div
        class="role-stat-card role-stat-card--emerald"
        :class="{ 'role-stat-card--active': filtreRole === 'smq_pilote' }"
        @click="filtreRole = filtreRole === 'smq_pilote' ? '' : 'smq_pilote'"
      >
        <div class="role-stat-card__banner">
          <div class="role-stat-card__icon-wrap">
            <Icon name="heroicons:flag-20-solid" class="h-6 w-6" />
          </div>
          <div class="role-stat-card__count qp-num">
            {{ countRole('smq_pilote') }}
          </div>
          <div class="role-stat-card__deco" aria-hidden="true" />
        </div>
        <div class="role-stat-card__body">
          <div class="role-stat-card__title">Pilotes</div>
          <div class="role-stat-card__meta">Paramètrent les indicateurs</div>
          <div class="role-stat-card__filter-hint">
            {{ filtreRole === 'smq_pilote' ? '✓ Filtré' : 'Cliquer pour filtrer' }}
          </div>
        </div>
      </div>

      <!-- Box Co-pilote -->
      <div
        class="role-stat-card role-stat-card--teal"
        :class="{ 'role-stat-card--active': filtreRole === 'smq_copilote' }"
        @click="filtreRole = filtreRole === 'smq_copilote' ? '' : 'smq_copilote'"
      >
        <div class="role-stat-card__banner">
          <div class="role-stat-card__icon-wrap">
            <Icon name="heroicons:pencil-square-20-solid" class="h-6 w-6" />
          </div>
          <div class="role-stat-card__count qp-num">
            {{ countRole('smq_copilote') }}
          </div>
          <div class="role-stat-card__deco" aria-hidden="true" />
        </div>
        <div class="role-stat-card__body">
          <div class="role-stat-card__title">Co-pilotes</div>
          <div class="role-stat-card__meta">Saisissent les données</div>
          <div class="role-stat-card__filter-hint">
            {{ filtreRole === 'smq_copilote' ? '✓ Filtré' : 'Cliquer pour filtrer' }}
          </div>
        </div>
      </div>

    </div>

    <!-- Filtres ----------------------------------------------------------------- -->
    <div class="flex flex-wrap gap-2.5 items-center mb-4">
      <div class="qp-seg">
        <button :class="{ active: filtreRole === '' }" @click="filtreRole = ''">Tous</button>
        <!-- RQ + RQA regroupés dans un même bouton -->
        <button :class="{ active: filtreRole === 'rq_group' }" @click="filtreRole = filtreRole === 'rq_group' ? '' : 'rq_group'">
          RQ
        </button>
        <!-- Pilote et Co-pilote séparés -->
        <button
          v-for="r in rolesSmq.filter(r => r.groupe === 'operationnel')"
          :key="r.value"
          :class="{ active: filtreRole === r.value }"
          @click="filtreRole = filtreRole === r.value ? '' : r.value"
        >{{ r.label }}</button>
      </div>
      <div class="flex-1" />
      <input
        v-model="search"
        class="qp-input"
        style="width:220px;height:34px;font-size:0.8125rem"
        placeholder="Rechercher…"
      />
    </div>

    <!-- Tableau ----------------------------------------------------------------- -->
    <div v-if="loading" class="flex justify-center py-16">
      <div class="w-8 h-8 border-4 border-slate-200 rounded-full animate-spin" style="border-top-color: var(--qp-primary-500)" />
    </div>

    <div v-else-if="error" class="qp-card qp-card--pad" style="background:var(--qp-danger-50);border-color:var(--qp-danger-100)">
      <p class="text-sm" style="color:var(--qp-danger-700)">{{ error }}</p>
      <button class="mt-3 text-sm underline" style="color:var(--qp-danger-600)" @click="charger">Réessayer</button>
    </div>

    <div v-else class="qp-tablecard">
      <table class="qp-table">
        <thead>
          <tr>
            <th>Utilisateur</th>
            <th>Rôles SMQ</th>
            <th>Entité / Direction</th>
            <th>Statut</th>
            <th style="width:44px" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in utilisateursPagines" :key="u.id">
            <!-- Utilisateur -->
            <td>
              <div class="flex items-center gap-2.5">
                <span
                  class="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-none"
                  :style="{ background: avatarCouleur(nomComplet(u)) }"
                >{{ initialesAvatar(nomComplet(u)) }}</span>
                <div>
                  <div class="font-medium text-sm" style="color:var(--qp-fg-1)">{{ nomComplet(u) }}</div>
                  <div class="text-xs" style="color:var(--qp-fg-3)">{{ u.email }}</div>
                </div>
              </div>
            </td>

            <!-- Rôles SMQ — peut en avoir plusieurs -->
            <td>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="r in rolesSmqUtilisateur(u)"
                  :key="r"
                  class="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full"
                  :style="rolePillStyle(r)"
                >{{ rolePillLabel(r) }}</span>
                <span v-if="!rolesSmqUtilisateur(u).length" class="text-xs" style="color:var(--qp-fg-4)">—</span>
              </div>
            </td>

            <!-- Entité -->
            <td class="text-sm" style="color:var(--qp-fg-2)">{{ entiteUtilisateur(u) }}</td>

            <!-- Statut -->
            <td>
              <span class="flex items-center gap-1.5 text-sm" style="color:var(--qp-fg-2)">
                <span class="w-1.5 h-1.5 rounded-full" :style="{ background: u.statut ? 'var(--qp-success-500)' : 'var(--qp-n-300)' }" />
                {{ u.statut ? 'Actif' : 'Inactif' }}
              </span>
            </td>

            <!-- Actions -->
            <td>
              <button
                class="w-8 h-8 rounded-md flex items-center justify-center transition-all"
                style="color:var(--qp-fg-3)"
                @click="ouvrirModalRole(u)"
                @mouseenter="$event.currentTarget.style.background='var(--qp-n-100)'"
                @mouseleave="$event.currentTarget.style.background='transparent'"
              >
                <Icon name="heroicons:pencil-square" class="h-4 w-4" />
              </button>
            </td>
          </tr>

          <tr v-if="!utilisateursFiltres.length" class="qp-table__empty">
            <td colspan="5">
              <Icon name="heroicons:users" class="h-8 w-8 mx-auto mb-2 block opacity-30" />
              Aucun utilisateur trouvé.
            </td>
          </tr>
        </tbody>
      </table>

      <SmqPagination
        v-model="pageAdmin"
        :total="utilisateursFiltres.length"
        :per-page="perPageAdmin"
        @update:perPage="perPageAdmin = $event; pageAdmin = 1"
      />
    </div>

    <!-- ── Modal assignation rôles ─────────────────────────────────────────── -->
    <UModal v-model="roleModalOpen" :ui="{ width: 'sm:max-w-xl' }">
      <div class="bg-white rounded-xl overflow-hidden">
        <div class="px-6 py-4 border-b" style="border-color:var(--qp-border-1)">
          <h2 class="font-semibold text-base" style="color:var(--qp-fg-1)">
            Rôles SMQ — {{ utilisateurEnCours ? nomComplet(utilisateurEnCours) : '' }}
          </h2>
          <p class="text-xs mt-1" style="color:var(--qp-fg-3)">
            Un agent peut cumuler plusieurs rôles qualité.
          </p>
        </div>

        <div class="p-6 flex flex-col gap-4">

          <!-- Box RQ (Responsable Qualité + RQ Adjoint) -->
          <div class="rounded-lg overflow-hidden" style="border:1px solid var(--qp-primary-200)">
            <div class="px-4 py-2 flex items-center gap-2" style="background:var(--qp-primary-50);border-bottom:1px solid var(--qp-primary-200)">
              <Icon name="heroicons:shield-check-20-solid" class="h-4 w-4" style="color:var(--qp-primary-600)" />
              <span class="text-xs font-semibold uppercase tracking-wide" style="color:var(--qp-primary-700)">RQ — Management Qualité</span>
            </div>
            <div class="flex flex-col gap-0">
              <label
                v-for="role in rolesSmq.filter(r => r.groupe === 'rq')"
                :key="role.value"
                class="flex items-center gap-3 px-4 py-3 cursor-pointer border-b last:border-b-0 transition-all"
                :style="selectedRoles.includes(role.value)
                  ? 'background:var(--qp-primary-50);border-color:var(--qp-primary-200)'
                  : 'background:#fff;border-color:var(--qp-border-2)'"
              >
                <input
                  type="checkbox"
                  :value="role.value"
                  v-model="selectedRoles"
                  style="accent-color:var(--qp-primary-500); width:16px; height:16px; flex-shrink:0"
                />
                <div class="w-7 h-7 rounded-lg flex items-center justify-center flex-none" :style="role.iconStyle">
                  <Icon :name="role.icon" class="h-3.5 w-3.5" />
                </div>
                <div class="flex-1">
                  <div class="font-medium text-sm" style="color:var(--qp-fg-1)">{{ role.label }}</div>
                  <div class="text-xs" style="color:var(--qp-fg-3)">{{ role.description }}</div>
                </div>
              </label>
            </div>
          </div>

          <!-- Rôles opérationnels (Pilote + Co-pilote) -->
          <div class="flex flex-col gap-2">
            <p class="text-xs font-semibold uppercase tracking-wide" style="color:var(--qp-fg-3)">Rôles opérationnels</p>
            <label
              v-for="role in rolesSmq.filter(r => r.groupe === 'operationnel')"
              :key="role.value"
              class="flex items-center gap-3 rounded-lg px-4 py-3 cursor-pointer border transition-all"
              :style="selectedRoles.includes(role.value)
                ? 'border-color:var(--qp-primary-500);background:var(--qp-primary-50)'
                : 'border-color:var(--qp-border-1)'"
            >
              <input
                type="checkbox"
                :value="role.value"
                v-model="selectedRoles"
                style="accent-color:var(--qp-primary-500); width:16px; height:16px; flex-shrink:0"
              />
              <div class="w-7 h-7 rounded-lg flex items-center justify-center flex-none" :style="role.iconStyle">
                <Icon :name="role.icon" class="h-3.5 w-3.5" />
              </div>
              <div class="flex-1">
                <div class="font-medium text-sm" style="color:var(--qp-fg-1)">{{ role.label }}</div>
                <div class="text-xs" style="color:var(--qp-fg-3)">{{ role.description }}</div>
              </div>
            </label>
          </div>

          <div v-if="assignErreur" class="text-xs rounded-lg p-3" style="background:var(--qp-danger-50);color:var(--qp-danger-700)">
            {{ assignErreur }}
          </div>
        </div>

        <div class="px-6 py-4 border-t flex items-center justify-between" style="border-color:var(--qp-border-1)">
          <button class="qp-btn qp-btn--ghost qp-btn--sm" @click="selectedRoles = []">
            Tout retirer
          </button>
          <div class="flex gap-2.5">
            <button class="qp-btn qp-btn--outline qp-btn--sm" @click="roleModalOpen = false">
              Annuler
            </button>
            <button
              class="qp-btn qp-btn--primary qp-btn--sm"
              :disabled="saving"
              @click="assignerRoles"
            >
              <Icon v-if="saving" name="heroicons:arrow-path-20-solid" class="h-4 w-4 animate-spin" />
              {{ saving ? 'Enregistrement…' : 'Enregistrer' }}
            </button>
          </div>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup>
useHead({ title: 'Administration SMQ — SAGA' })
// auth.global.ts s'applique automatiquement

const config = useRuntimeConfig()

const loading            = ref(true)
const error              = ref(null)
const saving             = ref(false)
const assignErreur       = ref('')
const utilisateurs       = ref([])
const roleModalOpen      = ref(false)
const utilisateurEnCours = ref(null)
const selectedRoles      = ref([])   // tableau pour multi-sélection
const filtreRole         = ref('')
const search             = ref('')
const pageAdmin          = ref(1)
const perPageAdmin       = ref(20)

// ── Rôles SMQ disponibles (ordre hiérarchique : RQ → RQA → Pilote → Co-pilote) ─
const rolesSmq = [
  {
    value:       'smq_rq',
    label:       'Responsable Qualité',
    description: 'Management Global — supervision stratégique du SMQ',
    icon:        'heroicons:chart-bar-20-solid',
    iconStyle:   'background:#EDEAF8;color:#6E59C7',
    groupe:      'rq',
  },
  {
    value:       'smq_rqa',
    label:       'RQ Adjoint',
    description: 'Management Global — supervision stratégique du SMQ',
    icon:        'heroicons:chart-bar-square-20-solid',
    iconStyle:   'background:#EDEAF8;color:#6E59C7',
    groupe:      'rq',
  },
  {
    value:       'smq_pilote',
    label:       'Pilote',
    description: 'Paramètre les indicateurs et valide les saisies de sa direction',
    icon:        'heroicons:flag-20-solid',
    iconStyle:   'background:var(--qp-primary-50);color:var(--qp-primary-600)',
    groupe:      'operationnel',
  },
  {
    value:       'smq_copilote',
    label:       'Co-pilote',
    description: 'Saisit et soumet les données des indicateurs',
    icon:        'heroicons:pencil-20-solid',
    iconStyle:   'background:var(--qp-teal-50);color:var(--qp-teal-700)',
    groupe:      'operationnel',
  },
]

const ROLE_PILL = {
  smq_rq:       { label: 'Resp. Qualité', style: 'background:#EDEAF8;color:#6E59C7' },
  smq_rqa:      { label: 'RQ Adjoint',    style: 'background:#EDEAF8;color:#6E59C7' },
  smq_pilote:   { label: 'Pilote',        style: 'background:var(--qp-primary-50);color:var(--qp-primary-700)' },
  smq_copilote: { label: 'Co-pilote',     style: 'background:var(--qp-teal-50);color:var(--qp-teal-700)' },
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const AVATAR_COLORS = ['#6E59C7', 'var(--qp-teal-500)', 'var(--qp-primary-500)', 'var(--qp-navy-500)', 'var(--qp-n-600)']
const avatarCouleur = (n) => AVATAR_COLORS[(n?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length]

const initialesAvatar = (nom) => {
  if (!nom) return '?'
  return nom.trim().split(/\s+/).map(p => p[0]).join('').toUpperCase().slice(0, 2)
}

const nomComplet = (u) => {
  if (!u) return ''
  return [u.prenom, u.nom].filter(Boolean).join(' ') || u.email || '—'
}

/** Retourne TOUS les rôles SMQ de l'utilisateur (tableau) */
const rolesSmqUtilisateur = (u) => {
  if (!u) return []
  const roleNames = (u.roles ?? []).map(r => (typeof r === 'string' ? r : r.name))
  return rolesSmq.map(r => r.value).filter(r => roleNames.includes(r))
}

const rolePillLabel = (r) => ROLE_PILL[r]?.label ?? r
const rolePillStyle = (r) => ROLE_PILL[r]?.style ?? 'background:var(--qp-n-50);color:var(--qp-fg-3)'

const entiteUtilisateur = (u) => {
  const eu = (u.entite_users ?? u.entiteUsers ?? [])[0]
  return eu?.entite?.libelle ?? '—'
}

const totalActifs = computed(() => utilisateurs.value.filter(u => u.statut).length)

// Remettre à la page 1 quand les filtres changent
watch([filtreRole, search], () => { pageAdmin.value = 1 })

const utilisateursPagines = computed(() => {
  const start = (pageAdmin.value - 1) * perPageAdmin.value
  return utilisateursFiltres.value.slice(start, start + perPageAdmin.value)
})

/** Compte les utilisateurs ayant CE rôle (parmi potentiellement plusieurs) */
const countRole = (r) => utilisateurs.value.filter(u => rolesSmqUtilisateur(u).includes(r)).length

const utilisateursFiltres = computed(() => {
  let list = utilisateurs.value
  if (filtreRole.value === 'rq_group')
    list = list.filter(u => rolesSmqUtilisateur(u).some(r => ['smq_rq', 'smq_rqa'].includes(r)))
  else if (filtreRole.value)
    list = list.filter(u => rolesSmqUtilisateur(u).includes(filtreRole.value))
  if (search.value.trim()) {
    const s = search.value.toLowerCase()
    list = list.filter(u =>
      nomComplet(u).toLowerCase().includes(s) ||
      (u.email ?? '').toLowerCase().includes(s) ||
      (u.matricule ?? '').toLowerCase().includes(s)
    )
  }
  return list
})

// ── Chargement ────────────────────────────────────────────────────────────────
const charger = async () => {
  loading.value = true
  error.value   = null
  try {
    const token = process.client ? localStorage.getItem('auth_token') : ''
    const res   = await $fetch(`${config.public.apiBase}/users`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    })
    utilisateurs.value = res?.data ?? res ?? []
  } catch (e) {
    error.value = e?.data?.message || 'Erreur lors du chargement des utilisateurs.'
  } finally {
    loading.value = false
  }
}

// ── Assigner plusieurs rôles SMQ ──────────────────────────────────────────────
const ouvrirModalRole = (u) => {
  utilisateurEnCours.value = u
  selectedRoles.value      = rolesSmqUtilisateur(u)   // pré-cocher les rôles actuels
  assignErreur.value       = ''
  roleModalOpen.value      = true
}

const assignerRoles = async () => {
  if (!utilisateurEnCours.value) return
  saving.value = true
  assignErreur.value = ''
  try {
    const token = process.client ? localStorage.getItem('auth_token') : ''
    await $fetch(`${config.public.apiBase}/users/${utilisateurEnCours.value.id}/smq-roles`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: { roles: selectedRoles.value },   // tableau (vide = tout retirer)
    })
    roleModalOpen.value = false
    await charger()
  } catch (e) {
    assignErreur.value = e?.data?.message || 'Erreur lors de l\'assignation des rôles.'
  } finally {
    saving.value = false
  }
}

onMounted(() => charger())
</script>

<style scoped>
.smq-content { }

/* ── Cartes de rôles ─────────────────────────────────────────────────────── */
.role-stat-card {
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid transparent;
  box-shadow: 0 2px 10px rgba(15,27,45,.08), 0 1px 3px rgba(15,27,45,.05);
  cursor: pointer;
  transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease;
  background: #fff;
  user-select: none;
}
.role-stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(15,27,45,.13), 0 2px 6px rgba(15,27,45,.07);
}
.role-stat-card--active {
  transform: translateY(-2px);
}

/* Bannière gradient haute */
.role-stat-card__banner {
  padding: 20px 20px 16px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
}

/* Cercle décoratif */
.role-stat-card__deco {
  position: absolute;
  width: 100px; height: 100px;
  border-radius: 50%;
  background: rgba(255,255,255,0.12);
  bottom: -36px; right: -24px;
  pointer-events: none;
}

/* Bulle icône */
.role-stat-card__icon-wrap {
  width: 48px; height: 48px;
  border-radius: 14px;
  background: rgba(255,255,255,0.22);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
}

/* Compteur */
.role-stat-card__count {
  font-size: 2.75rem;
  font-weight: 700;
  color: #fff;
  line-height: 1;
  text-shadow: 0 2px 8px rgba(0,0,0,0.15);
  position: relative; z-index: 1;
}

/* Corps bas */
.role-stat-card__body {
  padding: 14px 20px 16px;
  border-top: 1px solid rgba(0,0,0,0.06);
}
.role-stat-card__title {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--qp-fg-1);
  margin-bottom: 2px;
}
.role-stat-card__meta {
  font-size: 0.75rem;
  color: var(--qp-fg-3);
  margin-bottom: 6px;
}
.role-stat-card__filter-hint {
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--qp-fg-4);
  transition: color 180ms;
}
.role-stat-card--active .role-stat-card__filter-hint {
  color: var(--qp-primary-600);
}

/* ── Couleurs ─────────────────────────────────────────────────────────────── */
.role-stat-card--navy .role-stat-card__banner {
  background: linear-gradient(135deg, #064e2a 0%, #116A37 60%, #1F9D52 100%);
}
.role-stat-card--navy.role-stat-card--active {
  border-color: var(--qp-primary-500);
  box-shadow: 0 6px 20px rgba(31,157,82,.25), 0 2px 6px rgba(31,157,82,.15);
}

.role-stat-card--violet .role-stat-card__banner {
  background: linear-gradient(135deg, #5b21b6 0%, #7c3aed 60%, #6E59C7 100%);
}
.role-stat-card--violet.role-stat-card--active {
  border-color: #7c3aed;
  box-shadow: 0 6px 20px rgba(124,58,237,.25), 0 2px 6px rgba(124,58,237,.15);
}

.role-stat-card--emerald .role-stat-card__banner {
  background: linear-gradient(135deg, #065f46 0%, #059669 60%, #1F9D52 100%);
}
.role-stat-card--emerald.role-stat-card--active {
  border-color: var(--qp-primary-500);
  box-shadow: 0 6px 20px rgba(31,157,82,.25), 0 2px 6px rgba(31,157,82,.15);
}

.role-stat-card--teal .role-stat-card__banner {
  background: linear-gradient(135deg, #0a6e66 0%, var(--qp-teal-500) 60%, #0d9488 100%);
}
.role-stat-card--teal.role-stat-card--active {
  border-color: var(--qp-teal-500);
  box-shadow: 0 6px 20px rgba(14,155,142,.25), 0 2px 6px rgba(14,155,142,.15);
}
</style>
