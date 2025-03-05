"use client"

import { useEffect, useState } from "react"
import { OrderType } from "@/constants/orderTypes"
import { CloseIcon } from "@/icons"

import { OrderListItem } from "@/types/interfaces/order.interface"
import { Table } from "@/types/interfaces/table.interface"

// Import mock data from Tables component
import {
  mockOrderDetail,
  mockOrderListItems,
} from "../../components/LiveCounter/views/Tables"
import {
  DialogDescription,
  DialogFullScreenContent,
  DialogHeader,
  DialogTitle,
  FullScreenDialog,
} from "../dialog"
import { IconButton } from "../iconButton"
import { toast } from "../ui/use-toast"
import CancelOrderDialog from "./components/cancelOrderDialog"
import ChangeTableDialog from "./components/changeTableDialog"
import { MergeOrderListPanel } from "./components/MergeOrderListPanel"
import { OrderInfoCard } from "./components/OrderInfoCard"
import { OrderItemDetailPanel } from "./components/OrderItemDetailPanel"
import { OrderListPanel } from "./components/OrderListPanel"
import { OrderPayInfoPanel } from "./components/OrderPayInfoPanel"
import EditOrderDialog from "./EditOrderModal"

interface TableDetailDialogProps {
  item?: Table
  onClose: () => void
  selectedOrderId: string | null
  onOrderSelected: () => void
}

