import { OrderStatuses } from "@/constants/orderStatuses"

import { apiRequest } from "../Api"

interface Image {
  cid: string
  type: string
  filename: string
}

interface ItemWithStock {
  quantity: number
  low_quantity: number
  how_many_reducing_by_each_order: number
}

interface MadeInHouseItem {
  ingredient_id: string
  quantity: number
}

interface RelatedProduct {
  item_id: string
}

interface Modifier {
  id: string
}

interface ModifierDetail {
  option_id: string
  price: number
  kcal: number
  grams: number
  proteins: number
  carbs: number
  fats: number
  is_default: number
}
export interface UpdateItemBody {
  item_id: string
  brand_id?: string
  category_id?: string
  item_code?: string
  item_name?: string
  allow_dual_language?: boolean
  selected_language?: number
  dual_item_name?: string
  item_details?: string
  service_type_id?: string
  price?: number
  dine_in_price?: number
  delivery_price?: number
  discount?: number
  eligible_for_coupons?: boolean
  discount_of_type?: "flat" | "percentage"
  status?: string
  kcal_of_item?: number
  grams_of_item?: number
  proteins_of_item?: number
  carbs_of_item?: number
  fats_of_item?: number
  show_on_dine_in?: boolean
  show_online?: boolean
  item_icons?: Record<string, boolean>
  main_item_image?: Image
  sub_item_image?: Image[]
  kot_id?: string
  supplier?: string
  item_with_stock?: ItemWithStock[]
  made_in_house_item?: MadeInHouseItem[]
  related_products?: RelatedProduct[]
  modifiers?: Modifier[]
  modifier_detail?: ModifierDetail[]
  language_code?: string
  translated_name?: string
  translated_description?: string
  reason?: string
  is_dine_in_enabled?: boolean
  is_delivery_enabled?: boolean
  is_pickup_enabled?: boolean
}

export interface UpdateItemResponse {
  success: boolean
  message: string
  data: []
  timestamp: string
  execution_time: string
}

export const updateItem = (body: UpdateItemBody) =>
  apiRequest<UpdateItemBody, UpdateItemResponse>({
    url: "/items/update",
    method: "PUT",
    data: body,
  })
