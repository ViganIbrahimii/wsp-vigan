import { useRef, useState } from "react"

import { Category } from "@/types/interfaces/category.interface"
import { Menu } from "@/types/interfaces/menu.interface"
import { cn } from "@/lib/utils"
import { MenuItem } from "@/components/menuItem"
import Spinner from "@/components/spinner"
import { Tab } from "@/components/tab"

interface MenuCategoryProps {
  className?: string
  menus: Menu[]
  categories: Category[]
  selectedCategory: Category | null
  setSelectedCategory: (category: Category) => void
  selectedMenu: Menu | null
  setSelectedMenu: (menu: Menu) => void
  isMenuLoading: boolean
}

const MenuCategory: React.FC<MenuCategoryProps> = (props) => {
  const scrollRefMenus = useRef<HTMLDivElement>(null)
  const scrollRefCategories = useRef<HTMLDivElement>(null)

  const handleWheel = (
    ref: React.RefObject<HTMLDivElement>,
    e: React.WheelEvent
  ) => {
    if (ref.current) {
      ref.current.scrollLeft += e.deltaY // Horizontal scrolling
    }
  }

  const classNames = cn(
    "flex min-h-[80px] w-full items-center gap-4 rounded-5 bg-black-10 p-4 overflow-x-scroll scrollbar-hide",
    props.className
  )

  return (
    <div className="w-full">
      <div
        className="scrollbar-hide mx-8 overflow-x-scroll"
        ref={scrollRefMenus}
        onWheel={(e) => handleWheel(scrollRefMenus, e)}
      >
        <div className="flex w-full gap-2">
          {props.menus?.map((menu) => (
            <MenuItem
              key={`menu-${menu.id}`}
              onClick={() => props.setSelectedMenu(menu)}
              isActive={props.selectedMenu === menu}
              className="min-w-[160px]"
            >
              {menu.name}
            </MenuItem>
          ))}
        </div>
      </div>
      <div
        className={classNames}
        ref={scrollRefCategories}
        onWheel={(e) => handleWheel(scrollRefCategories, e)}
      >
        {props.isMenuLoading ? (
          <Spinner />
        ) : (
          props.categories?.map((category, index) => (
            <Tab
              className="whitespace-nowrap p-4"
              key={index}
              badgeCount={category.active_items_count}
              isActive={
                props.selectedCategory?.category_name === category.category_name
              }
              onClick={() => {
                props.setSelectedCategory(category)
              }}
            >
              {category.category_name}
            </Tab>
          ))
        )}
      </div>
    </div>
  )
}

export default MenuCategory
