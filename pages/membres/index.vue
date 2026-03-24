<script setup>
import { useMembre } from '@/composables/membres/useMembres'
import { useEntiteUser } from '@/composables/entite-user/useEntiteUser'

definePageMeta({ title: 'Membres' })

const toast         = useToast()
const membreApi     = useMembre()
const entiteUserApi = useEntiteUser()

// ── State ─────────────────────────────────────────────────────────────────────
const membres     = ref([])
const entiteUsers = ref([])
const { loading, error } = membreApi

// ── Fetch membres ─────────────────────────────────────────────────────────────
const fetchMembres = async () => {
  try {
    const data = await membreApi.getMembres()
    membres.value = data
    if (process.client)
      localStorage.setItem('membres', JSON.stringify(data))
  } catch {
    if (process.client) {
      const cached = localStorage.getItem('membres')
      if (cached) membres.value = JSON.parse(cached)
    }
  }
}

// ── Fetch entite-users pour le select ─────────────────────────────────────────
const fetchEntiteUsers = async () => {
  try {
    const res = await entiteUserApi.getEntiteUsers()
    entiteUsers.value = res.data ?? res
  } catch {
    console.warn('Impossible de charger les entite-users')
  }
}

onMounted(async () => {
  if (process.client) {
    const cached = localStorage.getItem('membres')
    if (cached) membres.value = JSON.parse(cached)
  }
  await Promise.all([fetchMembres(), fetchEntiteUsers()])
})

// ── Options pour le select ────────────────────────────────────────────────────
const entiteUserOptions = computed(() => {
  const membreIds = new Set(membres.value.map(m => m.entite_user_id))
  return entiteUsers.value
    .filter(eu => !membreIds.has(eu.id))
    .map(eu => ({
      label: `${eu.user?.nom ?? ''} ${eu.user?.prenom ?? ''} — ${eu.entite?.libelle ?? ''}`.trim(),
      value: eu.id,
    }))
})

// ── DataTable ─────────────────────────────────────────────────────────────────
const columns = [
  { key: 'nom',    label: 'Nom & Prénom', sortable: true,  filterable: true,  showLabel: true, inputHidden: false },
  { key: 'role',   label: 'Rôle',         sortable: true,  filterable: true,  showLabel: true, inputHidden: false },
  { key: 'statut', label: 'Statut',       sortable: false, filterable: false, showLabel: true, inputHidden: true  },
]

const tableData = computed(() =>
  membres.value.map(m => ({
    id:     m.id,
    nom:    `${m.entite_user?.user?.nom ?? ''} ${m.entite_user?.user?.prenom ?? ''}`.trim(),
    role:   m.role === 'secretaire_codir' ? 'Secrétaire CODIR' : 'Membre',
    statut: m.statut ? 'actif' : 'inactif',
    _raw:   m,
  }))
)

// ── Modale création ───────────────────────────────────────────────────────────
const createModal = ref(false)
const createForm  = reactive({
  entite_user_id:     null,   // ✅ FIX 3 — nom unifié (singulier)
  estSecretaireCodir: false,
  statut:             true,
  date_debut:         '',
})

const resetCreate = () => Object.assign(createForm, {
  entite_user_id:     null,   // ✅ FIX 3 — cohérent avec la déclaration
  estSecretaireCodir: false,
  statut:             true,
  date_debut:         '',
})

const openCreate = () => {
  resetCreate()
  createModal.value = true
}

const handleCreate = async () => {
  // ✅ FIX 1 — condition de validation corrigée
  if (!createForm.entite_user_id) {
    toast.add({
      title: 'Champs requis manquants',
      description: 'Sélectionnez au moins un utilisateur',
      color: 'orange',
      icon: 'i-heroicons-exclamation-triangle',
    })
    return
  }

  try {
    // ✅ FIX 2 — Promise.all supprimé, appel direct
    await membreApi.createMembre({
      entite_user_id: createForm.entite_user_id,
      role:           createForm.estSecretaireCodir ? 'secretaire_codir' : 'membre',
      statut:         createForm.statut,
      date_debut:     createForm.date_debut,
    })
    toast.add({
      title: 'Membre créé',
      color: 'green',
      icon: 'i-heroicons-check-circle',
    })
    createModal.value = false
    resetCreate()
    await fetchMembres()
  } catch (e) {
    const message = e?.data?.message ?? e?.message ?? 'Impossible de créer le membre'
    toast.add({
      title: 'Erreur',
      description: message,
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
    })
  }
}

