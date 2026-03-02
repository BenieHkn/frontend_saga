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
  var _a, _b, _c, _d, _e, _f, _g, _h;
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
    const entitesActives = ((_b = response.user.entite_users) == null ? void 0 : _b.filter((eu) => eu.actif)) || [];
    const isSuperAdmin = ((_c = response.user) == null ? void 0 : _c.is_superadmin) === true;
    const main_entite = entitesActives.length === 1 ? ((_d = entitesActives[0]) == null ? void 0 : _d.entite) || null : null;
    const entite_user = entitesActives.length === 1 ? entitesActives[0] || null : null;
    const entites = ((_e = response.user.entite_users) == null ? void 0 : _e.map((eu) => {
      var _a2, _b2, _c2, _d2, _e2, _f2, _g2;
      return {
        id: (_a2 = eu.entite) == null ? void 0 : _a2.id,
        code: (_b2 = eu.entite) == null ? void 0 : _b2.code,
        libelle: (_c2 = eu.entite) == null ? void 0 : _c2.libelle,
        fonction: (_d2 = eu.entite) == null ? void 0 : _d2.fonction,
        is_critique: (_e2 = eu.entite) == null ? void 0 : _e2.is_critique,
        parent_entite_id: (_f2 = eu.entite) == null ? void 0 : _f2.parent_entite_id,
        parent_libelle: (_g2 = eu.entite) == null ? void 0 : _g2.parent_libelle,
        entite_user_id: eu.id,
        actif: eu.actif,
        is_interim: eu.is_interim,
        is_responsable: eu.is_responsable,
        date_debut: eu.date_debut,
        date_fin: eu.date_fin
      };
    })) || [];
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
    const shouldIncludeRoleAndPermissions = isSuperAdmin || entitesActives.length === 1;
    return {
      success: true,
      message: "Connexion r\xE9ussie",
      token: response.token,
      user: formattedUser,
      main_entite,
      entites,
      entite_user,
      role: shouldIncludeRoleAndPermissions ? (_f = response.role) != null ? _f : null : null,
      permissions: shouldIncludeRoleAndPermissions ? (_g = response.permissions) != null ? _g : {} : null,
      directeur_entite_user_id: (_h = response.directeur_entite_user_id) != null ? _h : null
    };
  } catch (error) {
    console.error("Erreur login:", error.message);
    return {
      success: false,
      message: "Erreur serveur lors de la connexion"
    };
  }
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
