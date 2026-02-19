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

const changePassword_post = defineEventHandler(async (event) => {
  var _a;
  const config = useRuntimeConfig();
  const body = await readBody(event);
  const token = body == null ? void 0 : body.token;
  const email = body == null ? void 0 : body.email;
  const password = body == null ? void 0 : body.password;
  const password_confirmation = body == null ? void 0 : body.password_confirmation;
  if (!token || !email) {
    return { success: false, message: "Token ou email manquant." };
  }
  if (password !== password_confirmation) {
    return { success: false, message: "Les mots de passe ne correspondent pas." };
  }
  if (!password || password.length < 6) {
    return { success: false, message: "Mot de passe trop court." };
  }
  try {
    const response = await $fetch(`${config.public.apiBase}/reset-password`, {
      method: "POST",
      body: {
        email,
        token,
        password,
        password_confirmation
      }
    });
    return { success: true, data: response };
  } catch (e) {
    console.error("Erreur API Laravel:", e);
    return { success: false, message: ((_a = e.data) == null ? void 0 : _a.message) || "Erreur lors de la modification." };
  }
});

export { changePassword_post as default };
//# sourceMappingURL=change-password.post.mjs.map
