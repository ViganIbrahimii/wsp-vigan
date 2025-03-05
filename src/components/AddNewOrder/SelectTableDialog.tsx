import { useEffect, useRef, useState } from "react"
import { GetTablesParams, TableSortBy, TableSortOrder } from "@/api/tables"
import { LiveCounterTableSortingOption } from "@/constants/liveCounterSortingOptions"
import { OrderStatuses } from "@/constants/orderStatuses"
import { ChevronDownIcon, CloseIcon, TableBarIcon } from "@/icons"
import { useAuth } from "@/providers/AuthProvider/AuthProvider"

import { Table } from "@/types/interfaces/table.interface"
import { useGetOrders } from "@/lib/hooks/queries/orders/useGetOrders"
import { useGetSections } from "@/lib/hooks/queries/sections/useGetSections"
import { useGetTablesInfinite } from "@/lib/hooks/queries/tables/useGetTablesInfinite"
import { cn, updateFilters } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogDescription,
  DialogFullScreenContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dialog"
import { IconButton } from "@/components/iconButton"
import IconWrapper from "@/components/iconWrapper"
import { TableCard } from "@/components/liveCounterTableCard"
import SearchInput from "@/components/searchInput"
import { CustomSelect } from "@/components/select"
import Spinner from "@/components/spinner"
import { Tab } from "@/components/tab"
import {
  fontCaptionBold,
  fontCaptionNormal,
  fontTitle1,
} from "@/styles/typography"

interface SelectTableDialogProps {
  onTableSelect: (table: Table) => void
  table: Table | null
  preSelectedTable: Table | null
}

