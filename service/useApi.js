import axios from 'axios'

export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase || 'http://10.1.14.145:8000/api'

  const api = axios.create({
    baseURL: baseURL,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })

  // Intercepteur pour ajouter le token si nécessaire
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  return api
}