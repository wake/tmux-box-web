import en from '../locales/en.json'
import zhTW from '../locales/zh-TW.json'

const locales: Record<string, Record<string, string>> = { en, 'zh-TW': zhTW }

export type Locale = 'en' | 'zh-TW'
export const DEFAULT_LOCALE: Locale = 'en'
export const LOCALES: Locale[] = ['en', 'zh-TW']

export function t(key: string, locale: Locale = DEFAULT_LOCALE): string {
  return locales[locale]?.[key] ?? locales.en[key] ?? key
}

export function getAllTranslations(): Record<Locale, Record<string, string>> {
  return locales as Record<Locale, Record<string, string>>
}
