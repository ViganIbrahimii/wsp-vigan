export interface ServiceType {
  service_type_id: string
  service_type_name: string
  brand_type_id: string
  items_count: number
}
export interface ServiceTypesData {
  service_type: ServiceType[]
  total_count: number
}
