import { getNotifiation, GetNotificationParams } from "@/api/notification"
import { useQuery } from "@tanstack/react-query"

export const useGetNotification = (params: GetNotificationParams) => {
  return useQuery({
    queryKey: ["notification", params],
    queryFn: () => getNotifiation(params),
    enabled: true,
  })
}
