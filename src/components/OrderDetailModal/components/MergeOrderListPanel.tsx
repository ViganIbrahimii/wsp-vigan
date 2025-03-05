import { useState } from "react"
import {
  OrderStatuses,
  statusMapping,
  statusStyles,
} from "@/constants/orderStatuses"
import { AddIcon, PersonIcon, RotateLeftIcon, ScheduleIcon } from "@/icons"

import { Order, OrderListItem } from "@/types/interfaces/order.interface"
import { cn } from "@/lib/utils"
import Checkbox from "@/components/checkbox"
import { IconButton } from "@/components/iconButton"
import { MainButton } from "@/components/mainButton"
import Spinner from "@/components/spinner"
import {
  fontBodyBold,
  fontBodyNormal,
  fontCaptionBold,
  fontCaptionNormal,
  fontHeadline,
} from "@/styles/typography"

import AddDiscountDialog from "./addDiscountDialog"
import { TableDetailOrderCheckItemCard } from "./TableDetailOrderCheckItemCard"
import { TableDetailOrderItemCard } from "./TableDetailOrderItemCard"
import { Table } from "@/types/interfaces/table.interface"

interface MergeOrderListPanelProps {
  item?: Table
  orderListItems?: OrderListItem []
  selectedOrderIndex: number
  setSelectedOrderIndex: (index: number) => void
  onClickMergeOrder: (selectedOrders: OrderListItem[]) => void
  onClickCancel: () => void
}

export const MergeOrderListPanel = ({
  item,
  orderListItems,
  selectedOrderIndex,
  setSelectedOrderIndex,
  onClickMergeOrder,
  onClickCancel,
}: MergeOrderListPanelProps) => {
  const [selectedOrders, setSelectedOrders] = useState<OrderListItem[]>([])

  const toggleSelectAll = () => {
    const unPaidOrders = orderListItems?.filter((item)=>(item?.payment_status?.toLowerCase()!=='paid' && item?.item_details?.length > 0)) ?? []
    if (selectedOrders.length === unPaidOrders?.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(unPaidOrders ?? [])
    }
  }

  const toggleSelectOrder = (order: OrderListItem) => {
    setSelectedOrders((prev) =>
      prev.includes(order)
        ? prev.filter(
            (orderItem) => orderItem.order_number !== order.order_number
          )
        : [...prev, order]
    )
  }

  return (
    <>
      <div
        className="fixed left-0 top-[-1px] z-0 h-screen w-screen bg-black/60"
        onClick={onClickCancel}
      />
      <div className="relative z-50 flex h-full w-full flex-col rounded-3 bg-gray-50">
        <div className="flex w-full flex-grow-0 flex-col p-6">
          <div className="mb-6 flex flex-row gap-2">
            <h1 className="text-2xl font-bold text-gray-400">Table</h1>
            <h1 className="text-2xl font-bold">{item?.name}</h1>
          </div>
          <MainButton variant={"secondary"} className="w-full" disabled={true}>
            Create New Order
          </MainButton>
        </div>
        <div className="flex w-full flex-row gap-2 p-6">
          <Checkbox
            checked={selectedOrders.length === orderListItems?.length}
            size="small"
            onClick={toggleSelectAll}
          />
          <span className={cn("", fontHeadline)}>Select All</span>
        </div>
        <div className="flex h-full w-full flex-col gap-2 overflow-auto p-6 subwindow-scroll-container">
          {orderListItems?.map((order, index) => (
            <TableDetailOrderCheckItemCard
              key={order.order_id}
              order={order}
              isSelected={index === selectedOrderIndex}
              onClick={() => {
                setSelectedOrderIndex(index)
              }}
              onCheckItem={() => {
                toggleSelectOrder(order)
              }}
              checked={selectedOrders.includes(order)}
            />
          ))}
        </div>
        <div className="mt-auto flex w-full flex-col gap-2 rounded-3 bg-white p-6 shadow-lg">
          <MainButton
            variant={"secondary"}
            className="w-full"
            disabled={!orderListItems || orderListItems?.length === 0}
            onClick={onClickCancel}
          >
            Cancel
          </MainButton>
          <MainButton
            variant={"primary"}
            className="w-full"
            disabled={
              !orderListItems ||
              orderListItems?.length === 0 ||
              selectedOrders.length < 2
            }
            onClick={() => onClickMergeOrder(selectedOrders)}
          >
            {selectedOrders.length < 2
              ? `Merge`
              : `Merge ${selectedOrders.length} Orders`}
          </MainButton>
        </div>
      </div>
    </>
  )
}
