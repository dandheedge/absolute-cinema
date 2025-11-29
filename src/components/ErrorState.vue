<template>
  <div class="error-state">
    <v-icon class="error-state__icon" color="error" :size="iconSize">
      mdi-alert-circle-outline
    </v-icon>

    <h3 class="error-state__title">{{ title }}</h3>

    <p class="error-state__message">{{ message }}</p>

    <v-btn
      v-if="showRetry"
      color="primary"
      prepend-icon="mdi-refresh"
      variant="elevated"
      @click="$emit('retry')"
    >
      {{ retryText }}
    </v-btn>
  </div>
</template>

<script setup lang="ts">
  import { MESSAGES } from '@/utils/constants'

  interface Props {
    title?: string
    message?: string
    showRetry?: boolean
    retryText?: string
    iconSize?: number
  }

  interface Emits {
    (e: 'retry'): void
  }

  withDefaults(defineProps<Props>(), {
    title: 'Something went wrong',
    message: MESSAGES.NETWORK_ERROR,
    showRetry: true,
    retryText: MESSAGES.RETRY,
    iconSize: 64,
  })

  defineEmits<Emits>()
</script>

<style scoped lang="scss">
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 3rem 1rem;
  min-height: 300px;
  text-align: center;

  &__icon {
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
