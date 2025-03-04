"use client"

import React, { useEffect, useState } from "react"
import { OrderStatuses } from "@/constants/orderStatuses"
import { OrderType } from "@/constants/orderTypes"
import Masonry from "react-masonry-css"

import { cn } from "@/lib/utils"
import { OrderCard } from "@/components/orderCard"
import { OrderStatusStats } from "@/components/orderStatusStats"
import SearchInput from "@/components/searchInput"
import { CustomSelect } from "@/components/select"
import { Tab } from "@/components/tab"
import { fontBodyNormal, fontTitle1 } from "@/styles/typography"

// Enums for sorting options
enum KitchenDisplaySortingOption {
  NEWEST_FIRST = "newest_first",
  OLDEST_FIRST = "oldest_first",
  ASCENDING_STATUS = "ascending_status",
  DESCENDING_STATUS = "descending_status",
}

// Mock data for order types
const orderTypeOptions: { title: string; value: OrderType | "" }[] = [
  { title: "All Orders", value: OrderType.ALL },
  { title: "Table", value: OrderType.DINE },
  { title: "Pickup", value: OrderType.PICKUP },
  { title: "Delivery", value: OrderType.DELIVERY },
  { title: "Aggregators", value: OrderType.AGGREGATOR },
]

// Mock data for sorting options
const sortingOptions = [
  { label: "Newest First", value: KitchenDisplaySortingOption.NEWEST_FIRST },
  { label: "Oldest First", value: KitchenDisplaySortingOption.OLDEST_FIRST },
  {
    label: "Ascending Status",
    value: KitchenDisplaySortingOption.ASCENDING_STATUS,
  },
  {
    label: "Descending Status",
    value: KitchenDisplaySortingOption.DESCENDING_STATUS,
  },
]

