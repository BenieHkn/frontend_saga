<script setup>
const props = defineProps({
  column: {
    type: String,
    required: true
  },
  sortColumn: {
    type: String,
    default: null
  },
  sortDirection: {
    type: String,
    default: 'asc'
  }
})

const emit = defineEmits(['sort'])
</script>

<template>
  <button
    type="button"
    class="pointer-events-auto flex flex-col items-center justify-center w-4"
    @click.stop="emit('sort', column)"
  >
    <UIcon
      name="i-heroicons-chevron-up"
      class="w-3 h-3"
      :class="{
        'text-primary': sortColumn === column && sortDirection === 'desc',
        'text-gray-300': sortColumn !== column
      }"
    />

    <UIcon
      name="i-heroicons-chevron-down"
      class="w-3 h-3"
      :class="{
        'text-primary': sortColumn === column && sortDirection === 'asc',
        'text-gray-300': sortColumn !== column
      }"
    />
  </button>
</template>
