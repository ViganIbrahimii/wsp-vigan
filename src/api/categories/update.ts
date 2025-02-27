import { apiRequest } from "../Api"

interface Photo {
  cid?: string
  type?: string
  filename?: string
}

export interface UpdateCategoryBody {
  category_id: string
  category_name?: string
  status?: string
  menu_id?: string
  photo?: Photo
  language_code?: string
  translated_name?: string
  brand_id?: string
  reason?: string
}

export interface UpdateCategoryResponse {
  success: boolean
  message: string
  data: []
  timestamp: string
  execution_time: string
}

export const updateCategory = (body: UpdateCategoryBody) =>
  apiRequest<UpdateCategoryBody, UpdateCategoryResponse>({
    url: "/categories/update",
    method: "PUT",
    data: body,
  })
