<template>
  <!-- En-tête -->
  <div class="flex items-center justify-between mb-6">
    <h1 class="flex items-center gap-3 text-2xl font-bold text-slate-800">
      <Icon name="i-heroicons-inbox" class="w-7 h-7 text-blue-600" />
      Documents reçus
    </h1>
    <div class="flex items-center gap-3">
      <button @click="refresh(currentPage, perPage, false)"
        class="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all hover:shadow-md">
        <Icon name="i-heroicons-arrow-path" class="w-4 h-4" />
        Actualiser
      </button>
      <UBadge color="blue" variant="soft" size="lg" class="ml-auto">
        <Icon name="i-heroicons-document-text" class="h-4 w-4 mr-1" />
        <span class="text-sm">{{ total }} document{{ total > 1 ? 's' : '' }}</span>
      </UBadge>
    </div>
  </div>

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
    :data="affectationData"
    :columns="columns"
    :selectable="false"
    :default-sort-column="null"
    :show-row-numbers="true"
    :show-actions="true"
    :default-actions="[]"
    :items-per-page-options="[10, 25, 50, 100]"
    :default-items-per-page="25"
    :left-aligned-columns="['objet_courrier', 'instructions', 'reference_courrier', 'emetteur', 'destinataire']"
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
            <input v-model="searchFilters.reference_courrier" placeholder="Filtrer..."
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
          </div>
          <div class="flex-1 min-w-[200px]">
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Objet</label>
            <input v-model="searchFilters.objet_courrier" placeholder="Filtrer..."
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
          </div>
          <div class="flex-1 min-w-[160px]">
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Émetteur</label>
            <input v-model="searchFilters.emetteur" placeholder="Filtrer..."
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
          </div>
          <div class="flex-1 min-w-[150px]">
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Date d'affectation</label>
            <input v-model="searchFilters.date_affect" type="date"
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
          </div>
        </div>
        <div class="flex flex-wrap gap-3">
          <div class="flex-1 min-w-[150px]">
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Date de retour attendue</label>
            <input v-model="searchFilters.delai_traitement" type="date"
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
          </div>
          <div class="flex-1 min-w-[150px]">
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Date de clôture</label>
            <input v-model="searchFilters.date_cloture" type="date"
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
          </div>
          <div class="flex-1 min-w-[140px]">
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Statut</label>
            <select v-model="searchFilters.statut"
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all">
              <option value="">Tous</option>
              <option value="en attente">En attente</option>
              <option value="en cours">En cours</option>
              <option value="traite">Traité</option>
              <option value="cloture">Clôturé</option>
              <option value="annule">Annulé</option>
            </select>
          </div>
          <div class="flex-1 min-w-[140px]">
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Priorité</label>
            <select v-model="searchFilters.priority"
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all">
              <option value="">Toutes</option>
              <option value="URGENT">Urgent</option>
              <option value="IMPORTANT">Important</option>
              <option value="STANDARD">Standard</option>
            </select>
          </div>
          <div class="flex-1 min-w-[140px]">
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Type</label>
            <select v-model="searchFilters.type"
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all">
              <option value="">Tous</option>
              <option value="affectation">Affectation</option>
              <option value="transfert">Transfert</option>
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

    <!-- ── Cellule statut ── -->
    <template #cell-statut="{ value }">
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide"
        :class="getStatutClasses(value)">
        <span class="w-2 h-2 rounded-full mr-1.5" :class="getStatutDotClass(value)"></span>
        {{ value }}
      </span>
    </template>

    <!-- ── Cellule priorité ── -->
    <template #cell-priority="{ value }">
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide"
        :class="getPriorityClasses(value)">
        <span class="w-2 h-2 rounded-full mr-1.5" :class="getPriorityDotClass(value)"></span>
        {{ value }}
      </span>
    </template>

    <!-- ── Cellule instructions ── -->
    <template #cell-instructions="{ value }">
      <span class="block max-w-[300px] line-clamp-2 text-xs text-slate-700" :title="value">
        {{ value || 'Aucune instruction' }}
      </span>
    </template>

    <!-- ── Cellule objet ── -->
    <template #cell-objet_courrier="{ value }">
      <span class="block text-xs text-slate-800 leading-relaxed whitespace-normal break-words min-w-[200px]" :title="value">
        {{ value }}
      </span>
    </template>

    <!-- ── Référence cliquable → ouvre via Blob ── -->
    <template #cell-reference_courrier="{ value, item }">
      <div class="w-full">
        <button
          v-if="item._raw?.courrier_arrive?.document?.url && item._raw.courrier_arrive.document.url !== 'Inconnu'"
          @click="handleViewDetails(item)"
          class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-all group max-w-[180px]"
          :disabled="openingDocumentId === item.id"
          :title="`Ouvrir le document ${value}`">
          <Icon
            :name="openingDocumentId === item.id ? 'i-heroicons-arrow-path' : 'i-heroicons-document-text'"
            class="w-3.5 h-3.5 shrink-0"
            :class="openingDocumentId === item.id ? 'animate-spin' : 'group-hover:scale-110 transition-transform'" />
          <span class="break-words whitespace-normal min-w-0">{{ value }}</span>
          <Icon name="i-heroicons-arrow-top-right-on-square" class="w-3 h-3 shrink-0 opacity-60 group-hover:opacity-100" />
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
        <button @click="handleViewDetails(item)" title="Voir les détails"
          class="inline-flex items-center justify-center w-8 h-8 bg-amber-50 text-amber-700 border border-amber-100 rounded-md hover:bg-amber-200 hover:text-amber-900 transition-all group">
          <Icon name="i-heroicons-eye" class="w-4 h-4 group-hover:text-yellow-600" />
        </button>
        <button v-if="isResponsable" @click="handleQuickAssign(item.courrier_id)" :disabled="!item.courrier_id"
          title="Affecter ce courrier"
          class="inline-flex items-center justify-center w-8 h-8 bg-sky-50 text-sky-700 border border-sky-100 rounded-md hover:bg-sky-200 hover:text-sky-900 transition-all group disabled:opacity-40 disabled:cursor-not-allowed">
          <Icon name="i-heroicons-paper-airplane" class="w-4 h-4 group-hover:text-blue-600" />
        </button>
        <button v-if="isResponsable" @click="handleQuickTransfer(item.courrier_id)" :disabled="!item.courrier_id"
          title="Transférer ce courrier"
          class="inline-flex items-center justify-center w-8 h-8 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md hover:bg-emerald-200 hover:text-emerald-900 transition-all group disabled:opacity-40 disabled:cursor-not-allowed">
          <Icon name="i-heroicons-arrow-path-rounded-square" class="w-4 h-4 group-hover:text-green-600" />
        </button>
      </div>
    </template>

  </DataTablePaginate>

  
  <!-- ── Modal détails ── -->
  <UModal v-model="detailsOpen" :ui="{ width: 'sm:max-w-3xl' }">
    <div v-if="selectedAffectation" class="flex flex-col max-h-[90vh] bg-white rounded-xl overflow-hidden">

      <!-- En-tête gradient -->
      <div class="relative flex items-center justify-between px-6 py-4 shrink-0 overflow-hidden"
        style="background: linear-gradient(135deg, #2563eb 0%, #8b5cf6 50%, #a78bfa 100%);">
        <div class="absolute inset-0 opacity-10"
          style="background-image: radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px); background-size: 32px 32px;">
        </div>
        <div class="relative flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner border border-white/30">
            <Icon name="i-heroicons-clipboard-document-list" class="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 class="text-base font-bold text-white leading-tight">Détails de l'affectation</h2>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-xs text-blue-200 font-medium">#{{ selectedAffectation.id }}</span>
              <span v-if="selectedAffectation?.statut"
                class="inline-flex px-1.5 py-0.5 text-[10px] font-bold rounded-md uppercase border bg-white/20 text-white border-white/30">
                {{ selectedAffectation.statut }}
              </span>
              <span v-if="selectedAffectation.priority"
                class="inline-flex px-1.5 py-0.5 text-[10px] font-bold rounded-md uppercase border" :class="{
                  'bg-red-400/30 text-red-100 border-red-300/50':    selectedAffectation.priority === 'URGENT',
                  'bg-orange-400/30 text-orange-100 border-orange-300/50': selectedAffectation.priority === 'IMPORTANT',
                  'bg-blue-400/30 text-blue-100 border-blue-300/50': selectedAffectation.priority === 'STANDARD',
                }">
                {{ selectedAffectation.priority }}
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
          <div class="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <div class="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
              <Icon name="i-heroicons-inbox-arrow-down" class="w-3.5 h-3.5 text-blue-600" />
            </div>
            <span class="text-[11px] font-bold text-blue-700 uppercase tracking-widest">Courrier associé</span>
          </div>
          <div class="p-4 space-y-3">
            <div class="grid grid-cols-1 gap-2">
              <div class="flex items-stretch gap-0 rounded-xl overflow-hidden border border-indigo-100 hover:border-indigo-200 transition-colors">
                <div class="w-1 shrink-0 bg-gradient-to-b from-indigo-400 to-indigo-600"></div>
                <div class="flex-1 p-3 bg-gradient-to-r from-indigo-50 to-transparent">
                  <p class="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-0.5">Référence</p>
                  <p class="text-sm font-bold text-indigo-900">{{ selectedAffectation.reference_courrier || 'Sans référence' }}</p>
                </div>
              </div>
              <div class="flex items-stretch gap-0 rounded-xl overflow-hidden border border-amber-100 hover:border-amber-200 transition-colors">
                <div class="w-1 shrink-0 bg-gradient-to-b from-amber-400 to-orange-500"></div>
                <div class="flex-1 p-3 bg-gradient-to-r from-amber-50 to-transparent">
                  <p class="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-0.5">Objet</p>
                  <p class="text-sm text-gray-800 leading-relaxed">{{ selectedAffectation.objet_courrier || 'Non spécifié' }}</p>
                </div>
              </div>
            </div>

            <!-- ── Preview document courrier ──────────────────────────── -->
            <div class="pt-1">
              <div v-if="selectedAffectation._raw?.courrier_arrive?.document?.url &&
                         selectedAffectation._raw.courrier_arrive.document.url !== 'Inconnu'">
                <!-- Pas encore chargé -->
                <button
                  v-if="!docFileLoaded && !docFileLoading && !docFileError"
                  @click="loadDocFile"
                  class="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-all hover:shadow-sm">
                  <Icon name="i-heroicons-document-arrow-down" class="w-4 h-4" />
                  Charger le document
                </button>
                <!-- Chargement -->
                <div v-else-if="docFileLoading"
                  class="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-400">
                  <div class="w-4 h-4 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin"></div>
                  Chargement...
                </div>
                <!-- Erreur -->
                <div v-else-if="docFileError"
                  class="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-500 bg-red-50 border border-red-200 rounded-xl">
                  <Icon name="i-heroicons-exclamation-triangle" class="w-4 h-4 shrink-0" />
                  {{ docFileError }}
                  <button @click="docFileError = ''; loadDocFile()"
                    class="ml-1 underline hover:no-underline">Réessayer</button>
                </div>
                <!-- Préview -->
                <div v-else-if="docFileLoaded" class="mt-2 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                  <DocumentRpreview :file-preview-url="docBlobUrl" height="400px" />
                </div>
              </div>
              <div v-else class="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-400 bg-slate-50 border border-slate-200 rounded-xl cursor-not-allowed">
                <Icon name="i-heroicons-document-text" class="w-4 h-4" />
                Aucun document disponible
              </div>
            </div>
          </div>
        </section>

        <!-- Section affectation -->
        <section class="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
          <div class="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-50 to-sky-50 border-b border-blue-100">
            <div class="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
              <Icon name="i-heroicons-clipboard-document-check" class="w-3.5 h-3.5 text-blue-600" />
            </div>
            <span class="text-[11px] font-bold text-blue-700 uppercase tracking-widest">Informations d'affectation</span>
          </div>
          <div class="p-4 space-y-3">
            <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
              <div class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-blue-300 inline-block"></span>Type
                </p>
                <p class="text-xs font-semibold text-slate-800">{{ selectedAffectation.type || '—' }}</p>
              </div>
              <div class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>Date d'affectation
                </p>
                <p class="text-xs text-slate-800">{{ selectedAffectation.date_affect || '—' }}</p>
              </div>
              <div class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-300 inline-block"></span>Date de retour attendue
                </p>
                <p class="text-xs text-slate-800">{{ selectedAffectation.delai_traitement || '—' }}</p>
              </div>
              <div v-if="selectedAffectation.date_cloture" class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-green-300 inline-block"></span>Date de clôture
                </p>
                <p class="text-xs text-slate-800">{{ selectedAffectation.date_cloture }}</p>
              </div>
              <div v-if="selectedAffectation.emetteur" class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-indigo-300 inline-block"></span>Émetteur
                </p>
                <p class="text-xs text-slate-800">{{ selectedAffectation.emetteur }}</p>
              </div>
              <div v-if="selectedAffectation.destinataire" class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>Destinataire
                </p>
                <p class="text-xs text-slate-800">{{ selectedAffectation.destinataire }}</p>
              </div>
            </div>
            <div v-if="selectedAffectation.instructions"
              class="flex items-stretch gap-0 rounded-xl overflow-hidden border border-amber-100 hover:border-amber-200 transition-colors">
              <div class="w-1 shrink-0 bg-gradient-to-b from-amber-400 to-yellow-500"></div>
              <div class="flex-1 p-3 bg-gradient-to-r from-amber-50 to-transparent">
                <p class="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-1.5">Annotations / Instructions</p>
                <p class="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{{ selectedAffectation.instructions }}</p>
              </div>
            </div>
            <div v-else class="flex items-stretch gap-0 rounded-xl overflow-hidden border border-slate-100">
              <div class="w-1 shrink-0 bg-slate-200"></div>
              <div class="flex-1 p-3 bg-slate-50">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Annotations / Instructions</p>
                <p class="text-xs text-slate-400 italic">Aucune instruction</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Pied modal -->
      <div class="px-6 py-3.5 border-t border-slate-100 shrink-0 flex items-center justify-between bg-white">
        <span class="text-[10px] text-slate-400">Affectation #{{ selectedAffectation.id }}</span>
        <UButton color="gray" variant="outline" size="sm" @click="closeDetails">Fermer</UButton>
      </div>
    </div>
  </UModal>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import DataTablePaginate from '~/components/DataTablePaginate.vue'
