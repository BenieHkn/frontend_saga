import { ref, mergeProps, withCtx, createVNode, toDisplayString, createBlock, openBlock, createTextVNode, createCommentVNode, withDirectives, vModelText, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderClass } from 'vue/server-renderer';
import { u as useHead, _ as _export_sfc, r as useToast, c as __nuxt_component_0$2, b as useRuntimeConfig, n as navigateTo } from './server.mjs';
import __nuxt_component_1 from './Badge-DIEXPf_r.mjs';
import { _ as _sfc_main$5 } from './DataTable-Cb4WL8Ep.mjs';
import Swal from 'sweetalert2';
import { u as useAffectationsStore } from './affectations-Bp-zzr69.mjs';
import { u as useTransfertsStore } from './transferts-8xZaXUA2.mjs';
import { u as useAuth } from './useAuth-D9Skuklz.mjs';
import { _ as _sfc_main$3 } from './PageHeader-NxcDUFJW.mjs';
import { _ as _sfc_main$4 } from './AppTabs-B2KNyztb.mjs';
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
import 'pinia';
import 'vue-router';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './Input-50cchghJ.mjs';
import './useFormGroup-BPckFnLf.mjs';
import './Select-C_BWMUVV.mjs';
import './Checkbox-DFEpnQRu.mjs';
import './Card-DtmGMnBU.mjs';

