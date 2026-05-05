<template>
  <div class="min-h-screen bg-slate-50 p-6 font-sans">
    <!-- ── Modal Détails ── -->
    <UModal v-model="detailsOpen" :ui="{ width: 'sm:max-w-5xl' }">
      <div v-if="selectedItem" class="flex flex-col max-h-[90vh] bg-white rounded-xl overflow-hidden">

        <!-- En-tête modal -->
        <div class="relative flex items-center justify-between px-6 py-4 shrink-0 overflow-hidden"
          style="background: linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%);">
          <div class="absolute inset-0 opacity-10"
            style="background-image: radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px); background-size: 32px 32px;">
          </div>
          <div class="relative flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner border border-white/30">
              <Icon name="i-heroicons-link" class="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 class="text-base font-bold text-white leading-tight">Détails du rattachement</h2>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="text-xs text-indigo-200 font-medium">{{ selectedItem.ref_arrivee }}</span>
                <span class="w-1 h-1 rounded-full bg-indigo-300"></span>
                <Icon name="i-heroicons-arrow-right" class="w-3 h-3 text-indigo-300" />
                <span class="w-1 h-1 rounded-full bg-indigo-300"></span>
                <span class="text-xs text-indigo-200 font-medium">{{ selectedItem.ref_depart }}</span>
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

          <!-- Section Courrier Arrivée -->
          <section class="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
            <div
              class="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-slate-100">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Icon name="i-heroicons-inbox-arrow-down" class="w-3.5 h-3.5 text-indigo-600" />
                </div>
                <span class="text-[11px] font-bold text-indigo-700 uppercase tracking-widest">Courrier arrivée</span>
              </div>

              <div v-if="selectedItem._raw?.document?.url && selectedItem._raw.document.url !== 'Inconnu'">
                <button v-if="!arriveeFileLoaded && !arriveeFileLoading && !arriveeFileError" @click="loadArriveeFile"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-all">
                  <Icon name="i-heroicons-document-arrow-down" class="w-3.5 h-3.5" />
                  Charger le document
                </button>
                <div v-else-if="arriveeFileLoading"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400">
                  <div class="w-3.5 h-3.5 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin"></div>
                  Chargement...
                </div>
                <div v-else-if="arriveeFileError"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 border border-red-200 rounded-lg">
                  <Icon name="i-heroicons-exclamation-triangle" class="w-3.5 h-3.5 shrink-0" />
                  {{ arriveeFileError }}
                  <button @click="arriveeFileError = ''; loadArriveeFile()" class="ml-1 underline hover:no-underline">Réessayer</button>
                </div>
                <div v-else-if="arriveeFileLoaded"
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
                <div class="flex items-stretch gap-0 rounded-xl overflow-hidden border border-indigo-100 hover:border-indigo-200 transition-colors">
                  <div class="w-1 shrink-0 bg-gradient-to-b from-indigo-400 to-indigo-600"></div>
                  <div class="flex-1 p-3 bg-gradient-to-r from-indigo-50 to-transparent">
                    <p class="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-0.5">Référence</p>
                    <p class="text-sm font-bold text-indigo-900">{{ selectedItem.ref_arrivee || 'Sans référence' }}</p>
                  </div>
                </div>
                <div class="flex items-stretch gap-0 rounded-xl overflow-hidden border border-amber-100 hover:border-amber-200 transition-colors">
                  <div class="w-1 shrink-0 bg-gradient-to-b from-amber-400 to-orange-500"></div>
                  <div class="flex-1 p-3 bg-gradient-to-r from-amber-50 to-transparent">
                    <p class="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-0.5">Objet</p>
                    <p class="text-sm text-gray-800 leading-relaxed">{{ selectedItem.objet_arrivee || 'Non spécifié' }}</p>
                  </div>
                </div>
              </div>
              <div v-if="arriveeFileLoaded" class="mt-2 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                <DocumentRpreview :file-preview-url="arriveeBlobUrl" height="600px" />
              </div>
            </div>
          </section>

          <!-- Séparateur -->
          <div class="flex justify-center">
            <div class="flex items-center gap-2 px-4 py-2 bg-slate-100 border border-slate-200 rounded-full">
              <Icon name="i-heroicons-arrow-down" class="w-4 h-4 text-slate-400" />
              <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Rattachement</span>
              <Icon name="i-heroicons-arrow-down" class="w-4 h-4 text-slate-400" />
            </div>
          </div>

          <!-- Section Courrier Départ -->
          <section class="bg-white rounded-2xl border border-emerald-200/80 overflow-hidden shadow-sm">
            <div
              class="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Icon name="i-heroicons-paper-airplane" class="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <span class="text-[11px] font-bold text-emerald-700 uppercase tracking-widest">Courrier départ</span>
              </div>

              <div v-if="selectedItem._raw?.reponse?.url && selectedItem._raw.reponse.url !== 'Inconnu'">
                <button v-if="!departFileLoaded && !departFileLoading && !departFileError" @click="loadDepartFile"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-all">
                  <Icon name="i-heroicons-document-arrow-down" class="w-3.5 h-3.5" />
                  Charger le document
                </button>
                <div v-else-if="departFileLoading"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400">
                  <div class="w-3.5 h-3.5 border-2 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
                  Chargement...
                </div>
                <div v-else-if="departFileError"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 border border-red-200 rounded-lg">
                  <Icon name="i-heroicons-exclamation-triangle" class="w-3.5 h-3.5 shrink-0" />
                  {{ departFileError }}
                  <button @click="departFileError = ''; loadDepartFile()" class="ml-1 underline hover:no-underline">Réessayer</button>
                </div>
                <div v-else-if="departFileLoaded"
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
                <div class="flex items-stretch gap-0 rounded-xl overflow-hidden border border-emerald-100 hover:border-emerald-200 transition-colors">
                  <div class="w-1 shrink-0 bg-gradient-to-b from-emerald-400 to-teal-500"></div>
                  <div class="flex-1 p-3 bg-gradient-to-r from-emerald-50 to-transparent">
                    <p class="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-0.5">Référence</p>
                    <p class="text-sm font-bold text-emerald-900">{{ selectedItem.ref_depart || 'Sans référence' }}</p>
                  </div>
                </div>
                <div class="flex items-stretch gap-0 rounded-xl overflow-hidden border border-slate-100 hover:border-slate-200 transition-colors">
                  <div class="w-1 shrink-0 bg-gradient-to-b from-slate-300 to-slate-400"></div>
                  <div class="flex-1 p-3 bg-gradient-to-r from-slate-50 to-transparent">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Objet</p>
                    <p class="text-sm text-slate-800 leading-relaxed">{{ selectedItem.objet_depart || 'Non spécifié' }}</p>
                  </div>
                </div>
              </div>
              <div v-if="departFileLoaded" class="mt-2 rounded-xl overflow-hidden border border-emerald-200 shadow-sm">
                <DocumentRpreview :file-preview-url="departBlobUrl" height="600px" />
              </div>
            </div>
          </section>

          <!-- Métadonnées -->
          <section class="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
            <div class="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-slate-100">
              <div class="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center">
                <Icon name="i-heroicons-information-circle" class="w-3.5 h-3.5 text-slate-500" />
              </div>
              <span class="text-[11px] font-bold text-slate-600 uppercase tracking-widest">Informations</span>
            </div>
            <div class="p-4">
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                <div class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>Date de création
                  </p>
                  <p class="text-xs text-slate-800">{{ selectedItem.created_at || '—' }}</p>
                </div>
                <div v-if="selectedItem.created_by"
                  class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>Créé par
                  </p>
                  <p class="text-xs text-slate-800">{{ selectedItem.created_by }}</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Pied modal -->
        <div class="px-6 py-3.5 border-t border-slate-100 shrink-0 flex items-center justify-between bg-white">
          <span class="text-[10px] text-slate-400">{{ selectedItem.ref_arrivee }} → {{ selectedItem.ref_depart }}</span>
          <UButton color="gray" variant="outline" size="sm" @click="closeDetails">Fermer</UButton>
        </div>
      </div>
    </UModal>

    <!-- En-tête -->
    <PageHeader
      v-if="!isAdmin()"
      title="Rattachements de Courriers"
      subtitle="Gestion des rattachements de courriers"
      btnText="Nouveau"
      to="/rattachements/create" />
    <PageHeader
      v-else
      title="Rattachements de Courriers"
      subtitle="Gestion des rattachements de courriers" />

    <!-- Loader premier chargement -->
    <div v-if="initialLoading" class="flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
      <div class="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <span class="text-sm font-medium">Chargement des données...</span>
    </div>

    <!-- Erreur -->
    <div v-else-if="error"
      class="flex items-center gap-4 p-5 bg-red-50 border border-red-200 rounded-xl max-w-2xl">
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
      v-else
      :loading="loading"
      :data="rattachementData"
      :columns="columns"
      :selectable="false"
      :default-sort-column="null"
      :show-row-numbers="true"
      :show-actions="true"
      :default-actions="[]"
      :items-per-page-options="[10, 20, 50, 100]"
      :default-items-per-page="20"
      :left-aligned-columns="['objet_arrivee', 'objet_depart', 'ref_depart', 'ref_arrivee']"
      :hide-labels-when-input="true"
      :external-pagination="true"
      :external-total="total"
      :external-page="currentPage"
      :external-last-page="totalPages"
      :external-per-page="perPage"
      @search-change="onSearchChange"
      @page-change="onPageChange"
      @per-page-change="onPerPageChange"
      @column-filter-change="onColumnFilterChange"
      @view="viewDetails"
      @delete="deleteItem">

      <!-- ── Filtres avancés ─────────────────────────────────────────── -->
      <template #advanced-filters>
        <div class="space-y-4">
          <div class="flex flex-wrap gap-3">
            <div class="flex-1 min-w-[140px]">
              <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Réf. arrivée</label>
              <input v-model="searchFilters.ref_arrivee" placeholder="Filtrer..."
                class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
            </div>
            <div class="flex-1 min-w-[200px]">
              <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Objet arrivée</label>
              <input v-model="searchFilters.objet_arrivee" placeholder="Filtrer..."
                class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
            </div>
            <div class="flex-1 min-w-[140px]">
              <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Réf. départ</label>
              <input v-model="searchFilters.ref_depart" placeholder="Filtrer..."
                class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
            </div>
            <div class="flex-1 min-w-[200px]">
              <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Objet départ</label>
              <input v-model="searchFilters.objet_depart" placeholder="Filtrer..."
                class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
            </div>
            <div class="flex-1 min-w-[160px]">
              <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Date de création (jj/mm/aaaa)</label>
              <input v-model="searchFilters.date_creation" placeholder="ex: 15/03/2024"
                class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
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

      <!-- Référence arrivée cliquable -->
      <template #cell-ref_arrivee="{ value, item }">
        <div class="w-full">
          <button v-if="item._raw?.document?.url && item._raw.document.url !== 'Inconnu'"
            @click="viewDetails(item)"
            class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-all group max-w-[180px]">
            <span class="break-words whitespace-normal min-w-0">{{ value }}</span>
            <Icon name="i-heroicons-eye" class="w-3 h-3 shrink-0 opacity-60 group-hover:opacity-100" />
          </button>
          <span v-else
            class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md max-w-[180px]">
            <Icon name="i-heroicons-document-text" class="w-3.5 h-3.5 shrink-0 opacity-50" />
            <span class="break-words whitespace-normal min-w-0">{{ value }}</span>
          </span>
        </div>
      </template>

      <template #cell-objet_arrivee="{ value }">
        <span class="block text-xs text-slate-800 leading-relaxed whitespace-normal break-words min-w-[200px]" :title="value">{{ value }}</span>
      </template>

      <!-- Référence départ cliquable -->
      <template #cell-ref_depart="{ value, item }">
        <div class="w-full">
          <button @click="viewDetails(item)"
            class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-all group max-w-[180px]">
            <span class="break-words whitespace-normal min-w-0">{{ value }}</span>
            <Icon name="i-heroicons-eye" class="w-3 h-3 shrink-0 opacity-60 group-hover:opacity-100" />
          </button>
        </div>
      </template>

      <template #cell-objet_depart="{ value }">
        <span class="block text-xs text-slate-800 leading-relaxed whitespace-normal break-words min-w-[200px]" :title="value">{{ value }}</span>
      </template>

      <template #cell-link>
        <div class="flex justify-center">
          <Icon name="i-heroicons-arrow-right-circle" class="h-5 w-5 text-blue-500" />
        </div>
      </template>

      <template #actions="{ item }">
        <div class="flex gap-1.5 justify-end">
          <button @click="viewDetails(item)" title="Voir les détails"
            class="inline-flex items-center justify-center w-8 h-8 bg-amber-50 text-amber-700 border border-amber-100 rounded-md hover:bg-amber-200 hover:text-amber-900 transition-all group">
            <Icon name="i-heroicons-eye" class="w-4 h-4 group-hover:text-yellow-600" />
          </button>
          <button @click="deleteItem(item)" title="Supprimer"
            class="inline-flex items-center justify-center w-8 h-8 bg-red-50 text-red-700 border border-red-100 rounded-md hover:bg-red-200 hover:text-red-900 transition-all group">
            <Icon name="i-heroicons-trash" class="w-4 h-4 group-hover:text-red-600" />
          </button>
        </div>
      </template>

      <template #empty-state>
        <div class="text-center py-12">
          <Icon name="i-heroicons-link-slash" class="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun rattachement</h3>
          <p class="text-sm text-gray-500 mb-6">Commencez par créer un rattachement entre un courrier arrivée et un courrier départ.</p>
          <UBadge color="blue" variant="soft" size="lg">
            <Icon name="i-heroicons-plus" class="h-4 w-4 mr-1" />
            <UButton to="/rattachements/create" variant="text" size="sm" class="p-0 m-0 text-blue-600">
              Créer un rattachement
            </UButton>
          </UBadge>
        </div>
      </template>
    </DataTablePaginate>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import DataTablePaginate from '~/components/DataTablePaginate.vue'
