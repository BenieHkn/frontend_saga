<template>
  <div class="p-6 max-w-[1400px] mx-auto">
    <!-- En-tête -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="flex items-center gap-3 text-2xl font-bold text-slate-800">
        <Icon name="i-heroicons-clipboard-document-list" class="w-7 h-7 text-purple-600" />
        Liste des Affectations
      </h1>
      <div class="flex items-center gap-3">
        <button 
          @click="refreshData"
          class="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all hover:shadow-md"
        >
          <Icon name="i-heroicons-arrow-path" class="w-4 h-4" />
          Actualiser
        </button>
        <button 
          @click="handleCreate"
          class="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-600/30"
        >
          <Icon name="i-heroicons-plus" class="w-4 h-4" />
          Nouvelle Affectation
        </button>
      </div>
    </div>

    <!-- Messages d'erreur -->
    <div 
      v-if="error" 
      class="flex items-center gap-3 p-4 mb-5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
    >
      <Icon name="i-heroicons-exclamation-triangle" class="w-5 h-5 flex-shrink-0" />
      <span class="flex-1">{{ error }}</span>
      <button 
        @click="error = null"
        class="text-lg opacity-60 hover:opacity-100 transition-opacity"
      >
        ✕
      </button>
    </div>

    <!-- Loader -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-16 gap-4">
      <div class="w-12 h-12 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin"></div>
      <p class="text-sm text-slate-500">Chargement des affectations...</p>
    </div>

    <!-- DataTable -->
    <DataTable
      v-else
      :default-sort-column="null" :show-row-numbers="true"
      :data="tableData"
      :columns="columns"
      :selectable="false"
      :default-items-per-page="10"
      :items-per-page-options="[10, 25, 50, 100]"
      :left-aligned-columns="['instructions', 'courriers_text', 'destinataires_text', 'emetteur']"
      @edit="handleEdit"
      @delete="handleDelete"
      @selection-change="handleSelectionChange"
    >
      <!-- Slot pour la cellule statut -->
      <template #cell-statut="{ item }">
        <span 
          class="inline-block px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wide"
          :class="`bg-${item.statut_badge.color}-100 text-${item.statut_badge.color}-800`"
        >
          {{ item.statut_badge.label }}
        </span>
      </template>

      <!-- Slot pour la cellule priorité -->
      <template #cell-priority="{ item }">
        <span 
          class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wide"
          :class="`bg-${item.priority_badge.color}-100 text-${item.priority_badge.color}-800`"
        >
          <span 
            class="w-2 h-2 rounded-full"
            :class="`bg-${item.priority_badge.color}-500`"
          ></span>
          {{ item.priority_badge.label }}
        </span>
      </template>

      <!-- Slot pour la cellule courriers -->
      <template #cell-courriers_text="{ item }">
        <div class="flex items-center gap-2">
          <UBadge color="blue" variant="soft" size="xs">
            {{ item.nb_courriers }}
          </UBadge>
          <button 
            v-if="item.nb_courriers > 0"
            @click="showCourriersModal(item)"
            class="text-xs text-blue-600 hover:text-blue-800 hover:underline"
          >
            Voir les courriers
          </button>
          <span v-else class="text-xs text-gray-500">Aucun courrier</span>
        </div>
      </template>

      <!-- Slot pour la cellule destinataires -->
      <template #cell-destinataires_text="{ item }">
        <div class="flex items-center gap-2">
          <UBadge color="indigo" variant="soft" size="xs">
            {{ item.nb_destinataires }}
          </UBadge>
          <button 
            v-if="item.nb_destinataires > 0"
            @click="showDestinatairesModal(item)"
            class="text-xs text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            Voir les destinataires
          </button>
          <span v-else class="text-xs text-gray-500">Aucun destinataire</span>
        </div>
      </template>

      <!-- Slot pour la cellule instructions (tronquée) -->
      <template #cell-instructions="{ value }">
        <span 
          class="block max-w-[300px] truncate text-xs text-slate-700"
          :title="value"
        >
          {{ value || 'Aucune instruction' }}
        </span>
      </template>

      <!-- Slot pour les actions personnalisées -->
      <template #actions="{ item }">
        <div class="flex gap-1.5 justify-end">
          <button 
            @click="handleView(item)"
            title="Voir les détails"
            class="inline-flex items-center justify-center w-8 h-8 rounded-md border border-transparent hover:bg-blue-50 hover:border-blue-200 transition-all group"
          >
            <Icon name="i-heroicons-eye" class="w-4 h-4 text-slate-500 group-hover:text-blue-600" />
          </button>
          <button 
            @click="handleEdit(item)"
            title="Modifier"
            class="inline-flex items-center justify-center w-8 h-8 rounded-md border border-transparent hover:bg-yellow-50 hover:border-yellow-200 transition-all group"
          >
            <Icon name="i-heroicons-pencil" class="w-4 h-4 text-slate-500 group-hover:text-yellow-600" />
          </button>
          <button 
            @click="handleDelete(item)"
            title="Supprimer"
            class="inline-flex items-center justify-center w-8 h-8 rounded-md border border-transparent hover:bg-red-50 hover:border-red-200 transition-all group"
          >
            <Icon name="i-heroicons-trash" class="w-4 h-4 text-slate-500 group-hover:text-red-600" />
          </button>
        </div>
      </template>

      <!-- Slot pour les actions de sélection multiple -->
      <template #selection-actions="{ selected }">
        <button 
          @click="handleBulkDelete(selected)"
          class="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 hover:border-red-300 transition-all"
        >
          <Icon name="i-heroicons-trash" class="w-4 h-4" />
          Supprimer ({{ selected.length }})
        </button>
        <button 
          @click="handleBulkExport(selected)"
          class="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100 hover:border-purple-300 transition-all"
        >
          <Icon name="i-heroicons-arrow-down-tray" class="w-4 h-4" />
          Exporter ({{ selected.length }})
        </button>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAffectations } from '~/composables/affectations/useAffectations'
