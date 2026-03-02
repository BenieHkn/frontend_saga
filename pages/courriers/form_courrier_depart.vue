<template>
  <!-- Hauteur plein écran, overflow hidden pour gérer les scrolls séparément -->
  <div class="flex flex-col bg-gray-50" style="height: 100vh; overflow: hidden;">

    <!-- Bandeau mode réponse (fixe en haut) -->
    <div v-if="isReplyMode" class="flex-shrink-0 mx-6 mt-6 flex items-start gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl shadow-sm">
      <div class="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
        <Icon name="i-heroicons-arrow-uturn-right" class="w-5 h-5 text-emerald-600" />
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">En réponse au courrier</p>
        <p class="text-sm font-semibold text-gray-900 truncate">{{ replyDocumentSummary?.reference }}</p>
        <p class="text-xs text-gray-600 mt-0.5 line-clamp-2">{{ replyDocumentSummary?.objet }}</p>
        <div class="flex flex-wrap gap-3 mt-2">
          <span class="text-xs text-gray-500">N° {{ replyDocumentSummary?.numero_enreg }}</span>
          <span class="text-xs text-gray-400">•</span>
          <span class="text-xs text-gray-500">{{ formatDate(replyDocumentSummary?.date_enreg) }}</span>
          <span v-if="replyDocumentSummary?.type_document" class="text-xs text-gray-400">•</span>
          <span v-if="replyDocumentSummary?.type_document" class="text-xs text-indigo-600 font-medium">
            {{ replyDocumentSummary.type_document }}
          </span>
        </div>
      </div>
      <button @click="cancelReply" class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors">
        <Icon name="i-heroicons-x-mark" class="w-5 h-5" />
      </button>
    </div>

    <!-- Zone principale : 2 colonnes avec scrolls indépendants -->
    <div class="flex flex-1 overflow-hidden gap-6 p-6" style="min-height: 0;">

      <!-- ══════════════════════════════════
           COLONNE GAUCHE — scroll propre
           ══════════════════════════════════ -->
      <div class="flex flex-col overflow-y-auto" style="width: 420px; flex-shrink: 0;">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex-1">

          <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-900">
              {{ isReplyMode ? 'Répondre au courrier' : 'Nouveau Courrier Départ' }}
            </h1>
            <p class="text-gray-600 mt-1">
              {{ isReplyMode ? 'Rédiger et envoyer votre réponse' : 'Enregistrez un nouveau courrier départ' }}
            </p>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">

            <!-- Type de départ -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Type de départ *</label>
              <USelect v-model="form.type_depart" :options="[
                { label: 'Interne', value: 'interne' },
                { label: 'Externe', value: 'externe' },
              ]" class="w-full h-12" />
            </div>

            <!-- Type de document -->
            <div class="pt-4 border-t border-gray-100">
              <label class="block text-sm font-medium text-gray-700 mb-2">Type de document *</label>
              <USelectMenu
                v-model="form.type_document_id"
                :options="documentTypes"
                value-attribute="id"
                option-attribute="libelle"
                placeholder="Sélectionner le type"
                class="w-full"
                :loading="loadingTypes"
                :ui="{ height: 'h-[42px]' }"
              />
            </div>

            <!-- Destinataire + Date de départ -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Destinataire{{ isReplyMode ? ' *' : '' }}
                </label>
                <UInput v-model="form.destinataire" :placeholder="isReplyMode ? '' : 'Nom du destinataire'" class="w-full h-12" />
                <p v-if="isReplyMode" class="text-[11px] text-gray-400 mt-1">Pré-rempli depuis le courrier original</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Date de départ *</label>
                <UInput v-model="form.date_depart" type="date" class="w-full h-12" />
              </div>
            </div>

            <!-- Champs enregistrement + référence + dates -->
            <div class="pt-4 border-t border-gray-100 space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">N° d'enregistrement *</label>
                  <UInput v-model="form.numero_enreg" placeholder="Numéro" class="w-full h-12" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Date d'enregistrement *</label>
                  <UInput v-model="form.date_enreg" type="date" class="w-full h-12" />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Référence *</label>
                  <UInput v-model="form.reference" placeholder="Référence" class="w-full h-12" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Date du courrier *</label>
                  <UInput v-model="form.date_courier" type="date" class="w-full h-12" />
                </div>
              </div>

              <!-- Objet -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Objet</label>
                <UInput v-model="form.objet" placeholder="Objet du courrier (optionnel)" class="w-full h-12" />
              </div>

              <!-- ── Contenu document (Summernote) ── -->
              <div class="pt-4 border-t border-gray-100">
                <label class="block text-sm font-medium text-gray-700 mb-2">Contenu du document</label>
                <div ref="summernoteRef" />
              </div>

              <!-- Formule de clôture -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Formule de clôture</label>
                <textarea
                  v-model="docClosing"
                  rows="3"
                  class="w-full text-sm border border-gray-300 rounded-lg p-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white leading-relaxed"
                  placeholder="En foi de quoi, la présente attestation..."
                />
              </div>

              <!-- Signataire -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Signataire</label>
                <UInput v-model="docSignataire" placeholder="Nom du signataire" class="w-full h-12" />
              </div>

                <div class="flex items-center space-x-4">
                  <UCheckbox v-model="form.large_diffusion" label="Large diffusion" />
                  <!-- <UCheckbox v-model="form.confidentiel" label="Confidentiel" /> -->
                </div>

              <!-- Initiateurs -->
              <div v-if="!isReplyMode">
                <label class="block text-sm font-medium text-gray-700 mb-2">Initiateurs *</label>
                <USelectMenu
                  v-model="form.initiateurs"
                  :options="utilisateurs"
                  value-attribute="id"
                  option-attribute="display_name"
                  placeholder="Sélectionner les initiateurs"
                  class="w-full"
                  multiple
                  :loading="loadingUsers"
                  :ui="{ height: 'h-[42px]' }"
                />
                <p v-if="form.initiateurs.length > 0" class="text-xs text-green-600 mt-1">
                  {{ form.initiateurs.length }} initiateur(s) sélectionné(s)
                </p>
                <p v-else class="text-xs text-gray-500 mt-1">Sélectionnez un ou plusieurs initiateurs</p>
              </div>
            </div>

            <!-- Affectations (mode réponse) -->
            <div v-if="isReplyMode && courrierToReply?.affectations?.length" class="pt-4 border-t border-gray-100">
              <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Affectations du courrier original</p>
              <div class="space-y-2">
                <div v-for="affectation in affectesOptionsEnrichis" :key="affectation.affectation.id"
                  class="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                      <Icon name="i-heroicons-user" class="w-3.5 h-3.5 text-indigo-600" />
                    </div>
                    <div>
                      <p class="text-xs font-medium text-gray-800">{{ affectation.label }}</p>
                      <p v-if="affectation.matricule" class="text-[10px] text-gray-400">{{ affectation.matricule }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs px-2 py-0.5 rounded-full font-medium"
                      :class="{
                        'bg-amber-100 text-amber-700': affectation.affectation.statut === 'en cours',
                        'bg-green-100 text-green-700': affectation.affectation.statut === 'cloturé',
                      }">
                      {{ affectation.affectation.statut }}
                    </span>
                    <span class="text-[10px] text-gray-400 capitalize">{{ affectation.affectation.type_affectation }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Boutons -->
            <div class="flex justify-center space-x-4 pt-6 border-t border-gray-200">
              <UButton type="button" @click="handleCancel" color="gray" variant="outline">ANNULER</UButton>
              <UButton
                type="submit"
                :disabled="!isFormValid || loading"
                :loading="loading"
                class="bg-gradient-to-br from-emerald-800 to-blue-800 text-white dark:text-white"
              >
                {{ isReplyMode ? 'ENVOYER LA RÉPONSE' : 'SAUVEGARDER' }}
              </UButton>
            </div>

            <!-- Erreurs -->
            <div v-if="errors.length > 0" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <ul class="list-disc list-inside text-sm text-red-600 space-y-1">
                <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
              </ul>
            </div>
            <div v-if="errorRequest" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm font-medium text-red-700">
                {{ errorRequest.data?.message || errorRequest.message || 'Erreur inconnue' }}
              </p>
              <ul v-if="errorRequest.data?.errors" class="mt-2 list-disc list-inside text-xs text-red-500">
                <li v-for="(msgs, field) in errorRequest.data.errors" :key="field">
                  <span class="font-medium">{{ field }}</span> : {{ Array.isArray(msgs) ? msgs.join(', ') : msgs }}
                </li>
              </ul>
            </div>

          </form>
        </div>
      </div>

      <!-- ══════════════════════════════════
           COLONNE DROITE — scroll propre
           ══════════════════════════════════ -->
      <div class="flex flex-col flex-1 overflow-y-auto min-w-0">

        <!-- Barre de titre sticky -->
        <div class="flex-shrink-0 flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-emerald-800 to-blue-800 text-white rounded-t-lg">
          <div class="flex items-center gap-2">
            <Icon name="i-heroicons-document-text" class="w-4 h-4" />
            <span class="text-sm font-semibold">
              {{ selectedDocumentType?.libelle || 'Aperçu du document' }}
            </span>
          </div>
          <span class="text-xs text-white/60">Mis à jour en temps réel</span>
        </div>

        <!-- Zone fond gris contenant la feuille A4 -->
        <div class="flex-1 bg-gray-200 rounded-b-lg flex justify-center py-6 px-4">

          <!-- Feuille A4 — taille naturelle, pas de min-height forcé -->
          <div
            ref="documentRef"
            class="bg-white shadow-lg w-full"
            style="
              max-width: 210mm;
              font-family: 'Times New Roman', Times, serif;
              box-sizing: border-box;
              padding: 18mm 16mm 16mm;
            "
          >
            <!-- Ligne référence | Cotonou + date -->
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6mm;">
              <div style="font-size: 9pt; font-weight: bold; max-width: 55%;">
                {{ form.reference || 'N° ............' }}
              </div>
              <div style="font-size: 9pt; text-align: right; white-space: nowrap;">
                Cotonou, le {{ formatDisplayDate(form.date_courier) }}
              </div>
            </div>

            <!-- Objet (si rempli) -->
            <div v-if="form.objet" style="font-size: 10pt; margin-bottom: 5mm;">
              <span style="font-weight: bold;">Objet :</span>
              <span style="font-style: italic;"> {{ form.objet }}</span>
            </div>

            <!-- Titre parchemin -->
            <div style="text-align: center; margin: 0 0 8mm;">
              <div style="
                display: inline-block;
                border: 2.5px solid #111;
                padding: 8px 32px;
                position: relative;
                border-radius: 4px;
              ">
                <div style="
                  position: absolute; left: -11px; top: 50%; transform: translateY(-50%);
                  width: 18px; height: 34px; border: 2.5px solid #111;
                  border-radius: 50% 0 0 50%; background: white;
                "></div>
                <div style="
                  position: absolute; right: -11px; top: 50%; transform: translateY(-50%);
                  width: 18px; height: 34px; border: 2.5px solid #111;
                  border-radius: 0 50% 50% 0; background: white;
                "></div>
                <div style="font-size: 14pt; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; line-height: 1.3;">
                  {{ selectedDocumentType?.libelle || 'TYPE DE DOCUMENT' }}
                </div>
              </div>
            </div>

            <!-- Contenu (HTML depuis Summernote) -->
            <div
              class="document-content"
              style="font-size: 11pt; line-height: 1.85; text-align: justify; margin-bottom: 6mm;"
              v-html="docContent"
            />

            <!-- Formule de clôture -->
            <div
              v-if="docClosing"
              style="font-size: 11pt; line-height: 1.85; text-align: justify; margin-bottom: 8mm; white-space: pre-wrap;"
            >{{ docClosing }}</div>

            <!-- Signature -->
            <div style="text-align: right; margin-top: 8mm;">
              <div style="display: inline-block; text-align: center; min-width: 60mm;">
                <!-- Espace signature manuscrite -->
                <div style="height: 14mm;"></div>
                <div style="border-top: 1px solid #555; padding-top: 4px;">
                  <div style="font-size: 10pt; font-weight: bold;">{{ docSignataire }}</div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useCourriersStore } from '~/stores/courriers'

