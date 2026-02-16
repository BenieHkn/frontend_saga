<template>
  <div class="min-h-screen bg-gray-50">
    <Header />
    
    <div class="flex pt-16">
      <Sidebar />
      
      <main class="flex-1 p-6 transition-all duration-300" :class="{ 'lg:ml-64': desktopSidebarOpen }">
        <div class="max-w-4xl mx-auto">
          <!-- Page Title -->
          <div class="mb-6">
            <h1 class="text-3xl font-bold text-gray-900">Settings</h1>
            <p class="text-gray-600 mt-1">Manage your application settings and preferences</p>
          </div>

          <!-- Settings Tabs -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <!-- Tab Navigation -->
            <div class="border-b border-gray-200">
              <nav class="flex -mb-px">
                <button
                  v-for="tab in tabs"
                  :key="tab.id"
                  @click="activeTab = tab.id"
                  :class="[
                    'px-6 py-3 text-sm font-medium border-b-2 transition-colors',
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  ]"
                >
                  <Icon :name="tab.icon" class="h-4 w-4 mr-2" />
                  {{ tab.name }}
                </button>
              </nav>
            </div>

            <!-- Tab Content -->
            <div class="p-6">
              <!-- General Settings -->
              <div v-if="activeTab === 'general'" class="space-y-6">
                <div>
                  <h3 class="text-lg font-medium text-gray-900 mb-4">Application Settings</h3>
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Application Name</label>
                      <input
                        type="text"
                        v-model="settings.appName"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Default Language</label>
                      <select
                        v-model="settings.defaultLanguage"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="en">English</option>
                        <option value="fr">Français</option>
                        <option value="es">Español</option>
                      </select>
                    </div>
                    <div>
                      <label class="flex items-center">
                        <input
                          type="checkbox"
                          v-model="settings.maintenanceMode"
                          class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span class="ml-2 text-sm text-gray-700">Enable Maintenance Mode</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Security Settings -->
              <div v-if="activeTab === 'security'" class="space-y-6">
                <div>
                  <h3 class="text-lg font-medium text-gray-900 mb-4">Security Configuration</h3>
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
                      <input
                        type="number"
                        v-model="settings.sessionTimeout"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label class="flex items-center">
                        <input
                          type="checkbox"
                          v-model="settings.twoFactorAuth"
                          class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span class="ml-2 text-sm text-gray-700">Enable Two-Factor Authentication</span>
                      </label>
                    </div>
                    <div>
                      <label class="flex items-center">
                        <input
                          type="checkbox"
                          v-model="settings.passwordPolicy"
                          class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span class="ml-2 text-sm text-gray-700">Enforce Strong Password Policy</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Notification Settings -->
              <div v-if="activeTab === 'notifications'" class="space-y-6">
                <div>
                  <h3 class="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
                  <div class="space-y-4">
                    <div>
                      <label class="flex items-center">
                        <input
                          type="checkbox"
                          v-model="settings.emailNotifications"
                          class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span class="ml-2 text-sm text-gray-700">Email Notifications</span>
                      </label>
                    </div>
                    <div>
                      <label class="flex items-center">
                        <input
                          type="checkbox"
                          v-model="settings.pushNotifications"
                          class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span class="ml-2 text-sm text-gray-700">Push Notifications</span>
                      </label>
                    </div>
                    <div>
                      <label class="flex items-center">
                        <input
                          type="checkbox"
                          v-model="settings.smsNotifications"
                          class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span class="ml-2 text-sm text-gray-700">SMS Notifications</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- API Settings -->
              <div v-if="activeTab === 'api'" class="space-y-6">
                <div>
                  <h3 class="text-lg font-medium text-gray-900 mb-4">API Configuration</h3>
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">API Endpoint</label>
                      <input
                        type="url"
                        v-model="settings.apiEndpoint"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                      <div class="flex space-x-2">
                        <input
                          type="password"
                          v-model="settings.apiKey"
                          class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                          Regenerate
                        </button>
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Rate Limit (requests/minute)</label>
                      <input
                        type="number"
                        v-model="settings.rateLimit"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-4">
              <button class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                Reset to Default
              </button>
              <button
                @click="saveSettings"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const desktopSidebarOpen = ref(true)

const handleDesktopSidebarToggle = (event) => {
  desktopSidebarOpen.value = event.detail.isOpen
}

onMounted(() => {
  window.addEventListener('desktop-sidebar-toggle', handleDesktopSidebarToggle)
})

onUnmounted(() => {
  window.removeEventListener('desktop-sidebar-toggle', handleDesktopSidebarToggle)
})

const activeTab = ref('general')

const tabs = [
  { id: 'general', name: 'General', icon: 'heroicons:cog-6-tooth' },
  { id: 'security', name: 'Security', icon: 'heroicons:shield-check' },
  { id: 'notifications', name: 'Notifications', icon: 'heroicons:bell' },
  { id: 'api', name: 'API', icon: 'heroicons:server' },
  { id: 'desktop-sidebar-toggle', name: 'Desktop Sidebar Toggle', icon: 'heroicons:menu-alt-2' }
]

const settings = ref({
  appName: 'Sagar Revolution',
  defaultLanguage: 'en',
  maintenanceMode: false,
  sessionTimeout: 30,
  twoFactorAuth: false,
  passwordPolicy: true,
  emailNotifications: true,
  pushNotifications: false,
  smsNotifications: false,
  apiEndpoint: 'https://api.example.com',
  apiKey: 'sk-1234567890abcdef',
  rateLimit: 100
})

const saveSettings = () => {
  // Save settings logic here
  console.log('Saving settings:', settings.value)
  
  // Show success message
  const toast = useToast()
  toast.add({
    title: 'Settings Saved',
    description: 'Your settings have been successfully updated',
    timeout: 1500
  })
}

useHead({
  title: 'Settings - Sagar Revolution'
})
</script>
