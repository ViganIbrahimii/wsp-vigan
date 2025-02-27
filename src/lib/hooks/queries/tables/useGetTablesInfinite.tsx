import { getOrders, GetOrdersParams, GetOrdersResponse } from "@/api/orders"
import { getTables, GetTablesParams } from "@/api/tables"
import { keepPreviousData, useInfiniteQuery, useQueryClient } from "@tanstack/react-query"

export const useGetTablesInfinite = (
  params: Omit<GetTablesParams, "page_size">
) => {
  const queryClient = useQueryClient()
  
  const query = useInfiniteQuery({
    queryKey: ["tables", params],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getTables({
        ...params,
        page_size: pageParam,
      })
      return response.data
    },
    getNextPageParam: (lastPage) => {
      return lastPage.current_page < lastPage.last_page
        ? lastPage.current_page + 1
        : undefined
    },
    initialPageParam: 1,
    placeholderData: keepPreviousData,
  })

  const invalidateAndRefetch = async () => {
    await queryClient.invalidateQueries({ queryKey: ["orders", params] })
  }

  return { ...query, invalidateAndRefetch }
}
