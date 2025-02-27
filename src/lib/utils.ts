import { CreateOrderBody, ItemInfo } from "@/api/orders/create"
import { OrderStatuses } from "@/constants/orderStatuses"
import { OrderType } from "@/constants/orderTypes"
import { CartItemType } from "@/providers/CartProvider"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import {
  CreateOrderInfoInterface,
  EnrichedOrderTypeOption,
  ItemDetails,
} from "@/types/interfaces/order.interface"
import { Table } from "@/types/interfaces/table.interface"
import { toast } from "@/components/ui/use-toast"

import { sequentialItemStatuses } from "../constants/sequentialItemStatus"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getNextStatus = (status: OrderStatuses): OrderStatuses | null => {
  switch (status) {
    case OrderStatuses.ORDERED:
      return OrderStatuses.ACCEPTED
    case OrderStatuses.ACCEPTED:
      return OrderStatuses.READY
    case OrderStatuses.READY:
      return OrderStatuses.SERVED
    default:
      return null
  }
}

export const updateFilters = <T>(
  filters: T,
  key: keyof T,
  value: T[keyof T]
): T => {
  const updatedFilters = { ...filters }

  if (value) {
    updatedFilters[key] = value
  } else {
    delete updatedFilters[key]
  }

  return updatedFilters
}

export function getTimeGapString(timeString: string): string {
  if (!timeString) return "-"
  let dateTimeString = timeString
  if (timeString.split(" ").length < 2) {
    const date = new Date(Date.now())
    const dateString = date.toDateString().split(" ").at(0)
    dateTimeString = `${dateString}` + " " + `${timeString}`
  }

  const inputDate = new Date(dateTimeString)
  const currentDate = new Date()

  if (!(inputDate instanceof Date) || isNaN(inputDate.getTime())) {
    return "Now"
  }

  const diffMs = currentDate.getTime() - inputDate.getTime()
  // Convert to minutes, hours, and days
  const minutes = Math.floor(diffMs / (1000 * 60))
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  // Calculate remaining hours and minutes
  const remainingHours = hours % 24
  const remainingMinutes = minutes % 60

  if (remainingHours <= 0 && remainingMinutes <= 0) {
    return "Now"
  }
  const timeGapString =
    (remainingMinutes > 0 ? `${remainingMinutes} h ` : "") +
    (remainingHours > 0 ? `${remainingHours} mins ` : "") +
    "ago"

  return timeGapString
}

export const extractHoursAndMinutes = (timeString: string) => {
  try {
    if (!timeString) return "--:--"

    // Split date and time
    const [datePart, timePart] = timeString.split(" ")
    if (!timePart) return "--:--"

    // Split time into parts
    const timeParts = timePart.split(":")
    if (timeParts.length < 2) return "--:--"

    return timeParts.slice(0, 2).join(":") // Return hours and minutes
  } catch (error) {
    return "--:--"
  }
}

// console.log(formatDateTime("2024-11-30 10:00:00")); // "30 Nov, 2024 - 10:00"
export const formatDateTime = (dateStr: string, formatStr?: string): string => {
  try {
    const date = new Date(dateStr)
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return "-- ---, ---- - --:--"
    }

    // Function to format time as "HH:mm"
    const formatTime = (): string => {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // 24-hour format
      });
    };

    if (!formatStr || formatStr.trim() === "") {
      // Default format: "dd MMM, yyyy - HH:mm"
      const day = String(date.getDate()).padStart(2, "0");
      const month = date.toLocaleString("en-US", { month: "short" });
      const year = date.getFullYear();
      const time = formatTime();

      return `${day} ${month}, ${year} - ${time}`;
    }

    // Generate formatted date string based on formatStr
    const tokens: { [key: string]: string } = {
      YYYY: date.getFullYear().toString(),
      yyyy: date.getFullYear().toString(),
      YY: date.getFullYear().toString().slice(-2),
      yy: date.getFullYear().toString().slice(-2),
      MMMM: date.toLocaleString("en-US", { month: "long" }),
      MMM: date.toLocaleString("en-US", { month: "short" }),
      MM: String(date.getMonth() + 1).padStart(2, "0"),
      mm: String(date.getMonth() + 1).padStart(2, "0"),
      M: (date.getMonth() + 1).toString(),
      DD: String(date.getDate()).padStart(2, "0"),
      dd: String(date.getDate()).padStart(2, "0"),
      D: date.getDate().toString(),
    };

    let formattedDate = formatStr;

    // Replace date format tokens (e.g., "dd-mm-yyyy")
    Object.keys(tokens).forEach((key) => {
      formattedDate = formattedDate.replace(key, tokens[key]);
    });

    // Append time in "HH:mm" format
    const time = formatTime();
    return `${formattedDate} ${time}`;
  } catch (error) {
    return "-- ---, ---- - --:--"
  }
}

