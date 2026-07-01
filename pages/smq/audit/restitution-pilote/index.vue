<script setup>

import Swal from 'sweetalert2'

const config = useRuntimeConfig()
const base   = computed(() => config.public.apiBase)

const h     = () => { const t = process.client ? localStorage.getItem('auth_token') : ''; return { Authorization: `Bearer ${t}`, Accept: 'application/json' } }
const hJson = () => ({ ...h(), 'Content-Type': 'application/json' })

// ── Entités de l'utilisateur en cours d'audit ─────────────────────────────
const auditEntites = ref([])
const loading      = ref(true)
const erreur       = ref(null)

const charger = async () => {
  loading.value = true
  erreur.value  = null
  try {
    const res = await $fetch(`${base.value}/smq/restitutions/mes-entites-en-audit`, { headers: h() })
    auditEntites.value = res?.data ?? res ?? []
  } catch (e) {
    erreur.value = e?.data?.message ?? 'Erreur chargement'
  } finally {
    loading.value = false
  }
}

onMounted(charger)

// ── Sélection d'une entité ────────────────────────────────────────────────
const selected     = ref(null)
const restitution  = ref(null)
const loadingFiche = ref(false)

const selectionner = async (ae) => {
  selected.value     = ae
  restitution.value  = null
  raisonRejet.value  = ''
  afficherFormRejet.value = false
  loadingFiche.value = true
  try {
    const res = await $fetch(`${base.value}/smq/restitutions/${ae.id}`, { headers: h() })
    restitution.value = res?.data ?? null
  } catch {}
  loadingFiche.value = false
}

// ── Télécharger PDF ───────────────────────────────────────────────────────
const telechargementPdf = ref(false)
const telechargerPdf = async () => {
  if (!selected.value) return
  telechargementPdf.value = true
  try {
    const token = process.client ? localStorage.getItem('auth_token') : ''
    const response = await fetch(`${base.value}/smq/restitutions/${selected.value.id}/pdf`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) throw new Error('Erreur téléchargement')
    const blob = await response.blob()
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `Restitution_${processusLabel(selected.value).replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  } catch {
    alert('Impossible de télécharger le PDF')
  } finally {
    telechargementPdf.value = false
  }
}

// ── Validation par le pilote ──────────────────────────────────────────────
const validant = ref(false)
const erreurAction = ref(null)

const valider = async () => {
  if (!selected.value) return
  const { isConfirmed } = await Swal.fire({
    title: 'Valider la restitution ?',
    html: `<p style="color:#374151">Le chef d'équipe <strong>ne pourra plus modifier</strong> cette restitution après validation.</p>`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Oui, valider',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#059669',
    cancelButtonColor: '#6b7280',
    reverseButtons: true,
  })
  if (!isConfirmed) return
  validant.value   = true
  erreurAction.value = null
  try {
    const res = await $fetch(`${base.value}/smq/restitutions/${selected.value.id}/valider-auditee`, {
      method: 'POST', headers: hJson(),
    })
    restitution.value = res?.data ?? restitution.value
    await charger()
    await Swal.fire({
      title: 'Restitution validée !',
      text: 'La restitution a bien été validée.',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
      confirmButtonColor: '#059669',
    })
  } catch (e) {
    erreurAction.value = e?.data?.message ?? 'Erreur lors de la validation'
  } finally {
    validant.value = false
  }
}

// ── Rejet avec raison ─────────────────────────────────────────────────────
const rejettant           = ref(false)
const raisonRejet         = ref('')
const afficherFormRejet   = ref(false)

const rejeter = async () => {
  if (!selected.value) return
  if (!raisonRejet.value.trim()) {
    erreurAction.value = 'Veuillez saisir la raison du rejet.'
    return
  }
  rejettant.value    = true
  erreurAction.value = null
  try {
    const res = await $fetch(`${base.value}/smq/restitutions/${selected.value.id}/rejeter`, {
      method: 'POST', headers: hJson(), body: { raison: raisonRejet.value },
    })
    restitution.value       = res?.data ?? restitution.value
    afficherFormRejet.value = false
    raisonRejet.value       = ''
    await charger()
    await Swal.fire({
      title: 'Restitution rejetée',
      text: 'Le chef d\'équipe a été notifié du rejet.',
      icon: 'info',
      timer: 2500,
      showConfirmButton: false,
    })
  } catch (e) {
    erreurAction.value = e?.data?.message ?? 'Erreur lors du rejet'
  } finally {
    rejettant.value = false
  }
}

