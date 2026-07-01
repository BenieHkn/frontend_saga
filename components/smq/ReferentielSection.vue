<template>
  <div>
    <!-- Erreur globale -->
    <div v-if="erreur" class="mb-3 px-4 py-2.5 rounded-lg text-sm" style="background:var(--qp-danger-50);color:var(--qp-danger-700);border:1px solid var(--qp-danger-100)">
      {{ erreur }}
    </div>

    <!-- Formulaire d'ajout -->
    <div class="qp-card qp-card--pad mb-4">
      <p class="text-xs font-semibold uppercase tracking-wide mb-3" style="color:var(--qp-fg-3)">
        Ajouter {{ titre }}
      </p>

      <div v-if="entiteRequired" class="mb-3 px-3 py-2 rounded-lg text-xs" style="background:var(--qp-warning-50);color:var(--qp-warning-700);border:1px solid var(--qp-warning-100)">
        Sélectionnez une entité pour ajouter un processus.
      </div>

      <div v-else-if="noAdd" class="mb-3 px-3 py-2 rounded-lg text-xs" style="background:var(--qp-primary-50);color:var(--qp-primary-700);border:1px solid var(--qp-primary-100)">
        Cette entité a déjà un processus. Modifiez-le directement dans la liste ci-dessous.
      </div>

      <div v-else class="flex flex-col gap-2.5">
        <div class="flex gap-2">
          <input
            v-model="nouveauLibelle"
            class="qp-input flex-1"
            style="height:36px;font-size:0.8125rem"
            :placeholder="`Libellé *`"
            @keydown.enter="soumettre"
          />
          <button
            class="px-4 py-2 text-sm font-semibold rounded-lg text-white flex items-center gap-1.5 transition-opacity"
            style="background:var(--qp-primary-500)"
            :disabled="saving || !nouveauLibelle.trim()"
            :style="{ opacity: saving || !nouveauLibelle.trim() ? 0.5 : 1 }"
            @click="soumettre"
          >
            <Icon name="heroicons:plus" class="h-4 w-4" />
            Ajouter
          </button>
        </div>

        <input
          v-if="champExtra"
          v-model="nouveauExtra"
          class="qp-input"
          style="height:34px;font-size:0.8125rem"
          :placeholder="labelExtra"
          @keydown.enter="soumettre"
        />
      </div>
    </div>

    <!-- Liste -->
    <div class="qp-tablecard">
      <table class="qp-table">
        <thead>
          <tr>
            <th>Libellé</th>
            <th v-if="champExtra">{{ labelExtra }}</th>
            <th v-if="$slots.badge">Entité</th>
            <th>Statut</th>
            <th style="width:88px" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">

            <!-- Libellé (édition inline) -->
            <td>
              <template v-if="editId === item.id">
                <input
                  v-model="editLibelle"
                  class="qp-input"
                  style="height:30px;font-size:0.8125rem;width:100%"
                  @keydown.enter="enregistrerEdit(item)"
                  @keydown.escape="annulerEdit"
                />
              </template>
              <template v-else>
                <span class="font-medium text-sm" style="color:var(--qp-fg-1)">{{ item.libelle }}</span>
              </template>
            </td>

            <!-- Champ extra -->
            <td v-if="champExtra">
              <template v-if="editId === item.id">
                <input
                  v-model="editExtra"
                  class="qp-input"
                  style="height:30px;font-size:0.8125rem;width:100%"
                  @keydown.enter="enregistrerEdit(item)"
                  @keydown.escape="annulerEdit"
                />
              </template>
              <template v-else>
                <span class="text-sm" style="color:var(--qp-fg-3)">{{ item[champExtra] || '—' }}</span>
              </template>
            </td>

            <!-- Badge entité (slot) -->
            <td v-if="$slots.badge">
              <slot name="badge" :item="item" />
            </td>

            <!-- Statut -->
            <td>
              <span
                class="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full cursor-pointer"
                :style="item.actif
                  ? 'background:var(--qp-success-50);color:var(--qp-success-700)'
                  : 'background:var(--qp-n-100);color:var(--qp-fg-3)'"
                @click="basculerActif(item)"
              >
                <span class="w-1.5 h-1.5 rounded-full" :style="{ background: item.actif ? 'var(--qp-success-500)' : 'var(--qp-n-400)' }" />
                {{ item.actif ? 'Actif' : 'Inactif' }}
              </span>
            </td>

            <!-- Actions -->
            <td>
              <div class="flex items-center gap-1">
                <!-- Édition inline -->
                <template v-if="editId === item.id">
                  <button
                    class="w-7 h-7 rounded flex items-center justify-center text-white"
                    style="background:var(--qp-primary-500)"
                    :disabled="saving"
                    @click="enregistrerEdit(item)"
                  ><Icon name="heroicons:check" class="h-3.5 w-3.5" /></button>
                  <button
                    class="w-7 h-7 rounded flex items-center justify-center"
                    style="color:var(--qp-fg-3)"
                    @click="annulerEdit"
                  ><Icon name="heroicons:x-mark" class="h-3.5 w-3.5" /></button>
                </template>
                <template v-else>
                  <button
                    class="w-7 h-7 rounded flex items-center justify-center transition-all"
                    style="color:var(--qp-fg-3)"
                    @click="commencerEdit(item)"
                    @mouseenter="$event.currentTarget.style.background='var(--qp-n-100)'"
                    @mouseleave="$event.currentTarget.style.background='transparent'"
                  ><Icon name="heroicons:pencil-square" class="h-4 w-4" /></button>
                  <button
                    class="w-7 h-7 rounded flex items-center justify-center transition-all"
                    style="color:var(--qp-danger-400)"
                    @click="demanderSupprimer(item)"
                    @mouseenter="$event.currentTarget.style.background='var(--qp-danger-50)'"
                    @mouseleave="$event.currentTarget.style.background='transparent'"
                  ><Icon name="heroicons:trash" class="h-4 w-4" /></button>
                </template>
              </div>
            </td>
          </tr>

          <tr v-if="!items.length">
            <td :colspan="colonnes" class="text-center py-10 text-sm" style="color:var(--qp-fg-3)">
              Aucun élément. Ajoutez le premier ci-dessus.
            </td>
          </tr>
        </tbody>
      </table>

      <div class="px-4 py-3 border-t text-xs" style="border-color:var(--qp-border-2);color:var(--qp-fg-3)">
        {{ items.length }} entrée{{ items.length !== 1 ? 's' : '' }}
      </div>
    </div>

    <!-- Confirmation suppression -->
    <Teleport to="body">
      <div
        v-if="confirmDeleteItem"
        class="fixed inset-0 flex items-center justify-center"
        style="z-index:9999;background:rgba(0,0,0,0.45)"
        @click.self="confirmDeleteItem = null"
      >
        <div class="bg-white rounded-2xl overflow-hidden text-center" style="width:360px;max-width:95vw">
          <div class="flex justify-center pt-8 pb-3">
            <div class="w-14 h-14 rounded-full flex items-center justify-center" style="background:var(--qp-danger-50)">
              <Icon name="heroicons:trash" class="h-7 w-7" style="color:var(--qp-danger-500)" />
            </div>
          </div>
          <h2 class="text-base font-bold px-6 mb-2" style="color:var(--qp-fg-1)">Supprimer</h2>
          <p class="text-sm px-6 mb-6" style="color:var(--qp-fg-2)">
            Supprimer <strong>« {{ confirmDeleteItem.libelle }} »</strong> ? Cette action est irréversible.
          </p>
          <div class="flex gap-3 px-6 pb-7">
            <button
              class="flex-1 py-2.5 text-sm rounded-xl border"
              style="border-color:var(--qp-border-1);color:var(--qp-fg-2)"
              @click="confirmDeleteItem = null"
            >Annuler</button>
            <button
              class="flex-1 py-2.5 text-sm font-semibold rounded-xl text-white"
              style="background:var(--qp-danger-500)"
              :disabled="saving"
              @click="confirmerSupprimer"
            >Supprimer</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
