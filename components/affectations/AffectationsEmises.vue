<template>
  <!-- En-tête -->
  <div class="flex items-center justify-between mb-6">
    <h1 class="flex items-center gap-3 text-2xl font-bold text-slate-800">Affectations</h1>
    <div class="flex items-center gap-3">
      <button @click="refreshData"
        class="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all hover:shadow-md">
        <Icon name="i-heroicons-arrow-path" class="w-4 h-4" />
        Actualiser
      </button>
      <UBadge color="blue" v-if="!isAdmin" variant="soft" size="lg" class="ml-auto">
        <Icon name="i-heroicons-plus" class="h-4 w-4 mr-1" />
        <UButton to="/affectations/create" variant="text" size="sm" class="p-0 m-0 text-blue-600">Nouveau</UButton>
      </UBadge>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════════════════════ -->
  <!-- MODAL DÉTAILS                                                      -->
  <!-- ══════════════════════════════════════════════════════════════════ -->
  <UModal v-model="detailsOpen" :ui="{ width: 'sm:max-w-3xl' }">
    <div v-if="selectedAffectation" class="flex flex-col max-h-[90vh] bg-white rounded-xl overflow-hidden shadow-2xl">

      <!-- ── Header ──────────────────────────────────────────────────────── -->
      <div class="flex items-center justify-between px-6 py-4 shrink-0"
        style="background: linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 100%);">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center border border-white/20">
            <Icon name="i-heroicons-clipboard-document-list" class="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 class="text-sm font-bold text-white tracking-tight">Détails de l'affectation</h2>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-[11px] text-blue-200">#{{ selectedAffectation.id }}</span>
              <span v-if="selectedAffectation.statut"
                class="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-full uppercase bg-white/15 text-white border border-white/20 tracking-wide">
                {{ getStatutLabel(selectedAffectation.statut) }}
              </span>
              <span v-if="selectedAffectation.priority"
                class="inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wide"
                :class="{
                  'bg-red-400/25 text-red-200 border border-red-300/30':       selectedAffectation.priority === 'URGENT',
                  'bg-amber-400/25 text-amber-200 border border-amber-300/30': selectedAffectation.priority === 'IMPORTANT',
                  'bg-white/10 text-blue-100 border border-white/20':          selectedAffectation.priority === 'STANDARD',
                }">
                {{ selectedAffectation.priority }}
              </span>
            </div>
          </div>
        </div>
        <button @click="closeDetails"
          class="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white/70 hover:text-white border border-white/15">
          <Icon name="i-heroicons-x-mark" class="w-4 h-4" />
        </button>
      </div>

      <!-- ── Body ────────────────────────────────────────────────────────── -->
      <div class="overflow-y-auto flex-1 p-5 space-y-4" style="background-color: #f8fafc;">

        <!-- Courrier associé -->
        <section class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div class="flex items-center justify-between px-4 py-3 border-b border-slate-100"
            style="background: linear-gradient(to right, #eff6ff, #f8fafc);">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center">
                <Icon name="i-heroicons-inbox-arrow-down" class="w-3.5 h-3.5 text-blue-600" />
              </div>
              <span class="text-[11px] font-bold text-blue-800 uppercase tracking-widest">Courrier associé</span>
              <span
                v-if="selectedAffectation.a_reponse"
                class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-green-50 text-green-700 border border-green-200">
                <Icon name="i-heroicons-check-circle" class="w-3 h-3" /> Répondu
              </span>
              <span
                v-else
                class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                <Icon name="i-heroicons-clock" class="w-3 h-3" /> En attente
              </span>
            </div>

            <!-- Bouton document -->
            <div v-if="selectedAffectation._raw?.courrier_arrive?.document?.url &&
                       selectedAffectation._raw.courrier_arrive.document.url !== 'Inconnu'">
              <button
                v-if="!docFileLoaded && !docFileLoading && !docFileError"
                @click="loadDocFile"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors">
                <Icon name="i-heroicons-document-arrow-down" class="w-3.5 h-3.5" />
                Charger le document
              </button>
              <div v-else-if="docFileLoading"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500">
                <div class="w-3.5 h-3.5 border-2 border-blue-100 border-t-blue-500 rounded-full animate-spin"></div>
                Chargement...
              </div>
              <div v-else-if="docFileError"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg">
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
            <span v-else
              class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 bg-slate-50 border border-slate-200 rounded-lg cursor-not-allowed">
              <Icon name="i-heroicons-document-text" class="w-3.5 h-3.5" />
              Aucun document
            </span>
          </div>

          <div class="p-4 space-y-3">
            <div class="flex items-start gap-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
              <span class="text-[10px] font-bold text-blue-400 uppercase tracking-wider mt-0.5 w-20 shrink-0">Référence</span>
              <p class="text-sm font-bold text-slate-800">{{ selectedAffectation.reference_courrier || 'Sans référence' }}</p>
            </div>
            <div class="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5 w-20 shrink-0">Objet</span>
              <p class="text-sm text-slate-700 leading-relaxed">{{ selectedAffectation.objet_courrier || 'Non spécifié' }}</p>
            </div>
          </div>
        </section>

        <!-- Informations d'affectation -->
        <section class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div class="flex items-center gap-2 px-4 py-3 border-b border-slate-100"
            style="background: linear-gradient(to right, #eff6ff, #f8fafc);">
            <div class="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center">
              <Icon name="i-heroicons-clipboard-document-check" class="w-3.5 h-3.5 text-blue-600" />
            </div>
            <span class="text-[11px] font-bold text-blue-800 uppercase tracking-widest">Informations d'affectation</span>
          </div>
          <div class="p-4 space-y-4">

            <!-- Dates & dossier -->
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div class="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date d'affectation</p>
                <p class="text-sm font-medium text-slate-800">{{ selectedAffectation.date_affect || '—' }}</p>
              </div>
              <div class="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Retour attendu</p>
                <p class="text-sm font-medium text-slate-800">{{ selectedAffectation.delai_traitement || '—' }}</p>
              </div>
              <div v-if="selectedAffectation.date_cloture" class="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date de clôture</p>
                <p class="text-sm font-medium text-slate-800">{{ selectedAffectation.date_cloture }}</p>
              </div>
              <div v-if="selectedAffectation.dossier && selectedAffectation.dossier !== '—'"
                class="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Dossier</p>
                <p class="text-sm font-medium text-slate-800">{{ selectedAffectation.dossier }}</p>
              </div>
            </div>

            <!-- Destinataire -->
            <div class="flex items-start gap-3 p-3.5 rounded-lg border border-blue-100 bg-blue-50/40">
              <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                <Icon name="i-heroicons-user" class="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p class="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-1">Destinataire</p>
                <p class="text-sm font-bold text-slate-800">{{ selectedAffectation.destinataire?.nom || '—' }}</p>
                <p class="text-xs text-slate-500 mt-0.5">{{ selectedAffectation.destinataire?.fonction }}</p>
                <p v-if="selectedAffectation.destinataire?.entite" class="text-xs text-slate-400 mt-0.5">
                  {{ selectedAffectation.destinataire.entite }}
                </p>
              </div>
            </div>

            <!-- Émetteur (admin) -->
            <div v-if="isAdmin && selectedAffectation.emetteur?.nom"
              class="flex items-start gap-3 p-3.5 rounded-lg border border-slate-200 bg-slate-50">
              <div class="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                <Icon name="i-heroicons-user-circle" class="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Émetteur</p>
                <p class="text-sm font-bold text-slate-800">{{ selectedAffectation.emetteur.nom }}</p>
                <p class="text-xs text-slate-500 mt-0.5">{{ selectedAffectation.emetteur.fonction }}</p>
              </div>
            </div>

            <!-- Instructions -->
            <div class="p-3.5 rounded-lg border border-amber-200 bg-amber-50/50">
              <p class="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-2">Instructions</p>
              <p v-if="selectedAffectation.instructions"
                class="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {{ selectedAffectation.instructions }}
              </p>
              <p v-else class="text-sm text-slate-400 italic">Aucune instruction renseignée</p>
            </div>

          </div>
        </section>

        <!-- Prévisualisation du document -->
        <section v-if="docFileLoaded" class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div class="flex items-center gap-2 px-4 py-3 border-b border-slate-100"
            style="background: linear-gradient(to right, #eff6ff, #f8fafc);">
            <div class="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center">
              <Icon name="i-heroicons-document-text" class="w-3.5 h-3.5 text-blue-600" />
            </div>
            <span class="text-[11px] font-bold text-blue-800 uppercase tracking-widest">Prévisualisation du document</span>
          </div>
          <div class="p-4">
            <DocumentRpreview :file-preview-url="docBlobUrl" height="600px" />
          </div>
        </section>

      </div>

      <!-- ── Footer ──────────────────────────────────────────────────────── -->
      <div class="px-6 py-3.5 border-t border-slate-100 shrink-0 flex items-center justify-between bg-white">
        <span class="text-[10px] text-slate-400 font-medium">Affectation #{{ selectedAffectation.id }}</span>
        <UButton color="gray" variant="outline" size="sm" @click="closeDetails">Fermer</UButton>
      </div>
    </div>
  </UModal>

  <!-- Erreur -->
  <div v-if="error" class="flex items-center gap-3 p-4 mb-5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
    <Icon name="i-heroicons-exclamation-triangle" class="w-5 h-5 flex-shrink-0" />
    <span class="flex-1">{{ error }}</span>
    <button @click="error = null" class="text-lg opacity-60 hover:opacity-100 transition-opacity">✕</button>
  </div>

  <!-- Loader premier chargement -->
  <div v-if="initialLoading" class="flex flex-col items-center justify-center py-16 gap-4">
    <div class="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
    <p class="text-sm text-slate-500">Chargement des affectations...</p>
  </div>

  <!-- DataTablePaginate -->
  <DataTablePaginate
    v-else
    ref="dataTableRef"
    :loading="loading"
    :default-sort-column="null"
    :show-row-numbers="true"
    :data="tableData"
    :columns="columns"
    :selectable="false"
    :default-items-per-page="20"
    :items-per-page-options="[10, 20, 50, 100]"
    :left-aligned-columns="['instructions', 'objet_courrier', 'reference_courrier']"
    :external-pagination="true"
    :external-total="total"
    :external-page="currentPage"
    :external-last-page="totalPages"
    :external-per-page="perPage"
    @search-change="onSearchChange"
    @page-change="onPageChange"
    @per-page-change="onPerPageChange"
    @column-filter-change="onColumnFilterChange">

    <!-- ── Filtres avancés ──────────────────────────────────────────────── -->
    <template #advanced-filters>
      <div class="space-y-4">
        <div class="flex flex-wrap gap-3">
          <div class="flex-1 min-w-[150px]">
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Date d'affectation (jj/mm/aaaa)</label>
            <input v-model="searchFilters.date_affect" placeholder="ex: 15/03/2024"
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
          </div>
          <div class="flex-1 min-w-[160px]">
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Dossier</label>
            <input v-model="searchFilters.dossier" placeholder="Filtrer..."
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
          </div>
          <div class="flex-1 min-w-[160px]">
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Annotations</label>
            <input v-model="searchFilters.instructions" placeholder="Filtrer..."
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
          </div>
        </div>
        <div class="flex flex-wrap gap-3">
          <div class="flex-1 min-w-[140px]">
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Statut</label>
            <SearchableSelect
              v-model="searchFilters.statut"
              :options="filterOptionsData.statuts.map(s => ({ value: s, label: getStatutLabel(s) }))"
              placeholder="Tous" />
          </div>
          <div class="flex-1 min-w-[140px]">
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Priorité</label>
            <SearchableSelect
              v-model="searchFilters.priority"
              :options="filterOptionsData.priorities.map(p => ({ value: p, label: p }))"
              placeholder="Toutes" />
          </div>
          <div v-if="isAdmin" class="flex-1 min-w-[180px]">
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Émetteur</label>
            <SearchableSelect
              v-model="searchFilters.emetteur_id"
              :options="filterOptionsData.emetteurs.map(e => ({ value: e.id, label: e.label }))"
              placeholder="Tous" />
          </div>
          <div class="flex-1 min-w-[180px]">
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Destinataire</label>
            <SearchableSelect
              v-model="searchFilters.destinataire_id"
              :options="filterOptionsData.destinataires.map(d => ({ value: d.id, label: d.label }))"
              placeholder="Tous" />
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

    <!-- ── Cellules ─────────────────────────────────────────────────────── -->
    <template #cell-statut="{ value }">
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide"
        :class="getStatutClasses(value)">
        <span class="w-2 h-2 rounded-full mr-1.5" :class="getStatutDotClass(value)"></span>
        {{ getStatutLabel(value) }}
      </span>
    </template>

    <template #cell-priority="{ value }">
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide"
        :class="getPriorityClasses(value)">
        <span class="w-2 h-2 rounded-full mr-1.5" :class="getPriorityDotClass(value)"></span>
        {{ getPriorityLabel(value) }}
      </span>
    </template>

    <template #cell-emetteur="{ value }">
      <div class="text-left">
        <div class="font-medium text-xs text-slate-800">{{ value.nom }}</div>
        <div class="text-xs text-slate-500">{{ value.fonction }}</div>
      </div>
    </template>

    <template #cell-destinataire="{ value }">
      <div class="text-left">
        <div class="font-medium text-xs text-slate-800">{{ value.nom }}</div>
        <div class="text-xs text-slate-500">{{ value.fonction }}</div>
      </div>
    </template>

    <template #cell-instructions="{ value }">
      <span class="block max-w-[300px] line-clamp-2 text-xs text-slate-700" :title="value">
        {{ value || 'Aucune instruction' }}
      </span>
    </template>

    <template #cell-objet_courrier="{ value }">
      <span class="block text-xs text-slate-800 leading-relaxed whitespace-normal break-words min-w-[200px]" :title="value">
        {{ value }}
      </span>
    </template>

    <template #cell-reference_courrier="{ value, item }">
      <button
        v-if="item._raw?.courrier_arrive?.document?.url && item._raw.courrier_arrive.document.url !== 'Inconnu'"
        @click="handleView(item)"
        class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-all group max-w-[180px]"
        :disabled="openingDocumentId === item.id">
        <span class="break-words whitespace-normal min-w-0">{{ value }}</span>
        <Icon name="i-heroicons-eye" class="w-3 h-3 shrink-0 opacity-60 group-hover:opacity-100" />
      </button>
      <span v-else
        class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md max-w-[180px]">
        <Icon name="i-heroicons-document-text" class="w-3.5 h-3.5 shrink-0 opacity-50" />
        <span class="break-words whitespace-normal min-w-0">{{ value }}</span>
      </span>
    </template>

    <!-- ── Actions ──────────────────────────────────────────────────────── -->
    <template #actions="{ item }">
      <div class="flex gap-1.5 justify-end">

        <!-- Voir les détails — toujours actif -->
        <button
          @click="handleView(item)"
          title="Voir les détails"
          class="inline-flex items-center justify-center w-8 h-8 bg-amber-50 text-amber-700 border border-amber-100 rounded-md hover:bg-amber-200 transition-all group">
          <Icon name="i-heroicons-eye" class="w-4 h-4 group-hover:text-yellow-600" />
        </button>

        <!-- Bouton Affecter -->
        <template v-if="!isAdmin">
          <button
            v-if="!isActionBlocked(item)"
            @click="handleQuickAssign(item.courrier_id)"
            title="Affecter ce courrier"
            class="inline-flex items-center justify-center w-8 h-8 bg-sky-50 text-sky-700 border border-sky-100 rounded-md hover:bg-sky-200 transition-all group">
            <Icon name="i-heroicons-paper-airplane" class="w-4 h-4 group-hover:text-blue-600" />
          </button>
          <div
            v-else
            :title="item.is_cloture ? 'Affectation clôturée' : 'Ce courrier a déjà une réponse'"
            class="inline-flex items-center justify-center w-8 h-8 bg-slate-100 text-slate-300 border border-slate-200 rounded-md cursor-not-allowed">
            <Icon name="i-heroicons-paper-airplane" class="w-4 h-4" />
          </div>
        </template>

        <!-- Bouton Modifier destinataire -->
        <template v-if="!isAdmin">
          <button
            v-if="!isActionBlocked(item)"
            @click="handleEdit(item)"
            title="Modifier le destinataire"
            class="inline-flex items-center justify-center w-8 h-8 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md hover:bg-emerald-200 transition-all group">
            <Icon name="i-heroicons-pencil" class="w-4 h-4 group-hover:text-green-600" />
          </button>
          <div
            v-else
            :title="item.is_cloture ? 'Affectation clôturée' : 'Ce courrier a déjà une réponse'"
            class="inline-flex items-center justify-center w-8 h-8 bg-slate-100 text-slate-300 border border-slate-200 rounded-md cursor-not-allowed">
            <Icon name="i-heroicons-pencil" class="w-4 h-4" />
          </div>
        </template>

        <!-- Bouton Clôturer -->
        <!-- <template v-if="!isAdmin">
          <button
            v-if="!isActionBlocked(item)"
            @click="handleCloture(item)"
            title="Clôturer l'affectation"
            class="inline-flex items-center justify-center w-8 h-8 bg-rose-50 text-rose-700 border border-rose-100 rounded-md hover:bg-rose-200 transition-all group">
            <Icon name="i-heroicons-lock-closed" class="w-4 h-4 group-hover:text-rose-600" />
          </button>
          <div
            v-else
            :title="item.is_cloture ? 'Déjà clôturée' : 'Ce courrier a déjà une réponse'"
            class="inline-flex items-center justify-center w-8 h-8 bg-slate-100 text-slate-300 border border-slate-200 rounded-md cursor-not-allowed">
            <Icon name="i-heroicons-lock-closed" class="w-4 h-4" />
          </div>
        </template> -->

      </div>
    </template>

  </DataTablePaginate>

  <!-- ══════════════════════════════════════════════════════════════════ -->
  <!-- MODAL MODIFICATION DESTINATAIRE                                    -->
  <!-- ══════════════════════════════════════════════════════════════════ -->
  <UModal v-model="showEditModal" :ui="{ width: 'sm:max-w-2xl' }">
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Icon name="i-heroicons-users" class="h-6 w-6 text-blue-600" />
          Modifier le destinataire
        </h3>
        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" @click="showEditModal = false" square />
      </div>

      <div v-if="selectedAffectation" class="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
        <p class="text-sm text-gray-700 mb-2">
          <strong>Courrier :</strong> {{ selectedAffectation.reference_courrier }}
        </p>
        <p class="text-xs text-gray-600">{{ selectedAffectation.objet_courrier }}</p>
        <div class="mt-3 pt-3 border-t border-blue-200">
          <p class="text-sm text-gray-700">
            <strong>Destinataire actuel :</strong>
            <span class="text-blue-700 font-semibold">{{ selectedAffectation.destinataire.nom }}</span>
            <span class="text-xs text-gray-500 ml-2">({{ selectedAffectation.destinataire.fonction }})</span>
          </p>
        </div>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Rechercher un destinataire</label>
        <input v-model="searchDestinataire" type="text" placeholder="Rechercher par nom, prénom ou fonction..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
      </div>

      <div v-if="loadingDestinataires" class="flex justify-center py-8">
        <div class="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>

      <div v-else class="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
        <div v-for="dest in filteredDestinataires" :key="dest.id" @click="selectNewDestinataire(dest)" :class="[
          'p-4 cursor-pointer transition-all border-b border-gray-200 last:border-b-0',
          selectedNewDestinataire?.id === dest.id ? 'bg-blue-100 border-l-4 border-l-blue-600' : 'hover:bg-gray-50',
        ]">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <p class="font-semibold text-gray-900">{{ dest.user?.nom }} {{ dest.user?.prenom }}</p>
              <p class="text-sm text-gray-600 mt-1">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 mr-2">{{ dest.entite?.code }}</span>
                <span v-if="dest.is_responsable" class="text-gray-700">{{ dest.entite?.fonction }}</span>
                <span v-else class="text-gray-500">Agent</span>
              </p>
              <p class="text-xs text-gray-500 mt-1">{{ dest.entite?.libelle }}</p>
            </div>
            <Icon v-if="selectedNewDestinataire?.id === dest.id" name="i-heroicons-check-circle-solid" class="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <div v-if="filteredDestinataires.length === 0" class="p-8 text-center text-gray-500">
          <Icon name="i-heroicons-user-group" class="h-12 w-12 mx-auto mb-2 text-gray-400" />
          <p class="text-sm">Aucun destinataire trouvé</p>
        </div>
      </div>

      <div class="flex justify-end gap-3 mt-6">
        <UButton @click="showEditModal = false" color="gray" variant="outline" size="lg">Annuler</UButton>
        <UButton @click="confirmChangeDestinataire"
          :disabled="!selectedNewDestinataire || selectedNewDestinataire.id === selectedAffectation?._raw.destinataire_id"
          :loading="submitting" size="lg" icon="i-heroicons-check"
          class="bg-gradient-to-br from-emerald-800 to-blue-800 text-white dark:text-white">
          {{ submitting ? 'Modification en cours...' : 'Confirmer le changement' }}
        </UButton>
      </div>
    </div>
  </UModal>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useAuth } from '~/composables/auth/useAuth'
