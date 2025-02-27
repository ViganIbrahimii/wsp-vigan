import { apiRequest } from "@/api/Api"

import { Menu } from "@/types/interfaces/menu.interface"

type SortOrder = "asc" | "desc"
type SortBy = "name" | "status"

export interface GetMenusParams {
  page_limit?: number
  page_size?: number
  brand_id: string
  search?: string
  language_code?: string
  status?:
    | ["active", "inactive"]
    | ["inactive", "active"]
    | ["active"]
    | ["inactive"]
  sort_order?: SortOrder
  sort_by?: SortBy
  service_type_id?: string
}

export interface GetMenusResponse {
  success: boolean
  message: string
  data: Menu[]
  current_page: number
  last_page: number
  items_per_page: number
  page_items: number
  total: number
  timestamp: string
  execution_time: string
  cached: boolean
}

export const getMenus = (params: GetMenusParams) =>
  apiRequest<GetMenusParams, GetMenusResponse>({
    url: "/menus/list",
    method: "GET",
    params,
  })
