import { apiRequest } from "../Api"

export interface GetOrderStatisticsParams {
  brand_id: string
  start_date: string
  end_date: string
  seeded: 0 | 1
}

export interface GetOrderStatisticsResponse {
  success: boolean
  message: string
  data: {
    revenue: number
    all_order: number
    paid_order: number
    accepted: number
    completed: number
    canceled: number
    currency: string
  }
  cached: boolean
  execution_time: string
  timestamp: string
}

export const getOrderStatistics = (params: GetOrderStatisticsParams) =>
  apiRequest<GetOrderStatisticsParams, GetOrderStatisticsResponse>({
    url: "/reports/order-statistics/list",
    method: "GET",
    params,
  })