const SelectTableDialog: React.FC<SelectTableDialogProps> = ({
  onTableSelect,
  table,
  preSelectedTable,
}) => {
  const [open, setOpen] = useState(false)

  const { brandId } = useAuth()
  const bottomRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState<GetTablesParams>({
    brand_id: brandId ?? "",
    page_limit: 100,
    page_size: 1,
    section_ids: "",
  })

  const [sorting, setSorting] = useState<{
    option?: LiveCounterTableSortingOption
    sort_by?: TableSortBy
    sort_order?: TableSortOrder
  }>({})
  const [tableData, setTableData] = useState<Table[]>([])

  const ACTIVE_ORDER_STATUSES = [
    OrderStatuses.ORDERED,
    OrderStatuses.ACCEPTED,
    OrderStatuses.READY,
    OrderStatuses.SERVED,
  ].join(",")

  const { data: sections } = useGetSections({
    brand_id: brandId ?? "",
    page_limit: 10,
    page_size: 1,
    status: ["active"],
  })

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetTablesInfinite(filters)

  const { data: orders } = useGetOrders({
    brand_id: brandId ?? "",
    page_limit: 100,
    page_size: 1,
    order_status: ACTIVE_ORDER_STATUSES,
  })

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
        root: currentRef.parentElement || null,
        rootMargin: "100px",
        threshold: 0.1,
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
      setLoading(false)
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

  const handleSectionSelect = (sectionId?: string) => {
    setLoading(true)
    setFilters((prevFilters) => ({
      ...prevFilters,
      section_ids: sectionId,
    }))
  }

  const updateSearch = (newQuery: string) => {
    setFilters((prevFilters) => updateFilters(prevFilters, "search", newQuery))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {preSelectedTable ? (
        <div
          className={cn(
            "flex h-[48px]  items-center rounded-6 border border-black-10 bg-white-60 pr-4"
          )}
        >
          <div className="mr-2 flex h-[46px] min-w-[46px] items-center justify-center rounded-full bg-gray-100">
            <IconWrapper
              Component={TableBarIcon}
              size={"20"}
              color={"black40"}
            />
          </div>

          <div className="flex flex-col text-left">
            <span className={cn("text-black-40", fontCaptionNormal)}>
              Table Number
            </span>
            {preSelectedTable?.name && (
              <span className={cn("text-black-40", fontCaptionBold)}>
                {preSelectedTable.name}
              </span>
            )}
          </div>

          <div className="ml-auto">
            <IconWrapper
              Component={ChevronDownIcon}
              size="20"
              color={"black40"}
            />
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "flex h-[48px] cursor-pointer items-center rounded-6 border border-black-10 bg-white-60 pr-4"
          )}
          onClick={() => setOpen(true)}
        >
          <div className="mr-2 flex h-[46px] min-w-[46px] items-center justify-center rounded-full bg-gray-100">
            <IconWrapper Component={TableBarIcon} size={"20"} />
          </div>

          <div className="flex flex-col text-left">
            <span className={cn("text-black-60", fontCaptionNormal)}>
              Table Number
            </span>
            {table?.name && (
              <span className={cn("text-black-100", fontCaptionBold)}>
                {table.name}
              </span>
            )}
          </div>

          <div className="ml-auto">
            <IconWrapper Component={ChevronDownIcon} size="20" />
          </div>
        </div>
      )}

      <DialogFullScreenContent className="flex h-screen flex-col">
        <DialogHeader className="hidden">
          <DialogTitle>Change Table</DialogTitle>
        </DialogHeader>
        <DialogDescription className="hidden">Select Table</DialogDescription>

        <div className="flex h-full flex-col bg-body-gradient px-4 py-7">
          <div className="relative flex">
            <IconButton
              className="absolute right-0"
              variant="primaryWhite"
              size="large"
              icon={CloseIcon}
              iconSize="24"
              isActive={true}
              onClick={() => {
                setOpen(false)
              }}
            />
            <h1 className={(cn("mb-4 mr-6 text-3xl font-bold"), fontTitle1)}>
              Select Table Number
            </h1>
          </div>

          <div className="mt-8 flex h-full w-full flex-col gap-4">
            <div className="flex w-full flex-col gap-10 md:flex-row md:items-center">
              {/* Left section: scrollable tabs */}
              <div
                className="scrollbar-hide min-w-0 max-w-full flex-1 overflow-x-auto rounded-6 md:max-w-[800px] "
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

              {/* Right section: custom select and search input */}
              <div className="ml-0 flex items-center gap-4 md:ml-auto">
                <CustomSelect<LiveCounterTableSortingOption>
                  options={options}
                  sortByText="Sort by:"
                  menuPosition="left"
                  smallScreenMenuPosition="right"
                  onOptionSelect={handleSortChange}
                  selectWidth="w-[210px]"
                />
                <div className="relative flex justify-end overflow-hidden">
                  <SearchInput
                    query={filters.search || ""}
                    setQuery={updateSearch}
                  />
                </div>
              </div>
            </div>

            <div className="masonry-scroll-container md:max-h-[calc(100vh-180px)] max-h-[calc(100vh-270px)] h-[80vh] overflow-auto">
              {loading && (
                <div className="flex h-full items-center justify-center">
                  <Spinner />
                </div>
              )}
              {!loading && (
                <div className="flex h-full flex-col gap-10">
                  <div className="grid auto-rows-fr grid-cols-[repeat(auto-fill,_minmax(150px,_1fr))] justify-start gap-4 ">
                    {tableData.map((table, index) => (
                      <TableCard
                        key={index}
                        name={table.name}
                        brand_id={table.brand_id}
                        section_name={table.section_name}
                        id={table.id}
                        table_order={table.order}
                        user_id={table.user_id}
                        no_of_capacity={table.no_of_capacity}
                        isSmallIconView={true}
                        isChecked={false}
                        onClick={() => {
                          onTableSelect(table)
                          setOpen(false)
                        }}
                        searchTerm={filters.search}
                      />
                    ))}
                  </div>
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
          </div>
        </div>
      </DialogFullScreenContent>
    </Dialog>
  )
}

export default SelectTableDialog
