<template>
  <div class="min-h-screen bg-slate-100 p-6 font-sans">

    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Fonctions</h1>
        <p class="text-sm text-slate-500">Gestion des fonctions et rôles</p>
      </div>
      <UBadge color="green" variant="soft" size="lg" class="ml-auto">
        <Icon name="i-heroicons-plus" class="h-4 w-4 mr-1" />
        <UButton to="/fonctions/create" variant="text" size="sm" class="p-0 m-0 text-green-600">
          Nouveau
        </UButton>
      </UBadge>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
      <div class="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <span class="text-sm font-medium">Chargement des données...</span>
    </div>

    <!-- Error -->
    <div v-else-if="error"
      class="flex items-center gap-4 p-5 bg-red-50 border border-red-200 rounded-xl max-w-2xl mx-auto sm:mx-0">
      <svg class="w-8 h-8 text-red-600 shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clip-rule="evenodd" />
      </svg>
      <div class="flex-1">
        <p class="text-sm font-bold text-red-900">Erreur de chargement</p>
        <p class="text-xs text-red-700">{{ error }}</p>
      </div>
      <button
        class="px-4 py-2 text-xs font-bold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors shrink-0"
        @click="refresh">
        Réessayer
      </button>
    </div>

    <!-- Table -->
    <DataTable v-else :data="fonctions" :columns="columns" :selectable="true"
      :left-aligned-columns="['code', 'libelle']" 
      @edit="onEdit"
      @delete="onDelete" 
      @view="onView" 
      @selection-change="onSelectionChange">
      
      <template #advanced-filters="{ filters, onFilter }">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          <div v-for="field in [
            { id: 'code', label: 'Code' },
            { id: 'libelle', label: 'Libellé' }
          ]" :key="field.id">
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              {{ field.label }}
            </label>
            <input v-model="filters[field.id]" placeholder="Filtrer..."
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              @input="onFilter" />
          </div>
        </div>
      </template>

      <template #selection-actions="{ selected }">
        <button v-if="selected.length > 0"
          class="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-red-600 to-orange-600 rounded-lg hover:opacity-90 transition-opacity"
          @click="onBulkDelete(selected)">
          <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clip-rule="evenodd" />
          </svg>
          Supprimer ({{ selected.length }})
        </button>
      </template>

      <template #cell-code="{ value }">
        <span
          class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
          {{ value || 'N/A' }}
        </span>
      </template>

      <template #cell-users_count="{ value }">
        <span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border" :class="{
          'bg-green-50 text-green-700 border-green-100': value > 0,
          'bg-slate-100 text-slate-600 border-slate-200': value === 0
        }">
          {{ value }} utilisateur{{ value > 1 ? 's' : '' }}
        </span>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import DataTable from '~/components/DataTable.vue'

const config = useRuntimeConfig()

// Configuration colonnes (basée sur le contrôleur: code, libelle, users)
const columns = [
  { key: 'id', label: 'N°', visible: true },
  { key: 'code', label: 'Code', visible: true },
  { key: 'libelle', label: 'Libellé', visible: true },
  { key: 'users_count', label: 'Utilisateurs', visible: true },
]

// États
const fonctions = ref([])
const loading = ref(false)
const error = ref(null)

