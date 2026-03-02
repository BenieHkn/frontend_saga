<template>
  <div class="bg-slate-100 p-6 font-sans">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Assignation de points critiques</h1>
        <p class="text-sm text-slate-500">Gestion des assignations points critiques</p>
      </div>
      <UBadge color="green" variant="soft" size="lg" class="ml-auto">
        <Icon name="i-heroicons-plus" class="h-4 w-4 mr-1" />
        <UButton to="/point-critique/create_assignment" variant="text" size="sm" class="p-0 m-0 text-green-600">
          Nouveau
        </UButton>
      </UBadge>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
      <div class="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <span class="text-sm font-medium">Chargement des assignations...</span>
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
    <DataTable v-else :data="pointsCritiques" :columns="filteredColumns" :selectable="false" :show-row-numbers="true" :default-sort-column="null"
      :left-aligned-columns="['code', 'libelle', 'user_name', 'is_interim']" 
      :show-delete-action="false"
      @edit="onEdit"
      @view="onView"
      @selection-change="onSelectionChange">
     
      <!-- Advanced Filters -->
      <template #advanced-filters="{ filters, onFilter }">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="field in [
            { id: 'code', label: 'Code' },
            { id: 'libelle', label: 'Libellé' },
            { id: 'user_name', label: 'Agent' },
            { id: 'matricule', label: 'Matricule' }
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

      <!-- Custom Cells -->
      <template #cell-code="{ value }">
        <span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
          {{ value || 'N/A' }}
        </span>
      </template>

      <template #cell-libelle="{ value }">
        <span class="text-xs text-slate-900 font-semibold">
          {{ value || 'N/A' }}
        </span>
      </template>

      <template #cell-user_name="{ value }">
        <span class="text-xs text-slate-700 font-medium">
          {{ value || 'Non assigné' }}
        </span>
      </template>

      <template #cell-matricule="{ value }">
        <span class="inline-flex px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-slate-100 text-slate-600 border border-slate-200">
          {{ value || 'N/A' }}
        </span>
      </template>

      <template #cell-is_interim="{ value }">
        <span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border" :class="{
          'bg-orange-50 text-orange-700 border-orange-100': value === true,
          'bg-blue-50 text-blue-700 border-blue-100': value === false
        }">
          {{ value ? 'Intérim' : 'Titulaire' }}
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

      <template #cell-date_debut="{ value }">
        <span class="text-xs text-slate-600 font-medium">
          {{ value ? formatDate(value) : 'Non définie' }}
        </span>
      </template>

      <template #cell-date_fin="{ value, item }">
        <span class="text-xs text-slate-600 font-medium" :class="{
          'text-slate-400 italic': item.statut === true,
          'text-slate-600': item.statut === false
        }">
          {{ item.statut ? 'Non applicable' : (value ? formatDate(value) : 'Non définie') }}
        </span>
      </template>

      <!-- <template #cell-piece_jointe_url="{ value }">
        <a v-if="value" :href="value" target="_blank"
          class="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded hover:bg-indigo-100 transition-colors">
          <Icon name="i-heroicons-paper-clip" class="w-3 h-3" />
          Voir
        </a>
        <span v-else class="text-xs text-slate-400 italic">Aucun fichier</span>
      </template> -->
      <template #cell-piece_jointe_url="{ value }">
        <button
          v-if="value"
          @click.stop="openAttachmentModal(value)"
          class="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded hover:bg-indigo-100 active:scale-95 transition-all"
        >
          <Icon name="i-heroicons-paper-clip" class="w-3 h-3 !text-indigo-600" />
          Voir
        </button>
        <span v-else class="text-xs text-slate-400 italic">Aucun fichier</span>
      </template>
    </DataTable>

    <!-- Modal de modification -->
    <UModal v-model="showEditModal" :ui="{ width: 'sm:max-w-2xl' }">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-slate-900">
              {{ selectedItem?.statut ? 'Désactiver l\'assignation' : 'Réactiver l\'assignation' }}
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              @click="closeEditModal"
            />
          </div>
        </template>

        <div v-if="selectedItem" class="space-y-4">
          <!-- Informations en lecture seule -->
          <div class="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Point critique
              </label>
              <p class="text-sm font-semibold text-slate-900">
                {{ selectedItem.code }} - {{ selectedItem.libelle }}
              </p>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Agent
              </label>
              <p class="text-sm font-semibold text-slate-900">
                {{ selectedItem.user_name }}
              </p>
              <p class="text-xs text-slate-600 mt-0.5">
                Matricule: {{ selectedItem.matricule }}
              </p>
            </div>

            <!-- Pièce jointe existante -->
            <div v-if="selectedItem.piece_jointe_url">
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Pièce jointe actuelle
              </label>
              <a :href="selectedItem.piece_jointe_url" target="_blank"
                class="inline-flex items-center gap-2 px-3 py-2 text-sm text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors">
                <Icon name="i-heroicons-paper-clip" class="w-4 h-4" />
                Télécharger le fichier
              </a>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Type d'assignation
              </label>
              <span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border" :class="{
                'bg-orange-50 text-orange-700 border-orange-100': selectedItem.is_interim === true,
                'bg-blue-50 text-blue-700 border-blue-100': selectedItem.is_interim === false
              }">
                {{ selectedItem.is_interim ? 'Intérim' : 'Titulaire' }}
              </span>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Date de début
              </label>
              <p class="text-sm text-slate-700">
                {{ selectedItem.date_debut ? formatDate(selectedItem.date_debut) : 'Non définie' }}
              </p>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Statut actuel
              </label>
              <span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border" :class="{
                'bg-green-50 text-green-700 border-green-100': selectedItem.statut === true,
                'bg-red-50 text-red-700 border-red-100': selectedItem.statut === false
              }">
                {{ selectedItem.statut ? 'Actif' : 'Inactif' }}
              </span>
            </div>
          </div>

          <!-- Formulaire de modification -->
          <div class="space-y-3">
            <!-- Date de fin -->
            <div v-if="selectedItem.statut">
              <label class="block text-xs font-bold text-slate-700 mb-1.5">
                Date de fin <span class="text-red-500">*</span>
              </label>
              <input
                v-model="editForm.date_fin"
                type="date"
                :min="selectedItem.date_debut ? selectedItem.date_debut.split('T')[0] : undefined"
                class="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                required
              />
              <p class="text-xs text-slate-500 mt-1">
                La date de fin doit être postérieure ou égale à la date de début
              </p>
            </div>

            <!-- Ajout/modification de pièce jointe -->
            <!-- <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">
                {{ selectedItem.piece_jointe_url ? 'Remplacer la pièce jointe' : 'Ajouter une pièce jointe' }}
                <span class="text-xs font-normal text-slate-500 ml-2">(Optionnel)</span>
              </label>
              <div
                class="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors"
                :class="editForm.newFile
                  ? 'border-green-300 bg-green-50'
                  : 'border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50'"
                @click="editFileInputRef?.click()"
              >
                <input
                  ref="editFileInputRef"
                  type="file"
                  @change="handleEditFileChange"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  class="hidden"
                />

                <div v-if="editForm.newFile" class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-green-100">
                      <Icon name="i-heroicons-document" class="w-4 h-4 text-green-600" />
                    </div>
                    <div class="text-left min-w-0">
                      <p class="text-sm font-semibold text-slate-800 truncate">{{ editForm.newFile.name }}</p>
                      <p class="text-xs text-slate-500">{{ formatFileSize(editForm.newFile.size) }}</p>
                    </div>
                  </div>
                  <button type="button" @click.stop="removeEditFile"
                    class="flex-shrink-0 p-1.5 rounded-full text-red-400 hover:text-red-600 hover:bg-red-100 transition-colors">
                    <Icon name="i-heroicons-x-mark" class="w-4 h-4" />
                  </button>
                </div>

                <div v-else class="flex flex-col items-center gap-2 py-1">
                  <Icon name="i-heroicons-arrow-up-tray" class="w-8 h-8 text-slate-300" />
                  <p class="text-xs text-slate-500">
                    <span class="font-semibold text-indigo-600">Cliquez</span> pour sélectionner un fichier
                  </p>
                  <p class="text-[10px] text-slate-400">PDF, Word, Images — max 5 Mo</p>
                </div>
              </div>
            </div> -->

            <!-- Message pour réactivation -->
            <div v-if="!selectedItem.statut" class="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p class="text-sm text-green-800">
                Cette action réactivera l'assignation et supprimera la date de fin.
              </p>
            </div>

            <!-- Action à effectuer -->
            <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p class="text-xs text-blue-800">
                <strong>Action :</strong>
                {{ selectedItem.statut ? 'L\'assignation sera désactivée' : 'L\'assignation sera réactivée' }}
              </p>
            </div>
          </div>

          <!-- Message d'erreur -->
          <div v-if="editError" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-800">{{ editError }}</p>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton
              color="gray"
              variant="outline"
              @click="closeEditModal"
              :disabled="submitting"
            >
              Annuler
            </UButton>
            <UButton
              :color="selectedItem?.statut ? 'red' : 'green'"
              @click="submitEdit"
              :loading="submitting"
              :disabled="selectedItem?.statut && !editForm.date_fin"
            >
              {{ selectedItem?.statut ? 'Désactiver' : 'Réactiver' }}
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <UModal v-model="showAttachmentModal" :ui="{ width: 'sm:max-w-4xl' }">
      <UCard :ui="{ body: { padding: 'p-0' } }">
        <!-- <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Icon
                :name="attachmentType === 'pdf' ? 'i-heroicons-document-text' : attachmentType === 'image' ? 'i-heroicons-photo' : 'i-heroicons-document'"
                class="w-5 h-5 text-indigo-600"
              />
              <h3 class="text-base font-bold text-slate-900 truncate max-w-sm">
                {{ attachmentFileName }}
              </h3>
            </div>
            <div class="flex items-center gap-2">
              
              <a
                v-if="attachmentBlobUrl"
                :href="attachmentBlobUrl"
                :download="attachmentFileName"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Icon name="i-heroicons-arrow-down-tray" class="w-3.5 h-3.5" />
                Télécharger
              </a>
              <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" @click="closeAttachmentModal" />
            </div>
          </div>
        </template> -->

        <!-- Chargement -->
        <div v-if="attachmentLoading" class="flex flex-col items-center justify-center gap-3 py-20 bg-slate-50">
          <div class="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <span class="text-sm text-slate-500 font-medium">Chargement du fichier...</span>
        </div>

        <!-- Erreur -->
        <div v-else-if="attachmentError" class="flex flex-col items-center justify-center gap-4 py-16 bg-slate-50">
          <div class="w-14 h-14 flex items-center justify-center rounded-full bg-red-100">
            <Icon name="i-heroicons-exclamation-triangle" class="w-7 h-7 text-red-500" />
          </div>
          <p class="text-sm text-red-700 font-medium">{{ attachmentError }}</p>
        </div>

        <!-- PDF via Blob URL -->
        <div v-else-if="attachmentBlobUrl && attachmentType === 'pdf'" class="w-full" style="height: 75vh;">
          <iframe
            :src="attachmentBlobUrl + '#toolbar=1&navpanes=0&view=FitH'"
            class="w-full h-full border-0"
            title="Pièce jointe PDF"
          ></iframe>
        </div>

        <!-- Image via Blob URL -->
        <div v-else-if="attachmentBlobUrl && attachmentType === 'image'" class="flex items-center justify-center p-6 bg-slate-50" style="min-height: 40vh;">
          <img
            :src="attachmentBlobUrl"
            :alt="attachmentFileName"
            class="max-w-full max-h-[65vh] object-contain rounded shadow-md"
          />
        </div>

        <!-- Autre format -->
        <div v-else-if="attachmentBlobUrl" class="flex flex-col items-center justify-center gap-4 py-16 bg-slate-50">
          <div class="w-16 h-16 flex items-center justify-center rounded-full bg-slate-200">
            <Icon name="i-heroicons-document" class="w-8 h-8 text-slate-500" />
          </div>
          <p class="text-sm text-slate-600 font-medium">Aperçu non disponible pour ce type de fichier</p>
          <a
            :href="attachmentBlobUrl"
            :download="attachmentFileName"
            class="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Icon name="i-heroicons-arrow-down-tray" class="w-4 h-4" />
            Télécharger le fichier
          </a>
        </div>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
