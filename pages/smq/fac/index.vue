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
            <div style="font-size:9pt;padding-top:2px"><strong>{{ (facCourante.responsables ?? []).map(u => [u.prenom, u.nom].filter(Boolean).join(' ')).join(', ') || '—' }}</strong></div>
          </div>
          <div style="flex:1;padding:4px 8px">
            <div style="font-weight:bold;font-size:8.5pt">Date prévisionnelle de mise en œuvre :</div>
            <div style="font-size:9pt;padding-top:2px"><strong>{{ facCourante.date_previsionnelle ?? '__ / __ / ____' }}</strong></div>
          </div>
        </div>
        <div style="border-bottom:1px solid #999">
          <div style="font-weight:bold;font-size:8.5pt;padding:4px 8px 2px">Critère d'efficacité :</div>
          <div style="font-size:9pt;padding:2px 8px 8px;min-height:16px">{{ (facCourante.criteres ?? []).map(c => c.libelle).join(' | ') }}</div>
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
      <div v-for="k in kpisList" :key="k.label" class="qp-card qp-card--pad flex items-center gap-3">
        <div class="flex items-center justify-center w-10 h-10 rounded-xl flex-none" :style="`background:${k.bg}`">
          <Icon :name="k.icon" class="h-5 w-5" :style="`color:${k.color}`" />
        </div>
        <div>
          <p class="qp-num text-xl font-bold leading-tight" :style="`color:${k.color}`">{{ k.value }}</p>
          <p class="text-xs leading-tight mt-0.5" style="color:var(--qp-fg-3)">{{ k.label }}</p>
        </div>
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
          <tr v-for="fac in facListPagines" :key="fac.id" class="cursor-pointer" @click="ouvrirDetail(fac)">
            <td><span class="qp-num text-xs" style="color:var(--qp-fg-3)">{{ fac.numero_fiche ?? `FAC-${fac.id}` }}</span></td>
            <td>
              <p class="text-sm font-medium" style="color:var(--qp-fg-1)">{{ fac.saisie_indicateur?.indicateur?.code ?? '—' }}</p>
              <p class="text-xs" style="color:var(--qp-fg-3)">{{ fac.saisie_indicateur?.indicateur?.libelle }}</p>
            </td>
            <td class="text-sm" style="color:var(--qp-fg-2);max-width:200px">{{ fac.description_nc ?? '—' }}</td>
            <td class="text-sm font-medium" style="color:var(--qp-fg-2)">{{ directionFac(fac) }}</td>
            <td class="text-sm" style="color:var(--qp-fg-2)">
              {{ fac.responsables?.length
                ? fac.responsables.map(u => [u.prenom, u.nom].filter(Boolean).join(' ')).join(', ')
                : '—' }}
            </td>
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
          <tr v-if="!facList.length" class="qp-table__empty">
            <td colspan="8">
              <Icon name="heroicons:document-text" class="h-8 w-8 mx-auto mb-2 block opacity-30" />
              Aucune fiche d'action corrective.
            </td>
          </tr>
        </tbody>
      </table>
      <SmqPagination
        v-model="pageFac"
        :total="facListSorted.length"
        :per-page="perPageFac"
        @update:perPage="perPageFac = $event; pageFac = 1"
      />
    </div>

    <!-- Modal détail FAC -->
    <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4" style="background:rgba(0,0,0,0.4)" @click.self="modalOpen = false">
      <div class="qp-card" style="width:860px;max-width:100%;max-height:90vh;overflow-y:auto;overflow-x:hidden;display:flex;flex-direction:column">

        <!-- En-tête modal -->
        <div class="flex items-center justify-between px-5 pt-4 pb-4 rounded-t-xl" style="background:var(--qp-brand-gradient)">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-9 h-9 rounded-lg" style="background:rgba(255,255,255,0.15)">
              <Icon name="heroicons:document-text" class="h-5 w-5 text-white" />
            </div>
            <div>
              <p class="text-xs font-medium text-white opacity-70 uppercase tracking-wide">Fiche d'Actions Correctives</p>
              <h3 class="font-bold text-base text-white" style="margin:0;line-height:1.3">
                {{ facCourante?.numero_fiche ?? `FAC-${facCourante?.id}` }}
                <span v-if="facCourante?.saisie_indicateur?.indicateur?.code" class="ml-2 text-sm font-normal opacity-75">
                  {{ facCourante.saisie_indicateur.indicateur.code }}
                </span>
              </h3>
            </div>
          </div>
          <select v-model="form.statut" class="qp-select" style="width:auto;height:32px;font-size:0.8125rem;background:rgba(255,255,255,0.92)" :disabled="lectureSeule">
            <option value="ouvert">Ouverte</option>
            <option value="en_cours">En cours</option>
            <option v-if="peutCloturerFac || form.statut === 'clos'" value="clos">Clôturée</option>
          </select>
        </div>

        <!-- Banner lecture seule : FAC clôturée -->
        <div v-if="facCloturee" class="mx-7 mt-5 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium" style="background:var(--qp-success-50);color:var(--qp-success-700);border:1px solid var(--qp-success-200)">
          <Icon name="heroicons:lock-closed" class="h-4 w-4 flex-none" />
          Cette FAC est clôturée — lecture seule.
        </div>
        <!-- Banner lecture seule : pilote soumis ou admin -->
        <div v-else-if="!peutModifierFac" class="mx-7 mt-5 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium" style="background:var(--qp-warning-50);color:var(--qp-warning-700);border:1px solid var(--qp-warning-200)">
          <Icon name="heroicons:eye" class="h-4 w-4 flex-none" />
          Consultation uniquement — vous n'avez pas les droits pour modifier cette fiche.
        </div>
        <!-- Banner pilote : première saisie possible -->
        <div v-else-if="!isRQouRQA && !piloteSoumis" class="mx-7 mt-5 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium" style="background:var(--qp-info-50,#eff6ff);color:var(--qp-info-700,#1d4ed8);border:1px solid var(--qp-info-200,#bfdbfe)">
          <Icon name="heroicons:pencil-square" class="h-4 w-4 flex-none" />
          Complétez votre partie et enregistrez. Une fois soumise, elle ne pourra plus être modifiée.
        </div>
        <!-- Banner info : RQ/RQA — seule la Partie RQ est éditable -->
        <div v-else class="mx-7 mt-5 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium" style="background:var(--qp-primary-50);color:var(--qp-primary-700);border:1px solid var(--qp-primary-200)">
          <Icon name="heroicons:pencil-square" class="h-4 w-4 flex-none" />
          La Partie Pilote est en lecture seule. Seule la section Responsable Qualité est modifiable.
        </div>

        <div class="px-7 py-6 flex flex-col gap-6">

          <!-- Entête -->
          <div class="grid gap-4" style="grid-template-columns:1fr 1fr">
            <div class="qp-field">
              <label class="qp-label">Fiche établie le</label>
              <input v-model="form.date_etablissement" type="date" class="qp-input qp-input--mono" :disabled="lectureSeulePilote" />
            </div>
            <div class="qp-field">
              <label class="qp-label">Par</label>
              <input v-model="form.etabli_par" class="qp-input" placeholder="Nom" :disabled="lectureSeulePilote" />
            </div>
          </div>

          <!-- Section Pilote -->
          <div class="rounded-lg overflow-hidden" style="border:1px solid var(--qp-border-2)">
            <div class="px-4 py-2.5 flex items-center gap-2" style="background:var(--qp-brand-gradient);border-bottom:1px solid var(--qp-border-2)">
              <Icon name="heroicons:user-circle" class="h-4 w-4 flex-none text-white opacity-80" />
              <p class="text-xs font-bold uppercase tracking-wide text-white">Partie Pilote</p>
            </div>
            <div class="p-4 flex flex-col gap-4">
              <div class="qp-field">
                <label class="qp-label">Description de la non-conformité ou du dysfonctionnement <span class="req">*</span></label>
                <textarea v-model="form.description_nc" class="qp-textarea" rows="3" :disabled="lectureSeulePilote" />
              </div>
              <div class="qp-field">
                <label class="qp-label">Action effectuée pour maîtriser et corriger la non-conformité</label>
                <textarea v-model="form.action_maitrise" class="qp-textarea" rows="3" :disabled="lectureSeulePilote" />
              </div>
              <div class="qp-field">
                <label class="qp-label">Cause(s) du dysfonctionnement ou de la non-conformité</label>
                <textarea v-model="form.causes" class="qp-textarea" rows="3" :disabled="lectureSeulePilote" />
              </div>
              <div class="qp-field">
                <label class="qp-label">Action(s) corrective(s) proposée(s) pour supprimer ou limiter les causes</label>
                <textarea v-model="form.actions_proposees" class="qp-textarea" rows="3" :disabled="lectureSeulePilote" />
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
                        <button v-if="!lectureSeulePilote" type="button" @click="responsablesChoisis = responsablesChoisis.filter(i => i !== uid)" style="line-height:1;margin-left:2px">×</button>
                      </span>
                      <span v-if="!responsablesChoisis.length" class="text-xs self-center" style="color:var(--qp-fg-3)">
                        {{ responsablesList.length ? 'Aucun sélectionné' : 'Chargement…' }}
                      </span>
                    </div>
                    <!-- Liste de cases à cocher -->
                    <div v-if="!lectureSeulePilote && responsablesList.length" class="flex flex-col gap-0.5 max-h-36 overflow-y-auto rounded-lg border px-2 py-1" style="border-color:var(--qp-border-1)">
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
                  <input v-model="form.date_previsionnelle" type="date" class="qp-input qp-input--mono" :disabled="lectureSeulePilote" />
                </div>
                <!-- Critères d'efficacité multi-entrée -->
                <div class="qp-field" style="grid-column:1/-1">
                  <label class="qp-label">Critères d'efficacité</label>
                  <!-- Badges des critères ajoutés -->
                  <div v-if="criteresEfficacite.length" class="flex flex-wrap gap-1.5 mb-2">
                    <span
                      v-for="(c, i) in criteresEfficacite"
                      :key="i"
                      class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                      style="background:var(--qp-primary-50);color:var(--qp-primary-700);border:1px solid var(--qp-primary-100)"
                    >
                      {{ c }}
                      <button
                        v-if="!lectureSeulePilote"
                        type="button"
                        class="hover:text-red-500 flex-none"
                        @click="criteresEfficacite.splice(i, 1)"
                      >
                        <Icon name="heroicons:x-mark" class="h-3 w-3" />
                      </button>
                    </span>
                  </div>
                  <!-- Champ d'ajout -->
                  <div v-if="!lectureSeulePilote" class="flex gap-2">
                    <input
                      v-model="nouveauCritere"
                      class="qp-input flex-1"
                      placeholder="Ex. : indicateur ≥ cible 2 périodes"
                      @keydown.enter.prevent="ajouterCritere"
                    />
                    <button
                      type="button"
                      class="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg border transition-all"
                      style="border-color:var(--qp-primary-300);color:var(--qp-primary-600);background:var(--qp-primary-50)"
                      :disabled="!nouveauCritere.trim()"
                      @click="ajouterCritere"
                      title="Ajouter un critère"
                    >
                      <Icon name="heroicons:plus" class="h-4 w-4" />
                    </button>
                  </div>
                  <div v-else-if="!criteresEfficacite.length" class="text-xs" style="color:var(--qp-fg-4)">Aucun critère renseigné.</div>
                </div>
                <div class="qp-field">
                  <label class="qp-label">Date prévue pour l'examen des effets</label>
                  <input v-model="form.date_examen_effets" type="date" class="qp-input qp-input--mono" :disabled="lectureSeulePilote" />
                </div>
              </div>
            </div>
          </div>

          <!-- Section RQ -->
          <div class="rounded-lg overflow-hidden" :style="peutRemplirRQ ? 'border:1px solid var(--qp-primary-300)' : 'border:1px solid var(--qp-border-1)'">
            <div class="px-4 py-2.5 flex items-center gap-2" :style="peutRemplirRQ ? 'background:var(--qp-brand-gradient);border-bottom:1px solid var(--qp-primary-300)' : 'background:var(--qp-n-50);border-bottom:1px solid var(--qp-border-1)'">
              <Icon name="heroicons:shield-check" class="h-4 w-4 flex-none" :class="peutRemplirRQ ? 'text-white opacity-80' : ''" :style="peutRemplirRQ ? '' : 'color:var(--qp-fg-3)'" />
              <p class="text-xs font-bold uppercase tracking-wide" :class="peutRemplirRQ ? 'text-white' : ''" :style="peutRemplirRQ ? '' : 'color:var(--qp-fg-3)'">
                Réservée au Responsable Qualité
              </p>
            </div>
            <div v-if="peutRemplirRQ" class="p-4 flex flex-col gap-4">
              <div class="grid gap-4" style="grid-template-columns:1fr 1fr">
                <div class="qp-field">
                  <label class="qp-label">Date de vérification de l'efficacité</label>
                  <input v-model="form.date_verification" type="date" class="qp-input qp-input--mono" :disabled="lectureSeuleRQ" />
                </div>
                <div class="qp-field">
                  <label class="qp-label">Conclusion</label>
                  <select v-model="form.conclusion_efficacite" class="qp-select" :disabled="lectureSeuleRQ">
                    <option value="">— Choisir —</option>
                    <option value="efficace">Action efficace</option>
                    <option value="inefficace">Action inefficace</option>
                  </select>
                </div>
                <div class="qp-field">
                  <label class="qp-label">Fiche clôturée ?</label>
                  <select v-model="form.fiche_cloturee" class="qp-select" :disabled="lectureSeuleRQ">
                    <option :value="null">— Choisir —</option>
                    <option :value="true">Oui</option>
                    <option :value="false">Non</option>
                  </select>
                </div>
                <div v-if="form.fiche_cloturee" class="qp-field">
                  <label class="qp-label">Si oui, le</label>
                  <input v-model="form.date_cloture" type="date" class="qp-input qp-input--mono" :disabled="lectureSeuleRQ" />
                </div>
              </div>
              <div v-if="form.fiche_cloturee === false" class="grid gap-4" style="grid-template-columns:1fr 1fr">
                <div class="qp-field">
                  <label class="qp-label">Ouvrir une nouvelle fiche ?</label>
                  <select v-model="form.ouvrir_nouvelle_fiche" class="qp-select" :disabled="lectureSeuleRQ">
                    <option :value="null">— Choisir —</option>
                    <option :value="true">Oui</option>
                    <option :value="false">Non</option>
                  </select>
                </div>
                <div v-if="form.ouvrir_nouvelle_fiche" class="qp-field">
                  <label class="qp-label">Voir fiche N°</label>
                  <!-- Fiche déjà créée : afficher le numéro comme badge -->
                  <div v-if="form.num_nouvelle_fiche" class="flex items-center gap-2">
                    <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold qp-num" style="background:var(--qp-primary-50);color:var(--qp-primary-700);border:1px solid var(--qp-primary-200)">
                      <Icon name="heroicons:document-text" class="h-4 w-4" />
                      {{ form.num_nouvelle_fiche }}
                    </span>
                    <button
                      v-if="!lectureSeuleRQ"
                      type="button"
                      class="text-xs px-2 py-1 rounded border"
                      style="color:var(--qp-fg-3);border-color:var(--qp-border-1)"
                      :disabled="creatingNouvelleFac"
                      @click="form.num_nouvelle_fiche = ''"
                      title="Réinitialiser"
                    >
                      <Icon name="heroicons:x-mark" class="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <!-- Pas encore créée : bouton de création -->
                  <button
                    v-else-if="!lectureSeuleRQ"
                    type="button"
                    class="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-white w-full justify-center"
                    style="background:var(--qp-primary-500)"
                    :disabled="creatingNouvelleFac"
                    @click="creerNouvelleFac"
                  >
                    <Icon :name="creatingNouvelleFac ? 'heroicons:arrow-path' : 'heroicons:plus-circle'" class="h-4 w-4" :class="{ 'animate-spin': creatingNouvelleFac }" />
                    {{ creatingNouvelleFac ? 'Création…' : 'Créer la nouvelle fiche' }}
                  </button>
                  <!-- Lecture seule sans numéro -->
                  <span v-else class="text-sm" style="color:var(--qp-fg-3)">—</span>
                </div>
              </div>
              <div class="qp-field">
                <label class="qp-label">Commentaire(s) éventuel(s)</label>
                <textarea v-model="form.commentaires_rq" class="qp-textarea" rows="3" :disabled="lectureSeuleRQ" />
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
              style="background:#fff;border-color:var(--qp-success-300);color:var(--qp-success-700)"
              :disabled="dlLoading"
              @click="telechargerPdf"
            >
              <Icon :name="dlLoading ? 'heroicons:arrow-path' : 'heroicons:arrow-down-tray'" class="h-4 w-4" :class="{ 'animate-spin': dlLoading }" />
              {{ dlLoading ? 'Téléchargement…' : 'Télécharger PDF' }}
            </button>
          </div>
          <div class="flex gap-2">
            <button class="px-4 py-2 text-sm rounded-lg" style="color:var(--qp-fg-2)" @click="modalOpen = false">Fermer</button>
            <button
              v-if="peutSauvegarder"
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
const { fetchFac, updateFac, fetchResponsablesPossibles, ouvrirNouvelleFac, downloadFacPdf, FAC_STATUTS, labelFacStatut } = useFac()
const { formatDate } = useIndicateurs()
const { isSmqRQ, isSmqRQA, isSmqAdmin } = useAuth()

