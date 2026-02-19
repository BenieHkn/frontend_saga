import { _ as _sfc_main$3 } from './PageHeader-OIWZwZf2.mjs';
import __nuxt_component_2 from './Button-D4Pv8nAk.mjs';
import __nuxt_component_0 from './Icon-BEWG_Jy9.mjs';
import __nuxt_component_0$1 from './Card-CAWDi9lB.mjs';
import __nuxt_component_1 from './Badge-C_KHizXa.mjs';
import { ref, resolveComponent, mergeProps, unref, withCtx, createTextVNode, toDisplayString, defineComponent, isRef, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import __nuxt_component_5 from './Pagination-Bi90A-Xt.mjs';
import { u as useCodirsStore } from './codirs-rzMUujto.mjs';
import { _ as _export_sfc, n as navigateTo } from './server.mjs';
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
import './Link-SQZY3OU3.mjs';
import './ohash.D__AXeF1-DqcdtjQw.mjs';
import './link-Bz3Wc5MF.mjs';
import './tooltip-lourJnw0.mjs';
import './useButtonGroup-DPIFBtCe.mjs';
import './button-Bz5rwL6o.mjs';
import './index-DJmPz9HS.mjs';
import 'pinia';
import 'vue-router';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "CodirTaskGrid",
  __ssrInlineRender: true,
  props: {
    codir: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = __nuxt_component_0$1;
      const _component_UBadge = __nuxt_component_1;
      const _component_UButton = __nuxt_component_2;
      const _component_UIcon = __nuxt_component_0;
      _push(ssrRenderComponent(_component_UCard, mergeProps({ class: "relative rounded-2xl border-none shadow-sm hover:shadow-inner transition-all duration-300 group overflow-hidden bg-gradient-to-br from-green-800 to-blue-800 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-cyan-950/30 hover:scale-[0.97]" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"${_scopeId}></div><div class="relative z-10"${_scopeId}><div class="flex justify-between items-start mb-5"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UBadge, {
              color: "primary",
              variant: "soft",
              size: "xs",
              class: "rounded-full px-3 py-1 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 text-teal-700 dark:text-teal-300 border border-teal-200/50 dark:border-teal-800/50"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(__props.codir.status)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(__props.codir.status), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              color: "white",
              variant: "ghost",
              icon: "i-heroicons-pencil",
              size: "xs",
              class: "opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-teal-100 dark:hover:bg-teal-900/30"
            }, null, _parent2, _scopeId));
            _push2(`</div><h4 class="font-bold text-xl text-white mb-2 leading-tight text-gray-900 dark:text-black group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:via-teal-600 group-hover:to-cyan-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300"${_scopeId}>${ssrInterpolate(__props.codir.date)}</h4><p class="text-xs text-white dark:text-black flex items-center gap-1.5 mb-6"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-calendar",
              class: "text-teal-500"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(__props.codir.date)}</p><div class="flex items-center justify-between pt-4 border-t border-gradient-to-r from-emerald-100/50 via-teal-100/50 to-cyan-100/50 dark:border-teal-800/30"${_scopeId}><div class="flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 px-3 py-1.5 rounded-full border border-teal-200/50 dark:border-teal-800/50"${_scopeId}><div class="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 animate-pulse shadow-lg shadow-teal-500/50"${_scopeId}></div><span class="text-[10px] font-medium bg-white bg-clip-text text-transparent"${_scopeId}>${ssrInterpolate(__props.codir.status)}</span></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" }),
              createVNode("div", { class: "relative z-10" }, [
                createVNode("div", { class: "flex justify-between items-start mb-5" }, [
                  createVNode(_component_UBadge, {
                    color: "primary",
                    variant: "soft",
                    size: "xs",
                    class: "rounded-full px-3 py-1 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 text-teal-700 dark:text-teal-300 border border-teal-200/50 dark:border-teal-800/50"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(__props.codir.status), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UButton, {
                    color: "white",
                    variant: "ghost",
                    icon: "i-heroicons-pencil",
                    size: "xs",
                    class: "opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-teal-100 dark:hover:bg-teal-900/30"
                  })
                ]),
                createVNode("h4", { class: "font-bold text-xl text-white mb-2 leading-tight text-gray-900 dark:text-black group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:via-teal-600 group-hover:to-cyan-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300" }, toDisplayString(__props.codir.date), 1),
                createVNode("p", { class: "text-xs text-white dark:text-black flex items-center gap-1.5 mb-6" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-calendar",
                    class: "text-teal-500"
                  }),
                  createTextVNode(" " + toDisplayString(__props.codir.date), 1)
                ]),
                createVNode("div", { class: "flex items-center justify-between pt-4 border-t border-gradient-to-r from-emerald-100/50 via-teal-100/50 to-cyan-100/50 dark:border-teal-800/30" }, [
                  createVNode("div", { class: "flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 px-3 py-1.5 rounded-full border border-teal-200/50 dark:border-teal-800/50" }, [
                    createVNode("div", { class: "w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 animate-pulse shadow-lg shadow-teal-500/50" }),
                    createVNode("span", { class: "text-[10px] font-medium bg-white bg-clip-text text-transparent" }, toDisplayString(__props.codir.status), 1)
                  ])
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
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/codir/CodirTaskGrid.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "CodirTaskCard",
  __ssrInlineRender: true,
  props: {
    codir: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = __nuxt_component_0;
      const _component_UBadge = __nuxt_component_1;
      const _component_UButton = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center justify-between p-4 bg-white shadow-sm dark:bg-slate-900 border border-gray-100 dark:border-gray-800 rounded-2xl hover:shadow-md transition-shadow" }, _attrs))}><div class="flex items-center gap-4"><div class="p-2 bg-gradient-to-r from-green-600 to-blue-600 dark:bg-primary-900/30 rounded-xl">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-heroicons-clipboard-document-list",
        class: "text-white w-5 h-5"
      }, null, _parent));
      _push(`</div><div><h4 class="font-bold text-slate-800 dark:text-white">${ssrInterpolate(__props.codir.date)}</h4><p class="text-xs text-gray-400 italic">\xC9ch\xE9ance : ${ssrInterpolate(__props.codir.date)}</p></div></div><div class="flex items-center gap-6">`);
      _push(ssrRenderComponent(_component_UBadge, {
        size: "xs",
        variant: "subtle",
        class: "rounded-full"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.codir.status)}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.codir.status), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        color: "gray",
        variant: "ghost",
        icon: "i-heroicons-ellipsis-vertical"
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/codir/CodirTaskCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
function formatDateFR(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
}
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const currentView = ref("table");
    const store = useCodirsStore();
    const columns = [
      { key: "id", label: "ID", cellClass: "font-mono" },
      { key: "date", label: "Date", align: "right" },
      { key: "time", label: "Heure", cellClass: "text-black" }
    ];
    const currentPage = ref(1);
    const handleCreate = () => {
      store.createNewCodir();
      navigateTo("/codir/create");
    };
    const handleEdit = (item) => {
      store.editCodir(item);
      navigateTo("/codir/edit");
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PageHeader = _sfc_main$3;
      const _component_UButton = __nuxt_component_2;
      const _component_UIcon = __nuxt_component_0;
      const _component_DataTable2 = resolveComponent("DataTable2");
      const _component_CodirTaskGrid = _sfc_main$2;
      const _component_CodirTaskCard = _sfc_main$1;
      const _component_UPagination = __nuxt_component_5;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-6xl mx-auto py-10 px-6" }, _attrs))} data-v-57d08068><div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4" data-v-57d08068>`);
      _push(ssrRenderComponent(_component_PageHeader, {
        title: "Listing des codirs",
        description: "Consultez l'historique des codirs"
      }, null, _parent));
      _push(`<div class="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-xl w-fit" data-v-57d08068>`);
      _push(ssrRenderComponent(_component_UButton, {
        onClick: ($event) => currentView.value = "list",
        variant: unref(currentView) === "list" ? "solid" : "ghost",
        color: "white",
        icon: "i-heroicons-queue-list",
        size: "sm",
        class: "rounded-lg",
        "aria-label": "Vue liste"
      }, null, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        onClick: ($event) => currentView.value = "grid",
        variant: unref(currentView) === "grid" ? "solid" : "ghost",
        color: "white",
        icon: "i-heroicons-squares-2x2",
        size: "sm",
        class: "rounded-lg",
        "aria-label": "Vue grille"
      }, null, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        onClick: ($event) => currentView.value = "table",
        variant: unref(currentView) === "table" ? "solid" : "ghost",
        color: "white",
        icon: "i-heroicons-table-cells",
        size: "sm",
        class: "rounded-lg",
        "aria-label": "Vue tableau"
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UButton, {
        onClick: handleCreate,
        variant: "ghost",
        color: "blue",
        icon: "i-heroicons-plus",
        label: "Nouveau CODIR",
        size: "sm",
        class: "rounded-lg"
      }, null, _parent));
      _push(`</div>`);
      if (unref(store).codirs.length === 0) {
        _push(`<div class="text-center py-20" data-v-57d08068><div class="text-gray-400 dark:text-gray-600 mb-4" data-v-57d08068>`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-folder-open",
          class: "w-16 h-16 mx-auto"
        }, null, _parent));
        _push(`</div><h3 class="text-lg font-semibold mb-2" data-v-57d08068>Aucun CODIR</h3><p class="text-gray-500 mb-6" data-v-57d08068>Commencez par cr\xE9er votre premier CODIR</p>`);
        _push(ssrRenderComponent(_component_UButton, {
          onClick: handleCreate,
          color: "blue",
          icon: "i-heroicons-plus"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Cr\xE9er un CODIR `);
            } else {
              return [
                createTextVNode(" Cr\xE9er un CODIR ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        if (unref(currentView) === "table") {
          _push(`<div class="bg-white text-black dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800" data-v-57d08068>`);
          _push(ssrRenderComponent(_component_DataTable2, {
            "left-aligned-columns": ["id"],
            data: unref(store).codirs,
            columns,
            onEdit: ($event) => handleEdit(_ctx.item)
          }, {
            "cell-date": withCtx(({ item }, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(formatDateFR)(item.date))}`);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(formatDateFR)(item.date)), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else if (unref(currentView) === "grid") {
          _push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-v-57d08068><!--[-->`);
          ssrRenderList(unref(store).codirs, (codir) => {
            _push(ssrRenderComponent(_component_CodirTaskGrid, {
              key: codir.id,
              codir
            }, null, _parent));
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<div class="flex flex-col gap-4" data-v-57d08068><!--[-->`);
          ssrRenderList(unref(store).codirs, (codir) => {
            _push(ssrRenderComponent(_component_CodirTaskCard, {
              key: codir.id,
              codir
            }, null, _parent));
          });
          _push(`<!--]--></div>`);
        }
      }
      if (unref(store).codirs.length > 0 && unref(currentView) !== "table") {
        _push(ssrRenderComponent(_component_UPagination, {
          class: "mt-6",
          modelValue: unref(currentPage),
          "onUpdate:modelValue": ($event) => isRef(currentPage) ? currentPage.value = $event : null,
          color: "blue",
          "page-count": 10,
          total: unref(store).codirs.length
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/codir/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-57d08068"]]);

export { index as default };
//# sourceMappingURL=index-CIRFfLcc.mjs.map
