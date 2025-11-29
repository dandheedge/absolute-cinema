<template>
  <v-app-bar color="primary" elevation="2">
    <v-app-bar-title class="app-navigation__title" @click="goHome">
      <v-icon class="app-navigation__icon">mdi-movie-open</v-icon>
      <span>Absolute Cinema</span>
    </v-app-bar-title>

    <v-spacer />

    <v-btn
      prepend-icon="mdi-magnify"
      :to="ROUTES.HOME"
      variant="text"
    >
      Search
    </v-btn>

    <v-btn
      class="app-navigation__favorites-btn"
      :to="ROUTES.FAVORITES"
      variant="text"
    >
      <v-badge
        v-if="favoriteCount > 0"
        color="red"
        :content="favoriteCount"
      >
        <v-icon>mdi-heart</v-icon>
      </v-badge>
      <v-icon v-else>mdi-heart-outline</v-icon>
      <span class="ml-2 d-none d-sm-inline">Favorites</span>
    </v-btn>
  </v-app-bar>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useFavoritesStore } from '@/stores/favorites'
  import { ROUTES } from '@/utils/constants'

  const router = useRouter()
  const favoritesStore = useFavoritesStore()

  const favoriteCount = computed(() => favoritesStore.favoriteCount)

  function goHome () {
    router.push(ROUTES.HOME)
  }
</script>

<style scoped lang="scss">
.app-navigation {
  &__title {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    user-select: none;

    &:hover {
      opacity: 0.9;
    }
  }

  &__icon {
    font-size: 1.75rem;
  }

  &__favorites-btn {
    .v-badge {
      display: inline-flex;
    }
  }
}
</style>
