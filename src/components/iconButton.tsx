import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import IconWrapper from "@/components/iconWrapper" // Adjust the import path as needed
import { fontButtonSmall } from "@/styles/typography"

const buttonVariants = cva(
  "inline-flex items-center justify-center transition-colors hover:outline-black-20 hover:outline hover:outline-4 disabled:bg-black-5 disabled:text-black-40 disabled:outline-none",
  {
    variants: {
      size: {
        large: "h-[48px]",
        small: "h-[32px]",
      },
      variant: {
        primary: "bg-black-100 text-white-100 shadow-float-black-button",
        primaryWhite: "bg-white-100 text-black-100 shadow-float-black-button",
        primaryGradient: "bg-gradient-to-r from-gray-200 to-white text-black-100 shadow-float-black-button border border-gray-300",
        primaryOutline:
          "bg-none outline-black-10 text-black-100 outline-1 outline",
        primaryOutlineLabel:
          "bg-none min-w-[48px] outline-black-10 outline-1 outline w-fit text-black-100 p-2 text-button-small",
        secondary:
          "bg-black-10 text-black-100 disabled:bg-black-10 hover:outline-0",
        secondaryOutline:
          "bg-none outline-black-10 text-black-100 outline-1 outline",
        secondaryLabel:
          "bg-black-10 outline-black-10 min-w-[48px] w-fit text-black-100 p-2 text-button-small disabled:text-white-100 disabled:bg-black-10 hover:outline-0",
        sidebarWhite: "bg-white-20 hover:outline-0",
        sidebarBlack: "bg-black-10 hover:outline-0",
        transparent:
          "bg-transparent outline-black-10 outline-2 outline hover:outline-2",
        red: "bg-transparent hover:outline-0",
      },
      isActive: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "sidebarWhite",
        isActive: true,
        className: "bg-brand",
      },
      {
        variant: "sidebarBlack",
        isActive: true,
        className: "bg-brand",
      },
    ],
    defaultVariants: {
      size: "large",
      variant: "primary",
      isActive: false,
    },
  }
)

const iconColors = {
  primary: {
    default: "white100" as "white100",
    disabled: "black40" as "black40",
  },
  primaryWhite: {
    default: "black100" as "black100",
    disabled: "black40" as "black40",
  },
  primaryGradient: {
    default: "black100" as "black100",
    disabled: "black40" as "black40",
  },
  primaryOutline: {
    default: "black100" as "black100",
    disabled: "black40" as "black40",
  },
  primaryOutlineLabel: {
    default: "black100" as "black100",
    disabled: "black40" as "black40",
  },
  secondary: {
    default: "black100" as "black100",
    disabled: "black40" as "black40",
  },
  secondaryOutline: {
    default: "black100" as "black100",
    disabled: "black40" as "black40",
  },
  secondaryLabel: {
    default: "black100" as "black100",
    disabled: "white100" as "white100",
  },
  sidebarWhite: {
    default: "white100" as "white100",
    disabled: "white100" as "white100",
  },
  sidebarBlack: {
    default: "black100" as "black100",
    disabled: "white100" as "white100",
  },
  transparent: {
    default: "black100" as "black100",
    disabled: "white100" as "white100",
  },
  red: {
    default: "red100" as "red100",
    disabled: "white100" as "white100",
  },
}

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  icon: React.FC<React.SVGProps<SVGSVGElement>>
  iconSize?: "24" | "20" // Adjust sizes if needed
  isActive?: boolean
  text?: string // Add the text prop
  isBorder?: boolean
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "large",
      asChild = false,
      disabled,
      icon: IconComponent,
      iconSize = "24",
      isActive = false,
      isBorder = true,
      text, // Destructure the text prop
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const selectedVariant = variant ?? "primary" // Ensure variant is never null
    const iconColor = disabled
      ? iconColors[selectedVariant].disabled
      : iconColors[selectedVariant].default
    const borderStyle = isBorder ? "rounded-full" : ""

    return (
      <Comp
        className={cn(
          buttonVariants({
            variant: selectedVariant,
            size,
            isActive,
            className,
          }),
          {
            "space-x-2 px-4": !!text, // Add spacing and padding if there is text
            "min-w-[48px]": size === "large" && !text, // Fixed width for large size with no text
            "min-w-[32px]": size === "small" && !text, // Fixed width for small size with no text
          },
          borderStyle,
          fontButtonSmall
        )}
        ref={ref}
        disabled={disabled}
        {...props}
      >
        {IconComponent && (
          <IconWrapper
            Component={IconComponent}
            size={iconSize}
            color={iconColor}
          />
        )}
        {text && <span>{text}</span>} {/* Conditionally render the text */}
        {children}
      </Comp>
    )
  }
)

IconButton.displayName = "IconButton"

export { IconButton }
