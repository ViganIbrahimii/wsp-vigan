import { LabProfileIcon, PersonIcon } from "@/icons"

import { OrderListItem } from "@/types/interfaces/order.interface"
import { TableOrder } from "@/types/interfaces/table.interface"
import { cn, getTimeGapString } from "@/lib/utils"
import { MainButtonProps } from "@/components/mainButton"
import {
  fontBodyNormal,
  fontButtonLarge,
  fontTitle2,
} from "@/styles/typography"

import HighlightedText from "./highlightedText"

interface TableCardProps {
  id: string
  brand_id: string
  user_id: string
  name: string
  section_name: string
  no_of_capacity: number
  table_order?: TableOrder
  created_at?: string
  updated_at?: string
  isSmallIconView?: boolean
  isChecked?: boolean
  disabled?: boolean
  onClick?: React.MouseEventHandler
  searchTerm?: string
}

const statusStyles: {
  [key: string]: {
    textColor: string
    bulletColor: string
    buttonVariant: MainButtonProps["variant"]
    borderColor: string
    borderStyle?: string
  }
} = {
  Ordered: {
    textColor: "text-status-ordered",
    bulletColor: "bg-status-ordered",
    buttonVariant: "accept",
    borderColor: "border-status-livecounter-ordered",
    borderStyle: "border-dashed",
  },
  Accepted: {
    textColor: "text-status-accepted",
    bulletColor: "bg-status-accepted",
    buttonVariant: "accept",
    borderColor: "border-status-livecounter-ordered",
  },
  Served: {
    textColor: "text-status-served",
    bulletColor: "bg-status-served",
    buttonVariant: "accept",
    borderColor: "border-status-livecounter-ordered",
  },
  Free: {
    textColor: "text-status-ordered",
    bulletColor: "bg-status-ordered",
    buttonVariant: "accept",
    borderColor: "border-status-livecounter-free",
  },
  Ready: {
    textColor: "text-status-ready",
    bulletColor: "bg-status-ready",
    buttonVariant: "ready",
    borderColor: "border-status-livecounter-ordered",
    borderStyle: "border-dashed",
  },
}

export const TableCard = ({
  id,
  brand_id,
  user_id,
  name,
  section_name,
  no_of_capacity,
  table_order,
  created_at,
  updated_at,
  isSmallIconView,
  isChecked,
  disabled,
  onClick,
  searchTerm,
}: TableCardProps) => {
  const getStatus = () => {
    //(ordered,accepted,ready,served,delivered,closed,rejected,advanced,canceled,do_not_accept)

    if (!table_order) return "Free"
    if (table_order.status === "ready") return "Ready"
    if (table_order.status === "ordered") return "Ordered"
    if (table_order.status === "accepted") return "Accepted"
    if (table_order.status === "served") return "Served"
    if (table_order.status === "advanced") return "Ordered"
    if (table_order.status === "delivered") return "Served"
    if (table_order.status === "canceled" || table_order.status === "closed")
      return "Free"
    return "Free"
  }

  const status = getStatus()

  if (isSmallIconView) {
    return (
      <button
        className={cn(
          "w-full rounded-5 border-l-4 bg-white-60 px-2 py-6 text-black-100 hover:bg-gray-200 active:bg-gray-400",
          statusStyles[status]?.borderColor,
          statusStyles[status]?.borderStyle,
          isChecked ? "bg-black/60 text-white" : "",
          disabled ? "cursor-not-allowed" : ""
        )}
        disabled={disabled}
        onClick={onClick}
      >
        <div className="flex w-full items-center justify-center">
          <h2 className={cn("line-clamp-1 overflow-ellipsis", fontButtonLarge)}>
            <HighlightedText text={name} searchTerm={searchTerm || ""} />
          </h2>
        </div>
      </button>
    )
  }
  return (
    <button
      className={cn(
        "w-full rounded-5 border-l-4 bg-white-60 p-4 text-black-100",
        statusStyles[status]?.borderColor,
        statusStyles[status]?.borderStyle
      )}
      onClick={status !== "Free" ? onClick : () => {}}
    >
      <div className="mb-2 flex items-center justify-between">
        <h2 className={cn("line-clamp-1 overflow-ellipsis", fontTitle2)}>
          {name ?? "No Name"}
        </h2>
        <div className={cn("flex flex-row")}>
          <div className={cn("flex text-black", fontBodyNormal)}>
            {no_of_capacity}
          </div>
          <PersonIcon className="mr-1 h-6 w-6 text-gray-400" />
        </div>
      </div>
      <div
        className={cn(
          "mb-6 line-clamp-1 whitespace-nowrap flex truncate text-left text-black-60",
          fontBodyNormal
        )}
      >
        {section_name || "-"}
      </div>
      <div
        className={cn(
          "flex text-black",
          fontBodyNormal,
          `${status === "Free" ? "pt-[24px]" : ""}`
        )}
      >
        {status}
      </div>
      {status !== "Free" && (
        <div
          className={cn(
            "flex flex-row items-end justify-between text-black-60",
            fontBodyNormal
          )}
        >
          <span className="truncate whitespace-nowrap">
            {getTimeGapString(table_order?.order_time ?? "") ?? "-"}
          </span>
          <div className="flex flex-row">
            {table_order?.order_count}
            <LabProfileIcon className="mr-1 h-6 w-6 text-gray-400" />
          </div>
        </div>
      )}
    </button>
  )
}
