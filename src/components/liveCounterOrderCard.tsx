import { capitalizeFirstChar, cn, getTimeGapString } from "@/lib/utils"
import { MainButtonProps } from "@/components/mainButton"
import {
  fontBodyNormal,
  fontButtonLarge,
  fontButtonSmall,
  fontTitle2,
} from "@/styles/typography"
import { OrderStatuses } from "@/constants/orderStatuses"

interface OrderItem {
  name: string
  quantity: number
  status: string
  notes?: string
}

interface LiveCounterOrderCardProps {
  order_id?: string
  order_number: string
  customer_name:string
  order_status: OrderStatuses,
  payment_status: "paid" | "unpaid" | string
  time: string
  isSmallIconView?: boolean
  onClick?: React.MouseEventHandler;
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
  Closed: {
    textColor: "text-status-ordered",
    bulletColor: "bg-status-ordered",
    buttonVariant: "accept",
    borderColor: "border-white",
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
  }
}

const statusMapping: { [key: string]: keyof typeof statusStyles } = {
  ordered: "Ordered",
  preparing: "Preparing",
  accepted: "Ordered",
  advanced: "Advanced",
  ready: "Ready",
  closed: "Closed",
  rejected: "Rejected",
  canceled: "Canceled",
  do_not_accept: "Not Accepted",
  served: "Served",
};

// Create the final statusStyles object
const finalStatusStyles = Object.entries(statusMapping).reduce((acc, [status, mappedStatus]) => {
  acc[status] = statusStyles[mappedStatus];
  return acc;
}, { ...statusStyles });

export const LiveCounterOrderCard = ({
  order_number,
  customer_name,
  order_status,
  payment_status,
  time,
  isSmallIconView,
  onClick
}: LiveCounterOrderCardProps) => {
  if (isSmallIconView) {
    return (
      <button
        className={cn(
          "w-full rounded-5 border-l-4 bg-white-60 py-4 text-black-100",
          finalStatusStyles[order_status]?.borderColor,
          finalStatusStyles[order_status]?.borderStyle,
        )}
        onClick={onClick}
      >
        <div className="w-full flex items-center justify-center">
          <h2 className={cn("", fontButtonLarge)}>#{order_number}</h2>
        </div>
      </button>
    )
  }
  return (
    <button
      className={cn(
        "w-full rounded-5 border-l-4 bg-white-60 p-4 text-black-100",
        finalStatusStyles[order_status]?.borderColor,
          finalStatusStyles[order_status]?.borderStyle,
      )}
      onClick={onClick}
    >
      <div className="mb-2 flex items-center">
        <h2 className={cn("", fontTitle2)}>#{order_number ?? "-"}</h2>
      </div>
      <div className={cn("mb-6 flex text-black-60", fontBodyNormal)}>
        {(!customer_name || customer_name.trim()==="") ? "-" : customer_name}
      </div>
      <div className={cn("flex", fontBodyNormal, `${statusMapping[order_status] !== "Canceled" ? 'text-black':'text-red-500'}`)}>
        {capitalizeFirstChar(order_status) || '-'}
      </div>
      <div className={cn("flex flex-row gap-2 text-black-60 justify-between items-end", fontBodyNormal)}>
        <span className="truncate max-w-[70%]">{getTimeGapString(time) ?? "-:-:-"}</span>
        {
          payment_status === "paid" &&
          <div className={cn("flex rounded-lg bg-green-300 text-green-700 px-2 py-1", fontButtonSmall)}>
            Paid
          </div>
        }
      </div>
    
    </button>
  )
}
