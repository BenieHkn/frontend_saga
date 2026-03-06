<template>
   <UBadge :color="color" variant="soft" size="lg" class="ml-auto" v-if="btnText !== null">
        <UButton 
          :to="to" 
          :loading="loading"
          variant="text" 
          :icon="icon" 
          size="sm" 
          :class="`p-0 m-0 text-${color}-600`" 
          @click="handleClick"
        >
          {{btnText}}
        </UButton>
      </UBadge>
</template>

<script setup>
const props = defineProps({
  to: { type: String, default: null },
  btnText: { type: String, default: null },
  modal: { type: Boolean, default: false },
  icon: { type: String, default: 'i-heroicons-plus' },
  color: { type: String, default: 'blue' },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['click'])

const handleClick = () => {
    emit('click')
}
</script>