import DocumentRpreview from '~/components/DocumentRpreview.vue'
import { useAffectationsStore } from '~/stores/affectations.js'
import { useTransfertsStore } from '~/stores/transferts.js'
import { useAuth } from '~/composables/auth/useAuth'

const affectationsStore = useAffectationsStore()
const transfertsStore   = useTransfertsStore()
const { isSecDir, getDirecteurEntiteUserId } = useAuth()
const config = useRuntimeConfig()
const toast  = useToast()

useHead({ title: 'Documents reçus - Sagar Revolution' })

// ── Colonnes ──────────────────────────────────────────────────────────────────
const columns = [
  { key: 'reference_courrier', label: 'Référence du Courrier', visible: true,  inputPlaceholder: 'Réf...',   showLabel: false },
  { key: 'objet_courrier',     label: 'Objet',                 visible: true,  showLabel: false },
  { key: 'doc_courrier',       label: 'Document',              visible: false, type: 'document', filterable: false },
  { key: 'date_affect',        label: "Date d'affectation",    visible: true,  filterable: false },
  { key: 'instructions',       label: 'Annotations',           visible: true,  filterable: false },
  { key: 'type',               label: 'Type',                  visible: true,  filterable: false },
  { key: 'statut',             label: 'Statut',                visible: true,  type: 'badge',    filterable: false },
  { key: 'priority',           label: 'Priorité',              visible: true,  type: 'badge',    filterable: false },
  { key: 'delai_traitement',   label: 'Date de retour attendue', visible: true, filterable: false },
  { key: 'date_cloture',       label: 'Date clôture',          visible: false, filterable: false },
  { key: 'emetteur',           label: 'Source',                visible: true,  inputPlaceholder: 'Source...' },
  { key: 'destinataire',       label: 'Destinataire',          visible: false, filterable: false },
]

