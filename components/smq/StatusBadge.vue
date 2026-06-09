<template>
  <span class="qp-badge" :class="[badgeClass, solid ? 'qp-badge--solid' : '']">{{ label }}</span>
</template>

<script setup>
/**
 * Affiche un badge de statut ou de conformité.
 *
 * status : 'brouillon' | 'soumis' | 'valide' | 'transmis' | 'retourne'
 * conformite : 'conforme' | 'non_conforme' | 'en_attente'
 * custom  : classe CSS personnalisée (ex: 'qp-badge--info')
 */
const props = defineProps({
  status:     { type: String, default: '' },
  conformite: { type: String, default: '' },
  custom:     { type: String, default: '' },
  solid:      { type: Boolean, default: false },
})

const STATUT_MAP = {
  brouillon: { class: 'qp-badge--neutral',  label: 'Brouillon' },
  soumis:    { class: 'qp-badge--warning',  label: 'Soumis' },
  valide:    { class: 'qp-badge--success',  label: 'Validé' },
  transmis:  { class: 'qp-badge--teal',     label: 'Transmis' },
  retourne:  { class: 'qp-badge--danger',   label: 'Retourné' },
}

const CONFORMITE_MAP = {
  conforme:      { class: 'qp-badge--success', label: 'Conforme' },
  non_conforme:  { class: 'qp-badge--danger',  label: 'Non conforme' },
  en_attente:    { class: 'qp-badge--warning', label: 'En attente' },
}

const resolved = computed(() => {
  if (props.conformite) return CONFORMITE_MAP[props.conformite] ?? { class: 'qp-badge--neutral', label: props.conformite }
  if (props.status)     return STATUT_MAP[props.status]         ?? { class: 'qp-badge--neutral', label: props.status }
  return { class: props.custom || 'qp-badge--neutral', label: '' }
})

const badgeClass = computed(() => resolved.value.class)
const label      = computed(() => resolved.value.label)
</script>
