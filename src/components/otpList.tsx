import { env } from "@/env.mjs"
import { OtpNotification } from "@/types/interfaces/otp-notifications.interface"
import { cn, formatDateTime } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Spinner from "@/components/spinner"
import {
  fontBodyBold,
  fontBodyNormal,
  fontCaptionNormal,
} from "@/styles/typography"

interface OtpListProps {
  otpNotifications: OtpNotification[]
  selectedRiderId: number | null
  handleSelectRider: (rider: OtpNotification) => void
  isFetchingNextPage: boolean
  bottomRef: React.RefObject<HTMLDivElement>
}

export default function OtpList({
  otpNotifications,
  selectedRiderId,
  handleSelectRider,
  isFetchingNextPage,
  bottomRef,
}: OtpListProps) {
  return (
    <main className="masonry-scroll-container w-full overflow-y-scroll">
      <ul>
        {otpNotifications.map((item, index) => (
          <li
            key={`${index}-${item.id}`}
            onClick={() => handleSelectRider(item)}
            className={cn(
              "cursor-pointer border-b border-black-10",
              selectedRiderId === item.id && `bg-white-100`
            )}
          >
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage
                    src={
                      item.picture?.cid
                        ? `${env.NEXT_PUBLIC_PUBLISH_IMAGE_URL}/${item.picture.cid}`
                        : ""
                    }
                  />
                  <AvatarFallback>{item.picture?.name}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col justify-center">
                  <p
                    className={cn(
                      selectedRiderId === item.id
                        ? fontBodyBold
                        : fontBodyNormal
                    )}
                  >
                    {item.name}
                  </p>
                  <p className={cn(fontCaptionNormal, "text-black-60")}>
                    {item.created_at && formatDateTime(item.created_at)}
                  </p>
                </div>
              </div>
              {item?.field_5_value == "collected" ? (
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-semantic-red-100"></span>
                  <p className={cn(fontBodyBold)}>{item.otp_code}</p>
                </div>
              ) : (
                ""
              )}
            </div>
          </li>
        ))}
      </ul>
      <div ref={bottomRef} className="h-fit">
        {isFetchingNextPage && (
          <div className="flex items-center justify-center py-4">
            <Spinner />
          </div>
        )}
      </div>
    </main>
  )
}
