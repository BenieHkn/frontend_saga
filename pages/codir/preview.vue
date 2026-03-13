<script setup>
import { formatDateFR, formatDateShort, extractTime, getStatutConfig, useCodir } from '@/composables/codirs/useCodir'

definePageMeta({ title: 'Aperçu CODIR' })

const router = useRouter()
const toast = useNuxtApp().$toast ?? useToast()

// ── Données depuis localStorage ───────────────────────────────────────────────
const codir = ref(null)

onMounted(() => {
  const raw = localStorage.getItem('currentCodir')
  if (raw) codir.value = JSON.parse(raw)
})

// ── Composable ────────────────────────────────────────────────────────────────
const { cloturerCodir, generatePdf, downloadPdf } = useCodir()

// ── Clôture ───────────────────────────────────────────────────────────────────
const showCloture = ref(false)
const cloturePending = ref(false)

const confirmerCloture = async () => {
  if (!codir.value) return
  cloturePending.value = true
  try {
    await cloturerCodir(codir.value.id)
    codir.value = { ...codir.value, statut: 'clos' }
    localStorage.setItem('currentCodir', JSON.stringify(codir.value))
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
  membres?.map(m => `${m.entite_user?.user?.prenom ?? ''} ${m.entite_user?.user?.nom ?? ''} (${m.role})`).join(', ') ?? '—'

const statutTacheLabel = (s) => ({
  en_attente: 'En attente', en_cours: 'En cours',
  terminée: 'Terminée', terminee: 'Terminée',
  realise: 'Réalisé', suspendu: 'Suspendu',
}[s] ?? s ?? '')
</script>

<template>
  <div class="bg-gray-50 dark:bg-gray-900 p-6">

    <!-- ── Barre d'outils ─────────────────────────────────────────────────── -->
    <div
      class="sticky top-20 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center justify-between gap-4 shadow-sm">
      <div class="flex items-center gap-3">
        <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" size="sm" @click="router.back()">
          Retour
        </UButton>
        <span class="text-sm font-medium text-gray-600 dark:text-gray-300">Aperçu du CODIR</span>
      </div>

      <div class="flex items-center gap-2">

        <!-- Générer PDF -->
        <UButton icon="i-heroicons-document-arrow-up" color="violet" variant="soft" size="sm" :loading="pdfGenerating"
          :disabled="pdfGenerating" @click="handleGeneratePdf">
          {{ pdfGenerating ? 'Génération…' : 'Générer PDF' }}
        </UButton>

        <!-- Télécharger PDF (visible uniquement si url présente) -->
        <UButton v-if="codir?.url !== null" icon="i-heroicons-arrow-down-tray" color="emerald" variant="soft" size="sm"
          :loading="pdfDownloading" :disabled="pdfDownloading" @click="handleDownloadPdf(codir)">
          {{ pdfDownloading ? 'Téléchargement…' : 'Télécharger PDF' }}
        </UButton>

        <!-- Clôturer -->
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

    <!-- ── Modale : PDF généré avec succès ───────────────────────────────── -->
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

        <!-- Nom du fichier -->
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

    <!-- ── Modale clôture ─────────────────────────────────────────────────── -->
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

    <!-- ── Contenu ────────────────────────────────────────────────────────── -->
    <div v-if="codir" class="mx-auto my-8 bg-white shadow-xl rounded-xl overflow-hidden">

      <!-- En-tête -->
      <div class="bg-gradient-to-r from-slate-800 to-blue-900 text-white px-10 py-8">
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
        <div v-if="codir.url" class="mt-4">
          <a :href="codir.url" target="_blank"
            class="inline-flex items-center gap-1.5 text-xs text-blue-200 hover:text-white underline underline-offset-2 transition-colors">
            <UIcon name="i-heroicons-document-arrow-down" class="w-3.5 h-3.5" />
            Voir le PDF enregistré
          </a>
        </div>
      </div>

      <div class="px-10 py-8 space-y-10">

        <!-- ── Suivi des tâches ──────────────────────────────────────────── -->
        <section v-if="codir.taches?.length">
          <h2 class="text-base font-bold text-slate-800 border-b-2 border-blue-600 pb-2 mb-4 flex items-center gap-2">
            <span class="w-1.5 h-5 bg-blue-600 rounded-full inline-block"></span>
            1 — Adoption du compte rendu &amp; suivi des tâches prescrites
          </h2>
          <table class="w-full text-sm border-collapse">
            <thead>
              <tr class="bg-slate-100 text-slate-600 text-xs uppercase tracking-wide">
                <th class="text-left px-3 py-2 border border-slate-200">Tâche</th>
                <th class="text-center px-3 py-2 border border-slate-200 w-20">Priorité</th>
                <th class="text-center px-3 py-2 border border-slate-200 w-24">Statut</th>
                <th class="text-center px-3 py-2 border border-slate-200 w-20">Avancement</th>
                <th class="text-left px-3 py-2 border border-slate-200">Membres</th>
                <th class="text-left px-3 py-2 border border-slate-200">Commentaire</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="tache in codir.taches" :key="tache.id" class="hover:bg-slate-50 even:bg-slate-50/50">
                <td class="px-3 py-2 border border-slate-200 font-medium text-slate-800">{{ tache.intitule }}</td>
                <td class="px-3 py-2 border border-slate-200 text-center">
                  <span :class="{
                    'text-red-600 bg-red-50 px-2 py-0.5 rounded-full text-xs font-semibold': tache.priorite === 'Haute',
                    'text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full text-xs font-semibold': tache.priorite === 'Moyenne',
                    'text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-xs font-semibold': tache.priorite === 'Basse',
                  }">{{ tache.priorite }}</span>
                </td>
                <td class="px-3 py-2 border border-slate-200 text-center text-xs">{{
                  statutTacheLabel(tache.pivot?.statut)
                  }}</td>
                <td class="px-3 py-2 border border-slate-200 text-center">
                  <div class="flex flex-col items-center gap-1">
                    <span class="text-xs font-mono font-semibold text-blue-700">{{ tache.pivot?.progression ?? 0
                      }}%</span>
                    <div class="w-full bg-gray-200 rounded-full h-1.5">
                      <div class="bg-blue-500 h-1.5 rounded-full" :style="`width:${tache.pivot?.progression ?? 0}%`">
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-3 py-2 border border-slate-200 text-xs text-slate-600">{{ getMembresLabel(tache.membres)
                  }}
                </td>
                <td class="px-3 py-2 border border-slate-200 text-xs text-slate-500 italic">{{ tache.pivot?.commentaire
                  ??
                  '—' }}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <!-- ── Ordres du jour ───────────────────────────────────────────── -->
        <section v-for="(odj, odjIdx) in codir.ordres_du_jour" :key="odj.id">
          <h2 class="text-base font-bold text-slate-800 border-b-2 border-violet-500 pb-2 mb-5 flex items-center gap-2">
            <span class="w-1.5 h-5 bg-violet-500 rounded-full inline-block"></span>
            {{ codir.taches?.length ? odjIdx + 2 : odjIdx + 1 }} — {{ odj.libelle }}
          </h2>

          <div v-for="dossier in odj.dossiers" :key="dossier.id" class="mb-6 pl-4 border-l-2 border-slate-200">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-slate-400 text-xs font-bold uppercase tracking-wide shrink-0">Dossier</span>
              <span class="font-semibold text-slate-700 text-sm">{{ dossier.libelle }}</span>
            </div>

            <div v-for="action in dossier.actions" :key="action.id" class="mb-4 pl-4 border-l-2 border-blue-100">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-blue-500 text-xs font-bold uppercase tracking-wide shrink-0">Action</span>
                <span class="font-medium text-slate-700 text-sm">{{ action.libelle }}</span>
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
                          :class="{ 'text-red-600 font-semibold': tache.priorite === 'Haute', 'text-amber-600 font-semibold': tache.priorite === 'Moyenne', 'text-green-600 font-semibold': tache.priorite === 'Basse' }">{{
                          tache.priorite }}</span>
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
                          :class="{ 'text-red-600 font-semibold': tache.priorite === 'Haute', 'text-amber-600 font-semibold': tache.priorite === 'Moyenne', 'text-green-600 font-semibold': tache.priorite === 'Basse' }">{{
                          tache.priorite }}</span>
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

    <!-- Vide -->
    <div v-else class="flex flex-col items-center justify-center py-32 text-gray-400">
      <span class="text-5xl mb-4">📄</span>
      <p class="text-sm">Aucun CODIR chargé. Retournez sur la page de détail.</p>
      <UButton class="mt-4" color="gray" variant="ghost" @click="router.back()">Retour</UButton>
    </div>

  </div>
</template>