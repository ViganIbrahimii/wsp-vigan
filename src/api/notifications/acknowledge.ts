import { apiRequest } from "../Api"

export interface AcknowledgeNotificationBody {
  notification_id: string
  acknowledgement_status: "acknowledged"
}

export interface AcknowledgeNotificationResponse {
  success: boolean
  message: string
  data: {
    notification_id: string
    acknowledgement_status: string
  }
}

export const acknowledgeNotification = (body: AcknowledgeNotificationBody) =>
  apiRequest<AcknowledgeNotificationBody, AcknowledgeNotificationResponse>({
    url: "/notifications/acknowledge",
    method: "POST",
    data: body,
  })