useHead({ title: "Courrier Départ - Sagar Revolution" })

const toast = useToast()
const config = useRuntimeConfig()

// ── Store ──────────────────────────────────────────────────────────────────────
const courriersStore = useCourriersStore()
const { isReplyMode, replyDocumentSummary, courrierToReply } = storeToRefs(courriersStore)

// ── État ───────────────────────────────────────────────────────────────────────
const loading = ref(false)
const loadingTypes = ref(false)
const loadingUsers = ref(false)
const authToken = ref('')
const errorRequest = ref(null)
const errors = ref([])
const documentTypes = ref([])
const utilisateurs = ref([])
const documentRef = ref(null)
const summernoteRef = ref(null)

// ── Champs document ────────────────────────────────────────────────────────────
const docContent = ref('')   // mis à jour par Summernote onChange
const docClosing = ref('En foi de quoi, la présente attestation lui est délivrée pour servir et valoir ce que de droit.')
const docSignataire = ref('Raoufou MAMAM')

/** Contenu initial Summernote — construit à partir du destinataire */
const buildInitialContent = (destinataire = '') => {
  const dest = destinataire ? ` <strong>${destinataire}</strong>` : '...'
  return `<p style="text-indent: 2em;">Je soussigné, <strong>Raoufou MAMAM</strong>, Directeur Général du Matériel et de la Logistique du Ministère de l'Economie et des Finances, atteste par la présente que${dest}</p>`
}

