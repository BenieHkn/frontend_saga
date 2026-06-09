<template>
  <div class="smq-content">
    <SmqPageHeader
      :overline="`Plan Audit Qualité · Exercice ${exerciceLabel}`"
      title="Plan Audit Qualité"
    >
      <!-- Sélecteur semestre -->
      <div class="qp-seg">
        <button v-for="s in ['S1','S2']" :key="s" :class="{ active: semestre === s }" @click="semestre = s; charger()">{{ s }}</button>
      </div>
      <button
        class="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-white"
        style="background: var(--qp-primary-500)"
        @click="ouvrirAudit(null)"
      >
        <Icon name="heroicons:plus" class="h-4 w-4" />
        Planifier un audit
      </button>
    </SmqPageHeader>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="w-8 h-8 border-4 border-slate-200 rounded-full animate-spin" style="border-top-color: var(--qp-primary-500)" />
    </div>

    <div v-else class="grid gap-4" style="grid-template-columns: 1fr 320px; align-items: start">

      <!-- ── Colonne principale : audits ──────────────────────────────────── -->
      <div>
        <div v-if="!audits.length" class="qp-card qp-card--pad text-center py-12 text-sm" style="color:var(--qp-fg-3)">
          Aucun audit planifié pour ce semestre.
        </div>

        <div
          v-for="audit in audits"
          :key="audit.id"
          class="rounded-lg overflow-hidden mb-3"
          style="border:1px solid var(--qp-border-1);background:#fff;box-shadow:var(--qp-sh-1)"
        >
          <!-- En-tête audit -->
          <div class="flex items-center gap-3 px-[18px] py-4">
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center flex-none"
              :style="iconStyleAudit(audit.statut)"
            >
              <Icon :name="iconAudit(audit.statut)" class="h-5 w-5" />
            </div>
            <div class="flex-1">
              <div class="font-semibold text-sm" style="color:var(--qp-fg-1)">{{ audit.titre || titreAudit(audit) }}</div>
              <div class="text-xs mt-0.5" style="color:var(--qp-fg-3)">
                {{ audit.referentiel }} · {{ audit.auditsEntites?.length ?? 0 }} visite{{ (audit.auditsEntites?.length ?? 0) !== 1 ? 's' : '' }}
                <span v-if="audit.pilote"> · pilote {{ audit.pilote }}</span>
              </div>
            </div>
            <span class="qp-badge" :class="badgeAuditStatut(audit.statut)">{{ labelAuditStatut(audit.statut) }}</span>
            <button
              class="w-8 h-8 rounded-md flex items-center justify-center transition-all text-xs"
              style="color:var(--qp-fg-3)"
              @click="ouvrirAudit(audit)"
            >
              <Icon name="heroicons:pencil-square" class="h-4 w-4" />
            </button>
          </div>

          <!-- Visites (auditsEntites) -->
          <div v-if="audit.auditsEntites?.length" class="px-[18px] py-1" style="background:var(--qp-n-25);border-top:1px solid var(--qp-border-2)">
            <div
              v-for="ae in audit.auditsEntites"
              :key="ae.id"
              class="flex items-center gap-3 py-2.5 border-b last:border-b-0"
              style="border-color:var(--qp-border-2)"
            >
              <!-- Date -->
              <span class="qp-num text-xs flex-none" style="color:var(--qp-fg-2);width:88px">
                {{ ae.date ? formatDate(ae.date) : 'Date à confirmer' }}
              </span>
              <!-- Libellé entité -->
              <span class="flex-1 text-sm" style="color:var(--qp-fg-1)">{{ ae.entite?.libelle ?? ae.libelle ?? '—' }}</span>
              <!-- Avatars participants -->
              <div class="flex" style="margin-left:-4px">
                <span
                  v-for="u in (ae.users ?? []).slice(0, 4)"
                  :key="u.id"
                  class="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-semibold"
                  style="border:2px solid var(--qp-n-25); margin-left:-6px"
                  :style="{ background: avatarCouleur(u.name) }"
                  :title="u.name"
                >{{ initialesAvatar(u.name) }}</span>
                <span
                  v-if="(ae.users ?? []).length > 4"
                  class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold"
                  style="border:2px solid var(--qp-n-25); margin-left:-6px; background:var(--qp-n-200); color:var(--qp-fg-2)"
                >+{{ ae.users.length - 4 }}</span>
              </div>
              <!-- Bouton ajouter recommandation -->
              <button
                class="w-7 h-7 rounded flex items-center justify-center transition-all"
                style="color:var(--qp-fg-3)"
                title="Ajouter une recommandation"
                @click="ouvrirRecommandation(ae)"
              >
                <Icon name="heroicons:chat-bubble-left-ellipsis" class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Colonne droite : recommandations ─────────────────────────────── -->
      <div class="qp-card qp-card--pad">
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-semibold text-base mt-0 mb-0" style="color:var(--qp-fg-1)">Recommandations</h3>
          <span class="qp-badge qp-badge--neutral">{{ recommandations.length }}</span>
        </div>
        <p class="qp-overline mb-3" style="display:block">Issues des dernières visites d'audit</p>

        <div v-if="!recommandations.length" class="text-sm" style="color:var(--qp-fg-3)">Aucune recommandation.</div>

        <div
          v-for="reco in recommandations"
          :key="reco.id"
          class="flex gap-3 py-3 border-b last:border-b-0"
          style="border-color:var(--qp-border-2)"
        >
          <span
            class="w-2 h-2 rounded-full mt-1.5 flex-none"
            :style="{ background: colorRecoStatut(reco.statut) }"
          />
          <div class="flex-1 min-w-0">
            <div class="text-sm" style="color:var(--qp-fg-1)">{{ reco.libelle }}</div>
            <div class="text-xs mt-0.5" style="color:var(--qp-fg-3)">
              {{ reco.auditEntite?.entite?.libelle ?? '—' }}
              <span v-if="reco.fac_reference"> · <span class="qp-num">{{ reco.fac_reference }}</span></span>
            </div>
          </div>
          <button
            class="w-7 h-7 rounded flex items-center justify-center flex-none"
            style="color:var(--qp-fg-3)"
            @click="toggleRecoStatut(reco)"
          >
            <Icon name="heroicons:check" class="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- ── Modal audit ──────────────────────────────────────────────────────── -->
    <UModal v-model="auditModalOpen" :ui="{ width: 'sm:max-w-lg' }">
      <div class="bg-white rounded-xl overflow-hidden">
        <div class="px-6 py-4 border-b" style="border-color:var(--qp-border-1)">
          <h2 class="font-semibold text-base" style="color:var(--qp-fg-1)">
            {{ auditEnCours?.id ? 'Modifier l\'audit' : 'Planifier un audit' }}
          </h2>
        </div>
        <div class="p-6 grid gap-4">
          <div class="qp-field">
            <label class="qp-label">Titre de l'audit <span class="req">*</span></label>
            <input v-model="auditForm.titre" class="qp-input" placeholder="Ex. : Audit interne — Direction Production" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="qp-field">
              <label class="qp-label">Référentiel</label>
              <input v-model="auditForm.referentiel" class="qp-input" placeholder="ISO 9001" />
            </div>
            <div class="qp-field">
              <label class="qp-label">Pilote</label>
              <input v-model="auditForm.pilote" class="qp-input" placeholder="Nom du pilote" />
            </div>
            <div class="qp-field">
              <label class="qp-label">Date de début</label>
              <input v-model="auditForm.date_debut" type="date" class="qp-input qp-input--mono" />
            </div>
            <div class="qp-field">
              <label class="qp-label">Date de fin</label>
              <input v-model="auditForm.date_fin" type="date" class="qp-input qp-input--mono" />
            </div>
          </div>
          <div class="qp-field">
            <label class="qp-label">Statut</label>
            <select v-model="auditForm.statut" class="qp-select">
              <option v-for="s in AUDIT_STATUTS" :key="s.value" :value="s.value">{{ s.label }}</option>
            </select>
          </div>
        </div>
        <div class="px-6 py-4 border-t flex justify-end gap-2.5" style="border-color:var(--qp-border-1)">
          <button class="px-4 py-2 text-sm rounded-lg border" style="border-color:var(--qp-border-1)" @click="auditModalOpen = false">Annuler</button>
          <button class="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-white" style="background:var(--qp-primary-500)" :disabled="saving" @click="sauvegarderAudit">
            <Icon name="heroicons:check" class="h-4 w-4" />
            {{ auditEnCours?.id ? 'Enregistrer' : 'Créer l\'audit' }}
          </button>
        </div>
      </div>
    </UModal>

    <!-- ── Modal recommandation ──────────────────────────────────────────── -->
    <UModal v-model="recoModalOpen" :ui="{ width: 'sm:max-w-md' }">
      <div class="bg-white rounded-xl overflow-hidden">
        <div class="px-6 py-4 border-b" style="border-color:var(--qp-border-1)">
          <h2 class="font-semibold text-base" style="color:var(--qp-fg-1)">Ajouter une recommandation</h2>
          <p class="text-xs mt-1" style="color:var(--qp-fg-3)">Visite : {{ recoAuditEntite?.entite?.libelle ?? '—' }}</p>
        </div>
        <div class="p-6 grid gap-4">
          <div class="qp-field">
            <label class="qp-label">Recommandation <span class="req">*</span></label>
            <textarea v-model="recoForm.libelle" class="qp-textarea" rows="3" placeholder="Décrivez la recommandation…" />
          </div>
          <div class="qp-field">
            <label class="qp-label">Statut</label>
            <select v-model="recoForm.statut" class="qp-select">
              <option v-for="s in RECO_STATUTS" :key="s.value" :value="s.value">{{ s.label }}</option>
            </select>
          </div>
        </div>
        <div class="px-6 py-4 border-t flex justify-end gap-2.5" style="border-color:var(--qp-border-1)">
          <button class="px-4 py-2 text-sm rounded-lg border" style="border-color:var(--qp-border-1)" @click="recoModalOpen = false">Annuler</button>
          <button class="px-4 py-2 text-sm font-semibold rounded-lg text-white" style="background:var(--qp-primary-500)" :disabled="saving" @click="sauvegarderReco">
            Ajouter
          </button>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup>
