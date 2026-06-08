<script setup>

// ============================================================
// PROPS & EMITS
// ============================================================
const props = defineProps({
  codirData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['commenter', 'lire-commentaires', 'open-document'])

// ============================================================
// ÉTAT DE L'ARBORESCENCE
// ============================================================
const expandedKeys = ref([])
const hasInitializedExpand = ref(false)
const searchQuery = ref('')

const toggleExpand = (uid) => {
  if (expandedKeys.value.includes(uid)) {
    expandedKeys.value = expandedKeys.value.filter(k => k !== uid)
  } else {
    expandedKeys.value.push(uid)
  }
}

// Auto-déplier le premier niveau (Ordres du jour) au chargement uniquement
watchEffect(() => {
  if (hasInitializedExpand.value) return
  if (props.codirData?.ordres_du_jour?.length) {
    props.codirData.ordres_du_jour.forEach((odj) => {
      expandedKeys.value.push(`odj-${odj.id}`)
    })
    hasInitializedExpand.value = true
  }
})

// ============================================================
// TOUT DÉPLIER / TOUT REPLIER
// ============================================================
const expandAll = () => {
  const keys = []
  if (props.codirData?.ordres_du_jour) {
    props.codirData.ordres_du_jour.forEach((odj) => {
      if (odj.dossiers?.length) keys.push(`odj-${odj.id}`)

      odj.dossiers?.forEach((dos) => {
        if (dos.actions?.length || dos.activites?.length || dos.taches?.length) keys.push(`dos-${dos.id}`)

        dos.actions?.forEach((act) => {
          if (act.activites?.length || act.taches?.length) keys.push(`act-${act.id}`)
          act.activites?.forEach((activ) => {
            if (activ.taches?.length) keys.push(`actv-${activ.id}`)
          })
        })

        dos.activites?.forEach((activ) => {
          if (activ.taches?.length) keys.push(`actv-${activ.id}`)
        })
      })
    })
  }
  expandedKeys.value = keys
}

const collapseAll = () => {
  expandedKeys.value = []
  hasInitializedExpand.value = true
}

// ============================================================
// CONFIGURATION DES COLONNES
// ============================================================
const columns = [
  { key: 'element',     label: 'Élément'             },
  { key: 'type',        label: 'Niveau'              },
  { key: 'statut',      label: 'Statut'              },
  { key: 'progression', label: 'Avancement'          },
  { key: 'indicateur',  label: 'Indicateur / OOTFit' },
  { key: 'membres',     label: 'Responsables'        },
  { key: 'actions',     label: ''                    },
]

// ============================================================
// EXTRACTION DES MEMBRES
// ============================================================
const extractMembres = (item) => {
  if (!item.membres?.length) return []
  return item.membres.map((m) => {
    const code = m.entite_user?.entite?.code
    if (!code) return null
    return {
      id: m.id,
      codeEntite: code.toUpperCase()
    }
  }).filter(Boolean)
}

// ============================================================
// COMPTEURS ENFANTS
// ============================================================
const buildChildCounts = (item, type) => {
  const parts = []

  const p = (n, singular, plural) =>
    n > 0 ? `${n} ${n > 1 ? plural : singular}` : ''

  if (type === 'Ordre du jour') {
    const d = p(item.dossiers?.length ?? 0, 'dossier', 'dossiers')
    if (d) parts.push(d)
  }

  if (type === 'Dossier') {
    const a  = p(item.actions?.length   ?? 0, 'action',   'actions')
    const av = p(item.activites?.length ?? 0, 'activité', 'activités')
    const t  = p(item.taches?.length    ?? 0, 'tâche',    'tâches')
    if (a)  parts.push(a)
    if (av) parts.push(av)
    if (t)  parts.push(t)
  }

  if (type === 'Action') {
    const av = p(item.activites?.length ?? 0, 'activité', 'activités')
    const t  = p(item.taches?.length    ?? 0, 'tâche',    'tâches')
    if (av) parts.push(av)
    if (t)  parts.push(t)
  }

  if (type === 'Activité') {
    const t = p(item.taches?.length ?? 0, 'tâche', 'tâches')
    if (t) parts.push(t)
  }

  return parts.join(' · ')
}

// ============================================================
// RÉSOLUTION DU PIVOT CODIR POUR UNE TÂCHE
// Priorité 1 : tache.pivot  (tâches racine du CODIR via belongsToMany)
// Priorité 2 : tache.codirs[0].pivot  (tâches imbriquées dossier/action/activité)
// ============================================================
const resolvePivot = (tache) => {
  return tache.pivot ?? tache.codirs?.[0]?.pivot ?? null
}

// ============================================================
// INDICATEUR DE RÉALISATION / OOTFIT (Dossier)
// Chemin : dossier -> pivot -> document -> id
// ============================================================
const resolveDossierPivot = (dossier) => {
  return dossier.pivot ?? dossier.codirs?.[0]?.pivot ?? null
}

const resolveDossierDocument = (dossier) => {
  return resolveDossierPivot(dossier)?.document ?? null
}

const getDocumentLabel = (document) => {
  if (!document) return ''
  return document.libelle || document.reference || document.objet || `#${document.id}`
}

// ============================================================
// COMPTEUR DE COMMENTAIRES
// Les commentaires sont chargés directement sur chaque entité
// via la relation Eloquent `commentaires` (MorphMany filtrée par codir_id).
// On lit donc simplement item.commentaires?.length pour chaque type.
//
// ⚠️  Pour les Tâches, les commentaires sont chargés dans $tacheWith
//     (via la clé 'commentaires' => $commentairesWith).
//     Ils arrivent donc dans tache.commentaires, PAS dans le pivot.
// ============================================================
const extractCommentairesCount = (item) => {
  return item?.commentaires?.length ?? 0
}

// ============================================================
// APLATISSEMENT DE L'ARBRE (computed)
// ============================================================
const hierarchicalData = computed(() => {
  const items = []

  const pushHeader = (label, depth) => {
    items.push({
      _isHeader: true,
      _label: label,
      _depth: depth,
      uid: `h-${label}-${items.length}`
    })
  }

  // --- Tâche ---
  const processTache = (tache, depth) => {
    const pivot = resolvePivot(tache)
    items.push({
      uid:                 `tache-${tache.id}`,
      _type:               'Tâche',
      _label:              tache.intitule,
      _depth:              depth,
      _hasChildren:        false,
      _isExpanded:         false,
      _childCounts:        '',
      _statut:             pivot?.statut      ?? null,
      _progression:        pivot?.progression ?? null,
      _commentaire:        pivot?.commentaire ?? null,
      // Commentaires chargés via $tacheWith → 'commentaires' => $commentairesWith
      _commentairesCount:  extractCommentairesCount(tache),
      membres:             extractMembres(tache),
      _raw:                tache
    })
  }

  // --- Activité ---
  const processActivite = (activite, depth) => {
    const uid      = `actv-${activite.id}`
    const hasChild = (activite.taches?.length ?? 0) > 0
    const isExp    = expandedKeys.value.includes(uid)

    items.push({
      uid,
      _type:               'Activité',
      _label:              activite.libelle,
      _depth:              depth,
      _hasChildren:        hasChild,
      _isExpanded:         isExp,
      _childCounts:        buildChildCounts(activite, 'Activité'),
      _statut:             activite.statut,
      _progression:        null,
      // Commentaires chargés via 'ordresDuJour.dossiers.activites.commentaires'
      // et 'ordresDuJour.dossiers.actions.activites.commentaires'
      _commentairesCount:  extractCommentairesCount(activite),
      membres:             extractMembres(activite),
      _raw:                activite
    })

    if (isExp && hasChild) {
      pushHeader('Tâches', depth + 1)
      activite.taches.forEach((t) => processTache(t, depth + 1))
    }
  }

  // --- Action ---
  const processAction = (action, depth) => {
    const uid      = `act-${action.id}`
    const hasChild = (action.activites?.length ?? 0) > 0 || (action.taches?.length ?? 0) > 0
    const isExp    = expandedKeys.value.includes(uid)

    items.push({
      uid,
      _type:               'Action',
      _label:              action.libelle,
      _depth:              depth,
      _hasChildren:        hasChild,
      _isExpanded:         isExp,
      _childCounts:        buildChildCounts(action, 'Action'),
      _statut:             action.statut,
      _progression:        null,
      // Commentaires chargés via 'ordresDuJour.dossiers.actions.commentaires'
      _commentairesCount:  extractCommentairesCount(action),
      membres:             extractMembres(action),
      _raw:                action
    })

    if (isExp) {
      if (action.activites?.length) {
        pushHeader('Activités', depth + 1)
        action.activites.forEach((a) => processActivite(a, depth + 1))
      }
      if (action.taches?.length) {
        pushHeader('Tâches', depth + 1)
        action.taches.forEach((t) => processTache(t, depth + 1))
      }
    }
  }

  // --- Dossier ---
  const processDossier = (dossier, depth) => {
    const uid      = `dos-${dossier.id}`
    const hasChild = (dossier.actions?.length ?? 0) > 0
                  || (dossier.activites?.length ?? 0) > 0
                  || (dossier.taches?.length ?? 0) > 0
    const isExp    = expandedKeys.value.includes(uid)
    const document = resolveDossierDocument(dossier)

    items.push({
      uid,
      _type:               'Dossier',
      _label:              dossier.libelle,
      _depth:              depth,
      _hasChildren:        hasChild,
      _isExpanded:         isExp,
      _childCounts:        buildChildCounts(dossier, 'Dossier'),
      _statut:             dossier.statut,
      _progression:        null,
      _documentId:         document?.id ?? null,
      _documentLabel:      getDocumentLabel(document),
      // Commentaires chargés via 'ordresDuJour.dossiers.commentaires'
      _commentairesCount:  extractCommentairesCount(dossier),
      membres:             extractMembres(dossier),
      _raw:                dossier
    })

    if (isExp) {
      if (dossier.actions?.length) {
        pushHeader('Actions', depth + 1)
        dossier.actions.forEach((a) => processAction(a, depth + 1))
      }
      if (dossier.activites?.length) {
        pushHeader('Activités', depth + 1)
        dossier.activites.forEach((a) => processActivite(a, depth + 1))
      }
      if (dossier.taches?.length) {
        pushHeader('Tâches', depth + 1)
        dossier.taches.forEach((t) => processTache(t, depth + 1))
      }
    }
  }

  // --- Racine : Ordres du jour ---
  if (props.codirData?.ordres_du_jour?.length) {
    props.codirData.ordres_du_jour.forEach((odj) => {
      const uid      = `odj-${odj.id}`
      const hasChild = (odj.dossiers?.length ?? 0) > 0
      const isExp    = expandedKeys.value.includes(uid)

      items.push({
        uid,
        _type:               'Ordre du jour',
        _label:              odj.libelle,
        _depth:              0,
        _hasChildren:        hasChild,
        _isExpanded:         isExp,
        _childCounts:        buildChildCounts(odj, 'Ordre du jour'),
        _statut:             odj.statut,
        _progression:        null,
        // Commentaires chargés via 'ordresDuJour.commentaires'
        _commentairesCount:  extractCommentairesCount(odj),
        membres:             extractMembres(odj),
        _raw:                odj
      })

      if (isExp && hasChild) {
        pushHeader('Dossiers', 1)
        odj.dossiers.forEach((d) => processDossier(d, 1))
      }
    })
  }

  return items
})

// ============================================================
// RECHERCHE & AFFICHAGE
// ============================================================
const displayData = computed(() => {
  const data = hierarchicalData.value
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return data

  return data.filter((row) => {
    if (row._isHeader) return false
    return (
      row._label?.toLowerCase().includes(q) ||
      row._type?.toLowerCase().includes(q) ||
      row._statut?.toLowerCase().includes(q) ||
      row._commentaire?.toLowerCase().includes(q) ||
      row._documentLabel?.toLowerCase().includes(q) ||
      row.membres?.some(m => m.codeEntite?.toLowerCase().includes(q))
    )
  })
})

const emptyState = computed(() => {
  if (searchQuery.value.trim()) {
    return {
      icon: 'i-heroicons-magnifying-glass',
      label: `Aucun résultat pour « ${searchQuery.value.trim()} »`,
    }
  }
  return {
    icon: 'i-heroicons-folder-open',
    label: 'Aucune donnée structurelle trouvée.',
  }
})

const summary = computed(() => {
  const odjs = props.codirData?.ordres_du_jour ?? []
  let dossiers = 0
  let taches = 0

  odjs.forEach((odj) => {
    dossiers += odj.dossiers?.length ?? 0
    odj.dossiers?.forEach((dos) => {
      taches += dos.taches?.length ?? 0
      dos.actions?.forEach((act) => {
        taches += act.taches?.length ?? 0
        act.activites?.forEach((activ) => {
          taches += activ.taches?.length ?? 0
        })
      })
      dos.activites?.forEach((activ) => {
        taches += activ.taches?.length ?? 0
      })
    })
  })
  taches += props.codirData?.taches?.length ?? 0

  return {
    odj: odjs.length,
    dossiers,
    taches,
    visible: displayData.value.filter(r => !r._isHeader).length,
    total: odjs.length + dossiers + taches,
  }
})

// ============================================================
// HELPERS : INDENTATION & TRAITS
// Chaque niveau = 24px. La ligne verticale est à 10px dans son niveau.
// ============================================================

/** Padding-left total de la cellule selon la profondeur */
const getIndentPx = (depth) => `${depth * 24 + 8}px`

/** Position left (px) de la ligne verticale du niveau d */
const getVLineLeft = (d) => `${(d - 1) * 24 + 18}px`

// ============================================================
// HELPERS : DESIGN & COMMENTAIRES
// ============================================================
const getCommentableType = (type) => {
  const map = {
    'Ordre du jour': 'ordre_du_jour',
    'Dossier':       'dossier',
    'Action':        'action',
    'Activité':      'activite',
    'Tâche':         'tache',
  }
  return map[type] ?? type
}

const buildCommentPayload = (row) => ({
  type:             row._type,
  commentable_type: getCommentableType(row._type),
  commentable_id:   row._raw?.id,
  label:            row._label,
  data:             row._raw,
})

const handleCommenter = (row) => {
  emit('commenter', buildCommentPayload(row))
}

const handleLireCommentaires = (row) => {
  emit('lire-commentaires', buildCommentPayload(row))
}

const openIndicateurDocument = (documentId) => {
  if (!documentId) return
  emit('open-document', { id: documentId })
}

const getTypeIcon = (type) => {
  switch (type) {
    case 'Ordre du jour': return 'i-heroicons-clipboard-document-list'
    case 'Dossier':       return 'i-heroicons-folder-open'
    case 'Action':        return 'i-heroicons-bolt'
    case 'Activité':      return 'i-heroicons-briefcase'
    case 'Tâche':         return 'i-heroicons-check-circle'
    default:              return 'i-heroicons-document'
  }
}

const getTypeColor = (type) => {
  switch (type) {
    case 'Ordre du jour': return 'text-purple-500'
    case 'Dossier':       return 'text-blue-500'
    case 'Action':        return 'text-orange-500'
    case 'Activité':      return 'text-teal-500'
    case 'Tâche':         return 'text-green-500'
    default:              return 'text-gray-500'
  }
}

const getTypeBadgeColor = (type) => {
  switch (type) {
    case 'Ordre du jour': return 'purple'
    case 'Dossier':       return 'blue'
    case 'Action':        return 'orange'
    case 'Activité':      return 'teal'
    case 'Tâche':         return 'green'
    default:              return 'gray'
  }
}

const formatStatus = (status) => {
  if (!status) return ''
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'realisee': return 'green'
    case 'en_cours': return 'yellow'
    case 'soumis':   return 'blue'
    case 'actif':    return 'primary'
    default:         return 'gray'
  }
}

