<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">

    <PageHeader title="Nouvelle Affectation"
      description="Affecter un ou plusieurs courrier(s) à un ou plusieurs destinataire(s)" />

    <!-- ══════════════════════════════════════════════════════════════════ -->
    <!-- LAYOUT PRINCIPAL : 3 colonnes                                     -->
    <!-- Col 1 — Sélection courriers                                        -->
    <!-- Col 2 — Prévisualisation                                           -->
    <!-- Col 3 — Sélection destinataires                                    -->
    <!-- ══════════════════════════════════════════════════════════════════ -->
    <!-- Prévisualisation — pleine largeur -->
    <div class="mb-6 px-6">
      <AffectationsCourrierPreviewPanel />
    </div>

    <!-- Grille 2 colonnes : courriers + destinataires -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 px-6">
      <!-- Col 1 : Sélection courriers -->
      <AffectationsCourrierSelectionPanel :loading="courrierLoading" />
      <!-- Col 2 : Sélection destinataires -->
      <AffectationsDestinataireSelectionPanel :loading="destinataireLoading" />
    </div>

    <!-- Formulaire (pleine largeur) -->
    <div class="mb-8 px-6">
      <AffectationsFormPanel />
    </div>

    <!-- Barre de résumé -->
    <div class="px-6 mb-8">
      <AffectationsSummaryBar @cancel="handleCancel" @submit="handleSubmit" />
    </div>

    <!-- Overlay de chargement -->
    <div v-if="submitting" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4">
        <div class="flex flex-col items-center gap-4">
          <Icon name="svg-spinners:ring-resize" class="w-12 h-12 text-blue-600" />
          <h3 class="text-lg font-bold text-slate-900">Création en cours...</h3>
          <p class="text-sm text-slate-600 text-center">
            Création de {{ store.selectedDestinataires.length }} affectation(s) pour
            {{ store.selectedCourriers.length }} courrier(s)
          </p>
          <div class="w-full bg-slate-200 rounded-full h-2 mt-2 overflow-hidden">
            <div class="bg-blue-600 h-full animate-pulse" style="width: 100%"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAffectationsStore } from '~/stores/affectations'
import { useRoute } from 'vue-router'
import AffectationsCourrierSelectionPanel from '~/components/affectations/AffectationsCourrierSelectionPanel.vue'
import AffectationsCourrierPreviewPanel from '~/components/affectations/AffectationsCourrierPreviewPanel.vue'
import AffectationsDestinataireSelectionPanel from '~/components/affectations/AffectationsDestinataireSelectionPanel.vue'
import AffectationsFormPanel from '~/components/affectations/AffectationsFormPanel.vue'
import AffectationsSummaryBar from '~/components/affectations/AffectationsSummaryBar.vue'
import PageHeader from '~/components/PageHeader.vue'
import { useAuth } from '~/composables/auth/useAuth'

const config = useRuntimeConfig()

useHead({ title: 'Nouvelle Affectation' })

const store = useAffectationsStore()
const toast = useToast()
const router = useRouter()
const route = useRoute()
const { getEmetteurId, voitTousCourriers, isSA } = useAuth()

const authToken = ref('')
const courrierLoading = ref(false)
const destinataireLoading = ref(false)
const submitting = ref(false)
const preSelectedCourrierId = ref(null)

