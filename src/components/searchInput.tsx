// components/SearchInput.tsx
import React, { useState } from "react"
import { SearchIcon } from "@/icons"

import { cn } from "@/lib/utils"
import IconWrapper from "@/components/iconWrapper"
import { Input } from "@/components/input"

interface SearchInputProps {
  query: string
  setQuery: (value: string) => void
  autoComplete?: boolean
  onFocusChange?: (focused: boolean) => void
  className?: string
  width?: string
  alwaysOpen?: boolean
}

const SearchInput: React.FC<SearchInputProps> = ({
  query,
  setQuery,
  autoComplete = true,
  onFocusChange,
  className,
  width = "w-64",
  alwaysOpen = false,
}) => {
  const [isFocused, setIsFocused] = useState(false)

  const isExpanded = alwaysOpen || query || isFocused

  const handleFocus = (focused: boolean) => {
    setIsFocused(focused)
    if (onFocusChange) onFocusChange(focused) // Notify parent
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-full transition-all duration-500 ease-in-out",
        isExpanded ? width : "w-[48px]"
      )}
    >
      <Input
        placeholder={isFocused || isExpanded ? "Search..." : ""}
        value={query}
        {...(!autoComplete && { autoComplete: "cc-csc" })}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => handleFocus(true)}
        onBlur={() => handleFocus(false)}
        onClear={() => setQuery("")}
        className={cn(
          isExpanded
            ? "pl-4 pr-1"
            : "cursor-pointer bg-transparent pl-0 pr-0 text-center"
        )}
      />
      {!isExpanded && (
        <div className="pointer-events-none absolute inset-y-0 flex w-full  items-center justify-center">
          <IconWrapper Component={SearchIcon} size={"24"} color={"black100"} />
        </div>
      )}
    </div>
  )
}

export default SearchInput
