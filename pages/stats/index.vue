<template>
  <div class="min-h-screen bg-slate-50/30 font-sans text-slate-900 p-6">
      <PageHeader title="Statistiques" subtitle="Focal des flux de courriers" />

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <StatCard title="Total Arrived" value="1,284" icon="i-heroicons-inbox" trend="12.5%" :isUp="true" />
        <StatCard title="Total Sent" value="942" icon="i-heroicons-paper-airplane" trend="4.2%" :isUp="false" />
        <StatCard title="Total Processed" value="1,105" icon="i-heroicons-check-badge" trend="8.1%" :isUp="true" />
      </div>

      <div class="mb-10">
        <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
          <span class="w-1.5 h-6 bg-primary-500 rounded-full"></span>
          Processing Status
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatusCircle count="42" label="In Progress" icon="i-heroicons-clock" colorClass="text-blue-500" :offset="100" />
          <StatusCircle count="15" label="Unprocessed" icon="i-heroicons-exclamation-triangle" colorClass="text-amber-500" :offset="210" />
          <StatusCircle count="89" label="Transferred" icon="i-heroicons-arrow-path-rounded-square" colorClass="text-indigo-500" :offset="40" />
          <StatusCircle count="31" label="Assigned" icon="i-heroicons-user-plus" colorClass="text-emerald-500" :offset="180" />
        </div>
      </div>

      <VolumeChart />
  </div>
</template>