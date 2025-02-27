import { Brand } from "@/types/interfaces/brand.interface"

import { apiRequest } from "../Api"

export interface UpdateBrandBody extends Brand {}

export interface UpdateBrandResponse {
  success: boolean
  message: string
  data: {
    brand_id: string
  }
  timestamp: string
  execution_time: string
  cached: boolean
}

export const updateBrand = (body: UpdateBrandBody) =>
  apiRequest<UpdateBrandBody, UpdateBrandResponse>({
    url: "/brands/update",
    method: "PUT",
    data: body,
  })
