<script setup>
import { PRIORITE_OPTIONS } from '@/composables/codirs/useCodir'

const props = defineProps({
  openFormCreateModal: { type: Boolean, default: false }, // v-model ouverture
  activiteId: { type: Number,  default: null },  // pré-rempli si ouvert depuis ActiviteCard
  actionId:   { type: Number,  default: null },  // requis pour la création
  dossierId: {type: Number, default: null },
  membres: {type: Array, default: () => []}
})

const emit = defineEmits(['update:openFormCreateModal', 'created'])

// ── Formulaire ────────────────────────────────────────────────────────────────
const form = reactive({
  intitule:   '',
  date_debut: '',
  date_fin:   '',
  priorite:   'Moyenne',
  membre_ids: [],
})

// ── Fermeture ─────────────────────────────────────────────────────────────────
const close = () => {
  emit('update:openFormCreateModal', false)
}

 const isOpen = computed({
        get: () => props.openFormCreateModal,
        set: (val) => emit('update:openFormCreateModal', val)
 })

</script>

<template>
  <UModal v-model="isOpen">
    <UCard class="rounded-2xl max-h-[80vh] flex flex-col">

      <template #header>
        <h3 class="font-semibold">Nouvelle tâche</h3>
        <p v-if="activiteId" class="text-xs text-gray-400 mt-0.5">
          Rattachée à l'activité #{{ activiteId }}
        </p>
      </template>

      <div class="p-2 flex flex-col gap-4 overflow-y-auto">

        <UFormGroup label="Intitulé" required>
          <UTextarea
            v-model="form.intitule"
            placeholder="Ex: Préparer le rapport"
            size="md"
          />
        </UFormGroup>

        <div class="grid grid-cols-2 gap-4">
          <UFormGroup label="Date de début" required>
            <UInput v-model="form.date_debut" type="date" size="md" />
          </UFormGroup>
          <UFormGroup label="Date de fin" required>
            <UInput v-model="form.date_fin" type="date" size="md" />
          </UFormGroup>
        </div>

        <UFormGroup label="Priorité">
          <USelect v-model="form.priorite" :options="PRIORITE_OPTIONS" size="md" />
        </UFormGroup>

        <UFormGroup label="Membres assignés">
          <USelectMenu
            v-model="form.membre_ids"
            :options="membreOptions"
            :multiple="true"
            :loading="membreApi.loading.value"
            placeholder="Rechercher des membres..."
          />
        </UFormGroup>

      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" variant="ghost" @click="close">Annuler</UButton>
          <UButton color="blue" :loading="tacheApi.loading.value" @click="submit">
            Créer
          </UButton>
        </div>
      </template>

    </UCard>
  </UModal>
</template>