import DocumentRpreview from '~/components/DocumentRpreview.vue'
import Swal from 'sweetalert2'
import { useAuth } from '~/composables/auth/useAuth'

useHead({ title: "Rattachements de Courriers - SAGA" })
const { isAdmin } = useAuth()

const config = useRuntimeConfig()

// ── Colonnes ──────────────────────────────────────────────────────────────────
const columns = [
  { key: "ref_arrivee",   label: "Réf. Arrivée",     visible: true, width: 'min-w-[150px]', showLabel: false },
  { key: "objet_arrivee", label: "Objet Arrivée",    visible: true, width: 'min-w-[250px]', showLabel: false },
  { key: "link",          label: "→",                visible: true, width: 'w-16', sortable: false, filterable: false },
  { key: "ref_depart",    label: "Réf. Départ",      visible: true, width: 'min-w-[150px]', showLabel: false },
  { key: "objet_depart",  label: "Objet Départ",     visible: true, width: 'min-w-[250px]', showLabel: false },
  { key: "created_at",    label: "Date de création", visible: true, width: 'min-w-[140px]', showLabel: false, filterable: false },
]

// ── État table ────────────────────────────────────────────────────────────────
const authToken        = ref('')
const rattachementData = ref([])
const loading          = ref(false)
const initialLoading   = ref(false)  // ← AJOUT
const error            = ref(null)
const currentPage      = ref(1)
const totalPages       = ref(1)
const total            = ref(0)
const perPage          = ref(20)

