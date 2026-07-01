<template>
  <div class="smq-content">
    <SmqPageHeader
      overline="Administration · Référentiels"
      title="Référentiels SMQ"
    />

    <!-- Onglets -->
    <div class="flex gap-1 mb-5 border-b" style="border-color:var(--qp-border-1)">
      <button
        v-for="tab in TABS"
        :key="tab.key"
        class="px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px"
        :style="onglet === tab.key
          ? 'border-color:var(--qp-primary-500);color:var(--qp-primary-600)'
          : 'border-color:transparent;color:var(--qp-fg-3)'"
        @click="onglet = tab.key"
      >{{ tab.label }}</button>
    </div>

    <div v-if="loading" class="flex justify-center py-16">
      <div class="w-7 h-7 border-4 border-slate-200 rounded-full animate-spin" style="border-top-color:var(--qp-primary-500)" />
    </div>

    <template v-else>

      <!-- Types d'audits -->
      <SmqReferentielSection
        v-if="onglet === 'types_audits'"
        titre="Types d'audits"
        :items="typesAudits"
        :saving="saving"
        :erreur="erreur"
        champ-extra="description"
        label-extra="Description"
        @ajouter="ajouterItem('types_audits', $event)"
        @modifier="modifierItem('types_audits', $event)"
        @supprimer="supprimerItem('types_audits', $event)"
      />

      <!-- Sites audités -->
      <SmqReferentielSection
        v-if="onglet === 'sites_audites'"
        titre="Sites audités"
        :items="sitesAudites"
        :saving="saving"
        :erreur="erreur"
        champ-extra="adresse"
        label-extra="Adresse / Localisation"
        @ajouter="ajouterItem('sites_audites', $event)"
        @modifier="modifierItem('sites_audites', $event)"
        @supprimer="supprimerItem('sites_audites', $event)"
      />

      <!-- Observateurs -->
      <SmqReferentielSection
        v-if="onglet === 'observateurs'"
        titre="Observateurs"
        :items="observateurs"
        :saving="saving"
        :erreur="erreur"
        champ-extra="contact"
        label-extra="Contact (email / tél)"
        @ajouter="ajouterItem('observateurs', $event)"
        @modifier="modifierItem('observateurs', $event)"
        @supprimer="supprimerItem('observateurs', $event)"
      />

      <!-- Processus -->
      <div v-if="onglet === 'processus'">
        <div class="flex items-center gap-3 mb-4">
          <label class="text-sm font-medium" style="color:var(--qp-fg-2)">Entité :</label>

          <!-- Combobox recherchable -->
          <div class="entite-combo" ref="comboRef">
            <!-- Champ visible -->
            <div class="entite-combo__field" :class="{ open: comboOpen }" @click="ouvrirCombo">
              <Icon name="heroicons:building-office-2-20-solid" class="entite-combo__icon" />
              <input
                ref="comboInput"
                v-model="comboSearch"
                class="entite-combo__input"
                :placeholder="entiteSelectionnee ? entiteSelectionneeLabel : '— Toutes les entités —'"
                @focus="comboOpen = true"
                @input="comboOpen = true"
                @keydown.escape="fermerCombo"
                @keydown.enter.prevent="selectionnerPremier"
                @keydown.arrow-down.prevent="naviguerCombo(1)"
                @keydown.arrow-up.prevent="naviguerCombo(-1)"
              />
              <button
                v-if="entiteSelectionnee"
                class="entite-combo__clear"
                title="Effacer"
                @click.stop="selectionnerEntite(null)"
              >
                <Icon name="heroicons:x-mark-20-solid" class="h-3.5 w-3.5" />
              </button>
              <Icon
                name="heroicons:chevron-down-20-solid"
                class="entite-combo__chevron"
                :class="{ rotated: comboOpen }"
              />
            </div>

            <!-- Dropdown -->
            <Transition name="combo-drop">
              <div v-if="comboOpen" class="entite-combo__dropdown">
                <!-- Toutes les entités -->
                <div
                  class="entite-combo__option entite-combo__option--all"
                  :class="{ active: !entiteSelectionnee }"
                  @mousedown.prevent="selectionnerEntite(null)"
                >
                  <Icon name="heroicons:globe-alt-20-solid" class="h-4 w-4 opacity-50" />
                  Toutes les entités
                </div>
                <div class="entite-combo__divider" />

                <!-- Résultats filtrés -->
                <template v-if="entitesFiltrees.length">
                  <div
                    v-for="(e, idx) in entitesFiltrees"
                    :key="e.id"
                    class="entite-combo__option"
                    :class="{ active: e.id === entiteSelectionnee, focused: idx === comboFocusIdx }"
                    @mousedown.prevent="selectionnerEntite(e)"
                  >
                    <span class="entite-combo__option-text">{{ e.libelle }}</span>
                    <Icon
                      v-if="e.id === entiteSelectionnee"
                      name="heroicons:check-20-solid"
                      class="h-4 w-4 flex-none"
                      style="color:var(--qp-primary-500)"
                    />
                  </div>
                </template>
                <div v-else class="entite-combo__empty">
                  Aucune entité trouvée
                </div>
              </div>
            </Transition>
          </div>

          <!-- Badge entité sélectionnée -->
          <span
            v-if="entiteSelectionnee"
            class="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm"
            style="background:#f1f5f9;color:var(--qp-n-700);border:1px solid #e2e8f0"
          >
            {{ entiteSelectionneeLabel }}
          </span>
        </div>

        <SmqReferentielSection
          titre="Processus"
          :items="processus"
          :saving="saving"
          :erreur="erreur"
          champ-extra="description"
          label-extra="Description"
          :extra-payload="{ entite_id: entiteSelectionnee || undefined }"
          :entite-required="!entiteSelectionnee"
          :no-add="!!entiteSelectionnee && processus.length >= 1"
          @ajouter="ajouterItem('processus', $event)"
          @modifier="modifierItem('processus', $event)"
          @supprimer="supprimerItem('processus', $event)"
        >
          <template #badge="{ item }">
            <span v-if="item.entite" class="text-sm" style="color:var(--qp-fg-2)">
              {{ item.entite.libelle }}
            </span>
          </template>
        </SmqReferentielSection>
      </div>

    </template>
  </div>
