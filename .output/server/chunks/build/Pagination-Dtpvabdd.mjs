import { _ as _export_sfc, g as __nuxt_component_2$1, d as __nuxt_component_1 } from './server.mjs';
import { mergeProps, computed, unref, withCtx, createTextVNode, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import __nuxt_component_4 from './Select-C_BWMUVV.mjs';

const _sfc_main$1 = {
  __name: "SortIcon",
  __ssrInlineRender: true,
  props: {
    column: {
      type: String,
      required: true
    },
    sortColumn: {
      type: String,
      default: null
    },
    sortDirection: {
      type: String,
      default: "asc"
    }
  },
  emits: ["sort"],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = __nuxt_component_2$1;
      _push(`<button${ssrRenderAttrs(mergeProps({
        type: "button",
        class: "pointer-events-auto flex flex-col items-center justify-center w-4"
      }, _attrs))}>`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-heroicons-chevron-up",
        class: ["w-3 h-3", {
          "text-primary": __props.sortColumn === __props.column && __props.sortDirection === "desc",
          "text-gray-300": __props.sortColumn !== __props.column
        }]
      }, null, _parent));
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-heroicons-chevron-down",
        class: ["w-3 h-3", {
          "text-primary": __props.sortColumn === __props.column && __props.sortDirection === "asc",
          "text-gray-300": __props.sortColumn !== __props.column
        }]
      }, null, _parent));
      _push(`</button>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SortIcon.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "Pagination",
  __ssrInlineRender: true,
  props: {
    modelValue: {
      type: Number,
      default: 1
    },
    totalItems: {
      type: Number,
      required: true
    },
    totalItemsWithoutFilter: {
      type: Number,
      default: 0
    },
    itemsPerPage: {
      type: Number,
      default: 10
    },
    maxVisiblePages: {
      type: Number,
      default: 5
    }
  },
  emits: ["update:modelValue", "update:itemsPerPage"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const itemsPerPageOptions = [5, 10, 25, 50, 100];
    const currentPage = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value)
    });
    const totalPages = computed(
      () => Math.ceil(props.totalItems / props.itemsPerPage)
    );
    const startIndex = computed(() => (currentPage.value - 1) * props.itemsPerPage);
    const endIndex = computed(
      () => Math.min(startIndex.value + props.itemsPerPage, props.totalItems)
    );
    const visiblePages = computed(() => {
      const delta = Math.floor(props.maxVisiblePages / 2);
      const range = [];
      let start = Math.max(1, currentPage.value - delta);
      let end = Math.min(totalPages.value, currentPage.value + delta);
      if (end - start + 1 < props.maxVisiblePages) {
        if (start === 1) {
          end = Math.min(totalPages.value, start + props.maxVisiblePages - 1);
        } else if (end === totalPages.value) {
          start = Math.max(1, end - props.maxVisiblePages + 1);
        }
      }
      for (let i = start; i <= end; i++) {
        range.push(i);
      }
      return range;
    });
    const showFirstPage = computed(() => {
      return props.totalPages > 1 && !visiblePages.value.includes(1);
    });
    const showLastPage = computed(() => {
      return props.totalPages > 1 && !visiblePages.value.includes(props.totalPages);
    });
    const showStartDots = computed(() => {
      return showFirstPage.value && visiblePages.value[0] > 2;
    });
    const showEndDots = computed(() => {
      return showLastPage.value && visiblePages.value[visiblePages.value.length - 1] < props.totalPages - 1;
    });
    const goToPage = (page) => {
      if (page !== currentPage.value && page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
      }
    };
    const goToPreviousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value = currentPage.value - 1;
      }
    };
    const goToNextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value = currentPage.value + 1;
      }
    };
    const handleItemsPerPageChange = (newValue) => {
      emit("update:itemsPerPage", newValue);
      currentPage.value = 1;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = __nuxt_component_1;
      const _component_USelect = __nuxt_component_4;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200" }, _attrs))} data-v-db77a80a><div class="text-sm text-gray-700" data-v-db77a80a> Affichage de ${ssrInterpolate(unref(startIndex) + 1)} \xE0 ${ssrInterpolate(unref(endIndex))} sur ${ssrInterpolate(__props.totalItems)} r\xE9sultats `);
      if (__props.totalItems !== __props.totalItemsWithoutFilter) {
        _push(`<span class="ml-2" data-v-db77a80a> (${ssrInterpolate(__props.totalItemsWithoutFilter)} total) </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex items-center space-x-2" data-v-db77a80a>`);
      _push(ssrRenderComponent(_component_UButton, {
        disabled: unref(currentPage) === 1,
        onClick: goToPreviousPage,
        variant: "outline",
        size: "sm",
        icon: "i-heroicons-chevron-left",
        color: "blue"
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
      _push(`<div class="flex" data-v-db77a80a>`);
      if (unref(showFirstPage)) {
        _push(ssrRenderComponent(_component_UButton, {
          onClick: ($event) => goToPage(1),
          variant: unref(currentPage) === 1 ? "solid" : "outline",
          size: "sm",
          color: unref(currentPage) === 1 ? "blue" : "gray"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="text-white" data-v-db77a80a${_scopeId}>1</span>`);
            } else {
              return [
                createVNode("span", { class: "text-white" }, "1")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(showStartDots)) {
        _push(`<span class="flex items-center px-2 text-gray-500" data-v-db77a80a> ... </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(unref(visiblePages), (page) => {
        _push(ssrRenderComponent(_component_UButton, {
          key: page,
          onClick: ($event) => goToPage(page),
          variant: unref(currentPage) === page ? "solid" : "outline",
          size: "sm",
          color: unref(currentPage) === page ? "blue" : "gray",
          ui: { base: "min-w-[2.5rem]" }
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
      _push(`<!--]-->`);
      if (unref(showEndDots)) {
        _push(`<span class="flex items-center px-2 text-gray-500" data-v-db77a80a> ... </span>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(showLastPage)) {
        _push(ssrRenderComponent(_component_UButton, {
          onClick: ($event) => goToPage(unref(totalPages)),
          variant: unref(currentPage) === unref(totalPages) ? "solid" : "outline",
          size: "sm",
          color: unref(currentPage) === unref(totalPages) ? "blue" : "gray",
          ui: { base: "min-w-[2.5rem]" }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(totalPages))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(totalPages)), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UButton, {
        disabled: unref(currentPage) === unref(totalPages),
        onClick: goToNextPage,
        variant: "outline",
        size: "sm",
        icon: "i-heroicons-chevron-right",
        trailing: "",
        ui: { base: "px-3" },
        color: "blue"
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
      _push(`<div class="flex items-center space-x-2 ml-4" data-v-db77a80a><label class="text-sm text-gray-600" data-v-db77a80a>Lignes par page:</label>`);
      _push(ssrRenderComponent(_component_USelect, {
        "model-value": __props.itemsPerPage,
        options: itemsPerPageOptions,
        class: "w-16",
        size: "sm",
        "onUpdate:modelValue": handleItemsPerPageChange
      }, null, _parent));
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Pagination.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Pagination = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-db77a80a"]]);

export { Pagination as P, _sfc_main$1 as _ };
//# sourceMappingURL=Pagination-Dtpvabdd.mjs.map
