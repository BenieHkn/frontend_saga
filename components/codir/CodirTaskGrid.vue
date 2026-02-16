<script setup lang="ts">
defineProps<{ codir: any }>();
</script>

<template>
  <UCard class="relative rounded-2xl border-none shadow-sm hover:shadow-inner transition-all duration-300 group overflow-hidden bg-gradient-to-br from-green-800 to-blue-800 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-cyan-950/30 hover:scale-[0.97]">
    <!-- Gradient overlay decoratif -->
    <div class="absolute top-0 right-0 w-32 h-32 bg-white  rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
    
    <div class="relative z-10">
      <!-- Header avec badge et action -->
      <div class="flex justify-between items-start mb-5">
        <UBadge 
          color="primary" 
          variant="soft" 
          size="xs" 
          class="rounded-full px-3 py-1 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 text-teal-700 dark:text-teal-300 border border-teal-200/50 dark:border-teal-800/50"
        >
          {{ codir.status }}
        </UBadge>
        <UButton 
          color="white" 
          variant="ghost" 
          icon="i-heroicons-pencil" 
          size="xs" 
          class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-teal-100 dark:hover:bg-teal-900/30" 
        />
      </div>
      
      <!-- Titre de la tâche -->
      <h4 class="font-bold text-xl text-white mb-2 leading-tight text-gray-900 dark:text-black group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:via-teal-600 group-hover:to-cyan-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
        {{ codir.date }}
      </h4>
      
      <!-- Date -->
      <p class="text-xs text-white dark:text-black flex items-center gap-1.5 mb-6">
        <UIcon name="i-heroicons-calendar" class="text-teal-500" />
        {{ codir.date }}
      </p>

      <!-- Footer avec avatars et statut -->
      <div class="flex items-center justify-between pt-4 border-t border-gradient-to-r from-emerald-100/50 via-teal-100/50 to-cyan-100/50 dark:border-teal-800/30">
        
        <!-- Statut actif avec gradient vert-bleu -->
        <div class="flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 px-3 py-1.5 rounded-full border border-teal-200/50 dark:border-teal-800/50">
          <div class="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 animate-pulse shadow-lg shadow-teal-500/50" />
          <span class="text-[10px] font-medium bg-white bg-clip-text text-transparent">{{ codir.status }}</span>
        </div>
      </div>
    </div>
  </UCard>
</template>