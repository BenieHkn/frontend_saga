<template>
  <div class="bg-slate-100 p-6 font-sans">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Liste des fonctions intérims</h1>
        <p class="text-sm text-slate-500">Gestion des fonctions intérims (hors points critiques)</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
      <div class="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <span class="text-sm font-medium">Chargement...</span>
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
    <DataTable v-else :data="interims" :columns="columns" :selectable="false"
      :left-aligned-columns="['code', 'libelle', 'user_name', 'fonction']"
      :show-delete-action="false"
      @edit="onEdit"
      @view="onView">
     
      <!-- Advanced Filters -->
      <template #advanced-filters="{ filters, onFilter }">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="field in [
            { id: 'code', label: 'Code Entité' },
            { id: 'libelle', label: 'Entité' },
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

      <template #cell-fonction="{ value }">
        <span class="inline-flex px-2 py-1 text-[10px] font-semibold rounded bg-blue-50 text-blue-700 border border-blue-100">
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

      <template #cell-is_responsable="{ value }">
        <span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border" :class="{
          'bg-purple-50 text-purple-700 border-purple-100': value === true,
          'bg-slate-100 text-slate-600 border-slate-200': value === false
        }">
          {{ value ? 'Responsable' : 'Agent' }}
        </span>
      </template>

      <template #cell-actif="{ value }">
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
          'text-slate-400 italic': item.actif === true && !value,
          'text-slate-600': value
        }">
          {{ value ? formatDate(value) : 'Non définie' }}
        </span>
      </template>

      <template #cell-piece_jointe_url="{ value }">
        <a v-if="value" :href="value" target="_blank"
          class="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded hover:bg-indigo-100 transition-colors">
          <Icon name="i-heroicons-paper-clip" class="w-3 h-3" />
          Voir
        </a>
        <span v-else class="text-xs text-slate-400 italic">Aucun fichier</span>
      </template>
    </DataTable>

    <!-- Modal de modification -->
    <UModal v-model="showEditModal" :ui="{ width: 'sm:max-w-2xl' }">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-slate-900">
              {{ selectedItem?.actif ? 'Désactiver l\'intérim' : 'Réactiver l\'intérim' }}
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
          <!-- Informations -->
          <div class="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Entité / Fonction
              </label>
              <p class="text-sm font-semibold text-slate-900">
                {{ selectedItem.libelle }} - {{ selectedItem.fonction }}
              </p>
              <p class="text-xs text-slate-600 mt-0.5">
                Code: {{ selectedItem.code }}
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

            <div v-if="selectedItem.piece_jointe_url">
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Pièce jointe
              </label>
              <a :href="selectedItem.piece_jointe_url" target="_blank"
                class="inline-flex items-center gap-2 px-3 py-2 text-sm text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors">
                <Icon name="i-heroicons-paper-clip" class="w-4 h-4" />
                Télécharger
              </a>
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
                'bg-green-50 text-green-700 border-green-100': selectedItem.actif === true,
                'bg-red-50 text-red-700 border-red-100': selectedItem.actif === false
              }">
                {{ selectedItem.actif ? 'Actif' : 'Inactif' }}
              </span>
            </div>
          </div>

          <!-- Formulaire -->
          <div class="space-y-3">
            <div v-if="selectedItem.actif">
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
            </div>

            <div v-else class="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p class="text-sm text-green-800">
                Cette action réactivera l'intérim et supprimera la date de fin.
              </p>
            </div>

            <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p class="text-xs text-blue-800">
                <strong>Action :</strong>
                {{ selectedItem.actif ? 'L\'intérim sera désactivé' : 'L\'intérim sera réactivé' }}
              </p>
            </div>
          </div>

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
              :color="selectedItem?.actif ? 'red' : 'green'"
              @click="submitEdit"
              :loading="submitting"
              :disabled="selectedItem?.actif && !editForm.date_fin"
            >
              {{ selectedItem?.actif ? 'Désactiver' : 'Réactiver' }}
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
import DataTable from '~/components/DataTable.vue'
import { ref, computed, watch } from 'vue'

useHead({
  title: "Intérims - Sagar Revolution",
});

