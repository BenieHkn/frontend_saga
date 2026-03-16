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
                        <Icon :name="n.type === 'affectation' ? 'heroicons:clipboard-document' : 'heroicons:arrows-right-left'" class="h-4 w-4" />
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
                  <p class="text-sm font-bold text-emerald-700 truncate">{{ selected_entite?.libelle }}</p>
                  <p v-if="currentEntiteUser?.is_responsable" class="text-xs text-emerald-600 mt-1">{{ selected_entite?.fonction }}</p>
                  <p v-else class="text-xs text-emerald-500 mt-1">Agent</p>
                  <div class="flex gap-1 mt-2">
                    <span v-if="currentEntiteUser?.is_interim" class="text-[10px] bg-amber-600 text-white px-2 py-0.5 rounded-full">Intérim</span>
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
                          <p class="text-xs text-emerald-600 font-medium">{{ entite.is_responsable ? (entite.fonction ?? '—') : 'Agent' }} - {{ entite.code }}</p>
                          <div class="flex gap-1 mt-2">
                            <span v-if="entite.is_responsable" class="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full">Responsable</span>
                            <span v-if="entite.is_interim" class="text-[10px] bg-amber-600 text-white px-2 py-0.5 rounded-full">Intérim</span>
                          </div>
                        </div>
                      </div>
                      <div class="mt-6 flex justify-end">
                        <UButton label="Fermer" color="gray" variant="ghost" @click="showModal = false" />
                      </div>
                    </div>
                  </UModal>
                </div>

                <!-- Changer mot de passe -->
                <button @click="openChangePassword"
                  class="flex items-center space-x-3 w-full p-3 rounded-xl hover:bg-blue-50 text-blue-600 transition-all font-bold text-sm">
                  <Icon name="heroicons:key" class="h-5 w-5" />
                  <span>Mot de passe</span>
                </button>

                <!-- Déconnexion -->
                <button @click="confirmLogout"
                  class="flex items-center space-x-3 w-full p-3 rounded-xl hover:bg-red-50 text-red-500 transition-all font-bold text-sm mt-1">
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

  <!-- ===== Modal : Changer mot de passe ===== -->
  <UModal v-model="showChangePasswordModal" :prevent-close="passwordLoading">
    <div class="p-6 w-full">
      <div class="flex items-center gap-3 mb-6">
        <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center">
          <Icon name="heroicons:key" class="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 class="text-base font-bold text-slate-800">Changer le mot de passe</h2>
          <p class="text-xs text-slate-500">Minimum 8 caractères</p>
        </div>
      </div>

      <!-- Erreur backend globale -->
      <div v-if="passwordError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
        <Icon name="heroicons:exclamation-circle" class="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
        <p class="text-xs text-red-600 font-medium">{{ passwordError }}</p>
      </div>
      <!-- Succès -->
      <div v-if="passwordSuccess" class="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2">
        <Icon name="heroicons:check-circle" class="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
        <p class="text-xs text-emerald-600 font-medium">{{ passwordSuccess }}</p>
      </div>

      <div class="space-y-4">

        <!-- Mot de passe actuel -->
        <div>
          <label class="block text-xs font-bold text-slate-600 mb-1.5">Mot de passe actuel</label>
          <div class="relative">
            <input
              v-model="passwordForm.current_password"
              :type="showCurrentPwd ? 'text' : 'password'"
              placeholder="••••••••"
              @input="onFieldInput('current_password')"
              @blur="onFieldBlur('current_password')"
              class="w-full px-4 py-2.5 pr-10 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all"
              :class="passwordFieldErrors.current_password
                ? 'border-red-300 focus:ring-red-200 bg-red-50/30'
                : touched.current_password && passwordForm.current_password
                  ? 'border-emerald-400 focus:ring-emerald-200'
                  : 'border-slate-200 focus:ring-emerald-200 focus:border-emerald-400'"
            />
            <button type="button" @click="showCurrentPwd = !showCurrentPwd"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <Icon :name="showCurrentPwd ? 'heroicons:eye-slash' : 'heroicons:eye'" class="h-4 w-4" />
            </button>
          </div>
          <p v-if="passwordFieldErrors.current_password" class="text-[11px] text-red-500 mt-1 flex items-center gap-1">
            <Icon name="heroicons:exclamation-circle" class="h-3 w-3" />
            {{ passwordFieldErrors.current_password[0] }}
          </p>
        </div>

        <!-- Nouveau mot de passe -->
        <div>
          <label class="block text-xs font-bold text-slate-600 mb-1.5">Nouveau mot de passe</label>
          <div class="relative">
            <input
              v-model="passwordForm.password"
              :type="showNewPwd ? 'text' : 'password'"
              placeholder="••••••••"
              @input="onFieldInput('password')"
              @blur="onFieldBlur('password')"
              class="w-full px-4 py-2.5 pr-10 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all"
              :class="passwordFieldErrors.password
                ? 'border-red-300 focus:ring-red-200 bg-red-50/30'
                : touched.password && passwordForm.password && !passwordFieldErrors.password
                  ? 'border-emerald-400 focus:ring-emerald-200'
                  : 'border-slate-200 focus:ring-emerald-200 focus:border-emerald-400'"
            />
            <button type="button" @click="showNewPwd = !showNewPwd"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <Icon :name="showNewPwd ? 'heroicons:eye-slash' : 'heroicons:eye'" class="h-4 w-4" />
            </button>
          </div>
          <!-- Barre de force -->
          <div v-if="touched.password && passwordForm.password" class="mt-2 flex gap-1">
            <div v-for="i in 4" :key="i"
              class="h-1 flex-1 rounded-full transition-all duration-300"
              :class="i <= passwordStrength ? strengthBarColor : 'bg-slate-200'" />
          </div>
          <p v-if="touched.password && passwordForm.password && !passwordFieldErrors.password"
            class="text-[11px] mt-1 font-medium" :class="strengthTextColor">
            Force : {{ strengthLabel }}
          </p>
          <p v-if="passwordFieldErrors.password" class="text-[11px] text-red-500 mt-1 flex items-center gap-1">
            <Icon name="heroicons:exclamation-circle" class="h-3 w-3" />
            {{ passwordFieldErrors.password[0] }}
          </p>
        </div>

        <!-- Confirmer mot de passe -->
        <div>
          <label class="block text-xs font-bold text-slate-600 mb-1.5">Confirmer le nouveau mot de passe</label>
          <div class="relative">
            <input
              v-model="passwordForm.password_confirmation"
              :type="showConfirmPwd ? 'text' : 'password'"
              placeholder="••••••••"
              @input="onFieldInput('password_confirmation')"
              @blur="onFieldBlur('password_confirmation')"
              class="w-full px-4 py-2.5 pr-10 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all"
              :class="passwordFieldErrors.password_confirmation
                ? 'border-red-300 focus:ring-red-200 bg-red-50/30'
                : touched.password_confirmation && passwordForm.password_confirmation && !passwordFieldErrors.password_confirmation
                  ? 'border-emerald-400 focus:ring-emerald-200'
                  : 'border-slate-200 focus:ring-emerald-200 focus:border-emerald-400'"
            />
            <button type="button" @click="showConfirmPwd = !showConfirmPwd"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <Icon :name="showConfirmPwd ? 'heroicons:eye-slash' : 'heroicons:eye'" class="h-4 w-4" />
            </button>
          </div>
          <!-- Correspondance -->
          <p v-if="touched.password_confirmation && passwordForm.password_confirmation && !passwordFieldErrors.password_confirmation"
            class="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
            <Icon name="heroicons:check-circle" class="h-3 w-3" />
            Les mots de passe correspondent
          </p>
          <p v-if="passwordFieldErrors.password_confirmation" class="text-[11px] text-red-500 mt-1 flex items-center gap-1">
            <Icon name="heroicons:exclamation-circle" class="h-3 w-3" />
            {{ passwordFieldErrors.password_confirmation[0] }}
          </p>
        </div>
      </div>

      <div class="mt-6 flex justify-end gap-2">
        <button @click="closeChangePassword" :disabled="passwordLoading"
          class="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-all disabled:opacity-50">
          Annuler
        </button>
        <button @click="submitChangePassword" :disabled="passwordLoading"
          class="px-5 py-2 text-sm font-bold text-white bg-gradient-to-br from-emerald-600 to-blue-600 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2">
          <Icon v-if="passwordLoading" name="heroicons:arrow-path" class="h-4 w-4 animate-spin" />
          <span>{{ passwordLoading ? 'Enregistrement...' : 'Enregistrer' }}</span>
        </button>
      </div>
    </div>
  </UModal>

  <!-- ===== Modal : Confirmation déconnexion ===== -->
  <UModal v-model="showLogoutModal">
    <div class="p-6 text-center">
      <div class="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
        <Icon name="heroicons:power" class="h-7 w-7 text-red-500" />
      </div>
      <h2 class="text-base font-bold text-slate-800 mb-1">Déconnexion</h2>
      <p class="text-sm text-slate-500 mb-6">Êtes-vous sûr de vouloir vous déconnecter ?</p>
      <div class="flex justify-center gap-3">
        <button @click="showLogoutModal = false"
          class="px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
          Annuler
        </button>
        <button @click="logout"
          class="px-5 py-2 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all">
          Se déconnecter
        </button>
      </div>
    </div>
  </UModal>
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

