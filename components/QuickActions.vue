<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
    
    <div class="space-y-3">
      <button
        v-for="action in quickActions"
        :key="action.id"
        @click="handleAction(action)"
        class="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
      >
        <div
          :class="[
            'w-10 h-10 rounded-lg flex items-center justify-center',
            action.bgColor
          ]"
        >
          <Icon :name="action.icon" :class="['h-5 w-5', action.iconColor]" />
        </div>
        <div class="flex-1">
          <p class="text-sm font-medium text-gray-900 group-hover:text-blue-600">
            {{ action.title }}
          </p>
          <p class="text-xs text-gray-500">{{ action.description }}</p>
        </div>
        <Icon name="heroicons:chevron-right" class="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
      </button>
    </div>

    <!-- System Status -->
    <div class="mt-6 p-4 bg-gray-50 rounded-lg">
      <h4 class="text-sm font-medium text-gray-900 mb-3">System Status</h4>
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs text-gray-600">API Server</span>
          <div class="flex items-center">
            <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span class="text-xs text-green-600">Online</span>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-xs text-gray-600">Database</span>
          <div class="flex items-center">
            <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span class="text-xs text-green-600">Connected</span>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-xs text-gray-600">Storage</span>
          <div class="flex items-center">
            <div class="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
            <span class="text-xs text-yellow-600">78% used</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const quickActions = ref([
  {
    id: 1,
    title: 'Add New User',
    description: 'Create a new user account',
    icon: 'heroicons:user-plus',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    action: 'addUser'
  },
  {
    id: 2,
    title: 'Create Product',
    description: 'Add a new product to inventory',
    icon: 'heroicons:plus-circle',
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
    action: 'createProduct'
  },
  {
    id: 3,
    title: 'Generate Report',
    description: 'Create analytics report',
    icon: 'heroicons:chart-bar',
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
    action: 'generateReport'
  },
  {
    id: 4,
    title: 'Send Notification',
    description: 'Broadcast system notification',
    icon: 'heroicons:bell',
    bgColor: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    action: 'sendNotification'
  }
])

const handleAction = (action) => {
  console.log(`Executing action: ${action.action}`)
  // Here you would implement the actual action logic
  // For example, open a modal, navigate to a page, etc.
  
  // Show a toast notification
  const toast = useToast()
  toast.add({
    title: 'Action Triggered',
    description: `${action.title} action has been initiated`,
    timeout: 1500
  })
}
</script>
