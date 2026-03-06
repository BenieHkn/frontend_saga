<template>
  <div class="min-h-screen bg-slate-100 p-6 font-sans">

    <!-- ═══════════════════════════════════════════════════════════
         MODAL : AJOUTER / MODIFIER UN TYPE DE DOCUMENT
    ════════════════════════════════════════════════════════════ -->
    <UModal v-model="formOpen" :ui="{ width: 'sm:max-w-lg' }">
      <div class="flex flex-col bg-white rounded-xl overflow-hidden">

        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full flex items-center justify-center"
              :class="editingItem ? 'bg-amber-100' : 'bg-indigo-100'">
              <Icon :name="editingItem ? 'i-heroicons-pencil-square' : 'i-heroicons-plus-circle'"
                class="w-4 h-4" :class="editingItem ? 'text-amber-600' : 'text-indigo-600'" />
            </div>
            <div>
              <h2 class="text-base font-bold text-slate-900">
                {{ editingItem ? 'Modifier le type de document' : 'Nouveau type de document' }}
              </h2>
              <p v-if="editingItem" class="text-xs text-slate-500">{{ editingItem.code }} — {{ editingItem.libelle }}</p>
            </div>
          </div>
          <button @click="closeForm"
            class="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700">
            <Icon name="i-heroicons-x-mark" class="w-4 h-4" />
          </button>
        </div>

        <!-- Corps du formulaire -->
        <div class="p-6 space-y-5">

          <!-- Code -->
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Code <span class="text-red-500">*</span>
            </label>
            <input v-model="form.code" type="text" placeholder="Ex: ACC, ARR..."
              class="w-full h-10 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all uppercase" />
          </div>

          <!-- Libellé -->
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Libellé <span class="text-red-500">*</span>
            </label>
            <input v-model="form.libelle" type="text" placeholder="Ex: ACCORD, ARRÊTÉ..."
              class="w-full h-10 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all" />
          </div>

          <!-- Visibilité -->
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Visibilité <span class="text-red-500">*</span>
            </label>
            <select v-model="form.visibilite"
              class="w-full h-10 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all bg-white">
              <option value="public">Public</option>
              <option value="prive">Privé</option>
            </select>
          </div>

          <!-- Peut être traité -->
          <div class="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <input type="checkbox" v-model="form.peut_etre_traite" id="peut_etre_traite"
              class="w-4 h-4 text-indigo-600 bg-white border-slate-300 rounded focus:ring-indigo-500" />
            <label for="peut_etre_traite" class="text-sm font-medium text-slate-700 cursor-pointer select-none">
              Peut être traité
            </label>
          </div>

          <!-- Type parent (avec recherche) -->
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Type parent <span class="text-slate-400 font-normal normal-case">(optionnel)</span>
            </label>
            <div class="relative">
              <div class="relative">
                <input v-model="searchParent" @focus="showParentDropdown = true" @input="filterParents" type="text"
                  placeholder="Rechercher un type parent..."
                  class="w-full h-10 px-3 py-2 pr-10 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all bg-white" />
                <Icon name="i-heroicons-magnifying-glass"
                  class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>

              <!-- Dropdown résultats -->
              <div v-if="showParentDropdown"
                class="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                <div @click="clearParent"
                  class="px-4 py-2.5 cursor-pointer hover:bg-slate-50 border-b border-slate-100 text-xs text-slate-400 italic">
                  — Aucun parent —
                </div>
                <div v-for="type in filteredParents" :key="type.id" @click="selectParent(type)"
                  class="px-4 py-2.5 cursor-pointer hover:bg-indigo-50 border-b border-slate-100 last:border-b-0 transition-colors">
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">{{ type.code }}</span>
                    <span class="text-sm font-medium text-slate-800">{{ type.libelle }}</span>
                  </div>
                </div>
                <div v-if="filteredParents.length === 0"
                  class="px-4 py-3 text-xs text-slate-400 italic text-center">Aucun résultat</div>
              </div>

              <!-- Parent sélectionné -->
              <div v-if="selectedParent" class="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-lg">
                <span class="text-[10px] font-bold text-indigo-400">{{ selectedParent.code }}</span>
                <span class="text-sm font-semibold text-indigo-900">{{ selectedParent.libelle }}</span>
                <button type="button" @click="clearParent" class="text-indigo-400 hover:text-indigo-700 transition-colors">
                  <Icon name="i-heroicons-x-mark" class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <!-- Erreurs -->
          <div v-if="formErrors.length" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <ul class="space-y-1">
              <li v-for="(err, i) in formErrors" :key="i" class="text-xs text-red-600 flex items-start gap-1.5">
                <Icon name="i-heroicons-exclamation-circle" class="w-3.5 h-3.5 shrink-0 mt-0.5" />
                {{ err }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-slate-100 flex justify-end gap-2 shrink-0">
          <UButton color="gray" variant="outline" @click="closeForm">Annuler</UButton>
          <UButton :loading="formLoading" :disabled="!isFormValid || formLoading"
            :color="editingItem ? 'amber' : 'indigo'" @click="handleSubmit">
            {{ editingItem ? 'Modifier' : 'Créer' }}
          </UButton>
        </div>
      </div>
    </UModal>

    <!-- ═══════════════════════════════════════════════════════════
         MODAL : AJOUTER UN MODÈLE DE DOCUMENT
    ════════════════════════════════════════════════════════════ -->
    <div v-if="showModeleModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="closeModeleModal">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">

        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Nouveau modèle de document</h3>
              <p class="text-sm text-slate-500 mt-0.5">
                Pour le type :
                <span class="font-semibold text-indigo-600">{{ modeleTargetType?.libelle }}</span>
              </p>
            </div>
          </div>
          <button class="text-gray-400 hover:text-gray-600 transition-colors" @click="closeModeleModal">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Corps -->
        <div class="px-6 py-5 space-y-5 flex-1">

          <!-- Type de document (verrouillé) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Type de document <span class="text-red-600">*</span>
            </label>
            <div class="flex items-center gap-2 px-3 py-2.5 bg-indigo-50 border border-indigo-200 rounded-lg">
              <span class="inline-flex px-2 py-0.5 text-[11px] font-bold rounded bg-indigo-100 text-indigo-700">
                {{ modeleTargetType?.code }}
              </span>
              <span class="text-sm font-semibold text-indigo-900">{{ modeleTargetType?.libelle }}</span>
              <svg class="w-4 h-4 text-indigo-400 ml-auto flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
          </div>

          <!-- Code & Libellé -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Code <span class="text-red-600">*</span>
              </label>
              <input v-model="modeleForm.code" type="text" placeholder="MODELE_01"
                class="w-full px-3 py-2 text-sm font-mono text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
              <p v-if="modeleErrors.code" class="mt-1 text-xs text-red-600">{{ modeleErrors.code[0] }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Libellé <span class="text-red-600">*</span>
              </label>
              <input v-model="modeleForm.libelle" type="text" placeholder="Nom du modèle"
                class="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
              <p v-if="modeleErrors.libelle" class="mt-1 text-xs text-red-600">{{ modeleErrors.libelle[0] }}</p>
            </div>
          </div>

          <!-- Orientation & Format -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Orientation</label>
              <select v-model="modeleForm.orientation"
                class="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg outline-none cursor-pointer">
                <option value="portrait">Portrait</option>
                <option value="paysage">Paysage</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Format de page</label>
              <select v-model="modeleForm.format_page"
                class="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg outline-none cursor-pointer">
                <option value="A4">A4</option>
                <option value="A3">A3</option>
                <option value="Letter">Letter</option>
              </select>
            </div>
          </div>

          <!-- Signataire & Fonction -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Signataire</label>
              <input v-model="modeleForm.signataire" type="text" placeholder="Nom du signataire"
                class="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Fonction du signataire</label>
              <input v-model="modeleForm.fonction_signataire" type="text" placeholder="Ex : Directeur Général"
                class="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg outline-none" />
            </div>
          </div>

          <!-- En-tête HTML -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm font-medium text-gray-700">En-tête HTML</label>
              <span class="text-[10px] text-slate-400 font-mono">Affiché en haut de chaque page</span>
            </div>
            <textarea v-model="modeleForm.entete_html" rows="4" placeholder="<table>…</table>"
              class="w-full px-3 py-2.5 text-xs font-mono text-slate-800 bg-slate-50 border border-slate-300 rounded-lg outline-none resize-y leading-relaxed" />
          </div>

          <!-- Corps du document -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm font-medium text-gray-700">
                Corps du document <span class="text-red-600">*</span>
              </label>
              <button type="button"
                class="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100 transition-colors"
                @click="insertModeleVariable">
                Insérer variable
              </button>
            </div>
            <textarea v-model="modeleForm.template_html" rows="9" required placeholder="<p>Bonjour {{nom}},</p>"
              class="w-full px-3 py-2.5 text-xs font-mono text-slate-800 bg-slate-50 border border-slate-300 rounded-lg outline-none resize-y leading-relaxed" />
            <p v-if="modeleErrors.template_html" class="mt-1 text-xs text-red-600">{{ modeleErrors.template_html[0] }}</p>
          </div>

          <!-- Pied de page HTML -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm font-medium text-gray-700">Pied de page HTML</label>
              <span class="text-[10px] text-slate-400 font-mono">Affiché en bas de chaque page</span>
            </div>
            <textarea v-model="modeleForm.pied_page_html" rows="3" placeholder="<div>…</div>"
              class="w-full px-3 py-2 text-xs font-mono text-slate-800 bg-slate-50 border border-slate-300 rounded-lg outline-none resize-y" />
          </div>

          <!-- Marges -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Marges (mm)</label>
            <div class="grid grid-cols-4 gap-3">
              <div v-for="m in [
                { key: 'marge_haut', label: 'Haut' },
                { key: 'marge_bas', label: 'Bas' },
                { key: 'marge_gauche', label: 'Gauche' },
                { key: 'marge_droite', label: 'Droite' }
              ]" :key="m.key">
                <label class="block text-[11px] font-semibold text-slate-500 mb-1 text-center">{{ m.label }}</label>
                <input v-model.number="modeleForm[m.key]" type="number" min="0" max="100"
                  class="w-full px-2 py-2 text-sm text-center text-slate-900 bg-white border border-slate-300 rounded-lg outline-none" />
              </div>
            </div>
          </div>

          <!-- Toggles -->
          <div class="flex items-center gap-6">
            <label class="flex items-center gap-2.5 cursor-pointer select-none">
              <button type="button"
                class="relative inline-flex items-center rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0"
                :class="modeleForm.est_actif ? 'bg-indigo-600' : 'bg-slate-300'"
                style="width:38px;height:21px"
                @click="modeleForm.est_actif = !modeleForm.est_actif">
                <span class="inline-block w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
                  :style="modeleForm.est_actif ? 'transform:translateX(18px)' : 'transform:translateX(2px)'" />
              </button>
              <span class="text-sm font-medium text-gray-700">Modèle actif</span>
            </label>
            <label class="flex items-center gap-2.5 cursor-pointer select-none">
              <button type="button"
                class="relative inline-flex items-center rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0"
                :class="modeleForm.est_defaut ? 'bg-indigo-600' : 'bg-slate-300'"
                style="width:38px;height:21px"
                @click="modeleForm.est_defaut = !modeleForm.est_defaut">
                <span class="inline-block w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
                  :style="modeleForm.est_defaut ? 'transform:translateX(18px)' : 'transform:translateX(2px)'" />
              </button>
              <span class="text-sm font-medium text-gray-700">Modèle par défaut</span>
            </label>
          </div>

          <!-- Erreur générale -->
          <div v-if="modeleFormError" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-800">{{ modeleFormError }}</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl sticky bottom-0">
          <button type="button"
            class="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            @click="closeModeleModal">
            Annuler
          </button>
          <button type="button"
            :disabled="modeleSubmitting"
            class="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            @click="submitModele">
            <svg v-if="!modeleSubmitting" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
            {{ modeleSubmitting ? 'Création…' : 'Créer le modèle' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════
         EN-TÊTE PAGE
    ════════════════════════════════════════════════════════════ -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Types de documents</h1>
        <p class="text-sm text-slate-500">Gestion des types de documents</p>
      </div>
      <UBadge color="green" variant="soft" size="lg" class="ml-auto">
        <UButton @click="openCreate" variant="text" icon="i-heroicons-plus" size="sm" class="p-0 m-0 text-green-600">
          Nouveau
        </UButton>
      </UBadge>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
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
      <button class="px-4 py-2 text-xs font-bold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors shrink-0"
        @click="refresh">Réessayer</button>
    </div>

    <!-- DataTable -->
    <DataTable
      v-else
      :data="typeDocumentsList"
      :columns="columns"
      :selectable="false"
      :default-sort-column="null"
      :show-row-numbers="true"
      :left-aligned-columns="['code', 'libelle', 'parent']"
      :hide-labels-when-input="true"
      @edit="openEdit"
      @delete="handleDelete"
    >
      <!-- ── FILTRES AVANCÉS ──────────────────────────────────────── -->
      <template #advanced-filters="{ filters, onFilter }">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 p-4 bg-slate-50 border border-slate-200 rounded-lg">

          <!-- Code -->
          <div>
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Code</label>
            <input v-model="filters.code" placeholder="Filtrer par code..."
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              @input="onFilter" />
          </div>

          <!-- Libellé -->
          <div>
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Libellé</label>
            <input v-model="filters.libelle" placeholder="Filtrer par libellé..."
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              @input="onFilter" />
          </div>

          <!-- Visibilité -->
          <div>
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Visibilité</label>
            <select v-model="filters.visibilite"
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              @change="onFilter">
              <option value="">— Toutes —</option>
              <option value="public">Public</option>
              <option value="prive">Privé</option>
            </select>
          </div>

          <!-- Peut être traité -->
          <div>
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Peut être traité</label>
            <select v-model="filters.peut_etre_traite_filter"
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              @change="onFilter">
              <option value="">— Tous —</option>
              <option value="true">Oui</option>
              <option value="false">Non</option>
            </select>
          </div>

          <!-- Parent -->
          <div>
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Parent</label>
            <input v-model="filters.parent" placeholder="Filtrer par parent..."
              class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              @input="onFilter" />
          </div>

        </div>
      </template>

      <!-- Badge code -->
      <template #cell-code="{ value }">
        <span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 tracking-wider">
          {{ value }}
        </span>
      </template>

      <!-- Libellé -->
      <template #cell-libelle="{ value }">
        <span class="text-sm font-semibold text-slate-800">{{ value }}</span>
      </template>

      <!-- Visibilité -->
      <template #cell-visibilite="{ value }">
        <span class="inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full border uppercase" :class="{
          'bg-green-50 text-green-700 border-green-200': value === 'public',
          'bg-slate-50 text-slate-600 border-slate-200': value === 'prive',
          'bg-blue-50 text-blue-700 border-blue-200': value === 'interne',
        }">{{ value }}</span>
      </template>

      <!-- Peut être traité -->
      <template #cell-peut_etre_traite="{ value }">
        <div class="flex justify-center">
          <Icon v-if="value" name="i-heroicons-check-circle" class="w-5 h-5 text-emerald-500" />
          <Icon v-else name="i-heroicons-x-circle" class="w-5 h-5 text-slate-300" />
        </div>
      </template>

      <!-- Parent -->
      <template #cell-parent="{ value }">
        <span v-if="value" class="text-xs text-slate-600">{{ value }}</span>
        <span v-else class="text-slate-300 italic text-[11px]">—</span>
      </template>

      <!-- Actions : add model + edit + delete -->
      <template #actions="{ item }">
        <div class="flex gap-1.5 justify-end">

          <!-- Bouton "Ajouter un modèle" — visible uniquement si peut_etre_traite -->
          <button
            v-if="item.peut_etre_traite"
            @click="openAddModele(item)"
            title="Ajouter un modèle de document"
            class="inline-flex items-center justify-center w-8 h-8 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-md hover:bg-indigo-100 hover:text-indigo-800 transition-all group relative"
          >
            <!-- Icône : document + plus -->
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>

          <button @click="openEdit(item)" title="Modifier"
            class="inline-flex items-center justify-center w-8 h-8 bg-amber-50 text-amber-700 border border-amber-100 rounded-md hover:bg-amber-100 hover:text-amber-900 transition-all group">
            <Icon name="i-heroicons-pencil-square" class="w-4 h-4" />
          </button>

          <button @click="handleDelete(item)" title="Supprimer"
            class="inline-flex items-center justify-center w-8 h-8 bg-red-50 text-red-600 border border-red-100 rounded-md hover:bg-red-100 hover:text-red-800 transition-all group">
            <Icon name="i-heroicons-trash" class="w-4 h-4" />
          </button>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DataTable from '~/components/DataTable.vue'
import Swal from 'sweetalert2'

const config = useRuntimeConfig()

// ── État principal ─────────────────────────────────────────────────────────────
const typeDocuments = ref([])
const loading = ref(false)
const error = ref(null)

// ── État formulaire TYPE ───────────────────────────────────────────────────────
const formOpen = ref(false)
const formLoading = ref(false)
const formErrors = ref([])
const editingItem = ref(null)

const form = ref({
  code: '',
  libelle: '',
  visibilite: 'public',
  peut_etre_traite: false,
  parent_id: null,
})

// ── Recherche parent ───────────────────────────────────────────────────────────
const searchParent = ref('')
const showParentDropdown = ref(false)
const selectedParent = ref(null)
const filteredParents = ref([])

// ── État modal MODÈLE ──────────────────────────────────────────────────────────
const showModeleModal = ref(false)
const modeleTargetType = ref(null)
const modeleSubmitting = ref(false)
const modeleErrors = ref({})
const modeleFormError = ref(null)

const defaultModeleForm = () => ({
  type_document_id: null,
  code: '',
  libelle: '',
  template_html: '',
  entete_html: '',
  pied_page_html: '',
  orientation: 'portrait',
  format_page: 'A4',
  marge_haut: 20,
  marge_bas: 10,
  marge_gauche: 25,
  marge_droite: 25,
  signataire: '',
  fonction_signataire: '',
  est_actif: true,
  est_defaut: false,
})

const modeleForm = ref(defaultModeleForm())

// ── Colonnes DataTable ─────────────────────────────────────────────────────────
const columns = [
  { key: 'code', label: 'Code', visible: true },
  { key: 'libelle', label: 'Libellé', visible: true },
  { key: 'visibilite', label: 'Visibilité', visible: true },
  { key: 'peut_etre_traite', label: 'Peut être traité', visible: true, inputHidden: true, filterable: false },
  { key: 'peut_etre_traite_filter', label: '', visible: false, inputHidden: true },
  { key: 'parent', label: 'Parent', visible: true, inputHidden: false },
]

// ── Données transformées pour la DataTable ─────────────────────────────────────
const typeDocumentsList = computed(() =>
  typeDocuments.value.map(t => ({
    id: t.id,
    code: t.code,
    libelle: t.libelle,
    visibilite: t.visibilite,
    peut_etre_traite: t.peut_etre_traite,
    peut_etre_traite_filter: String(!!t.peut_etre_traite),
    parent: t.parent_id ? getParentLabel(t.parent_id) : null,
    _complete: t,
  }))
)

// ── Helpers ────────────────────────────────────────────────────────────────────
const getAuthToken = () => process.client ? localStorage.getItem('auth_token') || '' : ''

const getParentLabel = (parentId) => {
  const found = typeDocuments.value.find(t => t.id === parentId)
  return found ? `${found.code} — ${found.libelle}` : null
}

// ── Computed formulaire TYPE ───────────────────────────────────────────────────
const isFormValid = computed(() =>
  form.value.code.trim() !== '' && form.value.libelle.trim() !== '' && form.value.visibilite !== ''
)

// ── Gestion dropdown parent ────────────────────────────────────────────────────
const filterParents = () => {
  const q = searchParent.value.toLowerCase().trim()
  const candidates = typeDocuments.value.filter(t => !editingItem.value || t.id !== editingItem.value.id)
  filteredParents.value = q
    ? candidates.filter(t => t.code.toLowerCase().includes(q) || t.libelle.toLowerCase().includes(q))
    : candidates
  showParentDropdown.value = true
}

const selectParent = (type) => {
  form.value.parent_id = type.id
  selectedParent.value = type
  searchParent.value = `${type.code} — ${type.libelle}`
  showParentDropdown.value = false
}

const clearParent = () => {
  form.value.parent_id = null
  selectedParent.value = null
  searchParent.value = ''
  filteredParents.value = typeDocuments.value.filter(t => !editingItem.value || t.id !== editingItem.value.id)
  showParentDropdown.value = false
}

if (process.client) {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
      showParentDropdown.value = false
    }
  })
}

