import { apiRequest } from "@/api/Api"
import { PaymentMethodsListItem } from "@/types/interfaces/payment.interface"

export type PaymentMethodStatus = "active" | "inactive"

export type OrderSortBy =
  | "id"
  | "name"
  | "provider"
  | "mode"

export type SortOrder = "asc" | "desc"

export interface GetPaymentMethodsParams {
  page_size?: number
  page_limit?: number
  sort_by?: OrderSortBy
  sort_order?: SortOrder
  status?: PaymentMethodStatus
  search?: string
}

export interface GetPaymentMethodsResponse {
  success: boolean
  message: string
  data: PaymentMethodsListItem[]
  current_page: number
  last_page: number
  items_per_page: number
  page_items: number
  total: number
  timestamp: string
  execution_time: string
  cached: boolean
}

export const getPaymentMethods = (params: GetPaymentMethodsParams) =>
  apiRequest<GetPaymentMethodsParams, GetPaymentMethodsResponse>({
    url: "/payment-methods/list",
    method: "GET",
    params,
  })