// ── Formulaire ─────────────────────────────────────────────────────────────────
const form = ref({
  type_depart: 'externe',
  numero_enreg: '',
  date_enreg: new Date().toISOString().split('T')[0],
  reference: '',
  date_courier: '',
  objet: '',
  large_diffusion: false,
  type_document_id: null,
  date_depart: '',
  destinataire: '',
  confidentiel: false,
  service_emis: '',
  initiateurs: [],
})

// ── Computed ───────────────────────────────────────────────────────────────────
const selectedDocumentType = computed(() =>
  documentTypes.value.find(dt => dt.id === form.value.type_document_id) || null
)

const isFormValid = computed(() => {
  const base =
    form.value.numero_enreg !== '' &&
    form.value.date_enreg !== '' &&
    form.value.reference !== '' &&
    form.value.date_courier !== '' &&
    form.value.type_document_id !== null &&
    form.value.type_depart !== '' &&
    form.value.date_depart !== ''
  if (isReplyMode.value) return base && form.value.destinataire !== ''
  return base && form.value.initiateurs.length > 0
})

// ── Helpers ────────────────────────────────────────────────────────────────────
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return '___________'
  try {
    return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
  } catch { return dateStr }
}

// ── Watcher destinataire → mise à jour auto du contenu Summernote ──────────────
// On écoute le destinataire SEULEMENT si le contenu est encore le contenu par défaut
// (évite d'écraser ce que l'utilisateur a rédigé manuellement)
const isContentDefault = ref(true)

