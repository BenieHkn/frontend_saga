import { ssrRenderComponent, ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrRenderAttr, ssrRenderStyle } from 'vue/server-renderer';
import __nuxt_component_1 from './Badge-DIEXPf_r.mjs';
import { u as useHead, c as __nuxt_component_0$2, d as __nuxt_component_1$1, n as navigateTo, b as useRuntimeConfig, r as useToast, F as useCookie } from './server.mjs';
import { computed, watch, mergeProps, withCtx, createTextVNode, createVNode, unref, toDisplayString, createBlock, createCommentVNode, openBlock, Fragment, renderList, withDirectives, vModelText, ref, withModifiers, useSSRContext } from 'vue';
import { _ as _sfc_main$3 } from './DataTable-Cb4WL8Ep.mjs';
import { u as useApi } from './useApi-J_uhScde.mjs';
import __nuxt_component_3 from './Modal-EvFvX6Ng.mjs';
import __nuxt_component_2 from './Card-DtmGMnBU.mjs';
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

const _sfc_main$2 = {
  __name: "Point_critique",
  __ssrInlineRender: true,
  setup(__props) {
    const config = useRuntimeConfig();
    useHead({
      title: "Points Critiques - Sagar Revolution"
    });
    const columns = [
      { key: "code", label: "Sigle", visible: true },
      { key: "libelle", label: "Libell\xE9", visible: true },
      { key: "responsable", label: "Responsable", visible: false },
      { key: "statut", label: "Statut", visible: false },
      { key: "date_debut", label: "Date de d\xE9but", visible: false },
      { key: "date_fin", label: "Date de fin", visible: false }
    ];
    const formatDate = (dateString) => {
      if (!dateString) return "";
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        });
      } catch (err) {
        console.error("Erreur formatage date:", err);
        return dateString;
      }
    };
    const transformPointsCritiques = (response) => {
      var _a;
      console.log("\u{1F4E6} Response compl\xE8te points critiques:", response);
      let dataArray = [];
      if (!response) {
        console.error("\u274C Response is null or undefined");
        return [];
      }
      if (((_a = response.data) == null ? void 0 : _a.data) && Array.isArray(response.data.data)) {
        dataArray = response.data.data;
      } else if (response.data && Array.isArray(response.data)) {
        dataArray = response.data;
      } else if (Array.isArray(response)) {
        dataArray = response;
      } else if (response.success && response.data) {
        dataArray = Array.isArray(response.data) ? response.data : [response.data];
      } else {
        console.error("\u274C Format de r\xE9ponse non reconnu:", response);
        return [];
      }
      console.log("\u{1F4CA} Data array extracted:", dataArray);
      return dataArray.map((point) => {
        var _a2, _b;
        return {
          id: point.id,
          code: point.code || "N/A",
          libelle: point.libelle || "N/A",
          responsable: (_a2 = point.responsable) != null ? _a2 : "Non assign\xE9",
          statut: (_b = point.statut) != null ? _b : true,
          date_debut: point.date_debut || null,
          date_fin: point.date_fin || null
        };
      });
    };
    const { data: pointsCritiques, loading, error, refresh } = useApi("/points-critiques", {
      transform: transformPointsCritiques,
      immediate: true
    });
    const filteredColumns = computed(() => {
      return columns.map((column) => {
        var _a;
        if (column.key === "date_fin") {
          const allActive = (_a = pointsCritiques.value) == null ? void 0 : _a.every((point) => point.statut === true);
          return {
            ...column,
            visible: !allActive,
            // Masquer la colonne si tous sont actifs
            cellClass: (item) => item.statut === true ? "opacity-50" : ""
          };
        }
        return column;
      });
    });
    watch(pointsCritiques, (newData) => {
      console.log(
        "Donn\xE9es mises \xE0 jour, statut des points critiques:",
        newData == null ? void 0 : newData.map((p) => ({ libelle: p.libelle, statut: p.statut }))
      );
    });
    const onView = (item) => {
      console.log("\u{1F441}\uFE0F Voir point critique :", item);
      navigateTo(`/point-critique/${item.id}`);
    };
    const onEdit = (item) => {
      console.log("\u270F\uFE0F \xC9diter point critique :", item);
      navigateTo(`/point-critique/update/${item.id}`);
    };
    const onDelete = async (item) => {
      var _a, _b;
      if (confirm(`Voulez-vous vraiment supprimer le point critique "${item.libelle}" ?`)) {
        try {
          const token = localStorage.getItem("auth_token");
          if (!token) {
            throw new Error("Token d'authentification manquant");
          }
          await $fetch(`${config.public.apiBase}/points-critiques/${item.id}`, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Accept": "application/json"
            }
          });
          console.log("\u{1F5D1}\uFE0F Point critique supprim\xE9 :", item);
          useToast().add({
            title: "Succ\xE8s",
            description: "Point critique supprim\xE9 avec succ\xE8s",
            color: "green"
          });
          refresh();
        } catch (err) {
          console.error("\u274C Erreur lors de la suppression:", err);
          let errorMessage = "Erreur lors de la suppression du point critique";
          if (err.status === 401 || err.statusCode === 401) {
            errorMessage = "Session expir\xE9e. Veuillez vous reconnecter";
            useToast().add({
              title: "Session expir\xE9e",
              description: "Veuillez vous reconnecter",
              color: "red"
            });
            setTimeout(() => navigateTo("/login"), 2e3);
            return;
          }
          if (err.status === 422 || err.statusCode === 422) {
            errorMessage = ((_a = err.data) == null ? void 0 : _a.message) || "Ce point critique ne peut pas \xEAtre supprim\xE9 car il est utilis\xE9";
          } else if ((_b = err.data) == null ? void 0 : _b.message) {
            errorMessage = err.data.message;
          }
          useToast().add({
            title: "Erreur",
            description: errorMessage,
            color: "red"
          });
        }
      }
    };
    const onBulkDelete = async (selectedIds) => {
      if (confirm(`Voulez-vous vraiment supprimer ${selectedIds.length} point(s) critique(s) ?`)) {
        try {
          const token = localStorage.getItem("auth_token");
          if (!token) {
            throw new Error("Token d'authentification manquant");
          }
          let successCount = 0;
          let errorCount = 0;
          useToast().add({
            title: "Suppression en cours",
            description: `Suppression de ${selectedIds.length} point(s) critique(s)...`,
            color: "blue"
          });
          for (const id of selectedIds) {
            try {
              await $fetch(`${config.public.apiBase}/points-critiques/${id}`, {
                method: "DELETE",
                headers: {
                  "Authorization": `Bearer ${token}`,
                  "Accept": "application/json"
                }
              });
              successCount++;
            } catch (err) {
              console.error(`\u274C Erreur suppression point critique ID ${id}:`, err);
              errorCount++;
            }
          }
          console.log(`\u{1F5D1}\uFE0F Suppression multiple : ${successCount} succ\xE8s, ${errorCount} \xE9checs`);
          if (errorCount === 0) {
            useToast().add({
              title: "Suppression r\xE9ussie",
              description: `${successCount} point(s) critique(s) supprim\xE9(s) avec succ\xE8s`,
              color: "green"
            });
          } else if (successCount === 0) {
            useToast().add({
              title: "\xC9chec de la suppression",
              description: `Aucun point critique n'a pu \xEAtre supprim\xE9`,
              color: "red"
            });
          } else {
            useToast().add({
              title: "Suppression partielle",
              description: `${successCount} point(s) critique(s) supprim\xE9(s), ${errorCount} \xE9chec(s)`,
              color: "orange"
            });
          }
          refresh();
        } catch (err) {
          console.error("\u274C Erreur suppression multiple:", err);
          if (err.status === 401 || err.statusCode === 401) {
            useToast().add({
              title: "Session expir\xE9e",
              description: "Veuillez vous reconnecter",
              color: "red"
            });
            setTimeout(() => navigateTo("/login"), 2e3);
            return;
          }
          useToast().add({
            title: "Erreur",
            description: err.message || "Erreur lors de la suppression multiple",
            color: "red"
          });
        }
      }
    };
    const onSelectionChange = (ids) => {
      console.log("\u{1F4CB} S\xE9lection mise \xE0 jour :", ids);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UBadge = __nuxt_component_1;
      const _component_Icon = __nuxt_component_0$2;
      const _component_UButton = __nuxt_component_1$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-slate-100 p-6 font-sans" }, _attrs))}><div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"><div><h1 class="text-2xl font-bold text-slate-900 tracking-tight">Points Critiques</h1><p class="text-sm text-slate-500">Gestion des points critiques</p></div>`);
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
              to: "/point-critique/create",
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
                to: "/point-critique/create",
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
        _push(`<div class="flex flex-col items-center justify-center py-20 gap-4 text-slate-500"><div class="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div><span class="text-sm font-medium">Chargement des points critiques...</span></div>`);
      } else if (unref(error)) {
        _push(`<div class="flex items-center gap-4 p-5 bg-red-50 border border-red-200 rounded-xl max-w-2xl mx-auto sm:mx-0"><svg class="w-8 h-8 text-red-600 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg><div class="flex-1"><p class="text-sm font-bold text-red-900">Erreur de chargement</p><p class="text-xs text-red-700">${ssrInterpolate(unref(error))}</p></div><button class="px-4 py-2 text-xs font-bold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors shrink-0"> R\xE9essayer </button></div>`);
      } else {
        _push(ssrRenderComponent(_sfc_main$3, {
          data: unref(pointsCritiques),
          columns: filteredColumns.value,
          selectable: true,
          "left-aligned-columns": ["sigle", "libelle", "responsable"],
          onEdit,
          onDelete,
          onView,
          onSelectionChange
        }, {
          "advanced-filters": withCtx(({ filters, onFilter }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"${_scopeId}><!--[-->`);
              ssrRenderList([
                { id: "sigle", label: "Sigle" },
                { id: "libelle", label: "Libell\xE9" },
                { id: "responsable", label: "Responsable" }
              ], (field) => {
                _push2(`<div${_scopeId}><label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5"${_scopeId}>${ssrInterpolate(field.label)}</label><input${ssrRenderAttr("value", filters[field.id])} placeholder="Filtrer..." class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"${_scopeId}></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              return [
                createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" }, [
                  (openBlock(), createBlock(Fragment, null, renderList([
                    { id: "sigle", label: "Sigle" },
                    { id: "libelle", label: "Libell\xE9" },
                    { id: "responsable", label: "Responsable" }
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
          "cell-sigle": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100"${_scopeId}>${ssrInterpolate(value || "N/A")}</span>`);
            } else {
              return [
                createVNode("span", { class: "inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100" }, toDisplayString(value || "N/A"), 1)
              ];
            }
          }),
          "cell-libelle": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="text-xs text-slate-900 font-semibold"${_scopeId}>${ssrInterpolate(value || "N/A")}</span>`);
            } else {
              return [
                createVNode("span", { class: "text-xs text-slate-900 font-semibold" }, toDisplayString(value || "N/A"), 1)
              ];
            }
          }),
          "cell-responsable": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="text-xs text-slate-600 font-medium"${_scopeId}>${ssrInterpolate(value || "Non assign\xE9")}</span>`);
            } else {
              return [
                createVNode("span", { class: "text-xs text-slate-600 font-medium" }, toDisplayString(value || "Non assign\xE9"), 1)
              ];
            }
          }),
          "cell-statut": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="${ssrRenderClass([{
                "bg-green-50 text-green-700 border-green-100": value === true,
                "bg-red-50 text-red-700 border-red-100": value === false
              }, "inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border"])}"${_scopeId}>${ssrInterpolate(value ? "Actif" : "Inactif")}</span>`);
            } else {
              return [
                createVNode("span", {
                  class: ["inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border", {
                    "bg-green-50 text-green-700 border-green-100": value === true,
                    "bg-red-50 text-red-700 border-red-100": value === false
                  }]
                }, toDisplayString(value ? "Actif" : "Inactif"), 3)
              ];
            }
          }),
          "cell-date_debut": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="text-xs text-slate-600 font-medium"${_scopeId}>${ssrInterpolate(value ? formatDate(value) : "Non d\xE9finie")}</span>`);
            } else {
              return [
                createVNode("span", { class: "text-xs text-slate-600 font-medium" }, toDisplayString(value ? formatDate(value) : "Non d\xE9finie"), 1)
              ];
            }
          }),
          "cell-date_fin": withCtx(({ value, item }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="${ssrRenderClass([{
                "text-slate-400 italic": item.statut === true,
                "text-slate-600": item.statut === false
              }, "text-xs text-slate-600 font-medium"])}"${_scopeId}>${ssrInterpolate(item.statut ? "Non applicable" : value ? formatDate(value) : "Non d\xE9finie")}</span>`);
            } else {
              return [
                createVNode("span", {
                  class: ["text-xs text-slate-600 font-medium", {
                    "text-slate-400 italic": item.statut === true,
                    "text-slate-600": item.statut === false
                  }]
                }, toDisplayString(item.statut ? "Non applicable" : value ? formatDate(value) : "Non d\xE9finie"), 3)
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
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/point_critique/Point_critique.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "Point_critique_history",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Assignations Points Critiques - Sagar Revolution"
    });
    const showEditModal = ref(false);
    const selectedItem = ref(null);
    const submitting = ref(false);
    const editError = ref(null);
    const editFileInputRef = ref(null);
    const editForm = ref({
      date_fin: "",
      statut: false,
      newFile: null
    });
    const showAttachmentModal = ref(false);
    const attachmentBlobUrl = ref("");
    const attachmentType = ref("");
    const attachmentFileName = ref("");
    const attachmentLoading = ref(false);
    const attachmentError = ref(null);
    const getToken = () => {
      return useCookie("auth_token").value || "";
    };
    const buildStorageUrl = (path) => {
      const config = useRuntimeConfig();
      const cleanPath = path.replace(/\\\//g, "/").replace(/^\//, "").replace(/^storage\//, "");
      return `${config.public.apiBase}/file/${cleanPath}`;
    };
    const detectFileType = (path) => {
      const lower = path.toLowerCase().split("?")[0];
      if (lower.endsWith(".pdf")) return "pdf";
      if ([".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"].some((ext) => lower.endsWith(ext))) return "image";
      return "other";
    };
    const extractFileName = (path) => {
      return path.replace(/\\\//g, "/").split("/").pop() || "Fichier";
    };
    const openAttachmentModal = async (path) => {
      const url = buildStorageUrl(path);
      console.log("\u{1F517} URL:", url);
      console.log("\u{1F4C4} Path brut:", path);
      attachmentBlobUrl.value = "";
      attachmentError.value = null;
      attachmentLoading.value = true;
      attachmentType.value = detectFileType(path);
      attachmentFileName.value = extractFileName(path);
      showAttachmentModal.value = true;
      try {
        const url2 = buildStorageUrl(path);
        const response = await fetch(url2, {
          headers: {
            "Authorization": `Bearer ${getToken()}`,
            "Accept": "*/*"
          }
        });
        if (!response.ok) {
          throw new Error(`Erreur ${response.status} : acc\xE8s refus\xE9 ou fichier introuvable`);
        }
        const blob = await response.blob();
        attachmentBlobUrl.value = URL.createObjectURL(blob);
      } catch (err) {
        console.error("\u274C Erreur chargement pi\xE8ce jointe:", err);
        attachmentError.value = err.message || "Impossible de charger le fichier";
      } finally {
        attachmentLoading.value = false;
      }
    };
    const columns = [
      { key: "code", label: "Code", visible: true },
      { key: "libelle", label: "Libell\xE9", visible: true },
      { key: "user_name", label: "Agent", visible: true },
      { key: "matricule", label: "Matricule", visible: true },
      { key: "is_interim", label: "Type", visible: true },
      { key: "statut", label: "Statut", visible: true },
      { key: "date_debut", label: "Date de d\xE9but", visible: true },
      { key: "date_fin", label: "Date de fin", visible: true },
      { key: "piece_jointe_url", label: "Fichier", visible: true }
    ];
    const formatDate = (dateString) => {
      if (!dateString) return "";
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        });
      } catch (err) {
        console.error("Erreur formatage date:", err);
        return dateString;
      }
    };
    const transformPointsCritiques = (response) => {
      console.log("\u{1F4E6} Response compl\xE8te assignations:", response);
      let dataArray = [];
      if (!response) {
        console.error("\u274C Response is null or undefined");
        return [];
      }
      if (response.data && Array.isArray(response.data)) {
        dataArray = response.data;
      } else if (Array.isArray(response)) {
        dataArray = response;
      } else {
        console.error("\u274C Format de r\xE9ponse non reconnu:", response);
        return [];
      }
      console.log("\u{1F4CA} Data array extracted:", dataArray.length, "assignations");
      return dataArray.map((item) => {
        var _a, _b;
        const user = item.user || {};
        const pointCritique = item.point_critique || {};
        return {
          id: item.id,
          code: pointCritique.code || "N/A",
          libelle: pointCritique.libelle || "N/A",
          user_name: user.nom && user.prenom ? `${user.nom} ${user.prenom}` : "Non assign\xE9",
          matricule: user.matricule || "N/A",
          is_interim: (_a = item.is_interim) != null ? _a : false,
          statut: (_b = item.statut) != null ? _b : true,
          date_debut: item.date_debut || null,
          date_fin: item.date_fin || null,
          piece_jointe_url: item.piece_jointe_url || null,
          point_critique_id: item.point_critique_id,
          user_id: item.user_id
        };
      });
    };
    const { data: pointsCritiques, loading, error, refresh } = useApi("/point-critique-user", {
      transform: transformPointsCritiques,
      immediate: true
    });
    const filteredColumns = computed(() => {
      return columns.map((column) => {
        var _a;
        if (column.key === "date_fin") {
          const allActive = (_a = pointsCritiques.value) == null ? void 0 : _a.every((point) => point.statut === true);
          return {
            ...column,
            visible: !allActive,
            cellClass: (item) => item.statut === true ? "opacity-50" : ""
          };
        }
        return column;
      });
    });
    const closeEditModal = () => {
      showEditModal.value = false;
      selectedItem.value = null;
      editForm.value = { date_fin: "", statut: false, newFile: null };
      editError.value = null;
      if (editFileInputRef.value) editFileInputRef.value.value = "";
    };
    const submitEdit = async () => {
      var _a, _b, _c;
      if (!selectedItem.value) return;
      if (selectedItem.value.statut && !editForm.value.date_fin) {
        editError.value = "La date de fin est requise pour d\xE9sactiver l'assignation";
        return;
      }
      if (selectedItem.value.statut && editForm.value.date_fin) {
        const dateDebut = selectedItem.value.date_debut ? new Date(selectedItem.value.date_debut) : null;
        const dateFin = new Date(editForm.value.date_fin);
        if (dateDebut && dateFin < dateDebut) {
          editError.value = "La date de fin doit \xEAtre post\xE9rieure ou \xE9gale \xE0 la date de d\xE9but";
          return;
        }
      }
      submitting.value = true;
      editError.value = null;
      try {
        const config = useRuntimeConfig();
        const getToken2 = () => {
          if (false) ;
          return useCookie("auth_token").value || "";
        };
        const formData = new FormData();
        formData.append("statut", !selectedItem.value.statut ? "1" : "0");
        if (selectedItem.value.statut && editForm.value.date_fin) {
          formData.append("date_fin", editForm.value.date_fin);
        } else if (!selectedItem.value.statut) {
          formData.append("date_fin", "");
        }
        if (editForm.value.newFile instanceof File) {
          formData.append("piece_jointe", editForm.value.newFile);
          console.log("\u{1F4CE} Nouveau fichier ajout\xE9:", editForm.value.newFile.name);
        }
        formData.append("_method", "PUT");
        console.log("\u{1F4E4} Envoi de la mise \xE0 jour...");
        const response = await $fetch(`/point-critique-user/${selectedItem.value.id}`, {
          baseURL: config.public.apiBase,
          method: "POST",
          // Utiliser POST avec _method=PUT pour FormData
          headers: {
            "Authorization": `Bearer ${getToken2()}`,
            "Accept": "application/json"
            // Ne pas définir Content-Type, laissez le navigateur le faire
          },
          body: formData
        });
        console.log("\u2705 R\xE9ponse de mise \xE0 jour:", response);
        useToast().add({
          title: "Succ\xE8s",
          description: selectedItem.value.statut ? "Assignation d\xE9sactiv\xE9e avec succ\xE8s" : "Assignation r\xE9activ\xE9e avec succ\xE8s",
          color: "green"
        });
        closeEditModal();
        refresh();
      } catch (err) {
        console.error("\u274C Erreur lors de la mise \xE0 jour:", err);
        let errorMessage = "Erreur lors de la mise \xE0 jour de l'assignation";
        if (err.status === 401 || err.statusCode === 401) {
          errorMessage = "Session expir\xE9e. Veuillez vous reconnecter.";
        } else if (err.status === 422 || err.statusCode === 422) {
          if ((_a = err.data) == null ? void 0 : _a.errors) {
            errorMessage = Object.values(err.data.errors).flat().join(", ");
          } else {
            errorMessage = ((_b = err.data) == null ? void 0 : _b.message) || errorMessage;
          }
        } else if ((_c = err.data) == null ? void 0 : _c.message) {
          errorMessage = err.data.message;
        }
        editError.value = errorMessage;
        useToast().add({
          title: "Erreur",
          description: errorMessage,
          color: "red"
        });
      } finally {
        submitting.value = false;
      }
    };
    const onView = (item) => {
      console.log("\u{1F441}\uFE0F Voir assignation :", item);
      navigateTo(`/point-critique/assignment/${item.id}`);
    };
    const onEdit = (item) => {
      console.log("\u270F\uFE0F \xC9diter assignation :", item);
      selectedItem.value = { ...item };
      editForm.value = {
        date_fin: item.date_fin ? item.date_fin.split("T")[0] : "",
        statut: !item.statut,
        newFile: null
      };
      showEditModal.value = true;
    };
    const onSelectionChange = (ids) => {
      console.log("\u{1F4CB} S\xE9lection mise \xE0 jour :", ids);
    };
    watch(pointsCritiques, (newData) => {
      console.log("\u2705 Assignations charg\xE9es:", (newData == null ? void 0 : newData.length) || 0);
      if (newData && newData.length > 0) {
        console.log("\u{1F4CB} Premier \xE9l\xE9ment:", newData[0]);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UBadge = __nuxt_component_1;
      const _component_Icon = __nuxt_component_0$2;
      const _component_UButton = __nuxt_component_1$1;
      const _component_UModal = __nuxt_component_3;
      const _component_UCard = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-slate-100 p-6 font-sans" }, _attrs))}><div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"><div><h1 class="text-2xl font-bold text-slate-900 tracking-tight">Assignation de points critiques</h1><p class="text-sm text-slate-500">Gestion des assignations points critiques</p></div>`);
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
              to: "/point-critique/create_assignment",
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
                to: "/point-critique/create_assignment",
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
        _push(`<div class="flex flex-col items-center justify-center py-20 gap-4 text-slate-500"><div class="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div><span class="text-sm font-medium">Chargement des assignations...</span></div>`);
      } else if (unref(error)) {
        _push(`<div class="flex items-center gap-4 p-5 bg-red-50 border border-red-200 rounded-xl max-w-2xl mx-auto sm:mx-0"><svg class="w-8 h-8 text-red-600 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg><div class="flex-1"><p class="text-sm font-bold text-red-900">Erreur de chargement</p><p class="text-xs text-red-700">${ssrInterpolate(unref(error))}</p></div><button class="px-4 py-2 text-xs font-bold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors shrink-0"> R\xE9essayer </button></div>`);
      } else {
        _push(ssrRenderComponent(_sfc_main$3, {
          data: unref(pointsCritiques),
          columns: filteredColumns.value,
          selectable: false,
          "left-aligned-columns": ["code", "libelle", "user_name", "is_interim"],
          "show-delete-action": false,
          onEdit,
          onView,
          onSelectionChange
        }, {
          "advanced-filters": withCtx(({ filters, onFilter }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"${_scopeId}><!--[-->`);
              ssrRenderList([
                { id: "code", label: "Code" },
                { id: "libelle", label: "Libell\xE9" },
                { id: "user_name", label: "Agent" },
                { id: "matricule", label: "Matricule" }
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
                    { id: "user_name", label: "Agent" },
                    { id: "matricule", label: "Matricule" }
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
          "cell-code": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100"${_scopeId}>${ssrInterpolate(value || "N/A")}</span>`);
            } else {
              return [
                createVNode("span", { class: "inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100" }, toDisplayString(value || "N/A"), 1)
              ];
            }
          }),
          "cell-libelle": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="text-xs text-slate-900 font-semibold"${_scopeId}>${ssrInterpolate(value || "N/A")}</span>`);
            } else {
              return [
                createVNode("span", { class: "text-xs text-slate-900 font-semibold" }, toDisplayString(value || "N/A"), 1)
              ];
            }
          }),
          "cell-user_name": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="text-xs text-slate-700 font-medium"${_scopeId}>${ssrInterpolate(value || "Non assign\xE9")}</span>`);
            } else {
              return [
                createVNode("span", { class: "text-xs text-slate-700 font-medium" }, toDisplayString(value || "Non assign\xE9"), 1)
              ];
            }
          }),
          "cell-matricule": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="inline-flex px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-slate-100 text-slate-600 border border-slate-200"${_scopeId}>${ssrInterpolate(value || "N/A")}</span>`);
            } else {
              return [
                createVNode("span", { class: "inline-flex px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-slate-100 text-slate-600 border border-slate-200" }, toDisplayString(value || "N/A"), 1)
              ];
            }
          }),
          "cell-is_interim": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="${ssrRenderClass([{
                "bg-orange-50 text-orange-700 border-orange-100": value === true,
                "bg-blue-50 text-blue-700 border-blue-100": value === false
              }, "inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border"])}"${_scopeId}>${ssrInterpolate(value ? "Int\xE9rim" : "Titulaire")}</span>`);
            } else {
              return [
                createVNode("span", {
                  class: ["inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border", {
                    "bg-orange-50 text-orange-700 border-orange-100": value === true,
                    "bg-blue-50 text-blue-700 border-blue-100": value === false
                  }]
                }, toDisplayString(value ? "Int\xE9rim" : "Titulaire"), 3)
              ];
            }
          }),
          "cell-statut": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="${ssrRenderClass([{
                "bg-green-50 text-green-700 border-green-100": value === true,
                "bg-red-50 text-red-700 border-red-100": value === false
              }, "inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border"])}"${_scopeId}>${ssrInterpolate(value ? "Actif" : "Inactif")}</span>`);
            } else {
              return [
                createVNode("span", {
                  class: ["inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border", {
                    "bg-green-50 text-green-700 border-green-100": value === true,
                    "bg-red-50 text-red-700 border-red-100": value === false
                  }]
                }, toDisplayString(value ? "Actif" : "Inactif"), 3)
              ];
            }
          }),
          "cell-date_debut": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="text-xs text-slate-600 font-medium"${_scopeId}>${ssrInterpolate(value ? formatDate(value) : "Non d\xE9finie")}</span>`);
            } else {
              return [
                createVNode("span", { class: "text-xs text-slate-600 font-medium" }, toDisplayString(value ? formatDate(value) : "Non d\xE9finie"), 1)
              ];
            }
          }),
          "cell-date_fin": withCtx(({ value, item }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="${ssrRenderClass([{
                "text-slate-400 italic": item.statut === true,
                "text-slate-600": item.statut === false
              }, "text-xs text-slate-600 font-medium"])}"${_scopeId}>${ssrInterpolate(item.statut ? "Non applicable" : value ? formatDate(value) : "Non d\xE9finie")}</span>`);
            } else {
              return [
                createVNode("span", {
                  class: ["text-xs text-slate-600 font-medium", {
                    "text-slate-400 italic": item.statut === true,
                    "text-slate-600": item.statut === false
                  }]
                }, toDisplayString(item.statut ? "Non applicable" : value ? formatDate(value) : "Non d\xE9finie"), 3)
              ];
            }
          }),
          "cell-piece_jointe_url": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (value) {
                _push2(`<button class="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded hover:bg-indigo-100 active:scale-95 transition-all"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "i-heroicons-paper-clip",
                  class: "w-3 h-3 !text-indigo-600"
                }, null, _parent2, _scopeId));
                _push2(` Voir </button>`);
              } else {
                _push2(`<span class="text-xs text-slate-400 italic"${_scopeId}>Aucun fichier</span>`);
              }
            } else {
              return [
                value ? (openBlock(), createBlock("button", {
                  key: 0,
                  onClick: withModifiers(($event) => openAttachmentModal(value), ["stop"]),
                  class: "inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded hover:bg-indigo-100 active:scale-95 transition-all"
                }, [
                  createVNode(_component_Icon, {
                    name: "i-heroicons-paper-clip",
                    class: "w-3 h-3 !text-indigo-600"
                  }),
                  createTextVNode(" Voir ")
                ], 8, ["onClick"])) : (openBlock(), createBlock("span", {
                  key: 1,
                  class: "text-xs text-slate-400 italic"
                }, "Aucun fichier"))
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(ssrRenderComponent(_component_UModal, {
        modelValue: showEditModal.value,
        "onUpdate:modelValue": ($event) => showEditModal.value = $event,
        ui: { width: "sm:max-w-2xl" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UCard, null, {
              header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                var _a, _b;
                if (_push3) {
                  _push3(`<div class="flex items-center justify-between"${_scopeId2}><h3 class="text-lg font-bold text-slate-900"${_scopeId2}>${ssrInterpolate(((_a = selectedItem.value) == null ? void 0 : _a.statut) ? "D\xE9sactiver l'assignation" : "R\xE9activer l'assignation")}</h3>`);
                  _push3(ssrRenderComponent(_component_UButton, {
                    color: "gray",
                    variant: "ghost",
                    icon: "i-heroicons-x-mark-20-solid",
                    onClick: closeEditModal
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex items-center justify-between" }, [
                      createVNode("h3", { class: "text-lg font-bold text-slate-900" }, toDisplayString(((_b = selectedItem.value) == null ? void 0 : _b.statut) ? "D\xE9sactiver l'assignation" : "R\xE9activer l'assignation"), 1),
                      createVNode(_component_UButton, {
                        color: "gray",
                        variant: "ghost",
                        icon: "i-heroicons-x-mark-20-solid",
                        onClick: closeEditModal
                      })
                    ])
                  ];
                }
              }),
              footer: withCtx((_2, _push3, _parent3, _scopeId2) => {
                var _a, _b, _c, _d;
                if (_push3) {
                  _push3(`<div class="flex justify-end gap-3"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UButton, {
                    color: "gray",
                    variant: "outline",
                    onClick: closeEditModal,
                    disabled: submitting.value
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Annuler `);
                      } else {
                        return [
                          createTextVNode(" Annuler ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    color: ((_a = selectedItem.value) == null ? void 0 : _a.statut) ? "red" : "green",
                    onClick: submitEdit,
                    loading: submitting.value,
                    disabled: ((_b = selectedItem.value) == null ? void 0 : _b.statut) && !editForm.value.date_fin
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      var _a2, _b2;
                      if (_push4) {
                        _push4(`${ssrInterpolate(((_a2 = selectedItem.value) == null ? void 0 : _a2.statut) ? "D\xE9sactiver" : "R\xE9activer")}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(((_b2 = selectedItem.value) == null ? void 0 : _b2.statut) ? "D\xE9sactiver" : "R\xE9activer"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex justify-end gap-3" }, [
                      createVNode(_component_UButton, {
                        color: "gray",
                        variant: "outline",
                        onClick: closeEditModal,
                        disabled: submitting.value
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Annuler ")
                        ]),
                        _: 1
                      }, 8, ["disabled"]),
                      createVNode(_component_UButton, {
                        color: ((_c = selectedItem.value) == null ? void 0 : _c.statut) ? "red" : "green",
                        onClick: submitEdit,
                        loading: submitting.value,
                        disabled: ((_d = selectedItem.value) == null ? void 0 : _d.statut) && !editForm.value.date_fin
                      }, {
                        default: withCtx(() => {
                          var _a2;
                          return [
                            createTextVNode(toDisplayString(((_a2 = selectedItem.value) == null ? void 0 : _a2.statut) ? "D\xE9sactiver" : "R\xE9activer"), 1)
                          ];
                        }),
                        _: 1
                      }, 8, ["color", "loading", "disabled"])
                    ])
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (selectedItem.value) {
                    _push3(`<div class="space-y-4"${_scopeId2}><div class="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200"${_scopeId2}><div${_scopeId2}><label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1"${_scopeId2}> Point critique </label><p class="text-sm font-semibold text-slate-900"${_scopeId2}>${ssrInterpolate(selectedItem.value.code)} - ${ssrInterpolate(selectedItem.value.libelle)}</p></div><div${_scopeId2}><label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1"${_scopeId2}> Agent </label><p class="text-sm font-semibold text-slate-900"${_scopeId2}>${ssrInterpolate(selectedItem.value.user_name)}</p><p class="text-xs text-slate-600 mt-0.5"${_scopeId2}> Matricule: ${ssrInterpolate(selectedItem.value.matricule)}</p></div>`);
                    if (selectedItem.value.piece_jointe_url) {
                      _push3(`<div${_scopeId2}><label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1"${_scopeId2}> Pi\xE8ce jointe actuelle </label><a${ssrRenderAttr("href", selectedItem.value.piece_jointe_url)} target="_blank" class="inline-flex items-center gap-2 px-3 py-2 text-sm text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"${_scopeId2}>`);
                      _push3(ssrRenderComponent(_component_Icon, {
                        name: "i-heroicons-paper-clip",
                        class: "w-4 h-4"
                      }, null, _parent3, _scopeId2));
                      _push3(` T\xE9l\xE9charger le fichier </a></div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`<div${_scopeId2}><label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1"${_scopeId2}> Type d&#39;assignation </label><span class="${ssrRenderClass([{
                      "bg-orange-50 text-orange-700 border-orange-100": selectedItem.value.is_interim === true,
                      "bg-blue-50 text-blue-700 border-blue-100": selectedItem.value.is_interim === false
                    }, "inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border"])}"${_scopeId2}>${ssrInterpolate(selectedItem.value.is_interim ? "Int\xE9rim" : "Titulaire")}</span></div><div${_scopeId2}><label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1"${_scopeId2}> Date de d\xE9but </label><p class="text-sm text-slate-700"${_scopeId2}>${ssrInterpolate(selectedItem.value.date_debut ? formatDate(selectedItem.value.date_debut) : "Non d\xE9finie")}</p></div><div${_scopeId2}><label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1"${_scopeId2}> Statut actuel </label><span class="${ssrRenderClass([{
                      "bg-green-50 text-green-700 border-green-100": selectedItem.value.statut === true,
                      "bg-red-50 text-red-700 border-red-100": selectedItem.value.statut === false
                    }, "inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border"])}"${_scopeId2}>${ssrInterpolate(selectedItem.value.statut ? "Actif" : "Inactif")}</span></div></div><div class="space-y-3"${_scopeId2}>`);
                    if (selectedItem.value.statut) {
                      _push3(`<div${_scopeId2}><label class="block text-xs font-bold text-slate-700 mb-1.5"${_scopeId2}> Date de fin <span class="text-red-500"${_scopeId2}>*</span></label><input${ssrRenderAttr("value", editForm.value.date_fin)} type="date"${ssrRenderAttr("min", selectedItem.value.date_debut ? selectedItem.value.date_debut.split("T")[0] : void 0)} class="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all" required${_scopeId2}><p class="text-xs text-slate-500 mt-1"${_scopeId2}> La date de fin doit \xEAtre post\xE9rieure ou \xE9gale \xE0 la date de d\xE9but </p></div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    if (!selectedItem.value.statut) {
                      _push3(`<div class="p-3 bg-green-50 border border-green-200 rounded-lg"${_scopeId2}><p class="text-sm text-green-800"${_scopeId2}> Cette action r\xE9activera l&#39;assignation et supprimera la date de fin. </p></div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`<div class="p-3 bg-blue-50 border border-blue-200 rounded-lg"${_scopeId2}><p class="text-xs text-blue-800"${_scopeId2}><strong${_scopeId2}>Action :</strong> ${ssrInterpolate(selectedItem.value.statut ? "L'assignation sera d\xE9sactiv\xE9e" : "L'assignation sera r\xE9activ\xE9e")}</p></div></div>`);
                    if (editError.value) {
                      _push3(`<div class="p-3 bg-red-50 border border-red-200 rounded-lg"${_scopeId2}><p class="text-sm text-red-800"${_scopeId2}>${ssrInterpolate(editError.value)}</p></div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    selectedItem.value ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "space-y-4"
                    }, [
                      createVNode("div", { class: "space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200" }, [
                        createVNode("div", null, [
                          createVNode("label", { class: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" }, " Point critique "),
                          createVNode("p", { class: "text-sm font-semibold text-slate-900" }, toDisplayString(selectedItem.value.code) + " - " + toDisplayString(selectedItem.value.libelle), 1)
                        ]),
                        createVNode("div", null, [
                          createVNode("label", { class: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" }, " Agent "),
                          createVNode("p", { class: "text-sm font-semibold text-slate-900" }, toDisplayString(selectedItem.value.user_name), 1),
                          createVNode("p", { class: "text-xs text-slate-600 mt-0.5" }, " Matricule: " + toDisplayString(selectedItem.value.matricule), 1)
                        ]),
                        selectedItem.value.piece_jointe_url ? (openBlock(), createBlock("div", { key: 0 }, [
                          createVNode("label", { class: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" }, " Pi\xE8ce jointe actuelle "),
                          createVNode("a", {
                            href: selectedItem.value.piece_jointe_url,
                            target: "_blank",
                            class: "inline-flex items-center gap-2 px-3 py-2 text-sm text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
                          }, [
                            createVNode(_component_Icon, {
                              name: "i-heroicons-paper-clip",
                              class: "w-4 h-4"
                            }),
                            createTextVNode(" T\xE9l\xE9charger le fichier ")
                          ], 8, ["href"])
                        ])) : createCommentVNode("", true),
                        createVNode("div", null, [
                          createVNode("label", { class: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" }, " Type d'assignation "),
                          createVNode("span", {
                            class: ["inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border", {
                              "bg-orange-50 text-orange-700 border-orange-100": selectedItem.value.is_interim === true,
                              "bg-blue-50 text-blue-700 border-blue-100": selectedItem.value.is_interim === false
                            }]
                          }, toDisplayString(selectedItem.value.is_interim ? "Int\xE9rim" : "Titulaire"), 3)
                        ]),
                        createVNode("div", null, [
                          createVNode("label", { class: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" }, " Date de d\xE9but "),
                          createVNode("p", { class: "text-sm text-slate-700" }, toDisplayString(selectedItem.value.date_debut ? formatDate(selectedItem.value.date_debut) : "Non d\xE9finie"), 1)
                        ]),
                        createVNode("div", null, [
                          createVNode("label", { class: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" }, " Statut actuel "),
                          createVNode("span", {
                            class: ["inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border", {
                              "bg-green-50 text-green-700 border-green-100": selectedItem.value.statut === true,
                              "bg-red-50 text-red-700 border-red-100": selectedItem.value.statut === false
                            }]
                          }, toDisplayString(selectedItem.value.statut ? "Actif" : "Inactif"), 3)
                        ])
                      ]),
                      createVNode("div", { class: "space-y-3" }, [
                        selectedItem.value.statut ? (openBlock(), createBlock("div", { key: 0 }, [
                          createVNode("label", { class: "block text-xs font-bold text-slate-700 mb-1.5" }, [
                            createTextVNode(" Date de fin "),
                            createVNode("span", { class: "text-red-500" }, "*")
                          ]),
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => editForm.value.date_fin = $event,
                            type: "date",
                            min: selectedItem.value.date_debut ? selectedItem.value.date_debut.split("T")[0] : void 0,
                            class: "w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all",
                            required: ""
                          }, null, 8, ["onUpdate:modelValue", "min"]), [
                            [vModelText, editForm.value.date_fin]
                          ]),
                          createVNode("p", { class: "text-xs text-slate-500 mt-1" }, " La date de fin doit \xEAtre post\xE9rieure ou \xE9gale \xE0 la date de d\xE9but ")
                        ])) : createCommentVNode("", true),
                        !selectedItem.value.statut ? (openBlock(), createBlock("div", {
                          key: 1,
                          class: "p-3 bg-green-50 border border-green-200 rounded-lg"
                        }, [
                          createVNode("p", { class: "text-sm text-green-800" }, " Cette action r\xE9activera l'assignation et supprimera la date de fin. ")
                        ])) : createCommentVNode("", true),
                        createVNode("div", { class: "p-3 bg-blue-50 border border-blue-200 rounded-lg" }, [
                          createVNode("p", { class: "text-xs text-blue-800" }, [
                            createVNode("strong", null, "Action :"),
                            createTextVNode(" " + toDisplayString(selectedItem.value.statut ? "L'assignation sera d\xE9sactiv\xE9e" : "L'assignation sera r\xE9activ\xE9e"), 1)
                          ])
                        ])
                      ]),
                      editError.value ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "p-3 bg-red-50 border border-red-200 rounded-lg"
                      }, [
                        createVNode("p", { class: "text-sm text-red-800" }, toDisplayString(editError.value), 1)
                      ])) : createCommentVNode("", true)
                    ])) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UCard, null, {
                header: withCtx(() => {
                  var _a;
                  return [
                    createVNode("div", { class: "flex items-center justify-between" }, [
                      createVNode("h3", { class: "text-lg font-bold text-slate-900" }, toDisplayString(((_a = selectedItem.value) == null ? void 0 : _a.statut) ? "D\xE9sactiver l'assignation" : "R\xE9activer l'assignation"), 1),
                      createVNode(_component_UButton, {
                        color: "gray",
                        variant: "ghost",
                        icon: "i-heroicons-x-mark-20-solid",
                        onClick: closeEditModal
                      })
                    ])
                  ];
                }),
                footer: withCtx(() => {
                  var _a, _b;
                  return [
                    createVNode("div", { class: "flex justify-end gap-3" }, [
                      createVNode(_component_UButton, {
                        color: "gray",
                        variant: "outline",
                        onClick: closeEditModal,
                        disabled: submitting.value
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Annuler ")
                        ]),
                        _: 1
                      }, 8, ["disabled"]),
                      createVNode(_component_UButton, {
                        color: ((_a = selectedItem.value) == null ? void 0 : _a.statut) ? "red" : "green",
                        onClick: submitEdit,
                        loading: submitting.value,
                        disabled: ((_b = selectedItem.value) == null ? void 0 : _b.statut) && !editForm.value.date_fin
                      }, {
                        default: withCtx(() => {
                          var _a2;
                          return [
                            createTextVNode(toDisplayString(((_a2 = selectedItem.value) == null ? void 0 : _a2.statut) ? "D\xE9sactiver" : "R\xE9activer"), 1)
                          ];
                        }),
                        _: 1
                      }, 8, ["color", "loading", "disabled"])
                    ])
                  ];
                }),
                default: withCtx(() => [
                  selectedItem.value ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "space-y-4"
                  }, [
                    createVNode("div", { class: "space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200" }, [
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" }, " Point critique "),
                        createVNode("p", { class: "text-sm font-semibold text-slate-900" }, toDisplayString(selectedItem.value.code) + " - " + toDisplayString(selectedItem.value.libelle), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" }, " Agent "),
                        createVNode("p", { class: "text-sm font-semibold text-slate-900" }, toDisplayString(selectedItem.value.user_name), 1),
                        createVNode("p", { class: "text-xs text-slate-600 mt-0.5" }, " Matricule: " + toDisplayString(selectedItem.value.matricule), 1)
                      ]),
                      selectedItem.value.piece_jointe_url ? (openBlock(), createBlock("div", { key: 0 }, [
                        createVNode("label", { class: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" }, " Pi\xE8ce jointe actuelle "),
                        createVNode("a", {
                          href: selectedItem.value.piece_jointe_url,
                          target: "_blank",
                          class: "inline-flex items-center gap-2 px-3 py-2 text-sm text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
                        }, [
                          createVNode(_component_Icon, {
                            name: "i-heroicons-paper-clip",
                            class: "w-4 h-4"
                          }),
                          createTextVNode(" T\xE9l\xE9charger le fichier ")
                        ], 8, ["href"])
                      ])) : createCommentVNode("", true),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" }, " Type d'assignation "),
                        createVNode("span", {
                          class: ["inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border", {
                            "bg-orange-50 text-orange-700 border-orange-100": selectedItem.value.is_interim === true,
                            "bg-blue-50 text-blue-700 border-blue-100": selectedItem.value.is_interim === false
                          }]
                        }, toDisplayString(selectedItem.value.is_interim ? "Int\xE9rim" : "Titulaire"), 3)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" }, " Date de d\xE9but "),
                        createVNode("p", { class: "text-sm text-slate-700" }, toDisplayString(selectedItem.value.date_debut ? formatDate(selectedItem.value.date_debut) : "Non d\xE9finie"), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" }, " Statut actuel "),
                        createVNode("span", {
                          class: ["inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border", {
                            "bg-green-50 text-green-700 border-green-100": selectedItem.value.statut === true,
                            "bg-red-50 text-red-700 border-red-100": selectedItem.value.statut === false
                          }]
                        }, toDisplayString(selectedItem.value.statut ? "Actif" : "Inactif"), 3)
                      ])
                    ]),
                    createVNode("div", { class: "space-y-3" }, [
                      selectedItem.value.statut ? (openBlock(), createBlock("div", { key: 0 }, [
                        createVNode("label", { class: "block text-xs font-bold text-slate-700 mb-1.5" }, [
                          createTextVNode(" Date de fin "),
                          createVNode("span", { class: "text-red-500" }, "*")
                        ]),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => editForm.value.date_fin = $event,
                          type: "date",
                          min: selectedItem.value.date_debut ? selectedItem.value.date_debut.split("T")[0] : void 0,
                          class: "w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all",
                          required: ""
                        }, null, 8, ["onUpdate:modelValue", "min"]), [
                          [vModelText, editForm.value.date_fin]
                        ]),
                        createVNode("p", { class: "text-xs text-slate-500 mt-1" }, " La date de fin doit \xEAtre post\xE9rieure ou \xE9gale \xE0 la date de d\xE9but ")
                      ])) : createCommentVNode("", true),
                      !selectedItem.value.statut ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "p-3 bg-green-50 border border-green-200 rounded-lg"
                      }, [
                        createVNode("p", { class: "text-sm text-green-800" }, " Cette action r\xE9activera l'assignation et supprimera la date de fin. ")
                      ])) : createCommentVNode("", true),
                      createVNode("div", { class: "p-3 bg-blue-50 border border-blue-200 rounded-lg" }, [
                        createVNode("p", { class: "text-xs text-blue-800" }, [
                          createVNode("strong", null, "Action :"),
                          createTextVNode(" " + toDisplayString(selectedItem.value.statut ? "L'assignation sera d\xE9sactiv\xE9e" : "L'assignation sera r\xE9activ\xE9e"), 1)
                        ])
                      ])
                    ]),
                    editError.value ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "p-3 bg-red-50 border border-red-200 rounded-lg"
                    }, [
                      createVNode("p", { class: "text-sm text-red-800" }, toDisplayString(editError.value), 1)
                    ])) : createCommentVNode("", true)
                  ])) : createCommentVNode("", true)
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UModal, {
        modelValue: showAttachmentModal.value,
        "onUpdate:modelValue": ($event) => showAttachmentModal.value = $event,
        ui: { width: "sm:max-w-4xl" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UCard, { ui: { body: { padding: "p-0" } } }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (attachmentLoading.value) {
                    _push3(`<div class="flex flex-col items-center justify-center gap-3 py-20 bg-slate-50"${_scopeId2}><div class="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"${_scopeId2}></div><span class="text-sm text-slate-500 font-medium"${_scopeId2}>Chargement du fichier...</span></div>`);
                  } else if (attachmentError.value) {
                    _push3(`<div class="flex flex-col items-center justify-center gap-4 py-16 bg-slate-50"${_scopeId2}><div class="w-14 h-14 flex items-center justify-center rounded-full bg-red-100"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_Icon, {
                      name: "i-heroicons-exclamation-triangle",
                      class: "w-7 h-7 text-red-500"
                    }, null, _parent3, _scopeId2));
                    _push3(`</div><p class="text-sm text-red-700 font-medium"${_scopeId2}>${ssrInterpolate(attachmentError.value)}</p></div>`);
                  } else if (attachmentBlobUrl.value && attachmentType.value === "pdf") {
                    _push3(`<div class="w-full" style="${ssrRenderStyle({ "height": "75vh" })}"${_scopeId2}><iframe${ssrRenderAttr("src", attachmentBlobUrl.value + "#toolbar=1&navpanes=0&view=FitH")} class="w-full h-full border-0" title="Pi\xE8ce jointe PDF"${_scopeId2}></iframe></div>`);
                  } else if (attachmentBlobUrl.value && attachmentType.value === "image") {
                    _push3(`<div class="flex items-center justify-center p-6 bg-slate-50" style="${ssrRenderStyle({ "min-height": "40vh" })}"${_scopeId2}><img${ssrRenderAttr("src", attachmentBlobUrl.value)}${ssrRenderAttr("alt", attachmentFileName.value)} class="max-w-full max-h-[65vh] object-contain rounded shadow-md"${_scopeId2}></div>`);
                  } else if (attachmentBlobUrl.value) {
                    _push3(`<div class="flex flex-col items-center justify-center gap-4 py-16 bg-slate-50"${_scopeId2}><div class="w-16 h-16 flex items-center justify-center rounded-full bg-slate-200"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_Icon, {
                      name: "i-heroicons-document",
                      class: "w-8 h-8 text-slate-500"
                    }, null, _parent3, _scopeId2));
                    _push3(`</div><p class="text-sm text-slate-600 font-medium"${_scopeId2}>Aper\xE7u non disponible pour ce type de fichier</p><a${ssrRenderAttr("href", attachmentBlobUrl.value)}${ssrRenderAttr("download", attachmentFileName.value)} class="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_Icon, {
                      name: "i-heroicons-arrow-down-tray",
                      class: "w-4 h-4"
                    }, null, _parent3, _scopeId2));
                    _push3(` T\xE9l\xE9charger le fichier </a></div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    attachmentLoading.value ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "flex flex-col items-center justify-center gap-3 py-20 bg-slate-50"
                    }, [
                      createVNode("div", { class: "w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" }),
                      createVNode("span", { class: "text-sm text-slate-500 font-medium" }, "Chargement du fichier...")
                    ])) : attachmentError.value ? (openBlock(), createBlock("div", {
                      key: 1,
                      class: "flex flex-col items-center justify-center gap-4 py-16 bg-slate-50"
                    }, [
                      createVNode("div", { class: "w-14 h-14 flex items-center justify-center rounded-full bg-red-100" }, [
                        createVNode(_component_Icon, {
                          name: "i-heroicons-exclamation-triangle",
                          class: "w-7 h-7 text-red-500"
                        })
                      ]),
                      createVNode("p", { class: "text-sm text-red-700 font-medium" }, toDisplayString(attachmentError.value), 1)
                    ])) : attachmentBlobUrl.value && attachmentType.value === "pdf" ? (openBlock(), createBlock("div", {
                      key: 2,
                      class: "w-full",
                      style: { "height": "75vh" }
                    }, [
                      createVNode("iframe", {
                        src: attachmentBlobUrl.value + "#toolbar=1&navpanes=0&view=FitH",
                        class: "w-full h-full border-0",
                        title: "Pi\xE8ce jointe PDF"
                      }, null, 8, ["src"])
                    ])) : attachmentBlobUrl.value && attachmentType.value === "image" ? (openBlock(), createBlock("div", {
                      key: 3,
                      class: "flex items-center justify-center p-6 bg-slate-50",
                      style: { "min-height": "40vh" }
                    }, [
                      createVNode("img", {
                        src: attachmentBlobUrl.value,
                        alt: attachmentFileName.value,
                        class: "max-w-full max-h-[65vh] object-contain rounded shadow-md"
                      }, null, 8, ["src", "alt"])
                    ])) : attachmentBlobUrl.value ? (openBlock(), createBlock("div", {
                      key: 4,
                      class: "flex flex-col items-center justify-center gap-4 py-16 bg-slate-50"
                    }, [
                      createVNode("div", { class: "w-16 h-16 flex items-center justify-center rounded-full bg-slate-200" }, [
                        createVNode(_component_Icon, {
                          name: "i-heroicons-document",
                          class: "w-8 h-8 text-slate-500"
                        })
                      ]),
                      createVNode("p", { class: "text-sm text-slate-600 font-medium" }, "Aper\xE7u non disponible pour ce type de fichier"),
                      createVNode("a", {
                        href: attachmentBlobUrl.value,
                        download: attachmentFileName.value,
                        class: "inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                      }, [
                        createVNode(_component_Icon, {
                          name: "i-heroicons-arrow-down-tray",
                          class: "w-4 h-4"
                        }),
                        createTextVNode(" T\xE9l\xE9charger le fichier ")
                      ], 8, ["href", "download"])
                    ])) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UCard, { ui: { body: { padding: "p-0" } } }, {
                default: withCtx(() => [
                  attachmentLoading.value ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "flex flex-col items-center justify-center gap-3 py-20 bg-slate-50"
                  }, [
                    createVNode("div", { class: "w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" }),
                    createVNode("span", { class: "text-sm text-slate-500 font-medium" }, "Chargement du fichier...")
                  ])) : attachmentError.value ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "flex flex-col items-center justify-center gap-4 py-16 bg-slate-50"
                  }, [
                    createVNode("div", { class: "w-14 h-14 flex items-center justify-center rounded-full bg-red-100" }, [
                      createVNode(_component_Icon, {
                        name: "i-heroicons-exclamation-triangle",
                        class: "w-7 h-7 text-red-500"
                      })
                    ]),
                    createVNode("p", { class: "text-sm text-red-700 font-medium" }, toDisplayString(attachmentError.value), 1)
                  ])) : attachmentBlobUrl.value && attachmentType.value === "pdf" ? (openBlock(), createBlock("div", {
                    key: 2,
                    class: "w-full",
                    style: { "height": "75vh" }
                  }, [
                    createVNode("iframe", {
                      src: attachmentBlobUrl.value + "#toolbar=1&navpanes=0&view=FitH",
                      class: "w-full h-full border-0",
                      title: "Pi\xE8ce jointe PDF"
                    }, null, 8, ["src"])
                  ])) : attachmentBlobUrl.value && attachmentType.value === "image" ? (openBlock(), createBlock("div", {
                    key: 3,
                    class: "flex items-center justify-center p-6 bg-slate-50",
                    style: { "min-height": "40vh" }
                  }, [
                    createVNode("img", {
                      src: attachmentBlobUrl.value,
                      alt: attachmentFileName.value,
                      class: "max-w-full max-h-[65vh] object-contain rounded shadow-md"
                    }, null, 8, ["src", "alt"])
                  ])) : attachmentBlobUrl.value ? (openBlock(), createBlock("div", {
                    key: 4,
                    class: "flex flex-col items-center justify-center gap-4 py-16 bg-slate-50"
                  }, [
                    createVNode("div", { class: "w-16 h-16 flex items-center justify-center rounded-full bg-slate-200" }, [
                      createVNode(_component_Icon, {
                        name: "i-heroicons-document",
                        class: "w-8 h-8 text-slate-500"
                      })
                    ]),
                    createVNode("p", { class: "text-sm text-slate-600 font-medium" }, "Aper\xE7u non disponible pour ce type de fichier"),
                    createVNode("a", {
                      href: attachmentBlobUrl.value,
                      download: attachmentFileName.value,
                      class: "inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                    }, [
                      createVNode(_component_Icon, {
                        name: "i-heroicons-arrow-down-tray",
                        class: "w-4 h-4"
                      }),
                      createTextVNode(" T\xE9l\xE9charger le fichier ")
                    ], 8, ["href", "download"])
                  ])) : createCommentVNode("", true)
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/point_critique/Point_critique_history.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_sfc_main$2, null, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, null, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/point-critique/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BbCir_t0.mjs.map
