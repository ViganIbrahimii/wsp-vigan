import { apiRequest } from "../Api"

export type TimeFrame = "day" | "week" | "month" | "year"
export type SortOrder = "asc" | "desc"
export type SortBy = "order_item_name" | "order" | "unique_order" | "revenue"

export interface GetBestSellersParams {
  brand_id: string
  start_date: string
  end_date: string
  time_frame: TimeFrame
  search?: string
  page_size?: number
  page_limit?: number
  sort_by?: SortBy
  sort_order?: SortOrder
}

export interface BestSellerItem {
  item_name: string
  time_week: string
  order: number
  unique_order: number
  revenue: string
  currency: string
}

export interface GetBestSellersResponse {
  success: boolean
  message: string
  data: BestSellerItem[]
  cached: boolean
  execution_time: string
  current_page: number
  last_page: number
  items_per_page: number
  page_items: number
  total: number
  timestamp: string
}

export const getBestSellers = (params: GetBestSellersParams) =>
  apiRequest<GetBestSellersParams, GetBestSellersResponse>({
    url: "/reports/best-sellers/list",
    method: "GET",
    params,
  })
