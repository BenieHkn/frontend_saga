<template>
  <UCard class="bg-white">
    <template #header>
      <h3 class="text-lg font-bold text-slate-900">{{ title }}</h3>
    </template>

    <div class="h-80">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </UCard>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  title: String,
  data: Array,
  type: {
    type: String,
    validator: (val) => ['courriers', 'traitement'].includes(val)
  }
})

const chartCanvas = ref(null)
let chartInstance = null

const createChart = () => {
  if (!chartCanvas.value) return

  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = chartCanvas.value.getContext('2d')

  if (props.type === 'courriers') {
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: props.data.map(d => d.semaine),
        datasets: [
          {
            label: 'Arrivés Total',
            data: props.data.map(d => d.arrives_total),
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 3,
            tension: 0.4,
            fill: true
          },
          {
            label: 'Arrivés SP',
            data: props.data.map(d => d.arrives_sp),
            borderColor: 'rgb(96, 165, 250)',
            borderWidth: 2,
            borderDash: [5, 5],
            tension: 0.4,
            fill: false
          },
          {
            label: 'Arrivés SA',
            data: props.data.map(d => d.arrives_sa),
            borderColor: 'rgb(147, 197, 253)',
            borderWidth: 2,
            borderDash: [5, 5],
            tension: 0.4,
            fill: false
          },
          {
            label: 'Départs Total',
            data: props.data.map(d => d.departs_total),
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderWidth: 3,
            tension: 0.4,
            fill: true
          },
          {
            label: 'Départs SP',
            data: props.data.map(d => d.departs_sp),
            borderColor: 'rgb(74, 222, 128)',
            borderWidth: 2,
            borderDash: [5, 5],
            tension: 0.4,
            fill: false
          },
          {
            label: 'Départs SA',
            data: props.data.map(d => d.departs_sa),
            borderColor: 'rgb(134, 239, 172)',
            borderWidth: 2,
            borderDash: [5, 5],
            tension: 0.4,
            fill: false
          }
        ]
      },
      options: chartOptions()
    })
  } else {
    // type === 'traitement' : Arrivés vs Répondus
    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: props.data.map(d => d.semaine),
        datasets: [
          {
            label: 'Arrivés',
            data: props.data.map(d => d.arrives),
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 2
          },
          {
            label: 'Répondus Total',
            data: props.data.map(d => d.traites_total),
            backgroundColor: 'rgba(16, 185, 129, 0.7)',
            borderColor: 'rgb(16, 185, 129)',
            borderWidth: 2
          },
          {
            label: 'Répondus SP',
            data: props.data.map(d => d.traites_sp),
            backgroundColor: 'rgba(52, 211, 153, 0.5)',
            borderColor: 'rgb(52, 211, 153)',
            borderWidth: 2
          },
          {
            label: 'Répondus SA',
            data: props.data.map(d => d.traites_sa),
            backgroundColor: 'rgba(110, 231, 183, 0.5)',
            borderColor: 'rgb(110, 231, 183)',
            borderWidth: 2
          },
          {
            label: 'Sans Réponse',
            data: props.data.map(d => d.en_attente),
            backgroundColor: 'rgba(245, 158, 11, 0.7)',
            borderColor: 'rgb(245, 158, 11)',
            borderWidth: 2,
            type: 'line',
            tension: 0.4
          }
        ]
      },
      options: chartOptions()
    })
  }
}

// Options communes aux deux graphiques
const chartOptions = () => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false
  },
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 15,
        font: { size: 11, weight: '600' }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleFont: { size: 13, weight: 'bold' },
      bodyFont: { size: 12 },
      cornerRadius: 8
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { font: { size: 11, weight: '500' } },
      grid: { color: 'rgba(0, 0, 0, 0.05)' }
    },
    x: {
      ticks: {
        font: { size: 10, weight: '500' },
        maxRotation: 45,
        minRotation: 45
      },
      grid: { display: false }
    }
  }
})

onMounted(() => createChart())

watch(() => props.data, () => createChart(), { deep: true })
</script>