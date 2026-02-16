<template>
  <UCard class="flex flex-col items-center text-center py-6">
    <div class="relative flex items-center justify-center w-24 h-24 mb-4 mx-auto">
      <svg class="absolute inset-0 w-full h-full -rotate-90">
        <circle class="text-slate-50" cx="48" cy="48" r="40" fill="transparent" stroke="currentColor" stroke-width="8" />
        <circle 
          :class="colorClass" 
          cx="48" cy="48" r="40" 
          fill="transparent" 
          stroke="currentColor" 
          stroke-width="8" 
          stroke-linecap="round"
          :stroke-dasharray="251.2"
          :stroke-dashoffset="offset"
        />
      </svg>
      <UIcon :name="icon" :class="['text-3xl', colorClass]" />
    </div>
    <h3 class="text-3xl font-black text-slate-900">{{ count }}</h3>
    <p class="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">{{ label }}</p>
  </UCard>
</template>

<script setup>
defineProps({
  count: String,
  label: String,
  icon: String,
  colorClass: String,
  offset: Number // Gère le remplissage du cercle
})
</script>