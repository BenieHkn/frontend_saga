<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
      <div class="flex space-x-2">
        <button
          v-for="period in periods"
          :key="period"
          @click="selectedPeriod = period"
          :class="[
            'px-3 py-1 text-sm rounded-md transition-colors',
            selectedPeriod === period
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          {{ period }}
        </button>
      </div>
    </div>
    
    <div class="relative h-64">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Line, Doughnut } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'line',
    validator: (value) => ['line', 'doughnut'].includes(value)
  }
})

const chartCanvas = ref(null)
const selectedPeriod = ref('Week')
const periods = ['Day', 'Week', 'Month', 'Year']

const lineChartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Revenue',
      data: [3200, 4500, 3800, 5100, 4700, 5500, 4900],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true
    },
    {
      label: 'Costs',
      data: [2100, 2800, 2400, 3200, 2900, 3400, 3100],
      borderColor: 'rgb(239, 68, 68)',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      tension: 0.4,
      fill: true
    }
  ]
}

const doughnutChartData = {
  labels: ['Electronics', 'Clothing', 'Food', 'Books', 'Other'],
  datasets: [
    {
      data: [35, 25, 20, 15, 5],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(156, 163, 175, 0.8)'
      ],
      borderWidth: 0
    }
  ]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: props.type === 'doughnut' ? 'bottom' : 'top',
      labels: {
        usePointStyle: true,
        padding: 15
      }
    }
  },
  scales: props.type === 'line' ? {
    y: {
      beginAtZero: true,
      grid: {
        drawBorder: false
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  } : {}
}

let chart = null

onMounted(() => {
  if (chartCanvas.value) {
    const ctx = chartCanvas.value.getContext('2d')
    const data = props.type === 'line' ? lineChartData : doughnutChartData
    
    chart = new ChartJS(ctx, {
      type: props.type,
      data: data,
      options: chartOptions
    })
  }
})

watch(selectedPeriod, () => {
  // Update chart data based on selected period
  if (chart) {
    // This would typically fetch new data based on the period
    chart.update()
  }
})
</script>
