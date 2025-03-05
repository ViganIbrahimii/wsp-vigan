"use client"

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { LiveCounterTableSortingOption } from "@/constants/liveCounterSortingOptions"
import { OrderStatuses } from "@/constants/orderStatuses"
import { OrderType } from "@/constants/orderTypes"
import { GridIcon, WindowIcon } from "@/icons"
import { CartProvider } from "@/providers/CartProvider"
import Masonry from "react-masonry-css"

import { OrderListItem } from "@/types/interfaces/order.interface"
import { Table } from "@/types/interfaces/table.interface"
import { cn } from "@/lib/utils"
import { IconButton } from "@/components/iconButton"
import { TableCard } from "@/components/liveCounterTableCard"
import TableDetailDialog from "@/components/OrderDetailModal/TableDetailModal"
import { CustomSelect } from "@/components/select"
import Spinner from "@/components/spinner"
import { Tab } from "@/components/tab"

import { breakpointSmallViewColumnsObj } from "../../../styles/columnBreakpoints"
import { mockTables } from "../LiveCounter"

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

// Mock data for sections
export const mockSections = [
  { section_id: "section-1", section_name: "Main Hall" },
  { section_id: "section-2", section_name: "Terrace" },
  { section_id: "section-3", section_name: "River Side" },
  { section_id: "section-4", section_name: "Sea View" },
]