export function capitalizeFirstChar(str: string): string {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhoneNumber = (phone: string): boolean => {
  // Remove all non-digit characters except '+' for international prefix
  const cleanedNumber = phone.replace(/[^\d+]/g, "")

  // Basic rules for international phone numbers:
  // 1. Optional '+' at start
  // 2. Minimum length of 7 digits (excluding '+' and country code)
  // 3. Maximum length of 15 digits (international standard, including country code)
  // 4. If starts with '+', must have at least one digit after
  const phoneRegex = /^\+?[\d]{7,15}$/

  return phoneRegex.test(cleanedNumber)
}

export const prepareOrderBody = ({
  cart,
  selectedTab,
  orderInfo,
  brandId,
}: {
  cart: CartItemType[]
  selectedTab: EnrichedOrderTypeOption | null
  orderInfo: CreateOrderInfoInterface
  brandId: string | null
}): CreateOrderBody | null => {
  const effectiveTable = orderInfo.preSelectedTable || orderInfo.selectedTable

  if (!selectedTab) {
    toast({ title: "Please select an order type." })
    return null
  }

  if (selectedTab.value === OrderType.DINE && !effectiveTable) {
    toast({ title: "Table selection is required for dine-in orders." })
    return null
  }

  if (!cart.length) {
    toast({
      title: "Cart is empty",
    })
    return null
  }

  if (!brandId) {
    console.error("Brand ID is missing")
    return null
  }

  const orderType = orderInfo.preSelectedTable
    ? OrderType.DINE
    : selectedTab.value

  const items: ItemInfo[] = cart.map((cartItem) => ({
    item_id: cartItem.item_id,
    quantity: cartItem.quantity,
    special_instruction: cartItem.special_instruction || "",
    modifier_list: cartItem.modifier_list || [],
  }))

  return {
    brand_id: brandId,
    device_type: "wsp",
    notification_trigger: true,
    items: items,
    order_type: orderType,
    ...(orderType === OrderType.DINE && effectiveTable
      ? { table_id: effectiveTable.id }
      : {}),
    customer_id: orderInfo.isNewCustomer
      ? undefined
      : orderInfo.customerId ?? undefined,
    customer_info: orderInfo.isNewCustomer ? orderInfo.guestInfo : null,
    order_instruction:
      selectedTab.value === OrderType.DELIVERY
        ? orderInfo.orderInstruction || ""
        : "",
    order_discount: null,
    order_flag: "order_confirmed",
    order_discount_type: null,
  }
}

export const calculateOrderStatus = (items: ItemDetails[]): OrderStatuses => {
  // Filter out `CLOSED` items (these should not affect calculations)
  const validItems = items.filter(
    (item) => item.item_status !== OrderStatuses.CLOSED
  )

  // Check if all remaining items are `CANCELED`
  const allCanceled = validItems.every(
    (item) => item.item_status === OrderStatuses.CANCELED
  )
  if (allCanceled) {
    return OrderStatuses.CANCELED
  }

  // Ignore `CANCELED` items for sequential status calculation
  const sequentialItems = validItems.filter(
    (item) => item.item_status !== OrderStatuses.CANCELED
  )

  const lowestItemStatusIndex = Math.min(
    ...sequentialItems.map((item) =>
      sequentialItemStatuses.indexOf(item.item_status as OrderStatuses)
    )
  )

  return sequentialItemStatuses[lowestItemStatusIndex] || OrderStatuses.ORDERED
}

export const updateItemAndRecalculateOrder = (
  itemId: string,
  newItemStatus: OrderStatuses,
  items: ItemDetails[]
): { updatedItems: ItemDetails[]; updatedOrderStatus: OrderStatuses } => {
  // Update the item's status, skip `CLOSED` items
  const updatedItems = items.map((item) =>
    item.id === itemId && item.item_status !== OrderStatuses.CLOSED
      ? { ...item, item_status: newItemStatus }
      : item
  )

  // Recalculate order status
  const updatedOrderStatus = calculateOrderStatus(updatedItems)

  return {
    updatedItems,
    updatedOrderStatus,
  }
}
export function getRelativeTimeFromUtc(orderEditTime: string): string | null {
  try {
    // Step 1: Check if `orderEditTime` is already a relative time string
    if (!orderEditTime || typeof orderEditTime !== "string") {
      console.warn("Invalid or missing orderEditTime:", orderEditTime)
      return null
    }

    // Detect preformatted relative time strings (e.g., "3 weeks ago")
    if (isNaN(Date.parse(orderEditTime))) {
      return null // Return as is
    }

    // Step 2: Parse `orderEditTime` as UTC
    const utcOrderDate = new Date(orderEditTime + "Z")
    if (isNaN(utcOrderDate.getTime())) {
      console.warn("Invalid orderEditTime format:", orderEditTime)
      return null
    }

    // Step 3: Get the current local time
    const now = new Date()
    const diffInSeconds = Math.floor(
      (now.getTime() - utcOrderDate.getTime()) / 1000
    )

    // Step 4: Format the relative time
    if (diffInSeconds < 0) return null
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours} hours ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`
    return `${Math.floor(diffInDays / 365)} years ago`
  } catch (error: any) {
    console.error("Error calculating relative time:", error?.message)
    return "Error calculating time"
  }
}
