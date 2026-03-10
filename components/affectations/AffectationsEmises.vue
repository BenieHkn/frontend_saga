<template>
  <!-- En-tête -->
  <div class="flex items-center justify-between mb-6">
    <h1 class="flex items-center gap-3 text-2xl font-bold text-slate-800">
      Affectations
    </h1>
    <div class="flex items-center gap-3">
      <button @click="refreshData"
        class="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all hover:shadow-md">
        <Icon name="i-heroicons-arrow-path" class="w-4 h-4" />
        Actualiser
      </button>
      <UBadge color="blue" v-if="!isAdmin()" variant="soft" size="lg" class="ml-auto">
        <Icon name="i-heroicons-plus" class="h-4 w-4 mr-1" />
        <UButton to="/affectations/create" variant="text" size="sm" class="p-0 m-0 text-blue-600">
          Nouveau
        </UButton>
      </UBadge>
    </div>
  </div>

  <!-- ── Modal détails ── -->
  <UModal v-model="detailsOpen" :ui="{ width: 'sm:max-w-3xl' }">
    <div v-if="selectedAffectation" class="flex flex-col max-h-[90vh] bg-white rounded-xl overflow-hidden">

      <!-- En-tête gradient blue -->
      <div class="relative flex items-center justify-between px-6 py-4 shrink-0 overflow-hidden"
        style="background: linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%);">
        <div class="absolute inset-0 opacity-10"
          style="background-image: radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px); background-size: 32px 32px;"></div>
        <div class="relative flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner border border-white/30">
            <Icon name="i-heroicons-clipboard-document-list" class="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 class="text-base font-bold text-white leading-tight">Détails de l'affectation</h2>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-xs text-blue-200 font-medium">#{{ selectedAffectation.id }}</span>
              <span v-if="selectedAffectation.statut"
                class="inline-flex px-1.5 py-0.5 text-[10px] font-bold rounded-md uppercase border bg-white/20 text-white border-white/30">
                {{ getStatutLabel(selectedAffectation.statut) }}
              </span>
              <span v-if="selectedAffectation.priority"
                class="inline-flex px-1.5 py-0.5 text-[10px] font-bold rounded-md uppercase border"
                :class="{
                  'bg-red-400/30 text-red-100 border-red-300/50': selectedAffectation.priority === 'URGENT',
                  'bg-orange-400/30 text-orange-100 border-orange-300/50': selectedAffectation.priority === 'IMPORTANT',
                  'bg-sky-400/30 text-sky-100 border-sky-300/50': selectedAffectation.priority === 'STANDARD',
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
          <div class="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-50 to-sky-50 border-b border-blue-100">
            <div class="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
              <Icon name="i-heroicons-inbox-arrow-down" class="w-3.5 h-3.5 text-blue-600" />
            </div>
            <span class="text-[11px] font-bold text-blue-700 uppercase tracking-widest">Courrier associé</span>
          </div>

          <div class="p-4 space-y-3">
            <div class="grid grid-cols-1 gap-2">
              <div class="flex items-stretch gap-0 rounded-xl overflow-hidden border border-blue-100 hover:border-blue-200 transition-colors">
                <div class="w-1 shrink-0 bg-gradient-to-b from-blue-400 to-blue-600"></div>
                <div class="flex-1 p-3 bg-gradient-to-r from-blue-50 to-transparent">
                  <p class="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-0.5">Référence</p>
                  <p class="text-sm font-bold text-blue-900">{{ selectedAffectation.reference_courrier || 'Sans référence' }}</p>
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

            <!-- Bouton document -->
            <div class="pt-1">
              <div v-if="selectedAffectation.doc_courrier">
                <button v-if="!showDoc" @click="showDoc = true"
                  class="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-all hover:shadow-sm">
                  <Icon name="i-heroicons-document-arrow-down" class="w-4 h-4" />
                  Charger le document
                </button>
                <div v-else class="mt-2 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                  <DocumentRpreview :file-preview-url="selectedAffectation.doc_courrier" height="400px" />
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
          <div class="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-sky-50 to-cyan-50 border-b border-sky-100">
            <div class="w-6 h-6 rounded-lg bg-sky-100 flex items-center justify-center">
              <Icon name="i-heroicons-clipboard-document-check" class="w-3.5 h-3.5 text-sky-600" />
            </div>
            <span class="text-[11px] font-bold text-sky-700 uppercase tracking-widest">Informations d'affectation</span>
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
              <div v-if="selectedAffectation.date_cloture" class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-green-300 inline-block"></span>Date de clôture
                </p>
                <p class="text-xs text-slate-800">{{ selectedAffectation.date_cloture }}</p>
              </div>
              <div v-if="selectedAffectation.dossier && selectedAffectation.dossier !== '—'" class="p-2.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>Dossier
                </p>
                <p class="text-xs text-slate-800">{{ selectedAffectation.dossier }}</p>
              </div>
            </div>

            <!-- Destinataire -->
            <div class="flex items-stretch gap-0 rounded-xl overflow-hidden border border-sky-100 hover:border-sky-200 transition-colors">
              <div class="w-1 shrink-0 bg-gradient-to-b from-sky-400 to-cyan-500"></div>
              <div class="flex-1 p-3 bg-gradient-to-r from-sky-50 to-transparent">
                <p class="text-[10px] font-bold text-sky-500 uppercase tracking-wider mb-1">Destinataire</p>
                <p class="text-sm font-bold text-slate-800">{{ selectedAffectation.destinataire?.nom || '—' }}</p>
                <p class="text-xs text-slate-500 mt-0.5">{{ selectedAffectation.destinataire?.fonction }}</p>
                <p v-if="selectedAffectation.destinataire?.entite" class="text-xs text-slate-400">{{ selectedAffectation.destinataire.entite }}</p>
              </div>
            </div>

            <!-- Émetteur (admin uniquement) -->
            <div v-if="isAdmin() && selectedAffectation.emetteur?.nom"
              class="flex items-stretch gap-0 rounded-xl overflow-hidden border border-slate-100 hover:border-slate-200 transition-colors">
              <div class="w-1 shrink-0 bg-gradient-to-b from-slate-300 to-slate-400"></div>
              <div class="flex-1 p-3 bg-gradient-to-r from-slate-50 to-transparent">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Émetteur</p>
                <p class="text-sm font-bold text-slate-800">{{ selectedAffectation.emetteur.nom }}</p>
                <p class="text-xs text-slate-500 mt-0.5">{{ selectedAffectation.emetteur.fonction }}</p>
              </div>
            </div>

            <!-- Instructions -->
            <div v-if="selectedAffectation.instructions"
              class="flex items-stretch gap-0 rounded-xl overflow-hidden border border-amber-100 hover:border-amber-200 transition-colors">
              <div class="w-1 shrink-0 bg-gradient-to-b from-amber-400 to-yellow-500"></div>
              <div class="flex-1 p-3 bg-gradient-to-r from-amber-50 to-transparent">
                <p class="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-1.5">Instructions</p>
                <p class="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{{ selectedAffectation.instructions }}</p>
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
        <span class="text-[10px] text-slate-400">Affectation #{{ selectedAffectation.id }}</span>
        <UButton color="gray" variant="outline" size="sm" @click="closeDetails">Fermer</UButton>
      </div>
    </div>
  </UModal>

  <!-- Messages d'erreur -->
  <div v-if="error"
    class="flex items-center gap-3 p-4 mb-5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
    <Icon name="i-heroicons-exclamation-triangle" class="w-5 h-5 flex-shrink-0" />
    <span class="flex-1">{{ error }}</span>
    <button @click="error = null" class="text-lg opacity-60 hover:opacity-100 transition-opacity">✕</button>
  </div>

  <!-- Loader -->
  <div v-if="loading" class="flex flex-col items-center justify-center py-16 gap-4">
    <div class="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
    <p class="text-sm text-slate-500">Chargement des affectations...</p>
  </div>

  <!-- DataTable -->
  <DataTable v-else ref="dataTableRef" :default-sort-column="null" :show-row-numbers="true" :data="tableData"
    :columns="columns" :selectable="false" :default-items-per-page="10" :items-per-page-options="[10, 25, 50, 100]"
    :left-aligned-columns="['instructions', 'objet_courrier', 'reference_courrier']" @edit="handleEdit"
    @delete="handleDelete" @open-document="handleOpenDocument" @selection-change="handleSelectionChange">

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

    <template #actions="{ item }">
      <div class="flex gap-1.5 justify-end">
        <button @click="handleView(item)" title="Voir les détails"
          class="inline-flex items-center justify-center w-8 h-8 bg-amber-50 text-amber-700 border border-amber-100 rounded-md hover:bg-amber-200 hover:text-amber-900 transition-all group">
          <Icon name="i-heroicons-eye" class="w-4 h-4 group-hover:text-yellow-600" />
        </button>
        <button @click="handleQuickAssign(item.courrier_id)" v-if="!isAdmin()" title="Affecter ce courrier"
          class="inline-flex items-center justify-center w-8 h-8 bg-sky-50 text-sky-700 border border-sky-100 rounded-md hover:bg-sky-200 hover:text-sky-900 transition-all group">
          <Icon name="i-heroicons-paper-airplane" class="w-4 h-4 group-hover:text-blue-600" />
        </button>
        <button @click="handleEdit(item)" v-if="!isAdmin()"
          class="inline-flex items-center justify-center w-8 h-8 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md hover:bg-emerald-200 hover:text-emerald-900 transition-all group"
          title="Modifier le destinataire">
          <Icon name="i-heroicons-pencil" class="w-4 h-4 group-hover:text-green-600" />
        </button>
      </div>
    </template>

    <template #cell-objet_courrier="{ value }">
      <span class="block text-xs text-slate-800 leading-relaxed whitespace-normal break-words min-w-[200px]" :title="value">
        {{ value }}
      </span>
    </template>

    <template #cell-reference_courrier="{ value, item }">
      <div class="w-full">
        <button v-if="item.doc_courrier" @click="handleOpenDocument(item.doc_courrier)"
          class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-all group max-w-[180px]"
          :title="`Ouvrir le document ${value}`">
          <Icon name="i-heroicons-document-text" class="w-3.5 h-3.5 shrink-0 group-hover:scale-110 transition-transform" />
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

    <template #selection-actions="{ selected }">
      <button @click="handleBulkDelete(selected)"
        class="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 hover:border-red-300 transition-all">
        <Icon name="i-heroicons-trash" class="w-4 h-4" />
        Supprimer ({{ selected.length }})
      </button>
      <button @click="handleBulkExport(selected)"
        class="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-all">
        <Icon name="i-heroicons-arrow-down-tray" class="w-4 h-4" />
        Exporter ({{ selected.length }})
      </button>
    </template>

    <template #advanced-filters="{ filters, onFilter }">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Date d'affectation</label>
          <input v-model="filters.date_affect" type="date"
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @input="onFilter" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Date de retour attendue</label>
          <input v-model="filters.delai_traitement" type="date"
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @input="onFilter" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Date de clôture</label>
          <input v-model="filters.date_cloture" type="date"
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @input="onFilter" />
        </div>
      </div>
    </template>
  </DataTable>

  <!-- MODAL MODIFICATION DESTINATAIRE -->
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
          selectedNewDestinataire?.id === dest.id ? 'bg-blue-100 border-l-4 border-l-blue-600' : 'hover:bg-gray-50'
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
            <div v-if="selectedNewDestinataire?.id === dest.id">
              <Icon name="i-heroicons-check-circle-solid" class="h-6 w-6 text-blue-600" />
            </div>
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
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '~/composables/auth/useAuth'
import DataTable from '~/components/DataTable.vue'
import DocumentRpreview from '~/components/DocumentRpreview.vue'
import { useAffectationsStore } from '~/stores/affectations'
import Swal from 'sweetalert2'

