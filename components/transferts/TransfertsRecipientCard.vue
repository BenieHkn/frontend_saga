<template>
  <div
    class="relative group flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer"
    :class="selected 
      ? 'border-emerald-500 bg-emerald-50/50 shadow-md shadow-emerald-100' 
      : 'border-slate-200 bg-white hover:border-emerald-300 hover:shadow-sm'"
    @click="$emit('toggle')"
  >
    <div class="flex items-center gap-4">
      <!-- Avatar -->
      <div
        class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-md transition-transform group-hover:scale-105"
        :class="getAvatarColor(recipient.initials)"
      >
        {{recipient.initials }}
      </div>

      <!-- Info -->
      <div>
        <h4 class="font-semibold text-slate-900">{{ recipient.name }}</h4>
        <p class="text-sm text-slate-500">{{ recipient.email }}</p>
      </div>
    </div>

    <!-- Check Icon -->
    <div
      class="w-8 h-8 rounded-full flex items-center justify-center transition-all"
      :class="selected 
        ? 'bg-emerald-500 scale-100' 
        : 'bg-slate-200 scale-90 opacity-40 group-hover:opacity-70'"
    >
      <Icon
        name="heroicons:check"
        class="w-5 h-5 transition-all"
        :class="selected ? 'text-white' : 'text-slate-400'"
      />
    </div>

    <!-- Selection Indicator -->
    <div
      v-if="selected"
      class="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/5 to-blue-500/5 pointer-events-none"
    ></div>
  </div>
</template>

<script setup>

const props = defineProps({
  recipient: {
    type: Object,
    required: true
  },
  selected: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle'])

const getAvatarColor = (initials) => {
  const colors = {
    'JD': 'bg-gradient-to-br from-blue-500 to-blue-600',
    'BS': 'bg-gradient-to-br from-slate-500 to-slate-600',
    'RK': 'bg-gradient-to-br from-cyan-500 to-blue-600',
    'AL': 'bg-gradient-to-br from-slate-400 to-slate-500',
  }
  
  return colors[initials] || 'bg-gradient-to-br from-emerald-500 to-blue-600'
}
</script>