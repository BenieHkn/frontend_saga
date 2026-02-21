<template>
  <div class="p-6 max-w-[1400px] mx-auto">
    <!-- En-tête -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="flex items-center gap-3 text-2xl font-bold text-slate-800">
        <Icon name="i-heroicons-document-arrow-down" class="w-7 h-7 text-blue-600" />
        Affectations
      </h1>
      <div class="flex items-center gap-3">
        <button @click="refreshData"
          class="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all hover:shadow-md">
          <Icon name="i-heroicons-arrow-path" class="w-4 h-4" />
          Actualiser
        </button>
        <UBadge color="blue" variant="soft" size="lg" class="ml-auto">
          <Icon name="i-heroicons-plus" class="h-4 w-4 mr-1" />
          <UButton to="/affectations/create" variant="text" size="sm" class="p-0 m-0 text-blue-600">
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
      <p class="text-sm text-slate-500">Chargement des affectations...</p>
    </div>

    <!-- DataTable -->
    <DataTable v-else ref="dataTableRef" :default-sort-column="null" :show-row-numbers="true" :data="tableData"
      :columns="columns" :selectable="false" :default-items-per-page="10" :items-per-page-options="[10, 25, 50, 100]"
      :left-aligned-columns="['instructions', 'objet_courrier', 'reference_courrier']" @edit="handleEdit"
      @delete="handleDelete" @open-document="handleOpenDocument" @selection-change="handleSelectionChange">

      <!-- Slot pour la cellule référence courrier -->
      <template #cell-reference_courrier="{ value }">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {{ value }}
        </span>
      </template>

      <!-- Slot pour la cellule statut -->
      <template #cell-statut="{ value }">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide"
          :class="getStatutClasses(value)">
          <span class="w-2 h-2 rounded-full mr-1.5" :class="getStatutDotClass(value)"></span>
          {{ getStatutLabel(value) }}
        </span>
      </template>

      <!-- Slot pour la cellule priorité -->
      <template #cell-priority="{ value }">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide"
          :class="getPriorityClasses(value)">
          <span class="w-2 h-2 rounded-full mr-1.5" :class="getPriorityDotClass(value)"></span>
          {{ getPriorityLabel(value) }}
        </span>
      </template>

      <!-- Slot pour la cellule destinataire -->
      <template #cell-destinataire="{ value }">
        <div class="text-left">
          <div class="font-medium text-xs text-slate-800">{{ value.nom }}</div>
          <div class="text-xs text-slate-500">{{ value.fonction }}</div>
        </div>
      </template>

      <!-- Slot pour la cellule instructions (tronquée) -->
      <template #cell-instructions="{ value }">
        <span class="block max-w-[300px] line-clamp-2 text-xs text-slate-700" :title="value">
          {{ value || 'Aucune instruction' }}
        </span>
      </template>

      <!-- Slot pour les actions personnalisées -->
      <template #actions="{ item }">
        <div class="flex gap-1.5 justify-end">
          <button @click="handleView(item)" title="Voir les détails"
            class="inline-flex items-center justify-center w-8 h-8 bg-amber-50 text-amber-700 border-amber-100 rounded-md hover:bg-amber-200 :hover:text-amber-900 hover:border-amber-900 transition-all group">
            <Icon name="i-heroicons-eye" class="w-4 h-4 group-hover:text-yellow-600" />
          </button>

          <button @click="handleQuickAssign(item.courrier_id)" title="Affecter ce courrier"
            class="inline-flex items-center justify-center w-8 h-8 bg-sky-50 text-sky-700 border-sky-100 rounded-md hover:bg-sky-200 :hover:text-sky-900 hover:border-sky-900 transition-all group">
            <Icon name="i-heroicons-paper-airplane" class="w-4 h-4 group-hover:text-blue-600" />
          </button>

          <button @click="handleEdit(item)"
            class="inline-flex items-center justify-center w-8 h-8 bg-emerald-50 text-emerald-700 border-emerald-100 rounded-md hover:bg-emerald-200 :hover:text-emerald-900 hover:border-emerald-900 transition-all group"
            title="Modifier le destinataire">
            <Icon name="i-heroicons-pencil" class="w-4 h-4 group-hover:text-green-600" />
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
        <button @click="handleBulkDelete(selected)"
          class="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 hover:border-red-300 transition-all">
          <Icon name="i-heroicons-trash" class="w-4 h-4" />
          Supprimer ({{ selected.length }})
        </button>
        <button @click="handleBulkExport(selected)"
          class="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-all">
          <Icon name="i-heroicons-arrow-down-tray" class="w-4 h-4" />
          Exporter ({{ selected.length }})
        </button>
      </template>

      <!-- Filtres avancés -->
      <template #advanced-filters="{ filters, onFilter }">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Date d'affectation</label>
            <input v-model="filters.date_affect" type="date"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              @input="onFilter" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Date de retour attendue</label>
            <input v-model="filters.delai_traitement" type="date"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              @input="onFilter" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Date de clôture</label>
            <input v-model="filters.date_cloture" type="date"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              @input="onFilter" />
          </div>
        </div>
      </template>
    </DataTable>

    <!-- ========== MODAL DE MODIFICATION DU DESTINATAIRE ========== -->
    <UModal v-model="showEditModal" :ui="{ width: 'sm:max-w-2xl' }">
      <div class="p-6">
        <!-- En-tête -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Icon name="i-heroicons-users" class="h-6 w-6 text-blue-600" />
            Modifier le destinataire
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" @click="showEditModal = false" square />
        </div>

        <!-- Informations de l'affectation -->
        <div v-if="selectedAffectation" class="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
          <p class="text-sm text-gray-700 mb-2">
            <strong>Courrier :</strong> {{ selectedAffectation.reference_courrier }}
          </p>
          <p class="text-xs text-gray-600">{{ selectedAffectation.objet_courrier }}</p>
          <div class="mt-3 pt-3 border-t border-blue-200">
            <p class="text-sm text-gray-700">
              <strong>Destinataire actuel :</strong>
              <span class="text-blue-700 font-semibold">{{ selectedAffectation.destinataire.nom }}</span>
              <span class="text-xs text-gray-500 ml-2">({{ selectedAffectation.destinataire.fonction }})</span>
            </p>
          </div>
        </div>

        <!-- Recherche -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Rechercher un destinataire
          </label>
          <input v-model="searchDestinataire" type="text" placeholder="Rechercher par nom, prénom ou fonction..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <!-- Liste des destinataires -->
        <div v-if="loadingDestinataires" class="flex justify-center py-8">
          <div class="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>

        <div v-else class="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
          <div v-for="dest in filteredDestinataires" :key="dest.id"
            @click="selectNewDestinataire(dest)" :class="[
              'p-4 cursor-pointer transition-all border-b border-gray-200 last:border-b-0',
              selectedNewDestinataire?.id === dest.id
                ? 'bg-blue-100 border-l-4 border-l-blue-600'
                : 'hover:bg-gray-50'
            ]">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <!-- Nom complet -->
                <p class="font-semibold text-gray-900">
                  {{ dest.user?.nom }} {{ dest.user?.prenom }}
                </p>
                
                <!-- ✅ CORRECTION : Code de l'entité + Fonction ou Agent -->
                <p class="text-sm text-gray-600 mt-1">
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 mr-2">
                    {{ dest.entite?.code }}
                  </span>
                  <span v-if="dest.is_responsable" class="text-gray-700">
                    {{ dest.entite?.fonction }}
                  </span>
                  <span v-else class="text-gray-500">
                    Agent
                  </span>
                </p>
                
                <!-- Libellé de l'entité -->
                <p class="text-xs text-gray-500 mt-1">
                  {{ dest.entite?.libelle }}
                </p>

                <!-- Badges optionnels -->
                <div class="flex gap-1 mt-2">
                  <!-- <span 
                    v-if="dest.is_responsable" 
                    class="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full"
                  >
                    Responsable
                  </span>
                  <span 
                    v-if="dest.is_interim" 
                    class="text-[10px] bg-amber-600 text-white px-2 py-0.5 rounded-full"
                  >
                    Intérim
                  </span> -->
                </div>
              </div>

              <!-- Icône de sélection -->
              <div v-if="selectedNewDestinataire?.id === dest.id">
                <Icon name="i-heroicons-check-circle-solid" class="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <!-- État vide -->
          <div v-if="filteredDestinataires.length === 0" class="p-8 text-center text-gray-500">
            <Icon name="i-heroicons-user-group" class="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p class="text-sm">Aucun destinataire trouvé</p>
          </div>
        </div>

        <!-- Boutons d'action -->
        <div class="flex justify-end gap-3 mt-6">
          <UButton @click="showEditModal = false" color="gray" variant="outline" size="lg">
            Annuler
          </UButton>

          <UButton @click="confirmChangeDestinataire"
            :disabled="!selectedNewDestinataire || selectedNewDestinataire.id === selectedAffectation?._raw.destinataire_id"
            :loading="submitting" size="lg" icon="i-heroicons-check"
            class="bg-gradient-to-br from-emerald-800 to-blue-800 text-white dark:text-white">
            {{ submitting ? 'Modification en cours...' : 'Confirmer le changement' }}
          </UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DataTable from '~/components/DataTable.vue'
