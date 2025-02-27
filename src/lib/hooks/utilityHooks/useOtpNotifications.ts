import { useEffect } from "react"
import { OtpMode, ServiceProvider } from "@/api/otp-notifications/list"
import { WebsocketInstances } from "@/constants/websocketInstances"
import { Channel, useWebSocketContext } from "@/providers/WebSocketProvider"
import { useQueryClient } from "@tanstack/react-query"

import { useGetOtpNotificationsInfinite } from "@/lib/hooks/queries/otp-notifications/useGetOtpNotificationsInfinite"

export const useOtpNotifications = (brandId: string | undefined) => {
  const queryClient = useQueryClient()
  const { subscribe, connections } = useWebSocketContext()

  // Fetch OTP notifications
  const { data } = useGetOtpNotificationsInfinite({
    page_limit: 40,
    entity_2_type: "brand",
    entity_2_id: brandId || "",
    service_provider_id: ServiceProvider.Internal,
    otp_mode_id: OtpMode.Internal,
    search: "",
    sort_by: "cash_status",
    sort_order: "asc",
  })

  const otpNotifications = data?.pages.flatMap((page) => page.data) || []
  const pendingCount = otpNotifications.filter(
    (notification) => notification.field_5_value === "collected"
  ).length

  // Subscribe to WebSocket channels
  const otpChannels: Channel[] = [
    {
      name: "otp-confirmation",
      callback(data, eventName, channelName) {
        console.log("data", data)
        console.log("eventname", eventName)
        console.log("channel", channelName)

        queryClient.invalidateQueries({ queryKey: ["otp-notifications"] })
      },
    },
    {
      name: "otp-confirmation-verify",
      callback(data, eventName, channelName) {
        console.log("data", data)
        console.log("eventname", eventName)
        console.log("channel", channelName)
        queryClient.invalidateQueries({ queryKey: ["otp-notifications"] })
      },
    },
  ]

  useEffect(() => {
    if (!connections[WebsocketInstances.INTERNETCASH]) return
    subscribe(WebsocketInstances.INTERNETCASH, otpChannels)
  }, [connections[WebsocketInstances.INTERNETCASH]])

  return { pendingCount }
}
