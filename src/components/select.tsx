import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { ChevronDownIcon, FilterListIcon } from "@/icons"

import { cn } from "@/lib/utils"
import IconWrapper from "@/components/iconWrapper"
import {
  fontBodyBold,
  fontBodyNormal,
  fontCaptionBold,
  fontCaptionNormal,
} from "@/styles/typography"

import { IconButton } from "./iconButton"

// Use a generic type T for value
export interface CustomSelectProps<T> {
  options: { value: T; label: string }[]
  sortByText: string
  menuPosition?: "left" | "right"
  smallScreenMenuPosition?: "left" | "right"
  width?: string
  onOptionSelect: (option: { value: T; label: string }) => void
  selectWidth?: string
  defaultValue?: { value: T; label: string }
  menuWidth?: string
  showIconOnMobile?: boolean // New prop
  truncateLength?: number
}

const CustomSelect = <T,>({
  options,
  sortByText,
  menuPosition = "left",
  smallScreenMenuPosition,
  onOptionSelect,
  selectWidth,
  defaultValue,
  menuWidth = "min-w-[250px]",
  showIconOnMobile = false, // Default to keeping the full select UI
  truncateLength,
}: CustomSelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState<{
    value: T
    label: string
  } | null>(defaultValue || null)

  useEffect(() => {
    if (defaultValue) {
      setSelectedOption(defaultValue)
    }
  }, [defaultValue])

  const toggleDropdown = () => setIsOpen(!isOpen)
  const handleOptionClick = (option: { value: T; label: string }) => {
    setSelectedOption(option)
    setIsOpen(false)
    onOptionSelect(option) // Invoke callback with the selected option
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
    <div
      className={cn(
        "relative z-40 inline-block",
        showIconOnMobile ? selectWidth : selectWidth ? `${selectWidth}` : "w-40"
      )}
      ref={selectRef}
    >
      {/* Conditionally show IconButton on small screens if enabled */}
      {showIconOnMobile && (
        <IconButton
          variant="primaryOutline"
          size="large"
          icon={FilterListIcon}
          iconSize="24"
          onClick={toggleDropdown}
          className="flex lg:hidden" // Show icon on small screens, hide on lg+
        />
      )}

      {/* Full select UI: Hidden on small screens if `showIconOnMobile` is true */}
      <div
        className={cn(
          showIconOnMobile ? "hidden lg:flex" : "flex", // Hide if icon mode is enabled
          "h-[48px] cursor-pointer items-center justify-between rounded-6 border border-black-10 bg-white-60 px-4"
        )}
        onClick={toggleDropdown}
      >
        <div className="flex items-center">
          <span>
            {selectedOption ? (
              <div className="flex flex-col">
                <span className={cn("text-black-60", fontCaptionNormal)}>
                  {sortByText}
                </span>
                <span className={cn("text-black-100", fontCaptionBold)}>
                  {truncateLength &&
                  selectedOption.label.length > truncateLength
                    ? `${selectedOption.label.substring(0, truncateLength)}...`
                    : selectedOption.label}
                </span>
              </div>
            ) : (
              sortByText
            )}
          </span>
        </div>
        <IconWrapper Component={ChevronDownIcon} size="20" />
      </div>

      {/* Dropdown menu (same for both layouts) */}
      {isOpen && (
        <ul
          className={cn(
            "absolute mt-1 w-auto min-w-[250px] rounded-5 border border-black-10 bg-white-100 text-black-60",
            smallScreenMenuPosition === "left"
              ? "left-auto right-0"
              : "left-0 right-auto",
            menuPosition === "left"
              ? "md:left-auto md:right-0"
              : "md:left-0 md:right-auto",
            "z-50",
            menuWidth
          )}
        >
          {options.map((option) => (
            <li
              key={option.value as React.Key}
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

export { CustomSelect }
