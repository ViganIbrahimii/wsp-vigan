"use client"

import { useEffect, useState } from "react"
import { CloseIcon, ScheduleIcon } from "@/icons"

import { OrderDetail, OrderListItem } from "@/types/interfaces/order.interface"
import { cn } from "@/lib/utils"
import { fontBodyNormal, fontTitle1 } from "@/styles/typography"

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

interface PickupDetailModalProps {
  item?: OrderListItem
  isAggregator?: boolean
  onClose: () => void
  onUpdate?: () => void
}

// Mock function to generate order detail based on the selected order
const getMockOrderDetail = (item?: OrderListItem) => {
  if (!item) return undefined

  // Current date and time for order creation
  const orderDate = new Date()

  // Format date for display - using the format "4 Mar, 2024 — 14:32"
  const day = orderDate.getDate() // No padding for day
  const month = orderDate.toLocaleString("en-US", { month: "short" })
  const year = orderDate.getFullYear()
  const hours = String(orderDate.getHours()).padStart(2, "0")
  const minutes = String(orderDate.getMinutes()).padStart(2, "0")
  const formattedDate = `${day} ${month}, ${year} — ${hours}:${minutes}`

  const orderDateStr = orderDate.toISOString()

  // Generate mock KOT data
  const mockKots = [
    {
      unique_id: `kot-${Math.random().toString(36).substr(2, 9)}`,
      name: "Kitchen",
      // Additional properties for internal use
      kot_status: "COMPLETED",
      kot_time: orderDateStr,
      items: [
        {
          item_id: "item-1",
          item_name: "Double Cheeseburger",
          quantity: 2,
        },
        {
          item_id: "item-2",
          item_name: "Large Fries",
          quantity: 1,
        },
      ],
    },
    {
      unique_id: `kot-${Math.random().toString(36).substr(2, 9)}`,
      name: "Beverage Station",
      // Additional properties for internal use
      kot_status: "COMPLETED",
      kot_time: new Date(orderDate.getTime() - 5 * 60000).toISOString(), // 5 minutes after order
      items: [
        {
          item_id: "item-3",
          item_name: "Large Soda",
          quantity: 2,
        },
        {
          item_id: "item-4",
          item_name: "Milkshake",
          quantity: 1,
        },
      ],
    },
  ]

  // If there are no item details, create some based on the KOT items
  const itemDetails = item.item_details?.length
    ? item.item_details?.map((detail) => ({
        id: `item-${Math.random().toString(36).substr(2, 9)}`,
        item_id: detail.id,
        item_name: detail.name,
        quantity: detail.item_quantity,
        price: detail.price || 0,
        discount: 0,
        discount_type: "PERCENTAGE",
        item_status: detail.item_status,
        modifier_list: [],
      }))
    : [
        {
          id: "item-1",
          item_id: "item-1",
          item_name: "Double Cheeseburger",
          quantity: 2,
          price: 12.99,
          discount: 0,
          discount_type: "PERCENTAGE",
          item_status: "COMPLETED",
          modifier_list: [
            {
              modifier_id: "mod-1",
              modifier_name: "Extras",
              modifier_option_id: "opt-1",
              modifier_option_name: "Extra Cheese",
              modifier_option_price: "1.50",
            },
          ],
        },
        {
          id: "item-2",
          item_id: "item-2",
          item_name: "Large Fries",
          quantity: 1,
          price: 5.99,
          discount: 10,
          discount_type: "PERCENTAGE",
          item_status: "COMPLETED",
          modifier_list: [],
        },
        {
          id: "item-3",
          item_id: "item-3",
          item_name: "Large Soda",
          quantity: 2,
          price: 3.49,
          discount: 0,
          discount_type: "PERCENTAGE",
          item_status: "COMPLETED",
          modifier_list: [
            {
              modifier_id: "mod-2",
              modifier_name: "Flavor",
              modifier_option_id: "opt-2",
              modifier_option_name: "Cola",
              modifier_option_price: "0",
            },
          ],
        },
        {
          id: "item-4",
          item_id: "item-4",
          item_name: "Milkshake",
          quantity: 1,
          price: 6.99,
          discount: 0,
          discount_type: "PERCENTAGE",
          item_status: "COMPLETED",
          modifier_list: [
            {
              modifier_id: "mod-3",
              modifier_name: "Flavor",
              modifier_option_id: "opt-3",
              modifier_option_name: "Chocolate",
              modifier_option_price: "0",
            },
          ],
        },
      ]

  // Calculate subtotal based on items
  const subtotal = itemDetails.reduce((total, item) => {
    const itemTotal = item.price * item.quantity
    const discountAmount =
      item.discount_type === "PERCENTAGE"
        ? (itemTotal * item.discount) / 100
        : item.discount
    return total + (itemTotal - discountAmount)
  }, 0)

  // Calculate tax (8.5%)
  const taxRate = 0.085
  const taxAmount = subtotal * taxRate

  // Calculate grand total
  const grandTotal = subtotal + taxAmount

  // Extract city, state from address if possible
  let city = "New York"
  let state = "NY"
  let zipcode = "10001"

  // Return the mock order detail
  return {
    order_id:
      item.order_id || `order-${Math.random().toString(36).substr(2, 9)}`,
    order_number: item.order_number || `#${Math.floor(Math.random() * 10000)}`,
    order_type: item.order_type || "pickup",
    order_status: item.order_status || "ready",
    payment_status: item.payment_status || "pending",
    payment_method: item.payment_status === "paid" ? "Credit Card" : "Cash",
    customer: item.customer || {
      first_name: "John",
      last_name: "Doe",
      phone_number: "+1234567890",
    },
    customer_info: {
      first_name: item.customer?.first_name || "John",
      middle_name: item.customer?.middle_name || "",
      last_name: item.customer?.last_name || "Doe",
      phone_code: item.customer_phone_code || "+1",
      phone: item.customer_phone_number || "234567890",
      email: `${item.customer?.first_name?.toLowerCase() || "john"}.${item.customer?.last_name?.toLowerCase() || "doe"}@example.com`,
      address_1: item.customer_delivery_address || "123 Main St",
      address_2: item.customer_apartment || "Apt 4B",
      landmark: "",
      city: city,
      state: state,
      country: "USA",
      pincode: zipcode,
      longitude: "-74.0060",
      latitude: "40.7128",
    },
    items_details: itemDetails,
    sub_total: parseFloat(subtotal.toFixed(2)),
    brand_vat: parseFloat(taxAmount.toFixed(2)),
    order_discount: 0,
    order_discount_type: "PERCENTAGE",
    grand_total: parseFloat(grandTotal.toFixed(2)),
    order_date: formattedDate,
    pickup_time: new Date(orderDate.getTime() + 30 * 60000).toISOString(),
    order_instruction: item.order_instruction || "Please include extra napkins",
    customer_pickup_note: item.customer_note || "Will arrive in a blue car",
    // Add required fields with default values
    table_id: null,
    coupon_id: null,
    price_type: 0,
    unit_price: 0,
    tips: 0,
    cancelled_reason: "",
    order_image: {
      cid: "",
      type: "",
      name: "",
    },
    customer_rating: item.customer_rating || 0,
    taxable_amount: parseFloat(taxAmount.toFixed(2)),
    order_amount: item.amount
      ? parseFloat(item.amount.toFixed(2))
      : parseFloat(grandTotal.toFixed(2)),
    created_at: orderDateStr,
    updated_at: orderDateStr,
    brand_info: {
      brand_id: item.brand_details?.id || "brand-1",
      brand_name: item.brand_details?.name || "Restaurant Brand",
      country_code: "US",
      address_line_1: "123 Restaurant St",
      address_line_2: "",
      city: "New York",
      post_code: "10001",
      state: "NY",
      latitude: "40.7128",
      longitude: "-74.0060",
      currency: item.currency || "USD",
    },
    bring_all_items_at_same_time: 0,
    kots: mockKots,
  }
}

