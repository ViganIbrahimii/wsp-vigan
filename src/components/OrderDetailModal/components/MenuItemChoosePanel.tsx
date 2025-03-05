"use client"

import { useState } from "react"
import { ModifierInfo } from "@/api/orders/create"
import { useCart } from "@/providers/CartProvider"

import { ItemList } from "@/types/interfaces/item.interface"
import { EnrichedOrderTypeOption } from "@/types/interfaces/order.interface"
import { CategorySection } from "@/components/categorySection"
import { MenuSection } from "@/components/menuSection"

import MenuItemPanel from "./MenuItemPanel"

interface MenuPanelComponentProps {
  search: string
  selectedServiceType: EnrichedOrderTypeOption | null
  isSmallIconView: boolean
  addItemToCart: (item: ItemList, modifiers?: ModifierInfo[]) => void
}

export default function MenuPanelComponent({
  search,
  selectedServiceType,
  isSmallIconView,
  addItemToCart,
}: MenuPanelComponentProps) {
  const [selectedMenu, setSelectedMenu] = useState<string | null>("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>("")

  const handleMenuSelect = (menuId: string) => {
    setSelectedMenu(menuId)
    setSelectedCategory(null) // Reset category when menu changes
  }

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
  }

  return (
    <div className="flex flex-grow flex-col gap-4 overflow-hidden">
      <div className="shrink-0">
        <MenuSection
          selectedMenu={selectedMenu}
          handleMenuSelect={handleMenuSelect}
        />
        <CategorySection
          selectedCategory={selectedCategory}
          menuId={selectedMenu}
          handleCategorySelect={handleCategorySelect}
          categoryStatus={["active"]}
        />
      </div>
      <MenuItemPanel
        selectedCategory={selectedCategory}
        search={search}
        itemStatus="active"
        selectedServiceType={selectedServiceType}
        isSmallIconView={isSmallIconView}
        onAddItemToCart={addItemToCart}
      />
    </div>
  )
}
