import { CheckIcon } from "@/icons"

import { env } from "@/env.mjs"
import { OtpNotification } from "@/types/interfaces/otp-notifications.interface"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import IconWrapper from "@/components/iconWrapper"
import { MainButton } from "@/components/mainButton"
import {
  fontBodyBold,
  fontBodyLinkNormal,
  fontBodyNormal,
  fontButtonLarge,
  fontTitle1,
  fontTitle3,
} from "@/styles/typography"

interface RiderDetailsProps {
  selectedRider: OtpNotification
  setSelectedRiderId: (id: number | null) => void
  setIsDialogOpen: (open: boolean) => void
  isPending?: boolean
}

export default function RiderDetails({
  selectedRider,
  setSelectedRiderId,
  setIsDialogOpen,
  isPending,
}: RiderDetailsProps) {
  const cashStatus = selectedRider.field_5_value

  const isCashStatusCollected = cashStatus == "collected"
  const isOtpStatusSent = selectedRider.status === "sent"
  const orderNumber = selectedRider.field_6_value

  return (
    <div className="lg:min-w-8/12 relative h-full w-full bg-white-100">
      <p
        className={cn(
          fontBodyLinkNormal,
          "absolute left-5 top-5 cursor-pointer font-medium underline"
        )}
        onClick={() => setSelectedRiderId(null)}
      >
        Close
      </p>
      <div className="flex h-full w-full flex-col items-center justify-center gap-10 p-4">
        <div className="flex flex-col items-center justify-center gap-2">
          <Avatar className="h-[60px] w-[60px] lg:h-[120px] lg:w-[120px]">
            <AvatarImage
              src={
                selectedRider?.picture?.cid
                  ? `${env.NEXT_PUBLIC_PUBLISH_IMAGE_URL}/${selectedRider?.picture?.cid}`
                  : ""
              }
            />
            <AvatarFallback>{selectedRider.picture?.name}</AvatarFallback>
          </Avatar>
          <h1 className={cn(fontTitle3)}>{selectedRider.name}</h1>
          <p className={cn(fontBodyNormal, "text-black-60")}>
            ID: {selectedRider.id}
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          {isCashStatusCollected ? (
            <>
              {isOtpStatusSent ? (
                <>
                  <p className={cn(fontTitle1, "text-brand")}>
                    {selectedRider?.otp_code || 0}
                  </p>
                  <p className={cn(fontBodyNormal, "text-black-100")}>
                    To accept cash transfers, the rider must enter this {""}
                    {selectedRider?.otp_code.length}-digit code in their app
                    before you can accept the transaction.
                  </p>
                </>
              ) : (
                <>
                  <IconWrapper
                    Component={CheckIcon}
                    size={"24"}
                    color="green100"
                  />
                  <p className={cn(fontTitle1, "text-black-40")}>
                    {selectedRider?.otp_code || 0}
                  </p>
                  <p className={cn(fontBodyNormal, "text-black-100")}>
                    The OTP code has been entered correctly. Now, collect the
                    cash and click on the{" "}
                    <span className={cn(fontBodyBold)}>
                      &quot;Accept Cash Transfer&quot;
                    </span>{" "}
                    button.
                  </p>
                </>
              )}
            </>
          ) : (
            <>
              <p className={cn(fontBodyNormal, "text-black-100")}>
                Order Number
              </p>
              <p className={cn(fontTitle1, "text-black-40")}>
                {orderNumber && `#${orderNumber}`}
              </p>
            </>
          )}
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className={cn(fontBodyNormal, "text-black-100")}>
            The amount you should receive:
          </p>
          <p className={cn(fontTitle1, "text-black-100")}>
            {selectedRider?.previous_brand_currency}
            {selectedRider?.field_1_value}
          </p>

          {isCashStatusCollected ? (
            <MainButton
              variant="primary"
              disabled={isOtpStatusSent || isPending}
              onClick={() => {
                if (!isOtpStatusSent) setIsDialogOpen(true)
              }}
            >
              {isPending ? "Processing" : "Accept Cash Transfer"}
            </MainButton>
          ) : (
            <div
              className={cn(
                "inline-flex h-[48px] w-fit items-center justify-center rounded-6 border border-semantic-green px-8",
                fontButtonLarge
              )}
            >
              <IconWrapper
                Component={CheckIcon}
                size={"24"}
                color="green100"
                className="mr-2"
              />
              <p className="text-semantic-green">Cash Transfer Confirmed</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
