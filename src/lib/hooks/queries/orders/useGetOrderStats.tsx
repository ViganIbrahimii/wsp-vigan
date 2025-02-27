import { getOrders, GetOrdersParams } from "@/api/orders"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export const useGetOrderStats = (params: GetOrdersParams) => {
  return useQuery({
    queryKey: ["orders-stats"],
    queryFn: () => getOrders(params),
    placeholderData: keepPreviousData,
  })
}
