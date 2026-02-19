import __nuxt_component_1 from './Badge-C_KHizXa.mjs';
import __nuxt_component_0 from './index-DJmPz9HS.mjs';
import __nuxt_component_2 from './Button-D4Pv8nAk.mjs';
import { ref, mergeProps, withCtx, createTextVNode, createVNode, unref, toDisplayString, createBlock, createCommentVNode, openBlock, Fragment, renderList, withDirectives, vModelText, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { _ as _sfc_main$1 } from './DataTable-87jejf7-.mjs';
import { n as navigateTo, c as useRuntimeConfig } from './server.mjs';
import { u as useToast } from './useToast-VyEsrynn.mjs';
import './Icon-BEWG_Jy9.mjs';
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
import './tooltip-lourJnw0.mjs';
import './useButtonGroup-DPIFBtCe.mjs';
import './Link-SQZY3OU3.mjs';
import './nuxt-link-aS4hYwbM.mjs';
import './ohash.D__AXeF1-DqcdtjQw.mjs';
import './link-Bz3Wc5MF.mjs';
import './button-Bz5rwL6o.mjs';
import './Input-3IU7zE8e.mjs';
import './useFormGroup-2eEELX00.mjs';
import './index-BLXEZ1Ia.mjs';
import './Select-BY_Jn5yn.mjs';
import './Checkbox-Nzn56Oau.mjs';
import './Card-CAWDi9lB.mjs';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const config = useRuntimeConfig();
    const columns = [
      { key: "id", label: "N\xB0", visible: true },
      { key: "code", label: "Code", visible: true },
      { key: "libelle", label: "Libell\xE9", visible: true },
      { key: "users_count", label: "Utilisateurs", visible: true }
    ];
    const fonctions = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const loadFonctions = async () => {
      var _a;
      loading.value = true;
      error.value = null;
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          throw new Error("Token d'authentification manquant");
        }
        console.log("\u{1F504} Chargement des fonctions...");
        const response = await $fetch(`${config.public.apiBase}/fonctions`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
          }
        });
        console.log("\u{1F4E6} R\xE9ponse API:", response);
        let dataArray = [];
        if (((_a = response == null ? void 0 : response.data) == null ? void 0 : _a.data) && Array.isArray(response.data.data)) {
          dataArray = response.data.data;
        } else if ((response == null ? void 0 : response.data) && Array.isArray(response.data)) {
          dataArray = response.data;
        } else if (Array.isArray(response)) {
          dataArray = response;
        } else {
          console.error("\u274C Format de r\xE9ponse inconnu:", response);
          throw new Error("Format de r\xE9ponse API invalide");
        }
        console.log("\u{1F4CA} Donn\xE9es extraites:", dataArray.length, "fonctions");
        fonctions.value = dataArray.map((fonction) => {
          var _a2;
          return {
            id: fonction.id,
            code: fonction.code || "N/A",
            libelle: fonction.libelle || "N/A",
            users_count: ((_a2 = fonction.users) == null ? void 0 : _a2.length) || 0,
            raw_data: fonction
            // Garder les données brutes pour debug
          };
        });
        console.log("\u2705 Fonctions charg\xE9es:", fonctions.value.length);
      } catch (err) {
        console.error("\u274C Erreur chargement:", err);
        error.value = err.message || "Erreur lors du chargement des fonctions";
        if (err.status === 401 || err.statusCode === 401) {
          useToast().add({
            title: "Session expir\xE9e",
            description: "Veuillez vous reconnecter",
            color: "red"
          });
          setTimeout(() => navigateTo("/login"), 1500);
        }
      } finally {
        loading.value = false;
      }
    };
    const onView = (item) => {
      console.log("\u{1F441}\uFE0F Voir:", item);
      navigateTo(`/fonctions/${item.id}`);
    };
    const onEdit = (item) => {
      console.log("\u270F\uFE0F \xC9diter:", item);
      navigateTo(`/fonctions/update/${item.id}`);
    };
    const onDelete = async (item) => {
      var _a;
      if (confirm(`Voulez-vous vraiment supprimer la fonction "${item.libelle}" ?`)) {
        try {
          const token = localStorage.getItem("auth_token");
          await $fetch(`${config.public.apiBase}/fonctions/${item.id}`, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Accept": "application/json"
            }
          });
          console.log("\u{1F5D1}\uFE0F Fonction supprim\xE9e:", item.libelle);
          useToast().add({
            title: "Succ\xE8s",
            description: "Fonction supprim\xE9e avec succ\xE8s",
            color: "green"
          });
          await loadFonctions();
        } catch (err) {
          console.error("\u274C Erreur suppression:", err);
          useToast().add({
            title: "Erreur",
            description: ((_a = err.data) == null ? void 0 : _a.message) || "Erreur lors de la suppression",
            color: "red"
          });
        }
      }
    };
    const onBulkDelete = async (selectedIds) => {
      if (confirm(`Voulez-vous vraiment supprimer ${selectedIds.length} fonction(s) ?`)) {
        try {
          const token = localStorage.getItem("auth_token");
          let successCount = 0;
          let errorCount = 0;
          for (const id of selectedIds) {
            try {
              await $fetch(`${config.public.apiBase}/fonctions/${id}`, {
                method: "DELETE",
                headers: {
                  "Authorization": `Bearer ${token}`,
                  "Accept": "application/json"
                }
              });
              successCount++;
            } catch (err) {
              console.error(`Erreur suppression ID ${id}:`, err);
              errorCount++;
            }
          }
          console.log(`\u{1F5D1}\uFE0F Suppression multiple: ${successCount} succ\xE8s, ${errorCount} \xE9checs`);
          useToast().add({
            title: "Suppression termin\xE9e",
            description: `${successCount} fonction(s) supprim\xE9e(s)${errorCount > 0 ? `, ${errorCount} erreur(s)` : ""}`,
            color: errorCount > 0 ? "orange" : "green"
          });
          await loadFonctions();
        } catch (err) {
          console.error("\u274C Erreur suppression multiple:", err);
          useToast().add({
            title: "Erreur",
            description: "Erreur lors de la suppression",
            color: "red"
          });
        }
      }
    };
    const onSelectionChange = (ids) => {
      console.log("\u{1F4CB} S\xE9lection:", ids);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UBadge = __nuxt_component_1;
      const _component_Icon = __nuxt_component_0;
      const _component_UButton = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-100 p-6 font-sans" }, _attrs))}><div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"><div><h1 class="text-2xl font-bold text-slate-900 tracking-tight">Fonctions</h1><p class="text-sm text-slate-500">Gestion des fonctions et r\xF4les</p></div>`);
      _push(ssrRenderComponent(_component_UBadge, {
        color: "green",
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
              to: "/fonctions/create",
              variant: "text",
              size: "sm",
              class: "p-0 m-0 text-green-600"
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
                to: "/fonctions/create",
                variant: "text",
                size: "sm",
                class: "p-0 m-0 text-green-600"
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
      _push(`</div>`);
      if (unref(loading)) {
        _push(`<div class="flex flex-col items-center justify-center py-20 gap-4 text-slate-500"><div class="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div><span class="text-sm font-medium">Chargement des donn\xE9es...</span></div>`);
      } else if (unref(error)) {
        _push(`<div class="flex items-center gap-4 p-5 bg-red-50 border border-red-200 rounded-xl max-w-2xl mx-auto sm:mx-0"><svg class="w-8 h-8 text-red-600 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg><div class="flex-1"><p class="text-sm font-bold text-red-900">Erreur de chargement</p><p class="text-xs text-red-700">${ssrInterpolate(unref(error))}</p></div><button class="px-4 py-2 text-xs font-bold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors shrink-0"> R\xE9essayer </button></div>`);
      } else {
        _push(ssrRenderComponent(_sfc_main$1, {
          data: unref(fonctions),
          columns,
          selectable: true,
          "left-aligned-columns": ["code", "libelle"],
          onEdit,
          onDelete,
          onView,
          onSelectionChange
        }, {
          "advanced-filters": withCtx(({ filters, onFilter }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4"${_scopeId}><!--[-->`);
              ssrRenderList([
                { id: "code", label: "Code" },
                { id: "libelle", label: "Libell\xE9" }
              ], (field) => {
                _push2(`<div${_scopeId}><label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5"${_scopeId}>${ssrInterpolate(field.label)}</label><input${ssrRenderAttr("value", filters[field.id])} placeholder="Filtrer..." class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"${_scopeId}></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              return [
                createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4" }, [
                  (openBlock(), createBlock(Fragment, null, renderList([
                    { id: "code", label: "Code" },
                    { id: "libelle", label: "Libell\xE9" }
                  ], (field) => {
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
          "selection-actions": withCtx(({ selected }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (selected.length > 0) {
                _push2(`<button class="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-red-600 to-orange-600 rounded-lg hover:opacity-90 transition-opacity"${_scopeId}><svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"${_scopeId}><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"${_scopeId}></path></svg> Supprimer (${ssrInterpolate(selected.length)}) </button>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                selected.length > 0 ? (openBlock(), createBlock("button", {
                  key: 0,
                  class: "inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-red-600 to-orange-600 rounded-lg hover:opacity-90 transition-opacity",
                  onClick: ($event) => onBulkDelete(selected)
                }, [
                  (openBlock(), createBlock("svg", {
                    class: "w-4 h-4",
                    viewBox: "0 0 20 20",
                    fill: "currentColor"
                  }, [
                    createVNode("path", {
                      "fill-rule": "evenodd",
                      d: "M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z",
                      "clip-rule": "evenodd"
                    })
                  ])),
                  createTextVNode(" Supprimer (" + toDisplayString(selected.length) + ") ", 1)
                ], 8, ["onClick"])) : createCommentVNode("", true)
              ];
            }
          }),
          "cell-code": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100"${_scopeId}>${ssrInterpolate(value || "N/A")}</span>`);
            } else {
              return [
                createVNode("span", { class: "inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100" }, toDisplayString(value || "N/A"), 1)
              ];
            }
          }),
          "cell-users_count": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="${ssrRenderClass([{
                "bg-green-50 text-green-700 border-green-100": value > 0,
                "bg-slate-100 text-slate-600 border-slate-200": value === 0
              }, "inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border"])}"${_scopeId}>${ssrInterpolate(value)} utilisateur${ssrInterpolate(value > 1 ? "s" : "")}</span>`);
            } else {
              return [
                createVNode("span", {
                  class: ["inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border", {
                    "bg-green-50 text-green-700 border-green-100": value > 0,
                    "bg-slate-100 text-slate-600 border-slate-200": value === 0
                  }]
                }, toDisplayString(value) + " utilisateur" + toDisplayString(value > 1 ? "s" : ""), 3)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/fonctions/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BEI76EOu.mjs.map
