import { _ as _export_sfc, c as __nuxt_component_0$2 } from './server.mjs';
import __nuxt_component_1$2 from './Badge-DIEXPf_r.mjs';
import { ref, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, createBlock, openBlock, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrRenderStyle, ssrRenderList, ssrIncludeBooleanAttr, ssrRenderTeleport } from 'vue/server-renderer';
import { u as useAffectationsStore } from './affectations-Bp-zzr69.mjs';
import __nuxt_component_2 from './Input-50cchghJ.mjs';
import __nuxt_component_1$1 from './SelectMenu-DNGe_AeQ.mjs';
import __nuxt_component_3 from './Textarea-B6iki0ql.mjs';

const _sfc_main$6 = {
  __name: "AffectationsCourrierCard",
  __ssrInlineRender: true,
  props: {
    courrier: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ["toggle"],
  setup(__props) {
    const getPriorityColor = (priority) => {
      const colors = {
        "URGENT": "red",
        "IMPORTANT": "orange",
        "STANDARD": "blue"
      };
      return colors[priority] || "blue";
    };
    const formatDate = (date) => {
      if (!date) return "";
      return new Date(date).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0$2;
      const _component_UBadge = __nuxt_component_1$2;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["relative group p-4 rounded-xl border-2 transition-all", __props.disabled ? "border-slate-200 bg-slate-50 cursor-not-allowed opacity-50" : __props.selected ? "border-blue-500 bg-blue-50/50 shadow-md shadow-blue-100 cursor-pointer" : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm cursor-pointer"]
      }, _attrs))} data-v-0aec2da5><div class="flex items-start justify-between gap-4" data-v-0aec2da5><div class="flex items-start gap-3 flex-1 min-w-0" data-v-0aec2da5><div class="${ssrRenderClass([[
        __props.disabled ? "bg-slate-200 text-slate-400" : __props.selected ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-500"
      ], "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"])}" data-v-0aec2da5>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: __props.courrier.confidentiel ? "i-heroicons-lock-closed" : "i-heroicons-document-text",
        class: "w-5 h-5"
      }, null, _parent));
      _push(`</div><div class="flex-1 min-w-0" data-v-0aec2da5><div class="mb-1" data-v-0aec2da5><div class="flex items-center gap-2" data-v-0aec2da5><h4 class="${ssrRenderClass([
        "font-bold text-base truncate",
        __props.disabled ? "text-slate-500" : "text-blue-900"
      ])}" data-v-0aec2da5>${ssrInterpolate(__props.courrier.reference)}</h4>`);
      if (__props.courrier.priority) {
        _push(ssrRenderComponent(_component_UBadge, {
          color: getPriorityColor(__props.courrier.priority),
          variant: "soft",
          size: "xs",
          class: "flex-shrink-0"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(__props.courrier.priority)}`);
            } else {
              return [
                createTextVNode(toDisplayString(__props.courrier.priority), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><p class="${ssrRenderClass([
        "text-sm line-clamp-2 mb-2",
        __props.disabled ? "text-slate-500" : "text-slate-700"
      ])}" data-v-0aec2da5>${ssrInterpolate(__props.courrier.objet)}</p>`);
      if (__props.selected) {
        _push(`<div class="${ssrRenderClass([__props.disabled ? "text-slate-400" : "text-slate-500", "flex flex-wrap items-center gap-3 text-xs mt-2"])}" data-v-0aec2da5><span class="flex items-center gap-1" data-v-0aec2da5>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-building-office-2",
          class: "h-3 w-3"
        }, null, _parent));
        _push(` ${ssrInterpolate(__props.courrier.structure)}</span><span class="flex items-center gap-1" data-v-0aec2da5>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-calendar",
          class: "h-3 w-3"
        }, null, _parent));
        _push(` ${ssrInterpolate(formatDate(__props.courrier.date_courrier))}</span>`);
        if (__props.courrier.confidentiel) {
          _push(`<span class="${ssrRenderClass([__props.disabled ? "text-slate-400" : "text-red-600", "flex items-center gap-1"])}" data-v-0aec2da5>`);
          _push(ssrRenderComponent(_component_Icon, {
            name: "i-heroicons-lock-closed",
            class: "h-3 w-3"
          }, null, _parent));
          _push(` Confidentiel </span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.disabled) {
        _push(`<div class="mt-2 flex items-center gap-2" data-v-0aec2da5>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-lock-closed",
          class: "w-3 h-3 text-slate-400"
        }, null, _parent));
        _push(`<span class="text-xs font-medium text-slate-500" data-v-0aec2da5>S\xE9lection unique activ\xE9e</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="${ssrRenderClass([[
        __props.disabled ? "bg-slate-300" : __props.selected ? "bg-blue-500 scale-100" : "bg-slate-200 scale-90 opacity-40 group-hover:opacity-70"
      ], "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all"])}" data-v-0aec2da5>`);
      if (!__props.disabled) {
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-check",
          class: ["w-5 h-5 transition-all", __props.selected ? "text-white" : "text-slate-400"]
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-lock-closed",
          class: "w-4 h-4 text-slate-500"
        }, null, _parent));
      }
      _push(`</div></div>`);
      if (__props.selected && !__props.disabled) {
        _push(`<div class="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-blue-500/5 pointer-events-none" data-v-0aec2da5></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/affectations/AffectationsCourrierCard.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-0aec2da5"]]);
const _sfc_main$5 = {
  __name: "AffectationsCourrierSelectionPanel",
  __ssrInlineRender: true,
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    const store = useAffectationsStore();
    const searchQuery = ref("");
    const filteredCourriers = computed(() => {
      if (!searchQuery.value) return store.courriers;
      const query = searchQuery.value.toLowerCase();
      return store.courriers.filter(
        (courrier) => courrier.reference.toLowerCase().includes(query) || courrier.objet.toLowerCase().includes(query) || courrier.structure.toLowerCase().includes(query)
      );
    });
    const toggleCourrier = (courrierId) => {
      store.toggleCourrier(courrierId);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0$2;
      const _component_AffectationsCourrierCard = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 overflow-hidden transition-all hover:shadow-xl hover:shadow-slate-200/80" }, _attrs))} data-v-651c50a0><div class="px-6 py-5 border-b border-slate-100" data-v-651c50a0><div class="flex items-start justify-between mb-4" data-v-651c50a0><h3 class="text-xl font-bold text-slate-900 flex items-center gap-2" data-v-651c50a0>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "i-heroicons-inbox-arrow-down",
        class: "w-6 h-6 text-blue-600"
      }, null, _parent));
      _push(` 1. Courrier \xE0 Affecter </h3>`);
      if (unref(store).selectedCourriers.length > 0) {
        _push(`<div class="flex items-center gap-2" data-v-651c50a0><span class="${ssrRenderClass([unref(store).selectedCourriers.length === 1 ? "bg-blue-100 text-blue-800" : "bg-blue-100 text-blue-800", "px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap"])}" data-v-651c50a0>${ssrInterpolate(unref(store).selectedCourriers.length)} courrier${ssrInterpolate(unref(store).selectedCourriers.length > 1 ? "s" : "")}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(store).selectedCourriers.length > 0) {
        _push(`<div class="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200" data-v-651c50a0><p class="text-xs text-slate-700 flex items-center gap-2" data-v-651c50a0>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: unref(store).selectedCourriers.length === 1 ? "i-heroicons-check-circle" : "i-heroicons-inbox-stack",
          class: "w-4 h-4"
        }, null, _parent));
        if (unref(store).selectedCourriers.length === 1) {
          _push(`<span data-v-651c50a0><strong data-v-651c50a0>1 courrier</strong> s\xE9lectionn\xE9 \u2192 S\xE9lection <strong data-v-651c50a0>multiple destinataires</strong> possible </span>`);
        } else {
          _push(`<span data-v-651c50a0><strong data-v-651c50a0>${ssrInterpolate(unref(store).selectedCourriers.length)} courriers</strong> s\xE9lectionn\xE9s \u2192 S\xE9lection <strong data-v-651c50a0>d&#39;UN SEUL destinataire</strong> requis </span>`);
        }
        _push(`</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="relative" data-v-651c50a0>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "i-heroicons-magnifying-glass",
        class: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
      }, null, _parent));
      _push(`<input${ssrRenderAttr("value", searchQuery.value)} type="text" placeholder="Rechercher par r\xE9f\xE9rence ou objet..." class="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-slate-700 placeholder:text-slate-400" data-v-651c50a0>`);
      if (searchQuery.value) {
        _push(`<button class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors" data-v-651c50a0>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-x-mark",
          class: "w-4 h-4"
        }, null, _parent));
        _push(`</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="overflow-auto" style="${ssrRenderStyle({ "height": "400px" })}" data-v-651c50a0><div class="p-4 space-y-3" data-v-651c50a0><!--[-->`);
      ssrRenderList(filteredCourriers.value, (courrier) => {
        _push(ssrRenderComponent(_component_AffectationsCourrierCard, {
          key: courrier.id,
          courrier,
          selected: unref(store).selectedCourriers.includes(courrier.id),
          disabled: false,
          onToggle: ($event) => toggleCourrier(courrier.id)
        }, null, _parent));
      });
      _push(`<!--]-->`);
      if (__props.loading) {
        _push(`<div class="py-12 text-center" data-v-651c50a0><div class="flex flex-col items-center justify-center gap-3" data-v-651c50a0>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "svg-spinners:ring-resize",
          class: "w-8 h-8 text-blue-600"
        }, null, _parent));
        _push(`<p class="text-slate-500 font-medium" data-v-651c50a0>Chargement des courriers...</p></div></div>`);
      } else if (filteredCourriers.value.length === 0) {
        _push(`<div class="py-12 text-center" data-v-651c50a0><div class="flex flex-col items-center justify-center gap-3" data-v-651c50a0>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-inbox",
          class: "w-12 h-12 text-slate-300"
        }, null, _parent));
        _push(`<p class="text-slate-500 font-medium" data-v-651c50a0>Aucun courrier trouv\xE9</p><p class="text-xs text-slate-400" data-v-651c50a0>Modifiez votre recherche</p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      if (unref(store).selectedCourriers.length > 0) {
        _push(`<div class="px-6 py-4 bg-blue-50 border-t border-blue-100" data-v-651c50a0><div class="flex items-center justify-between" data-v-651c50a0><div class="text-sm" data-v-651c50a0><span class="font-semibold text-blue-900" data-v-651c50a0>${ssrInterpolate(unref(store).selectedCourriers.length)}</span><span class="text-slate-700" data-v-651c50a0> / ${ssrInterpolate(filteredCourriers.value.length)} s\xE9lectionn\xE9(s)</span></div><div class="flex items-center gap-2" data-v-651c50a0>`);
        if (filteredCourriers.value.length > unref(store).selectedCourriers.length) {
          _push(`<button class="px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors" title="S\xE9lectionner tous les courriers visibles" data-v-651c50a0> \u2713 Tous </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button class="px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors" data-v-651c50a0> R\xE9initialiser </button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/affectations/AffectationsCourrierSelectionPanel.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const AffectationsCourrierSelectionPanel = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-651c50a0"]]);
const _sfc_main$4 = {
  __name: "AffectationsDestinataireCard",
  __ssrInlineRender: true,
  props: {
    destinataire: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ["toggle"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      const _component_Icon = __nuxt_component_0$2;
      _push(`<label${ssrRenderAttrs(mergeProps({
        class: ["flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all border-2", __props.disabled ? "opacity-50 cursor-not-allowed bg-slate-50 border-slate-200" : __props.selected ? "bg-indigo-50 border-indigo-300 hover:border-indigo-400" : "bg-white border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30"]
      }, _attrs))}><input type="checkbox"${ssrIncludeBooleanAttr(__props.selected) ? " checked" : ""}${ssrIncludeBooleanAttr(__props.disabled) ? " disabled" : ""} class="w-4 h-4 text-indigo-600 border-slate-300 rounded cursor-pointer mt-1 flex-shrink-0 disabled:cursor-not-allowed"><div class="flex-1 min-w-0"><p class="font-semibold text-slate-900">${ssrInterpolate((_a = __props.destinataire.user) == null ? void 0 : _a.nom)} ${ssrInterpolate((_b = __props.destinataire.user) == null ? void 0 : _b.prenom)}</p><p class="text-sm text-slate-700 mt-1"><span class="inline-block px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded font-medium mr-2 text-xs">${ssrInterpolate((_c = __props.destinataire.entite) == null ? void 0 : _c.code)}</span><span class="text-slate-600">`);
      if (__props.destinataire.is_responsable) {
        _push(`<span>${ssrInterpolate((_d = __props.destinataire.entite) == null ? void 0 : _d.fonction)}</span>`);
      } else {
        _push(`<span> Agent </span>`);
      }
      _push(`</span></p></div>`);
      if (__props.selected && !__props.disabled) {
        _push(`<div class="flex-shrink-0">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-check-circle",
          class: "w-5 h-5 text-indigo-600"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.disabled) {
        _push(`<div class="flex-shrink-0">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-lock-closed",
          class: "w-5 h-5 text-slate-400"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</label>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/affectations/AffectationsDestinataireCard.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = {
  __name: "AffectationsDestinataireSelectionPanel",
  __ssrInlineRender: true,
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    const store = useAffectationsStore();
    const searchQuery = ref("");
    const canSelectMultiple = computed(() => {
      return store.canSelectMultipleDestinataires;
    });
    const filteredDestinataires = computed(() => {
      if (!searchQuery.value) return store.destinataires;
      const query = searchQuery.value.toLowerCase();
      return store.destinataires.filter((dest) => {
        var _a, _b, _c, _d, _e, _f;
        const fullName = `${((_a = dest.user) == null ? void 0 : _a.nom) || ""} ${((_b = dest.user) == null ? void 0 : _b.prenom) || ""}`.toLowerCase();
        const fonction = ((_d = (_c = dest.entite) == null ? void 0 : _c.fonction) == null ? void 0 : _d.toLowerCase()) || "";
        const entite = ((_f = (_e = dest.entite) == null ? void 0 : _e.libelle) == null ? void 0 : _f.toLowerCase()) || "";
        return fullName.includes(query) || fonction.includes(query) || entite.includes(query);
      });
    });
    const toggleDestinataire = (destinataireId) => {
      console.log("\u{1F535} Toggle destinataire appel\xE9 avec ID:", destinataireId);
      console.log("\u{1F535} Avant toggle:", [...store.selectedDestinataires]);
      store.toggleDestinataire(destinataireId);
      console.log("\u{1F535} Apr\xE8s toggle:", [...store.selectedDestinataires]);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 overflow-hidden transition-all hover:shadow-xl hover:shadow-slate-200/80" }, _attrs))}><div class="px-6 py-5 border-b border-slate-100"><div class="flex items-start justify-between mb-4"><h3 class="text-xl font-bold text-slate-900">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "i-heroicons-user-group",
        class: "inline-block w-6 h-6 text-indigo-600 mr-2"
      }, null, _parent));
      _push(` 2. Destinataires </h3>`);
      if (unref(store).selectedCourrierCount > 0) {
        _push(`<div class="flex items-center gap-2"><span class="${ssrRenderClass([canSelectMultiple.value ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800", "px-3 py-1 rounded-full text-xs font-bold"])}">${ssrInterpolate(canSelectMultiple.value ? "Multi-s\xE9lection" : "S\xE9lection unique")}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(store).selectedCourrierCount > 0) {
        _push(`<div class="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200"><p class="text-xs text-slate-700">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: canSelectMultiple.value ? "i-heroicons-check-circle" : "i-heroicons-information-circle",
          class: "inline-block w-4 h-4 mr-1"
        }, null, _parent));
        if (canSelectMultiple.value) {
          _push(`<span class="text-green-700"><strong>${ssrInterpolate(unref(store).selectedCourrierCount)} courrier</strong> s\xE9lectionn\xE9(s) \u2192 Vous pouvez choisir <strong>plusieurs destinataires</strong></span>`);
        } else {
          _push(`<span class="text-orange-700"><strong>${ssrInterpolate(unref(store).selectedCourrierCount)} courriers</strong> s\xE9lectionn\xE9s \u2192 Vous ne pouvez choisir qu&#39;<strong>UN SEUL destinataire</strong></span>`);
        }
        _push(`</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="relative">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "i-heroicons-magnifying-glass",
        class: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
      }, null, _parent));
      _push(`<input${ssrRenderAttr("value", searchQuery.value)} type="text" placeholder="Rechercher par nom, fonction ou entit\xE9..." class="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-slate-700 placeholder:text-slate-400"></div></div><div class="overflow-auto p-4 space-y-3" style="${ssrRenderStyle({ "height": "400px" })}"><!--[-->`);
      ssrRenderList(filteredDestinataires.value, (destinataire) => {
        _push(ssrRenderComponent(_sfc_main$4, {
          key: destinataire.id,
          destinataire,
          selected: unref(store).selectedDestinataires.includes(destinataire.id),
          disabled: !canSelectMultiple.value && unref(store).selectedDestinataires.length > 0 && !unref(store).selectedDestinataires.includes(destinataire.id),
          onToggle: toggleDestinataire
        }, null, _parent));
      });
      _push(`<!--]-->`);
      if (__props.loading) {
        _push(`<div class="py-12 text-center"><div class="flex flex-col items-center justify-center gap-3">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "svg-spinners:ring-resize",
          class: "w-8 h-8 text-indigo-600"
        }, null, _parent));
        _push(`<p class="text-slate-500">Chargement des destinataires...</p></div></div>`);
      } else if (filteredDestinataires.value.length === 0) {
        _push(`<div class="py-12 text-center"><div class="flex flex-col items-center justify-center gap-3">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-user-group",
          class: "w-12 h-12 text-slate-300"
        }, null, _parent));
        _push(`<p class="text-slate-500">Aucun destinataire trouv\xE9</p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(store).selectedCourrierCount === 0) {
        _push(`<div class="py-12 text-center"><div class="flex flex-col items-center justify-center gap-3">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-exclamation-circle",
          class: "w-12 h-12 text-slate-300"
        }, null, _parent));
        _push(`<p class="text-slate-500 font-medium">Veuillez d&#39;abord s\xE9lectionner un courrier</p><p class="text-xs text-slate-400">Les destinataires appara\xEEtront apr\xE8s la s\xE9lection</p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="px-6 py-4 bg-slate-50 border-t border-slate-100"><div class="flex items-center justify-between"><div class="text-sm"><span class="font-semibold text-slate-900">${ssrInterpolate(unref(store).selectedDestinataires.length)}</span><span class="text-slate-600"> / ${ssrInterpolate(filteredDestinataires.value.length)} ${ssrInterpolate(canSelectMultiple.value ? "destinataire(s)" : "destinataire")}</span></div><div class="flex items-center gap-2">`);
      if (canSelectMultiple.value && filteredDestinataires.value.length > 0) {
        _push(`<button class="px-3 py-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"> Tous </button>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(store).selectedDestinataires.length > 0) {
        _push(`<button class="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"> R\xE9initialiser </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></div>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/affectations/AffectationsDestinataireSelectionPanel.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = {
  __name: "AffectationsFormPanel",
  __ssrInlineRender: true,
  setup(__props) {
    const store = useAffectationsStore();
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const priorityOptions = [
      { label: "Urgent", value: "urgent" },
      { label: "Important", value: "important" },
      { label: "Standard", value: "standard" }
    ];
    const calculatedDelai = computed(() => {
      const dateAffect = store.formData.date_affect;
      const dateRetour = store.formData.delai_traitement;
      if (!dateAffect || !dateRetour) {
        return "-";
      }
      const dateDebut = new Date(dateAffect);
      const dateFin = new Date(dateRetour);
      const diffTime = dateFin - dateDebut;
      const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
      if (diffDays < 0) {
        return "0";
      }
      return diffDays.toString();
    });
    const getPriorityColor = (priority) => {
      const colors = {
        "urgent": { dot: "bg-red-500" },
        "important": { dot: "bg-orange-500" },
        "standard": { dot: "bg-blue-500" }
      };
      return colors[priority == null ? void 0 : priority.toLowerCase()] || { dot: "bg-gray-500" };
    };
    const getPriorityLabel = (priority) => {
      const labels = {
        "urgent": "Urgent",
        "important": "Important",
        "standard": "Standard"
      };
      return labels[priority == null ? void 0 : priority.toLowerCase()] || priority;
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_Icon = __nuxt_component_0$2;
      const _component_UInput = __nuxt_component_2;
      const _component_USelectMenu = __nuxt_component_1$1;
      const _component_UTextarea = __nuxt_component_3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 overflow-hidden transition-all hover:shadow-xl hover:shadow-slate-200/80" }, _attrs))} data-v-42444277><div class="px-6 py-5 border-b border-slate-100" data-v-42444277><h3 class="text-xl font-bold text-slate-900" data-v-42444277>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "i-heroicons-clipboard-document-list",
        class: "inline-block w-6 h-6 text-blue-600 mr-2"
      }, null, _parent));
      _push(` 3. D\xE9tails de l&#39;Affectation </h3></div><div class="p-6 space-y-6" data-v-42444277><div class="grid grid-cols-1 md:grid-cols-4 gap-4" data-v-42444277><div data-v-42444277><label class="block text-sm font-medium text-gray-700 mb-2" data-v-42444277> Date d&#39;affectation <span class="text-red-500" data-v-42444277>*</span></label>`);
      _push(ssrRenderComponent(_component_UInput, {
        "model-value": unref(store).formData.date_affect,
        "onUpdate:modelValue": ($event) => unref(store).updateFormData("date_affect", $event),
        type: "date",
        size: "lg",
        icon: "i-heroicons-calendar",
        max: unref(today),
        required: ""
      }, null, _parent));
      _push(`</div><div data-v-42444277><label class="block text-sm font-medium text-gray-700 mb-2" data-v-42444277> Date de retour attendue <span class="text-red-500" data-v-42444277>*</span></label>`);
      _push(ssrRenderComponent(_component_UInput, {
        "model-value": unref(store).formData.delai_traitement,
        "onUpdate:modelValue": ($event) => unref(store).updateFormData("delai_traitement", $event),
        type: "date",
        size: "lg",
        icon: "i-heroicons-clock",
        min: unref(store).formData.date_affect || unref(today),
        required: ""
      }, null, _parent));
      _push(`</div><div data-v-42444277><label class="block text-sm font-medium text-gray-700 mb-2" data-v-42444277> D\xE9lai (en jours) </label><div class="relative" data-v-42444277>`);
      _push(ssrRenderComponent(_component_UInput, {
        "model-value": calculatedDelai.value,
        type: "text",
        size: "lg",
        icon: "i-heroicons-calculator",
        readonly: "",
        disabled: "",
        class: "bg-gray-50"
      }, null, _parent));
      _push(`<div class="absolute inset-y-0 right-3 flex items-center pointer-events-none" data-v-42444277><span class="text-sm font-medium text-gray-500" data-v-42444277>jours</span></div></div></div><div data-v-42444277><label class="block text-sm font-medium text-gray-700 mb-2" data-v-42444277> Priorit\xE9 <span class="text-red-500" data-v-42444277>*</span></label>`);
      _push(ssrRenderComponent(_component_USelectMenu, {
        "model-value": unref(store).formData.priority,
        "onUpdate:modelValue": ($event) => unref(store).updateFormData("priority", $event),
        options: priorityOptions,
        size: "lg",
        placeholder: "S\xE9lectionner",
        "value-attribute": "value",
        "option-attribute": "label",
        required: ""
      }, {
        label: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(store).formData.priority) {
              _push2(`<span class="flex items-center gap-2" data-v-42444277${_scopeId}><span class="${ssrRenderClass([getPriorityColor(unref(store).formData.priority).dot, "w-3 h-3 rounded-full"])}" data-v-42444277${_scopeId}></span> ${ssrInterpolate(getPriorityLabel(unref(store).formData.priority))}</span>`);
            } else {
              _push2(`<span class="text-gray-500" data-v-42444277${_scopeId}>S\xE9lectionner</span>`);
            }
          } else {
            return [
              unref(store).formData.priority ? (openBlock(), createBlock("span", {
                key: 0,
                class: "flex items-center gap-2"
              }, [
                createVNode("span", {
                  class: ["w-3 h-3 rounded-full", getPriorityColor(unref(store).formData.priority).dot]
                }, null, 2),
                createTextVNode(" " + toDisplayString(getPriorityLabel(unref(store).formData.priority)), 1)
              ])) : (openBlock(), createBlock("span", {
                key: 1,
                class: "text-gray-500"
              }, "S\xE9lectionner"))
            ];
          }
        }),
        option: withCtx(({ option }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="flex items-center gap-2" data-v-42444277${_scopeId}><span class="${ssrRenderClass([getPriorityColor(option.value).dot, "w-3 h-3 rounded-full"])}" data-v-42444277${_scopeId}></span> ${ssrInterpolate(option.label)}</span>`);
          } else {
            return [
              createVNode("span", { class: "flex items-center gap-2" }, [
                createVNode("span", {
                  class: ["w-3 h-3 rounded-full", getPriorityColor(option.value).dot]
                }, null, 2),
                createTextVNode(" " + toDisplayString(option.label), 1)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div data-v-42444277><label class="block text-sm font-medium text-gray-700 mb-2" data-v-42444277> Annotations <span class="text-red-500" data-v-42444277>*</span></label>`);
      _push(ssrRenderComponent(_component_UTextarea, {
        "model-value": unref(store).formData.instructions,
        "onUpdate:modelValue": ($event) => unref(store).updateFormData("instructions", $event),
        rows: 2,
        size: "lg",
        placeholder: "Saisir les instructions d\xE9taill\xE9es pour le traitement...",
        required: ""
      }, null, _parent));
      _push(`<p class="text-xs text-gray-500 mt-2" data-v-42444277>${ssrInterpolate(((_a = unref(store).formData.instructions) == null ? void 0 : _a.length) || 0)} caract\xE8res </p></div><div data-v-42444277><label class="flex items-center gap-3 cursor-pointer mb-3" data-v-42444277><input type="checkbox"${ssrIncludeBooleanAttr(unref(store).showDateCloture) ? " checked" : ""} class="w-4 h-4 text-blue-600 border-gray-300 rounded cursor-pointer" data-v-42444277><span class="text-sm font-medium text-gray-700" data-v-42444277> Ajouter une date de cl\xF4ture </span></label>`);
      if (unref(store).showDateCloture) {
        _push(`<div data-v-42444277>`);
        _push(ssrRenderComponent(_component_UInput, {
          "model-value": unref(store).formData.date_cloture,
          "onUpdate:modelValue": ($event) => unref(store).updateFormData("date_cloture", $event),
          type: "date",
          size: "lg",
          icon: "i-heroicons-calendar-days",
          min: unref(store).formData.delai_traitement || unref(today),
          placeholder: "S\xE9lectionner une date"
        }, null, _parent));
        _push(`<p class="text-xs text-gray-500 mt-2" data-v-42444277> La date de cl\xF4ture doit \xEAtre sup\xE9rieure \xE0 la date de retour attendue </p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/affectations/AffectationsFormPanel.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const AffectationsFormPanel = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-42444277"]]);
const _sfc_main$1 = {
  __name: "FolderAffectationModal",
  __ssrInlineRender: true,
  emits: ["confirm"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const store = useAffectationsStore();
    const isOpen = ref(false);
    const withFolder = ref(true);
    const folderName = ref("");
    const courriersCount = computed(() => store.selectedCourriers.length);
    const destinataireCount = computed(() => store.selectedDestinataires.length);
    const courriersList = computed(() => {
      return store.selectedCourriers.map(
        (courrierId) => store.courriers.find((c) => c.id === courrierId)
      ).filter(Boolean);
    });
    const destinatairesList = computed(() => {
      return store.selectedDestinataires.map(
        (destId) => store.destinataires.find((d) => d.id === destId)
      ).filter(Boolean);
    });
    const openModal = async (suggestedFolderName = "") => {
      withFolder.value = true;
      folderName.value = suggestedFolderName;
      isOpen.value = true;
    };
    const handleCancel = () => {
      isOpen.value = false;
      folderName.value = "";
      withFolder.value = true;
    };
    __expose({
      openModal,
      handleCancel
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0$2;
      ssrRenderTeleport(_push, (_push2) => {
        var _a, _b;
        if (isOpen.value) {
          _push2(`<div class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" data-v-4eb19d6c></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (isOpen.value) {
          _push2(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none" data-v-4eb19d6c><div class="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto" data-v-4eb19d6c><div class="bg-gradient-to-r from-sky-600 to-blue-600 px-6 py-6" data-v-4eb19d6c><div class="flex items-start justify-between" data-v-4eb19d6c><div data-v-4eb19d6c><h2 class="text-2xl font-bold text-white" data-v-4eb19d6c>Cr\xE9er un dossier d&#39;affectation ?</h2><p class="text-sm text-sky-100 mt-2" data-v-4eb19d6c> Vous avez s\xE9lectionn\xE9 ${ssrInterpolate(courriersCount.value)} courrier(s) et ${ssrInterpolate(destinataireCount.value)} destinataire(s) </p></div><button class="text-white/70 hover:text-white transition-colors" data-v-4eb19d6c>`);
          _push2(ssrRenderComponent(_component_Icon, {
            name: "i-heroicons-x-mark",
            class: "w-6 h-6"
          }, null, _parent));
          _push2(`</button></div></div><div class="p-6 space-y-6" data-v-4eb19d6c><div class="bg-sky-50 border border-sky-200 rounded-lg p-4" data-v-4eb19d6c><div class="flex items-start gap-3" data-v-4eb19d6c>`);
          _push2(ssrRenderComponent(_component_Icon, {
            name: "i-heroicons-light-bulb",
            class: "w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5"
          }, null, _parent));
          _push2(`<div data-v-4eb19d6c><p class="text-sm font-semibold text-sky-900" data-v-4eb19d6c>Qu&#39;est-ce qu&#39;un dossier d&#39;affectation ?</p><p class="text-xs text-sky-700 mt-1" data-v-4eb19d6c> Un dossier d&#39;affectation regroupe plusieurs courriers affect\xE9s au(x) m\xEAme(s) destinataire(s). Cela facilite le suivi et l&#39;organisation des affectations li\xE9es. </p></div></div></div><div class="grid grid-cols-2 gap-4" data-v-4eb19d6c><div class="bg-slate-50 rounded-lg p-4 border border-slate-200" data-v-4eb19d6c><p class="text-xs font-semibold text-slate-600 uppercase mb-3" data-v-4eb19d6c>Courriers \xE0 affecter</p><div class="space-y-2 max-h-40 overflow-y-auto" data-v-4eb19d6c><!--[-->`);
          ssrRenderList(courriersList.value, (courrier) => {
            _push2(`<div class="flex items-start gap-2 text-xs" data-v-4eb19d6c>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "i-heroicons-document-text",
              class: "w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5"
            }, null, _parent));
            _push2(`<div class="flex-1 min-w-0" data-v-4eb19d6c><p class="font-medium text-slate-900" data-v-4eb19d6c>${ssrInterpolate(courrier.reference)}</p><p class="text-slate-600 truncate" data-v-4eb19d6c>${ssrInterpolate(courrier.objet)}</p></div></div>`);
          });
          _push2(`<!--]--></div></div><div class="bg-slate-50 rounded-lg p-4 border border-slate-200" data-v-4eb19d6c><p class="text-xs font-semibold text-slate-600 uppercase mb-3" data-v-4eb19d6c>Destinataire(s)</p><div class="space-y-2 max-h-40 overflow-y-auto" data-v-4eb19d6c><!--[-->`);
          ssrRenderList(destinatairesList.value, (dest) => {
            var _a2, _b2, _c;
            _push2(`<div class="flex items-start gap-2 text-xs" data-v-4eb19d6c>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "i-heroicons-user",
              class: "w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5"
            }, null, _parent));
            _push2(`<div class="flex-1 min-w-0" data-v-4eb19d6c><p class="font-medium text-slate-900" data-v-4eb19d6c>${ssrInterpolate((_a2 = dest.user) == null ? void 0 : _a2.nom)} ${ssrInterpolate((_b2 = dest.user) == null ? void 0 : _b2.prenom)}</p><p class="text-slate-600 truncate" data-v-4eb19d6c>${ssrInterpolate((_c = dest.fonction) == null ? void 0 : _c.code)}</p></div></div>`);
          });
          _push2(`<!--]--></div></div></div><div class="${ssrRenderClass([withFolder.value ? "border-sky-500 bg-sky-50/50" : "border-slate-200 bg-white hover:bg-slate-50", "border-2 rounded-lg p-4 cursor-pointer transition-all"])}" data-v-4eb19d6c><div class="flex items-start gap-3" data-v-4eb19d6c><div class="${ssrRenderClass([withFolder.value ? "border-sky-600 bg-sky-600" : "border-slate-300", "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5"])}" data-v-4eb19d6c>`);
          if (withFolder.value) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "i-heroicons-check",
              class: "w-3 h-3 text-white"
            }, null, _parent));
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div class="flex-1 min-w-0" data-v-4eb19d6c><p class="font-semibold text-slate-900" data-v-4eb19d6c>Oui, cr\xE9er un dossier d&#39;affectation</p><p class="text-sm text-slate-600 mt-1" data-v-4eb19d6c> Regrouper ces ${ssrInterpolate(courriersCount.value)} courrier(s) dans un dossier identifi\xE9 </p></div></div>`);
          if (withFolder.value) {
            _push2(`<div class="mt-4 ml-8" data-v-4eb19d6c><label class="block text-sm font-medium text-slate-700 mb-2" data-v-4eb19d6c> Nom du dossier <span class="text-red-500" data-v-4eb19d6c>*</span></label><div class="relative" data-v-4eb19d6c>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "i-heroicons-folder",
              class: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
            }, null, _parent));
            _push2(`<input${ssrRenderAttr("value", folderName.value)} type="text" placeholder="Ex: Courriers direction g\xE9n\xE9rale - F\xE9vrier 2026" class="w-full pl-10 pr-4 py-2.5 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-slate-700 placeholder:text-slate-400" data-v-4eb19d6c></div><p class="text-xs text-slate-500 mt-2" data-v-4eb19d6c>${ssrInterpolate(((_a = folderName.value) == null ? void 0 : _a.length) || 0)} / 255 caract\xE8res </p></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div class="${ssrRenderClass([!withFolder.value ? "border-slate-500 bg-slate-50" : "border-slate-200 bg-white hover:bg-slate-50", "border-2 rounded-lg p-4 cursor-pointer transition-all"])}" data-v-4eb19d6c><div class="flex items-start gap-3" data-v-4eb19d6c><div class="${ssrRenderClass([!withFolder.value ? "border-slate-600 bg-slate-600" : "border-slate-300", "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5"])}" data-v-4eb19d6c>`);
          if (!withFolder.value) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "i-heroicons-check",
              class: "w-3 h-3 text-white"
            }, null, _parent));
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div class="flex-1 min-w-0" data-v-4eb19d6c><p class="font-semibold text-slate-900" data-v-4eb19d6c>Non, continuer sans dossier</p><p class="text-sm text-slate-600 mt-1" data-v-4eb19d6c> Cr\xE9er les ${ssrInterpolate(courriersCount.value)} affectation(s) individuellement </p></div></div></div></div><div class="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3" data-v-4eb19d6c><button class="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all" data-v-4eb19d6c> Annuler </button><button${ssrIncludeBooleanAttr(withFolder.value && !((_b = folderName.value) == null ? void 0 : _b.trim())) ? " disabled" : ""} class="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-blue-600 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2" data-v-4eb19d6c>`);
          _push2(ssrRenderComponent(_component_Icon, {
            name: "i-heroicons-check",
            class: "w-4 h-4"
          }, null, _parent));
          _push2(` Continuer </button></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/affectations/FolderAffectationModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const FolderAffectationModal = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-4eb19d6c"]]);
const _sfc_main = {
  __name: "AffectationsSummaryBar",
  __ssrInlineRender: true,
  emits: ["cancel", "submit"],
  setup(__props, { emit: __emit }) {
    const store = useAffectationsStore();
    const folderModalRef = ref(null);
    const emit = __emit;
    const getCourrier = (courrierId) => {
      return store.courriers.find((c) => c.id === courrierId);
    };
    const getSelectedDestinataires = () => {
      return store.selectedDestinataires.map((destId) => store.destinataires.find((d) => d.id === destId)).filter(Boolean);
    };
    const getInitials = (user) => {
      if (!user) return "??";
      const nom = user.nom || "";
      const prenom = user.prenom || "";
      return `${nom.charAt(0)}${prenom.charAt(0)}`.toUpperCase();
    };
    const getAvatarColor = (user) => {
      const initials = getInitials(user);
      const hash = initials.charCodeAt(0) + initials.charCodeAt(1);
      const colors = [
        "bg-gradient-to-br from-blue-500 to-blue-600",
        "bg-gradient-to-br from-indigo-500 to-indigo-600",
        "bg-gradient-to-br from-blue-500 to-blue-600",
        "bg-gradient-to-br from-pink-500 to-pink-600",
        "bg-gradient-to-br from-cyan-500 to-blue-600"
      ];
      return colors[hash % colors.length];
    };
    const getPriorityColor = (priority) => {
      const colors = {
        "Urgent": { dot: "bg-red-500" },
        "Important": { dot: "bg-orange-500" },
        "Standard": { dot: "bg-blue-500" }
      };
      return colors[priority] || { dot: "bg-gray-500" };
    };
    const getStatutColor = (statut) => {
      const colors = {
        "En attente": { dot: "bg-gray-500" },
        "En cours": { dot: "bg-blue-500" },
        "Trait\xE9": { dot: "bg-green-500" },
        "Cl\xF4tur\xE9": { dot: "bg-blue-500" },
        "Annul\xE9": { dot: "bg-red-500" }
      };
      return colors[statut] || { dot: "bg-gray-500" };
    };
    const formatDate = (date) => {
      if (!date) return "";
      return new Date(date).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      });
    };
    const handleModalConfirm = () => {
      emit("submit");
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0$2;
      _push(`<!--[--><div class="bg-white rounded-2xl shadow-xl shadow-slate-200/80 border border-slate-200 p-6" data-v-573a4363><div class="space-y-6" data-v-573a4363><div class="flex items-center justify-between" data-v-573a4363><div class="flex items-center gap-6" data-v-573a4363><div data-v-573a4363><p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1" data-v-573a4363> Pr\xEAt pour affecter ? </p><div class="flex items-center gap-4" data-v-573a4363><span class="text-2xl font-bold text-slate-900" data-v-573a4363>${ssrInterpolate(unref(store).selectedCourriers.length)} Courrier${ssrInterpolate(unref(store).selectedCourriers.length !== 1 ? "s" : "")}</span><span class="text-2xl font-bold text-slate-400" data-v-573a4363>\u2022</span><span class="text-2xl font-bold text-slate-900" data-v-573a4363>${ssrInterpolate(unref(store).selectedDestinataires.length)} Destinataire${ssrInterpolate(unref(store).selectedDestinataires.length !== 1 ? "s" : "")}</span></div></div></div><div class="flex items-center gap-3" data-v-573a4363><button class="px-6 py-3 rounded-xl font-semibold text-slate-700 bg-white border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all" data-v-573a4363> Annuler </button><button${ssrIncludeBooleanAttr(!unref(store).canSend) ? " disabled" : ""} class="group px-6 py-3 rounded-xl font-semibold bg-gradient-to-br from-emerald-700 to-blue-800 text-white hover:from-emerald-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 flex items-center gap-2" data-v-573a4363> Cr\xE9er ${ssrInterpolate(unref(store).selectedDestinataires.length > 0 ? unref(store).selectedDestinataires.length : "")} affectation${ssrInterpolate(unref(store).selectedDestinataires.length > 1 ? "s" : "")} `);
      _push(ssrRenderComponent(_component_Icon, {
        name: "i-heroicons-check",
        class: "w-5 h-5 transition-transform group-hover:scale-110"
      }, null, _parent));
      _push(`</button></div></div>`);
      if (unref(store).hasSelections) {
        _push(`<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 border-t border-slate-200" data-v-573a4363><div class="lg:col-span-1" data-v-573a4363><p class="text-xs font-semibold text-slate-600 uppercase mb-3" data-v-573a4363> Courrier${ssrInterpolate(unref(store).selectedCourriers.length > 1 ? "s" : "")}</p><div class="space-y-2" data-v-573a4363><!--[-->`);
        ssrRenderList(unref(store).selectedCourriers, (courrierId) => {
          var _a, _b;
          _push(`<div class="bg-blue-50 rounded-lg p-3 border border-blue-100" data-v-573a4363><div class="flex items-start gap-2" data-v-573a4363>`);
          _push(ssrRenderComponent(_component_Icon, {
            name: "i-heroicons-document-check",
            class: "w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
          }, null, _parent));
          _push(`<div class="flex-1 min-w-0" data-v-573a4363><p class="text-sm font-bold text-blue-900" data-v-573a4363>${ssrInterpolate((_a = getCourrier(courrierId)) == null ? void 0 : _a.reference)}</p><p class="text-xs text-slate-700 mt-1 line-clamp-2" data-v-573a4363>${ssrInterpolate((_b = getCourrier(courrierId)) == null ? void 0 : _b.objet)}</p></div></div></div>`);
        });
        _push(`<!--]--></div></div><div class="lg:col-span-1" data-v-573a4363><p class="text-xs font-semibold text-slate-600 uppercase mb-3" data-v-573a4363>Destinataires</p><div class="flex items-center flex-wrap gap-2" data-v-573a4363><!--[-->`);
        ssrRenderList(getSelectedDestinataires(), (destinataire) => {
          var _a, _b;
          _push(`<div class="flex items-center gap-2 bg-slate-100 rounded-full px-3 py-1.5 text-xs" data-v-573a4363><div class="${ssrRenderClass([getAvatarColor(destinataire.user), "w-6 h-6 rounded-full flex items-center justify-center font-bold text-white text-xs"])}" data-v-573a4363>${ssrInterpolate(getInitials(destinataire.user))}</div><span class="font-medium text-slate-900" data-v-573a4363>${ssrInterpolate((_a = destinataire.user) == null ? void 0 : _a.nom)} ${ssrInterpolate((_b = destinataire.user) == null ? void 0 : _b.prenom)}</span></div>`);
        });
        _push(`<!--]--></div></div><div class="lg:col-span-1" data-v-573a4363><p class="text-xs font-semibold text-slate-600 uppercase mb-3" data-v-573a4363>D\xE9tails</p><div class="space-y-2" data-v-573a4363><div class="flex items-center gap-2 text-sm" data-v-573a4363><span class="${ssrRenderClass([getPriorityColor(unref(store).formData.priority).dot, "w-3 h-3 rounded-full"])}" data-v-573a4363></span><span class="font-medium" data-v-573a4363>${ssrInterpolate(unref(store).formData.priority)}</span></div><div class="flex items-center gap-2 text-sm" data-v-573a4363><span class="${ssrRenderClass([getStatutColor(unref(store).formData.statut).dot, "w-3 h-3 rounded-full"])}" data-v-573a4363></span><span class="font-medium" data-v-573a4363>${ssrInterpolate(unref(store).formData.statut)}</span></div><div class="flex items-center gap-2 text-sm text-slate-600" data-v-573a4363>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-clock",
          class: "w-4 h-4"
        }, null, _parent));
        _push(`<span data-v-573a4363>${ssrInterpolate(formatDate(unref(store).formData.delai_traitement))}</span></div>`);
        if (unref(store).useFolder && unref(store).folderName) {
          _push(`<div class="mt-3 pt-3 border-t border-slate-200" data-v-573a4363><div class="flex items-center gap-2 text-sm text-indigo-700 bg-indigo-50 px-2 py-1 rounded" data-v-573a4363>`);
          _push(ssrRenderComponent(_component_Icon, {
            name: "i-heroicons-folder",
            class: "w-4 h-4"
          }, null, _parent));
          _push(`<span class="font-medium truncate" data-v-573a4363>${ssrInterpolate(unref(store).folderName)}</span></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(store).hasSelections) {
        _push(`<div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200" data-v-573a4363><div class="flex items-start gap-3" data-v-573a4363>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-information-circle",
          class: "w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
        }, null, _parent));
        _push(`<div data-v-573a4363><p class="text-sm text-slate-700" data-v-573a4363><span class="font-semibold text-blue-900" data-v-573a4363>${ssrInterpolate(unref(store).selectedDestinataires.length)} affectation${ssrInterpolate(unref(store).selectedDestinataires.length > 1 ? "s" : "")}</span> sera/seront cr\xE9\xE9e(s) ${ssrInterpolate(unref(store).selectedCourriers.length > 1 ? `pour les ${unref(store).selectedCourriers.length} courriers` : "pour le courrier")}</p>`);
        if (unref(store).useFolder && unref(store).folderName) {
          _push(`<p class="text-sm text-indigo-700 font-medium mt-1" data-v-573a4363> \u{1F4C1} Grouped dans le dossier : <strong data-v-573a4363>${ssrInterpolate(unref(store).folderName)}</strong></p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      _push(ssrRenderComponent(FolderAffectationModal, {
        ref_key: "folderModalRef",
        ref: folderModalRef,
        onConfirm: handleModalConfirm
      }, null, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/affectations/AffectationsSummaryBar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const AffectationsSummaryBar = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-573a4363"]]);

export { AffectationsCourrierSelectionPanel as A, _sfc_main$3 as _, AffectationsFormPanel as a, AffectationsSummaryBar as b };
//# sourceMappingURL=AffectationsSummaryBar-Dn4hOs1J.mjs.map
