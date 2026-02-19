import { c as defineEventHandler, u as useRuntimeConfig, r as readBody } from '../../../_/nitro.mjs';
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

const forgot_post = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);
  const email = body == null ? void 0 : body.email;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, message: "Email invalide." };
  }
  try {
    const res = await $fetch(`${config.public.apiBase}/forgot-password`, {
      method: "POST",
      body: { email },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
    if (res.success || res.status === "success") {
      return { success: true };
    } else {
      return { success: false, message: res.message || "Erreur lors de la demande." };
    }
  } catch (e) {
    return { success: false, message: "Erreur lors de l'envoi de l'email." };
  }
});

export { forgot_post as default };
//# sourceMappingURL=forgot.post.mjs.map
