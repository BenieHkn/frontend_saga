<template>
  <div>
    <div v-if="loading" class="flex items-center justify-center" style="height:100vh">
      <p style="font-family:Arial,sans-serif;color:#666">Chargement de la fiche…</p>
    </div>

    <div v-else class="fac-print">
      <!-- EN-TÊTE -->
      <div class="fac-header">
        <div class="fac-logo">
          <img :src="logoDgml" alt="DGML" style="max-height:70px;max-width:130px;object-fit:contain" />
        </div>
        <div class="fac-title">
          <h1>FICHE D'ACTIONS CORRECTIVES</h1>
        </div>
      </div>

      <!-- MÉTA -->
      <table class="fac-meta">
        <tr>
          <td style="width:65%">
            <strong>Fiche établie le</strong> {{ formatDate(fac.date_etablissement) }}
            &nbsp;&nbsp;<strong>Par</strong> {{ fac.etabli_par ?? '____________________' }}
          </td>
          <td style="text-align:right">
            <strong>Fiche N° :</strong> {{ fac.numero_fiche ?? `FAC-${padId(fac.id)}` }}<br>
            <em style="font-size:8pt;color:#666">(Réservée au RQ)</em><br>
            <span v-if="fac.saisieIndicateur?.indicateur" style="font-size:8pt">
              Indicateur : <strong>{{ fac.saisieIndicateur.indicateur.code }}</strong>
              — {{ fac.saisieIndicateur.indicateur.libelle }}
            </span>
          </td>
        </tr>
      </table>

      <!-- PARTIE PILOTE -->
      <div class="fac-section">
        <div class="fac-field">
          <div class="fac-field-label">Description de la non-conformité ou du dysfonctionnement :</div>
          <div class="fac-field-value" style="min-height:50px">{{ fac.description_nc }}</div>
        </div>
        <div class="fac-field">
          <div class="fac-field-label">Action effectuée pour maîtriser et corriger la non-conformité ou le dysfonctionnement :</div>
          <div class="fac-field-value" style="min-height:40px">{{ fac.action_maitrise }}</div>
        </div>
        <div class="fac-field">
          <div class="fac-field-label">Cause(s) du dysfonctionnement ou de la non-conformité :</div>
          <div class="fac-field-value" style="min-height:40px">{{ fac.causes }}</div>
        </div>
        <div class="fac-field">
          <div class="fac-field-label">Action(s) corrective(s) proposée(s) pour supprimer ou limiter les causes de la non-conformité et éviter qu'elle ne réapparaisse :</div>
          <div class="fac-field-value" style="min-height:55px">{{ fac.actions_proposees }}</div>
        </div>
        <div class="fac-field fac-grid">
          <div>
            <div class="fac-field-label">Responsable de l'action :</div>
            <div class="fac-field-value"><strong>{{ fac.responsable_action }}</strong></div>
          </div>
          <div>
            <div class="fac-field-label">Date prévisionnelle de mise en œuvre :</div>
            <div class="fac-field-value"><strong>{{ formatDate(fac.date_previsionnelle) }}</strong></div>
          </div>
        </div>
        <div class="fac-field">
          <div class="fac-field-label">Critère d'efficacité de l'action, ou des actions proposée(s) :</div>
          <div class="fac-field-value">{{ fac.critere_efficacite }}</div>
        </div>
        <div class="fac-field" style="border-bottom:none">
          <div class="fac-field-label">Date prévue pour l'examen des effets de l'action, ou des actions proposée(s) :</div>
          <div class="fac-field-value"><strong>{{ formatDate(fac.date_examen_effets) }}</strong></div>
        </div>
      </div>

      <!-- PARTIE RQ -->
      <div class="fac-section fac-section-rq" style="margin-top:12px">
        <div class="fac-rq-header">
          RÉSERVÉE AU RESPONSABLE QUALITÉ (A remplir si les actions correctives sont mises en œuvre)
        </div>
        <div class="fac-field">
          <div class="fac-field-label">Suivi-efficacité des actions (Examen de l'efficacité de l'action corrective mise en œuvre)</div>
        </div>
        <div class="fac-field fac-grid">
          <div>
            <div class="fac-field-label">Date de vérification de l'efficacité :</div>
            <div class="fac-field-value"><strong>{{ formatDate(fac.date_verification) }}</strong></div>
          </div>
          <div>
            <div class="fac-field-label">Conclusion :</div>
            <div class="fac-field-value">
              <span class="check-box" :class="{ checked: fac.conclusion_efficacite === 'efficace' }">✓</span> Action efficace
              &nbsp;&nbsp;
              <span class="check-box" :class="{ checked: fac.conclusion_efficacite === 'inefficace' }">✓</span> Action inefficace
            </div>
          </div>
        </div>
        <div class="fac-field">
          <div class="fac-field-label">Décision du Responsable qualité :</div>
          <div class="fac-field-value">
            Fiche clôturée ?
            <span class="check-box" :class="{ checked: fac.fiche_cloturee === true }">✓</span> Oui
            &nbsp;
            <span class="check-box" :class="{ checked: fac.fiche_cloturee === false }">✓</span> Non
            <span v-if="fac.fiche_cloturee"> Si oui, le <strong>{{ formatDate(fac.date_cloture) }}</strong></span>
            <br>
            Si non, ouvrir une nouvelle fiche ?
            <span class="check-box" :class="{ checked: fac.ouvrir_nouvelle_fiche === true }">✓</span> Oui
            &nbsp;
            <span class="check-box" :class="{ checked: fac.ouvrir_nouvelle_fiche === false }">✓</span> Non
            <span v-if="fac.num_nouvelle_fiche"> Si oui, voir fiche N° <strong>{{ fac.num_nouvelle_fiche }}</strong></span>
          </div>
        </div>
        <div class="fac-field">
          <div class="fac-field-label">Commentaire(s) éventuel(s) :</div>
          <div class="fac-field-value" style="min-height:30px">{{ fac.commentaires_rq }}</div>
        </div>
        <div class="fac-field" style="border-bottom:none">
          <div class="fac-field-label">Nom et Signature :</div>
          <div class="fac-field-value" style="min-height:40px"></div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useFac }         from '~/composables/smq/useFac'
