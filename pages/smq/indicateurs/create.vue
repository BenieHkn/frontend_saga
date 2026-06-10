<template>
  <div class="smq-content">
    <SmqPageHeader
      overline="SMQ · Indicateurs"
      title="Paramétrage d'un indicateur"
    >
      <NuxtLink to="/smq/indicateurs" class="px-4 py-2 text-sm font-medium rounded-lg" style="color: var(--qp-fg-2)">
        Annuler
      </NuxtLink>
      <button
        class="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-white"
        style="background: var(--qp-primary-500)"
        :disabled="saving"
        @click="enregistrer"
      >
        <Icon name="heroicons:check" class="h-4 w-4" />
        {{ saving ? 'Enregistrement…' : 'Enregistrer l\'indicateur' }}
      </button>
    </SmqPageHeader>

    <div class="grid gap-4" style="grid-template-columns: 1fr 312px; align-items: start">
      <!-- Formulaire ------------------------------------------------------------ -->
      <div class="qp-card" style="overflow: hidden">

        <!-- 1 Identité -->
        <div class="section">
          <div class="section-head"><span class="n">1</span><h3>Identité</h3></div>
          <div class="form-grid">
            <div class="qp-field full">
              <label class="qp-label">Libellé <span class="req">*</span></label>
              <input v-model="form.libelle" class="qp-input" :class="{ 'is-error': errors.libelle }" placeholder="Ex. : Taux de conformité contrôle qualité" />
              <span v-if="errors.libelle" class="qp-hint" style="color:var(--qp-danger-500)">{{ errors.libelle }}</span>
            </div>
          </div>
          <p class="text-xs mt-2" style="color:var(--qp-fg-3)">
            <Icon name="heroicons:information-circle" class="h-3.5 w-3.5 inline-block mr-1" />
            Le code sera généré automatiquement à l'enregistrement (ex. : DPI001).
          </p>
        </div>

        <!-- 2 Entité pilote -->
        <div class="section">
          <div class="section-head"><span class="n">2</span><h3>Entité pilote</h3></div>

          <!-- Pilote : affichage auto de son entité -->
          <div v-if="isPilote" class="flex items-center gap-3 rounded-lg px-4 py-3" style="background:var(--qp-primary-50);border:1px solid var(--qp-primary-100)">
            <Icon name="heroicons:building-office-2" class="h-5 w-5 flex-none" style="color:var(--qp-primary-600)" />
            <div>
              <p class="text-sm font-semibold" style="color:var(--qp-primary-800);margin:0">{{ entitePilote?.libelle ?? '—' }}</p>
              <p class="text-xs" style="color:var(--qp-primary-600);margin:0">Votre entité — affectée automatiquement comme pilote</p>
            </div>
          </div>

          <!-- Admin : sélection parmi les entités premières avec recherche -->
          <div v-else class="form-grid">
            <div class="qp-field full" style="position:relative" ref="entiteDropdownRef">
              <label class="qp-label">Entité <span class="req">*</span></label>
              <div
                class="qp-input flex items-center gap-2 cursor-pointer"
                :class="{ 'is-error': errors.entite_id }"
                style="padding-right:10px"
                @click="entiteDropdownOpen = !entiteDropdownOpen"
              >
                <span class="flex-1 truncate" :style="!form.entite_id ? 'color:var(--qp-fg-3)' : ''">
                  {{ entitesPremières.find(e => e.id === form.entite_id)?.libelle ?? '— Choisir une entité —' }}
                </span>
                <Icon name="heroicons:chevron-down" class="h-4 w-4 flex-none" style="color:var(--qp-fg-3)" />
              </div>
              <div
                v-if="entiteDropdownOpen"
                class="rounded-lg overflow-hidden"
                style="position:absolute;z-index:50;top:100%;left:0;right:0;margin-top:4px;background:#fff;border:1px solid var(--qp-border-1);box-shadow:var(--qp-sh-2)"
              >
                <div class="p-2 border-b" style="border-color:var(--qp-border-2)">
                  <input
                    v-model="entiteSearch"
                    class="qp-input"
                    style="height:34px;font-size:13px"
                    placeholder="Rechercher une entité…"
                    @click.stop
                    autofocus
                  />
                </div>
                <div style="max-height:200px;overflow-y:auto">
                  <div
                    v-for="e in entitesFiltrees"
                    :key="e.id"
                    class="px-3 py-2.5 text-sm cursor-pointer hover:bg-gray-50"
                    :style="form.entite_id === e.id
                      ? 'background:var(--qp-primary-50);color:var(--qp-primary-700);font-weight:600'
                      : 'color:var(--qp-fg-1)'"
                    @click="selectionnerEntite(e)"
                  >
                    {{ e.libelle }}
                  </div>
                  <div v-if="!entitesFiltrees.length" class="px-3 py-3 text-sm" style="color:var(--qp-fg-3)">
                    Aucun résultat
                  </div>
                </div>
              </div>
              <span v-if="errors.entite_id" class="qp-hint" style="color:var(--qp-danger-500)">{{ errors.entite_id }}</span>
            </div>
          </div>
        </div>

        <!-- 3 Périodicité -->
        <div class="section">
          <div class="section-head"><span class="n">3</span><h3>Périodicité</h3></div>
          <div class="form-grid">
            <div class="qp-field">
              <label class="qp-label">Périodicité <span class="req">*</span></label>
              <select v-model="form.periodicite_id" class="qp-select">
                <option value="">— Choisir —</option>
                <option v-for="p in periodicites" :key="p.id" :value="p.id">{{ p.libelle }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 4 Type d'indicateur -->
        <div class="section">
          <div class="section-head"><span class="n">4</span><h3>Type d'indicateur</h3></div>
          <div class="flex gap-3">
            <label
              class="flex-1 flex items-start gap-3 rounded-xl px-4 py-3 cursor-pointer border transition-all"
              :style="form.type === 'calcul'
                ? 'border-color:var(--qp-primary-500);background:var(--qp-primary-50)'
                : 'border-color:var(--qp-border-1);background:#fff'"
            >
              <input type="radio" value="calcul" v-model="form.type" style="accent-color:var(--qp-primary-500);margin-top:3px" />
              <div>
                <p class="text-sm font-semibold" style="color:var(--qp-fg-1)">Indicateur de calcul</p>
                <p class="text-xs" style="color:var(--qp-fg-3)">Résultat = (Opérande 1 [opérateur] Opérande 2) × 100 — exprimé en %</p>
              </div>
            </label>
            <label
              class="flex-1 flex items-start gap-3 rounded-xl px-4 py-3 cursor-pointer border transition-all"
              :style="form.type === 'suivi'
                ? 'border-color:var(--qp-primary-500);background:var(--qp-primary-50)'
                : 'border-color:var(--qp-border-1);background:#fff'"
            >
              <input type="radio" value="suivi" v-model="form.type" style="accent-color:var(--qp-primary-500);margin-top:3px" />
              <div>
                <p class="text-sm font-semibold" style="color:var(--qp-fg-1)">Indicateur de suivi</p>
                <p class="text-xs" style="color:var(--qp-fg-3)">Valeur saisie directement — comparée à une cible absolue</p>
              </div>
            </label>
          </div>
        </div>

        <!-- 5 Clé de calcul (calcul seulement) -->
        <div v-if="form.type === 'calcul'" class="section">
          <div class="section-head"><span class="n">5</span><h3>Clé de calcul</h3></div>
          <div class="flex items-end gap-3 flex-wrap">
            <div class="qp-field flex-1" style="min-width:150px">
              <label class="qp-label">Libellé opérande 1 <span class="req">*</span></label>
              <input v-model="form.label_operande1" class="qp-input" placeholder="Ex. : Pièces conformes" />
            </div>
            <div class="qp-field" style="width:90px;flex:none">
              <label class="qp-label">Opérateur</label>
              <select v-model="form.operateur_id" class="qp-select qp-input--mono" style="text-align:center">
                <option v-for="op in operateurs" :key="op.id" :value="op.id">{{ op.signe }}</option>
              </select>
            </div>
            <div class="qp-field flex-1" style="min-width:150px">
              <label class="qp-label">Libellé opérande 2 <span class="req">*</span></label>
              <input v-model="form.label_operande2" class="qp-input" placeholder="Ex. : Pièces produites" />
            </div>
          </div>
          <div class="mt-3 rounded-lg p-3 text-sm qp-num" style="background:var(--qp-n-25);border:1px solid var(--qp-border-2);color:var(--qp-fg-2)">
            Aperçu : <strong style="color:var(--qp-primary-700)">{{ form.label_operande1 || 'Opérande 1' }}</strong>
            {{ operateurSigne }} <strong style="color:var(--qp-primary-700)">{{ form.label_operande2 || 'Opérande 2' }}</strong> = résultat
            <span v-if="operateurSigne === '÷'"> · division par zéro bloquée</span>
          </div>
        </div>

        <!-- 5 Valeur suivie (suivi seulement) -->
        <div v-if="form.type === 'suivi'" class="section">
          <div class="section-head"><span class="n">5</span><h3>Valeur suivie</h3></div>
          <div class="form-grid">
            <div class="qp-field full">
              <label class="qp-label">Libellé de la valeur <span class="req">*</span></label>
              <input v-model="form.label_valeur" class="qp-input" placeholder="Ex. : Nombre de véhicules réceptionnés" />
            </div>
          </div>
        </div>

        <!-- 6 Valeur cible -->
        <div class="section" style="border-bottom:0">
          <div class="section-head"><span class="n">6</span><h3>Valeur cible</h3></div>
          <div class="form-grid">
            <div class="qp-field">
              <label class="qp-label">
                Valeur cible{{ form.type === 'calcul' ? ' (%)' : '' }} <span class="req">*</span>
              </label>
              <div class="flex items-center gap-2">
                <input v-model.number="form.valeur_cible" class="qp-input qp-input--mono" inputmode="decimal" :class="{ 'is-error': errors.valeur_cible }" placeholder="Ex. : 85" style="flex:1" />
                <span v-if="form.type === 'calcul'" class="text-sm font-semibold" style="color:var(--qp-fg-2)">%</span>
              </div>
              <span v-if="errors.valeur_cible" class="qp-hint" style="color:var(--qp-danger-500)">{{ errors.valeur_cible }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Récapitulatif --------------------------------------------------------- -->
      <div class="qp-card qp-card--pad">
        <h3 class="font-semibold text-base mt-0 mb-2" style="color:var(--qp-fg-1)">Récapitulatif</h3>
        <div>
          <div v-for="r in recap" :key="r.label" class="flex justify-between py-2.5 border-b last:border-b-0 text-sm" style="border-color:var(--qp-border-2)">
            <span style="color:var(--qp-fg-3)">{{ r.label }}</span>
            <b class="qp-num font-semibold" style="color:var(--qp-fg-1)">{{ r.value || '—' }}</b>
          </div>
        </div>
        <div class="mt-4 rounded-lg p-3 flex gap-2.5" style="background:var(--qp-primary-50);border:1px solid var(--qp-primary-100)">
          <Icon name="heroicons:information-circle" class="h-5 w-5 flex-none" style="color:var(--qp-primary-600)" />
          <p class="text-xs" style="color:var(--qp-primary-800);margin:0;line-height:1.5">
            À l'enregistrement, l'indicateur passe en statut <strong>Brouillon</strong>.
          </p>
        </div>
        <div v-if="globalError" class="mt-4 rounded-lg p-3" style="background:var(--qp-danger-50);border:1px solid var(--qp-danger-100)">
          <p class="text-xs" style="color:var(--qp-danger-700);margin:0">{{ globalError }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useIndicateurs }  from '~/composables/smq/useIndicateurs'
import { useReferentiels } from '~/composables/smq/useReferentiels'
import { useAuth }         from '~/composables/auth/useAuth'

useHead({ title: 'Paramétrage indicateur — SMQ · SAGA' })

const router = useRouter()
const { createIndicateur } = useIndicateurs()
const { fetchPeriodicites, fetchOperateurs, fetchEntitesPremières } = useReferentiels()
const { isSmqAdmin, isSmqPilote, getSelectedEntite } = useAuth()

// Pilote = a le rôle smq_pilote SANS être admin
const isPilote     = computed(() => isSmqPilote() && !isSmqAdmin())
const entitePilote = computed(() => isPilote.value ? getSelectedEntite() : null)

const saving           = ref(false)
const globalError      = ref('')
const errors           = reactive({ libelle: '', valeur_cible: '', entite_id: '' })
const periodicites     = ref([])
const operateurs       = ref([])
const entitesPremières = ref([])

// ── Combobox entité ────────────────────────────────────────────────────────────
const entiteDropdownOpen = ref(false)
const entiteDropdownRef  = ref(null)
const entiteSearch       = ref('')

const entitesFiltrees = computed(() => {
  const q = entiteSearch.value.toLowerCase().trim()
  return q
    ? entitesPremières.value.filter(e => e.libelle.toLowerCase().includes(q))
    : entitesPremières.value
})

const selectionnerEntite = (e) => {
  form.entite_id           = e.id
  entiteDropdownOpen.value = false
  entiteSearch.value       = ''
}

const form = reactive({
  libelle: '',
  type: 'calcul',
  operateur_id: null, label_operande1: '', label_operande2: '',
  label_valeur: '',
  valeur_cible: null,
  periodicite_id: null,
  entite_id: '',
  actif: true,
})

const operateurSigne = computed(() => operateurs.value.find(o => o.id === form.operateur_id)?.signe ?? '÷')

const recap = computed(() => [
  { label: 'Code',        value: 'Généré automatiquement' },
  { label: 'Type',        value: form.type === 'suivi' ? 'Suivi' : 'Calcul' },
  { label: 'Entité',      value: isPilote.value
      ? entitePilote.value?.libelle
      : entitesPremières.value.find(e => e.id === form.entite_id)?.libelle },
  { label: 'Périodicité', value: periodicites.value.find(p => p.id === form.periodicite_id)?.libelle },
  { label: 'Cible',       value: form.valeur_cible !== null && form.valeur_cible !== ''
      ? (form.type === 'calcul' ? `${form.valeur_cible} %` : `${form.valeur_cible}`)
      : '' },
])

const valider = () => {
  errors.libelle      = form.libelle.trim() ? '' : 'Le libellé est obligatoire.'
  errors.valeur_cible = (form.valeur_cible !== null && form.valeur_cible !== '') ? '' : 'La valeur cible est obligatoire.'
  errors.entite_id    = (!isPilote.value && !form.entite_id) ? 'Veuillez choisir une entité.' : ''
  return !Object.values(errors).some(Boolean)
}

const enregistrer = async () => {
  globalError.value = ''
  if (!valider()) return
  saving.value = true
  try {
    const payload = {
      libelle:        form.libelle,
      type:           form.type,
      valeur_cible:   form.valeur_cible,
      periodicite_id: form.periodicite_id,
      actif:          form.actif,
    }
    if (form.type === 'calcul') {
      payload.operateur_id    = form.operateur_id
      payload.label_operande1 = form.label_operande1
      payload.label_operande2 = form.label_operande2
    } else {
      payload.label_valeur = form.label_valeur
    }
    // L'admin envoie entite_id ; le pilote laisse le backend récupérer son entité automatiquement
    if (!isPilote.value) payload.entite_id = form.entite_id

    await createIndicateur(payload)
    router.push('/smq/indicateurs')
  } catch (e) {
    if (e?.data?.errors) {
      Object.assign(errors, {
        libelle:      e.data.errors.libelle?.[0]      ?? '',
        valeur_cible: e.data.errors.valeur_cible?.[0] ?? '',
        entite_id:    e.data.errors.entite_id?.[0]    ?? '',
      })
    }
    globalError.value = e?.data?.message || 'Erreur lors de l\'enregistrement.'
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  document.addEventListener('click', (evt) => {
    if (entiteDropdownRef.value && !entiteDropdownRef.value.contains(evt.target)) {
      entiteDropdownOpen.value = false
    }
  })

  const promises = [fetchPeriodicites(), fetchOperateurs()]
  if (!isPilote.value) promises.push(fetchEntitesPremières())

  const results = await Promise.all(promises)
  periodicites.value     = results[0]
  operateurs.value       = results[1]
  if (!isPilote.value) entitesPremières.value = results[2]

  if (periodicites.value.length) form.periodicite_id = periodicites.value[0].id
  if (operateurs.value.length)   form.operateur_id   = operateurs.value[0].id
})
</script>

<style scoped>
.smq-content { font-family: 'IBM Plex Sans', system-ui, sans-serif; }
.section { padding: 22px 24px; border-bottom: 1px solid var(--qp-border-2); }
.section-head { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }
.section-head .n { width:24px;height:24px;border-radius:50%;background:var(--qp-primary-50);color:var(--qp-primary-700);display:grid;place-items:center;font-family:'IBM Plex Mono',monospace;font-size:12px;font-weight:600;flex:none; }
.section-head h3 { margin:0;font-size:1rem;font-weight:600;color:var(--qp-fg-1); }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.full { grid-column: 1 / -1; }
.req { color: var(--qp-danger-500); margin-left: 2px; }
</style>
