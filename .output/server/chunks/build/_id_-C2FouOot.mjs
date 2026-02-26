import { _ as _export_sfc, p as useRoute, q as useRouter, r as useToast, d as __nuxt_component_1, g as __nuxt_component_2$1 } from './server.mjs';
import __nuxt_component_2 from './Card-DtmGMnBU.mjs';
import __nuxt_component_2$2 from './Progress-DK9pWcAC.mjs';
import __nuxt_component_1$1 from './FormGroup-C6GvzJxy.mjs';
import __nuxt_component_2$3 from './Input-50cchghJ.mjs';
import __nuxt_component_4 from './Select-C_BWMUVV.mjs';
import __nuxt_component_1$2 from './Badge-DIEXPf_r.mjs';
import { ref, computed, reactive, watch, mergeProps, unref, defineComponent, withCtx, createTextVNode, createVNode, createBlock, createCommentVNode, toDisplayString, openBlock, Transition, isRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderList } from 'vue/server-renderer';
import { u as useCodirsStore, e as extractDateInput, a as extractTimeInput, f as formatDateFR, g as getStatutConfig, b as extractTime, S as STATUT_OPTIONS } from './codirs-D_To-40U.mjs';
import __nuxt_component_5 from './Alert-BJqo0-kE.mjs';
import __nuxt_component_3 from './Modal-EvFvX6Ng.mjs';
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
import './useFormGroup-BPckFnLf.mjs';
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
  __name: "CodirOrdreDuJour",
  __ssrInlineRender: true,
  props: {
    ordres: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false }
  },
  emits: ["attach", "detach"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const statutClass = (statut) => {
      var _a;
      const map = {
        actif: "text-green-600 bg-green-50 dark:bg-green-950/40",
        inactif: "text-gray-500 bg-gray-100 dark:bg-gray-800/60",
        archiv\u00E9: "text-amber-600 bg-amber-50 dark:bg-amber-950/40"
      };
      return (_a = map[statut]) != null ? _a : "text-gray-500 bg-gray-100";
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = __nuxt_component_2$1;
      const _component_UBadge = __nuxt_component_1$2;
      const _component_UButton = __nuxt_component_1;
      _push(`<section${ssrRenderAttrs(_attrs)}><div class="flex items-center justify-between mb-3"><h2 class="text-base font-semibold flex items-center gap-2">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-heroicons-clipboard-document-list",
        class: "text-blue-500"
      }, null, _parent));
      _push(` Ordres du jour `);
      _push(ssrRenderComponent(_component_UBadge, {
        color: "blue",
        variant: "soft",
        size: "xs"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.ordres.length)}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.ordres.length), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</h2>`);
      _push(ssrRenderComponent(_component_UButton, {
        icon: "i-heroicons-plus",
        color: "blue",
        variant: "soft",
        size: "xs",
        onClick: ($event) => emit("attach")
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
      _push(`</div>`);
      if (!__props.ordres.length) {
        _push(`<div class="text-center py-6 text-gray-400 text-sm bg-gray-50 dark:bg-slate-800/50 rounded-xl"> Aucun ordre du jour </div>`);
      } else {
        _push(`<div class="flex flex-col gap-2"><!--[-->`);
        ssrRenderList(__props.ordres, (ordre) => {
          _push(`<div class="group flex items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-3 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900 transition-all cursor-pointer"><div class="flex items-center gap-3 min-w-0"><div class="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center shrink-0">`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-heroicons-document-text",
            class: "w-3.5 h-3.5 text-blue-500"
          }, null, _parent));
          _push(`</div><div class="min-w-0"><p class="text-sm font-medium truncate">${ssrInterpolate(ordre.libelle)}</p><span class="${ssrRenderClass(`text-[10px] font-semibold capitalize ${statutClass(ordre.statut)}`)}">${ssrInterpolate(ordre.statut)}</span></div></div><div class="flex items-center gap-2 shrink-0">`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-heroicons-chevron-right",
            class: "w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors"
          }, null, _parent));
          _push(ssrRenderComponent(_component_UButton, {
            icon: "i-heroicons-x-mark",
            color: "red",
            variant: "ghost",
            size: "xs",
            onClick: ($event) => emit("detach", ordre.id)
          }, null, _parent));
          _push(`</div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</section>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/codir/CodirOrdreDuJour.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "StepIndicator",
  __ssrInlineRender: true,
  props: {
    currentStep: {},
    steps: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mb-2 relative flex items-center justify-between max-w-2xl mx-auto" }, _attrs))}><div class="absolute top-5 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-800 -z-0"></div><!--[-->`);
      ssrRenderList(__props.steps, (step) => {
        _push(`<div class="relative z-10 flex flex-col items-center"><div class="${ssrRenderClass([
          "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300",
          __props.currentStep === step.id ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30" : "bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-gray-800 text-gray-400"
        ])}">${ssrInterpolate(step.id)}</div><span class="${ssrRenderClass([
          "mt-2 text-[10px] uppercase tracking-widest font-bold",
          __props.currentStep === step.id ? "text-primary-500" : "text-gray-400"
        ])}">${ssrInterpolate(step.label)}</span></div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/StepIndicator.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const router = useRouter();
    const store = useCodirsStore();
    const id = Number(route.params.id);
    const toast = useToast();
    const currentStep = ref(1);
    const steps = [
      { id: 1, label: "Ordres du jour" },
      { id: 2, label: "Informations g\xE9n\xE9rales" },
      { id: 3, label: "T\xE2ches" }
    ];
    const codir = computed(() => store.currentCodir);
    const progressionGlobale = computed(() => {
      var _a, _b;
      const taches = (_b = (_a = codir.value) == null ? void 0 : _a.taches) != null ? _b : [];
      if (!taches.length) return 0;
      return Math.round(taches.reduce((a, t) => {
        var _a2, _b2;
        return a + ((_b2 = (_a2 = t.pivot) == null ? void 0 : _a2.progression) != null ? _b2 : 0);
      }, 0) / taches.length);
    });
    const editing = ref(false);
    const editForm = reactive({ date: "", heure_debut: "", heure_fin: "", statut: "" });
    watch(codir, (c) => {
      if (!c) return;
      editForm.date = extractDateInput(c.date);
      editForm.heure_debut = extractTimeInput(c.heure_debut);
      editForm.heure_fin = extractTimeInput(c.heure_fin);
      editForm.statut = c.statut;
    }, { immediate: true });
    const saveCodir = async () => {
      await store.updateCodir(id, editForm);
      toast.add({
        title: "CODIR mis \xE0 jour",
        description: "Les informations du CODIR ont \xE9t\xE9 mises \xE0 jour avec succ\xE8s.",
        color: "green",
        icon: "i-heroicons-check-circle"
      });
      editing.value = false;
    };
    const ordreModal = ref(false);
    const ordreForm = reactive({ libelle: "", statut: "actif", codir_id: id });
    const resetOrdreForm = () => Object.assign(ordreForm, { libelle: "", statut: "actif" });
    const addOrdre = async () => {
      if (!ordreForm.libelle) return;
      try {
        await store.createOrdreDuJour(ordreForm);
        toast.add({
          title: "Ordre du jour cr\xE9\xE9",
          description: `"${ordreForm.libelle}" a \xE9t\xE9 ajout\xE9 au CODIR`,
          color: "green",
          icon: "i-heroicons-check-circle"
        });
        ordreModal.value = false;
        resetOrdreForm();
      } catch {
        toast.add({
          title: "Erreur",
          description: "Impossible de cr\xE9er l'ordre du jour",
          color: "red",
          icon: "i-heroicons-exclamation-circle"
        });
      }
    };
    const handleDetachOrdre = async (ordreId) => {
      try {
        await store.detachOrdreDuJour(id, ordreId);
        toast.add({
          title: "Ordre du jour retir\xE9",
          color: "green",
          icon: "i-heroicons-check-circle"
        });
      } catch {
        toast.add({
          title: "Erreur",
          description: "Impossible de retirer l'ordre du jour",
          color: "red",
          icon: "i-heroicons-exclamation-circle"
        });
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_UButton = __nuxt_component_1;
      const _component_UIcon = __nuxt_component_2$1;
      const _component_UCard = __nuxt_component_2;
      const _component_UProgress = __nuxt_component_2$2;
      const _component_UFormGroup = __nuxt_component_1$1;
      const _component_UInput = __nuxt_component_2$3;
      const _component_USelect = __nuxt_component_4;
      const _component_CodirOrdreDuJour = _sfc_main$2;
      const _component_UAlert = __nuxt_component_5;
      const _component_UModal = __nuxt_component_3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto py-10 px-6" }, _attrs))} data-v-96e40913><div class="mb-6 flex items-center gap-3" data-v-96e40913>`);
      _push(ssrRenderComponent(_component_UButton, {
        icon: "i-heroicons-arrow-left",
        color: "gray",
        variant: "ghost",
        onClick: ($event) => unref(router).push("/codir")
      }, null, _parent));
      _push(`<span class="text-gray-400 text-sm" data-v-96e40913>Retour au listing</span></div><div class="mb-8" data-v-96e40913>`);
      _push(ssrRenderComponent(_sfc_main$1, {
        currentStep: unref(currentStep),
        steps
      }, null, _parent));
      _push(`</div>`);
      if (unref(store).loading && !unref(codir)) {
        _push(`<div class="flex justify-center py-20" data-v-96e40913>`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-arrow-path",
          class: "w-8 h-8 animate-spin text-blue-500"
        }, null, _parent));
        _push(`</div>`);
      } else if (unref(codir)) {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(_component_UCard, { class: "rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 mb-6" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="p-2" data-v-96e40913${_scopeId}><div class="flex items-start justify-between gap-4 mb-3" data-v-96e40913${_scopeId}><div data-v-96e40913${_scopeId}><div class="flex items-center gap-3 flex-wrap mb-1" data-v-96e40913${_scopeId}><h1 class="text-2xl font-bold" data-v-96e40913${_scopeId}>${ssrInterpolate(unref(formatDateFR)(unref(codir).date))}</h1><span class="${ssrRenderClass(`text-xs font-semibold px-3 py-1 rounded-full ${unref(getStatutConfig)(unref(codir).statut).badgeClass}`)}" data-v-96e40913${_scopeId}>${ssrInterpolate(unref(getStatutConfig)(unref(codir).statut).label)}</span></div><p class="text-gray-400 text-sm flex items-center gap-1.5" data-v-96e40913${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, { name: "i-heroicons-clock" }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(unref(extractTime)(unref(codir).heure_debut))} \u2013 ${ssrInterpolate(unref(extractTime)(unref(codir).heure_fin))}</p></div>`);
              if (!unref(editing)) {
                _push2(ssrRenderComponent(_component_UButton, {
                  icon: "i-heroicons-pencil-square",
                  color: "blue",
                  variant: "ghost",
                  size: "sm",
                  onClick: ($event) => editing.value = true
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` Modifier `);
                    } else {
                      return [
                        createTextVNode(" Modifier ")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="flex items-center gap-3 mt-4" data-v-96e40913${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UProgress, {
                value: unref(progressionGlobale),
                color: "green",
                size: "sm",
                class: "flex-1"
              }, null, _parent2, _scopeId));
              _push2(`<span class="text-xs font-mono text-gray-400 w-16 text-right" data-v-96e40913${_scopeId}>${ssrInterpolate(unref(progressionGlobale))}% moy.</span></div>`);
              if (unref(editing)) {
                _push2(`<div class="border-t dark:border-gray-700 mt-5 pt-5" data-v-96e40913${_scopeId}><div class="grid grid-cols-2 gap-4 mb-4" data-v-96e40913${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UFormGroup, { label: "Date" }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_UInput, {
                        modelValue: unref(editForm).date,
                        "onUpdate:modelValue": ($event) => unref(editForm).date = $event,
                        type: "date",
                        size: "sm"
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(_component_UInput, {
                          modelValue: unref(editForm).date,
                          "onUpdate:modelValue": ($event) => unref(editForm).date = $event,
                          type: "date",
                          size: "sm"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(ssrRenderComponent(_component_UFormGroup, { label: "Statut" }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_USelect, {
                        modelValue: unref(editForm).statut,
                        "onUpdate:modelValue": ($event) => unref(editForm).statut = $event,
                        options: unref(STATUT_OPTIONS),
                        size: "sm"
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(_component_USelect, {
                          modelValue: unref(editForm).statut,
                          "onUpdate:modelValue": ($event) => unref(editForm).statut = $event,
                          options: unref(STATUT_OPTIONS),
                          size: "sm"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(ssrRenderComponent(_component_UFormGroup, { label: "Heure de d\xE9but" }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_UInput, {
                        modelValue: unref(editForm).heure_debut,
                        "onUpdate:modelValue": ($event) => unref(editForm).heure_debut = $event,
                        type: "time",
                        size: "sm"
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(_component_UInput, {
                          modelValue: unref(editForm).heure_debut,
                          "onUpdate:modelValue": ($event) => unref(editForm).heure_debut = $event,
                          type: "time",
                          size: "sm"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(ssrRenderComponent(_component_UFormGroup, { label: "Heure de fin" }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_UInput, {
                        modelValue: unref(editForm).heure_fin,
                        "onUpdate:modelValue": ($event) => unref(editForm).heure_fin = $event,
                        type: "time",
                        size: "sm"
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(_component_UInput, {
                          modelValue: unref(editForm).heure_fin,
                          "onUpdate:modelValue": ($event) => unref(editForm).heure_fin = $event,
                          type: "time",
                          size: "sm"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(`</div><div class="flex justify-end gap-2" data-v-96e40913${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UButton, {
                  color: "gray",
                  variant: "ghost",
                  size: "sm",
                  onClick: ($event) => editing.value = false
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`Annuler`);
                    } else {
                      return [
                        createTextVNode("Annuler")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(ssrRenderComponent(_component_UButton, {
                  color: "blue",
                  size: "sm",
                  loading: unref(store).loading,
                  onClick: saveCodir
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`Enregistrer`);
                    } else {
                      return [
                        createTextVNode("Enregistrer")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(`</div></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { class: "p-2" }, [
                  createVNode("div", { class: "flex items-start justify-between gap-4 mb-3" }, [
                    createVNode("div", null, [
                      createVNode("div", { class: "flex items-center gap-3 flex-wrap mb-1" }, [
                        createVNode("h1", { class: "text-2xl font-bold" }, toDisplayString(unref(formatDateFR)(unref(codir).date)), 1),
                        createVNode("span", {
                          class: `text-xs font-semibold px-3 py-1 rounded-full ${unref(getStatutConfig)(unref(codir).statut).badgeClass}`
                        }, toDisplayString(unref(getStatutConfig)(unref(codir).statut).label), 3)
                      ]),
                      createVNode("p", { class: "text-gray-400 text-sm flex items-center gap-1.5" }, [
                        createVNode(_component_UIcon, { name: "i-heroicons-clock" }),
                        createTextVNode(" " + toDisplayString(unref(extractTime)(unref(codir).heure_debut)) + " \u2013 " + toDisplayString(unref(extractTime)(unref(codir).heure_fin)), 1)
                      ])
                    ]),
                    !unref(editing) ? (openBlock(), createBlock(_component_UButton, {
                      key: 0,
                      icon: "i-heroicons-pencil-square",
                      color: "blue",
                      variant: "ghost",
                      size: "sm",
                      onClick: ($event) => editing.value = true
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Modifier ")
                      ]),
                      _: 1
                    }, 8, ["onClick"])) : createCommentVNode("", true)
                  ]),
                  createVNode("div", { class: "flex items-center gap-3 mt-4" }, [
                    createVNode(_component_UProgress, {
                      value: unref(progressionGlobale),
                      color: "green",
                      size: "sm",
                      class: "flex-1"
                    }, null, 8, ["value"]),
                    createVNode("span", { class: "text-xs font-mono text-gray-400 w-16 text-right" }, toDisplayString(unref(progressionGlobale)) + "% moy.", 1)
                  ]),
                  createVNode(Transition, { name: "slide" }, {
                    default: withCtx(() => [
                      unref(editing) ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "border-t dark:border-gray-700 mt-5 pt-5"
                      }, [
                        createVNode("div", { class: "grid grid-cols-2 gap-4 mb-4" }, [
                          createVNode(_component_UFormGroup, { label: "Date" }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(editForm).date,
                                "onUpdate:modelValue": ($event) => unref(editForm).date = $event,
                                type: "date",
                                size: "sm"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormGroup, { label: "Statut" }, {
                            default: withCtx(() => [
                              createVNode(_component_USelect, {
                                modelValue: unref(editForm).statut,
                                "onUpdate:modelValue": ($event) => unref(editForm).statut = $event,
                                options: unref(STATUT_OPTIONS),
                                size: "sm"
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormGroup, { label: "Heure de d\xE9but" }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(editForm).heure_debut,
                                "onUpdate:modelValue": ($event) => unref(editForm).heure_debut = $event,
                                type: "time",
                                size: "sm"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UFormGroup, { label: "Heure de fin" }, {
                            default: withCtx(() => [
                              createVNode(_component_UInput, {
                                modelValue: unref(editForm).heure_fin,
                                "onUpdate:modelValue": ($event) => unref(editForm).heure_fin = $event,
                                type: "time",
                                size: "sm"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          })
                        ]),
                        createVNode("div", { class: "flex justify-end gap-2" }, [
                          createVNode(_component_UButton, {
                            color: "gray",
                            variant: "ghost",
                            size: "sm",
                            onClick: ($event) => editing.value = false
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Annuler")
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(_component_UButton, {
                            color: "blue",
                            size: "sm",
                            loading: unref(store).loading,
                            onClick: saveCodir
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Enregistrer")
                            ]),
                            _: 1
                          }, 8, ["loading"])
                        ])
                      ])) : createCommentVNode("", true)
                    ]),
                    _: 1
                  })
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="flex flex-col gap-8" data-v-96e40913>`);
        _push(ssrRenderComponent(_component_CodirOrdreDuJour, {
          ordres: (_a = unref(codir).ordres_du_jour) != null ? _a : [],
          loading: unref(store).loading,
          onAttach: ($event) => ordreModal.value = true,
          onDetach: ($event) => handleDetachOrdre($event)
        }, null, _parent));
        _push(`</div><!--]-->`);
      } else {
        _push(`<!---->`);
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
      _push(ssrRenderComponent(_component_UModal, {
        modelValue: unref(ordreModal),
        "onUpdate:modelValue": ($event) => isRef(ordreModal) ? ordreModal.value = $event : null
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UCard, { class: "rounded-2xl" }, {
              header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<h3 class="font-semibold" data-v-96e40913${_scopeId2}>Cr\xE9er un ordre du jour</h3>`);
                } else {
                  return [
                    createVNode("h3", { class: "font-semibold" }, "Cr\xE9er un ordre du jour")
                  ];
                }
              }),
              footer: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex justify-end gap-2" data-v-96e40913${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UButton, {
                    color: "gray",
                    variant: "ghost",
                    onClick: ($event) => ordreModal.value = false
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
                    onClick: addOrdre
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Cr\xE9er`);
                      } else {
                        return [
                          createTextVNode("Cr\xE9er")
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
                        onClick: ($event) => ordreModal.value = false
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Annuler")
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(_component_UButton, {
                        color: "blue",
                        loading: unref(store).loading,
                        onClick: addOrdre
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Cr\xE9er")
                        ]),
                        _: 1
                      }, 8, ["loading"])
                    ])
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="p-2 flex flex-col gap-4" data-v-96e40913${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UFormGroup, { label: "Libell\xE9" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(ordreForm).libelle,
                          "onUpdate:modelValue": ($event) => unref(ordreForm).libelle = $event,
                          placeholder: "Ex: Bilan trimestriel",
                          size: "md"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(ordreForm).libelle,
                            "onUpdate:modelValue": ($event) => unref(ordreForm).libelle = $event,
                            placeholder: "Ex: Bilan trimestriel",
                            size: "md"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UFormGroup, { label: "Statut" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelect, {
                          modelValue: unref(ordreForm).statut,
                          "onUpdate:modelValue": ($event) => unref(ordreForm).statut = $event,
                          options: [
                            { label: "Actif", value: "actif" },
                            { label: "Inactif", value: "inactif" },
                            { label: "Archiv\xE9", value: "archiv\xE9" }
                          ],
                          size: "md"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelect, {
                            modelValue: unref(ordreForm).statut,
                            "onUpdate:modelValue": ($event) => unref(ordreForm).statut = $event,
                            options: [
                              { label: "Actif", value: "actif" },
                              { label: "Inactif", value: "inactif" },
                              { label: "Archiv\xE9", value: "archiv\xE9" }
                            ],
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
                            modelValue: unref(ordreForm).libelle,
                            "onUpdate:modelValue": ($event) => unref(ordreForm).libelle = $event,
                            placeholder: "Ex: Bilan trimestriel",
                            size: "md"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UFormGroup, { label: "Statut" }, {
                        default: withCtx(() => [
                          createVNode(_component_USelect, {
                            modelValue: unref(ordreForm).statut,
                            "onUpdate:modelValue": ($event) => unref(ordreForm).statut = $event,
                            options: [
                              { label: "Actif", value: "actif" },
                              { label: "Inactif", value: "inactif" },
                              { label: "Archiv\xE9", value: "archiv\xE9" }
                            ],
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
                  createVNode("h3", { class: "font-semibold" }, "Cr\xE9er un ordre du jour")
                ]),
                footer: withCtx(() => [
                  createVNode("div", { class: "flex justify-end gap-2" }, [
                    createVNode(_component_UButton, {
                      color: "gray",
                      variant: "ghost",
                      onClick: ($event) => ordreModal.value = false
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Annuler")
                      ]),
                      _: 1
                    }, 8, ["onClick"]),
                    createVNode(_component_UButton, {
                      color: "blue",
                      loading: unref(store).loading,
                      onClick: addOrdre
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Cr\xE9er")
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
                          modelValue: unref(ordreForm).libelle,
                          "onUpdate:modelValue": ($event) => unref(ordreForm).libelle = $event,
                          placeholder: "Ex: Bilan trimestriel",
                          size: "md"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, { label: "Statut" }, {
                      default: withCtx(() => [
                        createVNode(_component_USelect, {
                          modelValue: unref(ordreForm).statut,
                          "onUpdate:modelValue": ($event) => unref(ordreForm).statut = $event,
                          options: [
                            { label: "Actif", value: "actif" },
                            { label: "Inactif", value: "inactif" },
                            { label: "Archiv\xE9", value: "archiv\xE9" }
                          ],
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
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/codir/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-96e40913"]]);

export { _id_ as default };
//# sourceMappingURL=_id_-C2FouOot.mjs.map