import { usePaq }          from '~/composables/smq/usePaq'
import { useReferentiels } from '~/composables/smq/useReferentiels'
import { useIndicateurs }  from '~/composables/smq/useIndicateurs'
import { useSmqStore }     from '~/stores/smq'

useHead({ title: 'Plan Audit Qualité — SMQ · SAGA' })

const store = useSmqStore()
const {
  fetchAudits, createAudit, updateAudit,
  fetchRecommandations, createRecommandation, updateRecommandation,
  AUDIT_STATUTS, badgeAuditStatut, labelAuditStatut,
  RECO_STATUTS, colorRecoStatut,
} = usePaq()
const { fetchExercices, fetchExerciceActif } = useReferentiels()
const { formatDate, initialesAvatar } = useIndicateurs()

const loading        = ref(true)
const saving         = ref(false)
const semestre       = ref('S1')
const audits         = ref([])
const recommandations = ref([])
const exercices      = ref([])
const exerciceActif  = ref(null)

const auditModalOpen = ref(false)
const auditEnCours   = ref(null)
const auditForm      = reactive({ titre: '', referentiel: '', pilote: '', date_debut: '', date_fin: '', statut: 'a_planifier', exercice_id: null })

const recoModalOpen    = ref(false)
const recoAuditEntite  = ref(null)
const recoForm         = reactive({ libelle: '', statut: 'ouvert' })

