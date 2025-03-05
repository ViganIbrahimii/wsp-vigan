import { useEffect, useState } from "react"
import { OrderType } from "@/constants/orderTypes"
import { AddIcon, CloseIcon, GridIcon, WindowIcon } from "@/icons"
import { useAuth } from "@/providers/AuthProvider/AuthProvider"
import { useCart } from "@/providers/CartProvider"
import { useQueryClient } from "@tanstack/react-query"

import { EnrichedOrderTypeOption } from "@/types/interfaces/order.interface"
import { Table } from "@/types/interfaces/table.interface"
import { useCreateOrder } from "@/lib/hooks/mutations/orders/useCreateOrder"
import { useConfirmation } from "@/lib/hooks/utilityHooks/useConfimation"
import { useInitializeTabs } from "@/lib/hooks/utilityHooks/useInitializeTabs"
import { useOrderInfo } from "@/lib/hooks/utilityHooks/useOrderInfo"
import { cn, prepareOrderBody } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogDescription,
  DialogFullScreenContent,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog"
import { IconButton } from "@/components/iconButton"
import { MainButton } from "@/components/mainButton"
import SearchInput from "@/components/searchInput"
import { fontBodyBold, fontBodyNormal } from "@/styles/typography"

import ConfirmationDialog from "../confirmationDialog"
import { CartItemCard } from "./CartItemCard"
import { CartSummary } from "./CartSummary"
import GuestInfoDialog from "./GuestInfoDialog"
import MenuPanelComponent from "./MenuPanel"
import { OrderTypeTabs } from "./OrderTypeTabs"
import SelectTableDialog from "./SelectTableDialog"

interface CreateOrderDialogProps {
  preSelectedTable?: Table | null
  onOrderCreated?: (
    orderId: string,
    orderType: OrderType,
    tableId?: string
  ) => void,
  mainTabValue?: OrderType | null,
}

