import __nuxt_component_2 from './Input-50cchghJ.mjs';
import { _ as _export_sfc, u as useHead, r as useToast, d as __nuxt_component_1, c as __nuxt_component_0$2, n as navigateTo } from './server.mjs';
import __nuxt_component_1$1 from './Badge-DIEXPf_r.mjs';
import __nuxt_component_4 from './Select-C_BWMUVV.mjs';
import __nuxt_component_0 from './Checkbox-DFEpnQRu.mjs';
import { computed, ref, watch, mergeProps, withCtx, createTextVNode, toDisplayString, createBlock, createCommentVNode, openBlock, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrRenderStyle } from 'vue/server-renderer';
import { _ as _sfc_main$1, P as Pagination } from './Pagination-Dtpvabdd.mjs';
import Swal from 'sweetalert2';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:url';
import '@iconify/utils';
import 'node:crypto';
import 'consola';
import 'ipx';
import 'node:path';
import './useFormGroup-BPckFnLf.mjs';
import 'pinia';
import 'vue-router';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Liste des Affectations - Sagar Revolution"
    });
    const columns = [
      { key: "id", label: "N\xB0", visible: true, width: "w-16" },
      { key: "reference_courrier", label: "R\xE9f. Courrier", visible: true, width: "min-w-[150px]" },
      { key: "objet_courrier", label: "Objet", visible: true, width: "min-w-[250px]" },
      { key: "doc_courrier", label: "Document", visible: true, type: "document", width: "w-24" },
      { key: "date_affect", label: "Date d'affectation", visible: true, width: "min-w-[120px]" },
      { key: "instructions", label: "Instructions", visible: true, width: "min-w-[200px]" },
      { key: "statut", label: "Statut", visible: true, type: "badge", width: "min-w-[120px]" },
      { key: "priority", label: "Priorit\xE9", visible: true, type: "badge", width: "min-w-[120px]" },
      { key: "delai_traitement", label: "Date de retour attendue", visible: true, width: "min-w-[120px]" },
      { key: "date_cloture", label: "Date cl\xF4ture", visible: false, width: "min-w-[120px]" },
      { key: "emetteur", label: "\xC9metteur", visible: true, width: "min-w-[150px]" },
      { key: "destinataire", label: "Destinataire", visible: true, width: "min-w-[150px]" }
    ];
    const visibleColumns = computed(() => columns.filter((col) => col.visible));
    const authToken = ref("");
    const affectationData = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const toast = useToast();
    const globalSearch = ref("");
    const showAdvancedFilters = ref(false);
    const filterSearch = ref("");
    const filters = ref(
      columns.reduce((acc, col) => {
        acc[col.key] = "";
        return acc;
      }, {})
    );
    const multiSelectFilters = ref(
      columns.reduce((acc, col) => {
        acc[col.key] = [];
        return acc;
      }, {})
    );
    const textFilterMenu = ref({
      show: false,
      column: null,
      x: 0,
      y: 0
    });
    const sortColumn = ref("id");
    const sortDirection = ref("desc");
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const selectedRows = ref([]);
    const formatDate = (date) => {
      if (!date) return "";
      return new Date(date).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    };
    const transformerDonneesAPI = (reponseAPI) => {
      if (!(reponseAPI == null ? void 0 : reponseAPI.data)) {
        throw new Error("Format de r\xE9ponse API invalide");
      }
      return reponseAPI.data.map((affectation) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
        let emetteurFormate = "";
        if (((_b = (_a = affectation == null ? void 0 : affectation.emetteur) == null ? void 0 : _a.user) == null ? void 0 : _b.nom) && ((_d = (_c = affectation == null ? void 0 : affectation.emetteur) == null ? void 0 : _c.entite) == null ? void 0 : _d.code)) {
          const nomComplet = `${affectation.emetteur.user.nom} ${affectation.emetteur.user.prenom || ""}`.trim();
          const codeEntite = affectation.emetteur.entite.code;
          const roleOuFonction = affectation.emetteur.is_responsable ? affectation.emetteur.entite.fonction : "Agent";
          emetteurFormate = `${nomComplet} (${codeEntite} - ${roleOuFonction})`;
        }
        let destinataireFormate = "";
        if (((_f = (_e = affectation == null ? void 0 : affectation.destinataire) == null ? void 0 : _e.user) == null ? void 0 : _f.nom) && ((_h = (_g = affectation == null ? void 0 : affectation.destinataire) == null ? void 0 : _g.entite) == null ? void 0 : _h.code)) {
          const nomComplet = `${affectation.destinataire.user.nom} ${affectation.destinataire.user.prenom || ""}`.trim();
          const codeEntite = affectation.destinataire.entite.code;
          const roleOuFonction = affectation.destinataire.is_responsable ? affectation.destinataire.entite.fonction : "Agent";
          destinataireFormate = `${nomComplet} (${codeEntite} - ${roleOuFonction})`;
        }
        return {
          id: affectation.id,
          reference_courrier: ((_j = (_i = affectation == null ? void 0 : affectation.courrier_arrive) == null ? void 0 : _i.document) == null ? void 0 : _j.reference) || "",
          objet_courrier: ((_l = (_k = affectation == null ? void 0 : affectation.courrier_arrive) == null ? void 0 : _k.document) == null ? void 0 : _l.objet) || "",
          doc_courrier: ((_n = (_m = affectation == null ? void 0 : affectation.courrier_arrive) == null ? void 0 : _m.document) == null ? void 0 : _n.url) ? `http://localhost:8000${affectation.courrier_arrive.document.url}` : "",
          date_affect: formatDate(affectation.date_affect),
          instructions: affectation.instructions || "",
          statut: affectation.statut || "",
          priority: affectation.priority || "",
          delai_traitement: formatDate(affectation.delai_traitement),
          date_cloture: formatDate(affectation.date_cloture),
          emetteur: emetteurFormate,
          destinataire: destinataireFormate,
          // Données complètes pour les actions
          affectation_complete: affectation
        };
      });
    };
    const loadData = async () => {
      if (!authToken.value) {
        error.value = "Token d'authentification manquant";
        return;
      }
      loading.value = true;
      error.value = null;
      try {
        const reponse = await $fetch(`${config.public.apiBase}/affectations`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken.value}`
          }
        });
        affectationData.value = transformerDonneesAPI(reponse);
        console.log(`\u2705 ${affectationData.value.length} affectations charg\xE9es`);
      } catch (err) {
        error.value = err.message || "Erreur lors du chargement des donn\xE9es";
        console.error("Erreur de chargement:", err);
        toast.add({
          title: "Erreur",
          description: "Impossible de charger les affectations",
          color: "red",
          timeout: 1500
        });
      } finally {
        loading.value = false;
      }
    };
    const getStatutColor = (statut) => {
      const colors = {
        "En attente": { color: "gray", dot: "bg-gray-500" },
        "En cours": { color: "blue", dot: "bg-blue-500" },
        "Trait\xE9": { color: "green", dot: "bg-green-500" },
        "Cl\xF4tur\xE9": { color: "purple", dot: "bg-purple-500" },
        "Annul\xE9": { color: "red", dot: "bg-red-500" }
      };
      return colors[statut] || { color: "gray", dot: "bg-gray-500" };
    };
    const getPriorityColor = (priority) => {
      const colors = {
        "Urgent": { color: "red", dot: "bg-red-500" },
        "Important": { color: "orange", dot: "bg-orange-500" },
        "Standard": { color: "blue", dot: "bg-blue-500" }
      };
      return colors[priority] || { color: "gray", dot: "bg-gray-500" };
    };
    const activeFiltersCount = computed(() => {
      const simpleFilters = Object.values(filters.value).filter((v) => v !== "").length;
      const multiFilters = Object.values(multiSelectFilters.value).filter((v) => v.length > 0).length;
      return simpleFilters + multiFilters;
    });
    const getFilterOptions = (column) => {
      const options = [...new Set(affectationData.value.map((item) => item[column]))];
      return options.filter((value) => value !== "").map((value) => ({
        value,
        label: String(value)
      })).sort((a, b) => a.label.localeCompare(b.label));
    };
    const getFilteredOptions = (column) => {
      const allOptions = getFilterOptions(column);
      if (!filterSearch.value) return allOptions;
      const searchQuery = filterSearch.value.toLowerCase();
      return allOptions.filter(
        (option) => option.label.toLowerCase().includes(searchQuery)
      );
    };
    const isSelected = (column, value) => {
      var _a;
      return ((_a = multiSelectFilters.value[column]) == null ? void 0 : _a.includes(value)) || false;
    };
    const getSelectedCount = (column) => {
      var _a;
      return ((_a = multiSelectFilters.value[column]) == null ? void 0 : _a.length) || 0;
    };
    const isAllSelected = (column) => {
      const allOptions = getFilterOptions(column);
      const selected = multiSelectFilters.value[column] || [];
      return allOptions.length > 0 && selected.length === allOptions.length;
    };
    const isIndeterminate = (column) => {
      const allOptions = getFilterOptions(column);
      const selected = multiSelectFilters.value[column] || [];
      return selected.length > 0 && selected.length < allOptions.length;
    };
    const resetMultiSelectFilter = (column) => {
      multiSelectFilters.value[column] = [];
    };
    const openTextFilterMenu = (event, column) => {
      event.stopPropagation();
      filterSearch.value = "";
      const rect = event.target.getBoundingClientRect();
      textFilterMenu.value = {
        show: true,
        column,
        x: rect.left,
        y: rect.bottom + 5
      };
    };
    const closeTextFilterMenu = () => {
      filterSearch.value = "";
      textFilterMenu.value = {
        show: false,
        column: null,
        x: 0,
        y: 0
      };
    };
    const getColumnLabel = (columnKey) => {
      const column = columns.find((col) => col.key === columnKey);
      return column ? column.label : columnKey;
    };
    const toggleAdvancedFilters = () => {
      showAdvancedFilters.value = !showAdvancedFilters.value;
    };
    const handleGlobalSearch = () => {
      currentPage.value = 1;
    };
    const handleFilter = () => {
      currentPage.value = 1;
    };
    const sortBy = (column) => {
      if (sortColumn.value === column) {
        sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
      } else {
        sortColumn.value = column;
        sortDirection.value = "asc";
      }
    };
    const selectAll = computed({
      get: () => selectedRows.value.length === paginatedData.value.length && paginatedData.value.length > 0,
      set: (value) => {
        if (value) {
          selectedRows.value = paginatedData.value.map((item) => item.id);
        } else {
          selectedRows.value = [];
        }
      }
    });
    const isIndeterminateSelection = computed(() => {
      return selectedRows.value.length > 0 && selectedRows.value.length < paginatedData.value.length;
    });
    const toggleSelectAll = () => {
      if (selectAll.value) {
        selectedRows.value = [];
      } else {
        selectedRows.value = paginatedData.value.map((item) => item.id);
      }
    };
    const toggleRowSelection = (id) => {
      const index2 = selectedRows.value.indexOf(id);
      if (index2 > -1) {
        selectedRows.value.splice(index2, 1);
      } else {
        selectedRows.value.push(id);
      }
    };
    const updateItemsPerPage = () => {
      currentPage.value = 1;
    };
    const filteredData = computed(() => {
      let filtered = affectationData.value;
      if (globalSearch.value) {
        const query = globalSearch.value.toLowerCase();
        filtered = filtered.filter(
          (item) => Object.values(item).some(
            (val) => String(val).toLowerCase().includes(query)
          )
        );
      }
      Object.keys(multiSelectFilters.value).forEach((column) => {
        var _a;
        if (((_a = multiSelectFilters.value[column]) == null ? void 0 : _a.length) > 0) {
          filtered = filtered.filter(
            (item) => multiSelectFilters.value[column].includes(item[column])
          );
        }
      });
      Object.keys(filters.value).forEach((key) => {
        if (filters.value[key]) {
          const query = filters.value[key].toLowerCase();
          filtered = filtered.filter(
            (item) => String(item[key]).toLowerCase().includes(query)
          );
        }
      });
      return filtered;
    });
    const sortedData = computed(() => {
      const data = [...filteredData.value];
      return data.sort((a, b) => {
        let aVal = a[sortColumn.value];
        let bVal = b[sortColumn.value];
        if (typeof aVal === "string") {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }
        return sortDirection.value === "asc" ? aVal > bVal ? 1 : -1 : aVal < bVal ? 1 : -1;
      });
    });
    const totalPages = computed(
      () => Math.ceil(sortedData.value.length / itemsPerPage.value)
    );
    const startIndex = computed(
      () => (currentPage.value - 1) * itemsPerPage.value
    );
    const endIndex = computed(
      () => Math.min(startIndex.value + itemsPerPage.value, sortedData.value.length)
    );
    const paginatedData = computed(
      () => sortedData.value.slice(startIndex.value, endIndex.value)
    );
    const getRowClasses = (id, index2) => {
      const isSelectedRow = selectedRows.value.includes(id);
      return {
        "bg-purple-50": isSelectedRow,
        "bg-gray-50": index2 % 2 === 0 && !isSelectedRow,
        "bg-white": index2 % 2 === 1 && !isSelectedRow,
        "hover:bg-purple-100": !isSelectedRow,
        "hover:bg-purple-200": isSelectedRow
      };
    };
    const getCellAlignment = (columnKey) => {
      const leftAligned = ["objet_courrier", "instructions", "reference_courrier", "emetteur", "destinataire"];
      return leftAligned.includes(columnKey) ? "text-left" : "text-center";
    };
    const viewDetails = (item) => {
      console.log("Voir d\xE9tails de l'affectation:", item);
      const details = `
    <div class="text-left space-y-3">
      <div class="bg-blue-50 rounded-lg p-3">
        <p class="text-xs text-gray-600 uppercase font-semibold mb-1">Courrier</p>
        <p class="font-bold text-blue-900">${item.reference_courrier}</p>
        <p class="text-sm text-gray-700 mt-1">${item.objet_courrier}</p>
      </div>
      
      <div class="grid grid-cols-2 gap-2">
        <div class="bg-gray-50 rounded p-2">
          <p class="text-xs text-gray-600 font-semibold">Date d'affectation</p>
          <p class="text-sm text-gray-900">${item.date_affect}</p>
        </div>
        <div class="bg-gray-50 rounded p-2">
          <p class="text-xs text-gray-600 font-semibold">Date de retour attendue</p>
          <p class="text-sm text-gray-900">${item.delai_traitement}</p>
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-2">
        <div class="bg-gray-50 rounded p-2">
          <p class="text-xs text-gray-600 font-semibold">Statut</p>
          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-${getStatutColor(item.statut).color}-100 text-${getStatutColor(item.statut).color}-800">
            ${item.statut}
          </span>
        </div>
        <div class="bg-gray-50 rounded p-2">
          <p class="text-xs text-gray-600 font-semibold">Priorit\xE9</p>
          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-${getPriorityColor(item.priority).color}-100 text-${getPriorityColor(item.priority).color}-800">
            ${item.priority}
          </span>
        </div>
      </div>
      
      ${item.destinataire ? `
        <div class="bg-gray-50 rounded p-2">
          <p class="text-xs text-gray-600 font-semibold">Destinataire</p>
          <p class="text-sm text-gray-900">${item.destinataire}</p>
        </div>
      ` : ""}
      
      ${item.date_cloture ? `
        <div class="bg-green-50 rounded p-2">
          <p class="text-xs text-gray-600 font-semibold">Date de cl\xF4ture</p>
          <p class="text-sm text-gray-900">${item.date_cloture}</p>
        </div>
      ` : ""}
      
      <div class="bg-yellow-50 rounded p-3">
        <p class="text-xs text-gray-600 font-semibold mb-1">Instructions</p>
        <p class="text-sm text-gray-700 whitespace-pre-wrap">${item.instructions}</p>
      </div>
    </div>
  `;
      Swal.fire({
        title: "D\xE9tails de l'affectation",
        html: details,
        icon: "info",
        confirmButtonColor: "#3b82f6",
        confirmButtonText: "Fermer",
        width: "600px",
        customClass: {
          popup: "swal2-popup-custom",
          title: "text-xl font-semibold",
          htmlContainer: "text-sm"
        }
      });
    };
    const editItem = (item) => {
      console.log("Modifier l'affectation:", item);
      navigateTo(`/affectations/edit/${item.id}`);
    };
    const deleteItem = async (item) => {
      const result = await Swal.fire({
        title: "Confirmer la suppression",
        html: `
      <div class="text-left">
        <p class="mb-3">\xCAtes-vous s\xFBr de vouloir supprimer cette affectation ?</p>
        <div class="bg-gray-50 rounded-lg p-4 space-y-2">
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
              ${item.reference_courrier}
            </span>
          </div>
          <p class="text-sm text-gray-700">${item.objet_courrier}</p>
          <div class="pt-2 border-t border-gray-200">
            <span class="text-xs text-gray-600">Destinataire: </span>
            <span class="text-sm font-medium">${item.destinataire || "Non assign\xE9"}</span>
          </div>
        </div>
        <p class="mt-3 text-sm text-gray-500">Cette action est irr\xE9versible.</p>
      </div>
    `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Oui, supprimer",
        cancelButtonText: "Annuler",
        reverseButtons: true,
        customClass: {
          popup: "swal2-popup-custom",
          title: "text-xl font-semibold",
          htmlContainer: "text-sm"
        }
      });
      if (!result.isConfirmed) {
        return;
      }
      try {
        await $fetch(`${config.public.apiBase}/affectations/${item.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken.value}`
          }
        });
        await Swal.fire({
          title: "Supprim\xE9 !",
          text: "L'affectation a \xE9t\xE9 supprim\xE9e avec succ\xE8s",
          icon: "success",
          timer: 2e3,
          showConfirmButton: false
        });
        await loadData();
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        await Swal.fire({
          title: "Erreur",
          text: "Impossible de supprimer l'affectation",
          icon: "error",
          confirmButtonColor: "#3b82f6",
          confirmButtonText: "OK"
        });
      }
    };
    const deleteSelected = async () => {
      const result = await Swal.fire({
        title: "Suppression multiple",
        html: `
      <div class="text-left">
        <p class="mb-3">\xCAtes-vous s\xFBr de vouloir supprimer <strong>${selectedRows.value.length} affectation(s)</strong> ?</p>
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
          <div class="flex items-start gap-2">
            <svg class="h-5 w-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <p class="text-sm text-yellow-800">Cette action supprimera toutes les affectations s\xE9lectionn\xE9es de mani\xE8re permanente.</p>
          </div>
        </div>
        <p class="text-sm text-gray-500">Cette action est irr\xE9versible.</p>
      </div>
    `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
        confirmButtonText: `Oui, supprimer ${selectedRows.value.length} \xE9l\xE9ment(s)`,
        cancelButtonText: "Annuler",
        reverseButtons: true,
        customClass: {
          popup: "swal2-popup-custom",
          title: "text-xl font-semibold",
          htmlContainer: "text-sm"
        }
      });
      if (!result.isConfirmed) {
        return;
      }
      try {
        await Promise.all(
          selectedRows.value.map(
            (id) => $fetch(`${config.public.apiBase}/affectations/${id}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${authToken.value}`
              }
            })
          )
        );
        await Swal.fire({
          title: "Supprim\xE9s !",
          text: `${selectedRows.value.length} affectation(s) supprim\xE9e(s) avec succ\xE8s`,
          icon: "success",
          timer: 2e3,
          showConfirmButton: false
        });
        selectedRows.value = [];
        await loadData();
      } catch (err) {
        console.error("Erreur lors de la suppression multiple:", err);
        await Swal.fire({
          title: "Erreur",
          text: "Impossible de supprimer les affectations",
          icon: "error",
          confirmButtonColor: "#3b82f6",
          confirmButtonText: "OK"
        });
      }
    };
    watch(filteredData, () => {
      if (currentPage.value > totalPages.value) {
        currentPage.value = 1;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UInput = __nuxt_component_2;
      const _component_UButton = __nuxt_component_1;
      const _component_UBadge = __nuxt_component_1$1;
      const _component_USelect = __nuxt_component_4;
      const _component_UCheckbox = __nuxt_component_0;
      const _component_Icon = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))} data-v-da07f87b><div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6" data-v-da07f87b><div class="flex items-center justify-between mb-6" data-v-da07f87b><div data-v-da07f87b><h1 class="text-2xl font-bold text-gray-900" data-v-da07f87b>Documents</h1><p class="text-gray-600 mt-1" data-v-da07f87b> Gestion des affectations et suivi des traitements </p></div></div><div class="bg-white border-b border-gray-200 mb-4" data-v-da07f87b><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3" data-v-da07f87b><div class="flex flex-wrap items-center justify-between gap-4" data-v-da07f87b><div class="flex items-center space-x-4" data-v-da07f87b><div class="relative" data-v-da07f87b>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: globalSearch.value,
        "onUpdate:modelValue": ($event) => globalSearch.value = $event,
        placeholder: "Recherche globale...",
        icon: "i-heroicons-magnifying-glass",
        size: "sm",
        class: "w-64",
        onInput: handleGlobalSearch
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UButton, {
        onClick: toggleAdvancedFilters,
        variant: "outline",
        size: "sm",
        icon: "i-heroicons-funnel",
        color: showAdvancedFilters.value ? "primary" : "gray"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Filtres avanc\xE9s `);
            if (activeFiltersCount.value > 0) {
              _push2(ssrRenderComponent(_component_UBadge, {
                color: "red",
                variant: "solid",
                size: "xs",
                class: "ml-2"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(activeFiltersCount.value)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(activeFiltersCount.value), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createTextVNode(" Filtres avanc\xE9s "),
              activeFiltersCount.value > 0 ? (openBlock(), createBlock(_component_UBadge, {
                key: 0,
                color: "red",
                variant: "solid",
                size: "xs",
                class: "ml-2"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(activeFiltersCount.value), 1)
                ]),
                _: 1
              })) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="flex items-center space-x-4" data-v-da07f87b><div class="flex items-center space-x-2" data-v-da07f87b><label class="text-sm text-gray-600" data-v-da07f87b>Lignes par page:</label>`);
      _push(ssrRenderComponent(_component_USelect, {
        modelValue: itemsPerPage.value,
        "onUpdate:modelValue": [($event) => itemsPerPage.value = $event, updateItemsPerPage],
        options: [10, 25, 50, 100],
        class: "w-16",
        size: "sm"
      }, null, _parent));
      _push(`</div></div></div>`);
      if (showAdvancedFilters.value) {
        _push(`<div class="mt-4 p-4 bg-gray-50 rounded-lg" data-v-da07f87b><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" data-v-da07f87b><div data-v-da07f87b><label class="block text-xs font-medium text-gray-700 mb-1" data-v-da07f87b>Date d&#39;affectation</label>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: filters.value.date_affect,
          "onUpdate:modelValue": ($event) => filters.value.date_affect = $event,
          type: "date",
          size: "sm",
          onInput: handleFilter
        }, null, _parent));
        _push(`</div><div data-v-da07f87b><label class="block text-xs font-medium text-gray-700 mb-1" data-v-da07f87b>Date de retour attendue</label>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: filters.value.delai_traitement,
          "onUpdate:modelValue": ($event) => filters.value.delai_traitement = $event,
          type: "date",
          size: "sm",
          onInput: handleFilter
        }, null, _parent));
        _push(`</div><div data-v-da07f87b><label class="block text-xs font-medium text-gray-700 mb-1" data-v-da07f87b>Date de cl\xF4ture</label>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: filters.value.date_cloture,
          "onUpdate:modelValue": ($event) => filters.value.date_cloture = $event,
          type: "date",
          size: "sm",
          onInput: handleFilter
        }, null, _parent));
        _push(`</div><div data-v-da07f87b><label class="block text-xs font-medium text-gray-700 mb-1" data-v-da07f87b>\xC9metteur</label>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: filters.value.emetteur,
          "onUpdate:modelValue": ($event) => filters.value.emetteur = $event,
          placeholder: "Filtrer par \xE9metteur...",
          size: "sm",
          icon: "i-heroicons-user",
          onInput: handleFilter
        }, null, _parent));
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="max-w-7xl px-4 sm:px-6 lg:px-8 py-6" data-v-da07f87b><div class="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden" data-v-da07f87b><div class="border-b border-gray-200 px-6 py-3 bg-gray-50" data-v-da07f87b><div class="flex items-center space-x-4" data-v-da07f87b><span class="text-sm text-gray-700" data-v-da07f87b>${ssrInterpolate(selectedRows.value.length)} s\xE9lectionn\xE9(s) </span>`);
      if (selectedRows.value.length > 0) {
        _push(ssrRenderComponent(_component_UButton, {
          onClick: deleteSelected,
          variant: "outline",
          size: "sm",
          icon: "i-heroicons-trash",
          color: "red"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Supprimer la s\xE9lection `);
            } else {
              return [
                createTextVNode(" Supprimer la s\xE9lection ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="table-auto overflow-x-auto" data-v-da07f87b><table class="w-full border-collapse" data-v-da07f87b><thead class="bg-gray-50 border border-gray-400" data-v-da07f87b><tr data-v-da07f87b><!--[-->`);
      ssrRenderList(visibleColumns.value, (column) => {
        var _a;
        _push(`<th class="${ssrRenderClass([
          "px-2 py-3 text-center border border-gray-400 bg-gray-100",
          column.width || "min-w-[150px]"
        ])}" data-v-da07f87b><div class="space-y-1" data-v-da07f87b><div class="flex items-center justify-center gap-1" data-v-da07f87b>`);
        if (column.type === "badge" || column.type === "document") {
          _push(`<span class="text-xs font-medium text-gray-700 uppercase tracking-wider" data-v-da07f87b>${ssrInterpolate(column.label)}</span>`);
        } else {
          _push(`<!--[-->`);
          _push(ssrRenderComponent(_component_UInput, {
            modelValue: filters.value[column.key],
            "onUpdate:modelValue": [($event) => filters.value[column.key] = $event, handleFilter],
            placeholder: column.label,
            size: "xs",
            class: "w-full"
          }, {
            trailing: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_sfc_main$1, {
                  column: column.key,
                  "sort-column": sortColumn.value,
                  "sort-direction": sortDirection.value,
                  onSort: sortBy
                }, null, _parent2, _scopeId));
              } else {
                return [
                  createVNode(_sfc_main$1, {
                    column: column.key,
                    "sort-column": sortColumn.value,
                    "sort-direction": sortDirection.value,
                    onSort: sortBy
                  }, null, 8, ["column", "sort-column", "sort-direction"])
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(ssrRenderComponent(_component_UButton, {
            onClick: ($event) => openTextFilterMenu($event, column.key),
            variant: "outline",
            size: "2xs",
            icon: "i-heroicons-funnel",
            color: ((_a = multiSelectFilters.value[column.key]) == null ? void 0 : _a.length) > 0 ? "primary" : "gray"
          }, null, _parent));
          _push(`<!--]-->`);
        }
        _push(`</div></div></th>`);
      });
      _push(`<!--]--><th class="px-2 py-3 text-center border border-gray-400 bg-gray-100 w-16" data-v-da07f87b>`);
      _push(ssrRenderComponent(_component_UCheckbox, {
        modelValue: selectAll.value,
        "onUpdate:modelValue": ($event) => selectAll.value = $event,
        indeterminate: isIndeterminateSelection.value,
        onChange: toggleSelectAll
      }, null, _parent));
      _push(`</th><th class="px-6 py-3 text-right border border-gray-400 bg-gray-100 w-32" data-v-da07f87b><span class="text-xs font-medium text-gray-700 uppercase tracking-wider" data-v-da07f87b> Actions </span></th></tr></thead><tbody class="bg-white" data-v-da07f87b><!--[-->`);
      ssrRenderList(paginatedData.value, (item, index2) => {
        _push(`<tr class="${ssrRenderClass([getRowClasses(item.id, index2), "transition-colors"])}" data-v-da07f87b><!--[-->`);
        ssrRenderList(visibleColumns.value, (column) => {
          _push(`<td class="${ssrRenderClass([
            "px-2 py-3 border border-gray-300 text-xs text-gray-900",
            getCellAlignment(column.key),
            column.width || "min-w-[150px]"
          ])}" data-v-da07f87b>`);
          if (column.type === "document") {
            _push(`<div class="flex justify-center" data-v-da07f87b>`);
            if (item[column.key]) {
              _push(`<button class="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded hover:bg-blue-50" title="Ouvrir le document" data-v-da07f87b>`);
              _push(ssrRenderComponent(_component_Icon, {
                name: "i-heroicons-document-text",
                class: "h-5 w-5"
              }, null, _parent));
              _push(`</button>`);
            } else {
              _push(`<span class="text-gray-300" title="Aucun document" data-v-da07f87b>`);
              _push(ssrRenderComponent(_component_Icon, {
                name: "i-heroicons-document-text",
                class: "h-5 w-5"
              }, null, _parent));
              _push(`</span>`);
            }
            _push(`</div>`);
          } else if (column.key === "statut") {
            _push(`<div class="flex justify-center" data-v-da07f87b>`);
            _push(ssrRenderComponent(_component_UBadge, {
              color: getStatutColor(item[column.key]).color,
              variant: "soft",
              size: "xs"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(item[column.key])}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(item[column.key]), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</div>`);
          } else if (column.key === "priority") {
            _push(`<div class="flex justify-center" data-v-da07f87b>`);
            _push(ssrRenderComponent(_component_UBadge, {
              color: getPriorityColor(item[column.key]).color,
              variant: "soft",
              size: "xs"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<span class="flex items-center gap-1" data-v-da07f87b${_scopeId}><span class="${ssrRenderClass([getPriorityColor(item[column.key]).dot, "w-2 h-2 rounded-full"])}" data-v-da07f87b${_scopeId}></span> ${ssrInterpolate(item[column.key])}</span>`);
                } else {
                  return [
                    createVNode("span", { class: "flex items-center gap-1" }, [
                      createVNode("span", {
                        class: ["w-2 h-2 rounded-full", getPriorityColor(item[column.key]).dot]
                      }, null, 2),
                      createTextVNode(" " + toDisplayString(item[column.key]), 1)
                    ])
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</div>`);
          } else if (column.key === "reference_courrier") {
            _push(`<div class="flex justify-left" data-v-da07f87b>`);
            _push(ssrRenderComponent(_component_UBadge, {
              color: "blue",
              variant: "soft",
              size: "xs"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(item[column.key])}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(item[column.key]), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</div>`);
          } else if (column.key === "instructions") {
            _push(`<div class="text-left" data-v-da07f87b><span class="line-clamp-2 text-xs text-gray-700"${ssrRenderAttr("title", item[column.key])} data-v-da07f87b>${ssrInterpolate(item[column.key])}</span></div>`);
          } else {
            _push(`<div data-v-da07f87b>${ssrInterpolate(item[column.key])}</div>`);
          }
          _push(`</td>`);
        });
        _push(`<!--]--><td class="px-2 py-3 border border-gray-300 text-center" data-v-da07f87b>`);
        _push(ssrRenderComponent(_component_UCheckbox, {
          "model-value": selectedRows.value.includes(item.id),
          onChange: ($event) => toggleRowSelection(item.id)
        }, null, _parent));
        _push(`</td><td class="px-6 py-4 border border-gray-300 text-right text-sm font-medium" data-v-da07f87b><div class="flex justify-end space-x-2" data-v-da07f87b>`);
        _push(ssrRenderComponent(_component_UButton, {
          onClick: ($event) => viewDetails(item),
          variant: "ghost",
          size: "xs",
          icon: "i-heroicons-eye",
          color: "blue",
          title: "Voir les d\xE9tails"
        }, null, _parent));
        _push(ssrRenderComponent(_component_UButton, {
          onClick: ($event) => editItem(item),
          variant: "ghost",
          size: "xs",
          icon: "i-heroicons-pencil",
          color: "yellow",
          title: "Modifier l'affectation"
        }, null, _parent));
        _push(ssrRenderComponent(_component_UButton, {
          onClick: ($event) => deleteItem(item),
          variant: "ghost",
          size: "xs",
          icon: "i-heroicons-trash",
          color: "red",
          title: "Supprimer l'affectation"
        }, null, _parent));
        _push(`</div></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div>`);
      if (paginatedData.value.length === 0) {
        _push(`<div class="text-center py-12" data-v-da07f87b>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-clipboard-document-list",
          class: "mx-auto h-12 w-12 text-gray-400"
        }, null, _parent));
        _push(`<h3 class="mt-2 text-sm font-medium text-gray-900" data-v-da07f87b>Aucune affectation</h3>`);
        if (!_ctx.isAdmin()) {
          _push(`<p class="mt-1 text-sm text-gray-500" data-v-da07f87b> Commencez par cr\xE9er une nouvelle affectation de courrier. </p>`);
        } else {
          _push(`<!---->`);
        }
        if (!_ctx.isAdmin()) {
          _push(`<div class="mt-6" data-v-da07f87b>`);
          _push(ssrRenderComponent(_component_UButton, {
            to: "/affectations/create",
            icon: "i-heroicons-plus",
            class: "bg-gradient-to-br from-purple-800 to-indigo-800 text-white"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Cr\xE9er une affectation `);
              } else {
                return [
                  createTextVNode(" Cr\xE9er une affectation ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (paginatedData.value.length > 0) {
        _push(`<div class="border-t border-gray-200 px-6 py-4 bg-gray-50" data-v-da07f87b><div class="flex items-center justify-between" data-v-da07f87b><div class="text-sm text-gray-700" data-v-da07f87b> Affichage de ${ssrInterpolate(startIndex.value + 1)} \xE0 ${ssrInterpolate(endIndex.value)} sur ${ssrInterpolate(filteredData.value.length)} r\xE9sultats `);
        if (filteredData.value.length !== affectationData.value.length) {
          _push(`<span class="ml-2" data-v-da07f87b> (${ssrInterpolate(affectationData.value.length)} total) </span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        _push(ssrRenderComponent(Pagination, {
          modelValue: currentPage.value,
          "onUpdate:modelValue": ($event) => currentPage.value = $event,
          itemsPerPage: itemsPerPage.value,
          "onUpdate:itemsPerPage": ($event) => itemsPerPage.value = $event,
          "total-items": filteredData.value.length,
          "total-items-without-filter": affectationData.value.length,
          ui: {
            wrapper: "flex items-center gap-1",
            rounded: "!rounded-full min-w-[32px] justify-center",
            default: {
              activeButton: { variant: "solid" }
            }
          }
        }, null, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
      if (textFilterMenu.value.show) {
        _push(`<div class="fixed z-50 bg-white border border-gray-300 rounded-lg shadow-lg min-w-80 max-h-96" style="${ssrRenderStyle({ left: textFilterMenu.value.x + "px", top: textFilterMenu.value.y + "px" })}" data-v-da07f87b><div class="p-4" data-v-da07f87b><div class="flex items-center justify-between mb-3" data-v-da07f87b><h3 class="text-sm font-medium text-gray-900" data-v-da07f87b> Filtre - ${ssrInterpolate(getColumnLabel(textFilterMenu.value.column))}</h3><div class="flex items-center space-x-2" data-v-da07f87b>`);
        if (getSelectedCount(textFilterMenu.value.column) > 0) {
          _push(ssrRenderComponent(_component_UBadge, {
            color: "blue",
            variant: "solid",
            size: "xs"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(getSelectedCount(textFilterMenu.value.column))}`);
              } else {
                return [
                  createTextVNode(toDisplayString(getSelectedCount(textFilterMenu.value.column)), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(_component_UButton, {
          onClick: closeTextFilterMenu,
          variant: "ghost",
          size: "xs",
          icon: "i-heroicons-x-mark"
        }, null, _parent));
        _push(`</div></div>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: filterSearch.value,
          "onUpdate:modelValue": ($event) => filterSearch.value = $event,
          placeholder: "Rechercher...",
          icon: "i-heroicons-magnifying-glass",
          size: "sm",
          class: "mb-3"
        }, null, _parent));
        _push(`<div class="max-h-48 overflow-y-auto border border-gray-200 rounded" data-v-da07f87b><div class="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer border-b" data-v-da07f87b>`);
        _push(ssrRenderComponent(_component_UCheckbox, {
          "model-value": isAllSelected(textFilterMenu.value.column),
          indeterminate: isIndeterminate(textFilterMenu.value.column),
          size: "sm",
          class: "mr-3"
        }, null, _parent));
        _push(`<span class="text-sm text-gray-700" data-v-da07f87b>(S\xE9lectionner tous)</span></div><!--[-->`);
        ssrRenderList(getFilteredOptions(textFilterMenu.value.column), (option) => {
          _push(`<div class="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer" data-v-da07f87b>`);
          _push(ssrRenderComponent(_component_UCheckbox, {
            "model-value": isSelected(textFilterMenu.value.column, option.value),
            size: "sm",
            class: "mr-3"
          }, null, _parent));
          _push(`<div class="flex items-center flex-1" data-v-da07f87b><span class="text-sm text-gray-700" data-v-da07f87b>${ssrInterpolate(option.label)}</span></div></div>`);
        });
        _push(`<!--]--></div><div class="flex justify-between items-center mt-3 pt-3 border-t border-gray-200" data-v-da07f87b><span class="text-xs text-gray-500" data-v-da07f87b>${ssrInterpolate(getSelectedCount(textFilterMenu.value.column))} s\xE9lectionn\xE9(s) </span>`);
        if (getSelectedCount(textFilterMenu.value.column) > 0) {
          _push(ssrRenderComponent(_component_UButton, {
            onClick: ($event) => resetMultiSelectFilter(textFilterMenu.value.column),
            variant: "outline",
            size: "xs",
            icon: "i-heroicons-arrow-path"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Reset `);
              } else {
                return [
                  createTextVNode(" Reset ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (textFilterMenu.value.show) {
        _push(`<div class="fixed inset-0 z-40" data-v-da07f87b></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/affectations/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-da07f87b"]]);

export { index as default };
//# sourceMappingURL=index-CHg0xY3m.mjs.map
