<script setup>
const props = defineProps({
  open:        { type: Boolean, default: false },
  commentaire: { type: Object,  default: null },   // null = mode création
  loading:     { type: Boolean, default: false },
})

const emit = defineEmits(['update:open', 'create', 'update'])

const toast = useToast()

// ── Mode ──────────────────────────────────────────────────────────────────────
const isEditMode = computed(() => !!props.commentaire)

// ── Formulaire ────────────────────────────────────────────────────────────────
const defaultForm = () => ({ contenu: '' })

const form = reactive(defaultForm())

// Hydrate le formulaire à chaque ouverture
watch(
  () => [props.open, props.commentaire],
  ([open]) => {
    if (!open) return
    if (props.commentaire) {
      Object.assign(form, { contenu: props.commentaire.contenu ?? '' })
    } else {
      Object.assign(form, defaultForm())
    }
  }
)

// ── isOpen ────────────────────────────────────────────────────────────────────
const isOpen = computed({
  get: () => props.open,
  set: (val) => emit('update:open', val),
})

const close = () => emit('update:open', false)

// ── Validation & Submit ───────────────────────────────────────────────────────
const submit = () => {
  if (!form.contenu?.trim()) {
    toast.add({
      title: 'Champ requis',
      description: 'Le contenu du commentaire est obligatoire',
      color: 'orange',
      icon: 'i-heroicons-exclamation-triangle',
    })
    return
  }

  if (isEditMode.value) {
    emit('update', { ...form })
  } else {
    emit('create', { ...form })
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
              : 'bg-green-100 dark:bg-green-950/40'"
          >
            <UIcon
              :name="isEditMode ? 'i-heroicons-pencil-square' : 'i-heroicons-chat-bubble-left-ellipsis'"
              class="w-5 h-5"
              :class="isEditMode ? 'text-blue-600' : 'text-green-600'"
            />
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">
              {{ isEditMode ? 'Modifier le commentaire' : 'Nouveau commentaire' }}
            </h3>
            <p class="text-xs text-gray-400 mt-0.5">
              <template v-if="isEditMode">Mise à jour du contenu</template>
              <template v-else>Renseigner le contenu du commentaire</template>
            </p>
          </div>
        </div>
      </template>

      <!-- Body -->
      <div class="flex flex-col gap-5">
        <UFormGroup label="Contenu" required>
          <UTextarea
            v-model="form.contenu"
            placeholder="Écrivez votre commentaire..."
            size="md"
            autoresize
            :rows="4"
          />
        </UFormGroup>
      </div>

      <!-- Footer -->
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" variant="ghost" @click="close">Annuler</UButton>
          <UButton
            :loading="loading"
            :color="isEditMode ? 'blue' : 'green'"
            variant="soft"
            @click="submit"
          >
            {{ isEditMode ? 'Enregistrer' : 'Publier' }}
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