const store = useAffectationsStore()
const { getEmetteurId, isAdmin, getUser } = useAuth()

useHead({ title: 'Affectations - Sagar Revolution' })

// ── État ──────────────────────────────────────────────────────────────────────
const tableData = ref([])
const loading = ref(false)
const error = ref(null)
const toast = useToast()
const dataTableRef = ref(null)
const config = useRuntimeConfig()

// Modal détails
const detailsOpen = ref(false)
const selectedAffectation = ref(null)
const showDoc = ref(false)

// Modal modification destinataire
const showEditModal = ref(false)
const selectedNewDestinataire = ref(null)
const searchDestinataire = ref('')
const destinataires = ref([])
const loadingDestinataires = ref(false)
const submitting = ref(false)

// ── Colonnes ──────────────────────────────────────────────────────────────────
const columns = computed(() => {
  const base = [
    { key: 'reference_courrier', label: 'Réf. Courrier', visible: true, width: 'min-w-[200px]', showLabel: false, inputHidden: false },
    { key: 'dossier', label: 'Dossier', visible: true, width: 'min-w-[200px]', showLabel: false, inputHidden: false },
    { key: 'objet_courrier', label: 'Objet', visible: true, width: 'min-w-[250px]', showLabel: false, inputHidden: false },
    { key: 'doc_courrier', label: 'Document', visible: false, type: 'document', width: 'w-24', showLabel: false, inputHidden: false },
    { key: 'date_affect', label: "Date d'affectation", visible: true, width: 'min-w-[120px]', showLabel: false, inputHidden: false },
    { key: 'instructions', label: 'Instructions', visible: true, width: 'min-w-[200px]', showLabel: false, inputHidden: false },
    { key: 'statut', label: 'Statut', visible: true, type: 'badge', width: 'min-w-[120px]', showLabel: false, inputHidden: false },
    { key: 'priority', label: 'Priorité', visible: true, type: 'badge', width: 'min-w-[120px]', showLabel: false, inputHidden: false },
    { key: 'delai_traitement', label: 'Date de retour attendue', visible: true, width: 'min-w-[120px]', showLabel: false, inputHidden: false },
    { key: 'date_cloture', label: 'Date clôture', visible: false, width: 'min-w-[120px]', showLabel: false, inputHidden: false },
    { key: 'destinataire', label: 'Destinataire', visible: true, width: 'min-w-[180px]', showLabel: false, inputHidden: false },
  ]
  if (isAdmin()) base.push({ key: 'emetteur', label: 'Émetteur', visible: true, width: 'min-w-[180px]' })
  return base
})

