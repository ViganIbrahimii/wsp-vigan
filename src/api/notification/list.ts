import { Menu } from "@/types/interfaces/menu.interface"

import { apiRequest } from "../Api"
import { Notification } from "@/types/interfaces/notification.interface"

export interface GetNotificationsParams {
  brand_id: string
  order_id?: string
  user_id?: string
  search?: string
  notification_status?: string
  from_date?: string
  to_date?: string
  from_time?: string
  to_time?: string
  per_page?: number
  page_number?: number
}

export interface GetNotificationsResponse {
  items: Notification[]
  currentPage: number
  lastPage: number
  itemsPerPage: number
  pageItems: number
  total: number
  timestamp: string
  execution_time: string
  cached: boolean
}

export const getNotifiations = (params: GetNotificationsParams) =>
  apiRequest<GetNotificationsParams, GetNotificationsResponse>({
    url: "/notifications/list",
    method: "GET",
    params,
  })