// ── API : Charger la liste ─────────────────────────────────────────────────────
const refresh = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await $fetch(`${config.public.apiBase}/type_documents`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    })
    typeDocuments.value = res?.data || res || []
  } catch (e) {
    console.error('Erreur chargement:', e)
    error.value = e?.data?.message || e?.message || 'Erreur inconnue'
  } finally {
    loading.value = false
  }
}

// ── Ouvrir modal création TYPE ────────────────────────────────────────────────
const openCreate = () => {
  editingItem.value = null
  form.value = { code: '', libelle: '', visibilite: 'public', peut_etre_traite: false, parent_id: null }
  formErrors.value = []
  clearParent()
  filteredParents.value = typeDocuments.value
  formOpen.value = true
}

// ── Ouvrir modal édition TYPE ─────────────────────────────────────────────────
const openEdit = (item) => {
  const original = item._complete || typeDocuments.value.find(t => t.id === item.id) || item
  editingItem.value = original

  form.value = {
    code: original.code,
    libelle: original.libelle,
    visibilite: original.visibilite || 'public',
    peut_etre_traite: original.peut_etre_traite ?? false,
    parent_id: original.parent_id || null,
  }
  formErrors.value = []

  if (original.parent_id) {
    const parent = typeDocuments.value.find(t => t.id === original.parent_id)
    if (parent) {
      selectedParent.value = parent
      searchParent.value = `${parent.code} — ${parent.libelle}`
    }
  } else {
    clearParent()
  }

  filteredParents.value = typeDocuments.value.filter(t => t.id !== original.id)
  formOpen.value = true
}

