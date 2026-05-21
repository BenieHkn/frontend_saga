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

  <!-- Loader premier chargement -->
  <div v-if="initialLoading" class="flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
    <div class="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
    <span class="text-sm font-medium">Chargement des données...</span>
  </div>
  <template v-else>
    <!-- Erreur -->
    <div v-if="error" class="flex items-center gap-4 p-5 mb-5 bg-red-50 border border-red-200 rounded-xl max-w-2xl">
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
    <DataTablePaginate :loading="loading" :data="affectationData" :columns="columns" :selectable="false" :row-class="rowClassByAffectation"
      :default-sort-column="null" :show-row-numbers="true" :show-actions="true" :default-actions="[]"
      :items-per-page-options="[10, 20, 50, 100]" :default-items-per-page="20"
      :left-aligned-columns="['objet_courrier', 'instructions', 'reference_courrier', 'emetteur', 'destinataire']"
      :external-pagination="true" :external-total="total" :external-page="currentPage" :external-last-page="totalPages"
      :external-per-page="perPage" :show-period-loading="periodLoading" @search-change="onSearchChange" @page-change="onPageChange"
      @per-page-change="onPerPageChange" @column-filter-change="onColumnFilterChange">

      <template #toolbar-extra>
        <PeriodFilter
          :field="searchFilters.date_field"
          :from="searchFilters.date_from"
          :to="searchFilters.date_to"
          :loading="loading"
          @change="onPeriodChange" />
      </template>

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
                <option value="en cours">En cours</option>
                <option value="cloture">Clôturé</option>
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

      <!-- ── Cellule objet ── -->
      <template #cell-objet_courrier="{ value }">
        <span class="block text-xs text-slate-800 leading-relaxed whitespace-normal break-words min-w-[200px]" :title="value">
          {{ value }}
        </span>
      </template>

      <!-- ── Référence cliquable → ouvre via Blob ── -->
      <template #cell-reference_courrier="{ value, item }">
        <div class="w-full">
          <button v-if="item._raw?.courrier_arrive?.document?.url && item._raw.courrier_arrive.document.url !== 'Inconnu'"
            @click="handleViewDetails(item)"
            class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-all group max-w-[180px]"
            :disabled="openingDocumentId === item.id" :title="`Ouvrir le document ${value}`">
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

          <!-- Voir les détails — toujours actif -->
          <button @click="handleViewDetails(item)" title="Voir les détails"
            class="inline-flex items-center justify-center w-8 h-8 bg-amber-50 text-amber-700 border border-amber-100 rounded-md hover:bg-amber-200 hover:text-amber-900 transition-all group">
            <Icon name="i-heroicons-eye" class="w-4 h-4 group-hover:text-yellow-600" />
          </button>

          <!-- Circuit d'affectation — survol + popup -->
          <div class="relative" @mouseenter="openAffectationPreview($event, item)" @mouseleave="closeAffectationPreview">
            <button @click="openAffectationCircuitDetails(item)" type="button"
              title="Voir le circuit d'affectation"
              class="inline-flex items-center justify-center w-8 h-8 bg-slate-100 text-orange-700 border border-orange-100 rounded-md hover:bg-orange-100 transition-all group">
              <Icon name="i-heroicons-users" class="w-4 h-4 group-hover:text-orange-900" />
            </button>

            <Teleport to="body">
              <div v-if="hoveredAffectationItemId === item.id"
                class="fixed z-[9999] w-[340px] bg-white border border-slate-200 shadow-2xl rounded-2xl p-3 text-xs text-slate-700 pointer-events-none"
                :style="tooltipStyle">
                <div class="flex items-center justify-between gap-2 mb-3">
                  <div class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Circuit d'affectation</div>
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-100 text-[10px]">
                    <Icon name="i-heroicons-users" class="w-3 h-3" />
                    {{ item.isAffected ? 'Affecté' : 'Vide' }}
                  </span>
                </div>
                <div class="space-y-2">
                  <template v-if="item.affectation_circuit?.length">
                    <div v-for="(node, idx) in item.affectation_circuit" :key="idx"
                      class="rounded-xl border border-slate-100 bg-slate-50 p-2.5 space-y-1.5">
                      <div class="flex items-center justify-between gap-2">
                        <div class="text-[11px] font-semibold text-slate-800">{{ node.emetteur }}</div>
                        <span v-if="node.raw?.id"
                          class="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-md bg-indigo-50 text-indigo-600 border border-indigo-100">
                          #{{ node.raw.id }}
                        </span>
                      </div>
                      <div class="pl-2 space-y-1 text-[11px] text-slate-600 border-l-2 border-slate-200">
                        <div><strong>Destinataires :</strong> {{ node.destinataires.join(', ') || 'Aucun destinataire' }}</div>
                        <div><strong>Priorité :</strong> {{ node.priority || '—' }}</div>
                        <div><strong>Instruction :</strong> {{ node.instructions || 'Aucune instruction' }}</div>
                      </div>
                    </div>
                  </template>
                  <div v-else class="text-[11px] text-slate-500 py-1">Aucun circuit d'affectation trouvé.</div>
                </div>
              </div>
            </Teleport>
          </div>

          <!-- Bouton Affecter -->
          <template v-if="isResponsable">
            <button
              v-if="!isActionBlocked(item)"
              @click="handleQuickAssign(item.courrier_id)"
              :disabled="!item.courrier_id"
              title="Affecter ce courrier"
              class="inline-flex items-center justify-center w-8 h-8 bg-sky-50 text-sky-700 border border-sky-100 rounded-md hover:bg-sky-200 hover:text-sky-900 transition-all group disabled:opacity-40 disabled:cursor-not-allowed">
              <Icon name="i-heroicons-paper-airplane" class="w-4 h-4 group-hover:text-blue-600" />
            </button>
            <div
              v-else
              :title="item.is_cloture ? 'Affectation clôturée' : 'Ce courrier a déjà une réponse'"
              class="inline-flex items-center justify-center w-8 h-8 bg-slate-100 text-slate-300 border border-slate-200 rounded-md cursor-not-allowed">
              <Icon name="i-heroicons-paper-airplane" class="w-4 h-4" />
            </div>
          </template>

          <!-- Bouton Transférer -->
          <template v-if="isResponsable">
            <button
              v-if="!isActionBlocked(item)"
              @click="handleQuickTransfer(item.courrier_id)"
              :disabled="!item.courrier_id"
              title="Transférer ce courrier"
              class="inline-flex items-center justify-center w-8 h-8 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md hover:bg-emerald-200 hover:text-emerald-900 transition-all group disabled:opacity-40 disabled:cursor-not-allowed">
              <Icon name="i-heroicons-arrow-path-rounded-square" class="w-4 h-4 group-hover:text-green-600" />
            </button>
            <div
              v-else
              :title="item.is_cloture ? 'Affectation clôturée' : 'Ce courrier a déjà une réponse'"
              class="inline-flex items-center justify-center w-8 h-8 bg-slate-100 text-slate-300 border border-slate-200 rounded-md cursor-not-allowed">
              <Icon name="i-heroicons-arrow-path-rounded-square" class="w-4 h-4" />
            </div>
          </template>

          <!-- Bouton Clôturer -->
          <!-- <button
            v-if="!isActionBlocked(item)"
            @click="handleCloturer(item)"
            :disabled="cloturingId === item.id"
            title="Clôturer cette affectation"
            class="inline-flex items-center justify-center w-8 h-8 bg-rose-50 text-rose-700 border border-rose-100 rounded-md hover:bg-rose-200 hover:text-rose-900 transition-all group disabled:opacity-40 disabled:cursor-not-allowed">
            <div v-if="cloturingId === item.id" class="w-3.5 h-3.5 border-2 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
            <Icon v-else name="i-heroicons-lock-closed" class="w-4 h-4 group-hover:text-rose-600" />
          </button>
          <div
            v-else
            :title="item.is_cloture ? 'Déjà clôturée' : 'Ce courrier a déjà une réponse'"
            class="inline-flex items-center justify-center w-8 h-8 bg-slate-100 text-slate-300 border border-slate-200 rounded-md cursor-not-allowed">
            <Icon name="i-heroicons-lock-closed" class="w-4 h-4" />
          </div> -->

        </div>
      </template>

    </DataTablePaginate>
  </template>
  <UModal v-model="circuitModalOpen" :ui="{ width: 'sm:max-w-3xl' }">
    <div v-if="selectedCircuitAffectation" class="bg-white rounded-xl overflow-hidden">
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
        <div>
          <h2 class="text-base font-bold text-slate-900">Circuit d'affectation</h2>
          <p class="text-xs text-slate-500">Affectation du courrier reçu</p>
        </div>
        <button @click="closeAffectationCircuitDetails"
          class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">
          <Icon name="i-heroicons-x-mark" class="w-4 h-4" />
        </button>
      </div>

      <div class="p-4 space-y-4">
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div class="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div class="text-[10px] uppercase tracking-[0.24em] text-slate-500 mb-1">Référence</div>
            <div class="text-sm font-semibold text-slate-800">{{ selectedCircuitAffectation._raw?.courrier_arrive?.document?.reference || '—' }}</div>
          </div>
          <div class="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div class="text-[10px] uppercase tracking-[0.24em] text-slate-500 mb-1">N° enreg.</div>
            <div class="text-sm font-semibold text-slate-800">{{ selectedCircuitAffectation._raw?.courrier_arrive?.document?.numero_enreg || '—' }}</div>
          </div>
        </div>

        <div class="space-y-3">
          <template v-if="selectedCircuitAffectation.affectation_circuit?.length">
            <div v-for="(node, idx) in selectedCircuitAffectation.affectation_circuit" :key="idx"
              class="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <div class="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-1">Émetteur</div>
                  <div class="font-medium text-slate-900">{{ node.emetteur }}</div>
                </div>
                <span v-if="node.raw?.id"
                  class="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  #{{ node.raw.id }}
                </span>
              </div>
              <div class="grid gap-2 sm:grid-cols-2">
                <div class="text-[11px] text-slate-600"><strong>Destinataires :</strong> {{ node.destinataires.join(', ') || 'Aucun destinataire' }}</div>
                <div class="text-[11px] text-slate-600"><strong>Priorité :</strong> {{ node.priority || '—' }}</div>
              </div>
              <div class="text-[11px] text-slate-600"><strong>Instruction :</strong> {{ node.instructions || 'Aucune instruction' }}</div>
            </div>
          </template>
          <div v-else class="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
            Aucun circuit d'affectation trouvé.
          </div>
        </div>
      </div>
    </div>
  </UModal>


  <!-- ══════════════════════════════════════════════════════════════════ -->
  <!-- MODAL DÉTAILS                                                      -->
  <!-- ══════════════════════════════════════════════════════════════════ -->
  <UModal v-model="detailsOpen" :ui="{ width: 'sm:max-w-4xl' }">
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
                  'bg-red-400/30 text-red-100 border-red-300/50':       selectedAffectation.priority === 'URGENT',
                  'bg-orange-400/30 text-orange-100 border-orange-300/50': selectedAffectation.priority === 'IMPORTANT',
                  'bg-blue-400/30 text-blue-100 border-blue-300/50':    selectedAffectation.priority === 'STANDARD',
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

        <!-- ── Section courrier associé ── -->
        <section class="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
          <div class="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                <Icon name="i-heroicons-inbox-arrow-down" class="w-3.5 h-3.5 text-blue-600" />
              </div>
              <span class="text-[11px] font-bold text-blue-700 uppercase tracking-widest">Courrier associé</span>
              <span v-if="selectedAffectation.a_reponse"
                class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-green-50 text-green-700 border border-green-200">
                <Icon name="i-heroicons-check-circle" class="w-3 h-3" /> Répondu
              </span>
              <span v-else
                class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                <Icon name="i-heroicons-clock" class="w-3 h-3" /> En attente
              </span>
            </div>

            <!-- Bouton charger le document -->
            <div v-if="selectedAffectation._raw?.courrier_arrive?.document?.url &&
              selectedAffectation._raw.courrier_arrive.document.url !== 'Inconnu'">
              <button v-if="!docFileLoaded && !docFileLoading && !docFileError" @click="loadDocFile"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-all">
                <Icon name="i-heroicons-document-arrow-down" class="w-3.5 h-3.5" />
                Charger le document
              </button>
              <div v-else-if="docFileLoading"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400">
                <div class="w-3.5 h-3.5 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin"></div>
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
            <div v-if="docFileLoaded" class="mt-2 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
              <DocumentRpreview :file-preview-url="docBlobUrl" height="500px" />
            </div>
          </div>
        </section>

        <!-- ── Section courrier de réponse ── -->
        <section v-if="selectedAffectation.a_reponse"
          class="bg-white rounded-2xl border border-emerald-200/80 overflow-hidden shadow-sm">
          <div class="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Icon name="i-heroicons-arrow-uturn-right" class="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <span class="text-[11px] font-bold text-emerald-700 uppercase tracking-widest">Courrier de réponse</span>
              <span v-if="reponseData && !loadingReponse"
                class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 ml-1">
                <Icon name="i-heroicons-check-circle" class="w-3 h-3" /> Chargé
              </span>
            </div>
            <div v-if="reponseData?.rawUrl">
              <button
                v-if="!reponseFileLoaded && !reponseFileLoading && !reponseFileError"
                @click="loadReponseFile"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-all">
                <Icon name="i-heroicons-document-arrow-down" class="w-3.5 h-3.5" />
                Charger le document
              </button>
              <div v-else-if="reponseFileLoading"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400">
                <div class="w-3.5 h-3.5 border-2 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
                Chargement...
              </div>
              <div v-else-if="reponseFileError"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 border border-red-200 rounded-lg">
                <Icon name="i-heroicons-exclamation-triangle" class="w-3.5 h-3.5 shrink-0" />
                {{ reponseFileError }}
                <button @click="reponseFileError = ''; loadReponseFile()" class="ml-1 underline hover:no-underline">Réessayer</button>
              </div>
              <div v-else-if="reponseFileLoaded"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg">
                <Icon name="i-heroicons-check-circle" class="w-3.5 h-3.5" />
                Document chargé
              </div>
            </div>
            <div v-else-if="reponseData && !reponseData.rawUrl"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 bg-slate-50 border border-slate-200 rounded-lg cursor-not-allowed">
              <Icon name="i-heroicons-document-text" class="w-3.5 h-3.5" />
              Aucun document disponible
            </div>
          </div>

          <div v-if="loadingReponse" class="flex items-center justify-center gap-3 py-8 text-slate-400">
            <div class="w-5 h-5 border-2 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
            <span class="text-xs font-medium">Chargement du courrier de réponse...</span>
          </div>

          <div v-else-if="reponseData" class="p-4 space-y-3">
            <div class="flex items-stretch gap-0 rounded-xl overflow-hidden border border-emerald-100">
              <div class="w-1 shrink-0 bg-gradient-to-b from-emerald-400 to-teal-500"></div>
              <div class="flex-1 p-3 bg-gradient-to-r from-emerald-50 to-transparent">
                <p class="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-0.5">Référence</p>
                <p class="text-sm font-bold text-emerald-900">{{ reponseData.reference || 'Sans référence' }}</p>
              </div>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
              <div class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Destinataire</p>
                <p class="text-xs font-semibold text-slate-800">{{ reponseData.destinataire || '—' }}</p>
              </div>
              <div class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date de départ</p>
                <p class="text-xs text-slate-800">{{ formatDate(reponseData.date_depart) || '—' }}</p>
              </div>
              <div v-if="reponseData.service_emis"
                class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Service émetteur</p>
                <p class="text-xs text-slate-800">{{ reponseData.service_emis }}</p>
              </div>
              <div v-if="reponseData.type_depart"
                class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Type de départ</p>
                <p class="text-xs text-slate-800">{{ reponseData.type_depart }}</p>
              </div>
            </div>
            <div v-if="reponseFileLoaded" class="mt-2 rounded-xl overflow-hidden border border-emerald-200 shadow-sm">
              <DocumentRpreview :file-preview-url="reponseBlobUrl" height="500px" />
            </div>
          </div>

          <div v-else class="flex items-center gap-2 m-4 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600">
            <Icon name="i-heroicons-exclamation-triangle" class="w-4 h-4 shrink-0" />
            Impossible de charger les détails du courrier de réponse.
          </div>
        </section>

        <!-- ── Section informations d'affectation ── -->
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
              <div v-if="selectedAffectation.date_cloture"
                class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-green-300 inline-block"></span>Date de clôture
                </p>
                <p class="text-xs text-slate-800">{{ selectedAffectation.date_cloture }}</p>
              </div>
              <div v-if="selectedAffectation.emetteur"
                class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-indigo-300 inline-block"></span>Émetteur
                </p>
                <p class="text-xs text-slate-800">{{ selectedAffectation.emetteur }}</p>
              </div>
              <div v-if="selectedAffectation.destinataire"
                class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
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
import Swal from 'sweetalert2'

