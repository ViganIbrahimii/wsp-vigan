import { apiRequest } from "@/api/Api"

import { OtpNotification } from "@/types/interfaces/otp-notifications.interface"

export enum ServiceProvider {
  Twilio = 1,
  Woodpecker = 2,
  Meta = 3,
  Email = 4,
  Internal = 6,
}

export enum OtpMode {
  SMS = 1,
  Whatsapp = 2,
  Email = 3,
  Internal = 4,
}

export type OtpNotificationsSortBy = "created_at" | "cash_status"
export type OtpNotificationsSortOrder = "asc" | "desc"

export interface GetOtpNotificationsParams {
  page_size: number
  page_limit: number
  from_date?: string
  to_date?: string
  search?: string
  entity_1_type?: string
  entity_1_id?: string
  entity_2_type: string
  entity_2_id: string
  service_provider_id: ServiceProvider
  otp_mode_id: OtpMode
  phone_number?: string
  email?: string
  status?: "sent" | "verify"
  sort_by?: OtpNotificationsSortBy
  sort_order?: OtpNotificationsSortOrder
}

export interface GetOtpNotificationsResponse {
  success: boolean
  message: string
  data: OtpNotification[]
  cached: boolean
  execution_time: string
  current_page: number
  last_page: number
  items_per_page: number
  page_items: number
  total: number
  timestamp: string
}

export const getOtpNotifications = (params: GetOtpNotificationsParams) =>
  apiRequest<GetOtpNotificationsParams, GetOtpNotificationsResponse>({
    url: "/otp-notifications/list",
    method: "GET",
    params,
    internetCash: true,
  })