// ── Modale édition ────────────────────────────────────────────────────────────
const editModal  = ref(false)
const editTarget = ref(null)
const editForm   = reactive({ statut: true, date_debut: '' })

const openEdit = (item) => {
  editTarget.value    = item._raw
  editForm.statut     = !!item._raw.statut
  editForm.date_debut = item._raw.date_debut || ''
  editModal.value     = true
}

const handleEdit = async () => {
  if (!editForm.date_debut) {
    toast.add({
      title: 'La date de début est requise',
      color: 'orange',
      icon: 'i-heroicons-exclamation-triangle',
    })
    return
  }
  const snapshot = JSON.parse(JSON.stringify(membres.value))
  try {
    const idx = membres.value.findIndex(m => m.id === editTarget.value.id)
    if (idx !== -1) membres.value[idx] = { ...membres.value[idx], ...editForm }
    localStorage.setItem('membres', JSON.stringify(membres.value))

    const updated = await membreApi.updateMembre(editTarget.value.id, {
      statut:     editForm.statut,
      date_debut: editForm.date_debut,
    })
    if (idx !== -1) membres.value[idx] = updated
    localStorage.setItem('membres', JSON.stringify(membres.value))

    toast.add({ title: 'Membre mis à jour', color: 'green', icon: 'i-heroicons-check-circle' })
    editModal.value = false
  } catch (e) {
    membres.value = snapshot
    localStorage.setItem('membres', JSON.stringify(snapshot))
    const message = e?.data?.message ?? e?.message ?? 'Impossible de modifier le membre'
    toast.add({ title: 'Erreur', description: message, color: 'red', icon: 'i-heroicons-exclamation-circle' })
  }
}

// ── Suppression ───────────────────────────────────────────────────────────────
const handleDelete = async (item) => {
  const snapshot = JSON.parse(JSON.stringify(membres.value))
  membres.value = membres.value.filter(m => m.id !== item.id)
  localStorage.setItem('membres', JSON.stringify(membres.value))
  try {
    await membreApi.deleteMembre(item.id)
    toast.add({ title: 'Membre supprimé', color: 'green', icon: 'i-heroicons-check-circle' })
  } catch (e) {
    membres.value = snapshot
    localStorage.setItem('membres', JSON.stringify(snapshot))
    const message = e?.data?.message ?? e?.message ?? 'Impossible de supprimer le membre'
    toast.add({ title: 'Erreur', description: message, color: 'red', icon: 'i-heroicons-exclamation-circle' })
  }
}

// ── Navigation détail ─────────────────────────────────────────────────────────
const handleView = (item) => {
  if (process.client)
    localStorage.setItem('currentMembre', JSON.stringify(item._raw))
  navigateTo(`/membres/${item.id}`)
}
</script>

