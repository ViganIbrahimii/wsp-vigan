import { useEffect, useMemo, useState } from "react"
import { OrderType } from "@/constants/orderTypes"
import { useAuth } from "@/providers/AuthProvider/AuthProvider"

import {
  CreateOrderTypeOption,
  EnrichedOrderTypeOption,
} from "@/types/interfaces/order.interface"

const orderTypeOptions: CreateOrderTypeOption[] = [
  {
    value: OrderType.DINE,
    label: "Table",
    serviceTypeName: "Dine In",
  },
  {
    value: OrderType.PICKUP,
    label: "Pickup",
    serviceTypeName: "Pickup",
  },
  {
    value: OrderType.DELIVERY,
    label: "Delivery",
    serviceTypeName: "Delivery",
  },
]

export const useInitializeTabs = () => {
  const { brandId, brand, availableServiceTypes } = useAuth()
  const [selectedTab, setSelectedTab] =
    useState<EnrichedOrderTypeOption | null>(null)

  const enrichedTabs = useMemo(() => {
    return orderTypeOptions
      .map((orderType) => {
        const matchingServiceType = availableServiceTypes.find(
          (available) => available.label === orderType.serviceTypeName
        )

        return matchingServiceType
          ? {
              ...orderType,
            }
          : undefined
      })
      .filter((tab): tab is EnrichedOrderTypeOption => !!tab)
  }, [availableServiceTypes])

  useEffect(() => {
    if (enrichedTabs.length) {
      setSelectedTab(enrichedTabs[0])
    }
  }, [enrichedTabs])

  return { enrichedTabs, selectedTab, setSelectedTab }
}
