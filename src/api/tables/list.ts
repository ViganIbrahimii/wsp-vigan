import { apiRequest } from "@/api/Api"

import { Table } from "@/types/interfaces/table.interface"

export type TableSortBy = "id"
export type TableSortOrder = "asc" | "desc" | ""

export interface GetTablesParams {
  brand_id: string
  search?: string
  status?: "active" | "inactive" | ""
  position_ids?: string[]
  section_ids?: string
  capacity?: string
  sort_by?: TableSortBy
  sort_order?: TableSortOrder
  page_size?: number
  page_limit?: number
}

export interface GetTablesResponse {
  success: boolean
  message: string
  data: Table[]
  cached: boolean
  execution_time: string
  current_page: number
  last_page: number
  items_per_page: number
  page_items: number
  total: number
  timestamp: string
}

export const getTables = (params: GetTablesParams) =>
  apiRequest<GetTablesParams, GetTablesResponse>({
    url: "/tables/list",
    method: "GET",
    params,
  })
