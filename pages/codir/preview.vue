<script setup>
import { formatDateFR, formatDateShort, extractTime, getStatutConfig, useCodir } from '@/composables/codirs/useCodir'

definePageMeta({ title: 'Aperçu CODIR' })

const router = useRouter()
const toast = useNuxtApp().$toast ?? useToast()

// Clear localStorage keys used as "current*" when returning
const clearCurrents = () => {
  if (!process.client) return
  try {
    localStorage.removeItem('currentCodir')
    localStorage.removeItem('currentOrdreDuJour')
    localStorage.removeItem('currentDossier')
    localStorage.removeItem('currentTache')
    localStorage.removeItem(`presence-${id}`)
    localStorage.removeItem(`codir_step_${id}`)
  } catch (e) { }
}
const handleReturn = () => {
  localStorage.setItem(`codir_step_${codir.value.id}`, '2')
  router.back()
}

// ── Données depuis localStorage ───────────────────────────────────────────────
const codir = ref(null)

// ── Composable ────────────────────────────────────────────────────────────────
const { cloturerCodir, generatePdf, downloadPdf, getCodir, getPresences } = useCodir()

// ── Clôture ───────────────────────────────────────────────────────────────────
const showCloture = ref(false)
const cloturePending = ref(false)

const getCachedMembresById = () => {
  if (!process.client) return new Map()

  try {
    const membres = JSON.parse(localStorage.getItem('membres') ?? '[]')
    return new Map((membres ?? []).map((membre) => [Number(membre.id), membre]))
  } catch {
    return new Map()
  }
}

const isPresenceValidated = (presence) =>
  presence?.has_validate === true

const isMembreExemptValidation = (presence, cachedMembresById) => {
  const membre = presence?.membre ?? cachedMembresById.get(Number(presence?.membre_id))
  const entiteCode =
    membre?.entite_user?.entite?.code ??
    membre?.entiteUser?.entite?.code ??
    membre?.entite_user?.code ??
    membre?.entiteUser?.code

  return String(entiteCode ?? '').toUpperCase() === 'DGML'
}

const getUnvalidatedPresentPresences = async () => {
  const response = await getPresences(codir.value.id)
  const presences = response?.presences || response || []
  const cachedMembresById = getCachedMembresById()

  if (!presences.length) return [{ missingPresences: true }]

  return presences.filter((presence) => {
    const isPresent = presence?.is_present === true
    if (!isPresent) return false
    if (isMembreExemptValidation(presence, cachedMembresById)) return false
    return !isPresenceValidated(presence)
  })
}

const confirmerCloture = async () => {
  if (!codir.value) return
  cloturePending.value = true
  try {
    const unvalidatedPresences = await getUnvalidatedPresentPresences()

    if (unvalidatedPresences.length) {
      toast.add({
        title: 'Clôture impossible',
        description: 'Toutes les entités présentes doivent valider le CODIR avant la clôture.',
        color: 'red',
        icon: 'i-heroicons-exclamation-circle',
      })
      return
    }

    await cloturerCodir(codir.value.id)
    // Nettoyage des clés locales liées au CODIR clôturé
    try {
      const id = codir.value.id
      clearCurrents()
    } catch (err) {
      // ignore
    }

    toast.add({ title: 'CODIR clôturé', description: 'Le CODIR a été clôturé avec succès.', color: 'green', icon: 'i-heroicons-check-circle' })
    showCloture.value = false
    navigateTo('/codir')
  } catch (e) {
    toast.add({ title: 'Erreur', description: 'Impossible de clôturer le CODIR.', color: 'red', icon: 'i-heroicons-x-circle' })
  } finally {
    cloturePending.value = false
  }
}

// ── Génération PDF ────────────────────────────────────────────────────────────
const pdfGenerating = ref(false)
const showPdfGeneratedModal = ref(false)
const generatedPdfName = ref('')

