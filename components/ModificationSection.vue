<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Modification</h1>
        <p class="text-gray-600">Modify your settings and preferences</p>
      </div>

      <!-- Modification Form -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <!-- Form Header -->
        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 class="text-lg font-semibold text-gray-900">Edit Information</h2>
        </div>

        <!-- Form Body -->
        <div class="p-6 space-y-6">
          <!-- Profile Section -->
          <div class="flex items-center space-x-4 pb-6 border-b border-gray-200">
            <div class="relative">
              <img
                class="h-16 w-16 rounded-full object-cover"
                src="https://picsum.photos/seed/rosslopez/150/150.jpg"
                alt="Profile"
              />
              <button class="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700 transition-colors">
                <Icon name="heroicons:camera" class="h-3 w-3" />
              </button>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Ross C. Lopez</h3>
              <p class="text-sm text-gray-500">Administrator</p>
              <button class="mt-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
                Change Photo
              </button>
            </div>
          </div>

          <!-- Form Fields -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- First Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                value="Ross"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <!-- Last Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value="C. Lopez"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value="ross.lopez@example.com"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <!-- Phone -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value="+1 234 567 8900"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <!-- Department -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Administration</option>
                <option>Engineering</option>
                <option>Marketing</option>
                <option>Sales</option>
              </select>
            </div>

            <!-- Role -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Administrator</option>
                <option>Manager</option>
                <option>User</option>
                <option>Guest</option>
              </select>
            </div>
          </div>

          <!-- Bio -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tell us about yourself..."
            ></textarea>
          </div>

          <!-- Preferences -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900">Preferences</h3>
            
            <!-- Email Notifications -->
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900">Email Notifications</p>
                <p class="text-sm text-gray-500">Receive email updates about your account</p>
              </div>
              <button class="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6"></span>
              </button>
            </div>

            <!-- Two-Factor Authentication -->
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900">Two-Factor Authentication</p>
                <p class="text-sm text-gray-500">Add an extra layer of security to your account</p>
              </div>
              <button class="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors">
                <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1"></span>
              </button>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <button class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Component logic here
</script>
