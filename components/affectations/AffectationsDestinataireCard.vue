<template>
  <label
    class="flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all border-2"
    :class="disabled
      ? 'opacity-50 cursor-not-allowed bg-slate-50 border-slate-200'
      : selected
        ? 'bg-indigo-50 border-indigo-300 hover:border-indigo-400'
        : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30'"
  >
    <!-- Checkbox -->
    <input
      type="checkbox"
      :checked="selected"
      :disabled="disabled"
      @change="$emit('toggle', destinataire.id)"
      class="w-4 h-4 text-indigo-600 border-slate-300 rounded cursor-pointer mt-1 flex-shrink-0 disabled:cursor-not-allowed"
    />

    <!-- Contenu -->
    <div class="flex-1 min-w-0">
      <!-- Nom -->
      <p class="font-semibold text-slate-900">
        {{ destinataire.user?.nom }} {{ destinataire.user?.prenom }}
      </p>

      <!-- ✅ CORRECTION : Code de l'entité + Fonction ou Agent -->
      <p class="text-sm text-slate-700 mt-1">
        <span class="inline-block px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded font-medium mr-2 text-xs">
          {{ destinataire.entite?.code }}
        </span>
        <span class="text-slate-600">
          <span v-if="destinataire.is_responsable">
            {{ destinataire.entite?.fonction }}
          </span>
          <span v-else>
            Agent
          </span>
        </span>
      </p>

      <!-- Entité (optionnel, décommenté si besoin) -->
      <!-- <p class="text-xs text-slate-500 mt-2 truncate">
        📁 {{ destinataire.entite?.libelle }}
      </p> -->

      <!-- Email (optionnel, décommenté si besoin) -->
      <!-- <p class="text-xs text-slate-500 mt-1 truncate">
        ✉️ {{ destinataire.user?.email }}
      </p> -->

      <!-- Statut et badges (optionnel, décommenté si besoin) -->
      <!-- <div class="mt-3 flex items-center gap-2">
        <span
          class="inline-block w-2.5 h-2.5 rounded-full"
          :class="{
            'bg-green-500': destinataire.actif,
            'bg-red-500': !destinataire.actif
          }"
        />
        <span
          class="text-xs font-medium"
          :class="{
            'text-green-700': destinataire.actif,
            'text-red-700': !destinataire.actif
          }"
        >
          {{ destinataire.actif ? 'Actif' : 'Inactif' }}
        </span>

        <span v-if="destinataire.is_interim" class="text-xs font-medium text-orange-700 bg-orange-100 px-2 py-0.5 rounded ml-auto">
          Intérim
        </span>
      </div> -->
    </div>

    <!-- Indicateur sélection -->
    <div v-if="selected && !disabled" class="flex-shrink-0">
      <Icon name="i-heroicons-check-circle" class="w-5 h-5 text-indigo-600" />
    </div>

    <!-- Indicateur désactivé -->
    <div v-if="disabled" class="flex-shrink-0">
      <Icon name="i-heroicons-lock-closed" class="w-5 h-5 text-slate-400" />
    </div>
  </label>
</template>

<script setup>
defineProps({
  destinataire: {
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
</script>