import DataTablePaginate from '~/components/DataTablePaginate.vue'
import SearchableSelect from '~/components/SearchableSelect.vue'
import DocumentRpreview from '~/components/DocumentRpreview.vue'
import { useAffectationsStore } from '~/stores/affectations'
import Swal from 'sweetalert2'

const store  = useAffectationsStore()
const { getEmetteurId, isAdmin: _isAdmin, getUser } = useAuth()

const isAdmin = computed(() => process.client ? _isAdmin() : false)

useHead({ title: 'Affectations - Sagar Revolution' })

// ── État table ────────────────────────────────────────────────────────────────
const tableData      = ref([])
const loading        = ref(false)
const initialLoading = ref(false)
const error          = ref(null)
const toast          = useToast()
const dataTableRef   = ref(null)
const config         = useRuntimeConfig()

// Pagination
const currentPage = ref(1)
const totalPages  = ref(1)
const total       = ref(0)
const perPage     = ref(20)

// ── Options filtres avancés ───────────────────────────────────────────────────
const filterOptionsData = ref({
  statuts:       [],
  priorities:    [],
  emetteurs:     [],
  destinataires: [],
})

// ── Filtres avancés ───────────────────────────────────────────────────────────
const defaultFilters = () => ({
  search:          '',
  statut:          '',
  priority:        '',
  emetteur_id:     '',
  destinataire_id: '',
  date_affect:     '',
  dossier:         '',
  instructions:    '',
})

