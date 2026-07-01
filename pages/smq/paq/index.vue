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
      <button class="qp-btn qp-btn--header-cta" @click="ouvrirAudit(null)">
        <Icon name="heroicons:plus" class="h-4 w-4" />
        Planifier un audit
      </button>
    </SmqPageHeader>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="w-8 h-8 border-4 border-slate-200 rounded-full animate-spin" style="border-top-color: var(--qp-primary-500)"></div>
    </div>

    <div v-else class="grid gap-4" style="grid-template-columns: 1fr 320px; align-items: start">

      <!-- ── Colonne principale : audits ──────────────────────────────────── -->
      <div>
        <div v-if="!audits.length" class="qp-card qp-card--pad text-center py-12 text-sm" style="color:var(--qp-fg-3)">
          Aucun audit planifié pour ce semestre.
        </div>

        <template v-for="audit in audits" :key="audit?.id ?? audit">
        <div
          v-if="audit?.id"
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
            <!-- Audit réalisé : badge cadenas -->
            <span
              v-if="audit.statut === 'realise'"
              class="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium"
              style="background:var(--qp-success-50);color:var(--qp-success-700);border:1px solid var(--qp-success-200)"
              title="Audit clôturé — lecture seule"
            >
              <Icon name="heroicons:lock-closed" class="h-3.5 w-3.5" />
              Clôturé
            </span>
            <!-- Bouton Télécharger PDF (toujours visible) -->
            <button
              class="w-8 h-8 rounded-md flex items-center justify-center transition-all text-xs"
              style="color:var(--qp-danger-600);background:var(--qp-danger-50)"
              title="Télécharger le programme (PDF)"
              :disabled="pdfLoading"
              @click.stop="telechargerProgrammePdf(audit)"
            >
              <Icon :name="pdfLoading ? 'heroicons:arrow-path' : 'heroicons:document-arrow-down'" class="h-4 w-4" :class="{ 'animate-spin': pdfLoading }" />
            </button>
            <!-- Boutons d'action (masqués si réalisé) -->
            <template v-if="audit.statut !== 'realise'">
              <!-- Bouton ajouter entité -->
              <button
                class="w-8 h-8 rounded-md flex items-center justify-center transition-all text-xs"
                style="color:var(--qp-primary-600);background:var(--qp-primary-50)"
                title="Planifier une visite d'entité"
                @click="ouvrirVisite(audit, null)"
              >
                <Icon name="heroicons:clipboard-document-list" class="h-4 w-4" />
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
            </template>
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
                <!-- Libellé entité + titre + processus -->
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium truncate" style="color:var(--qp-fg-1)">
                    {{ ae.entite?.libelle ?? ae.libelle ?? '—' }}
                  </div>
                  <div v-if="ae.entite?.processus" class="text-xs truncate mt-0.5" style="color:var(--qp-fg-3)">
                    {{ ae.entite.processus.libelle }}
                  </div>
                </div>
                <!-- Avatars auditeurs (couronne pour le chef) -->
                <div class="flex" style="margin-left:-4px">
                  <div
                    v-for="u in (ae.users ?? []).slice(0, 4)"
                    :key="u.id"
                    class="relative flex-none"
                    style="margin-left:-6px"
                  >
                    <span
                      class="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-semibold"
                      style="border:2px solid var(--qp-n-25)"
                      :style="{ background: avatarCouleur(nomComplet(u)) }"
                      :title="nomComplet(u) + (u.pivot?.is_chef ? ' (chef d\'équipe)' : '')"
                    >{{ initialesAvatar(nomComplet(u)) }}</span>
                    <!-- Bonhomme chef d'équipe -->
                    <span
                      v-if="u.pivot?.is_chef"
                      class="absolute -top-1.5 -right-1 flex items-center justify-center w-3.5 h-3.5 rounded-full"
                      style="background:var(--qp-warning-400);color:#fff;border:1px solid #fff"
                      title="Chef d'équipe"
                    >
                      <Icon name="heroicons:user-solid" class="h-2.5 w-2.5" />
                    </span>
                  </div>
                  <span
                    v-if="(ae.users ?? []).length > 4"
                    class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold"
                    style="border:2px solid var(--qp-n-25); margin-left:-6px; background:var(--qp-n-200); color:var(--qp-fg-2)"
                  >+{{ ae.users.length - 4 }}</span>
                </div>
                <!-- Bouton modifier visite (masqué si réalisé) -->
                <button
                  v-if="audit.statut !== 'realise'"
                  class="w-7 h-7 rounded flex items-center justify-center transition-all"
                  style="color:var(--qp-primary-500)"
                  title="Modifier la programmation de cette visite"
                  @click="ouvrirVisite(audit, ae)"
                >
                  <Icon name="heroicons:calendar-days" class="h-4 w-4" />
                </button>
                <!-- Bouton afficher/masquer recommandations (toujours visible en lecture) -->
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
                <!-- Bouton ajouter recommandation (masqué si réalisé) -->
                <button
                  v-if="audit.statut !== 'realise'"
                  class="w-7 h-7 rounded flex items-center justify-center transition-all"
                  style="color:var(--qp-fg-3)"
                  title="Ajouter une recommandation"
                  @click="ouvrirRecommandation(ae)"
                >
                  <Icon name="heroicons:plus" class="h-4 w-4" />
                </button>
                <!-- Bouton supprimer visite (masqué si réalisé) -->
                <button
                  v-if="audit.statut !== 'realise'"
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
                  <span class="w-1.5 h-1.5 rounded-full mt-1.5 flex-none" :style="{ background: colorRecoStatut(reco.statut) }"></span>
                  <span class="flex-1 text-xs leading-relaxed" style="color:var(--qp-fg-2)">{{ reco.libelle }}</span>
                  <!-- Badge statut (toujours cliquable, même si audit réalisé) -->
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
              v-if="audit.statut !== 'realise'"
              class="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-md"
              style="color:var(--qp-primary-600);background:var(--qp-primary-50)"
              @click="ouvrirVisite(audit, null)"
            >
              <Icon name="heroicons:plus" class="h-3.5 w-3.5" />
              Ajouter une entité à auditer
            </button>
            <span v-else class="text-xs" style="color:var(--qp-fg-3)">Audit clôturé — aucune visite enregistrée</span>
          </div>
        </div>

        <!-- ── Section Programme ───────────────────────────────────────────── -->
        <div style="border-top:1px solid var(--qp-border-2)">
          <!-- Toggle header -->
          <div
            class="flex items-center justify-between px-[18px] py-2.5 cursor-pointer select-none"
            style="background:var(--qp-n-25)"
            @click="toggleProgramme(audit)"
          >
            <div class="flex items-center gap-2">
              <Icon
                :name="programmeOuvert.has(audit.id) ? 'heroicons:chevron-down' : 'heroicons:chevron-right'"
                class="h-3.5 w-3.5"
                style="color:var(--qp-fg-3)"
              />
              <span class="text-xs font-semibold" style="color:var(--qp-fg-2)">Programme</span>
              <span
                v-if="((programmeItems[audit.id]?.length ?? 0) + (audit.audits_entites?.length ?? 0)) > 0"
                class="inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold text-white"
                style="background:var(--qp-primary-500)"
              >{{ (programmeItems[audit.id]?.length ?? 0) + (audit.audits_entites?.length ?? 0) }}</span>
            </div>
            <button
              v-if="audit.statut !== 'realise' && peutGererProgramme"
              class="text-xs flex items-center gap-1 px-2.5 py-1 rounded-md"
              style="color:var(--qp-primary-600);background:var(--qp-primary-50)"
              @click.stop="ouvrirModalProgramme(audit, null)"
            >
              <Icon name="heroicons:plus" class="h-3 w-3" />
              Ajouter
            </button>
          </div>

          <!-- Contenu programme (déplié) -->
          <div v-if="programmeOuvert.has(audit.id)">
            <div v-if="!(programmeItems[audit.id]?.length) && !(audit.audits_entites?.length)" class="px-[18px] py-4 text-xs text-center" style="color:var(--qp-fg-3)">
              Aucun item de programme. Cliquez sur « Ajouter » pour commencer.
            </div>
            <table v-else class="w-full" style="border-collapse:collapse">
              <thead>
                <tr style="background:var(--qp-n-50);border-bottom:1px solid var(--qp-border-2)">
                  <th class="text-left text-xs font-semibold px-3 py-1.5" style="color:var(--qp-fg-3);width:120px">Horaire</th>
                  <th class="text-left text-xs font-semibold px-3 py-1.5" style="color:var(--qp-fg-3)">Processus / Activité</th>
                  <th class="text-left text-xs font-semibold px-3 py-1.5" style="color:var(--qp-fg-3)">Pilotes / Participants</th>
                  <th style="width:64px"></th>
                </tr>
              </thead>
              <tbody>
                <template
                  v-for="row in avecPauses(audit.audits_entites ?? [], programmeItems[audit.id] ?? [])"
                  :key="row._type === 'date_header' ? 'dh-' + row.date : row._type === 'pause' ? 'p-' + row.heure_debut : row._id ?? 'row'"
                >
                  <!-- En-tête de jour -->
                  <tr v-if="row._type === 'date_header'">
                    <td colspan="5" class="px-3 py-1.5 text-xs font-bold text-center" style="background:var(--qp-primary-600);color:#fff">
                      {{ formatDateFr(row.date) }}
                    </td>
                  </tr>
                  <!-- Pause automatique -->
                  <tr v-else-if="row._type === 'pause'" style="background:var(--qp-n-25)">
                    <td class="px-3 py-1.5 text-xs qp-num" style="color:var(--qp-fg-3)">{{ row.heure_debut }} – {{ row.heure_fin }}</td>
                    <td colspan="4" class="px-3 py-1.5 text-xs font-medium italic text-center" style="color:var(--qp-fg-3)">— Pause —</td>
                  </tr>
                  <!-- Visite d'entité (depuis audits_entites) -->
                  <tr v-else-if="row._source === 'entite'" style="border-bottom:1px solid var(--qp-border-2);background:var(--qp-n-25)">
                    <td class="px-3 py-2 text-xs qp-num" style="color:var(--qp-fg-2)">
                      {{ row.heure_debut ?? '' }}{{ (row.heure_debut && row.heure_fin) ? ' – ' : '' }}{{ row.heure_fin ?? '' }}
                    </td>
                    <td class="px-3 py-2">
                      <div class="text-xs font-medium" style="color:var(--qp-fg-1)">{{ row.libelle }}</div>
                      <div v-if="row.sous_libelle" class="text-xs mt-0.5" style="color:var(--qp-fg-3)">{{ row.sous_libelle }}</div>
                    </td>
                    <td class="px-3 py-2 text-xs" style="color:var(--qp-fg-2)">
                      {{ [row.pilotes_text, (row.auditeurs ?? []).map(u => (u.prenom ? u.prenom[0] + '. ' : '') + u.nom).join(', ')].filter(Boolean).join(' — ') || '—' }}
                    </td>
                    <td></td>
                  </tr>
                  <!-- Item programme spécial (réunion d'ouverture, clôture, autre) -->
                  <tr v-else style="border-bottom:1px solid var(--qp-border-2)">
                    <td class="px-3 py-2 text-xs qp-num" style="color:var(--qp-fg-2)">
                      {{ row.heure_debut ?? '' }}{{ (row.heure_debut && row.heure_fin) ? ' – ' : '' }}{{ row.heure_fin ?? '' }}
                    </td>
                    <td class="px-3 py-2">
                      <div class="text-xs font-medium" style="color:var(--qp-fg-1)">{{ labelTypeProgramme(row.type) }}</div>
                      <div v-if="row.libelle" class="text-xs mt-0.5" style="color:var(--qp-fg-3)">{{ row.libelle }}</div>
                    </td>
                    <td class="px-3 py-2 text-xs" style="color:var(--qp-fg-2)">{{ row.pilotes_text || '—' }}</td>
                    <td class="px-2 py-2">
                      <div v-if="audit.statut !== 'realise' && peutGererProgramme" class="flex gap-1 justify-end">
                        <button
                          class="w-6 h-6 rounded flex items-center justify-center"
                          style="color:var(--qp-fg-3)"
                          @click="ouvrirModalProgramme(audit, row)"
                        ><Icon name="heroicons:pencil-square" class="h-3.5 w-3.5" /></button>
                        <button
                          class="w-6 h-6 rounded flex items-center justify-center"
                          style="color:var(--qp-danger-500)"
                          @click="supprimerItemProgramme(row)"
                        ><Icon name="heroicons:trash" class="h-3.5 w-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
        </template>
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
          ></span>
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
              <input v-model="auditForm.referentiel" class="qp-input" placeholder="ISO 9001 : 2015" />
            </div>
            <div class="qp-field">
              <label class="qp-label">Type d'audit</label>
              <select v-model="auditForm.type_audit_id" class="qp-select">
                <option :value="null">— Choisir —</option>
                <option v-for="t in typesAudit" :key="t.id" :value="t.id">{{ t.libelle }}</option>
              </select>
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
          <div class="grid grid-cols-2 gap-4">
            <div class="qp-field">
              <label class="qp-label">Observateur</label>
              <select v-model="auditForm.observateur_id" class="qp-select">
                <option :value="null">— Choisir —</option>
                <option v-for="o in observateurs" :key="o.id" :value="o.id">{{ o.libelle }}</option>
              </select>
            </div>
            <div class="qp-field">
              <label class="qp-label">Site(s) audité(s)</label>
              <div class="flex flex-col gap-1.5 mt-1">
                <label
                  v-for="s in sitesAudites"
                  :key="s.id"
                  class="flex items-center gap-2 cursor-pointer text-sm"
                  style="color:var(--qp-fg-1)"
                >
                  <input
                    type="checkbox"
                    :value="s.id"
                    v-model="auditForm.site_ids"
                    style="accent-color:var(--qp-primary-500);width:15px;height:15px"
                  />
                  {{ s.libelle }}
                </label>
                <span v-if="!sitesAudites.length" class="text-xs" style="color:var(--qp-fg-4)">Aucun site configuré</span>
              </div>
            </div>
          </div>
          <div class="qp-field">
            <label class="qp-label">Objectifs d'audit</label>
            <textarea v-model="auditForm.objectifs" class="qp-textarea" rows="3" placeholder="Décrire les objectifs de cet audit…"></textarea>
          </div>
          <div class="qp-field">
            <label class="qp-label">Critères d'audit</label>
            <textarea v-model="auditForm.criteres_audit" class="qp-textarea" rows="3" placeholder="Référentiels, procédures ou exigences applicables…"></textarea>
          </div>
          <!-- Superviseurs (multi-select) -->
          <div class="qp-field">
            <label class="qp-label">Superviseurs</label>
            <!-- Chips sélectionnés -->
            <div v-if="auditForm.superviseurs_ids.length" class="flex flex-wrap gap-1.5 mb-2">
              <span
                v-for="uid in auditForm.superviseurs_ids"
                :key="uid"
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                style="background:var(--qp-warning-50);color:var(--qp-warning-800);border:1px solid var(--qp-warning-300)"
              >
                <span
                  class="w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-bold flex-none"
                  :style="{ background: avatarCouleur(nomComplet(smqUsers.find(u => u.id === uid))) }"
                >{{ initialesAvatar(nomComplet(smqUsers.find(u => u.id === uid))) }}</span>
                {{ nomComplet(smqUsers.find(u => u.id === uid)) }}
                <button
                  type="button"
                  class="ml-0.5 hover:text-red-500"
                  @click.prevent="auditForm.superviseurs_ids = auditForm.superviseurs_ids.filter(id => id !== uid)"
                >
                  <Icon name="heroicons:x-mark" class="h-3 w-3" />
                </button>
              </span>
            </div>
            <!-- Recherche -->
            <div class="relative mb-1">
              <Icon name="heroicons:magnifying-glass" class="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none" style="color:var(--qp-fg-3)" />
              <input
                v-model="superviseurSearch"
                class="qp-input"
                style="height:34px;font-size:13px;padding-left:30px"
                placeholder="Rechercher un superviseur…"
              />
            </div>
            <!-- Liste checkboxes -->
            <div class="rounded-lg border overflow-hidden" style="border-color:var(--qp-border-1);max-height:160px;overflow-y:auto">
              <div v-if="!smqUsers.length" class="px-3 py-2 text-sm" style="color:var(--qp-fg-3)">Chargement…</div>
              <div v-else-if="!superviseursFiltres.length" class="px-3 py-3 text-sm" style="color:var(--qp-fg-3)">Aucun résultat</div>
              <label
                v-for="u in superviseursFiltres"
                :key="u.id"
                class="flex items-center gap-3 px-3 py-2 cursor-pointer border-b last:border-b-0"
                :style="auditForm.superviseurs_ids.includes(u.id)
                  ? 'background:var(--qp-warning-50);border-color:var(--qp-border-2)'
                  : 'background:#fff;border-color:var(--qp-border-2)'"
              >
                <input
                  type="checkbox"
                  :value="u.id"
                  v-model="auditForm.superviseurs_ids"
                  class="rounded flex-none"
                  style="accent-color:var(--qp-warning-500)"
                />
                <span
                  class="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-semibold flex-none"
                  :style="{ background: avatarCouleur(nomComplet(u)) }"
                >{{ initialesAvatar(nomComplet(u)) }}</span>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium truncate" style="color:var(--qp-fg-1)">{{ nomComplet(u) }}</div>
                  <div class="text-xs truncate" style="color:var(--qp-fg-3)">{{ u.email }}</div>
                </div>
                <Icon v-if="auditForm.superviseurs_ids.includes(u.id)" name="heroicons:check" class="h-4 w-4 flex-none" style="color:var(--qp-warning-500)" />
              </label>
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
                :style="visiteForm.chef_id === uid
                  ? 'background:var(--qp-warning-50);color:var(--qp-warning-800);border:1px solid var(--qp-warning-300)'
                  : 'background:var(--qp-primary-50);color:var(--qp-primary-700);border:1px solid var(--qp-primary-100)'"
              >
                <!-- Avatar -->
                <span
                  class="w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-bold flex-none"
                  :style="{ background: avatarCouleur(nomComplet(smqUsers.find(u => u.id === uid))) }"
                >{{ initialesAvatar(nomComplet(smqUsers.find(u => u.id === uid))) }}</span>
                {{ nomComplet(smqUsers.find(u => u.id === uid)) }}
                <!-- Bouton chef d'équipe (bonhomme) -->
                <button
                  type="button"
                  class="ml-0.5 flex items-center"
                  :title="visiteForm.chef_id === uid ? 'Retirer le rôle de chef d\'équipe' : 'Désigner chef d\'équipe'"
                  :style="visiteForm.chef_id === uid ? 'color:var(--qp-warning-600)' : 'color:var(--qp-fg-3)'"
                  @click.prevent="demanderChefEquipe(uid)"
                >
                  <Icon name="heroicons:user-solid" class="h-3.5 w-3.5" />
                </button>
                <!-- Retirer auditeur -->
                <button
                  type="button"
                  class="ml-0.5 hover:text-red-500"
                  @click.prevent="visiteForm.participants = visiteForm.participants.filter(id => id !== uid); if(visiteForm.chef_id === uid) visiteForm.chef_id = null"
                >
                  <Icon name="heroicons:x-mark" class="h-3 w-3" />
                </button>
              </span>
            </div>
            <p v-if="visiteForm.participants.length" class="text-xs mb-1" style="color:var(--qp-fg-3)">
              Cliquez sur <Icon name="heroicons:user-solid" class="h-3 w-3 inline" /> pour désigner le chef d'équipe (fond doré).
            </p>
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
            ></textarea>
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
            <textarea v-model="recoForm.libelle" class="qp-textarea" rows="3" placeholder="Décrivez la recommandation…"></textarea>
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

    <!-- ── Overlay confirmation chef d'équipe (div custom, évite la fermeture du UModal parent) -->
    <Teleport to="body">
      <div
        v-if="chefConfirmOpen"
        class="fixed inset-0 flex items-center justify-center"
        style="z-index:9999;background:rgba(0,0,0,0.45)"
        @click.self="chefConfirmOpen = false"
      >
        <div class="bg-white rounded-2xl overflow-hidden text-center" style="width:360px;max-width:95vw">
          <div class="flex justify-center pt-8 pb-3">
            <div class="w-16 h-16 rounded-full flex items-center justify-center" style="background:var(--qp-warning-100)">
              <Icon name="heroicons:user-solid" class="h-8 w-8" style="color:var(--qp-warning-600)" />
            </div>
          </div>
          <h2 class="text-base font-bold px-6 mb-2" style="color:var(--qp-fg-1)">Désigner chef d'équipe</h2>
          <p class="text-sm px-6 mb-5" style="color:var(--qp-fg-2)">
            Voulez-vous désigner
            <strong>{{ nomComplet(smqUsers.find(u => u.id === chefCandidatId)) }}</strong>
            comme chef d'équipe pour cette visite ?
          </p>
          <div v-if="chefCandidatId && visiteForm.chef_id && chefCandidatId !== visiteForm.chef_id" class="mx-6 mb-4 px-4 py-2 rounded-lg text-xs text-left" style="background:var(--qp-warning-50);color:var(--qp-warning-700);border:1px solid var(--qp-warning-200)">
            Le rôle de chef sera retiré à <strong>{{ nomComplet(smqUsers.find(u => u.id === visiteForm.chef_id)) }}</strong>.
          </div>
          <div class="flex gap-3 px-6 pb-7">
            <button class="flex-1 py-2.5 text-sm rounded-xl border" style="border-color:var(--qp-border-1);color:var(--qp-fg-2)" @click="chefConfirmOpen = false">Annuler</button>
            <button class="flex-1 py-2.5 text-sm font-semibold rounded-xl text-white" style="background:var(--qp-warning-500)" @click="confirmerChefEquipe">Confirmer</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ── Alerte chef désigné ─────────────────────────────────────────────── -->
    <Transition name="fade-up">
      <div
        v-if="chefAlerteVisible"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium"
        style="background:var(--qp-warning-500);color:#fff;min-width:280px"
      >
        <Icon name="heroicons:user-solid" class="h-5 w-5 flex-none" />
        <span>{{ chefAlerteMsg }}</span>
      </div>
    </Transition>

    <!-- ── Alerte blocage audit (style SweetAlert) ───────────────────────────── -->
    <UModal v-model="blocageModalOpen" :ui="{ width: 'sm:max-w-sm' }">
      <div class="bg-white rounded-2xl overflow-hidden text-center">
        <!-- Icône centrale -->
        <div class="flex justify-center pt-8 pb-3">
          <div
            class="w-20 h-20 rounded-full flex items-center justify-center"
            style="background:var(--qp-warning-100)"
          >
            <Icon name="heroicons:exclamation-triangle" class="h-10 w-10" style="color:var(--qp-warning-500)" />
          </div>
        </div>
        <!-- Titre -->
        <h2 class="text-lg font-bold px-6 mb-2" style="color:var(--qp-fg-1)">Action impossible</h2>
        <!-- Message -->
        <p class="text-sm px-6 mb-4" style="color:var(--qp-fg-2)">
          Vous ne pouvez pas planifier un nouvel audit tant qu'un audit non réalisé existe.
        </p>
        <!-- Détail de l'audit bloquant -->
        <div v-if="blocageAudit" class="mx-6 mb-5 px-4 py-3 rounded-xl text-sm text-left" style="background:var(--qp-warning-50);border:1px solid var(--qp-warning-200)">
          <p class="font-semibold mb-0.5" style="color:var(--qp-warning-800)">
            {{ blocageAudit.titre || titreAudit(blocageAudit) }}
          </p>
          <p class="text-xs" style="color:var(--qp-warning-700)">
            Statut actuel : <strong>{{ labelAuditStatut(blocageAudit.statut) }}</strong>
          </p>
        </div>
        <p class="text-xs px-6 mb-6" style="color:var(--qp-fg-3)">
          Marquez cet audit comme <strong>Réalisé</strong> pour pouvoir en planifier un nouveau.
        </p>
        <!-- Bouton -->
        <div class="px-6 pb-7">
          <button
            class="w-full py-2.5 text-sm font-semibold rounded-xl"
            style="background:var(--qp-warning-500);color:#fff"
            @click="blocageModalOpen = false"
          >
            OK, compris
          </button>
        </div>
      </div>
    </UModal>

    <!-- ── Modal Programme : ajout/édition item ─────────────────────────── -->
    <div
      v-if="modalProgramme"
      class="fixed inset-0 z-50 flex items-center justify-center"
      style="background:rgba(0,0,0,0.4)"
      @click.self="modalProgramme = false"
    >
      <div class="qp-card" style="width:560px;max-width:95vw;max-height:90vh;overflow-y:auto">
        <!-- En-tête -->
        <div class="flex items-center justify-between px-5 pt-5 pb-4" style="border-bottom:1px solid var(--qp-border-2)">
          <h3 class="font-semibold text-base" style="color:var(--qp-fg-1);margin:0">
            {{ formProgramme.id ? 'Modifier l\'item' : 'Ajouter au programme' }}
          </h3>
          <button @click="modalProgramme = false">
            <Icon name="heroicons:x-mark" class="h-5 w-5" style="color:var(--qp-fg-3)" />
          </button>
        </div>

        <div class="px-5 py-4 flex flex-col gap-4">
          <!-- Type -->
          <div class="qp-field">
            <label class="qp-label">Type d'item</label>
            <select v-model="formProgramme.type" class="qp-select">
              <option v-for="t in TYPES_ITEM" :key="t.value" :value="t.value">{{ t.label }}</option>
            </select>
          </div>

          <!-- Date + heures -->
          <div class="grid gap-4" style="grid-template-columns:1fr 1fr 1fr">
            <div class="qp-field" style="grid-column:1/-1">
              <label class="qp-label">Date</label>
              <input v-model="formProgramme.date" type="date" class="qp-input qp-input--mono" />
            </div>
            <div class="qp-field">
              <label class="qp-label">Heure début</label>
              <input v-model="formProgramme.heure_debut" type="time" class="qp-input qp-input--mono" />
            </div>
            <div class="qp-field">
              <label class="qp-label">Heure fin</label>
              <input v-model="formProgramme.heure_fin" type="time" class="qp-input qp-input--mono" />
            </div>
          </div>

          <!-- Libellé (processus/activité) -->
          <div v-if="formProgramme.type === 'autre'" class="qp-field">
            <label class="qp-label">Libellé</label>
            <input
              v-model="formProgramme.libelle"
              class="qp-input"
              placeholder="Ex : Visite terrain, point administratif…"
            />
          </div>

          <!-- Pilotes -->
          <div class="qp-field">
            <label class="qp-label">Pilotes</label>
            <input
              v-model="formProgramme.pilotes_text"
              class="qp-input"
              placeholder="Ex : DGR et Collaborateurs"
            />
          </div>

        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-2 px-5 pb-5">
          <button
            class="px-4 py-2 text-sm rounded-lg"
            style="color:var(--qp-fg-2)"
            @click="modalProgramme = false"
          >Annuler</button>
          <button
            class="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-white"
            style="background:var(--qp-primary-500)"
            :disabled="savingProgramme"
            @click="sauvegarderItemProgramme"
          >
            <Icon
              :name="savingProgramme ? 'heroicons:arrow-path' : 'heroicons:check'"
              class="h-4 w-4"
              :class="{ 'animate-spin': savingProgramme }"
            />
            {{ savingProgramme ? 'Enregistrement…' : 'Enregistrer' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePaq }          from '~/composables/smq/usePaq'
import { useReferentiels } from '~/composables/smq/useReferentiels'
import { useIndicateurs }  from '~/composables/smq/useIndicateurs'
import { useSmqStore }         from '~/stores/smq'
import { useAuditProgramme }  from '~/composables/smq/useAuditProgramme'
import { useAuth }             from '~/composables/auth/useAuth'

useHead({ title: 'Plan Audit Qualité — SMQ · SAGA' })

const store = useSmqStore()
const {
  fetchAudits, createAudit, updateAudit, deleteAudit, downloadAuditPdf,
  ajouterEntiteAudit, supprimerEntiteAudit,
  updateAuditEntite, syncParticipants,
  fetchRecommandations, createRecommandation, updateRecommandation,
  fetchEntites, fetchSmqUsers,
  AUDIT_STATUTS, badgeAuditStatut, labelAuditStatut,
  RECO_STATUTS, colorRecoStatut,
} = usePaq()
const { fetchExercices, fetchExerciceActif } = useReferentiels()
const { fetchProgramme, createItem: createProgrammeItem, updateItem: updateProgrammeItem, deleteItem: deleteProgrammeItem, avecPauses, TYPES_ITEM, labelType: labelTypeProgramme } = useAuditProgramme()
const { isSmqRQ, isSmqRQA, isSmqAdmin } = useAuth()
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
// ── Référentiels audit (chargés depuis l'API) ─────────────────────────────────
const typesAudit    = ref([])
const observateurs  = ref([])
const sitesAudites  = ref([])

const chargerReferentiels = async () => {
  const token = process.client ? localStorage.getItem('auth_token') : ''
  const h = { Authorization: `Bearer ${token}`, Accept: 'application/json' }
  const base = useRuntimeConfig().public.apiBase
  try {
    const [ta, obs, sa] = await Promise.all([
      $fetch(`${base}/smq/types-audits`,  { headers: h }),
      $fetch(`${base}/smq/observateurs`,  { headers: h }),
      $fetch(`${base}/smq/sites-audites`, { headers: h }),
    ])
    typesAudit.value   = (ta?.data  ?? ta  ?? []).filter(i => i.actif)
    observateurs.value = (obs?.data ?? obs ?? []).filter(i => i.actif)
    sitesAudites.value = (sa?.data  ?? sa  ?? []).filter(i => i.actif)
  } catch {
    // silencieux — listes vides si API indisponible
  }
}

const AUDIT_DEFAULTS = {
  referentiel:    'ISO 9001 – 2015, fiches processus et autres documents d\'application',
  type_audit_id:  null,
  objectifs:      '',
  observateur_id: null,
  criteres_audit: '',
}

const auditForm      = reactive({
  titre: '',
  referentiel:      AUDIT_DEFAULTS.referentiel,
  type_audit_id:    AUDIT_DEFAULTS.type_audit_id,
  objectifs:        AUDIT_DEFAULTS.objectifs,
  observateur_id:   AUDIT_DEFAULTS.observateur_id,
  site_ids:         [],   // tableau d'IDs (relation N→N)
  criteres_audit:   AUDIT_DEFAULTS.criteres_audit,
  superviseurs_ids: [],
  date_debut: '', date_fin: '',
  statut: 'a_planifier', exercice_id: null,
})
const superviseurSearch = ref('')
const pdfLoading = ref(false)

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
  visiteForm.entite_id     = e.id
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

const superviseursFiltres = computed(() => {
  const q = superviseurSearch.value.toLowerCase().trim()
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
  chef_id: null,   // ID du chef d'équipe
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

// ── Chef d'équipe : confirmation + alerte ────────────────────────────────────

const chefConfirmOpen  = ref(false)
const chefCandidatId   = ref(null)
const chefAlerteVisible = ref(false)
const chefAlerteMsg    = ref('')

const demanderChefEquipe = (uid) => {
  // Si c'est déjà le chef → retrait direct sans popup
  if (visiteForm.chef_id === uid) {
    visiteForm.chef_id = null
    return
  }
  chefCandidatId.value = uid
  chefConfirmOpen.value = true
}

const confirmerChefEquipe = () => {
  const nom = nomComplet(smqUsers.value.find(u => u.id === chefCandidatId.value))
  visiteForm.chef_id   = chefCandidatId.value
  chefConfirmOpen.value = false
  chefCandidatId.value  = null
  // Alerte toast
  chefAlerteMsg.value     = `${nom} désigné(e) comme chef d'équipe`
  chefAlerteVisible.value  = true
  setTimeout(() => { chefAlerteVisible.value = false }, 3500)
}

// ── Modal blocage (audit non réalisé) ─────────────────────────────────────────

const blocageModalOpen = ref(false)
const blocageMessage   = ref('')
const blocageAudit     = ref(null)

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
    // Tri : non réalisés d'abord (par date_debut desc), puis réalisés (par date_debut desc)
    const trier = (list) => [...list].sort((a, b) => {
      const aRealise = a.statut === 'realise' ? 1 : 0
      const bRealise = b.statut === 'realise' ? 1 : 0
      if (aRealise !== bRealise) return aRealise - bRealise
      return (b.date_debut ?? '').localeCompare(a.date_debut ?? '')
    })
    audits.value          = trier((auditList ?? []).filter(Boolean))
    recommandations.value = recoList
  } catch (e) {
    console.error('❌ PAQ :', e)
  } finally {
    loading.value = false
  }
}

// ── Audit (CRUD) ──────────────────────────────────────────────────────────────

const ouvrirAudit = (audit) => {
  // En création : bloquer si un audit non réalisé existe déjà
  if (!audit) {
    const bloquant = audits.value.find(a => a.statut !== 'realise')
    if (bloquant) {
      blocageAudit.value   = bloquant
      blocageMessage.value = 'Vous ne pouvez pas planifier un nouvel audit tant qu\'un audit non réalisé existe pour cet exercice.'
      blocageModalOpen.value = true
      return
    }
  }

  auditEnCours.value = audit
  Object.assign(auditForm, {
    titre:            audit?.titre            ?? '',
    referentiel:      audit?.referentiel      ?? AUDIT_DEFAULTS.referentiel,
    type_audit_id:    audit?.type_audit_id    ?? audit?.type_audit?.id   ?? AUDIT_DEFAULTS.type_audit_id,
    objectifs:        audit?.objectifs        ?? AUDIT_DEFAULTS.objectifs,
    observateur_id:   audit?.observateur_id   ?? audit?.observateur?.id  ?? AUDIT_DEFAULTS.observateur_id,
    site_ids:         (audit?.sites ?? []).map(s => s.id),
    criteres_audit:   audit?.criteres_audit   ?? AUDIT_DEFAULTS.criteres_audit,
    superviseurs_ids: (audit?.superviseurs ?? []).map(u => u.id),
    date_debut:       audit?.date_debut      ?? '',
    date_fin:         audit?.date_fin        ?? '',
    statut:           audit?.statut          ?? 'a_planifier',
    exercice_id:      exerciceActif.value?.id ?? null,
  })
  superviseurSearch.value = ''
  auditModalOpen.value = true
}

const telechargerProgrammePdf = async (audit) => {
  if (pdfLoading.value) return
  pdfLoading.value = true
  try {
    const blob = await downloadAuditPdf(audit.id)
    const url  = window.URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `PAQ_Audit_${audit.id}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  } catch (e) {
    console.error('❌ PDF audit :', e)
  } finally {
    pdfLoading.value = false
  }
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
    const data = e?.data ?? e?.response?.data
    if (data?.audit_bloquant) {
      // Règle métier : un audit non réalisé bloque la création
      auditModalOpen.value = false
      blocageAudit.value   = data.audit_bloquant
      blocageMessage.value = data.message ?? 'Un audit non réalisé existe déjà.'
      blocageModalOpen.value = true
    } else {
      console.error('❌ Sauvegarde audit :', e)
    }
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

const ouvrirVisite = (audit, ae) => {
  visiteAudit.value   = audit
  visiteEnCours.value = ae ?? null

  const chef = (ae?.users ?? []).find(u => u.pivot?.is_chef)
  Object.assign(visiteForm, {
    entite_id:               ae?.entite_id ?? ae?.entite?.id ?? '',
    date:                    ae?.date      ? ae.date.substring(0, 10) : '',
    heure_debut:             ae?.heure_debut ?? '',
    heure_fin:               ae?.heure_fin   ?? '',
    participants:            (ae?.users ?? []).map(u => u.id),
    chef_id:                 chef?.id ?? null,
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
        chef_id:                visiteForm.chef_id,
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
        chef_id:                visiteForm.chef_id,
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

// ── Programme ────────────────────────────────────────────────────────────────

const peutGererProgramme  = computed(() => isSmqRQ() || isSmqRQA() || isSmqAdmin())
const programmeOuvert     = ref(new Set())
const programmeItems      = ref({})   // { [auditId]: AuditProgrammeItem[] }
const modalProgramme      = ref(false)
const savingProgramme     = ref(false)
const auditCourantProg    = ref(null)
const formProgramme       = reactive({
  id: null, type: 'reunion_ouverture', date: '', heure_debut: '', heure_fin: '',
  libelle: '', pilotes_text: '',
})


const formatDateFr = (d) => {
  if (!d) return ''
  const dt = new Date((d + '').substring(0, 10) + 'T00:00:00')
  return dt.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

const toggleProgramme = async (audit) => {
  const id = audit.id
  const next = new Set(programmeOuvert.value)
  if (next.has(id)) {
    next.delete(id)
  } else {
    next.add(id)
    if (!programmeItems.value[id]) {
      programmeItems.value = { ...programmeItems.value, [id]: await fetchProgramme(id) }
    }
  }
  programmeOuvert.value = next
}

const ouvrirModalProgramme = (audit, item) => {
  auditCourantProg.value = audit
  Object.assign(formProgramme, {
    id:           item?.id           ?? null,
    type:         item?.type         ?? 'reunion_ouverture',
    date:         (item?.date ?? audit.date_debut ?? '').toString().substring(0, 10),
    heure_debut:  item?.heure_debut  ?? '',
    heure_fin:    item?.heure_fin    ?? '',
    libelle:      item?.libelle      ?? '',
    pilotes_text: item?.pilotes_text ?? '',

  })
  modalProgramme.value = true
}

const sauvegarderItemProgramme = async () => {
  if (!auditCourantProg.value || savingProgramme.value) return
  savingProgramme.value = true
  try {
    const payload = {
      type:         formProgramme.type,
      date:         formProgramme.date,
      heure_debut:  formProgramme.heure_debut || null,
      heure_fin:    formProgramme.heure_fin   || null,
      libelle:      formProgramme.libelle      || null,
      pilotes_text: formProgramme.pilotes_text || null,

    }
    if (formProgramme.id) {
      await updateProgrammeItem(formProgramme.id, payload)
    } else {
      await createProgrammeItem(auditCourantProg.value.id, payload)
    }
    const id = auditCourantProg.value.id
    programmeItems.value = { ...programmeItems.value, [id]: await fetchProgramme(id) }
    modalProgramme.value = false
  } catch (e) { console.error('Programme save:', e) }
  finally { savingProgramme.value = false }
}

const supprimerItemProgramme = async (item) => {
  if (!confirm('Supprimer cet item du programme ?')) return
  const auditId = item.audit_id
  await deleteProgrammeItem(item.id)
  programmeItems.value = { ...programmeItems.value, [auditId]: await fetchProgramme(auditId) }
}

onMounted(async () => {
  try {
    const [exList, exActif, entitesList, usersList] = await Promise.all([
      fetchExercices(),
      fetchExerciceActif(),
      fetchEntites(),
      fetchSmqUsers(),
    ])
    exercices.value          = exList
    exerciceActif.value      = exActif ?? exList[0] ?? null
    entitesDisponibles.value = entitesList
    smqUsers.value           = usersList
    await Promise.all([charger(), chargerReferentiels()])
  } catch (e) {
    console.error('❌ PAQ init:', e)
    loading.value = false
  }
})
</script>

<style scoped>
.smq-content { }
.req { color: var(--qp-danger-500); margin-left: 2px; }

/* Toast chef d'équipe */
.fade-up-enter-active, .fade-up-leave-active { transition: opacity 0.3s, transform 0.3s; }
.fade-up-enter-from, .fade-up-leave-to { opacity: 0; transform: translateX(-50%) translateY(12px); }
</style>
                                                                                                                             