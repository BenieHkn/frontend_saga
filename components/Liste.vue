<template>
  <div class="min-h-screen bg-slate-100 p-6 font-sans">
    <UModal v-model="detailsOpen" :ui="{ width: 'sm:max-w-5xl' }">
      <div v-if="selectedCourrier" class="flex flex-col max-h-[90vh] bg-white rounded-xl overflow-hidden">
        <!-- ── En-tête modal ── -->
        <div class="relative flex items-center justify-between px-6 py-4 shrink-0 overflow-hidden"
          style="background: linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%);">
          <div class="absolute inset-0 opacity-10"
            style="background-image: radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px); background-size: 32px 32px;"></div>
          <div class="relative flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner border border-white/30">
              <Icon name="i-heroicons-envelope-open" class="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 class="text-base font-bold text-white leading-tight">Détails du courrier arrivé</h2>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="text-xs text-indigo-200 font-medium">N° {{ selectedCourrier.document?.numero_enreg || '—' }}</span>
              </div>
            </div>
          </div>
          <button @click="closeDetails"
            class="relative w-8 h-8 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 transition-all text-white border border-white/20">
            <Icon name="i-heroicons-x-mark" class="w-4 h-4" />
          </button>
        </div>

        <!-- ── Corps ── -->
        <div class="overflow-y-auto flex-1 p-5 space-y-4 bg-slate-50/50">
          <!-- Section principale -->
          <section class="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
            <!-- Header avec bouton document arrivé -->
            <div class="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-slate-100">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Icon name="i-heroicons-inbox-arrow-down" class="w-3.5 h-3.5 text-indigo-600" />
                </div>
                <span class="text-[11px] font-bold text-indigo-700 uppercase tracking-widest">Courrier arrivé</span>
                <span v-if="selectedCourrier.priority"
                  class="inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full border uppercase ml-1"
                  :class="{
                    'bg-red-50 text-red-700 border-red-200': selectedCourrier.priority?.toLowerCase() === 'urgent',
                    'bg-amber-50 text-amber-700 border-amber-200': selectedCourrier.priority?.toLowerCase() === 'important',
                    'bg-sky-50 text-sky-700 border-sky-200': !selectedCourrier.priority || selectedCourrier.priority?.toLowerCase() === 'standard',
                  }">{{ selectedCourrier.priority || 'STANDARD' }}</span>
                <span v-if="selectedCourrier.document?.reponse"
                  class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ml-1">
                  <Icon name="i-heroicons-check-circle" class="w-3 h-3" /> Répondu
                </span>
                <span v-else
                  class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200 ml-1">
                  <Icon name="i-heroicons-clock" class="w-3 h-3" /> En attente
                </span>
              </div>

              <!-- Bouton document arrivé -->
              <div v-if="selectedCourrier.document?.url && selectedCourrier.document.url !== 'Inconnu'">
                <button
                  v-if="!arriveeFileLoaded && !arriveeFileLoading && !arriveeFileError"
                  @click="loadArriveeFile"
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
                <div class="group flex items-stretch gap-0 rounded-xl overflow-hidden border border-indigo-100 hover:border-indigo-200 transition-colors">
                  <div class="w-1 shrink-0 bg-gradient-to-b from-indigo-400 to-indigo-600"></div>
                  <div class="flex-1 p-3 bg-gradient-to-r from-indigo-50 to-transparent">
                    <p class="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-0.5">Référence</p>
                    <p class="text-sm font-bold text-indigo-900">{{ selectedCourrier.document?.reference || 'Sans référence' }}</p>
                  </div>
                </div>
                <div class="group flex items-stretch gap-0 rounded-xl overflow-hidden border border-amber-100 hover:border-amber-200 transition-colors">
                  <div class="w-1 shrink-0 bg-gradient-to-b from-amber-400 to-orange-500"></div>
                  <div class="flex-1 p-3 bg-gradient-to-r from-amber-50 to-transparent">
                    <p class="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-0.5">Objet</p>
                    <p class="text-sm text-gray-800 leading-relaxed">{{ selectedCourrier.document?.objet || 'Non spécifié' }}</p>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                <div class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>Source
                  </p>
                  <p class="text-xs font-semibold text-slate-800">{{ selectedCourrier.service_enreg || 'N/A' }}</p>
                </div>
                <div class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>Structure / Usager
                  </p>
                  <p class="text-xs text-slate-800">{{ selectedCourrier.structure || selectedCourrier.autre_structure || 'Non spécifié' }}</p>
                </div>
                <div class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>Type d'arrivée
                  </p>
                  <p class="text-xs text-slate-800">{{ selectedCourrier.type_arrivee || 'Non spécifié' }}</p>
                </div>
                <div class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-indigo-300 inline-block"></span>N° enregistrement
                  </p>
                  <p class="text-xs font-semibold text-slate-800">{{ selectedCourrier.document?.numero_enreg || '—' }}</p>
                </div>
                <div class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>Date d'enregistrement
                  </p>
                  <p class="text-xs text-slate-800">{{ formatDate(selectedCourrier.document?.date_enreg) || '—' }}</p>
                </div>
                <div v-if="selectedCourrier.document?.date_courrier" class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>Date du courrier
                  </p>
                  <p class="text-xs text-slate-800">{{ formatDate(selectedCourrier.document?.date_courrier) }}</p>
                </div>
              </div>

              <!-- Preview document arrivé -->
              <div v-if="arriveeFileLoaded" class="mt-2 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                <DocumentRpreview :file-preview-url="ariveeBlobUrl" height="600px" />
              </div>
            </div>
          </section>

          <!-- Section réponse -->
          <section v-if="selectedCourrier.document?.reponse"
            class="bg-white rounded-2xl border border-emerald-200/80 overflow-hidden shadow-sm">
            <!-- Header avec bouton document réponse -->
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

              <!-- Bouton document réponse -->
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
            </div>

            <div v-if="loadingReponse" class="flex items-center justify-center gap-3 py-8 text-slate-400">
              <div class="w-5 h-5 border-2 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
              <span class="text-xs font-medium">Chargement du courrier de réponse...</span>
            </div>

            <div v-else-if="reponseData" class="p-4 space-y-3">
              <div class="grid grid-cols-1 gap-2">
                <div class="group flex items-stretch gap-0 rounded-xl overflow-hidden border border-emerald-100 hover:border-emerald-200 transition-colors">
                  <div class="w-1 shrink-0 bg-gradient-to-b from-emerald-400 to-teal-500"></div>
                  <div class="flex-1 p-3 bg-gradient-to-r from-emerald-50 to-transparent">
                    <p class="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-0.5">Référence</p>
                    <p class="text-sm font-bold text-emerald-900">{{ reponseData.reference || 'Sans référence' }}</p>
                  </div>
                </div>
                <div class="group flex items-stretch gap-0 rounded-xl overflow-hidden border border-slate-100 hover:border-slate-200 transition-colors">
                  <div class="w-1 shrink-0 bg-gradient-to-b from-slate-300 to-slate-400"></div>
                  <div class="flex-1 p-3 bg-gradient-to-r from-slate-50 to-transparent">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Objet</p>
                    <p class="text-sm text-slate-800 leading-relaxed">{{ reponseData.objet || 'Non spécifié' }}</p>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                <div class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-300 inline-block"></span>Destinataire
                  </p>
                  <p class="text-xs font-semibold text-slate-800">{{ reponseData.destinataire || '—' }}</p>
                </div>
                <div class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>Date de départ
                  </p>
                  <p class="text-xs text-slate-800">{{ formatDate(reponseData.date_depart) || '—' }}</p>
                </div>
                <div v-if="reponseData.service_emis" class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>Service émetteur
                  </p>
                  <p class="text-xs text-slate-800">{{ reponseData.service_emis }}</p>
                </div>
                <div v-if="reponseData.type_depart" class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>Type de départ
                  </p>
                  <p class="text-xs text-slate-800">{{ reponseData.type_depart }}</p>
                </div>
              </div>

              <!-- Preview document réponse -->
              <div v-if="reponseFileLoaded" class="mt-2 rounded-xl overflow-hidden border border-emerald-200 shadow-sm">
                <DocumentRpreview :file-preview-url="reponseBlobUrl" height="600px" />
              </div>
            </div>

            <div v-else class="flex items-center gap-2 m-4 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600">
              <Icon name="i-heroicons-exclamation-triangle" class="w-4 h-4 shrink-0" />
              Impossible de charger les détails du courrier de réponse.
            </div>
          </section>
        </div>

        <!-- ── Pied modal ── -->
        <div class="px-6 py-3.5 border-t border-slate-100 shrink-0 flex items-center justify-between bg-white">
          <span class="text-[10px] text-slate-400">{{ selectedCourrier.document?.reference || '' }}</span>
          <UButton color="gray" variant="outline" size="sm" @click="closeDetails">Fermer</UButton>
        </div>
      </div>
    </UModal>

    <UModal v-model="affectationModalOpen" :ui="{ width: 'sm:max-w-3xl' }">
      <div v-if="selectedAffectationItem" class="bg-white rounded-xl overflow-hidden">
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 class="text-base font-bold text-slate-900">Détails du circuit d'affectation</h2>
            <p class="text-xs text-slate-500">Affectation du courrier arrivé</p>
          </div>
          <button @click="closeAffectationDetails"
            class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">
            <Icon name="i-heroicons-x-mark" class="w-4 h-4" />
          </button>
        </div>

        <div class="p-4 space-y-4">
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div class="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div class="text-[10px] uppercase tracking-[0.24em] text-slate-500 mb-1">Référence</div>
              <div class="text-sm font-semibold text-slate-800">{{ selectedAffectationItem.reference || '—' }}</div>
            </div>
            <div class="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div class="text-[10px] uppercase tracking-[0.24em] text-slate-500 mb-1">N° enreg.</div>
              <div class="text-sm font-semibold text-slate-800">{{ selectedAffectationItem.numero_enreg || '—' }}</div>
            </div>
          </div>

          <div class="space-y-3">
            <template v-if="selectedAffectationItem.affectation_circuit?.length">
              <div v-for="(node, idx) in selectedAffectationItem.affectation_circuit" :key="idx"
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

    <PageHeader v-if="!isAdmin()" title="Courriers arrivés" subtitle="Gestion des courriers entrants" btnText="Nouveau" to="/courriers/form_courier_arrive"/>
    <PageHeader v-else title="Courriers arrivés" subtitle="Gestion des courriers entrants"/>

    <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
      <div class="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <span class="text-sm font-medium">Chargement des données...</span>
    </div>

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

    <div v-else>
      <div class="flex items-center justify-end mb-3">
        <PeriodFilter :field="searchFilters.date_field" :from="searchFilters.date_from" :to="searchFilters.date_to" :loading="loading" @change="onPeriodChange" />
      </div>

      <DataTable :data="courriers" :columns="columns" :selectable="false" :default-sort-column="null"
        :show-row-numbers="true" :left-aligned-columns="['reference', 'structure', 'numeroEnregistrement', 'objet']"
        @edit="onEdit" @delete="onDelete" @open-document="onOpenDocument" @selection-change="onSelectionChange"
        :hide-labels-when-input="true">
        <template #advanced-filters="{ filters, onFilter }">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div v-for="field in filterFields" :key="field.id">
              <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                {{ field.label }}
              </label>
              <input v-model="filters[field.id]" placeholder="Filtrer..."
                class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                @input="onFilter" />
            </div>
          </div>
        </template>

        <template #actions="{ item }">
          <div class="flex gap-1.5 justify-end">
            <button @click="handleView(item)" title="Voir les détails"
              class="inline-flex items-center justify-center w-8 h-8 bg-amber-50 text-amber-700 border border-amber-100 rounded-md hover:bg-amber-200 hover:text-amber-900 transition-all group">
              <Icon name="i-heroicons-eye" class="w-4 h-4 group-hover:text-yellow-600" />
            </button>
            <button v-if="!isAdmin()" @click="handleQuickAssign(item.id)" title="Affecter ce courrier"
              class="inline-flex items-center justify-center w-8 h-8 bg-sky-50 text-sky-700 border border-sky-100 rounded-md hover:bg-sky-200 hover:text-sky-900 transition-all group">
              <Icon name="i-heroicons-paper-airplane" class="w-4 h-4 group-hover:text-blue-600" />
            </button>
            <button v-if="!item._complete?.document?.reponse && !isAdmin()" @click="handleReply(item)"
              title="Répondre au courrier"
              class="inline-flex items-center justify-center w-8 h-8 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md hover:bg-emerald-200 hover:text-emerald-900 transition-all group">
              <Icon name="i-heroicons-arrow-uturn-right" class="w-4 h-4 group-hover:text-green-600" />
            </button>
            <div v-else-if="!isAdmin()" title="Ce courrier a déjà une réponse"
              class="inline-flex items-center justify-center w-8 h-8 bg-green-50 text-green-500 border border-green-100 rounded-md cursor-default">
              <Icon name="i-heroicons-check-circle" class="w-4 h-4" />
            </div>
            <div v-if="item.isAffected" class="relative" @mouseenter="openAffectationPreview($event, item)" @mouseleave="closeAffectationPreview">
              <button @click="openAffectationDetails(item)" type="button"
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
            <button v-if="isAdmin()" @click="onEdit(item)" title="Modifier ce courrier"
              class="inline-flex items-center justify-center w-8 h-8 bg-sky-50 text-sky-700 border border-sky-100 rounded-md hover:bg-sky-200 hover:text-sky-900 transition-all group">
              <Icon name="i-heroicons-pencil" class="w-4 h-4 group-hover:text-blue-600" />
            </button>
            <button v-if="isAdmin()" @click="onDelete(item)" title="Supprimer ce courrier"
              class="inline-flex items-center justify-center w-8 h-8 bg-red-50 text-red-700 border border-red-100 rounded-md hover:bg-red-200 hover:text-red-900 transition-all group">
              <Icon name="i-heroicons-trash" class="w-4 h-4 group-hover:text-red-600" />
            </button>
          </div>
        </template>

        <template #cell-source="{ value }">
          <span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
            {{ value }}
          </span>
        </template>

        <!-- Référence cliquable → ouvre la modal (pas window.open) -->
        <template #cell-reference="{ value, item }">
          <button v-if="item._complete?.document?.url && item._complete.document.url !== 'Inconnu'"
            @click="handleView(item)"
            class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-all group max-w-[160px]"
            :title="`Voir le document ${value}`">
            <Icon name="i-heroicons-document-text" class="w-3.5 h-3.5 shrink-0 group-hover:scale-110 transition-transform" />
            <span class="truncate">{{ value }}</span>
            <Icon name="i-heroicons-eye" class="w-3 h-3 shrink-0 opacity-60 group-hover:opacity-100" />
          </button>
          <span v-else class="inline-flex items-center px-2.5 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md max-w-[160px]" :title="value">
            <Icon name="i-heroicons-document-text" class="w-3.5 h-3.5 mr-1.5 shrink-0 opacity-50" />
            <span class="truncate">{{ value || '—' }}</span>
          </span>
        </template>

        <template #cell-priority="{ value }">
          <span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border uppercase" :class="{
            'bg-red-50 text-red-700 border-red-100': value?.toLowerCase() === 'urgent',
            'bg-amber-50 text-amber-700 border-amber-100': value?.toLowerCase() === 'important',
            'bg-sky-50 text-sky-700 border-sky-100': value?.toLowerCase() === 'standard',
          }">
            {{ value || 'STANDARD' }}
          </span>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DataTable from '~/components/DataTable.vue'
