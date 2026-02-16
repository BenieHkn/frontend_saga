<script setup lang="ts">
defineProps<{ codir: any }>();
</script>

<template>
  <div class="flex items-center justify-between p-4 bg-white shadow-sm dark:bg-slate-900 border border-gray-100 dark:border-gray-800 rounded-2xl hover:shadow-md transition-shadow">
    <div class="flex items-center gap-4">
      <div class="p-2 bg-gradient-to-r from-green-600 to-blue-600 dark:bg-primary-900/30 rounded-xl">
        <UIcon name="i-heroicons-clipboard-document-list" class="text-white w-5 h-5" />
      </div>
      <div>
        <h4 class="font-bold text-slate-800 dark:text-white">{{ codir.date }}</h4>
        <p class="text-xs text-gray-400 italic">Échéance : {{ codir.date }}</p>
      </div>
    </div>
    
    <div class="flex items-center gap-6">
      <UBadge size="xs" variant="subtle" class="rounded-full">{{ codir.status }}</UBadge>
      <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-vertical" />
    </div>
  </div>
</template>