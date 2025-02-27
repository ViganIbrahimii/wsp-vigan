"use client"

import React, { useState } from "react"
import { GetOrdersParams, GetOrdersResponse } from "@/api/orders"
import { CloseIcon, TrashIcon } from "@/icons"
import { InfiniteData, useQueryClient } from "@tanstack/react-query"

import { useDeleteOrder } from "@/lib/hooks/mutations/orders/useDeleteOrder"
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
import { Input } from "@/components/input"
import { MainButton } from "@/components/mainButton"
import RadioButton from "@/components/radioButton"
import { fontBodyBold } from "@/styles/typography"

interface CancelOrderDialogProps {
  orderNumber: string
  orderId: string
  filters: GetOrdersParams
}

const CancelOrderDialog: React.FC<CancelOrderDialogProps> = ({
  orderNumber,
  orderId,
  filters,
}) => {
  const queryClient = useQueryClient()
  const {
    mutate: deleteOrder,
    isPending: isDeleteOrderPending,
    error,
  } = useDeleteOrder()
  const [selectedReason, setSelectedReason] = useState("")
  const [otherReason, setOtherReason] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const reasons = [
    "Kitchen closed",
    "Items not available",
    "Delivery not available now",
    "Others",
  ]

  const handleReasonSelect = (reason: string) => {
    setSelectedReason(reason)
    if (reason !== "Others") {
      setOtherReason("")
    }
  }

  const handleCancelOrder = () => {
    const finalReason =
      selectedReason === "Others" ? otherReason : selectedReason

    deleteOrder(
      { order_id: orderId, reason: finalReason },
      {
        onSuccess: (data) => {
          const queryKey = ["orders", filters]
          toast({
            title: "Order Deleted Succcessfully",
          })

          setIsDialogOpen(false)
          queryClient.setQueryData<InfiniteData<GetOrdersResponse>>(
            queryKey,
            (oldData) => {
              if (!oldData) return oldData

              return {
                ...oldData,
                pages: oldData.pages.map((page) => ({
                  ...page,
                  data: page.data.filter((order) => order.order_id !== orderId),
                })),
              }
            }
          )
          queryClient.invalidateQueries({ queryKey: ["orders"] })
        },
        onError: (error) => {
          toast({
            title: error.message,
          })
        },
      }
    )
  }
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild disabled={isDeleteOrderPending}>
        <div
          onClick={() => setIsDialogOpen(true)} // Explicitly set the state
          className=" inline-flex
          h-[48px] min-w-[48px] cursor-pointer items-center justify-center rounded-full bg-none text-black-100 outline outline-2
          outline-black-10 transition-colors hover:outline hover:outline-4 hover:outline-black-20 disabled:bg-black-5 disabled:text-black-40 disabled:outline-none"
        >
          <IconWrapper Component={TrashIcon} size={"24"} />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
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
          What’s the reason for cancelling the #{orderNumber} order?
        </DialogDescription>
        <div className="w-full">
          {reasons.map((reason) => (
            <div
              key={reason}
              className="mb-4 flex cursor-pointer items-center justify-between space-x-3"
              onClick={() => handleReasonSelect(reason)}
            >
              <label
                htmlFor={reason}
                className={cn(fontBodyBold, "cursor-pointer")}
              >
                {reason}
              </label>
              <RadioButton
                selected={selectedReason === reason}
                size="large"
                onClick={() => handleReasonSelect(reason)}
              />
            </div>
          ))}
          {selectedReason === "Others" && (
            <Input
              type="text"
              placeholder="Type the reason"
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              extraStyles="w-full m-0"
            />
          )}
        </div>
        <MainButton
          variant="canceled"
          className="w-full"
          disabled={
            selectedReason === "" ||
            (selectedReason === "Others" && otherReason.trim() === "") ||
            isDeleteOrderPending
          }
          onClick={() => handleCancelOrder()}
        >
          {isDeleteOrderPending ? "Canceling Order" : "Cancel Order"}
        </MainButton>
      </DialogContent>
    </Dialog>
  )
}

export default CancelOrderDialog
