import { getCategories, GetCategoriesParams } from "@/api/categories"
import { useInfiniteQuery } from "@tanstack/react-query"

export const useGetCategoriesInfinite = (
  params: Omit<GetCategoriesParams, "page_size">
) => {
  return useInfiniteQuery({
    queryKey: ["categories", params.menu_id, params.search, params.status],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getCategories({
        ...params,
        page_size: pageParam, // Use pageParam as the current page
      })
      return response.data
    },
    getNextPageParam: (lastPage) => {
      return lastPage.current_page < lastPage.last_page
        ? lastPage.current_page + 1
        : undefined // Stop fetching when the last page is reached
    },
    initialPageParam: 1,
    enabled: !!params.menu_id, // Ensure the query is only enabled when menu_id is provided
  })
}
