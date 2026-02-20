import { mergeProps, unref, ref, computed, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import { u as useTransfertsStore } from './transferts-8xZaXUA2.mjs';
import { n as navigateTo, c as useRuntimeConfig } from './server.mjs';
import { u as useApi } from './useApi-D6gLxNl8.mjs';
import { _ as _sfc_main$3 } from './PageHeader-OIWZwZf2.mjs';
import { T as TransfertsDestinatairesSelectionPanel, a as TransfertsSummaryBar } from './TransfertsSummaryBar-BHYjtprs.mjs';
import __nuxt_component_0 from './index-DJmPz9HS.mjs';
import 'pinia';
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
import 'vue-router';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './nuxt-link-aS4hYwbM.mjs';

const useCourriersArrives = () => {
  const courriers = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const config = useRuntimeConfig();
  const getToken = () => {
    return localStorage.getItem("token") || localStorage.getItem("auth_token");
  };
  const transformCourrierData = (data) => {
    return data.map((item) => {
      var _a, _b, _c;
      return {
        id: item.id,
        // ✅ ID du courrier arrivé
        reference: ((_a = item.document) == null ? void 0 : _a.reference) || "N/A",
        objet: ((_b = item.document) == null ? void 0 : _b.objet) || "N/A",
        priority: item.priority || "standard",
        type_arrivee: item.type_arrivee,
        confidentiel: item.confidentiel,
        structure: item.structure,
        date_sgm: item.date_sgm ? new Date(item.date_sgm).toLocaleDateString("fr-FR") : "N/A",
        // ✅ Pour la compatibilité avec le store de transferts
        nb_courriers: 1,
        instructions: ((_c = item.document) == null ? void 0 : _c.in) || "",
        // Utiliser l'objet comme instruction par défaut
        emetteur: item.structure || "Externe",
        statut: "en_cours",
        priority_badge: getPriorityBadge(item.priority),
        statut_badge: { label: "En cours", color: "blue" },
        // Garder les données complètes pour les actions
        _raw: item
      };
    });
  };
  const getPriorityBadge = (priority) => {
    const badges = {
      "urgent": { label: "Urgent", color: "red" },
      "important": { label: "Important", color: "orange" },
      "standard": { label: "Standard", color: "blue" }
    };
    return badges[priority == null ? void 0 : priority.toLowerCase()] || { label: priority || "Standard", color: "gray" };
  };
  const fetchCourriers = async () => {
    loading.value = true;
    error.value = null;
    try {
      const token = getToken();
      if (!token) {
        throw new Error("Token d'authentification non trouv\xE9");
      }
      const response = await fetch(`${config.public.apiBase}/courriers-arrives`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const result = await response.json();
      if (result.success && result.data) {
        courriers.value = transformCourrierData(result.data);
        console.log(`\u2705 ${courriers.value.length} courriers charg\xE9s pour transfert`);
        if (courriers.value.length > 0) {
          console.log("\u{1F4CB} Exemple de courrier transform\xE9:", {
            id: courriers.value[0].id,
            reference: courriers.value[0].reference,
            objet: courriers.value[0].objet
          });
        }
      } else {
        throw new Error("Format de r\xE9ponse invalide");
      }
    } catch (err) {
      error.value = err.message;
      console.error("\u274C Erreur lors du chargement des courriers:", err);
    } finally {
      loading.value = false;
    }
  };
  const tableData = computed(() => courriers.value);
  return {
    courriers,
    loading,
    error,
    fetchCourriers,
    tableData
  };
};
const _sfc_main$2 = {
  __name: "TransfertsRecipientCard",
  __ssrInlineRender: true,
  props: {
    recipient: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  emits: ["toggle"],
  setup(__props) {
    const getAvatarColor = (initials) => {
      const colors = {
        "JD": "bg-gradient-to-br from-blue-500 to-blue-600",
        "BS": "bg-gradient-to-br from-slate-500 to-slate-600",
        "RK": "bg-gradient-to-br from-cyan-500 to-blue-600",
        "AL": "bg-gradient-to-br from-slate-400 to-slate-500"
      };
      return colors[initials] || "bg-gradient-to-br from-emerald-500 to-blue-600";
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["relative group flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer", __props.selected ? "border-emerald-500 bg-emerald-50/50 shadow-md shadow-emerald-100" : "border-slate-200 bg-white hover:border-emerald-300 hover:shadow-sm"]
      }, _attrs))}><div class="flex items-center gap-4"><div class="${ssrRenderClass([getAvatarColor(__props.recipient.initials), "w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-md transition-transform group-hover:scale-105"])}">${ssrInterpolate(__props.recipient.initials)}</div><div><h4 class="font-semibold text-slate-900">${ssrInterpolate(__props.recipient.name)}</h4><p class="text-sm text-slate-500">${ssrInterpolate(__props.recipient.email)}</p></div></div><div class="${ssrRenderClass([__props.selected ? "bg-emerald-500 scale-100" : "bg-slate-200 scale-90 opacity-40 group-hover:opacity-70", "w-8 h-8 rounded-full flex items-center justify-center transition-all"])}">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "heroicons:check",
        class: ["w-5 h-5 transition-all", __props.selected ? "text-white" : "text-slate-400"]
      }, null, _parent));
      _push(`</div>`);
      if (__props.selected) {
        _push(`<div class="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/5 to-blue-500/5 pointer-events-none"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/transferts/TransfertsRecipientCard.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "TransfertsRecipientSelectionPanel",
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
      if (!searchQuery.value) return store.recipients;
      const query = searchQuery.value.toLowerCase();
      return store.recipients.filter(
        (r) => r.name.toLowerCase().includes(query) || r.email.toLowerCase().includes(query)
      );
    });
    const toggleRecipient = (id) => {
      store.toggleRecipient(id);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0;
      const _component_TransfertsRecipientCard = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 overflow-hidden transition-all hover:shadow-xl hover:shadow-slate-200/80" }, _attrs))}><div class="px-6 py-5 border-b border-slate-100"><h3 class="text-xl font-bold text-slate-900 mb-4">2. Destinataires</h3><div class="relative">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "heroicons:user-group",
        class: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
      }, null, _parent));
      _push(`<input${ssrRenderAttr("value", unref(searchQuery))} type="text" placeholder="Search by name or email..." class="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-slate-700 placeholder:text-slate-400"></div></div><div class="overflow-auto max-h-[400px] p-4 space-y-3"><!--[-->`);
      ssrRenderList(unref(filteredRecipients), (recipient) => {
        _push(ssrRenderComponent(_component_TransfertsRecipientCard, {
          key: recipient.id,
          recipient,
          selected: unref(store).selectedRecipients.includes(recipient.id),
          onToggle: ($event) => toggleRecipient(recipient.id)
        }, null, _parent));
      });
      _push(`<!--]-->`);
      if (__props.loading) {
        _push(`<div class="py-12 text-center"><div class="flex flex-col items-center justify-center gap-3">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "svg-spinners:ring-resize",
          class: "w-8 h-8 text-emerald-600"
        }, null, _parent));
        _push(`<p class="text-slate-500">Loading recipients...</p></div></div>`);
      } else if (unref(filteredRecipients).length === 0) {
        _push(`<div class="py-12 text-center"><div class="flex flex-col items-center justify-center gap-3">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "heroicons:user-group",
          class: "w-12 h-12 text-slate-300"
        }, null, _parent));
        _push(`<p class="text-slate-500">Aucun destinataire trouv\xE9</p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/transferts/TransfertsRecipientSelectionPanel.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "form-transfert-api",
  __ssrInlineRender: true,
  setup(__props) {
    const store = useTransfertsStore();
    const { loading: recipientLoading } = useCourriersArrives("api/courriers-arrives", {
      transform: transformCourriers
    });
    const { loading: fileLoading } = useApi("/courriers-arrives", {
      transform: transformCourriers,
      immediate: true
    });
    const handleSaveDraft = () => {
      console.log("Saving draft...", {
        files: store.selectedFiles,
        recipients: store.selectedRecipients
      });
      store.clearSelections();
      navigateTo("/transferts");
    };
    const handleSendFiles = () => {
      console.log("Sending files...", {
        files: store.selectedFiles,
        recipients: store.selectedRecipients
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/40" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$3, {
        title: "Tranferts",
        description: "Gestion des transferts"
      }, null, _parent));
      _push(`<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">`);
      _push(ssrRenderComponent(TransfertsDestinatairesSelectionPanel, { loading: unref(fileLoading) }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { loading: unref(recipientLoading) }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(TransfertsSummaryBar, {
        onSaveDraft: handleSaveDraft,
        onSendFiles: handleSendFiles
      }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/affectations-transferts/form-transfert-api.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=form-transfert-api-KgUd_0Ce.mjs.map
