<template>
  <div class="p-6 max-w-[1400px] mx-auto">
    <!-- En-tête -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="flex items-center gap-3 text-2xl font-bold text-slate-800">
        <Icon name="i-heroicons-inbox" class="w-7 h-7 text-blue-600" />
        Documents reçus
      </h1>
      <div class="flex items-center gap-3">
        <button @click="loadData"
          class="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all hover:shadow-md">
          <Icon name="i-heroicons-arrow-path" class="w-4 h-4" />
          Actualiser
        </button>
        <UBadge color="blue" variant="soft" size="lg" class="ml-auto">
          <Icon name="i-heroicons-document-text" class="h-4 w-4 mr-1" />
          <span class="text-sm">{{ affectationData.length }} document{{ affectationData.length > 1 ? 's' : '' }}</span>
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
      <p class="text-sm text-slate-500">Chargement des documents...</p>
    </div>

    <!-- DataTable Component -->
    <DataTable 
      v-else 
      ref="dataTableRef" 
      :default-sort-column="null" 
      :show-row-numbers="true" 
      :data="affectationData"
      :columns="columns" 
      :selectable="false" 
      :items-per-page-options="[10, 25, 50, 100]" 
      :default-items-per-page="10"
      :left-aligned-columns="['objet_courrier', 'instructions', 'reference_courrier', 'emetteur', 'destinataire']"
      @edit="handleEdit" 
      @delete="handleDelete" 
      @open-document="handleOpenDocument"
      @selection-change="handleSelectionChange"
    >
      <!-- Filtres avancés -->
      <template #advanced-filters="{ filters, onFilter }">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Date d'affectation</label>
            <input 
              v-model="filters.date_affect" 
              type="date"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              @input="onFilter" 
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Date de retour attendue</label>
            <input 
              v-model="filters.delai_traitement" 
              type="date"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              @input="onFilter" 
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Date de clôture</label>
            <input 
              v-model="filters.date_cloture" 
              type="date"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              @input="onFilter" 
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Émetteur</label>
            <input 
              v-model="filters.emetteur" 
              placeholder="Filtrer par émetteur..."
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              @input="onFilter" 
            />
          </div>
        </div>
      </template>

      <!-- Actions de sélection supprimées (dupliquées plus bas) -->

      <!-- Cellule personnalisée: Référence courrier -->
      <template #cell-reference_courrier="{ value }">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {{ value }}
        </span>
      </template>

      <!-- Cellule personnalisée: Statut -->
      <template #cell-statut="{ value }">
        <span 
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide"
          :class="getStatutClasses(value)"
        >
          <span class="w-2 h-2 rounded-full mr-1.5" :class="getStatutDotClass(value)"></span>
          {{ value }}
        </span>
      </template>

      <!-- Cellule personnalisée: Priorité -->
      <template #cell-priority="{ value }">
        <span 
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide"
          :class="getPriorityClasses(value)"
        >
          <span class="w-2 h-2 rounded-full mr-1.5" :class="getPriorityDotClass(value)"></span>
          {{ value }}
        </span>
      </template>

      <!-- Cellule personnalisée: Instructions (tronquée) -->
      <template #cell-instructions="{ value }">
        <span class="block max-w-[300px] line-clamp-2 text-xs text-slate-700" :title="value">
          {{ value || 'Aucune instruction' }}
        </span>
      </template>

      <!-- Actions personnalisées -->
      <template #actions="{ item }">
        <div class="flex gap-1.5 justify-end">
          <button 
            @click="handleViewDetails(item)" 
            title="Voir les détails"
             class="inline-flex items-center justify-center w-8 h-8 bg-amber-50 text-amber-700 border-amber-100 rounded-md hover:bg-amber-200 :hover:text-amber-900 hover:border-amber-900 transition-all group">
            <Icon name="i-heroicons-eye" class="w-4 h-4 group-hover:text-yellow-600" />
          </button>

          <!-- ✅ CONDITION : Afficher uniquement si responsable -->
          <button 
            v-if="isResponsable"
            @click="handleQuickAssign(item.courrier_id)" 
            :disabled="!item.courrier_id"
            title="Affecter ce courrier"
            class="inline-flex items-center justify-center w-8 h-8 bg-sky-50 text-sky-700 border-sky-100 rounded-md hover:bg-sky-200 :hover:text-sky-900 hover:border-sky-900 transition-all group">
            <Icon name="i-heroicons-paper-airplane" class="w-4 h-4 group-hover:text-blue-600" />
          </button>

          <!-- ✅ CONDITION : Afficher uniquement si responsable -->
          <button 
            v-if="isResponsable"
            @click="handleQuickTransfer(item.courrier_id)" 
            :disabled="!item.courrier_id"
            title="Transférer ce courrier"
            class="inline-flex items-center justify-center w-8 h-8 bg-emerald-50 text-emerald-700 border-emerald-100 rounded-md hover:bg-emerald-200 :hover:text-emerald-900 hover:border-emerald-900 transition-all group">
            <Icon name="i-heroicons-arrow-path-rounded-square" class="w-4 h-4 group-hover:text-green-600" />
          </button>
        </div>
      </template>

      <template #cell-reference="{ value, item }">
        <button
          v-if="item.url"
          @click="onOpenDocument(item.url)"
          class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 rounded-md transition-all group"
          :title="`Ouvrir le document ${value}`"
        >
          <Icon name="i-heroicons-document-text" class="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span>{{ value }}</span>
          <Icon name="i-heroicons-arrow-top-right-on-square" class="w-3 h-3 opacity-60 group-hover:opacity-100" />
        </button>
        <span 
          v-else
          class="inline-flex items-center px-2.5 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md"
          :title="value"
        >
          <Icon name="i-heroicons-document-text" class="w-3.5 h-3.5 mr-1.5 opacity-50" />
          {{ value }}
        </span>
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
          class="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-all"
        >
          <Icon name="i-heroicons-arrow-down-tray" class="w-4 h-4" />
          Exporter ({{ selected.length }})
        </button>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { useAffectationsStore } from '~/stores/affectations.js'
