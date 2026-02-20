import { _ as _sfc_main$1, a as __nuxt_component_1 } from './Sidebar-CRMV_daG.mjs';
import __nuxt_component_0 from './index-DJmPz9HS.mjs';
import { ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { u as useHead } from './server.mjs';
import './Button-D4Pv8nAk.mjs';
import './Link-SQZY3OU3.mjs';
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
import './ohash.D__AXeF1-DqcdtjQw.mjs';
import './link-Bz3Wc5MF.mjs';
import './Icon-BEWG_Jy9.mjs';
import './tooltip-lourJnw0.mjs';
import './useButtonGroup-DPIFBtCe.mjs';
import './button-Bz5rwL6o.mjs';
import './Modal-BXvFVpvj.mjs';
import './transition-CRUjHQk-.mjs';
import './portal-Bh2KnJSN.mjs';
import './focus-management-CclPs0xY.mjs';
import './keyboard-BCt0ZeLv.mjs';
import './use-outside-click-BqFFeIfQ.mjs';
import './hidden-e5tlhUcy.mjs';
import './active-element-history-Cer4cSOw.mjs';
import './micro-task-B6uncIso.mjs';
import './open-closed-DaveoKA1.mjs';
import './description-BSAkQQqZ.mjs';
import './interval-B7_Jhm6S.mjs';
import 'vue-router';
import 'pinia';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main = {
  __name: "settings",
  __ssrInlineRender: true,
  setup(__props) {
    const desktopSidebarOpen = ref(true);
    const activeTab = ref("general");
    const tabs = [
      { id: "general", name: "General", icon: "heroicons:cog-6-tooth" },
      { id: "security", name: "Security", icon: "heroicons:shield-check" },
      { id: "notifications", name: "Notifications", icon: "heroicons:bell" },
      { id: "api", name: "API", icon: "heroicons:server" },
      { id: "desktop-sidebar-toggle", name: "Desktop Sidebar Toggle", icon: "heroicons:menu-alt-2" }
    ];
    const settings = ref({
      appName: "Sagar Revolution",
      defaultLanguage: "en",
      maintenanceMode: false,
      sessionTimeout: 30,
      twoFactorAuth: false,
      passwordPolicy: true,
      emailNotifications: true,
      pushNotifications: false,
      smsNotifications: false,
      apiEndpoint: "https://api.example.com",
      apiKey: "sk-1234567890abcdef",
      rateLimit: 100
    });
    useHead({
      title: "Settings - Sagar Revolution"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Header = _sfc_main$1;
      const _component_Sidebar = __nuxt_component_1;
      const _component_Icon = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_Header, null, null, _parent));
      _push(`<div class="flex pt-16">`);
      _push(ssrRenderComponent(_component_Sidebar, null, null, _parent));
      _push(`<main class="${ssrRenderClass([{ "lg:ml-64": desktopSidebarOpen.value }, "flex-1 p-6 transition-all duration-300"])}"><div class="max-w-4xl mx-auto"><div class="mb-6"><h1 class="text-3xl font-bold text-gray-900">Settings</h1><p class="text-gray-600 mt-1">Manage your application settings and preferences</p></div><div class="bg-white rounded-lg shadow-sm border border-gray-200"><div class="border-b border-gray-200"><nav class="flex -mb-px"><!--[-->`);
      ssrRenderList(tabs, (tab) => {
        _push(`<button class="${ssrRenderClass([
          "px-6 py-3 text-sm font-medium border-b-2 transition-colors",
          activeTab.value === tab.id ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
        ])}">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: tab.icon,
          class: "h-4 w-4 mr-2"
        }, null, _parent));
        _push(` ${ssrInterpolate(tab.name)}</button>`);
      });
      _push(`<!--]--></nav></div><div class="p-6">`);
      if (activeTab.value === "general") {
        _push(`<div class="space-y-6"><div><h3 class="text-lg font-medium text-gray-900 mb-4">Application Settings</h3><div class="space-y-4"><div><label class="block text-sm font-medium text-gray-700 mb-1">Application Name</label><input type="text"${ssrRenderAttr("value", settings.value.appName)} class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Default Language</label><select class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="en"${ssrIncludeBooleanAttr(Array.isArray(settings.value.defaultLanguage) ? ssrLooseContain(settings.value.defaultLanguage, "en") : ssrLooseEqual(settings.value.defaultLanguage, "en")) ? " selected" : ""}>English</option><option value="fr"${ssrIncludeBooleanAttr(Array.isArray(settings.value.defaultLanguage) ? ssrLooseContain(settings.value.defaultLanguage, "fr") : ssrLooseEqual(settings.value.defaultLanguage, "fr")) ? " selected" : ""}>Fran\xE7ais</option><option value="es"${ssrIncludeBooleanAttr(Array.isArray(settings.value.defaultLanguage) ? ssrLooseContain(settings.value.defaultLanguage, "es") : ssrLooseEqual(settings.value.defaultLanguage, "es")) ? " selected" : ""}>Espa\xF1ol</option></select></div><div><label class="flex items-center"><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(settings.value.maintenanceMode) ? ssrLooseContain(settings.value.maintenanceMode, null) : settings.value.maintenanceMode) ? " checked" : ""} class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"><span class="ml-2 text-sm text-gray-700">Enable Maintenance Mode</span></label></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (activeTab.value === "security") {
        _push(`<div class="space-y-6"><div><h3 class="text-lg font-medium text-gray-900 mb-4">Security Configuration</h3><div class="space-y-4"><div><label class="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label><input type="number"${ssrRenderAttr("value", settings.value.sessionTimeout)} class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></div><div><label class="flex items-center"><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(settings.value.twoFactorAuth) ? ssrLooseContain(settings.value.twoFactorAuth, null) : settings.value.twoFactorAuth) ? " checked" : ""} class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"><span class="ml-2 text-sm text-gray-700">Enable Two-Factor Authentication</span></label></div><div><label class="flex items-center"><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(settings.value.passwordPolicy) ? ssrLooseContain(settings.value.passwordPolicy, null) : settings.value.passwordPolicy) ? " checked" : ""} class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"><span class="ml-2 text-sm text-gray-700">Enforce Strong Password Policy</span></label></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (activeTab.value === "notifications") {
        _push(`<div class="space-y-6"><div><h3 class="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3><div class="space-y-4"><div><label class="flex items-center"><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(settings.value.emailNotifications) ? ssrLooseContain(settings.value.emailNotifications, null) : settings.value.emailNotifications) ? " checked" : ""} class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"><span class="ml-2 text-sm text-gray-700">Email Notifications</span></label></div><div><label class="flex items-center"><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(settings.value.pushNotifications) ? ssrLooseContain(settings.value.pushNotifications, null) : settings.value.pushNotifications) ? " checked" : ""} class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"><span class="ml-2 text-sm text-gray-700">Push Notifications</span></label></div><div><label class="flex items-center"><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(settings.value.smsNotifications) ? ssrLooseContain(settings.value.smsNotifications, null) : settings.value.smsNotifications) ? " checked" : ""} class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"><span class="ml-2 text-sm text-gray-700">SMS Notifications</span></label></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (activeTab.value === "api") {
        _push(`<div class="space-y-6"><div><h3 class="text-lg font-medium text-gray-900 mb-4">API Configuration</h3><div class="space-y-4"><div><label class="block text-sm font-medium text-gray-700 mb-1">API Endpoint</label><input type="url"${ssrRenderAttr("value", settings.value.apiEndpoint)} class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-1">API Key</label><div class="flex space-x-2"><input type="password"${ssrRenderAttr("value", settings.value.apiKey)} class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"><button class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"> Regenerate </button></div></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Rate Limit (requests/minute)</label><input type="number"${ssrRenderAttr("value", settings.value.rateLimit)} class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-4"><button class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"> Reset to Default </button><button class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"> Save Settings </button></div></div></div></main></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/settings.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=settings-DGnnKMah.mjs.map
