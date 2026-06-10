<template>
  <div class="smq-content">
    <SmqPageHeader
      :overline="`Plan Audit Qualité · Exercice ${exerciceLabel}`"
      title="Plan Audit Qualité"
    >
      <!-- Sélecteur semestre -->
      <div class="qp-seg">
        <button v-for="s in ['S1','S2']" :key="s" :class="{ active: semestre === s }" @click="semestre = s; charger()">{{ s }}</button>
      </div>
      <button
        class="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-white"
        style="background: var(--qp-primary-500)"
        @click="ouvrirAudit(null)"
      >
        <Icon name="heroicons:plus" class="h-4 w-4" />
        Planifier un audit
      </button>
    </SmqPageHeader>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="w-8 h-8 border-4 border-slate-200 rounded-full animate-spin" style="border-top-color: var(--qp-primary-500)" />
    </div>

    <div v-else class="grid gap-4" style="grid-template-columns: 1fr 320px; align-items: start">

      <!-- ── Colonne principale : audits ──────────────────────────────────── -->
      <div>
        <div v-if="!audits.length" class="qp-card qp-card--pad text-center py-12 text-sm" style="color:var(--qp-fg-3)">
          Aucun audit planifié pour ce semestre.
        </div>

        <div
          v-for="audit in audits"
          :key="audit.id"
          class="rounded-lg overflow-hidden mb-3"
          style="border:1px solid var(--qp-border-1);background:#fff;box-shadow:var(--qp-sh-1)"
        >
          <!-- En-tête audit -->
          <div class="flex items-center gap-3 px-[18px] py-4">
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center flex-none"
              :style="iconStyleAudit(audit.statut)"
            >
              <Icon :name="iconAudit(audit.statut)" class="h-5 w-5" />
            </div>
            <div class="flex-1">
              <div class="font-semibold text-sm" style="color:var(--qp-fg-1)">{{ audit.titre || titreAudit(audit) }}</div>
              <div class="text-xs mt-0.5" style="color:var(--qp-fg-3)">
                {{ audit.referentiel }} · {{ audit.audits_entites?.length ?? 0 }} visite{{ (audit.audits_entites?.length ?? 0) !== 1 ? 's' : '' }}
              </div>
            </div>
            <span class="qp-badge" :class="badgeAuditStatut(audit.statut)">{{ labelAuditStatut(audit.statut) }}</span>
            <!-- Bouton ajouter entité -->
            <button
              class="w-8 h-8 rounded-md flex items-center justify-center transition-all text-xs"
              style="color:var(--qp-primary-600);background:var(--qp-primary-50)"
              title="Planifier une visite d'entité"
              @click="ouvrirVisite(audit, null)"
            >
              <Icon name="heroicons:building-office-2" class="h-4 w-4" />
            </button>
            <!-- Bouton modifier audit -->
            <button
              class="w-8 h-8 rounded-md flex items-center justify-center transition-all text-xs"
              style="color:var(--qp-fg-3)"
              title="Modifier l'audit"
              @click="ouvrirAudit(audit)"
            >
              <Icon name="heroicons:pencil-square" class="h-4 w-4" />
            </button>
            <!-- Bouton supprimer audit -->
            <button
              class="w-8 h-8 rounded-md flex items-center justify-center transition-all text-xs"
              style="color:var(--qp-danger-500)"
              title="Supprimer l'audit"
              @click="confirmerSuppressionAudit(audit)"
            >
              <Icon name="heroicons:trash" class="h-4 w-4" />
            </button>
          </div>

          <!-- Visites (audits_entites) -->
          <div v-if="audit.audits_entites?.length" style="background:var(--qp-n-25);border-top:1px solid var(--qp-border-2)">
            <div
              v-for="ae in audit.audits_entites"
              :key="ae.id"
              class="border-b last:border-b-0"
              style="border-color:var(--qp-border-2)"
            >
              <!-- Ligne principale de la visite -->
              <div class="flex items-center gap-3 px-[18px] py-2.5">
                <!-- Date + heure -->
                <span class="qp-num text-xs flex-none" style="color:var(--qp-fg-2);width:100px">
                  <span v-if="ae.date">{{ formatDate(ae.date) }}</span>
                  <span v-else style="color:var(--qp-warning-600)">À planifier</span>
                  <span v-if="ae.heure_debut" class="block" style="color:var(--qp-fg-3)">{{ ae.heure_debut }}{{ ae.heure_fin ? ' – ' + ae.heure_fin : '' }}</span>
                </span>
                <!-- Libellé entité -->
                <span class="flex-1 text-sm font-medium" style="color:var(--qp-fg-1)">{{ ae.entite?.libelle ?? ae.libelle ?? '—' }}</span>
                <!-- Avatars auditeurs -->
                <div class="flex" style="margin-left:-4px">
                  <span
                    v-for="u in (ae.users ?? []).slice(0, 4)"
                    :key="u.id"
                    class="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-semibold"
                    style="border:2px solid var(--qp-n-25); margin-left:-6px"
                    :style="{ background: avatarCouleur(nomComplet(u)) }"
                    :title="nomComplet(u)"
                  >{{ initialesAvatar(nomComplet(u)) }}</span>
                  <span
                    v-if="(ae.users ?? []).length > 4"
                    class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold"
                    style="border:2px solid var(--qp-n-25); margin-left:-6px; background:var(--qp-n-200); color:var(--qp-fg-2)"
                  >+{{ ae.users.length - 4 }}</span>
                </div>
                <!-- Bouton modifier visite -->
                <button
                  class="w-7 h-7 rounded flex items-center justify-center transition-all"
                  style="color:var(--qp-primary-500)"
                  title="Modifier la programmation de cette visite"
                  @click="ouvrirVisite(audit, ae)"
                >
                  <Icon name="heroicons:calendar-days" class="h-4 w-4" />
                </button>
                <!-- Bouton afficher/masquer recommandations -->
                <button
                  v-if="ae.recommandations?.length"
                  class="flex items-center gap-1 px-2 h-7 rounded text-xs font-medium transition-all flex-none"
                  :style="recoOuvertes.has(ae.id)
                    ? 'background:var(--qp-primary-50);color:var(--qp-primary-600)'
                    : 'color:var(--qp-fg-3)'"
                  :title="recoOuvertes.has(ae.id) ? 'Masquer les recommandations' : 'Voir les recommandations'"
                  @click="toggleRecoOuvertes(ae.id)"
                >
                  <Icon name="heroicons:chat-bubble-left-ellipsis" class="h-3.5 w-3.5" />
                  <span>{{ ae.recommandations.length }}</span>
                </button>
                <!-- Bouton ajouter recommandation -->
                <button
                  class="w-7 h-7 rounded flex items-center justify-center transition-all"
                  style="color:var(--qp-fg-3)"
                  title="Ajouter une recommandation"
                  @click="ouvrirRecommandation(ae)"
                >
                  <Icon name="heroicons:plus" class="h-4 w-4" />
                </button>
                <!-- Bouton supprimer visite -->
                <button
                  class="w-7 h-7 rounded flex items-center justify-center transition-all"
                  style="color:var(--qp-danger-400)"
                  title="Retirer cette entité de l'audit"
                  @click="confirmerSuppressionVisite(audit, ae)"
                >
                  <Icon name="heroicons:x-mark" class="h-4 w-4" />
                </button>
              </div>

              <!-- Recommandations de cette visite -->
              <div v-if="ae.recommandations?.length && recoOuvertes.has(ae.id)" class="border-t" style="border-color:var(--qp-border-2);background:var(--qp-n-50)">
                <div
                  v-for="reco in recoVisibles(ae)"
                  :key="reco.id"
                  class="flex items-start gap-2.5 px-[18px] py-2 border-b"
                  style="border-color:var(--qp-border-2);padding-left:130px"
                >
                  <span class="w-1.5 h-1.5 rounded-full mt-1.5 flex-none" :style="{ background: colorRecoStatut(reco.statut) }" />
                  <span class="flex-1 text-xs leading-relaxed" style="color:var(--qp-fg-2)">{{ reco.libelle }}</span>
                  <!-- Badge statut cliquable pour cycler -->
                  <button
                    class="text-[10px] px-2 py-0.5 rounded-full flex-none font-medium transition-all"
                    :style="recoStatutStyle(reco.statut)"
                    :title="`Statut : ${labelRecoStatut(reco.statut)} — cliquer pour changer`"
                    @click="toggleRecoStatut(reco)"
                  >{{ labelRecoStatut(reco.statut) }}</button>
                </div>
                <!-- Voir plus / moins -->
                <button
                  v-if="ae.recommandations.length > 2"
                  class="w-full text-xs py-1.5 text-center"
                  style="color:var(--qp-primary-600)"
                  @click="toggleRecoExpanded(ae.id)"
                >
                  {{ recoExpandees.has(ae.id)
                      ? 'Réduire'
                      : `Voir ${ae.recommandations.length - 2} recommandation${ae.recommandations.length - 2 > 1 ? 's' : ''} de plus` }}
                </button>
              </div>
            </div>
          </div>

          <!-- Pied : ajouter visite (si aucune visite) -->
          <div v-else class="px-[18px] py-2.5 flex items-center gap-2" style="background:var(--qp-n-25);border-top:1px solid var(--qp-border-2)">
            <button
              class="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-md"
              style="color:var(--qp-primary-600);background:var(--qp-primary-50)"
              @click="ouvrirVisite(audit, null)"
            >
              <Icon name="heroicons:plus" class="h-3.5 w-3.5" />
              Ajouter une entité à auditer
            </button>
          </div>
        </div>
      </div>

      <!-- ── Colonne droite : recommandations ─────────────────────────────── -->
      <div class="qp-card qp-card--pad">
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-semibold text-base mt-0 mb-0" style="color:var(--qp-fg-1)">Recommandations</h3>
          <span class="qp-badge qp-badge--neutral">{{ recommandations.length }}</span>
        </div>
        <p class="qp-overline mb-3" style="display:block">Issues des dernières visites d'audit</p>

        <div v-if="!recommandations.length" class="text-sm" style="color:var(--qp-fg-3)">Aucune recommandation.</div>

        <div
          v-for="reco in recommandations"
          :key="reco.id"
          class="flex gap-3 py-3 border-b last:border-b-0"
          style="border-color:var(--qp-border-2)"
        >
          <span
            class="w-2 h-2 rounded-full mt-1.5 flex-none"
            :style="{ background: colorRecoStatut(reco.statut) }"
          />
          <div class="flex-1 min-w-0">
            <div class="text-sm" style="color:var(--qp-fg-1)">{{ reco.libelle }}</div>
            <div class="text-xs mt-0.5" style="color:var(--qp-fg-3)">
              {{ reco.auditEntite?.entite?.libelle ?? '—' }}
              <span v-if="reco.fac_reference"> · <span class="qp-num">{{ reco.fac_reference }}</span></span>
            </div>
          </div>
          <button
            class="w-7 h-7 rounded flex items-center justify-center flex-none"
            style="color:var(--qp-fg-3)"
            @click="toggleRecoStatut(reco)"
          >
            <Icon name="heroicons:check" class="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- ── Modal audit ──────────────────────────────────────────────────────── -->
    <UModal v-model="auditModalOpen" :ui="{ width: 'sm:max-w-lg' }">
      <div class="bg-white rounded-xl overflow-hidden">
        <div class="px-6 py-4 border-b" style="border-color:var(--qp-border-1)">
          <h2 class="font-semibold text-base" style="color:var(--qp-fg-1)">
            {{ auditEnCours?.id ? 'Modifier l\'audit' : 'Planifier un audit' }}
          </h2>
        </div>
        <div class="p-6 grid gap-4">
          <div class="qp-field">
            <label class="qp-label">Titre de l'audit <span class="req">*</span></label>
            <input v-model="auditForm.titre" class="qp-input" placeholder="Ex. : Audit interne — Direction Production" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="qp-field">
              <label class="qp-label">Référentiel</label>
              <input v-model="auditForm.referentiel" class="qp-input" placeholder="ISO 9001" />
            </div>
            <div class="qp-field">
              <label class="qp-label">Date de début <span class="req">*</span></label>
              <input v-model="auditForm.date_debut" type="date" class="qp-input qp-input--mono" />
            </div>
            <div class="qp-field">
              <label class="qp-label">Date de fin</label>
              <input v-model="auditForm.date_fin" type="date" class="qp-input qp-input--mono" />
            </div>
          </div>
          <div class="qp-field">
            <label class="qp-label">Statut</label>
            <select v-model="auditForm.statut" class="qp-select">
              <option v-for="s in AUDIT_STATUTS" :key="s.value" :value="s.value">{{ s.label }}</option>
            </select>
          </div>
        </div>
        <div class="px-6 py-4 border-t flex justify-end gap-2.5" style="border-color:var(--qp-border-1)">
          <button class="px-4 py-2 text-sm rounded-lg border" style="border-color:var(--qp-border-1)" @click="auditModalOpen = false">Annuler</button>
          <button class="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-white" style="background:var(--qp-primary-500)" :disabled="saving" @click="sauvegarderAudit">
            <Icon name="heroicons:check" class="h-4 w-4" />
            {{ auditEnCours?.id ? 'Enregistrer' : 'Créer l\'audit' }}
          </button>
        </div>
      </div>
    </UModal>

    <!-- ── Modal programmation visite par entité ───────────────────────────── -->
    <UModal v-model="visiteModalOpen" :ui="{ width: 'sm:max-w-xl' }">
      <div class="bg-white rounded-xl overflow-hidden">
        <div class="px-6 py-4 border-b" style="border-color:var(--qp-border-1)">
          <h2 class="font-semibold text-base" style="color:var(--qp-fg-1)">
            {{ visiteEnCours?.id ? 'Modifier la visite' : 'Planifier une visite d\'entité' }}
          </h2>
          <p class="text-xs mt-1" style="color:var(--qp-fg-3)">
            Audit : {{ visiteAudit?.titre || titreAudit(visiteAudit) }}
          </p>
        </div>
        <div class="p-6 grid gap-4">
          <!-- Sélection entité avec recherche (uniquement en création) -->
          <div v-if="!visiteEnCours?.id" class="qp-field" style="position:relative" ref="entiteDropdownRef">
            <label class="qp-label">Entité à auditer <span class="req">*</span></label>
            <div
              class="qp-input flex items-center gap-2 cursor-pointer"
              style="padding-right:10px"
              @click="entiteDropdownOpen = !entiteDropdownOpen"
            >
              <span class="flex-1 truncate" :style="!visiteForm.entite_id ? 'color:var(--qp-fg-3)' : ''">
                {{ entitesDisponibles.find(e => e.id === visiteForm.entite_id)?.libelle ?? '— Choisir une entité —' }}
              </span>
              <Icon name="heroicons:chevron-down" class="h-4 w-4 flex-none" style="color:var(--qp-fg-3)" />
            </div>
            <div
              v-if="entiteDropdownOpen"
              class="rounded-lg overflow-hidden"
              style="position:absolute;z-index:50;top:100%;left:0;right:0;margin-top:4px;background:#fff;border:1px solid var(--qp-border-1);box-shadow:var(--qp-sh-2)"
            >
              <div class="p-2 border-b" style="border-color:var(--qp-border-2)">
                <input
                  v-model="entiteSearch"
                  class="qp-input"
                  style="height:34px;font-size:13px"
                  placeholder="Rechercher une entité…"
                  @click.stop
                  autofocus
                />
              </div>
              <div style="max-height:200px;overflow-y:auto">
                <div
                  v-for="e in entitesFiltrees"
                  :key="e.id"
                  class="px-3 py-2.5 text-sm cursor-pointer"
                  :style="[
                    entiteDejaAjoutee(e.id)
                      ? 'color:var(--qp-fg-3);cursor:not-allowed;background:var(--qp-n-25)'
                      : 'color:var(--qp-fg-1)',
                    visiteForm.entite_id === e.id
                      ? 'background:var(--qp-primary-50);color:var(--qp-primary-700);font-weight:600'
                      : ''
                  ]"
                  @click="!entiteDejaAjoutee(e.id) && selectionnerEntite(e)"
                >
                  {{ e.libelle }}
                  <span v-if="entiteDejaAjoutee(e.id)" class="text-xs ml-1">(déjà planifiée)</span>
                </div>
                <div v-if="!entitesFiltrees.length" class="px-3 py-3 text-sm" style="color:var(--qp-fg-3)">
                  Aucun résultat
                </div>
              </div>
            </div>
          </div>
          <!-- Entité affichée (en mode édition) -->
          <div v-else class="qp-field">
            <label class="qp-label">Entité</label>
            <div class="qp-input" style="background:var(--qp-n-50);color:var(--qp-fg-2)">
              {{ visiteEnCours?.entite?.libelle ?? '—' }}
            </div>
          </div>

          <!-- Date + Horaires -->
          <div class="grid grid-cols-3 gap-3">
            <div class="qp-field col-span-3 sm:col-span-1">
              <label class="qp-label">Date de visite</label>
              <input v-model="visiteForm.date" type="date" class="qp-input qp-input--mono" />
            </div>
            <div class="qp-field">
              <label class="qp-label">Heure de début</label>
              <input v-model="visiteForm.heure_debut" type="time" class="qp-input qp-input--mono" />
            </div>
            <div class="qp-field">
              <label class="qp-label">Heure de fin</label>
              <input v-model="visiteForm.heure_fin" type="time" class="qp-input qp-input--mono" />
            </div>
          </div>

          <!-- Auditeurs -->
          <div class="qp-field">
            <label class="qp-label">Auditeurs</label>
            <!-- Chips des auditeurs sélectionnés -->
            <div v-if="visiteForm.participants.length" class="flex flex-wrap gap-1.5 mb-2">
              <span
                v-for="uid in visiteForm.participants"
                :key="uid"
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                style="background:var(--qp-primary-50);color:var(--qp-primary-700);border:1px solid var(--qp-primary-100)"
              >
                <span
                  class="w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-bold flex-none"
                  :style="{ background: avatarCouleur(nomComplet(smqUsers.find(u => u.id === uid))) }"
                >{{ initialesAvatar(nomComplet(smqUsers.find(u => u.id === uid))) }}</span>
                {{ nomComplet(smqUsers.find(u => u.id === uid)) }}
                <button
                  type="button"
                  class="ml-0.5 hover:text-red-500"
                  @click.prevent="visiteForm.participants = visiteForm.participants.filter(id => id !== uid)"
                >
                  <Icon name="heroicons:x-mark" class="h-3 w-3" />
                </button>
              </span>
            </div>
            <!-- Barre de recherche -->
            <div class="relative mb-1">
              <Icon name="heroicons:magnifying-glass" class="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none" style="color:var(--qp-fg-3)" />
              <input
                v-model="auditeurSearch"
                class="qp-input"
                style="height:34px;font-size:13px;padding-left:30px"
                placeholder="Rechercher un auditeur…"
              />
            </div>
            <!-- Liste avec checkboxes -->
            <div class="rounded-lg border overflow-hidden" style="border-color:var(--qp-border-1);max-height:180px;overflow-y:auto">
              <div v-if="!smqUsers.length" class="px-3 py-2 text-sm" style="color:var(--qp-fg-3)">Chargement…</div>
              <div v-else-if="!auditeursFiltres.length" class="px-3 py-3 text-sm" style="color:var(--qp-fg-3)">Aucun résultat</div>
              <label
                v-for="u in auditeursFiltres"
                :key="u.id"
                class="flex items-center gap-3 px-3 py-2 cursor-pointer border-b last:border-b-0"
                :style="visiteForm.participants.includes(u.id)
                  ? 'background:var(--qp-primary-50);border-color:var(--qp-border-2)'
                  : 'background:#fff;border-color:var(--qp-border-2)'"
              >
                <input
                  type="checkbox"
                  :value="u.id"
                  v-model="visiteForm.participants"
                  class="rounded flex-none"
                  style="accent-color:var(--qp-primary-500)"
                />
                <span
                  class="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-semibold flex-none"
                  :style="{ background: avatarCouleur(nomComplet(u)) }"
                >{{ initialesAvatar(nomComplet(u)) }}</span>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium truncate" style="color:var(--qp-fg-1)">{{ nomComplet(u) }}</div>
                  <div class="text-xs truncate" style="color:var(--qp-fg-3)">{{ u.email }}</div>
                </div>
                <Icon v-if="visiteForm.participants.includes(u.id)" name="heroicons:check" class="h-4 w-4 flex-none" style="color:var(--qp-primary-500)" />
              </label>
            </div>
            <div class="text-xs mt-1" style="color:var(--qp-fg-3)">
              {{ visiteForm.participants.length ? `${visiteForm.participants.length} auditeur${visiteForm.participants.length > 1 ? 's' : ''} sélectionné${visiteForm.participants.length > 1 ? 's' : ''}` : 'Aucun auditeur sélectionné' }}
            </div>
          </div>

          <!-- Observations générales -->
          <div class="qp-field">
            <label class="qp-label">Observations générales</label>
            <textarea
              v-model="visiteForm.observations_generales"
              class="qp-textarea"
              rows="3"
              placeholder="Contexte de la visite, points à aborder…"
            />
          </div>
        </div>
        <div class="px-6 py-4 border-t flex justify-end gap-2.5" style="border-color:var(--qp-border-1)">
          <button class="px-4 py-2 text-sm rounded-lg border" style="border-color:var(--qp-border-1)" @click="visiteModalOpen = false">Annuler</button>
          <button
            class="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-white"
            style="background:var(--qp-primary-500)"
            :disabled="saving || (!visiteEnCours?.id && !visiteForm.entite_id)"
            @click="sauvegarderVisite"
          >
            <Icon name="heroicons:check" class="h-4 w-4" />
            {{ visiteEnCours?.id ? 'Enregistrer' : 'Planifier la visite' }}
          </button>
        </div>
      </div>
    </UModal>

    <!-- ── Modal recommandation ──────────────────────────────────────────── -->
    <UModal v-model="recoModalOpen" :ui="{ width: 'sm:max-w-md' }">
      <div class="bg-white rounded-xl overflow-hidden">
        <div class="px-6 py-4 border-b" style="border-color:var(--qp-border-1)">
          <h2 class="font-semibold text-base" style="color:var(--qp-fg-1)">Ajouter une recommandation</h2>
          <p class="text-xs mt-1" style="color:var(--qp-fg-3)">Visite : {{ recoAuditEntite?.entite?.libelle ?? '—' }}</p>
        </div>
        <div class="p-6 grid gap-4">
          <div class="qp-field">
            <label class="qp-label">Recommandation <span class="req">*</span></label>
            <textarea v-model="recoForm.libelle" class="qp-textarea" rows="3" placeholder="Décrivez la recommandation…" />
          </div>
          <div class="qp-field">
            <label class="qp-label">Statut</label>
            <select v-model="recoForm.statut" class="qp-select">
              <option v-for="s in RECO_STATUTS" :key="s.value" :value="s.value">{{ s.label }}</option>
            </select>
          </div>
        </div>
        <div class="px-6 py-4 border-t flex justify-end gap-2.5" style="border-color:var(--qp-border-1)">
          <button class="px-4 py-2 text-sm rounded-lg border" style="border-color:var(--qp-border-1)" @click="recoModalOpen = false">Annuler</button>
          <button class="px-4 py-2 text-sm font-semibold rounded-lg text-white" style="background:var(--qp-primary-500)" :disabled="saving" @click="sauvegarderReco">
            Ajouter
          </button>
        </div>
      </div>
    </UModal>

    <!-- ── Modal confirmation suppression ──────────────────────────────────── -->
    <UModal v-model="confirmModalOpen" :ui="{ width: 'sm:max-w-sm' }">
      <div class="bg-white rounded-xl overflow-hidden">
        <div class="px-6 py-4 border-b" style="border-color:var(--qp-border-1)">
          <h2 class="font-semibold text-base" style="color:var(--qp-fg-1)">Confirmer la suppression</h2>
        </div>
        <div class="p-6 text-sm" style="color:var(--qp-fg-2)">{{ confirmMessage }}</div>
        <div class="px-6 py-4 border-t flex justify-end gap-2.5" style="border-color:var(--qp-border-1)">
          <button class="px-4 py-2 text-sm rounded-lg border" style="border-color:var(--qp-border-1)" @click="confirmModalOpen = false">Annuler</button>
          <button class="px-4 py-2 text-sm font-semibold rounded-lg text-white" style="background:var(--qp-danger-500)" :disabled="saving" @click="executerConfirmation">
            Supprimer
          </button>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup>
