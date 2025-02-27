export const locales = ["en", "hi", "sq", "ar"] as const

export const localeNames: Record<Locale, string> = {
  en: "English",
  sq: "Albanian",
  hi: "Hindi",
  ar: "Arabic",
} as const

export type Locale = (typeof locales)[number]
