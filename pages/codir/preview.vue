<script setup>
import { useCodir } from '@/composables/codirs/useCodir'

definePageMeta({ title: 'Aperçu CODIR' })

const router = useRouter()
const toast = useNuxtApp().$toast ?? useToast()

const clearCurrents = () => {
  if (!process.client) return
  try {
    localStorage.removeItem('currentCodir')
    localStorage.removeItem('currentOrdreDuJour')
    localStorage.removeItem('currentDossier')
    localStorage.removeItem('currentTache')
    // fallback if id is undefined here, better to clear standard keys
    localStorage.removeItem(`presence-${codir.value?.id}`)
    localStorage.removeItem(`codir_step_${codir.value?.id}`)
  } catch (e) { }
}

const handleReturn = () => {
  if (codir.value?.id) {
    localStorage.setItem(`codir_step_${codir.value.id}`, '2')
  }
  router.back()
}

// ── Données depuis localStorage ───────────────────────────────────────────────
const codir = ref(null)

// ── Composable ────────────────────────────────────────────────────────────────
const { cloturerCodir, generatePdf, downloadPdf, getCodir, getPresences, sendCodir } = useCodir()

// ── Clôture (Modale & Logique) ────────────────────────────────────────────────
const showClotureModal = ref(false)
const cloturePending = ref(false)

const getCachedMembresById = () => {
  if (!process.client) return new Map()
  try {
    const membres = JSON.parse(localStorage.getItem('membres') ?? '[]')
    return new Map((membres ?? []).map((membre) => [Number(membre.id), membre]))
  } catch {
    return new Map()
  }
}

const isPresenceValidated = (presence) => presence?.has_validate === true

const isMembreExemptValidation = (presence, cachedMembresById) => {
  const membre = presence?.membre ?? cachedMembresById.get(Number(presence?.membre_id))
  const entiteCode = membre?.entite_user?.entite?.code ?? membre?.entiteUser?.entite?.code ?? membre?.entite_user?.code ?? membre?.entiteUser?.code
  return String(entiteCode ?? '').toUpperCase() === 'DGML'
}

const getUnvalidatedPresentPresences = async () => {
  const response = await getPresences(codir.value.id)
  const presences = response?.presences || response || []
  const cachedMembresById = getCachedMembresById()
  if (!presences.length) return [{ missingPresences: true }]
  return presences.filter((presence) => {
    const isPresent = presence?.is_present === true
    if (!isPresent) return false
    if (isMembreExemptValidation(presence, cachedMembresById)) return false
    return !isPresenceValidated(presence)
  })
}

const confirmerCloture = async () => {
  if (!codir.value) return
  cloturePending.value = true
  try {
    const unvalidatedPresences = await getUnvalidatedPresentPresences()
    if (unvalidatedPresences.length) {
      toast.add({ title: 'Clôture impossible', description: 'Toutes les entités présentes doivent valider le CODIR avant la clôture.', color: 'red', icon: 'i-heroicons-exclamation-circle' })
      return
    }
    await cloturerCodir(codir.value.id)
    try { clearCurrents() } catch (err) {}
    toast.add({ title: 'CODIR clôturé', description: 'Le CODIR a été clôturé avec succès.', color: 'green', icon: 'i-heroicons-check-circle' })
    showClotureModal.value = false
    navigateTo('/codir')
  } catch (e) {
    toast.add({ title: 'Erreur', description: 'Impossible de clôturer le CODIR.', color: 'red', icon: 'i-heroicons-x-circle' })
  } finally {
    cloturePending.value = false
  }
}

// ── Génération PDF (Modale & Logique) ─────────────────────────────────────────
const pdfGenerating = ref(false)
const showPdfGeneratedModal = ref(false)
const generatedPdfName = ref('')

const handleGeneratePdf = async () => {
  if (!codir.value) return
  pdfGenerating.value = true
  try {
    const result = await generatePdf(codir.value.id)
    codir.value = { ...codir.value, url: result.url }
    localStorage.setItem('currentCodir', JSON.stringify(codir.value))
    
    const dateStr = codir.value.date 
      ? new Date(codir.value.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }).replace(/\//g, '-') 
      : String(codir.value.id)
    
    generatedPdfName.value = `CODIR_${dateStr}.pdf`
    showPdfGeneratedModal.value = true
  } catch (e) {
    toast.add({ title: 'Erreur', description: 'Impossible de générer le PDF.', color: 'red', icon: 'i-heroicons-x-circle' })
  } finally {
    pdfGenerating.value = false
  }
}

// ── Téléchargement PDF ────────────────────────────────────────────────────────
const pdfDownloading = ref(false)

