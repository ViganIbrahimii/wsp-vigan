import React, { useEffect, useRef } from "react"
import { useAuth } from "@/providers/AuthProvider/AuthProvider"

import { useGetMenusInfinite } from "@/lib/hooks/queries/menu/useGetMenusInfinite"
import { MenuItem } from "@/components/menuItem"

interface MenuSectionProps {
  selectedMenu: string | null
  handleMenuSelect: (menuId: string) => void // Passed from the parent for flexibility
}

export function MenuSection({
  selectedMenu,
  handleMenuSelect,
}: MenuSectionProps) {
  const { brandId } = useAuth()

  const {
    data: menusData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetMenusInfinite({
    brand_id: brandId || "",
    page_limit: 50,
    search: "",
  })

  const menus = menusData?.pages.flatMap((page) => page.data) || []
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const endRef = useRef<HTMLDivElement | null>(null) // Marker for observer

  const handleWheel = (
    ref: React.RefObject<HTMLDivElement>,
    e: React.WheelEvent
  ) => {
    if (ref.current) {
      ref.current.scrollLeft += e.deltaY // Horizontal scrolling
    }
  }

  useEffect(() => {
    const currentEndRef = endRef.current

    if (!currentEndRef) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      {
        root: scrollRef.current, // Horizontal scrolling container
        rootMargin: "0px 100px", // Extend detection on the right
        threshold: 0.1, // Trigger when 10% of the marker is visible
      }
    )

    observer.observe(currentEndRef)

    return () => {
      observer.disconnect()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  useEffect(() => {
    if (menus.length > 0 && !selectedMenu) {
      handleMenuSelect(menus[0].id) // Select the first menu
    }
  }, [menus, selectedMenu, handleMenuSelect])

  return (
    <div
      ref={scrollRef}
      onWheel={(e) => handleWheel(scrollRef, e)}
      className="scrollbar-hide mx-8 overflow-x-auto"
    >
      <div className="flex min-h-[64px] w-full gap-2">
        {menus.map((menu) => (
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
        {/* Intersection Observer Marker */}
        <div ref={endRef} className="w-1" />
      </div>
    </div>
  )
}