const affectationsStore = useAffectationsStore()
const transfertsStore   = useTransfertsStore()
const { isSecDir, getDirecteurEntiteUserId } = useAuth()
const config = useRuntimeConfig()
const toast  = useToast()

useHead({ title: 'Documents reçus - Saga' })

// ── Colonnes ──────────────────────────────────────────────────────────────────
const columns = [
  { key: 'reference_courrier', label: 'Référence du Courrier', visible: true,  inputPlaceholder: 'Réf...', showLabel: false },
  { key: 'numero_enreg',       label: "Enr.",           visible: true,   showLabel: false },
  { key: 'objet_courrier',     label: 'Objet',                 visible: true,  showLabel: false },
  { key: 'doc_courrier',       label: 'Document',              visible: false, type: 'document', filterable: false },
  { key: 'structure',          label: 'Structure',             visible: true,  filterable: false, showLabel: false },
  { key: 'date_affect',        label: "Date d'affectation",    visible: true,  filterable: false },
  { key: 'instructions',       label: 'Annotations',           visible: true,  filterable: false },
  { key: 'statut',             label: 'Statut',                visible: true,  type: 'badge', filterable: false },
  { key: 'priority',           label: 'Priorité',              visible: true,  type: 'badge', filterable: false },
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
const perPage         = ref(20)
const isResponsable   = ref(false)
const periodLoading   = ref(false)

// ── Modal ─────────────────────────────────────────────────────────────────────
const detailsOpen                 = ref(false)
const selectedAffectation         = ref(null)
const loadingReponse              = ref(false)
const reponseData                 = ref(null)
const tooltipStyle                = ref({})
const hoveredAffectationItemId    = ref(null)
const circuitModalOpen            = ref(false)
const selectedCircuitAffectation  = ref(null)

const docFileLoaded  = ref(false)
const docFileLoading = ref(false)
const docFileError   = ref('')
const docBlobUrl     = ref('')

const reponseFileLoaded  = ref(false)
const reponseFileLoading = ref(false)
const reponseFileError   = ref('')
const reponseBlobUrl     = ref('')

const openingDocumentId = ref(null)
const cloturingId       = ref(null)

// ── Filtres avancés ───────────────────────────────────────────────────────────
const defaultFilters = () => ({
  search:             '',
  reference_courrier: '',
  numero_enreg:       '',
  objet_courrier:     '',
  emetteur:           '',
  date_affect:        '',
  delai_traitement:   '',
  date_cloture:       '',
  statut:             '',
  priority:           '',
  structure:          '',
  date_from:          '',
  date_to:            '',
  date_field:         'date_enreg',
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

let searchTimeout = null
watch(searchFilters, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    refresh(1, perPage.value, false)
  }, 400)
}, { deep: true })

