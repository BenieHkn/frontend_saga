import __nuxt_component_2 from './Input-50cchghJ.mjs';
import { d as __nuxt_component_1, g as __nuxt_component_2$1 } from './server.mjs';
import __nuxt_component_1$1 from './Badge-DIEXPf_r.mjs';
import __nuxt_component_4 from './Select-C_BWMUVV.mjs';
import __nuxt_component_0 from './Checkbox-DFEpnQRu.mjs';
import __nuxt_component_2$2 from './Card-DtmGMnBU.mjs';
import { computed, ref, watch, withCtx, createTextVNode, createBlock, createCommentVNode, openBlock, createVNode, Fragment, renderList, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderSlot, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderStyle, ssrRenderDynamicModel, ssrRenderAttr, ssrRenderTeleport } from 'vue/server-renderer';

const _sfc_main = {
  __name: "DataTable",
  __ssrInlineRender: true,
  props: {
    data: { type: Array, default: () => [] },
    columns: { type: Array, required: true },
    selectable: { type: Boolean, default: true },
    itemsPerPageOptions: { type: Array, default: () => [10, 25, 50, 100] },
    defaultItemsPerPage: { type: Number, default: 10 },
    showToolbar: { type: Boolean, default: true },
    showGlobalSearch: { type: Boolean, default: true },
    showAdvancedFiltersToggle: { type: Boolean, default: true },
    showColumnFilters: { type: Boolean, default: true },
    showSorting: { type: Boolean, default: true },
    showMultiSelectFilters: { type: Boolean, default: true },
    showPaginationOptions: { type: Boolean, default: true },
    showPagination: { type: Boolean, default: true },
    showHeader: { type: Boolean, default: true },
    showActions: { type: Boolean, default: true },
    showRowNumbers: { type: Boolean, default: false },
    showColumnInputs: { type: Boolean, default: true },
    showColumnLabels: { type: Boolean, default: true },
    columnInputSize: { type: String, default: null },
    leftAlignedColumns: { type: Array, default: () => [] },
    // Ajouter dans les props
    hideLabelsWhenInput: { type: Boolean, default: false },
    defaultActions: {
      type: Array,
      default: () => ["edit", "delete"],
      validator: (v) => v.every((a) => ["edit", "delete", "view", "download", "archive", "assign"].includes(a))
    },
    actionsLabel: { type: String, default: "Actions" },
    emptyStateTitle: { type: String, default: "Aucun r\xE9sultat" },
    emptyStateText: { type: String, default: "Essayez d'ajuster vos filtres ou votre recherche." },
    defaultSortColumn: { type: String, default: null },
    defaultSortDirection: { type: String, default: "asc", validator: (v) => ["asc", "desc"].includes(v) }
  },
  emits: [
    "edit",
    "delete",
    "view",
    "download",
    "archive",
    "assign",
    "open-document",
    "selection-change"
  ],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const visibleColumns = computed(() => props.columns.filter((c) => c.visible !== false));
    const sourceData = computed(() => props.data);
    const globalSearch = ref("");
    const showAdvancedFilters = ref(false);
    const filters = ref(
      props.columns.reduce((acc, col) => ({ ...acc, [col.key]: "" }), {})
    );
    const multiSelectFilters = ref(
      props.columns.reduce((acc, col) => ({ ...acc, [col.key]: [] }), {})
    );
    const activeFiltersCount = computed(
      () => Object.values(filters.value).filter((v) => v !== "").length + Object.values(multiSelectFilters.value).filter((v) => v.length > 0).length
    );
    const sortColumn = ref(props.defaultSortColumn);
    const sortDirection = ref(props.defaultSortDirection);
    const selectedRows = ref([]);
    const isAllSelected = computed(() => paginatedData.value.length > 0 && selectedRows.value.length === paginatedData.value.length);
    const isIndeterminate = computed(() => selectedRows.value.length > 0 && selectedRows.value.length < paginatedData.value.length);
    const toggleSelectAll = () => {
      isAllSelected.value ? selectedRows.value = [] : selectedRows.value = paginatedData.value.map((i) => i.id);
    };
    const toggleRowSelect = (id) => {
      const i = selectedRows.value.indexOf(id);
      i > -1 ? selectedRows.value.splice(i, 1) : selectedRows.value.push(id);
    };
    watch(selectedRows, (val) => emit("selection-change", [...val]), { deep: true });
    const currentPage = ref(1);
    const localItemsPerPage = ref(props.defaultItemsPerPage);
    const totalPages = computed(() => Math.max(1, Math.ceil(filteredData.value.length / localItemsPerPage.value)));
    const startIndex = computed(() => (currentPage.value - 1) * localItemsPerPage.value);
    const endIndex = computed(() => Math.min(startIndex.value + localItemsPerPage.value, sortedData.value.length));
    const paginatedData = computed(() => sortedData.value.slice(startIndex.value, endIndex.value));
    const visiblePages = computed(() => {
      const total = totalPages.value, cur = currentPage.value;
      if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
      return [.../* @__PURE__ */ new Set([1, cur - 1, cur, cur + 1, total])].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
    });
    const filteredData = computed(() => {
      let data = sourceData.value;
      if (globalSearch.value) {
        const q = globalSearch.value.toLowerCase();
        data = data.filter((item) => Object.values(item).some((v) => String(v).toLowerCase().includes(q)));
      }
      Object.entries(multiSelectFilters.value).forEach(([col, vals]) => {
        if (vals.length > 0) data = data.filter((item) => vals.includes(item[col]));
      });
      Object.entries(filters.value).forEach(([key, val]) => {
        if (val) data = data.filter((item) => String(item[key]).toLowerCase().includes(val.toLowerCase()));
      });
      return data;
    });
    const sortedData = computed(() => {
      const data = [...filteredData.value];
      if (!sortColumn.value) return data;
      return data.sort((a, b) => {
        let aV = a[sortColumn.value], bV = b[sortColumn.value];
        if (typeof aV === "string") {
          aV = aV.toLowerCase();
          bV = bV.toLowerCase();
        }
        const cmp = aV > bV ? 1 : aV < bV ? -1 : 0;
        return sortDirection.value === "asc" ? cmp : -cmp;
      });
    });
    watch(filteredData, () => {
      if (currentPage.value > totalPages.value) currentPage.value = 1;
    });
    const filterMenu = ref({ show: false, column: null, x: 0, y: 0 });
    const filterMenuSearch = ref("");
    const closeFilterMenu = () => {
      filterMenu.value = { show: false, column: null, x: 0, y: 0 };
    };
    const getColumnLabel = (key) => {
      var _a, _b;
      return (_b = (_a = props.columns.find((c) => c.key === key)) == null ? void 0 : _a.label) != null ? _b : key;
    };
    const getOptions = (col) => [...new Set(sourceData.value.map((i) => i[col]))].map((v) => ({ value: v, label: String(v) })).sort((a, b) => a.label.localeCompare(b.label));
    const filteredOptions = computed(() => {
      if (!filterMenu.value.column) return [];
      const opts = getOptions(filterMenu.value.column);
      return filterMenuSearch.value ? opts.filter((o) => o.label.toLowerCase().includes(filterMenuSearch.value.toLowerCase())) : opts;
    });
    const isAllOptionsSelected = (col) => {
      var _a, _b;
      const all = getOptions(col);
      return all.length > 0 && ((_b = (_a = multiSelectFilters.value[col]) == null ? void 0 : _a.length) != null ? _b : 0) === all.length;
    };
    const isOptionsIndeterminate = (col) => {
      var _a, _b;
      const all = getOptions(col);
      const sel = (_b = (_a = multiSelectFilters.value[col]) == null ? void 0 : _a.length) != null ? _b : 0;
      return sel > 0 && sel < all.length;
    };
    const toggleAllOptions = (col) => {
      isAllOptionsSelected(col) ? multiSelectFilters.value[col] = [] : multiSelectFilters.value[col] = getOptions(col).map((o) => o.value);
    };
    const toggleOption = (col, val) => {
      if (!multiSelectFilters.value[col]) multiSelectFilters.value[col] = [];
      const i = multiSelectFilters.value[col].indexOf(val);
      i > -1 ? multiSelectFilters.value[col].splice(i, 1) : multiSelectFilters.value[col].push(val);
    };
    const resetFilter = (col) => {
      multiSelectFilters.value[col] = [];
    };
    const rowBg = (id, index) => {
      if (selectedRows.value.includes(id)) return "bg-indigo-50 hover:bg-indigo-100";
      return index % 2 === 0 ? "bg-white hover:bg-indigo-50" : "bg-slate-50 hover:bg-indigo-50";
    };
    const stickyBg = (id, index) => {
      if (selectedRows.value.includes(id)) return "bg-indigo-50 group-hover:bg-indigo-100";
      return index % 2 === 0 ? "bg-white group-hover:bg-indigo-50" : "bg-slate-50 group-hover:bg-indigo-50";
    };
    const getInputContainerWidth = (col) => {
      if (col.inputWidth) return `width: ${col.inputWidth}`;
      if (props.columnInputSize) return `width: ${props.columnInputSize}`;
      return "width: 100%";
    };
    const getInputStyle = (col) => {
      var _a, _b;
      if (col.inputWidth) return `width: ${col.inputWidth}`;
      if (props.columnInputSize) return `width: 100%`;
      const text = (_b = (_a = col.inputPlaceholder) != null ? _a : col.label) != null ? _b : "";
      const width = Math.max(60, text.length * 7 + 24);
      return `width: ${width}px`;
    };
    const shouldShowLabel = (col) => {
      if (props.hideLabelsWhenInput) {
        return col.inputHidden === true || col.filterable === false;
      }
      return props.showColumnLabels && col.showLabel !== false;
    };
    const getCellAlignment = (columnKey) => {
      if (props.leftAlignedColumns.includes(columnKey)) {
        return "text-left";
      }
      return "text-center";
    };
    __expose({ selectedRows, filters, multiSelectFilters, currentPage });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UInput = __nuxt_component_2;
      const _component_UButton = __nuxt_component_1;
      const _component_UBadge = __nuxt_component_1$1;
      const _component_USelect = __nuxt_component_4;
      const _component_UIcon = __nuxt_component_2$1;
      const _component_UCheckbox = __nuxt_component_0;
      const _component_UCard = __nuxt_component_2$2;
      _push(`<!--[--><div class="flex flex-col gap-0 rounded-xl border border-slate-200 overflow-hidden bg-white">`);
      if (__props.showToolbar) {
        _push(`<div class="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-white border-b border-slate-200"><div class="flex items-center gap-2">`);
        if (__props.showGlobalSearch) {
          _push(ssrRenderComponent(_component_UInput, {
            modelValue: globalSearch.value,
            "onUpdate:modelValue": ($event) => globalSearch.value = $event,
            icon: "i-heroicons-magnifying-glass",
            placeholder: "Recherche globale...",
            size: "sm",
            class: "w-56",
            onInput: ($event) => currentPage.value = 1
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (__props.showAdvancedFiltersToggle) {
          _push(ssrRenderComponent(_component_UButton, {
            size: "sm",
            color: "gray",
            variant: "soft",
            icon: "i-heroicons-funnel",
            onClick: ($event) => showAdvancedFilters.value = !showAdvancedFilters.value
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Filtres `);
                if (activeFiltersCount.value > 0) {
                  _push2(ssrRenderComponent(_component_UBadge, {
                    label: String(activeFiltersCount.value),
                    color: "red",
                    size: "xs",
                    class: "ml-1"
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
              } else {
                return [
                  createTextVNode(" Filtres "),
                  activeFiltersCount.value > 0 ? (openBlock(), createBlock(_component_UBadge, {
                    key: 0,
                    label: String(activeFiltersCount.value),
                    color: "red",
                    size: "xs",
                    class: "ml-1"
                  }, null, 8, ["label"])) : createCommentVNode("", true)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (__props.showPaginationOptions) {
          _push(`<div class="flex items-center gap-2"><span class="text-xs text-slate-500">Lignes par page :</span>`);
          _push(ssrRenderComponent(_component_USelect, {
            modelValue: localItemsPerPage.value,
            "onUpdate:modelValue": ($event) => localItemsPerPage.value = $event,
            options: __props.itemsPerPageOptions.map((n) => ({ label: String(n), value: n })),
            size: "sm",
            class: "w-20",
            onChange: ($event) => currentPage.value = 1
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (showAdvancedFilters.value) {
        _push(`<div class="px-4 py-3 bg-slate-50 border-b border-slate-200">`);
        ssrRenderSlot(_ctx.$slots, "advanced-filters", {
          filters: filters.value,
          onFilter: () => currentPage.value = 1
        }, null, _push, _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.selectable && selectedRows.value.length > 0) {
        _push(`<div class="flex items-center gap-3 px-4 py-2 bg-indigo-50 border-b border-indigo-100">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-check-circle",
          class: "text-indigo-500 w-4 h-4"
        }, null, _parent));
        _push(`<span class="text-sm font-semibold text-indigo-600">${ssrInterpolate(selectedRows.value.length)} s\xE9lectionn\xE9(s)</span>`);
        ssrRenderSlot(_ctx.$slots, "selection-actions", { selected: selectedRows.value }, null, _push, _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="overflow-x-auto"><table class="w-full border-collapse text-sm">`);
      if (__props.showHeader) {
        _push(`<thead><tr class="bg-indigo-50 text-indigo-600">`);
        if (__props.showRowNumbers) {
          _push(`<th class="sticky top-0 z-10 w-12 px-3 py-2 text-center text-xs font-bold uppercase tracking-wider border border-slate-200 bg-indigo-50"> N\xB0 </th>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--[-->`);
        ssrRenderList(visibleColumns.value, (col) => {
          var _a, _b, _c;
          _push(`<th class="${ssrRenderClass([col.headerClass, "sticky top-0 z-10 px-3 py-2 text-xs font-bold uppercase tracking-wider border border-slate-200 bg-indigo-50"])}">`);
          if (col.type === "document" || col.filterable === false) {
            _push(`<!--[-->`);
            if (shouldShowLabel(col)) {
              _push(`<span class="block text-center whitespace-nowrap">${ssrInterpolate(col.label)}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<!--]-->`);
          } else {
            _push(`<div class="flex gap-1">`);
            if (__props.showColumnFilters && __props.showColumnInputs && !col.inputHidden) {
              _push(`<div class="overflow-x-auto scrollbar-thin" style="${ssrRenderStyle(getInputContainerWidth(col))}"><input${ssrRenderDynamicModel((_a = col.inputType) != null ? _a : "text", filters.value[col.key], null)}${ssrRenderAttr("type", (_b = col.inputType) != null ? _b : "text")}${ssrRenderAttr("placeholder", (_c = col.inputPlaceholder) != null ? _c : col.label)} class="px-2 py-1 text-xs font-normal normal-case tracking-normal text-slate-700 bg-white border border-slate-300 rounded focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 placeholder:text-slate-400" style="${ssrRenderStyle(getInputStyle(col))}"></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          }
          _push(`</th>`);
        });
        _push(`<!--]-->`);
        if (__props.selectable) {
          _push(`<th class="sticky top-0 z-10 w-10 px-3 py-2 text-center border border-slate-200 bg-indigo-50">`);
          _push(ssrRenderComponent(_component_UCheckbox, {
            "model-value": isAllSelected.value,
            indeterminate: isIndeterminate.value,
            onChange: toggleSelectAll
          }, null, _parent));
          _push(`</th>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.showActions) {
          _push(`<th class="sticky top-0 right-0 z-20 px-3 py-2 text-right text-xs font-bold uppercase tracking-wider border border-slate-200 bg-indigo-50 min-w-24" style="${ssrRenderStyle({ "box-shadow": "-3px 0 8px rgba(0,0,0,0.06)" })}">${ssrInterpolate(__props.actionsLabel)}</th>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tr></thead>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<tbody><!--[-->`);
      ssrRenderList(paginatedData.value, (item, index) => {
        _push(`<tr class="${ssrRenderClass([rowBg(item.id, index), "group transition-colors duration-100"])}">`);
        if (__props.showRowNumbers) {
          _push(`<td class="px-3 py-2 text-center text-xs font-semibold text-indigo-500 border border-slate-100">${ssrInterpolate(startIndex.value + index + 1)}</td>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--[-->`);
        ssrRenderList(visibleColumns.value, (col) => {
          _push(`<td class="${ssrRenderClass([[col.cellClass, getCellAlignment(col.key)], "px-3 py-2 border border-slate-100 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]"])}">`);
          ssrRenderSlot(_ctx.$slots, `cell-${col.key}`, {
            item,
            value: item[col.key],
            column: col
          }, () => {
            var _a;
            if (col.type === "document") {
              _push(`<!--[-->`);
              if (item[col.key]) {
                _push(ssrRenderComponent(_component_UButton, {
                  size: "xs",
                  color: "blue",
                  variant: "ghost",
                  icon: "i-heroicons-document-text",
                  onClick: ($event) => _ctx.$emit("open-document", item[col.key])
                }, null, _parent));
              } else {
                _push(ssrRenderComponent(_component_UIcon, {
                  name: "i-heroicons-document-text",
                  class: "w-5 h-5 text-slate-300 mx-auto"
                }, null, _parent));
              }
              _push(`<!--]-->`);
            } else if (col.type === "badge") {
              _push(ssrRenderComponent(_component_UBadge, {
                label: String(item[col.key]),
                color: "indigo",
                variant: "subtle",
                size: "xs"
              }, null, _parent));
            } else if (col.type === "boolean") {
              _push(ssrRenderComponent(_component_UBadge, {
                label: item[col.key] ? "Oui" : "Non",
                color: item[col.key] ? "green" : "red",
                variant: "subtle",
                size: "xs"
              }, null, _parent));
            } else {
              _push(`<span class="text-slate-700 text-xs">${ssrInterpolate((_a = item[col.key]) != null ? _a : "\u2014")}</span>`);
            }
          }, _push, _parent);
          _push(`</td>`);
        });
        _push(`<!--]-->`);
        if (__props.selectable) {
          _push(`<td class="px-3 py-2 text-center border border-slate-100">`);
          _push(ssrRenderComponent(_component_UCheckbox, {
            "model-value": selectedRows.value.includes(item.id),
            onChange: ($event) => toggleRowSelect(item.id)
          }, null, _parent));
          _push(`</td>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.showActions) {
          _push(`<td class="${ssrRenderClass([stickyBg(item.id, index), "sticky right-0 px-3 py-2 text-right border border-slate-100"])}" style="${ssrRenderStyle({ "box-shadow": "-3px 0 8px rgba(0,0,0,0.05)" })}">`);
          ssrRenderSlot(_ctx.$slots, "actions", { item }, () => {
            _push(`<div class="flex items-center justify-end gap-1">`);
            if (__props.defaultActions.includes("view")) {
              _push(ssrRenderComponent(_component_UButton, {
                size: "xs",
                color: "blue",
                variant: "ghost",
                icon: "i-heroicons-eye",
                title: "Voir",
                onClick: ($event) => _ctx.$emit("view", item)
              }, null, _parent));
            } else {
              _push(`<!---->`);
            }
            if (__props.defaultActions.includes("edit")) {
              _push(ssrRenderComponent(_component_UButton, {
                size: "xs",
                color: "indigo",
                variant: "ghost",
                icon: "i-heroicons-pencil",
                title: "\xC9diter",
                onClick: ($event) => _ctx.$emit("edit", item)
              }, null, _parent));
            } else {
              _push(`<!---->`);
            }
            if (__props.defaultActions.includes("download")) {
              _push(ssrRenderComponent(_component_UButton, {
                size: "xs",
                color: "green",
                variant: "ghost",
                icon: "i-heroicons-arrow-down-tray",
                title: "T\xE9l\xE9charger",
                onClick: ($event) => _ctx.$emit("download", item)
              }, null, _parent));
            } else {
              _push(`<!---->`);
            }
            if (__props.defaultActions.includes("archive")) {
              _push(ssrRenderComponent(_component_UButton, {
                size: "xs",
                color: "yellow",
                variant: "ghost",
                icon: "i-heroicons-archive-box",
                title: "Archiver",
                onClick: ($event) => _ctx.$emit("archive", item)
              }, null, _parent));
            } else {
              _push(`<!---->`);
            }
            if (__props.defaultActions.includes("delete")) {
              _push(ssrRenderComponent(_component_UButton, {
                size: "xs",
                color: "red",
                variant: "ghost",
                icon: "i-heroicons-trash",
                title: "Supprimer",
                onClick: ($event) => _ctx.$emit("delete", item)
              }, null, _parent));
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          }, _push, _parent);
          _push(`</td>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tr>`);
      });
      _push(`<!--]--></tbody></table></div>`);
      if (paginatedData.value.length === 0) {
        _push(`<div class="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">`);
        ssrRenderSlot(_ctx.$slots, "empty-state", {}, () => {
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-heroicons-inbox",
            class: "w-12 h-12 text-slate-300"
          }, null, _parent));
          _push(`<p class="text-sm font-semibold text-slate-600">${ssrInterpolate(__props.emptyStateTitle)}</p><p class="text-xs text-slate-400">${ssrInterpolate(__props.emptyStateText)}</p>`);
        }, _push, _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.showPagination && paginatedData.value.length > 0) {
        _push(`<div class="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-50 border-t border-slate-200"><span class="text-xs text-slate-500">${ssrInterpolate(startIndex.value + 1)}\u2013${ssrInterpolate(endIndex.value)} sur ${ssrInterpolate(filteredData.value.length)} r\xE9sultats `);
        if (filteredData.value.length !== sourceData.value.length) {
          _push(`<span class="text-slate-400"> (${ssrInterpolate(sourceData.value.length)} total) </span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</span><div class="flex items-center gap-1">`);
        _push(ssrRenderComponent(_component_UButton, {
          size: "xs",
          color: "gray",
          variant: "ghost",
          icon: "i-heroicons-chevron-left",
          disabled: currentPage.value <= 1,
          onClick: ($event) => currentPage.value--
        }, null, _parent));
        _push(`<!--[-->`);
        ssrRenderList(visiblePages.value, (p) => {
          _push(ssrRenderComponent(_component_UButton, {
            key: p,
            size: "xs",
            color: p === currentPage.value ? "indigo" : "gray",
            variant: p === currentPage.value ? "solid" : "ghost",
            label: String(p),
            onClick: ($event) => currentPage.value = p
          }, null, _parent));
        });
        _push(`<!--]-->`);
        _push(ssrRenderComponent(_component_UButton, {
          size: "xs",
          color: "gray",
          variant: "ghost",
          icon: "i-heroicons-chevron-right",
          disabled: currentPage.value >= totalPages.value,
          onClick: ($event) => currentPage.value++
        }, null, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (filterMenu.value.show) {
          _push2(`<div class="fixed inset-0 z-40"></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (filterMenu.value.show) {
          _push2(ssrRenderComponent(_component_UCard, {
            class: "fixed z-50 w-72 shadow-xl",
            style: { left: filterMenu.value.x + "px", top: filterMenu.value.y + "px" },
            ui: { body: { padding: "p-0" }, header: { padding: "px-4 py-3" }, footer: { padding: "px-4 py-2" } },
            onClick: () => {
            }
          }, {
            header: withCtx((_, _push3, _parent2, _scopeId) => {
              var _a, _b;
              if (_push3) {
                _push3(`<div class="flex items-center justify-between"${_scopeId}><span class="text-xs font-bold uppercase tracking-wider text-indigo-600"${_scopeId}>${ssrInterpolate(getColumnLabel(filterMenu.value.column))}</span><div class="flex items-center gap-2"${_scopeId}>`);
                if ((_a = multiSelectFilters.value[filterMenu.value.column]) == null ? void 0 : _a.length) {
                  _push3(ssrRenderComponent(_component_UBadge, {
                    label: String(multiSelectFilters.value[filterMenu.value.column].length),
                    color: "indigo",
                    size: "xs"
                  }, null, _parent2, _scopeId));
                } else {
                  _push3(`<!---->`);
                }
                _push3(ssrRenderComponent(_component_UButton, {
                  size: "xs",
                  color: "gray",
                  variant: "ghost",
                  icon: "i-heroicons-x-mark",
                  onClick: closeFilterMenu
                }, null, _parent2, _scopeId));
                _push3(`</div></div>`);
              } else {
                return [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("span", { class: "text-xs font-bold uppercase tracking-wider text-indigo-600" }, toDisplayString(getColumnLabel(filterMenu.value.column)), 1),
                    createVNode("div", { class: "flex items-center gap-2" }, [
                      ((_b = multiSelectFilters.value[filterMenu.value.column]) == null ? void 0 : _b.length) ? (openBlock(), createBlock(_component_UBadge, {
                        key: 0,
                        label: String(multiSelectFilters.value[filterMenu.value.column].length),
                        color: "indigo",
                        size: "xs"
                      }, null, 8, ["label"])) : createCommentVNode("", true),
                      createVNode(_component_UButton, {
                        size: "xs",
                        color: "gray",
                        variant: "ghost",
                        icon: "i-heroicons-x-mark",
                        onClick: closeFilterMenu
                      })
                    ])
                  ])
                ];
              }
            }),
            footer: withCtx((_, _push3, _parent2, _scopeId) => {
              var _a, _b, _c, _d;
              if (_push3) {
                _push3(`<div class="flex items-center justify-between"${_scopeId}><span class="text-xs text-slate-400"${_scopeId}>${ssrInterpolate(((_a = multiSelectFilters.value[filterMenu.value.column]) == null ? void 0 : _a.length) || 0)} s\xE9lectionn\xE9(s) </span>`);
                if ((_b = multiSelectFilters.value[filterMenu.value.column]) == null ? void 0 : _b.length) {
                  _push3(ssrRenderComponent(_component_UButton, {
                    size: "xs",
                    color: "indigo",
                    variant: "soft",
                    label: "R\xE9initialiser",
                    onClick: ($event) => resetFilter(filterMenu.value.column)
                  }, null, _parent2, _scopeId));
                } else {
                  _push3(`<!---->`);
                }
                _push3(`</div>`);
              } else {
                return [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("span", { class: "text-xs text-slate-400" }, toDisplayString(((_c = multiSelectFilters.value[filterMenu.value.column]) == null ? void 0 : _c.length) || 0) + " s\xE9lectionn\xE9(s) ", 1),
                    ((_d = multiSelectFilters.value[filterMenu.value.column]) == null ? void 0 : _d.length) ? (openBlock(), createBlock(_component_UButton, {
                      key: 0,
                      size: "xs",
                      color: "indigo",
                      variant: "soft",
                      label: "R\xE9initialiser",
                      onClick: ($event) => resetFilter(filterMenu.value.column)
                    }, null, 8, ["onClick"])) : createCommentVNode("", true)
                  ])
                ];
              }
            }),
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(`<div class="px-3 py-2 border-b border-slate-100"${_scopeId}>`);
                _push3(ssrRenderComponent(_component_UInput, {
                  modelValue: filterMenuSearch.value,
                  "onUpdate:modelValue": ($event) => filterMenuSearch.value = $event,
                  placeholder: "Rechercher...",
                  size: "xs",
                  icon: "i-heroicons-magnifying-glass"
                }, null, _parent2, _scopeId));
                _push3(`</div><div class="max-h-52 overflow-y-auto py-1"${_scopeId}><label class="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 cursor-pointer"${_scopeId}>`);
                _push3(ssrRenderComponent(_component_UCheckbox, {
                  "model-value": isAllOptionsSelected(filterMenu.value.column),
                  indeterminate: isOptionsIndeterminate(filterMenu.value.column),
                  onChange: ($event) => toggleAllOptions(filterMenu.value.column)
                }, null, _parent2, _scopeId));
                _push3(`<span class="text-xs font-semibold text-slate-500"${_scopeId}>(Tout s\xE9lectionner)</span></label><div class="my-1 border-t border-slate-100"${_scopeId}></div><!--[-->`);
                ssrRenderList(filteredOptions.value, (opt) => {
                  var _a;
                  _push3(`<label class="flex items-center gap-2 px-4 py-1.5 hover:bg-slate-50 cursor-pointer"${_scopeId}>`);
                  _push3(ssrRenderComponent(_component_UCheckbox, {
                    "model-value": (_a = multiSelectFilters.value[filterMenu.value.column]) == null ? void 0 : _a.includes(opt.value),
                    onChange: ($event) => toggleOption(filterMenu.value.column, opt.value)
                  }, null, _parent2, _scopeId));
                  _push3(`<span class="text-xs text-slate-700"${_scopeId}>${ssrInterpolate(opt.label)}</span></label>`);
                });
                _push3(`<!--]--></div>`);
              } else {
                return [
                  createVNode("div", { class: "px-3 py-2 border-b border-slate-100" }, [
                    createVNode(_component_UInput, {
                      modelValue: filterMenuSearch.value,
                      "onUpdate:modelValue": ($event) => filterMenuSearch.value = $event,
                      placeholder: "Rechercher...",
                      size: "xs",
                      icon: "i-heroicons-magnifying-glass"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  createVNode("div", { class: "max-h-52 overflow-y-auto py-1" }, [
                    createVNode("label", { class: "flex items-center gap-2 px-4 py-2 hover:bg-slate-50 cursor-pointer" }, [
                      createVNode(_component_UCheckbox, {
                        "model-value": isAllOptionsSelected(filterMenu.value.column),
                        indeterminate: isOptionsIndeterminate(filterMenu.value.column),
                        onChange: ($event) => toggleAllOptions(filterMenu.value.column)
                      }, null, 8, ["model-value", "indeterminate", "onChange"]),
                      createVNode("span", { class: "text-xs font-semibold text-slate-500" }, "(Tout s\xE9lectionner)")
                    ]),
                    createVNode("div", { class: "my-1 border-t border-slate-100" }),
                    (openBlock(true), createBlock(Fragment, null, renderList(filteredOptions.value, (opt) => {
                      var _a;
                      return openBlock(), createBlock("label", {
                        key: opt.value,
                        class: "flex items-center gap-2 px-4 py-1.5 hover:bg-slate-50 cursor-pointer"
                      }, [
                        createVNode(_component_UCheckbox, {
                          "model-value": (_a = multiSelectFilters.value[filterMenu.value.column]) == null ? void 0 : _a.includes(opt.value),
                          onChange: ($event) => toggleOption(filterMenu.value.column, opt.value)
                        }, null, 8, ["model-value", "onChange"]),
                        createVNode("span", { class: "text-xs text-slate-700" }, toDisplayString(opt.label), 1)
                      ]);
                    }), 128))
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/DataTable.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=DataTable-Cb4WL8Ep.mjs.map
