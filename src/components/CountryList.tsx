import React from "react"
import { countries as countriesList } from "countries-list"

import { CountryFlag } from "@/components/CountryFlag"

export interface Country {
  code: string
  name: string
  dialCode: string
}

const SPECIAL_DIAL_CODES = {
  XK: "+383",
  DO: "+1",
  PR: "+1",
} as const

// Transform the countries object into an array with our desired structure
export const countries = Object.entries(countriesList)
  .map(([code, country]) => ({
    code: code,
    name: country.name,
    dialCode:
      (SPECIAL_DIAL_CODES as Record<string, string>)[code] ||
      `+${country.phone}`,
  }))
  .sort((a, b) => a.name.localeCompare(b.name))

interface CountryListProps {
  countries: Country[]
  onSelect: (country: Country) => void
}

export const CountryList: React.FC<CountryListProps> = ({
  countries,
  onSelect,
}) => (
  <div className="py-1">
    {countries.map((country) => (
      <button
        key={country.code}
        onClick={() => onSelect(country)}
        className="flex w-full items-center space-x-3 px-4 py-2 text-left hover:bg-gray-100"
      >
        <CountryFlag countryCode={country.code} />
        <span className="flex-1">{country.name}</span>
        <span className="text-gray-500">{country.dialCode}</span>
      </button>
    ))}
  </div>
)
