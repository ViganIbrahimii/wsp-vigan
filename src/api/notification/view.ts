import { Menu } from "@/types/interfaces/menu.interface"

import { apiRequest } from "../Api"
import { Notification, NotificationDetail } from "@/types/interfaces/notification.interface"

export interface GetNotificationParams {
  notification_id: string
}

export interface GetNotificationResponse {
  data: NotificationDetail
}

export const getNotifiation = (params: GetNotificationParams) =>
  apiRequest<GetNotificationParams, GetNotificationResponse>({
    url: "/notifications/view",
    method: "GET",
    params,
  })