const onPeriodChange = ({ field, from, to }) => {
  searchFilters.value.date_field = field
  searchFilters.value.date_from  = from
  searchFilters.value.date_to    = to
  currentPage.value = 1
  periodLoading.value = true
  refresh(1, perPage.value, false)
}

// ── Helper : actions bloquées si clôturé OU courrier déjà répondu ─────────────
const isActionBlocked = (item) => {
  return item.is_cloture || item.a_reponse
}

const getAffectationEntityText = (entity) => {
  if (!entity) return 'Inconnu'
  if (typeof entity === 'string') return entity

  const fullName = [entity.user?.nom, entity.user?.prenom].filter(Boolean).join(' ')
  const code = entity.entite?.code || entity.entite?.libelle || ''
  const role = entity.is_responsable ? entity.entite?.fonction || 'Responsable' : entity.fonction || 'Agent'

  return [fullName, code, role].filter(Boolean).join(' • ') || 'Inconnu'
}

const getEntityId = (entity) => {
  if (!entity) return null
  if (typeof entity === 'number') return entity
  if (typeof entity === 'string') {
    const parsed = parseInt(entity, 10)
    return Number.isNaN(parsed) ? null : parsed
  }
  return entity.id ?? entity.entite_user_id ?? entity.user?.id ?? entity.entite_user?.id ?? null
}

