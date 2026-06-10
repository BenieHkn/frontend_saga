<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  groups: {
    type: Object,
    required: true,
    default: () => ({ valides: [], nonValides: [], exempts: [] })
  }
})

// État local pour masquer/démasquer le bloc
const showValidations = ref(true)
</script>

<template>
  <div class="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-100 dark:border-gray-700 p-6">
    <div v-if="!loading">
      
      <div 
        class="flex items-center justify-between cursor-pointer group mb-4" 
        @click="showValidations = !showValidations"
      >
        <h2 class="text-sm font-semibold text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200 uppercase tracking-wide transition-colors">
          Validation des présences
        </h2>
        <UButton 
          :icon="showValidations ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'" 
          color="gray" 
          variant="ghost" 
          size="sm" 
        />
      </div>

      <div v-show="showValidations" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-4">
          <div class="flex items-center gap-2 mb-3">
            <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-emerald-500" />
            <span class="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
              Validé ({{ groups.valides.length }})
            </span>
          </div>
          <ul v-if="groups.valides.length" class="space-y-1">
            <li v-for="code in groups.valides" :key="code"
              class="text-sm text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 font-medium">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block flex-shrink-0"></span>
              {{ code }}
            </li>
          </ul>
          <p v-else class="text-xs italic text-emerald-600/60 dark:text-emerald-500/50">Aucun</p>
        </div>

        <div class="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4">
          <div class="flex items-center gap-2 mb-3">
            <UIcon name="i-heroicons-clock" class="w-4 h-4 text-amber-500" />
            <span class="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
              En attente ({{ groups.nonValides.length }})
            </span>
          </div>
          <ul v-if="groups.nonValides.length" class="space-y-1">
            <li v-for="code in groups.nonValides" :key="code"
              class="text-sm text-amber-800 dark:text-amber-300 flex items-center gap-1.5 font-medium">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block flex-shrink-0"></span>
              {{ code }}
            </li>
          </ul>
          <p v-else class="text-xs italic text-amber-600/60 dark:text-emerald-500/50">Aucun</p>
        </div>

        <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4">
          <div class="flex items-center gap-2 mb-3">
            <UIcon name="i-heroicons-shield-check" class="w-4 h-4 text-gray-400" />
            <span class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Exempts ({{ groups.exempts.length }})
            </span>
          </div>
          <ul v-if="groups.exempts.length" class="space-y-1">
            <li v-for="code in groups.exempts" :key="code"
              class="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5 font-medium">
              <span class="w-1.5 h-1.5 rounded-full bg-gray-300 inline-block flex-shrink-0"></span>
              {{ code }}
            </li>
          </ul>
          <p v-else class="text-xs italic text-gray-400/60">Aucun</p>
        </div>
      </div>
    </div>

    <div v-else class="flex items-center gap-2 text-sm text-gray-400 py-2">
      <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
      Chargement des présences…
    </div>
  </div>
</template>