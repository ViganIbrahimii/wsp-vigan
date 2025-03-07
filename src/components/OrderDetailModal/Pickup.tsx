"use client"

import { OrderListItem } from "@/types/interfaces/order.interface"

import PickupDetailModal from "./PickupDetailModal"

interface PickupDetailDialogProps {
  item?: OrderListItem
  isAggregator?: boolean
  onClose: () => void
  onUpdate?: () => void
}

const PickupDetailDialog: React.FC<PickupDetailDialogProps> = ({
  item,
  isAggregator,
  onClose,
  onUpdate,
}) => {
  return (
    <PickupDetailModal
      item={item}
      isAggregator={isAggregator}
      onClose={onClose}
      onUpdate={onUpdate}
    />
  )
}

export default PickupDetailDialog