// ---- Logout confirmation ----
const showLogoutModal = ref(false);

const confirmLogout = () => {
  showUserMenu.value = false;
  showLogoutModal.value = true;
};

// ---- Change password ----
const showChangePasswordModal = ref(false);
const passwordLoading = ref(false);
const passwordError = ref('');
const passwordSuccess = ref('');
const passwordFieldErrors = ref({});
const showCurrentPwd = ref(false);
const showNewPwd = ref(false);
const showConfirmPwd = ref(false);

const passwordForm = ref({
  current_password: '',
  password: '',
  password_confirmation: '',
});

// Tracks which fields the user has interacted with
const touched = ref({
  current_password: false,
  password: false,
  password_confirmation: false,
});

// ---- Password strength ----
const passwordStrength = computed(() => {
  const p = passwordForm.value.password;
  if (!p || p.length < 8) return p.length > 0 ? 1 : 0;
  let score = 1;
  if (p.length >= 12) score++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++;
  if (/[0-9]/.test(p) && /[^A-Za-z0-9]/.test(p)) score++;
  return score;
});

const strengthBarColor = computed(() => {
  return ['', 'bg-red-400', 'bg-amber-400', 'bg-blue-400', 'bg-emerald-500'][passwordStrength.value] || 'bg-red-400';
});

