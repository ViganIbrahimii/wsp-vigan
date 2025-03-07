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
// Temporarily comment out the import until the file is properly created
// import DeliveryDetailDialog from "@/components/OrderDetailModal/DeliveryDetailModal"
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
    date: "2023-05-15T18:30:00",
    amount: 43,
    currency: "$",
    order_status: OrderStatuses.ORDERED,
    payment_status: "pending",
    customer_delivery_address: "123 Main St, Apt 4B, New York, NY 10001",
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
        price: 19,
        main_item_image: null,
      },
      {
        id: "item-d2",
        name: "Chicken Wings",
        item_instruction: "Spicy",
        item_status: OrderStatuses.ORDERED,
        item_quantity: 1,
        price: 13,
        main_item_image: null,
      },
      {
        id: "item-d3",
        name: "Soda",
        item_instruction: null,
        item_status: OrderStatuses.ORDERED,
        item_quantity: 2,
        price: 3,
        main_item_image: null,
      },
    ],
    brand_details: {
      id: "brand-1",
      name: "Restaurant Brand",
      location: "New York",
      currency: "$",
    },
    delivery_fee: 6,
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
  } as OrderListItem & {
    // Additional data for DeliveryDetailModal
    items_details: Array<{
      id: string
      item_id: string
      item_name: string
      quantity: number
      price: number
      discount: number
      discount_type: string
      item_status: string
      modifier_list: Array<{
        modifier_id: string
        modifier_name: string
        modifier_option_id: string
        modifier_option_name: string
        modifier_option_price: string
      }>
    }>
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
    amount: 33,
    currency: "$",
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
        price: 25,
        main_item_image: null,
      },
      {
        id: "item-d5",
        name: "Miso Soup",
        item_instruction: null,
        item_status: OrderStatuses.ACCEPTED,
        item_quantity: 2,
        price: 4,
        main_item_image: null,
      },
    ],
    brand_details: {
      id: "brand-1",
      name: "Restaurant Brand",
      location: "New York",
      currency: "$",
    },
    delivery_fee: 5,
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
    amount: 57,
    currency: "$",
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
        price: 15,
        main_item_image: null,
      },
      {
        id: "item-d7",
        name: "Fries",
        item_instruction: null,
        item_status: OrderStatuses.READY,
        item_quantity: 2,
        price: 6,
        main_item_image: null,
      },
      {
        id: "item-d8",
        name: "Milkshake",
        item_instruction: "Chocolate",
        item_status: OrderStatuses.READY,
        item_quantity: 2,
        price: 5,
        main_item_image: null,
      },
      {
        id: "item-d9",
        name: "Salad",
        item_instruction: "Dressing on the side",
        item_status: OrderStatuses.READY,
        item_quantity: 1,
        price: 10,
        main_item_image: null,
      },
    ],
    brand_details: {
      id: "brand-1",
      name: "Restaurant Brand",
      location: "New York",
      currency: "$",
    },
    delivery_fee: 7,
    cancelled_reason: null,
    delivery_status: "out_for_delivery",
    customer_rating: 0,
    delivery_time: "10-15 min",
    delivery_partner_name: "SpeedDelivery",
    driver_id: "driver-3",
    driver_name: "Sam Driver",
    driver_image: null,
    driver_phone_code: "+1",
    driver_phone_number: "555-444-3333",
    bring_all_items_at_same_time: 1,
    order_type: OrderType.DELIVERY,
  },
  {
    order_number: "DEL-004",
    customer: {
      id: "cust-204",
      first_name: "Sarah",
      last_name: "Johnson",
      middle_name: null,
    },
    table: null,
    items_count: 1,
    date: "2023-05-15",
    amount: 19,
    currency: "$",
    order_status: OrderStatuses.DELIVERED,
    payment_status: "paid",
    customer_delivery_address: "321 Elm Street",
    customer_apartment: "2C",
    customer_note: "Doorman building",
    customer_phone_code: "+1",
    customer_phone_number: "555-999-8888",
    attachment: null,
    order_instruction: "",
    order_id: "delivery-4",
    order_edit_time: "2023-05-15 10:30:00",
    time: "10:30 AM",
    item_details: [
      {
        id: "item-d10",
        name: "Breakfast Sandwich",
        item_instruction: "Extra bacon",
        item_status: OrderStatuses.DELIVERED,
        item_quantity: 1,
        price: 15,
        main_item_image: null,
      },
    ],
    brand_details: {
      id: "brand-1",
      name: "Restaurant Brand",
      location: "New York",
      currency: "$",
    },
    delivery_fee: 4,
    cancelled_reason: null,
    delivery_status: "delivered",
    customer_rating: 5,
    delivery_time: "Delivered at 11:05 AM",
    delivery_partner_name: "SpeedDelivery",
    driver_id: "driver-4",
    driver_name: "Lisa Driver",
    driver_image: null,
    driver_phone_code: "+1",
    driver_phone_number: "555-111-2222",
    bring_all_items_at_same_time: 1,
    order_type: OrderType.DELIVERY,
  },
]

