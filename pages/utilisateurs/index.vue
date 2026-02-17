<template>
  <div class="min-h-screen bg-slate-100 p-6 font-sans">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Utilisateurs</h1>
        <p class="text-sm text-slate-500">Gestion des utilisateurs et administrateurs</p>
      </div>
      <UBadge color="green" variant="soft" size="lg" class="ml-auto">
        <Icon name="i-heroicons-plus" class="h-4 w-4 mr-1" />
        <UButton to="/utilisateurs/create" variant="text" size="sm" class="p-0 m-0 text-green-600">
          Nouveau
        </UButton>
      </UBadge>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
      <div class="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <span class="text-sm font-medium">Chargement des utilisateurs...</span>
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
    <DataTable
      v-else
      :data="utilisateurs"
      :columns="columns"
      :selectable="true"
      :left-aligned-columns="['matricule', 'nom', 'prenom', 'email', 'telephone']"
      @edit="onEdit"
      @delete="onDelete"
      @view="onView"
      @selection-change="onSelectionChange"
    >
      <!-- Advanced Filters -->
      <template #advanced-filters="{ filters, onFilter }">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="field in [
            { id: 'matricule', label: 'Matricule' },
            { id: 'nom', label: 'Nom' },
            { id: 'prenom', label: 'Prénom' },
            { id: 'email', label: 'Email' }
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

      <!-- Custom Cells -->
      <template #cell-matricule="{ value }">
        <span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
          {{ value || 'N/A' }}
        </span>
      </template>

      <template #cell-is_superadmin="{ value }">
        <span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border" :class="{
          'bg-emerald-50 text-emerald-700 border-emerald-100': value === true,
          'bg-slate-100 text-slate-600 border-slate-200': value === false
        }">
          {{ value ? 'Oui' : 'Non' }}
        </span>
      </template>

      <template #cell-statut="{ value }">
        <span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border" :class="{
          'bg-green-50 text-green-700 border-green-100': value === true,
          'bg-red-50 text-red-700 border-red-100': value === false
        }">
          {{ value ? 'Actif' : 'Inactif' }}
        </span>
      </template>

      <template #cell-prise_service="{ value }">
        <span class="text-xs text-slate-600 font-medium">
          {{ formatDate(value) }}
        </span>
      </template>

      <template #cell-fonctions="{ value }">
        <div class="flex flex-wrap gap-1 max-w-[200px]">
          <span v-if="!value || value.length === 0" class="text-xs text-slate-400 italic">
            Aucune fonction
          </span>
          <span
            v-for="(fonction, index) in value"
            :key="index"
            class="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md bg-blue-50 text-blue-700 border border-blue-200"
            :title="`${fonction.libelle}${fonction.entite ? ' - ' + fonction.entite : ''}`"
          >
            {{ fonction.libelle }}
          </span>
        </div>
      </template>

      <!-- NOUVELLE COLONNE: Fonctions Intérimaires -->
      <template #cell-fonctions_interim="{ value }">
        <div class="flex flex-wrap gap-1 max-w-[200px]">
          <span v-if="!value || value.length === 0" class="text-xs text-slate-400 italic">
            -
          </span>
          <span
            v-for="(fonction, index) in value"
            :key="index"
            class="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md bg-orange-50 text-orange-700 border border-orange-200"
            :title="`${fonction.libelle}${fonction.entite ? ' - ' + fonction.entite : ''}${fonction.date_fin ? ' (jusqu\'au ' + formatDate(fonction.date_fin) + ')' : ''}`"
          >
            <Icon name="i-heroicons-clock" class="w-3 h-3" />
            {{ fonction.libelle }}
          </span>
        </div>
      </template>

      <template #cell-points_critiques="{ value }">
        <div class="flex flex-wrap gap-1 max-w-[200px]">
          <span v-if="!value || value.length === 0" class="text-xs text-slate-400 italic">
            Aucun
          </span>
          <span
            v-for="(point, index) in value"
            :key="index"
            class="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md bg-amber-50 text-amber-700 border border-amber-200"
            :title="`${point.libelle || point.code}`"
          >
            {{ point.libelle || point.code }}
          </span>
        </div>
      </template>

      <!-- COLONNE ACTIONS: Bouton Intérim (seulement pour les responsables) -->
      <template #cell-actions="{ item }">
        <div class="flex items-center gap-2">
          <!-- Afficher le bouton uniquement si l'utilisateur est responsable -->
          <button
            v-if="item.is_responsable"
            @click="openInterimModal(item)"
            class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100 transition-colors"
            title="Ajouter un intérim"
          >
            <Icon name="i-heroicons-plus-circle" class="w-4 h-4" />
          </button>
          <span v-else class="text-xs text-slate-400 italic">-</span>
        </div>
      </template>
    </DataTable>

    <!-- ── Modal Ajout Fonction (Intérim) ─────────────────────────────────────────── -->
    <div v-if="showInterimModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-lg">
        <!-- En-tête modal -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Ajouter un intérim</h3>
            <p v-if="selectedUser" class="text-sm text-slate-600 mt-1">
              Pour: {{ selectedUser.nom }} {{ selectedUser.prenom }} ({{ selectedUser.matricule }})
            </p>
          </div>
          <button @click="closeInterimModal"
            class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="px-6 py-5 space-y-4">
          <!-- Chargement des fonctions -->
          <div v-if="loadingFonctions" class="flex justify-center py-8">
            <div class="w-6 h-6 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>

          <template v-else>
            <!-- Sélection fonction -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Fonction <span class="text-red-600">*</span>
              </label>
              <USelectMenu
                v-model="interimForm.fonction_id"
                :options="fonctionsOptions"
                placeholder="Sélectionner une fonction"
                value-attribute="id"
                option-attribute="libelle"
                searchable
                searchable-placeholder="Rechercher..."
                class="w-full"
              >
                <template #option="{ option }">
                  <div class="flex flex-col py-0.5">
                    <span class="font-semibold text-sm">{{ option.libelle }}</span>
                    <span v-if="option.entite_libelle" class="text-xs text-gray-400">
                      {{ option.entite_libelle }}
                    </span>
                  </div>
                </template>
              </USelectMenu>
            </div>

            <!-- Dates -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Date début <span class="text-red-600">*</span></label>
                <UInput v-model="interimForm.date_debut" type="date" class="w-full h-10" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Date fin</label>
                <UInput v-model="interimForm.date_fin" type="date" :min="interimForm.date_debut" class="w-full h-10" />
              </div>
            </div>

            <!-- Intérim - Toujours coché et disabled -->
            <label class="flex items-center gap-2 cursor-not-allowed opacity-75">
              <input type="checkbox" :checked="true" disabled
                class="w-4 h-4 text-indigo-600 border-gray-300 rounded" />
              <span class="text-sm font-medium text-gray-700">Fonction en intérim</span>
            </label>

            <!-- Pièce jointe -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Pièce jointe</label>

              <!-- Zone de drop ou clic -->
              <div
                class="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors"
                :class="interimFile
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50'"
                @click="interimFileInputRef?.click()"
                @dragover.prevent
                @drop.prevent="onFileDrop"
              >
                <input
                  ref="interimFileInputRef"
                  type="file"
                  @change="handleInterimFileChange"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  class="hidden"
                />

                <!-- Fichier sélectionné -->
                <div v-if="interimFile" class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2 min-w-0">
                    <svg class="w-8 h-8 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div class="text-left min-w-0">
                      <p class="text-sm font-medium text-gray-800 truncate">{{ interimFile.name }}</p>
                      <p class="text-xs text-gray-500">{{ formatFileSize(interimFile.size) }}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    @click.stop="removeInterimFile"
                    class="flex-shrink-0 p-1 rounded-full text-red-400 hover:text-red-600 hover:bg-red-100 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <!-- Aucun fichier -->
                <div v-else class="flex flex-col items-center gap-2 py-2">
                  <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <p class="text-sm text-gray-500">
                    <span class="font-medium text-indigo-600">Cliquez</span> ou glissez un fichier ici
                  </p>
                  <p class="text-xs text-gray-400">PDF, Word, Images — max 5 Mo</p>
                </div>
              </div>
            </div>

            <!-- Message d'erreur -->
            <div v-if="interimError" class="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm text-red-800">{{ interimError }}</p>
            </div>
          </template>
        </div>

        <!-- Footer modal -->
        <div class="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <UButton type="button" color="gray" variant="outline" @click="closeInterimModal">
            Annuler
          </UButton>
          <UButton
            type="button"
            @click="submitInterim"
            :loading="submittingInterim"
            :disabled="!interimForm.fonction_id || !interimForm.date_debut"
          >
            <svg v-if="!submittingInterim" class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Enregistrer l'intérim
          </UButton>
        </div>
      </div>
    </div>

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
              <span class="text-slate-600 font-medium">Matricule:</span>
              <span class="font-semibold text-slate-900">{{ itemToDelete.matricule }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-600 font-medium">Nom:</span>
              <span class="font-semibold text-slate-900">{{ itemToDelete.nom }} {{ itemToDelete.prenom }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-600 font-medium">Email:</span>
              <span class="font-semibold text-slate-900">{{ itemToDelete.email }}</span>
            </div>
          </div>
        </div>

        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p class="text-xs text-yellow-800">
            <strong>⚠️ Attention :</strong> Vous êtes sur le point de supprimer cet utilisateur. 
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

const config = useRuntimeConfig()

// ============================================================================
// CONFIGURATION DES COLONNES - AVEC NOUVELLE COLONNE "Fonctions Intérimaires"
// ============================================================================
const columns = [
  { key: 'id', label: 'N°', visible: true },
  { key: 'matricule', label: 'Matricule', visible: true },
  { key: 'nom', label: 'Nom', visible: true },
  { key: 'prenom', label: 'Prénom', visible: true },
  { key: 'email', label: 'Email', visible: true },
  { key: 'telephone', label: 'Téléphone', visible: true },
  { key: 'points_critiques', label: 'Entité', visible: true },
  { key: 'fonctions', label: 'Fonctions', visible: true },
  { key: 'fonctions_interim', label: 'Fonctions Intérimaires', visible: true },
  { key: 'prise_service', label: 'Prise Service', visible: true },
  { key: 'is_superadmin', label: 'Admin', visible: true },
  { key: 'statut', label: 'Statut', visible: true },
  { key: 'actions', label: 'Ajout d\'intérim', visible: true },
]

// ============================================================================
// ÉTATS RÉACTIFS
// ============================================================================
const utilisateurs = ref([])
const loading = ref(false)
const error = ref(null)
const showDeleteModal = ref(false)
const itemToDelete = ref(null)
const deleting = ref(false)

// États pour l'intérim
const showInterimModal = ref(false)
const selectedUser = ref(null)
const loadingFonctions = ref(false)
const fonctions = ref([])
const submittingInterim = ref(false)
const interimError = ref(null)
const interimFileInputRef = ref(null)
const interimFile = ref(null)
const interimForm = ref({
  fonction_id: null,
  date_debut: '',
  date_fin: '',
})

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================
const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('fr-FR')
}

const formatFileSize = (bytes) => {
  if (!bytes) return ''
  if (bytes < 1024) return bytes + ' o'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' Ko'
  return (bytes / (1024 * 1024)).toFixed(1) + ' Mo'
}

// ============================================================================
// COMPUTED PROPERTIES
// ============================================================================
const fonctionsOptions = computed(() =>
  fonctions.value.map(f => ({
    id: f.id,
    libelle: f.libelle || f.code,
    code: f.code,
    entite_libelle: f.entite?.libelle || f.entite_libelle || '',
  }))
)

// ============================================================================
// VALIDATION FICHIER
// ============================================================================
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg', 'image/jpg', 'image/png',
]