// ── Filtres avancés ───────────────────────────────────────────────────────────
const defaultFilters = () => ({
  search:        '',
  ref_arrivee:   '',
  objet_arrivee: '',
  ref_depart:    '',
  objet_depart:  '',
  date_creation: '',
})

const searchFilters    = ref(defaultFilters())
const columnFilters    = ref({})
let   columnFilterTimeout = null
let   searchTimeout       = null

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

const onColumnFilterChange = (val) => {
  columnFilters.value = { ...val }
  clearTimeout(columnFilterTimeout)
  columnFilterTimeout = setTimeout(() => {
    currentPage.value = 1
    refresh(1, perPage.value, false)
  }, 400)
}

// ── Modal ─────────────────────────────────────────────────────────────────────
const detailsOpen  = ref(false)
const selectedItem = ref(null)

const arriveeFileLoaded  = ref(false)
const arriveeFileLoading = ref(false)
const arriveeFileError   = ref('')
const arriveeBlobUrl     = ref('')

const departFileLoaded  = ref(false)
const departFileLoading = ref(false)
const departFileError   = ref('')
const departBlobUrl     = ref('')

const openingDocumentId = ref(null)

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

const fetchFileAsBlob = async (rawUrl, dateEnreg) => {
  const url = buildDocumentUrl(rawUrl, dateEnreg)
  if (!url) throw new Error('URL du fichier introuvable')
  const token    = localStorage.getItem('auth_token') || ''
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  if (!response.ok) throw new Error(`Erreur ${response.status} — fichier non accessible`)
  const blob = await response.blob()
  return { blob, mimeType: blob.type || guessMimeType(rawUrl) }
}

