import { MouseEventHandler } from "react"
import { ChevronRightIcon, PersonIcon } from "@/icons"

import { OrderListItem } from "@/types/interfaces/order.interface"
import { cn } from "@/lib/utils"
import { IconButton } from "@/components/iconButton"
import IconWrapper from "@/components/iconWrapper"
import { MainButtonProps } from "@/components/mainButton"
import {
  fontBodyBold,
  fontBodyNormal,
  fontButtonLarge,
  fontButtonSmall,
  fontCaptionBold,
  fontCaptionNormal,
  fontHeadline,
  fontTitle2,
  fontTitle3,
} from "@/styles/typography"

import { getTimeGapString } from "../../../lib/utils"

interface OrderItem {
  name: string
  quantity: number
  status: string
  notes?: string
}

interface TableDetailOrderItemCardProps {
  order: OrderListItem
  isSelected: boolean
  onClick: MouseEventHandler
  isDesktop?: boolean
}

const statusStyles: {
  [key: string]: {
    textColor: string
    bulletColor: string
    buttonVariant: MainButtonProps["variant"]
    borderColor?: string
    borderStyle?: string
  }
} = {
  Ordered: {
    textColor: "text-status-ordered",
    bulletColor: "bg-status-ordered",
    buttonVariant: "accept",
  },
  Ready: {
    textColor: "text-status-ready",
    bulletColor: "bg-status-ready",
    buttonVariant: "ready",
    borderColor: "border-black",
    borderStyle: "border-dashed",
  },
  Canceled: {
    textColor: "text-status-canceled",
    bulletColor: "bg-status-canceled",
    buttonVariant: "accept",
    borderColor: "border-white",
  },
  Served: {
    textColor: "text-status-served",
    bulletColor: "bg-status-served",
    buttonVariant: "accept",
    borderColor: "border-white",
  },
}

const statusMapping: { [key: string]: keyof typeof statusStyles } = {
  ordered: "Ordered",
  accepted: "Ready",
  advanced: "Ordered",
  ready: "Ready",
  closed: "Canceled",
  rejected: "Canceled",
  canceled: "Canceled",
  do_not_accept: "Canceled",
  served: "Served",
}

// Create the final statusStyles object
const finalStatusStyles = Object.entries(statusMapping).reduce(
  (acc, [status, mappedStatus]) => {
    acc[status] = statusStyles[mappedStatus]
    return acc
  },
  { ...statusStyles }
)

export const TableDetailOrderItemCard = ({
  order,
  isSelected,
  onClick,
  isDesktop = false,
}: TableDetailOrderItemCardProps) => {
  // Desktop view (lg and above) - original design
  if (isDesktop) {
    return (
      <div
        className={cn(
          "relative flex w-full flex-row items-center gap-2 rounded-3 border border-r-4 bg-white-60 py-2 pl-2 pr-4 text-black-100",
          isSelected ? "border-[#ff4500]" : "",
          "cursor-pointer"
        )}
        onClick={onClick}
      >
        <IconWrapper
          className={cn("absolute right-0", !isSelected ? "hidden" : "")}
          Component={ChevronRightIcon}
          size="20"
        />
        <div>
          <IconButton
            icon={PersonIcon}
            iconSize="24"
            size="large"
            variant={"secondary"}
            className={cn(isSelected ? "bg-[#ff4500]" : "")}
          />
        </div>
        <div className="flex w-[calc(100%-54px)] flex-col gap-1">
          <div className="flex w-full flex-row items-center justify-between gap-1">
            <span
              className={cn(
                "max-w-[60%] overflow-hidden truncate whitespace-nowrap",
                fontHeadline
              )}
            >
              {`${order?.customer?.first_name || ""} ${order?.customer?.middle_name || ""} ${order?.customer?.last_name || ""}`}
            </span>
            {order?.payment_status === "paid" && (
              <div
                className={cn(
                  "flex rounded-xl bg-green-300 px-2 py-1 text-green-700",
                  fontCaptionBold
                )}
              >
                Paid
              </div>
            )}
          </div>
          <div className="flex w-full flex-row justify-between gap-1">
            <span
              className={cn(
                "max-w-[70px] overflow-hidden truncate text-black-60",
                fontCaptionNormal
              )}
            >
              #{order?.order_number}
            </span>
            <span
              className={cn(
                "flex",
                fontCaptionNormal,
                statusStyles[statusMapping[order?.order_status]]?.textColor
              )}
            >
              {statusMapping[order?.order_status]}
            </span>
            <div
              className={cn(
                "max-w-[100px] overflow-hidden truncate whitespace-nowrap text-black-60",
                fontCaptionNormal
              )}
            >
              {getTimeGapString(order?.time)}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Mobile view - card with gray border and orange bottom border
  return (
    <div
      className={cn(
        "relative flex min-w-[160px] max-w-[160px] flex-col items-center justify-center rounded-3 border border-gray-200 bg-white-60 p-4 text-black-100 shadow-sm",
        isSelected ? "border-b-4 border-b-[#ff4500]" : "",
        "cursor-pointer"
      )}
      onClick={onClick}
    >
      <div className="relative mb-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <IconButton
            icon={PersonIcon}
            iconSize="24"
            size="large"
            variant={"sidebarWhite"}
            className={cn(isSelected ? "bg-[#ff4500] text-white" : "")}
          />
        </div>
        {order?.payment_status === "paid" && (
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-md bg-green-300 px-2 py-0.5 text-xs font-medium text-green-700">
            Paid
          </div>
        )}
      </div>
      <div className="mt-2 flex w-full flex-col items-center gap-1 text-center">
        <span
          className={cn(
            "w-full overflow-hidden truncate whitespace-nowrap font-bold",
            fontHeadline
          )}
        >
          {`${order?.customer?.first_name || ""} ${order?.customer?.last_name || ""}`}
        </span>
        <span className="text-sm text-gray-600">#{order?.order_number}</span>
        <div
          className={cn(
            "flex flex-col items-center justify-center text-sm font-medium text-purple-600"
          )}
        >
          <span>{statusMapping[order?.order_status]},</span>
          <span className="text-gray-600">{getTimeGapString(order?.time)}</span>
        </div>
      </div>
    </div>
  )
}
