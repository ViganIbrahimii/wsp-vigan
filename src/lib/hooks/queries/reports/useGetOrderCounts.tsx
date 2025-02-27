import {
  getOrderCounts,
  GetOrderCountsParams,
} from "@/api/reports/order-counts"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export const useGetOrderCounts = (params: GetOrderCountsParams) => {
  return useQuery({
    queryKey: ["order-counts", params],
    queryFn: () => getOrderCounts(params),
    placeholderData: keepPreviousData,
    enabled: !!params.brand_id,
  })
}
