import React, { useEffect, useState } from "react"
import { OrderType } from "@/constants/orderTypes"
import { CloseIcon } from "@/icons"
import { useCart } from "@/providers/CartProvider"
import { DialogDescription } from "@radix-ui/react-dialog"

import { ItemList, ModifierDetail } from "@/types/interfaces/item.interface"
import {
  EnrichedOrderTypeOption,
  ItemsDetails,
  ModifierInfo,
} from "@/types/interfaces/order.interface"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog"
import { IconButton } from "@/components/iconButton"
import { MainButton } from "@/components/mainButton"
import { Tab } from "@/components/tab"
import { fontBodyNormal, fontHeadline, fontTitle3 } from "@/styles/typography"

interface ItemModifiersModalProps {
  isOpen: boolean
  onClose: () => void
  item: ItemList
  serviceType: EnrichedOrderTypeOption | null
}

type SelectedModifiers = Record<string, string>

const initializeSelectedModifiers = (item: ItemList): SelectedModifiers => {
  return (
    item.modifiers?.reduce((acc, modifier) => {
      const defaultOption = modifier.modifier_detail.find(
        (option) => option.is_default
      )
      if (defaultOption) {
        acc[modifier.modifier_id] = defaultOption.option_id
      }
      return acc
    }, {} as SelectedModifiers) || {}
  )
}

const ItemModifiersModal: React.FC<ItemModifiersModalProps> = ({
  isOpen,
  onClose,
  item,
  serviceType,
}) => {
  const { addItemToCart } = useCart()
  const [selectedModifiers, setSelectedModifiers] = useState<SelectedModifiers>(
    () => initializeSelectedModifiers(item)
  )

  useEffect(() => {
    if (!isOpen) {
      setSelectedModifiers(initializeSelectedModifiers(item)) // Reset modifiers when modal closes
    }
  }, [isOpen, item])

  const handleModifierSelect = (modifierId: string, optionId: string) => {
    setSelectedModifiers((prev) => ({ ...prev, [modifierId]: optionId }))
  }

  const areAllModifiersSelected = () => {
    return item.modifiers?.every(
      (modifier) =>
        selectedModifiers[modifier.modifier_id] && // Ensure a value exists
        modifier.modifier_detail.some(
          (option) =>
            option.option_id === selectedModifiers[modifier.modifier_id]
        ) // Ensure the selected value matches a valid option
    )
  }

  const handleSave = () => {
    if (!areAllModifiersSelected()) {
      return toast({
        title: `Please select an option for each modifier`,
      })
    }

    const selectedModifiersList =
      item.modifiers?.map((modifier) => {
        const selectedOptionId = selectedModifiers[modifier.modifier_id]
        const selectedOption = modifier.modifier_detail.find(
          (o) => o.option_id === selectedOptionId
        )

        return {
          modifier_id: modifier.modifier_id,
          modifier_name: modifier.modifier_name,
          modifier_option_id: selectedOption?.option_id || "",
          modifier_option_name: selectedOption?.option_name || "",
          modifier_option_price: selectedOption?.price.toString() || "0",
        }
      }) || []

    addItemToCart(
      item,
      serviceType?.value || OrderType.DINE,
      selectedModifiersList
    )
    toast({
      title: `${item.item_name} added to cart`,
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[80vh] w-[95vw] flex-col md:w-[600px]">
        <DialogHeader>
          <DialogDescription className="hidden">
            Modifiers Dialog
          </DialogDescription>
          <DialogTitle className={cn(fontTitle3)}>{item.item_name}</DialogTitle>
          <DialogClose asChild>
            <IconButton
              variant="primaryWhite"
              size="large"
              icon={CloseIcon}
              iconSize="24"
              className="absolute right-6 top-6"
            />
          </DialogClose>
        </DialogHeader>

        <div className="flex flex-col gap-6 overflow-y-auto">
          {item.modifiers?.map((modifier) => {
            const selectedOption = modifier.modifier_detail.find(
              (option) =>
                option.option_id === selectedModifiers[modifier.modifier_id]
            )
            const selectedPrice = selectedOption ? selectedOption.price : 0

            return (
              <div key={modifier.modifier_id} className="flex flex-col gap-2">
                <div className={cn(fontBodyNormal, "text-lg text-black-100")}>
                  {selectedPrice > 0 && (
                    <span>{item.currency + selectedPrice.toFixed(2)}</span>
                  )}
                </div>
                <h3 className={cn(fontHeadline, "text-black-60")}>
                  {modifier.modifier_name}
                </h3>
                <div className="flex flex-wrap gap-2 rounded-6">
                  {modifier.modifier_detail.map((option) => (
                    <Tab
                      key={option.option_id}
                      onClick={() =>
                        handleModifierSelect(
                          modifier.modifier_id,
                          option.option_id
                        )
                      }
                      variant="secondary"
                      isActive={
                        selectedModifiers[modifier.modifier_id] ===
                        option.option_id
                      }
                      className={cn(
                        "h-[32px]",
                        selectedModifiers[modifier.modifier_id] !==
                          option.option_id && "border border-black-10",
                        fontBodyNormal
                      )}
                    >
                      {option.option_name}
                    </Tab>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <MainButton
          variant="primary"
          className="min-h-[48px] w-full"
          onClick={handleSave}
        >
          Add
        </MainButton>
      </DialogContent>
    </Dialog>
  )
}

export default ItemModifiersModal
