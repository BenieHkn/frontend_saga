<template>
  <div class="toast-container">
    <transition-group name="toast" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['toast', `toast--${toast.type}`]"
      >
        {{ toast.message }}
        <button @click="remove(toast.id)" class="toast-close">×</button>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { useToast } from "../composables/useToast";

const { toasts, remove } = useToast()
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin-bottom: 8px;
  border-radius: 4px;
  background: #333;
  color: white;
  min-width: 300px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease;
}

.toast--success {
  background: #10b981;
}

.toast--error {
  background: #ef4444;
}

.toast--warning {
  background: #f59e0b;
}

.toast--info {
  background: #3b82f6;
}

.toast-close {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 20px;
  padding: 0;
  margin-left: auto;
}

.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>