import { useTransfertsStore } from '~/stores/transferts.js'
import { useAuth } from '~/composables/auth/useAuth'

const affectationsStore = useAffectationsStore()
const transfertsStore = useTransfertsStore()
const { isSecDir, getDirecteurEntiteUserId } = useAuth()

useHead({ title: "Documents reçus - Sagar Revolution" });

// ============================================================================
// CONFIGURATION DES COLONNES
// ============================================================================

const columns = [
  { key: "reference_courrier", label: "Réf. Courrier", visible: true, width: 'min-w-[200px]' },
  { key: "objet_courrier", label: "Objet", visible: true, width: 'min-w-[250px]' },
  { key: "doc_courrier", label: "Document", visible: false, type: 'document', width: 'w-24' },
  { key: "date_affect", label: "Date d'affectation", visible: true, width: 'min-w-[120px]' },
  { key: "instructions", label: "Annotations", visible: true, width: 'min-w-[200px]' },
  { key: "type", label: "Type", visible: true, width: 'min-w-[120px]' },
  { key: "statut", label: "Statut", visible: true, type: 'badge', width: 'min-w-[120px]' },
  { key: "priority", label: "Priorité", visible: true, type: 'badge', width: 'min-w-[120px]' },
  { key: "delai_traitement", label: "Date de retour attendue", visible: true, width: 'min-w-[120px]' },
  { key: "date_cloture", label: "Date clôture", visible: false, width: 'min-w-[120px]' },
  { key: "emetteur", label: "Source", visible: true, width: 'min-w-[180px]' },
  { key: "destinataire", label: "Destinataire", visible: false, width: 'min-w-[180px]' },
];

// ============================================================================
// ÉTAT DU COMPOSANT
// ============================================================================

const authToken = ref("");
const affectationData = ref([]);
const loading = ref(false);
const error = ref(null);
const toast = useToast();
const dataTableRef = ref(null);
const selectedRows = ref([]);
const isResponsable = ref(false); // ✅ NOUVEAU : Statut responsable de l'utilisateur
const config = useRuntimeConfig();

