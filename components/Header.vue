<template>
  <header class="fixed w-full top-0 z-[100] bg-white">
    <div class="px-4 sm:px-6 lg:px-5">
      <div class="flex justify-between items-center h-20">
        <div class="flex items-left space-x-2">
          <div class="flex items-center group cursor-pointer">
            <div
              class="relative p-0.5 bg-white/20 rounded-xl mr-2 backdrop-blur-sm border border-white/30 transform group-hover:scale-105 transition-transform">
              <div class="bg-white rounded-lg p-0">
                <img src="/images/logo2.png" alt="Logo SAGA" class="h-20 w-20 object-contain" />
              </div>
            </div>

            <div class="flex flex-col leading-tight">
              <h1 class="text-sm tracking-tighter text-blue-800">
                <span class="font-black">SAGA</span>
                <span class="text-emerald-400 font-light mx-1">|</span>
                REVOLUTION
              </h1>
            </div>
          </div>
        </div>

        <div class="flex items-center space-x-5">
          <!-- Notifications -->
          <div class="relative">
            <button @click="toggleNotifications" type="button"
              class="p-2.5 rounded-xl bg-gradient-to-br from-emerald-700 to-blue-700 text-white hover:bg-gray-400 transition-all border focus:outline-none">
              <Icon name="heroicons:bell" class="h-5 w-5" />
              <span class="absolute top-2.5 right-2.5 flex h-2 w-2">
                <span
                  class="relative inline-flex rounded-full h-2 w-2 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]"></span>
              </span>
            </button>

            <div v-if="showNotifications"
              class="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-[110] overflow-hidden">
              <div class="p-4 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest">
                Notifications
              </div>
              <div class="max-h-64 overflow-y-auto">
                <div v-for="n in notifications" :key="n.id"
                  class="p-4 border-b border-slate-50 hover:bg-slate-50 text-slate-700">
                  {{ n.message }}
                </div>
              </div>
            </div>
          </div>

          <!-- User Menu -->
          <div class="relative">
            <button @click="toggleUserMenu" type="button"
              class="flex items-center pl-1 pr-3 py-1 bg-gradient-to-br from-emerald-700 to-blue-700 rounded-2xl hover:bg-white/15 transition-all focus:outline-none">
              <div class="p-0.5 rounded-xl">
                <img class="h-9 w-9 rounded-[10px] object-cover bg-white" :src="getInitials(user?.nom, user?.prenom)"
                  alt="User" />
              </div>
              <div class="hidden md:block ml-3 text-left mr-2">
                <p class="text-xs font-bold text-white leading-none uppercase">
                  {{ user?.prenom }}
                </p>
                <p class="text-[10px] text-emerald-300 font-bold mt-1 uppercase tracking-tighter">
                  <span v-if="user?.is_superadmin">Administrateur</span>
                  <span v-else>{{ selected_entite?.code }}</span>
                </p>
              </div>
              <Icon name="heroicons:chevron-down-20-solid" class="h-4 w-4 text-white/50" />
            </button>

            <!-- Menu dropdown -->
            <div v-if="showUserMenu"
              class="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 z-[110] p-2">
              <!-- Entité actuelle -->
              <div v-if="selected_entite" class="px-4 py-2 border-b border-slate-50 mb-1 bg-emerald-50 rounded-lg">
                <p class="text-sm font-bold text-emerald-700">
                  {{ selected_entite?.libelle }}
                </p>

                <!-- Affichage du rôle basé sur is_responsable dans entite_user -->
                <p v-if="currentEntiteUser?.is_responsable" class="text-xs text-emerald-600 mt-1">
                  {{ selected_entite?.fonction }}
                </p>
                <p v-else class="text-xs text-emerald-500 mt-1">
                  Agent
                </p>

                <!-- Badges optionnels -->
                <div class="flex gap-1 mt-2">
                  <!-- <span v-if="currentEntiteUser?.is_responsable"
                    class="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                    Responsable
                  </span> -->
                  <span v-if="currentEntiteUser?.is_interim"
                    class="text-[10px] bg-amber-600 text-white px-2 py-0.5 rounded-full">
                    Intérim
                  </span>
                </div>
              </div>

              <!-- Autres entités disponibles -->
              <div v-if="otherEntites.length > 0">
                <UButton @click="showModal = true"
                  class="flex items-center space-x-3 w-full p-3 rounded-xl hover:bg-emerald-50 text-emerald-700 transition-all font-bold text-sm mb-2">
                  Changer d'entité
                </UButton>

                <UModal v-model="showModal" title="Changer d'entité">
                  <div class="p-6">
                    <h2 class="text-lg font-semibold mb-4">
                      Changer d'entité
                    </h2>

                    <div class="space-y-3 grid grid-cols-1 md:grid-cols-2">
                      <div v-for="entite in otherEntites" :key="entite.id"
                        class="p-3 border border-slate-200 rounded-lg hover:bg-emerald-50 cursor-pointer"
                        @click="switchEntite(entite)">
                        <p class="font-bold text-emerald-700">
                          {{ entite.libelle }}
                        </p>
                        <p class="text-xs text-emerald-600">
                          {{ entite.code }}
                        </p>
                        <p v-if="entite.fonction" class="text-[10px] text-emerald-500 mt-1">
                          {{ entite.fonction }}
                        </p>
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
                      <UButton label="Fermer" color="gray" @click="showModal = false" />
                    </div>
                  </div>
                </UModal>
              </div>

              <!-- Bouton de déconnexion -->
              <button @click="logout"
                class="flex items-center space-x-3 w-full p-3 rounded-xl hover:bg-red-50 text-red-500 transition-all font-bold text-sm mt-2">
                <Icon name="heroicons:power" class="h-5 w-5" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <div class="h-20"></div>
