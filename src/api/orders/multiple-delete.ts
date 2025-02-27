import { apiRequest } from "../Api"

export interface MultipleDeleteOrderBody {
  order_id: string[]
}

export interface MultipleDeleteOrderResponse {
  success: boolean
  message: string
  data: []
  timestamp: string
  execution_time: string
}

export const multipleDeleteOrder = (body: MultipleDeleteOrderBody) =>
  apiRequest<MultipleDeleteOrderBody, MultipleDeleteOrderResponse>({
    url: "/orders/multiple-delete",
    method: "DELETE",
    data: body,
  })
