import { apiRequest } from "@/api/Api"

import { ItemList } from "@/types/interfaces/item.interface"

export type ItemStatus = "active" | "inactive" | ""
export interface GetItemsParams {
  brand_id: string
  menu_id?: string[]
  category_id?: string[]
  is_dine_in_enabled?: boolean
  is_delivery_enabled?: boolean
  is_pickup_enabled?: boolean
  discount_type?: "percent" | "flat"[]
  suppliers?: "made_in_house_item" | "item_with_stock"[]
  search?: string
  status?: ItemStatus
  language_code?: string
  item_icons?: string
  page_size?: number
  page_limit?: number
  sort_order?: "asc" | "desc"
  sort_by?: "name" | "available_stock" | "base_price"
}

export interface GetItemsResponse {
  success: boolean
  message: string
  data: ItemList[]
  current_page: number
  last_page: number
  items_per_page: number
  page_items: number
  total: number
  timestamp: string
  execution_time: string
  cached: boolean
}

export const getItems = (params: GetItemsParams) =>
  apiRequest<GetItemsParams, GetItemsResponse>({
    url: "/items/list",
    method: "GET",
    params,
  })