// Add the items_details data to the first mock order
;(mockDeliveryOrders[0] as any).items_details = [
  {
    id: "item-d1",
    item_id: "item-d1",
    item_name: "Pepperoni Pizza",
    quantity: 1,
    price: 18.99,
    discount: 0,
    discount_type: "flat",
    item_status: OrderStatuses.ORDERED,
    modifier_list: [
      {
        modifier_id: "mod-1",
        modifier_name: "Size",
        modifier_option_id: "opt-1",
        modifier_option_name: "Large",
        modifier_option_price: "0",
      },
      {
        modifier_id: "mod-2",
        modifier_name: "Crust",
        modifier_option_id: "opt-2",
        modifier_option_name: "Thin",
        modifier_option_price: "0",
      },
    ],
  },
  {
    id: "item-d2",
    item_id: "item-d2",
    item_name: "Chicken Wings",
    quantity: 1,
    price: 12.99,
    discount: 0,
    discount_type: "flat",
    item_status: OrderStatuses.ORDERED,
    modifier_list: [
      {
        modifier_id: "mod-3",
        modifier_name: "Sauce",
        modifier_option_id: "opt-3",
        modifier_option_name: "Buffalo",
        modifier_option_price: "0",
      },
    ],
  },
  {
    id: "item-d3",
    item_id: "item-d3",
    item_name: "Soda",
    quantity: 2,
    price: 2.99,
    discount: 0,
    discount_type: "flat",
    item_status: OrderStatuses.ORDERED,
    modifier_list: [],
  },
]

// Add additional properties needed by DeliveryDetailModal
;(mockDeliveryOrders[0] as any).sub_total = 37.96
;(mockDeliveryOrders[0] as any).tax = 3.02
;(mockDeliveryOrders[0] as any).total = 46.97
;(mockDeliveryOrders[0] as any).order_discount = 0
;(mockDeliveryOrders[0] as any).order_discount_type = "flat"
;(mockDeliveryOrders[0] as any).payment_method = "Credit Card"
;(mockDeliveryOrders[0] as any).latitude = "40.7128"
;(mockDeliveryOrders[0] as any).longitude = "-74.0060"
;(mockDeliveryOrders[0] as any).customer_info = {
  first_name: mockDeliveryOrders[0].customer?.first_name || "",
  middle_name: mockDeliveryOrders[0].customer?.middle_name || "",
  last_name: mockDeliveryOrders[0].customer?.last_name || "",
  phone_code: mockDeliveryOrders[0].customer_phone_code || "",
  phone: mockDeliveryOrders[0].customer_phone_number || "",
  email: `${mockDeliveryOrders[0].customer?.first_name?.toLowerCase() || ""}.${mockDeliveryOrders[0].customer?.last_name?.toLowerCase() || ""}@example.com`,
  address_1: mockDeliveryOrders[0].customer_delivery_address || "",
  address_2: mockDeliveryOrders[0].customer_apartment || "",
  landmark: "",
  city: "New York",
  state: "NY",
  country: "USA",
  pincode: "10001",
  longitude: "-74.0060",
  latitude: "40.7128",
}
;(mockDeliveryOrders[0] as any).brand_info = {
  brand_id: "brand-1",
  brand_name: "Restaurant Brand",
  country_code: "US",
  address_line_1: "123 Restaurant St",
  address_line_2: "",
  city: "New York",
  post_code: "10001",
  state: "NY",
  latitude: "40.7128",
  longitude: "-74.0060",
  currency: mockDeliveryOrders[0].currency,
}

