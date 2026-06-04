<script setup>
import { useCodirsStore } from '@/stores/codirs'
import { formatDateFR } from '@/composables/codirs/useCodir'

const codirStore = useCodirsStore()
const toast = useToast()

const dossiers = computed(() => codirStore.currentOrdreDuJour?.dossiers ?? [])

// Modal d'ajout de dossier
const dossierModal = ref(false)
const dossierForm = reactive({ libelle: '' })
const resetDossierForm = () => Object.assign(dossierForm, { libelle: '' })

// Détail de dossier
const selectedDossier = ref(null)
const showDossierDetail = ref(false)

const addDossier = async () => {
  if (!dossierForm.libelle.trim()) return
  
  try {
    await codirStore.addDossier(codirStore.currentOrdreDuJour.id, {
      libelle: dossierForm.libelle.trim()
    })
    
    toast.add({
      title: 'Dossier créé',
      description: `"${dossierForm.libelle}" a été ajouté à l'ordre du jour`,
      color: 'green',
      icon: 'i-heroicons-check-circle',
    })
    
    dossierModal.value = false
    resetDossierForm()
  } catch {
    toast.add({
      title: 'Erreur',
      description: 'Impossible de créer le dossier',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
    })
  }
}

const showDossier = (dossier) => {
  selectedDossier.value = dossier
  showDossierDetail.value = true
}

const closeDossierDetail = () => {
  showDossierDetail.value = false
  selectedDossier.value = null
}

const statutClass = (statut) => {
  const map = {
    actif:   'text-green-600 bg-green-50 dark:bg-green-950/40',
    inactif: 'text-gray-500 bg-gray-100 dark:bg-gray-800/60',
    archivé: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40',
  }
  return map[statut] ?? 'text-gray-500 bg-gray-100'
}

const { peutGererCodir } = useAuth()

const emit = defineEmits(['dossierSelected', 'deleteDossier'])
</script>

<template>
  <div>
    <div v-if="!codirStore.currentOrdreDuJour" class="text-center py-20">
      <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 mx-auto text-amber-400 mb-4" />
      <p class="text-gray-500 text-sm">Sélectionnez un ordre du jour pour voir le détail.</p>
    </div>

    <template v-else>
      <UCard class="rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 mb-6">
        <div class="p-2">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-md">
              <UIcon name="i-heroicons-clipboard-document-list" class="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">
                {{ codirStore.currentOrdreDuJour.libelle }}
              </h1>
              <span :class="`text-xs font-semibold px-2.5 py-1 rounded-full capitalize mt-1 inline-block ${statutClass(codirStore.currentOrdreDuJour.statut)}`">
                {{ codirStore.currentOrdreDuJour.statut }}
              </span>
            </div>
          </div>

          <div class="flex items-center gap-6 mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <UIcon name="i-heroicons-folder" class="w-4 h-4 text-violet-500" />
              <span>
                <strong class="text-gray-800 dark:text-white">{{ dossiers.length }}</strong> dossier(s)
              </span>
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <UIcon name="i-heroicons-building-office" class="w-4 h-4 text-blue-500" />
              <span class="text-xs text-gray-400">
                CODIR du {{ formatDateFR(codirStore.currentCodir?.date) }}
              </span>
            </div>
          </div>
        </div>
      </UCard>

      <section>
        <!-- Vue détaillée du dossier sélectionné -->
        <div v-if="selectedDossier" class="space-y-4">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-base font-semibold flex items-center gap-2">
              <UIcon name="i-heroicons-folder-open" class="text-violet-500" />
              Détails du dossier
            </h2>
            <UButton 
              icon="i-heroicons-arrow-left" 
              color="gray" 
              variant="ghost" 
              size="sm"
              @click="closeDossierDetail"
            >
              Retour à la liste
            </UButton>
          </div>
          
          <DossierDetail 
            :dossier="selectedDossier"
            @close="closeDossierDetail"
          />
        </div>

        <!-- Liste des dossiers -->
        <div v-else>
          <h2 class="text-base font-semibold flex items-center gap-2 mb-3">
            <UIcon name="i-heroicons-folder-open" class="text-violet-500" />
            Dossiers rattachés
            <UBadge color="violet" variant="soft" size="xs">{{ dossiers.length }}</UBadge>
            <UButton icon="i-heroicons-plus" color="blue" variant="soft" @click="dossierModal = true">Ajouter</UButton>
          </h2>

          <div v-if="!dossiers.length"
            class="text-center py-8 text-gray-400 text-sm bg-gray-50 dark:bg-slate-800/50 rounded-xl">
            Aucun dossier rattaché à cet ordre du jour
          </div>

          <div v-else class="flex flex-col gap-2">
            <DossierCard
              v-for="dossier in dossiers"
              :key="dossier.id"
              :dossier="dossier"
              :peut-gerer-codir="peutGererCodir()"
              @click="emit('dossierSelected', (dossier))"
              @delete="emit('deleteDossier', dossier)"
            />
          </div>
        </div>
      </section>
    </template>
  </div>

  <!-- Modal d'ajout de dossier -->
  <UModal v-model="dossierModal">
    <UCard class="rounded-2xl">
      <template #header>
        <h3 class="font-semibold">Ajouter un dossier</h3>
      </template>
      <div class="p-2 flex flex-col gap-4">
        <UFormGroup label="Libellé">
          <UInput v-model="dossierForm.libelle" placeholder="Ex: Budget annuel" size="md" />
        </UFormGroup>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" variant="ghost" @click="dossierModal = false">Annuler</UButton>
          <UButton color="blue" :loading="codirStore.loading" @click="addDossier">Ajouter</UButton>
        </div>
      </template>
    </UCard>
  </UModal>

  <!-- Modal de détail de dossier -->
  <UModal v-model="showDossierDetail" :ui="{ width: 'sm:max-w-2xl' }">
    <DossierDetail 
      v-if="selectedDossier"
      :dossier="selectedDossier"
      @close="closeDossierDetail"
    />
  </UModal>
</template>