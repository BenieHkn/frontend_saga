import __nuxt_component_3 from './Modal-EvFvX6Ng.mjs';
import { _ as _export_sfc, b as useRuntimeConfig, c as __nuxt_component_0$2, d as __nuxt_component_1, n as navigateTo } from './server.mjs';
import __nuxt_component_1$1 from './Badge-DIEXPf_r.mjs';
import { ref, computed, mergeProps, withCtx, createTextVNode, createBlock, createCommentVNode, openBlock, createVNode, toDisplayString, unref, Fragment, renderList, withDirectives, vModelText, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderAttr, ssrRenderList } from 'vue/server-renderer';
import { _ as _sfc_main$1 } from './DataTable-Cb4WL8Ep.mjs';
import { _ as __nuxt_component_2 } from './DocumentRpreview-jsQ82SAI.mjs';
import { u as useAffectationsStore } from './affectations-Bp-zzr69.mjs';
import { u as useCourriersStore } from './courriers-89bZxt-C.mjs';
import { u as useAuth } from './useAuth-D9Skuklz.mjs';
import Swal from 'sweetalert2';
import './transition-CRUjHQk-.mjs';
import './portal-Bh2KnJSN.mjs';
import './focus-management-CclPs0xY.mjs';
import './keyboard-BCt0ZeLv.mjs';
import './use-outside-click-BqFFeIfQ.mjs';
import './hidden-e5tlhUcy.mjs';
import './active-element-history-Cer4cSOw.mjs';
import './micro-task-B6uncIso.mjs';
import './open-closed-DaveoKA1.mjs';
import './description-BSAkQQqZ.mjs';
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
  __name: "CourriersArrivesListe",
  __ssrInlineRender: true,
  props: {
    entiteId: { type: Number, default: null }
  },
  setup(__props) {
    const props = __props;
    const store = useAffectationsStore();
    const courriersStore = useCourriersStore();
    const config = useRuntimeConfig();
    const { isAdmin } = useAuth();
    const filterFields = [
      { id: "source", label: "Source" },
      { id: "structure", label: "Structure / Usager" },
      { id: "objet", label: "Objet" },
      { id: "type_arrivee", label: "Type d'arriv\xE9e" }
    ];
    const courriers = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const detailsOpen = ref(false);
    const selectedCourrier = ref(null);
    const showArriveeDoc = ref(false);
    const showReponseDoc = ref(false);
    const loadingReponse = ref(false);
    const reponseData = ref(null);
    const arriveeUrl = computed(() => {
      var _a, _b, _c, _d;
      const raw = (_b = (_a = selectedCourrier.value) == null ? void 0 : _a.document) == null ? void 0 : _b.url;
      const url = (_c = raw == null ? void 0 : raw.trim) == null ? void 0 : _c.call(raw);
      if (!url || url === "Inconnu" || url === "") return null;
      if (url.startsWith("http")) return url;
      const base = (_d = config.public.baseUrl) == null ? void 0 : _d.replace(/\/$/, "");
      const path = url.startsWith("/") ? url : `/${url}`;
      return `${base}${path}`;
    });
    const columns = [
      { key: "source", label: "Source", visible: true, type: "badge", inputHidden: true },
      { key: "reference", label: "R\xE9f\xE9rence", visible: true, inputWidth: "80px", inputPlaceholder: "R\xE9f..." },
      { key: "numeroEnregistrement", label: "N\xB0 d'enreg.", visible: false, inputHidden: true },
      { key: "objet", label: "Objet", visible: true },
      { key: "date_enregistrement", label: "Date d'enregistrement", visible: false },
      { key: "date_courrier", label: "Date du Courrier", visible: false },
      { key: "url", label: "Document", visible: false, type: "document" },
      { key: "type_arrivee", label: "Type d'arriv\xE9e", visible: false },
      { key: "priority", label: "Priorit\xE9", visible: true, type: "badge" },
      { key: "structure", label: "Structure / Usager", visible: true }
    ];
    const formatDate = (date) => {
      if (!date) return "";
      return new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
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
          _complete: courrier
        };
      });
    };
    const refresh = async () => {
      loading.value = true;
      error.value = null;
      try {
        const authToken = localStorage.getItem("auth_token") || "";
        let endpoint = `${config.public.apiBase}/courriers-arrives`;
        if (props.entiteId) {
          const selectedEntite = JSON.parse(localStorage.getItem("selected_entite") || "null");
          if (selectedEntite == null ? void 0 : selectedEntite.code) {
            endpoint += `?service_enreg=${selectedEntite.code}`;
          }
        }
        console.log(`[CourriersArrivesListe] GET ${endpoint}`);
        const response = await $fetch(endpoint, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        courriers.value = transformCourriers(response);
      } catch (err) {
        console.error("\u274C Erreur chargement courriers arriv\xE9s:", err);
        error.value = err.message || "Erreur lors du chargement";
      } finally {
        loading.value = false;
      }
    };
    const handleView = async (item) => {
      var _a, _b;
      const courrier = item._complete || item;
      selectedCourrier.value = courrier;
      showArriveeDoc.value = false;
      showReponseDoc.value = false;
      reponseData.value = null;
      detailsOpen.value = true;
      const reponses = ((_a = courrier.document) == null ? void 0 : _a.reponses) || [];
      if (reponses.length) {
        const courierDepartId = (_b = reponses[0]) == null ? void 0 : _b.reponse_id;
        if (courierDepartId) await loadReponseData(courierDepartId);
      }
    };
    const closeDetails = () => {
      detailsOpen.value = false;
      selectedCourrier.value = null;
      reponseData.value = null;
      showArriveeDoc.value = false;
      showReponseDoc.value = false;
    };
    const loadReponseData = async (documentId) => {
      var _a, _b, _c;
      if (!documentId) return;
      loadingReponse.value = true;
      try {
        const authToken = localStorage.getItem("auth_token") || "";
        const allDeparts = await $fetch(`${config.public.apiBase}/courriers-departs`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        const list = Array.isArray(allDeparts == null ? void 0 : allDeparts.data) ? allDeparts.data : [];
        const doc = list.find((cd) => cd.document_id === documentId) || null;
        if (!doc) {
          reponseData.value = null;
          return;
        }
        const buildUrl = (raw) => {
          var _a2;
          if (!raw || raw === "Inconnu") return null;
          if (raw.startsWith("http")) return raw;
          const base = (_a2 = config.public.baseUrl) == null ? void 0 : _a2.replace(/\/$/, "");
          const path = raw.startsWith("/") ? raw : `/${raw}`;
          return `${base}${path}`;
        };
        reponseData.value = {
          reference: ((_a = doc == null ? void 0 : doc.document) == null ? void 0 : _a.reference) || "Sans r\xE9f\xE9rence",
          objet: ((_b = doc == null ? void 0 : doc.document) == null ? void 0 : _b.objet) || "Non sp\xE9cifi\xE9",
          destinataire: (doc == null ? void 0 : doc.destinataire) || "\u2014",
          date_depart: (doc == null ? void 0 : doc.date_depart) || null,
          type_depart: (doc == null ? void 0 : doc.type_depart) || null,
          service_emis: (doc == null ? void 0 : doc.service_emis) || null,
          url: buildUrl((((_c = doc == null ? void 0 : doc.document) == null ? void 0 : _c.url) || "").trim())
        };
      } catch (e) {
        console.error("\u274C Erreur chargement r\xE9ponse:", e);
        reponseData.value = null;
      } finally {
        loadingReponse.value = false;
      }
    };
    const onOpenDocument = (url) => {
      if (url) (void 0).open(url, "_blank", "noopener,noreferrer");
    };
    const onSelectionChange = (ids) => console.log("S\xE9lection:", ids);
    const handleQuickAssign = (courrierId) => {
      store.selectCourrierFromQuickAction(courrierId);
      navigateTo("/affectations/create");
    };
    const handleReply = (item) => {
      var _a, _b;
      const courrier = item._complete || item;
      if ((_b = (_a = courrier.document) == null ? void 0 : _a.reponses) == null ? void 0 : _b.length) {
        Swal.fire({ title: "D\xE9j\xE0 r\xE9pondu", text: "Ce courrier a d\xE9j\xE0 re\xE7u une r\xE9ponse.", icon: "info", confirmButtonColor: "#7c3aed" });
        return;
      }
      courriersStore.setCourrierToReply(courrier);
      navigateTo("/courriers/form_courrier_depart");
    };
    const onEdit = (item) => navigateTo(`/courriers/edit/${item.id}`);
    const onDelete = async (item) => {
      var _a, _b, _c;
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
          headers: { Authorization: `Bearer ${authToken}` }
        });
        await Swal.fire({ title: "Supprim\xE9 !", text: "Le courrier a \xE9t\xE9 supprim\xE9 avec succ\xE8s", icon: "success", timer: 2e3, showConfirmButton: false });
        refresh();
      } catch (err) {
        const message = ((_a = err.data) == null ? void 0 : _a.message) || err.message || "Impossible de supprimer le courrier";
        const affectationsCount = (_c = (_b = err.data) == null ? void 0 : _b.data) == null ? void 0 : _c.affectations_count;
        await Swal.fire({
          title: "Suppression impossible",
          html: affectationsCount ? `<div class="text-left">
            <p class="mb-3">${message}</p>
            <div class="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p class="text-sm text-orange-800"><strong>${affectationsCount}</strong> affectation(s) associ\xE9e(s).</p>
              <p class="text-xs text-orange-600 mt-1">Supprimez d'abord les affectations.</p>
            </div>
           </div>` : `<p>${message}</p>`,
          icon: "error",
          confirmButtonColor: "#7c3aed",
          confirmButtonText: "Compris"
        });
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = __nuxt_component_3;
      const _component_Icon = __nuxt_component_0$2;
      const _component_UButton = __nuxt_component_1;
      const _component_UBadge = __nuxt_component_1$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-100 p-6 font-sans" }, _attrs))} data-v-4e129d6f>`);
      _push(ssrRenderComponent(_component_UModal, {
        modelValue: detailsOpen.value,
        "onUpdate:modelValue": ($event) => detailsOpen.value = $event,
        ui: { width: "sm:max-w-5xl" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B;
          if (_push2) {
            if (selectedCourrier.value) {
              _push2(`<div class="flex flex-col max-h-[90vh] bg-white rounded-xl overflow-hidden" data-v-4e129d6f${_scopeId}><div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0" data-v-4e129d6f${_scopeId}><div class="flex items-center gap-3" data-v-4e129d6f${_scopeId}><div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center" data-v-4e129d6f${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                name: "i-heroicons-envelope-open",
                class: "w-4 h-4 text-indigo-600"
              }, null, _parent2, _scopeId));
              _push2(`</div><div data-v-4e129d6f${_scopeId}><h2 class="text-base font-bold text-slate-900" data-v-4e129d6f${_scopeId}>D\xE9tails du courrier arriv\xE9</h2><p class="text-xs text-slate-500" data-v-4e129d6f${_scopeId}>N\xB0 ${ssrInterpolate((_a = selectedCourrier.value.document) == null ? void 0 : _a.numero_enreg)}</p></div></div><button class="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700" data-v-4e129d6f${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                name: "i-heroicons-x-mark",
                class: "w-4 h-4"
              }, null, _parent2, _scopeId));
              _push2(`</button></div><div class="overflow-y-auto flex-1 p-5 space-y-5" data-v-4e129d6f${_scopeId}><section class="bg-white rounded-xl border border-slate-200 overflow-hidden" data-v-4e129d6f${_scopeId}><div class="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-100" data-v-4e129d6f${_scopeId}><div class="flex items-center gap-2" data-v-4e129d6f${_scopeId}><div class="w-5 h-5 rounded bg-indigo-100 flex items-center justify-center" data-v-4e129d6f${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                name: "i-heroicons-inbox-arrow-down",
                class: "w-3 h-3 text-indigo-600"
              }, null, _parent2, _scopeId));
              _push2(`</div><span class="text-[11px] font-bold text-slate-600 uppercase tracking-widest" data-v-4e129d6f${_scopeId}>Courrier arriv\xE9</span></div><div class="flex items-center gap-1.5" data-v-4e129d6f${_scopeId}><span class="${ssrRenderClass([{
                "bg-red-50 text-red-700 border-red-200": ((_b = selectedCourrier.value.priority) == null ? void 0 : _b.toLowerCase()) === "urgent",
                "bg-amber-50 text-amber-700 border-amber-200": ((_c = selectedCourrier.value.priority) == null ? void 0 : _c.toLowerCase()) === "important",
                "bg-sky-50 text-sky-700 border-sky-200": !selectedCourrier.value.priority || ((_d = selectedCourrier.value.priority) == null ? void 0 : _d.toLowerCase()) === "standard"
              }, "inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full border uppercase"])}" data-v-4e129d6f${_scopeId}>${ssrInterpolate(selectedCourrier.value.priority || "Standard")}</span>`);
              if ((_f = (_e = selectedCourrier.value.document) == null ? void 0 : _e.reponses) == null ? void 0 : _f.length) {
                _push2(`<span class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-green-50 text-green-700 border border-green-200" data-v-4e129d6f${_scopeId}>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "i-heroicons-check-circle",
                  class: "w-3 h-3"
                }, null, _parent2, _scopeId));
                _push2(` R\xE9pondu </span>`);
              } else {
                _push2(`<span class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200" data-v-4e129d6f${_scopeId}>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "i-heroicons-clock",
                  class: "w-3 h-3"
                }, null, _parent2, _scopeId));
                _push2(` En attente </span>`);
              }
              _push2(`</div></div><div class="p-4 space-y-3" data-v-4e129d6f${_scopeId}><div class="grid grid-cols-1 gap-2" data-v-4e129d6f${_scopeId}><div class="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100" data-v-4e129d6f${_scopeId}><div class="w-1 h-full min-h-[2rem] rounded-full bg-indigo-400 shrink-0 self-stretch" data-v-4e129d6f${_scopeId}></div><div data-v-4e129d6f${_scopeId}><p class="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-0.5" data-v-4e129d6f${_scopeId}>R\xE9f\xE9rence</p><p class="text-sm font-bold text-indigo-900" data-v-4e129d6f${_scopeId}>${ssrInterpolate(((_g = selectedCourrier.value.document) == null ? void 0 : _g.reference) || "Sans r\xE9f\xE9rence")}</p></div></div><div class="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100" data-v-4e129d6f${_scopeId}><div class="w-1 h-full min-h-[2rem] rounded-full bg-amber-400 shrink-0 self-stretch" data-v-4e129d6f${_scopeId}></div><div data-v-4e129d6f${_scopeId}><p class="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-0.5" data-v-4e129d6f${_scopeId}>Objet</p><p class="text-sm text-gray-800 leading-relaxed" data-v-4e129d6f${_scopeId}>${ssrInterpolate(((_h = selectedCourrier.value.document) == null ? void 0 : _h.objet) || "Non sp\xE9cifi\xE9")}</p></div></div></div><div class="grid grid-cols-2 md:grid-cols-3 gap-2" data-v-4e129d6f${_scopeId}><div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100" data-v-4e129d6f${_scopeId}><p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5" data-v-4e129d6f${_scopeId}>Source</p><p class="text-xs font-semibold text-slate-800" data-v-4e129d6f${_scopeId}>${ssrInterpolate(selectedCourrier.value.service_enreg || "N/A")}</p></div><div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100" data-v-4e129d6f${_scopeId}><p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5" data-v-4e129d6f${_scopeId}>Structure / Usager</p><p class="text-xs text-slate-800" data-v-4e129d6f${_scopeId}>${ssrInterpolate(selectedCourrier.value.structure || selectedCourrier.value.autre_structure || "Non sp\xE9cifi\xE9")}</p></div><div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100" data-v-4e129d6f${_scopeId}><p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5" data-v-4e129d6f${_scopeId}>Type d&#39;arriv\xE9e</p><p class="text-xs text-slate-800" data-v-4e129d6f${_scopeId}>${ssrInterpolate(selectedCourrier.value.type_arrivee || "Non sp\xE9cifi\xE9")}</p></div><div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100" data-v-4e129d6f${_scopeId}><p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5" data-v-4e129d6f${_scopeId}>N\xB0 enregistrement</p><p class="text-xs font-semibold text-slate-800" data-v-4e129d6f${_scopeId}>${ssrInterpolate(((_i = selectedCourrier.value.document) == null ? void 0 : _i.numero_enreg) || "\u2014")}</p></div><div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100" data-v-4e129d6f${_scopeId}><p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5" data-v-4e129d6f${_scopeId}>Date d&#39;enregistrement</p><p class="text-xs text-slate-800" data-v-4e129d6f${_scopeId}>${ssrInterpolate(formatDate((_j = selectedCourrier.value.document) == null ? void 0 : _j.date_enreg) || "\u2014")}</p></div>`);
              if ((_k = selectedCourrier.value.document) == null ? void 0 : _k.date_courrier) {
                _push2(`<div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100" data-v-4e129d6f${_scopeId}><p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5" data-v-4e129d6f${_scopeId}>Date du courrier</p><p class="text-xs text-slate-800" data-v-4e129d6f${_scopeId}>${ssrInterpolate(formatDate((_l = selectedCourrier.value.document) == null ? void 0 : _l.date_courrier))}</p></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="pt-1" data-v-4e129d6f${_scopeId}>`);
              if (arriveeUrl.value) {
                _push2(`<div data-v-4e129d6f${_scopeId}>`);
                if (!showArriveeDoc.value) {
                  _push2(`<button class="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-all" data-v-4e129d6f${_scopeId}>`);
                  _push2(ssrRenderComponent(_component_Icon, {
                    name: "i-heroicons-document-arrow-down",
                    class: "w-4 h-4"
                  }, null, _parent2, _scopeId));
                  _push2(` Charger le document arriv\xE9 </button>`);
                } else {
                  _push2(`<div class="mt-2 rounded-lg overflow-hidden border border-slate-200" data-v-4e129d6f${_scopeId}>`);
                  _push2(ssrRenderComponent(__nuxt_component_2, {
                    "file-preview-url": arriveeUrl.value,
                    height: "400px"
                  }, null, _parent2, _scopeId));
                  _push2(`</div>`);
                }
                _push2(`</div>`);
              } else {
                _push2(`<div class="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-400 bg-slate-50 border border-slate-200 rounded-lg cursor-not-allowed" data-v-4e129d6f${_scopeId}>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "i-heroicons-document-text",
                  class: "w-4 h-4"
                }, null, _parent2, _scopeId));
                _push2(` Aucun document disponible </div>`);
              }
              _push2(`</div></div></section>`);
              if ((_n = (_m = selectedCourrier.value.document) == null ? void 0 : _m.reponses) == null ? void 0 : _n.length) {
                _push2(`<section class="bg-white rounded-xl border border-emerald-200 overflow-hidden" data-v-4e129d6f${_scopeId}><div class="flex items-center justify-between px-4 py-2.5 bg-emerald-50 border-b border-emerald-100" data-v-4e129d6f${_scopeId}><div class="flex items-center gap-2" data-v-4e129d6f${_scopeId}><div class="w-5 h-5 rounded bg-emerald-100 flex items-center justify-center" data-v-4e129d6f${_scopeId}>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "i-heroicons-arrow-uturn-right",
                  class: "w-3 h-3 text-emerald-600"
                }, null, _parent2, _scopeId));
                _push2(`</div><span class="text-[11px] font-bold text-emerald-700 uppercase tracking-widest" data-v-4e129d6f${_scopeId}>Courrier de r\xE9ponse</span></div>`);
                if (reponseData.value && !loadingReponse.value) {
                  _push2(`<span class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200" data-v-4e129d6f${_scopeId}>`);
                  _push2(ssrRenderComponent(_component_Icon, {
                    name: "i-heroicons-check-circle",
                    class: "w-3 h-3"
                  }, null, _parent2, _scopeId));
                  _push2(` Charg\xE9 </span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
                if (loadingReponse.value) {
                  _push2(`<div class="flex items-center justify-center gap-3 py-8 text-slate-400" data-v-4e129d6f${_scopeId}><div class="w-5 h-5 border-2 border-slate-200 border-t-emerald-500 rounded-full animate-spin" data-v-4e129d6f${_scopeId}></div><span class="text-xs font-medium" data-v-4e129d6f${_scopeId}>Chargement du courrier de r\xE9ponse...</span></div>`);
                } else if (reponseData.value) {
                  _push2(`<div class="p-4 space-y-3" data-v-4e129d6f${_scopeId}><div class="grid grid-cols-1 gap-2" data-v-4e129d6f${_scopeId}><div class="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100" data-v-4e129d6f${_scopeId}><div class="w-1 min-h-[2rem] rounded-full bg-emerald-400 shrink-0 self-stretch" data-v-4e129d6f${_scopeId}></div><div data-v-4e129d6f${_scopeId}><p class="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-0.5" data-v-4e129d6f${_scopeId}>R\xE9f\xE9rence</p><p class="text-sm font-bold text-emerald-900" data-v-4e129d6f${_scopeId}>${ssrInterpolate(reponseData.value.reference || "Sans r\xE9f\xE9rence")}</p></div></div><div class="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100" data-v-4e129d6f${_scopeId}><div class="w-1 min-h-[2rem] rounded-full bg-slate-300 shrink-0 self-stretch" data-v-4e129d6f${_scopeId}></div><div data-v-4e129d6f${_scopeId}><p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5" data-v-4e129d6f${_scopeId}>Objet</p><p class="text-sm text-slate-800 leading-relaxed" data-v-4e129d6f${_scopeId}>${ssrInterpolate(reponseData.value.objet || "Non sp\xE9cifi\xE9")}</p></div></div></div><div class="grid grid-cols-2 md:grid-cols-3 gap-2" data-v-4e129d6f${_scopeId}><div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100" data-v-4e129d6f${_scopeId}><p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5" data-v-4e129d6f${_scopeId}>Destinataire</p><p class="text-xs font-semibold text-slate-800" data-v-4e129d6f${_scopeId}>${ssrInterpolate(reponseData.value.destinataire || "\u2014")}</p></div><div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100" data-v-4e129d6f${_scopeId}><p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5" data-v-4e129d6f${_scopeId}>Date de d\xE9part</p><p class="text-xs text-slate-800" data-v-4e129d6f${_scopeId}>${ssrInterpolate(formatDate(reponseData.value.date_depart) || "\u2014")}</p></div>`);
                  if (reponseData.value.service_emis) {
                    _push2(`<div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100" data-v-4e129d6f${_scopeId}><p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5" data-v-4e129d6f${_scopeId}>Service \xE9metteur</p><p class="text-xs text-slate-800" data-v-4e129d6f${_scopeId}>${ssrInterpolate(reponseData.value.service_emis)}</p></div>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  if (reponseData.value.type_depart) {
                    _push2(`<div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100" data-v-4e129d6f${_scopeId}><p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5" data-v-4e129d6f${_scopeId}>Type de d\xE9part</p><p class="text-xs text-slate-800" data-v-4e129d6f${_scopeId}>${ssrInterpolate(reponseData.value.type_depart)}</p></div>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div><div class="pt-1" data-v-4e129d6f${_scopeId}>`);
                  if (reponseData.value.url) {
                    _push2(`<div data-v-4e129d6f${_scopeId}>`);
                    if (!showReponseDoc.value) {
                      _push2(`<button class="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-all" data-v-4e129d6f${_scopeId}>`);
                      _push2(ssrRenderComponent(_component_Icon, {
                        name: "i-heroicons-document-arrow-down",
                        class: "w-4 h-4"
                      }, null, _parent2, _scopeId));
                      _push2(` Charger le document de r\xE9ponse </button>`);
                    } else {
                      _push2(`<div class="mt-2 rounded-lg overflow-hidden border border-emerald-200" data-v-4e129d6f${_scopeId}>`);
                      _push2(ssrRenderComponent(__nuxt_component_2, {
                        "file-preview-url": reponseData.value.url,
                        height: "400px"
                      }, null, _parent2, _scopeId));
                      _push2(`</div>`);
                    }
                    _push2(`</div>`);
                  } else {
                    _push2(`<div class="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-400 bg-slate-50 border border-slate-200 rounded-lg cursor-not-allowed" data-v-4e129d6f${_scopeId}>`);
                    _push2(ssrRenderComponent(_component_Icon, {
                      name: "i-heroicons-document-text",
                      class: "w-4 h-4"
                    }, null, _parent2, _scopeId));
                    _push2(` Aucun document disponible pour la r\xE9ponse </div>`);
                  }
                  _push2(`</div></div>`);
                } else {
                  _push2(`<div class="flex items-center gap-2 m-4 p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600" data-v-4e129d6f${_scopeId}>`);
                  _push2(ssrRenderComponent(_component_Icon, {
                    name: "i-heroicons-exclamation-triangle",
                    class: "w-4 h-4 shrink-0"
                  }, null, _parent2, _scopeId));
                  _push2(` Impossible de charger les d\xE9tails du courrier de r\xE9ponse. </div>`);
                }
                _push2(`</section>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="px-6 py-4 border-t border-slate-100 shrink-0 flex justify-end" data-v-4e129d6f${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UButton, {
                color: "gray",
                variant: "outline",
                onClick: closeDetails
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Fermer`);
                  } else {
                    return [
                      createTextVNode("Fermer")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              selectedCourrier.value ? (openBlock(), createBlock("div", {
                key: 0,
                class: "flex flex-col max-h-[90vh] bg-white rounded-xl overflow-hidden"
              }, [
                createVNode("div", { class: "flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0" }, [
                  createVNode("div", { class: "flex items-center gap-3" }, [
                    createVNode("div", { class: "w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center" }, [
                      createVNode(_component_Icon, {
                        name: "i-heroicons-envelope-open",
                        class: "w-4 h-4 text-indigo-600"
                      })
                    ]),
                    createVNode("div", null, [
                      createVNode("h2", { class: "text-base font-bold text-slate-900" }, "D\xE9tails du courrier arriv\xE9"),
                      createVNode("p", { class: "text-xs text-slate-500" }, "N\xB0 " + toDisplayString((_o = selectedCourrier.value.document) == null ? void 0 : _o.numero_enreg), 1)
                    ])
                  ]),
                  createVNode("button", {
                    onClick: closeDetails,
                    class: "w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700"
                  }, [
                    createVNode(_component_Icon, {
                      name: "i-heroicons-x-mark",
                      class: "w-4 h-4"
                    })
                  ])
                ]),
                createVNode("div", { class: "overflow-y-auto flex-1 p-5 space-y-5" }, [
                  createVNode("section", { class: "bg-white rounded-xl border border-slate-200 overflow-hidden" }, [
                    createVNode("div", { class: "flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-100" }, [
                      createVNode("div", { class: "flex items-center gap-2" }, [
                        createVNode("div", { class: "w-5 h-5 rounded bg-indigo-100 flex items-center justify-center" }, [
                          createVNode(_component_Icon, {
                            name: "i-heroicons-inbox-arrow-down",
                            class: "w-3 h-3 text-indigo-600"
                          })
                        ]),
                        createVNode("span", { class: "text-[11px] font-bold text-slate-600 uppercase tracking-widest" }, "Courrier arriv\xE9")
                      ]),
                      createVNode("div", { class: "flex items-center gap-1.5" }, [
                        createVNode("span", {
                          class: ["inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full border uppercase", {
                            "bg-red-50 text-red-700 border-red-200": ((_p = selectedCourrier.value.priority) == null ? void 0 : _p.toLowerCase()) === "urgent",
                            "bg-amber-50 text-amber-700 border-amber-200": ((_q = selectedCourrier.value.priority) == null ? void 0 : _q.toLowerCase()) === "important",
                            "bg-sky-50 text-sky-700 border-sky-200": !selectedCourrier.value.priority || ((_r = selectedCourrier.value.priority) == null ? void 0 : _r.toLowerCase()) === "standard"
                          }]
                        }, toDisplayString(selectedCourrier.value.priority || "Standard"), 3),
                        ((_t = (_s = selectedCourrier.value.document) == null ? void 0 : _s.reponses) == null ? void 0 : _t.length) ? (openBlock(), createBlock("span", {
                          key: 0,
                          class: "inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-green-50 text-green-700 border border-green-200"
                        }, [
                          createVNode(_component_Icon, {
                            name: "i-heroicons-check-circle",
                            class: "w-3 h-3"
                          }),
                          createTextVNode(" R\xE9pondu ")
                        ])) : (openBlock(), createBlock("span", {
                          key: 1,
                          class: "inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200"
                        }, [
                          createVNode(_component_Icon, {
                            name: "i-heroicons-clock",
                            class: "w-3 h-3"
                          }),
                          createTextVNode(" En attente ")
                        ]))
                      ])
                    ]),
                    createVNode("div", { class: "p-4 space-y-3" }, [
                      createVNode("div", { class: "grid grid-cols-1 gap-2" }, [
                        createVNode("div", { class: "flex items-start gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100" }, [
                          createVNode("div", { class: "w-1 h-full min-h-[2rem] rounded-full bg-indigo-400 shrink-0 self-stretch" }),
                          createVNode("div", null, [
                            createVNode("p", { class: "text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-0.5" }, "R\xE9f\xE9rence"),
                            createVNode("p", { class: "text-sm font-bold text-indigo-900" }, toDisplayString(((_u = selectedCourrier.value.document) == null ? void 0 : _u.reference) || "Sans r\xE9f\xE9rence"), 1)
                          ])
                        ]),
                        createVNode("div", { class: "flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100" }, [
                          createVNode("div", { class: "w-1 h-full min-h-[2rem] rounded-full bg-amber-400 shrink-0 self-stretch" }),
                          createVNode("div", null, [
                            createVNode("p", { class: "text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-0.5" }, "Objet"),
                            createVNode("p", { class: "text-sm text-gray-800 leading-relaxed" }, toDisplayString(((_v = selectedCourrier.value.document) == null ? void 0 : _v.objet) || "Non sp\xE9cifi\xE9"), 1)
                          ])
                        ])
                      ]),
                      createVNode("div", { class: "grid grid-cols-2 md:grid-cols-3 gap-2" }, [
                        createVNode("div", { class: "p-2.5 bg-slate-50 rounded-lg border border-slate-100" }, [
                          createVNode("p", { class: "text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5" }, "Source"),
                          createVNode("p", { class: "text-xs font-semibold text-slate-800" }, toDisplayString(selectedCourrier.value.service_enreg || "N/A"), 1)
                        ]),
                        createVNode("div", { class: "p-2.5 bg-slate-50 rounded-lg border border-slate-100" }, [
                          createVNode("p", { class: "text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5" }, "Structure / Usager"),
                          createVNode("p", { class: "text-xs text-slate-800" }, toDisplayString(selectedCourrier.value.structure || selectedCourrier.value.autre_structure || "Non sp\xE9cifi\xE9"), 1)
                        ]),
                        createVNode("div", { class: "p-2.5 bg-slate-50 rounded-lg border border-slate-100" }, [
                          createVNode("p", { class: "text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5" }, "Type d'arriv\xE9e"),
                          createVNode("p", { class: "text-xs text-slate-800" }, toDisplayString(selectedCourrier.value.type_arrivee || "Non sp\xE9cifi\xE9"), 1)
                        ]),
                        createVNode("div", { class: "p-2.5 bg-slate-50 rounded-lg border border-slate-100" }, [
                          createVNode("p", { class: "text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5" }, "N\xB0 enregistrement"),
                          createVNode("p", { class: "text-xs font-semibold text-slate-800" }, toDisplayString(((_w = selectedCourrier.value.document) == null ? void 0 : _w.numero_enreg) || "\u2014"), 1)
                        ]),
                        createVNode("div", { class: "p-2.5 bg-slate-50 rounded-lg border border-slate-100" }, [
                          createVNode("p", { class: "text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5" }, "Date d'enregistrement"),
                          createVNode("p", { class: "text-xs text-slate-800" }, toDisplayString(formatDate((_x = selectedCourrier.value.document) == null ? void 0 : _x.date_enreg) || "\u2014"), 1)
                        ]),
                        ((_y = selectedCourrier.value.document) == null ? void 0 : _y.date_courrier) ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "p-2.5 bg-slate-50 rounded-lg border border-slate-100"
                        }, [
                          createVNode("p", { class: "text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5" }, "Date du courrier"),
                          createVNode("p", { class: "text-xs text-slate-800" }, toDisplayString(formatDate((_z = selectedCourrier.value.document) == null ? void 0 : _z.date_courrier)), 1)
                        ])) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "pt-1" }, [
                        arriveeUrl.value ? (openBlock(), createBlock("div", { key: 0 }, [
                          !showArriveeDoc.value ? (openBlock(), createBlock("button", {
                            key: 0,
                            onClick: ($event) => showArriveeDoc.value = true,
                            class: "inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-all"
                          }, [
                            createVNode(_component_Icon, {
                              name: "i-heroicons-document-arrow-down",
                              class: "w-4 h-4"
                            }),
                            createTextVNode(" Charger le document arriv\xE9 ")
                          ], 8, ["onClick"])) : (openBlock(), createBlock("div", {
                            key: 1,
                            class: "mt-2 rounded-lg overflow-hidden border border-slate-200"
                          }, [
                            createVNode(__nuxt_component_2, {
                              "file-preview-url": arriveeUrl.value,
                              height: "400px"
                            }, null, 8, ["file-preview-url"])
                          ]))
                        ])) : (openBlock(), createBlock("div", {
                          key: 1,
                          class: "inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-400 bg-slate-50 border border-slate-200 rounded-lg cursor-not-allowed"
                        }, [
                          createVNode(_component_Icon, {
                            name: "i-heroicons-document-text",
                            class: "w-4 h-4"
                          }),
                          createTextVNode(" Aucun document disponible ")
                        ]))
                      ])
                    ])
                  ]),
                  ((_B = (_A = selectedCourrier.value.document) == null ? void 0 : _A.reponses) == null ? void 0 : _B.length) ? (openBlock(), createBlock("section", {
                    key: 0,
                    class: "bg-white rounded-xl border border-emerald-200 overflow-hidden"
                  }, [
                    createVNode("div", { class: "flex items-center justify-between px-4 py-2.5 bg-emerald-50 border-b border-emerald-100" }, [
                      createVNode("div", { class: "flex items-center gap-2" }, [
                        createVNode("div", { class: "w-5 h-5 rounded bg-emerald-100 flex items-center justify-center" }, [
                          createVNode(_component_Icon, {
                            name: "i-heroicons-arrow-uturn-right",
                            class: "w-3 h-3 text-emerald-600"
                          })
                        ]),
                        createVNode("span", { class: "text-[11px] font-bold text-emerald-700 uppercase tracking-widest" }, "Courrier de r\xE9ponse")
                      ]),
                      reponseData.value && !loadingReponse.value ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: "inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200"
                      }, [
                        createVNode(_component_Icon, {
                          name: "i-heroicons-check-circle",
                          class: "w-3 h-3"
                        }),
                        createTextVNode(" Charg\xE9 ")
                      ])) : createCommentVNode("", true)
                    ]),
                    loadingReponse.value ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "flex items-center justify-center gap-3 py-8 text-slate-400"
                    }, [
                      createVNode("div", { class: "w-5 h-5 border-2 border-slate-200 border-t-emerald-500 rounded-full animate-spin" }),
                      createVNode("span", { class: "text-xs font-medium" }, "Chargement du courrier de r\xE9ponse...")
                    ])) : reponseData.value ? (openBlock(), createBlock("div", {
                      key: 1,
                      class: "p-4 space-y-3"
                    }, [
                      createVNode("div", { class: "grid grid-cols-1 gap-2" }, [
                        createVNode("div", { class: "flex items-start gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100" }, [
                          createVNode("div", { class: "w-1 min-h-[2rem] rounded-full bg-emerald-400 shrink-0 self-stretch" }),
                          createVNode("div", null, [
                            createVNode("p", { class: "text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-0.5" }, "R\xE9f\xE9rence"),
                            createVNode("p", { class: "text-sm font-bold text-emerald-900" }, toDisplayString(reponseData.value.reference || "Sans r\xE9f\xE9rence"), 1)
                          ])
                        ]),
                        createVNode("div", { class: "flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100" }, [
                          createVNode("div", { class: "w-1 min-h-[2rem] rounded-full bg-slate-300 shrink-0 self-stretch" }),
                          createVNode("div", null, [
                            createVNode("p", { class: "text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5" }, "Objet"),
                            createVNode("p", { class: "text-sm text-slate-800 leading-relaxed" }, toDisplayString(reponseData.value.objet || "Non sp\xE9cifi\xE9"), 1)
                          ])
                        ])
                      ]),
                      createVNode("div", { class: "grid grid-cols-2 md:grid-cols-3 gap-2" }, [
                        createVNode("div", { class: "p-2.5 bg-slate-50 rounded-lg border border-slate-100" }, [
                          createVNode("p", { class: "text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5" }, "Destinataire"),
                          createVNode("p", { class: "text-xs font-semibold text-slate-800" }, toDisplayString(reponseData.value.destinataire || "\u2014"), 1)
                        ]),
                        createVNode("div", { class: "p-2.5 bg-slate-50 rounded-lg border border-slate-100" }, [
                          createVNode("p", { class: "text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5" }, "Date de d\xE9part"),
                          createVNode("p", { class: "text-xs text-slate-800" }, toDisplayString(formatDate(reponseData.value.date_depart) || "\u2014"), 1)
                        ]),
                        reponseData.value.service_emis ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "p-2.5 bg-slate-50 rounded-lg border border-slate-100"
                        }, [
                          createVNode("p", { class: "text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5" }, "Service \xE9metteur"),
                          createVNode("p", { class: "text-xs text-slate-800" }, toDisplayString(reponseData.value.service_emis), 1)
                        ])) : createCommentVNode("", true),
                        reponseData.value.type_depart ? (openBlock(), createBlock("div", {
                          key: 1,
                          class: "p-2.5 bg-slate-50 rounded-lg border border-slate-100"
                        }, [
                          createVNode("p", { class: "text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5" }, "Type de d\xE9part"),
                          createVNode("p", { class: "text-xs text-slate-800" }, toDisplayString(reponseData.value.type_depart), 1)
                        ])) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "pt-1" }, [
                        reponseData.value.url ? (openBlock(), createBlock("div", { key: 0 }, [
                          !showReponseDoc.value ? (openBlock(), createBlock("button", {
                            key: 0,
                            onClick: ($event) => showReponseDoc.value = true,
                            class: "inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-all"
                          }, [
                            createVNode(_component_Icon, {
                              name: "i-heroicons-document-arrow-down",
                              class: "w-4 h-4"
                            }),
                            createTextVNode(" Charger le document de r\xE9ponse ")
                          ], 8, ["onClick"])) : (openBlock(), createBlock("div", {
                            key: 1,
                            class: "mt-2 rounded-lg overflow-hidden border border-emerald-200"
                          }, [
                            createVNode(__nuxt_component_2, {
                              "file-preview-url": reponseData.value.url,
                              height: "400px"
                            }, null, 8, ["file-preview-url"])
                          ]))
                        ])) : (openBlock(), createBlock("div", {
                          key: 1,
                          class: "inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-400 bg-slate-50 border border-slate-200 rounded-lg cursor-not-allowed"
                        }, [
                          createVNode(_component_Icon, {
                            name: "i-heroicons-document-text",
                            class: "w-4 h-4"
                          }),
                          createTextVNode(" Aucun document disponible pour la r\xE9ponse ")
                        ]))
                      ])
                    ])) : (openBlock(), createBlock("div", {
                      key: 2,
                      class: "flex items-center gap-2 m-4 p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600"
                    }, [
                      createVNode(_component_Icon, {
                        name: "i-heroicons-exclamation-triangle",
                        class: "w-4 h-4 shrink-0"
                      }),
                      createTextVNode(" Impossible de charger les d\xE9tails du courrier de r\xE9ponse. ")
                    ]))
                  ])) : createCommentVNode("", true)
                ]),
                createVNode("div", { class: "px-6 py-4 border-t border-slate-100 shrink-0 flex justify-end" }, [
                  createVNode(_component_UButton, {
                    color: "gray",
                    variant: "outline",
                    onClick: closeDetails
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Fermer")
                    ]),
                    _: 1
                  })
                ])
              ])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6" data-v-4e129d6f><div data-v-4e129d6f><h1 class="text-2xl font-bold text-slate-900 tracking-tight" data-v-4e129d6f>Courriers arriv\xE9s</h1><p class="text-sm text-slate-500" data-v-4e129d6f>Gestion et suivi des courriers entrants</p></div>`);
      if (!unref(isAdmin)()) {
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
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (loading.value) {
        _push(`<div class="flex flex-col items-center justify-center py-20 gap-4 text-slate-500" data-v-4e129d6f><div class="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" data-v-4e129d6f></div><span class="text-sm font-medium" data-v-4e129d6f>Chargement des donn\xE9es...</span></div>`);
      } else if (error.value) {
        _push(`<div class="flex items-center gap-4 p-5 bg-red-50 border border-red-200 rounded-xl max-w-2xl mx-auto sm:mx-0" data-v-4e129d6f><svg class="w-8 h-8 text-red-600 shrink-0" viewBox="0 0 20 20" fill="currentColor" data-v-4e129d6f><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" data-v-4e129d6f></path></svg><div class="flex-1" data-v-4e129d6f><p class="text-sm font-bold text-red-900" data-v-4e129d6f>Erreur de chargement</p><p class="text-xs text-red-700" data-v-4e129d6f>${ssrInterpolate(error.value)}</p></div><button class="px-4 py-2 text-xs font-bold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors shrink-0" data-v-4e129d6f> R\xE9essayer </button></div>`);
      } else {
        _push(ssrRenderComponent(_sfc_main$1, {
          data: courriers.value,
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
              _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-v-4e129d6f${_scopeId}><!--[-->`);
              ssrRenderList(filterFields, (field) => {
                _push2(`<div data-v-4e129d6f${_scopeId}><label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" data-v-4e129d6f${_scopeId}>${ssrInterpolate(field.label)}</label><input${ssrRenderAttr("value", filters[field.id])} placeholder="Filtrer..." class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" data-v-4e129d6f${_scopeId}></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              return [
                createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" }, [
                  (openBlock(), createBlock(Fragment, null, renderList(filterFields, (field) => {
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
            var _a, _b, _c, _d, _e, _f;
            if (_push2) {
              _push2(`<div class="flex gap-1.5 justify-end" data-v-4e129d6f${_scopeId}><button title="Voir les d\xE9tails" class="inline-flex items-center justify-center w-8 h-8 bg-amber-50 text-amber-700 border-amber-100 rounded-md hover:bg-amber-200 hover:text-amber-900 transition-all group" data-v-4e129d6f${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                name: "i-heroicons-eye",
                class: "w-4 h-4 group-hover:text-yellow-600"
              }, null, _parent2, _scopeId));
              _push2(`</button>`);
              if (!unref(isAdmin)()) {
                _push2(`<button title="Affecter ce courrier" class="inline-flex items-center justify-center w-8 h-8 bg-sky-50 text-sky-700 border-sky-100 rounded-md hover:bg-sky-200 hover:text-sky-900 transition-all group" data-v-4e129d6f${_scopeId}>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "i-heroicons-paper-airplane",
                  class: "w-4 h-4 group-hover:text-blue-600"
                }, null, _parent2, _scopeId));
                _push2(`</button>`);
              } else {
                _push2(`<!---->`);
              }
              if (!((_c = (_b = (_a = item._complete) == null ? void 0 : _a.document) == null ? void 0 : _b.reponses) == null ? void 0 : _c.length) && !unref(isAdmin)()) {
                _push2(`<button title="R\xE9pondre au courrier" class="inline-flex items-center justify-center w-8 h-8 bg-emerald-50 text-emerald-700 border-emerald-100 rounded-md hover:bg-emerald-200 hover:text-emerald-900 transition-all group" data-v-4e129d6f${_scopeId}>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "i-heroicons-arrow-uturn-right",
                  class: "w-4 h-4 group-hover:text-green-600"
                }, null, _parent2, _scopeId));
                _push2(`</button>`);
              } else if (!unref(isAdmin)()) {
                _push2(`<div title="Ce courrier a d\xE9j\xE0 une r\xE9ponse" class="inline-flex items-center justify-center w-8 h-8 bg-green-50 text-green-500 border border-green-100 rounded-md cursor-default" data-v-4e129d6f${_scopeId}>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "i-heroicons-check-circle",
                  class: "w-4 h-4"
                }, null, _parent2, _scopeId));
                _push2(`</div>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(isAdmin)()) {
                _push2(`<button title="Modifier ce courrier" class="inline-flex items-center justify-center w-8 h-8 bg-sky-50 text-sky-700 border-sky-100 rounded-md hover:bg-sky-200 hover:text-sky-900 transition-all group" data-v-4e129d6f${_scopeId}>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "i-heroicons-pencil",
                  class: "w-4 h-4 group-hover:text-blue-600"
                }, null, _parent2, _scopeId));
                _push2(`</button>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(isAdmin)()) {
                _push2(`<button title="Supprimer ce courrier" class="inline-flex items-center justify-center w-8 h-8 bg-red-50 text-red-700 border-red-100 rounded-md hover:bg-red-200 hover:text-red-900 transition-all group" data-v-4e129d6f${_scopeId}>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "i-heroicons-trash",
                  class: "w-4 h-4 group-hover:text-red-600"
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
                    onClick: ($event) => handleView(item),
                    title: "Voir les d\xE9tails",
                    class: "inline-flex items-center justify-center w-8 h-8 bg-amber-50 text-amber-700 border-amber-100 rounded-md hover:bg-amber-200 hover:text-amber-900 transition-all group"
                  }, [
                    createVNode(_component_Icon, {
                      name: "i-heroicons-eye",
                      class: "w-4 h-4 group-hover:text-yellow-600"
                    })
                  ], 8, ["onClick"]),
                  !unref(isAdmin)() ? (openBlock(), createBlock("button", {
                    key: 0,
                    onClick: ($event) => handleQuickAssign(item.id),
                    title: "Affecter ce courrier",
                    class: "inline-flex items-center justify-center w-8 h-8 bg-sky-50 text-sky-700 border-sky-100 rounded-md hover:bg-sky-200 hover:text-sky-900 transition-all group"
                  }, [
                    createVNode(_component_Icon, {
                      name: "i-heroicons-paper-airplane",
                      class: "w-4 h-4 group-hover:text-blue-600"
                    })
                  ], 8, ["onClick"])) : createCommentVNode("", true),
                  !((_f = (_e = (_d = item._complete) == null ? void 0 : _d.document) == null ? void 0 : _e.reponses) == null ? void 0 : _f.length) && !unref(isAdmin)() ? (openBlock(), createBlock("button", {
                    key: 1,
                    onClick: ($event) => handleReply(item),
                    title: "R\xE9pondre au courrier",
                    class: "inline-flex items-center justify-center w-8 h-8 bg-emerald-50 text-emerald-700 border-emerald-100 rounded-md hover:bg-emerald-200 hover:text-emerald-900 transition-all group"
                  }, [
                    createVNode(_component_Icon, {
                      name: "i-heroicons-arrow-uturn-right",
                      class: "w-4 h-4 group-hover:text-green-600"
                    })
                  ], 8, ["onClick"])) : !unref(isAdmin)() ? (openBlock(), createBlock("div", {
                    key: 2,
                    title: "Ce courrier a d\xE9j\xE0 une r\xE9ponse",
                    class: "inline-flex items-center justify-center w-8 h-8 bg-green-50 text-green-500 border border-green-100 rounded-md cursor-default"
                  }, [
                    createVNode(_component_Icon, {
                      name: "i-heroicons-check-circle",
                      class: "w-4 h-4"
                    })
                  ])) : createCommentVNode("", true),
                  unref(isAdmin)() ? (openBlock(), createBlock("button", {
                    key: 3,
                    onClick: ($event) => onEdit(item),
                    title: "Modifier ce courrier",
                    class: "inline-flex items-center justify-center w-8 h-8 bg-sky-50 text-sky-700 border-sky-100 rounded-md hover:bg-sky-200 hover:text-sky-900 transition-all group"
                  }, [
                    createVNode(_component_Icon, {
                      name: "i-heroicons-pencil",
                      class: "w-4 h-4 group-hover:text-blue-600"
                    })
                  ], 8, ["onClick"])) : createCommentVNode("", true),
                  unref(isAdmin)() ? (openBlock(), createBlock("button", {
                    key: 4,
                    onClick: ($event) => onDelete(item),
                    title: "Supprimer ce courrier",
                    class: "inline-flex items-center justify-center w-8 h-8 bg-red-50 text-red-700 border-red-100 rounded-md hover:bg-red-200 hover:text-red-900 transition-all group"
                  }, [
                    createVNode(_component_Icon, {
                      name: "i-heroicons-trash",
                      class: "w-4 h-4 group-hover:text-red-600"
                    })
                  ], 8, ["onClick"])) : createCommentVNode("", true)
                ])
              ];
            }
          }),
          "cell-source": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100" data-v-4e129d6f${_scopeId}>${ssrInterpolate(value)}</span>`);
            } else {
              return [
                createVNode("span", { class: "inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100" }, toDisplayString(value), 1)
              ];
            }
          }),
          "cell-reference": withCtx(({ value, item }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (item.url) {
                _push2(`<button class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-all group"${ssrRenderAttr("title", `Ouvrir le document ${value}`)} data-v-4e129d6f${_scopeId}>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "i-heroicons-document-text",
                  class: "w-3.5 h-3.5 group-hover:scale-110 transition-transform"
                }, null, _parent2, _scopeId));
                _push2(`<span data-v-4e129d6f${_scopeId}>${ssrInterpolate(value)}</span>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "i-heroicons-arrow-top-right-on-square",
                  class: "w-3 h-3 opacity-60 group-hover:opacity-100"
                }, null, _parent2, _scopeId));
                _push2(`</button>`);
              } else {
                _push2(`<span class="inline-flex items-center px-2.5 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md" data-v-4e129d6f${_scopeId}>`);
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
                  class: "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-all group",
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
                  class: "inline-flex items-center px-2.5 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md"
                }, [
                  createVNode(_component_Icon, {
                    name: "i-heroicons-document-text",
                    class: "w-3.5 h-3.5 mr-1.5 opacity-50"
                  }),
                  createTextVNode(" " + toDisplayString(value), 1)
                ]))
              ];
            }
          }),
          "cell-priority": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="${ssrRenderClass([{
                "bg-red-50 text-red-700 border-red-100": (value == null ? void 0 : value.toLowerCase()) === "urgent",
                "bg-amber-50 text-amber-700 border-amber-100": (value == null ? void 0 : value.toLowerCase()) === "important",
                "bg-sky-50 text-sky-700 border-sky-100": (value == null ? void 0 : value.toLowerCase()) === "standard"
              }, "inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border uppercase"])}" data-v-4e129d6f${_scopeId}>${ssrInterpolate(value || "Standard")}</span>`);
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
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/courriers/CourriersArrivesListe.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_5 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-4e129d6f"]]);

export { __nuxt_component_5 as default };
//# sourceMappingURL=CourriersArrivesListe-BVTEn-sH.mjs.map
