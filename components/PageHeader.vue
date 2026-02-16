<template>
  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
    <div>
      <h1 class="text-2xl font-bold text-green-900 tracking-tight">
        {{ title }}
      </h1>
      <p v-if="subtitle" class="text-sm text-slate-500">
        {{ subtitle }}
      </p>
    </div>

    <NuxtLink 
      v-if="to" 
      :to="to" 
      class="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-md shadow-indigo-200 hover:translate-y-[-1px] hover:shadow-lg transition-all"
    >
      <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 010-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
      </svg>
      {{ btnText }}
    </NuxtLink>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  to: { type: String, default: null },
  btnText: { type: String, default: 'Nouveau' }
})
</script>