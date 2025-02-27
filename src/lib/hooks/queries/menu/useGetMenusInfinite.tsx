import { getMenus, GetMenusParams } from "@/api/menu"
import { useInfiniteQuery } from "@tanstack/react-query"

export const useGetMenusInfinite = (
  params: Omit<GetMenusParams, "page_size">
) => {
  return useInfiniteQuery({
    queryKey: ["menus", params.brand_id, params.service_type_id, params.search],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getMenus({
        ...params,
        page_size: pageParam, // Pass the current page as `page_size`
      })
      return response.data
    },
    getNextPageParam: (lastPage) => {
      return lastPage.current_page < lastPage.last_page
        ? lastPage.current_page + 1
        : undefined // Stop if there are no more pages
    },
    initialPageParam: 1,
    enabled: !!params.brand_id, // Only enable if brand_id is provided
  })
}
