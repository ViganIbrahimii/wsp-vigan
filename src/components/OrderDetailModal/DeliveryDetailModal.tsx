"use client"

import { useEffect, useState } from "react"
import { CloseIcon } from "@/icons"

import { OrderDetail, OrderListItem } from "@/types/interfaces/order.interface"
import { cn } from "@/lib/utils"

import {
  DialogDescription,
  DialogFullScreenContent,
  DialogHeader,
  DialogTitle,
  FullScreenDialog,
} from "../dialog"
import { IconButton } from "../iconButton"
import CancelOrderDialog from "./components/cancelOrderDialog"
import { OrderInfoCard } from "./components/OrderInfoCard"
import { OrderItemDetailPanel } from "./components/OrderItemDetailPanel"
import { OrderPayInfoPanel } from "./components/OrderPayInfoPanel"
import EditOrderDialog from "./EditOrderModal"

interface DeliveryDetailDialogProps {
  item?: OrderListItem
  isAggregator?: boolean
  onClose: () => void
  onUpdate?: () => void
}

// Mock function to generate order detail based on the selected order
const getMockOrderDetail = (item?: OrderListItem) => {
  if (!item) return undefined

  return {
    order_id: item.order_id,
    order_number: item.order_number,
    order_type: item.order_type,
    order_status: item.order_status,
    payment_status: item.payment_status || "UNPAID",
    customer_info: {
      first_name: item.customer?.first_name || "",
      middle_name: item.customer?.middle_name || "",
      last_name: item.customer?.last_name || "",
      phone_code: item.customer_phone_code || "",
      phone: item.customer_phone_number || "",
      address_1: item.customer_delivery_address || "",
      address_2: item.customer_apartment || "",
      landmark: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
      longitude: "",
      latitude: "",
    },
    items_details:
      item.item_details?.map((detail) => ({
        id: `item-${Math.random().toString(36).substr(2, 9)}`,
        item_id: detail.id,
        item_name: detail.name,
        quantity: detail.item_quantity,
        price: detail.price,
        discount: 0,
        discount_type: "PERCENTAGE",
        item_status: detail.item_status,
        modifier_list: [],
      })) || [],
    sub_total: item.amount || 0,
    brand_vat: (item.amount || 0) * 0.1, // 10% tax as an example
    order_discount: 0,
    order_discount_type: "PERCENTAGE",
    grand_total: (item.amount || 0) * 1.1, // subtotal + tax
    order_date: new Date().toISOString(),
    delivery_time: item.delivery_time || "",
    order_instruction: item.order_instruction || "",
    customer_delivery_note: item.customer_note || "",
    // Add required fields with default values
    table_id: null,
    coupon_id: null,
    payment_method: "CARD",
    delivery_status: item.delivery_status || "",
    driver_id: item.driver_id || "",
    price_type: 0,
    unit_price: 0,
    delivery_distance: 0,
    delivery_fee: item.delivery_fee || 0,
    pickup_time: "",
    driver_rating: 0,
    cash_status: "",
    delivery_type: 0,
    tips: 0,
    cancelled_reason: "",
    cash_deposit: 0,
    order_image: {
      cid: "",
      type: "",
      name: "",
    },
    customer_rating: item.customer_rating || 0,
    taxable_amount: 0,
    order_amount: item.amount || 0,
    brand_info: {
      brand_id: "",
      brand_name: "",
      country_code: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      post_code: "",
      state: "",
      latitude: "",
      longitude: "",
      currency: item.currency || "USD",
    },
    bring_all_items_at_same_time: 0,
    kots: [],
  }
}

