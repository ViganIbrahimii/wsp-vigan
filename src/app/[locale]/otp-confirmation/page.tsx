"use client"

import { useCallback, useRef, useState } from "react"

import { OtpNotification } from "@/types/interfaces/otp-notifications.interface"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/badge"
import ConfirmationDialog from "@/components/confirmationDialog"
import OtpList from "@/components/otpList"
import RiderDetails from "@/components/riderDetails"
import SearchInput from "@/components/searchInput"
import { fontBodyNormal, fontHeadline, fontTitle1 } from "@/styles/typography"

// Mock data with 20 records
const mockOtpNotifications: OtpNotification[] = [
  {
    id: 1,
    account_id: 1,
    interface_id: "1",
    service_provider_id: 1,
    otp_mode_id: 1,
    name: "John Doe",
    picture: {
      cid: "1234",
      type: "image/jpeg",
      name: "JD",
    },
    phone_number: "+1234567890",
    email: "john@example.com",
    otp_code: "674951",
    status: "sent",
    created_at: "2024-02-09T10:24:00Z",
    expiry_at: null,
    ip_address: "192.168.1.1",
    user_agent: "Mozilla",
    entity_1_id: "1",
    entity_1_type: "rider",
    entity_2_id: "1",
    entity_2_type: "order",
    field_1_key: "previous_order_amount",
    field_1_value: "86.60",
    field_2_key: "previous_order_id",
    field_2_value: "12345",
    field_3_key: "previous_brand_id",
    field_3_value: "1",
    field_4_key: "current_order_id",
    field_4_value: "12346",
    field_5_key: "cash_status",
    field_5_value: "collected",
    field_6_key: "brand_order_number",
    field_6_value: "ORD-001",
    previous_brand_currency: "$",
  },
  // Add 19 more similar records with different values
  // ... (I'll add more records below)
]

// Add 19 more mock records
for (let i = 2; i <= 20; i++) {
  mockOtpNotifications.push({
    ...mockOtpNotifications[0],
    id: i,
    name: `Rider ${i}`,
    otp_code: Math.floor(100000 + Math.random() * 900000).toString(),
    created_at: new Date(Date.now() - i * 1000 * 60 * 5).toISOString(), // 5 minutes apart
    field_1_value: (Math.random() * 100).toFixed(2),
    field_6_value: `ORD-${i.toString().padStart(3, "0")}`,
  })
}

export default function OtpConfirmationPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRiderId, setSelectedRiderId] = useState<number | null>(null)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const filteredNotifications = mockOtpNotifications.filter((notification) =>
    notification.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedRider = mockOtpNotifications.find(
    (notification) => notification.id === selectedRiderId
  )

  const handleSelectRider = useCallback((rider: OtpNotification) => {
    setSelectedRiderId(rider.id)
  }, [])

  const handleConfirmChange = () => {
    setIsPending(true)
    // Simulate API call
    setTimeout(() => {
      setIsPending(false)
      setIsDialogOpen(false)
      // You would typically update the status here
    }, 1000)
  }

  if (mockOtpNotifications.length === 0) {
    return (
      <div className="flex h-screen flex-col px-4">
        <h1 className={cn(fontTitle1, "py-7")}>OTP Confirmation</h1>
        <div
          className={cn(
            "flex h-full items-center justify-center rounded-5 bg-white-60 px-2"
          )}
        >
          <p className={cn(fontBodyNormal, "text-black-100")}>
            There is no OTP confirmation yet!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col px-4">
      <h1 className={cn(fontTitle1, "py-7")}>OTP Confirmation</h1>
      <div className="mb-4 flex h-full overflow-hidden rounded-5 border border-black-10 bg-white-60">
        {/* Left Section */}
        <div className="flex h-full w-[320px] flex-col overflow-hidden border-r border-black-10 bg-transparent">
          <div className="flex items-center justify-between p-4">
            {!isSearchFocused && (
              <div className="flex items-center gap-2">
                <h2 className={cn(fontHeadline, "font-medium text-black-100")}>
                  Pending
                </h2>
                <Badge
                  count={filteredNotifications.length}
                  variant="black"
                  size="small"
                />
              </div>
            )}
            <SearchInput
              query={searchQuery}
              setQuery={setSearchQuery}
              onFocusChange={setIsSearchFocused}
              className="w-full"
              alwaysOpen={isSearchFocused}
            />
          </div>
          <OtpList
            otpNotifications={filteredNotifications}
            selectedRiderId={selectedRiderId}
            handleSelectRider={handleSelectRider}
            isFetchingNextPage={false}
            bottomRef={bottomRef}
          />
        </div>

        {/* Right Section */}
        <div className="flex flex-1 items-center justify-center bg-transparent">
          {filteredNotifications.length === 0 ? (
            <p className={cn(fontBodyNormal, "rounded-5 bg-white-100 px-2")}>
              No OTP confirmations found for the search!
            </p>
          ) : !selectedRider ? (
            <p className={cn(fontBodyNormal, "rounded-5 bg-white-100 px-2")}>
              Select a rider to see info
            </p>
          ) : (
            <RiderDetails
              selectedRider={selectedRider}
              setSelectedRiderId={setSelectedRiderId}
              setIsDialogOpen={setIsDialogOpen}
              isPending={isPending}
            />
          )}
        </div>
      </div>

      <ConfirmationDialog
        title="Collect Confirmation"
        description={
          <>
            Do you confirm the receipt of the sum of{" "}
            <span className={cn(fontBodyNormal, "text-black-100")}>
              {selectedRider?.previous_brand_currency}
              {selectedRider?.field_1_value}
            </span>{" "}
            from{" "}
            <span className={cn(fontBodyNormal, "text-black-100")}>
              {selectedRider?.name}
            </span>
            ?
          </>
        }
        confirmText="Confirm"
        isOpen={isDialogOpen}
        onCancel={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmChange}
        isPending={isPending}
      />
    </div>
  )
}
