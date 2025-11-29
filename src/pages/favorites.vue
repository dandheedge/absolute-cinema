<template>
  <div class="favorites-page">
    <v-row>
      <!-- Filters Sidebar -->
      <v-col class="d-none d-md-block" cols="12" lg="2" md="3">
        <FilterPanel />
      </v-col>

      <!-- Main Content -->
      <v-col cols="12" lg="10" md="9">
        <!-- Header -->
        <div class="favorites-page__header">
          <h1 class="text-h4 mb-2">
            <v-icon class="mr-2" color="red">mdi-heart</v-icon>
            My Favorites
          </h1>
          <p class="text-body-1 text-medium-emphasis">
            {{ favoritesStore.favoriteCount }} movie{{ favoritesStore.favoriteCount !== 1 ? 's' : '' }} saved
          </p>
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
        <div v-if="filteredFavorites.length > 0 && filtersStore.hasActiveFilters" class="favorites-page__summary">
          <p class="text-body-2">
            Showing {{ filteredFavorites.length }} of {{ favoritesStore.favoriteCount }} favorites
          </p>
        </div>

        <!-- Clear All Button -->
        <div v-if="favoritesStore.hasFavorites" class="favorites-page__actions">
          <v-btn
            color="error"
            prepend-icon="mdi-delete-outline"
            variant="outlined"
            @click="showClearDialog = true"
          >
            Clear All Favorites
          </v-btn>
        </div>

        <!-- Empty State -->
        <EmptyState
          v-if="!favoritesStore.hasFavorites"
          icon="mdi-heart-outline"
          :message="MESSAGES.NO_FAVORITES"
          title="No favorites yet"
        >
          <template #action>
            <v-btn
              color="primary"
              prepend-icon="mdi-magnify"
              to="/"
              variant="elevated"
            >
              Discover Movies
            </v-btn>
          </template>
        </EmptyState>

        <!-- No Results After Filtering -->
        <EmptyState
          v-else-if="filteredFavorites.length === 0"
          message="Try adjusting your filter settings"
          title="No favorites match your filters"
        />

        <!-- Favorites Grid -->
        <v-row v-else>
          <v-col
            v-for="movie in filteredFavorites"
            :key="movie.imdbID"
            cols="12"
            lg="4"
            md="6"
            sm="6"
            xl="3"
          >
            <MovieCard :movie="movie" />
          </v-col>
        </v-row>
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

    <!-- Clear All Confirmation Dialog -->
    <v-dialog v-model="showClearDialog" max-width="400">
      <v-card>
        <v-card-title>Clear All Favorites?</v-card-title>
        <v-card-text>
          This will remove all {{ favoritesStore.favoriteCount }} movies from your favorites. This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showClearDialog = false">
            Cancel
          </v-btn>
          <v-btn color="error" variant="elevated" @click="handleClearAll">
            Clear All
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useFavoritesStore } from '@/stores/favorites'
  import { useFiltersStore } from '@/stores/filters'
  import { MESSAGES } from '@/utils/constants'

  const favoritesStore = useFavoritesStore()
  const filtersStore = useFiltersStore()

  const filterDrawer = ref(false)
  const showClearDialog = ref(false)

  const filteredFavorites = computed(() => {
    return filtersStore.applyFilters(favoritesStore.favorites)
  })

  function handleClearAll () {
    favoritesStore.clearFavorites()
    showClearDialog.value = false
  }
</script>

<style scoped lang="scss">
.favorites-page {
  &__header {
    margin-bottom: 2rem;
  }

  &__summary {
    margin: 1rem 0;
    opacity: 0.7;
  }

  &__actions {
    margin-bottom: 1.5rem;
  }
}
</style>
