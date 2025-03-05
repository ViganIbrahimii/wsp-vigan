"use client"

import { table } from "console"
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { GetOrdersParams } from "@/api/orders"
import { GetTablesParams, TableSortBy, TableSortOrder } from "@/api/tables"
import { LiveCounterTableSortingOption } from "@/constants/liveCounterSortingOptions"
import { OrderStatuses } from "@/constants/orderStatuses"
import { OrderType } from "@/constants/orderTypes"
import { GridIcon, WindowIcon } from "@/icons"
import { useAuth } from "@/providers/AuthProvider/AuthProvider"
import { CartProvider } from "@/providers/CartProvider"
import Masonry from "react-masonry-css"

import { OrderListItem } from "@/types/interfaces/order.interface"
import { Table } from "@/types/interfaces/table.interface"
import { useGetOrders } from "@/lib/hooks/queries/orders/useGetOrders"
import { useGetSections } from "@/lib/hooks/queries/sections/useGetSections"
import { useGetTables } from "@/lib/hooks/queries/tables/useGetTables"
import { useGetTablesInfinite } from "@/lib/hooks/queries/tables/useGetTablesInfinite"
import { updateFilters } from "@/lib/utils"
import { IconButton } from "@/components/iconButton"
import { TableCard } from "@/components/liveCounterTableCard"
import TableDetailDialog from "@/components/OrderDetailModal/TableDetailModal"
import { CustomSelect } from "@/components/select"
import Spinner from "@/components/spinner"
import { Tab } from "@/components/tab"
import { breakpointColumnsObj } from "@/styles/columnBreakpoints"

import { sortTableData } from "../../../lib/sortTableHelper"
import { breakpointSmallViewColumnsObj } from "../../../styles/columnBreakpoints"

interface TablesComponentProps {
  searchKeyword: string
  setMainTabBadgeCounts?: Dispatch<
    SetStateAction<{
      Tables: number
      Delivery: number
      Pickup: number
      Aggregators: number
    }>
  >
  selectedTable: Table | undefined
  setSelectedTable: Dispatch<SetStateAction<Table | undefined>>
  selectedOrderId: string | null
  onOrderSelected: () => void
}

