import {
  OrderStatuses,
  statusMapping,
  statusStyles,
} from "@/constants/orderStatuses"
import {
  AddIcon,
  PersonIcon,
  PrintIcon,
  ReceiptLongIcon,
  RotateLeftIcon,
  ScheduleIcon,
} from "@/icons"
import { useAuth } from "@/providers/AuthProvider/AuthProvider"
import { QueryObserverResult, RefetchOptions } from "@tanstack/query-core"
import { AxiosResponse } from "axios"
import { Order } from "@/types/interfaces/order.interface"
import { useGetKots } from "@/lib/hooks/queries/kot/useGetKots"
import { cn } from "@/lib/utils"
import { IconButton } from "@/components/iconButton"
import IconWrapper from "@/components/iconWrapper"
import { MainButton } from "@/components/mainButton"
import Spinner from "@/components/spinner"
import {
  fontBodyBold,
  fontBodyNormal,
  fontCaptionBold,
  fontCaptionNormal,
} from "@/styles/typography"
import CloseOrderDialog from "./closeOrderDialog"
import PayBillDialog from "./payBillDialog"
import AddOrderDiscountDialog from "./addOrderDiscountDialog"

interface OrderPayInfoPanelProps {
  order?: Order
  isLoading?: boolean
  onCloseOrder?: () => void
  onPayOrder?: () => void
}

export const OrderPayInfoPanel = ({
  order,
  isLoading,
  onCloseOrder,
  onPayOrder,
}: OrderPayInfoPanelProps) => {
  const { brandId } = useAuth()
  const { data: kotsData, isLoading: isKotsLoading } = useGetKots({
    brand_id: brandId!,
    page_size: 1,
    page_limit: 20,
  })
  const currency = order?.brand_info.currency || ""

  return (
    <div className="flex h-fit w-full flex-col gap-2 rounded-3 bg-white p-4 shadow-xl">
      <div className="mb-2 flex w-full flex-col gap-3">
        <div className="flex w-full flex-row justify-between">
          <span className={cn("text-gray-400", fontCaptionNormal)}>
            Subtotal
          </span>
          <span
            className={cn(fontCaptionBold, isLoading ? "hidden" : "")}
          >{`${currency} ${order?.sub_total}`}</span>
        </div>
        <div className="flex w-full flex-row justify-between">
          <span className={cn("text-gray-400", fontCaptionNormal)}>
            Order Discount
          </span>
          <span
            className={cn(
              "text-green-600",
              fontCaptionBold,
              isLoading ? "hidden" : ""
            )}
          >{order?.order_discount_type === "flat" ? `${currency} ${order?.order_discount || 0}` : `${order?.order_discount || 0} %`}</span>
        </div>
        <div className="flex w-full flex-row justify-between">
          <span className={cn("text-gray-400", fontCaptionNormal)}>
            Taxable Amount
          </span>
          <span
            className={cn(
              "text-semantic-red",
              fontCaptionBold,
              isLoading ? "hidden" : ""
            )}
          >{`${currency} ${order?.taxable_amount || 0}`}</span>
        </div>
        <div className="flex w-full flex-row justify-between">
          <span className={cn("text-gray-400", fontCaptionNormal)}>
            {"Tax (VAT 3%)"}
          </span>
          <span
            className={cn(
              "text-semantic-red",
              fontCaptionBold,
              isLoading ? "hidden" : ""
            )}
          >{`${currency} ${order?.brand_vat || 0}`}</span>
        </div>
        <div className="flex w-full flex-row justify-between">
          <span className={cn("text-gray-400", fontCaptionNormal)}>
            Grand Total
          </span>
          <span
            className={cn(fontCaptionBold, isLoading ? "hidden" : "")}
          >{`${currency} ${order?.grand_total}`}</span>
        </div>
        <AddOrderDiscountDialog 
          order={order!}
          onDiscountUpdate={onPayOrder}
          isLoading={isLoading}
        />
      </div>
      <div className="mb-2 flex w-full flex-col gap-3">
        <div className="flex w-full flex-row justify-between">
          <span className={cn(fontBodyNormal)}>Total</span>
          <span
            className={cn(fontBodyNormal, isLoading ? "hidden" : "")}
          >{`${currency} ${order?.order_amount}`}</span>
        </div>
      </div>
      <div className="mb-2 flex w-full flex-col gap-3">
        <div className="flex w-full flex-row justify-between gap-4 border-b-2 pb-6 pt-2">
          <IconButton
            variant={"primaryOutline"}
            disabled={isLoading}
            icon={PrintIcon}
          />
          <div className="flex w-full flex-grow">
            {order?.payment_status !== "paid" ? (
              <PayBillDialog
                isLoading={isLoading}
                order={order!}
                currency={currency || ""}
                payableAmount={order?.order_amount ?? 0}
                onCloseOrder={onCloseOrder}
                onPayOrder={onPayOrder}
              />
            ) : (
              <CloseOrderDialog
                isLoading={isLoading}
                order={order!}
                onCloseOrder={onCloseOrder}
              />
            )}
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col gap-3">
        <span className={cn("text-gray-400", fontCaptionBold)}>KOTs</span>
        <div className={cn("flex flex-wrap gap-2", isKotsLoading?"hidden":"")}>
          {kotsData?.data?.data?.map((kotItem, index)=>(
            <IconButton key={index} icon={ReceiptLongIcon} variant={"secondaryLabel"} size={"small"} >{kotItem.kot_name}</IconButton>
          ))}
        </div>
      </div>
    </div>
  )
}