import { useAffectationsStore } from '~/stores/affectations'
import Swal from 'sweetalert2'

const store = useAffectationsStore()

useHead({
  title: "Affectations - Sagar Revolution",
});

// ============================================================================
// ÉTAT
// ============================================================================
const tableData = ref([])
const loading = ref(false)
const error = ref(null)
const toast = useToast()
const dataTableRef = ref(null)
const config = useRuntimeConfig()

// Modal de modification
const showEditModal = ref(false)
const selectedAffectation = ref(null)
const selectedNewDestinataire = ref(null)
const searchDestinataire = ref('')
const destinataires = ref([])
const loadingDestinataires = ref(false)
const submitting = ref(false)

// ============================================================================
// COLONNES
// ============================================================================
const columns = ref([
  { key: 'reference_courrier', label: 'Réf. Courrier', visible: true, width: 'min-w-[200px]' },
  { key: 'dossier', label: 'Dossier', visible: true, width: 'min-w-[200px]' },
  { key: 'objet_courrier', label: 'Objet', visible: true, width: 'min-w-[250px]' },
  { key: 'doc_courrier', label: 'Document', visible: false, type: 'document', width: 'w-24' },
  { key: 'date_affect', label: 'Date d\'affectation', visible: true, width: 'min-w-[120px]' },
  { key: 'instructions', label: 'Instructions', visible: true, width: 'min-w-[200px]' },
  { key: 'statut', label: 'Statut', visible: true, type: 'badge', width: 'min-w-[120px]' },
  { key: 'priority', label: 'Priorité', visible: true, type: 'badge', width: 'min-w-[120px]' },
  { key: 'delai_traitement', label: 'Date de retour attendue', visible: true, width: 'min-w-[120px]' },
  { key: 'date_cloture', label: 'Date clôture', visible: false, width: 'min-w-[120px]' },
  { key: 'destinataire', label: 'Destinataire', visible: true, width: 'min-w-[180px]' },
])