const searchFilters = ref(defaultFilters())
const globalSearch  = ref('')

const hasActiveFilters = computed(() =>
  Object.values(searchFilters.value).some(v => v !== '') ||
  Object.values(columnFilters.value).some(v => v !== '')
)

const resetFilters = () => {
  searchFilters.value = defaultFilters()
  columnFilters.value = {}
  currentPage.value   = 1
  fetchAffectations(1, perPage.value, false)
}

// ── Filtres colonnes ──────────────────────────────────────────────────────────
const columnFilters = ref({})

let columnFilterTimeout = null
const onColumnFilterChange = (val) => {
  columnFilters.value = { ...val }
  clearTimeout(columnFilterTimeout)
  columnFilterTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchAffectations(1, perPage.value, false)
  }, 400)
}

// ── Colonnes ──────────────────────────────────────────────────────────────────
const columns = computed(() => {
  const base = [
    { key: 'reference_courrier', label: 'Réf. Courrier',           visible: true,  inputPlaceholder: 'Réf...',      width: 'min-w-[200px]', showLabel: false },
    { key: 'dossier',            label: 'Dossier',                 visible: true,  inputPlaceholder: 'Dossier...',  width: 'min-w-[200px]', showLabel: false },
    { key: 'objet_courrier',     label: 'Objet',                   visible: true,  inputPlaceholder: 'Objet...',    width: 'min-w-[250px]', showLabel: false },
    { key: 'doc_courrier',       label: 'Document',                visible: false, type: 'document',                filterable: false },
    { key: 'date_affect',        label: "Date d'affectation",      visible: true,  filterable: false,               width: 'min-w-[120px]', showLabel: false },
    { key: 'instructions',       label: 'Instructions',            visible: true,  inputPlaceholder: 'Annota...', width: 'min-w-[200px]', showLabel: false },
    { key: 'statut',             label: 'Statut',                  visible: true,  type: 'badge', filterable: false, width: 'min-w-[120px]' },
    { key: 'priority',           label: 'Priorité',                visible: true,  type: 'badge', filterable: false, width: 'min-w-[120px]' },
    { key: 'delai_traitement',   label: 'Délai',                   visible: true,  filterable: false,               width: 'min-w-[120px]', showLabel: true },
    { key: 'date_cloture',       label: 'Date clôture',            visible: false, filterable: false,               width: 'min-w-[120px]', showLabel: true },
    { key: 'destinataire',       label: 'Destinataire',            visible: true,  filterable: false,               width: 'min-w-[180px]', inputPlaceholder: 'Emetteur' },
  ]
  if (isAdmin.value) base.push({ key: 'emetteur', label: 'Émetteur', visible: true, inputPlaceholder: 'Emetteur', filterable: false, width: 'min-w-[180px]' })
  return base
})

