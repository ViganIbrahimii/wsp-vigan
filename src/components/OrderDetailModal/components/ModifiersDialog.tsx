import React, { useEffect, useState } from "react"
import { CloseIcon } from "@/icons"
import { CartItemType, useCart } from "@/providers/CartProvider"
import { DialogDescription } from "@radix-ui/react-dialog"

import { ItemList, ModifierDetail } from "@/types/interfaces/item.interface"
import { ItemsDetails, ModifierInfo } from "@/types/interfaces/order.interface"
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
import { fontBodyNormal, fontTitle3 } from "@/styles/typography"

interface ItemModifiersModalProps {
  isOpen: boolean
  onClose: () => void
  item: ItemList
  onAddItemToCart: (item: ItemList, modifiers?: ModifierInfo[]) => void
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
  onAddItemToCart,
}) => {
  // const { addItemToCart } = useCart()
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

        const option_price =
          selectedOption?.price && selectedOption?.price >= 0.01
            ? selectedOption?.price.toString()
            : "0.01"
        return {
          modifier_id: modifier.modifier_id,
          modifier_name: modifier.modifier_name,
          modifier_option_id: selectedOption?.option_id || "",
          modifier_option_name: selectedOption?.option_name || "",
          modifier_option_price: option_price,
        }
      }) || []
    onAddItemToCart(item, selectedModifiersList)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[80vh] min-w-[40%] flex-col">
        <DialogHeader>
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
                <h3 className={cn(fontBodyNormal, "text-black-100")}>
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
                      className={cn("h-[40px] border border-black-10")}
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
