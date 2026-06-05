<script setup>
import { formatDateFR, DOSSIER_STATUT_OPTIONS } from '@/composables/codirs/useCodir'

const props = defineProps({
  open:    { type: Boolean, default: false },
  dossier: { type: Object,  default: null },
})

const emit = defineEmits(['update:open'])

// ── isOpen ────────────────────────────────────────────────────────────────────
const isOpen = computed({
  get: () => props.open,
  set: (val) => emit('update:open', val),
})

const close = () => emit('update:open', false)

// ── Statut ───────────────────────────────────────────────────────────────────
const dossierStatutLabel = computed(() => {
  if (!props.dossier?.statut) return 'Non défini'
  const option = DOSSIER_STATUT_OPTIONS.find(o => o.value === props.dossier.statut)
  return option?.label ?? props.dossier.statut
})

const dossierStatutColor = computed(() => {
  const map = {
    'en_cours':     'blue',
    'realisee':     'green',
    'reconduit':    'yellow',
    'supprimee':    'red',
  }
  return map[props.dossier?.statut] ?? 'gray'
})

// ── Onglet actif ─────────────────────────────────────────────────────────────
const activeTab = ref(null)

const tabs = computed(() => [
  {
    id: 'taches',
    label: 'Tâches',
    icon: 'i-heroicons-clipboard-document-check',
    color: 'cyan',
    items: props.dossier?.taches ?? [],
    emptyMsg: 'Aucune tâche',
    itemKey: (t) => t.intitule,
  },
  {
    id: 'actions',
    label: 'Actions',
    icon: 'i-heroicons-rocket-launch',
    color: 'orange',
    items: props.dossier?.actions ?? [],
    emptyMsg: 'Aucune action',
    itemKey: (a) => a.libelle,
  },
  {
    id: 'activites',
    label: 'Activités',
    icon: 'i-heroicons-bolt',
    color: 'violet',
    items: props.dossier?.activites ?? [],
    emptyMsg: 'Aucune activité',
    itemKey: (a) => a.libelle,
  },
  {
    id: 'commentaires',
    label: 'Commentaires',
    icon: 'i-heroicons-chat-bubble-bottom-center-text',
    color: 'blue',
    items: props.dossier?.commentaires ?? [],
    emptyMsg: 'Aucun commentaire',
    itemKey: (c) => c.contenu,
  },
])

const activeTabData = computed(() => tabs.value.find(t => t.id === activeTab.value) ?? null)

const toggleTab = (id) => {
  activeTab.value = activeTab.value === id ? null : id
}

// Reset tab when dossier changes
watch(() => props.dossier, () => { activeTab.value = null })
</script>

<template>
  <UModal v-model="isOpen">
    <UCard v-if="dossier" class="rounded-2xl max-h-[85vh] flex flex-col">

      <!-- Header -->
      <template #header>
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950/40 flex items-center justify-center shrink-0">
              <UIcon name="i-heroicons-folder" class="w-5 h-5 text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <h2 class="text-lg font-bold text-gray-900 dark:text-white leading-tight">{{ dossier.libelle }}</h2>
              <div class="flex items-center gap-2 mt-0.5">
                <UBadge :color="dossierStatutColor" variant="subtle" size="xs">{{ dossierStatutLabel }}</UBadge>
                <span class="text-xs text-gray-400">Dossier #{{ dossier.id }}</span>
              </div>
            </div>
          </div>
          <UButton icon="i-heroicons-x-mark" color="gray" variant="ghost" size="xs" @click="close" />
        </div>
      </template>

      <!-- Content -->
      <div class="overflow-y-auto p-2 space-y-4">

        <!-- Description -->
        <div v-if="dossier.description" class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
          <p class="text-xs text-gray-400 mb-1 uppercase tracking-wide font-semibold">Description</p>
          <p class="text-gray-700 dark:text-gray-300 text-sm">{{ dossier.description }}</p>
        </div>

        <!-- ── 4 boutons toggle ──────────────────────────────────────────────── -->
        <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all cursor-pointer select-none"
            :class="activeTab === tab.id
              ? 'bg-gray-100 dark:bg-gray-700/60 border-gray-300 dark:border-gray-600 shadow-inner'
              : 'bg-gray-50 dark:bg-gray-800/40 border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/40 hover:shadow-sm'"
            @click="toggleTab(tab.id)"
          >
            <div
              class="w-8 h-8 rounded-lg flex items-center justify-center"
              :class="{
                'bg-cyan-100 dark:bg-cyan-900/30':   tab.id === 'taches',
                'bg-orange-100 dark:bg-orange-900/30': tab.id === 'actions',
                'bg-violet-100 dark:bg-violet-900/30': tab.id === 'activites',
                'bg-blue-100 dark:bg-blue-900/30':   tab.id === 'commentaires',
              }"
            >
              <UIcon
                :name="tab.icon"
                class="w-4 h-4"
                :class="{
                  'text-cyan-600 dark:text-cyan-400':   tab.id === 'taches',
                  'text-orange-600 dark:text-orange-400': tab.id === 'actions',
                  'text-violet-600 dark:text-violet-400': tab.id === 'activites',
                  'text-blue-600 dark:text-blue-400':   tab.id === 'commentaires',
                }"
              />
            </div>
            <span class="text-xs font-medium text-gray-700 dark:text-gray-300">{{ tab.label }}</span>
            <span
              class="text-xs font-bold px-2 py-0.5 rounded-full"
              :class="{
                'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300':     tab.id === 'taches',
                'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300': tab.id === 'actions',
                'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300': tab.id === 'activites',
                'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300':     tab.id === 'commentaires',
              }"
            >{{ tab.items.length }}</span>
          </button>
        </div>

        <!-- ── Liste active ─────────────────────────────────────────────────── -->
        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-1"
          mode="out-in"
        >
          <div v-if="activeTabData" :key="activeTab" class="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
            <div v-if="activeTabData.items.length === 0" class="py-8 text-center text-gray-400 text-sm">
              <UIcon :name="activeTabData.icon" class="w-8 h-8 mx-auto mb-2 opacity-30" />
              {{ activeTabData.emptyMsg }}
            </div>
            <ul v-else class="divide-y divide-gray-100 dark:divide-gray-700/60 max-h-52 overflow-y-auto">
              <li
                v-for="(item, i) in activeTabData.items"
                :key="item.id ?? i"
                class="flex items-center gap-3 px-3 py-2.5 text-sm"
              >
                <span class="shrink-0 w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-500">
                  {{ i + 1 }}
                </span>
                <span class="flex-1 text-gray-800 dark:text-gray-200 truncate">
                  {{ activeTabData.itemKey(item) }}
                </span>
              </li>
            </ul>
          </div>
        </Transition>

      </div>

      <!-- Footer -->
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" variant="ghost" @click="close">Fermer</UButton>
          <UButton color="sky" variant="soft" :to="`/dossiers/${dossier.id}`" icon="i-heroicons-arrow-top-right-on-square">
            Voir la page complète
          </UButton>
        </div>
      </template>

    </UCard>
  </UModal>
</template>
