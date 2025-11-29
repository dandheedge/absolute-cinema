<template>
  <v-card class="filter-panel" elevation="2">
    <v-card-title class="d-flex justify-space-between align-center">
      <span>Filters</span>
      <v-btn
        v-if="hasActiveFilters"
        color="primary"
        size="small"
        variant="text"
        @click="handleClearFilters"
      >
        Clear All
      </v-btn>
    </v-card-title>

    <v-divider />

    <v-card-text class="filter-panel__content">
      <!-- Sort By -->
      <div class="filter-section">
        <h4 class="filter-section__title">Sort By</h4>
        <v-select
          density="compact"
          hide-details
          :items="sortOptions"
          :model-value="sortBy"
          variant="outlined"
          @update:model-value="handleSortChange"
        />
      </div>

      <!-- Year Range -->
      <div class="filter-section">
        <h4 class="filter-section__title">Year Range</h4>
        <div class="year-range">
          <div class="year-range__labels">
            <span class="text-caption">{{ yearRange[0] }}</span>
            <span class="text-caption">{{ yearRange[1] }}</span>
          </div>
          <v-range-slider
            color="primary"
            hide-details
            :max="maxYear"
            :min="minYear"
            :model-value="yearRange"
            :step="1"
            @update:model-value="handleYearRangeChange"
          />
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import type { SortOption } from '@/stores/filters'
  import { computed } from 'vue'
  import { useFiltersStore } from '@/stores/filters'
  import { FILTERS, SORT_OPTIONS } from '@/utils/constants'

  const filtersStore = useFiltersStore()

  const sortBy = computed(() => filtersStore.sortBy)
  const yearRange = computed(() => filtersStore.yearRange)
  const hasActiveFilters = computed(() => filtersStore.hasActiveFilters)

  const sortOptions = SORT_OPTIONS.map(option => ({
    title: option.label,
    value: option.value,
  }))

  const minYear = FILTERS.MIN_YEAR
  const maxYear = FILTERS.MAX_YEAR

  function handleSortChange (value: SortOption) {
    filtersStore.setSortBy(value)
  }

  function handleYearRangeChange (value: number[] | number) {
    if (Array.isArray(value) && value.length === 2) {
      const min = value[0] ?? FILTERS.MIN_YEAR
      const max = value[1] ?? FILTERS.MAX_YEAR
      filtersStore.setYearRange(min, max)
    }
  }

  function handleClearFilters () {
    filtersStore.clearFilters()
  }
</script>

<style scoped lang="scss">
.filter-panel {
  height: 100%;

  &__content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
}

.filter-section {
  &__title {
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.75rem;
    opacity: 0.9;
  }
}

.year-range {
  &__labels {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    padding: 0 0.5rem;
  }
}
</style>
