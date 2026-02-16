<template>
  <div class="p-6 max-w-[1400px] mx-auto">
    <!-- En-tête modernisé -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="flex items-center gap-3 text-2xl font-bold text-slate-800">
        <Icon name="i-heroicons-link" class="w-7 h-7 text-blue-600" />
        Rattachements de Courriers
      </h1>
      <div class="flex items-center gap-3">
        <button @click="loadData"
          class="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all hover:shadow-md">
          <Icon name="i-heroicons-arrow-path" class="w-4 h-4" />
          Actualiser
        </button>
        <UBadge color="blue" variant="soft" size="lg" class="ml-auto">
          <Icon name="i-heroicons-plus" class="h-4 w-4 mr-1" />
          <UButton to="/rattachements/create" variant="text" size="sm" class="p-0 m-0 text-blue-600">
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
      <div class="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p class="text-sm text-slate-500">Chargement des rattachements...</p>
    </div>

    <!-- DataTable -->
    <DataTable 
      v-else
      ref="dataTableRef" 
      :default-sort-column="null" 
      :show-row-numbers="true" 
      :data="rattachementData" 
      :columns="columns" 
      :selectable="false"
      :default-items-per-page="10" 
      :items-per-page-options="[10, 25, 50, 100]"
      :left-aligned-columns="['objet_arrivee', 'objet_depart', 'ref_depart', 'ref_arrivee']"
      @view="viewDetails" 
      @delete="deleteItem" 
      @open-document="openDocument"
      @selection-change="handleSelectionChange"
    >
      <!-- Filtres avancés -->
      <template #advanced-filters="{ filters, onFilter }">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Date de création</label>
            <input 
              v-model="filters.created_at" 
              type="date"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              @input="onFilter" 
            />
          </div>
        </div>
      </template>

      <!-- Actions de sélection -->
      <template #selection-actions="{ selected }">
        <button 
          @click="deleteSelected(selected)"
          class="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 hover:border-red-300 transition-all"
        >
          <Icon name="i-heroicons-trash" class="w-4 h-4" />
          Supprimer ({{ selected.length }})
        </button>
      </template>

      <!-- Cellule personnalisée: Référence arrivée -->
      <template #cell-ref_arrivee="{ value }">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {{ value }}
        </span>
      </template>

      <!-- Cellule personnalisée: Référence départ -->
      <template #cell-ref_depart="{ value }">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {{ value }}
        </span>
      </template>
      

      <!-- Cellule personnalisée: Lien -->
      <template #cell-link>
        <div class="flex justify-center">
          <Icon name="i-heroicons-arrow-right-circle" class="h-5 w-5 text-purple-600" />
        </div>
      </template>

      <!-- Cellule personnalisée: Objet arrivée (tronqué) -->
      <template #cell-objet_arrivee="{ value }">
        <span class="block max-w-[300px] line-clamp-2 text-xs text-slate-700" :title="value">
          {{ value || 'Sans objet' }}
        </span>
      </template>

      <!-- Cellule personnalisée: Objet départ (tronqué) -->
      <template #cell-objet_depart="{ value }">
        <span class="block max-w-[300px] line-clamp-2 text-xs text-slate-700" :title="value">
          {{ value || 'Sans objet' }}
        </span>
      </template>

      <!-- Actions personnalisées -->
      <template #actions="{ item }">
        <div class="flex gap-1.5 justify-end">
          <button 
            @click="viewDetails(item)" 
            title="Voir les détails"
            class="inline-flex items-center justify-center w-8 h-8 rounded-md border border-transparent hover:bg-blue-50 hover:border-blue-200 transition-all group"
          >
            <Icon name="i-heroicons-eye" class="w-4 h-4 text-slate-500 group-hover:text-blue-600" />
          </button>

          <button 
            @click="deleteItem(item)"
            title="Supprimer"
            class="inline-flex items-center justify-center w-8 h-8 rounded-md border border-transparent hover:bg-red-50 hover:border-red-200 transition-all group"
          >
            <Icon name="i-heroicons-trash" class="w-4 h-4 text-slate-500 group-hover:text-red-600" />
          </button>
        </div>
      </template>

      <!-- État vide personnalisé -->
      <template #empty-state>
        <div class="text-center py-12">
          <Icon name="i-heroicons-link-slash" class="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun rattachement</h3>
          <p class="text-sm text-gray-500 mb-6">
            Commencez par créer un rattachement entre un courrier arrivée et un courrier départ.
          </p>
          <UBadge color="blue" variant="soft" size="lg">
            <Icon name="i-heroicons-plus" class="h-4 w-4 mr-1" />
            <UButton to="/rattachements/create" variant="text" size="sm" class="p-0 m-0 text-blue-600">
              Créer un rattachement
            </UButton>
          </UBadge>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';

