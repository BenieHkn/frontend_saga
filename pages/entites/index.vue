<template>
  <div class="min-h-screen bg-slate-100 p-6 font-sans">

    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Entités</h1>
        <p class="text-sm text-slate-500">Gestion et organisation des entités</p>
      </div>
      <UBadge color="green" variant="soft" size="lg" class="ml-auto">
        <UButton to="/entites/create" icon="i-heroicons-plus" variant="text" size="sm" class="p-0 m-0 text-green-600">
          Nouveau
        </UButton>
      </UBadge>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
      <div class="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <span class="text-sm font-medium">Chargement des données...</span>
    </div>

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

    <DataTable v-else :data="entites" :columns="columns" :selectable="true"
      :left-aligned-columns="['code', 'libelle', 'fonction']" @edit="onEdit"
      @delete="onDelete" @view="onView" @selection-change="onSelectionChange">
      <template #advanced-filters="{ filters, onFilter }">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="field in [
            { id: 'code', label: 'Code' },
            { id: 'libelle', label: 'Libellé' },
            { id: 'fonction', label: 'Fonction' },
            { id: 'parent_entite', label: 'Entité Parent' }
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

      <template #cell-users_count="{ value }">
        <span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border" :class="{
          'bg-green-50 text-green-700 border-green-100': value > 0,
          'bg-slate-100 text-slate-600 border-slate-200': value === 0
        }">
          {{ value }} utilisateur{{ value > 1 ? 's' : '' }}
        </span>
      </template>

      <template #cell-is_critique="{ value }">
        <span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border" :class="{
          'bg-red-50 text-red-700 border-red-100': value,
          'bg-slate-100 text-slate-600 border-slate-200': !value
        }">
          {{ value ? 'Critique' : 'Normal' }}
        </span>
      </template>
    </DataTable>

    <!-- Modal de confirmation de suppression -->
    <UModal v-model="showDeleteModal">
      <div class="p-6">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-bold text-slate-900">Confirmer la suppression</h3>
            <p class="text-sm text-slate-600 mt-1">Cette action est irréversible</p>
          </div>
        </div>

        <div v-if="itemToDelete" class="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
          <div class="space-y-2 text-sm">
            <div class="flex items-center justify-between">
              <span class="text-slate-600 font-medium">Code:</span>
              <span class="font-semibold text-slate-900">{{ itemToDelete.code }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-600 font-medium">Libellé:</span>
              <span class="font-semibold text-slate-900">{{ itemToDelete.libelle }}</span>
            </div>
            <div v-if="itemToDelete.fonction" class="flex items-center justify-between">
              <span class="text-slate-600 font-medium">Fonction:</span>
              <span class="font-semibold text-slate-900">{{ itemToDelete.fonction }}</span>
            </div>
            <div v-if="itemToDelete.users_count > 0" class="flex items-center justify-between">
              <span class="text-slate-600 font-medium">Utilisateurs:</span>
              <span class="font-semibold text-orange-600">{{ itemToDelete.users_count }} actif(s)</span>
            </div>
            <div v-if="itemToDelete.is_critique" class="mt-3 p-2 bg-red-50 border border-red-200 rounded flex items-center gap-2">
              <svg class="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <span class="text-xs font-semibold text-red-800">Entité critique</span>
            </div>
          </div>
        </div>

        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p class="text-xs text-yellow-800">
            <strong>⚠️ Attention :</strong> Vous êtes sur le point de supprimer cette entité. 
            Cette action supprimera définitivement toutes les données associées.
          </p>
        </div>

        <div class="flex justify-end gap-3">
          <UButton 
            color="gray" 
            variant="outline"
            @click="showDeleteModal = false"
            :disabled="deleting"
          >
            Annuler
          </UButton>
          <UButton 
            color="red"
            @click="confirmDelete"
            :loading="deleting"
          >
            Supprimer définitivement
          </UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup>
import DataTable from '~/components/DataTable.vue'

// --- Configuration colonnes ---
const columns = [
  // { key: 'id', label: 'N°', visible: true, showLabel: false },
  { key: 'code', label: 'Code', visible: true, showLabel: false },
  { key: 'libelle', label: 'Libellé', visible: true, showLabel: false },
  { key: 'fonction', label: 'Fonction', visible: true, showLabel: false },
  { key: 'parent_entite', label: 'Entité Parent', visible: true, showLabel: false },
  { key: 'is_critique', label: 'Point Critique', visible: false, showLabel: false },
  { key: 'users_count', label: 'Utilisateurs Actifs', visible: false, showLabel: false },
]

// États
const entites = ref([])
const loading = ref(false)
const error = ref(null)
const showDeleteModal = ref(false)
const itemToDelete = ref(null)
const deleting = ref(false)

const config = useRuntimeConfig()

// Fonction de chargement des données
const loadEntites = async () => {
  loading.value = true
  error.value = null

  try {
    const token = localStorage.getItem('auth_token')
    
    if (!token) {
      throw new Error('Token d\'authentification manquant')
    }

    console.log('🔄 Chargement des entités...')

    const response = await $fetch(`${config.public.apiBase}/entites`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })

    console.log('📦 Réponse API:', response)

    // Extraction des données selon le format de réponse
    let dataArray = []
    
    if (response?.data && Array.isArray(response.data)) {
      dataArray = response.data
    } else if (response?.data?.data && Array.isArray(response.data.data)) {
      dataArray = response.data.data
    } else if (Array.isArray(response)) {
      dataArray = response
    } else {
      console.error('❌ Format de réponse inconnu:', response)
      throw new Error('Format de réponse API invalide')
    }

    console.log('📊 Données extraites:', dataArray.length, 'entités')

    // Transformation des données selon tous les champs de la migration
    entites.value = dataArray.map((entite) => {
      // Compter les utilisateurs actifs depuis entiteUsers
      const activeUsersCount = entite.entite_users?.filter(eu => eu.actif)?.length || 0

      return {
        id: entite.id,
        code: entite.code || 'N/A',
        libelle: entite.libelle || 'N/A',
        fonction: entite.fonction || 'Non définie',
        parent_entite: entite.parent_libelle || entite.parentEntite?.libelle || 'Aucune',
        parent_entite_id: entite.parent_entite_id,
        is_critique: entite.is_critique || false,
        users_count: activeUsersCount,
        created_at: entite.created_at,
        updated_at: entite.updated_at,
        raw_data: entite
      }
    })

    console.log('✅ Entités chargées:', entites.value.length)

  } catch (err) {
    console.error('❌ Erreur chargement:', err)
    error.value = err.message || 'Erreur lors du chargement des entités'
    
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
  await loadEntites()
}

// Charger au montage
onMounted(() => {
  loadEntites()
})

// Rafraîchir quand on revient sur la page
onActivated(() => {
  console.log('🔄 Page activée, rafraîchissement...')
  loadEntites()
})

// --- Handlers ---
const onView = (item) => {
  console.log('👁️ Voir:', item)
  navigateTo(`/entites/${item.id}`)
}

const onEdit = (item) => {
  console.log('✏️ Éditer:', item)
  navigateTo(`/entites/${item.id}`)
}

// Ouvrir la modal de confirmation
const onDelete = (item) => {
  console.log('🗑️ Demande de suppression:', item)
  itemToDelete.value = item
  showDeleteModal.value = true
}

// Confirmer et exécuter la suppression
const confirmDelete = async () => {
  if (!itemToDelete.value) return
  
  deleting.value = true

  try {
    const token = localStorage.getItem('auth_token')
    
    if (!token) {
      throw new Error('Token d\'authentification manquant')
    }

    console.log('🚀 Suppression de l\'entité ID:', itemToDelete.value.id)
    
    const response = await $fetch(`${config.public.apiBase}/entites/${itemToDelete.value.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
    
    console.log('✅ Réponse API:', response)
    
    // Fermer la modal
    showDeleteModal.value = false
    
    useToast().add({
      title: "Succès",
      description: `L'entité "${itemToDelete.value.libelle}" a été supprimée avec succès`,
      color: "green",
    })
    
    // Réinitialiser
    itemToDelete.value = null
    
    // Rafraîchir la liste
    await loadEntites()
    
  } catch (err) {
    console.error('❌ Erreur suppression:', err)
    
    let errorMessage = "Une erreur est survenue lors de la suppression"
    
    // Erreur de validation (422) - entité avec utilisateurs actifs
    if (err.status === 422 || err.statusCode === 422) {
      errorMessage = err.data?.message || "Impossible de supprimer une entité avec des utilisateurs actifs"
    }
    // Erreur d'authentification (401)
    else if (err.status === 401 || err.statusCode === 401) {
      errorMessage = "Session expirée. Veuillez vous reconnecter"
      setTimeout(() => navigateTo('/login'), 2000)
    }
    // Erreur 404 - entité introuvable
    else if (err.status === 404 || err.statusCode === 404) {
      errorMessage = "L'entité n'existe plus ou a déjà été supprimée"
      // Rafraîchir quand même la liste
      await loadEntites()
    }
    // Autres erreurs
    else {
      errorMessage = err.data?.message || err.message || errorMessage
    }
    
    useToast().add({
      title: "Erreur de suppression",
      description: errorMessage,
      color: "red",
    })
    
    // Garder la modal ouverte en cas d'erreur pour que l'utilisateur puisse réessayer ou annuler
    
  } finally {
    deleting.value = false
  }
}

