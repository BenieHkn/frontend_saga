<!-- components/commentaire/ListeCommentairesModal.vue -->
<script setup>
import { computed } from 'vue'
const props = defineProps({
  commentaires: { type: Array, default: () => [] },
  openListeCommentairesModal: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  peutModifier: { type: Boolean, default: false },
  peutSupprimer: { type: Boolean, default: false },
  entiteUser: { type: Object, default: null }
})

const emit = defineEmits(['update:openListeCommentairesModal', 'edit', 'delete'])

const isOpen = computed({
  get: () => props.openListeCommentairesModal,
  set: (val) => emit('update:openListeCommentairesModal', val)
})
</script>

<template>
  <UModal v-model="isOpen" title="Liste des commentaires">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between gap-4">
          <h2 class="text-lg font-bold">Commentaires ({{ commentaires.length }})</h2>
          <button
            type="button"
            class="text-sm font-medium text-gray-600 hover:text-gray-900"
            @click="isOpen = false"
          >
            Fermer
          </button>
        </div>
      </template>

      <div class="bg-white dark:bg-slate-800 text-black dark:text-white">
        <!-- Liste vide -->
        <div v-if="commentaires.length === 0" class="py-8 text-center">
          <UIcon name="i-heroicons-chat-bubble-left" class="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p class="text-gray-500 dark:text-gray-400">Aucun commentaire pour le moment</p>
        </div>

        <!-- Liste des commentaires -->
        <div v-else class="space-y-4 max-h-96 overflow-y-auto">
          <!-- on affiche la liste des commentaires -->
          <CommentaireCard
            v-for="(commentaire, index) in commentaires"
            :commentaire="commentaire"
            :entite-user="entiteUser"
            @edit="emit('edit', commentaire)"
            @delete="emit('delete', commentaire.id)"
          /> 
        </div>
      </div>
    </UCard>
  </UModal>
</template>
