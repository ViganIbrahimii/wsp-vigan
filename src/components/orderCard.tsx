import {
  GetOrderParams,
  GetOrdersParams,
  GetOrdersResponse,
  UpdateOrderResponse,
} from "@/api/orders"
import { OrderStatuses, statusStyles } from "@/constants/orderStatuses"
import { OrderType, OrderTypeLabels } from "@/constants/orderTypes"
import { useAuth } from "@/providers/AuthProvider/AuthProvider"
import {
  InfiniteData,
  QueryClient,
  useQueryClient,
} from "@tanstack/react-query"

import { ItemDetails } from "@/types/interfaces/order.interface"
import { useUpdateOrder } from "@/lib/hooks/mutations/orders/useUpdateOrder"
import {
  cn,
  extractHoursAndMinutes,
  getNextStatus,
  getRelativeTimeFromUtc,
} from "@/lib/utils"
import CancelOrderDialog from "@/components/cancelOrderDialog"
import HighlightedText from "@/components/highlightedText"
import { MainButton, MainButtonProps } from "@/components/mainButton"
import OrderItem from "@/components/orderItem"
import {
  fontBodyNormal,
  fontCaptionBold,
  fontCaptionNormal,
  fontTitle3,
} from "@/styles/typography"

import { Separator } from "./ui/separator"
import { toast } from "./ui/use-toast"

interface OrderCardProps {
  orderId: string
  orderNumber: string
  paymentStatus: string
  table?: string
  time: string
  status: OrderStatuses
  items: ItemDetails[]
  editTimeAgo?: string | null
  orderInstructions?: string
  searchTerm: string
  filters: GetOrdersParams
  orderType: OrderType
}

const actionTexts: Record<OrderStatuses, string> = {
  [OrderStatuses.ORDERED]: "Accept All",
  [OrderStatuses.ACCEPTED]: "Ready All",
  [OrderStatuses.READY]: "Serve All",
  [OrderStatuses.SERVED]: "",
  [OrderStatuses.CANCELED]: "",
  [OrderStatuses.CLOSED]: "",
  [OrderStatuses.REJECTED]: "",
  [OrderStatuses.ADVANCED]: "",
  [OrderStatuses.DO_NOT_ACCEPT]: "",
  [OrderStatuses.DELIVERED]: "",
}

const sequentialOrderStatuses = [
  OrderStatuses.ORDERED,
  OrderStatuses.ACCEPTED,
  OrderStatuses.READY,
  OrderStatuses.SERVED,
]

const getActionTextAndVariant = (
  currentStatus: OrderStatuses | null,
  nextStatus: OrderStatuses | null
) => {
  if (!currentStatus || !nextStatus) {
    return { text: null, variant: null }
  }

  return {
    text: actionTexts[currentStatus], // Use currentStatus for the button text
    variant: statusStyles[nextStatus]?.buttonVariant || "primary", // Use nextStatus for the variant
  }
}
const shouldUpdateItemStatus = (
  currentItemStatus: OrderStatuses,
  newOrderStatus: OrderStatuses
): boolean => {
  const currentIndex = sequentialOrderStatuses.indexOf(currentItemStatus)
  const newIndex = sequentialOrderStatuses.indexOf(newOrderStatus)

  // If either status is not in the order, or the item is already "served", no update
  if (
    currentIndex === -1 ||
    newIndex === -1 ||
    currentItemStatus === OrderStatuses.SERVED
  ) {
    return false
  }

  // Only update if the item's status is behind the new status
  return currentIndex < newIndex
}

