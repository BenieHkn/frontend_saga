import __nuxt_component_2 from './Button-D4Pv8nAk.mjs';
import __nuxt_component_2$1 from './Input-3IU7zE8e.mjs';
import { ref, computed, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderList } from 'vue/server-renderer';
import { u as useHead, n as navigateTo } from './server.mjs';
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
import './Icon-BEWG_Jy9.mjs';
import './index-DJmPz9HS.mjs';
import './tooltip-lourJnw0.mjs';
import './useButtonGroup-DPIFBtCe.mjs';
import './button-Bz5rwL6o.mjs';
import './useFormGroup-2eEELX00.mjs';
import './index-BLXEZ1Ia.mjs';
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
      title: "Nouvelle Entit\xE9 - Sagar Revolution"
    });
    const loading = ref(false);
    const errorRequest = ref(null);
    const selectedParent = ref(null);
    const formErrors = ref({});
    const searchEntiteParent = ref("");
    const filteredEntites = ref([]);
    const showEntiteDropdown = ref(false);
    const form = ref({
      code: "",
      // STRING - obligatoire
      libelle: "",
      // STRING - obligatoire
      fonction: "",
      // STRING - optionnel
      parent_entite_id: null,
      // UNSIGNEDBIGINTEGER - optionnel
      is_critique: false
      // BOOLEAN - par défaut false
    });
    const entitesList = ref([]);
    const isFormValid = computed(() => {
      return form.value.code.trim() !== "" && form.value.libelle.trim() !== "";
    });
    const handleCancel = () => {
      navigateTo("/entites");
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_UButton = __nuxt_component_2;
      const _component_UInput = __nuxt_component_2$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))}><div class="max-w-7xl mx-auto p-6"><div class="grid grid-cols-1 lg:grid-cols-12 gap-6"><div class="lg:col-span-6"><div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"><div class="flex justify-end">`);
      _push(ssrRenderComponent(_component_UButton, {
        to: "/entites",
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
      _push(`</div><form class="space-y-4"><div><label class="block text-sm font-medium text-gray-700 mb-2"> Sigle * </label>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(form).code,
        "onUpdate:modelValue": ($event) => unref(form).code = $event,
        placeholder: "Entrez le code de l'entit\xE9 (ex: DIR, DRH)",
        class: "w-full h-12",
        disabled: unref(loading),
        onInput: ($event) => unref(form).code = unref(form).code.toUpperCase()
      }, null, _parent));
      if (unref(formErrors).code) {
        _push(`<p class="text-red-600 text-sm font-bold mt-1">${ssrInterpolate(unref(formErrors).code)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Libell\xE9 * </label>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(form).libelle,
        "onUpdate:modelValue": ($event) => unref(form).libelle = $event,
        placeholder: "Entrez le libell\xE9 complet de l'entit\xE9",
        class: "w-full h-12",
        disabled: unref(loading)
      }, null, _parent));
      if (unref(formErrors).libelle) {
        _push(`<p class="text-red-600 text-sm font-bold mt-1">${ssrInterpolate(unref(formErrors).libelle)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Fonction </label>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(form).fonction,
        "onUpdate:modelValue": ($event) => unref(form).fonction = $event,
        placeholder: "Entrez la fonction de l'entit\xE9 (optionnel)",
        class: "w-full h-12",
        disabled: unref(loading)
      }, null, _parent));
      if (unref(formErrors).fonction) {
        _push(`<p class="text-red-600 text-sm font-bold mt-1">${ssrInterpolate(unref(formErrors).fonction)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Entit\xE9 Parent </label><div class="relative"><div class="relative"><input${ssrRenderAttr("value", unref(searchEntiteParent))} type="text" placeholder="Rechercher une entit\xE9 parent..." class="w-full h-12 px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""}><svg class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div>`);
      if (unref(showEntiteDropdown) && unref(filteredEntites).length > 0) {
        _push(`<div class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"><!--[-->`);
        ssrRenderList(unref(filteredEntites), (entite) => {
          _push(`<div class="px-4 py-3 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"><div class="flex flex-col"><div class="flex items-center space-x-2"><span class="font-semibold text-gray-900">${ssrInterpolate(entite.code)}</span>`);
          if (entite.is_critique) {
            _push(`<span class="px-1.5 py-0.5 text-xs rounded bg-red-100 text-red-800"> Critique </span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><span class="text-sm text-gray-600 mt-0.5">${ssrInterpolate(entite.libelle)}</span>`);
          if (entite.fonction) {
            _push(`<span class="text-xs text-gray-500 italic mt-0.5">${ssrInterpolate(entite.fonction)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(showEntiteDropdown) && unref(searchEntiteParent) && unref(filteredEntites).length === 0) {
        _push(`<div class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-4"><p class="text-sm text-gray-500 text-center">Aucune entit\xE9 ne correspond \xE0 votre recherche</p></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(selectedParent)) {
        _push(`<div class="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-md"><div class="flex flex-col"><span class="text-sm font-medium text-blue-900">${ssrInterpolate(unref(selectedParent).code)} - ${ssrInterpolate(unref(selectedParent).libelle)}</span>`);
        if (unref(selectedParent).fonction) {
          _push(`<span class="text-xs text-blue-700">${ssrInterpolate(unref(selectedParent).fonction)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><button type="button" class="text-blue-600 hover:text-blue-800 ml-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><p class="text-xs text-gray-500 mt-1">Tapez pour rechercher et s\xE9lectionner une entit\xE9 parent (optionnel)</p>`);
      if (unref(formErrors).parent_entite_id) {
        _push(`<p class="text-red-600 text-sm font-bold mt-1">${ssrInterpolate(unref(formErrors).parent_entite_id)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex justify-center space-x-4 pt-6 border-t border-gray-200">`);
      _push(ssrRenderComponent(_component_UButton, {
        type: "button",
        onClick: handleCancel,
        color: "gray",
        variant: "outline",
        disabled: unref(loading)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` ANNULER `);
          } else {
            return [
              createTextVNode(" ANNULER ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        disabled: !unref(isFormValid) || unref(loading),
        type: "submit",
        class: "bg-gradient-to-br from-emerald-800 to-blue-800 text-white dark:text-white",
        loading: unref(loading)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` SAUVEGARDER `);
          } else {
            return [
              createTextVNode(" SAUVEGARDER ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
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
      _push(`</form></div></div><div class="lg:col-span-6"><div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"><h3 class="text-lg font-semibold text-gray-900 mb-4">Informations sur les entit\xE9s</h3><div class="space-y-4"><div class="bg-blue-50 border border-blue-200 rounded-lg p-4"><h4 class="font-medium text-blue-800 mb-2">\xC0 propos des entit\xE9s</h4><p class="text-sm text-blue-700"> Les entit\xE9s repr\xE9sentent les diff\xE9rentes unit\xE9s organisationnelles de votre structure. Chaque entit\xE9 peut avoir une entit\xE9 parent pour \xE9tablir une hi\xE9rarchie claire. </p></div><div class="bg-purple-50 border border-purple-200 rounded-lg p-4"><h4 class="font-medium text-purple-800 mb-2">Guide des champs</h4><ul class="space-y-2 text-sm text-purple-700"><li><strong>Code :</strong> Identifiant unique court (ex: DIR, DRH)</li><li><strong>Libell\xE9 :</strong> Nom complet de l&#39;entit\xE9</li><li><strong>Fonction :</strong> R\xF4le ou mission de l&#39;entit\xE9 (optionnel)</li><li><strong>Entit\xE9 Parent :</strong> Position dans la hi\xE9rarchie (optionnel)</li><li><strong>Critique :</strong> Entit\xE9 essentielle au fonctionnement</li></ul></div>`);
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
        _push(`<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4"><h4 class="font-medium text-yellow-800 mb-2">Aucune entit\xE9 disponible</h4><p class="text-sm text-yellow-700"> Cette entit\xE9 sera la premi\xE8re de la hi\xE9rarchie. </p></div>`);
      }
      if (unref(form).code || unref(form).libelle) {
        _push(`<div class="bg-slate-50 border border-slate-200 rounded-lg p-4"><h4 class="font-medium text-slate-800 mb-2">Aper\xE7u</h4><div class="space-y-2 text-sm">`);
        if (unref(form).code) {
          _push(`<div class="flex items-center space-x-2"><span class="text-slate-600">Code:</span><span class="font-semibold text-slate-900">${ssrInterpolate(unref(form).code)}</span></div>`);
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
        if (unref(selectedParent)) {
          _push(`<div class="flex items-center space-x-2"><span class="text-slate-600">Entit\xE9 parent:</span><span class="font-semibold text-slate-900">${ssrInterpolate(unref(selectedParent).code)} - ${ssrInterpolate(unref(selectedParent).libelle)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(form).is_critique) {
          _push(`<div class="flex items-center space-x-2"><span class="px-2 py-1 text-xs rounded bg-red-100 text-red-800 font-semibold"> \u{1F534} Entit\xE9 critique </span></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/entites/create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=create-BRhnWyR5.mjs.map
