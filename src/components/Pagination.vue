<template>
  <div v-if="totalPages > 1" class="pagination">
    <div class="pagination__info">
      <span class="text-body-2">
        Showing {{ startItem }}-{{ endItem }} of {{ totalResults }} results
      </span>
    </div>

    <v-pagination
      :disabled="disabled"
      :length="totalPages"
      :model-value="currentPage"
      :total-visible="maxVisiblePages"
      @update:model-value="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { PAGINATION } from '@/utils/constants'

  interface Props {
    currentPage: number
    totalPages: number
    totalResults: number
    perPage?: number
    disabled?: boolean
  }

  interface Emits {
    (e: 'update:currentPage' | 'change', page: number): void
  }

  const props = withDefaults(defineProps<Props>(), {
    perPage: PAGINATION.ITEMS_PER_PAGE,
    disabled: false,
  })

  const emit = defineEmits<Emits>()

  const maxVisiblePages = PAGINATION.MAX_VISIBLE_PAGES

  const startItem = computed(() => {
    return (props.currentPage - 1) * props.perPage + 1
  })

  const endItem = computed(() => {
    const end = props.currentPage * props.perPage
    return Math.min(end, props.totalResults)
  })

  function handlePageChange (page: number) {
    emit('update:currentPage', page)
    emit('change', page)
  }
</script>

<style scoped lang="scss">
.pagination {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;

  &__info {
    opacity: 0.7;
  }
}
</style>
