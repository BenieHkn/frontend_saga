<template>
  <!-- En-tête -->
  <div class="flex items-center justify-between mb-6">
    <h1 class="flex items-center gap-3 text-2xl font-bold text-slate-800">
      <Icon name="i-heroicons-arrow-path-rounded-square" class="w-7 h-7 text-teal-600" />
      Liste des Transferts
    </h1>
    <div class="flex items-center gap-3">
      <button @click="refresh(currentPage, perPage, false)"
        class="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all hover:shadow-md">
        <Icon name="i-heroicons-arrow-path" class="w-4 h-4" />
        Actualiser
      </button>
      <NuxtLink v-if="peutTransferer() && !isAdmin()" to="/affectations_transferts/form_transfert"
        class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-all hover:shadow-md">
        <Icon name="i-heroicons-plus" class="w-4 h-4" />
        Nouveau
      </NuxtLink>
      <UBadge color="teal" variant="soft" size="lg">
        <Icon name="i-heroicons-document-text" class="h-4 w-4 mr-1" />
        <span class="text-sm">{{ total }} transfert{{ total > 1 ? 's' : '' }}</span>
      </UBadge>
    </div>
  </div>

  <!-- ── Modal détails ── -->
  <UModal v-model="detailsOpen" :ui="{ width: 'sm:max-w-3xl' }">
    <div v-if="selectedTransfert" class="flex flex-col max-h-[90vh] bg-white rounded-xl overflow-hidden">

      <!-- En-tête gradient teal -->
      <div class="relative flex items-center justify-between px-6 py-4 shrink-0 overflow-hidden"
        style="background: linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%);">
        <div class="absolute inset-0 opacity-10"
          style="background-image: radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px); background-size: 32px 32px;"></div>
        <div class="relative flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner border border-white/30">
            <Icon name="i-heroicons-arrow-path-rounded-square" class="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 class="text-base font-bold text-white leading-tight">Détails du transfert</h2>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-xs text-teal-200 font-medium">#{{ selectedTransfert.id }}</span>
              <span v-if="selectedTransfert.statut"
                class="inline-flex px-1.5 py-0.5 text-[10px] font-bold rounded-md uppercase border bg-white/20 text-white border-white/30">
                {{ selectedTransfert.statut }}
              </span>
              <span v-if="selectedTransfert.priority"
                class="inline-flex px-1.5 py-0.5 text-[10px] font-bold rounded-md uppercase border"
                :class="{
                  'bg-red-400/30 text-red-100 border-red-300/50':         selectedTransfert.priority === 'URGENT',
                  'bg-orange-400/30 text-orange-100 border-orange-300/50': selectedTransfert.priority === 'IMPORTANT',
                  'bg-teal-400/30 text-teal-100 border-teal-300/50':      selectedTransfert.priority === 'STANDARD',
                }">
                {{ selectedTransfert.priority }}
              </span>
            </div>
          </div>
        </div>
        <button @click="closeDetails"
          class="relative w-8 h-8 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 transition-all text-white border border-white/20">
          <Icon name="i-heroicons-x-mark" class="w-4 h-4" />
        </button>
      </div>

      <!-- Corps -->
      <div class="overflow-y-auto flex-1 p-5 space-y-4 bg-slate-50/50">

        <!-- Section courrier -->
        <section class="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">

          <!-- Header section avec bouton document -->
          <div class="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-teal-100">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 rounded-lg bg-teal-100 flex items-center justify-center">
                <Icon name="i-heroicons-inbox-arrow-down" class="w-3.5 h-3.5 text-teal-600" />
              </div>
              <span class="text-[11px] font-bold text-teal-700 uppercase tracking-widest">Courrier associé</span>
            </div>

            <!-- Bouton charger le document -->
            <div v-if="selectedTransfert._raw?.courrier_arrive?.document?.url &&
                       selectedTransfert._raw.courrier_arrive.document.url !== 'Inconnu'">
              <button
                v-if="!docFileLoaded && !docFileLoading && !docFileError"
                @click="loadDocFile"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-all">
                <Icon name="i-heroicons-document-arrow-down" class="w-3.5 h-3.5" />
                Charger le document
              </button>
              <div v-else-if="docFileLoading"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400">
                <div class="w-3.5 h-3.5 border-2 border-slate-200 border-t-teal-500 rounded-full animate-spin"></div>
                Chargement...
              </div>
              <div v-else-if="docFileError"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 border border-red-200 rounded-lg">
                <Icon name="i-heroicons-exclamation-triangle" class="w-3.5 h-3.5 shrink-0" />
                {{ docFileError }}
                <button @click="docFileError = ''; loadDocFile()" class="ml-1 underline hover:no-underline">Réessayer</button>
              </div>
              <div v-else-if="docFileLoaded"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg">
                <Icon name="i-heroicons-check-circle" class="w-3.5 h-3.5" />
                Document chargé
              </div>
            </div>
            <div v-else
              class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 bg-slate-50 border border-slate-200 rounded-lg cursor-not-allowed">
              <Icon name="i-heroicons-document-text" class="w-3.5 h-3.5" />
              Aucun document disponible
            </div>
          </div>

          <div class="p-4 space-y-3">
            <div class="grid grid-cols-1 gap-2">
              <div class="flex items-stretch gap-0 rounded-xl overflow-hidden border border-teal-100 hover:border-teal-200 transition-colors">
                <div class="w-1 shrink-0 bg-gradient-to-b from-teal-400 to-teal-600"></div>
                <div class="flex-1 p-3 bg-gradient-to-r from-teal-50 to-transparent">
                  <p class="text-[10px] font-bold text-teal-400 uppercase tracking-wider mb-0.5">Référence</p>
                  <p class="text-sm font-bold text-teal-900">{{ selectedTransfert.reference || 'Sans référence' }}</p>
                </div>
              </div>
              <div class="flex items-stretch gap-0 rounded-xl overflow-hidden border border-amber-100 hover:border-amber-200 transition-colors">
                <div class="w-1 shrink-0 bg-gradient-to-b from-amber-400 to-orange-500"></div>
                <div class="flex-1 p-3 bg-gradient-to-r from-amber-50 to-transparent">
                  <p class="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-0.5">Objet</p>
                  <p class="text-sm text-gray-800 leading-relaxed">{{ selectedTransfert.objet || 'Non spécifié' }}</p>
                </div>
              </div>
            </div>

            <!-- Preview document (après toutes les données) -->
            <div v-if="docFileLoaded" class="mt-2 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
              <DocumentRpreview :file-preview-url="docBlobUrl" height="600px" />
            </div>
          </div>
        </section>

        <!-- Section transfert -->
        <section class="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
          <div class="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-teal-100">
            <div class="w-6 h-6 rounded-lg bg-teal-100 flex items-center justify-center">
              <Icon name="i-heroicons-arrow-path-rounded-square" class="w-3.5 h-3.5 text-teal-600" />
            </div>
            <span class="text-[11px] font-bold text-teal-700 uppercase tracking-widest">Informations du transfert</span>
          </div>
          <div class="p-4 space-y-3">
            <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
              <div class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>Date de transfert
                </p>
                <p class="text-xs text-slate-800">{{ selectedTransfert.date_transfert || '—' }}</p>
              </div>
              <div class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>Type
                </p>
                <p class="text-xs text-slate-800">{{ selectedTransfert.type || '—' }}</p>
              </div>
            </div>

            <div class="flex items-stretch gap-0 rounded-xl overflow-hidden border border-slate-100 hover:border-slate-200 transition-colors">
              <div class="w-1 shrink-0 bg-gradient-to-b from-slate-300 to-slate-400"></div>
              <div class="flex-1 p-3 bg-gradient-to-r from-slate-50 to-transparent">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Émetteur</p>
                <p class="text-sm font-bold text-slate-800">
                  {{ selectedTransfert._raw?.emetteur?.user
                    ? `${selectedTransfert._raw.emetteur.user.nom} ${selectedTransfert._raw.emetteur.user.prenom || ''}`.trim()
                    : '—' }}
                </p>
                <p class="text-xs text-slate-500 mt-0.5">{{ selectedTransfert.emetteur }}</p>
              </div>
            </div>

            <div class="flex items-stretch gap-0 rounded-xl overflow-hidden border border-teal-100 hover:border-teal-200 transition-colors">
              <div class="w-1 shrink-0 bg-gradient-to-b from-teal-400 to-cyan-500"></div>
              <div class="flex-1 p-3 bg-gradient-to-r from-teal-50 to-transparent">
                <p class="text-[10px] font-bold text-teal-500 uppercase tracking-wider mb-1">Destinataire</p>
                <p class="text-sm font-bold text-slate-800">
                  {{ selectedTransfert._raw?.destinataire?.user
                    ? `${selectedTransfert._raw.destinataire.user.nom} ${selectedTransfert._raw.destinataire.user.prenom || ''}`.trim()
                    : '—' }}
                </p>
                <p class="text-xs text-slate-500 mt-0.5">{{ selectedTransfert.destinataire }}</p>
                <p v-if="selectedTransfert._raw?.destinataire?.entite?.libelle" class="text-xs text-slate-400">
                  {{ selectedTransfert._raw.destinataire.entite.libelle }}
                </p>
              </div>
            </div>

            <div v-if="selectedTransfert._raw?.instructions"
              class="flex items-stretch gap-0 rounded-xl overflow-hidden border border-amber-100 hover:border-amber-200 transition-colors">
              <div class="w-1 shrink-0 bg-gradient-to-b from-amber-400 to-yellow-500"></div>
              <div class="flex-1 p-3 bg-gradient-to-r from-amber-50 to-transparent">
                <p class="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-1.5">Instructions</p>
                <p class="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{{ selectedTransfert._raw.instructions }}</p>
              </div>
            </div>
            <div v-else class="flex items-stretch gap-0 rounded-xl overflow-hidden border border-slate-100">
              <div class="w-1 shrink-0 bg-slate-200"></div>
              <div class="flex-1 p-3 bg-slate-50">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Instructions</p>
                <p class="text-xs text-slate-400 italic">Aucune instruction</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Pied modal -->
      <div class="px-6 py-3.5 border-t border-slate-100 shrink-0 flex items-center justify-between bg-white">
        <span class="text-[10px] text-slate-400">Transfert #{{ selectedTransfert.id }}</span>
        <UButton color="gray" variant="outline" size="sm" @click="closeDetails">Fermer</UButton>
      </div>
    </div>
  </UModal>

  <!-- Erreur -->
  <div v-if="error"
    class="flex items-center gap-4 p-5 mb-5 bg-red-50 border border-red-200 rounded-xl max-w-2xl">
    <Icon name="i-heroicons-exclamation-triangle" class="w-8 h-8 text-red-600 shrink-0" />
    <div class="flex-1">
      <p class="text-sm font-bold text-red-900">Erreur de chargement</p>
      <p class="text-xs text-red-700">{{ error }}</p>
    </div>
    <button
      class="px-4 py-2 text-xs font-bold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors shrink-0"
      @click="refresh(currentPage, perPage, false)">
      Réessayer
    </button>
  </div>

  <!-- DataTablePaginate -->
  <DataTablePaginate
    :loading="loading"
    :data="tableData"
    :columns="columns"
    :selectable="false"
    :default-sort-column="null"
    :show-row-numbers="true"
    :show-actions="true"
    :default-actions="[]"
    :items-per-page-options="[10, 25, 50, 100]"
    :default-items-per-page="25"
    :left-aligned-columns="['objet', 'reference', 'emetteur', 'destinataire']"
    :external-pagination="true"
    :external-total="total"
    :external-page="currentPage"
    :external-last-page="totalPages"
    :external-per-page="perPage"
    @search-change="onSearchChange"
    @page-change="onPageChange"
    @per-page-change="onPerPageChange"
    @column-filter-change="onColumnFilterChange">

    <!-- ── Filtres avancés ── -->
    <template #advanced-filters>
      <div class="space-y-4">
        <div class="flex flex-wrap gap-3">
          <div class="flex-1 min-w-[140px]">
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Référence</label>
            <input v-model="searchFilters.reference" placeholder="Filtrer..."
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all" />
          </div>
          <div class="flex-1 min-w-[200px]">
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Objet</label>
            <input v-model="searchFilters.objet" placeholder="Filtrer..."
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all" />
          </div>
          <div class="flex-1 min-w-[150px]">
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Motif</label>
            <input v-model="searchFilters.motif" placeholder="Filtrer..."
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all" />
          </div>
          <div class="flex-1 min-w-[150px]">
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Date de transfert</label>
            <input v-model="searchFilters.date_transfert" placeholder="jj/mm/aaaa"
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all" />
          </div>
        </div>
        <div class="flex flex-wrap gap-3">
          <div class="flex-1 min-w-[140px]">
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Statut</label>
            <select v-model="searchFilters.statut"
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all">
              <option value="">Tous</option>
              <option v-for="s in filterOptions.statuts" :key="s" :value="s">{{ s }}</option>
            </select>
          </div>
          <div v-if="!isAdmin()" class="flex-1 min-w-[180px]">
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Destinataire</label>
            <select v-model="searchFilters.destinataire_id"
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all">
              <option value="">Tous</option>
              <option v-for="d in filterOptions.destinataires" :key="d.id" :value="d.id">{{ d.nom }}</option>
            </select>
          </div>
          <div v-if="isAdmin()" class="flex-1 min-w-[180px]">
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Émetteur</label>
            <select v-model="searchFilters.emetteur_id"
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all">
              <option value="">Tous</option>
              <option v-for="e in filterOptions.emetteurs" :key="e.id" :value="e.id">{{ e.nom }}</option>
            </select>
          </div>
        </div>
        <div v-if="hasActiveFilters" class="flex justify-end">
          <button @click="resetFilters"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-all">
            <Icon name="i-heroicons-x-mark" class="w-3.5 h-3.5" />
            Réinitialiser les filtres
          </button>
        </div>
      </div>
    </template>

    <!-- ── Cellule priorité ── -->
    <template #cell-priority="{ value }">
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide"
        :class="getPriorityClasses(value)">
        <span class="w-2 h-2 rounded-full mr-1.5" :class="getPriorityDotClass(value)"></span>
        {{ value || '—' }}
      </span>
    </template>

    <!-- ── Cellule objet ── -->
    <template #cell-objet="{ value }">
      <span class="block text-xs text-slate-800 leading-relaxed whitespace-normal break-words min-w-[200px]" :title="value">
        {{ value }}
      </span>
    </template>

    <!-- ── Référence cliquable → ouvre via Blob ── -->
    <template #cell-reference="{ value, item }">
      <div class="w-full">
        <button
          v-if="item._raw?.courrier_arrive?.document?.url && item._raw.courrier_arrive.document.url !== 'Inconnu'"
          @click="handleView(item)"
          :disabled="openingDocumentId === item.id"
          class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-all group max-w-[180px]"
          :title="`Ouvrir le document ${value}`">
          <span class="break-words whitespace-normal min-w-0">{{ value }}</span>
          <Icon name="i-heroicons-eye" class="w-3 h-3 shrink-0 opacity-60 group-hover:opacity-100" />
        </button>
        <span v-else
          class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md max-w-[180px]"
          :title="value">
          <Icon name="i-heroicons-document-text" class="w-3.5 h-3.5 shrink-0 opacity-50" />
          <span class="break-words whitespace-normal min-w-0">{{ value }}</span>
        </span>
      </div>
    </template>

    <!-- ── Actions ── -->
    <template #actions="{ item }">
      <div class="flex gap-1.5 justify-end">
        <button @click="handleView(item)" title="Voir les détails"
          class="inline-flex items-center justify-center w-8 h-8 bg-amber-50 text-amber-700 border border-amber-100 rounded-md hover:bg-amber-200 hover:text-amber-900 transition-all group">
          <Icon name="i-heroicons-eye" class="w-4 h-4 group-hover:text-yellow-600" />
        </button>
        <button v-if="peutTransferer() && !isAdmin()" @click="handleEdit(item)"
          class="inline-flex items-center justify-center w-8 h-8 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md hover:bg-emerald-200 hover:text-emerald-900 transition-all group"
          title="Modifier">
          <Icon name="i-heroicons-pencil" class="w-4 h-4 group-hover:text-green-600" />
        </button>
      </div>
    </template>

  </DataTablePaginate>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import DataTablePaginate from '~/components/DataTablePaginate.vue'
