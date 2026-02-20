import { c as defineEventHandler, u as useRuntimeConfig, g as getHeader, r as readBody } from '../../../_/nitro.mjs';
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

const courier_arrive_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  const config = useRuntimeConfig();
  const authToken = getHeader(event, "authorization");
  try {
    const body = await readBody(event);
    console.log("\u{1F4E8} Type re\xE7u:", (_a = body == null ? void 0 : body.constructor) == null ? void 0 : _a.name);
    console.log("\u{1F4E8} Contenu du body:", body);
    let formDataToSend;
    if (body instanceof FormData) {
      formDataToSend = body;
      console.log("\u2705 FormData re\xE7u directement");
    } else if (typeof body === "object" && body !== null) {
      console.log("\u{1F504} Reconstruction FormData depuis objet");
      formDataToSend = new FormData();
      for (const [key, value] of Object.entries(body)) {
        if (value !== null && value !== void 0) {
          if (value instanceof File || value instanceof Blob) {
            formDataToSend.append(key, value);
            console.log(`  \u2705 ${key}: File/Blob`);
          } else if (typeof value === "object") {
            console.log(`  \u26A0\uFE0F ${key}: Objet ignor\xE9`);
          } else {
            formDataToSend.append(key, String(value));
            console.log(`  \u2705 ${key}: ${value}`);
          }
        }
      }
    } else {
      formDataToSend = body;
    }
    console.log("\u{1F4E4} Envoi vers Laravel...");
    const response = await $fetch(`${config.laravelApiUrl}/courriers-arrives`, {
      method: "POST",
      headers: {
        Authorization: authToken
        // ❌ NE PAS ajouter Content-Type - FormData gère ça
      },
      body: formDataToSend
    });
    console.log("\u2705 R\xE9ponse Laravel:", response);
    return {
      success: true,
      data: response.data || response,
      message: response.message || "Succ\xE8s"
    };
  } catch (error) {
    console.error("\u274C Erreur compl\xE8te:");
    console.error("Status:", error.status);
    console.error("Message:", error.message);
    console.error("Erreurs Laravel:", (_b = error.data) == null ? void 0 : _b.errors);
    const validationErrors = ((_c = error.data) == null ? void 0 : _c.errors) || {};
    const errorMessages = Object.entries(validationErrors).map(([field, messages]) => {
      const msgs = Array.isArray(messages) ? messages : [messages];
      return `${field}: ${msgs.join(", ")}`;
    }).join("\n");
    console.error("Erreurs format\xE9es:", errorMessages);
    return {
      success: false,
      message: ((_d = error.data) == null ? void 0 : _d.message) || "Erreur lors de l'enregistrement",
      validationErrors,
      errorMessages,
      statusCode: error.status || 500
    };
  }
});

export { courier_arrive_post as default };
//# sourceMappingURL=courier_arrive.post.mjs.map
