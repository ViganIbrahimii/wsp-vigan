import { apiRequest } from "@/api/Api"

import { Section } from "@/types/interfaces/sections.interface"
import { Table } from "@/types/interfaces/table.interface"

export type SectionsSortBy = "name" | "status"
export type SectionsSortOrder = "asc" | "desc" | ""
type StatusArray =
  | ["active" | "inactive", ""]
  | ["active", "inactive"]
  | ["active"]
  | ["inactive"]
  | [""]

export interface GetSectionsParams {
  brand_id: string
  search?: string
  status?: StatusArray
  sort_by?: SectionsSortBy
  sort_order?: SectionsSortOrder
  page_size: number
  page_limit: number
}

export interface GetSectionsResponse {
  success: boolean
  message: string
  data: Section[]
  cached: boolean
  execution_time: string
  current_page: number
  last_page: number
  items_per_page: number
  page_items: number
  total: number
  timestamp: string
}

export const getSections = (params: GetSectionsParams) =>
  apiRequest<GetSectionsParams, GetSectionsResponse>({
    url: "/sections/list",
    method: "GET",
    params,
  })