import DocumentRpreview from '~/components/DocumentRpreview.vue'
import { useAuth } from '~/composables/auth/useAuth'

const { peutTransferer, isAdmin, isSecDir, getDirecteurEntiteUserId, peutVoirConfig } = useAuth()
const config = useRuntimeConfig()
const toast  = useToast()

// ── Colonnes (dynamiques selon rôle) ─────────────────────────────────────────
const columns = computed(() => {
  const base = [
    { key: 'date_transfert', label: 'Date',         visible: true,  filterable: false },
    { key: 'reference',      label: 'Référence',     visible: true,  inputPlaceholder: 'Réf...' },
    { key: 'objet',          label: 'Objet',         visible: true  },
    { key: 'destinataire',   label: 'Destinataire',  visible: true,  inputPlaceholder: 'Destinataire...' },
    { key: 'priority',       label: 'Priorité',      visible: true,  type: 'badge', filterable: false },
    { key: 'statut',         label: 'Statut',        visible: true,  type: 'badge', filterable: false },
  ]
  if (isAdmin()) {
    base.push({ key: 'emetteur', label: 'Émetteur', visible: true, inputPlaceholder: 'Émetteur...' })
  }
  return base
})

// ── État table ────────────────────────────────────────────────────────────────
const tableData      = ref([])
const loading        = ref(false)
const initialLoading = ref(false)
const error          = ref(null)
const currentPage    = ref(1)
const totalPages     = ref(1)
const total          = ref(0)
const perPage        = ref(25)