// ============================================================================
// UTILITAIRES
// ============================================================================

const formatDate = (date) => {
  if (!date) return ''

  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

const transformerDonneesAPI = (reponseAPI) => {
  if (!reponseAPI?.data) {
    throw new Error('Format de réponse API invalide');
  }

  return reponseAPI.data.map(affectation => {
    let emetteurFormate = '';
    if (affectation?.emetteur?.user?.nom && affectation?.emetteur?.entite?.code) {
      const nomComplet = `${affectation.emetteur.user.nom} ${affectation.emetteur.user.prenom || ''}`.trim();
      const codeEntite = affectation.emetteur.entite.code;
      const roleOuFonction = affectation.emetteur.is_responsable
        ? affectation.emetteur.entite.fonction
        : 'Agent';
      emetteurFormate = `${nomComplet} (${codeEntite} - ${roleOuFonction})`;
    }

    let destinataireFormate = '';
    if (affectation?.destinataire?.user?.nom && affectation?.destinataire?.entite?.code) {
      const nomComplet = `${affectation.destinataire.user.nom} ${affectation.destinataire.user.prenom || ''}`.trim();
      const codeEntite = affectation.destinataire.entite.code;
      const roleOuFonction = affectation.destinataire.is_responsable
        ? affectation.destinataire.entite.fonction
        : 'Agent';
      destinataireFormate = `${nomComplet} (${codeEntite} - ${roleOuFonction})`;
    }

    return {
      id: affectation.id,
      courrier_id: affectation.courrier_arrive_id || null,
      reference_courrier: affectation?.courrier_arrive?.document?.reference || '',
      objet_courrier: affectation?.courrier_arrive?.document?.objet || '',
      doc_courrier: affectation?.courrier_arrive?.document?.url
        ? `${config.public.apiBase}${affectation.courrier_arrive.document.url}`
        : '',
      date_affect: formatDate(affectation.date_affect),
      instructions: affectation.instructions || '',
      type: affectation.type_affectation || '',
      statut: affectation.statut || '',
      priority: affectation.priority || '',
      delai_traitement: formatDate(affectation.delai_traitement),
      date_cloture: formatDate(affectation.date_cloture),
      emetteur: emetteurFormate,
      destinataire: destinataireFormate,
      _complete: affectation,
    };
  });
};

// ============================================================================
// CHARGEMENT DES DONNÉES
// ============================================================================

const loadData = async () => {
  if (!authToken.value) {
    error.value = 'Token d\'authentification manquant';
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    let entite_user = null
    if (process.client) {
      const savedFunction = localStorage.getItem('entite_user')
      if (savedFunction) {
        entite_user = JSON.parse(savedFunction)
        isResponsable.value = entite_user.is_responsable || false
      }
    }

    if (!entite_user || !entite_user.id) {
      error.value = 'Aucune fonction user sélectionnée'
      return
    }

    // SA → affectations reçues par le DT, sinon les siennes
    const destinataireId = isSecDir()
      ? (getDirecteurEntiteUserId() ?? entite_user.id)
      : entite_user.id

    console.log(`📝 Chargement affectations pour destinataire_id: ${destinataireId}`)

    const reponse = await $fetch(`${config.public.apiBase}/affectations/destinataire/${destinataireId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${authToken.value}` },
      timeout: 15000,
    });

    affectationData.value = transformerDonneesAPI(reponse);
    console.log(`✅ ${affectationData.value.length} affectations chargées`);

  } catch (err) {
    error.value = err.message || 'Erreur lors du chargement des données';
    toast.add({ title: "Erreur", description: "Impossible de charger les affectations", color: "red", timeout: 1500 });
  } finally {
    loading.value = false;
  }
};

// ============================================================================
// CLASSES DE STYLE
// ============================================================================

