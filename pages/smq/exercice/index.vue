<template>
  <div class="smq-content">
    <SmqPageHeader
      :overline="`Exercices · ${exercices.length} exercice${exercices.length !== 1 ? 's' : ''}`"
      title="Gestion des exercices"
    >
      <button class="qp-btn qp-btn--header-cta" @click="ouvrirModal(null)">
        <Icon name="heroicons:plus" class="h-4 w-4" />
        Créer un exercice
      </button>
    </SmqPageHeader>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="w-8 h-8 border-4 border-slate-200 rounded-full animate-spin" style="border-top-color: var(--qp-primary-500)" />
    </div>

    <!-- Tableau des exercices -->
    <div v-else>
      <UTable
        :rows="exercices"
        :columns="columns"
        :loading="loading"
        :ui="{
          wrapper: 'rounded-lg overflow-hidden border',
          th: { padding: 'px-4 py-3' },
          td: { padding: 'px-4 py-3' },
        }"
      >
        <template #exercice-data="{ row }">
          <div class="flex items-center gap-2.5">
            <div
              class="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold flex-none"
              style="background:var(--qp-primary-50);color:var(--qp-primary-600)"
            >
              {{ row.annee ?? '—' }}
            </div>
            <div class="font-medium text-sm" style="color:var(--qp-fg-1)">
              Exercice {{ row.annee }}
            </div>
          </div>
        </template>

        <template #date_debut-data="{ row }">
          <span class="qp-num text-sm" style="color:var(--qp-fg-2)">
            {{ row.date_debut ? formatDate(row.date_debut) : '—' }}
          </span>
        </template>

        <template #date_fin-data="{ row }">
          <span class="qp-num text-sm" style="color:var(--qp-fg-2)">
            {{ row.date_fin ? formatDate(row.date_fin) : '—' }}
          </span>
        </template>

        <template #actif-data="{ row }">
          <span v-if="row.actif" class="text-sm font-medium" style="color:var(--qp-success-600)">Actif</span>
          <span v-else class="text-sm" style="color:var(--qp-fg-4)">Inactif</span>
        </template>

        <template #actions-data="{ row }">
          <div class="flex items-center gap-1">
            <button
              v-if="!row.actif && !estPasse(row)"
              class="px-2 h-7 rounded text-xs font-medium transition-all"
              style="color:var(--qp-primary-600);background:var(--qp-primary-50)"
              title="Définir comme exercice actif"
              @click="definirActif(row)"
            >
              Activer
            </button>
            <button
              v-if="row.actif"
              class="px-2 h-7 rounded text-xs font-medium transition-all"
              style="color:var(--qp-warning-700);background:var(--qp-warning-50)"
              title="Clôturer cet exercice"
              @click="cloturer(row)"
            >
              Clôturer
            </button>
            <button
              class="w-7 h-7 rounded flex items-center justify-center transition-all"
              style="color:var(--qp-fg-3)"
              title="Modifier"
              @click="ouvrirModal(row)"
            >
              <Icon name="heroicons:pencil-square" class="h-4 w-4" />
            </button>
          </div>
        </template>
      </UTable>
    </div>

    <!-- Modal Création/Modification -->
    <UModal v-model="modalOpen" :ui="{ width: 'sm:max-w-md' }">
      <div class="bg-white rounded-xl overflow-hidden">
        <div class="px-6 py-4 border-b" style="border-color:var(--qp-border-1)">
          <h2 class="font-semibold text-base" style="color:var(--qp-fg-1)">
            {{ exerciceEnCours?.id ? "Modifier l'exercice" : 'Créer un exercice' }}
          </h2>
        </div>
        <div class="p-6 grid gap-4">
          <UFormGroup label="Année" required>
            <UInput
              v-model="form.annee"
              type="number"
              placeholder="Ex. 2026"
              :min="2000"
              :max="2100"
              icon="heroicons:calendar"
            />
          </UFormGroup>
          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Date de début">
              <UInput v-model="form.date_debut" type="date" />
            </UFormGroup>
            <UFormGroup label="Date de fin">
              <UInput v-model="form.date_fin" type="date" />
            </UFormGroup>
          </div>
          <UAlert
            v-if="erreur"
            color="red"
            variant="soft"
            icon="heroicons:exclamation-triangle"
            :title="erreur"
          />
        </div>
        <div class="px-6 py-4 border-t flex justify-end gap-2.5" style="border-color:var(--qp-border-1)">
          <UButton color="gray" variant="soft" @click="modalOpen = false">
            Annuler
          </UButton>
          <UButton
            color="primary"
            :loading="saving"
            :disabled="!form.annee"
            @click="sauvegarder"
          >
            {{ exerciceEnCours?.id ? 'Enregistrer' : 'Créer' }}
          </UButton>
        </div>
      </div>
    </UModal>

    <!-- Modal confirmation suppression -->
    <UModal v-model="confirmModalOpen">
      <div class="bg-white rounded-xl overflow-hidden">
        <div class="px-6 py-4 border-b" style="border-color:var(--qp-border-1)">
          <h2 class="font-semibold text-base" style="color:var(--qp-fg-1)">Confirmer la suppression</h2>
        </div>
        <div class="p-6 text-sm" style="color:var(--qp-fg-2)">
          Supprimer l'exercice {{ confirmExercice?.annee }} ?
          <UAlert
            v-if="confirmExercice?.actif"
            color="orange"
            variant="soft"
            class="mt-3"
            icon="heroicons:exclamation-triangle"
            title="Attention : cet exercice est actif."
          />
        </div>
        <div class="px-6 py-4 border-t flex justify-end gap-2.5" style="border-color:var(--qp-border-1)">
          <UButton color="gray" variant="soft" @click="confirmModalOpen = false">
            Annuler
          </UButton>
          <UButton color="red" :loading="saving" @click="executerSuppression">
            Supprimer
          </UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup>
