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
import PickupDetailDialog from "@/components/OrderDetailModal/PickupDetailModal"
import { CustomSelect } from "@/components/select"
import Spinner from "@/components/spinner"
import { Tab } from "@/components/tab"
import { breakpointColumnsObj } from "@/styles/columnBreakpoints"

import { breakpointSmallViewColumnsObj } from "../../../styles/columnBreakpoints"
import { mockOrderDetail } from "./Tables"

// Mock data for pickup orders
export const mockPickupOrders: OrderListItem[] = [
  {
    order_number: "PKP-001",
    customer: {
      id: "cust-101",
      first_name: "Michael",
      last_name: "Brown",
      middle_name: null,
    },
    table: null,
    items_count: 2,
    date: "2023-05-15",
    amount: 28.99,
    currency: "USD",
    order_status: OrderStatuses.ORDERED,
    payment_status: "pending",
    customer_delivery_address: "",
    customer_apartment: "",
    customer_note: "Call when ready",
    customer_phone_code: "+1",
    customer_phone_number: "555-111-2222",
    attachment: null,
    order_instruction: "Extra sauce packets please",
    order_id: "pickup-1",
    order_edit_time: "2023-05-15 10:30:00",
    time: "10:30 AM",
    item_details: [
      {
        id: "item-p1",
        name: "Chicken Sandwich",
        item_instruction: null,
        item_status: OrderStatuses.ORDERED,
        item_quantity: 1,
        price: 15.99,
        main_item_image: null,
      },
      {
        id: "item-p2",
        name: "French Fries",
        item_instruction: "Extra crispy",
        item_status: OrderStatuses.ORDERED,
        item_quantity: 1,
        price: 5.99,
        main_item_image: null,
      },
    ],
    brand_details: {
      id: "brand-1",
      name: "Restaurant Brand",
      location: "New York",
      currency: "USD",
    },
    delivery_fee: null,
    cancelled_reason: null,
    delivery_status: "",
    customer_rating: 0,
    delivery_time: null,
    delivery_partner_name: null,
    driver_id: null,
    driver_name: null,
    driver_image: null,
    driver_phone_code: null,
    driver_phone_number: null,
    bring_all_items_at_same_time: 1,
    order_type: OrderType.PICKUP,
  },
  {
    order_number: "PKP-002",
    customer: {
      id: "cust-102",
      first_name: "Sarah",
      last_name: "Johnson",
      middle_name: null,
    },
    table: null,
    items_count: 3,
    date: "2023-05-15",
    amount: 42.97,
    currency: "USD",
    order_status: OrderStatuses.ACCEPTED,
    payment_status: "paid",
    customer_delivery_address: "",
    customer_apartment: "",
    customer_note: "",
    customer_phone_code: "+1",
    customer_phone_number: "555-333-4444",
    attachment: null,
    order_instruction: "",
    order_id: "pickup-2",
    order_edit_time: "2023-05-15 11:15:00",
    time: "11:15 AM",
    item_details: [
      {
        id: "item-p3",
        name: "Vegetarian Pizza",
        item_instruction: null,
        item_status: OrderStatuses.ACCEPTED,
        item_quantity: 1,
        price: 18.99,
        main_item_image: null,
      },
      {
        id: "item-p4",
        name: "Garlic Bread",
        item_instruction: null,
        item_status: OrderStatuses.ACCEPTED,
        item_quantity: 1,
        price: 6.99,
        main_item_image: null,
      },
      {
        id: "item-p5",
        name: "Soda",
        item_instruction: null,
        item_status: OrderStatuses.ACCEPTED,
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
    delivery_fee: null,
    cancelled_reason: null,
    delivery_status: "",
    customer_rating: 0,
    delivery_time: null,
    delivery_partner_name: null,
    driver_id: null,
    driver_name: null,
    driver_image: null,
    driver_phone_code: null,
    driver_phone_number: null,
    bring_all_items_at_same_time: 1,
    order_type: OrderType.PICKUP,
  },
  {
    order_number: "PKP-003",
    customer: {
      id: "cust-103",
      first_name: "David",
      last_name: "Wilson",
      middle_name: null,
    },
    table: null,
    items_count: 1,
    date: "2023-05-15",
    amount: 24.99,
    currency: "USD",
    order_status: OrderStatuses.READY,
    payment_status: "pending",
    customer_delivery_address: "",
    customer_apartment: "",
    customer_note: "Will pick up at 6:30 PM",
    customer_phone_code: "+1",
    customer_phone_number: "555-555-6666",
    attachment: null,
    order_instruction: "",
    order_id: "pickup-3",
    order_edit_time: "2023-05-15 12:00:00",
    time: "12:00 PM",
    item_details: [
      {
        id: "item-p6",
        name: "Family Meal Box",
        item_instruction: "No spicy sauce",
        item_status: OrderStatuses.READY,
        item_quantity: 1,
        price: 24.99,
        main_item_image: null,
      },
    ],
    brand_details: {
      id: "brand-1",
      name: "Restaurant Brand",
      location: "New York",
      currency: "USD",
    },
    delivery_fee: null,
    cancelled_reason: null,
    delivery_status: "",
    customer_rating: 0,
    delivery_time: null,
    delivery_partner_name: null,
    driver_id: null,
    driver_name: null,
    driver_image: null,
    driver_phone_code: null,
    driver_phone_number: null,
    bring_all_items_at_same_time: 1,
    order_type: OrderType.PICKUP,
  },
  {
    order_number: "PKP-004",
    customer: {
      id: "cust-104",
      first_name: "Jennifer",
      last_name: "Martinez",
      middle_name: null,
    },
    table: null,
    items_count: 2,
    date: "2023-05-15",
    amount: 35.98,
    currency: "USD",
    order_status: OrderStatuses.CLOSED,
    payment_status: "paid",
    customer_delivery_address: "",
    customer_apartment: "",
    customer_note: "",
    customer_phone_code: "+1",
    customer_phone_number: "555-777-8888",
    attachment: null,
    order_instruction: "",
    order_id: "pickup-4",
    order_edit_time: "2023-05-15 09:45:00",
    time: "09:45 AM",
    item_details: [
      {
        id: "item-p7",
        name: "Breakfast Platter",
        item_instruction: null,
        item_status: OrderStatuses.CLOSED,
        item_quantity: 1,
        price: 15.99,
        main_item_image: null,
      },
      {
        id: "item-p8",
        name: "Coffee",
        item_instruction: "Extra cream",
        item_status: OrderStatuses.CLOSED,
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
    delivery_fee: null,
    cancelled_reason: null,
    delivery_status: "",
    customer_rating: 5,
    delivery_time: null,
    delivery_partner_name: null,
    driver_id: null,
    driver_name: null,
    driver_image: null,
    driver_phone_code: null,
    driver_phone_number: null,
    bring_all_items_at_same_time: 1,
    order_type: OrderType.PICKUP,
  },
]

interface PickupComponentProps {
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

export default function PickupComponent({
  searchKeyword,
  setMainTabBadgeCounts,
  selectedOrderId,
  onOrderSelected,
  initialFilters,
}: PickupComponentProps) {
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
    order_type: OrderType.PICKUP,
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
    let result = [...mockPickupOrders]

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
            .includes(searchLower)
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
    const openOrdersCount = mockPickupOrders.filter((order) =>
      ["ordered", "accepted", "ready"].includes(order.order_status)
    ).length

    setMainTabBadgeCounts((prevState) =>
      updateFilters(prevState, "Pickup", openOrdersCount)
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
                    time={order.time}
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
            <PickupDetailDialog
              item={selectedItem}
              onClose={() => {
                setSelectedItem(undefined)
              }}
              onUpdate={() => {
                refetch()
              }}
            />
          </CartProvider>
        </>
      )}
    </div>
  )
}
