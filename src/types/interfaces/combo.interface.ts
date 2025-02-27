export interface ComboListItem {
  combo_id: string
  combo_name: string
  category_id: string
  status_of_combo: string
  price_of_combo: string
}

export interface ComboItemDetail {
  name: string
  id: string
  price: number
  quantity: number
}

export interface ComboDetail {
  brand_id: string
  combo_Detail: string
  combo_name: string
  category_id: string
  price_of_combo: number
  status_of_combo: string
  main_item_image: string
  show_on_dine_in: boolean
  show_online: boolean
  items: ComboItemDetail[]
}