// Seuls RQ et RQA peuvent modifier la Partie RQ
// Le pilote peut remplir la Partie Pilote uniquement si pilote_soumis = false
const isRQouRQA       = computed(() => isSmqRQ() || isSmqRQA())
const facCloturee     = computed(() => facCourante.value?.fiche_cloturee === true || facCourante.value?.statut === 'clos')
const piloteSoumis    = computed(() => facCourante.value?.pilote_soumis === true)
const peutCloturerFac = computed(() => isRQouRQA.value)
const peutRemplirRQ   = computed(() => isRQouRQA.value && !facCloturee.value)
// Partie Pilote : éditable si pilote_soumis=false ET pas RQ/RQA ET pas clôturée
const lectureSeulePilote = computed(() => facCloturee.value || isRQouRQA.value || piloteSoumis.value)
// Partie RQ : éditable seulement si RQ/RQA et FAC non clôturée
const lectureSeuleRQ  = computed(() => facCloturee.value || !isRQouRQA.value)
// Pour le banner et le bouton Sauvegarder
const peutModifierFac = computed(() => isRQouRQA.value || !piloteSoumis.value)
const peutSauvegarder = computed(() => !lectureSeulePilote.value || !lectureSeuleRQ.value)
// Alias pour le dropdown statut (réservé RQ/RQA)
const lectureSeule    = lectureSeuleRQ

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
const pageFac      = ref(1)
const perPageFac   = ref(20)
const facList      = ref([])
const modalOpen    = ref(false)
const facCourante  = ref(null)
const kpis         = ref({ ouvertes: 0, en_cours: 0, clos: 0, total: 0 })

