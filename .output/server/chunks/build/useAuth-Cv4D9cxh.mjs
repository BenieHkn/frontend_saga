import { ref, reactive, watch } from 'vue';
import { n as navigateTo } from './server.mjs';

const useAuth = () => {
  const authError = ref("");
  const successMessage = ref("");
  const loading = ref(false);
  const form = reactive({
    email: "",
    password: ""
  });
  const rememberMe = ref(false);
  const persistSession = (response) => {
    return;
  };
  const clearSession = () => {
    return;
  };
  const getStoredToken = () => {
    return null;
  };
  const getUser = () => {
    return null;
  };
  const getEntites = () => {
    return [];
  };
  const getActiveEntiteUsers = () => {
    const today = /* @__PURE__ */ new Date();
    return getEntites().filter((eu) => {
      if (!eu) return false;
      if (!eu.actif) return false;
      if (eu.date_fin && new Date(eu.date_fin) < today) return false;
      return true;
    });
  };
  const getSelectedEntite = () => {
    return null;
  };
  const setSelectedEntiteUser = (entiteUser) => {
    return;
  };
  const isAuthenticated = () => false;
  const loadRememberedEmail = () => {
    return;
  };
  const validateForm = () => {
    var _a;
    authError.value = "";
    if (!((_a = form.email) == null ? void 0 : _a.trim())) {
      authError.value = "Veuillez entrer votre adresse email";
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      authError.value = "Veuillez entrer une adresse email valide";
      return false;
    }
    if (!form.password) {
      authError.value = "Veuillez entrer votre mot de passe";
      return false;
    }
    if (form.password.length < 6) {
      authError.value = "Le mot de passe doit contenir au moins 6 caract\xE8res";
      return false;
    }
    return true;
  };
  const enregistrerOneSignal = async (token) => {
    return;
  };
  const login = async () => {
    var _a;
    authError.value = "";
    successMessage.value = "";
    if (!validateForm()) return;
    try {
      loading.value = true;
      const response = await $fetch("api/auth/login", {
        method: "POST",
        body: {
          email: form.email.trim(),
          password: form.password
        }
      });
      if (!response.success) {
        authError.value = response.message || "Erreur lors de la connexion";
        return;
      }
      if (!response.token || !response.user) {
        throw new Error("Donn\xE9es de r\xE9ponse incompl\xE8tes");
      }
      persistSession(response);
      await enregistrerOneSignal(response.token);
      const activePostes = getActiveEntiteUsers();
      successMessage.value = "Connexion r\xE9ussie, redirection en cours...";
      await new Promise((resolve) => setTimeout(resolve, 800));
      if (activePostes.length <= 1) {
        await navigateTo("/");
        return;
      }
      await navigateTo("/choose-profile");
    } catch (error) {
      console.error("Erreur login:", error);
      if (error.status === 401) {
        authError.value = "Email ou mot de passe incorrect";
      } else if (error.status === 400) {
        authError.value = "Donn\xE9es invalides";
      } else if (error.status === 500) {
        authError.value = "Erreur serveur. Veuillez r\xE9essayer plus tard";
      } else {
        authError.value = ((_a = error.data) == null ? void 0 : _a.message) || "Erreur de connexion. Veuillez r\xE9essayer";
      }
    } finally {
      loading.value = false;
    }
  };
  const logout = async () => {
    await navigateTo("/connexion");
  };
  watch(() => form.email, () => {
    if (authError.value) authError.value = "";
  });
  watch(() => form.password, () => {
    if (authError.value) authError.value = "";
  });
  return {
    form,
    rememberMe,
    loading,
    authError,
    successMessage,
    login,
    logout,
    loadRememberedEmail,
    getStoredToken,
    getUser,
    getEntites,
    getActiveEntiteUsers,
    getSelectedEntite,
    setSelectedEntiteUser,
    isAuthenticated,
    clearSession
  };
};

export { useAuth as u };
//# sourceMappingURL=useAuth-Cv4D9cxh.mjs.map
