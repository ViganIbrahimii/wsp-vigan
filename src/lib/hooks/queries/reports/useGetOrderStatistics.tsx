import {
  getOrderStatistics,
  GetOrderStatisticsParams,
} from "@/api/reports/order-statistics"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export const useGetOrderStatistics = (params: GetOrderStatisticsParams) => {
  return useQuery({
    queryKey: ["order-statistics", params],
    queryFn: () => getOrderStatistics(params),
    placeholderData: keepPreviousData,
    enabled: !!params.brand_id,
  })
}
