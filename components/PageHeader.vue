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

     <UBadge color="blue" variant="soft" size="lg" class="ml-auto" v-if="btnText !== null">
        <UButton :to="to" variant="text" icon="i-heroicons-plus" size="sm" class="p-0 m-0 text-blue-600">
          {{btnText}}
        </UButton>
      </UBadge>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  to: { type: String, default: null },
  btnText: { type: String, default: null }
})
</script>