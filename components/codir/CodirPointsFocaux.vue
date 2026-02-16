<template>
  <div class="bg-slate-50 dark:bg-slate-950 mb-2">
      <div class="flex justify-center gap-24 mb-16 relative">
         </div>

      <UCard :ui="{ body: { padding: 'p-8 md:p-12' } }" class="rounded-[2.5rem] shadow-2xl border-none">
        <div class="mb-10">
          <h2 class="text-3xl font-black text-slate-800 dark:text-white">Points Focaux</h2>
          <p class="text-gray-400 font-medium">Étape 2 sur 3 : Élaboration de l'ordre du jour et assignation multi-responsables.</p>
        </div>

        <div class="space-y-4">
          <CodirAgendaItem title="Analyse de la performance Q3" />
          
          <CodirAgendaItem title="" is-new />
        </div>

        <div class="flex justify-center mt-8">
          <UButton 
            size="xl"
            class="rounded-2xl px-8 py-4 font-bold bg-gradient-to-r from-blue-600 to-emerald-500 hover:shadow-lg transition-all"
            icon="i-heroicons-check-badge"
          >
            Ajouter un point à l'ordre du jour
          </UButton>
        </div>
        
        <div class="flex justify-center gap-2 mt-8">
          <span class="w-1.5 h-1.5 rounded-full bg-gray-200" />
          <span class="w-8 h-1.5 rounded-full bg-emerald-500" />
          <span class="w-1.5 h-1.5 rounded-full bg-gray-200" />
        </div>
      </UCard>
  </div>
</template>

<script setup>

</script>