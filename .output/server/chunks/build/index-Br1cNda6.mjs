import __nuxt_component_1 from './Badge-DIEXPf_r.mjs';
import { c as __nuxt_component_0$2, d as __nuxt_component_1$1, n as navigateTo, r as useToast, b as useRuntimeConfig } from './server.mjs';
import __nuxt_component_1$2 from './SelectMenu-DNGe_AeQ.mjs';
import __nuxt_component_2 from './Input-50cchghJ.mjs';
import __nuxt_component_3 from './Modal-EvFvX6Ng.mjs';
import { ref, computed, mergeProps, withCtx, createTextVNode, createVNode, unref, createBlock, openBlock, createCommentVNode, Fragment, renderList, toDisplayString, withDirectives, vModelText, isRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderClass, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { _ as _sfc_main$1 } from './DataTable-Cb4WL8Ep.mjs';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './combobox-DW6kaaFu.mjs';
import './form-DsUILy5F.mjs';
import './active-element-history-Cer4cSOw.mjs';
import './micro-task-B6uncIso.mjs';
import './keyboard-BCt0ZeLv.mjs';
import './use-outside-click-BqFFeIfQ.mjs';
import './focus-management-CclPs0xY.mjs';
import './use-resolve-button-type-CCTzT7JK.mjs';
import './calculate-active-index-BN0T2bP2.mjs';
import './hidden-e5tlhUcy.mjs';
import './open-closed-DaveoKA1.mjs';
import './use-text-value-CScX7TKV.mjs';
import './usePopper-BrvKSG9Z.mjs';
import './useFormGroup-BPckFnLf.mjs';
import './transition-CRUjHQk-.mjs';
import './portal-Bh2KnJSN.mjs';
import './description-BSAkQQqZ.mjs';
import './Select-C_BWMUVV.mjs';
import './Checkbox-DFEpnQRu.mjs';
import './Card-DtmGMnBU.mjs';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const config = useRuntimeConfig();
    const columns = [
      { key: "id", label: "N\xB0", visible: true },
      { key: "matricule", label: "Matricule", visible: true },
      { key: "nom", label: "Nom", visible: true },
      { key: "prenom", label: "Pr\xE9nom", visible: true },
      { key: "email", label: "Email", visible: true },
      { key: "telephone", label: "T\xE9l\xE9phone", visible: true },
      { key: "points_critiques", label: "Entit\xE9", visible: true },
      { key: "fonctions", label: "Fonctions", visible: true },
      { key: "fonctions_interim", label: "Fonctions Int\xE9rimaires", visible: true },
      { key: "prise_service", label: "Prise Service", visible: true },
      { key: "is_superadmin", label: "Admin", visible: true },
      { key: "statut", label: "Statut", visible: true },
      { key: "actions", label: "Ajout d'int\xE9rim", visible: true }
    ];
    const utilisateurs = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const showDeleteModal = ref(false);
    const itemToDelete = ref(null);
    const deleting = ref(false);
    const showInterimModal = ref(false);
    const selectedUser = ref(null);
    const loadingFonctions = ref(false);
    const fonctions = ref([]);
    const submittingInterim = ref(false);
    const interimError = ref(null);
    const interimFileInputRef = ref(null);
    const interimFile = ref(null);
    const interimForm = ref({
      fonction_id: null,
      date_debut: "",
      date_fin: ""
    });
    const formatDate = (date) => {
      if (!date) return "N/A";
      return new Date(date).toLocaleDateString("fr-FR");
    };
    const formatFileSize = (bytes) => {
      if (!bytes) return "";
      if (bytes < 1024) return bytes + " o";
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " Ko";
      return (bytes / (1024 * 1024)).toFixed(1) + " Mo";
    };
    const fonctionsOptions = computed(
      () => fonctions.value.map((f) => {
        var _a;
        return {
          id: f.id,
          libelle: f.libelle || f.code,
          code: f.code,
          entite_libelle: ((_a = f.entite) == null ? void 0 : _a.libelle) || f.entite_libelle || ""
        };
      })
    );
    const loadUtilisateurs = async () => {
      var _a;
      loading.value = true;
      error.value = null;
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          throw new Error("Token d'authentification manquant");
        }
        console.log("\u{1F504} Chargement des utilisateurs...");
        const response = await $fetch(`${config.public.apiBase}/users`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
          }
        });
        console.log("\u{1F4E6} R\xE9ponse API compl\xE8te:", response);
        let dataArray = [];
        if (((_a = response == null ? void 0 : response.data) == null ? void 0 : _a.data) && Array.isArray(response.data.data)) {
          dataArray = response.data.data;
          console.log("\u{1F4CA} Format pagin\xE9 d\xE9tect\xE9");
        } else if ((response == null ? void 0 : response.data) && Array.isArray(response.data)) {
          dataArray = response.data;
          console.log("\u{1F4CA} Format simple d\xE9tect\xE9");
        } else if (Array.isArray(response)) {
          dataArray = response;
          console.log("\u{1F4CA} Format tableau direct d\xE9tect\xE9");
        } else {
          console.error("\u274C Format de r\xE9ponse inconnu:", response);
          throw new Error("Format de r\xE9ponse API invalide");
        }
        console.log("\u{1F4CA} Donn\xE9es extraites:", dataArray.length, "utilisateurs");
        utilisateurs.value = dataArray.map((user) => {
          var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j;
          const entitePrincipale = (_a2 = user.entite_users) == null ? void 0 : _a2.find(
            (eu) => eu.actif === true && eu.is_interim === false && eu.is_responsable === true
          );
          const isResponsable = !!entitePrincipale;
          let fonctions2 = [];
          let entite = [];
          if (entitePrincipale) {
            fonctions2 = [{
              libelle: ((_b = entitePrincipale.entite) == null ? void 0 : _b.fonction) || "Responsable",
              entite: ((_c = entitePrincipale.entite) == null ? void 0 : _c.libelle) || ""
            }];
            entite = [{ libelle: ((_d = entitePrincipale.entite) == null ? void 0 : _d.libelle) || "" }];
          } else {
            const agentEntite = (_e = user.entite_users) == null ? void 0 : _e.find(
              (eu) => eu.actif === true && eu.is_interim === false && eu.is_responsable === false
            );
            if (agentEntite) {
              fonctions2 = [{ libelle: "Agent", entite: ((_f = agentEntite.entite) == null ? void 0 : _f.libelle) || "" }];
              entite = [{ libelle: ((_g = agentEntite.entite) == null ? void 0 : _g.libelle) || "" }];
            }
          }
          const fonctionsInterim = (user.entite_users || []).filter(
            (eu) => eu.actif === true && eu.is_interim === true && eu.is_responsable === true
          ).map((eu) => {
            var _a3, _b2;
            return {
              libelle: ((_a3 = eu.entite) == null ? void 0 : _a3.fonction) || "Int\xE9rim",
              entite: ((_b2 = eu.entite) == null ? void 0 : _b2.libelle) || "",
              date_fin: eu.date_fin,
              entite_id: eu.entite_id
            };
          });
          const pointsCritiques = (user.points_critiques || []).map((pc) => ({
            id: pc.id,
            libelle: pc.libelle || pc.code || "N/A",
            code: pc.code
          }));
          return {
            id: user.id,
            matricule: user.matricule || "N/A",
            nom: user.nom || "",
            prenom: user.prenom || "",
            email: user.email || "",
            telephone: user.telephone || "N/A",
            fonctions: fonctions2,
            fonctions_interim: fonctionsInterim,
            points_critiques: entite,
            prise_service: user.prise_service || null,
            is_superadmin: (_h = user.is_superadmin) != null ? _h : false,
            statut: (_i = user.statut) != null ? _i : false,
            is_responsable: isResponsable,
            entite_principale: (entitePrincipale == null ? void 0 : entitePrincipale.entite) || null,
            parent_entite_id: ((_j = entitePrincipale == null ? void 0 : entitePrincipale.entite) == null ? void 0 : _j.parent_entite_id) || null,
            raw_data: user
          };
        });
        console.log("\u2705 Utilisateurs charg\xE9s:", utilisateurs.value.length);
        console.log("\u{1F4CA} Exemple utilisateur trait\xE9:", utilisateurs.value[0]);
      } catch (err) {
        console.error("\u274C Erreur chargement:", err);
        error.value = err.message || "Erreur lors du chargement des utilisateurs";
        if (err.status === 401 || err.statusCode === 401) {
          useToast().add({
            title: "Session expir\xE9e",
            description: "Veuillez vous reconnecter",
            color: "red"
          });
          setTimeout(() => navigateTo("/login"), 1500);
        }
      } finally {
        loading.value = false;
      }
    };
    const loadFonctions = async () => {
      var _a, _b, _c, _d, _e, _f;
      loadingFonctions.value = true;
      try {
        const token = localStorage.getItem("auth_token");
        const config2 = useRuntimeConfig();
        const response = await $fetch(
          `${config2.public.apiBase}/entites/entites-meme-niveau/${((_d = (_c = (_b = (_a = selectedUser.value) == null ? void 0 : _a.entite_users) == null ? void 0 : _b[0]) == null ? void 0 : _c.entite) == null ? void 0 : _d.parent_entite_id) || ((_e = selectedUser.value) == null ? void 0 : _e.parent_entite_id) || "0"}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json"
            }
          }
        );
        fonctions.value = (_f = response == null ? void 0 : response.data) != null ? _f : Array.isArray(response) ? response : [];
        console.log("\u2705 Fonctions charg\xE9es:", fonctions.value.length);
      } catch (err) {
        console.error("\u274C Erreur chargement fonctions:", err);
        useToast().add({
          title: "Erreur",
          description: "Impossible de charger les fonctions",
          color: "red"
        });
      } finally {
        loadingFonctions.value = false;
      }
    };
    const openInterimModal = async (user) => {
      console.log("\u{1F513} Ouverture modal int\xE9rim pour:", user.nom, user.prenom, "ID:", user.id);
      console.log("\u{1F4CA} Donn\xE9es utilisateur compl\xE8tes:", user);
      selectedUser.value = null;
      fonctions.value = [];
      interimForm.value = {
        fonction_id: null,
        date_debut: "",
        date_fin: ""
      };
      interimFile.value = null;
      interimError.value = null;
      if (interimFileInputRef.value) interimFileInputRef.value.value = "";
      selectedUser.value = user;
      showInterimModal.value = true;
      await loadFonctions();
    };
    const closeInterimModal = () => {
      showInterimModal.value = false;
      selectedUser.value = null;
      interimForm.value = {
        fonction_id: null,
        date_debut: "",
        date_fin: ""
      };
      interimFile.value = null;
      interimError.value = null;
      if (interimFileInputRef.value) interimFileInputRef.value.value = "";
    };
    const submitInterim = async () => {
      var _a, _b, _c;
      if (!selectedUser.value || !interimForm.value.fonction_id || !interimForm.value.date_debut) {
        interimError.value = "Veuillez remplir tous les champs obligatoires";
        return;
      }
      if (!interimFile.value) {
        interimError.value = "Veuillez joindre une pi\xE8ce justificative";
        return;
      }
      if (interimForm.value.date_fin && interimForm.value.date_fin < interimForm.value.date_debut) {
        interimError.value = "La date de fin doit \xEAtre apr\xE8s la date de d\xE9but";
        return;
      }
      submittingInterim.value = true;
      interimError.value = null;
      try {
        const token = localStorage.getItem("auth_token");
        const config2 = useRuntimeConfig();
        const formData = new FormData();
        formData.append("entite_id", String(interimForm.value.fonction_id));
        formData.append("user_id", String(selectedUser.value.id));
        formData.append("date_debut", interimForm.value.date_debut);
        formData.append("is_interim", "1");
        formData.append("actif", "1");
        if (interimForm.value.date_fin) {
          formData.append("date_fin", interimForm.value.date_fin);
        }
        if (interimFile.value instanceof File) {
          formData.append("piece_jointe", interimFile.value);
        }
        console.log("\u{1F4E4} Cr\xE9ation int\xE9rim...");
        console.log("\u{1F4CB} Donn\xE9es:", {
          fonction_id: interimForm.value.fonction_id,
          user_id: selectedUser.value.id,
          date_debut: interimForm.value.date_debut,
          date_fin: interimForm.value.date_fin,
          is_interim: true
        });
        const response = await $fetch(
          `${config2.public.apiBase}/entite-users`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Accept": "application/json"
            },
            body: formData
          }
        );
        console.log("\u2705 Int\xE9rim cr\xE9\xE9:", response);
        useToast().add({
          title: "Succ\xE8s",
          description: "L'int\xE9rim a \xE9t\xE9 cr\xE9\xE9 avec succ\xE8s",
          color: "green"
        });
        closeInterimModal();
        await loadUtilisateurs();
      } catch (err) {
        console.error("\u274C Erreur cr\xE9ation int\xE9rim:", err);
        let errorMessage = "Erreur lors de la cr\xE9ation de l'int\xE9rim";
        if (err.status === 422 || err.statusCode === 422) {
          if ((_a = err.data) == null ? void 0 : _a.errors) {
            errorMessage = Object.values(err.data.errors).flat().join(", ");
          } else {
            errorMessage = ((_b = err.data) == null ? void 0 : _b.message) || errorMessage;
          }
        } else if ((_c = err.data) == null ? void 0 : _c.message) {
          errorMessage = err.data.message;
        }
        interimError.value = errorMessage;
        useToast().add({
          title: "Erreur",
          description: errorMessage,
          color: "red"
        });
      } finally {
        submittingInterim.value = false;
      }
    };
    const onView = (item) => {
      console.log("\u{1F441}\uFE0F Voir:", item);
      navigateTo(`/utilisateurs/${item.id}`);
    };
    const onEdit = (item) => {
      console.log("\u270F\uFE0F \xC9diter:", item);
      navigateTo(`/utilisateurs/${item.id}`);
    };
    const onDelete = (item) => {
      console.log("\u{1F5D1}\uFE0F Demande de suppression:", item);
      itemToDelete.value = item;
      showDeleteModal.value = true;
    };
    const confirmDelete = async () => {
      var _a;
      if (!itemToDelete.value) return;
      deleting.value = true;
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          throw new Error("Token d'authentification manquant");
        }
        console.log("\u{1F680} Suppression de l'utilisateur ID:", itemToDelete.value.id);
        await $fetch(`${config.public.apiBase}/users/${itemToDelete.value.id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
          }
        });
        showDeleteModal.value = false;
        useToast().add({
          title: "Succ\xE8s",
          description: `L'utilisateur "${itemToDelete.value.nom} ${itemToDelete.value.prenom}" a \xE9t\xE9 supprim\xE9 avec succ\xE8s`,
          color: "green"
        });
        itemToDelete.value = null;
        await loadUtilisateurs();
      } catch (err) {
        console.error("\u274C Erreur suppression:", err);
        let errorMessage = "Une erreur est survenue lors de la suppression";
        if (err.status === 401 || err.statusCode === 401) {
          errorMessage = "Session expir\xE9e. Veuillez vous reconnecter";
          setTimeout(() => navigateTo("/login"), 2e3);
        } else if (err.status === 404 || err.statusCode === 404) {
          errorMessage = "L'utilisateur n'existe plus ou a d\xE9j\xE0 \xE9t\xE9 supprim\xE9";
          await loadUtilisateurs();
        } else {
          errorMessage = ((_a = err.data) == null ? void 0 : _a.message) || err.message || errorMessage;
        }
        useToast().add({
          title: "Erreur de suppression",
          description: errorMessage,
          color: "red"
        });
      } finally {
        deleting.value = false;
      }
    };
    const onBulkDelete = async (selectedIds) => {
      var _a, _b;
      if (selectedIds.length === 0) return;
      const confirmMsg = selectedIds.length === 1 ? "Voulez-vous vraiment supprimer cet utilisateur ?" : `Voulez-vous vraiment supprimer ${selectedIds.length} utilisateurs ?`;
      if (!confirm(confirmMsg)) return;
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          throw new Error("Token d'authentification manquant");
        }
        let successCount = 0;
        let errorCount = 0;
        const errors = [];
        useToast().add({
          title: "Suppression en cours",
          description: `Suppression de ${selectedIds.length} utilisateur(s)...`,
          color: "blue"
        });
        for (const id of selectedIds) {
          try {
            await $fetch(`${config.public.apiBase}/users/${id}`, {
              method: "DELETE",
              headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
              }
            });
            successCount++;
            console.log(`\u2705 Utilisateur ${id} supprim\xE9`);
          } catch (err) {
            errorCount++;
            console.error(`\u274C Erreur suppression ID ${id}:`, err);
            const user = utilisateurs.value.find((u) => u.id === id);
            errors.push({
              id,
              nom: user ? `${user.nom} ${user.prenom}` : `ID ${id}`,
              message: ((_a = err.data) == null ? void 0 : _a.message) || err.message || "Erreur inconnue"
            });
          }
        }
        console.log(`\u{1F5D1}\uFE0F Suppression multiple termin\xE9e: ${successCount} succ\xE8s, ${errorCount} \xE9checs`);
        if (errorCount === 0) {
          useToast().add({
            title: "Suppression r\xE9ussie",
            description: `${successCount} utilisateur(s) supprim\xE9(s) avec succ\xE8s`,
            color: "green"
          });
        } else if (successCount === 0) {
          useToast().add({
            title: "\xC9chec de la suppression",
            description: `Aucun utilisateur n'a pu \xEAtre supprim\xE9. ${((_b = errors[0]) == null ? void 0 : _b.message) || ""}`,
            color: "red"
          });
        } else {
          useToast().add({
            title: "Suppression partielle",
            description: `${successCount} utilisateur(s) supprim\xE9(s), ${errorCount} \xE9chec(s)`,
            color: "orange"
          });
          if (errors.length > 0 && errors.length <= 3) {
            errors.forEach((err) => {
              useToast().add({
                title: `Erreur: ${err.nom}`,
                description: err.message,
                color: "red"
              });
            });
          }
        }
        await loadUtilisateurs();
      } catch (err) {
        console.error("\u274C Erreur suppression multiple:", err);
        useToast().add({
          title: "Erreur",
          description: err.message || "Erreur lors de la suppression en masse",
          color: "red"
        });
      }
    };
    const onSelectionChange = (ids) => {
      console.log("\u{1F4CB} S\xE9lection:", ids);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UBadge = __nuxt_component_1;
      const _component_Icon = __nuxt_component_0$2;
      const _component_UButton = __nuxt_component_1$1;
      const _component_USelectMenu = __nuxt_component_1$2;
      const _component_UInput = __nuxt_component_2;
      const _component_UModal = __nuxt_component_3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-100 p-6 font-sans" }, _attrs))}><div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"><div><h1 class="text-2xl font-bold text-slate-900 tracking-tight">Utilisateurs</h1><p class="text-sm text-slate-500">Gestion des utilisateurs et administrateurs</p></div>`);
      _push(ssrRenderComponent(_component_UBadge, {
        color: "green",
        variant: "soft",
        size: "lg",
        class: "ml-auto"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "i-heroicons-plus",
              class: "h-4 w-4 mr-1"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              to: "/utilisateurs/create",
              variant: "text",
              size: "sm",
              class: "p-0 m-0 text-green-600"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Nouveau `);
                } else {
                  return [
                    createTextVNode(" Nouveau ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Icon, {
                name: "i-heroicons-plus",
                class: "h-4 w-4 mr-1"
              }),
              createVNode(_component_UButton, {
                to: "/utilisateurs/create",
                variant: "text",
                size: "sm",
                class: "p-0 m-0 text-green-600"
              }, {
                default: withCtx(() => [
                  createTextVNode(" Nouveau ")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(loading)) {
        _push(`<div class="flex flex-col items-center justify-center py-20 gap-4 text-slate-500"><div class="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div><span class="text-sm font-medium">Chargement des utilisateurs...</span></div>`);
      } else if (unref(error)) {
        _push(`<div class="flex items-center gap-4 p-5 bg-red-50 border border-red-200 rounded-xl max-w-2xl mx-auto sm:mx-0"><svg class="w-8 h-8 text-red-600 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg><div class="flex-1"><p class="text-sm font-bold text-red-900">Erreur de chargement</p><p class="text-xs text-red-700">${ssrInterpolate(unref(error))}</p></div><button class="px-4 py-2 text-xs font-bold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors shrink-0"> R\xE9essayer </button></div>`);
      } else {
        _push(ssrRenderComponent(_sfc_main$1, {
          data: unref(utilisateurs),
          columns,
          selectable: true,
          "left-aligned-columns": ["matricule", "nom", "prenom", "email", "telephone"],
          onEdit,
          onDelete,
          onView,
          onSelectionChange
        }, {
          "advanced-filters": withCtx(({ filters, onFilter }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"${_scopeId}><!--[-->`);
              ssrRenderList([
                { id: "matricule", label: "Matricule" },
                { id: "nom", label: "Nom" },
                { id: "prenom", label: "Pr\xE9nom" },
                { id: "email", label: "Email" }
              ], (field) => {
                _push2(`<div${_scopeId}><label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5"${_scopeId}>${ssrInterpolate(field.label)}</label><input${ssrRenderAttr("value", filters[field.id])} placeholder="Filtrer..." class="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"${_scopeId}></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              return [
                createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" }, [
                  (openBlock(), createBlock(Fragment, null, renderList([
                    { id: "matricule", label: "Matricule" },
                    { id: "nom", label: "Nom" },
                    { id: "prenom", label: "Pr\xE9nom" },
                    { id: "email", label: "Email" }
                  ], (field) => {
                    return createVNode("div", {
                      key: field.id
                    }, [
                      createVNode("label", { class: "block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5" }, toDisplayString(field.label), 1),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => filters[field.id] = $event,
                        placeholder: "Filtrer...",
                        class: "w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all",
                        onInput: onFilter
                      }, null, 40, ["onUpdate:modelValue", "onInput"]), [
                        [vModelText, filters[field.id]]
                      ])
                    ]);
                  }), 64))
                ])
              ];
            }
          }),
          "selection-actions": withCtx(({ selected }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (selected.length > 0) {
                _push2(`<button class="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-red-600 to-orange-600 rounded-lg hover:opacity-90 transition-opacity"${_scopeId}><svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"${_scopeId}><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"${_scopeId}></path></svg> Supprimer (${ssrInterpolate(selected.length)}) </button>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                selected.length > 0 ? (openBlock(), createBlock("button", {
                  key: 0,
                  class: "inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-red-600 to-orange-600 rounded-lg hover:opacity-90 transition-opacity",
                  onClick: ($event) => onBulkDelete(selected)
                }, [
                  (openBlock(), createBlock("svg", {
                    class: "w-4 h-4",
                    viewBox: "0 0 20 20",
                    fill: "currentColor"
                  }, [
                    createVNode("path", {
                      "fill-rule": "evenodd",
                      d: "M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z",
                      "clip-rule": "evenodd"
                    })
                  ])),
                  createTextVNode(" Supprimer (" + toDisplayString(selected.length) + ") ", 1)
                ], 8, ["onClick"])) : createCommentVNode("", true)
              ];
            }
          }),
          "cell-matricule": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100"${_scopeId}>${ssrInterpolate(value || "N/A")}</span>`);
            } else {
              return [
                createVNode("span", { class: "inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100" }, toDisplayString(value || "N/A"), 1)
              ];
            }
          }),
          "cell-is_superadmin": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="${ssrRenderClass([{
                "bg-emerald-50 text-emerald-700 border-emerald-100": value === true,
                "bg-slate-100 text-slate-600 border-slate-200": value === false
              }, "inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border"])}"${_scopeId}>${ssrInterpolate(value ? "Oui" : "Non")}</span>`);
            } else {
              return [
                createVNode("span", {
                  class: ["inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border", {
                    "bg-emerald-50 text-emerald-700 border-emerald-100": value === true,
                    "bg-slate-100 text-slate-600 border-slate-200": value === false
                  }]
                }, toDisplayString(value ? "Oui" : "Non"), 3)
              ];
            }
          }),
          "cell-statut": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="${ssrRenderClass([{
                "bg-green-50 text-green-700 border-green-100": value === true,
                "bg-red-50 text-red-700 border-red-100": value === false
              }, "inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border"])}"${_scopeId}>${ssrInterpolate(value ? "Actif" : "Inactif")}</span>`);
            } else {
              return [
                createVNode("span", {
                  class: ["inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full border", {
                    "bg-green-50 text-green-700 border-green-100": value === true,
                    "bg-red-50 text-red-700 border-red-100": value === false
                  }]
                }, toDisplayString(value ? "Actif" : "Inactif"), 3)
              ];
            }
          }),
          "cell-prise_service": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="text-xs text-slate-600 font-medium"${_scopeId}>${ssrInterpolate(formatDate(value))}</span>`);
            } else {
              return [
                createVNode("span", { class: "text-xs text-slate-600 font-medium" }, toDisplayString(formatDate(value)), 1)
              ];
            }
          }),
          "cell-fonctions": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex flex-wrap gap-1 max-w-[200px]"${_scopeId}>`);
              if (!value || value.length === 0) {
                _push2(`<span class="text-xs text-slate-400 italic"${_scopeId}> Aucune fonction </span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<!--[-->`);
              ssrRenderList(value, (fonction, index) => {
                _push2(`<span class="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md bg-blue-50 text-blue-700 border border-blue-200"${ssrRenderAttr("title", `${fonction.libelle}${fonction.entite ? " - " + fonction.entite : ""}`)}${_scopeId}>${ssrInterpolate(fonction.libelle)}</span>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              return [
                createVNode("div", { class: "flex flex-wrap gap-1 max-w-[200px]" }, [
                  !value || value.length === 0 ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "text-xs text-slate-400 italic"
                  }, " Aucune fonction ")) : createCommentVNode("", true),
                  (openBlock(true), createBlock(Fragment, null, renderList(value, (fonction, index) => {
                    return openBlock(), createBlock("span", {
                      key: index,
                      class: "inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md bg-blue-50 text-blue-700 border border-blue-200",
                      title: `${fonction.libelle}${fonction.entite ? " - " + fonction.entite : ""}`
                    }, toDisplayString(fonction.libelle), 9, ["title"]);
                  }), 128))
                ])
              ];
            }
          }),
          "cell-fonctions_interim": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex flex-wrap gap-1 max-w-[200px]"${_scopeId}>`);
              if (!value || value.length === 0) {
                _push2(`<span class="text-xs text-slate-400 italic"${_scopeId}> - </span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<!--[-->`);
              ssrRenderList(value, (fonction, index) => {
                _push2(`<span class="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md bg-orange-50 text-orange-700 border border-orange-200"${ssrRenderAttr("title", `${fonction.libelle}${fonction.entite ? " - " + fonction.entite : ""}${fonction.date_fin ? " (jusqu'au " + formatDate(fonction.date_fin) + ")" : ""}`)}${_scopeId}>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "i-heroicons-clock",
                  class: "w-3 h-3"
                }, null, _parent2, _scopeId));
                _push2(` ${ssrInterpolate(fonction.libelle)}</span>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              return [
                createVNode("div", { class: "flex flex-wrap gap-1 max-w-[200px]" }, [
                  !value || value.length === 0 ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "text-xs text-slate-400 italic"
                  }, " - ")) : createCommentVNode("", true),
                  (openBlock(true), createBlock(Fragment, null, renderList(value, (fonction, index) => {
                    return openBlock(), createBlock("span", {
                      key: index,
                      class: "inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md bg-orange-50 text-orange-700 border border-orange-200",
                      title: `${fonction.libelle}${fonction.entite ? " - " + fonction.entite : ""}${fonction.date_fin ? " (jusqu'au " + formatDate(fonction.date_fin) + ")" : ""}`
                    }, [
                      createVNode(_component_Icon, {
                        name: "i-heroicons-clock",
                        class: "w-3 h-3"
                      }),
                      createTextVNode(" " + toDisplayString(fonction.libelle), 1)
                    ], 8, ["title"]);
                  }), 128))
                ])
              ];
            }
          }),
          "cell-points_critiques": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex flex-wrap gap-1 max-w-[200px]"${_scopeId}>`);
              if (!value || value.length === 0) {
                _push2(`<span class="text-xs text-slate-400 italic"${_scopeId}> Aucun </span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<!--[-->`);
              ssrRenderList(value, (point, index) => {
                _push2(`<span class="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md bg-amber-50 text-amber-700 border border-amber-200"${ssrRenderAttr("title", `${point.libelle || point.code}`)}${_scopeId}>${ssrInterpolate(point.libelle || point.code)}</span>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              return [
                createVNode("div", { class: "flex flex-wrap gap-1 max-w-[200px]" }, [
                  !value || value.length === 0 ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "text-xs text-slate-400 italic"
                  }, " Aucun ")) : createCommentVNode("", true),
                  (openBlock(true), createBlock(Fragment, null, renderList(value, (point, index) => {
                    return openBlock(), createBlock("span", {
                      key: index,
                      class: "inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md bg-amber-50 text-amber-700 border border-amber-200",
                      title: `${point.libelle || point.code}`
                    }, toDisplayString(point.libelle || point.code), 9, ["title"]);
                  }), 128))
                ])
              ];
            }
          }),
          "cell-actions": withCtx(({ item }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-center gap-2"${_scopeId}>`);
              if (item.is_responsable) {
                _push2(`<button class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100 transition-colors" title="Ajouter un int\xE9rim"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "i-heroicons-plus-circle",
                  class: "w-4 h-4"
                }, null, _parent2, _scopeId));
                _push2(`</button>`);
              } else {
                _push2(`<span class="text-xs text-slate-400 italic"${_scopeId}>-</span>`);
              }
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { class: "flex items-center gap-2" }, [
                  item.is_responsable ? (openBlock(), createBlock("button", {
                    key: 0,
                    onClick: ($event) => openInterimModal(item),
                    class: "inline-flex items-center justify-center w-8 h-8 rounded-lg bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100 transition-colors",
                    title: "Ajouter un int\xE9rim"
                  }, [
                    createVNode(_component_Icon, {
                      name: "i-heroicons-plus-circle",
                      class: "w-4 h-4"
                    })
                  ], 8, ["onClick"])) : (openBlock(), createBlock("span", {
                    key: 1,
                    class: "text-xs text-slate-400 italic"
                  }, "-"))
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      if (unref(showInterimModal)) {
        _push(`<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div class="bg-white rounded-xl shadow-xl w-full max-w-lg"><div class="flex items-center justify-between px-6 py-4 border-b border-gray-200"><div><h3 class="text-lg font-semibold text-gray-900">Ajouter un int\xE9rim</h3>`);
        if (unref(selectedUser)) {
          _push(`<p class="text-sm text-slate-600 mt-1"> Pour: ${ssrInterpolate(unref(selectedUser).nom)} ${ssrInterpolate(unref(selectedUser).prenom)} (${ssrInterpolate(unref(selectedUser).matricule)}) </p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><button class="text-gray-400 hover:text-gray-600 transition-colors"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><div class="px-6 py-5 space-y-4">`);
        if (unref(loadingFonctions)) {
          _push(`<div class="flex justify-center py-8"><div class="w-6 h-6 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div></div>`);
        } else {
          _push(`<!--[--><div><label class="block text-sm font-medium text-gray-700 mb-2"> Fonction <span class="text-red-600">*</span></label>`);
          _push(ssrRenderComponent(_component_USelectMenu, {
            modelValue: unref(interimForm).fonction_id,
            "onUpdate:modelValue": ($event) => unref(interimForm).fonction_id = $event,
            options: unref(fonctionsOptions),
            placeholder: "S\xE9lectionner une fonction",
            "value-attribute": "id",
            "option-attribute": "libelle",
            searchable: "",
            "searchable-placeholder": "Rechercher...",
            class: "w-full"
          }, {
            option: withCtx(({ option }, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="flex flex-col py-0.5"${_scopeId}><span class="font-semibold text-sm"${_scopeId}>${ssrInterpolate(option.libelle)}</span>`);
                if (option.entite_libelle) {
                  _push2(`<span class="text-xs text-gray-400"${_scopeId}>${ssrInterpolate(option.entite_libelle)}</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              } else {
                return [
                  createVNode("div", { class: "flex flex-col py-0.5" }, [
                    createVNode("span", { class: "font-semibold text-sm" }, toDisplayString(option.libelle), 1),
                    option.entite_libelle ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "text-xs text-gray-400"
                    }, toDisplayString(option.entite_libelle), 1)) : createCommentVNode("", true)
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div><div class="grid grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-2">Date d\xE9but <span class="text-red-600">*</span></label>`);
          _push(ssrRenderComponent(_component_UInput, {
            modelValue: unref(interimForm).date_debut,
            "onUpdate:modelValue": ($event) => unref(interimForm).date_debut = $event,
            type: "date",
            class: "w-full h-10"
          }, null, _parent));
          _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-2">Date fin</label>`);
          _push(ssrRenderComponent(_component_UInput, {
            modelValue: unref(interimForm).date_fin,
            "onUpdate:modelValue": ($event) => unref(interimForm).date_fin = $event,
            type: "date",
            min: unref(interimForm).date_debut,
            class: "w-full h-10"
          }, null, _parent));
          _push(`</div></div><label class="flex items-center gap-2 cursor-not-allowed opacity-75"><input type="checkbox"${ssrIncludeBooleanAttr(true) ? " checked" : ""} disabled class="w-4 h-4 text-indigo-600 border-gray-300 rounded"><span class="text-sm font-medium text-gray-700">Fonction en int\xE9rim</span></label><div><label class="block text-sm font-medium text-gray-700 mb-2">Pi\xE8ce jointe <span class="text-red-600">*</span></label><div class="${ssrRenderClass([unref(interimFile) ? "border-green-300 bg-green-50" : "border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50", "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors"])}"><input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" class="hidden">`);
          if (unref(interimFile)) {
            _push(`<div class="flex items-center justify-between gap-3"><div class="flex items-center gap-2 min-w-0"><svg class="w-8 h-8 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg><div class="text-left min-w-0"><p class="text-sm font-medium text-gray-800 truncate">${ssrInterpolate(unref(interimFile).name)}</p><p class="text-xs text-gray-500">${ssrInterpolate(formatFileSize(unref(interimFile).size))}</p></div></div><button type="button" class="flex-shrink-0 p-1 rounded-full text-red-400 hover:text-red-600 hover:bg-red-100 transition-colors"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>`);
          } else {
            _push(`<div class="flex flex-col items-center gap-2 py-2"><svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg><p class="text-sm text-gray-500"><span class="font-medium text-indigo-600">Cliquez</span> ou glissez un fichier ici </p><p class="text-xs text-gray-400">PDF, Word, Images \u2014 max 5 Mo</p></div>`);
          }
          _push(`</div></div>`);
          if (unref(interimError)) {
            _push(`<div class="p-3 bg-red-50 border border-red-200 rounded-lg"><p class="text-sm text-red-800">${ssrInterpolate(unref(interimError))}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        }
        _push(`</div><div class="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">`);
        _push(ssrRenderComponent(_component_UButton, {
          type: "button",
          color: "gray",
          variant: "outline",
          onClick: closeInterimModal
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Annuler `);
            } else {
              return [
                createTextVNode(" Annuler ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UButton, {
          type: "button",
          onClick: submitInterim,
          loading: unref(submittingInterim),
          disabled: !unref(interimForm).fonction_id || !unref(interimForm).date_debut || !unref(interimFile)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (!unref(submittingInterim)) {
                _push2(`<svg class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"${_scopeId}></path></svg>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(` Enregistrer l&#39;int\xE9rim `);
            } else {
              return [
                !unref(submittingInterim) ? (openBlock(), createBlock("svg", {
                  key: 0,
                  class: "w-4 h-4 mr-1.5",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  stroke: "currentColor"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M5 13l4 4L19 7"
                  })
                ])) : createCommentVNode("", true),
                createTextVNode(" Enregistrer l'int\xE9rim ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_UModal, {
        modelValue: unref(showDeleteModal),
        "onUpdate:modelValue": ($event) => isRef(showDeleteModal) ? showDeleteModal.value = $event : null
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="p-6"${_scopeId}><div class="flex items-center gap-4 mb-4"${_scopeId}><div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0"${_scopeId}><svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"${_scopeId}></path></svg></div><div class="flex-1"${_scopeId}><h3 class="text-lg font-bold text-slate-900"${_scopeId}>Confirmer la suppression</h3><p class="text-sm text-slate-600 mt-1"${_scopeId}>Cette action est irr\xE9versible</p></div></div>`);
            if (unref(itemToDelete)) {
              _push2(`<div class="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4"${_scopeId}><div class="space-y-2 text-sm"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><span class="text-slate-600 font-medium"${_scopeId}>Matricule:</span><span class="font-semibold text-slate-900"${_scopeId}>${ssrInterpolate(unref(itemToDelete).matricule)}</span></div><div class="flex items-center justify-between"${_scopeId}><span class="text-slate-600 font-medium"${_scopeId}>Nom:</span><span class="font-semibold text-slate-900"${_scopeId}>${ssrInterpolate(unref(itemToDelete).nom)} ${ssrInterpolate(unref(itemToDelete).prenom)}</span></div><div class="flex items-center justify-between"${_scopeId}><span class="text-slate-600 font-medium"${_scopeId}>Email:</span><span class="font-semibold text-slate-900"${_scopeId}>${ssrInterpolate(unref(itemToDelete).email)}</span></div></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4"${_scopeId}><p class="text-xs text-yellow-800"${_scopeId}><strong${_scopeId}>\u26A0\uFE0F Attention :</strong> Vous \xEAtes sur le point de supprimer cet utilisateur. Cette action supprimera d\xE9finitivement toutes les donn\xE9es associ\xE9es. </p></div><div class="flex justify-end gap-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              color: "gray",
              variant: "outline",
              onClick: ($event) => showDeleteModal.value = false,
              disabled: unref(deleting)
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Annuler `);
                } else {
                  return [
                    createTextVNode(" Annuler ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              color: "red",
              onClick: confirmDelete,
              loading: unref(deleting)
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Supprimer d\xE9finitivement `);
                } else {
                  return [
                    createTextVNode(" Supprimer d\xE9finitivement ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "p-6" }, [
                createVNode("div", { class: "flex items-center gap-4 mb-4" }, [
                  createVNode("div", { class: "w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0" }, [
                    (openBlock(), createBlock("svg", {
                      class: "w-6 h-6 text-red-600",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      })
                    ]))
                  ]),
                  createVNode("div", { class: "flex-1" }, [
                    createVNode("h3", { class: "text-lg font-bold text-slate-900" }, "Confirmer la suppression"),
                    createVNode("p", { class: "text-sm text-slate-600 mt-1" }, "Cette action est irr\xE9versible")
                  ])
                ]),
                unref(itemToDelete) ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4"
                }, [
                  createVNode("div", { class: "space-y-2 text-sm" }, [
                    createVNode("div", { class: "flex items-center justify-between" }, [
                      createVNode("span", { class: "text-slate-600 font-medium" }, "Matricule:"),
                      createVNode("span", { class: "font-semibold text-slate-900" }, toDisplayString(unref(itemToDelete).matricule), 1)
                    ]),
                    createVNode("div", { class: "flex items-center justify-between" }, [
                      createVNode("span", { class: "text-slate-600 font-medium" }, "Nom:"),
                      createVNode("span", { class: "font-semibold text-slate-900" }, toDisplayString(unref(itemToDelete).nom) + " " + toDisplayString(unref(itemToDelete).prenom), 1)
                    ]),
                    createVNode("div", { class: "flex items-center justify-between" }, [
                      createVNode("span", { class: "text-slate-600 font-medium" }, "Email:"),
                      createVNode("span", { class: "font-semibold text-slate-900" }, toDisplayString(unref(itemToDelete).email), 1)
                    ])
                  ])
                ])) : createCommentVNode("", true),
                createVNode("div", { class: "bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4" }, [
                  createVNode("p", { class: "text-xs text-yellow-800" }, [
                    createVNode("strong", null, "\u26A0\uFE0F Attention :"),
                    createTextVNode(" Vous \xEAtes sur le point de supprimer cet utilisateur. Cette action supprimera d\xE9finitivement toutes les donn\xE9es associ\xE9es. ")
                  ])
                ]),
                createVNode("div", { class: "flex justify-end gap-3" }, [
                  createVNode(_component_UButton, {
                    color: "gray",
                    variant: "outline",
                    onClick: ($event) => showDeleteModal.value = false,
                    disabled: unref(deleting)
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Annuler ")
                    ]),
                    _: 1
                  }, 8, ["onClick", "disabled"]),
                  createVNode(_component_UButton, {
                    color: "red",
                    onClick: confirmDelete,
                    loading: unref(deleting)
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Supprimer d\xE9finitivement ")
                    ]),
                    _: 1
                  }, 8, ["loading"])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/utilisateurs/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Br1cNda6.mjs.map
