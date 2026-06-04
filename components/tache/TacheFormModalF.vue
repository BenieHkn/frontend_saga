<script setup>
import { PRIORITE_OPTIONS, TACHE_STATUT_OPTIONS } from '@/composables/codirs/useCodir'

const props = defineProps({
  open:        { type: Boolean, default: false },
  tache:       { type: Object,  default: null },   // null = mode création
  activiteId:  { type: Number,  default: null },
  actionId:    { type: Number,  default: null },
  dossierId:   { type: Number,  default: null },
  codirId:     { type: Number,  default: null },
  membresOptions: { type: Array, default: () => [] }, // [{ label, value }]
})

const emit = defineEmits(['update:open', 'create', 'update'])

const toast   = useToast()
const loading = ref(false)

// ── Mode ──────────────────────────────────────────────────────────────────────
const isEditMode = computed(() => !!props.tache)

// ── Formulaire ────────────────────────────────────────────────────────────────
const defaultForm = () => ({
  intitule:    '',
  date_debut:  '',
  date_fin:    '',
  priorite:    'Moyenne',
  membre_ids:  [],
  // champs edit uniquement
  progression: 0,
  statut:      null,
  commentaire: '',
  est_reprise: false,
  codir_id: props.codirId,
})

const form = reactive(defaultForm())

// Hydrate le formulaire à chaque ouverture
watch(
  () => [props.open, props.tache],
  ([open]) => {
    if (!open) return

    if (props.tache) {
      // ✅ Calculé ici, quand props.tache est garanti non-null
      const codir = props.tache.codirs?.find(
        c => Number(c.pivot?.codir_id) === Number(props.codirId)
      )

      Object.assign(form, {
        intitule:    props.tache.intitule    ?? '',
        date_debut:  props.tache.date_debut  ?? '',
        date_fin:    props.tache.date_fin    ?? '',
        priorite:    props.tache.priorite    ?? 'normale',
        membre_ids:  props.tache.membres?.map(m => m.id) ?? [],
        progression: codir?.pivot?.progression ?? props.tache.progression ?? 0,
        statut:      codir?.pivot?.statut      ?? 'en_cours',
        commentaire: props.tache.commentaire   ?? '',
        est_reprise: false,
        codir_id: props.codirId,
      })
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

  loading.value = true
  try {
    if (isEditMode.value) {
      emit('updated', { ...form })
    } else {
      emit('created', { ...form })
    }
    close()
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
              {{ isEditMode ? 'Modifier la tâche' : 'Nouvelle tâche' }}
            </h3>
            <p class="text-xs text-gray-400 mt-0.5">
              <template v-if="isEditMode">Mise à jour des informations et progression</template>
              <template v-else-if="activiteId">Rattachée à l'activité #{{ activiteId }}</template>
              <template v-else>Renseigner les informations de la tâche</template>
            </p>
          </div>
        </div>
      </template>

      <!-- Body -->
      <div class="flex flex-col gap-5">

        <!-- Informations Générales -->
        <div class="flex flex-col gap-4">
          <h4 class="text-sm font-semibold text-gray-600 dark:text-gray-400 border-b pb-1">
            Informations Générales
          </h4>

          <UFormGroup label="Intitulé" required>
            <UTextarea v-model="form.intitule" placeholder="Ex: Préparer le rapport" size="md" />
          </UFormGroup>

          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Date de début">
              <UInput v-model="form.date_debut" type="date" size="md" />
            </UFormGroup>
            <UFormGroup label="Date de fin">
              <UInput v-model="form.date_fin" type="date" size="md" />
            </UFormGroup>
          </div>

          <UFormGroup label="Priorité">
            <USelect v-model="form.priorite" placeholder="Définir une priorité pour la tâche" :options="PRIORITE_OPTIONS" size="md" />
          </UFormGroup>

          <UFormGroup label="Membres assignés">
            <USelectMenu
              v-model="form.membre_ids"
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

        <!-- Suivi CODIR (edit uniquement) -->
        <div v-if="isEditMode" class="flex flex-col gap-4 mt-2">
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

      <!-- Footer -->
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" variant="ghost" @click="close">Annuler</UButton>
          <UButton
            :color="isEditMode ? 'blue' : 'green'"
            :loading="loading"
            @click="submit"
          >
            {{ isEditMode ? 'Enregistrer' : 'Créer' }}
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>