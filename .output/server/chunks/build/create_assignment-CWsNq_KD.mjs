import { u as useHead, d as __nuxt_component_1, n as navigateTo } from './server.mjs';
import __nuxt_component_1$1 from './SelectMenu-DNGe_AeQ.mjs';
import __nuxt_component_2 from './Input-50cchghJ.mjs';
import { ref, computed, watch, mergeProps, withCtx, createTextVNode, unref, createVNode, createBlock, createCommentVNode, toDisplayString, openBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseEqual } from 'vue/server-renderer';
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
import './useFormGroup-BPckFnLf.mjs';

const _sfc_main = {
  __name: "create_assignment",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({ title: "Assignation Point Critique" });
    const loading = ref(false);
    const loadingInitial = ref(true);
    const loadingUsers = ref(false);
    const loadingPointsCritiques = ref(false);
    ref(null);
    const showSuccessModal = ref(false);
    ref(null);
    const selectedFile = ref(null);
    const users = ref([]);
    const pointsCritiques = ref([]);
    const errors = ref([]);
    const assignationType = ref("fonction");
    const form = ref({
      user_id: null,
      entite_id: null,
      date_debut: "",
      date_fin: "",
      actif: true,
      is_interim: false
    });
    const isFormValid = computed(
      () => form.value.user_id !== null && form.value.entite_id !== null
    );
    const usersOptions = computed(
      () => users.value.map((u) => ({
        id: u.id,
        display: `${u.nom} ${u.prenom} \u2014 ${u.email}`,
        user_name: `${u.nom} ${u.prenom}`,
        email: u.email,
        matricule: u.matricule || "",
        entites: u.entites || []
      }))
    );
    const pointsCritiquesOptions = computed(
      () => pointsCritiques.value.map((pc) => ({
        id: pc.id,
        display: `${pc.code} \u2014 ${pc.libelle}`,
        code: pc.code,
        libelle: pc.libelle
      }))
    );
    const selectedUser = computed(
      () => usersOptions.value.find((o) => o.id === form.value.user_id) || null
    );
    const selectedPointCritique = computed(
      () => pointsCritiquesOptions.value.find((o) => o.id === form.value.entite_id) || null
    );
    const fileIconBg = computed(() => {
      if (!selectedFile.value) return "bg-gray-100";
      const t = selectedFile.value.type;
      if (t === "application/pdf") return "bg-red-100";
      if (t.startsWith("image/")) return "bg-purple-100";
      if (t.includes("word")) return "bg-blue-100";
      return "bg-gray-100";
    });
    const fileIconColor = computed(() => {
      if (!selectedFile.value) return "text-gray-400";
      const t = selectedFile.value.type;
      if (t === "application/pdf") return "text-red-500";
      if (t.startsWith("image/")) return "text-purple-500";
      if (t.includes("word")) return "text-blue-500";
      return "text-gray-400";
    });
    watch(assignationType, (newType) => {
      if (newType === "fonction") {
        form.value.actif = true;
        form.value.is_interim = false;
        const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
        form.value.date_debut = today;
        form.value.date_fin = "";
      } else if (newType === "interim") {
        form.value.actif = true;
        form.value.is_interim = true;
        form.value.date_debut = "";
        form.value.date_fin = "";
      }
    });
    const formatFileSize = (bytes) => {
      if (!bytes) return "";
      if (bytes < 1024) return bytes + " o";
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " Ko";
      return (bytes / (1024 * 1024)).toFixed(1) + " Mo";
    };
    const handleCancel = () => navigateTo("/point-critique");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = __nuxt_component_1;
      const _component_USelectMenu = __nuxt_component_1$1;
      const _component_UInput = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))}><div class="max-w-7xl mx-auto p-6"><div class="grid grid-cols-1 lg:grid-cols-12 gap-6"><div class="lg:col-span-12"><div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"><div class="flex justify-end">`);
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
        _push(`<form class="space-y-6 mt-6 max-w-3xl mx-auto"><div><label class="block text-sm font-medium text-gray-700 mb-2"> Utilisateur <span class="text-red-600">*</span></label>`);
        _push(ssrRenderComponent(_component_USelectMenu, {
          modelValue: unref(form).user_id,
          "onUpdate:modelValue": ($event) => unref(form).user_id = $event,
          options: unref(usersOptions),
          placeholder: "S\xE9lectionner un utilisateur",
          "value-attribute": "id",
          "option-attribute": "display",
          loading: unref(loadingUsers),
          searchable: "",
          "searchable-placeholder": "Rechercher un utilisateur...",
          class: "w-full"
        }, {
          label: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (unref(selectedUser)) {
                _push2(`<span class="truncate"${_scopeId}>${ssrInterpolate(unref(selectedUser).user_name)}</span>`);
              } else {
                _push2(`<span class="text-gray-400"${_scopeId}>S\xE9lectionner un utilisateur</span>`);
              }
            } else {
              return [
                unref(selectedUser) ? (openBlock(), createBlock("span", {
                  key: 0,
                  class: "truncate"
                }, toDisplayString(unref(selectedUser).user_name), 1)) : (openBlock(), createBlock("span", {
                  key: 1,
                  class: "text-gray-400"
                }, "S\xE9lectionner un utilisateur"))
              ];
            }
          }),
          option: withCtx(({ option }, _push2, _parent2, _scopeId) => {
            var _a, _b;
            if (_push2) {
              _push2(`<div class="flex flex-col py-1"${_scopeId}><span class="font-semibold text-sm text-gray-900"${_scopeId}>${ssrInterpolate(option.user_name)}</span><span class="text-xs text-gray-400"${_scopeId}>${ssrInterpolate(option.matricule)} \u2014 ${ssrInterpolate(option.email)}</span>`);
              if ((_a = option.entites) == null ? void 0 : _a.length) {
                _push2(`<div class="flex flex-wrap gap-1 mt-0.5"${_scopeId}><!--[-->`);
                ssrRenderList(option.entites.slice(0, 2), (e, i) => {
                  _push2(`<span class="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded"${_scopeId}>${ssrInterpolate(e.libelle)}</span>`);
                });
                _push2(`<!--]-->`);
                if (option.entites.length > 2) {
                  _push2(`<span class="text-[10px] text-gray-400"${_scopeId}> +${ssrInterpolate(option.entites.length - 2)}</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { class: "flex flex-col py-1" }, [
                  createVNode("span", { class: "font-semibold text-sm text-gray-900" }, toDisplayString(option.user_name), 1),
                  createVNode("span", { class: "text-xs text-gray-400" }, toDisplayString(option.matricule) + " \u2014 " + toDisplayString(option.email), 1),
                  ((_b = option.entites) == null ? void 0 : _b.length) ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "flex flex-wrap gap-1 mt-0.5"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(option.entites.slice(0, 2), (e, i) => {
                      return openBlock(), createBlock("span", {
                        key: i,
                        class: "text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded"
                      }, toDisplayString(e.libelle), 1);
                    }), 128)),
                    option.entites.length > 2 ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "text-[10px] text-gray-400"
                    }, " +" + toDisplayString(option.entites.length - 2), 1)) : createCommentVNode("", true)
                  ])) : createCommentVNode("", true)
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<p class="text-xs text-gray-500 mt-1">S\xE9lectionnez l&#39;utilisateur responsable du point critique</p></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Point Critique <span class="text-red-600">*</span></label>`);
        _push(ssrRenderComponent(_component_USelectMenu, {
          modelValue: unref(form).entite_id,
          "onUpdate:modelValue": ($event) => unref(form).entite_id = $event,
          options: unref(pointsCritiquesOptions),
          placeholder: "S\xE9lectionner un point critique",
          "value-attribute": "id",
          "option-attribute": "display",
          loading: unref(loadingPointsCritiques),
          searchable: "",
          "searchable-placeholder": "Rechercher un point critique...",
          class: "w-full"
        }, {
          label: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (unref(selectedPointCritique)) {
                _push2(`<span class="truncate"${_scopeId}>${ssrInterpolate(unref(selectedPointCritique).display)}</span>`);
              } else {
                _push2(`<span class="text-gray-400"${_scopeId}>S\xE9lectionner un point critique</span>`);
              }
            } else {
              return [
                unref(selectedPointCritique) ? (openBlock(), createBlock("span", {
                  key: 0,
                  class: "truncate"
                }, toDisplayString(unref(selectedPointCritique).display), 1)) : (openBlock(), createBlock("span", {
                  key: 1,
                  class: "text-gray-400"
                }, "S\xE9lectionner un point critique"))
              ];
            }
          }),
          option: withCtx(({ option }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex flex-col py-1"${_scopeId}><span class="font-semibold text-sm text-gray-900"${_scopeId}>${ssrInterpolate(option.code)}</span><span class="text-xs text-gray-500"${_scopeId}>${ssrInterpolate(option.libelle)}</span></div>`);
            } else {
              return [
                createVNode("div", { class: "flex flex-col py-1" }, [
                  createVNode("span", { class: "font-semibold text-sm text-gray-900" }, toDisplayString(option.code), 1),
                  createVNode("span", { class: "text-xs text-gray-500" }, toDisplayString(option.libelle), 1)
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<p class="text-xs text-gray-500 mt-1">S\xE9lectionnez le point critique \xE0 assigner</p></div><div class="pt-4 border-t border-gray-100"><label class="block text-sm font-medium text-gray-700 mb-3"> Type d&#39;assignation <span class="text-red-600">*</span></label><div class="flex flex-col sm:flex-row gap-4"><label class="${ssrRenderClass([unref(assignationType) === "fonction" ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-gray-300", "flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all"])}"><input type="radio" name="assignationType" value="fonction"${ssrIncludeBooleanAttr(ssrLooseEqual(unref(assignationType), "fonction")) ? " checked" : ""} class="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"><div class="flex-1"><span class="block text-sm font-semibold text-gray-900">Fonction</span><span class="block text-xs text-gray-500 mt-0.5"> Assignation permanente (d\xE9marre aujourd&#39;hui) </span></div></label><label class="${ssrRenderClass([unref(assignationType) === "interim" ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-gray-300", "flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all"])}"><input type="radio" name="assignationType" value="interim"${ssrIncludeBooleanAttr(ssrLooseEqual(unref(assignationType), "interim")) ? " checked" : ""} class="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"><div class="flex-1"><span class="block text-sm font-semibold text-gray-900">Int\xE9rim</span><span class="block text-xs text-gray-500 mt-0.5"> Assignation temporaire (dates obligatoires) </span></div></label></div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-2"> Date d&#39;Assignation `);
        if (unref(assignationType) === "interim") {
          _push(`<span class="text-red-600">*</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</label>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: unref(form).date_debut,
          "onUpdate:modelValue": ($event) => unref(form).date_debut = $event,
          type: "date",
          class: "w-full h-12",
          disabled: unref(assignationType) === "fonction"
        }, null, _parent));
        _push(`<p class="text-xs text-gray-500 mt-1">`);
        if (unref(assignationType) === "fonction") {
          _push(`<span>Automatiquement d\xE9finie \xE0 aujourd&#39;hui</span>`);
        } else if (unref(assignationType) === "interim") {
          _push(`<span>Obligatoire pour les int\xE9rims</span>`);
        } else {
          _push(`<span>Optionnel</span>`);
        }
        _push(`</p></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Date de fin `);
        if (unref(assignationType) === "interim") {
          _push(`<span class="text-red-600">*</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</label>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: unref(form).date_fin,
          "onUpdate:modelValue": ($event) => unref(form).date_fin = $event,
          type: "date",
          class: "w-full h-12",
          min: unref(form).date_debut,
          disabled: unref(assignationType) === "fonction"
        }, null, _parent));
        _push(`<p class="text-xs text-gray-500 mt-1">`);
        if (unref(assignationType) === "fonction") {
          _push(`<span>Non applicable pour les fonctions</span>`);
        } else if (unref(assignationType) === "interim") {
          _push(`<span>Obligatoire pour les int\xE9rims - Doit \xEAtre apr\xE8s la date de d\xE9but</span>`);
        } else {
          _push(`<span>Optionnel - Doit \xEAtre apr\xE8s la date de d\xE9but</span>`);
        }
        _push(`</p></div></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Pi\xE8ce jointe `);
        if (unref(assignationType) === "interim") {
          _push(`<span class="text-red-600 ml-1">*</span>`);
        } else {
          _push(`<span class="text-xs font-normal text-gray-500 ml-2">(Optionnel)</span>`);
        }
        _push(`</label>`);
        if (unref(assignationType) === "interim") {
          _push(`<p class="text-xs text-orange-600 flex items-center gap-1 mb-2"><svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg> Un document justificatif est obligatoire pour tout int\xE9rim. </p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="${ssrRenderClass([unref(selectedFile) ? "border-green-300 bg-green-50" : unref(assignationType) === "interim" && !unref(selectedFile) ? "border-orange-300 bg-orange-50 hover:border-orange-400" : "border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50", "border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors"])}"><input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" class="hidden">`);
        if (unref(selectedFile)) {
          _push(`<div class="flex items-center justify-between gap-3"><div class="flex items-center gap-3 min-w-0"><div class="${ssrRenderClass([unref(fileIconBg), "flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg"])}"><svg class="${ssrRenderClass([unref(fileIconColor), "w-5 h-5"])}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg></div><div class="text-left min-w-0"><p class="text-sm font-semibold text-gray-800 truncate">${ssrInterpolate(unref(selectedFile).name)}</p><p class="text-xs text-gray-500">${ssrInterpolate(formatFileSize(unref(selectedFile).size))}</p></div></div><button type="button" class="flex-shrink-0 p-1.5 rounded-full text-red-400 hover:text-red-600 hover:bg-red-100 transition-colors"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>`);
        } else {
          _push(`<div class="flex flex-col items-center gap-2 py-2"><svg class="${ssrRenderClass([unref(assignationType) === "interim" ? "text-orange-400" : "text-gray-300", "w-10 h-10"])}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg><p class="${ssrRenderClass([unref(assignationType) === "interim" ? "text-gray-700" : "text-gray-500", "text-sm"])}"><span class="${ssrRenderClass([unref(assignationType) === "interim" ? "text-orange-600" : "text-indigo-600", "font-semibold"])}">Cliquez</span> ou glissez un fichier ici </p><p class="${ssrRenderClass([unref(assignationType) === "interim" ? "text-orange-600 font-medium" : "text-gray-400", "text-xs"])}">${ssrInterpolate(unref(assignationType) === "interim" ? "Document obligatoire \u2014 PDF, Word, Images \u2014 max 5 Mo" : "PDF, Word, Images \u2014 max 5 Mo")}</p></div>`);
        }
        _push(`</div></div><div class="flex justify-center space-x-4 pt-6 border-t border-gray-200">`);
        _push(ssrRenderComponent(_component_UButton, {
          type: "button",
          onClick: handleCancel,
          color: "gray",
          variant: "outline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`ANNULER`);
            } else {
              return [
                createTextVNode("ANNULER")
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
              _push2(` ASSIGNER `);
            } else {
              return [
                createTextVNode(" ASSIGNER ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
        if (unref(errors).length > 0) {
          _push(`<div class="mt-4 bg-red-50 border border-red-200 rounded-lg p-4"><h4 class="text-sm font-bold text-red-900 mb-2">Erreurs de validation :</h4><ul class="list-disc list-inside text-sm text-red-600"><!--[-->`);
          ssrRenderList(unref(errors), (error, index) => {
            _push(`<li>${ssrInterpolate(error)}</li>`);
          });
          _push(`<!--]--></ul></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</form>`);
      }
      _push(`</div></div></div>`);
      if (unref(showSuccessModal)) {
        _push(`<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div class="bg-white rounded-xl p-8 w-[500px] max-w-[90vw] mx-4 text-center"><div class="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-green-100 mb-4"><svg class="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div><h3 class="text-2xl font-semibold mb-2">Succ\xE8s !</h3><p class="text-gray-600 mb-6">Le point critique a \xE9t\xE9 assign\xE9 avec succ\xE8s.</p>`);
        _push(ssrRenderComponent(_component_UButton, {
          onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))("/point-critique"),
          class: "bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
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
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/point-critique/create_assignment.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=create_assignment-CWsNq_KD.mjs.map
