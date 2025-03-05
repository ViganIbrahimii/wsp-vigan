import { skip } from "node:test"
import { useEffect, useState } from "react"
import { UpdateOrderItemBody } from "@/api/order-items/update"
import { UnifiedCustomerInfo } from "@/api/orders/create"
import { OrderStatuses } from "@/constants/orderStatuses"
import { OrderType } from "@/constants/orderTypes"
import {
  ChevronDownIcon,
  CloseIcon,
  EditIcon,
  GridIcon,
  MonetizationIcon,
  PersonIcon,
  ReceiptLongIcon,
  RotateLeftIcon,
  ScheduleIcon,
  TableBarIcon,
  TrashIcon,
  WindowIcon,
} from "@/icons"
import { useAuth } from "@/providers/AuthProvider/AuthProvider"
import { CartItemType, useCart } from "@/providers/CartProvider"

import { ItemList, ServiceType } from "@/types/interfaces/item.interface"
import {
  ItemsDetails,
  ModifierInfo,
  Order,
  OrderListItem,
} from "@/types/interfaces/order.interface"
import { Table } from "@/types/interfaces/table.interface"
import { useUpdateOrderItem } from "@/lib/hooks/mutations/order-items/useUpdateOrderItem"
import { useUpdateOrder } from "@/lib/hooks/mutations/orders/useUpdateOrder"
import { useGetServiceTypes } from "@/lib/hooks/queries/service-types/useGetServiceTypes"
import { useGetTables } from "@/lib/hooks/queries/tables/useGetTables"
import { cn } from "@/lib/utils"
import {
  fontBodyBold,
  fontBodyNormal,
  fontCaptionBold,
  fontCaptionNormal,
} from "@/styles/typography"

import GuestInfoDialog from "../AddNewOrder/GuestInfoDialog"
import SelectTableDialog from "../AddNewOrder/SelectTableDialog"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogFullScreenContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FullScreenDialog,
} from "../dialog"
import { IconButton } from "../iconButton"
import IconWrapper from "../iconWrapper"
import { MainButton } from "../mainButton"
import SearchInput from "../searchInput"
import { toast } from "../ui/use-toast"
import AddGuestInfoDialog from "./components/addGuestInfoDialog"
import CancelAllItemDialog from "./components/cancelAllItemDialog"
import { EditOrderItemDetailCard } from "./components/EditOrderItemDetailCard"
import MenuPanel from "./components/MenuItemChoosePanel"
import { CustomImageSelect } from "./components/select"

interface EditOrderDialogProps {
  table?: Table
  order?: Order
  isLoading?: boolean
  orderListItem?: OrderListItem
  onOrderItemUpdate?: () => void
  onOrderUpdate?: () => void
}

interface OrderTypeOption {
  value: OrderType.DINE | OrderType.PICKUP | OrderType.DELIVERY // | OrderType.AGGREGATOR
  label: string
  serviceTypeName: "Dine In" | "Pickup" | "Delivery" // | "Aggregator"
}
export interface EnrichedOrderTypeOption extends OrderTypeOption {
  serviceTypeId: string
}

