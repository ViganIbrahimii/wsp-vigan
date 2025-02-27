import React, { useState } from "react"
import { GetOrdersParams, GetOrdersResponse } from "@/api/orders"
import { OrderStatuses, statusStyles } from "@/constants/orderStatuses"
import { CheckIcon, ChevronRightIcon, TrashIcon } from "@/icons"
import { InfiniteData, useQueryClient } from "@tanstack/react-query"

import { ItemDetails, OrderListItem } from "@/types/interfaces/order.interface"
import { useUpdateOrderItem } from "@/lib/hooks/mutations/order-items/useUpdateOrderItem"
import {
  calculateOrderStatus,
  cn,
  getNextStatus,
  updateItemAndRecalculateOrder,
} from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import CancelItemDialog from "@/components/cancelItemDialog"
import IconWrapper from "@/components/iconWrapper"
import { MainButton } from "@/components/mainButton"
import {
  fontBodyBold,
  fontButtonSmall,
  fontCaptionNormal,
} from "@/styles/typography"

interface OrderItemProps {
  item: ItemDetails
  items: ItemDetails[]
  index: number
  itemsLength: number
  searchTerm: string
  orderId: string
  filters: GetOrdersParams
}

const statusDisplayNames: Record<OrderStatuses, string> = {
  [OrderStatuses.ORDERED]: "Ordered",
  [OrderStatuses.ACCEPTED]: "Accepted",
  [OrderStatuses.READY]: "Ready",
  [OrderStatuses.SERVED]: "Served",
  [OrderStatuses.CANCELED]: "Canceled",
  [OrderStatuses.CLOSED]: "Completed", // Map Closed to Completed
  [OrderStatuses.REJECTED]: "Rejected",
  [OrderStatuses.ADVANCED]: "Advanced",
  [OrderStatuses.DO_NOT_ACCEPT]: "Do Not Accept",
  [OrderStatuses.DELIVERED]: "Delivered",
}

