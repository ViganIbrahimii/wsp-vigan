import * as React from "react"
import { OrderStatuses } from "@/constants/orderStatuses"

import { cn } from "@/lib/utils"
import { fontCaptionBold, fontCaptionNormal } from "@/styles/typography"

export interface OrderStatusStatsProps {
  statuses: { number: number; text: OrderStatuses }[]
  selectedStatus: string
  onStatusSelect: (orderStatus: OrderStatuses | "") => void
}

const statusTextColors: { [key: string]: string } = {
  [OrderStatuses.ORDERED]: "text-status-ordered",
  [OrderStatuses.ACCEPTED]: "text-status-accepted",
  [OrderStatuses.READY]: "text-status-ready",
  [OrderStatuses.SERVED]: "text-status-served",
}

const OrderStatusStats: React.FC<OrderStatusStatsProps> = ({
  statuses,
  selectedStatus,
  onStatusSelect,
}) => {
  return (
    <div
      className={cn(
        "flex h-[48px] w-full cursor-pointer rounded-3 bg-white-60 md:w-fit"
      )}
    >
      {statuses.map((status, index) => (
        <div
          key={index}
          onClick={() =>
            onStatusSelect(selectedStatus === status.text ? "" : status.text)
          }
          className={cn(
            "flex flex-1 flex-col items-center justify-center py-2 md:flex-auto md:px-4",
            index === 0 ? "rounded-l-3" : "",
            index === statuses.length - 1 ? "rounded-r-3" : "",
            index !== statuses.length - 1 ? "border-r border-black-10" : "",
            "border border-black-10",
            selectedStatus === status.text ? "border-none bg-white-100" : ""
          )}
        >
          <span
            className={cn(fontCaptionBold, statusTextColors[status.text] || "")}
          >
            {status.number}
          </span>
          <span
            className={cn(
              fontCaptionNormal,
              "capitalize",
              statusTextColors[status.text] || ""
            )}
          >
            {status.text}
          </span>
        </div>
      ))}
    </div>
  )
}

export { OrderStatusStats }
