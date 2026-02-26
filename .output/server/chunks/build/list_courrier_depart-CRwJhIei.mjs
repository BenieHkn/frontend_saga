import __nuxt_component_1 from './Badge-DIEXPf_r.mjs';
import { _ as _export_sfc, c as __nuxt_component_0$2, d as __nuxt_component_1$1 } from './server.mjs';
import __nuxt_component_2 from './Input-50cchghJ.mjs';
import __nuxt_component_4 from './Select-C_BWMUVV.mjs';
import __nuxt_component_0 from './Checkbox-DFEpnQRu.mjs';
import { computed, ref, watch, mergeProps, withCtx, createTextVNode, createVNode, toDisplayString, createBlock, createCommentVNode, openBlock, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderStyle } from 'vue/server-renderer';
import { _ as _sfc_main$1, P as Pagination } from './Pagination-Dtpvabdd.mjs';
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
  __name: "list_courrier_depart",
  __ssrInlineRender: true,
  setup(__props) {
    const columns = [
      { key: "id", label: "N\xB0", visible: true },
      { key: "source", label: "Source", visible: true },
      { key: "reference", label: "R\xE9f\xE9rence", visible: true },
      { key: "structure", label: "Structure / Usager", visible: true },
      { key: "numeroEnregistrement", label: "N\xB0 d'enregistrement", visible: true },
      { key: "objet", label: "Objet", visible: true },
      { key: "date_enregistrement", label: "Date d'enregistrement", visible: true },
      { key: "date_courrier", label: "Date du Courrier", visible: true },
      { key: "url", label: "Document", visible: true, type: "document" },
      { key: "type_depart", label: "Type de d\xE9part", visible: true },
      { key: "date_depart", label: "Date de d\xE9part", visible: true }
    ];
    const visibleColumns = computed(() => columns.filter((col) => col.visible));
    ref("");
    const archiveData = ref([]);
    ref(false);
    ref(null);
    const globalSearch = ref("");
    const showAdvancedFilters = ref(false);
    const filterSearch = ref("");
    const filters = ref(
      columns.reduce((acc, col) => {
        acc[col.key] = "";
        return acc;
      }, {})
    );
    const multiSelectFilters = ref(
      columns.reduce((acc, col) => {
        acc[col.key] = [];
        return acc;
      }, {})
    );
    const textFilterMenu = ref({
      show: false,
      column: null,
      x: 0,
      y: 0
    });
    const sortColumn = ref("source");
    const sortDirection = ref("asc");
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const selectedRows = ref([]);
    const activeFiltersCount = computed(() => {
      const simpleFilters = Object.values(filters.value).filter((v) => v !== "").length;
      const multiFilters = Object.values(multiSelectFilters.value).filter((v) => v.length > 0).length;
      return simpleFilters + multiFilters;
    });
    const getFilterOptions = (column) => {
      const options = [...new Set(archiveData.value.map((item) => item[column]))];
      return options.map((value) => ({
        value,
        label: String(value)
      })).sort((a, b) => a.label.localeCompare(b.label));
    };
    const getFilteredOptions = (column) => {
      const allOptions = getFilterOptions(column);
      if (!filterSearch.value) return allOptions;
      const searchQuery = filterSearch.value.toLowerCase();
      return allOptions.filter(
        (option) => option.label.toLowerCase().includes(searchQuery)
      );
    };
    const isSelected = (column, value) => {
      var _a;
      return ((_a = multiSelectFilters.value[column]) == null ? void 0 : _a.includes(value)) || false;
    };
    const getSelectedCount = (column) => {
      var _a;
      return ((_a = multiSelectFilters.value[column]) == null ? void 0 : _a.length) || 0;
    };
    const isAllSelected = (column) => {
      const allOptions = getFilterOptions(column);
      const selected = multiSelectFilters.value[column] || [];
      return allOptions.length > 0 && selected.length === allOptions.length;
    };
    const isIndeterminate = (column) => {
      const allOptions = getFilterOptions(column);
      const selected = multiSelectFilters.value[column] || [];
      return selected.length > 0 && selected.length < allOptions.length;
    };
    const resetMultiSelectFilter = (column) => {
      multiSelectFilters.value[column] = [];
    };
    const openTextFilterMenu = (event, column) => {
      event.stopPropagation();
      filterSearch.value = "";
      const rect = event.target.getBoundingClientRect();
      textFilterMenu.value = {
        show: true,
        column,
        x: rect.left,
        y: rect.bottom + 5
      };
    };
    const closeTextFilterMenu = () => {
      filterSearch.value = "";
      textFilterMenu.value = {
        show: false,
        column: null,
        x: 0,
        y: 0
      };
    };
    const getColumnLabel = (columnKey) => {
      const column = columns.find((col) => col.key === columnKey);
      return column ? column.label : columnKey;
    };
    const toggleAdvancedFilters = () => {
      showAdvancedFilters.value = !showAdvancedFilters.value;
    };
    const handleGlobalSearch = () => {
      currentPage.value = 1;
    };
    const handleFilter = () => {
      currentPage.value = 1;
    };
    const sortBy = (column) => {
      if (sortColumn.value === column) {
        sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
      } else {
        sortColumn.value = column;
        sortDirection.value = "asc";
      }
    };
    const selectAll = computed({
      get: () => selectedRows.value.length === paginatedData.value.length && paginatedData.value.length > 0,
      set: (value) => {
        if (value) {
          selectedRows.value = paginatedData.value.map((item) => item.id);
        } else {
          selectedRows.value = [];
        }
      }
    });
    const isIndeterminateSelection = computed(() => {
      return selectedRows.value.length > 0 && selectedRows.value.length < paginatedData.value.length;
    });
    const toggleSelectAll = () => {
      if (selectAll.value) {
        selectedRows.value = [];
      } else {
        selectedRows.value = paginatedData.value.map((item) => item.id);
      }
    };
    const toggleRowSelection = (id) => {
      const index = selectedRows.value.indexOf(id);
      if (index > -1) {
        selectedRows.value.splice(index, 1);
      } else {
        selectedRows.value.push(id);
      }
    };
    const updateItemsPerPage = () => {
      currentPage.value = 1;
    };
    const filteredData = computed(() => {
      let filtered = archiveData.value;
      if (globalSearch.value) {
        const query = globalSearch.value.toLowerCase();
        filtered = filtered.filter(
          (item) => Object.values(item).some(
            (val) => String(val).toLowerCase().includes(query)
          )
        );
      }
      Object.keys(multiSelectFilters.value).forEach((column) => {
        var _a;
        if (((_a = multiSelectFilters.value[column]) == null ? void 0 : _a.length) > 0) {
          filtered = filtered.filter(
            (item) => multiSelectFilters.value[column].includes(item[column])
          );
        }
      });
      Object.keys(filters.value).forEach((key) => {
        if (filters.value[key]) {
          const query = filters.value[key].toLowerCase();
          filtered = filtered.filter(
            (item) => String(item[key]).toLowerCase().includes(query)
          );
        }
      });
      return filtered;
    });
    const sortedData = computed(() => {
      const data = [...filteredData.value];
      return data.sort((a, b) => {
        let aVal = a[sortColumn.value];
        let bVal = b[sortColumn.value];
        if (typeof aVal === "string") {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }
        return sortDirection.value === "asc" ? aVal > bVal ? 1 : -1 : aVal < bVal ? 1 : -1;
      });
    });
    const totalPages = computed(
      () => Math.ceil(sortedData.value.length / itemsPerPage.value)
    );
    const startIndex = computed(
      () => (currentPage.value - 1) * itemsPerPage.value
    );
    const endIndex = computed(
      () => Math.min(startIndex.value + itemsPerPage.value, sortedData.value.length)
    );
    const paginatedData = computed(
      () => sortedData.value.slice(startIndex.value, endIndex.value)
    );
    const getRowClasses = (id, index) => {
      const isSelectedRow = selectedRows.value.includes(id);
      return {
        "bg-blue-50": isSelectedRow,
        "bg-gray-50": index % 2 === 0 && !isSelectedRow,
        "bg-white": index % 2 === 1 && !isSelectedRow,
        "hover:bg-blue-100": !isSelectedRow,
        "hover:bg-blue-200": isSelectedRow
      };
    };
    const getCellAlignment = (columnKey) => {
      const leftAligned = ["reference", "structure", "numeroEnregistrement", "objet"];
      return leftAligned.includes(columnKey) ? "text-left" : "text-center";
    };
    const editItem = (item) => {
      console.log("\xC9diter l'\xE9l\xE9ment:", item);
    };
    const deleteItem = (item) => {
      console.log("Supprimer l'\xE9l\xE9ment:", item);
    };
    const deleteSelected = () => {
      console.log("Affecter les \xE9l\xE9ments s\xE9lectionn\xE9s:", selectedRows.value);
    };
    watch(filteredData, () => {
      if (currentPage.value > totalPages.value) {
        currentPage.value = 1;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UBadge = __nuxt_component_1;
      const _component_Icon = __nuxt_component_0$2;
      const _component_UButton = __nuxt_component_1$1;
      const _component_UInput = __nuxt_component_2;
      const _component_USelect = __nuxt_component_4;
      const _component_UCheckbox = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))} data-v-20362b31><div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6" data-v-20362b31><div class="flex items-end mb-4" data-v-20362b31>`);
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
              to: "/courriers/form_courrier_depart",
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
                to: "/courriers/form_courrier_depart",
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
      _push(`</div><div class="bg-white border-b border-gray-200 mb-4" data-v-20362b31><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3" data-v-20362b31><div class="flex flex-wrap items-center justify-between gap-4" data-v-20362b31><div class="flex items-center space-x-4" data-v-20362b31><div class="relative" data-v-20362b31>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: globalSearch.value,
        "onUpdate:modelValue": ($event) => globalSearch.value = $event,
        placeholder: "Recherche globale...",
        icon: "i-heroicons-magnifying-glass",
        size: "sm",
        class: "w-64",
        onInput: handleGlobalSearch
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UButton, {
        onClick: toggleAdvancedFilters,
        variant: "outline",
        size: "sm",
        icon: "i-heroicons-funnel",
        color: showAdvancedFilters.value ? "primary" : "gray"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Filtres avanc\xE9s `);
            if (activeFiltersCount.value > 0) {
              _push2(ssrRenderComponent(_component_UBadge, {
                color: "red",
                variant: "solid",
                size: "xs",
                class: "ml-2"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(activeFiltersCount.value)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(activeFiltersCount.value), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createTextVNode(" Filtres avanc\xE9s "),
              activeFiltersCount.value > 0 ? (openBlock(), createBlock(_component_UBadge, {
                key: 0,
                color: "red",
                variant: "solid",
                size: "xs",
                class: "ml-2"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(activeFiltersCount.value), 1)
                ]),
                _: 1
              })) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="flex items-center space-x-4" data-v-20362b31><div class="flex items-center space-x-2" data-v-20362b31><label class="text-sm text-gray-600" data-v-20362b31>Lignes par page:</label>`);
      _push(ssrRenderComponent(_component_USelect, {
        modelValue: itemsPerPage.value,
        "onUpdate:modelValue": [($event) => itemsPerPage.value = $event, updateItemsPerPage],
        options: [10, 25, 50, 100],
        class: "w-16",
        size: "sm"
      }, null, _parent));
      _push(`</div></div></div>`);
      if (showAdvancedFilters.value) {
        _push(`<div class="mt-4 p-4 bg-gray-50 rounded-lg" data-v-20362b31><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" data-v-20362b31><div data-v-20362b31><label class="block text-xs font-medium text-gray-700 mb-1" data-v-20362b31>Position</label>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: filters.value.position,
          "onUpdate:modelValue": ($event) => filters.value.position = $event,
          placeholder: "Filtrer par position...",
          size: "sm",
          icon: "i-heroicons-briefcase",
          onInput: handleFilter
        }, null, _parent));
        _push(`</div><div data-v-20362b31><label class="block text-xs font-medium text-gray-700 mb-1" data-v-20362b31>Bureau</label>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: filters.value.office,
          "onUpdate:modelValue": ($event) => filters.value.office = $event,
          placeholder: "Filtrer par bureau...",
          size: "sm",
          icon: "i-heroicons-building-office",
          onInput: handleFilter
        }, null, _parent));
        _push(`</div><div data-v-20362b31><label class="block text-xs font-medium text-gray-700 mb-1" data-v-20362b31>Tranche d&#39;\xE2ge</label>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: filters.value.ageRange,
          "onUpdate:modelValue": ($event) => filters.value.ageRange = $event,
          placeholder: "ex: 30-39, 50+",
          size: "sm",
          icon: "i-heroicons-calendar-days",
          onInput: handleFilter
        }, null, _parent));
        _push(`</div><div data-v-20362b31><label class="block text-xs font-medium text-gray-700 mb-1" data-v-20362b31>Salaire minimum</label>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: filters.value.minSalary,
          "onUpdate:modelValue": ($event) => filters.value.minSalary = $event,
          placeholder: "ex: 100000",
          size: "sm",
          icon: "i-heroicons-currency-euro",
          onInput: handleFilter
        }, null, _parent));
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="max-w-7xl px-4 sm:px-6 lg:px-8 py-6" data-v-20362b31><div class="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden" data-v-20362b31><div class="border-b border-gray-200 px-6 py-3 bg-gray-50" data-v-20362b31><div class="flex items-center space-x-4" data-v-20362b31><span class="text-sm text-gray-700" data-v-20362b31>${ssrInterpolate(selectedRows.value.length)} s\xE9lectionn\xE9(s) </span>`);
      if (selectedRows.value.length > 0) {
        _push(ssrRenderComponent(_component_UButton, {
          onClick: deleteSelected,
          variant: "outline",
          size: "sm",
          icon: "i-heroicons-arrow-path",
          class: "bg-gradient-to-r from-emerald-700 to-blue-700",
          color: "white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Affecter `);
            } else {
              return [
                createTextVNode(" Affecter ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="table-auto overflow-x-auto" data-v-20362b31><table class="w-full border-collapse" data-v-20362b31><thead class="bg-gray-50 border border-gray-400" data-v-20362b31><tr data-v-20362b31><!--[-->`);
      ssrRenderList(visibleColumns.value, (column) => {
        var _a;
        _push(`<th class="${ssrRenderClass([
          "px-2 py-3 text-center border border-gray-400 bg-gray-100 min-w-[200px]"
        ])}" data-v-20362b31><div class="space-y-1" data-v-20362b31><div class="flex items-center justify-center gap-1" data-v-20362b31>`);
        if (column.type === "document") {
          _push(`<span class="text-xs font-medium text-gray-700 uppercase tracking-wider" data-v-20362b31>${ssrInterpolate(column.label)}</span>`);
        } else {
          _push(`<!--[-->`);
          _push(ssrRenderComponent(_component_UInput, {
            modelValue: filters.value[column.key],
            "onUpdate:modelValue": [($event) => filters.value[column.key] = $event, handleFilter],
            placeholder: column.label,
            size: "xs",
            class: "w-full"
          }, {
            trailing: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_sfc_main$1, {
                  column: column.key,
                  "sort-column": sortColumn.value,
                  "sort-direction": sortDirection.value,
                  onSort: sortBy
                }, null, _parent2, _scopeId));
              } else {
                return [
                  createVNode(_sfc_main$1, {
                    column: column.key,
                    "sort-column": sortColumn.value,
                    "sort-direction": sortDirection.value,
                    onSort: sortBy
                  }, null, 8, ["column", "sort-column", "sort-direction"])
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(ssrRenderComponent(_component_UButton, {
            onClick: ($event) => openTextFilterMenu($event, column.key),
            variant: "outline",
            size: "2xs",
            icon: "i-heroicons-funnel",
            color: ((_a = multiSelectFilters.value[column.key]) == null ? void 0 : _a.length) > 0 ? "primary" : "gray"
          }, null, _parent));
          _push(`<!--]-->`);
        }
        _push(`</div></div></th>`);
      });
      _push(`<!--]--><th class="px-2 py-3 text-center border border-gray-400 bg-gray-100" data-v-20362b31>`);
      _push(ssrRenderComponent(_component_UCheckbox, {
        modelValue: selectAll.value,
        "onUpdate:modelValue": ($event) => selectAll.value = $event,
        indeterminate: isIndeterminateSelection.value,
        onChange: toggleSelectAll
      }, null, _parent));
      _push(`</th><th class="px-6 py-3 text-right border border-gray-400 bg-gray-100" data-v-20362b31><span class="text-xs font-medium text-gray-700 uppercase tracking-wider" data-v-20362b31> Actions </span></th></tr></thead><tbody class="bg-white" data-v-20362b31><!--[-->`);
      ssrRenderList(paginatedData.value, (item, index) => {
        _push(`<tr class="${ssrRenderClass([getRowClasses(item.id, index), "transition-colors"])}" data-v-20362b31><!--[-->`);
        ssrRenderList(visibleColumns.value, (column) => {
          _push(`<td class="${ssrRenderClass([
            "px-2 py-3 border border-gray-300 text-xs text-gray-900",
            getCellAlignment(column.key),
            column.width || "min-w-[100px]"
          ])}" data-v-20362b31>`);
          if (column.type === "document") {
            _push(`<div class="flex justify-center" data-v-20362b31>`);
            if (item[column.key]) {
              _push(`<button class="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded hover:bg-blue-50" title="Ouvrir le document" data-v-20362b31>`);
              _push(ssrRenderComponent(_component_Icon, {
                name: "i-heroicons-document-text",
                class: "h-5 w-5"
              }, null, _parent));
              _push(`</button>`);
            } else {
              _push(`<span class="text-gray-300" title="Aucun document" data-v-20362b31>`);
              _push(ssrRenderComponent(_component_Icon, {
                name: "i-heroicons-document-text",
                class: "h-5 w-5"
              }, null, _parent));
              _push(`</span>`);
            }
            _push(`</div>`);
          } else if (column.key === "source") {
            _push(`<div class="flex justify-left" data-v-20362b31>`);
            _push(ssrRenderComponent(_component_UBadge, {
              color: "blue",
              variant: "soft",
              size: "2xs"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(item[column.key])}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(item[column.key]), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</div>`);
          } else {
            _push(`<div data-v-20362b31>${ssrInterpolate(item[column.key])}</div>`);
          }
          _push(`</td>`);
        });
        _push(`<!--]--><td class="px-2 py-3 border border-gray-300 text-center" data-v-20362b31>`);
        _push(ssrRenderComponent(_component_UCheckbox, {
          "model-value": selectedRows.value.includes(item.id),
          onChange: ($event) => toggleRowSelection(item.id)
        }, null, _parent));
        _push(`</td><td class="px-6 py-4 border border-gray-300 text-right text-sm font-medium" data-v-20362b31><div class="flex justify-end space-x-2" data-v-20362b31>`);
        _push(ssrRenderComponent(_component_UButton, {
          onClick: ($event) => editItem(item),
          variant: "ghost",
          size: "xs",
          icon: "i-heroicons-pencil",
          color: "blue"
        }, null, _parent));
        _push(ssrRenderComponent(_component_UButton, {
          onClick: ($event) => deleteItem(item),
          variant: "ghost",
          size: "xs",
          icon: "i-heroicons-trash",
          color: "red"
        }, null, _parent));
        _push(`</div></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div>`);
      if (paginatedData.value.length === 0) {
        _push(`<div class="text-center py-12" data-v-20362b31>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-inbox",
          class: "mx-auto h-12 w-12 text-gray-400"
        }, null, _parent));
        _push(`<h3 class="mt-2 text-sm font-medium text-gray-900" data-v-20362b31>Aucun r\xE9sultat</h3><p class="mt-1 text-sm text-gray-500" data-v-20362b31> Essayez d&#39;ajuster vos filtres ou votre recherche. </p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="border-t border-gray-200 px-6 py-4 bg-gray-50" data-v-20362b31><div class="flex items-center justify-between" data-v-20362b31><div class="text-sm text-gray-700" data-v-20362b31> Affichage de ${ssrInterpolate(startIndex.value + 1)} \xE0 ${ssrInterpolate(endIndex.value)} sur ${ssrInterpolate(filteredData.value.length)} r\xE9sultats `);
      if (filteredData.value.length !== archiveData.value.length) {
        _push(`<span class="ml-2" data-v-20362b31> (${ssrInterpolate(archiveData.value.length)} total) </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(Pagination, {
        modelValue: currentPage.value,
        "onUpdate:modelValue": ($event) => currentPage.value = $event,
        itemsPerPage: itemsPerPage.value,
        "onUpdate:itemsPerPage": ($event) => itemsPerPage.value = $event,
        "total-items": filteredData.value.length,
        "total-items-without-filter": archiveData.value.length,
        ui: {
          wrapper: "flex items-center gap-1",
          rounded: "!rounded-full min-w-[32px] justify-center",
          default: {
            activeButton: { variant: "solid" }
          }
        }
      }, null, _parent));
      _push(`</div></div></div></div></div>`);
      if (textFilterMenu.value.show) {
        _push(`<div class="fixed z-50 bg-white border border-gray-300 rounded-lg shadow-lg min-w-80 max-h-96" style="${ssrRenderStyle({ left: textFilterMenu.value.x + "px", top: textFilterMenu.value.y + "px" })}" data-v-20362b31><div class="p-4" data-v-20362b31><div class="flex items-center justify-between mb-3" data-v-20362b31><h3 class="text-sm font-medium text-gray-900" data-v-20362b31> Filtre - ${ssrInterpolate(getColumnLabel(textFilterMenu.value.column))}</h3><div class="flex items-center space-x-2" data-v-20362b31>`);
        if (getSelectedCount(textFilterMenu.value.column) > 0) {
          _push(ssrRenderComponent(_component_UBadge, {
            color: "blue",
            variant: "solid",
            size: "xs"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(getSelectedCount(textFilterMenu.value.column))}`);
              } else {
                return [
                  createTextVNode(toDisplayString(getSelectedCount(textFilterMenu.value.column)), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(_component_UButton, {
          onClick: closeTextFilterMenu,
          variant: "ghost",
          size: "xs",
          icon: "i-heroicons-x-mark"
        }, null, _parent));
        _push(`</div></div>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: filterSearch.value,
          "onUpdate:modelValue": ($event) => filterSearch.value = $event,
          placeholder: "Rechercher...",
          icon: "i-heroicons-magnifying-glass",
          size: "sm",
          class: "mb-3"
        }, null, _parent));
        _push(`<div class="max-h-48 overflow-y-auto border border-gray-200 rounded" data-v-20362b31><div class="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer border-b" data-v-20362b31>`);
        _push(ssrRenderComponent(_component_UCheckbox, {
          "model-value": isAllSelected(textFilterMenu.value.column),
          indeterminate: isIndeterminate(textFilterMenu.value.column),
          size: "sm",
          class: "mr-3"
        }, null, _parent));
        _push(`<span class="text-sm text-gray-700" data-v-20362b31>(S\xE9lectionner tous)</span></div><!--[-->`);
        ssrRenderList(getFilteredOptions(textFilterMenu.value.column), (option) => {
          _push(`<div class="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer" data-v-20362b31>`);
          _push(ssrRenderComponent(_component_UCheckbox, {
            "model-value": isSelected(textFilterMenu.value.column, option.value),
            size: "sm",
            class: "mr-3"
          }, null, _parent));
          _push(`<div class="flex items-center flex-1" data-v-20362b31><span class="text-sm text-gray-700" data-v-20362b31>${ssrInterpolate(option.label)}</span></div></div>`);
        });
        _push(`<!--]--></div><div class="flex justify-between items-center mt-3 pt-3 border-t border-gray-200" data-v-20362b31><span class="text-xs text-gray-500" data-v-20362b31>${ssrInterpolate(getSelectedCount(textFilterMenu.value.column))} s\xE9lectionn\xE9(s) </span>`);
        if (getSelectedCount(textFilterMenu.value.column) > 0) {
          _push(ssrRenderComponent(_component_UButton, {
            onClick: ($event) => resetMultiSelectFilter(textFilterMenu.value.column),
            variant: "outline",
            size: "xs",
            icon: "i-heroicons-arrow-path"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Reset `);
              } else {
                return [
                  createTextVNode(" Reset ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (textFilterMenu.value.show) {
        _push(`<div class="fixed inset-0 z-40" data-v-20362b31></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/courriers/list_courrier_depart.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const list_courrier_depart = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-20362b31"]]);

export { list_courrier_depart as default };
//# sourceMappingURL=list_courrier_depart-CRwJhIei.mjs.map