import { useIndicateurs } from '~/composables/smq/useIndicateurs'
import logoDgml           from '~/assets/images/logo_dgml.png'

definePageMeta({ layout: false })

const route = useRoute()
const id    = computed(() => route.params.id)

const { fetchFacItem } = useFac()
const { formatDate }   = useIndicateurs()

const loading = ref(true)
const fac     = ref({})

const padId = (n) => String(n).padStart(4, '0')

onMounted(async () => {
  try {
    fac.value = await fetchFacItem(id.value)
  } finally {
    loading.value = false
    await nextTick()
    window.print()
  }
})
</script>

<style>
/* Reset complet pour l'impression */
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: Arial, Helvetica, sans-serif; font-size: 9.5pt; color: #000; background: #fff; }
@media print {
  @page { margin: 1.2cm; size: A4 portrait; }
  body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
}

.fac-print { max-width: 21cm; margin: 0 auto; padding: 1cm; }
@media print { .fac-print { padding: 0; } }

/* En-tête */
.fac-header { display: flex; align-items: center; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 10px; }
.fac-logo   { flex: 0 0 30%; }
.fac-title  { flex: 1; text-align: center; }
.fac-title h1 { font-size: 14pt; letter-spacing: 1px; }

/* Méta */
.fac-meta { width: 100%; border-collapse: collapse; border: 1px solid #000; margin-bottom: 10px; }
.fac-meta td { padding: 5px 8px; font-size: 9pt; }
.fac-meta td:first-child { border-right: 1px solid #000; }

/* Sections */
.fac-section { border: 1px solid #000; }
.fac-section-rq .fac-rq-header { background: #d0d0d0; font-weight: bold; font-size: 8.5pt; padding: 4px 8px; border-bottom: 1px solid #000; }
.fac-field { border-bottom: 1px solid #999; }
.fac-field:last-child { border-bottom: none; }
.fac-field-label { font-weight: bold; font-size: 8.5pt; padding: 4px 8px 2px; color: #333; }
.fac-field-value { font-size: 9pt; padding: 2px 8px 8px; min-height: 18px; white-space: pre-wrap; }
.fac-grid { display: grid; grid-template-columns: 1fr 1fr; }
.fac-grid > div:first-child { border-right: 1px solid #ccc; }

/* Cases à cocher */
.check-box { display: inline-block; width: 10px; height: 10px; border: 1px solid #000; vertical-align: middle; font-size: 7pt; line-height: 10px; text-align: center; color: transparent; }
.check-box.checked { color: #000; }

</style>