const OrderItem = ({
  item,
  items,
  index,
  itemsLength,
  searchTerm,
  orderId,
  filters,
}: OrderItemProps) => {
  const queryClient = useQueryClient()

  const modifiedItem = {
    ...item,
    item_status:
      filters?.order_status?.includes(OrderStatuses.CLOSED) &&
      item.item_status !== OrderStatuses.CANCELED
        ? OrderStatuses.CLOSED
        : item.item_status,
  }

  const {
    mutate: updateItemMutate,
    isPending: isUpdateItemPending,
    error: updateItemError,
  } = useUpdateOrderItem()

  const [isAnimating, setIsAnimating] = useState(false)
  const [newStatus, setNewStatus] = useState<OrderStatuses | null>(null)
  const [cancel, setCancel] = useState<boolean>(false)

  const nextStatus = getNextStatus(item.item_status)

  const triggerStatusChange = (status: OrderStatuses, skipUpdate = false) => {
    setIsAnimating(true)
    setNewStatus(status)

    if (!skipUpdate) {
      handleUpdateItem(status)
    }

    setTimeout(() => {
      setIsAnimating(false)
      setNewStatus(null)
      setCancel(false)
    }, 2000) // Duration of the animation
  }

  const handleCancelItem = (cancelQuantity: number) => {
    const remainingQuantity = item.item_quantity - cancelQuantity
    setCancel(true)
    triggerStatusChange(OrderStatuses.CANCELED, true)
    const mutationBody = {
      order_id: orderId,
      order_item_id: item.id,
      status:
        remainingQuantity === 0 ? OrderStatuses.CANCELED : item.item_status,
      price: item.price,
      quantity:
        remainingQuantity === 0 ? item.item_quantity : remainingQuantity,
      special_instruction: item.item_instruction || "",
    }

    updateItemMutate(mutationBody, {
      onSuccess: (response) => {
        const updatedItemStatus = response.data.data.status
        const updatedItemQuantity = response.data.data.quantity

        const queryKey = ["orders", filters]
        queryClient.setQueryData<InfiniteData<GetOrdersResponse>>(
          queryKey,
          (oldData) => {
            if (!oldData) return oldData

            const newData = {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                data: page.data
                  .map((order) => {
                    if (order.order_id === orderId) {
                      const updatedItems = order.item_details.map(
                        (itemDetail) =>
                          itemDetail.id === item.id
                            ? {
                                ...itemDetail,
                                item_status: updatedItemStatus,
                                item_quantity: updatedItemQuantity,
                              }
                            : itemDetail
                      )

                      const updatedOrderStatus =
                        calculateOrderStatus(updatedItems)

                      if (updatedOrderStatus === OrderStatuses.CANCELED) {
                        return null // Mark for removal
                      }

                      return {
                        ...order,
                        order_status: updatedOrderStatus,
                        item_details: updatedItems,
                      }
                    }
                    return order
                  })
                  .filter((order): order is OrderListItem => order !== null), // Remove nulls
              })),
            }

            return newData
          }
        )

        queryClient.invalidateQueries({ queryKey: ["orders"] })
        queryClient.invalidateQueries({ queryKey: ["orders-stats"] })

        toast({
          title:
            updatedItemStatus === OrderStatuses.CANCELED
              ? "Item fully canceled"
              : `Item partially canceled (${updatedItemQuantity} remaining)`,
        })
      },
      onError: (error) => {
        toast({
          title: "Error canceling item",
          description: error.message,
        })
      },
    })
  }

  const handleUpdateItem = (nextStatus: OrderStatuses) => {
    updateItemMutate(
      {
        order_id: orderId,
        order_item_id: item.id,
        status: nextStatus,
        price: item.price,
        quantity: item.item_quantity,
        special_instruction: item.item_instruction || "",
      },
      {
        onSuccess: (response) => {
          const { data } = response.data // Extract item details from the API response
          const updatedItemStatus = data.status // Use the returned status

          // Update item status and recalculate order status
          const { updatedItems, updatedOrderStatus } =
            updateItemAndRecalculateOrder(
              data.item_id,
              updatedItemStatus,
              items
            )

          const queryKey = ["orders", filters]

          queryClient.setQueryData<InfiniteData<GetOrdersResponse>>(
            queryKey,
            (oldData) => {
              if (!oldData) return oldData

              const newData = {
                ...oldData,
                pages: oldData.pages.map((page) => ({
                  ...page,
                  data: page.data
                    .map((order) => {
                      if (order.order_id === orderId) {
                        if (updatedOrderStatus === OrderStatuses.CANCELED) {
                          return null // Mark for removal
                        }

                        return {
                          ...order,
                          order_status: updatedOrderStatus,
                          item_details: updatedItems,
                        }
                      }
                      return order
                    })
                    .filter((order): order is OrderListItem => order !== null), // Remove nulls
                })),
              }

              return newData
            }
          )

          queryClient.invalidateQueries({ queryKey: ["orders"] })
          queryClient.invalidateQueries({ queryKey: ["orders-stats"] })

          toast({
            title:
              updatedOrderStatus === OrderStatuses.CANCELED
                ? "Order canceled and removed"
                : "Item status updated successfully",
          })
        },
        onError: (error) => {
          toast({
            title: "Error updating item status",
            description: error.message,
          })
        },
      }
    )
  }

  const renderButtons = () => {
    if (
      modifiedItem.item_status === OrderStatuses.SERVED ||
      modifiedItem.item_status === OrderStatuses.CLOSED
    ) {
      return null
    }

    if (modifiedItem.item_status === OrderStatuses.ORDERED) {
      return (
        <div className="flex items-center gap-2">
          <MainButton
            variant="accept"
            icon={CheckIcon}
            iconSize={"20"}
            iconPosition={"left"}
            className={cn("h-[28px] px-3", fontButtonSmall)}
            onClick={() => triggerStatusChange(OrderStatuses.ACCEPTED, false)}
            disabled={isUpdateItemPending}
          >
            Accept
          </MainButton>

          <CancelItemDialog
            item={item}
            handleCancelItem={handleCancelItem}
            isUpdateItemPending={isUpdateItemPending}
          />
        </div>
      )
    }

    const nextStatus = getNextStatus(modifiedItem.item_status)

    if (nextStatus) {
      return (
        <MainButton
          icon={ChevronRightIcon}
          iconSize={"20"}
          iconPosition={"left"}
          className={cn("h-[28px] px-3", fontButtonSmall)}
          variant={statusStyles[nextStatus]?.buttonVariant}
          disabled={isUpdateItemPending}
          onClick={() => triggerStatusChange(nextStatus)}
        >
          {nextStatus}
        </MainButton>
      )
    }

    return null
  }

  return (
    <li
      className={cn(
        "group relative flex items-start justify-between overflow-hidden",
        index !== itemsLength - 1 && "border-b border-black-10"
      )}
    >
      <div
        className={cn(
          "duration-2500 z-20 flex h-full w-full items-start justify-between gap-2 px-4 py-4 transition-transform",
          isAnimating && !cancel
            ? "animate-slide-out-right bg-white-100"
            : isAnimating && cancel
              ? "animate-slide-out-left bg-white-100"
              : "translate-x-0"
        )}
      >
        <div className={cn("flex items-start justify-between gap-2")}>
          <span className={cn(fontBodyBold, "font-bold")}>
            {item.item_quantity}
          </span>
          <div className={cn("flex flex-col")}>
            <span className={cn(fontBodyBold, "font-bold")}>{item.name}</span>
            {item.item_instruction && (
              <p className={cn("text-black-60", fontCaptionNormal)}>
                {item.item_instruction}
              </p>
            )}
          </div>
        </div>
        <p
          className={cn(
            "flex items-center gap-1",
            statusStyles[modifiedItem.item_status]?.textColor || ""
          )}
        >
          <span
            className={cn(
              "h-1 w-1 rounded-full",
              statusStyles[modifiedItem.item_status]?.bulletColor || ""
            )}
          ></span>
          <span className={cn(fontCaptionNormal, "capitalize leading-[24px]")}>
            {statusDisplayNames[modifiedItem.item_status] ||
              modifiedItem.item_status}
          </span>
        </p>
      </div>

      <div
        className={cn(
          "absolute inset-0 hidden items-center bg-white-60 px-4 group-hover:flex",
          isAnimating ? "z-0" : "z-20"
        )}
      >
        {renderButtons()}
      </div>
      {isAnimating && newStatus && (
        <div
          className={cn(
            "absolute inset-0 z-10 flex h-full w-full items-center justify-center py-2  transition-all duration-1000",
            statusStyles[newStatus]?.backgroundColor
          )}
        >
          <span
            className={cn(
              "flex h-full w-full items-center gap-2 px-4 capitalize text-white-100",
              isAnimating && cancel ? "justify-end" : "justify-start"
            )}
          >
            {newStatus !== OrderStatuses.ACCEPTED &&
              newStatus !== OrderStatuses.CANCELED && (
                <IconWrapper
                  Component={ChevronRightIcon}
                  size={"24"}
                  color={"white100"}
                />
              )}
            {newStatus === OrderStatuses.ACCEPTED && (
              <IconWrapper
                Component={CheckIcon}
                size={"24"}
                color={"white100"}
              />
            )}
            {newStatus}
            {newStatus === OrderStatuses.CANCELED && (
              <IconWrapper
                Component={TrashIcon}
                size={"24"}
                color={"white100"}
              />
            )}
          </span>
        </div>
      )}
    </li>
  )
}

export default OrderItem