// ── Computed ──────────────────────────────────────────────────────────────────
const filteredDestinataires = computed(() => {
  if (!searchDestinataire.value) return destinataires.value
  const query = searchDestinataire.value.toLowerCase()
  return destinataires.value.filter(dest =>
    dest.user?.nom?.toLowerCase().includes(query) ||
    dest.user?.prenom?.toLowerCase().includes(query) ||
    dest.entite?.code?.toLowerCase().includes(query) ||
    dest.entite?.libelle?.toLowerCase().includes(query)
  )
})

// ── Utilitaires ───────────────────────────────────────────────────────────────
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}

const getStatutLabel = (statut) => ({ 'en cours': 'En cours', 'en_attente': 'En attente', 'traite': 'Traité', 'cloture': 'Clôturé', 'annule': 'Annulé' }[statut] || statut)
const getStatutClasses = (statut) => ({ 'en_attente': 'bg-gray-100 text-gray-800', 'en cours': 'bg-blue-100 text-blue-800', 'traite': 'bg-green-100 text-green-800', 'cloture': 'bg-blue-100 text-blue-800', 'annule': 'bg-red-100 text-red-800' }[statut] || 'bg-gray-100 text-gray-800')
const getStatutDotClass = (statut) => ({ 'en attente': 'bg-gray-500', 'en cours': 'bg-blue-500', 'traite': 'bg-green-500', 'cloture': 'bg-blue-500', 'annule': 'bg-red-500' }[statut] || 'bg-gray-500')
const getPriorityLabel = (priority) => ({ 'URGENT': 'URGENT', 'IMPORTANT': 'IMPORTANT', 'STANDARD': 'STANDARD' }[priority] || priority)
const getPriorityClasses = (priority) => ({ 'URGENT': 'bg-red-100 text-red-800', 'IMPORTANT': 'bg-orange-100 text-orange-800', 'STANDARD': 'bg-blue-100 text-blue-800' }[priority] || 'bg-gray-100 text-gray-800')
const getPriorityDotClass = (priority) => ({ 'URGENT': 'bg-red-500', 'IMPORTANT': 'bg-orange-500', 'STANDARD': 'bg-blue-500' }[priority] || 'bg-gray-500')

