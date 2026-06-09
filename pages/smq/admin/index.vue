<template>
  <div class="smq-content">
    <SmqPageHeader
      :overline="`Administration · ${totalActifs} compte${totalActifs !== 1 ? 's' : ''} actif${totalActifs !== 1 ? 's' : ''}`"
      title="Utilisateurs &amp; rôles SMQ"
    />

    <!-- Cartes rôles ------------------------------------------------------------ -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <div
        v-for="role in rolesSmq"
        :key="role.value"
        class="qp-card qp-card--pad cursor-pointer transition-all"
        :style="filtreRole === role.value ? 'outline: 2px solid var(--qp-primary-500); outline-offset: 1px' : ''"
        @click="filtreRole = filtreRole === role.value ? '' : role.value"
      >
        <div class="w-8 h-8 rounded-lg flex items-center justify-center mb-2" :style="role.iconStyle">
          <Icon :name="role.icon" class="h-4 w-4" />
        </div>
        <h4 class="font-semibold text-sm" style="color:var(--qp-fg-1); margin:0 0 3px">{{ role.label }}</h4>
        <div class="qp-num text-xs" style="color:var(--qp-fg-3)">
          {{ countRole(role.value) }} compte{{ countRole(role.value) !== 1 ? 's' : '' }}
        </div>
      </div>
    </div>

    <!-- Filtres ----------------------------------------------------------------- -->
    <div class="flex flex-wrap gap-2.5 items-center mb-4">
      <div class="qp-seg">
        <button :class="{ active: filtreRole === '' }" @click="filtreRole = ''">Tous</button>
        <button v-for="r in rolesSmq" :key="r.value" :class="{ active: filtreRole === r.value }" @click="filtreRole = filtreRole === r.value ? '' : r.value">
          {{ r.label }}
        </button>
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
          <tr v-for="u in utilisateursFiltres" :key="u.id">
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

          <tr v-if="!utilisateursFiltres.length">
            <td colspan="5" class="text-center py-10 text-sm" style="color:var(--qp-fg-3)">
              Aucun utilisateur trouvé.
            </td>
          </tr>
        </tbody>
      </table>

      <div class="px-4 py-3 border-t text-xs" style="border-color:var(--qp-border-2);color:var(--qp-fg-3)">
        {{ utilisateursFiltres.length }} utilisateur{{ utilisateursFiltres.length !== 1 ? 's' : '' }}
      </div>
    </div>

    <!-- ── Modal assignation rôles ─────────────────────────────────────────── -->
    <UModal v-model="roleModalOpen" :ui="{ width: 'sm:max-w-md' }">
      <div class="bg-white rounded-xl overflow-hidden">
        <div class="px-6 py-4 border-b" style="border-color:var(--qp-border-1)">
          <h2 class="font-semibold text-base" style="color:var(--qp-fg-1)">
            Rôles SMQ — {{ utilisateurEnCours ? nomComplet(utilisateurEnCours) : '' }}
          </h2>
          <p class="text-xs mt-1" style="color:var(--qp-fg-3)">
            Un agent peut cumuler plusieurs rôles qualité.
          </p>
        </div>

        <div class="p-6">
          <!-- Checkboxes multi-rôles -->
          <div class="flex flex-col gap-3">
            <label
              v-for="role in rolesSmq"
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

          <div v-if="assignErreur" class="mt-3 text-xs rounded-lg p-3" style="background:var(--qp-danger-50);color:var(--qp-danger-700)">
            {{ assignErreur }}
          </div>
        </div>

        <div class="px-6 py-4 border-t flex items-center justify-between" style="border-color:var(--qp-border-1)">
          <button
            class="text-sm"
            style="color:var(--qp-fg-3)"
            @click="selectedRoles = []"
          >
            Tout retirer
          </button>
          <div class="flex gap-2.5">
            <button class="px-4 py-2 text-sm rounded-lg border" style="border-color:var(--qp-border-1)" @click="roleModalOpen = false">
              Annuler
            </button>
            <button
              class="px-4 py-2 text-sm font-semibold rounded-lg text-white"
              style="background:var(--qp-primary-500)"
              :disabled="saving"
              @click="assignerRoles"
            >
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

// ── Rôles SMQ disponibles ─────────────────────────────────────────────────────
const rolesSmq = [
  {
    value:       'smq_pilote',
    label:       'Pilote',
    description: 'Paramètre les indicateurs et valide les saisies de sa direction',
    icon:        'heroicons:flag-20-solid',
    iconStyle:   'background:var(--qp-primary-50);color:var(--qp-primary-600)',
  },
  {
    value:       'smq_copilote',
    label:       'Co-pilote',
    description: 'Saisit et soumet les données des indicateurs',
    icon:        'heroicons:pencil-20-solid',
    iconStyle:   'background:var(--qp-teal-50);color:var(--qp-teal-700)',
  },
  {
    value:       'smq_rq',
    label:       'Responsable Qualité',
    description: 'Management Global — supervision stratégique du SMQ',
    icon:        'heroicons:chart-bar-20-solid',
    iconStyle:   'background:#EDEAF8;color:#6E59C7',
  },
  {
    value:       'smq_rqa',
    label:       'RQ Adjoint',
    description: 'Management Global — supervision stratégique du SMQ',
    icon:        'heroicons:chart-bar-square-20-solid',
    iconStyle:   'background:#EDEAF8;color:#6E59C7',
  },
]

const ROLE_PILL = {
  smq_pilote:   { label: 'Pilote',        style: 'background:var(--qp-primary-50);color:var(--qp-primary-700)' },
  smq_copilote: { label: 'Co-pilote',     style: 'background:var(--qp-teal-50);color:var(--qp-teal-700)' },
  smq_rq:       { label: 'Resp. Qualité', style: 'background:#EDEAF8;color:#6E59C7' },
  smq_rqa:      { label: 'RQ Adjoint',    style: 'background:#EDEAF8;color:#6E59C7' },
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

/** Compte les utilisateurs ayant CE rôle (parmi potentiellement plusieurs) */
const countRole = (r) => utilisateurs.value.filter(u => rolesSmqUtilisateur(u).includes(r)).length

const utilisateursFiltres = computed(() => {
  let list = utilisateurs.value
  if (filtreRole.value)
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
.smq-content { font-family: 'IBM Plex Sans', system-ui, sans-serif; }
</style>