watch(() => form.value.destinataire, (newDest) => {
  if (!isContentDefault.value) return
  const html = buildInitialContent(newDest)
  docContent.value = html
  // Mettre à jour l'éditeur Summernote si initialisé
  if (process.client && window.jQuery && summernoteRef.value) {
    window.jQuery(summernoteRef.value).summernote('code', html)
  }
})

// ── Summernote ─────────────────────────────────────────────────────────────────
const loadScript = (src) => new Promise((resolve, reject) => {
  if (document.querySelector(`script[src="${src}"]`)) { resolve(); return }
  const s = document.createElement('script')
  s.src = src; s.onload = resolve; s.onerror = reject
  document.head.appendChild(s)
})

const loadLink = (href) => {
  if (document.querySelector(`link[href="${href}"]`)) return
  const l = document.createElement('link')
  l.rel = 'stylesheet'; l.href = href
  document.head.appendChild(l)
}

const initSummernote = () => {
  if (!process.client || !window.jQuery || !summernoteRef.value) return

  const initialHtml = buildInitialContent(form.value.destinataire)
  docContent.value = initialHtml

  window.jQuery(summernoteRef.value).summernote({
    placeholder: 'Rédigez le contenu du document...',
    height: 200,
    lang: 'fr-FR',
    toolbar: [
      ['style', ['bold', 'italic', 'underline', 'clear']],
      ['para', ['ul', 'ol', 'paragraph']],
      ['insert', ['hr']],
      ['view', ['codeview']],
    ],
    callbacks: {
      onChange: (contents) => {
        docContent.value = contents
        // Dès que l'utilisateur modifie, on considère que ce n'est plus le contenu par défaut
        isContentDefault.value = false
      },
    },
  })

  window.jQuery(summernoteRef.value).summernote('code', initialHtml)
}