// ── Transform ─────────────────────────────────────────────────────────────────
const transformAffectation = (affectation) => {
  const emetteurNom = affectation.emetteur?.user
    ? `${affectation.emetteur.user.nom} ${affectation.emetteur.user.prenom || ''}`.trim()
    : 'Non assigné'
  const emetteurCode = affectation.emetteur?.entite?.code || ''
  const emetteurFonction = affectation.emetteur?.is_responsable ? affectation.emetteur.entite?.fonction || '' : 'Agent'

  const destinataireNom = affectation.destinataire?.user
    ? `${affectation.destinataire.user.nom} ${affectation.destinataire.user.prenom || ''}`.trim()
    : 'Non assigné'
  const destinataireCode = affectation.destinataire?.entite?.code || ''
  const destinataireFonction = affectation.destinataire?.is_responsable ? affectation.destinataire.entite?.fonction || '' : 'Agent'

  const rawUrl = affectation.courrier_arrive?.document?.url
  const docUrl = rawUrl && rawUrl !== 'Inconnu'
    ? (rawUrl.startsWith('http') ? rawUrl : `${config.public.baseUrl}${rawUrl}`)
    : ''

  return {
    id: affectation.id,
    courrier_id: affectation.courrier_arrive_id || null,
    reference_courrier: affectation.courrier_arrive?.document?.reference || '',
    objet_courrier: affectation.courrier_arrive?.document?.objet || '',
    doc_courrier: docUrl,
    date_affect: formatDate(affectation.date_affect),
    dossier: affectation.dossier || '—',
    instructions: affectation.instructions || '',
    statut: affectation.statut || 'en_cours',
    priority: affectation.priority || 'STANDARD',
    delai_traitement: formatDate(affectation.delai_traitement),
    date_cloture: formatDate(affectation.date_cloture),
    destinataire: {
      nom: destinataireNom,
      fonction: destinataireCode ? `${destinataireCode} - ${destinataireFonction}` : '',
      entite: affectation.destinataire?.entite?.libelle || '',
    },
    emetteur: {
      nom: emetteurNom,
      fonction: emetteurCode ? `${emetteurCode} - ${emetteurFonction}` : '',
      entite: affectation.emetteur?.entite?.libelle || '',
    },
    _raw: affectation,
  }
}

