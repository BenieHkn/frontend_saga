export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

// ✅ Dehors de la fonction → singleton partagé entre tous les appelants
const toasts = ref<Toast[]>([])
let nextId = 0

export const useToast = () => {

  const add = (message: string, type: Toast['type'] = 'info', duration = 1500) => {
    const id = `toast-${nextId++}`
    const toast: Toast = { id, message, type, duration }
    
    toasts.value.push(toast)
    
    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }
    
    return id
  }

  const remove = (id: string) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return { toasts: readonly(toasts), add, remove }
}