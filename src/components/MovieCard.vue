<template>
  <v-card
    class="movie-card"
    elevation="2"
    hover
    :to="`/movie/${movie.imdbID}`"
  >
    <div class="movie-card__image-wrapper">
      <v-img
        :alt="movie.Title"
        aspect-ratio="2/3"
        class="movie-card__image"
        cover
        :src="movieImage"
      >
        <template #placeholder>
          <v-skeleton-loader type="image" />
        </template>
      </v-img>

      <v-btn
        class="movie-card__favorite-btn"
        :color="isFavorite ? 'red' : 'white'"
        elevation="2"
        :icon="isFavorite ? 'mdi-heart' : 'mdi-heart-outline'"
        size="small"
        @click.prevent="handleToggleFavorite"
      />
    </div>

    <v-card-title class="movie-card__title">
      {{ movie.Title }}
    </v-card-title>

    <v-card-subtitle class="movie-card__year">
      {{ movie.Year }}
    </v-card-subtitle>
  </v-card>
</template>

<script setup lang="ts">
  import type { MovieSearchResult } from '@/api/types'
  import { computed } from 'vue'
  import { useFavoritesStore } from '@/stores/favorites'
  import { PLACEHOLDER_IMAGE } from '@/utils/constants'

  interface Props {
    movie: MovieSearchResult
    imageUrl?: string
  }

  const props = defineProps<Props>()

  const favoritesStore = useFavoritesStore()

  const isFavorite = computed(() => favoritesStore.isFavorite(props.movie.imdbID))

  const movieImage = computed(() => {
    return props.imageUrl || PLACEHOLDER_IMAGE
  })

  function handleToggleFavorite () {
    favoritesStore.toggleFavorite(props.movie)
  }
</script>

<style scoped lang="scss">
.movie-card {
  position: relative;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-4px);
  }

  &__image-wrapper {
    position: relative;
  }

  &__image {
    background-color: rgb(var(--v-theme-surface-variant));
  }

  &__favorite-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 1;
  }

  &__title {
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.3;
    word-break: break-word;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__year {
    opacity: 0.7;
  }
}
</style>
