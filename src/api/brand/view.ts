import { Brand } from "@/types/interfaces/brand.interface"

import { apiRequest } from "../Api"

export interface GetBrandParams {
  brand_id: string
  slug?: string
}

export interface GetBrandResponse {
  success: boolean
  message: string
  data: Brand
  current_page: number
  last_page: number
  items_per_page: number
  page_items: number
  total: number
  timestamp: string
  execution_time: string
  cached: boolean
}

export const getBrand = (
  params: GetBrandParams,
  headers?: { Authorization: string }
) =>
  apiRequest<GetBrandParams, GetBrandResponse>({
    url: "/brands/read",
    method: "GET",
    params,
    headers,
  })
