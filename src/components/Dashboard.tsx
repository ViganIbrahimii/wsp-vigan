"use client"

import { useState } from "react"
import {
  AssignmentTurnedInIcon,
  CancelIcon,
  CheckCircleIcon,
  LabProfileIcon,
  MonetizationIcon,
  ReceiptLongIcon,
} from "@/icons"

import { cn } from "@/lib/utils"
import { CompletedOrdersChart } from "@/components/Dashboard/completedOrdersChart"
import { PaymentDistribution } from "@/components/Dashboard/paymentDistribution"
import { PopularItems } from "@/components/Dashboard/popularItems"
import IconWrapper from "@/components/iconWrapper"
import { CustomSelect } from "@/components/select"
import { Tab } from "@/components/tab"
import {
  fontBodyBold,
  fontBodyNormal,
  fontTitle1,
  fontTitle2,
} from "@/styles/typography"

// Mock data for the dashboard
const rangeOptions = [
  { value: "Today", label: "Today" },
  { value: "Weekly", label: "Weekly" },
  { value: "Monthly", label: "Monthly" },
  { value: "Yearly", label: "Yearly" },
]

const frequencyMap = {
  today: "daily",
  yesterday: "daily",
  last7days: "daily",
  last30days: "daily",
  thisMonth: "daily",
  lastMonth: "daily",
  thisYear: "monthly",
} as const

// Mock data for statistics
const mockStatistics = {
  revenue: "$10,500.00",
  allOrders: 250,
  paidOrders: 180,
  acceptedOrders: 200,
  completedOrders: 170,
  canceledOrders: 30,
}

// Mock data for popular items
const mockPopularItems = [
  { name: "Chicken Burger", orderCount: 45 },
  { name: "Cheese Pizza", orderCount: 38 },
  { name: "Veggie Wrap", orderCount: 32 },
  { name: "French Fries", orderCount: 30 },
  { name: "Chocolate Shake", orderCount: 28 },
  { name: "Caesar Salad", orderCount: 25 },
  { name: "Grilled Salmon", orderCount: 22 },
  { name: "Pasta Carbonara", orderCount: 20 },
  { name: "Steak Sandwich", orderCount: 18 },
  { name: "Ice Cream Sundae", orderCount: 15 },
]

// Mock data for completed orders chart
const mockCompletedOrders = [
  { frequency: "Jan", order_count: 120 },
  { frequency: "Feb", order_count: 150 },
  { frequency: "Mar", order_count: 180 },
  { frequency: "Apr", order_count: 210 },
  { frequency: "May", order_count: 240 },
  { frequency: "Jun", order_count: 270 },
  { frequency: "Jul", order_count: 300 },
  { frequency: "Aug", order_count: 330 },
  { frequency: "Sep", order_count: 360 },
  { frequency: "Oct", order_count: 390 },
  { frequency: "Nov", order_count: 420 },
  { frequency: "Dec", order_count: 450 },
]

// Mock data for payment distribution
const mockPaymentDistribution = [
  { payment_gateway: "Credit Card", sum: 5500, currency: "$" },
  { payment_gateway: "Cash", sum: 2800, currency: "$" },
  { payment_gateway: "Mobile Payment", sum: 1200, currency: "$" },
  { payment_gateway: "Gift Card", sum: 600, currency: "$" },
  { payment_gateway: "Online Transfer", sum: 400, currency: "$" },
]

