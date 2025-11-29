<template>
  <v-text-field
    v-model="localQuery"
    :clearable="!!localQuery"
    density="comfortable"
    hide-details
    label="Search movies..."
    :loading="loading"
    prepend-inner-icon="mdi-magnify"
    variant="outlined"
    @click:clear="handleClear"
    @keyup.enter="handleSearch"
  />
</template>

<script setup lang="ts">
  import { useDebounceFn } from '@vueuse/core'
  import { ref, watch } from 'vue'
  import { SEARCH } from '@/utils/constants'

  interface Props {
    modelValue?: string
    loading?: boolean
    debounce?: number
  }

  interface Emits {
    (e: 'update:modelValue' | 'search', value: string): void
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
  watch(localQuery, newValue => {
    emit('update:modelValue', newValue)
    debouncedSearch(newValue)
  })

  // Watch prop changes
  watch(
    () => props.modelValue,
    newValue => {
      if (newValue !== localQuery.value) {
        localQuery.value = newValue
      }
    },
  )

  function handleSearch () {
    emit('search', localQuery.value)
  }

  function handleClear () {
    localQuery.value = ''
    emit('clear')
  }
</script>
