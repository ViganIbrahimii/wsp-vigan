export interface Table {
  id: string
  user_id: string
  section_id: string
  section_name: string
  brand_id: string
  brand_name: string
  name: string
  no_of_capacity: number
  position: TablePosition
  status: string
  order_type: string | null
  order?: TableOrder
}

export interface TablePosition {
  id: string
  name: string
  abbreviation: string
}

export interface TableOrder {
  id: string
  status: string
  payment_status: string
  order_count: string
  order_time?: string
}