// ── Charger les courriers ─────────────────────────────────────────────────────
const loadCourriers = async () => {
  courrierLoading.value = true
  try {
    let selectedFunction = null
    if (process.client) {
      const saved = localStorage.getItem('selected_entite')
      if (saved) selectedFunction = JSON.parse(saved)
    }
    if (!selectedFunction?.id) {
      toast.add({ title: 'Erreur', description: 'Aucune fonction sélectionnée. Veuillez vous reconnecter.', color: 'red', timeout: 1500 })
      courrierLoading.value = false
      return
    }

    let entite_user = null
    if (process.client) {
      const saved = localStorage.getItem('entite_user')
      if (saved) entite_user = JSON.parse(saved)
    }
    if (!entite_user?.id) {
      toast.add({ title: 'Erreur', description: 'Aucune fonction utilisateur sélectionnée.', color: 'red', timeout: 1500 })
      courrierLoading.value = false
      return
    }

    const emetteurId = getEmetteurId() ?? entite_user.id
    const endpoint = (voitTousCourriers() || isSA())
      ? `${config.public.apiBase}/courriers-arrives/non-affectes`
      : `${config.public.apiBase}/courriers-arrives/affectes/entite-user/${emetteurId}`

    const response = await $fetch(endpoint, {
      method: 'GET',
      headers: { Authorization: `Bearer ${authToken.value}` },
    })

    const courriers = response.data.map(courrier => ({
      id: courrier.id,
      reference: courrier.document?.reference || '',
      objet: courrier.document?.objet || '',
      structure: courrier.structure || courrier.autre_structure || '',
      date_courrier: courrier.document?.date_courrier || '',
      priority: courrier.priority || 'STANDARD',
      confidentiel: courrier.document?.confidentiel || false,
      // URL complète construite pour le fetch Bearer (buildDocumentUrl côté panel)
      url: courrier.document?.url && courrier.document.url !== 'Inconnu'
        ? (() => {
          const base = config.public.apiBase.replace(/\/$/, '')
          const filename = courrier.document.url.startsWith('/') ? courrier.document.url.slice(1) : courrier.document.url
          if (!courrier.document.date_enreg) return `${base}/file/documents/${filename}`
          const d = new Date(courrier.document.date_enreg)
          const year = d.getFullYear()
          const month = String(d.getMonth() + 1).padStart(2, '0')
          const day = String(d.getDate()).padStart(2, '0')
          return `${base}/file/documents/${year}/${month}/${day}/${filename}`
        })()
        : '',
    }))

    store.setCourriers(courriers)

    // Appliquer la pré-sélection si présente
    if (preSelectedCourrierId.value) {
      const exists = courriers.some(c => c.id === preSelectedCourrierId.value)
      if (exists) {
        store.selectCourrierFromQuickAction(preSelectedCourrierId.value)
        setTimeout(() => {
          document.querySelector('[data-selected="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 500)
      } else {
        toast.add({ title: 'Avertissement', description: 'Le courrier sélectionné n\'est plus disponible', color: 'orange', timeout: 1500 })
      }
      preSelectedCourrierId.value = null
    }
  } catch (error) {
    console.error('❌ Erreur chargement courriers:', error)
    toast.add({ title: 'Erreur', description: 'Impossible de charger les courriers', color: 'red', timeout: 1500 })
  } finally {
    courrierLoading.value = false
  }
}

// ── Charger les destinataires ─────────────────────────────────────────────────
const loadDestinataires = async () => {
  destinataireLoading.value = true
  try {
    let entite_user = null
    if (process.client) {
      const saved = localStorage.getItem('entite_user')
      if (saved) entite_user = JSON.parse(saved)
    }
    if (!entite_user?.id) throw new Error('Aucune fonction sélectionnée. Veuillez vous reconnecter.')

    const emetteurId = getEmetteurId() ?? entite_user.id
    const response = await $fetch(`${config.public.apiBase}/entite-users/${emetteurId}/subordinates`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${authToken.value}` },
    })

    const destinataires = response.data
      .filter(item => item.user?.statut && item.actif)
      .map(item => ({
        id: item.id,
        user: item.user,
        entite: item.entite,
        actif: item.actif,
        is_interim: item.is_interim,
        is_responsable: item.is_responsable,
      }))

    store.setDestinataires(destinataires)
  } catch (error) {
    console.error('❌ Erreur chargement destinataires:', error)
    toast.add({ title: 'Erreur', description: 'Impossible de charger les utilisateurs', color: 'red', timeout: 1500 })
  } finally {
    destinataireLoading.value = false
  }
}

// ── Soumission ────────────────────────────────────────────────────────────────
const handleSubmit = async () => {
  if (store.selectedCourriers.length === 0) {
    toast.add({ title: 'Erreur', description: 'Veuillez sélectionner au moins un courrier', color: 'red', timeout: 1500 })
    return
  }
  if (store.selectedDestinataires.length === 0) {
    toast.add({ title: 'Erreur', description: 'Veuillez sélectionner au moins un destinataire', color: 'red', timeout: 1500 })
    return
  }

  submitting.value = true
  try {
    let entite_user = null
    if (process.client) {
      const saved = localStorage.getItem('entite_user')
      if (saved) entite_user = JSON.parse(saved)
    }
    if (!entite_user?.id) throw new Error('Aucune fonction sélectionnée. Veuillez vous reconnecter.')

    const emetteurId = getEmetteurId() ?? entite_user.id
    const isMultiCourrier = store.selectedCourriers.length > 1

    const affectations = []
    for (const courrierId of store.selectedCourriers) {
      for (const destinataireId of store.selectedDestinataires) {
        affectations.push({
          courrier_arrive_id: courrierId,
          destinataire_id: destinataireId,
          emetteur_id: emetteurId,
          date_affect: new Date().toISOString().split('T')[0],
          instructions: store.formData.instructions || null,
          statut: store.formData.statut,
          delai_traitement: store.formData.delai_traitement || null,
          date_cloture: store.showDateCloture && store.formData.date_cloture ? store.formData.date_cloture : null,
          dossier: isMultiCourrier && store.folderName ? store.folderName : null,
          priority: store.formData.priority,
        })
      }
    }

    const responses = await Promise.all(
      affectations.map(payload =>
        $fetch(`${config.public.apiBase}/affectations`, {
          method: 'POST',
          body: payload,
          headers: { Authorization: `Bearer ${authToken.value}`, 'Content-Type': 'application/json' },
        })
      )
    )

    const successCount = responses.filter(r => r.success).length
    const failureCount = responses.length - successCount

    if (failureCount === 0) {
      toast.add({ title: 'Succès ! 🎉', description: `${affectations.length} affectation(s) créée(s) avec succès`, color: 'green', timeout: 2000 })
      store.resetForm()
      setTimeout(() => router.push('/affectations-transferts'), 1500)
    } else {
      toast.add({ title: 'Avertissement', description: `${successCount} affectation(s) créée(s), ${failureCount} échec(s)`, color: 'orange', timeout: 1500 })
      submitting.value = false
    }
  } catch (error) {
    console.error('❌ Erreur création affectations:', error)
    let errorMessage = error.data?.message || error.message || 'Impossible de créer les affectations'
    const errorDetails = error.data?.errors
      ? Object.entries(error.data.errors).map(([f, m]) => `${f}: ${Array.isArray(m) ? m.join(', ') : m}`)
      : []
    toast.add({
      title: 'Erreur de validation',
      description: errorDetails.length ? `${errorMessage}\n\n${errorDetails.join('\n')}` : errorMessage,
      color: 'red',
      timeout: 5000,
    })
    submitting.value = false
  }
}

// ── Annulation ────────────────────────────────────────────────────────────────
const handleCancel = () => {
  if (confirm('Êtes-vous sûr de vouloir annuler ? Les données saisies seront perdues.')) {
    store.resetForm()
    router.push('/affectations-transferts')
  }
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(async () => {
  if (process.client) {
    authToken.value = localStorage.getItem('auth_token') || ''
    const savedId = sessionStorage.getItem('preselected_courrier_id')
    if (savedId) {
      preSelectedCourrierId.value = parseInt(savedId)
      sessionStorage.removeItem('preselected_courrier_id')
    }
  }

  if (!authToken.value) {
    toast.add({ title: 'Erreur', description: 'Token d\'authentification manquant. Veuillez vous reconnecter.', color: 'red', timeout: 1500 })
    router.push('/connexion')
    return
  }

  await Promise.all([loadCourriers(), loadDestinataires()])
})
</script>