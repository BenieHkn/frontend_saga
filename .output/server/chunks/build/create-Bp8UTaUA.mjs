import { q as useRouter, d as __nuxt_component_1 } from './server.mjs';
import { _ as _sfc_main$1 } from './PageHeader-NxcDUFJW.mjs';
import __nuxt_component_2 from './Card-DtmGMnBU.mjs';
import __nuxt_component_1$1 from './FormGroup-C6GvzJxy.mjs';
import __nuxt_component_2$1 from './Input-50cchghJ.mjs';
import __nuxt_component_4 from './Select-C_BWMUVV.mjs';
import __nuxt_component_5 from './Alert-BJqo0-kE.mjs';
import { reactive, ref, mergeProps, unref, withCtx, createVNode, createTextVNode, withModifiers, createBlock, createCommentVNode, openBlock, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { u as useCodirsStore, S as STATUT_OPTIONS } from './codirs-D_To-40U.mjs';
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

const _sfc_main = {
  __name: "create",
  __ssrInlineRender: true,
  setup(__props) {
    const store = useCodirsStore();
    const router = useRouter();
    const form = reactive({
      date: "",
      heure_debut: "",
      heure_fin: "",
      statut: "nouveau"
    });
    const errors = ref({});
    function validate() {
      errors.value = {};
      if (!form.date) errors.value.date = "La date est requise";
      if (!form.heure_debut) errors.value.heure_debut = "L'heure de d\xE9but est requise";
      if (!form.heure_fin) errors.value.heure_fin = "L'heure de fin est requise";
      if (form.heure_fin && form.heure_debut && form.heure_fin <= form.heure_debut)
        errors.value.heure_fin = "L'heure de fin doit \xEAtre apr\xE8s l'heure de d\xE9but";
      return Object.keys(errors.value).length === 0;
    }
    const handleSubmit = async () => {
      if (!validate()) return;
      try {
        const codir = await store.createCodir({
          date: form.date,
          heure_debut: form.heure_debut,
          heure_fin: form.heure_fin,
          statut: form.statut
        });
        router.push(`/codir/${codir.id}`);
      } catch {
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = __nuxt_component_1;
      const _component_PageHeader = _sfc_main$1;
      const _component_UCard = __nuxt_component_2;
      const _component_UFormGroup = __nuxt_component_1$1;
      const _component_UInput = __nuxt_component_2$1;
      const _component_USelect = __nuxt_component_4;
      const _component_UAlert = __nuxt_component_5;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-2xl mx-auto py-10 px-6" }, _attrs))}><div class="mb-8 flex items-center gap-3">`);
      _push(ssrRenderComponent(_component_UButton, {
        icon: "i-heroicons-arrow-left",
        color: "gray",
        variant: "ghost",
        onClick: ($event) => unref(router).back()
      }, null, _parent));
      _push(ssrRenderComponent(_component_PageHeader, {
        title: "Nouveau CODIR",
        description: "Planifiez une nouvelle r\xE9union de direction"
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UCard, { class: "rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form class="flex flex-col gap-6 p-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "Date",
              error: unref(errors).date,
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(form).date,
                    "onUpdate:modelValue": ($event) => unref(form).date = $event,
                    type: "date",
                    size: "md"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).date,
                      "onUpdate:modelValue": ($event) => unref(form).date = $event,
                      type: "date",
                      size: "md"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="grid grid-cols-2 gap-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "Heure de d\xE9but",
              error: unref(errors).heure_debut,
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(form).heure_debut,
                    "onUpdate:modelValue": ($event) => unref(form).heure_debut = $event,
                    type: "time",
                    size: "md"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).heure_debut,
                      "onUpdate:modelValue": ($event) => unref(form).heure_debut = $event,
                      type: "time",
                      size: "md"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "Heure de fin",
              error: unref(errors).heure_fin,
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(form).heure_fin,
                    "onUpdate:modelValue": ($event) => unref(form).heure_fin = $event,
                    type: "time",
                    size: "md"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).heure_fin,
                      "onUpdate:modelValue": ($event) => unref(form).heure_fin = $event,
                      type: "time",
                      size: "md"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "Statut",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_USelect, {
                    modelValue: unref(form).statut,
                    "onUpdate:modelValue": ($event) => unref(form).statut = $event,
                    options: unref(STATUT_OPTIONS),
                    size: "md"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_USelect, {
                      modelValue: unref(form).statut,
                      "onUpdate:modelValue": ($event) => unref(form).statut = $event,
                      options: unref(STATUT_OPTIONS),
                      size: "md"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (unref(store).error) {
              _push2(ssrRenderComponent(_component_UAlert, {
                color: "red",
                icon: "i-heroicons-exclamation-circle",
                title: unref(store).error
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex justify-end gap-3 pt-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              color: "gray",
              variant: "ghost",
              onClick: ($event) => unref(router).back()
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
              type: "submit",
              color: "blue",
              loading: unref(store).loading,
              icon: "i-heroicons-check"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Cr\xE9er le CODIR `);
                } else {
                  return [
                    createTextVNode(" Cr\xE9er le CODIR ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></form>`);
          } else {
            return [
              createVNode("form", {
                onSubmit: withModifiers(handleSubmit, ["prevent"]),
                class: "flex flex-col gap-6 p-2"
              }, [
                createVNode(_component_UFormGroup, {
                  label: "Date",
                  error: unref(errors).date,
                  required: ""
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).date,
                      "onUpdate:modelValue": ($event) => unref(form).date = $event,
                      type: "date",
                      size: "md"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }, 8, ["error"]),
                createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                  createVNode(_component_UFormGroup, {
                    label: "Heure de d\xE9but",
                    error: unref(errors).heure_debut,
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(form).heure_debut,
                        "onUpdate:modelValue": ($event) => unref(form).heure_debut = $event,
                        type: "time",
                        size: "md"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }, 8, ["error"]),
                  createVNode(_component_UFormGroup, {
                    label: "Heure de fin",
                    error: unref(errors).heure_fin,
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(form).heure_fin,
                        "onUpdate:modelValue": ($event) => unref(form).heure_fin = $event,
                        type: "time",
                        size: "md"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }, 8, ["error"])
                ]),
                createVNode(_component_UFormGroup, {
                  label: "Statut",
                  required: ""
                }, {
                  default: withCtx(() => [
                    createVNode(_component_USelect, {
                      modelValue: unref(form).statut,
                      "onUpdate:modelValue": ($event) => unref(form).statut = $event,
                      options: unref(STATUT_OPTIONS),
                      size: "md"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                  ]),
                  _: 1
                }),
                unref(store).error ? (openBlock(), createBlock(_component_UAlert, {
                  key: 0,
                  color: "red",
                  icon: "i-heroicons-exclamation-circle",
                  title: unref(store).error
                }, null, 8, ["title"])) : createCommentVNode("", true),
                createVNode("div", { class: "flex justify-end gap-3 pt-2" }, [
                  createVNode(_component_UButton, {
                    color: "gray",
                    variant: "ghost",
                    onClick: ($event) => unref(router).back()
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Annuler")
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  createVNode(_component_UButton, {
                    type: "submit",
                    color: "blue",
                    loading: unref(store).loading,
                    icon: "i-heroicons-check"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Cr\xE9er le CODIR ")
                    ]),
                    _: 1
                  }, 8, ["loading"])
                ])
              ], 32)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/codir/create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=create-Bp8UTaUA.mjs.map