const kpisList = computed(() => [
  { label: 'FAC ouvertes', value: kpis.value.ouvertes, icon: 'heroicons:document-plus',      color: 'var(--qp-danger-600)',  bg: 'var(--qp-danger-50)'  },
  { label: 'En cours',     value: kpis.value.en_cours, icon: 'heroicons:arrow-path',          color: 'var(--qp-warning-700)', bg: 'var(--qp-warning-50)' },
  { label: 'Clôturées',   value: kpis.value.clos,     icon: 'heroicons:check-circle',        color: 'var(--qp-success-600)', bg: 'var(--qp-success-50)' },
  { label: 'Total',        value: kpis.value.total,    icon: 'heroicons:clipboard-document',  color: 'var(--qp-primary-600)', bg: 'var(--qp-primary-50)' },
])

const form = reactive({
  statut: 'ouvert', date_etablissement: '', etabli_par: '',
  description_nc: '', action_maitrise: '', causes: '', actions_proposees: '',
  date_previsionnelle: '', date_examen_effets: '',
  date_verification: '', conclusion_efficacite: '',
  fiche_cloturee: null, date_cloture: '',
  ouvrir_nouvelle_fiche: null, num_nouvelle_fiche: '', commentaires_rq: '',
})

// ── Critères d'efficacité (tableau → envoyé comme array à l'API) ──────────────
const criteresEfficacite = ref([])   // tableau de chaînes
const nouveauCritere     = ref('')