// Suppression en masse
const onBulkDelete = async (selectedIds) => {
  if (selectedIds.length === 0) return
  
  const confirmMsg = selectedIds.length === 1 
    ? 'Voulez-vous vraiment supprimer cette entité ?' 
    : `Voulez-vous vraiment supprimer ${selectedIds.length} entités ?`
  
  if (!confirm(confirmMsg)) return

  try {
    const token = localStorage.getItem('auth_token')
    
    if (!token) {
      throw new Error('Token d\'authentification manquant')
    }
    
    let successCount = 0
    let errorCount = 0
    const errors = []
    
    // Afficher un toast de progression
    useToast().add({
      title: "Suppression en cours",
      description: `Suppression de ${selectedIds.length} entité(s)...`,
      color: "blue",
    })
    
    for (const id of selectedIds) {
      try {
        await $fetch(`${config.public.apiBase}/entites/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        })
        successCount++
        console.log(`✅ Entité ${id} supprimée`)
      } catch (err) {
        errorCount++
        console.error(`❌ Erreur suppression ID ${id}:`, err)
        
        // Enregistrer les détails de l'erreur
        const entite = entites.value.find(e => e.id === id)
        errors.push({
          id,
          code: entite?.code || `ID ${id}`,
          message: err.data?.message || err.message || 'Erreur inconnue'
        })
      }
    }
    
    console.log(`🗑️ Suppression multiple terminée: ${successCount} succès, ${errorCount} échecs`)
    
    // Afficher le résultat
    if (errorCount === 0) {
      useToast().add({
        title: "Suppression réussie",
        description: `${successCount} entité(s) supprimée(s) avec succès`,
        color: "green",
      })
    } else if (successCount === 0) {
      useToast().add({
        title: "Échec de la suppression",
        description: `Aucune entité n'a pu être supprimée. ${errors[0]?.message || ''}`,
        color: "red",
      })
    } else {
      useToast().add({
        title: "Suppression partielle",
        description: `${successCount} entité(s) supprimée(s), ${errorCount} échec(s)`,
        color: "orange",
      })
      
      // Afficher les détails des erreurs
      if (errors.length > 0 && errors.length <= 3) {
        errors.forEach(err => {
          useToast().add({
            title: `Erreur: ${err.code}`,
            description: err.message,
            color: "red",
          })
        })
      }
    }
    
    // Rafraîchir la liste
    await loadEntites()
    
  } catch (err) {
    console.error('❌ Erreur suppression multiple:', err)
    
    useToast().add({
      title: "Erreur",
      description: err.message || "Erreur lors de la suppression en masse",
      color: "red",
    })
  }
}

const onSelectionChange = (ids) => {
  console.log('📋 Sélection:', ids)
}
</script>