const getProgressionColor = (progression) => {
  if (progression === 100) return 'green'
  if (progression > 0)     return 'primary'
  return 'gray'
}
</script>

<template>
  <div class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">

    <!-- ======================================================= -->
    <!-- EN-TÊTE                                                   -->
    <!-- ======================================================= -->
    <div
      class="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 bg-gray-50/50 dark:bg-gray-900/50 rounded-t-xl">
      <div class="min-w-0 flex-1">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Récap du CODIR</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Ordres du jour, dossiers, actions, activités et tâches.
        </p>
        <div v-if="summary.total > 0" class="flex flex-wrap gap-2 mt-2">
          <UBadge color="purple" variant="subtle" size="xs">{{ summary.odj }} ODJ</UBadge>
          <UBadge color="blue" variant="subtle" size="xs">{{ summary.dossiers }} dossiers</UBadge>
          <UBadge color="green" variant="subtle" size="xs">{{ summary.taches }} tâches</UBadge>
          <UBadge color="gray" variant="subtle" size="xs">{{ summary.visible }} lignes visibles</UBadge>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row sm:items-center gap-2 shrink-0 w-full sm:w-auto">
        <div class="flex items-center gap-2 w-full sm:w-72">
          <UInput
            v-model="searchQuery"
            icon="i-heroicons-magnifying-glass"
            placeholder="Filtrer par libellé, type, statut…"
            size="sm"
            class="flex-1 min-w-0"
          />
          <UButton
            v-if="searchQuery"
            icon="i-heroicons-x-mark"
            color="gray"
            variant="ghost"
            size="xs"
            aria-label="Effacer la recherche"
            @click="searchQuery = ''"
          />
        </div>
        <div class="flex gap-2">
          <UButton
            icon="i-heroicons-arrows-pointing-in"
            size="sm"
            color="gray"
            variant="ghost"
            label="Tout replier"
            :disabled="!!searchQuery"
            @click="collapseAll"
          />
          <UButton
            icon="i-heroicons-arrows-pointing-out"
            size="sm"
            color="gray"
            variant="ghost"
            label="Tout déplier"
            :disabled="!!searchQuery"
            @click="expandAll"
          />
        </div>
      </div>
    </div>

    <!-- ======================================================= -->
    <!-- TABLEAU HIÉRARCHIQUE                                      -->
    <!-- ======================================================= -->
    <div class="overflow-x-auto">
    <UTable
      :columns="columns"
      :rows="displayData"
      :empty-state="emptyState"
      class="w-full min-w-[900px]"
      :ui="{
        thead: 'sticky top-0 z-10 bg-white dark:bg-gray-900',
        tbody: 'divide-y divide-gray-100 dark:divide-gray-800',
        tr: { base: 'hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors' }
      }"
    >

      <!-- -------------------------------------------------- -->
      <!-- Colonne : Élément                                   -->
      <!-- -------------------------------------------------- -->
      <template #element-data="{ row }">

        <!-- Sous-titre de section (ex: "Dossiers", "Tâches") -->
        <div
          v-if="row._isHeader"
          class="relative py-2 mt-2 border-b border-gray-100 dark:border-gray-800"
          :style="{ paddingLeft: getIndentPx(row._depth) }"
        >
          <!-- Traits verticaux des niveaux parents -->
          <span
            v-for="d in row._depth"
            :key="d"
            class="absolute top-0 bottom-0 border-l border-dashed border-gray-200 dark:border-gray-700 pointer-events-none"
            :style="{ left: getVLineLeft(d) }"
          />
          <span class="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 flex items-center gap-2">
            <UIcon name="i-heroicons-bars-3-bottom-left" class="w-3 h-3" />
            {{ row._label }}
          </span>
        </div>

        <!-- Élément classique (ODJ, Dossier, Action, Tâche…) -->
        <div
          v-else
          class="relative flex items-center gap-2 py-1.5 min-w-0"
          :class="row._hasChildren ? 'cursor-pointer select-none' : ''"
          :style="{ paddingLeft: getIndentPx(row._depth) }"
          @click="row._hasChildren && toggleExpand(row.uid)"
        >
          <!-- Traits verticaux des niveaux parents -->
          <span
            v-for="d in row._depth"
            :key="d"
            class="absolute top-0 bottom-0 border-l border-dashed border-gray-200 dark:border-gray-700 pointer-events-none"
            :style="{ left: getVLineLeft(d) }"
          />
          <!-- Crochet horizontal vers l'élément -->
          <span
            v-if="row._depth > 0"
            class="absolute border-t border-dashed border-gray-200 dark:border-gray-700 pointer-events-none"
            :style="{
              left: getVLineLeft(row._depth),
              width: '10px',
              top: '50%'
            }"
          />

          <!-- Bouton toggle ou espaceur -->
          <UButton
            v-if="row._hasChildren"
            icon="i-heroicons-chevron-right-20-solid"
            size="2xs"
            color="gray"
            variant="ghost"
            class="transition-transform duration-200 flex-shrink-0"
            :class="{ 'rotate-90': row._isExpanded }"
            @click.stop="toggleExpand(row.uid)"
          />
          <div v-else class="w-6 flex-shrink-0" />

          <!-- Icône du type -->
          <UIcon
            :name="getTypeIcon(row._type)"
            :class="getTypeColor(row._type)"
            class="w-5 h-5 flex-shrink-0"
          />

          <!-- Libellé -->
          <span
            class="font-medium text-sm text-gray-900 dark:text-gray-100 truncate min-w-0 flex-1"
            :title="row._label"
          >
            {{ row._label }}
          </span>

          <!-- Compteur enfants (visible seulement quand replié) -->
          <span
            v-if="row._hasChildren && !row._isExpanded && row._childCounts"
            class="text-[10px] text-gray-400 dark:text-gray-500 shrink-0 ml-0.5"
          >
            {{ row._childCounts }}
          </span>
        </div>
      </template>

      <!-- -------------------------------------------------- -->
      <!-- Colonne : Type                                      -->
      <!-- -------------------------------------------------- -->
      <template #type-data="{ row }">
        <UBadge v-if="!row._isHeader" :color="getTypeBadgeColor(row._type)" variant="soft" size="xs">
          {{ row._type }}
        </UBadge>
      </template>

      <!-- -------------------------------------------------- -->
      <!-- Colonne : Statut                                    -->
      <!-- -------------------------------------------------- -->
      <template #statut-data="{ row }">
        <div v-if="!row._isHeader">
          <UBadge v-if="row._statut" :color="getStatusColor(row._statut)" variant="subtle" size="xs">
            {{ formatStatus(row._statut) }}
          </UBadge>
          <span v-else class="text-gray-300 dark:text-gray-600 text-xs">—</span>
        </div>
      </template>

      <!-- -------------------------------------------------- -->
      <!-- Colonne : Progression                              -->
      <!-- -------------------------------------------------- -->
      <template #progression-data="{ row }">
        <div v-if="!row._isHeader">
          <div
            v-if="row._type === 'Tâche' && row._progression !== null && row._progression !== undefined"
            class="flex items-center gap-2 w-28"
          >
            <UProgress :value="row._progression" :color="getProgressionColor(row._progression)" size="xs" />
            <span class="text-xs font-medium text-gray-600 dark:text-gray-400 w-8 text-right">
              {{ row._progression }}%
            </span>
          </div>
          <span v-else class="text-gray-300 dark:text-gray-600 text-xs">—</span>
        </div>
      </template>

      <!-- -------------------------------------------------- -->
      <!-- Colonne : Indicateur de réalisation / OOTFit      -->
      <!-- -------------------------------------------------- -->
      <template #indicateur-data="{ row }">
        <div v-if="!row._isHeader" class="max-w-[200px]">
          <!-- Dossier : document lié via pivot -->
          <div v-if="row._type === 'Dossier' && row._documentId">
            <UTooltip :text="row._documentLabel || `Document #${row._documentId}`">
              <UButton
                icon="i-heroicons-document-text"
                size="xs"
                color="primary"
                variant="soft"
                class="truncate max-w-full"
                :label="row._documentLabel || `#${row._documentId}`"
                @click.stop="openIndicateurDocument(row._documentId)"
              />
            </UTooltip>
          </div>
          <!-- Tâche : commentaire pivot (indicateur / outfit) -->
          <UTooltip v-else-if="row._type === 'Tâche' && row._commentaire" :text="row._commentaire">
            <p class="text-xs text-gray-600 dark:text-gray-400 italic truncate" :title="row._commentaire">
              {{ row._commentaire }}
            </p>
          </UTooltip>
          <span v-else class="text-gray-300 dark:text-gray-600 text-xs">—</span>
        </div>
      </template>

      <!-- -------------------------------------------------- -->
      <!-- Colonne : Membres                                   -->
      <!-- -------------------------------------------------- -->
      <template #membres-data="{ row }">
        <div v-if="!row._isHeader" class="flex flex-wrap gap-1.5 max-w-[180px]">
          <template v-if="row.membres && row.membres.length > 0">
            <UTooltip
              v-for="membre in row.membres"
              :key="membre.id"
              :text="membre.codeEntite"
            >
              <UBadge
                color="primary"
                variant="solid"
                size="xs"
                class="font-mono font-bold shadow-sm ring-1 ring-inset ring-primary-500/20"
              >
                {{ membre.codeEntite }}
              </UBadge>
            </UTooltip>
          </template>
          <span v-else-if="row._type === 'Tâche'" class="text-[10px] text-gray-400 italic">Non assigné</span>
          <span v-else class="text-gray-300 dark:text-gray-600 text-xs">—</span>
        </div>
      </template>

      <!-- -------------------------------------------------- -->
      <!-- Colonne : Actions                                   -->
      <!-- -------------------------------------------------- -->
      <template #actions-data="{ row }">
        <div v-if="!row._isHeader" class="flex justify-end items-center gap-1">

          <!-- Lire les commentaires -->
          <div class="relative inline-block">
            <UTooltip text="Voir les commentaires">
              <UButton
                icon="i-heroicons-chat-bubble-bottom-center-text"
                size="xs"
                color="gray"
                variant="ghost"
                @click.stop="handleLireCommentaires(row)"
              />
            </UTooltip>
            <!--
              _commentairesCount est calculé via item.commentaires?.length pour tous les types :
              - ODJ      → ordresDuJour.commentaires (Eloquent MorphMany filtré par codir_id)
              - Dossier  → ordresDuJour.dossiers.commentaires
              - Action   → ordresDuJour.dossiers.actions.commentaires
              - Activité → ordresDuJour.dossiers.{activites|actions.activites}.commentaires
              - Tâche    → $tacheWith → 'commentaires' => $commentairesWith (PAS le pivot)
            -->
            <span
              v-if="row._commentairesCount > 0"
              class="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-4 px-1 flex items-center justify-center pointer-events-none border border-white dark:border-gray-900"
            >
              {{ row._commentairesCount }}
            </span>
          </div>

          <!-- Ajouter un commentaire -->
          <div class="relative inline-block">
            <UTooltip text="Ajouter un commentaire">
              <UButton
                icon="i-heroicons-chat-bubble-left-right"
                size="xs"
                color="primary"
                variant="ghost"
                @click.stop="handleCommenter(row)"
              />
            </UTooltip>
            <div class="absolute -bottom-0.5 -right-0.5 bg-primary-500 rounded-full p-0.5 flex items-center justify-center border border-white dark:border-gray-900 pointer-events-none">
              <UIcon name="i-heroicons-plus" class="w-2 h-2 text-white" />
            </div>
          </div>

        </div>
      </template>

    </UTable>
    </div>
  </div>
</template>