const getAffectationActorId = (affectation) => {
  if (!affectation) return null
  return getEntityId(affectation.emetteur || affectation.expediteur || affectation.user || affectation.created_by)
}

const getCurrentUserEffectiveId = () => {
  if (!process.client) return null
  const raw = localStorage.getItem('entite_user')
  if (!raw) return null
  const entiteUser = JSON.parse(raw)
  if (!entiteUser?.id) return null

  return isSecDir() ? (getDirecteurEntiteUserId() ?? entiteUser.id) : entiteUser.id
}

const computeIsAffectedFromCircuit = (circuit, currentUserId) => {
  if (!Array.isArray(circuit) || !currentUserId) return false
  return circuit.some((entry) => {
    const actorId = getEntityId(entry.raw?.emetteur || entry.raw?.expediteur || entry.raw?.user || entry.raw?.created_by)
    return actorId === currentUserId
  })
}

const normalizeAffectationDestinataires = (destinataires) => {
  if (!destinataires) return []
  if (Array.isArray(destinataires)) return destinataires.map(getAffectationEntityText).filter(Boolean)
  return [getAffectationEntityText(destinataires)]
}

const flattenAffectationEntries = (entry) => {
  if (!entry) return []
  if (Array.isArray(entry.affectations) && entry.affectations.length) {
    return entry.affectations.flatMap(flattenAffectationEntries)
  }
  return [entry]
}

