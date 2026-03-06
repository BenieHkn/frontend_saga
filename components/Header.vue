<template>
  <header class="fixed w-full top-0 z-50 bg-white border-b border-slate-100">
    <div class="px-4 sm:px-6 lg:px-5">
      <div class="flex justify-between items-center h-20">
        
        <div class="flex items-center space-x-2 shrink-0">
          <NuxtImg 
            src="/images/saga_logo.png" 
            alt="Logo SAGA" 
            class="h-16 w-20 object-contain" 
            loading="eager"
          />
          <div class="flex flex-col leading-tight">
            <h1 class="text-sm tracking-tighter text-blue-800">
              <span class="font-black">SAGA</span>
              <span class="text-emerald-400 font-light mx-1">|</span>
              REVOLUTION
            </h1>
          </div>
        </div>

        <ClientOnly>
          <div class="flex items-center space-x-5">
            <div class="relative">
              <button @click="toggleNotifications" type="button"
                class="p-2.5 rounded-xl bg-gradient-to-br from-emerald-700 to-blue-700 text-white transition-all border border-transparent focus:outline-none hover:shadow-lg">
                <Icon name="heroicons:bell" class="h-5 w-5" />
                <span v-if="nonLues > 0"
                  class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[9px] font-bold text-white ring-2 ring-white">
                  {{ nonLues > 9 ? '9+' : nonLues }}
                </span>
              </button>

              <div v-if="showNotifications"
                class="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-[110] overflow-hidden">

                <div class="p-4 bg-slate-900 text-white flex justify-between items-center">
                  <span class="font-bold text-xs uppercase tracking-widest">Notifications</span>
                  <button v-if="nonLues > 0" @click="toutLire"
                    class="text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold">
                    Tout marquer comme lu
                  </button>
                </div>

                <div class="max-h-80 overflow-y-auto divide-y divide-slate-50">
                  <div v-if="notifications.length === 0" class="p-8 text-center text-slate-400 text-sm">
                    Aucune notification
                  </div>

                  <div v-for="n in notifications" :key="n.id" @click="ouvrirNotification(n)"
                    class="p-4 hover:bg-slate-50 cursor-pointer transition-all flex gap-3"
                    :class="n.lu ? 'opacity-60' : 'bg-emerald-50/40'">

                    <div class="shrink-0 mt-0.5">
                      <div class="h-8 w-8 rounded-full flex items-center justify-center text-white"
                        :class="n.type === 'affectation' ? 'bg-emerald-600' : 'bg-blue-600'">
                        <Icon
                          :name="n.type === 'affectation' ? 'heroicons:clipboard-document' : 'heroicons:arrows-right-left'"
                          class="h-4 w-4" />
                      </div>
                    </div>

                    <div class="flex-1 min-w-0">
                      <div class="flex justify-between items-start gap-2">
                        <p class="text-xs font-bold text-slate-700 truncate">{{ n.titre }}</p>
                        <span class="text-[10px] text-slate-400 shrink-0">{{ n.time }}</span>
                      </div>
                      <p class="text-xs text-slate-500 mt-0.5 leading-relaxed line-clamp-2">{{ n.message }}</p>
                      <span class="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-semibold"
                        :class="n.type === 'affectation' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'">
                        {{ n.type === 'affectation' ? 'Affectation' : 'Transfert' }}
                      </span>
                    </div>

                    <div v-if="!n.lu" class="shrink-0 mt-2">
                      <span class="h-2 w-2 rounded-full bg-amber-400 block"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="relative">
              <button @click="toggleUserMenu" type="button"
                class="flex items-center pl-1 pr-3 py-1 bg-gradient-to-br from-emerald-700 to-blue-700 rounded-2xl hover:opacity-90 transition-all focus:outline-none">
                <div class="p-0.5 rounded-xl">
                  <img class="h-9 w-9 rounded-[10px] object-cover bg-white" :src="getInitials(user?.prenom, user?.nom)"
                    alt="User" />
                </div>
                <div class="hidden md:block ml-3 text-left mr-2">
                  <p class="text-xs font-bold text-white leading-none uppercase">
                    {{ user?.nom }}
                  </p>
                  <p class="text-[10px] text-emerald-300 font-bold mt-1 uppercase tracking-tighter">
                    <span v-if="user?.is_superadmin">Administrateur</span>
                    <span v-else>{{ selected_entite?.code }}</span>
                  </p>
                </div>
                <Icon name="heroicons:chevron-down-20-solid" class="h-4 w-4 text-white/50" />
              </button>

              <div v-if="showUserMenu"
                class="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 z-[110] p-2">
                <div v-if="selected_entite" class="px-4 py-2 border-b border-slate-50 mb-1 bg-emerald-50 rounded-lg">
                  <p class="text-sm font-bold text-emerald-700 truncate">
                    {{ selected_entite?.libelle }}
                  </p>
                  <p v-if="currentEntiteUser?.is_responsable" class="text-xs text-emerald-600 mt-1">
                    {{ selected_entite?.fonction }}
                  </p>
                  <p v-else class="text-xs text-emerald-500 mt-1">
                    Agent
                  </p>
                  <div class="flex gap-1 mt-2">
                    <span v-if="currentEntiteUser?.is_interim"
                      class="text-[10px] bg-amber-600 text-white px-2 py-0.5 rounded-full">
                      Intérim
                    </span>
                  </div>
                </div>

                <div v-if="otherEntites.length > 0">
                  <button @click="showModal = true"
                    class="flex items-center space-x-3 w-full p-3 rounded-xl hover:bg-emerald-50 text-emerald-700 transition-all font-bold text-sm mb-2">
                    <Icon name="heroicons:arrows-right-left" class="h-5 w-5" />
                    <span>Changer d'entité</span>
                  </button>

                  <UModal v-model="showModal">
                    <div class="p-6">
                      <h2 class="text-lg font-bold text-slate-800 mb-4">Changer d'entité</h2>
                      <div class="space-y-3 grid grid-cols-1 gap-3">
                        <div v-for="entite in otherEntites" :key="entite.id"
                          class="p-3 border border-slate-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 cursor-pointer transition-all"
                          @click="switchEntite(entite)">
                          <p class="font-bold text-emerald-700">{{ entite.libelle }}</p>
                          <p class="text-xs text-emerald-600 font-medium">{{ entite.code }}</p>
                          <div class="flex gap-1 mt-2">
                            <span v-if="entite.is_responsable"
                              class="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                              Responsable
                            </span>
                            <span v-if="entite.is_interim"
                              class="text-[10px] bg-amber-600 text-white px-2 py-0.5 rounded-full">
                              Intérim
                            </span>
                          </div>
                        </div>
                      </div>
                      <div class="mt-6 flex justify-end">
                        <UButton label="Fermer" color="gray" variant="ghost" @click="showModal = false" />
                      </div>
                    </div>
                  </UModal>
                </div>

                <button @click="logout"
                  class="flex items-center space-x-3 w-full p-3 rounded-xl hover:bg-red-50 text-red-500 transition-all font-bold text-sm mt-2">
                  <Icon name="heroicons:power" class="h-5 w-5" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>
          </div>
          
          <template #fallback>
            <div class="h-10 w-10 animate-pulse bg-slate-100 rounded-full"></div>
          </template>
        </ClientOnly>

      </div>
    </div>
  </header>

  <div class="h-20"></div>
