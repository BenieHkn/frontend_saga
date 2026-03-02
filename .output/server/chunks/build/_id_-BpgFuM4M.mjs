import { u as useHead, d as __nuxt_component_1, b as useRuntimeConfig, r as useToast, n as navigateTo } from './server.mjs';
import __nuxt_component_2 from './Input-50cchghJ.mjs';
import __nuxt_component_1$1 from './SelectMenu-DNGe_AeQ.mjs';
import __nuxt_component_3 from './Toggle-Bi5Pwax_.mjs';
import { ref, computed, mergeProps, withCtx, createTextVNode, unref, isRef, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './useFormGroup-BPckFnLf.mjs';
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
import './usePopper-BrvKSG9Z.mjs';
import './description-BSAkQQqZ.mjs';

const _sfc_main = {
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const entiteId = route.params.id;
    const config = useRuntimeConfig();
    useHead({
      title: "Modification Entit\xE9 - Sagar Revolution"
    });
    const loading = ref(false);
    const loadingData = ref(true);
    const loadError = ref(null);
    const errorRequest = ref(null);
    const selectedParent = ref(null);
    const formErrors = ref({});
    const originalData = ref({
      id: null,
      code: "",
      libelle: "",
      fonction: "",
      parent_entite_id: null,
      parent_entite: "",
      is_critique: false,
      created_at: null,
      updated_at: null
    });
    const form = ref({
      code: "",
      libelle: "",
      fonction: "",
      parent_entite_id: null,
      is_critique: false
    });
    const entitesList = ref([]);
    const entitesOptions = ref([]);
    const formatEntitesOptions = (entitesList2, currentId) => {
      return entitesList2.filter((entite) => entite.id !== currentId).map((entite) => ({
        id: entite.id,
        display: `${entite.code} - ${entite.libelle}`,
        code: entite.code,
        libelle: entite.libelle,
        fonction: entite.fonction,
        is_critique: entite.is_critique
      }));
    };
    const handleParentSelect = (selectedOption) => {
      console.log("Entit\xE9 parent s\xE9lectionn\xE9e:", selectedOption);
      if (selectedOption && selectedOption.id) {
        form.value.parent_entite_id = selectedOption.id;
        selectedParent.value = selectedOption;
        delete formErrors.value.parent_entite_id;
      } else {
        form.value.parent_entite_id = null;
        selectedParent.value = null;
      }
    };
    const getInitials = (text) => {
      if (!text) return "";
      return text.split(" ").map((word) => word.charAt(0)).join("").toUpperCase().substring(0, 2);
    };
    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    };
    const hasChanges = computed(() => {
      return form.value.code !== originalData.value.code || form.value.libelle !== originalData.value.libelle || form.value.fonction !== originalData.value.fonction || form.value.parent_entite_id !== originalData.value.parent_entite_id || form.value.is_critique !== originalData.value.is_critique;
    });
    const loadEntiteData = async () => {
      var _a;
      loadingData.value = true;
      loadError.value = null;
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          throw new Error("Token d'authentification manquant");
        }
        console.log("\u{1F504} Chargement de l'entit\xE9 ID:", entiteId);
        const response = await $fetch(`${config.public.apiBase}/entites/${entiteId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
          }
        });
        console.log("\u{1F4E6} R\xE9ponse API:", response);
        const entiteData = response.data || response;
        if (!entiteData || !entiteData.id) {
          throw new Error("Donn\xE9es de l'entit\xE9 introuvables");
        }
        originalData.value = {
          id: entiteData.id,
          code: entiteData.code || "",
          libelle: entiteData.libelle || "",
          fonction: entiteData.fonction || "",
          parent_entite_id: entiteData.parent_entite_id || null,
          parent_entite: entiteData.parent_libelle || ((_a = entiteData.parentEntite) == null ? void 0 : _a.libelle) || "Aucune",
          is_critique: entiteData.is_critique || false,
          created_at: entiteData.created_at,
          updated_at: entiteData.updated_at
        };
        form.value = {
          code: originalData.value.code,
          libelle: originalData.value.libelle,
          fonction: originalData.value.fonction,
          parent_entite_id: originalData.value.parent_entite_id,
          is_critique: originalData.value.is_critique
        };
        console.log("\u2705 Donn\xE9es charg\xE9es:", originalData.value);
        await loadAllEntites();
      } catch (err) {
        console.error("\u274C Erreur chargement:", err);
        loadError.value = err.message || "Erreur lors du chargement de l'entit\xE9";
        if (err.status === 401 || err.statusCode === 401) {
          useToast().add({
            title: "Session expir\xE9e",
            description: "Veuillez vous reconnecter",
            color: "red"
          });
          setTimeout(() => navigateTo("/login"), 1500);
        } else if (err.status === 404 || err.statusCode === 404) {
          useToast().add({
            title: "Entit\xE9 introuvable",
            description: "L'entit\xE9 demand\xE9e n'existe pas",
            color: "red"
          });
          setTimeout(() => navigateTo("/entites"), 1500);
        }
      } finally {
        loadingData.value = false;
      }
    };
    const loadAllEntites = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const response = await $fetch(`${config.public.apiBase}/entites`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
          }
        });
        let entitesData = [];
        if ((response == null ? void 0 : response.data) && Array.isArray(response.data)) {
          entitesData = response.data;
        } else if (Array.isArray(response)) {
          entitesData = response;
        }
        if (entitesData.length > 0) {
          entitesList.value = entitesData.map((entite) => ({
            id: entite.id,
            code: entite.code || "",
            libelle: entite.libelle || "",
            fonction: entite.fonction || "",
            parent_entite_id: entite.parent_entite_id,
            is_critique: entite.is_critique || false
          })).filter((entite) => entite.code);
          entitesOptions.value = formatEntitesOptions(entitesList.value, originalData.value.id);
          if (form.value.parent_entite_id) {
            selectedParent.value = entitesOptions.value.find(
              (opt) => opt.id === form.value.parent_entite_id
            ) || null;
          }
          console.log("\u2705 Entit\xE9s charg\xE9es:", entitesList.value.length);
          console.log("\u{1F4CB} Entit\xE9 parent pr\xE9-s\xE9lectionn\xE9e:", selectedParent.value);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des entit\xE9s:", error);
      }
    };
    const isFormValid = computed(() => {
      return form.value.code.trim() !== "" && form.value.libelle.trim() !== "";
    });
    const handleCancel = () => {
      if (hasChanges.value) {
        if (confirm("Des modifications non sauvegard\xE9es seront perdues. Continuer ?")) {
          navigateTo("/entites");
        }
      } else {
        navigateTo("/entites");
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_UButton = __nuxt_component_1;
      const _component_UInput = __nuxt_component_2;
      const _component_USelectMenu = __nuxt_component_1$1;
      const _component_UToggle = __nuxt_component_3;
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
      _push(`</div>`);
      if (unref(loadingData)) {
        _push(`<div class="flex flex-col items-center justify-center py-20 gap-4 text-slate-500"><div class="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div><span class="text-sm font-medium">Chargement des donn\xE9es...</span></div>`);
      } else if (unref(loadError)) {
        _push(`<div class="p-4 bg-red-50 border border-red-200 rounded-lg"><p class="text-sm text-red-600"><strong>Erreur de chargement :</strong> ${ssrInterpolate(unref(loadError))}</p>`);
        _push(ssrRenderComponent(_component_UButton, {
          onClick: loadEntiteData,
          color: "red",
          variant: "outline",
          size: "sm",
          class: "mt-3"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` R\xE9essayer `);
            } else {
              return [
                createTextVNode(" R\xE9essayer ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<form class="space-y-4"><div><label class="block text-sm font-medium text-gray-700 mb-2"> Code/Sigle * </label>`);
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
        _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Entit\xE9 Parent </label>`);
        _push(ssrRenderComponent(_component_USelectMenu, {
          modelValue: unref(selectedParent),
          "onUpdate:modelValue": [($event) => isRef(selectedParent) ? selectedParent.value = $event : null, handleParentSelect],
          options: unref(entitesOptions),
          placeholder: "S\xE9lectionner l'entit\xE9 parent (optionnel)",
          class: "w-full",
          ui: {
            height: "h-[42px]",
            base: "cursor-pointer"
          }
        }, {
          option: withCtx(({ option }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex flex-col py-1"${_scopeId}><span class="font-semibold"${_scopeId}>${ssrInterpolate(option.display)}</span><span class="text-xs text-gray-500 truncate"${_scopeId}>${ssrInterpolate(option.fonction || option.libelle)}</span></div>`);
            } else {
              return [
                createVNode("div", { class: "flex flex-col py-1" }, [
                  createVNode("span", { class: "font-semibold" }, toDisplayString(option.display), 1),
                  createVNode("span", { class: "text-xs text-gray-500 truncate" }, toDisplayString(option.fonction || option.libelle), 1)
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        if (unref(formErrors).parent_entite_id) {
          _push(`<p class="text-red-600 text-sm font-bold mt-1">${ssrInterpolate(unref(formErrors).parent_entite_id)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div><label class="flex items-center space-x-3 cursor-pointer">`);
        _push(ssrRenderComponent(_component_UToggle, {
          modelValue: unref(form).is_critique,
          "onUpdate:modelValue": ($event) => unref(form).is_critique = $event,
          disabled: unref(loading)
        }, null, _parent));
        _push(`<div><span class="text-sm font-medium text-gray-700">Entit\xE9 critique</span><p class="text-xs text-gray-500">Marquer cette entit\xE9 comme critique dans l&#39;organisation</p></div></label></div>`);
        if (unref(originalData).created_at) {
          _push(`<div class="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600"><div class="grid grid-cols-2 gap-2"><div><span class="font-semibold">Cr\xE9\xE9 le:</span> ${ssrInterpolate(formatDate(unref(originalData).created_at))}</div>`);
          if (unref(originalData).updated_at) {
            _push(`<div><span class="font-semibold">Modifi\xE9 le:</span> ${ssrInterpolate(formatDate(unref(originalData).updated_at))}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex justify-center space-x-4 pt-6 border-t border-gray-200">`);
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
          disabled: !unref(isFormValid) || !unref(hasChanges) || unref(loading),
          type: "submit",
          class: "bg-gradient-to-br from-emerald-800 to-blue-800 text-white dark:text-white",
          loading: unref(loading)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` METTRE \xC0 JOUR `);
            } else {
              return [
                createTextVNode(" METTRE \xC0 JOUR ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
        if (unref(hasChanges)) {
          _push(`<div class="mt-2 text-center"><p class="text-xs text-orange-600 font-semibold"> \u26A0\uFE0F Des modifications ont \xE9t\xE9 effectu\xE9es </p></div>`);
        } else {
          _push(`<!---->`);
        }
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
      _push(`</div></div><div class="lg:col-span-6"><div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"><h3 class="text-lg font-semibold text-gray-900 mb-4">Informations</h3><div class="space-y-4">`);
      if (!unref(loadingData) && unref(originalData).id) {
        _push(`<div class="bg-blue-50 border border-blue-200 rounded-lg p-4"><h4 class="font-medium text-blue-800 mb-3">Donn\xE9es actuelles</h4><div class="space-y-2 text-sm"><div class="flex items-start justify-between"><span class="text-blue-600 font-medium">Code:</span><span class="text-blue-900 font-semibold">${ssrInterpolate(unref(originalData).code)}</span></div><div class="flex items-start justify-between"><span class="text-blue-600 font-medium">Libell\xE9:</span><span class="text-blue-900 text-right">${ssrInterpolate(unref(originalData).libelle)}</span></div>`);
        if (unref(originalData).fonction) {
          _push(`<div class="flex items-start justify-between"><span class="text-blue-600 font-medium">Fonction:</span><span class="text-blue-900 text-right">${ssrInterpolate(unref(originalData).fonction)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex items-start justify-between"><span class="text-blue-600 font-medium">Parent:</span><span class="text-blue-900 text-right">${ssrInterpolate(unref(originalData).parent_entite || "Aucun")}</span></div><div class="flex items-center justify-between"><span class="text-blue-600 font-medium">Statut:</span><span class="${ssrRenderClass([unref(originalData).is_critique ? "bg-red-100 text-red-800" : "bg-slate-100 text-slate-700", "px-2 py-1 text-xs rounded font-semibold"])}">${ssrInterpolate(unref(originalData).is_critique ? "\u{1F534} Critique" : "Normal")}</span></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="bg-purple-50 border border-purple-200 rounded-lg p-4"><h4 class="font-medium text-purple-800 mb-2">Guide de modification</h4><ul class="space-y-2 text-sm text-purple-700"><li><strong>Code :</strong> Identifiant unique (modifiable avec pr\xE9caution)</li><li><strong>Libell\xE9 :</strong> Nom complet de l&#39;entit\xE9</li><li><strong>Fonction :</strong> R\xF4le ou mission (optionnel)</li><li><strong>Parent :</strong> Hi\xE9rarchie organisationnelle</li><li><strong>Critique :</strong> Importance strat\xE9gique</li></ul></div>`);
      if (unref(entitesList).length > 0) {
        _push(`<div class="bg-emerald-50 border border-emerald-200 rounded-lg p-4"><h4 class="font-medium text-emerald-800 mb-2"> Autres entit\xE9s (${ssrInterpolate(unref(entitesList).length - 1)}) </h4><div class="space-y-2 max-h-40 overflow-y-auto"><!--[-->`);
        ssrRenderList(unref(entitesList).filter((e) => e.id !== unref(originalData).id).slice(0, 8), (entite) => {
          _push(`<div class="flex items-center justify-between text-sm p-2 hover:bg-emerald-100 rounded"><div class="flex flex-col flex-1 min-w-0"><div class="flex items-center space-x-2"><span class="font-semibold text-emerald-800">${ssrInterpolate(entite.code)}</span>`);
          if (entite.is_critique) {
            _push(`<span class="px-1.5 py-0.5 text-xs rounded bg-red-100 text-red-800"> Critique </span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><span class="text-xs text-gray-600 truncate">${ssrInterpolate(entite.libelle)}</span></div></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(selectedParent)) {
        _push(`<div class="bg-indigo-50 border border-indigo-200 rounded-lg p-4"><h4 class="font-medium text-indigo-800 mb-2">Entit\xE9 parent s\xE9lectionn\xE9e</h4><div class="flex items-center space-x-3"><div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center"><span class="text-indigo-600 font-bold">${ssrInterpolate(getInitials(unref(selectedParent).display))}</span></div><div class="flex-1"><p class="font-semibold text-indigo-900">${ssrInterpolate(unref(selectedParent).display)}</p>`);
        if (unref(selectedParent).fonction) {
          _push(`<p class="text-xs text-indigo-700">${ssrInterpolate(unref(selectedParent).fonction)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(hasChanges)) {
        _push(`<div class="bg-orange-50 border border-orange-200 rounded-lg p-4"><h4 class="font-medium text-orange-800 mb-2">Modifications en cours</h4><div class="space-y-2 text-sm">`);
        if (unref(form).code !== unref(originalData).code) {
          _push(`<div class="flex items-center space-x-2"><span class="text-orange-600">Code:</span><span class="line-through text-gray-500">${ssrInterpolate(unref(originalData).code)}</span><span class="text-orange-700">\u2192</span><span class="font-semibold text-orange-900">${ssrInterpolate(unref(form).code)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(form).libelle !== unref(originalData).libelle) {
          _push(`<div class="flex items-center space-x-2"><span class="text-orange-600">Libell\xE9:</span><span class="line-through text-gray-500 truncate max-w-[100px]">${ssrInterpolate(unref(originalData).libelle)}</span><span class="text-orange-700">\u2192</span><span class="font-semibold text-orange-900 truncate max-w-[100px]">${ssrInterpolate(unref(form).libelle)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(form).fonction !== unref(originalData).fonction) {
          _push(`<div class="flex items-center space-x-2"><span class="text-orange-600">Fonction:</span><span class="line-through text-gray-500">${ssrInterpolate(unref(originalData).fonction || "Aucune")}</span><span class="text-orange-700">\u2192</span><span class="font-semibold text-orange-900">${ssrInterpolate(unref(form).fonction || "Aucune")}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(form).parent_entite_id !== unref(originalData).parent_entite_id) {
          _push(`<div class="flex items-center space-x-2"><span class="text-orange-600">Parent:</span><span class="font-semibold text-orange-900">Modifi\xE9</span></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(form).is_critique !== unref(originalData).is_critique) {
          _push(`<div class="flex items-center space-x-2"><span class="text-orange-600">Statut:</span><span class="font-semibold text-orange-900">${ssrInterpolate(unref(form).is_critique ? "Devient critique" : "N'est plus critique")}</span></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/entites/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-BpgFuM4M.mjs.map