</template>

<script setup>
const showNotifications = ref(false);
const showUserMenu = ref(false);
const user = ref(null);
const selected_entite = ref(null);
const entite_user = ref(null);
const entites = ref([]);
const showModal = ref(false);

const notifications = ref([
  { id: 1, message: "Bienvenue sur SAGA Revolution", time: "Maintenant" },
]);

// ✅ Computed pour récupérer l'entite_user correspondant à l'entité sélectionnée
const currentEntiteUser = computed(() => {
  if (!selected_entite.value || !entites.value) {
    return null;
  }

  // Trouver l'entite_user qui correspond à l'entité sélectionnée
  const found = entites.value.find(e => e.id === selected_entite.value.id);
  return found || null;
});

// Computed pour afficher uniquement les autres entités actives
const otherEntites = computed(() => {
  if (!selected_entite.value || !entites.value) {
    return entites.value?.filter(e => e.actif) || [];
  }

  return entites.value.filter((e) => e.id !== selected_entite.value.id && e.actif);
});

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
  showUserMenu.value = false;
};

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
  showNotifications.value = false;
};

const getInitials = (nom, prenom) => {
  const name = `${prenom || ""} ${nom || ""}`.trim() || "User";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ffffff&color=065f46`;
};

const switchEntite = (entite) => {
  // Mettre à jour selected_entite
  selected_entite.value = entite;

  // Sauvegarder dans localStorage
  if (process.client) {
    localStorage.setItem("selected_entite", JSON.stringify(entite));
  }

  // Fermer le modal et le menu
  showModal.value = false;
  showUserMenu.value = false;

  // Optionnel : rafraîchir la page ou recharger les données selon le contexte
  // window.location.reload();
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

    if (savedUser) {
      user.value = JSON.parse(savedUser);
    }

    if (saved_selected_entite) {
      selected_entite.value = JSON.parse(saved_selected_entite);
    }

    if (saved_entites) {
      entites.value = JSON.parse(saved_entites);
    }

    document.addEventListener("click", handleClickOutside);
  }
});

onUnmounted(() => {
  if (process.client) {
    document.removeEventListener("click", handleClickOutside);
  }
});
</script>