const _sfc_main$2 = {
  __name: "AffectationsListe",
  __ssrInlineRender: true,
  setup(__props) {
    useAffectationsStore();
    useTransfertsStore();
    const { isSecDir, getDirecteurEntiteUserId } = useAuth();
    useHead({ title: "Documents re\xE7us - Sagar Revolution" });
    const columns = [
      { key: "reference_courrier", label: "R\xE9f. Courrier", visible: true, width: "min-w-[200px]" },
      { key: "objet_courrier", label: "Objet", visible: true, width: "min-w-[250px]" },
      { key: "doc_courrier", label: "Document", visible: false, type: "document", width: "w-24" },
      { key: "date_affect", label: "Date d'affectation", visible: true, width: "min-w-[120px]" },
      { key: "instructions", label: "Annotations", visible: true, width: "min-w-[200px]" },
      { key: "type", label: "Type", visible: true, width: "min-w-[120px]" },
      { key: "statut", label: "Statut", visible: true, type: "badge", width: "min-w-[120px]" },
      { key: "priority", label: "Priorit\xE9", visible: true, type: "badge", width: "min-w-[120px]" },
      { key: "delai_traitement", label: "Date de retour attendue", visible: true, width: "min-w-[120px]" },
      { key: "date_cloture", label: "Date cl\xF4ture", visible: false, width: "min-w-[120px]" },
      { key: "emetteur", label: "Source", visible: true, width: "min-w-[180px]" },
      { key: "destinataire", label: "Destinataire", visible: false, width: "min-w-[180px]" }
    ];
    const authToken = ref("");
    const affectationData = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const toast = useToast();
    const dataTableRef = ref(null);
    const selectedRows = ref([]);
    const isResponsable = ref(false);
    const config = useRuntimeConfig();
    const formatDate = (date) => {
      if (!date) return "";
      return new Date(date).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
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
          courrier_id: affectation.courrier_arrive_id || null,
          reference_courrier: ((_j = (_i = affectation == null ? void 0 : affectation.courrier_arrive) == null ? void 0 : _i.document) == null ? void 0 : _j.reference) || "",
          objet_courrier: ((_l = (_k = affectation == null ? void 0 : affectation.courrier_arrive) == null ? void 0 : _k.document) == null ? void 0 : _l.objet) || "",
          doc_courrier: ((_n = (_m = affectation == null ? void 0 : affectation.courrier_arrive) == null ? void 0 : _m.document) == null ? void 0 : _n.url) ? `${config.public.apiBase}${affectation.courrier_arrive.document.url}` : "",
          date_affect: formatDate(affectation.date_affect),
          instructions: affectation.instructions || "",
          type: affectation.type_affectation || "",
          statut: affectation.statut || "",
          priority: affectation.priority || "",
          delai_traitement: formatDate(affectation.delai_traitement),
          date_cloture: formatDate(affectation.date_cloture),
          emetteur: emetteurFormate,
          destinataire: destinataireFormate,
          _complete: affectation
        };
      });
    };
    const loadData = async () => {
      var _a;
      if (!authToken.value) {
        error.value = "Token d'authentification manquant";
        return;
      }
      loading.value = true;
      error.value = null;
      try {
        let entite_user = null;
        if (false) ;
        if (!entite_user || !entite_user.id) {
          error.value = "Aucune fonction user s\xE9lectionn\xE9e";
          return;
        }
        const destinataireId = isSecDir() ? (_a = getDirecteurEntiteUserId()) != null ? _a : entite_user.id : entite_user.id;
        console.log(`\u{1F4DD} Chargement affectations pour destinataire_id: ${destinataireId}`);
        const reponse = await $fetch(`${config.public.apiBase}/affectations/destinataire/${destinataireId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${authToken.value}` },
          timeout: 15e3
        });
        affectationData.value = transformerDonneesAPI(reponse);
        console.log(`\u2705 ${affectationData.value.length} affectations charg\xE9es`);
      } catch (err) {
        error.value = err.message || "Erreur lors du chargement des donn\xE9es";
        toast.add({ title: "Erreur", description: "Impossible de charger les affectations", color: "red", timeout: 1500 });
      } finally {
        loading.value = false;
      }
    };
    const getStatutClasses = (statut) => {
      const classes = {
        "en_attente": "bg-gray-100 text-gray-800",
        "en cours": "bg-blue-100 text-blue-800",
        "traite": "bg-green-100 text-green-800",
        "cloture": "bg-blue-100 text-blue-800",
        "annule": "bg-red-100 text-red-800"
      };
      return classes[statut] || "bg-gray-100 text-gray-800";
    };
    const getStatutDotClass = (statut) => {
      const classes = {
        "en_attente": "bg-gray-500",
        "en cours": "bg-blue-500",
        "traite": "bg-green-500",
        "cloture": "bg-blue-500",
        "annule": "bg-red-500"
      };
      return classes[statut] || "bg-gray-500";
    };
    const getPriorityClasses = (priority) => {
      const classes = {
        "urgent": "bg-red-100 text-red-800",
        "important": "bg-orange-100 text-orange-800",
        "standard": "bg-blue-100 text-blue-800"
      };
      return classes[priority] || "bg-gray-100 text-gray-800";
    };
    const getPriorityDotClass = (priority) => {
      const classes = {
        "urgent": "bg-red-500",
        "important": "bg-orange-500",
        "standard": "bg-blue-500"
      };
      return classes[priority] || "bg-gray-500";
    };
    const handleOpenDocument = (url) => {
      if (url) {
        (void 0).open(url, "_blank", "noopener,noreferrer");
      } else {
        toast.add({
          title: "Information",
          description: "Aucun document disponible",
          color: "amber",
          timeout: 2e3
        });
      }
    };
    const handleSelectionChange = (selected) => {
      selectedRows.value = selected;
      console.log("S\xE9lection chang\xE9e:", selected);
    };
    const handleViewDetails = async (item) => {
      const details = `
    <div style="text-align: left; padding: 8px;">
      <div style="background-color: #faf5ff; border-radius: 8px; padding: 12px; border: 1px solid #e9d5ff; margin-bottom: 12px;">
        <p style="font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">Affectation</p>
        <p style="font-weight: 700; color: #7c3aed; font-size: 18px;">#${item.id}</p>
      </div>
      
      <div style="background-color: #eff6ff; border-radius: 8px; padding: 12px; border: 1px solid #bfdbfe; margin-bottom: 12px;">
        <p style="font-size: 12px; color: #6b7280; font-weight: 600; margin-bottom: 4px;">\u{1F4E8} Courrier</p>
        <p style="font-weight: 600; color: #1e40af; margin-bottom: 4px;">${item.reference_courrier}</p>
        <p style="font-size: 14px; color: #374151;">${item.objet_courrier}</p>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 12px; border: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #6b7280; font-weight: 600; margin-bottom: 4px;">\u{1F4C5} Date d'affectation</p>
          <p style="font-size: 14px; color: #111827;">${item.date_affect}</p>
        </div>
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 12px; border: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #6b7280; font-weight: 600; margin-bottom: 4px;">\u23F1\uFE0F Date de retour attendue</p>
          <p style="font-size: 14px; color: #111827;">${item.delai_traitement || "Non d\xE9fini"}</p>
        </div>
      </div>
      
      ${item.emetteur ? `
        <div style="background-color: #eef2ff; border-radius: 8px; padding: 12px; border: 1px solid #c7d2fe; margin-bottom: 12px;">
          <p style="font-size: 12px; color: #6b7280; font-weight: 600; margin-bottom: 4px;">\u{1F464} \xC9metteur</p>
          <p style="font-size: 14px; color: #374151;">${item.emetteur}</p>
        </div>
      ` : ""}
      
      <div style="background-color: #fef3c7; border-radius: 8px; padding: 12px; border: 1px solid #fde68a;">
        <p style="font-size: 12px; color: #6b7280; font-weight: 600; margin-bottom: 8px;">\u{1F4DD} Instructions</p>
        <p style="font-size: 14px; color: #374151; white-space: pre-wrap;">${item.instructions || "Aucune instruction"}</p>
      </div>
    </div>
  `;
      await Swal.fire({
        title: "\u{1F4CB} D\xE9tails du document",
        html: details,
        icon: "info",
        confirmButtonColor: "#7c3aed",
        confirmButtonText: "Fermer",
        width: "650px"
      });
    };
    const handleEdit = (item) => {
      console.log("Modifier l'affectation:", item);
    };
    const handleDelete = async (item) => {
      const result = await Swal.fire({
        title: "\u26A0\uFE0F Confirmer la suppression",
        html: `
      <div style="text-align: left; padding: 8px;">
        <p style="margin-bottom: 12px; color: #374151;">\xCAtes-vous s\xFBr de vouloir supprimer ce document ?</p>
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; border: 1px solid #e5e7eb;">
          <p style="font-weight: 600; color: #1e40af; margin-bottom: 4px;">${item.reference_courrier}</p>
          <p style="font-size: 14px; color: #374151;">${item.objet_courrier}</p>
        </div>
        <p style="margin-top: 12px; font-size: 14px; color: #dc2626; font-weight: 600;">\u26A0\uFE0F Cette action est irr\xE9versible.</p>
      </div>
    `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Oui, supprimer",
        cancelButtonText: "Annuler",
        reverseButtons: true
      });
      if (!result.isConfirmed) return;
      try {
        await $fetch(`${config.public.apiBase}/affectations/${item.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken.value}`
          }
        });
        await Swal.fire({
          title: "\u2705 Supprim\xE9 !",
          text: "Le document a \xE9t\xE9 supprim\xE9 avec succ\xE8s",
          icon: "success",
          timer: 2e3,
          showConfirmButton: false
        });
        await loadData();
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        await Swal.fire({
          title: "\u274C Erreur",
          text: "Impossible de supprimer le document",
          icon: "error",
          confirmButtonColor: "#7c3aed"
        });
      }
    };
    const handleQuickAssign = (courrierId) => {
      if (!courrierId) {
        toast.add({
          title: "Erreur",
          description: "ID du courrier introuvable",
          color: "red",
          timeout: 1500
        });
        return;
      }
      console.log("\u2705 Affectation rapide pour le courrier ID:", courrierId);
      navigateTo("/affectations/create");
    };
    const handleQuickTransfer = (courrierId) => {
      if (!courrierId) {
        toast.add({
          title: "Erreur",
          description: "ID du courrier introuvable",
          color: "red",
          timeout: 1500
        });
        return;
      }
      console.log("\u2705 Transfert rapide pour le courrier ID:", courrierId);
      navigateTo("/affectations-transferts/form-transfert");
    };
    const handleBulkExport = (selected) => {
      console.log("Export:", selected);
      toast.add({
        title: "Information",
        description: "Fonctionnalit\xE9 d'export en cours de d\xE9veloppement",
        color: "amber",
        timeout: 2e3
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0$2;
      const _component_UBadge = __nuxt_component_1;
      const _component_DataTable = _sfc_main$5;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-6 max-w-[1400px] mx-auto" }, _attrs))} data-v-268d4d4f><div class="flex items-center justify-between mb-6" data-v-268d4d4f><h1 class="flex items-center gap-3 text-2xl font-bold text-slate-800" data-v-268d4d4f>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "i-heroicons-inbox",
        class: "w-7 h-7 text-blue-600"
      }, null, _parent));
      _push(` Documents re\xE7us </h1><div class="flex items-center gap-3" data-v-268d4d4f><button class="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all hover:shadow-md" data-v-268d4d4f>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "i-heroicons-arrow-path",
        class: "w-4 h-4"
      }, null, _parent));
      _push(` Actualiser </button>`);
      _push(ssrRenderComponent(_component_UBadge, {
        color: "blue",
        variant: "soft",
        size: "lg",
        class: "ml-auto"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "i-heroicons-document-text",
              class: "h-4 w-4 mr-1"
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-sm" data-v-268d4d4f${_scopeId}>${ssrInterpolate(affectationData.value.length)} document${ssrInterpolate(affectationData.value.length > 1 ? "s" : "")}</span>`);
          } else {
            return [
              createVNode(_component_Icon, {
                name: "i-heroicons-document-text",
                class: "h-4 w-4 mr-1"
              }),
              createVNode("span", { class: "text-sm" }, toDisplayString(affectationData.value.length) + " document" + toDisplayString(affectationData.value.length > 1 ? "s" : ""), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
      if (error.value) {
        _push(`<div class="flex items-center gap-3 p-4 mb-5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" data-v-268d4d4f>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-exclamation-triangle",
          class: "w-5 h-5 flex-shrink-0"
        }, null, _parent));
        _push(`<span class="flex-1" data-v-268d4d4f>${ssrInterpolate(error.value)}</span><button class="text-lg opacity-60 hover:opacity-100 transition-opacity" data-v-268d4d4f> \u2715 </button></div>`);
      } else {
        _push(`<!---->`);
      }
      if (loading.value) {
        _push(`<div class="flex flex-col items-center justify-center py-16 gap-4" data-v-268d4d4f><div class="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" data-v-268d4d4f></div><p class="text-sm text-slate-500" data-v-268d4d4f>Chargement des documents...</p></div>`);
      } else {
        _push(ssrRenderComponent(_component_DataTable, {
          ref_key: "dataTableRef",
          ref: dataTableRef,
          "default-sort-column": null,
          "show-row-numbers": true,
          data: affectationData.value,
          columns,
          selectable: false,
          "items-per-page-options": [10, 25, 50, 100],
          "default-items-per-page": 10,
          "left-aligned-columns": ["objet_courrier", "instructions", "reference_courrier", "emetteur", "destinataire"],
          onEdit: handleEdit,
          onDelete: handleDelete,
          onOpenDocument: handleOpenDocument,
          onSelectionChange: handleSelectionChange
        }, {
          "advanced-filters": withCtx(({ filters, onFilter }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" data-v-268d4d4f${_scopeId}><div data-v-268d4d4f${_scopeId}><label class="block text-xs font-medium text-gray-700 mb-1" data-v-268d4d4f${_scopeId}>Date d&#39;affectation</label><input${ssrRenderAttr("value", filters.date_affect)} type="date" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" data-v-268d4d4f${_scopeId}></div><div data-v-268d4d4f${_scopeId}><label class="block text-xs font-medium text-gray-700 mb-1" data-v-268d4d4f${_scopeId}>Date de retour attendue</label><input${ssrRenderAttr("value", filters.delai_traitement)} type="date" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" data-v-268d4d4f${_scopeId}></div><div data-v-268d4d4f${_scopeId}><label class="block text-xs font-medium text-gray-700 mb-1" data-v-268d4d4f${_scopeId}>Date de cl\xF4ture</label><input${ssrRenderAttr("value", filters.date_cloture)} type="date" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" data-v-268d4d4f${_scopeId}></div><div data-v-268d4d4f${_scopeId}><label class="block text-xs font-medium text-gray-700 mb-1" data-v-268d4d4f${_scopeId}>\xC9metteur</label><input${ssrRenderAttr("value", filters.emetteur)} placeholder="Filtrer par \xE9metteur..." class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" data-v-268d4d4f${_scopeId}></div></div>`);
            } else {
              return [
                createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" }, [
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-xs font-medium text-gray-700 mb-1" }, "Date d'affectation"),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => filters.date_affect = $event,
                      type: "date",
                      class: "w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                      onInput: onFilter
                    }, null, 40, ["onUpdate:modelValue", "onInput"]), [
                      [vModelText, filters.date_affect]
                    ])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-xs font-medium text-gray-700 mb-1" }, "Date de retour attendue"),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => filters.delai_traitement = $event,
                      type: "date",
                      class: "w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                      onInput: onFilter
                    }, null, 40, ["onUpdate:modelValue", "onInput"]), [
                      [vModelText, filters.delai_traitement]
                    ])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-xs font-medium text-gray-700 mb-1" }, "Date de cl\xF4ture"),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => filters.date_cloture = $event,
                      type: "date",
                      class: "w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                      onInput: onFilter
                    }, null, 40, ["onUpdate:modelValue", "onInput"]), [
                      [vModelText, filters.date_cloture]
                    ])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-xs font-medium text-gray-700 mb-1" }, "\xC9metteur"),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => filters.emetteur = $event,
                      placeholder: "Filtrer par \xE9metteur...",
                      class: "w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                      onInput: onFilter
                    }, null, 40, ["onUpdate:modelValue", "onInput"]), [
                      [vModelText, filters.emetteur]
                    ])
                  ])
                ])
              ];
            }
          }),
          "cell-reference_courrier": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800" data-v-268d4d4f${_scopeId}>${ssrInterpolate(value)}</span>`);
            } else {
              return [
                createVNode("span", { class: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800" }, toDisplayString(value), 1)
              ];
            }
          }),
          "cell-statut": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="${ssrRenderClass([getStatutClasses(value), "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide"])}" data-v-268d4d4f${_scopeId}><span class="${ssrRenderClass([getStatutDotClass(value), "w-2 h-2 rounded-full mr-1.5"])}" data-v-268d4d4f${_scopeId}></span> ${ssrInterpolate(value)}</span>`);
            } else {
              return [
                createVNode("span", {
                  class: ["inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide", getStatutClasses(value)]
                }, [
                  createVNode("span", {
                    class: ["w-2 h-2 rounded-full mr-1.5", getStatutDotClass(value)]
                  }, null, 2),
                  createTextVNode(" " + toDisplayString(value), 1)
                ], 2)
              ];
            }
          }),
          "cell-priority": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="${ssrRenderClass([getPriorityClasses(value), "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide"])}" data-v-268d4d4f${_scopeId}><span class="${ssrRenderClass([getPriorityDotClass(value), "w-2 h-2 rounded-full mr-1.5"])}" data-v-268d4d4f${_scopeId}></span> ${ssrInterpolate(value)}</span>`);
            } else {
              return [
                createVNode("span", {
                  class: ["inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide", getPriorityClasses(value)]
                }, [
                  createVNode("span", {
                    class: ["w-2 h-2 rounded-full mr-1.5", getPriorityDotClass(value)]
                  }, null, 2),
                  createTextVNode(" " + toDisplayString(value), 1)
                ], 2)
              ];
            }
          }),
          "cell-instructions": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="block max-w-[300px] line-clamp-2 text-xs text-slate-700"${ssrRenderAttr("title", value)} data-v-268d4d4f${_scopeId}>${ssrInterpolate(value || "Aucune instruction")}</span>`);
            } else {
              return [
                createVNode("span", {
                  class: "block max-w-[300px] line-clamp-2 text-xs text-slate-700",
                  title: value
                }, toDisplayString(value || "Aucune instruction"), 9, ["title"])
              ];
            }
          }),
          actions: withCtx(({ item }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex gap-1.5 justify-end" data-v-268d4d4f${_scopeId}><button title="Voir les d\xE9tails" class="inline-flex items-center justify-center w-8 h-8 bg-amber-50 text-amber-700 border-amber-100 rounded-md hover:bg-amber-200 :hover:text-amber-900 hover:border-amber-900 transition-all group" data-v-268d4d4f${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                name: "i-heroicons-eye",
                class: "w-4 h-4 group-hover:text-yellow-600"
              }, null, _parent2, _scopeId));
              _push2(`</button>`);
              if (isResponsable.value) {
                _push2(`<button${ssrIncludeBooleanAttr(!item.courrier_id) ? " disabled" : ""} title="Affecter ce courrier" class="inline-flex items-center justify-center w-8 h-8 bg-sky-50 text-sky-700 border-sky-100 rounded-md hover:bg-sky-200 :hover:text-sky-900 hover:border-sky-900 transition-all group" data-v-268d4d4f${_scopeId}>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "i-heroicons-paper-airplane",
                  class: "w-4 h-4 group-hover:text-blue-600"
                }, null, _parent2, _scopeId));
                _push2(`</button>`);
              } else {
                _push2(`<!---->`);
              }
              if (isResponsable.value) {
                _push2(`<button${ssrIncludeBooleanAttr(!item.courrier_id) ? " disabled" : ""} title="Transf\xE9rer ce courrier" class="inline-flex items-center justify-center w-8 h-8 bg-emerald-50 text-emerald-700 border-emerald-100 rounded-md hover:bg-emerald-200 :hover:text-emerald-900 hover:border-emerald-900 transition-all group" data-v-268d4d4f${_scopeId}>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "i-heroicons-arrow-path-rounded-square",
                  class: "w-4 h-4 group-hover:text-green-600"
                }, null, _parent2, _scopeId));
                _push2(`</button>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { class: "flex gap-1.5 justify-end" }, [
                  createVNode("button", {
                    onClick: ($event) => handleViewDetails(item),
                    title: "Voir les d\xE9tails",
                    class: "inline-flex items-center justify-center w-8 h-8 bg-amber-50 text-amber-700 border-amber-100 rounded-md hover:bg-amber-200 :hover:text-amber-900 hover:border-amber-900 transition-all group"
                  }, [
                    createVNode(_component_Icon, {
                      name: "i-heroicons-eye",
                      class: "w-4 h-4 group-hover:text-yellow-600"
                    })
                  ], 8, ["onClick"]),
                  isResponsable.value ? (openBlock(), createBlock("button", {
                    key: 0,
                    onClick: ($event) => handleQuickAssign(item.courrier_id),
                    disabled: !item.courrier_id,
                    title: "Affecter ce courrier",
                    class: "inline-flex items-center justify-center w-8 h-8 bg-sky-50 text-sky-700 border-sky-100 rounded-md hover:bg-sky-200 :hover:text-sky-900 hover:border-sky-900 transition-all group"
                  }, [
                    createVNode(_component_Icon, {
                      name: "i-heroicons-paper-airplane",
                      class: "w-4 h-4 group-hover:text-blue-600"
                    })
                  ], 8, ["onClick", "disabled"])) : createCommentVNode("", true),
                  isResponsable.value ? (openBlock(), createBlock("button", {
                    key: 1,
                    onClick: ($event) => handleQuickTransfer(item.courrier_id),
                    disabled: !item.courrier_id,
                    title: "Transf\xE9rer ce courrier",
                    class: "inline-flex items-center justify-center w-8 h-8 bg-emerald-50 text-emerald-700 border-emerald-100 rounded-md hover:bg-emerald-200 :hover:text-emerald-900 hover:border-emerald-900 transition-all group"
                  }, [
                    createVNode(_component_Icon, {
                      name: "i-heroicons-arrow-path-rounded-square",
                      class: "w-4 h-4 group-hover:text-green-600"
                    })
                  ], 8, ["onClick", "disabled"])) : createCommentVNode("", true)
                ])
              ];
            }
          }),
          "cell-reference": withCtx(({ value, item }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (item.url) {
                _push2(`<button class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 rounded-md transition-all group"${ssrRenderAttr("title", `Ouvrir le document ${value}`)} data-v-268d4d4f${_scopeId}>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "i-heroicons-document-text",
                  class: "w-3.5 h-3.5 group-hover:scale-110 transition-transform"
                }, null, _parent2, _scopeId));
                _push2(`<span data-v-268d4d4f${_scopeId}>${ssrInterpolate(value)}</span>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "i-heroicons-arrow-top-right-on-square",
                  class: "w-3 h-3 opacity-60 group-hover:opacity-100"
                }, null, _parent2, _scopeId));
                _push2(`</button>`);
              } else {
                _push2(`<span class="inline-flex items-center px-2.5 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md"${ssrRenderAttr("title", value)} data-v-268d4d4f${_scopeId}>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "i-heroicons-document-text",
                  class: "w-3.5 h-3.5 mr-1.5 opacity-50"
                }, null, _parent2, _scopeId));
                _push2(` ${ssrInterpolate(value)}</span>`);
              }
            } else {
              return [
                item.url ? (openBlock(), createBlock("button", {
                  key: 0,
                  onClick: ($event) => _ctx.onOpenDocument(item.url),
                  class: "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 rounded-md transition-all group",
                  title: `Ouvrir le document ${value}`
                }, [
                  createVNode(_component_Icon, {
                    name: "i-heroicons-document-text",
                    class: "w-3.5 h-3.5 group-hover:scale-110 transition-transform"
                  }),
                  createVNode("span", null, toDisplayString(value), 1),
                  createVNode(_component_Icon, {
                    name: "i-heroicons-arrow-top-right-on-square",
                    class: "w-3 h-3 opacity-60 group-hover:opacity-100"
                  })
                ], 8, ["onClick", "title"])) : (openBlock(), createBlock("span", {
                  key: 1,
                  class: "inline-flex items-center px-2.5 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md",
                  title: value
                }, [
                  createVNode(_component_Icon, {
                    name: "i-heroicons-document-text",
                    class: "w-3.5 h-3.5 mr-1.5 opacity-50"
                  }),
                  createTextVNode(" " + toDisplayString(value), 1)
                ], 8, ["title"]))
              ];
            }
          }),
          "selection-actions": withCtx(({ selected }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<button class="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 hover:border-red-300 transition-all" data-v-268d4d4f${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                name: "i-heroicons-trash",
                class: "w-4 h-4"
              }, null, _parent2, _scopeId));
              _push2(` Supprimer (${ssrInterpolate(selected.length)}) </button><button class="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-all" data-v-268d4d4f${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                name: "i-heroicons-arrow-down-tray",
                class: "w-4 h-4"
              }, null, _parent2, _scopeId));
              _push2(` Exporter (${ssrInterpolate(selected.length)}) </button>`);
            } else {
              return [
                createVNode("button", {
                  onClick: ($event) => _ctx.handleBulkDelete(selected),
                  class: "flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 hover:border-red-300 transition-all"
                }, [
                  createVNode(_component_Icon, {
                    name: "i-heroicons-trash",
                    class: "w-4 h-4"
                  }),
                  createTextVNode(" Supprimer (" + toDisplayString(selected.length) + ") ", 1)
                ], 8, ["onClick"]),
                createVNode("button", {
                  onClick: ($event) => handleBulkExport(selected),
                  class: "flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-all"
                }, [
                  createVNode(_component_Icon, {
                    name: "i-heroicons-arrow-down-tray",
                    class: "w-4 h-4"
                  }),
                  createTextVNode(" Exporter (" + toDisplayString(selected.length) + ") ", 1)
                ], 8, ["onClick"])
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/documents/AffectationsListe.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const AffectationsListe = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-268d4d4f"]]);
const _sfc_main$1 = {
  __name: "CourriersVisibles",
  __ssrInlineRender: true,
  setup(__props) {
    useToast();
    const courrierData = ref([]);
    const loading = ref(false);
    const error = ref(null);
    ref("");
    const columns = [
      { key: "reference", label: "R\xE9f\xE9rence", visible: true, width: "min-w-[180px]", showLabel: false },
      { key: "objet", label: "Objet", visible: true, width: "min-w-[250px]", showLabel: false },
      { key: "type_document", label: "Type document", visible: true, width: "min-w-[180px]", showLabel: false },
      { key: "date_depart", label: "Date d\xE9part", visible: true, width: "min-w-[120px]", showLabel: false },
      { key: "service_emis", label: "Service \xE9metteur", visible: true, width: "min-w-[150px]", showLabel: false },
      { key: "destinataire", label: "Destinataire", visible: true, width: "min-w-[150px]", showLabel: false },
      { key: "initiateurs", label: "Initiateur(s)", visible: false, width: "min-w-[200px]" },
      { key: "type_depart", label: "Type", visible: false, width: "min-w-[100px]" },
      { key: "confidentiel", label: "Confidentialit\xE9", visible: false, width: "min-w-[130px]" }
    ];
    const handleOpenDocument = (url) => {
      if (url) (void 0).open(url, "_blank", "noopener,noreferrer");
    };
    const handleViewDetails = (item) => {
      console.log("D\xE9tails:", item);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0$2;
      const _component_UBadge = __nuxt_component_1;
      const _component_DataTable = _sfc_main$5;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-6 max-w-[1400px] mx-auto" }, _attrs))}><div class="flex items-center justify-between mb-6"><h1 class="flex items-center gap-3 text-2xl font-bold text-slate-800">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "i-heroicons-eye",
        class: "w-7 h-7 text-blue-600"
      }, null, _parent));
      _push(` Initi\xE9s/Paraph\xE9s </h1><div class="flex items-center gap-3"><button class="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all hover:shadow-md">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "i-heroicons-arrow-path",
        class: "w-4 h-4"
      }, null, _parent));
      _push(` Actualiser </button>`);
      _push(ssrRenderComponent(_component_UBadge, {
        color: "blue",
        variant: "soft",
        size: "lg"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "i-heroicons-document-text",
              class: "h-4 w-4 mr-1"
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-sm"${_scopeId}>${ssrInterpolate(courrierData.value.length)} courrier${ssrInterpolate(courrierData.value.length > 1 ? "s" : "")}</span>`);
          } else {
            return [
              createVNode(_component_Icon, {
                name: "i-heroicons-document-text",
                class: "h-4 w-4 mr-1"
              }),
              createVNode("span", { class: "text-sm" }, toDisplayString(courrierData.value.length) + " courrier" + toDisplayString(courrierData.value.length > 1 ? "s" : ""), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
      if (error.value) {
        _push(`<div class="flex items-center gap-3 p-4 mb-5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-exclamation-triangle",
          class: "w-5 h-5 flex-shrink-0"
        }, null, _parent));
        _push(`<span class="flex-1">${ssrInterpolate(error.value)}</span><button class="text-lg opacity-60 hover:opacity-100">\u2715</button></div>`);
      } else {
        _push(`<!---->`);
      }
      if (loading.value) {
        _push(`<div class="flex flex-col items-center justify-center py-16 gap-4"><div class="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div><p class="text-sm text-slate-500">Chargement des courriers...</p></div>`);
      } else {
        _push(ssrRenderComponent(_component_DataTable, {
          data: courrierData.value,
          columns,
          selectable: false,
          "show-row-numbers": true,
          "default-items-per-page": 10,
          "items-per-page-options": [10, 25, 50, 100],
          "left-aligned-columns": ["objet", "destinataire", "service_emis"]
        }, {
          "cell-reference": withCtx(({ value, item }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (item.url) {
                _push2(`<button class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-all group"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "i-heroicons-document-text",
                  class: "w-3.5 h-3.5"
                }, null, _parent2, _scopeId));
                _push2(`<span${_scopeId}>${ssrInterpolate(value)}</span>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "i-heroicons-arrow-top-right-on-square",
                  class: "w-3 h-3 opacity-60 group-hover:opacity-100"
                }, null, _parent2, _scopeId));
                _push2(`</button>`);
              } else {
                _push2(`<span class="inline-flex items-center px-2.5 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md"${_scopeId}>${ssrInterpolate(value)}</span>`);
              }
            } else {
              return [
                item.url ? (openBlock(), createBlock("button", {
                  key: 0,
                  onClick: ($event) => handleOpenDocument(item.url),
                  class: "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-all group"
                }, [
                  createVNode(_component_Icon, {
                    name: "i-heroicons-document-text",
                    class: "w-3.5 h-3.5"
                  }),
                  createVNode("span", null, toDisplayString(value), 1),
                  createVNode(_component_Icon, {
                    name: "i-heroicons-arrow-top-right-on-square",
                    class: "w-3 h-3 opacity-60 group-hover:opacity-100"
                  })
                ], 8, ["onClick"])) : (openBlock(), createBlock("span", {
                  key: 1,
                  class: "inline-flex items-center px-2.5 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md"
                }, toDisplayString(value), 1))
              ];
            }
          }),
          "cell-confidentiel": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (value) {
                _push2(`<span class="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-red-700 bg-red-50 rounded-full"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "i-heroicons-lock-closed",
                  class: "w-3 h-3"
                }, null, _parent2, _scopeId));
                _push2(` Confidentiel </span>`);
              } else {
                _push2(`<span class="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-green-700 bg-green-50 rounded-full"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "i-heroicons-lock-open",
                  class: "w-3 h-3"
                }, null, _parent2, _scopeId));
                _push2(` Standard </span>`);
              }
            } else {
              return [
                value ? (openBlock(), createBlock("span", {
                  key: 0,
                  class: "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-red-700 bg-red-50 rounded-full"
                }, [
                  createVNode(_component_Icon, {
                    name: "i-heroicons-lock-closed",
                    class: "w-3 h-3"
                  }),
                  createTextVNode(" Confidentiel ")
                ])) : (openBlock(), createBlock("span", {
                  key: 1,
                  class: "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-green-700 bg-green-50 rounded-full"
                }, [
                  createVNode(_component_Icon, {
                    name: "i-heroicons-lock-open",
                    class: "w-3 h-3"
                  }),
                  createTextVNode(" Standard ")
                ]))
              ];
            }
          }),
          actions: withCtx(({ item }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex gap-1.5 justify-end"${_scopeId}><button title="Voir les d\xE9tails" class="inline-flex items-center justify-center w-8 h-8 bg-amber-50 text-amber-700 rounded-md hover:bg-amber-200 transition-all group"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                name: "i-heroicons-eye",
                class: "w-4 h-4"
              }, null, _parent2, _scopeId));
              _push2(`</button></div>`);
            } else {
              return [
                createVNode("div", { class: "flex gap-1.5 justify-end" }, [
                  createVNode("button", {
                    onClick: ($event) => handleViewDetails(item),
                    title: "Voir les d\xE9tails",
                    class: "inline-flex items-center justify-center w-8 h-8 bg-amber-50 text-amber-700 rounded-md hover:bg-amber-200 transition-all group"
                  }, [
                    createVNode(_component_Icon, {
                      name: "i-heroicons-eye",
                      class: "w-4 h-4"
                    })
                  ], 8, ["onClick"])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/documents/CourriersVisibles.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "MyDocuments",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({ title: "Mes Documents - Sagar Revolution" });
    const tabList = ref([
      { id: "affectations", label: "Documents re\xE7us", icon: "i-heroicons-inbox", count: null },
      { id: "visibilite", label: "Initi\xE9s/Paraph\xE9s", icon: "i-heroicons-eye", count: null }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col p-5" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$3, {
        title: "Mes Documents",
        subtitle: "Documents re\xE7us et courriers en visibilit\xE9"
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$4, { tabs: tabList.value }, {
        affectations: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}>`);
            _push2(ssrRenderComponent(AffectationsListe, null, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                createVNode(AffectationsListe)
              ])
            ];
          }
        }),
        visibilite: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$1, null, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                createVNode(_sfc_main$1)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/documents/MyDocuments.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=MyDocuments-C_QfQrXS.mjs.map
