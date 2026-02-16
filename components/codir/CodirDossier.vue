<script setup>
const props = defineProps({
  dossier: {
    type: Object,
    required: true
  }
})
const store = useCodirsStore()
</script>

<template>
  <div class="relative pl-8 pb-12 last:pb-0 border-l-2 border-dashed border-gray-200 dark:border-gray-800 ml-4">
    <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-white dark:border-slate-900 shadow-sm"
      :class="isNew ? 'bg-gray-300' : 'bg-blue-500'" />

    <div class="flex items-center justify-between mb-6">
      <h3 v-if="!isNew" class="text-xl font-bold text-slate-800 dark:text-white">{{ dossier.title }}</h3>
      <input v-else type="text" placeholder="Nouveau point focal..."
        class="text-xl font-bold bg-transparent border-none p-0 focus:ring-0 placeholder:text-gray-300 w-full" />
      <UButton v-if="dossier.taches.length === 0" color="gray" variant="ghost" icon="i-heroicons-trash" class="text-gray-400" />
    </div>

    <div class="space-y-6">
      <div v-if="dossier.taches.length > 0">
        <div class="flex items-center gap-2 mb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <UIcon name="i-heroicons-check-circle" class="text-blue-500 text-sm" />
          Actions & Tâches
        </div>

        <div v-for="task in tasks" :key="task.id" class="group">
          <CodirTaskForm />
        </div>
      </div>

      <UButton variant="ghost" icon="i-heroicons-plus-circle"
        class="font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
        @click="">
        Ajouter une tâche
      </UButton>
    </div>
  </div>
</template>