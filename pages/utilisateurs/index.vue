<template>
  <div class="min-h-screen bg-slate-100 p-6 font-sans">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Utilisateurs</h1>
        <p class="text-sm text-slate-500">Gestion des utilisateurs et administrateurs</p>
      </div>

      <!-- Actions Header -->
      <div class="flex items-center gap-3 ml-auto flex-wrap">
        <!-- Bouton Import -->
        <button
          @click="openImportModal"
          class="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg hover:from-indigo-700 hover:to-blue-700 shadow-sm transition-all"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
          Importer Excel/CSV
        </button>

        <!-- Bouton Nouveau -->
        <UBadge color="green" variant="soft" size="lg">
          <Icon name="i-heroicons-plus" class="h-4 w-4 mr-1" />
          <UButton to="/utilisateurs/create" variant="text" size="sm" class="p-0 m-0 text-green-600">
            Nouveau
          </UButton>
        </UBadge>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
      <div class="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <span class="text-sm font-medium">Chargement des utilisateurs...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error"
      class="flex items-center gap-4 p-5 bg-red-50 border border-red-200 rounded-xl max-w-2xl mx-auto sm:mx-0">
      <svg class="w-8 h-8 text-red-600 shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clip-rule="evenodd" />
      </svg>
      <div class="flex-1">
        <p class="text-sm font-bold text-red-900">Erreur de chargement</p>
        <p class="text-xs text-red-700">{{ error }}</p>
      </div>
      <button
        class="px-4 py-2 text-xs font-bold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors shrink-0"
        @click="refresh">
        Réessayer
      </button>
    </div>

    <!-- DataTable -->
    <DataTable
      v-else
      :data="utilisateurs"
      :columns="columns"
      :selectable="true"
      :left-aligned-columns="['matricule', 'nom', 'prenom', 'email', 'telephone']"
      @edit="onEdit"
      @delete="onDelete"
      @view="onView"
      @selection-change="onSelectionChange"
    >
      <!-- Advanced Filters -->
      <template #advanced-filters="{ filters, onFilter }">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="field in [
            { id: 'matricule', label: 'Matricule' },
            { id: 'nom', label: 'Nom' },
            { id: 'prenom', label: 'Prénom' },
            { id: 'email', label: 'Email' }
          ]" :key="field.id">
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              {{ field.label }}
            </label>
            <input v-model="filters[field.id]" placeholder="Filtrer..."
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              @input="onFilter" />
          </div>
        </div>
      </template>

      <!-- Bulk Actions -->
      <template #selection-actions="{ selected }">
        <button v-if="selected.length > 0"
          class="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-red-600 to-orange-600 rounded-lg hover:opacity-90 transition-opacity"
          @click="onBulkDelete(selected)">
          <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clip-rule="evenodd" />
          </svg>
          Supprimer ({{ selected.length }})
        </button>
      </template>

      <!-- Custom Cells -->
      <template #cell-matricule="{ value }">
        <span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
          {{ value || 'N/A' }}
        </span>
      </template>

      <template #cell-is_superadmin="{ value }">
        <span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border" :class="{
          'bg-emerald-50 text-emerald-700 border-emerald-100': value === true,
          'bg-slate-100 text-slate-600 border-slate-200': value === false
        }">
          {{ value ? 'Oui' : 'Non' }}
        </span>
      </template>

      <template #cell-statut="{ value }">
        <span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border" :class="{
          'bg-green-50 text-green-700 border-green-100': value === true,
          'bg-red-50 text-red-700 border-red-100': value === false
        }">
          {{ value ? 'Actif' : 'Inactif' }}
        </span>
      </template>

      <template #cell-prise_service="{ value }">
        <span class="text-xs text-slate-600 font-medium">
          {{ formatDate(value) }}
        </span>
      </template>

      <template #cell-fonctions="{ value }">
        <div class="flex flex-wrap gap-1 max-w-[200px]">
          <span v-if="!value || value.length === 0" class="text-xs text-slate-400 italic">
            Aucune fonction
          </span>
          <span
            v-for="(fonction, index) in value"
            :key="index"
            class="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md bg-blue-50 text-blue-700 border border-blue-200"
            :title="`${fonction.libelle}${fonction.entite ? ' - ' + fonction.entite : ''}`"
          >
            {{ fonction.libelle }}
          </span>
        </div>
      </template>

      <template #cell-fonctions_interim="{ value }">
        <div class="flex flex-wrap gap-1 max-w-[200px]">
          <span v-if="!value || value.length === 0" class="text-xs text-slate-400 italic">-</span>
          <span
            v-for="(fonction, index) in value"
            :key="index"
            class="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md bg-orange-50 text-orange-700 border border-orange-200"
            :title="`${fonction.libelle}${fonction.entite ? ' - ' + fonction.entite : ''}${fonction.date_fin ? ' (jusqu\'au ' + formatDate(fonction.date_fin) + ')' : ''}`"
          >
            <Icon name="i-heroicons-clock" class="w-3 h-3" />
            {{ fonction.libelle }}
          </span>
        </div>
      </template>

      <template #cell-points_critiques="{ value }">
        <div class="flex flex-wrap gap-1 max-w-[200px]">
          <span v-if="!value || value.length === 0" class="text-xs text-slate-400 italic">Aucun</span>
          <span
            v-for="(point, index) in value"
            :key="index"
            class="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md bg-amber-50 text-amber-700 border border-amber-200"
            :title="`${point.libelle || point.code}`"
          >
            {{ point.libelle || point.code }}
          </span>
        </div>
      </template>

      <template #cell-actions="{ item }">
        <div class="flex items-center gap-2">
          <button
            v-if="item.is_responsable"
            @click="openInterimModal(item)"
            class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100 transition-colors"
            title="Ajouter un intérim"
          >
            <Icon name="i-heroicons-plus-circle" class="w-4 h-4" />
          </button>
          <span v-else class="text-xs text-slate-400 italic">-</span>
        </div>
      </template>
    </DataTable>

    <!-- ═══════════════════════════════════════════════════════════════════════
         MODAL IMPORT EXCEL/CSV
         ═══════════════════════════════════════════════════════════════════════ -->
    <Teleport to="body">
      <div v-if="showImportModal"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
        @click.self="closeImportModal"
      >
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">

          <!-- En-tête -->
          <div class="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-t-2xl">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <div>
                <h3 class="text-base font-bold text-white">Import utilisateurs</h3>
                <p class="text-xs text-indigo-200">Excel (.xlsx, .xls) ou CSV</p>
              </div>
            </div>
            <button @click="closeImportModal" class="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Corps scrollable -->
          <div class="flex-1 overflow-y-auto">

            <!-- ── ÉTAPE 1 : Sélection du fichier ────────────────────────── -->
            <div v-if="importStep === 'select'" class="p-6 space-y-5">

              <!-- Download template -->
              <div class="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
                <div>
                  <p class="text-sm font-semibold text-indigo-900">Besoin d'un modèle ?</p>
                  <p class="text-xs text-indigo-700 mt-0.5">Téléchargez le template Excel avec les colonnes requises + la liste des codes postes disponibles</p>
                </div>
                <button
                  @click="downloadTemplate"
                  class="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-indigo-700 bg-white border border-indigo-300 rounded-lg hover:bg-indigo-50 transition-colors shrink-0"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Template
                </button>
              </div>

              <!-- Colonnes attendues -->
              <div class="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p class="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Colonnes attendues (dans l'ordre)</p>
                <div class="grid grid-cols-3 gap-1.5">
                  <div v-for="col in expectedColumns" :key="col.key"
                    class="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg">
                    <span class="w-4 h-4 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded flex items-center justify-center flex-shrink-0">
                      {{ col.letter }}
                    </span>
                    <div>
                      <p class="text-[11px] font-semibold text-slate-800">{{ col.key }}</p>
                      <p v-if="col.required" class="text-[10px] text-red-500">obligatoire</p>
                      <p v-else class="text-[10px] text-slate-400">optionnel</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Zone de drop -->
              <div
                class="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all"
                :class="importFile
                  ? 'border-green-400 bg-green-50'
                  : isDragging
                    ? 'border-indigo-500 bg-indigo-50 scale-[1.01]'
                    : 'border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50'"
                @click="importFileInput?.click()"
                @dragover.prevent="isDragging = true"
                @dragleave="isDragging = false"
                @drop.prevent="onImportFileDrop"
              >
                <input
                  ref="importFileInput"
                  type="file"
                  @change="handleImportFileChange"
                  accept=".xlsx,.xls,.csv"
                  class="hidden"
                />

                <!-- Fichier sélectionné -->
                <div v-if="importFile" class="flex items-center justify-center gap-4">
                  <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div class="text-left">
                    <p class="font-semibold text-slate-900">{{ importFile.name }}</p>
                    <p class="text-sm text-slate-500">{{ formatFileSize(importFile.size) }}</p>
                  </div>
                  <button type="button" @click.stop="clearImportFile"
                    class="ml-4 p-1.5 rounded-full text-red-400 hover:text-red-600 hover:bg-red-100 transition-colors">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <!-- Aucun fichier -->
                <div v-else class="flex flex-col items-center gap-3">
                  <div class="w-14 h-14 bg-slate-200 rounded-2xl flex items-center justify-center">
                    <svg class="w-7 h-7 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-slate-700">
                      <span class="text-indigo-600">Cliquez</span> ou glissez votre fichier ici
                    </p>
                    <p class="text-xs text-slate-400 mt-1">Excel (.xlsx, .xls) ou CSV — max 5 Mo</p>
                  </div>
                </div>
              </div>

              <!-- Note sur les matricules -->
              <div class="flex items-start gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
                <svg class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-xs text-amber-800">
                  <strong>Matricules dupliqués :</strong> Si un matricule est déjà existant ou vide,
                  un nouveau matricule à 6 chiffres sera généré automatiquement (ex: 000001, 000002…).
                  La colonne <strong>code_poste</strong> doit contenir le code de l'entité (ex: DIR-RH) —
                  le template inclut la liste complète des codes disponibles.
                </p>
              </div>
            </div>

            <!-- ── ÉTAPE 2 : Prévisualisation ────────────────────────────── -->
            <div v-else-if="importStep === 'preview'" class="p-6 space-y-4">

              <!-- Résumé compteurs -->
              <div class="grid grid-cols-4 gap-3">
                <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                  <p class="text-2xl font-bold text-slate-900">{{ previewData.length }}</p>
                  <p class="text-xs text-slate-500 mt-1">Lignes détectées</p>
                </div>
                <div class="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                  <p class="text-2xl font-bold text-green-700">{{ previewData.filter(r => !r.matricule_exists).length }}</p>
                  <p class="text-xs text-green-600 mt-1">Nouveaux</p>
                </div>
                <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                  <p class="text-2xl font-bold text-amber-700">{{ previewData.filter(r => r.matricule_exists).length }}</p>
                  <p class="text-xs text-amber-600 mt-1">Matricule → nouveau généré</p>
                </div>
                <div class="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                  <p class="text-2xl font-bold text-red-700">{{ previewData.filter(r => r.code_poste && !r.entite_found).length }}</p>
                  <p class="text-xs text-red-600 mt-1">Code poste introuvable</p>
                </div>
              </div>

              <!-- Table de prévisualisation -->
              <div class="border border-slate-200 rounded-xl overflow-hidden">
                <div class="bg-slate-800 px-4 py-2.5 flex items-center justify-between">
                  <p class="text-xs font-bold text-white uppercase tracking-wider">Aperçu des données</p>
                  <span class="text-xs text-slate-400">
                    {{ previewData.length > 50 ? 'Affichage limité à 50 lignes' : `${previewData.length} ligne(s)` }}
                  </span>
                </div>
                <div class="overflow-x-auto max-h-80">
                  <table class="w-full text-xs">
                    <thead class="bg-slate-100 sticky top-0">
                      <tr>
                        <th class="px-3 py-2 text-left font-semibold text-slate-600 whitespace-nowrap">#</th>
                        <th class="px-3 py-2 text-left font-semibold text-slate-600 whitespace-nowrap">Matricule</th>
                        <th class="px-3 py-2 text-left font-semibold text-slate-600 whitespace-nowrap">Nom</th>
                        <th class="px-3 py-2 text-left font-semibold text-slate-600 whitespace-nowrap">Prénom</th>
                        <th class="px-3 py-2 text-left font-semibold text-slate-600 whitespace-nowrap">Email</th>
                        <th class="px-3 py-2 text-left font-semibold text-slate-600 whitespace-nowrap">Téléphone</th>
                        <th class="px-3 py-2 text-left font-semibold text-slate-600 whitespace-nowrap">Statut</th>
                        <th class="px-3 py-2 text-left font-semibold text-slate-600 whitespace-nowrap">Code poste → Entité</th>
                        <th class="px-3 py-2 text-left font-semibold text-slate-600 whitespace-nowrap">État</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                      <tr v-for="row in previewData" :key="row.row"
                        :class="row.matricule_exists ? 'bg-amber-50' : 'bg-white hover:bg-slate-50'"
                      >
                        <td class="px-3 py-2 text-slate-400">{{ row.row }}</td>
                        <td class="px-3 py-2">
                          <span class="font-mono font-bold text-slate-700">{{ row.matricule || '—' }}</span>
                        </td>
                        <td class="px-3 py-2 font-medium text-slate-900">{{ row.nom }}</td>
                        <td class="px-3 py-2 text-slate-700">{{ row.prenom }}</td>
                        <td class="px-3 py-2 text-slate-600">{{ row.email }}</td>
                        <td class="px-3 py-2 text-slate-600">{{ row.telephone || '—' }}</td>
                        <td class="px-3 py-2">
                          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                            :class="row.statut ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                            {{ row.statut ? 'Actif' : 'Inactif' }}
                          </span>
                        </td>
                        <!-- Code poste → entité résolue -->
                        <td class="px-3 py-2">
                          <div v-if="row.code_poste" class="flex flex-col gap-0.5">
                            <div class="flex items-center gap-1.5">
                              <span class="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                                {{ row.code_poste }}
                              </span>
                              <svg v-if="row.entite_found" class="w-3 h-3 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                              </svg>
                              <svg v-else class="w-3 h-3 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </div>
                            <span v-if="row.entite_found" class="text-[10px] text-green-700 font-medium">
                              {{ row.entite_libelle }}
                            </span>
                            <span v-else class="text-[10px] text-red-600 italic">Code introuvable</span>
                          </div>
                          <span v-else class="text-slate-400 text-xs italic">—</span>
                        </td>
                        <td class="px-3 py-2">
                          <span v-if="row.matricule_exists"
                            class="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold">
                            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Nouveau matricule
                          </span>
                          <span v-else
                            class="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-bold">
                            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Nouveau
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- ── ÉTAPE 3 : Rapport d'import ─────────────────────────────── -->
            <div v-else-if="importStep === 'report'" class="p-6 space-y-4">

              <!-- Bilan -->
              <div class="grid grid-cols-3 gap-3">
                <div class="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                  <p class="text-3xl font-bold text-green-700">{{ importReport.imported }}</p>
                  <p class="text-xs text-green-600 mt-1 font-medium">Importé(s)</p>
                </div>
                <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                  <p class="text-3xl font-bold text-amber-700">{{ importReport.skipped }}</p>
                  <p class="text-xs text-amber-600 mt-1 font-medium">Ignoré(s)</p>
                </div>
                <div class="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                  <p class="text-3xl font-bold text-red-700">{{ importReport.errors_count }}</p>
                  <p class="text-xs text-red-600 mt-1 font-medium">Erreur(s)</p>
                </div>
              </div>

              <!-- Message global -->
              <div class="flex items-center gap-3 p-4 rounded-xl"
                :class="importReport.errors_count === 0 && importReport.skipped === 0
                  ? 'bg-green-50 border border-green-200'
                  : importReport.imported > 0
                    ? 'bg-amber-50 border border-amber-200'
                    : 'bg-red-50 border border-red-200'"
              >
                <svg class="w-6 h-6 flex-shrink-0"
                  :class="importReport.errors_count === 0 && importReport.skipped === 0
                    ? 'text-green-600'
                    : importReport.imported > 0 ? 'text-amber-600' : 'text-red-600'"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-sm font-semibold"
                  :class="importReport.errors_count === 0 && importReport.skipped === 0
                    ? 'text-green-800'
                    : importReport.imported > 0 ? 'text-amber-800' : 'text-red-800'"
                >
                  {{ importReport.message }}
                </p>
              </div>

              <!-- Liste des utilisateurs importés -->
              <div v-if="importReport.imported_users?.length > 0"
                class="border border-green-200 rounded-xl overflow-hidden">
                <div class="bg-green-600 px-4 py-2.5">
                  <p class="text-xs font-bold text-white uppercase tracking-wider">
                    ✓ Utilisateurs créés ({{ importReport.imported_users.length }})
                  </p>
                </div>
                <div class="max-h-48 overflow-y-auto divide-y divide-green-100">
                  <div v-for="u in importReport.imported_users" :key="u.id"
                    class="flex items-center gap-3 px-4 py-2.5 bg-white hover:bg-green-50 transition-colors">
                    <div class="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span class="text-[10px] font-bold text-green-700">
                        {{ (u.nom?.[0] || '') + (u.prenom?.[0] || '') }}
                      </span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-xs font-bold text-slate-900">{{ u.nom }} {{ u.prenom }}</p>
                      <p class="text-[11px] text-slate-500 truncate">{{ u.email }}</p>
                    </div>
                    <div class="flex flex-col items-end gap-0.5 flex-shrink-0">
                      <span class="font-mono text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                        {{ u.matricule }}
                      </span>
                      <span v-if="u.code_poste && u.code_poste !== '—'"
                        class="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                        {{ u.code_poste }} · {{ u.entite_libelle }}
                      </span>
                      <span v-else class="text-[10px] text-slate-400 italic">Sans entité</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Erreurs & avertissements -->
              <div v-if="importReport.errors?.length > 0"
                class="border border-red-200 rounded-xl overflow-hidden">
                <div class="bg-red-600 px-4 py-2.5">
                  <p class="text-xs font-bold text-white uppercase tracking-wider">
                    ✕ Lignes non importées ({{ importReport.errors.length }})
                  </p>
                </div>
                <div class="max-h-48 overflow-y-auto divide-y divide-red-100">
                  <div v-for="(err, idx) in importReport.errors" :key="idx"
                    class="flex items-start gap-3 px-4 py-2.5"
                    :class="err.type === 'warning' ? 'bg-amber-50' : 'bg-red-50'"
                  >
                    <span class="text-[11px] font-bold mt-0.5 flex-shrink-0"
                      :class="err.type === 'warning' ? 'text-amber-600' : 'text-red-600'">
                      Ligne {{ err.row }}
                    </span>
                    <p class="text-xs text-slate-700 flex-1">{{ err.message }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer modal -->
          <div class="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl">

            <!-- Indicateur d'étapes -->
            <div class="flex items-center gap-2">
              <div v-for="(step, idx) in importSteps" :key="step.key" class="flex items-center gap-1.5">
                <div class="flex items-center gap-1">
                  <div class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all"
                    :class="importStep === step.key
                      ? 'bg-indigo-600 text-white scale-110'
                      : importStepIndex > idx
                        ? 'bg-green-500 text-white'
                        : 'bg-slate-200 text-slate-500'"
                  >
                    <svg v-if="importStepIndex > idx" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                    <span v-else>{{ idx + 1 }}</span>
                  </div>
                  <span class="text-[11px] font-medium hidden sm:block"
                    :class="importStep === step.key ? 'text-indigo-700' : 'text-slate-400'">
                    {{ step.label }}
                  </span>
                </div>
                <div v-if="idx < importSteps.length - 1" class="w-6 h-0.5 bg-slate-200"></div>
              </div>
            </div>

            <!-- Boutons d'action -->
            <div class="flex items-center gap-2">
              <button @click="closeImportModal"
                class="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                Annuler
              </button>

              <!-- Étape 1: Prévisualiser -->
              <button
                v-if="importStep === 'select'"
                :disabled="!importFile || loadingPreview"
                @click="previewImport"
                class="inline-flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <div v-if="loadingPreview" class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Prévisualiser
              </button>

              <!-- Étape 2: Retour + Lancer l'import -->
              <template v-else-if="importStep === 'preview'">
                <button @click="importStep = 'select'"
                  class="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                  ← Retour
                </button>
                <button
                  :disabled="loadingImport || previewData.length === 0"
                  @click="launchImport"
                  class="inline-flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <div v-if="loadingImport" class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                  <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  Lancer l'import ({{ previewData.length }} lignes)
                </button>
              </template>

              <!-- Étape 3: Terminer -->
              <button v-else-if="importStep === 'report'"
                @click="finishImport"
                class="inline-flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Terminer
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ── Modal Ajout Fonction (Intérim) ─────────────────────────────────────────── -->
    <div v-if="showInterimModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-lg">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Ajouter un intérim</h3>
            <p v-if="selectedUser" class="text-sm text-slate-600 mt-1">
              Pour: {{ selectedUser.nom }} {{ selectedUser.prenom }} ({{ selectedUser.matricule }})
            </p>
          </div>
          <button @click="closeInterimModal" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="px-6 py-5 space-y-4">
          <div v-if="loadingFonctions" class="flex justify-center py-8">
            <div class="w-6 h-6 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>

          <template v-else>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Fonction <span class="text-red-600">*</span>
              </label>
              <USelectMenu
                v-model="interimForm.fonction_id"
                :options="fonctionsOptions"
                placeholder="Sélectionner une fonction"
                value-attribute="id"
                option-attribute="libelle"
                searchable
                searchable-placeholder="Rechercher..."
                class="w-full"
              >
                <template #option="{ option }">
                  <div class="flex flex-col py-0.5">
                    <span class="font-semibold text-sm">{{ option.libelle }}</span>
                    <span v-if="option.entite_libelle" class="text-xs text-gray-400">{{ option.entite_libelle }}</span>
                  </div>
                </template>
              </USelectMenu>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Date début <span class="text-red-600">*</span></label>
                <UInput v-model="interimForm.date_debut" type="date" class="w-full h-10" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Date fin</label>
                <UInput v-model="interimForm.date_fin" type="date" :min="interimForm.date_debut" class="w-full h-10" />
              </div>
            </div>

            <label class="flex items-center gap-2 cursor-not-allowed opacity-75">
              <input type="checkbox" :checked="true" disabled class="w-4 h-4 text-indigo-600 border-gray-300 rounded" />
              <span class="text-sm font-medium text-gray-700">Fonction en intérim</span>
            </label>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Pièce jointe <span class="text-red-600">*</span></label>
              <div
                class="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors"
                :class="interimFile ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50'"
                @click="interimFileInputRef?.click()"
                @dragover.prevent
                @drop.prevent="onFileDrop"
              >
                <input ref="interimFileInputRef" type="file" @change="handleInterimFileChange"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" class="hidden" />
                <div v-if="interimFile" class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2 min-w-0">
                    <svg class="w-8 h-8 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div class="text-left min-w-0">
                      <p class="text-sm font-medium text-gray-800 truncate">{{ interimFile.name }}</p>
                      <p class="text-xs text-gray-500">{{ formatFileSize(interimFile.size) }}</p>
                    </div>
                  </div>
                  <button type="button" @click.stop="removeInterimFile"
                    class="flex-shrink-0 p-1 rounded-full text-red-400 hover:text-red-600 hover:bg-red-100 transition-colors">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div v-else class="flex flex-col items-center gap-2 py-2">
                  <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <p class="text-sm text-gray-500">
                    <span class="font-medium text-indigo-600">Cliquez</span> ou glissez un fichier ici
                  </p>
                  <p class="text-xs text-gray-400">PDF, Word, Images — max 5 Mo</p>
                </div>
              </div>
            </div>

            <div v-if="interimError" class="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm text-red-800">{{ interimError }}</p>
            </div>
          </template>
        </div>

        <div class="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <UButton type="button" color="gray" variant="outline" @click="closeInterimModal">Annuler</UButton>
          <UButton
            type="button"
            @click="submitInterim"
            :loading="submittingInterim"
            :disabled="!interimForm.fonction_id || !interimForm.date_debut || !interimFile"
          >
            <svg v-if="!submittingInterim" class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Enregistrer l'intérim
          </UButton>
        </div>
      </div>
    </div>

    <!-- Modal de confirmation de suppression -->
    <UModal v-model="showDeleteModal">
      <div class="p-6">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-bold text-slate-900">Confirmer la suppression</h3>
            <p class="text-sm text-slate-600 mt-1">Cette action est irréversible</p>
          </div>
        </div>

        <div v-if="itemToDelete" class="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
          <div class="space-y-2 text-sm">
            <div class="flex items-center justify-between">
              <span class="text-slate-600 font-medium">Matricule:</span>
              <span class="font-semibold text-slate-900">{{ itemToDelete.matricule }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-600 font-medium">Nom:</span>
              <span class="font-semibold text-slate-900">{{ itemToDelete.nom }} {{ itemToDelete.prenom }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-600 font-medium">Email:</span>
              <span class="font-semibold text-slate-900">{{ itemToDelete.email }}</span>
            </div>
          </div>
        </div>

        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p class="text-xs text-yellow-800">
            <strong>⚠️ Attention :</strong> Vous êtes sur le point de supprimer cet utilisateur.
            Cette action supprimera définitivement toutes les données associées.
          </p>
        </div>

        <div class="flex justify-end gap-3">
          <UButton color="gray" variant="outline" @click="showDeleteModal = false" :disabled="deleting">Annuler</UButton>
          <UButton color="red" @click="confirmDelete" :loading="deleting">Supprimer définitivement</UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup>
import DataTable from '~/components/DataTable.vue'

const config = useRuntimeConfig()

// ============================================================================
// COLONNES
// ============================================================================
const columns = [
  { key: 'id',               label: 'N°',                  visible: true },
  { key: 'matricule',        label: 'Matricule',            visible: true },
  { key: 'nom',              label: 'Nom',                  visible: true },
  { key: 'prenom',           label: 'Prénom',               visible: true },
  { key: 'email',            label: 'Email',                visible: true },
  { key: 'telephone',        label: 'Téléphone',            visible: true },
  { key: 'points_critiques', label: 'Entité',               visible: true },
  { key: 'fonctions',        label: 'Fonctions',            visible: true },
  { key: 'fonctions_interim',label: 'Fonctions Intérimaires', visible: true },
  { key: 'prise_service',    label: 'Prise Service',        visible: true },
  { key: 'is_superadmin',    label: 'Admin',                visible: true },
  { key: 'statut',           label: 'Statut',               visible: true },
  { key: 'actions',          label: "Ajout d'intérim",      visible: true },
]

// ============================================================================
// ÉTATS — liste utilisateurs
// ============================================================================
const utilisateurs   = ref([])
const loading        = ref(false)
const error          = ref(null)
const showDeleteModal = ref(false)
const itemToDelete   = ref(null)
const deleting       = ref(false)

// ============================================================================
// ÉTATS — intérim
// ============================================================================
const showInterimModal   = ref(false)
const selectedUser       = ref(null)
const loadingFonctions   = ref(false)
const fonctions          = ref([])
const submittingInterim  = ref(false)
const interimError       = ref(null)
const interimFileInputRef = ref(null)
const interimFile        = ref(null)
const interimForm        = ref({ fonction_id: null, date_debut: '', date_fin: '' })

// ============================================================================
// ÉTATS — import
// ============================================================================
const showImportModal = ref(false)
const importStep      = ref('select')   // 'select' | 'preview' | 'report'
const importFile      = ref(null)
const importFileInput = ref(null)
const isDragging      = ref(false)
const loadingPreview  = ref(false)
const loadingImport   = ref(false)
const previewData     = ref([])
const importReport    = ref({})

const importSteps = [
  { key: 'select',  label: 'Fichier'  },
  { key: 'preview', label: 'Aperçu'   },
  { key: 'report',  label: 'Rapport'  },
]

const importStepIndex = computed(() =>
  importSteps.findIndex(s => s.key === importStep.value)
)

const expectedColumns = [
  { letter: 'A', key: 'matricule',       required: false },
  { letter: 'B', key: 'nom',             required: true  },
  { letter: 'C', key: 'prenom',          required: true  },
  { letter: 'D', key: 'email',           required: true  },
  { letter: 'E', key: 'telephone',       required: false },
  { letter: 'F', key: 'prise_service',   required: false },
  { letter: 'G', key: 'statut',          required: false },
  { letter: 'H', key: 'code_poste',      required: false },
  { letter: 'I', key: 'est_responsable', required: false },
]

// ============================================================================
// UTILITAIRES
// ============================================================================
const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('fr-FR')
}

const formatFileSize = (bytes) => {
  if (!bytes) return ''
  if (bytes < 1024)             return bytes + ' o'
  if (bytes < 1024 * 1024)     return (bytes / 1024).toFixed(1) + ' Ko'
  return (bytes / (1024 * 1024)).toFixed(1) + ' Mo'
}

const getToken = () => localStorage.getItem('auth_token') || ''

// ============================================================================
// COMPUTED — intérim
// ============================================================================
const fonctionsOptions = computed(() =>
  fonctions.value.map(f => ({
    id:            f.id,
    libelle:       f.libelle || f.code,
    code:          f.code,
    entite_libelle: f.entite?.libelle || f.entite_libelle || '',
  }))
)

// ============================================================================
// VALIDATION FICHIER INTÉRIM
// ============================================================================
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg', 'image/jpg', 'image/png',
]

const validateFile = (file) => {
  if (!file) return null
  if (file.size > 5 * 1024 * 1024) return 'Le fichier ne doit pas dépasser 5 Mo'
  if (!ALLOWED_MIME_TYPES.includes(file.type)) return 'Format non autorisé (PDF, Word, JPG, PNG uniquement)'
  return null
}

// ============================================================================
// CHARGEMENT UTILISATEURS
// ============================================================================
const loadUtilisateurs = async () => {
  loading.value = true
  error.value   = null

  try {
    const token = getToken()
    if (!token) throw new Error("Token d'authentification manquant")

    const response = await $fetch(`${config.public.apiBase}/users`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    })

    let dataArray = []
    if (response?.data?.data && Array.isArray(response.data.data))   dataArray = response.data.data
    else if (response?.data && Array.isArray(response.data))         dataArray = response.data
    else if (Array.isArray(response))                                 dataArray = response
    else throw new Error('Format de réponse API invalide')

    utilisateurs.value = dataArray.map((user) => {
      const entitePrincipale = user.entite_users?.find(eu =>
        eu.actif === true && eu.is_interim === false && eu.is_responsable === true
      )
      const isResponsable = !!entitePrincipale

      let fonctionsMap = []
      let entite       = []

      if (entitePrincipale) {
        fonctionsMap = [{ libelle: entitePrincipale.entite?.fonction || 'Responsable', entite: entitePrincipale.entite?.libelle || '' }]
        entite       = [{ libelle: entitePrincipale.entite?.libelle || '' }]
      } else {
        const agentEntite = user.entite_users?.find(eu =>
          eu.actif === true && eu.is_interim === false && eu.is_responsable === false
        )
        if (agentEntite) {
          fonctionsMap = [{ libelle: 'Agent', entite: agentEntite.entite?.libelle || '' }]
          entite       = [{ libelle: agentEntite.entite?.libelle || '' }]
        }
      }

      const fonctionsInterim = (user.entite_users || [])
        .filter(eu => eu.actif === true && eu.is_interim === true && eu.is_responsable === true)
        .map(eu => ({
          libelle:   eu.entite?.fonction || 'Intérim',
          entite:    eu.entite?.libelle || '',
          date_fin:  eu.date_fin,
          entite_id: eu.entite_id,
        }))

      const pointsCritiques = (user.points_critiques || []).map(pc => ({
        id:      pc.id,
        libelle: pc.libelle || pc.code || 'N/A',
        code:    pc.code,
      }))

      return {
        id:               user.id,
        matricule:        user.matricule || 'N/A',
        nom:              user.nom || '',
        prenom:           user.prenom || '',
        email:            user.email || '',
        telephone:        user.telephone || 'N/A',
        fonctions:        fonctionsMap,
        fonctions_interim: fonctionsInterim,
        points_critiques: entite,
        prise_service:    user.prise_service || null,
        is_superadmin:    user.is_superadmin ?? false,
        statut:           user.statut ?? false,
        is_responsable:   isResponsable,
        entite_principale: entitePrincipale?.entite || null,
        parent_entite_id:  entitePrincipale?.entite?.parent_entite_id || null,
        raw_data:          user,
      }
    })
  } catch (err) {
    error.value = err.message || 'Erreur lors du chargement des utilisateurs'
    if (err.status === 401 || err.statusCode === 401) {
      useToast().add({ title: 'Session expirée', description: 'Veuillez vous reconnecter', color: 'red' })
      setTimeout(() => navigateTo('/login'), 1500)
    }
  } finally {
    loading.value = false
  }
}

// ============================================================================
// CHARGEMENT FONCTIONS (intérim)
// ============================================================================
const loadFonctions = async () => {
  loadingFonctions.value = true
  try {
    const token = getToken()
    const response = await $fetch(
      `${config.public.apiBase}/entites/entites-meme-niveau/${selectedUser.value?.entite_users?.[0]?.entite?.parent_entite_id || selectedUser.value?.parent_entite_id || '0'}`,
      { method: 'GET', headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }
    )
    fonctions.value = response?.data ?? (Array.isArray(response) ? response : [])
  } catch (err) {
    useToast().add({ title: 'Erreur', description: 'Impossible de charger les fonctions', color: 'red' })
  } finally {
    loadingFonctions.value = false
  }
}

// ============================================================================
// GESTION INTÉRIM
// ============================================================================
const openInterimModal = async (user) => {
  selectedUser.value  = null
  fonctions.value     = []
  interimForm.value   = { fonction_id: null, date_debut: '', date_fin: '' }
  interimFile.value   = null
  interimError.value  = null
  if (interimFileInputRef.value) interimFileInputRef.value.value = ''

  selectedUser.value     = user
  showInterimModal.value = true
  await loadFonctions(user)
}

const closeInterimModal = () => {
  showInterimModal.value = false
  selectedUser.value     = null
  interimForm.value      = { fonction_id: null, date_debut: '', date_fin: '' }
  interimFile.value      = null
  interimError.value     = null
  if (interimFileInputRef.value) interimFileInputRef.value.value = ''
}

const handleInterimFileChange = (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  const err = validateFile(file)
  if (err) { useToast().add({ title: 'Fichier invalide', description: err, color: 'red' }); return }
  interimFile.value = file
}

const onFileDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (!file) return
  const err = validateFile(file)
  if (err) { useToast().add({ title: 'Fichier invalide', description: err, color: 'red' }); return }
  interimFile.value = file
}