import { usePaq }          from '~/composables/smq/usePaq'
import { useReferentiels } from '~/composables/smq/useReferentiels'
import { useIndicateurs }  from '~/composables/smq/useIndicateurs'
import { useSmqStore }     from '~/stores/smq'

useHead({ title: 'Plan Audit Qualité — SMQ · SAGA' })

const store = useSmqStore()
const {
  fetchAudits, createAudit, updateAudit, deleteAudit,
  ajouterEntiteAudit, supprimerEntiteAudit,
  updateAuditEntite, syncParticipants,
  fetchRecommandations, createRecommandation, updateRecommandation,
  fetchEntites, fetchSmqUsers,
  AUDIT_STATUTS, badgeAuditStatut, labelAuditStatut,
  RECO_STATUTS, colorRecoStatut,
} = usePaq()
const { fetchExercices, fetchExerciceActif } = useReferentiels()
const { formatDate, initialesAvatar } = useIndicateurs()

// ── État global ───────────────────────────────────────────────────────────────

const loading        = ref(true)
const saving         = ref(false)
const semestre       = ref('S1')
const audits         = ref([])
const recommandations = ref([])
const exercices      = ref([])
const exerciceActif  = ref(null)
const entitesDisponibles = ref([])
const smqUsers       = ref([])