const TableDetailDialog: React.FC<TableDetailDialogProps> = ({
  item,
  onClose,
  selectedOrderId,
  onOrderSelected,
}) => {
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(0)
  const [mergeOrderOpened, setMergeOrderOpened] = useState(false)
  const [orderListItems, setOrderListItems] = useState<OrderListItem[]>([])
  const [orderDetailLoading, setOrderDetailLoading] = useState(false)
  const [orderDetailRefetching, setOrderDetailRefetching] = useState(false)
  const [orderListItemLoading, setOrderListItemLoading] = useState(false)

  useEffect(() => {
    setSelectedOrderIndex(0)
    setMergeOrderOpened(false)

    // Filter order list items for the selected table
    if (item) {
      const filteredOrders = mockOrderListItems.filter(
        (order) => order.table?.id === item.id
      )
      setOrderListItems(filteredOrders)
    } else {
      setOrderListItems([])
    }
  }, [item])

  useEffect(() => {
    if (selectedOrderId && orderListItems.length > 0) {
      const orderIndex = orderListItems.findIndex(
        (order) => order.order_id === selectedOrderId
      )
      if (orderIndex !== -1) {
        setSelectedOrderIndex(orderIndex)
        onOrderSelected()
      }
    }
  }, [selectedOrderId, orderListItems, onOrderSelected])

  // Get the current order item
  const orderListItem = orderListItems.at(selectedOrderIndex)

  const onOpenMergeOrder = () => {
    setMergeOrderOpened(true)
  }

  const onFinishMergeOrder = (selectedOrders: OrderListItem[]) => {
    // Mock update order function
    setTimeout(() => {
      toast({
        title: "Orders merged Successfully",
      })
      setMergeOrderOpened(false)

      // Update the order list to simulate merging
      const updatedOrders = [...orderListItems]
      // Remove merged orders except the first one
      const ordersToRemove = selectedOrders
        .slice(1)
        .map((order) => order.order_id)
      const filteredOrders = updatedOrders.filter(
        (order) => !ordersToRemove.includes(order.order_id)
      )
      setOrderListItems(filteredOrders)
    }, 500)
  }

  // Mock refetch functions
  const refetchOrderList = () => {
    setOrderListItemLoading(true)
    setTimeout(() => {
      // Simulate refetching order list
      if (item) {
        const filteredOrders = mockOrderListItems.filter(
          (order) => order.table?.id === item.id
        )
        setOrderListItems(filteredOrders)
      }
      setOrderListItemLoading(false)
    }, 500)
  }

  const refetchOrderDetail = () => {
    setOrderDetailRefetching(true)
    setTimeout(() => {
      // Simulate refetching order detail
      setOrderDetailRefetching(false)
    }, 500)
  }

  return (
    <FullScreenDialog
      isOpen={Boolean(item)}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogFullScreenContent className="max-h-screen overflow-hidden">
        <DialogHeader className="hidden">
          <DialogTitle>Table Detail</DialogTitle>
        </DialogHeader>
        <DialogDescription className="hidden">
          Table Detail Modal
        </DialogDescription>
        <div className="relative flex flex-row bg-body-gradient">
          <IconButton
            className="absolute right-4 top-4"
            variant="primaryWhite"
            size="large"
            icon={CloseIcon}
            iconSize="24"
            isActive={true}
            onClick={onClose}
          />
          <div className="m-4 h-[96vh] w-1/4 min-w-[360px]">
            {!mergeOrderOpened ? (
              <OrderListPanel
                item={item}
                orderListItems={orderListItems}
                selectedOrderIndex={selectedOrderIndex}
                isLoading={orderListItemLoading}
                setSelectedOrderIndex={setSelectedOrderIndex}
                onClickMergeOrder={onOpenMergeOrder}
              />
            ) : (
              <MergeOrderListPanel
                item={item}
                orderListItems={orderListItems}
                selectedOrderIndex={selectedOrderIndex}
                setSelectedOrderIndex={setSelectedOrderIndex}
                onClickMergeOrder={onFinishMergeOrder}
                onClickCancel={() => setMergeOrderOpened(false)}
              />
            )}
          </div>
          {orderListItems.length > 0 ? (
            <div className="m-4 flex h-[96vh] w-3/4 flex-col gap-4">
              <div className="flex w-full flex-row items-center gap-4">
                <h1 className="mr-6 text-2xl font-bold">Order Details</h1>
                <EditOrderDialog
                  order={mockOrderDetail}
                  isLoading={orderDetailLoading || orderDetailRefetching}
                  table={item}
                  onOrderItemUpdate={() => {
                    refetchOrderDetail?.()
                  }}
                  onOrderUpdate={() => {
                    refetchOrderDetail?.()
                    refetchOrderList()
                  }}
                />
                <ChangeTableDialog
                  item={orderListItem}
                  onChangeTable={() => {
                    setSelectedOrderIndex(0)
                    refetchOrderList()
                  }}
                />
                {orderListItem?.order_status === "ordered" && (
                  <CancelOrderDialog
                    orderListItem={orderListItem}
                    onCancelOrder={() => {
                      setSelectedOrderIndex(0)
                      refetchOrderList()
                    }}
                  />
                )}
              </div>
              <div className="flex w-full flex-row gap-2">
                <div className="flex w-[70%] flex-row gap-2">
                  <div className="flex w-1/3">
                    <OrderInfoCard order={orderListItem} variant="uesr-name" />
                  </div>
                  <div className="flex w-1/3">
                    <OrderInfoCard
                      order={orderListItem}
                      variant="order-number"
                    />
                  </div>
                  <div className="flex w-1/3">
                    <OrderInfoCard
                      order={orderListItem}
                      variant="order-status"
                    />
                  </div>
                </div>
                <div className="flex w-[30%]">
                  <OrderInfoCard
                    order={orderListItem}
                    orderDetail={mockOrderDetail}
                    variant="date-time"
                  />
                </div>
              </div>
              <div className="flex w-full flex-row gap-2">
                <div className="flex w-[70%] flex-row gap-2">
                  <OrderItemDetailPanel
                    order={mockOrderDetail}
                    isLoading={orderDetailLoading || orderDetailRefetching}
                    onDiscountUpdate={() => {
                      refetchOrderDetail()
                    }}
                  />
                </div>
                <div className="flex w-[30%]">
                  <OrderPayInfoPanel
                    order={mockOrderDetail}
                    isLoading={orderDetailLoading || orderDetailRefetching}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="m-4 flex h-[96vh] w-3/4 items-center justify-center">
              <p className="text-xl text-gray-500">No orders for this table</p>
            </div>
          )}
        </div>
      </DialogFullScreenContent>
    </FullScreenDialog>
  )
}

export default TableDetailDialog
