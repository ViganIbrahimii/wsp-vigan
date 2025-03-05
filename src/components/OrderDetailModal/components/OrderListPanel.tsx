import {
  OrderStatuses,
  statusMapping,
  statusStyles,
} from "@/constants/orderStatuses"
import { AddIcon, PersonIcon, RotateLeftIcon, ScheduleIcon } from "@/icons"
import { CartProvider } from "@/providers/CartProvider"

import { Order, OrderListItem } from "@/types/interfaces/order.interface"
import { Table } from "@/types/interfaces/table.interface"
import { useUpdateOrder } from "@/lib/hooks/mutations/orders/useUpdateOrder"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import CreateOrderDialog from "@/components/AddNewOrder/CreateOrderModal"
import { IconButton } from "@/components/iconButton"
import { MainButton } from "@/components/mainButton"
import Spinner from "@/components/spinner"
import {
  fontBodyBold,
  fontBodyNormal,
  fontCaptionBold,
  fontCaptionNormal,
} from "@/styles/typography"

import AddDiscountDialog from "./addDiscountDialog"
import { TableDetailOrderItemCard } from "./TableDetailOrderItemCard"

interface OrderListPanelProps {
  item?: Table
  orderListItems?: OrderListItem[]
  selectedOrderIndex: number
  isLoading: boolean
  setSelectedOrderIndex: (index: number) => void
  onClickMergeOrder: () => void
}

export const OrderListPanel = ({
  item,
  orderListItems,
  isLoading,
  selectedOrderIndex,
  setSelectedOrderIndex,
  onClickMergeOrder,
}: OrderListPanelProps) => {
  const {
    mutate: updateOrder,
    isPending,
    error: updateOrderError,
  } = useUpdateOrder()

  const handlePayAll = () => {
    orderListItems?.forEach((order) => {
      updateOrder(
        {
          order_id: order?.order_id!,
          payment_status: "paid",
        },
        {
          onSuccess: (data) => {
            toast({
              title: `Order ${order?.order_number}: Paid succssfully.`,
            })
          },
          onError: (error) => {
            console.log(`Order ${order?.order_number}: Pay error.`, error)
            toast({
              title: `Order ${order?.order_number}: Pay error. ${error.message}`,
            })
          },
        }
      )
    })
  }

  return (
    <div className="flex h-full w-full flex-col rounded-3 bg-gray-50">
      <div className="flex w-full flex-grow-0 flex-col p-6">
        <div className="mb-6 flex flex-row gap-2">
          <h1 className="text-2xl font-bold text-gray-400">Table</h1>
          <h1 className="text-2xl font-bold">{item?.name}</h1>
        </div>
        <CartProvider>
          <CreateOrderDialog preSelectedTable={item} />
        </CartProvider>
      </div>
      {isLoading ? (
        <div className="flex h-full w-full items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="subwindow-scroll-container flex h-full w-full flex-col gap-2 overflow-auto p-6">
          {orderListItems?.map((order, index) => (
            <TableDetailOrderItemCard
              key={order.order_id}
              order={order}
              isSelected={index === selectedOrderIndex}
              onClick={() => {
                setSelectedOrderIndex(index)
              }}
            />
          ))}
        </div>
      )}
      <div className="mt-auto flex w-full flex-col gap-2 rounded-3 bg-white p-6 shadow-lg">
        <MainButton
          variant={"secondary"}
          className="w-full"
          disabled={
            !orderListItems ||
            orderListItems?.length === 0 ||
            isLoading ||
            isPending
          }
          onClick={onClickMergeOrder}
        >
          Merge Order
        </MainButton>
        <MainButton
          variant={"accept"}
          className="w-full"
          disabled={
            !orderListItems ||
            orderListItems?.length === 0 ||
            isPending ||
            isLoading
          }
          onClick={handlePayAll}
        >
          Pay All
        </MainButton>
      </div>
    </div>
  )
}
