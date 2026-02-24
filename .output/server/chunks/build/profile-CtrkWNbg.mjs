import { _ as _sfc_main$1, a as __nuxt_component_1 } from './Sidebar-DuQZxarO.mjs';
import { u as useHead, c as __nuxt_component_0$2 } from './server.mjs';
import { ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import './Modal-EvFvX6Ng.mjs';
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
import './interval-B7_Jhm6S.mjs';
import 'vue-router';
import './useAuth-D9Skuklz.mjs';
import 'pinia';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main = {
  __name: "profile",
  __ssrInlineRender: true,
  setup(__props) {
    const desktopSidebarOpen = ref(true);
    const profile = ref({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      language: "en",
      timezone: "EST",
      emailNotifications: true,
      pushNotifications: false
    });
    useHead({
      title: "Profile - Sagar Revolution"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Header = _sfc_main$1;
      const _component_Sidebar = __nuxt_component_1;
      const _component_Icon = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_Header, null, null, _parent));
      _push(`<div class="flex pt-16">`);
      _push(ssrRenderComponent(_component_Sidebar, null, null, _parent));
      _push(`<main class="${ssrRenderClass([{ "lg:ml-64": desktopSidebarOpen.value }, "flex-1 p-6 transition-all duration-300"])}"><div class="max-w-4xl mx-auto"><div class="mb-6"><h1 class="text-3xl font-bold text-gray-900">Profile</h1><p class="text-gray-600 mt-1">Manage your personal information and preferences</p></div><div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"><div class="flex items-center space-x-6"><div class="relative"><img class="h-24 w-24 rounded-full" src="https://picsum.photos/seed/user1/200/200.jpg" alt="Profile"><button class="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "heroicons:pencil",
        class: "h-4 w-4"
      }, null, _parent));
      _push(`</button></div><div><h2 class="text-2xl font-bold text-gray-900">John Doe</h2><p class="text-gray-600">john.doe@example.com</p><div class="flex items-center mt-2 space-x-4"><span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"> Active </span><span class="text-sm text-gray-500">Member since January 2024</span></div></div></div></div><div class="grid grid-cols-1 lg:grid-cols-2 gap-6"><div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"><h3 class="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3><div class="space-y-4"><div><label class="block text-sm font-medium text-gray-700 mb-1">First Name</label><input type="text"${ssrRenderAttr("value", profile.value.firstName)} class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label><input type="text"${ssrRenderAttr("value", profile.value.lastName)} class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email"${ssrRenderAttr("value", profile.value.email)} class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Phone</label><input type="tel"${ssrRenderAttr("value", profile.value.phone)} class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></div></div></div><div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"><h3 class="text-lg font-semibold text-gray-900 mb-4">Preferences</h3><div class="space-y-4"><div><label class="block text-sm font-medium text-gray-700 mb-1">Language</label><select class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="en"${ssrIncludeBooleanAttr(Array.isArray(profile.value.language) ? ssrLooseContain(profile.value.language, "en") : ssrLooseEqual(profile.value.language, "en")) ? " selected" : ""}>English</option><option value="fr"${ssrIncludeBooleanAttr(Array.isArray(profile.value.language) ? ssrLooseContain(profile.value.language, "fr") : ssrLooseEqual(profile.value.language, "fr")) ? " selected" : ""}>Fran\xE7ais</option><option value="es"${ssrIncludeBooleanAttr(Array.isArray(profile.value.language) ? ssrLooseContain(profile.value.language, "es") : ssrLooseEqual(profile.value.language, "es")) ? " selected" : ""}>Espa\xF1ol</option></select></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Timezone</label><select class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="UTC"${ssrIncludeBooleanAttr(Array.isArray(profile.value.timezone) ? ssrLooseContain(profile.value.timezone, "UTC") : ssrLooseEqual(profile.value.timezone, "UTC")) ? " selected" : ""}>UTC</option><option value="EST"${ssrIncludeBooleanAttr(Array.isArray(profile.value.timezone) ? ssrLooseContain(profile.value.timezone, "EST") : ssrLooseEqual(profile.value.timezone, "EST")) ? " selected" : ""}>Eastern Time</option><option value="PST"${ssrIncludeBooleanAttr(Array.isArray(profile.value.timezone) ? ssrLooseContain(profile.value.timezone, "PST") : ssrLooseEqual(profile.value.timezone, "PST")) ? " selected" : ""}>Pacific Time</option></select></div><div><label class="flex items-center"><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(profile.value.emailNotifications) ? ssrLooseContain(profile.value.emailNotifications, null) : profile.value.emailNotifications) ? " checked" : ""} class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"><span class="ml-2 text-sm text-gray-700">Email notifications</span></label></div><div><label class="flex items-center"><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(profile.value.pushNotifications) ? ssrLooseContain(profile.value.pushNotifications, null) : profile.value.pushNotifications) ? " checked" : ""} class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"><span class="ml-2 text-sm text-gray-700">Push notifications</span></label></div></div></div></div><div class="mt-6 flex justify-end space-x-4"><button class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"> Cancel </button><button class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"> Save Changes </button></div></div></main></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/profile.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=profile-CtrkWNbg.mjs.map
