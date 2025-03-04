"use client"

import React, { useState } from "react"

import { cn, formatDateTime } from "@/lib/utils"
import { Badge } from "@/components/badge"
import { MainButton } from "@/components/mainButton"
import RadioButton from "@/components/radioButton"
import SearchInput from "@/components/searchInput"
import { CustomSelect } from "@/components/select"
import ToggleSwitch from "@/components/toggleSwitch"
import {
  fontBodyNormal,
  fontCaptionBold,
  fontCaptionNormal,
  fontHeadline,
  fontTitle1,
} from "@/styles/typography"

// Define notification filter options
const notificationFilterOptions = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
]

// Define notification types for the mock data
type NotificationType = {
  id: string
  description: string
  date: string
  time: string
  isRead: boolean
}

// Mock data for notifications (15 records)
const mockNotifications: NotificationType[] = [
  {
    id: "1",
    description: "New order #12345 has been placed",
    date: "2024-03-01 11:32:00",
    time: "11:32",
    isRead: false,
  },
  {
    id: "2",
    description: "Order #12340 has been completed",
    date: "2024-03-01 10:15:00",
    time: "10:15",
    isRead: true,
  },
  {
    id: "3",
    description: "Customer feedback received for order #12335",
    date: "2024-02-29 15:45:00",
    time: "15:45",
    isRead: false,
  },
  {
    id: "4",
    description: "Payment received for order #12330",
    date: "2024-02-29 14:20:00",
    time: "14:20",
    isRead: true,
  },
  {
    id: "5",
    description: "New reservation made for Table #5",
    date: "2024-02-28 09:10:00",
    time: "09:10",
    isRead: false,
  },
  {
    id: "6",
    description: "Inventory alert: Low stock for item #789",
    date: "2024-02-28 08:30:00",
    time: "08:30",
    isRead: true,
  },
  {
    id: "7",
    description: "Staff schedule updated for next week",
    date: "2024-02-27 16:45:00",
    time: "16:45",
    isRead: false,
  },
  {
    id: "8",
    description: "System maintenance scheduled for tonight",
    date: "2024-02-27 14:00:00",
    time: "14:00",
    isRead: true,
  },
  {
    id: "9",
    description: "New menu item added: Spicy Chicken Burger",
    date: "2024-02-26 11:20:00",
    time: "11:20",
    isRead: false,
  },
  {
    id: "10",
    description: "Customer complaint for order #12320",
    date: "2024-02-26 10:05:00",
    time: "10:05",
    isRead: true,
  },
  {
    id: "11",
    description: "Daily sales report is now available",
    date: "2024-02-25 18:30:00",
    time: "18:30",
    isRead: false,
  },
  {
    id: "12",
    description: "New employee onboarding completed",
    date: "2024-02-25 15:15:00",
    time: "15:15",
    isRead: true,
  },
  {
    id: "13",
    description: "Software update available for POS system",
    date: "2024-02-24 13:40:00",
    time: "13:40",
    isRead: false,
  },
  {
    id: "14",
    description: "Weekly staff meeting reminder",
    date: "2024-02-24 09:00:00",
    time: "09:00",
    isRead: true,
  },
  {
    id: "15",
    description: "Promotion campaign started: Summer Special",
    date: "2024-02-23 12:25:00",
    time: "12:25",
    isRead: false,
  },
]