// Add additional properties for OrderPayInfoPanel
;(mockDeliveryOrders[0] as any).brand_vat = (mockDeliveryOrders[0] as any).tax
;(mockDeliveryOrders[0] as any).grand_total = (
  mockDeliveryOrders[0] as any
).total
;(mockDeliveryOrders[0] as any).order_amount = (
  mockDeliveryOrders[0] as any
).total

// Function to enhance mock orders with detailed properties
const enhanceMockOrder = (order: OrderListItem) => {
  // Create items_details from item_details
  ;(order as any).items_details =
    order.item_details?.map((item) => ({
      id: item.id,
      item_id: item.id,
      item_name: item.name,
      quantity: item.item_quantity,
      price: Math.round(item.price), // Round to whole number
      discount: 0,
      discount_type: "flat",
      item_status: item.item_status,
      modifier_list: [], // Default empty modifier list
    })) || []

  // Calculate subtotal with rounded values
  const subtotal = Math.round(
    order.item_details?.reduce(
      (sum, item) => sum + Math.round(item.price) * item.item_quantity,
      0
    ) || order.amount
  )

  // Add additional properties with rounded values
  ;(order as any).sub_total = subtotal
  ;(order as any).tax = Math.round(subtotal * 0.08) // Assuming 8% tax, rounded
  ;(order as any).total =
    subtotal + (order as any).tax + Math.round(order.delivery_fee || 0)
  ;(order as any).order_discount = 0
  ;(order as any).order_discount_type = "flat"
  ;(order as any).payment_method =
    order.payment_status === "paid" ? "Credit Card" : "Cash on Delivery"

  // Add additional properties for OrderPayInfoPanel
  ;(order as any).brand_vat = (order as any).tax
  ;(order as any).grand_total = (order as any).total
  ;(order as any).order_amount = (order as any).total

  // Extract city, state from address if possible
  let city = "New York"
  let state = "NY"
  let zipcode = "10001"

  const addressParts = order.customer_delivery_address?.split(",") || []
  if (addressParts.length > 1) {
    const lastPart = addressParts[addressParts.length - 1].trim()
    const stateZipMatch = lastPart.match(/([A-Z]{2})\s+(\d{5})/)
    if (stateZipMatch) {
      state = stateZipMatch[1]
      zipcode = stateZipMatch[2]
    }

    if (addressParts.length > 2) {
      city = addressParts[addressParts.length - 2].trim()
    }
  }

  // Add customer info
  ;(order as any).customer_info = {
    first_name: order.customer?.first_name || "",
    middle_name: order.customer?.middle_name || "",
    last_name: order.customer?.last_name || "",
    phone_code: order.customer_phone_code || "",
    phone: order.customer_phone_number || "",
    email: `${order.customer?.first_name?.toLowerCase() || ""}.${order.customer?.last_name?.toLowerCase() || ""}@example.com`,
    address_1: order.customer_delivery_address || "",
    address_2: order.customer_apartment || "",
    landmark: "",
    city: city,
    state: state,
    country: "USA",
    pincode: zipcode,
    longitude: "-74.0060", // Default NYC coordinates
    latitude: "40.7128",
  }

  // Add brand info
  ;(order as any).brand_info = {
    brand_id: order.brand_details?.id || "brand-1",
    brand_name: order.brand_details?.name || "Restaurant Brand",
    country_code: "US",
    address_line_1: "123 Restaurant St",
    address_line_2: "",
    city: "New York",
    post_code: "10001",
    state: "NY",
    latitude: "40.7128",
    longitude: "-74.0060",
    currency: order.currency || "$",
  }

  return order
}

