<template>
  <div class="smq-page-head">
    <!-- Cercles décoratifs -->
    <span class="smq-page-head__deco smq-page-head__deco--1" aria-hidden="true" />
    <span class="smq-page-head__deco smq-page-head__deco--2" aria-hidden="true" />
    <span class="smq-page-head__deco smq-page-head__deco--3" aria-hidden="true" />

    <div class="smq-page-head__inner">
      <div class="smq-page-head__title">
        <span v-if="overline" class="smq-page-head__overline">{{ overline }}</span>
        <h1 class="smq-page-head__h1">{{ title }}</h1>
      </div>
      <div class="smq-page-head__actions">
        <slot />
      </div>
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
  background: linear-gradient(135deg, #11233B 0%, #1E3A5F 45%, #116A37 100%);
  border-radius: 16px;
  margin-bottom: 24px;
  padding: 26px 30px;
  box-shadow:
    0 6px 24px rgba(14, 27, 45, 0.28),
    0 2px 6px  rgba(14, 27, 45, 0.14),
    inset 0 1px 0 rgba(255,255,255,0.07);
  position: relative;
  overflow: hidden;
}

/* Cercles décoratifs */
.smq-page-head__deco {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.smq-page-head__deco--1 {
  width: 200px; height: 200px;
  top: -60px; right: -50px;
  background: rgba(255,255,255,0.05);
}
.smq-page-head__deco--2 {
  width: 120px; height: 120px;
  bottom: -50px; right: 100px;
  background: rgba(31, 157, 82, 0.12);
}
.smq-page-head__deco--3 {
  width: 80px; height: 80px;
  top: 10px; right: 160px;
  background: rgba(255,255,255,0.03);
}

.smq-page-head__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
}

.smq-page-head__overline {
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
  display: block;
  margin-bottom: 5px;
}

.smq-page-head__h1 {
  font-family: Montserrat, system-ui, sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: #fff;
  margin: 0;
  text-shadow: 0 1px 4px rgba(0,0,0,0.20);
}

.smq-page-head__actions {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}
</style>
