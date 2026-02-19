import __nuxt_component_2 from './Button-D4Pv8nAk.mjs';
import { _ as _sfc_main$3 } from './PageHeader-OIWZwZf2.mjs';
import __nuxt_component_0 from './Icon-BEWG_Jy9.mjs';
import __nuxt_component_0$1 from './Card-CAWDi9lB.mjs';
import __nuxt_component_1 from './FormGroup-BEdl0hCn.mjs';
import __nuxt_component_2$1 from './Input-3IU7zE8e.mjs';
import __nuxt_component_3 from './Textarea-CjN8za1H.mjs';
import { computed, unref, mergeProps, defineComponent, withCtx, createTextVNode, ref, createVNode, createBlock, openBlock, Fragment, renderList, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import { u as useCodirsStore } from './codirs-rzMUujto.mjs';
import { v as useRoute } from './server.mjs';
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
import './button-Bz5rwL6o.mjs';
import './index-DJmPz9HS.mjs';
import './useFormGroup-2eEELX00.mjs';
import './index-BLXEZ1Ia.mjs';

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "CodirTaskForm",
  __ssrInlineRender: true,
  setup(__props) {
    const selectedPeople = ref([
      { label: "Jean Dupont", initials: "JD", color: "bg-blue-100 text-blue-600" },
      { label: "Marie Curie", initials: "MC", color: "bg-emerald-100 text-emerald-600" }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = __nuxt_component_0$1;
      const _component_UButton = __nuxt_component_2;
      const _component_UFormGroup = __nuxt_component_1;
      const _component_UInput = __nuxt_component_2$1;
      const _component_UIcon = __nuxt_component_0;
      const _component_UTextarea = __nuxt_component_3;
      _push(ssrRenderComponent(_component_UCard, mergeProps({
        ui: { body: { padding: "p-6" }, ring: "ring-1 ring-gray-100 dark:ring-gray-800", background: "bg-white/50 dark:bg-slate-800/30" },
        class: "rounded-2xl relative"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              color: "gray",
              variant: "ghost",
              icon: "i-heroicons-x-mark",
              class: "absolute -right-2 -top-2 scale-75 opacity-0 group-hover:opacity-100 transition-opacity"
            }, null, _parent2, _scopeId));
            _push2(`<div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end"${_scopeId}><div class="lg:col-span-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "NOM DE LA T\xC2CHE",
              ui: { label: { base: "text-[9px] font-bold text-gray-400" } }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    placeholder: "Pr\xE9paration du tableau...",
                    size: "md"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      placeholder: "Pr\xE9paration du tableau...",
                      size: "md"
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="lg:col-span-5"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "RESPONSABLES",
              ui: { label: { base: "text-[9px] font-bold text-gray-400" } }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex flex-wrap gap-2 p-1.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-900"${_scopeId2}><!--[-->`);
                  ssrRenderList(unref(selectedPeople), (person) => {
                    _push3(`<div class="${ssrRenderClass([person.color, "flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium"])}"${_scopeId2}><span class="w-4 h-4 rounded text-[8px] flex items-center justify-center border border-current opacity-70 font-bold"${_scopeId2}>${ssrInterpolate(person.initials)}</span> ${ssrInterpolate(person.label)} `);
                    _push3(ssrRenderComponent(_component_UIcon, {
                      name: "i-heroicons-x-mark",
                      class: "cursor-pointer"
                    }, null, _parent3, _scopeId2));
                    _push3(`</div>`);
                  });
                  _push3(`<!--]-->`);
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-heroicons-chevron-down",
                    class: "ml-auto text-gray-400"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex flex-wrap gap-2 p-1.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-900" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(selectedPeople), (person) => {
                        return openBlock(), createBlock("div", {
                          key: person.label,
                          class: ["flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium", person.color]
                        }, [
                          createVNode("span", { class: "w-4 h-4 rounded text-[8px] flex items-center justify-center border border-current opacity-70 font-bold" }, toDisplayString(person.initials), 1),
                          createTextVNode(" " + toDisplayString(person.label) + " ", 1),
                          createVNode(_component_UIcon, {
                            name: "i-heroicons-x-mark",
                            class: "cursor-pointer"
                          })
                        ], 2);
                      }), 128)),
                      createVNode(_component_UIcon, {
                        name: "i-heroicons-chevron-down",
                        class: "ml-auto text-gray-400"
                      })
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="lg:col-span-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "\xC9CH\xC9ANCE",
              ui: { label: { base: "text-[9px] font-bold text-gray-400" } }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    type: "date",
                    icon: "i-heroicons-calendar-days"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      type: "date",
                      icon: "i-heroicons-calendar-days"
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div><div class="mt-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "OBSERVATIONS & NOTES COMPL\xC9MENTAIRES",
              ui: { label: { base: "text-[9px] font-bold text-gray-400" } }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UTextarea, {
                    placeholder: "Pr\xE9cisez les d\xE9tails de la t\xE2che...",
                    rows: 2,
                    variant: "outline"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UTextarea, {
                      placeholder: "Pr\xE9cisez les d\xE9tails de la t\xE2che...",
                      rows: 2,
                      variant: "outline"
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode(_component_UButton, {
                color: "gray",
                variant: "ghost",
                icon: "i-heroicons-x-mark",
                class: "absolute -right-2 -top-2 scale-75 opacity-0 group-hover:opacity-100 transition-opacity"
              }),
              createVNode("div", { class: "grid grid-cols-1 lg:grid-cols-12 gap-4 items-end" }, [
                createVNode("div", { class: "lg:col-span-4" }, [
                  createVNode(_component_UFormGroup, {
                    label: "NOM DE LA T\xC2CHE",
                    ui: { label: { base: "text-[9px] font-bold text-gray-400" } }
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        placeholder: "Pr\xE9paration du tableau...",
                        size: "md"
                      })
                    ]),
                    _: 1
                  })
                ]),
                createVNode("div", { class: "lg:col-span-5" }, [
                  createVNode(_component_UFormGroup, {
                    label: "RESPONSABLES",
                    ui: { label: { base: "text-[9px] font-bold text-gray-400" } }
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "flex flex-wrap gap-2 p-1.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-900" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(selectedPeople), (person) => {
                          return openBlock(), createBlock("div", {
                            key: person.label,
                            class: ["flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium", person.color]
                          }, [
                            createVNode("span", { class: "w-4 h-4 rounded text-[8px] flex items-center justify-center border border-current opacity-70 font-bold" }, toDisplayString(person.initials), 1),
                            createTextVNode(" " + toDisplayString(person.label) + " ", 1),
                            createVNode(_component_UIcon, {
                              name: "i-heroicons-x-mark",
                              class: "cursor-pointer"
                            })
                          ], 2);
                        }), 128)),
                        createVNode(_component_UIcon, {
                          name: "i-heroicons-chevron-down",
                          class: "ml-auto text-gray-400"
                        })
                      ])
                    ]),
                    _: 1
                  })
                ]),
                createVNode("div", { class: "lg:col-span-3" }, [
                  createVNode(_component_UFormGroup, {
                    label: "\xC9CH\xC9ANCE",
                    ui: { label: { base: "text-[9px] font-bold text-gray-400" } }
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        type: "date",
                        icon: "i-heroicons-calendar-days"
                      })
                    ]),
                    _: 1
                  })
                ])
              ]),
              createVNode("div", { class: "mt-4" }, [
                createVNode(_component_UFormGroup, {
                  label: "OBSERVATIONS & NOTES COMPL\xC9MENTAIRES",
                  ui: { label: { base: "text-[9px] font-bold text-gray-400" } }
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UTextarea, {
                      placeholder: "Pr\xE9cisez les d\xE9tails de la t\xE2che...",
                      rows: 2,
                      variant: "outline"
                    })
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/codir/CodirTaskForm.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "CodirDossier",
  __ssrInlineRender: true,
  props: {
    dossier: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    useCodirsStore();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = __nuxt_component_2;
      const _component_UIcon = __nuxt_component_0;
      const _component_CodirTaskForm = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative pl-8 pb-12 last:pb-0 border-l-2 border-dashed border-gray-200 dark:border-gray-800 ml-4" }, _attrs))}><div class="${ssrRenderClass([_ctx.isNew ? "bg-gray-300" : "bg-blue-500", "absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-white dark:border-slate-900 shadow-sm"])}"></div><div class="flex items-center justify-between mb-6">`);
      if (!_ctx.isNew) {
        _push(`<h3 class="text-xl font-bold text-slate-800 dark:text-white">${ssrInterpolate(__props.dossier.title)}</h3>`);
      } else {
        _push(`<input type="text" placeholder="Nouveau point focal..." class="text-xl font-bold bg-transparent border-none p-0 focus:ring-0 placeholder:text-gray-300 w-full">`);
      }
      if (__props.dossier.taches.length === 0) {
        _push(ssrRenderComponent(_component_UButton, {
          color: "gray",
          variant: "ghost",
          icon: "i-heroicons-trash",
          class: "text-gray-400"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="space-y-6">`);
      if (__props.dossier.taches.length > 0) {
        _push(`<div><div class="flex items-center gap-2 mb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-check-circle",
          class: "text-blue-500 text-sm"
        }, null, _parent));
        _push(` Actions &amp; T\xE2ches </div><!--[-->`);
        ssrRenderList(_ctx.tasks, (task) => {
          _push(`<div class="group">`);
          _push(ssrRenderComponent(_component_CodirTaskForm, null, null, _parent));
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_UButton, {
        variant: "ghost",
        icon: "i-heroicons-plus-circle",
        class: "font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20",
        onClick: () => {
        }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Ajouter une t\xE2che `);
          } else {
            return [
              createTextVNode(" Ajouter une t\xE2che ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/codir/CodirDossier.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const store = useCodirsStore();
    const currentPointsFocaux = computed(() => store.pointsFocaux.find((pf) => pf.id === Number(route.params.id)));
    console.log(currentPointsFocaux.value);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = __nuxt_component_2;
      const _component_PageHeader = _sfc_main$3;
      const _component_CodirDossier = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="flex items-center gap-2">`);
      _push(ssrRenderComponent(_component_UButton, {
        color: "gray",
        variant: "ghost",
        icon: "i-heroicons-arrow-left",
        onClick: ($event) => _ctx.$router.back()
      }, null, _parent));
      _push(ssrRenderComponent(_component_PageHeader, {
        title: "Dossier",
        description: "D\xE9tails du dossier"
      }, null, _parent));
      _push(`</div><div><!--[-->`);
      ssrRenderList(unref(store).dossiers, (dossier) => {
        _push(ssrRenderComponent(_component_CodirDossier, {
          key: dossier.id,
          dossier
        }, null, _parent));
      });
      _push(`<!--]--></div><div>`);
      _push(ssrRenderComponent(_component_UButton, {
        color: "gray",
        "loading-icon": "i-",
        label: "Ajouter un nouveau dossier",
        variant: "ghost",
        icon: "i-heroicons-plus",
        onClick: _ctx.addDossier
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/codir/points-focaux/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-CCpcYenu.mjs.map
