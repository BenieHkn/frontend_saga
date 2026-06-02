<script setup>
import { useCodirsStore } from '@/stores/codirs'

definePageMeta({ title: 'Créer un CODIR' })

const store = useCodirsStore()
const router = useRouter()

const clearCurrents = () => {
  if (!process.client) return
  try {
    localStorage.removeItem('currentCodir')
    localStorage.removeItem('currentOrdreDuJour')
    localStorage.removeItem('currentDossier')
    localStorage.removeItem('currentTache')
    localStorage.removeItem('currentActivite')
  } catch (e) { }
}
const handleReturn = () => {
  clearCurrents()
  router.back()
}

const form = reactive({
  date: '',
  heure_debut: '',
  heure_fin: '',
  statut: 'nouveau',
})

const errors = ref({})

function validate() {
  errors.value = {}
  if (!form.heure_debut) errors.value.heure_debut = "L'heure de début est requise"
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
  <div class="max-w-3xl mx-auto py-12 px-4 sm:px-6">
    <div class="mb-10 flex items-start gap-4">
      <UButton 
        icon="i-heroicons-arrow-left" 
        color="blue" 
        variant="soft" 
        class="mt-1 rounded-full w-10 h-10 flex items-center justify-center transition-transform hover:-translate-x-1" 
        @click="handleReturn()" 
      />
      <PageHeader 
        title="Nouveau CODIR" 
        description="Planifiez une nouvelle réunion de direction" 
      />
    </div>

    <UCard 
      class="rounded-[2rem] shadow-sm hover:shadow-md transition-shadow duration-300 border border-blue-100/50 dark:border-blue-900/20 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl"
      :ui="{ body: { padding: 'p-8 sm:p-10' } }"
    >
      <form @submit.prevent="handleSubmit" class="space-y-8">
        
        <div class="space-y-6">

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <UFormGroup label="Heure de début" :error="errors.heure_debut" required>
              <UInput 
                v-model="form.heure_debut" 
                type="time" 
                size="lg" 
                color="blue"
                icon="i-heroicons-clock"
                :ui="{ icon: { base: 'text-blue-400 dark:text-blue-500' } }"
              />
            </UFormGroup>
          </div>

        </div>
        <UAlert 
          v-if="store.error" 
          color="red" 
          variant="soft"
          icon="i-heroicons-exclamation-triangle" 
          :title="store.error" 
          class="rounded-xl"
        />

        <UDivider class="py-2 opacity-50" />

        <div class="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
          <CustomButton
            color="red"
            icon="i-heroicons-x-mark"
            btnText="Annuler" 
            :modal="true"
            @click="handleReturn()"
          />

          <CustomButton 
            icon="i-heroicons-plus"
            btnText="Créer le CODIR" 
            :modal="true"
            @click="handleSubmit"
          />
        </div>
      </form>
    </UCard>
  </div>
</template>