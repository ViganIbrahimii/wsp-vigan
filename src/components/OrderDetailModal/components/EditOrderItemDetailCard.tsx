import { cn } from "@/lib/utils"
import { MainButtonProps } from "@/components/mainButton"
import {
  fontBodyBold,
  fontBodyNormal,
  fontButtonLarge,
  fontButtonSmall,
  fontCaptionBold,
  fontCaptionNormal,
  fontHeadline,
  fontTitle2,
  fontTitle3,
} from "@/styles/typography"
import { ItemDetails, ItemsDetails, OrderDetail, OrderListItem } from "@/types/interfaces/order.interface"
import { IconButton } from "@/components/iconButton"
import { AddIcon, ChevronRightIcon, PersonIcon, RemoveIcon } from "@/icons"
import IconWrapper from "@/components/iconWrapper"
import { MouseEventHandler } from "react"
import { CartItemType, useCart } from "@/providers/CartProvider"

interface EditOrderItemDetailCardProps {
  item: ItemsDetails
  orderDetailItem?: ItemsDetails
  onClickMinus: ({item}:{item: ItemsDetails}) => void
  onClickPlus: ({item}:{item: ItemsDetails}) => void
  isLoading?: boolean
}

const statusStyles: {
  [key: string]: {
    textColor: string
    bulletColor: string
    buttonVariant: MainButtonProps["variant"]
    borderColor?: string
    borderStyle?: string
  }
} = {
  Ordered: {
    textColor: "text-status-ordered",
    bulletColor: "bg-status-ordered",
    buttonVariant: "accept",
  },
  Ready: {
    textColor: "text-status-ready",
    bulletColor: "bg-status-ready",
    buttonVariant: "ready",
    borderColor: "border-black",
    borderStyle: "border-dashed",
  },
  Canceled: {
    textColor: "text-status-ordered",
    bulletColor: "bg-status-ordered",
    buttonVariant: "accept",
    borderColor: "border-white",
  },
  Served: {
    textColor: "text-status-ordered",
    bulletColor: "bg-status-ordered",
    buttonVariant: "accept",
    borderColor: "border-white",
  }
}

const statusMapping: { [key: string]: keyof typeof statusStyles } = {
  ordered: "Ordered",
  accepted: "Ready",
  advanced: "Ordered",
  ready: "Ready",
  closed: "Canceled",
  rejected: "Canceled",
  canceled: "Canceled",
  do_not_accept: "Canceled",
  served: "Served",
};

// Create the final statusStyles object
const finalStatusStyles = Object.entries(statusMapping).reduce((acc, [status, mappedStatus]) => {
  acc[status] = statusStyles[mappedStatus];
  return acc;
}, { ...statusStyles });

export const EditOrderItemDetailCard = ({
  item,
  onClickMinus,
  onClickPlus,
  isLoading,
}: EditOrderItemDetailCardProps) => {
  const { increaseQuantity, decreaseQuantity } = useCart()
  const { modifier_list } = item
  return (
    <div className="flex w-full flex-col gap-4 rounded-3 border p-4">
      <div className="flex w-full flex-row items-center justify-between gap-4">
        <span
          className={cn(
            fontBodyBold,
            "line-clamp-2 inline-block max-w-[36ch] overflow-hidden text-ellipsis whitespace-normal"
          )}
        >
          {item.item_name ?? "No Name"}
        </span>
        <div className="flex flex-row items-center justify-center gap-2">
          <IconButton
            icon={RemoveIcon}
            variant={"secondary"}
            size={"small"}
            disabled={isLoading}
            onClick={() => {
              decreaseQuantity(item.item_id, modifier_list)
              onClickMinus?.({item})
            }}
          />
          <span className="min-w-[30px] text-center">
            {item.quantity || 0}
          </span>
          <IconButton
            icon={AddIcon}
            variant={"secondary"}
            size={"small"}
            disabled={isLoading}
            onClick={() => {
              increaseQuantity(item.item_id, modifier_list)
              onClickPlus?.({item})
            }}
          />
        </div>
      </div>
      {modifier_list && modifier_list?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {modifier_list?.map((modifier, index) => (
            <p
              key={`${modifier.modifier_id}-${index}`}
              className={cn(
                "flex items-center gap-2 rounded-5 bg-black-5 px-2 py-1",
                fontCaptionNormal
              )}
            >
              <span className="capitalize text-black-40">
                {modifier.modifier_name}:{" "}
              </span>
              <span className="capitalize text-black-100">
                {modifier.modifier_option_name}
              </span>
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
