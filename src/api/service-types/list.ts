import { apiRequest } from "@/api/Api"

import { ServiceTypesData } from "@/types/interfaces/serviceTypes.interface"

export interface GetServiceTypesParams {
  page_size?: number
  page_limit?: number
  search?: string
  brand_type_id?: string
  brand_id?: string
}

export interface GetServiceTypesResponse {
  success: boolean
  message: string
  data: ServiceTypesData
  current_page: number
  last_page: number
  items_per_page: number
  page_items: number
  total: number
  timestamp: string
  execution_time: string
  cached: boolean
}
2

export const getServiceTypes = (params: GetServiceTypesParams) =>
  apiRequest<GetServiceTypesParams, GetServiceTypesResponse>({
    url: "/service-types/list",
    method: "GET",
    params,
  })
