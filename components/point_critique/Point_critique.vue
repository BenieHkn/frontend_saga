<template>
  <div class="bg-slate-100 p-6 font-sans">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Points Critiques</h1>
        <p class="text-sm text-slate-500">Gestion des points critiques</p>
      </div>
      <UBadge color="green" variant="soft" size="lg" class="ml-auto">
        <Icon name="i-heroicons-plus" class="h-4 w-4 mr-1" />
        <UButton to="/point-critique/create" variant="text" size="sm" class="p-0 m-0 text-green-600">
          Nouveau
        </UButton>
      </UBadge>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
      <div class="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <span class="text-sm font-medium">Chargement des points critiques...</span>
    </div>

    <!-- Error State -->
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

    <!-- DataTable -->
    <DataTable v-else :data="pointsCritiques" :columns="filteredColumns" :selectable="true"
      :left-aligned-columns="['sigle', 'libelle', 'responsable']"
      @edit="onEdit"
      @delete="onDelete"
      @view="onView"
      @selection-change="onSelectionChange">
     
      <!-- Advanced Filters -->
      <template #advanced-filters="{ filters, onFilter }">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="field in [
            { id: 'sigle', label: 'Sigle' },
            { id: 'libelle', label: 'Libellé' },
            { id: 'responsable', label: 'Responsable' }
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

      <!-- Bulk Actions -->
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

      <!-- Custom Cell Rendering for Sigle -->
      <template #cell-sigle="{ value }">
        <span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
          {{ value || 'N/A' }}
        </span>
      </template>

      <!-- Custom Cell Rendering for Libellé -->
      <template #cell-libelle="{ value }">
        <span class="text-xs text-slate-900 font-semibold">
          {{ value || 'N/A' }}
        </span>
      </template>

      <!-- Custom Cell Rendering for Responsable -->
      <template #cell-responsable="{ value }">
        <span class="text-xs text-slate-600 font-medium">
          {{ value || 'Non assigné' }}
        </span>
      </template>

      <!-- Custom Cell Rendering for Statut -->
      <template #cell-statut="{ value }">
        <span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border" :class="{
          'bg-green-50 text-green-700 border-green-100': value === true,
          'bg-red-50 text-red-700 border-red-100': value === false
        }">
          {{ value ? 'Actif' : 'Inactif' }}
        </span>
      </template>

      <!-- Custom Cell Rendering for Date de début -->
      <template #cell-date_debut="{ value }">
        <span class="text-xs text-slate-600 font-medium">
          {{ value ? formatDate(value) : 'Non définie' }}
        </span>
      </template>

      <!-- Custom Cell Rendering for Date de fin -->
      <template #cell-date_fin="{ value, item }">
        <span class="text-xs text-slate-600 font-medium" :class="{
          'text-slate-400 italic': item.statut === true,
          'text-slate-600': item.statut === false
        }">
          {{ item.statut ? 'Non applicable' : (value ? formatDate(value) : 'Non définie') }}
        </span>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import DataTable from '~/components/DataTable.vue'
import { useApi } from '~/composables/useApi'
import { ref, computed, watch } from 'vue'

const config = useRuntimeConfig()

useHead({
  title: "Points Critiques - Sagar Revolution",
});

// --- Configuration colonnes ---
const columns = [
  { key: 'code', label: 'Sigle', visible: true },
  { key: 'libelle', label: 'Libellé', visible: true },
  { key: 'responsable', label: 'Responsable', visible:false },
  { key: 'statut', label: 'Statut', visible: false },
  { key: 'date_debut', label: 'Date de début', visible: false },
  { key: 'date_fin', label: 'Date de fin', visible: false },
]

// --- Fonction pour formater les dates ---
const formatDate = (dateString) => {
  if (!dateString) return ''
 
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch (err) {
    console.error('Erreur formatage date:', err)
    return dateString
  }
}

