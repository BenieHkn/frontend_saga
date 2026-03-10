<template>
  <div class="min-h-screen bg-slate-100 p-6 font-sans">

    <!-- ═══════════════════════════════════════════════════════════
         MODAL RÔLE (create / edit)
    ════════════════════════════════════════════════════════════ -->
    <UModal v-model="roleFormOpen" :ui="{ width: 'sm:max-w-2xl' }">
      <div class="flex flex-col max-h-[90vh] bg-white rounded-xl overflow-hidden">
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center"
              :class="editingRole ? 'bg-amber-100' : 'bg-indigo-100'">
              <Icon :name="editingRole ? 'i-heroicons-pencil-square' : 'i-heroicons-shield-check'"
                class="w-5 h-5" :class="editingRole ? 'text-amber-600' : 'text-indigo-600'" />
            </div>
            <div>
              <h2 class="text-base font-bold text-slate-900">{{ editingRole ? 'Modifier le rôle' : 'Nouveau rôle' }}</h2>
              <p v-if="editingRole" class="text-xs text-slate-500 font-mono">{{ editingRole.name }}</p>
            </div>
          </div>
          <button @click="closeRoleForm" class="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-400">
            <Icon name="i-heroicons-x-mark" class="w-4 h-4" />
          </button>
        </div>

        <div class="overflow-y-auto flex-1 p-6 space-y-5">
          <!-- Nom -->
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Nom du rôle <span class="text-red-500">*</span>
            </label>
            <input v-model="roleForm.name" type="text" placeholder="Ex: chef_service, directeur_technique..."
              class="w-full h-10 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all font-mono" />
            <p class="mt-1 text-[11px] text-slate-400">Underscores pour les espaces. Ex: <code class="bg-slate-100 px-1 rounded">chef_service</code></p>
          </div>

          <!-- Permissions -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider">Permissions assignées</label>
              <div class="flex items-center gap-2">
                <button type="button" @click="roleForm.permissions = allPermissions.map(p => p.name || p)"
                  class="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800">Tout</button>
                <span class="text-slate-300 text-xs">|</span>
                <button type="button" @click="roleForm.permissions = []"
                  class="text-[11px] font-semibold text-slate-500 hover:text-slate-700">Aucun</button>
              </div>
            </div>
            <div class="mb-3">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-100">
                <Icon name="i-heroicons-check-circle" class="w-3.5 h-3.5" />
                {{ roleForm.permissions.length }} sélectionnée(s)
              </span>
            </div>
            <div class="space-y-3">
              <div v-for="group in permissionGroups" :key="group.key" class="rounded-xl border border-slate-200 overflow-hidden">
                <div class="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-lg flex items-center justify-center" :class="group.iconBg">
                      <Icon :name="group.icon" class="w-3.5 h-3.5" :class="group.iconColor" />
                    </div>
                    <span class="text-xs font-bold text-slate-700">{{ group.label }}</span>
                    <span class="text-[10px] text-slate-400">({{ group.permissions.length }})</span>
                  </div>
                  <label class="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox"
                      :checked="group.permissions.every(p => roleForm.permissions.includes(p.name))"
                      :indeterminate.prop="group.permissions.some(p => roleForm.permissions.includes(p.name)) && !group.permissions.every(p => roleForm.permissions.includes(p.name))"
                      @change="toggleRoleGroup(group)"
                      class="w-3.5 h-3.5 text-indigo-600 rounded cursor-pointer" />
                    <span class="text-[11px] text-slate-500 font-medium">Tout</span>
                  </label>
                </div>
                <div class="p-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  <label v-for="perm in group.permissions" :key="perm.name"
                    class="flex items-start gap-2 p-2 rounded-lg hover:bg-indigo-50/60 cursor-pointer transition-colors"
                    :class="roleForm.permissions.includes(perm.name) ? 'bg-indigo-50 border border-indigo-100' : 'border border-transparent'">
                    <input type="checkbox" :value="perm.name" v-model="roleForm.permissions"
                      class="w-3.5 h-3.5 mt-0.5 text-indigo-600 rounded cursor-pointer shrink-0" />
                    <div>
                      <p class="text-xs font-semibold text-slate-800 leading-tight">{{ perm.label }}</p>
                      <p class="text-[10px] text-slate-400 font-mono">{{ perm.name }}</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div v-if="roleFormErrors.length" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p v-for="(e, i) in roleFormErrors" :key="i" class="text-xs text-red-600 flex items-center gap-1.5">
              <Icon name="i-heroicons-exclamation-circle" class="w-3.5 h-3.5 shrink-0" />{{ e }}
            </p>
          </div>
        </div>

        <div class="px-6 py-4 border-t border-slate-100 flex justify-end gap-2 shrink-0">
          <UButton color="gray" variant="outline" @click="closeRoleForm">Annuler</UButton>
          <UButton :loading="roleFormLoading" :disabled="!roleForm.name.trim() || roleFormLoading"
            :color="editingRole ? 'amber' : 'indigo'" @click="submitRoleForm">
            {{ editingRole ? 'Enregistrer' : 'Créer le rôle' }}
          </UButton>
        </div>
      </div>
    </UModal>

    <!-- ═══════════════════════════════════════════════════════════
         MODAL PERMISSION (create / edit)
    ════════════════════════════════════════════════════════════ -->
    <UModal v-model="permFormOpen" :ui="{ width: 'sm:max-w-xl' }">
      <div class="flex flex-col max-h-[90vh] bg-white rounded-xl overflow-hidden">
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center"
              :class="editingPerm ? 'bg-amber-100' : 'bg-emerald-100'">
              <Icon :name="editingPerm ? 'i-heroicons-pencil-square' : 'i-heroicons-key'"
                class="w-5 h-5" :class="editingPerm ? 'text-amber-600' : 'text-emerald-600'" />
            </div>
            <div>
              <h2 class="text-base font-bold text-slate-900">{{ editingPerm ? 'Modifier la permission' : 'Nouvelle permission' }}</h2>
              <p v-if="editingPerm" class="text-xs text-slate-500 font-mono">{{ editingPerm.name }}</p>
            </div>
          </div>
          <button @click="closePermForm" class="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-400">
            <Icon name="i-heroicons-x-mark" class="w-4 h-4" />
          </button>
        </div>

        <div class="overflow-y-auto flex-1 p-6 space-y-5">
          <!-- Nom -->
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Nom de la permission <span class="text-red-500">*</span>
            </label>
            <input v-model="permForm.name" type="text" placeholder="Ex: voir_courriers, faire_transfert..."
              class="w-full h-10 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-mono" />
            <p class="mt-1 text-[11px] text-slate-400">
              Convention : <code class="bg-slate-100 px-1 rounded">action_ressource</code>
              — préfixes : <code class="bg-slate-100 px-1 rounded">voir_</code>, <code class="bg-slate-100 px-1 rounded">faire_</code>, <code class="bg-slate-100 px-1 rounded">modifier_</code>, <code class="bg-slate-100 px-1 rounded">supprimer_</code>
            </p>
          </div>

          <!-- Guard name -->
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Guard</label>
            <select v-model="permForm.guard_name"
              class="w-full h-10 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all bg-white">
              <option value="web">web</option>
              <option value="api">api</option>
              <option value="sanctum">sanctum</option>
            </select>
          </div>

          <!-- Rôles associés -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider">Rôles ayant cette permission</label>
              <div class="flex items-center gap-2">
                <button type="button" @click="permForm.roles = roles.map(r => r.name)"
                  class="text-[11px] font-semibold text-emerald-600 hover:text-emerald-800">Tous</button>
                <span class="text-slate-300 text-xs">|</span>
                <button type="button" @click="permForm.roles = []"
                  class="text-[11px] font-semibold text-slate-500 hover:text-slate-700">Aucun</button>
              </div>
            </div>
            <div class="mb-2">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100">
                <Icon name="i-heroicons-shield-check" class="w-3.5 h-3.5" />
                {{ permForm.roles.length }} rôle(s) sélectionné(s)
              </span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 p-3 border border-slate-200 rounded-xl">
              <div v-if="roles.length === 0" class="col-span-2 text-xs text-slate-400 italic text-center py-4">
                Aucun rôle disponible
              </div>
              <label v-for="role in roles" :key="role.id"
                class="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-emerald-50/60 cursor-pointer transition-colors"
                :class="permForm.roles.includes(role.name) ? 'bg-emerald-50 border border-emerald-100' : 'border border-transparent'">
                <input type="checkbox" :value="role.name" v-model="permForm.roles"
                  class="w-3.5 h-3.5 text-emerald-600 rounded cursor-pointer shrink-0" />
                <div>
                  <p class="text-xs font-semibold text-slate-800 leading-tight">{{ formatRoleName(role.name) }}</p>
                  <p class="text-[10px] text-slate-400 font-mono">{{ role.name }}</p>
                </div>
              </label>
            </div>
          </div>

          <div v-if="permFormErrors.length" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p v-for="(e, i) in permFormErrors" :key="i" class="text-xs text-red-600 flex items-center gap-1.5">
              <Icon name="i-heroicons-exclamation-circle" class="w-3.5 h-3.5 shrink-0" />{{ e }}
            </p>
          </div>
        </div>

        <div class="px-6 py-4 border-t border-slate-100 flex justify-end gap-2 shrink-0">
          <UButton color="gray" variant="outline" @click="closePermForm">Annuler</UButton>
          <UButton :loading="permFormLoading" :disabled="!permForm.name.trim() || permFormLoading"
            :color="editingPerm ? 'amber' : 'emerald'" @click="submitPermForm">
            {{ editingPerm ? 'Enregistrer' : 'Créer la permission' }}
          </UButton>
        </div>
      </div>
    </UModal>

    <!-- ═══════════════════════════════════════════════════════════
         EN-TÊTE
    ════════════════════════════════════════════════════════════ -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Rôles & Permissions</h1>
        <p class="text-sm text-slate-500">Gestion des droits d'accès et des rôles utilisateurs</p>
      </div>
      <!-- Bouton contextuel selon l'onglet actif -->
      <UBadge :color="activeTab === 'roles' ? 'indigo' : 'green'" variant="soft" size="lg" class="ml-auto">
        <UButton icon="i-heroicons-plus" @click="activeTab === 'roles' ? openCreateRole() : openCreatePerm()" variant="text" size="sm"
          class="p-0 m-0" :class="activeTab === 'roles' ? 'text-blue-600' : 'text-green-600'">
          {{ activeTab === 'roles' ? 'Nouveau rôle' : 'Nouvelle permission' }}
        </UButton>
      </UBadge>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
          <Icon name="i-heroicons-shield-check" class="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <p class="text-2xl font-bold text-slate-900">{{ roles.length }}</p>
          <p class="text-xs text-slate-500 font-medium">Rôles</p>
        </div>
      </div>
      <div class="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
          <Icon name="i-heroicons-key" class="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <p class="text-2xl font-bold text-slate-900">{{ allPermissions.length }}</p>
          <p class="text-xs text-slate-500 font-medium">Permissions</p>
        </div>
      </div>
      <div class="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
          <Icon name="i-heroicons-link" class="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <p class="text-2xl font-bold text-slate-900">{{ totalAssignments }}</p>
          <p class="text-xs text-slate-500 font-medium">Assignations</p>
        </div>
      </div>
      <div class="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
          <Icon name="i-heroicons-exclamation-triangle" class="w-5 h-5 text-sky-600" />
        </div>
        <div>
          <p class="text-2xl font-bold text-slate-900">{{ unassignedPermissions }}</p>
          <p class="text-xs text-slate-500 font-medium">Permissions non assignées</p>
        </div>
      </div>
    </div>

    <!-- ── ONGLETS ──────────────────────────────────────────────────── -->
    <div class="flex items-center gap-1 mb-5 bg-white rounded-xl border border-slate-200 p-1 w-fit">
      <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
        class="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all"
        :class="activeTab === tab.key
          ? 'bg-indigo-600 text-white shadow-sm'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'">
        <Icon :name="tab.icon" class="w-4 h-4" />
        {{ tab.label }}
        <span class="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
          :class="activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'">
          {{ tab.key === 'roles' ? roles.length : allPermissions.length }}
        </span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
      <div class="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <span class="text-sm font-medium">Chargement...</span>
    </div>

    <div v-else>

      <!-- ════════════════════════════════════════════════════════
           ONGLET RÔLES
      ═══════════════════════════════════════════════════════════ -->
      <div v-if="activeTab === 'roles'">
        <div class="mb-4 flex items-center gap-3">
          <div class="relative flex-1 max-w-sm">
            <Icon name="i-heroicons-magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input v-model="roleSearch" type="text" placeholder="Rechercher un rôle..."
              class="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
          </div>
          <span class="text-xs text-slate-400 font-medium bg-white border border-slate-200 px-3 py-2 rounded-lg">
            {{ filteredRoles.length }} rôle(s)
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <div v-for="role in filteredRoles" :key="role.id"
            class="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md hover:border-indigo-200 transition-all duration-200 group">

            <!-- Header carte -->
            <div class="px-5 py-4 border-b border-slate-100">
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center" :class="getRoleColor(role.name).bg">
                    <Icon :name="getRoleIcon(role.name)" class="w-5 h-5" :class="getRoleColor(role.name).text" />
                  </div>
                  <div class="min-w-0">
                    <h3 class="text-sm font-bold text-slate-900 truncate">{{ formatRoleName(role.name) }}</h3>
                    <p class="text-[11px] text-slate-400 font-mono truncate">{{ role.name }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="openEditRole(role)"
                    class="inline-flex items-center justify-center w-7 h-7 bg-amber-50 text-amber-700 border border-amber-100 rounded-md hover:bg-amber-100 transition-all">
                    <Icon name="i-heroicons-pencil-square" class="w-3.5 h-3.5" />
                  </button>
                  <button @click="deleteRole(role)"
                    class="inline-flex items-center justify-center w-7 h-7 bg-red-50 text-red-600 border border-red-100 rounded-md hover:bg-red-100 transition-all">
                    <Icon name="i-heroicons-trash" class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Permissions summary -->
            <div class="px-5 py-3">
              <div class="flex items-center justify-between mb-2">
                <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Permissions</span>
                <span class="text-[11px] font-bold px-2 py-0.5 rounded-full" :class="getPermCountColor(role.permissions?.length || 0)">
                  {{ role.permissions?.length || 0 }} / {{ allPermissions.length }}
                </span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-1.5 mb-2.5">
                <div class="h-1.5 rounded-full transition-all duration-500" :class="getProgressColor(role.permissions?.length || 0)"
                  :style="`width: ${Math.round(((role.permissions?.length || 0) / Math.max(allPermissions.length, 1)) * 100)}%`" />
              </div>
              <div class="flex flex-wrap gap-1.5">
                <template v-for="group in permissionGroups" :key="group.key">
                  <span v-if="countGroupPerms(role, group) > 0"
                    class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full border" :class="group.badgeBg">
                    <Icon :name="group.icon" class="w-3 h-3" :class="group.iconColor" />
                    {{ group.shortLabel }} ({{ countGroupPerms(role, group) }})
                  </span>
                </template>
                <span v-if="!role.permissions?.length" class="text-[11px] text-slate-400 italic">Aucune permission</span>
              </div>
            </div>

            <!-- Détail dépliable -->
            <div class="border-t border-slate-100">
              <button @click="toggleRoleExpand(role.id)"
                class="w-full flex items-center justify-between px-5 py-2.5 text-[11px] font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors">
                <span>Détail des permissions</span>
                <!-- <Icon :name="expandedRoles.includes(role.id) ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'" class="w-3.5 h-3.5" /> -->
              </button>
              <!-- <div v-if="expandedRoles.includes(role.id)" class="px-5 pb-4"> -->
              <div class="px-5 pb-4">
                <div v-if="role.permissions?.length" class="flex flex-wrap gap-1">
                  <span v-for="perm in role.permissions" :key="perm.name || perm"
                    class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-medium rounded-md bg-slate-50 text-slate-600 border border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-colors cursor-pointer"
                    @click="quickViewPerm(perm.name || perm)">
                    {{ perm.name || perm }}
                  </span>
                </div>
                <p v-else class="text-xs text-slate-400 italic">Aucune permission attribuée</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="filteredRoles.length === 0"
          class="flex flex-col items-center justify-center py-16 gap-3 bg-white rounded-xl border border-slate-200">
          <Icon name="i-heroicons-shield-exclamation" class="w-12 h-12 text-slate-300" />
          <p class="text-sm font-semibold text-slate-600">Aucun rôle trouvé</p>
          <button @click="openCreateRole()"
            class="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline underline-offset-2">
            Créer un premier rôle
          </button>
        </div>
      </div>

      <!-- ════════════════════════════════════════════════════════
           ONGLET PERMISSIONS
      ═══════════════════════════════════════════════════════════ -->
      <div v-if="activeTab === 'permissions'">
        <div class="mb-4 flex flex-wrap items-center gap-3">
          <div class="relative flex-1 min-w-48 max-w-sm">
            <Icon name="i-heroicons-magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input v-model="permSearch" type="text" placeholder="Rechercher une permission..."
              class="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
          </div>
          <!-- Filtre groupe -->
          <div class="flex items-center gap-1.5 flex-wrap">
            <button @click="permGroupFilter = ''" :class="permGroupFilter === '' ? 'bg-slate-700 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'"
              class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all">Tous</button>
            <button v-for="group in permissionGroups" :key="group.key" @click="permGroupFilter = group.key"
              :class="permGroupFilter === group.key ? `${group.activeBg} text-white` : 'bg-white border border-slate-200 hover:border-slate-300'"
              class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all"
              :style="permGroupFilter === group.key ? '' : ''">
              <Icon :name="group.icon" class="w-3.5 h-3.5" :class="permGroupFilter === group.key ? 'text-white' : group.iconColor" />
              <span :class="permGroupFilter === group.key ? 'text-white' : 'text-slate-600'">{{ group.shortLabel }}</span>
            </button>
          </div>
          <span class="text-xs text-slate-400 font-medium bg-white border border-slate-200 px-3 py-2 rounded-lg ml-auto">
            {{ filteredPermissions.length }} permission(s)
          </span>
        </div>

        <!-- Groupes affichés -->
        <div class="space-y-4">
          <div v-for="group in visiblePermGroups" :key="group.key"
            class="bg-white rounded-xl border border-slate-200 overflow-hidden">

            <!-- En-tête groupe -->
            <div class="flex items-center justify-between px-5 py-3 border-b border-slate-100" :class="group.headerBg">
              <div class="flex items-center gap-2.5">
                <div class="w-7 h-7 rounded-lg flex items-center justify-center" :class="group.iconBg">
                  <Icon :name="group.icon" class="w-4 h-4" :class="group.iconColor" />
                </div>
                <span class="text-sm font-bold text-slate-800">{{ group.label }}</span>
                <span class="text-xs text-slate-500 font-medium">({{ groupFilteredPerms(group).length }} permission(s))</span>
              </div>
            </div>

            <!-- Permissions du groupe filtrées -->
            <div class="divide-y divide-slate-100">
              <div v-for="perm in groupFilteredPerms(group)" :key="perm.id || perm.name"
                class="flex items-center justify-between px-5 py-3 hover:bg-slate-50/70 transition-colors group/row">

                <div class="flex items-start gap-3 min-w-0 flex-1">
                  <div class="w-6 h-6 rounded-md flex items-center justify-center mt-0.5 shrink-0" :class="group.iconBg">
                    <Icon :name="group.icon" class="w-3.5 h-3.5" :class="group.iconColor" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-semibold text-slate-800 font-mono truncate">{{ perm.name }}</p>
                    <p class="text-xs text-slate-500 mt-0.5">{{ permissionLabels[perm.name] || perm.name }}</p>
                  </div>
                </div>

                <!-- Rôles ayant cette permission -->
                <div class="flex items-center gap-3 ml-4">
                  <div class="flex flex-wrap gap-1 justify-end max-w-xs">
                    <template v-if="getRolesForPerm(perm.name).length">
                      <span v-for="r in getRolesForPerm(perm.name)" :key="r"
                        class="inline-flex px-1.5 py-0.5 text-[10px] font-semibold rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {{ r }}
                      </span>
                    </template>
                    <span v-else class="text-[11px] text-slate-400 italic">Aucun rôle</span>
                  </div>

                  <!-- Actions -->
                  <div class="flex items-center gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity shrink-0">
                    <button @click="openEditPerm(perm)"
                      class="inline-flex items-center justify-center w-7 h-7 bg-amber-50 text-amber-700 border border-amber-100 rounded-md hover:bg-amber-100 transition-all">
                      <Icon name="i-heroicons-pencil-square" class="w-3.5 h-3.5" />
                    </button>
                    <button @click="deletePerm(perm)"
                      class="inline-flex items-center justify-center w-7 h-7 bg-red-50 text-red-600 border border-red-100 rounded-md hover:bg-red-100 transition-all">
                      <Icon name="i-heroicons-trash" class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="filteredPermissions.length === 0"
          class="flex flex-col items-center justify-center py-16 gap-3 bg-white rounded-xl border border-slate-200">
          <Icon name="i-heroicons-key" class="w-12 h-12 text-slate-300" />
          <p class="text-sm font-semibold text-slate-600">Aucune permission trouvée</p>
          <button @click="openCreatePerm()"
            class="text-xs font-semibold text-emerald-600 hover:text-emerald-800 underline underline-offset-2">
            Créer une permission
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'

const config = useRuntimeConfig()

// ── État global ────────────────────────────────────────────────────────────────
const roles = ref([])
const allPermissions = ref([])
const loading = ref(false)
const error = ref(null)

// ── Tabs ──────────────────────────────────────────────────────────────────────
const activeTab = ref('roles')
const tabs = [
  { key: 'roles', label: 'Rôles', icon: 'i-heroicons-shield-check' },
  { key: 'permissions', label: 'Permissions', icon: 'i-heroicons-key' },
]

// ── Recherches / filtres ───────────────────────────────────────────────────────
const roleSearch = ref('')
const permSearch = ref('')
const permGroupFilter = ref('')
const expandedRoles = ref([])

// ── Formulaire RÔLE ────────────────────────────────────────────────────────────
const roleFormOpen = ref(false)
const roleFormLoading = ref(false)
const roleFormErrors = ref([])
const editingRole = ref(null)
const roleForm = ref({ name: '', permissions: [] })

// ── Formulaire PERMISSION ──────────────────────────────────────────────────────
const permFormOpen = ref(false)
const permFormLoading = ref(false)
const permFormErrors = ref([])
const editingPerm = ref(null)
const permForm = ref({ name: '', guard_name: 'web', roles: [] })

// ── Auth ──────────────────────────────────────────────────────────────────────
const getAuthToken = () => process.client ? localStorage.getItem('auth_token') || '' : ''
const authHeaders = () => ({
  Authorization: `Bearer ${getAuthToken()}`,
  'Content-Type': 'application/json',
  Accept: 'application/json',
})

// ── Libellés lisibles ─────────────────────────────────────────────────────────
const permissionLabels = {
  voir_configuration: 'Voir la configuration système',
  modifier_courriers: 'Modifier les courriers',
  supprimer_courriers: 'Supprimer les courriers',
  voir_tous_courriers: 'Voir tous les courriers',
  voir_courriers_sa: 'Voir les courriers secrétariat',
  faire_rattachement: 'Effectuer un rattachement',
  voir_codir: 'Accès espace CODIR',
  voir_stats_globales: 'Consulter les statistiques globales',
  voir_agents: 'Voir la liste des agents',
  faire_transfert: 'Effectuer un transfert de courrier',
  voir_dashboard_admin: 'Tableau de bord Administrateur',
  voir_dashboard_dg: 'Tableau de bord Directeur Général',
  voir_dashboard_dt: 'Tableau de bord Directeur Technique',
  voir_dashboard_secretariat: 'Tableau de bord Secrétariat',
  voir_dashboard_chef_service: 'Tableau de bord Chef de Service',
  voir_dashboard_agent: 'Tableau de bord Agent',
}

// ── Groupes de permissions ─────────────────────────────────────────────────────
const permissionGroups = computed(() => {
  const perms = allPermissions.value.length
    ? allPermissions.value
    : Object.keys(permissionLabels).map(name => ({ name }))

  return [
    {
      key: 'voir',
      label: 'Visibilité & Accès',
      shortLabel: 'Voir',
      icon: 'i-heroicons-eye',
      iconBg: 'bg-sky-100',
      iconColor: 'text-sky-600',
      headerBg: 'bg-sky-50/50',
      badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
      activeBg: 'bg-sky-500',
      permissions: perms.filter(p => (p.name || p).startsWith('voir_')).map(p => ({ ...(typeof p === 'object' ? p : { name: p }), label: permissionLabels[p.name || p] || (p.name || p) })),
    },
    {
      key: 'faire',
      label: 'Actions métier',
      shortLabel: 'Actions',
      icon: 'i-heroicons-bolt',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      headerBg: 'bg-amber-50/50',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      activeBg: 'bg-amber-500',
      permissions: perms.filter(p => (p.name || p).startsWith('faire_')).map(p => ({ ...(typeof p === 'object' ? p : { name: p }), label: permissionLabels[p.name || p] || (p.name || p) })),
    },
    {
      key: 'modifier',
      label: 'Modification',
      shortLabel: 'Modifier',
      icon: 'i-heroicons-pencil',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      headerBg: 'bg-indigo-50/50',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      activeBg: 'bg-indigo-500',
      permissions: perms.filter(p => (p.name || p).startsWith('modifier_')).map(p => ({ ...(typeof p === 'object' ? p : { name: p }), label: permissionLabels[p.name || p] || (p.name || p) })),
    },
    {
      key: 'supprimer',
      label: 'Suppression',
      shortLabel: 'Supprimer',
      icon: 'i-heroicons-trash',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      headerBg: 'bg-red-50/50',
      badgeBg: 'bg-red-50 text-red-700 border-red-200',
      activeBg: 'bg-red-500',
      permissions: perms.filter(p => (p.name || p).startsWith('supprimer_')).map(p => ({ ...(typeof p === 'object' ? p : { name: p }), label: permissionLabels[p.name || p] || (p.name || p) })),
    },
    {
      key: 'autre',
      label: 'Autres',
      shortLabel: 'Autres',
      icon: 'i-heroicons-cog-6-tooth',
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-600',
      headerBg: 'bg-slate-50/50',
      badgeBg: 'bg-slate-50 text-slate-700 border-slate-200',
      activeBg: 'bg-slate-500',
      permissions: perms.filter(p => {
        const n = p.name || p
        return !['voir_', 'faire_', 'modifier_', 'supprimer_'].some(prefix => n.startsWith(prefix))
      }).map(p => ({ ...(typeof p === 'object' ? p : { name: p }), label: permissionLabels[p.name || p] || (p.name || p) })),
    },
  ].filter(g => g.permissions.length > 0)
})

// ── Computed ──────────────────────────────────────────────────────────────────
const filteredRoles = computed(() => {
  const q = roleSearch.value.toLowerCase().trim()
  if (!q) return roles.value
  return roles.value.filter(r => r.name.toLowerCase().includes(q))
})

const filteredPermissions = computed(() => {
  const q = permSearch.value.toLowerCase().trim()
  let perms = allPermissions.value
  if (q) perms = perms.filter(p => (p.name || '').toLowerCase().includes(q) || (permissionLabels[p.name] || '').toLowerCase().includes(q))
  if (permGroupFilter.value) {
    const group = permissionGroups.value.find(g => g.key === permGroupFilter.value)
    if (group) {
      const groupNames = group.permissions.map(p => p.name)
      perms = perms.filter(p => groupNames.includes(p.name))
    }
  }
  return perms
})

const visiblePermGroups = computed(() => {
  if (permGroupFilter.value) {
    return permissionGroups.value.filter(g => g.key === permGroupFilter.value)
  }
  return permissionGroups.value.filter(g => groupFilteredPerms(g).length > 0)
})

const totalAssignments = computed(() =>
  roles.value.reduce((sum, r) => sum + (r.permissions?.length || 0), 0)
)

// Permissions qui n'appartiennent à aucun rôle
const unassignedPermissions = computed(() => {
  const assignedNames = new Set(
    roles.value.flatMap(r => r.permissions?.map(p => p.name || p) || [])
  )
  return allPermissions.value.filter(p => !assignedNames.has(p.name)).length
})

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatRoleName = (name) => name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

const getRoleIcon = (name) => {
  if (name.includes('admin')) return 'i-heroicons-cog-6-tooth'
  if (name.includes('directeur') || name.includes('dg')) return 'i-heroicons-star'
  if (name.includes('secretariat') || name.includes('sap')) return 'i-heroicons-document-text'
  if (name.includes('chef')) return 'i-heroicons-user-group'
  return 'i-heroicons-user'
}

const getRoleColor = (name) => {
  if (name.includes('admin')) return { bg: 'bg-purple-100', text: 'text-purple-600' }
  if (name.includes('directeur_general')) return { bg: 'bg-amber-100', text: 'text-amber-600' }
  if (name.includes('directeur')) return { bg: 'bg-blue-100', text: 'text-blue-600' }
  if (name.includes('secretariat_particulier')) return { bg: 'bg-indigo-100', text: 'text-indigo-600' }
  if (name.includes('secretariat')) return { bg: 'bg-sky-100', text: 'text-sky-600' }
  if (name.includes('chef')) return { bg: 'bg-emerald-100', text: 'text-emerald-600' }
  return { bg: 'bg-slate-100', text: 'text-slate-600' }
}

const getPermCountColor = (count) => {
  const ratio = count / Math.max(allPermissions.value.length, 1)
  if (ratio >= 0.6) return 'bg-red-50 text-red-700'
  if (ratio >= 0.3) return 'bg-amber-50 text-amber-700'
  return 'bg-emerald-50 text-emerald-700'
}

const getProgressColor = (count) => {
  const ratio = count / Math.max(allPermissions.value.length, 1)
  if (ratio >= 0.6) return 'bg-red-400'
  if (ratio >= 0.3) return 'bg-amber-400'
  return 'bg-emerald-400'
}

const countGroupPerms = (role, group) => {
  const rolePerms = role.permissions?.map(p => p.name || p) || []
  return group.permissions.filter(p => rolePerms.includes(p.name)).length
}

const groupFilteredPerms = (group) => {
  const q = permSearch.value.toLowerCase().trim()
  return group.permissions.filter(p => {
    if (!filteredPermissions.value.find(fp => fp.name === p.name)) return false
    return true
  })
}

const getRolesForPerm = (permName) => {
  return roles.value
    .filter(r => r.permissions?.some(p => (p.name || p) === permName))
    .map(r => r.name)
}

const toggleRoleGroup = (group) => {
  const all = group.permissions.every(p => roleForm.value.permissions.includes(p.name))
  if (all) {
    roleForm.value.permissions = roleForm.value.permissions.filter(p => !group.permissions.map(gp => gp.name).includes(p))
  } else {
    const toAdd = group.permissions.map(p => p.name).filter(p => !roleForm.value.permissions.includes(p))
    roleForm.value.permissions = [...roleForm.value.permissions, ...toAdd]
  }
}

const toggleRoleExpand = (id) => {
  const idx = expandedRoles.value.indexOf(id)
  idx > -1 ? expandedRoles.value.splice(idx, 1) : expandedRoles.value.push(id)
}

// Clic sur une permission dans le détail d'un rôle → switch tab + highlight
const quickViewPerm = (permName) => {
  activeTab.value = 'permissions'
  permSearch.value = permName
}

// ── API ────────────────────────────────────────────────────────────────────────
const refresh = async () => {
  loading.value = true
  error.value = null
  try {
    const [rolesRes, permsRes] = await Promise.all([
      $fetch(`${config.public.apiBase}/roles`, { headers: authHeaders() }),
      $fetch(`${config.public.apiBase}/permissions`, { headers: authHeaders() }),
    ])
    roles.value = rolesRes?.data || rolesRes || []
    allPermissions.value = permsRes?.data || permsRes || []
  } catch (e) {
    console.error(e)
    error.value = e?.data?.message || e?.message || 'Erreur inconnue'
  } finally {
    loading.value = false
  }
}

// ── CRUD RÔLES ────────────────────────────────────────────────────────────────
const openCreateRole = () => {
  editingRole.value = null
  roleForm.value = { name: '', permissions: [] }
  roleFormErrors.value = []
  roleFormOpen.value = true
}

const openEditRole = (role) => {
  editingRole.value = role
  roleForm.value = {
    name: role.name,
    permissions: role.permissions?.map(p => p.name || p) || [],
  }
  roleFormErrors.value = []
  roleFormOpen.value = true
}

const closeRoleForm = () => {
  roleFormOpen.value = false
  editingRole.value = null
  roleFormErrors.value = []
}

const submitRoleForm = async () => {
  roleFormErrors.value = []
  if (!roleForm.value.name.trim()) {
    roleFormErrors.value.push('Le nom du rôle est obligatoire')
    return
  }
  roleFormLoading.value = true
  try {
    const payload = {
      name: roleForm.value.name.trim().toLowerCase().replace(/\s+/g, '_'),
      permissions: roleForm.value.permissions,
    }
    if (editingRole.value) {
      await $fetch(`${config.public.apiBase}/roles/${editingRole.value.id}`, {
        method: 'PUT', headers: authHeaders(), body: payload,
      })
      useToast().add({ title: 'Succès', description: 'Rôle modifié avec succès', color: 'green' })
    } else {
      await $fetch(`${config.public.apiBase}/roles`, {
        method: 'POST', headers: authHeaders(), body: payload,
      })
      useToast().add({ title: 'Succès', description: 'Rôle créé avec succès', color: 'green' })
    }
    closeRoleForm()
    await refresh()
  } catch (e) {
    roleFormErrors.value = e?.data?.errors
      ? Object.values(e.data.errors).flat()
      : [e?.data?.message || 'Une erreur est survenue']
  } finally {
    roleFormLoading.value = false
  }
}

const deleteRole = async (role) => {
  const result = await Swal.fire({
    title: 'Supprimer ce rôle ?',
    html: `<div class="text-left">
      <p class="mb-3 text-sm text-gray-600">Vous allez supprimer le rôle :</p>
      <div class="bg-gray-50 rounded-lg p-3 flex items-center gap-3 mb-3">
        <p class="text-sm font-bold text-gray-900 font-mono">${role.name}</p>
      </div>
      <p class="text-xs text-gray-500">${role.permissions?.length || 0} permission(s) associée(s)</p>
      <p class="mt-2 text-xs text-red-500">⚠️ Les utilisateurs ayant ce rôle perdront leurs accès.</p>
    </div>`,
    icon: 'warning', showCancelButton: true,
    confirmButtonColor: '#dc2626', cancelButtonColor: '#6b7280',
    confirmButtonText: 'Supprimer', cancelButtonText: 'Annuler', reverseButtons: true,
  })
  if (!result.isConfirmed) return
  try {
    await $fetch(`${config.public.apiBase}/roles/${role.id}`, { method: 'DELETE', headers: authHeaders() })
    await Swal.fire({ title: 'Supprimé !', icon: 'success', timer: 2000, showConfirmButton: false })
    await refresh()
  } catch (e) {
    await Swal.fire({ title: 'Erreur', text: e?.data?.message || 'Impossible de supprimer', icon: 'error', confirmButtonColor: '#2563eb' })
  }
}

// ── CRUD PERMISSIONS ──────────────────────────────────────────────────────────
const openCreatePerm = () => {
  editingPerm.value = null
  permForm.value = { name: '', guard_name: 'web', roles: [] }
  permFormErrors.value = []
  permFormOpen.value = true
}

const openEditPerm = (perm) => {
  editingPerm.value = perm
  permForm.value = {
    name: perm.name,
    guard_name: perm.guard_name || 'web',
    roles: getRolesForPerm(perm.name),
  }
  permFormErrors.value = []
  permFormOpen.value = true
}

const closePermForm = () => {
  permFormOpen.value = false
  editingPerm.value = null
  permFormErrors.value = []
}

const submitPermForm = async () => {
  permFormErrors.value = []
  if (!permForm.value.name.trim()) {
    permFormErrors.value.push('Le nom de la permission est obligatoire')
    return
  }
  permFormLoading.value = true
  try {
    const payload = {
      name: permForm.value.name.trim().toLowerCase().replace(/\s+/g, '_'),
      guard_name: permForm.value.guard_name,
      roles: permForm.value.roles,
    }
    if (editingPerm.value) {
      await $fetch(`${config.public.apiBase}/permissions/${editingPerm.value.id}`, {
        method: 'PUT', headers: authHeaders(), body: payload,
      })
      useToast().add({ title: 'Succès', description: 'Permission modifiée avec succès', color: 'green' })
    } else {
      await $fetch(`${config.public.apiBase}/permissions`, {
        method: 'POST', headers: authHeaders(), body: payload,
      })
      useToast().add({ title: 'Succès', description: 'Permission créée avec succès', color: 'green' })
    }
    closePermForm()
    await refresh()
  } catch (e) {
    permFormErrors.value = e?.data?.errors
      ? Object.values(e.data.errors).flat()
      : [e?.data?.message || 'Une erreur est survenue']
  } finally {
    permFormLoading.value = false
  }
}

const deletePerm = async (perm) => {
  const usedByRoles = getRolesForPerm(perm.name)
  const result = await Swal.fire({
    title: 'Supprimer cette permission ?',
    html: `<div class="text-left">
      <p class="mb-3 text-sm text-gray-600">Vous allez supprimer :</p>
      <div class="bg-gray-50 rounded-lg p-3 mb-3">
        <p class="text-sm font-bold text-gray-900 font-mono">${perm.name}</p>
        <p class="text-xs text-gray-500 mt-1">${permissionLabels[perm.name] || ''}</p>
      </div>
      ${usedByRoles.length ? `<p class="text-xs text-amber-600">⚠️ Cette permission est utilisée par ${usedByRoles.length} rôle(s) : ${usedByRoles.join(', ')}</p>` : ''}
    </div>`,
    icon: 'warning', showCancelButton: true,
    confirmButtonColor: '#dc2626', cancelButtonColor: '#6b7280',
    confirmButtonText: 'Supprimer', cancelButtonText: 'Annuler', reverseButtons: true,
  })
  if (!result.isConfirmed) return
  try {
    await $fetch(`${config.public.apiBase}/permissions/${perm.id}`, { method: 'DELETE', headers: authHeaders() })
    await Swal.fire({ title: 'Supprimée !', icon: 'success', timer: 2000, showConfirmButton: false })
    await refresh()
  } catch (e) {
    await Swal.fire({ title: 'Erreur', text: e?.data?.message || 'Impossible de supprimer', icon: 'error', confirmButtonColor: '#2563eb' })
  }
}

onMounted(() => { refresh() })
</script>

<style scoped>
:deep(.swal2-popup) { border-radius: 1rem; }
</style>