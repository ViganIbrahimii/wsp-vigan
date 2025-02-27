import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import IconWrapper from "@/components/iconWrapper"
import { fontButtonLarge } from "@/styles/typography"

const buttonVariants = cva(
  `inline-flex items-center justify-center rounded-6 transition-colors hover:outline-black-10 hover:outline hover:outline-4 disabled:bg-black-5 disabled:text-black-40 disabled:outline-none px-8 h-[48px] w-fit ${fontButtonLarge}`,
  {
    variants: {
      variant: {
        primary: "bg-black-100 text-white-100",
        secondary: "bg-black-10 text-black-100 hover:outline-black-20",
        accept: "bg-status-accepted text-white-100",
        ready: "bg-status-ready text-white-100",
        served: "bg-status-served text-white-100",
        canceled: "bg-semantic-red-100 text-white-100",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
)

type ButtonVariantType = VariantProps<typeof buttonVariants>["variant"]

const iconColors = {
  primary: {
    default: "white100" as "white100",
    disabled: "black40" as "black40",
  },
  secondary: {
    default: "black100" as "black100",
    disabled: "black40" as "black40",
  },
  accept: {
    default: "white100" as "white100",
    disabled: "black40" as "black40",
  },
  ready: {
    default: "white100" as "white100",
    disabled: "black40" as "black40",
  },
  served: {
    default: "white100" as "white100",
    disabled: "black40" as "black40",
  },
  canceled: {
    default: "white100" as "white100",
    disabled: "black40" as "black40",
  },
}

export interface MainButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: ButtonVariantType
  asChild?: boolean
  icon?: React.FC<React.SVGProps<SVGSVGElement>>
  iconSize?: "24" | "20" // Adjust sizes if needed
  iconPosition?: "left" | "right" // Position of the icon
}

const MainButton = React.forwardRef<HTMLButtonElement, MainButtonProps>(
  (
    {
      className,
      variant = "primary", // Ensure variant is never null or undefined
      asChild = false,
      disabled,
      icon: IconComponent,
      iconSize = "24",
      iconPosition = "left",
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const selectedVariant = variant || "primary" // Ensure variant is never null or undefined
    const iconColor = disabled
      ? iconColors[selectedVariant].disabled
      : iconColors[selectedVariant].default

    return (
      <Comp
        className={cn(buttonVariants({ variant: selectedVariant, className }))}
        ref={ref}
        disabled={disabled}
        {...props}
      >
        {IconComponent && iconPosition === "left" && (
          <IconWrapper
            Component={IconComponent}
            size={iconSize}
            color={iconColor}
            className="mr-1" // Add margin to the right of the icon
          />
        )}
        {children}
        {IconComponent && iconPosition === "right" && (
          <IconWrapper
            Component={IconComponent}
            size={iconSize}
            color={iconColor}
            className="ml-1" // Add margin to the left of the icon
          />
        )}
      </Comp>
    )
  }
)

MainButton.displayName = "MainButton"

export { MainButton }
