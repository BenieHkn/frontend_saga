<template>
  <UCard class="paper-card">
    <div class="flex items-center justify-between mb-8">
      <div class="flex flex-col gap-1">
        <h3 class="text-xl font-bold text-slate-900">Monthly Volume Analysis</h3>
        <p class="text-sm text-slate-500 font-medium">Comprehensive flow of incoming vs processed mail</p>
      </div>
      <div class="flex gap-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
        <div class="flex items-center gap-2">
          <div class="size-3 rounded-full bg-blue-500 shadow-sm shadow-blue-500/30"></div>
          <span class="text-xs font-bold text-slate-600">Arrived</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="size-3 rounded-full bg-slate-400 shadow-sm shadow-slate-400/30"></div>
          <span class="text-xs font-bold text-slate-600">Processed</span>
        </div>
      </div>
    </div>

    <div class="relative w-full h-[300px]">
      <svg class="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1100 300">
        <defs>
          <linearGradient id="grad-arrived" x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.15" />
            <stop offset="100%" stop-color="#3b82f6" stop-opacity="0" />
          </linearGradient>
          <linearGradient id="grad-processed" x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" stop-color="#94a3b8" stop-opacity="0.1" />
            <stop offset="100%" stop-color="#94a3b8" stop-opacity="0" />
          </linearGradient>
        </defs>

        <g class="stroke-slate-100" stroke-width="1">
          <line v-for="y in [0, 75, 150, 225, 300]" :key="y" x1="0" x2="1100" :y1="y" :y2="y" />
        </g>

        <path d="M 0 200 C 100 200, 100 170, 200 170 C 300 170, 300 240, 400 240 C 500 240, 500 150, 600 150 C 700 150, 700 190, 800 190 C 900 190, 1000 120, 1100 120 L 1100 300 L 0 300 Z" fill="url(#grad-processed)" />
        <path d="M 0 200 C 100 200, 100 170, 200 170 C 300 170, 300 240, 400 240 C 500 240, 500 150, 600 150 C 700 150, 700 190, 800 190 C 900 190, 1000 120, 1100 120" fill="none" class="stroke-slate-400" stroke-width="3" stroke-linecap="round" />

        <path d="M 0 150 C 100 150, 100 100, 200 100 C 300 100, 300 180, 400 180 C 500 180, 500 60, 600 60 C 700 60, 700 140, 800 140 C 900 140, 1000 40, 1100 40 L 1100 300 L 0 300 Z" fill="url(#grad-arrived)" />
        <path d="M 0 150 C 100 150, 100 100, 200 100 C 300 100, 300 180, 400 180 C 500 180, 500 60, 600 60 C 700 60, 700 140, 800 140 C 900 140, 1000 40, 1100 40" fill="none" class="stroke-blue-500" stroke-width="3" stroke-linecap="round" />

        <circle cx="200" cy="100" r="4.5" class="fill-white stroke-blue-500" stroke-width="2.5" />
        <circle cx="600" cy="60" r="4.5" class="fill-white stroke-blue-500" stroke-width="2.5" />
        <circle cx="1100" cy="40" r="4.5" class="fill-white stroke-blue-500" stroke-width="2.5" />
      </svg>
    </div>

    <div class="flex justify-between mt-6 px-4">
      <span v-for="month in months" :key="month" class="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
        {{ month }}
      </span>
    </div>
  </UCard>
</template>

<script setup>
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
</script>