import { _ as _export_sfc, u as useHead, r as useToast, c as __nuxt_component_0$2, d as __nuxt_component_1$1, b as useRuntimeConfig } from './server.mjs';
import __nuxt_component_1 from './Badge-DIEXPf_r.mjs';
import { _ as _sfc_main$1 } from './DataTable-Cb4WL8Ep.mjs';
import { ref, mergeProps, withCtx, createTextVNode, createVNode, toDisplayString, createBlock, openBlock, withDirectives, vModelText, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
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

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Rattachements de Courriers - Sagar Revolution"
    });
    const config = useRuntimeConfig();
    const columns = [
      {
        key: "ref_arrivee",
        label: "R\xE9f. Arriv\xE9e",
        visible: true,
        width: "min-w-[150px]"
      },
      {
        key: "objet_arrivee",
        label: "Objet Arriv\xE9e",
        visible: true,
        width: "min-w-[250px]"
      },
      {
        key: "doc_arrivee",
        label: "Doc. Arriv\xE9e",
        visible: false,
        type: "document",
        width: "w-24"
      },
      {
        key: "link",
        label: "\u2192",
        visible: true,
        width: "w-16",
        sortable: false,
        filterable: false
      },
      {
        key: "ref_depart",
        label: "R\xE9f. D\xE9part",
        visible: true,
        width: "min-w-[150px]"
      },
      {
        key: "objet_depart",
        label: "Objet D\xE9part",
        visible: true,
        width: "min-w-[250px]"
      },
      {
        key: "doc_depart",
        label: "Doc. D\xE9part",
        visible: false,
        type: "document",
        width: "w-24"
      },
      {
        key: "created_at",
        label: "Date de cr\xE9ation",
        visible: true,
        width: "min-w-[140px]"
      }
    ];
    const authToken = ref("");
    const rattachementData = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const dataTableRef = ref(null);
    const toast = useToast();
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
      return reponseAPI.data.map((rattachement) => {
        var _a, _b, _c, _d, _e, _f, _g;
        return {
          id: rattachement.id,
          ref_arrivee: ((_a = rattachement == null ? void 0 : rattachement.document) == null ? void 0 : _a.reference) || "",
          objet_arrivee: ((_b = rattachement == null ? void 0 : rattachement.document) == null ? void 0 : _b.objet) || "",
          doc_arrivee: ((_c = rattachement == null ? void 0 : rattachement.document) == null ? void 0 : _c.url) ? `$fetch(${config.public.baseUrl}/${rattachement.document.url}` : "",
          link: "\u2192",
          ref_depart: ((_d = rattachement == null ? void 0 : rattachement.reponse) == null ? void 0 : _d.reference) || "",
          objet_depart: ((_e = rattachement == null ? void 0 : rattachement.reponse) == null ? void 0 : _e.objet) || "",
          doc_depart: ((_f = rattachement == null ? void 0 : rattachement.reponse) == null ? void 0 : _f.url) ? `$fetch(${config.public.baseUrl}/${rattachement.reponse.url}` : "",
          created_at: formatDate(rattachement.created_at),
          created_by: ((_g = rattachement.user) == null ? void 0 : _g.name) || "Syst\xE8me",
          courrier_arrivee: rattachement.document,
          courrier_depart: rattachement.reponse
        };
      });
    };
    const loadData = async () => {
      if (!authToken.value) {
        error.value = "Token d'authentification manquant";
        toast.add({
          title: "Erreur",
          description: "Session expir\xE9e. Veuillez vous reconnecter.",
          color: "red",
          timeout: 1500
        });
        return;
      }
      loading.value = true;
      error.value = null;
      try {
        const reponse = await $fetch(`${config.public.apiBase}/reponses`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken.value}`
          }
        });
        rattachementData.value = transformerDonneesAPI(reponse);
        console.log(`\u2705 ${rattachementData.value.length} rattachements charg\xE9s`);
      } catch (err) {
        console.error("\u274C Erreur de chargement:", err);
        error.value = err.message || "Impossible de charger les rattachements";
        toast.add({
          title: "Erreur",
          description: "Impossible de charger les rattachements",
          color: "red",
          timeout: 1500
        });
      } finally {
        loading.value = false;
      }
    };
    const openDocument = (url) => {
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
    const viewDetails = async (item) => {
      await Swal.fire({
        title: "\u{1F4CB} D\xE9tails du rattachement",
        html: `
      <div style="text-align: left; padding: 8px;">
        <!-- Courrier Arriv\xE9e -->
        <div style="background-color: #eff6ff; border-radius: 8px; padding: 12px; border: 1px solid #bfdbfe; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <svg style="height: 20px; width: 20px; color: #2563eb;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
            <h3 style="font-weight: 600; color: #1e40af; margin: 0;">Courrier Arriv\xE9e</h3>
          </div>
          <p style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">R\xE9f\xE9rence</p>
          <p style="font-weight: 600; color: #1e40af; margin-bottom: 8px;">${item.ref_arrivee}</p>
          <p style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Objet</p>
          <p style="font-size: 14px; color: #374151;">${item.objet_arrivee}</p>
        </div>

        <!-- Fl\xE8che -->
        <div style="display: flex; justify-content: center; margin: 12px 0;">
          <svg style="height: 24px; width: 24px; color: #9333ea;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
        </div>

        <!-- Courrier D\xE9part -->
        <div style="background-color: #f0fdf4; border-radius: 8px; padding: 12px; border: 1px solid #bbf7d0; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <svg style="height: 20px; width: 20px; color: #16a34a;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
            <h3 style="font-weight: 600; color: #166534; margin: 0;">Courrier D\xE9part</h3>
          </div>
          <p style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">R\xE9f\xE9rence</p>
          <p style="font-weight: 600; color: #166534; margin-bottom: 8px;">${item.ref_depart}</p>
          <p style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Objet</p>
          <p style="font-size: 14px; color: #374151;">${item.objet_depart}</p>
        </div>

        <!-- M\xE9tadonn\xE9es -->
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 12px; border: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Date de cr\xE9ation</p>
          <p style="font-size: 14px; color: #111827;">${item.created_at}</p>
        </div>
      </div>
    `,
        width: "600px",
        confirmButtonText: "Fermer",
        confirmButtonColor: "#7c3aed"
      });
    };
    const deleteItem = async (item) => {
      const result = await Swal.fire({
        title: "\u26A0\uFE0F Confirmer la suppression",
        html: `
      <div style="text-align: left; padding: 8px;">
        <p style="margin-bottom: 12px; color: #374151;">\xCAtes-vous s\xFBr de vouloir supprimer ce rattachement ?</p>
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; border: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: center; gap: 8px;">
          <span style="display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 500; background-color: #dbeafe; color: #1e40af;">
            ${item.ref_arrivee}
          </span>
          <svg style="height: 16px; width: 16px; color: #9333ea;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
          <span style="display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 500; background-color: #dcfce7; color: #166534;">
            ${item.ref_depart}
          </span>
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
        await $fetch(`${config.public.apiBase}/reponses/${item.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken.value}`
          }
        });
        await Swal.fire({
          title: "\u2705 Supprim\xE9 !",
          text: "Le rattachement a \xE9t\xE9 supprim\xE9 avec succ\xE8s",
          icon: "success",
          timer: 2e3,
          showConfirmButton: false
        });
        await loadData();
      } catch (err) {
        console.error("\u274C Erreur lors de la suppression:", err);
        await Swal.fire({
          title: "\u274C Erreur",
          text: "Impossible de supprimer le rattachement",
          icon: "error",
          confirmButtonColor: "#7c3aed"
        });
      }
    };
    const deleteSelected = async (selectedIds) => {
      const result = await Swal.fire({
        title: "\u26A0\uFE0F Suppression multiple",
        html: `
      <div style="text-align: left; padding: 8px;">
        <p style="margin-bottom: 12px; color: #374151;">\xCAtes-vous s\xFBr de vouloir supprimer <strong style="color: #dc2626;">${selectedIds.length} rattachement(s)</strong> ?</p>
        <div style="background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 12px; margin-bottom: 12px;">
          <p style="font-size: 14px; color: #92400e;">\u26A0\uFE0F Cette action supprimera tous les rattachements s\xE9lectionn\xE9s de mani\xE8re permanente.</p>
        </div>
        <p style="font-size: 14px; color: #dc2626; font-weight: 600;">Cette action est irr\xE9versible.</p>
      </div>
    `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
        confirmButtonText: `Supprimer ${selectedIds.length}`,
        cancelButtonText: "Annuler",
        reverseButtons: true
      });
      if (!result.isConfirmed) return;
      try {
        await Promise.all(
          selectedIds.map(
            (id) => $fetch(`${config.public.apiBase}/reponses/${id}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${authToken.value}`
              }
            })
          )
        );
        await Swal.fire({
          title: "\u2705 Supprim\xE9s !",
          text: `${selectedIds.length} rattachement(s) supprim\xE9(s)`,
          icon: "success",
          timer: 2e3,
          showConfirmButton: false
        });
        await loadData();
      } catch (err) {
        console.error("\u274C Erreur lors de la suppression multiple:", err);
        await Swal.fire({
          title: "\u274C Erreur",
          text: "Impossible de supprimer les rattachements",
          icon: "error",
          confirmButtonColor: "#7c3aed"
        });
      }
    };
    const handleSelectionChange = (selected) => {
      console.log(`${selected.length} ligne(s) s\xE9lectionn\xE9e(s)`, selected);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0$2;
      const _component_UBadge = __nuxt_component_1;
      const _component_UButton = __nuxt_component_1$1;
      const _component_DataTable = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-6 max-w-[1400px] mx-auto" }, _attrs))} data-v-6ffde357><div class="flex items-center justify-between mb-6" data-v-6ffde357><h1 class="flex items-center gap-3 text-2xl font-bold text-slate-800" data-v-6ffde357>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "i-heroicons-link",
        class: "w-7 h-7 text-blue-600"
      }, null, _parent));
      _push(` Rattachements de Courriers </h1><div class="flex items-center gap-3" data-v-6ffde357><button class="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all hover:shadow-md" data-v-6ffde357>`);
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
              name: "i-heroicons-plus",
              class: "h-4 w-4 mr-1"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              to: "/rattachements/create",
              variant: "text",
              size: "sm",
              class: "p-0 m-0 text-blue-600"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Nouveau `);
                } else {
                  return [
                    createTextVNode(" Nouveau ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Icon, {
                name: "i-heroicons-plus",
                class: "h-4 w-4 mr-1"
              }),
              createVNode(_component_UButton, {
                to: "/rattachements/create",
                variant: "text",
                size: "sm",
                class: "p-0 m-0 text-blue-600"
              }, {
                default: withCtx(() => [
                  createTextVNode(" Nouveau ")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
      if (error.value) {
        _push(`<div class="flex items-center gap-3 p-4 mb-5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" data-v-6ffde357>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-exclamation-triangle",
          class: "w-5 h-5 flex-shrink-0"
        }, null, _parent));
        _push(`<span class="flex-1" data-v-6ffde357>${ssrInterpolate(error.value)}</span><button class="text-lg opacity-60 hover:opacity-100 transition-opacity" data-v-6ffde357> \u2715 </button></div>`);
      } else {
        _push(`<!---->`);
      }
      if (loading.value) {
        _push(`<div class="flex flex-col items-center justify-center py-16 gap-4" data-v-6ffde357><div class="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" data-v-6ffde357></div><p class="text-sm text-slate-500" data-v-6ffde357>Chargement des rattachements...</p></div>`);
      } else {
        _push(ssrRenderComponent(_component_DataTable, {
          ref_key: "dataTableRef",
          ref: dataTableRef,
          "default-sort-column": null,
          "show-row-numbers": true,
          data: rattachementData.value,
          columns,
          selectable: false,
          "default-items-per-page": 10,
          "items-per-page-options": [10, 25, 50, 100],
          "left-aligned-columns": ["objet_arrivee", "objet_depart", "ref_depart", "ref_arrivee"],
          onView: viewDetails,
          onDelete: deleteItem,
          onOpenDocument: openDocument,
          onSelectionChange: handleSelectionChange
        }, {
          "advanced-filters": withCtx(({ filters, onFilter }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-v-6ffde357${_scopeId}><div data-v-6ffde357${_scopeId}><label class="block text-xs font-medium text-gray-700 mb-1" data-v-6ffde357${_scopeId}>Date de cr\xE9ation</label><input${ssrRenderAttr("value", filters.created_at)} type="date" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" data-v-6ffde357${_scopeId}></div></div>`);
            } else {
              return [
                createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" }, [
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-xs font-medium text-gray-700 mb-1" }, "Date de cr\xE9ation"),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => filters.created_at = $event,
                      type: "date",
                      class: "w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                      onInput: onFilter
                    }, null, 40, ["onUpdate:modelValue", "onInput"]), [
                      [vModelText, filters.created_at]
                    ])
                  ])
                ])
              ];
            }
          }),
          "selection-actions": withCtx(({ selected }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<button class="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 hover:border-red-300 transition-all" data-v-6ffde357${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                name: "i-heroicons-trash",
                class: "w-4 h-4"
              }, null, _parent2, _scopeId));
              _push2(` Supprimer (${ssrInterpolate(selected.length)}) </button>`);
            } else {
              return [
                createVNode("button", {
                  onClick: ($event) => deleteSelected(selected),
                  class: "flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 hover:border-red-300 transition-all"
                }, [
                  createVNode(_component_Icon, {
                    name: "i-heroicons-trash",
                    class: "w-4 h-4"
                  }),
                  createTextVNode(" Supprimer (" + toDisplayString(selected.length) + ") ", 1)
                ], 8, ["onClick"])
              ];
            }
          }),
          "cell-ref_arrivee": withCtx(({ value, item }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (item.doc_arrivee) {
                _push2(`<button class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 rounded-full transition-all group"${ssrRenderAttr("title", `Ouvrir le document ${value}`)} data-v-6ffde357${_scopeId}>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "i-heroicons-document-text",
                  class: "w-3.5 h-3.5 group-hover:scale-110 transition-transform"
                }, null, _parent2, _scopeId));
                _push2(`<span data-v-6ffde357${_scopeId}>${ssrInterpolate(value)}</span>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "i-heroicons-arrow-top-right-on-square",
                  class: "w-3 h-3 opacity-60 group-hover:opacity-100"
                }, null, _parent2, _scopeId));
                _push2(`</button>`);
              } else {
                _push2(`<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600"${ssrRenderAttr("title", value)} data-v-6ffde357${_scopeId}>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "i-heroicons-document-text",
                  class: "w-3.5 h-3.5 mr-1.5 opacity-50"
                }, null, _parent2, _scopeId));
                _push2(` ${ssrInterpolate(value)}</span>`);
              }
            } else {
              return [
                item.doc_arrivee ? (openBlock(), createBlock("button", {
                  key: 0,
                  onClick: ($event) => openDocument(item.doc_arrivee),
                  class: "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 rounded-full transition-all group",
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
                  class: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600",
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
          "cell-ref_depart": withCtx(({ value, item }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (item.doc_depart) {
                _push2(`<button class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 hover:border-green-300 rounded-full transition-all group"${ssrRenderAttr("title", `Ouvrir le document ${value}`)} data-v-6ffde357${_scopeId}>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "i-heroicons-document-text",
                  class: "w-3.5 h-3.5 group-hover:scale-110 transition-transform"
                }, null, _parent2, _scopeId));
                _push2(`<span data-v-6ffde357${_scopeId}>${ssrInterpolate(value)}</span>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "i-heroicons-arrow-top-right-on-square",
                  class: "w-3 h-3 opacity-60 group-hover:opacity-100"
                }, null, _parent2, _scopeId));
                _push2(`</button>`);
              } else {
                _push2(`<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600"${ssrRenderAttr("title", value)} data-v-6ffde357${_scopeId}>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "i-heroicons-document-text",
                  class: "w-3.5 h-3.5 mr-1.5 opacity-50"
                }, null, _parent2, _scopeId));
                _push2(` ${ssrInterpolate(value)}</span>`);
              }
            } else {
              return [
                item.doc_depart ? (openBlock(), createBlock("button", {
                  key: 0,
                  onClick: ($event) => openDocument(item.doc_depart),
                  class: "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 hover:border-green-300 rounded-full transition-all group",
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
                  class: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600",
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
          "cell-link": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex justify-center" data-v-6ffde357${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                name: "i-heroicons-arrow-right-circle",
                class: "h-5 w-5 text-purple-600"
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { class: "flex justify-center" }, [
                  createVNode(_component_Icon, {
                    name: "i-heroicons-arrow-right-circle",
                    class: "h-5 w-5 text-purple-600"
                  })
                ])
              ];
            }
          }),
          "cell-objet_arrivee": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="block max-w-[300px] line-clamp-2 text-xs text-slate-700"${ssrRenderAttr("title", value)} data-v-6ffde357${_scopeId}>${ssrInterpolate(value || "Sans objet")}</span>`);
            } else {
              return [
                createVNode("span", {
                  class: "block max-w-[300px] line-clamp-2 text-xs text-slate-700",
                  title: value
                }, toDisplayString(value || "Sans objet"), 9, ["title"])
              ];
            }
          }),
          "cell-objet_depart": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="block max-w-[300px] line-clamp-2 text-xs text-slate-700"${ssrRenderAttr("title", value)} data-v-6ffde357${_scopeId}>${ssrInterpolate(value || "Sans objet")}</span>`);
            } else {
              return [
                createVNode("span", {
                  class: "block max-w-[300px] line-clamp-2 text-xs text-slate-700",
                  title: value
                }, toDisplayString(value || "Sans objet"), 9, ["title"])
              ];
            }
          }),
          actions: withCtx(({ item }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex gap-1.5 justify-end" data-v-6ffde357${_scopeId}><button title="Voir les d\xE9tails" class="inline-flex items-center justify-center w-8 h-8 bg-amber-50 text-amber-700 border-amber-100 rounded-md hover:bg-amber-200 hover:border-amber-900 transition-all group" data-v-6ffde357${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                name: "i-heroicons-eye",
                class: "w-4 h-4 group-hover:text-yellow-600"
              }, null, _parent2, _scopeId));
              _push2(`</button><button title="Supprimer" class="inline-flex items-center justify-center w-8 h-8 bg-red-50 text-red-700 border-red-100 rounded-md hover:bg-red-200 hover:border-red-900 transition-all group" data-v-6ffde357${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                name: "i-heroicons-trash",
                class: "w-4 h-4 group-hover:text-red-600"
              }, null, _parent2, _scopeId));
              _push2(`</button></div>`);
            } else {
              return [
                createVNode("div", { class: "flex gap-1.5 justify-end" }, [
                  createVNode("button", {
                    onClick: ($event) => viewDetails(item),
                    title: "Voir les d\xE9tails",
                    class: "inline-flex items-center justify-center w-8 h-8 bg-amber-50 text-amber-700 border-amber-100 rounded-md hover:bg-amber-200 hover:border-amber-900 transition-all group"
                  }, [
                    createVNode(_component_Icon, {
                      name: "i-heroicons-eye",
                      class: "w-4 h-4 group-hover:text-yellow-600"
                    })
                  ], 8, ["onClick"]),
                  createVNode("button", {
                    onClick: ($event) => deleteItem(item),
                    title: "Supprimer",
                    class: "inline-flex items-center justify-center w-8 h-8 bg-red-50 text-red-700 border-red-100 rounded-md hover:bg-red-200 hover:border-red-900 transition-all group"
                  }, [
                    createVNode(_component_Icon, {
                      name: "i-heroicons-trash",
                      class: "w-4 h-4 group-hover:text-red-600"
                    })
                  ], 8, ["onClick"])
                ])
              ];
            }
          }),
          "empty-state": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="text-center py-12" data-v-6ffde357${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                name: "i-heroicons-link-slash",
                class: "mx-auto h-16 w-16 text-gray-400 mb-4"
              }, null, _parent2, _scopeId));
              _push2(`<h3 class="text-lg font-medium text-gray-900 mb-2" data-v-6ffde357${_scopeId}>Aucun rattachement</h3><p class="text-sm text-gray-500 mb-6" data-v-6ffde357${_scopeId}> Commencez par cr\xE9er un rattachement entre un courrier arriv\xE9e et un courrier d\xE9part. </p>`);
              _push2(ssrRenderComponent(_component_UBadge, {
                color: "blue",
                variant: "soft",
                size: "lg"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_Icon, {
                      name: "i-heroicons-plus",
                      class: "h-4 w-4 mr-1"
                    }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_UButton, {
                      to: "/rattachements/create",
                      variant: "text",
                      size: "sm",
                      class: "p-0 m-0 text-blue-600"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(` Cr\xE9er un rattachement `);
                        } else {
                          return [
                            createTextVNode(" Cr\xE9er un rattachement ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_Icon, {
                        name: "i-heroicons-plus",
                        class: "h-4 w-4 mr-1"
                      }),
                      createVNode(_component_UButton, {
                        to: "/rattachements/create",
                        variant: "text",
                        size: "sm",
                        class: "p-0 m-0 text-blue-600"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Cr\xE9er un rattachement ")
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { class: "text-center py-12" }, [
                  createVNode(_component_Icon, {
                    name: "i-heroicons-link-slash",
                    class: "mx-auto h-16 w-16 text-gray-400 mb-4"
                  }),
                  createVNode("h3", { class: "text-lg font-medium text-gray-900 mb-2" }, "Aucun rattachement"),
                  createVNode("p", { class: "text-sm text-gray-500 mb-6" }, " Commencez par cr\xE9er un rattachement entre un courrier arriv\xE9e et un courrier d\xE9part. "),
                  createVNode(_component_UBadge, {
                    color: "blue",
                    variant: "soft",
                    size: "lg"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_Icon, {
                        name: "i-heroicons-plus",
                        class: "h-4 w-4 mr-1"
                      }),
                      createVNode(_component_UButton, {
                        to: "/rattachements/create",
                        variant: "text",
                        size: "sm",
                        class: "p-0 m-0 text-blue-600"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Cr\xE9er un rattachement ")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
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
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/rattachements/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-6ffde357"]]);

export { index as default };
//# sourceMappingURL=index--g2dqZHn.mjs.map
