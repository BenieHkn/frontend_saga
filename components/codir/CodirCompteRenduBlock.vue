<script setup>
import { formatDateShort } from '@/composables/codirs/useCodir'

defineProps({
  codir: {
    type: Object,
    required: true
  }
})

const getMembresLabel = (membres) =>
  membres?.map(m => `${m.entite_user?.entite?.code ?? ''} `).join(', ') ?? '—'

const taskColumns = [
  { key: 'intitule', label: 'Tâche' },
  { key: 'priorite', label: 'Priorité' },
  { key: 'date_debut', label: 'Début' },
  { key: 'date_fin', label: 'Fin' },
  { key: 'membres', label: 'Responsables' }
]
</script>

<template>
  <div class="bg-white dark:bg-gray-900 shadow-lg rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
    
    <CodirCompteRenduHeader :codir="codir" />

    <div class="p-6 space-y-8">
      <section v-for="(odj, odjIdx) in codir?.ordres_du_jour ?? []" :key="odj?.id">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2 mb-4 flex items-center gap-2">
          <UBadge color="gray" variant="solid" size="sm">{{ odjIdx + 1 }}</UBadge>
          {{ odj?.libelle }}
        </h2>

        <div v-if="odj?.dossiers?.length" class="space-y-6">
          <div v-for="dossier in odj.dossiers" :key="dossier?.id" class="ml-2 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
            <div class="flex items-start gap-2 mb-3">
              <UIcon name="i-heroicons-folder-open" class="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
              <div>
                <span class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Dossier</span>
                <UIcon name="i-heroicons-folder-open" class="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                <span class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ dossier?.libelle }}</span>
              </div>
            </div>

            <div class="ml-2 space-y-4">
              <div v-for="action in dossier?.actions ?? []" :key="action?.id" class="pl-4 border-l border-gray-200 dark:border-gray-700">
                <div class="flex items-start gap-2 mb-2">
                  <UIcon name="i-heroicons-bolt" class="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Action</span>
                    <span class="text-sm text-gray-700 dark:text-gray-300">{{ action?.libelle }}</span>
                  </div>
                </div>

                <div v-if="action?.taches?.length" class="mt-3 ml-5">
                  <div class="flex items-center gap-1.5 mb-2">
                    <UIcon name="i-heroicons-check-circle" class="w-3 h-3 text-emerald-500" />
                    <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Tâches de l'action</span>
                  </div>
                  <UTable :rows="action.taches" :columns="taskColumns" :ui="{ td: { padding: 'py-2 px-3' }, th: { padding: 'py-2 px-3' } }" class="ring-1 ring-gray-200 dark:ring-gray-700 rounded-lg text-xs overflow-hidden">
                    <template #priorite-data="{ row }">
                      <UBadge size="xs" variant="subtle" :color="row?.priorite === 'Haute' ? 'red' : row?.priorite === 'Moyenne' ? 'amber' : 'green'">
                        {{ row?.priorite }}
                      </UBadge>
                    </template>
                    <template #date_debut-data="{ row }">{{ formatDateShort(row?.date_debut) }}</template>
                    <template #date_fin-data="{ row }">{{ formatDateShort(row?.date_fin) }}</template>
                    <template #membres-data="{ row }">{{ getMembresLabel(row?.membres) }}</template>
                  </UTable>
                </div>

                <div v-for="activite in action?.activites ?? []" :key="activite?.id" class="mt-3 ml-5 pl-3 border-l border-dashed border-gray-200 dark:border-gray-700">
                  <div class="flex items-center gap-2 mb-2">
                    <UIcon name="i-heroicons-rectangle-group" class="w-3.5 h-3.5 text-violet-500" />
                    <span class="text-xs font-medium text-gray-700 dark:text-gray-300">{{ activite?.libelle }}</span>
                  </div>
                  <div v-if="activite?.taches?.length" class="ml-5">
                    <UTable :rows="activite.taches" :columns="taskColumns" :ui="{ td: { padding: 'py-2 px-3' }, th: { padding: 'py-2 px-3' } }" class="ring-1 ring-gray-200 dark:ring-gray-700 rounded-lg text-xs overflow-hidden">
                      <template #priorite-data="{ row }">
                        <UBadge size="xs" variant="subtle" :color="row?.priorite === 'Haute' ? 'red' : row?.priorite === 'Moyenne' ? 'amber' : 'green'">
                          {{ row?.priorite }}
                        </UBadge>
                      </template>
                      <template #date_debut-data="{ row }">{{ formatDateShort(row?.date_debut) }}</template>
                      <template #date_fin-data="{ row }">{{ formatDateShort(row?.date_fin) }}</template>
                      <template #membres-data="{ row }">{{ getMembresLabel(row?.membres) }}</template>
                    </UTable>
                  </div>
                </div>
              </div>

              <div v-for="activite in dossier?.activites ?? []" :key="activite?.id" class="pl-4 border-l border-gray-200 dark:border-gray-700">
                <div class="flex items-start gap-2 mb-2">
                  <UIcon name="i-heroicons-rectangle-group" class="w-3.5 h-3.5 text-violet-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Activité</span>
                    <span class="text-sm text-gray-700 dark:text-gray-300">{{ activite?.libelle }}</span>
                  </div>
                </div>
                
                <div v-if="activite?.taches?.length" class="mt-2 ml-5">
                  <UTable :rows="activite.taches" :columns="taskColumns" :ui="{ td: { padding: 'py-2 px-3' }, th: { padding: 'py-2 px-3' } }" class="ring-1 ring-gray-200 dark:ring-gray-700 rounded-lg text-xs overflow-hidden">
                    <template #priorite-data="{ row }">
                      <UBadge size="xs" variant="subtle" :color="row?.priorite === 'Haute' ? 'red' : row?.priorite === 'Moyenne' ? 'amber' : 'green'">
                        {{ row?.priorite }}
                      </UBadge>
                    </template>
                    <template #date_debut-data="{ row }">{{ formatDateShort(row?.date_debut) }}</template>
                    <template #date_fin-data="{ row }">{{ formatDateShort(row?.date_fin) }}</template>
                    <template #membres-data="{ row }">{{ getMembresLabel(row?.membres) }}</template>
                  </UTable>
                </div>
              </div>

              <div v-if="dossier?.taches?.length" class="pl-4 border-l border-gray-200 dark:border-gray-700">
                <div class="flex items-center gap-1.5 mb-2">
                  <UIcon name="i-heroicons-check-circle" class="w-3.5 h-3.5 text-emerald-500" />
                  <span class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tâches directes</span>
                </div>
                <div class="ml-5">
                  <UTable :rows="dossier.taches" :columns="taskColumns" :ui="{ td: { padding: 'py-2 px-3' }, th: { padding: 'py-2 px-3' } }" class="ring-1 ring-gray-200 dark:ring-gray-700 rounded-lg text-xs overflow-hidden">
                    <template #priorite-data="{ row }">
                      <UBadge size="xs" variant="subtle" :color="row?.priorite === 'Haute' ? 'red' : row?.priorite === 'Moyenne' ? 'amber' : 'green'">
                        {{ row?.priorite }}
                      </UBadge>
                    </template>
                    <template #date_debut-data="{ row }">{{ formatDateShort(row?.date_debut) }}</template>
                    <template #date_fin-data="{ row }">{{ formatDateShort(row?.date_fin) }}</template>
                    <template #membres-data="{ row }">{{ getMembresLabel(row?.membres) }}</template>
                  </UTable>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <p v-else class="text-sm text-gray-400 dark:text-gray-500 italic ml-4">
          Aucun dossier pour cet ordre du jour.
        </p>
      </section>
    </div>
  </div>
</template>