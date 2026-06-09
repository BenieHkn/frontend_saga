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

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>

<template>
  <UModal v-model="isOpen">
    <div class="p-6">
      <div class="flex items-center gap-3 mb-4">
        <div class="p-2 bg-red-50 dark:bg-red-950 rounded-lg text-red-500">
          <UIcon name="i-heroicons-lock-closed" class="w-6 h-6" />
        </div>
        <div>
          <h3 class="text-base font-semibold text-gray-950 dark:text-white">
            Clôturer la séance du CODIR
          </h3>
          <p class="text-xs text-red-500 font-medium">
            Cette action est irréversible
          </p>
        </div>
      </div>

      <p class="text-sm text-gray-600 dark:text-gray-300 mb-6">
        En clôturant cette séance, vous figerez définitivement la liste des présences, l'ordre du jour ainsi que les décisions consignées. Plus aucune modification ne sera acceptée sur cette session.
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
          label="Clôturer définitivement"
          color="red"
          icon="i-heroicons-exclamation-triangle"
          :loading="loading"
          @click="emit('confirm')"
        />
      </div>
    </div>
  </UModal>
</template>