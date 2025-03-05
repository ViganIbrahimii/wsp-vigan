"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { AddIcon, CloseIcon, TrashIcon } from "@/icons"
import { useAuth } from "@/providers/AuthProvider/AuthProvider"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

import { Order, OrderListItem } from "@/types/interfaces/order.interface"
import { useDeleteOrder } from "@/lib/hooks/mutations/orders/useDeleteOrder"
import { useUpdateOrder } from "@/lib/hooks/mutations/orders/useUpdateOrder"
import { useGetBrand } from "@/lib/hooks/queries/brand/useGetBrand"
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
import { MainButton } from "@/components/mainButton"
import { Tab } from "@/components/tab"
import { fontCaptionBold, fontCaptionNormal } from "@/styles/typography"

import BackspaceIcon from "../../../icons/BackspaceIcon"
import { useGetPaymentMethods } from "../../../lib/hooks/queries/payment-methods/useGetPaymentMethods"
import { TableDetailOrderItemCard } from "./TableDetailOrderItemCard"

interface PayBillDialogProps {
  order: Order
  payableAmount: number
  currency: string
  isLoading?: boolean
  onCloseOrder?: () => void
  onPayOrder?: () => void
}

interface PaymentItem {
  payMethod: string
  payMethodIndex: number
  payAmount: number
}

