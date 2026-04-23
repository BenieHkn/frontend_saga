<template>
  <div class="min-h-screen bg-gray-50">
    <Header />

    <div class="flex pt-16">
      <Sidebar />

      <main class="flex-1 p-6 transition-all duration-300" :class="{ 'lg:ml-64': desktopSidebarOpen }">
        <div class="max-w-4xl mx-auto">
          <!-- Page Title -->
          <div class="mb-6">
            <h1 class="text-3xl font-bold text-gray-900">Profile</h1>
            <p class="text-gray-600 mt-1">Manage your personal information and preferences</p>
          </div>

          <!-- Profile Card -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div class="flex items-center space-x-6">
              <div class="relative">
                <img class="h-24 w-24 rounded-full" src="https://picsum.photos/seed/user1/200/200.jpg" alt="Profile" />
                <button
                  class="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                  <Icon name="heroicons:pencil" class="h-4 w-4" />
                </button>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-gray-900">John Doe</h2>
                <p class="text-gray-600">john.doe@example.com</p>
                <div class="flex items-center mt-2 space-x-4">
                  <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                  <span class="text-sm text-gray-500">Member since January 2024</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Profile Information -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Personal Information -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input type="text" v-model="profile.firstName"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input type="text" v-model="profile.lastName"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" v-model="profile.email"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="tel" v-model="profile.phone"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>

            <!-- Preferences -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <select v-model="profile.language"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                    <option value="es">Español</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                  <select v-model="profile.timezone"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="UTC">UTC</option>
                    <option value="EST">Eastern Time</option>
                    <option value="PST">Pacific Time</option>
                  </select>
                </div>
                <div>
                  <label class="flex items-center">
                    <input type="checkbox" v-model="profile.emailNotifications"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span class="ml-2 text-sm text-gray-700">Email notifications</span>
                  </label>
                </div>
                <div>
                  <label class="flex items-center">
                    <input type="checkbox" v-model="profile.pushNotifications"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span class="ml-2 text-sm text-gray-700">Push notifications</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="mt-6 flex justify-end space-x-4">
            <button
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button @click="saveProfile"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Save Changes
            </button>
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

const profile = ref({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  language: 'en',
  timezone: 'EST',
  emailNotifications: true,
  pushNotifications: false
})

const saveProfile = () => {
  // Save profile logic here
  console.log('Saving profile:', profile.value)

  // Show success message
  const toast = useToast()
  toast.add({
    title: 'Profile Updated',
    description: 'Your profile has been successfully updated',
    timeout: 3000
  })
}

useHead({
  title: 'Profile - SAGA '
})
</script>
