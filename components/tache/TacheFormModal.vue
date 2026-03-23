<script setup>
import { PRIORITE_OPTIONS } from '@/composables/codirs/useCodir'
import { useMembre } from '@/composables/membres/useMembres'
import { useTache } from '~/composables/taches/useTaches'

const props = defineProps({
  modelValue: { type: Boolean, default: false }, // v-model ouverture
  activiteId: { type: Number,  default: null },  // pré-rempli si ouvert depuis ActiviteCard
  actionId:   { type: Number,  default: null },  // requis pour la création
})

const emit = defineEmits(['update:modelValue', 'created'])

const toast     = useNuxtApp().$toast ?? useToast()
const tacheApi  = useTache()
const membreApi = useMembre()
const membres   = ref([])

onMounted(async () => {
  try {
    const data = await membreApi.getMembres()
    membres.value = data
  } catch {
    const cached = process.client ? localStorage.getItem('membres') : null
    if (cached) membres.value = JSON.parse(cached)
  }
})

const membreOptions = computed(() =>
  membres.value.map(m => ({
    label: `${m.entite_user?.user?.nom ?? ''} ${m.entite_user?.user?.prenom ?? ''}`.trim(),
    value: m.id,
  }))
)

// ── Formulaire ────────────────────────────────────────────────────────────────
const form = reactive({
  intitule:   '',
  date_debut: '',
  date_fin:   '',
  priorite:   'Moyenne',
  membre_ids: [],
})

const reset = () => Object.assign(form, {
  intitule:   '',
  date_debut: '',
  date_fin:   '',
  priorite:   'Moyenne',
  membre_ids: [],
})

// Reset à chaque ouverture
watch(() => props.modelValue, (val) => {
  if (val) reset()
})

// ── Fermeture ─────────────────────────────────────────────────────────────────
const close = () => {
  reset()
  emit('update:modelValue', false)
}

// ── Soumission ────────────────────────────────────────────────────────────────
const submit = async () => {
  if (!form.intitule.trim()) {
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

  try {
    const created = await tacheApi.createTache({
      ...form,
      activite_id: props.activiteId ?? null,
      action_id:   props.actionId   ?? null,
    })

    toast.add({
      title: 'Tâche créée',
      description: `"${form.intitule}" a été créée avec succès`,
      color: 'green',
      icon: 'i-heroicons-check-circle',
    })

    emit('created', created)
    close()
  } catch (e) {
    const message = e?.data?.message ?? e?.message ?? 'Impossible de créer la tâche'
    toast.add({
      title: 'Erreur',
      description: message,
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
    })
  }
}
</script>

<template>
  <UModal :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <UCard class="rounded-2xl max-h-[80vh] flex flex-col">

      <template #header>
        <h3 class="font-semibold">Nouvelle tâche</h3>
        <p v-if="activiteId" class="text-xs text-gray-400 mt-0.5">
          Rattachée à l'activité #{{ activiteId }}
        </p>
      </template>

      <div class="p-2 flex flex-col gap-4 overflow-y-auto">

        <UFormGroup label="Intitulé" required>
          <UInput
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
          <AppSelectSearch
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