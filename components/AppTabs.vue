<script setup>
import { ref } from 'vue' 
const props = defineProps({
  tabs: {
    type: Array,
    default: () => []
  },
  defaultTab: {
    type: String,
    default: null,
  }
})

const activeTab = ref(props.defaultTab ?? props.tabs?.[0]?.id)
</script>

<template>
  <div>
    <div class="border-b border-slate-200 mb-6">
      <nav class="flex gap-8" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="pb-4 pt-2 text-sm font-medium transition-all border-b-2"
          :class="[
            activeTab === tab.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          ]"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <div class="animate-in fade-in duration-300">
      <slot :name="activeTab" />
    </div>
  </div>
</template>