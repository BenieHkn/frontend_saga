<script setup>
import { formatDateFR, formatDateShort, extractTime, getStatutConfig, useCodir } from '@/composables/codirs/useCodir'

definePageMeta({ title: 'Aperçu CODIR' })

const router = useRouter()
const toast  = useToast()

// ── Données depuis localStorage ────────────────────────────────────────────────
const codir = ref(null)

onMounted(() => {
  const raw = localStorage.getItem('currentCodir')
  if (raw) codir.value = JSON.parse(raw)
})

// ── Clôture du CODIR ──────────────────────────────────────────────────────────
const showCloture   = ref(false)
const cloturePending = ref(false)

const { updateCodir } = useCodir()

const confirmerCloture = async () => {
  if (!codir.value) return
  cloturePending.value = true
  try {
    await updateCodir(codir.value.id, { statut: 'clos' })
    codir.value = { ...codir.value, statut: 'clos' }
    localStorage.setItem('currentCodir', JSON.stringify(codir.value))
    toast.add({ title: 'CODIR clôturé', description: 'Le CODIR a été clôturé avec succès.', color: 'green', icon: 'i-heroicons-check-circle' })
    showCloture.value = false
  } catch (e) {
    toast.add({ title: 'Erreur', description: 'Impossible de clôturer le CODIR.', color: 'red', icon: 'i-heroicons-x-circle' })
  } finally {
    cloturePending.value = false
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const getMembresLabel = (membres) =>
  membres?.map(m => `${m.entite_user?.user?.prenom ?? ''} ${m.entite_user?.user?.nom ?? ''} (${m.role})`).join(', ') ?? '—'

const statutTacheLabel = (s) => ({
  en_attente: 'En attente',
  en_cours: 'En cours',
  terminée: 'Terminée',
  terminee: 'Terminée',
  realise: 'Réalisé',
  suspendu: 'Suspendu',
}[s] ?? s ?? '')

// ── Helpers partagés PDF + Word ────────────────────────────────────────────────
const formatTimeHM = (iso) => {
  if (!iso) return ''
  const [h, m] = iso.substring(11, 16).split(':')
  return `${h} H ${m} MN`
}

const collectAllMembres = (obj) => {
  if (!obj || typeof obj !== 'object') return []
  const result = []
  if (Array.isArray(obj.membres)) result.push(...obj.membres)
  for (const val of Object.values(obj)) {
    if (Array.isArray(val)) for (const item of val) result.push(...collectAllMembres(item))
  }
  return result
}

const getSecretaireName = (c) => {
  const all = [...(c.membres ?? []), ...collectAllMembres(c)]
  const s = all.find(m => ['secrétaire', 'secretaire', 'sp'].includes(m.role?.toLowerCase()))
  const u = s?.entite_user?.user
  return u ? `${u.nom} ${u.prenom}` : 'Prénom NOM'
}

const getMembresLines = (membres) =>
  (membres ?? []).map(m => { const u = m.entite_user?.user; return u ? `- ${u.nom} ${u.prenom}` : null }).filter(Boolean)

const statLabel = (s) => ({
  en_attente: 'En attente', en_cours: 'En cours',
  terminee: 'Terminée', terminée: 'Terminée',
  realise: 'Réalisé', suspendu: 'Suspendu',
}[s] ?? s ?? '')

/**
 * Aplatit la hiérarchie ODJ → Dossiers → Actions → Activités → Tâches
 * en lignes avec spans précalculés, identique à la logique du Word.
 */
const buildTableSections = (c) => {
  const addSpans = (lignes) => {
    if (!lignes.length) return []
    const spans = lignes.map(() => ({ odj: 0, dossier: 0, action: 0, activite: 0 }))
    spans[0].odj = lignes.length
    // dossier spans
    let s = 0
    for (let i = 1; i <= lignes.length; i++) {
      if (i === lignes.length || lignes[i].dossierLabel !== lignes[i-1].dossierLabel) { spans[s].dossier = i - s; s = i }
    }
    // action spans
    s = 0
    for (let i = 1; i <= lignes.length; i++) {
      const k = l => `${l.dossierLabel}||${l.actionLabel}`
      if (i === lignes.length || k(lignes[i]) !== k(lignes[i-1])) { spans[s].action = i - s; s = i }
    }
    // activite spans
    s = 0
    for (let i = 1; i <= lignes.length; i++) {
      const k = l => `${l.dossierLabel}||${l.actionLabel}||${l.activiteLabel}`
      if (i === lignes.length || k(lignes[i]) !== k(lignes[i-1])) { spans[s].activite = i - s; s = i }
    }
    return lignes.map((l, i) => ({ ...l, spans: spans[i] }))
  }

  const sections = []
  const tachesCodir = c.taches ?? []

  // Section ODJ 1 implicite (tâches reprises)
  if (tachesCodir.length > 0) {
    const odjLabel = "1-Adoption du compte rendu de la dernière séance du CODIR et point d'exécution des tâches prescrites"
    const lignes = tachesCodir.map(tache => ({
      dossierLabel: '', actionLabel: '', activiteLabel: '',
      tacheLabel: tache.intitule ?? '',
      membres: getMembresLines(tache.membres),
      echeance: formatDateShort(tache.date_fin),
      obs: [statLabel(tache.pivot?.statut), tache.pivot?.progression != null ? `${tache.pivot.progression}%` : ''].filter(Boolean).join(' – '),
    }))
    sections.push({ odjLabel, lignes: addSpans(lignes), isTacheSection: true })
  }

  // ODJ réels
  ;(c.ordres_du_jour ?? []).forEach((odj, odjIdx) => {
    const odjNum = odjIdx + (tachesCodir.length > 0 ? 2 : 1)
    const odjLabel = `${odjNum}-${odj.libelle}`
    const lignes = []
    const dossiers = odj.dossiers ?? []

    if (!dossiers.length) {
      lignes.push({ dossierLabel: 'Néant', actionLabel: '', activiteLabel: '', tacheLabel: '', membres: [], echeance: '', obs: '' })
    } else {
      dossiers.forEach(dossier => {
        let hasContent = false
        ;(dossier.actions ?? []).forEach(action => {
          const activites = action.activites ?? []
          if (!activites.length) {
            lignes.push({ dossierLabel: dossier.libelle, actionLabel: action.libelle, activiteLabel: '', tacheLabel: '', membres: [], echeance: '', obs: '' })
            hasContent = true
          } else {
            activites.forEach(activite => {
              const taches = activite.taches ?? []
              if (!taches.length) {
                lignes.push({ dossierLabel: dossier.libelle, actionLabel: action.libelle, activiteLabel: activite.libelle, tacheLabel: '', membres: [], echeance: '', obs: '' })
                hasContent = true
              } else {
                taches.forEach(tache => {
                  lignes.push({ dossierLabel: dossier.libelle, actionLabel: action.libelle, activiteLabel: activite.libelle, tacheLabel: tache.intitule ?? '', membres: getMembresLines(tache.membres), echeance: formatDateShort(tache.date_fin), obs: '' })
                  hasContent = true
                })
              }
            })
          }
        })
        ;(dossier.activites ?? []).forEach(activite => {
          const taches = activite.taches ?? []
          if (!taches.length) {
            lignes.push({ dossierLabel: dossier.libelle, actionLabel: '', activiteLabel: activite.libelle, tacheLabel: '', membres: [], echeance: '', obs: '' })
            hasContent = true
          } else {
            taches.forEach(tache => {
              lignes.push({ dossierLabel: dossier.libelle, actionLabel: '', activiteLabel: activite.libelle, tacheLabel: tache.intitule ?? '', membres: getMembresLines(tache.membres), echeance: formatDateShort(tache.date_fin), obs: '' })
              hasContent = true
            })
          }
        })
        if (!hasContent) lignes.push({ dossierLabel: dossier.libelle, actionLabel: '', activiteLabel: '', tacheLabel: '', membres: [], echeance: '', obs: '' })
      })
    }
    sections.push({ odjLabel, lignes: addSpans(lignes), isTacheSection: false })
  })

  return sections
}

// ── Export PDF : fenêtre dédiée reproduisant exactement le Word ────────────────
const printPDF = () => {
  if (!codir.value) return
  const c = codir.value
  const sections = buildTableSections(c)
  const secretaireName = getSecretaireName(c)

  // ── ODJ list pour page 1 ───────────────────────────────────────────────────
  const odjItems = []
  if (c.taches?.length) odjItems.push("Adoption du compte rendu de la dernière séance du CODIR et point d'exécution des tâches prescrites")
  ;(c.ordres_du_jour ?? []).forEach(odj => odjItems.push(odj.libelle))
  const odjListHTML = odjItems.map(item => `<li>${item}</li>`).join('')

  // ── Tableau principal ──────────────────────────────────────────────────────
  let tbodyHTML = ''
  for (const section of sections) {
    section.lignes.forEach((ligne, idx) => {
      const sp = ligne.spans
      tbodyHTML += '<tr>'

      // Col ODJ — rowspan sur toute la section
      if (idx === 0) {
        tbodyHTML += `<td class="cell-odj" rowspan="${sp.odj}"><strong>${section.odjLabel}</strong></td>`
      }

      // Cols avec rowspan (seulement si span > 0, sinon la cellule est absorbée)
      if (section.isTacheSection) {
        // Tâches reprises : Dossier/Action/Activité toujours vides, une cellule par ligne
        tbodyHTML += `<td></td><td></td><td></td>`
      } else {
        if (sp.dossier > 0) tbodyHTML += `<td rowspan="${sp.dossier}">${ligne.dossierLabel}</td>`
        if (sp.action  > 0) tbodyHTML += `<td rowspan="${sp.action}">${ligne.actionLabel}</td>`
        if (sp.activite > 0) tbodyHTML += `<td rowspan="${sp.activite}">${ligne.activiteLabel}</td>`
      }

      // Col Tâche
      tbodyHTML += `<td>${ligne.tacheLabel}</td>`

      // Col Responsables
      const membresHTML = ligne.membres.map(m => `<div>${m}</div>`).join('')
      tbodyHTML += `<td>${membresHTML}</td>`

      // Col Échéance
      tbodyHTML += `<td class="cell-center">${ligne.echeance}</td>`

      // Col Observations
      tbodyHTML += `<td>${ligne.obs}</td>`

      tbodyHTML += '</tr>'
    })
  }

  // ── Construction du HTML complet ───────────────────────────────────────────
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>CODIR ${formatDateShort(c.date)}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body { font-family: Arial, sans-serif; font-size: 9pt; color: #000; background: white; }

  /* ── Aperçu écran ─────────────────────────────────────────────────── */
  @media screen {
    body { background: #ccc; }
    .page { margin: 20px auto; box-shadow: 0 2px 16px rgba(0,0,0,.2); background: white; }
    .page-portrait  { width: 210mm; min-height: 297mm; padding: 18mm; }
    .page-landscape { width: 297mm; min-height: 210mm; padding: 12mm 12mm 18mm 12mm; }
  }

  /* ── Impression ───────────────────────────────────────────────────── */
  @media print {
    @page p1 { size: A4 portrait;  margin: 18mm 18mm 15mm 18mm; }
    @page p2 { size: A4 landscape; margin: 12mm 12mm 15mm 12mm; }

    body { background: white; }
    .page { padding: 0; box-shadow: none; margin: 0; }
    .page-portrait  { page: p1; }
    .page-landscape { page: p2; page-break-before: always; }
  }

  /* ── Page 1 : portrait ────────────────────────────────────────────── */
  .main-title {
    text-align: center;
    font-size: 13pt;
    font-weight: bold;
    text-decoration: underline;
    margin: 12mm 0 14mm 0;
  }

  .meta-block p { font-size: 10pt; margin-bottom: 5mm; }
  .meta-block strong { font-weight: bold; }

  .absents-table {
    margin: 10mm 0 0 auto;
    width: 75mm;
    border-collapse: collapse;
    font-size: 8.5pt;
  }
  .absents-table th, .absents-table td {
    border: 0.5pt solid #999;
    padding: 1.5mm 3mm;
  }
  .absents-table thead th { background: #D9D9D9; font-weight: bold; }
  .excuses-row td { background: #D9D9D9; font-weight: bold; }

  .odj-section { margin-top: 14mm; }
  .odj-title {
    font-size: 10pt;
    font-weight: bold;
    text-decoration: underline;
    margin-bottom: 5mm;
  }
  .odj-list { padding-left: 7mm; font-size: 9pt; }
  .odj-list li { margin-bottom: 3mm; line-height: 1.4; }

  /* ── Page 2 : paysage — grand tableau ────────────────────────────── */
  .main-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 7.5pt;
    table-layout: fixed;
  }

  /* Largeurs des 8 colonnes calées sur les proportions du Word
     C = [2000, 1600, 1600, 1800, 2200, 2000, 1200, 3438] / 15838 total */
  .main-table col:nth-child(1) { width: 12.6%; }
  .main-table col:nth-child(2) { width: 10.1%; }
  .main-table col:nth-child(3) { width: 10.1%; }
  .main-table col:nth-child(4) { width: 11.4%; }
  .main-table col:nth-child(5) { width: 13.9%; }
  .main-table col:nth-child(6) { width: 12.6%; }
  .main-table col:nth-child(7) { width:  7.6%; }
  .main-table col:nth-child(8) { width: 21.7%; }

  .main-table th, .main-table td {
    border: 0.5pt solid #999;
    padding: 1.5mm 2mm;
    vertical-align: top;
    word-wrap: break-word;
    overflow-wrap: break-word;
    line-height: 1.35;
  }

  .main-table thead th {
    background: #D9D9D9;
    font-weight: bold;
    text-align: center;
    vertical-align: middle;
  }

  .cell-odj { font-weight: bold; }
  .cell-center { text-align: center; }

  /* ── Signature ────────────────────────────────────────────────────── */
  .signature { margin-top: 12mm; text-align: right; font-size: 9pt; }
  .sig-label { font-style: italic; margin-bottom: 8mm; }
  .sig-name  { font-weight: bold; }

  /* ── Footer (écran seulement) ─────────────────────────────────────── */
  .footer {
    display: flex;
    justify-content: space-between;
    font-size: 7pt;
    color: #444;
    border-top: 0.5pt solid #bbb;
    padding-top: 2mm;
    margin-top: 8mm;
  }
  @media print { .footer { display: none; } }
</style>
</head>
<body>

<!-- ══ PAGE 1 : Portrait ══════════════════════════════════════════════════ -->
<div class="page page-portrait">

  <h1 class="main-title">REUNION DU COMITE DE DIRECTION</h1>

  <div class="meta-block">
    <p><strong>Date</strong> : ${formatDateShort(c.date)}</p>
    <p><strong>Lieu</strong> : bureau DI</p>
    <p><strong>Début</strong> : ${formatTimeHM(c.heure_debut)}</p>
    <p><strong>Fin</strong> : ${formatTimeHM(c.heure_fin)}</p>
    <p><strong>Présence</strong> : Voir la liste de présence</p>
  </div>

  <table class="absents-table">
    <thead>
      <tr><th>Absents</th><th>Motifs</th></tr>
    </thead>
    <tbody>
      <tr class="excuses-row"><td colspan="2">Excusés</td></tr>
      <tr><td>Néant</td><td></td></tr>
    </tbody>
  </table>

  <div class="odj-section">
    <p class="odj-title">ORDRE DU JOUR</p>
    <ol class="odj-list">
      ${odjListHTML}
    </ol>
  </div>

  <div class="footer">
    <span>Indice B</span><span>OCt 2025</span><span>Page 1</span>
  </div>
</div>

<!-- ══ PAGE 2 : Paysage ═══════════════════════════════════════════════════ -->
<div class="page page-landscape">

  <table class="main-table">
    <colgroup>
      <col><col><col><col><col><col><col><col>
    </colgroup>
    <thead>
      <tr>
        <th>POINT DE L'ORDRE DU JOUR</th>
        <th>Dossiers</th>
        <th>Actions</th>
        <th>Activités</th>
        <th>Tâches</th>
        <th>Responsables</th>
        <th>Echéance</th>
        <th>Observations</th>
      </tr>
    </thead>
    <tbody>
      ${tbodyHTML}
    </tbody>
  </table>

  <div class="signature">
    <p class="sig-label">La secrétaire de séance</p>
    <p class="sig-name">${secretaireName}</p>
  </div>

  <div class="footer">
    <span>Indice B</span><span>OCt 2025</span><span>Page 2</span>
  </div>
</div>

</body>
</html>`

  // Ouvrir dans une fenêtre dédiée et déclencher l'impression
  const win = window.open('', '_blank', 'width=900,height=700')
  win.document.write(html)
  win.document.close()
  // Attendre le rendu complet avant print()
  win.addEventListener('load', () => { win.focus(); win.print() })
}

// ── Export Word ────────────────────────────────────────────────────────────────
const exportWord = async () => {
  if (!codir.value) return

  const {
    Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
    Footer, AlignmentType, WidthType, BorderStyle, ShadingType,
    SimpleField, TabStopType, LevelFormat, VerticalAlign, PageOrientation,
  } = await import('docx')

  const c = codir.value

  const FONT = 'Arial'
  const HEADER_FILL = 'D9D9D9'
  const bdr = { style: BorderStyle.SINGLE, size: 4, color: '999999' }
  const borders = { top: bdr, bottom: bdr, left: bdr, right: bdr }
  const PAGE1_W = 10466
  const TABLE_W = 15838
  // Colonnes : ODJ | Dossiers | Actions | Activités | Tâches | Responsables | Échéance | Observations
  const C = [2000, 1600, 1600, 1800, 2200, 2000, 1200, 3438]

  const linesToParagraphs = (lines, opts = {}) =>
    (Array.isArray(lines) ? lines : [lines]).map(line =>
      new Paragraph({
        alignment: opts.center ? AlignmentType.CENTER : AlignmentType.LEFT,
        spacing: { after: 0, before: 0 },
        children: [new TextRun({ text: String(line ?? ''), size: opts.size ?? 17, font: FONT, bold: opts.bold ?? false })]
      })
    )

  const makeCell = (lines, width, opts = {}) => new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders,
    verticalAlign: opts.vAlign ?? VerticalAlign.TOP,
    shading: opts.fill ? { type: ShadingType.CLEAR, fill: opts.fill } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    rowSpan: opts.rowSpan,
    columnSpan: opts.colSpan,
    children: linesToParagraphs(Array.isArray(lines) ? lines : [lines], opts),
  })

  const headerCell = (text, width) => new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders,
    shading: { type: ShadingType.CLEAR, fill: HEADER_FILL },
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 0 },
      children: [new TextRun({ text, bold: true, size: 18, font: FONT })]
    })]
  })

  const emptyCell = (width) => makeCell([''], width)

  const makeFooter = () => new Footer({
    children: [new Paragraph({
      tabStops: [
        { type: TabStopType.CENTER, position: 5000 },
        { type: TabStopType.RIGHT, position: TABLE_W },
      ],
      spacing: { after: 0 },
      children: [
        new TextRun({ text: 'Indice B', size: 16, font: FONT }),
        new TextRun({ text: '\tOCt 2025', size: 16, font: FONT }),
        new TextRun({ text: '\tPage ', size: 16, bold: true, font: FONT }),
        new SimpleField('PAGE'),
        new TextRun({ text: ' sur ', size: 16, bold: true, font: FONT }),
        new SimpleField('NUMPAGES'),
      ]
    })]
  })

  // Détection de la secrétaire parmi tous les membres du CODIR
  const collectAllMembres = (obj) => {
    if (!obj || typeof obj !== 'object') return []
    const result = []
    if (Array.isArray(obj.membres)) result.push(...obj.membres)
    for (const val of Object.values(obj)) {
      if (Array.isArray(val)) for (const item of val) result.push(...collectAllMembres(item))
    }
    return result
  }
  const allMembres = [...(c.membres ?? []), ...collectAllMembres(c)]
  const secretaireMembre = allMembres.find(m =>
    ['secrétaire', 'secretaire', 'sp'].includes(m.role?.toLowerCase())
  )
  const su = secretaireMembre?.entite_user?.user
  const secretaireName = su ? `${su.nom} ${su.prenom}` : 'Prénom NOM'

  const getMembresLines = (membres) =>
    (membres ?? []).map(m => { const u = m.entite_user?.user; return u ? `- ${u.nom} ${u.prenom}` : null }).filter(Boolean)

  const formatTimeHM = (iso) => {
    if (!iso) return ''
    const [h, m] = iso.substring(11, 16).split(':')
    return `${h} H ${m} MN`
  }

  const statLabel = (s) => ({ en_attente: 'En attente', en_cours: 'En cours', terminee: 'Terminée', terminée: 'Terminée', realise: 'Réalisé', suspendu: 'Suspendu' }[s] ?? s ?? '')

  // Génération des lignes du tableau
  const generateTableRows = () => {
    const rows = []

    rows.push(new TableRow({
      tableHeader: true,
      children: [
        headerCell("POINT DE\nL'ORDRE DU JOUR", C[0]),
        headerCell('Dossiers', C[1]),
        headerCell('Actions', C[2]),
        headerCell('Activités', C[3]),
        headerCell('Tâches', C[4]),
        headerCell('Responsables', C[5]),
        headerCell('Echéance', C[6]),
        headerCell('Observations', C[7]),
      ]
    }))

    // ODJ 1 implicite : suivi des tâches reprises
    const tachesCodir = c.taches ?? []
    if (tachesCodir.length > 0) {
      const odjLabel = "1-Adoption du compte rendu de la dernière séance du CODIR et point d'exécution des tâches prescrites"
      tachesCodir.forEach((tache, idx) => {
        const membres = getMembresLines(tache.membres)
        const obs = [statLabel(tache.pivot?.statut), tache.pivot?.progression != null ? `${tache.pivot.progression}%` : ''].filter(Boolean).join(' – ')
        const cells = []
        if (idx === 0) cells.push(makeCell([odjLabel], C[0], { rowSpan: tachesCodir.length, bold: true, size: 16, vAlign: VerticalAlign.TOP }))
        cells.push(emptyCell(C[1]), emptyCell(C[2]), emptyCell(C[3]))
        cells.push(makeCell([tache.intitule ?? ''], C[4], { size: 17 }))
        cells.push(makeCell(membres.length ? membres : [''], C[5], { size: 16 }))
        cells.push(makeCell([formatDateShort(tache.date_fin)], C[6], { center: true, size: 16 }))
        cells.push(makeCell([obs], C[7], { size: 16 }))
        rows.push(new TableRow({ children: cells }))
      })
    }

    // Ordres du jour
    ;(c.ordres_du_jour ?? []).forEach((odj, odjIdx) => {
      const odjNum = odjIdx + (tachesCodir.length > 0 ? 2 : 1)
      const odjLabel = `${odjNum}-${odj.libelle}`
      const lignes = []

      const dossiers = odj.dossiers ?? []
      if (dossiers.length === 0) {
        lignes.push({ dossierLabel: 'Néant', actionLabel: '', activiteLabel: '', tacheLabel: '', membres: [], echeance: '', obs: '' })
      } else {
        dossiers.forEach((dossier) => {
          let hasContent = false
          ;(dossier.actions ?? []).forEach((action) => {
            const activites = action.activites ?? []
            if (!activites.length) {
              lignes.push({ dossierLabel: dossier.libelle, actionLabel: action.libelle, activiteLabel: '', tacheLabel: '', membres: [], echeance: '', obs: '' })
              hasContent = true
            } else {
              activites.forEach((activite) => {
                const taches = activite.taches ?? []
                if (!taches.length) {
                  lignes.push({ dossierLabel: dossier.libelle, actionLabel: action.libelle, activiteLabel: activite.libelle, tacheLabel: '', membres: [], echeance: '', obs: '' })
                  hasContent = true
                } else {
                  taches.forEach((tache) => {
                    lignes.push({ dossierLabel: dossier.libelle, actionLabel: action.libelle, activiteLabel: activite.libelle, tacheLabel: tache.intitule ?? '', membres: getMembresLines(tache.membres), echeance: formatDateShort(tache.date_fin), obs: '' })
                    hasContent = true
                  })
                }
              })
            }
          })
          ;(dossier.activites ?? []).forEach((activite) => {
            const taches = activite.taches ?? []
            if (!taches.length) {
              lignes.push({ dossierLabel: dossier.libelle, actionLabel: '', activiteLabel: activite.libelle, tacheLabel: '', membres: [], echeance: '', obs: '' })
              hasContent = true
            } else {
              taches.forEach((tache) => {
                lignes.push({ dossierLabel: dossier.libelle, actionLabel: '', activiteLabel: activite.libelle, tacheLabel: tache.intitule ?? '', membres: getMembresLines(tache.membres), echeance: formatDateShort(tache.date_fin), obs: '' })
                hasContent = true
              })
            }
          })
          if (!hasContent) lignes.push({ dossierLabel: dossier.libelle, actionLabel: '', activiteLabel: '', tacheLabel: '', membres: [], echeance: '', obs: '' })
        })
      }

      const totalOdj = lignes.length
      const spans = lignes.map(() => ({ odj: 0, dossier: 0, action: 0, activite: 0 }))
      spans[0].odj = totalOdj

      let dStart = 0
      for (let i = 1; i <= lignes.length; i++) {
        if (i === lignes.length || lignes[i].dossierLabel !== lignes[i-1].dossierLabel) { spans[dStart].dossier = i - dStart; dStart = i }
      }
      let aStart = 0
      for (let i = 1; i <= lignes.length; i++) {
        const k = (l) => `${l.dossierLabel}||${l.actionLabel}`
        if (i === lignes.length || k(lignes[i]) !== k(lignes[i-1])) { spans[aStart].action = i - aStart; aStart = i }
      }
      let avStart = 0
      for (let i = 1; i <= lignes.length; i++) {
        const k = (l) => `${l.dossierLabel}||${l.actionLabel}||${l.activiteLabel}`
        if (i === lignes.length || k(lignes[i]) !== k(lignes[i-1])) { spans[avStart].activite = i - avStart; avStart = i }
      }

      lignes.forEach((ligne, idx) => {
        const sp = spans[idx]
        const cells = []
        if (idx === 0) cells.push(makeCell([odjLabel], C[0], { rowSpan: totalOdj, bold: true, size: 16, vAlign: VerticalAlign.TOP }))
        if (sp.dossier > 0) cells.push(makeCell([ligne.dossierLabel], C[1], { rowSpan: sp.dossier, size: 17, vAlign: VerticalAlign.TOP }))
        if (sp.action > 0) cells.push(makeCell([ligne.actionLabel], C[2], { rowSpan: sp.action, size: 17, vAlign: VerticalAlign.TOP }))
        if (sp.activite > 0) cells.push(makeCell([ligne.activiteLabel], C[3], { rowSpan: sp.activite, size: 17, vAlign: VerticalAlign.TOP }))
        cells.push(makeCell([ligne.tacheLabel], C[4], { size: 17 }))
        cells.push(makeCell(ligne.membres.length ? ligne.membres : [''], C[5], { size: 16 }))
        cells.push(makeCell([ligne.echeance], C[6], { center: true, size: 16 }))
        cells.push(makeCell([ligne.obs], C[7], { size: 16 }))
        rows.push(new TableRow({ children: cells }))
      })
    })

    return rows
  }

  // Tableau Absents/Excusés
  const absentsW = 3200
  const absentsTable = new Table({
    width: { size: absentsW, type: WidthType.DXA },
    columnWidths: [absentsW / 2, absentsW / 2],
    indent: { size: PAGE1_W - absentsW, type: WidthType.DXA },
    rows: [
      new TableRow({ children: [
        new TableCell({ width: { size: absentsW/2, type: WidthType.DXA }, borders, shading: { type: ShadingType.CLEAR, fill: HEADER_FILL }, margins: { top: 60, bottom: 60, left: 100, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: 'Absents', bold: true, size: 18, font: FONT })] })] }),
        new TableCell({ width: { size: absentsW/2, type: WidthType.DXA }, borders, shading: { type: ShadingType.CLEAR, fill: HEADER_FILL }, margins: { top: 60, bottom: 60, left: 100, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: 'Motifs', bold: true, size: 18, font: FONT })] })] }),
      ]}),
      new TableRow({ children: [
        new TableCell({ width: { size: absentsW, type: WidthType.DXA }, borders, columnSpan: 2, shading: { type: ShadingType.CLEAR, fill: HEADER_FILL }, margins: { top: 60, bottom: 60, left: 100, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: 'Excusés', bold: true, size: 18, font: FONT })] })] }),
      ]}),
      new TableRow({ children: [
        new TableCell({ width: { size: absentsW/2, type: WidthType.DXA }, borders, margins: { top: 60, bottom: 60, left: 100, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: 'Néant', size: 18, font: FONT })] })] }),
        new TableCell({ width: { size: absentsW/2, type: WidthType.DXA }, borders, margins: { top: 60, bottom: 60, left: 100, right: 100 }, children: [new Paragraph({ children: [] })] }),
      ]}),
    ]
  })

  const infoPara = (label, value) => new Paragraph({
    spacing: { after: 180 },
    children: [new TextRun({ text: label, bold: true, size: 22, font: FONT }), new TextRun({ text: ' : ' + value, size: 22, font: FONT })]
  })

  const doc = new Document({
    styles: { default: { document: { run: { font: FONT, size: 22 } } } },
    numbering: { config: [{ reference: 'odj-list', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 }, spacing: { after: 100 } }, run: { size: 20, font: FONT } } }] }] },
    sections: [
      {
        properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 720, right: 720, bottom: 720, left: 720 } } },
        footers: { default: makeFooter() },
        children: [
          new Paragraph({ spacing: { after: 800 }, children: [] }),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 500 }, children: [new TextRun({ text: 'REUNION DU COMITE DE DIRECTION', bold: true, size: 26, font: FONT, underline: { type: 'single' } })] }),
          infoPara('Date', formatDateShort(c.date)),
          infoPara('Lieu', 'bureau DI'),
          infoPara('Début', formatTimeHM(c.heure_debut)),
          infoPara('Fin', formatTimeHM(c.heure_fin)),
          infoPara('Présence', 'Voir la liste de présence'),
          new Paragraph({ spacing: { after: 300 }, children: [] }),
          absentsTable,
          new Paragraph({ spacing: { after: 500 }, children: [] }),
          new Paragraph({ spacing: { after: 300 }, children: [new TextRun({ text: 'ORDRE DU JOUR', bold: true, size: 22, font: FONT, underline: { type: 'single' } })] }),
          new Paragraph({ spacing: { after: 200 }, children: [] }),
          ...(c.taches?.length ? [new Paragraph({ numbering: { reference: 'odj-list', level: 0 }, children: [new TextRun({ text: "Adoption du compte rendu de la dernière séance du CODIR et point d'exécution des tâches prescrites", size: 20, font: FONT })] })] : []),
          ...(c.ordres_du_jour ?? []).map((odj) => new Paragraph({ numbering: { reference: 'odj-list', level: 0 }, children: [new TextRun({ text: odj.libelle, size: 20, font: FONT })] })),
          new Paragraph({ spacing: { after: 300 }, children: [] }),
        ]
      },
      {
        properties: { page: { size: { width: 11906, height: 16838, orientation: PageOrientation.LANDSCAPE }, margin: { top: 500, right: 500, bottom: 700, left: 500 } } },
        footers: { default: makeFooter() },
        children: [
          new Table({ width: { size: TABLE_W, type: WidthType.DXA }, columnWidths: C, rows: generateTableRows() }),
          new Paragraph({ spacing: { before: 600 }, alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'La secrétaire de séance', size: 20, font: FONT, italics: true })] }),
          new Paragraph({ spacing: { before: 600 }, alignment: AlignmentType.RIGHT, children: [new TextRun({ text: secretaireName, size: 20, font: FONT, bold: true })] }),
        ]
      }
    ]
  })

  const blob = await Packer.toBlob(doc)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `Codir_du_${formatDateShort(c.date).replace(/\//g, '_')}.docx`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">

    <!-- Barre d'outils -->
    <div class="no-print sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center justify-between gap-4 shadow-sm">
      <div class="flex items-center gap-3">
        <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" size="sm" @click="router.back()">
          Retour
        </UButton>
        <span class="text-sm font-medium text-gray-600 dark:text-gray-300">Aperçu du CODIR</span>
      </div>
      <div class="flex items-center gap-2">
        <UButton icon="i-heroicons-printer" color="gray" variant="soft" size="sm" @click="printPDF">
          Imprimer / PDF
        </UButton>
        <UButton icon="i-heroicons-document-text" color="blue" variant="soft" size="sm" @click="exportWord">
          Exporter Word
        </UButton>
        <UButton
          v-if="codir && codir.statut !== 'clos'"
          icon="i-heroicons-lock-closed"
          color="red"
          variant="soft"
          size="sm"
          @click="showCloture = true"
        >
          Clôturer
        </UButton>
        <span
          v-else-if="codir && codir.statut === 'clos'"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-400 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600"
        >
          <UIcon name="i-heroicons-lock-closed" class="w-3.5 h-3.5" />
          Clôturé
        </span>
      </div>
    </div>

    <!-- Modale de confirmation de clôture -->
    <UModal v-model="showCloture" :ui="{ width: 'sm:max-w-md' }">
      <UCard>
        <template #header>
          <div class="flex items-center gap-3">
            <div class="flex-shrink-0 w-9 h-9 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
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
            <UButton
              color="red"
              icon="i-heroicons-lock-closed"
              :loading="cloturePending"
              @click="confirmerCloture"
            >
              Confirmer la clôture
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <div v-if="codir" id="codir-preview" class="max-w-5xl mx-auto my-8 bg-white shadow-xl rounded-xl overflow-hidden print:shadow-none print:rounded-none print:my-0 print:max-w-none">

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
            <strong class="text-white">{{ extractTime(codir.heure_debut) }} – {{ extractTime(codir.heure_fin) }}</strong>
          </span>
          <span class="text-xs font-semibold px-3 py-1 rounded-full capitalize bg-white/10 text-white border border-white/20">
            {{ getStatutConfig(codir.statut).label }}
          </span>
        </div>
      </div>

      <div class="px-10 py-8 space-y-10">

        <!-- Suivi des tâches (ODJ 1 implicite) -->
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
                  <span :class="{ 'text-red-600 bg-red-50 px-2 py-0.5 rounded-full text-xs font-semibold': tache.priorite === 'Haute', 'text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full text-xs font-semibold': tache.priorite === 'Moyenne', 'text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-xs font-semibold': tache.priorite === 'Basse' }">{{ tache.priorite }}</span>
                </td>
                <td class="px-3 py-2 border border-slate-200 text-center text-xs">{{ statutTacheLabel(tache.pivot?.statut) }}</td>
                <td class="px-3 py-2 border border-slate-200 text-center">
                  <div class="flex flex-col items-center gap-1">
                    <span class="text-xs font-mono font-semibold text-blue-700">{{ tache.pivot?.progression ?? 0 }}%</span>
                    <div class="w-full bg-gray-200 rounded-full h-1.5">
                      <div class="bg-blue-500 h-1.5 rounded-full" :style="`width:${tache.pivot?.progression ?? 0}%`"></div>
                    </div>
                  </div>
                </td>
                <td class="px-3 py-2 border border-slate-200 text-xs text-slate-600">{{ getMembresLabel(tache.membres) }}</td>
                <td class="px-3 py-2 border border-slate-200 text-xs text-slate-500 italic">{{ tache.pivot?.commentaire ?? '—' }}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <!-- Ordres du jour → Dossiers → Actions → Activités → Tâches -->
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

            <!-- Actions -->
            <div v-for="action in dossier.actions" :key="action.id" class="mb-4 pl-4 border-l-2 border-blue-100">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-blue-500 text-xs font-bold uppercase tracking-wide shrink-0">Action</span>
                <span class="font-medium text-slate-700 text-sm">{{ action.libelle }}</span>
              </div>

              <div v-for="activite in action.activites" :key="activite.id" class="mb-3 pl-4 border-l-2 border-violet-100">
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
                        <span :class="{ 'text-red-600 font-semibold': tache.priorite === 'Haute', 'text-amber-600 font-semibold': tache.priorite === 'Moyenne', 'text-green-600 font-semibold': tache.priorite === 'Basse' }">{{ tache.priorite }}</span>
                      </td>
                      <td class="px-2 py-1.5 border border-slate-200 text-center text-slate-500">{{ formatDateShort(tache.date_debut) }}</td>
                      <td class="px-2 py-1.5 border border-slate-200 text-center text-slate-500">{{ formatDateShort(tache.date_fin) }}</td>
                      <td class="px-2 py-1.5 border border-slate-200 text-slate-500">{{ getMembresLabel(tache.membres) }}</td>
                    </tr>
                  </tbody>
                </table>
                <p v-else class="text-slate-400 text-xs italic ml-2">Aucune tâche.</p>
              </div>
              <p v-if="!action.activites?.length" class="text-slate-400 text-xs italic pl-4">Aucune activité.</p>
            </div>

            <!-- Activités directes du dossier -->
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
                        <span :class="{ 'text-red-600 font-semibold': tache.priorite === 'Haute', 'text-amber-600 font-semibold': tache.priorite === 'Moyenne', 'text-green-600 font-semibold': tache.priorite === 'Basse' }">{{ tache.priorite }}</span>
                      </td>
                      <td class="px-2 py-1.5 border border-slate-200 text-center text-slate-500">{{ formatDateShort(tache.date_debut) }}</td>
                      <td class="px-2 py-1.5 border border-slate-200 text-center text-slate-500">{{ formatDateShort(tache.date_fin) }}</td>
                      <td class="px-2 py-1.5 border border-slate-200 text-slate-500">{{ getMembresLabel(tache.membres) }}</td>
                    </tr>
                  </tbody>
                </table>
                <p v-else class="text-slate-400 text-xs italic ml-2">Aucune tâche.</p>
              </div>
            </div>

            <p v-if="!dossier.actions?.length && !dossier.activites?.length" class="text-slate-400 text-xs italic pl-4">Aucune action ni activité dans ce dossier.</p>
          </div>

          <p v-if="!odj.dossiers?.length" class="text-slate-400 text-xs italic pl-4">Aucun dossier pour cet ordre du jour.</p>
        </section>

        <footer class="border-t border-slate-200 pt-4 text-xs text-slate-400 text-center">
          Document généré le {{ formatDateFR(new Date().toISOString()) }} — CODIR du {{ formatDateFR(codir.date) }}
        </footer>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center py-32 text-gray-400">
      <span class="text-5xl mb-4">📄</span>
      <p class="text-sm">Aucun CODIR chargé. Retournez sur la page de détail.</p>
      <UButton class="mt-4" color="gray" variant="ghost" @click="router.back()">Retour</UButton>
    </div>
  </div>
</template>

<style scoped>
/* Le PDF est généré dans une fenêtre dédiée — aucun style print nécessaire ici */
</style>