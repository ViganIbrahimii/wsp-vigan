import * as React from "react"
import { ErrorIcon, SuccessIcon, WarningIcon } from "@/icons" // Adjust the import path as needed

import { cn } from "@/lib/utils"
import IconWrapper from "@/components/iconWrapper" // Adjust the import path as needed

import { fontCaptionNormal } from "@/styles/typography" // Import the custom font styles

export interface HelperTextProps {
  type: "error" | "warning" | "success"
  message: string
}

const HelperText: React.FC<HelperTextProps> = ({ type, message }) => {
  const getIcon = () => {
    switch (type) {
      case "error":
        return <IconWrapper Component={ErrorIcon} size={"16"} color="red100" />
      case "warning":
        return (
          <IconWrapper Component={WarningIcon} size={"16"} color="yellow100" />
        )
      case "success":
        return (
          <IconWrapper Component={SuccessIcon} size={"16"} color="green100" />
        )
      default:
        return null
    }
  }

  const getColorClass = () => {
    switch (type) {
      case "error":
        return "text-semantic-red"
      case "warning":
        return "text-semantic-yellow"
      case "success":
        return "text-semantic-green"
      default:
        return ""
    }
  }

  return (
    <div className={cn("flex items-center gap-1", getColorClass())}>
      {getIcon()}
      <span className={cn(fontCaptionNormal)}>{message}</span>
    </div>
  )
}

export { HelperText }
