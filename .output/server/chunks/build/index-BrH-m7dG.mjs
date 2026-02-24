import { _ as _sfc_main$3 } from './PageHeader-NxcDUFJW.mjs';
import { _ as _export_sfc, q as useRouter, d as __nuxt_component_1, g as __nuxt_component_2$1, n as navigateTo } from './server.mjs';
import __nuxt_component_5 from './Alert-BJqo0-kE.mjs';
import { _ as _sfc_main$4 } from './DataTable-Cb4WL8Ep.mjs';
import __nuxt_component_2 from './Card-DtmGMnBU.mjs';
import { ref, computed, mergeProps, unref, withCtx, createTextVNode, createVNode, toDisplayString, defineComponent, isRef, withModifiers, createBlock, openBlock, Fragment, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { u as useCodirsStore, b as extractTime, f as formatDateFR, g as getStatutConfig } from './codirs-D_To-40U.mjs';
import __nuxt_component_7 from './Pagination-C5DfUq0A.mjs';
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
import './Badge-DIEXPf_r.mjs';
import './Select-C_BWMUVV.mjs';
import './Checkbox-DFEpnQRu.mjs';

const _sfc_main$2 = {
  __name: "CodirGrid",
  __ssrInlineRender: true,
  props: {
    codir: { type: Object, required: true }
  },
  emits: ["edit", "view"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const GRADIENT = {
      nouveau: "from-blue-700 to-indigo-700",
      "termin\xE9": "from-green-700 to-emerald-700",
      clos: "from-slate-600 to-gray-700",
      en_cours: "from-amber-600 to-orange-600",
      "annul\xE9": "from-red-700 to-rose-700"
    };
    const gradient = (s) => {
      var _a;
      return (_a = GRADIENT[s]) != null ? _a : "from-slate-600 to-gray-700";
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = __nuxt_component_2;
      const _component_UButton = __nuxt_component_1;
      const _component_UIcon = __nuxt_component_2$1;
      _push(ssrRenderComponent(_component_UCard, mergeProps({
        class: `relative rounded-2xl border-none shadow-sm hover:shadow-inner transition-all duration-300 group overflow-hidden bg-gradient-to-br ${gradient(__props.codir.statut)} hover:scale-[0.97] cursor-pointer`,
        onClick: ($event) => emit("view")
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
          if (_push2) {
            _push2(`<div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"${_scopeId}></div><div class="relative z-10"${_scopeId}><div class="flex justify-between items-start mb-5"${_scopeId}><span class="text-white/90 text-[10px] font-semibold px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm capitalize"${_scopeId}>${ssrInterpolate(unref(getStatutConfig)(__props.codir.statut).label)}</span>`);
            _push2(ssrRenderComponent(_component_UButton, {
              color: "white",
              variant: "ghost",
              icon: "i-heroicons-pencil",
              size: "xs",
              class: "opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white/20",
              onClick: ($event) => emit("edit")
            }, null, _parent2, _scopeId));
            _push2(`</div><h4 class="font-bold text-xl text-white mb-1 leading-tight"${_scopeId}>${ssrInterpolate(unref(formatDateFR)(__props.codir.date))}</h4><p class="text-xs text-white/65 flex items-center gap-1.5 mb-6"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-clock",
              class: "w-3.5 h-3.5"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(extractTime)(__props.codir.heure_debut))} \u2013 ${ssrInterpolate(unref(extractTime)(__props.codir.heure_fin))}</p><div class="flex items-center justify-between pt-4 border-t border-white/15"${_scopeId}><div class="flex items-center gap-4 text-white/60 text-xs"${_scopeId}><span class="flex items-center gap-1.5"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-clipboard-document-list",
              class: "w-3.5 h-3.5"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate((_b = (_a = __props.codir.ordres_du_jour) == null ? void 0 : _a.length) != null ? _b : 0)} ODJ </span><span class="flex items-center gap-1.5"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-check-circle",
              class: "w-3.5 h-3.5"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate((_d = (_c = __props.codir.taches) == null ? void 0 : _c.length) != null ? _d : 0)} t\xE2ches </span></div><div class="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full"${_scopeId}><div class="${ssrRenderClass(`w-1.5 h-1.5 rounded-full animate-pulse ${unref(getStatutConfig)(__props.codir.statut).dotClass}`)}"${_scopeId}></div><span class="text-[10px] text-white/70"${_scopeId}>`);
            if ((_e = __props.codir.taches) == null ? void 0 : _e.length) {
              _push2(`<!--[-->${ssrInterpolate(Math.round(__props.codir.taches.reduce((a, t) => {
                var _a2, _b2;
                return a + ((_b2 = (_a2 = t.pivot) == null ? void 0 : _a2.progression) != null ? _b2 : 0);
              }, 0) / __props.codir.taches.length))}% <!--]-->`);
            } else {
              _push2(`<!--[-->\u2014<!--]-->`);
            }
            _push2(`</span></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" }),
              createVNode("div", { class: "relative z-10" }, [
                createVNode("div", { class: "flex justify-between items-start mb-5" }, [
                  createVNode("span", { class: "text-white/90 text-[10px] font-semibold px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm capitalize" }, toDisplayString(unref(getStatutConfig)(__props.codir.statut).label), 1),
                  createVNode(_component_UButton, {
                    color: "white",
                    variant: "ghost",
                    icon: "i-heroicons-pencil",
                    size: "xs",
                    class: "opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white/20",
                    onClick: withModifiers(($event) => emit("edit"), ["stop"])
                  }, null, 8, ["onClick"])
                ]),
                createVNode("h4", { class: "font-bold text-xl text-white mb-1 leading-tight" }, toDisplayString(unref(formatDateFR)(__props.codir.date)), 1),
                createVNode("p", { class: "text-xs text-white/65 flex items-center gap-1.5 mb-6" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-clock",
                    class: "w-3.5 h-3.5"
                  }),
                  createTextVNode(" " + toDisplayString(unref(extractTime)(__props.codir.heure_debut)) + " \u2013 " + toDisplayString(unref(extractTime)(__props.codir.heure_fin)), 1)
                ]),
                createVNode("div", { class: "flex items-center justify-between pt-4 border-t border-white/15" }, [
                  createVNode("div", { class: "flex items-center gap-4 text-white/60 text-xs" }, [
                    createVNode("span", { class: "flex items-center gap-1.5" }, [
                      createVNode(_component_UIcon, {
                        name: "i-heroicons-clipboard-document-list",
                        class: "w-3.5 h-3.5"
                      }),
                      createTextVNode(" " + toDisplayString((_g = (_f = __props.codir.ordres_du_jour) == null ? void 0 : _f.length) != null ? _g : 0) + " ODJ ", 1)
                    ]),
                    createVNode("span", { class: "flex items-center gap-1.5" }, [
                      createVNode(_component_UIcon, {
                        name: "i-heroicons-check-circle",
                        class: "w-3.5 h-3.5"
                      }),
                      createTextVNode(" " + toDisplayString((_i = (_h = __props.codir.taches) == null ? void 0 : _h.length) != null ? _i : 0) + " t\xE2ches ", 1)
                    ])
                  ]),
                  createVNode("div", { class: "flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full" }, [
                    createVNode("div", {
                      class: `w-1.5 h-1.5 rounded-full animate-pulse ${unref(getStatutConfig)(__props.codir.statut).dotClass}`
                    }, null, 2),
                    createVNode("span", { class: "text-[10px] text-white/70" }, [
                      ((_j = __props.codir.taches) == null ? void 0 : _j.length) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                        createTextVNode(toDisplayString(Math.round(__props.codir.taches.reduce((a, t) => {
                          var _a2, _b2;
                          return a + ((_b2 = (_a2 = t.pivot) == null ? void 0 : _a2.progression) != null ? _b2 : 0);
                        }, 0) / __props.codir.taches.length)) + "% ", 1)
                      ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                        createTextVNode("\u2014")
                      ], 64))
                    ])
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
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/codir/CodirGrid.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "CodirCard",
  __ssrInlineRender: true,
  props: {
    codir: {}
  },
  emits: ["edit", "view"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const progression = (codir) => {
      var _a;
      const taches = (_a = codir.taches) != null ? _a : [];
      if (!taches.length) return null;
      return Math.round(taches.reduce((a, t) => {
        var _a2, _b;
        return a + ((_b = (_a2 = t.pivot) == null ? void 0 : _a2.progression) != null ? _b : 0);
      }, 0) / taches.length);
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      const _component_UIcon = __nuxt_component_2$1;
      const _component_UButton = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "group flex items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-200 cursor-pointer" }, _attrs))}><div class="flex items-center gap-4 min-w-0"><div class="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-inner shrink-0">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-heroicons-calendar-days",
        class: "w-5 h-5 text-white"
      }, null, _parent));
      _push(`</div><div class="min-w-0"><p class="font-semibold text-gray-900 dark:text-white text-sm truncate">${ssrInterpolate(unref(formatDateFR)(__props.codir.date))}</p><p class="text-xs text-gray-400 flex items-center gap-1 mt-0.5">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-heroicons-clock",
        class: "w-3 h-3"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(extractTime)(__props.codir.heure_debut))} \u2013 ${ssrInterpolate(unref(extractTime)(__props.codir.heure_fin))}</p></div></div><div class="hidden sm:flex items-center gap-5 text-xs text-gray-400 shrink-0"><span class="flex items-center gap-1.5">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-heroicons-clipboard-document-list",
        class: "w-3.5 h-3.5 text-blue-400"
      }, null, _parent));
      _push(` ${ssrInterpolate((_b = (_a = __props.codir.ordres_du_jour) == null ? void 0 : _a.length) != null ? _b : 0)} ODJ </span><span class="flex items-center gap-1.5">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-heroicons-check-circle",
        class: "w-3.5 h-3.5 text-green-400"
      }, null, _parent));
      _push(` ${ssrInterpolate((_d = (_c = __props.codir.taches) == null ? void 0 : _c.length) != null ? _d : 0)} t\xE2ches </span>`);
      if (progression(__props.codir) !== null) {
        _push(`<span class="flex items-center gap-1.5">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-chart-bar",
          class: "w-3.5 h-3.5 text-indigo-400"
        }, null, _parent));
        _push(` ${ssrInterpolate(progression(__props.codir))}% moy. </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex items-center gap-3 shrink-0"><span class="${ssrRenderClass(`text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${unref(getStatutConfig)(__props.codir.statut).badgeClass}`)}"><span class="${ssrRenderClass(`w-1.5 h-1.5 rounded-full ${unref(getStatutConfig)(__props.codir.statut).dotClass}`)}"></span> ${ssrInterpolate(unref(getStatutConfig)(__props.codir.statut).label)}</span><div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">`);
      _push(ssrRenderComponent(_component_UButton, {
        icon: "i-heroicons-pencil-square",
        color: "blue",
        variant: "ghost",
        size: "xs",
        onClick: ($event) => emit("edit")
      }, null, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/codir/CodirCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const PAGE_SIZE = 9;
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const store = useCodirsStore();
    const router = useRouter();
    const currentView = ref("table");
    const currentPage = ref(1);
    const columns = [
      { key: "date", label: "Date", sortable: true, filterable: true, showLabel: false, inputHidden: false },
      { key: "horaire", label: "Horaires", sortable: true, filterable: true, showLabel: false, inputHidden: false },
      { key: "statut", label: "Statut", sortable: true, filterable: true, showLabel: false, inputHidden: false }
    ];
    const sortedCodirs = computed(
      () => [...store.codirs].sort((a, b) => new Date(b.date) - new Date(a.date))
    );
    const tableData = computed(
      () => sortedCodirs.value.map((codir) => {
        var _a, _b, _c, _d;
        return {
          id: codir.id,
          date: formatDateFR(codir.date),
          _dateRaw: codir.date,
          horaire: `${extractTime(codir.heure_debut)} \u2013 ${extractTime(codir.heure_fin)}`,
          statut: codir.statut,
          odj: (_b = (_a = codir.ordres_du_jour) == null ? void 0 : _a.length) != null ? _b : 0,
          taches: (_d = (_c = codir.taches) == null ? void 0 : _c.length) != null ? _d : 0,
          _raw: codir
        };
      })
    );
    const paginatedCodirs = computed(() => {
      const start = (currentPage.value - 1) * PAGE_SIZE;
      return sortedCodirs.value.slice(start, start + PAGE_SIZE);
    });
    const handleView = (item) => {
      store.setCurrentCodir(item._raw);
      navigateTo(`/codir/${item.id}`);
    };
    const handleCreate = () => router.push("/codir/create");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PageHeader = _sfc_main$3;
      const _component_UButton = __nuxt_component_1;
      const _component_UIcon = __nuxt_component_2$1;
      const _component_UAlert = __nuxt_component_5;
      const _component_DataTable = _sfc_main$4;
      const _component_CodirGrid = _sfc_main$2;
      const _component_CodirCard = _sfc_main$1;
      const _component_UPagination = __nuxt_component_7;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-6xl mx-auto py-10 px-6" }, _attrs))} data-v-edb150a2><div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4" data-v-edb150a2>`);
      _push(ssrRenderComponent(_component_PageHeader, {
        title: "CODIR",
        description: "Consultez et g\xE9rez l'historique des r\xE9unions de direction"
      }, null, _parent));
      _push(`<div class="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-xl w-fit" data-v-edb150a2>`);
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
      if (unref(store).loading) {
        _push(`<div class="flex justify-center py-20" data-v-edb150a2>`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-arrow-path",
          class: "w-8 h-8 animate-spin text-blue-500"
        }, null, _parent));
        _push(`</div>`);
      } else if (unref(store).error) {
        _push(ssrRenderComponent(_component_UAlert, {
          color: "red",
          icon: "i-heroicons-exclamation-circle",
          title: unref(store).error,
          class: "mb-6"
        }, null, _parent));
      } else if (unref(store).codirs.length === 0) {
        _push(`<div class="text-center py-20" data-v-edb150a2>`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-folder-open",
          class: "w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4"
        }, null, _parent));
        _push(`<h3 class="text-lg font-semibold mb-2" data-v-edb150a2>Aucun CODIR</h3><p class="text-gray-500 mb-6" data-v-edb150a2>Commencez par cr\xE9er votre premier CODIR</p>`);
        _push(ssrRenderComponent(_component_UButton, {
          onClick: handleCreate,
          color: "blue",
          icon: "i-heroicons-plus"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Cr\xE9er un CODIR`);
            } else {
              return [
                createTextVNode("Cr\xE9er un CODIR")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        if (unref(currentView) === "table") {
          _push(`<div data-v-edb150a2>`);
          _push(ssrRenderComponent(_component_DataTable, {
            data: unref(tableData),
            columns,
            "default-actions": ["view"],
            "show-row-numbers": true,
            "default-items-per-page": 10,
            "left-aligned-columns": ["date", "horaire", "statut"],
            "empty-state-title": "Aucun CODIR",
            "empty-state-text": "Cr\xE9ez votre premier CODIR pour commencer.",
            onView: handleView
          }, {
            "cell-date": withCtx(({ value }, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<span class="font-medium text-sm text-gray-800" data-v-edb150a2${_scopeId}>${ssrInterpolate(value)}</span>`);
              } else {
                return [
                  createVNode("span", { class: "font-medium text-sm text-gray-800" }, toDisplayString(value), 1)
                ];
              }
            }),
            "cell-horaire": withCtx(({ value }, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<span class="font-mono text-xs text-gray-500" data-v-edb150a2${_scopeId}>${ssrInterpolate(value)}</span>`);
              } else {
                return [
                  createVNode("span", { class: "font-mono text-xs text-gray-500" }, toDisplayString(value), 1)
                ];
              }
            }),
            "cell-statut": withCtx(({ value }, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<span class="${ssrRenderClass(`text-[11px] font-semibold px-2.5 py-1 rounded-full ${unref(getStatutConfig)(value).badgeClass}`)}" data-v-edb150a2${_scopeId}>${ssrInterpolate(unref(getStatutConfig)(value).label)}</span>`);
              } else {
                return [
                  createVNode("span", {
                    class: `text-[11px] font-semibold px-2.5 py-1 rounded-full ${unref(getStatutConfig)(value).badgeClass}`
                  }, toDisplayString(unref(getStatutConfig)(value).label), 3)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else if (unref(currentView) === "grid") {
          _push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-v-edb150a2><!--[-->`);
          ssrRenderList(unref(paginatedCodirs), (codir) => {
            _push(ssrRenderComponent(_component_CodirGrid, {
              key: codir.id,
              codir,
              onEdit: ($event) => {
                unref(store).setCurrentCodir(codir);
                unref(router).push(`/codir/${codir.id}/edit`);
              },
              onView: ($event) => {
                unref(store).setCurrentCodir(codir);
                unref(router).push(`/codir/${codir.id}`);
              }
            }, null, _parent));
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<div class="flex flex-col gap-4" data-v-edb150a2><!--[-->`);
          ssrRenderList(unref(paginatedCodirs), (codir) => {
            _push(ssrRenderComponent(_component_CodirCard, {
              key: codir.id,
              codir,
              onEdit: ($event) => {
                unref(store).setCurrentCodir(codir);
                unref(router).push(`/codir/${codir.id}/edit`);
              },
              onView: ($event) => {
                unref(store).setCurrentCodir(codir);
                unref(router).push(`/codir/${codir.id}`);
              }
            }, null, _parent));
          });
          _push(`<!--]--></div>`);
        }
      }
      if (unref(store).codirs.length > PAGE_SIZE && unref(currentView) !== "table") {
        _push(ssrRenderComponent(_component_UPagination, {
          class: "mt-6",
          modelValue: unref(currentPage),
          "onUpdate:modelValue": ($event) => isRef(currentPage) ? currentPage.value = $event : null,
          color: "blue",
          "page-count": PAGE_SIZE,
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
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-edb150a2"]]);

export { index as default };
//# sourceMappingURL=index-BrH-m7dG.mjs.map
