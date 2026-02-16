<script setup lang="ts">
// Données de test (à remplacer par ton store Pinia ou ton state global)
const tasks = ref([
  {
    id: 1,
    task: 'Préparation du tableau de bord KPIs',
    assignees: [
      { name: 'Jean Dupont', initials: 'JD' },
      { name: 'Marie Curie', initials: 'MC' }
    ],
    dueDate: '20/11/2023',
    status: 'En cours'
  },
  {
    id: 2,
    task: 'Analyse des retours clients Q3',
    assignees: [{ name: 'Marie Curie', initials: 'MC' }],
    dueDate: '25/11/2023',
    status: 'À faire'
  }
]);

const columns = [
  { key: 'task', label: 'NOM DE LA TÂCHE' },
  { key: 'assignees', label: 'RESPONSABLES' },
  { key: 'dueDate', label: 'ÉCHÉANCE' },
  { key: 'status', label: 'STATUT' },
  { key: 'actions', label: '' }
];
</script>

<template>
  <div class="bg-slate-50 dark:bg-slate-950 p-6">

    <UCard :ui="{ body: { padding: 'p-0' } }" class="max-w-6xl mx-auto rounded-[1.6rem] overflow-hidden shadow-2xl border-none">

      <DataTable 
        
        :rows="tasks" 
        :columns="columns"
        :ui="{ 
          thead: 'bg-gray-50/50 dark:bg-slate-800/50',
          tr: { base: 'hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors' }
        }"
      >
        <template #task-data="{ row }">
          <span class="font-bold text-slate-700 dark:text-slate-200">{{ row.task }}</span>
        </template>

        <template #assignees-data="{ row }">
          <div class="flex -space-x-2">
            <UTooltip v-for="user in row.assignees" :key="user.name" :text="user.name">
              <UAvatar
                :alt="user.name"
                size="sm"
                class="ring-2 ring-white dark:ring-slate-900 shadow-sm"
                :ui="{ background: 'bg-primary-100 dark:bg-primary-900', text: 'text-primary-600 text-[10px]' }"
              />
            </UTooltip>
          </div>
        </template>

        <template #status-data="{ row }">
          <UBadge 
            :color="row.status === 'En cours' ? 'orange' : 'gray'" 
            variant="flat" 
            size="xs" 
            class="rounded-full px-3 font-bold uppercase tracking-wider text-[9px]"
          >
            {{ row.status }}
          </UBadge>
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="[[{ label: 'Modifier', icon: 'i-heroicons-pencil-square' }, { label: 'Supprimer', icon: 'i-heroicons-trash', color: 'red' }]]">
            <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal" />
          </UDropdown>
        </template>
      </DataTable>

      <div class="p-8 bg-gray-50/50 dark:bg-slate-900/50 flex justify-between items-center italic text-sm text-gray-500">
        <span>Total : {{ tasks.length }} tâches assignées</span>
        <div class="flex gap-4">
          <span class="flex items-center gap-1"><div class="w-2 h-2 rounded-full bg-orange-400" /> En cours</span>
          <span class="flex items-center gap-1"><div class="w-2 h-2 rounded-full bg-gray-300" /> À faire</span>
        </div>
      </div>
    </UCard>
  </div>
</template>