const handleDownloadPdf = async () => {
  if (!codir.value?.id) return console.error('ID du CODIR introuvable')
  
  pdfDownloading.value = true
  try {
    const blob = await downloadPdf(codir.value.id)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    // Use generated name if available, fallback otherwise
    link.setAttribute('download', generatedPdfName.value || `codir_${codir.value.id}.pdf`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    // Close modal on success
    showPdfGeneratedModal.value = false
  } catch (e) {
    console.error('Erreur téléchargement :', e)
    toast.add({ title: 'Erreur', description: 'Impossible de télécharger le fichier.', color: 'red', icon: 'i-heroicons-x-circle' })
  } finally {
    pdfDownloading.value = false
  }
}

// ── Listing validations ───────────────────────────────────────────────────────
const presencesGroupees = ref({ valides: [], nonValides: [], exempts: [] })
const presencesLoading = ref(false)

const chargerPresences = async () => {
  if (!codir.value) return
  presencesLoading.value = true
  try {
    const response = await getPresences(codir.value.id)
    const presences = response?.presences || response || []
    const cachedMembresById = getCachedMembresById()
    const valides = []
    const nonValides = []
    const exempts = []

    for (const presence of presences) {
      if (!presence.is_present) continue
      const codeEntite = presence?.membre?.entite_user?.entite?.code ?? cachedMembresById.get(Number(presence?.membre_id))?.entite_user?.entite?.code ?? `Entité inconnue (#${presence.membre_id})`
      
      if (isMembreExemptValidation(presence, cachedMembresById)) {
        exempts.push(String(codeEntite).toUpperCase())
      } else if (isPresenceValidated(presence)) {
        valides.push(String(codeEntite).toUpperCase())
      } else {
        nonValides.push(String(codeEntite).toUpperCase())
      }
    }
    presencesGroupees.value = { valides, nonValides, exempts }
  } catch (e) {
    console.error("Erreur chargement présences", e)
  } finally {
    presencesLoading.value = false
  }
}

const rafraichir = async () => {
  if (!codir.value) return
  try {
    codir.value = await getCodir(codir.value.id)
    localStorage.setItem('currentCodir', JSON.stringify(codir.value))
  } catch (e) {
     console.error("Erreur rafraichissement", e)
  }
}

const sendingMail = ref(false)
const handleSendingMail = async()=>{
  sendingMail.value = true
  try{
    console.log("le codir en question", codir.value)
    response = await sendCodir(codir.value.id)
    console.log(response)
    toast.add({ title: 'Envoi effectué', description: 'Les mails ont été envoyés avec succès.', color: 'green', icon: 'i-heroicons-check-circle' })
  }catch(e){
    
  }finally{
    sendingMail.value=false
  }
}

onMounted(() => {
  const raw = localStorage.getItem('currentCodir')
  if (raw) {
    codir.value = JSON.parse(raw)
    rafraichir()
    chargerPresences()
  }
})
</script>

<template>
  <div class="bg-gray-50 dark:bg-gray-900 min-h-screen p-6">

    <!-- Sticky top bar actions -->
    <div class="sticky top-20 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center justify-between gap-4 shadow-sm rounded-t-xl mx-auto max-w-6xl">
      <div class="flex items-center gap-3">
        <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" size="sm" @click="handleReturn()">Retour</UButton>
        <span class="text-sm font-medium text-gray-600 dark:text-gray-300">Aperçu du CODIR</span>
      </div>
      
      <div class="flex items-center gap-2">
        <!-- Bouton Générer PDF -->
        <UButton 
          icon="i-heroicons-document-arrow-up" 
          color="violet" 
          variant="soft" 
          size="sm" 
          :loading="pdfGenerating" 
          :disabled="pdfGenerating" 
          @click="handleGeneratePdf"
        >
          {{ pdfGenerating ? 'Génération…' : 'Générer PDF' }}
        </UButton>

        <UButton 
          icon="i-heroicons-document-arrow-up" 
          color="violet" 
          variant="soft" 
          size="sm" 
          :loading="sendingMail" 
          :disabled="sendingMail" 
          @click="handleSendingMail"
        >
          {{ sendingMail ? 'Envoi...' : 'Envoyer aux membres' }}
        </UButton>
        
        <!-- Bouton Télécharger (si URL existe) -->
        <UButton 
          v-if="codir?.url !== null" 
          icon="i-heroicons-arrow-down-tray" 
          color="emerald" 
          variant="soft" 
          size="sm" 
          :loading="pdfDownloading" 
          :disabled="pdfDownloading" 
          @click="handleDownloadPdf"
        >
          {{ pdfDownloading ? 'Téléchargement…' : 'Télécharger PDF' }}
        </UButton>
        
        <!-- Bouton Clôturer -->
        <UButton 
          v-if="codir?.url !== null && codir?.statut !== 'clos'" 
          icon="i-heroicons-lock-closed" 
          color="red" 
          variant="soft" 
          size="sm" 
          :disabled="codir?.url === null" 
          @click="showClotureModal = true"
        >
          Clôturer
        </UButton>
        
        <!-- Badge Clôturé -->
        <span v-else-if="codir && codir?.statut === 'clos'" class="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-400 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600">
          <UIcon name="i-heroicons-lock-closed" class="w-3.5 h-3.5" /> Clôturé
        </span>
      </div>
    </div>

    <!-- RENDER WITH MULTIPLE REUSABLE COMPONENTS -->
    <div v-if="codir" class="mx-auto my-6 max-w-6xl space-y-6">
      
      <!-- COMPONENT 1: Validation block -->
      <CodirValidationBlock 
        :loading="presencesLoading" 
        :groups="presencesGroupees" 
      />

      <!-- COMPONENT 2: Compte rendu complete details -->
      <CodirCompteRenduBlock 
        :codir="codir" 
      />

    </div>

    <!-- ÉTAT REPOS / VIDE -->
    <div v-else class="flex flex-col items-center justify-center py-32 text-gray-400 mx-auto max-w-6xl bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mt-6">
      <span class="text-5xl mb-4">📄</span>
      <p class="text-sm">Aucun CODIR chargé. Retournez sur la page de détail.</p>
      <UButton class="mt-4" color="gray" variant="ghost" @click="router.back()">Retour</UButton>
    </div>

    <!-- Modale de Téléchargement (qui gère la confirmation après génération) -->
    <CodirDownloadModal 
      v-model="showPdfGeneratedModal" 
      :loading="pdfDownloading"
      :fileName="generatedPdfName"
      @confirm="handleDownloadPdf" 
    />

    <!-- Modale de Clôture -->
    <CodirClotureModal 
      v-model="showClotureModal" 
      :loading="cloturePending" 
      @confirm="confirmerCloture" 
    />

  </div>
</template>