// ── Modal ─────────────────────────────────────────────────────────────────────
const detailsOpen             = ref(false)
const selectedAffectation     = ref(null)
const showEditModal           = ref(false)
const selectedNewDestinataire = ref(null)
const searchDestinataire      = ref('')
const destinataires           = ref([])
const loadingDestinataires    = ref(false)
const submitting              = ref(false)

// État fichier document dans la modal
const docFileLoaded  = ref(false)
const docFileLoading = ref(false)
const docFileError   = ref('')
const docBlobUrl     = ref('')

// Ouverture depuis le tableau
const openingDocumentId = ref(null)

const filteredDestinataires = computed(() => {
  if (!searchDestinataire.value) return destinataires.value
  const q = searchDestinataire.value.toLowerCase()
  return destinataires.value.filter(dest =>
    dest.user?.nom?.toLowerCase().includes(q)     ||
    dest.user?.prenom?.toLowerCase().includes(q)  ||
    dest.entite?.code?.toLowerCase().includes(q)  ||
    dest.entite?.libelle?.toLowerCase().includes(q)
  )
})

// ── Helper : actions bloquées si clôturé OU courrier déjà répondu ─────────────
const isActionBlocked = (item) => {
  return item.is_cloture || item.a_reponse
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

const getStatutLabel    = (s) => ({ 'en cours': 'En cours', 'en attente': 'En attente', 'traite': 'Traité', 'cloture': 'Clôturé', 'annule': 'Annulé' }[s] || s)
const getStatutClasses  = (s) => ({ 'en_attente': 'bg-gray-100 text-gray-800', 'en cours': 'bg-blue-100 text-blue-800', 'traite': 'bg-green-100 text-green-800', 'cloture': 'bg-emerald-100 text-emerald-800', 'annule': 'bg-red-100 text-red-800' }[s] || 'bg-gray-100 text-gray-800')
const getStatutDotClass = (s) => ({ 'en attente': 'bg-gray-500', 'en cours': 'bg-blue-500', 'traite': 'bg-green-500', 'cloture': 'bg-emerald-500', 'annule': 'bg-red-500' }[s] || 'bg-gray-500')
const getPriorityLabel   = (p) => p || ''
const getPriorityClasses = (p) => ({ 'URGENT': 'bg-red-100 text-red-800', 'IMPORTANT': 'bg-orange-100 text-orange-800', 'STANDARD': 'bg-blue-100 text-blue-800' }[p] || 'bg-gray-100 text-gray-800')
const getPriorityDotClass= (p) => ({ 'URGENT': 'bg-red-500', 'IMPORTANT': 'bg-orange-500', 'STANDARD': 'bg-blue-500' }[p] || 'bg-gray-500')

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
    console.error('❌ Erreur chargement document affectation:', err)
    docFileError.value = err.message || 'Erreur lors du chargement'
  } finally {
    docFileLoading.value = false
  }
}

