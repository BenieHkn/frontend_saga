import __nuxt_component_2 from './Button-D4Pv8nAk.mjs';
import { ref, computed, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrInterpolate, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { u as useHead, v as useRoute } from './server.mjs';
import './Link-SQZY3OU3.mjs';
import './nuxt-link-aS4hYwbM.mjs';
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
import './ohash.D__AXeF1-DqcdtjQw.mjs';
import './link-Bz3Wc5MF.mjs';
import 'pinia';
import 'vue-router';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './Icon-BEWG_Jy9.mjs';
import './index-DJmPz9HS.mjs';
import './tooltip-lourJnw0.mjs';
import './useButtonGroup-DPIFBtCe.mjs';
import './button-Bz5rwL6o.mjs';

const _sfc_main = {
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Modification d'un Point Critique - Sagar Revolution"
    });
    const route = useRoute();
    route.params.id;
    const loading = ref(false);
    const loadingInitial = ref(true);
    const errorRequest = ref(null);
    const formErrors = ref({});
    ref("");
    const form = ref({
      id: null,
      code: "",
      libelle: "",
      fonction: "",
      parent_entite_id: null
    });
    const entitesList = ref([]);
    const isFormValid = computed(() => {
      return form.value.code.trim() !== "" && form.value.libelle.trim() !== "";
    });
    const selectedParentName = computed(() => {
      if (!form.value.parent_entite_id) return null;
      const parent = entitesList.value.find((e) => e.id === form.value.parent_entite_id);
      return parent ? `${parent.code} - ${parent.libelle}` : null;
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_UButton = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))}><div class="max-w-7xl mx-auto p-6"><div class="grid grid-cols-1 lg:grid-cols-12 gap-6"><div class="lg:col-span-6"><div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"><div class="flex justify-end">`);
      _push(ssrRenderComponent(_component_UButton, {
        to: "/point-critique",
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
      if (unref(loadingInitial)) {
        _push(`<div class="flex flex-col items-center justify-center py-20 gap-4 text-slate-500"><div class="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div><span class="text-sm font-medium">Chargement des donn\xE9es...</span></div>`);
      } else {
        _push(`<form class="space-y-4 mt-6"><div><label class="block text-sm font-medium text-gray-700 mb-2"> Sigle * </label><input${ssrRenderAttr("value", unref(form).code)} type="text" placeholder="Entrez le code de l&#39;entit\xE9 (ex: DIR, DRH)" class="w-full h-12 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""}>`);
        if (unref(formErrors).code) {
          _push(`<p class="text-red-600 text-sm font-bold mt-1">${ssrInterpolate(unref(formErrors).code)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Libell\xE9 * </label><input${ssrRenderAttr("value", unref(form).libelle)} type="text" placeholder="Entrez le libell\xE9 complet de l&#39;entit\xE9" class="w-full h-12 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""}>`);
        if (unref(formErrors).libelle) {
          _push(`<p class="text-red-600 text-sm font-bold mt-1">${ssrInterpolate(unref(formErrors).libelle)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Fonction </label><input${ssrRenderAttr("value", unref(form).fonction)} type="text" placeholder="Entrez la fonction de l&#39;entit\xE9 (optionnel)" class="w-full h-12 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""}>`);
        if (unref(formErrors).fonction) {
          _push(`<p class="text-red-600 text-sm font-bold mt-1">${ssrInterpolate(unref(formErrors).fonction)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Entit\xE9 Parent </label><select class="w-full h-12 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""}><option${ssrRenderAttr("value", null)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).parent_entite_id) ? ssrLooseContain(unref(form).parent_entite_id, null) : ssrLooseEqual(unref(form).parent_entite_id, null)) ? " selected" : ""}>S\xE9lectionner l&#39;entit\xE9 parent (optionnel)</option><!--[-->`);
        ssrRenderList(unref(entitesList), (entite) => {
          _push(`<option${ssrRenderAttr("value", entite.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).parent_entite_id) ? ssrLooseContain(unref(form).parent_entite_id, entite.id) : ssrLooseEqual(unref(form).parent_entite_id, entite.id)) ? " selected" : ""}>${ssrInterpolate(entite.code)} - ${ssrInterpolate(entite.libelle)}</option>`);
        });
        _push(`<!--]--></select>`);
        if (unref(formErrors).parent_entite_id) {
          _push(`<p class="text-red-600 text-sm font-bold mt-1">${ssrInterpolate(unref(formErrors).parent_entite_id)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="flex justify-center space-x-4 pt-6 border-t border-gray-200"><button type="button" class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""}> ANNULER </button><button${ssrIncludeBooleanAttr(!unref(isFormValid) || unref(loading)) ? " disabled" : ""} type="submit" class="${ssrRenderClass([{ "opacity-50 cursor-not-allowed": !unref(isFormValid) || unref(loading) }, "px-6 py-2 bg-gradient-to-br from-emerald-800 to-blue-800 text-white rounded-md hover:from-emerald-900 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"])}">`);
        if (unref(loading)) {
          _push(`<span>Chargement...</span>`);
        } else {
          _push(`<span>METTRE \xC0 JOUR</span>`);
        }
        _push(`</button></div>`);
        if (Object.keys(unref(formErrors)).length > 0) {
          _push(`<div class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"><h4 class="text-sm font-semibold text-red-800 mb-2">Erreurs de validation :</h4><ul class="list-disc list-inside text-sm text-red-600"><!--[-->`);
          ssrRenderList(unref(formErrors), (error, field) => {
            _push(`<li>${ssrInterpolate(error)}</li>`);
          });
          _push(`<!--]--></ul></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(errorRequest)) {
          _push(`<div class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"><p class="text-sm text-red-600"><strong>Erreur serveur :</strong> ${ssrInterpolate(unref(errorRequest).message || ((_a = unref(errorRequest).data) == null ? void 0 : _a.message) || "Une erreur est survenue")}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</form>`);
      }
      _push(`</div></div><div class="lg:col-span-6"><div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"><h3 class="text-lg font-semibold text-gray-900 mb-4">Informations sur les points critiques</h3><div class="space-y-4"><div class="bg-blue-50 border border-blue-200 rounded-lg p-4"><h4 class="font-medium text-blue-800 mb-2">\xC0 propos des points critiques</h4><p class="text-sm text-blue-700"> Les points critiques sont des entit\xE9s essentielles au fonctionnement de votre organisation. Ils n\xE9cessitent une attention particuli\xE8re et une gestion rigoureuse. </p></div><div class="bg-purple-50 border border-purple-200 rounded-lg p-4"><h4 class="font-medium text-purple-800 mb-2">Guide des champs</h4><ul class="space-y-2 text-sm text-purple-700"><li><strong>Sigle :</strong> Identifiant unique court (ex: DIR, DRH)</li><li><strong>Libell\xE9 :</strong> Nom complet du point critique</li><li><strong>Fonction :</strong> R\xF4le ou mission du point critique (optionnel)</li><li><strong>Entit\xE9 Parent :</strong> Position dans la hi\xE9rarchie (optionnel)</li></ul></div>`);
      if (unref(form).code || unref(form).libelle) {
        _push(`<div class="bg-slate-50 border border-slate-200 rounded-lg p-4"><h4 class="font-medium text-slate-800 mb-2">Aper\xE7u des modifications</h4><div class="space-y-2 text-sm">`);
        if (unref(form).code) {
          _push(`<div class="flex items-center space-x-2"><span class="text-slate-600">Sigle:</span><span class="font-semibold text-slate-900">${ssrInterpolate(unref(form).code)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(form).libelle) {
          _push(`<div class="flex items-center space-x-2"><span class="text-slate-600">Libell\xE9:</span><span class="font-semibold text-slate-900">${ssrInterpolate(unref(form).libelle)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(form).fonction) {
          _push(`<div class="flex items-center space-x-2"><span class="text-slate-600">Fonction:</span><span class="font-semibold text-slate-900">${ssrInterpolate(unref(form).fonction)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(selectedParentName)) {
          _push(`<div class="flex items-center space-x-2"><span class="text-slate-600">Entit\xE9 parent:</span><span class="font-semibold text-slate-900">${ssrInterpolate(unref(selectedParentName))}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(entitesList).length > 0) {
        _push(`<div class="bg-emerald-50 border border-emerald-200 rounded-lg p-4"><h4 class="font-medium text-emerald-800 mb-2">Entit\xE9s disponibles (${ssrInterpolate(unref(entitesList).length)})</h4><div class="space-y-2 max-h-40 overflow-y-auto"><!--[-->`);
        ssrRenderList(unref(entitesList).slice(0, 10), (entite) => {
          _push(`<div class="flex items-center justify-between text-sm p-2 hover:bg-emerald-100 rounded"><div class="flex flex-col flex-1 min-w-0"><div class="flex items-center space-x-2"><span class="font-semibold text-emerald-800">${ssrInterpolate(entite.code)}</span>`);
          if (entite.is_critique) {
            _push(`<span class="px-1.5 py-0.5 text-xs rounded bg-red-100 text-red-800"> Critique </span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><span class="text-xs text-gray-600 truncate">${ssrInterpolate(entite.libelle)}</span>`);
          if (entite.fonction) {
            _push(`<span class="text-xs text-gray-500 italic truncate">${ssrInterpolate(entite.fonction)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        });
        _push(`<!--]-->`);
        if (unref(entitesList).length > 10) {
          _push(`<p class="text-xs text-emerald-600 mt-2 text-center"> ... et ${ssrInterpolate(unref(entitesList).length - 10)} autres entit\xE9s </p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/point-critique/update/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-BpyPFI_v.mjs.map