const revokeModalBlobs = () => {
  if (arriveeBlobUrl.value) { URL.revokeObjectURL(arriveeBlobUrl.value); arriveeBlobUrl.value = '' }
  if (departBlobUrl.value)  { URL.revokeObjectURL(departBlobUrl.value);  departBlobUrl.value  = '' }
}

// ── Chargement fichiers modal ─────────────────────────────────────────────────
const loadArriveeFile = async () => {
  const rawDoc    = selectedItem.value?._raw?.document
  const rawUrl    = rawDoc?.url
  const dateEnreg = rawDoc?.date_enreg
  if (!rawUrl || rawUrl === 'Inconnu') return
  arriveeFileLoading.value = true
  arriveeFileLoaded.value  = false
  arriveeFileError.value   = ''
  if (arriveeBlobUrl.value) { URL.revokeObjectURL(arriveeBlobUrl.value); arriveeBlobUrl.value = '' }
  try {
    const { blob } = await fetchFileAsBlob(rawUrl, dateEnreg)
    arriveeBlobUrl.value    = URL.createObjectURL(blob)
    arriveeFileLoaded.value = true
  } catch (err) {
    arriveeFileError.value = err.message || 'Erreur lors du chargement'
  } finally {
    arriveeFileLoading.value = false
  }
}

