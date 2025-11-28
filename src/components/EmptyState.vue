<template>
  <div class="empty-state">
    <v-icon :size="iconSize" color="grey" class="empty-state__icon">
      {{ icon }}
    </v-icon>

    <h3 class="empty-state__title">{{ title }}</h3>

    <p class="empty-state__message">{{ message }}</p>

    <slot name="action" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  message?: string
  icon?: string
  iconSize?: number
}

withDefaults(defineProps<Props>(), {
  title: 'No results found',
  message: 'Try adjusting your search or filters',
  icon: 'mdi-movie-open-outline',
  iconSize: 64,
})
</script>

<style scoped lang="scss">
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 3rem 1rem;
  min-height: 300px;
  text-align: center;

  &__icon {
    opacity: 0.5;
  }

  &__title {
    font-size: 1.25rem;
    font-weight: 500;
    margin: 0;
  }

  &__message {
    margin: 0;
    opacity: 0.7;
    max-width: 500px;
  }
}
</style>

