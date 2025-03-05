import { MouseEventHandler, useEffect, useState } from "react"
import { ChevronRightIcon, PersonIcon } from "@/icons"

import { OrderListItem } from "@/types/interfaces/order.interface"
import { cn } from "@/lib/utils"
import Checkbox from "@/components/checkbox"
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

interface OrderItem {
  name: string
  quantity: number
  status: string
  notes?: string
}

interface TableDetailOrderCheckItemCardProps {
  order: OrderListItem
  isSelected: boolean
  checked: boolean
  onCheckItem: (bStatus: boolean) => void
  onClick: MouseEventHandler
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
    textColor: "text-status-ordered",
    bulletColor: "bg-status-ordered",
    buttonVariant: "accept",
    borderColor: "border-white",
  },
  Served: {
    textColor: "text-status-ordered",
    bulletColor: "bg-status-ordered",
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

export const TableDetailOrderCheckItemCard = ({
  order,
  isSelected,
  checked,
  onCheckItem,
  onClick,
}: TableDetailOrderCheckItemCardProps) => {
  return (
    <button
      className={cn(
        "relative flex w-full flex-row items-center gap-2 rounded-3 border border-r-4 bg-white-60 py-2 pl-2 pr-4 text-black-100",
        isSelected ? "border-[#ff4500]" : ""
      )}
      onClick={onClick}
    >
      <IconWrapper
        className={cn("absolute right-0", !isSelected ? "hidden" : "")}
        Component={ChevronRightIcon}
        size="20"
      />
      <div className={cn(order?.payment_status?.toLowerCase().trim() === "paid" || (order?.item_details?.length ?? 0) === 0 ? "invisible" : "visible")}>
        <Checkbox
          checked={checked}
          size="small"
          onClick={() => onCheckItem(!checked)}
        />
      </div>
      <div className="flex w-full flex-col gap-1">
        <div className="flex w-full flex-row items-center justify-between">
          <h2 className={cn("", fontHeadline)}>{`${order.customer?.first_name || ""} ${order.customer?.middle_name || ""} ${order.customer?.last_name || ""}`}</h2>
          {order.payment_status === "paid" && (
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
        <div className="flex w-full flex-row justify-between">
          <div className={cn("flex text-black-60", fontCaptionNormal)}>
            #{order?.order_number}
          </div>
          <div
            className={cn(
              "flex",
              fontCaptionNormal,
              `${statusMapping[order.order_status] !== "Canceled" ? "text-black" : "text-red-500"}`
            )}
          >
            {statusMapping[order.order_status]}
          </div>
          <div className={cn("flex flex-row text-black-60", fontCaptionNormal)}>
            {order.time}
          </div>
        </div>
      </div>
    </button>
  )
}