<template>
  <div class="mx-auto py-10 px-6">

    <!-- Header -->
    <PageHeader
      title="Membres"
      description="Gérez les membres et leurs rôles"
      btnText="Nouveau membre"
      :modal="true"
      @click="openCreate"
    />

    <!-- Loading -->
    <div v-if="loading && !membres.length" class="flex justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-blue-500" />
    </div>

    <!-- Erreur -->
    <UAlert
      v-else-if="error && !membres.length"
      color="red"
      icon="i-heroicons-exclamation-circle"
      :title="error"
      class="mb-6"
    />

    <!-- Vide -->
    <div v-else-if="!membres.length" class="text-center py-20">
      <UIcon name="i-heroicons-users" class="w-16 h-16 mx-auto text-gray-300 mb-4" />
      <h3 class="text-lg font-semibold mb-2">Aucun membre</h3>
      <CustomButton btnText="Ajouter un membre" :modal="true" @click="openCreate" />
    </div>

    <!-- DataTable -->
    <DataTable
      v-else
      :data="tableData"
      :columns="columns"
      :default-actions="['view', 'edit', 'delete']"
      :show-row-numbers="true"
      :default-items-per-page="10"
      :left-aligned-columns="['nom', 'role', 'statut']"
      empty-state-title="Aucun membre"
      empty-state-text="Ajoutez votre premier membre."
      @view="handleView"
      @edit="openEdit"
      @delete="handleDelete"
    >
      <template #cell-statut="{ value }">
        <span :class="`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
          value === 'actif'
            ? 'text-green-600 bg-green-50 dark:bg-green-950/40'
            : 'text-gray-500 bg-gray-100 dark:bg-gray-800/60'
        }`">
          {{ value }}
        </span>
      </template>
    </DataTable>

  </div>

  <!-- ── Modale création ────────────────────────────────────────────────────── -->
  <UModal v-model="createModal">
    <UCard class="rounded-2xl">
      <template #header>
        <h3 class="font-semibold">Nouveau membre</h3>
      </template>

      <div class="p-2 flex flex-col gap-4">

        <UFormGroup label="Utilisateur" required>
          <!-- ✅ FIX 3 — v-model unifié sur entite_user_id (singulier) -->
          <AppSelectSearch
            v-model="createForm.entite_user_id"
            :options="entiteUserOptions"
            :multiple="false"
            :loading="entiteUserApi.loading.value"
            placeholder="Rechercher un utilisateur..."
          />
          <!-- ✅ FIX 4 — condition sécurisée, pas de .length sur null -->
          <p v-if="createForm.entite_user_id" class="text-xs text-blue-600 mt-1">
            1 utilisateur sélectionné
          </p>
        </UFormGroup>

        <UFormGroup label="Est Secrétaire CODIR ?">
          <div class="flex items-center gap-2">
            <UToggle v-model="createForm.estSecretaireCodir" />
            <span class="text-sm text-gray-500">
              {{ createForm.estSecretaireCodir ? 'Oui — secrétaire CODIR' : 'Non — membre simple' }}
            </span>
          </div>
          <p v-if="createForm.estSecretaireCodir" class="text-xs text-amber-600 mt-1">
            ⚠ Un seul secrétaire CODIR actif est autorisé
          </p>
        </UFormGroup>

        <UFormGroup label="Date de début" required>
          <UInput v-model="createForm.date_debut" type="date" size="md" />
        </UFormGroup>

        <UFormGroup label="Statut">
          <div class="flex items-center gap-2">
            <UToggle v-model="createForm.statut" />
            <span class="text-sm text-gray-500">{{ createForm.statut ? 'Actif' : 'Inactif' }}</span>
          </div>
        </UFormGroup>

      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" variant="ghost" @click="createModal = false; resetCreate()">Annuler</UButton>
          <UButton color="blue" :loading="membreApi.loading.value" @click="handleCreate">Créer</UButton>
        </div>
      </template>
    </UCard>
  </UModal>

  <!-- ── Modale édition ─────────────────────────────────────────────────────── -->
  <UModal v-model="editModal">
    <UCard class="rounded-2xl">
      <template #header>
        <h3 class="font-semibold">Modifier le membre</h3>
      </template>

      <div class="p-2 flex flex-col gap-4">

        <!-- Infos non modifiables -->
        <div v-if="editTarget" class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 text-sm text-gray-500">
          <span class="font-medium text-gray-700 dark:text-gray-300">
            {{ editTarget.entite_user?.user?.nom }} {{ editTarget.entite_user?.user?.prenom }}
          </span>
          — {{ editTarget.entite_user?.entite?.libelle }}
          <span :class="`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full ${
            editTarget.role === 'secretaire_codir'
              ? 'text-violet-600 bg-violet-50'
              : 'text-blue-600 bg-blue-50'
          }`">
            {{ editTarget.role === 'secretaire_codir' ? 'Secrétaire CODIR' : 'Membre' }}
          </span>
        </div>

        <UFormGroup label="Date de début" required>
          <UInput v-model="editForm.date_debut" type="date" size="md" />
        </UFormGroup>

        <UFormGroup label="Statut">
          <div class="flex items-center gap-2">
            <UToggle v-model="editForm.statut" />
            <span class="text-sm text-gray-500">{{ editForm.statut ? 'Actif' : 'Inactif' }}</span>
          </div>
        </UFormGroup>

      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" variant="ghost" @click="editModal = false">Annuler</UButton>
          <UButton color="blue" :loading="membreApi.loading.value" @click="handleEdit">Enregistrer</UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>