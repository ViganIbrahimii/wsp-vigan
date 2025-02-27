import { Notification } from "@/types/interfaces/notification.interface"

import { apiRequest } from "../Api"

export interface GetNotificationParams {
  brand_id?: string
  order_id?: string
  user_id?: string
  search?: string
  notification_status?: string
  from_date?: string
  to_date?: string
  from_time?: string
  to_time?: string
  sort_by?: string
  sort_order?: string
  page_limit: number
  page_size: number
}

export interface GetNotificationResponse {
  data: Notification
  current_page: number
  last_page: number
  total: number
  items_per_page: number
  page_items: number
}

export const GetNotification = (params: GetNotificationParams) =>
  apiRequest<GetNotificationParams, GetNotificationResponse>({
    url: "/notifications/list",
    method: "GET",
    params,
  })