const closeForm = () => {
  formOpen.value = false
  editingItem.value = null
  formErrors.value = []
  clearParent()
}

// ── Soumission TYPE (create / update) ─────────────────────────────────────────
const handleSubmit = async () => {
  formErrors.value = []
  if (!form.value.code.trim()) formErrors.value.push('Le code est obligatoire')
  if (!form.value.libelle.trim()) formErrors.value.push('Le libellé est obligatoire')
  if (formErrors.value.length) return

  formLoading.value = true
  try {
    const payload = {
      code: form.value.code.trim().toUpperCase(),
      libelle: form.value.libelle.trim().toUpperCase(),
      visibilite: form.value.visibilite,
      peut_etre_traite: form.value.peut_etre_traite,
      parent_id: form.value.parent_id || null,
    }

    if (editingItem.value) {
      await $fetch(`${config.public.apiBase}/type_documents/${editingItem.value.id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${getAuthToken()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      useToast().add({ title: 'Succès', description: 'Type de document modifié avec succès', color: 'green' })
    } else {
      await $fetch(`${config.public.apiBase}/type_documents`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getAuthToken()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      useToast().add({ title: 'Succès', description: 'Type de document créé avec succès', color: 'green' })
    }

    closeForm()
    await refresh()

  } catch (e) {
    console.error('Erreur soumission:', e)
    if (e?.data?.errors) {
      formErrors.value = Object.values(e.data.errors).flat()
    } else {
      formErrors.value = [e?.data?.message || e?.message || 'Une erreur est survenue']
    }
  } finally {
    formLoading.value = false
  }
}

// ── Suppression TYPE ───────────────────────────────────────────────────────────
const handleDelete = async (item) => {
  const original = item._complete || item
  const result = await Swal.fire({
    title: 'Confirmer la suppression',
    html: `
      <div class="text-left">
        <p class="mb-3 text-sm text-gray-600">Êtes-vous sûr de vouloir supprimer ce type de document ?</p>
        <div class="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
          <span class="text-xs font-bold px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded">${original.code}</span>
          <span class="text-sm font-semibold text-gray-800">${original.libelle}</span>
        </div>
        <p class="mt-3 text-xs text-red-500">⚠️ Cette action est irréversible.</p>
      </div>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Supprimer',
    cancelButtonText: 'Annuler',
    reverseButtons: true,
  })

  if (!result.isConfirmed) return

  try {
    await $fetch(`${config.public.apiBase}/type_documents/${original.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    })
    await Swal.fire({ title: 'Supprimé !', text: 'Le type de document a été supprimé.', icon: 'success', timer: 2000, showConfirmButton: false })
    await refresh()
  } catch (e) {
    console.error('Erreur suppression:', e)
    await Swal.fire({
      title: 'Erreur',
      text: e?.data?.message || 'Impossible de supprimer ce type de document',
      icon: 'error',
      confirmButtonColor: '#7c3aed',
    })
  }
}

// ════════════════════════════════════════════════════════════════
// GESTION MODAL AJOUT MODÈLE
// ════════════════════════════════════════════════════════════════

const openAddModele = (item) => {
  const original = item._complete || typeDocuments.value.find(t => t.id === item.id) || item
  modeleTargetType.value = original
  modeleForm.value = {
    ...defaultModeleForm(),
    type_document_id: original.id,
  }
  modeleErrors.value = {}
  modeleFormError.value = null
  showModeleModal.value = true
}

const closeModeleModal = () => {
  showModeleModal.value = false
  modeleTargetType.value = null
  modeleErrors.value = {}
  modeleFormError.value = null
}

const insertModeleVariable = () => {
  const v = prompt('Nom de la variable :')
  if (v) modeleForm.value.template_html += `{{${v}}}`
}

const submitModele = async () => {
  modeleSubmitting.value = true
  modeleErrors.value = {}
  modeleFormError.value = null

  try {
    await $fetch(`${config.public.apiBase}/modeles-document`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(modeleForm.value),
    })
    useToast().add({ title: 'Succès', description: 'Modèle créé avec succès !', color: 'green' })
    closeModeleModal()
  } catch (e) {
    console.error('Erreur création modèle:', e)
    if (e?.status === 422 || e?.statusCode === 422) {
      modeleErrors.value = e.data?.errors ?? {}
      modeleFormError.value = e.data?.message || 'Erreurs de validation.'
    } else {
      modeleFormError.value = e?.data?.message || e?.message || 'Erreur serveur'
      useToast().add({ title: 'Erreur', description: modeleFormError.value, color: 'red' })
    }
  } finally {
    modeleSubmitting.value = false
  }
}

// ── Mounted ────────────────────────────────────────────────────────────────────
onMounted(() => {
  refresh()
})
</script>

<style scoped>
:deep(.swal2-popup) {
  border-radius: 1rem;
}
</style>