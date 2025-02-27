"use client"

import React, { useState } from "react"
import { AddIcon, CloseIcon, RemoveIcon, TrashIcon } from "@/icons"

import { ItemDetails } from "@/types/interfaces/order.interface"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog"
import { IconButton } from "@/components/iconButton"
import { MainButton } from "@/components/mainButton"
import {
  fontButtonSmall,
  fontCaptionNormal,
  fontHeadline,
} from "@/styles/typography"

interface CancelItemDialogProps {
  item: ItemDetails
  handleCancelItem: (cancelQuantity: number) => void
  isUpdateItemPending: boolean
}

const CancelItemDialog: React.FC<CancelItemDialogProps> = ({
  item,
  handleCancelItem,
  isUpdateItemPending,
}) => {
  const [cancelQuantity, setCancelQuantity] = useState(1) // Default to canceling 1
  const [isOpen, setIsOpen] = useState(false)

  const openDialog = () => setIsOpen(true)

  const incrementQuantity = () => {
    // Only increment if not at max quantity
    if (cancelQuantity < item.item_quantity) {
      setCancelQuantity((prev) => prev + 1)
    }
  }

  const decrementQuantity = () => {
    // Only decrement if not at min quantity
    if (cancelQuantity > 1) {
      setCancelQuantity((prev) => prev - 1)
    }
  }

  const handleConfirmCancel = () => {
    handleCancelItem(cancelQuantity)
    setIsOpen(false) // Close the dialog after cancel
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Cancel Button to Open Dialog */}
      <MainButton
        variant="canceled"
        icon={TrashIcon}
        iconSize={"20"}
        iconPosition={"left"}
        className={cn("h-[28px] px-3", fontButtonSmall)}
        onClick={openDialog}
        disabled={isUpdateItemPending}
      >
        Cancel
      </MainButton>

      {/* Dialog Content */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Items</DialogTitle>
          <DialogClose asChild>
            <IconButton
              variant="primaryWhite"
              size="large"
              icon={CloseIcon}
              iconSize="24"
              isActive={true}
            />
          </DialogClose>
        </DialogHeader>
        <DialogDescription>
          Choose how many you want to cancel.
        </DialogDescription>

        {/* Item Details Section */}
        <div className="flex flex-col justify-center gap-2 rounded-5 border-2 border-black-10 p-3">
          <p className={cn("", fontHeadline)}>{item.name}</p>
          <p className={cn("text-black-60", fontCaptionNormal)}>
            {item.item_instruction || "No special instructions."}
          </p>

          {/* Quantity Adjustment Section */}
          {item.item_quantity > 1 && (
            <div className="flex items-center gap-4">
              {/* Decrement Button */}
              <IconButton
                variant="secondary"
                size="large"
                icon={RemoveIcon}
                iconSize="20"
                onClick={decrementQuantity}
                disabled={cancelQuantity === 1} // Disable if at minimum quantity
              />

              {/* Quantity Display */}
              <p className={cn("text-black-100", fontHeadline)}>
                {cancelQuantity}
              </p>

              {/* Increment Button */}
              <IconButton
                variant="secondary"
                size="large"
                icon={AddIcon}
                iconSize="20"
                onClick={incrementQuantity}
                disabled={cancelQuantity === item.item_quantity} // Disable if at maximum quantity
              />
            </div>
          )}
        </div>

        {/* Confirm Cancel Button */}
        <MainButton
          variant="canceled"
          className="w-full"
          onClick={handleConfirmCancel}
          disabled={isUpdateItemPending}
        >
          {isUpdateItemPending ? "Processing" : "Cancel Item"}
        </MainButton>
      </DialogContent>
    </Dialog>
  )
}

export default CancelItemDialog
