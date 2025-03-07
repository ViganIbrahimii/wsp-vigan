import React, { useEffect, useRef } from "react"
import { CategoryStatus } from "@/api/categories"

import { CategoryDetails } from "@/types/interfaces/categoryDetails.interface"
import { mockCategories } from "@/components/MenuManagement/mockData"
import { Tab } from "@/components/tab"

interface CategoryManagementSectionProps {
  selectedCategory: string | null
  handleCategorySelect: (
    categoryId: string,
    categoryDetails?: CategoryDetails
  ) => void
  menuId: string | null
  updateCategoryDetails?: boolean
  categoryStatus: CategoryStatus
  showBothCounts?: boolean
}

export function CategorySection({
  selectedCategory,
  handleCategorySelect,
  menuId,
  updateCategoryDetails = false,
  categoryStatus,
  showBothCounts,
}: CategoryManagementSectionProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (mockCategories.length > 0 && !selectedCategory) {
      // Find the first category that matches the filter criteria
      const firstValidCategory = mockCategories.find((category) =>
        showBothCounts
          ? category.active_items_count > 0 || category.inactive_items_count > 0
          : category.active_items_count > 0
      )

      if (firstValidCategory) {
        if (updateCategoryDetails) {
          // Pass CategoryDetails if `updateCategoryDetails` is true
          handleCategorySelect(firstValidCategory.category_id, {
            name: firstValidCategory.category_name,
            itemsCount: showBothCounts
              ? firstValidCategory.active_items_count +
                firstValidCategory.inactive_items_count
              : firstValidCategory.active_items_count,
            status: firstValidCategory.status === "active",
          })
        } else {
          handleCategorySelect(firstValidCategory.category_id)
        }
      }
    }
  }, [
    selectedCategory,
    handleCategorySelect,
    showBothCounts,
    updateCategoryDetails,
  ])

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div
        ref={scrollRef}
        className="scrollbar-hide flex w-full overflow-x-auto rounded-5 bg-black-10 p-4"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="inline-flex space-x-2 pr-4">
          {mockCategories
            .filter((category) =>
              showBothCounts
                ? category.active_items_count > 0 ||
                  category.inactive_items_count > 0
                : category.active_items_count > 0
            )
            .map((category) => (
              <Tab
                key={`category-${category.category_id}`}
                aria-selected={selectedCategory === category.category_id}
                badgeCount={
                  showBothCounts
                    ? category.active_items_count +
                      category.inactive_items_count
                    : category.active_items_count
                }
                isActive={selectedCategory === category.category_id}
                onClick={() =>
                  handleCategorySelect(
                    category.category_id,
                    updateCategoryDetails
                      ? {
                          name: category.category_name,
                          itemsCount: showBothCounts
                            ? category.active_items_count +
                              category.inactive_items_count
                            : category.active_items_count,
                          status: category.status === "active",
                        }
                      : undefined
                  )
                }
                className="flex-shrink-0"
              >
                <p className="line-clamp-2 max-h-[3rem] overflow-hidden">
                  {category.category_name}
                </p>
              </Tab>
            ))}
        </div>
      </div>
    </div>
  )
}