const strengthTextColor = computed(() => {
  return ['', 'text-red-500', 'text-amber-500', 'text-blue-500', 'text-emerald-600'][passwordStrength.value] || 'text-red-500';
});

const strengthLabel = computed(() => {
  return ['', 'Faible', 'Moyen', 'Bon', 'Fort'][passwordStrength.value] || '';
});

// ---- Live field validation ----
const validateField = (field) => {
  const f = passwordForm.value;
  const e = { ...passwordFieldErrors.value };

  if (field === 'current_password') {
    if (!f.current_password) {
      e.current_password = ['Le mot de passe actuel est requis'];
    } else {
      delete e.current_password;
    }
  }

  if (field === 'password') {
    if (!f.password) {
      e.password = ['Le nouveau mot de passe est requis'];
    } else if (f.password.length < 8) {
      e.password = ['Le mot de passe doit contenir au moins 8 caractères'];
    } else {
      delete e.password;
    }
    // Re-check confirmation live if already touched
    if (touched.value.password_confirmation && f.password_confirmation) {
      if (f.password !== f.password_confirmation) {
        e.password_confirmation = ['La confirmation ne correspond pas au nouveau mot de passe'];
      } else {
        delete e.password_confirmation;
      }
    }
  }

  if (field === 'password_confirmation') {
    if (!f.password_confirmation) {
      e.password_confirmation = ['La confirmation du mot de passe est requise'];
    } else if (f.password && f.password !== f.password_confirmation) {
      e.password_confirmation = ['La confirmation ne correspond pas au nouveau mot de passe'];
    } else {
      delete e.password_confirmation;
    }
  }

  passwordFieldErrors.value = e;
};

const onFieldInput = (field) => {
  touched.value[field] = true;
  validateField(field);
  // Clear global backend error when user starts correcting
  if (passwordError.value) passwordError.value = '';
};

const onFieldBlur = (field) => {
  touched.value[field] = true;
  validateField(field);
};

const openChangePassword = () => {
  showUserMenu.value = false;
  passwordError.value = '';
  passwordSuccess.value = '';
  passwordFieldErrors.value = {};
  touched.value = { current_password: false, password: false, password_confirmation: false };
  passwordForm.value = { current_password: '', password: '', password_confirmation: '' };
  showCurrentPwd.value = false;
  showNewPwd.value = false;
  showConfirmPwd.value = false;
  showChangePasswordModal.value = true;
};

const closeChangePassword = () => {
  showChangePasswordModal.value = false;
};

