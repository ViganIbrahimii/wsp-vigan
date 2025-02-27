export interface Kot {
  kot_name: string
  kot_status: string
  brand: {
    id: string
    name: string
  }
}

export interface KotListItem {
  kot_id: string
  brand_id: string
  kot_name: string
  kot_status: boolean
}
