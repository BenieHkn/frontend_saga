<script setup>
// ActiviteFormModal — même pattern que TacheFormModal
// Champs backend : libelle (requis), action_id (optionnel), dossier_id (optionnel)

const props = defineProps({
  open:      { type: Boolean, default: false },
  activite:  { type: Object,  default: null },   // null = mode création
  dossierId: { type: Number,  default: null },
  actionId:  { type: Number,  default: null },
  actionsOptions: { type: Array, default: () => [] }, // [{ label, value }]
  loadingCreateOrUpdate:  {type: Boolean, default: false},
})

const emit = defineEmits(['update:open', 'create', 'update'])

const toast   = useToast()
const loading = ref(false)

// ── Mode ─────────────────────────────────────────────────────────────────────
const isEditMode = computed(() => !!props.activite)

// ── Formulaire ───────────────────────────────────────────────────────────────
const defaultForm = () => ({
  libelle:    '',
  action_id:  props.actionId ?? null,
  dossier_id: props.dossierId ?? null,
})

const form = reactive(defaultForm())

watch(
  () => [props.open, props.activite],
  ([open]) => {
    if (!open) return
    if (props.activite) {
      Object.assign(form, {
        libelle:    props.activite.libelle    ?? '',
        action_id:  props.activite.action_id  ?? props.actionId ?? null,
        dossier_id: props.activite.dossier_id ?? props.dossierId ?? null,
      })
    } else {
      Object.assign(form, defaultForm())
    }
  }
)

// ── isOpen ───────────────────────────────────────────────────────────────────
const isOpen = computed({
  get: () => props.open,
  set: (val) => emit('update:open', val),
})

const close = () => emit('update:open', false)

// ── Submit ───────────────────────────────────────────────────────────────────
const submit = async () => {
  if (!form.libelle?.trim()) {
    toast.add({
      title: 'Champ requis',
      description: 'Le libellé est obligatoire',
      color: 'orange',
      icon: 'i-heroicons-exclamation-triangle',
    })
    return
  }

  loading.value = true
  try {
    if (isEditMode.value) {
      emit('update', { ...form })
    } else {
      emit('create', { ...form })
    }
  } finally {
    loading.value = false
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
      <!-- Header -->
      <template #header>
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-lg flex items-center justify-center"
            :class="isEditMode
              ? 'bg-blue-100 dark:bg-blue-950/40'
              : 'bg-violet-100 dark:bg-violet-950/40'"
          >
            <UIcon
              :name="isEditMode ? 'i-heroicons-pencil-square' : 'i-heroicons-plus-circle'"
              class="w-5 h-5"
              :class="isEditMode ? 'text-blue-600' : 'text-violet-600'"
            />
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">
              {{ isEditMode ? "Modifier l'activité" : 'Nouvelle activité' }}
            </h3>
            <p class="text-xs text-gray-400 mt-0.5">
              <template v-if="isEditMode">Mise à jour des informations de l'activité</template>
              <template v-else-if="actionId">Rattachée à l'action #{{ actionId }}</template>
              <template v-else>Renseigner les informations de l'activité</template>
            </p>
          </div>
        </div>
      </template>

      <!-- Body -->
      <div class="flex flex-col gap-4">
        <UFormGroup label="Libellé" required>
          <UTextarea
            v-model="form.libelle"
            placeholder="Ex : Formation du personnel sur le nouveau système"
            size="md"
            :rows="3"
          />
        </UFormGroup>

        <UFormGroup v-if="actionsOptions.length" label="Action parente">
          <USelect
            v-model="form.action_id"
            :options="actionsOptions"
            placeholder="Sélectionner une action (optionnel)"
            option-attribute="label"
            value-attribute="value"
            size="md"
          />
        </UFormGroup>
      </div>

      <!-- Footer -->
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" variant="ghost" @click="close">Annuler</UButton>
          <UButton
            :color="isEditMode ? 'blue' : 'violet'"
            variant="soft"
            :loading="loadingCreateOrUpdate"
            @click="submit"
          >
            {{ isEditMode ? 'Enregistrer' : 'Créer' }}
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