const removeInterimFile = () => {
  interimFile.value = null
  if (interimFileInputRef.value) interimFileInputRef.value.value = ''
}

const submitInterim = async () => {
  if (!selectedUser.value || !interimForm.value.fonction_id || !interimForm.value.date_debut) {
    interimError.value = 'Veuillez remplir tous les champs obligatoires'; return
  }
  if (!interimFile.value) {
    interimError.value = 'Veuillez joindre une pièce justificative'; return
  }
  if (interimForm.value.date_fin && interimForm.value.date_fin < interimForm.value.date_debut) {
    interimError.value = 'La date de fin doit être après la date de début'; return
  }

  submittingInterim.value = true
  interimError.value      = null

  try {
    const token    = getToken()
    const formData = new FormData()
    formData.append('entite_id',  String(interimForm.value.fonction_id))
    formData.append('user_id',    String(selectedUser.value.id))
    formData.append('date_debut', interimForm.value.date_debut)
    formData.append('is_interim', '1')
    formData.append('actif',      '1')
    if (interimForm.value.date_fin) formData.append('date_fin', interimForm.value.date_fin)
    if (interimFile.value instanceof File) formData.append('piece_jointe', interimFile.value)

    await $fetch(`${config.public.apiBase}/entite-users`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      body:    formData,
    })

    useToast().add({ title: 'Succès', description: "L'intérim a été créé avec succès", color: 'green' })
    closeInterimModal()
    await loadUtilisateurs()
  } catch (err) {
    let msg = "Erreur lors de la création de l'intérim"
    if (err.status === 422 || err.statusCode === 422) {
      msg = err.data?.errors ? Object.values(err.data.errors).flat().join(', ') : err.data?.message || msg
    } else if (err.data?.message) {
      msg = err.data.message
    }
    interimError.value = msg
    useToast().add({ title: 'Erreur', description: msg, color: 'red' })
  } finally {
    submittingInterim.value = false
  }
}