// ── Options filtres dynamiques ────────────────────────────────────────────────
const filterOptions = ref({ statuts: [], emetteurs: [], destinataires: [] })

// ── Modal ─────────────────────────────────────────────────────────────────────
const detailsOpen       = ref(false)
const selectedTransfert = ref(null)

// États fichier document dans la modal
const docFileLoaded  = ref(false)
const docFileLoading = ref(false)
const docFileError   = ref('')
const docBlobUrl     = ref('')

// Ouverture depuis le tableau
const openingDocumentId = ref(null)

// ── Filtres avancés ───────────────────────────────────────────────────────────
const defaultFilters = () => ({
  search:          '',
  reference:       '',
  objet:           '',
  motif:           '',
  date_transfert:  '',
  statut:          '',
  emetteur_id:     '',
  destinataire_id: '',
})

const searchFilters = ref(defaultFilters())

const hasActiveFilters = computed(() =>
  Object.values(searchFilters.value).some(v => v !== '') ||
  Object.values(columnFilters.value).some(v => v !== '')
)

const resetFilters = () => {
  searchFilters.value = defaultFilters()
  columnFilters.value = {}
  currentPage.value   = 1
  refresh(1, perPage.value, false)
}

// ── Filtres colonnes ──────────────────────────────────────────────────────────
const columnFilters = ref({})