// Helper function to get date range based on selected option
const getDateRange = (selectedRange: string) => {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const last7Days = new Date(today)
  last7Days.setDate(last7Days.getDate() - 7)

  const last30Days = new Date(today)
  last30Days.setDate(last30Days.getDate() - 30)

  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

  const firstDayOfLastMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    1
  )
  const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)

  const firstDayOfYear = new Date(today.getFullYear(), 0, 1)
  const lastDayOfYear = new Date(today.getFullYear(), 11, 31)

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
  }

  switch (selectedRange) {
    case "today":
      return { start_date: formatDate(today), end_date: formatDate(today) }
    case "yesterday":
      return {
        start_date: formatDate(yesterday),
        end_date: formatDate(yesterday),
      }
    case "last7days":
      return { start_date: formatDate(last7Days), end_date: formatDate(today) }
    case "last30days":
      return { start_date: formatDate(last30Days), end_date: formatDate(today) }
    case "thisMonth":
      return {
        start_date: formatDate(firstDayOfMonth),
        end_date: formatDate(lastDayOfMonth),
      }
    case "lastMonth":
      return {
        start_date: formatDate(firstDayOfLastMonth),
        end_date: formatDate(lastDayOfLastMonth),
      }
    case "thisYear":
      return {
        start_date: formatDate(firstDayOfYear),
        end_date: formatDate(lastDayOfYear),
      }
    default:
      return { start_date: formatDate(today), end_date: formatDate(today) }
  }
}

// Helper function to get chart date range
const getChartDateRange = getDateRange

