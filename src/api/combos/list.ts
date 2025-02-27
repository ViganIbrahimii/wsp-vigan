import { ComboListItem } from "@/types/interfaces/combo.interface"

import { apiRequest } from "../Api"

export interface GetCombosParams {
  brand_id: string
  page_size?: number
  page_number?: number
}

export interface GetCombosResponse {
  items: ComboListItem[]
  currentPage: number
  lastPage: number
  itemsPerPage: number
  pageItems: number
  total: number
  timestamp: string
  execution_time: string
  cached: boolean
}

export const getCombos = (params: GetCombosParams) =>
  apiRequest<GetCombosParams, GetCombosResponse>({
    url: "/combos/list",
    method: "GET",
    params,
  })
