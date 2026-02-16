<template>
  <div class="min-h-screen bg-gray-50 bg-white rounded-lg shadow-sm border border-gray-200 p-6">

    <!-- Toolbar -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <!-- Search and Filters -->
          <div class="flex items-center space-x-4">
            <div class="relative">
              <UInput
                v-model="globalSearch"
                placeholder="Recherche globale..."
                icon="i-heroicons-magnifying-glass"
                size="sm"
                class="w-64"
                @input="handleGlobalSearch"
              />
            </div>
            <UButton
              @click="toggleAdvancedFilters"
              variant="outline"
              size="sm"
              icon="i-heroicons-funnel"
              :color="showAdvancedFilters ? 'primary' : 'gray'"
            >
              Filtres avancés
              <UBadge v-if="activeFiltersCount > 0" color="red" variant="solid" size="xs" class="ml-2">
                {{ activeFiltersCount }}
              </UBadge>
            </UButton>
          </div>

          <!-- View Options -->
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <label class="text-sm text-gray-600">Lignes par page:</label>
              <USelect
                v-model="itemsPerPage"
                :options="[10, 25, 50, 100]"
                class="w-16"
                size="sm"
                @update:model-value="updateItemsPerPage"
              />
            </div>
          </div>
        </div>

        <!-- Advanced Filters Panel -->
        <div v-if="showAdvancedFilters" class="mt-4 p-4 bg-gray-50 rounded-lg">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Position</label>
              <UInput
                v-model="filters.position"
                placeholder="Filtrer par position..."
                size="sm"
                icon="i-heroicons-briefcase"
                @input="handleFilter"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Bureau</label>
              <UInput
                v-model="filters.office"
                placeholder="Filtrer par bureau..."
                size="sm"
                icon="i-heroicons-building-office"
                @input="handleFilter"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Tranche d'âge</label>
              <UInput
                v-model="filters.ageRange"
                placeholder="ex: 30-39, 50+"
                size="sm"
                icon="i-heroicons-calendar-days"
                @input="handleFilter"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Salaire minimum</label>
              <UInput
                v-model="filters.minSalary"
                placeholder="ex: 100000"
                size="sm"
                icon="i-heroicons-currency-euro"
                @input="handleFilter"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

      <!-- Data Table Container -->
    <div class="max-w-7xl py-6">
      <div class="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <!-- Table Header with Selection -->
        <div class="border-b border-gray-200 px-6 py-3 bg-gray-50">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <UCheckbox
                v-model="selectAll"
                :indeterminate="isIndeterminateSelection"
                @change="toggleSelectAll"
              />
              <span class="text-sm text-gray-700">
                {{ selectedRows.length }} sélectionné(s)
              </span>
              <UButton
                v-if="selectedRows.length > 0"
                @click="deleteSelected"
                variant="outline"
                size="xs"
                color="red"
                icon="i-heroicons-trash"
              >
                Supprimer
              </UButton>
            </div>
              <div class="flex items-center space-x-2">
                <UButton
                  @click="refreshData"
                  variant="variant"
                  size="xs"
                  icon="i-heroicons-arrow-path"
                  :loading="refreshing"
                >
                </UButton>
              </div>
          </div>
        </div>

        <!-- Modern Data Table -->
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead class="bg-gray-50 border border-gray-400">
              <!-- Selection Header -->
              <tr>
                <th class="px-6 py-3 text-left border border-gray-400 bg-gray-100">
                  <div class="space-y-2">
                    <div class="flex items-center space-x-2">
                      <span class="text-xs font-medium text-gray-700 uppercase tracking-wider">N°</span>
                    </div>
                  </div>
                </th>
                <th class="px-6 py-3 text-left border border-gray-400 bg-gray-100">
                  <div class="space-y-2">
                    <div class="flex items-center space-x-2">
                      <span class="text-xs font-medium text-gray-700 uppercase tracking-wider">Source</span>
                      <div class="flex flex-col items-center">
                        <Icon
                          v-if="sortColumn !== 'position' || sortDirection === 'desc'"
                          name="i-heroicons-chevron-up"
                          class="w-3 h-3 text-gray-500 hover:text-gray-700 cursor-pointer"
                          :class="{ 'text-blue-600': sortColumn === 'position' && sortDirection === 'asc' }"
                          @click="sortBy('position')"
                        />
                        <Icon
                          v-if="sortColumn !== 'position' || sortDirection === 'asc'"
                          name="i-heroicons-chevron-down"
                          class="w-3 h-3 text-gray-500 hover:text-gray-700 cursor-pointer"
                          :class="{ 'text-blue-600': sortColumn === 'position' && sortDirection === 'desc' }"
                          @click="sortBy('position')"
                        />
                      </div>
                      <UButton
                        @click="openTextFilterMenu($event, 'position')"
                        variant="outline"
                        size="sm"
                        icon="i-heroicons-funnel"
                        :color="textFilters.position ? 'primary' : 'gray'"
                        class="ml-2"
                      />
                    </div>
                    <UInput
                      v-model="filters.position"
                      placeholder="Position..."
                      size="xs"
                      icon="i-heroicons-briefcase"
                      @input="handleFilter"
                      @click.stop
                    />
                  </div>
                </th>
                <th class="px-6 py-3 text-left border border-gray-400 bg-gray-100">
                  <div class="space-y-2">
                    <div class="flex items-center space-x-2">
                      <span class="text-xs font-medium text-gray-700 uppercase tracking-wider">Objet</span>
                      <div class="flex flex-col items-center">
                        <Icon
                          v-if="sortColumn !== 'salary' || sortDirection === 'desc'"
                          name="i-heroicons-chevron-up"
                          class="w-3 h-3 text-gray-500 hover:text-gray-700 cursor-pointer"
                          :class="{ 'text-blue-600': sortColumn === 'salary' && sortDirection === 'asc' }"
                          @click="sortBy('salary')"
                        />
                        <Icon
                          v-if="sortColumn !== 'salary' || sortDirection === 'asc'"
                          name="i-heroicons-chevron-down"
                          class="w-3 h-3 text-gray-500 hover:text-gray-700 cursor-pointer"
                          :class="{ 'text-blue-600': sortColumn === 'salary' && sortDirection === 'desc' }"
                          @click="sortBy('salary')"
                        />
                      </div>
                      <UButton
                        @click="openTextFilterMenu($event, 'salary')"
                        variant="outline"
                        size="sm"
                        icon="i-heroicons-funnel"
                        :color="textFilters.salary ? 'primary' : 'gray'"
                        class="ml-2"
                      />
                    </div>
                    <UInput
                      v-model="filters.salary"
                      placeholder="Salaire..."
                      size="xs"
                      icon="i-heroicons-currency-euro"
                      @input="handleFilter"
                      @click.stop
                    />
                  </div>
                </th>
                <th class="px-6 py-3 text-left border border-gray-400 bg-gray-100">
                  <div class="space-y-2">
                    <div class="flex items-center space-x-2">
                      <span class="text-xs font-medium text-gray-700 uppercase tracking-wider">Référence</span>
                      <div class="flex flex-col items-center">
                        <Icon
                          v-if="sortColumn !== 'office' || sortDirection === 'desc'"
                          name="i-heroicons-chevron-up"
                          class="w-3 h-3 text-gray-500 hover:text-gray-700 cursor-pointer"
                          :class="{ 'text-blue-600': sortColumn === 'office' && sortDirection === 'asc' }"
                          @click="sortBy('office')"
                        />
                        <Icon
                          v-if="sortColumn !== 'office' || sortDirection === 'asc'"
                          name="i-heroicons-chevron-down"
                          class="w-3 h-3 text-gray-500 hover:text-gray-700 cursor-pointer"
                          :class="{ 'text-blue-600': sortColumn === 'office' && sortDirection === 'desc' }"
                          @click="sortBy('office')"
                        />
                      </div>
                      <UButton
                        @click="openTextFilterMenu($event, 'office')"
                        variant="outline"
                        size="sm"
                        icon="i-heroicons-funnel"
                        :color="textFilters.office ? 'primary' : 'gray'"
                        class="ml-2"
                      />
                    </div>
                    <UInput
                      v-model="filters.office"
                      placeholder="Bureau..."
                      size="xs"
                      icon="i-heroicons-building-office"
                      @input="handleFilter"
                      @click.stop
                    />
                  </div>
                </th>
                <th class="px-6 py-3 text-left border border-gray-400 bg-gray-100">
                  <div class="space-y-2">
                    <div class="flex items-center space-x-2">
                      <span class="text-xs font-medium text-gray-700 uppercase tracking-wider">Service traitant</span>
                      <div class="flex flex-col items-center">
                        <Icon
                          v-if="sortColumn !== 'age' || sortDirection === 'desc'"
                          name="i-heroicons-chevron-up"
                          class="w-3 h-3 text-gray-500 hover:text-gray-700 cursor-pointer"
                          :class="{ 'text-blue-600': sortColumn === 'age' && sortDirection === 'asc' }"
                          @click="sortBy('age')"
                        />
                        <Icon
                          v-if="sortColumn !== 'age' || sortDirection === 'asc'"
                          name="i-heroicons-chevron-down"
                          class="w-3 h-3 text-gray-500 hover:text-gray-700 cursor-pointer"
                          :class="{ 'text-blue-600': sortColumn === 'age' && sortDirection === 'desc' }"
                          @click="sortBy('age')"
                        />
                      </div>
                      <UButton
                        @click="openTextFilterMenu($event, 'age')"
                        variant="outline"
                        size="sm"
                        icon="i-heroicons-funnel"
                        :color="textFilters.age ? 'primary' : 'gray'"
                        class="ml-2"
                      />
                    </div>
                    <UInput
                      v-model="filters.age"
                      placeholder="Âge exact..."
                      size="xs"
                      icon="i-heroicons-user"
                      @input="handleFilter"
                      @click.stop
                    />
                  </div>
                </th>
                <th class="px-6 py-3 text-left border border-gray-400 bg-gray-100">
                  <div class="space-y-2">
                    <div class="flex items-center space-x-2">
                      <span class="text-xs font-medium text-gray-700 uppercase tracking-wider">Date d'Affectation</span>
                      <div class="flex flex-col items-center">
                        <Icon
                          v-if="sortColumn !== 'startDate' || sortDirection === 'desc'"
                          name="i-heroicons-chevron-up"
                          class="w-3 h-3 text-gray-500 hover:text-gray-700 cursor-pointer"
                          :class="{ 'text-blue-600': sortColumn === 'startDate' && sortDirection === 'asc' }"
                          @click="sortBy('startDate')"
                        />
                        <Icon
                          v-if="sortColumn !== 'startDate' || sortDirection === 'asc'"
                          name="i-heroicons-chevron-down"
                          class="w-3 h-3 text-gray-500 hover:text-gray-700 cursor-pointer"
                          :class="{ 'text-blue-600': sortColumn === 'startDate' && sortDirection === 'desc' }"
                          @click="sortBy('startDate')"
                        />
                      </div>
                      <UButton
                        @click="openTextFilterMenu($event, 'startDate')"
                        variant="outline"
                        size="sm"
                        icon="i-heroicons-funnel"
                        :color="textFilters.startDate ? 'primary' : 'gray'"
                        class="ml-2"
                      />
                    </div>
                    <UInput
                      v-model="filters.startDate"
                      placeholder="Date..."
                      size="xs"
                      icon="i-heroicons-calendar"
                      @input="handleFilter"
                      @click.stop
                    />
                  </div>
                </th>

                <th class="px-6 py-3 text-left border border-gray-400 bg-gray-100">
                  <div class="space-y-2">
                    <div class="flex items-center space-x-2">
                      <span class="text-xs font-medium text-gray-700 uppercase tracking-wider">Statut</span>
                      <div class="flex flex-col items-center">
                        <Icon
                          v-if="sortColumn !== 'startDate' || sortDirection === 'desc'"
                          name="i-heroicons-chevron-up"
                          class="w-3 h-3 text-gray-500 hover:text-gray-700 cursor-pointer"
                          :class="{ 'text-blue-600': sortColumn === 'startDate' && sortDirection === 'asc' }"
                          @click="sortBy('startDate')"
                        />
                        <Icon
                          v-if="sortColumn !== 'startDate' || sortDirection === 'asc'"
                          name="i-heroicons-chevron-down"
                          class="w-3 h-3 text-gray-500 hover:text-gray-700 cursor-pointer"
                          :class="{ 'text-blue-600': sortColumn === 'startDate' && sortDirection === 'desc' }"
                          @click="sortBy('startDate')"
                        />
                      </div>
                      <UButton
                        @click="openTextFilterMenu($event, 'startDate')"
                        variant="outline"
                        size="sm"
                        icon="i-heroicons-funnel"
                        :color="textFilters.startDate ? 'primary' : 'gray'"
                        class="ml-2"
                      />
                    </div>
                    <UInput
                      v-model="filters.startDate"
                      placeholder="Date..."
                      size="xs"
                      icon="i-heroicons-calendar"
                      @input="handleFilter"
                      @click.stop
                    />
                  </div>
                </th>

                <th class="px-6 py-3 text-left border border-gray-400 bg-gray-100">
                  <div class="space-y-2">
                    <div class="flex items-center space-x-2">
                      <span class="text-xs font-medium text-gray-700 uppercase tracking-wider">Priorité</span>
                      <div class="flex flex-col items-center">
                        <Icon
                          v-if="sortColumn !== 'startDate' || sortDirection === 'desc'"
                          name="i-heroicons-chevron-up"
                          class="w-3 h-3 text-gray-500 hover:text-gray-700 cursor-pointer"
                          :class="{ 'text-blue-600': sortColumn === 'startDate' && sortDirection === 'asc' }"
                          @click="sortBy('startDate')"
                        />
                        <Icon
                          v-if="sortColumn !== 'startDate' || sortDirection === 'asc'"
                          name="i-heroicons-chevron-down"
                          class="w-3 h-3 text-gray-500 hover:text-gray-700 cursor-pointer"
                          :class="{ 'text-blue-600': sortColumn === 'startDate' && sortDirection === 'desc' }"
                          @click="sortBy('startDate')"
                        />
                      </div>
                      <UButton
                        @click="openTextFilterMenu($event, 'startDate')"
                        variant="outline"
                        size="sm"
                        icon="i-heroicons-funnel"
                        :color="textFilters.startDate ? 'primary' : 'gray'"
                        class="ml-2"
                      />
                    </div>
                    <UInput
                      v-model="filters.startDate"
                      placeholder="Date..."
                      size="xs"
                      icon="i-heroicons-calendar"
                      @input="handleFilter"
                      @click.stop
                    />
                  </div>
                </th>
              
                <th class="px-6 py-3 text-right border border-gray-400 bg-gray-100">
                  <span class="text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</span>
                </th>
                
              </tr>
            </thead>
            <tbody class="bg-white">
              <tr 
                v-for="(item, index) in paginatedData" 
                :key="item.id" 
                class="transition-colors"
                :class="{ 
                  'bg-blue-50': selectedRows.includes(item.id),
                  'bg-gray-50': index % 2 === 0 && !selectedRows.includes(item.id),
                  'bg-white': index % 2 === 1 && !selectedRows.includes(item.id),
                  'hover:bg-blue-100': !selectedRows.includes(item.id),
                  'hover:bg-blue-200': selectedRows.includes(item.id)
                }"
              >
            
                <td class="px-6 py-4 border border-gray-300">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <img :src="item.avatar" :alt="item.name" class="h-10 w-10 rounded-full ring-2 ring-gray-200">
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ item.name }}</div>
                      <div class="text-sm text-gray-500">{{ item.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 border border-gray-300">
                  <UBadge color="blue" variant="soft" size="xs">
                    {{ item.position }}
                  </UBadge>
                </td>
                <td class="px-6 py-4 border border-gray-300 text-sm text-gray-900">
                  {{ item.office }}
                </td>
                <td class="px-6 py-4 border border-gray-300">
                  <div class="text-sm font-medium text-gray-900">{{ item.salary }}</div>
                </td>
                <td class="px-6 py-4 border border-gray-300">
                  <div class="flex items-center">
                    <span class="text-sm text-gray-900">{{ item.age }}</span>
                    <span class="ml-2 text-xs text-gray-500">ans</span>
                  </div>
                </td>
                <td class="px-6 py-4 border border-gray-300 text-sm text-gray-900">
                  {{ formatDate(item.startDate) }}
                </td>
                
                <td class="px-6 py-4 border border-gray-300">
                  <UCheckbox
                    :model-value="selectedRows.includes(item.id)"
                    @change="toggleRowSelection(item.id)"
                  />
                </td>
                <td class="px-6 py-4 border border-gray-300">
                  <UCheckbox
                    :model-value="selectedRows.includes(item.id)"
                    @change="toggleRowSelection(item.id)"
                  />
                </td>
                
                <td class="px-6 py-4 border border-gray-300 text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <UButton
                      @click="editItem(item)"
                      variant="ghost"
                      size="xs"
                      icon="i-heroicons-pencil"
                      color="blue"
                    />
                    <UButton
                      @click="deleteItem(item)"
                      variant="ghost"
                      size="xs"
                      icon="i-heroicons-trash"
                      color="red"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="paginatedData.length === 0" class="text-center py-12">
          <Icon name="i-heroicons-inbox" class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun résultat</h3>
          <p class="mt-1 text-sm text-gray-500">Essayez d'ajuster vos filtres ou votre recherche.</p>
        </div>

        <!-- Enhanced Pagination -->
        <div class="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Affichage de {{ startIndex + 1 }} à {{ endIndex }} sur {{ filteredData.length }} résultats
              <span v-if="filteredData.length !== archiveData.length" class="ml-2">
                ({{ archiveData.length }} total)
              </span>
            </div>
            <div class="flex items-center space-x-2">
              <UButton
                :disabled="currentPage === 1"
                @click="currentPage--"
                variant="outline"
                size="sm"
                icon="i-heroicons-chevron-left"
              >
                Précédent
              </UButton>
              <div class="flex space-x-1">
                <UButton
                  v-for="page in visiblePages"
                  :key="page"
                  @click="currentPage = page"
                  :variant="currentPage === page ? 'solid' : 'outline'"
                  size="sm"
                  :color="currentPage === page ? 'primary' : 'gray'"
                >
                  {{ page }}
                </UButton>
              </div>
              <UButton
                :disabled="currentPage === totalPages"
                @click="currentPage++"
                variant="outline"
                size="sm"
                icon="i-heroicons-chevron-right"
                trailing
              >
                Suivant
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Text Filter Context Menu -->
  <div
    v-if="textFilterMenu.show"
    class="fixed z-50 bg-white border border-gray-300 rounded-lg shadow-lg min-w-80 max-h-96"
    :style="{ left: textFilterMenu.x + 'px', top: textFilterMenu.y + 'px' }"
    @click.stop
  >
    <div class="p-4">
      <!-- Header -->
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-medium text-gray-900">
          Filtre - {{ getColumnLabel(textFilterMenu.column) }}
        </h3>
        <div class="flex items-center space-x-2">
          <UBadge
            v-if="getSelectedCount(textFilterMenu.column) > 0"
            color="blue"
            variant="solid"
            size="xs"
          >
            {{ getSelectedCount(textFilterMenu.column) }}
          </UBadge>
          <UButton
            @click="closeTextFilterMenu"
            variant="ghost"
            size="xs"
            icon="i-heroicons-x-mark"
          />
        </div>
      </div>
      
      <!-- Search Input -->
      <UInput
        v-model="filterSearch"
        placeholder="Search..."
        icon="i-heroicons-magnifying-glass"
        size="sm"
        class="mb-3"
      />
      
      <!-- Options List -->
      <div class="max-h-48 overflow-y-auto border border-gray-200 rounded">
        <!-- Select All Option -->
        <div class="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer border-b">
          <UCheckbox
            :model-value="isAllSelected(textFilterMenu.column)"
            :indeterminate="isIndeterminate(textFilterMenu.column)"
            @change="toggleSelectAllOptions(textFilterMenu.column)"
            size="sm"
            class="mr-3"
          />
          <span class="text-sm text-gray-700">(Select All)</span>
        </div>
        
        <!-- Individual Options -->
        <div
          v-for="option in getFilteredOptions(textFilterMenu.column)"
          :key="option.value"
          class="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
          @click="toggleOption(textFilterMenu.column, option.value)"
        >
          <UCheckbox
            :model-value="isSelected(textFilterMenu.column, option.value)"
            @change="toggleOption(textFilterMenu.column, option.value)"
            size="sm"
            class="mr-3"
          />
          <div class="flex items-center flex-1">
            <!-- Icon for some columns -->
            <Icon
              v-if="getColumnIcon(textFilterMenu.column, option.value)"
              :name="getColumnIcon(textFilterMenu.column, option.value)"
              class="w-4 h-4 mr-2"
            />
            <span class="text-sm text-gray-700">{{ option.label }}</span>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
        <span class="text-xs text-gray-500">
          {{ getSelectedCount(textFilterMenu.column) }} sélectionné(s)
        </span>
        <UButton
          v-if="getSelectedCount(textFilterMenu.column) > 0"
          @click="resetMultiSelectFilter(textFilterMenu.column)"
          variant="outline"
          size="xs"
          icon="i-heroicons-arrow-path"
        >
          Reset
        </UButton>
      </div>
    </div>
  </div>

  <!-- Overlay to close context menu -->
  <div
    v-if="textFilterMenu.show"
    class="fixed inset-0 z-40"
    @click="closeTextFilterMenu"
  />
</template>

<script setup>
// Reactive data
const globalSearch = ref('')
const showAdvancedFilters = ref(false)
const refreshing = ref(false)
const selectedRows = ref([])
const textFilterMenu = ref({
  show: false,
  column: null,
  x: 0,
  y: 0
})
const textFilters = ref({
  name: '',
  position: '',
  office: '',
  age: '',
  startDate: '',
  salary: ''
})
const multiSelectFilters = ref({
  position: [],
  office: [],
  age: [],
  salary: []
})
const filterSearch = ref('')
const filters = ref({
  name: '',
  position: '',
  office: '',
  age: '',
  ageRange: '',
  startDate: '',
  salary: '',
  minSalary: ''
})
const currentPage = ref(1)
const itemsPerPage = ref(10)
const sortColumn = ref('name')
const sortDirection = ref('asc')

// Table columns
const columns = [
  { key: 'name', label: 'Utilisateur' },
  { key: 'position', label: 'Position' },
  { key: 'office', label: 'Bureau' },
  { key: 'age', label: 'Âge' },
  { key: 'startDate', label: 'Date de début' },
  { key: 'salary', label: 'Salaire' }
]

// Options pour les filtres multi-sélection
const getFilterOptions = (column) => {
  const options = [...new Set(archiveData.map(item => item[column]))]
  return options.map(value => ({
    value: value,
    label: value.toString()
  })).sort((a, b) => a.label.localeCompare(b.label))
}

const getFilteredOptions = (column) => {
  const allOptions = getFilterOptions(column)
  if (!filterSearch.value) return allOptions
  
  const searchQuery = filterSearch.value.toLowerCase()
  return allOptions.filter(option => 
    option.label.toLowerCase().includes(searchQuery)
  )
}

const isSelected = (column, value) => {
  return multiSelectFilters.value[column]?.includes(value) || false
}

const getSelectedCount = (column) => {
  return multiSelectFilters.value[column]?.length || 0
}

const isAllSelected = (column) => {
  const allOptions = getFilterOptions(column)
  const selected = multiSelectFilters.value[column] || []
  return allOptions.length > 0 && selected.length === allOptions.length
}

const isIndeterminate = (column) => {
  const allOptions = getFilterOptions(column)
  const selected = multiSelectFilters.value[column] || []
  return selected.length > 0 && selected.length < allOptions.length
}

const toggleOption = (column, value) => {
  if (!multiSelectFilters.value[column]) {
    multiSelectFilters.value[column] = []
  }
  
  const index = multiSelectFilters.value[column].indexOf(value)
  if (index > -1) {
    multiSelectFilters.value[column].splice(index, 1)
  } else {
    multiSelectFilters.value[column].push(value)
  }
  
  handleTextFilter()
}

const toggleSelectAllOptions = (column) => {
  const allOptions = getFilterOptions(column)
  const selected = multiSelectFilters.value[column] || []
  
  if (selected.length === allOptions.length) {
    // Deselect all
    multiSelectFilters.value[column] = []
  } else {
    // Select all
    multiSelectFilters.value[column] = allOptions.map(option => option.value)
  }
  
  handleTextFilter()
}

const resetMultiSelectFilter = (column) => {
  multiSelectFilters.value[column] = []
  handleTextFilter()
}

const getColumnIcon = (column, value) => {
  // Return icons for specific columns if needed
  switch (column) {
    case 'office':
      const officeIcons = {
        'Tokyo': 'i-heroicons-globe-asia-australia',
        'Londres': 'i-heroicons-globe-europe-africa',
        'San Francisco': 'i-heroicons-globe-americas',
        'New York': 'i-heroicons-building-office-2',
        'Édimbourg': 'i-heroicons-building-office'
      }
      return officeIcons[value]
    default:
      return null
  }
}

const ageRangeOptions = [
  { label: '20-29 ans', value: '20-29' },
  { label: '30-39 ans', value: '30-39' },
  { label: '40-49 ans', value: '40-49' },
  { label: '50+ ans', value: '50+' }
]

// Sample data
const archiveData = [
  {
    id: 1,
    name: 'Airi Satou',
    email: 'airi.satou@example.com',
    position: 'Comptable',
    office: 'Tokyo',
    age: 33,
    startDate: '2008-11-28',
    salary: '162 700 €',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: 2,
    name: 'Angelica Ramos',
    email: 'angelica.ramos@example.com',
    position: 'Directrice Générale',
    office: 'Londres',
    age: 47,
    startDate: '2009-10-09',
    salary: '1 200 000 €',
    avatar: 'https://i.pravatar.cc/150?img=2'
  },
  {
    id: 3,
    name: 'Ashton Cox',
    email: 'ashton.cox@example.com',
    position: 'Développeur Junior',
    office: 'San Francisco',
    age: 28,
    startDate: '2009-01-12',
    salary: '86 000 €',
    avatar: 'https://i.pravatar.cc/150?img=3'
  },
  {
    id: 4,
    name: 'Bradley Greer',
    email: 'bradley.greer@example.com',
    position: 'Ingénieur Logiciel',
    office: 'Londres',
    age: 35,
    startDate: '2012-10-13',
    salary: '132 000 €',
    avatar: 'https://i.pravatar.cc/150?img=4'
  },
  {
    id: 5,
    name: 'Brenden Wagner',
    email: 'brenden.wagner@example.com',
    position: 'Développeur Senior',
    office: 'San Francisco',
    age: 41,
    startDate: '2011-06-07',
    salary: '206 850 €',
    avatar: 'https://i.pravatar.cc/150?img=5'
  },
  {
    id: 6,
    name: 'Brielle Williamson',
    email: 'brielle.williamson@example.com',
    position: 'Intégratrice',
    office: 'New York',
    age: 29,
    startDate: '2012-12-02',
    salary: '372 000 €',
    avatar: 'https://i.pravatar.cc/150?img=6'
  },
  {
    id: 7,
    name: 'Bruno Nash',
    email: 'bruno.nash@example.com',
    position: 'Développeur Logiciel',
    office: 'Londres',
    age: 38,
    startDate: '2011-05-03',
    salary: '163 500 €',
    avatar: 'https://i.pravatar.cc/150?img=7'
  },
  {
    id: 8,
    name: 'Caesar Vance',
    email: 'caesar.vance@example.com',
    position: 'Pré-vente Technique',
    office: 'New York',
    age: 32,
    startDate: '2011-12-12',
    salary: '106 450 €',
    avatar: 'https://i.pravatar.cc/150?img=8'
  },
  {
    id: 9,
    name: 'Cara Stevens',
    email: 'cara.stevens@example.com',
    position: 'Assistante Ventes',
    office: 'New York',
    age: 27,
    startDate: '2011-12-06',
    salary: '145 600 €',
    avatar: 'https://i.pravatar.cc/150?img=9'
  },
  {
    id: 10,
    name: 'Cedric Kelly',
    email: 'cedric.kelly@example.com',
    position: 'Développeur Senior',
    office: 'Édimbourg',
    age: 45,
    startDate: '2012-03-29',
    salary: '433 060 €',
    avatar: 'https://i.pravatar.cc/150?img=10'
  }
]

// Computed properties
const activeFiltersCount = computed(() => {
  return Object.values(filters.value).filter(value => value !== '').length
})

const hasActiveFilters = computed(() => {
  return Object.values(filters.value).some(value => value !== '') || globalSearch.value
})

const selectAll = computed({
  get: () => selectedRows.value.length === paginatedData.value.length && paginatedData.value.length > 0,
  set: (value) => {
    if (value) {
      selectedRows.value = paginatedData.value.map(item => item.id)
    } else {
      selectedRows.value = []
    }
  }
})

const isIndeterminateSelection = computed(() => {
  return selectedRows.value.length > 0 && selectedRows.value.length < paginatedData.value.length
})

const filteredData = computed(() => {
  let filtered = archiveData
  
  // Recherche globale
  if (globalSearch.value) {
    const query = globalSearch.value.toLowerCase()
    filtered = filtered.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query) ||
      item.position.toLowerCase().includes(query) ||
      item.office.toLowerCase().includes(query) ||
      item.salary.toLowerCase().includes(query)
    )
  }
  
  // Multi-select filters (prioritaires pour certaines colonnes)
  if (multiSelectFilters.value.position && multiSelectFilters.value.position.length > 0) {
    filtered = filtered.filter(item => 
      multiSelectFilters.value.position.includes(item.position)
    )
  }
  
  if (multiSelectFilters.value.office && multiSelectFilters.value.office.length > 0) {
    filtered = filtered.filter(item => 
      multiSelectFilters.value.office.includes(item.office)
    )
  }
  
  if (multiSelectFilters.value.age && multiSelectFilters.value.age.length > 0) {
    filtered = filtered.filter(item => 
      multiSelectFilters.value.age.includes(item.age.toString())
    )
  }
  
  if (multiSelectFilters.value.salary && multiSelectFilters.value.salary.length > 0) {
    filtered = filtered.filter(item => 
      multiSelectFilters.value.salary.includes(item.salary)
    )
  }
  
  // Text-filters par colonne (pour les autres colonnes)
  if (textFilters.value.name) {
    const query = textFilters.value.name.toLowerCase()
    filtered = filtered.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query)
    )
  }
  
  if (textFilters.value.startDate) {
    const query = textFilters.value.startDate.toLowerCase()
    filtered = filtered.filter(item => 
      item.startDate.toLowerCase().includes(query)
    )
  }
  
  // Filtres avancés existants
  if (filters.value.name) {
    const nameQuery = filters.value.name.toLowerCase()
    filtered = filtered.filter(item => 
      item.name.toLowerCase().includes(nameQuery) ||
      item.email.toLowerCase().includes(nameQuery)
    )
  }
  
  if (filters.value.position) {
    const positionQuery = filters.value.position.toLowerCase()
    filtered = filtered.filter(item => 
      item.position.toLowerCase().includes(positionQuery)
    )
  }
  
  if (filters.value.office) {
    const officeQuery = filters.value.office.toLowerCase()
    filtered = filtered.filter(item => 
      item.office.toLowerCase().includes(officeQuery)
    )
  }
  
  // Filtre par âge exact
  if (filters.value.age) {
    const ageValue = parseInt(filters.value.age.trim())
    if (!isNaN(ageValue)) {
      filtered = filtered.filter(item => item.age === ageValue)
    }
  }
  
  // Filtre par tranche d'âge (plus flexible)
  if (filters.value.ageRange) {
    const ageQuery = filters.value.ageRange.toLowerCase()
    filtered = filtered.filter(item => {
      const age = item.age
      // Support pour différents formats: "30-39", "30+", "30", "30-40"
      if (ageQuery.includes('-')) {
        const [min, max] = ageQuery.split('-').map(v => parseInt(v.trim()))
        return age >= min && age <= max
      } else if (ageQuery.includes('+')) {
        const min = parseInt(ageQuery.replace('+', '').trim())
        return age >= min
      } else {
        const targetAge = parseInt(ageQuery.trim())
        return !isNaN(targetAge) && age === targetAge
      }
    })
  }
  
  // Filtre par date de début
  if (filters.value.startDate) {
    const dateQuery = filters.value.startDate.toLowerCase()
    filtered = filtered.filter(item => 
      item.startDate.toLowerCase().includes(dateQuery)
    )
  }
  
  // Filtre par salaire
  if (filters.value.salary) {
    const salaryQuery = filters.value.salary.toLowerCase()
    filtered = filtered.filter(item => 
      item.salary.toLowerCase().includes(salaryQuery)
    )
  }
  
  // Filtre par salaire minimum
  if (filters.value.minSalary) {
    const minSalary = parseInt(filters.value.minSalary.replace(/\D/g, ''))
    filtered = filtered.filter(item => {
      const salary = parseInt(item.salary.replace(/\D/g, ''))
      return salary >= minSalary
    })
  }
  
  return filtered
})

