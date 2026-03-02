<script setup>

const props = defineProps({
  activite: { type: Object, required: true },
  numero:    { type: Number, required: false },
})

const emit = defineEmits(['updated', 'add-tache'])
const router = useRouter()

const goToActivite = () => {
  localStorage.setItem('currentActivite', JSON.stringify(props.activite))
  router.push(`/activites/${props.activite.id}`)
}
</script>

<template>
  <div
    class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
    @click="goToActivite"
  >
    <div class="flex items-start gap-3">
      <!-- Icône -->
      <div class="w-9 h-9 rounded-lg bg-violet-100 dark:bg-violet-950/40 flex items-center justify-center shrink-0 mt-0.5">
        
        <UIcon name="i-heroicons-bolt" class="w-5 h-5 text-violet-600 dark:text-violet-400" v-if="!numero"/>
        <span class="text-xs font-bold text-violet-600 dark:text-violet-300" v-else>{{ numero }}</span>
      </div>

      <!-- Contenu -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between gap-2">
          <p class="font-medium text-gray-900 dark:text-white text-sm truncate">
            {{ activite.libelle }}
          </p>
          <div class="flex items-center gap-2 shrink-0">
            <UBadge color="violet" variant="soft" size="xs">
              {{ activite.taches?.length ?? 0 }} tâche(s)
            </UBadge>
            <UButton
              icon="i-heroicons-plus"
              color="blue"
              variant="soft"
              size="2xs"
              @click.stop="emit('add-tache', activite)"
            >
              Tâche
            </UButton>
          </div>
        </div>

        <p v-if="activite.action?.libelle" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Action : {{ activite.action.libelle }}
        </p>
      </div>

      <!-- Chevron -->
      <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 text-gray-400 shrink-0 mt-1" />
    </div>
  </div>
</template>
