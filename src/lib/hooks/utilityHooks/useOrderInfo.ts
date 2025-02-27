import { useEffect, useState } from "react"

import { CreateOrderInfoInterface } from "@/types/interfaces/order.interface"
import { Table } from "@/types/interfaces/table.interface"

const defaultOrderInfo = {
  selectedTable: null,
  preSelectedTable: null,
  customerId: null,
  isNewCustomer: true,
  orderInstruction: null,
  guestInfo: null,
}

export const useOrderInfo = (preSelectedTable: Table | null) => {
  const [orderInfo, setOrderInfo] = useState<CreateOrderInfoInterface>({
    ...defaultOrderInfo,
    preSelectedTable,
  })

  const handleSaveOrderInfo = (
    updatedInfo: Partial<CreateOrderInfoInterface>
  ) => {
    setOrderInfo((prev: CreateOrderInfoInterface) => ({
      ...prev,
      ...updatedInfo,
    }))
  }

  useEffect(() => {
    if (preSelectedTable) {
      setOrderInfo((prev: CreateOrderInfoInterface) => ({
        ...prev,
        preSelectedTable,
      }))
    }
  }, [preSelectedTable])

  return { orderInfo, handleSaveOrderInfo, defaultOrderInfo, setOrderInfo }
}