// --- Transformation des données ---
const transformPointsCritiques = (response) => {
  console.log('📦 Response complète points critiques:', response)
 
  let dataArray = []
 
  if (!response) {
    console.error('❌ Response is null or undefined')
    return []
  }
 
  // Gérer différents formats de réponse
  if (response.data?.data && Array.isArray(response.data.data)) {
    // Format: { data: { data: [...] } } (Laravel pagination)
    dataArray = response.data.data
  } else if (response.data && Array.isArray(response.data)) {
    // Format: { data: [...] }
    dataArray = response.data
  } else if (Array.isArray(response)) {
    // Format: [...] (tableau direct)
    dataArray = response
  } else if (response.success && response.data) {
    // Format: { success: true, data: [...] }
    dataArray = Array.isArray(response.data) ? response.data : [response.data]
  } else {
    console.error('❌ Format de réponse non reconnu:', response)
    return []
  }
 
  console.log('📊 Data array extracted:', dataArray)

  return dataArray.map((point) => ({
    id: point.id,
    code: point.code || 'N/A',
    libelle: point.libelle || 'N/A',
    responsable: point.responsable ?? 'Non assigné',
    statut: point.statut ?? true,
    date_debut: point.date_debut || null,
    date_fin: point.date_fin || null,
  }))
}

// --- API Call ---
const { data: pointsCritiques, loading, error, refresh } = useApi('/points-critiques', {
  transform: transformPointsCritiques,
  immediate: true,
})

// --- Computed pour les colonnes filtrées ---
const filteredColumns = computed(() => {
  return columns.map(column => {
    // Si c'est la colonne "Date de fin", on ajuste sa visibilité
    if (column.key === 'date_fin') {
      // Vérifier si tous les points critiques sont actifs
      const allActive = pointsCritiques.value?.every(point => point.statut === true)
      
      return {
        ...column,
        visible: !allActive, // Masquer la colonne si tous sont actifs
        cellClass: (item) => item.statut === true ? 'opacity-50' : ''
      }
    }
    return column
  })
})

// Watch pour observer les changements de données
watch(pointsCritiques, (newData) => {
  console.log('Données mises à jour, statut des points critiques:', 
    newData?.map(p => ({ libelle: p.libelle, statut: p.statut })))
})

// --- Handlers ---
const onView = (item) => {
  console.log('👁️ Voir point critique :', item)
  navigateTo(`/point-critique/${item.id}`)
}

const onEdit = (item) => {
  console.log('✏️ Éditer point critique :', item)
  navigateTo(`/point-critique/update/${item.id}`)
}

// const onDelete = async (item) => {
//   if (confirm(`Voulez-vous vraiment supprimer le point critique "${item.libelle}" ?`)) {
//     try {
//       const config = useRuntimeConfig()
//       const token = useCookie('auth_token')
     
