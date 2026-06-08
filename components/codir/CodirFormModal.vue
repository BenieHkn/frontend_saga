<script setup>
import { STATUT_OPTIONS } from '@/composables/codirs/useCodir'

const props = defineProps({
  open: { type: Boolean, default: false },
  codir: { type: Object, default: null },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['update:open', 'create', 'update'])
const toast = useToast()

const isEditMode = computed(() => !!props.codir)

const defaultForm = () => ({
  date: '',
  heure_debut: '',
  heure_fin: '',
  statut: 'soumis',
})

const form = reactive(defaultForm())

const extractDateInput = (value) => value?.split?.('T')?.[0] ?? value ?? ''
const extractTimeInput = (value) => value?.substring?.(11, 16) || value || ''

watch(
  () => [props.open, props.codir],
  ([open]) => {
    if (!open) return

    if (props.codir) {
      Object.assign(form, {
        date: extractDateInput(props.codir.date),
        heure_debut: extractTimeInput(props.codir.heure_debut),
        heure_fin: extractTimeInput(props.codir.heure_fin),
        statut: props.codir.statut ?? 'soumis',
      })
    } else {
      Object.assign(form, defaultForm())
    }
  },
  { immediate: true }
)

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
})

const close = () => emit('update:open', false)

const submit = () => {
  if (!form.date || !form.heure_debut) {
    toast.add({
      title: 'Champs requis',
      description: 'La date et l\'heure de début sont obligatoires.',
      color: 'orange',
      icon: 'i-heroicons-exclamation-triangle',
    })
    return
  }

  const payload = {
    date: form.date,
    heure_debut: form.heure_debut,
    heure_fin: form.heure_fin || null,
    statut: form.statut || 'soumis',
  }

  emit(isEditMode.value ? 'update' : 'create', payload)
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
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-lg flex items-center justify-center"
            :class="isEditMode
              ? 'bg-blue-100 dark:bg-blue-950/40'
              : 'bg-green-100 dark:bg-green-950/40'"
          >
            <UIcon
              :name="isEditMode ? 'i-heroicons-pencil-square' : 'i-heroicons-plus-circle'"
              class="w-5 h-5"
              :class="isEditMode ? 'text-blue-600' : 'text-green-600'"
            />
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">
              {{ isEditMode ? 'Modifier le CODIR' : 'Nouveau CODIR' }}
            </h3>
            <p class="text-xs text-gray-400 mt-0.5">
              <template v-if="isEditMode">Mettre à jour les informations de la séance</template>
              <template v-else>Créer une nouvelle séance CODIR</template>
            </p>
          </div>
        </div>
      </template>

      <div class="flex flex-col gap-5">
        <div class="flex flex-col gap-4">
          <h4 class="text-sm font-semibold text-gray-600 dark:text-gray-400 border-b pb-1">
            Informations du CODIR
          </h4>

          <UFormGroup label="Date" required>
            <UInput v-model="form.date" type="date" size="md" />
          </UFormGroup>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormGroup label="Heure de début" required>
              <UInput v-model="form.heure_debut" type="time" size="md" />
            </UFormGroup>

            <UFormGroup label="Heure de fin">
              <UInput v-model="form.heure_fin" type="time" size="md" />
            </UFormGroup>
          </div>

          <UFormGroup v-if="isEditMode" label="Statut">
            <USelect v-model="form.statut" :options="STATUT_OPTIONS" size="md" />
          </UFormGroup>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" variant="ghost" @click="close">Annuler</UButton>
          <UButton
            :color="isEditMode ? 'blue' : 'green'"
            variant="soft"
            icon="i-heroicons-check"
            :loading="props.loading"
            @click="submit"
          >
            {{ isEditMode ? 'Enregistrer' : 'Créer et ouvrir' }}
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