const submitChangePassword = async () => {
  passwordError.value = '';
  passwordSuccess.value = '';

  // Force touch + validate all fields before submit
  touched.value = { current_password: true, password: true, password_confirmation: true };
  validateField('current_password');
  validateField('password');
  validateField('password_confirmation');

  if (Object.keys(passwordFieldErrors.value).length > 0) return;

  passwordLoading.value = true;

  try {
    const token = localStorage.getItem('auth_token');
    const config = useRuntimeConfig();

    const response = await $fetch(`${config.public.apiBase}/change-password`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        current_password: passwordForm.value.current_password,
        password: passwordForm.value.password,
        password_confirmation: passwordForm.value.password_confirmation,
      },
    });

    if (response.success) {
      passwordSuccess.value = response.message || 'Mot de passe changé avec succès';
      // setTimeout(() => { showChangePasswordModal.value = false; }, 1500);
      // Déconnecter l'utilisateur après changement de mot de passe pour forcer la reconnexion avec le nouveau mot de passe
      setTimeout(() => {
        logout();
      }, 2000);
    }
  } catch (err) {
    const data = err?.data || err?.response?._data;
    if (data?.errors) {
      const mapped = {};
      for (const [key, val] of Object.entries(data.errors)) {
        mapped[key] = Array.isArray(val) ? val : [val];
      }
      passwordFieldErrors.value = mapped;
    }
    passwordError.value = data?.message || 'Une erreur est survenue';
  } finally {
    passwordLoading.value = false;
  }
};

// ---- Notifications ----
const { notifications, nonLues, marquerLu, toutLire, demarrerPolling, arreterPolling } = useNotifications();

const ouvrirNotification = async (notif) => {
  if (!notif.lu) await marquerLu(notif.id);
  showNotifications.value = false;
  navigateTo('/documents');
};

// ---- Computed ----
const currentEntiteUser = computed(() => {
  if (!selected_entite.value || !entites.value) return null;
  return entites.value.find(e => e.id === selected_entite.value.id) || null;
});

const otherEntites = computed(() => {
  if (!entites.value) return [];
  if (!selected_entite.value) return entites.value.filter(e => e.actif);
  return entites.value.filter((e) => e.id !== selected_entite.value.id && e.actif);
});

// ---- Toggles ----
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

// ---- Helpers ----
const getInitials = (nom, prenom) => {
  const name = `${prenom || ''} ${nom || ''}`.trim() || 'User';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ffffff&color=065f46&bold=true`;
};

// ---- Switch entité ----
const switchEntite = async (entite) => {
  try {
    const token = localStorage.getItem('auth_token');
    const config = useRuntimeConfig();

    const response = await $fetch(`${config.public.apiBase}/auth/switch-profile`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: { entite_user_id: entite.entite_user_id },
    });

    if (response.success) {
      if (response.entite_user) localStorage.setItem('entite_user', JSON.stringify(response.entite_user));
      const targetEntite = response.main_entite || entite;
      localStorage.setItem('selected_entite', JSON.stringify(targetEntite));
      localStorage.setItem('role', response.role);

      // ✅ AJOUT
      if (response.roles && response.roles.length > 0) {
        localStorage.setItem('roles', JSON.stringify(response.roles));
      }

      localStorage.setItem('permissions', JSON.stringify(response.permissions));
      if (response.directeur_entite_user_id) {
        localStorage.setItem('directeur_entite_user_id', String(response.directeur_entite_user_id));
      } else {
        localStorage.removeItem('directeur_entite_user_id');
      }

      // ✅ AJOUT : mettre à jour main_entite aussi
      if (response.main_entite) {
        localStorage.setItem('main_entite', JSON.stringify(response.main_entite));
      }

      window.location.href = '/dashboard';
    }
  } catch (error) {
    console.error('❌ Erreur lors du changement d\'entité:', error);
  } finally {
    showModal.value = false;
  }
};

// ---- Logout ----
const logout = () => {
  if (process.client) {
    localStorage.clear();
    navigateTo('/connexion');
  }
};

// ---- Click outside ----
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showNotifications.value = false;
    showUserMenu.value = false;
  }
};

onMounted(() => {
  if (process.client) {
    const savedUser = localStorage.getItem('user');
    const saved_selected_entite = localStorage.getItem('selected_entite');
    const saved_entites = localStorage.getItem('entites');
    if (savedUser) user.value = JSON.parse(savedUser);
    if (saved_selected_entite) selected_entite.value = JSON.parse(saved_selected_entite);
    if (saved_entites) entites.value = JSON.parse(saved_entites);
    document.addEventListener('click', handleClickOutside);
    demarrerPolling();
  }
});

onUnmounted(() => {
  if (process.client) {
    document.removeEventListener('click', handleClickOutside);
    arreterPolling();
  }
});
</script>