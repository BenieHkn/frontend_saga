<script setup>
import { useCodirsStore } from '@/stores/codirs'
import { formatDateFR } from '@/composables/codirs/useCodir'

const props = defineProps({
  dossier: { type: Object, required: true },
})

const emit = defineEmits(['close'])

const codirStore = useCodirsStore()

const closeDetail = () => {
  emit('close')
}
</script>

<template>
  <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
    <!-- Header -->
    <div class="p-6 border-b border-gray-100 dark:border-gray-800">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-950/40 flex items-center justify-center">
            <UIcon name="i-heroicons-folder" class="w-6 h-6 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ dossier.libelle }}</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">Dossier #{{ dossier.id }}</p>
          </div>
        </div>
        <button @click="closeDetail" class="shrink-0">
          <UIcon name="i-heroicons-x-mark" class="w-6 h-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <div class="space-y-6">
        <!-- Informations générales -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Informations générales</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Identifiant</p>
              <p class="font-medium text-gray-900 dark:text-white">#{{ dossier.id }}</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Libellé</p>
              <p class="font-medium text-gray-900 dark:text-white">{{ dossier.libelle }}</p>
            </div>
          </div>
        </div>

        <!-- Description si disponible -->
        <div v-if="dossier.description">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Description</h3>
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <p class="text-gray-700 dark:text-gray-300">{{ dossier.description }}</p>
          </div>
        </div>

        <!-- Métadonnées -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Métadonnées</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Ordre du jour</p>
              <p class="font-medium text-gray-900 dark:text-white">
                {{ codirStore.currentOrdreDuJour?.libelle || 'Non spécifié' }}
              </p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">CODIR</p>
              <p class="font-medium text-gray-900 dark:text-white">
                {{ codirStore.currentCodir?.date ? formatDateFR(codirStore.currentCodir.date) : 'Non spécifié' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="p-6 border-t border-gray-100 dark:border-gray-800">
      <div class="flex justify-end gap-3">
        <UButton color="gray" variant="ghost" @click="closeDetail">
          Fermer
        </UButton>
        <UButton color="blue" :to="`/dossiers/${dossier.id}`">
          <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-4 h-4 mr-2" />
          Voir la page complète
        </UButton>
      </div>
    </div>
  </div>
</template>