// Fonction de chargement des données
const loadFonctions = async () => {
  loading.value = true
  error.value = null

  try {
    const token = localStorage.getItem('auth_token')
    
    if (!token) {
      throw new Error('Token d\'authentification manquant')
    }

    console.log('🔄 Chargement des fonctions...')

    const response = await $fetch(`${config.public.apiBase}/fonctions`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })

    console.log('📦 Réponse API:', response)

    // Extraction des données selon le format de réponse
    let dataArray = []
    
    if (response?.data?.data && Array.isArray(response.data.data)) {
      // Format Laravel paginé
      dataArray = response.data.data
    } else if (response?.data && Array.isArray(response.data)) {
      // Format simple avec data
      dataArray = response.data
    } else if (Array.isArray(response)) {
      // Tableau direct
      dataArray = response
    } else {
      console.error('❌ Format de réponse inconnu:', response)
      throw new Error('Format de réponse API invalide')
    }

    console.log('📊 Données extraites:', dataArray.length, 'fonctions')

    // Transformation des données selon les champs du contrôleur
    fonctions.value = dataArray.map((fonction) => ({
      id: fonction.id,
      code: fonction.code || 'N/A',
      libelle: fonction.libelle || 'N/A',
      users_count: fonction.users?.length || 0,
      raw_data: fonction // Garder les données brutes pour debug
    }))

    console.log('✅ Fonctions chargées:', fonctions.value.length)

  } catch (err) {
    console.error('❌ Erreur chargement:', err)
    error.value = err.message || 'Erreur lors du chargement des fonctions'
    
    // Si erreur 401, rediriger vers login
    if (err.status === 401 || err.statusCode === 401) {
      useToast().add({
        title: "Session expirée",
        description: "Veuillez vous reconnecter",
        color: "red",
      })
      setTimeout(() => navigateTo('/login'), 1500)
    }
  } finally {
    loading.value = false
  }
}

// Fonction de rafraîchissement
const refresh = async () => {
  console.log('🔄 Rafraîchissement manuel...')
  await loadFonctions()
}

// Charger au montage
onMounted(() => {
  loadFonctions()
})

// Rafraîchir quand on revient sur la page (après création par exemple)
onActivated(() => {
  console.log('🔄 Page activée, rafraîchissement...')
  loadFonctions()
})

// Actions
const onView = (item) => {
  console.log('👁️ Voir:', item)
  navigateTo(`/fonctions/${item.id}`)
}

const onEdit = (item) => {
  console.log('✏️ Éditer:', item)
  navigateTo(`/fonctions/update/${item.id}`)
}

const onDelete = async (item) => {
  if (confirm(`Voulez-vous vraiment supprimer la fonction "${item.libelle}" ?`)) {
    try {
      const token = localStorage.getItem('auth_token')
      
      await $fetch(`${config.public.apiBase}/fonctions/${item.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })
      
      console.log('🗑️ Fonction supprimée:', item.libelle)
      
      useToast().add({
        title: "Succès",
        description: "Fonction supprimée avec succès",
        color: "green",
      })
      
      // Rafraîchir la liste
      await loadFonctions()
      
    } catch (err) {
      console.error('❌ Erreur suppression:', err)
      
      useToast().add({
        title: "Erreur",
        description: err.data?.message || "Erreur lors de la suppression",
        color: "red",
      })
    }
  }
}

const onBulkDelete = async (selectedIds) => {
  if (confirm(`Voulez-vous vraiment supprimer ${selectedIds.length} fonction(s) ?`)) {
    try {
      const token = localStorage.getItem('auth_token')
      let successCount = 0
      let errorCount = 0
      
      for (const id of selectedIds) {
        try {
          await $fetch(`${config.public.apiBase}/fonctions/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          })
          successCount++
        } catch (err) {
          console.error(`Erreur suppression ID ${id}:`, err)
          errorCount++
        }
      }
      
      console.log(`🗑️ Suppression multiple: ${successCount} succès, ${errorCount} échecs`)
      
      useToast().add({
        title: "Suppression terminée",
        description: `${successCount} fonction(s) supprimée(s)${errorCount > 0 ? `, ${errorCount} erreur(s)` : ''}`,
        color: errorCount > 0 ? "orange" : "green",
      })
      
      // Rafraîchir la liste
      await loadFonctions()
      
    } catch (err) {
      console.error('❌ Erreur suppression multiple:', err)
      
      useToast().add({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        color: "red",
      })
    }
  }
}

const onSelectionChange = (ids) => {
  console.log('📋 Sélection:', ids)
}
</script>