import { getItems, GetItemsParams } from "@/api/items"
import { useInfiniteQuery } from "@tanstack/react-query"

export const useGetItemsInfinite = (
  params: Omit<GetItemsParams, "page_size">
) => {
  return useInfiniteQuery({
    queryKey: [
      "items",
      params.category_id,
      params.menu_id,
      params.is_dine_in_enabled,
      params.is_delivery_enabled,
      params.is_pickup_enabled,
      params.search,
    ],

    queryFn: async ({ pageParam = 1 }) => {
      const response = await getItems({
        ...params,
        page_size: pageParam, // Pass pageParam as the current page
      })
      return response.data
    },
    getNextPageParam: (lastPage) => {
      return lastPage.current_page < lastPage.last_page
        ? lastPage.current_page + 1
        : undefined // Stop fetching when the last page is reached
    },
    initialPageParam: 1,
    enabled:
      !!params.category_id &&
      params.category_id.length > 0 &&
      (params.is_dine_in_enabled ||
        params.is_delivery_enabled ||
        params.is_pickup_enabled),
  })
}
