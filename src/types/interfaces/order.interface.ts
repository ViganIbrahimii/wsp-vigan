import { UnifiedCustomerInfo } from "@/api/orders/create"
import { OrderStatuses } from "@/constants/orderStatuses"
import { OrderType } from "@/constants/orderTypes"

import { Table } from "@/types/interfaces/table.interface"

export interface Order {
  order_id: string
  order_number: string
  table_id: string | null
  coupon_id: string | null
  order_status: string
  payment_method: string
  delivery_status: string
  driver_id: string
  price_type: number
  unit_price: number
  delivery_distance: number
  delivery_fee: number
  delivery_time: string
  driver_rating: number
  pickup_time: string
  cash_status: string
  delivery_type: number
  tips: number
  cancelled_reason: string
  cash_deposit: number
  order_image: {
    cid: string
    type: string
    name: string
  }
  customer_rating: number
  customer_delivery_note: string
  order_instruction: string
  items_details: ItemsDetails[]
  payment_status: string
  sub_total: number
  order_discount: number
  order_discount_type: string
  taxable_amount: number
  brand_vat: number
  grand_total: number
  order_amount: number
  brand_info: BrandInfo
  customer_info: CustomerInfo
  order_date: string
  bring_all_items_at_same_time: number
  order_type: string
  kots: KotsInfo[]
}

export interface OrderDetail {
  item_detail_id: string
  item_id: string
  item_name: string
  quantity: number
  price: number
  discount: string
  discount_type: string
  item_status: string
  special_note: string
  modifier_name: string
  list_of_ingredients: {
    id: string
    name: string
  }
}

export interface ItemsDetails {
  id: string
  item_id: string
  item_name: string
  quantity: number
  price: number
  discount: number
  discount_type: string
  item_status: string
  modifier_list: ModifierInfo[]
}

export type ModifierInfo = {
  modifier_id: string
  modifier_name: string
  modifier_option_id: string
  modifier_option_name: string
  modifier_option_price: string
}

export type BrandInfo = {
  brand_id: string
  brand_name: string
  country_code: string
  address_line_1: string
  address_line_2: string
  city: string
  post_code: string
  state: string
  latitude: string
  longitude: string
  currency: string
}

export type CustomerInfo = {
  first_name: string
  middle_name: string
  last_name: string
  phone_code: string
  phone: string
  email: string
  address_1: string
  address_2: string
  landmark: string
  city: string
  state: string
  country: string
  pincode: string
  longitude: string
  latitude: string
}

export type KotsInfo = {
  unique_id: string
  name: string
}

export type CustomerDetails = {
  id: string | null
  first_name: string | null
  last_name: string | null
  middle_name: string | null
}

export type AttachmentDetails = {
  id: string
  cid: string
  type: string
  name: string
} | null

export type ItemImage = {
  id: string
  cid: string
  type: string
  name: string
} | null

export interface ItemDetails {
  id: string
  name: string
  item_instruction: string | null
  item_status: OrderStatuses
  item_quantity: number
  price: number
  main_item_image: ItemImage[] | null
}

export interface BrandDetails {
  id: string
  name: string
  location: string
  currency: string
}

export type CustomerRating =
  | number
  | {
      id: number
      unique_id: string
      rating_id: number | null
      user_id: number
      input_type: string
      input_id: string | number
      rating: number | null
      review_text: string | null
      reply_text: string | null
      is_active: boolean
      created_by: number
      updated_by: number
      deleted_by: number | null
      created_at: string
      updated_at: string
      deleted_at: string | null
    }

export type DriverImage = {
  id: number
  cid: string
  type: string
  name: string
} | null

export type OrderListTable = { id: string; name: string } | null

export interface OrderListItem {
  order_number: string
  customer: CustomerDetails | null
  table: OrderListTable
  items_count: number
  date: string
  amount: number
  currency: string
  order_status: OrderStatuses
  payment_status: string | null
  customer_delivery_address: string
  customer_apartment: string
  customer_note: string
  customer_phone_code: string
  customer_phone_number: string
  attachment: AttachmentDetails
  order_instruction: string
  order_id: string
  order_edit_time: string
  time: string
  item_details: ItemDetails[]
  brand_details: BrandDetails
  delivery_fee: number | null
  cancelled_reason: string | null
  delivery_status: string
  customer_rating: CustomerRating
  delivery_time: string | null
  delivery_partner_name: string | null
  driver_id: string | null
  driver_name: string | null
  driver_image: DriverImage
  driver_phone_code: string | null
  driver_phone_number: string | null
  bring_all_items_at_same_time: number
  order_type: OrderType
}

export interface CreateOrderTypeOption {
  value: OrderType.DINE | OrderType.PICKUP | OrderType.DELIVERY
  label: string
  serviceTypeName: "Dine In" | "Pickup" | "Delivery"
}
export interface EnrichedOrderTypeOption extends CreateOrderTypeOption {
  serviceTypeId: string
}
export interface CreateOrderInfoInterface {
  selectedTable: Table | null
  preSelectedTable: Table | null
  customerId: string | null
  isNewCustomer: boolean
  orderInstruction: string | null
  guestInfo: UnifiedCustomerInfo | null
}
