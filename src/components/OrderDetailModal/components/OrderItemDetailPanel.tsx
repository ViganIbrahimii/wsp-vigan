import {
  OrderStatuses,
  statusMapping,
  statusStyles,
} from "@/constants/orderStatuses"
import { AddIcon, PersonIcon, RotateLeftIcon, ScheduleIcon } from "@/icons"

import { Order } from "@/types/interfaces/order.interface"
import { cn } from "@/lib/utils"
import { IconButton } from "@/components/iconButton"
import { MainButton } from "@/components/mainButton"
import Spinner from "@/components/spinner"
import {
  fontBodyBold,
  fontBodyNormal,
  fontCaptionBold,
  fontCaptionNormal,
} from "@/styles/typography"

import AddDiscountDialog from "./addDiscountDialog"

interface OrderItemDetailPanelProps {
  order?: Order
  isLoading?: boolean
  onDiscountUpdate?: () => void
}

export const OrderItemDetailPanel = ({
  order,
  isLoading,
  onDiscountUpdate,
}: OrderItemDetailPanelProps) => {
  const currency = order?.brand_info.currency || ""

  return (
    <div className="z-auto flex h-fit w-full flex-col gap-2 rounded-3 bg-white p-4 shadow-xl">
      <div className="flex w-full flex-row gap-2 rounded-3 bg-black/5 px-4 py-2 text-gray-600">
        <div className={cn("w-[30%]", fontCaptionBold)}>Items Summary</div>
        <div className={cn("w-[15%]", fontCaptionBold)}>QTY</div>
        <div className={cn("w-[20%]", fontCaptionBold)}>Price</div>
        <div className={cn("w-[20%]", fontCaptionBold)}>Total Price</div>
        <div className={cn("w-[15%] text-right", fontCaptionBold)}>
          Discount
        </div>
      </div>
      <div className="h-full w-full">
        {isLoading ? (
          <div className="flex h-[10vh] w-full items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <div
            className={cn(
              "subwindow-scroll-container flex w-full flex-col gap-2 overflow-auto",
              order?.order_type === "delivery"
                ? "max-h-[calc(100vh-380px)]"
                : "max-h-[calc(100vh-280px)]"
            )}
          >
            {order?.items_details?.map((item, index) => {
              const isValidDiscount =
                Boolean(item?.discount) && item?.discount > 0
              const discountDisplayString = `${item.discount_type === "flat" ? currency : "%"} ${item?.discount}`
              return (
                <div
                  className="flex w-full flex-row gap-2 border-b py-4"
                  key={index}
                >
                  <div className={cn("flex w-[30%] flex-col", fontBodyBold)}>
                    <div>{item.item_name ?? "No Name"}</div>
                    <div className={cn("text-gray-600", fontCaptionNormal)}>
                      {item.modifier_list?.length > 0
                        ? item.modifier_list
                            .map(
                              (modifier) =>
                                `${modifier.modifier_name}: ${modifier.modifier_option_name}`
                            )
                            .join(", ")
                        : ""}
                    </div>
                  </div>
                  <div className={cn("w-[15%]", fontBodyBold)}>
                    {item.quantity}
                  </div>
                  <div
                    className={cn("w-[20%]", fontBodyBold)}
                  >{`${currency} ${item.price}`}</div>
                  <div
                    className={cn("w-[20%]", fontBodyBold)}
                  >{`${currency} ${(item.quantity * item.price).toFixed(2)}`}</div>
                  <div
                    className={cn(
                      "flex w-[15%] flex-row justify-end pr-1 text-right",
                      fontBodyBold
                    )}
                  >
                    {item?.discount > 0 && (
                      <div
                        className={cn(
                          "mr-4 truncate whitespace-nowrap text-green-700",
                          fontBodyBold
                        )}
                      >
                        {discountDisplayString}
                      </div>
                    )}
                    <AddDiscountDialog
                      orderId={order?.order_id}
                      orderItem={item}
                      currency={currency}
                      itemIndex={index}
                      key={index}
                      isEditDialog={isValidDiscount}
                      onDiscountUpdate={onDiscountUpdate}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
