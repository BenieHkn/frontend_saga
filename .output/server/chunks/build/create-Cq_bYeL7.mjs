import __nuxt_component_0 from './Container-CEVYLYbh.mjs';
import { _ as _sfc_main$7 } from './PageHeader-OIWZwZf2.mjs';
import { withCtx, defineComponent, unref, createTextVNode, createVNode, createBlock, createCommentVNode, openBlock, mergeProps, ref, computed, isRef, Fragment, renderList, reactive, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import __nuxt_component_2$1 from './Input-3IU7zE8e.mjs';
import __nuxt_component_0$2 from './Card-CAWDi9lB.mjs';
import __nuxt_component_0$1 from './Icon-BEWG_Jy9.mjs';
import __nuxt_component_1$1 from './Badge-C_KHizXa.mjs';
import __nuxt_component_2 from './Button-D4Pv8nAk.mjs';
import { u as useCodirsStore } from './codirs-rzMUujto.mjs';
import { n as navigateTo } from './server.mjs';
import __nuxt_component_1 from './FormGroup-BEdl0hCn.mjs';
import { _ as __nuxt_component_1$2 } from './Avatar-BE6on_fb.mjs';
import __nuxt_component_3 from './Textarea-CjN8za1H.mjs';
import { _ as _sfc_main$8 } from './DataTable-87jejf7-.mjs';
import __nuxt_component_2$2 from './Tooltip-BvCY5Xmi.mjs';
import __nuxt_component_5 from './Dropdown-CAxyOgWI.mjs';
import './tooltip-lourJnw0.mjs';
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
import './useFormGroup-2eEELX00.mjs';
import './index-BLXEZ1Ia.mjs';
import './useButtonGroup-DPIFBtCe.mjs';
import './index-DJmPz9HS.mjs';
import './Link-SQZY3OU3.mjs';
import './ohash.D__AXeF1-DqcdtjQw.mjs';
import './link-Bz3Wc5MF.mjs';
import './button-Bz5rwL6o.mjs';
import 'pinia';
import 'vue-router';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './Select-BY_Jn5yn.mjs';
import './Checkbox-Nzn56Oau.mjs';
import './Kbd-CYR4buDH.mjs';
import './usePopper-BrvKSG9Z.mjs';
import './keyboard-BCt0ZeLv.mjs';
import './use-outside-click-BqFFeIfQ.mjs';
import './focus-management-CclPs0xY.mjs';
import './use-resolve-button-type-CCTzT7JK.mjs';
import './use-text-value-CScX7TKV.mjs';
import './calculate-active-index-BN0T2bP2.mjs';
import './open-closed-DaveoKA1.mjs';

const _sfc_main$6 = /* @__PURE__ */ defineComponent({
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
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/StepIndicator.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "CodirPointsFocauxCard",
  __ssrInlineRender: true,
  props: {
    point: {}
  },
  emits: ["edit", "delete"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const statusStyle = computed(() => {
      switch (props.point.status) {
        case "Termin\xE9":
          return {
            iconBox: "bg-emerald-50 text-emerald-500 dark:bg-emerald-900/20",
            badge: "emerald",
            dot: "bg-emerald-500",
            icon: "i-heroicons-check-circle"
          };
        case "En cours":
          return {
            iconBox: "bg-blue-50 text-blue-500 dark:bg-blue-900/20",
            badge: "blue",
            dot: "bg-blue-500",
            icon: "i-heroicons-arrow-path"
          };
        case "En attente":
          return {
            iconBox: "bg-amber-50 text-amber-500 dark:bg-amber-900/20",
            badge: "amber",
            dot: "bg-amber-500",
            icon: "i-heroicons-clock"
          };
        default:
          return {
            iconBox: "bg-gray-50 text-gray-500 dark:bg-gray-900/20",
            badge: "gray",
            dot: "bg-gray-500",
            icon: "i-heroicons-document"
          };
      }
    });
    const isNewBadge = computed(() => props.point.isNew);
    const formattedDate = computed(() => {
      const date = new Date(props.point.date);
      return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    });
    const handleEdit = () => {
      emit("edit", props.point);
    };
    const handleDelete = () => {
      emit("delete", props.point);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = __nuxt_component_0$2;
      const _component_UIcon = __nuxt_component_0$1;
      const _component_UBadge = __nuxt_component_1$1;
      const _component_UButton = __nuxt_component_2;
      _push(ssrRenderComponent(_component_UCard, mergeProps({
        class: "group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ring-1 ring-gray-200 dark:ring-gray-800",
        ui: { body: { padding: "p-6 sm:p-6" }, rounded: "rounded-2xl" }
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col md:flex-row gap-6"${_scopeId}><div class="${ssrRenderClass([unref(statusStyle).iconBox, "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl transition-colors"])}"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: unref(statusStyle).icon,
              class: "h-8 w-8"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="flex-1 flex flex-col gap-2"${_scopeId}><div class="flex items-center gap-3 flex-wrap"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UBadge, {
              color: unref(statusStyle).badge,
              variant: "subtle",
              size: "xs",
              label: __props.point.status,
              class: "uppercase font-bold tracking-wider px-2"
            }, null, _parent2, _scopeId));
            if (unref(isNewBadge)) {
              _push2(ssrRenderComponent(_component_UBadge, {
                color: "indigo",
                variant: "solid",
                size: "xs",
                label: "Nouveau",
                class: "uppercase font-bold tracking-wider px-2"
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`<span class="flex items-center gap-1 text-xs font-medium text-gray-500"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-calendar",
              class: "h-3 w-3"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(formattedDate))}</span><span class="flex items-center gap-1 text-xs font-medium text-gray-500"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-clock",
              class: "h-3 w-3"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(__props.point.time)}</span></div><h3 class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors"${_scopeId}>${ssrInterpolate(__props.point.title)}</h3>`);
            if (__props.point.description) {
              _push2(`<p class="text-sm text-gray-500 line-clamp-2"${_scopeId}>${ssrInterpolate(__props.point.description)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="mt-2 flex items-center gap-4 flex-wrap"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><span class="${ssrRenderClass([unref(statusStyle).dot, "h-2 w-2 rounded-full"])}"${_scopeId}></span><span class="text-xs font-bold text-gray-700 dark:text-gray-300"${_scopeId}> Point focal ${ssrInterpolate(__props.point.isNew ? "cr\xE9\xE9" : "existant")}</span></div>`);
            if (__props.point.responsables && __props.point.responsables.length > 0) {
              _push2(`<div${_scopeId}><!--[-->`);
              ssrRenderList(__props.point.responsables, (responsable) => {
                _push2(`<div class="flex items-center gap-2"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-heroicons-user",
                  class: "h-4 w-4 text-gray-400"
                }, null, _parent2, _scopeId));
                _push2(`<span class="text-xs text-gray-600 dark:text-gray-400"${_scopeId}>${ssrInterpolate(responsable.name)}</span></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.point.priorite) {
              _push2(ssrRenderComponent(_component_UBadge, {
                color: __props.point.priorite === "Haute" ? "red" : __props.point.priorite === "Moyenne" ? "amber" : "gray",
                variant: "soft",
                size: "xs",
                label: __props.point.priorite
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div class="flex md:flex-col items-center justify-center gap-2 border-t pt-4 md:border-t-0 md:pt-0 md:border-l md:pl-6 border-gray-100 dark:border-gray-800"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              icon: "i-heroicons-pencil-square",
              variant: "ghost",
              color: "gray",
              label: "Modifier",
              class: "flex-1 md:flex-none w-full justify-center",
              onClick: handleEdit
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              icon: "i-heroicons-trash",
              variant: "ghost",
              color: "red",
              label: "Supprimer",
              class: "flex-1 md:flex-none w-full justify-center hover:bg-red-50 dark:hover:bg-red-900/20",
              onClick: handleDelete
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-col md:flex-row gap-6" }, [
                createVNode("div", {
                  class: ["flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl transition-colors", unref(statusStyle).iconBox]
                }, [
                  createVNode(_component_UIcon, {
                    name: unref(statusStyle).icon,
                    class: "h-8 w-8"
                  }, null, 8, ["name"])
                ], 2),
                createVNode("div", { class: "flex-1 flex flex-col gap-2" }, [
                  createVNode("div", { class: "flex items-center gap-3 flex-wrap" }, [
                    createVNode(_component_UBadge, {
                      color: unref(statusStyle).badge,
                      variant: "subtle",
                      size: "xs",
                      label: __props.point.status,
                      class: "uppercase font-bold tracking-wider px-2"
                    }, null, 8, ["color", "label"]),
                    unref(isNewBadge) ? (openBlock(), createBlock(_component_UBadge, {
                      key: 0,
                      color: "indigo",
                      variant: "solid",
                      size: "xs",
                      label: "Nouveau",
                      class: "uppercase font-bold tracking-wider px-2"
                    })) : createCommentVNode("", true),
                    createVNode("span", { class: "flex items-center gap-1 text-xs font-medium text-gray-500" }, [
                      createVNode(_component_UIcon, {
                        name: "i-heroicons-calendar",
                        class: "h-3 w-3"
                      }),
                      createTextVNode(" " + toDisplayString(unref(formattedDate)), 1)
                    ]),
                    createVNode("span", { class: "flex items-center gap-1 text-xs font-medium text-gray-500" }, [
                      createVNode(_component_UIcon, {
                        name: "i-heroicons-clock",
                        class: "h-3 w-3"
                      }),
                      createTextVNode(" " + toDisplayString(__props.point.time), 1)
                    ])
                  ]),
                  createVNode("h3", { class: "text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors" }, toDisplayString(__props.point.title), 1),
                  __props.point.description ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "text-sm text-gray-500 line-clamp-2"
                  }, toDisplayString(__props.point.description), 1)) : createCommentVNode("", true),
                  createVNode("div", { class: "mt-2 flex items-center gap-4 flex-wrap" }, [
                    createVNode("div", { class: "flex items-center gap-2" }, [
                      createVNode("span", {
                        class: ["h-2 w-2 rounded-full", unref(statusStyle).dot]
                      }, null, 2),
                      createVNode("span", { class: "text-xs font-bold text-gray-700 dark:text-gray-300" }, " Point focal " + toDisplayString(__props.point.isNew ? "cr\xE9\xE9" : "existant"), 1)
                    ]),
                    __props.point.responsables && __props.point.responsables.length > 0 ? (openBlock(), createBlock("div", { key: 0 }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.point.responsables, (responsable) => {
                        return openBlock(), createBlock("div", {
                          key: responsable.id,
                          class: "flex items-center gap-2"
                        }, [
                          createVNode(_component_UIcon, {
                            name: "i-heroicons-user",
                            class: "h-4 w-4 text-gray-400"
                          }),
                          createVNode("span", { class: "text-xs text-gray-600 dark:text-gray-400" }, toDisplayString(responsable.name), 1)
                        ]);
                      }), 128))
                    ])) : createCommentVNode("", true),
                    __props.point.priorite ? (openBlock(), createBlock(_component_UBadge, {
                      key: 1,
                      color: __props.point.priorite === "Haute" ? "red" : __props.point.priorite === "Moyenne" ? "amber" : "gray",
                      variant: "soft",
                      size: "xs",
                      label: __props.point.priorite
                    }, null, 8, ["color", "label"])) : createCommentVNode("", true)
                  ])
                ]),
                createVNode("div", { class: "flex md:flex-col items-center justify-center gap-2 border-t pt-4 md:border-t-0 md:pt-0 md:border-l md:pl-6 border-gray-100 dark:border-gray-800" }, [
                  createVNode(_component_UButton, {
                    icon: "i-heroicons-pencil-square",
                    variant: "ghost",
                    color: "gray",
                    label: "Modifier",
                    class: "flex-1 md:flex-none w-full justify-center",
                    onClick: handleEdit
                  }),
                  createVNode(_component_UButton, {
                    icon: "i-heroicons-trash",
                    variant: "ghost",
                    color: "red",
                    label: "Supprimer",
                    class: "flex-1 md:flex-none w-full justify-center hover:bg-red-50 dark:hover:bg-red-900/20",
                    onClick: handleDelete
                  })
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/codir/CodirPointsFocauxCard.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "CodirPointsFocauxListe",
  __ssrInlineRender: true,
  setup(__props) {
    const store = useCodirsStore();
    const searchQuery = ref("");
    const filteredItems = computed(() => {
      var _a, _b;
      return (_b = (_a = store.currentCodir) == null ? void 0 : _a.pointsFocaux) == null ? void 0 : _b.filter((item) => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.value.toLowerCase());
        return matchesSearch;
      });
    });
    const handleEdit = (item) => {
      console.log(item);
      navigateTo(`/codir/points-focaux/${item.id}`);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UContainer = __nuxt_component_0;
      const _component_PageHeader = _sfc_main$7;
      const _component_UInput = __nuxt_component_2$1;
      const _component_CodirPointsFocauxCard = _sfc_main$5;
      const _component_UIcon = __nuxt_component_0$1;
      _push(ssrRenderComponent(_component_UContainer, mergeProps({ class: "max-w-screen bg-white p-5 rounded-xxl dark:bg-gray-950" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_PageHeader, {
              class: "mt-5",
              title: "Points \xE0 l'Ordre du Jour"
            }, null, _parent2, _scopeId));
            _push2(`<div class="mb-8 flex flex-wrap items-center gap-4"${_scopeId}><div class="relative min-w-[300px] flex-1"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(searchQuery),
              "onUpdate:modelValue": ($event) => isRef(searchQuery) ? searchQuery.value = $event : null,
              icon: "i-heroicons-magnifying-glass",
              placeholder: "Rechercher un point, un service ou une action...",
              size: "xl",
              ui: { rounded: "rounded-xl", icon: { trailing: { pointer: "" } } },
              class: "bg-white dark:bg-gray-900 shadow-sm"
            }, null, _parent2, _scopeId));
            _push2(`</div></div><div class="grid grid-cols-1 gap-6"${_scopeId}><!--[-->`);
            ssrRenderList(unref(filteredItems), (item) => {
              _push2(ssrRenderComponent(_component_CodirPointsFocauxCard, {
                key: item.id,
                point: item,
                onEdit: ($event) => handleEdit(item)
              }, null, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
            if (unref(filteredItems).length === 0) {
              _push2(`<div class="flex flex-col items-center justify-center py-20 text-gray-400"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-face-frown",
                class: "text-6xl mb-4"
              }, null, _parent2, _scopeId));
              _push2(`<p class="text-xl font-bold"${_scopeId}>Aucun point trouv\xE9</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode(_component_PageHeader, {
                class: "mt-5",
                title: "Points \xE0 l'Ordre du Jour"
              }),
              createVNode("div", { class: "mb-8 flex flex-wrap items-center gap-4" }, [
                createVNode("div", { class: "relative min-w-[300px] flex-1" }, [
                  createVNode(_component_UInput, {
                    modelValue: unref(searchQuery),
                    "onUpdate:modelValue": ($event) => isRef(searchQuery) ? searchQuery.value = $event : null,
                    icon: "i-heroicons-magnifying-glass",
                    placeholder: "Rechercher un point, un service ou une action...",
                    size: "xl",
                    ui: { rounded: "rounded-xl", icon: { trailing: { pointer: "" } } },
                    class: "bg-white dark:bg-gray-900 shadow-sm"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ])
              ]),
              createVNode("div", { class: "grid grid-cols-1 gap-6" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(filteredItems), (item) => {
                  return openBlock(), createBlock(_component_CodirPointsFocauxCard, {
                    key: item.id,
                    point: item,
                    onEdit: ($event) => handleEdit(item)
                  }, null, 8, ["point", "onEdit"]);
                }), 128)),
                unref(filteredItems).length === 0 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "flex flex-col items-center justify-center py-20 text-gray-400"
                }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-face-frown",
                    class: "text-6xl mb-4"
                  }),
                  createVNode("p", { class: "text-xl font-bold" }, "Aucun point trouv\xE9")
                ])) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/codir/CodirPointsFocauxListe.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "AttendanceCard",
  __ssrInlineRender: true,
  props: {
    name: {},
    role: {},
    initials: {}
  },
  setup(__props) {
    const status = ref("present");
    const reason = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = __nuxt_component_0$2;
      const _component_UAvatar = __nuxt_component_1$2;
      const _component_UButton = __nuxt_component_2;
      const _component_UTextarea = __nuxt_component_3;
      _push(ssrRenderComponent(_component_UCard, mergeProps({
        ui: { body: { padding: "p-4" }, ring: "ring-1 ring-gray-200 dark:ring-gray-800", background: "bg-white/40 dark:bg-slate-800/40" },
        class: "rounded-2xl"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-between mb-4"${_scopeId}><div class="flex items-center gap-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UAvatar, {
              alt: __props.name,
              size: "sm",
              ui: { background: "bg-gray-200 dark:bg-gray-700" }
            }, null, _parent2, _scopeId));
            _push2(`<div${_scopeId}><p class="text-sm font-semibold"${_scopeId}>${ssrInterpolate(__props.name)}</p><p class="text-[10px] text-gray-400"${_scopeId}>${ssrInterpolate(__props.role)}</p></div></div><div class="flex items-center gap-1 bg-gray-100 dark:bg-gray-900 rounded-full p-1"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              size: "xs",
              variant: unref(status) === "present" ? "white" : "ghost",
              class: [unref(status) === "present" ? "text-green-600 shadow-sm" : "text-gray-400", "rounded-full px-4"],
              onClick: ($event) => status.value = "present"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Pr\xE9sent `);
                } else {
                  return [
                    createTextVNode(" Pr\xE9sent ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              size: "xs",
              variant: unref(status) === "absent" ? "solid" : "ghost",
              color: unref(status) === "absent" ? "red" : "gray",
              class: [unref(status) === "absent" ? "" : "text-gray-400", "rounded-full px-4 transition-all"],
              onClick: ($event) => status.value = "absent"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Absent `);
                } else {
                  return [
                    createTextVNode(" Absent ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
            if (unref(status) === "absent") {
              _push2(`<div class="space-y-1.5 mt-4"${_scopeId}><label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider"${_scopeId}>Motif de l&#39;absence</label>`);
              _push2(ssrRenderComponent(_component_UTextarea, {
                modelValue: unref(reason),
                "onUpdate:modelValue": ($event) => isRef(reason) ? reason.value = $event : null,
                placeholder: "Ex: D\xE9placement client...",
                variant: "outline",
                rows: 2,
                autoresize: ""
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("div", { class: "flex items-center justify-between mb-4" }, [
                createVNode("div", { class: "flex items-center gap-3" }, [
                  createVNode(_component_UAvatar, {
                    alt: __props.name,
                    size: "sm",
                    ui: { background: "bg-gray-200 dark:bg-gray-700" }
                  }, null, 8, ["alt"]),
                  createVNode("div", null, [
                    createVNode("p", { class: "text-sm font-semibold" }, toDisplayString(__props.name), 1),
                    createVNode("p", { class: "text-[10px] text-gray-400" }, toDisplayString(__props.role), 1)
                  ])
                ]),
                createVNode("div", { class: "flex items-center gap-1 bg-gray-100 dark:bg-gray-900 rounded-full p-1" }, [
                  createVNode(_component_UButton, {
                    size: "xs",
                    variant: unref(status) === "present" ? "white" : "ghost",
                    class: [unref(status) === "present" ? "text-green-600 shadow-sm" : "text-gray-400", "rounded-full px-4"],
                    onClick: ($event) => status.value = "present"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Pr\xE9sent ")
                    ]),
                    _: 1
                  }, 8, ["variant", "class", "onClick"]),
                  createVNode(_component_UButton, {
                    size: "xs",
                    variant: unref(status) === "absent" ? "solid" : "ghost",
                    color: unref(status) === "absent" ? "red" : "gray",
                    class: [unref(status) === "absent" ? "" : "text-gray-400", "rounded-full px-4 transition-all"],
                    onClick: ($event) => status.value = "absent"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Absent ")
                    ]),
                    _: 1
                  }, 8, ["variant", "color", "class", "onClick"])
                ])
              ]),
              unref(status) === "absent" ? (openBlock(), createBlock("div", {
                key: 0,
                class: "space-y-1.5 mt-4"
              }, [
                createVNode("label", { class: "text-[10px] font-bold text-gray-500 uppercase tracking-wider" }, "Motif de l'absence"),
                createVNode(_component_UTextarea, {
                  modelValue: unref(reason),
                  "onUpdate:modelValue": ($event) => isRef(reason) ? reason.value = $event : null,
                  placeholder: "Ex: D\xE9placement client...",
                  variant: "outline",
                  rows: 2,
                  autoresize: ""
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AttendanceCard.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "CodirGeneralInformation",
  __ssrInlineRender: true,
  setup(__props) {
    const meetingData = reactive({
      title: "",
      location: "",
      date: "",
      start: "",
      end: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = __nuxt_component_0$2;
      const _component_UIcon = __nuxt_component_0$1;
      const _component_UFormGroup = __nuxt_component_1;
      const _component_UInput = __nuxt_component_2$1;
      const _component_UButton = __nuxt_component_2;
      const _component_AttendanceCard = _sfc_main$3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-slate-50 dark:bg-slate-950 transition-colors duration-200 p-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_UCard, {
        ui: { body: { padding: "p-8 md:p-12" }, ring: "ring-0", shadow: "shadow-xl", background: "bg-white dark:bg-slate-900" },
        class: "rounded-3xl border border-gray-100 dark:border-gray-800"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mb-10 text-center md:text-left"${_scopeId}><h2 class="text-3xl font-extrabold mb-2 tracking-tight"${_scopeId}>Meeting Info &amp; Attendance</h2><p class="text-gray-500 dark:text-gray-400 font-medium"${_scopeId}>\xC9tape 1 sur 3 : D\xE9tails de la r\xE9union et participants</p></div><div class="grid grid-cols-1 lg:grid-cols-2 gap-12"${_scopeId}><div class="space-y-6"${_scopeId}><div class="flex items-center gap-2 mb-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-document-text",
              class: "text-primary-500 text-xl"
            }, null, _parent2, _scopeId));
            _push2(`<h3 class="font-bold"${_scopeId}>D\xE9tails Logistiques</h3></div><div class="space-y-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "TITRE DE LA R\xC9UNION",
              size: "lg",
              ui: { label: { base: "text-[10px] font-bold text-gray-500 tracking-widest" } }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(meetingData).title,
                    "onUpdate:modelValue": ($event) => unref(meetingData).title = $event,
                    placeholder: "Ex: Revue Trimestrielle Q4"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(meetingData).title,
                      "onUpdate:modelValue": ($event) => unref(meetingData).title = $event,
                      placeholder: "Ex: Revue Trimestrielle Q4"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "LIEU (LOCATION)",
              size: "lg",
              ui: { label: { base: "text-[10px] font-bold text-gray-500 tracking-widest" } }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(meetingData).location,
                    "onUpdate:modelValue": ($event) => unref(meetingData).location = $event,
                    icon: "i-heroicons-map-pin",
                    placeholder: "Salle de conf\xE9rence A ou Zoom"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(meetingData).location,
                      "onUpdate:modelValue": ($event) => unref(meetingData).location = $event,
                      icon: "i-heroicons-map-pin",
                      placeholder: "Salle de conf\xE9rence A ou Zoom"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "DATE",
              size: "lg",
              ui: { label: { base: "text-[10px] font-bold text-gray-500 tracking-widest" } }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(meetingData).date,
                    "onUpdate:modelValue": ($event) => unref(meetingData).date = $event,
                    type: "date"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(meetingData).date,
                      "onUpdate:modelValue": ($event) => unref(meetingData).date = $event,
                      type: "date"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="grid grid-cols-2 gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "D\xC9BUT",
              size: "lg",
              ui: { label: { base: "text-[10px] font-bold text-gray-500 tracking-widest" } }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(meetingData).start,
                    "onUpdate:modelValue": ($event) => unref(meetingData).start = $event,
                    type: "time"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(meetingData).start,
                      "onUpdate:modelValue": ($event) => unref(meetingData).start = $event,
                      type: "time"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "FIN",
              size: "lg",
              ui: { label: { base: "text-[10px] font-bold text-gray-500 tracking-widest" } }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(meetingData).end,
                    "onUpdate:modelValue": ($event) => unref(meetingData).end = $event,
                    type: "time"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(meetingData).end,
                      "onUpdate:modelValue": ($event) => unref(meetingData).end = $event,
                      type: "time"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div></div></div><div class="space-y-6"${_scopeId}><div class="flex items-center justify-between mb-4"${_scopeId}><div class="flex items-center gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-user-plus",
              class: "text-primary-500 text-xl"
            }, null, _parent2, _scopeId));
            _push2(`<h3 class="font-bold"${_scopeId}>Participants</h3></div>`);
            _push2(ssrRenderComponent(_component_UButton, {
              variant: "link",
              size: "xs",
              color: "primary",
              icon: "i-heroicons-plus-circle",
              class: "font-bold uppercase tracking-widest"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Ajouter `);
                } else {
                  return [
                    createTextVNode(" Ajouter ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="space-y-4 max-h-[400px] overflow-y-auto pr-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_AttendanceCard, {
              name: "Jean Dupont",
              role: "Directeur Marketing",
              initials: "JD"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_AttendanceCard, {
              name: "Marie Lefebvre",
              role: "Lead Design",
              initials: "ML"
            }, null, _parent2, _scopeId));
            _push2(`</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "mb-10 text-center md:text-left" }, [
                createVNode("h2", { class: "text-3xl font-extrabold mb-2 tracking-tight" }, "Meeting Info & Attendance"),
                createVNode("p", { class: "text-gray-500 dark:text-gray-400 font-medium" }, "\xC9tape 1 sur 3 : D\xE9tails de la r\xE9union et participants")
              ]),
              createVNode("div", { class: "grid grid-cols-1 lg:grid-cols-2 gap-12" }, [
                createVNode("div", { class: "space-y-6" }, [
                  createVNode("div", { class: "flex items-center gap-2 mb-4" }, [
                    createVNode(_component_UIcon, {
                      name: "i-heroicons-document-text",
                      class: "text-primary-500 text-xl"
                    }),
                    createVNode("h3", { class: "font-bold" }, "D\xE9tails Logistiques")
                  ]),
                  createVNode("div", { class: "space-y-4" }, [
                    createVNode(_component_UFormGroup, {
                      label: "TITRE DE LA R\xC9UNION",
                      size: "lg",
                      ui: { label: { base: "text-[10px] font-bold text-gray-500 tracking-widest" } }
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(meetingData).title,
                          "onUpdate:modelValue": ($event) => unref(meetingData).title = $event,
                          placeholder: "Ex: Revue Trimestrielle Q4"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormGroup, {
                      label: "LIEU (LOCATION)",
                      size: "lg",
                      ui: { label: { base: "text-[10px] font-bold text-gray-500 tracking-widest" } }
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(meetingData).location,
                          "onUpdate:modelValue": ($event) => unref(meetingData).location = $event,
                          icon: "i-heroicons-map-pin",
                          placeholder: "Salle de conf\xE9rence A ou Zoom"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
                      createVNode(_component_UFormGroup, {
                        label: "DATE",
                        size: "lg",
                        ui: { label: { base: "text-[10px] font-bold text-gray-500 tracking-widest" } }
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(meetingData).date,
                            "onUpdate:modelValue": ($event) => unref(meetingData).date = $event,
                            type: "date"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "grid grid-cols-2 gap-2" }, [
                        createVNode(_component_UFormGroup, {
                          label: "D\xC9BUT",
                          size: "lg",
                          ui: { label: { base: "text-[10px] font-bold text-gray-500 tracking-widest" } }
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(meetingData).start,
                              "onUpdate:modelValue": ($event) => unref(meetingData).start = $event,
                              type: "time"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_UFormGroup, {
                          label: "FIN",
                          size: "lg",
                          ui: { label: { base: "text-[10px] font-bold text-gray-500 tracking-widest" } }
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              modelValue: unref(meetingData).end,
                              "onUpdate:modelValue": ($event) => unref(meetingData).end = $event,
                              type: "time"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        })
                      ])
                    ])
                  ])
                ]),
                createVNode("div", { class: "space-y-6" }, [
                  createVNode("div", { class: "flex items-center justify-between mb-4" }, [
                    createVNode("div", { class: "flex items-center gap-2" }, [
                      createVNode(_component_UIcon, {
                        name: "i-heroicons-user-plus",
                        class: "text-primary-500 text-xl"
                      }),
                      createVNode("h3", { class: "font-bold" }, "Participants")
                    ]),
                    createVNode(_component_UButton, {
                      variant: "link",
                      size: "xs",
                      color: "primary",
                      icon: "i-heroicons-plus-circle",
                      class: "font-bold uppercase tracking-widest"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Ajouter ")
                      ]),
                      _: 1
                    })
                  ]),
                  createVNode("div", { class: "space-y-4 max-h-[400px] overflow-y-auto pr-2" }, [
                    createVNode(_component_AttendanceCard, {
                      name: "Jean Dupont",
                      role: "Directeur Marketing",
                      initials: "JD"
                    }),
                    createVNode(_component_AttendanceCard, {
                      name: "Marie Lefebvre",
                      role: "Lead Design",
                      initials: "ML"
                    })
                  ])
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
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/codir/CodirGeneralInformation.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "CodirReview",
  __ssrInlineRender: true,
  setup(__props) {
    const tasks = ref([
      {
        id: 1,
        task: "Pr\xE9paration du tableau de bord KPIs",
        assignees: [
          { name: "Jean Dupont", initials: "JD" },
          { name: "Marie Curie", initials: "MC" }
        ],
        dueDate: "20/11/2023",
        status: "En cours"
      },
      {
        id: 2,
        task: "Analyse des retours clients Q3",
        assignees: [{ name: "Marie Curie", initials: "MC" }],
        dueDate: "25/11/2023",
        status: "\xC0 faire"
      }
    ]);
    const columns = [
      { key: "task", label: "NOM DE LA T\xC2CHE" },
      { key: "assignees", label: "RESPONSABLES" },
      { key: "dueDate", label: "\xC9CH\xC9ANCE" },
      { key: "status", label: "STATUT" },
      { key: "actions", label: "" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = __nuxt_component_0$2;
      const _component_DataTable = _sfc_main$8;
      const _component_UTooltip = __nuxt_component_2$2;
      const _component_UAvatar = __nuxt_component_1$2;
      const _component_UBadge = __nuxt_component_1$1;
      const _component_UDropdown = __nuxt_component_5;
      const _component_UButton = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-slate-50 dark:bg-slate-950 p-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_UCard, {
        ui: { body: { padding: "p-0" } },
        class: "max-w-6xl mx-auto rounded-[1.6rem] overflow-hidden shadow-2xl border-none"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_DataTable, {
              rows: unref(tasks),
              columns,
              ui: {
                thead: "bg-gray-50/50 dark:bg-slate-800/50",
                tr: { base: "hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors" }
              }
            }, {
              "task-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="font-bold text-slate-700 dark:text-slate-200"${_scopeId2}>${ssrInterpolate(row.task)}</span>`);
                } else {
                  return [
                    createVNode("span", { class: "font-bold text-slate-700 dark:text-slate-200" }, toDisplayString(row.task), 1)
                  ];
                }
              }),
              "assignees-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex -space-x-2"${_scopeId2}><!--[-->`);
                  ssrRenderList(row.assignees, (user) => {
                    _push3(ssrRenderComponent(_component_UTooltip, {
                      key: user.name,
                      text: user.name
                    }, {
                      default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_UAvatar, {
                            alt: user.name,
                            size: "sm",
                            class: "ring-2 ring-white dark:ring-slate-900 shadow-sm",
                            ui: { background: "bg-primary-100 dark:bg-primary-900", text: "text-primary-600 text-[10px]" }
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_UAvatar, {
                              alt: user.name,
                              size: "sm",
                              class: "ring-2 ring-white dark:ring-slate-900 shadow-sm",
                              ui: { background: "bg-primary-100 dark:bg-primary-900", text: "text-primary-600 text-[10px]" }
                            }, null, 8, ["alt"])
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  });
                  _push3(`<!--]--></div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex -space-x-2" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(row.assignees, (user) => {
                        return openBlock(), createBlock(_component_UTooltip, {
                          key: user.name,
                          text: user.name
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UAvatar, {
                              alt: user.name,
                              size: "sm",
                              class: "ring-2 ring-white dark:ring-slate-900 shadow-sm",
                              ui: { background: "bg-primary-100 dark:bg-primary-900", text: "text-primary-600 text-[10px]" }
                            }, null, 8, ["alt"])
                          ]),
                          _: 2
                        }, 1032, ["text"]);
                      }), 128))
                    ])
                  ];
                }
              }),
              "status-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UBadge, {
                    color: row.status === "En cours" ? "orange" : "gray",
                    variant: "flat",
                    size: "xs",
                    class: "rounded-full px-3 font-bold uppercase tracking-wider text-[9px]"
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(row.status)}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(row.status), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UBadge, {
                      color: row.status === "En cours" ? "orange" : "gray",
                      variant: "flat",
                      size: "xs",
                      class: "rounded-full px-3 font-bold uppercase tracking-wider text-[9px]"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(row.status), 1)
                      ]),
                      _: 2
                    }, 1032, ["color"])
                  ];
                }
              }),
              "actions-data": withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UDropdown, { items: [[{ label: "Modifier", icon: "i-heroicons-pencil-square" }, { label: "Supprimer", icon: "i-heroicons-trash", color: "red" }]] }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UButton, {
                          color: "gray",
                          variant: "ghost",
                          icon: "i-heroicons-ellipsis-horizontal"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UButton, {
                            color: "gray",
                            variant: "ghost",
                            icon: "i-heroicons-ellipsis-horizontal"
                          })
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UDropdown, { items: [[{ label: "Modifier", icon: "i-heroicons-pencil-square" }, { label: "Supprimer", icon: "i-heroicons-trash", color: "red" }]] }, {
                      default: withCtx(() => [
                        createVNode(_component_UButton, {
                          color: "gray",
                          variant: "ghost",
                          icon: "i-heroicons-ellipsis-horizontal"
                        })
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="p-8 bg-gray-50/50 dark:bg-slate-900/50 flex justify-between items-center italic text-sm text-gray-500"${_scopeId}><span${_scopeId}>Total : ${ssrInterpolate(unref(tasks).length)} t\xE2ches assign\xE9es</span><div class="flex gap-4"${_scopeId}><span class="flex items-center gap-1"${_scopeId}><div class="w-2 h-2 rounded-full bg-orange-400"${_scopeId}></div> En cours</span><span class="flex items-center gap-1"${_scopeId}><div class="w-2 h-2 rounded-full bg-gray-300"${_scopeId}></div> \xC0 faire</span></div></div>`);
          } else {
            return [
              createVNode(_component_DataTable, {
                rows: unref(tasks),
                columns,
                ui: {
                  thead: "bg-gray-50/50 dark:bg-slate-800/50",
                  tr: { base: "hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors" }
                }
              }, {
                "task-data": withCtx(({ row }) => [
                  createVNode("span", { class: "font-bold text-slate-700 dark:text-slate-200" }, toDisplayString(row.task), 1)
                ]),
                "assignees-data": withCtx(({ row }) => [
                  createVNode("div", { class: "flex -space-x-2" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(row.assignees, (user) => {
                      return openBlock(), createBlock(_component_UTooltip, {
                        key: user.name,
                        text: user.name
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UAvatar, {
                            alt: user.name,
                            size: "sm",
                            class: "ring-2 ring-white dark:ring-slate-900 shadow-sm",
                            ui: { background: "bg-primary-100 dark:bg-primary-900", text: "text-primary-600 text-[10px]" }
                          }, null, 8, ["alt"])
                        ]),
                        _: 2
                      }, 1032, ["text"]);
                    }), 128))
                  ])
                ]),
                "status-data": withCtx(({ row }) => [
                  createVNode(_component_UBadge, {
                    color: row.status === "En cours" ? "orange" : "gray",
                    variant: "flat",
                    size: "xs",
                    class: "rounded-full px-3 font-bold uppercase tracking-wider text-[9px]"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(row.status), 1)
                    ]),
                    _: 2
                  }, 1032, ["color"])
                ]),
                "actions-data": withCtx(({ row }) => [
                  createVNode(_component_UDropdown, { items: [[{ label: "Modifier", icon: "i-heroicons-pencil-square" }, { label: "Supprimer", icon: "i-heroicons-trash", color: "red" }]] }, {
                    default: withCtx(() => [
                      createVNode(_component_UButton, {
                        color: "gray",
                        variant: "ghost",
                        icon: "i-heroicons-ellipsis-horizontal"
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["rows"]),
              createVNode("div", { class: "p-8 bg-gray-50/50 dark:bg-slate-900/50 flex justify-between items-center italic text-sm text-gray-500" }, [
                createVNode("span", null, "Total : " + toDisplayString(unref(tasks).length) + " t\xE2ches assign\xE9es", 1),
                createVNode("div", { class: "flex gap-4" }, [
                  createVNode("span", { class: "flex items-center gap-1" }, [
                    createVNode("div", { class: "w-2 h-2 rounded-full bg-orange-400" }),
                    createTextVNode(" En cours")
                  ]),
                  createVNode("span", { class: "flex items-center gap-1" }, [
                    createVNode("div", { class: "w-2 h-2 rounded-full bg-gray-300" }),
                    createTextVNode(" \xC0 faire")
                  ])
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
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/codir/CodirReview.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "create",
  __ssrInlineRender: true,
  setup(__props) {
    const store = useCodirsStore();
    const handleNext = () => {
      if (store.currentStep < store.steps.length) {
        store.currentStep++;
      }
    };
    const handlePrevious = () => {
      if (store.currentStep > 1) {
        store.currentStep--;
      }
    };
    const handleCancel = () => {
      navigateTo("/codir");
    };
    console.log("le step actuel", store.currentStep);
    console.log("le nombre de steps", store.steps.length);
    console.log("les steps", store.steps);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UContainer = __nuxt_component_0;
      const _component_PageHeader = _sfc_main$7;
      const _component_StepIndicator = _sfc_main$6;
      const _component_CodirPointsFocauxListe = _sfc_main$4;
      const _component_CodirGeneralInformation = _sfc_main$2;
      const _component_CodirReview = _sfc_main$1;
      const _component_UButton = __nuxt_component_2;
      _push(ssrRenderComponent(_component_UContainer, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_PageHeader, {
              title: "CODIR",
              subtitle: "Gestion des r\xE9unions du CODIR"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_StepIndicator, {
              currentStep: unref(store).currentStep,
              steps: unref(store).steps
            }, null, _parent2, _scopeId));
            if (unref(store).currentStep === 1) {
              _push2(ssrRenderComponent(_component_CodirPointsFocauxListe, null, null, _parent2, _scopeId));
            } else if (unref(store).currentStep === 2) {
              _push2(ssrRenderComponent(_component_CodirGeneralInformation, null, null, _parent2, _scopeId));
            } else if (unref(store).currentStep === 3) {
              _push2(ssrRenderComponent(_component_CodirReview, null, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="mt-2 flex items-center justify-between"${_scopeId}>`);
            if (unref(store).currentStep !== 1) {
              _push2(ssrRenderComponent(_component_UButton, {
                onClick: handlePrevious,
                size: "lg",
                variant: "ghost",
                icon: "i-heroicons-arrow-left",
                class: "rounded-2xl px-10 py-4 shadow-sm font-bold"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Pr\xE9c\xE9dent `);
                  } else {
                    return [
                      createTextVNode(" Pr\xE9c\xE9dent ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(_component_UButton, {
                onClick: handleCancel,
                size: "lg",
                variant: "ghost",
                icon: "i-heroicons-arrow-left",
                class: "rounded-2xl px-10 py-4 shadow-sm font-bold"
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
            }
            _push2(ssrRenderComponent(_component_UButton, {
              onClick: handleNext,
              size: "lg",
              trailing: "",
              icon: "i-heroicons-arrow-right",
              class: "rounded-2xl px-12 py-4 font-bold bg-gradient-to-r from-blue-500 to-emerald-500"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Suivant `);
                } else {
                  return [
                    createTextVNode(" Suivant ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode(_component_PageHeader, {
                title: "CODIR",
                subtitle: "Gestion des r\xE9unions du CODIR"
              }),
              createVNode(_component_StepIndicator, {
                currentStep: unref(store).currentStep,
                steps: unref(store).steps
              }, null, 8, ["currentStep", "steps"]),
              unref(store).currentStep === 1 ? (openBlock(), createBlock(_component_CodirPointsFocauxListe, { key: 0 })) : unref(store).currentStep === 2 ? (openBlock(), createBlock(_component_CodirGeneralInformation, { key: 1 })) : unref(store).currentStep === 3 ? (openBlock(), createBlock(_component_CodirReview, { key: 2 })) : createCommentVNode("", true),
              createVNode("div", { class: "mt-2 flex items-center justify-between" }, [
                unref(store).currentStep !== 1 ? (openBlock(), createBlock(_component_UButton, {
                  key: 0,
                  onClick: handlePrevious,
                  size: "lg",
                  variant: "ghost",
                  icon: "i-heroicons-arrow-left",
                  class: "rounded-2xl px-10 py-4 shadow-sm font-bold"
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Pr\xE9c\xE9dent ")
                  ]),
                  _: 1
                })) : (openBlock(), createBlock(_component_UButton, {
                  key: 1,
                  onClick: handleCancel,
                  size: "lg",
                  variant: "ghost",
                  icon: "i-heroicons-arrow-left",
                  class: "rounded-2xl px-10 py-4 shadow-sm font-bold"
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Annuler ")
                  ]),
                  _: 1
                })),
                createVNode(_component_UButton, {
                  onClick: handleNext,
                  size: "lg",
                  trailing: "",
                  icon: "i-heroicons-arrow-right",
                  class: "rounded-2xl px-12 py-4 font-bold bg-gradient-to-r from-blue-500 to-emerald-500"
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Suivant ")
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
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/codir/create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=create-Cq_bYeL7.mjs.map
