import __nuxt_component_1 from './Badge-DIEXPf_r.mjs';
import { _ as _export_sfc, c as __nuxt_component_0$2, d as __nuxt_component_1$1 } from './server.mjs';
import { ref, mergeProps, withCtx, createTextVNode, createVNode, createBlock, openBlock, Fragment, renderList, toDisplayString, withDirectives, vModelText, vModelSelect, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { _ as _sfc_main$1 } from './DataTable-Cb4WL8Ep.mjs';
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
  __name: "CourriersDepartsListe",
  __ssrInlineRender: true,
  props: {
    entiteId: { type: Number, default: null }
  },
  setup(__props) {
    const courriers = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const columns = [
      { key: "source", label: "Source", visible: true, type: "badge", inputHidden: true },
      { key: "reference", label: "R\xE9f\xE9rence", visible: true },
      { key: "structure", label: "Destinataire", visible: true, inputHidden: true },
      { key: "numeroEnregistrement", label: "N\xB0 d'enregistrement", visible: true, inputHidden: true },
      { key: "objet", label: "Objet", visible: true },
      { key: "type_document", label: "Type de document", visible: true, inputHidden: true },
      { key: "initiateurs", label: "Initiateurs", visible: true, inputHidden: true, sortable: false, filterable: false },
      { key: "date_enregistrement", label: "Date d'enregistrement", visible: false },
      { key: "date_courrier", label: "Date du Courrier", visible: false },
      { key: "url", label: "Document", visible: false, type: "document" },
      { key: "type_depart", label: "Type de d\xE9part", visible: false },
      { key: "date_depart", label: "Date de d\xE9part", visible: false },
      { key: "large_diffusion", label: "Large diffusion", visible: false },
      { key: "confidentiel", label: "Confidentiel", visible: false }
    ];
    const formatDate = (date) => {
      if (!date) return "";
      return new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
    };
    const onOpenDocument = (url) => {
      if (url) (void 0).open(url, "_blank", "noopener,noreferrer");
    };
    const onSelectionChange = (ids) => console.log("S\xE9lection :", ids);
    const handleView = async (item) => {
      var _a, _b, _c, _d, _e, _f, _g;
      const courrier = item._complete || item;
      const initiateurHtml = ((_a = courrier.initiateurs) == null ? void 0 : _a.length) > 0 ? courrier.initiateurs.map(
        (i) => {
          var _a2, _b2, _c2, _d2;
          return `<span style="display:inline-flex;align-items:center;gap:4px;padding:3px 10px;background:#f3e8ff;color:#7e22ce;border:1px solid #e9d5ff;border-radius:9999px;font-size:12px;margin:2px;">
          \u{1F464} ${((_a2 = i.user) == null ? void 0 : _a2.nom) || ""} ${((_b2 = i.user) == null ? void 0 : _b2.prenom) || ""} ${((_c2 = i.entite) == null ? void 0 : _c2.code) ? `(${i.entite.code})` : ((_d2 = i.entite) == null ? void 0 : _d2.libelle) ? `(${i.entite.libelle})` : ""}
        </span>`;
        }
      ).join("") : '<span style="color:#9ca3af;font-style:italic;font-size:13px;">Aucun initiateur</span>';
      await Swal.fire({
        title: "D\xE9tails du courrier",
        html: `
      <div class="text-left space-y-4">
        <div class="bg-blue-50 rounded-lg p-4">
          <p class="text-xs text-gray-600 uppercase font-semibold mb-1">R\xE9f\xE9rence</p>
          <p class="text-lg font-bold text-blue-900">${((_b = courrier.document) == null ? void 0 : _b.reference) || "N/A"}</p>
        </div>
        <div class="bg-yellow-50 rounded-lg p-4">
          <p class="text-xs text-gray-600 uppercase font-semibold mb-1">Objet</p>
          <p class="text-sm text-gray-800">${((_c = courrier.document) == null ? void 0 : _c.objet) || "Non sp\xE9cifi\xE9"}</p>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="text-xs text-gray-600 font-semibold mb-1">Source</p>
            <p class="text-sm font-medium text-gray-900">${courrier.service_emis || "N/A"}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="text-xs text-gray-600 font-semibold mb-1">Type de d\xE9part</p>
            <p class="text-sm font-medium text-gray-900">${courrier.type_depart || "Non sp\xE9cifi\xE9"}</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="text-xs text-gray-600 font-semibold mb-1">Date d'enregistrement</p>
            <p class="text-sm text-gray-900">${formatDate((_d = courrier.document) == null ? void 0 : _d.date_enreg)}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="text-xs text-gray-600 font-semibold mb-1">Date de d\xE9part</p>
            <p class="text-sm text-gray-900">${formatDate(courrier.date_depart)}</p>
          </div>
        </div>
        <div class="bg-indigo-50 rounded-lg p-4">
          <p class="text-xs text-gray-600 uppercase font-semibold mb-1">Destinataire</p>
          <p class="text-sm text-gray-900">${courrier.destinataire || "Non sp\xE9cifi\xE9"}</p>
        </div>
        <div class="bg-purple-50 rounded-lg p-4">
          <p class="text-xs text-gray-600 uppercase font-semibold mb-2">Initiateurs</p>
          <div style="display:flex;flex-wrap:wrap;gap:4px;">${initiateurHtml}</div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-green-50 rounded-lg p-3">
            <p class="text-xs text-gray-600 font-semibold mb-1">Type de document</p>
            <p class="text-sm font-medium text-gray-900">${((_f = (_e = courrier.document) == null ? void 0 : _e.type_document) == null ? void 0 : _f.libelle) || "N/A"}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="text-xs text-gray-600 font-semibold mb-1">Large diffusion</p>
            <p class="text-sm font-medium text-gray-900">${((_g = courrier.document) == null ? void 0 : _g.large_diffusion) ? "Oui" : "Non"}</p>
          </div>
        </div>
        <div class="bg-red-50 rounded-lg p-3">
          <p class="text-xs text-gray-600 font-semibold mb-1">Confidentiel</p>
          <p class="text-sm font-medium text-gray-900">${courrier.confidentiel ? "\u{1F512} Oui" : "Non"}</p>
        </div>
      </div>
    `,
        icon: "info",
        confirmButtonColor: "#7c3aed",
        confirmButtonText: "Fermer",
        width: "600px"
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UBadge = __nuxt_component_1;
      const _component_Icon = __nuxt_component_0$2;
      const _component_UButton = __nuxt_component_1$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-100 p-6 font-sans" }, _attrs))} data-v-931f193f><div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6" data-v-931f193f><div data-v-931f193f><h1 class="text-2xl font-bold text-slate-900 tracking-tight" data-v-931f193f>Courriers D\xE9parts</h1><p class="text-sm text-slate-500" data-v-931f193f>Gestion et suivi des courriers sortants</p></div>`);
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
              to: "/courriers/form_courrier_depart",
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
                to: "/courriers/form_courrier_depart",
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
      if (loading.value) {
        _push(`<div class="flex flex-col items-center justify-center py-20 gap-4 text-slate-500" data-v-931f193f><div class="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" data-v-931f193f></div><span class="text-sm font-medium" data-v-931f193f>Chargement des donn\xE9es...</span></div>`);
      } else if (error.value) {
        _push(`<div class="flex items-center gap-4 p-5 bg-red-50 border border-red-200 rounded-xl max-w-2xl" data-v-931f193f><svg class="w-8 h-8 text-red-600 shrink-0" viewBox="0 0 20 20" fill="currentColor" data-v-931f193f><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" data-v-931f193f></path></svg><div class="flex-1" data-v-931f193f><p class="text-sm font-bold text-red-900" data-v-931f193f>Erreur de chargement</p><p class="text-xs text-red-700" data-v-931f193f>${ssrInterpolate(error.value)}</p></div><button class="px-4 py-2 text-xs font-bold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors shrink-0" data-v-931f193f> R\xE9essayer </button></div>`);
      } else {
        _push(ssrRenderComponent(_sfc_main$1, {
          "default-sort-column": null,
          "show-row-numbers": true,
          data: courriers.value,
          columns,
          selectable: false,
          "left-aligned-columns": ["reference", "structure", "numeroEnregistrement", "objet", "initiateurs"],
          onOpenDocument,
          onSelectionChange
        }, {
          "advanced-filters": withCtx(({ filters, onFilter }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-v-931f193f${_scopeId}><div data-v-931f193f${_scopeId}><label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" data-v-931f193f${_scopeId}>Recherche</label><input${ssrRenderAttr("value", filters.search)} placeholder="R\xE9f\xE9rence, N\xB0, Objet..." class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" data-v-931f193f${_scopeId}></div><div data-v-931f193f${_scopeId}><label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" data-v-931f193f${_scopeId}>Type de d\xE9part</label><select class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" data-v-931f193f${_scopeId}><option value="" data-v-931f193f${ssrIncludeBooleanAttr(Array.isArray(filters.type_depart) ? ssrLooseContain(filters.type_depart, "") : ssrLooseEqual(filters.type_depart, "")) ? " selected" : ""}${_scopeId}>Tous les types</option><option value="interne" data-v-931f193f${ssrIncludeBooleanAttr(Array.isArray(filters.type_depart) ? ssrLooseContain(filters.type_depart, "interne") : ssrLooseEqual(filters.type_depart, "interne")) ? " selected" : ""}${_scopeId}>Interne</option><option value="externe" data-v-931f193f${ssrIncludeBooleanAttr(Array.isArray(filters.type_depart) ? ssrLooseContain(filters.type_depart, "externe") : ssrLooseEqual(filters.type_depart, "externe")) ? " selected" : ""}${_scopeId}>Externe</option></select></div><div data-v-931f193f${_scopeId}><label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" data-v-931f193f${_scopeId}>Date de d\xE9part (d\xE9but)</label><input${ssrRenderAttr("value", filters.date_depart_from)} type="date" class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" data-v-931f193f${_scopeId}></div><div data-v-931f193f${_scopeId}><label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" data-v-931f193f${_scopeId}>Date de d\xE9part (fin)</label><input${ssrRenderAttr("value", filters.date_depart_to)} type="date" class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" data-v-931f193f${_scopeId}></div></div>`);
            } else {
              return [
                createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" }, [
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" }, "Recherche"),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => filters.search = $event,
                      placeholder: "R\xE9f\xE9rence, N\xB0, Objet...",
                      class: "w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all",
                      onInput: onFilter
                    }, null, 40, ["onUpdate:modelValue", "onInput"]), [
                      [vModelText, filters.search]
                    ])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" }, "Type de d\xE9part"),
                    withDirectives(createVNode("select", {
                      "onUpdate:modelValue": ($event) => filters.type_depart = $event,
                      class: "w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all",
                      onChange: onFilter
                    }, [
                      createVNode("option", { value: "" }, "Tous les types"),
                      createVNode("option", { value: "interne" }, "Interne"),
                      createVNode("option", { value: "externe" }, "Externe")
                    ], 40, ["onUpdate:modelValue", "onChange"]), [
                      [vModelSelect, filters.type_depart]
                    ])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" }, "Date de d\xE9part (d\xE9but)"),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => filters.date_depart_from = $event,
                      type: "date",
                      class: "w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all",
                      onInput: onFilter
                    }, null, 40, ["onUpdate:modelValue", "onInput"]), [
                      [vModelText, filters.date_depart_from]
                    ])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" }, "Date de d\xE9part (fin)"),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => filters.date_depart_to = $event,
                      type: "date",
                      class: "w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all",
                      onInput: onFilter
                    }, null, 40, ["onUpdate:modelValue", "onInput"]), [
                      [vModelText, filters.date_depart_to]
                    ])
                  ])
                ])
              ];
            }
          }),
          actions: withCtx(({ item }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex gap-1.5 justify-end" data-v-931f193f${_scopeId}><button title="Voir les d\xE9tails" class="inline-flex items-center justify-center w-8 h-8 bg-amber-50 text-amber-700 border-amber-100 rounded-md hover:bg-amber-200 hover:border-amber-900 transition-all group" data-v-931f193f${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                name: "i-heroicons-eye",
                class: "w-4 h-4 group-hover:text-yellow-600"
              }, null, _parent2, _scopeId));
              _push2(`</button></div>`);
            } else {
              return [
                createVNode("div", { class: "flex gap-1.5 justify-end" }, [
                  createVNode("button", {
                    onClick: ($event) => handleView(item),
                    title: "Voir les d\xE9tails",
                    class: "inline-flex items-center justify-center w-8 h-8 bg-amber-50 text-amber-700 border-amber-100 rounded-md hover:bg-amber-200 hover:border-amber-900 transition-all group"
                  }, [
                    createVNode(_component_Icon, {
                      name: "i-heroicons-eye",
                      class: "w-4 h-4 group-hover:text-yellow-600"
                    })
                  ], 8, ["onClick"])
                ])
              ];
            }
          }),
          "cell-source": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100" data-v-931f193f${_scopeId}>${ssrInterpolate(value)}</span>`);
            } else {
              return [
                createVNode("span", { class: "inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100" }, toDisplayString(value), 1)
              ];
            }
          }),
          "cell-type_document": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-green-50 text-green-700 border border-green-100" data-v-931f193f${_scopeId}>${ssrInterpolate(value || "N/A")}</span>`);
            } else {
              return [
                createVNode("span", { class: "inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-green-50 text-green-700 border border-green-100" }, toDisplayString(value || "N/A"), 1)
              ];
            }
          }),
          "cell-large_diffusion": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (value) {
                _push2(`<span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-100" data-v-931f193f${_scopeId}>Oui</span>`);
              } else {
                _push2(`<span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-gray-50 text-gray-700 border border-gray-100" data-v-931f193f${_scopeId}>Non</span>`);
              }
            } else {
              return [
                value ? (openBlock(), createBlock("span", {
                  key: 0,
                  class: "inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-100"
                }, "Oui")) : (openBlock(), createBlock("span", {
                  key: 1,
                  class: "inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-gray-50 text-gray-700 border border-gray-100"
                }, "Non"))
              ];
            }
          }),
          "cell-confidentiel": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (value) {
                _push2(`<span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-red-50 text-red-700 border border-red-100" data-v-931f193f${_scopeId}>Oui</span>`);
              } else {
                _push2(`<span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-gray-50 text-gray-700 border border-gray-100" data-v-931f193f${_scopeId}>Non</span>`);
              }
            } else {
              return [
                value ? (openBlock(), createBlock("span", {
                  key: 0,
                  class: "inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-red-50 text-red-700 border border-red-100"
                }, "Oui")) : (openBlock(), createBlock("span", {
                  key: 1,
                  class: "inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-gray-50 text-gray-700 border border-gray-100"
                }, "Non"))
              ];
            }
          }),
          "cell-reference": withCtx(({ value, item }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (item.url) {
                _push2(`<button class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 rounded-md transition-all group"${ssrRenderAttr("title", `Ouvrir le document ${value}`)} data-v-931f193f${_scopeId}>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "i-heroicons-document-text",
                  class: "w-3.5 h-3.5 group-hover:scale-110 transition-transform"
                }, null, _parent2, _scopeId));
                _push2(`<span data-v-931f193f${_scopeId}>${ssrInterpolate(value)}</span>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "i-heroicons-arrow-top-right-on-square",
                  class: "w-3 h-3 opacity-60 group-hover:opacity-100"
                }, null, _parent2, _scopeId));
                _push2(`</button>`);
              } else {
                _push2(`<span class="inline-flex items-center px-2.5 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md"${ssrRenderAttr("title", value)} data-v-931f193f${_scopeId}>`);
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
                  onClick: ($event) => onOpenDocument(item.url),
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
          "cell-initiateurs": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (value && value.length > 0) {
                _push2(`<div class="flex flex-col gap-1" data-v-931f193f${_scopeId}><!--[-->`);
                ssrRenderList(value, (initiateur, index) => {
                  _push2(`<span class="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-purple-700 bg-purple-50 border border-purple-100 rounded-full whitespace-nowrap" data-v-931f193f${_scopeId}>`);
                  _push2(ssrRenderComponent(_component_Icon, {
                    name: "i-heroicons-user",
                    class: "w-3 h-3 shrink-0"
                  }, null, _parent2, _scopeId));
                  _push2(` ${ssrInterpolate(initiateur)}</span>`);
                });
                _push2(`<!--]--></div>`);
              } else {
                _push2(`<span class="text-xs text-slate-400 italic" data-v-931f193f${_scopeId}>\u2014</span>`);
              }
            } else {
              return [
                value && value.length > 0 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "flex flex-col gap-1"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(value, (initiateur, index) => {
                    return openBlock(), createBlock("span", {
                      key: index,
                      class: "inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-purple-700 bg-purple-50 border border-purple-100 rounded-full whitespace-nowrap"
                    }, [
                      createVNode(_component_Icon, {
                        name: "i-heroicons-user",
                        class: "w-3 h-3 shrink-0"
                      }),
                      createTextVNode(" " + toDisplayString(initiateur), 1)
                    ]);
                  }), 128))
                ])) : (openBlock(), createBlock("span", {
                  key: 1,
                  class: "text-xs text-slate-400 italic"
                }, "\u2014"))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/courriers/CourriersDepartsListe.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_6 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-931f193f"]]);

export { __nuxt_component_6 as default };
//# sourceMappingURL=CourriersDepartsListe-CzHPzjR4.mjs.map
