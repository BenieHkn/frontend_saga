import __nuxt_component_1 from './Badge-C_KHizXa.mjs';
import __nuxt_component_0 from './index-DJmPz9HS.mjs';
import __nuxt_component_2 from './Button-D4Pv8nAk.mjs';
import __nuxt_component_0$1 from './Modal-BXvFVpvj.mjs';
import { ref, mergeProps, withCtx, createTextVNode, createVNode, unref, toDisplayString, createBlock, createCommentVNode, openBlock, Fragment, renderList, withDirectives, vModelText, isRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { _ as _sfc_main$1 } from './DataTable-87jejf7-.mjs';
import { n as navigateTo, c as useRuntimeConfig } from './server.mjs';
import { u as useToast } from './useToast-VyEsrynn.mjs';
import './Icon-BEWG_Jy9.mjs';
import './tooltip-lourJnw0.mjs';
import './useButtonGroup-DPIFBtCe.mjs';
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
import './button-Bz5rwL6o.mjs';
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
import './Input-3IU7zE8e.mjs';
import './useFormGroup-2eEELX00.mjs';
import './index-BLXEZ1Ia.mjs';
import './Select-BY_Jn5yn.mjs';
import './Checkbox-Nzn56Oau.mjs';
import './Card-CAWDi9lB.mjs';
import 'pinia';
import 'vue-router';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const columns = [
      { key: "id", label: "N\xB0", visible: true },
      { key: "code", label: "Code", visible: true },
      { key: "libelle", label: "Libell\xE9", visible: true },
      { key: "fonction", label: "Fonction", visible: true },
      { key: "parent_entite", label: "Entit\xE9 Parent", visible: true },
      { key: "is_critique", label: "Point Critique", visible: false },
      { key: "users_count", label: "Utilisateurs Actifs", visible: false }
    ];
    const entites = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const showDeleteModal = ref(false);
    const itemToDelete = ref(null);
    const deleting = ref(false);
    const config = useRuntimeConfig();
    const loadEntites = async () => {
      var _a;
      loading.value = true;
      error.value = null;
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          throw new Error("Token d'authentification manquant");
        }
        console.log("\u{1F504} Chargement des entit\xE9s...");
        const response = await $fetch(`${config.public.apiBase}/entites`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
          }
        });
        console.log("\u{1F4E6} R\xE9ponse API:", response);
        let dataArray = [];
        if ((response == null ? void 0 : response.data) && Array.isArray(response.data)) {
          dataArray = response.data;
        } else if (((_a = response == null ? void 0 : response.data) == null ? void 0 : _a.data) && Array.isArray(response.data.data)) {
          dataArray = response.data.data;
        } else if (Array.isArray(response)) {
          dataArray = response;
        } else {
          console.error("\u274C Format de r\xE9ponse inconnu:", response);
          throw new Error("Format de r\xE9ponse API invalide");
        }
        console.log("\u{1F4CA} Donn\xE9es extraites:", dataArray.length, "entit\xE9s");
        entites.value = dataArray.map((entite) => {
          var _a2, _b, _c;
          const activeUsersCount = ((_b = (_a2 = entite.entite_users) == null ? void 0 : _a2.filter((eu) => eu.actif)) == null ? void 0 : _b.length) || 0;
          return {
            id: entite.id,
            code: entite.code || "N/A",
            libelle: entite.libelle || "N/A",
            fonction: entite.fonction || "Non d\xE9finie",
            parent_entite: entite.parent_libelle || ((_c = entite.parentEntite) == null ? void 0 : _c.libelle) || "Aucune",
            parent_entite_id: entite.parent_entite_id,
            is_critique: entite.is_critique || false,
            users_count: activeUsersCount,
            created_at: entite.created_at,
            updated_at: entite.updated_at,
            raw_data: entite
          };
        });
        console.log("\u2705 Entit\xE9s charg\xE9es:", entites.value.length);
      } catch (err) {
        console.error("\u274C Erreur chargement:", err);
        error.value = err.message || "Erreur lors du chargement des entit\xE9s";
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
      navigateTo(`/entites/${item.id}`);
    };
    const onEdit = (item) => {
      console.log("\u270F\uFE0F \xC9diter:", item);
      navigateTo(`/entites/${item.id}`);
    };
    const onDelete = (item) => {
      console.log("\u{1F5D1}\uFE0F Demande de suppression:", item);
      itemToDelete.value = item;
      showDeleteModal.value = true;
    };
    const confirmDelete = async () => {
      var _a, _b;
      if (!itemToDelete.value) return;
      deleting.value = true;
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          throw new Error("Token d'authentification manquant");
        }
        console.log("\u{1F680} Suppression de l'entit\xE9 ID:", itemToDelete.value.id);
        const response = await $fetch(`${config.public.apiBase}/entites/${itemToDelete.value.id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
          }
        });
        console.log("\u2705 R\xE9ponse API:", response);
        showDeleteModal.value = false;
        useToast().add({
          title: "Succ\xE8s",
          description: `L'entit\xE9 "${itemToDelete.value.libelle}" a \xE9t\xE9 supprim\xE9e avec succ\xE8s`,
          color: "green"
        });
        itemToDelete.value = null;
        await loadEntites();
      } catch (err) {
        console.error("\u274C Erreur suppression:", err);
        let errorMessage = "Une erreur est survenue lors de la suppression";
        if (err.status === 422 || err.statusCode === 422) {
          errorMessage = ((_a = err.data) == null ? void 0 : _a.message) || "Impossible de supprimer une entit\xE9 avec des utilisateurs actifs";
        } else if (err.status === 401 || err.statusCode === 401) {
          errorMessage = "Session expir\xE9e. Veuillez vous reconnecter";
          setTimeout(() => navigateTo("/login"), 2e3);
        } else if (err.status === 404 || err.statusCode === 404) {
          errorMessage = "L'entit\xE9 n'existe plus ou a d\xE9j\xE0 \xE9t\xE9 supprim\xE9e";
          await loadEntites();
        } else {
          errorMessage = ((_b = err.data) == null ? void 0 : _b.message) || err.message || errorMessage;
        }
        useToast().add({
          title: "Erreur de suppression",
          description: errorMessage,
          color: "red"
        });
      } finally {
        deleting.value = false;
      }
    };
    const onBulkDelete = async (selectedIds) => {
      var _a, _b;
      if (selectedIds.length === 0) return;
      const confirmMsg = selectedIds.length === 1 ? "Voulez-vous vraiment supprimer cette entit\xE9 ?" : `Voulez-vous vraiment supprimer ${selectedIds.length} entit\xE9s ?`;
      if (!confirm(confirmMsg)) return;
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          throw new Error("Token d'authentification manquant");
        }
        let successCount = 0;
        let errorCount = 0;
        const errors = [];
        useToast().add({
          title: "Suppression en cours",
          description: `Suppression de ${selectedIds.length} entit\xE9(s)...`,
          color: "blue"
        });
        for (const id of selectedIds) {
          try {
            await $fetch(`${config.public.apiBase}/entites/${id}`, {
              method: "DELETE",
              headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
              }
            });
            successCount++;
            console.log(`\u2705 Entit\xE9 ${id} supprim\xE9e`);
          } catch (err) {
            errorCount++;
            console.error(`\u274C Erreur suppression ID ${id}:`, err);
            const entite = entites.value.find((e) => e.id === id);
            errors.push({
              id,
              code: (entite == null ? void 0 : entite.code) || `ID ${id}`,
              message: ((_a = err.data) == null ? void 0 : _a.message) || err.message || "Erreur inconnue"
            });
          }
        }
        console.log(`\u{1F5D1}\uFE0F Suppression multiple termin\xE9e: ${successCount} succ\xE8s, ${errorCount} \xE9checs`);
        if (errorCount === 0) {
          useToast().add({
            title: "Suppression r\xE9ussie",
            description: `${successCount} entit\xE9(s) supprim\xE9e(s) avec succ\xE8s`,
            color: "green"
          });
        } else if (successCount === 0) {
          useToast().add({
            title: "\xC9chec de la suppression",
            description: `Aucune entit\xE9 n'a pu \xEAtre supprim\xE9e. ${((_b = errors[0]) == null ? void 0 : _b.message) || ""}`,
            color: "red"
          });
        } else {
          useToast().add({
            title: "Suppression partielle",
            description: `${successCount} entit\xE9(s) supprim\xE9e(s), ${errorCount} \xE9chec(s)`,
            color: "orange"
          });
          if (errors.length > 0 && errors.length <= 3) {
            errors.forEach((err) => {
              useToast().add({
                title: `Erreur: ${err.code}`,
                description: err.message,
                color: "red"
              });
            });
          }
        }
        await loadEntites();
      } catch (err) {
        console.error("\u274C Erreur suppression multiple:", err);
        useToast().add({
          title: "Erreur",
          description: err.message || "Erreur lors de la suppression en masse",
          color: "red"
        });
      }
    };
    const onSelectionChange = (ids) => {
      console.log("\u{1F4CB} S\xE9lection:", ids);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UBadge = __nuxt_component_1;
      const _component_Icon = __nuxt_component_0;
      const _component_UButton = __nuxt_component_2;
      const _component_UModal = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-100 p-6 font-sans" }, _attrs))}><div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"><div><h1 class="text-2xl font-bold text-slate-900 tracking-tight">Entit\xE9s</h1><p class="text-sm text-slate-500">Gestion et organisation des entit\xE9s</p></div>`);
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
              to: "/entites/create",
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
                to: "/entites/create",
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
          data: unref(entites),
          columns,
          selectable: true,
          "left-aligned-columns": ["code", "libelle", "fonction"],
          onEdit,
          onDelete,
          onView,
          onSelectionChange
        }, {
          "advanced-filters": withCtx(({ filters, onFilter }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"${_scopeId}><!--[-->`);
              ssrRenderList([
                { id: "code", label: "Code" },
                { id: "libelle", label: "Libell\xE9" },
                { id: "fonction", label: "Fonction" },
                { id: "parent_entite", label: "Entit\xE9 Parent" }
              ], (field) => {
                _push2(`<div${_scopeId}><label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5"${_scopeId}>${ssrInterpolate(field.label)}</label><input${ssrRenderAttr("value", filters[field.id])} placeholder="Filtrer..." class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"${_scopeId}></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              return [
                createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" }, [
                  (openBlock(), createBlock(Fragment, null, renderList([
                    { id: "code", label: "Code" },
                    { id: "libelle", label: "Libell\xE9" },
                    { id: "fonction", label: "Fonction" },
                    { id: "parent_entite", label: "Entit\xE9 Parent" }
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
          "cell-is_critique": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="${ssrRenderClass([{
                "bg-red-50 text-red-700 border-red-100": value,
                "bg-slate-100 text-slate-600 border-slate-200": !value
              }, "inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border"])}"${_scopeId}>${ssrInterpolate(value ? "Critique" : "Normal")}</span>`);
            } else {
              return [
                createVNode("span", {
                  class: ["inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border", {
                    "bg-red-50 text-red-700 border-red-100": value,
                    "bg-slate-100 text-slate-600 border-slate-200": !value
                  }]
                }, toDisplayString(value ? "Critique" : "Normal"), 3)
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(ssrRenderComponent(_component_UModal, {
        modelValue: unref(showDeleteModal),
        "onUpdate:modelValue": ($event) => isRef(showDeleteModal) ? showDeleteModal.value = $event : null
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="p-6"${_scopeId}><div class="flex items-center gap-4 mb-4"${_scopeId}><div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0"${_scopeId}><svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"${_scopeId}></path></svg></div><div class="flex-1"${_scopeId}><h3 class="text-lg font-bold text-slate-900"${_scopeId}>Confirmer la suppression</h3><p class="text-sm text-slate-600 mt-1"${_scopeId}>Cette action est irr\xE9versible</p></div></div>`);
            if (unref(itemToDelete)) {
              _push2(`<div class="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4"${_scopeId}><div class="space-y-2 text-sm"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><span class="text-slate-600 font-medium"${_scopeId}>Code:</span><span class="font-semibold text-slate-900"${_scopeId}>${ssrInterpolate(unref(itemToDelete).code)}</span></div><div class="flex items-center justify-between"${_scopeId}><span class="text-slate-600 font-medium"${_scopeId}>Libell\xE9:</span><span class="font-semibold text-slate-900"${_scopeId}>${ssrInterpolate(unref(itemToDelete).libelle)}</span></div>`);
              if (unref(itemToDelete).fonction) {
                _push2(`<div class="flex items-center justify-between"${_scopeId}><span class="text-slate-600 font-medium"${_scopeId}>Fonction:</span><span class="font-semibold text-slate-900"${_scopeId}>${ssrInterpolate(unref(itemToDelete).fonction)}</span></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(itemToDelete).users_count > 0) {
                _push2(`<div class="flex items-center justify-between"${_scopeId}><span class="text-slate-600 font-medium"${_scopeId}>Utilisateurs:</span><span class="font-semibold text-orange-600"${_scopeId}>${ssrInterpolate(unref(itemToDelete).users_count)} actif(s)</span></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(itemToDelete).is_critique) {
                _push2(`<div class="mt-3 p-2 bg-red-50 border border-red-200 rounded flex items-center gap-2"${_scopeId}><svg class="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20"${_scopeId}><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"${_scopeId}></path></svg><span class="text-xs font-semibold text-red-800"${_scopeId}>Entit\xE9 critique</span></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4"${_scopeId}><p class="text-xs text-yellow-800"${_scopeId}><strong${_scopeId}>\u26A0\uFE0F Attention :</strong> Vous \xEAtes sur le point de supprimer cette entit\xE9. Cette action supprimera d\xE9finitivement toutes les donn\xE9es associ\xE9es. </p></div><div class="flex justify-end gap-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              color: "gray",
              variant: "outline",
              onClick: ($event) => showDeleteModal.value = false,
              disabled: unref(deleting)
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Annuler `);
                } else {
                  return [
                    createTextVNode(" Annuler ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              color: "red",
              onClick: confirmDelete,
              loading: unref(deleting)
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Supprimer d\xE9finitivement `);
                } else {
                  return [
                    createTextVNode(" Supprimer d\xE9finitivement ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "p-6" }, [
                createVNode("div", { class: "flex items-center gap-4 mb-4" }, [
                  createVNode("div", { class: "w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0" }, [
                    (openBlock(), createBlock("svg", {
                      class: "w-6 h-6 text-red-600",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      })
                    ]))
                  ]),
                  createVNode("div", { class: "flex-1" }, [
                    createVNode("h3", { class: "text-lg font-bold text-slate-900" }, "Confirmer la suppression"),
                    createVNode("p", { class: "text-sm text-slate-600 mt-1" }, "Cette action est irr\xE9versible")
                  ])
                ]),
                unref(itemToDelete) ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4"
                }, [
                  createVNode("div", { class: "space-y-2 text-sm" }, [
                    createVNode("div", { class: "flex items-center justify-between" }, [
                      createVNode("span", { class: "text-slate-600 font-medium" }, "Code:"),
                      createVNode("span", { class: "font-semibold text-slate-900" }, toDisplayString(unref(itemToDelete).code), 1)
                    ]),
                    createVNode("div", { class: "flex items-center justify-between" }, [
                      createVNode("span", { class: "text-slate-600 font-medium" }, "Libell\xE9:"),
                      createVNode("span", { class: "font-semibold text-slate-900" }, toDisplayString(unref(itemToDelete).libelle), 1)
                    ]),
                    unref(itemToDelete).fonction ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "flex items-center justify-between"
                    }, [
                      createVNode("span", { class: "text-slate-600 font-medium" }, "Fonction:"),
                      createVNode("span", { class: "font-semibold text-slate-900" }, toDisplayString(unref(itemToDelete).fonction), 1)
                    ])) : createCommentVNode("", true),
                    unref(itemToDelete).users_count > 0 ? (openBlock(), createBlock("div", {
                      key: 1,
                      class: "flex items-center justify-between"
                    }, [
                      createVNode("span", { class: "text-slate-600 font-medium" }, "Utilisateurs:"),
                      createVNode("span", { class: "font-semibold text-orange-600" }, toDisplayString(unref(itemToDelete).users_count) + " actif(s)", 1)
                    ])) : createCommentVNode("", true),
                    unref(itemToDelete).is_critique ? (openBlock(), createBlock("div", {
                      key: 2,
                      class: "mt-3 p-2 bg-red-50 border border-red-200 rounded flex items-center gap-2"
                    }, [
                      (openBlock(), createBlock("svg", {
                        class: "w-4 h-4 text-red-600",
                        fill: "currentColor",
                        viewBox: "0 0 20 20"
                      }, [
                        createVNode("path", {
                          "fill-rule": "evenodd",
                          d: "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z",
                          "clip-rule": "evenodd"
                        })
                      ])),
                      createVNode("span", { class: "text-xs font-semibold text-red-800" }, "Entit\xE9 critique")
                    ])) : createCommentVNode("", true)
                  ])
                ])) : createCommentVNode("", true),
                createVNode("div", { class: "bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4" }, [
                  createVNode("p", { class: "text-xs text-yellow-800" }, [
                    createVNode("strong", null, "\u26A0\uFE0F Attention :"),
                    createTextVNode(" Vous \xEAtes sur le point de supprimer cette entit\xE9. Cette action supprimera d\xE9finitivement toutes les donn\xE9es associ\xE9es. ")
                  ])
                ]),
                createVNode("div", { class: "flex justify-end gap-3" }, [
                  createVNode(_component_UButton, {
                    color: "gray",
                    variant: "outline",
                    onClick: ($event) => showDeleteModal.value = false,
                    disabled: unref(deleting)
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Annuler ")
                    ]),
                    _: 1
                  }, 8, ["onClick", "disabled"]),
                  createVNode(_component_UButton, {
                    color: "red",
                    onClick: confirmDelete,
                    loading: unref(deleting)
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Supprimer d\xE9finitivement ")
                    ]),
                    _: 1
                  }, 8, ["loading"])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/entites/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DZ3BmQuR.mjs.map