// ── État table ────────────────────────────────────────────────────────────────
const affectationData = ref([])
const loading         = ref(false)
const initialLoading  = ref(false)
const error           = ref(null)
const currentPage     = ref(1)
const totalPages      = ref(1)
const total           = ref(0)
const perPage         = ref(25)
const isResponsable   = ref(false)

// ── Modal ─────────────────────────────────────────────────────────────────────
const detailsOpen         = ref(false)
const selectedAffectation = ref(null)

// État fichier document dans la modal
const docFileLoaded  = ref(false)
const docFileLoading = ref(false)
const docFileError   = ref('')
const docBlobUrl     = ref('')

// Ouverture depuis le tableau
const openingDocumentId = ref(null)

// ── Filtres avancés ───────────────────────────────────────────────────────────
const defaultFilters = () => ({
  search:              '',
  reference_courrier:  '',
  objet_courrier:      '',
  emetteur:            '',
  date_affect:         '',
  delai_traitement:    '',
  date_cloture:        '',
  statut:              '',
  priority:            '',
  type:                '',
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
  const rawDoc    = selectedAffectation.value?._raw?.courrier_arrive?.document
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
const transformerDonneesAPI = (reponseAPI) => {
  if (!reponseAPI?.data) throw new Error('Format de réponse API invalide')

  return reponseAPI.data.map(affectation => {
    let emetteurFormate = ''
    if (affectation?.emetteur?.user?.nom && affectation?.emetteur?.entite?.code) {
      const nomComplet = `${affectation.emetteur.user.nom} ${affectation.emetteur.user.prenom || ''}`.trim()
      const codeEntite = affectation.emetteur.entite.code
      const isResp     = affectation.emetteur.is_responsable
      emetteurFormate  = isResp ? `${nomComplet} (${codeEntite})` : `${nomComplet} - Agent / ${codeEntite}`
    }

    let destinataireFormate = ''
    if (affectation?.destinataire?.user?.nom && affectation?.destinataire?.entite?.code) {
      const nomComplet    = `${affectation.destinataire.user.nom} ${affectation.destinataire.user.prenom || ''}`.trim()
      const codeEntite    = affectation.destinataire.entite.code
      const isResp        = affectation.destinataire.is_responsable
      destinataireFormate = isResp ? `${nomComplet} (${codeEntite})` : `${nomComplet} - Agent / ${codeEntite}`
    }

    // On stocke le nom brut uniquement — jamais l'URL construite
    const rawUrl = affectation?.courrier_arrive?.document?.url?.trim()

    return {
      id:                 affectation.id,
      courrier_id:        affectation.courrier_arrive_id || null,
      reference_courrier: affectation?.courrier_arrive?.document?.reference || '',
      objet_courrier:     affectation?.courrier_arrive?.document?.objet      || '',
      doc_courrier:       (rawUrl && rawUrl !== 'Inconnu') ? rawUrl : '',  // nom brut uniquement
      date_affect:        formatDate(affectation.date_affect),
      instructions:       affectation.instructions     || '',
      type:               affectation.type_affectation  || '',
      statut:             affectation.statut            || '',
      priority:           affectation.priority          || '',
      delai_traitement:   formatDate(affectation.delai_traitement),
      date_cloture:       formatDate(affectation.date_cloture),
      emetteur:           emetteurFormate,
      destinataire:       destinataireFormate,
      _raw:               affectation,  // anciennement _complete
    }
  })
}

// ── Chargement ────────────────────────────────────────────────────────────────
const refresh = async (page = 1, per_page = perPage.value, isFirst = false) => {
  if (isFirst) {
    initialLoading.value = true
  } else {
    loading.value = true
  }
  error.value = null

  try {
    const authToken = localStorage.getItem('auth_token') || ''

    let entite_user = null
    const savedFunction = localStorage.getItem('entite_user')
    if (savedFunction) {
      entite_user         = JSON.parse(savedFunction)
      isResponsable.value = entite_user.is_responsable || false
    }

    if (!entite_user?.id) {
      error.value = 'Aucune fonction user sélectionnée'
      return
    }

    const destinataireId = isSecDir()
      ? (getDirecteurEntiteUserId() ?? entite_user.id)
      : entite_user.id

    const params = new URLSearchParams({
      page:     String(page),
      per_page: String(per_page),
    })

    const f = searchFilters.value
    if (f.search)             params.append('search',             f.search)
    if (f.reference_courrier) params.append('reference_courrier', f.reference_courrier)
    if (f.objet_courrier)     params.append('objet_courrier',     f.objet_courrier)
    if (f.emetteur)           params.append('emetteur',           f.emetteur)
    if (f.date_affect)        params.append('date_affect',        f.date_affect)
    if (f.delai_traitement)   params.append('delai_traitement',   f.delai_traitement)
    if (f.date_cloture)       params.append('date_cloture',       f.date_cloture)
    if (f.statut)             params.append('statut',             f.statut)
    if (f.priority)           params.append('priority',           f.priority)
    if (f.type)               params.append('type_affectation',   f.type)

    const c = columnFilters.value
    if (!f.reference_courrier && c.reference_courrier) params.append('reference_courrier', c.reference_courrier)
    if (!f.objet_courrier     && c.objet_courrier)     params.append('objet_courrier',     c.objet_courrier)
    if (!f.emetteur           && c.emetteur)           params.append('emetteur',           c.emetteur)

    const base    = config.public.apiBase.replace(/\/$/, '')
    const reponse = await $fetch(
      `${base}/affectations/destinataire/${destinataireId}?${params.toString()}`,
      { method: 'GET', headers: { Authorization: `Bearer ${authToken}` } }
    )

    affectationData.value = transformerDonneesAPI(reponse)
    currentPage.value     = reponse.meta?.current_page ?? page
    totalPages.value      = reponse.meta?.last_page     ?? 1
    total.value           = reponse.meta?.total         ?? affectationData.value.length

  } catch (err) {
    console.error('❌ Erreur chargement affectations:', err)
    error.value = err.message || 'Erreur lors du chargement des données'
    toast.add({ title: 'Erreur', description: 'Impossible de charger les affectations', color: 'red', timeout: 1500 })
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

// ── Styles statut / priorité ──────────────────────────────────────────────────
const getStatutClasses  = (s) => ({ 'en attente': 'bg-gray-100 text-gray-800', 'en cours': 'bg-blue-100 text-blue-800', 'traite': 'bg-green-100 text-green-800', 'cloture': 'bg-emerald-100 text-emerald-800', 'annule': 'bg-red-100 text-red-800' }[s]  || 'bg-gray-100 text-gray-800')
const getStatutDotClass = (s) => ({ 'en attente': 'bg-gray-500',               'en cours': 'bg-blue-500',               'traite': 'bg-green-500',               'cloture': 'bg-emerald-500',               'annule': 'bg-red-500' }[s]             || 'bg-gray-500')
const getPriorityClasses  = (p) => ({ URGENT: 'bg-red-100 text-red-800', IMPORTANT: 'bg-orange-100 text-orange-800', STANDARD: 'bg-blue-100 text-blue-800' }[p] || 'bg-gray-100 text-gray-800')
const getPriorityDotClass = (p) => ({ URGENT: 'bg-red-500',              IMPORTANT: 'bg-orange-500',                STANDARD: 'bg-blue-500' }[p]             || 'bg-gray-500')

// ── Handlers actions ──────────────────────────────────────────────────────────
const handleViewDetails = (item) => {
  selectedAffectation.value = item
  docFileLoaded.value       = false
  docFileLoading.value      = false
  docFileError.value        = ''
  if (docBlobUrl.value) { URL.revokeObjectURL(docBlobUrl.value); docBlobUrl.value = '' }
  detailsOpen.value = true
}

const closeDetails = () => {
  detailsOpen.value         = false
  selectedAffectation.value = null
  docFileLoaded.value       = false
  docFileError.value        = ''
  if (docBlobUrl.value) { URL.revokeObjectURL(docBlobUrl.value); docBlobUrl.value = '' }
}

const handleQuickAssign = (courrierId) => {
  if (!courrierId) { toast.add({ title: 'Erreur', description: 'ID du courrier introuvable', color: 'red', timeout: 1500 }); return }
  if (process.client) sessionStorage.setItem('preselected_courrier_id', courrierId.toString())
  navigateTo('/affectations/create')
}

const handleQuickTransfer = (courrierId) => {
  if (!courrierId) { toast.add({ title: 'Erreur', description: 'ID du courrier introuvable', color: 'red', timeout: 1500 }); return }
  if (process.client) sessionStorage.setItem('preselected_courrier_id_transfer', courrierId.toString())
  navigateTo('/affectations-transferts/form-transfert')
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(() => {
  refresh(1, perPage.value, true)
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>