const ajouterCritere = () => {
  const val = nouveauCritere.value.trim()
  if (!val) return
  criteresEfficacite.value.push(val)
  nouveauCritere.value = ''
}

// ── Responsables (IDs → envoyés comme array à l'API) ─────────────────────────
const responsablesList    = ref([])   // { id, nom_complet }[]
const responsablesChoisis = ref([])   // ids sélectionnés

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
      (f.responsables ?? []).some(u => [u.prenom, u.nom].join(' ').toLowerCase().includes(q)) ||
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

// Remettre à la page 1 quand les filtres changent
watch([filtreStatut, recherche, sortCol, sortDir], () => { pageFac.value = 1 })

const facListPagines = computed(() => {
  const start = (pageFac.value - 1) * perPageFac.value
  return facListSorted.value.slice(start, start + perPageFac.value)
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
    date_previsionnelle:  toDate(fac.date_previsionnelle),
    date_examen_effets:   toDate(fac.date_examen_effets),
    date_verification:    toDate(fac.date_verification),
    conclusion_efficacite: fac.conclusion_efficacite ?? '',
    fiche_cloturee:        fac.fiche_cloturee      ?? null,
    date_cloture:          toDate(fac.date_cloture),
    ouvrir_nouvelle_fiche: fac.ouvrir_nouvelle_fiche ?? null,
    num_nouvelle_fiche:    fac.num_nouvelle_fiche   ?? '',
    commentaires_rq:       fac.commentaires_rq      ?? '',
  })
  // Initialiser critères depuis la relation (tableau d'objets {libelle})
  criteresEfficacite.value = (fac.criteres ?? []).map(c => c.libelle)
  nouveauCritere.value = ''
  // Initialiser responsables depuis la relation (tableau d'objets {id, nom, prenom})
  responsablesList.value = []
  responsablesChoisis.value = (fac.responsables ?? []).map(u => u.id)
  fetchResponsablesPossibles(fac.id).then(list => {
    responsablesList.value = list
  }).catch(() => {})

  modalOpen.value = true
}