const exerciceLabel = computed(() => exerciceActif.value?.annee ?? '—')

const AVATAR_COLORS = ['#6E59C7', 'var(--qp-teal-500)', 'var(--qp-navy-500)', 'var(--qp-primary-500)']
const avatarCouleur = (n) => AVATAR_COLORS[(n?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length]

const titreAudit    = (a) => a.auditsEntites?.[0]?.entite?.libelle ? `Audit — ${a.auditsEntites[0].entite.libelle}` : 'Audit'
const iconAudit     = (s) => ({ realise: 'heroicons:clipboard-document-check', planifie: 'heroicons:compass', en_cours: 'heroicons:play-circle', a_planifier: 'heroicons:calendar-days' }[s] ?? 'heroicons:clipboard-document')
const iconStyleAudit = (s) => ({
  realise:     'background:var(--qp-success-50);color:var(--qp-success-600)',
  planifie:    'background:var(--qp-info-50);color:var(--qp-info-600)',
  en_cours:    'background:var(--qp-primary-50);color:var(--qp-primary-600)',
  a_planifier: 'background:var(--qp-warning-50);color:var(--qp-warning-700)',
}[s] ?? 'background:var(--qp-n-50);color:var(--qp-fg-2)')

const charger = async () => {
  loading.value = true
  try {
    const [auditList, recoList] = await Promise.all([
      fetchAudits({ exercice_id: exerciceActif.value?.id }),
      fetchRecommandations({ per_page: 20 }),
    ])
    audits.value          = auditList
    recommandations.value = recoList
  } catch (e) {
    console.error('❌ PAQ :', e)
  } finally {
    loading.value = false
  }
}

// ── Audit ────────────────────────────────────────────────────────────────────

const ouvrirAudit = (audit) => {
  auditEnCours.value = audit
  Object.assign(auditForm, {
    titre:       audit?.titre        ?? '',
    referentiel: audit?.referentiel  ?? '',
    pilote:      audit?.pilote       ?? '',
    date_debut:  audit?.date_debut   ?? '',
    date_fin:    audit?.date_fin     ?? '',
    statut:      audit?.statut       ?? 'a_planifier',
    exercice_id: exerciceActif.value?.id ?? null,
  })
  auditModalOpen.value = true
}

const sauvegarderAudit = async () => {
  saving.value = true
  try {
    if (auditEnCours.value?.id) await updateAudit(auditEnCours.value.id, auditForm)
    else                         await createAudit(auditForm)
    auditModalOpen.value = false
    await charger()
  } catch (e) {
    console.error('❌ Sauvegarde audit :', e)
  } finally {
    saving.value = false
  }
}

// ── Recommandations ───────────────────────────────────────────────────────────

const ouvrirRecommandation = (ae) => {
  recoAuditEntite.value = ae
  Object.assign(recoForm, { libelle: '', statut: 'ouvert', audit_entite_id: ae.id })
  recoModalOpen.value = true
}

const sauvegarderReco = async () => {
  if (!recoForm.libelle.trim()) return
  saving.value = true
  try {
    await createRecommandation({ ...recoForm })
    recoModalOpen.value = false
    const recoList = await fetchRecommandations({ per_page: 20 })
    recommandations.value = recoList
  } catch (e) {
    console.error('❌ Recommandation :', e)
  } finally {
    saving.value = false
  }
}

const toggleRecoStatut = async (reco) => {
  const next = reco.statut === 'clos' ? 'ouvert' : 'clos'
  try {
    await updateRecommandation(reco.id, { statut: next })
    reco.statut = next
  } catch (e) { console.error(e) }
}

onMounted(async () => {
  const [exList, exActif] = await Promise.all([fetchExercices(), fetchExerciceActif()])
  exercices.value    = exList
  exerciceActif.value = exActif ?? exList[0] ?? null
  await charger()
})
</script>

<style scoped>
.smq-content { font-family: 'IBM Plex Sans', system-ui, sans-serif; }
.req { color: var(--qp-danger-500); margin-left: 2px; }
</style>
