"use client"

import React, { useEffect, useState } from "react"
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
    label: "Dine In",
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

// Mock cart items data
const mockCartItems = [
  {
    item_id: "item-1",
    item_name: "Pepperoni Pizza",
    quantity: 2,
    item_price: 15.99,
    special_instruction: "Extra cheese please",
    modifier_list: [
      {
        modifier_id: "mod-1",
        modifier_name: "Size",
        modifier_option_id: "opt-1",
        modifier_option_name: "Large",
        modifier_option_price: "2.00",
      },
      {
        modifier_id: "mod-2",
        modifier_name: "Crust",
        modifier_option_id: "opt-2",
        modifier_option_name: "Thin",
        modifier_option_price: "0.00",
      },
    ],
  },
  {
    item_id: "item-2",
    item_name: "Coke",
    quantity: 1,
    item_price: 2.99,
    special_instruction: "With ice",
    modifier_list: [
      {
        modifier_id: "mod-3",
        modifier_name: "Size",
        modifier_option_id: "opt-3",
        modifier_option_name: "Medium",
        modifier_option_price: "0.00",
      },
    ],
  },
  {
    item_id: "item-3",
    item_name: "Garlic Bread",
    quantity: 1,
    item_price: 4.99,
    special_instruction: "",
    modifier_list: [],
  },
]

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

  const { cart, clearCart } = useCart()
  const { brandId } = useAuth()

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

          <div className="flex h-full flex-col-reverse gap-4 overflow-auto bg-body-gradient px-4 py-7 md:flex-row">
            {/* Sidebar (Order Summary & Cart) */}
            <div className="flex w-full shrink-0 flex-col gap-4 rounded-3 bg-white-100 md:w-1/4">
              <h1 className={cn("px-4 pt-4 text-black-100", fontTitle1)}>
                Add New Order
              </h1>

              {/* Order Type Selection */}
              <div className="px-4">
                <OrderTypeTabs
                  tabs={enrichedTabs}
                  selectedTab={selectedTab}
                  onTabChange={handleTabChange}
                />
              </div>

              {/* Table Selection (Only for Dine-In) */}
              {selectedTab?.value === OrderType.DINE && (
                <div className="px-4">
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
              <div className="px-4">
                <GuestInfoDialog
                  serviceType={selectedTab}
                  orderInfo={orderInfo}
                  setOrderInfo={setOrderInfo}
                />
              </div>

              {/* Cart Summary */}
              <CartSummary />

              {/* Cart Items List */}
              {cart.length > 0 && (
                <div className="grow flex-col gap-4 overflow-auto px-4 py-2">
                  {cart.map((cartItem, index) => (
                    <CartItemCard
                      key={`cart-item-${index}`}
                      cartItem={cartItem}
                      index={index}
                    />
                  ))}
                </div>
              )}

              {/* Total Price & Checkout Button */}
              {cart.length > 0 && (
                <div className="px-4 pb-4">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-black-60">Total:</span>
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
              )}
            </div>

            {/* Main Content (Menu & Search) */}
            <div className="w-full min-w-0 flex-col gap-4">
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
                  className="absolute right-5 outline-none"
                  variant="primaryWhite"
                  size="large"
                  icon={CloseIcon}
                  iconSize="24"
                  isActive
                  onClick={() => setOpen(false)}
                />
              </div>

              {/* Menu Panel */}
              <MenuPanelComponent
                search={search}
                isSmallIconView={isSmallIconView}
                selectedServiceType={selectedTab}
              />
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
