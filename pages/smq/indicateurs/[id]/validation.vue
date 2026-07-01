<template>
  <div class="smq-content">
    <SmqPageHeader
      overline="SMQ · File de validation"
      title="Saisies en attente"
    >
      <NuxtLink :to="`/smq/indicateurs/${id}/saisie`" class="px-4 py-2 text-sm font-medium rounded-lg" style="color: var(--qp-fg-2)">
        ← Retour à la saisie
      </NuxtLink>
      <button
        v-if="filSaisies.length > 1"
        class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border"
        style="background:#fff;border-color:var(--qp-border-1)"
        :disabled="savingAll"
        @click="toutValider"
      >
        <Icon name="heroicons:check-badge" class="h-4 w-4" />
        Tout valider
      </button>
    </SmqPageHeader>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="w-8 h-8 border-4 border-slate-200 rounded-full animate-spin" style="border-top-color: var(--qp-primary-500)" />
    </div>

    <div v-else class="grid gap-4" style="grid-template-columns: 300px 1fr; align-items: start">

      <!-- File -->
      <div class="qp-tablecard">
        <div style="padding:13px 16px;border-bottom:1px solid var(--qp-border-2);display:flex;align-items:center;justify-content:space-between">
          <h3 class="font-semibold text-sm" style="color:var(--qp-fg-1);margin:0">File de validation</h3>
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold" style="background:var(--qp-warning-50);color:var(--qp-warning-700);border:1px solid var(--qp-warning-200)">
            {{ filSaisies.length }}
          </span>
        </div>

        <div
          v-for="saisie in filSaisies"
          :key="saisie.id"
          class="cursor-pointer flex flex-col gap-1 px-4 py-3 border-b last:border-b-0 transition-all"
          :style="itemStyle(saisie)"
          @click="selectionner(saisie)"
        >
          <div class="flex items-center justify-between">
            <span class="qp-num text-xs" style="color:var(--qp-fg-3)">{{ saisie.indicateur?.code }}</span>
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" :style="conformiteStyle(saisie.conformite)">
              {{ conformiteLabel(saisie.conformite) }}
            </span>
          </div>
          <span class="text-sm font-medium" style="color:var(--qp-fg-1)">{{ saisie.indicateur?.libelle }}</span>
          <span class="text-xs" style="color:var(--qp-fg-3)">{{ formatPeriode(saisie) }} · {{ nomCopilote(saisie) }}</span>
        </div>

        <div v-if="!filSaisies.length" class="p-5 text-center text-sm" style="color:var(--qp-fg-3)">
          Aucune saisie en attente.
        </div>
      </div>

      <!-- Détail -->
      <div v-if="saisieCourante" class="qp-card" style="overflow:hidden">
        <div class="flex items-start justify-between px-5 pt-5 pb-4" style="border-bottom:1px solid var(--qp-border-2)">
          <div>
            <p class="qp-num text-sm mb-1" style="color:var(--qp-fg-3)">{{ saisieCourante.indicateur?.code }} · {{ formatPeriode(saisieCourante) }}</p>
            <h2 class="text-base font-semibold" style="color:var(--qp-fg-1);margin:0">{{ saisieCourante.indicateur?.libelle }}</h2>
          </div>
          <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium" style="background:var(--qp-primary-50);color:var(--qp-primary-700);border:1px solid var(--qp-primary-200)">Soumis</span>
        </div>

        <!-- Opérandes éditables + résultat -->
        <div class="px-5 py-4" style="border-bottom:1px solid var(--qp-border-2)">
          <h3 class="text-sm font-semibold mb-3" style="color:var(--qp-fg-1)">Données saisies</h3>
          <div class="grid gap-3" style="grid-template-columns:1fr auto 1fr">
            <div class="qp-field">
              <label class="qp-label">{{ saisieCourante.indicateur?.label_operande1 }}</label>
              <input v-model.number="editOp1" type="number" step="1" class="qp-input qp-input--mono" @input="calculerPreview" />
            </div>
            <div class="flex items-end justify-center pb-2.5">
              <p class="qp-num text-2xl font-bold" style="color:var(--qp-fg-3)">{{ saisieCourante.indicateur?.operateur?.signe }}</p>
            </div>
            <div class="qp-field">
              <label class="qp-label">{{ saisieCourante.indicateur?.label_operande2 }}</label>
              <input v-model.number="editOp2" type="number" step="1" class="qp-input qp-input--mono" @input="calculerPreview" />
            </div>
          </div>

          <!-- Résultat preview -->
          <div
            class="mt-3 flex items-center gap-4 rounded-lg px-4 py-3"
            :style="preview >= (saisieCourante.indicateur?.valeur_cible ?? 0)
              ? 'background:var(--qp-success-50);border:1px solid var(--qp-success-100)'
              : 'background:var(--qp-danger-50);border:1px solid var(--qp-danger-100)'"
          >
            <div>
              <p class="text-xs" style="color:var(--qp-fg-3)">Résultat (× 100)</p>
              <p class="qp-num text-2xl font-bold" :style="preview >= (saisieCourante.indicateur?.valeur_cible ?? 0) ? 'color:var(--qp-success-700)' : 'color:var(--qp-danger-700)'">
                {{ preview !== null ? formatPourcentage(preview) : '—' }}
              </p>
            </div>
            <div class="ml-auto text-right">
              <p class="text-xs mb-1" style="color:var(--qp-fg-3)">Cible</p>
              <p class="qp-num font-semibold" style="color:var(--qp-fg-1)">{{ saisieCourante.indicateur?.valeur_cible }} %</p>
            </div>
            <span v-if="preview !== null" class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
              :style="preview >= (saisieCourante.indicateur?.valeur_cible ?? 0)
                ? 'background:var(--qp-success-50);color:var(--qp-success-700);border:1px solid var(--qp-success-200)'
                : 'background:var(--qp-danger-50);color:var(--qp-danger-700);border:1px solid var(--qp-danger-200)'"
            >{{ preview >= (saisieCourante.indicateur?.valeur_cible ?? 0) ? 'Conforme' : 'Non conforme' }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-2.5 px-5 py-4">
          <button
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border"
            style="background:#fff;border-color:var(--qp-warning-300);color:var(--qp-warning-700)"
            :disabled="saving"
            @click="ouvrirMotif"
          >
            <Icon name="heroicons:arrow-uturn-left" class="h-4 w-4" />
            Retourner au copilote
          </button>
          <button
            class="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-white"
            style="background:var(--qp-success-600)"
            :disabled="saving"
            @click="validerSaisie"
          >
            <Icon name="heroicons:check-circle" class="h-4 w-4" />
            Valider
          </button>
        </div>
      </div>

      <div v-else class="qp-card qp-card--pad flex flex-col items-center justify-center gap-3" style="min-height:280px">
        <Icon name="heroicons:check-circle" class="h-10 w-10" style="color:var(--qp-success-400)" />
        <p class="text-sm" style="color:var(--qp-fg-3)">Sélectionnez une saisie dans la file.</p>
      </div>
    </div>

    <!-- Modal motif -->
    <div v-if="modalMotif" class="fixed inset-0 z-50 flex items-center justify-center" style="background:rgba(0,0,0,0.35)" @click.self="modalMotif = false">
      <div class="qp-card qp-card--pad" style="width:420px">
        <h3 class="font-semibold text-base mb-3" style="color:var(--qp-fg-1)">Motif du retour</h3>
        <textarea v-model="motifRetour" class="qp-textarea" rows="3" placeholder="Valeurs incorrectes, opérandes manquants…" />
        <div class="flex justify-end gap-2 mt-4">
          <button class="px-4 py-2 text-sm rounded-lg" style="color:var(--qp-fg-2)" @click="modalMotif = false">Annuler</button>
          <button
            class="px-4 py-2 text-sm font-semibold rounded-lg text-white"
            style="background:var(--qp-warning-600)"
            :disabled="saving || !motifRetour.trim()"
            @click="confirmerRetour"
          >Retourner</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSaisies }     from '~/composables/smq/useSaisies'
