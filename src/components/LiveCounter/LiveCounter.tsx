"use client"

import { useEffect, useState } from "react"
import { OrderStatuses } from "@/constants/orderStatuses"
import { OrderType } from "@/constants/orderTypes"
import { AddIcon } from "@/icons"
import { CartProvider } from "@/providers/CartProvider"

import { Table } from "@/types/interfaces/table.interface"
import { cn } from "@/lib/utils"
import CreateOrderDialog from "@/components/AddNewOrder/CreateOrderModal"
import AggregatorComponent from "@/components/LiveCounter/views/Aggregator"
import DeliveryComponent from "@/components/LiveCounter/views/Delivery"
import PickupComponent from "@/components/LiveCounter/views/Pickup"
import TablesComponent from "@/components/LiveCounter/views/Tables"
import SearchInput from "@/components/searchInput"
import { Tab } from "@/components/tab"
import { fontTitle1 } from "@/styles/typography"

interface LiveCounterComponentProps {}

type TabName = "Tables" | "Delivery" | "Pickup" | "Aggregators"

type MainTabBadgeCounts = {
  [key in TabName]: number
}

// Mock data for order counts
const mockOrderCounts: MainTabBadgeCounts = {
  Tables: 12,
  Delivery: 24,
  Pickup: 18,
  Aggregators: 8,
}

// Mock data for tables
export const mockTables: Table[] = [
  {
    id: "table-1",
    user_id: "user-1",
    section_id: "section-1",
    section_name: "Main Hall",
    brand_id: "brand-1",
    brand_name: "Restaurant Brand",
    name: "Table 1",
    no_of_capacity: 4,
    position: { id: "pos-1", name: "Center", abbreviation: "C" },
    status: "active",
    order_type: OrderType.DINE,
    order: {
      id: "order-1",
      status: OrderStatuses.ORDERED,
      payment_status: "pending",
      order_count: "1",
      order_time: "2023-05-15 14:30:00",
    },
  },
  {
    id: "table-2",
    user_id: "user-1",
    section_id: "section-1",
    section_name: "Main Hall",
    brand_id: "brand-1",
    brand_name: "Restaurant Brand",
    name: "Table 2",
    no_of_capacity: 2,
    position: { id: "pos-2", name: "Window", abbreviation: "W" },
    status: "active",
    order_type: null,
  },
  {
    id: "table-3",
    user_id: "user-1",
    section_id: "section-2",
    section_name: "Terrace",
    brand_id: "brand-1",
    brand_name: "Restaurant Brand",
    name: "Table 3",
    no_of_capacity: 6,
    position: { id: "pos-3", name: "Corner", abbreviation: "CR" },
    status: "active",
    order_type: OrderType.DINE,
    order: {
      id: "order-2",
      status: OrderStatuses.ACCEPTED,
      payment_status: "pending",
      order_count: "2",
      order_time: "2023-05-15 15:00:00",
    },
  },
  {
    id: "table-4",
    user_id: "user-1",
    section_id: "section-2",
    section_name: "Terrace",
    brand_id: "brand-1",
    brand_name: "Restaurant Brand",
    name: "Table 4",
    no_of_capacity: 4,
    position: { id: "pos-4", name: "Center", abbreviation: "C" },
    status: "active",
    order_type: null,
  },
  {
    id: "table-5",
    user_id: "user-1",
    section_id: "section-3",
    section_name: "River Side",
    brand_id: "brand-1",
    brand_name: "Restaurant Brand",
    name: "Table 5",
    no_of_capacity: 2,
    position: { id: "pos-5", name: "Bar", abbreviation: "B" },
    status: "active",
    order_type: OrderType.DINE,
    order: {
      id: "order-3",
      status: OrderStatuses.SERVED,
      payment_status: "paid",
      order_count: "1",
      order_time: "2023-05-15 13:30:00",
    },
  },
  {
    id: "table-6",
    user_id: "user-1",
    section_id: "section-4",
    section_name: "Sea View",
    brand_id: "brand-1",
    brand_name: "Restaurant Brand",
    name: "Table 6",
    no_of_capacity: 8,
    position: { id: "pos-6", name: "Window", abbreviation: "W" },
    status: "active",
    order_type: OrderType.DINE,
    order: {
      id: "order-4",
      status: OrderStatuses.READY,
      payment_status: "pending",
      order_count: "3",
      order_time: "2023-05-15 16:00:00",
    },
  },
]

// Mock data for sections
export const mockSections = [
  { section_id: "section-1", section_name: "Main Hall" },
  { section_id: "section-2", section_name: "Terrace" },
  { section_id: "section-3", section_name: "River Side" },
  { section_id: "section-4", section_name: "Sea View" },
]