</template>

<script setup>
import { useNotifications } from '@/composables/useNotifications';

const showNotifications = ref(false);
const showUserMenu = ref(false);
const user = ref(null);
const selected_entite = ref(null);
const entite_user = ref(null);
const entites = ref([]);
const showModal = ref(false);

const { notifications, nonLues, marquerLu, toutLire, demarrerPolling, arreterPolling } = useNotifications()

const ouvrirNotification = async (notif) => {
  if (!notif.lu) await marquerLu(notif.id)
  showNotifications.value = false
  navigateTo('/documents')
}

const currentEntiteUser = computed(() => {
  if (!selected_entite.value || !entites.value) return null;
  return entites.value.find(e => e.id === selected_entite.value.id) || null;
});

const otherEntites = computed(() => {
  if (!entites.value) return [];
  if (!selected_entite.value) return entites.value.filter(e => e.actif);
  return entites.value.filter((e) => e.id !== selected_entite.value.id && e.actif);
});

const toggleNotifications = (e) => {
  e.stopPropagation();
  showNotifications.value = !showNotifications.value;
  showUserMenu.value = false;
};

const toggleUserMenu = (e) => {
  e.stopPropagation();
  showUserMenu.value = !showUserMenu.value;
  showNotifications.value = false;
};

const getInitials = (nom, prenom) => {
  const name = `${prenom || ""} ${nom || ""}`.trim() || "User";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ffffff&color=065f46&bold=true`;
};

const switchEntite = async (entite) => {
  try {
    const token = localStorage.getItem("auth_token");
    const config = useRuntimeConfig();

    const response = await $fetch(`${config.public.apiBase}/auth/switch-profile`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: { entite_user_id: entite.entite_user_id },
    });

    if (response.success) {
      if (response.entite_user) localStorage.setItem("entite_user", JSON.stringify(response.entite_user));
      
      const targetEntite = response.main_entite || entite;
      localStorage.setItem("selected_entite", JSON.stringify(targetEntite));
      
      localStorage.setItem("role", response.role);
      localStorage.setItem("permissions", JSON.stringify(response.permissions));

      if (response.directeur_entite_user_id) {
        localStorage.setItem("directeur_entite_user_id", String(response.directeur_entite_user_id));
      } else {
        localStorage.removeItem("directeur_entite_user_id");
      }

      // Rechargement complet pour réinitialiser les permissions globales
      window.location.href = "/";
    }
  } catch (error) {
    console.error("❌ Erreur lors du changement d'entité:", error);
  } finally {
    showModal.value = false;
  }
};

const logout = () => {
  if (process.client) {
    localStorage.clear();
    navigateTo("/connexion");
  }
};

const handleClickOutside = (event) => {
  if (!event.target.closest(".relative")) {
    showNotifications.value = false;
    showUserMenu.value = false;
  }
};

onMounted(() => {
  if (process.client) {
    const savedUser = localStorage.getItem("user");
    const saved_selected_entite = localStorage.getItem("selected_entite");
    const saved_entites = localStorage.getItem("entites");

    if (savedUser) user.value = JSON.parse(savedUser);
    if (saved_selected_entite) selected_entite.value = JSON.parse(saved_selected_entite);
    if (saved_entites) entites.value = JSON.parse(saved_entites);

    document.addEventListener("click", handleClickOutside);
    demarrerPolling();
  }
});

onUnmounted(() => {
  if (process.client) {
    document.removeEventListener("click", handleClickOutside);
    arreterPolling();
  }
});
</script>