import { useIndicateurs } from '~/composables/smq/useIndicateurs'

const route = useRoute()
const id    = computed(() => route.params.id)

useHead({ title: 'Validation — SMQ · SAGA' })

const { fetchSaisies, valider, retourner, mettreAJourSaisie } = useSaisies()
const { formatPourcentage, initialesAvatar } = useIndicateurs()

const loading        = ref(true)
const saving         = ref(false)
const savingAll      = ref(false)
const filSaisies     = ref([])
const saisieCourante = ref(null)
const modalMotif     = ref(false)
const motifRetour    = ref('')

// Opérandes éditables par le pilote
const editOp1 = ref(null)
const editOp2 = ref(null)
const preview = ref(null)

// ── Helpers ───────────────────────────────────────────────────────────────────
const nomCopilote = (s) => {
  const u = s.copilote
  return u ? `${u.prenom ?? ''} ${u.nom ?? ''}`.trim() : '—'
}

const MOIS = ['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.']
const formatPeriode = (s) => {
  if (!s.date_debut) return '—'
  const d = new Date(s.date_debut)
  const f = s.date_fin ? new Date(s.date_fin) : null
  if (!f) return `${d.getDate()} ${MOIS[d.getMonth()]} ${d.getFullYear()}`
  if (d.getMonth() === f.getMonth()) return `${MOIS[d.getMonth()]} ${d.getFullYear()}`
  return `${MOIS[d.getMonth()]} → ${MOIS[f.getMonth()]} ${f.getFullYear()}`
}