const destroySummernote = () => {
  if (process.client && window.jQuery && summernoteRef.value) {
    try { window.jQuery(summernoteRef.value).summernote('destroy') } catch {}
  }
}

// ── Génération PDF depuis le preview ──────────────────────────────────────────
const generatePDF = async () => {
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js')
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')

  const element = documentRef.value
  if (!element) throw new Error('Élément document introuvable')

  const canvas = await window.html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  })

  const { jsPDF } = window.jspdf

  // Calcul de la hauteur réelle du document en mm
  const pxPerMm = canvas.width / 210 / 2  // scale=2, largeur A4 = 210mm
  const contentHeightMm = Math.ceil(canvas.height / pxPerMm / 2)
  const pageHeightMm = Math.max(contentHeightMm + 10, 100) // marge basse de 10mm

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [210, pageHeightMm],
  })

  pdf.addImage(canvas.toDataURL('image/jpeg', 0.93), 'JPEG', 0, 0, 210, pageHeightMm)

  const pdfBlob = pdf.output('blob')
  const safeTitre = (selectedDocumentType.value?.libelle || 'document').replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '')
  const safeRef = (form.value.reference || 'ref').replace(/\//g, '-').replace(/[^a-zA-Z0-9_-]/g, '')

  return new File([pdfBlob], `${safeTitre}_${safeRef}.pdf`, { type: 'application/pdf' })
}

// ── Chargement données ─────────────────────────────────────────────────────────
const loadDocumentTypes = async () => {
  loadingTypes.value = true
  try {
    const response = await $fetch(`${config.public.apiBase}/type_documents`, {
      method: 'GET', headers: { Authorization: `Bearer ${authToken.value}` },
    })
    documentTypes.value = response?.data || response || []
  } catch {
    toast.add({ title: 'Erreur', description: 'Impossible de charger les types de documents', color: 'red', timeout: 3000 })
  } finally { loadingTypes.value = false }
}

const loadUtilisateurs = async () => {
  if (isReplyMode.value) return
  loadingUsers.value = true
  try {
    const response = await $fetch(`${config.public.apiBase}/entite-users`, {
      method: 'GET', headers: { Authorization: `Bearer ${authToken.value}` },
    })
    utilisateurs.value = (response?.data || response || []).map(user => ({
      id: user.id,
      display_name: `${user.user?.nom || ''} ${user.user?.prenom || ''} — ${user.entite?.code || user.entite?.libelle || ''}`.trim(),
    }))
  } catch {
    toast.add({ title: 'Erreur', description: 'Impossible de charger les initiateurs', color: 'red', timeout: 3000 })
  } finally { loadingUsers.value = false }
}

const affectesOptionsEnrichis = computed(() => {
  if (!courrierToReply.value?.affectations?.length) return []
  return courrierToReply.value.affectations.map((affectation) => {
    const u = affectation.user
    return {
      id: affectation.destinataire_id,
      label: u ? `${u.nom || ''} ${u.prenom || ''}`.trim() : `Destinataire #${affectation.destinataire_id}`,
      matricule: u?.matricule || '',
      affectation,
    }
  })
})

// ── Validation ─────────────────────────────────────────────────────────────────
const validateForm = () => {
  const e = []
  if (!form.value.numero_enreg) e.push("Le numéro d'enregistrement est obligatoire.")
  if (!form.value.date_enreg) e.push("La date d'enregistrement est obligatoire.")
  if (!form.value.reference) e.push('La référence est obligatoire.')
  if (!form.value.date_courier) e.push('La date du courrier est obligatoire.')
  if (!form.value.type_document_id) e.push('Le type de document est obligatoire.')
  if (!form.value.type_depart) e.push('Le type de départ est obligatoire.')
  if (!form.value.date_depart) e.push('La date de départ est obligatoire.')
  if (isReplyMode.value) {
    if (!form.value.destinataire) e.push('Le destinataire est obligatoire.')
  } else {
    if (!form.value.initiateurs.length) e.push('Veuillez sélectionner au moins un initiateur.')
  }
  errors.value = e
  return e.length === 0
}

