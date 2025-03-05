"use client"

import React, { useState } from "react"
import { CloseIcon, TrashIcon } from "@/icons"

import { OrderListItem } from "@/types/interfaces/order.interface"
import { useDeleteOrder } from "@/lib/hooks/mutations/orders/useDeleteOrder"
import { useMultipleDeleteOrder } from "@/lib/hooks/mutations/orders/useMultipleDeleteOrder"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dialog"
import { IconButton } from "@/components/iconButton"
import IconWrapper from "@/components/iconWrapper"
import { MainButton } from "@/components/mainButton"
import { fontBodyBold } from "@/styles/typography"

import { multipleDeleteOrder } from "../../../api/orders/multiple-delete"
import { TableDetailOrderItemCard } from "./TableDetailOrderItemCard"

interface CancelAllItemDialogProps {
  disabled?: boolean
  onCancelAllItem?: () => void
}

const CancelAllItemDialog: React.FC<CancelAllItemDialogProps> = ({
  disabled,
  onCancelAllItem,
}) => {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger disabled={disabled}>
        <div
          className={cn(
            "flex cursor-pointer flex-row",
            disabled ? "text-black/40" : "text-semantic-red",
            fontBodyBold
          )}
        >
          <IconWrapper
            Component={TrashIcon}
            color={!disabled ? "red100" : "black40"}
          />
          Remove all
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove all items</DialogTitle>
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
          Are you sure you want to remove all items in this order? This action
          cannot be undone.
        </DialogDescription>
        <MainButton
          variant="canceled"
          className="w-full"
          onClick={() => {
            onCancelAllItem?.()
            setOpen(false)
          }}
        >
          Confirm
        </MainButton>
      </DialogContent>
    </Dialog>
  )
}

export default CancelAllItemDialog