const getStatutClasses = (statut) => {
  const classes = {
    'en_attente': 'bg-gray-100 text-gray-800',
    'en cours': 'bg-blue-100 text-blue-800',
    'traite': 'bg-green-100 text-green-800',
    'cloture': 'bg-blue-100 text-blue-800',
    'annule': 'bg-red-100 text-red-800',
  };
  return classes[statut] || 'bg-gray-100 text-gray-800';
};

const getStatutDotClass = (statut) => {
  const classes = {
    'en_attente': 'bg-gray-500',
    'en cours': 'bg-blue-500',
    'traite': 'bg-green-500',
    'cloture': 'bg-blue-500',
    'annule': 'bg-red-500',
  };
  return classes[statut] || 'bg-gray-500';
};

const getPriorityClasses = (priority) => {
  const classes = {
    'urgent': 'bg-red-100 text-red-800',
    'important': 'bg-orange-100 text-orange-800',
    'standard': 'bg-blue-100 text-blue-800',
  };
  return classes[priority] || 'bg-gray-100 text-gray-800';
};

const getPriorityDotClass = (priority) => {
  const classes = {
    'urgent': 'bg-red-500',
    'important': 'bg-orange-500',
    'standard': 'bg-blue-500',
  };
  return classes[priority] || 'bg-gray-500';
};

// ============================================================================
// GESTIONNAIRES D'ÉVÉNEMENTS
// ============================================================================

const handleOpenDocument = (url) => {
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  } else {
    toast.add({
      title: 'Information',
      description: 'Aucun document disponible',
      color: 'amber',
      timeout: 2000,
    })
  }
};

const handleSelectionChange = (selected) => {
  selectedRows.value = selected;
  console.log('Sélection changée:', selected);
};

const handleViewDetails = async (item) => {
  const details = `
    <div style="text-align: left; padding: 8px;">
      <div style="background-color: #faf5ff; border-radius: 8px; padding: 12px; border: 1px solid #e9d5ff; margin-bottom: 12px;">
        <p style="font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">Affectation</p>
        <p style="font-weight: 700; color: #7c3aed; font-size: 18px;">#${item.id}</p>
      </div>
      
      <div style="background-color: #eff6ff; border-radius: 8px; padding: 12px; border: 1px solid #bfdbfe; margin-bottom: 12px;">
        <p style="font-size: 12px; color: #6b7280; font-weight: 600; margin-bottom: 4px;">📨 Courrier</p>
        <p style="font-weight: 600; color: #1e40af; margin-bottom: 4px;">${item.reference_courrier}</p>
        <p style="font-size: 14px; color: #374151;">${item.objet_courrier}</p>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 12px; border: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #6b7280; font-weight: 600; margin-bottom: 4px;">📅 Date d'affectation</p>
          <p style="font-size: 14px; color: #111827;">${item.date_affect}</p>
        </div>
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 12px; border: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #6b7280; font-weight: 600; margin-bottom: 4px;">⏱️ Date de retour attendue</p>
          <p style="font-size: 14px; color: #111827;">${item.delai_traitement || 'Non défini'}</p>
        </div>
      </div>
      
      ${item.emetteur ? `
        <div style="background-color: #eef2ff; border-radius: 8px; padding: 12px; border: 1px solid #c7d2fe; margin-bottom: 12px;">
          <p style="font-size: 12px; color: #6b7280; font-weight: 600; margin-bottom: 4px;">👤 Émetteur</p>
          <p style="font-size: 14px; color: #374151;">${item.emetteur}</p>
        </div>
      ` : ''}
      
      <div style="background-color: #fef3c7; border-radius: 8px; padding: 12px; border: 1px solid #fde68a;">
        <p style="font-size: 12px; color: #6b7280; font-weight: 600; margin-bottom: 8px;">📝 Instructions</p>
        <p style="font-size: 14px; color: #374151; white-space: pre-wrap;">${item.instructions || 'Aucune instruction'}</p>
      </div>
    </div>
  `

  await Swal.fire({
    title: '📋 Détails du document',
    html: details,
    icon: 'info',
    confirmButtonColor: '#7c3aed',
    confirmButtonText: 'Fermer',
    width: '650px',
  })
};