const Notification: React.FC = () => {
  // State for search query and filter
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState({ value: "all", label: "All" })

  // State for notification settings
  const [notificationMethod, setNotificationMethod] = useState("banner-sound")
  const [playRepeatedly, setPlayRepeatedly] = useState(false)
  const [tableNotifications, setTableNotifications] = useState(true)
  const [orderNotifications, setOrderNotifications] = useState(true)

  // Filter notifications based on search query and filter
  const filteredNotifications = mockNotifications.filter((notification) => {
    const matchesSearch = notification.description
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesFilter =
      filter.value === "all" ||
      (filter.value === "unread" && !notification.isRead)

    return matchesSearch && matchesFilter
  })

  // Count unread notifications
  const unreadCount = mockNotifications.filter(
    (notification) => !notification.isRead
  ).length

  return (
    <div className="h-screen w-full">
      {/* Header Section */}
      <header className="h-[88px] w-full py-6 pl-4">
        <h1 className={cn(fontTitle1, "text-black-100")}>Notifications</h1>
      </header>

      {/* Main Content Layout */}
      <div className="flex w-full flex-row px-4">
        {/* Left List Container */}
        <div className="flex-1 rounded-3 bg-white-60 p-4">
          {/* Header Section */}
          <div className="mb-[22px] flex items-center justify-between">
            <div className="flex items-center">
              <span className={cn(fontHeadline, "mr-2 text-black-100")}>
                Unread
              </span>
              <Badge count={unreadCount} variant="black" size="small" />
            </div>
            <div className="flex items-center gap-2">
              <CustomSelect
                options={notificationFilterOptions}
                sortByText="Sort by"
                onOptionSelect={setFilter}
                defaultValue={filter}
                selectWidth="w-[163px]"
              />
              <SearchInput
                query={searchQuery}
                setQuery={setSearchQuery}
                width="w-64"
              />
            </div>
          </div>

          {/* Notification Table */}
          <div className="overflow-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-black-5">
                  <th
                    className={cn(
                      fontCaptionBold,
                      "rounded-l-3 px-4 py-2 text-left text-black-60"
                    )}
                  >
                    Description
                  </th>
                  <th
                    className={cn(
                      fontCaptionBold,
                      "px-4 py-2 text-left text-black-60"
                    )}
                  >
                    Date
                  </th>
                  <th
                    className={cn(
                      fontCaptionBold,
                      "rounded-r-3 px-4 py-2 text-left text-black-60"
                    )}
                  >
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="masonry-scroll-container">
                {filteredNotifications.map((notification) => (
                  <tr key={notification.id}>
                    <td
                      className={cn(
                        fontBodyNormal,
                        notification.isRead
                          ? "text-black-100"
                          : "text-black-40",
                        "border-b border-black-10 px-4 py-2"
                      )}
                    >
                      {notification.description}
                    </td>
                    <td
                      className={cn(
                        fontCaptionNormal,
                        notification.isRead ? "text-black-60" : "text-black-40",
                        "border-b border-black-10 px-4 py-2"
                      )}
                    >
                      {
                        formatDateTime(notification.date, "DD MMM, YYYY").split(
                          " - "
                        )[0]
                      }
                    </td>
                    <td
                      className={cn(
                        fontCaptionNormal,
                        notification.isRead ? "text-black-60" : "text-black-40",
                        "border-b border-black-10 px-4 py-2"
                      )}
                    >
                      {notification.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Load More Button */}
          <div className="mt-4 hidden lg:block">
            <MainButton variant="primary" onClick={() => {}}>
              Load More
            </MainButton>
          </div>
        </div>

        {/* Right Settings Container */}
        <div className="ml-4 flex h-fit w-[297px] flex-col gap-[22px] rounded-3 bg-white-60 p-4 lg:w-[360px]">
          {/* Header */}
          <h2 className={cn(fontHeadline, "text-black-100")}>Setting</h2>

          {/* Radio Button Group */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className={cn(fontBodyNormal, "text-black-100")}>
                Banner and Sound
              </span>
              <RadioButton
                selected={notificationMethod === "banner-sound"}
                onClick={() => setNotificationMethod("banner-sound")}
                size="large"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className={cn(fontBodyNormal, "text-black-100")}>
                Banner only
              </span>
              <RadioButton
                selected={notificationMethod === "banner-only"}
                onClick={() => setNotificationMethod("banner-only")}
                size="large"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className={cn(fontBodyNormal, "text-black-100")}>
                Sound only
              </span>
              <RadioButton
                selected={notificationMethod === "sound-only"}
                onClick={() => setNotificationMethod("sound-only")}
                size="large"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className={cn(fontBodyNormal, "text-black-100")}>None</span>
              <RadioButton
                selected={notificationMethod === "none"}
                onClick={() => setNotificationMethod("none")}
                size="large"
              />
            </div>
          </div>

          {/* Divider */}
          <hr className="border-black-10" />

          {/* Toggle Switches */}
          <div className="flex flex-col gap-4">
            <ToggleSwitch
              label="Play Repeatedly"
              checked={playRepeatedly}
              onChange={setPlayRepeatedly}
            />
            <ToggleSwitch
              label="Table Notifications"
              checked={tableNotifications}
              onChange={setTableNotifications}
            />
            <ToggleSwitch
              label="Order Notifications"
              checked={orderNotifications}
              onChange={setOrderNotifications}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notification
