import { getOrders, GetOrdersParams } from "@/api/orders"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export const useGetOrders = (params: GetOrdersParams) => {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => getOrders(params),
    placeholderData: keepPreviousData,
  })
}
