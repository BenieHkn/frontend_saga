<script setup>
import StepIndicator from '@/components/StepIndicator.vue'
import { useCodirSteps } from '~/composables/codirs/useCodirSteps'

const props = defineProps({
  codirId: { type: Number, required: true },
  peutGererCodir: { type: Boolean, default: false },
})

const { steps, currentStep, goNext, goPrev, finish, restoreStep } = useCodirSteps(props.codirId)

onMounted(() => restoreStep())
</script>

<template>
  <div>
    <!-- Step Indicator -->
    <div class="mb-8">
      <StepIndicator :currentStep="currentStep" :steps="steps" />
    </div>

    <!-- Contenu de la vue courante -->
    <slot />

    <!-- Navigation -->
    <div class="flex items-center justify-between mt-10 pt-6 border-t border-gray-100 dark:border-gray-800">
      <UButton
        icon="i-heroicons-arrow-left"
        color="gray"
        variant="ghost"
        :disabled="currentStep === 1"
        @click="goPrev"
      >
        Précédent
      </UButton>

      <span class="text-sm text-gray-400">
        Étape {{ currentStep }} sur {{ steps.length }}
      </span>

      <UButton
        v-if="currentStep < steps.length"
        trailing-icon="i-heroicons-arrow-right"
        color="blue"
        @click="goNext"
      >
        Suivant
      </UButton>
      <UButton
        v-else
        trailing-icon="i-heroicons-check"
        color="green"
        @click="finish"
      >
        Terminer
      </UButton>
    </div>
  </div>
</template>