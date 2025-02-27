import { Locale, localeNames, locales } from "@/i18n.config"

export const languages: { value: Locale; title: string }[] = locales.map(
  (locale) => ({
    value: locale,
    title: localeNames[locale],
  })
)
