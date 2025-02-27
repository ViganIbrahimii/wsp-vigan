import { KotListItem } from "@/types/interfaces/kot.interface"

import { apiRequest } from "../Api"

export interface GetKotsParams {
  brand_id: string
  page_size?: number
  page_limit?: number
  sort_by?: "id" | "name" | "is_active" | "created_at" | "updated_at"
  status?: "active" | "inactive"
  search?: string
}

export interface GetKotsResponse {
  data: KotListItem[]
  current_page: number
  last_page: number
  items_per_page: number
  page_items: number
  total: number
  timestamp: string
  execution_time: string
  cached: boolean
}

export const getKots = (params: GetKotsParams) =>
  apiRequest<GetKotsParams, GetKotsResponse>({
    url: "/kots/list",
    method: "GET",
    params,
  })