const showEditModal = ref(false)
const selectedItem = ref(null)
const submitting = ref(false)
const editError = ref(null)
const editForm = ref({
  date_fin: '',
  actif: false
})

const columns = [
  { key: 'code', label: 'Code', visible: true },
  { key: 'libelle', label: 'Entité', visible: true },
  { key: 'fonction', label: 'Fonction', visible: true },
  { key: 'user_name', label: 'Agent', visible: true },
  { key: 'matricule', label: 'Matricule', visible: true },
  { key: 'is_responsable', label: 'Type', visible: false },
  { key: 'actif', label: 'Statut', visible: true },
  { key: 'date_debut', label: 'Date début', visible: true },
  { key: 'date_fin', label: 'Date fin', visible: true },
  { key: 'piece_jointe_url', label: 'Fichier', visible: true },
]

const interims = ref([])
const loading = ref(false)
const error = ref(null)

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
    return dateString
  }
}

const loadInterims = async () => {
  loading.value = true
  error.value = null

  try {
    const token = localStorage.getItem('auth_token')
    const config = useRuntimeConfig()

    const response = await $fetch('/entite-users', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })

    console.log('📦 Intérims chargés:', response)

    let dataArray = []
    if (response?.data && Array.isArray(response.data)) {
      dataArray = response.data
    } else if (Array.isArray(response)) {
      dataArray = response
    }

    interims.value = dataArray.map(item => {
      const user = item.user || {}
      const entite = item.entite || {}

      return {
        id: item.id,
        code: entite.code || 'N/A',
        libelle: entite.libelle || 'N/A',
        fonction: entite.fonction || 'N/A',
        user_name: user.nom && user.prenom ? `${user.nom} ${user.prenom}` : 'Non assigné',
        matricule: user.matricule || 'N/A',
        is_responsable: item.is_responsable ?? false,
        actif: item.actif ?? true,
        date_debut: item.date_debut || null,
        date_fin: item.date_fin || null,
        piece_jointe_url: item.piece_jointe_url || null,
        entite_id: item.entite_id,
        user_id: item.user_id,
      }
    })

    console.log('✅ Intérims chargés:', interims.value.length)

  } catch (err) {
    console.error('❌ Erreur chargement intérims:', err)
    error.value = err.message || 'Erreur lors du chargement'

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

const refresh = async () => {
  await loadInterims()
}

onMounted(() => {
  loadInterims()
})

const closeEditModal = () => {
  showEditModal.value = false
  selectedItem.value = null
  editForm.value = { date_fin: '', actif: false }
  editError.value = null
}

const submitEdit = async () => {
  if (!selectedItem.value) return

  if (selectedItem.value.actif && !editForm.value.date_fin) {
    editError.value = 'La date de fin est requise'
    return
  }

  submitting.value = true
  editError.value = null

  try {
    const token = localStorage.getItem('auth_token')
    const config = useRuntimeConfig()

    const formData = new FormData()
    formData.append('actif', !selectedItem.value.actif ? '1' : '0')

    if (selectedItem.value.actif && editForm.value.date_fin) {
      formData.append('date_fin', editForm.value.date_fin)
    } else if (!selectedItem.value.actif) {
      formData.append('date_fin', '')
    }

    formData.append('_method', 'PUT')

    const response = await $fetch(`/entite-user/${selectedItem.value.id}`, {
      baseURL: config.public.apiBase,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: formData
    })

    useToast().add({
      title: "Succès",
      description: selectedItem.value.actif 
        ? "Intérim désactivé avec succès" 
        : "Intérim réactivé avec succès",
      color: "green",
    })

    closeEditModal()
    await loadInterims()

  } catch (err) {
    console.error('❌ Erreur mise à jour:', err)
    editError.value = err.data?.message || "Erreur lors de la mise à jour"

    useToast().add({
      title: "Erreur",
      description: editError.value,
      color: "red",
    })
  } finally {
    submitting.value = false
  }
}

const onView = (item) => {
  navigateTo(`/interims/${item.id}`)
}

const onEdit = (item) => {
  selectedItem.value = { ...item }
  editForm.value = {
    date_fin: item.date_fin ? item.date_fin.split('T')[0] : '',
    actif: !item.actif
  }
  showEditModal.value = true
}
</script>