const DeliveryDetailDialog: React.FC<DeliveryDetailDialogProps> = ({
  item,
  onClose,
  onUpdate,
  isAggregator,
}) => {
  const [orderDetail, setOrderDetail] = useState<any>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  // Mock the API call with setTimeout to simulate loading
  useEffect(() => {
    if (item) {
      setIsLoading(true)
      // Simulate API call delay
      const timer = setTimeout(() => {
        setOrderDetail(getMockOrderDetail(item))
        setIsLoading(false)
      }, 500)

      return () => clearTimeout(timer)
    } else {
      setOrderDetail(undefined)
    }
  }, [item])

  // Mock refetch function
  const refetchOrderDetail = () => {
    setIsLoading(true)
    setTimeout(() => {
      setOrderDetail(getMockOrderDetail(item))
      setIsLoading(false)
    }, 500)
  }

  return (
    <FullScreenDialog
      isOpen={Boolean(item)}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogFullScreenContent className="h-screen">
        <DialogHeader className="hidden">
          <DialogTitle>Delivery Order</DialogTitle>
        </DialogHeader>
        <DialogDescription className="hidden">
          Delivery Detail Modal
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
          <div className="m-4 flex h-[96vh] w-full flex-col gap-4">
            {/* Header with title and action buttons */}
            <div className="flex w-full flex-row items-center gap-4">
              <h1 className="mr-6 text-2xl font-bold">Delivery Order</h1>
              {!isAggregator && (
                <EditOrderDialog
                  order={orderDetail}
                  orderListItem={item}
                  isLoading={isLoading}
                  onOrderItemUpdate={() => {
                    refetchOrderDetail()
                  }}
                  onOrderUpdate={() => {
                    onUpdate?.()
                  }}
                />
              )}
              <CancelOrderDialog
                orderListItem={item!}
                onCancelOrder={() => {
                  onUpdate?.()
                  onClose?.()
                }}
              />
            </div>

            {/* Order Summary - First Row (Large Screens: All 6 cards in one row, Small Screens: 3+3) */}
            <div className="flex w-full flex-col gap-2 lg:flex-row">
              {/* First row of cards (or first 3 on small screens) */}
              <div className="flex w-full flex-row gap-2 lg:w-1/2">
                <div className="flex w-1/3">
                  <OrderInfoCard order={item} variant="uesr-name" />
                </div>
                <div className="flex w-1/3">
                  <OrderInfoCard order={item} variant="order-number" />
                </div>
                <div className="flex w-1/3">
                  <OrderInfoCard order={item} variant="order-status" />
                </div>
              </div>

              {/* Second row of cards (or second 3 on small screens) */}
              <div className="flex w-full flex-row gap-2 lg:w-1/2">
                <div className="flex w-1/3">
                  <OrderInfoCard
                    orderDetail={orderDetail}
                    variant="date-time"
                  />
                </div>
                <div className="flex w-1/3">
                  <OrderInfoCard order={item} variant="phone-number" />
                </div>
                <div className="flex w-1/3">
                  <OrderInfoCard
                    orderDetail={orderDetail}
                    variant="email-address"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address and Instructions Row */}
            <div className="flex w-full flex-row gap-2">
              <div className="flex w-1/2">
                <OrderInfoCard order={item} variant="delivery-address" />
              </div>
              <div className="flex w-1/2">
                <OrderInfoCard
                  orderDetail={orderDetail}
                  variant="delivery-instruction"
                />
              </div>
            </div>

            {/* Items and Payment Details */}
            <div className="subwindow-scroll-container flex max-h-[calc(100vh-380px)] w-full flex-row gap-2 overflow-auto">
              <div className="flex w-2/3 flex-row gap-2 lg:w-3/4">
                <OrderItemDetailPanel
                  order={orderDetail}
                  isLoading={isLoading}
                  onDiscountUpdate={() => {
                    refetchOrderDetail()
                  }}
                />
              </div>
              <div className="flex w-1/3 lg:w-1/4">
                <OrderPayInfoPanel
                  order={orderDetail}
                  isLoading={isLoading}
                  onCloseOrder={() => {
                    onUpdate?.()
                    onClose?.()
                  }}
                  onPayOrder={() => {
                    refetchOrderDetail()
                    onUpdate?.()
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </DialogFullScreenContent>
    </FullScreenDialog>
  )
}

export default DeliveryDetailDialog