const CreateOrderDialog: React.FC<CreateOrderDialogProps> = ({
  preSelectedTable = null,
  mainTabValue = null,
  onOrderCreated,
}) => {
  const queryClient = useQueryClient()
  const { cart, clearCart, currency, calculateTotalPrice } = useCart()
  const { brandId } = useAuth()
  const { mutate } = useCreateOrder()

  // Hooks
  const { orderInfo, handleSaveOrderInfo, defaultOrderInfo, setOrderInfo } =
    useOrderInfo(preSelectedTable)

  const { enrichedTabs, selectedTab, setSelectedTab } = useInitializeTabs()
  
  useEffect(()=>{
    if (mainTabValue) {
      const tab = enrichedTabs.find(item => item.value === mainTabValue)
      if (tab) {
        setSelectedTab(tab)
      }
    }
  }, [enrichedTabs, mainTabValue, setSelectedTab])
  
  const {
    showConfirmationModal,
    setShowConfirmationModal,
    pendingTab,
    setPendingTab,
    handleConfirmChange,
    handleCancelChange,
  } = useConfirmation(setSelectedTab)

  // Component States
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [isSmallIconView, setIsSmallIconView] = useState(false)

  // Handlers
  const handleTabChange = (tab: EnrichedOrderTypeOption) => {
    if (cart.length > 0) {
      setPendingTab(tab)
      setShowConfirmationModal(true)
    } else {
      setSelectedTab(tab)
    }
  }

  const handlePlaceOrder = () => {
    const orderBody = prepareOrderBody({
      cart,
      selectedTab,
      orderInfo,
      brandId,
    })

    if (!orderBody) {
      return null
    }

    mutate(orderBody, {
      onSuccess: (response) => {
        toast({ title: "Order placed successfully" })
        setOpen(false)
        resetModalState()
        queryClient.invalidateQueries({ queryKey: ["orders"] })

        if (onOrderCreated && !orderInfo.preSelectedTable) {
          onOrderCreated(
            response.data.data.order_id || "",
            orderBody.order_type,
            orderBody.table_id
          )
        }
      },
      onError: (error: any) => {
        toast({
          title: "Failed to place order",
          description: error.response?.data?.message || error.message,
        })
      },
    })
  }

  const resetModalState = () => {
    setSearch("")
    clearCart()
    handleSaveOrderInfo({ ...defaultOrderInfo, preSelectedTable })
    setSelectedTab(selectedTab ?? (enrichedTabs[0] || null))
    setPendingTab(null)
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) resetModalState()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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

      <DialogFullScreenContent className="flex h-full flex-col md:h-screen">
        <DialogHeader className="hidden">
          <DialogTitle>Add New Order</DialogTitle>
        </DialogHeader>
        <DialogDescription className="hidden">
          Add New Order Modal
        </DialogDescription>
        <div className="flex h-full flex-col-reverse gap-4 overflow-auto bg-body-gradient px-4 py-7 md:flex-row">
          {/* Sidebar */}
          <div className="flex h-full w-full shrink-0 flex-col gap-4 rounded-3 bg-white-100 md:w-1/4">
            <div className="flex w-full flex-col gap-4 px-4 pt-4">
              <h1 className="text-2xl font-bold text-black">Add New Order</h1>
              {!orderInfo.preSelectedTable && (
                <OrderTypeTabs
                  tabs={enrichedTabs}
                  selectedTab={selectedTab}
                  onTabChange={handleTabChange}
                />
              )}
              {selectedTab?.value === OrderType.DINE && (
                <SelectTableDialog
                  onTableSelect={(table) =>
                    handleSaveOrderInfo({ selectedTable: table })
                  }
                  preSelectedTable={orderInfo.preSelectedTable}
                  table={orderInfo.selectedTable}
                />
              )}
              <GuestInfoDialog
                serviceType={selectedTab}
                orderInfo={orderInfo}
                setOrderInfo={setOrderInfo}
              />
              <ConfirmationDialog
                isOpen={showConfirmationModal}
                onConfirm={() => handleConfirmChange()}
                onCancel={handleCancelChange}
              />
              <CartSummary />
            </div>
            {cart.length > 0 && (
              <>
                <div className="masonry-scroll-container flex grow flex-col gap-4 overflow-auto px-4 py-2">
                  {cart.map((cartItem, index) => (
                    <CartItemCard
                      cartItem={cartItem}
                      key={index}
                      index={index}
                    />
                  ))}
                </div>
                <div className="mb-auto w-full rounded-3 bg-white-100 p-4 shadow-lg">
                  <p
                    className={cn(
                      fontBodyNormal,
                      "flex w-full items-center justify-between p-2"
                    )}
                  >
                    <span>Total:</span>
                    <span className={cn(fontBodyBold)}>
                      {currency}
                      {`${calculateTotalPrice().toFixed(2)}`}
                    </span>
                  </p>

                  <MainButton
                    variant="primary"
                    className="w-full shadow-lg"
                    disabled={!selectedTab || !cart.length}
                    onClick={handlePlaceOrder}
                  >
                    Place order
                  </MainButton>
                </div>
              </>
            )}
          </div>

          {/* Main Content */}
          <div className="flex w-full min-w-0 flex-col gap-4">
            <div className="relative flex items-center">
              <div className="flex items-center gap-4">
                <SearchInput query={search} setQuery={setSearch} />
                <IconButton
                  icon={isSmallIconView ? GridIcon : WindowIcon}
                  iconSize="24"
                  size="large"
                  variant="primaryOutline"
                  onClick={() => setIsSmallIconView(!isSmallIconView)}
                />
              </div>
              <IconButton
                className="absolute right-0 outline-none"
                variant="primaryWhite"
                size="large"
                icon={CloseIcon}
                iconSize="24"
                isActive
                onClick={() => setOpen(false)}
              />
            </div>
            <MenuPanelComponent
              search={search}
              isSmallIconView={isSmallIconView}
              selectedServiceType={selectedTab}
            />
          </div>
        </div>
      </DialogFullScreenContent>
    </Dialog>
  )
}

export default CreateOrderDialog
