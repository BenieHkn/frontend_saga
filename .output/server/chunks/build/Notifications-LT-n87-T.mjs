import __nuxt_component_0 from './Notification-DWuJzMBT.mjs';
import { defineComponent, mergeProps, createSlots, renderList, withCtx, renderSlot, toRef, computed, useSSRContext } from 'vue';
import { _ as _export_sfc, m as mergeConfig, q as useState, t as twMerge, i as twJoin, j as appConfig } from './server.mjs';
import { u as useUI } from './tooltip-lourJnw0.mjs';
import { u as useToast } from './useToast-VyEsrynn.mjs';
import { ssrRenderTeleport, ssrRenderAttrs, ssrRenderClass, ssrRenderList, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import './Icon-BEWG_Jy9.mjs';
import './index-DJmPz9HS.mjs';
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
import './Avatar-BE6on_fb.mjs';
import './Button-D4Pv8nAk.mjs';
import './Link-SQZY3OU3.mjs';
import './nuxt-link-aS4hYwbM.mjs';
import './ohash.D__AXeF1-DqcdtjQw.mjs';
import './link-Bz3Wc5MF.mjs';
import './useButtonGroup-DPIFBtCe.mjs';
import './button-Bz5rwL6o.mjs';
import './index-D7xvw7QP.mjs';
import './index-BLXEZ1Ia.mjs';

const notifications = {
  wrapper: "fixed flex flex-col justify-end z-[55]",
  position: "bottom-0 end-0",
  width: "w-full sm:w-96",
  container: "px-4 sm:px-6 py-6 space-y-3 overflow-y-auto"
};
const config = mergeConfig(appConfig.ui.strategy, appConfig.ui.notifications, notifications);
const _sfc_main = defineComponent({
  components: {
    UNotification: __nuxt_component_0
  },
  inheritAttrs: false,
  props: {
    class: {
      type: [String, Object, Array],
      default: () => ""
    },
    ui: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const { ui, attrs } = useUI("notifications", toRef(props, "ui"), config);
    const toast = useToast();
    const notifications2 = useState("notifications", () => []);
    const wrapperClass = computed(() => {
      return twMerge(twJoin(
        ui.value.wrapper,
        ui.value.position,
        ui.value.width
      ), props.class);
    });
    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      toast,
      notifications: notifications2,
      wrapperClass
    };
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_UNotification = __nuxt_component_0;
  ssrRenderTeleport(_push, (_push2) => {
    if (_ctx.notifications.length) {
      _push2(`<div${ssrRenderAttrs(mergeProps({
        class: _ctx.wrapperClass,
        role: "region"
      }, _ctx.attrs))}><div class="${ssrRenderClass(_ctx.ui.container)}"><!--[-->`);
      ssrRenderList(_ctx.notifications, (notification) => {
        _push2(`<div>`);
        _push2(ssrRenderComponent(_component_UNotification, mergeProps({ ref_for: true }, notification, {
          class: notification.click && "cursor-pointer",
          onClick: ($event) => notification.click && notification.click(notification),
          onClose: ($event) => _ctx.toast.remove(notification.id)
        }), createSlots({ _: 2 }, [
          renderList(_ctx.$slots, (_, name) => {
            return {
              name,
              fn: withCtx((slotData, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  ssrRenderSlot(_ctx.$slots, name, mergeProps({ ref_for: true }, slotData), null, _push3, _parent2, _scopeId);
                } else {
                  return [
                    renderSlot(_ctx.$slots, name, mergeProps({ ref_for: true }, slotData))
                  ];
                }
              })
            };
          })
        ]), _parent));
        _push2(`</div>`);
      });
      _push2(`<!--]--></div></div>`);
    } else {
      _push2(`<!---->`);
    }
  }, "body", false, _parent);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/.pnpm/@nuxt+ui@2.22.3_axios@1.13._bfe54df56123b11f40786e0ab114d592/node_modules/@nuxt/ui/dist/runtime/components/overlays/Notifications.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { __nuxt_component_2 as default };
//# sourceMappingURL=Notifications-LT-n87-T.mjs.map
