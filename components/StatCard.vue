<!-- <template>
  <UCard class="hover:shadow-lg transition-shadow duration-300">
    <div class="flex justify-between items-start">
      <div>
        <p class="text-slate-500 text-xs font-bold uppercase tracking-wider">{{ title }}</p>
        <p class="text-slate-900 text-3xl font-black mt-1">{{ value }}</p>
      </div>
      <div class="p-2.5 rounded-xl bg-primary-500 text-white shadow-md">
        <UIcon :name="icon" class="w-6 h-6" />
      </div>
    </div>
    <div class="flex items-center gap-2 mt-4">
      <span :class="[
        'flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold',
        isUp ? 'text-emerald-600 bg-emerald-50' : 'text-rose-500 bg-rose-50'
      ]">
        <UIcon :name="isUp ? 'i-heroicons-arrow-trending-up' : 'i-heroicons-arrow-trending-down'" class="w-3 h-3" />
        {{ trend }}
      </span>
      <span class="text-slate-400 text-xs font-medium">vs last month</span>
    </div>
  </UCard>
</template>

<script setup>
defineProps(['title', 'value', 'icon', 'trend', 'isUp'])
</script> -->


<template>
  <UCard class="bg-white hover:shadow-xl transition-all duration-300 group">
    <div class="flex justify-between items-start mb-4">
      <div class="flex-1">
        <p class="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
          {{ title }}
        </p>
        <p class="text-4xl font-black text-slate-900 group-hover:scale-105 transition-transform">
          {{ formatNumber(value) }}
        </p>
      </div>
      
      <div 
        class="p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform"
        :class="iconBgClass"
      >
        <UIcon :name="icon" class="w-6 h-6" :class="iconColorClass" />
      </div>
    </div>

    <!-- Details par service -->
    <div v-if="details" class="mt-4 pt-4 border-t border-slate-100">
      <div class="flex items-center gap-2 text-xs">
        <UIcon name="i-heroicons-building-office-2" class="w-3 h-3 text-slate-400" />
        <span class="font-medium text-slate-600">{{ details }}</span>
      </div>
    </div>
  </UCard>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: String,
  value: Number,
  icon: String,
  color: {
    type: String,
    default: 'blue'
  },
  details: String
})

const colorMap = {
  blue: {
    bg: 'bg-blue-500',
    text: 'text-white'
  },
  green: {
    bg: 'bg-green-500',
    text: 'text-white'
  },
  amber: {
    bg: 'bg-amber-500',
    text: 'text-white'
  },
  emerald: {
    bg: 'bg-emerald-500',
    text: 'text-white'
  },
  purple: {
    bg: 'bg-purple-500',
    text: 'text-white'
  },
  indigo: {
    bg: 'bg-indigo-500',
    text: 'text-white'
  }
}

const iconBgClass = computed(() => colorMap[props.color]?.bg || colorMap.blue.bg)
const iconColorClass = computed(() => colorMap[props.color]?.text || colorMap.blue.text)

const formatNumber = (num) => {
  return new Intl.NumberFormat('fr-FR').format(num || 0)
}
</script>