let columnFilterTimeout = null
const onColumnFilterChange = (val) => {
  columnFilters.value = { ...val }
  clearTimeout(columnFilterTimeout)
  columnFilterTimeout = setTimeout(() => {
    currentPage.value = 1
    refresh(1, perPage.value, false)
  }, 400)
}

// ── Watch filtres avancés ─────────────────────────────────────────────────────
let searchTimeout = null
watch(searchFilters, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    refresh(1, perPage.value, false)
  }, 400)
}, { deep: true })

// ── Utilitaires ───────────────────────────────────────────────────────────────
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}

const guessMimeType = (filename) => {
  if (!filename) return ''
  const ext = (filename.split('.').pop() || '').toLowerCase()
  return { pdf: 'application/pdf', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml' }[ext] || ''
}

// ── Construction URL API fichier ──────────────────────────────────────────────
const buildDocumentUrl = (rawUrl, dateEnreg) => {
  if (!rawUrl || rawUrl === 'Inconnu') return null
  const base     = config.public.apiBase.replace(/\/$/, '')
  const filename = rawUrl.startsWith('/') ? rawUrl.slice(1) : rawUrl
  if (!dateEnreg) return `${base}/file/documents/${filename}`
  const d     = new Date(dateEnreg)
  const year  = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day   = String(d.getDate()).padStart(2, '0')
  return `${base}/file/documents/${year}/${month}/${day}/${filename}`
}

// ── Fetch blob avec token Bearer ──────────────────────────────────────────────
const fetchFileAsBlob = async (rawUrl, dateEnreg) => {
  const url = buildDocumentUrl(rawUrl, dateEnreg)
  if (!url) throw new Error('URL du fichier introuvable')
  const authToken = localStorage.getItem('auth_token') || ''
  const response  = await fetch(url, { headers: { Authorization: `Bearer ${authToken}` } })
  if (!response.ok) throw new Error(`Erreur ${response.status} — fichier non accessible`)
  const blob = await response.blob()
  return { blob, mimeType: blob.type || guessMimeType(rawUrl) }
}

// ── Charger le fichier dans la modal ─────────────────────────────────────────
const loadDocFile = async () => {
  const rawDoc    = selectedTransfert.value?._raw?.courrier_arrive?.document
  const rawUrl    = rawDoc?.url
  const dateEnreg = rawDoc?.date_enreg
  if (!rawUrl || rawUrl === 'Inconnu') return

  docFileLoading.value = true
  docFileLoaded.value  = false
  docFileError.value   = ''
  if (docBlobUrl.value) { URL.revokeObjectURL(docBlobUrl.value); docBlobUrl.value = '' }

  try {
    const { blob } = await fetchFileAsBlob(rawUrl, dateEnreg)
    docBlobUrl.value    = URL.createObjectURL(blob)
    docFileLoaded.value = true
  } catch (err) {
    console.error('❌ Erreur chargement document:', err)
    docFileError.value = err.message || 'Erreur lors du chargement'
  } finally {
    docFileLoading.value = false
  }
}

// ── Transform ─────────────────────────────────────────────────────────────────
const transformerDonnees = (reponseAPI) => {
  if (!reponseAPI?.data) throw new Error('Format de réponse API invalide')

  return reponseAPI.data.map(item => {
    // Nom brut uniquement — jamais d'URL construite
    const rawUrl = item.courrier_arrive?.document?.url?.trim()

    return {
      id:             item.id,
      date_transfert: formatDate(item.date_affect || item.created_at),
      objet:          item.courrier_arrive?.document?.objet     || '—',
      reference:      item.courrier_arrive?.document?.reference || '—',
      statut:         item.statut             || '',
      type:           item.type_affectation   || '',
      emetteur:       item.emetteur?.entite?.fonction           || '—',
      destinataire:   item.destinataire?.entite?.fonction       || '—',
      priority:       item.courrier_arrive?.priority            || '',
      url:            (rawUrl && rawUrl !== 'Inconnu') ? rawUrl : '',  // nom brut
      _raw:           item,
    }
  })
}

// ── Chargement options filtres ────────────────────────────────────────────────
const loadFilterOptions = async () => {
  try {
    const authToken = localStorage.getItem('auth_token') || ''
    const base      = config.public.apiBase.replace(/\/$/, '')
    const response  = await $fetch(`${base}/transferts/filters`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
    if (response.success) filterOptions.value = response
  } catch (err) {
    console.error('❌ Erreur chargement options filtres transferts:', err)
  }
}

// ── Chargement données ────────────────────────────────────────────────────────
const refresh = async (page = 1, per_page = perPage.value, isFirst = false) => {
  if (isFirst) { initialLoading.value = true } else { loading.value = true }
  error.value = null

  try {
    const authToken = localStorage.getItem('auth_token') || ''
    const base      = config.public.apiBase.replace(/\/$/, '')

    const params = new URLSearchParams({
      page:     String(page),
      per_page: String(per_page),
    })

    const f = searchFilters.value
    if (f.search)          params.append('search',          f.search)
    if (f.reference)       params.append('reference',       f.reference)
    if (f.objet)           params.append('objet',           f.objet)
    if (f.motif)           params.append('motif',           f.motif)
    if (f.date_transfert)  params.append('date_transfert',  f.date_transfert)
    if (f.statut)          params.append('statut',          f.statut)
    if (f.emetteur_id)     params.append('emetteur_id',     f.emetteur_id)
    if (f.destinataire_id) params.append('destinataire_id', f.destinataire_id)

    const c = columnFilters.value
    if (!f.reference    && c.reference)    params.append('reference',    c.reference)
    if (!f.objet        && c.objet)        params.append('objet',        c.objet)
    if (!f.destinataire && c.destinataire) params.append('destinataire', c.destinataire)

    let endpoint
    if (peutVoirConfig()) {
      endpoint = `${base}/transferts?${params.toString()}`
    } else {
      const entiteUser = JSON.parse(localStorage.getItem('entite_user') || 'null')
      if (!entiteUser?.id) { error.value = 'Aucune fonction utilisateur sélectionnée'; return }
      const emetteurId = isSecDir()
        ? (getDirecteurEntiteUserId() ?? entiteUser.id)
        : entiteUser.id
      endpoint = `${base}/transferts/user/${emetteurId}/emitted?${params.toString()}`
    }

    const reponse = await $fetch(endpoint, {
      headers: { Authorization: `Bearer ${authToken}` },
    })

    tableData.value   = transformerDonnees(reponse)
    currentPage.value = reponse.meta?.current_page ?? page
    totalPages.value  = reponse.meta?.last_page     ?? 1
    total.value       = reponse.meta?.total         ?? tableData.value.length

  } catch (err) {
    console.error('❌ Erreur chargement transferts:', err)
    error.value = err.message || 'Erreur lors du chargement'
    toast.add({ title: 'Erreur', description: 'Impossible de charger les transferts', color: 'red', timeout: 1500 })
  } finally {
    initialLoading.value = false
    loading.value        = false
  }
}

// ── Handlers pagination ───────────────────────────────────────────────────────
const onPageChange    = (page) => refresh(page, perPage.value, false)
const onPerPageChange = (val)  => { perPage.value = val; refresh(1, val, false) }
const onSearchChange  = (val)  => {
  searchFilters.value.search = val
  currentPage.value = 1
  refresh(1, perPage.value, false)
}

// ── Styles priorité ───────────────────────────────────────────────────────────
const getPriorityClasses  = (p) => ({ URGENT: 'bg-red-100 text-red-800', IMPORTANT: 'bg-orange-100 text-orange-800', STANDARD: 'bg-blue-100 text-blue-800' }[p] || 'bg-gray-100 text-gray-800')
const getPriorityDotClass = (p) => ({ URGENT: 'bg-red-500',              IMPORTANT: 'bg-orange-500',                STANDARD: 'bg-blue-500'                }[p] || 'bg-gray-500')

// ── Handlers actions ──────────────────────────────────────────────────────────
const handleView = (item) => {
  selectedTransfert.value = item
  docFileLoaded.value     = false
  docFileLoading.value    = false
  docFileError.value      = ''
  if (docBlobUrl.value) { URL.revokeObjectURL(docBlobUrl.value); docBlobUrl.value = '' }
  detailsOpen.value = true
}

const closeDetails = () => {
  detailsOpen.value       = false
  selectedTransfert.value = null
  docFileLoaded.value     = false
  docFileError.value      = ''
  if (docBlobUrl.value) { URL.revokeObjectURL(docBlobUrl.value); docBlobUrl.value = '' }
}

const handleEdit = async (item) => {
  if (!peutTransferer()) return
  try {
    const authToken = localStorage.getItem('auth_token') || ''
    await $fetch(`${config.public.apiBase}/transferts/${item.id}`, {
      method:  'PUT',
      headers: { Authorization: `Bearer ${authToken}` },
      body:    {},
    })
    refresh(currentPage.value, perPage.value, false)
  } catch (err) {
    console.error('Erreur modification transfert:', err)
    toast.add({ title: 'Erreur', description: 'Impossible de modifier le transfert', color: 'red', timeout: 1500 })
  }
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(() => {
  Promise.all([
    refresh(1, perPage.value, true),
    loadFilterOptions(),
  ])
})
</script>