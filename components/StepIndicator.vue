<script setup lang="ts">
defineProps<{
  currentStep: number;
  steps: { label: string; id: number }[];
}>();
</script>

<template>
  <div class="mb-2 relative flex items-center justify-between max-w-2xl mx-auto">
    <div class="absolute top-5 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-800 -z-0" />
    <div 
      v-for="step in steps" 
      :key="step.id"
      class="relative z-10 flex flex-col items-center"
    >
      <div 
        :class="[
          'w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300',
          currentStep === step.id 
            ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' 
            : 'bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-gray-800 text-gray-400'
        ]"
      >
        {{ step.id }}
      </div>
      <span 
        :class="[
          'mt-2 text-[10px] uppercase tracking-widest font-bold',
          currentStep === step.id ? 'text-primary-500' : 'text-gray-400'
        ]"
      >
        {{ step.label }}
      </span>
    </div>
  </div>
</template>