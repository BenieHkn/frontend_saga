<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
    <PageHeader title="Modifier l'affectation" description="Mettez à jour les informations de cette affectation" />

    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="text-center">
        <Icon name="svg-spinners:ring-resize" class="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <p class="text-slate-600">Chargement de l'affectation...</p>
      </div>
    </div>

    <div v-else-if="affectation" class="px-6 pb-12">
      <!-- Grille 2 colonnes -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Colonne 1 : Informations du courrier (fixe) -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-6">
            <div class="flex items-center gap-2 px-4 py-3 border-b border-slate-100"
              style="background: linear-gradient(to right, #eff6ff, #f8fafc);">
              <div class="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center">
                <Icon name="i-heroicons-inbox-arrow-down" class="w-3.5 h-3.5 text-blue-600" />
              </div>
              <span class="text-[11px] font-bold text-blue-800 uppercase tracking-widest">Courrier associé</span>
            </div>
            <div class="p-4 space-y-3">
              <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Référence</p>
                <p class="text-sm font-bold text-slate-800">{{ affectation.reference_courrier || 'Sans référence' }}</p>
              </div>
              <div v-if="affectation.numero_enreg">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">N° Enreg.</p>
                <p class="text-sm font-mono font-semibold text-slate-800">{{ affectation.numero_enreg }}</p>
              </div>
              <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Objet</p>
                <p class="text-sm text-slate-700 leading-relaxed line-clamp-3">{{ affectation.objet_courrier || 'Non spécifié' }}</p>
              </div>
              <div class="pt-3 border-t border-slate-200">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Statut</p>
                <span class="inline-flex items-center px-2 py-1 text-[11px] font-bold rounded-full uppercase"
                  :class="{
                    'bg-blue-100 text-blue-700 border border-blue-200': affectation.statut === 'en_cours',
                    'bg-green-100 text-green-700 border border-green-200': affectation.statut === 'clos',
                    'bg-slate-100 text-slate-700 border border-slate-200': !affectation.statut,
                  }">
                  {{ getStatutLabel(affectation.statut) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Colonne 2-3 : Formulaire d'édition -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="flex items-center gap-2 px-6 py-4 border-b border-slate-100"
              style="background: linear-gradient(to right, #eff6ff, #f8fafc);">
              <div class="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center">
                <Icon name="i-heroicons-pencil-square" class="w-3.5 h-3.5 text-blue-600" />
              </div>
              <span class="text-[11px] font-bold text-blue-800 uppercase tracking-widest">Modifications</span>
            </div>

            <div class="p-6 space-y-6">
              <!-- Instructions/Annotations -->
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">
                  <Icon name="i-heroicons-document-text" class="w-4 h-4 inline mr-1" />
                  Instructions / Annotations
                </label>
                <textarea v-model="editData.instructions" rows="6"
                  placeholder="Mettez à jour les annotations ou les consignes..."
                  class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none" />
                <p class="text-xs text-slate-500 mt-1">Décrivez les instructions supplémentaires pour le destinataire.</p>
              </div>

              <!-- Date de retour attendue -->
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">
                  <Icon name="i-heroicons-calendar-days" class="w-4 h-4 inline mr-1" />
                  Date de retour attendue
                </label>
                <input v-model="editData.date_retour_attendue" type="date"
                  class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
              </div>

              <!-- Priorité -->
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">
                  <Icon name="i-heroicons-flag" class="w-4 h-4 inline mr-1" />
                  Priorité
                </label>
                <select v-model="editData.priorite"
                  class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white">
                  <option value="">— Sélectionner une priorité —</option>
                  <option value="basse">Basse</option>
                  <option value="normale">Normale</option>
                  <option value="haute">Haute</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>

              <!-- Destinataire actuel (lecture seule) -->
              <div class="p-4 bg-blue-50/50 rounded-lg border border-blue-200">
                <p class="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Destinataire actuel</p>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Icon name="i-heroicons-user" class="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p class="text-sm font-bold text-slate-800">{{ affectation.destinataire?.nom || '—' }}</p>
                    <p class="text-xs text-slate-600">{{ affectation.destinataire?.fonction }}</p>
                  </div>
                </div>
              </div>

              <!-- TODO: Édition complète (destinataire, délai, etc.) sera implémentée plus tard -->
            </div>

            <!-- Action buttons -->
            <div class="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
              <button @click="handleDelete"
                :disabled="submitting || isDeleteDisabled"
                class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <Icon name="i-heroicons-trash" class="w-4 h-4" />
                {{ isDeleteDisabled ? 'Impossible de supprimer' : 'Annuler cette affectation' }}
              </button>

              <div class="flex gap-3 ml-auto">
                <UButton @click="handleGoBack" color="gray" variant="outline" size="lg">
                  Retour
                </UButton>
                <UButton @click="handleSubmit"
                  :disabled="submitting || !isDataChanged"
                  :loading="submitting" size="lg" icon="i-heroicons-check"
                  class="bg-gradient-to-br from-emerald-600 to-blue-600 text-white">
                  {{ submitting ? 'Mise à jour en cours...' : 'Mettre à jour' }}
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="flex justify-center items-center py-12">
      <div class="text-center">
        <Icon name="i-heroicons-exclamation-triangle" class="w-12 h-12 text-red-600 mx-auto mb-4" />
        <p class="text-slate-600 mb-4">Affectation non trouvée</p>
        <UButton to="/affectations" color="gray" variant="outline">Retour à la liste</UButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '~/composables/auth/useAuth'
import PageHeader from '~/components/PageHeader.vue'
import Swal from 'sweetalert2'

const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()
const toast = useToast()
const { getEmetteurId } = useAuth()

useHead({ title: 'Modifier l\'affectation' })

const affectation = ref(null)
const loading = ref(true)
const submitting = ref(false)

const editData = reactive({
  instructions: '',
  date_retour_attendue: '',
  priorite: '',
})

onMounted(async () => {
  await loadAffectation()
})

const loadAffectation = async () => {
  try {
    loading.value = true
    const response = await $fetch(`/api/affectations/${route.params.id}`, {
      headers: {
        Authorization: `Bearer ${useCookie('token').value}`,
      },
    })
    affectation.value = response.data || response
    
    // Initialize edit data with current values
    // Mapper delai_traitement → date_retour_attendue et priority → priorite
    editData.instructions = affectation.value.instructions || ''
    editData.date_retour_attendue = affectation.value.delai_traitement || ''
    editData.priorite = affectation.value.priority || ''
  } catch (error) {
    console.error('Error loading affectation:', error)
    toast.add({
      title: 'Erreur',
      description: 'Impossible de charger l\'affectation',
      color: 'red',
    })
  } finally {
    loading.value = false
  }
}

const isDataChanged = computed(() => {
  return (
    editData.instructions !== (affectation.value?.instructions || '') ||
    editData.date_retour_attendue !== (affectation.value?.delai_traitement || '') ||
    editData.priorite !== (affectation.value?.priority || '')
  )
})

const isDeleteDisabled = computed(() => {
  return affectation.value?.statut === 'en_cours'
})

const getStatutLabel = (statut) => {
  const labels = {
    'en_cours': 'En cours',
    'clos': 'Clôturée',
    'en_attente': 'En attente',
  }
  return labels[statut] || statut || 'Non défini'
}

const handleSubmit = async () => {
  try {
    submitting.value = true
    
    await $fetch(`/api/affectations/${route.params.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${useCookie('token').value}`,
      },
      body: {
        instructions: editData.instructions,
        date_retour_attendue: editData.date_retour_attendue,
        priorite: editData.priorite,
      },
    })

    toast.add({
      title: 'Succès',
      description: 'L\'affectation a été mise à jour avec succès',
      color: 'green',
    })

    await router.push('/affectations')
  } catch (error) {
    console.error('Error updating affectation:', error)
    toast.add({
      title: 'Erreur',
      description: error.data?.message || 'Impossible de mettre à jour l\'affectation',
      color: 'red',
    })
  } finally {
    submitting.value = false
  }
}

const handleDelete = async () => {
  const result = await Swal.fire({
    title: 'Confirmer la suppression',
    text: 'Êtes-vous sûr de vouloir annuler cette affectation ? Cette action est irréversible.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Oui, annuler',
    cancelButtonText: 'Non, conserver',
  })

  if (result.isConfirmed) {
    await deleteAffectation()
  }
}

const deleteAffectation = async () => {
  try {
    submitting.value = true

    await $fetch(`/api/affectations/${route.params.id}/cancel`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${useCookie('token').value}`,
      },
    })

    toast.add({
      title: 'Succès',
      description: 'L\'affectation a été annulée',
      color: 'green',
    })

    await router.push('/affectations')
  } catch (error) {
    console.error('Error cancelling affectation:', error)
    toast.add({
      title: 'Erreur',
      description: error.data?.message || 'Impossible d\'annuler l\'affectation',
      color: 'red',
    })
  } finally {
    submitting.value = false
  }
}

const handleGoBack = () => {
  router.push('/affectations')
}
</script>
