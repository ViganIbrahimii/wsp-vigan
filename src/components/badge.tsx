import React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { fontCaptionBold } from "@/styles/typography"

const badgeVariants = cva(
  `inline-flex items-center justify-center ${fontCaptionBold} rounded-full`,
  {
    variants: {
      variant: {
        white: "bg-white-100 text-black-100",
        black: "bg-black-100 text-white-100",
        red: "bg-semantic-red-100 text-white-100",
      },
      size: {
        small: "h-[16px] min-w-[16px] px-1",
        large: "h-[32px] min-w-[32px] px-2",
      },
    },
    defaultVariants: {
      variant: "white",
      size: "large",
    },
  }
)

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  count: number
  className?: string
}

const Badge: React.FC<BadgeProps> = ({ count, className, variant, size }) => {
  const badgeClasses = cn(badgeVariants({ variant, size }), className)

  return <span className={badgeClasses}>{count}</span>
}

export { Badge }
