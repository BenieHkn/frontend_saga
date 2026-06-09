<template>
  <div class="smq-page-head">
    <div class="smq-page-head__title">
      <span v-if="overline" class="qp-overline" style="display: block; margin-bottom: 6px">{{ overline }}</span>
      <h1 class="smq-page-head__h1">{{ title }}</h1>
    </div>
    <div class="smq-page-head__actions">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title:   { type: String, required: true },
  overline:{ type: String, default: '' },
})
</script>

<style scoped>
.smq-page-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 22px;
  flex-wrap: wrap;
}
.smq-page-head__h1 {
  font-family: 'IBM Plex Sans', system-ui, sans-serif;
  font-size: 1.875rem;
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--qp-fg-1);
  margin: 0;
}
.smq-page-head__actions {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}
</style>
