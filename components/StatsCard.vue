<template>
  <div class="relative overflow-hidden bg-emerald-600 rounded-2xl p-6 border-t border-l border-blue-400 shadow-xl">
    
    <div class="absolute inset-0 bg-gradient-to-br from-emerald-700  to-blue-800 pointer-events-none"></div>
    
    <div class="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-emerald-800 to-blue-800 blur-3xl rounded-full pointer-events-none"></div>

    <div class="flex  items-center justify-between relative z-10">
      <div class="flex-1">
        <p class="text-xs font-bold uppercase tracking-widest text-white/60 mb-1">
          {{ title }}
        </p>
        
        <p class="text-3xl font-black text-white">
          {{ value }}
        </p>

        <div class="flex items-center mt-3">
          <span 
            :class="[
              'text-xs text-white  font-bold px-2 py-0.5 rounded-full border',
              changeType === 'increase' 
                ? 'bg-white/30 text-emerald-950 border-white/40' 
                : 'bg-red-500/20 text-red-950 border-red-400/20'
            ]"
          >
            {{ change }}
            <span v-if="changeType === 'hold'">
              ↓↓
            </span>
            <span v-else-if="changeType === 'decrease'">
              ↓
            </span>
            <span v-else>
              ↑
            </span>
          </span>
         <div class="text-[12px] ml-2"> {{ infos }}</div>
        </div>
      </div>

      <div class="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-black/10 border border-white/20 shadow-inner">
        <Icon 
          :name="`i-heroicons:${icon}`" 
          class="h-7 w-7 text-white drop-shadow-sm" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: String,
  change: String,
  changeType: {
    type: String,
    default: 'increase'
  },
  icon: String,
  color: String,
  infos: String
})
</script>