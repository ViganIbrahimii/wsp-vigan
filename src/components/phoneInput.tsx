import React, {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import Image from "next/image"
import {
  AsYouType,
  CountryCode,
  parsePhoneNumberWithError,
} from "libphonenumber-js"
import { ChevronDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { fontCaptionNormal } from "@/styles/typography"

import { CountryFlag } from "./CountryFlag"
import { countries, Country, CountryList } from "./CountryList"

interface PhoneInputProps {
  value: string
  dialCode?: string
  onChange: (value: string, country: Country) => void
  onBlur?: () => void
  className?: string
  placeholder?: string
  disabled?: boolean
  initialCountry?: string
  onValidationChange?: (isValid: boolean) => void
  selectedCountryCode?: string
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  dialCode,
  onChange,
  onBlur,
  onValidationChange,
  className = "",
  placeholder = "Phone Number",
  disabled = false,
  initialCountry = "US",
  selectedCountryCode,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<Country>(() => {
    if (selectedCountryCode) {
      return (
        countries.find((c) => c.code === selectedCountryCode) || countries[0]
      )
    }
    if (dialCode) {
      return (
        countries.find((c) => c.dialCode === dialCode) ||
        countries.find((c) => c.code === initialCountry) ||
        countries[0]
      )
    }
    return countries.find((c) => c.code === initialCountry) || countries[0]
  })

  useEffect(() => {
    if (selectedCountryCode) {
      const country = countries.find((c) => c.code === selectedCountryCode)
      if (country) {
        setSelectedCountry(country)
      }
    }
  }, [selectedCountryCode])

  const useClickOutside = (
    ref: RefObject<HTMLElement>,
    handler: () => void
  ) => {
    const handleClickOutside = useCallback(
      (event: MouseEvent) => {
        if (
          ref.current &&
          !ref.current.contains(event.target as Node) &&
          !(event.target as HTMLElement).closest("button")
        ) {
          handler()
        }
      },
      [handler, ref]
    )

    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [handleClickOutside])
  }

  const useCountrySearch = (countries: Country[]) => {
    const [searchQuery, setSearchQuery] = useState("")

    const filteredCountries = useMemo(
      () =>
        countries.filter(
          (country) =>
            country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            country.dialCode.includes(searchQuery)
        ),
      [countries, searchQuery]
    )

    return {
      searchQuery,
      setSearchQuery,
      filteredCountries,
    }
  }

  const dropdownRef = useRef<HTMLDivElement>(null)
  const { searchQuery, setSearchQuery, filteredCountries } = useCountrySearch([
    ...countries,
  ])

  useClickOutside(dropdownRef, () => setIsOpen(false))

  const stripDialCode = (phoneNumber: string, dialCode: string): string => {
    return phoneNumber.replace(dialCode, "")
  }

  const formatPhoneNumber = (phoneNumber: string, dialCode: string): string => {
    const formatter = new AsYouType(selectedCountry.code as CountryCode)
    const formatted = formatter.input(dialCode + phoneNumber)
    return formatted
  }

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country)
    setIsOpen(false)

    if (value) {
      const formattedValue = formatPhoneNumber(value, country.dialCode)
      try {
        const parsedNumber = parsePhoneNumberWithError(
          formattedValue,
          country.code as CountryCode
        )
        const isValid = parsedNumber.isValid()
        setError(isValid ? null : "Invalid phone number")
        onValidationChange?.(isValid)
      } catch (err) {
        setError("Invalid phone number")
        onValidationChange?.(false)
      }
    }

    onChange(value, country)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneNumber = stripDialCode(
      e.target.value,
      selectedCountry.dialCode
    ).replace(/\s+/g, "")
    const formattedValue = formatPhoneNumber(
      phoneNumber,
      selectedCountry.dialCode
    )

    try {
      const parsedNumber = parsePhoneNumberWithError(
        formattedValue,
        selectedCountry.code as CountryCode
      )
      const isValid = parsedNumber.isValid()
      setError(isValid ? null : "Invalid phone number")
      onValidationChange?.(isValid)
    } catch (err) {
      setError("Invalid phone number")
      onValidationChange?.(false)
    }

    onChange(phoneNumber, selectedCountry)
  }

  const inputId = React.useId()

  return (
    <div className="relative w-full text-caption-bold">
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 flex items-center justify-center">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (!disabled) {
                setIsOpen((prev) => !prev)
              }
            }}
            className={`relative flex h-full w-[116px] items-center rounded-6 bg-black-5 px-3
              ${disabled ? "cursor-not-allowed opacity-75" : "hover:bg-gray-100"}`}
            disabled={disabled}
          >
            <div className="flex items-center space-x-2">
              <CountryFlag countryCode={selectedCountry.code} />
              <span className="font-medium text-gray-600">
                {selectedCountry.dialCode}
              </span>
            </div>
            <ChevronDown className="absolute right-3 h-4 w-4 text-gray-400" />
          </button>
        </div>

        <input
          id={inputId}
          type="tel"
          value={stripDialCode(value, selectedCountry.dialCode)}
          onChange={handlePhoneChange}
          onBlur={() => {
            onBlur?.()
          }}
          disabled={disabled}
          className={cn(
            "peer block w-full appearance-none border border-black-10 bg-white-60 px-2.5 pb-2.5 pt-6 focus:outline-none",
            "h-[48px] rounded-6 text-black-100 placeholder-transparent focus:border-black-10",
            "pl-32",
            disabled ? "cursor-not-allowed bg-gray-50" : ""
          )}
          placeholder=""
        />
        <label
          htmlFor={inputId}
          className={cn(
            "absolute left-32 top-2 cursor-text text-black-60 transition-all",
            "peer-placeholder-shown:text-body-normal",
            "text-black-60 peer-placeholder-shown:top-3 peer-focus:top-2 peer-focus:text-caption-normal"
          )}
        >
          {placeholder}
        </label>

        {value && !disabled && (
          <div
            className="absolute inset-y-0 right-4 flex cursor-pointer items-center"
            onClick={() => onChange("", selectedCountry)}
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </div>
        )}
      </div>

      {error && (
        // <p className="mt-1 text-sm text-red-500">{error}</p>
        <div
          className={cn(
            "flex items-center gap-2 px-2 pt-2 text-[14px]  text-semantic-red",
            fontCaptionNormal
          )}
        >
          <Image src="/login-alert.svg" width={16} height={16} alt="alert" />
          <span>{error}</span>
        </div>
      )}

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-1 w-full overflow-hidden rounded-5 border border-black-10 bg-white-100 shadow-lg"
        >
          <div className="sticky top-0 z-10 border-b border-black-10 bg-white p-2">
            <input
              type="text"
              placeholder="Search countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-black-10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="masonry-scroll-container h-[240px] overflow-y-auto">
            <CountryList
              countries={filteredCountries}
              onSelect={handleCountrySelect}
            />
          </div>
        </div>
      )}
    </div>
  )
}
