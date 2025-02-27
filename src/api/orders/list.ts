import { apiRequest } from "@/api/Api"
import { KitchenDisplaySortingOption } from "@/constants/kitchenDisplaySortingOptions"
import { OrderStatuses } from "@/constants/orderStatuses"
import { OrderType } from "@/constants/orderTypes"

import { OrderListItem } from "@/types/interfaces/order.interface"

type CashStatus = "collected" | "desposited"

type GroupByCalendar = "today" | "weekly" | "monthly" | "yearly"

type PaymentStatus = "paid" | "unpaid" | "review"

export type OrderSortBy =
  | "ordernumber"
  | "name"
  | "items"
  | "date"
  | "status"
  | "amount"
  | "table"

type OrderFlag = "cart" | "order_confirmed"

export interface GetOrdersParams {
  page_size?: number
  page_limit?: number
  brand_id?: string
  driver_id?: string
  cash_status?: CashStatus
  from_date?: string
  to_date?: string
  order_status?: OrderStatuses | string
  group_by?: "email" | "user_id"
  search?: string
  order_type?: OrderType | ""
  sort_by?: OrderSortBy
  sort_order?: KitchenDisplaySortingOption | string
  payment_status?: PaymentStatus
  group_by_calendar?: GroupByCalendar
  table_id?: string
  user_id?: string
  order_flag?: OrderFlag
}

export interface GetOrdersResponse {
  success: boolean
  message: string
  data: OrderListItem[]
  total_open_orders: number
  total_complete_orders: number
  open_orders: {
    accepted_orders: number
    ordered_numbers: number
    ready_orders: number
    served_orders: number
  }
  current_page: number
  last_page: number
  items_per_page: number
  page_items: number
  total: number
  timestamp: string
  execution_time: string
  cached: boolean
}

export const getOrders = (params: GetOrdersParams) =>
  apiRequest<GetOrdersParams, GetOrdersResponse>({
    url: "/orders/list",
    method: "GET",
    params,
  })