import DataTable from '~/components/DataTable.vue'
import { useApi } from '~/composables/useApi'
import { ref, computed, watch } from 'vue'

useHead({
  title: "Assignations Points Critiques - Sagar Revolution",
});

// États
const showEditModal = ref(false)
const selectedItem = ref(null)
const submitting = ref(false)
const editError = ref(null)
const editFileInputRef = ref(null)
const editForm = ref({
  date_fin: '',
  statut: false,
  newFile: null
})

// Voir
// — Refs modal pièce jointe
const showAttachmentModal = ref(false)
const attachmentBlobUrl = ref('')   // URL blob locale (révoquée à la fermeture)
const attachmentType = ref('')      // 'pdf' | 'image' | 'other'
const attachmentFileName = ref('')
const attachmentLoading = ref(false)
const attachmentError = ref(null)

// — Helpers
const getToken = () => {
  if (process.client) {
    return useCookie('auth_token').value || localStorage.getItem('auth_token') || ''
  }
  return useCookie('auth_token').value || ''
}

const buildStorageUrl = (path) => {
  const config = useRuntimeConfig()
  // Retire les slashes échappés, le slash initial, et le préfixe "storage/"
  const cleanPath = path
    .replace(/\\\//g, '/')   // \/ → /
    .replace(/^\//, '')      // retire le / initial  → "storage/assignations/xxx.pdf"
    .replace(/^storage\//, '') // retire "storage/"  → "assignations/xxx.pdf"
  
  return `${config.public.apiBase}/file/${cleanPath}`
}

const detectFileType = (path) => {
  const lower = path.toLowerCase().split('?')[0]
  if (lower.endsWith('.pdf')) return 'pdf'
  if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].some(ext => lower.endsWith(ext))) return 'image'
  return 'other'
}

const extractFileName = (path) => {
  return path.replace(/\\\//g, '/').split('/').pop() || 'Fichier'
}

// — Ouverture : fetch avec Bearer token → Blob URL
const openAttachmentModal = async (path) => {
  const url = buildStorageUrl(path)
  console.log('🔗 URL:', url)
  console.log('📄 Path brut:', path)
  
  // Reset
  attachmentBlobUrl.value = ''
  attachmentError.value = null
  attachmentLoading.value = true
  attachmentType.value = detectFileType(path)
  attachmentFileName.value = extractFileName(path)
  showAttachmentModal.value = true

  try {
    const url = buildStorageUrl(path)
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Accept': '*/*',
      },
    })

    if (!response.ok) {
      throw new Error(`Erreur ${response.status} : accès refusé ou fichier introuvable`)
    }

    const blob = await response.blob()
    attachmentBlobUrl.value = URL.createObjectURL(blob)
  } catch (err) {
    console.error('❌ Erreur chargement pièce jointe:', err)
    attachmentError.value = err.message || 'Impossible de charger le fichier'
  } finally {
    attachmentLoading.value = false
  }
}

// — Fermeture : libère la mémoire du Blob
const closeAttachmentModal = () => {
  showAttachmentModal.value = false
  setTimeout(() => {
    if (attachmentBlobUrl.value) {
      URL.revokeObjectURL(attachmentBlobUrl.value)
      attachmentBlobUrl.value = ''
    }
    attachmentType.value = ''
    attachmentFileName.value = ''
    attachmentError.value = null
  }, 200)
}
// Fin Voir

// Configuration colonnes
const columns = [
  { key: 'code', label: 'Code', visible: true, showLabel: false },
  { key: 'libelle', label: 'Libellé', visible: true, showLabel: false },
  { key: 'user_name', label: 'Agent', visible: true, showLabel: false },
  { key: 'matricule', label: 'Matricule', visible: true, showLabel: false },
  { key: 'is_interim', label: 'Type', visible: true, showLabel: false },
  { key: 'statut', label: 'Statut', visible: true, showLabel: false },
  { key: 'date_debut', label: 'Date de début', visible: true, showLabel: false },
  { key: 'date_fin', label: 'Date de fin', visible: true, showLabel: false },
  { key: 'piece_jointe_url', label: 'Fichier', visible: true, showLabel: false },
]

// Helpers
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

// const formatFileSize = (bytes) => {
//   if (!bytes) return ''
//   if (bytes < 1024) return bytes + ' o'
//   if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' Ko'
//   return (bytes / (1024 * 1024)).toFixed(1) + ' Mo'
// }

const transformPointsCritiques = (response) => {
  console.log('📦 Response complète assignations:', response)
 
  let dataArray = []
 
  if (!response) {
    console.error('❌ Response is null or undefined')
    return []
  }
 
  if (response.data && Array.isArray(response.data)) {
    dataArray = response.data
  } else if (Array.isArray(response)) {
    dataArray = response
  } else {
    console.error('❌ Format de réponse non reconnu:', response)
    return []
  }
 
  console.log('📊 Data array extracted:', dataArray.length, 'assignations')

  return dataArray.map((item) => {
    const user = item.user || {}
    const pointCritique = item.point_critique || {}
    
    return {
      id: item.id,
      code: pointCritique.code || 'N/A',
      libelle: pointCritique.libelle || 'N/A',
      user_name: user.nom && user.prenom ? `${user.nom} ${user.prenom}` : 'Non assigné',
      matricule: user.matricule || 'N/A',
      is_interim: item.is_interim ?? false,
      statut: item.statut ?? true,
      date_debut: item.date_debut || null,
      date_fin: item.date_fin || null,
      piece_jointe_url: item.piece_jointe_url || null,
      point_critique_id: item.point_critique_id,
      user_id: item.user_id,
    }
  })
}

const { data: pointsCritiques, loading, error, refresh } = useApi('/point-critique-user', {
  transform: transformPointsCritiques,
  immediate: true,
})

const filteredColumns = computed(() => {
  return columns.map(column => {
    if (column.key === 'date_fin') {
      const allActive = pointsCritiques.value?.every(point => point.statut === true)
      
      return {
        ...column,
        visible: !allActive,
        cellClass: (item) => item.statut === true ? 'opacity-50' : ''
      }
    }
    return column
  })
})

// Gestion fichier dans le modal
const handleEditFileChange = (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  
  // Validation
  if (file.size > 5 * 1024 * 1024) {
    useToast().add({ title: 'Fichier invalide', description: 'Le fichier ne doit pas dépasser 5 Mo', color: 'red' })
    return
  }
  
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/jpg', 'image/png']
  if (!allowedTypes.includes(file.type)) {
    useToast().add({ title: 'Fichier invalide', description: 'Format non autorisé (PDF, Word, JPG, PNG)', color: 'red' })
    return
  }
  
  editForm.value.newFile = file
}

const removeEditFile = () => {
  editForm.value.newFile = null
  if (editFileInputRef.value) editFileInputRef.value.value = ''
}

// Fonctions du modal
const closeEditModal = () => {
  showEditModal.value = false
  selectedItem.value = null
  editForm.value = { date_fin: '', statut: false, newFile: null }
  editError.value = null
  if (editFileInputRef.value) editFileInputRef.value.value = ''
}

const submitEdit = async () => {
  if (!selectedItem.value) return

  if (selectedItem.value.statut && !editForm.value.date_fin) {
    editError.value = 'La date de fin est requise pour désactiver l\'assignation'
    return
  }

  if (selectedItem.value.statut && editForm.value.date_fin) {
    const dateDebut = selectedItem.value.date_debut ? new Date(selectedItem.value.date_debut) : null
    const dateFin = new Date(editForm.value.date_fin)
    
    if (dateDebut && dateFin < dateDebut) {
      editError.value = 'La date de fin doit être postérieure ou égale à la date de début'
      return
    }
  }

  submitting.value = true
  editError.value = null

  try {
    const config = useRuntimeConfig()
    const getToken = () => {
      if (process.client) {
        return useCookie('auth_token').value || localStorage.getItem('auth_token') || ''
      }
      return useCookie('auth_token').value || ''
    }
    

    // Utiliser FormData pour envoyer le fichier
    const formData = new FormData()
    formData.append('statut', !selectedItem.value.statut ? '1' : '0')
    
    if (selectedItem.value.statut && editForm.value.date_fin) {
      formData.append('date_fin', editForm.value.date_fin)
    } else if (!selectedItem.value.statut) {
      formData.append('date_fin', '') // Supprimer la date de fin lors de la réactivation
    }
    
    // Ajouter le fichier si présent
    if (editForm.value.newFile instanceof File) {
      formData.append('piece_jointe', editForm.value.newFile)
      console.log('📎 Nouveau fichier ajouté:', editForm.value.newFile.name)
    }

    // Utiliser _method pour simuler PUT avec FormData
    formData.append('_method', 'PUT')

    console.log('📤 Envoi de la mise à jour...')

    const response = await $fetch(`/point-critique-user/${selectedItem.value.id}`, {
      baseURL: config.public.apiBase,
      method: 'POST', // Utiliser POST avec _method=PUT pour FormData
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Accept': 'application/json',
        // Ne pas définir Content-Type, laissez le navigateur le faire
      },
      body: formData
    })

    console.log('✅ Réponse de mise à jour:', response)

    useToast().add({
      title: "Succès",
      description: selectedItem.value.statut 
        ? "Assignation désactivée avec succès" 
        : "Assignation réactivée avec succès",
      color: "green",
    })

    closeEditModal()
    refresh()

  } catch (err) {
    console.error('❌ Erreur lors de la mise à jour:', err)

    let errorMessage = "Erreur lors de la mise à jour de l'assignation"

    if (err.status === 401 || err.statusCode === 401) {
      errorMessage = "Session expirée. Veuillez vous reconnecter."
    } else if (err.status === 422 || err.statusCode === 422) {
      if (err.data?.errors) {
        errorMessage = Object.values(err.data.errors).flat().join(', ')
      } else {
        errorMessage = err.data?.message || errorMessage
      }
    } else if (err.data?.message) {
      errorMessage = err.data.message
    }

    editError.value = errorMessage

    useToast().add({
      title: "Erreur",
      description: errorMessage,
      color: "red",
    })
  } finally {
    submitting.value = false
  }
}

// Handlers
const onView = (item) => {
  console.log('👁️ Voir assignation :', item)
  navigateTo(`/point-critique/assignment/${item.id}`)
}

const onEdit = (item) => {
  console.log('✏️ Éditer assignation :', item)
  selectedItem.value = { ...item }
  editForm.value = {
    date_fin: item.date_fin ? item.date_fin.split('T')[0] : '',
    statut: !item.statut,
    newFile: null
  }
  showEditModal.value = true
}

const onSelectionChange = (ids) => {
  console.log('📋 Sélection mise à jour :', ids)
}

watch(pointsCritiques, (newData) => {
  console.log('✅ Assignations chargées:', newData?.length || 0)
  if (newData && newData.length > 0) {
    console.log('📋 Premier élément:', newData[0])
  }
})
</script>