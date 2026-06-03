<!-- components/CommentaireModal.vue -->
<script setup>
import { computed } from 'vue'

const props = defineProps({
  openCommentaireModal: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
})

const commentaire = ref('')

const emit = defineEmits(['update:openCommentaireModal', 'commenter'])

const isOpen = computed({
  get: () => props.openCommentaireModal,
  set: (val) => emit('update:openCommentaireModal', val)
})

const handleCommenter = () => {
  emit('commenter', commentaire.value)
  console.log("Commentaire à envoyer :", commentaire.value)
  isOpen.value = false
}
</script>

<template>
  <UModal v-model="isOpen" title="Commentaires" >
    <UCard>
        <template #header>
          <div class="flex items-center justify-between gap-4">
            <h2 class="text-lg font-bold">Ajouter un commentaire</h2>
            <button
              type="button"
              class="text-sm font-medium text-gray-600 hover:text-gray-900"
              @click="isOpen = false"
            >
              Fermer
            </button>
          </div>
        </template>
        <div class="bg-white text-black">
            <form @submit.prevent>
              <UTextarea
                v-model="commentaire"
                label="Votre commentaire"
                type="textarea"
                rows="4">
              </UTextarea>

              <UButton
                :loading = "loading"
                label="Envoyer"
                class="mt-4"
                color="blue"
                variant="soft"
                :disabled="!commentaire.trim()"
                @click = "handleCommenter"
                />
            </form>
        </div>
    </UCard>
  </UModal>
</template>