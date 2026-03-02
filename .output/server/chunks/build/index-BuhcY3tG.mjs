import { _ as _sfc_main$4 } from './PageHeader-NxcDUFJW.mjs';
import __nuxt_component_2 from './Card-DtmGMnBU.mjs';
import { _ as _export_sfc, g as __nuxt_component_2$1 } from './server.mjs';
import { mergeProps, withCtx, createVNode, toDisplayString, createTextVNode, createBlock, openBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderAttr, ssrRenderList } from 'vue/server-renderer';
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

const _sfc_main$3 = {
  __name: "StatCard",
  __ssrInlineRender: true,
  props: ["title", "value", "icon", "trend", "isUp"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = __nuxt_component_2;
      const _component_UIcon = __nuxt_component_2$1;
      _push(ssrRenderComponent(_component_UCard, mergeProps({ class: "hover:shadow-lg transition-shadow duration-300" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-between items-start"${_scopeId}><div${_scopeId}><p class="text-slate-500 text-xs font-bold uppercase tracking-wider"${_scopeId}>${ssrInterpolate(__props.title)}</p><p class="text-slate-900 text-3xl font-black mt-1"${_scopeId}>${ssrInterpolate(__props.value)}</p></div><div class="p-2.5 rounded-xl bg-primary-500 text-white shadow-md"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: __props.icon,
              class: "w-6 h-6"
            }, null, _parent2, _scopeId));
            _push2(`</div></div><div class="flex items-center gap-2 mt-4"${_scopeId}><span class="${ssrRenderClass([
              "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold",
              __props.isUp ? "text-emerald-600 bg-emerald-50" : "text-rose-500 bg-rose-50"
            ])}"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: __props.isUp ? "i-heroicons-arrow-trending-up" : "i-heroicons-arrow-trending-down",
              class: "w-3 h-3"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(__props.trend)}</span><span class="text-slate-400 text-xs font-medium"${_scopeId}>vs last month</span></div>`);
          } else {
            return [
              createVNode("div", { class: "flex justify-between items-start" }, [
                createVNode("div", null, [
                  createVNode("p", { class: "text-slate-500 text-xs font-bold uppercase tracking-wider" }, toDisplayString(__props.title), 1),
                  createVNode("p", { class: "text-slate-900 text-3xl font-black mt-1" }, toDisplayString(__props.value), 1)
                ]),
                createVNode("div", { class: "p-2.5 rounded-xl bg-primary-500 text-white shadow-md" }, [
                  createVNode(_component_UIcon, {
                    name: __props.icon,
                    class: "w-6 h-6"
                  }, null, 8, ["name"])
                ])
              ]),
              createVNode("div", { class: "flex items-center gap-2 mt-4" }, [
                createVNode("span", {
                  class: [
                    "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold",
                    __props.isUp ? "text-emerald-600 bg-emerald-50" : "text-rose-500 bg-rose-50"
                  ]
                }, [
                  createVNode(_component_UIcon, {
                    name: __props.isUp ? "i-heroicons-arrow-trending-up" : "i-heroicons-arrow-trending-down",
                    class: "w-3 h-3"
                  }, null, 8, ["name"]),
                  createTextVNode(" " + toDisplayString(__props.trend), 1)
                ], 2),
                createVNode("span", { class: "text-slate-400 text-xs font-medium" }, "vs last month")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/StatCard.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = {
  __name: "StatusCircle",
  __ssrInlineRender: true,
  props: {
    count: String,
    label: String,
    icon: String,
    colorClass: String,
    offset: Number
    // Gère le remplissage du cercle
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = __nuxt_component_2;
      const _component_UIcon = __nuxt_component_2$1;
      _push(ssrRenderComponent(_component_UCard, mergeProps({ class: "flex flex-col items-center text-center py-6" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="relative flex items-center justify-center w-24 h-24 mb-4 mx-auto"${_scopeId}><svg class="absolute inset-0 w-full h-full -rotate-90"${_scopeId}><circle class="text-slate-50" cx="48" cy="48" r="40" fill="transparent" stroke="currentColor" stroke-width="8"${_scopeId}></circle><circle class="${ssrRenderClass(__props.colorClass)}" cx="48" cy="48" r="40" fill="transparent" stroke="currentColor" stroke-width="8" stroke-linecap="round"${ssrRenderAttr("stroke-dasharray", 251.2)}${ssrRenderAttr("stroke-dashoffset", __props.offset)}${_scopeId}></circle></svg>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: __props.icon,
              class: ["text-3xl", __props.colorClass]
            }, null, _parent2, _scopeId));
            _push2(`</div><h3 class="text-3xl font-black text-slate-900"${_scopeId}>${ssrInterpolate(__props.count)}</h3><p class="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1"${_scopeId}>${ssrInterpolate(__props.label)}</p>`);
          } else {
            return [
              createVNode("div", { class: "relative flex items-center justify-center w-24 h-24 mb-4 mx-auto" }, [
                (openBlock(), createBlock("svg", { class: "absolute inset-0 w-full h-full -rotate-90" }, [
                  createVNode("circle", {
                    class: "text-slate-50",
                    cx: "48",
                    cy: "48",
                    r: "40",
                    fill: "transparent",
                    stroke: "currentColor",
                    "stroke-width": "8"
                  }),
                  createVNode("circle", {
                    class: __props.colorClass,
                    cx: "48",
                    cy: "48",
                    r: "40",
                    fill: "transparent",
                    stroke: "currentColor",
                    "stroke-width": "8",
                    "stroke-linecap": "round",
                    "stroke-dasharray": 251.2,
                    "stroke-dashoffset": __props.offset
                  }, null, 10, ["stroke-dashoffset"])
                ])),
                createVNode(_component_UIcon, {
                  name: __props.icon,
                  class: ["text-3xl", __props.colorClass]
                }, null, 8, ["name", "class"])
              ]),
              createVNode("h3", { class: "text-3xl font-black text-slate-900" }, toDisplayString(__props.count), 1),
              createVNode("p", { class: "text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1" }, toDisplayString(__props.label), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/StatusCircle.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "VolumeChart",
  __ssrInlineRender: true,
  setup(__props) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = __nuxt_component_2;
      _push(ssrRenderComponent(_component_UCard, mergeProps({ class: "paper-card" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-between mb-8"${_scopeId}><div class="flex flex-col gap-1"${_scopeId}><h3 class="text-xl font-bold text-slate-900"${_scopeId}>Monthly Volume Analysis</h3><p class="text-sm text-slate-500 font-medium"${_scopeId}>Comprehensive flow of incoming vs processed mail</p></div><div class="flex gap-6 bg-slate-50 p-3 rounded-xl border border-slate-100"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><div class="size-3 rounded-full bg-blue-500 shadow-sm shadow-blue-500/30"${_scopeId}></div><span class="text-xs font-bold text-slate-600"${_scopeId}>Arrived</span></div><div class="flex items-center gap-2"${_scopeId}><div class="size-3 rounded-full bg-slate-400 shadow-sm shadow-slate-400/30"${_scopeId}></div><span class="text-xs font-bold text-slate-600"${_scopeId}>Processed</span></div></div></div><div class="relative w-full h-[300px]"${_scopeId}><svg class="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1100 300"${_scopeId}><defs${_scopeId}><linearGradient id="grad-arrived" x1="0%" x2="0%" y1="0%" y2="100%"${_scopeId}><stop offset="0%" stop-color="#3b82f6" stop-opacity="0.15"${_scopeId}></stop><stop offset="100%" stop-color="#3b82f6" stop-opacity="0"${_scopeId}></stop></linearGradient><linearGradient id="grad-processed" x1="0%" x2="0%" y1="0%" y2="100%"${_scopeId}><stop offset="0%" stop-color="#94a3b8" stop-opacity="0.1"${_scopeId}></stop><stop offset="100%" stop-color="#94a3b8" stop-opacity="0"${_scopeId}></stop></linearGradient></defs><g class="stroke-slate-100" stroke-width="1"${_scopeId}><!--[-->`);
            ssrRenderList([0, 75, 150, 225, 300], (y) => {
              _push2(`<line x1="0" x2="1100"${ssrRenderAttr("y1", y)}${ssrRenderAttr("y2", y)}${_scopeId}></line>`);
            });
            _push2(`<!--]--></g><path d="M 0 200 C 100 200, 100 170, 200 170 C 300 170, 300 240, 400 240 C 500 240, 500 150, 600 150 C 700 150, 700 190, 800 190 C 900 190, 1000 120, 1100 120 L 1100 300 L 0 300 Z" fill="url(#grad-processed)"${_scopeId}></path><path d="M 0 200 C 100 200, 100 170, 200 170 C 300 170, 300 240, 400 240 C 500 240, 500 150, 600 150 C 700 150, 700 190, 800 190 C 900 190, 1000 120, 1100 120" fill="none" class="stroke-slate-400" stroke-width="3" stroke-linecap="round"${_scopeId}></path><path d="M 0 150 C 100 150, 100 100, 200 100 C 300 100, 300 180, 400 180 C 500 180, 500 60, 600 60 C 700 60, 700 140, 800 140 C 900 140, 1000 40, 1100 40 L 1100 300 L 0 300 Z" fill="url(#grad-arrived)"${_scopeId}></path><path d="M 0 150 C 100 150, 100 100, 200 100 C 300 100, 300 180, 400 180 C 500 180, 500 60, 600 60 C 700 60, 700 140, 800 140 C 900 140, 1000 40, 1100 40" fill="none" class="stroke-blue-500" stroke-width="3" stroke-linecap="round"${_scopeId}></path><circle cx="200" cy="100" r="4.5" class="fill-white stroke-blue-500" stroke-width="2.5"${_scopeId}></circle><circle cx="600" cy="60" r="4.5" class="fill-white stroke-blue-500" stroke-width="2.5"${_scopeId}></circle><circle cx="1100" cy="40" r="4.5" class="fill-white stroke-blue-500" stroke-width="2.5"${_scopeId}></circle></svg></div><div class="flex justify-between mt-6 px-4"${_scopeId}><!--[-->`);
            ssrRenderList(months, (month) => {
              _push2(`<span class="text-[11px] text-slate-400 font-bold uppercase tracking-wider"${_scopeId}>${ssrInterpolate(month)}</span>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center justify-between mb-8" }, [
                createVNode("div", { class: "flex flex-col gap-1" }, [
                  createVNode("h3", { class: "text-xl font-bold text-slate-900" }, "Monthly Volume Analysis"),
                  createVNode("p", { class: "text-sm text-slate-500 font-medium" }, "Comprehensive flow of incoming vs processed mail")
                ]),
                createVNode("div", { class: "flex gap-6 bg-slate-50 p-3 rounded-xl border border-slate-100" }, [
                  createVNode("div", { class: "flex items-center gap-2" }, [
                    createVNode("div", { class: "size-3 rounded-full bg-blue-500 shadow-sm shadow-blue-500/30" }),
                    createVNode("span", { class: "text-xs font-bold text-slate-600" }, "Arrived")
                  ]),
                  createVNode("div", { class: "flex items-center gap-2" }, [
                    createVNode("div", { class: "size-3 rounded-full bg-slate-400 shadow-sm shadow-slate-400/30" }),
                    createVNode("span", { class: "text-xs font-bold text-slate-600" }, "Processed")
                  ])
                ])
              ]),
              createVNode("div", { class: "relative w-full h-[300px]" }, [
                (openBlock(), createBlock("svg", {
                  class: "w-full h-full",
                  preserveAspectRatio: "none",
                  viewBox: "0 0 1100 300"
                }, [
                  createVNode("defs", null, [
                    createVNode("linearGradient", {
                      id: "grad-arrived",
                      x1: "0%",
                      x2: "0%",
                      y1: "0%",
                      y2: "100%"
                    }, [
                      createVNode("stop", {
                        offset: "0%",
                        "stop-color": "#3b82f6",
                        "stop-opacity": "0.15"
                      }),
                      createVNode("stop", {
                        offset: "100%",
                        "stop-color": "#3b82f6",
                        "stop-opacity": "0"
                      })
                    ]),
                    createVNode("linearGradient", {
                      id: "grad-processed",
                      x1: "0%",
                      x2: "0%",
                      y1: "0%",
                      y2: "100%"
                    }, [
                      createVNode("stop", {
                        offset: "0%",
                        "stop-color": "#94a3b8",
                        "stop-opacity": "0.1"
                      }),
                      createVNode("stop", {
                        offset: "100%",
                        "stop-color": "#94a3b8",
                        "stop-opacity": "0"
                      })
                    ])
                  ]),
                  createVNode("g", {
                    class: "stroke-slate-100",
                    "stroke-width": "1"
                  }, [
                    (openBlock(), createBlock(Fragment, null, renderList([0, 75, 150, 225, 300], (y) => {
                      return createVNode("line", {
                        key: y,
                        x1: "0",
                        x2: "1100",
                        y1: y,
                        y2: y
                      }, null, 8, ["y1", "y2"]);
                    }), 64))
                  ]),
                  createVNode("path", {
                    d: "M 0 200 C 100 200, 100 170, 200 170 C 300 170, 300 240, 400 240 C 500 240, 500 150, 600 150 C 700 150, 700 190, 800 190 C 900 190, 1000 120, 1100 120 L 1100 300 L 0 300 Z",
                    fill: "url(#grad-processed)"
                  }),
                  createVNode("path", {
                    d: "M 0 200 C 100 200, 100 170, 200 170 C 300 170, 300 240, 400 240 C 500 240, 500 150, 600 150 C 700 150, 700 190, 800 190 C 900 190, 1000 120, 1100 120",
                    fill: "none",
                    class: "stroke-slate-400",
                    "stroke-width": "3",
                    "stroke-linecap": "round"
                  }),
                  createVNode("path", {
                    d: "M 0 150 C 100 150, 100 100, 200 100 C 300 100, 300 180, 400 180 C 500 180, 500 60, 600 60 C 700 60, 700 140, 800 140 C 900 140, 1000 40, 1100 40 L 1100 300 L 0 300 Z",
                    fill: "url(#grad-arrived)"
                  }),
                  createVNode("path", {
                    d: "M 0 150 C 100 150, 100 100, 200 100 C 300 100, 300 180, 400 180 C 500 180, 500 60, 600 60 C 700 60, 700 140, 800 140 C 900 140, 1000 40, 1100 40",
                    fill: "none",
                    class: "stroke-blue-500",
                    "stroke-width": "3",
                    "stroke-linecap": "round"
                  }),
                  createVNode("circle", {
                    cx: "200",
                    cy: "100",
                    r: "4.5",
                    class: "fill-white stroke-blue-500",
                    "stroke-width": "2.5"
                  }),
                  createVNode("circle", {
                    cx: "600",
                    cy: "60",
                    r: "4.5",
                    class: "fill-white stroke-blue-500",
                    "stroke-width": "2.5"
                  }),
                  createVNode("circle", {
                    cx: "1100",
                    cy: "40",
                    r: "4.5",
                    class: "fill-white stroke-blue-500",
                    "stroke-width": "2.5"
                  })
                ]))
              ]),
              createVNode("div", { class: "flex justify-between mt-6 px-4" }, [
                (openBlock(), createBlock(Fragment, null, renderList(months, (month) => {
                  return createVNode("span", {
                    key: month,
                    class: "text-[11px] text-slate-400 font-bold uppercase tracking-wider"
                  }, toDisplayString(month), 1);
                }), 64))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/VolumeChart.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_PageHeader = _sfc_main$4;
  const _component_StatCard = _sfc_main$3;
  const _component_StatusCircle = _sfc_main$2;
  const _component_VolumeChart = _sfc_main$1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-50/30 font-sans text-slate-900 p-6" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_PageHeader, {
    title: "Statistiques",
    subtitle: "Focal des flux de courriers"
  }, null, _parent));
  _push(`<div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">`);
  _push(ssrRenderComponent(_component_StatCard, {
    title: "Total Arrived",
    value: "1,284",
    icon: "i-heroicons-inbox",
    trend: "12.5%",
    isUp: true
  }, null, _parent));
  _push(ssrRenderComponent(_component_StatCard, {
    title: "Total Sent",
    value: "942",
    icon: "i-heroicons-paper-airplane",
    trend: "4.2%",
    isUp: false
  }, null, _parent));
  _push(ssrRenderComponent(_component_StatCard, {
    title: "Total Processed",
    value: "1,105",
    icon: "i-heroicons-check-badge",
    trend: "8.1%",
    isUp: true
  }, null, _parent));
  _push(`</div><div class="mb-10"><h2 class="text-xl font-bold mb-6 flex items-center gap-2"><span class="w-1.5 h-6 bg-primary-500 rounded-full"></span> Processing Status </h2><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">`);
  _push(ssrRenderComponent(_component_StatusCircle, {
    count: "42",
    label: "In Progress",
    icon: "i-heroicons-clock",
    colorClass: "text-blue-500",
    offset: 100
  }, null, _parent));
  _push(ssrRenderComponent(_component_StatusCircle, {
    count: "15",
    label: "Unprocessed",
    icon: "i-heroicons-exclamation-triangle",
    colorClass: "text-amber-500",
    offset: 210
  }, null, _parent));
  _push(ssrRenderComponent(_component_StatusCircle, {
    count: "89",
    label: "Transferred",
    icon: "i-heroicons-arrow-path-rounded-square",
    colorClass: "text-indigo-500",
    offset: 40
  }, null, _parent));
  _push(ssrRenderComponent(_component_StatusCircle, {
    count: "31",
    label: "Assigned",
    icon: "i-heroicons-user-plus",
    colorClass: "text-emerald-500",
    offset: 180
  }, null, _parent));
  _push(`</div></div>`);
  _push(ssrRenderComponent(_component_VolumeChart, null, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/stats/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { index as default };
//# sourceMappingURL=index-BuhcY3tG.mjs.map
