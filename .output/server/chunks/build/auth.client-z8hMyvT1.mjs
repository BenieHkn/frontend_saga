import { u as useAuth } from './useAuth-Cv4D9cxh.mjs';
import { w as defineNuxtRouteMiddleware, n as navigateTo } from './server.mjs';
import 'vue';
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
import 'vue/server-renderer';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const auth_client = defineNuxtRouteMiddleware((to) => {
  useAuth();
  const publicRoutes = ["/connexion", "/connexion/mot_de_passe_oublie", "/choose-profile"];
  if (publicRoutes.includes(to.path)) return;
  {
    return navigateTo("/connexion");
  }
});

export { auth_client as default };
//# sourceMappingURL=auth.client-z8hMyvT1.mjs.map