import DataTable from '~/components/DataTable.vue'
import Swal from 'sweetalert2'

// Composable
const { tableData, loading, error, fetchAffectations } = useAffectations()
const config = useRuntimeConfig()

// Colonnes du tableau
const columns = ref([
  // { 
  //   key: 'id', 
  //   label: 'N°', 
  //   visible: true,
  //   width: 'w-16'
  // },
  { 
    key: 'date_affect', 
    label: 'Date d\'affectation', 
    visible: true 
  },
  { 
    key: 'courriers_text', 
    label: 'Courriers', 
    visible: true,
    width: 'min-w-[150px]'
  },
  { 
    key: 'destinataires_text', 
    label: 'Destinataires', 
    visible: true,
    width: 'min-w-[150px]'
  },
  { 
    key: 'emetteur', 
    label: 'Émetteur', 
    visible: true 
  },
  { 
    key: 'instructions', 
    label: 'Annotations', 
    visible: true 
  },
  { 
    key: 'statut', 
    label: 'Statut', 
    visible: true,
    type: 'badge'
  },
  { 
    key: 'priority', 
    label: 'Priorité', 
    visible: true,
    type: 'badge'
  },
  { 
    key: 'delai_traitement', 
    label: 'Date de retour attendue', 
    visible: true 
  }
])

// Handlers
const handleCreate = () => {
  navigateTo('/affectations/create')
}

