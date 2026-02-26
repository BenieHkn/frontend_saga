<script setup>
import { useCodirsStore } from '@/stores/codirs'
import { useToast } from '#imports'
import { ref } from 'vue'

const props = defineProps({
  dossier: { type: Object, required: true },
})

const emit = defineEmits(['deleted', 'click'])

const codirStore = useCodirsStore()
const toast = useToast()

// Modal de confirmation
const showDeleteModal = ref(false)

const removeDossier = async () => {
  showDeleteModal.value = true
}

const clickDossier = () => {
  emit('click', props.dossier)
}

const confirmDelete = async () => {
  showDeleteModal.value = false
  
  try {
    await codirStore.removeDossier(codirStore.currentOrdreDuJour.id, props.dossier.id)
    
    toast.add({
      title: 'Dossier supprimé',
      description: `"${props.dossier.libelle}" a été supprimé avec succès`,
      color: 'green',
      icon: 'i-heroicons-check-circle',
    })
    
    emit('deleted', props.dossier.id)
  } catch {
    toast.add({
      title: 'Erreur',
      description: 'Impossible de supprimer le dossier',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
    })
  }
}

const cancelDelete = () => {
  showDeleteModal.value = false
  toast.add({
    title: 'Suppression annulée',
    description: `La suppression du dossier "${props.dossier.libelle}" a été annulée`,
    color: 'gray',
    icon: 'i-heroicons-x-circle',
    timeout: 2000,
  })
}
</script>

<template>
  <div class="flex items-center gap-3 bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/80 transition-colors" @click="clickDossier">
    <div class="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-950/40 flex items-center justify-center shrink-0">
      <UIcon name="i-heroicons-folder" class="w-4 h-4 text-violet-600 dark:text-violet-400" />
    </div>
    <div class="min-w-0 flex-1">
      <p class="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{{ dossier.libelle }}</p>
      <p class="text-xs text-gray-400 mt-0.5">#{{ dossier.id }}</p>
    </div>
    <button @click.stop="removeDossier" class="ml-2 shrink-0" title="Supprimer le dossier">
      <UIcon name="i-heroicons-trash" class="w-4 h-4 text-red-500 hover:text-red-700" />
    </button>
  </div>

  <!-- Modal de confirmation de suppression -->
  <UModal v-model="showDeleteModal">
    <UCard class="rounded-2xl">
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Confirmer la suppression</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Cette action est irréversible</p>
          </div>
        </div>
      </template>
      
      <div class="p-2">
        <p class="text-gray-700 dark:text-gray-300 mb-4">
          Êtes-vous sûr de vouloir supprimer le dossier 
          <span class="font-semibold text-red-600 dark:text-red-400">"{{ dossier.libelle }}"</span> ?
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Cette action supprimera définitivement le dossier et toutes ses données associées.
        </p>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton 
            color="gray" 
            variant="ghost" 
            @click="cancelDelete"
            :disabled="codirStore.loading"
          >
            Annuler
          </UButton>
          <UButton 
            color="red" 
            @click="confirmDelete"
            :loading="codirStore.loading"
          >
            <UIcon name="i-heroicons-trash" class="w-4 h-4 mr-2" />
            Supprimer
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>