// ============================================================================
// GESTION IMPORT
// ============================================================================
const openImportModal = () => {
  importStep.value    = 'select'
  importFile.value    = null
  previewData.value   = []
  importReport.value  = {}
  showImportModal.value = true
}

const closeImportModal = () => { showImportModal.value = false }

const finishImport = async () => {
  closeImportModal()
  await loadUtilisateurs()
}

const handleImportFileChange = (event) => {
  const file = event.target.files?.[0]
  if (file) validateAndSetImportFile(file)
}

const onImportFileDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file) validateAndSetImportFile(file)
}

const validateAndSetImportFile = (file) => {
  const ext = file.name.split('.').pop()?.toLowerCase()
  if (!['xlsx', 'xls', 'csv'].includes(ext)) {
    useToast().add({ title: 'Format invalide', description: 'Seuls .xlsx, .xls et .csv sont acceptés', color: 'red' }); return
  }
  if (file.size > 5 * 1024 * 1024) {
    useToast().add({ title: 'Fichier trop lourd', description: 'La taille maximale est 5 Mo', color: 'red' }); return
  }
  importFile.value = file
}

const clearImportFile = () => {
  importFile.value = null
  if (importFileInput.value) importFileInput.value.value = ''
}

const downloadTemplate = async () => {
  try {
    // ── useRequestHeaders ne fonctionne pas côté client pour les downloads ──
    // On utilise $fetch avec responseType 'blob' pour récupérer le binaire
    const blob = await $fetch(`${config.public.apiBase}/users/import/template`, {
      method:       'GET',
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${getToken()}`,
        Accept:        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
      // onResponseError permet de capturer les erreurs 4xx/5xx sur un blob
      onResponseError({ response }) {
        throw new Error(`Erreur serveur : ${response.status}`)
      },
    })

    // Vérifier que la réponse est bien un fichier Excel (pas une erreur JSON)
    if (blob.type && blob.type.includes('application/json')) {
      const text = await blob.text()
      const json = JSON.parse(text)
      throw new Error(json.message || 'Réponse inattendue du serveur')
    }

    // Déclencher le téléchargement navigateur
    const url = URL.createObjectURL(blob)
    const a   = document.createElement('a')
    a.href     = url
    a.download = 'template_import_utilisateurs.xlsx'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    useToast().add({
      title:       'Template téléchargé',
      description: 'Le fichier contient les colonnes requises et la liste des codes postes',
      color:       'green',
    })
  } catch (err) {
    console.error('❌ Erreur téléchargement template:', err)
    useToast().add({
      title:       'Erreur de téléchargement',
      description: err.message || 'Impossible de télécharger le template',
      color:       'red',
    })
  }
}

const previewImport = async () => {
  if (!importFile.value) return
  loadingPreview.value = true
  try {
    const formData = new FormData()
    formData.append('file', importFile.value)
    const response = await $fetch(`${config.public.apiBase}/users/import/preview`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${getToken()}`, Accept: 'application/json' },
      body:    formData,
    })
    previewData.value = response.data || []
    importStep.value  = 'preview'
  } catch (err) {
    useToast().add({ title: 'Erreur', description: err.data?.message || 'Erreur lors de la prévisualisation', color: 'red' })
  } finally {
    loadingPreview.value = false
  }
}

