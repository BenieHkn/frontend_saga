<template>
  <div class="min-h-screen bg-slate-50">
    <Header class="z-[50]" />
    
    <Sidebar @sidebar-toggle="handleSidebarToggle" />
    
    <div class=""> <main 
        :class="[
          'transition-all duration-300 ease-in-out',
          isSidebarExpanded ? 'lg:ml-64' : 'lg:ml-20',
          'ml-20' 
        ]"
      >
        <div class="p-2 lg:p-2">
          <slot />
          <UNotifications />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isSidebarExpanded = ref(true)

const handleSidebarToggle = (state) => {
  isSidebarExpanded.value = state
}
</script>