const sortedData = computed(() => {
  const data = [...filteredData.value]
  return data.sort((a, b) => {
    let aVal = a[sortColumn.value]
    let bVal = b[sortColumn.value]
    
    // Handle numeric values
    if (sortColumn.value === 'age') {
      aVal = parseInt(aVal)
      bVal = parseInt(bVal)
    } else if (sortColumn.value === 'salary') {
      aVal = parseInt(aVal.replace(/\D/g, ''))
      bVal = parseInt(bVal.replace(/\D/g, ''))
    }
    
    if (sortDirection.value === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })
})

const totalPages = computed(() => Math.ceil(sortedData.value.length / itemsPerPage.value))

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)

const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, sortedData.value.length))

const paginatedData = computed(() => {
  return sortedData.value.slice(startIndex.value, startIndex.value + itemsPerPage.value)
})

const visiblePages = computed(() => {
  const delta = 2
  const range = []
  const rangeWithDots = []
  let l

  for (let i = 1; i <= totalPages.value; i++) {
    if (i === 1 || i === totalPages.value || (i >= currentPage.value - delta && i <= currentPage.value + delta)) {
      range.push(i)
    }
  }

  range.forEach((i) => {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (i - l !== 1) {
        rangeWithDots.push('...')
      }
    }
    rangeWithDots.push(i)
    l = i
  })

  return rangeWithDots.filter(page => page !== '...')
})

