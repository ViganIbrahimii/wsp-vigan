import React, { useEffect, useRef } from "react"

import { MenuItem } from "@/components/menuItem"
import { mockMenus } from "@/components/MenuManagement/mockData"

interface MenuSectionProps {
  selectedMenu: string | null
  handleMenuSelect: (menuId: string) => void
}

export function MenuSection({
  selectedMenu,
  handleMenuSelect,
}: MenuSectionProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const handleWheel = (
    ref: React.RefObject<HTMLDivElement>,
    e: React.WheelEvent
  ) => {
    if (ref.current) {
      ref.current.scrollLeft += e.deltaY // Horizontal scrolling
    }
  }

  useEffect(() => {
    if (mockMenus.length > 0 && !selectedMenu) {
      handleMenuSelect(mockMenus[0].id) // Select the first menu
    }
  }, [selectedMenu, handleMenuSelect])

  return (
    <div
      ref={scrollRef}
      onWheel={(e) => handleWheel(scrollRef, e)}
      className="scrollbar-hide mx-8 overflow-x-auto"
    >
      <div className="flex min-h-[64px] w-full gap-2">
        {mockMenus.map((menu) => (
          <MenuItem
            key={`menu-${menu.id}`}
            aria-selected={selectedMenu === menu.id}
            onClick={() => handleMenuSelect(menu.id)}
            isActive={selectedMenu === menu.id}
            className="min-w-[160px]"
          >
            <p className="line-clamp-2 max-h-[3rem] overflow-hidden break-words">
              {menu.name}
            </p>
          </MenuItem>
        ))}
      </div>
    </div>
  )
}
