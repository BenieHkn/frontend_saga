<template>
  <div class="smq-content">
    <SmqPageHeader
      :overline="`SMQ · ${indicateur?.periodicite?.libelle ?? '…'}`"
      :title="indicateur?.libelle ?? 'Chargement…'"
    >
      <NuxtLink to="/smq/indicateurs" class="px-4 py-2 text-sm font-medium rounded-lg" style="color: var(--qp-fg-2)">
        ← Retour
      </NuxtLink>
    </SmqPageHeader>

    <!-- Chargement -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="w-8 h-8 border-4 border-slate-200 rounded-full animate-spin" style="border-top-color: var(--qp-primary-500)" />
    </div>

    <template v-else>
      <!-- Info indicateur -->
      <div class="qp-card qp-card--pad mb-4 flex flex-wrap gap-6">
        <div>
          <p class="qp-overline mb-1">Code</p>
          <p class="qp-num font-semibold text-sm" style="color:var(--qp-fg-1)">{{ indicateur?.code }}</p>
        </div>
        <div>
          <p class="qp-overline mb-1">{{ indicateur?.type === 'suivi' ? 'Valeur suivie' : 'Clé de calcul' }}</p>
          <p class="text-sm qp-num" style="color:var(--qp-fg-2)">
            <template v-if="indicateur?.type === 'suivi'">{{ indicateur?.label_valeur }}</template>
            <template v-else>{{ indicateur?.label_operande1 }} {{ indicateur?.operateur?.signe }} {{ indicateur?.label_operande2 }} × 100</template>
          </p>
        </div>
        <div>
          <p class="qp-overline mb-1">Cible</p>
          <p class="qp-num font-semibold text-sm" style="color:var(--qp-fg-1)">
            {{ indicateur?.valeur_cible }}{{ indicateur?.type === 'suivi' ? '' : ' %' }}
          </p>
        </div>
        <div>
          <p class="qp-overline mb-1">Exercice</p>
          <p class="text-sm font-semibold" style="color:var(--qp-fg-1)">{{ exercice?.annee }}</p>
        </div>
        <div>
          <p class="qp-overline mb-1">Périodicité</p>
          <p class="text-sm" style="color:var(--qp-fg-2)">{{ indicateur?.periodicite?.libelle }}</p>
        </div>

        <!-- Copilote assigné -->
        <div class="ml-auto flex items-center gap-3">
          <div v-if="entiteCopilote">
            <p class="qp-overline mb-1">Copilote assigné</p>
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style="background:var(--qp-teal-500)">
                {{ initialesAvatar(responsableCopilote) }}
              </span>
              <div>
                <p class="text-sm font-semibold" style="color:var(--qp-fg-1)">{{ responsableCopilote || entiteCopilote.libelle }}</p>
                <p class="text-xs" style="color:var(--qp-fg-3)">{{ entiteCopilote.libelle }}</p>
              </div>
            </div>
          </div>
          <div v-else-if="estPilote" class="flex items-center gap-2 px-3 py-2 rounded-lg" style="background:var(--qp-warning-50);border:1px solid var(--qp-warning-200)">
            <Icon name="heroicons:exclamation-triangle" class="h-4 w-4 flex-none" style="color:var(--qp-warning-600)" />
            <span class="text-xs" style="color:var(--qp-warning-700)">Aucun copilote assigné</span>
          </div>

          <button
            v-if="estPilote"
            class="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border"
            style="background:#fff;border-color:var(--qp-border-1);color:var(--qp-fg-2)"
            @click="ouvrirModalAssignation"
          >
            <Icon name="heroicons:user-plus" class="h-4 w-4" />
            {{ entiteCopilote ? 'Modifier copilote' : 'Assigner un copilote' }}
          </button>
        </div>
      </div>

      <!-- Liste des périodes -->
      <div class="flex flex-col gap-3">
        <div
          v-for="(periode, idx) in periodes"
          :key="periode.label"
          class="qp-card"
          style="overflow: hidden"
        >
          <!-- En-tête de période -->
          <div
            class="flex items-center gap-4 px-5 py-4 select-none"
            :class="periodeBloquee(idx) ? 'opacity-50' : 'cursor-pointer'"
            :style="ouvert === idx ? 'border-bottom: 1px solid var(--qp-border-2)' : ''"
            @click="togglePeriode(idx, periode)"
          >
            <span
              class="w-8 h-8 rounded-full flex-none grid place-items-center text-xs font-bold qp-num"
              :style="badgeStyle(periode)"
            >{{ idx + 1 }}</span>

            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold" style="color:var(--qp-fg-1)">{{ periode.label }}</p>
              <p class="text-xs" style="color:var(--qp-fg-3)">{{ formatDate(periode.date_debut) }} → {{ formatDate(periode.date_fin) }}</p>
            </div>

            <span v-if="saisieOf(periode)" class="qp-num text-sm font-semibold" style="color:var(--qp-fg-1)">
              {{ indicateur?.type === 'suivi'
                  ? Math.round(saisieOf(periode).resultat)
                  : formatPourcentage(saisieOf(periode).resultat) }}
            </span>

            <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium" :style="statutStyle(periode)">
              {{ statutLabel(periode) }}
            </span>

            <Icon
              v-if="periodeBloquee(idx)"
              name="heroicons:lock-closed"
              class="h-4 w-4 flex-none"
              style="color:var(--qp-fg-3)"
              :title="`Transmettez la période précédente avant d'accéder à ${periode.label}`"
            />
            <Icon
              v-else
              :name="ouvert === idx ? 'heroicons:chevron-up' : 'heroicons:chevron-down'"
              class="h-4 w-4 flex-none"
              style="color:var(--qp-fg-3)"
            />
          </div>

          <!-- Formulaire (déplié) -->
          <div v-if="ouvert === idx" class="px-5 pb-5 pt-4">

            <!-- Bandeau lecture seule (admin sans rôle SMQ) -->
            <div v-if="estAdminPur" class="mb-4 flex items-center gap-2 rounded-lg px-3 py-2.5" style="background:var(--qp-n-50);border:1px solid var(--qp-border-1)">
              <Icon name="heroicons:eye" class="h-4 w-4 flex-none" style="color:var(--qp-fg-3)" />
              <p class="text-xs" style="color:var(--qp-fg-2)">Mode <strong>lecture seule</strong> — la saisie est réservée au pilote et au copilote assigné.</p>
            </div>

            <div class="grid gap-4" style="grid-template-columns: 1fr 1fr">

              <!-- ── Indicateur de SUIVI : un seul champ ── -->
              <template v-if="indicateur?.type === 'suivi'">
                <div class="full">
                  <label class="qp-label">{{ indicateur?.label_valeur }} <span class="req">*</span></label>
                  <input
                    v-model.number="formPeriode.operande1"
                    type="number"
                    step="1"
                    class="qp-input qp-input--mono"
                    :disabled="!peutSaisirCopilote(periode) && !peutEnregistrerPilote(periode) && !peutModifierPilote(periode)"
                    placeholder="0"
                    @input="calculerPreview"
                  />
                </div>
              </template>

              <!-- ── Indicateur de CALCUL : deux opérandes ── -->
              <template v-else>
                <div class="qp-field">
                  <label class="qp-label">{{ indicateur?.label_operande1 }} <span class="req">*</span></label>
                  <input
                    v-model.number="formPeriode.operande1"
                    type="number"
                    step="1"
                    class="qp-input qp-input--mono"
                    :disabled="!peutSaisirCopilote(periode) && !peutEnregistrerPilote(periode) && !peutModifierPilote(periode)"
                    placeholder="0"
                    @input="calculerPreview"
                  />
                </div>
                <div class="qp-field">
                  <label class="qp-label">{{ indicateur?.label_operande2 }} <span class="req">*</span></label>
                  <input
                    v-model.number="formPeriode.operande2"
                    type="number"
                    step="1"
                    class="qp-input qp-input--mono"
                    :disabled="!peutSaisirCopilote(periode) && !peutEnregistrerPilote(periode) && !peutModifierPilote(periode)"
                    placeholder="0"
                    @input="calculerPreview"
                  />
                </div>
              </template>

              <!-- Aperçu résultat -->
              <div class="full">
                <div class="flex items-center gap-4 rounded-lg px-4 py-3" :style="resultatStyle">
                  <div>
                    <p class="text-xs" style="color:var(--qp-fg-3)">{{ indicateur?.type === 'suivi' ? 'Valeur saisie' : 'Résultat calculé' }}</p>
                    <p class="qp-num text-lg font-bold" :style="conformiteColor">
                      {{ previewResultat !== null ? (indicateur?.type === 'suivi' ? Math.round(previewResultat) : formatPourcentage(previewResultat)) : '—' }}
                    </p>
                  </div>
                  <div v-if="previewResultat !== null" class="ml-auto">
                    <span
                      class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                      :style="previewResultat >= (indicateur?.valeur_cible ?? 0)
                        ? 'background:var(--qp-success-50);color:var(--qp-success-700);border:1px solid var(--qp-success-200)'
                        : 'background:var(--qp-danger-50);color:var(--qp-danger-700);border:1px solid var(--qp-danger-200)'"
                    >
                      {{ previewResultat >= (indicateur?.valeur_cible ?? 0) ? '✓ Conforme' : '✗ Non conforme' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Motif retour -->
              <div v-if="saisieOf(periode)?.commentaire_retour && statutDePeriode(periode) === 'retourne'" class="full">
                <div class="rounded-lg p-3 flex gap-2" style="background:var(--qp-warning-50);border:1px solid var(--qp-warning-200)">
                  <Icon name="heroicons:arrow-uturn-left" class="h-4 w-4 flex-none mt-0.5" style="color:var(--qp-warning-600)" />
                  <div>
                    <p class="text-xs font-semibold" style="color:var(--qp-warning-700)">Motif de retour</p>
                    <p class="text-sm" style="color:var(--qp-warning-800)">{{ saisieOf(periode).commentaire_retour }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-wrap items-center gap-2.5 mt-5">
              <!-- Copilote : enregistrer brouillon -->
              <button
                v-if="peutSaisirCopilote(periode)"
                class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border"
                style="background:#fff;border-color:var(--qp-border-1);box-shadow:var(--qp-sh-1)"
                :disabled="actionEnCours"
                @click="enregistrer(periode)"
              >
                <Icon name="heroicons:bookmark" class="h-4 w-4" />
                Enregistrer
              </button>

              <!-- Copilote : soumettre au pilote -->
              <button
                v-if="peutSaisirCopilote(periode)"
                class="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-white"
                style="background:var(--qp-primary-500)"
                :disabled="actionEnCours || formPeriode.operande1 === null || (indicateur?.type !== 'suivi' && formPeriode.operande2 === null)"
                @click="soumettre(periode)"
              >
                <Icon name="heroicons:paper-airplane" class="h-4 w-4" />
                Soumettre au pilote
              </button>

              <!-- Pilote seul — étape 1 : enregistrer en brouillon -->
              <button
                v-if="peutEnregistrerPilote(periode)"
                class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border"
                style="background:#fff;border-color:var(--qp-border-1);box-shadow:var(--qp-sh-1)"
                :disabled="actionEnCours || formPeriode.operande1 === null"
                @click="enregistrer(periode)"
              >
                <Icon name="heroicons:bookmark" class="h-4 w-4" />
                Enregistrer
              </button>

              <!-- Pilote seul — étape 2 : valider son brouillon -->
              <button
                v-if="peutValiderPilote(periode)"
                class="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-white"
                style="background:var(--qp-success-600)"
                :disabled="actionEnCours"
                @click="valider(periode)"
              >
                <Icon name="heroicons:shield-check" class="h-4 w-4" />
                Valider
              </button>

              <!-- Pilote avec copilote : valider la saisie soumise -->
              <button
                v-if="peutValider(periode)"
                class="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-white"
                style="background:var(--qp-success-600)"
                :disabled="actionEnCours"
                @click="valider(periode)"
              >
                <Icon name="heroicons:check-circle" class="h-4 w-4" />
                Valider
              </button>

              <button
                v-if="peutValider(periode)"
                class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border"
                style="background:#fff;border-color:var(--qp-warning-300);color:var(--qp-warning-700)"
                :disabled="actionEnCours"
                @click="ouvrirMotif(periode)"
              >
                <Icon name="heroicons:arrow-uturn-left" class="h-4 w-4" />
                Retourner
              </button>

              <button
                v-if="peutTransmettre(periode)"
                class="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-white"
                style="background:#1e3a5f"
                :disabled="actionEnCours"
                @click="transmettre(periode)"
              >
                <Icon name="heroicons:arrow-right-on-rectangle" class="h-4 w-4" />
                Transmettre au MG
              </button>

              <!-- FAC : affiché après transmission si non conforme -->
              <template v-if="statutDePeriode(periode) === 'transmis' && saisieOf(periode)?.conformite === 'non_conforme'">
                <button
                  v-if="!saisieOf(periode)?.actionsCorrectives?.length"
                  class="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-white"
                  style="background:var(--qp-danger-600)"
                  @click="ouvrirFac(periode)"
                >
                  <Icon name="heroicons:clipboard-document-list" class="h-4 w-4" />
                  Initier une FAC
                </button>
                <NuxtLink
                  v-else
                  :to="`/smq/fac?saisie_id=${saisieOf(periode).id}`"
                  class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border"
                  style="background:#fff;border-color:var(--qp-danger-300);color:var(--qp-danger-700)"
                >
                  <Icon name="heroicons:clipboard-document-check" class="h-4 w-4" />
                  Voir la FAC
                </NuxtLink>
              </template>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Modal initiation FAC -->
    <div v-if="modalFac" class="fixed inset-0 z-50 flex items-center justify-center" style="background:rgba(0,0,0,0.4)" @click.self="modalFac = false">
      <div class="qp-card" style="width:560px;max-height:85vh;overflow-y:auto">
        <div class="flex items-center justify-between px-5 pt-5 pb-4" style="border-bottom:1px solid var(--qp-border-2)">
          <div>
            <p class="qp-overline mb-1">Fiche d'Actions Correctives</p>
            <h3 class="font-semibold text-base" style="color:var(--qp-fg-1);margin:0">Initier une FAC</h3>
          </div>
          <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold" style="background:var(--qp-danger-50);color:var(--qp-danger-700);border:1px solid var(--qp-danger-200)">Non conforme</span>
        </div>

        <div class="px-5 py-4 flex flex-col gap-4">
          <div class="qp-field">
            <label class="qp-label">Description de la non-conformité <span class="req">*</span></label>
            <textarea v-model="facForm.description_nc" class="qp-textarea" rows="3" placeholder="Décrivez la non-conformité ou le dysfonctionnement constaté…" />
          </div>
          <div class="qp-field">
            <label class="qp-label">Action effectuée pour maîtriser / corriger</label>
            <textarea v-model="facForm.action_maitrise" class="qp-textarea" rows="3" placeholder="Action immédiate mise en place…" />
          </div>
          <div class="qp-field">
            <label class="qp-label">Cause(s) identifiée(s)</label>
            <textarea v-model="facForm.causes" class="qp-textarea" rows="3" placeholder="Cause(s) du dysfonctionnement…" />
          </div>
          <div class="qp-field">
            <label class="qp-label">Action(s) corrective(s) proposée(s)</label>
            <textarea v-model="facForm.actions_proposees" class="qp-textarea" rows="3" placeholder="Actions pour supprimer ou limiter les causes…" />
          </div>
          <div class="grid gap-4" style="grid-template-columns:1fr 1fr">
            <div class="qp-field" style="grid-column:1/-1">
              <label class="qp-label">Responsable(s) de l'action</label>
              <div class="flex flex-col gap-2">
                <div class="flex flex-wrap gap-1 min-h-[36px] px-2 py-1 rounded-lg border" style="border-color:var(--qp-border-1);background:var(--qp-n-0)">
                  <span
                    v-for="uid in facResponsablesChx" :key="uid"
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                    style="background:var(--qp-primary-100);color:var(--qp-primary-700)"
                  >
                    {{ facResponsables.find(u => u.id === uid)?.nom_complet }}
                    <button type="button" @click="facResponsablesChx = facResponsablesChx.filter(i => i !== uid)" style="line-height:1;margin-left:2px">×</button>
                  </span>
                  <span v-if="!facResponsablesChx.length" class="text-xs self-center" style="color:var(--qp-fg-3)">
                    {{ facResponsables.length ? 'Aucun sélectionné' : 'Chargement…' }}
                  </span>
                </div>
                <div v-if="facResponsables.length" class="flex flex-col gap-0.5 max-h-36 overflow-y-auto rounded-lg border px-2 py-1" style="border-color:var(--qp-border-1)">
                  <label
                    v-for="u in facResponsables" :key="u.id"
                    class="flex items-center gap-2 text-sm px-1 py-1 rounded cursor-pointer"
                    :style="facResponsablesChx.includes(u.id) ? 'background:var(--qp-primary-50)' : ''"
                  >
                    <input type="checkbox" :value="u.id" v-model="facResponsablesChx" style="accent-color:var(--qp-primary-500);width:14px;height:14px;flex-shrink:0" />
                    <span style="color:var(--qp-fg-2)">{{ u.nom_complet }}</span>
                  </label>
                </div>
              </div>
            </div>
            <div class="qp-field">
              <label class="qp-label">Date prévisionnelle de mise en œuvre</label>
              <input v-model="facForm.date_previsionnelle" type="date" class="qp-input qp-input--mono" />
            </div>
            <div class="qp-field">
              <label class="qp-label">Critères d'efficacité</label>
              <div v-if="facCriteres.length" class="flex flex-wrap gap-1.5 mb-2">
                <span
                  v-for="(c, i) in facCriteres" :key="i"
                  class="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                  style="background:var(--qp-primary-50);color:var(--qp-primary-700)"
                >
                  {{ c }}
                  <button type="button" class="ml-0.5 hover:opacity-70" @click="facCriteres.splice(i, 1)">×</button>
                </span>
              </div>
              <div class="flex gap-2">
                <input
                  v-model="nouveauFacCritere"
                  class="qp-input flex-1"
                  style="height:32px;font-size:0.8125rem"
                  placeholder="Ex. : indicateur ≥ cible sur 2 périodes"
                  @keydown.enter.prevent="ajouterFacCritere"
                />
                <button type="button" class="px-3 py-1 text-sm rounded-lg text-white" style="background:var(--qp-primary-500)" @click="ajouterFacCritere">+</button>
              </div>
            </div>
            <div class="qp-field">
              <label class="qp-label">Date prévue pour l'examen des effets</label>
              <input v-model="facForm.date_examen_effets" type="date" class="qp-input qp-input--mono" />
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-2 px-5 pb-5">
          <button class="px-4 py-2 text-sm rounded-lg" style="color:var(--qp-fg-2)" @click="modalFac = false">Annuler</button>
          <button
            class="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-white"
            style="background:var(--qp-danger-600)"
            :disabled="actionEnCours || !facForm.description_nc?.trim()"
            @click="creerFac"
          >
            <Icon name="heroicons:clipboard-document-list" class="h-4 w-4" />
            Créer la FAC
          </button>
        </div>
      </div>
    </div>

    <!-- Modal assignation copilote -->
    <div
      v-if="modalAssignation"
      class="fixed inset-0 z-50 flex items-center justify-center"
      style="background:rgba(0,0,0,0.35)"
      @click.self="modalAssignation = false"
    >
      <div class="qp-card qp-card--pad" style="width:480px;max-height:80vh;overflow-y:auto">
        <h3 class="font-semibold text-base mb-1" style="color:var(--qp-fg-1)">Assigner un copilote</h3>
        <p class="text-sm mb-4" style="color:var(--qp-fg-3)">Sélectionnez le service qui saisira les données de cet indicateur.</p>

        <div v-if="loadingServices" class="flex justify-center py-6">
          <div class="w-6 h-6 border-4 border-slate-200 rounded-full animate-spin" style="border-top-color: var(--qp-primary-500)" />
        </div>

        <div v-else-if="!servicesCopilotes.length" class="text-sm py-4 text-center" style="color:var(--qp-fg-3)">
          Aucun service disponible sous cette direction.
        </div>

        <div v-else class="flex flex-col gap-2">
          <label
            v-for="svc in servicesCopilotes"
            :key="svc.id"
            class="flex items-center gap-3 rounded-lg px-4 py-3 cursor-pointer border transition-all"
            :style="selectedServiceId === svc.id
              ? 'border-color:var(--qp-primary-500);background:var(--qp-primary-50)'
              : 'border-color:var(--qp-border-1);background:#fff'"
          >
            <input type="radio" :value="svc.id" v-model="selectedServiceId" style="accent-color:var(--qp-primary-500)" />
            <div>
              <p class="text-sm font-semibold" style="color:var(--qp-fg-1)">{{ svc.libelle }}</p>
              <p class="text-xs" style="color:var(--qp-fg-3)">
                Responsable : {{ svc.entite_users?.[0]?.user ? `${svc.entite_users[0].user.prenom} ${svc.entite_users[0].user.nom}` : '—' }}
              </p>
            </div>
          </label>
        </div>

        <div class="flex justify-end gap-2 mt-5">
          <button class="px-4 py-2 text-sm rounded-lg" style="color:var(--qp-fg-2)" @click="modalAssignation = false">Annuler</button>
          <button
            class="px-4 py-2 text-sm font-semibold rounded-lg text-white"
            style="background:var(--qp-primary-500)"
            :disabled="!selectedServiceId || actionEnCours"
            @click="confirmerAssignation"
          >
            Confirmer l'assignation
          </button>
        </div>
      </div>
    </div>

    <!-- Modal motif retour -->
    <div
      v-if="modalMotif"
      class="fixed inset-0 z-50 flex items-center justify-center"
      style="background:rgba(0,0,0,0.35)"
      @click.self="modalMotif = false"
    >
      <div class="qp-card qp-card--pad" style="width:420px">
        <h3 class="font-semibold text-base mb-3" style="color:var(--qp-fg-1)">Motif de retour</h3>
        <textarea v-model="motifRetour" class="qp-textarea" rows="3" placeholder="Expliquez la raison du retour…" />
        <div class="flex justify-end gap-2 mt-4">
          <button class="px-4 py-2 text-sm rounded-lg" style="color:var(--qp-fg-2)" @click="modalMotif = false">Annuler</button>
          <button
            class="px-4 py-2 text-sm font-semibold rounded-lg text-white"
            style="background:var(--qp-warning-600)"
            :disabled="actionEnCours"
            @click="retourner(periodeCible)"
          >
            Confirmer le retour
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useIndicateurs }  from '~/composables/smq/useIndicateurs'
import { useSaisies }      from '~/composables/smq/useSaisies'
import { useReferentiels } from '~/composables/smq/useReferentiels'
import { useAuth }         from '~/composables/auth/useAuth'
import { useFac }          from '~/composables/smq/useFac'

const route = useRoute()
const id    = computed(() => route.params.id)

useHead({ title: 'Saisie — SMQ · SAGA' })

const { fetchIndicateur, formatDate, formatPourcentage,
        fetchServicesCopilotes, assignerCopilote: API_assignerCopilote,
        initialesAvatar }                                                = useIndicateurs()
const { fetchExerciceActif }                                             = useReferentiels()
const { fetchSaisies, enregistrerBrouillon, mettreAJourSaisie,
        soumettre: API_soumettre, valider: API_valider,
        retourner: API_retourner, transmettre: API_transmettre }         = useSaisies()
const { createFac, fetchResponsablesPossiblesCreation }                  = useFac()
const { isSmqAdmin, isSmqPilote, isSmqCopilote }                        = useAuth()

// ── Droits ────────────────────────────────────────────────────────────────────
// L'admin sans rôle SMQ est en lecture seule : il ne peut pas saisir de données.
const estPilote     = computed(() => isSmqPilote())                                    // smq_pilote uniquement
const estCopilote   = computed(() => isSmqCopilote())                                  // smq_copilote uniquement
const estPiloteSeul = computed(() => estPilote.value && !estCopilote.value)            // pilote sans être copilote
const estAdminPur   = computed(() => isSmqAdmin() && !estPilote.value && !estCopilote.value) // admin sans rôle SMQ → lecture seule

// ── État ──────────────────────────────────────────────────────────────────────
const loading       = ref(true)
const actionEnCours = ref(false)
const indicateur    = ref(null)
const exercice      = ref(null)
const saisies       = ref([])
const periodes      = ref([])
const ouvert        = ref(null)

const formPeriode = reactive({ operande1: null, operande2: null })
const previewResultat = ref(null)

const modalMotif   = ref(false)
const motifRetour  = ref('')
const periodeCible = ref(null)

// ── FAC ───────────────────────────────────────────────────────────────────────
const modalFac            = ref(false)
const facSaisieId         = ref(null)
const facResponsables     = ref([])    // liste { id, nom_complet }
const facResponsablesChx  = ref([])    // ids cochés
const facForm             = reactive({
  description_nc: '', action_maitrise: '', causes: '', actions_proposees: '',
  date_previsionnelle: '', date_examen_effets: '',
})
const facCriteres = ref([])      // tableau de libellés de critères
const nouveauFacCritere = ref('')
const ajouterFacCritere = () => {
  const val = nouveauFacCritere.value.trim()
  if (!val) return
  facCriteres.value.push(val)
  nouveauFacCritere.value = ''
}

// ── Assignation copilote ──────────────────────────────────────────────────────
const modalAssignation   = ref(false)
const loadingServices    = ref(false)
const servicesCopilotes  = ref([])
const selectedServiceId  = ref(null)

const entiteCopilote = computed(() =>
  indicateur.value?.entites?.find(e => e.pivot?.is_pilote === false) ?? null
)
const responsableCopilote = computed(() => {
  const eu = entiteCopilote.value?.entite_users?.[0]
  return eu?.user ? `${eu.user.prenom ?? ''} ${eu.user.nom ?? ''}`.trim() : null
})

// ── Chargement ────────────────────────────────────────────────────────────────
const charger = async () => {
  loading.value = true
  try {
    const [indData, exData] = await Promise.all([fetchIndicateur(id.value), fetchExerciceActif()])
    indicateur.value = indData
    exercice.value   = exData

    periodes.value = genererPeriodes(
      indicateur.value?.periodicite?.nb_periodes ?? 1,
      exercice.value?.annee ?? new Date().getFullYear()
    )

    if (exercice.value) {
      const res = await fetchSaisies({ indicateur_id: id.value, exercice_id: exercice.value.id, per_page: 100 })
      saisies.value = res?.data ?? res ?? []
    }
  } catch (e) {
    console.error('Erreur chargement saisie :', e)
  } finally {
    loading.value = false
  }
}

// ── Génération des périodes ───────────────────────────────────────────────────
const MOIS = ['Janvier','Février','Mars','Avril','Mai','Juin',
              'Juillet','Août','Septembre','Octobre','Novembre','Décembre']

const genererPeriodes = (nbPeriodes, annee) => {
  if (nbPeriodes === 12) {
    return MOIS.map((m, i) => ({
      label:      `${m} ${annee}`,
      date_debut: `${annee}-${String(i + 1).padStart(2,'0')}-01`,
      date_fin:   new Date(annee, i + 1, 0).toISOString().split('T')[0],
    }))
  }
  if (nbPeriodes === 4) {
    return [1,2,3,4].map(t => ({
      label:      `T${t} ${annee}`,
      date_debut: `${annee}-${String((t-1)*3+1).padStart(2,'0')}-01`,
      date_fin:   new Date(annee, t*3, 0).toISOString().split('T')[0],
    }))
  }
  if (nbPeriodes === 2) {
    return [
      { label: `S1 ${annee}`, date_debut: `${annee}-01-01`, date_fin: `${annee}-06-30` },
      { label: `S2 ${annee}`, date_debut: `${annee}-07-01`, date_fin: `${annee}-12-31` },
    ]
  }
  return [{ label: String(annee), date_debut: `${annee}-01-01`, date_fin: `${annee}-12-31` }]
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const saisieOf        = (p) => saisies.value.find(s => s.date_debut?.slice(0, 10) === p.date_debut) ?? null
const statutDePeriode = (p) => saisieOf(p)?.statut ?? 'a_saisir'

const statutLabel = (p) => ({
  a_saisir: 'À saisir', brouillon: 'Brouillon', retourne: 'Retourné',
  soumis: 'Soumis', valide: 'Validé', transmis: 'Transmis',
})[statutDePeriode(p)] ?? '—'

const statutStyle = (p) => ({
  a_saisir:  'background:var(--qp-n-100);color:var(--qp-fg-3);border:1px solid var(--qp-border-1)',
  brouillon: 'background:var(--qp-n-100);color:var(--qp-fg-2);border:1px solid var(--qp-border-1)',
  retourne:  'background:var(--qp-warning-50);color:var(--qp-warning-700);border:1px solid var(--qp-warning-200)',
  soumis:    'background:var(--qp-primary-50);color:var(--qp-primary-700);border:1px solid var(--qp-primary-200)',
  valide:    'background:var(--qp-success-50);color:var(--qp-success-700);border:1px solid var(--qp-success-200)',
  transmis:  'background:#eff6ff;color:#1e40af;border:1px solid #bfdbfe',
})[statutDePeriode(p)] ?? ''

const badgeStyle = (p) => {
  const s = statutDePeriode(p)
  if (s === 'transmis') return 'background:#1e40af;color:#fff'
  if (s === 'valide')   return 'background:var(--qp-success-600);color:#fff'
  if (s === 'soumis')   return 'background:var(--qp-primary-500);color:#fff'
  if (s === 'retourne') return 'background:var(--qp-warning-500);color:#fff'
  return 'background:var(--qp-n-200);color:var(--qp-fg-2)'
}

// Copilote uniquement (pas pilote) peut saisir en brouillon / retourné / soumis
const peutSaisirCopilote    = (p) => !estPiloteSeul.value && estCopilote.value && ['a_saisir','brouillon','retourne'].includes(statutDePeriode(p))
// Pilote seul : enregistrer en brouillon (1re étape)
const peutEnregistrerPilote = (p) => estPiloteSeul.value && ['a_saisir', 'brouillon'].includes(statutDePeriode(p))
// Pilote seul : valider son propre brouillon (2e étape, quand il est prêt)
const peutValiderPilote     = (p) => estPiloteSeul.value && statutDePeriode(p) === 'brouillon'
// Pilote peut corriger les valeurs soumises par le copilote avant validation
const peutModifierPilote    = (p) => estPilote.value && statutDePeriode(p) === 'soumis'
// Pilote valide les saisies soumises par le copilote
const peutValider           = (p) => estPilote.value && !estPiloteSeul.value && statutDePeriode(p) === 'soumis'
const peutTransmettre       = (p) => estPilote.value && statutDePeriode(p) === 'valide'

// ── Blocage : période précédente non transmise ────────────────────────────────
const periodeBloquee = (idx) => {
  if ((indicateur.value?.periodicite?.nb_periodes ?? 1) <= 1) return false
  if (idx === 0) return false
  const precedente = periodes.value[idx - 1]
  return statutDePeriode(precedente) !== 'transmis'
}

// ── Ouvrir / fermer ───────────────────────────────────────────────────────────
const togglePeriode = (idx, periode) => {
  if (periodeBloquee(idx)) return
  if (ouvert.value === idx) { ouvert.value = null; return }
  ouvert.value = idx
  previewResultat.value = null
  const s = saisieOf(periode)
  formPeriode.operande1 = s?.operande1 ?? null
  formPeriode.operande2 = s?.operande2 ?? null
  const isSuivi = indicateur.value?.type === 'suivi'
  if (isSuivi ? s?.operande1 != null : (s?.operande1 != null && s?.operande2 != null)) calculerPreview()
}

// ── Calcul preview ────────────────────────────────────────────────────────────
const calculerPreview = () => {
  // Suivi : la valeur saisie est directement le résultat
  if (indicateur.value?.type === 'suivi') {
    const op1 = Number(formPeriode.operande1)
    previewResultat.value = isFinite(op1) && formPeriode.operande1 !== null ? op1 : null
    return
  }
  // Calcul : formule (op1 [opérateur] op2) × 100
  const op1 = Math.trunc(Number(formPeriode.operande1))
  const op2 = Math.trunc(Number(formPeriode.operande2))
  if (!isFinite(op1) || !isFinite(op2) || op2 === 0) { previewResultat.value = null; return }
  const signe = indicateur.value?.operateur?.signe ?? '÷'
  const base  = signe === '÷' ? op1 / op2
              : signe === '×' ? op1 * op2
              : signe === '+' ? op1 + op2
              : signe === '−' ? op1 - op2 : null
  previewResultat.value = base !== null ? base * 100 : null
}

const resultatStyle = computed(() => {
  if (previewResultat.value === null) return 'background:var(--qp-n-50);border:1px solid var(--qp-border-1)'
  return previewResultat.value >= (indicateur.value?.valeur_cible ?? 0)
    ? 'background:var(--qp-success-50);border:1px solid var(--qp-success-100)'
    : 'background:var(--qp-danger-50);border:1px solid var(--qp-danger-100)'
})

const conformiteColor = computed(() => {
  if (previewResultat.value === null) return 'color:var(--qp-fg-2)'
  return previewResultat.value >= (indicateur.value?.valeur_cible ?? 0)
    ? 'color:var(--qp-success-700)' : 'color:var(--qp-danger-700)'
})

// ── Actions ───────────────────────────────────────────────────────────────────
const buildPayload = (periode) => ({
  indicateur_id:      id.value,
  exercice_id:        exercice.value?.id,
  date_debut:         periode.date_debut,
  date_fin:           periode.date_fin,
  operande1: formPeriode.operande1,
  operande2: formPeriode.operande2,
})

const enregistrer = async (periode) => {
  actionEnCours.value = true
  try {
    const s = saisieOf(periode)
    const updated = s
      ? await mettreAJourSaisie(s.id, { operande1: formPeriode.operande1, operande2: formPeriode.operande2 })
      : await enregistrerBrouillon(buildPayload(periode))
    updateSaisie(updated)
  } catch (e) { console.error('Enregistrement :', e) }
  finally { actionEnCours.value = false }
}

const soumettre = async (periode) => {
  actionEnCours.value = true
  try {
    let s = saisieOf(periode)
    if (!s) { s = await enregistrerBrouillon(buildPayload(periode)); saisies.value.push(s) }
    updateSaisie(await API_soumettre(s.id, { commentaire: formPeriode.commentaire }))
    ouvert.value = null
  } catch (e) { console.error('Soumission :', e) }
  finally { actionEnCours.value = false }
}

const valider = async (periode) => {
  actionEnCours.value = true
  try {
    const s = saisieOf(periode)
    // Si le pilote a modifié les opérandes, les sauvegarder avant de valider
    if (formPeriode.operande1 !== s.operande1 || formPeriode.operande2 !== s.operande2) {
      await mettreAJourSaisie(s.id, { operande1: formPeriode.operande1, operande2: formPeriode.operande2 })
    }
    updateSaisie(await API_valider(s.id))
    ouvert.value = null
  } catch (e) { console.error('Validation :', e) }
  finally { actionEnCours.value = false }
}

const ouvrirMotif = (periode) => { periodeCible.value = periode; motifRetour.value = ''; modalMotif.value = true }

const ouvrirFac = (periode) => {
  facSaisieId.value = saisieOf(periode)?.id
  Object.assign(facForm, { description_nc: '', action_maitrise: '', causes: '', actions_proposees: '', date_previsionnelle: '', date_examen_effets: '' })
  facCriteres.value = []
  nouveauFacCritere.value = ''
  facResponsables.value    = []
  facResponsablesChx.value = []
  fetchResponsablesPossiblesCreation(facSaisieId.value).then(list => {
    facResponsables.value = list
  }).catch(() => {})
  modalFac.value = true
}

const creerFac = async () => {
  if (!facSaisieId.value || !facForm.description_nc?.trim()) return
  actionEnCours.value = true
  try {
    const fac = await createFac({
      saisie_indicateur_id: facSaisieId.value,
      ...facForm,
      criteres:        facCriteres.value,
      responsable_ids: facResponsablesChx.value,
    })
    const s = saisies.value.find(s => s.id === facSaisieId.value)
    if (s) s.actionsCorrectives = [fac]
    modalFac.value = false
  } catch (e) { console.error('Création FAC :', e) }
  finally { actionEnCours.value = false }
}

const retourner = async (periode) => {
  actionEnCours.value = true
  try {
    updateSaisie(await API_retourner(saisieOf(periode).id, motifRetour.value))
    modalMotif.value = false; ouvert.value = null
  } catch (e) { console.error('Retour :', e) }
  finally { actionEnCours.value = false }
}

const transmettre = async (periode) => {
  actionEnCours.value = true
  try {
    updateSaisie(await API_transmettre(saisieOf(periode).id))
    ouvert.value = null
  } catch (e) { console.error('Transmission :', e) }
  finally { actionEnCours.value = false }
}

const updateSaisie = (updated) => {
  if (!updated) return
  const idx = saisies.value.findIndex(s => s.id === updated.id)
  if (idx >= 0) saisies.value[idx] = updated
  else saisies.value.push(updated)
}

// ── Assignation copilote ──────────────────────────────────────────────────────
const ouvrirModalAssignation = async () => {
  modalAssignation.value  = true
  loadingServices.value   = true
  selectedServiceId.value = entiteCopilote.value?.id ?? null
  try {
    servicesCopilotes.value = await fetchServicesCopilotes(id.value)
  } finally {
    loadingServices.value = false
  }
}

const confirmerAssignation = async () => {
  if (!selectedServiceId.value) return
  actionEnCours.value = true
  try {
    const updated = await API_assignerCopilote(id.value, selectedServiceId.value)
    // Mettre à jour les entites de l'indicateur avec la réponse
    if (updated?.entites) indicateur.value = { ...indicateur.value, entites: updated.entites }
    modalAssignation.value = false
  } catch (e) {
    console.error('Assignation copilote :', e)
    alert(e?.data?.message ?? "Erreur lors de l'assignation")
  } finally {
    actionEnCours.value = false
    modalAssignation.value = false
  }
}

onMounted(() => charger())
</script>

<style scoped>
.smq-content { }
</style>
