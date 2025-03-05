import React from "react"
import { TrashIcon } from "@/icons"
import { useCart } from "@/providers/CartProvider"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/badge"
import { IconButton } from "@/components/iconButton"
import { fontBodyBold, fontCaptionBold } from "@/styles/typography"

interface CartSummaryProps {}

export const CartSummary: React.FC<CartSummaryProps> = ({}) => {
  const { cart, clearCart } = useCart()
  return (
    <>
      {cart.length > 0 && (
        <div className=" flex flex-row items-center justify-between px-2">
          <div className="flex flex-row items-center gap-2">
            <span className={cn(fontCaptionBold, "text-black-60")}>Items</span>
            <Badge
              count={cart.reduce((total, item) => total + item.quantity, 0)}
              variant={"black"}
              className="h-fit w-fit py-1"
            />
          </div>
          <IconButton
            icon={TrashIcon}
            size={"small"}
            iconSize="20"
            className={cn("flex text-semantic-red", fontBodyBold)}
            variant="red"
            isBorder={false}
            onClick={clearCart}
          >
            Remove All
          </IconButton>
        </div>
      )}
    </>
  )
}