const handleEdit = (item) => {
  console.log("Modifier l'affectation:", item);
};

const handleDelete = async (item) => {
  const result = await Swal.fire({
    title: '⚠️ Confirmer la suppression',
    html: `
      <div style="text-align: left; padding: 8px;">
        <p style="margin-bottom: 12px; color: #374151;">Êtes-vous sûr de vouloir supprimer ce document ?</p>
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; border: 1px solid #e5e7eb;">
          <p style="font-weight: 600; color: #1e40af; margin-bottom: 4px;">${item.reference_courrier}</p>
          <p style="font-size: 14px; color: #374151;">${item.objet_courrier}</p>
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
    await $fetch(`${config.public.apiBase}/affectations/${item.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authToken.value}`,
      },
    });

    await Swal.fire({
      title: '✅ Supprimé !',
      text: 'Le document a été supprimé avec succès',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });

    await loadData();
  } catch (err) {
    console.error("Erreur lors de la suppression:", err);

    await Swal.fire({
      title: '❌ Erreur',
      text: 'Impossible de supprimer le document',
      icon: 'error',
      confirmButtonColor: '#7c3aed',
    });
  }
};

const handleQuickAssign = (courrierId) => {
  if (!courrierId) {
    toast.add({
      title: 'Erreur',
      description: 'ID du courrier introuvable',
      color: 'red',
      timeout: 1500,
    })
    return
  }

  console.log('✅ Affectation rapide pour le courrier ID:', courrierId)
  
  if (process.client) {
    sessionStorage.setItem('preselected_courrier_id', courrierId.toString())
  }
  
  navigateTo('/affectations/create')
}

const handleQuickTransfer = (courrierId) => {
  if (!courrierId) {
    toast.add({
      title: 'Erreur',
      description: 'ID du courrier introuvable',
      color: 'red',
      timeout: 1500,
    })
    return
  }

  console.log('✅ Transfert rapide pour le courrier ID:', courrierId)
  
  if (process.client) {
    sessionStorage.setItem('preselected_courrier_id_transfer', courrierId.toString())
  }
  
  navigateTo('/affectations-transferts/form-transfert')
}

const handleDeleteSelected = async (selected) => {
  const result = await Swal.fire({
    title: '⚠️ Suppression multiple',
    html: `
      <div style="text-align: left; padding: 8px;">
        <p style="margin-bottom: 12px; color: #374151;">Êtes-vous sûr de vouloir supprimer <strong style="color: #dc2626;">${selected.length} document(s)</strong> ?</p>
        <div style="background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 12px; margin-bottom: 12px;">
          <p style="font-size: 14px; color: #92400e;">⚠️ Cette action supprimera tous les documents sélectionnés de manière permanente.</p>
        </div>
        <p style="font-size: 14px; color: #dc2626; font-weight: 600;">Cette action est irréversible.</p>
      </div>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: `Supprimer ${selected.length}`,
    cancelButtonText: 'Annuler',
    reverseButtons: true,
  });

  if (!result.isConfirmed) return;

  try {
    await Promise.all(
      selected.map(id =>
        $fetch(`${config.public.apiBase}/affectations/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${authToken.value}`,
          },
        })
      )
    );

    await Swal.fire({
      title: '✅ Supprimés !',
      text: `${selected.length} document(s) supprimé(s)`,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });

    if (dataTableRef.value) {
      dataTableRef.value.selectedRows = [];
    }

    await loadData();
  } catch (err) {
    console.error("Erreur lors de la suppression multiple:", err);

    await Swal.fire({
      title: '❌ Erreur',
      text: 'Impossible de supprimer les documents',
      icon: 'error',
      confirmButtonColor: '#7c3aed',
    });
  }
};

const handleBulkExport = (selected) => {
  console.log('Export:', selected)
  toast.add({
    title: 'Information',
    description: 'Fonctionnalité d\'export en cours de développement',
    color: 'amber',
    timeout: 2000,
  })
}

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