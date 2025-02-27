import { apiRequest } from "../Api"

export interface GetOrderCountsParams {
  brand_id: string
  start_date: string
  end_date: string
  frequency: "daily" | "weekly" | "monthly" | "yearly"
}

export interface OrderCountData {
  frequency: string
  order_count: number
}

export interface GetOrderCountsResponse {
  success: boolean
  message: string
  data: OrderCountData[]
  timestamp: string
  execution_time: string
  cached: boolean
}

export const getOrderCounts = (params: GetOrderCountsParams) =>
  apiRequest<GetOrderCountsParams, GetOrderCountsResponse>({
    url: "/order-counts/list",
    method: "GET",
    params,
  })