// Modale pour afficher la liste des courriers
const showCourriersModal = async (item) => {
  const courriersHtml = item.courriers_list.map((courrier, index) => `
    <div style="display: flex; align-items: flex-start; gap: 12px; padding: 12px; background-color: #f9fafb; border-radius: 8px; margin-bottom: 8px; text-align: left;">
      <div style="width: 40px; height: 40px; border-radius: 50%; background-color: #dbeafe; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
        <svg style="width: 20px; height: 20px; color: #2563eb;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <div style="flex: 1; min-width: 0;">
        <div style="font-weight: 600; color: #111827; font-size: 14px; margin-bottom: 6px;">
          ${courrier.num_sgm || courrier.num_cab || `Courrier #${courrier.id}`}
        </div>
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <div style="font-size: 12px; color: #6b7280;">
            <strong>Structure:</strong> ${courrier.structure || 'N/A'}
          </div>
          <div style="font-size: 12px; color: #6b7280;">
            <strong>Date:</strong> ${new Date(courrier.date_sgm || courrier.date_cab).toLocaleDateString('fr-FR')}
          </div>
          ${courrier.priority ? `
            <div style="margin-top: 4px;">
              <span style="display: inline-block; padding: 4px 8px; font-size: 11px; border-radius: 4px; background-color: #dbeafe; color: #1e40af; font-weight: 600;">
                ${courrier.priority}
              </span>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `).join('')

  await Swal.fire({
    title: `📨 Courriers de l'affectation #${item.id}`,
    html: `
      <div style="text-align: left;">
        <div style="margin-bottom: 16px; padding: 12px; background-color: #eff6ff; border-radius: 8px; border: 1px solid #bfdbfe;">
          <div style="font-size: 14px; color: #374151;">
            <strong style="color: #2563eb; font-size: 18px;">${item.nb_courriers}</strong> courrier(s) affecté(s)
          </div>
        </div>
        <div style="max-height: 400px; overflow-y: auto; padding-right: 8px;">
          ${courriersHtml || '<div style="text-align: center; padding: 20px; color: #9ca3af;">Aucun courrier trouvé</div>'}
        </div>
      </div>
    `,
    icon: 'info',
    confirmButtonColor: '#7c3aed',
    confirmButtonText: 'Fermer',
    width: '700px'
  })
}

// Modale pour afficher la liste des destinataires
const showDestinatairesModal = async (item) => {
  const destinatairesHtml = item.destinataires_list.map((dest, index) => `
    <div style="display: flex; align-items: flex-start; gap: 12px; padding: 12px; background-color: #f9fafb; border-radius: 8px; margin-bottom: 8px; text-align: left;">
      <div style="width: 40px; height: 40px; border-radius: 50%; background-color: #4f46e5; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 14px; flex-shrink: 0;">
        ${dest.user?.nom?.charAt(0) || '?'}${dest.user?.prenom?.charAt(0) || '?'}
      </div>
      <div style="flex: 1; min-width: 0;">
        <div style="font-weight: 600; color: #111827; font-size: 14px; margin-bottom: 6px;">
          ${dest.user?.nom || ''} ${dest.user?.prenom || ''}
        </div>
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <div style="font-size: 12px; color: #6b7280;">
            <strong>Fonction:</strong> ${dest.entite?.fonction || 'Fonction non définie'}
          </div>
          <div style="font-size: 12px; color: #6b7280;">
            <strong>Entité:</strong> ${dest.entite?.libelle || 'Entité non définie'}
          </div>
          ${dest.pivot?.date_reception ? `
            <div style="display: flex; align-items: center; gap: 4px; font-size: 11px; color: #059669; margin-top: 4px;">
              <svg style="width: 14px; height: 14px;" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <span>Reçu le ${new Date(dest.pivot.date_reception).toLocaleDateString('fr-FR')}</span>
            </div>
          ` : ''}
          ${dest.pivot?.date_traitement ? `
            <div style="display: flex; align-items: center; gap: 4px; font-size: 11px; color: #2563eb;">
              <svg style="width: 14px; height: 14px;" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <span>Traité le ${new Date(dest.pivot.date_traitement).toLocaleDateString('fr-FR')}</span>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `).join('')

  await Swal.fire({
    title: `👥 Destinataires de l'affectation #${item.id}`,
    html: `
      <div style="text-align: left;">
        <div style="margin-bottom: 16px; padding: 12px; background-color: #eef2ff; border-radius: 8px; border: 1px solid #c7d2fe;">
          <div style="font-size: 14px; color: #374151;">
            <strong style="color: #4f46e5; font-size: 18px;">${item.nb_destinataires}</strong> destinataire(s)
          </div>
        </div>
        <div style="max-height: 400px; overflow-y: auto; padding-right: 8px;">
          ${destinatairesHtml || '<div style="text-align: center; padding: 20px; color: #9ca3af;">Aucun destinataire trouvé</div>'}
        </div>
      </div>
    `,
    icon: 'info',
    confirmButtonColor: '#7c3aed',
    confirmButtonText: 'Fermer',
    width: '700px'
  })
}

