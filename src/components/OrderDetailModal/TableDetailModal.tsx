import { table } from "console"
import { useEffect, useState } from "react"
import { GetOrderParams } from "@/api/orders"
import { OrderType } from "@/constants/orderTypes"
import { CloseIcon } from "@/icons"
import { useAuth } from "@/providers/AuthProvider/AuthProvider"

import { OrderListItem } from "@/types/interfaces/order.interface"
import { Table } from "@/types/interfaces/table.interface"
import { useUpdateOrder } from "@/lib/hooks/mutations/orders/useUpdateOrder"
import { useGetOrder } from "@/lib/hooks/queries/orders/useGetOrder"
import { useGetOrders } from "@/lib/hooks/queries/orders/useGetOrders"

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
  const { brandId } = useAuth()
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(0)
  const [mergeOrderOpened, setMergeOrderOpened] = useState(false)
  const [orderListItems, setOrderListItems] = useState<OrderListItem[]>([])

  const { mutate: updateOrder, isPending, error } = useUpdateOrder()

  useEffect(() => {
    setSelectedOrderIndex(0)
    setMergeOrderOpened(false)
    setOrderListItems([])
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
  }, [selectedOrderId, orderListItems])

  const {
    data: orderListQueryData,
    error: orderListItemError,
    isFetching: orderListItemLoading,
    refetch: refetchOrderList,
  } = useGetOrders({
    page_size: 1,
    page_limit: 100,
    brand_id: brandId!,
    sort_by: "ordernumber",
    table_id: item?.id,
    order_type: OrderType.DINE,
    order_status: "ordered,accepted,ready,served",
  })

  useEffect(() => {
    setOrderListItems(orderListQueryData?.data?.data ?? [])
  }, [orderListQueryData])

  const {
    data: orderDetailQueryData,
    error: orderDetailQueryError,
    isLoading: orderDetailLoading,
    isRefetching: orderDetailRefetching,
    refetch: refetchOrderDetail,
  } = useGetOrder({
    order_id: orderListQueryData?.data?.data?.at(selectedOrderIndex)?.order_id,
  } as GetOrderParams)

  // const orderListItem = item?.orders?.at(selectedOrderIndex);
  const orderListItem = orderListItems.at(selectedOrderIndex)

  const onOpenMergeOrder = () => {
    setMergeOrderOpened(true)
  }

  const onFinishMergeOrder = (selectedOrders: OrderListItem[]) => {
    updateOrder(
      {
        // order_id: orderListItem?.order_id!,
        order_id: selectedOrders.at(0)?.order_id!,
        merge_orders: selectedOrders
          .slice(1)
          .map((order) => ({ order_id: order.order_id })),
      },
      {
        onSuccess: (data) => {
          refetchOrderList()
          refetchOrderDetail()
          toast({
            title: "Orders merged Succcessfully",
          })
          setMergeOrderOpened(false)
        },
        onError: (error) => {
          console.log("Merge order error", error)
          toast({
            title: "Merge order failed",
            description: error.message,
          })
        },
      }
    )
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
          {/* {item?.orders?.length ?? 0 > 0 ? */}
          {orderListItems.length ?? 0 > 0 ? (
            <div className="m-4 flex h-[96vh] w-3/4 flex-col gap-4">
              <div className="flex w-full flex-row items-center gap-4">
                <h1 className="mr-6 text-2xl font-bold">Order Details</h1>
                <EditOrderDialog
                  order={orderDetailQueryData?.data.data}
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
                    orderDetail={orderDetailQueryData?.data.data}
                    variant="date-time"
                  />
                </div>
              </div>
              <div className="flex w-full flex-row gap-2">
                <div className="flex w-[70%] flex-row gap-2">
                  <OrderItemDetailPanel
                    order={orderDetailQueryData?.data.data}
                    isLoading={orderDetailLoading || orderDetailRefetching}
                    onDiscountUpdate={() => {
                      refetchOrderDetail()
                    }}
                  />
                </div>
                <div className="flex w-[30%]">
                  {!orderDetailQueryError && (
                    <OrderPayInfoPanel
                      order={orderDetailQueryData?.data.data}
                      isLoading={orderDetailLoading || orderDetailRefetching}
                      onCloseOrder={() => {
                        setSelectedOrderIndex(0)
                        refetchOrderList()
                      }}
                      onPayOrder={() => {
                        refetchOrderList()
                        refetchOrderDetail()
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="m-4 flex h-[96vh] w-3/4 flex-col gap-4">
              <div className="flex w-full flex-row items-center gap-4">
                <h1 className="mr-6 text-2xl font-bold">No Orders</h1>
              </div>
            </div>
          )}
        </div>
      </DialogFullScreenContent>
    </FullScreenDialog>
  )
}

export default TableDetailDialog