const loadDepartFile = async () => {
  const rawDoc    = selectedItem.value?._raw?.reponse
  const rawUrl    = rawDoc?.url
  const dateEnreg = rawDoc?.date_enreg
  if (!rawUrl || rawUrl === 'Inconnu') return
  departFileLoading.value = true
  departFileLoaded.value  = false
  departFileError.value   = ''
  if (departBlobUrl.value) { URL.revokeObjectURL(departBlobUrl.value); departBlobUrl.value = '' }
  try {
    const { blob } = await fetchFileAsBlob(rawUrl, dateEnreg)
    departBlobUrl.value    = URL.createObjectURL(blob)
    departFileLoaded.value = true
  } catch (err) {
    departFileError.value = err.message || 'Erreur lors du chargement'
  } finally {
    departFileLoading.value = false
  }
}

// ── Transform ─────────────────────────────────────────────────────────────────
const transformerDonneesAPI = (response) => {
  if (!response?.data) throw new Error('Format de réponse API invalide')
  return response.data.map(rattachement => ({
    id:            rattachement.id,
    ref_arrivee:   rattachement.document?.reference || '',
    objet_arrivee: rattachement.document?.objet     || '',
    link:          '→',
    ref_depart:    rattachement.reponse?.reference  || '',
    objet_depart:  rattachement.reponse?.objet      || '',
    created_at:    formatDate(rattachement.created_at),
    created_by:    rattachement.user?.name || 'Système',
    _raw:          rattachement,
  }))
}

