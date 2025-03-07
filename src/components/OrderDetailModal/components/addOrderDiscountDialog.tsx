"use client"

import React, { useEffect, useState } from "react"
import { UpdateOrderItemBody } from "@/api/order-items/update"
import { AddIcon, CloseIcon, EditIcon } from "@/icons"

import { ItemsDetails, Order } from "@/types/interfaces/order.interface"
import { useUpdateOrderItem } from "@/lib/hooks/mutations/order-items/useUpdateOrderItem"
import { useUpdateOrder } from "@/lib/hooks/mutations/orders/useUpdateOrder"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dialog"
import { IconButton } from "@/components/iconButton"
import IconWrapper from "@/components/iconWrapper"
import { MainButton } from "@/components/mainButton"
import { Tab } from "@/components/tab"
import { fontCaptionBold } from "@/styles/typography"

import { updateOrder, UpdateOrderBody } from "../../../api/orders/update"
import BackspaceIcon from "../../../icons/BackspaceIcon"

interface AddOrderDiscountDialogProps {
  order: Order
  onDiscountUpdate?: () => void
  isLoading?: boolean
}

const AddOrderDiscountDialog: React.FC<AddOrderDiscountDialogProps> = ({
  order,
  onDiscountUpdate,
  isLoading,
}) => {
  const [open, setOpen] = useState(false)
  const [selectedTabIndex, setSelectedTabIndex] = useState(1)
  const [pressedButton, setPressedButton] = useState(null)
  const [amount, setAmount] = useState("0")
  const [invalidPercent, setInvalidPercent] = useState(false)
  const [invalidFlat, setInvalidFlat] = useState(false)
  const [isInitCursor, setInitCursor] = useState(true)

  const { mutate: updateOrder, isPending, error } = useUpdateOrder()
  useEffect(() => {
    setAmount(order?.order_discount?.toString())
    setSelectedTabIndex(order?.order_discount_type === "flat" ? 1 : 2)
    setInvalidPercent(false)
    setInvalidFlat(false)
    setInitCursor(true)
  }, [open, order])

  useEffect(() => {
    if (selectedTabIndex === 2 && parseFloat(amount) > 100) {
      setInvalidPercent(true)
      setAmount("100")
    } else {
      setInvalidPercent(false)
    }

    if (
      selectedTabIndex === 1 &&
      parseFloat(amount) > (order?.sub_total ?? 0)
    ) {
      setInvalidFlat(true)
      setAmount((order?.sub_total ?? 0).toFixed(2))
    } else {
      setInvalidFlat(false)
    }
  }, [amount, selectedTabIndex])

  useEffect(() => {
    setInitCursor(true)
  }, [selectedTabIndex])

  const handleApplyDiscount = (tabIndex: number, amount: number) => {
    const updateOrderBody: UpdateOrderBody = {
      order_id: order?.order_id,
      order_discount: amount,
      order_discount_type: tabIndex === 1 ? "flat" : "percent",
    }

    updateOrder(updateOrderBody, {
      onSuccess: (data) => {
        onDiscountUpdate?.()
        toast({
          title: "Discount Saved Succcessfully",
        })
        setOpen(false) // Close the dialog
      },
      onError: (error) => {
        console.log("Discount Save error", error)
        toast({
          title: error.message,
        })
      },
    })
  }

  const handleNumberClick = (num: number) => {
    if (isInitCursor) {
      setAmount("0")
      setInitCursor(false)
    }
    setAmount((prevAmount) => {
      if (prevAmount?.length > 9) return prevAmount
      if (prevAmount?.includes(".")) {
        const decimalLength = prevAmount?.split(".")?.at(1)?.length ?? 0
        if (decimalLength > 1) {
          return prevAmount
        }
      }
      if (prevAmount === "0") return num.toString()
      return prevAmount + num
    })
  }

  const handleBackspace = () => {
    if (isInitCursor) {
      setAmount("0")
      setInitCursor(false)
    }
    setAmount((prevAmount) => prevAmount.slice(0, -1) || "0")
  }

  const handleDecimal = () => {
    if (isInitCursor) {
      setAmount("0")
      setInitCursor(false)
    }
    if (!amount.includes(".")) {
      setAmount((prevAmount) => prevAmount + ".")
    }
  }

  const handleButtonPress = (buttonValue: any) => {
    setPressedButton(buttonValue)
  }

  const handleButtonRelease = () => {
    setPressedButton(null)
  }

  const renderButton = (value: any, key: string, onClick: () => void) => (
    <button
      key={key}
      className={cn(
        "rounded-lg bg-gray-100 p-4 text-xl transition-colors duration-200",
        pressedButton === key ? "bg-black text-white" : ""
      )}
      onClick={onClick}
      onMouseDown={() => handleButtonPress(key)}
      onMouseUp={handleButtonRelease}
      onMouseLeave={handleButtonRelease}
      onTouchStart={() => handleButtonPress(key)}
      onTouchEnd={handleButtonRelease}
    >
      {value}
    </button>
  )
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger disabled={isLoading}>
        <div className="flex w-fit flex-row items-center gap-1 rounded-3 bg-gray-200 px-2 py-1 hover:bg-gray-500">
          <IconWrapper Component={AddIcon} size={"16"} />
          <span className={cn(fontCaptionBold)}>DISC%</span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Discount</DialogTitle>
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

        <div className="flex flex-col items-center gap-4">
          <div className="w-fit rounded-6 bg-gray-100">
            <Tab
              variant="secondary"
              isActive={selectedTabIndex === 1}
              onClick={() => {
                setSelectedTabIndex(1)
              }}
            >
              Flat
            </Tab>
            <Tab
              variant="secondary"
              isActive={selectedTabIndex === 2}
              onClick={() => {
                setSelectedTabIndex(2)
              }}
            >
              Percentage
            </Tab>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="mb-1 text-gray-600" id="amount-label">
              {selectedTabIndex === 1 ? "Amount" : "Value"}
            </p>
            <div className="flex flex-row gap-2">
              <h3 className="text-3xl font-bold text-gray-600">
                {selectedTabIndex === 1 ? order?.brand_info?.currency : "%"}
              </h3>
              <h3 className="text-3xl font-bold">{amount}</h3>
            </div>
          </div>
          <div className="mb-4 grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) =>
              renderButton(num, num.toString(), () => handleNumberClick(num))
            )}
            {renderButton(".", ".", handleDecimal)}
            {renderButton("0", "0", () => handleNumberClick(0))}
            {renderButton(<BackspaceIcon />, "C", handleBackspace)}
          </div>
          <MainButton
            variant="primary"
            className="px-16"
            disabled={invalidPercent || invalidFlat}
            onClick={() =>
              handleApplyDiscount(selectedTabIndex, parseFloat(amount))
            }
          >
            Apply
          </MainButton>
          {selectedTabIndex === 1 ? (
            <span
              className={cn(
                "mb-2 text-sm text-red-600",
                !invalidFlat ? "invisible" : "visible"
              )}
            >
              Discount amount can not be over total price.
            </span>
          ) : (
            <span
              className={cn(
                "mb-2 text-sm text-red-600",
                !invalidPercent ? "invisible" : "visible"
              )}
            >
              Discount percent can not be over 100.
            </span>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddOrderDiscountDialog
