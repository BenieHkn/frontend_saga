import { u as useHead, d as __nuxt_component_1 } from './server.mjs';
import { ref, computed, watch, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrRenderList, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
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

const _sfc_main = {
  __name: "create",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Nouveau Utilisateur - Sagar Revolution"
    });
    const loading = ref(false);
    const loadingInitialData = ref(true);
    ref("");
    const errorRequest = ref(null);
    const form = ref({
      matricule: "",
      nom: "",
      prenoms: "",
      email: "",
      telephone: "",
      datePriseService: "",
      estAdministrateur: false,
      statut: true,
      estResponsable: false,
      entite_id: ""
    });
    const errors = ref([]);
    ref([]);
    const searchEntite = ref("");
    const filteredEntites = ref([]);
    const showEntiteDropdown = ref(false);
    const selectedEntite = ref(null);
    const isFormValid = computed(() => {
      return form.value.matricule.trim() !== "" && form.value.nom.trim() !== "" && form.value.prenoms.trim() !== "" && form.value.email.trim() !== "" && form.value.telephone.trim() !== "" && form.value.entite_id !== "" && form.value.entite_id !== null;
    });
    watch(() => form.value.estResponsable, (newValue) => {
      console.log("\u{1F504} Changement de type utilisateur:", newValue);
    });
    watch(() => form.value.entite_id, (newValue) => {
      console.log("\u2705 Entit\xE9 s\xE9lectionn\xE9e:", newValue);
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_UButton = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))}><div class="max-w-7xl mx-auto p-6"><div class="grid grid-cols-1 lg:grid-cols-12 gap-6"><div class="lg:col-span-12"><div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"><div class="flex justify-end">`);
      _push(ssrRenderComponent(_component_UButton, {
        to: "/utilisateurs",
        icon: "i-heroicons-arrow-left",
        color: "green",
        variant: "soft"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Retour \xE0 la liste `);
          } else {
            return [
              createTextVNode(" Retour \xE0 la liste ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(loadingInitialData)) {
        _push(`<div class="flex flex-col items-center justify-center py-20 gap-4 text-slate-500"><div class="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div><span class="text-sm font-medium">Chargement des donn\xE9es... </span></div>`);
      } else {
        _push(`<form class="space-y-4 mt-6"><div class="flex items-center gap-8 pt-4 border-t border-gray-100"><div class="flex items-center gap-2"><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(form).estResponsable) ? ssrLooseContain(unref(form).estResponsable, null) : unref(form).estResponsable) ? " checked" : ""} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"><label class="text-sm font-medium text-gray-700"> Est un Responsable ? </label></div></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Entit\xE9 <span class="text-red-600">*</span></label><div class="relative"><div class="relative"><input${ssrRenderAttr("value", unref(searchEntite))} type="text" placeholder="Rechercher une entit\xE9..." class="w-full h-12 px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"><svg class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div>`);
        if (unref(showEntiteDropdown) && unref(filteredEntites).length > 0) {
          _push(`<div class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"><!--[-->`);
          ssrRenderList(unref(filteredEntites), (entite) => {
            _push(`<div class="px-4 py-3 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"><div class="flex flex-col"><span class="font-semibold text-gray-900">${ssrInterpolate(entite.libelle)}</span>`);
            if (entite.code) {
              _push(`<span class="text-xs text-gray-500 mt-0.5">Code: ${ssrInterpolate(entite.code)}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(selectedEntite)) {
          _push(`<div class="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-md"><span class="text-sm font-medium text-blue-900">${ssrInterpolate(unref(selectedEntite).libelle)}</span><button type="button" class="text-blue-600 hover:text-blue-800"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><p class="text-xs text-gray-500 mt-1">Tapez pour rechercher et s\xE9lectionner une entit\xE9</p></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Matricule <span class="text-red-600">*</span></label><input${ssrRenderAttr("value", unref(form).matricule)} type="text" placeholder="Matricule" class="w-full h-12 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-2"> Nom <span class="text-red-600">*</span></label><input${ssrRenderAttr("value", unref(form).nom)} type="text" placeholder="Nom" class="w-full h-12 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Pr\xE9noms <span class="text-red-600">*</span></label><input${ssrRenderAttr("value", unref(form).prenoms)} type="text" placeholder="Pr\xE9noms" class="w-full h-12 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-2"> Email <span class="text-red-600">*</span></label><input${ssrRenderAttr("value", unref(form).email)} type="email" placeholder="Email" class="w-full h-12 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> T\xE9l\xE9phone <span class="text-red-600">*</span></label><input${ssrRenderAttr("value", unref(form).telephone)} type="text" placeholder="T\xE9l\xE9phone" class="w-full h-12 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></div></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Date de Prise de Service </label><input${ssrRenderAttr("value", unref(form).datePriseService)} type="date" class="w-full h-12 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></div><div class="flex items-center gap-8 pt-4 border-t border-gray-100"><div class="flex items-center gap-2"><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(form).estAdministrateur) ? ssrLooseContain(unref(form).estAdministrateur, null) : unref(form).estAdministrateur) ? " checked" : ""} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"><label class="text-sm font-medium text-gray-700"> Est un Administrateur ? </label></div><div class="flex items-center gap-2"><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(form).statut) ? ssrLooseContain(unref(form).statut, null) : unref(form).statut) ? " checked" : ""} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"><label class="text-sm font-medium text-gray-700"> Compte actif </label></div></div><div class="flex justify-center space-x-4 pt-6 border-t border-gray-200"><button type="button" class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"> ANNULER </button><button${ssrIncludeBooleanAttr(!unref(isFormValid) || unref(loading)) ? " disabled" : ""} type="submit" class="${ssrRenderClass([{ "opacity-50 cursor-not-allowed": !unref(isFormValid) || unref(loading) }, "px-6 py-2 bg-gradient-to-br from-emerald-800 to-blue-800 text-white rounded-md hover:from-emerald-900 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"])}">`);
        if (unref(loading)) {
          _push(`<span>Chargement...</span>`);
        } else {
          _push(`<span>SAUVEGARDER</span>`);
        }
        _push(`</button></div>`);
        if (unref(errors).length > 0) {
          _push(`<div class="mt-4"><div class="bg-red-50 border border-red-200 rounded-lg p-4"><h4 class="text-sm font-bold text-red-900 mb-2">Erreurs de validation :</h4><ul class="list-disc list-inside text-sm text-red-600"><!--[-->`);
          ssrRenderList(unref(errors), (error, index) => {
            _push(`<li>${ssrInterpolate(error)}</li>`);
          });
          _push(`<!--]--></ul></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(errorRequest)) {
          _push(`<div class="mt-4"><div class="bg-red-50 border border-red-200 rounded-lg p-4"><p class="text-sm font-bold text-red-900"> Erreur serveur : </p><p class="text-sm text-red-600 mt-1">${ssrInterpolate(unref(errorRequest).message || ((_a = unref(errorRequest).data) == null ? void 0 : _a.message) || "Une erreur est survenue")}</p></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</form>`);
      }
      _push(`</div></div></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/utilisateurs/create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=create-gptI6w4e.mjs.map
