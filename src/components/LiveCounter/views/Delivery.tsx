"use client"

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { GetOrdersParams } from "@/api/orders"
import { LiveCounterOrderSortingOption } from "@/constants/liveCounterSortingOptions"
import { OrderStatuses } from "@/constants/orderStatuses"
import { OrderType } from "@/constants/orderTypes"
import { GridIcon, WindowIcon } from "@/icons"
import { useAuth } from "@/providers/AuthProvider/AuthProvider"
import { CartProvider } from "@/providers/CartProvider"
import Masonry from "react-masonry-css"

import { OrderListItem } from "@/types/interfaces/order.interface"
import { updateFilters } from "@/lib/utils"
import { IconButton } from "@/components/iconButton"
import { LiveCounterOrderCard } from "@/components/liveCounterOrderCard"
import DeliveryDetailDialog from "@/components/OrderDetailModal/DeliveryDetailModal"
import { CustomSelect } from "@/components/select"
import Spinner from "@/components/spinner"
import { Tab } from "@/components/tab"
import { breakpointColumnsObj } from "@/styles/columnBreakpoints"

import { breakpointSmallViewColumnsObj } from "../../../styles/columnBreakpoints"
import { mockOrderDetail } from "./Tables"

// Mock data for delivery orders
export const mockDeliveryOrders: OrderListItem[] = [
  {
    order_number: "DEL-001",
    customer: {
      id: "cust-201",
      first_name: "Alex",
      last_name: "Thompson",
      middle_name: null,
    },
    table: null,
    items_count: 3,
    date: "2023-05-15",
    amount: 42.97,
    currency: "USD",
    order_status: OrderStatuses.ORDERED,
    payment_status: "pending",
    customer_delivery_address: "123 Main St, Apt 4B",
    customer_apartment: "4B",
    customer_note: "Leave at door",
    customer_phone_code: "+1",
    customer_phone_number: "555-123-7890",
    attachment: null,
    order_instruction: "Ring doorbell upon arrival",
    order_id: "delivery-1",
    order_edit_time: "2023-05-15 18:30:00",
    time: "6:30 PM",
    item_details: [
      {
        id: "item-d1",
        name: "Pepperoni Pizza",
        item_instruction: "Extra cheese",
        item_status: OrderStatuses.ORDERED,
        item_quantity: 1,
        price: 18.99,
        main_item_image: null,
      },
      {
        id: "item-d2",
        name: "Chicken Wings",
        item_instruction: "Spicy",
        item_status: OrderStatuses.ORDERED,
        item_quantity: 1,
        price: 12.99,
        main_item_image: null,
      },
      {
        id: "item-d3",
        name: "Soda",
        item_instruction: null,
        item_status: OrderStatuses.ORDERED,
        item_quantity: 2,
        price: 2.99,
        main_item_image: null,
      },
    ],
    brand_details: {
      id: "brand-1",
      name: "Restaurant Brand",
      location: "New York",
      currency: "USD",
    },
    delivery_fee: 5.99,
    cancelled_reason: null,
    delivery_status: "pending",
    customer_rating: 0,
    delivery_time: "30-45 min",
    delivery_partner_name: "SpeedDelivery",
    driver_id: "driver-1",
    driver_name: "John Driver",
    driver_image: null,
    driver_phone_code: "+1",
    driver_phone_number: "555-888-9999",
    bring_all_items_at_same_time: 1,
    order_type: OrderType.DELIVERY,
  },
  {
    order_number: "DEL-002",
    customer: {
      id: "cust-202",
      first_name: "Emma",
      last_name: "Garcia",
      middle_name: null,
    },
    table: null,
    items_count: 2,
    date: "2023-05-15",
    amount: 32.98,
    currency: "USD",
    order_status: OrderStatuses.ACCEPTED,
    payment_status: "paid",
    customer_delivery_address: "456 Oak Ave",
    customer_apartment: "",
    customer_note: "House with blue door",
    customer_phone_code: "+1",
    customer_phone_number: "555-456-7890",
    attachment: null,
    order_instruction: "",
    order_id: "delivery-2",
    order_edit_time: "2023-05-15 17:45:00",
    time: "5:45 PM",
    item_details: [
      {
        id: "item-d4",
        name: "Sushi Combo",
        item_instruction: null,
        item_status: OrderStatuses.ACCEPTED,
        item_quantity: 1,
        price: 24.99,
        main_item_image: null,
      },
      {
        id: "item-d5",
        name: "Miso Soup",
        item_instruction: null,
        item_status: OrderStatuses.ACCEPTED,
        item_quantity: 2,
        price: 3.99,
        main_item_image: null,
      },
    ],
    brand_details: {
      id: "brand-1",
      name: "Restaurant Brand",
      location: "New York",
      currency: "USD",
    },
    delivery_fee: 4.99,
    cancelled_reason: null,
    delivery_status: "assigned",
    customer_rating: 0,
    delivery_time: "20-35 min",
    delivery_partner_name: "SpeedDelivery",
    driver_id: "driver-2",
    driver_name: "Maria Driver",
    driver_image: null,
    driver_phone_code: "+1",
    driver_phone_number: "555-777-6666",
    bring_all_items_at_same_time: 1,
    order_type: OrderType.DELIVERY,
  },
  {
    order_number: "DEL-003",
    customer: {
      id: "cust-203",
      first_name: "Robert",
      last_name: "Chen",
      middle_name: null,
    },
    table: null,
    items_count: 4,
    date: "2023-05-15",
    amount: 56.96,
    currency: "USD",
    order_status: OrderStatuses.READY,
    payment_status: "paid",
    customer_delivery_address: "789 Pine St, Suite 300",
    customer_apartment: "Suite 300",
    customer_note: "Office building, front desk",
    customer_phone_code: "+1",
    customer_phone_number: "555-222-3333",
    attachment: null,
    order_instruction: "Call upon arrival",
    order_id: "delivery-3",
    order_edit_time: "2023-05-15 12:15:00",
    time: "12:15 PM",
    item_details: [
      {
        id: "item-d6",
        name: "Burger",
        item_instruction: "No onions",
        item_status: OrderStatuses.READY,
        item_quantity: 2,
        price: 14.99,
        main_item_image: null,
      },
      {
        id: "item-d7",
        name: "Fries",
        item_instruction: null,
        item_status: OrderStatuses.READY,
        item_quantity: 2,
        price: 5.99,
        main_item_image: null,
      },
      {
        id: "item-d8",
        name: "Milkshake",
        item_instruction: "Chocolate",
        item_status: OrderStatuses.READY,
        item_quantity: 2,
        price: 4.99,
        main_item_image: null,
      },
      {
        id: "item-d9",
        name: "Salad",
        item_instruction: "Dressing on the side",
        item_status: OrderStatuses.READY,
        item_quantity: 1,
        price: 9.99,
        main_item_image: null,
      },
    ],
    brand_details: {
      id: "brand-1",
      name: "Restaurant Brand",
      location: "New York",
      currency: "USD",
    },
    delivery_fee: 6.99,
    cancelled_reason: null,
    delivery_status: "on_the_way",
    customer_rating: 0,
    delivery_time: "10-15 min",
    delivery_partner_name: "SpeedDelivery",
    driver_id: "driver-3",
    driver_name: "Sam Driver",
    driver_image: null,
    driver_phone_code: "+1",
    driver_phone_number: "555-444-5555",
    bring_all_items_at_same_time: 1,
    order_type: OrderType.DELIVERY,
  },
  {
    order_number: "DEL-004",
    customer: {
      id: "cust-204",
      first_name: "Sophia",
      last_name: "Kim",
      middle_name: null,
    },
    table: null,
    items_count: 1,
    date: "2023-05-15",
    amount: 18.99,
    currency: "USD",
    order_status: OrderStatuses.DELIVERED,
    payment_status: "paid",
    customer_delivery_address: "101 Maple Dr",
    customer_apartment: "",
    customer_note: "",
    customer_phone_code: "+1",
    customer_phone_number: "555-999-0000",
    attachment: null,
    order_instruction: "",
    order_id: "delivery-4",
    order_edit_time: "2023-05-15 11:00:00",
    time: "11:00 AM",
    item_details: [
      {
        id: "item-d10",
        name: "Pad Thai",
        item_instruction: "Medium spicy",
        item_status: OrderStatuses.DELIVERED,
        item_quantity: 1,
        price: 18.99,
        main_item_image: null,
      },
    ],
    brand_details: {
      id: "brand-1",
      name: "Restaurant Brand",
      location: "New York",
      currency: "USD",
    },
    delivery_fee: 3.99,
    cancelled_reason: null,
    delivery_status: "delivered",
    customer_rating: 5,
    delivery_time: "Delivered at 11:45 AM",
    delivery_partner_name: "SpeedDelivery",
    driver_id: "driver-4",
    driver_name: "Alex Driver",
    driver_image: null,
    driver_phone_code: "+1",
    driver_phone_number: "555-111-2222",
    bring_all_items_at_same_time: 1,
    order_type: OrderType.DELIVERY,
  },
]

