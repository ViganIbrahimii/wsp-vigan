import { AddIcon, RemoveIcon } from "@/icons"
import { CartItemType, useCart } from "@/providers/CartProvider"

import { cn } from "@/lib/utils"
import { IconButton } from "@/components/iconButton"
import { fontBodyBold, fontCaptionNormal } from "@/styles/typography"

interface CartItemCardProps {
  index: number
  cartItem: CartItemType
}

export const CartItemCard = ({ cartItem }: CartItemCardProps) => {
  const { increaseQuantity, decreaseQuantity } = useCart()
  const { modifier_list } = cartItem
  return (
    <div className="flex w-full flex-col gap-4 rounded-3 border p-4">
      <div className="flex w-full flex-row items-center justify-between gap-4">
        <span
          className={cn(
            fontBodyBold,
            "line-clamp-2 inline-block max-w-[36ch] overflow-hidden text-ellipsis whitespace-normal"
          )}
        >
          {cartItem.item_name ?? "No Name"}
        </span>
        <div className="flex flex-row items-center justify-center gap-2">
          <IconButton
            icon={RemoveIcon}
            variant={"secondary"}
            size={"small"}
            onClick={() => decreaseQuantity(cartItem.item_id, modifier_list)}
          />
          <span className="min-w-[30px] text-center">
            {cartItem.quantity || 0}
          </span>
          <IconButton
            icon={AddIcon}
            variant={"secondary"}
            size={"small"}
            onClick={() => increaseQuantity(cartItem.item_id, modifier_list)}
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
