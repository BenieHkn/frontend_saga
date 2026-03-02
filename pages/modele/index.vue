<template>
  <div class="min-h-screen bg-slate-100 p-6 font-sans">

    <!-- ── Header ─────────────────────────────────────────────── -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Modèles de Documents</h1>
        <p class="text-sm text-slate-500">Gestion des modèles et templates de documents</p>
      </div>
      <div class="flex items-center gap-3 ml-auto">
        <div class="flex border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm"></div>
        <UBadge color="green" variant="soft" size="lg">
          <Icon name="i-heroicons-plus" class="h-4 w-4 mr-1" />
          <button class="p-0 m-0 text-green-600 text-sm font-medium" @click="openCreateModal">
            Nouveau modèle
          </button>
        </UBadge>
      </div>
    </div>

    <!-- ── Filters ─────────────────────────────────────────────── -->
    <div class="bg-white border border-slate-200 rounded-xl p-4 mb-5 shadow-sm flex flex-wrap gap-3 items-end">
      <div class="flex-1 min-w-[200px] max-w-sm">
        <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Recherche</label>
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" stroke-width="1.5"/>
            <path d="M10.5 10.5L14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Code ou libellé…"
            class="w-full pl-8 pr-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
            @input="loadModeles"
          />
        </div>
      </div>
      <div class="min-w-[200px]">
        <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Type de document</label>
        <div v-if="loadingTypes" class="flex items-center gap-2 py-2 px-3 border border-slate-300 rounded-lg bg-slate-50 text-xs text-slate-400">
          <div class="w-3.5 h-3.5 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin flex-shrink-0" />
          Chargement…
        </div>
        <select
          v-else
          v-model="filters.type_document_id"
          class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all cursor-pointer"
          @change="loadModeles"
        >
          <option value="">Tous les types</option>
          <option v-for="t in typeDocuments" :key="t.id" :value="t.id">{{ t.libelle }}</option>
        </select>
      </div>
    </div>

    <!-- ── Loading ─────────────────────────────────────────────── -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
      <div class="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
      <span class="text-sm font-medium">Chargement des modèles…</span>
    </div>

    <!-- ── Error ────────────────────────────────────────────────── -->
    <div v-else-if="error" class="flex items-center gap-4 p-5 bg-red-50 border border-red-200 rounded-xl max-w-2xl">
      <svg class="w-8 h-8 text-red-600 shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
      <div class="flex-1">
        <p class="text-sm font-bold text-red-900">Erreur de chargement</p>
        <p class="text-xs text-red-700">{{ error }}</p>
      </div>
      <button class="px-4 py-2 text-xs font-bold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors shrink-0" @click="loadModeles">
        Réessayer
      </button>
    </div>

    <!-- ── Empty ────────────────────────────────────────────────── -->
    <div v-else-if="modeles.length === 0" class="flex flex-col items-center justify-center py-20 gap-3">
      <div class="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
        <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
          <rect x="8" y="6" width="32" height="36" rx="3" stroke="#94a3b8" stroke-width="2"/>
          <path d="M15 16h18M15 22h18M15 28h12" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <p class="text-sm font-semibold text-slate-700">Aucun modèle trouvé</p>
      <p class="text-xs text-slate-400">Créez votre premier modèle de document</p>
      <button class="mt-1 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors" @click="openCreateModal">
        <Icon name="i-heroicons-plus" class="w-4 h-4" />
        Créer un modèle
      </button>
    </div>

    <!-- ── Grid View ────────────────────────────────────────────── -->
    <div v-else-if="viewMode === 'list'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div
        v-for="modele in modeles"
        :key="modele.id"
        class="bg-white border rounded-xl overflow-hidden shadow-sm flex flex-col transition-all hover:-translate-y-0.5 hover:shadow-md"
        :class="modele.est_defaut ? 'border-indigo-400' : 'border-slate-200'"
      >
        <div class="flex items-center justify-between px-3.5 pt-3.5 pb-2">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              {{ modele.type_document?.libelle || 'N/A' }}
            </span>
            <span v-if="modele.est_defaut" class="inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-100 uppercase">
              Défaut
            </span>
          </div>
          <div class="relative" data-menu>
            <button class="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors" @click.stop="toggleMenu(modele.id)">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="8" cy="3" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="8" cy="13" r="1.5"/>
              </svg>
            </button>
            <div v-if="activeMenu === modele.id" class="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 min-w-[140px] overflow-hidden">
              <button class="flex items-center gap-2 w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors" @click="openEdit(modele)">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M11 2l3 3-8 8H3v-3l8-8z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
                Modifier
              </button>
              <button class="flex items-center gap-2 w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors" @click="openPreview(modele)">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" stroke-width="1.5"/><circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.5"/></svg>
                Prévisualiser
              </button>
              <button class="flex items-center gap-2 w-full px-3.5 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors border-t border-slate-100" @click="openDeleteModal(modele)">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M6 4V2h4v2M5 4v9h6V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                Supprimer
              </button>
            </div>
          </div>
        </div>
        <div class="px-3.5 cursor-pointer flex-1" @click="openPreview(modele)">
          <div class="bg-slate-50 border border-slate-100 rounded-lg p-3 mb-3 space-y-1.5">
            <div v-for="w in ['full','3/4','full','1/2','full','2/3']" :key="w" class="h-1.5 bg-slate-200 rounded-full" :style="`width:${w === 'full' ? '100%' : w === '3/4' ? '75%' : w === '1/2' ? '50%' : '66%'}`" />
          </div>
          <p class="text-sm font-semibold text-slate-900 mb-0.5 truncate">{{ modele.libelle }}</p>
          <p class="text-[11px] font-mono text-slate-400 mb-3 truncate">{{ modele.code }}</p>
        </div>
        <div class="flex items-center justify-between px-3.5 py-2.5 border-t border-slate-100 bg-slate-50">
          <span class="text-[10px] text-slate-400 font-medium">{{ modele.format_page }} · {{ modele.orientation }}</span>
          <span class="text-[10px] text-slate-400 font-medium">v{{ modele.version }}</span>
          <span class="w-2 h-2 rounded-full" :class="modele.est_actif ? 'bg-emerald-400' : 'bg-slate-300'" :title="modele.est_actif ? 'Actif' : 'Inactif'" />
        </div>
      </div>
    </div>

    <!-- ── List View ─────────────────────────────────────────────── -->
    <div v-else class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <table class="w-full border-collapse text-sm">
        <thead>
          <tr class="bg-slate-50">
            <th v-for="col in ['Code','Libellé','Type','Format','Version','Statut','Actions']" :key="col"
              class="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              {{ col }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="modele in modeles"
            :key="modele.id"
            class="border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors"
            :class="modele.est_defaut ? 'bg-indigo-50/40' : ''"
          >
            <td class="px-4 py-3">
              <span class="inline-flex px-2 py-1 text-[11px] font-bold font-mono rounded-md bg-slate-100 text-slate-700 border border-slate-200">{{ modele.code }}</span>
            </td>
            <td class="px-4 py-3">
              <span class="text-sm font-medium text-slate-900">{{ modele.libelle }}</span>
              <span v-if="modele.est_defaut" class="ml-2 inline-flex px-1.5 py-0.5 text-[10px] font-bold rounded bg-amber-50 text-amber-700 border border-amber-100 uppercase">Défaut</span>
            </td>
            <td class="px-4 py-3">
              <span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">{{ modele.type_document?.libelle || 'N/A' }}</span>
            </td>
            <td class="px-4 py-3 text-xs text-slate-600">{{ modele.format_page }} / {{ modele.orientation }}</td>
            <td class="px-4 py-3 text-xs text-slate-600 font-medium">v{{ modele.version }}</td>
            <td class="px-4 py-3">
              <span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border" :class="modele.est_actif ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'">
                {{ modele.est_actif ? 'Actif' : 'Inactif' }}
              </span>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-1.5">
                <button class="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100 transition-colors" title="Prévisualiser" @click="openPreview(modele)">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" stroke-width="1.5"/><circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.5"/></svg>
                </button>
                <button class="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-50 text-slate-500 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors" title="Modifier" @click="openEdit(modele)">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M11 2l3 3-8 8H3v-3l8-8z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
                </button>
                <button class="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-50 text-slate-500 border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors" title="Supprimer" @click="openDeleteModal(modele)">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M6 4V2h4v2M5 4v9h6V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ══════════════════════════════════════════════════════════
         MODAL CRÉER / MODIFIER
    ══════════════════════════════════════════════════════════ -->
    <div
      v-if="showFormModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeFormModal"
    >
      <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ editingModele ? 'Modifier le modèle' : 'Nouveau modèle' }}</h3>
            <p class="text-sm text-slate-500 mt-0.5">
              {{ editingModele ? `Édition de "${editingModele.libelle}"` : 'Créer un nouveau modèle de document' }}
            </p>
          </div>
          <button class="text-gray-400 hover:text-gray-600 transition-colors" @click="closeFormModal">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="px-6 py-5 space-y-5 flex-1">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Type de document <span class="text-red-600">*</span></label>
            <div v-if="loadingTypes" class="flex items-center gap-2 py-2 px-3 border border-slate-300 rounded-lg bg-slate-50 text-xs text-slate-400">
              <div class="w-3.5 h-3.5 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin flex-shrink-0" />
              Chargement des types…
            </div>
            <select v-else v-model="form.type_document_id" :disabled="!!editingModele" required
              class="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400 cursor-pointer">
              <option value="">Choisir…</option>
              <option v-for="t in typeDocuments" :key="t.id" :value="t.id">{{ t.libelle }}</option>
            </select>
            <p v-if="errors.type_document_id" class="mt-1 text-xs text-red-600">{{ errors.type_document_id[0] }}</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Code <span class="text-red-600">*</span></label>
              <input v-model="form.code" type="text" placeholder="MODELE_LETTRE_01" required
                class="w-full px-3 py-2 text-sm font-mono text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
              <p v-if="errors.code" class="mt-1 text-xs text-red-600">{{ errors.code[0] }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Libellé <span class="text-red-600">*</span></label>
              <input v-model="form.libelle" type="text" placeholder="Nom du modèle" required
                class="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
              <p v-if="errors.libelle" class="mt-1 text-xs text-red-600">{{ errors.libelle[0] }}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Orientation</label>
              <select v-model="form.orientation" class="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none cursor-pointer">
                <option value="portrait">Portrait</option>
                <option value="paysage">Paysage</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Format de page</label>
              <select v-model="form.format_page" class="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none cursor-pointer">
                <option value="A4">A4</option>
                <option value="A3">A3</option>
                <option value="Letter">Letter</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Signataire</label>
              <input v-model="form.signataire" type="text" placeholder="Nom du signataire"
                class="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Fonction du signataire</label>
              <input v-model="form.fonction_signataire" type="text" placeholder="Ex : Directeur Général"
                class="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm font-medium text-gray-700">En-tête HTML</label>
              <span class="text-[10px] text-slate-400 font-mono">Affiché en haut de chaque page</span>
            </div>
            <textarea v-model="form.entete_html" rows="4" placeholder="<table>…</table>"
              class="w-full px-3 py-2.5 text-xs font-mono text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-y leading-relaxed transition-all" />
          </div>

          <div v-if="editingModele" class="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
            <svg class="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            </svg>
            <div>
              <strong>Modèle chargé depuis la base de données.</strong>
              Utilisez <em>"Réinitialiser le template"</em> pour écraser avec la version à jour.
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm font-medium text-gray-700">Corps du document <span class="text-red-600">*</span></label>
              <div class="flex items-center gap-2">
                <button type="button" class="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100 transition-colors" @click="insertVariable">
                  Insérer variable
                </button>
                <button v-if="form.type_document_id && getTemplatePourType(form.type_document_id).template_html"
                  type="button"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-md hover:bg-amber-100 transition-colors"
                  @click="rechargerTemplate">
                  Réinitialiser le template
                </button>
              </div>
            </div>
            <textarea v-model="form.template_html" rows="9" required placeholder="<p>Bonjour {{nom}},</p>"
              class="w-full px-3 py-2.5 text-xs font-mono text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-y leading-relaxed transition-all" />
            <p v-if="errors.template_html" class="mt-1 text-xs text-red-600">{{ errors.template_html[0] }}</p>
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm font-medium text-gray-700">Pied de page HTML</label>
              <span class="text-[10px] text-slate-400 font-mono">Affiché en bas de chaque page</span>
            </div>
            <textarea v-model="form.pied_page_html" rows="3" placeholder="<div>…</div>"
              class="w-full px-3 py-2 text-xs font-mono text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-y" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Marges (mm)</label>
            <div class="grid grid-cols-4 gap-3">
              <div v-for="m in [{key:'marge_haut',label:'Haut'},{key:'marge_bas',label:'Bas'},{key:'marge_gauche',label:'Gauche'},{key:'marge_droite',label:'Droite'}]" :key="m.key">
                <label class="block text-[11px] font-semibold text-slate-500 mb-1 text-center">{{ m.label }}</label>
                <input v-model.number="form[m.key]" type="number" min="0" max="100"
                  class="w-full px-2 py-2 text-sm text-center text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
              </div>
            </div>
          </div>

          <div class="flex items-center gap-6">
            <label class="flex items-center gap-2.5 cursor-pointer select-none">
              <button type="button"
                class="relative inline-flex items-center rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0"
                :class="form.est_actif ? 'bg-indigo-600' : 'bg-slate-300'"
                style="width:38px;height:21px"
                @click="form.est_actif = !form.est_actif">
                <span class="inline-block w-4 h-4 bg-white rounded-full shadow transition-transform duration-200" :style="form.est_actif ? 'transform:translateX(18px)' : 'transform:translateX(2px)'" />
              </button>
              <span class="text-sm font-medium text-gray-700">Modèle actif</span>
            </label>
            <label class="flex items-center gap-2.5 cursor-pointer select-none">
              <button type="button"
                class="relative inline-flex items-center rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0"
                :class="form.est_defaut ? 'bg-indigo-600' : 'bg-slate-300'"
                style="width:38px;height:21px"
                @click="form.est_defaut = !form.est_defaut">
                <span class="inline-block w-4 h-4 bg-white rounded-full shadow transition-transform duration-200" :style="form.est_defaut ? 'transform:translateX(18px)' : 'transform:translateX(2px)'" />
              </button>
              <span class="text-sm font-medium text-gray-700">Modèle par défaut</span>
            </label>
          </div>

          <div v-if="formError" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-800">{{ formError }}</p>
          </div>
        </div>

        <div class="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl sticky bottom-0">
          <UButton type="button" color="gray" variant="outline" @click="closeFormModal">Annuler</UButton>
          <UButton type="button" :loading="submitting" :disabled="submitting" @click="submitForm">
            <svg v-if="!submitting" class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {{ editingModele ? 'Enregistrer les modifications' : 'Créer le modèle' }}
          </UButton>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════════
         MODAL PRÉVISUALISATION
    ══════════════════════════════════════════════════════════ -->
    <div
      v-if="showPreviewModal"
      class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      @click.self="closePreview"
    >
      <div class="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[95vh] overflow-y-auto flex flex-col">

        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Prévisualisation</h3>
            <p class="text-sm text-slate-500 mt-0.5">
              {{ previewModele?.libelle }}
              <span class="ml-2 inline-flex items-center gap-1 text-indigo-500 font-medium">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
                Renseignez les champs surlignés
              </span>
            </p>
          </div>
          <button class="text-gray-400 hover:text-gray-600 transition-colors" @click="closePreview">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="px-6 pt-5 flex-1">
          <div class="bg-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            <div class="flex items-center gap-5 px-4 py-2 bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 flex-wrap">
              <span class="flex items-center gap-1.5"><span class="inline-block w-2.5 h-2.5 rounded-sm bg-blue-100 border border-blue-300"></span> En-tête</span>
              <span class="flex items-center gap-1.5"><span class="inline-block w-2.5 h-2.5 rounded-sm bg-white border border-slate-300"></span> Corps</span>
              <span class="flex items-center gap-1.5"><span class="inline-block w-2.5 h-2.5 rounded-sm bg-amber-50 border border-amber-200"></span> Pied de page</span>
              <span class="flex items-center gap-1.5 ml-auto">
                <span class="inline-block w-2.5 h-2.5 rounded-sm bg-indigo-100 border border-indigo-400"></span>
                Champ à renseigner
              </span>
            </div>
            <iframe
              ref="previewIframe"
              :srcdoc="previewFullHtml"
              class="w-full bg-white"
              style="min-height: 760px; border: none;"
              sandbox="allow-same-origin allow-scripts"
            />
          </div>
        </div>

        <div class="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl sticky bottom-0 mt-5">
          <p class="text-xs text-slate-400 italic hidden sm:block">
            Renseignez les champs dans l'aperçu, puis transmettez.
          </p>
          <div class="flex gap-3 ml-auto">
            <button
              class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 active:bg-slate-100 transition-colors"
              @click="closePreview"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              Annuler
            </button>
            <button
              class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              :disabled="transmitting"
              @click="transmettre"
            >
              <svg v-if="!transmitting" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
              <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              {{ transmitting ? 'Transmission…' : 'Transmettre' }}
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════════
         MODAL SUPPRESSION
    ══════════════════════════════════════════════════════════ -->
    <UModal v-model="showDeleteModal">
      <div class="p-6">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900">Confirmer la suppression</h3>
            <p class="text-sm text-slate-600 mt-1">Cette action est irréversible</p>
          </div>
        </div>
        <div v-if="deletingModele" class="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4 space-y-2 text-sm">
          <div class="flex items-center justify-between">
            <span class="text-slate-600 font-medium">Code :</span>
            <span class="font-semibold font-mono text-slate-900">{{ deletingModele.code }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-600 font-medium">Libellé :</span>
            <span class="font-semibold text-slate-900">{{ deletingModele.libelle }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-600 font-medium">Type :</span>
            <span class="font-semibold text-slate-900">{{ deletingModele.type_document?.libelle }}</span>
          </div>
        </div>
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p class="text-xs text-yellow-800"><strong>⚠️ Attention :</strong> Suppression définitive.</p>
        </div>
        <div class="flex justify-end gap-3">
          <UButton color="gray" variant="outline" :disabled="deleting" @click="showDeleteModal = false">Annuler</UButton>
          <UButton color="red" :loading="deleting" @click="executeDelete">Supprimer définitivement</UButton>
        </div>
      </div>
    </UModal>

  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onActivated, onBeforeUnmount } from 'vue'

const config = useRuntimeConfig()

// ── State ──────────────────────────────────────────────────────
const modeles       = ref([])
const typeDocuments = ref([])
const loading       = ref(false)
const loadingTypes  = ref(false)
const error         = ref(null)
const viewMode      = ref('grid')
const activeMenu    = ref(null)

const filters = reactive({ search: '', type_document_id: '' })

// Form modal
const showFormModal = ref(false)
const editingModele = ref(null)
const submitting    = ref(false)
const errors        = ref({})
const formError     = ref(null)

// Preview modal
const showPreviewModal = ref(false)
const previewModele    = ref(null)
const previewFullHtml  = ref('')
const previewIframe    = ref(null)
const transmitting     = ref(false)

// Delete modal
const showDeleteModal = ref(false)
const deletingModele  = ref(null)
const deleting        = ref(false)

// ── URL de base ───────────────────────────────────────────────
const appOrigin = typeof window !== 'undefined' ? window.location.origin : ''

// ── Auth ──────────────────────────────────────────────────────
const getToken   = () => localStorage.getItem('auth_token')
const getHeaders = () => ({
  'Authorization': `Bearer ${getToken()}`,
  'Accept': 'application/json',
})

// ── Style commun pour les inputs dans l'iframe ────────────────
// Chaque champ input[data-field] reçoit ce style inline :
//   - fond indigo très léger pour signaler visuellement le champ
//   - bordure basse tiretée indigo
//   - pas de bordure native, pas d'outline par défaut
//   - au focus : fond blanc + outline indigo
const INPUT_STYLE = `
  display:inline-block;
  border:none;
  border-bottom:1.5px dashed #6366f1;
  background:#eef2ff;
  border-radius:3px 3px 0 0;
  padding:1px 4px;
  font-family:inherit;
  font-size:inherit;
  font-weight:inherit;
  color:#1a1a2e;
  outline:none;
  transition:background .15s;
`

// ══════════════════════════════════════════════════════════════
//  TEMPLATES PRÉ-DÉFINIS
// ══════════════════════════════════════════════════════════════
const TEMPLATES_PREDEFINIS = computed(() => ({
  'attestation': {

    // ─── EN-TÊTE ──────────────────────────────────────────────
    entete_html: `<table width="100%" cellpadding="0" cellspacing="0"
      style="font-family:Arial,sans-serif; font-size:10px;
             border-bottom:1.5px solid #bbb; padding:8px 16px 6px; background:#fff;">
  <tr>

    <!-- ═══ Colonne gauche ═══ -->
    <td width="40%" valign="top">

      <!-- Armoiries -->
      <div style="display:flex; align-items:flex-start; gap:8px;">
        <img src="${appOrigin}/images/MEF.png" alt="Armoiries du Bénin"
             style="height:62px; flex-shrink:0;" />
      </div>

      <!-- Direction -->
      <div style="border-bottom:1px solid #111; text-align:center; width:55%;
                  margin:6px 0 0 50px; font-size:8.5px; font-weight:400;
                  color:#111; line-height:1.6; padding-bottom:2px;">
        <div><span>-&nbsp;-</span></div>
        DIRECTION GÉNÉRALE DU MATÉRIEL<br>ET DE LA LOGISTIQUE
      </div>

      <!-- Titre signataire — centré sous le bloc direction -->
      <div style="width:55%; margin-left:50px; margin-top:4px;
                  font-size:11px; font-weight:bold; text-align:center;
                  font-family:Arial,sans-serif;">
        Le Directeur Général
      </div>

      <!-- Espace signature physique -->
      <div style="height:26px;"></div>

      <!-- N° de référence avec input placeholder -->
      <div style="font-size:11px; font-family:Arial,sans-serif; white-space:nowrap;">
  N°&nbsp;
  <input type="text"
         data-field="numero"
         placeholder="N° référence"
         style="display:inline-block; width:60px; border:none; border-bottom:1px solid #000;" />
  /MEF/SGM/DGML/DGR/SAP/SA
</div>
    </td>

    <!-- ═══ Colonne centre : logo AB ═══ -->
    <td width="20%" valign="top" align="center" style="padding-top:4px;">
      <img src="${appOrigin}/images/logoAB.png" alt="AB Certification ISO 9001:2015"
           style="height:62px;" />
    </td>

    <!-- ═══ Colonne droite : logo DGML + date ═══ -->
    <td width="40%" valign="top" align="right">
      <img src="${appOrigin}/images/logo_dgml.png" alt="Logo DGML"
           style="height:62px;" />
      <div style="margin-top:12px; font-size:11px; font-family:Arial,sans-serif; text-align:right;">
        Cotonou, le&nbsp;<input
          type="text"
          data-field="date_document"
          placeholder="jj mois aaaa"
          style="${INPUT_STYLE} min-width:110px; text-align:center;"
        />
      </div>
    </td>

  </tr>
</table>`,

    // ─── CORPS ────────────────────────────────────────────────
    // Tous les champs dynamiques remplacés par <input data-field placeholder>
    // signataire_nom  → valeur par défaut : "Raoufou MAMAM"
    // signataire_titre → valeur par défaut : "Directeur Général du Matériel et de la Logistique du Ministère de l'Economie et des Finances"
    template_html: `<div style="font-family:'Bookman Old Style',Bookman,'URW Bookman L',serif;
          font-size:13.5px; line-height:1.85; text-align:justify; padding:0 10px;">

  <!-- Titre parchemin -->
  <div style="text-align:center; margin:22px 0 26px;">
    <div style="display:inline-block; position:relative;
                border:2.5px solid #111; border-radius:5px;
                padding:12px 52px; background:#fff;">
      <svg style="position:absolute;left:-22px;top:50%;transform:translateY(-50%);"
           width="24" height="48" viewBox="0 0 24 48" fill="none">
        <path d="M20 4 C4 4 4 24 20 24 C4 24 4 44 20 44" stroke="#111" stroke-width="2.2" fill="none"/>
      </svg>
      <svg style="position:absolute;right:-22px;top:50%;transform:translateY(-50%) scaleX(-1);"
           width="24" height="48" viewBox="0 0 24 48" fill="none">
        <path d="M20 4 C4 4 4 24 20 24 C4 24 4 44 20 44" stroke="#111" stroke-width="2.2" fill="none"/>
      </svg>
      <div style="font-size:16px;font-weight:900;letter-spacing:1.2px;
                  text-transform:uppercase;color:#111;line-height:1.3;">
        ATTESTATION DE BONNE FIN<br>D'EXÉCUTION
      </div>
    </div>
  </div>

  <!-- Corps principal -->
  <p style="text-indent:40px; margin-bottom:16px;">
    Je soussigné,&nbsp;<strong><input
      type="text"
      data-field="signataire_nom"
      value="Raoufou MAMAM"
      placeholder="Nom du signataire"
      style="${INPUT_STYLE} min-width:140px; font-weight:bold;"
    /></strong>,
    <strong><input
      type="text"
      data-field="signataire_titre"
      value="Directeur Général du Matériel et de la Logistique du Ministère de l'Economie et des Finances"
      placeholder="Titre / fonction du signataire"
      style="${INPUT_STYLE} min-width:260px; font-weight:bold;"
    /></strong>,
    atteste par la présente que
    <strong><input
      type="text"
      data-field="beneficiaire_civilite"
      placeholder="Civilité (M. / Mme)"
      style="${INPUT_STYLE} min-width:60px; font-weight:bold;"
    />&nbsp;<input
      type="text"
      data-field="beneficiaire_nom"
      placeholder="Nom complet du bénéficiaire"
      style="${INPUT_STYLE} min-width:160px; font-weight:bold;"
    /></strong>,
    <input
      type="text"
      data-field="beneficiaire_qualite"
      placeholder="Qualité / statut du bénéficiaire"
      style="${INPUT_STYLE} min-width:160px;"
    />,
    et directeur du cabinet
    <strong><input
      type="text"
      data-field="cabinet"
      placeholder="Nom du cabinet"
      style="${INPUT_STYLE} min-width:140px; font-weight:bold;"
    /></strong>,
    a exécuté en qualité de
    <input
      type="text"
      data-field="role_execute"
      placeholder="Rôle exécuté (ex : formateur)"
      style="${INPUT_STYLE} min-width:160px;"
    />,
    une session de formation sur des modules&nbsp;:
    «&nbsp;<strong><input
      type="text"
      data-field="intitule_formation"
      placeholder="Intitulé de la formation"
      style="${INPUT_STYLE} min-width:200px; font-weight:bold;"
    /></strong>&nbsp;»
    au profit des
    <input
      type="text"
      data-field="beneficiaires_groupe"
      placeholder="Groupe bénéficiaire (ex : agents de la DGML)"
      style="${INPUT_STYLE} min-width:200px;"
    />
    sur la période du
    <strong><input
      type="text"
      data-field="date_debut"
      placeholder="Date de début"
      style="${INPUT_STYLE} min-width:100px; font-weight:bold;"
    /></strong>
    au
    <strong><input
      type="text"
      data-field="date_fin"
      placeholder="Date de fin"
      style="${INPUT_STYLE} min-width:100px; font-weight:bold;"
    /></strong>.
  </p>

  <p style="text-indent:40px; margin-bottom:16px;">
    Il a réalisé avec professionnalisme et dévotion ces prestations
    conformément à nos attentes.
  </p>

  <p style="text-indent:40px; margin-bottom:14px;">
    En foi de quoi, la présente attestation lui est délivrée pour
    servir et valoir ce que de droit.
  </p>

  <!-- Bloc signature -->
  <div style="text-align:right; padding-right:40px; margin-top:6px;">
    <div style="position:relative; display:inline-block; text-align:center;">
      <img src="{{cachet}}" alt="Cachet"
           style="position:absolute;left:-40px;top:-10px;height:85px;opacity:0.80;z-index:1;"
           onerror="this.style.display='none'" />
      <img src="{{signature}}" alt="Signature"
           style="position:relative;height:55px;z-index:2;"
           onerror="this.style.display='none'" />
    </div>
    <div style="font-weight:bold;font-size:13.5px;margin-top:4px;">
      <input
        type="text"
        data-field="signataire_nom_bas"
        value="Raoufou MAMAM"
        placeholder="Nom du signataire (bas de page)"
        style="${INPUT_STYLE} min-width:160px; font-weight:bold; text-align:center;"
      />
    </div>
  </div>

</div>`,

    // ─── PIED DE PAGE ─────────────────────────────────────────
    pied_page_html: `<div style="font-family:Arial,sans-serif;
          border-top:1.5px solid #aaa; padding-top:5px;
          text-align:center; font-size:9px; color:#333; line-height:1.5;
          background:#fafafa;">
  <div style="margin-bottom:2px; color:#ccc; letter-spacing:3px; font-size:7.5px;">— — —</div>
  368, Avenue Pape Jean Paul II, 01 BP 302 Cotonou
  &nbsp;&#9742;&nbsp;21 30 61 69 / 21 30 85 20<br>
  &#9993;&nbsp;secretariat.dgml@finances.bj
  &nbsp;–&nbsp;secretariat@dgml.bj
  &nbsp;–&nbsp;<strong>www.dgml.bj</strong><br>
  <em>Certifié ISO 9001 : 2015</em>
</div>`,
  },
}))

// ─────────────────────────────────────────────────────────────
const getTemplatePourType = (typeId) => {
  const type = typeDocuments.value.find(t => t.id === typeId)
  if (!type) return {}
  const libelle = (type.libelle || '').toLowerCase()
  for (const [cle, tpl] of Object.entries(TEMPLATES_PREDEFINIS.value)) {
    if (libelle.includes(cle)) return tpl
  }
  return {}
}

const defaultForm = () => ({
  type_document_id: '',
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
const form = reactive(defaultForm())

watch(
  () => form.type_document_id,
  (newTypeId) => {
    if (editingModele.value) return
    if (!newTypeId) return
    const tpl = getTemplatePourType(newTypeId)
    if (!tpl.template_html) return
    if (!form.template_html)  form.template_html  = tpl.template_html
    if (!form.entete_html)    form.entete_html    = tpl.entete_html    ?? ''
    if (!form.pied_page_html) form.pied_page_html = tpl.pied_page_html ?? ''
  }
)

// ── API calls ─────────────────────────────────────────────────
const loadTypeDocuments = async () => {
  loadingTypes.value = true
  try {
    const res = await $fetch(`${config.public.apiBase}/type_documents`, { method: 'GET', headers: getHeaders() })
    if (res?.data?.data && Array.isArray(res.data.data))       typeDocuments.value = res.data.data
    else if (res?.data && Array.isArray(res.data))             typeDocuments.value = res.data
    else if (Array.isArray(res))                               typeDocuments.value = res
    else                                                       typeDocuments.value = []
  } catch (err) {
    useToast().add({ title: 'Erreur', description: 'Impossible de charger les types', color: 'red' })
  } finally { loadingTypes.value = false }
}

const loadModeles = async () => {
  loading.value = true
  error.value   = null
  try {
    const params = new URLSearchParams()
    if (filters.search)           params.set('search', filters.search)
    if (filters.type_document_id) params.set('type_document_id', filters.type_document_id)
    const res = await $fetch(`${config.public.apiBase}/modeles-document?${params}`, { method: 'GET', headers: getHeaders() })
    if (res?.data?.data && Array.isArray(res.data.data))       modeles.value = res.data.data
    else if (res?.data && Array.isArray(res.data))             modeles.value = res.data
    else if (Array.isArray(res))                               modeles.value = res
    else                                                       modeles.value = []
  } catch (err) {
    error.value = err.message || 'Erreur de chargement'
    if (err.status === 401 || err.statusCode === 401) {
      useToast().add({ title: 'Session expirée', color: 'red' })
      setTimeout(() => navigateTo('/login'), 1500)
    }
  } finally { loading.value = false }
}

// ── CRUD ──────────────────────────────────────────────────────
function openCreateModal() {
  editingModele.value = null
  Object.assign(form, defaultForm())
  errors.value = {}; formError.value = null
  showFormModal.value = true
}

function openEdit(modele) {
  editingModele.value = modele
  Object.assign(form, {
    type_document_id: modele.type_document_id, code: modele.code,
    libelle: modele.libelle, template_html: modele.template_html,
    entete_html: modele.entete_html ?? '', pied_page_html: modele.pied_page_html ?? '',
    orientation: modele.orientation, format_page: modele.format_page,
    marge_haut: modele.marge_haut, marge_bas: modele.marge_bas,
    marge_gauche: modele.marge_gauche, marge_droite: modele.marge_droite,
    signataire: modele.signataire ?? '', fonction_signataire: modele.fonction_signataire ?? '',
    est_actif: modele.est_actif, est_defaut: modele.est_defaut,
  })
  errors.value = {}; formError.value = null; activeMenu.value = null
  showFormModal.value = true
}

function closeFormModal() { showFormModal.value = false; editingModele.value = null }

async function submitForm() {
  submitting.value = true; errors.value = {}; formError.value = null
  const url    = editingModele.value
    ? `${config.public.apiBase}/modeles-document/${editingModele.value.id}`
    : `${config.public.apiBase}/modeles-document`
  const method = editingModele.value ? 'PUT' : 'POST'
  try {
    await $fetch(url, { method, headers: { ...getHeaders(), 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    useToast().add({ title: 'Succès', description: editingModele.value ? 'Modèle mis à jour !' : 'Modèle créé !', color: 'green' })
    closeFormModal(); await loadModeles()
  } catch (err) {
    if (err.status === 422 || err.statusCode === 422) {
      errors.value = err.data?.errors ?? {}; formError.value = err.data?.message || 'Erreurs de validation.'
    } else {
      formError.value = err.data?.message || err.message || 'Erreur serveur'
      useToast().add({ title: 'Erreur', description: formError.value, color: 'red' })
    }
  } finally { submitting.value = false }
}

function openDeleteModal(modele) { deletingModele.value = modele; showDeleteModal.value = true; activeMenu.value = null }

async function executeDelete() {
  if (!deletingModele.value) return
  deleting.value = true
  try {
    await $fetch(`${config.public.apiBase}/modeles-document/${deletingModele.value.id}`, { method: 'DELETE', headers: getHeaders() })
    useToast().add({ title: 'Succès', description: `"${deletingModele.value.libelle}" supprimé.`, color: 'green' })
    showDeleteModal.value = false; deletingModele.value = null; await loadModeles()
  } catch (err) {
    useToast().add({ title: 'Erreur', description: err.data?.message || 'Erreur suppression', color: 'red' })
  } finally { deleting.value = false }
}

// ══════════════════════════════════════════════════════════════
//  PRÉVISUALISATION
// ══════════════════════════════════════════════════════════════
function buildFullPreviewHtml(modele) {
  if (!modele) return ''
  const mH = modele.marge_haut   ?? 20
  const mB = modele.marge_bas    ?? 10
  const mG = modele.marge_gauche ?? 25
  const mD = modele.marge_droite ?? 25

  const entete   = modele.entete_html    ?? ''
  const corps    = modele.template_html  ?? ''
  const piedPage = modele.pied_page_html ?? ''

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <style>
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
    body {
      font-family:'Bookman Old Style',Bookman,'URW Bookman L',serif;
      font-size:13.5px; color:#1a1a2e; background:#fff;
      width:210mm; min-height:297mm;
      display:flex; flex-direction:column;
    }
    .doc-header { padding:${mH}px ${mD}px 6px ${mG}px; background:#fff; flex-shrink:0; }
    .doc-body   { flex:1; padding:6px ${mD}px 2px ${mG}px; }
    .doc-footer { padding:2px ${mD}px ${mB}px ${mG}px; background:#fafafa; flex-shrink:0; }

    /* ── Styles globaux des champs input dans l'iframe ── */
    input[data-field] {
      border: none;
      border-bottom: 1.5px dashed #6366f1;
      background: #eef2ff;
      border-radius: 3px 3px 0 0;
      padding: 1px 4px;
      font-family: inherit;
      font-size: inherit;
      color: #1a1a2e;
      outline: none;
      transition: background .15s, border-color .15s;
      vertical-align: baseline;
    }
    input[data-field]:hover {
      background: #e0e7ff;
    }
    input[data-field]:focus {
      background: #fff;
      border-bottom-color: #4f46e5;
      outline: none;
    }
    /* Placeholder en italic grisé */
    input[data-field]::placeholder {
      color: #94a3b8;
      font-style: italic;
      font-weight: normal;
    }
  </style>
</head>
<body>
  <div class="doc-header">${entete}</div>
  <div class="doc-body">${corps}</div>
  <div class="doc-footer">${piedPage}</div>
</body>
</html>`
}

function openPreview(modele) {
  previewModele.value    = modele
  previewFullHtml.value  = buildFullPreviewHtml(modele)
  activeMenu.value       = null
  showPreviewModal.value = true
}

function closePreview() {
  showPreviewModal.value = false
  previewModele.value    = null
  previewFullHtml.value  = ''
}

/**
 * Collecte les valeurs des input[data-field] ET des span[data-field]
 * (rétrocompatibilité si des anciens modèles contenteditable existent encore en base)
 */
async function transmettre() {
  transmitting.value = true
  try {
    const iframeDoc = previewIframe.value?.contentDocument
    const donnees   = {}
    if (iframeDoc) {
      iframeDoc.querySelectorAll('[data-field]').forEach(el => {
        const key = el.getAttribute('data-field')
        if (!key) return
        // input → .value  |  contenteditable span → .innerText
        donnees[key] = (el.tagName === 'INPUT' ? el.value : el.innerText).trim()
      })
    }

    await $fetch(
      `${config.public.apiBase}/modeles-document/${previewModele.value.id}/transmettre`,
      {
        method: 'POST',
        headers: { ...getHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ donnees }),
      }
    )
    useToast().add({ title: 'Transmis avec succès', description: 'Le document a été transmis.', color: 'green' })
    closePreview()
  } catch (err) {
    useToast().add({
      title: 'Erreur de transmission',
      description: err.data?.message || err.message || 'Erreur serveur',
      color: 'red',
    })
  } finally { transmitting.value = false }
}

// ── UI helpers ────────────────────────────────────────────────
function toggleMenu(id) { activeMenu.value = activeMenu.value === id ? null : id }

function rechargerTemplate() {
  const tpl = getTemplatePourType(form.type_document_id)
  if (!tpl.template_html) return
  form.entete_html    = tpl.entete_html    ?? ''
  form.template_html  = tpl.template_html
  form.pied_page_html = tpl.pied_page_html ?? ''
  if (editingModele.value) {
    useToast().add({ title: 'Template réinitialisé', description: 'Sauvegardez pour persister.', color: 'amber' })
  }
}

function insertVariable() {
  const v = prompt('Nom de la variable :')
  if (v) form.template_html += `{{${v}}}`
}

function closeMenuOnOutside(e) {
  if (!e.target.closest('[data-menu]')) activeMenu.value = null
}

// ── Lifecycle ─────────────────────────────────────────────────
onMounted(async () => {
  await Promise.all([loadModeles(), loadTypeDocuments()])
  document.addEventListener('click', closeMenuOnOutside)
})
onActivated(async () => { await Promise.all([loadModeles(), loadTypeDocuments()]) })
onBeforeUnmount(() => { document.removeEventListener('click', closeMenuOnOutside) })
</script>