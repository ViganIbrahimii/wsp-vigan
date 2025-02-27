export interface Item {
  item_id: string
  brand_id: string
  category_id: string
  item_code: string
  item_name: string
  allow_dual_language: boolean
  selected_language: number
  dual_item_name: string
  item_details: string
  service_type: {
    id: string
    name: string
  }
  same_price_in_pickup_and_delivery: boolean
  price: number
  dine_in_price: number
  delivery_price: number
  discount: number
  eligible_for_coupons: boolean
  discount_of_type: string
  status: "active" | "inactive"
  kcal_of_item: number
  grams_of_item: number
  proteins_of_item: number
  carbs_of_item: number
  fats_of_item: number
  show_on_dine_in: boolean
  show_online: boolean
  item_icons: {
    id: number
    icon: string
    name: string
    status: boolean
  }[]
  main_item_image: any[]
  sub_item_image: any[]
  kot_id: string
  supplier: string
  item_with_stock: {
    quantity: number
    low_quantity: number
    how_many_reducing_by_each_order: number
  }[]
  related_products: {
    related_item_id: string
    related_item_name: string
  }[]
  modifiers: {
    modifier_id: string
    modifier_name: string
    modifier_detail: {
      option_id: string
      option_name: string
      price: number
      kcal: number
      grams: number
      proteins: number
      carbs: number
      fats: number
      is_default: boolean
    }[]
  }[]
}

export interface ServiceType {
  id: string
  name: string
}

export interface Attachment {
  id: string
  cid: string
  type: string
  filename: string
}

export interface TargetLanguage {
  name: string
  description: string | null
}

export interface ItemIcon {
  id: number
  icon: string
  name: string
  status: string
}

export interface ModifierDetail {
  option_id: string
  option_name: string
  price: number
  kcal: number
  grams: number
  proteins: number
  carbs: number
  fats: number
  is_default: boolean
}

export interface Modifier {
  modifier_id: string
  modifier_name: string
  modifier_detail: ModifierDetail[]
}

// Updated ItemList interface
export interface ItemList {
  item_id: string
  item_name: string
  item_details: string
  categorie_id: string
  brand_id: string
  service_type: ServiceType
  supplier: string
  discount: number
  discount_type: string
  base_price: number
  currency: string
  quantity_of_item: number
  status: "active" | "inactive"
  attachment: Attachment[]
  target_language?: TargetLanguage[]
  item_icons?: ItemIcon[]
  modifiers?: Modifier[]
  is_dine_in_enabled?: boolean
  is_delivery_enabled?: boolean
  is_pickup_enabled?: boolean
}
