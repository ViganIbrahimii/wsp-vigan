"use client"

import React from "react"
import { CheckIcon } from "@/icons"
import { cva, VariantProps } from "class-variance-authority"

import IconWrapper from "@/components/iconWrapper"

const checkboxStyles = cva(
  "flex items-center justify-center rounded-md", // Common styles
  {
    variants: {
      size: {
        small: "h-[28px] w-[28px]",
        large: "h-[32px] w-[32px]",
      },
      checked: {
        true: "bg-semantic-green-100",
        false: "bg-black-10",
      },
    },
    defaultVariants: {
      size: "small",
      checked: false,
    },
  }
)

interface CheckboxProps extends VariantProps<typeof checkboxStyles> {
  checked: boolean
  onClick?: () => void // Adding onClick to props
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, size, onClick }) => {
  return (
    <div
      onClick={onClick} // Adding the onClick handler here
      className={checkboxStyles({ size, checked })}
    >
      {checked && (
        <IconWrapper
          Component={CheckIcon}
          size={size === "large" ? "24" : "20"}
          color="white100"
        />
      )}
    </div>
  )
}

export default Checkbox
