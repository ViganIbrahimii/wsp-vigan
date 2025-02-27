import React, { useCallback, useEffect, useRef, useState } from "react"
import { CloseIcon, SearchIcon } from "@/icons"

import { cn } from "@/lib/utils"
import IconWrapper from "@/components/iconWrapper"
import { fontBodyNormal } from "@/styles/typography"
import { debounce } from "lodash"

interface SearchResult {
  id: string
  label1: string
  label2?: string
}

interface SearchInputWithDropdownProps {
  query: string
  setQuery: (value: string) => void
  results: SearchResult[]
  onResultSelect: (id: string) => void
  autoComplete?: boolean
  placeholder?: string
  icon?: React.FC<React.SVGProps<SVGSVGElement>>
}

const SearchInputWithDropdown: React.FC<SearchInputWithDropdownProps> = ({
  query,
  setQuery,
  results,
  onResultSelect,
  placeholder = "Search...",
  icon = SearchIcon,
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputId = React.useId()
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>(results)

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setIsFocused(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleFocus = () => {
    setIsFocused(true)
    setIsOpen(true)
  }

  const handleResultClick = (result: SearchResult) => {
    onResultSelect(result.id)
    setQuery(result.label1)
    setIsOpen(false)
  }

  const handleClear = () => {
    setQuery("")
    setIsOpen(false)
  }

  const debouncedFilterResults = useCallback(
    debounce((query: string): void => {
      if(query) {
        const filtered = results.filter((result) =>
          result.label1.toLowerCase().startsWith(query.toLowerCase())
        )
        setFilteredResults(filtered)
      } else {
        setFilteredResults(results)
      }
    }, 300),
    [results]
  );

  useEffect(() => {
    return () => {
      debouncedFilterResults.cancel();
    };
  }, [debouncedFilterResults]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    setQuery(value)
    setIsOpen(true)
    debouncedFilterResults(value)
  }

  return (
    <div ref={containerRef} className="relative w-full text-caption-bold">
      <div className="relative flex items-center">
        <div className="absolute flex items-center justify-center">
          <div className="rounded-full bg-black-5 p-3">
            <IconWrapper Component={icon} size="24" color="black100" />
          </div>
        </div>
        <input
          id={inputId}
          type="text"
          className={cn(
            "peer block w-full appearance-none border border-black-10 bg-white-60 px-2.5 pb-2.5 pt-6 focus:outline-none",
            "h-[48px] rounded-6 text-black-100 placeholder-transparent focus:border-black-10",
            "pl-14"
          )}
          placeholder=""
          value={query}
          onChange={(e) => handleChange(e)}
          onFocus={handleFocus}
          autoComplete="cc-csc"
        />
        <label
          htmlFor={inputId}
          className={cn(
            "absolute left-14 top-2 cursor-text text-black-60 transition-all",
            "peer-placeholder-shown:text-body-normal",
            "text-black-60 peer-placeholder-shown:top-3 peer-focus:top-2 peer-focus:text-caption-normal"
          )}
        >
          {placeholder}
        </label>
        {query && (
          <div
            className="absolute inset-y-0 right-4 flex cursor-pointer items-center"
            onClick={handleClear}
          >
            <IconWrapper Component={CloseIcon} size="20" color="black100" />
          </div>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && query && filteredResults.length > 0 && (
        <ul className="absolute left-0 right-0 top-[52px] z-50 h-[250px] w-full overflow-y-auto rounded-5 border border-black-10 bg-white-100 py-1 shadow-lg">
          {filteredResults.map((result, index) => (
            <React.Fragment key={result.id}>
              <li
                className={cn(
                  "cursor-pointer px-4 py-3 hover:bg-black-5 hover:text-brand"
                )}
                onClick={() => handleResultClick(result)}
              >
                <div className="flex flex-col">
                  <span className={cn("text-black-100", fontBodyNormal)}>
                    {result.label1}
                  </span>
                  {result.label2 && (
                    <span className={cn("text-black-60", "text-sm")}>
                      {result.label2}
                    </span>
                  )}
                </div>
              </li>
              {index < results.length - 1 && (
                <div className="border-t border-black-10" />
              )}
            </React.Fragment>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SearchInputWithDropdown