import DocumentRpreview from '~/components/DocumentRpreview.vue'
import PeriodFilter from '~/components/PeriodFilter.vue'
import { useAffectationsStore } from '~/stores/affectations'
import { useCourriersStore } from '~/stores/courriers'
import { useAuth } from '~/composables/auth/useAuth'
import Swal from 'sweetalert2'

const props = defineProps({
  entiteId: { type: Number, default: null }
})

const store          = useAffectationsStore()
const courriersStore = useCourriersStore()
const config         = useRuntimeConfig()
const { isAdmin, isSP, isSA, isSecDir, getDirecteurEntiteUserId } = useAuth()

const filterFields = [
  { id: 'source',      label: 'Source' },
  { id: 'structure',   label: 'Structure / Usager' },
  { id: 'objet',       label: 'Objet' },
  { id: 'type_arrivee',label: "Type d'arrivée" },
]

const searchFilters = ref({ date_from: '', date_to: '', date_field: 'date_enreg' })

// ── État table ────────────────────────────────────────────────────────────────
const courriers = ref([])
const loading   = ref(false)
const error     = ref(null)

// ── Colonnes ──────────────────────────────────────────────────────────────────
const columns = [
  { key: 'source',              label: 'Source',              visible: true,  type: 'badge', inputHidden: true },
  { key: 'reference',           label: 'Référence',           visible: true,  inputWidth: '80px', inputPlaceholder: 'Réf...' },
  { key: 'numeroEnregistrement',label: "N° d'enreg.",         visible: true,  showLabel: false, inputPlaceholder: 'Enreg...' },
  { key: 'objet',               label: 'Objet',               visible: true },
  { key: 'date_enregistrement', label: "Date d'enregistrement",visible: false },
  { key: 'date_courrier',       label: 'Date du Courrier',    visible: false },
  { key: 'url',                 label: 'Document',            visible: false, type: 'document' },
  { key: 'type_arrivee',        label: "Type d'arrivée",      visible: false },
  { key: 'priority',            label: 'Priorité',            visible: true,  type: 'badge' },
  { key: 'structure',           label: 'Structure / Usager',  visible: true },
]