const handleView = async (item) => {
  const details = `
    <div class="text-left space-y-3">
      <div class="bg-purple-50 rounded-lg p-3 border border-purple-200">
        <p class="text-xs text-gray-600 uppercase font-semibold mb-1">Affectation</p>
        <p class="font-bold text-purple-900 text-lg">#${item.id}</p>
      </div>
      
      <div class="grid grid-cols-2 gap-2">
        <div class="bg-gray-50 rounded p-3 border border-gray-200">
          <p class="text-xs text-gray-600 font-semibold mb-1">📅 Date d'affectation</p>
          <p class="text-sm text-gray-900">${item.date_affect}</p>
        </div>
        <div class="bg-gray-50 rounded p-3 border border-gray-200">
          <p class="text-xs text-gray-600 font-semibold mb-1">⏱️ Date de retour attendue</p>
          <p class="text-sm text-gray-900">${item.delai_traitement}</p>
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-2">
        <div class="bg-gray-50 rounded p-3 border border-gray-200">
          <p class="text-xs text-gray-600 font-semibold mb-1">Statut</p>
          <span class="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-${item.statut_badge.color}-100 text-${item.statut_badge.color}-800">
            ${item.statut_badge.label}
          </span>
        </div>
        <div class="bg-gray-50 rounded p-3 border border-gray-200">
          <p class="text-xs text-gray-600 font-semibold mb-1">Priorité</p>
          <span class="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-${item.priority_badge.color}-100 text-${item.priority_badge.color}-800">
            ${item.priority_badge.label}
          </span>
        </div>
      </div>
      
      <div class="bg-gray-50 rounded p-3 border border-gray-200">
        <p class="text-xs text-gray-600 font-semibold mb-1">👤 Émetteur</p>
        <p class="text-sm text-gray-900">${item.emetteur}</p>
      </div>
      
      <div class="bg-blue-50 rounded p-3 border border-blue-200">
        <p class="text-xs text-gray-600 font-semibold mb-2">📨 Courriers (${item.nb_courriers})</p>
        ${item.nb_courriers > 0 ? `
          <button 
            onclick="window.showCourriersFromDetails_${item.id}()"
            class="text-xs text-blue-600 hover:text-blue-800 hover:underline font-medium"
          >
            → Voir la liste complète
          </button>
        ` : '<span class="text-xs text-gray-500">Aucun courrier</span>'}
      </div>
      
      <div class="bg-indigo-50 rounded p-3 border border-indigo-200">
        <p class="text-xs text-gray-600 font-semibold mb-2">👥 Destinataires (${item.nb_destinataires})</p>
        ${item.nb_destinataires > 0 ? `
          <button 
            onclick="window.showDestinatairesFromDetails_${item.id}()"
            class="text-xs text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
          >
            → Voir la liste complète
          </button>
        ` : '<span class="text-xs text-gray-500">Aucun destinataire</span>'}
      </div>
      
      ${item.date_cloture ? `
        <div class="bg-green-50 rounded p-3 border border-green-200">
          <p class="text-xs text-gray-600 font-semibold mb-1">✅ Date de clôture</p>
          <p class="text-sm text-gray-900">${item.date_cloture}</p>
        </div>
      ` : ''}
      
      <div class="bg-yellow-50 rounded p-3 border border-yellow-200">
        <p class="text-xs text-gray-600 font-semibold mb-2">📝 Instructions</p>
        <p class="text-sm text-gray-700 whitespace-pre-wrap">${item.instructions || 'Aucune instruction'}</p>
      </div>
    </div>
  `

  await Swal.fire({
    title: '📋 Détails de l\'affectation',
    html: details,
    icon: 'info',
    confirmButtonColor: '#7c3aed',
    confirmButtonText: 'Fermer',
    width: '650px',
    didOpen: () => {
      // Attacher les événements pour les boutons dans la modale
      window[`showCourriersFromDetails_${item.id}`] = () => {
        Swal.close()
        showCourriersModal(item)
      }
      window[`showDestinatairesFromDetails_${item.id}`] = () => {
        Swal.close()
        showDestinatairesModal(item)
      }
    },
    willClose: () => {
      // Nettoyer les événements
      delete window[`showCourriersFromDetails_${item.id}`]
      delete window[`showDestinatairesFromDetails_${item.id}`]
    }
  })
}

