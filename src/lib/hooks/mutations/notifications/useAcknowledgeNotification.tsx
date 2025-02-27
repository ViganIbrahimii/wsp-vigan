import {
  acknowledgeNotification,
  AcknowledgeNotificationBody,
} from "@/api/notifications/acknowledge"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useAcknowledgeNotification = () => {
  return useMutation({
    mutationFn: (data: AcknowledgeNotificationBody) =>
      acknowledgeNotification(data),
  })
}