export const OrderCard = ({
  orderId,
  orderNumber,
  paymentStatus,
  table,
  time,
  status,
  items,
  editTimeAgo,
  orderInstructions,
  searchTerm,
  filters,
  orderType,
}: OrderCardProps) => {
  const queryClient = useQueryClient()
  const { brand } = useAuth()

  const getOrderTypeLabel = (orderType: OrderType): string => {
    if (orderType === OrderType.DINE && table) {
      const formattedTable = table.toLowerCase().startsWith("table")
        ? table
        : `Table ${table}`
      return `${formattedTable}`
    }
    return OrderTypeLabels[orderType] || OrderTypeLabels[OrderType.ALL] // Fallback for unexpected values
  }

  const {
    mutate: updateOrderMutate,
    error,
    isPending: isOrderUpdatePending,
  } = useUpdateOrder()

  const nextStatus = getNextStatus(status)

  const { text: actionText, variant: actionVariant } = getActionTextAndVariant(
    status,
    nextStatus
  )
  if (
    filters.order_status &&
    !filters.order_status.split(",").includes(status)
  ) {
    return null
  }
  const handleStatusChange = (newStatus: OrderStatuses) => {
    updateOrderMutate(
      {
        order_id: orderId,
        order_status: newStatus,
      },
      {
        onSuccess: (response) => {
          const { data } = response.data // Extract data from the response
          const updatedOrderStatus = data.order_status

          const queryKey = ["orders", filters]
          queryClient.setQueryData<InfiniteData<GetOrdersResponse>>(
            queryKey,
            (oldData) => {
              if (!oldData) return oldData

              return {
                ...oldData,
                pages: oldData.pages.map((page) => ({
                  ...page,
                  data: page.data.map((order) => {
                    if (order.order_id === orderId) {
                      // Update the order status directly from the response
                      return {
                        ...order,
                        order_status: updatedOrderStatus,
                        item_details: order.item_details.map((item) => {
                          // Keep the current logic for updating item statuses
                          if (
                            shouldUpdateItemStatus(
                              item.item_status,
                              updatedOrderStatus
                            )
                          ) {
                            return { ...item, item_status: updatedOrderStatus }
                          }
                          return item
                        }),
                      }
                    }
                    return order
                  }),
                })),
              }
            }
          )

          // Optionally invalidate queries for fresh data
          queryClient.invalidateQueries({ queryKey: ["orders"] })
          queryClient.invalidateQueries({ queryKey: ["orders-stats"] })
        },
        onError: (error) => {
          console.error("Error updating order status:", error)
          toast({
            title: "Error updating order status",
            description: error.message,
          })
        },
      }
    )
  }

  return (
    <div
      className={cn(
        "relative w-full rounded-5 border-t-2 bg-white-60 py-4 text-black-100",
        statusStyles[status]?.borderColor
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-4 px-4">
        <h2 className={cn("", fontTitle3)}>
          <HighlightedText text={`#${orderNumber}`} searchTerm={searchTerm} />
        </h2>
        <div
          className={cn(
            "flex items-center gap-2 text-end text-black-60",
            fontCaptionNormal
          )}
        >
          {orderType && (
            <>
              <HighlightedText
                text={getOrderTypeLabel(orderType)}
                searchTerm={searchTerm}
                className="capitalize"
              />
              <Separator
                orientation="vertical"
                className="h-[14px] bg-black-40"
              />
            </>
          )}
          <div>{extractHoursAndMinutes(time)}</div>
        </div>
      </div>

      {paymentStatus == "paid" && (
        <p className={cn("mb-2 flex items-center gap-2 px-4", fontBodyNormal)}>
          <span
            className={cn(
              "rounded-6 bg-semantic-green-20 px-2 py-[1px] capitalize text-semantic-green",
              fontCaptionBold
            )}
          >
            <HighlightedText text={paymentStatus} searchTerm={searchTerm} />
          </span>
        </p>
      )}
      {editTimeAgo && !filters.order_status?.includes(OrderStatuses.CLOSED) && (
        <p className={cn("mb-2 flex items-center gap-2 px-4", fontBodyNormal)}>
          Edited
          <span
            className={cn(
              "rounded-6 bg-semantic-red-20 px-2 py-[1px] text-semantic-red ",
              fontCaptionBold
            )}
          >
            <HighlightedText text={editTimeAgo || ""} searchTerm={searchTerm} />
          </span>
        </p>
      )}
      <div className="flex items-center justify-between gap-2 px-4">
        {items.length > 0 &&
          items.every((item) => item.item_status === OrderStatuses.ORDERED) &&
          status == OrderStatuses.ORDERED && (
            <CancelOrderDialog
              orderNumber={orderNumber}
              orderId={orderId}
              filters={filters}
            />
          )}
        {actionText && actionVariant && nextStatus && (
          <MainButton
            variant={actionVariant as MainButtonProps["variant"]}
            className="my-2 w-full"
            onClick={() => handleStatusChange(nextStatus)}
            disabled={isOrderUpdatePending}
          >
            {isOrderUpdatePending ? "Processing" : actionText}
          </MainButton>
        )}
      </div>
      {orderInstructions && (
        <p className={cn("rounded-3 bg-black-5 p-2")}>
          <HighlightedText text={orderInstructions} searchTerm={searchTerm} />
        </p>
      )}
      <ul className="list-none">
        {items.map((item, index) => {
          return (
            <OrderItem
              key={index}
              index={index}
              item={item}
              items={items}
              orderId={orderId}
              itemsLength={items.length}
              searchTerm={searchTerm} // Pass the search term for highlighting
              filters={filters}
            />
          )
        })}
      </ul>
    </div>
  )
}
