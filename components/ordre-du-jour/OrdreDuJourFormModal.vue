<script setup>
import { ref, computed, reactive, watch } from 'vue'
import { useToast } from '@/composables/useToast'

const props = defineProps({
  open: { type: Boolean, default: false },
  ordre: { type: Object, default: null },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['update:open', 'createOrdre', 'updateOrdre'])
const toast = useToast()

const isEditMode = computed(() => !!props.ordre)

const defaultForm = () => ({
  libelle: '',
})

const form = reactive(defaultForm())

watch(
  () => [props.open, props.ordre],
  ([open]) => {
    if (!open) return

    if (props.ordre) {
      Object.assign(form, {
        libelle: props.ordre.libelle ?? '',
      })
    } else {
      Object.assign(form, defaultForm())
    }
  }
)

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
})

const close = () => emit('update:open', false)

const submit = () => {
  if (!form.libelle?.trim()) {
    toast.add({
      title: 'Champs requis',
      description: "Le libellé est obligatoire.",
      color: 'orange',
      icon: 'i-heroicons-exclamation-triangle',
    })
    return
  }

  console.log('Submitting ordre du jour form', form)
  if (isEditMode.value) {
    emit('updateOrdre', { ...form })
  } else {
    emit('createOrdre', { ...form })
  }
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
              {{ isEditMode ? 'Modifier l\'ordre du jour' : 'Nouveau point à l\'ordre du jour' }}
            </h3>
            <p class="text-xs text-gray-400 mt-0.5">
              <template v-if="isEditMode">Mettre à jour les informations du point</template>
              <template v-else>Créer un nouveau point à l'ordre du jour pour le CODIR</template>
            </p>
          </div>
        </div>
      </template>

      <div class="flex flex-col gap-5">
        <div class="flex flex-col gap-4">
          <h4 class="text-sm font-semibold text-gray-600 dark:text-gray-400 border-b pb-1">
            Informations de l'ordre du jour
          </h4>

          <UFormGroup label="Libellé" required>
            <UTextarea v-model="form.libelle" placeholder="Ex: Bilan trimestriel" size="md" :rows="3" />
          </UFormGroup>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" variant="ghost" @click="close">Annuler</UButton>
          <UButton
            :color="isEditMode ? 'blue' : 'green'"
            variant="soft"
            :loading="props.loading"
            @click="submit"
          >
            {{ isEditMode ? 'Enregistrer' : 'Créer' }}
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
