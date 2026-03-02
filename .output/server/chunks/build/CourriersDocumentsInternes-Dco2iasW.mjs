import __nuxt_component_1 from './Badge-DIEXPf_r.mjs';
import { c as __nuxt_component_0$2, d as __nuxt_component_1$1, g as __nuxt_component_2$1 } from './server.mjs';
import { mergeProps, withCtx, createTextVNode, createVNode, unref, toDisplayString, createBlock, createCommentVNode, openBlock, Fragment, renderList, withDirectives, vModelText, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { _ as _sfc_main$1 } from './DataTable-Cb4WL8Ep.mjs';
import { u as useApi } from './useApi-J_uhScde.mjs';
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
  __name: "CourriersDocumentsInternes",
  __ssrInlineRender: true,
  setup(__props) {
    const columns = [
      // { key: 'id', label: 'N°', visible: true },
      { key: "numeroEnregistrement", label: "N\xB0 d'enregistrement", visible: true },
      { key: "date_enreg", label: "Date d'enregistrement", visible: true },
      { key: "reference", label: "R\xE9f\xE9rence", visible: true },
      { key: "date_courrier", label: "Date du courrier", visible: true },
      { key: "objet", label: "Objet", visible: true },
      { key: "type_document", label: "Type de document", visible: true, type: "badge" },
      { key: "large_diffusion", label: "Large diffusion", visible: true, type: "badge" },
      { key: "url", label: "Document", visible: true, type: "document" },
      { key: "description", label: "Description", visible: false }
    ];
    const formatDate = (date) => {
      if (!date) return "";
      return new Date(date).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      });
    };
    const transformDocuments = (response) => {
      if (!(response == null ? void 0 : response.data)) throw new Error("Format de r\xE9ponse API invalide");
      return response.data.map((document) => {
        var _a;
        return {
          id: document.id,
          numeroEnregistrement: document.numero_enreg || "",
          date_enreg: formatDate(document.date_enreg),
          reference: document.reference || "",
          date_courrier: formatDate(document.date_courrier),
          objet: document.objet || "",
          type_document: ((_a = document.type_document) == null ? void 0 : _a.libelle) || "Non d\xE9fini",
          large_diffusion: document.large_diffusion || false,
          url: document.url ? `http://localhost:8000${document.url}` : "",
          description: document.description || ""
        };
      });
    };
    const { data: documents, loading, error } = useApi("api/documents-internes", {
      transform: transformDocuments,
      immediate: true
    });
    const onEdit = (item) => console.log("\xC9diter :", item);
    const onDelete = (item) => console.log("Supprimer :", item);
    const onOpenDocument = (url) => {
      if (url) (void 0).open(url, "_blank", "noopener,noreferrer");
    };
    const onSelectionChange = (ids) => console.log("S\xE9lection mise \xE0 jour :", ids);
    const onAssign = (selectedIds) => console.log("Affecter les documents :", selectedIds);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UBadge = __nuxt_component_1;
      const _component_Icon = __nuxt_component_0$2;
      const _component_UButton = __nuxt_component_1$1;
      const _component_UIcon = __nuxt_component_2$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-100 p-6 font-sans" }, _attrs))}><div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"><div><h1 class="text-2xl font-bold text-slate-900 tracking-tight">Documents internes</h1><p class="text-sm text-slate-500">Gestion et suivi des documents internes</p></div>`);
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
              to: "/courriers/form_document_interne",
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
                to: "/courriers/form_document_interne",
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
      _push(`</div>`);
      if (unref(loading)) {
        _push(`<div class="flex flex-col items-center justify-center py-20 gap-4 text-slate-500"><div class="w-8 h-8 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div><span class="text-sm font-medium">Chargement des donn\xE9es...</span></div>`);
      } else if (unref(error)) {
        _push(`<div class="flex items-center gap-4 p-5 bg-red-50 border border-red-200 rounded-xl max-w-2xl">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-exclamation-circle",
          class: "w-8 h-8 text-red-600 shrink-0"
        }, null, _parent));
        _push(`<div class="flex-1"><p class="text-sm font-bold text-red-900">Erreur de chargement</p><p class="text-xs text-red-700">${ssrInterpolate(unref(error))}</p></div><button class="px-4 py-2 text-xs font-bold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"> R\xE9essayer </button></div>`);
      } else {
        _push(ssrRenderComponent(_sfc_main$1, {
          data: unref(documents),
          "default-sort-column": null,
          "show-row-numbers": true,
          columns,
          selectable: false,
          "left-aligned-columns": ["reference", "numeroEnregistrement", "objet", "description"],
          onEdit,
          onDelete,
          onOpenDocument,
          onSelectionChange
        }, {
          "advanced-filters": withCtx(({ filters, onFilter }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"${_scopeId}><!--[-->`);
              ssrRenderList([
                { id: "type_document", label: "Type de document" },
                { id: "numeroEnregistrement", label: "N\xB0 d'enregistrement" },
                { id: "objet", label: "Objet" },
                { id: "reference", label: "R\xE9f\xE9rence" }
              ], (field) => {
                _push2(`<div${_scopeId}><label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5"${_scopeId}>${ssrInterpolate(field.label)}</label><input${ssrRenderAttr("value", filters[field.id])} placeholder="Filtrer..." class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"${_scopeId}></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              return [
                createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" }, [
                  (openBlock(), createBlock(Fragment, null, renderList([
                    { id: "type_document", label: "Type de document" },
                    { id: "numeroEnregistrement", label: "N\xB0 d'enregistrement" },
                    { id: "objet", label: "Objet" },
                    { id: "reference", label: "R\xE9f\xE9rence" }
                  ], (field) => {
                    return createVNode("div", {
                      key: field.id
                    }, [
                      createVNode("label", { class: "block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" }, toDisplayString(field.label), 1),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => filters[field.id] = $event,
                        placeholder: "Filtrer...",
                        class: "w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all",
                        onInput: onFilter
                      }, null, 40, ["onUpdate:modelValue", "onInput"]), [
                        [vModelText, filters[field.id]]
                      ])
                    ]);
                  }), 64))
                ])
              ];
            }
          }),
          "selection-actions": withCtx(({ selected }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (selected.length > 0) {
                _push2(`<button class="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-blue-600 rounded-lg hover:opacity-90 transition-opacity"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-heroicons-user-plus",
                  class: "w-4 h-4"
                }, null, _parent2, _scopeId));
                _push2(` Affecter (${ssrInterpolate(selected.length)}) </button>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                selected.length > 0 ? (openBlock(), createBlock("button", {
                  key: 0,
                  class: "inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-blue-600 rounded-lg hover:opacity-90 transition-opacity",
                  onClick: ($event) => onAssign(selected)
                }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-user-plus",
                    class: "w-4 h-4"
                  }),
                  createTextVNode(" Affecter (" + toDisplayString(selected.length) + ") ", 1)
                ], 8, ["onClick"])) : createCommentVNode("", true)
              ];
            }
          }),
          "cell-type_document": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-sky-100 text-sky-700 border border-sky-200 uppercase"${_scopeId}>${ssrInterpolate(value)}</span>`);
            } else {
              return [
                createVNode("span", { class: "inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-sky-100 text-sky-700 border border-sky-200 uppercase" }, toDisplayString(value), 1)
              ];
            }
          }),
          "cell-large_diffusion": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="${ssrRenderClass([value ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200", "inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border"])}"${_scopeId}>${ssrInterpolate(value ? "OUI" : "NON")}</span>`);
            } else {
              return [
                createVNode("span", {
                  class: ["inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border", value ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"]
                }, toDisplayString(value ? "OUI" : "NON"), 3)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/courriers/CourriersDocumentsInternes.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=CourriersDocumentsInternes-Dco2iasW.mjs.map
