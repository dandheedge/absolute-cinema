<template>
  <div class="movie-detail-page">
    <!-- Back Button -->
    <v-btn
      class="mb-4"
      prepend-icon="mdi-arrow-left"
      variant="text"
      @click="goBack"
    >
      Back
    </v-btn>

    <!-- Loading State -->
    <LoadingState v-if="movieDetailsStore.loading" message="Loading movie details..." type="detail" />

    <!-- Error State -->
    <ErrorState
      v-else-if="movieDetailsStore.hasError"
      :message="movieDetailsStore.error || undefined"
      @retry="handleRetry"
    />

    <!-- Movie Details -->
    <div v-else-if="movie" class="movie-detail">
      <v-row>
        <!-- Poster -->
        <v-col cols="12" lg="3" md="4">
          <v-img
            :alt="movie.title"
            aspect-ratio="2/3"
            class="movie-detail__poster"
            cover
            :src="moviePoster"
          >
            <template #placeholder>
              <v-skeleton-loader type="image" />
            </template>
          </v-img>

          <!-- Favorite Button -->
          <v-btn
            block
            class="mt-4"
            :color="isFavorite ? 'red' : 'primary'"
            :prepend-icon="isFavorite ? 'mdi-heart' : 'mdi-heart-outline'"
            size="large"
            :variant="isFavorite ? 'elevated' : 'outlined'"
            @click="handleToggleFavorite"
          >
            {{ isFavorite ? 'Remove from Favorites' : 'Add to Favorites' }}
          </v-btn>
        </v-col>

        <!-- Info -->
        <v-col cols="12" lg="9" md="8">
          <div class="movie-detail__info">
            <!-- Title -->
            <h1 class="text-h3 mb-2">{{ movie.title }}</h1>

            <!-- Meta Info -->
            <div class="movie-detail__meta">
              <v-chip v-if="movie.year" class="mr-2" size="small">
                {{ movie.year }}
              </v-chip>
              <v-chip v-if="movie.runtimeStr" class="mr-2" size="small">
                <v-icon size="small" start>mdi-clock-outline</v-icon>
                {{ movie.runtimeStr }}
              </v-chip>
              <v-chip v-if="movie.contentRating" size="small">
                {{ movie.contentRating }}
              </v-chip>
            </div>

            <!-- Ratings -->
            <div v-if="movie.imDbRating" class="movie-detail__ratings mt-4">
              <div class="rating-item">
                <v-icon color="amber" size="large">mdi-star</v-icon>
                <div class="ml-2">
                  <div class="text-h5">{{ movie.imDbRating }}</div>
                  <div class="text-caption">IMDb Rating</div>
                  <div v-if="movie.imDbRatingVotes" class="text-caption text-medium-emphasis">
                    {{ formatVotes(movie.imDbRatingVotes) }} votes
                  </div>
                </div>
              </div>

              <div v-if="movie.metacriticRating" class="rating-item ml-6">
                <div class="rating-score">{{ movie.metacriticRating }}</div>
                <div class="ml-2">
                  <div class="text-caption">Metacritic</div>
                </div>
              </div>
            </div>

            <!-- Genres -->
            <div v-if="movie.genreList && movie.genreList.length > 0" class="movie-detail__genres mt-4">
              <v-chip
                v-for="genre in movie.genreList"
                :key="genre.key"
                class="mr-2 mb-2"
                size="small"
                variant="outlined"
              >
                {{ genre.value }}
              </v-chip>
            </div>

            <!-- Plot -->
            <div v-if="movie.plot" class="movie-detail__plot mt-6">
              <h2 class="text-h6 mb-2">Plot</h2>
              <p class="text-body-1">{{ movie.plot }}</p>
            </div>

            <!-- Credits -->
            <div class="movie-detail__credits mt-6">
              <v-row>
                <v-col v-if="movie.directors" cols="12" sm="6">
                  <h3 class="text-subtitle-1 font-weight-bold mb-2">Director</h3>
                  <p class="text-body-2">{{ movie.directors }}</p>
                </v-col>
                <v-col v-if="movie.writers" cols="12" sm="6">
                  <h3 class="text-subtitle-1 font-weight-bold mb-2">Writers</h3>
                  <p class="text-body-2">{{ movie.writers }}</p>
                </v-col>
                <v-col v-if="movie.stars" cols="12">
                  <h3 class="text-subtitle-1 font-weight-bold mb-2">Stars</h3>
                  <p class="text-body-2">{{ movie.stars }}</p>
                </v-col>
              </v-row>
            </div>

            <!-- Additional Info -->
            <v-divider class="my-6" />

            <div class="movie-detail__additional">
              <v-row>
                <v-col v-if="movie.countries" cols="12" md="4" sm="6">
                  <div class="info-item">
                    <span class="info-item__label">Country</span>
                    <span class="info-item__value">{{ movie.countries }}</span>
                  </div>
                </v-col>
                <v-col v-if="movie.languages" cols="12" md="4" sm="6">
                  <div class="info-item">
                    <span class="info-item__label">Language</span>
                    <span class="info-item__value">{{ movie.languages }}</span>
                  </div>
                </v-col>
                <v-col v-if="movie.releaseDate" cols="12" md="4" sm="6">
                  <div class="info-item">
                    <span class="info-item__label">Release Date</span>
                    <span class="info-item__value">{{ formatDate(movie.releaseDate) }}</span>
                  </div>
                </v-col>
                <v-col v-if="movie.boxOffice?.grossUSA" cols="12" md="4" sm="6">
                  <div class="info-item">
                    <span class="info-item__label">Box Office (USA)</span>
                    <span class="info-item__value">{{ movie.boxOffice.grossUSA }}</span>
                  </div>
                </v-col>
                <v-col v-if="movie.awards" cols="12">
                  <div class="info-item">
                    <span class="info-item__label">Awards</span>
                    <span class="info-item__value">{{ movie.awards }}</span>
                  </div>
                </v-col>
              </v-row>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useFavoritesStore } from '@/stores/favorites'
  import { useMovieDetailsStore } from '@/stores/movieDetails'
  import { PLACEHOLDER_IMAGE } from '@/utils/constants'

  const route = useRoute()
  const router = useRouter()
  const movieDetailsStore = useMovieDetailsStore()
  const favoritesStore = useFavoritesStore()

  const movie = computed(() => movieDetailsStore.currentMovie)

  const moviePoster = computed(() => {
    return movie.value?.image || PLACEHOLDER_IMAGE
  })

  const isFavorite = computed(() => {
    if (!movie.value || !('id' in movie.value)) return false
    return favoritesStore.isFavorite(movie.value.id)
  })

  onMounted(async () => {
    const params = route.params as { id?: string | string[] }
    const imdbId = typeof params.id === 'string' ? params.id : (Array.isArray(params.id) ? params.id[0] : '')

    if (!imdbId) {
      router.push('/')
      return
    }

    try {
      await movieDetailsStore.fetchMovieDetails(imdbId)
    } catch {
    // Error is handled by the store
    }
  })

  function handleToggleFavorite () {
    if (!movie.value || !('id' in movie.value)) return

    // Create a MovieSearchResult object for the favorites store
    const movieData = {
      Title: movie.value.title,
      Year: Number.parseInt(movie.value.year) || 0,
      imdbID: movie.value.id,
    }

    favoritesStore.toggleFavorite(movieData)
  }

  function goBack () {
    if (window.history.length > 2) {
      router.back()
    } else {
      router.push('/')
    }
  }

  function handleRetry () {
    const params = route.params as { id?: string | string[] }
    const imdbId = typeof params.id === 'string' ? params.id : (Array.isArray(params.id) ? params.id[0] : '')
    if (imdbId) {
      movieDetailsStore.fetchMovieDetails(imdbId, true)
    }
  }

  function formatVotes (votes: string): string {
    const num = Number.parseInt(votes.replace(/,/g, ''))
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return votes
  }

  function formatDate (dateString: string): string {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return dateString
    }
  }
</script>

<style scoped lang="scss">
.movie-detail-page {
  max-width: 1400px;
  margin: 0 auto;
}

.movie-detail {
  &__poster {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }

  &__info {
    padding-left: 1rem;

    @media (max-width: 960px) {
      padding-left: 0;
      margin-top: 2rem;
    }
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  &__ratings {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  &__genres {
    display: flex;
    flex-wrap: wrap;
  }

  &__plot {
    line-height: 1.7;
  }

  &__credits {
    .text-body-2 {
      line-height: 1.6;
    }
  }
}

.rating-item {
  display: flex;
  align-items: center;
}

.rating-score {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: rgb(var(--v-theme-surface-variant));
  border-radius: 8px;
  font-size: 1.25rem;
  font-weight: 700;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  &__label {
    font-size: 0.875rem;
    font-weight: 500;
    opacity: 0.7;
  }

  &__value {
    font-size: 0.875rem;
  }
}
</style>
