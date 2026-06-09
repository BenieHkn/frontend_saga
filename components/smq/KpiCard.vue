<template>
  <div class="qp-kpi">
    <div class="qp-kpi__label">{{ label }}</div>
    <div class="qp-kpi__value" :style="valueColor ? { color: valueColor } : {}">
      <slot name="value">{{ value }}</slot>
    </div>
    <div v-if="progress !== undefined" class="qp-progress" style="margin-top: 14px">
      <div
        class="qp-progress__bar"
        :style="{ width: `${progress}%`, background: progressColor || 'var(--qp-primary-500)' }"
      />
    </div>
    <div v-else-if="delta" class="qp-kpi__delta" :class="deltaClass">
      <Icon :name="deltaIcon" style="width:14px;height:14px" />
      {{ delta }}
    </div>
    <div v-else-if="subtext" class="qp-kpi__delta" style="color: var(--qp-fg-3)">
      {{ subtext }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  label:         { type: String, required: true },
  value:         { type: [String, Number], default: '' },
  valueColor:    { type: String, default: '' },
  delta:         { type: String, default: '' },
  deltaType:     { type: String, default: '' },   // 'up' | 'down'
  subtext:       { type: String, default: '' },
  progress:      { type: Number, default: undefined },
  progressColor: { type: String, default: '' },
})

const deltaClass = computed(() => props.deltaType === 'up' ? 'up' : props.deltaType === 'down' ? 'down' : '')
const deltaIcon  = computed(() => props.deltaType === 'up' ? 'heroicons:arrow-up-right' : 'heroicons:arrow-down-right')
</script>