// ── Handlers ──────────────────────────────────────────────────────────────────
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    form.value.url = file
  }
}

const resetForm = () => {
  form.value = {
    type_depart: 'externe',
    numero_enreg: '',
    date_enreg: new Date().toISOString().split('T')[0],
    reference: '',
    date_courier: '',
    objet: '',
    large_diffusion: false,
    url: null,
    type_document_id: null,
    date_depart: '',
    destinataire: '',
    confidentiel: false,
    service_emis: '',
    initiateurs: [],
  }
  selectedFile.value = null
  errors.value = []
  errorRequest.value = null
}

const cancelReply = () => {
  courriersStore.clearReply()
  navigateTo('/documents')
}

// ── Construction du FormData commun aux deux modes ────────────────────────────
const buildBaseFormData = (selectedFunction) => {
  const fd = new FormData()
  fd.append('numero_enreg',     form.value.numero_enreg)
  fd.append('date_enreg',       form.value.date_enreg)
  fd.append('reference',        form.value.reference)
  fd.append('date_courrier',    form.value.date_courier)
  fd.append('date_depart',      form.value.date_depart)
  fd.append('objet',            form.value.objet)
  fd.append('large_diffusion',  form.value.large_diffusion ? '1' : '0')
  fd.append('confidentiel',     form.value.confidentiel ? '1' : '0')
  fd.append('type_document_id', String(form.value.type_document_id))
  fd.append('type_depart',      form.value.type_depart)
  fd.append('service_emis',     selectedFunction?.code || 'Non défini')
  fd.append('destinataire',     form.value.destinataire || '')
  if (form.value.url) fd.append('fichier', form.value.url)
  return fd
}

// ── Soumission mode réponse : POST /courriers-departs/reponse ─────────────────
const submitReponse = async (selectedFunction) => {
  const fd = buildBaseFormData(selectedFunction)

  // Identifiant du document du courrier arrivé auquel on répond
  fd.append('courrier_arrive_document_id', String(courrierToReply.value.document.id))

  const response = await $fetch(`${config.public.apiBase}/courriers-departs/reponse`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${authToken.value}` },
    body: fd,
  })

  if (!response.success) {
    throw new Error(response.message || "Erreur lors de la création de la réponse")
  }

  return response
}

// ── Soumission mode création standard : POST /courriers-departs ───────────────
const submitCreation = async (selectedFunction) => {
  const fd = buildBaseFormData(selectedFunction)

  const initiateurIds = form.value.initiateurs.map(i => typeof i === 'object' ? i.id : i)
  initiateurIds.forEach((id, index) => {
    fd.append(`initiateurs[${index}]`, id)
  })

  const response = await $fetch(`${config.public.apiBase}/courriers-departs`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${authToken.value}` },
    body: fd,
  })

  if (!response.success) {
    throw new Error(response.message || "Erreur lors de la création du courrier")
  }

  return response
}

