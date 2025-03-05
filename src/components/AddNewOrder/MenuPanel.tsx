"use client"

import { useState } from "react"

import { EnrichedOrderTypeOption } from "@/types/interfaces/order.interface"
import ItemPanel from "@/components/AddNewOrder/ItemPanel"
import { CategorySection } from "@/components/categorySection"
import { MenuSection } from "@/components/menuSection"

interface MenuPanelComponentProps {
  search: string
  selectedServiceType: EnrichedOrderTypeOption | null
  isSmallIconView: boolean
}

export default function MenuPanelComponent({
  search,
  selectedServiceType,
  isSmallIconView,
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
          showBothCounts={false}
        />
      </div>
      <ItemPanel
        selectedCategory={selectedCategory}
        search={search}
        itemStatus="active"
        selectedServiceType={selectedServiceType}
        isSmallIconView={isSmallIconView}
      />
    </div>
  )
}