// Enhance all orders except the first one (which we already enhanced manually)
for (let i = 1; i < mockDeliveryOrders.length; i++) {
  enhanceMockOrder(mockDeliveryOrders[i])
}

// Add some modifiers to the second order (DEL-002) to make it more interesting
if (mockDeliveryOrders[1] && (mockDeliveryOrders[1] as any).items_details) {
  // Find the Sushi Combo item
  const sushiItem = (mockDeliveryOrders[1] as any).items_details.find(
    (item: any) => item.item_name === "Sushi Combo"
  )

  if (sushiItem) {
    sushiItem.modifier_list = [
      {
        modifier_id: "mod-4",
        modifier_name: "Sushi Type",
        modifier_option_id: "opt-4",
        modifier_option_name: "Assorted",
        modifier_option_price: "0",
      },
      {
        modifier_id: "mod-5",
        modifier_name: "Spicy Level",
        modifier_option_id: "opt-5",
        modifier_option_name: "Medium",
        modifier_option_price: "0",
      },
      {
        modifier_id: "mod-6",
        modifier_name: "Add-on",
        modifier_option_id: "opt-6",
        modifier_option_name: "Extra Wasabi",
        modifier_option_price: "1.50",
      },
    ]
  }

  // Find the Miso Soup item
  const misoItem = (mockDeliveryOrders[1] as any).items_details.find(
    (item: any) => item.item_name === "Miso Soup"
  )

  if (misoItem) {
    misoItem.modifier_list = [
      {
        modifier_id: "mod-7",
        modifier_name: "Size",
        modifier_option_id: "opt-7",
        modifier_option_name: "Regular",
        modifier_option_price: "0",
      },
    ]
  }
}

// Add some modifiers to the third order (DEL-003) to make it more interesting
if (mockDeliveryOrders[2] && (mockDeliveryOrders[2] as any).items_details) {
  // Find the Burger item
  const burgerItem = (mockDeliveryOrders[2] as any).items_details.find(
    (item: any) => item.item_name === "Burger"
  )

  if (burgerItem) {
    burgerItem.modifier_list = [
      {
        modifier_id: "mod-8",
        modifier_name: "Cheese",
        modifier_option_id: "opt-8",
        modifier_option_name: "Cheddar",
        modifier_option_price: "1.00",
      },
      {
        modifier_id: "mod-9",
        modifier_name: "Doneness",
        modifier_option_id: "opt-9",
        modifier_option_name: "Medium",
        modifier_option_price: "0",
      },
      {
        modifier_id: "mod-10",
        modifier_name: "Extras",
        modifier_option_id: "opt-10",
        modifier_option_name: "Bacon",
        modifier_option_price: "2.50",
      },
    ]

    // Add a discount to the burger
    burgerItem.discount = 3.0
    burgerItem.discount_type = "flat"
  }

  // Find the Milkshake item
  const milkshakeItem = (mockDeliveryOrders[2] as any).items_details.find(
    (item: any) => item.item_name === "Milkshake"
  )

  if (milkshakeItem) {
    milkshakeItem.modifier_list = [
      {
        modifier_id: "mod-11",
        modifier_name: "Flavor",
        modifier_option_id: "opt-11",
        modifier_option_name: "Chocolate",
        modifier_option_price: "0",
      },
      {
        modifier_id: "mod-12",
        modifier_name: "Topping",
        modifier_option_id: "opt-12",
        modifier_option_name: "Whipped Cream",
        modifier_option_price: "0.75",
      },
    ]
  }

  // Add an order discount to the third order
  ;(mockDeliveryOrders[2] as any).order_discount = 5.0
  ;(mockDeliveryOrders[2] as any).order_discount_type = "flat"
}

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
            {/* Temporarily comment out the DeliveryDetailDialog until the file is properly created */}
            {/* <DeliveryDetailDialog
              item={selectedItem}
              onClose={() => {
                setSelectedItem(undefined)
              }}
              onUpdate={() => refetch()}
            /> */}
            <div>{/* Placeholder for CartProvider */}</div>
          </CartProvider>
        </>
      )}
    </div>
  )
}
