import { ref } from 'vue';
import { b as useRuntimeConfig } from './server.mjs';

function useApi(endpoint, options = {}) {
  const {
    baseUrl = useRuntimeConfig().public.apiBase,
    transform = null,
    immediate = false,
    onError = null,
    onSuccess = null,
    headers: extraHeaders = {},
    method = "GET",
    body = null,
    autoReset = false
  } = options;
  const data = ref(method === "GET" ? [] : null);
  const loading = ref(false);
  const error = ref(null);
  const response = ref(null);
  const execute = async (customBody = null, customMethod = null) => {
    {
      error.value = "Token d'authentification manquant. Veuillez vous connecter.";
      if (typeof onError === "function") onError(error.value);
      return null;
    }
  };
  const reset = () => {
    data.value = method === "GET" ? [] : null;
    loading.value = false;
    error.value = null;
    response.value = null;
  };
  return {
    data,
    loading,
    error,
    response,
    // Nouveau: la réponse complète
    execute,
    fetchData: method === "GET" ? execute : void 0,
    // Alias pour GET
    refresh: method === "GET" ? execute : void 0,
    // Alias pour GET
    reset,
    // Méthodes utilitaires (optionnelles)
    post: (postBody) => execute(postBody, "POST"),
    put: (putBody) => execute(putBody, "PUT"),
    patch: (patchBody) => execute(patchBody, "PATCH"),
    delete: () => execute(null, "DELETE")
  };
}

export { useApi as u };
//# sourceMappingURL=useApi-J_uhScde.mjs.map
