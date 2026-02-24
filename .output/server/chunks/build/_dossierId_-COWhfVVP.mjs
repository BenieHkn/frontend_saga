import { q as useRouter, r as useToast, d as __nuxt_component_1, g as __nuxt_component_2$1, _ as _export_sfc, b as useRuntimeConfig } from './server.mjs';
import { _ as _sfc_main$2 } from './AppTabs-B2KNyztb.mjs';
import __nuxt_component_1$1 from './Badge-DIEXPf_r.mjs';
import __nuxt_component_3 from './Modal-EvFvX6Ng.mjs';
import __nuxt_component_2 from './Card-DtmGMnBU.mjs';
import __nuxt_component_1$2 from './FormGroup-C6GvzJxy.mjs';
import __nuxt_component_2$2 from './Input-50cchghJ.mjs';
import __nuxt_component_4 from './Select-C_BWMUVV.mjs';
import { ref, computed, reactive, unref, withCtx, createTextVNode, toDisplayString, createVNode, createBlock, openBlock, Fragment, renderList, createCommentVNode, isRef, mergeProps, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttrs, ssrRenderClass, ssrRenderAttr } from 'vue/server-renderer';
import { u as useCodirsStore, f as formatDateFR } from './codirs-D_To-40U.mjs';
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
import './useFormGroup-BPckFnLf.mjs';

