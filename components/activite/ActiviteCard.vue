<script setup>
import ConfirmationSuppressionModal from '@/components/ConfirmationSuppressionModal.vue'

const props = defineProps({
  activite:  { type: Object,  required: true },
  numero:    { type: Number,  default: null  },
  peutGererCodir: { type: Boolean, default: false },
  loading: {type: Boolean, default: false}
})

const emit = defineEmits(['update', 'add-tache', 'commenter', 'lire-commentaires', 'delete', 'edit'])

const router      = useRouter()
const deleteModal = ref(false)

const goToActivite = () => {
  localStorage.setItem('currentActivite', JSON.stringify(props.activite))
  router.push(`/activites/${props.activite.id}`)
}

const confirmDelete = async () => {
  emit('delete', props.activite)
}

const cancelDelete = () => {
  deleteModal.value = false
}
</script>

<template>
  <div>
    <div class="flex items-start gap-3">
      <!-- Numéro -->
      <div
        v-if="numero !== null"
        class="shrink-0 mt-3 w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center"
      >
        <span class="text-xs font-bold text-violet-600 dark:text-violet-300">{{ numero }}</span>
      </div>

      <!-- Carte cliquable -->
      <div
        class="flex-1 min-w-0 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 cursor-pointer hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-sm transition-all"
        @click="goToActivite"
      >
        <div class="flex items-start gap-3">
          <!-- Icône -->
          <div class="w-9 h-9 rounded-lg bg-violet-100 dark:bg-violet-950/40 flex items-center justify-center shrink-0 mt-0.5">
            <UIcon name="i-heroicons-bolt" class="w-5 h-5 text-violet-600 dark:text-violet-400" />
          </div>

          <!-- Contenu -->
          <div class="flex-1 min-w-0">
            <!-- Ligne titre + actions -->
            <div class="flex items-center justify-between gap-2">
              <p class="font-medium text-gray-900 dark:text-white text-sm truncate">
                {{ activite.libelle }}
              </p>

              <div class="flex items-center gap-2 shrink-0">
                <!-- Bouton lire commentaires avec compteur -->
                <div class="relative inline-block">
                  <UButton
                    icon="i-heroicons-chat-bubble-bottom-center-text"
                    color="gray"
                    variant="ghost"
                    size="xs"
                    title="Lire les commentaires"
                    @click.stop="emit('lire-commentaires', activite)"
                  >
                    <span
                      v-if="(activite.commentaires?.length ?? 0) > 0"
                      class="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-4 px-1 flex items-center justify-center pointer-events-none border border-white dark:border-slate-800"
                    >
                      {{ activite.commentaires?.length ?? 0 }}
                    </span>
                  </UButton>
                </div>

                <!-- Bouton ajouter commentaire -->
                <div class="relative inline-block">
                  <UButton
                    icon="i-heroicons-chat-bubble-left-right"
                    color="violet"
                    variant="ghost"
                    size="xs"
                    title="Ajouter un commentaire"
                    @click.stop="emit('commenter', activite)"
                  />
                  <div class="absolute -bottom-0.5 -right-0.5 bg-violet-500 rounded-full p-0.5 flex items-center justify-center border border-white dark:border-slate-800 pointer-events-none">
                    <UIcon name="i-heroicons-plus" class="w-2 h-2 text-white" />
                  </div>
                </div>

                <UButton
                  v-if="peutGererCodir"
                  icon="i-heroicons-plus"
                  color="blue"
                  variant="soft"
                  size="xs"
                  @click.stop="emit('add-tache', activite)"
                >
                  Tâche
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

            <!-- Ligne compteurs -->
            <div class="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span>{{ activite.taches?.length ?? 0 }} tâche(s)</span>
              <span v-if="activite.action?.libelle">•</span>
              <span v-if="activite.action?.libelle">Action : {{ activite.action.libelle }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modale suppression -->
    <ConfirmationSuppressionModal
      v-model:openConfirmationModal="deleteModal"
      titre="Confirmer la suppression"
      message="Voulez-vous vraiment supprimer cette activité ?"
      :details="activite.libelle ? `Activité : ${activite.libelle}` : ''"
      confirmLabel="Supprimer"
      cancelLabel="Annuler"
      :loading="loading"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>