const dlLoading             = ref(false)
const creatingNouvelleFac   = ref(false)

const telechargerPdf = async () => {
  if (!facCourante.value || dlLoading.value) return
  dlLoading.value = true
  try {
    const blob   = await downloadFacPdf(facCourante.value.id)
    const numero = facCourante.value?.numero_fiche ?? `FAC-${String(facCourante.value?.id).padStart(4, '0')}`
    const url    = window.URL.createObjectURL(blob)
    const link   = document.createElement('a')
    link.href    = url
    link.setAttribute('download', `${numero}.pdf`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (e) {
    console.error('Téléchargement PDF :', e)
    alert('Erreur lors du téléchargement : ' + (e?.data?.message ?? e?.message ?? 'Erreur inconnue'))
  } finally {
    dlLoading.value = false
  }
}

const creerNouvelleFac = async () => {
  if (!facCourante.value || creatingNouvelleFac.value) return
  creatingNouvelleFac.value = true
  try {
    const res = await ouvrirNouvelleFac(facCourante.value.id)
    if (res?.numero_fiche) {
      form.num_nouvelle_fiche = res.numero_fiche
    }
  } catch (e) {
    console.error('Création nouvelle FAC :', e)
    alert('Erreur lors de la création de la nouvelle fiche : ' + (e?.data?.message ?? e?.message ?? 'Erreur inconnue'))
  } finally {
    creatingNouvelleFac.value = false
  }
}

const sauvegarder = async () => {
  if (!facCourante.value) return
  saving.value = true
  try {
    await updateFac(facCourante.value.id, {
      ...form,
      criteres:        criteresEfficacite.value,
      responsable_ids: responsablesChoisis.value,
    })
    await charger()
    const updated = facList.value.find(f => f.id === facCourante.value.id)
    if (updated) ouvrirDetail(updated)
  } catch (e) {
    console.error('Sauvegarde FAC :', e)
    alert(e?.data?.message ?? 'Erreur lors de la sauvegarde')
  } finally {
    saving.value = false
  }
}

onMounted(() => charger())
</script>
