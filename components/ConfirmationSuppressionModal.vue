<template>
  <UModal v-model="isOpen" prevent-close>
    <UCard :ui="{ ring: '' }" class="rounded-2xl">
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
            <UIcon
              name="i-heroicons-exclamation-triangle"
              class="w-5 h-5 text-red-600 dark:text-red-400"
            />
          </div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ titre }}</h2>
        </div>
      </template>

      <div class="space-y-4 text-sm text-gray-600 dark:text-gray-300">
        <p>{{ message }}</p>
        <p v-if="details" class="font-medium text-gray-900 dark:text-white">
          {{ details }}
        </p>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton color="gray" variant="ghost" @click="onCancel" type="button">
            {{ cancelLabel }}
          </UButton>
          <UButton
            color="red"
            :loading="loading"
            @click="onConfirm"
            type="button"
          >
            {{ confirmLabel }}
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
  openConfirmationModal: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  titre: { type: String, default: 'Confirmer la suppression' },
  message: {
    type: String,
    default: 'Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.',
  },
  details: { type: String, default: '' },
  confirmLabel: { type: String, default: 'Supprimer' },
  cancelLabel: { type: String, default: 'Annuler' },
})

const emit = defineEmits(['update:openConfirmationModal', 'confirm', 'cancel'])

const isOpen = computed({
  get: () => props.openConfirmationModal,
  set: (val: boolean) => emit('update:openConfirmationModal', val),
})

const onConfirm = () => {
  emit('confirm')
  isOpen.value = false
}

const onCancel = () => {
  emit('cancel')
  isOpen.value = false
}
</script>

<style scoped>
</style>