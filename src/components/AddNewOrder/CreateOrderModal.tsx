"use client"

import React, { useEffect, useRef, useState } from "react"
import { OrderType, OrderTypeLabels } from "@/constants/orderTypes"
import { AddIcon, CloseIcon, GridIcon, WindowIcon } from "@/icons"
import { useAuth } from "@/providers/AuthProvider/AuthProvider"
import { useCart } from "@/providers/CartProvider"

import {
  CreateOrderInfoInterface,
  CreateOrderTypeOption,
  EnrichedOrderTypeOption,
} from "@/types/interfaces/order.interface"
import { Table } from "@/types/interfaces/table.interface"
import { cn, prepareOrderBody } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { CartItemCard } from "@/components/AddNewOrder/CartItemCard"
import { CartSummary } from "@/components/AddNewOrder/CartSummary"
import GuestInfoDialog from "@/components/AddNewOrder/GuestInfoDialog"
import MenuPanelComponent from "@/components/AddNewOrder/MenuPanel"
import { OrderTypeTabs } from "@/components/AddNewOrder/OrderTypeTabs"
import SelectTableDialog from "@/components/AddNewOrder/SelectTableDialog"
import ConfirmationDialog from "@/components/confirmationDialog"
import {
  Dialog,
  DialogDescription,
  DialogFullScreenContent,
  DialogTitle,
  FullScreenDialog,
} from "@/components/dialog"
import { IconButton } from "@/components/iconButton"
import { MainButton } from "@/components/mainButton"
import SearchInput from "@/components/searchInput"
import { fontBodyBold, fontTitle1 } from "@/styles/typography"

interface CreateOrderDialogProps {
  onOrderCreated?: (
    orderId?: string,
    orderType?: OrderType,
    tableId?: string
  ) => void
  mainTabValue?: OrderType
}

// Mock data for order types
const orderTypeOptions: CreateOrderTypeOption[] = [
  {
    value: OrderType.DINE,
    label: "Table",
    serviceTypeName: "Dine In",
  },
  {
    value: OrderType.PICKUP,
    label: "Pickup",
    serviceTypeName: "Pickup",
  },
  {
    value: OrderType.DELIVERY,
    label: "Delivery",
    serviceTypeName: "Delivery",
  },
]

// Enrich order type options with service type IDs
const enrichedTabs: EnrichedOrderTypeOption[] = orderTypeOptions.map(
  (option, index) => ({
    ...option,
    serviceTypeId: `service-type-${index + 1}`,
  })
)