// ── Transform ─────────────────────────────────────────────────────────────────
const transformAffectation = (affectation) => {
  const emetteurNom      = affectation.emetteur?.user
    ? `${affectation.emetteur.user.nom} ${affectation.emetteur.user.prenom || ''}`.trim()
    : 'Non assigné'
  const emetteurCode     = affectation.emetteur?.entite?.code || ''
  const emetteurFonction = affectation.emetteur?.is_responsable ? affectation.emetteur.entite?.fonction || '' : 'Agent'

  const destinataireNom      = affectation.destinataire?.user
    ? `${affectation.destinataire.user.nom} ${affectation.destinataire.user.prenom || ''}`.trim()
    : 'Non assigné'
  const destinataireCode     = affectation.destinataire?.entite?.code || ''
  const destinataireFonction = affectation.destinataire?.is_responsable ? affectation.destinataire.entite?.fonction || '' : 'Agent'

  const rawUrl = affectation.courrier_arrive?.document?.url?.trim()

  return {
    id:                 affectation.id,
    courrier_id:        affectation.courrier_arrive_id || null,
    reference_courrier: affectation.courrier_arrive?.document?.reference || '',
    objet_courrier:     affectation.courrier_arrive?.document?.objet      || '',
    doc_courrier:       (rawUrl && rawUrl !== 'Inconnu') ? rawUrl : '',
    date_affect:        formatDate(affectation.date_affect),
    dossier:            affectation.dossier      || '—',
    instructions:       affectation.instructions || '',
    statut:             affectation.statut        || 'en_cours',
    priority:           affectation.priority      || 'STANDARD',
    delai_traitement:   formatDate(affectation.delai_traitement) || '__',
    date_cloture:       formatDate(affectation.date_cloture) || '_',
    // ✅ Bloquant : courrier déjà répondu
    a_reponse:  !!(affectation.courrier_arrive?.document?.reponses?.length),
    // ✅ Bloquant : affectation clôturée
    is_cloture: affectation.statut === 'cloture',
    destinataire: {
      nom:      destinataireNom,
      fonction: destinataireCode ? `${destinataireCode} - ${destinataireFonction}` : '',
      entite:   affectation.destinataire?.entite?.libelle || '_',
    },
    emetteur: {
      nom:      emetteurNom,
      fonction: emetteurCode ? `${emetteurCode} - ${emetteurFonction}` : '',
      entite:   affectation.emetteur?.entite?.libelle || '_',
    },
    _raw: affectation,
  }
}