// ── Modal audit ───────────────────────────────────────────────────────────────

const auditModalOpen = ref(false)
const auditEnCours   = ref(null)
const auditForm      = reactive({
  titre: '', referentiel: 'ISO 9001',
  date_debut: '', date_fin: '',
  statut: 'a_planifier', exercice_id: null,
})

// ── Modal visite par entité ───────────────────────────────────────────────────

const entiteDropdownOpen = ref(false)
const entiteDropdownRef  = ref(null)
const entiteSearch       = ref('')
const auditeurSearch     = ref('')

const entitesFiltrees = computed(() => {
  const q = entiteSearch.value.toLowerCase().trim()
  return q
    ? entitesDisponibles.value.filter(e => e.libelle.toLowerCase().includes(q))
    : entitesDisponibles.value
})

const selectionnerEntite = (e) => {
  visiteForm.entite_id    = e.id
  entiteDropdownOpen.value = false
  entiteSearch.value       = ''
}

const auditeursFiltres = computed(() => {
  const q = auditeurSearch.value.toLowerCase().trim()
  return q
    ? smqUsers.value.filter(u =>
        nomComplet(u).toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
      )
    : smqUsers.value
})

// Fermer le dropdown en cliquant ailleurs
onMounted(() => {
  document.addEventListener('click', (evt) => {
    if (entiteDropdownRef.value && !entiteDropdownRef.value.contains(evt.target)) {
      entiteDropdownOpen.value = false
    }
  })
})