</template>

<script setup>
useHead({ title: 'Référentiels SMQ — SAGA' })

const config = useRuntimeConfig()
const route  = useRoute()
const router = useRouter()

const TABS = [
  { key: 'types_audits',  label: "Types d'audits" },
  { key: 'sites_audites', label: 'Sites audités' },
  { key: 'observateurs',  label: 'Observateurs' },
  { key: 'processus',     label: 'Processus' },
]
const TABS_KEYS = TABS.map(t => t.key)

const onglet = ref(
  TABS_KEYS.includes(route.query.tab) ? route.query.tab : 'types_audits'
)
// Sync depuis le menu (navigation externe avec ?tab=...)
watch(() => route.query.tab, (val) => {
  if (val && TABS_KEYS.includes(val) && val !== onglet.value) onglet.value = val
})
watch(onglet, (val) => router.replace({ query: { tab: val } }))

const loading            = ref(true)
const saving             = ref(false)
const erreur             = ref('')
const typesAudits        = ref([])
const sitesAudites       = ref([])
const observateurs       = ref([])
const processus          = ref([])
const entites            = ref([])
const entiteSelectionnee = ref('')

// ── Combobox entité ────────────────────────────────────────────────────────────
const comboOpen     = ref(false)
const comboSearch   = ref('')
const comboFocusIdx = ref(-1)
const comboRef      = ref(null)
const comboInput    = ref(null)

const entiteSelectionneeLabel = computed(() =>
  entites.value.find(e => e.id === entiteSelectionnee.value)?.libelle ?? ''
)

const entitesFiltrees = computed(() => {
  const q = comboSearch.value.trim().toLowerCase()
  if (!q) return entites.value
  return entites.value.filter(e => e.libelle.toLowerCase().includes(q))
})

const ouvrirCombo = () => {
  comboOpen.value     = true
  comboSearch.value   = ''
  comboFocusIdx.value = -1
  nextTick(() => comboInput.value?.focus())
}

