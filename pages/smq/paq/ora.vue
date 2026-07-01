<template>
  <div>
    <UModal v-model="open" :ui="{ width: 'lg:max-w-2xl' }">
      <div class="bg-white rounded-xl overflow-hidden">
        <div class="px-6 py-4 border-b flex items-center justify-between" style="border-color:var(--qp-border-1)">
          <h2 class="font-semibold text-base" style="color:var(--qp-fg-1)">Les Observations</h2>
          <button class="text-sm text-gray-500" @click="close">Fermer</button>
        </div>

        <div class="p-6 grid gap-4">
          <UFormGroup label="Points forts">
            <UTextarea v-model="form.pointsForts" rows="4" placeholder="Saisir les points forts..." />
          </UFormGroup>

          <UFormGroup label="Points faibles">
            <UTextarea v-model="form.pointsFaibles" rows="4" placeholder="Saisir les points faibles..." />
          </UFormGroup>

          <UFormGroup label="Écarts">
            <UTextarea v-model="form.ecarts" rows="3" placeholder="Saisir les écarts observés..." />
          </UFormGroup>

          <UFormGroup label="Recommandations">
            <UTextarea v-model="form.recommandations" rows="3" placeholder="Proposer des recommandations..." />
          </UFormGroup>

          <div class="flex items-center justify-between pt-2">
            <div class="text-sm text-gray-500">Dernière sauvegarde : <span v-if="lastSaved">{{ lastSaved }}</span><span v-else>—</span></div>
            <div class="flex gap-2">
              <UButton color="gray" variant="soft" @click="enregistrer" :loading="saving">Enregistrer</UButton>
              <UButton color="primary" @click="valider" :loading="saving">Valider</UButton>
            </div>
          </div>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '~/composables/useToast'
const toast = useToast()
const router = useRouter()

const open = ref(false)
const saving = ref(false)

const form = reactive({
  pointsForts: '',
  pointsFaibles: '',
  ecarts: '',
  recommandations: '',
})

const lastSaved = ref('')
const DRAFT_KEY = 'paq-ora-draft'

const loadDraft = () => {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      Object.assign(form, data.form || {})
      lastSaved.value = data.lastSaved || ''
    }
  } catch (e) {
    console.warn('Impossible de charger le draft ORA', e)
  }
}

const enregistrer = () => {
  saving.value = true
  try {
    const payload = { form: { ...form }, lastSaved: new Date().toLocaleString('fr-FR') }
    localStorage.setItem(DRAFT_KEY, JSON.stringify(payload))
    lastSaved.value = payload.lastSaved
    toast.success('Enregistré en brouillon')
  } catch (e) {
    console.error(e)
    toast.error('Erreur lors de la sauvegarde')
  } finally {
    saving.value = false
  }
}

const valider = async () => {
  saving.value = true
  try {
    // Placeholder: ici on enverrait `form` au backend.
    await new Promise((r) => setTimeout(r, 600))
    localStorage.removeItem(DRAFT_KEY)
    lastSaved.value = ''
    toast.success('Observation validée')
    close()
  } catch (e) {
    console.error('Erreur validation ORA', e)
    toast.error('Erreur lors de la validation')
  } finally {
    saving.value = false
  }
}

const close = () => {
  open.value = false
  router.push('/smq/paq')
}

onMounted(() => {
  open.value = true
  loadDraft()
})
</script>

<style scoped>
.qp-num { font-variant-numeric: tabular-nums; }
</style>
