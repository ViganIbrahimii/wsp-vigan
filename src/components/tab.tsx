import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/badge" // Adjust the import path as necessary
import { fontBodyNormal, fontCaptionBold } from "@/styles/typography"

const tabVariants = cva(
  "inline-flex items-center justify-center rounded-6 transition-colors h-[48px] relative w-fit px-6 text-black-100",
  {
    variants: {
      variant: {
        primary: `${fontBodyNormal} bg-white-60 `,
        secondary: `${fontCaptionBold} bg-transparent`,
      },
      isActive: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "primary",
        isActive: true,
        className: "bg-black-100 text-white-100",
      },
      {
        variant: "secondary",
        isActive: true,
        className: "bg-brand text-white-100",
      },
    ],
    defaultVariants: {
      variant: "primary",
      isActive: false,
    },
  }
)

export interface TabWithBadgeProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof tabVariants> {
  asChild?: boolean
  badgeCount?: number
  badgeClassName?: string
}

const Tab = React.forwardRef<HTMLButtonElement, TabWithBadgeProps>(
  (
    {
      className,
      asChild = false,
      badgeCount,
      badgeClassName,
      variant,
      isActive,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"

    const buttonClasses = cn(tabVariants({ variant, isActive }), className)

    const badgeClasses = cn(
      "absolute top-1 right-[-10px] inline-flex transform -translate-y-1/2"
    )

    return (
      <Comp className={buttonClasses} ref={ref} disabled={disabled} {...props}>
        {children}
        {typeof badgeCount === "number" && (
          <Badge
            count={badgeCount}
            className={cn(badgeClassName, badgeClasses)}
          />
        )}
      </Comp>
    )
  }
)

Tab.displayName = "Tab"

export { Tab }
