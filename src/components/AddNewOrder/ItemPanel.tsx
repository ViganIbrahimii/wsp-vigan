"use client"

import { useEffect, useRef, useState } from "react"
import { ItemStatus } from "@/api/items"
import { OrderType } from "@/constants/orderTypes"
import { AddIcon } from "@/icons"
import { useAuth } from "@/providers/AuthProvider/AuthProvider"
import { useCart } from "@/providers/CartProvider"

import { ItemList } from "@/types/interfaces/item.interface"
import { EnrichedOrderTypeOption } from "@/types/interfaces/order.interface"
import { useGetItemsInfinite } from "@/lib/hooks/queries/items/useGetItemsInfinite"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/badge" // Adjust the import path as necessary

import HighlightedText from "@/components/highlightedText"
import { IconButton } from "@/components/iconButton"
import { fontCaptionBold, fontCaptionNormal } from "@/styles/typography"

import ItemModifiersModal from "./ModifiersDialog"

// Mock item data - using category IDs that match the mockCategories in MenuManagement/mockData.ts
const mockItems: ItemList[] = [
  {
    item_id: "item-1",
    item_name: "Pepperoni Pizza",
    item_details: "Classic pepperoni pizza with mozzarella cheese",
    categorie_id: "2", // Main Course
    brand_id: "brand-1",
    service_type: {
      id: "service-1",
      name: "Food",
    },
    supplier: "Pizza Supplier",
    discount: 0,
    discount_type: "percentage",
    base_price: 15.99,
    currency: "$",
    quantity_of_item: 100,
    status: "active",
    attachment: [],
    is_dine_in_enabled: true,
    is_delivery_enabled: true,
    is_pickup_enabled: true,
    modifiers: [
      {
        modifier_id: "mod-1",
        modifier_name: "Size",
        modifier_detail: [
          {
            option_id: "opt-1",
            option_name: "Small",
            price: 0,
            kcal: 800,
            grams: 300,
            proteins: 20,
            carbs: 40,
            fats: 15,
            is_default: false,
          },
          {
            option_id: "opt-2",
            option_name: "Medium",
            price: 2,
            kcal: 1200,
            grams: 450,
            proteins: 30,
            carbs: 60,
            fats: 22,
            is_default: true,
          },
          {
            option_id: "opt-3",
            option_name: "Large",
            price: 4,
            kcal: 1600,
            grams: 600,
            proteins: 40,
            carbs: 80,
            fats: 30,
            is_default: false,
          },
        ],
      },
      {
        modifier_id: "mod-2",
        modifier_name: "Crust",
        modifier_detail: [
          {
            option_id: "opt-4",
            option_name: "Thin",
            price: 0,
            kcal: 0,
            grams: 0,
            proteins: 0,
            carbs: 0,
            fats: 0,
            is_default: true,
          },
          {
            option_id: "opt-5",
            option_name: "Thick",
            price: 1,
            kcal: 100,
            grams: 50,
            proteins: 5,
            carbs: 15,
            fats: 3,
            is_default: false,
          },
          {
            option_id: "opt-6",
            option_name: "Stuffed",
            price: 2,
            kcal: 200,
            grams: 100,
            proteins: 10,
            carbs: 30,
            fats: 6,
            is_default: false,
          },
        ],
      },
    ],
  },
  {
    item_id: "item-2",
    item_name: "Margherita Pizza",
    item_details: "Classic Italian pizza with tomato, mozzarella, and basil",
    categorie_id: "2", // Main Course
    brand_id: "brand-1",
    service_type: {
      id: "service-1",
      name: "Food",
    },
    supplier: "Pizza Supplier",
    discount: 0,
    discount_type: "percentage",
    base_price: 13.99,
    currency: "$",
    quantity_of_item: 100,
    status: "active",
    attachment: [],
    is_dine_in_enabled: true,
    is_delivery_enabled: true,
    is_pickup_enabled: true,
    modifiers: [
      {
        modifier_id: "mod-1",
        modifier_name: "Size",
        modifier_detail: [
          {
            option_id: "opt-1",
            option_name: "Small",
            price: 0,
            kcal: 700,
            grams: 280,
            proteins: 18,
            carbs: 35,
            fats: 12,
            is_default: false,
          },
          {
            option_id: "opt-2",
            option_name: "Medium",
            price: 2,
            kcal: 1000,
            grams: 420,
            proteins: 25,
            carbs: 55,
            fats: 18,
            is_default: true,
          },
          {
            option_id: "opt-3",
            option_name: "Large",
            price: 4,
            kcal: 1400,
            grams: 560,
            proteins: 35,
            carbs: 70,
            fats: 25,
            is_default: false,
          },
        ],
      },
    ],
  },
  {
    item_id: "item-3",
    item_name: "Vegetarian Pizza",
    item_details: "Fresh vegetables on a tomato base with mozzarella",
    categorie_id: "2", // Main Course
    brand_id: "brand-1",
    service_type: {
      id: "service-1",
      name: "Food",
    },
    supplier: "Pizza Supplier",
    discount: 0,
    discount_type: "percentage",
    base_price: 14.99,
    currency: "$",
    quantity_of_item: 100,
    status: "active",
    attachment: [],
    is_dine_in_enabled: true,
    is_delivery_enabled: true,
    is_pickup_enabled: true,
    modifiers: [],
  },
  {
    item_id: "item-4",
    item_name: "BBQ Chicken Pizza",
    item_details: "Grilled chicken with BBQ sauce and red onions",
    categorie_id: "2", // Main Course
    brand_id: "brand-1",
    service_type: {
      id: "service-1",
      name: "Food",
    },
    supplier: "Pizza Supplier",
    discount: 5,
    discount_type: "percentage",
    base_price: 16.99,
    currency: "$",
    quantity_of_item: 100,
    status: "active",
    attachment: [],
    is_dine_in_enabled: true,
    is_delivery_enabled: true,
    is_pickup_enabled: true,
    modifiers: [],
  },
  {
    item_id: "item-5",
    item_name: "Coke",
    item_details: "Refreshing cola drink",
    categorie_id: "4", // Beverages
    brand_id: "brand-1",
    service_type: {
      id: "service-2",
      name: "Beverage",
    },
    supplier: "Beverage Supplier",
    discount: 0,
    discount_type: "percentage",
    base_price: 2.99,
    currency: "$",
    quantity_of_item: 200,
    status: "active",
    attachment: [],
    is_dine_in_enabled: true,
    is_delivery_enabled: true,
    is_pickup_enabled: true,
    modifiers: [
      {
        modifier_id: "mod-3",
        modifier_name: "Size",
        modifier_detail: [
          {
            option_id: "opt-7",
            option_name: "Small",
            price: 0,
            kcal: 150,
            grams: 330,
            proteins: 0,
            carbs: 39,
            fats: 0,
            is_default: false,
          },
          {
            option_id: "opt-8",
            option_name: "Medium",
            price: 1,
            kcal: 210,
            grams: 500,
            proteins: 0,
            carbs: 55,
            fats: 0,
            is_default: true,
          },
          {
            option_id: "opt-9",
            option_name: "Large",
            price: 1.5,
            kcal: 290,
            grams: 700,
            proteins: 0,
            carbs: 75,
            fats: 0,
            is_default: false,
          },
        ],
      },
      {
        modifier_id: "mod-4",
        modifier_name: "Ice",
        modifier_detail: [
          {
            option_id: "opt-10",
            option_name: "No Ice",
            price: 0,
            kcal: 0,
            grams: 0,
            proteins: 0,
            carbs: 0,
            fats: 0,
            is_default: false,
          },
          {
            option_id: "opt-11",
            option_name: "Light Ice",
            price: 0,
            kcal: 0,
            grams: 0,
            proteins: 0,
            carbs: 0,
            fats: 0,
            is_default: false,
          },
          {
            option_id: "opt-12",
            option_name: "Regular Ice",
            price: 0,
            kcal: 0,
            grams: 0,
            proteins: 0,
            carbs: 0,
            fats: 0,
            is_default: true,
          },
        ],
      },
    ],
  },
  {
    item_id: "item-6",
    item_name: "Sprite",
    item_details: "Refreshing lemon-lime soda",
    categorie_id: "4", // Beverages
    brand_id: "brand-1",
    service_type: {
      id: "service-2",
      name: "Beverage",
    },
    supplier: "Beverage Supplier",
    discount: 0,
    discount_type: "percentage",
    base_price: 2.99,
    currency: "$",
    quantity_of_item: 200,
    status: "active",
    attachment: [],
    is_dine_in_enabled: true,
    is_delivery_enabled: true,
    is_pickup_enabled: true,
    modifiers: [],
  },
  {
    item_id: "item-7",
    item_name: "Garlic Bread",
    item_details: "Freshly baked bread with garlic butter",
    categorie_id: "1", // Appetizers
    brand_id: "brand-1",
    service_type: {
      id: "service-1",
      name: "Food",
    },
    supplier: "Bakery Supplier",
    discount: 0,
    discount_type: "percentage",
    base_price: 4.99,
    currency: "$",
    quantity_of_item: 50,
    status: "active",
    attachment: [],
    is_dine_in_enabled: true,
    is_delivery_enabled: true,
    is_pickup_enabled: true,
    modifiers: [],
  },
  {
    item_id: "item-8",
    item_name: "Chicken Wings",
    item_details: "Spicy chicken wings with blue cheese dip",
    categorie_id: "1", // Appetizers
    brand_id: "brand-1",
    service_type: {
      id: "service-1",
      name: "Food",
    },
    supplier: "Meat Supplier",
    discount: 0,
    discount_type: "percentage",
    base_price: 8.99,
    currency: "$",
    quantity_of_item: 50,
    status: "active",
    attachment: [],
    is_dine_in_enabled: true,
    is_delivery_enabled: true,
    is_pickup_enabled: true,
    modifiers: [
      {
        modifier_id: "mod-5",
        modifier_name: "Sauce",
        modifier_detail: [
          {
            option_id: "opt-13",
            option_name: "Buffalo",
            price: 0,
            kcal: 50,
            grams: 30,
            proteins: 0,
            carbs: 2,
            fats: 5,
            is_default: true,
          },
          {
            option_id: "opt-14",
            option_name: "BBQ",
            price: 0,
            kcal: 70,
            grams: 30,
            proteins: 0,
            carbs: 15,
            fats: 0,
            is_default: false,
          },
          {
            option_id: "opt-15",
            option_name: "Honey Garlic",
            price: 0,
            kcal: 80,
            grams: 30,
            proteins: 0,
            carbs: 18,
            fats: 0,
            is_default: false,
          },
        ],
      },
    ],
  },
  {
    item_id: "item-9",
    item_name: "Caesar Salad",
    item_details: "Fresh romaine lettuce with Caesar dressing and croutons",
    categorie_id: "1", // Appetizers
    brand_id: "brand-1",
    service_type: {
      id: "service-1",
      name: "Food",
    },
    supplier: "Produce Supplier",
    discount: 0,
    discount_type: "percentage",
    base_price: 7.99,
    currency: "$",
    quantity_of_item: 30,
    status: "active",
    attachment: [],
    is_dine_in_enabled: true,
    is_delivery_enabled: true,
    is_pickup_enabled: true,
    modifiers: [],
  },
  {
    item_id: "item-10",
    item_name: "Greek Salad",
    item_details: "Fresh vegetables with feta cheese and olives",
    categorie_id: "1", // Appetizers
    brand_id: "brand-1",
    service_type: {
      id: "service-1",
      name: "Food",
    },
    supplier: "Produce Supplier",
    discount: 0,
    discount_type: "percentage",
    base_price: 8.99,
    currency: "$",
    quantity_of_item: 30,
    status: "active",
    attachment: [],
    is_dine_in_enabled: true,
    is_delivery_enabled: true,
    is_pickup_enabled: true,
    modifiers: [],
  },
  {
    item_id: "item-11",
    item_name: "Chocolate Cake",
    item_details: "Rich chocolate cake with ganache",
    categorie_id: "3", // Desserts
    brand_id: "brand-1",
    service_type: {
      id: "service-3",
      name: "Dessert",
    },
    supplier: "Bakery Supplier",
    discount: 0,
    discount_type: "percentage",
    base_price: 5.99,
    currency: "$",
    quantity_of_item: 20,
    status: "active",
    attachment: [],
    is_dine_in_enabled: true,
    is_delivery_enabled: true,
    is_pickup_enabled: true,
    modifiers: [],
  },
  {
    item_id: "item-12",
    item_name: "Cheesecake",
    item_details: "Creamy New York style cheesecake",
    categorie_id: "3", // Desserts
    brand_id: "brand-1",
    service_type: {
      id: "service-3",
      name: "Dessert",
    },
    supplier: "Bakery Supplier",
    discount: 0,
    discount_type: "percentage",
    base_price: 6.99,
    currency: "$",
    quantity_of_item: 20,
    status: "active",
    attachment: [],
    is_dine_in_enabled: true,
    is_delivery_enabled: true,
    is_pickup_enabled: true,
    modifiers: [],
  },
  {
    item_id: "item-13",
    item_name: "French Fries",
    item_details: "Crispy golden fries with sea salt",
    categorie_id: "1", // Appetizers
    brand_id: "brand-1",
    service_type: {
      id: "service-1",
      name: "Food",
    },
    supplier: "Produce Supplier",
    discount: 0,
    discount_type: "percentage",
    base_price: 3.99,
    currency: "$",
    quantity_of_item: 100,
    status: "active",
    attachment: [],
    is_dine_in_enabled: true,
    is_delivery_enabled: true,
    is_pickup_enabled: true,
    modifiers: [],
  },
  {
    item_id: "item-14",
    item_name: "Onion Rings",
    item_details: "Crispy battered onion rings",
    categorie_id: "1", // Appetizers
    brand_id: "brand-1",
    service_type: {
      id: "service-1",
      name: "Food",
    },
    supplier: "Produce Supplier",
    discount: 0,
    discount_type: "percentage",
    base_price: 4.49,
    currency: "$",
    quantity_of_item: 80,
    status: "active",
    attachment: [],
    is_dine_in_enabled: true,
    is_delivery_enabled: true,
    is_pickup_enabled: true,
    modifiers: [],
  },
  {
    item_id: "item-15",
    item_name: "Iced Tea",
    item_details: "Refreshing house-brewed iced tea",
    categorie_id: "4", // Beverages
    brand_id: "brand-1",
    service_type: {
      id: "service-2",
      name: "Beverage",
    },
    supplier: "Beverage Supplier",
    discount: 0,
    discount_type: "percentage",
    base_price: 2.49,
    currency: "$",
    quantity_of_item: 150,
    status: "active",
    attachment: [],
    is_dine_in_enabled: true,
    is_delivery_enabled: true,
    is_pickup_enabled: true,
    modifiers: [],
  },
  {
    item_id: "item-16",
    item_name: "Mozzarella Sticks",
    item_details: "Crispy breaded mozzarella sticks with marinara sauce",
    categorie_id: "1", // Appetizers
    brand_id: "brand-1",
    service_type: {
      id: "service-1",
      name: "Food",
    },
    supplier: "Dairy Supplier",
    discount: 0,
    discount_type: "percentage",
    base_price: 7.99,
    currency: "$",
    quantity_of_item: 80,
    status: "active",
    attachment: [],
    is_dine_in_enabled: true,
    is_delivery_enabled: true,
    is_pickup_enabled: true,
    modifiers: [],
  },
  {
    item_id: "item-17",
    item_name: "Loaded Potato Skins",
    item_details:
      "Crispy potato skins topped with cheese, bacon, and sour cream",
    categorie_id: "1", // Appetizers
    brand_id: "brand-1",
    service_type: {
      id: "service-1",
      name: "Food",
    },
    supplier: "Produce Supplier",
    discount: 0,
    discount_type: "percentage",
    base_price: 8.49,
    currency: "$",
    quantity_of_item: 60,
    status: "active",
    attachment: [],
    is_dine_in_enabled: true,
    is_delivery_enabled: true,
    is_pickup_enabled: true,
    modifiers: [],
  },
  {
    item_id: "item-18",
    item_name: "Spinach Artichoke Dip",
    item_details: "Creamy spinach and artichoke dip served with tortilla chips",
    categorie_id: "1", // Appetizers
    brand_id: "brand-1",
    service_type: {
      id: "service-1",
      name: "Food",
    },
    supplier: "Dairy Supplier",
    discount: 0,
    discount_type: "percentage",
    base_price: 9.99,
    currency: "$",
    quantity_of_item: 50,
    status: "active",
    attachment: [],
    is_dine_in_enabled: true,
    is_delivery_enabled: true,
    is_pickup_enabled: true,
    modifiers: [],
  },
  {
    item_id: "item-19",
    item_name: "Bruschetta",
    item_details: "Toasted bread topped with fresh tomatoes, basil, and garlic",
    categorie_id: "1", // Appetizers
    brand_id: "brand-1",
    service_type: {
      id: "service-1",
      name: "Food",
    },
    supplier: "Bakery Supplier",
    discount: 0,
    discount_type: "percentage",
    base_price: 6.99,
    currency: "$",
    quantity_of_item: 70,
    status: "active",
    attachment: [],
    is_dine_in_enabled: true,
    is_delivery_enabled: true,
    is_pickup_enabled: true,
    modifiers: [],
  },
  {
    item_id: "item-20",
    item_name: "Calamari",
    item_details: "Lightly fried calamari served with lemon and marinara sauce",
    categorie_id: "1", // Appetizers
    brand_id: "brand-1",
    service_type: {
      id: "service-1",
      name: "Food",
    },
    supplier: "Seafood Supplier",
    discount: 0,
    discount_type: "percentage",
    base_price: 10.99,
    currency: "$",
    quantity_of_item: 40,
    status: "active",
    attachment: [],
    is_dine_in_enabled: true,
    is_delivery_enabled: true,
    is_pickup_enabled: true,
    modifiers: [],
  },
  {
    item_id: "item-21",
    item_name: "Nachos",
    item_details:
      "Tortilla chips topped with cheese, jalapeños, salsa, and sour cream",
    categorie_id: "1", // Appetizers
    brand_id: "brand-1",
    service_type: {
      id: "service-1",
      name: "Food",
    },
    supplier: "Produce Supplier",
    discount: 0,
    discount_type: "percentage",
    base_price: 9.49,
    currency: "$",
    quantity_of_item: 65,
    status: "active",
    attachment: [],
    is_dine_in_enabled: true,
    is_delivery_enabled: true,
    is_pickup_enabled: true,
    modifiers: [
      {
        modifier_id: "mod-6",
        modifier_name: "Add Protein",
        modifier_detail: [
          {
            option_id: "opt-16",
            option_name: "Ground Beef",
            price: 2.5,
            kcal: 150,
            grams: 100,
            proteins: 15,
            carbs: 0,
            fats: 10,
            is_default: false,
          },
          {
            option_id: "opt-17",
            option_name: "Grilled Chicken",
            price: 2.5,
            kcal: 120,
            grams: 100,
            proteins: 22,
            carbs: 0,
            fats: 3,
            is_default: false,
          },
          {
            option_id: "opt-18",
            option_name: "None",
            price: 0,
            kcal: 0,
            grams: 0,
            proteins: 0,
            carbs: 0,
            fats: 0,
            is_default: true,
          },
        ],
      },
    ],
  },
  {
    item_id: "item-22",
    item_name: "Shrimp Cocktail",
    item_details: "Chilled jumbo shrimp served with cocktail sauce",
    categorie_id: "1", // Appetizers
    brand_id: "brand-1",
    service_type: {
      id: "service-1",
      name: "Food",
    },
    supplier: "Seafood Supplier",
    discount: 0,
    discount_type: "percentage",
    base_price: 12.99,
    currency: "$",
    quantity_of_item: 35,
    status: "active",
    attachment: [],
    is_dine_in_enabled: true,
    is_delivery_enabled: true,
    is_pickup_enabled: true,
    modifiers: [],
  },
  {
    item_id: "item-23",
    item_name: "Stuffed Mushrooms",
    item_details: "Mushroom caps filled with herb and cheese stuffing",
    categorie_id: "1", // Appetizers
    brand_id: "brand-1",
    service_type: {
      id: "service-1",
      name: "Food",
    },
    supplier: "Produce Supplier",
    discount: 0,
    discount_type: "percentage",
    base_price: 8.99,
    currency: "$",
    quantity_of_item: 45,
    status: "active",
    attachment: [],
    is_dine_in_enabled: true,
    is_delivery_enabled: true,
    is_pickup_enabled: true,
    modifiers: [],
  },
  {
    item_id: "item-24",
    item_name: "Hummus Platter",
    item_details:
      "Creamy hummus served with warm pita bread and fresh vegetables",
    categorie_id: "1", // Appetizers
    brand_id: "brand-1",
    service_type: {
      id: "service-1",
      name: "Food",
    },
    supplier: "Produce Supplier",
    discount: 0,
    discount_type: "percentage",
    base_price: 9.99,
    currency: "$",
    quantity_of_item: 55,
    status: "active",
    attachment: [],
    is_dine_in_enabled: true,
    is_delivery_enabled: true,
    is_pickup_enabled: true,
    modifiers: [],
  },
  {
    item_id: "item-25",
    item_name: "Quesadilla",
    item_details:
      "Grilled flour tortilla filled with cheese, served with salsa and sour cream",
    categorie_id: "1", // Appetizers
    brand_id: "brand-1",
    service_type: {
      id: "service-1",
      name: "Food",
    },
    supplier: "Produce Supplier",
    discount: 0,
    discount_type: "percentage",
    base_price: 7.99,
    currency: "$",
    quantity_of_item: 60,
    status: "active",
    attachment: [],
    is_dine_in_enabled: true,
    is_delivery_enabled: true,
    is_pickup_enabled: true,
    modifiers: [
      {
        modifier_id: "mod-7",
        modifier_name: "Add Protein",
        modifier_detail: [
          {
            option_id: "opt-19",
            option_name: "Grilled Chicken",
            price: 2.5,
            kcal: 120,
            grams: 100,
            proteins: 22,
            carbs: 0,
            fats: 3,
            is_default: false,
          },
          {
            option_id: "opt-20",
            option_name: "Steak",
            price: 3.5,
            kcal: 150,
            grams: 100,
            proteins: 25,
            carbs: 0,
            fats: 8,
            is_default: false,
          },
          {
            option_id: "opt-21",
            option_name: "None",
            price: 0,
            kcal: 0,
            grams: 0,
            proteins: 0,
            carbs: 0,
            fats: 0,
            is_default: true,
          },
        ],
      },
    ],
  },
]