// ============================================================================
// COMPUTED
// ============================================================================
const filteredDestinataires = computed(() => {
  if (!searchDestinataire.value) return destinataires.value

  const query = searchDestinataire.value.toLowerCase()
  return destinataires.value.filter(dest =>
    dest.user?.nom?.toLowerCase().includes(query) ||
    dest.user?.prenom?.toLowerCase().includes(query) ||
    dest.entite?.code?.toLowerCase().includes(query) ||
    dest.entite?.libelle?.toLowerCase().includes(query)
  )
})

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

const getStatutLabel = (statut) => {
  const labels = {
    'en cours': 'En cours',
    'en_attente': 'En attente',
    'traite': 'Traité',
    'cloture': 'Clôturé',
    'annule': 'Annulé',
  }
  return labels[statut] || statut
}

const getStatutClasses = (statut) => {
  const classes = {
    'en_attente': 'bg-gray-100 text-gray-800',
    'en cours': 'bg-blue-100 text-blue-800',
    'traite': 'bg-green-100 text-green-800',
    'cloture': 'bg-blue-100 text-blue-800',
    'annule': 'bg-red-100 text-red-800',
  }
  return classes[statut] || 'bg-gray-100 text-gray-800'
}

const getStatutDotClass = (statut) => {
  const classes = {
    'en attente': 'bg-gray-500',
    'en cours': 'bg-blue-500',
    'traite': 'bg-green-500',
    'cloture': 'bg-blue-500',
    'annule': 'bg-red-500',
  }
  return classes[statut] || 'bg-gray-500'
}

