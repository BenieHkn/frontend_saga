// stores/codirs.js
import { defineStore } from 'pinia'
import { useCodir } from '@/composables/codirs/useCodir'
import { useOrdreDuJour } from '@/composables/ordres-du-jour/useOrdreDuJour'

export const useCodirsStore = defineStore('codirs', () => {

  // ── Initialisation depuis localStorage ──────────────────────────────────
  const getStored = () => {
    if (process.client) {
      return localStorage.getItem("currentCodir") || null
    }
    return null
  }

  const codirs = ref([])
  const currentCodir = ref(getStored())
  const loading = ref(false)
  const error = ref(null)
  const currentOrdreDuJour = ref(null)
  const currentDossier = ref(null)
  const currentTache = ref(null)

  const api = useCodir()
  const apiOdj = useOrdreDuJour()

  watch(api.loading, (v) => { loading.value = v })
  watch(api.error, (v) => { error.value = v })


  async function getCodirs() {
    codirs.value = await api.getCodirs()
  }

  async function fetchCodir(id) {
    currentCodir.value = await api.getCodir(id)
    return currentCodir.value
  }

  async function createCodir(payload) {
    const codir = await api.createCodir(payload)
    codirs.value.unshift(codir)
    currentCodir.value = codir
    return codir
  }

  async function createOrdreDuJour(body) {
    loading.value = true
    await apiOdj.createOrdre(body)
    console.log("création d'un nouvel ordre du jour")
    await fetchCodir(body.codir_id)
    loading.value = false
  }

  async function addDossier(ordreId, body) {
    loading.value = true
    try {
      const response = await apiOdj.addDossier(ordreId, body)
      console.log("Ajout d'un nouveau dossier à l'ordre du jour", ordreId)
      
      // Recharger directement les dossiers depuis l'API
      currentOrdreDuJour.value = response
    } catch (error) {
      console.error("Erreur lors de l'ajout du dossier:", error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function removeDossier(ordreId, dossierId) {
    loading.value = true
    try {
      const response = await apiOdj.removeDossier(ordreId, dossierId)
      console.log("Suppression du dossier", dossierId, "de l'ordre du jour", ordreId)
      
      // Recharger directement les dossiers depuis l'API
      currentOrdreDuJour.value = response
    } catch (error) {
      console.error("Erreur lors de la suppression du dossier:", error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function updateCodir(id, payload) {
    const updated = await api.updateCodir(id, payload)
    const idx = codirs.value.findIndex(c => c.id === id)
    if (idx !== -1) codirs.value[idx] = updated
    if (currentCodir.value?.id === id) currentCodir.value = updated
    return updated
  }

  async function deleteCodir(id) {
    await api.deleteCodir(id)
    codirs.value = codirs.value.filter(c => c.id !== id)
    if (currentCodir.value?.id === id) currentCodir.value = null
  }

  async function attachFromPrevious(id) {
    const updated = await api.attachPrev(id)
    if (currentCodir.value?.id === id) currentCodir.value = updated
    return updated
  }

  // ── Ordres du jour ────────────────────────────────────────────────────────

  async function attachOrdreDuJour(codirId, ordreId) {
    await api.attachODJ(codirId, ordreId)
    await fetchCodir(codirId)
  }

  async function detachOrdreDuJour(codirId, ordreId) {
    const updated = await api.detachODJ(codirId, ordreId)
    currentCodir.value = updated // ← direct, pas de second appel API
  }

  // ── Tâches ────────────────────────────────────────────────────────────────

  async function attachTache(codirId, body) {
    await api.attachTache(codirId, body)
    await fetchCodir(codirId)
  }

  async function updateTachePivot(codirId, tacheId, body) {
    await api.updateTachePivot(codirId, tacheId, body)
    await fetchCodir(codirId)
  }

  async function detachTache(codirId, tacheId) {
    await api.detachTache(codirId, tacheId)
    await fetchCodir(codirId)
  }

  async function updateTache(tacheId, payload) {
    const updated = await api.updateTache(tacheId, payload)
    if (currentTache.value?.id === tacheId) currentTache.value = updated
    await fetchCodir(currentCodir.value.id)
    return updated
  }

  // ── Setters ───────────────────────────────────────────────────────────────

  function setCurrentCodir(codir) {
    currentCodir.value = codir
  }

  function setCurrentOrdreDuJour(odj) {
    currentOrdreDuJour.value = odj
    currentDossier.value = null
    currentTache.value = null
  }

  function setCurrentDossier(dossier) {
    currentDossier.value = dossier
    currentTache.value = null
  }

  function setCurrentTache(tache) {
    currentTache.value = tache
  }

  return {
    codirs, currentCodir, currentOrdreDuJour, currentDossier, currentTache, loading, error,
    getCodirs, fetchCodir, createCodir, updateCodir, deleteCodir, attachFromPrevious, createOrdreDuJour, addDossier, removeDossier,
    attachOrdreDuJour, detachOrdreDuJour,
    attachTache, updateTachePivot, detachTache, updateTache,
    setCurrentCodir, setCurrentOrdreDuJour, setCurrentDossier, setCurrentTache,
  }
})