//       await $fetch(`/api/points-critiques/${item.id}`, {
//         baseURL: config.public.apiBase || 'http://localhost:8000',
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token.value}`,
//           'Accept': 'application/json'
//         }
//       })
     
//       console.log('🗑️ Point critique supprimé :', item)
     
//       useToast().add({
//         title: "Succès",
//         description: "Point critique supprimé avec succès",
//         color: "green",
//       })
     
//       refresh()
     
//     } catch (err) {
//       console.error('❌ Erreur lors de la suppression:', err)
     
//       let errorMessage = "Erreur lors de la suppression du point critique"
     
//       if (err.status === 422 || err.statusCode === 422) {
//         errorMessage = err.data?.message || "Ce point critique ne peut pas être supprimé car il est utilisé"
//       } else if (err.data?.message) {
//         errorMessage = err.data.message
//       }
     
//       useToast().add({
//         title: "Erreur",
//         description: errorMessage,
//         color: "red",
//       })
//     }
//   }
// }

// const onBulkDelete = async (selectedIds) => {
//   if (confirm(`Voulez-vous vraiment supprimer ${selectedIds.length} point(s) critique(s) ?`)) {
//     try {
//       const config = useRuntimeConfig()
//       const token = useCookie('auth_token')
     
//       let successCount = 0
//       let errorCount = 0
     
//       for (const id of selectedIds) {
//         try {
//           await $fetch(`/api/points-critiques/${id}`, {
//             baseURL: config.public.apiBase || 'http://localhost:8000',
//             method: 'DELETE',
//             headers: {
//               'Authorization': `Bearer ${token.value}`,
//               'Accept': 'application/json'
//             }
//           })
//           successCount++
//         } catch (err) {
//           console.error(`❌ Erreur suppression point critique ID ${id}:`, err)
//           errorCount++
//         }
//       }
     
//       console.log(`🗑️ Suppression multiple : ${successCount} succès, ${errorCount} échecs`)
     
//       let message = `${successCount} point(s) critique(s) supprimé(s)`
//       let color = "green"
     
//       if (errorCount > 0) {
//         message += `, ${errorCount} erreur(s)`
//         color = "orange"
//       }
     
//       useToast().add({
//         title: "Suppression terminée",
//         description: message,
//         color: color,
//       })
     
//       refresh()
     
//     } catch (err) {
//       console.error('❌ Erreur suppression multiple:', err)
     
//       useToast().add({
//         title: "Erreur",
//         description: "Erreur lors de la suppression multiple",
//         color: "red",
//       })
//     }
//   }
// }

const onDelete = async (item) => {
  if (confirm(`Voulez-vous vraiment supprimer le point critique "${item.libelle}" ?`)) {
    try {
      const token = localStorage.getItem('auth_token') // ✅ Utiliser localStorage
     
      if (!token) {
        throw new Error('Token d\'authentification manquant')
      }

      await $fetch(`${config.public.apiBase}/points-critiques/${item.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })
     
      console.log('🗑️ Point critique supprimé :', item)
     
      useToast().add({
        title: "Succès",
        description: "Point critique supprimé avec succès",
        color: "green",
      })
     
      refresh()
     
    } catch (err) {
      console.error('❌ Erreur lors de la suppression:', err)
     
      let errorMessage = "Erreur lors de la suppression du point critique"
     
      if (err.status === 401 || err.statusCode === 401) {
        errorMessage = "Session expirée. Veuillez vous reconnecter"
        useToast().add({
          title: "Session expirée",
          description: "Veuillez vous reconnecter",
          color: "red",
        })
        setTimeout(() => navigateTo('/login'), 2000)
        return
      }
     
      if (err.status === 422 || err.statusCode === 422) {
        errorMessage = err.data?.message || "Ce point critique ne peut pas être supprimé car il est utilisé"
      } else if (err.data?.message) {
        errorMessage = err.data.message
      }
     
      useToast().add({
        title: "Erreur",
        description: errorMessage,
        color: "red",
      })
    }
  }
}

const onBulkDelete = async (selectedIds) => {
  if (confirm(`Voulez-vous vraiment supprimer ${selectedIds.length} point(s) critique(s) ?`)) {
    try {
      const token = localStorage.getItem('auth_token') // ✅ Utiliser localStorage
     
      if (!token) {
        throw new Error('Token d\'authentification manquant')
      }

      let successCount = 0
      let errorCount = 0
     
      useToast().add({
        title: "Suppression en cours",
        description: `Suppression de ${selectedIds.length} point(s) critique(s)...`,
        color: "blue",
      })

      for (const id of selectedIds) {
        try {
          await $fetch(`${config.public.apiBase}/points-critiques/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          })
          successCount++
        } catch (err) {
          console.error(`❌ Erreur suppression point critique ID ${id}:`, err)
          errorCount++
        }
      }
     
      console.log(`🗑️ Suppression multiple : ${successCount} succès, ${errorCount} échecs`)
     
      if (errorCount === 0) {
        useToast().add({
          title: "Suppression réussie",
          description: `${successCount} point(s) critique(s) supprimé(s) avec succès`,
          color: "green",
        })
      } else if (successCount === 0) {
        useToast().add({
          title: "Échec de la suppression",
          description: `Aucun point critique n'a pu être supprimé`,
          color: "red",
        })
      } else {
        useToast().add({
          title: "Suppression partielle",
          description: `${successCount} point(s) critique(s) supprimé(s), ${errorCount} échec(s)`,
          color: "orange",
        })
      }
     
      refresh()
     
    } catch (err) {
      console.error('❌ Erreur suppression multiple:', err)
     
      if (err.status === 401 || err.statusCode === 401) {
        useToast().add({
          title: "Session expirée",
          description: "Veuillez vous reconnecter",
          color: "red",
        })
        setTimeout(() => navigateTo('/login'), 2000)
        return
      }

      useToast().add({
        title: "Erreur",
        description: err.message || "Erreur lors de la suppression multiple",
        color: "red",
      })
    }
  }
}

const onSelectionChange = (ids) => {
  console.log('📋 Sélection mise à jour :', ids)
}
</script>