// ── Modal ─────────────────────────────────────────────────────────────────────
const detailsOpen      = ref(false)
const selectedCourrier = ref(null)
const loadingReponse   = ref(false)
const reponseData      = ref(null)

// État fichier document arrivé
const arriveeFileLoaded  = ref(false)
const arriveeFileLoading = ref(false)
const arriveeFileError   = ref('')
const ariveeBlobUrl      = ref('')

// État fichier document réponse
const reponseFileLoaded  = ref(false)
const reponseFileLoading = ref(false)
const reponseFileError   = ref('')
const reponseBlobUrl     = ref('')

// Affectation
const tooltipStyle = ref({})
const hoveredAffectationItemId = ref(null)
const affectationModalOpen = ref(false)
const selectedAffectationItem = ref(null)

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

// ── Construction URL API : {apiBase}/file/documents/{year}/{month}/{day}/{filename} ──
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

// ── Libérer tous les blobs de la modal ───────────────────────────────────────
const revokeModalBlobs = () => {
  if (ariveeBlobUrl.value)  { URL.revokeObjectURL(ariveeBlobUrl.value);  ariveeBlobUrl.value  = '' }
  if (reponseBlobUrl.value) { URL.revokeObjectURL(reponseBlobUrl.value); reponseBlobUrl.value = '' }
}

