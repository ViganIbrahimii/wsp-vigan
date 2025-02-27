import { BrandTypes } from "@/types/interfaces/brand-types.interface"

import { apiRequest } from "../Api"

type SortOrder = "asc" | "desc"
type SortBy = "type"

export interface GetBrandTypesParams {
  page_limit?: number
  page_size?: number
  search?: string
  sort_order?: SortOrder
  sort_by?: SortBy
}

export interface GetBrandTypesResponse {
  success: boolean
  message: string
  data: BrandTypes[]
  current_page: number
  last_page: number
  items_per_page: number
  page_items: number
  total: number
  timestamp: string
  execution_time: string
  cached: boolean
}

export const getBrandTypes = (params: GetBrandTypesParams) =>
  apiRequest<GetBrandTypesParams, GetBrandTypesResponse>({
    url: "/brand-types/list",
    method: "GET",
    params,
  })
