import { useEffect, useRef, useState } from "react"
import { GetTablesParams, TableSortBy, TableSortOrder } from "@/api/tables"
import { LiveCounterTableSortingOption } from "@/constants/liveCounterSortingOptions"
import { OrderStatuses } from "@/constants/orderStatuses"
import { OrderType } from "@/constants/orderTypes"
import { ChevronDownIcon, CloseIcon, TableBarIcon } from "@/icons"
import { useAuth } from "@/providers/AuthProvider/AuthProvider"

import { OrderListItem } from "@/types/interfaces/order.interface"
import { Table } from "@/types/interfaces/table.interface"
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
// Import mock data from Tables component
import { mockTables } from "@/components/LiveCounter/LiveCounter"
import {
  mockOrderListItems,
  mockSections,
} from "@/components/LiveCounter/views/Tables"
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
  item?: OrderListItem
  onChangeTable?: () => void
}

const SelectTableDialog: React.FC<SelectTableDialogProps> = ({
  item,
  onChangeTable,
}) => {
  const [open, setOpen] = useState(false)

  const { brandId } = useAuth()
  const bottomRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  // Replace API mutation with mock function
  const updateOrder = (
    data: { order_id: string; table_id: string },
    options: {
      onSuccess: (data: { success: boolean }) => void
      onError: (error: { message?: string }) => void
    }
  ) => {
    // Simulate API call with setTimeout
    setTimeout(() => {
      // Simulate successful response
      options.onSuccess({ success: true })
    }, 500)
  }
  const isPending = false
  const error = null

  const [filters, setFilters] = useState<GetTablesParams>({
    brand_id: brandId ?? "",
    page_limit: 100,
    page_size: 1,
    section_ids: "",
    search: "",
  })

  const [sorting, setSorting] = useState<{
    option?: LiveCounterTableSortingOption
    sort_by?: TableSortBy
    sort_order?: TableSortOrder
  }>({})
  const [tableData, setTableData] = useState<Table[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const ACTIVE_ORDER_STATUSES = [
    OrderStatuses.ORDERED,
    OrderStatuses.ACCEPTED,
    OrderStatuses.READY,
    OrderStatuses.SERVED,
  ].join(",")

  // Mock sections data instead of API query
  const sections = { data: { data: mockSections } }

  // Mock options for sorting
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

  // Mock infinite scroll behavior
  useEffect(() => {
    // Simulate loading
    setIsLoading(true)

    // Process mock data based on filters and sorting
    setTimeout(() => {
      let filteredTables = [...mockTables]

      // Apply section filter
      if (filters.section_ids) {
        filteredTables = filteredTables.filter(
          (table) => table.section_id === filters.section_ids
        )
      }

      // Apply search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filteredTables = filteredTables.filter(
          (table) =>
            table.name.toLowerCase().includes(searchLower) ||
            table.section_name.toLowerCase().includes(searchLower)
        )
      }

      // Apply sorting
      if (
        sorting.option ===
        LiveCounterTableSortingOption.TABLE_NAME_ASCENDING_STATUS
      ) {
        filteredTables.sort((a, b) => a.name.localeCompare(b.name))
      } else if (
        sorting.option ===
        LiveCounterTableSortingOption.TABLE_NAME_DESCENDING_STATUS
      ) {
        filteredTables.sort((a, b) => b.name.localeCompare(a.name))
      } else if (
        sorting.option === LiveCounterTableSortingOption.OCCUPIED_FIRST
      ) {
        filteredTables.sort((a, b) => (b.order ? 1 : 0) - (a.order ? 1 : 0))
      } else if (sorting.option === LiveCounterTableSortingOption.EMPTY_FIRST) {
        filteredTables.sort((a, b) => (a.order ? 1 : 0) - (b.order ? 1 : 0))
      }

      setTableData(filteredTables)
      setIsLoading(false)
    }, 500)
  }, [filters, sorting])

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
    setFilters((prevFilters) => ({
      ...prevFilters,
      section_ids: sectionId,
    }))
  }

  const updateSearch = (newQuery: string) => {
    setFilters((prevFilters) => updateFilters(prevFilters, "search", newQuery))
  }

  const handleChangeTable = ({ table }: { table: Table }) => {
    // Mock update order function
    updateOrder(
      {
        order_id: item?.order_id!,
        table_id: table.id,
      },
      {
        onSuccess: (data) => {
          onChangeTable?.()
          toast({
            title: `Order ${item?.order_number}: Table changed successfully.`,
          })
          setOpen(false) // Close the dialog
        },
        onError: (error) => {
          console.log("Close Order error", error)
          toast({
            title: `Order ${item?.order_number}: Table change error. ${error?.message || "Unknown error"}`,
          })
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <IconButton
          className="w-[140px]"
          variant={"primaryOutlineLabel"}
          icon={TableBarIcon}
        >
          Change Table
        </IconButton>
      </DialogTrigger>
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
            <div className="flex w-full items-center gap-10">
              {/* Left section: scrollable tabs */}
              <div
                className="scrollbar-hide min-w-0 flex-1 overflow-x-auto rounded-6"
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
              <div className="ml-auto flex items-center gap-4">
                <CustomSelect<LiveCounterTableSortingOption>
                  options={options}
                  sortByText="Sort by:"
                  menuPosition="left"
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

            <div>
              {isLoading && (
                <div className="absolute left-0 top-0 flex h-[calc(100vh-200px)] w-full items-center justify-center">
                  <Spinner />
                </div>
              )}
              {!isLoading && (
                <div>
                  <div className="grid auto-rows-fr grid-cols-[repeat(auto-fill,_minmax(150px,_1fr))] justify-start gap-4 py-4">
                    {tableData.map((table, index) => (
                      <div key={index} className="">
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
                          isChecked={table.id === item?.table?.id}
                          onClick={() => {
                            handleChangeTable({ table })
                          }}
                          searchTerm={filters.search}
                        />
                      </div>
                    ))}
                  </div>
                  <div ref={bottomRef} className="h-fit">
                    {/* No need for infinite loading with mock data */}
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