// ── Charger le fichier arrivé ─────────────────────────────────────────────────
const loadArriveeFile = async () => {
  const rawUrl    = selectedCourrier.value?.document?.url
  const dateEnreg = selectedCourrier.value?.document?.date_enreg
  if (!rawUrl || rawUrl === 'Inconnu') return
  arriveeFileLoading.value = true
  arriveeFileLoaded.value  = false
  arriveeFileError.value   = ''
  if (ariveeBlobUrl.value) { URL.revokeObjectURL(ariveeBlobUrl.value); ariveeBlobUrl.value = '' }
  try {
    const { blob }          = await fetchFileAsBlob(rawUrl, dateEnreg)
    ariveeBlobUrl.value     = URL.createObjectURL(blob)
    arriveeFileLoaded.value = true
  } catch (err) {
    console.error('❌ Erreur chargement fichier arrivé:', err)
    arriveeFileError.value = err.message || 'Erreur lors du chargement'
  } finally {
    arriveeFileLoading.value = false
  }
}

// ── Charger le fichier de réponse ─────────────────────────────────────────────
const loadReponseFile = async () => {
  const rawUrl    = reponseData.value?.rawUrl
  const dateEnreg = reponseData.value?.rawDateEnreg
  if (!rawUrl) return
  reponseFileLoading.value = true
  reponseFileLoaded.value  = false
  reponseFileError.value   = ''
  if (reponseBlobUrl.value) { URL.revokeObjectURL(reponseBlobUrl.value); reponseBlobUrl.value = '' }
  try {
    const { blob }          = await fetchFileAsBlob(rawUrl, dateEnreg)
    reponseBlobUrl.value    = URL.createObjectURL(blob)
    reponseFileLoaded.value = true
  } catch (err) {
    console.error('❌ Erreur chargement fichier réponse:', err)
    reponseFileError.value = err.message || 'Erreur lors du chargement'
  } finally {
    reponseFileLoading.value = false
  }
}

