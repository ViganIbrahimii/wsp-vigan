import React from "react"
import { cva, VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const iconVariants = cva("", {
  variants: {
    size: {
      "24": "w-6 h-6",
      "20": "w-5 h-5",
      "16": "w-4 h-4",
    },
    color: {
      black100: "text-icon-black-100",
      black40: "text-icon-black-40",
      white100: "text-icon-white-100",
      red100: "text-semantic-red",
      green100: "text-semantic-green",
      yellow100: "text-semantic-yellow",
    },
  },
  defaultVariants: {
    size: "24",
    color: "black100",
  },
})

interface IconProps extends VariantProps<typeof iconVariants> {
  Component: React.FC<React.SVGProps<SVGSVGElement>>
  className?: string
}

const Icon: React.FC<IconProps> = ({
  Component,
  size,
  color,
  className,
  ...props
}) => {
  return (
    <Component
      {...props}
      className={cn(iconVariants({ size, color }), className)}
    />
  )
}

export default Icon
