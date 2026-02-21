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

const login_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e;
  const config = useRuntimeConfig();
  try {
    const body = await readBody(event);
    if (!body.email || !body.password) {
      return {
        success: false,
        message: "Email et mot de passe requis"
      };
    }
    let response;
    try {
      response = await $fetch(`${config.public.apiBase}/login`, {
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      });
    } catch (apiError) {
      console.error("Erreur API Laravel:", apiError.data || apiError.message);
      return {
        success: false,
        message: ((_a = apiError.data) == null ? void 0 : _a.message) || "Identifiants invalides"
      };
    }
    if (!response.token) {
      return {
        success: false,
        message: "Token non re\xE7u de l'API"
      };
    }
    if (!response.user) {
      return {
        success: false,
        message: "Donn\xE9es utilisateur non re\xE7ues de l'API"
      };
    }
    const main_entite = ((_c = (_b = response.user.entite_users) == null ? void 0 : _b[0]) == null ? void 0 : _c.entite) || null;
    const entite_user = ((_d = response.user.entite_users) == null ? void 0 : _d[0]) || null;
    const entites = ((_e = response.user.entite_users) == null ? void 0 : _e.map((eu) => {
      var _a2, _b2, _c2, _d2, _e2, _f, _g;
      return {
        id: (_a2 = eu.entite) == null ? void 0 : _a2.id,
        code: (_b2 = eu.entite) == null ? void 0 : _b2.code,
        libelle: (_c2 = eu.entite) == null ? void 0 : _c2.libelle,
        fonction: (_d2 = eu.entite) == null ? void 0 : _d2.fonction,
        is_critique: (_e2 = eu.entite) == null ? void 0 : _e2.is_critique,
        parent_entite_id: (_f = eu.entite) == null ? void 0 : _f.parent_entite_id,
        parent_libelle: (_g = eu.entite) == null ? void 0 : _g.parent_libelle,
        entite_user_id: eu.id,
        actif: eu.actif,
        is_interim: eu.is_interim,
        is_responsable: eu.is_responsable,
        date_debut: eu.date_debut,
        date_fin: eu.date_fin
      };
    })) || [];
    console.log("entites:", entites);
    const formattedUser = {
      id: response.user.id,
      nom: response.user.nom,
      prenom: response.user.prenom,
      email: response.user.email,
      is_superadmin: response.user.is_superadmin,
      matricule: response.user.matricule,
      statut: response.user.statut,
      telephone: response.user.telephone,
      prise_service: response.user.prise_service
    };
    console.log("formattedUser:", formattedUser);
    console.log("main_entite:", main_entite);
    console.log("entites:", entites);
    console.log("entite_user:", entite_user);
    return {
      success: true,
      message: "Connexion r\xE9ussie",
      token: response.token,
      user: formattedUser,
      main_entite,
      entites,
      entite_user
    };
  } catch (error) {
    console.error("Erreur login:", error.message);
    console.error("Erreur login:", error);
    return {
      success: false,
      message: "Erreur serveur lors de la connexion"
    };
  }
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