const getPriorityLabel = (priority) => {
  const labels = {
    'urgent': 'Urgent',
    'important': 'Important',
    'standard': 'Standard',
  }
  return labels[priority] || priority
}

const getPriorityClasses = (priority) => {
  const classes = {
    'urgent': 'bg-red-100 text-red-800',
    'important': 'bg-orange-100 text-orange-800',
    'standard': 'bg-blue-100 text-blue-800',
  }
  return classes[priority] || 'bg-gray-100 text-gray-800'
}

const getPriorityDotClass = (priority) => {
  const classes = {
    'urgent': 'bg-red-500',
    'important': 'bg-orange-500',
    'standard': 'bg-blue-500',
  }
  return classes[priority] || 'bg-gray-500'
}

// ============================================================================
// CHARGEMENT DES DONNÉES
// ============================================================================
const fetchAffectations = async () => {
  loading.value = true
  error.value = null

  try {
    const authToken = localStorage.getItem('auth_token')
    let entite_user = null

    if (process.client) {
      const savedFunction = localStorage.getItem('entite_user')
      if (savedFunction) {
        entite_user = JSON.parse(savedFunction)
      }
    }

    if (!entite_user || !entite_user.id) {
      error.value = 'Aucune fonction utilisateur sélectionnée. Veuillez vous reconnecter.'
      toast.add({
        title: 'Erreur',
        description: 'Aucune fonction utilisateur sélectionnée.',
        color: 'red',
        timeout: 1500,
      })
      loading.value = false
      return
    }

    console.log(`📥 Chargement des affectations pour emetteur_id: ${entite_user.id}`)

    const response = await $fetch(`${config.public.apiBase}/affectations/emetteur/${entite_user.id}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })

    tableData.value = response.data.map(affectation => {
      // ✅ Formater la fonction du destinataire
      let fonctionDestinataire = ''
      if (affectation.destinataire?.entite?.code) {
        const code = affectation.destinataire.entite.code
        const roleOuFonction = affectation.destinataire.is_responsable
          ? affectation.destinataire.entite.fonction
          : 'Agent'
        fonctionDestinataire = `${code} - ${roleOuFonction}`
      }

      return {
        id: affectation.id,
        courrier_id: affectation.courrier_arrive_id || null,
        reference_courrier: affectation.courrier_arrive?.document?.reference || '',
        objet_courrier: affectation.courrier_arrive?.document?.objet || '',
        doc_courrier: affectation.courrier_arrive?.document?.url
          ? (affectation.courrier_arrive.document.url !== 'Inconnu'
            ? `${config.public.apiBase}${affectation.courrier_arrive.document.url}`
            : '')
          : '',
        date_affect: formatDate(affectation.date_affect),
        dossier: affectation.dossier || '__',
        instructions: affectation.instructions || '',
        statut: affectation.statut || 'en_cours',
        priority: affectation.priority || 'standard',
        delai_traitement: formatDate(affectation.delai_traitement),
        date_cloture: formatDate(affectation.date_cloture),
        destinataire: {
          nom: affectation.destinataire?.user
            ? `${affectation.destinataire.user.nom} ${affectation.destinataire.user.prenom || ''}`.trim()
            : 'Non assigné',
          fonction: fonctionDestinataire,
          entite: affectation.destinataire?.entite?.libelle || '',
        },
        _raw: affectation,
      }
    })

    console.log(`✅ ${tableData.value.length} affectations chargées`)
  } catch (err) {
    console.error('❌ Erreur lors du chargement:', err)
    error.value = 'Impossible de charger les affectations'
    toast.add({
      title: 'Erreur',
      description: 'Impossible de charger les affectations',
      color: 'red',
      timeout: 1500,
    })
  } finally {
    loading.value = false
  }
}

// ✅ CORRECTION : Charger les subordinates avec is_responsable
const fetchDestinataires = async () => {
  loadingDestinataires.value = true
  try {
    const authToken = localStorage.getItem('auth_token')
    let entite_user = null

    if (process.client) {
      const savedFunction = localStorage.getItem('entite_user')
      if (savedFunction) {
        entite_user = JSON.parse(savedFunction)
      }
    }

    if (!entite_user || !entite_user.id) {
      console.error('❌ Aucune fonction utilisateur sélectionnée')
      toast.add({
        title: 'Erreur',
        description: 'Aucune fonction utilisateur sélectionnée.',
        color: 'red',
        timeout: 1500,
      })
      courrierLoading.value = false
      return
    }

    console.log(`📝 Chargement des subordinates pour user_id: ${entite_user.id}`)

    const response = await $fetch(`${config.public.apiBase}/entite-users/${entite_user.id}/subordinates`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })

    // ✅ CORRECTION : Inclure is_responsable dans le mapping
    destinataires.value = response.data
      .filter(item => item.user?.statut && item.actif)
      .map(item => ({
        id: item.id, // entite_user.id
        user: item.user,
        entite: item.entite,
        actif: item.actif,
        is_interim: item.is_interim,
        is_responsable: item.is_responsable, // ✅ AJOUTÉ
      }))

    console.log(`✅ ${destinataires.value.length} destinataires (subordinates) chargés`)
    
    if (destinataires.value.length > 0) {
      console.log('📋 Exemple de destinataire:', {
        id: destinataires.value[0].id,
        nom: destinataires.value[0].user?.nom,
        fonction: destinataires.value[0].entite?.fonction,
        is_responsable: destinataires.value[0].is_responsable
      })
    }
  } catch (err) {
    console.error('❌ Erreur lors du chargement des destinataires:', err)
    toast.add({
      title: 'Erreur',
      description: 'Impossible de charger la liste des destinataires',
      color: 'red',
      timeout: 1500,
    })
  } finally {
    loadingDestinataires.value = false
  }
}

// ============================================================================
// HANDLERS
// ============================================================================
const handleEdit = async (item) => {
  console.log('🔧 Modifier le destinataire pour:', item)
  console.log('📋 Destinataire actuel ID:', item._raw.destinataire_id)
  
  selectedAffectation.value = item
  selectedNewDestinataire.value = null
  searchDestinataire.value = ''

  if (destinataires.value.length === 0) {
    await fetchDestinataires()
  }

  showEditModal.value = true
}

const selectNewDestinataire = (dest) => {
  selectedNewDestinataire.value = dest
  console.log('✅ Nouveau destinataire sélectionné:', {
    id: dest.id,
    nom: dest.user?.nom,
    fonction: dest.entite?.fonction,
    is_responsable: dest.is_responsable
  })
}

const confirmChangeDestinataire = async () => {
  if (!selectedNewDestinataire.value || !selectedAffectation.value) return

  console.log('📤 Changement de destinataire:', {
    affectation_id: selectedAffectation.value.id,
    ancien_destinataire_id: selectedAffectation.value._raw.destinataire_id,
    nouveau_destinataire_id: selectedNewDestinataire.value.id
  })

  submitting.value = true

  try {
    const authToken = localStorage.getItem('auth_token')

    const response = await $fetch(`${config.public.apiBase}/affectations/${selectedAffectation.value.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: {
        destinataire_id: selectedNewDestinataire.value.id,
      },
    })

    // ✅ Succès (code 2xx)
    showEditModal.value = false
    toast.add({
      title: 'Succès',
      description: 'Le destinataire a été modifié avec succès',
      color: 'green',
      timeout: 1500,
    })
    await fetchAffectations()

  } catch (err) {
    console.error('❌ Erreur capturée:', err)

    const errorResponse = err.data || err.response?._data || {}
    
    if (errorResponse.message) {
      toast.add({
        title: 'Erreur',
        description: errorResponse.message,
        color: 'red',
        timeout: 3000,
      })

      // ✅ Détails supplémentaires si doublon
      if (errorResponse.existing_affectation) {
        console.log('📋 Affectation existante:', {
          id: errorResponse.existing_affectation.id,
          statut: errorResponse.existing_affectation.statut,
          date: errorResponse.existing_affectation.date_affect
        })
      }
    } else {
      // ✅ Erreur réseau ou système
      toast.add({
        title: 'Erreur système',
        description: 'Impossible de communiquer avec le serveur',
        color: 'red',
        timeout: 3000,
      })
    }
  } finally {
    submitting.value = false
  }
}

