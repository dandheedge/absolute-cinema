<template>
  <div class="search-page">
    <v-row>
      <!-- Filters Sidebar -->
      <v-col class="d-none d-md-block" cols="12" lg="2" md="3">
        <FilterPanel />
      </v-col>

      <!-- Main Content -->
      <v-col cols="12" lg="10" md="9">
        <!-- Search Bar -->
        <div class="search-page__search">
          <SearchBar
            v-model="searchQuery"
            :loading="moviesStore.loading"
            @clear="handleClear"
            @search="handleSearch"
          />
        </div>

        <!-- Mobile Filter Button -->
        <div class="d-md-none mt-4">
          <v-btn
            block
            prepend-icon="mdi-filter-variant"
            variant="outlined"
            @click="filterDrawer = true"
          >
            Filters
            <v-chip
              v-if="filtersStore.hasActiveFilters"
              class="ml-2"
              color="primary"
              size="small"
            >
              Active
            </v-chip>
          </v-btn>
        </div>

        <!-- Results Summary -->
        <div v-if="!moviesStore.loading && displayedMovies.length > 0" class="search-page__summary">
          <p class="text-body-2">
            <template v-if="searchQuery">
              Found {{ moviesStore.totalResults }} results for "{{ searchQuery }}"
            </template>
            <template v-else>
              Showing {{ moviesStore.totalResults }} movies
            </template>
            <template v-if="filtersStore.hasActiveFilters">
              ({{ displayedMovies.length }} after filters)
            </template>
          </p>
        </div>

        <!-- Loading State -->
        <LoadingState v-if="moviesStore.loading" type="grid" />

        <!-- Error State -->
        <ErrorState
          v-else-if="moviesStore.hasError"
          :message="moviesStore.error || undefined"
          @retry="handleRetry"
        />

        <!-- Empty State -->
        <EmptyState
          v-else-if="displayedMovies.length === 0 && !initialLoad"
          :message="searchQuery ? MESSAGES.NO_RESULTS : 'Enter a search term to find movies'"
          :title="searchQuery ? 'No movies found' : 'Start searching'"
          image-src="/src/assets/no-results.svg"
        />

        <!-- Movie Grid -->
        <v-row v-else>
          <v-col
            v-for="movie in displayedMovies"
            :key="movie.imdbID"
            cols="12"
            lg="4"
            md="6"
            sm="6"
            xl="3"
          >
            <MovieCard :movie="movie" :image-url="movie.imageUrl" />
          </v-col>
        </v-row>

        <!-- Pagination -->
        <Pagination
          v-if="!moviesStore.loading && displayedMovies.length > 0"
          :current-page="moviesStore.currentPage"
          :disabled="moviesStore.loading"
          :per-page="moviesStore.perPage"
          :total-pages="moviesStore.totalPages"
          :total-results="moviesStore.totalResults"
          @change="handlePageChange"
        />
      </v-col>
    </v-row>

    <!-- Mobile Filter Drawer -->
    <v-navigation-drawer
      v-model="filterDrawer"
      location="right"
      temporary
      width="300"
    >
      <v-toolbar color="primary" dark>
        <v-toolbar-title>Filters</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="filterDrawer = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <FilterPanel />
    </v-navigation-drawer>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useFiltersStore } from '@/stores/filters'
  import { useMoviesStore } from '@/stores/movies'
  import { MESSAGES } from '@/utils/constants'

  const route = useRoute()
  const router = useRouter()
  const moviesStore = useMoviesStore()
  const filtersStore = useFiltersStore()

  const searchQuery = ref('')
  const filterDrawer = ref(false)
  const initialLoad = ref(true)

  // Apply filters to movies
  const displayedMovies = computed(() => {
    return filtersStore.applyFilters(moviesStore.movies)
  })

  // Initialize from URL query params
  onMounted(async () => {
    const query = route.query.q as string || ''
    const page = Number.parseInt(route.query.page as string) || 1

    searchQuery.value = query
    await moviesStore.fetchMovies(query, page)
    initialLoad.value = false
  })

  // Watch for route changes (back/forward navigation)
  watch(
    () => route.query,
    async newQuery => {
      const query = newQuery.q as string || ''
      const page = Number.parseInt(newQuery.page as string) || 1

      if (query !== searchQuery.value) {
        searchQuery.value = query
      }

      if (page !== moviesStore.currentPage || query !== moviesStore.searchQuery) {
        await moviesStore.fetchMovies(query, page)
      }
    },
  )

  async function handleSearch (query: string) {
    await updateUrl(query, 1)
  }

  async function handleClear () {
    searchQuery.value = ''
    await updateUrl('', 1)
  }

  async function handlePageChange (page: number) {
    await updateUrl(searchQuery.value, page)
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleRetry () {
    await moviesStore.fetchMovies(searchQuery.value, moviesStore.currentPage)
  }

  async function updateUrl (query: string, page: number) {
    const newQuery: Record<string, string> = {}

    if (query) {
      newQuery.q = query
    }

    if (page > 1) {
      newQuery.page = String(page)
    }

    await router.push({
      path: route.path,
      query: newQuery,
    })
  }
</script>

<style scoped lang="scss">
.search-page {
  &__search {
    margin-bottom: 1.5rem;
  }

  &__summary {
    margin: 1rem 0;
    opacity: 0.7;
  }
}
</style>
