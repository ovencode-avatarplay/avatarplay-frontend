export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'ko', 'ar'],
  langDirection: {
    en: 'ltr',
    ko: 'ltr',
    ar: 'rtl'
  }
} as const

export type Locale = (typeof i18n)['locales'][number]
