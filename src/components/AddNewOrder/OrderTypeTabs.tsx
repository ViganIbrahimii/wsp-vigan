import React from "react"

import { EnrichedOrderTypeOption } from "@/types/interfaces/order.interface"
import { Tab } from "@/components/tab"

interface OrderTypeTabsProps {
  tabs: EnrichedOrderTypeOption[]
  selectedTab: EnrichedOrderTypeOption | null
  onTabChange: (tab: EnrichedOrderTypeOption) => void
}

export const OrderTypeTabs: React.FC<OrderTypeTabsProps> = ({
  tabs,
  selectedTab,
  onTabChange,
}) => {
  return (
    <div className="flex flex-wrap gap-2 md:flex-nowrap">
      {tabs.map((tab, index) => (
        <Tab
          key={`orderType-${index}-${tab.value}`}
          variant="secondary"
          isActive={tab.serviceTypeId === selectedTab?.serviceTypeId}
          onClick={() => onTabChange(tab)}
          className="px-4 lg:px-6"
        >
          {tab.label}
        </Tab>
      ))}
    </div>
  )
}
