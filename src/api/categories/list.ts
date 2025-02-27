import { apiRequest } from "@/api/Api"

import { Category } from "@/types/interfaces/category.interface"

type SortOrder = "asc" | "desc"
type SortBy = "status"

export type CategoryStatus =
  | ["active", "inactive"]
  | ["inactive", "active"]
  | ["active"]
  | ["inactive"]

export interface GetCategoriesParams {
  page_size?: number
  page_limit?: number
  brand_id: string
  menu_id?: string
  status?: CategoryStatus
  search?: string
  language_code?: string
  sort_order?: SortOrder
  sort_by?: SortBy
}

export interface GetCategoriesResponse {
  success: boolean
  message: string
  data: Category[]
  current_page: number
  last_page: number
  items_per_page: number
  page_items: number
  total: number
  timestamp: string
  execution_time: string
  cached: boolean
}

export const getCategories = (params: GetCategoriesParams) =>
  apiRequest<GetCategoriesParams, GetCategoriesResponse>({
    url: "/categories/list",
    method: "GET",
    params,
  })