// ── Chargement ────────────────────────────────────────────────────────────────
const fetchAffectations = async () => {
  loading.value = true
  error.value = null

  try {
    const authToken = localStorage.getItem('auth_token')

    if (isAdmin()) {
      const response = await $fetch(`${config.public.apiBase}/affectations`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      tableData.value = (response.data || response).map(a => transformAffectation(a))
      return
    }

    let entite_user = null
    if (process.client) {
      const saved = localStorage.getItem('entite_user')
      if (saved) entite_user = JSON.parse(saved)
    }

    if (!entite_user?.id) { error.value = 'Aucune fonction utilisateur sélectionnée.'; return }

    const emetteurId = getEmetteurId() ?? entite_user.id
    const response = await $fetch(`${config.public.apiBase}/affectations/emetteur/${emetteurId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
    tableData.value = response.data.map(a => transformAffectation(a))

  } catch (err) {
    error.value = 'Impossible de charger les affectations'
    toast.add({ title: 'Erreur', description: 'Impossible de charger les affectations', color: 'red', timeout: 1500 })
  } finally {
    loading.value = false
  }
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
    const response = await $fetch(`${config.public.apiBase}/entite-users/${emetteurId}/subordinates`, {
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

// ── Handlers ──────────────────────────────────────────────────────────────────
const handleView = (item) => {
  selectedAffectation.value = item
  showDoc.value = false
  detailsOpen.value = true
}

const closeDetails = () => {
  detailsOpen.value = false
  selectedAffectation.value = null
  showDoc.value = false
}

const handleEdit = async (item) => {
  selectedAffectation.value = item
  selectedNewDestinataire.value = null
  searchDestinataire.value = ''
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
    await fetchAffectations()
  } catch (err) {
    const errorResponse = err.data || err.response?._data || {}
    toast.add({ title: 'Erreur', description: errorResponse.message || 'Impossible de communiquer avec le serveur', color: 'red', timeout: 3000 })
  } finally {
    submitting.value = false
  }
}

const handleOpenDocument = (url) => {
  if (url) window.open(url, '_blank', 'noopener,noreferrer')
  else toast.add({ title: 'Information', description: 'Aucun document disponible', color: 'amber', timeout: 2000 })
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
    await fetchAffectations()
  } catch (err) {
    await Swal.fire({ title: 'Erreur', text: "Impossible de supprimer l'affectation", icon: 'error', confirmButtonColor: '#2563eb' })
  }
}

const handleQuickAssign = (courrierId) => {
  if (process.client) sessionStorage.setItem('preselected_courrier_id', courrierId.toString())
  navigateTo('/affectations/create')
}

const handleSelectionChange = (selected) => console.log('Sélection:', selected)

const handleBulkDelete = async (selected) => {
  const result = await Swal.fire({
    title: 'Suppression multiple',
    html: `<p>Supprimer <strong>${selected.length} affectation(s)</strong> ?</p><p style="color:#dc2626;font-size:14px;margin-top:8px">Cette action est irréversible.</p>`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: `Supprimer ${selected.length}`,
    cancelButtonText: 'Annuler',
    reverseButtons: true,
  })
  if (!result.isConfirmed) return

  try {
    const authToken = localStorage.getItem('auth_token')
    await Promise.all(selected.map(id => $fetch(`${config.public.apiBase}/affectations/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken}` },
    })))
    await Swal.fire({ title: 'Supprimés !', text: `${selected.length} affectation(s) supprimée(s)`, icon: 'success', timer: 2000, showConfirmButton: false })
    if (dataTableRef.value) dataTableRef.value.selectedRows = []
    await fetchAffectations()
  } catch (err) {
    await Swal.fire({ title: 'Erreur', text: 'Impossible de supprimer les affectations', icon: 'error', confirmButtonColor: '#2563eb' })
  }
}

const handleBulkExport = (selected) => {
  toast.add({ title: 'Information', description: "Fonctionnalité d'export en cours de développement", color: 'amber', timeout: 2000 })
}

const refreshData = () => fetchAffectations()

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(() => { fetchAffectations() })
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
:deep(.swal2-cancel):hover { background-color: #4b5563 !important; }
</style>