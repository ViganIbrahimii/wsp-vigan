"use client"

import React, { useState } from "react"
import { CloseIcon, TrashIcon } from "@/icons"

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
import { MainButton } from "@/components/mainButton"
import { Order } from "@/types/interfaces/order.interface"
import { useUpdateOrder } from "@/lib/hooks/mutations/orders/useUpdateOrder"
import { QueryObserverResult, RefetchOptions } from "@tanstack/query-core"
import { AxiosResponse } from "axios"
import { GetOrdersResponse } from "@/api/orders"

interface CloseOrderDialogProps {
  order: Order
  isLoading?: boolean
  onCloseOrder?: ()=>void
}

const CloseOrderDialog: React.FC<CloseOrderDialogProps> = ({
  order,
  isLoading,
  onCloseOrder
}) => {
  const [open, setOpen] = useState(false);
  const { mutate: updateOrder, isPending, error } = useUpdateOrder()

  const orderId = order?.order_id;

  const handleCloseOrder = () => {
    updateOrder(
      { 
        order_id: orderId,
        order_status: "closed"
      },
      {
        onSuccess: (data) => {
          onCloseOrder?.()
          toast({
            title: `Order ${order?.order_number}: Closed succssfully.`,
          })
          setOpen(false);  // Close the dialog 
        },
        onError: (error) => {
          console.log("Close Order error", error)
          toast({
            title: `Order ${order?.order_number}: Close error. ${error.message}`,
          })
        },
      }
    )
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="w-full">
        <MainButton variant={"primary"} disabled={isLoading} className="w-full">Close Order</MainButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Close Order</DialogTitle>
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
          Are you sure to close this order?
        </DialogDescription>
        <MainButton
          variant="canceled"
          className="w-full"
          onClick={() => handleCloseOrder()}
        >
          Close Order
        </MainButton>
      </DialogContent>
    </Dialog>
  )
}

export default CloseOrderDialog
