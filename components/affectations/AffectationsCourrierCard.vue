<template>
  <div
    class="relative group p-4 rounded-xl border-2 transition-all"
    :class="disabled
      ? 'border-slate-200 bg-slate-50 cursor-not-allowed opacity-50'
      : selected 
        ? 'border-blue-500 bg-blue-50/50 shadow-md shadow-blue-100 cursor-pointer' 
        : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm cursor-pointer'"
    @click="!disabled && $emit('toggle')"
  >
    <div class="flex items-start justify-between gap-4">
      <!-- Icône et info -->
      <div class="flex items-start gap-3 flex-1 min-w-0">
        <!-- Icône document -->
        <div 
          class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
          :class="[
            disabled
              ? 'bg-slate-200 text-slate-400'
              : selected 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-500'
          ]"
        >
          <Icon 
            :name="courrier.confidentiel ? 'i-heroicons-lock-closed' : 'i-heroicons-document-text'" 
            class="w-5 h-5"
          />
        </div>

        <!-- Informations -->
        <div class="flex-1 min-w-0">
          <!-- Référence et Priorité -->
          <div class="mb-1">
            <div class="flex items-center gap-2">
              <h4 :class="[
                'font-bold text-base truncate',
                disabled ? 'text-slate-500' : 'text-blue-900'
              ]">
                {{ courrier.reference }}
              </h4>
              <UBadge 
                v-if="courrier.priority"
                :color="getPriorityColor(courrier.priority)"
                variant="soft"
                size="xs"
                class="flex-shrink-0"
              >
                {{ courrier.priority }}
              </UBadge>
            </div>
          </div>

          <!-- Objet -->
          <p :class="[
            'text-sm line-clamp-2 mb-2',
            disabled ? 'text-slate-500' : 'text-slate-700'
          ]">
            {{ courrier.objet }}
          </p>

          <!-- Métadonnées (affichées uniquement si sélectionné) -->
          <div v-if="selected" class="flex flex-wrap items-center gap-3 text-xs mt-2" :class="disabled ? 'text-slate-400' : 'text-slate-500'">
            <span class="flex items-center gap-1">
              <Icon name="i-heroicons-building-office-2" class="h-3 w-3" />
              {{ courrier.structure }}
            </span>
            <span class="flex items-center gap-1">
              <Icon name="i-heroicons-calendar" class="h-3 w-3" />
              {{ formatDate(courrier.date_courrier) }}
            </span>
            <span v-if="courrier.confidentiel" :class="disabled ? 'text-slate-400' : 'text-red-600'" class="flex items-center gap-1">
              <Icon name="i-heroicons-lock-closed" class="h-3 w-3" />
              Confidentiel
            </span>
          </div>

          <!-- Badge Disabled -->
          <div v-if="disabled" class="mt-2 flex items-center gap-2">
            <Icon name="i-heroicons-lock-closed" class="w-3 h-3 text-slate-400" />
            <span class="text-xs font-medium text-slate-500">Sélection unique activée</span>
          </div>
        </div>
      </div>

      <!-- Check Icon -->
      <div
        class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
        :class="[
          disabled
            ? 'bg-slate-300'
            : selected 
              ? 'bg-blue-500 scale-100' 
              : 'bg-slate-200 scale-90 opacity-40 group-hover:opacity-70'
        ]"
      >
        <Icon
          v-if="!disabled"
          name="i-heroicons-check"
          class="w-5 h-5 transition-all"
          :class="selected ? 'text-white' : 'text-slate-400'"
        />
        <Icon
          v-else
          name="i-heroicons-lock-closed"
          class="w-4 h-4 text-slate-500"
        />
      </div>
    </div>

    <!-- Selection Indicator -->
    <div
      v-if="selected && !disabled"
      class="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-blue-500/5 pointer-events-none"
    ></div>
  </div>
</template>

<script setup>
const props = defineProps({
  courrier: {
    type: Object,
    required: true
  },
  selected: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle'])

// Couleur du badge de priorité
const getPriorityColor = (priority) => {
  const colors = {
    'URGENT': 'red',
    'IMPORTANT': 'orange',
    'STANDARD': 'blue',
  }
  return colors[priority] || 'blue'
}

// Formater la date
const formatDate = (date) => {
  if (!date) return ''

  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>