export default function Dashboard() {
  const [selectedRange, setSelectedRange] = useState<string>(
    rangeOptions[0].value
  )
  const [currentStatus, setCurrentStatus] = useState<string>("OPEN")

  const handleStatusChange = (status: string) => {
    setCurrentStatus(status)
  }

  return (
    <div className="h-screen w-full px-4">
      {/* Header Section */}
      <div className="flex w-full items-center justify-between py-7">
        <h1 className={cn(fontTitle1, "text-black-100")}>Dashboard</h1>
        <CustomSelect
          options={rangeOptions}
          sortByText="Range:"
          onOptionSelect={(option) => setSelectedRange(option.value)}
          defaultValue={rangeOptions[0]}
          menuPosition="left"
          selectWidth="w-48"
        />
      </div>

      {/* Restaurant Status Section */}
      <div className="my-2 hidden min-h-[96px] w-full items-center justify-start gap-3 rounded-3 bg-black-5 p-4 lg:flex">
        <h2 className={cn(fontTitle2, "mr-4 text-black-100")}>
          Restaurant Status
        </h2>
        <Tab
          variant="primary"
          isActive={currentStatus === "OPEN"}
          className={cn(
            currentStatus === "OPEN" && "bg-semantic-green-100",
            "px-6"
          )}
          onClick={() => handleStatusChange("OPEN")}
        >
          OPEN
        </Tab>
        <Tab
          variant="primary"
          isActive={currentStatus === "BUSY"}
          className={cn(
            currentStatus === "BUSY" && "bg-semantic-yellow-100 text-black",
            "px-6"
          )}
          onClick={() => handleStatusChange("BUSY")}
        >
          BUSY
        </Tab>
        <Tab
          variant="primary"
          isActive={currentStatus === "CLOSED"}
          className={cn(
            currentStatus === "CLOSED" && "bg-semantic-red-100",
            "px-6"
          )}
          onClick={() => handleStatusChange("CLOSED")}
        >
          CLOSED
        </Tab>
      </div>

      {/* Statistics Overview Section */}
      <div className="grid min-w-[196px] grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6 ">
        {/* Revenue Card */}
        <div className=" h-[160px] w-[194px] rounded-3 bg-brand p-4 text-white-100 lg:h-[190px] lg:w-[173px] xl:w-[214px]">
          <div className="flex h-full flex-col">
            <div className="mb-2">
              <IconWrapper
                Component={MonetizationIcon}
                size="24"
                color="white100"
              />
            </div>
            <div className="mt-auto">
              <p className={cn(fontBodyBold, "text-white-100")}>Revenue</p>
              <p className={cn(fontTitle2, "text-white-100")}>
                {mockStatistics.revenue}
              </p>
            </div>
          </div>
        </div>

        {/* All Orders Card */}
        <div className="h-[160px] w-[194px] rounded-3 bg-white-100  p-4 lg:h-[190px] lg:w-[173px] xl:w-[214px]">
          <div className="flex h-full flex-col">
            <div className="mb-2">
              <IconWrapper Component={LabProfileIcon} size="24" />
            </div>
            <div className="mt-auto">
              <p className={cn(fontBodyBold, "text-black-100")}>All Orders</p>
              <p className={cn(fontTitle2, "text-black-100")}>
                {mockStatistics.allOrders}
              </p>
            </div>
          </div>
        </div>

        {/* Paid Orders Card */}
        <div className=" h-[160px] w-[194px] rounded-3 bg-white-100 p-4 lg:h-[190px] lg:w-[173px] xl:w-[214px]">
          <div className="flex h-full flex-col">
            <div className="mb-2">
              <IconWrapper Component={ReceiptLongIcon} size="24" />
            </div>
            <div className="mt-auto">
              <p className={cn(fontBodyBold, "text-black-100")}>Paid Orders</p>
              <p className={cn(fontTitle2, "text-black-100")}>
                {mockStatistics.paidOrders}
              </p>
            </div>
          </div>
        </div>

        {/* Accepted Orders Card */}
        <div className=" h-[160px] w-[194px] rounded-3 bg-white-100 p-4 lg:h-[190px] lg:w-[173px] xl:w-[214px]">
          <div className="flex h-full flex-col">
            <div className="mb-2">
              <IconWrapper Component={AssignmentTurnedInIcon} size="24" />
            </div>
            <div className="mt-auto">
              <p className={cn(fontBodyBold, "text-black-100")}>Accepted</p>
              <p className={cn(fontTitle2, "text-black-100")}>
                {mockStatistics.acceptedOrders}
              </p>
            </div>
          </div>
        </div>

        {/* Completed Orders Card */}
        <div className=" h-[160px] w-[194px] rounded-3 bg-white-100 p-4 lg:h-[190px] lg:w-[173px] xl:w-[214px]">
          <div className="flex h-full flex-col">
            <div className="mb-2">
              <IconWrapper Component={CheckCircleIcon} size="24" />
            </div>
            <div className="mt-auto">
              <p className={cn(fontBodyBold, "text-black-100")}>Completed</p>
              <p className={cn(fontTitle2, "text-black-100")}>
                {mockStatistics.completedOrders}
              </p>
            </div>
          </div>
        </div>

        {/* Canceled Orders Card */}
        <div className=" h-[160px] w-[194px]  rounded-3 bg-white-100 p-4 lg:h-[190px] lg:w-[173px] xl:w-[214px]">
          <div className="flex h-full flex-col">
            <div className="mb-2">
              <IconWrapper Component={CancelIcon} size="24" color="red100" />
            </div>
            <div className="mt-auto">
              <p className={cn(fontBodyBold, "text-black-100")}>Canceled</p>
              <p className={cn(fontTitle2, "text-black-100")}>
                {mockStatistics.canceledOrders}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Reports Section */}
      <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-1 lg:grid-cols-3">
        {/* Popular Items */}
        <div className="col-span-1">
          <PopularItems
            startDate={getDateRange(selectedRange).start_date}
            endDate={getDateRange(selectedRange).end_date}
          />
        </div>

        <div className="col-span-1 flex flex-col gap-4 lg:col-span-2">
          {/* Completed Orders Chart */}
          <CompletedOrdersChart
            startDate={getChartDateRange(selectedRange).start_date}
            endDate={getChartDateRange(selectedRange).end_date}
            frequency={
              frequencyMap[selectedRange as keyof typeof frequencyMap] ||
              "daily"
            }
          />

          {/* Payment Distribution Chart */}
          <PaymentDistribution
            startDate={getDateRange(selectedRange).start_date}
            endDate={getDateRange(selectedRange).end_date}
          />
        </div>
      </div>
    </div>
  )
}
