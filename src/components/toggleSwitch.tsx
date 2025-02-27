import React from "react"

import { cn } from "@/lib/utils"
import { fontBodyNormal } from "@/styles/typography"

interface ToggleSwitchProps {
  label: string
  checked?: boolean
  onChange: (checked: boolean) => void
  labelPosition?: "left" | "right" // New prop for controlling label position
  labelClassName?: string // Custom className for the label
  toggleContainerClassname?: string
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  checked = false,
  onChange,
  labelPosition = "left", // Default position
  labelClassName, // Custom className
  toggleContainerClassname,
}) => {
  const handleToggle = () => {
    onChange(!checked)
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2",
        labelPosition === "left" ? "flex-row" : "flex-row-reverse",
        toggleContainerClassname
      )}
    >
      <label
        htmlFor={`toggle-${label}`}
        className={cn(
          fontBodyNormal, // Default class
          "cursor-pointer text-black-100",
          labelClassName
        )}
      >
        {label}
      </label>
      <div
        className="relative inline-block h-[31px] w-[51px] cursor-pointer"
        role="switch"
        aria-checked={checked}
        onClick={handleToggle}
      >
        <input
          id={`toggle-${label}`}
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div
          className={`block h-[31px] w-full rounded-full transition-colors duration-300 ease-in-out ${
            checked ? "bg-checked-green" : "bg-unchecked-grey"
          }`}
        ></div>
        <div
          className={`absolute left-[2px] top-[2px] h-[27px] w-[27px] transform rounded-full bg-white-100 transition-transform duration-300 ease-in-out ${
            checked ? "translate-x-[20px]" : ""
          } shadow-[0px_3px_1px_0px_#0000000F,0px_3px_8px_0px_#00000026]`}
        ></div>
      </div>
    </div>
  )
}

export default ToggleSwitch
