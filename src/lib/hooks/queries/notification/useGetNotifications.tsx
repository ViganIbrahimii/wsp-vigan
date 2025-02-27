import { GetNotification, GetNotificationParams } from "@/api/notifications"
import { useQuery } from "@tanstack/react-query"

export const useGetNotifications = (params: GetNotificationParams) => {
  return useQuery({
    queryKey: ["notifications", params.user_id],
    queryFn: () => GetNotification(params),
    enabled: !!params.user_id,
    refetchOnWindowFocus: false,
    gcTime: 0,
    staleTime: 0,
  })
}