const handleGeneratePdf = async () => {
  if (!codir.value) return
  pdfGenerating.value = true
  try {
    const result = await generatePdf(codir.value.id)
    codir.value = { ...codir.value, url: result.url }
    localStorage.setItem('currentCodir', JSON.stringify(codir.value))

    const dateStr = codir.value.date
      ? new Date(codir.value.date)
        .toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' })
        .replace(/\//g, '-')
      : String(codir.value.id)
    generatedPdfName.value = `CODIR_${dateStr}.pdf`

    showPdfGeneratedModal.value = true
  } catch (e) {
    toast.add({ title: 'Erreur', description: 'Impossible de générer le PDF.', color: 'red', icon: 'i-heroicons-x-circle' })
  } finally {
    pdfGenerating.value = false
  }
}

// ── Téléchargement PDF ────────────────────────────────────────────────────────
const pdfDownloading = ref(false)

const handleDownloadPdf = async (item) => {
  const id = item?.id ?? codir.value?.id
  if (!id) return console.error('ID du CODIR introuvable')
  try {
    pdfDownloading.value = true
    const blob = await downloadPdf(id)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `codir_${id}.pdf`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (e) {
    console.error('Erreur téléchargement :', e)
  } finally {
    pdfDownloading.value = false
  }
}

// ── Helpers d'affichage ───────────────────────────────────────────────────────
const getMembresLabel = (membres) =>
  membres?.map(m => `${m.entite_user?.entite?.code ?? ''} `).join(', ') ?? '—'

const statutTacheLabel = (s) => ({
  en_attente: 'En attente', en_cours: 'En cours',
  terminée: 'Terminée', terminee: 'Terminée',
  realise: 'Réalisé', suspendu: 'Suspendu',
}[s] ?? s ?? '')

const rafraichir = async () => {
  if (!codir.value) return
  codir.value = await getCodir(codir.value.id)
  localStorage.setItem('currentCodir', JSON.stringify(codir.value))
}

// ── Listing validations ───────────────────────────────────────────────────────
const presencesGroupees = ref({ valides: [], nonValides: [], exempts: [] })
const presencesLoading = ref(false)

const chargerPresences = async () => {
  if (!codir.value) return
  presencesLoading.value = true
  try {
    const response = await getPresences(codir.value.id)
    const presences = response?.presences || response || []
    const cachedMembresById = getCachedMembresById()

    const valides = []
    const nonValides = []
    const exempts = []

    for (const presence of presences) {
      if (!presence.is_present) continue

      const codeEntite = codeEntiteMembre(presence, cachedMembresById)

      if (isMembreExemptValidation(presence, cachedMembresById)) {
        exempts.push(codeEntite)
      } else if (isPresenceValidated(presence)) {
        valides.push(codeEntite)
      } else {
        nonValides.push(codeEntite)
      }
    }

    presencesGroupees.value = { valides, nonValides, exempts }
  } finally {
    presencesLoading.value = false
  }
}

const codeEntiteMembre = (presence, map) => {
  const membre = presence?.membre ?? map?.get(Number(presence?.membre_id))
  const entiteCode =
    membre?.entite_user?.entite?.code

  return entiteCode ? String(entiteCode).toUpperCase() : `Entité inconnue (#${presence.membre_id})`
}

// ── Listing validations ───────────────────────────────────────────────────────
const showValidations = ref(true) // true = démasqué par défaut, mettez false pour le masquer au chargement
// const presencesGroupees = ref({ valides: [], nonValides: [], exempts: [] })
// const presencesLoading = ref(false)

onMounted(() => {
  const raw = localStorage.getItem('currentCodir')
  if (raw) {
    codir.value = JSON.parse(raw)
    rafraichir()
    chargerPresences()
  }
})
</script>

<template>
  <div class="bg-gray-50 dark:bg-gray-900 p-6">

    <div
      class="sticky top-20 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center justify-between gap-4 shadow-sm">
      <div class="flex items-center gap-3">
        <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" size="sm" @click="handleReturn()">
          Retour
        </UButton>
        <span class="text-sm font-medium text-gray-600 dark:text-gray-300">Aperçu du CODIR</span>
      </div>

      <div class="flex items-center gap-2">
        <UButton icon="i-heroicons-document-arrow-up" color="violet" variant="soft" size="sm" :loading="pdfGenerating"
          :disabled="pdfGenerating" @click="handleGeneratePdf">
          {{ pdfGenerating ? 'Génération…' : 'Générer PDF' }}
        </UButton>

        <UButton v-if="codir?.url !== null" icon="i-heroicons-arrow-down-tray" color="emerald" variant="soft" size="sm"
          :loading="pdfDownloading" :disabled="pdfDownloading" @click="handleDownloadPdf(codir)">
          {{ pdfDownloading ? 'Téléchargement…' : 'Télécharger PDF' }}
        </UButton>

        <UButton v-if="codir?.url !== null && codir?.statut !== 'clos'" icon="i-heroicons-lock-closed" color="red"
          variant="soft" size="sm" :disabled="codir?.url === null" @click="showCloture = true">
          Clôturer
        </UButton>
        <span v-else-if="codir && codir?.statut === 'clos'"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-400 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600">
          <UIcon name="i-heroicons-lock-closed" class="w-3.5 h-3.5" />
          Clôturé
        </span>
      </div>
    </div>

    <UModal v-model="showPdfGeneratedModal" :ui="{ width: 'sm:max-w-md' }" :prevent-close="pdfDownloading">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center gap-3">
              <div
                class="flex-shrink-0 w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">PDF généré avec succès</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Le fichier est prêt au téléchargement.</p>
              </div>
            </div>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" @click="showPdfGeneratedModal = false" />
          </div>
        </template>

        <div
          class="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3">
          <UIcon name="i-heroicons-document-text" class="w-8 h-8 text-red-500 flex-shrink-0" />
          <div class="min-w-0">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Nom du fichier</p>
            <p class="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{{ generatedPdfName }}</p>
          </div>
        </div>

        <p class="text-sm text-gray-500 dark:text-gray-400 mt-4">
          Voulez-vous télécharger ce fichier maintenant ?
        </p>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton color="gray" variant="ghost" :disabled="pdfDownloading" @click="showPdfGeneratedModal = false">
              Plus tard
            </UButton>
            <div class="gap-3">
              <CustomButton color="emerald" icon="i-heroicons-arrow-down-tray" :loading="pdfDownloading"
                @click="handleDownloadPdf(codir)" :btnText="pdfDownloading ? 'Téléchargement' : 'Télécharger'" />
            </div>
          </div>
        </template>
      </UCard>
    </UModal>

    <UModal v-model="showCloture" :ui="{ width: 'sm:max-w-md' }">
      <UCard>
        <template #header>
          <div class="flex items-center gap-3">
            <div
              class="flex-shrink-0 w-9 h-9 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <UIcon name="i-heroicons-lock-closed" class="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white">Clôturer ce CODIR ?</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Cette action est irréversible.</p>
            </div>
          </div>
        </template>

        <p class="text-sm text-gray-600 dark:text-gray-300">
          Vous êtes sur le point de clôturer le CODIR du
          <strong class="text-gray-900 dark:text-white">{{ formatDateFR(codir?.date) }}</strong>.
          <br><br>
          Une fois clôturé, le CODIR ne pourra plus être modifié.
        </p>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton color="gray" variant="ghost" :disabled="cloturePending" @click="showCloture = false">
              Annuler
            </UButton>
            <UButton color="red" icon="i-heroicons-lock-closed" :loading="cloturePending" @click="confirmerCloture">
              Confirmer la clôture
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <div v-if="codir" class="mx-auto my-8 bg-white shadow-xl rounded-xl overflow-hidden">

      <div v-if="!presencesLoading" class="px-10 py-5 border-b border-gray-100 dark:border-gray-700">
        <div class="flex items-center justify-between cursor-pointer group mb-4"
          @click="showValidations = !showValidations">
          <h2
            class="text-sm font-semibold text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200 uppercase tracking-wide transition-colors">
            Validation des présences
          </h2>
          <UButton :icon="showValidations ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'" color="gray"
            variant="ghost" size="sm" />
        </div>

        <div v-show="showValidations" class="grid grid-cols-1 sm:grid-cols-3 gap-4 transition-all">

          <div
            class="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-4">
            <div class="flex items-center gap-2 mb-3">
              <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-emerald-500" />
              <span class="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                Validé ({{ presencesGroupees.valides.length }})
              </span>
            </div>
            <ul v-if="presencesGroupees.valides.length" class="space-y-1">
              <li v-for="code in presencesGroupees.valides" :key="code"
                class="text-sm text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 font-medium">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block flex-shrink-0"></span>
                {{ code }}
              </li>
            </ul>
            <p v-else class="text-xs italic text-emerald-600/60 dark:text-emerald-500/50">Aucun</p>
          </div>

          <div class="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4">
            <div class="flex items-center gap-2 mb-3">
              <UIcon name="i-heroicons-clock" class="w-4 h-4 text-amber-500" />
              <span class="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                En attente ({{ presencesGroupees.nonValides.length }})
              </span>
            </div>
            <ul v-if="presencesGroupees.nonValides.length" class="space-y-1">
              <li v-for="code in presencesGroupees.nonValides" :key="code"
                class="text-sm text-amber-800 dark:text-amber-300 flex items-center gap-1.5 font-medium">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block flex-shrink-0"></span>
                {{ code }}
              </li>
            </ul>
            <p v-else class="text-xs italic text-amber-600/60 dark:text-amber-500/50">Aucun</p>
          </div>

          <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4">
            <div class="flex items-center gap-2 mb-3">
              <UIcon name="i-heroicons-shield-check" class="w-4 h-4 text-gray-400" />
              <span class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Exempts ({{ presencesGroupees.exempts.length }})
              </span>
            </div>
            <ul v-if="presencesGroupees.exempts.length" class="space-y-1">
              <li v-for="code in presencesGroupees.exempts" :key="code"
                class="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5 font-medium">
                <span class="w-1.5 h-1.5 rounded-full bg-gray-300 inline-block flex-shrink-0"></span>
                {{ code }}
              </li>
            </ul>
            <p v-else class="text-xs italic text-gray-400/60">Aucun</p>
          </div>

        </div>
      </div>

      <div v-else class="px-10 py-4 border-b border-gray-100 dark:border-gray-700">
        <div class="flex items-center gap-2 text-sm text-gray-400">
          <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
          Chargement des présences…
        </div>
      </div>

      <div class="bg-gradient-to-r from-teal-800 to-blue-900 text-white px-10 py-8">
        <div class="text-xs font-semibold tracking-widest uppercase text-blue-300 mb-2">Compte rendu</div>
        <h1 class="text-3xl font-bold mb-3">Réunion CODIR</h1>
        <div class="flex flex-wrap items-center gap-6 text-sm text-blue-100">
          <span class="flex items-center gap-1.5">
            <span class="opacity-60">Date :</span>
            <strong class="text-white">{{ formatDateFR(codir.date) }}</strong>
          </span>
          <span class="flex items-center gap-1.5">
            <span class="opacity-60">Horaire :</span>
            <strong class="text-white">{{ extractTime(codir.heure_debut) }} – {{ extractTime(codir.heure_fin)
            }}</strong>
          </span>
          <span
            class="text-xs font-semibold px-3 py-1 rounded-full capitalize bg-white/10 text-white border border-white/20">
            {{ getStatutConfig(codir.statut).label }}
          </span>
        </div>
      </div>

      <div class="px-10 py-8 space-y-10">

        <section v-for="(odj, odjIdx) in codir.ordres_du_jour" :key="odj.id">
          <h2 class="text-base font-bold text-slate-800 border-b-2 border-violet-500 pb-2 mb-5 flex items-center gap-2">
            <span class="w-1.5 h-5 bg-violet-500 rounded-full inline-block"></span>
            {{ odjIdx + 1 }} — {{ odj.libelle }}
          </h2>

          <div v-for="dossier in odj.dossiers" :key="dossier.id" class="mb-6 pl-4 border-l-2 border-slate-200">
            <div class="flex flex-col gap-0.5 mb-3">
              <span class="text-slate-400 text-xs font-bold uppercase tracking-wide">Dossier</span>
              <span class="font-semibold text-slate-800 text-sm">{{ dossier.libelle }}</span>
            </div>

            <div v-for="action in dossier.actions" :key="action.id" class="mb-4 pl-4 border-l-2 border-blue-100">
              <div class="flex flex-col gap-0.5 mb-2">
                <span class="text-blue-500 text-xs font-bold uppercase tracking-wide">Action</span>
                <span class="font-medium text-slate-800 text-sm">{{ action.libelle }}</span>
              </div>

              <div v-if="action.taches?.length" class="pl-4 border-l-2 border-blue-50 mb-3">
                <div class="text-xs font-bold text-blue-500 uppercase tracking-wide mb-2">Tâches</div>
                <table class="w-full text-xs border-collapse">
                  <thead>
                    <tr class="bg-slate-50 text-slate-500 uppercase tracking-wide">
                      <th class="text-left px-2 py-1.5 border border-slate-200">Tâche</th>
                      <th class="text-center px-2 py-1.5 border border-slate-200 w-16">Priorité</th>
                      <th class="text-center px-2 py-1.5 border border-slate-200 w-20">Début</th>
                      <th class="text-center px-2 py-1.5 border border-slate-200 w-20">Fin</th>
                      <th class="text-left px-2 py-1.5 border border-slate-200">Membres</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="tache in action.taches" :key="tache.id" class="even:bg-slate-50/40">
                      <td class="px-2 py-1.5 border border-slate-200 text-slate-700">{{ tache.intitule }}</td>
                      <td class="px-2 py-1.5 border border-slate-200 text-center">
                        <span :class="{
                          'text-red-600 font-semibold': tache.priorite === 'Haute',
                          'text-amber-600 font-semibold': tache.priorite === 'Moyenne',
                          'text-green-600 font-semibold': tache.priorite === 'Basse',
                        }">{{ tache.priorite }}</span>
                      </td>
                      <td class="px-2 py-1.5 border border-slate-200 text-center text-slate-500">
                        {{ formatDateShort(tache.date_debut) }}
                      </td>
                      <td class="px-2 py-1.5 border border-slate-200 text-center text-slate-500">
                        {{ formatDateShort(tache.date_fin) }}
                      </td>
                      <td class="px-2 py-1.5 border border-slate-200 text-slate-500">
                        {{ getMembresLabel(tache.membres) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div v-for="activite in action.activites" :key="activite.id"
                class="mb-3 pl-4 border-l-2 border-violet-100">
                <div class="text-xs font-semibold text-violet-600 mb-1.5">▸ {{ activite.libelle }}</div>
                <table v-if="activite.taches?.length" class="w-full text-xs border-collapse">
                  <thead>
                    <tr class="bg-slate-50 text-slate-500 uppercase tracking-wide">
                      <th class="text-left px-2 py-1.5 border border-slate-200">Tâche</th>
                      <th class="text-center px-2 py-1.5 border border-slate-200 w-16">Priorité</th>
                      <th class="text-center px-2 py-1.5 border border-slate-200 w-20">Début</th>
                      <th class="text-center px-2 py-1.5 border border-slate-200 w-20">Fin</th>
                      <th class="text-left px-2 py-1.5 border border-slate-200">Membres</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="tache in activite.taches" :key="tache.id" class="even:bg-slate-50/40">
                      <td class="px-2 py-1.5 border border-slate-200 text-slate-700">{{ tache.intitule }}</td>
                      <td class="px-2 py-1.5 border border-slate-200 text-center">
                        <span
                          :class="{ 'text-red-600 font-semibold': tache.priorite === 'Haute', 'text-amber-600 font-semibold': tache.priorite === 'Moyenne', 'text-green-600 font-semibold': tache.priorite === 'Basse' }">
                          {{ tache.priorite }}
                        </span>
                      </td>
                      <td class="px-2 py-1.5 border border-slate-200 text-center text-slate-500">{{
                        formatDateShort(tache.date_debut) }}</td>
                      <td class="px-2 py-1.5 border border-slate-200 text-center text-slate-500">{{
                        formatDateShort(tache.date_fin) }}</td>
                      <td class="px-2 py-1.5 border border-slate-200 text-slate-500">{{ getMembresLabel(tache.membres)
                      }}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p v-else class="text-slate-400 text-xs italic ml-2">Aucune tâche.</p>
              </div>

              <p v-if="!action.activites?.length" class="text-slate-400 text-xs italic pl-4">Aucune activité.</p>
            </div>

            <div v-if="dossier.activites?.length" class="pl-4 border-l-2 border-amber-100">
              <div class="text-xs font-bold text-amber-600 uppercase tracking-wide mb-2">Activités directes</div>
              <div v-for="activite in dossier.activites" :key="activite.id" class="mb-3 pl-2">
                <div class="text-xs font-semibold text-violet-600 mb-1.5">▸ {{ activite.libelle }}</div>
                <table v-if="activite.taches?.length" class="w-full text-xs border-collapse">
                  <thead>
                    <tr class="bg-slate-50 text-slate-500 uppercase tracking-wide">
                      <th class="text-left px-2 py-1.5 border border-slate-200">Tâche</th>
                      <th class="text-center px-2 py-1.5 border border-slate-200 w-16">Priorité</th>
                      <th class="text-center px-2 py-1.5 border border-slate-200 w-20">Début</th>
                      <th class="text-center px-2 py-1.5 border border-slate-200 w-20">Fin</th>
                      <th class="text-left px-2 py-1.5 border border-slate-200">Membres</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="tache in activite.taches" :key="tache.id" class="even:bg-slate-50/40">
                      <td class="px-2 py-1.5 border border-slate-200 text-slate-700">{{ tache.intitule }}</td>
                      <td class="px-2 py-1.5 border border-slate-200 text-center">
                        <span
                          :class="{ 'text-red-600 font-semibold': tache.priorite === 'Haute', 'text-amber-600 font-semibold': tache.priorite === 'Moyenne', 'text-green-600 font-semibold': tache.priorite === 'Basse' }">
                          {{ tache.priorite }}
                        </span>
                      </td>
                      <td class="px-2 py-1.5 border border-slate-200 text-center text-slate-500">{{
                        formatDateShort(tache.date_debut) }}</td>
                      <td class="px-2 py-1.5 border border-slate-200 text-center text-slate-500">{{
                        formatDateShort(tache.date_fin) }}</td>
                      <td class="px-2 py-1.5 border border-slate-200 text-slate-500">{{ getMembresLabel(tache.membres)
                      }}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p v-else class="text-slate-400 text-xs italic ml-2">Aucune tâche.</p>
              </div>
            </div>

            <div v-if="dossier.taches?.length" class="pl-4 border-l-2 border-green-100 mt-3">
              <div class="text-xs font-bold text-green-600 uppercase tracking-wide mb-2">Tâches directes du dossier
              </div>
              <table class="w-full text-xs border-collapse">
                <thead>
                  <tr class="bg-slate-50 text-slate-500 uppercase tracking-wide">
                    <th class="text-left px-2 py-1.5 border border-slate-200">Tâche</th>
                    <th class="text-center px-2 py-1.5 border border-slate-200 w-16">Priorité</th>
                    <th class="text-center px-2 py-1.5 border border-slate-200 w-20">Début</th>
                    <th class="text-center px-2 py-1.5 border border-slate-200 w-20">Fin</th>
                    <th class="text-left px-2 py-1.5 border border-slate-200">Membres</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="tache in dossier.taches" :key="tache.id" class="even:bg-slate-50/40">
                    <td class="px-2 py-1.5 border border-slate-200 text-slate-700">{{ tache.intitule }}</td>
                    <td class="px-2 py-1.5 border border-slate-200 text-center">
                      <span :class="{
                        'text-red-600 font-semibold': tache.priorite === 'Haute',
                        'text-amber-600 font-semibold': tache.priorite === 'Moyenne',
                        'text-green-600 font-semibold': tache.priorite === 'Basse',
                      }">{{ tache.priorite }}</span>
                    </td>
                    <td class="px-2 py-1.5 border border-slate-200 text-center text-slate-500">{{
                      formatDateShort(tache.date_debut) }}</td>
                    <td class="px-2 py-1.5 border border-slate-200 text-center text-slate-500">{{
                      formatDateShort(tache.date_fin) }}</td>
                    <td class="px-2 py-1.5 border border-slate-200 text-slate-500">{{ getMembresLabel(tache.membres) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p v-if="!dossier.actions?.length && !dossier.activites?.length" class="text-slate-400 text-xs italic pl-4">
              Aucune action ni activité dans ce dossier.
            </p>
          </div>

          <p v-if="!odj.dossiers?.length" class="text-slate-400 text-xs italic pl-4">
            Aucun dossier pour cet ordre du jour.
          </p>
        </section>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center py-32 text-gray-400">
      <span class="text-5xl mb-4">📄</span>
      <p class="text-sm">Aucun CODIR chargé. Retournez sur la page de détail.</p>
      <UButton class="mt-4" color="gray" variant="ghost" @click="router.back()">Retour</UButton>
    </div>

  </div>
</template>