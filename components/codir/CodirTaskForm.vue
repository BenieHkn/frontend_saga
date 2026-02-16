<script setup lang="ts">
const selectedPeople = ref([
  { label: 'Jean Dupont', initials: 'JD', color: 'bg-blue-100 text-blue-600' },
  { label: 'Marie Curie', initials: 'MC', color: 'bg-emerald-100 text-emerald-600' }
]);
</script>

<template>
  <UCard :ui="{ body: { padding: 'p-6' }, ring: 'ring-1 ring-gray-100 dark:ring-gray-800', background: 'bg-white/50 dark:bg-slate-800/30' }" class="rounded-2xl relative">
    <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" class="absolute -right-2 -top-2 scale-75 opacity-0 group-hover:opacity-100 transition-opacity" />
    
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
      <div class="lg:col-span-4">
        <UFormGroup label="NOM DE LA TÂCHE" :ui="{ label: { base: 'text-[9px] font-bold text-gray-400' } }">
          <UInput placeholder="Préparation du tableau..." size="md" />
        </UFormGroup>
      </div>

      <div class="lg:col-span-5">
        <UFormGroup label="RESPONSABLES" :ui="{ label: { base: 'text-[9px] font-bold text-gray-400' } }">
          <div class="flex flex-wrap gap-2 p-1.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-900">
            <div v-for="person in selectedPeople" :key="person.label" class="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium" :class="person.color">
              <span class="w-4 h-4 rounded text-[8px] flex items-center justify-center border border-current opacity-70 font-bold">{{ person.initials }}</span>
              {{ person.label }}
              <UIcon name="i-heroicons-x-mark" class="cursor-pointer" />
            </div>
            <UIcon name="i-heroicons-chevron-down" class="ml-auto text-gray-400" />
          </div>
        </UFormGroup>
      </div>

      <div class="lg:col-span-3">
        <UFormGroup label="ÉCHÉANCE" :ui="{ label: { base: 'text-[9px] font-bold text-gray-400' } }">
          <UInput type="date" icon="i-heroicons-calendar-days" />
        </UFormGroup>
      </div>
    </div>

    <div class="mt-4">
      <UFormGroup label="OBSERVATIONS & NOTES COMPLÉMENTAIRES" :ui="{ label: { base: 'text-[9px] font-bold text-gray-400' } }">
        <UTextarea placeholder="Précisez les détails de la tâche..." :rows="2" variant="outline" />
      </UFormGroup>
    </div>
  </UCard>
</template>