export default function LiveCounter({}: LiveCounterComponentProps) {
  const [selectedTable, setSelectedTable] = useState<Table | undefined>(
    undefined
  )
  const [selectedMainTabIndex, setSelectedMainTabIndex] = useState(0)
  const [selectedMainTabValue, setSelectedMainTabValue] = useState<OrderType>(
    OrderType.DINE
  )
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [searchKeyword, setSearchKeyword] = useState("")
  const [mainTabBadgeCounts, setMainTabBadgeCounts] =
    useState<MainTabBadgeCounts>(mockOrderCounts)

  const updateSearch = (newQuery: string) => {
    setSearchKeyword(newQuery)
  }

  const mainTabs: { name: TabName }[] = [
    { name: "Tables" },
    { name: "Delivery" },
    { name: "Pickup" },
    { name: "Aggregators" },
  ]

  const handleOrderCreated = (
    orderId: string = "mock-order-id",
    orderType: OrderType = OrderType.DINE,
    tableId?: string
  ) => {
    setSelectedOrderId(orderId)
    // If it's a table order
    if (orderType === OrderType.DINE && tableId) {
      setSelectedMainTabIndex(0) // Switch to Tables tab
      setSelectedTable({ id: tableId } as Table) // Set selected table
    }
    // If it's a delivery order
    else if (orderType === OrderType.DELIVERY) {
      setSelectedMainTabIndex(1) // Switch to Delivery tab
    }
    // If it's a pickup order
    else if (orderType === OrderType.PICKUP) {
      setSelectedMainTabIndex(2) // Switch to Pickup tab
    }

    // Clear any existing search
    setSearchKeyword("")
  }

  return (
    <div className="flex h-screen flex-col gap-2 px-4">
      <div className="flex items-center justify-between py-7">
        <h1 className={cn("text-black-100", fontTitle1)}>Live Counter</h1>
        <div className="flex gap-4">
          {mainTabs.map((tabItem, index) => {
            return (
              <Tab
                key={`main-tab-${index}`}
                badgeCount={
                  mainTabBadgeCounts[tabItem.name] > 0
                    ? mainTabBadgeCounts[tabItem.name]
                    : undefined
                }
                variant="primary"
                isActive={index === selectedMainTabIndex}
                className="px-6"
                onClick={() => {
                  setSelectedMainTabIndex(index)
                  switch (index) {
                    case 0:
                      setSelectedMainTabValue(OrderType.DINE)
                      break
                    case 1:
                      setSelectedMainTabValue(OrderType.DELIVERY)
                      break
                    case 2:
                      setSelectedMainTabValue(OrderType.PICKUP)
                      break
                    case 3:
                      setSelectedMainTabValue(OrderType.AGGREGATOR)
                      break
                    default:
                      setSelectedMainTabValue(OrderType.DINE)
                  }
                }}
              >
                {tabItem.name}
              </Tab>
            )
          })}
        </div>
        <div className="relative flex w-64 justify-end overflow-hidden">
          <SearchInput
            query={searchKeyword}
            setQuery={updateSearch}
            width="w-64"
          />
        </div>
      </div>
      {selectedMainTabIndex === 0 && (
        <TablesComponent
          searchKeyword={searchKeyword}
          setMainTabBadgeCounts={setMainTabBadgeCounts}
          selectedTable={selectedTable}
          setSelectedTable={setSelectedTable}
          selectedOrderId={selectedOrderId}
          onOrderSelected={() => setSelectedOrderId(null)}
        />
      )}
      {selectedMainTabIndex === 1 && (
        <DeliveryComponent
          searchKeyword={searchKeyword}
          setMainTabBadgeCounts={setMainTabBadgeCounts}
          selectedOrderId={selectedOrderId}
          onOrderSelected={() => setSelectedOrderId(null)}
          initialFilters={{ sort_by: "date", sort_order: "desc" }}
        />
      )}
      {selectedMainTabIndex === 2 && (
        <PickupComponent
          searchKeyword={searchKeyword}
          setMainTabBadgeCounts={setMainTabBadgeCounts}
          selectedOrderId={selectedOrderId}
          onOrderSelected={() => setSelectedOrderId(null)}
          initialFilters={{ sort_by: "date", sort_order: "desc" }}
        />
      )}
      {selectedMainTabIndex === 3 && (
        <AggregatorComponent
          searchKeyword={searchKeyword}
          setMainTabBadgeCounts={setMainTabBadgeCounts}
        />
      )}
      <CartProvider>
        <CreateOrderDialog
          onOrderCreated={handleOrderCreated}
          mainTabValue={selectedMainTabValue}
        />
      </CartProvider>
    </div>
  )
}
