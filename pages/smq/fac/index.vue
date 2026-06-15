<template>
  <div class="smq-content">

    <!-- Template FAC caché pour génération PDF -->
    <div id="fac-pdf-template" style="position:absolute;left:-9999px;top:0;width:190mm;font-family:Arial,Helvetica,sans-serif;font-size:9.5pt;color:#000;background:#fff" v-if="facCourante">
      <div style="display:flex;align-items:center;border-bottom:2px solid #000;padding-bottom:8px;margin-bottom:10px">
        <div style="flex:0 0 30%"><img :src="logoDgml" alt="DGML" style="max-height:65px;max-width:120px;object-fit:contain" /></div>
        <div style="flex:1;text-align:center"><h1 style="font-size:13pt;letter-spacing:1px;margin:0">FICHE D'ACTIONS CORRECTIVES</h1></div>
      </div>
      <table style="width:100%;border-collapse:collapse;border:1px solid #000;margin-bottom:10px">
        <tr>
          <td style="padding:5px 8px;width:60%;border-right:1px solid #000;font-size:9pt">
            <strong>Fiche établie le</strong> {{ facCourante.date_etablissement ?? '__ / __ / ____' }}
            &nbsp;&nbsp;<strong>Par</strong> {{ facCourante.etabli_par ?? '____________________' }}
          </td>
          <td style="padding:5px 8px;text-align:right;font-size:9pt">
            <strong>Fiche N° :</strong> {{ facCourante.numero_fiche ?? `FAC-${String(facCourante.id).padStart(4,'0')}` }}<br>
            <em style="font-size:8pt;color:#666">(Réservée au RQ)</em>
            <span v-if="facCourante.saisie_indicateur?.indicateur"><br><span style="font-size:8pt">Indicateur : <strong>{{ facCourante.saisie_indicateur.indicateur.code }}</strong></span></span>
          </td>
        </tr>
      </table>
      <!-- Partie Pilote -->
      <div style="border:1px solid #000">
        <div v-for="champ in champsPilotePdf" :key="champ.key" style="border-bottom:1px solid #999">
          <div style="font-weight:bold;font-size:8.5pt;padding:4px 8px 2px;color:#333">{{ champ.label }}</div>
          <div style="font-size:9pt;padding:2px 8px 8px;min-height:18px;white-space:pre-wrap">{{ facCourante[champ.key] }}</div>
        </div>
        <div style="display:flex;border-bottom:1px solid #999">
          <div style="flex:1;border-right:1px solid #ccc;padding:4px 8px">
            <div style="font-weight:bold;font-size:8.5pt">Responsable de l'action :</div>
            <div style="font-size:9pt;padding-top:2px"><strong>{{ facCourante.responsable_action }}</strong></div>
          </div>
          <div style="flex:1;padding:4px 8px">
            <div style="font-weight:bold;font-size:8.5pt">Date prévisionnelle de mise en œuvre :</div>
            <div style="font-size:9pt;padding-top:2px"><strong>{{ facCourante.date_previsionnelle ?? '__ / __ / ____' }}</strong></div>
          </div>
        </div>
        <div style="border-bottom:1px solid #999">
          <div style="font-weight:bold;font-size:8.5pt;padding:4px 8px 2px">Critère d'efficacité :</div>
          <div style="font-size:9pt;padding:2px 8px 8px;min-height:16px">{{ facCourante.critere_efficacite }}</div>
        </div>
        <div>
          <div style="font-weight:bold;font-size:8.5pt;padding:4px 8px 2px">Date prévue pour l'examen des effets :</div>
          <div style="font-size:9pt;padding:2px 8px 8px"><strong>{{ facCourante.date_examen_effets ?? '__ / __ / ____' }}</strong></div>
        </div>
      </div>
      <!-- Partie RQ -->
      <div style="border:1px solid #000;margin-top:10px">
        <div style="background:#d0d0d0;font-weight:bold;font-size:8.5pt;padding:4px 8px;border-bottom:1px solid #000">
          RÉSERVÉE AU RESPONSABLE QUALITÉ (A remplir si les actions correctives sont mises en œuvre)
        </div>
        <div style="border-bottom:1px solid #999;display:flex">
          <div style="flex:1;border-right:1px solid #ccc;padding:4px 8px">
            <div style="font-weight:bold;font-size:8.5pt">Date de vérification :</div>
            <div style="font-size:9pt;padding-top:2px">{{ facCourante.date_verification ?? '__ / __ / ____' }}</div>
          </div>
          <div style="flex:1;padding:4px 8px">
            <div style="font-weight:bold;font-size:8.5pt">Conclusion :</div>
            <div style="font-size:9pt;padding-top:2px">
              <span style="display:inline-block;width:10px;height:10px;border:1px solid #000;vertical-align:middle;text-align:center;font-size:7pt;line-height:10px">{{ facCourante.conclusion_efficacite === 'efficace' ? '✓' : '' }}</span> Action efficace &nbsp;
              <span style="display:inline-block;width:10px;height:10px;border:1px solid #000;vertical-align:middle;text-align:center;font-size:7pt;line-height:10px">{{ facCourante.conclusion_efficacite === 'inefficace' ? '✓' : '' }}</span> Action inefficace
            </div>
          </div>
        </div>
        <div style="border-bottom:1px solid #999;padding:4px 8px;font-size:9pt">
          Fiche clôturée ?
          <span style="display:inline-block;width:10px;height:10px;border:1px solid #000;vertical-align:middle;text-align:center;font-size:7pt;line-height:10px">{{ facCourante.fiche_cloturee === true ? '✓' : '' }}</span> Oui &nbsp;
          <span style="display:inline-block;width:10px;height:10px;border:1px solid #000;vertical-align:middle;text-align:center;font-size:7pt;line-height:10px">{{ facCourante.fiche_cloturee === false ? '✓' : '' }}</span> Non
          <span v-if="facCourante.fiche_cloturee"> &nbsp; Si oui, le <strong>{{ facCourante.date_cloture }}</strong></span>
          <br>
          Ouvrir une nouvelle fiche ?
          <span style="display:inline-block;width:10px;height:10px;border:1px solid #000;vertical-align:middle;text-align:center;font-size:7pt;line-height:10px">{{ facCourante.ouvrir_nouvelle_fiche === true ? '✓' : '' }}</span> Oui &nbsp;
          <span style="display:inline-block;width:10px;height:10px;border:1px solid #000;vertical-align:middle;text-align:center;font-size:7pt;line-height:10px">{{ facCourante.ouvrir_nouvelle_fiche === false ? '✓' : '' }}</span> Non
          <span v-if="facCourante.num_nouvelle_fiche"> &nbsp; Si oui, voir fiche N° <strong>{{ facCourante.num_nouvelle_fiche }}</strong></span>
        </div>
        <div style="border-bottom:1px solid #999;padding:4px 8px">
          <div style="font-weight:bold;font-size:8.5pt">Commentaire(s) éventuel(s) :</div>
          <div style="font-size:9pt;min-height:25px;padding-top:4px">{{ facCourante.commentaires_rq }}</div>
        </div>
        <div style="padding:4px 8px">
          <div style="font-weight:bold;font-size:8.5pt">Nom et Signature :</div>
          <div style="min-height:40px"></div>
        </div>
      </div>
    </div>

    <SmqPageHeader overline="SMQ · FAC" title="Fiches d'Actions Correctives" />

    <!-- KPIs -->
    <div class="grid grid-cols-4 gap-4 mb-4">
      <div v-for="k in kpisList" :key="k.label" class="qp-card qp-card--pad text-center">
        <p class="qp-num text-2xl font-bold mb-1" :style="k.color ? `color:${k.color}` : 'color:var(--qp-fg-1)'">{{ k.value }}</p>
        <p class="text-xs" style="color:var(--qp-fg-3)">{{ k.label }}</p>
      </div>
    </div>

    <!-- Barre de contrôle : recherche + filtres -->
    <div class="flex items-center gap-3 mb-3">
      <!-- Recherche -->
      <div class="relative flex-1" style="max-width:360px">
        <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style="color:var(--qp-fg-3)" />
        <input
          v-model="recherche"
          class="qp-input"
          style="padding-left:36px;height:36px"
          placeholder="Rechercher (N°, indicateur, direction, responsable…)"
        />
      </div>
      <!-- Filtres statut -->
      <div class="qp-seg ml-auto">
        <button
          v-for="f in FAC_STATUTS"
          :key="f.value"
          :class="{ active: filtreStatut === f.value }"
          @click="filtreStatut = f.value"
        >{{ f.label }}</button>
      </div>
    </div>

    <!-- Liste -->
    <div v-if="loading" class="flex justify-center py-16">
      <div class="w-8 h-8 border-4 border-slate-200 rounded-full animate-spin" style="border-top-color:var(--qp-primary-500)" />
    </div>

    <div v-else class="qp-tablecard">
      <table class="qp-table">
        <thead>
          <tr>
            <th style="width:110px">
              <button class="flex items-center gap-1 text-xs font-semibold hover:opacity-70" @click="sortBy('numero_fiche')">
                Fiche N° <Icon :name="sortIcon('numero_fiche')" class="h-3 w-3" />
              </button>
            </th>
            <th>
              <button class="flex items-center gap-1 text-xs font-semibold hover:opacity-70" @click="sortBy('indicateur')">
                Indicateur <Icon :name="sortIcon('indicateur')" class="h-3 w-3" />
              </button>
            </th>
            <th>Description NC</th>
            <th>
              <button class="flex items-center gap-1 text-xs font-semibold hover:opacity-70" @click="sortBy('direction')">
                Direction <Icon :name="sortIcon('direction')" class="h-3 w-3" />
              </button>
            </th>
            <th>Responsable</th>
            <th>
              <button class="flex items-center gap-1 text-xs font-semibold hover:opacity-70" @click="sortBy('date_previsionnelle')">
                Échéance <Icon :name="sortIcon('date_previsionnelle')" class="h-3 w-3" />
              </button>
            </th>
            <th>
              <button class="flex items-center gap-1 text-xs font-semibold hover:opacity-70" @click="sortBy('statut')">
                Statut <Icon :name="sortIcon('statut')" class="h-3 w-3" />
              </button>
            </th>
            <th style="width:40px" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="fac in facListSorted" :key="fac.id" class="cursor-pointer" @click="ouvrirDetail(fac)">
            <td><span class="qp-num text-xs" style="color:var(--qp-fg-3)">{{ fac.numero_fiche ?? `FAC-${fac.id}` }}</span></td>
            <td>
              <p class="text-sm font-medium" style="color:var(--qp-fg-1)">{{ fac.saisie_indicateur?.indicateur?.code ?? '—' }}</p>
              <p class="text-xs" style="color:var(--qp-fg-3)">{{ fac.saisie_indicateur?.indicateur?.libelle }}</p>
            </td>
            <td class="text-sm" style="color:var(--qp-fg-2);max-width:200px">{{ fac.description_nc ?? '—' }}</td>
            <td class="text-sm font-medium" style="color:var(--qp-fg-2)">{{ directionFac(fac) }}</td>
            <td class="text-sm" style="color:var(--qp-fg-2)">{{ fac.responsable_action ?? '—' }}</td>
            <td class="text-sm qp-num" style="color:var(--qp-fg-3)">{{ formatDate(fac.date_previsionnelle) }}</td>
            <td>
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" :style="statutStyle(fac.statut)">
                {{ labelFacStatut(fac.statut) }}
              </span>
            </td>
            <td>
              <button class="w-8 h-8 rounded-md flex items-center justify-center" style="color:var(--qp-fg-3)" @click.stop="ouvrirDetail(fac)">
                <Icon :name="peutModifierFac ? 'heroicons:pencil-square' : 'heroicons:eye'" class="h-4 w-4" />
              </button>
            </td>
          </tr>
          <tr v-if="!facList.length">
            <td colspan="8" class="text-center py-10 text-sm" style="color:var(--qp-fg-3)">Aucune fiche d'action corrective.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal PDF généré -->
    <div v-if="showPdfModal" class="fixed inset-0 z-[60] flex items-center justify-center" style="background:rgba(0,0,0,0.45)" @click.self="showPdfModal = false">
      <div class="qp-card flex flex-col items-center gap-5 px-8 py-8" style="width:400px">
        <div class="flex items-center justify-center w-14 h-14 rounded-full" style="background:var(--qp-success-50)">
          <Icon name="heroicons:document-check" class="h-7 w-7" style="color:var(--qp-success-600)" />
        </div>
        <div class="text-center">
          <p class="font-semibold text-base mb-1" style="color:var(--qp-fg-1)">PDF généré avec succès</p>
          <p class="text-sm" style="color:var(--qp-fg-3)">{{ pdfModalNom }}</p>
          <p v-if="pdfErreur" class="text-xs mt-2" style="color:var(--qp-danger-600)">{{ pdfErreur }}</p>
        </div>
        <div class="flex gap-3 w-full">
          <button class="flex-1 px-4 py-2 text-sm rounded-lg" style="color:var(--qp-fg-2);border:1px solid var(--qp-border-1)" @click="showPdfModal = false">
            Fermer
          </button>
          <button
            class="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-white"
            style="background:var(--qp-primary-500)"
            :disabled="dlLoading"
            @click="telechargerPdf"
          >
            <Icon :name="dlLoading ? 'heroicons:arrow-path' : 'heroicons:arrow-down-tray'" class="h-4 w-4" :class="{ 'animate-spin': dlLoading }" />
            {{ dlLoading ? 'Téléchargement…' : 'Télécharger' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal détail FAC -->
    <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center" style="background:rgba(0,0,0,0.4)" @click.self="modalOpen = false">
      <div class="qp-card" style="width:680px;max-height:90vh;overflow-y:auto">

        <!-- En-tête modal -->
        <div class="flex items-center justify-between px-5 pt-5 pb-4" style="border-bottom:1px solid var(--qp-border-2)">
          <div>
            <p class="qp-overline mb-1">Fiche d'Actions Correctives</p>
            <h3 class="font-semibold text-base" style="color:var(--qp-fg-1);margin:0">
              {{ facCourante?.numero_fiche ?? `FAC-${facCourante?.id}` }}
              <span class="ml-2 text-sm font-normal" style="color:var(--qp-fg-3)">
                {{ facCourante?.saisie_indicateur?.indicateur?.code }}
              </span>
            </h3>
          </div>
          <select v-model="form.statut" class="qp-select" style="width:auto;height:32px;font-size:0.8125rem" :disabled="lectureSeule">
            <option value="ouvert">Ouverte</option>
            <option value="en_cours">En cours</option>
            <option v-if="peutCloturerFac || form.statut === 'clos'" value="clos">Clôturée</option>
          </select>
        </div>

        <!-- Banner lecture seule : FAC clôturée -->
        <div v-if="facCloturee" class="mx-5 mt-4 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium" style="background:var(--qp-success-50);color:var(--qp-success-700);border:1px solid var(--qp-success-200)">
          <Icon name="heroicons:lock-closed" class="h-4 w-4 flex-none" />
          Cette FAC est clôturée — lecture seule.
        </div>
        <!-- Banner lecture seule : pilote (ne peut plus modifier après création) -->
        <div v-else-if="!peutModifierFac" class="mx-5 mt-4 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium" style="background:var(--qp-warning-50);color:var(--qp-warning-700);border:1px solid var(--qp-warning-200)">
          <Icon name="heroicons:eye" class="h-4 w-4 flex-none" />
          Consultation uniquement — seul le RQ ou le RQA peut modifier cette fiche.
        </div>

        <div class="px-5 py-4 flex flex-col gap-5">

          <!-- Entête -->
          <div class="grid gap-4" style="grid-template-columns:1fr 1fr">
            <div class="qp-field">
              <label class="qp-label">Fiche établie le</label>
              <input v-model="form.date_etablissement" type="date" class="qp-input qp-input--mono" :disabled="lectureSeule" />
            </div>
            <div class="qp-field">
              <label class="qp-label">Par</label>
              <input v-model="form.etabli_par" class="qp-input" placeholder="Nom" :disabled="lectureSeule" />
            </div>
          </div>

          <!-- Section Pilote -->
          <div class="rounded-lg overflow-hidden" style="border:1px solid var(--qp-border-2)">
            <div class="px-4 py-2" style="background:var(--qp-n-50);border-bottom:1px solid var(--qp-border-2)">
              <p class="text-xs font-semibold uppercase tracking-wide" style="color:var(--qp-fg-2)">Partie Pilote</p>
            </div>
            <div class="p-4 flex flex-col gap-4">
              <div class="qp-field">
                <label class="qp-label">Description de la non-conformité ou du dysfonctionnement <span class="req">*</span></label>
                <textarea v-model="form.description_nc" class="qp-textarea" rows="3" :disabled="lectureSeule" />
              </div>
              <div class="qp-field">
                <label class="qp-label">Action effectuée pour maîtriser et corriger la non-conformité</label>
                <textarea v-model="form.action_maitrise" class="qp-textarea" rows="2" :disabled="lectureSeule" />
              </div>
              <div class="qp-field">
                <label class="qp-label">Cause(s) du dysfonctionnement ou de la non-conformité</label>
                <textarea v-model="form.causes" class="qp-textarea" rows="2" :disabled="lectureSeule" />
              </div>
              <div class="qp-field">
                <label class="qp-label">Action(s) corrective(s) proposée(s) pour supprimer ou limiter les causes</label>
                <textarea v-model="form.actions_proposees" class="qp-textarea" rows="3" :disabled="lectureSeule" />
              </div>
              <div class="grid gap-4" style="grid-template-columns:1fr 1fr">
                <div class="qp-field" style="grid-column:1/-1">
                  <label class="qp-label">Responsable(s) de l'action</label>
                  <div class="flex flex-col gap-2">
                    <!-- Tags sélectionnés -->
                    <div class="flex flex-wrap gap-1 min-h-[36px] px-2 py-1 rounded-lg border" style="border-color:var(--qp-border-1);background:var(--qp-n-0)">
                      <span
                        v-for="uid in responsablesChoisis" :key="uid"
                        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                        style="background:var(--qp-primary-100);color:var(--qp-primary-700)"
                      >
                        {{ responsablesList.find(u => u.id === uid)?.nom_complet }}
                        <button v-if="!lectureSeule" type="button" @click="responsablesChoisis = responsablesChoisis.filter(i => i !== uid)" style="line-height:1;margin-left:2px">×</button>
                      </span>
                      <span v-if="!responsablesChoisis.length" class="text-xs self-center" style="color:var(--qp-fg-3)">
                        {{ responsablesList.length ? 'Aucun sélectionné' : 'Chargement…' }}
                      </span>
                    </div>
                    <!-- Liste de cases à cocher -->
                    <div v-if="!lectureSeule && responsablesList.length" class="flex flex-col gap-0.5 max-h-36 overflow-y-auto rounded-lg border px-2 py-1" style="border-color:var(--qp-border-1)">
                      <label
                        v-for="u in responsablesList" :key="u.id"
                        class="flex items-center gap-2 text-sm px-1 py-1 rounded cursor-pointer"
                        :style="responsablesChoisis.includes(u.id) ? 'background:var(--qp-primary-50)' : ''"
                      >
                        <input
                          type="checkbox"
                          :value="u.id"
                          v-model="responsablesChoisis"
                          style="accent-color:var(--qp-primary-500);width:14px;height:14px;flex-shrink:0"
                        />
                        <span style="color:var(--qp-fg-2)">{{ u.nom_complet }}</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div class="qp-field">
                  <label class="qp-label">Date prévisionnelle de mise en œuvre</label>
                  <input v-model="form.date_previsionnelle" type="date" class="qp-input qp-input--mono" :disabled="lectureSeule" />
                </div>
                <div class="qp-field">
                  <label class="qp-label">Critère d'efficacité</label>
                  <input v-model="form.critere_efficacite" class="qp-input" placeholder="Ex. : indicateur ≥ cible 2 périodes" :disabled="lectureSeule" />
                </div>
                <div class="qp-field">
                  <label class="qp-label">Date prévue pour l'examen des effets</label>
                  <input v-model="form.date_examen_effets" type="date" class="qp-input qp-input--mono" :disabled="lectureSeule" />
                </div>
              </div>
            </div>
          </div>

          <!-- Section RQ -->
          <div class="rounded-lg overflow-hidden" :style="peutRemplirRQ ? 'border:1px solid var(--qp-primary-200)' : 'border:1px solid var(--qp-border-1)'">
            <div class="px-4 py-2" :style="peutRemplirRQ ? 'background:var(--qp-primary-50);border-bottom:1px solid var(--qp-primary-200)' : 'background:var(--qp-n-50);border-bottom:1px solid var(--qp-border-1)'">
              <p class="text-xs font-semibold uppercase tracking-wide" :style="peutRemplirRQ ? 'color:var(--qp-primary-700)' : 'color:var(--qp-fg-3)'">
                Réservée au Responsable Qualité
              </p>
            </div>
            <div v-if="peutRemplirRQ" class="p-4 flex flex-col gap-4">
              <div class="grid gap-4" style="grid-template-columns:1fr 1fr">
                <div class="qp-field">
                  <label class="qp-label">Date de vérification de l'efficacité</label>
                  <input v-model="form.date_verification" type="date" class="qp-input qp-input--mono" :disabled="lectureSeule" />
                </div>
                <div class="qp-field">
                  <label class="qp-label">Conclusion</label>
                  <select v-model="form.conclusion_efficacite" class="qp-select" :disabled="lectureSeule">
                    <option value="">— Choisir —</option>
                    <option value="efficace">Action efficace</option>
                    <option value="inefficace">Action inefficace</option>
                  </select>
                </div>
                <div class="qp-field">
                  <label class="qp-label">Fiche clôturée ?</label>
                  <select v-model="form.fiche_cloturee" class="qp-select" :disabled="facCloturee || !peutCloturerFac">
                    <option :value="null">— Choisir —</option>
                    <option :value="true">Oui</option>
                    <option :value="false">Non</option>
                  </select>
                </div>
                <div v-if="form.fiche_cloturee" class="qp-field">
                  <label class="qp-label">Si oui, le</label>
                  <input v-model="form.date_cloture" type="date" class="qp-input qp-input--mono" :disabled="facCloturee || !peutCloturerFac" />
                </div>
              </div>
              <div v-if="form.fiche_cloturee === false" class="grid gap-4" style="grid-template-columns:1fr 1fr">
                <div class="qp-field">
                  <label class="qp-label">Ouvrir une nouvelle fiche ?</label>
                  <select v-model="form.ouvrir_nouvelle_fiche" class="qp-select" :disabled="lectureSeule">
                    <option :value="null">— Choisir —</option>
                    <option :value="true">Oui</option>
                    <option :value="false">Non</option>
                  </select>
                </div>
                <div v-if="form.ouvrir_nouvelle_fiche" class="qp-field">
                  <label class="qp-label">Voir fiche N°</label>
                  <input v-model="form.num_nouvelle_fiche" class="qp-input qp-input--mono" :disabled="lectureSeule" />
                </div>
              </div>
              <div class="qp-field">
                <label class="qp-label">Commentaire(s) éventuel(s)</label>
                <textarea v-model="form.commentaires_rq" class="qp-textarea" rows="2" :disabled="lectureSeule" />
              </div>
            </div>
            <div v-else class="px-4 py-3 flex items-center gap-2">
              <Icon name="heroicons:lock-closed" class="h-4 w-4 flex-none" style="color:var(--qp-fg-3)" />
              <p class="text-xs" style="color:var(--qp-fg-3)">Cette section est réservée au Responsable Qualité.</p>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between px-5 pb-5">
          <div class="flex items-center gap-2">
            <button
              class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border"
              style="background:#fff;border-color:var(--qp-border-1);color:var(--qp-fg-2)"
              :disabled="pdfLoading"
              @click="genererPdf"
            >
              <Icon :name="pdfLoading ? 'heroicons:arrow-path' : 'heroicons:document-arrow-down'" class="h-4 w-4" :class="{ 'animate-spin': pdfLoading }" />
              {{ pdfLoading ? 'Génération…' : (facADejaUnPdf ? 'Regénérer' : 'Générer PDF') }}
            </button>
            <button
              v-if="facADejaUnPdf"
              class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border"
              style="background:#fff;border-color:var(--qp-success-300);color:var(--qp-success-700)"
              :disabled="dlLoading"
              @click="telechargerPdf"
            >
              <Icon :name="dlLoading ? 'heroicons:arrow-path' : 'heroicons:arrow-down-tray'" class="h-4 w-4" :class="{ 'animate-spin': dlLoading }" />
              {{ dlLoading ? 'Téléchargement…' : 'Télécharger' }}
            </button>
          </div>
          <div class="flex gap-2">
            <button class="px-4 py-2 text-sm rounded-lg" style="color:var(--qp-fg-2)" @click="modalOpen = false">Fermer</button>
            <button
              v-if="!lectureSeule"
              class="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-white"
              style="background:var(--qp-primary-500)"
              :disabled="saving"
              @click="sauvegarder"
            >
              <Icon name="heroicons:check" class="h-4 w-4" />
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFac }         from '~/composables/smq/useFac'
import { useIndicateurs } from '~/composables/smq/useIndicateurs'
import { useAuth }        from '~/composables/auth/useAuth'
import logoDgml           from '~/assets/images/logo_dgml.png'

useHead({ title: 'Actions correctives — SMQ · SAGA' })

const route   = useRoute()
const config  = useRuntimeConfig()
const apiBase = config.public.apiBase
const { fetchFac, updateFac, fetchResponsablesPossibles, generateFacPdf, downloadFacPdf, FAC_STATUTS, labelFacStatut } = useFac()
const { formatDate } = useIndicateurs()
const { isSmqRQ, isSmqRQA, isSmqAdmin } = useAuth()

const peutRemplirRQ   = computed(() => isSmqRQ() || isSmqRQA() || isSmqAdmin())
const peutCloturerFac = computed(() => isSmqRQ() || isSmqRQA())
const peutModifierFac = computed(() => isSmqRQ() || isSmqRQA() || isSmqAdmin())
const facCloturee     = computed(() => facCourante.value?.fiche_cloturee === true || facCourante.value?.statut === 'clos')
// lecture seule si FAC clôturée OU si l'utilisateur n'est pas RQ/RQA/admin
const lectureSeule    = computed(() => facCloturee.value || !peutModifierFac.value)
const facADejaUnPdf   = computed(() => !!facCourante.value?.pdf_url)

// Normalise "2026-06-09T00:00:00.000000Z" → "2026-06-09"
const toDate = (v) => v ? String(v).substring(0, 10) : ''

const champsPilotePdf = [
  { key: 'description_nc',    label: 'Description de la non-conformité ou du dysfonctionnement' },
  { key: 'action_maitrise',   label: 'Action effectuée pour maîtriser et corriger la non-conformité' },
  { key: 'causes',            label: 'Cause(s) du dysfonctionnement ou de la non-conformité' },
  { key: 'actions_proposees', label: 'Action(s) corrective(s) proposée(s) pour supprimer ou limiter les causes' },
]

const loading      = ref(true)
const saving       = ref(false)
const filtreStatut = ref('')
const recherche    = ref('')
const facList      = ref([])
const modalOpen    = ref(false)
const facCourante  = ref(null)
const kpis         = ref({ ouvertes: 0, en_cours: 0, clos: 0, total: 0 })

const kpisList = computed(() => [
  { label: 'FAC ouvertes', value: kpis.value.ouvertes },
  { label: 'En cours',     value: kpis.value.en_cours },
  { label: 'Clôturées',   value: kpis.value.clos, color: 'var(--qp-success-600)' },
  { label: 'Total',        value: kpis.value.total },
])

const form = reactive({
  statut: 'ouvert', date_etablissement: '', etabli_par: '',
  description_nc: '', action_maitrise: '', causes: '', actions_proposees: '',
  responsable_action: '', date_previsionnelle: '', critere_efficacite: '', date_examen_effets: '',
  date_verification: '', conclusion_efficacite: '',
  fiche_cloturee: null, date_cloture: '',
  ouvrir_nouvelle_fiche: null, num_nouvelle_fiche: '', commentaires_rq: '',
})

const responsablesList    = ref([])   // { id, nom_complet }[]
const responsablesChoisis = ref([])   // ids sélectionnés

// Synchronise responsablesChoisis → form.responsable_action (noms)
watch(responsablesChoisis, (ids) => {
  form.responsable_action = responsablesList.value
    .filter(u => ids.includes(u.id))
    .map(u => u.nom_complet)
    .join(', ')
})

// Codes couleurs supervisor : clôturée=rouge, en cours=jaune, ouvert=vert
const statutStyle = (s) => ({
  ouvert:   'background:var(--qp-success-50);color:var(--qp-success-700);border:1px solid var(--qp-success-200)',
  en_cours: 'background:var(--qp-warning-50);color:var(--qp-warning-700);border:1px solid var(--qp-warning-200)',
  clos:     'background:var(--qp-danger-50);color:var(--qp-danger-700);border:1px solid var(--qp-danger-200)',
}[s] ?? '')

// Direction = entité pilote de l'indicateur
const directionFac = (fac) => {
  const entites = fac.saisie_indicateur?.indicateur?.entites ?? []
  const pilote = entites.find(e => e.pivot?.is_pilote)
  return pilote?.libelle ?? entites[0]?.libelle ?? '—'
}

// Tri
const sortCol = ref('numero_fiche')
const sortDir = ref('desc')

const sortBy = (col) => {
  if (sortCol.value === col) sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  else { sortCol.value = col; sortDir.value = 'asc' }
}

const sortIcon = (col) => {
  if (sortCol.value !== col) return 'heroicons:chevron-up-down'
  return sortDir.value === 'asc' ? 'heroicons:chevron-up' : 'heroicons:chevron-down'
}

const facListSorted = computed(() => {
  const q = recherche.value.toLowerCase().trim()
  let list = facList.value

  // Filtre statut (client-side)
  if (filtreStatut.value) {
    list = list.filter(f => f.statut === filtreStatut.value)
  }

  // Recherche
  if (q) {
    list = list.filter(f =>
      (f.numero_fiche ?? '').toLowerCase().includes(q) ||
      (f.saisie_indicateur?.indicateur?.code ?? '').toLowerCase().includes(q) ||
      (f.saisie_indicateur?.indicateur?.libelle ?? '').toLowerCase().includes(q) ||
      directionFac(f).toLowerCase().includes(q) ||
      (f.responsable_action ?? '').toLowerCase().includes(q) ||
      (f.description_nc ?? '').toLowerCase().includes(q)
    )
  }

  list = [...list]
  const dir = sortDir.value === 'asc' ? 1 : -1
  return list.sort((a, b) => {
    let va, vb
    if (sortCol.value === 'numero_fiche') {
      va = a.numero_fiche ?? `FAC-${a.id}`
      vb = b.numero_fiche ?? `FAC-${b.id}`
    } else if (sortCol.value === 'indicateur') {
      va = a.saisie_indicateur?.indicateur?.code ?? ''
      vb = b.saisie_indicateur?.indicateur?.code ?? ''
    } else if (sortCol.value === 'direction') {
      va = directionFac(a)
      vb = directionFac(b)
    } else if (sortCol.value === 'date_previsionnelle') {
      va = a.date_previsionnelle ?? ''
      vb = b.date_previsionnelle ?? ''
    } else if (sortCol.value === 'statut') {
      const ORDER = { ouvert: 0, en_cours: 1, clos: 2 }
      va = ORDER[a.statut] ?? 0
      vb = ORDER[b.statut] ?? 0
    } else {
      va = a[sortCol.value] ?? ''
      vb = b[sortCol.value] ?? ''
    }
    if (va < vb) return -1 * dir
    if (va > vb) return 1 * dir
    return 0
  })
})

const charger = async () => {
  loading.value = true
  try {
    const params = { per_page: 100 }
    if (route.query.saisie_id)  params.saisie_indicateur_id = route.query.saisie_id
    const res = await fetchFac(params)
    const list = res?.data ?? res ?? []
    facList.value = list
    kpis.value = {
      ouvertes: list.filter(f => f.statut === 'ouvert').length,
      en_cours: list.filter(f => f.statut === 'en_cours').length,
      clos:     list.filter(f => f.statut === 'clos').length,
      total:    list.length,
    }
  } catch (e) { console.error('FAC :', e) }
  finally { loading.value = false }
}

const ouvrirDetail = (fac) => {
  facCourante.value = fac
  Object.assign(form, {
    statut:               fac.statut              ?? 'ouvert',
    date_etablissement:   toDate(fac.date_etablissement),
    etabli_par:           fac.etabli_par          ?? '',
    description_nc:       fac.description_nc      ?? '',
    action_maitrise:      fac.action_maitrise     ?? '',
    causes:               fac.causes              ?? '',
    actions_proposees:    fac.actions_proposees   ?? '',
    responsable_action:   fac.responsable_action  ?? '',
    date_previsionnelle:  toDate(fac.date_previsionnelle),
    critere_efficacite:   fac.critere_efficacite  ?? '',
    date_examen_effets:   toDate(fac.date_examen_effets),
    date_verification:    toDate(fac.date_verification),
    conclusion_efficacite: fac.conclusion_efficacite ?? '',
    fiche_cloturee:        fac.fiche_cloturee      ?? null,
    date_cloture:          toDate(fac.date_cloture),
    ouvrir_nouvelle_fiche: fac.ouvrir_nouvelle_fiche ?? null,
    num_nouvelle_fiche:    fac.num_nouvelle_fiche   ?? '',
    commentaires_rq:       fac.commentaires_rq      ?? '',
  })
  // Charger les responsables possibles et initialiser la sélection
  responsablesList.value = []
  responsablesChoisis.value = []
  fetchResponsablesPossibles(fac.id).then(list => {
    responsablesList.value = list
    // Pré-sélectionner selon responsable_action (noms stockés)
    const noms = (fac.responsable_action ?? '').split(',').map(n => n.trim()).filter(Boolean)
    responsablesChoisis.value = list
      .filter(u => noms.includes(u.nom_complet))
      .map(u => u.id)
  }).catch(() => {})

  modalOpen.value = true
}

const pdfLoading     = ref(false)
const dlLoading      = ref(false)
const showPdfModal   = ref(false)
const pdfModalNom    = ref('')
const pdfErreur      = ref('')

const genererPdf = async () => {
  if (!facCourante.value || pdfLoading.value) return
  pdfLoading.value = true
  pdfErreur.value  = ''
  try {
    // 1. Générer → sauvegarde pdf_url en base
    const res = await generateFacPdf(facCourante.value.id)
    if (facCourante.value) facCourante.value.pdf_url = res?.url ?? facCourante.value.pdf_url
    const numero = facCourante.value?.numero_fiche ?? `FAC-${String(facCourante.value?.id).padStart(4, '0')}`
    pdfModalNom.value = res?.filename ?? `${numero}.pdf`

    // 2. Afficher le modal
    showPdfModal.value = true
  } catch (e) {
    console.error('Génération PDF :', e)
    alert('Erreur lors de la génération du PDF : ' + (e?.data?.message ?? e?.message ?? 'Erreur inconnue'))
  } finally {
    pdfLoading.value = false
  }
}

const telechargerPdf = async () => {
  if (dlLoading.value) return
  dlLoading.value = true
  pdfErreur.value = ''
  try {
    const blob = await downloadFacPdf(facCourante.value.id)
    const url  = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href  = url
    link.setAttribute('download', pdfModalNom.value || 'FAC.pdf')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    showPdfModal.value = false
  } catch (e) {
    console.error('Téléchargement PDF :', e)
    pdfErreur.value = e?.message ?? 'Échec du téléchargement'
  } finally {
    dlLoading.value = false
  }
}

const sauvegarder = async () => {
  if (!facCourante.value) return
  saving.value = true
  try {
    await updateFac(facCourante.value.id, { ...form })
    modalOpen.value = false
    await charger()
  } catch (e) { console.error('Sauvegarde FAC :', e) }
  finally { saving.value = false }
}

onMounted(() => charger())
</script>

<style scoped>
.smq-content { font-family: 'IBM Plex Sans', system-ui, sans-serif; }
.req { color: var(--qp-danger-500); margin-left: 2px; }
</style>
