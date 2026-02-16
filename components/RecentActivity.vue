<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Recent Activity</h3>
      <button class="text-sm text-blue-600 hover:text-blue-800 font-medium">
        View all
      </button>
    </div>
    
    <div class="space-y-4">
      <div
        v-for="activity in activities"
        :key="activity.id"
        class="flex items-start space-x-3"
      >
        <div class="flex-shrink-0">
          <div
            :class="[
              'w-10 h-10 rounded-full flex items-center justify-center',
              getActivityColor(activity.type)
            ]"
          >
            <Icon :name="getActivityIcon(activity.type)" class="h-5 w-5 text-white" />
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm text-gray-900">
            <span class="font-medium">{{ activity.user }}</span>
            {{ activity.action }}
          </p>
          <p class="text-xs text-gray-500 mt-1">{{ activity.time }}</p>
        </div>
        <div class="flex-shrink-0">
          <span
            :class="[
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              getStatusColor(activity.status)
            ]"
          >
            {{ activity.status }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const activities = ref([
  {
    id: 1,
    user: 'John Doe',
    action: 'created a new product listing',
    time: '2 minutes ago',
    type: 'create',
    status: 'completed'
  },
  {
    id: 2,
    user: 'Sarah Johnson',
    action: 'updated user permissions',
    time: '15 minutes ago',
    type: 'update',
    status: 'completed'
  },
  {
    id: 3,
    user: 'Mike Wilson',
    action: 'deleted 5 duplicate records',
    time: '1 hour ago',
    type: 'delete',
    status: 'completed'
  },
  {
    id: 4,
    user: 'Emily Brown',
    action: 'uploaded new inventory data',
    time: '2 hours ago',
    type: 'upload',
    status: 'processing'
  },
  {
    id: 5,
    user: 'David Lee',
    action: 'generated monthly report',
    time: '3 hours ago',
    type: 'report',
    status: 'completed'
  }
])

const getActivityIcon = (type) => {
  const icons = {
    create: 'heroicons:plus-circle',
    update: 'heroicons:pencil',
    delete: 'heroicons:trash',
    upload: 'heroicons:cloud-arrow-up',
    report: 'heroicons:document-text'
  }
  return icons[type] || 'heroicons:information-circle'
}

const getActivityColor = (type) => {
  const colors = {
    create: 'bg-green-500',
    update: 'bg-blue-500',
    delete: 'bg-red-500',
    upload: 'bg-yellow-500',
    report: 'bg-purple-500'
  }
  return colors[type] || 'bg-gray-500'
}

const getStatusColor = (status) => {
  const colors = {
    completed: 'bg-green-100 text-green-800',
    processing: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
    pending: 'bg-gray-100 text-gray-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}
</script>