// ── Handler principal ─────────────────────────────────────────────────────────
const handleSubmit = async () => {
  loading.value = true
  errors.value = []
  errorRequest.value = null
  try {
    if (!validateForm()) {
      toast.add({ title: 'Erreur de validation', description: 'Veuillez remplir tous les champs obligatoires', color: 'red' })
      return
    }

    let selectedFunction = null
    if (process.client) {
      const saved = localStorage.getItem('selected_entite')
      if (saved) selectedFunction = JSON.parse(saved)
    }
    if (!selectedFunction) {
      toast.add({ title: 'Erreur', description: 'Aucune fonction sélectionnée. Veuillez vous reconnecter.', color: 'red' })
      return
    }

    toast.add({ title: 'Génération du document...', color: 'blue', timeout: 2500 })
    const pdfFile = await generatePDF()

    const fd = new FormData()
    fd.append('numero_enreg',     form.value.numero_enreg)
    fd.append('date_enreg',       form.value.date_enreg)
    fd.append('reference',        form.value.reference)
    fd.append('date_courrier',    form.value.date_courier)
    fd.append('date_depart',      form.value.date_depart)
    fd.append('objet',            form.value.objet || '')
    fd.append('large_diffusion',  form.value.large_diffusion ? '1' : '0')
    fd.append('confidentiel',     form.value.confidentiel ? '1' : '0')
    fd.append('type_document_id', String(form.value.type_document_id))
    fd.append('type_depart',      form.value.type_depart)
    fd.append('service_emis',     selectedFunction?.code || 'Non défini')
    fd.append('destinataire',     form.value.destinataire || '')
    fd.append('fichier',          pdfFile)

    if (isReplyMode.value) {
      fd.append('courrier_arrive_document_id', String(courrierToReply.value.document.id))
      const response = await $fetch(`${config.public.apiBase}/courriers-departs/reponse`, {
        method: 'POST', headers: { Authorization: `Bearer ${authToken.value}` }, body: fd,
      })
      if (!response.success) throw new Error(response.message || 'Erreur')
      courriersStore.clearReply()
      toast.add({ title: 'Réponse envoyée', description: 'Courrier créé et rattaché avec succès', color: 'green', icon: 'i-heroicons-check-circle' })
    } else {
      const initiateurIds = form.value.initiateurs.map(i => typeof i === 'object' ? i.id : i)
      initiateurIds.forEach((id, idx) => fd.append(`initiateurs[${idx}]`, id))
      const response = await $fetch(`${config.public.apiBase}/courriers-departs`, {
        method: 'POST', headers: { Authorization: `Bearer ${authToken.value}` }, body: fd,
      })
      if (!response.success) throw new Error(response.message || 'Erreur')
      toast.add({ title: 'Courrier créé', description: 'Le courrier départ a été enregistré avec succès', color: 'green', icon: 'i-heroicons-check-circle' })
    }

    resetForm()
    navigateTo('/documents')
  } catch (error) {
    console.error(error)
    errorRequest.value = error
    const description = error.data?.errors
      ? Object.values(error.data.errors).flat().join(' | ')
      : error.data?.message || error.message || 'Une erreur inattendue est survenue.'
    toast.add({ title: 'Erreur de soumission', description, color: 'red' })
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.value = {
    type_depart: 'externe', numero_enreg: '',
    date_enreg: new Date().toISOString().split('T')[0],
    reference: '', date_courier: '', objet: '',
    large_diffusion: false, type_document_id: null,
    date_depart: '', destinataire: '', confidentiel: false,
    service_emis: '', initiateurs: [],
  }
  isContentDefault.value = true
  docClosing.value = 'En foi de quoi, la présente attestation lui est délivrée pour servir et valoir ce que de droit.'
  docSignataire.value = 'Raoufou MAMAM'
  errors.value = []
  errorRequest.value = null
  const html = buildInitialContent('')
  docContent.value = html
  if (process.client && window.jQuery && summernoteRef.value) {
    window.jQuery(summernoteRef.value).summernote('code', html)
  }
}

const cancelReply = () => { courriersStore.clearReply(); navigateTo('/courriers') }
const handleCancel = () => { if (isReplyMode.value) courriersStore.clearReply(); navigateTo('/documents') }

// ── Lifecycle ──────────────────────────────────────────────────────────────────
onMounted(async () => {
  if (process.client) {
    authToken.value = localStorage.getItem('auth_token') || ''
  }
  if (isReplyMode.value && courrierToReply.value) {
    const c = courrierToReply.value
    form.value.destinataire = c.autre_structure || c.structure || ''
  }

  await Promise.all([loadDocumentTypes(), loadUtilisateurs()])

  if (process.client) {
    loadLink('https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.20/summernote-lite.min.css')
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js')
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.20/summernote-lite.min.js')
    await nextTick()
    initSummernote()
  }
})

onUnmounted(destroySummernote)
</script>

<style>
/* Summernote customisation */
.note-editor.note-frame,
.note-editor.note-airframe {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  overflow: hidden;
}
.note-toolbar {
  background: #f9fafb !important;
  border-bottom: 1px solid #e5e7eb !important;
  padding: 5px 8px !important;
}
.note-btn { border-radius: 4px !important; font-size: 12px !important; }
.note-editable {
  font-family: 'Times New Roman', Times, serif !important;
  font-size: 11pt !important;
  line-height: 1.85 !important;
  padding: 10px 12px !important;
  min-height: 120px;
}
.note-statusbar { display: none; }

/* Contenu document dans le preview */
.document-content p { margin: 0 0 0.3em; }
.document-content ul, .document-content ol { padding-left: 1.5em; margin: 0.3em 0; }
</style>