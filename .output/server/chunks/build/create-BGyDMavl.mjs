import { _ as _sfc_main$1 } from './PageHeader-NxcDUFJW.mjs';
import __nuxt_component_1 from './SelectMenu-DNGe_AeQ.mjs';
import __nuxt_component_2 from './Input-50cchghJ.mjs';
import { u as useHead, d as __nuxt_component_1$1, n as navigateTo } from './server.mjs';
import { ref, computed, mergeProps, unref, isRef, withCtx, createVNode, toDisplayString, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import './combobox-DW6kaaFu.mjs';
import './form-DsUILy5F.mjs';
import './active-element-history-Cer4cSOw.mjs';
import './micro-task-B6uncIso.mjs';
import './keyboard-BCt0ZeLv.mjs';
import './use-outside-click-BqFFeIfQ.mjs';
import './focus-management-CclPs0xY.mjs';
import './use-resolve-button-type-CCTzT7JK.mjs';
import './calculate-active-index-BN0T2bP2.mjs';
import './hidden-e5tlhUcy.mjs';
import './open-closed-DaveoKA1.mjs';
import './use-text-value-CScX7TKV.mjs';
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
import './usePopper-BrvKSG9Z.mjs';
import './useFormGroup-BPckFnLf.mjs';
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
      title: "Nouvelle Fonction - Sagar Revolution"
    });
    const loading = ref(false);
    const errorRequest = ref(null);
    const selectedEntite = ref(null);
    const formErrors = ref({});
    const showDebug = ref(false);
    const debugInfo = ref({});
    const form = ref({
      code: "",
      // ⚠️ Champ "code" (pas "sigle")
      libelle: "",
      // ⚠️ Champ "libelle"
      entite_id: "",
      // ⚠️ Champ "entite_id" (STRING selon votre curl)
      description: ""
      // Optionnel
    });
    const entites = ref([]);
    const entitesOptions = ref([]);
    const handleEntiteSelect = (selectedOption) => {
      console.log("Entit\xE9 s\xE9lectionn\xE9e:", selectedOption);
      if (selectedOption && selectedOption.id) {
        form.value.entite_id = String(selectedOption.id);
        selectedEntite.value = selectedOption;
        delete formErrors.value.entite_id;
      } else {
        form.value.entite_id = "";
        selectedEntite.value = null;
      }
    };
    const getInitials = (text) => {
      if (!text) return "";
      return text.split(" ").map((word) => word.charAt(0)).join("").toUpperCase().substring(0, 2);
    };
    const getTypeLabel = (typeValue) => {
      const typeLabels = {
        direction: "Direction",
        service: "Service",
        bureau: "Bureau",
        cellule: "Cellule"
      };
      return typeLabels[typeValue] || typeValue;
    };
    const isFormValid = computed(() => {
      return form.value.entite_id !== "" && form.value.code.trim() !== "" && form.value.libelle.trim() !== "";
    });
    const handleCancel = () => {
      navigateTo("/fonctions");
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_PageHeader = _sfc_main$1;
      const _component_USelectMenu = __nuxt_component_1;
      const _component_UInput = __nuxt_component_2;
      const _component_UButton = __nuxt_component_1$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))}><div class="max-w-7xl mx-auto p-6"><div class="grid grid-cols-1 lg:grid-cols-12 gap-6"><div class="lg:col-span-6"><div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">`);
      _push(ssrRenderComponent(_component_PageHeader, {
        title: "Cr\xE9ation d'une Fonction",
        subtitle: "Gestion des fonctions organisationnelles",
        to: "/fonctions",
        "btn-text": "Retour \xE0 la liste"
      }, null, _parent));
      _push(`<form class="space-y-4"><div><label class="block text-sm font-medium text-gray-700 mb-2"> Entit\xE9 * </label>`);
      _push(ssrRenderComponent(_component_USelectMenu, {
        modelValue: unref(selectedEntite),
        "onUpdate:modelValue": [($event) => isRef(selectedEntite) ? selectedEntite.value = $event : null, handleEntiteSelect],
        options: unref(entitesOptions),
        placeholder: "S\xE9lectionner l'entit\xE9",
        class: "w-full",
        ui: {
          height: "h-[42px]",
          base: "cursor-pointer"
        }
      }, {
        option: withCtx(({ option }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col py-1"${_scopeId}><span class="font-semibold"${_scopeId}>${ssrInterpolate(option.display)}</span><span class="text-xs text-gray-500 truncate"${_scopeId}>${ssrInterpolate(option.description || option.libelle)}</span></div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-col py-1" }, [
                createVNode("span", { class: "font-semibold" }, toDisplayString(option.display), 1),
                createVNode("span", { class: "text-xs text-gray-500 truncate" }, toDisplayString(option.description || option.libelle), 1)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(formErrors).entite_id) {
        _push(`<p class="text-red-600 text-sm font-bold mt-1">${ssrInterpolate(unref(formErrors).entite_id)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Sigle * </label>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(form).code,
        "onUpdate:modelValue": ($event) => unref(form).code = $event,
        placeholder: "Entrez le code de la fonction (ex: DG, RH)",
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
        placeholder: "Entrez le libell\xE9 complet",
        class: "w-full h-12",
        disabled: unref(loading)
      }, null, _parent));
      if (unref(formErrors).libelle) {
        _push(`<p class="text-red-600 text-sm font-bold mt-1">${ssrInterpolate(unref(formErrors).libelle)}</p>`);
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
      if (unref(showDebug)) {
        _push(`<div class="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg"><h4 class="text-sm font-semibold text-gray-800 mb-2">Debug Info:</h4><pre class="text-xs text-gray-600 overflow-auto">${ssrInterpolate(unref(debugInfo))}</pre></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</form></div></div><div class="lg:col-span-6"><div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"><h3 class="text-lg font-semibold text-gray-900 mb-4">Informations sur les fonctions</h3><div class="space-y-4"><div class="bg-blue-50 border border-blue-200 rounded-lg p-4"><h4 class="font-medium text-blue-800 mb-2">\xC0 propos des fonctions</h4><p class="text-sm text-blue-700"> Les fonctions repr\xE9sentent les diff\xE9rents postes et r\xF4les au sein d&#39;une entit\xE9. Chaque fonction est rattach\xE9e \xE0 une entit\xE9 sp\xE9cifique et d\xE9finit les responsabilit\xE9s associ\xE9es. </p></div>`);
      if (unref(entites).length > 0) {
        _push(`<div class="bg-emerald-50 border border-emerald-200 rounded-lg p-4"><h4 class="font-medium text-emerald-800 mb-2">Entit\xE9s disponibles (${ssrInterpolate(unref(entites).length)})</h4><div class="space-y-2 max-h-40 overflow-y-auto"><!--[-->`);
        ssrRenderList(unref(entites).slice(0, 10), (entite) => {
          _push(`<div class="flex items-center justify-between text-sm p-2 hover:bg-emerald-100 rounded"><div class="flex flex-col flex-1 min-w-0"><div class="flex items-center space-x-2"><span class="font-semibold text-emerald-800">${ssrInterpolate(entite.code || entite.sigle)}</span><span class="${ssrRenderClass([entite.statut === "inactif" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800", "px-1.5 py-0.5 text-xs rounded"])}">${ssrInterpolate(entite.statut || "actif")}</span></div><span class="text-xs text-gray-600 truncate">${ssrInterpolate(entite.libelle || entite.nom)}</span></div><div class="flex items-center space-x-2 ml-2"><span class="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">${ssrInterpolate(getTypeLabel(entite.type_entite || entite.type))}</span></div></div>`);
        });
        _push(`<!--]-->`);
        if (unref(entites).length > 10) {
          _push(`<p class="text-xs text-emerald-600 mt-2 text-center"> ... et ${ssrInterpolate(unref(entites).length - 10)} autres entit\xE9s </p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4"><h4 class="font-medium text-yellow-800 mb-2">Aucune entit\xE9 disponible</h4><p class="text-sm text-yellow-700"> Vous devez cr\xE9er une entit\xE9 avant de cr\xE9er une fonction. </p></div>`);
      }
      if (unref(selectedEntite)) {
        _push(`<div class="bg-indigo-50 border border-indigo-200 rounded-lg p-4"><h4 class="font-medium text-indigo-800 mb-2">Entit\xE9 s\xE9lectionn\xE9e</h4><div class="flex items-center space-x-3"><div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center"><span class="text-indigo-600 font-bold">${ssrInterpolate(getInitials(unref(selectedEntite).display))}</span></div><div class="flex-1"><p class="font-semibold text-indigo-900">${ssrInterpolate(unref(selectedEntite).display)}</p><p class="text-xs text-indigo-700">${ssrInterpolate(getTypeLabel(unref(selectedEntite).type))} \u2022 ${ssrInterpolate(unref(selectedEntite).statut === "actif" ? "Actif" : "Inactif")}</p></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/fonctions/create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=create-BGyDMavl.mjs.map
