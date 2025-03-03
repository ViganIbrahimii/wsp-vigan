"use client"

import React, { useState } from "react"
import { CategoryStatus } from "@/api/categories/list"

import { FilteredServiceType } from "@/types/interfaces/filteredServiceType.interface"
import { cn } from "@/lib/utils"
import { CategorySection } from "@/components/categorySection"
import InactivateProductDialog from "@/components/inactivateProductDialog"
import { ItemManagementSection } from "@/components/itemManagementSection"
import { MenuSection } from "@/components/menuSection"
import SearchInput from "@/components/searchInput"
import { Tab } from "@/components/tab"
import {
  fontCaptionBold,
  fontCaptionNormal,
  fontTitle1,
} from "@/styles/typography"

import { mockServiceTypes } from "./mockData"

export function MenuManagement() {
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedServiceType, setSelectedServiceType] = useState<
    FilteredServiceType[]
  >([])
  const [search, setSearch] = useState("")
  const [categoryDetails, setCategoryDetails] = useState<{
    name: string
    itemsCount: number
    status: boolean
  } | null>(null)

  const handleMenuSelect = (menuId: string) => {
    setSelectedMenu(menuId)
  }

  const handleCategorySelect = (
    categoryId: string,
    details?: {
      name: string
      itemsCount: number
      status: boolean
    }
  ) => {
    setSelectedCategory(categoryId)
    if (details) {
      setCategoryDetails(details)
    }
  }

  const handleServiceTypeSelect = (serviceType: FilteredServiceType) => {
    if (serviceType.value === "all") {
      setSelectedServiceType([])
    } else {
      setSelectedServiceType([serviceType])
    }
  }

  return (
    <div className="px-4">
      {/* Top Section */}
      <div className="flex flex-row items-center justify-between gap-4 py-7">
        <div className="flex flex-row items-center  gap-4 lg:gap-10">
          <h1 className={cn(fontTitle1)}>Menu Management</h1>
          <div className="flex gap-2">
            {mockServiceTypes.map((service) => (
              <Tab
                key={service.value}
                variant="primary"
                badgeCount={service.count}
                isActive={
                  (service.value === "all" &&
                    selectedServiceType.length === 0) ||
                  selectedServiceType.some((st) => st.value === service.value)
                }
                onClick={() => handleServiceTypeSelect(service)}
              >
                {service.label}
              </Tab>
            ))}
          </div>
        </div>
        <SearchInput
          query={search}
          setQuery={setSearch}
          alwaysOpen={false}
          className="lg:w-64"
        />
      </div>

      {/* Middle Section */}
      <div className="flex flex-col">
        <MenuSection
          selectedMenu={selectedMenu}
          handleMenuSelect={handleMenuSelect}
        />
        <CategorySection
          selectedCategory={selectedCategory}
          handleCategorySelect={handleCategorySelect}
          menuId={selectedMenu}
          categoryStatus={["active"]}
          showBothCounts={true}
          updateCategoryDetails={true}
        />
      </div>

      {/* Category Summary Section */}
      <div className=" mt-8 flex items-center justify-between rounded-3 bg-white-70 p-4">
        <div className="flex items-center gap-2">
          <p className={cn(fontCaptionBold)}>
            {categoryDetails ? (
              <>
                Whole &quot;{categoryDetails.name}&quot; Category
                <span className={cn(fontCaptionNormal, "ml-2 text-black-60")}>
                  ({categoryDetails.itemsCount} items)
                </span>
              </>
            ) : (
              "No Category Selected"
            )}
          </p>
        </div>
        {categoryDetails && (
          <InactivateProductDialog
            name={categoryDetails.name}
            id={selectedCategory || ""}
            type="category"
            status={categoryDetails.status}
          />
        )}
      </div>

      {/* Bottom Section */}
      <ItemManagementSection
        brandId="mock-brand-id"
        selectedCategory={selectedCategory}
        selectedServiceType={selectedServiceType}
        search={search}
        updateSearch={setSearch}
        filteredServiceTypes={mockServiceTypes}
      />
    </div>
  )
}
