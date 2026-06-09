<template>
  <div class="qp-stepper">
    <div
      v-for="(step, i) in steps"
      :key="i"
      class="qp-step"
      :class="{ done: i < currentIndex, now: i === currentIndex }"
    >
      <span class="qp-step__dot">
        <Icon v-if="i < currentIndex" name="heroicons:check" style="width:14px;height:14px" />
        <span v-else>{{ i + 1 }}</span>
      </span>
      <span class="qp-step__label">{{ step }}</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  steps:        { type: Array, default: () => ['Configuration', 'Saisie', 'Validation', 'Transmis MG'] },
  currentStep:  { type: String, default: '' },    // nom de l'étape courante
  currentIndex: { type: Number, default: 1 },     // index 0-based de l'étape courante
})

const currentIndex = computed(() => {
  if (props.currentStep) {
    const idx = props.steps.findIndex(s => s.toLowerCase() === props.currentStep.toLowerCase())
    return idx >= 0 ? idx : props.currentIndex
  }
  return props.currentIndex
})
</script>
