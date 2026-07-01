<template>
  <div class="qp-kpi" :class="colorClass">
    <!-- Icône bulle -->
    <div v-if="icon" class="qp-kpi__icon-wrap" :class="`qp-kpi__icon-wrap--${color}`">
      <Icon :name="icon" class="qp-kpi__icon" />
    </div>

    <div class="qp-kpi__body">
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
  icon:          { type: String, default: '' },
  color:         { type: String, default: 'navy' }, // navy | primary | success | danger | warning | teal
})

const colorClass = computed(() => `qp-kpi--${props.color}`)
const deltaClass = computed(() => props.deltaType === 'up' ? 'up' : props.deltaType === 'down' ? 'down' : '')
const deltaIcon  = computed(() => props.deltaType === 'up' ? 'heroicons:arrow-up-right' : 'heroicons:arrow-down-right')
</script>

<style scoped>
.qp-kpi {
  background: #fff;
  border: 1px solid var(--qp-border-1);
  border-radius: 14px;
  padding: 20px 20px 20px 22px;
  box-shadow: 0 2px 8px rgba(15,27,45,.06), 0 1px 2px rgba(15,27,45,.04);
  display: flex;
  align-items: flex-start;
  gap: 16px;
  transition: box-shadow 180ms ease, transform 180ms ease;
  border-left: 4px solid transparent;
  position: relative;
  overflow: hidden;
}
.qp-kpi::after {
  content: '';
  position: absolute;
  top: 0; right: 0;
  width: 80px; height: 80px;
  border-radius: 50%;
  opacity: 0.04;
  transform: translate(20px, -20px);
}

/* Hover */
.qp-kpi:hover {
  box-shadow: 0 6px 18px rgba(15,27,45,.10), 0 2px 4px rgba(15,27,45,.06);
  transform: translateY(-2px);
}

/* Variantes couleurs */
.qp-kpi--navy    { border-left-color: var(--qp-navy-500);    }
.qp-kpi--navy::after    { background: var(--qp-navy-500); }
.qp-kpi--primary { border-left-color: var(--qp-primary-500); }
.qp-kpi--primary::after { background: var(--qp-primary-500); }
.qp-kpi--success { border-left-color: var(--qp-success-500); }
.qp-kpi--success::after { background: var(--qp-success-500); }
.qp-kpi--danger  { border-left-color: var(--qp-danger-500);  }
.qp-kpi--danger::after  { background: var(--qp-danger-500); }
.qp-kpi--warning { border-left-color: var(--qp-warning-500); }
.qp-kpi--warning::after { background: var(--qp-warning-500); }
.qp-kpi--teal    { border-left-color: var(--qp-teal-500);    }
.qp-kpi--teal::after    { background: var(--qp-teal-500); }

/* Icône bulle */
.qp-kpi__icon-wrap {
  flex: none;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.qp-kpi__icon-wrap--navy    { background: var(--qp-navy-50);    color: var(--qp-navy-600); }
.qp-kpi__icon-wrap--primary { background: var(--qp-primary-50); color: var(--qp-primary-600); }
.qp-kpi__icon-wrap--success { background: var(--qp-success-50); color: var(--qp-success-600); }
.qp-kpi__icon-wrap--danger  { background: var(--qp-danger-50);  color: var(--qp-danger-600); }
.qp-kpi__icon-wrap--warning { background: var(--qp-warning-50); color: var(--qp-warning-600); }
.qp-kpi__icon-wrap--teal    { background: var(--qp-teal-50);    color: var(--qp-teal-600, var(--qp-teal-700)); }
.qp-kpi__icon { width: 22px; height: 22px; }

.qp-kpi__body  { flex: 1; min-width: 0; }
.qp-kpi__label {
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--qp-fg-3);
}
.qp-kpi__value {
  font-family: ui-monospace, monospace;
  font-weight: 700;
  font-size: 2rem;
  color: var(--qp-fg-1);
  line-height: 1;
  margin-top: 8px;
  font-variant-numeric: tabular-nums;
}
.qp-kpi__delta {
  font-size: 0.8125rem;
  font-weight: 600;
  margin-top: 8px;
  display: inline-flex;
  gap: 4px;
  align-items: center;
}
.qp-kpi__delta.up   { color: var(--qp-success-600); }
.qp-kpi__delta.down { color: var(--qp-danger-600); }
</style>