// Methods
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  })
}

const sortBy = (column) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortDirection.value = 'asc'
  }
}

const handleGlobalSearch = () => {
  currentPage.value = 1
}

const handleFilter = () => {
  currentPage.value = 1
}

const handleTextFilter = () => {
  currentPage.value = 1
}

const openTextFilterMenu = (event, column) => {
  event.stopPropagation()
  const rect = event.target.getBoundingClientRect()
  textFilterMenu.value = {
    show: true,
    column: column,
    x: rect.left,
    y: rect.bottom + 5
  }
}

const closeTextFilterMenu = () => {
  textFilterMenu.value = {
    show: false,
    column: null,
    x: 0,
    y: 0
  }
}

const getColumnLabel = (column) => {
  const columnObj = columns.find(col => col.key === column)
  return columnObj ? columnObj.label : column
}

const getTextFilterCount = (column) => {
  if (!textFilters.value[column]) return 0
  
  const query = textFilters.value[column].toLowerCase()
  let count = 0
  
  archiveData.forEach(item => {
    let value = ''
    
    switch (column) {
      case 'name':
        value = item.name + ' ' + item.email
        break
      case 'position':
        value = item.position
        break
      case 'office':
        value = item.office
        break
      case 'age':
        value = item.age.toString()
        break
      case 'startDate':
        value = item.startDate
        break
      case 'salary':
        value = item.salary
        break
    }
    
    if (value.toLowerCase().includes(query)) {
      count++
    }
  })
  
  return count
}