interface ItemCardProps {
  item: ItemList
  search: string
  isSmallIconView: boolean
  serviceType: EnrichedOrderTypeOption | null
}

const ItemCard = ({
  item,
  search,
  isSmallIconView,
  serviceType,
}: ItemCardProps) => {
  const {
    addItemToCart,
    isItemInCart,
    countItemInCart,
    getPriceForServiceType,
  } = useCart()
  const [isModifierModalOpen, setIsModifierModalOpen] = useState(false)

  const handleItem = () => {
    if (item.modifiers && item.modifiers.length > 0) {
      setIsModifierModalOpen(true)
    } else {
      addItemToCart(item, serviceType?.value || OrderType.DINE)
    }
  }
  const count = countItemInCart(item.item_id)
  const isInCart = isItemInCart(item.item_id) ? "border-brand border-l-4" : ""

  const itemPrice = getPriceForServiceType(
    serviceType?.value || OrderType.DINE,
    item
  )

  return (
    <>
      {isSmallIconView ? (
        <div
          className={cn(
            "flex h-full w-full flex-col gap-4 rounded-3 bg-white-70 p-4",
            isInCart
          )}
        >
          <div className="flex h-full items-center justify-between gap-2">
            <p className={cn(fontCaptionBold, "line-clamp-2 break-words")}>
              <HighlightedText text={item.item_name} searchTerm={search} />
            </p>
            <div className="relative">
              {count > 0 && (
                <Badge
                  count={count}
                  variant={"black"}
                  size={"small"}
                  className={
                    "absolute right-[calc(100%-10px)] top-1 inline-flex -translate-y-1/2 transform"
                  }
                />
              )}
              <IconButton
                icon={AddIcon}
                variant={"secondaryOutline"}
                size={"small"}
                onClick={handleItem}
              />
            </div>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "flex h-full min-h-[130px] w-full flex-col gap-4 rounded-3 bg-white-70 p-4 ",
            isInCart
          )}
        >
          <div className="flex h-full flex-col justify-between gap-2">
            <p className={cn(fontCaptionBold, "break-words")}>
              <HighlightedText text={item.item_name} searchTerm={search} />
            </p>
            <div className="flex items-center justify-between">
              <p className={cn(fontCaptionNormal, "text-black-60")}>
                <HighlightedText
                  text={`${item.currency}${itemPrice?.toFixed(2)}`}
                  searchTerm={search}
                />
              </p>
              <div className="relative">
                {count > 0 && (
                  <Badge
                    count={count}
                    variant={"black"}
                    size={"small"}
                    className={
                      "absolute right-[calc(100%-10px)] top-1 inline-flex -translate-y-1/2 transform"
                    }
                  />
                )}
                <IconButton
                  icon={AddIcon}
                  variant={"secondaryOutline"}
                  size={"small"}
                  onClick={handleItem}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <ItemModifiersModal
        isOpen={isModifierModalOpen}
        serviceType={serviceType}
        onClose={() => {
          setIsModifierModalOpen(false)
        }}
        item={item}
      />
    </>
  )
}