const handleOpenDocument = (url) => {
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer')
  } else {
    toast.add({
      title: 'Information',
      description: 'Aucun document disponible',
      color: 'amber',
      timeout: 2000,
    })
  }
}

const handleView = async (item) => {
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
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 12px; border: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #6b7280; font-weight: 600; margin-bottom: 4px;">Statut</p>
          <span style="display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 600;" class="${getStatutClasses(item.statut)}">
            ${getStatutLabel(item.statut)}
          </span>
        </div>
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 12px; border: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #6b7280; font-weight: 600; margin-bottom: 4px;">Priorité</p>
          <span style="display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 600;" class="${getPriorityClasses(item.priority)}">
            ${getPriorityLabel(item.priority)}
          </span>
        </div>
      </div>
      
      <div style="background-color: #eef2ff; border-radius: 8px; padding: 12px; border: 1px solid #c7d2fe; margin-bottom: 12px;">
        <p style="font-size: 12px; color: #6b7280; font-weight: 600; margin-bottom: 8px;">👤 Destinataire</p>
        <p style="font-weight: 600; color: #111827; margin-bottom: 2px;">${item.destinataire.nom}</p>
        <p style="font-size: 12px; color: #6b7280;">${item.destinataire.fonction}</p>
        ${item.destinataire.entite ? `<p style="font-size: 12px; color: #6b7280;">${item.destinataire.entite}</p>` : ''}
      </div>
      
      ${item.date_cloture ? `
        <div style="background-color: #dcfce7; border-radius: 8px; padding: 12px; border: 1px solid #bbf7d0; margin-bottom: 12px;">
          <p style="font-size: 12px; color: #6b7280; font-weight: 600; margin-bottom: 4px;">✅ Date de clôture</p>
          <p style="font-size: 14px; color: #111827;">${item.date_cloture}</p>
        </div>
      ` : ''}
      
      <div style="background-color: #fef3c7; border-radius: 8px; padding: 12px; border: 1px solid #fde68a;">
        <p style="font-size: 12px; color: #6b7280; font-weight: 600; margin-bottom: 8px;">📝 Instructions</p>
        <p style="font-size: 14px; color: #374151; white-space: pre-wrap;">${item.instructions || 'Aucune instruction'}</p>
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
  })
}

