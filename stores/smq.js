import { defineStore } from 'pinia'

export const useSmqStore = defineStore('smq', () => {
  // ── Indicateur sélectionné (pour navigation saisie / validation) ──────────
  const indicateurCourant = ref(null)
  const periodeCourante   = ref(null)   // { label: 'T2 2026', periode_id: 5 }
  const saisieId          = ref(null)   // ID de la SaisieIndicateur en cours d'édition

  const setIndicateurCourant = (indicateur, periode = null) => {
    indicateurCourant.value = indicateur
    periodeCourante.value   = periode
  }

  const setSaisieId = (id) => { saisieId.value = id }

  const clearIndicateurCourant = () => {
    indicateurCourant.value = null
    periodeCourante.value   = null
    saisieId.value          = null
  }

  // ── Filtre exercice global ──────────────────────────────────────────────────
  const exerciceCourant = ref(new Date().getFullYear())
  const setExercice = (annee) => { exerciceCourant.value = annee }

  return {
    indicateurCourant,
    periodeCourante,
    saisieId,
    exerciceCourant,
    setIndicateurCourant,
    setSaisieId,
    clearIndicateurCourant,
    setExercice,
  }
}, {
  persist: true,
})
