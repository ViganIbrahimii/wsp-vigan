import { Order } from "@/types/interfaces/order.interface"

import { apiRequest } from "../Api"

export interface GetOrderParams {
  order_id: string
}

export interface GetOrderResponse {
  data: Order
}

export const getOrder = (params: GetOrderParams) =>
  apiRequest<GetOrderParams, GetOrderResponse>({
    url: "/orders/read",
    method: "GET",
    params,
  })