const launchImport = async () => {
  if (!importFile.value) return
  loadingImport.value = true
  try {
    const formData = new FormData()
    formData.append('file', importFile.value)
    const response = await $fetch(`${config.public.apiBase}/users/import`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${getToken()}`, Accept: 'application/json' },
      body:    formData,
    })
    importReport.value = response
    importStep.value   = 'report'
    if (response.imported > 0) {
      useToast().add({ title: 'Import terminé', description: `${response.imported} utilisateur(s) importé(s)`, color: 'green' })
    }
  } catch (err) {
    useToast().add({ title: 'Erreur', description: err.data?.message || "Erreur lors de l'import", color: 'red' })
  } finally {
    loadingImport.value = false
  }
}

// ============================================================================
// SUPPRESSION
// ============================================================================
const refresh  = () => loadUtilisateurs()
const onView   = (item) => navigateTo(`/utilisateurs/${item.id}`)
const onEdit   = (item) => navigateTo(`/utilisateurs/${item.id}`)

const onDelete = (item) => {
  itemToDelete.value   = item
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!itemToDelete.value) return
  deleting.value = true
  try {
    await $fetch(`${config.public.apiBase}/users/${itemToDelete.value.id}`, {
      method:  'DELETE',
      headers: { Authorization: `Bearer ${getToken()}`, Accept: 'application/json' },
    })
    showDeleteModal.value = false
    useToast().add({ title: 'Succès', description: `L'utilisateur "${itemToDelete.value.nom} ${itemToDelete.value.prenom}" a été supprimé`, color: 'green' })
    itemToDelete.value = null
    await loadUtilisateurs()
  } catch (err) {
    let msg = 'Une erreur est survenue lors de la suppression'
    if (err.status === 401 || err.statusCode === 401) { msg = 'Session expirée'; setTimeout(() => navigateTo('/login'), 2000) }
    else if (err.status === 404 || err.statusCode === 404) { msg = "L'utilisateur n'existe plus"; await loadUtilisateurs() }
    else msg = err.data?.message || err.message || msg
    useToast().add({ title: 'Erreur de suppression', description: msg, color: 'red' })
  } finally {
    deleting.value = false
  }
}

const onBulkDelete = async (selectedIds) => {
  if (!selectedIds.length) return
  const msg = selectedIds.length === 1
    ? 'Voulez-vous vraiment supprimer cet utilisateur ?'
    : `Voulez-vous vraiment supprimer ${selectedIds.length} utilisateurs ?`
  if (!confirm(msg)) return

  useToast().add({ title: 'Suppression en cours', description: `Suppression de ${selectedIds.length} utilisateur(s)...`, color: 'blue' })

  let successCount = 0, errorCount = 0
  const errors = []

  for (const id of selectedIds) {
    try {
      await $fetch(`${config.public.apiBase}/users/${id}`, {
        method:  'DELETE',
        headers: { Authorization: `Bearer ${getToken()}`, Accept: 'application/json' },
      })
      successCount++
    } catch (err) {
      errorCount++
      const user = utilisateurs.value.find(u => u.id === id)
      errors.push({ id, nom: user ? `${user.nom} ${user.prenom}` : `ID ${id}`, message: err.data?.message || err.message || 'Erreur inconnue' })
    }
  }

  if (errorCount === 0) {
    useToast().add({ title: 'Suppression réussie', description: `${successCount} utilisateur(s) supprimé(s)`, color: 'green' })
  } else if (successCount === 0) {
    useToast().add({ title: 'Échec', description: errors[0]?.message || 'Aucun utilisateur supprimé', color: 'red' })
  } else {
    useToast().add({ title: 'Suppression partielle', description: `${successCount} succès, ${errorCount} échec(s)`, color: 'orange' })
  }

  await loadUtilisateurs()
}

const onSelectionChange = (ids) => { /* pour usage futur */ }

// ============================================================================
// LIFECYCLE
// ============================================================================
onMounted(loadUtilisateurs)
onActivated(loadUtilisateurs)
</script>