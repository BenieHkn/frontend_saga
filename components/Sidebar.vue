<template>
  <aside :class="[
    'fixed left-0 top-20 h-[calc(100vh-80px)] transition-all duration-300 z-[40] shadow-xl flex flex-col',
    'bg-white border-white/5',
    isExpanded ? 'w-64' : 'w-20',
  ]">
    <nav class="flex-1 px-3 py-6 space-y-2 overflow-y-auto no-scrollbar">
      <NuxtLink v-for="item in menuItems" :key="item.path" :to="item.path"
        class="flex items-center group relative px-4 py-3.5 rounded-xl transition-all duration-200" :class="[
          isItemActive(item)
            ? 'bg-gradient-to-br from-emerald-700 to-blue-800 text-white shadow-lg'
            : 'text-gray-700 hover:bg-emerald-800 hover:text-white',
        ]">
        <Icon :name="item.icon" class="h-6 w-6 shrink-0" />
        <span v-if="isExpanded" class="ml-4 font-bold overflow-hidden tracking-wide">
          {{ item.name }}
        </span>

        <div v-if="!isExpanded"
          class="absolute left-16 bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
          {{ item.name }}
        </div>
      </NuxtLink>

      <div v-if="isAdmin" class="pt-4 mt-4 border-t border-gray-200">
        <button @click="toggleSettings"
          class="flex items-center justify-between w-full px-4 py-3.5 text-gray-700 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-all">
          <div class="flex items-center">
            <Icon name="heroicons:cog-6-tooth" class="h-6 w-6 shrink-0" />
            <span v-if="isExpanded" class="ml-4 font-bold text-gray-900">Configuration</span>
          </div>
          <Icon v-if="isExpanded" :name="settingsMenuOpen
              ? 'heroicons:chevron-up'
              : 'heroicons:chevron-down'
            " class="h-4 w-4 opacity-60" />
        </button>
        <div v-if="settingsMenuOpen && isExpanded" class="ml-10 space-y-2 mt-2 animate-slide-down">
          <NuxtLink to="/entites" class="block text-sm px-3 py-2 rounded-lg font-bold transition-colors" :class="[
            route.path === '/entites'
              ? 'bg-gradient-to-br from-emerald-700 to-blue-800 text-white shadow-lg'
              : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-100'
          ]">Entités</NuxtLink>
          <NuxtLink to="/utilisateurs" class="block text-sm px-3 py-2 rounded-lg font-bold transition-colors" :class="[
            route.path === '/utilisateurs'
              ? 'bg-gradient-to-br from-emerald-700 to-blue-800 text-white shadow-lg'
              : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-100'
          ]">Utilisateurs</NuxtLink>
          <NuxtLink to="/point-critique" class="block text-sm px-3 py-2 rounded-lg font-bold transition-colors" :class="[
            route.path === '/point-critique'
              ? 'bg-gradient-to-br from-emerald-700 to-blue-800 text-white shadow-lg'
              : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-100'
          ]">Point Critique</NuxtLink>
          <NuxtLink to="/interim" class="block text-sm px-3 py-2 rounded-lg font-bold transition-colors" :class="[
            route.path === '/interim'
              ? 'bg-gradient-to-br from-emerald-700 to-blue-800 text-white shadow-lg'
              : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-100'
          ]">Intérim</NuxtLink>
        </div>
      </div>
    </nav>

    <button @click="toggleSidebar"
      class="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center z-[50] transition-all duration-500 group">
      <div
        class="absolute inset-0 rounded-full transition-all duration-300 bg-gradient-to-br from-emerald-700 to-blue-800 backdrop-blur-md border border-white/40 shadow-[0_8_32_0_rgba(0,0,0,0.2)] group-hover:scale-110 group-hover:bg-emerald-500/80 before:content-[''] before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-b before:from-white/40 before:to-transparent before:opacity-50">
        <div class="absolute inset-[2px] rounded-full bg-gradient-to-tr from-emerald-400/20 to-white/30 opacity-60">
        </div>
      </div>

      <Icon :name="isExpanded
          ? 'heroicons:chevron-left-20-solid'
          : 'heroicons:chevron-right-20-solid'
        " class="h-6 w-6 text-white relative z-10 drop-shadow-sm" />
    </button>
  </aside>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useAuth } from "~/composables/auth/useAuth"

const route = useRoute();

const isExpanded = ref(true);
const settingsMenuOpen = ref(false);
const emit = defineEmits(["sidebar-toggle"]);

const { getUser } = useAuth()

const isAdmin = computed(() => {
  const u = getUser()
  return !!u && !!u.is_superadmin
})

const menuItems = [
  { name: "Tableau de bord", path: "/dashboard", icon: "heroicons:home-20-solid" },
  { name: "Documents", path: "/documents", icon: "heroicons:folder-open-20-solid" },
  { name: "Affectations & \n Transferts", path: "/affectations-transferts", icon: "heroicons:clipboard-document-check-20-solid" },
  { name: "Rattachement", path: "/rattachements", icon: "heroicons:paper-clip-20-solid" },
  { name: "CODIR", path: "/codir", icon: "heroicons:user-group-20-solid" },
  { name: "Statistiques", path: "/stats", icon: "heroicons:chart-bar-20-solid" },
  { name: "Pré-Achivage", path: "/archivage", icon: "heroicons:archive-box-20-solid" },
];

const CODIR_PREFIXES = [
  '/codir',
  '/ordres-du-jour',
  '/dossiers',
  '/activites',
  '/actions',
  '/taches',
]

const isItemActive = (item) => {
  if (item.path === '/codir') {
    return CODIR_PREFIXES.some((prefix) => route.path.startsWith(prefix))
  }
  return route.path === item.path
}

const toggleSidebar = () => {
  isExpanded.value = !isExpanded.value;
  emit("sidebar-toggle", isExpanded.value);
};

const toggleSettings = () => {
  if (!isExpanded.value) toggleSidebar();
  settingsMenuOpen.value = !settingsMenuOpen.value;
};

const isSettingsRouteActive = computed(() => {
  return ['/entites', '/fonctions', '/utilisateurs'].some(path =>
    route.path === path
  );
});

watch(isSettingsRouteActive, (isActive) => {
  if (isActive && !settingsMenuOpen.value) {
    settingsMenuOpen.value = true;
  }
});

onMounted(() => {
  if (window.innerWidth < 1024) isExpanded.value = false;
  emit("sidebar-toggle", isExpanded.value);
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

@keyframes slide-down {
  from {
    transform: translateY(-5px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slide-down {
  animation: slide-down 0.2s ease-out forwards;
}
</style>