const conformiteLabel = (c) => ({ conforme: 'Conforme', non_conforme: 'Non conforme', 'en attente': 'En attente' })[c] ?? '—'
const conformiteStyle = (c) => {
  if (c === 'conforme')     return 'background:var(--qp-success-50);color:var(--qp-success-700);border:1px solid var(--qp-success-200)'
  if (c === 'non_conforme') return 'background:var(--qp-danger-50);color:var(--qp-danger-700);border:1px solid var(--qp-danger-200)'
  return 'background:var(--qp-n-100);color:var(--qp-fg-3);border:1px solid var(--qp-border-1)'
}
const itemStyle = (s) => {
  const base = 'border-left:3px solid transparent;transition:background 0.1s;'
  return s.id === saisieCourante.value?.id
    ? base + 'background:var(--qp-primary-50);border-left-color:var(--qp-primary-500)'
    : base
}

// ── Chargement ────────────────────────────────────────────────────────────────
const charger = async () => {
  loading.value = true
  try {
    const res = await fetchSaisies({ indicateur_id: id.value, statut: 'soumis', per_page: 100 })
    filSaisies.value = res?.data ?? res ?? []
    if (filSaisies.value.length) selectionner(filSaisies.value[0])
  } catch (e) {
    console.error('Erreur validation :', e)
  } finally {
    loading.value = false
  }
}

const selectionner = (s) => {
  saisieCourante.value = s
  editOp1.value = s.operande1
  editOp2.value = s.operande2
  calculerPreview()
}

const calculerPreview = () => {
  const op1 = Math.trunc(Number(editOp1.value))
  const op2 = Math.trunc(Number(editOp2.value))
  if (!isFinite(op1) || !isFinite(op2) || op2 === 0) { preview.value = null; return }
  const signe = saisieCourante.value?.indicateur?.operateur?.signe ?? '÷'
  const base = signe === '÷' ? op1 / op2
             : signe === '×' ? op1 * op2
             : signe === '+' ? op1 + op2
             : signe === '−' ? op1 - op2 : null
  preview.value = base !== null ? base * 100 : null
}

// ── Actions ───────────────────────────────────────────────────────────────────
const retirerDeLaFile = (saisieId) => {
  filSaisies.value     = filSaisies.value.filter(s => s.id !== saisieId)
  saisieCourante.value = filSaisies.value[0] ?? null
}

const validerSaisie = async () => {
  if (!saisieCourante.value) return
  saving.value = true
  try {
    // Si le pilote a modifié les opérandes, mettre à jour avant de valider
    const op1Changed = editOp1.value !== saisieCourante.value.operande1
    const op2Changed = editOp2.value !== saisieCourante.value.operande2
    if (op1Changed || op2Changed) {
      await mettreAJourSaisie(saisieCourante.value.id, {
        operande1: editOp1.value,
        operande2: editOp2.value,
      })
    }
    await valider(saisieCourante.value.id)
    retirerDeLaFile(saisieCourante.value.id)
  } catch (e) { console.error('Validation :', e) }
  finally { saving.value = false }
}

const ouvrirMotif = () => { motifRetour.value = ''; modalMotif.value = true }

const confirmerRetour = async () => {
  saving.value = true
  try {
    await retourner(saisieCourante.value.id, motifRetour.value)
    modalMotif.value = false
    retirerDeLaFile(saisieCourante.value.id)
  } catch (e) { console.error('Retour :', e) }
  finally { saving.value = false }
}

const toutValider = async () => {
  savingAll.value = true
  try {
    for (const s of [...filSaisies.value]) await valider(s.id)
    filSaisies.value = []; saisieCourante.value = null
  } catch (e) { console.error('Tout valider :', e) }
  finally { savingAll.value = false }
}

onMounted(() => charger())
</script>

<style scoped>
.smq-content { }
</style>
