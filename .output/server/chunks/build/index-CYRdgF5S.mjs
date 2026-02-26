import __nuxt_component_2 from './Input-50cchghJ.mjs';
import { d as __nuxt_component_1, c as __nuxt_component_0$2 } from './server.mjs';
import __nuxt_component_1$1 from './Badge-DIEXPf_r.mjs';
import __nuxt_component_4 from './Select-C_BWMUVV.mjs';
import __nuxt_component_0 from './Checkbox-DFEpnQRu.mjs';
import { ref, computed, watch, unref, isRef, withCtx, createTextVNode, toDisplayString, createBlock, createCommentVNode, openBlock, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrRenderStyle } from 'vue/server-renderer';
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
import './useFormGroup-BPckFnLf.mjs';
import 'pinia';
import 'vue-router';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const globalSearch = ref("");
    const showAdvancedFilters = ref(false);
    const refreshing = ref(false);
    const selectedRows = ref([]);
    const textFilterMenu = ref({
      show: false,
      column: null,
      x: 0,
      y: 0
    });
    const textFilters = ref({
      name: "",
      position: "",
      office: "",
      age: "",
      startDate: "",
      salary: ""
    });
    const multiSelectFilters = ref({
      position: [],
      office: [],
      age: [],
      salary: []
    });
    const filterSearch = ref("");
    const filters = ref({
      name: "",
      position: "",
      office: "",
      age: "",
      ageRange: "",
      startDate: "",
      salary: "",
      minSalary: ""
    });
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const sortColumn = ref("name");
    const sortDirection = ref("asc");
    const columns = [
      { key: "name", label: "Utilisateur" },
      { key: "position", label: "Position" },
      { key: "office", label: "Bureau" },
      { key: "age", label: "\xC2ge" },
      { key: "startDate", label: "Date de d\xE9but" },
      { key: "salary", label: "Salaire" }
    ];
    const getFilterOptions = (column) => {
      const options = [...new Set(archiveData.map((item) => item[column]))];
      return options.map((value) => ({
        value,
        label: value.toString()
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
    const toggleOption = (column, value) => {
      if (!multiSelectFilters.value[column]) {
        multiSelectFilters.value[column] = [];
      }
      const index = multiSelectFilters.value[column].indexOf(value);
      if (index > -1) {
        multiSelectFilters.value[column].splice(index, 1);
      } else {
        multiSelectFilters.value[column].push(value);
      }
      handleTextFilter();
    };
    const toggleSelectAllOptions = (column) => {
      const allOptions = getFilterOptions(column);
      const selected = multiSelectFilters.value[column] || [];
      if (selected.length === allOptions.length) {
        multiSelectFilters.value[column] = [];
      } else {
        multiSelectFilters.value[column] = allOptions.map((option) => option.value);
      }
      handleTextFilter();
    };
    const resetMultiSelectFilter = (column) => {
      multiSelectFilters.value[column] = [];
      handleTextFilter();
    };
    const getColumnIcon = (column, value) => {
      switch (column) {
        case "office":
          const officeIcons = {
            "Tokyo": "i-heroicons-globe-asia-australia",
            "Londres": "i-heroicons-globe-europe-africa",
            "San Francisco": "i-heroicons-globe-americas",
            "New York": "i-heroicons-building-office-2",
            "\xC9dimbourg": "i-heroicons-building-office"
          };
          return officeIcons[value];
        default:
          return null;
      }
    };
    const archiveData = [
      {
        id: 1,
        name: "Airi Satou",
        email: "airi.satou@example.com",
        position: "Comptable",
        office: "Tokyo",
        age: 33,
        startDate: "2008-11-28",
        salary: "162 700 \u20AC",
        avatar: "https://i.pravatar.cc/150?img=1"
      },
      {
        id: 2,
        name: "Angelica Ramos",
        email: "angelica.ramos@example.com",
        position: "Directrice G\xE9n\xE9rale",
        office: "Londres",
        age: 47,
        startDate: "2009-10-09",
        salary: "1 200 000 \u20AC",
        avatar: "https://i.pravatar.cc/150?img=2"
      },
      {
        id: 3,
        name: "Ashton Cox",
        email: "ashton.cox@example.com",
        position: "D\xE9veloppeur Junior",
        office: "San Francisco",
        age: 28,
        startDate: "2009-01-12",
        salary: "86 000 \u20AC",
        avatar: "https://i.pravatar.cc/150?img=3"
      },
      {
        id: 4,
        name: "Bradley Greer",
        email: "bradley.greer@example.com",
        position: "Ing\xE9nieur Logiciel",
        office: "Londres",
        age: 35,
        startDate: "2012-10-13",
        salary: "132 000 \u20AC",
        avatar: "https://i.pravatar.cc/150?img=4"
      },
      {
        id: 5,
        name: "Brenden Wagner",
        email: "brenden.wagner@example.com",
        position: "D\xE9veloppeur Senior",
        office: "San Francisco",
        age: 41,
        startDate: "2011-06-07",
        salary: "206 850 \u20AC",
        avatar: "https://i.pravatar.cc/150?img=5"
      },
      {
        id: 6,
        name: "Brielle Williamson",
        email: "brielle.williamson@example.com",
        position: "Int\xE9gratrice",
        office: "New York",
        age: 29,
        startDate: "2012-12-02",
        salary: "372 000 \u20AC",
        avatar: "https://i.pravatar.cc/150?img=6"
      },
      {
        id: 7,
        name: "Bruno Nash",
        email: "bruno.nash@example.com",
        position: "D\xE9veloppeur Logiciel",
        office: "Londres",
        age: 38,
        startDate: "2011-05-03",
        salary: "163 500 \u20AC",
        avatar: "https://i.pravatar.cc/150?img=7"
      },
      {
        id: 8,
        name: "Caesar Vance",
        email: "caesar.vance@example.com",
        position: "Pr\xE9-vente Technique",
        office: "New York",
        age: 32,
        startDate: "2011-12-12",
        salary: "106 450 \u20AC",
        avatar: "https://i.pravatar.cc/150?img=8"
      },
      {
        id: 9,
        name: "Cara Stevens",
        email: "cara.stevens@example.com",
        position: "Assistante Ventes",
        office: "New York",
        age: 27,
        startDate: "2011-12-06",
        salary: "145 600 \u20AC",
        avatar: "https://i.pravatar.cc/150?img=9"
      },
      {
        id: 10,
        name: "Cedric Kelly",
        email: "cedric.kelly@example.com",
        position: "D\xE9veloppeur Senior",
        office: "\xC9dimbourg",
        age: 45,
        startDate: "2012-03-29",
        salary: "433 060 \u20AC",
        avatar: "https://i.pravatar.cc/150?img=10"
      }
    ];
    const activeFiltersCount = computed(() => {
      return Object.values(filters.value).filter((value) => value !== "").length;
    });
    computed(() => {
      return Object.values(filters.value).some((value) => value !== "") || globalSearch.value;
    });
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
    const filteredData = computed(() => {
      let filtered = archiveData;
      if (globalSearch.value) {
        const query = globalSearch.value.toLowerCase();
        filtered = filtered.filter(
          (item) => item.name.toLowerCase().includes(query) || item.email.toLowerCase().includes(query) || item.position.toLowerCase().includes(query) || item.office.toLowerCase().includes(query) || item.salary.toLowerCase().includes(query)
        );
      }
      if (multiSelectFilters.value.position && multiSelectFilters.value.position.length > 0) {
        filtered = filtered.filter(
          (item) => multiSelectFilters.value.position.includes(item.position)
        );
      }
      if (multiSelectFilters.value.office && multiSelectFilters.value.office.length > 0) {
        filtered = filtered.filter(
          (item) => multiSelectFilters.value.office.includes(item.office)
        );
      }
      if (multiSelectFilters.value.age && multiSelectFilters.value.age.length > 0) {
        filtered = filtered.filter(
          (item) => multiSelectFilters.value.age.includes(item.age.toString())
        );
      }
      if (multiSelectFilters.value.salary && multiSelectFilters.value.salary.length > 0) {
        filtered = filtered.filter(
          (item) => multiSelectFilters.value.salary.includes(item.salary)
        );
      }
      if (textFilters.value.name) {
        const query = textFilters.value.name.toLowerCase();
        filtered = filtered.filter(
          (item) => item.name.toLowerCase().includes(query) || item.email.toLowerCase().includes(query)
        );
      }
      if (textFilters.value.startDate) {
        const query = textFilters.value.startDate.toLowerCase();
        filtered = filtered.filter(
          (item) => item.startDate.toLowerCase().includes(query)
        );
      }
      if (filters.value.name) {
        const nameQuery = filters.value.name.toLowerCase();
        filtered = filtered.filter(
          (item) => item.name.toLowerCase().includes(nameQuery) || item.email.toLowerCase().includes(nameQuery)
        );
      }
      if (filters.value.position) {
        const positionQuery = filters.value.position.toLowerCase();
        filtered = filtered.filter(
          (item) => item.position.toLowerCase().includes(positionQuery)
        );
      }
      if (filters.value.office) {
        const officeQuery = filters.value.office.toLowerCase();
        filtered = filtered.filter(
          (item) => item.office.toLowerCase().includes(officeQuery)
        );
      }
      if (filters.value.age) {
        const ageValue = parseInt(filters.value.age.trim());
        if (!isNaN(ageValue)) {
          filtered = filtered.filter((item) => item.age === ageValue);
        }
      }
      if (filters.value.ageRange) {
        const ageQuery = filters.value.ageRange.toLowerCase();
        filtered = filtered.filter((item) => {
          const age = item.age;
          if (ageQuery.includes("-")) {
            const [min, max] = ageQuery.split("-").map((v) => parseInt(v.trim()));
            return age >= min && age <= max;
          } else if (ageQuery.includes("+")) {
            const min = parseInt(ageQuery.replace("+", "").trim());
            return age >= min;
          } else {
            const targetAge = parseInt(ageQuery.trim());
            return !isNaN(targetAge) && age === targetAge;
          }
        });
      }
      if (filters.value.startDate) {
        const dateQuery = filters.value.startDate.toLowerCase();
        filtered = filtered.filter(
          (item) => item.startDate.toLowerCase().includes(dateQuery)
        );
      }
      if (filters.value.salary) {
        const salaryQuery = filters.value.salary.toLowerCase();
        filtered = filtered.filter(
          (item) => item.salary.toLowerCase().includes(salaryQuery)
        );
      }
      if (filters.value.minSalary) {
        const minSalary = parseInt(filters.value.minSalary.replace(/\D/g, ""));
        filtered = filtered.filter((item) => {
          const salary = parseInt(item.salary.replace(/\D/g, ""));
          return salary >= minSalary;
        });
      }
      return filtered;
    });
    const sortedData = computed(() => {
      const data = [...filteredData.value];
      return data.sort((a, b) => {
        let aVal = a[sortColumn.value];
        let bVal = b[sortColumn.value];
        if (sortColumn.value === "age") {
          aVal = parseInt(aVal);
          bVal = parseInt(bVal);
        } else if (sortColumn.value === "salary") {
          aVal = parseInt(aVal.replace(/\D/g, ""));
          bVal = parseInt(bVal.replace(/\D/g, ""));
        }
        if (sortDirection.value === "asc") {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    });
    const totalPages = computed(() => Math.ceil(sortedData.value.length / itemsPerPage.value));
    const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
    const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, sortedData.value.length));
    const paginatedData = computed(() => {
      return sortedData.value.slice(startIndex.value, startIndex.value + itemsPerPage.value);
    });
    const visiblePages = computed(() => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];
      let l;
      for (let i = 1; i <= totalPages.value; i++) {
        if (i === 1 || i === totalPages.value || i >= currentPage.value - delta && i <= currentPage.value + delta) {
          range.push(i);
        }
      }
      range.forEach((i) => {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1);
          } else if (i - l !== 1) {
            rangeWithDots.push("...");
          }
        }
        rangeWithDots.push(i);
        l = i;
      });
      return rangeWithDots.filter((page) => page !== "...");
    });
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    };
    const sortBy = (column) => {
      if (sortColumn.value === column) {
        sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
      } else {
        sortColumn.value = column;
        sortDirection.value = "asc";
      }
    };
    const handleGlobalSearch = () => {
      currentPage.value = 1;
    };
    const handleFilter = () => {
      currentPage.value = 1;
    };
    const handleTextFilter = () => {
      currentPage.value = 1;
    };
    const openTextFilterMenu = (event, column) => {
      event.stopPropagation();
      const rect = event.target.getBoundingClientRect();
      textFilterMenu.value = {
        show: true,
        column,
        x: rect.left,
        y: rect.bottom + 5
      };
    };
    const closeTextFilterMenu = () => {
      textFilterMenu.value = {
        show: false,
        column: null,
        x: 0,
        y: 0
      };
    };
    const getColumnLabel = (column) => {
      const columnObj = columns.find((col) => col.key === column);
      return columnObj ? columnObj.label : column;
    };
    const toggleAdvancedFilters = () => {
      showAdvancedFilters.value = !showAdvancedFilters.value;
    };
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
    const refreshData = async () => {
      refreshing.value = true;
      await new Promise((resolve) => setTimeout(resolve, 1e3));
      refreshing.value = false;
    };
    const editItem = (item) => {
      console.log("\xC9diter l'\xE9l\xE9ment:", item);
    };
    const deleteItem = (item) => {
      console.log("Supprimer l'\xE9l\xE9ment:", item);
    };
    const deleteSelected = () => {
      console.log("Supprimer les \xE9l\xE9ments s\xE9lectionn\xE9s:", selectedRows.value);
    };
    const updateItemsPerPage = () => {
      currentPage.value = 1;
    };
    watch(filteredData, () => {
      if (currentPage.value > totalPages.value) {
        currentPage.value = 1;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UInput = __nuxt_component_2;
      const _component_UButton = __nuxt_component_1;
      const _component_UBadge = __nuxt_component_1$1;
      const _component_USelect = __nuxt_component_4;
      const _component_UCheckbox = __nuxt_component_0;
      const _component_Icon = __nuxt_component_0$2;
      _push(`<!--[--><div class="min-h-screen bg-gray-50 bg-white rounded-lg shadow-sm border border-gray-200 p-6"><div class="bg-white border-b border-gray-200"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3"><div class="flex flex-wrap items-center justify-between gap-4"><div class="flex items-center space-x-4"><div class="relative">`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(globalSearch),
        "onUpdate:modelValue": ($event) => isRef(globalSearch) ? globalSearch.value = $event : null,
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
        color: unref(showAdvancedFilters) ? "primary" : "gray"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Filtres avanc\xE9s `);
            if (unref(activeFiltersCount) > 0) {
              _push2(ssrRenderComponent(_component_UBadge, {
                color: "red",
                variant: "solid",
                size: "xs",
                class: "ml-2"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(unref(activeFiltersCount))}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(unref(activeFiltersCount)), 1)
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
              unref(activeFiltersCount) > 0 ? (openBlock(), createBlock(_component_UBadge, {
                key: 0,
                color: "red",
                variant: "solid",
                size: "xs",
                class: "ml-2"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(activeFiltersCount)), 1)
                ]),
                _: 1
              })) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="flex items-center space-x-4"><div class="flex items-center space-x-2"><label class="text-sm text-gray-600">Lignes par page:</label>`);
      _push(ssrRenderComponent(_component_USelect, {
        modelValue: unref(itemsPerPage),
        "onUpdate:modelValue": [($event) => isRef(itemsPerPage) ? itemsPerPage.value = $event : null, updateItemsPerPage],
        options: [10, 25, 50, 100],
        class: "w-16",
        size: "sm"
      }, null, _parent));
      _push(`</div></div></div>`);
      if (unref(showAdvancedFilters)) {
        _push(`<div class="mt-4 p-4 bg-gray-50 rounded-lg"><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"><div><label class="block text-xs font-medium text-gray-700 mb-1">Position</label>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: unref(filters).position,
          "onUpdate:modelValue": ($event) => unref(filters).position = $event,
          placeholder: "Filtrer par position...",
          size: "sm",
          icon: "i-heroicons-briefcase",
          onInput: handleFilter
        }, null, _parent));
        _push(`</div><div><label class="block text-xs font-medium text-gray-700 mb-1">Bureau</label>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: unref(filters).office,
          "onUpdate:modelValue": ($event) => unref(filters).office = $event,
          placeholder: "Filtrer par bureau...",
          size: "sm",
          icon: "i-heroicons-building-office",
          onInput: handleFilter
        }, null, _parent));
        _push(`</div><div><label class="block text-xs font-medium text-gray-700 mb-1">Tranche d&#39;\xE2ge</label>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: unref(filters).ageRange,
          "onUpdate:modelValue": ($event) => unref(filters).ageRange = $event,
          placeholder: "ex: 30-39, 50+",
          size: "sm",
          icon: "i-heroicons-calendar-days",
          onInput: handleFilter
        }, null, _parent));
        _push(`</div><div><label class="block text-xs font-medium text-gray-700 mb-1">Salaire minimum</label>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: unref(filters).minSalary,
          "onUpdate:modelValue": ($event) => unref(filters).minSalary = $event,
          placeholder: "ex: 100000",
          size: "sm",
          icon: "i-heroicons-currency-euro",
          onInput: handleFilter
        }, null, _parent));
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="max-w-7xl py-6"><div class="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden"><div class="border-b border-gray-200 px-6 py-3 bg-gray-50"><div class="flex items-center justify-between"><div class="flex items-center space-x-4">`);
      _push(ssrRenderComponent(_component_UCheckbox, {
        modelValue: unref(selectAll),
        "onUpdate:modelValue": ($event) => isRef(selectAll) ? selectAll.value = $event : null,
        indeterminate: unref(isIndeterminateSelection),
        onChange: toggleSelectAll
      }, null, _parent));
      _push(`<span class="text-sm text-gray-700">${ssrInterpolate(unref(selectedRows).length)} s\xE9lectionn\xE9(s) </span>`);
      if (unref(selectedRows).length > 0) {
        _push(ssrRenderComponent(_component_UButton, {
          onClick: deleteSelected,
          variant: "outline",
          size: "xs",
          color: "red",
          icon: "i-heroicons-trash"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Supprimer `);
            } else {
              return [
                createTextVNode(" Supprimer ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex items-center space-x-2">`);
      _push(ssrRenderComponent(_component_UButton, {
        onClick: refreshData,
        variant: "variant",
        size: "xs",
        icon: "i-heroicons-arrow-path",
        loading: unref(refreshing)
      }, null, _parent));
      _push(`</div></div></div><div class="overflow-x-auto"><table class="w-full border-collapse"><thead class="bg-gray-50 border border-gray-400"><tr><th class="px-6 py-3 text-left border border-gray-400 bg-gray-100"><div class="space-y-2"><div class="flex items-center space-x-2"><span class="text-xs font-medium text-gray-700 uppercase tracking-wider">N\xB0</span></div></div></th><th class="px-6 py-3 text-left border border-gray-400 bg-gray-100"><div class="space-y-2"><div class="flex items-center space-x-2"><span class="text-xs font-medium text-gray-700 uppercase tracking-wider">Source</span><div class="flex flex-col items-center">`);
      if (unref(sortColumn) !== "position" || unref(sortDirection) === "desc") {
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-chevron-up",
          class: ["w-3 h-3 text-gray-500 hover:text-gray-700 cursor-pointer", { "text-blue-600": unref(sortColumn) === "position" && unref(sortDirection) === "asc" }],
          onClick: ($event) => sortBy("position")
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(sortColumn) !== "position" || unref(sortDirection) === "asc") {
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-chevron-down",
          class: ["w-3 h-3 text-gray-500 hover:text-gray-700 cursor-pointer", { "text-blue-600": unref(sortColumn) === "position" && unref(sortDirection) === "desc" }],
          onClick: ($event) => sortBy("position")
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UButton, {
        onClick: ($event) => openTextFilterMenu($event, "position"),
        variant: "outline",
        size: "sm",
        icon: "i-heroicons-funnel",
        color: unref(textFilters).position ? "primary" : "gray",
        class: "ml-2"
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(filters).position,
        "onUpdate:modelValue": ($event) => unref(filters).position = $event,
        placeholder: "Position...",
        size: "xs",
        icon: "i-heroicons-briefcase",
        onInput: handleFilter,
        onClick: () => {
        }
      }, null, _parent));
      _push(`</div></th><th class="px-6 py-3 text-left border border-gray-400 bg-gray-100"><div class="space-y-2"><div class="flex items-center space-x-2"><span class="text-xs font-medium text-gray-700 uppercase tracking-wider">Objet</span><div class="flex flex-col items-center">`);
      if (unref(sortColumn) !== "salary" || unref(sortDirection) === "desc") {
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-chevron-up",
          class: ["w-3 h-3 text-gray-500 hover:text-gray-700 cursor-pointer", { "text-blue-600": unref(sortColumn) === "salary" && unref(sortDirection) === "asc" }],
          onClick: ($event) => sortBy("salary")
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(sortColumn) !== "salary" || unref(sortDirection) === "asc") {
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-chevron-down",
          class: ["w-3 h-3 text-gray-500 hover:text-gray-700 cursor-pointer", { "text-blue-600": unref(sortColumn) === "salary" && unref(sortDirection) === "desc" }],
          onClick: ($event) => sortBy("salary")
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UButton, {
        onClick: ($event) => openTextFilterMenu($event, "salary"),
        variant: "outline",
        size: "sm",
        icon: "i-heroicons-funnel",
        color: unref(textFilters).salary ? "primary" : "gray",
        class: "ml-2"
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(filters).salary,
        "onUpdate:modelValue": ($event) => unref(filters).salary = $event,
        placeholder: "Salaire...",
        size: "xs",
        icon: "i-heroicons-currency-euro",
        onInput: handleFilter,
        onClick: () => {
        }
      }, null, _parent));
      _push(`</div></th><th class="px-6 py-3 text-left border border-gray-400 bg-gray-100"><div class="space-y-2"><div class="flex items-center space-x-2"><span class="text-xs font-medium text-gray-700 uppercase tracking-wider">R\xE9f\xE9rence</span><div class="flex flex-col items-center">`);
      if (unref(sortColumn) !== "office" || unref(sortDirection) === "desc") {
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-chevron-up",
          class: ["w-3 h-3 text-gray-500 hover:text-gray-700 cursor-pointer", { "text-blue-600": unref(sortColumn) === "office" && unref(sortDirection) === "asc" }],
          onClick: ($event) => sortBy("office")
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(sortColumn) !== "office" || unref(sortDirection) === "asc") {
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-chevron-down",
          class: ["w-3 h-3 text-gray-500 hover:text-gray-700 cursor-pointer", { "text-blue-600": unref(sortColumn) === "office" && unref(sortDirection) === "desc" }],
          onClick: ($event) => sortBy("office")
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UButton, {
        onClick: ($event) => openTextFilterMenu($event, "office"),
        variant: "outline",
        size: "sm",
        icon: "i-heroicons-funnel",
        color: unref(textFilters).office ? "primary" : "gray",
        class: "ml-2"
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(filters).office,
        "onUpdate:modelValue": ($event) => unref(filters).office = $event,
        placeholder: "Bureau...",
        size: "xs",
        icon: "i-heroicons-building-office",
        onInput: handleFilter,
        onClick: () => {
        }
      }, null, _parent));
      _push(`</div></th><th class="px-6 py-3 text-left border border-gray-400 bg-gray-100"><div class="space-y-2"><div class="flex items-center space-x-2"><span class="text-xs font-medium text-gray-700 uppercase tracking-wider">Service traitant</span><div class="flex flex-col items-center">`);
      if (unref(sortColumn) !== "age" || unref(sortDirection) === "desc") {
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-chevron-up",
          class: ["w-3 h-3 text-gray-500 hover:text-gray-700 cursor-pointer", { "text-blue-600": unref(sortColumn) === "age" && unref(sortDirection) === "asc" }],
          onClick: ($event) => sortBy("age")
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(sortColumn) !== "age" || unref(sortDirection) === "asc") {
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-chevron-down",
          class: ["w-3 h-3 text-gray-500 hover:text-gray-700 cursor-pointer", { "text-blue-600": unref(sortColumn) === "age" && unref(sortDirection) === "desc" }],
          onClick: ($event) => sortBy("age")
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UButton, {
        onClick: ($event) => openTextFilterMenu($event, "age"),
        variant: "outline",
        size: "sm",
        icon: "i-heroicons-funnel",
        color: unref(textFilters).age ? "primary" : "gray",
        class: "ml-2"
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(filters).age,
        "onUpdate:modelValue": ($event) => unref(filters).age = $event,
        placeholder: "\xC2ge exact...",
        size: "xs",
        icon: "i-heroicons-user",
        onInput: handleFilter,
        onClick: () => {
        }
      }, null, _parent));
      _push(`</div></th><th class="px-6 py-3 text-left border border-gray-400 bg-gray-100"><div class="space-y-2"><div class="flex items-center space-x-2"><span class="text-xs font-medium text-gray-700 uppercase tracking-wider">Date d&#39;Affectation</span><div class="flex flex-col items-center">`);
      if (unref(sortColumn) !== "startDate" || unref(sortDirection) === "desc") {
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-chevron-up",
          class: ["w-3 h-3 text-gray-500 hover:text-gray-700 cursor-pointer", { "text-blue-600": unref(sortColumn) === "startDate" && unref(sortDirection) === "asc" }],
          onClick: ($event) => sortBy("startDate")
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(sortColumn) !== "startDate" || unref(sortDirection) === "asc") {
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-chevron-down",
          class: ["w-3 h-3 text-gray-500 hover:text-gray-700 cursor-pointer", { "text-blue-600": unref(sortColumn) === "startDate" && unref(sortDirection) === "desc" }],
          onClick: ($event) => sortBy("startDate")
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UButton, {
        onClick: ($event) => openTextFilterMenu($event, "startDate"),
        variant: "outline",
        size: "sm",
        icon: "i-heroicons-funnel",
        color: unref(textFilters).startDate ? "primary" : "gray",
        class: "ml-2"
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(filters).startDate,
        "onUpdate:modelValue": ($event) => unref(filters).startDate = $event,
        placeholder: "Date...",
        size: "xs",
        icon: "i-heroicons-calendar",
        onInput: handleFilter,
        onClick: () => {
        }
      }, null, _parent));
      _push(`</div></th><th class="px-6 py-3 text-left border border-gray-400 bg-gray-100"><div class="space-y-2"><div class="flex items-center space-x-2"><span class="text-xs font-medium text-gray-700 uppercase tracking-wider">Statut</span><div class="flex flex-col items-center">`);
      if (unref(sortColumn) !== "startDate" || unref(sortDirection) === "desc") {
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-chevron-up",
          class: ["w-3 h-3 text-gray-500 hover:text-gray-700 cursor-pointer", { "text-blue-600": unref(sortColumn) === "startDate" && unref(sortDirection) === "asc" }],
          onClick: ($event) => sortBy("startDate")
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(sortColumn) !== "startDate" || unref(sortDirection) === "asc") {
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-chevron-down",
          class: ["w-3 h-3 text-gray-500 hover:text-gray-700 cursor-pointer", { "text-blue-600": unref(sortColumn) === "startDate" && unref(sortDirection) === "desc" }],
          onClick: ($event) => sortBy("startDate")
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UButton, {
        onClick: ($event) => openTextFilterMenu($event, "startDate"),
        variant: "outline",
        size: "sm",
        icon: "i-heroicons-funnel",
        color: unref(textFilters).startDate ? "primary" : "gray",
        class: "ml-2"
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(filters).startDate,
        "onUpdate:modelValue": ($event) => unref(filters).startDate = $event,
        placeholder: "Date...",
        size: "xs",
        icon: "i-heroicons-calendar",
        onInput: handleFilter,
        onClick: () => {
        }
      }, null, _parent));
      _push(`</div></th><th class="px-6 py-3 text-left border border-gray-400 bg-gray-100"><div class="space-y-2"><div class="flex items-center space-x-2"><span class="text-xs font-medium text-gray-700 uppercase tracking-wider">Priorit\xE9</span><div class="flex flex-col items-center">`);
      if (unref(sortColumn) !== "startDate" || unref(sortDirection) === "desc") {
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-chevron-up",
          class: ["w-3 h-3 text-gray-500 hover:text-gray-700 cursor-pointer", { "text-blue-600": unref(sortColumn) === "startDate" && unref(sortDirection) === "asc" }],
          onClick: ($event) => sortBy("startDate")
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(sortColumn) !== "startDate" || unref(sortDirection) === "asc") {
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-chevron-down",
          class: ["w-3 h-3 text-gray-500 hover:text-gray-700 cursor-pointer", { "text-blue-600": unref(sortColumn) === "startDate" && unref(sortDirection) === "desc" }],
          onClick: ($event) => sortBy("startDate")
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UButton, {
        onClick: ($event) => openTextFilterMenu($event, "startDate"),
        variant: "outline",
        size: "sm",
        icon: "i-heroicons-funnel",
        color: unref(textFilters).startDate ? "primary" : "gray",
        class: "ml-2"
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(filters).startDate,
        "onUpdate:modelValue": ($event) => unref(filters).startDate = $event,
        placeholder: "Date...",
        size: "xs",
        icon: "i-heroicons-calendar",
        onInput: handleFilter,
        onClick: () => {
        }
      }, null, _parent));
      _push(`</div></th><th class="px-6 py-3 text-right border border-gray-400 bg-gray-100"><span class="text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</span></th></tr></thead><tbody class="bg-white"><!--[-->`);
      ssrRenderList(unref(paginatedData), (item, index) => {
        _push(`<tr class="${ssrRenderClass([{
          "bg-blue-50": unref(selectedRows).includes(item.id),
          "bg-gray-50": index % 2 === 0 && !unref(selectedRows).includes(item.id),
          "bg-white": index % 2 === 1 && !unref(selectedRows).includes(item.id),
          "hover:bg-blue-100": !unref(selectedRows).includes(item.id),
          "hover:bg-blue-200": unref(selectedRows).includes(item.id)
        }, "transition-colors"])}"><td class="px-6 py-4 border border-gray-300"><div class="flex items-center"><div class="flex-shrink-0 h-10 w-10"><img${ssrRenderAttr("src", item.avatar)}${ssrRenderAttr("alt", item.name)} class="h-10 w-10 rounded-full ring-2 ring-gray-200"></div><div class="ml-4"><div class="text-sm font-medium text-gray-900">${ssrInterpolate(item.name)}</div><div class="text-sm text-gray-500">${ssrInterpolate(item.email)}</div></div></div></td><td class="px-6 py-4 border border-gray-300">`);
        _push(ssrRenderComponent(_component_UBadge, {
          color: "blue",
          variant: "soft",
          size: "xs"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(item.position)}`);
            } else {
              return [
                createTextVNode(toDisplayString(item.position), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</td><td class="px-6 py-4 border border-gray-300 text-sm text-gray-900">${ssrInterpolate(item.office)}</td><td class="px-6 py-4 border border-gray-300"><div class="text-sm font-medium text-gray-900">${ssrInterpolate(item.salary)}</div></td><td class="px-6 py-4 border border-gray-300"><div class="flex items-center"><span class="text-sm text-gray-900">${ssrInterpolate(item.age)}</span><span class="ml-2 text-xs text-gray-500">ans</span></div></td><td class="px-6 py-4 border border-gray-300 text-sm text-gray-900">${ssrInterpolate(formatDate(item.startDate))}</td><td class="px-6 py-4 border border-gray-300">`);
        _push(ssrRenderComponent(_component_UCheckbox, {
          "model-value": unref(selectedRows).includes(item.id),
          onChange: ($event) => toggleRowSelection(item.id)
        }, null, _parent));
        _push(`</td><td class="px-6 py-4 border border-gray-300">`);
        _push(ssrRenderComponent(_component_UCheckbox, {
          "model-value": unref(selectedRows).includes(item.id),
          onChange: ($event) => toggleRowSelection(item.id)
        }, null, _parent));
        _push(`</td><td class="px-6 py-4 border border-gray-300 text-right text-sm font-medium"><div class="flex justify-end space-x-2">`);
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
      if (unref(paginatedData).length === 0) {
        _push(`<div class="text-center py-12">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-inbox",
          class: "mx-auto h-12 w-12 text-gray-400"
        }, null, _parent));
        _push(`<h3 class="mt-2 text-sm font-medium text-gray-900">Aucun r\xE9sultat</h3><p class="mt-1 text-sm text-gray-500">Essayez d&#39;ajuster vos filtres ou votre recherche.</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="border-t border-gray-200 px-6 py-4 bg-gray-50"><div class="flex items-center justify-between"><div class="text-sm text-gray-700"> Affichage de ${ssrInterpolate(unref(startIndex) + 1)} \xE0 ${ssrInterpolate(unref(endIndex))} sur ${ssrInterpolate(unref(filteredData).length)} r\xE9sultats `);
      if (unref(filteredData).length !== archiveData.length) {
        _push(`<span class="ml-2"> (${ssrInterpolate(archiveData.length)} total) </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex items-center space-x-2">`);
      _push(ssrRenderComponent(_component_UButton, {
        disabled: unref(currentPage) === 1,
        onClick: ($event) => currentPage.value--,
        variant: "outline",
        size: "sm",
        icon: "i-heroicons-chevron-left"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Pr\xE9c\xE9dent `);
          } else {
            return [
              createTextVNode(" Pr\xE9c\xE9dent ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex space-x-1"><!--[-->`);
      ssrRenderList(unref(visiblePages), (page) => {
        _push(ssrRenderComponent(_component_UButton, {
          key: page,
          onClick: ($event) => currentPage.value = page,
          variant: unref(currentPage) === page ? "solid" : "outline",
          size: "sm",
          color: unref(currentPage) === page ? "primary" : "gray"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(page)}`);
            } else {
              return [
                createTextVNode(toDisplayString(page), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div>`);
      _push(ssrRenderComponent(_component_UButton, {
        disabled: unref(currentPage) === unref(totalPages),
        onClick: ($event) => currentPage.value++,
        variant: "outline",
        size: "sm",
        icon: "i-heroicons-chevron-right",
        trailing: ""
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Suivant `);
          } else {
            return [
              createTextVNode(" Suivant ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></div></div></div>`);
      if (unref(textFilterMenu).show) {
        _push(`<div class="fixed z-50 bg-white border border-gray-300 rounded-lg shadow-lg min-w-80 max-h-96" style="${ssrRenderStyle({ left: unref(textFilterMenu).x + "px", top: unref(textFilterMenu).y + "px" })}"><div class="p-4"><div class="flex items-center justify-between mb-3"><h3 class="text-sm font-medium text-gray-900"> Filtre - ${ssrInterpolate(getColumnLabel(unref(textFilterMenu).column))}</h3><div class="flex items-center space-x-2">`);
        if (getSelectedCount(unref(textFilterMenu).column) > 0) {
          _push(ssrRenderComponent(_component_UBadge, {
            color: "blue",
            variant: "solid",
            size: "xs"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(getSelectedCount(unref(textFilterMenu).column))}`);
              } else {
                return [
                  createTextVNode(toDisplayString(getSelectedCount(unref(textFilterMenu).column)), 1)
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
          modelValue: unref(filterSearch),
          "onUpdate:modelValue": ($event) => isRef(filterSearch) ? filterSearch.value = $event : null,
          placeholder: "Search...",
          icon: "i-heroicons-magnifying-glass",
          size: "sm",
          class: "mb-3"
        }, null, _parent));
        _push(`<div class="max-h-48 overflow-y-auto border border-gray-200 rounded"><div class="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer border-b">`);
        _push(ssrRenderComponent(_component_UCheckbox, {
          "model-value": isAllSelected(unref(textFilterMenu).column),
          indeterminate: isIndeterminate(unref(textFilterMenu).column),
          onChange: ($event) => toggleSelectAllOptions(unref(textFilterMenu).column),
          size: "sm",
          class: "mr-3"
        }, null, _parent));
        _push(`<span class="text-sm text-gray-700">(Select All)</span></div><!--[-->`);
        ssrRenderList(getFilteredOptions(unref(textFilterMenu).column), (option) => {
          _push(`<div class="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">`);
          _push(ssrRenderComponent(_component_UCheckbox, {
            "model-value": isSelected(unref(textFilterMenu).column, option.value),
            onChange: ($event) => toggleOption(unref(textFilterMenu).column, option.value),
            size: "sm",
            class: "mr-3"
          }, null, _parent));
          _push(`<div class="flex items-center flex-1">`);
          if (getColumnIcon(unref(textFilterMenu).column, option.value)) {
            _push(ssrRenderComponent(_component_Icon, {
              name: getColumnIcon(unref(textFilterMenu).column, option.value),
              class: "w-4 h-4 mr-2"
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`<span class="text-sm text-gray-700">${ssrInterpolate(option.label)}</span></div></div>`);
        });
        _push(`<!--]--></div><div class="flex justify-between items-center mt-3 pt-3 border-t border-gray-200"><span class="text-xs text-gray-500">${ssrInterpolate(getSelectedCount(unref(textFilterMenu).column))} s\xE9lectionn\xE9(s) </span>`);
        if (getSelectedCount(unref(textFilterMenu).column) > 0) {
          _push(ssrRenderComponent(_component_UButton, {
            onClick: ($event) => resetMultiSelectFilter(unref(textFilterMenu).column),
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
      if (unref(textFilterMenu).show) {
        _push(`<div class="fixed inset-0 z-40"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/orders/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CYRdgF5S.mjs.map
