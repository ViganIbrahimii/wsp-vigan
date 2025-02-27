import { apiRequest } from "@/api/Api"
import { OrderType } from "@/constants/orderTypes"

// CustomerInfo Variants
// export interface DineInCustomerInfo {
//   first_name?: string
//   last_name?: string
//   phone_code?: string
//   phone?: string
//   email?: string
//   // Optional fields for dine-in
//   address_1?: string
//   address_2?: string
//   landmark?: string
//   city?: string
//   state?: string
//   country?: string
//   pincode?: string
//   longitude?: number
//   latitude?: number
// }

// export interface DeliveryCustomerInfo {
//   first_name: string
//   last_name: string
//   phone_code: string
//   phone: string
//   email: string
//   // Required fields for delivery
//   address_1: string
//   city: string
//   state: string
//   country: string
//   pincode: string
//   longitude: number
//   latitude: number
//   apartment?: string
//   note?: string
// }

// export interface PickupCustomerInfo {
//   first_name: string
//   last_name: string
//   phone_code: string
//   phone: string
//   email: string
//   // Optional address fields for pickup
//   address_1?: string
//   city?: string
//   state?: string
//   country?: string
//   pincode?: string
// }

export interface UnifiedCustomerInfo {
  first_name: string
  last_name: string
  phone_code?: string
  phone: string
  email: string
  address_1?: string
  address_2?: string
  landmark?: string
  city?: string
  state?: string
  country?: string
  pincode?: string
  longitude?: number
  latitude?: number
}

// Discount Logic
export interface OrderWithoutDiscount {
  order_discount: null // No discount
  order_discount_type: null // No discount type
}

export interface OrderWithDiscount {
  order_discount: number // Discount is mandatory
  order_discount_type: "flat" | "percent" // Discount type is mandatory
}

export type OrderDiscount = OrderWithoutDiscount | OrderWithDiscount

// CreateOrderBody with Unions
export type CreateOrderBody = {
  order_id?: string
  brand_id: string
  customer_id?: string
  table_id?: string
  menu_id?: string
  order_type: OrderType
  customer_info: UnifiedCustomerInfo | null
  device_type: string
  delivery_type?: string
  order_instruction?: string
  items: ItemInfo[]
  notification_trigger?: boolean
  driver_id?: string
  order_flag: string
  waiter_tip?: string
  bring_all_items_at_same_time?: boolean
  coupon_id?: string
} & OrderDiscount
// &
//   (
//     | {
//         order_type: OrderType.DINE
//         table_id: string
//         customer_info?: DineInCustomerInfo
//       } // Optional customer_info
//     | { order_type: OrderType.DELIVERY; customer_info: DeliveryCustomerInfo } // Required customer_info
//     | { order_type: OrderType.PICKUP; customer_info: PickupCustomerInfo } // Required customer_info
//   )

export interface ItemWithoutDiscount {
  discount?: never // No discount
  discount_type?: never // No discount type
}

export interface ItemWithDiscount {
  discount: number // Discount is mandatory
  discount_type: "flat" | "percent" // Discount type is mandatory
}

// Union for Item Discount Logic
export type ItemDiscount = ItemWithoutDiscount | ItemWithDiscount

// Item Information
export type ItemInfo = {
  item_id: string
  quantity: number
  special_instruction?: string
  modifier_list?: ModifierInfo[]
} & ItemDiscount

// Modifier Information
export interface ModifierInfo {
  modifier_id: string
  modifier_name: string
  modifier_option_id: string
  modifier_option_name: string
  modifier_option_price: string
}

// Create Order Response
export interface CreateOrderResponse {
  success: boolean
  message: string
  data: CreateOrderBody
  timestamp: string
  execution_time: string
}

// API Request
export const createOrder = (body: CreateOrderBody) =>
  apiRequest<CreateOrderBody, CreateOrderResponse>({
    url: "/orders/create",
    method: "POST",
    data: body,
  })