// ── Chargement options filtres ────────────────────────────────────────────────
const loadFilterOptions = async () => {
  try {
    const authToken = localStorage.getItem('auth_token') || ''
    const base      = config.public.apiBase.replace(/\/$/, '')
    const response  = await $fetch(`${base}/affectations/filters`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
    if (response.success) filterOptionsData.value = response
  } catch (err) {
    console.error('❌ Erreur chargement filtres:', err)
  }
}

// ── Chargement affectations ───────────────────────────────────────────────────
const fetchAffectations = async (page = 1, per_page = perPage.value, isFirst = false) => {
  if (isFirst) {
    initialLoading.value = true
  } else {
    loading.value = true
  }
  error.value = null

  try {
    const authToken = localStorage.getItem('auth_token') || ''
    const base      = config.public.apiBase.replace(/\/$/, '')

    const params = new URLSearchParams({
      page:     String(page),
      per_page: String(per_page),
    })

    const f = searchFilters.value
    if (globalSearch.value)  params.append('search',          globalSearch.value)
    if (f.statut)            params.append('statut',          f.statut)
    if (f.priority)          params.append('priority',        f.priority)
    if (f.emetteur_id)       params.append('emetteur_id',     f.emetteur_id)
    if (f.destinataire_id)   params.append('destinataire_id', f.destinataire_id)
    if (f.dossier)           params.append('dossier',         f.dossier)
    if (f.instructions)      params.append('instructions',    f.instructions)
    if (f.date_affect && f.date_affect.length === 10) params.append('date_affect', f.date_affect)

    const c = columnFilters.value
    if (!f.dossier      && c.dossier)       params.append('dossier',           c.dossier)
    if (!f.instructions && c.instructions)  params.append('instructions',      c.instructions)
    if (c.reference_courrier)               params.append('reference_courrier', c.reference_courrier)
    if (c.objet_courrier)                   params.append('objet_courrier',     c.objet_courrier)

    let response

    if (isAdmin.value) {
      response = await $fetch(`${base}/affectations?${params.toString()}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
    } else {
      let entite_user = null
      if (process.client) {
        const saved = localStorage.getItem('entite_user')
        if (saved) entite_user = JSON.parse(saved)
      }
      if (!entite_user?.id) {
        error.value = 'Aucune fonction utilisateur sélectionnée.'
        return
      }
      const emetteurId = getEmetteurId() ?? entite_user.id
      response = await $fetch(`${base}/affectations/emetteur/${emetteurId}?${params.toString()}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
    }

    tableData.value   = (response.data || []).map(a => transformAffectation(a))
    currentPage.value = response.meta.current_page
    totalPages.value  = response.meta.last_page
    total.value       = response.meta.total

  } catch (err) {
    error.value = 'Impossible de charger les affectations'
    toast.add({ title: 'Erreur', description: 'Impossible de charger les affectations', color: 'red', timeout: 1500 })
  } finally {
    initialLoading.value = false
    loading.value        = false
  }
}

// ── Watch filtres avancés ─────────────────────────────────────────────────────
let searchTimeout = null
watch(searchFilters, (f) => {
  const dateOk = !f.date_affect || f.date_affect.length === 10
  if (!dateOk) return
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchAffectations(1, perPage.value, false)
  }, 400)
}, { deep: true })

