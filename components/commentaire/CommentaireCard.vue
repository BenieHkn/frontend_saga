<script setup>
import { formatDateFR } from "@/composables/codirs/useCodir";

const props = defineProps({
  commentaire: {
    type: Object,
    required: true
  },
  entiteUser: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['edit', 'delete']);

const isAuthor = computed(() => {
  return props.entiteUser?.id === props.commentaire?.entite_user?.id;
});
</script>

<template>
  <div class="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-2">
        <UIcon name="i-heroicons-user-circle" class="w-6 h-6 text-gray-400" />
        <span class="font-medium text-sm text-gray-900 dark:text-white">
          {{ commentaire.entite_user?.user?.nom || 'Utilisateur' }} {{ commentaire.entite_user?.user?.prenom || 'Inconnu' }}
          <span v-if="commentaire.entite_user?.entite" class="text-xs text-gray-500 font-normal ml-1">
            - {{ commentaire.entite_user.entite.code }}
          </span>
        </span>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-xs text-gray-500">
          {{ commentaire.created_at ? formatDateFR(commentaire.created_at) : '' }}
        </span>
        <div v-if="isAuthor" class="flex items-center gap-1">
          <UButton icon="i-heroicons-pencil-square" size="xs" color="gray" variant="ghost" @click="emit('edit', commentaire)" />
          <UButton icon="i-heroicons-trash" size="xs" color="red" variant="ghost" @click="emit('delete', commentaire.id)" />
        </div>
      </div>
    </div>
    <p class="text-sm text-gray-700 dark:text-gray-300 ml-8 whitespace-pre-wrap">
      {{ commentaire.contenu }}
    </p>
  </div>
</template>