const handleEdit = (item) => {
  console.log('Modifier:', item)
  navigateTo(`/affectations/edit/${item.id}`)
}

const handleDelete = async (item) => {
  const result = await Swal.fire({
    title: '⚠️ Confirmer la suppression',
    html: `
      <div class="text-left">
        <p class="mb-3 text-gray-700">Êtes-vous sûr de vouloir supprimer cette affectation ?</p>
        <div class="bg-gray-50 rounded-lg p-4 space-y-2 border border-gray-200">
          <p class="font-bold text-purple-900">Affectation #${item.id}</p>
          <p class="text-sm text-gray-700">
            <strong>${item.nb_courriers}</strong> courrier(s) • 
            <strong>${item.nb_destinataires}</strong> destinataire(s)
          </p>
        </div>
        <p class="mt-3 text-sm text-red-600 font-medium">⚠️ Cette action est irréversible.</p>
      </div>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler',
    reverseButtons: true
  })

  if (!result.isConfirmed) return

  try {
    const authToken = localStorage.getItem('auth_token')
    await $fetch(`${config.public.apiBase}/affectations/${item.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })

    await Swal.fire({
      title: '✅ Supprimé !',
      text: 'L\'affectation a été supprimée avec succès',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    })

    await fetchAffectations()
  } catch (err) {
    console.error('Erreur lors de la suppression:', err)
    
    await Swal.fire({
      title: '❌ Erreur',
      text: 'Impossible de supprimer l\'affectation',
      icon: 'error',
      confirmButtonColor: '#7c3aed'
    })
  }
}

const handleSelectionChange = (selected) => {
  console.log('Sélection:', selected)
}

const handleBulkDelete = async (selected) => {
  const result = await Swal.fire({
    title: '⚠️ Suppression multiple',
    html: `
      <div class="text-left">
        <p class="mb-3 text-gray-700">Êtes-vous sûr de vouloir supprimer <strong class="text-red-600">${selected.length} affectation(s)</strong> ?</p>
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
          <p class="text-sm text-yellow-800">⚠️ Cette action supprimera toutes les affectations sélectionnées de manière permanente.</p>
        </div>
        <p class="text-sm text-red-600 font-medium">Cette action est irréversible.</p>
      </div>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: `Supprimer ${selected.length}`,
    cancelButtonText: 'Annuler'
  })

  if (!result.isConfirmed) return

  try {
    const authToken = localStorage.getItem('auth_token')
    await Promise.all(
      selected.map(id =>
        $fetch(`${config.public.apiBase}/affectations/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${authToken}` },
        })
      )
    )

    await Swal.fire({
      title: '✅ Supprimés !',
      text: `${selected.length} affectation(s) supprimée(s)`,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    })

    await fetchAffectations()
  } catch (err) {
    await Swal.fire({
      title: '❌ Erreur',
      text: 'Impossible de supprimer les affectations',
      icon: 'error'
    })
  }
}

const handleBulkExport = (selected) => {
  console.log('Export:', selected)
}

const refreshData = () => {
  fetchAffectations()
}

// Chargement initial
onMounted(() => {
  fetchAffectations()
})
</script>

<style scoped>
:deep(.swal2-html-container) {
  margin: 1rem 0;
}

:deep(.swal-html-left) {
  text-align: left;
}
</style>