// ── Handlers pagination ───────────────────────────────────────────────────────
const onPageChange    = (page) => fetchAffectations(page, perPage.value, false)
const onPerPageChange = (val)  => { perPage.value = val; fetchAffectations(1, val, false) }
const onSearchChange  = (val)  => {
  globalSearch.value = val
  currentPage.value  = 1
  fetchAffectations(1, perPage.value, false)
}

// ── Handlers CRUD ─────────────────────────────────────────────────────────────
const handleView = (item) => {
  selectedAffectation.value = item
  docFileLoaded.value  = false
  docFileLoading.value = false
  docFileError.value   = ''
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

const handleEdit = async (item) => {
  selectedAffectation.value     = item
  selectedNewDestinataire.value = null
  searchDestinataire.value      = ''
  if (destinataires.value.length === 0) await fetchDestinataires()
  showEditModal.value = true
}

const selectNewDestinataire = (dest) => { selectedNewDestinataire.value = dest }

const confirmChangeDestinataire = async () => {
  if (!selectedNewDestinataire.value || !selectedAffectation.value) return
  submitting.value = true
  try {
    const authToken = localStorage.getItem('auth_token')
    await $fetch(`${config.public.apiBase}/affectations/${selectedAffectation.value.id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
      body: { destinataire_id: selectedNewDestinataire.value.id },
    })
    showEditModal.value = false
    toast.add({ title: 'Succès', description: 'Le destinataire a été modifié avec succès', color: 'green', timeout: 1500 })
    await fetchAffectations(currentPage.value, perPage.value, false)
  } catch (err) {
    const errorResponse = err.data || err.response?._data || {}
    toast.add({ title: 'Erreur', description: errorResponse.message || 'Impossible de communiquer avec le serveur', color: 'red', timeout: 3000 })
  } finally {
    submitting.value = false
  }
}

// ── Clôturer une affectation ──────────────────────────────────────────────────
const handleCloture = async (item) => {
  const result = await Swal.fire({
    title: 'Clôturer cette affectation ?',
    html: `
      <div style="text-align:left;padding:8px">
        <p style="margin-bottom:12px;color:#374151">Cette action marquera l'affectation comme clôturée.</p>
        <div style="background:#f9fafb;border-radius:8px;padding:16px;border:1px solid #e5e7eb">
          <p style="font-weight:700;color:#1e40af;margin-bottom:8px">Affectation #${item.id}</p>
          <p style="font-size:14px;color:#374151">
            <strong>Courrier :</strong> ${item.reference_courrier}<br>
            <strong>Destinataire :</strong> ${item.destinataire.nom}
          </p>
        </div>
      </div>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#be123c',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Oui, clôturer',
    cancelButtonText: 'Annuler',
    reverseButtons: true,
  })

  if (!result.isConfirmed) return

  try {
    const authToken = localStorage.getItem('auth_token')
    await $fetch(`${config.public.apiBase}/affectations/${item.id}/cloture`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
    })
    toast.add({ title: 'Clôturée !', description: 'L\'affectation a été clôturée avec succès', color: 'green', timeout: 1500 })
    await fetchAffectations(currentPage.value, perPage.value, false)
  } catch (err) {
    const errorResponse = err.data || err.response?._data || {}
    toast.add({ title: 'Erreur', description: errorResponse.message || 'Impossible de clôturer l\'affectation', color: 'red', timeout: 3000 })
  }
}

