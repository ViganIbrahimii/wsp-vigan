"use client"

import React, { useState } from "react"
import { CloseIcon } from "@/icons"
import { useAuth } from "@/providers/AuthProvider/AuthProvider"
import { useQueryClient } from "@tanstack/react-query"

import { ItemList } from "@/types/interfaces/item.interface"
import { useUpdateCategory } from "@/lib/hooks/mutations/categories/useUpdateCategory"
import { useUpdateItem } from "@/lib/hooks/mutations/items/useUpdateItem"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dialog"
import { IconButton } from "@/components/iconButton"
import { Input } from "@/components/input"
import { MainButton } from "@/components/mainButton"
import RadioButton from "@/components/radioButton"
import ToggleSwitch from "@/components/toggleSwitch"
import { fontBodyBold, fontTitle3 } from "@/styles/typography"

interface InactivateDialogProps {
  name: string
  id: string
  type: "item" | "category"
  status: boolean
  item?: ItemList
}

const InactivateDialog: React.FC<InactivateDialogProps> = ({
  name,
  id,
  type,
  status,
  item,
}) => {
  const queryClient = useQueryClient()
  const { brandId } = useAuth()
  const { mutate: updateItemStatus, isPending: isItemPending } = useUpdateItem()
  const { mutate: updateCategoryStatus, isPending: isCategoryPending } =
    useUpdateCategory()
  const [selectedReason, setSelectedReason] = useState<string>("")
  const [otherReason, setOtherReason] = useState<string>("")
  const [toggleState, setToggleState] = useState<boolean>(status)
  const [dialogOpen, setDialogOpen] = useState(false)

  const reasons = [
    type === "category" ? "Category out of stock" : "Ingredient out of stock",
    "Wastage / spoiled",
    "Other",
  ]

  const handleReasonSelect = (reason: string) => {
    setSelectedReason(reason)
    if (reason !== "Other") {
      setOtherReason("") // Clear the other reason if a predefined reason is selected
    }
  }

  const handleSaveChanges = () => {
    const finalReason =
      selectedReason === "Other" ? otherReason : selectedReason

    if (type === "item") {
      updateItemStatus(
        {
          item_id: id,
          status: "inactive",
          reason: finalReason,
          brand_id: brandId || "",
          is_delivery_enabled: item?.is_delivery_enabled,
          is_dine_in_enabled: item?.is_dine_in_enabled,
          is_pickup_enabled: item?.is_pickup_enabled,
        },
        {
          onSuccess: () => {
            toast({
              title: `Item inactivated successfully`,
            })
            queryClient.invalidateQueries({ queryKey: ["items"] })
            setToggleState(false) // Update the toggle state
            setDialogOpen(false) // Close the dialog
            setSelectedReason("") // Clear the selected reason
            setOtherReason("") // Clear the other reason
          },
          onError: (error) => {
            toast({
              title: `Failed to inactivate item`,
              description: error.message,
            })
          },
        }
      )
    } else if (type === "category") {
      updateCategoryStatus(
        {
          category_id: id,
          status: "inactive",
          reason: finalReason,
          brand_id: brandId || "",
        },
        {
          onSuccess: () => {
            toast({
              title: `Category inactivated successfully`,
            })
            queryClient.invalidateQueries({ queryKey: ["categories"] })
            setToggleState(false) // Update the toggle state
            setDialogOpen(false) // Close the dialog
            setSelectedReason("") // Clear the selected reason
            setOtherReason("") // Clear the other reason
          },
          onError: (error) => {
            toast({
              title: `Failed to inactivate category`,
              description: error.message,
            })
          },
        }
      )
    }
  }

  const handleToggleChange = () => {
    if (toggleState) {
      setDialogOpen(true) // Open the dialog for inactivation
    } else {
      // Directly activate without dialog
      if (type === "item") {
        updateItemStatus(
          {
            item_id: id,
            status: "active",
            brand_id: brandId || "",
            is_delivery_enabled: item?.is_delivery_enabled,
            is_dine_in_enabled: item?.is_dine_in_enabled,
            is_pickup_enabled: item?.is_pickup_enabled,
          },
          {
            onSuccess: () => {
              toast({
                title: `Item activated successfully`,
              })
              queryClient.invalidateQueries({ queryKey: ["items"] })
              setToggleState(true)
            },
            onError: (error) => {
              toast({
                title: `Failed to activate item`,
                description: error.message,
              })
            },
          }
        )
      } else if (type === "category") {
        updateCategoryStatus(
          {
            category_id: id,
            status: "active",
            brand_id: brandId || "",
          },
          {
            onSuccess: () => {
              toast({
                title: `Category activated successfully`,
              })
              queryClient.invalidateQueries({ queryKey: ["categories"] })
              setToggleState(true)
            },
            onError: (error) => {
              toast({
                title: `Failed to activate category`,
                description: error.message,
              })
            },
          }
        )
      }
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <div className="w-fit">
        <ToggleSwitch
          label={toggleState ? "Active" : "Inactive"}
          checked={toggleState}
          onChange={() => {
            if (toggleState) {
              // Open the dialog for inactivation
              setDialogOpen(true)
            } else {
              // Directly activate the item/category
              handleToggleChange()
            }
          }}
        />
      </div>
      <DialogContent className="max-w-sm md:max-w-md">
        <DialogHeader>
          <DialogTitle className={cn(fontTitle3)}>
            Inactivating {name}
          </DialogTitle>
          <DialogClose asChild>
            <IconButton
              variant="primaryWhite"
              size="large"
              icon={CloseIcon}
              iconSize="24"
              isActive={true}
            />
          </DialogClose>
        </DialogHeader>
        <DialogDescription>
          <p className={cn(fontBodyBold, "text-black-60", "font-medium")}>
            {" "}
            What’s the reason for inactivating {`"${name}"`}?
          </p>
        </DialogDescription>
        <div className="w-full space-y-4">
          {reasons.map((reason) => (
            <div
              key={reason}
              className={cn(
                "mb-4 flex items-center justify-between space-x-3",
                fontBodyBold
              )}
            >
              <label htmlFor={reason} className={cn(fontBodyBold)}>
                {reason}
              </label>
              <RadioButton
                selected={selectedReason === reason}
                size="large"
                onClick={() => handleReasonSelect(reason)}
              />
            </div>
          ))}
          {selectedReason === "Other" && (
            <Input
              type="text"
              placeholder="Type the reason"
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              extraStyles="w-full m-0"
            />
          )}
        </div>
        <MainButton
          variant="primary"
          className="w-full"
          disabled={
            selectedReason === "" ||
            (selectedReason === "Other" && otherReason.trim() === "") ||
            isCategoryPending ||
            isItemPending
          }
          onClick={handleSaveChanges}
        >
          {isItemPending || isCategoryPending
            ? "Saving changes"
            : "Save Changes"}
        </MainButton>
      </DialogContent>
    </Dialog>
  )
}

export default InactivateDialog
