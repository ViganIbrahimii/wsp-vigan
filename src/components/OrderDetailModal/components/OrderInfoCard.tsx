import { OrderStatuses, statusMapping, statusStyles } from "@/constants/orderStatuses"
import { LocationIcon, MailIcon, PersonIcon, PortraitIcon, RotateLeftIcon, ScheduleIcon, TextSnippetIcon } from "@/icons"
import { cn } from "@/lib/utils"
import { fontBodyNormal, fontCaptionBold } from "@/styles/typography"
import { Order, OrderListItem } from "@/types/interfaces/order.interface"
import CustomerLocationDialog from "./customerLocationDialog"
import { formatDateTime } from '../../../lib/utils';
import { useAuth } from "@/providers/AuthProvider/AuthProvider"

interface OrderInfoCardProps {
  order?: OrderListItem
  orderDetail?: Order
  variant: "uesr-name" | "order-number" | "order-status" | "date-time" | "phone-number" | "email-address" | "delivery-address" | "delivery-instruction"
}

export const OrderInfoCard = ({
  order,
  orderDetail,
  variant
}: OrderInfoCardProps) => {
  const {brand} = useAuth()

  return (
    <div className="flex flex-col w-full max-h-[90px] rounded-3 bg-gray-400/20 p-4 gap-2">
      {variant==="uesr-name" && (
        <>
          <div className={cn("flex items-center text-gray-600", fontBodyNormal)}>
            <PersonIcon className="mr-1"/>
            <span className="truncate">User Name</span>
          </div>
          <div className="truncate">{`${order?.customer?.first_name ?? ""} ${order?.customer?.middle_name ?? ""} ${order?.customer?.last_name ?? ""}`}</div>
        </>
      )}
      {variant==="order-number" && (
        <>
          <div className={cn("flex items-center text-gray-600 truncate", fontBodyNormal)}>
            # Order Number
          </div>
          <div className="flex w-full justify-between">
            <div>{order?.order_number}</div>
            {
              order?.payment_status === "paid" &&
              <div className={cn("flex rounded-xl bg-green-300 text-green-700 px-2 py-1", fontCaptionBold)}>
                Paid
              </div>
           }
          </div>
        </>
      )}
      {variant==="order-status" && (
        <>
          <div className={cn("flex items-center text-gray-600", fontBodyNormal)}>
            <RotateLeftIcon className="mr-1" />
            <span className="truncate">Status</span>
          </div>
          <div className={
            cn(
              "w-fit px-2 rounded-3 text-white",
              fontBodyNormal,
              statusStyles[order?.order_status as OrderStatuses]?.backgroundColor
            )
          }>
            {statusMapping[order?.order_status ?? ""]}
          </div>
        </>
      )}
      {variant==="date-time" && (
        <>
          <div className={cn("flex items-center text-gray-600 ", fontBodyNormal)}>
            <ScheduleIcon className="mr-1"/>
            <span className="truncate">Date & Time</span>
          </div>
          <div className="truncate">{formatDateTime(orderDetail?.order_date!, brand?.brand_setting.customization_and_preference.date_format.name!)}</div>
        </>
      )}
      {variant==="phone-number" && (
        <>
          <div className={cn("flex w-full items-center text-gray-600", fontBodyNormal)}>
            <PortraitIcon className="mr-1"/>
            <span className="truncate">Phone Number</span>
          </div>
          <div className="truncate">{order?.customer_phone_number}</div>
        </>
      )}
      {variant==="email-address" && (
        <>
          <div className={cn("flex items-center text-gray-600", fontBodyNormal)}>
            <MailIcon className="mr-1"/>
            <span className="truncate">Email Address</span>
          </div>
          <div className="truncate"></div>
        </>
      )}
      {variant==="delivery-address" && (
        <>
          <div className={cn("flex items-center text-gray-600", fontBodyNormal)}>
            <LocationIcon className="mr-1"/> 
            <span className="truncate mr-2">Address</span>
            <CustomerLocationDialog 
              lat={Number(orderDetail?.customer_info.latitude ?? 0)}
              lng={Number(orderDetail?.customer_info.longitude ?? 0)}
            />
          </div>
          <div className="truncate">{order?.customer_delivery_address || "No Address"}</div>
        </>
      )}
      {variant==="delivery-instruction" && (
        <>
          <div className={cn("flex items-center text-gray-600", fontBodyNormal)}>
            <TextSnippetIcon className="mr-1"/> 
            <span className="truncate">Delivery Instruction</span>
          </div>
          <div className="truncate">{orderDetail?.customer_delivery_note}</div>
        </>
      )}
    </div>
  )
}