const clearTextFilter = (column) => {
  textFilters.value[column] = ''
  handleTextFilter()
  closeTextFilterMenu()
}

const toggleAdvancedFilters = () => {
  showAdvancedFilters.value = !showAdvancedFilters.value
}

const clearFilters = () => {
  filters.value = {
    name: '',
    position: '',
    office: '',
    age: '',
    ageRange: '',
    startDate: '',
    salary: '',
    minSalary: ''
  }
  textFilters.value = {
    name: '',
    position: '',
    office: '',
    age: '',
    startDate: '',
    salary: ''
  }
  multiSelectFilters.value = {
    position: [],
    office: [],
    age: [],
    salary: []
  }
  filterSearch.value = ''
  globalSearch.value = ''
  currentPage.value = 1
}

const resetAll = () => {
  clearFilters()
  currentPage.value = 1
  itemsPerPage.value = 10
  sortColumn.value = 'name'
  sortDirection.value = 'asc'
  selectedRows.value = []
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedRows.value = []
  } else {
    selectedRows.value = paginatedData.value.map(item => item.id)
  }
}

const toggleRowSelection = (id) => {
  const index = selectedRows.value.indexOf(id)
  if (index > -1) {
    selectedRows.value.splice(index, 1)
  } else {
    selectedRows.value.push(id)
  }
}

const refreshData = async () => {
  refreshing.value = true
  // Simuler un rafraîchissement des données
  await new Promise(resolve => setTimeout(resolve, 1000))
  refreshing.value = false
}

const exportData = () => {
  // Logique d'exportation
  const dataToExport = filteredData.value.map(item => ({
    Nom: item.name,
    Email: item.email,
    Position: item.position,
    Bureau: item.office,
    Âge: item.age,
    'Date de début': item.startDate,
    Salaire: item.salary
  }))
  
  console.log('Exportation des données:', dataToExport)
  // Implémenter l'exportation CSV/Excel ici
}

const editItem = (item) => {
  console.log('Éditer l\'élément:', item)
  // Ouvrir un modal de modification
}

const deleteItem = (item) => {
  console.log('Supprimer l\'élément:', item)
  // Implémenter la suppression
}

const deleteSelected = () => {
  console.log('Supprimer les éléments sélectionnés:', selectedRows.value)
  // Implémenter la suppression groupée
}

const updateItemsPerPage = () => {
  currentPage.value = 1
}

// Watch for changes in filtered data to reset current page if needed
watch(filteredData, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = 1
  }
})
</script>