export default function CreateOrderDialog({
  onOrderCreated,
  mainTabValue,
}: CreateOrderDialogProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [isSmallIconView, setIsSmallIconView] = useState(false)
  const [selectedTab, setSelectedTab] =
    useState<EnrichedOrderTypeOption | null>(
      enrichedTabs.find((tab) => tab.value === mainTabValue) || enrichedTabs[0]
    )
  const [pendingTab, setPendingTab] = useState<EnrichedOrderTypeOption | null>(
    null
  )
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [orderInfo, setOrderInfo] = useState<CreateOrderInfoInterface>({
    selectedTable: null,
    preSelectedTable: null,
    customerId: null,
    isNewCustomer: true,
    orderInstruction: null,
    guestInfo: null,
  })

  // Add state for cart height
  const [mobileCartHeight, setMobileCartHeight] = useState(0)

  // Create refs for measuring cart height
  const mobileCartRef = useRef<HTMLDivElement>(null)

  const { cart, clearCart } = useCart()
  const { brandId } = useAuth()

  // Add useEffect to measure cart height when cart changes
  useEffect(() => {
    const updateCartHeight = () => {
      if (mobileCartRef.current) {
        const height = mobileCartRef.current.getBoundingClientRect().height
        setMobileCartHeight(height)
      } else {
        // When cart is empty or not rendered, set height to 0
        setMobileCartHeight(0)
      }
    }

    // Update on initial render and when cart changes
    updateCartHeight()

    // Also update on window resize
    window.addEventListener("resize", updateCartHeight)

    return () => {
      window.removeEventListener("resize", updateCartHeight)
    }
  }, [cart.length]) // Re-measure when cart items change

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && cart.length > 0) {
      // Show confirmation dialog when closing with items in cart
      setShowConfirmationModal(true)
    } else {
      setOpen(newOpen)
      if (!newOpen) {
        // Reset state when closing
        setSearch("")
        setSelectedTab(enrichedTabs[0])
        clearCart()
        setOrderInfo({
          selectedTable: null,
          preSelectedTable: null,
          customerId: null,
          isNewCustomer: true,
          orderInstruction: null,
          guestInfo: null,
        })
      }
    }
  }

  const handleTabChange = (tab: EnrichedOrderTypeOption) => {
    if (cart.length > 0 && selectedTab && tab.value !== selectedTab.value) {
      // Show confirmation when changing tabs with items in cart
      setPendingTab(tab)
      setShowConfirmationModal(true)
    } else {
      setSelectedTab(tab)
    }
  }

  const handleConfirmChange = () => {
    if (pendingTab) {
      setSelectedTab(pendingTab)
      clearCart()
      setPendingTab(null)
    } else {
      setOpen(false)
      clearCart()
    }
    setShowConfirmationModal(false)
  }

  const handleCancelChange = () => {
    setPendingTab(null)
    setShowConfirmationModal(false)
  }

  const handlePlaceOrder = async () => {
    try {
      const orderBody = prepareOrderBody({
        cart,
        selectedTab,
        orderInfo,
        brandId,
      })

      if (!orderBody) return

      // Simulate API call success
      toast({
        title: "Order placed successfully",
      })

      // Close modal and reset state
      setOpen(false)
      clearCart()
      setOrderInfo({
        selectedTable: null,
        preSelectedTable: null,
        customerId: null,
        isNewCustomer: true,
        orderInstruction: null,
        guestInfo: null,
      })

      // Call onOrderCreated callback if provided
      if (onOrderCreated) {
        onOrderCreated(
          "mock-order-id",
          orderBody.order_type,
          orderBody.table_id
        )
      }
    } catch (error) {
      console.error("Error placing order:", error)
      toast({
        title: "Error placing order",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <FullScreenDialog isOpen={open} onOpenChange={handleOpenChange}>
        {orderInfo.preSelectedTable ? (
          <MainButton
            variant="secondary"
            className="w-full"
            onClick={() => setOpen(true)}
          >
            Create New Order
          </MainButton>
        ) : (
          <IconButton
            className="fixed bottom-14 right-3"
            icon={AddIcon}
            variant="primary"
            onClick={() => setOpen(true)}
          />
        )}
        <DialogFullScreenContent className="h-screen">
          <DialogTitle className="hidden">Add New Order</DialogTitle>
          <DialogDescription className="hidden">
            Add New Order Modal
          </DialogDescription>

          {/* Mobile Layout - Fixed header, scrollable menu, fixed cart */}
          <div className="flex h-screen flex-col bg-body-gradient lg:hidden">
            {/* Header Section - Fixed at top */}
            <div className="bg-white-100 px-4 py-4">
              <div className="flex items-center justify-between">
                <h1 className={cn("text-black-100", fontTitle1)}>
                  Add New Order
                </h1>
                <IconButton
                  className="outline-none"
                  variant="primaryWhite"
                  size="large"
                  icon={CloseIcon}
                  iconSize="24"
                  isActive
                  onClick={() => setOpen(false)}
                />
              </div>

              {/* Order Type Selection */}
              <div className="flex  gap-4 py-4 lg:flex-col">
                <OrderTypeTabs
                  tabs={enrichedTabs}
                  selectedTab={selectedTab}
                  onTabChange={handleTabChange}
                />

                {/* Table Selection (Only for Dine-In) */}
                {selectedTab?.value === OrderType.DINE && (
                  <div className=" w-full">
                    <SelectTableDialog
                      onTableSelect={(table) =>
                        setOrderInfo((prev) => ({
                          ...prev,
                          selectedTable: table,
                        }))
                      }
                      table={orderInfo.selectedTable}
                      preSelectedTable={orderInfo.preSelectedTable}
                    />
                  </div>
                )}

                {/* Guest Information Form */}
                <div className=" w-full">
                  <GuestInfoDialog
                    serviceType={selectedTab}
                    orderInfo={orderInfo}
                    setOrderInfo={setOrderInfo}
                  />
                </div>
              </div>
            </div>

            {/* Menu Section - Scrollable, takes remaining space */}
            <div className="max-w-[100vw] flex-1 overflow-y-auto p-4">
              <MenuPanelComponent
                search={search}
                isSmallIconView={isSmallIconView}
                selectedServiceType={selectedTab}
              />
            </div>

            {/* Cart Section - Fixed at bottom */}
            {cart.length > 0 && (
              <div className="max-w-[100vw] bg-white-100 shadow-lg">
                {/* Cart Summary and Items */}
                <div className="">
                  {/* Cart Summary */}
                  <div className="px-4 pt-2">
                    <CartSummary />
                  </div>

                  {/* Mobile Cart Preview - Shows a few items with horizontal scroll */}
                  <div className="scrollbar-hide flex overflow-x-auto whitespace-nowrap px-4 py-2">
                    {cart.map((cartItem, index) => (
                      <div
                        key={`cart-item-${index}-mobile`}
                        className="mr-4 min-w-[200px] max-w-[200px] flex-shrink-0 "
                      >
                        <CartItemCard cartItem={cartItem} index={index} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total and Checkout Button */}
                <div className=" bg-white-100 px-4 py-4">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-black-100">Total</span>
                    <span className={cn("text-black-100", fontBodyBold)}>
                      $
                      {cart
                        .reduce(
                          (total, item) =>
                            total + item.item_price * item.quantity,
                          0
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                  <MainButton
                    variant="primary"
                    className="w-full shadow-lg"
                    disabled={!selectedTab || !cart.length}
                    onClick={handlePlaceOrder}
                  >
                    Place Order
                  </MainButton>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Layout */}
          <div className="hidden h-full flex-row gap-4 overflow-hidden bg-body-gradient p-7 lg:flex">
            {/* Sidebar (Order Summary & Cart) */}
            <div className="flex h-full w-1/4 flex-col rounded-3 bg-white-100 p-4">
              <h1 className={cn("text-black-100", fontTitle1)}>
                Add New Order
              </h1>

              {/* Order Type Selection */}
              <div className="mt-4 flex w-full flex-col gap-4">
                <OrderTypeTabs
                  tabs={enrichedTabs}
                  selectedTab={selectedTab}
                  onTabChange={handleTabChange}
                />

                {/* Table Selection (Only for Dine-In) */}
                {selectedTab?.value === OrderType.DINE && (
                  <div className="w-full">
                    <SelectTableDialog
                      onTableSelect={(table) =>
                        setOrderInfo((prev) => ({
                          ...prev,
                          selectedTable: table,
                        }))
                      }
                      table={orderInfo.selectedTable}
                      preSelectedTable={orderInfo.preSelectedTable}
                    />
                  </div>
                )}

                {/* Guest Information Form */}
                <div className="w-full">
                  <GuestInfoDialog
                    serviceType={selectedTab}
                    orderInfo={orderInfo}
                    setOrderInfo={setOrderInfo}
                  />
                </div>
              </div>

              {/* Cart Summary */}
              <div className="mt-4">
                <CartSummary />
              </div>

              {/* Cart Items List - Scrollable area */}
              <div className="mt-2 flex-grow overflow-y-auto">
                {cart.length > 0 && (
                  <div className="flex flex-col gap-4">
                    {cart.map((cartItem, index) => (
                      <CartItemCard
                        key={`cart-item-${index}-desktop`}
                        cartItem={cartItem}
                        index={index}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Total Price & Checkout Button */}
              {cart.length > 0 && (
                <div className="mt-4  pt-4">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-black-100">Total:</span>
                    <span className={cn("text-black-100", fontBodyBold)}>
                      $
                      {cart
                        .reduce(
                          (total, item) =>
                            total + item.item_price * item.quantity,
                          0
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                  <MainButton
                    variant="primary"
                    className="w-full shadow-sticky-header"
                    disabled={!selectedTab || !cart.length}
                    onClick={handlePlaceOrder}
                  >
                    Place Order
                  </MainButton>
                </div>
              )}
            </div>

            {/* Main Content (Menu & Search) */}
            <div className="flex w-3/4 flex-col">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <SearchInput
                    query={search}
                    setQuery={setSearch}
                    alwaysOpen={false}
                  />
                  <IconButton
                    icon={isSmallIconView ? GridIcon : WindowIcon}
                    iconSize="24"
                    size="large"
                    variant="primaryOutline"
                    onClick={() => setIsSmallIconView(!isSmallIconView)}
                  />
                </div>
                <IconButton
                  className="outline-none"
                  variant="primaryWhite"
                  size="large"
                  icon={CloseIcon}
                  iconSize="24"
                  isActive
                  onClick={() => setOpen(false)}
                />
              </div>

              {/* Menu Panel */}
              <div className="h-[calc(100%-80px)] overflow-y-auto">
                <MenuPanelComponent
                  search={search}
                  isSmallIconView={isSmallIconView}
                  selectedServiceType={selectedTab}
                />
              </div>
            </div>
          </div>
        </DialogFullScreenContent>
      </FullScreenDialog>

      {/* Confirmation Dialog for Tab Change */}
      <ConfirmationDialog
        isOpen={showConfirmationModal}
        onConfirm={handleConfirmChange}
        onCancel={handleCancelChange}
        title="Change Order Type?"
        description="Changing order type will clear your current cart. Do you want to continue?"
        confirmText="Yes, Change"
      />
    </>
  )
}
