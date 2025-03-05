import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { ChevronDownIcon } from "@/icons"

import { cn } from "@/lib/utils"
import IconWrapper from "@/components/iconWrapper"
import {
  fontBodyBold,
  fontBodyNormal,
  fontCaptionBold,
  fontCaptionNormal,
} from "@/styles/typography"

// Use a generic type T for value
export interface CustomImageSelectProps<T> {
  options: { value: T; label: string }[]
  sortByText: string
  menuPosition?: "left" | "right"
  icon?: React.FC<React.SVGProps<SVGSVGElement>>
  selectedItem?: { value: T; label: string }
  onOptionSelect: (option: { value: T; label: string }) => void
}

const CustomImageSelect = <T,>({
  options,
  sortByText,
  menuPosition = "left",
  icon,
  selectedItem,
  onOptionSelect,
}: CustomImageSelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState<{
    value: T
    label: string
  } | null>(null)

  useEffect(() => {
    setSelectedOption(selectedItem ?? null)
  }, [selectedItem])
  const toggleDropdown = () => setIsOpen(!isOpen)
  const handleOptionClick = (option: { value: T; label: string }) => {
    setSelectedOption(option)
    setIsOpen(false)
    onOptionSelect(option) // Invoke the callback with the selected option
  }

  const selectRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = (event: MouseEvent) => {
    if (
      selectRef.current &&
      !selectRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative z-50 inline-block w-full" ref={selectRef}>
      <div
        className={cn(
          "flex h-[48px] cursor-pointer items-center justify-between rounded-6 border border-black-10 bg-white-60 pr-4",
          !icon ? "pl-4" : ""
        )}
        onClick={toggleDropdown}
      >
        {icon &&
          <div className="flex items-center justify-center bg-gray-100 h-[46px] min-w-[46px] rounded-full mr-2">
            <IconWrapper Component={icon} size={"20"} />
          </div>
        }
        <div className="flex flex-row w-full items-center">
          <span className="">
            {selectedOption ? (
              <div className="flex flex-col">
                <span className={cn("text-black-60", fontCaptionNormal)}>
                  {sortByText}
                </span>

                <span className={cn("text-black-100", fontCaptionBold)}>
                  {selectedOption.label}
                </span>
              </div>
            ) : (
              sortByText
            )}
          </span>
        </div>
        <IconWrapper Component={ChevronDownIcon} size="20" />
      </div>
      {isOpen && (
        <ul
          className={cn(
            "absolute mt-1 w-full min-w-[250px] max-h-[400px] overflow-auto rounded-5 border border-black-10 bg-white-100 text-black-60",
            menuPosition === "left" ? "right-0" : "left-0"
          )}
        >
          {options.map((option, index) => (
            <li
              key={`option-${index}-${option.label}-${option.value}` as React.Key} // Ensure key is valid for any type T
              className={cn(
                "cursor-pointer px-4 py-3 hover:text-brand",
                selectedOption?.value === option.value
                  ? fontBodyBold
                  : fontBodyNormal,
                selectedOption?.value === option.value && "text-brand",
                "border-b border-black-10"
              )}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export { CustomImageSelect }