const parseAffectationCircuit = (response) => {
  const data = response?.data
  let entries = []

  if (Array.isArray(data)) {
    entries = data.flatMap(flattenAffectationEntries)
  } else if (data) {
    if (Array.isArray(data.affectations)) {
      entries = data.affectations.flatMap(flattenAffectationEntries)
    } else {
      entries = flattenAffectationEntries(data)
    }
  }

  const circuit = entries.map((entry) => ({
    emetteur: getAffectationEntityText(entry.emetteur || entry.expediteur || entry.user || entry.created_by),
    destinataires: normalizeAffectationDestinataires(entry.destinataires || entry.destinataire || entry.recepteurs || entry.users),
    instructions: entry.instructions || entry.instruction || entry.message || '',
    priority: entry.priority || entry.priorite || '',
    statut: entry.statut || entry.status || '',
    date_affect: entry.date_affect || entry.date_affectation || '',
    raw: entry,
  }))

  return {
    circuit,
    isAffected: circuit.length > 0,
  }
}

const fetchAffectationCircuit = async (documentId) => {
  if (!documentId) return { circuit: [], isAffected: false }
  try {
    const authToken = localStorage.getItem('auth_token') || ''
    const base = config.public.apiBase.replace(/\/$/, '')
    const response = await $fetch(`${base}/documents/${documentId}/affectation-circuit`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
    return parseAffectationCircuit(response)
  } catch (err) {
    console.error(`❌ Erreur chargement affectation-circuit pour document ${documentId}:`, err)
    return { circuit: [], isAffected: false }
  }
}

const openAffectationPreview = async (event, item) => {
  const btn = event.currentTarget.querySelector('button')
  if (btn) {
    const rect = btn.getBoundingClientRect()
    const tooltipHeight = 300
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top

    if (spaceBelow >= tooltipHeight || spaceBelow >= spaceAbove) {
      tooltipStyle.value = {
        top: `${rect.bottom + 8}px`,
        right: `${window.innerWidth - rect.right}px`,
      }
    } else {
      tooltipStyle.value = {
        bottom: `${window.innerHeight - rect.top + 8}px`,
        right: `${window.innerWidth - rect.right}px`,
      }
    }
  }

  const documentId = item._raw?.courrier_arrive?.document?.id || null
  if (documentId && !item.affectation_circuit?.length) {
    const circuit = await fetchAffectationCircuit(documentId)
    item.affectation_circuit = circuit.circuit
    item.isAffected = computeIsAffectedFromCircuit(circuit.circuit, getCurrentUserEffectiveId())
  }

  hoveredAffectationItemId.value = item?.id || null
}

const closeAffectationPreview = () => {
  hoveredAffectationItemId.value = null
}

const openAffectationCircuitDetails = async (item) => {
  if (!item) return
  selectedCircuitAffectation.value = item
  const documentId = item._raw?.courrier_arrive?.document?.id || null
  if (documentId && !item.affectation_circuit?.length) {
    const circuit = await fetchAffectationCircuit(documentId)
    item.affectation_circuit = circuit.circuit
    item.isAffected = computeIsAffectedFromCircuit(circuit.circuit, getCurrentUserEffectiveId())
  }
  circuitModalOpen.value = true
}

const closeAffectationCircuitDetails = () => {
  circuitModalOpen.value = false
  selectedCircuitAffectation.value = null
}

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
  const authToken = localStorage.getItem('auth_token') || ''
  const response  = await fetch(url, { headers: { Authorization: `Bearer ${authToken}` } })
  if (!response.ok) throw new Error(`Erreur ${response.status} — fichier non accessible`)
  const blob = await response.blob()
  return { blob, mimeType: blob.type || guessMimeType(rawUrl) }
}

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
    docFileError.value = err.message || 'Erreur lors du chargement'
  } finally {
    docFileLoading.value = false
  }
}

const loadReponseFile = async () => {
  const rawUrl    = reponseData.value?.rawUrl
  const dateEnreg = reponseData.value?.rawDateEnreg
  if (!rawUrl) return
  reponseFileLoading.value = true
  reponseFileLoaded.value  = false
  reponseFileError.value   = ''
  if (reponseBlobUrl.value) { URL.revokeObjectURL(reponseBlobUrl.value); reponseBlobUrl.value = '' }
  try {
    const { blob } = await fetchFileAsBlob(rawUrl, dateEnreg)
    reponseBlobUrl.value    = URL.createObjectURL(blob)
    reponseFileLoaded.value = true
  } catch (err) {
    reponseFileError.value = err.message || 'Erreur lors du chargement'
  } finally {
    reponseFileLoading.value = false
  }
}

const revokeModalBlobs = () => {
  if (docBlobUrl.value)     { URL.revokeObjectURL(docBlobUrl.value);     docBlobUrl.value     = '' }
  if (reponseBlobUrl.value) { URL.revokeObjectURL(reponseBlobUrl.value); reponseBlobUrl.value = '' }
}

const loadReponseData = async (reponseId) => {
  if (!reponseId) return
  loadingReponse.value = true
  try {
    const authToken = localStorage.getItem('auth_token') || ''
    const base      = config.public.apiBase.replace(/\/$/, '')
    const result    = await $fetch(
      `${base}/courriers-departs?document_id=${reponseId}&per_page=1`,
      { headers: { Authorization: `Bearer ${authToken}` } }
    )
    const list = Array.isArray(result?.data) ? result.data : []
    const doc  = list[0] ?? null
    if (!doc) { reponseData.value = null; return }
    const rawUrl = (doc?.document?.url || '').trim()
    reponseData.value = {
      reference:    doc?.document?.reference || 'Sans référence',
      objet:        doc?.document?.objet     || 'Non spécifié',
      destinataire: doc?.destinataire        || '—',
      date_depart:  doc?.date_depart         || null,
      type_depart:  doc?.type_depart         || null,
      service_emis: doc?.service_emis        || null,
      rawUrl:       (rawUrl && rawUrl !== 'Inconnu') ? rawUrl : null,
      rawDateEnreg: doc?.document?.date_enreg || null,
      numero_enreg: doc?.document?.numero_enreg || '',
    }
  } catch (e) {
    reponseData.value = null
  } finally {
    loadingReponse.value = false
  }
}

