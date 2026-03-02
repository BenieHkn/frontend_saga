import { reactive, mergeProps, unref, ref, computed, watch, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrRenderAttr, ssrRenderClass, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import Swal from 'sweetalert2';
import { u as useTransfertsStore } from './transferts-8xZaXUA2.mjs';
import { u as useAuth } from './useAuth-D9Skuklz.mjs';
import { _ as _export_sfc, r as useToast, q as useRouter, n as navigateTo, b as useRuntimeConfig, c as __nuxt_component_0$2 } from './server.mjs';
import __nuxt_component_0 from './Checkbox-DFEpnQRu.mjs';
import { T as TransfertsDestinatairesSelectionPanel, a as TransfertsSummaryBar } from './TransfertsSummaryBar-GvPBFkyZ.mjs';
import { s as setInterval } from './interval-B7_Jhm6S.mjs';
import { _ as _sfc_main$3 } from './PageHeader-NxcDUFJW.mjs';
import 'pinia';
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
import 'vue-router';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './useFormGroup-BPckFnLf.mjs';

const useAffectations = () => {
  const affectations = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const { isSecDir, getDirecteurEntiteUserId } = useAuth();
  const config = useRuntimeConfig();
  const getToken = () => {
    return localStorage.getItem("token") || localStorage.getItem("auth_token");
  };
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };
  const formatCourriers = (courriers) => {
    if (!courriers || courriers.length === 0) return "Aucun courrier";
    return courriers.map((c) => {
      var _a;
      return ((_a = c.document) == null ? void 0 : _a.reference) || `Courrier #${c.id}`;
    }).join(", ");
  };
  const formatDestinataires = (destinataires) => {
    if (!destinataires || destinataires.length === 0) return "Aucun destinataire";
    return destinataires.map((d) => {
      var _a, _b, _c, _d;
      const nom = `${((_a = d.user) == null ? void 0 : _a.nom) || ""} ${((_b = d.user) == null ? void 0 : _b.prenom) || ""}`.trim();
      const code = ((_c = d.entite) == null ? void 0 : _c.code) || "";
      const roleOuFonction = d.is_responsable ? (_d = d.entite) == null ? void 0 : _d.fonction : "Agent";
      return `${nom} (${code} - ${roleOuFonction})`;
    }).join(", ");
  };
  const getPriorityBadge = (priority) => {
    const badges = {
      "urgent": { label: "Urgent", color: "red" },
      "important": { label: "Important", color: "orange" },
      "standard": { label: "Standard", color: "blue" }
    };
    return badges[priority == null ? void 0 : priority.toLowerCase()] || { label: priority || "Standard", color: "gray" };
  };
  const getStatutBadge = (statut) => {
    const badges = {
      "en_cours": { label: "En cours", color: "blue" },
      "traite": { label: "Trait\xE9", color: "green" },
      "cloture": { label: "Cl\xF4tur\xE9", color: "purple" }
    };
    return badges[statut == null ? void 0 : statut.toLowerCase()] || { label: statut || "N/A", color: "gray" };
  };
  const transformAffectationData = (data) => {
    return data.map((affectation) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
      let emetteurFormate = "N/A";
      if (((_b = (_a = affectation.emetteur) == null ? void 0 : _a.user) == null ? void 0 : _b.nom) && ((_d = (_c = affectation.emetteur) == null ? void 0 : _c.entite) == null ? void 0 : _d.code)) {
        const nom = `${affectation.emetteur.user.nom} ${affectation.emetteur.user.prenom || ""}`.trim();
        const code = affectation.emetteur.entite.code;
        const roleOuFonction = affectation.emetteur.is_responsable ? affectation.emetteur.entite.fonction : "Agent";
        emetteurFormate = `${nom} (${code} - ${roleOuFonction})`;
      }
      return {
        id: affectation.id,
        // Informations de base
        instructions: affectation.instructions || "N/A",
        statut: affectation.statut || "en_cours",
        priority: affectation.priority || "standard",
        date_affect: formatDate(affectation.date_affect),
        delai_traitement: formatDate(affectation.delai_traitement),
        date_cloture: formatDate(affectation.date_cloture),
        // ✅ Émetteur formaté avec entité
        emetteur: emetteurFormate,
        // Courriers (formaté pour affichage)
        courriers_text: formatCourriers(affectation.courriers || [affectation.courrier_arrive]),
        nb_courriers: ((_e = affectation.courriers) == null ? void 0 : _e.length) || 1,
        // Destinataires (formaté pour affichage)
        destinataires_text: formatDestinataires(affectation.destinataires || [affectation.destinataire]),
        nb_destinataires: ((_f = affectation.destinataires) == null ? void 0 : _f.length) || 1,
        // Badges pour l'affichage
        priority_badge: getPriorityBadge(affectation.priority),
        statut_badge: getStatutBadge(affectation.statut),
        // Garder les données complètes pour les actions
        _raw: affectation,
        courriers_list: affectation.courriers || [affectation.courrier_arrive],
        destinataires_list: affectation.destinataires || [affectation.destinataire],
        // ✅ Pour l'affichage dans la summary bar
        reference: ((_h = (_g = affectation.courrier_arrive) == null ? void 0 : _g.document) == null ? void 0 : _h.reference) || `#${affectation.id}`,
        name: ((_j = (_i = affectation.courrier_arrive) == null ? void 0 : _i.document) == null ? void 0 : _j.objet) || `Affectation #${affectation.id}`
      };
    });
  };
  const fetchAffectations = async () => {
    var _a;
    loading.value = true;
    error.value = null;
    try {
      const token = getToken();
      const entite_user = JSON.parse(localStorage.getItem("entite_user"));
      console.log("\u{1F4E5} entite_user:", entite_user);
      if (!token) {
        throw new Error("Token d'authentification non trouv\xE9");
      }
      if (!entite_user || !entite_user.id) {
        throw new Error("Entit\xE9 utilisateur non trouv\xE9e");
      }
      const destinataireId = isSecDir() ? (_a = getDirecteurEntiteUserId()) != null ? _a : entite_user.id : entite_user.id;
      console.log(`\u{1F4DD} Chargement affectations pour destinataire_id: ${destinataireId}`);
      const response = await fetch(`${config.public.apiBase}/affectations/user/${destinataireId}/pending`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const result = await response.json();
      if (result.success && result.data) {
        affectations.value = transformAffectationData(result.data);
      } else if (result.data) {
        affectations.value = transformAffectationData(result.data);
      } else if (Array.isArray(result)) {
        affectations.value = transformAffectationData(result);
      } else {
        throw new Error("Format de r\xE9ponse invalide");
      }
      console.log(`\u2705 ${affectations.value.length} affectations charg\xE9es`);
      if (affectations.value.length > 0) {
        console.log("\u{1F4CB} Exemple d'affectation format\xE9e:", {
          id: affectations.value[0].id,
          emetteur: affectations.value[0].emetteur,
          reference: affectations.value[0].reference,
          nb_courriers: affectations.value[0].nb_courriers
        });
      }
    } catch (err) {
      error.value = err.message;
      console.error("\u274C Erreur lors du chargement des affectations:", err);
    } finally {
      loading.value = false;
    }
  };
  const tableData = computed(() => affectations.value);
  return {
    affectations,
    loading,
    error,
    fetchAffectations,
    tableData
  };
};
const useDestinataires = () => {
  const destinataires = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const accessDenied = ref(false);
  const config = useRuntimeConfig();
  const { isSecDir, getDirecteurEntiteUserId } = useAuth();
  const getToken = () => {
    return localStorage.getItem("auth_token") || localStorage.getItem("token");
  };
  const transformDestinataireData = (entiteUsers) => {
    const transformed = [];
    entiteUsers.forEach((item) => {
      const { user, entite } = item;
      if (item.actif && user) {
        transformed.push({
          // ID composite pour éviter les doublons
          id: item.id,
          // IDs séparés pour l'API
          user_id: user.id,
          affectation_id: item.id,
          // Informations utilisateur
          name: `${user.prenom} ${user.nom}`,
          email: user.email,
          initials: getInitials(user.prenom, user.nom),
          matricule: user.matricule,
          telephone: user.telephone,
          // Informations entité
          entite: entite.libelle,
          entite_code: entite.code,
          entite_id: entite.id,
          parent_entite_id: entite.parent_entite_id,
          parent_libelle: entite.parent_libelle,
          // Informations d'affectation
          date_debut: item.date_debut,
          date_fin: item.date_fin,
          is_interim: item.is_interim,
          is_responsable: item.is_responsable,
          // Données complètes pour référence
          _raw: {
            entiteUser: item,
            user,
            entite
          }
        });
      }
    });
    return transformed;
  };
  const getInitials = (prenom, nom) => {
    var _a, _b;
    const p = ((_a = prenom == null ? void 0 : prenom.trim().charAt(0)) == null ? void 0 : _a.toUpperCase()) || "";
    const n = ((_b = nom == null ? void 0 : nom.trim().charAt(0)) == null ? void 0 : _b.toUpperCase()) || "";
    return p + n || "??";
  };
  const fetchDestinataires = async () => {
    var _a;
    loading.value = true;
    error.value = null;
    accessDenied.value = false;
    try {
      const token = getToken();
      if (!token) {
        throw new Error("Token d'authentification non trouv\xE9. Veuillez vous reconnecter.");
      }
      let entite_user = null;
      if (false) ;
      if (!entite_user || !entite_user.id) {
        throw new Error("Aucune fonction utilisateur s\xE9lectionn\xE9e. Veuillez vous reconnecter.");
      }
      const destinataireId = isSecDir() ? (_a = getDirecteurEntiteUserId()) != null ? _a : entite_user.id : entite_user.id;
      console.log(`\u{1F4DD} Chargement affectations pour destinataire_id: ${destinataireId}`);
      const response = await fetch(`${config.public.apiBase}/entite-users/${destinataireId}/same-rank`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
      if (response.status === 403) {
        console.warn("\u{1F6AB} Acc\xE8s refus\xE9 : Vous ne pouvez pas effectuer de transfert");
        accessDenied.value = true;
        error.value = "Vous ne pouvez pas effectuer de transfert";
        destinataires.value = [];
        return;
      }
      if (!response.ok) {
        if (response.status === 404) {
          console.warn("\u26A0\uFE0F Aucun coll\xE8gue trouv\xE9 au m\xEAme niveau hi\xE9rarchique");
          destinataires.value = [];
          return;
        }
        throw new Error(`Erreur HTTP ${response.status}`);
      }
      const result = await response.json();
      if (!result.success || !result.data) {
        throw new Error("Format de r\xE9ponse invalide");
      }
      console.log(`\u{1F4CA} Coll\xE8gues de m\xEAme rang r\xE9cup\xE9r\xE9s: ${result.data.length}`);
      destinataires.value = transformDestinataireData(result.data);
      console.log(`\u{1F465} Total destinataires disponibles pour le transfert: ${destinataires.value.length}`);
      if (destinataires.value.length === 0) {
        console.warn("\u26A0\uFE0F Aucun destinataire trouv\xE9 au m\xEAme niveau hi\xE9rarchique");
      } else {
        console.log("\u2705 Destinataires:", destinataires.value.map((d) => ({
          name: d.name,
          entite: d.entite,
          parent: d.parent_libelle
        })));
      }
    } catch (err) {
      error.value = err.message;
      console.error("\u274C Erreur lors du chargement des destinataires:", err);
    } finally {
      loading.value = false;
    }
  };
  const tableData = computed(() => destinataires.value);
  return {
    destinataires,
    loading,
    error,
    accessDenied,
    // ✅ NOUVEAU : Exposer le flag
    fetchDestinataires,
    tableData
  };
};
const useTransfertsForm = () => {
  const store = useTransfertsStore();
  const config = useRuntimeConfig();
  useAuth();
  const loading = ref(false);
  const error = ref(null);
  const success = ref(false);
  const getToken = () => {
    return localStorage.getItem("token") || localStorage.getItem("auth_token");
  };
  const getEmetteurId = () => {
    return null;
  };
  console.log(`... ${getEmetteurId()}`);
  const sendTransferts = async (additionalData = {}) => {
    loading.value = true;
    error.value = null;
    success.value = false;
    try {
      const token = getToken();
      if (!token) {
        throw new Error("Token d'authentification non trouv\xE9");
      }
      const emetteurId = getEmetteurId();
      if (!emetteurId) {
        throw new Error("Fonction de l'\xE9metteur non trouv\xE9e. Veuillez s\xE9lectionner une fonction.");
      }
      if (store.selectedAffectations.length === 0) {
        throw new Error("Veuillez s\xE9lectionner au moins un courrier");
      }
      if (store.selectedDestinataires.length === 0) {
        throw new Error("Veuillez s\xE9lectionner au moins un destinataire");
      }
      const destinataires = store.selectedDestinatairesData.map((d) => {
        let destinataireId = d.id;
        return {
          id: destinataireId,
          name: d.name || `${d.prenom} ${d.nom}`.trim()
        };
      }).filter((d) => d.id);
      const totalTransferts = store.selectedAffectations.length * destinataires.length;
      console.log(`\u{1F4E4} Envoi de ${totalTransferts} transfert(s)...`);
      const results = [];
      const errors = [];
      const details = [];
      let successCount = 0;
      for (const courrierId of store.selectedAffectations) {
        for (const destinataire of destinataires) {
          try {
            const transferData = {
              courrier_arrive_id: courrierId,
              emetteur_id: emetteurId,
              destinataire_id: destinataire.id,
              date_affect: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
              instructions: additionalData.objet || "Transfert de courrier",
              type_affectation: "transfert",
              priority: "standard"
            };
            console.log("les donn\xE9es de transfert", transferData);
            const response = await fetch(`${config.public.apiBase}/transferts`, {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
              },
              body: JSON.stringify(transferData)
            });
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
            }
            const result = await response.json();
            results.push(result);
            successCount++;
            details.push({
              type: "success",
              message: `Courrier #${courrierId} \u2192 ${destinataire.name}`
            });
            console.log(`\u2705 Transfert cr\xE9\xE9: Courrier ${courrierId} \u2192 ${destinataire.name}`);
          } catch (err) {
            errors.push({
              courrierId,
              destinataire: destinataire.name,
              error: err.message
            });
            details.push({
              type: "error",
              message: `Courrier #${courrierId} \u2192 ${destinataire.name}: ${err.message}`
            });
            console.error(`\u274C Erreur transfert Courrier ${courrierId} \u2192 ${destinataire.name}:`, err);
          }
        }
      }
      if (successCount > 0) {
        success.value = true;
      }
      if (errors.length > 0) {
        error.value = `${errors.length} transfert(s) en \xE9chec`;
      }
      if (errors.length === 0) {
        store.clearSelections();
      }
      console.log(`\u{1F4CA} R\xE9sum\xE9: ${successCount} succ\xE8s, ${errors.length} \xE9checs`);
      return {
        success: errors.length === 0,
        type: errors.length === 0 ? "success" : successCount > 0 ? "warning" : "error",
        title: errors.length === 0 ? "Transferts envoy\xE9s" : successCount > 0 ? "Transferts partiellement envoy\xE9s" : "\xC9chec des transferts",
        message: errors.length === 0 ? `${successCount} transfert(s) cr\xE9\xE9(s) avec succ\xE8s` : `${successCount} r\xE9ussi(s), ${errors.length} \xE9chec(s) sur ${totalTransferts}`,
        details: details.length > 10 ? [] : details,
        // Ne pas afficher les détails si trop nombreux
        stats: {
          success: successCount,
          error: errors.length
        },
        data: {
          successCount,
          totalCount: totalTransferts,
          results,
          errors
        }
      };
    } catch (err) {
      error.value = err.message;
      console.error("\u274C Erreur globale envoi transferts:", err);
      return {
        success: false,
        type: "error",
        title: "Erreur de transfert",
        message: err.message
      };
    } finally {
      loading.value = false;
    }
  };
  const removeCourrierFromSelection = (id) => {
    store.removeCourrier(id);
  };
  const removeDestataireFromSelection = (id) => {
    const index = store.selectedDestinataires.indexOf(id);
    if (index > -1) {
      store.selectedDestinataires.splice(index, 1);
    }
  };
  const resetForm = () => {
    store.clearSelections();
    error.value = null;
    success.value = false;
  };
  return {
    // State
    loading,
    error,
    success,
    // Actions
    sendTransferts,
    removeCourrierFromSelection,
    removeDestataireFromSelection,
    resetForm,
    // Helpers
    getEmetteurId
  };
};
const _sfc_main$2 = {
  __name: "AffectationsCheckboxListe",
  __ssrInlineRender: true,
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    const store = useTransfertsStore();
    const { tableData, loading } = useAffectations();
    const searchQuery = ref("");
    const selectedAffectations = computed({
      get: () => store.selectedAffectations,
      set: (value) => {
        store.selectedAffectations = value;
      }
    });
    const filteredAffectations = computed(() => {
      const data = tableData.value || [];
      if (!searchQuery.value) return data;
      const query = searchQuery.value.toLowerCase();
      return data.filter(
        (affectation) => {
          var _a, _b, _c;
          return ((_a = affectation.instructions) == null ? void 0 : _a.toLowerCase().includes(query)) || ((_b = affectation.emetteur) == null ? void 0 : _b.toLowerCase().includes(query)) || ((_c = affectation.courriers_text) == null ? void 0 : _c.toLowerCase().includes(query));
        }
      );
    });
    const isAllSelected = computed(() => {
      return filteredAffectations.value.length > 0 && selectedAffectations.value.length === filteredAffectations.value.length;
    });
    const isIndeterminate = computed(() => {
      return selectedAffectations.value.length > 0 && !isAllSelected.value;
    });
    const toggleSelectAll = () => {
      if (isAllSelected.value) {
        selectedAffectations.value = [];
      } else {
        selectedAffectations.value = filteredAffectations.value.map((a) => a.id);
      }
    };
    const getStatutBadgeClass = (statut) => {
      const classes = {
        "en_cours": "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
        "traite": "bg-green-100 text-green-700 ring-1 ring-green-200",
        "cloture": "bg-purple-100 text-purple-700 ring-1 ring-purple-200"
      };
      return classes[statut] || "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
    };
    const getPriorityBadgeClass = (priority) => {
      const classes = {
        "urgent": "bg-red-100 text-red-700 ring-1 ring-red-200",
        "important": "bg-orange-100 text-orange-700 ring-1 ring-orange-200",
        "standard": "bg-blue-100 text-blue-700 ring-1 ring-blue-200"
      };
      return classes[priority == null ? void 0 : priority.toLowerCase()] || "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0$2;
      const _component_UCheckbox = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 overflow-hidden h-[600px] flex flex-col" }, _attrs))} data-v-88d6fa8c><div class="px-6 py-5 border-b border-slate-100 shrink-0" data-v-88d6fa8c><h3 class="text-xl font-bold text-slate-900 mb-4" data-v-88d6fa8c>2. Affectations Re\xE7ues</h3><div class="relative" data-v-88d6fa8c>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "heroicons:magnifying-glass",
        class: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
      }, null, _parent));
      _push(`<input${ssrRenderAttr("value", searchQuery.value)} type="text" placeholder="Rechercher par instructions, \xE9metteur..." class="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all text-slate-700 placeholder:text-slate-400" data-v-88d6fa8c></div></div><div class="${ssrRenderClass([{ "pb-24": selectedAffectations.value.length > 0 }, "overflow-auto flex-1 transition-all duration-300"])}" data-v-88d6fa8c><table class="w-full" data-v-88d6fa8c><thead class="sticky top-0 bg-slate-50 border-b border-slate-200 z-10" data-v-88d6fa8c><tr data-v-88d6fa8c><th class="px-6 py-3 text-left w-16" data-v-88d6fa8c>`);
      _push(ssrRenderComponent(_component_UCheckbox, {
        checked: isAllSelected.value,
        indeterminate: isIndeterminate.value,
        onChange: toggleSelectAll
      }, null, _parent));
      _push(`</th><th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider" data-v-88d6fa8c>Instructions</th><th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider" data-v-88d6fa8c>\xC9metteur</th><th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider" data-v-88d6fa8c>Courriers</th><th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider" data-v-88d6fa8c>Statut</th><th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider" data-v-88d6fa8c>Priorit\xE9</th></tr></thead><tbody class="divide-y divide-slate-100" data-v-88d6fa8c><!--[-->`);
      ssrRenderList(filteredAffectations.value, (affectation) => {
        _push(`<tr class="${ssrRenderClass([{ "bg-gradient-to-r from-emerald-50/50 via-teal-50/50 to-cyan-50/50 shadow-sm": selectedAffectations.value.includes(affectation.id) }, "group hover:bg-gradient-to-r hover:from-emerald-50/30 hover:via-teal-50/30 hover:to-cyan-50/30 transition-all duration-200"])}" data-v-88d6fa8c><td class="px-6 py-4" data-v-88d6fa8c>`);
        _push(ssrRenderComponent(_component_UCheckbox, {
          modelValue: selectedAffectations.value,
          "onUpdate:modelValue": ($event) => selectedAffectations.value = $event,
          value: affectation.id
        }, null, _parent));
        _push(`</td><td class="px-6 py-4" data-v-88d6fa8c><span class="text-slate-700 text-sm line-clamp-2 font-medium"${ssrRenderAttr("title", affectation.instructions)} data-v-88d6fa8c>${ssrInterpolate(affectation.instructions)}</span></td><td class="px-6 py-4" data-v-88d6fa8c><div class="flex items-center gap-2" data-v-88d6fa8c>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "heroicons:user-circle",
          class: "w-5 h-5 text-slate-400"
        }, null, _parent));
        _push(`<span class="text-slate-600 text-sm" data-v-88d6fa8c>${ssrInterpolate(affectation.emetteur)}</span></div></td><td class="px-6 py-4" data-v-88d6fa8c><div class="flex items-center gap-2" data-v-88d6fa8c>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "heroicons:document-duplicate",
          class: "w-4 h-4 text-teal-500"
        }, null, _parent));
        _push(`<span class="text-xs text-slate-600"${ssrRenderAttr("title", affectation.courriers_text)} data-v-88d6fa8c>${ssrInterpolate(affectation.nb_courriers)} courrier${ssrInterpolate(affectation.nb_courriers > 1 ? "s" : "")}</span></div></td><td class="px-6 py-4" data-v-88d6fa8c><span class="${ssrRenderClass([getStatutBadgeClass(affectation.statut), "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"])}" data-v-88d6fa8c>${ssrInterpolate(affectation.statut_badge.label)}</span></td><td class="px-6 py-4" data-v-88d6fa8c><span class="${ssrRenderClass([getPriorityBadgeClass(affectation.priority), "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"])}" data-v-88d6fa8c>${ssrInterpolate(affectation.priority_badge.label)}</span></td></tr>`);
      });
      _push(`<!--]-->`);
      if (unref(loading)) {
        _push(`<tr data-v-88d6fa8c><td colspan="6" class="p-12 text-center" data-v-88d6fa8c>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "heroicons:arrow-path",
          class: "w-8 h-8 animate-spin text-teal-500 mx-auto mb-2"
        }, null, _parent));
        _push(`<p class="text-slate-500" data-v-88d6fa8c>Chargement des Courriers...</p></td></tr>`);
      } else if (filteredAffectations.value.length === 0) {
        _push(`<tr data-v-88d6fa8c><td colspan="6" class="p-12 text-center text-slate-500" data-v-88d6fa8c>${ssrInterpolate(searchQuery.value ? "Aucun courrier trouv\xE9 pour votre recherche" : "Aucun Courrier trouv\xE9")}</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</tbody></table></div>`);
      if (selectedAffectations.value.length > 0) {
        _push(`<div class="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-auto max-w-[90%]" data-v-88d6fa8c><div class="bg-white/95 backdrop-blur-md text-slate-900 px-6 py-3.5 rounded-full shadow-2xl shadow-teal-500/20 flex items-center gap-5 border border-teal-200/50 ring-1 ring-white/60" data-v-88d6fa8c><div class="flex items-center gap-3 pr-5 border-r border-slate-300" data-v-88d6fa8c><div class="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white text-xs font-bold min-w-[24px] h-6 flex items-center justify-center rounded-full shadow-md shadow-teal-500/40" data-v-88d6fa8c>${ssrInterpolate(selectedAffectations.value.length)}</div><span class="text-sm font-semibold whitespace-nowrap bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent" data-v-88d6fa8c> S\xE9lectionn\xE9${ssrInterpolate(selectedAffectations.value.length > 1 ? "s" : "")}</span></div><div class="flex items-center gap-3" data-v-88d6fa8c><button class="text-xs text-slate-600 hover:text-slate-900 font-medium px-4 py-2 rounded-full hover:bg-slate-100 transition-all duration-200" data-v-88d6fa8c> Annuler </button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/affectations/AffectationsCheckboxListe.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const AffectationsCheckboxListe = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-88d6fa8c"]]);
const _sfc_main$1 = {
  __name: "FormNotification",
  __ssrInlineRender: true,
  props: {
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: "info",
      // 'success', 'error', 'warning', 'info'
      validator: (value) => ["success", "error", "warning", "info"].includes(value)
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    details: {
      type: Array,
      default: () => []
      // Format: [{ type: 'success' | 'error', message: 'text' }]
    },
    stats: {
      type: Object,
      default: null
      // Format: { success: 5, error: 2 }
    },
    autoClose: {
      type: Boolean,
      default: true
    },
    duration: {
      type: Number,
      default: 5e3
      // 5 secondes
    }
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const progress = ref(100);
    let timer = null;
    let progressInterval = null;
    const notificationClass = computed(() => {
      switch (props.type) {
        case "success":
          return "bg-emerald-50 border-emerald-300";
        case "error":
          return "bg-red-50 border-red-300";
        case "warning":
          return "bg-amber-50 border-amber-300";
        case "info":
          return "bg-blue-50 border-blue-300";
        default:
          return "bg-slate-50 border-slate-300";
      }
    });
    const icon = computed(() => {
      switch (props.type) {
        case "success":
          return "heroicons:check-circle";
        case "error":
          return "heroicons:x-circle";
        case "warning":
          return "heroicons:exclamation-triangle";
        case "info":
          return "heroicons:information-circle";
        default:
          return "heroicons:bell";
      }
    });
    const iconBgClass = computed(() => {
      switch (props.type) {
        case "success":
          return "bg-emerald-100";
        case "error":
          return "bg-red-100";
        case "warning":
          return "bg-amber-100";
        case "info":
          return "bg-blue-100";
        default:
          return "bg-slate-100";
      }
    });
    const iconClass = computed(() => {
      switch (props.type) {
        case "success":
          return "text-emerald-600";
        case "error":
          return "text-red-600";
        case "warning":
          return "text-amber-600";
        case "info":
          return "text-blue-600";
        default:
          return "text-slate-600";
      }
    });
    const titleClass = computed(() => {
      switch (props.type) {
        case "success":
          return "text-emerald-900";
        case "error":
          return "text-red-900";
        case "warning":
          return "text-amber-900";
        case "info":
          return "text-blue-900";
        default:
          return "text-slate-900";
      }
    });
    const messageClass = computed(() => {
      switch (props.type) {
        case "success":
          return "text-emerald-700";
        case "error":
          return "text-red-700";
        case "warning":
          return "text-amber-700";
        case "info":
          return "text-blue-700";
        default:
          return "text-slate-700";
      }
    });
    const detailClass = computed(() => {
      switch (props.type) {
        case "success":
          return "text-emerald-600";
        case "error":
          return "text-red-600";
        case "warning":
          return "text-amber-600";
        case "info":
          return "text-blue-600";
        default:
          return "text-slate-600";
      }
    });
    const closeButtonClass = computed(() => {
      switch (props.type) {
        case "success":
          return "text-emerald-600";
        case "error":
          return "text-red-600";
        case "warning":
          return "text-amber-600";
        case "info":
          return "text-blue-600";
        default:
          return "text-slate-600";
      }
    });
    const progressBarClass = computed(() => {
      switch (props.type) {
        case "success":
          return "bg-emerald-500";
        case "error":
          return "bg-red-500";
        case "warning":
          return "bg-amber-500";
        case "info":
          return "bg-blue-500";
        default:
          return "bg-slate-500";
      }
    });
    const containerClass = computed(() => {
      return props.show ? "animate-bounce-in" : "";
    });
    const close = () => {
      clearTimers();
      emit("close");
    };
    const clearTimers = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }
    };
    const startAutoClose = () => {
      if (!props.autoClose || !props.show) return;
      clearTimers();
      progress.value = 100;
      100 / (props.duration / 100);
      progressInterval = setInterval();
      timer = setTimeout(() => {
        close();
      }, props.duration);
    };
    watch(() => props.show, (newValue) => {
      if (newValue) {
        startAutoClose();
      } else {
        clearTimers();
      }
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0$2;
      if (__props.show) {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: ["fixed bottom-6 right-6 z-50 max-w-md w-full", containerClass.value]
        }, _attrs))} data-v-458df719><div class="${ssrRenderClass([notificationClass.value, "rounded-xl shadow-2xl border-2 overflow-hidden"])}" data-v-458df719><div class="flex items-start gap-4 p-4" data-v-458df719><div class="flex-shrink-0" data-v-458df719><div class="${ssrRenderClass([iconBgClass.value, "w-10 h-10 rounded-full flex items-center justify-center"])}" data-v-458df719>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: icon.value,
          class: ["w-6 h-6", iconClass.value]
        }, null, _parent));
        _push(`</div></div><div class="flex-1 min-w-0" data-v-458df719><h4 class="${ssrRenderClass([titleClass.value, "font-bold text-sm mb-1"])}" data-v-458df719>${ssrInterpolate(__props.title)}</h4><p class="${ssrRenderClass([messageClass.value, "text-sm"])}" data-v-458df719>${ssrInterpolate(__props.message)}</p>`);
        if (__props.details && __props.details.length > 0) {
          _push(`<div class="mt-3 space-y-1" data-v-458df719><!--[-->`);
          ssrRenderList(__props.details, (detail, index) => {
            _push(`<div class="${ssrRenderClass([detailClass.value, "text-xs flex items-start gap-2"])}" data-v-458df719>`);
            _push(ssrRenderComponent(_component_Icon, {
              name: detail.type === "success" ? "heroicons:check-circle" : "heroicons:x-circle",
              class: ["w-4 h-4 flex-shrink-0 mt-0.5", detail.type === "success" ? "text-emerald-500" : "text-red-500"]
            }, null, _parent));
            _push(`<span data-v-458df719>${ssrInterpolate(detail.message)}</span></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.stats) {
          _push(`<div class="mt-3 flex items-center gap-4 text-xs font-bold" data-v-458df719>`);
          if (__props.stats.success > 0) {
            _push(`<div class="flex items-center gap-1 text-emerald-600" data-v-458df719>`);
            _push(ssrRenderComponent(_component_Icon, {
              name: "heroicons:check-circle",
              class: "w-4 h-4"
            }, null, _parent));
            _push(`<span data-v-458df719>${ssrInterpolate(__props.stats.success)} r\xE9ussi${ssrInterpolate(__props.stats.success > 1 ? "s" : "")}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          if (__props.stats.error > 0) {
            _push(`<div class="flex items-center gap-1 text-red-600" data-v-458df719>`);
            _push(ssrRenderComponent(_component_Icon, {
              name: "heroicons:x-circle",
              class: "w-4 h-4"
            }, null, _parent));
            _push(`<span data-v-458df719>${ssrInterpolate(__props.stats.error)} \xE9chec${ssrInterpolate(__props.stats.error > 1 ? "s" : "")}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><button class="${ssrRenderClass([closeButtonClass.value, "flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors"])}" data-v-458df719>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "heroicons:x-mark",
          class: "w-5 h-5"
        }, null, _parent));
        _push(`</button></div>`);
        if (__props.autoClose && progress.value > 0) {
          _push(`<div class="${ssrRenderClass([progressBarClass.value, "h-1 transition-all duration-100 ease-linear"])}" style="${ssrRenderStyle({ width: `${progress.value}%` })}" data-v-458df719></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FormNotification.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const FormNotification = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-458df719"]]);
const _sfc_main = {
  __name: "form-transfert",
  __ssrInlineRender: true,
  setup(__props) {
    useTransfertsStore();
    useToast();
    useRouter();
    useAuth();
    const {
      loading: affectationsLoading
    } = useAffectations();
    const {
      loading: destinatairesLoading
    } = useDestinataires();
    const {
      loading: formLoading,
      sendTransferts,
      saveDraft
    } = useTransfertsForm();
    const notification = reactive({
      show: false,
      type: "info",
      title: "",
      message: "",
      details: [],
      stats: null,
      autoClose: true,
      duration: 5e3
    });
    const showNotification = (data) => {
      notification.show = true;
      notification.type = data.type || "info";
      notification.title = data.title || "Notification";
      notification.message = data.message || "";
      notification.details = data.details || [];
      notification.stats = data.stats || null;
      notification.autoClose = data.autoClose !== void 0 ? data.autoClose : true;
      notification.duration = data.duration || (data.type === "error" ? 5e3 : 2500);
    };
    const closeNotification = () => {
      notification.show = false;
      notification.details = [];
      notification.stats = null;
    };
    const handleSaveDraft = async () => {
      console.log("\u{1F4BE} Sauvegarde du brouillon...");
      const result = await saveDraft();
      showNotification(result);
    };
    const handleSendFiles = async () => {
      console.log("\u{1F4E4} Envoi des transferts...");
      const result = await sendTransferts({
        objet: "Transfert de courrier"
      });
      showNotification(result);
      if (result.success && result.type === "success") {
        console.log("\u2705 Transferts envoy\xE9s avec succ\xE8s, redirection dans 2 secondes...");
        setTimeout(() => {
          navigateTo("/affectations-transferts");
        }, 2e3);
      } else if (result.type === "warning") {
        console.log("\u26A0\uFE0F Transferts partiellement envoy\xE9s");
        setTimeout(async () => {
          const confirmResult = await Swal.fire({
            icon: "warning",
            title: "Transferts partiellement envoy\xE9s",
            html: `
          <div class="text-left">
            <p class="mb-3">
              <strong>${result.stats.success}</strong> transfert(s) envoy\xE9(s) avec succ\xE8s<br>
              <strong>${result.stats.error}</strong> transfert(s) en \xE9chec
            </p>
            <p class="text-sm text-gray-600">Voulez-vous consulter la liste des transferts ?</p>
          </div>
        `,
            showCancelButton: true,
            confirmButtonText: "Voir les transferts",
            cancelButtonText: "Rester ici",
            confirmButtonColor: "#3b82f6",
            cancelButtonColor: "#6b7280"
          });
          if (confirmResult.isConfirmed) {
            navigateTo("/affectations-transferts");
          }
        }, 2e3);
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/40" }, _attrs))} data-v-eecb8d2b>`);
      _push(ssrRenderComponent(_sfc_main$3, {
        title: "Transferts",
        description: "Gestion des transferts de courriers"
      }, null, _parent));
      _push(`<div class="max-w-7xl mx-auto px-6 py-8" data-v-eecb8d2b><div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8" style="${ssrRenderStyle({ "height": "calc(100vh - 300px)", "min-height": "600px" })}" data-v-eecb8d2b><div class="flex flex-col" data-v-eecb8d2b>`);
      _push(ssrRenderComponent(AffectationsCheckboxListe, { loading: unref(affectationsLoading) }, null, _parent));
      _push(`</div><div class="flex flex-col" data-v-eecb8d2b>`);
      _push(ssrRenderComponent(TransfertsDestinatairesSelectionPanel, { loading: unref(destinatairesLoading) }, null, _parent));
      _push(`</div></div>`);
      _push(ssrRenderComponent(TransfertsSummaryBar, {
        onSaveDraft: handleSaveDraft,
        onSendFiles: handleSendFiles,
        loading: unref(formLoading)
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(FormNotification, {
        show: notification.show,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        details: notification.details,
        stats: notification.stats,
        "auto-close": notification.autoClose,
        duration: notification.duration,
        onClose: closeNotification
      }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/affectations-transferts/form-transfert.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const formTransfert = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-eecb8d2b"]]);

export { formTransfert as default };
//# sourceMappingURL=form-transfert-BjYl5MO0.mjs.map
