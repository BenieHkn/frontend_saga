<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

// Gestion propre du v-model synchrone avec le parent
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>

<template>
  <UModal v-model="isOpen">
    <div class="p-6">
      <div class="flex items-center gap-3 mb-4">
        <div class="p-2 bg-primary-50 dark:bg-primary-950 rounded-lg text-primary-500">
          <UIcon name="i-heroicons-document-arrow-down" class="w-6 h-6" />
        </div>
        <div>
          <h3 class="text-base font-semibold text-gray-900 dark:text-white">
            Téléchargement du document
          </h3>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Génération du compte-rendu officiel du CODIR
          </p>
        </div>
      </div>

      <p class="text-sm text-gray-600 dark:text-gray-300 mb-6">
        Voulez-vous vraiment télécharger le document ?
      </p>

      <div class="flex justify-end gap-3">
        <UButton
          label="Annuler"
          color="gray"
          variant="ghost"
          :disabled="loading"
          @click="isOpen = false"
        />
        <UButton
          label="Télécharger"
          color="primary"
          icon="i-heroicons-document-arrow-down"
          :loading="loading"
          @click="emit('confirm')"
        />
      </div>
    </div>
  </UModal>
</template>