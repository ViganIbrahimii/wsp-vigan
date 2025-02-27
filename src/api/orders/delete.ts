import { apiRequest } from "../Api"

export interface DeleteOrderBody {
  order_id: string
  reason: string
}

export interface DeleteOrderResponse {
  success: boolean
  message: string
  data: []
  timestamp: string
  execution_time: string
}

export const deleteOrder = (body: DeleteOrderBody) =>
  apiRequest<DeleteOrderBody, DeleteOrderResponse>({
    url: "/orders/delete",
    method: "DELETE",
    data: body,
  })
