import { computed, ref, type Ref } from 'vue'

export function useFilteredTable<T>(list: Ref<T[]>, getFilterStrBy: (item: T) => string) {
  const search = ref('')

  const filteredList = computed(() =>
    list.value.filter(
      (el) =>
        !search.value || getFilterStrBy(el).toLowerCase().includes(search.value.toLowerCase()),
    ),
  )

  return {
    search,
    list: filteredList,
  }
}
