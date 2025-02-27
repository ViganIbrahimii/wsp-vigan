import { SetStateAction, useEffect, useRef } from "react"
import { SERVICE_TYPE_CONFIG, ServiceType } from "@/constants/serviceTypes"
import { useAuth } from "@/providers/AuthProvider/AuthProvider"

import { FilteredServiceType } from "@/types/interfaces/filteredServiceType.interface"
import { useGetItemsInfinite } from "@/lib/hooks/queries/items/useGetItemsInfinite"
import { cn } from "@/lib/utils"
import HighlightedText from "@/components/highlightedText"
import InactivateProductDialog from "@/components/inactivateProductDialog"
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
  const { brand } = useAuth()

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

  const {
    data: itemsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetItemsInfinite({
    brand_id: brandId || "",
    category_id: selectedCategory ? [selectedCategory] : [],
    ...serviceTypeFilters,
    search: search,
    page_limit: 20,
  })

  const currency = brand?.general_info?.currency_settings?.currency

  const items = itemsData?.pages.flatMap((page) => page.data) || []
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const currentRef = scrollRef.current

    if (!currentRef) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      {
        root: currentRef.parentElement || null,
        rootMargin: "100px", // Load when near the bottom
        threshold: 0.1,
      }
    )

    observer.observe(currentRef)

    return () => {
      observer.disconnect()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  return (
    <div className=" flex-grow overflow-y-auto">
      <div className="grid auto-rows-fr grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] justify-start gap-4 py-4">
        {items.map((item, index) => (
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
                  text={`${currency}${item.base_price}`}
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
