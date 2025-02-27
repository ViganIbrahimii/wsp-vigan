export interface Invoice {
  id: string
  invoice_number: string
  invoice_date: string
  created_items: {
    ingredient_name: string
    customs: string
    price: string
    metrics: string
    discount: number
    quantity: number
    total_price: string
  }[]
  restaurant: {
    id: string
    name: string
  }
  supplier: {
    id: string
    name: string
  }
  created_at: string
  updated_at: string
}