const fermerCombo = () => {
  comboOpen.value     = false
  comboSearch.value   = ''
  comboFocusIdx.value = -1
}

const selectionnerEntite = (e) => {
  entiteSelectionnee.value = e ? e.id : ''
  fermerCombo()
  chargerProcessus()
}

const selectionnerPremier = () => {
  const liste = entitesFiltrees.value
  if (comboFocusIdx.value >= 0 && liste[comboFocusIdx.value]) {
    selectionnerEntite(liste[comboFocusIdx.value])
  } else if (liste.length === 1) {
    selectionnerEntite(liste[0])
  }
}

const naviguerCombo = (dir) => {
  const max = entitesFiltrees.value.length - 1
  comboFocusIdx.value = Math.max(-1, Math.min(max, comboFocusIdx.value + dir))
}

// Fermer si clic en dehors
const handleClickOutside = (e) => {
  if (comboRef.value && !comboRef.value.contains(e.target)) fermerCombo()
}
onMounted(() => document.addEventListener('mousedown', handleClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside))

// ── API helpers ────────────────────────────────────────────────────────────────
const authHeaders = () => ({
  Authorization: `Bearer ${process.client ? localStorage.getItem('auth_token') : ''}`,
  Accept: 'application/json',
})
const apiUrl = (path) => `${config.public.apiBase}/${path}`

// ── Endpoints par ressource ────────────────────────────────────────────────────
const ENDPOINTS = {
  types_audits:  'smq/types-audits',
  sites_audites: 'smq/sites-audites',
  observateurs:  'smq/observateurs',
  processus:     'smq/processus',
}

// ── Chargement initial ─────────────────────────────────────────────────────────
const chargerTout = async () => {
  loading.value = true
  erreur.value  = ''
  try {
    const results = await Promise.allSettled([
      $fetch(apiUrl('smq/types-audits'),  { headers: authHeaders() }),
      $fetch(apiUrl('smq/sites-audites'), { headers: authHeaders() }),
      $fetch(apiUrl('smq/observateurs'),  { headers: authHeaders() }),
      $fetch(apiUrl('entites'),           { headers: authHeaders() }),
    ])
    const labels = ['types-audits', 'sites-audites', 'observateurs', 'entites']
    results.forEach((r, i) => {
      if (r.status === 'rejected')
        console.error(`❌ ${labels[i]}:`, r.reason?.data?.message || r.reason?.message || r.reason)
    })
    const [ta, sa, obs, ent] = results
    typesAudits.value  = (ta.value?.data  ?? ta.value  ?? []).filter(Boolean)
    sitesAudites.value = (sa.value?.data  ?? sa.value  ?? []).filter(Boolean)
    observateurs.value = (obs.value?.data ?? obs.value ?? []).filter(Boolean)
    entites.value      = (ent.value?.data ?? ent.value ?? []).filter(Boolean)
  } catch (e) {
    erreur.value = e?.data?.message || 'Erreur lors du chargement.'
  } finally {
    loading.value = false
  }
}

const chargerProcessus = async () => {
  try {
    const params = entiteSelectionnee.value ? `?entite_id=${entiteSelectionnee.value}` : ''
    const res = await $fetch(apiUrl(`smq/processus${params}`), { headers: authHeaders() })
    processus.value = (res?.data ?? res ?? []).filter(Boolean)
  } catch (e) {
    processus.value = []
    console.error('Erreur processus:', e)
  }
}

// ── CRUD ───────────────────────────────────────────────────────────────────────
const ajouterItem = async (ressource, payload) => {
  saving.value = true
  erreur.value = ''
  try {
    await $fetch(apiUrl(ENDPOINTS[ressource]), {
      method: 'POST',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: payload,
    })
    await recharger(ressource)
  } catch (e) {
    erreur.value = e?.data?.message || `Erreur lors de l'ajout.`
  } finally {
    saving.value = false
  }
}

const modifierItem = async (ressource, { id, ...payload }) => {
  saving.value = true
  erreur.value = ''
  try {
    await $fetch(apiUrl(`${ENDPOINTS[ressource]}/${id}`), {
      method: 'PUT',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: payload,
    })
    await recharger(ressource)
  } catch (e) {
    erreur.value = e?.data?.message || 'Erreur lors de la modification.'
  } finally {
    saving.value = false
  }
}

