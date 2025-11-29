<template>
  <div class="empty-state">
    <v-img
      :src="imageSrc"
      :width="imageSize"
      :height="imageSize"
      class="empty-state__image"
      alt="Empty state illustration"
    />

    <h3 class="empty-state__title">{{ title }}</h3>

    <p class="empty-state__message">{{ message }}</p>

    <slot name="action" />
  </div>
</template>

<script setup lang="ts">
  interface Props {
    title?: string
    message?: string
    imageSrc?: string
    imageSize?: number
  }

  withDefaults(defineProps<Props>(), {
    title: 'No results found',
    message: 'Try adjusting your search or filters',
    imageSrc: '',
    imageSize: 128,
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

  &__image {
    opacity: 0.7;
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
