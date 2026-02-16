<template>
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
</script>