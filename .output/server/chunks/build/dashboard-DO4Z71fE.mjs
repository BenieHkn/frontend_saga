import __nuxt_component_1 from './Badge-DIEXPf_r.mjs';
import { _ as _export_sfc, c as __nuxt_component_0$2, d as __nuxt_component_1$1, b as useRuntimeConfig, n as navigateTo } from './server.mjs';
import { mergeProps, withCtx, createTextVNode, createVNode, unref, toDisplayString, createBlock, openBlock, Fragment, renderList, withDirectives, vModelText, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList } from 'vue/server-renderer';
import { _ as _sfc_main$3 } from './DataTable-Cb4WL8Ep.mjs';
import { u as useApi } from './useApi-J_uhScde.mjs';
import { u as useAffectationsStore } from './affectations-Bp-zzr69.mjs';
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

const _sfc_main$2 = {
  __name: "StatsCard",
  __ssrInlineRender: true,
  props: {
    title: String,
    value: String,
    change: String,
    changeType: {
      type: String,
      default: "increase"
    },
    icon: String,
    color: String,
    infos: String
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative overflow-hidden bg-emerald-600 rounded-2xl p-6 border-t border-l border-blue-400 shadow-xl" }, _attrs))}><div class="absolute inset-0 bg-gradient-to-br from-emerald-700 to-blue-800 pointer-events-none"></div><div class="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-emerald-800 to-blue-800 blur-3xl rounded-full pointer-events-none"></div><div class="flex items-center justify-between relative z-10"><div class="flex-1"><p class="text-xs font-bold uppercase tracking-widest text-white/60 mb-1">${ssrInterpolate(__props.title)}</p><p class="text-3xl font-black text-white">${ssrInterpolate(__props.value)}</p><div class="flex items-center mt-3"><span class="${ssrRenderClass([
        "text-xs text-white  font-bold px-2 py-0.5 rounded-full border",
        __props.changeType === "increase" ? "bg-white/30 text-emerald-950 border-white/40" : "bg-red-500/20 text-red-950 border-red-400/20"
      ])}">${ssrInterpolate(__props.change)} `);
      if (__props.changeType === "hold") {
        _push(`<span> \u2193\u2193 </span>`);
      } else if (__props.changeType === "decrease") {
        _push(`<span> \u2193 </span>`);
      } else {
        _push(`<span> \u2191 </span>`);
      }
      _push(`</span><div class="text-[12px] ml-2">${ssrInterpolate(__props.infos)}</div></div></div><div class="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-black/10 border border-white/20 shadow-inner">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: `i-heroicons:${__props.icon}`,
        class: "h-7 w-7 text-white drop-shadow-sm"
      }, null, _parent));
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/StatsCard.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "Liste",
  __ssrInlineRender: true,
  setup(__props) {
    const store = useAffectationsStore();
    const config = useRuntimeConfig();
    const columns = [
      {
        key: "source",
        label: "Source",
        visible: true,
        type: "badge",
        inputHidden: true
        // ✅ input masqué, multiSelect reste disponible
      },
      {
        key: "reference",
        label: "R\xE9f\xE9rence",
        visible: true,
        inputWidth: "80px",
        // ✅ input plus petit
        inputPlaceholder: "R\xE9f..."
      },
      {
        key: "numeroEnregistrement",
        label: "N\xB0 d'enreg.",
        visible: false,
        inputHidden: true
        // ✅ input masqué
      },
      {
        key: "objet",
        label: "Objet",
        visible: true
      },
      {
        key: "date_enregistrement",
        label: "Date d'enregistrement",
        visible: false
      },
      {
        key: "date_courrier",
        label: "Date du Courrier",
        visible: false
      },
      {
        key: "url",
        label: "Document",
        visible: false,
        type: "document"
      },
      {
        key: "type_arrivee",
        label: "Type d'arriv\xE9e",
        visible: false
      },
      {
        key: "priority",
        label: "Priorit\xE9",
        visible: true,
        type: "badge"
      },
      {
        key: "structure",
        label: "Structure / Usager",
        visible: true
      }
    ];
    const formatDate = (date) => {
      if (!date) return "";
      return new Date(date).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      });
    };
    const transformCourriers = (response) => {
      if (!(response == null ? void 0 : response.data)) throw new Error("Format de r\xE9ponse API invalide");
      return response.data.map((courrier) => {
        var _a, _b, _c, _d, _e, _f;
        return {
          id: courrier.id,
          source: courrier.service_enreg || "",
          numeroEnregistrement: ((_a = courrier.document) == null ? void 0 : _a.numero_enreg) || "",
          reference: ((_b = courrier.document) == null ? void 0 : _b.reference) || "",
          structure: courrier.structure || courrier.autre_structure || "",
          date_enregistrement: formatDate((_c = courrier.document) == null ? void 0 : _c.date_enreg),
          objet: ((_d = courrier.document) == null ? void 0 : _d.objet) || "",
          date_courrier: formatDate((_e = courrier.document) == null ? void 0 : _e.date_courrier),
          url: ((_f = courrier.document) == null ? void 0 : _f.url) ? `${config.public.baseUrl}${courrier.document.url}` : "",
          type_arrivee: courrier.type_arrivee || "",
          priority: courrier.priority || "",
          // Garder les données complètes
          _complete: courrier
        };
      });
    };
    const { data: courriers, loading, error, refresh } = useApi("/courriers-arrives", {
      transform: transformCourriers,
      immediate: true
    });
    const onOpenDocument = (url) => {
      if (url) (void 0).open(url, "_blank", "noopener,noreferrer");
    };
    const onSelectionChange = (ids) => {
      console.log("S\xE9lection mise \xE0 jour :", ids);
    };
    const handleQuickAssign = (courrierId) => {
      console.log("Affectation rapide pour le courrier:", courrierId);
      store.selectCourrierFromQuickAction(courrierId);
      navigateTo("/affectations/create");
    };
    const handleView = async (item) => {
      var _a, _b, _c, _d, _e, _f;
      const courrier = item._complete || item;
      const details = `
    <div class="text-left space-y-4">
      <!-- R\xE9f\xE9rence -->
      <div class="bg-blue-50 rounded-lg p-4">
        <p class="text-xs text-gray-600 uppercase font-semibold mb-1">R\xE9f\xE9rence</p>
        <p class="text-lg font-bold text-blue-900">${((_a = courrier.document) == null ? void 0 : _a.reference) || "N/A"}</p>
      </div>

      <!-- Objet -->
      <div class="bg-yellow-50 rounded-lg p-4">
        <p class="text-xs text-gray-600 uppercase font-semibold mb-1">Objet</p>
        <p class="text-sm text-gray-800">${((_b = courrier.document) == null ? void 0 : _b.objet) || "Non sp\xE9cifi\xE9"}</p>
      </div>

      <!-- Informations d'enregistrement -->
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-gray-50 rounded-lg p-3">
          <p class="text-xs text-gray-600 font-semibold mb-1">Source</p>
          <p class="text-sm font-medium text-gray-900">${courrier.service_enreg || "N/A"}</p>
        </div>
        <div class="bg-gray-50 rounded-lg p-3">
          <p class="text-xs text-gray-600 font-semibold mb-1">Priorit\xE9</p>
          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${((_c = courrier.priority) == null ? void 0 : _c.toLowerCase()) === "urgent" ? "bg-red-100 text-red-800" : ((_d = courrier.priority) == null ? void 0 : _d.toLowerCase()) === "important" ? "bg-orange-100 text-orange-800" : "bg-blue-100 text-blue-800"}">
            ${courrier.priority || "standard"}
          </span>
        </div>
      </div>

      <!-- Dates -->
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-gray-50 rounded-lg p-3">
          <p class="text-xs text-gray-600 font-semibold mb-1">Date d'enregistrement</p>
          <p class="text-sm text-gray-900">${formatDate((_e = courrier.document) == null ? void 0 : _e.date_enreg)}</p>
        </div>
        <div class="bg-gray-50 rounded-lg p-3">
          <p class="text-xs text-gray-600 font-semibold mb-1">Date du courrier</p>
          <p class="text-sm text-gray-900">${formatDate((_f = courrier.document) == null ? void 0 : _f.date_courrier)}</p>
        </div>
      </div>

      <!-- Structure -->
      <div class="bg-indigo-50 rounded-lg p-4">
        <p class="text-xs text-gray-600 uppercase font-semibold mb-1">Structure / Usager</p>
        <p class="text-sm text-gray-900">${courrier.structure || courrier.autre_structure || "Non sp\xE9cifi\xE9"}</p>
      </div>

      <!-- Type d'arriv\xE9e -->
      <div class="bg-purple-50 rounded-lg p-4">
        <p class="text-xs text-gray-600 uppercase font-semibold mb-1">Type d'arriv\xE9e</p>
        <p class="text-sm font-medium text-gray-900">${courrier.type_arrivee || "Non sp\xE9cifi\xE9"}</p>
      </div>
    </div>
  `;
      await Swal.fire({
        title: "D\xE9tails du courrier",
        html: details,
        icon: "info",
        confirmButtonColor: "#7c3aed",
        confirmButtonText: "Fermer",
        width: "600px",
        customClass: {
          popup: "swal2-popup-custom",
          title: "text-xl font-semibold",
          htmlContainer: "text-sm"
        }
      });
    };
    const onEdit = (item) => {
      console.log("Modifier:", item);
      navigateTo(`/courriers/edit/${item.id}`);
    };
    const onDelete = async (item) => {
      const result = await Swal.fire({
        title: "Confirmer la suppression",
        html: `
      <div class="text-left">
        <p class="mb-3">\xCAtes-vous s\xFBr de vouloir supprimer ce courrier ?</p>
        <div class="bg-gray-50 rounded-lg p-4 space-y-2">
          <p class="text-sm font-medium text-gray-900">${item.reference}</p>
          <p class="text-xs text-gray-600">${item.objet}</p>
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
        reverseButtons: true
      });
      if (!result.isConfirmed) return;
      try {
        const authToken = localStorage.getItem("auth_token");
        await $fetch(`${config.public.apiBase}/courriers-arrives/${item.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
        await Swal.fire({
          title: "Supprim\xE9 !",
          text: "Le courrier a \xE9t\xE9 supprim\xE9 avec succ\xE8s",
          icon: "success",
          timer: 2e3,
          showConfirmButton: false
        });
        refresh();
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        await Swal.fire({
          title: "Erreur",
          text: "Impossible de supprimer le courrier",
          icon: "error",
          confirmButtonColor: "#7c3aed"
        });
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UBadge = __nuxt_component_1;
      const _component_Icon = __nuxt_component_0$2;
      const _component_UButton = __nuxt_component_1$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-100 p-6 font-sans" }, _attrs))} data-v-6dd280a9><div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6" data-v-6dd280a9><div data-v-6dd280a9><h1 class="text-2xl font-bold text-slate-900 tracking-tight" data-v-6dd280a9>Courriers arriv\xE9s</h1><p class="text-sm text-slate-500" data-v-6dd280a9>Gestion et suivi des courriers entrants</p></div>`);
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
              to: "/courriers/form_courier_arrive",
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
                to: "/courriers/form_courier_arrive",
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
        _push(`<div class="flex flex-col items-center justify-center py-20 gap-4 text-slate-500" data-v-6dd280a9><div class="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" data-v-6dd280a9></div><span class="text-sm font-medium" data-v-6dd280a9>Chargement des donn\xE9es...</span></div>`);
      } else if (unref(error)) {
        _push(`<div class="flex items-center gap-4 p-5 bg-red-50 border border-red-200 rounded-xl max-w-2xl mx-auto sm:mx-0" data-v-6dd280a9><svg class="w-8 h-8 text-red-600 shrink-0" viewBox="0 0 20 20" fill="currentColor" data-v-6dd280a9><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" data-v-6dd280a9></path></svg><div class="flex-1" data-v-6dd280a9><p class="text-sm font-bold text-red-900" data-v-6dd280a9>Erreur de chargement</p><p class="text-xs text-red-700" data-v-6dd280a9>${ssrInterpolate(unref(error))}</p></div><button class="px-4 py-2 text-xs font-bold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors shrink-0" data-v-6dd280a9> R\xE9essayer </button></div>`);
      } else {
        _push(ssrRenderComponent(_sfc_main$3, {
          data: unref(courriers),
          columns,
          selectable: false,
          "default-sort-column": null,
          "show-row-numbers": true,
          "left-aligned-columns": ["reference", "structure", "numeroEnregistrement", "objet"],
          onEdit,
          onDelete,
          onOpenDocument,
          onSelectionChange,
          "hide-labels-when-input": true
        }, {
          "advanced-filters": withCtx(({ filters, onFilter }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-v-6dd280a9${_scopeId}><!--[-->`);
              ssrRenderList([
                { id: "source", label: "Source" },
                { id: "structure", label: "Structure / Usager" },
                { id: "objet", label: "Objet" },
                { id: "type_arrivee", label: "Type d'arriv\xE9e" }
              ], (field) => {
                _push2(`<div data-v-6dd280a9${_scopeId}><label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" data-v-6dd280a9${_scopeId}>${ssrInterpolate(field.label)}</label><input${ssrRenderAttr("value", filters[field.id])} placeholder="Filtrer..." class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" data-v-6dd280a9${_scopeId}></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              return [
                createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" }, [
                  (openBlock(), createBlock(Fragment, null, renderList([
                    { id: "source", label: "Source" },
                    { id: "structure", label: "Structure / Usager" },
                    { id: "objet", label: "Objet" },
                    { id: "type_arrivee", label: "Type d'arriv\xE9e" }
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
          actions: withCtx(({ item }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex gap-1.5 justify-end" data-v-6dd280a9${_scopeId}><button title="Voir les d\xE9tails" class="inline-flex items-center justify-center w-8 h-8 bg-amber-50 text-amber-700 border-amber-100 rounded-md hover:bg-amber-200 :hover:text-amber-900 hover:border-amber-900 transition-all group" data-v-6dd280a9${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                name: "i-heroicons-eye",
                class: "w-4 h-4 group-hover:text-yellow-600"
              }, null, _parent2, _scopeId));
              _push2(`</button><button title="Affecter ce courrier" class="inline-flex items-center justify-center w-8 h-8 bg-sky-50 text-sky-700 border-sky-100 rounded-md hover:bg-sky-200 :hover:text-sky-900 hover:border-sky-900 transition-all group" data-v-6dd280a9${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                name: "i-heroicons-paper-airplane",
                class: "w-4 h-4 group-hover:text-blue-600"
              }, null, _parent2, _scopeId));
              _push2(`</button><button title="R\xE9pondre au courrier" class="inline-flex items-center justify-center w-8 h-8 bg-emerald-50 text-emerald-700 border-emerald-100 rounded-md hover:bg-emerald-200 :hover:text-emerald-900 hover:border-emerald-900 transition-all group" data-v-6dd280a9${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                name: "i-heroicons-arrow-uturn-right",
                class: "w-4 h-4 group-hover:text-green-600"
              }, null, _parent2, _scopeId));
              _push2(`</button></div>`);
            } else {
              return [
                createVNode("div", { class: "flex gap-1.5 justify-end" }, [
                  createVNode("button", {
                    onClick: ($event) => handleView(item),
                    title: "Voir les d\xE9tails",
                    class: "inline-flex items-center justify-center w-8 h-8 bg-amber-50 text-amber-700 border-amber-100 rounded-md hover:bg-amber-200 :hover:text-amber-900 hover:border-amber-900 transition-all group"
                  }, [
                    createVNode(_component_Icon, {
                      name: "i-heroicons-eye",
                      class: "w-4 h-4 group-hover:text-yellow-600"
                    })
                  ], 8, ["onClick"]),
                  createVNode("button", {
                    onClick: ($event) => handleQuickAssign(item.id),
                    title: "Affecter ce courrier",
                    class: "inline-flex items-center justify-center w-8 h-8 bg-sky-50 text-sky-700 border-sky-100 rounded-md hover:bg-sky-200 :hover:text-sky-900 hover:border-sky-900 transition-all group"
                  }, [
                    createVNode(_component_Icon, {
                      name: "i-heroicons-paper-airplane",
                      class: "w-4 h-4 group-hover:text-blue-600"
                    })
                  ], 8, ["onClick"]),
                  createVNode("button", {
                    onClick: ($event) => handleQuickAssign(item.id),
                    title: "R\xE9pondre au courrier",
                    class: "inline-flex items-center justify-center w-8 h-8 bg-emerald-50 text-emerald-700 border-emerald-100 rounded-md hover:bg-emerald-200 :hover:text-emerald-900 hover:border-emerald-900 transition-all group"
                  }, [
                    createVNode(_component_Icon, {
                      name: "i-heroicons-arrow-uturn-right",
                      class: "w-4 h-4 group-hover:text-green-600"
                    })
                  ], 8, ["onClick"])
                ])
              ];
            }
          }),
          "cell-source": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100" data-v-6dd280a9${_scopeId}>${ssrInterpolate(value)}</span>`);
            } else {
              return [
                createVNode("span", { class: "inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100" }, toDisplayString(value), 1)
              ];
            }
          }),
          "cell-reference": withCtx(({ value, item }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (item.url) {
                _push2(`<button class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 rounded-md transition-all group"${ssrRenderAttr("title", `Ouvrir le document ${value}`)} data-v-6dd280a9${_scopeId}>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "i-heroicons-document-text",
                  class: "w-3.5 h-3.5 group-hover:scale-110 transition-transform"
                }, null, _parent2, _scopeId));
                _push2(`<span data-v-6dd280a9${_scopeId}>${ssrInterpolate(value)}</span>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "i-heroicons-arrow-top-right-on-square",
                  class: "w-3 h-3 opacity-60 group-hover:opacity-100"
                }, null, _parent2, _scopeId));
                _push2(`</button>`);
              } else {
                _push2(`<span class="inline-flex items-center px-2.5 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md"${ssrRenderAttr("title", value)} data-v-6dd280a9${_scopeId}>`);
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
          "cell-priority": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="${ssrRenderClass([{
                "bg-red-50 text-red-700 border-red-100": (value == null ? void 0 : value.toLowerCase()) === "urgent",
                "bg-amber-50 text-amber-700 border-amber-100": (value == null ? void 0 : value.toLowerCase()) === "important",
                "bg-sky-50 text-sky-700 border-sky-100": (value == null ? void 0 : value.toLowerCase()) === "standard"
              }, "inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border uppercase"])}" data-v-6dd280a9${_scopeId}>${ssrInterpolate(value || "Standard")}</span>`);
            } else {
              return [
                createVNode("span", {
                  class: ["inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border uppercase", {
                    "bg-red-50 text-red-700 border-red-100": (value == null ? void 0 : value.toLowerCase()) === "urgent",
                    "bg-amber-50 text-amber-700 border-amber-100": (value == null ? void 0 : value.toLowerCase()) === "important",
                    "bg-sky-50 text-sky-700 border-sky-100": (value == null ? void 0 : value.toLowerCase()) === "standard"
                  }]
                }, toDisplayString(value || "Standard"), 3)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Liste.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_4 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-6dd280a9"]]);
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_UBadge = __nuxt_component_1;
  const _component_Icon = __nuxt_component_0$2;
  const _component_UButton = __nuxt_component_1$1;
  const _component_StatsCard = _sfc_main$2;
  const _component_Liste = __nuxt_component_4;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex h-screen overflow-hidden bg-white" }, _attrs))} data-v-4369b24c><main class="${ssrRenderClass([{ "lg:ml-64": _ctx.desktopSidebarOpen }, "flex-1 p-4 lg:p-8 transition-all duration-500 overflow-y-auto"])}" data-v-4369b24c><div class="mb-8 relative" data-v-4369b24c><div class="absolute -left-4 top-0 w-1 h-12 bg-emerald-500 shadow-[0_0_15px_#10b981] rounded-full" data-v-4369b24c></div><div class="flex justify-between" data-v-4369b24c><h1 class="text-3xl lg:text-4xl font-black text-emerald-500 tracking-tight drop-shadow-xl" data-v-4369b24c> Tableau de bord </h1><div class="flex items-end" data-v-4369b24c>`);
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
          to: "/courriers/create",
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
            to: "/courriers/create",
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
  _push(`</div></div></div><div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-v-4369b24c>`);
  _push(ssrRenderComponent(_component_StatsCard, {
    title: "Arriv\xE9s",
    value: "452",
    changeType: "decrease",
    icon: "envelope-open-solid",
    color: "blue",
    class: "liquid-card bg-emerald-700",
    infos: "SP: 50 | SA: 302"
  }, null, _parent));
  _push(ssrRenderComponent(_component_StatsCard, {
    title: "D\xE9parts",
    value: "350",
    changeType: "increase",
    icon: "envelope-open-solid",
    color: "green",
    class: "liquid-card",
    infos: "SP: 50 | SA: 302"
  }, null, _parent));
  _push(ssrRenderComponent(_component_StatsCard, {
    title: "En attente",
    value: "145",
    changeType: "hold",
    icon: "envelope-open-solid",
    color: "yellow",
    class: "liquid-card",
    infos: "SP: 50 | SA: 302"
  }, null, _parent));
  _push(ssrRenderComponent(_component_StatsCard, {
    title: "Affect\xE9s",
    value: "100",
    changeType: "increase",
    icon: "envelope-open-solid",
    color: "purple",
    class: "liquid-card",
    infos: "SP: 50 | SA: 302"
  }, null, _parent));
  _push(`</div><div class="liquid-container p-1 overflow-hidden" data-v-4369b24c><div class="p-1 border-b border-white/10 bg-white/5 flex justify-between items-center" data-v-4369b24c><h2 class="text-white -mt-6 font-bold flex items-center gap-2" data-v-4369b24c> Activit\xE9s R\xE9centes </h2></div><div class="p-2" data-v-4369b24c>`);
  _push(ssrRenderComponent(_component_Liste, null, null, _parent));
  _push(`</div></div></main></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const dashboard = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-4369b24c"]]);

export { dashboard as default };
//# sourceMappingURL=dashboard-DO4Z71fE.mjs.map
