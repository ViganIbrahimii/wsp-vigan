"use client"

import { languages } from "@/constants/languages"
import { Locale } from "@/i18n.config"
import { usePathname, useRouter } from "@/i18n/routing"
import { useLocale } from "next-intl"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function LocaleSelector() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  const handleLocaleChange = (newLocale: Locale) => {
    router.push(pathname, { locale: newLocale })
  }

  return (
    <Select onValueChange={handleLocaleChange} defaultValue={locale}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Language" />
      </SelectTrigger>
      <SelectContent>
        {languages.map(({ value, title }) => (
          <SelectItem key={value} value={value}>
            {title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