const visiteModalOpen = ref(false)
const visiteAudit     = ref(null)   // l'audit parent
const visiteEnCours   = ref(null)   // null = création, objet = édition
const visiteForm      = reactive({
  entite_id: '',
  date: '',
  heure_debut: '',
  heure_fin: '',
  participants: [],
  observations_generales: '',
})

// ── Modal recommandation ──────────────────────────────────────────────────────

const recoModalOpen    = ref(false)
const recoAuditEntite  = ref(null)
const recoForm         = reactive({ libelle: '', statut: 'ouvert' })

// ── Modal confirmation ────────────────────────────────────────────────────────

const confirmModalOpen = ref(false)
const confirmMessage   = ref('')
const confirmAction    = ref(null)

// ── Computed ──────────────────────────────────────────────────────────────────

const exerciceLabel = computed(() => exerciceActif.value?.annee ?? '—')

const AVATAR_COLORS = ['#6E59C7', 'var(--qp-teal-500)', 'var(--qp-navy-500)', 'var(--qp-primary-500)']
const avatarCouleur = (n) => AVATAR_COLORS[(n?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length]
const nomComplet    = (u) => [u?.nom, u?.prenom].filter(Boolean).join(' ') || u?.name || '—'

const titreAudit    = (a) => a?.audits_entites?.[0]?.entite?.libelle ? `Audit — ${a.audits_entites[0].entite.libelle}` : 'Audit'
const iconAudit     = (s) => ({ realise: 'heroicons:clipboard-document-check', a_planifier: 'heroicons:compass', en_cours: 'heroicons:play-circle', a_a_planifierr: 'heroicons:calendar-days' }[s] ?? 'heroicons:clipboard-document')
const iconStyleAudit = (s) => ({
  realise:     'background:var(--qp-success-50);color:var(--qp-success-600)',
  a_planifier:    'background:var(--qp-info-50);color:var(--qp-info-600)',
  en_cours:    'background:var(--qp-primary-50);color:var(--qp-primary-600)',
  a_a_planifierr: 'background:var(--qp-warning-50);color:var(--qp-warning-700)',
}[s] ?? 'background:var(--qp-n-50);color:var(--qp-fg-2)')

// Retourne les IDs des entités déjà planifiées dans l'audit en cours
const entiteDejaAjoutee = (entiteId) => {
  if (!visiteAudit.value) return false
  return (visiteAudit.value.audits_entites ?? []).some(ae => ae.entite_id === entiteId || ae.entite?.id === entiteId)
}

// ── Chargement ────────────────────────────────────────────────────────────────

const charger = async () => {
  loading.value = true
  try {
    const [auditList, recoList] = await Promise.all([
      fetchAudits({ exercice_id: exerciceActif.value?.id }),
      fetchRecommandations({ per_page: 20 }),
    ])
    audits.value          = auditList
    recommandations.value = recoList
  } catch (e) {
    console.error('❌ PAQ :', e)
  } finally {
    loading.value = false
  }
}

// ── Audit (CRUD) ──────────────────────────────────────────────────────────────

const ouvrirAudit = (audit) => {
  auditEnCours.value = audit
  Object.assign(auditForm, {
    titre:       audit?.titre        ?? '',
    referentiel: audit?.referentiel  ?? 'ISO 9001',
    date_debut:  audit?.date_debut   ?? '',
    date_fin:    audit?.date_fin     ?? '',
    statut:      audit?.statut       ?? 'a_planifier',
    exercice_id: exerciceActif.value?.id ?? null,
  })
  auditModalOpen.value = true
}

const sauvegarderAudit = async () => {
  if (!auditForm.date_debut) return
  saving.value = true
  try {
    if (auditEnCours.value?.id) await updateAudit(auditEnCours.value.id, auditForm)
    else                         await createAudit(auditForm)
    auditModalOpen.value = false
    await charger()
  } catch (e) {
    console.error('❌ Sauvegarde audit :', e)
  } finally {
    saving.value = false
  }
}

const confirmerSuppressionAudit = (audit) => {
  confirmMessage.value = `Supprimer l'audit "${audit.titre || titreAudit(audit)}" et toutes ses visites ?`
  confirmAction.value  = async () => {
    await deleteAudit(audit.id)
    await charger()
  }
  confirmModalOpen.value = true
}

// ── Visite par entité ─────────────────────────────────────────────────────────

const ouvrirVisite = async (audit, ae) => {
  visiteAudit.value   = audit
  visiteEnCours.value = ae ?? null

  Object.assign(visiteForm, {
    entite_id:               ae?.entite_id ?? ae?.entite?.id ?? '',
    date:                    ae?.date      ? ae.date.substring(0, 10) : '',
    heure_debut:             ae?.heure_debut ?? '',
    heure_fin:               ae?.heure_fin   ?? '',
    participants:            (ae?.users ?? []).map(u => u.id),
    observations_generales:  ae?.observations_generales ?? '',
  })

  entiteDropdownOpen.value = false
  entiteSearch.value       = ''
  auditeurSearch.value     = ''
  visiteModalOpen.value    = true
}

const sauvegarderVisite = async () => {
  saving.value = true
  try {
    if (visiteEnCours.value?.id) {
      // Mise à jour d'une visite existante
      await updateAuditEntite(visiteEnCours.value.id, {
        date:                   visiteForm.date,
        heure_debut:            visiteForm.heure_debut,
        heure_fin:              visiteForm.heure_fin,
        observations_generales: visiteForm.observations_generales,
        participants:           visiteForm.participants,
      })
    } else {
      // Création d'une nouvelle visite (ajout entité à l'audit)
      await ajouterEntiteAudit(visiteAudit.value.id, {
        entite_id:              visiteForm.entite_id,
        date:                   visiteForm.date,
        heure_debut:            visiteForm.heure_debut,
        heure_fin:              visiteForm.heure_fin,
        observations_generales: visiteForm.observations_generales,
        participants:           visiteForm.participants,
      })
    }
    visiteModalOpen.value = false
    await charger()
  } catch (e) {
    console.error('❌ Sauvegarde visite :', e)
  } finally {
    saving.value = false
  }
}

const confirmerSuppressionVisite = (audit, ae) => {
  confirmMessage.value = `Retirer l'entité "${ae.entite?.libelle ?? '?'}" de l'audit ? Ses recommandations seront aussi supprimées.`
  confirmAction.value  = async () => {
    await supprimerEntiteAudit(audit.id, ae.id)
    await charger()
  }
  confirmModalOpen.value = true
}

// ── Recommandations ───────────────────────────────────────────────────────────

const ouvrirRecommandation = (ae) => {
  recoAuditEntite.value = ae
  Object.assign(recoForm, { libelle: '', statut: 'ouvert', audit_entite_id: ae.id })
  recoModalOpen.value = true
  // S'assurer que la section sera visible après ajout
  const s = new Set(recoOuvertes.value)
  s.add(ae.id)
  recoOuvertes.value = s
}

const sauvegarderReco = async () => {
  if (!recoForm.libelle.trim()) return
  saving.value = true
  try {
    await createRecommandation({ ...recoForm })
    recoModalOpen.value = false
    const recoList = await fetchRecommandations({ per_page: 20 })
    recommandations.value = recoList
  } catch (e) {
    console.error('❌ Recommandation :', e)
  } finally {
    saving.value = false
  }
}

// Cycle : ouvert → en cours → clos → ouvert
const RECO_CYCLE = { 'ouvert': 'en cours', 'en cours': 'clos', 'clos': 'ouvert' }

const labelRecoStatut = (s) =>
  s === 'clos' ? 'Appliquée' : s === 'en cours' ? 'En cours' : 'Ouverte'

const recoStatutStyle = (s) => {
  if (s === 'clos')     return 'background:var(--qp-success-50);color:var(--qp-success-700);border:1px solid var(--qp-success-200)'
  if (s === 'en cours') return 'background:var(--qp-warning-50);color:var(--qp-warning-700);border:1px solid var(--qp-warning-200)'
  return 'background:var(--qp-danger-50);color:var(--qp-danger-700);border:1px solid var(--qp-danger-200)'
}

const toggleRecoStatut = async (reco) => {
  const next = RECO_CYCLE[reco.statut] ?? 'ouvert'
  try {
    await updateRecommandation(reco.id, { statut: next })
    reco.statut = next
    // Sync dans la colonne droite si présente
    const r = recommandations.value.find(r => r.id === reco.id)
    if (r) r.statut = next
  } catch (e) { console.error(e) }
}

// ── Affichage au choix des recommandations par visite ────────────────────────
const recoOuvertes  = ref(new Set())  // IDs des ae dont les recos sont visibles
const recoExpandees = ref(new Set())  // IDs des ae dont les recos sont "toutes" affichées

const toggleRecoOuvertes = (aeId) => {
  const s = new Set(recoOuvertes.value)
  s.has(aeId) ? s.delete(aeId) : s.add(aeId)
  recoOuvertes.value = s
}

const toggleRecoExpanded = (aeId) => {
  const s = new Set(recoExpandees.value)
  s.has(aeId) ? s.delete(aeId) : s.add(aeId)
  recoExpandees.value = s
}

const recoVisibles = (ae) =>
  recoExpandees.value.has(ae.id)
    ? ae.recommandations
    : ae.recommandations.slice(0, 2)

// ── Confirmation générique ────────────────────────────────────────────────────

const executerConfirmation = async () => {
  if (!confirmAction.value) return
  saving.value = true
  try {
    await confirmAction.value()
    confirmModalOpen.value = false
    confirmAction.value    = null
  } catch (e) {
    console.error('❌ Suppression :', e)
  } finally {
    saving.value = false
  }
}

// ── Init ──────────────────────────────────────────────────────────────────────

onMounted(async () => {
  const [exList, exActif, entitesList, usersList] = await Promise.all([
    fetchExercices(),
    fetchExerciceActif(),
    fetchEntites(),
    fetchSmqUsers(),
  ])
  exercices.value         = exList
  exerciceActif.value     = exActif ?? exList[0] ?? null
  entitesDisponibles.value = entitesList
  smqUsers.value          = usersList
  await charger()
})
</script>

<style scoped>
.smq-content { font-family: 'IBM Plex Sans', system-ui, sans-serif; }
.req { color: var(--qp-danger-500); margin-left: 2px; }
</style>
