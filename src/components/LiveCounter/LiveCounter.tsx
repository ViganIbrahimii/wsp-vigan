"use client"

import { useEffect, useState } from "react"
import { OrderType } from "@/constants/orderTypes"
import { useRouter } from "@/i18n/routing"
import { AddIcon, SearchIcon } from "@/icons"
import { useAuth } from "@/providers/AuthProvider/AuthProvider"
import { CartProvider } from "@/providers/CartProvider"

import { Table } from "@/types/interfaces/table.interface"
import { useGetOrders } from "@/lib/hooks/queries/orders/useGetOrders"
import { cn, updateFilters } from "@/lib/utils"
import { IconButton } from "@/components/iconButton"
import { Tab } from "@/components/tab"
import { fontTitle1 } from "@/styles/typography"

import CreateOrderDialog from "../AddNewOrder/CreateOrderModal"
import EditOrderDialog from "../OrderDetailModal/EditOrderModal"
import SearchInput from "../searchInput"
import AggregatorComponent from "./views/Aggregator"
import DeliveryComponent from "./views/Delivery"
import PickupComponent from "./views/Pickup"
import TablesComponent from "./views/Tables"
import { useInitializeTabs } from "@/lib/hooks/utilityHooks/useInitializeTabs"

interface LiveCounterComponentProps {}

type TabName = "Tables" | "Delivery" | "Pickup" | "Aggregators"

type MainTabBadgeCounts = {
  [key in TabName]: number
}

export default function LiveCounterComponent({}: LiveCounterComponentProps) {
  const { brandId } = useAuth()
  const router = useRouter()
  const [selectedTable, setSelectedTable] = useState<Table | undefined>(
    undefined
  )
  const [selectedMainTabIndex, setSelectedMainTabIndex] = useState(0)
  const [selectedMainTabValue, setSelctedMainTabValue] = useState<OrderType>(OrderType.DINE)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [searchKeyword, setSearchKeyword] = useState("")
  const [mainTabBadgeCounts, setMainTabBadgeCounts] = useState<{
    Tables: number
    Delivery: number
    Pickup: number
    Aggregators: number
  }>({
    Tables: 0,
    Delivery: 0,
    Pickup: 0,
    Aggregators: 0,
  })
  const { enrichedTabs } = useInitializeTabs()
  
  const updateSearch = (newQuery: string) => {
    setSearchKeyword(newQuery)
  }

  const { data: deliveryData } = useGetOrders({
    page_size: 1,
    page_limit: 1,
    brand_id: brandId!,
    order_type: OrderType.DELIVERY,
    sort_by: "ordernumber",
    search: searchKeyword,
    order_status: "ordered,accepted,ready",
  })

  const { data: pickupData } = useGetOrders({
    page_size: 1,
    page_limit: 1,
    brand_id: brandId!,
    order_type: OrderType.PICKUP,
    order_status: "ordered,accepted,ready",
  })

  const { data: aggregatorData } = useGetOrders({
    page_size: 1,
    page_limit: 1,
    brand_id: brandId!,
    order_type: OrderType.AGGREGATOR,
    order_status: "ordered,accepted,ready",
  })

  const mainTabs: { name: TabName }[] = [
    { name: "Tables" },
    { name: "Delivery" },
    { name: "Pickup" },
    { name: "Aggregators" },
  ]

  useEffect(() => {
    if (deliveryData?.data) {
      setMainTabBadgeCounts((prevValue) =>
        updateFilters(prevValue, "Delivery", deliveryData?.data?.total)
      )
    }
    if (pickupData?.data) {
      setMainTabBadgeCounts((prevValue) =>
        updateFilters(prevValue, "Pickup", pickupData?.data?.total)
      )
    }
    if (aggregatorData?.data) {
      setMainTabBadgeCounts((prevValue) =>
        updateFilters(prevValue, "Aggregators", aggregatorData?.data?.total)
      )
    }
  }, [deliveryData, aggregatorData, pickupData])

  const handleOrderCreated = (
    orderId: string,
    orderType: OrderType,
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
    <div className="flex min-h-screen flex-col gap-2  px-4">
      <div className="flex items-center justify-between py-7">
        <h1 className={cn("font-medium", fontTitle1)}>Live Counter</h1>
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
                onClick={() => {
                  setSelectedMainTabIndex(index)
                  switch (index) {
                    case 0:
                      setSelctedMainTabValue(OrderType.DINE)
                      break;
                    case 1:
                      setSelctedMainTabValue(OrderType.DELIVERY)
                      break;
                    case 2:
                      setSelctedMainTabValue(OrderType.PICKUP)
                      break;
                    default:
                      setSelctedMainTabValue(OrderType.DINE)
                  }
                }}
              >
                {tabItem.name}
              </Tab>
            )
          })}
        </div>
        <div className="relative flex w-64 justify-end overflow-hidden">
          <SearchInput query={searchKeyword} setQuery={updateSearch} />
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