interface ItemPanelComponentProps {
  selectedCategory: string | null
  selectedServiceType: EnrichedOrderTypeOption | null
  search: string
  itemStatus: ItemStatus
  isSmallIconView: boolean
}

export default function ItemPanelComponent({
  selectedCategory,
  selectedServiceType,
  search,
  itemStatus,
  isSmallIconView,
}: ItemPanelComponentProps) {
  const { brandId } = useAuth()

  // Filter items based on search and category
  const filteredItems = mockItems.filter((item) => {
    // Filter by search term
    const matchesSearch = search
      ? item.item_name.toLowerCase().includes(search.toLowerCase())
      : true

    // Filter by category if selected
    const matchesCategory = selectedCategory
      ? item.categorie_id === selectedCategory
      : true

    // Filter by status
    const matchesStatus = itemStatus ? item.status === itemStatus : true

    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="flex-grow overflow-y-auto">
      <div
        className={cn(
          "grid auto-rows-fr justify-start gap-4 py-4",
          isSmallIconView
            ? "grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))]"
            : "grid-cols-[repeat(auto-fill,_minmax(160px,_1fr))]"
        )}
      >
        {filteredItems.map((item, index) => (
          <ItemCard
            key={`${index}-${item.item_id}`}
            item={item}
            search={search}
            isSmallIconView={isSmallIconView}
            serviceType={selectedServiceType}
          />
        ))}
      </div>
    </div>
  )
}