const props = defineProps({
  titre:          { type: String, default: '' },
  items:          { type: Array,  default: () => [] },
  saving:         { type: Boolean, default: false },
  erreur:         { type: String, default: '' },
  champExtra:     { type: String, default: '' },    // ex: 'description', 'adresse', 'contact'
  labelExtra:     { type: String, default: '' },
  extraPayload:   { type: Object, default: () => ({}) },  // ex: { entite_id: 3 }
  entiteRequired: { type: Boolean, default: false },
  noAdd:          { type: Boolean, default: false },
})

const emit = defineEmits(['ajouter', 'modifier', 'supprimer'])

// ── Formulaire ajout ─────────────────────────────────────────────────────────
const nouveauLibelle = ref('')
const nouveauExtra   = ref('')

const soumettre = () => {
  if (!nouveauLibelle.value.trim() || props.entiteRequired) return
  const payload = {
    libelle: nouveauLibelle.value.trim(),
    actif:   true,
    ...props.extraPayload,
  }
  if (props.champExtra && nouveauExtra.value.trim())
    payload[props.champExtra] = nouveauExtra.value.trim()
  emit('ajouter', payload)
  nouveauLibelle.value = ''
  nouveauExtra.value   = ''
}

// ── Édition inline ────────────────────────────────────────────────────────────
const editId      = ref(null)
const editLibelle = ref('')
const editExtra   = ref('')

const commencerEdit = (item) => {
  editId.value      = item.id
  editLibelle.value = item.libelle
  editExtra.value   = props.champExtra ? (item[props.champExtra] ?? '') : ''
}

const annulerEdit = () => { editId.value = null }

const enregistrerEdit = (item) => {
  if (!editLibelle.value.trim()) return
  const payload = {
    libelle: editLibelle.value.trim(),
    ...props.extraPayload,
  }
  if (props.champExtra)
    payload[props.champExtra] = editExtra.value.trim() || null
  emit('modifier', { id: item.id, payload })
  editId.value = null
}

// ── Bascule actif ─────────────────────────────────────────────────────────────
const basculerActif = (item) => {
  emit('modifier', { id: item.id, payload: { actif: !item.actif } })
}

// ── Suppression ───────────────────────────────────────────────────────────────
const confirmDeleteItem = ref(null)

const demanderSupprimer  = (item) => { confirmDeleteItem.value = item }
const confirmerSupprimer = () => {
  emit('supprimer', confirmDeleteItem.value.id)
  confirmDeleteItem.value = null
}

// ── Nb colonnes pour le colspan "vide" ────────────────────────────────────────
const slots = useSlots()
const colonnes = computed(() => {
  let n = 3 // libellé + statut + actions
  if (props.champExtra) n++
  if (slots.badge)      n++
  return n
})
</script>