// Mock data for orders
const mockOrders = [
  {
    orderId: "1",
    orderNumber: "1001",
    paymentStatus: "paid",
    table: "Table 1",
    time: "2024-03-04 14:30:45",
    status: OrderStatuses.ORDERED,
    items: [
      {
        id: "101",
        name: "Chicken Burger",
        item_instruction: "No onions please",
        item_status: OrderStatuses.ORDERED,
        item_quantity: 2,
        price: 12.99,
        main_item_image: null,
      },
      {
        id: "102",
        name: "French Fries",
        item_instruction: "Extra salt",
        item_status: OrderStatuses.ORDERED,
        item_quantity: 1,
        price: 4.99,
        main_item_image: null,
      },
    ],
    editTimeAgo: "1 min ago",
    orderInstructions: "Please deliver ASAP",
    orderType: OrderType.DINE,
  },
  {
    orderId: "2",
    orderNumber: "1002",
    paymentStatus: "paid",
    table: null,
    time: "2024-03-04 14:30:45",
    status: OrderStatuses.ACCEPTED,
    items: [
      {
        id: "201",
        name: "Margherita Pizza",
        item_instruction: "Extra cheese",
        item_status: OrderStatuses.ACCEPTED,
        item_quantity: 1,
        price: 14.99,
        main_item_image: null,
      },
    ],
    editTimeAgo: "1 min ago",
    orderInstructions: null,
    orderType: OrderType.PICKUP,
  },
  {
    orderId: "3",
    orderNumber: "1003",
    paymentStatus: "paid",
    table: null,
    time: "2024-03-04 14:30:45",
    status: OrderStatuses.READY,
    items: [
      {
        id: "301",
        name: "Vegetable Salad",
        item_instruction: "No dressing",
        item_status: OrderStatuses.READY,
        item_quantity: 1,
        price: 8.99,
        main_item_image: null,
      },
      {
        id: "302",
        name: "Garlic Bread",
        item_instruction: null,
        item_status: OrderStatuses.ACCEPTED,
        item_quantity: 2,
        price: 3.99,
        main_item_image: null,
      },
    ],
    editTimeAgo: "1 min ago",
    orderInstructions: null,
    orderType: OrderType.DELIVERY,
  },
  {
    orderId: "4",
    orderNumber: "1004",
    paymentStatus: "paid",
    table: "Table 5",
    time: "2024-03-04 14:30:45",
    status: OrderStatuses.SERVED,
    items: [
      {
        id: "401",
        name: "Beef Steak",
        item_instruction: "Medium rare",
        item_status: OrderStatuses.SERVED,
        item_quantity: 1,
        price: 24.99,
        main_item_image: null,
      },
      {
        id: "402",
        name: "Mashed Potatoes",
        item_instruction: null,
        item_status: OrderStatuses.SERVED,
        item_quantity: 1,
        price: 5.99,
        main_item_image: null,
      },
    ],
    editTimeAgo: "1 min ago",
    orderInstructions: null,
    orderType: OrderType.DINE,
  },
  {
    orderId: "5",
    orderNumber: "1005",
    paymentStatus: "paid",
    table: null,
    time: "2024-03-04 14:30:45",
    status: OrderStatuses.CLOSED,
    items: [
      {
        id: "501",
        name: "Chocolate Cake",
        item_instruction: "Birthday message on top",
        item_status: OrderStatuses.SERVED,
        item_quantity: 1,
        price: 7.99,
        main_item_image: null,
      },
    ],
    editTimeAgo: "1 min ago",
    orderInstructions: null,
    orderType: OrderType.PICKUP,
  },
  {
    orderId: "6",
    orderNumber: "1006",
    paymentStatus: "paid",
    table: null,
    time: "2024-03-04 14:30:45",
    status: OrderStatuses.ORDERED,
    items: [
      {
        id: "601",
        name: "Chicken Wings",
        item_instruction: "Extra spicy",
        item_status: OrderStatuses.ORDERED,
        item_quantity: 2,
        price: 10.99,
        main_item_image: null,
      },
    ],
    editTimeAgo: "1 min ago",
    orderInstructions: "Ring the bell",
    orderType: OrderType.DELIVERY,
  },
  {
    orderId: "7",
    orderNumber: "1007",
    paymentStatus: "paid",
    table: "Table 3",
    time: "2024-03-04 14:30:45",
    status: OrderStatuses.ACCEPTED,
    items: [
      {
        id: "701",
        name: "Fish and Chips",
        item_instruction: "Extra tartar sauce",
        item_status: OrderStatuses.ACCEPTED,
        item_quantity: 1,
        price: 15.99,
        main_item_image: null,
      },
    ],
    editTimeAgo: "1 min ago",
    orderInstructions: null,
    orderType: OrderType.DINE,
  },
  {
    orderId: "8",
    orderNumber: "1008",
    paymentStatus: "paid",
    table: null,
    time: "2024-03-04 14:30:45",
    status: OrderStatuses.READY,
    items: [
      {
        id: "801",
        name: "Sushi Platter",
        item_instruction: "No wasabi",
        item_status: OrderStatuses.READY,
        item_quantity: 1,
        price: 22.99,
        main_item_image: null,
      },
    ],
    editTimeAgo: "1 min ago",
    orderInstructions: null,
    orderType: OrderType.PICKUP,
  },
  {
    orderId: "9",
    orderNumber: "1009",
    paymentStatus: "paid",
    table: null,
    time: "2024-03-04 14:30:45",
    status: OrderStatuses.SERVED,
    items: [
      {
        id: "901",
        name: "Pasta Carbonara",
        item_instruction: "Extra cheese",
        item_status: OrderStatuses.SERVED,
        item_quantity: 1,
        price: 13.99,
        main_item_image: null,
      },
    ],
    editTimeAgo: "1 min ago",
    orderInstructions: "Leave at door",
    orderType: OrderType.DELIVERY,
  },
  {
    orderId: "10",
    orderNumber: "1010",
    paymentStatus: "paid",
    table: "Table 7",
    time: "2024-03-04 14:30:45",
    status: OrderStatuses.ORDERED,
    items: [
      {
        id: "1001",
        name: "Vegetable Curry",
        item_instruction: "Mild spice",
        item_status: OrderStatuses.ORDERED,
        item_quantity: 1,
        price: 12.99,
        main_item_image: null,
      },
      {
        id: "1002",
        name: "Naan Bread",
        item_instruction: null,
        item_status: OrderStatuses.ORDERED,
        item_quantity: 2,
        price: 2.99,
        main_item_image: null,
      },
    ],
    editTimeAgo: "1 min ago",
    orderInstructions: null,
    orderType: OrderType.DINE,
  },
  {
    orderId: "11",
    orderNumber: "1011",
    paymentStatus: "paid",
    table: null,
    time: "2024-03-04 14:30:45",
    status: OrderStatuses.CLOSED,
    items: [
      {
        id: "1101",
        name: "Ice Cream Sundae",
        item_instruction: "No nuts",
        item_status: OrderStatuses.SERVED,
        item_quantity: 2,
        price: 6.99,
        main_item_image: null,
      },
    ],
    editTimeAgo: "1 min ago",
    orderInstructions: null,
    orderType: OrderType.AGGREGATOR,
  },
  {
    orderId: "12",
    orderNumber: "1012",
    paymentStatus: "paid",
    table: null,
    time: "2024-03-04 14:30:45",
    status: OrderStatuses.ACCEPTED,
    items: [
      {
        id: "1201",
        name: "Chicken Tikka",
        item_instruction: "Extra spicy",
        item_status: OrderStatuses.ACCEPTED,
        item_quantity: 1,
        price: 14.99,
        main_item_image: null,
      },
    ],
    editTimeAgo: "1 min ago",
    orderInstructions: "Call before delivery",
    orderType: OrderType.DELIVERY,
  },
  {
    orderId: "13",
    orderNumber: "1013",
    paymentStatus: "paid",
    table: "Table 2",
    time: "2024-03-04 14:30:45",
    status: OrderStatuses.READY,
    items: [
      {
        id: "1301",
        name: "Mushroom Risotto",
        item_instruction: "No parmesan",
        item_status: OrderStatuses.READY,
        item_quantity: 1,
        price: 16.99,
        main_item_image: null,
      },
    ],
    editTimeAgo: "1 min ago",
    orderInstructions: null,
    orderType: OrderType.DINE,
  },
  {
    orderId: "14",
    orderNumber: "1014",
    paymentStatus: "paid",
    table: null,
    time: "2024-03-04 14:30:45",
    status: OrderStatuses.SERVED,
    items: [
      {
        id: "1401",
        name: "Beef Burger",
        item_instruction: "No pickles",
        item_status: OrderStatuses.SERVED,
        item_quantity: 1,
        price: 11.99,
        main_item_image: null,
      },
      {
        id: "1402",
        name: "Onion Rings",
        item_instruction: null,
        item_status: OrderStatuses.SERVED,
        item_quantity: 1,
        price: 4.99,
        main_item_image: null,
      },
    ],
    editTimeAgo: "1 min ago",
    orderInstructions: null,
    orderType: OrderType.PICKUP,
  },
  {
    orderId: "15",
    orderNumber: "1015",
    paymentStatus: "paid",
    table: null,
    time: "2024-03-04 14:30:45",
    status: OrderStatuses.CLOSED,
    items: [
      {
        id: "1501",
        name: "Pepperoni Pizza",
        item_instruction: "Well done",
        item_status: OrderStatuses.SERVED,
        item_quantity: 1,
        price: 15.99,
        main_item_image: null,
      },
    ],
    editTimeAgo: "1 min ago",
    orderInstructions: "Contactless delivery",
    orderType: OrderType.AGGREGATOR,
  },
]