const supprimerItem = async (ressource, id) => {
  saving.value = true
  erreur.value = ''
  try {
    await $fetch(apiUrl(`${ENDPOINTS[ressource]}/${id}`), {
      method: 'DELETE',
      headers: authHeaders(),
    })
    await recharger(ressource)
  } catch (e) {
    erreur.value = e?.data?.message || 'Erreur lors de la suppression.'
  } finally {
    saving.value = false
  }
}

const recharger = async (ressource) => {
  if (ressource === 'processus') {
    await chargerProcessus()
  } else {
    try {
      const res = await $fetch(apiUrl(ENDPOINTS[ressource]), { headers: authHeaders() })
      const list = (res?.data ?? res ?? []).filter(Boolean)
      if (ressource === 'types_audits')  typesAudits.value  = list
      if (ressource === 'sites_audites') sitesAudites.value = list
      if (ressource === 'observateurs')  observateurs.value = list
    } catch {}
  }
}

onMounted(async () => {
  await chargerTout()
  await chargerProcessus()
})
</script>

<style scoped>
.smq-content { }

/* ── Combobox entité ─────────────────────────────────────────────────────────── */
.entite-combo {
  position: relative;
  width: 300px;
}

.entite-combo__field {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 10px;
  background: #fff;
  border: 1.5px solid var(--qp-border-1);
  border-radius: 10px;
  cursor: pointer;
  transition: border-color 150ms, box-shadow 150ms;
}
.entite-combo__field:hover,
.entite-combo__field.open {
  border-color: var(--qp-primary-500);
  box-shadow: 0 0 0 3px rgba(31,157,82,.15);
}

.entite-combo__icon {
  width: 16px;
  height: 16px;
  color: var(--qp-fg-3);
  flex-shrink: 0;
}

.entite-combo__input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.8375rem;
  color: var(--qp-fg-1);
  font-family: inherit;
  min-width: 0;
}
.entite-combo__input::placeholder { color: var(--qp-fg-3); }

.entite-combo__clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: none;
  background: var(--qp-n-200);
  color: var(--qp-fg-2);
  cursor: pointer;
  flex-shrink: 0;
  transition: background 120ms;
}
.entite-combo__clear:hover { background: var(--qp-n-300); }

.entite-combo__chevron {
  width: 16px;
  height: 16px;
  color: var(--qp-fg-3);
  flex-shrink: 0;
  transition: transform 180ms ease;
}
.entite-combo__chevron.rotated { transform: rotate(180deg); }

/* Dropdown */
.entite-combo__dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  width: 100%;
  min-width: 280px;
  background: #fff;
  border: 1.5px solid var(--qp-border-1);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(15,27,45,.14), 0 2px 6px rgba(15,27,45,.08);
  z-index: 200;
  overflow: hidden;
  max-height: 280px;
  overflow-y: auto;
}

.entite-combo__option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  font-size: 0.875rem;
  color: var(--qp-fg-1);
  cursor: pointer;
  transition: background 100ms;
}
.entite-combo__option:hover,
.entite-combo__option.focused {
  background: var(--qp-n-50);
}
.entite-combo__option.active {
  background: var(--qp-primary-50);
  color: var(--qp-primary-700);
  font-weight: 600;
}
.entite-combo__option--all {
  font-size: 0.8125rem;
  color: var(--qp-fg-3);
}
.entite-combo__option-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.entite-combo__divider {
  height: 1px;
  background: var(--qp-border-2);
  margin: 2px 0;
}

.entite-combo__empty {
  padding: 12px 14px;
  font-size: 0.875rem;
  color: var(--qp-fg-3);
  text-align: center;
  font-style: italic;
}

/* Transition dropdown */
.combo-drop-enter-active,
.combo-drop-leave-active {
  transition: opacity 140ms ease, transform 140ms ease;
}
.combo-drop-enter-from,
.combo-drop-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
                                                                                                                                                                                                                                                                               