<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="backdrop">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        @click="closeModal"
      />
    </Transition>

    <!-- Modale -->
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          class="w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
          @click.stop
        >
          <!-- Header -->
          <div class="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex items-center justify-between border-b border-blue-700/20">
            <div>
              <h2 class="text-xl font-bold text-white">Affecter les courriers</h2>
              <p class="text-xs text-blue-100 mt-0.5">
                Sélectionnez les destinataires pour {{ selectedCourriers.length }} courrier(s)
              </p>
            </div>
            <button
              @click="closeModal"
              class="text-white/70 hover:text-white transition-colors"
            >
              <Icon name="i-heroicons-x-mark" class="w-5 h-5" />
            </button>
          </div>

          <!-- Contenu -->
          <div class="flex-1 overflow-y-auto">
            <!-- Erreur -->
            <div
              v-if="error"
              class="m-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <div class="flex items-start gap-3">
                <Icon name="i-heroicons-exclamation-triangle" class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div class="flex-1">
                  <p class="text-sm font-semibold text-red-900">Erreur</p>
                  <p class="text-xs text-red-700 mt-1">{{ error }}</p>
                </div>
                <button
                  @click="error = null"
                  class="text-red-600 hover:text-red-900 transition-colors flex-shrink-0"
                >
                  <Icon name="i-heroicons-x-mark" class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Zone de recherche -->
            <div class="sticky top-0 bg-white px-6 py-4 border-b border-slate-200">
              <div class="relative">
                <Icon
                  name="i-heroicons-magnifying-glass"
                  class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
                />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Rechercher par nom, fonction, entité..."
                  class="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
                <button
                  v-if="searchQuery"
                  @click="searchQuery = ''"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <Icon name="i-heroicons-x-mark" class="w-4 h-4" />
                </button>
              </div>

              <!-- Bouton Sélectionner tout -->
              <div class="mt-3 flex items-center gap-2">
                <input
                  type="checkbox"
                  :checked="selectedFonctions.length === filteredFonctions.length && filteredFonctions.length > 0"
                  :indeterminate="selectedFonctions.length > 0 && selectedFonctions.length < filteredFonctions.length"
                  @change="toggleSelectAll"
                  class="w-4 h-4 text-blue-600 border-slate-300 rounded cursor-pointer"
                />
                <label class="text-xs font-semibold text-slate-700 cursor-pointer">
                  Sélectionner tout ({{ filteredFonctions.length }})
                </label>
              </div>
            </div>

            <!-- Liste des fonction_utilisateurs -->
            <div class="px-6 py-4">
              <!-- Loader -->
              <div
                v-if="loading && fonctionUtilisateurs.length === 0"
                class="flex flex-col items-center justify-center py-12 gap-3"
              >
                <div class="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
                <p class="text-sm text-slate-500">Chargement des utilisateurs...</p>
              </div>

              <!-- Liste vide -->
              <div
                v-else-if="filteredFonctions.length === 0"
                class="flex flex-col items-center justify-center py-12 gap-2"
              >
                <Icon name="i-heroicons-inbox" class="w-12 h-12 text-slate-300" />
                <p class="text-sm font-semibold text-slate-600">Aucun utilisateur trouvé</p>
                <p class="text-xs text-slate-500">Essayez de modifier votre recherche</p>
              </div>

              <!-- Éléments -->
              <div v-else class="space-y-2">
                <div
                  v-for="fonction in filteredFonctions"
                  :key="fonction.id"
                  class="group"
                >
                  <label
                    class="flex items-start gap-3 p-3 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-200"
                  >
                    <input
                      type="checkbox"
                      :checked="isFonctionSelected(fonction.id)"
                      @change="toggleFonction(fonction.id)"
                      class="w-4 h-4 text-blue-600 border-slate-300 rounded cursor-pointer mt-1 flex-shrink-0"
                    />
                    <div class="flex-1 min-w-0">
                      <!-- Nom utilisateur -->
                      <p class="text-sm font-semibold text-slate-900">
                        {{ fonction.user?.nom }} {{ fonction.user?.prenom }}
                      </p>

                      <!-- Code et libellé fonction -->
                      <p class="text-xs text-slate-600 mt-1">
                        <span class="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded font-medium mr-2">
                          {{ fonction.fonction?.code }}
                        </span>
                        <span class="text-slate-600">{{ fonction.entite?.fonction }}</span>
                      </p>

                      <!-- Entité -->
                      <p class="text-xs text-slate-500 mt-1 truncate">
                        📁 {{ fonction.fonction?.entite?.libelle }}
                      </p>

                      <!-- Email -->
                      <p class="text-xs text-slate-500 mt-0.5 truncate">
                        ✉️ {{ fonction.user?.email }}
                      </p>

                      <!-- Statut -->
                      <div class="mt-2 flex items-center gap-2">
                        <span
                          class="inline-block w-2 h-2 rounded-full"
                          :class="{
                            'bg-green-500': fonction.actif,
                            'bg-red-500': !fonction.actif
                          }"
                        />
                        <span
                          class="text-xs font-medium"
                          :class="{
                            'text-green-700': fonction.actif,
                            'text-red-700': !fonction.actif
                          }"
                        >
                          {{ fonction.actif ? 'Actif' : 'Inactif' }}
                        </span>
                        <span v-if="fonction.is_interim" class="text-xs font-medium text-orange-700 bg-orange-50 px-2 py-0.5 rounded">
                          Intérim
                        </span>
                      </div>
                    </div>

                    <!-- Indicateur sélection -->
                    <div
                      v-if="isFonctionSelected(fonction.id)"
                      class="flex-shrink-0"
                    >
                      <Icon
                        name="i-heroicons-check-circle"
                        class="w-5 h-5 text-blue-600"
                      />
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="sticky bottom-0 bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between gap-3">
            <div class="text-xs text-slate-600">
              <span class="font-semibold text-slate-900">{{ selectedFonctions.length }}</span>
              /
              <span class="font-semibold text-slate-900">{{ filteredFonctions.length }}</span>
              sélectionné(s)
            </div>

            <div class="flex items-center gap-3">
              <button
                @click="closeModal"
                :disabled="loading"
                class="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Annuler
              </button>
              <button
                @click="assignCourriers"
                :disabled="selectedFonctions.length === 0 || loading"
                class="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Icon
                  v-if="loading"
                  name="i-heroicons-arrow-path"
                  class="w-4 h-4 animate-spin"
                />
                <span v-if="!loading">Affecter ({{ selectedFonctions.length }})</span>
                <span v-else>Traitement...</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { useAffectationModal } from '~/composables/affectations/useAffectationModal'

const {
  isOpen,
  selectedCourriers,
  fonctionUtilisateurs,
  selectedFonctions,
  filteredFonctions,
  loading,
  error,
  searchQuery,
  openModal,
  closeModal,
  toggleFonction,
  isFonctionSelected,
  toggleSelectAll,
  assignCourriers,
} = useAffectationModal()

defineExpose({
  openModal,
  closeModal,
  assignCourriers,
})
</script>

<style scoped>
/* Transitions */
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.2s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  transform: scale(0.95);
  opacity: 0;
}

/* Indeterminate checkbox */
input[type='checkbox']:indeterminate {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='white' d='M2 7h12v2H2z'/%3e%3c/svg%3e");
  background-color: #a855f7;
  border-color: #a855f7;
}
</style>