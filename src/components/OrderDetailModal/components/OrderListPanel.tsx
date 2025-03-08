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
  fontHeadline,
  fontTitle1,
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
    <div className="flex w-full flex-col bg-gray-50 lg:h-full lg:rounded-3">
      <div className="flex w-full flex-grow-0 flex-col p-6 pb-0">
        <div className="mb-6 flex flex-row gap-2">
          <h1 className={cn("text-2xl font-bold text-gray-400", fontTitle1)}>
            Table
          </h1>
          <h1 className={cn("text-2xl font-bold", fontTitle1)}>{item?.name}</h1>
        </div>
        <CartProvider>
          <CreateOrderDialog />
        </CartProvider>
      </div>
      {isLoading ? (
        <div className="flex h-full w-full items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          {/* Mobile view - horizontal scrolling */}
          <div className="flex h-full w-full overflow-x-auto p-6 lg:hidden">
            <div className="flex flex-row gap-4">
              <button
                className="flex min-w-[145px] max-w-[145px] flex-col items-center justify-center rounded-3 border border-gray-200 bg-black-5 p-4 text-black-100 shadow-sm"
                onClick={() => {
                  // Trigger the create order dialog
                  const createOrderButton = document.querySelector(
                    '[aria-label="Create Order"]'
                  )
                  if (createOrderButton instanceof HTMLElement) {
                    createOrderButton.click()
                  }
                }}
              >
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white-100">
                  <IconButton
                    icon={AddIcon}
                    iconSize="24"
                    size="large"
                    variant={"secondary"}
                    className="bg-white-100"
                  />
                </div>
                <span className={cn("text-center", fontHeadline)}>
                  Create New Order
                </span>
              </button>
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
          </div>

          {/* Desktop view - vertical list */}
          <div className="hidden lg:flex lg:h-full lg:w-full lg:flex-col lg:gap-2 lg:overflow-auto lg:p-6">
            {orderListItems?.map((order, index) => (
              <TableDetailOrderItemCard
                key={order.order_id}
                order={order}
                isSelected={index === selectedOrderIndex}
                onClick={() => {
                  setSelectedOrderIndex(index)
                }}
                isDesktop={true}
              />
            ))}
          </div>
        </>
      )}
      <div className="fixed bottom-0 left-0 z-50 flex w-full flex-col gap-2 rounded-t-3 bg-white p-6 shadow-lg lg:relative lg:bottom-0 lg:mt-auto lg:rounded-3">
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
