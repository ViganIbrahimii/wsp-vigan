import { apiRequest } from "@/api/Api"
import { OrderStatuses } from "@/constants/orderStatuses"

interface CustomerInfo {
  id: string
  first_name: string
  middle_name?: string
  last_name: string
  phone_code: string
  phone: string
  email: string
  address_1?: string | null
  address_2?: string | null
  landmark?: string | null
  city?: string | null
  state?: string
  country?: string | null
  pincode?: string
  longitude?: string
  latitude?: string
}

export interface UpdateOrderItemDetail {
  item_detail_id: string
  item_id: string
  quantity: number
  price: number
  discount: number
  discount_type: string
  item_status: string
}

export interface UpdateOrderBody {
  order_id: string
  table_id?: string
  has_coupon_code?: boolean
  coupon_id?: string
  order_status?: string
  payment_method?: string
  delivery_status?: string
  driver_id?: string
  price_type?: string
  unit_price?: number
  delivery_distance?: number
  delivery_fee?: number
  delivery_time?: string
  delivery_type?: string
  driver_rating?: number
  pickup_time?: string
  cash_status?: "collected" | "deposited"
  tips?: number
  cancelled_reason?: string
  cash_deposit?: number
  order_image?: string
  customer_rating?: number
  customer_delivery_note?: string
  order_instruction?: string
  payment_status?: string
  items_cancel?: {
    item_id: string
  }[]
  merge_orders?: {
    order_id: string
  }[]
  order_discount?: number
  order_discount_type?: string
  customer_info?: {
    id: string
    first_name?: string
    middle_name?: string
    last_name?: string
    phone_code?: string
    phone?: string
    email?: string
    address_1?: string
    address_2?: string
    landmark?: string
    city?: string
    state?: string
    country?: string
    pincode?: string
    longitude?: string
    latitude?: string
  }
  order_flag?: string
  bring_all_items_at_same_time?: boolean
}

interface UpdateOrderResponseData {
  order_id: string
  table_id?: string
  has_coupon_code: boolean
  coupon_id?: string | null
  order_status: OrderStatuses
  payment_method?: string
  delivery_status?: string
  driver_id?: string | null
  price_type?: number
  unit_price: number
  delivery_distance?: number
  delivery_fee?: number | null
  delivery_time?: string | null
  driver_rating?: number | null
  pickup_time?: string | null
  cash_status?: string | null
  delivery_type?: string | null
  tips?: number
  cancelled_reason?: string | null
  cash_deposit?: number | null
  order_image?: string | null
  customer_rating?: number | null
  customer_delivery_note?: string | null
  order_instruction?: string | null
  payment_status: string
  order_discount?: number
  order_discount_type?: string | null
  customer_info?: CustomerInfo
  order_date?: string
  brand_order_number?: string
  bring_all_items_at_same_time?: number
}
export interface UpdateOrderResponse {
  success: boolean
  message: string
  data: UpdateOrderResponseData
  timestamp: string
  execution_time: string
}

export const updateOrder = (body: UpdateOrderBody) =>
  apiRequest<UpdateOrderBody, UpdateOrderResponse>({
    url: "/orders/update",
    method: "PUT",
    data: body,
  })
