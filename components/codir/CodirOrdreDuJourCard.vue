<script setup>
defineProps({
  ordre: { type: Object, default: () => {} },
  peutGererCodir: { type: Boolean, default: false },
  index: { type: Number, default: 1 },
})

const emit = defineEmits(['attach', 'detach', 'commenter', 'voir-commentaires', 'voir-detail-ordre'])

const router = useRouter()

const statutClass = (statut) => {
  const map = {
    actif:   'text-green-600 bg-green-50 dark:bg-green-950/40',
    inactif: 'text-gray-500 bg-gray-100 dark:bg-gray-800/60',
    archivé: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40',
  }
  return map[statut] ?? 'text-gray-500 bg-gray-100'
}
</script>

<template>
    <div  class="flex flex-col gap-2">
      <div
        class="group flex items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-3 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900 transition-all cursor-pointer"
        @click="emit('voir-detail-ordre', ordre)"
      >
        <div class="flex items-center gap-3 min-w-0">
          <div class="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
            <span class="text-xs font-bold text-blue-600 dark:text-blue-300">{{ index + 1 }}</span>
          </div>
          <div class="min-w-0">
            <p class="text-sm font-medium truncate">{{ ordre.libelle }}</p>
            <span :class="`text-[10px] font-semibold capitalize ${statutClass(ordre.statut)}`">
              {{ ordre.statut }}
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors" />
          <!-- Bouton detach — stoppe la propagation pour ne pas naviguer -->
          <UButton
            icon="i-heroicons-x-mark"
            color="red"
            variant="ghost"
            size="xs"
            @click.stop="emit('detach', ordre.id)" 
            v-if="peutGererCodir"
          />

          <!-- Pour les commentaires -->
          <div class="relative">
            <UButton
              icon="i-heroicons-chat-bubble-left-right"
              color="blue"
              variant="ghost"
              size="xs"
              @click.stop="emit('commenter', ordre)"
            >
            <div class="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5 flex items-center justify-center">
              <UIcon name="i-heroicons-plus" class="w-2.5 h-2.5 text-white" />
            </div>
            </UButton>
          </div>

          <!-- Bouton pour voir la liste des commentaires -->
          <div class="relative">
            <UButton
              icon="i-heroicons-chat-bubble-bottom-center-text"
              color="gray"
              variant="ghost"
              size="xs"
              @click.stop="emit('voir-commentaires', ordre)"
            >
            <span v-if="ordre.commentaires?.length ?? 0> 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {{ ordre.commentaires.length }}
            </span>
            </UButton>
          </div>
        </div>
      </div>
    </div>
</template>