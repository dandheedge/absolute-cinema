<template>
  <v-text-field
    v-model="localQuery"
    label="Search movies..."
    prepend-inner-icon="mdi-magnify"
    :clearable="!!localQuery"
    density="comfortable"
    variant="outlined"
    hide-details
    :loading="loading"
    @keyup.enter="handleSearch"
    @click:clear="handleClear"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { SEARCH } from '@/utils/constants'

interface Props {
  modelValue?: string
  loading?: boolean
  debounce?: number
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'search', value: string): void
  (e: 'clear'): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  loading: false,
  debounce: SEARCH.DEBOUNCE_DELAY,
})

const emit = defineEmits<Emits>()

const localQuery = ref(props.modelValue)

// Debounced search
const debouncedSearch = useDebounceFn(
  (value: string) => {
    emit('search', value)
  },
  props.debounce,
)

// Watch local changes and debounce
watch(localQuery, (newValue) => {
  emit('update:modelValue', newValue)
  debouncedSearch(newValue)
})

// Watch prop changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== localQuery.value) {
      localQuery.value = newValue
    }
  },
)

function handleSearch() {
  emit('search', localQuery.value)
}

function handleClear() {
  localQuery.value = ''
  emit('clear')
}
</script>