// ── Transform ─────────────────────────────────────────────────────────────────
const transformerDonneesAPI = (reponseAPI) => {
  if (!reponseAPI?.data) throw new Error('Format de réponse API invalide')

  // ✅ Grouper par courrier_arrive_id
  const groupedByCourrier = new Map()

  reponseAPI.data.forEach(affectation => {
    const courrierId = affectation.courrier_arrive_id
    if (!courrierId) return

    if (!groupedByCourrier.has(courrierId)) {
      groupedByCourrier.set(courrierId, {
        affectations: [],
        courrier_arrive: affectation.courrier_arrive,
        id_affectation: affectation.id,
        emetteur_original: affectation.emetteur,
        destinataire_original: affectation.destinataire
      })
    }
    
    groupedByCourrier.get(courrierId).affectations.push(affectation)
  })

  // Transformer chaque groupe en une seule ligne
  const result = []
  
  for (const [courrierId, group] of groupedByCourrier) {
    const affectations = group.affectations
    
    // Trouver l'affectation qui concerne l'utilisateur connecté (destinataire)
    let currentUserAffectation = null
    let lastAffectationForCurrentUser = null
    
    // Récupérer l'ID de l'utilisateur connecté et traiter les cas de secrétariat de direction
    const currentUserId = getCurrentUserEffectiveId()
    
    // Parcourir toutes les affectations pour trouver celle de l'utilisateur courant
    for (const aff of affectations) {
      const destinataireId = getEntityId(aff.destinataire)
      if (destinataireId && destinataireId === currentUserId) {
        currentUserAffectation = aff
        // La dernière affectation pour cet utilisateur (la plus récente)
        if (!lastAffectationForCurrentUser || 
            new Date(aff.created_at || 0) > new Date(lastAffectationForCurrentUser.created_at || 0)) {
          lastAffectationForCurrentUser = aff
        }
      }
    }
    
    // Si aucune affectation directe trouvée, prendre la dernière affectation du circuit
    const finalAffectation = lastAffectationForCurrentUser || affectations[affectations.length - 1]
    
    // Formater l'émetteur
    let emetteurFormate = ''
    if (finalAffectation?.emetteur?.user?.nom && finalAffectation?.emetteur?.entite?.code) {
      const nomComplet = `${finalAffectation.emetteur.user.nom} ${finalAffectation.emetteur.user.prenom || ''}`.trim()
      const codeEntite = finalAffectation.emetteur.entite.code
      const isResp = finalAffectation.emetteur.is_responsable
      emetteurFormate = isResp ? `${nomComplet} (${codeEntite})` : `${nomComplet} - Agent / ${codeEntite}`
    }
    
    // Formater le destinataire
    let destinataireFormate = ''
    if (finalAffectation?.destinataire?.user?.nom && finalAffectation?.destinataire?.entite?.code) {
      const nomComplet = `${finalAffectation.destinataire.user.nom} ${finalAffectation.destinataire.user.prenom || ''}`.trim()
      const codeEntite = finalAffectation.destinataire.entite.code
      const isResp = finalAffectation.destinataire.is_responsable
      destinataireFormate = isResp ? `${nomComplet} (${codeEntite})` : `${nomComplet} - Agent / ${codeEntite}`
    }
    
    const rawUrl = group.courrier_arrive?.document?.url?.trim()
    
    // Déterminer le statut global (si une affectation est en cours, le statut global est "en cours")
    let globalStatut = 'en attente'
    let isCloture = true
    let hasReponse = false
    
    for (const aff of affectations) {
      if (aff.statut === 'en cours') {
        globalStatut = 'en cours'
        isCloture = false
      }
      if (aff.statut !== 'cloture') {
        isCloture = false
      }
      if (aff.courrier_arrive?.document?.reponse) {
        hasReponse = true
      }
    }
    
    // Utiliser le statut de l'affectation courante si trouvée
    if (finalAffectation?.statut) {
      globalStatut = finalAffectation.statut
      isCloture = finalAffectation.statut === 'cloture'
    }
    
    result.push({
      id: courrierId, // Utiliser l'ID du courrier comme identifiant unique
      courrier_id: courrierId,
      reference_courrier: group.courrier_arrive?.document?.reference || '',
      numero_enreg: group.courrier_arrive?.document?.numero_enreg || '',
      objet_courrier: group.courrier_arrive?.document?.objet || '',
      doc_courrier: (rawUrl && rawUrl !== 'Inconnu') ? rawUrl : '',
      date_affect: finalAffectation?.date_affect ? formatDate(finalAffectation.date_affect) : '',
      instructions: finalAffectation?.instructions || '', // ✅ Instruction de la dernière affectation pour cet utilisateur
      structure: group.courrier_arrive?.structure || '',
      statut: globalStatut,
      priority: finalAffectation?.priority || 'STANDARD',
      delai_traitement: finalAffectation?.delai_traitement ? formatDate(finalAffectation.delai_traitement) : '',
      date_cloture: finalAffectation?.date_cloture ? formatDate(finalAffectation.date_cloture) : '',
      emetteur: emetteurFormate,
      destinataire: destinataireFormate,
      a_reponse: hasReponse,
      is_cloture: isCloture,
      isAffected: currentUserId ? affectations.some((aff) => getAffectationActorId(aff) === currentUserId) : false,
      affectation_circuit: [], // Sera rempli par loadAffectationCircuits
      all_affectations: affectations, // Garder toutes les affectations pour référence
      _raw: finalAffectation || affectations[0], // Utiliser l'affectation courante comme _raw
    })
  }
  
  return result
}

