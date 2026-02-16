<template>
  <div class="mt-4">
    <label class="flex flex-col min-w-40 h-11 w-full">
      <div class="flex w-full flex-1 items-stretch rounded-lg h-full">
        <div class="text-[#4c739a] flex border-none bg-[#e7edf3] dark:bg-slate-800 items-center justify-center pl-4 rounded-l-lg">
          <span class="material-symbols-outlined text-xl">{{ icon }}</span>
        </div>
        <input 
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d141b] dark:text-white focus:outline-0 focus:ring-0 border-none bg-[#e7edf3] dark:bg-slate-800 h-full placeholder:text-[#4c739a] px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal" 
          :placeholder="placeholder"
        />
      </div>
    </label>
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
  placeholder: String,
  icon: { type: String, default: 'search' }
})
defineEmits(['update:modelValue'])
</script>