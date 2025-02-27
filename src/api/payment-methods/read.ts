import { apiRequest } from "../Api"
import { PaymentMethod } from "@/types/interfaces/payment.interface"

export interface GetPaymentMethodParam {
  payment_method_id: string
}

export interface GetPaymenMethodResponse {
  data: PaymentMethod
}

export const getPaymentMethod = (params: GetPaymentMethodParam) =>
  apiRequest<GetPaymentMethodParam, GetPaymenMethodResponse>({
    url: "/payment-methods/read",
    method: "GET",
    params,
  })
