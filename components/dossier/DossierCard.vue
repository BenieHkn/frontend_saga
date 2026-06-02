<script setup>
const props = defineProps({
  dossier: { type: Object, required: true },
  peutGererCodir: { type: Boolean, default: false },
  entiteUser: { type: Object, default: null }
})

const emit = defineEmits(['deleted', 'click', 'commenter', 'lire-commentaires'])
const showDeleteModal = ref(false)
const codirStore = ref({ loading: false }) // État local par défaut pour la sécurité

// ✅ Pas d'argument dans l'emit — le parent connaît déjà l'id
const removeDossier = () => {
  showDeleteModal.value = true
}

const clickDossier = () => emit('click', props.dossier)

const cancelDelete = () => {
  showDeleteModal.value = false
}

const confirmDelete = () => {
  emit('deleted')
  showDeleteModal.value = false
}
</script>

<template>
  <div
    class="flex items-center gap-3 bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/80 transition-colors"
    @click="clickDossier">
    
    <div class="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-950/40 flex items-center justify-center shrink-0">
      <UIcon name="i-heroicons-folder" class="w-4 h-4 text-violet-600 dark:text-violet-400" />
    </div>
    
    <div class="min-w-0 flex-1">
      <p class="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{{ dossier.libelle }}</p>
      <p class="text-xs text-gray-400 mt-0.5">#{{ dossier.id }}</p>
    </div>
    
    <div class="flex items-center gap-2 shrink-0">
      
      <div class="relative inline-block">
        <UButton 
          icon="i-heroicons-chat-bubble-bottom-center-text" 
          color="gray" 
          variant="ghost" 
          size="xs"
          title="Lire les commentaires"
          @click.stop="emit('lire-commentaires', dossier)" 
        />
        <span 
          v-if="(dossier.commentaires?.length ?? 0) > 0"
          class="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-4 px-1 flex items-center justify-center pointer-events-none border border-white dark:border-slate-800"
        >
          {{ dossier.commentaires.length }}
        </span>
      </div>

      <div class="relative inline-block">
        <UButton 
          icon="i-heroicons-chat-bubble-left-right" 
          color="blue" 
          variant="ghost" 
          size="xs"
          title="Ajouter un commentaire"
          @click.stop="emit('commenter', dossier)" 
        />
        <div class="absolute -bottom-0.5 -right-0.5 bg-blue-500 rounded-full p-0.5 flex items-center justify-center border border-white dark:border-slate-800 pointer-events-none">
          <UIcon name="i-heroicons-plus" class="w-2 h-2 text-white" />
        </div>
      </div>

      <UButton 
        v-if="peutGererCodir" 
        icon="i-heroicons-trash" 
        color="red" 
        variant="ghost" 
        size="xs"
        class="ml-1" 
        title="Supprimer le dossier"
        @click.stop="removeDossier" 
      />
    </div>
  </div>

  <UModal v-if="peutGererCodir" v-model="showDeleteModal">
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
          <UButton color="gray" variant="ghost" @click="cancelDelete" :disabled="codirStore.loading">
            Annuler
          </UButton>
          <UButton color="red" @click="confirmDelete" :loading="codirStore.loading">
            <UIcon name="i-heroicons-trash" class="w-4 h-4 mr-2" />
            Supprimer
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>