export default function TablesComponent({
  searchKeyword,
  setMainTabBadgeCounts,
  selectedTable,
  setSelectedTable,
  selectedOrderId,
  onOrderSelected,
}: TablesComponentProps) {
  const { brandId } = useAuth()
  const bottomRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const [filters, setFilters] = useState<GetTablesParams>({
    brand_id: brandId ?? "",
    page_size: 1,
    page_limit: 100,
    search: searchKeyword,
    section_ids: "",
  })

  const [sorting, setSorting] = useState<{
    option?: LiveCounterTableSortingOption
    sort_by?: TableSortBy
    sort_order?: TableSortOrder
  }>({})
  const [tableData, setTableData] = useState<Table[]>([])

  const [currentSortOption, setCurrentSortOption] =
    useState<LiveCounterTableSortingOption>(
      LiveCounterTableSortingOption.TABLE_NAME_ASCENDING_STATUS
    )

  const ACTIVE_ORDER_STATUSES = [
    OrderStatuses.ORDERED,
    OrderStatuses.ACCEPTED,
    OrderStatuses.READY,
    OrderStatuses.SERVED,
  ].join(",")

  const { data: sections } = useGetSections({
    brand_id: brandId ?? "",
    page_limit: 50,
    page_size: 1,
    status: ["active"],
  })

  useEffect(() => {
    setFilters((prevFilters) =>
      updateFilters(prevFilters, "search", searchKeyword)
    )
  }, [searchKeyword])

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useGetTablesInfinite(filters)

  const { data: orders, refetch: refetchOrders } = useGetOrders({
    brand_id: brandId ?? "",
    page_limit: 100,
    page_size: 1,
    order_type: OrderType.DINE,
    order_status: ACTIVE_ORDER_STATUSES,
  })

  useEffect(() => {
    if (data)
      setMainTabBadgeCounts?.((prevState) =>
        updateFilters(prevState, "Tables", data.pages[0].total || 0)
      )
  }, [data])

  const [isSmallIconView, setIsSmallIconView] = useState(false)

  const options = [
    {
      value: LiveCounterTableSortingOption.TABLE_NAME_ASCENDING_STATUS,
      label: "Table No. Ascending",
    },
    {
      value: LiveCounterTableSortingOption.TABLE_NAME_DESCENDING_STATUS,
      label: "Table No. Descending",
    },
    {
      value: LiveCounterTableSortingOption.OCCUPIED_FIRST,
      label: "Occupied First",
    },
    { value: LiveCounterTableSortingOption.EMPTY_FIRST, label: "Empty First" },
  ]

  const handleSortChange = (option: {
    value: LiveCounterTableSortingOption
    label: string
  }) => {
    const { value } = option

    setSorting((prevSorting) => {
      let sort_by: TableSortBy | undefined
      let sort_order: TableSortOrder | undefined

      if (value === LiveCounterTableSortingOption.TABLE_NAME_ASCENDING_STATUS) {
        sort_by = "id"
        sort_order = "asc"
      } else if (
        value === LiveCounterTableSortingOption.TABLE_NAME_DESCENDING_STATUS
      ) {
        sort_by = "id"
        sort_order = "desc"
      }

      // Update filters with sort_by and sort_order for API-based sorting
      setFilters((prevFilters) => ({
        ...prevFilters,
        sort_by,
        sort_order,
      }))

      // Clear sort_by and sort_order from filters for custom sorting
      if (
        value === LiveCounterTableSortingOption.OCCUPIED_FIRST ||
        value === LiveCounterTableSortingOption.EMPTY_FIRST
      ) {
        setFilters((prevFilters) => ({
          ...prevFilters,
          sort_by: undefined,
          sort_order: undefined,
        }))
      }

      return {
        option: value,
        sort_by,
        sort_order,
      }
    })
  }

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
    if (data && orders) {
      const tables = data.pages.flatMap((page) => page.data) || []

      const modifiedTables = tables.map((table) => {
        // Get all orders associated with the current table
        const tableOrders =
          orders.data?.data.filter((order) => order.table?.id === table.id) ||
          []

        if (tableOrders.length === 0) {
          // Case: Empty (No orders for the table)
          const { order, ...tableWithoutOrder } = table
          return tableWithoutOrder // Remove the `order` field
        }

        const hasOccupiedOrder = tableOrders.some((order) =>
          [
            OrderStatuses.ORDERED,
            OrderStatuses.ACCEPTED,
            OrderStatuses.READY,
          ].includes(order.order_status)
        )

        if (hasOccupiedOrder) {
          // Case: Occupied (At least one active order)
          const firstOccupiedOrder = tableOrders.find((order) =>
            [
              OrderStatuses.ORDERED,
              OrderStatuses.ACCEPTED,
              OrderStatuses.READY,
            ].includes(order.order_status)
          )

          if (firstOccupiedOrder) {
            return {
              ...table,
              order: {
                id: firstOccupiedOrder.order_id,
                status: firstOccupiedOrder.order_status,
                payment_status: firstOccupiedOrder.payment_status || "",
                order_count: String(tableOrders.length), // Convert order count to string
                order_time: firstOccupiedOrder.time,
              },
            }
          }
        }

        const allOrdersServed = tableOrders.every(
          (order) => order.order_status === OrderStatuses.SERVED
        )

        if (allOrdersServed) {
          // Case: Almost Empty (All orders are served)
          const firstServedOrder = tableOrders.find(
            (order) => order.order_status === OrderStatuses.SERVED
          )

          if (firstServedOrder) {
            return {
              ...table,
              order: {
                id: firstServedOrder.order_id,
                status: firstServedOrder.order_status,
                payment_status: firstServedOrder.payment_status || "",
                order_count: String(tableOrders.length), // Convert order count to string
                order_time: firstServedOrder.time,
              },
            }
          }
        }

        // Default: Remove `order` field if no specific condition is met
        const { order, ...tableWithoutOrder } = table
        return tableWithoutOrder
      })

      if (
        sorting.option === LiveCounterTableSortingOption.OCCUPIED_FIRST ||
        sorting.option === LiveCounterTableSortingOption.EMPTY_FIRST
      ) {
        const occupiedTableIds = orders.data?.data
          ?.filter((order) =>
            ACTIVE_ORDER_STATUSES.includes(order.order_status)
          )
          .map((order) => order?.table?.id)

        const occupiedTables = modifiedTables.filter((table) =>
          occupiedTableIds?.includes(table.id)
        )
        const emptyTables = modifiedTables.filter(
          (table) => !occupiedTableIds?.includes(table.id)
        )

        setTableData(
          sorting.option === LiveCounterTableSortingOption.OCCUPIED_FIRST
            ? [...occupiedTables, ...emptyTables]
            : [...emptyTables, ...occupiedTables]
        )
      } else {
        setTableData(modifiedTables)
      }
    }
  }, [data, orders, sorting])

  const handleWheel = (
    ref: React.RefObject<HTMLDivElement>,
    e: React.WheelEvent
  ) => {
    if (ref.current) {
      ref.current.scrollLeft += e.deltaY // Horizontal scrolling
    }
  }

  const handleSectionSelect = (sectionId?: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      section_ids: sectionId,
    }))
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute left-0 top-0 flex h-[calc(100vh-200px)] w-full items-center justify-center">
          <Spinner />
        </div>
      )}
      {!isLoading && (
        <>
          <div className="flex items-center justify-between gap-10">
            <div
              className="scrollbar-hide min-w-[300px] max-w-[40%] flex-1 overflow-x-auto rounded-6"
              onWheel={(e) => handleWheel(scrollRef, e)}
              ref={scrollRef}
            >
              <div className="inline-flex gap-2 whitespace-nowrap rounded-6 bg-white-60">
                <Tab
                  variant="secondary"
                  isActive={!filters.section_ids}
                  onClick={() => handleSectionSelect()}
                >
                  All Table
                </Tab>
                {sections?.data.data.map((tabItem) => (
                  <Tab
                    variant="secondary"
                    key={`section-${tabItem.section_id}`}
                    isActive={filters.section_ids === tabItem.section_id}
                    onClick={() => handleSectionSelect(tabItem.section_id)}
                  >
                    {tabItem.section_name}
                  </Tab>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <CustomSelect<LiveCounterTableSortingOption>
                options={options}
                sortByText="Sort by:"
                menuPosition="left"
                onOptionSelect={handleSortChange}
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
          <div>
            {isLoading && (
              <div className="absolute left-0 top-0 flex h-[calc(100vh-200px)] w-full items-center justify-center">
                <Spinner />
              </div>
            )}
            {!isLoading && (
              <div className="masonry-scroll-container mt-2  h-[calc(100vh-200px)] flex-grow overflow-y-auto">
                <Masonry
                  breakpointCols={
                    isSmallIconView
                      ? breakpointSmallViewColumnsObj
                      : breakpointColumnsObj
                  }
                  className="-ml-4 flex w-auto"
                  columnClassName="px-4 bg-clip-padding py-4"
                >
                  {tableData.map((table, index) => (
                    <div key={index} className="mb-4">
                      <TableCard
                        key={index}
                        name={table.name}
                        brand_id={table.brand_id}
                        section_name={table.section_name}
                        id={table.id}
                        table_order={table.order}
                        user_id={table.user_id}
                        no_of_capacity={table.no_of_capacity}
                        isSmallIconView={isSmallIconView}
                        isChecked={false}
                        onClick={() => {
                          setSelectedTable(table)
                        }}
                        searchTerm={filters.search}
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
            )}
          </div>
          <CartProvider>
            <TableDetailDialog
              item={selectedTable}
              onClose={() => {
                refetchOrders()
                refetch()
                setSelectedTable(undefined)
              }}
              selectedOrderId={selectedOrderId}
              onOrderSelected={onOrderSelected}
            />
          </CartProvider>
        </>
      )}
    </div>
  )
}
