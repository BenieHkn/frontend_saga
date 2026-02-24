<template>
  <div class="p-6 max-w-[1400px] mx-auto">
    <!-- En-tête -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="flex items-center gap-3 text-2xl font-bold text-slate-800">
        <Icon name="i-heroicons-arrow-path" class="w-7 h-7 text-indigo-600" />
        Liste des Transferts
      </h1>
      <div class="flex items-center gap-3">
        <button @click="refreshData"
          class="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all hover:shadow-md">
          <Icon name="i-heroicons-arrow-path" class="w-4 h-4" />
          Actualiser
        </button>

        <!-- ✅ Bouton "Nouveau" visible uniquement si l'utilisateur peut transférer -->
        <UBadge v-if="peutTransferer() && !isAdmin()" color="blue" variant="soft" size="lg" class="ml-auto">
          <Icon name="i-heroicons-plus" class="h-4 w-4 mr-1" />
          <UButton to="/affectations-transferts/form-transfert" variant="text" size="sm" class="p-0 m-0 text-blue-600">
            Nouveau
          </UButton>
        </UBadge>
      </div>
    </div>

    <!-- Messages d'erreur -->
    <div v-if="error"
      class="flex items-center gap-3 p-4 mb-5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
      <Icon name="i-heroicons-exclamation-triangle" class="w-5 h-5 flex-shrink-0" />
      <span class="flex-1">{{ error }}</span>
      <button @click="error = null" class="text-lg opacity-60 hover:opacity-100 transition-opacity">
        ✕
      </button>
    </div>

    <!-- Loader -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-16 gap-4">
      <div class="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <p class="text-sm text-slate-500">Chargement des transferts...</p>
    </div>

    <!-- DataTable -->
    <DataTable v-else :data="tableData" :default-sort-column="null" :show-row-numbers="true" :columns="columns"
      :selectable="false" :default-items-per-page="10" :items-per-page-options="[10, 25, 50, 100]"
      :left-aligned-columns="['objet', 'courrier', 'emetteur', 'destinataire']" @edit="handleEdit"
      @delete="handleDelete" @selection-change="handleSelectionChange">

      <!-- Slot pour la cellule statut avec badge coloré -->
      <template #cell-statut="{ value }">
        <span class="inline-block px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wide" :class="{
          'bg-amber-100 text-amber-800': value === 'non traité',
          'bg-emerald-100 text-emerald-800': value === 'traité',
          'bg-red-100 text-red-800': value === 'annulé'
        }">
          {{ value }}
        </span>
      </template>

      <!-- Slot pour les actions personnalisées -->
      <template #actions="{ item }">
        <div class="flex gap-1.5 justify-end">
          <!-- Voir les détails : accessible à tous -->
          <button @click="handleView(item)" title="Voir les détails"
            class="inline-flex items-center justify-center w-8 h-8 bg-amber-50 text-amber-700 border-amber-100 rounded-md hover:bg-amber-200 hover:border-amber-900 transition-all group">
            <Icon name="i-heroicons-eye" class="w-4 h-4 group-hover:text-yellow-600" />
          </button>

          <!-- Modifier : uniquement si peut transférer -->
          <button v-if="peutTransferer() && !isAdmin()" @click="handleEdit(item)"
            class="inline-flex items-center justify-center w-8 h-8 bg-emerald-50 text-emerald-700 border-emerald-100 rounded-md hover:bg-emerald-200 hover:border-emerald-900 transition-all group"
            title="Modifier">
            <Icon name="i-heroicons-pencil" class="w-4 h-4 group-hover:text-green-600" />
          </button>

          <!-- Supprimer : uniquement si peut transférer -->
          <!-- <button v-if="peutTransferer()" @click="handleDelete(item)" title="Supprimer"
            class="inline-flex items-center justify-center w-8 h-8 bg-red-50 text-red-700 border-red-100 rounded-md hover:bg-red-200 hover:border-red-900 transition-all group">
            <Icon name="i-heroicons-trash" class="w-4 h-4 group-hover:text-red-600" />
          </button> -->
        </div>
      </template>

      <!-- Slot pour les actions de sélection multiple -->
      <template #selection-actions="{ selected }">
        <template v-if="peutTransferer()">
          <button @click="handleBulkDelete(selected)"
            class="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100 hover:border-indigo-300 transition-all">
            <Icon name="i-heroicons-trash" class="w-4 h-4" />
            Supprimer ({{ selected.length }})
          </button>
        </template>
        <button @click="handleBulkExport(selected)"
          class="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100 hover:border-indigo-300 transition-all">
          <Icon name="i-heroicons-arrow-down-tray" class="w-4 h-4" />
          Exporter ({{ selected.length }})
        </button>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTransferts } from '~/composables/transferts/useTransferts'
import { useAuth } from '~/composables/auth/useAuth'
import DataTable from '~/components/DataTable.vue'

// Composable
const { tableData, loading, error, fetchTransferts, config } = useTransferts()

// ✅ Permission transfert
const { peutTransferer, isAdmin } = useAuth()

// Colonnes du tableau
const columns = ref([
  { key: 'date_transfert', label: 'Date',         visible: true },
  { key: 'objet',          label: 'Objet',         visible: true },
  { key: 'courrier',       label: 'Courrier',       visible: true },
  { key: 'emetteur',       label: 'Émetteur',       visible: true },
  { key: 'destinataire',   label: 'Destinataire',   visible: true },
  { key: 'statut',         label: 'Statut',         visible: true, type: 'badge' },
])

// Handlers
const handleView = (item) => {
  console.log('Voir:', item)
}

const handleEdit = async (item) => {
  // Guard côté client en plus du v-if
  if (!peutTransferer()) return

  try {
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token')

    const response = await fetch(`${config.public.apiBase}/transferts/${item.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        // Champs à mettre à jour
      })
    })

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }

    fetchTransferts()
    console.log('Transfert modifié avec succès')
  } catch (error) {
    console.error('Erreur lors de la modification:', error)
  }
}

const handleDelete = async (item) => {
  // Guard côté client en plus du v-if
  if (!peutTransferer()) return

  if (confirm(`Voulez-vous vraiment supprimer le transfert "${item.objet}" ?`)) {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token')

      const response = await fetch(`${config.public.apiBase}/transferts/${item.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }

      fetchTransferts()
      console.log('Transfert supprimé avec succès')
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }
}

const handleSelectionChange = (selected) => {
  console.log('Sélection:', selected)
}

const handleBulkDelete = (selected) => {
  if (!peutTransferer()) return
  if (confirm(`Voulez-vous vraiment supprimer ${selected.length} transfert(s) ?`)) {
    console.log('Suppression multiple:', selected)
  }
}

const handleBulkExport = (selected) => {
  console.log('Export multiple:', selected)
}

const refreshData = () => {
  fetchTransferts()
}

// Chargement initial
onMounted(() => {
  fetchTransferts()
})
</script>