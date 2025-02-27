import React from "react"
import { CheckIcon } from "@/icons"
import { cva, VariantProps } from "class-variance-authority"

import IconWrapper from "@/components/iconWrapper"

const radioButtonStyles = cva(
  "flex items-center justify-center rounded-full cursor-pointer", // Fully rounded for a circular shape
  {
    variants: {
      size: {
        small: "h-[28px] w-[28px]",
        large: "h-[32px] w-[32px]",
      },
      selected: {
        true: "bg-semantic-green-100",
        false: "bg-black-10",
      },
    },
    defaultVariants: {
      size: "small",
      selected: false,
    },
  }
)

interface RadioButtonProps extends VariantProps<typeof radioButtonStyles> {
  selected: boolean
  onClick: () => void
}

const RadioButton: React.FC<RadioButtonProps> = ({
  selected,
  size,
  onClick,
}) => {
  return (
    <div onClick={onClick} className={radioButtonStyles({ size, selected })}>
      {selected && (
        <IconWrapper
          Component={CheckIcon}
          size={size === "large" ? "24" : "20"}
          color="white100"
        />
      )}
    </div>
  )
}

export default RadioButton
