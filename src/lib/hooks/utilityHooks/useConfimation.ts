import { Dispatch, SetStateAction, useState } from "react"
import { useCart } from "@/providers/CartProvider"

import { EnrichedOrderTypeOption } from "@/types/interfaces/order.interface"

export const useConfirmation = (
  setSelectedTab: Dispatch<SetStateAction<EnrichedOrderTypeOption | null>>
) => {
  const { clearCart } = useCart()
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [pendingTab, setPendingTab] = useState<EnrichedOrderTypeOption | null>(
    null
  )

  const handleConfirmChange = () => {
    if (pendingTab) {
      clearCart()
      setSelectedTab(pendingTab)

      setPendingTab(null)
    }
    setShowConfirmationModal(false)
  }

  const handleCancelChange = () => {
    setPendingTab(null)
    setShowConfirmationModal(false)
  }

  return {
    showConfirmationModal,
    setShowConfirmationModal,
    pendingTab,
    setPendingTab,
    handleConfirmChange,
    handleCancelChange,
  }
}
