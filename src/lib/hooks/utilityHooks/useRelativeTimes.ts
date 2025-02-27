import { useEffect, useState } from "react"

import { OrderListItem } from "@/types/interfaces/order.interface"
import { getRelativeTimeFromUtc } from "@/lib/utils"

export type RelativeTimeMap = Map<
  string, // The `order_id` as the key
  {
    relativeTime: string // Relative time string, e.g., "5 minutes ago"
    editTime: string | null // The original edit time or null if not present
  }
>

export const useRelativeTimes = (
  orders: OrderListItem[],
  shouldRun: boolean
): RelativeTimeMap => {
  const [relativeTimeMap, setRelativeTimeMap] = useState(new Map())

  useEffect(() => {
    if (!shouldRun) return

    const updateRelativeTimes = () => {
      const newMap = new Map()
      orders.forEach((order) => {
        if (order.order_edit_time) {
          newMap.set(order.order_id, {
            relativeTime: getRelativeTimeFromUtc(order.order_edit_time),
            editTime: order.order_edit_time,
          })
        } else {
          newMap.set(order.order_id, {
            relativeTime: null,
            editTime: null,
          })
        }
      })

      // Avoid updating state if nothing has changed
      if (
        JSON.stringify(Array.from(relativeTimeMap.entries())) !==
        JSON.stringify(Array.from(newMap.entries()))
      ) {
        setRelativeTimeMap(newMap)
      }
    }

    updateRelativeTimes()
    const interval = setInterval(updateRelativeTimes, 60000) // Update every 60 seconds

    return () => clearInterval(interval)
  }, [orders, shouldRun])

  return relativeTimeMap
}
