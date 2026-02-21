<script setup>
import { useCodirsStore } from '@/stores/codirs'
import { STATUT_OPTIONS } from '@/composables/codirs/useCodir'

definePageMeta({ title: 'Créer un CODIR' })

const store = useCodirsStore()
const router = useRouter()

const form = reactive({
  date: '',
  heure_debut: '',
  heure_fin: '',
  statut: 'nouveau',
})

const errors = ref({})

function validate() {
  errors.value = {}
  if (!form.date) errors.value.date = 'La date est requise'
  if (!form.heure_debut) errors.value.heure_debut = "L'heure de début est requise"
  if (!form.heure_fin) errors.value.heure_fin = "L'heure de fin est requise"
  if (form.heure_fin && form.heure_debut && form.heure_fin <= form.heure_debut)
    errors.value.heure_fin = "L'heure de fin doit être après l'heure de début"
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validate()) return
  try {
    const codir = await store.createCodir({
      date: form.date,
      heure_debut: form.heure_debut,
      heure_fin: form.heure_fin,
      statut: form.statut,
    })
    router.push(`/codir/${codir.id}`)
  } catch {
    // erreur gérée dans le store
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto py-10 px-6">
    <div class="mb-8 flex items-center gap-3">
      <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" @click="router.back()" />
      <PageHeader title="Nouveau CODIR" description="Planifiez une nouvelle réunion de direction" />
    </div>

    <UCard class="rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-6 p-2">

        <UFormGroup label="Date" :error="errors.date" required>
          <UInput v-model="form.date" type="date" size="md" />
        </UFormGroup>

        <div class="grid grid-cols-2 gap-4">
          <UFormGroup label="Heure de début" :error="errors.heure_debut" required>
            <UInput v-model="form.heure_debut" type="time" size="md" />
          </UFormGroup>
          <UFormGroup label="Heure de fin" :error="errors.heure_fin" required>
            <UInput v-model="form.heure_fin" type="time" size="md" />
          </UFormGroup>
        </div>

        <UFormGroup label="Statut" required>
          <USelect v-model="form.statut" :options="STATUT_OPTIONS" size="md" />
        </UFormGroup>

        <UAlert v-if="store.error" color="red" icon="i-heroicons-exclamation-circle" :title="store.error" />

        <div class="flex justify-end gap-3 pt-2">
          <UButton color="gray" variant="ghost" @click="router.back()">Annuler</UButton>
          <UButton type="submit" color="blue" :loading="store.loading" icon="i-heroicons-check">
            Créer le CODIR
          </UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>