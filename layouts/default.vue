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
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '~/composables/auth/useAuth'

const isSidebarExpanded = ref(true)

const handleSidebarToggle = (state) => {
  isSidebarExpanded.value = state
}

// Client-side guard: prevent non-admin users accessing admin routes via direct URL
const route = useRoute()
const { getUser } = useAuth()
const adminOnlyRoutes = ['/entites', '/utilisateurs', '/point-critique', '/interim', '/type-document']

const checkAdminAccess = () => {
  const user = getUser()
  const isAdminRoute = adminOnlyRoutes.some(r => route.path === r || route.path.startsWith(r + '/'))
  if (isAdminRoute && !(user && user.is_superadmin)) {
    return navigateTo('/')
  }
}

onMounted(() => {
  checkAdminAccess()
})

watch(() => route.path, () => {
  checkAdminAccess()
})
</script>