// Mock data for order status counts
const mockOrderStatusCounts = {
  [OrderStatuses.ORDERED]: 3,
  [OrderStatuses.ACCEPTED]: 3,
  [OrderStatuses.READY]: 3,
  [OrderStatuses.SERVED]: 3,
}

const KitchenDisplay: React.FC = () => {
  // State for active tab (Open or Completed)
  const [activeTab, setActiveTab] = useState<"open" | "completed">("open")

  // State for search query
  const [searchQuery, setSearchQuery] = useState("")

  // State for selected order type filter
  const [selectedOrderType, setSelectedOrderType] = useState<OrderType | "">("")

  // State for selected order status filter
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<
    OrderStatuses | ""
  >("")

  // State for sorting option
  const [sortingOption, setSortingOption] =
    useState<KitchenDisplaySortingOption>(
      KitchenDisplaySortingOption.NEWEST_FIRST
    )

  // Breakpoint columns for masonry layout
  const breakpointColumnsObj = {
    default: 4,
    1280: 4,
    1194: 4,
    834: 3,
    640: 1,
  }

  // Filter orders based on active tab, search query, order type, and order status
  const filteredOrders = mockOrders.filter((order) => {
    // Filter by tab (Open or Completed)
    if (
      activeTab === "open" &&
      (order.status === OrderStatuses.CLOSED ||
        order.status === OrderStatuses.CANCELED)
    ) {
      return false
    }
    if (
      activeTab === "completed" &&
      order.status !== OrderStatuses.CLOSED &&
      order.status !== OrderStatuses.CANCELED
    ) {
      return false
    }

    // Filter by search query
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      const orderNumberMatch = order.orderNumber
        .toLowerCase()
        .includes(searchLower)
      const itemsMatch = order.items.some(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          (item.item_instruction &&
            item.item_instruction.toLowerCase().includes(searchLower))
      )

      if (!orderNumberMatch && !itemsMatch) {
        return false
      }
    }

    // Filter by order type
    if (selectedOrderType && order.orderType !== selectedOrderType) {
      return false
    }

    // Filter by order status
    if (selectedOrderStatus && order.status !== selectedOrderStatus) {
      return false
    }

    return true
  })

  // Sort orders based on selected sorting option
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortingOption) {
      case KitchenDisplaySortingOption.NEWEST_FIRST:
        return b.orderNumber.localeCompare(a.orderNumber)
      case KitchenDisplaySortingOption.OLDEST_FIRST:
        return a.orderNumber.localeCompare(b.orderNumber)
      case KitchenDisplaySortingOption.ASCENDING_STATUS:
        return a.status.localeCompare(b.status)
      case KitchenDisplaySortingOption.DESCENDING_STATUS:
        return b.status.localeCompare(a.status)
      default:
        return 0
    }
  })

  // Count open and completed orders
  const openOrdersCount = mockOrders.filter(
    (order) =>
      order.status !== OrderStatuses.CLOSED &&
      order.status !== OrderStatuses.CANCELED
  ).length

  const completedOrdersCount = mockOrders.filter(
    (order) =>
      order.status === OrderStatuses.CLOSED ||
      order.status === OrderStatuses.CANCELED
  ).length

  // Prepare order status stats for the OrderStatusStats component
  const orderStatusStats = [
    {
      number: mockOrderStatusCounts[OrderStatuses.ORDERED],
      text: OrderStatuses.ORDERED,
    },
    {
      number: mockOrderStatusCounts[OrderStatuses.ACCEPTED],
      text: OrderStatuses.ACCEPTED,
    },
    {
      number: mockOrderStatusCounts[OrderStatuses.READY],
      text: OrderStatuses.READY,
    },
    {
      number: mockOrderStatusCounts[OrderStatuses.SERVED],
      text: OrderStatuses.SERVED,
    },
  ]

  // Mock filters for OrderCard component
  const mockFilters = {}

  return (
    <div className="flex h-screen flex-col">
      {/* Header Section */}
      <div className="relative flex h-[88px] w-full items-center justify-between px-4 py-7">
        {/* Title */}
        <h1 className={cn("text-black-100", fontTitle1)}>Kitchen Display</h1>

        {/* Tabs - Positioned absolutely to center them */}
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-4">
          <Tab
            variant="primary"
            isActive={activeTab === "open"}
            onClick={() => setActiveTab("open")}
            badgeCount={openOrdersCount}
            className="px-6"
          >
            Open
          </Tab>
          <Tab
            variant="primary"
            isActive={activeTab === "completed"}
            onClick={() => setActiveTab("completed")}
            badgeCount={completedOrdersCount}
            className="px-6"
          >
            Completed
          </Tab>
        </div>

        {/* Search Input */}
        <SearchInput
          query={searchQuery}
          setQuery={setSearchQuery}
          width="w-full md:w-64"
          alwaysOpen={false}
        />
      </div>

      {/* Filters & Sorting Section */}
      <div className="flex w-full flex-col justify-between gap-4 px-4 py-4 md:flex-row">
        {/* Order Type Filters */}
        <div className="flex rounded-6 bg-white-60">
          {orderTypeOptions.map((option, index) => (
            <Tab
              key={index}
              variant="secondary"
              isActive={selectedOrderType === option.value}
              onClick={() =>
                setSelectedOrderType(
                  selectedOrderType === option.value ? "" : option.value
                )
              }
            >
              {option.title}
            </Tab>
          ))}
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          {/* Order Status Stats - Only show in Open tab */}
          {activeTab === "open" && (
            <OrderStatusStats
              statuses={orderStatusStats}
              selectedStatus={selectedOrderStatus}
              onStatusSelect={(status) =>
                setSelectedOrderStatus(
                  selectedOrderStatus === status ? "" : status
                )
              }
            />
          )}

          {/* Sorting */}
          <CustomSelect
            options={sortingOptions}
            sortByText="Sort by:"
            menuPosition="left"
            selectWidth="w-fit lg:w-[163px]"
            menuWidth="w-full"
            onOptionSelect={(option) => setSortingOption(option.value)}
            defaultValue={sortingOptions[0]}
            showIconOnMobile
          />
        </div>
      </div>

      {/* Masonry Order Grid */}
      <div className="masonry-scroll-container h-screen flex-grow overflow-y-auto rounded-5 px-4">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex w-auto gap-4"
          columnClassName="bg-clip-padding"
        >
          {sortedOrders.map((order) => (
            <div key={order.orderId} className="mb-4">
              <OrderCard
                orderId={order.orderId}
                orderNumber={order.orderNumber}
                paymentStatus={order.paymentStatus}
                table={order.table || undefined}
                time={order.time}
                status={order.status}
                items={order.items}
                editTimeAgo={order.editTimeAgo}
                orderInstructions={order.orderInstructions || undefined}
                searchTerm={searchQuery}
                filters={mockFilters}
                orderType={order.orderType}
              />
            </div>
          ))}
        </Masonry>
      </div>
    </div>
  )
}

export default KitchenDisplay
