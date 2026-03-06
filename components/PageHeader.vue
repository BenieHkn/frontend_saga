<template>
  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
    <div>
      <h1 class="text-2xl font-bold text-green-900 tracking-tight">
        {{ title }}
      </h1>
      <p v-if="subtitle" class="text-sm text-slate-500">
        {{ subtitle }}
      </p>
    </div>

     <CustomButton :to="to" :btnText="btnText" :modal="modal" @click="$emit('click')" />
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  to: { type: String, default: null },
  btnText: { type: String, default: null },
  modal: { type: Boolean, default: false }
})

defineEmits(['click'])
</script>