// ── Transform — on garde uniquement le nom brut dans url ─────────────────────
const transformCourriers = (response) => {
  if (!response?.data) throw new Error('Format de réponse API invalide')
  return response.data.map((courrier) => ({
    id:                   courrier.id,
    source:               courrier.service_enreg || '',
    numeroEnregistrement: courrier.document?.numero_enreg || '',
    reference:            courrier.document?.reference    || '',
    structure:            courrier.structure || courrier.autre_structure || '',
    date_enregistrement:  formatDate(courrier.document?.date_enreg),
    objet:                courrier.document?.objet        || '',
    date_courrier:        formatDate(courrier.document?.date_courrier),
    url:                  (courrier.document?.url && courrier.document.url !== 'Inconnu')
                            ? courrier.document.url
                            : '',
    type_arrivee:         courrier.type_arrivee || '',
    priority:             courrier.priority     || '',
    document_id:          courrier.document?.id || null,
    affectation_circuit:  [],
    isAffected:           false,
    _complete:            courrier,
  }))
}

// ── Chargement ────────────────────────────────────────────────────────────────
const refresh = async () => {
  loading.value = true
  error.value   = null
  try {
    const authToken = localStorage.getItem('auth_token') || ''
    const params = new URLSearchParams()
    if (searchFilters.value.date_from) params.append('date_from', searchFilters.value.date_from)
    if (searchFilters.value.date_to) params.append('date_to', searchFilters.value.date_to)
    if (searchFilters.value.date_from || searchFilters.value.date_to) params.append('date_field', searchFilters.value.date_field || 'date_enreg')

    const endpointBase = `${config.public.apiBase}/courriers-arrives/urgents-sans-reponse`
    const endpoint = params.toString() ? `${endpointBase}?${params.toString()}` : endpointBase

    const response  = await $fetch(endpoint, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
    courriers.value = transformCourriers(response)
    await loadAffectationCircuits(courriers.value)
  } catch (err) {
    console.error('❌ Erreur chargement courriers arrivés:', err)
    error.value = err.message || 'Erreur lors du chargement'
  } finally {
    loading.value = false
  }
}

const onPeriodChange = ({ field, from, to }) => {
  searchFilters.value.date_field = field
  searchFilters.value.date_from  = from
  searchFilters.value.date_to    = to
  refresh()
}

// ── Modal détails ─────────────────────────────────────────────────────────────
const handleView = async (item) => {
  const courrier = item._complete || item
  revokeModalBlobs()
  selectedCourrier.value   = courrier
  arriveeFileLoaded.value  = false
  arriveeFileLoading.value = false
  arriveeFileError.value   = ''
  reponseFileLoaded.value  = false
  reponseFileLoading.value = false
  reponseFileError.value   = ''
  reponseData.value        = null
  detailsOpen.value        = true

  const reponse = courrier.document?.reponse
  if (reponse) {
    const courierDepartId = reponse.reponse_id
    if (courierDepartId) await loadReponseData(courierDepartId)
  }
}

const closeDetails = () => {
  revokeModalBlobs()
  detailsOpen.value        = false
  selectedCourrier.value   = null
  reponseData.value        = null
  arriveeFileLoaded.value  = false
  arriveeFileError.value   = ''
  reponseFileLoaded.value  = false
  reponseFileError.value   = ''
}

// ── Charger le courrier de réponse ────────────────────────────────────────────
const loadReponseData = async (documentId) => {
  if (!documentId) return
  loadingReponse.value = true
  try {
    const authToken  = localStorage.getItem('auth_token') || ''
    const allDeparts = await $fetch(`${config.public.apiBase}/courriers-departs`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
    const list = Array.isArray(allDeparts?.data) ? allDeparts.data : []
    const doc  = list.find(cd => cd.document_id === documentId) || null
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
    }
  } catch (e) {
    console.error('❌ Erreur chargement réponse:', e)
    reponseData.value = null
  } finally {
    loadingReponse.value = false
  }
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

const loadAffectationCircuits = async (documents) => {
  if (!Array.isArray(documents) || documents.length === 0) return
  const currentUserId = getCurrentUserEffectiveId()
  await Promise.all(documents.map(async (doc) => {
    const circuit = await fetchAffectationCircuit(doc.document_id)
    doc.affectation_circuit = circuit.circuit
    doc.isAffected = computeIsAffectedFromCircuit(circuit.circuit, currentUserId)
  }))
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

  if (!item.affectation_circuit?.length && item.isAffected) {
    const circuit = await fetchAffectationCircuit(item.document_id)
    item.affectation_circuit = circuit.circuit
    item.isAffected = computeIsAffectedFromCircuit(circuit.circuit, getCurrentUserEffectiveId())
  }

  hoveredAffectationItemId.value = item?.id || null
}

const closeAffectationPreview = () => {
  hoveredAffectationItemId.value = null
}

const openAffectationDetails = async (item) => {
  if (!item) return
  selectedAffectationItem.value = item
  if (!item.affectation_circuit?.length && item.isAffected) {
    const circuit = await fetchAffectationCircuit(item.document_id)
    item.affectation_circuit = circuit.circuit
    item.isAffected = computeIsAffectedFromCircuit(circuit.circuit, getCurrentUserEffectiveId())
  }
  affectationModalOpen.value = true
}

const closeAffectationDetails = () => {
  affectationModalOpen.value = false
  selectedAffectationItem.value = null
}

// ── Handlers ──────────────────────────────────────────────────────────────────
const onOpenDocument    = (url) => { /* conservé pour compatibilité DataTable */ }
const onSelectionChange = (ids) => console.log('Sélection:', ids)

const handleQuickAssign = (courrierId) => {
  store.selectCourrierFromQuickAction(courrierId)
  navigateTo('/affectations/create')
}

const handleReply = (item) => {
  const courrier = item._complete || item
  if (courrier.document?.reponse) {
    Swal.fire({ title: 'Déjà répondu', text: 'Ce courrier a déjà reçu une réponse.', icon: 'info', confirmButtonColor: '#2563eb' })
    return
  }
  courriersStore.setCourrierToReply(courrier)
  navigateTo('/courriers/form_courrier_depart')
}

const onEdit = (item) => navigateTo(`/courriers/form_courier_arrive_edit/${item.id}`)

const onDelete = async (item) => {
  const result = await Swal.fire({
    title: 'Confirmer la suppression',
    html: `
      <div class="text-left">
        <p class="mb-3">Êtes-vous sûr de vouloir supprimer ce courrier ?</p>
        <div class="bg-gray-50 rounded-lg p-4 space-y-2">
          <p class="text-sm font-medium text-gray-900">${item.reference}</p>
          <p class="text-xs text-gray-600">${item.objet}</p>
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
    const authToken = localStorage.getItem('auth_token')
    await $fetch(`${config.public.apiBase}/courriers-arrives/${item.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken}` },
    })
    await Swal.fire({ title: 'Supprimé !', text: 'Le courrier a été supprimé avec succès', icon: 'success', timer: 2000, showConfirmButton: false })
    refresh()
  } catch (err) {
    const message           = err.data?.message || err.message || 'Impossible de supprimer le courrier'
    const affectationsCount = err.data?.data?.affectations_count
    await Swal.fire({
      title: 'Suppression impossible',
      html: affectationsCount
        ? `<div class="text-left">
            <p class="mb-3">${message}</p>
            <div class="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p class="text-sm text-orange-800"><strong>${affectationsCount}</strong> affectation(s) associée(s).</p>
              <p class="text-xs text-orange-600 mt-1">Supprimez d'abord les affectations.</p>
            </div>
           </div>`
        : `<p>${message}</p>`,
      icon: 'error',
      confirmButtonColor: '#2563eb',
      confirmButtonText: 'Compris',
    })
  }
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(() => { refresh() })
</script>

<style scoped>
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
:deep(.swal2-cancel):hover { background-color: #4b5563 !important; }
</style>