const PayBillDialog: React.FC<PayBillDialogProps> = ({
  payableAmount,
  currency,
  isLoading,
  order,
  onCloseOrder,
  onPayOrder,
}) => {
  const { brandId } = useAuth()
  const [open, setOpen] = useState(false)
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const [pressedButton, setPressedButton] = useState(null)
  const [amount, setAmount] = useState("0")
  const [remainingAmount, setRemainingAmount] = useState(payableAmount)
  const [payItemList, setPayItemList] = useState<Map<string, PaymentItem>>(
    new Map()
  )

  const [tabItems, setTabItems] = useState<string[]>([])

  const [showLeftButton, setShowLeftButton] = useState(false)
  const [showRightButton, setShowRightButton] = useState(false)

  const tabsRef = useRef<HTMLDivElement>(null)

  const {
    mutate: updateOrder,
    isPending,
    error: updateOrderError,
  } = useUpdateOrder()

  const { data: brandPaymentMethodsData, isLoading: isBrandLoading } =
    useGetBrand({
      brand_id: brandId!,
    })

  const {
    data: allPaymentMethodsData,
    error,
    isLoading: isPaymentMethodsLoading,
  } = useGetPaymentMethods({
    page_size: 1,
    page_limit: 50,
    status: "active",
  })

  const checkScrollButtons = () => {
    if (!tabsRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current
    // Show left button if we've scrolled right
    setShowLeftButton(scrollLeft > 0)

    // Show right button if there's more content to scroll to
    setShowRightButton(scrollLeft < scrollWidth - clientWidth)
  }

  // Add ResizeObserver to detect when tabs container changes size
  useEffect(() => {
    if (!tabsRef.current) return

    const resizeObserver = new ResizeObserver(() => {
      checkScrollButtons()
    })

    resizeObserver.observe(tabsRef.current)

    // Initial check
    checkScrollButtons()

    return () => {
      if (tabsRef.current) {
        resizeObserver.disconnect()
      }
    }
  }, [tabsRef.current]) // Run when tabsRef.current changes

  // Add separate effect for open and tabItems changes
  useEffect(() => {
    // Use setTimeout to ensure DOM has updated
    const timer = setTimeout(() => {
      if (open && tabsRef.current) {
        checkScrollButtons()
      }
    }, 0)

    return () => clearTimeout(timer)
  }, [open, tabItems])

  useEffect(() => {
    if (brandPaymentMethodsData?.data && allPaymentMethodsData?.data) {
      const brandPaymentMethodIds =
        brandPaymentMethodsData.data?.data?.brand_setting?.payment_settings
          .payment_methods ?? []
      const allPaymentMethods = allPaymentMethodsData?.data?.data ?? []
      const brandPaymentMethods = brandPaymentMethodIds.map(
        (idItem) =>
          allPaymentMethods.find(
            (methodItem) => methodItem.payment_method_id === idItem.id
          )?.payment_method_name ?? ""
      )

      setTabItems(brandPaymentMethods)
    }
  }, [brandPaymentMethodsData, allPaymentMethodsData])

  useEffect(() => {
    setAmount("0")
    setSelectedTabIndex(0)
    setRemainingAmount(payableAmount)
    setPayItemList(new Map())
  }, [open, payableAmount])

  const handleAmountAdd = () => {
    let amountValue = parseFloat(amount)
    if (amountValue <= 0 || remainingAmount <= 0) return

    if (amountValue > remainingAmount) {
      amountValue = remainingAmount
    }

    const payMethod = tabItems.at(selectedTabIndex) ?? ""
    if (!payMethod) return

    setRemainingAmount(remainingAmount - amountValue)

    setPayItemList((prev) => {
      const newPayItemList = new Map(prev) // Create a new Map to maintain immutability
      const existingItem = newPayItemList.get(payMethod)

      if (existingItem) {
        newPayItemList.set(payMethod, {
          ...existingItem,
          payAmount: existingItem.payAmount + amountValue,
        })
      } else {
        newPayItemList.set(payMethod, {
          payMethod,
          payMethodIndex: selectedTabIndex,
          payAmount: amountValue,
        })
      }

      return newPayItemList
    })
    setAmount("0")
  }

  const handleRemovePayItem = (payMethod: string) => {
    setRemainingAmount((prev) => {
      return prev + (payItemList.get(payMethod)?.payAmount ?? 0)
    })

    setPayItemList((prev) => {
      const newPayItemList = new Map(prev) // Create a new Map to maintain immutability
      const existingItem = newPayItemList.get(payMethod)

      if (existingItem) {
        newPayItemList.delete(payMethod)
      }
      return newPayItemList
    })
  }
  const handleJustPay = () => {
    updateOrder(
      {
        order_id: order?.order_id!,
        payment_status: "paid",
        payment_method: tabItems.at(selectedTabIndex) ?? "",
      },
      {
        onSuccess: (data) => {
          onPayOrder?.()
          toast({
            title: `Order ${order?.order_number}: Paid succssfully.`,
          })
          setOpen(false)
        },
        onError: (error) => {
          console.log(`Order ${order?.order_number}: Pay error.`, error)
          toast({
            title: `Order ${order?.order_number}: Pay error. ${error.message}`,
          })
          setOpen(false)
        },
      }
    )
  }

  const handlePayAndClose = () => {
    updateOrder(
      {
        order_id: order?.order_id!,
        payment_status: "paid",
        payment_method: tabItems.at(selectedTabIndex) ?? "",
        order_status: "closed",
      },
      {
        onSuccess: (data) => {
          onCloseOrder?.()
          toast({
            title: `Order ${order?.order_number}: Paid and Closed succssfully.`,
          })
          setOpen(false)
        },
        onError: (error) => {
          console.log(
            `Order ${order?.order_number}: Pay and Close error.`,
            error
          )
          toast({
            title: `Order ${order?.order_number}: Pay and Close error. ${error.message}`,
          })
          setOpen(false)
        },
      }
    )
  }

  const handleNumberClick = (num: number) => {
    setAmount((prevAmount) => {
      if (prevAmount === "0") return num.toString()
      return prevAmount + num
    })
  }

  const handleBackspace = () => {
    setAmount((prevAmount) => prevAmount.slice(0, -1) || "0")
  }

  const handleDecimal = () => {
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
        "rounded-lg bg-gray-200 p-3 text-xl transition-colors duration-200",
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

  const handleTabsLeft = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollLeft -= 40
      checkScrollButtons()
    }
  }

  const handleTabsRight = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollLeft += 40
      checkScrollButtons()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="w-full">
        <MainButton variant={"accept"} disabled={isLoading} className="w-full">
          Pay Bill
        </MainButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pay Bill</DialogTitle>
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

        <div className="flex flex-col items-center gap-2 overflow-hidden">
          <div className="flex w-full flex-row items-center justify-between rounded-3 bg-gray-100 px-4 py-1">
            <div>
              <span className={cn(fontCaptionBold, "mr-2 text-gray-500")}>
                Payable Amount:
              </span>
              <span className={cn(fontCaptionBold)}>
                {currency}
                {payableAmount}
              </span>
            </div>
            <div>
              <span className={cn(fontCaptionBold, "mr-2 text-gray-500")}>
                Remaining:
              </span>
              <span className={cn(fontCaptionBold)}>
                {currency}
                {remainingAmount}
              </span>
            </div>
          </div>
          <div className="relative flex w-full flex-col gap-2 rounded-3 bg-gray-100 p-4">
            {showLeftButton && (
              <div className="absolute left-4 top-4 z-10 h-full rounded-full">
                <IconButton
                  variant={"primaryGradient"}
                  icon={ChevronLeft}
                  size={"large"}
                  onClick={handleTabsLeft}
                />
              </div>
            )}
            {showRightButton && (
              <div className="absolute  right-4 top-4 z-10 h-full rounded-full">
                <IconButton
                  variant={"primaryGradient"}
                  icon={ChevronRight}
                  size={"large"}
                  onClick={handleTabsRight}
                />
              </div>
            )}
            <div
              className="flex w-full min-w-0 flex-row overflow-x-auto rounded-6 bg-gray-50 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              ref={tabsRef}
            >
              {tabItems.map((item, index) => (
                <Tab
                  key={index}
                  variant="secondary"
                  isActive={selectedTabIndex === index}
                  onClick={() => {
                    setSelectedTabIndex(index)
                  }}
                >
                  {item}
                </Tab>
              ))}
            </div>
            <div className="flex flex-row gap-2">
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) =>
                  renderButton(num, num.toString(), () =>
                    handleNumberClick(num)
                  )
                )}
                {renderButton(".", ".", handleDecimal)}
                {renderButton("0", "0", () => handleNumberClick(0))}
                {renderButton(<BackspaceIcon />, "C", handleBackspace)}
              </div>
              <div className="flex flex-grow flex-col items-center justify-center rounded-3 bg-white">
                <p className="mb-1 text-gray-600" id="amount-label">
                  Amount
                </p>
                <div className="flex flex-row">
                  <h3 className="text-3xl font-bold text-gray-600">
                    {currency}
                  </h3>
                  <h3 className="text-3xl font-bold">{amount}</h3>
                </div>
                <MainButton
                  variant="secondary"
                  onClick={handleAmountAdd}
                  className="mt-4"
                  disabled={parseFloat(amount) <= 0 || remainingAmount <= 0}
                >
                  Add
                </MainButton>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col gap-1">
            {Array.from(payItemList.entries()).map(([key, values]) => (
              <div
                className="flex w-full flex-row items-center justify-between border-b px-2 py-1"
                key={key}
              >
                <div>
                  <span className={cn(fontCaptionBold, "mr-2")}>
                    {values.payMethod}
                  </span>
                </div>
                <div>
                  <span className={cn(fontCaptionBold, "mr-2")}>
                    {currency} {values.payAmount}
                  </span>
                  <IconButton
                    variant={"secondaryOutline"}
                    icon={TrashIcon}
                    size={"small"}
                    onClick={() => {
                      handleRemovePayItem(values.payMethod)
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex w-full flex-row gap-2">
            <MainButton
              variant="secondary"
              className="w-1/2"
              disabled={isPending || remainingAmount !== 0}
              onClick={handlePayAndClose}
            >
              Pay & Close Order
            </MainButton>
            <MainButton
              variant="accept"
              className="w-1/2"
              disabled={isPending || remainingAmount !== 0}
              onClick={handleJustPay}
            >
              Just Pay!
            </MainButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PayBillDialog