// Déplace la fonction loadAffectationCircuits AVANT refresh
const loadAffectationCircuits = async (documents) => {
  if (!Array.isArray(documents) || documents.length === 0) return
  const currentUserId = getCurrentUserEffectiveId()
  await Promise.all(documents.map(async (doc) => {
    try {
      const documentId = doc._raw?.courrier_arrive?.document?.id || null
      if (!documentId) return
      const circuit = await fetchAffectationCircuit(documentId)
      doc.affectation_circuit = circuit.circuit
      doc.isAffected = computeIsAffectedFromCircuit(circuit.circuit, currentUserId)
    } catch (e) {
      console.error('Erreur chargement circuit:', e)
      // Ne pas propager l'erreur pour ne pas bloquer les autres
    }
  }))
}

// Ensuite, modifie le refresh pour gérer correctement les erreurs
const refresh = async (page = 1, per_page = perPage.value, isFirst = false) => {
  if (isFirst) { initialLoading.value = true } else { loading.value = true }
  error.value = null

  try {
    const authToken = localStorage.getItem('auth_token') || ''
    let entite_user = null
    const savedFunction = localStorage.getItem('entite_user')
    if (savedFunction) {
      entite_user = JSON.parse(savedFunction)
      isResponsable.value = entite_user.is_responsable || false
    }
    if (!entite_user?.id) { 
      error.value = 'Aucune fonction user sélectionnée'
      initialLoading.value = false
      loading.value = false
      return
    }

    const destinataireId = isSecDir()
      ? (getDirecteurEntiteUserId() ?? entite_user.id)
      : entite_user.id

    const params = new URLSearchParams({ page: String(page), per_page: String(per_page) })

    const f = searchFilters.value
    if (f.search)             params.append('search',             f.search)
    if (f.reference_courrier) params.append('reference_courrier', f.reference_courrier)
    if (f.numero_enreg)       params.append('numero_enreg',       f.numero_enreg)
    if (f.objet_courrier)     params.append('objet_courrier',     f.objet_courrier)
    if (f.emetteur)           params.append('emetteur',           f.emetteur)
    if (f.date_affect)        params.append('date_affect',        f.date_affect)
    if (f.delai_traitement)   params.append('delai_traitement',   f.delai_traitement)
    if (f.date_cloture)       params.append('date_cloture',       f.date_cloture)
    if (f.statut)             params.append('statut',             f.statut)
    if (f.priority)           params.append('priority',           f.priority)
    if (f.structure)          params.append('structure',          f.structure)
    if (f.date_from)          params.append('date_from',          f.date_from)
    if (f.date_to)            params.append('date_to',            f.date_to)
    if (f.date_from || f.date_to) params.append('date_field', f.date_field || 'date_enreg')

    const c = columnFilters.value
    if (!f.reference_courrier && c.reference_courrier) params.append('reference_courrier', c.reference_courrier)
    if (!f.numero_enreg       && c.numero_enreg)       params.append('numero_enreg', c.numero_enreg)
    if (!f.objet_courrier     && c.objet_courrier)     params.append('objet_courrier',     c.objet_courrier)
    if (!f.emetteur           && c.emetteur)           params.append('emetteur',           c.emetteur)

    const base = config.public.apiBase.replace(/\/$/, '')
    const reponse = await $fetch(
      `${base}/affectations/destinataire/${destinataireId}?${params.toString()}`,
      { method: 'GET', headers: { Authorization: `Bearer ${authToken}` } }
    )

    // ✅ Préparer les données sans les afficher encore
    const newData = transformerDonneesAPI(reponse)
    currentPage.value = reponse.meta?.current_page ?? page
    totalPages.value = reponse.meta?.last_page ?? 1
    total.value = reponse.meta?.total ?? newData.length

    // ✅ Charger TOUS les circuits d'affectation avant d'afficher
    // Utiliser try-catch pour ne pas bloquer l'affichage si les circuits échouent
    try { 
      await loadAffectationCircuits(newData) 
    } catch (circuitErr) { 
      console.error('Erreur chargement circuits:', circuitErr)
      // Continue l'exécution - les données s'affichent quand même
    }

    // ✅ Affectation unique — le tableau apparaît
    affectationData.value = newData

  } catch (err) {
    console.error('Erreur refresh:', err)
    error.value = err.message || 'Erreur lors du chargement des données'
    toast.add({ title: 'Erreur', description: 'Impossible de charger les affectations', color: 'red', timeout: 1500 })
  } finally {
    initialLoading.value = false
    loading.value = false
    periodLoading.value = false
  }
}

// ── Handlers pagination ───────────────────────────────────────────────────────
const onPageChange    = (page) => refresh(page, perPage.value, false)
const onPerPageChange = (val)  => { perPage.value = val; refresh(1, val, false) }
const onSearchChange  = (val)  => {
  searchFilters.value.search = val
  currentPage.value          = 1
  refresh(1, perPage.value, false)
}

// ── Styles statut / priorité ──────────────────────────────────────────────────
const getStatutClasses  = (s) => ({ 'en attente': 'bg-gray-100 text-gray-800', 'en cours': 'bg-blue-100 text-blue-800', 'traite': 'bg-green-100 text-green-800', 'cloture': 'bg-emerald-100 text-emerald-800', 'annule': 'bg-red-100 text-red-800' }[s] || 'bg-gray-100 text-gray-800')
const getStatutDotClass = (s) => ({ 'en attente': 'bg-gray-500', 'en cours': 'bg-blue-500', 'traite': 'bg-green-500', 'cloture': 'bg-emerald-500', 'annule': 'bg-red-500' }[s] || 'bg-gray-500')
const getPriorityClasses  = (p) => ({ URGENT: 'bg-red-100 text-red-800', IMPORTANT: 'bg-orange-100 text-orange-800', STANDARD: 'bg-blue-100 text-blue-800' }[p] || 'bg-gray-100 text-gray-800')
const getPriorityDotClass = (p) => ({ URGENT: 'bg-red-500', IMPORTANT: 'bg-orange-500', STANDARD: 'bg-blue-500' }[p] || 'bg-gray-500')