const PickupDetailModal: React.FC<PickupDetailModalProps> = ({
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
          <DialogTitle>Pickup Order</DialogTitle>
        </DialogHeader>
        <DialogDescription className="hidden">
          Pickup Detail Modal
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
              <h1 className={cn("mr-6 text-2xl font-bold", fontTitle1)}>
                Pickup Order
              </h1>
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

            {/* Order Summary - Four Order Info Cards in a single row */}
            <div className="flex w-full flex-row gap-2">
              <div className="flex w-1/4">
                <OrderInfoCard order={item} variant="uesr-name" />
              </div>
              <div className="flex w-1/4">
                <OrderInfoCard order={item} variant="order-number" />
              </div>
              <div className="flex w-1/4">
                <OrderInfoCard order={item} variant="order-status" />
              </div>
              <div className="flex w-1/4">
                {/* Custom date-time display to ensure correct format */}
                <div className="flex max-h-[90px] w-full flex-col gap-2 rounded-3 bg-gray-400/20 p-4">
                  <div
                    className={cn(
                      "flex items-center text-gray-600",
                      fontBodyNormal
                    )}
                  >
                    <ScheduleIcon className="mr-1" />
                    <span className="truncate">Date & Time</span>
                  </div>
                  <div className="truncate">
                    {isLoading
                      ? "Loading..."
                      : orderDetail?.order_date || "4 Mar, 2024 — 14:32"}
                  </div>
                </div>
              </div>
            </div>

            {/* Items and Payment Details */}
            <div className="subwindow-scroll-container flex max-h-[calc(100vh-280px)] w-full flex-row gap-2 overflow-auto">
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

export default PickupDetailModal
