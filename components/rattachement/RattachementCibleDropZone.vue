<script setup>
const props = defineProps({
  cible:       { type: Object,  required: true }, // action ou activité
  taches:      { type: Array,   default: () => [] },
  fermee:      { type: Boolean, default: false },
  couleur:     { type: String,  default: "blue" }, // blue | violet
})

const emit = defineEmits(['retirer'])

// Couleurs dynamiques selon le type
const colors = computed(() => ({
  blue: {
    border:   props.fermee ? 'border-blue-400 dark:border-blue-600 shadow-lg shadow-blue-100 dark:shadow-blue-950/30' : 'border-dashed border-gray-300 dark:border-gray-700',
    dropzone: props.fermee ? 'bg-blue-50/50 dark:bg-blue-950/10' : 'bg-gray-50/50 dark:bg-slate-800/20',
    icon:     props.fermee ? 'text-blue-600 dark:text-blue-400' : 'text-blue-400',
    iconBg:   props.fermee ? 'bg-blue-100 dark:bg-blue-950/50' : 'bg-blue-50 dark:bg-blue-950/30',
    badge:    'border-blue-200 dark:border-blue-800',
    check:    'text-blue-500',
  },
  violet: {
    border:   props.fermee ? 'border-violet-400 dark:border-violet-600 shadow-lg shadow-violet-100 dark:shadow-violet-950/30' : 'border-dashed border-gray-300 dark:border-gray-700',
    dropzone: props.fermee ? 'bg-violet-50/50 dark:bg-violet-950/10' : 'bg-gray-50/50 dark:bg-slate-800/20',
    icon:     props.fermee ? 'text-violet-600 dark:text-violet-400' : 'text-violet-400',
    iconBg:   props.fermee ? 'bg-violet-100 dark:bg-violet-950/50' : 'bg-violet-50 dark:bg-violet-950/30',
    badge:    'border-violet-200 dark:border-violet-800',
    check:    'text-violet-500',
  },
}[props.couleur]))
</script>

<template>
  <div
    class="rounded-2xl overflow-hidden border-2 transition-all duration-300"
    :class="colors.border"
  >
    <!-- Header avec icône dossier animée -->
    <div class="p-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center gap-3">
      <Transition name="folder" mode="out-in">
        <div
          v-if="!fermee"
          key="open"
          class="w-10 h-10 rounded-xl flex items-center justify-center"
          :class="colors.iconBg"
        >
          <UIcon name="i-heroicons-folder-open" class="w-6 h-6" :class="colors.icon" />
        </div>
        <div
          v-else
          key="closed"
          class="w-10 h-10 rounded-xl flex items-center justify-center"
          :class="colors.iconBg"
        >
          <UIcon name="i-heroicons-folder" class="w-6 h-6" :class="colors.icon" />
        </div>
      </Transition>

      <div class="flex-1 min-w-0">
        <p class="font-semibold text-gray-900 dark:text-white text-sm truncate">{{ cible.libelle }}</p>
        <p class="text-xs text-gray-400">
          #{{ cible.id }} • {{ taches.length }} tâche(s) à rattacher
        </p>
      </div>
    </div>

    <!-- Zone de dépôt (le slot permet à la page parente d'y attacher la ref Sortable) -->
    <div
      class="p-4 min-h-[120px] transition-colors duration-300"
      :class="colors.dropzone"
    >
      <slot name="dropzone">
        <div
          v-if="!taches.length"
          class="flex flex-col items-center justify-center h-16 text-gray-300 dark:text-gray-600 gap-1 pointer-events-none"
        >
          <UIcon name="i-heroicons-arrow-down-tray" class="w-5 h-5" />
          <p class="text-xs">Déposez des tâches ici</p>
        </div>

        <div v-else class="flex flex-col gap-2">
          <div
            v-for="tache in taches"
            :key="tache.id"
            class="flex items-center gap-3 bg-white dark:bg-gray-900 border rounded-xl px-4 py-3"
            :class="colors.badge"
          >
            <UIcon name="i-heroicons-check-circle" class="w-4 h-4 shrink-0" :class="colors.check" />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ tache.intitule }}</p>
              <p class="text-xs text-gray-400">
                {{ new Date(tache.date_debut).toLocaleDateString('fr-FR') }}
                → {{ new Date(tache.date_fin).toLocaleDateString('fr-FR') }}
              </p>
            </div>
            <UButton
              icon="i-heroicons-x-mark"
              color="gray"
              variant="ghost"
              size="xs"
              @click="emit('retirer', tache)"
            />
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.folder-enter-active, .folder-leave-active { transition: all 0.2s ease; }
.folder-enter-from, .folder-leave-to { opacity: 0; transform: scale(0.8); }
</style>