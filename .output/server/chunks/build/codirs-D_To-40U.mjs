import { defineStore } from 'pinia';
import { b as useRuntimeConfig } from './server.mjs';
import { ref, watch } from 'vue';

const extractTime = (iso) => iso ? iso.substring(11, 16) : "";
const extractDateInput = (iso) => iso ? iso.split("T")[0] : "";
const extractTimeInput = (iso) => iso ? iso.substring(11, 16) : "";
const formatDateFR = (iso) => iso ? new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }) : "";
const STATUT_CONFIG = {
  nouveau: { label: "Nouveau", uiColor: "blue", dotClass: "bg-blue-400", badgeClass: "text-blue-600 bg-blue-50 dark:bg-blue-950/40" },
  "termin\xE9": { label: "Termin\xE9", uiColor: "green", dotClass: "bg-green-400", badgeClass: "text-green-600 bg-green-50 dark:bg-green-950/40" },
  clos: { label: "Clos", uiColor: "gray", dotClass: "bg-gray-400", badgeClass: "text-gray-500 bg-gray-100 dark:bg-gray-800/60" },
  en_cours: { label: "En cours", uiColor: "amber", dotClass: "bg-amber-400", badgeClass: "text-amber-600 bg-amber-50 dark:bg-amber-950/40" },
  "annul\xE9": { label: "Annul\xE9", uiColor: "red", dotClass: "bg-red-400", badgeClass: "text-red-600 bg-red-50 dark:bg-red-950/40" }
};
const getStatutConfig = (statut) => {
  var _a;
  return (_a = STATUT_CONFIG[statut]) != null ? _a : { label: statut, uiColor: "gray", dotClass: "bg-gray-400", badgeClass: "text-gray-500 bg-gray-100" };
};
const STATUT_OPTIONS = [
  { label: "Nouveau", value: "nouveau" },
  { label: "En cours", value: "en_cours" },
  { label: "Termin\xE9", value: "termin\xE9" },
  { label: "Clos", value: "clos" },
  { label: "Annul\xE9", value: "annul\xE9" }
];
function useCodir() {
  const { public: { apiBase } } = useRuntimeConfig();
  const loading = ref(false);
  const error = ref(null);
  const getHeaders = () => {
    var _a;
    return {
      Authorization: `Bearer ${(_a = localStorage.getItem("auth_token")) != null ? _a : ""}`,
      "Content-Type": "application/json"
    };
  };
  async function api(url, opts = {}) {
    var _a, _b, _c;
    loading.value = true;
    error.value = null;
    try {
      return await $fetch(`${apiBase}${url}`, { headers: getHeaders(), ...opts });
    } catch (e) {
      error.value = (_c = (_b = (_a = e == null ? void 0 : e.data) == null ? void 0 : _a.message) != null ? _b : e == null ? void 0 : e.message) != null ? _c : "Erreur r\xE9seau";
      throw e;
    } finally {
      loading.value = false;
    }
  }
  return {
    loading,
    error,
    getCodirs: () => api("/codirs"),
    getCodir: (id) => api(`/codirs/${id}`),
    createCodir: (body) => api("/codirs", { method: "POST", body }),
    updateCodir: (id, body) => api(`/codirs/${id}`, { method: "PUT", body }),
    deleteCodir: (id) => api(`/codirs/${id}`, { method: "DELETE" }),
    attachPrev: (id) => api(`/codirs/${id}/attach-previous`, { method: "POST" }),
    attachODJ: (codirId, ordreId) => api(`/codirs/${codirId}/ordres-du-jour`, { method: "POST", body: { ordre_du_jour_id: ordreId } }),
    detachODJ: (codirId, ordreId) => api(`/codirs/${codirId}/ordres-du-jour/${ordreId}`, { method: "DELETE" }),
    attachTache: (codirId, body) => api(`/codirs/${codirId}/taches`, { method: "POST", body }),
    updateTachePivot: (codirId, tacheId, body) => api(`/codirs/${codirId}/taches/${tacheId}`, { method: "PUT", body }),
    detachTache: (codirId, tacheId) => api(`/codirs/${codirId}/taches/${tacheId}`, { method: "DELETE" })
  };
}
function useOrdreDuJour() {
  const { public: { apiBase } } = useRuntimeConfig();
  const loading = ref(false);
  const error = ref(null);
  const getHeaders = () => {
    var _a;
    return {
      Authorization: `Bearer ${(_a = localStorage.getItem("auth_token")) != null ? _a : ""}`,
      "Content-Type": "application/json"
    };
  };
  async function api(url, opts = {}) {
    var _a, _b, _c;
    loading.value = true;
    error.value = null;
    try {
      return await $fetch(`${apiBase}${url}`, { headers: getHeaders(), ...opts });
    } catch (e) {
      error.value = (_c = (_b = (_a = e == null ? void 0 : e.data) == null ? void 0 : _a.message) != null ? _b : e == null ? void 0 : e.message) != null ? _c : "Erreur r\xE9seau";
      throw e;
    } finally {
      loading.value = false;
    }
  }
  return {
    loading,
    error,
    getOrdres: () => api("/ordres-du-jour"),
    getOrdre: (id) => api(`/ordres-du-jour/${id}`),
    createOrdre: (body) => api("/ordres-du-jour", { method: "POST", body }),
    updateOrdre: (id, body) => api(`/ordres-du-jour/${id}`, { method: "PUT", body }),
    deleteOrdre: (id) => api(`/ordres-du-jour/${id}`, { method: "DELETE" }),
    addDossier: (ordreId, body) => api(`/ordres-du-jour/${ordreId}/dossiers`, { method: "POST", body }),
    removeDossier: (ordreId, dossierId) => api(`/ordres-du-jour/${ordreId}/dossiers/${dossierId}`, { method: "DELETE" })
  };
}
const useCodirsStore = defineStore("codirs", () => {
  const getStored = () => {
    return null;
  };
  const codirs = ref([]);
  const currentCodir = ref(getStored());
  const loading = ref(false);
  const error = ref(null);
  const currentOrdreDuJour = ref(null);
  const currentDossier = ref(null);
  const currentTache = ref(null);
  const api = useCodir();
  const apiOdj = useOrdreDuJour();
  watch(api.loading, (v) => {
    loading.value = v;
  });
  watch(api.error, (v) => {
    error.value = v;
  });
  async function getCodirs() {
    codirs.value = await api.getCodirs();
  }
  async function fetchCodir(id) {
    currentCodir.value = await api.getCodir(id);
    return currentCodir.value;
  }
  async function createCodir(payload) {
    const codir = await api.createCodir(payload);
    codirs.value.unshift(codir);
    currentCodir.value = codir;
    return codir;
  }
  async function createOrdreDuJour(body) {
    loading.value = true;
    await apiOdj.createOrdre(body);
    console.log("cr\xE9ation d'un nouvel ordre du jour");
    await fetchCodir(body.codir_id);
    loading.value = false;
  }
  async function addDossier(ordreId, body) {
    loading.value = true;
    try {
      const response = await apiOdj.addDossier(ordreId, body);
      console.log("Ajout d'un nouveau dossier \xE0 l'ordre du jour", ordreId);
      currentOrdreDuJour.value = response;
    } catch (error2) {
      console.error("Erreur lors de l'ajout du dossier:", error2);
      throw error2;
    } finally {
      loading.value = false;
    }
  }
  async function removeDossier(ordreId, dossierId) {
    loading.value = true;
    try {
      const response = await apiOdj.removeDossier(ordreId, dossierId);
      console.log("Suppression du dossier", dossierId, "de l'ordre du jour", ordreId);
      currentOrdreDuJour.value = response;
    } catch (error2) {
      console.error("Erreur lors de la suppression du dossier:", error2);
      throw error2;
    } finally {
      loading.value = false;
    }
  }
  async function updateCodir(id, payload) {
    var _a;
    const updated = await api.updateCodir(id, payload);
    const idx = codirs.value.findIndex((c) => c.id === id);
    if (idx !== -1) codirs.value[idx] = updated;
    if (((_a = currentCodir.value) == null ? void 0 : _a.id) === id) currentCodir.value = updated;
    return updated;
  }
  async function deleteCodir(id) {
    var _a;
    await api.deleteCodir(id);
    codirs.value = codirs.value.filter((c) => c.id !== id);
    if (((_a = currentCodir.value) == null ? void 0 : _a.id) === id) currentCodir.value = null;
  }
  async function attachFromPrevious(id) {
    var _a;
    const updated = await api.attachPrev(id);
    if (((_a = currentCodir.value) == null ? void 0 : _a.id) === id) currentCodir.value = updated;
    return updated;
  }
  async function attachOrdreDuJour(codirId, ordreId) {
    await api.attachODJ(codirId, ordreId);
    await fetchCodir(codirId);
  }
  async function detachOrdreDuJour(codirId, ordreId) {
    const updated = await api.detachODJ(codirId, ordreId);
    currentCodir.value = updated;
  }
  async function attachTache(codirId, body) {
    await api.attachTache(codirId, body);
    await fetchCodir(codirId);
  }
  async function updateTachePivot(codirId, tacheId, body) {
    await api.updateTachePivot(codirId, tacheId, body);
    await fetchCodir(codirId);
  }
  async function detachTache(codirId, tacheId) {
    await api.detachTache(codirId, tacheId);
    await fetchCodir(codirId);
  }
  async function updateTache(tacheId, payload) {
    var _a;
    const updated = await api.updateTache(tacheId, payload);
    if (((_a = currentTache.value) == null ? void 0 : _a.id) === tacheId) currentTache.value = updated;
    await fetchCodir(currentCodir.value.id);
    return updated;
  }
  function setCurrentCodir(codir) {
    currentCodir.value = codir;
  }
  function setCurrentOrdreDuJour(odj) {
    currentOrdreDuJour.value = odj;
    currentDossier.value = null;
    currentTache.value = null;
  }
  function setCurrentDossier(dossier) {
    currentDossier.value = dossier;
    currentTache.value = null;
  }
  function setCurrentTache(tache) {
    currentTache.value = tache;
  }
  return {
    codirs,
    currentCodir,
    currentOrdreDuJour,
    currentDossier,
    currentTache,
    loading,
    error,
    getCodirs,
    fetchCodir,
    createCodir,
    updateCodir,
    deleteCodir,
    attachFromPrevious,
    createOrdreDuJour,
    addDossier,
    removeDossier,
    attachOrdreDuJour,
    detachOrdreDuJour,
    attachTache,
    updateTachePivot,
    detachTache,
    updateTache,
    setCurrentCodir,
    setCurrentOrdreDuJour,
    setCurrentDossier,
    setCurrentTache
  };
});

export { STATUT_OPTIONS as S, extractTimeInput as a, extractTime as b, extractDateInput as e, formatDateFR as f, getStatutConfig as g, useCodirsStore as u };
//# sourceMappingURL=codirs-D_To-40U.mjs.map
