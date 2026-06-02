<script setup>
import { useAction } from '~/composables/actions/useAction'

const props = defineProps({
  action: { type: Object, required: true },
  numero: { type: Number, default: null },
  peutGererCodir: { type: Boolean, default: false },
})

const emit = defineEmits(['deleted', 'add-tache', 'add-activite', 'lire-commentaires', 'commenter'])

const toast       = useToast()
const router      = useRouter()
const deleteModal = ref(false)

const { deleteAction, loading } = useAction()

const goToAction = () => {
  localStorage.setItem('currentAction', JSON.stringify(props.action))
  router.push(`/actions/${props.action.id}`)
}

const confirmDelete = async () => {
  try {
    await deleteAction(props.action.id)
    toast.add({
      title: 'Action supprimée',
      description: `"${props.action.libelle}" a été supprimée`,
      color: 'green',
      icon: 'i-heroicons-check-circle',
    })
    deleteModal.value = false
    emit('deleted', props.action.id)
  } catch {
    toast.add({
      title: 'Erreur',
      description: "Impossible de supprimer l'action",
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
    })
  }
}
</script>

<template>
  <div>
    <div class="flex items-start gap-3">
      <!-- Numéro -->
      <div
        v-if="numero !== null"
        class="shrink-0 mt-3 w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center"
      >
        <span class="text-xs font-bold text-blue-600 dark:text-blue-300">{{ numero }}</span>
      </div>

      <!-- Carte cliquable -->
      <div
        class="flex-1 min-w-0 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition-all"
        @click="goToAction"
      >
        <div class="flex items-start gap-3">
          <!-- Icône -->
          <div class="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center shrink-0 mt-0.5">
            <UIcon name="i-heroicons-bolt" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>

          <!-- Contenu -->
          <div class="flex-1 min-w-0">
            <!-- Ligne titre + actions (droite) -->
            <div class="flex items-center justify-between gap-2">
              <p class="font-medium text-gray-900 dark:text-white text-sm truncate">
                {{ action.libelle }}
              </p>
              <div class="flex items-center gap-2 shrink-0">
                <div class="flex items-center gap-2">
                  <div class="relative inline-block">
                    <UButton
                      icon="i-heroicons-chat-bubble-bottom-center-text"
                      color="gray"
                      variant="ghost"
                      size="xs"
                      title="Lire les commentaires"
                      @click.stop="emit('lire-commentaires', action)"
                    >
  
                    <span
                      v-if="(action.commentaires?.length ?? 0) > 0"
                      class="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-4 px-1 flex items-center justify-center pointer-events-none border border-white dark:border-slate-800"
                    >
                      {{action.commentaires?.length ?? 0 }}
                    </span>
                    </UButton>
                  </div>

                  <div class="relative inline-block">
                    <UButton
                      icon="i-heroicons-chat-bubble-left-right"
                      color="blue"
                      variant="ghost"
                      size="xs"
                      title="Ajouter un commentaire"
                      @click.stop="emit('commenter', action)"
                    />
                    <div class="absolute -bottom-0.5 -right-0.5 bg-blue-500 rounded-full p-0.5 flex items-center justify-center border border-white dark:border-slate-800 pointer-events-none">
                      <UIcon name="i-heroicons-plus" class="w-2 h-2 text-white" />
                    </div>
                  </div>
                </div>
                <UButton
                  v-if="peutGererCodir"
                  icon="i-heroicons-plus"
                  color="blue"
                  variant="soft"
                  size="xs"
                  @click.stop="emit('add-tache', action)"
                >
                  Tâche
                </UButton>
                <UButton
                  v-if="peutGererCodir"
                  icon="i-heroicons-plus-circle"
                  color="violet"
                  variant="soft"
                  size="xs"
                  @click.stop="emit('add-activite', action)"
                >
                  Activité
                </UButton>
                <UButton
                  v-if="peutGererCodir"
                  icon="i-heroicons-trash"
                  color="red"
                  variant="ghost"
                  size="xs"
                  @click.stop="deleteModal = true"
                />
              </div>
            </div>

            <!-- Ligne compteurs (bas gauche) -->
            <div class="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span>
                {{ action.taches?.length ?? 0 }} tâche(s)
              </span>
              <span>•</span>
              <span>
                {{ action.activites?.length ?? 0 }} activité(s)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modale suppression -->
    <UModal v-model="deleteModal">
      <UCard class="rounded-2xl">
        <template #header>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center">
              <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white">Confirmer la suppression</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Cette action est irréversible</p>
            </div>
          </div>
        </template>
        <div class="p-2">
          <p class="text-gray-700 dark:text-gray-300">
            Êtes-vous sûr de vouloir supprimer l'action
            <span class="font-semibold text-red-600 dark:text-red-400">"{{ action.libelle }}"</span> ?
          </p>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" @click="deleteModal = false">Annuler</UButton>
            <UButton color="red" :loading="loading" @click="confirmDelete">
              <UIcon name="i-heroicons-trash" class="w-4 h-4 mr-1" />
              Supprimer
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>