// ── État de la restitution ────────────────────────────────────────────────
const estValidee  = computed(() => !!restitution.value?.validee_par_auditee)
const estCloturee = computed(() => !!restitution.value?.cloturee)
const estRejetee  = computed(() => !!restitution.value?.rejetee_par_pilote)
const peutAgir    = computed(() => !!restitution.value && !estValidee.value && !estCloturee.value)

// ── Helpers ───────────────────────────────────────────────────────────────
const processusLabel = (ae) => ae?.entite?.processus?.libelle ?? ae?.entite?.libelle ?? '—'
const auditLabel     = (ae) => ae?.audit ? (ae.audit.titre ?? `Audit #${ae.audit.id}`) : '—'

const fmtDate = (d) => {
  if (!d) return '—'
  const date = new Date(String(d).substring(0, 10) + 'T12:00:00')
  return isNaN(date.getTime()) ? '—' : date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

const fmtValeur = (v) => (v === null || v === undefined) ? '—' : Number(v).toLocaleString('fr-FR', { maximumFractionDigits: 3 })

const badgeConformite = (c) => ({
  conforme:     { label: 'Conforme',     bg: '#d1fae5', color: '#065f46' },
  non_conforme: { label: 'Non conforme', bg: '#fee2e2', color: '#991b1b' },
  en_attente:   { label: 'En attente',   bg: '#fef9c3', color: '#854d0e' },
})[c] ?? { label: c ?? '—', bg: '#f3f4f6', color: '#6b7280' }

const statutAe = (ae) => {
  if (!ae.restitution) return { label: 'En attente',  color: '#d97706', bg: '#fef3c7', icon: 'heroicons:clock-20-solid' }
  if (ae.restitution.cloturee)            return { label: 'Clôturée',   color: '#059669', bg: '#d1fae5', icon: 'heroicons:lock-closed-20-solid' }
  if (ae.restitution.validee_par_auditee) return { label: 'Validée',    color: '#2563eb', bg: '#dbeafe', icon: 'heroicons:check-badge-20-solid' }
  if (ae.restitution.rejetee_par_pilote)  return { label: 'Rejetée',    color: '#dc2626', bg: '#fee2e2', icon: 'heroicons:x-circle-20-solid' }
  return                                         { label: 'À valider',  color: '#f59e0b', bg: '#fef9c3', icon: 'heroicons:exclamation-circle-20-solid' }
}

// ── Parse le texte de la restitution pour l'affichage ─────────────────────
const parserListe = (text) => {
  if (!text?.trim()) return []
  return text.split('\n').filter(l => l.trim()).map(l => l.replace(/^[•\-\d.]+\s*/, '').trim()).filter(Boolean)
}
</script>

<template>
  <div class="smq-content">

    <SmqPageHeader overline="Audit qualité" title="Restitution — Validation pilote">
      <template v-if="selected && peutAgir">
        <!-- Valider -->
        <button :disabled="validant" @click="valider" class="qp-btn qp-btn--header-cta">
          <Icon v-if="validant" name="heroicons:arrow-path-20-solid" class="h-4 w-4 animate-spin" />
          <Icon v-else name="heroicons:check-badge-20-solid" class="h-4 w-4" />
          Valider la restitution
        </button>
        <!-- Rejeter -->
        <button :disabled="rejettant" @click="afficherFormRejet = !afficherFormRejet" class="qp-btn qp-btn--ghost">
          <Icon name="heroicons:x-circle-20-solid" class="h-4 w-4" />
          Rejeter
        </button>
      </template>
      <!-- PDF -->
      <button
        v-if="selected && restitution"
        :disabled="telechargementPdf"
        @click="telechargerPdf"
        class="qp-btn qp-btn--ghost"
      >
        <Icon v-if="telechargementPdf" name="heroicons:arrow-path-20-solid" class="h-4 w-4 animate-spin" />
        <Icon v-else name="heroicons:arrow-down-tray-20-solid" class="h-4 w-4" />
        PDF
      </button>
    </SmqPageHeader>

    <!-- Feedback -->
    <div v-if="erreurAction" class="mb-4 qp-alert qp-alert--danger text-sm">{{ erreurAction }}</div>

    <!-- Formulaire rejet -->
    <div v-if="afficherFormRejet" class="mb-5 rounded-xl border p-4 space-y-3" style="background:#fff1f2;border-color:#fca5a5">
      <p class="text-sm font-semibold" style="color:#b91c1c">Raison du rejet</p>
      <textarea
        v-model="raisonRejet"
        class="qp-input w-full text-sm"
        rows="3"
        style="resize:vertical"
        placeholder="Expliquez pourquoi vous rejetez cette restitution…"
      ></textarea>
      <div class="flex gap-2 justify-end">
        <button
          @click="afficherFormRejet = false; raisonRejet = ''"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150"
          style="background:#fff;color:#374151;border:1.5px solid #d1d5db;box-shadow:0 1px 3px rgba(0,0,0,.08)"
        >
          Annuler
        </button>
        <button
          :disabled="rejettant || !raisonRejet.trim()"
          @click="rejeter"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 disabled:opacity-60"
          style="background:linear-gradient(135deg,#dc2626,#b91c1c);color:#fff;box-shadow:0 2px 8px rgba(220,38,38,.35)"
        >
          <Icon v-if="rejettant" name="heroicons:arrow-path-20-solid" class="h-4 w-4 animate-spin" />
          <Icon v-else name="heroicons:x-circle-20-solid" class="h-4 w-4" />
          Confirmer le rejet
        </button>
      </div>
    </div>

    <!-- Bandeau statut -->
    <div v-if="selected && estValidee" class="mb-4 px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2" style="background:#f0fdf4;color:#15803d;border:1px solid #bbf7d0">
      <Icon name="heroicons:check-badge-20-solid" class="h-4 w-4 shrink-0" />
      Vous avez validé cette restitution.
    </div>
    <div v-if="selected && estRejetee" class="mb-4 px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2" style="background:#fff1f2;color:#b91c1c;border:1px solid #fca5a5">
      <Icon name="heroicons:x-circle-20-solid" class="h-4 w-4 shrink-0" />
      Restitution rejetée — en attente de correction par le chef d'équipe.
      <span v-if="restitution?.raison_rejet" class="ml-1 italic">« {{ restitution.raison_rejet }} »</span>
    </div>

    <div class="flex gap-6 items-start">

      <!-- ── Liste entités ── -->
      <div class="w-72 shrink-0">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-xs font-black uppercase tracking-widest" style="color:var(--qp-fg-3)">Mes entités en cours d'audit</h2>
        </div>

        <div v-if="loading" class="flex justify-center py-10">
          <div class="animate-spin h-6 w-6 rounded-full border-4 border-emerald-500 border-t-transparent"></div>
        </div>
        <div v-else-if="erreur" class="qp-alert qp-alert--danger text-sm">{{ erreur }}</div>
        <div v-else-if="!auditEntites.length" class="text-sm py-6 text-center" style="color:var(--qp-fg-4)">
          <Icon name="heroicons:magnifying-glass-circle-20-solid" class="h-10 w-10 mx-auto mb-2 opacity-30" />
          Aucune entité en cours d'audit
        </div>
        <div v-else class="space-y-2">
          <button
            v-for="ae in auditEntites" :key="ae.id"
            class="w-full text-left rounded-xl border px-4 py-3 transition-all"
            :class="selected?.id === ae.id ? 'border-emerald-500 bg-emerald-50 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'"
            @click="selectionner(ae)"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="font-semibold text-sm leading-snug" style="color:var(--qp-fg-0)">{{ processusLabel(ae) }}</div>
              <span
                class="shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                :style="{ background: statutAe(ae).bg, color: statutAe(ae).color }"
              >
                <Icon :name="statutAe(ae).icon" class="h-3 w-3" />
                {{ statutAe(ae).label }}
              </span>
            </div>
            <div class="text-xs mt-0.5" style="color:var(--qp-fg-3)">{{ auditLabel(ae) }}</div>
            <div v-if="ae.date" class="text-xs mt-0.5" style="color:var(--qp-fg-4)">{{ fmtDate(ae.date) }}</div>
          </button>
        </div>
      </div>

      <!-- ── Panneau restitution ── -->
      <div class="flex-1 min-w-0">

        <div v-if="!selected" class="flex flex-col items-center justify-center py-24 text-center" style="color:var(--qp-fg-4)">
          <Icon name="heroicons:document-magnifying-glass-20-solid" class="h-14 w-14 mb-3 opacity-25" />
          <p class="font-medium">Sélectionnez une entité pour consulter la restitution</p>
        </div>

        <div v-else-if="loadingFiche" class="flex justify-center py-20">
          <div class="animate-spin h-8 w-8 rounded-full border-4 border-emerald-500 border-t-transparent"></div>
        </div>

        <div v-else-if="!restitution" class="flex flex-col items-center justify-center py-20 text-center" style="color:var(--qp-fg-4)">
          <Icon name="heroicons:clock-20-solid" class="h-12 w-12 mb-3 opacity-25" />
          <p class="font-medium">Aucune restitution saisie pour cette entité.</p>
          <p class="text-sm mt-1">Le chef d'équipe n'a pas encore renseigné la restitution.</p>
        </div>

        <div v-else class="space-y-5">

          <!-- En-tête -->
          <div class="rounded-xl border px-5 py-4" style="background:#f9fafb;border-color:var(--qp-border-1)">
            <div class="text-lg font-bold" style="color:var(--qp-fg-0)">{{ processusLabel(selected) }}</div>
            <div class="text-sm mt-0.5" style="color:var(--qp-fg-3)">
              {{ auditLabel(selected) }}<span v-if="selected.date"> · {{ fmtDate(selected.date) }}</span>
            </div>
          </div>

          <!-- ── Écarts / Indicateurs ── -->
          <div v-if="restitution.ecarts" class="rounded-xl border overflow-hidden" style="border-color:var(--qp-border-1)">
            <div class="px-5 py-3" style="background:#fff1f2;border-bottom:1px solid var(--qp-border-1)">
              <span class="font-semibold text-sm flex items-center gap-1.5" style="color:#b91c1c">
                <Icon name="heroicons:exclamation-triangle-20-solid" class="h-4 w-4" />Écarts
              </span>
            </div>
            <div class="px-5 py-4">
              <p class="text-sm whitespace-pre-wrap" style="color:var(--qp-fg-1)">{{ restitution.ecarts }}</p>
            </div>
          </div>

          <!-- ── Points forts ── -->
          <div v-if="restitution.points_forts" class="rounded-xl border overflow-hidden" style="border-color:var(--qp-border-1)">
            <div class="px-5 py-3" style="background:#f0fdf4;border-bottom:1px solid var(--qp-border-1)">
              <span class="font-semibold text-sm flex items-center gap-1.5" style="color:#15803d">
                <Icon name="heroicons:hand-thumb-up-20-solid" class="h-4 w-4" />Points forts
              </span>
            </div>
            <div class="px-5 py-4 space-y-1.5">
              <div v-for="(item, i) in parserListe(restitution.points_forts)" :key="i" class="flex items-start gap-2 text-sm" style="color:var(--qp-fg-1)">
                <span class="text-emerald-600 shrink-0 mt-0.5">•</span>{{ item }}
              </div>
            </div>
          </div>

          <!-- ── Points faibles ── -->
          <div v-if="restitution.points_faibles" class="rounded-xl border overflow-hidden" style="border-color:var(--qp-border-1)">
            <div class="px-5 py-3" style="background:#fff7ed;border-bottom:1px solid var(--qp-border-1)">
              <span class="font-semibold text-sm flex items-center gap-1.5" style="color:#c2410c">
                <Icon name="heroicons:hand-thumb-down-20-solid" class="h-4 w-4" />Points faibles
              </span>
            </div>
            <div class="px-5 py-4 space-y-1.5">
              <div v-for="(item, i) in parserListe(restitution.points_faibles)" :key="i" class="flex items-start gap-2 text-sm" style="color:var(--qp-fg-1)">
                <span style="color:#c2410c" class="shrink-0 mt-0.5">•</span>{{ item }}
              </div>
            </div>
          </div>

          <!-- ── Recommandations ── -->
          <div v-if="restitution.recommandations" class="rounded-xl border overflow-hidden" style="border-color:var(--qp-border-1)">
            <div class="px-5 py-3" style="background:#eff6ff;border-bottom:1px solid var(--qp-border-1)">
              <span class="font-semibold text-sm flex items-center gap-1.5" style="color:#1d4ed8">
                <Icon name="heroicons:light-bulb-20-solid" class="h-4 w-4" />Recommandations
              </span>
            </div>
            <div class="px-5 py-4 space-y-1.5">
              <div v-for="(item, i) in parserListe(restitution.recommandations)" :key="i" class="flex items-start gap-2 text-sm" style="color:var(--qp-fg-1)">
                <span style="color:#1d4ed8" class="shrink-0 mt-0.5">•</span>{{ item }}
              </div>
            </div>
          </div>

          <!-- Rien à afficher -->
          <div
            v-if="!restitution.ecarts && !restitution.points_forts && !restitution.points_faibles && !restitution.recommandations"
            class="text-sm py-6 text-center" style="color:var(--qp-fg-4)"
          >
            La restitution est vide — le chef d'équipe n'a pas encore renseigné les données.
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