const handleDelete = async (item) => {
  const result = await Swal.fire({
    title: 'Confirmer la suppression',
    html: `
      <div style="text-align:left;padding:8px">
        <p style="margin-bottom:12px;color:#374151">Êtes-vous sûr de vouloir supprimer cette affectation ?</p>
        <div style="background:#f9fafb;border-radius:8px;padding:16px;border:1px solid #e5e7eb">
          <p style="font-weight:700;color:#1e40af;margin-bottom:8px">Affectation #${item.id}</p>
          <p style="font-size:14px;color:#374151"><strong>Courrier:</strong> ${item.reference_courrier}<br><strong>Destinataire:</strong> ${item.destinataire.nom}</p>
        </div>
        <p style="margin-top:12px;font-size:14px;color:#dc2626;font-weight:600">Cette action est irréversible.</p>
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
    const authToken = localStorage.getItem('auth_token')
    await $fetch(`${config.public.apiBase}/affectations/${item.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken}` },
    })
    await Swal.fire({ title: 'Supprimé !', text: "L'affectation a été supprimée avec succès", icon: 'success', timer: 2000, showConfirmButton: false })
    await fetchAffectations(currentPage.value, perPage.value, false)
  } catch (err) {
    await Swal.fire({ title: 'Erreur', text: "Impossible de supprimer l'affectation", icon: 'error', confirmButtonColor: '#2563eb' })
  }
}

const handleQuickAssign = (courrierId) => {
  if (process.client) sessionStorage.setItem('preselected_courrier_id', courrierId.toString())
  navigateTo('/affectations/create')
}

const fetchDestinataires = async () => {
  loadingDestinataires.value = true
  try {
    const authToken = localStorage.getItem('auth_token')
    let entite_user = null
    if (process.client) {
      const saved = localStorage.getItem('entite_user')
      if (saved) entite_user = JSON.parse(saved)
    }
    if (!entite_user?.id) return
    const emetteurId = getEmetteurId() ?? entite_user.id
    const response   = await $fetch(`${config.public.apiBase}/entite-users/${emetteurId}/subordinates`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${authToken}` },
    })
    destinataires.value = response.data
      .filter(item => item.user?.statut && item.actif)
      .map(item => ({ id: item.id, user: item.user, entite: item.entite, actif: item.actif, is_interim: item.is_interim, is_responsable: item.is_responsable }))
  } catch (err) {
    toast.add({ title: 'Erreur', description: 'Impossible de charger la liste des destinataires', color: 'red', timeout: 1500 })
  } finally {
    loadingDestinataires.value = false
  }
}

const refreshData = () => fetchAffectations(currentPage.value, perPage.value, false)

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(async () => {
  await Promise.all([
    fetchAffectations(1, perPage.value, true),
    loadFilterOptions(),
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
:deep(.swal2-html-container) { margin: 1rem 0; }
:deep(.swal2-actions) { gap: 0.75rem; }
:deep(.swal2-confirm), :deep(.swal2-cancel) {
  padding: 0.625rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s;
}
:deep(.swal2-confirm):hover { transform: translateY(-1px); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
:deep(.swal2-cancel):hover  { background-color: #4b5563 !important; }
</style>