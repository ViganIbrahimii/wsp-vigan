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

  const {
    data: itemsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetItemsInfinite({
    brand_id: brandId || "",
    category_id: selectedCategory ? [selectedCategory] : [],
    service_type_ids: selectedServiceType?.serviceTypeId
      ? [selectedServiceType.serviceTypeId]
      : [],
    status: itemStatus,
    search: search,
    page_limit: 20,
  })

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
    <div className="flex-grow overflow-y-auto">
      <div
        className={cn(
          "grid auto-rows-fr justify-start gap-4 py-4",
          isSmallIconView
            ? "grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))]"
            : "grid-cols-[repeat(auto-fill,_minmax(160px,_1fr))]"
        )}
      >
        {items.map((item, index) => (
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
