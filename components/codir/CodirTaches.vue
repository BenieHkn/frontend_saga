<script setup>
import { getStatutConfig, formatDateShort, TACHE_STATUT_OPTIONS, PRIORITE_CONFIG } from '@/composables/codirs/useCodir'


defineProps({
  taches: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['attach', 'detach', 'update-pivot'])

const editingTacheId = ref(null)
const pivotForm = reactive({ progression: 0, statut: '', commentaire: '' })

const startEdit = (tache) => {
  editingTacheId.value = tache.id
  pivotForm.progression = tache.pivot?.progression ?? 0
  pivotForm.statut = tache.pivot?.statut ?? 'en_attente'
  pivotForm.commentaire = tache.pivot?.commentaire ?? ''
}

const saveEdit = (tacheId) => {
  emit('update-pivot', { tacheId, ...pivotForm })
  editingTacheId.value = null
}
</script>

<template>
  <section>
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-base font-semibold flex items-center gap-2">
        <UIcon name="i-heroicons-check-circle" class="text-green-500" />
        Tâches
        <UBadge color="green" variant="soft" size="xs">{{ taches.length }}</UBadge>
      </h2>
      <UButton icon="i-heroicons-plus" color="green" variant="soft" size="xs" @click="emit('attach')">
        Ajouter
      </UButton>
    </div>

    <div v-if="!taches.length"
      class="text-center py-6 text-gray-400 text-sm bg-gray-50 dark:bg-slate-800/50 rounded-xl">
      Aucune tâche
    </div>

    <div v-else class="flex flex-col gap-2">
      <UCard
        v-for="tache in taches"
        :key="tache.id"
        class="rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm"
      >
        <!-- Vue normale -->
        <div v-if="editingTacheId !== tache.id" class="p-1">
          <div class="flex items-start justify-between gap-2 mb-3">
            <div class="flex-1 min-w-0">
              <p class="font-medium text-sm">{{ tache.intitule }}</p>
              <div class="flex items-center gap-2 flex-wrap mt-1.5">
                <span :class="`text-[10px] font-semibold px-2 py-0.5 rounded-full ${PRIORITE_CONFIG[tache.priorite] ?? 'text-gray-500 bg-gray-100'}`">
                  {{ tache.priorite }}
                </span>
                <span :class="`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getStatutConfig(tache.pivot?.statut ?? '').badgeClass}`">
                  {{ getStatutConfig(tache.pivot?.statut ?? '').label || tache.pivot?.statut }}
                </span>
                <UBadge v-if="tache.pivot?.est_reprise" color="amber" variant="soft" size="xs" icon="i-heroicons-arrow-uturn-left">
                  Reprise
                </UBadge>
              </div>
              <p class="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <UIcon name="i-heroicons-calendar" class="w-3 h-3" />
                {{ formatDateShort(tache.date_debut) }} → {{ formatDateShort(tache.date_fin) }}
              </p>
              <p v-if="tache.pivot?.commentaire" class="text-xs text-gray-500 italic mt-1">
                "{{ tache.pivot.commentaire }}"
              </p>
            </div>
            <div class="flex gap-1 shrink-0">
              <UButton icon="i-heroicons-pencil" color="blue" variant="ghost" size="xs" @click="startEdit(tache)" />
              <UButton icon="i-heroicons-x-mark" color="red" variant="ghost" size="xs" @click="emit('detach', tache.id)" />
            </div>
          </div>
          <div class="flex items-center gap-3">
            <UProgress :value="tache.pivot?.progression ?? 0" color="green" size="xs" class="flex-1" />
            <span class="text-xs font-mono text-gray-400 w-8 text-right">{{ tache.pivot?.progression ?? 0 }}%</span>
          </div>
        </div>

        <!-- Vue édition pivot -->
        <div v-else class="p-1 flex flex-col gap-3">
          <p class="font-medium text-sm">{{ tache.intitule }}</p>
          <div class="grid grid-cols-2 gap-3">
            <UFormGroup label="Statut" size="sm">
              <USelect v-model="pivotForm.statut" :options="TACHE_STATUT_OPTIONS" size="sm" />
            </UFormGroup>
            <UFormGroup label="Progression (%)" size="sm">
              <UInput v-model.number="pivotForm.progression" type="number" min="0" max="100" size="sm" />
            </UFormGroup>
          </div>
          <UFormGroup label="Commentaire" size="sm">
            <UInput v-model="pivotForm.commentaire" placeholder="Commentaire…" size="sm" />
          </UFormGroup>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" size="xs" @click="editingTacheId = null">Annuler</UButton>
            <UButton color="blue" size="xs" :loading="loading" @click="saveEdit(tache.id)">Enregistrer</UButton>
          </div>
        </div>
      </UCard>
    </div>
  </section>
</template>