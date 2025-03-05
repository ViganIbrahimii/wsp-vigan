"use client"

import React, { useState } from "react"
import { CloseIcon, TrashIcon } from "@/icons"

import { useDeleteOrder } from "@/lib/hooks/mutations/orders/useDeleteOrder"
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
import { OrderListItem } from "@/types/interfaces/order.interface"
import { TableDetailOrderItemCard } from "./TableDetailOrderItemCard"
import { multipleDeleteOrder } from '../../../api/orders/multiple-delete';
import { useMultipleDeleteOrder } from "@/lib/hooks/mutations/orders/useMultipleDeleteOrder"

interface CancelOrderDialogProps {
  orderListItem: OrderListItem
  onCancelOrder?: ()=>void
}

const CancelOrderDialog: React.FC<CancelOrderDialogProps> = ({
  orderListItem,
  onCancelOrder
}) => {
  const [open, setOpen] = useState(false);
  const { mutate: deleteOrder, isPending, error } = useDeleteOrder()
  // const {mutate: multipleDeleteOrder, isPending, error} = useMultipleDeleteOrder()

  const orderId = orderListItem?.order_id;

  const handleCancelOrder = () => {
    deleteOrder(
      { order_id: orderId, reason: "reason" },
      {
        onSuccess: (data) => {
          onCancelOrder?.()
          toast({
            title: "Order Deleted Succcessfully",
          })
          setOpen(false);  // Close the dialog 
        },
        onError: (error) => {
          console.log("Cancel Order error", error)
          toast({
            title: error.message,
          })
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <IconButton
          className="w-[140px]"
          variant={"primaryOutlineLabel"}
          icon={TrashIcon}
        >
          Cancel Order
        </IconButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Order</DialogTitle>
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
          Are you sure to cancel this order?
        </DialogDescription>
        <TableDetailOrderItemCard 
          order={orderListItem} 
          isSelected={false} 
          onClick={()=>{}}
        />
        <MainButton
          variant="canceled"
          className="w-full"
          onClick={() => handleCancelOrder()}
        >
          Cancel Order
        </MainButton>
      </DialogContent>
    </Dialog>
  )
}

export default CancelOrderDialog