import { useReferentiels } from '~/composables/smq/useReferentiels'

useHead({ title: 'Exercices — SMQ · SAGA' })

const { fetchExercices, createExercice, updateExercice, deleteExercice, setExerciceActif, cloturerExercice } = useReferentiels()

const loading    = ref(true)
const saving     = ref(false)
const erreur     = ref('')
const exercices  = ref([])

const columns = [
  { key: 'exercice',   label: 'Exercice',    sortable: true },
  { key: 'date_debut', label: 'Date début',  sortable: true },
  { key: 'date_fin',   label: 'Date fin',    sortable: true },
  { key: 'actif',      label: 'Statut',      sortable: true },
  { key: 'actions',    label: 'Actions' },
]

const modalOpen       = ref(false)
const exerciceEnCours = ref(null)
const form = reactive({ annee: new Date().getFullYear(), date_debut: '', date_fin: '' })

const confirmModalOpen = ref(false)
const confirmExercice  = ref(null)

const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' })
}

const charger = async () => {
  loading.value = true
  try { exercices.value = await fetchExercices() }
  catch (e) { console.error('Chargement exercices :', e) }
  finally { loading.value = false }
}

const ouvrirModal = (exercice) => {
  exerciceEnCours.value = exercice
  Object.assign(form, {
    annee:      exercice?.annee      ?? new Date().getFullYear(),
    date_debut: exercice?.date_debut ? exercice.date_debut.substring(0, 10) : '',
    date_fin:   exercice?.date_fin   ? exercice.date_fin.substring(0, 10) : '',
  })
  erreur.value = ''
  modalOpen.value = true
}

const sauvegarder = async () => {
  if (!form.annee) return
  saving.value = true
  erreur.value = ''
  try {
    const payload = {
      annee:      form.annee,
      date_debut: form.date_debut || null,
      date_fin:   form.date_fin   || null,
    }
    if (exerciceEnCours.value?.id) {
      await updateExercice(exerciceEnCours.value.id, payload)
    } else {
      await createExercice(payload)
    }
    modalOpen.value = false
    await charger()
  } catch (e) {
    erreur.value = e?.data?.message || "Erreur lors de l'enregistrement."
  } finally {
    saving.value = false
  }
}

const estPasse = (row) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (row.date_fin) return new Date(row.date_fin) < today
  return (row.annee ?? 0) < today.getFullYear()
}

const cloturer = async (exercice) => {
  saving.value = true
  try {
    await cloturerExercice(exercice.id)
    await charger()
  } catch (e) {
    const data = e?.data ?? e?.response?.data
    if (data?.manquants?.length) {
      const liste = data.manquants.slice(0, 10).map(m => `• ${m}`).join('\n')
      const suite = data.manquants.length > 10 ? `\n… et ${data.manquants.length - 10} autre(s)` : ''
      alert(`${data.message}\n\n${liste}${suite}`)
    } else {
      alert(data?.message ?? 'Erreur lors de la clôture.')
    }
  }
  finally { saving.value = false }
}

const definirActif = async (exercice) => {
  saving.value = true
  try { await setExerciceActif(exercice.id); await charger() }
  catch (e) { console.error('Définition actif :', e) }
  finally { saving.value = false }
}

const confirmerSuppression = (exercice) => {
  confirmExercice.value = exercice
  confirmModalOpen.value = true
}

const executerSuppression = async () => {
  if (!confirmExercice.value) return
  saving.value = true
  try {
    await deleteExercice(confirmExercice.value.id)
    confirmModalOpen.value = false
    confirmExercice.value = null
    await charger()
  } catch (e) {
    console.error('Suppression :', e)
  } finally {
    saving.value = false
  }
}

onMounted(() => charger())
</script>

<style scoped>
.smq-content { }
</style>
                                                                                                                             