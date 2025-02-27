import { describe } from "node:test"
import React, { ReactNode, useState } from "react"
import { CloseIcon } from "@/icons"

import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog"
import { MainButton } from "@/components/mainButton"

import { IconButton } from "./iconButton"

interface ConfirmationDialogProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  title?: string
  description?: ReactNode
  confirmText?: string
  isPending?: boolean
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  onConfirm,
  isOpen,
  onCancel,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  isPending,
}) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onCancel() // Only trigger `onCancel` when dialog is closing
      }}
    >
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
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
        <DialogDescription>{description}</DialogDescription>
        <DialogFooter>
          <MainButton
            variant="primary"
            onClick={onConfirm}
            className="w-full"
            disabled={isPending}
          >
            {isPending ? "Processing" : confirmText}
          </MainButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmationDialog
