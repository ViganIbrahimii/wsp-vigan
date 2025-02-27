import { ReactNode } from "react"

import { cn } from "@/lib/utils"
import { fontHeadline } from "@/styles/typography"

export const MenuItem = ({
  isActive,
  children,
  onClick,
  className,
}: {
  isActive?: boolean
  children?: ReactNode
  onClick?: () => void
  className?: string
}) => {
  return (
    <div
      className={cn(
        "relative flex cursor-pointer items-center justify-center px-5 py-2 text-center",
        fontHeadline,
        "font-medium",
        {
          "rounded-t-5 bg-black-10 text-black-100 before:absolute before:-left-3 before:bottom-0 before:h-3 before:w-3 before:bg-left-angle before:content-[''] after:absolute after:-right-3 after:bottom-0 after:h-3 after:w-3 after:bg-right-angle after:content-['']":
            isActive,
          "ml-[12px] mr-[12px]": true, // Add invisible padding for angles
        },
        className
      )}
      onClick={onClick} // Attach onClick handler here
    >
      {children}
    </div>
  )
}
