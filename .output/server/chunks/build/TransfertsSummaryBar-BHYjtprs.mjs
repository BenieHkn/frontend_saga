import __nuxt_component_0 from './index-DJmPz9HS.mjs';
import { ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrRenderList, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderStyle } from 'vue/server-renderer';
import { u as useTransfertsStore } from './transferts-8xZaXUA2.mjs';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main$2 = {
  __name: "TransfertsDestinatairesCard",
  __ssrInlineRender: true,
  props: {
    recipient: { type: Object, required: true },
    selected: { type: Boolean, default: false }
  },
  emits: ["toggle"],
  setup(__props) {
    const getAvatarColor = (initials) => {
      const colors = [
        "bg-gradient-to-br from-blue-500 to-blue-600",
        "bg-gradient-to-br from-purple-500 to-purple-600",
        "bg-gradient-to-br from-pink-500 to-pink-600",
        "bg-gradient-to-br from-indigo-500 to-indigo-600",
        "bg-gradient-to-br from-cyan-500 to-cyan-600",
        "bg-gradient-to-br from-emerald-500 to-emerald-600",
        "bg-gradient-to-br from-orange-500 to-orange-600",
        "bg-gradient-to-br from-slate-500 to-slate-600"
      ];
      const charCode = ((initials == null ? void 0 : initials.charCodeAt(0)) || 0) + ((initials == null ? void 0 : initials.charCodeAt(1)) || 0);
      return colors[charCode % colors.length];
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["relative group flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer overflow-hidden", __props.selected ? "border-emerald-500 shadow-lg shadow-emerald-100" : "border-slate-200 bg-white hover:border-emerald-300 hover:shadow-sm"]
      }, _attrs))}>`);
      if (__props.selected) {
        _push(`<div class="absolute inset-0 pointer-events-none z-0" style="${ssrRenderStyle({ "background": "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)" })}"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex items-center gap-4 flex-1 min-w-0 z-10"><div class="${ssrRenderClass([getAvatarColor(__props.recipient.initials), "w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-sm transition-transform group-hover:scale-105"])}">${ssrInterpolate(__props.recipient.initials)}</div><div class="flex-1 min-w-0"><h4 class="font-bold text-slate-900 truncate">${ssrInterpolate(__props.recipient.name)}</h4><p class="text-sm text-slate-600 truncate font-medium">${ssrInterpolate(__props.recipient.fonction)}</p><p class="text-xs text-slate-400 truncate">${ssrInterpolate(__props.recipient.email)}</p></div></div><div class="${ssrRenderClass([__props.selected ? "bg-emerald-500 scale-110 shadow-md shadow-emerald-200" : "bg-slate-100 scale-100 group-hover:bg-emerald-100", "w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center transition-all duration-300 z-10"])}">`);
      if (__props.selected) {
        _push(ssrRenderComponent(_component_Icon, {
          key: "selected-icon",
          name: "heroicons:check-16-solid",
          class: "w-5 h-5 text-white"
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(_component_Icon, {
          key: "unselected-icon",
          name: "heroicons:plus-small-20-solid",
          class: "w-5 h-5 text-slate-400 group-hover:text-emerald-500"
        }, null, _parent));
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/transferts/TransfertsDestinatairesCard.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "TransfertsDestinatairesSelectionPanel",
  __ssrInlineRender: true,
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    const store = useTransfertsStore();
    const searchQuery = ref("");
    const filteredRecipients = computed(() => {
      const destinataires = store.destinataires;
      if (!searchQuery.value) return destinataires;
      const query = searchQuery.value.toLowerCase();
      return destinataires.filter(
        (r) => {
          var _a, _b, _c, _d;
          return ((_a = r.name) == null ? void 0 : _a.toLowerCase().includes(query)) || ((_b = r.email) == null ? void 0 : _b.toLowerCase().includes(query)) || ((_c = r.fonction) == null ? void 0 : _c.toLowerCase().includes(query)) || ((_d = r.entite) == null ? void 0 : _d.toLowerCase().includes(query));
        }
      );
    });
    console.log(filteredRecipients.value);
    const toggleDestinataire = (id) => {
      store.toggleDestinataire(id);
    };
    computed(() => {
      return null;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative bg-white rounded-2xl shadow-xl shadow-slate-200/80 border border-slate-200 overflow-hidden flex flex-col h-[600px]" }, _attrs))} data-v-c4367558><div class="flex-shrink-0 p-6 border-b border-slate-200 bg-slate-50/50" data-v-c4367558><div class="flex items-center justify-between mb-4" data-v-c4367558><h3 class="text-lg font-bold text-slate-900" data-v-c4367558>2. S\xE9lectionner les destinataires</h3>`);
      if (unref(store).selectedDestinataires.length > 0) {
        _push(`<button class="text-xs font-bold text-red-500 hover:text-red-700 uppercase tracking-wider transition-colors" data-v-c4367558> R\xE9initialiser </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="relative" data-v-c4367558>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "heroicons:magnifying-glass",
        class: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
      }, null, _parent));
      _push(`<input${ssrRenderAttr("value", searchQuery.value)} type="text" placeholder="Rechercher par nom ou email..." class="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-slate-900 placeholder-slate-400" data-v-c4367558></div></div><div class="${ssrRenderClass([{ "pb-24": unref(store).selectedDestinataires.length > 0 }, "flex-1 overflow-y-auto transition-all duration-300"])}" data-v-c4367558><div class="p-6" data-v-c4367558>`);
      if (__props.loading) {
        _push(`<div class="flex flex-col items-center justify-center py-12" data-v-c4367558>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "svg-spinners:blocks-shuffle-3",
          class: "w-12 h-12 text-emerald-500 mb-4"
        }, null, _parent));
        _push(`<p class="text-slate-500" data-v-c4367558>Chargement...</p></div>`);
      } else if (filteredRecipients.value.length === 0) {
        _push(`<div class="flex flex-col items-center justify-center py-12 text-center" data-v-c4367558>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "heroicons:user-group",
          class: "w-16 h-16 text-slate-200 mb-4"
        }, null, _parent));
        _push(`<p class="text-slate-500 font-medium" data-v-c4367558>Aucun destinataire trouv\xE9</p></div>`);
      } else {
        _push(`<div class="space-y-3" data-v-c4367558><!--[-->`);
        ssrRenderList(filteredRecipients.value, (recipient) => {
          _push(ssrRenderComponent(_sfc_main$2, {
            key: recipient.id,
            recipient,
            selected: unref(store).selectedDestinataires.includes(recipient.id),
            onToggle: ($event) => toggleDestinataire(recipient.id)
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></div>`);
      if (unref(store).selectedDestinataires.length > 0) {
        _push(`<div class="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-[90%]" data-v-c4367558><div class="bg-white/70 backdrop-blur-md text-black px-5 py-3 rounded-full shadow-2xl flex items-center justify-between border border-slate-700/50" data-v-c4367558><div class="flex items-center gap-3" data-v-c4367558><div class="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-lg" data-v-c4367558>${ssrInterpolate(unref(store).selectedDestinataires.length)}</div><span class="text-sm font-medium whitespace-nowrap" data-v-c4367558>Destinataire(s) pr\xEAt(s)</span></div><div class="flex items-center gap-2" data-v-c4367558><button class="text-xs text-slate-400 hover:text-white px-3 py-2 transition-colors" data-v-c4367558> Annuler </button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(store).selectedDestinataires.length === 0 && !__props.loading && filteredRecipients.value.length > 0) {
        _push(`<div class="flex-shrink-0 p-3 border-t border-slate-100 bg-slate-50/50 text-center" data-v-c4367558><p class="text-[11px] uppercase tracking-widest font-bold text-slate-400" data-v-c4367558>${ssrInterpolate(filteredRecipients.value.length)} contacts disponibles </p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/transferts/TransfertsDestinatairesSelectionPanel.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const TransfertsDestinatairesSelectionPanel = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-c4367558"]]);
const _sfc_main = {
  __name: "TransfertsSummaryBar",
  __ssrInlineRender: true,
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ["save-draft", "send-files"],
  setup(__props, { emit: __emit }) {
    const store = useTransfertsStore();
    const selectedAffectationsWithData = computed(() => {
      return store.selectedAffectationsData.map((affectation) => ({
        id: affectation.id,
        reference: affectation.reference || affectation.name || `#${affectation.id}`,
        name: affectation.name || affectation.instructions || `Affectation #${affectation.id}`
      }));
    });
    const selectedDestinatairesWithData = computed(() => {
      return store.selectedDestinatairesData.map((dest) => {
        var _a, _b, _c, _d;
        const nom = `${((_a = dest.user) == null ? void 0 : _a.nom) || ""} ${((_b = dest.user) == null ? void 0 : _b.prenom) || ""}`.trim();
        const initials = getInitials((_c = dest.user) == null ? void 0 : _c.nom, (_d = dest.user) == null ? void 0 : _d.prenom);
        return {
          id: dest.id,
          name: nom || `Destinataire #${dest.id}`,
          initials
        };
      });
    });
    const getInitials = (nom, prenom) => {
      const n = (nom || "").charAt(0).toUpperCase();
      const p = (prenom || "").charAt(0).toUpperCase();
      return n + p || "??";
    };
    const getAvatarColor = (initials) => {
      if (!initials) return "bg-gradient-to-br from-slate-500 to-slate-600";
      const colors = [
        "bg-gradient-to-br from-blue-500 to-blue-600",
        "bg-gradient-to-br from-purple-500 to-purple-600",
        "bg-gradient-to-br from-pink-500 to-pink-600",
        "bg-gradient-to-br from-indigo-500 to-indigo-600",
        "bg-gradient-to-br from-cyan-500 to-cyan-600",
        "bg-gradient-to-br from-teal-500 to-teal-600",
        "bg-gradient-to-br from-emerald-500 to-emerald-600",
        "bg-gradient-to-br from-orange-500 to-orange-600",
        "bg-gradient-to-br from-red-500 to-red-600",
        "bg-gradient-to-br from-slate-500 to-slate-600"
      ];
      const charCode = initials.charCodeAt(0) + (initials.charCodeAt(1) || 0);
      return colors[charCode % colors.length];
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white rounded-2xl shadow-xl shadow-slate-200/80 border border-slate-200 overflow-hidden" }, _attrs))} data-v-e41db9ce><div class="p-6 flex items-center justify-between border-b border-slate-200 bg-slate-50/50" data-v-e41db9ce><div class="flex items-center gap-6" data-v-e41db9ce><div data-v-e41db9ce><p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1" data-v-e41db9ce> Pr\xEAt pour le transfert ? </p><div class="flex items-center gap-4" data-v-e41db9ce><span class="text-2xl font-bold text-slate-900" data-v-e41db9ce>${ssrInterpolate(unref(store).selectedAffectations.length)} Courrier${ssrInterpolate(unref(store).selectedAffectations.length !== 1 ? "s" : "")}</span><span class="text-2xl font-bold text-slate-400" data-v-e41db9ce>\u2022</span><span class="text-2xl font-bold text-slate-900" data-v-e41db9ce>${ssrInterpolate(unref(store).selectedDestinataires.length)} Destinataire${ssrInterpolate(unref(store).selectedDestinataires.length !== 1 ? "s" : "")}</span></div></div></div><div class="flex items-center gap-3" data-v-e41db9ce><button${ssrIncludeBooleanAttr(!unref(store).hasSelections) ? " disabled" : ""} class="px-6 py-3 rounded-xl font-semibold text-slate-700 bg-white border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all" data-v-e41db9ce> Annuler </button><button${ssrIncludeBooleanAttr(!unref(store).canSend || __props.loading) ? " disabled" : ""} class="group px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 flex items-center gap-2" data-v-e41db9ce>${ssrInterpolate(__props.loading ? "Envoi en cours..." : "Transf\xE9rer")} `);
      if (!__props.loading) {
        _push(ssrRenderComponent(_component_Icon, {
          name: "heroicons:paper-airplane",
          class: "w-5 h-5 transition-transform group-hover:translate-x-1"
        }, null, _parent));
      } else {
        _push(`<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" data-v-e41db9ce></div>`);
      }
      _push(`</button></div></div>`);
      if (unref(store).hasSelections) {
        _push(`<div class="p-6" data-v-e41db9ce><div class="grid grid-cols-1 lg:grid-cols-2 gap-6" data-v-e41db9ce><div data-v-e41db9ce><h4 class="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2" data-v-e41db9ce>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "heroicons:document-text",
          class: "w-4 h-4 text-blue-600"
        }, null, _parent));
        _push(` Courriers s\xE9lectionn\xE9s </h4><div class="flex flex-wrap items-center gap-2" data-v-e41db9ce><!--[-->`);
        ssrRenderList(selectedAffectationsWithData.value, (affectation) => {
          _push(`<div class="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-200" data-v-e41db9ce>`);
          _push(ssrRenderComponent(_component_Icon, {
            name: "heroicons:document-text",
            class: "w-4 h-4 text-blue-600"
          }, null, _parent));
          _push(`<span class="text-sm font-medium text-blue-700 whitespace-nowrap" data-v-e41db9ce>${ssrInterpolate(affectation.reference)}</span></div>`);
        });
        _push(`<!--]--></div>`);
        if (unref(store).selectedAffectations.length === 0) {
          _push(`<div class="text-sm text-slate-400 italic" data-v-e41db9ce> Aucun courrier s\xE9lectionn\xE9 </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div data-v-e41db9ce><h4 class="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2" data-v-e41db9ce>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "heroicons:user-group",
          class: "w-4 h-4 text-emerald-600"
        }, null, _parent));
        _push(` Destinataires s\xE9lectionn\xE9s </h4><div class="flex items-center gap-3" data-v-e41db9ce><div class="flex -space-x-3" data-v-e41db9ce><!--[-->`);
        ssrRenderList(selectedDestinatairesWithData.value.slice(0, 5), (recipient) => {
          _push(`<div class="${ssrRenderClass([getAvatarColor(recipient.initials), "w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-sm border-2 border-white transition-transform hover:scale-110 hover:z-10 relative"])}"${ssrRenderAttr("title", recipient.name)} data-v-e41db9ce>${ssrInterpolate(recipient.initials)}</div>`);
        });
        _push(`<!--]-->`);
        if (unref(store).selectedDestinataires.length > 5) {
          _push(`<div class="z-20 w-10 h-10 rounded-full flex items-center justify-center font-bold bg-slate-200 text-slate-600 text-xs shadow-sm border-2 border-white" data-v-e41db9ce> +${ssrInterpolate(unref(store).selectedDestinataires.length - 5)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="flex-1 min-w-0" data-v-e41db9ce><p class="text-sm text-slate-600 truncate" data-v-e41db9ce>${ssrInterpolate(selectedDestinatairesWithData.value.map((r) => r.name).join(", "))}</p></div></div>`);
        if (unref(store).selectedDestinataires.length === 0) {
          _push(`<div class="text-sm text-slate-400 italic" data-v-e41db9ce> Aucun destinataire s\xE9lectionn\xE9 </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
      } else {
        _push(`<div class="p-6 text-center" data-v-e41db9ce>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "heroicons:arrow-up",
          class: "w-8 h-8 text-slate-300 mx-auto mb-2"
        }, null, _parent));
        _push(`<p class="text-slate-400 text-sm" data-v-e41db9ce> S\xE9lectionnez des courriers et des destinataires pour commencer le transfert </p></div>`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/transferts/TransfertsSummaryBar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const TransfertsSummaryBar = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e41db9ce"]]);

export { TransfertsDestinatairesSelectionPanel as T, TransfertsSummaryBar as a };
//# sourceMappingURL=TransfertsSummaryBar-BHYjtprs.mjs.map
