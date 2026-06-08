<script setup>
import { useDossier } from '~/composables/dossier/useDossier'

const props = defineProps({
  open: { type: Boolean, default: false },
  dossier: { type: Object, default: null },
  ordreId: { type: [Number, String], default: null },
  loading: { type: Boolean, default: false },
  documents: { type: Array, default: () => [] },
  loadingCreateOrUpdate: { type: Boolean, default: false },
})

const emit = defineEmits(['update:open', 'create', 'update'])
const toast = useToast()
const isEditMode = computed(() => !!props.dossier)
const {DOSSIER_STATUT_OPTIONS} = useDossier()

const defaultForm = () => ({
  libelle: '',
  description: '',
  statut: 'en_cours',
  ordre_du_jour_id: props.ordreId,
})

const form = reactive(defaultForm())

watch(
  () => [props.open, props.dossier],
  ([open]) => {
    if (!open) return

    if (props.dossier) {
      Object.assign(form, {
        libelle: props.dossier.libelle ?? '',
        description: props.dossier.description ?? '',
        statut: props.dossier.statut ?? '',
        ordre_du_jour_id: props.dossier.ordre_du_jour_id ?? props.ordreId,
        documents_id: props.dossier.documents?.map(d => d.id) ?? [],
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
  if (!form.libelle?.trim() || !form.statut) {
    toast.add({
      title: 'Champs requis',
      description: "Le libellé et le statut du dossier sont obligatoires.",
      color: 'orange',
      icon: 'i-heroicons-exclamation-triangle',
    })
    return
  }

  console.log('Submitting dossier form', form)
  if (isEditMode.value) {
    emit('update', { ...form })
  } else {
    emit('create', { ...form })
  }
}

const documentsOptions = computed(() => {
  return props.documents.map(document => {
    return {
      label: document.libelle,
      value: document.id,
    }
  })
})
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
              {{ isEditMode ? 'Modifier le dossier' : 'Nouveau dossier' }}
            </h3>
            <p class="text-xs text-gray-400 mt-0.5">
              <template v-if="isEditMode">Mettre à jour les informations du dossier</template>
              <template v-else>Créer un nouveau dossier pour le point à l'ordre du jour</template>
            </p>
          </div>
        </div>
      </template>

      <div class="flex flex-col gap-5">
        <div class="flex flex-col gap-4">
          <h4 class="text-sm font-semibold text-gray-600 dark:text-gray-400 border-b pb-1">
            Informations du dossier
          </h4>

          <UFormGroup label="Libellé" required>
            <UInput v-model="form.libelle" placeholder="Ex: Dossier de suivi" size="md" />
          </UFormGroup>

          <UFormGroup label="Statut" required>
            <USelect
              v-model="form.statut"
              :options="DOSSIER_STATUT_OPTIONS"
              placeholder="Veuillez sélectionner un statut"
              size="md"
            />
          </UFormGroup>

          <!-- <UFormGroup label="Description">
            <UTextarea
              v-model="form.description"
              placeholder="Ajouter une description pour le dossier"
              size="md"
              :rows="4"
            />
          </UFormGroup> -->

          <UFormGroup label="Documents">
            <USelectMenu
              v-model="form.documents_id"
              :options="documentsOptions"
              option-attribute="label"
              value-attribute="id"
              searchable
              placeholder="Sélectionner des documents"
            >
              <template #option="{ option }">
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-document" class="w-4 h-4" />
                  <span>{{ option.label }}</span>
                </div>
              </template>
            </USelectMenu>
          </UFormGroup>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" variant="ghost" @click="close">Annuler</UButton>
          <UButton
            :color="isEditMode ? 'blue' : 'green'"
            variant="soft"
            :loading="props.loadingCreateOrUpdate"
            @click="submit"
          >
            {{ isEditMode ? 'Enregistrer' : 'Créer' }}
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