// ── Chargement paginé ─────────────────────────────────────────────────────────
const refresh = async (page = 1, per_page = perPage.value, isFirst = false) => {  // ← AJOUT isFirst
  if (isFirst) {
    initialLoading.value = true
  } else {
    loading.value = true
  }
  error.value = null

  try {
    const token  = localStorage.getItem('auth_token') || ''
    const base   = config.public.apiBase.replace(/\/$/, '')
    const params = new URLSearchParams({ page: String(page), per_page: String(per_page) })

    const f = searchFilters.value
    if (f.search)        params.append('search',        f.search)
    if (f.ref_arrivee)   params.append('ref_arrivee',   f.ref_arrivee)
    if (f.objet_arrivee) params.append('objet_arrivee', f.objet_arrivee)
    if (f.ref_depart)    params.append('ref_depart',    f.ref_depart)
    if (f.objet_depart)  params.append('objet_depart',  f.objet_depart)
    if (f.date_creation && f.date_creation.length === 10)
      params.append('date_creation', f.date_creation)

    const c = columnFilters.value
    if (!f.ref_arrivee   && c.ref_arrivee)   params.append('ref_arrivee',   c.ref_arrivee)
    if (!f.objet_arrivee && c.objet_arrivee) params.append('objet_arrivee', c.objet_arrivee)
    if (!f.ref_depart    && c.ref_depart)    params.append('ref_depart',    c.ref_depart)
    if (!f.objet_depart  && c.objet_depart)  params.append('objet_depart',  c.objet_depart)

    const response = await $fetch(`${base}/reponses?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    // ← AJOUT garde défensive
    if (!response?.meta?.current_page) {
      console.error('❌ Réponse API inattendue:', JSON.stringify(response))
      throw new Error('Réponse du serveur invalide ou session expirée')
    }

    rattachementData.value = transformerDonneesAPI(response)
    currentPage.value      = response.meta.current_page
    totalPages.value       = response.meta.last_page
    total.value            = response.meta.total

  } catch (err) {
    console.error('❌ Erreur chargement rattachements:', err)
    error.value = err.message || 'Impossible de charger les rattachements'
  } finally {
    initialLoading.value = false  // ← AJOUT
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

watch(searchFilters, (f) => {
  const dateOk = !f.date_creation || f.date_creation.length === 10
  if (!dateOk) return
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    refresh(1, perPage.value, false)
  }, 400)
}, { deep: true })

// ── Bouton Actualiser ─────────────────────────────────────────────────────────
const loadData = () => refresh(currentPage.value, perPage.value, false)

// ── Modal ─────────────────────────────────────────────────────────────────────
const viewDetails = (item) => {
  revokeModalBlobs()
  selectedItem.value       = item
  arriveeFileLoaded.value  = false
  arriveeFileLoading.value = false
  arriveeFileError.value   = ''
  departFileLoaded.value   = false
  departFileLoading.value  = false
  departFileError.value    = ''
  detailsOpen.value        = true
}

const closeDetails = () => {
  revokeModalBlobs()
  detailsOpen.value        = false
  selectedItem.value       = null
  arriveeFileLoaded.value  = false
  arriveeFileError.value   = ''
  departFileLoaded.value   = false
  departFileError.value    = ''
}

// ── Suppression ───────────────────────────────────────────────────────────────
const deleteItem = async (item) => {
  const result = await Swal.fire({
    title: 'Confirmer la suppression',
    html: `
      <div class="text-left">
        <p class="mb-3">Êtes-vous sûr de vouloir supprimer ce rattachement ?</p>
        <div class="bg-gray-50 rounded-lg p-4 flex items-center justify-center gap-3">
          <span class="px-2.5 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">${item.ref_arrivee}</span>
          <span class="text-slate-500">→</span>
          <span class="px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full">${item.ref_depart}</span>
        </div>
        <p class="mt-3 text-sm text-gray-500">Cette action est irréversible.</p>
      </div>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler',
    reverseButtons: true,
  })
  if (!result.isConfirmed) return
  try {
    const token = localStorage.getItem('auth_token') || ''
    await $fetch(`${config.public.apiBase}/reponses/${item.id}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
    })
    await Swal.fire({ title: 'Supprimé !', text: 'Le rattachement a été supprimé avec succès', icon: 'success', timer: 2000, showConfirmButton: false })
    await refresh(currentPage.value, perPage.value, false)
  } catch (err) {
    await Swal.fire({ title: 'Erreur', text: 'Impossible de supprimer le rattachement', icon: 'error', confirmButtonColor: '#2563eb' })
  }
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(async () => {
  if (process.client) authToken.value = localStorage.getItem('auth_token') || ''
  await refresh(1, perPage.value, true)  // ← isFirst = true
})
</script>

<style scoped>
:deep(.swal2-html-container) { margin: 1rem 0; }
:deep(.swal2-actions) { gap: 0.75rem; }
:deep(.swal2-confirm),
:deep(.swal2-cancel) {
  padding: 0.625rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s;
}
:deep(.swal2-confirm):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
:deep(.swal2-cancel):hover { background-color: #4b5563 !important; }
</style>