const orderTypeOptions: OrderTypeOption[] = [
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

export interface OrderInfoInterface {
  selectedTable: Table | null
  customerId: string | null
  isNewCustomer: boolean
  orderInstruction: string | null
  guestInfo: UnifiedCustomerInfo | null
}

const defaultGuestInfo: UnifiedCustomerInfo = {
  first_name: "",
  last_name: "",
  phone: "",
  phone_code: "",
  email: "",
  address_1: "",
  address_2: "",
  landmark: "",
  city: "",
  state: "",
  country: "",
  pincode: "",
  longitude: 0,
  latitude: 0,
}

const areModifiersEqual = (
  cartModifiers: ModifierInfo[],
  newModifiers: ModifierInfo[]
): boolean => {
  // First check if arrays have the same length
  if (cartModifiers.length !== newModifiers.length) {
    return false
  }

  // Sort both arrays to ensure consistent comparison order
  const sortedCartModifiers = [...cartModifiers].sort((a, b) =>
    a.modifier_id.localeCompare(b.modifier_id)
  )
  const sortedNewModifiers = [...newModifiers].sort((a, b) =>
    a.modifier_id.localeCompare(b.modifier_id)
  )

  // Compare each modifier object field by field
  return sortedCartModifiers.every((cartMod, index) => {
    const newMod = sortedNewModifiers[index]
    return (
      cartMod.modifier_id === newMod.modifier_id &&
      cartMod.modifier_name === newMod.modifier_name &&
      cartMod.modifier_option_id === newMod.modifier_option_id &&
      cartMod.modifier_option_name === newMod.modifier_option_name &&
      Number(cartMod.modifier_option_price) ===
        Number(newMod.modifier_option_price)
    )
  })
}

const EditOrderDialog: React.FC<EditOrderDialogProps> = ({
  order,
  table,
  isLoading,
  orderListItem,
  onOrderItemUpdate,
}) => {
  const [open, setOpen] = useState(false)
  const { cart, addItemToCart, clearCart, currency, calculateTotalPrice } =
    useCart()
  const { brandId, brand } = useAuth()
  const [search, setSearch] = useState<string>("")
  const [isSmallIconView, setIsSmallIconView] = useState(false)
  const [orderInfo, setOrderInfo] = useState<OrderInfoInterface>({
    guestInfo: defaultGuestInfo,
    selectedTable: null as Table | null,
    customerId: null as string | null,
    isNewCustomer: true,
    orderInstruction: null as string | null,
  })

  const [orderInstruction, setOrderInstruction] = useState<string | null>(null)

  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  const [serviceType, setServiceType] =
    useState<EnrichedOrderTypeOption | null>(null)

  const { mutate: updateOrderItem, isPending, error } = useUpdateOrderItem()
  const { mutate: updateOrder, isPending: isUpdateOrderPending } =
    useUpdateOrder()

  useEffect(() => {
    if (open && order) {
      setOrderInfo({
        selectedTable: null,
        customerId: orderListItem?.customer?.id || null,
        isNewCustomer: false,
        orderInstruction: order?.order_instruction,
        guestInfo: {
          ...order.customer_info,
          longitude: Number(order.customer_info.longitude ?? "0"),
          latitude: Number(order.customer_info.latitude ?? "0"),
        },
      })

      setOrderInstruction(order?.order_instruction)

      clearCart()

      let orderType = order?.order_type as OrderType
      if (orderType === OrderType.AGGREGATOR) {
        orderType = OrderType.PICKUP
      }

      order.items_details?.forEach((itemDetail) => {
        addItemToCart(
          {
            item_id: itemDetail.item_id,
            item_name: itemDetail.item_name,
            item_details: "",
            categorie_id: "",
            brand_id: brandId!,
            service_type: {
              id: serviceType?.serviceTypeId || "",
              name: serviceType?.serviceTypeName || "",
            },
            supplier: "",
            discount: itemDetail.discount,
            discount_type: itemDetail.discount_type,
            base_price: itemDetail.price,
            currency: order.brand_info.currency,
            quantity_of_item: 0,
            status: "active",
            attachment: [],
          },
          orderType,
          itemDetail.modifier_list,
          itemDetail.id || "",
          itemDetail?.quantity
        )
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    order,
    open,
    brandId,
    serviceType?.serviceTypeId,
    serviceType?.serviceTypeName,
  ])

  const { data: serviceTypesData, isPending: isPendingServiceTypes } =
    useGetServiceTypes({
      page_limit: 20,
      page_size: 1,
      search: order?.order_type,
      brand_type_id:
        brand?.general_info?.business_identification.brand_type || "",
      brand_id: brandId || "",
    })

  useEffect(() => {
    setServiceType({
      ...(orderTypeOptions.find((item) => item.value === order?.order_type) || {
        value: OrderType.PICKUP,
        label: "Pickup",
        serviceTypeName: "Pickup",
      }),
      serviceTypeId:
        serviceTypesData?.data?.data?.service_type?.at(0)?.service_type_id ||
        "",
    })
  }, [order?.order_type, serviceTypesData?.data?.data?.service_type])

  const updateSearch = (newQuery: string) => {
    setSearch(newQuery)
  }

  const handleUpdateOrderItem = (args: {
    item: ItemsDetails
    action: "plus" | "minus" | "delete" | "create"
  }) => {
    let quantity = args.item?.quantity
    switch (args.action) {
      case "plus": {
        quantity += 1
        break
      }
      case "minus": {
        quantity > 0 ? (quantity -= 1) : (quantity = 0)
        break
      }
      case "delete": {
        quantity = 0
        break
      }
      case "create": {
        quantity = 1
        break
      }
    }

    const updateOrderItemBody: UpdateOrderItemBody = {
      order_id: order?.order_id || "",
      order_item_id:
        args.action === "create" ? args.item?.item_id : args.item?.id,
      price: args.item?.price || 0,
      quantity: quantity,
    }

    updateOrderItem(updateOrderItemBody, {
      onSuccess: (data) => {
        onOrderItemUpdate?.()
        toast({
          title: "Order Item updated succcessfully",
        })
      },
      onError: (error: any) => {
        console.log("Order Item update error", error)
        const errorMessage = error.response?.data?.message || error.message
        toast({
          title: "Order Item update error",
          description: errorMessage,
        })
      },
    })
  }

  const handleAddOrderItem = (args: {
    item: ItemList
    modifiers?: ModifierInfo[]
  }) => {
    let isNewItem = true
    let existingCartItem: CartItemType | null = null
    for (let i = 0; i < cart.length; i++) {
      const cartItem = cart[i]
      if (cartItem.item_id !== args.item.item_id) {
        continue
      }

      if (!cartItem.modifier_list && !args.modifiers) {
        isNewItem = false
        existingCartItem = cartItem
        break
      }

      if (cartItem.modifier_list && args.modifiers) {
        isNewItem = !areModifiersEqual(cartItem.modifier_list, args.modifiers)
        if (!isNewItem) {
          existingCartItem = cartItem
          break
        }
      }
    }

    const updateOrderItemBody: UpdateOrderItemBody = isNewItem
      ? {
          order_id: order?.order_id || "",
          item_id: args.item?.item_id,
          price: args.item?.base_price,
          quantity: 1,
          discount: 0,
          discount_type: "flat",
          status: OrderStatuses.ORDERED,
          modifier_list: args.modifiers,
        }
      : {
          order_id: order?.order_id || "",
          order_item_id: existingCartItem?.order_item_id || "",
          price: existingCartItem?.item_price || 0,
          quantity: (existingCartItem?.quantity ?? 0) + 1,
        }

    updateOrderItem(updateOrderItemBody, {
      onSuccess: (data) => {
        onOrderItemUpdate?.()
        toast({
          title: "Order Item created succcessfully",
        })

        let orderType = order?.order_type as OrderType
        if (orderType === OrderType.AGGREGATOR) {
          orderType = OrderType.PICKUP
        }

        // addItemToCart(args.item, orderType, args.modifiers, undefined, args.item.quantity_of_item)
      },
      onError: (error: any) => {
        console.log("Order Item create error", error)
        const errorMessage = error.response?.data?.message || error.message
        toast({
          title: "Order Item create error",
          description: errorMessage,
        })
      },
    })
  }

  useEffect(() => {}, [order])

  const handleSaveOrder = () => {
    updateOrder(
      {
        order_id: order?.order_id || "",
        order_instruction: orderInfo?.orderInstruction || "",
        customer_info: {
          id: orderListItem?.customer?.id || "",
          ...orderInfo?.guestInfo,
          latitude: orderInfo?.guestInfo?.latitude?.toString(),
          longitude: orderInfo?.guestInfo?.longitude?.toString(),
          address_1:
            serviceType?.serviceTypeName !== "Delivery"
              ? ""
              : orderInfo?.guestInfo!.address_1,
          address_2:
            serviceType?.serviceTypeName !== "Delivery"
              ? ""
              : orderInfo?.guestInfo!.address_2,
        },
      },
      {
        onSuccess: (data) => {
          onOrderItemUpdate?.()
          toast({
            title: "Order saved succcessfully",
          })
          setOpen(false)
        },
        onError: (error: any) => {
          // Check if the error response has the specific structure
          const errorMessage = error.response?.data?.message || error.message
          toast({
            title: "Order save error",
            description: errorMessage,
          })
        },
      }
    )
  }

  const handleCancelAll = async () => {
    try {
      // Create an array of promises for all item deletions
      const itemsToDelete = [...cart]
      const deletePromises = itemsToDelete.map((cartItem) => {
        const deleteOrderItemBody: UpdateOrderItemBody = {
          order_id: order?.order_id || "",
          order_item_id: cartItem?.order_item_id || "",
          price: cartItem?.item_price || 0,
          quantity: 0,
        }

        return new Promise((resolve, reject) => {
          updateOrderItem(deleteOrderItemBody, {
            onSuccess: (data) => {
              resolve(data)
              clearCart()
              onOrderItemUpdate?.()
              toast({
                title: "All items cancelled successfully",
              })
            },
            onError: (error) => {
              reject(error)
            },
          })
        })
      })
    } catch (error) {
      console.error("Error cancelling items:", error)
      toast({
        title: "Error cancelling items",
      })
    }
  }

  return (
    <FullScreenDialog isOpen={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <IconButton
          className="w-[140px]"
          variant={"primaryOutlineLabel"}
          icon={EditIcon}
          disabled={isLoading}
        >
          Edit Order
        </IconButton>
      </DialogTrigger>
      <DialogFullScreenContent className="flex h-screen flex-col">
        <DialogHeader className="hidden">
          <DialogTitle>Table Detail</DialogTitle>
        </DialogHeader>
        <DialogDescription className="hidden">
          Table Detail Modal
        </DialogDescription>
        <div className=" flex h-full flex-row gap-4 bg-body-gradient px-4 py-7">
          <div className="flex h-full w-1/4 shrink-0 flex-col rounded-3 bg-white-100">
            <div className="flex w-full flex-grow-0 flex-col gap-2 px-6 pt-6">
              <div className="mb-4 flex flex-row gap-2">
                <h1 className="text-2xl font-bold text-gray-400">Edit Order</h1>
                <h1 className="text-2xl font-bold">{order?.order_number}</h1>
              </div>
              {order?.order_type === OrderType.DINE && (
                <div
                  className={cn(
                    "flex h-[48px] cursor-pointer items-center rounded-6 border border-black-10 bg-white-60 pr-4"
                  )}
                >
                  <div className="mr-2 flex h-[46px] min-w-[46px] items-center justify-center rounded-full bg-gray-100">
                    <IconWrapper
                      Component={TableBarIcon}
                      size={"20"}
                      color={"black40"}
                    />
                  </div>

                  <div className="flex flex-col text-left">
                    <span className={cn("text-black-60", fontCaptionNormal)}>
                      Table Number
                    </span>
                    {table?.name && (
                      <span className={cn("text-black-60", fontCaptionBold)}>
                        {table.name}
                      </span>
                    )}
                  </div>

                  <div className="ml-auto">
                    <IconWrapper
                      Component={ChevronDownIcon}
                      size="20"
                      color={"black40"}
                    />
                  </div>
                </div>
              )}

              <AddGuestInfoDialog
                serviceType={serviceType}
                orderInfo={orderInfo}
                setOrderInfo={setOrderInfo}
                onSave={() => {}}
              />
              <div className="mt-4 flex flex-row items-center justify-between px-4">
                <div className="flex flex-row gap-2">
                  <span className={cn(fontCaptionBold, "text-gray-500")}>
                    Items
                  </span>
                  <div
                    className={cn(
                      fontCaptionNormal,
                      "rounded-full bg-black px-2 text-white"
                    )}
                  >
                    {cart?.length}
                  </div>
                </div>
                <CancelAllItemDialog
                  disabled={cart.length === 0 || isPending}
                  onCancelAllItem={() => handleCancelAll()}
                />
              </div>
            </div>
            <div className="mt-2 flex h-full w-full flex-col gap-2 overflow-auto px-6">
              {order?.items_details?.map((item, index) => (
                <EditOrderItemDetailCard
                  isLoading={isPending}
                  item={item}
                  key={index}
                  onClickMinus={({ item }) => {
                    handleUpdateOrderItem({ item, action: "minus" })
                  }}
                  onClickPlus={({ item }) => {
                    handleUpdateOrderItem({ item, action: "plus" })
                  }}
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
                disabled={false}
                onClick={handleSaveOrder}
              >
                Save
              </MainButton>
            </div>
          </div>
          <div className="flex w-full min-w-0 flex-col gap-4">
            <div className="relative flex items-center">
              <div className="flex items-center gap-4">
                <SearchInput query={search} setQuery={updateSearch} />
                <IconButton
                  icon={isSmallIconView ? GridIcon : WindowIcon}
                  iconSize="24"
                  size="large"
                  variant={"primaryOutline"}
                  onClick={() => {
                    setIsSmallIconView(!isSmallIconView)
                  }}
                />
              </div>
              <IconButton
                className="absolute right-0 outline-none"
                variant="primaryWhite"
                size="large"
                icon={CloseIcon}
                iconSize="24"
                isActive={true}
                onClick={() => {
                  setOpen(false)
                }}
              />
            </div>
            <MenuPanel
              search={search}
              isSmallIconView={isSmallIconView}
              selectedServiceType={serviceType}
              addItemToCart={(item, modifiers) => {
                handleAddOrderItem({ item, modifiers })
              }}
            />
          </div>
        </div>
      </DialogFullScreenContent>
    </FullScreenDialog>
  )
}

export default EditOrderDialog
