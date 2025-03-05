"use client"

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { GetOrdersParams } from "@/api/orders"
import { LiveCounterOrderSortingOption } from "@/constants/liveCounterSortingOptions"
import { OrderType } from "@/constants/orderTypes"
import { GridIcon, WindowIcon } from "@/icons"
import { useAuth } from "@/providers/AuthProvider/AuthProvider"
import { CartProvider } from "@/providers/CartProvider"
import Masonry from "react-masonry-css"

import { OrderListItem } from "@/types/interfaces/order.interface"
import { useGetOrdersInfinite } from "@/lib/hooks/queries/orders/useGetOrdersInfinite"
import { updateFilters } from "@/lib/utils"
import { IconButton } from "@/components/iconButton"
import { LiveCounterOrderCard } from "@/components/liveCounterOrderCard"
import PickupDetailDialog from "@/components/OrderDetailModal/PickupDetailModal"
import { CustomSelect } from "@/components/select"
import Spinner from "@/components/spinner"
import { Tab } from "@/components/tab"
import { breakpointColumnsObj } from "@/styles/columnBreakpoints"

import { breakpointSmallViewColumnsObj } from "../../../styles/columnBreakpoints"

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

  useEffect(() => {
    refetch() // Explicitly trigger refetch when filters change
  }, [filters])

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useGetOrdersInfinite(filters)

  const orders = data?.pages.flatMap((page) => page.data) || []

  useEffect(() => {
    const currentRef = bottomRef.current

    if (!currentRef) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      {
        root: bottomRef.current?.parentElement || null, // Ensure it observes within the scrolling container
        rootMargin: "100px",
        threshold: 0.1, // Trigger when 10% of the target is visible
      }
    )

    observer.observe(currentRef)

    return () => {
      observer.unobserve(currentRef)
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  useEffect(() => {
    if (data)
      setMainTabBadgeCounts((prevState) =>
        updateFilters(prevState, "Pickup", data.pages[0].total || 0)
      )
  }, [data])

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
    if (selectedOrderId && orders.length > 0) {
      const matchingOrder = orders.find(
        (order) => order.order_id === selectedOrderId
      )
      if (matchingOrder) {
        setSelectedItem(matchingOrder)
        onOrderSelected()
      }
    }
  }, [selectedOrderId, orders])

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
              {orders.map((order, index) => (
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
              {isFetchingNextPage && (
                <div className="flex items-center justify-center py-4">
                  <Spinner />
                </div>
              )}
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
