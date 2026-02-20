import { c as defineEventHandler, u as useRuntimeConfig, e as getCookie } from '../../../_/nitro.mjs';
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

const profile_get = defineEventHandler(async (event) => {
  var _a;
  const config = useRuntimeConfig();
  try {
    const token = getCookie(event, "auth_token");
    if (!token) {
      return { success: false, message: "Token manquant" };
    }
    const response = await $fetch(`${config.public.apiBase}/user`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json"
      }
    });
    return { success: true, user: response };
  } catch (error) {
    console.error("Erreur r\xE9cup\xE9ration utilisateur:", error);
    return { success: false, message: ((_a = error.data) == null ? void 0 : _a.message) || "Erreur lors de la r\xE9cup\xE9ration des infos" };
  }
});

export { profile_get as default };
//# sourceMappingURL=profile.get.mjs.map
