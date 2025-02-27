import React from "react"
import Image from "next/image"

interface CountryFlagProps {
  countryCode: string
  className?: string
}

export const CountryFlag: React.FC<CountryFlagProps> = ({
  countryCode,
  className = "",
}) => {
  // Using SVG instead of PNG for better quality
  const flagUrl = `https://flagcdn.com/${countryCode.toLowerCase()}.svg`

  return (
    <Image
      src={flagUrl}
      alt={`${countryCode} flag`}
      className={`h-4 w-6 rounded-sm object-cover ${className}`}
      loading="lazy"
      width={24}
      height={16}
    />
  )
}
