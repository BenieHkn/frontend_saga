import { ref, computed, mergeProps, withCtx, createVNode, createTextVNode, unref, toDisplayString, withDirectives, vModelText, createBlock, openBlock, createCommentVNode, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderAttr, ssrRenderList } from 'vue/server-renderer';
import __nuxt_component_0 from './index-DJmPz9HS.mjs';
import __nuxt_component_1 from './Badge-C_KHizXa.mjs';
import __nuxt_component_2 from './Button-D4Pv8nAk.mjs';
import { u as useHead, _ as _export_sfc, c as useRuntimeConfig, n as navigateTo } from './server.mjs';
import { _ as _sfc_main$5 } from './DataTable-87jejf7-.mjs';
import __nuxt_component_0$1 from './Modal-BXvFVpvj.mjs';
import { u as useAffectationsStore } from './affectations-Bp-zzr69.mjs';
import Swal from 'sweetalert2';
import { u as useToast } from './useToast-VyEsrynn.mjs';
import { _ as _sfc_main$3 } from './PageHeader-OIWZwZf2.mjs';
import { _ as _sfc_main$4 } from './AppTabs-B2KNyztb.mjs';
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
import './Icon-BEWG_Jy9.mjs';
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

const useTransferts = () => {
  const transferts = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const config = useRuntimeConfig();
  const getToken = () => {
    return localStorage.getItem("token") || localStorage.getItem("auth_token");
  };
  const transformTransfertData = (data) => {
    return data.map((item) => {
      var _a, _b, _c, _d, _e, _f;
      return {
        id: item.id,
        date_transfert: new Date(item.date_affect).toLocaleDateString("fr-FR"),
        objet: item.instructions,
        statut: item.statut,
        type: item.type_affectation,
        courrier: ((_b = (_a = item.courrier_arrive) == null ? void 0 : _a.document) == null ? void 0 : _b.objet) || "N/A",
        emetteur: ((_d = (_c = item.emetteur) == null ? void 0 : _c.entite) == null ? void 0 : _d.fonction) || "N/A",
        destinataire: ((_f = (_e = item.destinataire) == null ? void 0 : _e.entite) == null ? void 0 : _f.fonction) || "N/A",
        // Garder les données complètes pour les actions
        _raw: item
      };
    });
  };
  const fetchTransferts = async () => {
    loading.value = true;
    error.value = null;
    const entite_user = JSON.parse(localStorage.getItem("entite_user"));
    try {
      const token = getToken();
      if (!token) {
        throw new Error("Token d'authentification non trouv\xE9");
      }
      const response = await fetch(`${config.public.apiBase}/transferts/user/${entite_user.id}/emitted`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const result = await response.json();
      console.log("Transferts r\xE9cup\xE9r\xE9s", result.data);
      if (result.data) {
        transferts.value = transformTransfertData(result.data);
        console.log(transferts.value);
      } else {
        throw new Error("Format de r\xE9ponse invalide");
      }
    } catch (err) {
      error.value = err.message;
      console.error("Erreur lors du chargement des transferts:", err);
    } finally {
      loading.value = false;
    }
  };
  const tableData = computed(() => transferts.value);
  return {
    transferts,
    loading,
    error,
    fetchTransferts,
    tableData,
    config
  };
};
const _sfc_main$2 = {
  __name: "TransfertsListe",
  __ssrInlineRender: true,
  setup(__props) {
    const { tableData, loading, error, fetchTransferts, config } = useTransferts();
    const columns = ref([
      {
        key: "date_transfert",
        label: "Date",
        visible: true
      },
      {
        key: "objet",
        label: "Objet",
        visible: true
      },
      {
        key: "courrier",
        label: "Courrier",
        visible: true
      },
      {
        key: "emetteur",
        label: "\xC9metteur",
        visible: true
      },
      {
        key: "destinataire",
        label: "Destinataire",
        visible: true
      },
      {
        key: "statut",
        label: "Statut",
        visible: true,
        type: "badge"
      }
    ]);
    const handleView = (item) => {
      console.log("Voir:", item);
    };
    const handleEdit = async (item) => {
      try {
        const token = localStorage.getItem("token") || localStorage.getItem("auth_token");
        const response = await fetch(`${config.public.apiBase}/transferts/${item.id}`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            // Champs à mettre à jour
          })
        });
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        fetchTransferts();
        console.log("Transfert modifi\xE9 avec succ\xE8s");
      } catch (error2) {
        console.error("Erreur lors de la modification:", error2);
      }
    };
    const handleDelete = async (item) => {
      if (confirm(`Voulez-vous vraiment supprimer le transfert "${item.objet}" ?`)) {
        try {
          const token = localStorage.getItem("token") || localStorage.getItem("auth_token");
          const response = await fetch(`${config.public.apiBase}/transferts/${item.id}`, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
              "Accept": "application/json"
            }
          });
          if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
          }
          fetchTransferts();
          console.log("Transfert supprim\xE9 avec succ\xE8s");
        } catch (error2) {
          console.error("Erreur lors de la suppression:", error2);
        }
      }
    };
    const handleSelectionChange = (selected) => {
      console.log("S\xE9lection:", selected);
    };
    const handleBulkDelete = (selected) => {
      if (confirm(`Voulez-vous vraiment supprimer ${selected.length} transfert(s) ?`)) {
        console.log("Suppression multiple:", selected);
      }
    };
    const handleBulkExport = (selected) => {
      console.log("Export multiple:", selected);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0;
      const _component_UBadge = __nuxt_component_1;
      const _component_UButton = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-6 max-w-[1400px] mx-auto" }, _attrs))}><div class="flex items-center justify-between mb-6"><h1 class="flex items-center gap-3 text-2xl font-bold text-slate-800">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "i-heroicons-arrow-path",
        class: "w-7 h-7 text-indigo-600"
      }, null, _parent));
      _push(` Liste des Transferts </h1><div class="flex items-center gap-3"><button class="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all hover:shadow-md">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "i-heroicons-arrow-path",
        class: "w-4 h-4"
      }, null, _parent));
      _push(` Actualiser </button>`);
      _push(ssrRenderComponent(_component_UBadge, {
        color: "blue",
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
              to: "/affectations-transferts/form-transfert",
              variant: "text",
              size: "sm",
              class: "p-0 m-0 text-blue-600"
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
                to: "/affectations-transferts/form-transfert",
                variant: "text",
                size: "sm",
                class: "p-0 m-0 text-blue-600"
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
      _push(`</div></div>`);
      if (unref(error)) {
        _push(`<div class="flex items-center gap-3 p-4 mb-5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-exclamation-triangle",
          class: "w-5 h-5 flex-shrink-0"
        }, null, _parent));
        _push(`<span class="flex-1">${ssrInterpolate(unref(error))}</span><button class="text-lg opacity-60 hover:opacity-100 transition-opacity"> \u2715 </button></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(loading)) {
        _push(`<div class="flex flex-col items-center justify-center py-16 gap-4"><div class="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div><p class="text-sm text-slate-500">Chargement des transferts...</p></div>`);
      } else {
        _push(ssrRenderComponent(_sfc_main$5, {
          data: unref(tableData),
          "default-sort-column": null,
          "show-row-numbers": true,
          columns: columns.value,
          selectable: true,
          "default-items-per-page": 10,
          "items-per-page-options": [10, 25, 50, 100],
          "left-aligned-columns": ["objet", "courrier", "emetteur", "destinataire"],
          onEdit: handleEdit,
          onDelete: handleDelete,
          onSelectionChange: handleSelectionChange
        }, {
          "cell-statut": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="${ssrRenderClass([{
                "bg-amber-100 text-amber-800": value === "non trait\xE9",
                "bg-emerald-100 text-emerald-800": value === "trait\xE9",
                "bg-red-100 text-red-800": value === "annul\xE9"
              }, "inline-block px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wide"])}"${_scopeId}>${ssrInterpolate(value)}</span>`);
            } else {
              return [
                createVNode("span", {
                  class: ["inline-block px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wide", {
                    "bg-amber-100 text-amber-800": value === "non trait\xE9",
                    "bg-emerald-100 text-emerald-800": value === "trait\xE9",
                    "bg-red-100 text-red-800": value === "annul\xE9"
                  }]
                }, toDisplayString(value), 3)
              ];
            }
          }),
          actions: withCtx(({ item }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex gap-1.5 justify-end"${_scopeId}><button title="Voir les d\xE9tails" class="inline-flex items-center justify-center w-8 h-8 bg-amber-50 text-amber-700 border-amber-100 rounded-md hover:bg-amber-200 :hover:text-amber-900 hover:border-amber-900 transition-all group"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                name: "i-heroicons-eye",
                class: "w-4 h-4 group-hover:text-yellow-600"
              }, null, _parent2, _scopeId));
              _push2(`</button><button class="inline-flex items-center justify-center w-8 h-8 bg-emerald-50 text-emerald-700 border-emerald-100 rounded-md hover:bg-emerald-200 :hover:text-emerald-900 hover:border-emerald-900 transition-all group" title="Modifier"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                name: "i-heroicons-pencil",
                class: "w-4 h-4 group-hover:text-green-600"
              }, null, _parent2, _scopeId));
              _push2(`</button><button title="Supprimer" class="inline-flex items-center justify-center w-8 h-8 bg-red-50 text-red-700 border-red-100 rounded-md hover:bg-red-200 :hover:text-red-900 hover:border-red-900 transition-all group"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                name: "i-heroicons-trash",
                class: "w-4 h-4 group-hover:text-red-600"
              }, null, _parent2, _scopeId));
              _push2(`</button></div>`);
            } else {
              return [
                createVNode("div", { class: "flex gap-1.5 justify-end" }, [
                  createVNode("button", {
                    onClick: ($event) => handleView(item),
                    title: "Voir les d\xE9tails",
                    class: "inline-flex items-center justify-center w-8 h-8 bg-amber-50 text-amber-700 border-amber-100 rounded-md hover:bg-amber-200 :hover:text-amber-900 hover:border-amber-900 transition-all group"
                  }, [
                    createVNode(_component_Icon, {
                      name: "i-heroicons-eye",
                      class: "w-4 h-4 group-hover:text-yellow-600"
                    })
                  ], 8, ["onClick"]),
                  createVNode("button", {
                    onClick: ($event) => handleEdit(item),
                    class: "inline-flex items-center justify-center w-8 h-8 bg-emerald-50 text-emerald-700 border-emerald-100 rounded-md hover:bg-emerald-200 :hover:text-emerald-900 hover:border-emerald-900 transition-all group",
                    title: "Modifier"
                  }, [
                    createVNode(_component_Icon, {
                      name: "i-heroicons-pencil",
                      class: "w-4 h-4 group-hover:text-green-600"
                    })
                  ], 8, ["onClick"]),
                  createVNode("button", {
                    onClick: ($event) => handleDelete(item),
                    title: "Supprimer",
                    class: "inline-flex items-center justify-center w-8 h-8 bg-red-50 text-red-700 border-red-100 rounded-md hover:bg-red-200 :hover:text-red-900 hover:border-red-900 transition-all group"
                  }, [
                    createVNode(_component_Icon, {
                      name: "i-heroicons-trash",
                      class: "w-4 h-4 group-hover:text-red-600"
                    })
                  ], 8, ["onClick"])
                ])
              ];
            }
          }),
          "selection-actions": withCtx(({ selected }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<button class="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100 hover:border-indigo-300 transition-all"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                name: "i-heroicons-trash",
                class: "w-4 h-4"
              }, null, _parent2, _scopeId));
              _push2(` Supprimer (${ssrInterpolate(selected.length)}) </button><button class="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100 hover:border-indigo-300 transition-all"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                name: "i-heroicons-arrow-down-tray",
                class: "w-4 h-4"
              }, null, _parent2, _scopeId));
              _push2(` Exporter (${ssrInterpolate(selected.length)}) </button>`);
            } else {
              return [
                createVNode("button", {
                  onClick: ($event) => handleBulkDelete(selected),
                  class: "flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100 hover:border-indigo-300 transition-all"
                }, [
                  createVNode(_component_Icon, {
                    name: "i-heroicons-trash",
                    class: "w-4 h-4"
                  }),
                  createTextVNode(" Supprimer (" + toDisplayString(selected.length) + ") ", 1)
                ], 8, ["onClick"]),
                createVNode("button", {
                  onClick: ($event) => handleBulkExport(selected),
                  class: "flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100 hover:border-indigo-300 transition-all"
                }, [
                  createVNode(_component_Icon, {
                    name: "i-heroicons-arrow-down-tray",
                    class: "w-4 h-4"
                  }),
                  createTextVNode(" Exporter (" + toDisplayString(selected.length) + ") ", 1)
                ], 8, ["onClick"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/transferts/TransfertsListe.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "AffectationsEmises",
  __ssrInlineRender: true,
  setup(__props) {
    useAffectationsStore();
    useHead({
      title: "Affectations - Sagar Revolution"
    });
    const tableData = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const toast = useToast();
    const dataTableRef = ref(null);
    const config = useRuntimeConfig();
    const showEditModal = ref(false);
    const selectedAffectation = ref(null);
    const selectedNewDestinataire = ref(null);
    const searchDestinataire = ref("");
    const destinataires = ref([]);
    const loadingDestinataires = ref(false);
    const submitting = ref(false);
    const columns = ref([
      { key: "reference_courrier", label: "R\xE9f. Courrier", visible: true, width: "min-w-[200px]" },
      { key: "dossier", label: "Dossier", visible: true, width: "min-w-[200px]" },
      { key: "objet_courrier", label: "Objet", visible: true, width: "min-w-[250px]" },
      { key: "doc_courrier", label: "Document", visible: false, type: "document", width: "w-24" },
      { key: "date_affect", label: "Date d'affectation", visible: true, width: "min-w-[120px]" },
      { key: "instructions", label: "Instructions", visible: true, width: "min-w-[200px]" },
      { key: "statut", label: "Statut", visible: true, type: "badge", width: "min-w-[120px]" },
      { key: "priority", label: "Priorit\xE9", visible: true, type: "badge", width: "min-w-[120px]" },
      { key: "delai_traitement", label: "Date de retour attendue", visible: true, width: "min-w-[120px]" },
      { key: "date_cloture", label: "Date cl\xF4ture", visible: false, width: "min-w-[120px]" },
      { key: "destinataire", label: "Destinataire", visible: true, width: "min-w-[180px]" }
    ]);
    const filteredDestinataires = computed(() => {
      if (!searchDestinataire.value) return destinataires.value;
      const query = searchDestinataire.value.toLowerCase();
      return destinataires.value.filter(
        (dest) => {
          var _a, _b, _c, _d, _e, _f, _g, _h;
          return ((_b = (_a = dest.user) == null ? void 0 : _a.nom) == null ? void 0 : _b.toLowerCase().includes(query)) || ((_d = (_c = dest.user) == null ? void 0 : _c.prenom) == null ? void 0 : _d.toLowerCase().includes(query)) || ((_f = (_e = dest.entite) == null ? void 0 : _e.code) == null ? void 0 : _f.toLowerCase().includes(query)) || ((_h = (_g = dest.entite) == null ? void 0 : _g.libelle) == null ? void 0 : _h.toLowerCase().includes(query));
        }
      );
    });
    const formatDate = (date) => {
      if (!date) return "";
      return new Date(date).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      });
    };
    const getStatutLabel = (statut) => {
      const labels = {
        "en cours": "En cours",
        "en_attente": "En attente",
        "traite": "Trait\xE9",
        "cloture": "Cl\xF4tur\xE9",
        "annule": "Annul\xE9"
      };
      return labels[statut] || statut;
    };
    const getStatutClasses = (statut) => {
      const classes = {
        "en_attente": "bg-gray-100 text-gray-800",
        "en cours": "bg-blue-100 text-blue-800",
        "traite": "bg-green-100 text-green-800",
        "cloture": "bg-blue-100 text-blue-800",
        "annule": "bg-red-100 text-red-800"
      };
      return classes[statut] || "bg-gray-100 text-gray-800";
    };
    const getStatutDotClass = (statut) => {
      const classes = {
        "en attente": "bg-gray-500",
        "en cours": "bg-blue-500",
        "traite": "bg-green-500",
        "cloture": "bg-blue-500",
        "annule": "bg-red-500"
      };
      return classes[statut] || "bg-gray-500";
    };
    const getPriorityLabel = (priority) => {
      const labels = {
        "urgent": "Urgent",
        "important": "Important",
        "standard": "Standard"
      };
      return labels[priority] || priority;
    };
    const getPriorityClasses = (priority) => {
      const classes = {
        "urgent": "bg-red-100 text-red-800",
        "important": "bg-orange-100 text-orange-800",
        "standard": "bg-blue-100 text-blue-800"
      };
      return classes[priority] || "bg-gray-100 text-gray-800";
    };
    const getPriorityDotClass = (priority) => {
      const classes = {
        "urgent": "bg-red-500",
        "important": "bg-orange-500",
        "standard": "bg-blue-500"
      };
      return classes[priority] || "bg-gray-500";
    };
    const fetchAffectations = async () => {
      loading.value = true;
      error.value = null;
      try {
        const authToken = localStorage.getItem("auth_token");
        let entite_user = null;
        if (false) ;
        if (!entite_user || !entite_user.id) {
          error.value = "Aucune fonction utilisateur s\xE9lectionn\xE9e. Veuillez vous reconnecter.";
          toast.add({
            title: "Erreur",
            description: "Aucune fonction utilisateur s\xE9lectionn\xE9e.",
            color: "red",
            timeout: 1500
          });
          loading.value = false;
          return;
        }
        console.log(`\u{1F4E5} Chargement des affectations pour emetteur_id: ${entite_user.id}`);
        const response = await $fetch(`${config.public.apiBase}/affectations/emetteur/${entite_user.id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
        tableData.value = response.data.map((affectation) => {
          var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
          let fonctionDestinataire = "";
          if ((_b = (_a = affectation.destinataire) == null ? void 0 : _a.entite) == null ? void 0 : _b.code) {
            const code = affectation.destinataire.entite.code;
            const roleOuFonction = affectation.destinataire.is_responsable ? affectation.destinataire.entite.fonction : "Agent";
            fonctionDestinataire = `${code} - ${roleOuFonction}`;
          }
          return {
            id: affectation.id,
            courrier_id: affectation.courrier_arrive_id || null,
            reference_courrier: ((_d = (_c = affectation.courrier_arrive) == null ? void 0 : _c.document) == null ? void 0 : _d.reference) || "",
            objet_courrier: ((_f = (_e = affectation.courrier_arrive) == null ? void 0 : _e.document) == null ? void 0 : _f.objet) || "",
            doc_courrier: ((_h = (_g = affectation.courrier_arrive) == null ? void 0 : _g.document) == null ? void 0 : _h.url) ? affectation.courrier_arrive.document.url !== "Inconnu" ? `${config.public.apiBase}${affectation.courrier_arrive.document.url}` : "" : "",
            date_affect: formatDate(affectation.date_affect),
            dossier: affectation.dossier || "__",
            instructions: affectation.instructions || "",
            statut: affectation.statut || "en_cours",
            priority: affectation.priority || "standard",
            delai_traitement: formatDate(affectation.delai_traitement),
            date_cloture: formatDate(affectation.date_cloture),
            destinataire: {
              nom: ((_i = affectation.destinataire) == null ? void 0 : _i.user) ? `${affectation.destinataire.user.nom} ${affectation.destinataire.user.prenom || ""}`.trim() : "Non assign\xE9",
              fonction: fonctionDestinataire,
              entite: ((_k = (_j = affectation.destinataire) == null ? void 0 : _j.entite) == null ? void 0 : _k.libelle) || ""
            },
            _raw: affectation
          };
        });
        console.log(`\u2705 ${tableData.value.length} affectations charg\xE9es`);
      } catch (err) {
        console.error("\u274C Erreur lors du chargement:", err);
        error.value = "Impossible de charger les affectations";
        toast.add({
          title: "Erreur",
          description: "Impossible de charger les affectations",
          color: "red",
          timeout: 1500
        });
      } finally {
        loading.value = false;
      }
    };
    const fetchDestinataires = async () => {
      var _a, _b;
      loadingDestinataires.value = true;
      try {
        const authToken = localStorage.getItem("auth_token");
        let entite_user = null;
        if (false) ;
        if (!entite_user || !entite_user.id) {
          console.error("\u274C Aucune fonction utilisateur s\xE9lectionn\xE9e");
          toast.add({
            title: "Erreur",
            description: "Aucune fonction utilisateur s\xE9lectionn\xE9e.",
            color: "red",
            timeout: 1500
          });
          courrierLoading.value = false;
          return;
        }
        console.log(`\u{1F4DD} Chargement des subordinates pour user_id: ${entite_user.id}`);
        const response = await $fetch(`${config.public.apiBase}/entite-users/${entite_user.id}/subordinates`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
        destinataires.value = response.data.filter((item) => {
          var _a2;
          return ((_a2 = item.user) == null ? void 0 : _a2.statut) && item.actif;
        }).map((item) => ({
          id: item.id,
          // entite_user.id
          user: item.user,
          entite: item.entite,
          actif: item.actif,
          is_interim: item.is_interim,
          is_responsable: item.is_responsable
          // ✅ AJOUTÉ
        }));
        console.log(`\u2705 ${destinataires.value.length} destinataires (subordinates) charg\xE9s`);
        if (destinataires.value.length > 0) {
          console.log("\u{1F4CB} Exemple de destinataire:", {
            id: destinataires.value[0].id,
            nom: (_a = destinataires.value[0].user) == null ? void 0 : _a.nom,
            fonction: (_b = destinataires.value[0].entite) == null ? void 0 : _b.fonction,
            is_responsable: destinataires.value[0].is_responsable
          });
        }
      } catch (err) {
        console.error("\u274C Erreur lors du chargement des destinataires:", err);
        toast.add({
          title: "Erreur",
          description: "Impossible de charger la liste des destinataires",
          color: "red",
          timeout: 1500
        });
      } finally {
        loadingDestinataires.value = false;
      }
    };
    const handleEdit = async (item) => {
      console.log("\u{1F527} Modifier le destinataire pour:", item);
      console.log("\u{1F4CB} Destinataire actuel ID:", item._raw.destinataire_id);
      selectedAffectation.value = item;
      selectedNewDestinataire.value = null;
      searchDestinataire.value = "";
      if (destinataires.value.length === 0) {
        await fetchDestinataires();
      }
      showEditModal.value = true;
    };
    const selectNewDestinataire = (dest) => {
      var _a, _b;
      selectedNewDestinataire.value = dest;
      console.log("\u2705 Nouveau destinataire s\xE9lectionn\xE9:", {
        id: dest.id,
        nom: (_a = dest.user) == null ? void 0 : _a.nom,
        fonction: (_b = dest.entite) == null ? void 0 : _b.fonction,
        is_responsable: dest.is_responsable
      });
    };
    const confirmChangeDestinataire = async () => {
      var _a;
      if (!selectedNewDestinataire.value || !selectedAffectation.value) return;
      console.log("\u{1F4E4} Changement de destinataire:", {
        affectation_id: selectedAffectation.value.id,
        ancien_destinataire_id: selectedAffectation.value._raw.destinataire_id,
        nouveau_destinataire_id: selectedNewDestinataire.value.id
      });
      submitting.value = true;
      try {
        const authToken = localStorage.getItem("auth_token");
        const response = await $fetch(`${config.public.apiBase}/affectations/${selectedAffectation.value.id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json"
          },
          body: {
            destinataire_id: selectedNewDestinataire.value.id
          }
        });
        showEditModal.value = false;
        toast.add({
          title: "Succ\xE8s",
          description: "Le destinataire a \xE9t\xE9 modifi\xE9 avec succ\xE8s",
          color: "green",
          timeout: 1500
        });
        await fetchAffectations();
      } catch (err) {
        console.error("\u274C Erreur captur\xE9e:", err);
        const errorResponse = err.data || ((_a = err.response) == null ? void 0 : _a._data) || {};
        if (errorResponse.message) {
          toast.add({
            title: "Erreur",
            description: errorResponse.message,
            color: "red",
            timeout: 3e3
          });
          if (errorResponse.existing_affectation) {
            console.log("\u{1F4CB} Affectation existante:", {
              id: errorResponse.existing_affectation.id,
              statut: errorResponse.existing_affectation.statut,
              date: errorResponse.existing_affectation.date_affect
            });
          }
        } else {
          toast.add({
            title: "Erreur syst\xE8me",
            description: "Impossible de communiquer avec le serveur",
            color: "red",
            timeout: 3e3
          });
        }
      } finally {
        submitting.value = false;
      }
    };
    const handleOpenDocument = (url) => {
      if (url) {
        (void 0).open(url, "_blank", "noopener,noreferrer");
      } else {
        toast.add({
          title: "Information",
          description: "Aucun document disponible",
          color: "amber",
          timeout: 2e3
        });
      }
    };
    const handleView = async (item) => {
      const details = `
    <div style="text-align: left; padding: 8px;">
      <div style="background-color: #faf5ff; border-radius: 8px; padding: 12px; border: 1px solid #e9d5ff; margin-bottom: 12px;">
        <p style="font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">Affectation</p>
        <p style="font-weight: 700; color: #7c3aed; font-size: 18px;">#${item.id}</p>
      </div>
      
      <div style="background-color: #eff6ff; border-radius: 8px; padding: 12px; border: 1px solid #bfdbfe; margin-bottom: 12px;">
        <p style="font-size: 12px; color: #6b7280; font-weight: 600; margin-bottom: 4px;">\u{1F4E8} Courrier</p>
        <p style="font-weight: 600; color: #1e40af; margin-bottom: 4px;">${item.reference_courrier}</p>
        <p style="font-size: 14px; color: #374151;">${item.objet_courrier}</p>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 12px; border: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #6b7280; font-weight: 600; margin-bottom: 4px;">\u{1F4C5} Date d'affectation</p>
          <p style="font-size: 14px; color: #111827;">${item.date_affect}</p>
        </div>
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 12px; border: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #6b7280; font-weight: 600; margin-bottom: 4px;">\u23F1\uFE0F Date de retour attendue</p>
          <p style="font-size: 14px; color: #111827;">${item.delai_traitement || "Non d\xE9fini"}</p>
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 12px; border: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #6b7280; font-weight: 600; margin-bottom: 4px;">Statut</p>
          <span style="display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 600;" class="${getStatutClasses(item.statut)}">
            ${getStatutLabel(item.statut)}
          </span>
        </div>
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 12px; border: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #6b7280; font-weight: 600; margin-bottom: 4px;">Priorit\xE9</p>
          <span style="display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 600;" class="${getPriorityClasses(item.priority)}">
            ${getPriorityLabel(item.priority)}
          </span>
        </div>
      </div>
      
      <div style="background-color: #eef2ff; border-radius: 8px; padding: 12px; border: 1px solid #c7d2fe; margin-bottom: 12px;">
        <p style="font-size: 12px; color: #6b7280; font-weight: 600; margin-bottom: 8px;">\u{1F464} Destinataire</p>
        <p style="font-weight: 600; color: #111827; margin-bottom: 2px;">${item.destinataire.nom}</p>
        <p style="font-size: 12px; color: #6b7280;">${item.destinataire.fonction}</p>
        ${item.destinataire.entite ? `<p style="font-size: 12px; color: #6b7280;">${item.destinataire.entite}</p>` : ""}
      </div>
      
      ${item.date_cloture ? `
        <div style="background-color: #dcfce7; border-radius: 8px; padding: 12px; border: 1px solid #bbf7d0; margin-bottom: 12px;">
          <p style="font-size: 12px; color: #6b7280; font-weight: 600; margin-bottom: 4px;">\u2705 Date de cl\xF4ture</p>
          <p style="font-size: 14px; color: #111827;">${item.date_cloture}</p>
        </div>
      ` : ""}
      
      <div style="background-color: #fef3c7; border-radius: 8px; padding: 12px; border: 1px solid #fde68a;">
        <p style="font-size: 12px; color: #6b7280; font-weight: 600; margin-bottom: 8px;">\u{1F4DD} Instructions</p>
        <p style="font-size: 14px; color: #374151; white-space: pre-wrap;">${item.instructions || "Aucune instruction"}</p>
      </div>
    </div>
  `;
      await Swal.fire({
        title: "\u{1F4CB} D\xE9tails de l'affectation",
        html: details,
        icon: "info",
        confirmButtonColor: "#7c3aed",
        confirmButtonText: "Fermer",
        width: "650px"
      });
    };
    const handleDelete = async (item) => {
      const result = await Swal.fire({
        title: "\u26A0\uFE0F Confirmer la suppression",
        html: `
      <div style="text-align: left; padding: 8px;">
        <p style="margin-bottom: 12px; color: #374151;">\xCAtes-vous s\xFBr de vouloir supprimer cette affectation ?</p>
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; border: 1px solid #e5e7eb;">
          <p style="font-weight: 700; color: #7c3aed; margin-bottom: 8px;">Affectation #${item.id}</p>
          <p style="font-size: 14px; color: #374151;">
            <strong>Courrier:</strong> ${item.reference_courrier}<br>
            <strong>Destinataire:</strong> ${item.destinataire.nom}
          </p>
        </div>
        <p style="margin-top: 12px; font-size: 14px; color: #dc2626; font-weight: 600;">\u26A0\uFE0F Cette action est irr\xE9versible.</p>
      </div>
    `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Oui, supprimer",
        cancelButtonText: "Annuler",
        reverseButtons: true
      });
      if (!result.isConfirmed) return;
      try {
        const authToken = localStorage.getItem("auth_token");
        await $fetch(`${config.public.apiBase}/affectations/${item.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
        await Swal.fire({
          title: "\u2705 Supprim\xE9 !",
          text: "L'affectation a \xE9t\xE9 supprim\xE9e avec succ\xE8s",
          icon: "success",
          timer: 2e3,
          showConfirmButton: false
        });
        await fetchAffectations();
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        await Swal.fire({
          title: "\u274C Erreur",
          text: "Impossible de supprimer l'affectation",
          icon: "error",
          confirmButtonColor: "#7c3aed"
        });
      }
    };
    const handleQuickAssign = (courrierId) => {
      console.log("\u{1F4CC} Affectation rapide pour le courrier:", courrierId);
      navigateTo("/affectations/create");
    };
    const handleSelectionChange = (selected) => {
      console.log("S\xE9lection:", selected);
    };
    const handleBulkDelete = async (selected) => {
      const result = await Swal.fire({
        title: "\u26A0\uFE0F Suppression multiple",
        html: `
      <div style="text-align: left; padding: 8px;">
        <p style="margin-bottom: 12px; color: #374151;">\xCAtes-vous s\xFBr de vouloir supprimer <strong style="color: #dc2626;">${selected.length} affectation(s)</strong> ?</p>
        <div style="background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 12px; margin-bottom: 12px;">
          <p style="font-size: 14px; color: #92400e;">\u26A0\uFE0F Cette action supprimera toutes les affectations s\xE9lectionn\xE9es de mani\xE8re permanente.</p>
        </div>
        <p style="font-size: 14px; color: #dc2626; font-weight: 600;">Cette action est irr\xE9versible.</p>
      </div>
    `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
        confirmButtonText: `Supprimer ${selected.length}`,
        cancelButtonText: "Annuler",
        reverseButtons: true
      });
      if (!result.isConfirmed) return;
      try {
        const authToken = localStorage.getItem("auth_token");
        await Promise.all(
          selected.map(
            (id) => $fetch(`${config.public.apiBase}/affectations/${id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${authToken}` }
            })
          )
        );
        await Swal.fire({
          title: "\u2705 Supprim\xE9s !",
          text: `${selected.length} affectation(s) supprim\xE9e(s)`,
          icon: "success",
          timer: 2e3,
          showConfirmButton: false
        });
        if (dataTableRef.value) {
          dataTableRef.value.selectedRows = [];
        }
        await fetchAffectations();
      } catch (err) {
        await Swal.fire({
          title: "\u274C Erreur",
          text: "Impossible de supprimer les affectations",
          icon: "error",
          confirmButtonColor: "#7c3aed"
        });
      }
    };
    const handleBulkExport = (selected) => {
      console.log("Export:", selected);
      toast.add({
        title: "Information",
        description: "Fonctionnalit\xE9 d'export en cours de d\xE9veloppement",
        color: "amber",
        timeout: 2e3
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0;
      const _component_UBadge = __nuxt_component_1;
      const _component_UButton = __nuxt_component_2;
      const _component_UModal = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-6 max-w-[1400px] mx-auto" }, _attrs))} data-v-d2d4a399><div class="flex items-center justify-between mb-6" data-v-d2d4a399><h1 class="flex items-center gap-3 text-2xl font-bold text-slate-800" data-v-d2d4a399>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "i-heroicons-document-arrow-down",
        class: "w-7 h-7 text-blue-600"
      }, null, _parent));
      _push(` Affectations </h1><div class="flex items-center gap-3" data-v-d2d4a399><button class="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all hover:shadow-md" data-v-d2d4a399>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "i-heroicons-arrow-path",
        class: "w-4 h-4"
      }, null, _parent));
      _push(` Actualiser </button>`);
      _push(ssrRenderComponent(_component_UBadge, {
        color: "blue",
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
              to: "/affectations/create",
              variant: "text",
              size: "sm",
              class: "p-0 m-0 text-blue-600"
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
                to: "/affectations/create",
                variant: "text",
                size: "sm",
                class: "p-0 m-0 text-blue-600"
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
      _push(`</div></div>`);
      if (error.value) {
        _push(`<div class="flex items-center gap-3 p-4 mb-5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" data-v-d2d4a399>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-exclamation-triangle",
          class: "w-5 h-5 flex-shrink-0"
        }, null, _parent));
        _push(`<span class="flex-1" data-v-d2d4a399>${ssrInterpolate(error.value)}</span><button class="text-lg opacity-60 hover:opacity-100 transition-opacity" data-v-d2d4a399> \u2715 </button></div>`);
      } else {
        _push(`<!---->`);
      }
      if (loading.value) {
        _push(`<div class="flex flex-col items-center justify-center py-16 gap-4" data-v-d2d4a399><div class="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" data-v-d2d4a399></div><p class="text-sm text-slate-500" data-v-d2d4a399>Chargement des affectations...</p></div>`);
      } else {
        _push(ssrRenderComponent(_sfc_main$5, {
          ref_key: "dataTableRef",
          ref: dataTableRef,
          "default-sort-column": null,
          "show-row-numbers": true,
          data: tableData.value,
          columns: columns.value,
          selectable: false,
          "default-items-per-page": 10,
          "items-per-page-options": [10, 25, 50, 100],
          "left-aligned-columns": ["instructions", "objet_courrier", "reference_courrier"],
          onEdit: handleEdit,
          onDelete: handleDelete,
          onOpenDocument: handleOpenDocument,
          onSelectionChange: handleSelectionChange
        }, {
          "cell-reference_courrier": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800" data-v-d2d4a399${_scopeId}>${ssrInterpolate(value)}</span>`);
            } else {
              return [
                createVNode("span", { class: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800" }, toDisplayString(value), 1)
              ];
            }
          }),
          "cell-statut": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="${ssrRenderClass([getStatutClasses(value), "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide"])}" data-v-d2d4a399${_scopeId}><span class="${ssrRenderClass([getStatutDotClass(value), "w-2 h-2 rounded-full mr-1.5"])}" data-v-d2d4a399${_scopeId}></span> ${ssrInterpolate(getStatutLabel(value))}</span>`);
            } else {
              return [
                createVNode("span", {
                  class: ["inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide", getStatutClasses(value)]
                }, [
                  createVNode("span", {
                    class: ["w-2 h-2 rounded-full mr-1.5", getStatutDotClass(value)]
                  }, null, 2),
                  createTextVNode(" " + toDisplayString(getStatutLabel(value)), 1)
                ], 2)
              ];
            }
          }),
          "cell-priority": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="${ssrRenderClass([getPriorityClasses(value), "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide"])}" data-v-d2d4a399${_scopeId}><span class="${ssrRenderClass([getPriorityDotClass(value), "w-2 h-2 rounded-full mr-1.5"])}" data-v-d2d4a399${_scopeId}></span> ${ssrInterpolate(getPriorityLabel(value))}</span>`);
            } else {
              return [
                createVNode("span", {
                  class: ["inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide", getPriorityClasses(value)]
                }, [
                  createVNode("span", {
                    class: ["w-2 h-2 rounded-full mr-1.5", getPriorityDotClass(value)]
                  }, null, 2),
                  createTextVNode(" " + toDisplayString(getPriorityLabel(value)), 1)
                ], 2)
              ];
            }
          }),
          "cell-destinataire": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="text-left" data-v-d2d4a399${_scopeId}><div class="font-medium text-xs text-slate-800" data-v-d2d4a399${_scopeId}>${ssrInterpolate(value.nom)}</div><div class="text-xs text-slate-500" data-v-d2d4a399${_scopeId}>${ssrInterpolate(value.fonction)}</div></div>`);
            } else {
              return [
                createVNode("div", { class: "text-left" }, [
                  createVNode("div", { class: "font-medium text-xs text-slate-800" }, toDisplayString(value.nom), 1),
                  createVNode("div", { class: "text-xs text-slate-500" }, toDisplayString(value.fonction), 1)
                ])
              ];
            }
          }),
          "cell-instructions": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="block max-w-[300px] line-clamp-2 text-xs text-slate-700"${ssrRenderAttr("title", value)} data-v-d2d4a399${_scopeId}>${ssrInterpolate(value || "Aucune instruction")}</span>`);
            } else {
              return [
                createVNode("span", {
                  class: "block max-w-[300px] line-clamp-2 text-xs text-slate-700",
                  title: value
                }, toDisplayString(value || "Aucune instruction"), 9, ["title"])
              ];
            }
          }),
          actions: withCtx(({ item }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex gap-1.5 justify-end" data-v-d2d4a399${_scopeId}><button title="Voir les d\xE9tails" class="inline-flex items-center justify-center w-8 h-8 bg-amber-50 text-amber-700 border-amber-100 rounded-md hover:bg-amber-200 :hover:text-amber-900 hover:border-amber-900 transition-all group" data-v-d2d4a399${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                name: "i-heroicons-eye",
                class: "w-4 h-4 group-hover:text-yellow-600"
              }, null, _parent2, _scopeId));
              _push2(`</button><button title="Affecter ce courrier" class="inline-flex items-center justify-center w-8 h-8 bg-sky-50 text-sky-700 border-sky-100 rounded-md hover:bg-sky-200 :hover:text-sky-900 hover:border-sky-900 transition-all group" data-v-d2d4a399${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                name: "i-heroicons-paper-airplane",
                class: "w-4 h-4 group-hover:text-blue-600"
              }, null, _parent2, _scopeId));
              _push2(`</button><button class="inline-flex items-center justify-center w-8 h-8 bg-emerald-50 text-emerald-700 border-emerald-100 rounded-md hover:bg-emerald-200 :hover:text-emerald-900 hover:border-emerald-900 transition-all group" title="Modifier le destinataire" data-v-d2d4a399${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                name: "i-heroicons-pencil",
                class: "w-4 h-4 group-hover:text-green-600"
              }, null, _parent2, _scopeId));
              _push2(`</button></div>`);
            } else {
              return [
                createVNode("div", { class: "flex gap-1.5 justify-end" }, [
                  createVNode("button", {
                    onClick: ($event) => handleView(item),
                    title: "Voir les d\xE9tails",
                    class: "inline-flex items-center justify-center w-8 h-8 bg-amber-50 text-amber-700 border-amber-100 rounded-md hover:bg-amber-200 :hover:text-amber-900 hover:border-amber-900 transition-all group"
                  }, [
                    createVNode(_component_Icon, {
                      name: "i-heroicons-eye",
                      class: "w-4 h-4 group-hover:text-yellow-600"
                    })
                  ], 8, ["onClick"]),
                  createVNode("button", {
                    onClick: ($event) => handleQuickAssign(item.courrier_id),
                    title: "Affecter ce courrier",
                    class: "inline-flex items-center justify-center w-8 h-8 bg-sky-50 text-sky-700 border-sky-100 rounded-md hover:bg-sky-200 :hover:text-sky-900 hover:border-sky-900 transition-all group"
                  }, [
                    createVNode(_component_Icon, {
                      name: "i-heroicons-paper-airplane",
                      class: "w-4 h-4 group-hover:text-blue-600"
                    })
                  ], 8, ["onClick"]),
                  createVNode("button", {
                    onClick: ($event) => handleEdit(item),
                    class: "inline-flex items-center justify-center w-8 h-8 bg-emerald-50 text-emerald-700 border-emerald-100 rounded-md hover:bg-emerald-200 :hover:text-emerald-900 hover:border-emerald-900 transition-all group",
                    title: "Modifier le destinataire"
                  }, [
                    createVNode(_component_Icon, {
                      name: "i-heroicons-pencil",
                      class: "w-4 h-4 group-hover:text-green-600"
                    })
                  ], 8, ["onClick"])
                ])
              ];
            }
          }),
          "cell-reference": withCtx(({ value, item }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (item.url) {
                _push2(`<button class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 rounded-md transition-all group"${ssrRenderAttr("title", `Ouvrir le document ${value}`)} data-v-d2d4a399${_scopeId}>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "i-heroicons-document-text",
                  class: "w-3.5 h-3.5 group-hover:scale-110 transition-transform"
                }, null, _parent2, _scopeId));
                _push2(`<span data-v-d2d4a399${_scopeId}>${ssrInterpolate(value)}</span>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "i-heroicons-arrow-top-right-on-square",
                  class: "w-3 h-3 opacity-60 group-hover:opacity-100"
                }, null, _parent2, _scopeId));
                _push2(`</button>`);
              } else {
                _push2(`<span class="inline-flex items-center px-2.5 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md"${ssrRenderAttr("title", value)} data-v-d2d4a399${_scopeId}>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "i-heroicons-document-text",
                  class: "w-3.5 h-3.5 mr-1.5 opacity-50"
                }, null, _parent2, _scopeId));
                _push2(` ${ssrInterpolate(value)}</span>`);
              }
            } else {
              return [
                item.url ? (openBlock(), createBlock("button", {
                  key: 0,
                  onClick: ($event) => _ctx.onOpenDocument(item.url),
                  class: "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 rounded-md transition-all group",
                  title: `Ouvrir le document ${value}`
                }, [
                  createVNode(_component_Icon, {
                    name: "i-heroicons-document-text",
                    class: "w-3.5 h-3.5 group-hover:scale-110 transition-transform"
                  }),
                  createVNode("span", null, toDisplayString(value), 1),
                  createVNode(_component_Icon, {
                    name: "i-heroicons-arrow-top-right-on-square",
                    class: "w-3 h-3 opacity-60 group-hover:opacity-100"
                  })
                ], 8, ["onClick", "title"])) : (openBlock(), createBlock("span", {
                  key: 1,
                  class: "inline-flex items-center px-2.5 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md",
                  title: value
                }, [
                  createVNode(_component_Icon, {
                    name: "i-heroicons-document-text",
                    class: "w-3.5 h-3.5 mr-1.5 opacity-50"
                  }),
                  createTextVNode(" " + toDisplayString(value), 1)
                ], 8, ["title"]))
              ];
            }
          }),
          "selection-actions": withCtx(({ selected }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<button class="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 hover:border-red-300 transition-all" data-v-d2d4a399${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                name: "i-heroicons-trash",
                class: "w-4 h-4"
              }, null, _parent2, _scopeId));
              _push2(` Supprimer (${ssrInterpolate(selected.length)}) </button><button class="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-all" data-v-d2d4a399${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                name: "i-heroicons-arrow-down-tray",
                class: "w-4 h-4"
              }, null, _parent2, _scopeId));
              _push2(` Exporter (${ssrInterpolate(selected.length)}) </button>`);
            } else {
              return [
                createVNode("button", {
                  onClick: ($event) => handleBulkDelete(selected),
                  class: "flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 hover:border-red-300 transition-all"
                }, [
                  createVNode(_component_Icon, {
                    name: "i-heroicons-trash",
                    class: "w-4 h-4"
                  }),
                  createTextVNode(" Supprimer (" + toDisplayString(selected.length) + ") ", 1)
                ], 8, ["onClick"]),
                createVNode("button", {
                  onClick: ($event) => handleBulkExport(selected),
                  class: "flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-all"
                }, [
                  createVNode(_component_Icon, {
                    name: "i-heroicons-arrow-down-tray",
                    class: "w-4 h-4"
                  }),
                  createTextVNode(" Exporter (" + toDisplayString(selected.length) + ") ", 1)
                ], 8, ["onClick"])
              ];
            }
          }),
          "advanced-filters": withCtx(({ filters, onFilter }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" data-v-d2d4a399${_scopeId}><div data-v-d2d4a399${_scopeId}><label class="block text-xs font-medium text-gray-700 mb-1" data-v-d2d4a399${_scopeId}>Date d&#39;affectation</label><input${ssrRenderAttr("value", filters.date_affect)} type="date" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" data-v-d2d4a399${_scopeId}></div><div data-v-d2d4a399${_scopeId}><label class="block text-xs font-medium text-gray-700 mb-1" data-v-d2d4a399${_scopeId}>Date de retour attendue</label><input${ssrRenderAttr("value", filters.delai_traitement)} type="date" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" data-v-d2d4a399${_scopeId}></div><div data-v-d2d4a399${_scopeId}><label class="block text-xs font-medium text-gray-700 mb-1" data-v-d2d4a399${_scopeId}>Date de cl\xF4ture</label><input${ssrRenderAttr("value", filters.date_cloture)} type="date" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" data-v-d2d4a399${_scopeId}></div></div>`);
            } else {
              return [
                createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" }, [
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-xs font-medium text-gray-700 mb-1" }, "Date d'affectation"),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => filters.date_affect = $event,
                      type: "date",
                      class: "w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                      onInput: onFilter
                    }, null, 40, ["onUpdate:modelValue", "onInput"]), [
                      [vModelText, filters.date_affect]
                    ])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-xs font-medium text-gray-700 mb-1" }, "Date de retour attendue"),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => filters.delai_traitement = $event,
                      type: "date",
                      class: "w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                      onInput: onFilter
                    }, null, 40, ["onUpdate:modelValue", "onInput"]), [
                      [vModelText, filters.delai_traitement]
                    ])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-xs font-medium text-gray-700 mb-1" }, "Date de cl\xF4ture"),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => filters.date_cloture = $event,
                      type: "date",
                      class: "w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                      onInput: onFilter
                    }, null, 40, ["onUpdate:modelValue", "onInput"]), [
                      [vModelText, filters.date_cloture]
                    ])
                  ])
                ])
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
          var _a, _b;
          if (_push2) {
            _push2(`<div class="p-6" data-v-d2d4a399${_scopeId}><div class="flex items-center justify-between mb-6" data-v-d2d4a399${_scopeId}><h3 class="text-xl font-bold text-gray-900 flex items-center gap-2" data-v-d2d4a399${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "i-heroicons-users",
              class: "h-6 w-6 text-blue-600"
            }, null, _parent2, _scopeId));
            _push2(` Modifier le destinataire </h3>`);
            _push2(ssrRenderComponent(_component_UButton, {
              color: "gray",
              variant: "ghost",
              icon: "i-heroicons-x-mark",
              onClick: ($event) => showEditModal.value = false,
              square: ""
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            if (selectedAffectation.value) {
              _push2(`<div class="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200" data-v-d2d4a399${_scopeId}><p class="text-sm text-gray-700 mb-2" data-v-d2d4a399${_scopeId}><strong data-v-d2d4a399${_scopeId}>Courrier :</strong> ${ssrInterpolate(selectedAffectation.value.reference_courrier)}</p><p class="text-xs text-gray-600" data-v-d2d4a399${_scopeId}>${ssrInterpolate(selectedAffectation.value.objet_courrier)}</p><div class="mt-3 pt-3 border-t border-blue-200" data-v-d2d4a399${_scopeId}><p class="text-sm text-gray-700" data-v-d2d4a399${_scopeId}><strong data-v-d2d4a399${_scopeId}>Destinataire actuel :</strong><span class="text-blue-700 font-semibold" data-v-d2d4a399${_scopeId}>${ssrInterpolate(selectedAffectation.value.destinataire.nom)}</span><span class="text-xs text-gray-500 ml-2" data-v-d2d4a399${_scopeId}>(${ssrInterpolate(selectedAffectation.value.destinataire.fonction)})</span></p></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="mb-4" data-v-d2d4a399${_scopeId}><label class="block text-sm font-medium text-gray-700 mb-2" data-v-d2d4a399${_scopeId}> Rechercher un destinataire </label><input${ssrRenderAttr("value", searchDestinataire.value)} type="text" placeholder="Rechercher par nom, pr\xE9nom ou fonction..." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" data-v-d2d4a399${_scopeId}></div>`);
            if (loadingDestinataires.value) {
              _push2(`<div class="flex justify-center py-8" data-v-d2d4a399${_scopeId}><div class="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" data-v-d2d4a399${_scopeId}></div></div>`);
            } else {
              _push2(`<div class="max-h-96 overflow-y-auto border border-gray-200 rounded-lg" data-v-d2d4a399${_scopeId}><!--[-->`);
              ssrRenderList(filteredDestinataires.value, (dest) => {
                var _a2, _b2, _c, _d, _e, _f, _g;
                _push2(`<div class="${ssrRenderClass([
                  "p-4 cursor-pointer transition-all border-b border-gray-200 last:border-b-0",
                  ((_a2 = selectedNewDestinataire.value) == null ? void 0 : _a2.id) === dest.id ? "bg-blue-100 border-l-4 border-l-blue-600" : "hover:bg-gray-50"
                ])}" data-v-d2d4a399${_scopeId}><div class="flex items-center justify-between" data-v-d2d4a399${_scopeId}><div class="flex-1" data-v-d2d4a399${_scopeId}><p class="font-semibold text-gray-900" data-v-d2d4a399${_scopeId}>${ssrInterpolate((_b2 = dest.user) == null ? void 0 : _b2.nom)} ${ssrInterpolate((_c = dest.user) == null ? void 0 : _c.prenom)}</p><p class="text-sm text-gray-600 mt-1" data-v-d2d4a399${_scopeId}><span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 mr-2" data-v-d2d4a399${_scopeId}>${ssrInterpolate((_d = dest.entite) == null ? void 0 : _d.code)}</span>`);
                if (dest.is_responsable) {
                  _push2(`<span class="text-gray-700" data-v-d2d4a399${_scopeId}>${ssrInterpolate((_e = dest.entite) == null ? void 0 : _e.fonction)}</span>`);
                } else {
                  _push2(`<span class="text-gray-500" data-v-d2d4a399${_scopeId}> Agent </span>`);
                }
                _push2(`</p><p class="text-xs text-gray-500 mt-1" data-v-d2d4a399${_scopeId}>${ssrInterpolate((_f = dest.entite) == null ? void 0 : _f.libelle)}</p><div class="flex gap-1 mt-2" data-v-d2d4a399${_scopeId}></div></div>`);
                if (((_g = selectedNewDestinataire.value) == null ? void 0 : _g.id) === dest.id) {
                  _push2(`<div data-v-d2d4a399${_scopeId}>`);
                  _push2(ssrRenderComponent(_component_Icon, {
                    name: "i-heroicons-check-circle-solid",
                    class: "h-6 w-6 text-blue-600"
                  }, null, _parent2, _scopeId));
                  _push2(`</div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div></div>`);
              });
              _push2(`<!--]-->`);
              if (filteredDestinataires.value.length === 0) {
                _push2(`<div class="p-8 text-center text-gray-500" data-v-d2d4a399${_scopeId}>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "i-heroicons-user-group",
                  class: "h-12 w-12 mx-auto mb-2 text-gray-400"
                }, null, _parent2, _scopeId));
                _push2(`<p class="text-sm" data-v-d2d4a399${_scopeId}>Aucun destinataire trouv\xE9</p></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            }
            _push2(`<div class="flex justify-end gap-3 mt-6" data-v-d2d4a399${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              onClick: ($event) => showEditModal.value = false,
              color: "gray",
              variant: "outline",
              size: "lg"
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
              onClick: confirmChangeDestinataire,
              disabled: !selectedNewDestinataire.value || selectedNewDestinataire.value.id === ((_a = selectedAffectation.value) == null ? void 0 : _a._raw.destinataire_id),
              loading: submitting.value,
              size: "lg",
              icon: "i-heroicons-check",
              class: "bg-gradient-to-br from-emerald-800 to-blue-800 text-white dark:text-white"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(submitting.value ? "Modification en cours..." : "Confirmer le changement")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(submitting.value ? "Modification en cours..." : "Confirmer le changement"), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "p-6" }, [
                createVNode("div", { class: "flex items-center justify-between mb-6" }, [
                  createVNode("h3", { class: "text-xl font-bold text-gray-900 flex items-center gap-2" }, [
                    createVNode(_component_Icon, {
                      name: "i-heroicons-users",
                      class: "h-6 w-6 text-blue-600"
                    }),
                    createTextVNode(" Modifier le destinataire ")
                  ]),
                  createVNode(_component_UButton, {
                    color: "gray",
                    variant: "ghost",
                    icon: "i-heroicons-x-mark",
                    onClick: ($event) => showEditModal.value = false,
                    square: ""
                  }, null, 8, ["onClick"])
                ]),
                selectedAffectation.value ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200"
                }, [
                  createVNode("p", { class: "text-sm text-gray-700 mb-2" }, [
                    createVNode("strong", null, "Courrier :"),
                    createTextVNode(" " + toDisplayString(selectedAffectation.value.reference_courrier), 1)
                  ]),
                  createVNode("p", { class: "text-xs text-gray-600" }, toDisplayString(selectedAffectation.value.objet_courrier), 1),
                  createVNode("div", { class: "mt-3 pt-3 border-t border-blue-200" }, [
                    createVNode("p", { class: "text-sm text-gray-700" }, [
                      createVNode("strong", null, "Destinataire actuel :"),
                      createVNode("span", { class: "text-blue-700 font-semibold" }, toDisplayString(selectedAffectation.value.destinataire.nom), 1),
                      createVNode("span", { class: "text-xs text-gray-500 ml-2" }, "(" + toDisplayString(selectedAffectation.value.destinataire.fonction) + ")", 1)
                    ])
                  ])
                ])) : createCommentVNode("", true),
                createVNode("div", { class: "mb-4" }, [
                  createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-2" }, " Rechercher un destinataire "),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => searchDestinataire.value = $event,
                    type: "text",
                    placeholder: "Rechercher par nom, pr\xE9nom ou fonction...",
                    class: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, searchDestinataire.value]
                  ])
                ]),
                loadingDestinataires.value ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: "flex justify-center py-8"
                }, [
                  createVNode("div", { class: "w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" })
                ])) : (openBlock(), createBlock("div", {
                  key: 2,
                  class: "max-h-96 overflow-y-auto border border-gray-200 rounded-lg"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(filteredDestinataires.value, (dest) => {
                    var _a2, _b2, _c, _d, _e, _f, _g;
                    return openBlock(), createBlock("div", {
                      key: dest.id,
                      onClick: ($event) => selectNewDestinataire(dest),
                      class: [
                        "p-4 cursor-pointer transition-all border-b border-gray-200 last:border-b-0",
                        ((_a2 = selectedNewDestinataire.value) == null ? void 0 : _a2.id) === dest.id ? "bg-blue-100 border-l-4 border-l-blue-600" : "hover:bg-gray-50"
                      ]
                    }, [
                      createVNode("div", { class: "flex items-center justify-between" }, [
                        createVNode("div", { class: "flex-1" }, [
                          createVNode("p", { class: "font-semibold text-gray-900" }, toDisplayString((_b2 = dest.user) == null ? void 0 : _b2.nom) + " " + toDisplayString((_c = dest.user) == null ? void 0 : _c.prenom), 1),
                          createVNode("p", { class: "text-sm text-gray-600 mt-1" }, [
                            createVNode("span", { class: "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 mr-2" }, toDisplayString((_d = dest.entite) == null ? void 0 : _d.code), 1),
                            dest.is_responsable ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "text-gray-700"
                            }, toDisplayString((_e = dest.entite) == null ? void 0 : _e.fonction), 1)) : (openBlock(), createBlock("span", {
                              key: 1,
                              class: "text-gray-500"
                            }, " Agent "))
                          ]),
                          createVNode("p", { class: "text-xs text-gray-500 mt-1" }, toDisplayString((_f = dest.entite) == null ? void 0 : _f.libelle), 1),
                          createVNode("div", { class: "flex gap-1 mt-2" })
                        ]),
                        ((_g = selectedNewDestinataire.value) == null ? void 0 : _g.id) === dest.id ? (openBlock(), createBlock("div", { key: 0 }, [
                          createVNode(_component_Icon, {
                            name: "i-heroicons-check-circle-solid",
                            class: "h-6 w-6 text-blue-600"
                          })
                        ])) : createCommentVNode("", true)
                      ])
                    ], 10, ["onClick"]);
                  }), 128)),
                  filteredDestinataires.value.length === 0 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "p-8 text-center text-gray-500"
                  }, [
                    createVNode(_component_Icon, {
                      name: "i-heroicons-user-group",
                      class: "h-12 w-12 mx-auto mb-2 text-gray-400"
                    }),
                    createVNode("p", { class: "text-sm" }, "Aucun destinataire trouv\xE9")
                  ])) : createCommentVNode("", true)
                ])),
                createVNode("div", { class: "flex justify-end gap-3 mt-6" }, [
                  createVNode(_component_UButton, {
                    onClick: ($event) => showEditModal.value = false,
                    color: "gray",
                    variant: "outline",
                    size: "lg"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Annuler ")
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  createVNode(_component_UButton, {
                    onClick: confirmChangeDestinataire,
                    disabled: !selectedNewDestinataire.value || selectedNewDestinataire.value.id === ((_b = selectedAffectation.value) == null ? void 0 : _b._raw.destinataire_id),
                    loading: submitting.value,
                    size: "lg",
                    icon: "i-heroicons-check",
                    class: "bg-gradient-to-br from-emerald-800 to-blue-800 text-white dark:text-white"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(submitting.value ? "Modification en cours..." : "Confirmer le changement"), 1)
                    ]),
                    _: 1
                  }, 8, ["disabled", "loading"])
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
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/affectations/AffectationsEmises.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const AffectationsEmises = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-d2d4a399"]]);
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Affectations et Transferts - Sagar Revolution"
    });
    const selectedFunctionCode = ref(null);
    const allTabList = ref([
      {
        id: "sent_assignments",
        label: "Affectations",
        icon: "i-heroicons-clipboard-document-check",
        count: null
      },
      {
        id: "sent_transfers",
        label: "Transferts",
        icon: "i-heroicons-arrow-up-tray",
        count: null
      }
    ]);
    const filteredTabList = computed(() => {
      if (selectedFunctionCode.value === "DGML") {
        return allTabList.value.filter((tab) => tab.id !== "received_assignments");
      }
      return allTabList.value;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col p-5" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$3, {
        title: "Affectations et Transferts",
        subtitle: "Gestion centralis\xE9e des affectations et transferts de courriers"
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$4, { tabs: filteredTabList.value }, {
        sent_assignments: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}>`);
            _push2(ssrRenderComponent(AffectationsEmises, null, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                createVNode(AffectationsEmises)
              ])
            ];
          }
        }),
        sent_transfers: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              type: "sent",
              title: "Transferts Effectu\xE9s",
              "empty-message": "Aucun transfert effectu\xE9"
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                createVNode(_sfc_main$2, {
                  type: "sent",
                  title: "Transferts Effectu\xE9s",
                  "empty-message": "Aucun transfert effectu\xE9"
                })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/affectations-transferts/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index---0HuOCB.mjs.map
