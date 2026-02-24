import { p as useRoute, q as useRouter, r as useToast, d as __nuxt_component_1, g as __nuxt_component_2$1, n as navigateTo } from './server.mjs';
import __nuxt_component_2 from './Card-DtmGMnBU.mjs';
import __nuxt_component_1$1 from './Badge-DIEXPf_r.mjs';
import __nuxt_component_3 from './Modal-EvFvX6Ng.mjs';
import { ref, computed, reactive, unref, withCtx, createTextVNode, createVNode, toDisplayString, isRef, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderList } from 'vue/server-renderer';
import { u as useCodirsStore, f as formatDateFR } from './codirs-D_To-40U.mjs';
import __nuxt_component_5 from './Alert-BJqo0-kE.mjs';
import __nuxt_component_1$2 from './FormGroup-C6GvzJxy.mjs';
import __nuxt_component_2$2 from './Input-50cchghJ.mjs';
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
import './useFormGroup-BPckFnLf.mjs';

const _sfc_main$1 = {
  __name: "DossierCard",
  __ssrInlineRender: true,
  props: {
    dossier: { type: Object, required: true }
  },
  emits: ["deleted", "click"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const codirStore = useCodirsStore();
    const toast = useToast();
    const showDeleteModal = ref(false);
    const confirmDelete = async () => {
      showDeleteModal.value = false;
      try {
        await codirStore.removeDossier(codirStore.currentOrdreDuJour.id, props.dossier.id);
        toast.add({
          title: "Dossier supprim\xE9",
          description: `"${props.dossier.libelle}" a \xE9t\xE9 supprim\xE9 avec succ\xE8s`,
          color: "green",
          icon: "i-heroicons-check-circle"
        });
        emit("deleted", props.dossier.id);
      } catch {
        toast.add({
          title: "Erreur",
          description: "Impossible de supprimer le dossier",
          color: "red",
          icon: "i-heroicons-exclamation-circle"
        });
      }
    };
    const cancelDelete = () => {
      showDeleteModal.value = false;
      toast.add({
        title: "Suppression annul\xE9e",
        description: `La suppression du dossier "${props.dossier.libelle}" a \xE9t\xE9 annul\xE9e`,
        color: "gray",
        icon: "i-heroicons-x-circle",
        timeout: 2e3
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = __nuxt_component_2$1;
      const _component_UModal = __nuxt_component_3;
      const _component_UCard = __nuxt_component_2;
      const _component_UButton = __nuxt_component_1;
      _push(`<!--[--><div class="flex items-center gap-3 bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/80 transition-colors"><div class="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-950/40 flex items-center justify-center shrink-0">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-heroicons-folder",
        class: "w-4 h-4 text-violet-600 dark:text-violet-400"
      }, null, _parent));
      _push(`</div><div class="min-w-0 flex-1"><p class="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">${ssrInterpolate(__props.dossier.libelle)}</p><p class="text-xs text-gray-400 mt-0.5">#${ssrInterpolate(__props.dossier.id)}</p></div><button class="ml-2 shrink-0" title="Supprimer le dossier">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-heroicons-trash",
        class: "w-4 h-4 text-red-500 hover:text-red-700"
      }, null, _parent));
      _push(`</button></div>`);
      _push(ssrRenderComponent(_component_UModal, {
        modelValue: showDeleteModal.value,
        "onUpdate:modelValue": ($event) => showDeleteModal.value = $event
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UCard, { class: "rounded-2xl" }, {
              header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex items-center gap-3"${_scopeId2}><div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-heroicons-exclamation-triangle",
                    class: "w-5 h-5 text-red-600 dark:text-red-400"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div><div${_scopeId2}><h3 class="font-semibold text-gray-900 dark:text-white"${_scopeId2}>Confirmer la suppression</h3><p class="text-sm text-gray-500 dark:text-gray-400"${_scopeId2}>Cette action est irr\xE9versible</p></div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex items-center gap-3" }, [
                      createVNode("div", { class: "w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center" }, [
                        createVNode(_component_UIcon, {
                          name: "i-heroicons-exclamation-triangle",
                          class: "w-5 h-5 text-red-600 dark:text-red-400"
                        })
                      ]),
                      createVNode("div", null, [
                        createVNode("h3", { class: "font-semibold text-gray-900 dark:text-white" }, "Confirmer la suppression"),
                        createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400" }, "Cette action est irr\xE9versible")
                      ])
                    ])
                  ];
                }
              }),
              footer: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex justify-end gap-3"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UButton, {
                    color: "gray",
                    variant: "ghost",
                    onClick: cancelDelete,
                    disabled: unref(codirStore).loading
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
                    color: "red",
                    onClick: confirmDelete,
                    loading: unref(codirStore).loading
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UIcon, {
                          name: "i-heroicons-trash",
                          class: "w-4 h-4 mr-2"
                        }, null, _parent4, _scopeId3));
                        _push4(` Supprimer `);
                      } else {
                        return [
                          createVNode(_component_UIcon, {
                            name: "i-heroicons-trash",
                            class: "w-4 h-4 mr-2"
                          }),
                          createTextVNode(" Supprimer ")
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
                        variant: "ghost",
                        onClick: cancelDelete,
                        disabled: unref(codirStore).loading
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Annuler ")
                        ]),
                        _: 1
                      }, 8, ["disabled"]),
                      createVNode(_component_UButton, {
                        color: "red",
                        onClick: confirmDelete,
                        loading: unref(codirStore).loading
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UIcon, {
                            name: "i-heroicons-trash",
                            class: "w-4 h-4 mr-2"
                          }),
                          createTextVNode(" Supprimer ")
                        ]),
                        _: 1
                      }, 8, ["loading"])
                    ])
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="p-2"${_scopeId2}><p class="text-gray-700 dark:text-gray-300 mb-4"${_scopeId2}> \xCAtes-vous s\xFBr de vouloir supprimer le dossier <span class="font-semibold text-red-600 dark:text-red-400"${_scopeId2}>&quot;${ssrInterpolate(__props.dossier.libelle)}&quot;</span> ? </p><p class="text-sm text-gray-500 dark:text-gray-400"${_scopeId2}> Cette action supprimera d\xE9finitivement le dossier et toutes ses donn\xE9es associ\xE9es. </p></div>`);
                } else {
                  return [
                    createVNode("div", { class: "p-2" }, [
                      createVNode("p", { class: "text-gray-700 dark:text-gray-300 mb-4" }, [
                        createTextVNode(" \xCAtes-vous s\xFBr de vouloir supprimer le dossier "),
                        createVNode("span", { class: "font-semibold text-red-600 dark:text-red-400" }, '"' + toDisplayString(__props.dossier.libelle) + '"', 1),
                        createTextVNode(" ? ")
                      ]),
                      createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400" }, " Cette action supprimera d\xE9finitivement le dossier et toutes ses donn\xE9es associ\xE9es. ")
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UCard, { class: "rounded-2xl" }, {
                header: withCtx(() => [
                  createVNode("div", { class: "flex items-center gap-3" }, [
                    createVNode("div", { class: "w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center" }, [
                      createVNode(_component_UIcon, {
                        name: "i-heroicons-exclamation-triangle",
                        class: "w-5 h-5 text-red-600 dark:text-red-400"
                      })
                    ]),
                    createVNode("div", null, [
                      createVNode("h3", { class: "font-semibold text-gray-900 dark:text-white" }, "Confirmer la suppression"),
                      createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400" }, "Cette action est irr\xE9versible")
                    ])
                  ])
                ]),
                footer: withCtx(() => [
                  createVNode("div", { class: "flex justify-end gap-3" }, [
                    createVNode(_component_UButton, {
                      color: "gray",
                      variant: "ghost",
                      onClick: cancelDelete,
                      disabled: unref(codirStore).loading
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Annuler ")
                      ]),
                      _: 1
                    }, 8, ["disabled"]),
                    createVNode(_component_UButton, {
                      color: "red",
                      onClick: confirmDelete,
                      loading: unref(codirStore).loading
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UIcon, {
                          name: "i-heroicons-trash",
                          class: "w-4 h-4 mr-2"
                        }),
                        createTextVNode(" Supprimer ")
                      ]),
                      _: 1
                    }, 8, ["loading"])
                  ])
                ]),
                default: withCtx(() => [
                  createVNode("div", { class: "p-2" }, [
                    createVNode("p", { class: "text-gray-700 dark:text-gray-300 mb-4" }, [
                      createTextVNode(" \xCAtes-vous s\xFBr de vouloir supprimer le dossier "),
                      createVNode("span", { class: "font-semibold text-red-600 dark:text-red-400" }, '"' + toDisplayString(__props.dossier.libelle) + '"', 1),
                      createTextVNode(" ? ")
                    ]),
                    createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400" }, " Cette action supprimera d\xE9finitivement le dossier et toutes ses donn\xE9es associ\xE9es. ")
                  ])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dossier/DossierCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "[ordreId]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const router = useRouter();
    const store = useCodirsStore();
    const toast = useToast();
    const ordreId = Number(route.params.ordreId);
    const currentOrdreDuJour = ref(null);
    const loading = ref(true);
    const dossiers = computed(() => {
      var _a, _b;
      return (_b = (_a = currentOrdreDuJour.value) == null ? void 0 : _a.dossiers) != null ? _b : [];
    });
    const statutClass = (statut) => {
      var _a;
      const map = {
        actif: "text-green-600 bg-green-50 dark:bg-green-950/40",
        inactif: "text-gray-500 bg-gray-100 dark:bg-gray-800/60",
        archiv\u00E9: "text-amber-600 bg-amber-50 dark:bg-amber-950/40"
      };
      return (_a = map[statut]) != null ? _a : "text-gray-500 bg-gray-100";
    };
    const dossierModal = ref(false);
    const dossierForm = reactive({ libelle: "" });
    const resetDossierForm = () => Object.assign(dossierForm, { libelle: "" });
    const addDossier = async () => {
      if (!dossierForm.libelle.trim()) return;
      try {
        await store.addDossier(ordreId, { libelle: dossierForm.libelle.trim() });
        toast.add({
          title: "Dossier cr\xE9\xE9",
          description: `"${dossierForm.libelle}" a \xE9t\xE9 ajout\xE9 \xE0 l'ordre du jour`,
          color: "green",
          icon: "i-heroicons-check-circle"
        });
        dossierModal.value = false;
        resetDossierForm();
      } catch {
        toast.add({
          title: "Erreur",
          description: "Impossible de cr\xE9er le dossier",
          color: "red",
          icon: "i-heroicons-exclamation-circle"
        });
      }
    };
    const handleClick = (dossier) => {
      navigateTo(`/dossiers/${dossier.id}`);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = __nuxt_component_1;
      const _component_UIcon = __nuxt_component_2$1;
      const _component_UCard = __nuxt_component_2;
      const _component_UBadge = __nuxt_component_1$1;
      const _component_DossierCard = _sfc_main$1;
      const _component_UAlert = __nuxt_component_5;
      const _component_UModal = __nuxt_component_3;
      const _component_UFormGroup = __nuxt_component_1$2;
      const _component_UInput = __nuxt_component_2$2;
      _push(`<!--[--><div class="mx-auto py-10 px-6"><div class="mb-6 flex items-center gap-3">`);
      _push(ssrRenderComponent(_component_UButton, {
        icon: "i-heroicons-arrow-left",
        color: "gray",
        variant: "ghost",
        onClick: ($event) => unref(router).back()
      }, null, _parent));
      _push(`<span class="text-gray-400 text-sm">Retour</span></div>`);
      if (unref(loading)) {
        _push(`<div class="flex justify-center py-20">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-arrow-path",
          class: "w-8 h-8 animate-spin text-blue-500"
        }, null, _parent));
        _push(`</div>`);
      } else if (!unref(currentOrdreDuJour)) {
        _push(`<div class="text-center py-20">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-exclamation-triangle",
          class: "w-12 h-12 mx-auto text-amber-400 mb-4"
        }, null, _parent));
        _push(`<p class="text-gray-500 text-sm">Ordre du jour introuvable ou non charg\xE9.</p>`);
        _push(ssrRenderComponent(_component_UButton, {
          class: "mt-4",
          color: "gray",
          variant: "ghost",
          onClick: ($event) => unref(router).back()
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Retour`);
            } else {
              return [
                createTextVNode("Retour")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(_component_UCard, { class: "rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 mb-6" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            var _a, _b;
            if (_push2) {
              _push2(`<div class="p-2"${_scopeId}><div class="flex items-center gap-4"${_scopeId}><div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-md"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-clipboard-document-list",
                class: "w-6 h-6 text-white"
              }, null, _parent2, _scopeId));
              _push2(`</div><div${_scopeId}><h1 class="text-xl font-bold text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(unref(currentOrdreDuJour).libelle)}</h1><span class="${ssrRenderClass(`text-xs font-semibold px-2.5 py-1 rounded-full capitalize mt-1 inline-block ${statutClass(unref(currentOrdreDuJour).statut)}`)}"${_scopeId}>${ssrInterpolate(unref(currentOrdreDuJour).statut)}</span></div></div><div class="flex items-center gap-6 mt-5 pt-4 border-t border-gray-100 dark:border-gray-700"${_scopeId}><div class="flex items-center gap-2 text-sm text-gray-500"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-folder",
                class: "w-4 h-4 text-violet-500"
              }, null, _parent2, _scopeId));
              _push2(`<span${_scopeId}><strong class="text-gray-800 dark:text-white"${_scopeId}>${ssrInterpolate(unref(dossiers).length)}</strong> dossier(s) </span></div><div class="flex items-center gap-2 text-sm text-gray-500"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-building-office",
                class: "w-4 h-4 text-blue-500"
              }, null, _parent2, _scopeId));
              _push2(`<span class="text-xs text-gray-400"${_scopeId}> CODIR du ${ssrInterpolate(unref(formatDateFR)((_a = _ctx.currentCodir) == null ? void 0 : _a.date))}</span></div></div></div>`);
            } else {
              return [
                createVNode("div", { class: "p-2" }, [
                  createVNode("div", { class: "flex items-center gap-4" }, [
                    createVNode("div", { class: "w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-md" }, [
                      createVNode(_component_UIcon, {
                        name: "i-heroicons-clipboard-document-list",
                        class: "w-6 h-6 text-white"
                      })
                    ]),
                    createVNode("div", null, [
                      createVNode("h1", { class: "text-xl font-bold text-gray-900 dark:text-white" }, toDisplayString(unref(currentOrdreDuJour).libelle), 1),
                      createVNode("span", {
                        class: `text-xs font-semibold px-2.5 py-1 rounded-full capitalize mt-1 inline-block ${statutClass(unref(currentOrdreDuJour).statut)}`
                      }, toDisplayString(unref(currentOrdreDuJour).statut), 3)
                    ])
                  ]),
                  createVNode("div", { class: "flex items-center gap-6 mt-5 pt-4 border-t border-gray-100 dark:border-gray-700" }, [
                    createVNode("div", { class: "flex items-center gap-2 text-sm text-gray-500" }, [
                      createVNode(_component_UIcon, {
                        name: "i-heroicons-folder",
                        class: "w-4 h-4 text-violet-500"
                      }),
                      createVNode("span", null, [
                        createVNode("strong", { class: "text-gray-800 dark:text-white" }, toDisplayString(unref(dossiers).length), 1),
                        createTextVNode(" dossier(s) ")
                      ])
                    ]),
                    createVNode("div", { class: "flex items-center gap-2 text-sm text-gray-500" }, [
                      createVNode(_component_UIcon, {
                        name: "i-heroicons-building-office",
                        class: "w-4 h-4 text-blue-500"
                      }),
                      createVNode("span", { class: "text-xs text-gray-400" }, " CODIR du " + toDisplayString(unref(formatDateFR)((_b = _ctx.currentCodir) == null ? void 0 : _b.date)), 1)
                    ])
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<section><h2 class="text-base font-semibold flex items-center gap-2 mb-3">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-folder-open",
          class: "text-violet-500"
        }, null, _parent));
        _push(` Dossiers rattach\xE9s `);
        _push(ssrRenderComponent(_component_UBadge, {
          color: "violet",
          variant: "soft",
          size: "xs"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(dossiers).length)}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(dossiers).length), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UButton, {
          icon: "i-heroicons-plus",
          color: "blue",
          variant: "soft",
          onClick: ($event) => dossierModal.value = true
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Ajouter `);
            } else {
              return [
                createTextVNode(" Ajouter ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</h2>`);
        if (!unref(dossiers).length) {
          _push(`<div class="text-center py-8 text-gray-400 text-sm bg-gray-50 dark:bg-slate-800/50 rounded-xl"> Aucun dossier rattach\xE9 \xE0 cet ordre du jour </div>`);
        } else {
          _push(`<div class="flex flex-col gap-2"><!--[-->`);
          ssrRenderList(unref(dossiers), (dossier) => {
            _push(ssrRenderComponent(_component_DossierCard, {
              key: dossier.id,
              dossier,
              onClick: ($event) => handleClick(dossier),
              onDeleted: (dossierId) => unref(store).removeDossier(unref(ordreId), dossierId)
            }, null, _parent));
          });
          _push(`<!--]--></div>`);
        }
        _push(`</section><!--]-->`);
      }
      if (unref(store).error) {
        _push(ssrRenderComponent(_component_UAlert, {
          color: "red",
          icon: "i-heroicons-exclamation-circle",
          title: unref(store).error,
          class: "mt-4"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UModal, {
        modelValue: unref(dossierModal),
        "onUpdate:modelValue": ($event) => isRef(dossierModal) ? dossierModal.value = $event : null
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UCard, { class: "rounded-2xl" }, {
              header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<h3 class="font-semibold"${_scopeId2}>Ajouter un dossier</h3>`);
                } else {
                  return [
                    createVNode("h3", { class: "font-semibold" }, "Ajouter un dossier")
                  ];
                }
              }),
              footer: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex justify-end gap-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UButton, {
                    color: "gray",
                    variant: "ghost",
                    onClick: ($event) => dossierModal.value = false
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Annuler`);
                      } else {
                        return [
                          createTextVNode("Annuler")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButton, {
                    color: "blue",
                    loading: unref(store).loading,
                    onClick: addDossier
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Ajouter`);
                      } else {
                        return [
                          createTextVNode("Ajouter")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex justify-end gap-2" }, [
                      createVNode(_component_UButton, {
                        color: "gray",
                        variant: "ghost",
                        onClick: ($event) => dossierModal.value = false
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Annuler")
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(_component_UButton, {
                        color: "blue",
                        loading: unref(store).loading,
                        onClick: addDossier
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Ajouter")
                        ]),
                        _: 1
                      }, 8, ["loading"])
                    ])
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="p-2 flex flex-col gap-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UFormGroup, { label: "Libell\xE9" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(dossierForm).libelle,
                          "onUpdate:modelValue": ($event) => unref(dossierForm).libelle = $event,
                          placeholder: "Ex: Budget annuel",
                          size: "md"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(dossierForm).libelle,
                            "onUpdate:modelValue": ($event) => unref(dossierForm).libelle = $event,
                            placeholder: "Ex: Budget annuel",
                            size: "md"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "p-2 flex flex-col gap-4" }, [
                      createVNode(_component_UFormGroup, { label: "Libell\xE9" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(dossierForm).libelle,
                            "onUpdate:modelValue": ($event) => unref(dossierForm).libelle = $event,
                            placeholder: "Ex: Budget annuel",
                            size: "md"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      })
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UCard, { class: "rounded-2xl" }, {
                header: withCtx(() => [
                  createVNode("h3", { class: "font-semibold" }, "Ajouter un dossier")
                ]),
                footer: withCtx(() => [
                  createVNode("div", { class: "flex justify-end gap-2" }, [
                    createVNode(_component_UButton, {
                      color: "gray",
                      variant: "ghost",
                      onClick: ($event) => dossierModal.value = false
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Annuler")
                      ]),
                      _: 1
                    }, 8, ["onClick"]),
                    createVNode(_component_UButton, {
                      color: "blue",
                      loading: unref(store).loading,
                      onClick: addDossier
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Ajouter")
                      ]),
                      _: 1
                    }, 8, ["loading"])
                  ])
                ]),
                default: withCtx(() => [
                  createVNode("div", { class: "p-2 flex flex-col gap-4" }, [
                    createVNode(_component_UFormGroup, { label: "Libell\xE9" }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(dossierForm).libelle,
                          "onUpdate:modelValue": ($event) => unref(dossierForm).libelle = $event,
                          placeholder: "Ex: Budget annuel",
                          size: "md"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    })
                  ])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/ordres-du-jour/[ordreId].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_ordreId_-DpnOpKfM.mjs.map
