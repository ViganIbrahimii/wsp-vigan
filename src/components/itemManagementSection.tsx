import { useEffect, useRef } from "react"
import { SERVICE_TYPE_CONFIG, ServiceType } from "@/constants/serviceTypes"

import { FilteredServiceType } from "@/types/interfaces/filteredServiceType.interface"
import { cn } from "@/lib/utils"
import HighlightedText from "@/components/highlightedText"
import InactivateProductDialog from "@/components/inactivateProductDialog"
import { mockItems } from "@/components/MenuManagement/mockData"
import { fontCaptionBold, fontCaptionNormal } from "@/styles/typography"

interface ItemManagementSectionProps {
  brandId: string | null
  selectedCategory: string | null
  selectedServiceType: FilteredServiceType[]
  search: string
  updateSearch: (newQuery: string) => void
  filteredServiceTypes: FilteredServiceType[]
}

export function ItemManagementSection({
  brandId,
  selectedCategory,
  selectedServiceType,
  search,
  updateSearch,
  filteredServiceTypes,
}: ItemManagementSectionProps) {
  const isAllServicesSelected =
    selectedServiceType.length === filteredServiceTypes.length

  const serviceTypeFilters = isAllServicesSelected
    ? {}
    : {
        is_dine_in_enabled: selectedServiceType.some(
          (st) => st.label === SERVICE_TYPE_CONFIG[ServiceType.DINE_IN].label
        ),
        is_delivery_enabled: selectedServiceType.some(
          (st) => st.label === SERVICE_TYPE_CONFIG[ServiceType.DELIVERY].label
        ),
        is_pickup_enabled: selectedServiceType.some(
          (st) => st.label === SERVICE_TYPE_CONFIG[ServiceType.PICKUP].label
        ),
      }

  const scrollRef = useRef<HTMLDivElement | null>(null)

  // Filter items based on category and service type
  const filteredItems = mockItems.filter((item) => {
    const matchesCategory =
      !selectedCategory || item.categorie_id === selectedCategory
    const matchesServiceType =
      isAllServicesSelected ||
      ((!serviceTypeFilters.is_dine_in_enabled || item.is_dine_in_enabled) &&
        (!serviceTypeFilters.is_delivery_enabled || item.is_delivery_enabled) &&
        (!serviceTypeFilters.is_pickup_enabled || item.is_pickup_enabled))
    const matchesSearch =
      !search ||
      item.item_name.toLowerCase().includes(search.toLowerCase()) ||
      item.base_price.toString().includes(search)

    return matchesCategory && matchesServiceType && matchesSearch
  })

  return (
    <div className="flex-grow overflow-y-auto">
      <div className="grid auto-rows-fr grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] justify-start gap-4 py-4">
        {filteredItems.map((item, index) => (
          <div
            className="flex h-full min-h-[110px] w-full flex-col gap-4 rounded-3 bg-white-60 p-4"
            key={`item-${index}-${item.item_id}`}
          >
            <div className="flex flex-col gap-1">
              <p className={cn(fontCaptionBold, "break-words")}>
                <HighlightedText text={item.item_name} searchTerm={search} />
              </p>
              <p className={cn(fontCaptionNormal, "text-black-60")}>
                <HighlightedText
                  text={`$${item.base_price}`}
                  searchTerm={search}
                />
              </p>
            </div>
            <InactivateProductDialog
              name={item.item_name || ""}
              id={item.item_id}
              type="item"
              status={item.status === "active"}
              item={item}
            />
          </div>
        ))}
      </div>
      <div className="h-[50px]" ref={scrollRef} />
    </div>
  )
}
