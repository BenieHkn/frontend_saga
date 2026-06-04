<script setup>
const props = defineProps({
  dossier: { type: Object, required: true },
  peutGererCodir: { type: Boolean, default: false },
  entiteUser: { type: Object, default: null },
  index: { type: Number, default: 0 },
})

const emit = defineEmits(['delete', 'click', 'commenter', 'lire-commentaires', 'edit', 'detail'])

const removeDossier = () => {
  emit('delete', props.dossier)
}

const editDossier = () => emit('edit', props.dossier)
const viewDetail = () => emit('detail', props.dossier)

const clickDossier = () => emit('click', props.dossier)
</script>

<template>
  <div
    class="flex items-center gap-3 bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/80 transition-colors"
    @click="clickDossier">
    
    <div class="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
      <span class="text-xs font-bold text-violet-600 dark:text-violet-300">{{ index + 1 }}</span>
    </div>
    
    <div class="min-w-0 flex-1">
      <p class="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{{ dossier.libelle }}</p>
      <p class="text-xs text-gray-400 mt-0.5">#{{ dossier.id }}</p>
    </div>
    
    <div class="flex items-center gap-2 shrink-0">
      <UButton 
        icon="i-heroicons-eye" 
        color="gray" 
        variant="ghost" 
        size="xs"
        title="Voir le détail"
        @click.stop="viewDetail" 
      />

      <UButton
        v-if="peutGererCodir"
        icon="i-heroicons-pencil" 
        color="blue" 
        variant="ghost" 
        size="xs"
        title="Modifier le dossier"
        @click.stop="editDossier" 
      />

      <div class="relative inline-block">
        <UButton 
          icon="i-heroicons-chat-bubble-bottom-center-text" 
          color="gray" 
          variant="ghost" 
          size="xs"
          title="Lire les commentaires"
          @click.stop="emit('lire-commentaires', dossier)" 
        />
        <span 
          v-if="(dossier.commentaires?.length ?? 0) > 0"
          class="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-4 px-1 flex items-center justify-center pointer-events-none border border-white dark:border-slate-800"
        >
          {{ dossier.commentaires.length }}
        </span>
      </div>

      <div class="relative inline-block">
        <UButton 
          icon="i-heroicons-chat-bubble-left-right" 
          color="blue" 
          variant="ghost" 
          size="xs"
          title="Ajouter un commentaire"
          @click.stop="emit('commenter', dossier)" 
        />
        <div class="absolute -bottom-0.5 -right-0.5 bg-blue-500 rounded-full p-0.5 flex items-center justify-center border border-white dark:border-slate-800 pointer-events-none">
          <UIcon name="i-heroicons-plus" class="w-2 h-2 text-white" />
        </div>
      </div>

      <UButton 
        v-if="peutGererCodir" 
        icon="i-heroicons-trash" 
        color="red" 
        variant="ghost" 
        size="xs"
        class="ml-1" 
        title="Supprimer le dossier"
        @click.stop="removeDossier" 
      />
    </div>
  </div>
</template>