interface DeliveryComponentProps {
  searchKeyword: string
  setMainTabBadgeCounts: Dispatch<
    SetStateAction<{
      Tables: number
      Delivery: number
      Pickup: number
      Aggregators: number
    }>
  >
  selectedOrderId: string | null
  onOrderSelected: () => void
  initialFilters?: Partial<GetOrdersParams>
}

export default function DeliveryComponent({
  searchKeyword,
  setMainTabBadgeCounts,
  selectedOrderId,
  onOrderSelected,
  initialFilters,
}: DeliveryComponentProps) {
  const { brandId } = useAuth()
  const bottomRef = useRef<HTMLDivElement>(null)
  const [selectedItem, setSelectedItem] = useState<OrderListItem | undefined>(
    undefined
  )

  useEffect(() => {
    setFilters((prevFilters) =>
      updateFilters(prevFilters, "search", searchKeyword)
    )
  }, [searchKeyword])

  const [filters, setFilters] = useState<GetOrdersParams>({
    page_size: 1,
    page_limit: 30,
    brand_id: brandId!,
    order_type: OrderType.DELIVERY,
    sort_by: "ordernumber",
    search: searchKeyword,
    order_status: "ordered,accepted,ready",
    ...initialFilters,
  })

  // Mock loading state
  const [isLoading, setIsLoading] = useState(false)
  // Mock filtered orders
  const [filteredOrders, setFilteredOrders] = useState<OrderListItem[]>([])

  // Mock refetch function
  const refetch = () => {
    setIsLoading(true)
    setTimeout(() => {
      filterAndSortOrders()
      setIsLoading(false)
    }, 500)
  }

  // Function to filter and sort orders based on current filters
  const filterAndSortOrders = () => {
    let result = [...mockDeliveryOrders]

    // Filter by order status
    if (filters.order_status) {
      const statuses = filters.order_status.split(",")
      result = result.filter((order) => statuses.includes(order.order_status))
    }

    // Filter by search keyword
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (order) =>
          order.order_number.toLowerCase().includes(searchLower) ||
          `${order.customer?.first_name} ${order.customer?.last_name}`
            .toLowerCase()
            .includes(searchLower) ||
          order.customer_delivery_address.toLowerCase().includes(searchLower)
      )
    }

    // Sort orders
    if (filters.sort_by === "ordernumber") {
      result.sort((a, b) => {
        return filters.sort_order === "asc"
          ? a.order_number.localeCompare(b.order_number)
          : b.order_number.localeCompare(a.order_number)
      })
    } else if (filters.sort_by === "date") {
      result.sort((a, b) => {
        const dateA = new Date(a.time).getTime()
        const dateB = new Date(b.time).getTime()
        return filters.sort_order === "asc" ? dateA - dateB : dateB - dateA
      })
    }

    setFilteredOrders(result)

    // Update badge count
    const openOrdersCount = mockDeliveryOrders.filter((order) =>
      ["ordered", "accepted", "ready"].includes(order.order_status)
    ).length

    setMainTabBadgeCounts((prevState) =>
      updateFilters(prevState, "Delivery", openOrdersCount)
    )
  }

  // Initial load and when filters change
  useEffect(() => {
    refetch()
  }, [filters])

  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const [isSmallIconView, setIsSmallIconView] = useState(false)

  const subTabs = ["Open Orders", "Completed"]

  const options = [
    {
      value: LiveCounterOrderSortingOption.ASCENDING_STATUS,
      label: "Order No. Ascending",
    },
    {
      value: LiveCounterOrderSortingOption.DESCENDING_STATUS,
      label: "Order No. Descending",
    },
    {
      value: LiveCounterOrderSortingOption.ASCENDING_TIME_STATUS,
      label: "Order Time. Ascending",
    },
    {
      value: LiveCounterOrderSortingOption.DESCENDING_TIME_STATUS,
      label: "Order Time. Descending",
    },
  ]

  const handleSortChange = (option: {
    value: LiveCounterOrderSortingOption
    label: string
  }) => {
    if (option.value === LiveCounterOrderSortingOption.ASCENDING_STATUS) {
      setFilters((prevFilters) =>
        updateFilters(prevFilters, "sort_by", "ordernumber")
      )
      setFilters((prevFilters) =>
        updateFilters(prevFilters, "sort_order", "asc")
      )
    } else if (
      option.value === LiveCounterOrderSortingOption.DESCENDING_STATUS
    ) {
      setFilters((prevFilters) =>
        updateFilters(prevFilters, "sort_by", "ordernumber")
      )
      setFilters((prevFilters) =>
        updateFilters(prevFilters, "sort_order", "desc")
      )
    } else if (
      option.value === LiveCounterOrderSortingOption.ASCENDING_TIME_STATUS
    ) {
      setFilters((prevFilters) => updateFilters(prevFilters, "sort_by", "date"))
      setFilters((prevFilters) =>
        updateFilters(prevFilters, "sort_order", "asc")
      )
    } else if (
      option.value === LiveCounterOrderSortingOption.DESCENDING_TIME_STATUS
    ) {
      setFilters((prevFilters) => updateFilters(prevFilters, "sort_by", "date"))
      setFilters((prevFilters) =>
        updateFilters(prevFilters, "sort_order", "desc")
      )
    }
  }

  const handleTabChange = ({ tabIndex }: { tabIndex: number }) => {
    setSelectedTabIndex(tabIndex)
    if (tabIndex === 0) {
      setFilters((prevFilters) =>
        updateFilters(prevFilters, "order_status", "ordered,accepted,ready")
      )
    } else {
      setFilters((prevFilters) =>
        updateFilters(prevFilters, "order_status", "closed,delivered")
      )
    }
  }

  useEffect(() => {
    if (selectedOrderId && filteredOrders.length > 0) {
      const matchingOrder = filteredOrders.find(
        (order) => order.order_id === selectedOrderId
      )

      if (matchingOrder) {
        setSelectedItem(matchingOrder)
        onOrderSelected()
      }
    }
  }, [selectedOrderId, filteredOrders])

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute left-0 top-0 flex h-[calc(100vh-200px)] w-full items-center justify-center">
          <Spinner />
        </div>
      )}
      {!isLoading && (
        <>
          <div className="flex items-center justify-between">
            <div className="w-fit rounded-6 bg-white-60">
              {subTabs.map((tabItem, index) => {
                return (
                  <Tab
                    variant="secondary"
                    key={`table-position-${index}`}
                    isActive={selectedTabIndex === index}
                    onClick={() => {
                      handleTabChange({ tabIndex: index })
                    }}
                  >
                    {tabItem}
                  </Tab>
                )
              })}
            </div>
            <div className="flex items-center gap-4">
              <CustomSelect<LiveCounterOrderSortingOption>
                options={options}
                onOptionSelect={handleSortChange}
                sortByText="Sort by:"
                selectWidth="w-[210px]"
              />
              <IconButton
                icon={isSmallIconView ? GridIcon : WindowIcon}
                iconSize="24"
                size="large"
                variant={"transparent"}
                onClick={() => {
                  setIsSmallIconView(!isSmallIconView)
                }}
              />
            </div>
          </div>
          <div className="masonry-scroll-container mt-2  h-[calc(100vh-200px)] flex-grow overflow-y-auto">
            <Masonry
              breakpointCols={
                isSmallIconView
                  ? breakpointSmallViewColumnsObj
                  : breakpointColumnsObj
              }
              className="-ml-4 flex w-auto"
              columnClassName="pl-4 bg-clip-padding py-4"
            >
              {filteredOrders.map((order, index) => (
                <div key={index} className="mb-4">
                  <LiveCounterOrderCard
                    key={index}
                    order_number={order.order_number}
                    order_status={order.order_status}
                    customer_name={`${order.customer?.first_name ?? ""} ${order.customer?.last_name ?? ""}`}
                    payment_status={order.payment_status ?? ""}
                    time={order.date}
                    isSmallIconView={isSmallIconView}
                    onClick={() => {
                      setSelectedItem(order)
                    }}
                  />
                </div>
              ))}
            </Masonry>
            <div ref={bottomRef} className="h-fit">
              {/* No need for infinite loading with mock data */}
            </div>
          </div>
          <CartProvider>
            <DeliveryDetailDialog
              item={selectedItem}
              onClose={() => {
                setSelectedItem(undefined)
              }}
              onUpdate={() => refetch()}
            />
          </CartProvider>
        </>
      )}
    </div>
  )
}
