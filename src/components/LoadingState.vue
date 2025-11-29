<template>
  <div class="loading-state">
    <v-row v-if="type === 'grid'">
      <v-col
        v-for="n in count"
        :key="n"
        cols="12"
        lg="3"
        md="4"
        sm="6"
      >
        <v-skeleton-loader type="card" />
      </v-col>
    </v-row>

    <v-skeleton-loader v-else-if="type === 'detail'" type="article, article" />

    <div v-else-if="type === 'list'" class="loading-state__list">
      <v-skeleton-loader
        v-for="n in count"
        :key="n"
        type="list-item-avatar-two-line"
      />
    </div>

    <div v-else class="loading-state__center">
      <v-progress-circular color="primary" indeterminate :size="size" />
      <p v-if="message" class="loading-state__message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    type?: 'grid' | 'detail' | 'list' | 'spinner'
    count?: number
    message?: string
    size?: number
  }

  withDefaults(defineProps<Props>(), {
    type: 'spinner',
    count: 8,
    message: '',
    size: 64,
  })
</script>

<style scoped lang="scss">
.loading-state {
  &__center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 3rem 1rem;
    min-height: 300px;
  }

  &__message {
    margin: 0;
    opacity: 0.7;
    font-size: 0.875rem;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
