import { OrderStatuses } from "@/constants/orderStatuses"

import { ItemsDetails, ModifierInfo } from "@/types/interfaces/order.interface"

import { apiRequest } from "../Api"

export interface UpdateOrderItemBody {
  order_id: string
  order_item_id?: string
  item_id?: string
  price: number
  quantity: number
  custom_cancel_reason?: string
  default_cancel_reason?: string
  discount?: number
  discount_type?: "flat" | "percentage" | string
  special_instruction?: string
  item_price?: number
  status?: OrderStatuses
  modifier_list?: ModifierInfo[]
}

export interface UpdateOrderItemResponseData {
  order_id: string
  item_id: string
  price: number
  quantity: number
  custom_cancel_reason?: string | null
  default_cancel_reason?: string | null
  discount?: number | null
  discount_type?: "flat" | "percentage" | string | null
  special_instruction?: string | null
  item_price?: number | null
  status: OrderStatuses
  modifier_list?: ModifierInfo[] | null
}
export interface UpdateOrderItemResponse {
  success: boolean
  message: string
  data: UpdateOrderItemResponseData
  cached: boolean
  execution_time: string
  timestamp: string
}

export const updateOrderItem = (body: UpdateOrderItemBody) =>
  apiRequest<UpdateOrderItemBody, UpdateOrderItemResponse>({
    url: "/order-items/update",
    method: "PUT",
    data: body,
  })