useHead({
  title: "Rattachements de Courriers - Sagar Revolution",
});

// ============================================================================
// CONFIGURATION DES COLONNES
// ============================================================================

const columns = [
  {
    key: "ref_arrivee",
    label: "Réf. Arrivée",
    visible: true,
    width: 'min-w-[150px]',
  },
  {
    key: "objet_arrivee",
    label: "Objet Arrivée",
    visible: true,
    width: 'min-w-[250px]',
  },
  {
    key: "doc_arrivee",
    label: "Doc. Arrivée",
    visible: false,
    type: 'document',
    width: 'w-24',
  },
  {
    key: "link",
    label: "→",
    visible: true,
    width: 'w-16',
    sortable: false,
    filterable: false,
  },
  {
    key: "ref_depart",
    label: "Réf. Départ",
    visible: true,
    width: 'min-w-[150px]',
  },
  {
    key: "objet_depart",
    label: "Objet Départ",
    visible: true,
    width: 'min-w-[250px]',
  },
  {
    key: "doc_depart",
    label: "Doc. Départ",
    visible: false,
    type: 'document',
    width: 'w-24',
  },
  {
    key: "created_at",
    label: "Date de création",
    visible: true,
    width: 'min-w-[140px]',
  },
];

// ============================================================================
// ÉTAT DU COMPOSANT
// ============================================================================

const authToken = ref("");
const rattachementData = ref([]);
const loading = ref(false);
const error = ref(null);
const dataTableRef = ref(null);
const toast = useToast();

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const transformerDonneesAPI = (reponseAPI) => {
  if (!reponseAPI?.data) {
    throw new Error('Format de réponse API invalide');
  }

  return reponseAPI.data.map(rattachement => ({
    id: rattachement.id,
    ref_arrivee: rattachement?.document?.reference || '',
    objet_arrivee: rattachement?.document?.objet || '',
    doc_arrivee: rattachement?.document?.url
      ? `http://localhost:8000${rattachement.document.url}`
      : '',
    link: '→',
    ref_depart: rattachement?.reponse?.reference || '',
    objet_depart: rattachement?.reponse?.objet || '',
    doc_depart: rattachement?.reponse?.url
      ? `http://localhost:8000${rattachement.reponse.url}`
      : '',
    created_at: formatDate(rattachement.created_at),
    created_by: rattachement.user?.name || 'Système',
    courrier_arrivee: rattachement.document,
    courrier_depart: rattachement.reponse,
  }));
};

// ============================================================================
// CHARGEMENT DES DONNÉES
// ============================================================================

