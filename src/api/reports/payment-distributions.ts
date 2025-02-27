import { apiRequest } from "../Api"

export type EntityType = "user" | "brand"

export interface GetPaymentDistributionsParams {
  start_date: string
  end_date: string
  entity_1_id: string
  entity_1_type: EntityType
}

export interface PaymentDistributionData {
  payment_gateway: string
  sum: string
  currency: string
}

export interface GetPaymentDistributionsResponse {
  success: boolean
  message: string
  data: PaymentDistributionData[]
  timestamp: string
  execution_time: string
  cached: boolean
}

export const getPaymentDistributions = (
  params: GetPaymentDistributionsParams
) =>
  apiRequest<GetPaymentDistributionsParams, GetPaymentDistributionsResponse>({
    url: "/payment-distributions/list",
    method: "GET",
    params,
    smoothSwipe: true,
  })