const _sfc_main$1 = {
  __name: "AppSelectSearch",
  __ssrInlineRender: true,
  props: {
    options: { type: Array, default: () => [] },
    // [{ label, value }]
    modelValue: { type: Array, default: () => [] },
    // toujours un tableau en multiple
    placeholder: { type: String, default: "Rechercher..." },
    loading: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const search = ref("");
    const open = ref(false);
    const filtered = computed(
      () => props.options.filter(
        (o) => o.label.toLowerCase().includes(search.value.toLowerCase())
      )
    );
    const selectedSingle = computed(
      () => {
        var _a;
        return (_a = props.options.find((o) => o.value === props.modelValue)) != null ? _a : null;
      }
    );
    const selectedMultiple = computed(
      () => props.options.filter((o) => props.modelValue.includes(o.value))
    );
    const isSelected = (option) => props.multiple ? props.modelValue.includes(option.value) : props.modelValue === option.value;
    const container = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = __nuxt_component_2$1;
      const _component_UButton = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "container",
        ref: container,
        class: "relative"
      }, _attrs))} data-v-7a5345bc><div class="${ssrRenderClass([unref(open) ? "border-blue-500 ring-1 ring-blue-500" : "", "flex items-center justify-between gap-2 w-full min-h-[38px] px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 cursor-pointer hover:border-blue-400 transition-colors"])}" data-v-7a5345bc>`);
      if (__props.multiple) {
        _push(`<div class="flex flex-wrap gap-1 flex-1" data-v-7a5345bc><!--[-->`);
        ssrRenderList(unref(selectedMultiple), (item) => {
          _push(`<span class="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 rounded-full" data-v-7a5345bc>${ssrInterpolate(item.label)} <button class="hover:text-blue-900" data-v-7a5345bc>`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-heroicons-x-mark",
            class: "w-3 h-3"
          }, null, _parent));
          _push(`</button></span>`);
        });
        _push(`<!--]-->`);
        if (!unref(selectedMultiple).length) {
          _push(`<span class="text-gray-400 py-0.5" data-v-7a5345bc>${ssrInterpolate(__props.placeholder)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else if (unref(selectedSingle)) {
        _push(`<span class="text-gray-900 dark:text-white truncate flex-1" data-v-7a5345bc>${ssrInterpolate(unref(selectedSingle).label)}</span>`);
      } else {
        _push(`<span class="text-gray-400 flex-1" data-v-7a5345bc>${ssrInterpolate(__props.placeholder)}</span>`);
      }
      _push(`<div class="flex items-center gap-1 shrink-0" data-v-7a5345bc>`);
      if (__props.multiple ? __props.modelValue.length : __props.modelValue) {
        _push(`<button class="text-gray-400 hover:text-gray-600" data-v-7a5345bc>`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-x-mark",
          class: "w-4 h-4"
        }, null, _parent));
        _push(`</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-heroicons-chevron-down",
        class: ["w-4 h-4 text-gray-400 transition-transform", unref(open) ? "rotate-180" : ""]
      }, null, _parent));
      _push(`</div></div>`);
      if (unref(open)) {
        _push(`<div class="absolute z-50 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden" data-v-7a5345bc><div class="p-2 border-b border-gray-100 dark:border-gray-800" data-v-7a5345bc><input${ssrRenderAttr("value", unref(search))} type="text"${ssrRenderAttr("placeholder", __props.placeholder)} class="w-full px-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md outline-none focus:border-blue-400" autofocus data-v-7a5345bc></div>`);
        if (__props.multiple && __props.modelValue.length) {
          _push(`<div class="px-3 py-1.5 text-xs text-blue-600 dark:text-blue-400 border-b border-gray-100 dark:border-gray-800" data-v-7a5345bc>${ssrInterpolate(__props.modelValue.length)} s\xE9lectionn\xE9(s) </div>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.loading) {
          _push(`<div class="flex justify-center py-4" data-v-7a5345bc>`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-heroicons-arrow-path",
            class: "w-5 h-5 animate-spin text-blue-500"
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<ul class="max-h-52 overflow-y-auto" data-v-7a5345bc>`);
          if (!unref(filtered).length) {
            _push(`<li class="px-3 py-4 text-sm text-center text-gray-400" data-v-7a5345bc> Aucun r\xE9sultat </li>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--[-->`);
          ssrRenderList(unref(filtered), (option) => {
            _push(`<li class="${ssrRenderClass([isSelected(option) ? "text-blue-600 bg-blue-50 dark:bg-blue-950/30 font-medium" : "text-gray-700 dark:text-gray-300", "flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"])}" data-v-7a5345bc><div class="flex items-center gap-2" data-v-7a5345bc>`);
            if (__props.multiple) {
              _push(`<div class="${ssrRenderClass([isSelected(option) ? "bg-blue-500 border-blue-500" : "border-gray-300 dark:border-gray-600", "w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors"])}" data-v-7a5345bc>`);
              if (isSelected(option)) {
                _push(ssrRenderComponent(_component_UIcon, {
                  name: "i-heroicons-check",
                  class: "w-3 h-3 text-white"
                }, null, _parent));
              } else {
                _push(`<!---->`);
              }
              _push(`</div>`);
            } else {
              _push(`<!---->`);
            }
            _push(` ${ssrInterpolate(option.label)}</div>`);
            if (!__props.multiple && isSelected(option)) {
              _push(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-check",
                class: "w-4 h-4 text-blue-500"
              }, null, _parent));
            } else {
              _push(`<!---->`);
            }
            _push(`</li>`);
          });
          _push(`<!--]--></ul>`);
        }
        if (__props.multiple) {
          _push(`<div class="p-2 border-t border-gray-100 dark:border-gray-800 flex justify-end" data-v-7a5345bc>`);
          _push(ssrRenderComponent(_component_UButton, {
            size: "xs",
            color: "blue",
            variant: "soft",
            onClick: ($event) => open.value = false
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Confirmer `);
              } else {
                return [
                  createTextVNode(" Confirmer ")
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
      _push(`</div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppSelectSearch.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_9 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-7a5345bc"]]);
function useRequestApi() {
  const { public: { apiBase } } = useRuntimeConfig();
  const loading = ref(false);
  const error = ref(null);
  const getHeaders = (body = null) => {
    var _a;
    const headers = {
      Authorization: `Bearer ${(_a = localStorage.getItem("auth_token")) != null ? _a : ""}`
    };
    if (!(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }
    return headers;
  };
  async function call(url, opts = {}) {
    var _a, _b, _c;
    loading.value = true;
    error.value = null;
    try {
      return await $fetch(`${apiBase}${url}`, {
        headers: getHeaders(opts.body),
        ...opts
      });
    } catch (e) {
      error.value = (_c = (_b = (_a = e == null ? void 0 : e.data) == null ? void 0 : _a.message) != null ? _b : e == null ? void 0 : e.message) != null ? _c : "Erreur r\xE9seau";
      throw e;
    } finally {
      loading.value = false;
    }
  }
  return { loading, error, call };
}
function useDossier() {
  const { loading, error, call } = useRequestApi();
  return {
    loading,
    error,
    getDossier: (id) => call(`/dossiers/${id}`),
    createDossier: (body) => call("/dossiers", { method: "POST", body }),
    updateDossier: (id, body) => call(`/dossiers/${id}`, { method: "PUT", body }),
    deleteDossier: (id) => call(`/dossiers/${id}`, { method: "DELETE" })
  };
}
function useTache() {
  const { public: { apiBase } } = useRuntimeConfig();
  const loading = ref(false);
  const error = ref(null);
  const getHeaders = () => {
    var _a;
    return {
      Authorization: `Bearer ${(_a = localStorage.getItem("auth_token")) != null ? _a : ""}`,
      "Content-Type": "application/json"
    };
  };
  async function api(url, opts = {}) {
    var _a, _b, _c;
    loading.value = true;
    error.value = null;
    try {
      return await $fetch(`${apiBase}${url}`, { headers: getHeaders(), ...opts });
    } catch (e) {
      error.value = (_c = (_b = (_a = e == null ? void 0 : e.data) == null ? void 0 : _a.message) != null ? _b : e == null ? void 0 : e.message) != null ? _c : "Erreur r\xE9seau";
      throw e;
    } finally {
      loading.value = false;
    }
  }
  return {
    loading,
    error,
    getTaches: () => api("/taches"),
    getTache: (id) => api(`/taches/${id}`),
    createTache: (body) => api("/taches", { method: "POST", body }),
    updateTache: (id, body) => api(`/taches/${id}`, { method: "PUT", body }),
    deleteTache: (id) => api(`/taches/${id}`, { method: "DELETE" })
  };
}
function useMembre() {
  const { loading, error, call } = useRequestApi();
  return {
    loading,
    error,
    getMembres: () => call("/membres"),
    getMembre: (id) => call(`/membres/${id}`),
    getTaches: (id) => call(`/membres/${id}/taches`),
    getPresence: (id) => call(`/membres/${id}/presence`)
  };
}
const _sfc_main = {
  __name: "[dossierId]",
  __ssrInlineRender: true,
  setup(__props) {
    const router = useRouter();
    useCodirsStore();
    const toast = useToast();
    const dossierApi = useDossier();
    const tacheApi = useTache();
    const membreApi = useMembre();
    const dossier = ref(null);
    const currentOrdreDuJour = ref(null);
    const currentCodir = ref(null);
    const membres = ref([]);
    const loading = ref(true);
    const tabs = [
      { id: "actions", label: "Actions" },
      { id: "activites", label: "Activit\xE9s" },
      { id: "taches", label: "T\xE2ches" }
    ];
    const actions = computed(() => {
      var _a, _b;
      return (_b = (_a = dossier.value) == null ? void 0 : _a.actions) != null ? _b : [];
    });
    const activites = computed(() => {
      var _a, _b;
      return (_b = (_a = dossier.value) == null ? void 0 : _a.activites) != null ? _b : [];
    });
    const taches = computed(() => {
      var _a, _b;
      return (_b = (_a = dossier.value) == null ? void 0 : _a.taches) != null ? _b : [];
    });
    const membreOptions = computed(
      () => membres.value.map((m) => {
        var _a, _b, _c, _d;
        return {
          label: ((_b = (_a = m.entite_user) == null ? void 0 : _a.user) == null ? void 0 : _b.nom) + " " + ((_d = (_c = m.entite_user) == null ? void 0 : _c.user) == null ? void 0 : _d.prenom),
          value: m.id
        };
      })
    );
    const PRIORITE_OPTIONS = [
      { label: "Haute", value: "Haute" },
      { label: "Moyenne", value: "Moyenne" },
      { label: "Basse", value: "Basse" }
    ];
    const tacheModal = ref(false);
    const tacheForm = reactive({
      intitule: "",
      date_debut: "",
      date_fin: "",
      priorite: "Moyenne",
      avancement: "",
      membre_ids: []
    });
    const resetTacheForm = () => Object.assign(tacheForm, {
      intitule: "",
      date_debut: "",
      date_fin: "",
      priorite: "Moyenne",
      avancement: "",
      membre_ids: []
    });
    const createTache = async () => {
      if (!tacheForm.intitule.trim() || !tacheForm.date_debut || !tacheForm.date_fin) {
        toast.add({
          title: "Champs requis manquants",
          color: "orange",
          icon: "i-heroicons-exclamation-triangle"
        });
        return;
      }
      try {
        await tacheApi.createTache({
          ...tacheForm,
          dossier_id: dossier.value.id
        });
        dossier.value = await dossierApi.getDossier(dossier.value.id);
        toast.add({
          title: "T\xE2che cr\xE9\xE9e",
          description: `"${tacheForm.intitule}" a \xE9t\xE9 cr\xE9\xE9e avec succ\xE8s`,
          color: "green",
          icon: "i-heroicons-check-circle"
        });
        tacheModal.value = false;
        resetTacheForm();
      } catch {
        toast.add({
          title: "Erreur",
          description: "Impossible de cr\xE9er la t\xE2che",
          color: "red",
          icon: "i-heroicons-exclamation-circle"
        });
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c;
      const _component_UButton = __nuxt_component_1;
      const _component_UIcon = __nuxt_component_2$1;
      const _component_AppTabs = _sfc_main$2;
      const _component_UBadge = __nuxt_component_1$1;
      const _component_UModal = __nuxt_component_3;
      const _component_UCard = __nuxt_component_2;
      const _component_UFormGroup = __nuxt_component_1$2;
      const _component_UInput = __nuxt_component_2$2;
      const _component_USelect = __nuxt_component_4;
      const _component_AppSelectSearch = __nuxt_component_9;
      _push(`<!--[--><div class="max-w-3xl mx-auto py-10 px-6"><div class="mb-6 flex items-center gap-3">`);
      _push(ssrRenderComponent(_component_UButton, {
        icon: "i-heroicons-arrow-left",
        color: "gray",
        variant: "ghost",
        onClick: ($event) => unref(router).back()
      }, null, _parent));
      _push(`<span class="text-gray-400 text-sm">Retour \xE0 l&#39;ordre du jour</span></div>`);
      if (unref(loading)) {
        _push(`<div class="flex justify-center py-20">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-arrow-path",
          class: "w-8 h-8 animate-spin text-blue-500"
        }, null, _parent));
        _push(`</div>`);
      } else if (!unref(dossier)) {
        _push(`<div class="text-center py-20">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-exclamation-triangle",
          class: "w-12 h-12 mx-auto text-amber-400 mb-4"
        }, null, _parent));
        _push(`<p class="text-gray-500 text-sm">Dossier introuvable.</p>`);
        _push(ssrRenderComponent(_component_UButton, {
          class: "mt-4",
          color: "gray",
          variant: "ghost",
          onClick: ($event) => unref(router).back()
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Retour`);
            } else {
              return [
                createTextVNode("Retour")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!--[--><div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 mb-6"><div class="p-6 border-b border-gray-100 dark:border-gray-800"><div class="flex items-center gap-4"><div class="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-950/40 flex items-center justify-center">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-folder",
          class: "w-6 h-6 text-violet-600 dark:text-violet-400"
        }, null, _parent));
        _push(`</div><div><h1 class="text-xl font-bold text-gray-900 dark:text-white">${ssrInterpolate(unref(dossier).libelle)}</h1><p class="text-sm text-gray-500 dark:text-gray-400">Dossier #${ssrInterpolate(unref(dossier).id)}</p></div></div></div><div class="p-6"><div class="grid grid-cols-1 md:grid-cols-3 gap-4"><div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4"><p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Ordre du jour</p><p class="font-medium text-gray-900 dark:text-white text-sm">${ssrInterpolate((_b = (_a = unref(currentOrdreDuJour)) == null ? void 0 : _a.libelle) != null ? _b : "Non sp\xE9cifi\xE9")}</p></div><div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4"><p class="text-sm text-gray-500 dark:text-gray-400 mb-1">CODIR</p><p class="font-medium text-gray-900 dark:text-white text-sm">${ssrInterpolate(((_c = unref(currentCodir)) == null ? void 0 : _c.date) ? unref(formatDateFR)(unref(currentCodir).date) : "Non sp\xE9cifi\xE9")}</p></div><div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4"><p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Identifiant</p><p class="font-medium text-gray-900 dark:text-white text-sm">#${ssrInterpolate(unref(dossier).id)}</p></div></div></div></div>`);
        _push(ssrRenderComponent(_component_AppTabs, { tabs }, {
          actions: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (!unref(actions).length) {
                _push2(`<div class="text-center py-8 text-gray-400 text-sm bg-gray-50 dark:bg-slate-800/50 rounded-xl"${_scopeId}> Aucune action rattach\xE9e \xE0 ce dossier </div>`);
              } else {
                _push2(`<div class="flex flex-col gap-3"${_scopeId}><!--[-->`);
                ssrRenderList(unref(actions), (action) => {
                  _push2(`<div class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4"${_scopeId}><div class="flex items-center justify-between mb-1"${_scopeId}><p class="font-medium text-gray-900 dark:text-white text-sm"${_scopeId}>${ssrInterpolate(action.libelle)}</p>`);
                  _push2(ssrRenderComponent(_component_UBadge, {
                    color: "blue",
                    variant: "soft",
                    size: "xs"
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      var _a2, _b2, _c2, _d;
                      if (_push3) {
                        _push3(`${ssrInterpolate((_b2 = (_a2 = action.activites) == null ? void 0 : _a2.length) != null ? _b2 : 0)} activit\xE9(s) `);
                      } else {
                        return [
                          createTextVNode(toDisplayString((_d = (_c2 = action.activites) == null ? void 0 : _c2.length) != null ? _d : 0) + " activit\xE9(s) ", 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                  _push2(`</div>`);
                  if (action.description) {
                    _push2(`<p class="text-xs text-gray-500"${_scopeId}>${ssrInterpolate(action.description)}</p>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div>`);
                });
                _push2(`<!--]--></div>`);
              }
            } else {
              return [
                !unref(actions).length ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "text-center py-8 text-gray-400 text-sm bg-gray-50 dark:bg-slate-800/50 rounded-xl"
                }, " Aucune action rattach\xE9e \xE0 ce dossier ")) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "flex flex-col gap-3"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(actions), (action) => {
                    return openBlock(), createBlock("div", {
                      key: action.id,
                      class: "bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4"
                    }, [
                      createVNode("div", { class: "flex items-center justify-between mb-1" }, [
                        createVNode("p", { class: "font-medium text-gray-900 dark:text-white text-sm" }, toDisplayString(action.libelle), 1),
                        createVNode(_component_UBadge, {
                          color: "blue",
                          variant: "soft",
                          size: "xs"
                        }, {
                          default: withCtx(() => {
                            var _a2, _b2;
                            return [
                              createTextVNode(toDisplayString((_b2 = (_a2 = action.activites) == null ? void 0 : _a2.length) != null ? _b2 : 0) + " activit\xE9(s) ", 1)
                            ];
                          }),
                          _: 2
                        }, 1024)
                      ]),
                      action.description ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "text-xs text-gray-500"
                      }, toDisplayString(action.description), 1)) : createCommentVNode("", true)
                    ]);
                  }), 128))
                ]))
              ];
            }
          }),
          activites: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (!unref(activites).length) {
                _push2(`<div class="text-center py-8 text-gray-400 text-sm bg-gray-50 dark:bg-slate-800/50 rounded-xl"${_scopeId}> Aucune activit\xE9 rattach\xE9e \xE0 ce dossier </div>`);
              } else {
                _push2(`<div class="flex flex-col gap-3"${_scopeId}><!--[-->`);
                ssrRenderList(unref(activites), (activite) => {
                  _push2(`<div class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4"${_scopeId}><div class="flex items-center justify-between mb-1"${_scopeId}><p class="font-medium text-gray-900 dark:text-white text-sm"${_scopeId}>${ssrInterpolate(activite.libelle)}</p>`);
                  _push2(ssrRenderComponent(_component_UBadge, {
                    color: "violet",
                    variant: "soft",
                    size: "xs"
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      var _a2, _b2, _c2, _d;
                      if (_push3) {
                        _push3(`${ssrInterpolate((_b2 = (_a2 = activite.taches) == null ? void 0 : _a2.length) != null ? _b2 : 0)} t\xE2che(s) `);
                      } else {
                        return [
                          createTextVNode(toDisplayString((_d = (_c2 = activite.taches) == null ? void 0 : _c2.length) != null ? _d : 0) + " t\xE2che(s) ", 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                  _push2(`</div>`);
                  if (activite.description) {
                    _push2(`<p class="text-xs text-gray-500"${_scopeId}>${ssrInterpolate(activite.description)}</p>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div>`);
                });
                _push2(`<!--]--></div>`);
              }
            } else {
              return [
                !unref(activites).length ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "text-center py-8 text-gray-400 text-sm bg-gray-50 dark:bg-slate-800/50 rounded-xl"
                }, " Aucune activit\xE9 rattach\xE9e \xE0 ce dossier ")) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "flex flex-col gap-3"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(activites), (activite) => {
                    return openBlock(), createBlock("div", {
                      key: activite.id,
                      class: "bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4"
                    }, [
                      createVNode("div", { class: "flex items-center justify-between mb-1" }, [
                        createVNode("p", { class: "font-medium text-gray-900 dark:text-white text-sm" }, toDisplayString(activite.libelle), 1),
                        createVNode(_component_UBadge, {
                          color: "violet",
                          variant: "soft",
                          size: "xs"
                        }, {
                          default: withCtx(() => {
                            var _a2, _b2;
                            return [
                              createTextVNode(toDisplayString((_b2 = (_a2 = activite.taches) == null ? void 0 : _a2.length) != null ? _b2 : 0) + " t\xE2che(s) ", 1)
                            ];
                          }),
                          _: 2
                        }, 1024)
                      ]),
                      activite.description ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "text-xs text-gray-500"
                      }, toDisplayString(activite.description), 1)) : createCommentVNode("", true)
                    ]);
                  }), 128))
                ]))
              ];
            }
          }),
          taches: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-center justify-between mb-3"${_scopeId}><span class="text-sm font-medium text-gray-700 dark:text-gray-300"${_scopeId}>${ssrInterpolate(unref(taches).length)} t\xE2che(s) </span>`);
              _push2(ssrRenderComponent(_component_UButton, {
                icon: "i-heroicons-plus",
                color: "blue",
                variant: "soft",
                size: "sm",
                onClick: ($event) => tacheModal.value = true
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Ajouter une t\xE2che `);
                  } else {
                    return [
                      createTextVNode(" Ajouter une t\xE2che ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
              if (!unref(taches).length) {
                _push2(`<div class="text-center py-8 text-gray-400 text-sm bg-gray-50 dark:bg-slate-800/50 rounded-xl"${_scopeId}> Aucune t\xE2che rattach\xE9e \xE0 ce dossier </div>`);
              } else {
                _push2(`<div class="flex flex-col gap-3"${_scopeId}><!--[-->`);
                ssrRenderList(unref(taches), (tache) => {
                  _push2(`<div class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4"${_scopeId}><div class="flex items-center justify-between mb-1"${_scopeId}><p class="font-medium text-gray-900 dark:text-white text-sm"${_scopeId}>${ssrInterpolate(tache.intitule)}</p>`);
                  _push2(ssrRenderComponent(_component_UBadge, {
                    color: tache.priorite === "Haute" ? "red" : tache.priorite === "Moyenne" ? "amber" : "green",
                    variant: "soft",
                    size: "xs"
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      var _a2, _b2;
                      if (_push3) {
                        _push3(`${ssrInterpolate((_a2 = tache.priorite) != null ? _a2 : "Normale")}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString((_b2 = tache.priorite) != null ? _b2 : "Normale"), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                  _push2(`</div><div class="flex items-center gap-4 mt-2 text-xs text-gray-400"${_scopeId}><span class="flex items-center gap-1"${_scopeId}>`);
                  _push2(ssrRenderComponent(_component_UIcon, {
                    name: "i-heroicons-calendar",
                    class: "w-3.5 h-3.5"
                  }, null, _parent2, _scopeId));
                  _push2(` ${ssrInterpolate(unref(formatDateFR)(tache.date_debut))}</span><span${_scopeId}>\u2192</span><span class="flex items-center gap-1"${_scopeId}>`);
                  _push2(ssrRenderComponent(_component_UIcon, {
                    name: "i-heroicons-calendar",
                    class: "w-3.5 h-3.5"
                  }, null, _parent2, _scopeId));
                  _push2(` ${ssrInterpolate(unref(formatDateFR)(tache.date_fin))}</span></div></div>`);
                });
                _push2(`<!--]--></div>`);
              }
            } else {
              return [
                createVNode("div", { class: "flex items-center justify-between mb-3" }, [
                  createVNode("span", { class: "text-sm font-medium text-gray-700 dark:text-gray-300" }, toDisplayString(unref(taches).length) + " t\xE2che(s) ", 1),
                  createVNode(_component_UButton, {
                    icon: "i-heroicons-plus",
                    color: "blue",
                    variant: "soft",
                    size: "sm",
                    onClick: ($event) => tacheModal.value = true
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Ajouter une t\xE2che ")
                    ]),
                    _: 1
                  }, 8, ["onClick"])
                ]),
                !unref(taches).length ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "text-center py-8 text-gray-400 text-sm bg-gray-50 dark:bg-slate-800/50 rounded-xl"
                }, " Aucune t\xE2che rattach\xE9e \xE0 ce dossier ")) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "flex flex-col gap-3"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(taches), (tache) => {
                    return openBlock(), createBlock("div", {
                      key: tache.id,
                      class: "bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4"
                    }, [
                      createVNode("div", { class: "flex items-center justify-between mb-1" }, [
                        createVNode("p", { class: "font-medium text-gray-900 dark:text-white text-sm" }, toDisplayString(tache.intitule), 1),
                        createVNode(_component_UBadge, {
                          color: tache.priorite === "Haute" ? "red" : tache.priorite === "Moyenne" ? "amber" : "green",
                          variant: "soft",
                          size: "xs"
                        }, {
                          default: withCtx(() => {
                            var _a2;
                            return [
                              createTextVNode(toDisplayString((_a2 = tache.priorite) != null ? _a2 : "Normale"), 1)
                            ];
                          }),
                          _: 2
                        }, 1032, ["color"])
                      ]),
                      createVNode("div", { class: "flex items-center gap-4 mt-2 text-xs text-gray-400" }, [
                        createVNode("span", { class: "flex items-center gap-1" }, [
                          createVNode(_component_UIcon, {
                            name: "i-heroicons-calendar",
                            class: "w-3.5 h-3.5"
                          }),
                          createTextVNode(" " + toDisplayString(unref(formatDateFR)(tache.date_debut)), 1)
                        ]),
                        createVNode("span", null, "\u2192"),
                        createVNode("span", { class: "flex items-center gap-1" }, [
                          createVNode(_component_UIcon, {
                            name: "i-heroicons-calendar",
                            class: "w-3.5 h-3.5"
                          }),
                          createTextVNode(" " + toDisplayString(unref(formatDateFR)(tache.date_fin)), 1)
                        ])
                      ])
                    ]);
                  }), 128))
                ]))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<!--]-->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UModal, {
        modelValue: unref(tacheModal),
        "onUpdate:modelValue": ($event) => isRef(tacheModal) ? tacheModal.value = $event : null
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UCard, { class: "rounded-2xl" }, {
              header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<h3 class="font-semibold"${_scopeId2}>Nouvelle t\xE2che</h3>`);
                } else {
                  return [
                    createVNode("h3", { class: "font-semibold" }, "Nouvelle t\xE2che")
                  ];
                }
              }),
              footer: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex justify-end gap-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UButton, {
                    color: "gray",
                    variant: "ghost",
                    onClick: ($event) => tacheModal.value = false
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Annuler`);
                      } else {
                        return [
                          createTextVNode("Annuler")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    color: "blue",
                    loading: unref(tacheApi).loading.value,
                    onClick: createTache
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Cr\xE9er`);
                      } else {
                        return [
                          createTextVNode("Cr\xE9er")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex justify-end gap-2" }, [
                      createVNode(_component_UButton, {
                        color: "gray",
                        variant: "ghost",
                        onClick: ($event) => tacheModal.value = false
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Annuler")
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(_component_UButton, {
                        color: "blue",
                        loading: unref(tacheApi).loading.value,
                        onClick: createTache
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Cr\xE9er")
                        ]),
                        _: 1
                      }, 8, ["loading"])
                    ])
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="p-2 flex flex-col gap-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UFormGroup, {
                    label: "Intitul\xE9",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(tacheForm).intitule,
                          "onUpdate:modelValue": ($event) => unref(tacheForm).intitule = $event,
                          placeholder: "Ex: Pr\xE9parer le rapport",
                          size: "md"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(tacheForm).intitule,
                            "onUpdate:modelValue": ($event) => unref(tacheForm).intitule = $event,
                            placeholder: "Ex: Pr\xE9parer le rapport",
                            size: "md"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="grid grid-cols-2 gap-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UFormGroup, {
                    label: "Date de d\xE9but",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(tacheForm).date_debut,
                          "onUpdate:modelValue": ($event) => unref(tacheForm).date_debut = $event,
                          type: "date",
                          size: "md"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(tacheForm).date_debut,
                            "onUpdate:modelValue": ($event) => unref(tacheForm).date_debut = $event,
                            type: "date",
                            size: "md"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormGroup, {
                    label: "Date de fin",
                    required: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(tacheForm).date_fin,
                          "onUpdate:modelValue": ($event) => unref(tacheForm).date_fin = $event,
                          type: "date",
                          size: "md"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(tacheForm).date_fin,
                            "onUpdate:modelValue": ($event) => unref(tacheForm).date_fin = $event,
                            type: "date",
                            size: "md"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                  _push3(ssrRenderComponent(_component_UFormGroup, { label: "Priorit\xE9" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelect, {
                          modelValue: unref(tacheForm).priorite,
                          "onUpdate:modelValue": ($event) => unref(tacheForm).priorite = $event,
                          options: PRIORITE_OPTIONS,
                          size: "md"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelect, {
                            modelValue: unref(tacheForm).priorite,
                            "onUpdate:modelValue": ($event) => unref(tacheForm).priorite = $event,
                            options: PRIORITE_OPTIONS,
                            size: "md"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_AppSelectSearch, {
                    modelValue: unref(tacheForm).membre_ids,
                    "onUpdate:modelValue": ($event) => unref(tacheForm).membre_ids = $event,
                    options: unref(membreOptions),
                    multiple: true,
                    loading: unref(membreApi).loading.value,
                    placeholder: "Rechercher des membres..."
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "p-2 flex flex-col gap-4" }, [
                      createVNode(_component_UFormGroup, {
                        label: "Intitul\xE9",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(tacheForm).intitule,
                            "onUpdate:modelValue": ($event) => unref(tacheForm).intitule = $event,
                            placeholder: "Ex: Pr\xE9parer le rapport",
                            size: "md"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                        createVNode(_component_UFormGroup, {
                          label: "Date de d\xE9but",
                          required: ""
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(tacheForm).date_debut,
                              "onUpdate:modelValue": ($event) => unref(tacheForm).date_debut = $event,
                              type: "date",
                              size: "md"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormGroup, {
                          label: "Date de fin",
                          required: ""
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(tacheForm).date_fin,
                              "onUpdate:modelValue": ($event) => unref(tacheForm).date_fin = $event,
                              type: "date",
                              size: "md"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode(_component_UFormGroup, { label: "Priorit\xE9" }, {
                        default: withCtx(() => [
                          createVNode(_component_USelect, {
                            modelValue: unref(tacheForm).priorite,
                            "onUpdate:modelValue": ($event) => unref(tacheForm).priorite = $event,
                            options: PRIORITE_OPTIONS,
                            size: "md"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_AppSelectSearch, {
                        modelValue: unref(tacheForm).membre_ids,
                        "onUpdate:modelValue": ($event) => unref(tacheForm).membre_ids = $event,
                        options: unref(membreOptions),
                        multiple: true,
                        loading: unref(membreApi).loading.value,
                        placeholder: "Rechercher des membres..."
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "loading"])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UCard, { class: "rounded-2xl" }, {
                header: withCtx(() => [
                  createVNode("h3", { class: "font-semibold" }, "Nouvelle t\xE2che")
                ]),
                footer: withCtx(() => [
                  createVNode("div", { class: "flex justify-end gap-2" }, [
                    createVNode(_component_UButton, {
                      color: "gray",
                      variant: "ghost",
                      onClick: ($event) => tacheModal.value = false
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Annuler")
                      ]),
                      _: 1
                    }, 8, ["onClick"]),
                    createVNode(_component_UButton, {
                      color: "blue",
                      loading: unref(tacheApi).loading.value,
                      onClick: createTache
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Cr\xE9er")
                      ]),
                      _: 1
                    }, 8, ["loading"])
                  ])
                ]),
                default: withCtx(() => [
                  createVNode("div", { class: "p-2 flex flex-col gap-4" }, [
                    createVNode(_component_UFormGroup, {
                      label: "Intitul\xE9",
                      required: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(tacheForm).intitule,
                          "onUpdate:modelValue": ($event) => unref(tacheForm).intitule = $event,
                          placeholder: "Ex: Pr\xE9parer le rapport",
                          size: "md"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                      createVNode(_component_UFormGroup, {
                        label: "Date de d\xE9but",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(tacheForm).date_debut,
                            "onUpdate:modelValue": ($event) => unref(tacheForm).date_debut = $event,
                            type: "date",
                            size: "md"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormGroup, {
                        label: "Date de fin",
                        required: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(tacheForm).date_fin,
                            "onUpdate:modelValue": ($event) => unref(tacheForm).date_fin = $event,
                            type: "date",
                            size: "md"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode(_component_UFormGroup, { label: "Priorit\xE9" }, {
                      default: withCtx(() => [
                        createVNode(_component_USelect, {
                          modelValue: unref(tacheForm).priorite,
                          "onUpdate:modelValue": ($event) => unref(tacheForm).priorite = $event,
                          options: PRIORITE_OPTIONS,
                          size: "md"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_AppSelectSearch, {
                      modelValue: unref(tacheForm).membre_ids,
                      "onUpdate:modelValue": ($event) => unref(tacheForm).membre_ids = $event,
                      options: unref(membreOptions),
                      multiple: true,
                      loading: unref(membreApi).loading.value,
                      placeholder: "Rechercher des membres..."
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "loading"])
                  ])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dossiers/[dossierId].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_dossierId_-COWhfVVP.mjs.map
