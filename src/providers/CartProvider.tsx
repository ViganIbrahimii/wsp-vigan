import React, { createContext, ReactNode, useContext, useState } from "react"
import { ItemInfo, ModifierInfo } from "@/api/orders/create"
import { OrderType } from "@/constants/orderTypes"

import { ItemList } from "@/types/interfaces/item.interface"

// Define cart item structure
export type CartItemType = ItemInfo & {
  item_name: string
  order_item_id?: string
  item_price: number
}

// Define cart context type
interface CartContextType {
  cart: CartItemType[]
  addItemToCart: (
    item: ItemList,
    orderType: OrderType,
    modifiers?: ModifierInfo[],
    order_item_id?: string,
    order_item_quantity?: number
  ) => void
  currency: string | null // Add currency to the context
  setCurrency: (currency: string) => void
  removeItemFromCart: (itemId: string, modifiers?: ModifierInfo[]) => void
  clearCart: () => void
  increaseQuantity: (itemId: string, modifiers?: ModifierInfo[]) => void
  decreaseQuantity: (itemId: string, modifiers?: ModifierInfo[]) => void
  countItemInCart: (itemId: string) => number
  isItemInCart: (itemId: string) => boolean
  getPriceForServiceType: (orderType: OrderType, item: ItemList) => number
  calculateTotalPrice: () => number
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Cart Provider Component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItemType[]>([])
  const [currency, setCurrencyState] = useState<string | null>(null)

  const setCurrency = (newCurrency: string) => {
    if (currency && currency !== newCurrency) {
      console.log("currency", currency, "safasf", newCurrency)
      console.error(
        "Currency mismatch: Cart already contains items in a different currency."
      )
    }
    setCurrencyState(newCurrency)
  }

  const addItemToCart = (
    item: ItemList,
    orderType: OrderType,
    modifiers?: ModifierInfo[],
    order_item_id?: string,
    order_item_quantity?: number
  ) => {
    setCurrency(item.currency)
    setCart((prevCart) => {
      const normalizedModifiers = modifiers || []

      const existingItemIndex = prevCart.findIndex(
        (cartItem) =>
          cartItem.item_id === item.item_id &&
          JSON.stringify(cartItem.modifier_list || []) ===
            JSON.stringify(normalizedModifiers)
      )

      const itemPrice = getPriceForServiceType(orderType, item)

      if (existingItemIndex > -1) {
        return prevCart.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      }

      const cartItem: CartItemType = {
        order_item_id: order_item_id,
        item_id: item.item_id,
        item_name: item.item_name,
        quantity: order_item_quantity ?? 1,
        item_price: itemPrice,
        ...(normalizedModifiers.length > 0 && {
          modifier_list: normalizedModifiers,
        }),
      }

      return [...prevCart, cartItem]
    })
  }

  const removeItemFromCart = (itemId: string, modifiers?: ModifierInfo[]) => {
    const normalizedModifiers = modifiers || []

    setCart((prevCart) =>
      prevCart.filter(
        (cartItem) =>
          !(
            cartItem.item_id === itemId &&
            JSON.stringify(cartItem.modifier_list || []) ===
              JSON.stringify(normalizedModifiers)
          )
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const increaseQuantity = (itemId: string, modifiers?: ModifierInfo[]) => {
    const normalizedModifiers = modifiers || []

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.item_id === itemId &&
        JSON.stringify(item.modifier_list || []) ===
          JSON.stringify(normalizedModifiers)
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    )
  }

  const decreaseQuantity = (itemId: string, modifiers?: ModifierInfo[]) => {
    const normalizedModifiers = modifiers || []

    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.item_id === itemId &&
          JSON.stringify(item.modifier_list || []) ===
            JSON.stringify(normalizedModifiers)
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const countItemInCart = (itemId: string) => {
    return cart
      .filter((item) => item.item_id === itemId)
      .reduce((total, item) => total + item.quantity, 0)
  }

  const isItemInCart = (itemId: String) => {
    return cart.some((item) => item.item_id === itemId)
  }

  //To be Modified when other price fields are added
  const getPriceForServiceType = (
    orderType: OrderType,
    item: ItemList
  ): number => {
    if (orderType === OrderType.DELIVERY) {
      return item.base_price
    }
    return item.base_price
  }

  const calculateTotalPrice = (): number => {
    return cart.reduce((total, item) => {
      const basePrice = item.item_price || 0

      const modifiersTotal = (item.modifier_list || []).reduce(
        (modTotal, modifier) =>
          modTotal + parseFloat(modifier.modifier_option_price || "0"),
        0
      )

      // Add item's total price including modifiers, multiplied by quantity
      return total + (basePrice + modifiersTotal) * (item.quantity || 1)
    }, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        currency,
        setCurrency,
        addItemToCart,
        removeItemFromCart,
        clearCart,
        increaseQuantity,
        decreaseQuantity,
        countItemInCart,
        isItemInCart,
        getPriceForServiceType,
        calculateTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
