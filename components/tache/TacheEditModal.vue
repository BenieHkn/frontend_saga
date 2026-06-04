<script setup>
import { PRIORITE_OPTIONS, STATUT_OPTIONS, TACHE_STATUT_OPTIONS } from '@/composables/codirs/useCodir'

const props = defineProps({
  openEditTacheModal: { type: Boolean, default: false },
  tache:              { type: Object,  required: true },
  codirId:            { type: Number,  required: true },
  membresOptions:     { type: Array,   required: true }
})

const emit = defineEmits(['update:openEditTacheModal', 'update'])

const toast   = useToast()
const loading = ref(false)

const codir = props.tache.codirs.find(
  c => Number(c.pivot.codir_id) === Number(props.codirId)
);

const form = reactive({
  intitule:    props.tache.intitule,
  date_debut:  props.tache.date_debut,
  date_fin:    props.tache.date_fin,
  priorite:    props.tache.priorite,
  membres_id:  props.tache.membres?.map(m => m.id) ?? [],
  progression: props.tache.progression ?? 0,
  statut:      codir?.pivot?.statut ?? "en_cours",
  commentaire: props.tache.commentaire,
  est_reprise: props.tache.est_reprise,
})

const isOpen = computed({
  get: () => props.openEditTacheModal,
  set: (val) => emit('update:openEditTacheModal', val)
})

const close = () => emit('update:openEditTacheModal', false)

const submit = async () => {
  if (!form.intitule?.trim()) {
    toast.add({
      title: 'Champ requis',
      description: "L'intitulé est obligatoire",
      color: 'orange',
      icon: 'i-heroicons-exclamation-triangle',
    })
    return
  }

  if (!form.date_debut || !form.date_fin) {
    toast.add({
      title: 'Dates requises',
      description: 'Veuillez renseigner les dates de début et de fin',
      color: 'orange',
      icon: 'i-heroicons-exclamation-triangle',
    })
    return
  }

  emit('update', { ...form })
  close()
}
</script>

<template>
  <UModal v-model="isOpen">
    <UCard
      class="rounded-2xl flex flex-col"
      :ui="{
        base: 'max-h-[90vh]',
        body: { base: 'flex-1 overflow-y-auto p-4' },
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800'
      }"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center">
            <UIcon name="i-heroicons-pencil-square" class="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Modifier la tâche</h3>
            <p class="text-xs text-gray-400 mt-0.5">Mise à jour des informations et progression</p>
          </div>
        </div>
      </template>

      <div class="flex flex-col gap-5">
        <!-- Infos Générales -->
        <div class="flex flex-col gap-4">
          <h4 class="text-sm font-semibold text-gray-600 dark:text-gray-400 border-b pb-1">
            Informations Générales
          </h4>

          <UFormGroup label="Intitulé" required>
            <UTextarea v-model="form.intitule" placeholder="Ex: Préparer le rapport" size="md" />
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

          <UFormGroup label="Responsables">
            <USelectMenu
              v-model="form.membres_id"
              :options="membresOptions"
              multiple
              option-attribute="label"
              value-attribute="value"
              searchable
              placeholder="Sélectionner des responsables"
            >
              <template #option="{ option }">
                <div class="flex items-center gap-2">
                  <UAvatar :alt="option.label" size="xs" />
                  <span>{{ option.label }}</span>
                </div>
              </template>
            </USelectMenu>
          </UFormGroup>
        </div>

        <!-- Suivi / Progression -->
        <div class="flex flex-col gap-4 mt-2">
          <h4 class="text-sm font-semibold text-gray-600 dark:text-gray-400 border-b pb-1">
            Suivi CODIR
          </h4>

          <UFormGroup label="Progression (%)">
            <div class="flex items-center gap-4">
              <input
                v-model.number="form.progression"
                type="range" min="0" max="100" step="5"
                class="flex-1 accent-blue-500"
              />
              <span class="text-sm font-semibold text-gray-700 dark:text-gray-300 w-10 text-right">
                {{ form.progression }}%
              </span>
            </div>
          </UFormGroup>

          <UFormGroup label="Statut">
            <USelect v-model="form.statut" :options="TACHE_STATUT_OPTIONS" size="md" />
          </UFormGroup>

          <UFormGroup label="Commentaire de progression">
            <UTextarea
              v-model="form.commentaire"
              placeholder="Ajouter un commentaire..."
              size="md"
              :rows="2"
            />
          </UFormGroup>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" variant="ghost" @click="close">Annuler</UButton>
          <UButton color="blue" :loading="loading" @click="submit">Enregistrer</UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>