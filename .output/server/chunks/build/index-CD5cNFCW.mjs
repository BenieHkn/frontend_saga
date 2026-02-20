import { ssrRenderComponent, ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrRenderList } from 'vue/server-renderer';
import __nuxt_component_0 from './index-DJmPz9HS.mjs';
import __nuxt_component_0$1 from './Modal-BXvFVpvj.mjs';
import __nuxt_component_0$2 from './Card-CAWDi9lB.mjs';
import __nuxt_component_2 from './Button-D4Pv8nAk.mjs';
import { ref, mergeProps, withCtx, createBlock, openBlock, createVNode, createTextVNode, toDisplayString, Fragment, renderList, withDirectives, vModelText, createCommentVNode, useSSRContext } from 'vue';
import { _ as _sfc_main$2 } from './DataTable-87jejf7-.mjs';
import { u as useHead, n as navigateTo, c as useRuntimeConfig } from './server.mjs';
import { u as useToast } from './useToast-VyEsrynn.mjs';
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
import './tooltip-lourJnw0.mjs';
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
import './useButtonGroup-DPIFBtCe.mjs';
import './button-Bz5rwL6o.mjs';
import './Input-3IU7zE8e.mjs';
import './useFormGroup-2eEELX00.mjs';
import './index-BLXEZ1Ia.mjs';
import './Badge-C_KHizXa.mjs';
import './Select-BY_Jn5yn.mjs';
import './Checkbox-Nzn56Oau.mjs';
import 'pinia';
import 'vue-router';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main$1 = {
  __name: "InterimList",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Int\xE9rims - Sagar Revolution"
    });
    const showEditModal = ref(false);
    const selectedItem = ref(null);
    const submitting = ref(false);
    const editError = ref(null);
    const editForm = ref({
      date_fin: "",
      actif: false
    });
    const columns = [
      { key: "code", label: "Code", visible: true },
      { key: "libelle", label: "Entit\xE9", visible: true },
      { key: "fonction", label: "Fonction", visible: true },
      { key: "user_name", label: "Agent", visible: true },
      { key: "matricule", label: "Matricule", visible: true },
      { key: "is_responsable", label: "Type", visible: false },
      { key: "actif", label: "Statut", visible: true },
      { key: "date_debut", label: "Date d\xE9but", visible: true },
      { key: "date_fin", label: "Date fin", visible: true },
      { key: "piece_jointe_url", label: "Fichier", visible: true }
    ];
    const interims = ref([]);
    const loading = ref(false);
    const error = ref(null);
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
        return dateString;
      }
    };
    const loadInterims = async () => {
      loading.value = true;
      error.value = null;
      try {
        const token = localStorage.getItem("auth_token");
        const config = useRuntimeConfig();
        const response = await $fetch("/entite-users", {
          baseURL: config.public.apiBase,
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
          }
        });
        console.log("\u{1F4E6} Int\xE9rims charg\xE9s:", response);
        let dataArray = [];
        if ((response == null ? void 0 : response.data) && Array.isArray(response.data)) {
          dataArray = response.data;
        } else if (Array.isArray(response)) {
          dataArray = response;
        }
        interims.value = dataArray.map((item) => {
          var _a, _b;
          const user = item.user || {};
          const entite = item.entite || {};
          return {
            id: item.id,
            code: entite.code || "N/A",
            libelle: entite.libelle || "N/A",
            fonction: entite.fonction || "N/A",
            user_name: user.nom && user.prenom ? `${user.nom} ${user.prenom}` : "Non assign\xE9",
            matricule: user.matricule || "N/A",
            is_responsable: (_a = item.is_responsable) != null ? _a : false,
            actif: (_b = item.actif) != null ? _b : true,
            date_debut: item.date_debut || null,
            date_fin: item.date_fin || null,
            piece_jointe_url: item.piece_jointe_url || null,
            entite_id: item.entite_id,
            user_id: item.user_id
          };
        });
        console.log("\u2705 Int\xE9rims charg\xE9s:", interims.value.length);
      } catch (err) {
        console.error("\u274C Erreur chargement int\xE9rims:", err);
        error.value = err.message || "Erreur lors du chargement";
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
    const closeEditModal = () => {
      showEditModal.value = false;
      selectedItem.value = null;
      editForm.value = { date_fin: "", actif: false };
      editError.value = null;
    };
    const submitEdit = async () => {
      var _a;
      if (!selectedItem.value) return;
      if (selectedItem.value.actif && !editForm.value.date_fin) {
        editError.value = "La date de fin est requise";
        return;
      }
      submitting.value = true;
      editError.value = null;
      try {
        const token = localStorage.getItem("auth_token");
        const config = useRuntimeConfig();
        const formData = new FormData();
        formData.append("actif", !selectedItem.value.actif ? "1" : "0");
        if (selectedItem.value.actif && editForm.value.date_fin) {
          formData.append("date_fin", editForm.value.date_fin);
        } else if (!selectedItem.value.actif) {
          formData.append("date_fin", "");
        }
        formData.append("_method", "PUT");
        const response = await $fetch(`/entite-user/${selectedItem.value.id}`, {
          baseURL: config.public.apiBase,
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
          },
          body: formData
        });
        useToast().add({
          title: "Succ\xE8s",
          description: selectedItem.value.actif ? "Int\xE9rim d\xE9sactiv\xE9 avec succ\xE8s" : "Int\xE9rim r\xE9activ\xE9 avec succ\xE8s",
          color: "green"
        });
        closeEditModal();
        await loadInterims();
      } catch (err) {
        console.error("\u274C Erreur mise \xE0 jour:", err);
        editError.value = ((_a = err.data) == null ? void 0 : _a.message) || "Erreur lors de la mise \xE0 jour";
        useToast().add({
          title: "Erreur",
          description: editError.value,
          color: "red"
        });
      } finally {
        submitting.value = false;
      }
    };
    const onView = (item) => {
      navigateTo(`/interims/${item.id}`);
    };
    const onEdit = (item) => {
      selectedItem.value = { ...item };
      editForm.value = {
        date_fin: item.date_fin ? item.date_fin.split("T")[0] : "",
        actif: !item.actif
      };
      showEditModal.value = true;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0;
      const _component_UModal = __nuxt_component_0$1;
      const _component_UCard = __nuxt_component_0$2;
      const _component_UButton = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-slate-100 p-6 font-sans" }, _attrs))}><div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"><div><h1 class="text-2xl font-bold text-slate-900 tracking-tight">Liste des fonctions int\xE9rims</h1><p class="text-sm text-slate-500">Gestion des fonctions int\xE9rims (hors points critiques)</p></div></div>`);
      if (loading.value) {
        _push(`<div class="flex flex-col items-center justify-center py-20 gap-4 text-slate-500"><div class="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div><span class="text-sm font-medium">Chargement...</span></div>`);
      } else if (error.value) {
        _push(`<div class="flex items-center gap-4 p-5 bg-red-50 border border-red-200 rounded-xl max-w-2xl mx-auto sm:mx-0"><svg class="w-8 h-8 text-red-600 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg><div class="flex-1"><p class="text-sm font-bold text-red-900">Erreur de chargement</p><p class="text-xs text-red-700">${ssrInterpolate(error.value)}</p></div><button class="px-4 py-2 text-xs font-bold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors shrink-0"> R\xE9essayer </button></div>`);
      } else {
        _push(ssrRenderComponent(_sfc_main$2, {
          data: interims.value,
          columns,
          selectable: false,
          "left-aligned-columns": ["code", "libelle", "user_name", "fonction"],
          "show-delete-action": false,
          onEdit,
          onView
        }, {
          "advanced-filters": withCtx(({ filters, onFilter }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"${_scopeId}><!--[-->`);
              ssrRenderList([
                { id: "code", label: "Code Entit\xE9" },
                { id: "libelle", label: "Entit\xE9" },
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
                    { id: "code", label: "Code Entit\xE9" },
                    { id: "libelle", label: "Entit\xE9" },
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
          "cell-fonction": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="inline-flex px-2 py-1 text-[10px] font-semibold rounded bg-blue-50 text-blue-700 border border-blue-100"${_scopeId}>${ssrInterpolate(value || "N/A")}</span>`);
            } else {
              return [
                createVNode("span", { class: "inline-flex px-2 py-1 text-[10px] font-semibold rounded bg-blue-50 text-blue-700 border border-blue-100" }, toDisplayString(value || "N/A"), 1)
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
          "cell-is_responsable": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="${ssrRenderClass([{
                "bg-purple-50 text-purple-700 border-purple-100": value === true,
                "bg-slate-100 text-slate-600 border-slate-200": value === false
              }, "inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border"])}"${_scopeId}>${ssrInterpolate(value ? "Responsable" : "Agent")}</span>`);
            } else {
              return [
                createVNode("span", {
                  class: ["inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border", {
                    "bg-purple-50 text-purple-700 border-purple-100": value === true,
                    "bg-slate-100 text-slate-600 border-slate-200": value === false
                  }]
                }, toDisplayString(value ? "Responsable" : "Agent"), 3)
              ];
            }
          }),
          "cell-actif": withCtx(({ value }, _push2, _parent2, _scopeId) => {
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
                "text-slate-400 italic": item.actif === true && !value,
                "text-slate-600": value
              }, "text-xs text-slate-600 font-medium"])}"${_scopeId}>${ssrInterpolate(value ? formatDate(value) : "Non d\xE9finie")}</span>`);
            } else {
              return [
                createVNode("span", {
                  class: ["text-xs text-slate-600 font-medium", {
                    "text-slate-400 italic": item.actif === true && !value,
                    "text-slate-600": value
                  }]
                }, toDisplayString(value ? formatDate(value) : "Non d\xE9finie"), 3)
              ];
            }
          }),
          "cell-piece_jointe_url": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (value) {
                _push2(`<a${ssrRenderAttr("href", value)} target="_blank" class="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded hover:bg-indigo-100 transition-colors"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "i-heroicons-paper-clip",
                  class: "w-3 h-3"
                }, null, _parent2, _scopeId));
                _push2(` Voir </a>`);
              } else {
                _push2(`<span class="text-xs text-slate-400 italic"${_scopeId}>Aucun fichier</span>`);
              }
            } else {
              return [
                value ? (openBlock(), createBlock("a", {
                  key: 0,
                  href: value,
                  target: "_blank",
                  class: "inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded hover:bg-indigo-100 transition-colors"
                }, [
                  createVNode(_component_Icon, {
                    name: "i-heroicons-paper-clip",
                    class: "w-3 h-3"
                  }),
                  createTextVNode(" Voir ")
                ], 8, ["href"])) : (openBlock(), createBlock("span", {
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
                  _push3(`<div class="flex items-center justify-between"${_scopeId2}><h3 class="text-lg font-bold text-slate-900"${_scopeId2}>${ssrInterpolate(((_a = selectedItem.value) == null ? void 0 : _a.actif) ? "D\xE9sactiver l'int\xE9rim" : "R\xE9activer l'int\xE9rim")}</h3>`);
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
                      createVNode("h3", { class: "text-lg font-bold text-slate-900" }, toDisplayString(((_b = selectedItem.value) == null ? void 0 : _b.actif) ? "D\xE9sactiver l'int\xE9rim" : "R\xE9activer l'int\xE9rim"), 1),
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
                    color: ((_a = selectedItem.value) == null ? void 0 : _a.actif) ? "red" : "green",
                    onClick: submitEdit,
                    loading: submitting.value,
                    disabled: ((_b = selectedItem.value) == null ? void 0 : _b.actif) && !editForm.value.date_fin
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      var _a2, _b2;
                      if (_push4) {
                        _push4(`${ssrInterpolate(((_a2 = selectedItem.value) == null ? void 0 : _a2.actif) ? "D\xE9sactiver" : "R\xE9activer")}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(((_b2 = selectedItem.value) == null ? void 0 : _b2.actif) ? "D\xE9sactiver" : "R\xE9activer"), 1)
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
                        color: ((_c = selectedItem.value) == null ? void 0 : _c.actif) ? "red" : "green",
                        onClick: submitEdit,
                        loading: submitting.value,
                        disabled: ((_d = selectedItem.value) == null ? void 0 : _d.actif) && !editForm.value.date_fin
                      }, {
                        default: withCtx(() => {
                          var _a2;
                          return [
                            createTextVNode(toDisplayString(((_a2 = selectedItem.value) == null ? void 0 : _a2.actif) ? "D\xE9sactiver" : "R\xE9activer"), 1)
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
                    _push3(`<div class="space-y-4"${_scopeId2}><div class="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200"${_scopeId2}><div${_scopeId2}><label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1"${_scopeId2}> Entit\xE9 / Fonction </label><p class="text-sm font-semibold text-slate-900"${_scopeId2}>${ssrInterpolate(selectedItem.value.libelle)} - ${ssrInterpolate(selectedItem.value.fonction)}</p><p class="text-xs text-slate-600 mt-0.5"${_scopeId2}> Code: ${ssrInterpolate(selectedItem.value.code)}</p></div><div${_scopeId2}><label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1"${_scopeId2}> Agent </label><p class="text-sm font-semibold text-slate-900"${_scopeId2}>${ssrInterpolate(selectedItem.value.user_name)}</p><p class="text-xs text-slate-600 mt-0.5"${_scopeId2}> Matricule: ${ssrInterpolate(selectedItem.value.matricule)}</p></div>`);
                    if (selectedItem.value.piece_jointe_url) {
                      _push3(`<div${_scopeId2}><label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1"${_scopeId2}> Pi\xE8ce jointe </label><a${ssrRenderAttr("href", selectedItem.value.piece_jointe_url)} target="_blank" class="inline-flex items-center gap-2 px-3 py-2 text-sm text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"${_scopeId2}>`);
                      _push3(ssrRenderComponent(_component_Icon, {
                        name: "i-heroicons-paper-clip",
                        class: "w-4 h-4"
                      }, null, _parent3, _scopeId2));
                      _push3(` T\xE9l\xE9charger </a></div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`<div${_scopeId2}><label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1"${_scopeId2}> Date de d\xE9but </label><p class="text-sm text-slate-700"${_scopeId2}>${ssrInterpolate(selectedItem.value.date_debut ? formatDate(selectedItem.value.date_debut) : "Non d\xE9finie")}</p></div><div${_scopeId2}><label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1"${_scopeId2}> Statut actuel </label><span class="${ssrRenderClass([{
                      "bg-green-50 text-green-700 border-green-100": selectedItem.value.actif === true,
                      "bg-red-50 text-red-700 border-red-100": selectedItem.value.actif === false
                    }, "inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border"])}"${_scopeId2}>${ssrInterpolate(selectedItem.value.actif ? "Actif" : "Inactif")}</span></div></div><div class="space-y-3"${_scopeId2}>`);
                    if (selectedItem.value.actif) {
                      _push3(`<div${_scopeId2}><label class="block text-xs font-bold text-slate-700 mb-1.5"${_scopeId2}> Date de fin <span class="text-red-500"${_scopeId2}>*</span></label><input${ssrRenderAttr("value", editForm.value.date_fin)} type="date"${ssrRenderAttr("min", selectedItem.value.date_debut ? selectedItem.value.date_debut.split("T")[0] : void 0)} class="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all" required${_scopeId2}></div>`);
                    } else {
                      _push3(`<div class="p-3 bg-green-50 border border-green-200 rounded-lg"${_scopeId2}><p class="text-sm text-green-800"${_scopeId2}> Cette action r\xE9activera l&#39;int\xE9rim et supprimera la date de fin. </p></div>`);
                    }
                    _push3(`<div class="p-3 bg-blue-50 border border-blue-200 rounded-lg"${_scopeId2}><p class="text-xs text-blue-800"${_scopeId2}><strong${_scopeId2}>Action :</strong> ${ssrInterpolate(selectedItem.value.actif ? "L'int\xE9rim sera d\xE9sactiv\xE9" : "L'int\xE9rim sera r\xE9activ\xE9")}</p></div></div>`);
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
                          createVNode("label", { class: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" }, " Entit\xE9 / Fonction "),
                          createVNode("p", { class: "text-sm font-semibold text-slate-900" }, toDisplayString(selectedItem.value.libelle) + " - " + toDisplayString(selectedItem.value.fonction), 1),
                          createVNode("p", { class: "text-xs text-slate-600 mt-0.5" }, " Code: " + toDisplayString(selectedItem.value.code), 1)
                        ]),
                        createVNode("div", null, [
                          createVNode("label", { class: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" }, " Agent "),
                          createVNode("p", { class: "text-sm font-semibold text-slate-900" }, toDisplayString(selectedItem.value.user_name), 1),
                          createVNode("p", { class: "text-xs text-slate-600 mt-0.5" }, " Matricule: " + toDisplayString(selectedItem.value.matricule), 1)
                        ]),
                        selectedItem.value.piece_jointe_url ? (openBlock(), createBlock("div", { key: 0 }, [
                          createVNode("label", { class: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" }, " Pi\xE8ce jointe "),
                          createVNode("a", {
                            href: selectedItem.value.piece_jointe_url,
                            target: "_blank",
                            class: "inline-flex items-center gap-2 px-3 py-2 text-sm text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
                          }, [
                            createVNode(_component_Icon, {
                              name: "i-heroicons-paper-clip",
                              class: "w-4 h-4"
                            }),
                            createTextVNode(" T\xE9l\xE9charger ")
                          ], 8, ["href"])
                        ])) : createCommentVNode("", true),
                        createVNode("div", null, [
                          createVNode("label", { class: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" }, " Date de d\xE9but "),
                          createVNode("p", { class: "text-sm text-slate-700" }, toDisplayString(selectedItem.value.date_debut ? formatDate(selectedItem.value.date_debut) : "Non d\xE9finie"), 1)
                        ]),
                        createVNode("div", null, [
                          createVNode("label", { class: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" }, " Statut actuel "),
                          createVNode("span", {
                            class: ["inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border", {
                              "bg-green-50 text-green-700 border-green-100": selectedItem.value.actif === true,
                              "bg-red-50 text-red-700 border-red-100": selectedItem.value.actif === false
                            }]
                          }, toDisplayString(selectedItem.value.actif ? "Actif" : "Inactif"), 3)
                        ])
                      ]),
                      createVNode("div", { class: "space-y-3" }, [
                        selectedItem.value.actif ? (openBlock(), createBlock("div", { key: 0 }, [
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
                          ])
                        ])) : (openBlock(), createBlock("div", {
                          key: 1,
                          class: "p-3 bg-green-50 border border-green-200 rounded-lg"
                        }, [
                          createVNode("p", { class: "text-sm text-green-800" }, " Cette action r\xE9activera l'int\xE9rim et supprimera la date de fin. ")
                        ])),
                        createVNode("div", { class: "p-3 bg-blue-50 border border-blue-200 rounded-lg" }, [
                          createVNode("p", { class: "text-xs text-blue-800" }, [
                            createVNode("strong", null, "Action :"),
                            createTextVNode(" " + toDisplayString(selectedItem.value.actif ? "L'int\xE9rim sera d\xE9sactiv\xE9" : "L'int\xE9rim sera r\xE9activ\xE9"), 1)
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
                      createVNode("h3", { class: "text-lg font-bold text-slate-900" }, toDisplayString(((_a = selectedItem.value) == null ? void 0 : _a.actif) ? "D\xE9sactiver l'int\xE9rim" : "R\xE9activer l'int\xE9rim"), 1),
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
                        color: ((_a = selectedItem.value) == null ? void 0 : _a.actif) ? "red" : "green",
                        onClick: submitEdit,
                        loading: submitting.value,
                        disabled: ((_b = selectedItem.value) == null ? void 0 : _b.actif) && !editForm.value.date_fin
                      }, {
                        default: withCtx(() => {
                          var _a2;
                          return [
                            createTextVNode(toDisplayString(((_a2 = selectedItem.value) == null ? void 0 : _a2.actif) ? "D\xE9sactiver" : "R\xE9activer"), 1)
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
                        createVNode("label", { class: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" }, " Entit\xE9 / Fonction "),
                        createVNode("p", { class: "text-sm font-semibold text-slate-900" }, toDisplayString(selectedItem.value.libelle) + " - " + toDisplayString(selectedItem.value.fonction), 1),
                        createVNode("p", { class: "text-xs text-slate-600 mt-0.5" }, " Code: " + toDisplayString(selectedItem.value.code), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" }, " Agent "),
                        createVNode("p", { class: "text-sm font-semibold text-slate-900" }, toDisplayString(selectedItem.value.user_name), 1),
                        createVNode("p", { class: "text-xs text-slate-600 mt-0.5" }, " Matricule: " + toDisplayString(selectedItem.value.matricule), 1)
                      ]),
                      selectedItem.value.piece_jointe_url ? (openBlock(), createBlock("div", { key: 0 }, [
                        createVNode("label", { class: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" }, " Pi\xE8ce jointe "),
                        createVNode("a", {
                          href: selectedItem.value.piece_jointe_url,
                          target: "_blank",
                          class: "inline-flex items-center gap-2 px-3 py-2 text-sm text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
                        }, [
                          createVNode(_component_Icon, {
                            name: "i-heroicons-paper-clip",
                            class: "w-4 h-4"
                          }),
                          createTextVNode(" T\xE9l\xE9charger ")
                        ], 8, ["href"])
                      ])) : createCommentVNode("", true),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" }, " Date de d\xE9but "),
                        createVNode("p", { class: "text-sm text-slate-700" }, toDisplayString(selectedItem.value.date_debut ? formatDate(selectedItem.value.date_debut) : "Non d\xE9finie"), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" }, " Statut actuel "),
                        createVNode("span", {
                          class: ["inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border", {
                            "bg-green-50 text-green-700 border-green-100": selectedItem.value.actif === true,
                            "bg-red-50 text-red-700 border-red-100": selectedItem.value.actif === false
                          }]
                        }, toDisplayString(selectedItem.value.actif ? "Actif" : "Inactif"), 3)
                      ])
                    ]),
                    createVNode("div", { class: "space-y-3" }, [
                      selectedItem.value.actif ? (openBlock(), createBlock("div", { key: 0 }, [
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
                        ])
                      ])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "p-3 bg-green-50 border border-green-200 rounded-lg"
                      }, [
                        createVNode("p", { class: "text-sm text-green-800" }, " Cette action r\xE9activera l'int\xE9rim et supprimera la date de fin. ")
                      ])),
                      createVNode("div", { class: "p-3 bg-blue-50 border border-blue-200 rounded-lg" }, [
                        createVNode("p", { class: "text-xs text-blue-800" }, [
                          createVNode("strong", null, "Action :"),
                          createTextVNode(" " + toDisplayString(selectedItem.value.actif ? "L'int\xE9rim sera d\xE9sactiv\xE9" : "L'int\xE9rim sera r\xE9activ\xE9"), 1)
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
      _push(`</div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/interim/InterimList.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, null, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/interim/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CD5cNFCW.mjs.map
