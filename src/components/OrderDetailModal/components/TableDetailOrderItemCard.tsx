import { cn } from "@/lib/utils"
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
import { OrderListItem } from "@/types/interfaces/order.interface"
import { IconButton } from "@/components/iconButton"
import { ChevronRightIcon, PersonIcon } from "@/icons"
import IconWrapper from "@/components/iconWrapper"
import { MouseEventHandler } from "react"
import { getTimeGapString } from '../../../lib/utils';

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
  }
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
};

// Create the final statusStyles object
const finalStatusStyles = Object.entries(statusMapping).reduce((acc, [status, mappedStatus]) => {
  acc[status] = statusStyles[mappedStatus];
  return acc;
}, { ...statusStyles });

export const TableDetailOrderItemCard = ({
  order,
  isSelected,
  onClick
}: TableDetailOrderItemCardProps) => {
  return (
    <button
      className={cn(
        "relative flex flex-row w-full rounded-3 border border-r-4 bg-white-60 py-2 pl-2 pr-4 text-black-100 items-center gap-2",
        isSelected?"border-[#ff4500]":"",
      )}
      onClick={onClick}
    >
      <IconWrapper 
        className={cn("absolute right-0", !isSelected?"hidden":"")}
        Component={ChevronRightIcon} size="20" 
      />
      <div>
        <IconButton
          icon={PersonIcon}
          iconSize="24"
          size="large"
          variant={"secondary"}
          className={cn(isSelected?"bg-[#ff4500]":"")}
        />
      </div>
      <div className="flex flex-col gap-1 w-[calc(100%-54px)]">
        <div className="flex flex-row w-full items-center justify-between gap-1">
          <span className={cn("truncate whitespace-nowrap overflow-hidden max-w-[60%]", fontHeadline)}>
            {`${order?.customer?.first_name || ""} ${order?.customer?.middle_name || ""} ${order?.customer?.last_name || ""}`}
          </span>
          {
            order?.payment_status === "paid" &&
            <div className={cn("flex rounded-xl bg-green-300 text-green-700 px-2 py-1", fontCaptionBold)}>
              Paid
            </div>
          }
        </div>
        <div className="flex flex-row w-full justify-between gap-1">
          <span className={cn("max-w-[70px] overflow-hidden truncate text-black-60", fontCaptionNormal)}>
            #{order?.order_number}
          </span>
          <span className={cn("flex", fontCaptionNormal, statusStyles[statusMapping[order?.order_status]]?.textColor)}>
            {statusMapping[order?.order_status]}
          </span>
          <div className={cn("max-w-[100px] text-black-60 overflow-hidden truncate whitespace-nowrap", fontCaptionNormal)}>
            {getTimeGapString(order?.time)}
          </div>
        </div>
        
      </div>
    </button>
  )
}