const validateFile = (file) => {
  if (!file) return null
  if (file.size > 5 * 1024 * 1024) {
    return 'Le fichier ne doit pas dépasser 5 Mo'
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return 'Format non autorisé (PDF, Word, JPG, PNG uniquement)'
  }
  return null
}

// ============================================================================
// CHARGEMENT DES UTILISATEURS
// ============================================================================
const loadUtilisateurs = async () => {
  loading.value = true
  error.value = null

  try {
    const token = localStorage.getItem('auth_token')
    
    if (!token) {
      throw new Error('Token d\'authentification manquant')
    }

    console.log('🔄 Chargement des utilisateurs...')

    const response = await $fetch(`${config.public.apiBase}/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })

    console.log('📦 Réponse API complète:', response)

    // Extraction des données selon le format de réponse
    let dataArray = []
    
    if (response?.data?.data && Array.isArray(response.data.data)) {
      dataArray = response.data.data
      console.log('📊 Format paginé détecté')
    } else if (response?.data && Array.isArray(response.data)) {
      dataArray = response.data
      console.log('📊 Format simple détecté')
    } else if (Array.isArray(response)) {
      dataArray = response
      console.log('📊 Format tableau direct détecté')
    } else {
      console.error('❌ Format de réponse inconnu:', response)
      throw new Error('Format de réponse API invalide')
    }

    console.log('📊 Données extraites:', dataArray.length, 'utilisateurs')

    // ========================================================================
    // TRANSFORMATION DES DONNÉES - LOGIQUE PRINCIPALE
    // ========================================================================
    utilisateurs.value = dataArray.map((user) => {
      // ======================================================================
      // ÉTAPE 1: Identifier l'entité principale
      // Critères: actif=true, is_interim=false, is_responsable=true
      // ======================================================================
      const entitePrincipale = user.entite_users?.find(eu => 
        eu.actif === true && 
        eu.is_interim === false && 
        eu.is_responsable === true
      )

      // ======================================================================
      // ÉTAPE 2: Déterminer si l'utilisateur est responsable
      // ======================================================================
      const isResponsable = !!entitePrincipale

      // ======================================================================
      // ÉTAPE 3: Extraire les fonctions principales
      // ======================================================================
      let fonctions = []
      let entite = []
      
      if (entitePrincipale) {
        // Utilisateur RESPONSABLE
        fonctions = [{
          libelle: entitePrincipale.entite?.fonction || 'Responsable',
          entite: entitePrincipale.entite?.libelle || ''
        }]
        entite = [{ libelle: entitePrincipale.entite?.libelle || '' }]
      } else {
        // Utilisateur AGENT (pas de fonction de responsable)
        const agentEntite = user.entite_users?.find(eu => 
          eu.actif === true && 
          eu.is_interim === false &&
          eu.is_responsable === false
        )
        
        if (agentEntite) {
          fonctions = [{ libelle: 'Agent', entite: agentEntite.entite?.libelle || '' }]
          entite = [{ libelle: agentEntite.entite?.libelle || '' }]
        }
      }

      // ======================================================================
      // ÉTAPE 4: Extraire les fonctions intérimaires
      // Critères: actif=true, is_interim=true, is_responsable=true
      // ======================================================================
      const fonctionsInterim = (user.entite_users || [])
        .filter(eu => 
          eu.actif === true && 
          eu.is_interim === true && 
          eu.is_responsable === true
        )
        .map(eu => ({
          libelle: eu.entite?.fonction || 'Intérim',
          entite: eu.entite?.libelle || '',
          date_fin: eu.date_fin,
          entite_id: eu.entite_id
        }))

      // ======================================================================
      // ÉTAPE 5: Points critiques (entités)
      // ======================================================================
      const pointsCritiques = (user.points_critiques || []).map(pc => ({
        id: pc.id,
        libelle: pc.libelle || pc.code || 'N/A',
        code: pc.code
      }))

      // ======================================================================
      // RETOUR: Objet utilisateur transformé
      // ======================================================================
      return {
        id: user.id,
        matricule: user.matricule || 'N/A',
        nom: user.nom || '',
        prenom: user.prenom || '',
        email: user.email || '',
        telephone: user.telephone || 'N/A',
        fonctions: fonctions,
        fonctions_interim: fonctionsInterim,
        points_critiques: entite,
        prise_service: user.prise_service || null,
        is_superadmin: user.is_superadmin ?? false,
        statut: user.statut ?? false,
        is_responsable: isResponsable,
        entite_principale: entitePrincipale?.entite || null,
        parent_entite_id: entitePrincipale?.entite?.parent_entite_id || null,
        raw_data: user
      }
    })

    console.log('✅ Utilisateurs chargés:', utilisateurs.value.length)
    console.log('📊 Exemple utilisateur traité:', utilisateurs.value[0])

  } catch (err) {
    console.error('❌ Erreur chargement:', err)
    error.value = err.message || 'Erreur lors du chargement des utilisateurs'
    
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

// ============================================================================
// CHARGEMENT DES FONCTIONS
// ============================================================================
const loadFonctions = async () => {
  loadingFonctions.value = true
  try {
    const token = localStorage.getItem('auth_token')
    const config = useRuntimeConfig()
    
    const response = await $fetch(
      `${config.public.apiBase}/entites/entites-meme-niveau/${selectedUser.value?.entite_users?.[0]?.entite?.parent_entite_id || selectedUser.value?.parent_entite_id || '0'}`,
      { 
        method: 'GET', 
        headers: { 
          Authorization: `Bearer ${token}`, 
          Accept: 'application/json' 
        } 
      }
    )
    
    fonctions.value = response?.data ?? (Array.isArray(response) ? response : [])
    console.log('✅ Fonctions chargées:', fonctions.value.length)
  } catch (err) {
    console.error('❌ Erreur chargement fonctions:', err)
    useToast().add({ 
      title: 'Erreur', 
      description: 'Impossible de charger les fonctions', 
      color: 'red' 
    })
  } finally {
    loadingFonctions.value = false
  }
}

// ============================================================================
// GESTION DE L'INTÉRIM
// ============================================================================

/**
 * Ouvre le modal d'ajout d'intérim
 */
// const openInterimModal = async (user) => {
//   console.log('🔓 Ouverture modal intérim pour:', user)
  
//   selectedUser.value = user
//   showInterimModal.value = true
//   interimError.value = null
  
//   if (fonctions.value.length === 0) {
//     await loadFonctions()
//   }
// }
/**
 * Ouvre le modal d'ajout d'intérim
 */
const openInterimModal = async (user) => {
  console.log('🔓 Ouverture modal intérim pour:', user.nom, user.prenom, 'ID:', user.id)
  console.log('📊 Données utilisateur complètes:', user)
  
  // ✅ IMPORTANT: Réinitialiser complètement avant de charger les nouvelles données
  selectedUser.value = null
  fonctions.value = []
  interimForm.value = {
    fonction_id: null,
    date_debut: '',
    date_fin: '',
  }
  interimFile.value = null
  interimError.value = null
  if (interimFileInputRef.value) interimFileInputRef.value.value = ''
  
  // Définir le nouvel utilisateur sélectionné
  selectedUser.value = user
  
  // Ouvrir le modal
  showInterimModal.value = true
  
  // ✅ IMPORTANT: Charger les fonctions pour CET utilisateur spécifique
  await loadFonctions(user)
}

/**
 * Ferme le modal et réinitialise les données
 */
const closeInterimModal = () => {
  showInterimModal.value = false
  selectedUser.value = null
  interimForm.value = {
    fonction_id: null,
    date_debut: '',
    date_fin: '',
  }
  interimFile.value = null
  interimError.value = null
  if (interimFileInputRef.value) interimFileInputRef.value.value = ''
}

/**
 * Gestion du fichier joint
 */
const handleInterimFileChange = (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  
  const error = validateFile(file)
  if (error) {
    useToast().add({ title: 'Fichier invalide', description: error, color: 'red' })
    return
  }
  
  interimFile.value = file
  console.log('📎 Fichier sélectionné:', file.name, formatFileSize(file.size))
}

const onFileDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (!file) return
  
  const error = validateFile(file)
  if (error) {
    useToast().add({ title: 'Fichier invalide', description: error, color: 'red' })
    return
  }
  
  interimFile.value = file
}

const removeInterimFile = () => {
  interimFile.value = null
  if (interimFileInputRef.value) interimFileInputRef.value.value = ''
}

/**
 * Soumet le formulaire de création d'intérim
 */
const submitInterim = async () => {
  // Validation
  if (!selectedUser.value || !interimForm.value.fonction_id || !interimForm.value.date_debut) {
    interimError.value = 'Veuillez remplir tous les champs obligatoires'
    return
  }

  if (interimForm.value.date_fin && interimForm.value.date_fin < interimForm.value.date_debut) {
    interimError.value = 'La date de fin doit être après la date de début'
    return
  }

  submittingInterim.value = true
  interimError.value = null

  try {
    const token = localStorage.getItem('auth_token')
    const config = useRuntimeConfig()
    
    // Préparation du FormData
    const formData = new FormData()
    formData.append('entite_id', String(interimForm.value.fonction_id))
    formData.append('user_id', String(selectedUser.value.id))
    formData.append('date_debut', interimForm.value.date_debut)
    formData.append('is_interim', '1') // ✅ IMPORTANT: Marquer comme intérim
    formData.append('actif', '1')
    
    if (interimForm.value.date_fin) {
      formData.append('date_fin', interimForm.value.date_fin)
    }
    
    if (interimFile.value instanceof File) {
      formData.append('piece_jointe', interimFile.value)
    }

    console.log('📤 Création intérim...')
    console.log('📋 Données:', {
      fonction_id: interimForm.value.fonction_id,
      user_id: selectedUser.value.id,
      date_debut: interimForm.value.date_debut,
      date_fin: interimForm.value.date_fin,
      is_interim: true
    })

    const response = await $fetch(
      `${config.public.apiBase}/entite-users`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData
      }
    )

    console.log('✅ Intérim créé:', response)

    useToast().add({
      title: "Succès",
      description: "L'intérim a été créé avec succès",
      color: "green",
    })

    closeInterimModal()
    await loadUtilisateurs() // Rafraîchir la liste pour afficher le nouvel intérim

  } catch (err) {
    console.error('❌ Erreur création intérim:', err)

    let errorMessage = "Erreur lors de la création de l'intérim"

    if (err.status === 422 || err.statusCode === 422) {
      if (err.data?.errors) {
        errorMessage = Object.values(err.data.errors).flat().join(', ')
      } else {
        errorMessage = err.data?.message || errorMessage
      }
    } else if (err.data?.message) {
      errorMessage = err.data.message
    }

    interimError.value = errorMessage

    useToast().add({
      title: "Erreur",
      description: errorMessage,
      color: "red",
    })
  } finally {
    submittingInterim.value = false
  }
}

// ============================================================================
// AUTRES HANDLERS
// ============================================================================
const refresh = async () => {
  console.log('🔄 Rafraîchissement manuel...')
  await loadUtilisateurs()
}

const onView = (item) => {
  console.log('👁️ Voir:', item)
  navigateTo(`/utilisateurs/${item.id}`)
}

const onEdit = (item) => {
  console.log('✏️ Éditer:', item)
  navigateTo(`/utilisateurs/${item.id}`)
}

const onDelete = (item) => {
  console.log('🗑️ Demande de suppression:', item)
  itemToDelete.value = item
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!itemToDelete.value) return
  
  deleting.value = true

  try {
    const token = localStorage.getItem('auth_token')
    
    if (!token) {
      throw new Error('Token d\'authentification manquant')
    }

    console.log('🚀 Suppression de l\'utilisateur ID:', itemToDelete.value.id)
    
    await $fetch(`${config.public.apiBase}/users/${itemToDelete.value.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
    
    showDeleteModal.value = false
    
    useToast().add({
      title: "Succès",
      description: `L'utilisateur "${itemToDelete.value.nom} ${itemToDelete.value.prenom}" a été supprimé avec succès`,
      color: "green",
    })
    
    itemToDelete.value = null
    await loadUtilisateurs()
    
  } catch (err) {
    console.error('❌ Erreur suppression:', err)
    
    let errorMessage = "Une erreur est survenue lors de la suppression"
    
    if (err.status === 401 || err.statusCode === 401) {
      errorMessage = "Session expirée. Veuillez vous reconnecter"
      setTimeout(() => navigateTo('/login'), 2000)
    } else if (err.status === 404 || err.statusCode === 404) {
      errorMessage = "L'utilisateur n'existe plus ou a déjà été supprimé"
      await loadUtilisateurs()
    } else {
      errorMessage = err.data?.message || err.message || errorMessage
    }
    
    useToast().add({
      title: "Erreur de suppression",
      description: errorMessage,
      color: "red",
    })
    
  } finally {
    deleting.value = false
  }
}

const onBulkDelete = async (selectedIds) => {
  if (selectedIds.length === 0) return
  
  const confirmMsg = selectedIds.length === 1 
    ? 'Voulez-vous vraiment supprimer cet utilisateur ?' 
    : `Voulez-vous vraiment supprimer ${selectedIds.length} utilisateurs ?`
  
  if (!confirm(confirmMsg)) return

  try {
    const token = localStorage.getItem('auth_token')
    
    if (!token) {
      throw new Error('Token d\'authentification manquant')
    }
    
    let successCount = 0
    let errorCount = 0
    const errors = []
    
    useToast().add({
      title: "Suppression en cours",
      description: `Suppression de ${selectedIds.length} utilisateur(s)...`,
      color: "blue",
    })
    
    for (const id of selectedIds) {
      try {
        await $fetch(`${config.public.apiBase}/users/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        })
        successCount++
        console.log(`✅ Utilisateur ${id} supprimé`)
      } catch (err) {
        errorCount++
        console.error(`❌ Erreur suppression ID ${id}:`, err)
        
        const user = utilisateurs.value.find(u => u.id === id)
        errors.push({
          id,
          nom: user ? `${user.nom} ${user.prenom}` : `ID ${id}`,
          message: err.data?.message || err.message || 'Erreur inconnue'
        })
      }
    }
    
    console.log(`🗑️ Suppression multiple terminée: ${successCount} succès, ${errorCount} échecs`)
    
    if (errorCount === 0) {
      useToast().add({
        title: "Suppression réussie",
        description: `${successCount} utilisateur(s) supprimé(s) avec succès`,
        color: "green",
      })
    } else if (successCount === 0) {
      useToast().add({
        title: "Échec de la suppression",
        description: `Aucun utilisateur n'a pu être supprimé. ${errors[0]?.message || ''}`,
        color: "red",
      })
    } else {
      useToast().add({
        title: "Suppression partielle",
        description: `${successCount} utilisateur(s) supprimé(s), ${errorCount} échec(s)`,
        color: "orange",
      })
      
      if (errors.length > 0 && errors.length <= 3) {
        errors.forEach(err => {
          useToast().add({
            title: `Erreur: ${err.nom}`,
            description: err.message,
            color: "red",
          })
        })
      }
    }
    
    await loadUtilisateurs()
    
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

// ============================================================================
// LIFECYCLE HOOKS
// ============================================================================
onMounted(() => {
  console.log('🚀 Composant monté, chargement des utilisateurs...')
  loadUtilisateurs()
})

onActivated(() => {
  console.log('🔄 Page activée, rafraîchissement...')
  loadUtilisateurs()
})
</script>