// Mock data for orders
export const mockOrderListItems: OrderListItem[] = [
  {
    order_number: "ORD-001",
    customer: {
      id: "cust-001",
      first_name: "John",
      last_name: "Doe",
      middle_name: null,
    },
    table: { id: "table-1", name: "Table 1" },
    items_count: 3,
    date: "2023-05-15",
    amount: 45.99,
    currency: "USD",
    order_status: OrderStatuses.ORDERED,
    payment_status: "pending",
    customer_delivery_address: "",
    customer_apartment: "",
    customer_note: "",
    customer_phone_code: "+1",
    customer_phone_number: "555-123-4567",
    attachment: null,
    order_instruction: "Extra napkins please",
    order_id: "order-1",
    order_edit_time: "2023-05-15 14:30:00",
    time: "2023-05-15 14:30:00",
    item_details: [
      {
        id: "item-1",
        name: "Burger",
        item_instruction: null,
        item_status: OrderStatuses.ORDERED,
        item_quantity: 1,
        price: 12.99,
        main_item_image: null,
      },
      {
        id: "item-2",
        name: "Fries",
        item_instruction: "Extra salt",
        item_status: OrderStatuses.ORDERED,
        item_quantity: 1,
        price: 5.99,
        main_item_image: null,
      },
      {
        id: "item-3",
        name: "Soda",
        item_instruction: null,
        item_status: OrderStatuses.ORDERED,
        item_quantity: 1,
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
    order_type: OrderType.DINE,
  },
  {
    order_number: "ORD-002",
    customer: {
      id: "cust-002",
      first_name: "Jane",
      last_name: "Smith",
      middle_name: null,
    },
    table: { id: "table-3", name: "Table 3" },
    items_count: 2,
    date: "2023-05-15",
    amount: 32.98,
    currency: "USD",
    order_status: OrderStatuses.ACCEPTED,
    payment_status: "pending",
    customer_delivery_address: "",
    customer_apartment: "",
    customer_note: "",
    customer_phone_code: "+1",
    customer_phone_number: "555-987-6543",
    attachment: null,
    order_instruction: "",
    order_id: "order-2",
    order_edit_time: "2023-05-15 15:00:00",
    time: "2023-05-15 15:00:00",
    item_details: [
      {
        id: "item-4",
        name: "Pizza",
        item_instruction: null,
        item_status: OrderStatuses.ACCEPTED,
        item_quantity: 1,
        price: 18.99,
        main_item_image: null,
      },
      {
        id: "item-5",
        name: "Salad",
        item_instruction: "No onions",
        item_status: OrderStatuses.ACCEPTED,
        item_quantity: 1,
        price: 13.99,
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
    order_type: OrderType.DINE,
  },
  {
    order_number: "ORD-003",
    customer: {
      id: "cust-003",
      first_name: "Robert",
      last_name: "Johnson",
      middle_name: null,
    },
    table: { id: "table-5", name: "Table 5" },
    items_count: 4,
    date: "2023-05-15",
    amount: 78.96,
    currency: "USD",
    order_status: OrderStatuses.SERVED,
    payment_status: "paid",
    customer_delivery_address: "",
    customer_apartment: "",
    customer_note: "",
    customer_phone_code: "+1",
    customer_phone_number: "555-456-7890",
    attachment: null,
    order_instruction: "",
    order_id: "order-3",
    order_edit_time: "2023-05-15 13:30:00",
    time: "2023-05-15 13:30:00",
    item_details: [
      {
        id: "item-6",
        name: "Steak",
        item_instruction: "Medium rare",
        item_status: OrderStatuses.SERVED,
        item_quantity: 1,
        price: 29.99,
        main_item_image: null,
      },
      {
        id: "item-7",
        name: "Mashed Potatoes",
        item_instruction: null,
        item_status: OrderStatuses.SERVED,
        item_quantity: 1,
        price: 8.99,
        main_item_image: null,
      },
      {
        id: "item-8",
        name: "Wine",
        item_instruction: null,
        item_status: OrderStatuses.SERVED,
        item_quantity: 1,
        price: 24.99,
        main_item_image: null,
      },
      {
        id: "item-9",
        name: "Dessert",
        item_instruction: null,
        item_status: OrderStatuses.SERVED,
        item_quantity: 1,
        price: 14.99,
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
    order_type: OrderType.DINE,
  },
  {
    order_number: "ORD-004",
    customer: {
      id: "cust-004",
      first_name: "Emily",
      last_name: "Wilson",
      middle_name: null,
    },
    table: { id: "table-6", name: "Table 6" },
    items_count: 3,
    date: "2023-05-15",
    amount: 52.97,
    currency: "USD",
    order_status: OrderStatuses.READY,
    payment_status: "pending",
    customer_delivery_address: "",
    customer_apartment: "",
    customer_note: "",
    customer_phone_code: "+1",
    customer_phone_number: "555-789-0123",
    attachment: null,
    order_instruction: "Allergic to nuts",
    order_id: "order-4",
    order_edit_time: "2023-05-15 16:00:00",
    time: "2023-05-15 16:00:00",
    item_details: [
      {
        id: "item-10",
        name: "Pasta",
        item_instruction: null,
        item_status: OrderStatuses.READY,
        item_quantity: 1,
        price: 16.99,
        main_item_image: null,
      },
      {
        id: "item-11",
        name: "Garlic Bread",
        item_instruction: null,
        item_status: OrderStatuses.READY,
        item_quantity: 1,
        price: 5.99,
        main_item_image: null,
      },
      {
        id: "item-12",
        name: "Tiramisu",
        item_instruction: null,
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
    order_type: OrderType.DINE,
  },
]

// Mock data for order details
export const mockOrderDetail = {
  order_id: "order-1",
  order_number: "ORD-001",
  table_id: "table-1",
  coupon_id: null,
  order_status: OrderStatuses.ORDERED,
  payment_method: "card",
  delivery_status: "",
  driver_id: "",
  price_type: 1,
  unit_price: 45.99,
  delivery_distance: 0,
  delivery_fee: 0,
  delivery_time: "",
  driver_rating: 0,
  pickup_time: "",
  cash_status: "",
  delivery_type: 0,
  tips: 0,
  cancelled_reason: "",
  cash_deposit: 0,
  order_image: {
    cid: "",
    type: "",
    name: "",
  },
  customer_rating: 0,
  customer_delivery_note: "",
  order_instruction: "Extra napkins please",
  items_details: [
    {
      id: "item-1",
      item_id: "item-1",
      item_name: "Burger",
      quantity: 1,
      price: 12.99,
      discount: 0,
      discount_type: "",
      item_status: OrderStatuses.ORDERED,
      modifier_list: [],
    },
    {
      id: "item-2",
      item_id: "item-2",
      item_name: "Fries",
      quantity: 1,
      price: 5.99,
      discount: 0,
      discount_type: "",
      item_status: OrderStatuses.ORDERED,
      modifier_list: [],
    },
    {
      id: "item-3",
      item_id: "item-3",
      item_name: "Soda",
      quantity: 1,
      price: 2.99,
      discount: 0,
      discount_type: "",
      item_status: OrderStatuses.ORDERED,
      modifier_list: [],
    },
  ],
  payment_status: "pending",
  sub_total: 21.97,
  order_discount: 0,
  order_discount_type: "",
  taxable_amount: 21.97,
  brand_vat: 10,
  grand_total: 24.17,
  order_amount: 24.17,
  brand_info: {
    brand_id: "brand-1",
    brand_name: "Restaurant Brand",
    country_code: "US",
    address_line_1: "123 Main St",
    address_line_2: "",
    city: "New York",
    post_code: "10001",
    state: "NY",
    latitude: "40.7128",
    longitude: "-74.0060",
    currency: "USD",
  },
  customer_info: {
    first_name: "John",
    middle_name: "",
    last_name: "Doe",
    phone_code: "+1",
    phone: "555-123-4567",
    email: "john.doe@example.com",
    address_1: "",
    address_2: "",
    landmark: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    longitude: "",
    latitude: "",
  },
  order_date: "2023-05-15",
  bring_all_items_at_same_time: 1,
  order_type: OrderType.DINE,
  kots: [],
  data: {
    order_id: "order-1",
    order_number: "ORD-001",
    table_id: "table-1",
    coupon_id: null,
    order_status: OrderStatuses.ORDERED,
    payment_method: "card",
    delivery_status: "",
    driver_id: "",
    price_type: 1,
    unit_price: 45.99,
    delivery_distance: 0,
    delivery_fee: 0,
    delivery_time: "",
    driver_rating: 0,
    pickup_time: "",
    cash_status: "",
    delivery_type: 0,
    tips: 0,
    cancelled_reason: "",
    cash_deposit: 0,
    order_image: {
      cid: "",
      type: "",
      name: "",
    },
    customer_rating: 0,
    customer_delivery_note: "",
    order_instruction: "Extra napkins please",
    items_details: [
      {
        id: "item-1",
        item_id: "item-1",
        item_name: "Burger",
        quantity: 1,
        price: 12.99,
        discount: 0,
        discount_type: "",
        item_status: OrderStatuses.ORDERED,
        modifier_list: [],
      },
      {
        id: "item-2",
        item_id: "item-2",
        item_name: "Fries",
        quantity: 1,
        price: 5.99,
        discount: 0,
        discount_type: "",
        item_status: OrderStatuses.ORDERED,
        modifier_list: [],
      },
      {
        id: "item-3",
        item_id: "item-3",
        item_name: "Soda",
        quantity: 1,
        price: 2.99,
        discount: 0,
        discount_type: "",
        item_status: OrderStatuses.ORDERED,
        modifier_list: [],
      },
    ],
    payment_status: "pending",
    sub_total: 21.97,
    order_discount: 0,
    order_discount_type: "",
    taxable_amount: 21.97,
    brand_vat: 10,
    grand_total: 24.17,
    order_amount: 24.17,
    brand_info: {
      brand_id: "brand-1",
      brand_name: "Restaurant Brand",
      country_code: "US",
      address_line_1: "123 Main St",
      address_line_2: "",
      city: "New York",
      post_code: "10001",
      state: "NY",
      latitude: "40.7128",
      longitude: "-74.0060",
      currency: "USD",
    },
    customer_info: {
      first_name: "John",
      middle_name: "",
      last_name: "Doe",
      phone_code: "+1",
      phone: "555-123-4567",
      email: "john.doe@example.com",
      address_1: "",
      address_2: "",
      landmark: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
      longitude: "",
      latitude: "",
    },
    order_date: "2023-05-15",
    bring_all_items_at_same_time: 1,
    order_type: OrderType.DINE,
    kots: [],
  },
}
const breakpointColumnsObj = {
  default: 5,
  1536: 5,
  1280: 5,
  1024: 5,
  834: 4,
  640: 1,
}

export default function TablesComponent({
  searchKeyword,
  setMainTabBadgeCounts,
  selectedTable,
  setSelectedTable,
  selectedOrderId,
  onOrderSelected,
}: TablesComponentProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const [filters, setFilters] = useState({
    search: searchKeyword,
    section_ids: "",
  })

  const [sorting, setSorting] = useState<{
    option?: LiveCounterTableSortingOption
    sort_by?: string
    sort_order?: string
  }>({})
  const [tableData, setTableData] = useState<Table[]>(mockTables)
  const [isLoading, setIsLoading] = useState(false)
  const [orderListItems, setOrderListItems] =
    useState<OrderListItem[]>(mockOrderListItems)

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

  useEffect(() => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      search: searchKeyword,
    }))
  }, [searchKeyword])

  useEffect(() => {
    // Update badge counts with mock data
    setMainTabBadgeCounts?.((prevState) => ({
      ...prevState,
      Tables: mockTables.length,
    }))
  }, [])

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
    setCurrentSortOption(value)

    setSorting((prevSorting) => {
      let sort_by: string | undefined
      let sort_order: string | undefined

      if (value === LiveCounterTableSortingOption.TABLE_NAME_ASCENDING_STATUS) {
        sort_by = "id"
        sort_order = "asc"
      } else if (
        value === LiveCounterTableSortingOption.TABLE_NAME_DESCENDING_STATUS
      ) {
        sort_by = "id"
        sort_order = "desc"
      }

      // Sort tables based on the selected option
      let sortedTables = [...mockTables]

      if (value === LiveCounterTableSortingOption.TABLE_NAME_ASCENDING_STATUS) {
        sortedTables.sort((a, b) => a.name.localeCompare(b.name))
      } else if (
        value === LiveCounterTableSortingOption.TABLE_NAME_DESCENDING_STATUS
      ) {
        sortedTables.sort((a, b) => b.name.localeCompare(a.name))
      } else if (value === LiveCounterTableSortingOption.OCCUPIED_FIRST) {
        sortedTables.sort((a, b) => (b.order ? 1 : 0) - (a.order ? 1 : 0))
      } else if (value === LiveCounterTableSortingOption.EMPTY_FIRST) {
        sortedTables.sort((a, b) => (a.order ? 1 : 0) - (b.order ? 1 : 0))
      }

      setTableData(sortedTables)

      return {
        option: value,
        sort_by,
        sort_order,
      }
    })
  }

  useEffect(() => {
    // Filter tables based on search keyword and section
    let filteredTables = [...mockTables]

    if (filters.search) {
      filteredTables = filteredTables.filter(
        (table) =>
          table.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          table.section_name
            ?.toLowerCase()
            .includes(filters.search.toLowerCase())
      )
    }

    if (filters.section_ids) {
      filteredTables = filteredTables.filter(
        (table) => table.section_id === filters.section_ids
      )
    }

    // Apply sorting
    if (
      currentSortOption ===
      LiveCounterTableSortingOption.TABLE_NAME_ASCENDING_STATUS
    ) {
      filteredTables.sort((a, b) => a.name.localeCompare(b.name))
    } else if (
      currentSortOption ===
      LiveCounterTableSortingOption.TABLE_NAME_DESCENDING_STATUS
    ) {
      filteredTables.sort((a, b) => b.name.localeCompare(a.name))
    } else if (
      currentSortOption === LiveCounterTableSortingOption.OCCUPIED_FIRST
    ) {
      filteredTables.sort((a, b) => (b.order ? 1 : 0) - (a.order ? 1 : 0))
    } else if (
      currentSortOption === LiveCounterTableSortingOption.EMPTY_FIRST
    ) {
      filteredTables.sort((a, b) => (a.order ? 1 : 0) - (b.order ? 1 : 0))
    }

    setTableData(filteredTables)
  }, [filters, currentSortOption])

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
      section_ids: sectionId || "",
    }))
  }

  // Mock refetch functions
  const refetch = () => {
    console.log("Refetching tables data")
  }

  const refetchOrders = () => {
    console.log("Refetching orders data")
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
                {mockSections.map((tabItem) => (
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
                selectWidth="w-fit lg:w-[210px]"
                showIconOnMobile
                truncateLength={14}
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
              <div className="masonry-scroll-container mt-2 h-[calc(100vh-200px)] flex-grow overflow-y-auto">
                <Masonry
                  breakpointCols={
                    isSmallIconView
                      ? breakpointSmallViewColumnsObj
                      : breakpointColumnsObj
                  }
                  className="-ml-4 flex w-auto"
                  columnClassName="px-2 bg-clip-padding py-4"
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
                  {/* No need for fetching next page with mock data */}
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