const loadData = async () => {
  if (!authToken.value) {
    error.value = 'Token d\'authentification manquant';
    toast.add({
      title: "Erreur",
      description: "Session expirée. Veuillez vous reconnecter.",
      color: "red",
      timeout: 1500,
    });
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const reponse = await $fetch('http://localhost:8000/api/reponses', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken.value}`,
      },
    });

    rattachementData.value = transformerDonneesAPI(reponse);
    console.log(`✅ ${rattachementData.value.length} rattachements chargés`);
  } catch (err) {
    console.error('❌ Erreur de chargement:', err);
    error.value = err.message || 'Impossible de charger les rattachements';
    toast.add({
      title: "Erreur",
      description: "Impossible de charger les rattachements",
      color: "red",
      timeout: 1500,
    });
  } finally {
    loading.value = false;
  }
};

// ============================================================================
// ACTIONS
// ============================================================================

const openDocument = (url) => {
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  } else {
    toast.add({
      title: 'Information',
      description: 'Aucun document disponible',
      color: 'amber',
      timeout: 2000,
    });
  }
};

const viewDetails = async (item) => {
  await Swal.fire({
    title: '📋 Détails du rattachement',
    html: `
      <div style="text-align: left; padding: 8px;">
        <!-- Courrier Arrivée -->
        <div style="background-color: #eff6ff; border-radius: 8px; padding: 12px; border: 1px solid #bfdbfe; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <svg style="height: 20px; width: 20px; color: #2563eb;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
            <h3 style="font-weight: 600; color: #1e40af; margin: 0;">Courrier Arrivée</h3>
          </div>
          <p style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Référence</p>
          <p style="font-weight: 600; color: #1e40af; margin-bottom: 8px;">${item.ref_arrivee}</p>
          <p style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Objet</p>
          <p style="font-size: 14px; color: #374151;">${item.objet_arrivee}</p>
        </div>

        <!-- Flèche -->
        <div style="display: flex; justify-content: center; margin: 12px 0;">
          <svg style="height: 24px; width: 24px; color: #9333ea;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
        </div>

        <!-- Courrier Départ -->
        <div style="background-color: #f0fdf4; border-radius: 8px; padding: 12px; border: 1px solid #bbf7d0; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <svg style="height: 20px; width: 20px; color: #16a34a;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
            <h3 style="font-weight: 600; color: #166534; margin: 0;">Courrier Départ</h3>
          </div>
          <p style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Référence</p>
          <p style="font-weight: 600; color: #166534; margin-bottom: 8px;">${item.ref_depart}</p>
          <p style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Objet</p>
          <p style="font-size: 14px; color: #374151;">${item.objet_depart}</p>
        </div>

        <!-- Métadonnées -->
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 12px; border: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Date de création</p>
          <p style="font-size: 14px; color: #111827;">${item.created_at}</p>
        </div>
      </div>
    `,
    width: '600px',
    confirmButtonText: 'Fermer',
    confirmButtonColor: '#7c3aed',
  });
};

const deleteItem = async (item) => {
  const result = await Swal.fire({
    title: '⚠️ Confirmer la suppression',
    html: `
      <div style="text-align: left; padding: 8px;">
        <p style="margin-bottom: 12px; color: #374151;">Êtes-vous sûr de vouloir supprimer ce rattachement ?</p>
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; border: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: center; gap: 8px;">
          <span style="display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 500; background-color: #dbeafe; color: #1e40af;">
            ${item.ref_arrivee}
          </span>
          <svg style="height: 16px; width: 16px; color: #9333ea;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
          <span style="display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 500; background-color: #dcfce7; color: #166534;">
            ${item.ref_depart}
          </span>
        </div>
        <p style="margin-top: 12px; font-size: 14px; color: #dc2626; font-weight: 600;">⚠️ Cette action est irréversible.</p>
      </div>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler',
    reverseButtons: true,
  });

  if (!result.isConfirmed) return;

  try {
    await $fetch(`http://localhost:8000/api/reponses/${item.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authToken.value}`,
      },
    });

    await Swal.fire({
      title: '✅ Supprimé !',
      text: 'Le rattachement a été supprimé avec succès',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });

    await loadData();
  } catch (err) {
    console.error("❌ Erreur lors de la suppression:", err);

    await Swal.fire({
      title: '❌ Erreur',
      text: 'Impossible de supprimer le rattachement',
      icon: 'error',
      confirmButtonColor: '#7c3aed',
    });
  }
};

const deleteSelected = async (selectedIds) => {
  const result = await Swal.fire({
    title: '⚠️ Suppression multiple',
    html: `
      <div style="text-align: left; padding: 8px;">
        <p style="margin-bottom: 12px; color: #374151;">Êtes-vous sûr de vouloir supprimer <strong style="color: #dc2626;">${selectedIds.length} rattachement(s)</strong> ?</p>
        <div style="background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 12px; margin-bottom: 12px;">
          <p style="font-size: 14px; color: #92400e;">⚠️ Cette action supprimera tous les rattachements sélectionnés de manière permanente.</p>
        </div>
        <p style="font-size: 14px; color: #dc2626; font-weight: 600;">Cette action est irréversible.</p>
      </div>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: `Supprimer ${selectedIds.length}`,
    cancelButtonText: 'Annuler',
    reverseButtons: true,
  });

  if (!result.isConfirmed) return;

  try {
    await Promise.all(
      selectedIds.map(id =>
        $fetch(`http://localhost:8000/api/reponses/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${authToken.value}`,
          },
        })
      )
    );

    await Swal.fire({
      title: '✅ Supprimés !',
      text: `${selectedIds.length} rattachement(s) supprimé(s)`,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });

    await loadData();
  } catch (err) {
    console.error("❌ Erreur lors de la suppression multiple:", err);

    await Swal.fire({
      title: '❌ Erreur',
      text: 'Impossible de supprimer les rattachements',
      icon: 'error',
      confirmButtonColor: '#7c3aed',
    });
  }
};

const handleSelectionChange = (selected) => {
  console.log(`${selected.length} ligne(s) sélectionnée(s)`, selected);
};

// ============================================================================
// LIFECYCLE
// ============================================================================

onMounted(async () => {
  if (process.client) {
    authToken.value = localStorage.getItem("auth_token") || "";
  }
  await loadData();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

:deep(.swal2-html-container) {
  margin: 1rem 0;
}

:deep(.swal2-actions) {
  gap: 0.75rem;
}

:deep(.swal2-confirm),
:deep(.swal2-cancel) {
  padding: 0.625rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s;
}

:deep(.swal2-confirm):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

:deep(.swal2-cancel):hover {
  background-color: #4b5563 !important;
}
</style>