const handleDelete = async (item) => {
  const result = await Swal.fire({
    title: '⚠️ Confirmer la suppression',
    html: `
      <div style="text-align: left; padding: 8px;">
        <p style="margin-bottom: 12px; color: #374151;">Êtes-vous sûr de vouloir supprimer cette affectation ?</p>
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; border: 1px solid #e5e7eb;">
          <p style="font-weight: 700; color: #7c3aed; margin-bottom: 8px;">Affectation #${item.id}</p>
          <p style="font-size: 14px; color: #374151;">
            <strong>Courrier:</strong> ${item.reference_courrier}<br>
            <strong>Destinataire:</strong> ${item.destinataire.nom}
          </p>
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

const handleQuickAssign = (courrierId) => {
  console.log('📌 Affectation rapide pour le courrier:', courrierId)
  
  if (process.client) {
    sessionStorage.setItem('preselected_courrier_id', courrierId.toString())
  }
  
  navigateTo('/affectations/create')
}

const handleSelectionChange = (selected) => {
  console.log('Sélection:', selected)
}

const handleBulkDelete = async (selected) => {
  const result = await Swal.fire({
    title: '⚠️ Suppression multiple',
    html: `
      <div style="text-align: left; padding: 8px;">
        <p style="margin-bottom: 12px; color: #374151;">Êtes-vous sûr de vouloir supprimer <strong style="color: #dc2626;">${selected.length} affectation(s)</strong> ?</p>
        <div style="background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 12px; margin-bottom: 12px;">
          <p style="font-size: 14px; color: #92400e;">⚠️ Cette action supprimera toutes les affectations sélectionnées de manière permanente.</p>
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
    reverseButtons: true
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

    if (dataTableRef.value) {
      dataTableRef.value.selectedRows = []
    }

    await fetchAffectations()
  } catch (err) {
    await Swal.fire({
      title: '❌ Erreur',
      text: 'Impossible de supprimer les affectations',
      icon: 'error',
      confirmButtonColor: '#7c3aed'
    })
  }
}

const handleBulkExport = (selected) => {
  console.log('Export:', selected)
  toast.add({
    title: 'Information',
    description: 'Fonctionnalité d\'export en cours de développement',
    color: 'amber',
    timeout: 2000,
  })
}

const refreshData = () => {
  fetchAffectations()
}

// ============================================================================
// LIFECYCLE
// ============================================================================
onMounted(() => {
  fetchAffectations()
})
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