const rowClassByAffectation = (item) => item?.isAffected ? '!bg-orange-50 !hover:bg-orange-100' : ''

// ── Handlers actions ──────────────────────────────────────────────────────────
const handleViewDetails = async (item) => {
  revokeModalBlobs()
  selectedAffectation.value = item
  docFileLoaded.value       = false
  docFileLoading.value      = false
  docFileError.value        = ''
  reponseFileLoaded.value   = false
  reponseFileLoading.value  = false
  reponseFileError.value    = ''
  reponseData.value         = null
  detailsOpen.value         = true

  if (item.a_reponse) {
    const reponse = item._raw?.courrier_arrive?.document?.reponse
    const reponseId = reponse?.reponse_id
    if (reponseId) await loadReponseData(reponseId)
  }
}

const handleCloturer = async (item) => {
  const { isConfirmed } = await Swal.fire({
    title: 'Clôturer l\'affectation ?',
    html: `
      <div class="text-sm text-slate-600 space-y-2">
        <p>Vous êtes sur le point de clôturer l'affectation <strong class="text-slate-800">#${item.id}</strong>.</p>
        <div class="flex items-start gap-2 mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-left">
          <svg class="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          </svg>
          <p class="text-amber-700 text-xs">Toutes les affectations des subordonnés liées à ce courrier seront <strong>également clôturées</strong>.</p>
        </div>
      </div>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '<svg class="w-4 h-4 inline mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>Oui, clôturer',
    cancelButtonText: 'Annuler',
    focusCancel: true,
    reverseButtons: true,
    customClass: {
      popup:         'rounded-2xl shadow-2xl px-6 py-5 max-w-md',
      title:         'text-base font-bold text-slate-800 pt-2',
      htmlContainer: 'mt-2',
      confirmButton: 'inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-rose-400',
      cancelButton:  'inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-all mr-2 focus:outline-none focus:ring-2 focus:ring-slate-300',
      actions:       'mt-4 gap-2',
      icon:          'border-amber-300 text-amber-500',
    },
    buttonsStyling: false,
  })

  if (!isConfirmed) return

  cloturingId.value = item.id
  try {
    const authToken = localStorage.getItem('auth_token') || ''
    const base      = config.public.apiBase.replace(/\/$/, '')
    const result    = await $fetch(`${base}/affectations/${item.id}/cloture`, {
      method:  'PUT',
      headers: { Authorization: `Bearer ${authToken}` },
    })

    const nb = result.affectations_cloturees ?? 0

    await Swal.fire({
      title: 'Clôturée avec succès',
      html: nb > 0
        ? `<p class="text-sm text-slate-600">Affectation <strong>#${item.id}</strong> clôturée.<br><span class="inline-flex items-center gap-1 mt-2 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">${nb} affectation(s) subordonnée(s) clôturée(s)</span></p>`
        : `<p class="text-sm text-slate-600">Affectation <strong>#${item.id}</strong> clôturée avec succès.</p>`,
      icon: 'success',
      confirmButtonText: 'Fermer',
      timer: 3500,
      timerProgressBar: true,
      customClass: {
        popup:            'rounded-2xl shadow-2xl px-6 py-5 max-w-sm',
        title:            'text-base font-bold text-slate-800 pt-2',
        htmlContainer:    'mt-1',
        confirmButton:    'inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all focus:outline-none',
        timerProgressBar: 'bg-emerald-400',
      },
      buttonsStyling: false,
    })

    await refresh(currentPage.value, perPage.value, false)

  } catch (err) {
    await Swal.fire({
      title: 'Erreur',
      html: `<p class="text-sm text-slate-600">${err?.data?.message || 'Impossible de clôturer l\'affectation.'}</p>`,
      icon: 'error',
      confirmButtonText: 'Fermer',
      customClass: {
        popup:         'rounded-2xl shadow-2xl px-6 py-5 max-w-sm',
        title:         'text-base font-bold text-slate-800 pt-2',
        htmlContainer: 'mt-1',
        confirmButton: 'inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-all focus:outline-none',
      },
      buttonsStyling: false,
    })
  } finally {
    cloturingId.value = null
  }
}

const closeDetails = () => {
  revokeModalBlobs()
  detailsOpen.value         = false
  selectedAffectation.value = null
  reponseData.value         = null
  docFileLoaded.value       = false
  docFileError.value        = ''
  reponseFileLoaded.value   = false
  reponseFileError.value    = ''
}

const handleQuickAssign = (courrierId) => {
  if (!courrierId) { toast.add({ title: 'Erreur', description: 'ID du courrier introuvable', color: 'red', timeout: 1500 }); return }
  if (process.client) sessionStorage.setItem('preselected_courrier_id', courrierId.toString())
  navigateTo('/affectations/create')
}

const handleQuickTransfer = (courrierId) => {
  if (!courrierId) { toast.add({ title: 'Erreur', description: 'ID du courrier introuvable', color: 'red', timeout: 1500 }); return }
  if (process.client) sessionStorage.setItem('preselected_courrier_id_transfer', courrierId.toString())
  navigateTo('/affectations_transferts/form_transfert')
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(async () => {
  await Promise.all([
    refresh(1, perPage.value, true),
  ])
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