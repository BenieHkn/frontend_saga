<template>
  <UCard class="bg-white hover:shadow-xl transition-shadow duration-300">
    <div class="text-center">
      <div class="relative w-28 h-28 mx-auto mb-4">
        <svg class="transform -rotate-90 w-28 h-28">
          <circle
            cx="56"
            cy="56"
            r="48"
            stroke="currentColor"
            stroke-width="10"
            fill="transparent"
            class="text-slate-100"
          />
          <circle
            cx="56"
            cy="56"
            r="48"
            stroke="currentColor"
            stroke-width="10"
            fill="transparent"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="offset"
            :class="circleColorClass"
            class="transition-all duration-1000 ease-out"
            stroke-linecap="round"
          />
        </svg>
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-2xl font-black text-slate-900">
            {{ taux }}%
          </span>
        </div>
      </div>
      
      <p class="text-xs font-bold text-slate-500 uppercase tracking-wider">
        {{ label }}
      </p>
      
      <!-- Indicateur de performance -->
      <!-- <div class="mt-3">
        <UBadge
          :color="badgeColor"
          variant="soft"
          size="xs"
        >
          {{ performanceLabel }}
        </UBadge>
      </div> -->
    </div>
  </UCard>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: String,
  taux: Number,
  color: {
    type: String,
    default: 'blue'
  }
})

const circumference = 2 * Math.PI * 48

const offset = computed(() => {
  return circumference - (props.taux / 100) * circumference
})

const colorMap = {
  blue: 'text-blue-500',
  green: 'text-green-500',
  purple: 'text-purple-500',
  indigo: 'text-indigo-500' 
}

const circleColorClass = computed(() => colorMap[props.color] || colorMap.blue)

// Badge couleur selon le taux
const badgeColor = computed(() => {
  if (props.taux >= 80) return 'green'
  if (props.taux >= 60) return 'blue'
  if (props.taux >= 40) return 'amber'
  return 'red'
})

const performanceLabel = computed(() => {
  if (props.taux >= 80) return 'Excellent'
  if (props.taux >= 60) return 'Bon'
  if (props.taux >= 40) return 'Moyen'
  return 'Faible'
})
</script>